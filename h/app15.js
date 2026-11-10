/* ---------- v78: living goats — idle motion, tap to hop, leaps & dances on good answers ---------- */
Object.assign(T.it,{gaBravo:["Bravo!","Esatto!","Perfetto!","Sì!","Che fiuto!"],gaStreak:"di fila!",gaOops:["Quasi…","Riprova!","Coraggio!"]});
Object.assign(T.fr,{gaBravo:["Bravo !","Exact !","Parfait !","Oui !","Quel nez !"],gaStreak:"d'affilée !",gaOops:["Presque…","On recommence !","Courage !"]});
Object.assign(T.en,{gaBravo:["Well done!","Spot on!","Perfect!","Yes!","Great nose!"],gaStreak:"in a row!",gaOops:["Almost…","Try again!","Keep going!"]});
const GA_RM=(()=>{ try{ return matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){ return false; } })();
const gaPick=a=>a[Math.floor(Math.random()*a.length)];
/* 1. idle life: every goat breathes and sways a little, each at its own pace */
function gaLive(){ if(GA_RM) return; document.querySelectorAll("img.gfree:not([data-ga]),img.gpeek:not([data-ga]),#gfoot img:not([data-ga]),.brand img.logo:not([data-ga])").forEach(im=>{ im.dataset.ga=1;
  const k=im.dataset.gk||""; const mode=/n03|n15|g05|n34/.test(k)?"sleep":/n08|n14|g07|g14|dance|n06|g04/.test(k)?"bounce":"sway";
  im.classList.add("ga-"+mode); im.style.setProperty("--gad",(Math.random()*-4).toFixed(2)+"s"); im.style.setProperty("--gat",(3.2+Math.random()*1.8).toFixed(2)+"s"); }); }
new MutationObserver(()=>gaLive()).observe(document.body,{childList:true,subtree:true}); setTimeout(gaLive,200);
/* 2. tap a goat: it hops and throws a few grapes */
function gaBurst(x,y,n,chars){ if(GA_RM) return; for(let i=0;i<(n||6);i++){ const s=document.createElement("span"); s.className="ga-p"; s.textContent=gaPick(chars||["🍇","🍷","✨","🍇"]);
  const a=-Math.PI/2+(Math.random()-.5)*2.2, d=60+Math.random()*70; s.style.left=x+"px"; s.style.top=y+"px"; s.style.setProperty("--dx",(Math.cos(a)*d).toFixed(0)+"px"); s.style.setProperty("--dy",(Math.sin(a)*d).toFixed(0)+"px"); s.style.setProperty("--rot",((Math.random()-.5)*160).toFixed(0)+"deg");
  document.body.appendChild(s); setTimeout(()=>s.remove(),1100); } }
document.addEventListener("click",e=>{ const im=e.target.closest&&e.target.closest("img.gfree,#gfoot img,.ga-hero"); if(!im) return; if(GA_RM) return;
  im.classList.remove("ga-hop"); void im.offsetWidth; im.classList.add("ga-hop"); setTimeout(()=>im.classList.remove("ga-hop"),900);
  const r=im.getBoundingClientRect(); gaBurst(r.left+r.width/2,r.top+r.height*.3,7); });
/* 3. a goat leaps across the screen */
function goatLeap(dir){ if(GA_RM) return; const w=document.createElement("div"); w.className="ga-run"+(dir<0?" rev":""); w.innerHTML=`<img src="${gsrc("n08")}" alt="">`; document.body.appendChild(w);
  let k=0; const tr=setInterval(()=>{ const r=w.getBoundingClientRect(); if(k++%2===0) gaBurst(r.left+r.width*.3,r.top+r.height*.75,1,["🍇","✨"]); },260);
  setTimeout(()=>{ clearInterval(tr); w.remove(); },3400); }
/* 4. a goat pops in the corner after each answer */
let GA_POP=null;
function goatPop(ok,streak){ if(GA_RM) return; if(GA_POP){ GA_POP.remove(); GA_POP=null; }
  const k=ok?gaPick(["n05","g01","n04","g07","dance","n01","g14"]):gaPick(["n13","n28","n11","n07"]);
  const el=document.createElement("div"); el.className="ga-pop "+(ok?"ok":"no"); const msg=ok?(streak>=3?`${streak} ${t("gaStreak")}`:gaPick(t("gaBravo"))):gaPick(t("gaOops"));
  el.innerHTML=`<span class="ga-bub">${esc(msg)}</span><img src="${gsrc(k)}" alt="" class="ga-hero">`; document.body.appendChild(el); GA_POP=el;
  setTimeout(()=>{ el.classList.add("out"); setTimeout(()=>{ el.remove(); if(GA_POP===el) GA_POP=null; },500); },ok?2300:2000);
  if(ok&&(streak===3||streak===5||streak>=8&&streak%4===0)) setTimeout(()=>goatLeap(Math.random()<.5?1:-1),350); }
/* 5. a dancing goat on a finished quiz / new record */
function goatDance(){ if(GA_RM) return; const el=document.createElement("div"); el.className="ga-dance"; el.innerHTML=`<img src="${gsrc("dance")}" alt="">`; document.body.appendChild(el); setTimeout(()=>el.classList.add("out"),3300); setTimeout(()=>el.remove(),3800); }
let GA_LAST="", GA_STREAK=0, GA_DONE=null;
const _render15=render;
render=function(){ _render15.apply(this,arguments);
  try{ if(quiz&&!quiz.done){ const it=quiz.items[quiz.i]; const key=quiz.i+":"+it.id; quiz._ga=quiz._ga||{}; if(it.pick!==null&&!quiz._ga[key]&&quiz.mode!=="exam"){ quiz._ga[key]=1; GA_LAST=key; const ok=it.pick===0; GA_STREAK=ok?GA_STREAK+1:0; goatPop(ok,GA_STREAK); } }
    if(quiz&&quiz.done&&GA_DONE!==quiz){ GA_DONE=quiz; const a=quiz.items.filter(x=>x.pick!==null), c=a.filter(x=>x.pick===0).length; if(a.length&&c/a.length>=.6){ setTimeout(goatDance,500); setTimeout(()=>goatLeap(1),900); } }
    if(!quiz) GA_STREAK=0; }catch(e){} };
try{ const _gAward15=gAward; gAward=function(){ const r=_gAward15.apply(this,arguments); setTimeout(goatDance,400); if(r) setTimeout(()=>goatLeap(-1),700); return r; }; }catch(e){}
try{ const st19=document.createElement("style"); st19.textContent=`
@media (prefers-reduced-motion:no-preference){
img.ga-sway{transform-origin:50% 100%;animation:gaSway var(--gat,4s) ease-in-out var(--gad,0s) infinite}
img.ga-bounce{transform-origin:50% 100%;animation:gaBounce calc(var(--gat,4s)*.55) ease-in-out var(--gad,0s) infinite}
img.ga-sleep{transform-origin:50% 100%;animation:gaSleep calc(var(--gat,4s)*1.2) ease-in-out var(--gad,0s) infinite}
.brand img.logo.ga-sway{animation-duration:5.5s}
}
@keyframes gaSway{0%,100%{transform:rotate(0) scaleY(1)}22%{transform:rotate(-2.2deg) scaleY(1.015)}50%{transform:rotate(0) scaleY(.99)}74%{transform:rotate(2deg) scaleY(1.02)}}
@keyframes gaBounce{0%,100%{transform:translateY(0) scale(1,1)}12%{transform:translateY(0) scale(1.04,.95)}35%{transform:translateY(-7%) scale(.97,1.04) rotate(-2deg)}55%{transform:translateY(0) scale(1.03,.97)}70%{transform:translateY(-2%) rotate(1.5deg)}}
@keyframes gaSleep{0%,100%{transform:scale(1,1)}50%{transform:scale(1.015,1.035)}}
img.gfree{pointer-events:auto;cursor:pointer;-webkit-tap-highlight-color:transparent}
img.ga-hop,.ga-hero.ga-hop{animation:gaHop .85s cubic-bezier(.3,1.4,.5,1) both!important}
@keyframes gaHop{0%{transform:scale(1,1)}15%{transform:scale(1.12,.86) translateY(4%)}45%{transform:scale(.92,1.1) translateY(-22%) rotate(-8deg)}65%{transform:scale(1.04,.96) translateY(0) rotate(4deg)}80%{transform:scale(.98,1.03) translateY(-5%)}100%{transform:none}}
.ga-p{position:fixed;z-index:9999;pointer-events:none;font-size:20px;transform:translate(-50%,-50%);animation:gaP 1.05s cubic-bezier(.2,.7,.3,1) forwards}
@keyframes gaP{0%{opacity:0;transform:translate(-50%,-50%) scale(.4)}15%{opacity:1}100%{opacity:0;transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy) + 40px)) rotate(var(--rot)) scale(1)}}
.ga-run{position:fixed;left:0;bottom:calc(92px + env(safe-area-inset-bottom,0px));z-index:9998;pointer-events:none;width:120px;animation:gaRunX 3.3s linear forwards}
.ga-run img{width:100%;display:block;animation:gaRunY .52s ease-in-out infinite;transform-origin:50% 100%}
.ga-run.rev{animation-name:gaRunXr}.ga-run.rev img{scale:-1 1}
@keyframes gaRunX{from{transform:translateX(-140px)}to{transform:translateX(calc(100vw + 20px))}}
@keyframes gaRunXr{from{transform:translateX(calc(100vw + 20px))}to{transform:translateX(-140px)}}
@keyframes gaRunY{0%,100%{transform:translateY(0) rotate(0) scale(1.04,.94)}20%{transform:translateY(0) rotate(-4deg) scale(1,1)}50%{transform:translateY(-55px) rotate(-10deg) scale(.98,1.04)}80%{transform:translateY(-10px) rotate(4deg)}}
@media (min-width:900px){.ga-run{bottom:20px;width:150px}}
.ga-pop{position:fixed;right:10px;bottom:calc(88px + env(safe-area-inset-bottom,0px));z-index:9997;display:flex;flex-direction:column;align-items:flex-end;gap:4px;pointer-events:none;animation:gaPopIn .55s cubic-bezier(.3,1.5,.5,1) both}
.ga-pop img{height:96px;width:auto;pointer-events:auto;filter:drop-shadow(0 6px 10px rgba(74,15,34,.25));transform-origin:50% 100%}
.ga-pop.ok img{animation:gaNod .7s ease-in-out .45s 2}.ga-pop.no img{animation:gaShake .5s ease-in-out .45s 2}
.ga-bub{background:#fff;color:#7a1d3a;font:900 .9rem var(--f-body,system-ui);padding:7px 12px;border-radius:14px 14px 4px 14px;box-shadow:0 4px 14px rgba(74,15,34,.2);white-space:nowrap}
.ga-pop.no .ga-bub{color:#6b5a48}
.ga-pop.out{animation:gaPopOut .45s ease-in forwards}
@keyframes gaPopIn{from{transform:translateY(120%) rotate(8deg);opacity:0}to{transform:none;opacity:1}}
@keyframes gaPopOut{to{transform:translateY(130%) rotate(-6deg);opacity:0}}
@keyframes gaNod{0%,100%{transform:none}30%{transform:translateY(-14%) rotate(-6deg) scale(.96,1.05)}60%{transform:translateY(0) rotate(4deg) scale(1.04,.96)}}
@keyframes gaShake{0%,100%{transform:none}25%{transform:rotate(-7deg)}75%{transform:rotate(7deg)}}
@media (min-width:900px){.ga-pop{bottom:20px;right:24px}.ga-pop img{height:120px}}
.ga-dance{position:fixed;left:50%;bottom:calc(96px + env(safe-area-inset-bottom,0px));z-index:9998;pointer-events:none;transform:translateX(-50%);animation:gaPopIn .5s cubic-bezier(.3,1.5,.5,1) both}
.ga-dance img{height:170px;transform-origin:50% 100%;animation:gaDance .6s ease-in-out infinite}
.ga-dance.out{animation:gaPopOut .45s ease-in forwards}
@keyframes gaDance{0%,100%{transform:rotate(-8deg) translateY(0) scale(1.03,.97)}25%{transform:rotate(0) translateY(-16px) scale(.97,1.04)}50%{transform:rotate(8deg) translateY(0) scale(1.03,.97)}75%{transform:rotate(0) translateY(-16px) scale(.97,1.04)}}
@media (prefers-reduced-motion:reduce){.ga-run,.ga-pop,.ga-dance,.ga-p{display:none!important}}
`; document.head.appendChild(st19); }catch(e){}
