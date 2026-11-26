/* TYPE/16 v1.0.2 paper swish + thud; isolated Web Audio implementation. */
(function(root){root.SCE=root.SCE||{};let cardAudio=null,soundEnabled=true;
function playCardSound(value){
 if(!soundEnabled)return;
 const API=window.AudioContext||window.webkitAudioContext;
 if(!API)return;
 try{
  if(!cardAudio)cardAudio=new API();
  if(cardAudio.state==='suspended')cardAudio.resume().catch(()=>{});
  const t=cardAudio.currentTime+.012,rate=cardAudio.sampleRate,buffer=cardAudio.createBuffer(1,Math.ceil(rate*.24),rate),samples=buffer.getChannelData(0);
  let last=0;for(let i=0;i<samples.length;i++){const r=Math.random()*2-1;samples[i]=.78*r+.22*last;last=r;}
  const src=cardAudio.createBufferSource(),paper=cardAudio.createBiquadFilter(),swish=cardAudio.createGain();src.buffer=buffer;
  paper.type='bandpass';paper.frequency.setValueAtTime(760,t);paper.frequency.exponentialRampToValueAtTime(2250,t+.19);paper.Q.value=.68;
  swish.gain.setValueAtTime(.0001,t);swish.gain.linearRampToValueAtTime(value===null?0.065:0.09,t+.029);swish.gain.exponentialRampToValueAtTime(.0001,t+.22);
  src.connect(paper);paper.connect(swish);swish.connect(cardAudio.destination);src.start(t);src.stop(t+.23);
  const osc=cardAudio.createOscillator(),thud=cardAudio.createGain();osc.type='sine';
  osc.frequency.setValueAtTime(150,t+.12);osc.frequency.exponentialRampToValueAtTime(82,t+.28);
  thud.gain.setValueAtTime(.0001,t+.12);thud.gain.linearRampToValueAtTime(.032,t+.15);thud.gain.exponentialRampToValueAtTime(.0001,t+.29);
  osc.connect(thud);thud.connect(cardAudio.destination);osc.start(t+.12);osc.stop(t+.30);
 }catch{/* Silent fall-back when Web Audio is unavailable. */}
}
root.SCE.audio={play:playCardSound,setEnabled(value){soundEnabled=Boolean(value);},get enabled(){return soundEnabled;}};})(globalThis);
