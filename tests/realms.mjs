// Ejecutar solo con identidades desechables en el entorno de desarrollo indicado.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createClient} from '@supabase/supabase-js';
import {resolve} from '../packages/engine/world.ts';

const url=process.env.TEST_SUPABASE_URL??'http://127.0.0.1:54321', key=process.env.TEST_SUPABASE_KEY;
const remote=!!process.env.TCARDS_TEST_FIXTURES;
if(!key || (!remote&&!['localhost','127.0.0.1'].includes(new URL(url).hostname)))throw Error('Configura el entorno de prueba local o las cuentas ficticias autorizadas.');
const client=()=>createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
const accounts=remote?JSON.parse(readFileSync(process.env.TCARDS_TEST_FIXTURES,'utf8')):null;
const names=['operator','first','second','observer'];
async function identity(i){
 const api=client();
 const credentials=accounts?.[names[i]]??{email:'viajero-'+crypto.randomUUID()+'@example.test',password:crypto.randomUUID()+'!9x'};
 const {data,error}=accounts?await api.auth.signInWithPassword(credentials):await api.auth.signUp(credentials);
 assert.ifError(error);assert.ok(data.session,'La prueba necesita sesiones confirmadas');
 const call=async(op,p={})=>{if(process.env.TEST_TRACE)console.log(op,p.actionId??'');const {data,error}=await api.rpc('tcards',{op,p});if(error)throw Error(error.message);return data;};
 return {api,id:data.user.id,call,cmd:(op,p={})=>call(op,{commandId:crypto.randomUUID(),...p}),credentials};
}
const people=[];for(let i=0;i<4;i++)people.push(await identity(i));
const [op,a,b,observer]=people;
if(!remote){
 const sql="insert into tcards.operators(actor,role,world) values ('"+op.id+"','operator','valbruma'),('"+observer.id+"','observer','valbruma')";
 execFileSync('docker',['exec',process.env.TEST_DB_CONTAINER??'supabase_db_tcards-rpg','psql','-v','ON_ERROR_STOP=1','-U','postgres','-c',sql],{stdio:'ignore'});
}
for(const who of [a,b]){
 if(!(await who.call('lobby')).world){const inv=await op.cmd('invite');await who.cmd('admit',{code:inv.code});await assert.rejects(observer.cmd('admit',{code:inv.code}));}
}
const ca=await a.cmd('create',{name:'Lina de prueba',race:'elf',vocation:'scout'}), cb=await b.cmd('create',{name:'Biel de prueba',race:'human',vocation:'warden'});
const read=(who,id)=>who.call('read',{scopeId:id});const base=(s,scopeId=s.id)=>({scopeId,expectedRevision:s.revision,cardInstanceId:s.cardInstanceId});
await assert.rejects(b.call('read',{scopeId:ca.id}));await assert.rejects(a.call('inspect'));
assert.equal((await observer.call('inspect')).role,'observer');await assert.rejects(observer.cmd('invite'));
assert.ok((await client().rpc('tcards',{op:'lobby'})).error);
let s=ca;
for(const actionId of ['visit_inn','speak','ask','accept','return','follow_road','investigate','strike','guard','riposte','assist','take','equip','drink','return','visit_inn','speak','report','return']){
 const p={...base(s),commandId:crypto.randomUUID(),actionId};
 const predicted=resolve(s,p);
 await a.call('act',p);await a.call('act',p);
 s=(await read(a,s.id)).sheet;assert.deepEqual(s.state,predicted.state);assert.equal(s.revision,predicted.revision);
}
assert.equal(s.state.gold,12);assert.equal(s.state.quest,3);
const race=await Promise.allSettled([a.cmd('act',{...base(s),actionId:'visit_gate'}),a.cmd('act',{...base(s),actionId:'visit_inn'})]);
assert.equal(race.filter(x=>x.status==='fulfilled').length,1);
s=(await read(a,s.id)).sheet;await a.cmd('act',{...base(s),actionId:'return'});s=(await read(a,s.id)).sheet;
await a.cmd('open',base(s));let room=(await read(a,s.id)).room;
await b.cmd('join',{...base(cb),code:room.code});room=(await read(b,cb.id)).room;
await assert.rejects(b.cmd('turn',{...base(room,cb.id),actionId:'strike'}));
await assert.rejects(observer.cmd('turn',{...base(room,s.id),actionId:'strike'}));
for(const [who,id,actionId] of [[a,s.id,'guard'],[b,cb.id,'strike'],[a,s.id,'strike'],[b,cb.id,'strike']]){
 const args={...base(room,id),actionId,commandId:crypto.randomUUID()};
 await Promise.all([who.call('turn',args),who.call('turn',args)]);
 const before=room;room=(await read(who,id)).room;assert.equal(room.revision,before.revision+1);
}
assert.equal(room.phase,'won');
const reconnect=client();assert.ifError((await reconnect.auth.signInWithPassword(a.credentials)).error);
const resumed=await reconnect.rpc('tcards',{op:'read',p:{scopeId:s.id}});assert.ifError(resumed.error);assert.equal(resumed.data.room.cardInstanceId,room.cardInstanceId);assert.equal(resumed.data.sheet.state.equipped,1);
s=resumed.data.sheet;
const comp={...base(s),amount:3,reason:'Prueba ficticia de devolución',commandId:crypto.randomUUID()};
await assert.rejects(a.call('compensate',comp));await assert.rejects(observer.call('compensate',comp));
await op.call('compensate',comp);await op.call('compensate',comp);await assert.rejects(op.call('compensate',{...comp,amount:4}));
assert.equal((await read(a,s.id)).sheet.state.gold,15);
const records=(await op.call('inspect')).events.filter(e=>e.command_id===comp.commandId);
assert.equal(records.length,1);assert.equal(records[0].before_state.gold,12);assert.equal(records[0].after_state.gold,15);
const signals=await a.api.from('tcards_signals').select('actor');assert.ifError(signals.error);assert.deepEqual(signals.data,[{actor:a.id}]);
assert.ok((await a.api.from('tcards_signals').update({tick:9}).eq('actor',a.id)).error);
console.log('Verificado: Auth, invitaciones, aislamiento, misión, paridad, carrera, turnos, reconexión, RLS y compensación auditada.');
