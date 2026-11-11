/* ---------- v127: level sessions from the site — 50 mixed questions or 50 open questions; the result is unlocked by creating the account ---------- */
Object.assign(T.it,{lvMixT:"Sessione di livello · 50 domande miste",lvOpenT:"Sessione di livello · 50 domande aperte",lvOf:"Domanda {i} di {n}",lvNext:"Domanda successiva →",lvSkip:"Salta",lvEnd:"Termina e vedi il risultato",
 lvSaved:"Risposta corretta e salvata ✓",lvLockT:"Il tuo risultato è pronto",lvLockP:"Crea il tuo account gratuito per vedere punteggio, livello e punti deboli. Il risultato resta salvato nel tuo profilo.",lvLockGo:"Crea l'account e vedi il risultato",
 lvResT:"Risultato della sessione",lvResMix:"{c} risposte giuste su {n}",lvResOpen:"{s} punti su {m}",lvDone:"{n} domande completate",lvPlan:"Crea il mio piano dai punti deboli",lvAgain:"Nuova sessione"});
Object.assign(T.fr,{lvMixT:"Session de niveau · 50 questions mixtes",lvOpenT:"Session de niveau · 50 questions ouvertes",lvOf:"Question {i} sur {n}",lvNext:"Question suivante →",lvSkip:"Passer",lvEnd:"Terminer et voir le résultat",
 lvSaved:"Réponse corrigée et enregistrée ✓",lvLockT:"Votre résultat est prêt",lvLockP:"Créez votre compte gratuit pour voir votre score, votre niveau et vos points faibles. Le résultat reste enregistré dans votre profil.",lvLockGo:"Créer le compte et voir le résultat",
 lvResT:"Résultat de la session",lvResMix:"{c} bonnes réponses sur {n}",lvResOpen:"{s} points sur {m}",lvDone:"{n} questions terminées",lvPlan:"Créer mon plan à partir des points faibles",lvAgain:"Nouvelle session"});
Object.assign(T.en,{lvMixT:"Level session · 50 mixed questions",lvOpenT:"Level session · 50 written questions",lvOf:"Question {i} of {n}",lvNext:"Next question →",lvSkip:"Skip",lvEnd:"Finish and see my result",
 lvSaved:"Answer marked and saved ✓",lvLockT:"Your result is ready",lvLockP:"Create your free account to see your score, your level and your weak points. The result stays saved in your profile.",lvLockGo:"Create my account and see the result",
 lvResT:"Session result",lvResMix:"{c} correct out of {n}",lvResOpen:"{s} marks out of {m}",lvDone:"{n} questions completed",lvPlan:"Build my plan from my weak points",lvAgain:"New session"});
if(T.es) Object.assign(T.es,{lvMixT:"Sesión de nivel · 50 preguntas mixtas",lvOpenT:"Sesión de nivel · 50 preguntas abiertas",lvOf:"Pregunta {i} de {n}",lvNext:"Siguiente pregunta →",lvSkip:"Saltar",lvEnd:"Terminar y ver el resultado",
 lvSaved:"Respuesta corregida y guardada ✓",lvLockT:"Tu resultado está listo",lvLockP:"Crea tu cuenta gratuita para ver tu puntuación, tu nivel y tus puntos débiles. El resultado queda guardado en tu perfil.",lvLockGo:"Crear la cuenta y ver el resultado",
 lvResT:"Resultado de la sesión",lvResMix:"{c} respuestas correctas de {n}",lvResOpen:"{s} puntos de {m}",lvDone:"{n} preguntas completadas",lvPlan:"Crear mi plan con mis puntos débiles",lvAgain:"Nueva sesión"});

const LVK="wset3-lv-result";
let LVS=null;   /* running session: {k:"mix"} or {k:"open",ids,i,done:[]} */
const lvGroupOf=c=>{ const g=GROUPS.find(G=>G.c.includes(c)); return g?g:null; };
const lvGName=g=>{ try{ return (g.n&&(g.n[lang]||g.n.en||g.n.it))||g.k; }catch(e){ return g.k; } };
const lvAcc=()=>window.twgAccount||null;
const lvNeedAcc=()=>{ const A=lvAcc(); return !!(A&&A.enabled&&A.enabled()&&!A.signedIn()); };
function lvSpread(pool,n,chOf){ const by={}; pool.forEach(x=>{ const c=chOf(x); (by[c]=by[c]||[]).push(x); });
  Object.values(by).forEach(a=>{ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } });
  const keys=GROUPS.flatMap(g=>g.c).filter(c=>by[c]&&by[c].length), out=[]; let r=0;
  while(out.length<n&&keys.some(k=>by[k].length)){ const k=keys[r++%keys.length]; if(by[k].length) out.push(by[k].pop()); }
  return shuffle(out); }
function lvStartMix(){ const ids=lvSpread(BANK.map(b=>b.id),50,id=>{ const b=BANK.find(q=>q.id===id); return b?b.c:""; });
  LVS={k:"mix"}; startQuiz(ids,"practice",[]); }
function lvStartOpen(){ const ids=lvSpread(OPEN.map(o=>o.id),50,id=>OBY[id]?OBY[id].c:"");
  LVS={k:"open",ids,i:0,done:[]}; lvShowOpen(); }
function lvShowOpen(){ const id=LVS.ids[LVS.i]; delete ODR[id]; if(OA[id]) oSel[id]=-1; view="open"; openQ(id); window.scrollTo(0,0); }
function lvStore(r){ r.ts=Date.now(); try{ lsSet(LVK,JSON.stringify(r)); }catch(e){} }
function lvLoad(){ try{ return JSON.parse(lsGet(LVK)||"null"); }catch(e){ return null; } }

/* mixed session: compute and store the result when the quiz ends */
function lvFromQuiz(){ const it=quiz.items.filter(x=>x.pick!==null), by={};
  it.forEach(x=>{ const b=BANK.find(q=>q.id===x.id); const g=b&&lvGroupOf(b.c); if(!g) return; (by[g.k]=by[g.k]||{k:g.k,n:0,c:0}); by[g.k].n++; if(x.pick===0) by[g.k].c++; });
  return {k:"mix",n:it.length,c:it.filter(x=>x.pick===0).length,g:Object.values(by)}; }
function lvFromOpen(){ const by={}; let s=0,m=0;
  LVS.done.forEach(id=>{ const a=(OA[id]||[]).slice(-1)[0]; const o=OBY[id]; if(!a||!o) return; s+=a.s; m+=a.m; const g=lvGroupOf(o.c); if(!g) return; (by[g.k]=by[g.k]||{k:g.k,n:0,c:0}); by[g.k].n+=a.m; by[g.k].c+=a.s; });
  return {k:"open",n:LVS.done.length,s:Math.round(s*10)/10,m,g:Object.values(by)}; }

function lvLockHTML(){ return `<section class="view lvres"><div class="lvgoat">${gfree("n13",150)}</div>
  <h1>${esc(t("lvLockT"))}</h1><div class="lvblur" aria-hidden="true"><b>?? %</b><i></i><i></i><i></i></div><p>${esc(t("lvLockP"))}</p>
  <button type="button" class="obgo" data-lv="acct">${esc(t("lvLockGo"))}</button>
  <button type="button" id="r-again" hidden></button><button type="button" id="r-back" hidden></button></section>`; }
function lvResHTML(r){ if(!r) return "";
  const pct=r.k==="mix"?(r.n?r.c/r.n:0):(r.m?r.s/r.m:0), P_=Math.round(pct*100), lvl=pct<.4?"b":pct<.7?"i":"a";
  const rows=(r.g||[]).slice().sort((a,b)=>a.c/a.n-b.c/b.n).map(x=>{ const g=GROUPS.find(G=>G.k===x.k); const v=x.n?Math.round(x.c/x.n*100):0;
    return `<li class="asrow"><span>${esc(g?lvGName(g):x.k)}</span><i><b style="width:${v}%"></b></i><em>${v}%</em></li>`; }).join("");
  const line=r.k==="mix"?t("lvResMix").replace("{c}",r.c).replace("{n}",r.n):t("lvResOpen").replace("{s}",r.s).replace("{m}",r.m);
  return `<section class="view lvres asres"><div class="lvgoat">${gfree(lvl==="a"?"dance":lvl==="i"?"n04":"n13",140)}</div>
    <p class="aslvlk">${esc(t("lvResT"))}</p><div class="lvpct">${P_}%</div><h1>${esc(t("asLvl_"+lvl))}</h1><p class="asscore">${esc(line)} · ${esc(t("lvDone").replace("{n}",r.n))}</p>
    <p class="aslvlp">${esc(t("asLvlP_"+lvl))}</p><ul class="asrows">${rows}</ul>
    <button type="button" class="obgo" data-lv="plan">${esc(t("lvPlan"))}</button><button type="button" class="oblater" data-lv="again">${esc(t("lvAgain"))}</button>
    <button type="button" id="r-again" hidden></button><button type="button" id="r-back" hidden></button></section>`; }

{ const _rr38=renderResult; renderResult=function(){ if(!LVS||LVS.k!=="mix"||!quiz||!quiz.done) return _rr38.apply(this,arguments);
    if(!LVS.r){ LVS.r=lvFromQuiz(); lvStore(LVS.r); }
    return lvNeedAcc()?lvLockHTML():lvResHTML(LVS.r); }; }

/* open session: progress on top, "next" after marking, per-question marking hidden until the end */
{ const _ro38=renderOQ; renderOQ=function(){ let h=_ro38.apply(this,arguments); if(!LVS||LVS.k!=="open"||oq!==LVS.ids[LVS.i]) return h;
    const n=LVS.ids.length, i=LVS.i, graded=(OA[oq]||[]).length&&oSel[oq]>=0&&LVS.done.includes(oq);
    const top=`<div class="lvtop"><span class="label">${esc(t("lvOpenT"))}</span><b>${esc(t("lvOf").replace("{i}",i+1).replace("{n}",n))}</b><div class="lvbar"><i style="width:${Math.round(i/n*100)}%"></i></div></div>`;
    h=h.replace('<section class="view">','<section class="view lvopen">'+top);
    const nav=graded?`<p class="lvsaved">${esc(t("lvSaved"))}</p><div class="lvnav"><button type="button" class="obgo" data-lv="next">${esc(i+1<n?t("lvNext"):t("lvEnd"))}</button>${i+1<n?`<button type="button" class="oblater" data-lv="end">${esc(t("lvEnd"))}</button>`:""}</div>`
      :`<div class="lvnav"><button type="button" class="oblater" data-lv="skip">${esc(t("lvSkip"))}</button>${LVS.done.length?`<button type="button" class="oblater" data-lv="end">${esc(t("lvEnd"))}</button>`:""}</div>`;
    const j=h.lastIndexOf("</section>"); if(j>0) h=h.slice(0,j)+nav+h.slice(j);
    return h; }; }
const lvHide=()=>!!(LVS&&LVS.k==="open"&&view==="open"&&oq===LVS.ids[LVS.i]);
{ const _gv38=gradeView; gradeView=function(){ return lvHide()?"":_gv38.apply(this,arguments); }; }
{ const _cb38=chatBox; chatBox=function(){ return lvHide()?"":_cb38.apply(this,arguments); }; }
{ const _go38=gradeOpen; gradeOpen=async function(id){ const r=await _go38.apply(this,arguments); try{ if(LVS&&LVS.k==="open"&&id===LVS.ids[LVS.i]&&(OA[id]||[]).length&&!LVS.done.includes(id)){ LVS.done.push(id); render(); } }catch(e){} return r; }; }

function lvFinishOpen(){ LVS.r=lvFromOpen(); lvStore(LVS.r); oq=null; view="lvres"; render(); window.scrollTo(0,0); }
function renderLvRes(){ const r=(LVS&&LVS.r)||lvLoad(); return lvNeedAcc()?lvLockHTML():lvResHTML(r); }
try{ TABG.lvres="home"; SUBV.lvres="home"; SUBT.lvres="lvResT"; }catch(e){}

window.addEventListener("click",e=>{ const b=e.target.closest&&e.target.closest("[data-lv]"); if(!b) return; e.preventDefault(); e.stopPropagation(); const k=b.dataset.lv;
  if(k==="next"){ if(LVS.i+1<LVS.ids.length){ LVS.i++; lvShowOpen(); } else lvFinishOpen(); return; }
  if(k==="skip"){ if(LVS.i+1<LVS.ids.length){ LVS.i++; lvShowOpen(); } else lvFinishOpen(); return; }
  if(k==="end"){ lvFinishOpen(); return; }
  if(k==="acct"){ const A=lvAcc(); if(A) A.open(); return; }
  if(k==="plan"){ LVS=null; quiz=null; go("start"); window.scrollTo(0,0); return; }
  if(k==="again"){ const kk=(LVS&&LVS.k)||((lvLoad()||{}).k)||"mix"; quiz=null; kk==="open"?lvStartOpen():lvStartMix(); return; }
},true);
/* signed in → show the stored result */
window.addEventListener("twg-account",()=>{ const A=lvAcc(); if(!A||!A.signedIn()) return; const r=lvLoad(); if(!r||Date.now()-r.ts>6*3600*1000) return;
  if((quiz&&quiz.done&&LVS)||view==="lvres"){ render(); } else if(!quiz&&view!=="lvres"&&lsGet("wset3-lv-show")==="1"){ try{ localStorage.removeItem("wset3-lv-show"); }catch(e){} view="lvres"; render(); } });
window.addEventListener("click",e=>{ if(e.target.closest&&e.target.closest('[data-lv="acct"]')) try{ lsSet("wset3-lv-show","1"); }catch(x){} },true);

/* entry from the site: #go=lvmix / #go=lvopen */
const LVH0=location.hash||"";
function lvHash(e){ const h=e&&e.newURL?(new URL(e.newURL).hash||""):(location.hash||LVH0);
  const m=/[#&]go=(lvmix|lvopen)/.exec(h); if(!m) return; history.replaceState(null,"",location.pathname+location.search);
  try{ lsSet("wset3-onb","1"); }catch(x){} m[1]==="lvopen"?lvStartOpen():lvStartMix(); }
setTimeout(lvHash,150); window.addEventListener("hashchange",lvHash,true);

try{ const st38=document.createElement("style"); st38.textContent=`
.lvres{max-width:560px;margin:0 auto;padding:10px 4px 30px;text-align:center}
.lvres .lvgoat{display:flex;justify-content:center}
.lvres h1{margin:6px 0 10px}
.lvres .obgo{width:100%;margin-top:6px}.lvres .oblater{width:100%;margin-top:10px}
.lvpct{font:800 52px/1 Fraunces,Georgia,serif;color:var(--wine,#8c1d40);margin-top:4px}
.lvblur{position:relative;margin:6px auto 16px;max-width:320px;padding:18px;border-radius:16px;background:var(--surface,#fff);box-shadow:inset 0 0 0 1px var(--line,#eadfd3);filter:blur(5px);user-select:none}
.lvblur b{display:block;font:800 40px/1 Fraunces,Georgia,serif;color:var(--wine,#8c1d40);margin-bottom:12px}
.lvblur i{display:block;height:10px;border-radius:6px;margin:8px 0;background:linear-gradient(90deg,#b8892e 60%,#efe6dc 60%)}
.lvblur i+i{background:linear-gradient(90deg,#5f7a3c 35%,#efe6dc 35%)}.lvblur i+i+i{background:linear-gradient(90deg,#8c1d40 80%,#efe6dc 80%)}
.lvtop{display:grid;gap:6px;margin:0 0 12px}.lvtop b{font-size:.95rem}
.lvbar{height:8px;border-radius:5px;background:var(--sunk,#f1e7df);overflow:hidden}.lvbar i{display:block;height:100%;background:linear-gradient(90deg,#8c1d40,#b8892e);border-radius:5px}
.lvsaved{margin:14px 0 6px;font-weight:800;color:#5f7a3c;text-align:center}
.lvnav{display:grid;gap:10px;margin-top:14px}
`; document.head.appendChild(st38); }catch(e){}
