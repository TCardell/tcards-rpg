import '../game/style.css';
import {el,button,input,select,db,rpc,command,authForm} from '../../packages/shared/client.js';
const root=document.querySelector('#admin'),status=document.querySelector('#status');
function message(value){status.textContent=value;}
async function load(){
 root.replaceChildren(el('h1','','TCards RPG Admin'));message('');
 if(!db||!(await db.auth.getUser()).data.user){authForm(root,load,false);return;}
 root.append(button('Cerrar sesión',async()=>{await db.auth.signOut();await load();}));
 let data;try{data=await rpc('inspect');}catch{root.append(el('p','notice','Acceso restringido. Se requiere un rol de observación u operación en Valbruma.'));return;}
 const header=el('header');header.append(el('h2','',data.world),button('Actualizar',load));root.append(header,el('p','',data.members+' miembros · '+data.characters.length+' personajes · '+data.rooms.length+' expediciones'));
 const section=title=>{const s=el('section');s.append(el('h2','',title));root.append(s);return s;};
 const chars=section('Personajes');
 for(const c of data.characters){
   const d=el('details');d.append(el('summary','',c.name+' · '+c.state.gold+' oro · revisión '+c.revision),el('p','small','Cuenta '+c.actor+' · Carta '+c.id+'/'+c.revision),el('pre','',JSON.stringify(c.state,null,2)));chars.append(d);
 }
 const rooms=section('Expediciones');
 for(const r of data.rooms)rooms.append(el('p','entry',r.hostName+' / '+(r.guestName??'Esperando')+' · '+r.phase+' · '+r.note+' · revisión '+r.revision));
 if(!data.rooms.length)rooms.append(el('p','small','Todavía no hay expediciones.'));
 if(data.role==='operator'){
   const ops=section('Operaciones');
   ops.append(button('Emitir invitación de un uso',async e=>{const b=e.currentTarget;b.disabled=true;try{const res=await command('invite');const f=input('Invitación válida hasta '+new Date(res.expires).toLocaleDateString('es'),'text',{readOnly:true,value:res.code});ops.append(f.wrapper);}catch(err){message(err.message);}finally{b.disabled=false;}}));
   if(data.characters.length){
     const form=el('form','form'),ch=select('Personaje',data.characters.map(c=>[c.id,c.name])),n=input('Monedas que devolver','number',{min:1,max:50,required:true}),reason=input('Motivo de la compensación','text',{minLength:8,maxLength:240,required:true}),submit=el('button','primary','Registrar compensación');
     form.append(ch.wrapper,n.wrapper,reason.wrapper,submit);ops.append(form);
     form.onsubmit=async e=>{e.preventDefault();if(submit.disabled)return;submit.disabled=true;const c=data.characters.find(x=>x.id===ch.control.value);
       try{await command('compensate',{scopeId:c.id,expectedRevision:c.revision,cardInstanceId:c.id+'/'+c.revision,amount:Number(n.control.value),reason:reason.control.value.trim()});await load();message('Compensación confirmada y registrada.');}catch(err){message(err.message);}finally{submit.disabled=false;}};
   }
 }
 const events=section('Auditoría · últimos 100 sucesos');
 for(const ev of data.events){const d=el('details');d.append(el('summary','',new Date(ev.at).toLocaleString('es')+' · '+ev.action+(ev.reason?' · '+ev.reason:'')),el('pre','',JSON.stringify({actor:ev.actor,alcance:ev.scope,comando:ev.command_id,resultado:ev.result,antes:ev.before_state,después:ev.after_state},null,2)));events.append(d);}
}
db?.auth.onAuthStateChange(event=>{if(event==='SIGNED_OUT'){root.replaceChildren();setTimeout(load,0);}});
load().catch(e=>message(e.message));
