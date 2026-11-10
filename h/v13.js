/* ---------- training hub ---------- */
const TRAIN=["practice","open","sat","maps"];
let trainV=lsGet("wset3-trainv")||"practice"; if(!TRAIN.includes(trainV)) trainV="practice";
function trainNav(){ return `<nav class="tnav" aria-label="${esc(t("train"))}">${TRAIN.map(v=>`<button type="button" data-tv="${v}" aria-pressed="${view===v}"><b>${t("tr_"+v)}</b><span>${t("trd_"+v)}</span></button>`).join("")}</nav>`; }
document.getElementById("main").addEventListener("click",e=>{
  const b=e.target.closest("[data-tv]"); if(!b) return;
  view=trainV=b.dataset.tv; lsSet("wset3-trainv",trainV); oq=null; satShow=null; satEdit=false; mg=null; render();
});

/* ---------- maps game ---------- */
const MAPS=__MAPS__;
const MGEO=__MGEO__;
const MBY={}; MAPS.forEach(m=>MBY[m.id]=m);
const MCAT=["w","c","r","g","x"];
const LSM="wset3-maps-v1";
let MAPP=(()=>{try{const x=JSON.parse(lsGet(LSM)||"{}");return x&&typeof x==="object"?x:{}}catch(e){return {}}})();
let mg=null, mScale="", mZoom=1, mCats=new Set(MCAT);
function saveMaps(){ lsSet(LSM,JSON.stringify(MAPP)); if(chatCol) chatCol.doc("maps").set({m:MAPP}).catch(()=>{}); }
function mergeMaps(r){ if(!r||typeof r!=="object") return; Object.keys(r).forEach(id=>{const a=MAPP[id]||{},b=r[id]||{}; MAPP[id]={p:Math.max(a.p||0,b.p||0),f:Math.max(a.f||0,b.f||0),n:Math.max(a.n||0,b.n||0)};}); }
function afterMapsLoad(){ lsSet(LSM,JSON.stringify(MAPP)); if(view==="maps"&&!mg) render(); }
const mTitle=m=>m.t[L()];
function stars(p){ const n=p>=90?3:p>=70?2:p>=40?1:0; return `<span class="stars" aria-label="${n}/3">${"★".repeat(n)}<i>${"★".repeat(3-n)}</i></span>`; }
function renderMaps(){
  const list=MAPS.filter(m=>!mScale||m.sc===mScale);
  const cards=list.map(m=>{const r=MAPP[m.id]||{}, best=Math.max(r.p||0,r.f||0);
    return `<button class="mcard" data-map="${m.id}"><span class="row" style="gap:6px;justify-content:space-between"><span class="tag">${esc(chName(m.ch))}</span>${stars(best)}</span><b>${esc(mTitle(m))}</b><span class="muted small">${m.it.length} ${t("mItems")} · ${m.sc==="macro"?t("mMacro"):t("mMicro")}${best?` · ${t("mBest")} ${best} %`:""}</span></button>`}).join("");
  return `<section class="view"><div class="card"><h2>${t("tr_maps")}</h2><p class="muted" style="max-width:68ch;font-size:.9rem">${t("mIntro")}</p>
   <div class="seg" role="group">${[["",t("mAll")],["macro",t("mMacro")],["micro",t("mMicro")]].map(([k,l])=>`<button data-msc="${k}" aria-pressed="${mScale===k}">${l}</button>`).join("")}</div></div>
   <div class="mlist">${cards}</div><p class="muted small">${t("mDrawn")}</p></section>`;
}
function mgNew(id,mode,opts){
  const m=MBY[id]; opts=opts||{};
  const cats=opts.cats||[...mCats];
  let idx=m.it.map((x,i)=>i).filter(i=>cats.includes(m.it[i][0]));
  if(opts.targets) idx=opts.targets.slice();
  return {id,mode,cats,idx,done:{},miss:{},sel:null,psel:null,err:0,first:0,q:shuffle(idx),qi:0,tries:0,tray:shuffle(idx),hl:null,fin:false,t0:Date.now(),exam:!!opts.exam,msg:""};
}
function mapSVG(g){
  const m=MBY[g.id], G=MGEO[g.id], inSet=new Set(g.idx);
  const ctx=g.mode==="explore"?"":m.it.map((x,i)=>inSet.has(i)?"":`<g class="ctx t-${x[0]}"><circle class="dot" cx="${x[2]}" cy="${x[3]}" r="3"/>${lbl(x)}</g>`).join("");
  const pins=g.idx.map(i=>{const x=m.it[i]; return `<g class="pin t-${x[0]} ${pinCls(g,i)}" data-pi="${i}"><circle class="hit" cx="${x[2]}" cy="${x[3]}" r="16"/><circle class="dot" cx="${x[2]}" cy="${x[3]}" r="6"/>${lbl(x)}</g>`}).join("");
  return `<svg class="mp" id="msvg" viewBox="0 0 ${G.w} ${G.h}" role="img" aria-label="${esc(mTitle(m))}"><rect width="${G.w}" height="${G.h}" fill="var(--mwater)"/><path class="land" d="${G.land}"/><path class="grat" d="${G.grat}"/><path class="lake" d="${G.lake}"/><path class="riv" d="${G.riv}"/><path class="b1" d="${G.b1}"/><path class="b0" d="${G.b0}"/><path class="band" d="${G.band}"/>${ctx}${pins}</svg>`;
  function lbl(x){ const right=x[2]<G.w*0.78; return `<text x="${right?x[2]+9:x[2]-9}" y="${x[3]+4}" text-anchor="${right?"start":"end"}">${esc(x[1])}</text>`; }
}
function pinCls(g,i){
  if(g.mode==="explore") return g.hl===i?"hl":"";
  if(g.done[i]) return "ok";
  let c="todo"; if(g.mode==="puzzle"&&g.psel===i) c+=" sel"; if(g.reveal===i) c+=" reveal"; return c;
}
function mgCount(g){ return Object.keys(g.done).length; }
function mgStatus(g){
  const n=g.idx.length, d=mgCount(g);
  if(g.mode==="explore") return `<p class="muted small" style="margin:0">${t("mExploreH")}</p>`;
  const prog=`<div class="prog"><i style="width:${n?d/n*100:0}%"></i></div><p class="muted small" style="margin:4px 0 0">${d}/${n} · ${t("mScoreTxt").replace("{C}",g.first).replace("{N}",n).replace("{E}",g.err)}</p>`;
  if(g.mode==="find"){ const cur=g.q[g.qi]; return `${prog}${cur!==undefined&&!g.fin?`<p class="mprompt" style="margin:8px 0 0">${t("mFindQ")}: <span style="color:var(--accent)">${esc(MBY[g.id].it[cur][1])}</span>?</p>`:""}<p class="small" id="m-msg" aria-live="polite" style="margin:4px 0 0;min-height:1.2em;font-weight:600;color:${g.msg===t("mRight")?"var(--good)":"var(--bad)"}">${g.fin?"":esc(g.msg)}</p>`; }
  return `${prog}<p class="small" id="m-msg" aria-live="polite" style="margin:4px 0 0;min-height:1.2em;font-weight:600;color:${g.msg===t("mRight")?"var(--good)":"var(--bad)"}">${g.fin?"":esc(g.msg)}</p>`;
}
function mgTray(g){
  if(g.mode!=="puzzle") return "";
  const m=MBY[g.id], left=g.tray.filter(i=>!g.done[i]);
  return `<div class="mtray" id="m-tray" aria-label="${esc(t("mPuzzleH"))}">${left.map(i=>`<button class="chip t-${m.it[i][0]}" data-mc="${i}" aria-pressed="${g.sel===i}">${esc(m.it[i][1])}</button>`).join("")}</div>`;
}
function mgDoneCard(g){
  if(!g.fin) return "";
  const n=g.idx.length, p=n?Math.round(g.first/n*100):0;
  if(g.exam) return "";
  return `<div class="card ograde"><span class="label">${t("mDone")}</span><div class="row" style="align-items:baseline;gap:14px"><span class="result-score ${p>=55?"pass":"fail"}">${p} %</span>${stars(p)}</div>
  <p class="muted" style="margin:0">${t("mScoreTxt").replace("{C}",g.first).replace("{N}",n).replace("{E}",g.err)}</p>
  <div class="row"><button class="btn primary" id="m-again">${t("mAgain")}</button><button class="btn" id="m-back2">${t("mBack")}</button></div></div>`;
}
function renderMapPlay(){
  const g=mg, m=MBY[g.id];
  const modes=g.exam?"":`<div class="seg" role="group">${[["explore",t("mExplore")],["puzzle",t("mPuzzle")],["find",t("mFind")]].map(([k,l])=>`<button data-mmode="${k}" aria-pressed="${g.mode===k}">${l}</button>`).join("")}</div>`;
  const cnt=c=>m.it.filter(x=>x[0]===c).length;
  const cats=g.exam?"":`<div class="mcats">${MCAT.filter(c=>cnt(c)).map(c=>`<label><input type="checkbox" data-mcat="${c}" ${g.cats.includes(c)?"checked":""}>${t("mc_"+c)} <span class="muted mono">${cnt(c)}</span></label>`).join("")}</div>`;
  const hint=g.mode==="puzzle"?t("mPuzzleH"):g.mode==="find"?t("mFindH"):"";
  return `<section class="view">${g.exam?"":`<div class="qhead"><span class="label">${t("tr_maps")}</span><button class="btn ghost" id="m-back">${t("mBack")}</button></div>`}
  <div class="card" style="display:flex;flex-direction:column;gap:12px">
   ${g.exam?"":`<div class="row" style="justify-content:space-between"><h2 style="margin:0">${esc(mTitle(m))}</h2><span class="pref">${t("mPage")} ${m.p}</span></div>`}
   <div class="mbar">${modes}<div class="mzoom"><button id="m-zo" aria-label="${esc(t("mZoomOut"))}">−</button><button id="m-zi" aria-label="${esc(t("mZoomIn"))}">+</button></div></div>
   ${g.exam?(hint?`<p class="muted small" style="margin:0">${hint}</p>`:""):`<details class="mfil"><summary>${t("mFilters")} · ${g.idx.length} ${t("mItems")}</summary><div style="display:flex;flex-direction:column;gap:8px;padding-top:8px">${cats}${hint?`<p class="muted small" style="margin:0">${hint}</p>`:""}</div></details>`}
   <div id="m-status">${mgStatus(g)}</div>
   <div class="mwrap" id="m-wrap">${g.idx.length?mapSVG(g):`<div class="empty">${t("mNoCat")}</div>`}</div>
   ${mgTray(g)}
  </div><div id="m-done">${mgDoneCard(g)}</div></section>`;
}
function mfit(){
  const svg=$("#msvg"), wrap=$("#m-wrap"); if(!svg||!wrap) return;
  svg.style.width=(mZoom*100)+"%";
  const u=svg.viewBox.baseVal.width/Math.max(1,svg.getBoundingClientRect().width);
  svg.style.setProperty("--u",u.toFixed(3));
  svg.querySelectorAll(".pin .dot").forEach(c=>c.setAttribute("r",(6.5*u).toFixed(1)));
  svg.querySelectorAll(".pin .hit").forEach(c=>c.setAttribute("r",(16*u).toFixed(1)));
  svg.querySelectorAll(".ctx .dot").forEach(c=>c.setAttribute("r",(3*u).toFixed(1)));
  svg.querySelectorAll("text").forEach(tx=>{const p=tx.previousElementSibling; if(!p) return; const cx=+p.getAttribute("cx"), right=tx.getAttribute("text-anchor")==="start"; tx.setAttribute("x",(right?cx+9*u:cx-9*u).toFixed(1)); tx.setAttribute("y",(+p.getAttribute("cy")+4*u).toFixed(1));});
}
function mgRefresh(){
  const g=mg; if(!g) return;
  const svg=$("#msvg"); if(svg) g.idx.forEach(i=>{const el=svg.querySelector(`[data-pi="${i}"]`); if(el) el.setAttribute("class",`pin t-${MBY[g.id].it[i][0]} ${pinCls(g,i)}`);});
  const st=$("#m-status"); if(st) st.innerHTML=mgStatus(g);
  const tr=$("#m-tray"); if(tr) tr.outerHTML=mgTray(g);
  const dn=$("#m-done"); if(dn) dn.innerHTML=mgDoneCard(g);
  if(g.exam&&MK&&!MK.fin){ MK.map.g=g; saveMK(); }
  bindMapDone();
}
function mgFinish(){
  const g=mg; g.fin=true; g.hl=null; g.psel=null; g.sel=null;
  if(g.exam){ mkMapDone(); return; }
  const n=g.idx.length, p=n?Math.round(g.first/n*100):0, m=MBY[g.id], r=MAPP[g.id]||{};
  if(g.mode==="puzzle") r.p=Math.max(r.p||0,p); else r.f=Math.max(r.f||0,p);
  r.n=(r.n||0)+1; MAPP[g.id]=r; saveMaps();
  P.s.push({t:Date.now(),m:"map",n,c:g.first,ch:[m.ch],w:mTitle(m)+" · "+t(g.mode==="puzzle"?"mPuzzle":"mFind")}); save();
}
function mgPick(i){ // pin tapped
  const g=mg; if(!g||g.fin) return;
  if(g.mode==="explore"){ g.hl=g.hl===i?null:i; mgRefresh(); return; }
  if(g.done[i]) return;
  g.msg="";
  if(g.mode==="find"){
    const cur=g.q[g.qi];
    if(i===cur){ g.done[i]=1; if(!g.tries) g.first++; g.tries=0; g.reveal=null; g.qi++; g.msg=t("mRight"); if(g.qi>=g.q.length) mgFinish(); }
    else { g.err++; g.tries++; g.msg=t("mWrong"); flashPin(i);
      if(g.tries>=3){ g.reveal=cur; mgRefresh(); setTimeout(()=>{ if(mg!==g) return; g.done[cur]=1; g.tries=0; g.reveal=null; g.qi++; if(g.qi>=g.q.length) mgFinish(); mgRefresh(); },1400); return; } }
    mgRefresh(); return;
  }
  // puzzle
  if(g.sel===null){ g.psel=g.psel===i?null:i; if(g.psel===null) g.msg=""; mgRefresh(); return; }
  mgTry(g.sel,i);
}
function mgChip(i){
  const g=mg; if(!g||g.fin||g.mode!=="puzzle") return;
  g.msg="";
  if(g.psel!==null){ mgTry(i,g.psel); return; }
  g.sel=g.sel===i?null:i; mgRefresh();
}
function mgTry(label,pin){
  const g=mg;
  if(label===pin){ g.done[pin]=1; if(!g.miss[pin]) g.first++; g.sel=null; g.psel=null; g.msg=t("mRight"); if(mgCount(g)>=g.idx.length) mgFinish(); mgRefresh(); }
  else { g.err++; g.miss[label]=(g.miss[label]||0)+1; g.msg=t("mWrong"); const keep=g.sel; mgRefresh(); flashPin(pin); const c=document.querySelector(`[data-mc="${label}"]`); if(c){c.classList.add("shake"); setTimeout(()=>c.classList.remove("shake"),400);} g.sel=keep; g.psel=null; mgRefresh(); }
}
function flashPin(i){ const el=document.querySelector(`#msvg [data-pi="${i}"]`); if(!el) return; el.classList.add("bad"); setTimeout(()=>el.classList.remove("bad"),600); }
function mgZoom(dz){
  const wrap=$("#m-wrap"); if(!wrap) return;
  const cx=(wrap.scrollLeft+wrap.clientWidth/2)/wrap.scrollWidth, cy=(wrap.scrollTop+wrap.clientHeight/2)/wrap.scrollHeight;
  mZoom=Math.max(1,Math.min(5,dz>0?mZoom*1.5:mZoom/1.5)); if(mZoom<1.05) mZoom=1;
  mfit(); wrap.scrollLeft=cx*wrap.scrollWidth-wrap.clientWidth/2; wrap.scrollTop=cy*wrap.scrollHeight-wrap.clientHeight/2;
}
function bindMapDone(){
  const a=$("#m-again"); if(a) a.onclick=()=>{ mg=mgNew(mg.id,mg.mode,{cats:mg.cats}); render(); };
  const b=$("#m-back2"); if(b) b.onclick=()=>{ mg=null; render(); };
}
function bindMapPlay(){
  mfit(); bindMapDone();
  const bk=$("#m-back"); if(bk) bk.onclick=()=>{ mg=null; render(); };
  $("#m-zi").onclick=()=>mgZoom(1); $("#m-zo").onclick=()=>mgZoom(-1);
  const svg=$("#msvg"); if(svg) svg.addEventListener("click",e=>{ const p=e.target.closest("[data-pi]"); if(p) mgPick(+p.dataset.pi); });
}
window.addEventListener("resize",()=>{ if(view==="maps"&&mg||view==="exam"&&MK&&mkSec()==="map") mfit(); });
document.getElementById("main").addEventListener("click",e=>{
  if(view!=="maps"&&view!=="exam") return;
  const c=e.target.closest("[data-mc]"); if(c&&mg){ mgChip(+c.dataset.mc); return; }
  if(view!=="maps") return;
  const card=e.target.closest("[data-map]"); if(card){ mZoom=1; mg=mgNew(card.dataset.map,"puzzle"); render(); return; }
  const sc=e.target.closest("[data-msc]"); if(sc){ mScale=sc.dataset.msc; render(); return; }
  const md=e.target.closest("[data-mmode]"); if(md&&mg){ mg=mgNew(mg.id,md.dataset.mmode,{cats:mg.cats}); render(); return; }
});
document.getElementById("main").addEventListener("change",e=>{
  const c=e.target.closest("[data-mcat]"); if(!c||!mg) return;
  const cats=new Set(mg.cats); c.checked?cats.add(c.dataset.mcat):cats.delete(c.dataset.mcat);
  mCats=cats; mg=mgNew(mg.id,mg.mode,{cats:[...cats]}); render();
});

/* ---------- mock exam ---------- */
const LSMK="wset3-mock-v1";
let MK=(()=>{try{const x=JSON.parse(lsGet(LSMK)||"null");return x&&x.secs?x:null}catch(e){return null}})();
let mkSel=new Set(["mcq","open","sat","map"]), mkN=50, mkMsg="", MKPEND=null;
function saveMK(){ if(MK) lsSet(LSMK,JSON.stringify(MK)); else { try{localStorage.removeItem(LSMK)}catch(e){} } }
const mkSec=()=>MK&&!MK.fin?MK.secs[MK.si]:null;
function sTarget(){ if(view==="exam"&&MK&&!MK.fin&&MK.go&&mkSec()==="sat") return MK.sat.c; if(view==="sat"&&satEdit&&satCur&&!satShow) return satCur; return null; }
function sTargetSave(){ if(view==="exam") saveMK(); else satSaveDraft(); }
function renderExam(){
  const opts=[["mcq","mkS_mcq","mkS_mcqD"],["open","mkS_open","mkS_openD"],["sat","mkS_sat","mkS_satD"],["map","mkS_map","mkS_mapD"]].map(([k,a,b])=>`<label><input type="checkbox" data-mks="${k}" ${mkSel.has(k)?"checked":""}><span><b>${t(a)}${k==="mcq"?` · <select id="mk-n">${[50,25,10].map(n=>`<option ${n===mkN?"selected":""}>${n}</option>`).join("")}</select>`:""}</b><small>${t(b)}</small></span></label>`).join("");
  const hist=P.s.filter(s=>s.m==="mock").slice(-8).reverse();
  return `<section class="view"><div class="card" style="display:flex;flex-direction:column;gap:12px"><h2 style="margin:0">${t("exam")}</h2><p class="muted" style="max-width:68ch;font-size:.9rem;margin:0">${t("mkIntro")}</p>
  ${MK&&!MK.fin?`<div class="row"><button class="btn primary" id="mk-resume">${t("mkResume")}</button><span id="mk-abw"><button class="btn ghost" id="mk-abandon">${t("mkAbandon")}</button></span></div>`:""}
  <div class="mkopt">${opts}</div><p class="chat-err small" id="mk-msg">${esc(mkMsg)}</p>
  <div class="row"><button class="btn ${MK&&!MK.fin?"":"primary"}" id="mk-start">${t("mkStart")}</button></div></div>
  ${MK&&MK.fin?`<div class="card"><button class="btn" id="mk-last">${t("mkResult")} · ${fmtDT(MK.ts)}</button></div>`:""}
  ${hist.length?`<div class="card"><h3>${t("history")}</h3><div class="tbl"><table><tr><th>${t("hDate")}</th><th>${t("hScope")}</th><th style="text-align:right">${t("hScore")}</th><th></th></tr>${hist.map(s=>{const p=Math.round(s.c/s.n*100);return `<tr><td>${fmtDT(s.t)}</td><td>${esc(s.w||"")}</td><td class="num">${p} %</td><td><span class="tag ${s.ok?"fixed":"active"}">${s.ok?t("passed"):t("failed")}</span></td></tr>`}).join("")}</table></div></div>`:""}
  ${examHistory()}</section>`;
}
function bindExamSetup(){
  document.querySelectorAll("[data-mks]").forEach(c=>c.onchange=()=>{c.checked?mkSel.add(c.dataset.mks):mkSel.delete(c.dataset.mks);});
  const n=$("#mk-n"); if(n) n.onchange=()=>{mkN=+n.value;};
  $("#mk-start").onclick=mkStart;
  const r=$("#mk-resume"); if(r) r.onclick=()=>{MK.go=true; saveMK(); render();};
  const a=$("#mk-abandon"); if(a) a.onclick=()=>{$("#mk-abw").innerHTML=`<span class="confirm">${t("resetSure")} <button class="btn" id="mk-aby">${t("yes")}</button></span>`; $("#mk-aby").onclick=()=>{MK=null; saveMK(); render();};};
  const l=$("#mk-last"); if(l) l.onclick=()=>{MK.go=true; render();};
}
function mkStart(){
  const secs=["mcq","open","sat","map"].filter(k=>mkSel.has(k));
  if(!secs.length){ mkMsg=t("mkNone"); render(); return; }
  mkMsg="";
  const N=mkN, share=[["f",8],["r",28],["s",5],["o",5],["t",4]];
  let ids=[], tot=0; share.forEach(([k,n],j)=>{const want=j===share.length-1?N-tot:Math.round(n*N/50); tot+=want; const g=GROUPS.find(g=>g.k===k); const pool=shuffle(BANK.filter(b=>g.c.includes(b.c)).map(b=>b.id)); ids=ids.concat(pool.slice(0,want));});
  const seenC=new Set(), oids=[]; shuffle(OPEN).forEach(o=>{ if(oids.length<4&&!seenC.has(o.c)&&o.c!=="cmp"){ seenC.add(o.c); oids.push(o.id); } });
  const p=SATP[Math.floor(Math.random()*SATP.length)];
  const mm=shuffle(MAPS.filter(m=>m.it.filter(x=>x[0]==="w").length>=10))[0];
  const targets=shuffle(mm.it.map((x,i)=>i).filter(i=>mm.it[i][0]==="w")).slice(0,10);
  MK={ts:Date.now(),secs,si:0,go:true,fin:false,
    mcq:{items:shuffle(ids).map(id=>({id,ord:shuffle([0,1,2,3]),pick:null})),i:0},
    open:{ids:oids,ans:{},i:0},
    sat:{c:{k:"A",pid:p.id,t:p.t,sp:!!p.sp,fo:!!p.fo,f:{},tx:{}}},
    map:{id:mm.id,targets,g:null},res:null};
  saveMK(); mg=null; render();
}
function mkHead(){
  const k=mkSec(), n=MK.secs.length;
  return `<div class="qhead"><span class="label">${t("exam")} · ${t("mkSection")} ${MK.si+1}/${n}: ${t("mkS_"+k)}</span><button class="btn ghost" id="mk-exit">${t("mkExit")}</button></div>`;
}
function renderMock(){
  if(MKPEND) return `<section class="view"><div class="card"><p class="mprompt">${t("mkGrading")}</p><div class="prog"><i style="width:${MKPEND.d/MKPEND.n*100}%"></i></div><p class="muted small">${MKPEND.d}/${MKPEND.n}</p></div></section>`;
  const k=mkSec(), l=L(); let body="";
  const last=MK.si===MK.secs.length-1, endBtn=`<button class="btn primary" id="mk-end">${last?t("mkEndAll"):t("mkEndSec")}</button>`;
  if(k==="mcq"){
    const q=MK.mcq, it=q.items[q.i], b=BY[it.id];
    const ch=it.ord.map((oi,j)=>`<button class="choice ${it.pick===oi?"sel":""}" data-mko="${oi}"><span class="k">${j+1}</span><span>${esc(b.o[oi][l])}</span></button>`).join("");
    const done=q.items.filter(x=>x.pick!==null).length;
    body=`<div class="prog"><i style="width:${done/q.items.length*100}%"></i></div>
    <div class="card" style="display:flex;flex-direction:column;gap:16px"><span class="label">${t("q")} <span class="mono">${q.i+1}/${q.items.length}</span></span><p class="qtext" style="margin:0">${esc(b.q[l])}</p><div class="choices">${ch}</div>
    <div class="row"><button class="btn" id="mk-prev" ${q.i?"":"disabled"}>${t("mkPrev")}</button>${q.i<q.items.length-1?`<button class="btn primary" id="mk-next">${t("mkNext")}</button>`:endBtn}</div><p class="chat-err small" id="mk-err">${esc(mkMsg)}</p></div>`;
  } else if(k==="open"){
    const q=MK.open, o=OBY[q.ids[q.i]], a=q.ans[o.id]||[];
    const parts=o.parts.map((p,i)=>`<div class="opart"><div class="ph"><b>${"abcdefgh"[i]}) ${esc(p.t[l])}</b><span class="tag mono">${p.m} ${t("oMarks")}</span></div><textarea data-mkp="${i}" aria-label="${esc(p.t[l])}">${esc(a[i]||"")}</textarea><span class="wc" data-mkwc="${i}">${wcount(a[i])} w</span></div>`).join("");
    body=`<div class="card" style="display:flex;flex-direction:column;gap:16px"><div class="row" style="gap:6px"><span class="tag">${esc(chName(o.c))}</span><span class="label">${t("q")} <span class="mono">${q.i+1}/${q.ids.length}</span></span></div><p class="qtext" style="margin:0">${esc(o.q[l])}</p>${parts}
    <div class="row"><button class="btn" id="mk-prev" ${q.i?"":"disabled"}>${t("mkPrev")}</button>${q.i<q.ids.length-1?`<button class="btn primary" id="mk-next">${t("mkNext")}</button>`:endBtn}</div></div>`;
  } else if(k==="sat"){
    const c=MK.sat.c, p=SBY[c.pid];
    const secs=SSEC.map(([s,ks])=>`<div class="sat-sec"><h3>${t(s)}</h3>${ks.map(kk=>sField(kk,c)).join("")}</div>`).join("");
    body=`<div class="card" style="display:flex;flex-direction:column;gap:18px"><p class="label" style="margin:0">${t("mkWine")}</p><p class="sat-wine">${esc(p.n)}</p><p class="muted" style="margin:0">${t("sTaskA")}</p><p class="muted small" style="margin:0">${t("sTermsNote")}</p>${secs}<div class="row">${endBtn}</div></div>`;
  } else if(k==="map"){
    if(!mg||!mg.exam){ const s=MK.map; mg=s.g||mgNew(s.id,"find",{targets:s.targets,exam:true}); mg.exam=true; s.g=mg; }
    body=`<div class="card"><p class="label" style="margin:0">${t("mkMapT")}: ${esc(mTitle(MBY[mg.id]))}</p></div>${renderMapPlay()}<div class="row">${endBtn}</div>`;
  }
  return `<section class="view">${mkHead()}${body}</section>`;
}
function mkMapDone(){ MK.map.g=mg; saveMK(); mgRefresh(); }
function bindMock(){
  window.scrollTo(0,0);
  if(MKPEND) return;
  $("#mk-exit").onclick=()=>{ MK.go=false; saveMK(); mg=null; render(); };
  const k=mkSec();
  if(k==="mcq"){
    document.querySelectorAll("[data-mko]").forEach(b=>b.onclick=()=>{ MK.mcq.items[MK.mcq.i].pick=+b.dataset.mko; mkMsg=""; saveMK(); document.querySelectorAll("[data-mko]").forEach(x=>x.classList.toggle("sel",x===b)); });
  }
  if(k==="open"){
    document.querySelectorAll("[data-mkp]").forEach(ta=>ta.oninput=()=>{const id=MK.open.ids[MK.open.i]; const a=MK.open.ans[id]||(MK.open.ans[id]=[]); a[+ta.dataset.mkp]=ta.value; saveMK(); const w=document.querySelector(`[data-mkwc="${ta.dataset.mkp}"]`); if(w) w.textContent=wcount(ta.value)+" w";});
  }
  if(k==="map"){ bindMapPlay(); }
  const pv=$("#mk-prev"); if(pv) pv.onclick=()=>{ const s=k==="mcq"?MK.mcq:MK.open; s.i--; saveMK(); render(); };
  const nx=$("#mk-next"); if(nx) nx.onclick=()=>{ const s=k==="mcq"?MK.mcq:MK.open; s.i++; saveMK(); render(); };
  const en=$("#mk-end"); if(en) en.onclick=()=>{
    if(k==="mcq"){ const un=MK.mcq.items.filter(x=>x.pick===null).length; const msg=t("mkUnanswered").replace("{N}",un); if(un&&mkMsg!==msg){ mkMsg=msg; const er=$("#mk-err"); if(er) er.textContent=msg; return; } }
    mkMsg="";
    if(k==="map"&&mg){ MK.map.g=mg; }
    if(MK.si<MK.secs.length-1){ MK.si++; mg=null; saveMK(); render(); } else mkFinish();
  };
}
async function aiJSON(prompt){
  if(sampleFn===undefined) await sampleReady;
  if(!sampleFn||chatOff) throw {code:"not_granted"};
  try{ if(typeof sampleFn.json!=="function") throw {code:"capability_removed"}; return await sampleFn.json(prompt,{cache:false}); }
  catch(e){ if(e&&e.code==="capability_removed"){ const r=await sampleFn(prompt,{cache:false}); const m=String(r.text).match(/\{[\s\S]*\}/); return m?JSON.parse(m[0]):null; } throw e; }
}
async function mkFinish(){
  const R={}, now=Date.now();
  const jobs=[]; if(MK.secs.includes("open")) MK.open.ids.forEach(id=>jobs.push(["open",id])); if(MK.secs.includes("sat")) jobs.push(["sat"]);
  MKPEND={d:0,n:Math.max(1,jobs.length)}; render();
  if(MK.secs.includes("mcq")){ const it=MK.mcq.items; it.forEach(x=>{ if(x.pick!==null) record(x.id,x.pick===0,x.pick); }); R.mcq={s:it.filter(x=>x.pick===0).length,m:it.length}; }
  if(MK.secs.includes("map")){ const g=MK.map.g; const n=MK.map.targets.length; R.map={s:g?g.first:0,m:n}; }
  for(const j of jobs){
    if(j[0]==="open"){
      const o=OBY[j[1]], ans=o.parts.map((p,i)=>((MK.open.ans[o.id]||[])[i]||"").trim());
      const row={id:o.id,s:0,m:omax(o),ai:false,g:null};
      if(ans.some(a=>a)){ try{ const g=cleanGrade(o,await aiJSON(gradePrompt(o,ans))); row.g=g; row.s=g.parts.reduce((a,x)=>a+x.score,0); row.ai=true;
          (OA[o.id]=OA[o.id]||[]).push({ts:now+jobs.indexOf(j),a:ans,g,s:row.s,m:row.m}); if(OA[o.id].length>8) OA[o.id]=OA[o.id].slice(-8); saveOA(o.id);
        }catch(e){ row.err=true; } } else row.ai=true;
      (R.open=R.open||[]).push(row);
    } else {
      const c=MK.sat.c, p=SBY[c.pid], st=satStruct(c,p);
      const e={ts:now,k:"A",pid:c.pid,t:c.t,sp:c.sp,fo:c.fo,f:Object.assign({},c.f),tx:Object.assign({},c.tx),sc:{s:st.s,m:st.m},g:null};
      try{ const g=await aiJSON(satPromptA(e,p)); const a=g.aromas||{}, q=g.conclusion||{};
        const as=Math.max(0,Math.min(4,Math.round((Number(a.score)||0)*2)/2)), qs=Math.max(0,Math.min(2,Math.round((Number(q.score)||0)*2)/2));
        e.g={as,qs,hit:sArr(a.hit,10),missed:sArr(a.missed,8),wrong:sArr(a.wrong,6),qc:sStr(q.comment),st:sStr(g.structure),fb:sStr(g.feedback)}; e.sc={s:st.s+as+qs,m:st.m+6};
      }catch(err){}
      SJ[e.ts]=e; saveSJ(e.ts); R.sat={s:e.sc.s,m:e.sc.m,ts:e.ts,ai:!!e.g};
    }
    MKPEND.d++; render();
  }
  if(R.open){ const ok=R.open.filter(r=>r.ai); R.openT={s:ok.reduce((a,r)=>a+r.s,0),m:ok.reduce((a,r)=>a+r.m,0),na:R.open.length-ok.length}; }
  const pcts=[]; if(R.mcq) pcts.push(R.mcq.s/R.mcq.m); if(R.openT&&R.openT.m) pcts.push(R.openT.s/R.openT.m); if(R.sat) pcts.push(R.sat.s/R.sat.m); if(R.map) pcts.push(R.map.s/R.map.m);
  const overall=pcts.length?Math.round(pcts.reduce((a,b)=>a+b,0)/pcts.length*100):0, ok=pcts.length&&pcts.every(p=>p>=0.55);
  R.overall=overall; R.ok=!!ok;
  MK.res=R; MK.fin=true; MK.go=true; MKPEND=null; saveMK(); mg=null;
  P.s.push({t:now,m:"mock",n:100,c:overall,ok:!!ok,ch:[],w:MK.secs.map(s=>t("mkS_"+s)).join(" · ")}); save();
  render();
}
function mkPct(x){ return x&&x.m?Math.round(x.s/x.m*100):null; }
function renderMockRes(){
  const R=MK.res, l=L();
  const row=(k,x,extra)=>{ const p=mkPct(x); return `<span>${t("mkS_"+k)}${extra||""}</span><span class="num">${x?`${Math.round(x.s*10)/10}/${x.m}`:"–"}</span><span>${p===null?`<span class="tag">${t("mkNoAI")}</span>`:`<span class="tag ${p>=55?"fixed":"active"}">${p} %</span>`}</span>`; };
  const rows=MK.secs.map(k=>k==="mcq"?row(k,R.mcq):k==="open"?row(k,R.openT&&R.openT.m?R.openT:null,R.openT&&R.openT.na?` <span class="muted small">(${R.openT.na} ${t("mkNoAI")})</span>`:""):k==="sat"?row(k,R.sat):row(k,R.map)).join("");
  let det="";
  if(R.mcq){ const wrong=MK.mcq.items.filter(x=>x.pick!==0);
    det+=`<details class="model"><summary>${t("mkS_mcq")} · ${t("wrong")}: ${wrong.length}</summary><div class="mb"><div class="elist">${wrong.map(x=>{const b=BY[x.id];return `<details class="err on"><summary><span style="font-weight:500">${esc(b.q[l])}</span></summary><div class="ebody"><dl class="ans"><dt>${t("goodAns")}</dt><dd class="g">${esc(optText(b,0))}</dd>${x.pick===null?"":`<dt>${t("yourAns")}</dt><dd class="b">${esc(optText(b,x.pick))}</dd>`}</dl><div class="expl"><span>${esc(ex(b))}</span><span class="pref">${esc(chName(b.c))} · ${t("page")} ${b.p}</span></div></div></details>`}).join("")}</div></div></details>`; }
  if(R.open) det+=`<details class="model"><summary>${t("mkS_open")}</summary><div class="mb">${R.open.map(r=>{const o=OBY[r.id];return `<div class="gpart" style="margin-bottom:10px"><div class="row" style="justify-content:space-between"><b>${esc(o.q[l])}</b><span class="mono">${r.ai?`${r.s}/${r.m}`:t("mkNoAI")}</span></div>${r.g&&r.g.feedback?`<p style="margin:0">${esc(r.g.feedback)}</p>`:""}<button class="btn ghost" data-mkoq="${o.id}">${t("mkReview")}</button></div>`}).join("")}</div></details>`;
  if(R.sat) det+=`<div class="row"><button class="btn" data-mksj="${R.sat.ts}">${t("mkS_sat")} · ${t("mkReview")}</button></div>`;
  return `<section class="view"><div class="card ograde"><span class="label">${t("mkResult")} · ${fmtDT(MK.ts)}</span>
   <div class="row" style="align-items:baseline;gap:14px"><span class="result-score ${R.ok?"pass":"fail"}">${R.overall} %</span><span class="tag ${R.ok?"fixed":"active"}">${R.ok?t("mkPassAll"):t("mkFailSome")}</span></div>
   <div class="mksec">${rows}</div>
   <div class="row"><button class="btn primary" id="mk-new">${t("mkNew")}</button><button class="btn ghost" id="mk-close">${t("back")}</button></div></div>
   ${det}${chatBox("k_"+MK.ts)}</section>`;
}
function mkCtxPrompt(ts){
  if(!MK||String(MK.ts)!==String(ts)||!MK.res) return "You are a WSET Level 3 tutor. Reply in "+CLN[lang]+".";
  const R=MK.res, wrong=R.mcq?MK.mcq.items.filter(x=>x.pick!==0).slice(0,25).map(x=>{const b=BY[x.id];return "- ["+CH[b.c].en+"] "+b.q[2]+" → correct: "+b.o[0][2]}).join("\n"):"";
  const op=(R.open||[]).map(r=>"- "+OBY[r.id].q[2]+": "+(r.ai?r.s+"/"+r.m:"not marked")+(r.g&&r.g.feedback?" — "+r.g.feedback:"")).join("\n");
  return `You are a patient, expert tutor for the WSET Level 3 Award in Wines (textbook "Understanding Wines: Explaining Style and Quality"). The student has just finished a mock exam and wants to discuss the result.
Reply in ${CLN[lang]}, concisely (80–200 words), within the WSET Level 3 syllabus, explaining causes and effects. No headings or tables.

Overall: ${R.overall}% (${R.ok?"pass":"fail"}). Sections: ${MK.secs.join(", ")}.
${R.mcq?`Multiple choice: ${R.mcq.s}/${R.mcq.m}. Wrong answers:\n${wrong}`:""}
${op?`Open questions:\n${op}`:""}
${R.sat?`Theory tasting note: ${R.sat.s}/${R.sat.m}`:""}
${R.map?`Geography: ${R.map.s}/${R.map.m} places found first time on the map "${mTitle(MBY[MK.map.id])}"`:""}

The conversation with the student follows.`;
}
document.getElementById("main").addEventListener("click",e=>{
  if(view!=="exam"||!MK||!MK.fin||!MK.go) return;
  if(e.target.closest("#mk-new")){ MK.go=false; saveMK(); render(); return; }
  if(e.target.closest("#mk-close")){ MK.go=false; saveMK(); render(); return; }
  const oqb=e.target.closest("[data-mkoq]"); if(oqb){ view=trainV="open"; openQ(oqb.dataset.mkoq); return; }
  const sj=e.target.closest("[data-mksj]"); if(sj){ view=trainV="sat"; satShow=+sj.dataset.mksj; render(); return; }
});
