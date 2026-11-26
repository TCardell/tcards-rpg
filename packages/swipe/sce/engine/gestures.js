/* Adapted from TYPE/16 v1.0.2 bindPointer; independent of its state and UI. */
(function(root){root.SCE=root.SCE||{};root.SCE.gestures=(function gestureAPI(){
  function bind(card,{allowed,threshold,onPreview,onAnswer,isBusy}){
    let pos=null,frame=0,latest=null;
    const feedback=()=>onPreview(window.SCE.model.classify(latest.dx,latest.dy,allowed(),threshold()));
    const paint=()=>{frame=0;if(!pos||!latest)return;const {dx,dy}=latest;
      const x=Math.sign(dx)*(Math.min(95,Math.abs(dx))+Math.max(0,Math.abs(dx)-95)*.25);
      const y=Math.sign(dy)*(Math.min(80,Math.abs(dy))+Math.max(0,Math.abs(dy)-80)*.2);
      card.style.transform="translate3d("+x+"px,"+y*.8+"px,0) rotate("+Math.max(-14,Math.min(14,x*.05))+"deg)";feedback();};
    const cancelFrame=()=>{if(frame)cancelAnimationFrame(frame);frame=0;};
    const cleanup=()=>{cancelFrame();pos=null;latest=null;card.classList.remove("dragging");card.style.transform="";onPreview(null);};
    const down=e=>{if(isBusy()||e.button!==0||pos)return;e.preventDefault();card.closest(".sce-player")?.focus({preventScroll:true});pos={x:e.clientX,y:e.clientY,id:e.pointerId};latest={dx:0,dy:0};card.classList.remove("entering");card.classList.add("dragging");try{card.setPointerCapture(e.pointerId);}catch{}};
    const move=e=>{if(!pos||pos.id!==e.pointerId||isBusy())return;const a=e.getCoalescedEvents?.();const p=a?.length?a[a.length-1]:e;latest={dx:p.clientX-pos.x,dy:p.clientY-pos.y};if(!frame)frame=requestAnimationFrame(paint);};
    const up=e=>{if(!pos||pos.id!==e.pointerId)return;cancelFrame();const dx=e.clientX-pos.x,dy=e.clientY-pos.y;const k=window.SCE.model.classify(dx,dy,allowed(),threshold());pos=null;latest=null;card.classList.remove("dragging");if(k&&!isBusy())onAnswer(k,dx,dy);else cleanup();};
    const cancel=e=>{if(pos&&pos.id===e.pointerId)cleanup();};
    const listeners={pointerdown:down,pointermove:move,pointerup:up,pointercancel:cancel,lostpointercapture:cancel,dragstart:e=>e.preventDefault()};
    for(const [event,handler] of Object.entries(listeners))card.addEventListener(event,handler);
    return ()=>{cleanup();for(const [event,handler] of Object.entries(listeners))card.removeEventListener(event,handler);};
  }
  return {bind};
})();})(globalThis);
