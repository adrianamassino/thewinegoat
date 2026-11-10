/* ---------- v106: local / regional grape names (South Africa, France, Spain, Portugal) — review sheet + matching game ---------- */
Object.assign(T.it,{tr_syn:"Nomi locali delle uve",trd_syn:"Steen, Côt, Tinto Fino, Tinta Roriz, Jaen… lo stesso vitigno con nomi diversi",synIntro:"Lo stesso vitigno cambia nome da una regione all'altra. Le coppie con ⭐ sono le più chieste all'esame.",synLocal:"Nome locale",synGrape:"Vitigno",synWhere:"Dove",synKey:"Le più importanti",synAll:"Tutti",synTest:"Mettiti alla prova",synHide:"Nascondi i vitigni",synShow:"Mostra i vitigni",gSyn:"Sinonimi delle uve",gSynD:"Abbina il nome locale al vitigno: Steen e Chenin Blanc, Côt e Malbec, Jaen e Mencía…",synPairs:"Abbina ogni nome locale al suo vitigno",synTap:"Tocca un nome locale, poi il vitigno.",synNames:"Nomi locali",synCount:"nomi",synCtry:"Paesi"});
Object.assign(T.fr,{tr_syn:"Noms locaux des cépages",trd_syn:"Steen, Côt, Tinto Fino, Tinta Roriz, Jaen… le même cépage sous d'autres noms",synIntro:"Un même cépage change de nom d'une région à l'autre. Les paires marquées ⭐ sont les plus demandées à l'examen.",synLocal:"Nom local",synGrape:"Cépage",synWhere:"Où",synKey:"Les plus importants",synAll:"Tous",synTest:"Testez-vous",synHide:"Masquer les cépages",synShow:"Afficher les cépages",gSyn:"Synonymes des cépages",gSynD:"Associez le nom local au cépage : Steen et chenin blanc, Côt et malbec, Jaen et mencía…",synPairs:"Associez chaque nom local à son cépage",synTap:"Touchez un nom local, puis le cépage.",synNames:"Noms locaux",synCount:"noms",synCtry:"Pays"});
Object.assign(T.en,{tr_syn:"Local grape names",trd_syn:"Steen, Côt, Tinto Fino, Tinta Roriz, Jaen… the same grape under other names",synIntro:"The same grape changes its name from one region to another. Pairs marked ⭐ are the ones exams ask most.",synLocal:"Local name",synGrape:"Grape",synWhere:"Where",synKey:"Most important",synAll:"All",synTest:"Test yourself",synHide:"Hide the grapes",synShow:"Show the grapes",gSyn:"Grape synonyms",gSynD:"Match the local name with the grape: Steen and Chenin Blanc, Côt and Malbec, Jaen and Mencía…",synPairs:"Match each local name with its grape",synTap:"Tap a local name, then the grape.",synNames:"Local names",synCount:"names",synCtry:"Countries"});
/* rows: [local name, grape, [where it,fr,en], key(1=exam favourite), note [it,fr,en] optional] */
const SYN=[
 {c:"rsa",fl:"za",n:["Sudafrica","Afrique du Sud","South Africa"],r:[
  ["Steen","Chenin Blanc",["tutto il paese: il vitigno più piantato","tout le pays : le cépage le plus planté","nationwide: the most planted grape"],1],
  ["Hanepoot","Moscato d'Alessandria|Muscat d'Alexandrie|Muscat of Alexandria",["vini dolci e da tavola","vins doux et raisin de table","sweet wines and table grapes"],1],
  ["Muscadel","Moscato Bianco a piccoli acini|Muscat à petits grains|Muscat Blanc à Petits Grains",["vini dolci fortificati","vins doux mutés","fortified sweet wines"],0],
  ["Hermitage","Cinsault",["nome storico: Pinotage = Pinot Nero × Cinsault","nom historique : pinotage = pinot noir × cinsault","old name: Pinotage = Pinot Noir × Cinsault"],1],
  ["Groendruif","Semillon|Sémillon|Semillon",["nome storico","nom historique","old name"],0],
  ["Cape Riesling","Crouchen Blanc",["non è il vero Riesling","ce n'est pas le vrai riesling","not true Riesling"],0],
  ["Colombar","Colombard",["Worcester, Robertson, Orange River","Worcester, Robertson, Orange River","Worcester, Robertson, Orange River"],0]]},
 {c:"fra",fl:"fr",n:["Francia","France","France"],r:[
  ["Côt","Malbec",["Cahors, Loira","Cahors, Loire","Cahors, Loire"],1],
  ["Auxerrois","Malbec",["Cahors (nome tradizionale)","Cahors (nom traditionnel)","Cahors (traditional name)"],0],
  ["Pineau de la Loire","Chenin Blanc",["Loira","Loire","Loire"],0],
  ["Blanc Fumé","Sauvignon Blanc",["Pouilly-Fumé","Pouilly-Fumé","Pouilly-Fumé"],1],
  ["Melon de Bourgogne","Melon Blanc",["Muscadet (Nantais)","Muscadet (Pays nantais)","Muscadet (Nantais)"],1],
  ["Gros Plant","Folle Blanche",["Nantais","Pays nantais","Nantais"],0],
  ["Rolle","Vermentino",["Provenza, Languedoc","Provence, Languedoc","Provence, Languedoc"],1],
  ["Maccabeu","Macabeo (Viura)",["Roussillon","Roussillon","Roussillon"],0],
  ["Ugni Blanc","Trebbiano Toscano",["Côtes de Gascogne, Cognac","Côtes de Gascogne, Cognac","Côtes de Gascogne, Cognac"],1],
  ["Tokay d'Alsace","Pinot Gris",["Alsazia: nome vecchio, oggi vietato","Alsace : ancien nom, aujourd'hui interdit","Alsace: old name, now banned"],0]]},
 {c:"esp",fl:"es",n:["Spagna","Espagne","Spain"],r:[
  ["Tinto Fino","Tempranillo",["Ribera del Duero","Ribera del Duero","Ribera del Duero"],1],
  ["Tinta del País","Tempranillo",["Ribera del Duero","Ribera del Duero","Ribera del Duero"],0],
  ["Tinta de Toro","Tempranillo",["Toro","Toro","Toro"],1],
  ["Cencibel","Tempranillo",["La Mancha, Valdepeñas","La Mancha, Valdepeñas","La Mancha, Valdepeñas"],1],
  ["Ull de Llebre","Tempranillo",["Catalogna (Penedès)","Catalogne (Penedès)","Catalonia (Penedès)"],0],
  ["Garnatxa","Garnacha (Grenache)",["Catalogna, Priorat","Catalogne, Priorat","Catalonia, Priorat"],0],
  ["Mazuelo","Cariñena (Carignan)",["Rioja","Rioja","Rioja"],1],
  ["Samsó","Cariñena (Carignan)",["Catalogna","Catalogne","Catalonia"],0],
  ["Monastrell","Mourvèdre",["Jumilla, Yecla (Mataro in Australia)","Jumilla, Yecla (Mataro en Australie)","Jumilla, Yecla (Mataro in Australia)"],1],
  ["Viura","Macabeo",["Rioja (Macabeo nel Cava)","Rioja (Macabeo dans le Cava)","Rioja (Macabeo in Cava)"],1],
  ["Garnacha Tintorera","Alicante Bouschet",["Spagna centrale e meridionale","centre et sud de l'Espagne","central and southern Spain"],0]]},
 {c:"por",fl:"pt",n:["Portogallo","Portugal","Portugal"],r:[
  ["Tinta Roriz","Tempranillo",["nord: Douro, Dão","nord : Douro, Dão","north: Douro, Dão"],1],
  ["Aragonez","Tempranillo",["sud: Alentejo","sud : Alentejo","south: Alentejo"],1],
  ["Alvarinho","Albariño",["Vinho Verde (Monção e Melgaço)","Vinho Verde (Monção e Melgaço)","Vinho Verde (Monção e Melgaço)"],1],
  ["Jaen","Mencía",["Dão","Dão","Dão"],1],
  ["Maria Gomes","Fernão Pires",["Bairrada","Bairrada","Bairrada"],1],
  ["Periquita","Castelão",["Península de Setúbal","Península de Setúbal","Península de Setúbal"],0],
  ["Pedernã","Arinto",["Vinho Verde","Vinho Verde","Vinho Verde"],0],
  ["Síria","Roupeiro",["Alentejo (anche Códega)","Alentejo (aussi Códega)","Alentejo (also Códega)"],0],
  ["Tinta Miúda","Graciano",["Lisboa, Tejo","Lisboa, Tejo","Lisboa, Tejo"],0],
  ["Moscatel de Setúbal","Moscato d'Alessandria|Muscat d'Alexandrie|Muscat of Alexandria",["Península de Setúbal","Península de Setúbal","Península de Setúbal"],0]]}];
const synG=(g,l)=>{ const p=g.split("|"); return p.length===3?p[l]:g; };
const synAllRows=()=>SYN.flatMap(c=>c.r.map(r=>({c:c.c,loc:r[0],gr:r[1],w:r[2],k:r[3]})));
try{ TABG.syn="wine"; SUBV.syn="wine"; SUBT.syn="tr_syn"; TABG.g_syn="play"; SUBV.g_syn="play"; SUBT.g_syn="gSyn"; }catch(e){}
let SYNC="all", SYNH=false;
function renderSyn(){ const l=L();
  const chips=[["all",t("synAll")],["key","⭐ "+t("synKey")],...SYN.map(c=>[c.c,c.n[l]])].map(([k,x])=>`<button type="button" class="chip" data-synf="${k}" aria-pressed="${SYNC===k}">${esc(x)}</button>`).join("");
  const blocks=SYN.filter(c=>SYNC==="all"||SYNC==="key"||SYNC===c.c).map(c=>{ const rows=c.r.filter(r=>SYNC!=="key"||r[3]); if(!rows.length) return "";
    return `<div class="card syncard"><h2 class="synh">${typeof tgFlag==="function"?tgFlag(c.fl):""} ${esc(c.n[l])}</h2><div class="synt">${rows.map(r=>`<div class="synr${r[3]?" key":""}"><div class="synl"><b>${r[3]?"⭐ ":""}${esc(r[0])}</b><small>${esc(r[2][l])}</small></div><div class="syna">=</div><button type="button" class="syng${SYNH?" hid":""}" data-synrev>${esc(synG(r[1],l))}</button></div>`).join("")}</div></div>`; }).join("");
  return `<section class="view synv"><div class="qzhero"><div class="qzhtx"><small>${esc(t("rvKick"))}</small><h1>${esc(t("tr_syn"))}</h1></div>${gfree("n11",90)}<p class="phi">${esc(t("synIntro"))}</p></div>
   <div class="dccats">${chips}</div>
   <div class="row" style="gap:8px;flex-wrap:wrap"><button type="button" class="btn ${SYNH?"primary":""}" data-synh>${esc(SYNH?t("synShow"):"🙈 "+t("synTest"))}</button><button type="button" class="btn" data-go="g_syn">🎮 ${esc(t("gSyn"))}</button></div>
   ${blocks}</section>`; }
document.addEventListener("click",e=>{ if(view!=="syn") return; const b=e.target.closest&&e.target.closest("[data-synf],[data-synh],[data-synrev]"); if(!b) return;
  if(b.dataset.synf){ SYNC=b.dataset.synf; render(); return; }
  if(b.hasAttribute("data-synh")){ SYNH=!SYNH; render(); return; }
  if(b.hasAttribute("data-synrev")) b.classList.toggle("hid"); });
/* ----- game ----- */
let SG=null;
function sgPool(c){ return synAllRows().filter(r=>c==="all"||r.c===c); }
function sgRound(){ const pool=shuffle(SG.pool.filter(p=>!SG.used.has(p.loc))); const pick=[], gs=new Set();
  for(const p of pool){ if(pick.length>=5) break; if(gs.has(p.gr)) continue; gs.add(p.gr); pick.push(p); }
  if(pick.length<5){ SG.used.clear(); for(const p of shuffle(SG.pool)){ if(pick.length>=5) break; if(gs.has(p.gr)||pick.includes(p)) continue; gs.add(p.gr); pick.push(p); } }
  pick.forEach(p=>SG.used.add(p.loc)); SG.round={z:pick,gr:shuffle(pick.map(p=>p.gr)),done:new Set(),sel:null,last:null,bad:null}; }
function sgStart(c){ SG={c,pool:sgPool(c),used:new Set(),r:1,n:3,score:0,err:0,fin:false}; sgRound(); render(); window.scrollTo(0,0); }
function renderSynGame(){ const l=L();
  if(!SG) return `<section class="view tr"><div class="qzhero"><div class="qzhtx"><small>${esc(t("plKick"))}</small><h1>${esc(t("gSyn"))}</h1></div>${gfree("n33",100)}<p class="phi">${esc(t("gSynD"))}</p>${gBest("g_syn")?`<p class="qzstate">🏆 ${esc(t("pgBest"))}: ${gBest("g_syn")}</p>`:""}</div>
    <h2 class="phh">${esc(t("trChoose"))}</h2><div class="trc"><button type="button" class="trcb" data-sg="all">🌍<b>${esc(t("synAll"))}</b><small>${synAllRows().length} ${esc(t("synCount"))}</small></button>${SYN.map(c=>`<button type="button" class="trcb" data-sg="${c.c}">${typeof tgFlag==="function"?tgFlag(c.fl):""}<b>${esc(c.n[l])}</b><small>${c.r.length} ${esc(t("synCount"))}</small></button>`).join("")}</div></section>`;
  if(SG.fin) return `<section class="view tr"><div class="fcend">${gfree("n04",140)}<h2>${esc(t("trEnd"))}</h2><div class="fcres"><div><b class="ok">${SG.score}</b><span>${esc(t("pgScore"))}</span></div><div><b>${SG.err}</b><span>${esc(t("trErr"))}</span></div></div>${SG.nb?`<p class="qzstate" style="color:#a3264f">🏆 ${esc(t("pgBest"))}!</p>`:""}
    <div class="fcendb"><button type="button" class="qzgo" data-sg="${SG.c}">${esc(t("trAgain"))}</button><button type="button" class="qzgo alt" data-sgx="menu">${esc(t("trOther"))}</button></div></div></section>`;
  const R=SG.round, all=R.done.size===R.z.length, cn=c=>(SYN.find(x=>x.c===c)||{n:["","",""]}).n[l];
  const zb=R.z.map((p,j)=>{ const d=R.done.has(j); return `<button type="button" class="trz${d?" ok":""}${R.sel===j?" sel":""}${R.bad&&R.bad[0]===j?" bad":""}" data-sgz="${j}" ${d?"disabled":""}><span>${esc(p.loc)}</span><small>${esc(cn(p.c))}</small></button>`; }).join("");
  const gb=R.gr.map((g,j)=>{ const d=[...R.done].some(k=>R.z[k].gr===g); return `<button type="button" class="trg${d?" ok":""}${R.bad&&R.bad[1]===j?" bad":""}" data-sgg="${j}" ${d?"disabled":""}>🍇 ${esc(synG(g,l))}</button>`; }).join("");
  let card=""; if(R.last!=null){ const p=R.z[R.last]; card=`<div class="trcard"><div class="trtx"><b>${esc(p.loc)} = ${esc(synG(p.gr,l))}</b><p>${esc(cn(p.c))} · ${esc(p.w[l])}</p></div></div>`; }
  return `<section class="view tr"><div class="pgtop"><span>${esc(t("trRound"))} ${SG.r}/${SG.n} · ${esc(SG.c==="all"?t("synAll"):cn(SG.c))}</span><b>${SG.score}</b></div>
   <p class="pgq" style="font-size:1.15rem">${esc(t("synPairs"))}</p><p class="trhint">${esc(t("synTap"))}</p>
   <div class="trcols"><div><h3>${esc(t("synNames"))}</h3>${zb}</div><div><h3>${esc(t("trGrapes"))}</h3>${gb}</div></div>
   ${card}${all?`<button type="button" class="qzgo" data-sgx="next">${esc(t(SG.r>=SG.n?"pgEnd":"trNext"))} ▸</button>`:""}</section>`; }
document.addEventListener("click",e=>{ if(view!=="g_syn") return; const b=e.target.closest&&e.target.closest("[data-sg],[data-sgx],[data-sgz],[data-sgg]"); if(!b) return; e.preventDefault();
  if(b.dataset.sg){ sgStart(b.dataset.sg); return; }
  if(b.dataset.sgx==="menu"){ SG=null; render(); return; }
  if(b.dataset.sgx==="next"){ if(SG.r>=SG.n){ SG.fin=true; try{ SG.nb=gAward("g_syn",SG.score,Math.round(SG.score/30)); }catch(_){} } else { SG.r++; sgRound(); } render(); window.scrollTo(0,0); return; }
  const R=SG&&SG.round; if(!R) return;
  if(b.dataset.sgz!=null){ R.sel=+b.dataset.sgz; R.bad=null; render(); return; }
  if(b.dataset.sgg!=null){ if(R.sel==null){ b.classList.add("pulse"); return; } const gj=+b.dataset.sgg, z=R.z[R.sel];
    if(z.gr===R.gr[gj]){ R.done.add(R.sel); R.last=R.sel; SG.score+=100; R.sel=null; R.bad=null; }
    else { SG.err++; SG.score=Math.max(0,SG.score-20); R.bad=[R.sel,gj]; }
    render(); } });
/* entries: grape hub tile + play button, games page tile */
{ const _ru23=renderUve; renderUve=function(){ let h=_ru23(); try{
    const tile=`<button type="button" class="rvt2 rv-syn wide" data-go="syn">${RVDECO.grape||""}<i class="rvshine"></i><span class="game-new rvbadge">${esc(t("newG"))}</span><span class="rvic">${ICO.gtab||ICO.grapes||""}</span><span class="rvtx"><b>${esc(t("tr_syn"))}</b><span>${esc(t("trd_syn"))}</span></span><span class="rvnum"><b>${synAllRows().length}</b><small>${esc(t("synCount"))}</small></span></button>`;
    h=h.replace(/(<div class="rvgrid2">[\s\S]*?)(\s*<\/div>\s*<button type="button" class="uvplay")/,`$1${tile}$2`);
    h=h.replace('</section>',`<button type="button" class="uvplay" data-go="g_syn" style="background:linear-gradient(120deg,#6a2a7a,#b0306a)"><span>🔤</span><b>${esc(t("gSyn"))}</b><small>${esc(t("synPairs"))} ▸</small></button></section>`);
  }catch(e){} return h; }; }
{ const _rp23=renderPlay; renderPlay=function(){ const h=_rp23(); return h.replace('<div class="gamegrid">',`<div class="gamegrid"><button type="button" class="game game-syn" data-go="g_syn" style="--gc:#8a2a6a">${!gBest("g_syn")?`<span class="game-new">${t("newG")}</span>`:""}<span class="game-ic">${ICO.grapes||""}</span><span class="game-tx"><b>${esc(t("gSyn"))}</b><span>${esc(t("gSynD"))}</span></span>${gBest("g_syn")?`<span class="game-best">🏆 ${gBest("g_syn")}</span>`:""}</button>`); }; }
try{ const st23=document.createElement("style"); st23.textContent=`
.synv{display:flex;flex-direction:column;gap:12px}
.rv-syn{--bg:linear-gradient(140deg,#3b0f3a,#8a2a6a 50%,#c2185b);--sh:#25081b}
.syncard{display:flex;flex-direction:column;gap:10px}
.synh{margin:0;font-size:1.15rem;display:flex;align-items:center;gap:8px}
.synt{display:flex;flex-direction:column;gap:6px}
.synr{display:grid;grid-template-columns:minmax(0,1.2fr) auto minmax(0,1fr);align-items:center;gap:8px;padding:8px 10px;border-radius:12px;background:var(--sunk,#f6efe6)}
.synr.key{background:color-mix(in srgb,#d4a017 12%,var(--surface,#fff));border:1px solid color-mix(in srgb,#d4a017 35%,transparent)}
.synl{display:flex;flex-direction:column;min-width:0}.synl b{font-size:1rem}.synl small{color:var(--muted,#7b6a5c);font-size:.78rem}
.syna{font-weight:900;color:var(--muted,#7b6a5c)}
.syng{font:inherit;font-weight:800;color:#a3264f;text-align:left;border:0;background:none;padding:6px 4px;border-radius:8px;cursor:pointer}
.syng.hid{color:transparent;background:repeating-linear-gradient(45deg,#e8dccf,#e8dccf 6px,#f1e7dc 6px,#f1e7dc 12px)}
`; document.head.appendChild(st23); }catch(e){}
