/* ---------- v99: never lose ANY exercise (written answers, mock exam, tasting, flashcards, map game, matching, games) — resume card/pill ---------- */
Object.assign(T.it,{exResume:"Riprendi",exOpen:"Risposta scritta",exMock:"Simulazione d'esame",exSat:"Degustazione",exFlash:"Flashcard",exMap:"Gioco delle mappe",exMatch:"Abbinamenti",exGame:"Gioco",exWhere:"riprendi da dove eri"});
Object.assign(T.fr,{exResume:"Reprendre",exOpen:"Réponse rédigée",exMock:"Examen blanc",exSat:"Dégustation",exFlash:"Cartes mémoire",exMap:"Jeu des cartes",exMatch:"Associations",exGame:"Jeu",exWhere:"reprenez là où vous étiez"});
Object.assign(T.en,{exResume:"Resume",exOpen:"Written answer",exMock:"Mock exam",exSat:"Tasting",exFlash:"Flashcards",exMap:"Map game",exMatch:"Matching",exGame:"Game",exWhere:"pick up where you left off"});
const EXK="wset3-pausedex";
const exSafe=x=>x&&["open","mock","sat","flash"].includes(x.k);
let EXS=(()=>{ try{ const a=JSON.parse(lsGet(EXK)||"[]"); return Array.isArray(a)?a.filter(exSafe):[]; }catch(e){ return []; } })();
function exSave(){ try{ lsSet(EXK,JSON.stringify(EXS.filter(exSafe).map(x=>x.k==="flash"?{k:x.k,o:x.o}:{k:x.k,id:x.id}))); }catch(e){} }
function exCur(){
  if(quiz) return null;
  try{
    if(view==="open"&&oq) return {k:"open",id:oq};
    if(view==="exam"&&MK&&MK.go&&!MK.fin&&!MKPEND) return {k:"mock"};
    if(view==="sat"&&satEdit&&satCur&&!satShow) return {k:"sat"};
    if(view==="flash"&&FCX&&FCX.i<FCX.list.length) return {k:"flash",o:FCX};
    if(view==="maps"&&mg&&!mg.fin&&!mg.exam&&mg.mode!=="explore") return {k:"map",o:mg};
    if(view==="match"&&ML&&!ML.fin) return {k:"match",o:ML};
    if(typeof GM!=="undefined"&&GM&&GM.k===view&&!GM.fin&&!(GEXT[view]&&GEXT[view].go)) return {k:"game",o:GM};
    if(view==="g_phen"&&typeof PG!=="undefined"&&PG&&!PG.fin) return {k:"phen",o:PG};
    if(view==="g_terr"&&typeof TR!=="undefined"&&TR&&!TR.fin) return {k:"terr",o:TR};
  }catch(e){}
  return null; }
const exSame=(a,b)=>a&&b&&a.k===b.k&&(a.k==="open"?a.id===b.id:a.o?a.o===b.o:true);
function exStill(x){ try{
  if(x.k==="open") return !!OBY[x.id];
  if(x.k==="mock") return !!(MK&&!MK.fin);
  if(x.k==="sat") return !!satCur;
  if(x.k==="flash") return x.o&&x.o.i<x.o.list.length;
  return x.o&&!x.o.fin; }catch(e){ return false; } }
function exAdd(x){ if(!x||!exStill(x)) return; EXS=[x].concat(EXS.filter(y=>y.k!==x.k)).slice(0,5); exSave(); }
let EXLAST=null;
const _render17=render;
render=function(){ const before=EXLAST; _render17.apply(this,arguments); const cur=exCur();
  if(before&&!exSame(before,cur)) exAdd(before);
  if(cur){ const n=EXS.length; EXS=EXS.filter(y=>!(y.k===cur.k)); if(EXS.length!==n) exSave(); }
  EXLAST=cur; exUI(); };
function exLabel(x){ const l=L();
  try{
    if(x.k==="open"){ const o=OBY[x.id]; const q=o?String(o.q[l]):""; return [t("exOpen"),(o?chName(o.c)+" · ":"")+(q.length>58?q.slice(0,56)+"…":q)]; }
    if(x.k==="mock"){ return [t("exMock"),`${t("mkSection")} ${MK.si+1}/${MK.secs.length}: ${t("mkS_"+MK.secs[MK.si])}`]; }
    if(x.k==="sat"){ const p=SBY[satCur.pid]; return [t("exSat"),p?p.n:""]; }
    if(x.k==="flash"){ return [t("exFlash"),`${x.o.i+1}/${x.o.list.length}`]; }
    if(x.k==="map"){ const m=MBY[x.o.id]; return [t("exMap"),m?mTitle(m):""]; }
    if(x.k==="match"){ return [t("exMatch"),`${(x.o.ri||0)+1}/${x.o.rounds?x.o.rounds.length:""}`]; }
    if(x.k==="game"){ const nm=GNAME[x.o.k]?t(GNAME[x.o.k]):(GEXT[x.o.k]&&GEXT[x.o.k].nm?t(GEXT[x.o.k].nm):""); return [t("exGame"),nm]; }
    if(x.k==="phen"||x.k==="terr"){ return [t("exGame"),x.k==="phen"?`${(x.o.i||0)+1}/${x.o.n||""}`:`${x.o.r||1}/${x.o.n||""}`]; }
  }catch(e){}
  return [t("exResume"),""]; }
function exGo(x){ quiz=null;
  try{
    if(x.k==="open"){ satShow=null; satEdit=false; mg=null; ML=null; view=trainV="open"; lsSet("wset3-trainv",trainV); openQ(x.id); }
    else if(x.k==="mock"){ oq=null; view="exam"; MK.go=true; saveMK(); render(); }
    else if(x.k==="sat"){ oq=null; view=trainV="sat"; lsSet("wset3-trainv",trainV); satShow=null; satEdit=true; sMsg=""; render(); }
    else if(x.k==="flash"){ oq=null; FCX=x.o; view="flash"; render(); }
    else if(x.k==="map"){ oq=null; ML=null; view=trainV="maps"; lsSet("wset3-trainv",trainV); mg=x.o; render(); }
    else if(x.k==="match"){ oq=null; mg=null; view=trainV="match"; lsSet("wset3-trainv",trainV); ML=x.o; render(); }
    else if(x.k==="game"){ oq=null; GM=x.o; view=x.o.k; render(); if(GM.timer) gTick(); }
    else if(x.k==="phen"){ oq=null; PG=x.o; view="g_phen"; render(); if(typeof pgTimer==="function") pgTimer(); }
    else if(x.k==="terr"){ oq=null; TR=x.o; view="g_terr"; render(); }
  }catch(e){ render(); }
  window.scrollTo(0,0); }
const EXHUB=["home","study","practice","exam","errors","open","sat","play","maps","match","flash","wine","g_phen","g_terr"];
function exUI(){
  document.querySelectorAll(".excards").forEach(x=>x.remove());
  let pill=document.getElementById("expill");
  const busy=!!quiz||!!exCur();
  if(!EXS.length||busy){ if(pill) pill.remove(); return; }
  const m=document.querySelector("#main .view");
  if(EXHUB.includes(view)&&m){ if(pill) pill.remove();
    const d=document.createElement("div"); d.className="excards";
    d.innerHTML=EXS.map((x,k)=>{ const [a,b]=exLabel(x); return `<div class="exrow"><button type="button" class="excard" data-ex="go" data-k="${k}"><span class="pqic">▶</span><span class="pqtx"><b>${esc(t("exResume"))} · ${esc(a)}</b><small>${esc(b||t("exWhere"))}</small></span></button><button type="button" class="exx" data-ex="x" data-k="${k}" aria-label="${esc(t("pqDrop"))}">✕</button></div>`; }).join("");
    const pq=m.querySelector(".pqcards"); if(pq) pq.after(d); else m.prepend(d); return; }
  if(document.getElementById("pqpill")){ if(pill) pill.remove(); return; }
  if(!pill){ pill=document.createElement("div"); pill.id="expill"; document.body.appendChild(pill); }
  const [a,b]=exLabel(EXS[0]);
  pill.innerHTML=`<button type="button" class="pqgo" data-ex="go" data-k="0"><span class="pqic">▶</span><span class="pqtx"><b>${esc(t("exResume"))} · ${esc(a)}</b><small>${esc(b||t("exWhere"))}</small></span></button><button type="button" class="pqx" data-ex="x" data-k="0" aria-label="${esc(t("pqDrop"))}">✕</button>`; }
document.addEventListener("click",e=>{ const b=e.target.closest&&e.target.closest("[data-ex]"); if(!b) return; e.preventDefault(); e.stopPropagation(); const k=+(b.dataset.k||0), x=EXS[k]; if(!x) return;
  if(b.dataset.ex==="go"){ EXS.splice(k,1); exSave(); if(exStill(x)) exGo(x); else { render(); } }
  else { EXS.splice(k,1); exSave(); if(x.k==="mock"&&MK&&!MK.fin){ /* keep the exam itself: still resumable from the Exam page */ } exUI(); } },true);
/* keep FCX across reloads too */
window.addEventListener("pagehide",()=>{ const c=exCur(); if(c&&exSafe(c)){ EXS=[c].concat(EXS.filter(y=>y.k!==c.k)).slice(0,5); exSave(); EXS=EXS.filter(y=>y.k!==c.k); } });
document.addEventListener("visibilitychange",()=>{ if(!document.hidden) return; const c=exCur(); if(c&&exSafe(c)){ const keep=EXS.slice(); EXS=[c].concat(EXS.filter(y=>y.k!==c.k)).slice(0,5); exSave(); EXS=keep; } });
setTimeout(exUI,350);
try{ const st17=document.createElement("style"); st17.textContent=`
#expill{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(86px + env(safe-area-inset-bottom,0px));z-index:60;display:flex;align-items:stretch;border-radius:999px;box-shadow:0 8px 24px rgba(74,15,34,.35);animation:pqin .35s ease-out;max-width:calc(100vw - 32px)}
@media (min-width:900px){#expill{bottom:24px}}
#expill .pqtx b,#expill .pqtx small{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:62vw}
.excards{display:flex;flex-direction:column;gap:8px;margin-bottom:14px}
.exrow{display:flex;align-items:stretch;gap:0;border-radius:16px;overflow:hidden;box-shadow:0 4px 0 #4a0f22;animation:gqin .4s ease-out}
.excard{flex:1;display:flex;align-items:center;gap:12px;border:0;cursor:pointer;padding:12px 14px;background:linear-gradient(120deg,#7a1d3a,#c2185b);color:#fff;font:inherit;text-align:left;min-width:0}
.excard .pqtx{min-width:0}.excard .pqtx b{font-size:1rem;white-space:normal}.excard .pqtx small{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.exx{border:0;cursor:pointer;background:#5a1430;color:#fff;padding:0 14px;font-weight:900}
`; document.head.appendChild(st17); }catch(e){}
