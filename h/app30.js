/* ---------- v118: «Il percorso» — Duolingo-style path that takes you through the whole syllabus:
   units (one per topic) → 3 short lessons → mistake review → written question → unit test (crown, 80%) → next unit.
   XP for every step, end-of-lesson celebration, the goat waits next to your current step, «Continua» on Home. ---------- */
Object.assign(T.it,{paTitle:"Il tuo percorso",paKick:"Il sistema per passare l'esame",paUnit:"Unità {n}",paLesson:"Lezione {n}",paRev:"Ripasso errori",paOpen:"Domanda scritta",paTest:"Test dell'unità",
 paStart:"Inizia",paCont:"Continua",paLocked:"Completa la tappa precedente per sbloccarla.",paJump:"Salta qui con il test",paJumpD:"Conosci già questo argomento? Supera il test dell'unità (80%) e passa avanti.",
 paDone:"Lezione completata!",paTestOk:"Unità conquistata! 👑",paTestKo:"Ci sei quasi: serve l'80% per la corona.",paXp:"+{n} XP",paAcc:"Precisione",paStreak:"Giorni di fila",paBack:"Continua il percorso",paRetry:"Riprova il test",
 paHome:"Il tuo percorso",paHomeP:"Unità {n} di {t} · {c}",paSee:"Vedi tutto il percorso",paCrowns:"{n} corone su {t}",paAll:"Hai completato tutto il percorso: ora simulazioni d'esame! 🏆",paOpenD:"Scrivi la risposta e confrontala con gli elementi che danno punti."});
Object.assign(T.fr,{paTitle:"Votre parcours",paKick:"La méthode pour réussir l'examen",paUnit:"Unité {n}",paLesson:"Leçon {n}",paRev:"Révision des erreurs",paOpen:"Question rédigée",paTest:"Test de l'unité",
 paStart:"Commencer",paCont:"Continuer",paLocked:"Terminez l'étape précédente pour la débloquer.",paJump:"Sauter ici avec le test",paJumpD:"Vous connaissez déjà ce thème ? Réussissez le test de l'unité (80 %) et passez à la suite.",
 paDone:"Leçon terminée !",paTestOk:"Unité conquise ! 👑",paTestKo:"Presque : il faut 80 % pour la couronne.",paXp:"+{n} XP",paAcc:"Précision",paStreak:"Jours d'affilée",paBack:"Continuer le parcours",paRetry:"Refaire le test",
 paHome:"Votre parcours",paHomeP:"Unité {n} sur {t} · {c}",paSee:"Voir tout le parcours",paCrowns:"{n} couronnes sur {t}",paAll:"Parcours terminé : place aux examens blancs ! 🏆",paOpenD:"Rédigez la réponse et comparez-la aux éléments qui rapportent des points."});
Object.assign(T.en,{paTitle:"Your path",paKick:"The system that gets you through the exam",paUnit:"Unit {n}",paLesson:"Lesson {n}",paRev:"Mistake review",paOpen:"Written question",paTest:"Unit test",
 paStart:"Start",paCont:"Continue",paLocked:"Finish the previous step to unlock it.",paJump:"Jump here with the test",paJumpD:"Already know this topic? Pass the unit test (80%) and move on.",
 paDone:"Lesson complete!",paTestOk:"Unit conquered! 👑",paTestKo:"Almost: you need 80% for the crown.",paXp:"+{n} XP",paAcc:"Accuracy",paStreak:"Day streak",paBack:"Continue the path",paRetry:"Retake the test",
 paHome:"Your path",paHomeP:"Unit {n} of {t} · {c}",paSee:"See the whole path",paCrowns:"{n} crowns of {t}",paAll:"Path complete: time for mock exams! 🏆",paOpenD:"Write your answer and compare it with the points that score marks."});

const PWK="wset3-path";
let PW=(()=>{ try{ const x=JSON.parse(lsGet(PWK)||"null"); if(x&&x.n) return x; }catch(e){} return {n:{},xp:0,jump:{}}; })();
function paSave(){ try{ lsSet(PWK,JSON.stringify(PW)); }catch(e){} }
let PWCUR=null;
const PWU=GROUPS.flatMap(g=>g.c).filter(c=>BANK.some(b=>b.c===c));
const PWGRP=c=>{ const g=GROUPS.find(g=>g.c.includes(c)); return g?g.k:"r"; };
function paNodes(c){ const n=[{k:"l",i:1},{k:"l",i:2},{k:"l",i:3},{k:"rv",i:0}]; if(OPEN.some(o=>o.c===c)) n.push({k:"op",i:0}); n.push({k:"ck",i:0}); return n; }
const paKey=(c,x)=>c+"|"+x.k+x.i;
function paIsDone(c,x){ if(x.k==="op"){ const o=OPEN.find(o=>o.c===c); return !!(PW.n[paKey(c,x)]||(o&&OA[o.id]&&OA[o.id].length)); } const r=PW.n[paKey(c,x)]; return !!r&&(x.k!=="ck"||r.s>=.8); }
function paUnitDone(c){ return paIsDone(c,{k:"ck",i:0}); }
function paUnitOpen(u){ if(u===0) return true; const c=PWU[u]; return paUnitDone(PWU[u-1])||paNodes(c).some(x=>PW.n[paKey(c,x)])||!!PW.jump[c]; }
function paUnlocked(u,j){ if(!paUnitOpen(u)) return false; if(j===0) return true; const c=PWU[u], N=paNodes(c); return paIsDone(c,N[j-1])||paIsDone(c,N[j]); }
function paCurrent(){ for(let u=0;u<PWU.length;u++){ if(!paUnitOpen(u)) continue; const c=PWU[u], N=paNodes(c); for(let j=0;j<N.length;j++){ if(!paIsDone(c,N[j])&&paUnlocked(u,j)) return {u,j}; } } return null; }
function paPick(c,x){ const pool=BANK.filter(b=>b.c===c).sort((a,b)=>(a.p||0)-(b.p||0));
  const fresh=pool.filter(b=>!P.q[b.id]), weak=pool.filter(b=>P.q[b.id]&&(P.e[b.id]&&!P.e[b.id].r||P.q[b.id][1]<P.q[b.id][0]));
  if(x.k==="l"){ const per=Math.max(1,Math.ceil(pool.length/3)), seg=pool.slice((x.i-1)*per,x.i*per); const f=seg.filter(b=>!P.q[b.id]); return shuffle((f.length>=8?f:f.concat(shuffle(seg.filter(b=>P.q[b.id])))).slice(0,8)).map(b=>b.id); }
  if(x.k==="rv"){ const e=activeErrs().filter(id=>BY[id]&&BY[id].c===c); return shuffle(e.concat(weak.map(b=>b.id).filter(id=>!e.includes(id))).concat(shuffle(pool).map(b=>b.id))).filter((v,i,a)=>a.indexOf(v)===i).slice(0,8); }
  return shuffle(weak.map(b=>b.id).slice(0,6).concat(shuffle(pool).map(b=>b.id))).filter((v,i,a)=>a.indexOf(v)===i).slice(0,12); }
function paStart(u,j,jump){ const c=PWU[u], x=paNodes(c)[j];
  if(x.k==="op"){ const o=OPEN.find(o=>o.c===c); PW.n[paKey(c,x)]={s:1,t:Date.now()}; PW.xp+=20; paSave(); if(o){ view="open"; openQ(o.id); window.scrollTo(0,0); } return; }
  const ids=paPick(c,x); if(!ids.length) return; PWCUR={u,j,c,k:x.k,i:x.i,jump:!!jump,saved:false};
  startQuiz(ids,"practice",[c]); }
function paFinish(){ if(!PWCUR||PWCUR.saved||!quiz||!quiz.done) return null; PWCUR.saved=true;
  const ans=quiz.items.filter(x=>x.pick!==null), n=ans.length, c=ans.filter(x=>x.pick===0).length, s=n?c/n:0;
  const x={k:PWCUR.k,i:PWCUR.i}, key=paKey(PWCUR.c,x), prev=PW.n[key];
  let xp=10+c*1+(s===1?10:0); if(x.k==="ck"&&s>=.8) xp+=40;
  if(!prev||s>=prev.s) PW.n[key]={s,t:Date.now()};
  if(x.k==="ck"&&s>=.8&&PWCUR.jump){ paNodes(PWCUR.c).forEach(y=>{ if(!PW.n[paKey(PWCUR.c,y)]) PW.n[paKey(PWCUR.c,y)]={s:1,t:Date.now(),j:1}; }); }
  if(PWCUR.jump) PW.jump[PWCUR.c]=1;
  PW.xp+=xp; paSave(); return {xp,s,c,n,k:x.k}; }
{ const _dx30=duoXP; duoXP=function(){ return _dx30()+(PW.xp||0); }; }
const paIcon=x=>x.k==="l"?"⭐":x.k==="rv"?"🔁":x.k==="op"?"✍️":"🏆";
const paName=x=>x.k==="l"?t("paLesson").replace("{n}",x.i):x.k==="rv"?t("paRev"):x.k==="op"?t("paOpen"):t("paTest");
const PWOFF=[0,46,78,46,0,-46,-78,-46];
function renderPath(){ const cur=paCurrent(), crowns=PWU.filter(paUnitDone).length;
  let h=`<section class="view pav"><div class="pahead"><div><small>${esc(t("paKick"))}</small><h1>${esc(t("paTitle"))}</h1><p class="pacr">👑 ${esc(t("paCrowns").replace("{n}",crowns).replace("{t}",PWU.length))}</p></div>${gfree("n09",96)}</div>`;
  if(!cur) h+=`<p class="paall">${esc(t("paAll"))}</p>`;
  const lastOpen=cur?cur.u:PWU.length-1;
  PWU.forEach((c,u)=>{ const N=paNodes(c), open=paUnitOpen(u), dn=N.filter(x=>paIsDone(c,x)).length;
    h+=`<div class="paunit g-${PWGRP(c)}${open?"":" off"}" id="pau-${u}"><div class="paban"><div><small>${esc(t("paUnit").replace("{n}",u+1))}</small><h2>${esc(chName(c))}</h2></div><span class="paprog">${paUnitDone(c)?"👑":dn+"/"+N.length}</span></div>`;
    if(open||u<=lastOpen+1){
      h+=`<div class="panodes">`+N.map((x,j)=>{ const done=paIsDone(c,x), un=paUnlocked(u,j), isCur=cur&&cur.u===u&&cur.j===j;
        const st=done?"done":isCur?"cur":un?"open":"lock", off=PWOFF[j%PWOFF.length];
        return `<div class="pan" style="--off:${off}px">${isCur?`<span class="pabub">${esc(paName(x))}<b>${esc(t("paStart"))}</b></span>`:""}<button type="button" class="panb ${st} k-${x.k}" data-pan="${u}:${j}" aria-label="${esc(paName(x))}">${done?"✓":paIcon(x)}</button>${isCur?`<span class="pagoat${off>0?" l":""}">${gfree(x.k==="ck"?"g07":"n05",86)}</span>`:""}</div>`; }).join("")+`</div>`;
      if(!open) h+=`<div class="pajump"><p>${esc(t("paJumpD"))}</p><button type="button" class="btn" data-pajump="${u}">🏆 ${esc(t("paJump"))}</button></div>`;
    } else h+=`<div class="pajump"><button type="button" class="btn ghost" data-pajump="${u}">🏆 ${esc(t("paJump"))}</button></div>`;
    h+=`</div>`; });
  return h+`</section>`; }
try{ TABG.path="home"; SUBV.path="home"; SUBT.path="paTitle"; }catch(e){}
document.addEventListener("click",e=>{ const b=e.target.closest&&e.target.closest("[data-pan],[data-pajump],[data-pathgo],[data-paback]"); if(!b) return; e.preventDefault(); e.stopPropagation();
  if(b.hasAttribute("data-paback")){ PWCUR=null; quiz=null; go("path"); setTimeout(paScroll,60); return; }
  if(b.dataset.pathgo){ const cur=paCurrent(); if(cur) paStart(cur.u,cur.j); else go("path"); return; }
  if(b.dataset.pajump){ const u=+b.dataset.pajump; paStart(u,paNodes(PWU[u]).length-1,true); return; }
  const [u,j]=b.dataset.pan.split(":").map(Number);
  if(!paUnlocked(u,j)&&!paIsDone(PWU[u],paNodes(PWU[u])[j])){ b.classList.remove("shake"); void b.offsetWidth; b.classList.add("shake"); b.title=t("paLocked"); return; }
  paStart(u,j); },true);
function paScroll(){ const c=document.querySelector(".panb.cur"); if(c) c.scrollIntoView({block:"center",behavior:"smooth"}); }
/* end of a path lesson: celebration on top of the usual results */
{ const _rr30=renderResult; renderResult=function(){ const h=_rr30.apply(this,arguments); if(!PWCUR) return h;
    const r=PWCUR.res||(PWCUR.res=paFinish()); if(!r) return h;
    const ok=r.k!=="ck"||r.s>=.8, title=r.k==="ck"?(ok?t("paTestOk"):t("paTestKo")):t("paDone");
    const cel=`<section class="view pacel"><div class="pacg">${gfree(ok?"dance":"n04",150)}</div><h1>${esc(title)}</h1>
      <div class="pastats"><div class="ps xp"><small>XP</small><b>${esc(t("paXp").replace("{n}",r.xp))}</b></div><div class="ps ac"><small>${esc(t("paAcc"))}</small><b>${Math.round(r.s*100)}%</b></div><div class="ps st"><small>${esc(t("paStreak"))}</small><b>🔥 ${duoStreak()}</b></div></div>
      <button type="button" class="pago" data-paback>${esc(ok?t("paBack"):t("paRetry"))}</button></section>`;
    if(ok) setTimeout(()=>{ try{ cheers(40); }catch(e){} },150);
    return cel+h; }; }
/* Home: «Continua» card at the top */
{ const _rh30=renderHome; renderHome=function(){ const h=_rh30.apply(this,arguments); try{
    const cur=paCurrent(), u=cur?cur.u:PWU.length-1, c=PWU[u], N=paNodes(c), dn=N.filter(x=>paIsDone(c,x)).length, x=cur?N[cur.j]:null;
    const card=`<div class="pahome g-${PWGRP(c)}"><div class="pahx"><small>${esc(t("paHome"))}</small><h2>${esc(chName(c))}</h2><p>${esc(t("paHomeP").replace("{n}",u+1).replace("{t}",PWU.length).replace("{c}",x?paName(x):"👑"))}</p>
      <div class="pabar"><i style="width:${Math.round(dn/N.length*100)}%"></i></div><div class="pahb"><button type="button" class="pago" data-pathgo="1">${esc(dn?t("paCont"):t("paStart"))} ▸</button><button type="button" class="palink" data-go="path">${esc(t("paSee"))}</button></div></div><div class="pahg">${gfree("n05",110)}</div></div>`;
    return h.replace(/(<button type="button" class="hero2")/,card+"$1"); }catch(e){ return h; } }; }
/* onboarding: «Start the first lesson» opens the path */
{ const _rs30=renderStart; renderStart=function(){ let h=_rs30.apply(this,arguments); return h.replace(/data-plact="[^"]*">([^<]*)<\/button>/,'data-pathgo="1">$1</button>'); }; }
/* after a path step, coming back to the path scrolls to the current node */
{ const _r30=render; render=function(){ const r=_r30.apply(this,arguments); if(view==="path"&&!quiz) setTimeout(paScroll,80); return r; }; }
try{ const st30=document.createElement("style"); st30.textContent=`
.pav{max-width:620px;margin:0 auto}
.pahead{display:flex;justify-content:space-between;align-items:flex-end;gap:10px;margin:4px 0 14px}.pahead small{font-weight:800;letter-spacing:.14em;text-transform:uppercase;font-size:.7rem;color:var(--gold,#b8862c)}
.pahead h1{margin:2px 0}.pacr{margin:0;font-weight:800;color:var(--muted,#7b6a5c)}
.paall{font-weight:800;text-align:center;padding:14px;border-radius:16px;background:#fff6e0}
.paunit{margin:0 0 26px}.paunit.off .paban{filter:grayscale(.6);opacity:.75}
.paban{position:relative;isolation:isolate;overflow:hidden;display:flex;justify-content:space-between;align-items:center;gap:10px;padding:16px 18px;border-radius:20px;color:#fff;box-shadow:0 14px 30px -18px rgba(60,15,30,.7),inset 0 0 0 1px rgba(255,236,200,.22);position:sticky;top:8px;z-index:4}
.paban:before{content:"";position:absolute;inset:6px;border-radius:15px;border:1px solid rgba(255,226,170,.35);pointer-events:none}
.paban:after{content:"";position:absolute;inset:0;z-index:-1;opacity:.7;background-image:radial-gradient(circle,rgba(255,236,200,.5) 0 1.4px,transparent 2.2px),radial-gradient(circle,rgba(255,236,200,.28) 0 2px,transparent 2.8px);background-size:60px 76px,96px 110px;animation:fizz 12s linear infinite}
.paban small{font-weight:800;letter-spacing:.14em;text-transform:uppercase;font-size:.68rem;color:#f6d98f}.paban h2{margin:2px 0 0;color:#fff!important;font-size:1.3rem}
.paprog{font-weight:900;background:rgba(0,0,0,.2);border-radius:999px;padding:4px 12px}
.g-t .paban,.pahome.g-t{background:radial-gradient(130% 140% at 0% 0%,#c25a7a,#6b2d5c 55%,#2f1430)}
.g-f .paban,.pahome.g-f{background:radial-gradient(130% 140% at 0% 0%,#3f8a6e,#1f6f6b 55%,#123d3b)}
.g-r .paban,.pahome.g-r{background:radial-gradient(130% 140% at 0% 0%,#a3264f,#7a1838 55%,#3e0f22)}
.g-s .paban,.pahome.g-s{background:radial-gradient(130% 140% at 0% 0%,#c08a35,#8a5a1c 55%,#4a2e0c)}
.panodes{display:flex;flex-direction:column;align-items:center;gap:18px;padding:22px 0 6px}
.pan{position:relative;transform:translateX(var(--off))}
.panb{width:76px;height:76px;border-radius:50%;border:0;font-size:2rem;cursor:pointer;color:#fff;position:relative;transition:transform .1s}
.panb:active{transform:translateY(4px)}
.panb.open,.panb.cur{background:linear-gradient(180deg,#b02d5a,#8c1d40);box-shadow:0 7px 0 #5a1029}
.panb.cur{box-shadow:0 7px 0 #5a1029,0 0 0 8px rgba(194,24,91,.18);animation:papulse 1.8s ease-in-out infinite}
@keyframes papulse{50%{box-shadow:0 7px 0 #5a1029,0 0 0 14px rgba(194,24,91,.06)}}
.panb.done{background:linear-gradient(180deg,#f3d58c,#d4a23a);box-shadow:0 7px 0 #a87a22;color:#5a3a10;font-weight:900}
.panb.lock{background:#e7dfd8;box-shadow:0 7px 0 #cbbfb5;filter:grayscale(1);opacity:.7}
.panb.k-ck.open,.panb.k-ck.cur{background:linear-gradient(180deg,#e0a93a,#b97a12);box-shadow:0 7px 0 #7a4f08}
.panb.shake{animation:shake .35s}@keyframes shake{25%{transform:translateX(-6px)}50%{transform:translateX(6px)}75%{transform:translateX(-3px)}}
.pabub{position:absolute;bottom:calc(100% + 10px);left:50%;transform:translateX(-50%);white-space:nowrap;background:var(--surface,#fff);border:2px solid var(--line,#eadfd4);border-radius:14px;padding:6px 12px;font-weight:800;font-size:.85rem;display:flex;flex-direction:column;align-items:center;animation:bob 2.4s ease-in-out infinite}
.pabub b{color:var(--wine,#8c1d40);text-transform:uppercase;font-size:.75rem;letter-spacing:.08em}
.pabub:after{content:"";position:absolute;top:100%;left:50%;transform:translateX(-50%);border:7px solid transparent;border-top-color:var(--line,#eadfd4)}
@keyframes bob{50%{transform:translate(-50%,-5px)}}
.pagoat{position:absolute;top:50%;left:calc(100% + 18px);transform:translateY(-55%)}.pagoat.l{left:auto;right:calc(100% + 18px)}
.pagoat .gfree{animation:pahop 3.2s ease-in-out infinite;transform-origin:50% 100%}
@keyframes pahop{0%,60%,100%{transform:translateY(0)}70%{transform:translateY(3px) scale(1.03,.96)}80%{transform:translateY(-18px)}90%{transform:translateY(0)}}
.pajump{text-align:center;padding:10px 0}.pajump p{margin:0 0 8px;color:var(--muted,#7b6a5c);font-size:.9rem}
.pacel{text-align:center;max-width:560px;margin:0 auto 10px;padding:10px 0 18px;border-bottom:1px dashed var(--line,#eadfd4)}
.pacel h1{margin:8px 0 14px}.pacg{display:flex;justify-content:center}
.pastats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:0 0 16px}
.ps{border-radius:16px;border:2px solid;padding:8px 6px;font-weight:900}.ps small{display:block;font-size:.7rem;letter-spacing:.08em;text-transform:uppercase;color:#fff;margin:-8px -6px 6px;padding:4px;border-radius:12px 12px 0 0}
.ps.xp{border-color:#d4a23a}.ps.xp small{background:#d4a23a}.ps.ac{border-color:#2e7d32}.ps.ac small{background:#2e7d32}.ps.st{border-color:#e65100}.ps.st small{background:#e65100}
.ps b{font-size:1.3rem}
.pago{font:inherit;font-weight:900;text-transform:uppercase;letter-spacing:.04em;min-height:52px;padding:0 26px;border-radius:16px;border:0;background:#8c1d40;color:#fff;box-shadow:0 5px 0 #5a1029;cursor:pointer}
.pago:active{transform:translateY(3px);box-shadow:0 2px 0 #5a1029}
.pahome{position:relative;isolation:isolate;overflow:hidden;display:flex;align-items:flex-end;justify-content:space-between;gap:8px;border-radius:24px;color:#fff;padding:18px 0 0 18px;margin:0 0 14px;box-shadow:0 18px 40px -22px rgba(60,15,30,.6),inset 0 0 0 1px rgba(255,236,200,.22)}
.pahome:before{content:"";position:absolute;inset:7px;border-radius:18px;border:1px solid rgba(255,226,170,.35);pointer-events:none}
.pahx{position:relative;z-index:2;padding-bottom:18px;flex:1;min-width:0}.pahx small{font-weight:800;letter-spacing:.14em;text-transform:uppercase;font-size:.68rem;color:#f6d98f}.pahx h2{color:#fff!important;margin:2px 0 4px;font-size:1.45rem}.pahx p{margin:0 0 10px;color:rgba(255,248,240,.88);font-size:.9rem}
.pabar{height:10px;border-radius:9px;background:rgba(255,255,255,.2);overflow:hidden;margin-bottom:12px}.pabar i{display:block;height:100%;background:linear-gradient(90deg,#f6d98f,#d4a23a)}
.pahb{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.pahome .pago{background:#fff;color:#8c1d40;box-shadow:0 5px 0 rgba(0,0,0,.25)}
.palink{font:inherit;font-weight:800;border:0;background:none;color:#fff;text-decoration:underline;cursor:pointer}
.pahg{flex:none;align-self:flex-end;margin-right:-4px}
@media (max-width:420px){.panb{width:66px;height:66px;font-size:1.7rem}.pagoat .gfree{height:70px!important}}
`; document.head.appendChild(st30); }catch(e){}
