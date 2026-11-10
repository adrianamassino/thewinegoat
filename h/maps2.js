/* ---------- maps game (Seterra-style) ---------- */
const MAPS=__MAPS__;
const MGEO=__MGEO__;
const MZ=__MZ__;
const MBY={}; MAPS.forEach(m=>MBY[m.id]=m);
const MCAT=["w","c","r","g","x"];
const MTREE={fra:["bdx","sw","bgn","als","loi","nrh","srh","sfr","cha"],bgn:["cdo","chm","bea"],ita:["nei","pie","cit","sit"],esp:["rio","cat"],por:["dou"],ger:["gev"],nam:["cal","pnw","nyk","can"],cal:["nap"],ausz:["ause","ausw"]};
const MROOTS=["fra","ita","esp","por","ger","aut","gre","nam","chi","arg","rsa","ausz","nzl"];
const MPAR={}; Object.entries(MTREE).forEach(([p,ks])=>ks.forEach(k=>MPAR[k]=p));
const MLANG={fra:"fr-FR",bdx:"fr-FR",sw:"fr-FR",bgn:"fr-FR",cdo:"fr-FR",chm:"fr-FR",bea:"fr-FR",als:"fr-FR",loi:"fr-FR",nrh:"fr-FR",srh:"fr-FR",sfr:"fr-FR",cha:"fr-FR",ita:"it-IT",nei:"it-IT",pie:"it-IT",cit:"it-IT",sit:"it-IT",esp:"es-ES",rio:"es-ES",cat:"es-ES",chi:"es-CL",arg:"es-AR",por:"pt-PT",dou:"pt-PT",ger:"de-DE",gev:"de-DE",aut:"de-AT"};
const LSM="wset3-maps-v1";
let MAPP=(()=>{try{const x=JSON.parse(lsGet(LSM)||"{}");return x&&typeof x==="object"?x:{}}catch(e){return {}}})();
let mg=null, mSel=null, mMode=lsGet("wset3-mmode")||"find", mLen=10, mCats=new Set(["w"]), mQuery="";
const DAY=864e5, BOXD=[0,1,3,7,16];
function saveMaps(){ lsSet(LSM,JSON.stringify(MAPP)); if(chatCol) chatCol.doc("maps").set({m:MAPP}).catch(()=>{}); }
function mergeMaps(r){ if(!r||typeof r!=="object") return;
  Object.keys(r).forEach(id=>{ const a=MAPP[id], b=r[id]; if(!b) return;
    if(id==="_days"){ MAPP._days=[...new Set([...(MAPP._days||[]),...(Array.isArray(b)?b:[])])].sort().slice(-400); return; }
    if(id==="_unlock"){ MAPP._unlock=!!(a||b); return; }
    if(!a){ MAPP[id]=b; return; }
    const it=Object.assign({},a.it||{}); Object.entries(b.it||{}).forEach(([k,v])=>{ if(!it[k]||(v.l||0)>(it[k].l||0)) it[k]=v; });
    MAPP[id]={p:Math.max(a.p||0,b.p||0),f:Math.max(a.f||0,b.f||0),n:Math.max(a.n||0,b.n||0),it}; }); }
function afterMapsLoad(){ lsSet(LSM,JSON.stringify(MAPP)); if(view==="maps"&&!mg) render(); }
const mTitle=m=>m.t[L()];
const mrec=id=>MAPP[id]||(MAPP[id]={p:0,f:0,n:0,it:{}});
function mMastery(id){ const m=MBY[id], it=(MAPP[id]||{}).it||{}; if(!m) return 0; return m.it.filter((x,i)=>it[i]&&it[i].b>=2).length/m.it.length; }
function mBest(id){ const r=MAPP[id]||{}; return Math.max(r.p||0,r.f||0); }
function mUnlocked(id){ if(MAPP._unlock) return true; const p=MPAR[id]; if(!p) return true; return mUnlocked(p)&&(mMastery(p)>=0.4||mBest(p)>=70); }
function stars(p){ const n=p>=90?3:p>=70?2:p>=40?1:0; return `<span class="stars" aria-label="${n}/3">${"★".repeat(n)}<i>${"★".repeat(3-n)}</i></span>`; }
function mToday(){ const d=new Date(); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
function mStreak(){ const s=new Set(MAPP._days||[]); let n=0; const d=new Date(); if(!s.has(mToday())) d.setDate(d.getDate()-1);
  for(;;){ const k=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); if(!s.has(k)) break; n++; d.setDate(d.getDate()-1); } return n; }
function mHeat(){ const s=new Set(MAPP._days||[]), out=[]; const d=new Date(); d.setDate(d.getDate()-27);
  for(let i=0;i<28;i++){ const k=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); out.push(`<i class="${s.has(k)?"on":""}" title="${k}"></i>`); d.setDate(d.getDate()+1); } return out.join(""); }
function mSay(name,id){ try{ if(!window.speechSynthesis) return; const u=new SpeechSynthesisUtterance(String(name).replace(/^R\. /,"").replace(/ (IGP|AC|DOC|AVA)$/,"")); u.lang=MLANG[id]||"en-GB"; u.rate=.9; speechSynthesis.cancel(); speechSynthesis.speak(u);}catch(e){} }
const mNorm=s=>String(s).normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/^r\.\s*|^lake\s+|\b(igp|ac|doc|docg|ava|valley|district)\b/g,"").replace(/[^a-z0-9]+/g," ").trim();
function lev(a,b){ const m=a.length,n=b.length; if(!m) return n; if(!n) return m; let p=Array.from({length:n+1},(_,j)=>j);
  for(let i=1;i<=m;i++){ const c=[i]; for(let j=1;j<=n;j++) c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1)); p=c; } return p[n]; }
const FCACHE={};
function mFacts(name){ if(FCACHE[name]) return FCACHE[name];
  const nm=String(name).replace(/^R\. /,"").replace(/ (IGP|AC)$/,""); if(nm.length<3) return FCACHE[name]=[];
  const re=new RegExp("(^|[^A-Za-zÀ-ÿ])"+nm.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"($|[^A-Za-zÀ-ÿ])","i");
  const hits=BANK.filter(b=>re.test(b.q[2])||re.test(b.o[0][2])); hits.sort((a,b)=>(a.h?1:0)-(b.h?1:0)||(re.test(a.q[2])?0:1)-(re.test(b.q[2])?0:1));
  return FCACHE[name]=hits.slice(0,2); }

/* ----- hub ----- */
function renderMaps(){
  const st=mStreak(), tot=MAPS.reduce((a,m)=>a+m.it.length,0), mast=MAPS.reduce((a,m)=>a+Math.round(mMastery(m.id)*m.it.length),0);
  const tile=(id,lvl)=>{ const m=MBY[id], ok=mUnlocked(id), ms=Math.round(mMastery(id)*100), best=mBest(id);
    return `<button class="mtile ${ok?"":"lock"} lv${lvl}" data-map="${id}"><span class="mt-n">${ok?"":"🔒 "}${esc(mTitle(m))}</span><span class="mt-s"><span class="mbar"><i style="width:${ms}%"></i></span><span class="mono">${ms}%</span>${best?stars(best):""}</span></button>`; };
  const branch=(id,lvl)=>tile(id,lvl)+(MTREE[id]||[]).map(k=>branch(k,lvl+1)).join("");
  const groups=MROOTS.map(r=>`<div class="mgroup">${branch(r,0)}</div>`).join("");
  return `<section class="view"><div class="card"><div class="cardhead"><div><h2>${t("tr_maps")}</h2><p class="muted" style="max-width:68ch;font-size:.9rem">${t("m2Intro")}</p></div>${goat("g15","lg")}</div>
   <div class="mstats"><div><b>🔥 ${st}</b><span>${t("m2Streak")}</span></div><div><b>${mast}<small>/${tot}</small></b><span>${t("m2Mastered")}</span></div><div class="mheat" aria-label="${esc(t("m2Days"))}">${mHeat()}</div></div>
   <label class="sat-chk" style="margin-top:10px"><input type="checkbox" id="m-unlock" ${MAPP._unlock?"checked":""}>${t("m2UnlockAll")}</label></div>
   <div class="mgroups">${groups}</div><p class="muted small">${t("m2Drawn")}</p></section>${mSel?renderMapSheet():""}`;
}
function renderMapSheet(){
  const m=MBY[mSel], ok=mUnlocked(mSel), cnt=c=>m.it.filter(x=>x[0]===c).length;
  const cats=MCAT.filter(c=>cnt(c)).map(c=>`<label class="mchip"><input type="checkbox" data-mcat="${c}" ${mCats.has(c)?"checked":""}>${t("mc_"+c)} <span class="mono muted">${cnt(c)}</span></label>`).join("");
  const due=m.it.filter((x,i)=>{const r=((MAPP[mSel]||{}).it||{})[i]; return r&&r.d<=Date.now()&&r.b<4;}).length;
  const modes=[["find","m2Find","m2FindD"],["name","m2Name","m2NameD"],["type","m2Type","m2TypeD"],["explore","m2Explore","m2ExploreD"]].map(([k,a,b])=>`<button class="mmode" data-mmode="${k}" aria-pressed="${mMode===k}"><b>${t(a)}</b><span>${t(b)}</span></button>`).join("");
  return `<div class="msheet-bg" id="m-sheetbg"><div class="msheet" role="dialog" aria-label="${esc(mTitle(m))}">
   <div class="row" style="justify-content:space-between"><div><span class="label">${esc(chName(m.ch))} · ${t("mPage")} ${m.p}</span><h2 style="margin:2px 0 0">${esc(mTitle(m))}</h2></div><button class="btn ghost" id="m-sheetx" aria-label="close">✕</button></div>
   ${ok?"":`<p class="mlock">🔒 ${t("m2Locked").replace("{P}",esc(mTitle(MBY[MPAR[mSel]])))}</p>`}
   <div class="mmodes">${modes}</div>
   <div class="mcats">${cats}</div>
   ${mMode==="explore"?"":`<div class="seg" role="group">${[[10,t("m2Quick")],[0,t("m2Whole")]].map(([n,l])=>`<button data-mlen="${n}" aria-pressed="${mLen===n}">${l}</button>`).join("")}</div>`}
   ${due?`<p class="muted small" style="margin:0">${t("m2Due").replace("{N}",due)}</p>`:""}
   <button class="btn primary mgo" id="m-go">${ok?t("m2Play"):t("m2PlayAnyway")}</button></div></div>`;
}

/* ----- session ----- */
function mgNew(id,mode,opts){
  opts=opts||{}; const m=MBY[id], now=Date.now(), R=((MAPP[id]||{}).it)||{};
  const cats=opts.cats||[...mCats];
  let pool=m.it.map((x,i)=>i).filter(i=>cats.includes(m.it[i][0]));
  if(!pool.length) pool=m.it.map((x,i)=>i);
  let q;
  if(opts.targets) q=opts.targets.slice();
  else if(mode==="explore") q=[];
  else { const n=opts.len===0?pool.length:Math.min(opts.len||10,pool.length);
    const due=shuffle(pool.filter(i=>R[i]&&R[i].d<=now)).sort((a,b)=>R[a].b-R[b].b), fresh=shuffle(pool.filter(i=>!R[i])), rest=shuffle(pool.filter(i=>R[i]&&R[i].d>now));
    q=shuffle([...due,...fresh,...rest].slice(0,n)); }
  const shown=opts.targets?m.it.map((x,i)=>i).filter(i=>m.it[i][0]==="w"||opts.targets.includes(i)):pool;
  return {id,mode,cats,pool:shown,q,qi:0,done:{},miss:{},first:0,err:0,tries:0,fb:null,opts4:null,t0:Date.now(),t1:null,fin:false,exam:!!opts.exam,vb:null,hl:null,typed:""};
}
const mCur=g=>g.q[g.qi];
function mRecord(g,i,ok){ if(g.exam) return; const r=mrec(g.id).it, x=r[i]||{b:0,d:0,s:0,k:0,l:0}; x.s++; x.l=Date.now();
  if(ok){ x.k++; x.b=Math.min(4,x.b+1); } else x.b=0; x.d=Date.now()+BOXD[x.b]*DAY; r[i]=x; }
function mAnswer(i){ const g=mg, cur=mCur(g); if(g.fin||g.fb) return;
  const ok=i===cur;
  if(ok){ g.done[cur]=g.miss[cur]?"miss":"ok"; if(!g.miss[cur]) g.first++; mRecord(g,cur,!g.miss[cur]); g.fb={ok:true,i:cur}; mDraw(); setTimeout(()=>{ if(mg===g&&g.fb&&g.fb.ok) mNext(); },650); }
  else { g.err++; g.miss[cur]=1; g.done[cur]="miss"; mRecord(g,cur,false); g.fb={ok:false,i:cur,tap:i}; mDraw(); if(g.mode==="find"){ g.prevVB={...mVB()}; mZoomTo(cur,true); } }
}
function mNext(){ const g=mg; g.fb=null; g.typed=""; g.opts4=null; g.qi++; if(g.prevVB){ g.vb=g.prevVB; g.prevVB=null; mApplyVB(); } if(g.qi>=g.q.length) mFinish(); else { if(g.mode!=="find") mZoomTo(mCur(g)); } mDraw(); }
function mFinish(){ const g=mg; g.fin=true; g.t1=Date.now(); g.fb=null;
  if(g.exam){ mkMapDone(); return; }
  const n=g.q.length, p=n?Math.round(g.first/n*100):0, m=MBY[g.id], r=mrec(g.id);
  if(g.mode==="find") r.f=Math.max(r.f||0,p); else r.p=Math.max(r.p||0,p); r.n=(r.n||0)+1;
  MAPP._days=[...new Set([...(MAPP._days||[]),mToday()])].slice(-400); saveMaps();
  P.s.push({t:Date.now(),m:"map",n,c:g.first,ch:[m.ch],w:mTitle(m)+" · "+t({find:"m2Find",name:"m2Name",type:"m2Type"}[g.mode])}); save();
}
function mOptions(g){ if(g.opts4) return g.opts4; const m=MBY[g.id], cur=mCur(g), ty=m.it[cur][0];
  let same=m.it.map((x,i)=>i).filter(i=>i!==cur&&m.it[i][0]===ty); if(same.length<3) same=m.it.map((x,i)=>i).filter(i=>i!==cur);
  return g.opts4=shuffle([cur,...shuffle(same).slice(0,3)]); }
function mCheckTyped(){ const g=mg, m=MBY[g.id], cur=mCur(g), a=mNorm(g.typed), b=mNorm(m.it[cur][1]); if(!a) return;
  const ok=a===b||lev(a,b)<=Math.max(1,Math.floor(b.length/7)); if(ok) mAnswer(cur); else mAnswer(-1); }

/* ----- drawing ----- */
function mSVG(g){
  const m=MBY[g.id], G=MGEO[g.id], Z=MZ[g.id]||{}, inPool=new Set(g.pool), R=((MAPP[g.id]||{}).it)||{};
  const zi=Object.keys(Z).map(Number).filter(i=>inPool.has(i)).sort((a,b)=>Z[b].length-Z[a].length);
  const zones=zi.map(i=>`<path class="mz t-${m.it[i][0]} ${g.mode==="explore"?"mst"+Math.min(4,(R[i]||{}).b||0):""}" data-zi="${i}" d="${Z[i]}"/>`).join("");
  const pts=g.pool.filter(i=>!(i in Z)).map(i=>{const x=m.it[i]; return `<g class="mp2 t-${x[0]}" data-pi="${i}"><circle class="hit" cx="${x[2]}" cy="${x[3]}" r="18"/><circle class="dot" cx="${x[2]}" cy="${x[3]}" r="6"/></g>`}).join("");
  const labels=g.pool.map(i=>{const x=m.it[i]; return `<text class="ml t-${x[0]}" data-li="${i}" x="${x[2]}" y="${x[3]}">${esc(x[1])}</text>`}).join("");
  return `<svg class="mp mp2s" id="msvg" viewBox="0 0 ${G.w} ${G.h}" preserveAspectRatio="xMidYMid meet"><rect x="-2000" y="-2000" width="${G.w+4000}" height="${G.h+4000}" fill="var(--mwater)"/><path class="land" d="${G.land}"/><path class="grat" d="${G.grat}"/><path class="lake" d="${G.lake}"/><path class="riv" d="${G.riv}"/><path class="b1" d="${G.b1}"/><path class="b0" d="${G.b0}"/><g id="mzones">${zones}</g><g id="mpts">${pts}</g><g id="mlabels">${labels}</g></svg>`;
}
function mStateClass(g,i){
  if(g.mode==="explore") return g.hl===i?"sel":"";
  const cur=mCur(g); let c="";
  if(g.done[i]==="ok") c="ok"; else if(g.done[i]==="miss") c="miss";
  if(g.fb&&!g.fb.ok&&i===g.fb.i) c="reveal"; if(g.fb&&!g.fb.ok&&i===g.fb.tap) c="bad";
  if(g.fb&&g.fb.ok&&i===g.fb.i) c="ok flash";
  if((g.mode==="name"||g.mode==="type")&&i===cur&&!g.fb&&!g.fin) c="target";
  return c;
}
function mShowLabel(g,i){ if(g.mode==="explore") return true; if(g.done[i]) return true; if(g.fb&&(i===g.fb.i||i===g.fb.tap)) return true; return false; }
function mDraw(){
  const g=mg; if(!g) return; const svg=$("#msvg"); if(!svg){ return; }
  svg.querySelectorAll("[data-zi]").forEach(el=>{const i=+el.dataset.zi; el.setAttribute("class",`mz t-${MBY[g.id].it[i][0]} ${g.mode==="explore"?"mst"+Math.min(4,((((MAPP[g.id]||{}).it||{})[i])||{}).b||0):""} ${mStateClass(g,i)}`);});
  svg.querySelectorAll("[data-pi]").forEach(el=>{const i=+el.dataset.pi; el.setAttribute("class",`mp2 t-${MBY[g.id].it[i][0]} ${mStateClass(g,i)}`);});
  svg.querySelectorAll("[data-li]").forEach(el=>{const i=+el.dataset.li; el.style.display=mShowLabel(g,i)?"":"none"; el.classList.toggle("hlab",g.fb&&(i===g.fb.i));});
  const top=$("#m-top"); if(top) top.innerHTML=mTopHTML(g);
  const bot=$("#m-bottom"); if(bot){ bot.innerHTML=mBottomHTML(g); mBindBottom(); }
}
function mTopHTML(g){
  const m=MBY[g.id], n=g.q.length, d=Math.min(g.qi,n), cur=mCur(g);
  if(g.mode==="explore") return `<div class="mprog"><b>${esc(mTitle(m))}</b><span class="muted">${t("m2Explore")}</span></div>`;
  const ask=g.fin?`<b>${t("mDone")}</b>`:g.mode==="find"?`<span class="muted">${t("m2FindQ")}</span> <b class="mname">${esc(m.it[cur][1])}</b> <button class="mspk" data-say="${cur}" aria-label="${esc(t("m2Say"))}">🔊</button>`:`<span class="muted">${g.mode==="name"?t("m2NameQ"):t("m2TypeQ")}</span>`;
  return `<div class="mask">${ask}</div><div class="mprog"><div class="prog"><i style="width:${n?d/n*100:0}%"></i></div><span class="mono">${d}/${n} · ✓${g.first} · ✗${g.err} · <span id="m-clock">${mClock(g)}</span></span></div>`;
}
function mClock(g){ const s=Math.round(((g.t1||Date.now())-g.t0)/1000); return Math.floor(s/60)+":"+String(s%60).padStart(2,"0"); }
function mInfoCard(i,ok){
  const g=mg, m=MBY[g.id], x=m.it[i], F=mFacts(x[1]), l=L();
  return `<div class="minfo ${ok?"good":"badc"}"><div class="row" style="justify-content:space-between;gap:8px"><div><span class="label">${ok?t("mRight"):t("m2ItWas")}</span><div class="minfo-n">${esc(x[1])} <button class="mspk" data-say="${i}" aria-label="${esc(t("m2Say"))}">🔊</button></div><span class="tag">${t("mc_"+x[0])}</span></div></div>
  ${F.length?F.map(b=>`<p class="mfact"><span>${esc(b.q[l])}</span><b>→ ${esc(b.o[0][l])}</b><span class="pref">${t("page")} ${b.p}</span></p>`).join(""):`<p class="muted small" style="margin:6px 0 0">${t("mPage")} ${m.p}</p>`}</div>`;
}
function mBottomHTML(g){
  const m=MBY[g.id];
  if(g.fin) return g.exam?`<p class="muted" style="margin:0">${t("mDone")} · ${g.first}/${g.q.length}</p>`:mResultHTML(g);
  if(g.mode==="explore"){
    const hits=mQuery?g.pool.filter(i=>mNorm(m.it[i][1]).includes(mNorm(mQuery))).slice(0,6):[];
    return `<div class="msearch"><input class="sat-in" id="m-q" placeholder="${esc(t("m2Search"))}" value="${esc(mQuery)}" autocomplete="off">${hits.length?`<div class="mhits">${hits.map(i=>`<button class="chip t-${m.it[i][0]}" data-mgoto="${i}">${esc(m.it[i][1])}</button>`).join("")}</div>`:""}</div>${g.hl!=null?mInfoCard(g.hl,true).replace(t("mRight"),t("mc_"+m.it[g.hl][0])):`<p class="muted small" style="margin:0">${t("m2ExploreH")}</p>`}`;
  }
  if(g.fb&&!g.fb.ok) return mInfoCard(g.fb.i,false)+`<button class="btn primary mgo" id="m-next">${t("next")}</button>`;
  if(g.fb&&g.fb.ok) return `<p class="mok">✓ ${esc(m.it[g.fb.i][1])}</p>`;
  if(g.mode==="name") return `<div class="mopts">${mOptions(g).map(i=>`<button class="choice" data-mopt="${i}"><span>${esc(m.it[i][1])}</span></button>`).join("")}</div>`;
  if(g.mode==="type") return `<form class="mtype" id="m-typef" autocomplete="off"><input class="sat-in" id="m-typed" placeholder="${esc(t("m2TypePh"))}" value="${esc(g.typed)}" autocapitalize="off" spellcheck="false"><button class="btn primary">${t("m2Check")}</button><button type="button" class="btn ghost" id="m-idk">${t("m2Idk")}</button></form>`;
  return `<p class="muted small" style="margin:0">${t("m2FindH")}</p>`;
}
function mResultHTML(g){
  const n=g.q.length, p=n?Math.round(g.first/n*100):0, m=MBY[g.id], miss=g.q.filter(i=>g.done[i]==="miss");
  const kids=(MTREE[g.id]||[]).filter(k=>mUnlocked(k));
  return `<div class="mres"><div class="row" style="align-items:baseline;gap:12px"><span class="result-score ${p>=55?"pass":"fail"}">${p} %</span>${stars(p)}<span class="mono muted">${mClock(g)}</span></div>
   <p class="muted" style="margin:0">${t("mScoreTxt").replace("{C}",g.first).replace("{N}",n).replace("{E}",g.err)} · 🔥 ${mStreak()}</p>
   ${miss.length?`<div class="mhits">${miss.map(i=>`<span class="chip t-${m.it[i][0]}">${esc(m.it[i][1])}</span>`).join("")}</div>`:""}
   <div class="row">${miss.length?`<button class="btn primary" id="m-retry">${t("m2RetryMiss")}</button>`:""}<button class="btn ${miss.length?"":"primary"}" id="m-again">${t("mAgain")}</button>${kids.length?`<button class="btn" data-mnext="${kids[0]}">${t("m2NextLvl")}: ${esc(mTitle(MBY[kids[0]]))}</button>`:""}<button class="btn ghost" id="m-close2">${t("mBack")}</button></div></div>`;
}
function renderMapPlay(){
  const g=mg, m=MBY[g.id];
  return `<div class="mplay ${g.exam?"inline":""}" id="mplay">
   <div class="mhead">${g.exam?"":`<button class="btn ghost mx" id="m-close" aria-label="${esc(t("mBack"))}">✕</button>`}<div class="mhead-t"><span class="label">${esc(mTitle(m))}</span><div id="m-top">${mTopHTML(g)}</div></div></div>
   <div class="mstage" id="m-stage">${mSVG(g)}<div class="mzoom2"><button id="m-zi" aria-label="${esc(t("mZoomIn"))}">+</button><button id="m-zo" aria-label="${esc(t("mZoomOut"))}">−</button><button id="m-zr" aria-label="reset">⤢</button></div></div>
   <div class="mbottom" id="m-bottom">${mBottomHTML(g)}</div></div>`;
}

/* ----- view box, zoom, pan, taps ----- */
function mVB(){ const g=mg, G=MGEO[g.id]; if(!g.vb) g.vb={x:0,y:0,w:G.w,h:G.h}; return g.vb; }
function mApplyVB(anim){
  const g=mg, svg=$("#msvg"); if(!svg) return; const v=mVB(); svg.setAttribute("viewBox",`${v.x} ${v.y} ${v.w} ${v.h}`);
  const rect=svg.getBoundingClientRect(); const u=Math.max(v.w/Math.max(1,rect.width),v.h/Math.max(1,rect.height));
  svg.style.setProperty("--u",u.toFixed(4));
  svg.querySelectorAll(".mp2 .dot").forEach(c=>c.setAttribute("r",(6.5*u).toFixed(2)));
  svg.querySelectorAll(".mp2 .hit").forEach(c=>c.setAttribute("r",(20*u).toFixed(2)));
  svg.querySelectorAll("text.ml").forEach(tx=>{ const i=+tx.dataset.li, x=MBY[g.id].it[i]; const isPt=!((MZ[g.id]||{})[i]); tx.setAttribute("x",(x[2]+(isPt?9*u:0)).toFixed(1)); tx.setAttribute("y",(x[3]+(isPt?4*u:4*u)).toFixed(1)); tx.setAttribute("text-anchor",isPt?"start":"middle"); });
}
function mClampVB(v){ const G=MGEO[mg.id]; const mw=G.w*1.15, minw=G.w/8; const s=Math.min(mw/v.w,1); if(v.w>mw){v.h*=mw/v.w; v.w=mw;} if(v.w<minw){ const k=minw/v.w; v.x-=(v.w*k-v.w)/2; v.y-=(v.h*k-v.h)/2; v.w*=k; v.h*=k; }
  v.x=Math.max(-G.w*0.1,Math.min(G.w*1.1-v.w,v.x)); v.y=Math.max(-G.h*0.1,Math.min(G.h*1.1-v.h,v.y)); return v; }
function mZoomAt(f,cx,cy){ const v=mVB(); const nw=v.w/f, nh=v.h/f; v.x=cx-(cx-v.x)/f; v.y=cy-(cy-v.y)/f; v.w=nw; v.h=nh; mClampVB(v); mApplyVB(); }
function mToSvg(clientX,clientY){ const svg=$("#msvg"), p=svg.createSVGPoint(); p.x=clientX; p.y=clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); }
function mZoomTo(i,soft){ const g=mg, m=MBY[g.id], G=MGEO[g.id], x=m.it[i]; const el=$(`#msvg [data-zi="${i}"]`);
  let bx=x[2]-G.w*0.12, by=x[3]-G.h*0.12, bw=G.w*0.24, bh=G.h*0.24;
  if(el){ try{ const b=el.getBBox(); bx=b.x; by=b.y; bw=b.width; bh=b.height; }catch(e){} }
  const svg=$("#msvg"); if(!svg) return; const r=svg.getBoundingClientRect(), ar=r.width/Math.max(1,r.height);
  let w=Math.max(bw*2.4,G.w*0.28), h=w/ar; if(h<bh*2.4){ h=bh*2.4; w=h*ar; }
  const cur=mVB(); if(soft&&bx>=cur.x&&by>=cur.y&&bx+bw<=cur.x+cur.w&&by+bh<=cur.y+cur.h&&cur.w<=w*1.6) return;
  g.vb=mClampVB({x:bx+bw/2-w/2,y:by+bh/2-h/2,w,h}); mApplyVB(); }
function mHit(clientX,clientY){
  const g=mg, m=MBY[g.id], cand=new Set();
  document.elementsFromPoint(clientX,clientY).forEach(el=>{ const z=el.closest&&el.closest("[data-zi]"); if(z) cand.add(+z.dataset.zi); });
  const svg=$("#msvg"), ctm=svg.getScreenCTM(); let best=null,bd=1e9;
  g.pool.filter(i=>!((MZ[g.id]||{})[i])).forEach(i=>{ const x=m.it[i]; const sx=x[2]*ctm.a+ctm.e, sy=x[3]*ctm.d+ctm.f; const d=Math.hypot(sx-clientX,sy-clientY); if(d<26) cand.add(i); if(d<bd){bd=d;best=i;} });
  return {cand,best,bd};
}
function mTap(clientX,clientY){
  const g=mg; if(!g||g.fin) return;
  const {cand,best,bd}=mHit(clientX,clientY);
  if(g.mode==="explore"){ let pick=null; if(cand.size){ const zs=[...cand].sort((a,b)=>(((MZ[g.id]||{})[a]||"").length)-(((MZ[g.id]||{})[b]||"").length)); pick=zs[0]; } g.hl=pick; mDraw(); return; }
  if(g.mode!=="find"||g.fb) return;
  const cur=mCur(g);
  if(cand.has(cur)){ mAnswer(cur); return; }
  if(!cand.size) return;
  const zs=[...cand].sort((a,b)=>(((MZ[g.id]||{})[a]||"x").length)-(((MZ[g.id]||{})[b]||"x").length));
  mAnswer(zs[0]);
}
function mBindStage(){
  const st=$("#m-stage"); if(!st) return; const svg=$("#msvg"); const ptrs=new Map(); let pan=null, moved=false, pinch=null;
  st.addEventListener("pointerdown",e=>{ if(e.target.closest(".mzoom2")) return; st.setPointerCapture(e.pointerId); ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY}); moved=false;
    if(ptrs.size===1){ const v=mVB(); pan={x:e.clientX,y:e.clientY,vx:v.x,vy:v.y}; } else if(ptrs.size===2){ const [a,b]=[...ptrs.values()]; const v=mVB(); pinch={d:Math.hypot(a.x-b.x,a.y-b.y),v:{...v},c:mToSvg((a.x+b.x)/2,(a.y+b.y)/2)}; pan=null; moved=true; } });
  st.addEventListener("pointermove",e=>{ if(!ptrs.has(e.pointerId)) return; ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(pinch&&ptrs.size===2){ const [a,b]=[...ptrs.values()]; const d=Math.hypot(a.x-b.x,a.y-b.y); const f=d/Math.max(1,pinch.d); const v=mg.vb; const o=pinch.v;
      v.w=o.w/f; v.h=o.h/f; v.x=pinch.c.x-(pinch.c.x-o.x)/f; v.y=pinch.c.y-(pinch.c.y-o.y)/f; mClampVB(v); mApplyVB(); return; }
    if(pan){ const dx=e.clientX-pan.x, dy=e.clientY-pan.y; if(Math.hypot(dx,dy)>7) moved=true; if(moved){ const r=svg.getBoundingClientRect(); const v=mg.vb; const k=Math.max(v.w/r.width,v.h/r.height); v.x=pan.vx-dx*k; v.y=pan.vy-dy*k; mClampVB(v); mApplyVB(); } } });
  const up=e=>{ if(!ptrs.has(e.pointerId)) return; ptrs.delete(e.pointerId); if(ptrs.size<2) pinch=null;
    if(ptrs.size===0){ if(!moved&&pan) mTap(e.clientX,e.clientY); pan=null; } else if(ptrs.size===1){ const p=[...ptrs.values()][0]; const v=mVB(); pan={x:p.x,y:p.y,vx:v.x,vy:v.y}; } };
  st.addEventListener("pointerup",up); st.addEventListener("pointercancel",e=>{ptrs.delete(e.pointerId); pinch=null; pan=null;});
  st.addEventListener("wheel",e=>{ e.preventDefault(); const c=mToSvg(e.clientX,e.clientY); mZoomAt(e.deltaY<0?1.25:1/1.25,c.x,c.y); },{passive:false});
  $("#m-zi").onclick=()=>{ const v=mVB(); mZoomAt(1.5,v.x+v.w/2,v.y+v.h/2); };
  $("#m-zo").onclick=()=>{ const v=mVB(); mZoomAt(1/1.5,v.x+v.w/2,v.y+v.h/2); };
  $("#m-zr").onclick=()=>{ const G=MGEO[mg.id]; mg.vb={x:0,y:0,w:G.w,h:G.h}; mApplyVB(); };
}
function mBindBottom(){
  const g=mg; if(!g) return;
  document.querySelectorAll("#mplay [data-say]").forEach(b=>b.onclick=()=>mSay(MBY[g.id].it[+b.dataset.say][1],g.id));
  const nx=$("#m-next"); if(nx){ nx.onclick=mNext; nx.focus({preventScroll:true}); }
  document.querySelectorAll("[data-mopt]").forEach(b=>b.onclick=()=>mAnswer(+b.dataset.mopt));
  const f=$("#m-typef"); if(f){ const inp=$("#m-typed"); inp.oninput=()=>{g.typed=inp.value}; f.onsubmit=e=>{e.preventDefault(); g.typed=inp.value; mCheckTyped();}; $("#m-idk").onclick=()=>mAnswer(-1); if(window.matchMedia("(pointer:fine)").matches) inp.focus({preventScroll:true}); }
  const q=$("#m-q"); if(q){ q.oninput=()=>{ mQuery=q.value; const pos=q.selectionStart; const bot=$("#m-bottom"); bot.innerHTML=mBottomHTML(g); mBindBottom(); const q2=$("#m-q"); q2.focus(); q2.setSelectionRange(pos,pos); }; }
  document.querySelectorAll("[data-mgoto]").forEach(b=>b.onclick=()=>{ g.hl=+b.dataset.mgoto; mZoomTo(g.hl); mDraw(); });
  const r=$("#m-retry"); if(r) r.onclick=()=>{ const miss=g.q.filter(i=>g.done[i]==="miss"); mStart(g.id,g.mode,{targets:miss}); };
  const a=$("#m-again"); if(a) a.onclick=()=>mStart(g.id,g.mode,{cats:g.cats,len:mLen});
  const c2=$("#m-close2"); if(c2) c2.onclick=mClose;
  const nl=document.querySelector("[data-mnext]"); if(nl) nl.onclick=()=>{ mClose(); mSel=nl.dataset.mnext; render(); };
}
let mTick=null;
function bindMapPlay(){
  const g=mg; mBindStage(); mBindBottom();
  const c=$("#m-close"); if(c) c.onclick=mClose;
  if(!g.exam) document.body.classList.add("mlock");
  requestAnimationFrame(()=>{ mApplyVB(); if(g.mode!=="find"&&g.mode!=="explore"&&!g.fin) mZoomTo(mCur(g)); mDraw(); });
  clearInterval(mTick); mTick=setInterval(()=>{ const el=$("#m-clock"); if(el&&mg&&!mg.fin) el.textContent=mClock(mg); else if(!el) clearInterval(mTick); },1000);
}
function mgRefresh(){ mDraw(); }
function mStart(id,mode,opts){ mg=mgNew(id,mode,Object.assign({cats:[...mCats],len:mLen},opts||{})); mSel=null; render(); }
function mClose(){ mg=null; document.body.classList.remove("mlock"); clearInterval(mTick); render(); }
window.addEventListener("resize",()=>{ if(mg&&$("#msvg")) mApplyVB(); });
document.addEventListener("keydown",e=>{ if(!mg||mg.exam) return; if(e.key==="Escape"){ mClose(); } else if(e.key==="Enter"&&mg.fb&&!mg.fb.ok&&e.target.tagName!=="INPUT"){ e.preventDefault(); mNext(); }
  else if(mg.mode==="name"&&!mg.fb&&/^[1-4]$/.test(e.key)&&e.target.tagName!=="INPUT"){ const o=mOptions(mg)[+e.key-1]; if(o!==undefined) mAnswer(o); } });
document.getElementById("main").addEventListener("click",e=>{
  if(view!=="maps"||mg) return;
  const card=e.target.closest("[data-map]"); if(card){ mSel=card.dataset.map; render(); return; }
  if(e.target.id==="m-sheetx"||e.target.id==="m-sheetbg"){ mSel=null; render(); return; }
  const md=e.target.closest("[data-mmode]"); if(md){ mMode=md.dataset.mmode; lsSet("wset3-mmode",mMode); render(); return; }
  const ml=e.target.closest("[data-mlen]"); if(ml){ mLen=+ml.dataset.mlen; render(); return; }
  if(e.target.closest("#m-go")){ mStart(mSel,mMode); return; }
});
document.getElementById("main").addEventListener("change",e=>{
  if(view!=="maps"||mg) return;
  if(e.target.id==="m-unlock"){ MAPP._unlock=e.target.checked; saveMaps(); render(); return; }
  const c=e.target.closest("[data-mcat]"); if(c){ c.checked?mCats.add(c.dataset.mcat):mCats.delete(c.dataset.mcat); if(!mCats.size) mCats.add("w"); render(); }
});
