/* ---------- maps game (Seterra-style) ---------- */
const MAPS=__MAPS__;
const MGEO=__MGEO__;
const MNAMES=__MNAMES__;
const MBY={}; MAPS.forEach(m=>MBY[m.id]=m);
/* item: [type,key,x,y,tier,kind(z|l|p),umbrella,d] */
const MCAT=["w","r","c","g"];
const MTREE={fra:["bdx","sw","bgn","als","loi","nrh","srh","sfr","cha"],bgn:["cdo","chm","bea"],ita:["nei","pie","cit","sit"],esp:["rio","cat"],por:["dou"],ger:["gev"],nam:["cal","pnw","nyk","can"],cal:["nap"],ausz:["ause","ausw"]};
const MROOTS=["fra","ita","esp","por","ger","aut","gre","nam","chi","arg","rsa","ausz","nzl"];
const MPAR={}; Object.entries(MTREE).forEach(([p,ks])=>ks.forEach(k=>MPAR[k]=p));
const MLANG={fra:"fr-FR",bdx:"fr-FR",sw:"fr-FR",bgn:"fr-FR",cdo:"fr-FR",chm:"fr-FR",bea:"fr-FR",als:"fr-FR",loi:"fr-FR",nrh:"fr-FR",srh:"fr-FR",sfr:"fr-FR",cha:"fr-FR",ita:"it-IT",nei:"it-IT",pie:"it-IT",cit:"it-IT",sit:"it-IT",esp:"es-ES",rio:"es-ES",cat:"es-ES",chi:"es-CL",arg:"es-AR",por:"pt-PT",dou:"pt-PT",ger:"de-DE",gev:"de-DE",aut:"de-AT"};
const LSM="wset3-maps-v2";
let MAPP=(()=>{try{const x=JSON.parse(lsGet(LSM)||"{}");return x&&typeof x==="object"?x:{}}catch(e){return {}}})();
let mg=null, mSel=null, mMode=lsGet("wset3-mmode")||"find", mLen=+(lsGet("wset3-mlen")||10), mLvl=+(lsGet("wset3-mlvl")||1), mCats=new Set(["w"]), mQuery="";
if(!["find","name","type","explore"].includes(mMode)) mMode="find";
const DAY=864e5, BOXD=[0,1,3,7,16];
function saveMaps(){ lsSet(LSM,JSON.stringify(MAPP)); if(chatCol) chatCol.doc("maps2").set({m:MAPP}).catch(()=>{}); }
function mergeMaps(r){ if(!r||typeof r!=="object") return;
  Object.keys(r).forEach(id=>{ const a=MAPP[id], b=r[id]; if(!b) return;
    if(id==="_days"){ MAPP._days=[...new Set([...(MAPP._days||[]),...(Array.isArray(b)?b:[])])].sort().slice(-400); return; }
    if(id==="_unlock"){ MAPP._unlock=!!(a||b); return; }
    if(!MBY[id]) return;
    const bi={}; Object.entries(b.it||{}).forEach(([k,v])=>{ if(isNaN(+k)) bi[k]=v; });
    if(!a){ MAPP[id]=Object.assign({},b,{it:bi}); return; }
    const it=Object.assign({},a.it||{}); Object.entries(bi).forEach(([k,v])=>{ if(!it[k]||(v.l||0)>(it[k].l||0)) it[k]=v; });
    MAPP[id]={p:Math.max(a.p||0,b.p||0),f:Math.max(a.f||0,b.f||0),n:Math.max(a.n||0,b.n||0),it}; }); }
function afterMapsLoad(){ lsSet(LSM,JSON.stringify(MAPP)); if(view==="maps"&&!mg) render(); }
const mTitle=m=>m.t[L()];
const mrec=id=>MAPP[id]||(MAPP[id]={p:0,f:0,n:0,it:{}});
const SUFX={" river":["fiume","fleuve","river"]," town":["città","ville","town"]," city":["città","ville","city"]};
function mName(key){ const n=MNAMES[key]; if(n) return n[L()]||key;
  for(const s in SUFX) if(key.endsWith(s)) return key.slice(0,-s.length)+" ("+SUFX[s][L()]+")";
  return key; }
const mLab=key=>mName(key).replace(/ \((città|ville|town|city)\)$/,"");
const mAll=key=>{ const n=MNAMES[key]; const out=new Set([key.replace(/ (river|town|city|village)$/,"")]); if(n) n.forEach(x=>out.add(x)); return [...out]; };
const mIsQ=x=>x[0]!=="x"&&x[4]>0;
const mBaseSet=m=>m.it.map((x,i)=>i).filter(i=>mIsQ(m.it[i])&&m.it[i][4]===1);
function mMastery(id){ const m=MBY[id], it=(MAPP[id]||{}).it||{}; if(!m) return 0; const s=m.it.filter(x=>mIsQ(x)); if(!s.length) return 0; return s.filter(x=>it[x[1]]&&it[x[1]].b>=2).length/s.length; }
function mBest(id){ const r=MAPP[id]||{}; return Math.max(r.p||0,r.f||0); }
function mUnlocked(id){ if(MAPP._unlock) return true; const p=MPAR[id]; if(!p) return true; return mUnlocked(p)&&(mMastery(p)>=0.3||mBest(p)>=70); }
function stars(p){ const n=p>=90?3:p>=70?2:p>=40?1:0; return `<span class="stars" aria-label="${n}/3">${"★".repeat(n)}<i>${"★".repeat(3-n)}</i></span>`; }
const mDayKey=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
function mToday(){ return mDayKey(new Date()); }
function mStreak(){ const s=new Set(MAPP._days||[]); let n=0; const d=new Date(); if(!s.has(mToday())) d.setDate(d.getDate()-1);
  for(;;){ if(!s.has(mDayKey(d))) break; n++; d.setDate(d.getDate()-1); } return n; }
function mHeat(){ const s=new Set(MAPP._days||[]), out=[]; const d=new Date(); d.setDate(d.getDate()-27);
  for(let i=0;i<28;i++){ const k=mDayKey(d); out.push(`<i class="${s.has(k)?"on":""}" title="${k}"></i>`); d.setDate(d.getDate()+1); } return out.join(""); }
function mSay(key,id){ try{ if(!window.speechSynthesis) return; const lg=MLANG[id]||"en-GB"; const n=MNAMES[key]; const li=lg.startsWith("fr")?1:lg.startsWith("it")?0:2;
  const txt=(n?n[li]:key).replace(/ \((Grand Cru|grand cru|città|ville|town|fiume|fleuve|river|volcano|vulcano|volcan)\)$/,"").replace(/ (village|town|city|river)$/,"").replace(/^(IGP|AOC) /,"").replace(/ (IGP|AC|DOC|AVA)$/,"");
  const u=new SpeechSynthesisUtterance(txt); u.lang=lg; u.rate=.9; speechSynthesis.cancel(); speechSynthesis.speak(u);}catch(e){} }
const mNorm=s=>String(s).normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/\((grand cru|citta|ville|town|fiume|fleuve|river)\)/g,"").replace(/\b(igp|aoc|ac|doc|docg|ava|valley|valle|vallee|district|lake|lago|lac|river|fiume)\b/g,"").replace(/[^a-z0-9]+/g," ").trim();
function lev(a,b){ const m=a.length,n=b.length; if(!m) return n; if(!n) return m; let p=Array.from({length:n+1},(_,j)=>j);
  for(let i=1;i<=m;i++){ const c=[i]; for(let j=1;j<=n;j++) c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1)); p=c; } return p[n]; }
const FCACHE={};
function mFacts(key){ if(FCACHE[key]) return FCACHE[key];
  const nms=mAll(key).map(n=>n.replace(/ \(.*\)$/,"").replace(/^(IGP|AOC) /,"").replace(/ (IGP|AC)$/,"")).filter(n=>n.length>=3);
  if(!nms.length) return FCACHE[key]=[];
  const re=new RegExp("(^|[^A-Za-zÀ-ÿ])("+nms.map(n=>n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("|")+")($|[^A-Za-zÀ-ÿ])","i");
  const l=L(); const hits=BANK.filter(b=>re.test(b.q[l])||re.test(b.o[0][l])); hits.sort((a,b)=>(a.h?1:0)-(b.h?1:0)||(re.test(a.q[l])?0:1)-(re.test(b.q[l])?0:1));
  return FCACHE[key]=hits.slice(0,2); }

/* ----- hub ----- */
function renderMaps(){
  const st=mStreak(); let tot=0, mast=0; MAPS.forEach(m=>{ const n=m.it.filter(mIsQ).length; tot+=n; mast+=Math.round(mMastery(m.id)*n); });
  const tile=(id,lvl)=>{ const m=MBY[id], ok=mUnlocked(id), ms=Math.round(mMastery(id)*100), best=mBest(id), n=m.it.filter(mIsQ).length;
    return `<button class="mtile ${ok?"":"lock"} lv${lvl}" data-map="${id}"><span class="mt-n">${ok?"":"🔒 "}${esc(mTitle(m))} <small class="muted">${n}</small></span><span class="mt-s"><span class="mbar"><i style="width:${ms}%"></i></span><span class="mono">${ms}%</span>${best?stars(best):""}</span></button>`; };
  const branch=(id,lvl)=>tile(id,lvl)+(MTREE[id]||[]).map(k=>branch(k,lvl+1)).join("");
  const groups=MROOTS.map(r=>`<div class="mgroup">${branch(r,0)}</div>`).join("");
  return `<section class="view"><div class="card"><div class="cardhead"><div><h2>${t("tr_maps")}</h2><p class="muted" style="max-width:68ch;font-size:.9rem">${t("m2Intro")}</p></div>${goat("g15","lg")}</div>
   <div class="mstats"><div><b>🔥 ${st}</b><span>${t("m2Streak")}</span></div><div><b>${mast}<small>/${tot}</small></b><span>${t("m2Mastered")}</span></div><div class="mheat" aria-label="${esc(t("m2Days"))}">${mHeat()}</div></div>
   <label class="sat-chk" style="margin-top:10px"><input type="checkbox" id="m-unlock" ${MAPP._unlock?"checked":""}>${t("m2UnlockAll")}</label></div>
   <div class="mgroups">${groups}</div><p class="muted small">${t("m2Drawn")}</p></section>${mSel?renderMapSheet():""}`;
}
function mPoolFor(m,cats,lvl){ return m.it.map((x,i)=>i).filter(i=>mIsQ(m.it[i])&&cats.includes(m.it[i][0])&&m.it[i][4]<=(lvl>=2?2:1)); }
function renderMapSheet(){
  const m=MBY[mSel], ok=mUnlocked(mSel);
  const cnt=c=>mPoolFor(m,[c],mLvl).length;
  const cats=MCAT.filter(c=>cnt(c)).map(c=>`<label class="mchip"><input type="checkbox" data-mcat="${c}" ${mCats.has(c)?"checked":""}>${t("mc_"+c)} <span class="mono muted">${cnt(c)}</span></label>`).join("");
  const R=(MAPP[mSel]||{}).it||{}, due=mPoolFor(m,[...mCats],mLvl).filter(i=>{const r=R[m.it[i][1]]; return r&&r.d<=Date.now()&&r.b<4;}).length;
  const modes=[["find","m2Find","m2FindD"],["name","m2Name","m2NameD"],["type","m2Type","m2TypeD"],["explore","m2Explore","m2ExploreD"]].map(([k,a,b])=>`<button class="mmode" data-mmode="${k}" aria-pressed="${mMode===k}"><b>${t(a)}</b><span>${t(b)}</span></button>`).join("");
  const lv=[[1,"m3L1","m3L1D"],[2,"m3L2","m3L2D"],[3,"m3L3","m3L3D"]].map(([k,a,b])=>`<button class="mlvl" data-mlvl="${k}" aria-pressed="${mLvl===k}"><b>${"●".repeat(k)}${"○".repeat(3-k)} ${t(a)}</b><span>${t(b)}</span></button>`).join("");
  return `<div class="msheet-bg" id="m-sheetbg"><div class="msheet" role="dialog" aria-label="${esc(mTitle(m))}">
   <div class="row" style="justify-content:space-between;flex-wrap:nowrap;align-items:flex-start"><div style="min-width:0"><span class="label">${esc(chName(m.ch))} · ${t("mPage")} ${m.p}</span><h2 style="margin:2px 0 0">${esc(mTitle(m))}</h2></div><button class="btn ghost" id="m-sheetx" aria-label="close">✕</button></div>
   ${ok?"":`<p class="mlock">🔒 ${t("m2Locked").replace("{P}",esc(mTitle(MBY[MPAR[mSel]])))}</p>`}
   <div class="mmodes">${modes}</div>
   <div><span class="label">${t("m3Level")}</span><div class="mlvls">${lv}</div></div>
   <div class="mcats">${cats}</div>
   ${mMode==="explore"?"":`<div class="seg" role="group">${[[10,"10"],[20,"20"],[0,t("m2Whole")]].map(([n,l])=>`<button data-mlen="${n}" aria-pressed="${mLen===n}">${l}</button>`).join("")}</div>`}
   ${due?`<p class="muted small" style="margin:0">${t("m2Due").replace("{N}",due)}</p>`:""}
   <button class="btn primary mgo" id="m-go">${ok?t("m2Play"):t("m2PlayAnyway")}</button></div></div>`;
}

/* ----- session ----- */
function mgNew(id,mode,opts){
  opts=opts||{}; const m=MBY[id], now=Date.now(), R=((MAPP[id]||{}).it)||{};
  const cats=mode==="explore"?MCAT.slice():(opts.cats||[...mCats]), lvl=opts.exam?1:(opts.lvl||mLvl);
  let pool=mPoolFor(m,cats,lvl); if(!pool.length) pool=mPoolFor(m,["w"],lvl);
  let q;
  if(opts.targets) q=opts.targets.filter(i=>m.it[i]);
  else if(mode==="explore") q=[];
  else { const n=opts.len===0?pool.length:Math.min(opts.len||10,pool.length);
    const rk=i=>R[m.it[i][1]];
    const due=shuffle(pool.filter(i=>rk(i)&&rk(i).d<=now)).sort((a,b)=>rk(a).b-rk(b).b), fresh=shuffle(pool.filter(i=>!rk(i))), rest=shuffle(pool.filter(i=>rk(i)&&rk(i).d>now));
    q=shuffle([...due,...fresh,...rest].slice(0,n)); }
  if(opts.targets) pool=[...new Set([...pool,...q])];
  return {id,mode,cats,lvl,pool,q,qi:0,done:{},miss:{},first:0,err:0,fb:null,opts4:null,t0:Date.now(),t1:null,fin:false,exam:!!opts.exam,vb:null,hl:null,typed:"",streak:0,best:0};
}
const mCur=g=>g.q[g.qi];
function mRecord(g,i,ok){ if(g.exam) return; const key=MBY[g.id].it[i][1], r=mrec(g.id).it, x=r[key]||{b:0,d:0,s:0,k:0,l:0}; x.s++; x.l=Date.now();
  if(ok){ x.k++; x.b=Math.min(4,x.b+1); } else x.b=0; x.d=Date.now()+BOXD[x.b]*DAY; r[key]=x; }
let mAdv=null;
function mAnswer(i){ const g=mg, cur=mCur(g); if(g.fin||g.fb) return;
  const ok=i===cur;
  if(ok){ const clean=!g.miss[cur]; g.done[cur]=clean?"ok":"miss"; if(clean){ g.first++; g.streak++; g.best=Math.max(g.best,g.streak); } mRecord(g,cur,clean); g.fb={ok:true,i:cur}; mDraw(); mBump(cur);
    clearTimeout(mAdv); mAdv=setTimeout(()=>{ if(mg===g&&g.fb&&g.fb.ok) mNext(); },g.mode==="find"?750:900); }
  else { g.err++; g.streak=0; g.miss[cur]=1; g.done[cur]="miss"; mRecord(g,cur,false); g.fb={ok:false,i:cur,tap:i}; mDraw(); g.prevVB={...mVB()}; mFocus([cur].concat(i>=0&&i!==cur?[i]:[]),true); }
}
function mNext(){ const g=mg; if(!g) return; clearTimeout(mAdv); g.fb=null; g.typed=""; g.opts4=null; g.qi++;
  if(g.qi>=g.q.length){ mFinish(); mDraw(); return; }
  if(g.mode==="find"){ if(g.prevVB){ mAnimTo(g.prevVB); g.prevVB=null; } }
  else mFocus([mCur(g)],false,true);
  mDraw(); }
function mFinish(){ const g=mg; g.fin=true; g.t1=Date.now(); g.fb=null;
  if(g.exam){ mkMapDone(); return; }
  const n=g.q.length, p=n?Math.round(g.first/n*100):0, m=MBY[g.id], r=mrec(g.id);
  if(g.mode==="find") r.f=Math.max(r.f||0,p); else r.p=Math.max(r.p||0,p); r.n=(r.n||0)+1;
  MAPP._days=[...new Set([...(MAPP._days||[]),mToday()])].slice(-400); saveMaps();
  P.s.push({t:Date.now(),m:"map",n,c:g.first,ch:[m.ch],w:mTitle(m)+" · "+t({find:"m2Find",name:"m2Name",type:"m2Type"}[g.mode])}); save();
  const G=MGEO[g.id]; mAnimTo({x:0,y:0,w:G.w,h:G.h});
}
function mDist(m,a,b){ const A=m.it[a],B=m.it[b]; return Math.hypot(A[2]-B[2],A[3]-B[3]); }
function mOptions(g){ if(g.opts4) return g.opts4; const m=MBY[g.id], cur=mCur(g), ty=m.it[cur][0];
  const kd=m.it[cur][5]==="p"?"p":"zl", sk=i=>(m.it[i][5]==="p"?"p":"zl")===kd;
  let same=g.pool.filter(i=>i!==cur&&m.it[i][0]===ty&&sk(i)); if(same.length<3) same=g.pool.filter(i=>i!==cur&&m.it[i][0]===ty); if(same.length<3) same=m.it.map((x,i)=>i).filter(i=>i!==cur&&mIsQ(m.it[i])&&m.it[i][0]===ty);
  if(same.length<3) same=m.it.map((x,i)=>i).filter(i=>i!==cur&&mIsQ(m.it[i]));
  let pick;
  if(g.lvl>=2){ same.sort((a,b)=>mDist(m,cur,a)-mDist(m,cur,b)); pick=shuffle(same.slice(0,g.lvl>=3?3:5)).slice(0,3); }
  else pick=shuffle(same).slice(0,3);
  return g.opts4=shuffle([cur,...pick]); }
function mCheckTyped(){ const g=mg, m=MBY[g.id], cur=mCur(g), a=mNorm(g.typed); if(!a) return;
  const ok=mAll(m.it[cur][1]).some(n=>{ const b=mNorm(n); return a===b||lev(a,b)<=Math.max(1,Math.floor(b.length/7)); });
  mAnswer(ok?cur:-1); }

/* ----- drawing ----- */
const mHard=g=>g.lvl>=3&&g.mode!=="explore";
function mSVG(g){
  const m=MBY[g.id], G=MGEO[g.id], inPool=new Set(g.pool);
  const vis=i=>{ const x=m.it[i]; return x[0]==="x"||inPool.has(i)||(x[4]===1&&(x[0]==="c"||x[0]==="g"))||(g.mode==="explore"&&x[4]<=(g.lvl>=2?2:1)); };
  const idx=m.it.map((x,i)=>i).filter(vis);
  const zs=idx.filter(i=>m.it[i][5]==="z"&&inPool.has(i)).sort((a,b)=>(m.it[b][6]-m.it[a][6])||(m.it[b][7].length-m.it[a][7].length));
  const zones=zs.map(i=>`<path class="mz${m.it[i][6]?" umb":""}" data-zi="${i}" d="${m.it[i][7]}"/>`).join("");
  const lines=idx.filter(i=>m.it[i][5]==="l"&&inPool.has(i)).map(i=>`<path class="mrl" data-ri="${i}" d="${m.it[i][7]}"/>`).join("");
  const pts=idx.filter(i=>m.it[i][5]==="p"&&m.it[i][0]!=="x").map(i=>{const x=m.it[i]; return `<circle class="mp2 t-${x[0]}${inPool.has(i)?"":" ctx"}" data-pi="${i}" cx="${x[2]}" cy="${x[3]}" r="5"/>`}).join("");
  const labels=idx.map(i=>{const x=m.it[i]; return `<text class="ml t-${x[0]}${x[0]==="x"?" ctx":inPool.has(i)?"":" ctx"}${x[6]?" umb":""}" data-li="${i}" x="${x[2]}" y="${x[3]}">${esc(x[0]==="c"?mLab(x[1]):mName(x[1]))}</text>`}).join("");
  return `<svg class="mp mp2s${mHard(g)?" hard":""}${g.mode==="explore"?" mexpl":""}" id="msvg" viewBox="0 0 ${G.w} ${G.h}" preserveAspectRatio="xMidYMid meet"><rect x="-3000" y="-3000" width="${G.w+6000}" height="${G.h+6000}" class="msea"/><path class="land" d="${G.land}"/><path class="grat" d="${G.grat}"/><path class="lake" d="${G.lake}"/><path class="riv" d="${G.riv}"/><path class="b1" d="${G.b1}"/><path class="b0" d="${G.b0}"/><g id="mzones">${zones}</g><g id="mlines">${lines}</g><g id="mpts">${pts}</g><g id="mlabels">${labels}</g><path id="mhit" d="" style="fill:none;stroke:none;pointer-events:none"/></svg>`;
}
function mStateClass(g,i){
  const R=((MAPP[g.id]||{}).it)||{};
  if(g.mode==="explore"){ const b=(R[MBY[g.id].it[i][1]]||{}).b||0; return (g.hl===i?"sel ":"")+"mst"+Math.min(4,b); }
  const cur=mCur(g); let c="";
  if(g.done[i]==="ok") c="ok"; else if(g.done[i]==="miss") c="miss";
  if(g.fb&&!g.fb.ok&&i===g.fb.tap) c="bad";
  if(g.fb&&!g.fb.ok&&i===g.fb.i) c="reveal";
  if(g.fb&&g.fb.ok&&i===g.fb.i) c+=" now";
  if((g.mode==="name"||g.mode==="type")&&i===cur&&!g.fb&&!g.fin) c="target";
  return c;
}
function mShowLabel(g,i){ const x=MBY[g.id].it[i];
  if(g.mode==="explore") return true;
  if(x[0]==="x") return true;
  if(!g.pool.includes(i)) return true; // context landmarks
  if(g.done[i]) return true;
  if(g.fb&&(i===g.fb.i||i===g.fb.tap)) return true;
  if(g.fin) return true;
  return false; }
function mDraw(){
  const g=mg; if(!g) return; const svg=$("#msvg"); if(!svg) return;
  svg.querySelectorAll("[data-zi]").forEach(el=>{const i=+el.dataset.zi; el.setAttribute("class",`mz${MBY[g.id].it[i][6]?" umb":""} ${mStateClass(g,i)}`);});
  svg.querySelectorAll("[data-ri]").forEach(el=>{const i=+el.dataset.ri; el.setAttribute("class",`mrl ${mStateClass(g,i)}`);});
  svg.querySelectorAll("[data-pi]").forEach(el=>{const i=+el.dataset.pi; const x=MBY[g.id].it[i]; el.setAttribute("class",`mp2 t-${x[0]}${g.pool.includes(i)?"":" ctx"} ${g.pool.includes(i)?mStateClass(g,i):""}`);});
  svg.querySelectorAll("[data-li]").forEach(el=>{const i=+el.dataset.li; const on=mShowLabel(g,i); el.classList.toggle("off",!on);
    const st=g.mode==="explore"?"":(g.done[i]||""); el.classList.toggle("lok",st==="ok"); el.classList.toggle("lmiss",st==="miss"||(g.fb&&!g.fb.ok&&i===g.fb.i)); el.classList.toggle("lbad",!!(g.fb&&!g.fb.ok&&i===g.fb.tap&&i!==g.fb.i));
    el.classList.toggle("hlab",!!(g.fb&&(i===g.fb.i))||(g.mode==="explore"&&g.hl===i)); });
  mDeclutter();
  const top=$("#m-top"); if(top) top.innerHTML=mTopHTML(g);
  const bot=$("#m-bottom"); if(bot){ bot.innerHTML=mBottomHTML(g); mBindBottom(); }
}
function mBump(i){ const el=document.querySelector(`#msvg [data-li="${i}"]`); if(!el) return; el.classList.remove("pop"); void el.getBBox; requestAnimationFrame(()=>el.classList.add("pop")); }
function mTopHTML(g){
  const m=MBY[g.id], n=g.q.length, d=Math.min(g.qi+(g.fb?1:0),n), cur=mCur(g);
  if(g.mode==="explore") return `<div class="mask"><b class="mname">${esc(mTitle(m))}</b></div><div class="mprog"><span class="muted">${t("m2Explore")}</span></div>`;
  const ask=g.fin?`<b class="mname">${t("mDone")}</b>`:g.mode==="find"?`<span class="muted">${t("m2FindQ")}</span> <b class="mname">${esc(mName(m.it[cur][1]))}</b> <span class="tag tsm t-${m.it[cur][0]}">${t("mc_"+m.it[cur][0])}</span> <button class="mspk" data-say="${cur}" aria-label="${esc(t("m2Say"))}">🔊</button>`:`<span class="muted">${g.mode==="name"?t("m2NameQ"):t("m2TypeQ")}</span>`;
  return `<div class="mask">${ask}</div><div class="mprog"><div class="prog"><i style="width:${n?d/n*100:0}%"></i></div><span class="mono">${d}/${n} · ✓${g.first} · ✗${g.err}${g.streak>=3?` · 🔥${g.streak}`:""} · <span id="m-clock">${mClock(g)}</span></span></div>`;
}
function mClock(g){ const s=Math.round(((g.t1||Date.now())-g.t0)/1000); return Math.floor(s/60)+":"+String(s%60).padStart(2,"0"); }
function mInfoCard(i,kind){
  const g=mg, m=MBY[g.id], x=m.it[i], F=mFacts(x[1]), l=L();
  const lab=kind==="ok"?t("mRight"):kind==="bad"?t("m2ItWas"):t("mc_"+x[0]);
  const tap=g.fb&&!g.fb.ok&&g.fb.tap>=0&&g.fb.tap!==i?`<p class="mtapped">${t("m3YouTapped")} <b>${esc(mName(m.it[g.fb.tap][1]))}</b></p>`:"";
  return `<div class="minfo ${kind==="ok"?"good":kind==="bad"?"badc":""}"><span class="label">${lab}</span><div class="minfo-n">${esc(mName(x[1]))} <button class="mspk" data-say="${i}" aria-label="${esc(t("m2Say"))}">🔊</button></div><div class="row" style="gap:6px"><span class="tag t-${x[0]}">${t("mc_"+x[0])}</span>${x[4]===2?`<span class="tag">${t("m3Expert")}</span>`:""}${x[6]?`<span class="tag">${t("m3Umb")}</span>`:""}</div>${tap}
  ${F.length?F.map(b=>`<p class="mfact"><span>${esc(b.q[l])}</span><b>→ ${esc(b.o[0][l])}</b><span class="pref">${t("page")} ${b.p}</span></p>`).join(""):""}</div>`;
}
function mBottomHTML(g){
  const m=MBY[g.id];
  if(g.fin) return g.exam?`<p class="muted" style="margin:0">${t("mDone")} · ${g.first}/${g.q.length}</p>`:mResultHTML(g);
  if(g.mode==="explore"){
    const nq=mNorm(mQuery), hits=nq?g.pool.filter(i=>mAll(m.it[i][1]).some(n=>mNorm(n).includes(nq))).slice(0,8):[];
    return `<div class="msearch"><input class="sat-in" id="m-q" placeholder="${esc(t("m2Search"))}" value="${esc(mQuery)}" autocomplete="off">${hits.length?`<div class="mhits">${hits.map(i=>`<button class="chip t-${m.it[i][0]}" data-mgoto="${i}">${esc(mName(m.it[i][1]))}</button>`).join("")}</div>`:""}</div>${g.hl!=null?mInfoCard(g.hl,"info"):`<p class="muted small" style="margin:0">${t("m2ExploreH")}</p>`}`;
  }
  if(g.fb&&!g.fb.ok) return mInfoCard(g.fb.i,"bad")+`<button class="btn primary mgo" id="m-next">${t("next")} →</button>`;
  if(g.fb&&g.fb.ok) return `<p class="mok">✓ ${esc(mName(m.it[g.fb.i][1]))}${g.streak>=3?` <span class="mstreak">🔥 ${g.streak}</span>`:""}</p>`;
  if(g.mode==="name") return `<div class="mopts">${mOptions(g).map((i,k)=>`<button class="choice" data-mopt="${i}"><span class="mono muted">${k+1}</span> <span>${esc(mName(m.it[i][1]))}</span></button>`).join("")}</div>`;
  if(g.mode==="type") return `<form class="mtype" id="m-typef" autocomplete="off"><input class="sat-in" id="m-typed" placeholder="${esc(t("m2TypePh"))}" value="${esc(g.typed)}" autocapitalize="off" spellcheck="false"><button class="btn primary">${t("m2Check")}</button><button type="button" class="btn ghost" id="m-idk">${t("m2Idk")}</button></form>`;
  return `<p class="muted small" style="margin:0">${mHard(g)?t("m3FindHard"):t("m2FindH")}</p>`;
}
function mResultHTML(g){
  const n=g.q.length, p=n?Math.round(g.first/n*100):0, m=MBY[g.id], miss=g.q.filter(i=>g.done[i]==="miss");
  const kids=(MTREE[g.id]||[]).filter(k=>mUnlocked(k));
  return `<div class="mres"><div class="row" style="align-items:baseline;gap:12px"><span class="result-score ${p>=55?"pass":"fail"}">${p} %</span>${stars(p)}<span class="mono muted">${mClock(g)}${g.best>=3?` · 🔥 ${g.best}`:""}</span></div>
   <p class="muted" style="margin:0">${t("mScoreTxt").replace("{C}",g.first).replace("{N}",n).replace("{E}",g.err)} · ${t("m2Streak")}: ${mStreak()}</p>
   ${miss.length?`<div class="mhits">${miss.map(i=>`<span class="chip t-${m.it[i][0]}">${esc(mName(m.it[i][1]))}</span>`).join("")}</div>`:""}
   <div class="row">${miss.length?`<button class="btn primary" id="m-retry">${t("m2RetryMiss")}</button>`:""}<button class="btn ${miss.length?"":"primary"}" id="m-again">${t("mAgain")}</button>${g.lvl<3&&p>=80?`<button class="btn" id="m-harder">${t("m3Harder")}</button>`:""}${kids.length?`<button class="btn" data-mnext="${kids[0]}">${t("m2NextLvl")}: ${esc(mTitle(MBY[kids[0]]))}</button>`:""}<button class="btn ghost" id="m-close2">${t("mBack")}</button></div></div>`;
}
function renderMapPlay(){
  const g=mg, m=MBY[g.id];
  return `<div class="mplay ${g.exam?"inline":""}" id="mplay">
   <div class="mhead">${g.exam?"":`<button class="btn ghost mx" id="m-close" aria-label="${esc(t("mBack"))}">✕</button>`}<div class="mhead-t"><span class="label">${esc(mTitle(m))} · ${"●".repeat(g.lvl)}${"○".repeat(3-g.lvl)}</span><div id="m-top">${mTopHTML(g)}</div></div></div>
   <div class="mstage" id="m-stage">${mSVG(g)}<div class="mzoom2"><button id="m-zi" aria-label="${esc(t("mZoomIn"))}">+</button><button id="m-zo" aria-label="${esc(t("mZoomOut"))}">−</button><button id="m-zr" aria-label="reset">⤢</button></div></div>
   <div class="mbottom" id="m-bottom">${mBottomHTML(g)}</div></div>`;
}

/* ----- view box: smooth zoom, pan, pinch ----- */
function mVB(){ const g=mg, G=MGEO[g.id]; if(!g.vb) g.vb={x:0,y:0,w:G.w,h:G.h}; return g.vb; }
let mRaf=0, mLastU=0;
function mApplyVB(){ if(mRaf) return; mRaf=requestAnimationFrame(mApplyNow); }
function mApplyNow(){ mRaf=0;
  const g=mg, svg=$("#msvg"); if(!g||!svg) return; const v=mVB(); svg.setAttribute("viewBox",`${v.x} ${v.y} ${v.w} ${v.h}`);
  const rect=svg.getBoundingClientRect(); const u=Math.max(v.w/Math.max(1,rect.width),v.h/Math.max(1,rect.height));
  if(Math.abs(u-mLastU)/Math.max(u,1e-6)>0.002){ mLastU=u; svg.style.setProperty("--u",u.toFixed(4));
    svg.querySelectorAll(".mp2").forEach(c=>c.setAttribute("r",((c.classList.contains("ctx")?4:6.5)*u).toFixed(2)));
    svg.querySelectorAll("text.ml").forEach(tx=>{ const i=+tx.dataset.li, x=MBY[g.id].it[i]; const isPt=x[5]==="p"&&x[0]!=="x"; tx.setAttribute("x",(x[2]+(isPt?9*u:0)).toFixed(1)); tx.setAttribute("y",(x[3]+(isPt?4.5*u:4.5*u)).toFixed(1)); tx.setAttribute("text-anchor",isPt?"start":"middle"); });
  }
  clearTimeout(mApplyNow.t); mApplyNow.t=setTimeout(mDeclutter,140);
}
function mClampVB(v){ const G=MGEO[mg.id]; const mw=G.w*1.2, minw=G.w/14;
  if(v.w>mw){ const k=mw/v.w; v.x+=(v.w-mw)/2; v.y+=(v.h-v.h*k)/2; v.w=mw; v.h*=k; }
  if(v.w<minw){ const k=minw/v.w; v.x-=(v.w*k-v.w)/2; v.y-=(v.h*k-v.h)/2; v.w*=k; v.h*=k; }
  v.x=Math.max(-G.w*0.15-Math.max(0,v.w-G.w)/2,Math.min(G.w*1.15-v.w+Math.max(0,v.w-G.w)/2,v.x)); v.y=Math.max(-G.h*0.15-Math.max(0,v.h-G.h)/2,Math.min(G.h*1.15-v.h+Math.max(0,v.h-G.h)/2,v.y)); return v; }
let mAnim=0;
function mAnimTo(tv,dur){ const g=mg; if(!g) return; cancelAnimationFrame(mAnim); const v=mVB(), s={...v}; tv=mClampVB({...tv}); const t0=performance.now(); dur=dur||380;
  if(window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches) dur=1;
  const step=now=>{ if(mg!==g) return; let k=Math.min(1,(now-t0)/dur); k=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;
    // zoom out-and-in feel: interpolate in log space for size
    const lw=Math.exp(Math.log(s.w)+(Math.log(tv.w)-Math.log(s.w))*k); const f=(lw-s.w)/((tv.w-s.w)||1);
    const kk=isFinite(f)&&tv.w!==s.w?f:k;
    v.w=lw; v.h=s.h*(lw/s.w); v.x=s.x+(tv.x-s.x)*kk; v.y=s.y+(tv.y-s.y)*kk; mApplyNow(); if(k<1) mAnim=requestAnimationFrame(step); };
  mAnim=requestAnimationFrame(step); }
function mZoomAt(f,cx,cy,anim){ const v=mVB(); const nv={w:v.w/f,h:v.h/f,x:cx-(cx-v.x)/f,y:cy-(cy-v.y)/f}; if(anim) mAnimTo(nv,220); else { Object.assign(v,mClampVB(nv)); mApplyVB(); } }
function mToSvg(clientX,clientY){ const svg=$("#msvg"), p=svg.createSVGPoint(); p.x=clientX; p.y=clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); }
function mItemBox(i){ const g=mg, x=MBY[g.id].it[i], G=MGEO[g.id]; const el=document.querySelector(`#msvg [data-zi="${i}"],#msvg [data-ri="${i}"]`);
  if(el){ try{ const b=el.getBBox(); if(b.width||b.height) return {x:b.x,y:b.y,w:b.width,h:b.height}; }catch(e){} }
  return {x:x[2]-G.w*0.03,y:x[3]-G.w*0.03,w:G.w*0.06,h:G.w*0.06}; }
function mFocus(is,soft,always){ const g=mg, G=MGEO[g.id], svg=$("#msvg"); if(!svg) return;
  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9; is.forEach(i=>{ const b=mItemBox(i); x0=Math.min(x0,b.x); y0=Math.min(y0,b.y); x1=Math.max(x1,b.x+b.w); y1=Math.max(y1,b.y+b.h); });
  const bw=x1-x0, bh=y1-y0, r=svg.getBoundingClientRect(), ar=r.width/Math.max(1,r.height);
  const ctxk=(mg.mode==="name"||mg.mode==="type")?4:2.2, minw=(mg.mode==="name"||mg.mode==="type")?0.38:0.22;
  let w=Math.max(bw*ctxk,G.w*minw), h=w/ar; if(h<bh*ctxk){ h=bh*ctxk; w=h*ar; }
  if(w>G.w*1.1&&!always){ w=G.w*1.1; h=w/ar; }
  const cur=mVB(); const inside=x0>=cur.x&&y0>=cur.y&&x1<=cur.x+cur.w&&y1<=cur.y+cur.h;
  if(soft&&inside&&cur.w<=w*2.2&&Math.max(bw/cur.w,bh/cur.h)>0.04) return;
  if(!always&&inside&&cur.w<=w*1.5&&Math.max(bw/cur.w,bh/cur.h)>0.05) return;
  mAnimTo({x:(x0+x1)/2-w/2,y:(y0+y1)/2-h/2,w,h}); }
/* label declutter: higher priority labels win */
function mDeclutter(){ const g=mg, svg=$("#msvg"); if(!g||!svg) return; const m=MBY[g.id];
  const els=[...svg.querySelectorAll("text.ml")].filter(e=>!e.classList.contains("off"));
  const v=mVB(); const pr=e=>{ const i=+e.dataset.li, x=m.it[i]; let p=0;
    if(e.classList.contains("hlab")) p+=1000; if(g.fb&&(i===g.fb.tap)) p+=900; if(g.done[i]) p+=300; if(g.mode==="explore"&&g.hl===i) p+=1000;
    if(x[0]==="w"&&!x[6]) p+=60; if(x[6]) p+=20; if(x[0]==="x") p-=50; if(x[0]==="c") p+=x[4]===1?40:10; if(x[4]===2) p-=15; return p; };
  els.forEach(e=>e.classList.remove("hid"));
  const boxes=[]; els.map(e=>[pr(e),e]).sort((a,b)=>b[0]-a[0]).forEach(([p,e])=>{ let b; try{ b=e.getBBox(); }catch(_){ return; }
    if(b.x+b.width<v.x||b.x>v.x+v.w||b.y+b.height<v.y||b.y>v.y+v.h) return;
    const pad=b.height*0.08; const bb={x0:b.x-pad,y0:b.y,x1:b.x+b.width+pad,y1:b.y+b.height};
    if(p<1000&&boxes.some(o=>bb.x0<o.x1&&bb.x1>o.x0&&bb.y0<o.y1&&bb.y1>o.y0)){ e.classList.add("hid"); return; }
    boxes.push(bb); }); }

/* ----- hit testing ----- */
function mHits(clientX,clientY){
  const g=mg, m=MBY[g.id], svg=$("#msvg"), pt=mToSvg(clientX,clientY), sp=svg.createSVGPoint(); sp.x=pt.x; sp.y=pt.y;
  const u=mLastU||1, hit=$("#mhit"), inside=[], near=[];
  const tol=(mHard(g)?16:10)*u;
  hit.style.strokeWidth=(2*tol)+"px"; hit.style.stroke="#000";
  g.pool.forEach(i=>{ const x=m.it[i];
    if(x[5]==="z"){ const el=svg.querySelector(`[data-zi="${i}"]`); if(!el) return; if(el.isPointInFill(sp)) inside.push([i,0]); else { hit.setAttribute("d",x[7]); if(hit.isPointInStroke(sp)) near.push([i,tol*0.9]); } }
    else if(x[5]==="l"){ hit.setAttribute("d",x[7]); hit.style.strokeWidth=(mHard(g)?36:28)*u+"px"; if(hit.isPointInStroke(sp)) near.push([i,1]); hit.style.strokeWidth=(2*tol)+"px"; }
    else { const d=Math.hypot(x[2]-pt.x,x[3]-pt.y)/u; if(d<(mHard(g)?30:24)) near.push([i,d]); } });
  hit.style.stroke="none";
  return {inside,near};
}
function mTap(clientX,clientY){
  const g=mg; if(!g||g.fin) return; const m=MBY[g.id];
  const {inside,near}=mHits(clientX,clientY);
  const area=i=>{ const b=mItemBox(i); return b.w*b.h; };
  const rank=a=>a.sort((p,q)=>(m.it[p[0]][6]-m.it[q[0]][6])||(m.it[p[0]][5]==="z"&&m.it[q[0]][5]==="z"?area(p[0])-area(q[0]):p[1]-q[1]));
  if(g.mode==="explore"){ const c=rank(near.filter(x=>m.it[x[0]][5]!=="z")).concat(rank(inside)); g.hl=c.length?c[0][0]:null; mDraw(); return; }
  if(g.mode!=="find"||g.fb) return;
  const cur=mCur(g);
  if(inside.some(x=>x[0]===cur)||near.some(x=>x[0]===cur)){ mAnswer(cur); return; }
  const c=rank(near.filter(x=>m.it[x[0]][5]!=="z")).concat(rank(inside.filter(x=>!m.it[x[0]][6])),rank(inside.filter(x=>m.it[x[0]][6])),rank(near.filter(x=>m.it[x[0]][5]==="z")));
  if(!c.length){ if(mHard(g)) mAnswer(-1); else mNudge(clientX,clientY); return; }
  mAnswer(c[0][0]);
}
function mNudge(x,y){ const st=$("#m-stage"); if(!st) return; const d=document.createElement("i"); d.className="mripple"; const r=st.getBoundingClientRect(); d.style.left=(x-r.left)+"px"; d.style.top=(y-r.top)+"px"; st.appendChild(d); setTimeout(()=>d.remove(),500); }
function mBindStage(){
  const st=$("#m-stage"); if(!st) return; const svg=$("#msvg"); const ptrs=new Map(); let pan=null, moved=false, pinch=null, lastTap=0;
  st.addEventListener("pointerdown",e=>{ if(e.target.closest(".mzoom2")) return; cancelAnimationFrame(mAnim); st.setPointerCapture(e.pointerId); ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY}); if(ptrs.size===1) moved=false;
    if(ptrs.size===1){ const v=mVB(); pan={x:e.clientX,y:e.clientY,vx:v.x,vy:v.y}; } else if(ptrs.size===2){ const [a,b]=[...ptrs.values()]; const v=mVB(); pinch={d:Math.hypot(a.x-b.x,a.y-b.y),v:{...v},c:mToSvg((a.x+b.x)/2,(a.y+b.y)/2),m:{x:(a.x+b.x)/2,y:(a.y+b.y)/2}}; pan=null; moved=true; } });
  st.addEventListener("pointermove",e=>{ if(!ptrs.has(e.pointerId)) return; ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(pinch&&ptrs.size===2){ const [a,b]=[...ptrs.values()]; const d=Math.hypot(a.x-b.x,a.y-b.y); const f=d/Math.max(1,pinch.d); const v=mg.vb; const o=pinch.v;
      const r=svg.getBoundingClientRect(); const k=Math.max(o.w/r.width,o.h/r.height); const mx=(a.x+b.x)/2-pinch.m.x, my=(a.y+b.y)/2-pinch.m.y;
      v.w=o.w/f; v.h=o.h/f; v.x=pinch.c.x-(pinch.c.x-o.x)/f-mx*k/f; v.y=pinch.c.y-(pinch.c.y-o.y)/f-my*k/f; mClampVB(v); mApplyVB(); return; }
    if(pan){ const dx=e.clientX-pan.x, dy=e.clientY-pan.y; if(!moved&&Math.hypot(dx,dy)>8) moved=true; if(moved){ const r=svg.getBoundingClientRect(); const v=mg.vb; const k=Math.max(v.w/r.width,v.h/r.height); v.x=pan.vx-dx*k; v.y=pan.vy-dy*k; mClampVB(v); mApplyVB(); } } });
  const up=e=>{ if(!ptrs.has(e.pointerId)) return; ptrs.delete(e.pointerId); if(ptrs.size<2) pinch=null;
    if(ptrs.size===0){ if(!moved&&pan){ const now=Date.now(); if(now-lastTap<280&&e.pointerType!=="mouse"){ const c=mToSvg(e.clientX,e.clientY); mZoomAt(1.8,c.x,c.y,true); lastTap=0; } else { lastTap=now; mTap(e.clientX,e.clientY); } } pan=null; }
    else if(ptrs.size===1){ const p=[...ptrs.values()][0]; const v=mVB(); pan={x:p.x,y:p.y,vx:v.x,vy:v.y}; } };
  st.addEventListener("pointerup",up); st.addEventListener("pointercancel",e=>{ptrs.delete(e.pointerId); pinch=null; pan=null;});
  st.addEventListener("wheel",e=>{ e.preventDefault(); cancelAnimationFrame(mAnim); const c=mToSvg(e.clientX,e.clientY); mZoomAt(Math.pow(1.0018,-e.deltaY*(e.deltaMode?30:1)),c.x,c.y); },{passive:false});
  st.addEventListener("dblclick",e=>{ const c=mToSvg(e.clientX,e.clientY); mZoomAt(1.8,c.x,c.y,true); });
  $("#m-zi").onclick=()=>{ const v=mVB(); mZoomAt(1.6,v.x+v.w/2,v.y+v.h/2,true); };
  $("#m-zo").onclick=()=>{ const v=mVB(); mZoomAt(1/1.6,v.x+v.w/2,v.y+v.h/2,true); };
  $("#m-zr").onclick=()=>{ const G=MGEO[mg.id]; mAnimTo({x:0,y:0,w:G.w,h:G.h}); };
}
function mBindBottom(){
  const g=mg; if(!g) return;
  document.querySelectorAll("#mplay [data-say]").forEach(b=>b.onclick=()=>mSay(MBY[g.id].it[+b.dataset.say][1],g.id));
  const nx=$("#m-next"); if(nx){ nx.onclick=mNext; nx.focus({preventScroll:true}); }
  document.querySelectorAll("[data-mopt]").forEach(b=>b.onclick=()=>mAnswer(+b.dataset.mopt));
  const f=$("#m-typef"); if(f){ const inp=$("#m-typed"); inp.oninput=()=>{g.typed=inp.value}; f.onsubmit=e=>{e.preventDefault(); g.typed=inp.value; mCheckTyped();}; $("#m-idk").onclick=()=>mAnswer(-1); if(window.matchMedia("(pointer:fine)").matches) inp.focus({preventScroll:true}); }
  const q=$("#m-q"); if(q){ q.oninput=()=>{ mQuery=q.value; const pos=q.selectionStart; const bot=$("#m-bottom"); bot.innerHTML=mBottomHTML(g); mBindBottom(); const q2=$("#m-q"); q2.focus(); q2.setSelectionRange(pos,pos); }; }
  document.querySelectorAll("[data-mgoto]").forEach(b=>b.onclick=()=>{ g.hl=+b.dataset.mgoto; mFocus([g.hl],false,true); mDraw(); });
  const r=$("#m-retry"); if(r) r.onclick=()=>{ const miss=g.q.filter(i=>g.done[i]==="miss"); mStart(g.id,g.mode,{targets:miss,cats:g.cats,lvl:g.lvl}); };
  const a=$("#m-again"); if(a) a.onclick=()=>mStart(g.id,g.mode,{cats:g.cats,len:mLen,lvl:g.lvl});
  const hd=$("#m-harder"); if(hd) hd.onclick=()=>{ mLvl=Math.min(3,g.lvl+1); lsSet("wset3-mlvl",String(mLvl)); mStart(g.id,g.mode,{cats:g.cats,len:mLen,lvl:mLvl}); };
  const c2=$("#m-close2"); if(c2) c2.onclick=mClose;
  const nl=document.querySelector("[data-mnext]"); if(nl) nl.onclick=()=>{ mClose(); mSel=nl.dataset.mnext; render(); };
}
let mTick=null;
function bindMapPlay(){
  const g=mg; mBindStage(); mBindBottom(); mLastU=0;
  const c=$("#m-close"); if(c) c.onclick=mClose;
  if(!g.exam) document.body.classList.add("mlock");
  requestAnimationFrame(()=>{ mApplyNow(); if((g.mode==="name"||g.mode==="type")&&!g.fin) mFocus([mCur(g)],false,true); mDraw(); });
  clearInterval(mTick); mTick=setInterval(()=>{ const el=$("#m-clock"); if(el&&mg&&!mg.fin) el.textContent=mClock(mg); else if(!el) clearInterval(mTick); },1000);
}
function mgRefresh(){ mDraw(); }
function mStart(id,mode,opts){ mg=mgNew(id,mode,Object.assign({cats:[...mCats],len:mLen,lvl:mLvl},opts||{})); mSel=null; render(); }
function mClose(){ clearTimeout(mAdv); cancelAnimationFrame(mAnim); mg=null; document.body.classList.remove("mlock"); clearInterval(mTick); render(); }
window.addEventListener("resize",()=>{ if(mg&&$("#msvg")){ mLastU=0; mApplyVB(); } });
document.addEventListener("keydown",e=>{ if(!mg||mg.exam) return; if(e.key==="Escape"){ mClose(); } else if(e.key==="Enter"&&mg.fb&&!mg.fb.ok&&e.target.tagName!=="INPUT"){ e.preventDefault(); mNext(); }
  else if(mg.mode==="name"&&!mg.fb&&/^[1-4]$/.test(e.key)&&e.target.tagName!=="INPUT"){ const o=mOptions(mg)[+e.key-1]; if(o!==undefined) mAnswer(o); } });
document.getElementById("main").addEventListener("click",e=>{
  if(view!=="maps"||mg) return;
  const card=e.target.closest("[data-map]"); if(card){ mSel=card.dataset.map; render(); return; }
  if(e.target.id==="m-sheetx"||e.target.id==="m-sheetbg"){ mSel=null; render(); return; }
  const md=e.target.closest("[data-mmode]"); if(md){ mMode=md.dataset.mmode; lsSet("wset3-mmode",mMode); render(); return; }
  const lv=e.target.closest("[data-mlvl]"); if(lv){ mLvl=+lv.dataset.mlvl; lsSet("wset3-mlvl",String(mLvl)); render(); return; }
  const ml=e.target.closest("[data-mlen]"); if(ml){ mLen=+ml.dataset.mlen; lsSet("wset3-mlen",String(mLen)); render(); return; }
  if(e.target.closest("#m-go")){ mStart(mSel,mMode); return; }
});
document.getElementById("main").addEventListener("change",e=>{
  if(view!=="maps"||mg) return;
  if(e.target.id==="m-unlock"){ MAPP._unlock=e.target.checked; saveMaps(); render(); return; }
  const c=e.target.closest("[data-mcat]"); if(c){ c.checked?mCats.add(c.dataset.mcat):mCats.delete(c.dataset.mcat); if(!mCats.size) mCats.add("w"); render(); }
});
