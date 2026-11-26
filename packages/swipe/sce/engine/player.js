/* SCE DOM player: reusable UI, no demo-specific logic. */
(function(root){root.SCE=root.SCE||{};root.SCE.player=(function playerAPI(){
 const M=globalThis.SCE.model, G=globalThis.SCE.gestures, A=globalThis.SCE.audio;
 const el=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e;};
 const symbols={left:"←",farLeft:"⇤",right:"→",farRight:"⇥",up:"↑",down:"↓"};
 const responseGlyphs={farLeft:"««",left:"‹",up:"↑",right:"›",farRight:"»»",down:"↓"};
 const responseOrder=["farLeft","left","up","right","farRight"];
 const choiceStyle=k=>k==="left"||k==="farLeft"?{side:"left",position:"on-right",strong:k==="farLeft"}:k==="right"||k==="farRight"?{side:"right",position:"on-left",strong:k==="farRight"}:k==="up"?{side:"vertical",position:"on-bottom",strong:false}:k==="down"?{side:"vertical",position:"on-top",strong:false}:null;
 function responseLayout(actions){return {primary:responseOrder.filter(k=>actions.includes(k)),secondary:actions.filter(k=>k==="down")};}
 function imageSource(value){
   if(typeof value!=="string"||!value)return "";
   if(/^data:image\/(?:png|jpeg|webp|gif|svg\+xml);(?:base64,|charset=utf-8,|utf8,)/i.test(value))return value;
   if(/^(?:https?:\/\/|\/\/|[a-z]+:)/i.test(value))return "";
   try{const u=new URL(value,document.baseURI);return u.origin===location.origin&&["http:","https:","file:"].includes(u.protocol)?u.href:"";}catch{return "";}
 }
 const themes={midnight:{bg:"#141c2a",card:"#f4ebd8",ink:"#262e3c",accent:"#ac8755",left:"#385d89",right:"#33765f"},paper:{bg:"#d9d5c9",card:"#fffdf4",ink:"#28302e",accent:"#927143",left:"#345c80",right:"#367657"},graphic:{bg:"#24252d",card:"#fff9ee",ink:"#171720",accent:"#c04b64",left:"#187b9e",right:"#a34b75"},forest:{bg:"#1d302b",card:"#e5eddf",ink:"#273b31",accent:"#748b56",left:"#496785",right:"#477149"}};
 function applyTheme(root,theme={}){
   const p=themes[theme.preset]||themes.midnight;
   for(const k of Object.keys(p)){const v=theme[k];root.style.setProperty("--sce-"+k,typeof v==="string"&&/^#[0-9a-f]{6}$/i.test(v)?v:p[k]);}
   const fonts={serif:"Georgia, serif",sans:"system-ui, sans-serif",mono:"ui-monospace, monospace"};
   root.style.setProperty("--sce-font",fonts[theme.font]||fonts.serif);
   const source=imageSource(theme.background);
   root.style.setProperty("--sce-background",source?'url('+JSON.stringify(source)+')':"none");
 }
 class Player{
  constructor(root,set,options={}){
   this.root=root;this.options=options;this.session=new M.Session(set);this.busy=false;this.destroyed=false;this.timer=0;
   this.sound=options.sound!==false;this.threshold=Number(options.threshold)||150;
   this.key=e=>{if(!root.contains(document.activeElement)&&this.options.globalKeys!==true)return;if(e.target.closest?.("button")&&(e.key===" "||e.key==="Enter"))return;if(e.target.closest?.("input,textarea,select,[contenteditable]"))return;
   const k=({ArrowLeft:"left",ArrowRight:"right",ArrowUp:"up",ArrowDown:"down",a:"farLeft",d:"farRight"})[e.key];if(k&&this.session.actions.includes(k)){e.preventDefault();this.choose(k);}};
   document.addEventListener("keydown",this.key);root.classList.add("sce-player");root.tabIndex=0;applyTheme(root,set.theme);this.render();
  }
  stop(){clearTimeout(this.timer);this.exitAnimation?.cancel();this.exitAnimation=null;this.busy=false;if(this.unbind){this.unbind();this.unbind=null;}}
  destroy(){this.destroyed=true;this.stop();document.removeEventListener("keydown",this.key);this.root.replaceChildren();}
  restart(){this.stop();this.session.restart();this.last=null;this.render();}
  undo(){if(this.busy)return;if(this.session.undo()){this.last=null;this.render();}}
  button(label,handler,cls="sce-button"){const b=el("button",cls,label);b.type="button";b.addEventListener("click",handler);return b;}
  render(){
    if(this.destroyed)return;const restoreFocus=this.root.contains(document.activeElement);this.stop();const s=this.session.state,set=this.session.set,c=this.session.card,root=this.root;root.replaceChildren();if(restoreFocus)root.focus({preventScroll:true});
    const head=el("header","sce-head");head.append(el("div","sce-wordmark","SCE / "+(set.name||"Sin título")));const tools=el("div","sce-tools");
    const mute=this.button(this.sound?"♪ Sonido":"♪ Silencio",()=>{this.sound=!this.sound;mute.textContent=this.sound?"♪ Sonido":"♪ Silencio";mute.setAttribute("aria-pressed",String(this.sound));});mute.setAttribute("aria-pressed",String(this.sound));
    tools.append(mute,this.button("⛶",()=>{try{const p=document.fullscreenElement?document.exitFullscreen():root.requestFullscreen();p?.catch(()=>{});}catch{}}));head.append(tools);root.append(head);
    const display=el("div","sce-display");const d=set.display||{};
    if(d.progress!==false)display.append(el("span","","Cartas respondidas: "+s.history.length+(set.linear===false?"":" / "+set.cards.length)));
    if(d.score!==false)display.append(el("span","","Puntos: "+s.score));
    if(d.variables)for(const [k,v] of Object.entries(s.variables))display.append(el("span","",k+": "+v));
    if(display.childNodes.length)root.append(display);
    if(!c){
      const end=el("section","sce-end");end.append(el("span","sce-eyebrow","✦  FIN DEL SET  ✦"),el("h2","",set.endText||"Experiencia completada"),el("p","",s.history.length+" cartas respondidas"));
      if(d.score!==false)end.append(el("strong","sce-score",String(s.score)+" puntos"),el("p","",s.correct+" aciertos · "+s.incorrect+" errores"));
      if(this.last?.feedback){const f=el("p","sce-feedback",this.last.feedback);f.setAttribute("role","status");end.append(f);}
      end.append(this.button("Volver a empezar",()=>this.restart()),this.button("Deshacer última decisión",()=>this.undo()));root.append(end);this.options.onFinish?.(s);return;
    }
    const stage=el("div","sce-stage"),stack=el("div","sce-stack");stack.setAttribute("aria-hidden","true");stack.append(el("span","","✧"));
    const card=el("article","sce-card entering");this.card=card;const meta=el("div","sce-card-meta");meta.append(el("span","","CARTA "+String(s.history.length+1).padStart(2,"0")),el("span","","✦ ✧ ✦"),el("span","","SCE"));card.append(meta);
    const art=el("div","sce-art");const source=imageSource(c.image);
    if(source){const img=el("img");img.alt=c.imageAlt||"";img.draggable=false;img.src=source;img.addEventListener("error",()=>{art.replaceChildren(el("span","sce-art-mark","✧"));});art.append(img);}else art.append(el("span","sce-art-mark","✧"));
    card.append(art);if(c.character)card.append(el("div","sce-character",c.character));card.append(el("h2","sce-question",c.text));
    const sides=el("div","sce-sides");for(const k of ["left","right"]){const r=c.responses[k];sides.append(el("span","",this.session.actions.includes(k)?symbols[k]+" "+r.label:""));}card.append(sides);
    this.stamp=el("div","sce-stamp");this.stamp.setAttribute("aria-hidden","true");card.append(this.stamp);stage.append(stack,card);root.append(stage);
    // The fixed response banner and the horizontal row follow TYPE/16's quiz layout.
    const zone=el("div","sce-gesture-zone");
    this.banner=el("div","sce-response-banner");this.banner.setAttribute("role","status");this.banner.setAttribute("aria-live","polite");this.banner.setAttribute("aria-atomic","true");
    const ornament=()=>{const x=el("span","sce-banner-ornament","✦");x.setAttribute("aria-hidden","true");return x;};
    const message=el("div","sce-banner-text");message.append(el("span","sce-banner-kicker","TU ELECCIÓN"));
    this.hint=el("strong","sce-hint","Arrastra la carta o utiliza los botones");message.append(this.hint);this.banner.append(ornament(),message,ornament());zone.append(this.banner);
    const layout=responseLayout(this.session.actions);
    const makeResponse=k=>{const style=choiceStyle(k),b=this.button(undefined,()=>this.choose(k),"sce-response "+style.side+(style.strong?" strong":""));b.dataset.action=k;b.setAttribute("aria-label",c.responses[k].label);const glyph=el("strong","sce-response-symbol",responseGlyphs[k]);glyph.setAttribute("aria-hidden","true");b.append(glyph,el("small","sce-response-label",c.responses[k].label));return b;};
    const buttons=el("div","sce-responses");buttons.setAttribute("role","group");buttons.setAttribute("aria-label","Respuestas");buttons.style.setProperty("--sce-response-count",String(Math.max(1,layout.primary.length)));for(const k of layout.primary)buttons.append(makeResponse(k));if(layout.primary.length)zone.append(buttons);
    const foot=el("div","sce-foot");const undo=this.button("↶ Deshacer",()=>this.undo());undo.disabled=!s.history.length;foot.append(undo);for(const k of layout.secondary)foot.append(makeResponse(k));foot.append(this.button("Reiniciar",()=>this.restart()));zone.append(foot);root.append(zone);
    if(this.last&&this.last.feedback){const f=el("p","sce-feedback",this.last.feedback);f.setAttribute("role","status");root.append(f);}
    this.unbind=G.bind(card,{allowed:()=>this.session.actions,threshold:()=>Math.max(110,Math.min(210,this.threshold)),onPreview:k=>this.preview(k),onAnswer:(k,dx,dy)=>this.choose(k,dx,dy),isBusy:()=>this.busy});
    this.options.onRender?.(this);
  }
  preview(k){
   if(!this.stamp?.isConnected)return;
   const r=k&&this.session.actions.includes(k)?this.session.card.responses[k]:null,style=r?choiceStyle(k):null;
   // Highlight only the exact candidate, including strong gestures and the lower toolbar.
   for(const b of this.root.querySelectorAll(".sce-response"))b.classList.toggle("gesture-active",!!r&&b.dataset.action===k);
   this.stamp.textContent=r?r.label:"";
   this.stamp.className="sce-stamp"+(style?" visible "+style.side+" "+style.position+(style.strong?" strong":""):"");
   this.banner.className="sce-response-banner"+(style?" selected "+style.side+(style.strong?" strong":""):"");
   const label=r?r.label:"Arrastra la carta o utiliza los botones";if(this.hint.textContent!==label)this.hint.textContent=label;
  }
  choose(k,exitX=0,exitY=0){if(this.busy||!this.session.actions.includes(k))return;this.busy=true;this.preview(k);if(this.sound){A.setEnabled(true);A.play(k==="down"?null:k);}
   const card=this.card,style=choiceStyle(k),dir=style.side==="left"?-1:style.side==="right"?1:0;
   const start=getComputedStyle(card).transform;card.classList.remove("entering","dragging");
   const deck=card.parentElement.getBoundingClientRect(),bounds=this.root.getBoundingClientRect(),w=card.offsetWidth,h=card.offsetHeight;
   const left=deck.left+(deck.width-w)/2,right=left+w,top=deck.top+(deck.height-h)/2,bottom=top+h;
   const x=dir<0?-Math.ceil(right-bounds.left+48):dir>0?Math.ceil(bounds.right-left+48):0;
   const y=k==="up"?-Math.ceil(bottom-bounds.top+48):k==="down"?Math.ceil(bounds.bottom-top+48):exitY===0?-36:Math.max(-125,Math.min(125,exitY));
   const final="translate3d("+x+"px,"+y+"px,0) rotate("+(dir*17)+"deg) scale(.96)";
   const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
   const duration=Math.round(Math.max(400,Math.min(650,260+Math.hypot(x,y)*.43)));
   for(const b of this.root.querySelectorAll(".sce-response"))b.disabled=true;
   const advance=()=>{if(this.destroyed||!this.busy)return;this.last=this.session.answer(k);this.options.onAnswer?.(this.last,this.session.state);this.render();};
   if(reduced){advance();return;}
   if(card.animate){try{this.exitAnimation=card.animate([{transform:start==="none"?"translate3d(0,0,0)":start,opacity:1},{transform:final,opacity:0}],{duration,easing:"cubic-bezier(.32,.06,.65,.8)",fill:"forwards"});}catch{card.style.transform=final;}}
   else{card.style.transition="transform "+duration+"ms ease-in, opacity "+duration+"ms";card.style.transform=final;card.style.opacity="0";}
   this.timer=setTimeout(advance,duration);
  }
 }
 return {Player,themes,applyTheme,imageSource,el,symbols,responseLayout,choiceStyle};
})();})(globalThis);
