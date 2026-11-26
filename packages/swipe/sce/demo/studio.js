/* SCE editable demo */
(function demo(){
 const M=SCE.model,P=SCE.player,$=id=>document.getElementById(id), e=P.el;
 const storage="sce.demo.v1";let set,player=null,selected=0,serial=0;
 const defaults={preset:"midnight",font:"serif"},names={left:"Izquierda",right:"Derecha",farLeft:"Izquierda intensa",farRight:"Derecha intensa",up:"Arriba",down:"Abajo"};
 const svg=(body)=>"data:image/svg+xml;charset=utf-8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 140"><g stroke="#967748" stroke-width="2" fill="none">'+body+'</g></svg>');
 const art=[svg('<rect x="44" y="17" width="152" height="106" rx="5"/><path d="M52 26h136v88H52z M55 38h130M55 50h130M55 62h130M55 74h130M55 86h130M55 98h130 M65 26v88M80 26v88M95 26v88M110 26v88M125 26v88M140 26v88M155 26v88M170 26v88"/>'),svg('<path d="M87 18h66v22l20 40v38H67V80l20-40z M67 86h106 M87 40h66"/><path d="M120 58c-8 14-16 21-16 30a16 16 0 0032 0c0-9-8-16-16-30z"/>'),svg('<circle cx="120" cy="47" r="22"/><path d="M120 9v8m0 60v10M82 47h8m60 0h8M92 20l8 8m40 40 8 8m0-56-8 8m-40 40-8 8M55 103h130v20H55z"/>')];
 function card(id,text,left="Falso",right="Verdadero",correct=null,image=""){
  const responses={};for(const k of M.actions)responses[k]={label:M.defaults[k],correct:null,score:0};
  responses.left={label:left,correct:correct===null?null:correct==="left",score:correct==="left"?1:0};responses.right={label:right,correct:correct===null?null:correct==="right",score:correct==="right"?1:0};
  return {id,text,image,responses};
 }
 function quiz(){
   return {version:1,name:"Preparació de pantalles · Serigrafia",mode:2,theme:{...defaults},display:{score:true,progress:true,variables:false},cards:[
    card("c1","La malla de la pantalla ha d'estar neta i desgreixada abans d'aplicar l'emulsió.","Fals","Vertader","right",art[0]),
    card("c2","L'emulsió fotosensible s'ha de preparar sempre seguint les indicacions del fabricant.","Fals","Vertader","right",art[1]),
    card("c3","Es pot exposar una pantalla emulsionada a la llum solar abans de la insolació.","Fals","Vertader","left",art[2])
   ]};
 }
 function narrative(){
   const a=card("client","Necessit les comandes abans de demà. Ho podeu fer?","Rebutjar","Consultar");a.character="El client";
   const b=card("consulta","Tenim capacitat limitada. Què fem?","Negociar termini","Acceptar amb hores extra");b.character="Producció";
   const c=card("final","El client accepta el nou termini.","Tancar encàrrec","Donar les gràcies");c.character="El client";
   a.responses.left.next="$end";a.responses.left.effects={prestigi:-5};a.responses.right.next="consulta";a.responses.right.effects={prestigi:5};
   b.responses.left.next="final";b.responses.right.next="$end";b.responses.right.effects={cost:20};c.responses.left.next=c.responses.right.next="$end";
   return {version:1,name:"La impremta · Decisions",mode:2,linear:false,theme:{preset:"forest",font:"sans"},display:{score:false,progress:true,variables:true},variables:{prestigi:50,cost:0},cards:[a,b,c]};
 }
 function six(){const q=card("gestures","Quin grau d'acord tens amb aquesta afirmació: m'agrada aprendre practicant?","Poc d'acord","Bastant d'acord");q.responses.farLeft.label="Gens d'acord";q.responses.farRight.label="Totalment d'acord";q.responses.up.label="Neutral";q.responses.down.label="No ho sé";return {version:1,name:"Laboratori de sis gestos",mode:6,theme:{preset:"graphic",font:"sans"},display:{score:false,progress:true},cards:[q]};}
 function normalize(s){M.validate(s);s.theme={...defaults,...s.theme};s.display={score:true,progress:true,...s.display};for(const c of s.cards){for(const k of M.actions)if(!c.responses[k])c.responses[k]={label:M.defaults[k],correct:null,score:0,enabled:false};}return s;}
 function status(msg,bad=false){$("status").textContent=msg;$("status").classList.toggle("error",bad);}
 function input(label,value,onChange,type="text"){const wrap=e("label","field"),t=e("span","",label),i=e("input");i.type=type;i.value=value??"";i.addEventListener("input",()=>onChange(i.value));wrap.append(t,i);return wrap;}
 function check(label,value,onChange){const l=e("label","check"),i=e("input");i.type="checkbox";i.checked=!!value;i.addEventListener("change",()=>onChange(i.checked));l.append(i,e("span","",label));return l;}
 function select(label,value,options,change){const l=e("label","field"),s=e("select");for(const [v,t] of options){const o=e("option","",t);o.value=v;s.append(o);}s.value=String(value);s.addEventListener("change",()=>change(s.value));l.append(e("span","",label),s);return l;}
 function area(label,value,change){const l=e("label","field"),t=e("textarea");t.rows=3;t.value=value||"";t.addEventListener("input",()=>change(t.value));l.append(e("span","",label),t);return l;}
 function button(label,fn,cls=""){const b=e("button",cls,label);b.type="button";b.addEventListener("click",fn);return b;}
 function changed(){status("Cambios sin guardar · pulsa Probar para actualizar la partida.");}
 function fileControl(label,callback){const l=e("label","field"),i=e("input");i.type="file";i.accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml";i.addEventListener("change",()=>{const f=i.files[0];if(!f)return;if(f.size>3*1024*1024){status("Imagen demasiado grande (máximo 3 MB).",true);return;}if(!/^image\/(png|jpeg|webp|gif|svg\+xml)$/.test(f.type)){status("Formato de imagen no admitido.",true);return;}const reader=new FileReader();reader.onload=()=>callback(String(reader.result));reader.onerror=()=>status("No se pudo leer la imagen.",true);reader.readAsDataURL(f);});l.append(e("span","",label),i);return l;}
 function thumb(src){const box=e("div","thumb");const u=P.imageSource(src);if(u){const im=e("img");im.src=u;im.alt="Vista previa";box.append(im);}else box.textContent="Sin imagen";return box;}
 function renderSettings(){
   const box=$("settings");box.replaceChildren();
   const count=input("Número de cartas (1–200)",set.cards.length,()=>{},"number");const n=count.querySelector("input");n.min=1;n.max=200;
   const resize=()=>{const target=Number(n.value);if(!Number.isInteger(target)||target<1||target>200){status("Número de cartas inválido.",true);return;}
    if(target<set.cards.length&&!confirm("¿Eliminar las últimas "+(set.cards.length-target)+" cartas?"))return;
    while(set.cards.length<target){let id;do{id="q"+(++serial);}while(set.cards.some(c=>c.id===id));set.cards.push(card(id,"Nueva pregunta","A","B"));}
    set.cards.length=target;const ids=new Set(set.cards.map(c=>c.id));for(const c of set.cards)for(const r of Object.values(c.responses))if(r.next&&r.next!=="$end"&&!ids.has(r.next))delete r.next;
    if(set.start&&!ids.has(set.start))delete set.start;selected=Math.min(selected,target-1);changed();renderEditor();};
   const countRow=e("div","inline");countRow.append(count,button("Aplicar",resize));
   box.append(input("Nombre del set",set.name,v=>{set.name=v;changed();}),countRow,select("Modo general",set.mode,[[2,"2 · Izquierda / derecha"],[4,"4 · Dos intensidades por lado"],["directions","4 · Cuatro direcciones"],[6,"6 · Intensidades + arriba / abajo"]],v=>{set.mode=v==="directions"?v:Number(v);for(const c of set.cards)for(const k of M.modes[c.mode??set.mode])if(c.responses[k].enabled===false)delete c.responses[k].enabled;changed();renderCards();}));
   box.append(select("Tema",set.theme.preset,Object.keys(P.themes).map(k=>[k,({midnight:"Atlas nocturno",paper:"Papel",graphic:"Artes gráficas",forest:"Bosque"})[k]]),v=>{set.theme.preset=v;for(const k of Object.keys(P.themes[v]))delete set.theme[k];changed();renderSettings();}));
   box.append(select("Tipografía de las cartas",set.theme.font,[["serif","Serif"],["sans","Sans serif"],["mono","Monoespaciada"]],v=>{set.theme.font=v;changed();}));
   const colors=e("div","colors");for(const [k,l] of Object.entries({bg:"Fondo",card:"Carta",ink:"Texto",accent:"Marco",left:"Izquierda",right:"Derecha"}))colors.append(input(l,set.theme[k]||P.themes[set.theme.preset]?.[k]||P.themes.midnight[k],v=>{set.theme[k]=v;changed();},"color"));box.append(colors);
   const b=thumb(set.theme.background);box.append(fileControl("Imagen de fondo (solo escritorio)",v=>{set.theme.background=v;changed();renderSettings();}),b,button("Quitar fondo",()=>{delete set.theme.background;changed();renderSettings();}));
   box.append(check("Mostrar puntuación",set.display.score,v=>{set.display.score=v;changed();}),check("Mostrar progreso",set.display.progress,v=>{set.display.progress=v;changed();}),check("Mostrar variables",set.display.variables,v=>{set.display.variables=v;changed();}));
   const vars=area("Variables iniciales (JSON, opcional)",JSON.stringify(set.variables||{},null,2),v=>{try{const x=JSON.parse(v);if(!x||typeof x!=="object"||Array.isArray(x)||Object.values(x).some(y=>typeof y!=="number"||!Number.isFinite(y)))throw Error();set.variables=x;vars.querySelector("textarea").setCustomValidity("");changed();}catch{vars.querySelector("textarea").setCustomValidity("Introduce un objeto JSON con números.");status("Variables: JSON inválido.",true);}});box.append(vars);
   box.append(check("Progreso lineal (mostrar total de cartas)",set.linear!==false,v=>{set.linear=v;changed();}));
   box.append(input("Texto de finalización",set.endText||"",v=>{set.endText=v;changed();}));
 }
 function renderCards(){
  const list=$("card-list"),box=$("card-editor");list.replaceChildren();box.replaceChildren();
  set.cards.forEach((c,i)=>{const b=button(String(i+1).padStart(2,"0")+" · "+c.text.slice(0,36),()=>{selected=i;renderCards();},i===selected?"selected":"");b.setAttribute("aria-pressed",String(i===selected));list.append(b);});
  const c=set.cards[selected];if(!c)return;
  const title=e("div","inline");title.append(e("h3","","Carta "+(selected+1)),button("↑",()=>move(-1)),button("↓",()=>move(1)),button("Duplicar",()=>{let id;do{id="q"+(++serial);}while(set.cards.some(c=>c.id===id));const d=JSON.parse(JSON.stringify(c));d.id=id;set.cards.splice(selected+1,0,d);selected++;changed();renderEditor();}));box.append(title);
  function move(n){const j=selected+n;if(j<0||j>=set.cards.length)return;[set.cards[selected],set.cards[j]]=[set.cards[j],set.cards[selected]];selected=j;changed();renderCards();}
  box.append(area("Pregunta o diálogo",c.text,v=>{c.text=v;list.children[selected].textContent=String(selected+1).padStart(2,"0")+" · "+v.slice(0,36);changed();}),input("Personaje (opcional)",c.character||"",v=>{c.character=v;changed();}),input("Texto alternativo de imagen",c.imageAlt||"",v=>{c.imageAlt=v;changed();}));
  box.append(thumb(c.image),fileControl("Subir ilustración (PNG/JPG/WebP/GIF/SVG)",v=>{c.image=v;changed();renderCards();}));
  const svgInput=area("O pegar código SVG", "",()=>{});box.append(svgInput,button("Aplicar SVG",()=>{const raw=svgInput.querySelector("textarea").value.trim();const doc=new DOMParser().parseFromString(raw,"image/svg+xml");if(doc.documentElement.localName!=="svg"||doc.querySelector("parsererror")){status("SVG inválido.",true);return;}c.image="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(raw);changed();renderCards();}),button("Quitar ilustración",()=>{delete c.image;changed();renderCards();}));
  box.append(select("Modo de esta carta",c.mode??"inherit",[["inherit","Heredar del set"],[2,"2 respuestas"],[4,"4 intensidades"],["directions","4 direcciones"],[6,"6 gestos"]],v=>{if(v==="inherit")delete c.mode;else c.mode=v==="directions"?v:Number(v);for(const k of M.modes[c.mode??set.mode])delete c.responses[k].enabled;changed();renderCards();}));
  const responses=e("div","response-editor");for(const k of M.modes[c.mode??set.mode]){
    const r=c.responses[k],f=e("fieldset");f.append(e("legend","",P.symbols[k]+" "+names[k]),check("Habilitada",r.enabled!==false,v=>{r.enabled=v;changed();}),input("Texto de la respuesta",r.label,v=>{r.label=v;changed();}),select("Corrección",r.correct===true?"true":r.correct===false?"false":"null",[["null","Sin evaluar"],["true","Correcta"],["false","Incorrecta"]],v=>{r.correct=v==="null"?null:v==="true";r.score=v==="true"?1:0;changed();renderCards();}),input("Puntos",r.score??(r.correct===true?1:0),v=>{r.score=Number(v);changed();},"number"),area("Explicación (opcional)",r.feedback||"",v=>{r.feedback=v;changed();}),select("Siguiente carta",r.next===undefined?"auto":r.next===null?"$end":r.next,[["auto","Siguiente en el orden"],["$end","Finalizar"],...set.cards.map((x,i)=>[x.id,"Carta "+(i+1)])],v=>{if(v==="auto")delete r.next;else r.next=v;changed();}));
    const eff=area("Efectos sobre variables (JSON)",JSON.stringify(r.effects||{}),v=>{try{const x=JSON.parse(v);if(!x||typeof x!=="object"||Array.isArray(x)||Object.values(x).some(y=>typeof y!=="number"||!Number.isFinite(y)))throw Error();r.effects=x;eff.querySelector("textarea").setCustomValidity("");changed();}catch{eff.querySelector("textarea").setCustomValidity("Objeto JSON con números requerido.");status("Efectos: JSON inválido.",true);}});f.append(eff);responses.append(f);
  }box.append(responses);
 }
 function renderEditor(){renderSettings();renderCards();}
 function validate(){const invalid=document.querySelector("#editor :invalid");if(invalid){invalid.reportValidity();throw Error("Revisa los campos inválidos.");}return M.validate(set);}
 function launch(){try{validate();player?.destroy();player=new P.Player($("player"),set,{sound:$("sound").checked,threshold:Number($("sensitivity").value)});status("Vista previa actualizada.");}catch(err){status(err.message,true);}}
 function load(s){try{set=normalize(s);selected=0;renderEditor();launch();}catch(err){status("No se pudo cargar: "+err.message,true);}}
 $("play").addEventListener("click",()=>{launch();$("player").scrollIntoView({behavior:"smooth",block:"start"});});
 $("save").addEventListener("click",()=>{try{validate();localStorage.setItem(storage,JSON.stringify(set));status("Set guardado en este navegador.");}catch(err){status("No se pudo guardar: "+err.message+". Exporta JSON como copia.",true);}});
 $("export").addEventListener("click",()=>{try{validate();const url=URL.createObjectURL(new Blob([JSON.stringify(set,null,2)],{type:"application/json"}));const a=e("a");a.href=url;a.download=(set.name||"sce-set").replace(/[^\p{L}\p{N}_-]+/gu,"-")+".json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status("Set exportado.");}catch(err){status(err.message,true);}});
 $("import").addEventListener("change",async ev=>{const f=ev.target.files[0];if(!f)return;try{if(f.size>30*1024*1024)throw Error("Archivo demasiado grande.");load(JSON.parse(await f.text()));}catch(err){status("Importación fallida: "+err.message,true);}ev.target.value="";});
 $("examples").addEventListener("change",ev=>{if(!ev.target.value)return;if(confirm("¿Sustituir el set actual? Exporta antes si quieres conservarlo."))load(({quiz,six,narrative})[ev.target.value]());ev.target.value="";});
 $("hide").addEventListener("click",()=>{const h=$("editor");h.hidden=!h.hidden;$("workspace").classList.toggle("play-only",h.hidden);$("hide").textContent=h.hidden?"Editar set":"Ocultar editor";});
 $("sensitivity").addEventListener("input",()=>{$("sens-value").textContent=$("sensitivity").value+" px";if(player)player.threshold=Number($("sensitivity").value);});
 $("sound").addEventListener("change",()=>{if(player){player.sound=$("sound").checked;const mute=player.root.querySelector(".sce-tools button");if(mute){mute.textContent=player.sound?"♪ Sonido":"♪ Silencio";mute.setAttribute("aria-pressed",String(player.sound));}}});
 try{const saved=localStorage.getItem(storage);load(saved?JSON.parse(saved):quiz());}catch{load(quiz());}if(!set||!player)load(quiz());
})();
