require('../engine/model.js');require('../engine/player.js');const assert=require('node:assert/strict'),P=SCE.player,M=SCE.model;
for(const [mode,primary,secondary] of [[2,['left','right'],[]],[4,['farLeft','left','right','farRight'],[]],['directions',['left','up','right'],['down']],[6,['farLeft','left','up','right','farRight'],['down']]])assert.deepEqual(P.responseLayout(M.modes[mode]),{primary,secondary});
for(const [k,pos] of [['left','on-right'],['farLeft','on-right'],['right','on-left'],['farRight','on-left'],['up','on-bottom'],['down','on-top']])assert.equal(P.choiceStyle(k).position,pos);
const buttons=M.actions.map(k=>{const b={dataset:{action:k},active:false};b.classList={toggle:(c,v)=>{b.active=v;}};return b;});
const fake={stamp:{isConnected:true},banner:{},hint:{},root:{querySelectorAll:()=>buttons},session:{actions:M.actions,card:{responses:Object.fromEntries(M.actions.map(k=>[k,{label:k}]))}}};
for(const k of [...M.actions,null]){P.Player.prototype.preview.call(fake,k);assert.deepEqual(buttons.filter(b=>b.active).map(b=>b.dataset.action),k?[k]:[]);assert.equal(fake.stamp.textContent,k||'');assert.equal(fake.stamp.className.includes(' visible'),!!k);assert.equal(fake.banner.className.includes(' selected'),!!k);}
console.log('SCE player feedback: assertions passed');
