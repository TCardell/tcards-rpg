import './style.css';
import { region, start, resolve, restore, choices } from '../../packages/engine/world.ts';
import { table } from '../../packages/swipe/table.js';
import {
  el,
  button,
  input,
  select,
  authForm,
  db,
  rpc,
  command,
} from '../../packages/shared/client.js';

const root = document.querySelector('#app'),
  account = document.querySelector('#account'),
  status = document.querySelector('#status');
const saveKey = 'tcards.valbruma.local.v1',
  selectedKey = 'tcards.realms.character';
const quest = [
  'Habla con Ivo en la posada si buscas trabajo.',
  'Busca a Mara en el camino de los fresnos.',
  'Mara está a salvo. Lleva las noticias a Ivo.',
  'Encargo cumplido. Mara e Ivo vuelven a compartir mesa.',
];
const panels = ['Diario', 'Mochila', 'Mapa', 'Compañía', 'Ajustes'];
const types = { place: 'Lugar', npc: 'Personaje', item: 'Hallazgo', enemy: 'Encuentro' };
let sheet,
  room,
  user,
  mode,
  dispose,
  channel,
  poll,
  panel,
  screen,
  readTicket = 0,
  busy = false,
  dismissed = '',
  toastTimer;
document.documentElement.dataset.theme = localStorage.getItem('tcards.theme') ?? 'forest';
function report(message) {
  status.textContent = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (status.textContent = ''), 6500);
}
function safe(f) {
  return async (...args) => {
    try {
      await f(...args);
    } catch (e) {
      report(e.message);
    }
  };
}
function cleanup() {
  readTicket++;
  dispose?.();
  dispose = null;
  clearInterval(poll);
  if (channel) {
    db.removeChannel(channel);
    channel = null;
  }
}
function cover() {
  cleanup();
  screen = 'cover';
  mode = null;
  sheet = room = null;
  account.hidden = true;
  sessionStorage.removeItem('tcards.mode');
  const wrap = el('section', 'cover'),
    art = el('div', 'cover-art'),
    copy = el('div');
  copy.append(
    el('span', 'eyebrow', 'Crónicas de la frontera'),
    el('h1', '', 'Valbruma'),
    el(
      'p',
      '',
      'La última carreta no ha cruzado el puente. En la posada, alguien sigue esperando.',
    ),
  );
  art.append(copy);
  const box = el('section', 'cover-actions');
  box.append(
    el('h2', '', 'El viajero sin destino'),
    el('p', 'small', 'Una aventura de cartas en los confines del bosque.'),
    button(
      localStorage.getItem(saveKey) ? 'Continuar en solitario' : 'Jugar en solitario',
      safe(local),
      'primary',
    ),
    button('Entrar en Realms', safe(realms)),
    el(
      'p',
      'small',
      'Solitario guarda en este dispositivo. Realms guarda tus personajes y permite viajar en compañía.',
    ),
  );
  wrap.append(art, box);
  root.replaceChildren(wrap);
  return box;
}
account.onclick = safe(() => {
  if (!busy) cover();
});
function readLocal() {
  const raw = localStorage.getItem(saveKey);
  return raw ? restore(JSON.parse(raw)) : null;
}
function local() {
  sheet = readLocal() ?? start(crypto.randomUUID());
  localStorage.setItem(saveKey, JSON.stringify(sheet));
  mode = 'local';
  room = null;
  enter();
}
function onlineBox(title) {
  cleanup();
  screen = 'lobby';
  mode = 'online';
  account.hidden = false;
  const wrap = el('section', 'cover'),
    art = el('div', 'cover-art');
  art.append(el('h1', '', 'Realms'));
  const box = el('section', 'cover-actions');
  box.append(el('h2', '', title));
  wrap.append(art, box);
  root.replaceChildren(wrap);
  return box;
}
async function realms() {
  const box = onlineBox('Acceso a Valbruma');
  user = db ? (await db.auth.getUser()).data.user : null;
  if (!user) {
    authForm(box, realms);
    return;
  }
  const data = await rpc('lobby');
  box.append(
    button(
      'Cerrar sesión',
      safe(async () => {
        await db.auth.signOut();
        sessionStorage.removeItem(selectedKey);
        cover();
      }),
      'quiet',
    ),
  );
  if (!data.world) {
    const code = input('Invitación al mundo', 'text', { required: true });
    box.append(
      code.wrapper,
      button(
        'Canjear invitación',
        safe(async () => {
          await command('admit', { code: code.control.value.trim() });
          await realms();
        }),
        'primary',
      ),
    );
    return;
  }
  box.append(el('h3', '', 'Tus personajes'));
  for (const ch of data.characters)
    box.append(
      button(
        ch.name,
        safe(() => selectCharacter(ch.id)),
      ),
    );
  const form = el('form', 'form'),
    name = input('Nombre del personaje', 'text', { required: true, minLength: 2, maxLength: 32 }),
    race = select('Linaje', [
      ['human', 'Humano'],
      ['elf', 'Elfo'],
    ]),
    vocation = select('Oficio inicial', [
      ['scout', 'Explorador'],
      ['warden', 'Guardián'],
    ]);
  form.append(
    name.wrapper,
    race.wrapper,
    vocation.wrapper,
    el('button', 'primary', 'Crear personaje libre'),
  );
  box.append(form);
  form.onsubmit = safe(async (e) => {
    e.preventDefault();
    const submit = form.querySelector('button');
    submit.disabled = true;
    try {
      const ch = await command('create', {
        name: name.control.value.trim(),
        race: race.control.value,
        vocation: vocation.control.value,
      });
      await selectCharacter(ch.id);
    } finally {
      submit.disabled = false;
    }
  });
}
async function selectCharacter(id) {
  const data = await rpc('read', { scopeId: id });
  sheet = data.sheet;
  room = data.room;
  mode = 'online';
  sessionStorage.setItem(selectedKey, id);
  enter();
  channel = db
    .channel('tcards-' + user.id)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'tcards_signals', filter: 'actor=eq.' + user.id },
      () => safe(sync)(true),
    )
    .subscribe();
  // Recuperación de notificaciones perdidas, incluso si se suspende el websocket.
  poll = setInterval(() => {
    if (!document.hidden && !busy) safe(sync)(true);
  }, 12000);
}
async function sync(notify = false) {
  if (mode !== 'online' || screen !== 'play') return;
  const ticket = ++readTicket,
    old = sheet,
    oldRoom = room;
  const next = await rpc('read', { scopeId: old.id });
  if (ticket !== readTicket || screen !== 'play') return;
  sheet = next.sheet;
  room = next.room;
  if (
    sheet.revision !== old.revision ||
    room?.id !== oldRoom?.id ||
    room?.revision !== oldRoom?.revision
  ) {
    draw();
    if (notify) report('Estado actualizado desde el mundo.');
  }
}
function enter() {
  screen = 'play';
  sessionStorage.setItem('tcards.mode', mode);
  panel = matchMedia('(min-width:801px)').matches ? 'Diario' : null;
  account.hidden = false;
  draw();
}
const base = (s) => ({
  scopeId: sheet.id,
  expectedRevision: s.revision,
  cardInstanceId: s.cardInstanceId,
});
async function perform(actionId, captured, cooperative) {
  if (busy) return;
  busy = true;
  try {
    if (mode === 'local') {
      const commit = () => {
        const next = resolve(readLocal(), {
          ...captured,
          commandId: crypto.randomUUID(),
          actionId,
        });
        localStorage.setItem(saveKey, JSON.stringify(next));
        sheet = next;
      };
      if (navigator.locks) await navigator.locks.request(saveKey, commit);
      else commit();
      draw();
    } else {
      await command(cooperative ? 'turn' : 'act', { ...captured, actionId });
      await sync();
    }
  } catch (e) {
    if (mode === 'online') await sync();
    else {
      sheet = readLocal();
      draw();
    }
    throw e;
  } finally {
    busy = false;
  }
}
function inRoom() {
  return (
    !!room && (['waiting', 'active'].includes(room.phase) || dismissed !== room.cardInstanceId)
  );
}
function draw() {
  const focused = root.querySelector('.scene')?.contains(document.activeElement);
  dispose?.();
  const wrap = el('div', 'play'),
    rail = el('aside', 'rail'),
    scene = el('section', 'scene sce-player'),
    aside = el('aside', 'panel');
  scene.tabIndex = 0;
  scene.setAttribute('aria-label', 'Mesa de cartas');
  const s = sheet.state,
    c = region.cards[s.node],
    coop = inRoom(),
    land = el('img', 'landscape');
  land.src = '/art/' + (coop ? 'forest' : c.art) + '.svg';
  land.alt = '';
  rail.append(
    el('span', 'eyebrow', mode === 'online' ? 'Realms · Mundo privado' : 'Partida en solitario'),
    el('h1', '', sheet.name ?? 'Valbruma'),
    land,
  );
  const hud = el('div', 'hud');
  hud.append(el('span', '', '♥ ' + s.hp + '/10'), el('span', '', '◈ ' + s.gold + ' oro'));
  rail.append(hud);
  const nav = el('nav');
  nav.setAttribute('aria-label', 'Menú de aventura');
  for (const name of panels) {
    if (name === 'Compañía' && mode === 'local') continue;
    const b = button(name, () => {
      panel = panel === name ? null : name;
      refreshPanel();
    });
    b.dataset.panel = name;
    nav.append(b);
  }
  rail.append(
    nav,
    el('h3', '', 'Último suceso'),
    el('p', 'journal-note', room && coop ? room.note : sheet.note),
  );
  wrap.append(rail, scene, aside);
  root.replaceChildren(wrap);
  const actions = mode === 'local' ? choices(s) : sheet.actions;
  let view = {
    family: types[c.kind],
    title: c.title,
    body: c.body,
    art: c.art,
    actions,
    instance: sheet.cardInstanceId,
    stats:
      c.kind === 'enemy'
        ? 'Vida ' + s.foe + '/6 · Ataque 2 · Defensa 0' + (s.guard ? ' · Contraataque listo' : '')
        : '',
  };
  if (coop) {
    const myTurn = room.turn === sheet.id && room.phase === 'active';
    view = {
      family: 'Expedición cooperativa',
      title:
        {
          waiting: 'Reunión en el vado',
          won: 'El vado está libre',
          lost: 'Retirada del vado',
          closed: 'Regreso a Valbruma',
        }[room.phase] ?? 'Centinela del vado',
      body:
        room.note +
        (room.phase === 'active'
          ? ' Turno de ' + (room.turn === room.host ? room.hostName : room.guestName) + '.'
          : ''),
      instance: room.cardInstanceId,
      art: 'forest',
      stats: 'Grupo ' + room.vitality + '/8 · Enemigo ' + room.foe + '/9',
      actions: myTurn
        ? [
            { id: 'strike', slot: 'right', label: 'Atacar' },
            ...(room.guarded ? [] : [{ id: 'guard', slot: 'left', label: 'Proteger' }]),
          ]
        : [],
    };
  }
  const captured = base(coop ? room : sheet);
  dispose = table(scene, view, (id) => perform(id, captured, coop), report);
  if (!view.actions.length) {
    const zone = scene.querySelector('.sce-gesture-zone');
    zone.replaceChildren();
    if (['won', 'lost', 'closed'].includes(room?.phase))
      zone.append(
        button(
          'Volver a la aventura',
          () => {
            dismissed = room.cardInstanceId;
            draw();
          },
          'primary',
        ),
      );
    else
      zone.append(
        button(room?.phase === 'waiting' ? 'Ver invitación' : 'Ver compañía', () => {
          panel = 'Compañía';
          refreshPanel();
        }),
      );
  }
  refreshPanel();
  if (focused || !document.activeElement || document.activeElement === document.body)
    scene.focus({ preventScroll: true });
}
function refreshPanel() {
  const aside = root.querySelector('.panel');
  if (!aside) return;
  root
    .querySelectorAll('[data-panel]')
    .forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.panel === panel)));
  aside.hidden = !panel;
  aside.replaceChildren();
  if (!panel) return;
  const header = el('header');
  header.append(
    el('h2', '', panel),
    button(
      'Cerrar',
      () => {
        panel = null;
        refreshPanel();
        root.querySelector('.scene').focus({ preventScroll: true });
      },
      'quiet',
    ),
  );
  const box = el('div', 'panel-content'),
    s = sheet.state;
  aside.append(header, box);
  if (panel === 'Diario') {
    box.append(
      el('div', 'panel-label', 'Encargo de Valbruma'),
      el('h3', '', 'El correo del norte'),
      el('p', '', quest[s.quest]),
      el('p', 'entry', sheet.note),
    );
  }
  if (panel === 'Mochila') {
    box.append(
      el('div', 'panel-label', s.potions + s.blade + ' de 3 espacios'),
      el('p', 'entry', 'Tónico de hierbas × ' + s.potions + ' · Común'),
      el(
        'p',
        'entry',
        s.blade
          ? 'Hoja de caminante · Poco común' + (s.equipped ? ' · Equipada' : '')
          : 'Arma equipada · Ninguna',
      ),
    );
    if (!inRoom())
      for (const a of (mode === 'local' ? choices(s) : sheet.actions).filter(
        (a) => a.slot === 'bag',
      )) {
        const captured = base(sheet);
        box.append(
          button(
            a.label,
            safe(() => perform(a.id, captured, false)),
          ),
        );
      }
  }
  if (panel === 'Mapa') {
    box.append(
      el('div', 'panel-label', 'Región de Valbruma'),
      el('h3', '', region.cards[s.node].title),
      el('p', '', 'Plaza de las campanas'),
    );
    const list = el('ul');
    for (const t of [
      'Oeste · Posada y capilla',
      'Norte · Camino de los fresnos y puente',
      'Este · Mercado y muralla',
      'Sur · Pozo viejo',
    ])
      list.append(el('li', '', t));
    box.append(list);
  }
  if (panel === 'Compañía') {
    if (room && ['waiting', 'active'].includes(room.phase)) {
      box.append(
        el('h3', '', room.hostName + (room.guestName ? ' y ' + room.guestName : '')),
        el('p', '', room.note),
      );
      if (room.code) {
        const invite = input('Código para tu compañero', 'text', {
          value: room.code,
          readOnly: true,
        });
        box.append(invite.wrapper);
      }
      box.append(
        button(
          'Retirarse de la expedición',
          safe(() => roomCommand('close')),
        ),
      );
    } else if (s.node === 'square') {
      box.append(
        el(
          'p',
          '',
          'Dos viajeros de distintas cuentas pueden proteger juntos el vado desde esta plaza.',
        ),
        button(
          'Preparar expedición',
          safe(() => roomCommand('open')),
        ),
      );
      const code = input('Código de expedición');
      box.append(
        code.wrapper,
        button(
          'Unirse al compañero',
          safe(() => roomCommand('join', { code: code.control.value.trim() })),
        ),
      );
    } else box.append(el('p', '', 'Regresa a la plaza para reunirte con otro viajero.'));
  }
  if (panel === 'Ajustes') {
    const theme = select('Tema', [
      ['forest', 'Bosque y oro'],
      ['slate', 'Pizarra y plata'],
    ]);
    theme.control.value = document.documentElement.dataset.theme;
    theme.control.onchange = () => {
      document.documentElement.dataset.theme = theme.control.value;
      localStorage.setItem('tcards.theme', theme.control.value);
    };
    box.append(
      theme.wrapper,
      el('p', 'small', 'Flechas para elegir. A y D para un gesto horizontal intenso.'),
    );
    if (mode === 'local') {
      box.append(
        button('Exportar partida', () => {
          const a = el('a');
          const url = URL.createObjectURL(
            new Blob([JSON.stringify(sheet)], { type: 'application/json' }),
          );
          a.href = url;
          a.download = 'valbruma-partida.json';
          a.click();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        }),
      );
      const file = input('Restaurar copia local', 'file', { accept: 'application/json' });
      file.control.onchange = safe(async () => {
        const f = file.control.files[0];
        if (!f) return;
        if (f.size > 32000) throw Error('Archivo demasiado grande');
        const next = restore(JSON.parse(await f.text()));
        if (!confirm('¿Restaurar esta copia sobre la partida local?')) return;
        localStorage.setItem(saveKey, JSON.stringify(next));
        sheet = next;
        draw();
        report('Copia local restaurada.');
      });
      box.append(file.wrapper);
    } else box.append(button('Elegir otro personaje', safe(realms)));
  }
}
async function roomCommand(op, extra = {}) {
  if (busy) return;
  busy = true;
  try {
    await command(op, { ...base(op === 'close' ? room : sheet), ...extra });
    dismissed = '';
    await sync();
  } finally {
    busy = false;
  }
}
window.addEventListener(
  'storage',
  safe((e) => {
    if (e.key === saveKey && mode === 'local' && screen === 'play') {
      sheet = readLocal();
      draw();
      report('Partida actualizada en otra pestaña.');
    }
  }),
);
window.addEventListener(
  'online',
  safe(() => sync(true)),
);
document.addEventListener(
  'visibilitychange',
  safe(() => {
    if (!document.hidden) return sync(true);
  }),
);
db?.auth.onAuthStateChange((event) => {
  if (event === 'SIGNED_OUT' && mode === 'online') cover();
});
async function boot() {
  const saved = sessionStorage.getItem('tcards.mode');
  if (saved === 'local') {
    local();
    return;
  }
  if (saved === 'online' && db && sessionStorage.getItem(selectedKey)) {
    user = (await db.auth.getUser()).data.user;
    if (user) {
      await selectCharacter(sessionStorage.getItem(selectedKey));
      return;
    }
  }
  cover();
}
boot().catch((e) => {
  cover();
  report(e.message);
});
