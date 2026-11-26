import source from '../../content/valbruma.v1.json' with { type: 'json' };

export const slots = ['farLeft','left','up','right','farRight','down'] as const;
type Slot = typeof slots[number] | 'bag';
const fields = ['hp','gold','quest','foe','guard','blade','equipped','potions'] as const;
type Field = typeof fields[number];
type Values = Record<Field,number>;
export type State = Values & {node:string};
type Conditions = Partial<Record<Field|'space', [number,number]>>;
type Change = {to:string; when?:Conditions; set?:Partial<Values>; add?:Partial<Values>; note?:string};
export type Choice = Change & {slot:Slot; id:string; label:string};
type Card = {kind:'place'|'npc'|'enemy'|'item'; title:string; body:string; art:string; actions:Choice[]};
type Region = {version:number; initial:State; cards:Record<string,Card>; bag:Choice[]; after:(Change & {node:string})[]};
export const region = source as Region;
export type ActionIntent = {commandId:string; scopeId:string; expectedRevision:number; cardInstanceId:string; actionId:string};
export type GameSnapshot = {version:1; id:string; revision:number; cardInstanceId:string; state:State; note:string};

export function validateContent(r:Region) {
  if (r.version!==1 || !Object.hasOwn(r.cards,r.initial.node)) throw Error('Inicio desconocido');
  function check(change:Change) {
    if(change.to!=='same' && !Object.hasOwn(r.cards,change.to)) throw Error('Destino desconocido');
    for(const [k,range] of Object.entries(change.when??{})) {
      if(![...fields,'space'].includes(k) || range.length!==2 || !range.every(Number.isSafeInteger) || range[0]>range[1]) throw Error('Condición inválida');
    }
    for(const [key,n] of Object.entries({...change.add,...change.set})) {
      if(!fields.includes(key as Field) || !Number.isSafeInteger(n)) throw Error('Efecto inválido');
    }
  }
  for(const c of Object.values(r.cards)) {
    if(!c.title || !c.body || !c.actions.length || !['place','npc','enemy','item'].includes(c.kind)) throw Error('Carta incompleta');
    const choices = [...c.actions,...r.bag];
    const ids = new Set<string>();
    for(const [i,a] of choices.entries()) {
      check(a);
      if(!a.label || !a.id || ids.has(a.id) || ![...slots,'bag'].includes(a.slot)) throw Error('Acción inválida');
      ids.add(a.id);
      if(a.slot==='bag') continue;
      for(const b of choices.slice(0,i).filter(b=>b.slot===a.slot)) {
        const exclusive = Object.entries(a.when??{}).some(([k,[lo,hi]])=>{
          const other = b.when?.[k as keyof Conditions];
          return other && (hi<other[0] || lo>other[1]);
        });
        if(!exclusive) throw Error('Dos acciones comparten un gesto');
      }
    }
  }
  r.after.forEach(check);
}
validateContent(region);

export function matches(s:State, conditions:Conditions={}) {
  const values={...s,space:3-s.potions-s.blade};
  return Object.entries(conditions).every(([k,[min,max]])=>values[k as keyof Conditions]>=min && values[k as keyof Conditions]<=max);
}
export function choices(s:State) {
  return [...region.cards[s.node].actions,...region.bag].filter(a=>matches(s,a.when));
}
export function start(id:string):GameSnapshot {
  return {version:1,id,revision:0,cardInstanceId:id+'/0',state:{...region.initial},note:'Llegas a Valbruma. En la posada siempre hay noticias.'};
}
export function resolve(snapshot:GameSnapshot,intent:ActionIntent):GameSnapshot {
  if(!intent.commandId || intent.scopeId!==snapshot.id || intent.expectedRevision!==snapshot.revision || intent.cardInstanceId!==snapshot.cardInstanceId) throw Error('La carta ha cambiado. Recupera tu partida.');
  const action=choices(snapshot.state).find(a=>a.id===intent.actionId);
  if(!action) throw Error('Acción no disponible');
  const state={...snapshot.state};
  function apply(change:Change) {
    if(change.to!=='same') state.node=change.to;
    for(const [key,delta] of Object.entries(change.add??{})) state[key as Field]+=delta;
    Object.assign(state,change.set);
  }
  apply(action);
  const event=region.after.find(e=>e.node===state.node && matches(state,e.when));
  if(event) apply(event);
  state.hp=Math.max(1,Math.min(10,state.hp));
  const revision=snapshot.revision+1;
  return {...snapshot,state,revision,cardInstanceId:snapshot.id+'/'+revision,note:event?.note??action.note??action.label};
}

export function restore(value:unknown):GameSnapshot {
  const s=value as GameSnapshot;
  if(s?.version!==1 || typeof s.id!=='string' || !Number.isSafeInteger(s.revision) || s.revision<0 || s.cardInstanceId!==s.id+'/'+s.revision || typeof s.note!=='string' || !s.state || !Object.hasOwn(region.cards,s.state.node)) throw Error('Partida incompatible');
  const ranges:Conditions={hp:[1,10],gold:[0,999999],quest:[0,3],foe:[0,6],guard:[0,1],blade:[0,1],equipped:[0,1],potions:[0,3],space:[0,3]};
  if(!fields.every(k=>Number.isSafeInteger(s.state[k])) || !matches(s.state,ranges) || s.state.equipped>s.state.blade) throw Error('Datos de partida inválidos');
  return s;
}
