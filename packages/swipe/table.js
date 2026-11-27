// SCE v0.2.0 conserva el gesto y el feedback. El adaptador espera un snapshot confirmado.
import './sce/engine/model.js';
import './sce/engine/gestures.js';
import './sce/engine/player.js';
import './sce/engine/player.css';
const { el, Player, responseLayout, choiceStyle, symbols } = globalThis.SCE.player;
const keys = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
  a: 'farLeft',
  d: 'farRight',
};
const glyphs = { left: '‹', right: '›', farLeft: '«', farRight: '»', up: '↑', down: '↓' };

export function table(root, view, send, report) {
  const responses = Object.fromEntries(
    view.actions.filter((a) => a.slot !== 'bag').map((a) => [a.slot, a]),
  );
  const actions = Object.keys(responses);
  const layout = responseLayout(actions);
  const stage = el('div', 'sce-stage'),
    stack = el('div', 'sce-stack'),
    card = el('article', 'sce-card entering');
  card.dataset.instance = view.instance;
  stack.setAttribute('aria-hidden', 'true');
  stack.append(el('span', '', '✧'));
  const meta = el('div', 'sce-card-meta');
  meta.append(el('span', '', view.family), el('span', '', '✦'), el('span', '', 'VALBRUMA'));
  const art = el('img', 'illustration');
  art.src = '/art/' + view.art + '.svg';
  art.alt = '';
  art.draggable = false;
  const stamp = el('div', 'sce-stamp');
  stamp.setAttribute('aria-hidden', 'true');
  const sides = el('div', 'sce-sides');
  for (const slot of ['left', 'right'])
    sides.append(
      el('span', '', responses[slot] ? symbols[slot] + ' ' + responses[slot].label : ''),
    );
  card.append(meta, art, el('h2', 'card-title', view.title), el('p', 'card-body', view.body));
  if (view.stats) card.append(el('strong', 'combat-stats', view.stats));
  card.append(sides, stamp);
  stage.append(stack, card);
  const zone = el('div', 'sce-gesture-zone'),
    banner = el('div', 'sce-response-banner'),
    hint = el('strong', 'sce-hint', 'Arrastra la carta o utiliza los botones');
  banner.setAttribute('role', 'status');
  banner.append(el('span', '', '✦'), hint, el('span', '', '✦'));
  const row = el('div', 'sce-responses'),
    foot = el('div', 'sce-foot');
  row.style.setProperty('--sce-response-count', Math.max(1, layout.primary.length));
  for (const slot of [...layout.primary, ...layout.secondary]) {
    const style = choiceStyle(slot),
      button = el('button', 'sce-response ' + style.side + (style.strong ? ' strong' : ''));
    button.dataset.action = slot;
    button.dataset.id = responses[slot].id;
    button.setAttribute('aria-label', responses[slot].label);
    button.append(
      el('strong', 'sce-response-symbol', glyphs[slot]),
      el('small', 'sce-response-label', responses[slot].label),
    );
    button.onclick = () => choose(slot);
    (slot === 'down' ? foot : row).append(button);
  }
  zone.append(banner, row, foot);
  root.replaceChildren(stage, zone);
  let busy = false,
    disposed = false,
    animation;
  const feedback = { root, stamp, banner, hint, session: { actions, card: { responses } } };
  const preview = (k) => Player.prototype.preview.call(feedback, k);
  async function choose(k, dx = 0, dy = 0) {
    if (busy || !responses[k]) return;
    busy = true;
    preview(k);
    for (const b of root.querySelectorAll('button')) b.disabled = true;
    const from = getComputedStyle(card).transform;
    card.classList.remove('entering', 'dragging');
    const side = choiceStyle(k).side,
      dir = side === 'left' ? -1 : side === 'right' ? 1 : 0;
    const b = root.getBoundingClientRect(),
      deck = stage.getBoundingClientRect(),
      w = card.offsetWidth,
      h = card.offsetHeight;
    const left = deck.left + (deck.width - w) / 2,
      top = deck.top + (deck.height - h) / 2;
    const x =
      dir < 0 ? -Math.ceil(left + w - b.left + 48) : dir > 0 ? Math.ceil(b.right - left + 48) : 0;
    const y =
      k === 'up'
        ? -Math.ceil(top + h - b.top + 48)
        : k === 'down'
          ? Math.ceil(b.bottom - top + 48)
          : dy === 0
            ? -36
            : Math.max(-125, Math.min(125, dy));
    try {
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        animation = card.animate(
          [
            { transform: from === 'none' ? 'translate3d(0,0,0)' : from, opacity: 1 },
            {
              transform:
                'translate3d(' + x + 'px,' + y + 'px,0) rotate(' + dir * 17 + 'deg) scale(.96)',
              opacity: 0,
            },
          ],
          {
            duration: Math.round(Math.max(400, Math.min(650, 260 + Math.hypot(x, y) * 0.43))),
            easing: 'cubic-bezier(.32,.06,.65,.8)',
            fill: 'forwards',
          },
        );
        await animation.finished;
      }
      if (!disposed) await send(responses[k].id);
    } catch (e) {
      if (!disposed) report(e.message);
    } finally {
      if (!disposed) {
        animation?.cancel();
        card.style.transform = '';
        preview(null);
        busy = false;
        for (const b of root.querySelectorAll('button')) b.disabled = false;
      }
    }
  }
  const unbind = globalThis.SCE.gestures.bind(card, {
    allowed: () => actions,
    threshold: () => 150,
    onPreview: preview,
    onAnswer: choose,
    isBusy: () => busy,
  });
  function key(e) {
    if (!e.repeat && responses[keys[e.key]]) {
      e.preventDefault();
      choose(keys[e.key]);
    }
  }
  root.addEventListener('keydown', key);
  return () => {
    disposed = true;
    unbind();
    animation?.cancel();
    root.removeEventListener('keydown', key);
  };
}
