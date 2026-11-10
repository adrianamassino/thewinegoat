/* ---------- v76: game "Grapes & places" — match each sub-region with its grape ---------- */
Object.assign(T.it,{gTerr:"Uve e territori",gTerrD:"Abbina ogni sottoregione al suo vitigno simbolo: Dão ed Encruzado, Bairrada e Baga…",trChoose:"Scegli un paese",trRound:"Round",trPairs:"Abbina ogni zona al suo vitigno",trZones:"Zone",trGrapes:"Vitigni",trOk:"Giusto!",trNo:"Non è quello",trNext:"Round successivo",trEnd:"Partita finita!",trAgain:"Rigioca",trOther:"Altro paese",trErr:"errori",trTap:"Tocca una zona, poi il suo vitigno."});
Object.assign(T.fr,{gTerr:"Cépages et terroirs",gTerrD:"Associez chaque sous-région à son cépage phare : Dão et encruzado, Bairrada et baga…",trChoose:"Choisissez un pays",trRound:"Manche",trPairs:"Associez chaque zone à son cépage",trZones:"Zones",trGrapes:"Cépages",trOk:"Bravo !",trNo:"Ce n'est pas celui-là",trNext:"Manche suivante",trEnd:"Partie terminée !",trAgain:"Rejouer",trOther:"Autre pays",trErr:"erreurs",trTap:"Touchez une zone, puis son cépage."});
Object.assign(T.en,{gTerr:"Grapes and places",gTerrD:"Match each sub-region with its signature grape: Dão and Encruzado, Bairrada and Baga…",trChoose:"Choose a country",trRound:"Round",trPairs:"Match each area with its grape",trZones:"Areas",trGrapes:"Grapes",trOk:"Correct!",trNo:"Not that one",trNext:"Next round",trEnd:"Game over!",trAgain:"Play again",trOther:"Another country",trErr:"mistakes",trTap:"Tap an area, then its grape."});
try{ TABG.g_terr="play"; SUBV.g_terr="play"; SUBT.g_terr="gTerr"; }catch(e){}
const TRC=["fra","ita","esp","por","ger","aut","nam","chi","arg","rsaz","ausz","nzl"];
const TRFLAG={fra:"fr",ita:"it",esp:"es",por:"pt",ger:"de",aut:"at",nam:"us",chi:"cl",arg:"ar",rsaz:"za",ausz:"au",nzl:"nz"};
function trPool(root){ const seen=new Set(), out=[];
  MAPS.forEach(m=>{ if(gqRoot(m.id)!==root) return; m.it.forEach((x,i)=>{ if(x[0]!=="w"||seen.has(x[1])) return; const d=GX.items[x[1]]; if(!d||!d[0]||!d[0].length||!GX.ex[d[2]]) return; if(x[6]&&m.id===root&&MTREE[root]) return; seen.add(x[1]); out.push({k:x[1],g:d[0],ex:GX.ex[d[2]],m:m.id,i}); }); });
  return out; }
let TR=null;
function trNewRound(){ const pool=shuffle(TR.pool.filter(p=>!TR.used.has(p.k))); const pick=[], gs=new Set();
  for(const p of pool){ if(pick.length>=5) break; const g=p.g[0]; if(gs.has(g)) continue; if(pick.some(q=>q.g.includes(g)||p.g.includes(q.g[0]))) continue; gs.add(g); pick.push(p); }
  pick.forEach(p=>TR.used.add(p.k)); TR.round={z:pick, gr:shuffle(pick.map(p=>p.g[0])), done:new Set(), selZ:null, last:null, bad:null}; }
function trStart(root){ const pool=trPool(root); TR={root,pool,used:new Set(),r:1,n:3,score:0,err:0,fin:false}; trNewRound(); render(); window.scrollTo(0,0); }
const trName=k=>mName(k).replace(/\s*\(grand cru\)$/i,"");
function renderTerrGame(){ const l=L();
  if(!TR) return `<section class="view tr"><div class="qzhero"><div class="qzhtx"><small>${esc(t("plKick"))}</small><h1>${esc(t("gTerr"))}</h1></div>${gfree("n33",100)}<p class="phi">${esc(t("gTerrD"))}</p>${gBest("g_terr")?`<p class="qzstate">🏆 ${esc(t("pgBest"))}: ${gBest("g_terr")}</p>`:""}</div>
    <h2 class="phh">${esc(t("trChoose"))}</h2><div class="trc">${TRC.map(r=>{ const n=trPool(r).length; return n>=6?`<button type="button" class="trcb" data-tr="${r}">${typeof tgFlag==="function"?tgFlag(TRFLAG[r]):""}<b>${esc(MBY[r].t[l])}</b><small>${n} ${esc(t("trZones").toLowerCase())}</small></button>`:""; }).join("")}</div></section>`;
  if(TR.fin) return `<section class="view tr"><div class="fcend">${gfree("n04",140)}<h2>${esc(t("trEnd"))}</h2><div class="fcres"><div><b class="ok">${TR.score}</b><span>${esc(t("pgScore"))}</span></div><div><b>${TR.err}</b><span>${esc(t("trErr"))}</span></div></div>${TR.nb?`<p class="qzstate" style="color:#a3264f">🏆 ${esc(t("pgBest"))}!</p>`:""}
    <div class="fcendb"><button type="button" class="qzgo" data-tr="${TR.root}">${esc(t("trAgain"))}</button><button type="button" class="qzgo alt" data-trx="menu">${esc(t("trOther"))}</button></div></div></section>`;
  const R=TR.round, all=R.done.size===R.z.length;
  const zb=R.z.map((p,j)=>{ const d=R.done.has(j); return `<button type="button" class="trz${d?" ok":""}${R.selZ===j?" sel":""}${R.bad&&R.bad[0]===j?" bad":""}" data-trz="${j}" ${d?"disabled":""}><span>${esc(trName(p.k))}</span><small>${esc(MBY[p.m].t[l])}</small></button>`; }).join("");
  const gb=R.gr.map((g,j)=>{ const d=[...R.done].some(k=>R.z[k].g[0]===g); return `<button type="button" class="trg${d?" ok":""}${R.bad&&R.bad[1]===j?" bad":""}" data-trg="${j}" ${d?"disabled":""}>🍇 ${esc(g)}</button>`; }).join("");
  let card=""; if(R.last!=null){ const p=R.z[R.last], mp=gqSvg(p.m,[p.i],0);
    card=`<div class="trcard"><div class="trmap">${mp.svg}</div><div class="trtx"><b>${esc(trName(p.k))} → ${esc(p.g.join(", "))}</b><p>${esc(p.ex[l])}</p></div></div>`; }
  return `<section class="view tr"><div class="pgtop"><span>${esc(t("trRound"))} ${TR.r}/${TR.n} · ${esc(MBY[TR.root].t[l])}</span><b>${TR.score}</b></div>
   <p class="pgq" style="font-size:1.15rem">${esc(t("trPairs"))}</p><p class="trhint">${esc(t("trTap"))}</p>
   <div class="trcols"><div><h3>${esc(t("trZones"))}</h3>${zb}</div><div><h3>${esc(t("trGrapes"))}</h3>${gb}</div></div>
   ${card}${all?`<button type="button" class="qzgo" data-trx="next">${esc(t(TR.r>=TR.n?"pgEnd":"trNext"))} ▸</button>`:""}</section>`; }
document.addEventListener("click",e=>{ if(view!=="g_terr") return; const b=e.target.closest&&e.target.closest("[data-tr],[data-trx],[data-trz],[data-trg]"); if(!b) return; e.preventDefault();
  if(b.dataset.tr){ trStart(b.dataset.tr); return; }
  if(b.dataset.trx==="menu"){ TR=null; render(); return; }
  if(b.dataset.trx==="next"){ if(TR.r>=TR.n){ TR.fin=true; try{ TR.nb=gAward("g_terr",TR.score,Math.round(TR.score/30)); }catch(_){} } else { TR.r++; trNewRound(); } render(); window.scrollTo(0,0); return; }
  const R=TR&&TR.round; if(!R) return;
  if(b.dataset.trz!=null){ R.selZ=+b.dataset.trz; R.bad=null; render(); return; }
  if(b.dataset.trg!=null){ if(R.selZ==null){ b.classList.add("pulse"); return; } const gj=+b.dataset.trg, z=R.z[R.selZ];
    if(z.g.includes(R.gr[gj])&&z.g[0]===R.gr[gj]){ R.done.add(R.selZ); R.last=R.selZ; TR.score+=100; R.selZ=null; R.bad=null; }
    else { TR.err++; TR.score=Math.max(0,TR.score-20); R.bad=[R.selZ,gj]; }
    render(); const c=document.querySelector(".trcard"); if(c&&R.last!=null&&!R.bad) c.scrollIntoView({block:"nearest",behavior:"smooth"}); } });
const _rPlay13=renderPlay;
renderPlay=function(){ const h=_rPlay13(); return h.replace('<div class="gamegrid">',`<div class="gamegrid"><button type="button" class="game game-terr" data-go="g_terr" style="--gc:#1f6a7a">${!gBest("g_terr")?`<span class="game-new">${t("newG")}</span>`:""}<span class="game-ic">${ICO.maps||ICO.grapes}</span><span class="game-tx"><b>${esc(t("gTerr"))}</b><span>${esc(t("gTerrD"))}</span></span>${gBest("g_terr")?`<span class="game-best">🏆 ${gBest("g_terr")}</span>`:""}</button>`); };
try{ const st16=document.createElement("style"); st16.textContent=`
.tr{display:flex;flex-direction:column;gap:12px}
.trc{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
.trcb{display:flex;flex-direction:column;align-items:flex-start;gap:6px;border:1px solid var(--line,#eadfce);background:var(--surface,#fff);border-radius:16px;padding:12px;cursor:pointer;font:inherit;color:inherit;box-shadow:0 3px 0 color-mix(in srgb,#1f6a7a 18%,transparent);text-align:left}
.trcb b{font-family:var(--f-display);font-size:1.05rem}.trcb small{color:var(--muted,#7b6a5c);font-weight:700}
.trhint{margin:-6px 0 0;text-align:center;font-size:.8rem;color:var(--muted,#7b6a5c)}
.trcols{display:grid;grid-template-columns:1fr 1fr;gap:10px}.trcols>div{display:flex;flex-direction:column;gap:7px}
.trcols h3{margin:0;font-size:.72rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted,#7b6a5c)}
.trz,.trg{border:2px solid var(--line,#eadfce);background:var(--surface,#fff);border-radius:14px;padding:9px 10px;font:inherit;color:inherit;text-align:left;cursor:pointer;display:flex;flex-direction:column;gap:2px;touch-action:manipulation;transition:transform .1s}
.trz span{font-weight:800;font-size:.9rem;line-height:1.2}.trz small{font-size:.68rem;color:var(--muted,#7b6a5c)}
.trg{font-weight:800;font-size:.88rem;background:#fbf3d2}
.trz.sel{border-color:#1f6a7a;background:#e3f1f3;transform:scale(1.02)}
.trz.ok,.trg.ok{border-color:#5f9a2e;background:#e6f2dc;opacity:.75}
.trz.bad,.trg.bad{border-color:#c2185b;animation:pgshake .4s}
.trg.pulse{animation:pgshake .4s}
.trcard{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.3fr);gap:10px;align-items:center;border-radius:16px;border:1px solid var(--line,#eadfce);background:var(--surface,#fff);padding:10px;animation:gqin .4s ease-out}
.trmap{border-radius:12px;overflow:hidden;border:1px solid var(--line,#eadfce)}.trmap .gqsvg{display:block;width:100%;height:auto;max-height:200px}
.trtx b{color:#2f7a43;font-size:.95rem}.trtx p{margin:4px 0 0;font-size:.84rem;line-height:1.4}
@media (max-width:520px){.trcard{grid-template-columns:1fr}}
`; document.head.appendChild(st16); }catch(e){}
