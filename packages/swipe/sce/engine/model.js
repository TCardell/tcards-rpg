/* SCE 0.1.0 — platform-independent state and gesture classification */
(function(root){root.SCE=root.SCE||{};root.SCE.model=(function model(){
  const modes={2:["left","right"],4:["farLeft","left","right","farRight"],6:["farLeft","left","right","farRight","up","down"],directions:["left","right","up","down"]};
  const actions=modes[6], defaults={left:"A",right:"B",farLeft:"Muy A",farRight:"Muy B",up:"Arriba",down:"Abajo"};
  const copy=x=>JSON.parse(JSON.stringify(x));
  const keys=o=>Object.keys(o||{}).filter(k=>!["__proto__","constructor","prototype"].includes(k));
  const num=(x,d=0)=>Number.isFinite(Number(x))?Number(x):d;
  const enabled=(set,card)=>modes[card.mode??set.mode].filter(k=>card.responses[k] && card.responses[k].enabled!==false);
  function validate(set){
    if(!set||typeof set!=="object"||!modes[set.mode]||!Array.isArray(set.cards)||!set.cards.length)throw Error("Set sin cartas o modo inválido.");
    const ids=new Set();
    for(const c of set.cards){
      if(!c||typeof c.id!=="string"||!c.id||ids.has(c.id)||typeof c.text!=="string"||!c.text.trim()||!modes[c.mode??set.mode]||!c.responses||!enabled(set,c).length)throw Error("Carta inválida o ID duplicado: "+c?.id);
      ids.add(c.id);
      for(const k of enabled(set,c)){
        const r=c.responses[k];
        if(typeof r.label!=="string"||!r.label.trim())throw Error("Respuesta sin texto: "+c.id+" / "+k);
        if(r.score!==undefined&&!Number.isFinite(r.score))throw Error("Puntuación inválida: "+c.id);
      }
    }
    if(set.start&&!ids.has(set.start))throw Error("Carta inicial desconocida.");
    for(const c of set.cards)for(const k of enabled(set,c)){const n=c.responses[k].next;if(n!==undefined&&n!==null&&n!=="$end"&&!ids.has(n))throw Error("Destino desconocido: "+n);}
    return set;
  }
  class Session {
    constructor(set){this.set=copy(validate(set));this.restart();}
    restart(){this.state={id:this.set.start||this.set.cards[0].id,score:0,correct:0,incorrect:0,variables:{},history:[]};for(const k of keys(this.set.variables))this.state.variables[k]=num(this.set.variables[k]);return this.state;}
    get card(){return this.set.cards.find(c=>c.id===this.state.id)||null;}
    get actions(){return this.card?enabled(this.set,this.card):[];}
    answer(action){
      const c=this.card;if(!c||!this.actions.includes(action))return null;
      const r=c.responses[action],s=this.state;
      const snapshot={id:s.id,score:s.score,correct:s.correct,incorrect:s.incorrect,variables:copy(s.variables)};
      const item={card:c.id,action,label:r.label,correct:r.correct,feedback:r.feedback||"",before:snapshot};
      s.history.push(item);s.score+=num(r.score,r.correct===true?1:0);
      if(r.correct===true)s.correct++;if(r.correct===false)s.incorrect++;
      for(const k of keys(r.effects))s.variables[k]=(Object.hasOwn(s.variables,k)?num(s.variables[k]):0)+num(r.effects[k]);
      const next=r.next===undefined?this.set.cards[this.set.cards.indexOf(c)+1]?.id:r.next;
      s.id=next==="$end"?null:next||null;return item;
    }
    undo(){const item=this.state.history.pop();if(!item)return false;Object.assign(this.state,item.before);return true;}
  }
  function classify(dx,dy,allowed,threshold=150){
    const ax=Math.abs(dx),ay=Math.abs(dy);
    if(ay>=70&&ay>=ax*1.3){const k=dy<0?"up":"down";return allowed.includes(k)?k:null;}
    if(ax<52||ax<ay*.7)return null;
    const soft=dx<0?"left":"right",strong=dx<0?"farLeft":"farRight";
    if(ax>=threshold&&allowed.includes(strong))return strong;
    return allowed.includes(soft)?soft:null;
  }
  return {modes,actions,defaults,validate,enabled,Session,classify};
})();})(globalThis);
