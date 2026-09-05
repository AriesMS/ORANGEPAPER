const target=document.querySelector('.facade-target');
const crop=document.querySelector('.model-crop');
const dialogue=document.querySelector('.module-dialogue');
let pinned=false;
function reveal(visible){crop.classList.toggle('is-active',visible);dialogue.hidden=!visible;target.setAttribute('aria-expanded',String(visible));}
target.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch')reveal(true);});
target.addEventListener('pointerleave',()=>{if(!pinned&&document.activeElement!==target)reveal(false);});
target.addEventListener('focus',()=>reveal(true));
target.addEventListener('blur',()=>{if(!pinned)reveal(false);});
target.addEventListener('click',()=>{pinned=!pinned;reveal(pinned);});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){pinned=false;reveal(false);}});
document.addEventListener('pointerdown',event=>{if(!event.target.closest('.model-crop')){pinned=false;reveal(false);}});


// Native page scrolling drives a fixed composition, so earlier fragments stay visible.
const sequence=document.querySelector('.scroll-sequence');
const stages=[...sequence.querySelectorAll('.scroll-stage:not(.end-stage)')];
const ending=sequence.querySelector('.end-stage');
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const mix=(a,b,t)=>a+(b-a)*t;
let scheduled=false;
function pose(index,step,w,h){
  const mobile=w<650;
  if(step===4)return {x:w*(.17+index*.22),y:h*.43,scale:mobile?.38:.43,opacity:1};
  if(index>step)return {x:w*1.3,y:h*.52,scale:1,opacity:0};
  if(index===step)return {x:w*(step===0?.5:.64),y:h*.53,scale:mobile?.85:1,opacity:1};
  return {x:w*(.065+index*.11),y:h*.53,scale:mobile?.22:.25,opacity:1};
}
function layout(){
  scheduled=false;
  const w=window.innerWidth,h=window.innerHeight;
  const progress=clamp(window.scrollY/Math.max(1,document.documentElement.scrollHeight-h)*4,0,4);
  const step=Math.min(3,Math.floor(progress)),t=progress-step;
  const eased=t*t*(3-2*t);
  stages.forEach((stage,index)=>{
    const a=pose(index,step,w,h),b=pose(index,step+1,w,h);
    const x=mix(a.x,b.x,eased),y=mix(a.y,b.y,eased),scale=mix(a.scale,b.scale,eased);
    stage.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%) scale(${scale})`;
    stage.style.opacity=mix(a.opacity,b.opacity,eased);
    stage.inert=index>Math.ceil(progress);
    stage.setAttribute('aria-hidden',String(index>Math.ceil(progress)));
  });
  const finalReveal=clamp((progress-3.45)/.55,0,1);
  ending.style.opacity=finalReveal;
  ending.style.transform=`translateY(${(1-finalReveal)*35}px)`;
  ending.inert=finalReveal<.95;
  ending.style.pointerEvents=finalReveal>.95?'auto':'none';
}
function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(layout);}}
window.addEventListener('scroll',schedule,{passive:true});
window.addEventListener('resize',schedule);
sequence.addEventListener('keydown',event=>{
  if(event.target.closest('button,a,input,textarea'))return;
  let direction=0;
  if(['ArrowRight','ArrowDown','PageDown'].includes(event.key))direction=1;
  if(['ArrowLeft','ArrowUp','PageUp'].includes(event.key))direction=-1;
  if(direction){event.preventDefault();window.scrollBy({top:direction*window.innerHeight,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
});
layout();
