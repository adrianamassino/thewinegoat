/* ---------- v75b: never lose a quiz — leaving it (menu, logo, back, "Esci", reload) pauses it; resume from a button ---------- */
Object.assign(T.it,{pqResume:"Riprendi il quiz",pqKeep:"le tue risposte sono salvate",pqQ:"domanda",pqDrop:"Chiudi",pqMore:"Altro quiz in pausa"});
Object.assign(T.fr,{pqResume:"Reprendre le quiz",pqKeep:"vos réponses sont gardées",pqQ:"question",pqDrop:"Fermer",pqMore:"Autre quiz en pause"});
Object.assign(T.en,{pqResume:"Resume the quiz",pqKeep:"your answers are saved",pqQ:"question",pqDrop:"Dismiss",pqMore:"Another paused quiz"});
const PQK="wset3-pausedqs";
const pqLive=q=>q&&!q.done&&Array.isArray(q.items)&&q.items.length;
let PQS=(()=>{ try{ const x=JSON.parse(lsGet(PQK)||"[]"); return Array.isArray(x)?x.filter(pqLive):[]; }catch(e){ return []; } })();
try{ const old=JSON.parse(lsGet("wset3-pausedq")||"null"); if(pqLive(old)) PQS.unshift(old); lsSet("wset3-pausedq",""); }catch(e){}
try{ const live=JSON.parse(lsGet(PQK+"-live")||"null"); if(pqLive(live)) PQS.unshift(live); }catch(e){}
let PQLAST=null, PQQUIT=false, PQQCOPY=null;
const pqSig=q=>q.items.map(x=>x.id).join(",");
function pqAdd(q){ if(!pqLive(q)||!q.items.some(x=>x.pick===null)) return; const sg=pqSig(q); PQS=[q].concat(PQS.filter(x=>pqSig(x)!==sg)).slice(0,4); pqSave(); }
function pqSave(){ try{ lsSet(PQK,JSON.stringify(PQS)); }catch(e){} }
pqSave();
document.addEventListener("click",e=>{ if(e.target.closest&&e.target.closest("#q-quit")){ PQQUIT=true; try{ PQQCOPY=pqLive(quiz)?JSON.parse(JSON.stringify(quiz)):null; }catch(_){ PQQCOPY=null; } } },true);
const _render12=render;
render=function(){ const before=PQLAST; _render12.apply(this,arguments);
  if(pqLive(quiz)){ let js=""; try{ js=JSON.stringify(quiz); }catch(e){} PQLAST=js?JSON.parse(js):null; try{ lsSet(PQK+"-live",js); }catch(e){} }
  else {
    const sessOf=q=>{ try{ const L_=P.s[P.s.length-1], na=q.items.filter(x=>x.pick!==null).length; if(L_&&Date.now()-L_.t<5000&&L_.n===na&&L_.m===q.mode) return L_.t; }catch(e){} return 0; };
    if(!quiz&&pqLive(before)){ before._sess=sessOf(before); pqAdd(before); }
    else if(quiz&&quiz.done&&PQQUIT&&pqLive(PQQCOPY)){ PQQCOPY._sess=sessOf(PQQCOPY); pqAdd(PQQCOPY); }
    PQLAST=null; PQQUIT=false; PQQCOPY=null; try{ lsSet(PQK+"-live",""); }catch(e){} }
  pqPill(); pqCard(); };
function pqInfo(q){ const n=q.items.length, i=Math.min(n,q.items.filter(x=>x.pick!==null).length+1); return {n,i}; }
function pqPill(){ let el=document.getElementById("pqpill"); if(!PQS.length||quiz||["study","practice","home","exam","errors"].includes(view)){ if(el) el.remove(); return; }
  if(!el){ el=document.createElement("div"); el.id="pqpill"; document.body.appendChild(el); }
  const {n,i}=pqInfo(PQS[0]);
  el.innerHTML=`<button type="button" class="pqgo" data-pq="go" data-k="0"><span class="pqic">▶</span><span class="pqtx"><b>${esc(t("pqResume"))}</b><small>${esc(t("pqQ"))} ${i}/${n}</small></span></button><button type="button" class="pqx" data-pq="x" data-k="0" aria-label="${esc(t("pqDrop"))}">✕</button>`; }
function pqCard(){ document.querySelectorAll(".pqcards").forEach(x=>x.remove()); if(!PQS.length||quiz) return; if(!["study","practice","home","exam","errors"].includes(view)) return;
  const m=document.querySelector("#main .view"); if(!m) return; const d=document.createElement("div"); d.className="pqcards";
  d.innerHTML=PQS.map((q,k)=>{ const {n,i}=pqInfo(q); return k===0?`<button type="button" class="pqcard" data-pq="go" data-k="0"><span class="pqic">▶</span><span class="pqtx"><b>${esc(t("pqResume"))}</b><small>${esc(t("pqQ"))} ${i}/${n} · ${esc(t("pqKeep"))}</small></span><span class="pqbar"><i style="width:${Math.round((i-1)/n*100)}%"></i></span></button>`
    :`<div class="pqmini"><button type="button" data-pq="go" data-k="${k}">▶ ${esc(t("pqMore"))} · ${esc(t("pqQ"))} ${i}/${n}</button><button type="button" class="pqx2" data-pq="x" data-k="${k}" aria-label="${esc(t("pqDrop"))}">✕</button></div>`; }).join("");
  m.prepend(d); }
document.addEventListener("click",e=>{ const b=e.target.closest&&e.target.closest("[data-pq]"); if(!b) return; e.preventDefault(); e.stopPropagation(); const k=+(b.dataset.k||0);
  if(b.dataset.pq==="go"&&PQS[k]){ const q=PQS[k]; PQS.splice(k,1); pqSave();
    if(q._sess){ try{ const j=P.s.findIndex(x=>x.t===q._sess); if(j>=0){ P.s.splice(j,1); save(); } }catch(_){} } delete q._sess;
    quiz=q; render(); window.scrollTo(0,0); }
  else if(b.dataset.pq==="x"){ PQS.splice(k,1); pqSave(); pqPill(); pqCard(); } },true);
window.addEventListener("pagehide",()=>{ if(pqLive(quiz)) try{ lsSet(PQK+"-live",JSON.stringify(quiz)); }catch(e){} });
document.addEventListener("visibilitychange",()=>{ if(document.hidden&&pqLive(quiz)) try{ lsSet(PQK+"-live",JSON.stringify(quiz)); }catch(e){} });
setTimeout(()=>{ pqPill(); pqCard(); },300);
try{ const st15=document.createElement("style"); st15.textContent=`
#pqpill{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(86px + env(safe-area-inset-bottom,0px));z-index:60;display:flex;align-items:stretch;gap:0;border-radius:999px;box-shadow:0 8px 24px rgba(74,15,34,.35);animation:pqin .35s ease-out;max-width:calc(100vw - 32px)}
@media (min-width:900px){#pqpill{bottom:24px}}
@keyframes pqin{from{opacity:0;transform:translate(-50%,12px)}to{opacity:1;transform:translate(-50%,0)}}
.pqgo{display:flex;align-items:center;gap:10px;border:0;cursor:pointer;background:linear-gradient(120deg,#7a1d3a,#c2185b);color:#fff;padding:9px 16px 9px 10px;border-radius:999px 0 0 999px;font:inherit;text-align:left}
.pqic{width:34px;height:34px;border-radius:50%;background:#fff;color:#a3264f;display:grid;place-items:center;font-size:.9rem;flex:none}
.pqtx{display:flex;flex-direction:column;line-height:1.15}.pqtx b{font-size:.95rem;white-space:nowrap}.pqtx small{font-size:.72rem;opacity:.85;font-weight:700}
.pqcard{display:flex;align-items:center;gap:12px;width:100%;border:0;cursor:pointer;border-radius:18px;padding:14px 16px;margin-bottom:14px;background:linear-gradient(120deg,#7a1d3a,#c2185b);color:#fff;font:inherit;text-align:left;box-shadow:0 5px 0 #4a0f22;position:relative;overflow:hidden;animation:gqin .4s ease-out}
.pqcard .pqtx b{font-size:1.1rem}.pqbar{position:absolute;left:0;right:0;bottom:0;height:5px;background:rgba(255,255,255,.2)}.pqbar i{display:block;height:100%;background:#f3cd8a}
.pqcards{display:flex;flex-direction:column;gap:8px;margin-bottom:14px}.pqcards .pqcard{margin-bottom:0}
.pqmini{display:flex;align-items:center;gap:6px}.pqmini button{border:1px solid var(--line,#eadfce);background:var(--surface,#fff);color:#7a1d3a;border-radius:999px;padding:8px 14px;font:800 .82rem var(--f-body,system-ui);cursor:pointer}.pqmini button:first-child{flex:1;text-align:left}
.pqx{border:0;cursor:pointer;background:#5a1430;color:#fff;padding:0 14px;border-radius:0 999px 999px 0;font-weight:900}
`; document.head.appendChild(st15); }catch(e){}
