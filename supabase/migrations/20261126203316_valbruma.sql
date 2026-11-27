-- Valbruma v1. Las tablas internas solo se modifican mediante comandos de dominio.
create schema tcards;
revoke all on schema tcards from public, anon, authenticated;
alter default privileges in schema tcards revoke execute on functions from public;
create table tcards.worlds (id text primary key, title text not null);
insert into tcards.worlds values ('valbruma','Valbruma');
create table tcards.content (version int primary key, definition jsonb not null);
create table tcards.members (
  actor uuid references auth.users primary key, world text not null references tcards.worlds,
  joined_at timestamptz not null default now()
);
create table tcards.operators (actor uuid references auth.users primary key, role text not null check(role in ('observer','operator')), expires_at timestamptz not null default 'infinity', world text not null references tcards.worlds);
create table tcards.invitations (
  code uuid primary key default gen_random_uuid(), world text not null references tcards.worlds,
  expires_at timestamptz not null default now()+interval '7 days', used_by uuid references auth.users
);
create table tcards.characters (
  id uuid primary key default gen_random_uuid(), actor uuid not null references tcards.members,
  name text not null check(length(name) between 2 and 32), race text not null check(race in ('human','elf')),
  vocation text not null check(vocation in ('scout','warden')),
  version int not null default 1 references tcards.content,
  revision int not null default 0, state jsonb not null, note text not null default 'Llegas a Valbruma.',
  expedition uuid
);
create index on tcards.characters(actor);
create table tcards.expeditions (
  id uuid primary key default gen_random_uuid(), code uuid unique not null default gen_random_uuid(),
  host uuid not null references tcards.characters, guest uuid references tcards.characters,
  phase text not null default 'waiting' check(phase in ('waiting','active','won','lost','closed')),
  turn uuid not null references tcards.characters, revision int not null default 0,
  foe int not null default 9, vitality int not null default 8, guarded boolean not null default false,
  note text not null default 'Esperando al segundo viajero.', version int not null default 1 references tcards.content
);
alter table tcards.characters add foreign key(expedition) references tcards.expeditions;
create table tcards.receipts (
  actor uuid not null references auth.users, command_id uuid not null, op text not null,
  request jsonb not null, result jsonb not null, primary key(actor,command_id)
);
create table tcards.events (
  seq bigint generated always as identity primary key, at timestamptz not null default now(),
  world text not null references tcards.worlds, actor uuid not null references auth.users,
  scope uuid, command_id uuid not null, action text not null, reason text,
  before_state jsonb, after_state jsonb, result text not null default 'confirmado'
);
create index on tcards.events(scope,seq desc);
-- Realtime transporta exclusivamente una notificación personal de invalidación.
create table public.tcards_signals (actor uuid primary key references auth.users, tick bigint not null);
alter table public.tcards_signals enable row level security;
revoke all on public.tcards_signals from public,anon,authenticated;
grant select on public.tcards_signals to authenticated;
create policy own_signal on public.tcards_signals for select to authenticated using (actor=(select auth.uid()));
alter publication supabase_realtime add table public.tcards_signals;
do $block$
declare t record;
begin
 for t in select tablename from pg_tables where schemaname='tcards' loop
   execute format('alter table tcards.%I enable row level security',t.tablename);
 end loop;
end $block$;

create function tcards.matches(s jsonb, conditions jsonb) returns boolean language sql immutable set search_path='' as $$
 select not exists (
   select from jsonb_each(coalesce(conditions,'{}')) c
   where not coalesce((case when c.key='space' then 3-(s->>'potions')::int-(s->>'blade')::int
                       else (s->>c.key)::int end) between (c.value->>0)::int and (c.value->>1)::int,false)
 )
$$;
create function tcards.choices(s jsonb, d jsonb) returns setof jsonb language sql immutable set search_path='' as $$
 select a from jsonb_array_elements((d->'cards'->(s->>'node')->'actions')||(d->'bag')) a
 where tcards.matches(s,a->'when')
$$;
create function tcards.effect(s jsonb, a jsonb) returns jsonb language plpgsql immutable set search_path='' as $$
declare item record;
begin
 if a->>'to'<>'same' then s=jsonb_set(s,'{node}',a->'to'); end if;
 for item in select * from jsonb_each_text(a->'add') loop
   s=jsonb_set(s,array[item.key],to_jsonb((s->>item.key)::int+item.value::int));
 end loop;
 return s||coalesce(a->'set','{}');
end $$;
create function tcards.sheet(c tcards.characters) returns jsonb language sql stable set search_path='' as $$
 select jsonb_build_object('id',c.id,'version',c.version,'revision',c.revision,'cardInstanceId',c.id||'/'||c.revision,
   'name',c.name,'race',c.race,'vocation',c.vocation,'state',c.state,'note',c.note,'expedition',c.expedition,
   'actions',(select coalesce(jsonb_agg(jsonb_build_object('id',a->>'id','slot',a->>'slot','label',a->>'label')),'[]') from tcards.choices(c.state,d.definition) a))
 from tcards.content d where d.version=c.version
$$;
create function tcards.room(e tcards.expeditions, viewer uuid) returns jsonb language sql stable set search_path='' as $$
 select (to_jsonb(e)-'code')||jsonb_build_object('code',case when viewer=e.host and e.phase='waiting' then e.code end,
 'hostName',(select name from tcards.characters where id=e.host),'guestName',(select name from tcards.characters where id=e.guest),
 'cardInstanceId',e.id||'/'||e.revision)
$$;

create function tcards.dispatch(op text,p jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare
 u uuid=auth.uid(); cmd uuid; target uuid; role_name text; realm text;
 c tcards.characters; e tcards.expeditions; invite tcards.invitations; receipt tcards.receipts;
 result jsonb; previous jsonb; current_state jsonb; definition jsonb; action jsonb; transition jsonb;
 label text=op; reason text; amount int; affected uuid[]; expected int;
begin
 if u is null then raise exception 'Inicia sesión' using errcode='42501'; end if;
 select world into realm from tcards.members where actor=u;
 select role into role_name from tcards.operators where actor=u and world='valbruma' and expires_at>now();
 if op='lobby' then
   return jsonb_build_object('world',realm,'role',role_name,'characters',(select coalesce(jsonb_agg(jsonb_build_object('id',id,'name',name,'race',race,'vocation',vocation) order by name,id),'[]') from tcards.characters where actor=u));
 end if;
 if op='inspect' then
   if role_name is null then raise exception 'Acceso restringido' using errcode='42501'; end if;
   return jsonb_build_object('role',role_name,'world','Valbruma',
     'members',(select count(*) from tcards.members where world='valbruma'),
     'characters',(select coalesce(jsonb_agg(to_jsonb(ch) order by ch.name),'[]') from tcards.characters ch join tcards.members m on m.actor=ch.actor where m.world='valbruma'),
     'rooms',(select coalesce(jsonb_agg(tcards.room(ex,null)),'[]') from tcards.expeditions ex join tcards.characters leader on leader.id=ex.host join tcards.members m on m.actor=leader.actor where m.world='valbruma'),
     'events',(select coalesce(jsonb_agg(to_jsonb(ev) order by ev.seq desc),'[]') from (select * from tcards.events where world='valbruma' order by seq desc limit 100) ev));
 end if;
 if op='read' then
   select * into c from tcards.characters where id=(p->>'scopeId')::uuid and actor=u;
   if c.id is null then raise exception 'Personaje no disponible' using errcode='42501'; end if;
   select * into e from tcards.expeditions where id=c.expedition and c.id in (host,guest);
   return jsonb_build_object('sheet',tcards.sheet(c),'room',case when e.id is not null then tcards.room(e,c.id) end);
 end if;
 if op not in ('admit','invite','create','act','open','join','turn','close','compensate') or op is null then raise exception 'Comando desconocido'; end if;
 cmd=(p->>'commandId')::uuid;
 if cmd is null then raise exception 'Falta el identificador del comando'; end if;
 if op in ('compensate','invite') and role_name is distinct from 'operator' then raise exception 'Permiso de operador requerido' using errcode='42501'; end if;
 perform pg_advisory_xact_lock(hashtextextended(u::text||cmd::text,0));
 select * into receipt from tcards.receipts where actor=u and command_id=cmd;
 if found then
   if receipt.op<>op or receipt.request<>p then raise exception 'Identificador reutilizado'; end if;
   return receipt.result;
 end if;
 if op='invite' then
   insert into tcards.invitations(world) values ('valbruma') returning * into invite;
   result=jsonb_build_object('code',invite.code,'expires',invite.expires_at);
 elsif op='admit' then
   if realm is not null then raise exception 'Ya eres miembro'; end if;
   update tcards.invitations set used_by=u where code=(p->>'code')::uuid and used_by is null and expires_at>now() returning * into invite;
   if not found then raise exception 'Invitación no válida'; end if;
   insert into tcards.members(actor,world) values (u,invite.world);
   result=jsonb_build_object('world',invite.world);
 elsif op='create' then
   if realm is null then raise exception 'Necesitas una invitación'; end if;
   insert into tcards.characters(actor,name,race,vocation,state) select u,trim(p->>'name'),p->>'race',p->>'vocation',d.definition->'initial' from tcards.content d where version=1 returning * into c;
   result=tcards.sheet(c);target=c.id;current_state=c.state;
 else
   select * into c from tcards.characters where id=(p->>'scopeId')::uuid and (actor=u or (op='compensate' and actor in (select m.actor from tcards.members m where m.world='valbruma'))) for update;
   if c.id is null then raise exception 'Personaje no disponible' using errcode='42501'; end if;
   target=c.id; affected=array[c.actor];previous=c.state;
   if op in ('turn','close') then
     select * into e from tcards.expeditions where id=c.expedition and c.id in (host,guest) for update;
     if e.id is null then raise exception 'Expedición no disponible'; end if;
     expected=e.revision;target=e.id;previous=tcards.room(e,null);
   else expected=c.revision; end if;
   if expected is distinct from (p->>'expectedRevision')::int or (target||'/'||expected) is distinct from (p->>'cardInstanceId') then
     raise exception 'La carta ha cambiado. Recupera el estado.' using errcode='PT409';
   end if;
   if op='compensate' then
     amount=(p->>'amount')::int;reason=trim(p->>'reason');
     if amount is null or amount not between 1 and 50 or reason is null or length(reason) not between 8 and 240 then raise exception 'Indica un motivo y entre 1 y 50 monedas'; end if;
     c.state=jsonb_set(c.state,'{gold}',to_jsonb((c.state->>'gold')::int+amount));c.note='El operador ha registrado una compensación.';
   elsif op in ('act','open','join') then
     if exists(select from tcards.expeditions where id=c.expedition and phase in ('active','waiting')) then raise exception 'Expedición en curso'; end if;
     if op='act' then
       select d.definition into definition from tcards.content d where version=c.version;
       select a into action from tcards.choices(c.state,definition) a where a->>'id'=p->>'actionId';
       if action is null then raise exception 'Acción no disponible'; end if;
       c.state=tcards.effect(c.state,action);
       select a into transition from jsonb_array_elements(definition->'after') a where a->>'node'=c.state->>'node' and tcards.matches(c.state,a->'when') limit 1;
       if transition is not null then c.state=tcards.effect(c.state,transition); end if;
       c.state=jsonb_set(c.state,'{hp}',to_jsonb(greatest(1,least(10,(c.state->>'hp')::int))));
       c.note=coalesce(transition->>'note',action->>'note',action->>'label');label=action->>'id';
     else
       if c.state->>'node'<>'square' then raise exception 'Reúnete en la plaza'; end if;
       if op='open' then
         insert into tcards.expeditions(host,turn) values(c.id,c.id) returning * into e;
       else
         select * into e from tcards.expeditions where code=(p->>'code')::uuid and phase='waiting' for update;
         if e.id is null or exists(select from tcards.characters where id=e.host and actor=u) then raise exception 'Invitación de expedición no válida'; end if;
         update tcards.expeditions set guest=c.id,phase='active',revision=revision+1,note='El centinela del vado levanta el escudo.' where id=e.id returning * into e;
       end if;
       c.expedition=e.id;
     end if;
   elsif op='close' then
     if e.phase not in ('waiting','active') then raise exception 'La expedición ya terminó'; end if;
     e.phase='closed';e.note=c.name||' ha regresado a la plaza.';
   else
     if e.phase<>'active' or e.turn<>c.id then raise exception 'Espera tu turno'; end if;
     label=p->>'actionId';
     if label='strike' then
       e.foe=greatest(0,e.foe-case when e.guarded then 4 else 3 end);
       e.note=c.name||' golpea al centinela.';
       if e.foe>0 and not e.guarded then e.vitality=e.vitality-2;end if;
       e.guarded=false;
     elsif label='guard' and not e.guarded then
       e.guarded=true;e.note=c.name||' protege el siguiente ataque del grupo.';
     else raise exception 'Acción de turno no válida';end if;
     e.turn=case when e.turn=e.host then e.guest else e.host end;
     if e.foe=0 then e.phase='won';e.note='El centinela cede el paso. El vado vuelve a ser seguro.';
     elsif e.vitality<=0 then e.phase='lost';e.note='El grupo retrocede hasta la plaza.';end if;
   end if;
   if op in ('turn','close') then
     update tcards.expeditions set revision=revision+1,turn=e.turn,foe=e.foe,vitality=e.vitality,guarded=e.guarded,phase=e.phase,note=e.note where id=e.id returning * into e;
     current_state=tcards.room(e,null);
   else
     update tcards.characters set revision=revision+1,state=c.state,note=c.note,expedition=c.expedition where id=c.id returning * into c;
     current_state=c.state;
   end if;
   if e.id is not null then select array_agg(actor order by actor) into affected from tcards.characters where id in(e.host,e.guest); end if;
   result=jsonb_build_object('revision',coalesce(e.revision,c.revision));
 end if;
 insert into tcards.events(world,actor,scope,command_id,action,reason,before_state,after_state) values ('valbruma',u,target,cmd,label,reason,previous,current_state);
 insert into tcards.receipts(actor,command_id,op,request,result) values(u,cmd,op,p,result);
 insert into public.tcards_signals(actor,tick) select distinct id,1 from unnest(coalesce(affected,array[u])) id order by id
 on conflict(actor) do update set tick=tcards_signals.tick+1;
 return result;
end $$;

create function public.tcards(op text,p jsonb default '{}') returns jsonb language sql security invoker set search_path='' as $$
 select tcards.dispatch(op,p)
$$;
revoke all on all tables in schema tcards from public, anon, authenticated;
revoke all on all sequences in schema tcards from public, anon, authenticated;
revoke all on all functions in schema tcards from public, anon, authenticated;
revoke all on function public.tcards(text,jsonb) from public, anon, authenticated;
grant usage on schema tcards to authenticated;
grant execute on function tcards.dispatch(text,jsonb), public.tcards(text,jsonb) to authenticated;
