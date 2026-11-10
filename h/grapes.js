/* ---------- grape profiles + matching game ---------- */
const GRAPES=__GRAPES__;
const GUNITS=__UNITS__;
const GBY={}; GRAPES.forEach(g=>GBY[g.k]=g);
const LSG="wset3-match";
let MT=(()=>{try{const x=JSON.parse(lsGet(LSG)||"{}");return x&&typeof x==="object"?x:{}}catch(e){return {}}})();
MT.xp=MT.xp||0; MT.days=MT.days||[]; MT.u=MT.u||{}; MT.g=MT.g||{};
let gvCol=lsGet("wset3-gvcol")||"all", gvUnit=lsGet("wset3-gvunit")||"all", gvQ="";
let mtType=lsGet("wset3-mttype")||"mix", mtSnd=lsGet("wset3-mtsnd")!=="0", ML=null;
const gdOf=k=>MT.g[k]||(MT.g[k]={ok:0,ko:0,w:0});
function saveMT(){ lsSet(LSG,JSON.stringify(MT)); if(chatCol) chatCol.doc("match").set({m:MT}).catch(()=>{}); }
function mergeMT(r){ if(!r||typeof r!=="object") return;
  MT.xp=Math.max(MT.xp||0,r.xp||0);
  MT.days=[...new Set([...(MT.days||[]),...(Array.isArray(r.days)?r.days:[])])].sort().slice(-400);
  Object.entries(r.u||{}).forEach(([k,v])=>{ const a=MT.u[k]||{n:0}; MT.u[k]={n:Math.max(a.n||0,(v&&v.n)||0)}; });
  Object.entries(r.g||{}).forEach(([k,v])=>{ const a=MT.g[k]; if(!v) return; if(!a||((v.ok||0)+(v.ko||0))>((a.ok||0)+(a.ko||0))) MT.g[k]={ok:v.ok||0,ko:v.ko||0,w:v.w||0}; }); }
function afterMTLoad(){ lsSet(LSG,JSON.stringify(MT)); if((view==="match"&&!ML)||view==="grapes") render(); }
const gMast=k=>{ const d=MT.g[k]; if(!d||!d.ok) return 0; if(d.ok>=8&&!d.w) return 3; if(d.ok>=4&&d.w<2) return 2; return 1; };
const dayKey=d=>{ const x=new Date(d); return x.getFullYear()+"-"+String(x.getMonth()+1).padStart(2,"0")+"-"+String(x.getDate()).padStart(2,"0"); };
function mtStreak(){ const s=new Set(MT.days||[]); let n=0, d=Date.now(); if(!s.has(dayKey(d))) d-=DAY; while(s.has(dayKey(d))){ n++; d-=DAY; } return n; }
const uLevel=u=>Math.min(5,Math.floor(((MT.u[u]||{}).n||0)/2));
const uName=u=>{ if(u==="all") return t("mtAll"); if(u==="rev") return t("mtReview"); const x=GUNITS.find(z=>z[0]===u); return x?x[1][L()]:u; };

/* scale helpers */
const GSC={L:0,"M-":1,M:2,"M+":3,H:4,F:4};
function gWord(code,kind){ const W={a:[["bassa","media","alta"],["basse","moyenne","haute"],["low","medium","high"]],t:[["basso","medio","alto"],["bas","moyen","élevé"],["low","medium","high"]],b:[["leggero","medio","pieno"],["léger","moyen","ample"],["light","medium","full"]]}[kind][L()];
  const one=c=>c==="L"?W[0]:(c==="H"||c==="F")?W[2]:W[1]; return code.split("/").map(one).join("–"); }
function gScale(code,kind,lab){ if(!code) return ""; const p=code.split("/"), a=GSC[p[0]], b=GSC[p[p.length-1]];
  return `<div class="gsc"><span class="gsl">${esc(lab)}</span><span class="gbar" aria-hidden="true">${[0,1,2,3,4].map(i=>`<i class="${i>=a&&i<=b?"on":""}"></i>`).join("")}</span><span class="gsv">${esc(gWord(code,kind))}</span></div>`; }
const gRip=c=>({E:t("gvE"),M:t("gvM"),L:t("gvL")}[c]||"");
const gTri=a=>Array.isArray(a)?(a[L()]||a[2]||""):"";
function gMapOf(key){ let best=null; MAPS.forEach(m=>{ const i=m.it.findIndex(x=>x[0]==="w"&&x[1]===key); if(i<0) return; const sc=m.sc==="micro"?0:1; if(!best||sc<best.sc) best={id:m.id,i,sc}; }); return best; }
function gOpenMap(key){ const b=gMapOf(key); if(!b) return; ML=null; view=trainV="maps"; lsSet("wset3-trainv",trainV); mg=mgNew(b.id,"explore"); mg.hl=b.i; render(); setTimeout(()=>{ try{ mFocus([b.i],false,true); mDraw(); }catch(e){} },80); }
const gDots=k=>{ const m=gMast(k); return `<span class="gdots" title="${esc(t("gvMast"))}" aria-label="${esc(t("gvMast"))} ${m}/3">${[1,2,3].map(i=>`<i class="${i<=m?"on":""}"></i>`).join("")}</span>`; };

function renderGrapeSheet(g){
  const regs=g.reg.map(r=>`<button type="button" class="chip gchip" data-gmap="${esc(r)}" title="${esc(t("gvMap"))}">${esc(mName(r))}</button>`).join("");
  const syn=g.syn.length?`<p class="gsyn"><b>${t("gvSyn")}:</b> ${esc(g.syn.join(", "))}</p>`:"";
  return `<div class="gsheet">
    <div class="gfacts">
      <div class="gpills"><span class="gpill ${g.c==="w"?"gw":"gb"}">${t(g.c==="w"?"gvWhite1":"gvBlack1")}</span>${g.bud?`<span class="gpill">${t("gvBud")}: <b>${gRip(g.bud)}</b></span>`:""}${g.rip?`<span class="gpill">${t("gvRip")}: <b>${gRip(g.rip)}</b></span>`:""}</div>
      ${gScale(g.a,"a",t("gvA"))}${g.c==="b"?gScale(g.t,"t",t("gvT")):""}${gScale(g.b,"b",t("gvBo"))}
    </div>
    <div class="gsec"><h4>${t("gvClim")}</h4><p>${esc(gTri(g.cl))}</p></div>
    <div class="gsec"><h4>${t("gvAr")}</h4><p>${esc(gTri(g.ar))}</p></div>
    <div class="gsec"><h4>${t("gvWm")}</h4><p>${esc(gTri(g.wm))}</p></div>
    ${gTri(g.tip)?`<div class="gtip"><b>${t("gvTip")}</b> ${esc(gTri(g.tip))}</div>`:""}
    ${regs?`<div class="gsec"><h4>${t("gvReg")}</h4><div class="greg">${regs}</div></div>`:""}
    ${syn}
    <div class="row" style="justify-content:flex-start;margin-top:4px"><button type="button" class="btn" data-mtgo="${g.u}">${t("gvPlay")}</button></div>
  </div>`;
}
function renderGrapes(){
  const col=[["all","gvAll"],["w","gvW"],["b","gvB"]].map(([k,l])=>`<button type="button" data-gvcol="${k}" aria-pressed="${gvCol===k}">${t(l)}</button>`).join("");
  const units=[["all",t("gvAll")],...GUNITS.map(u=>[u[0],u[1][L()]])].map(([k,l])=>`<button type="button" class="chip" data-gvunit="${k}" aria-pressed="${gvUnit===k}">${esc(l)}</button>`).join("");
  const list=GUNITS.filter(u=>gvUnit==="all"||gvUnit===u[0]).map(u=>{
    const gs=GRAPES.filter(g=>g.u===u[0]&&(gvCol==="all"||g.c===gvCol)); if(!gs.length) return "";
    return `<div class="gunit"><h3>${esc(u[1][L()])}</h3>${gs.map(g=>`<details class="gcard" data-gname="${esc((g.k+" "+g.syn.join(" ")).toLowerCase())}"><summary><span class="gdot ${g.c==="w"?"gw":"gb"}" aria-hidden="true"></span><span class="gnm">${esc(g.k)}</span>${g.syn.length?`<span class="gsy muted">${esc(g.syn.slice(0,2).join(" · "))}</span>`:""}${gDots(g.k)}</summary>${renderGrapeSheet(g)}</details>`).join("")}</div>`; }).join("");
  return `<section class="view"><div class="card"><div class="ghead"><div><h2>${t("tr_grapes")}</h2><p class="muted" style="max-width:68ch;font-size:.9rem">${t("gvIntro")}</p></div>${gfree("n11",170)}</div>
    <div class="gfilt"><div class="seg" role="group">${col}</div><input type="search" id="gv-q" class="gq" placeholder="${esc(t("gvSearch"))}" value="${esc(gvQ)}" autocomplete="off"></div>
    <div class="gunits row" style="justify-content:flex-start">${units}</div></div>
    <div id="gv-list">${list}</div><p class="muted" id="gv-none" hidden>${t("gvNone")}</p></section>`;
}
function gvFilter(){ const q=gvQ.trim().toLowerCase(); let n=0; document.querySelectorAll(".gcard").forEach(d=>{ const ok=!q||d.dataset.gname.includes(q); d.hidden=!ok; if(ok) n++; if(q&&ok&&n<=2) d.open=true; });
  document.querySelectorAll(".gunit").forEach(u=>u.hidden=![...u.querySelectorAll(".gcard")].some(d=>!d.hidden)); const e=$("#gv-none"); if(e) e.hidden=!!n; }

/* ---------- matching game ---------- */
const MTYPES=[["mix","mtMix"],["reg","mtReg"],["sig","mtSig"],["tr","mtTr"],["syn","mtSyn"]];
function gxHas(r,g){ const x=GX.items[r]; if(!x) return false; return x[0].some(v=>gSame(v,g.k)||g.syn.includes(v)); }
function gPool(u){ if(u==="all") return GRAPES.slice(); if(u==="rev") return GRAPES.filter(g=>(MT.g[g.k]||{}).w>0); return GRAPES.filter(g=>g.u===u); }
function wPick(pool){ /* weighted shuffle: weak grapes first */ return pool.map(g=>{ const d=MT.g[g.k]||{ok:0,w:0}; return [g, Math.random()*(1+ (d.w||0)*1.5 + (d.ok?0:1.2))]; }).sort((a,b)=>b[1]-a[1]).map(x=>x[0]); }
function buildRound(kind,pool){
  const N=5, out=[];
  if(kind==="reg"){ const chosen=[];
    for(const g of wPick(pool.filter(g=>g.reg.length))){ if(chosen.length>=N) break;
      if(chosen.some(c=>gxHas(c.r,g)||g.reg.includes(c.r))) continue;
      const rs=shuffle(g.reg).filter(r=>!chosen.some(c=>c.g.reg.includes(r)||gxHas(r,c.g)));
      if(rs.length) chosen.push({g,r:rs[0]}); }
    chosen.forEach(c=>out.push({k:c.g.k,l:c.g.k,r:mName(c.r)})); }
  else if(kind==="syn"){ const P=pool.filter(g=>g.syn.length), extra=GRAPES.filter(g=>g.syn.length&&!P.includes(g));
    const src=[...wPick(P),...shuffle(extra)].slice(0,N); src.forEach(g=>out.push({k:g.k,l:g.k,r:shuffle(g.syn)[0]})); }
  else { wPick(pool).slice(0,N).forEach(g=>out.push({k:g.k,l:g.k,r:gTri(g[kind])})); }
  if(out.length<3) return null;
  return {kind,pairs:out,lo:shuffle(out.map((_,i)=>i)),ro:shuffle(out.map((_,i)=>i)),done:new Set()};
}
function mtStart(u,type){
  const pool=gPool(u); if(pool.length<3) return;
  const seq=type==="mix"?shuffle(["reg","sig","tr",pool.filter(g=>g.syn.length).length>=3?"syn":"reg"]):[type,type,type,type];
  const rounds=seq.map(k=>buildRound(k,pool)||buildRound("sig",pool)).filter(Boolean);
  ML={u,type,rounds,ri:0,hearts:3,sel:{l:null,r:null},right:0,wrong:0,mist:{},xp:0,t0:Date.now(),t1:null,fin:false,fail:false,lock:false};
  view=trainV="match"; lsSet("wset3-trainv",trainV); render();
}
let actx=null;
function mtBeep(ok){ if(!mtSnd) return; try{ actx=actx||new (window.AudioContext||window.webkitAudioContext)(); const o=actx.createOscillator(), g=actx.createGain(); o.connect(g); g.connect(actx.destination);
  const t0=actx.currentTime; o.type=ok?"sine":"triangle"; o.frequency.setValueAtTime(ok?660:220,t0); if(ok) o.frequency.setValueAtTime(880,t0+.08); g.gain.setValueAtTime(.0001,t0); g.gain.exponentialRampToValueAtTime(.12,t0+.02); g.gain.exponentialRampToValueAtTime(.0001,t0+(ok?.22:.3)); o.start(t0); o.stop(t0+.32); }catch(e){} }
const heartSvg=on=>`<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" class="mth ${on?"on":""}"><path d="M12 21s-7.5-4.6-10-9.3C.3 8.4 2.2 4.5 6 4.5c2.2 0 3.5 1.2 4.3 2.4.4.6 1 .6 1.4 0 .8-1.2 2.1-2.4 4.3-2.4 3.8 0 5.7 3.9 4 7.2C19.5 16.4 12 21 12 21z"/></svg>`;
function renderLesson(){ const g=ML;
  if(g.fin) return renderLessonEnd();
  const r=g.rounds[g.ri], tot=g.rounds.reduce((s,x)=>s+x.pairs.length,0), got=g.rounds.slice(0,g.ri).reduce((s,x)=>s+x.pairs.length,0)+r.done.size;
  const kl={reg:"mtReg",sig:"mtSig",tr:"mtTr",syn:"mtSyn"}[r.kind];
  const tile=(side,i,n)=>{ const p=r.pairs[i], txt=side==="l"?p.l:p.r, done=r.done.has(i), sel=g.sel[side]===i;
    return `<button type="button" class="mtt ${side==="l"?"mtl":"mtr"}${done?" ok":""}${sel?" sel":""}" data-mts="${side}" data-mti="${i}" ${done?"disabled":""}><span class="mtk mono" aria-hidden="true">${n}</span><span class="mtx">${esc(txt)}</span></button>`; };
  return `<section class="view mtl-wrap"><div class="mthead"><button type="button" class="btn ghost mtq" id="mt-quit" aria-label="${esc(t("mtQuit"))}">✕</button>
    <div class="mtprog" role="progressbar" aria-valuemin="0" aria-valuemax="${tot}" aria-valuenow="${got}"><i style="width:${Math.round(got/tot*100)}%"></i></div>
    <div class="mthearts" aria-label="${g.hearts} ♥">${[0,1,2].map(i=>heartSvg(i<g.hearts)).join("")}</div></div>
    <div class="mtbody"><p class="mtkind">${esc(uName(g.u))} · ${t(kl)}</p><h2 class="mtprompt">${t("mtPrompt")}</h2>
    <div class="mtgrid"><div class="mtcol">${r.lo.map((i,j)=>tile("l",i,j+1)).join("")}</div><div class="mtcol">${r.ro.map((i,j)=>tile("r",i,(j+6)%10)).join("")}</div></div>
    <p class="muted mtkeys">${t("mtKeys")}</p></div><div class="mtfb" id="mt-fb" aria-live="polite"></div></section>`;
}
function renderLessonEnd(){ const g=ML, acc=g.right+g.wrong?Math.round(g.right/(g.right+g.wrong)*100):0, sec=Math.round(((g.t1||Date.now())-g.t0)/1000);
  const mist=Object.keys(g.mist); const lv=uLevel(g.u);
  return `<section class="view"><div class="card mtend ${g.fail?"fail":""}">${gfree(g.fail?"n03":"n14",170)}
    <h2>${t(g.fail?"mtFail":"mtDone")}</h2>${g.fail?`<p class="muted">${t("mtFailD")}</p>`:(g.wrong===0?`<p class="mtperf">${t("mtPerfect")}</p>`:"")}
    <div class="mtstats"><div><b>+${g.xp}</b><span>${t("mtGain")}</span></div><div><b>${acc}%</b><span>${t("mtAcc")}</span></div><div><b>${Math.floor(sec/60)}:${String(sec%60).padStart(2,"0")}</b><span>${t("mtTime")}</span></div></div>
    ${g.u!=="all"&&g.u!=="rev"?`<p class="muted">${esc(uName(g.u))} · ${t("mtLevel")} ${lv}/5</p>`:""}
    ${mist.length?`<div class="gsec" style="text-align:left"><h4>${t("mtMistakes")}</h4><div class="greg">${mist.map(k=>`<button type="button" class="chip" data-gsee="${esc(k)}">${esc(k)}</button>`).join("")}</div></div>`:""}
    <div class="row"><button type="button" class="btn primary" id="mt-again">${t(g.fail?"mtRetry":"mtAgain")}</button><button type="button" class="btn" id="mt-back">${t("mtBack")}</button></div></div></section>`;
}
function mtFb(txt,ok){ const e=$("#mt-fb"); if(!e) return; e.className="mtfb show "+(ok?"good":"bad"); e.textContent=txt; clearTimeout(mtFb.t); mtFb.t=setTimeout(()=>{ e.className="mtfb"; },900); }
function mtPick(side,i){ const g=ML; if(!g||g.fin||g.lock) return; const r=g.rounds[g.ri]; if(r.done.has(i)) return;
  g.sel[side]=g.sel[side]===i?null:i;
  document.querySelectorAll(`.mtt[data-mts="${side}"]`).forEach(b=>b.classList.toggle("sel",+b.dataset.mti===g.sel[side]));
  if(g.sel.l==null||g.sel.r==null) return;
  const a=g.sel.l, b=g.sel.r, el=$(`.mtt[data-mts="l"][data-mti="${a}"]`), er=$(`.mtt[data-mts="r"][data-mti="${b}"]`);
  g.sel={l:null,r:null};
  if(a===b){ r.done.add(a); g.right++; g.xp++; const d=gdOf(r.pairs[a].k); d.ok++; d.w=Math.max(0,(d.w||0)-1);
    [el,er].forEach(x=>{ x.classList.remove("sel"); x.classList.add("ok","pop"); x.disabled=true; }); mtBeep(true);
    const tot=g.rounds.reduce((s,x)=>s+x.pairs.length,0), got=g.rounds.slice(0,g.ri).reduce((s,x)=>s+x.pairs.length,0)+r.done.size; const pb=$(".mtprog i"); if(pb) pb.style.width=Math.round(got/tot*100)+"%";
    if(r.done.size===r.pairs.length){ g.lock=true; mtFb(t(["mtOk1","mtOk2","mtOk3"][Math.floor(Math.random()*3)]),true); setTimeout(()=>{ if(ML!==g) return; g.lock=false; if(g.ri+1<g.rounds.length){ g.ri++; render(); } else mtFinish(false); },650); }
  } else { g.wrong++; g.hearts--; const ka=r.pairs[a].k, kb=r.pairs[b].k; const da=gdOf(ka); da.ko++; da.w=(da.w||0)+2; const db=gdOf(kb); db.w=(db.w||0)+1; g.mist[ka]=1;
    [el,er].forEach(x=>{ x.classList.remove("sel"); x.classList.add("bad"); setTimeout(()=>x.classList.remove("bad"),520); }); mtBeep(false);
    const hs=document.querySelectorAll(".mthearts .mth"); hs.forEach((h,i)=>h.classList.toggle("on",i<g.hearts)); if(hs[g.hearts]) hs[g.hearts].classList.add("lost");
    mtFb(`${r.pairs[a].l} → ${r.pairs[a].r}`,false);
    if(g.hearts<=0){ g.lock=true; setTimeout(()=>{ if(ML===g) mtFinish(true); },900); } }
}
function mtFinish(fail){ const g=ML; g.fin=true; g.fail=fail; g.t1=Date.now(); if(!fail&&typeof cheers==="function") setTimeout(()=>cheers(40),150); { const k=dayKey(Date.now()); MT.dl=(MT.dl&&MT.dl.d===k)?{d:k,n:MT.dl.n+1}:{d:k,n:1}; }
  if(!fail){ g.xp+=10+(g.wrong===0?5:0); if(g.u!=="all"&&g.u!=="rev"){ const u=MT.u[g.u]||(MT.u[g.u]={n:0}); u.n++; } MT.days=[...new Set([...(MT.days||[]),dayKey(Date.now())])].sort().slice(-400); }
  MT.xp=(MT.xp||0)+g.xp; saveMT(); render(); window.scrollTo(0,0); }
function renderMatch(){
  const st=mtStreak(), rev=GRAPES.filter(g=>(MT.g[g.k]||{}).w>0).length;
  const types=MTYPES.map(([k,l])=>`<button type="button" class="chip" data-mttype="${k}" aria-pressed="${mtType===k}">${t(l)}</button>`).join("");
  const crowns=n=>`<span class="mtcr" aria-label="${t("mtLevel")} ${n}/5">${[1,2,3,4,5].map(i=>`<i class="${i<=n?"on":""}"></i>`).join("")}</span>`;
  const gk=["n02","n09","n37","n29","n24","n33","n16"];
  const path=GUNITS.map((u,j)=>{ const n=(MT.u[u[0]]||{}).n||0, lv=uLevel(u[0]), gs=GRAPES.filter(g=>g.u===u[0]), m=gs.reduce((s,g)=>s+gMast(g.k),0)/(gs.length*3);
    return `<div class="mtnode ${j%2?"alt":""}"><button type="button" class="mtbub ${lv>=5?"gold":""}" data-mtgo="${u[0]}" aria-label="${esc(u[1][L()])}">${gfree(gk[j%gk.length],78)}<span class="mtring" style="--p:${Math.round((lv>=5?1:(n%2)/2)*100)}"></span></button>
      <div class="mtinfo"><b>${esc(u[1][L()])}</b><span class="muted">${gs.map(g=>esc(g.k)).join(" · ")}</span>${crowns(lv)}<span class="meter" style="display:block;max-width:220px"><i style="width:${Math.round(m*100)}%;background:var(--good)"></i></span></div></div>`; }).join("");
  return `<section class="view"><div class="card"><div class="ghead"><div><h2>${t("tr_match")}</h2><p class="muted" style="max-width:68ch;font-size:.9rem">${t("mtIntro")}</p></div>${gfree("n26",160)}</div>
    <div class="mtbar"><div><b>${MT.xp||0}</b><span>XP</span></div><div><b>${st}</b><span>${t("mtStreak")}</span></div><div><b>${GRAPES.filter(g=>gMast(g.k)>=3).length}/${GRAPES.length}</b><span>${t("mtMastered")}</span></div></div>
    <p class="mtlab">${t("mtType")}</p><div class="row" style="justify-content:flex-start">${types}</div>
    <div class="row" style="justify-content:flex-start;margin-top:12px"><button type="button" class="btn primary" data-mtgo="all">${t("mtAllGo")}</button>${rev>=3?`<button type="button" class="btn" data-mtgo="rev">${t("mtReview")} (${rev})</button>`:""}<label class="mtsnd"><input type="checkbox" id="mt-snd" ${mtSnd?"checked":""}> ${t("mtSound")}</label></div></div>
    <div class="mtpath">${path}</div></section>`;
}
document.getElementById("main").addEventListener("click",e=>{
  const x=e.target;
  const gm=x.closest("[data-gmap]"); if(gm){ e.preventDefault(); gOpenMap(gm.dataset.gmap); return; }
  const go=x.closest("[data-mtgo]"); if(go){ mtStart(go.dataset.mtgo,go.dataset.mtgo==="rev"?"mix":mtType); return; }
  if(view==="grapes"){
    const c=x.closest("[data-gvcol]"); if(c){ gvCol=c.dataset.gvcol; lsSet("wset3-gvcol",gvCol); render(); return; }
    const u=x.closest("[data-gvunit]"); if(u){ gvUnit=u.dataset.gvunit; lsSet("wset3-gvunit",gvUnit); render(); return; }
  }
  if(view==="match"){
    const ty=x.closest("[data-mttype]"); if(ty){ mtType=ty.dataset.mttype; lsSet("wset3-mttype",mtType); document.querySelectorAll("[data-mttype]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.mttype===mtType)); return; }
    const tl=x.closest("[data-mts]"); if(tl&&ML){ mtPick(tl.dataset.mts,+tl.dataset.mti); return; }
    if(x.closest("#mt-quit")){ ML=null; render(); return; }
    if(x.closest("#mt-again")&&ML){ mtStart(ML.u,ML.type); return; }
    if(x.closest("#mt-back")){ ML=null; render(); return; }
    const see=x.closest("[data-gsee]"); if(see){ const k=see.dataset.gsee; ML=null; view=trainV="grapes"; lsSet("wset3-trainv",trainV); gvQ=k.toLowerCase(); gvUnit="all"; gvCol="all"; render(); gvFilter(); const d=[...document.querySelectorAll(".gcard")].find(d=>!d.hidden); if(d){ d.open=true; d.scrollIntoView({block:"start"}); } return; }
  }
});
document.getElementById("main").addEventListener("input",e=>{ if(view==="grapes"&&e.target.id==="gv-q"){ gvQ=e.target.value; gvFilter(); } });
document.getElementById("main").addEventListener("change",e=>{ if(view==="match"&&e.target.id==="mt-snd"){ mtSnd=e.target.checked; lsSet("wset3-mtsnd",mtSnd?"1":"0"); } });
document.addEventListener("keydown",e=>{ if(view!=="match"||!ML||ML.fin||e.ctrlKey||e.metaKey||e.altKey) return; const tg=e.target; if(tg&&(tg.tagName==="INPUT"||tg.tagName==="TEXTAREA")) return;
  if(e.key==="Escape"){ ML=null; render(); return; }
  const n="1234567890".indexOf(e.key); if(n<0) return; const r=ML.rounds[ML.ri]; const side=n<5?"l":"r", j=n%5, ord=side==="l"?r.lo:r.ro; if(j>=ord.length) return; e.preventDefault(); mtPick(side,ord[j]); });

/* ---------- schemi: per paese / per vitigno ---------- */
const SCC=[["fr",["Francia","France","France"],["fra","bdx","sw","bgn","cdo","chm","bea","als","loi","nrh","srh","sfr","cha"]],
 ["it",["Italia","Italie","Italy"],["ita","nei","pie","cit","sit"]],["es",["Spagna","Espagne","Spain"],["esp","rio","cat"]],
 ["pt",["Portogallo","Portugal","Portugal"],["por","dou"]],["de",["Germania","Allemagne","Germany"],["ger","gev"]],
 ["at",["Austria","Autriche","Austria"],["aut"]],["hu",["Ungheria","Hongrie","Hungary"],["hun"]],["gr",["Grecia","Grèce","Greece"],["gre"]],
 ["us",["Stati Uniti","États-Unis","United States"],["nam","cal","nap","pnw","nyk"]],["ca",["Canada","Canada","Canada"],["can"]],
 ["cl",["Cile","Chili","Chile"],["chi"]],["ar",["Argentina","Argentine","Argentina"],["arg"]],["za",["Sudafrica","Afrique du Sud","South Africa"],["rsaz","rsa"]],
 ["au",["Australia","Australie","Australia"],["ausz","ause","ausw"]],["nz",["Nuova Zelanda","Nouvelle-Zélande","New Zealand"],["nzl"]]];
const SCCAN=new Set(["British Columbia","Okanagan Valley","Ontario","Niagara Peninsula"]);
const GBLACK=new Set("Abouriou|Agiorgitiko|Aglianico|Alicante Bouschet|Aragonez|Baga|Barbera|Blauer Wildbacher|Blaufränkisch|Bobal|Bombino Nero|Bonarda|Cabernet Franc|Cabernet Sauvignon|Cannonau|Carignan|Carignano|Cariñena|Carmenère|Castelão|Cinsault|Corvina|Dolcetto|Dornfelder|Duras|Fer Servadou|Frappato|Gaglioppo|Gamay|Garnacha|Graciano|Grenache|Grolleau|Kotsifali|Lagrein|Lambrusco|Lemberger|Liatiko|Malbec|Mencía|Merlot|Meunier|Monastrell|Mondeuse|Montepulciano|Mourvèdre|Nebbiolo|Negra Mole|Negroamaro|Nerello Mascalese|Nero d'Avola|Nero di Troia|Nielluccio|Négrette|País|Petit Rouge|Piedirosso|Pinot Noir|Pinotage|Poulsard|Primitivo|Refosco|Rondinella|Sagrantino|Sangiovese|Schiava|Sciaccarello|Shiraz|Syrah|Tannat|Tempranillo|Teroldego|Tinta Barroca|Tinta Roriz|Tintilia|Touriga Franca|Touriga Nacional|Trepat|Trincadeira|Trollinger|Xinomavro|Zinfandel|Zweigelt".split("|"));
const gCanon=n=>{ const j=GSY[n]; if(j==null) return n; const grp=GSYN[j]; return grp.find(x=>GBY[x])||grp[0]; };
let SCH=null, scMode=lsGet("wset3-scmode")||"c", scQ="", scCol="all";
function schBuild(){ if(SCH) return SCH;
  const norm=s=>String(s).replace(/^The /,"").toLowerCase();
  const C=SCC.map(([id,nm,maps])=>{
    const depth=mid=>{ let d=0,p=mid; while(MPAR[p]&&maps.includes(MPAR[p])){ d++; p=MPAR[p]; } return d; };
    const own={}; // key -> {mid,i}
    maps.forEach(mid=>{ const m=MBY[mid]; if(!m) return; m.it.forEach((x,i)=>{ if(x[0]!=="w"||!GX.items[x[1]]) return;
      if(id==="us"&&SCCAN.has(x[1])) return;
      const cur=own[x[1]]; if(!cur||depth(mid)>depth(cur.mid)) own[x[1]]={mid,i}; }); });
    const regs=maps.filter(mid=>MBY[mid]).map(mid=>({mid,head:null,items:[]})); const RB={}; regs.forEach(r=>RB[r.mid]=r);
    Object.entries(own).forEach(([k,o])=>{ const hit=regs.find(r=>r.mid!==maps[0]&&norm(MBY[r.mid].t[2])===norm(mName(k)==k?k:k));
      const e={k,mid:o.mid,i:o.i,g:GX.items[k][0],ex:GX.items[k][2],cat:gCat(o.mid,o.i),tier:MBY[o.mid].it[o.i][4],umb:MBY[o.mid].it[o.i][6]};
      if(hit&&!hit.head){ hit.head=e; return; } RB[o.mid].items.push(e); });
    regs.forEach(r=>r.items.sort((a,b)=>(b.umb-a.umb)||(a.tier-b.tier)||a.k.localeCompare(b.k)));
    const cnt={}; Object.values(own).forEach(o=>GX.items[MBY[o.mid].it[o.i][1]][0].forEach((v,j)=>{ const c=gCanon(v); cnt[c]=(cnt[c]||0)+(j===0?3:1); }));
    const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1]).slice(0,10).map(x=>x[0]);
    return {id,nm,root:maps[0],regs:regs.filter(r=>r.items.length||r.head),top,n:Object.keys(own).length}; });
  const G={}; C.forEach(c=>c.regs.forEach(r=>[r.head,...r.items].filter(Boolean).forEach(e=>e.g.forEach((v,j)=>{ const k=gCanon(v);
    const x=G[k]||(G[k]={k,c:GBLACK.has(k)||GBLACK.has(v)?"b":"w",n:0,p:0,al:new Set(),by:{}}); x.n++; if(j===0) x.p++; if(v!==k) x.al.add(v);
    const cc=x.by[c.id]||(x.by[c.id]={}); (cc[r.mid]||(cc[r.mid]=[])).push({e,j,v}); }))));
  SCH={C,G:Object.values(G).sort((a,b)=>(b.p*3+b.n)-(a.p*3+a.n))}; return SCH; }
const scCat=e=>{ if(!e.cat) return ""; const o=gLaw(e.mid).opts.find(o=>o[0]===e.cat); return o?`<span class="tag sct">${esc(o[1][L()])}</span>`:""; };
const scGr=(g,main)=>g.map((v,j)=>{ const k=gCanon(v); return `<button type="button" class="scg ${GBLACK.has(k)||GBLACK.has(v)?"b":"w"}${j===0&&main?" p":""}" data-scg="${esc(k)}">${esc(v)}</button>`; }).join("");
function scRow(e){ const ex=GX.ex[e.ex]; return `<div class="scr${e.umb?" umb":""}"><div class="scrh"><button type="button" class="scn" data-scmap="${e.mid}:${e.i}" title="${esc(t("gvMap"))}">${esc(mName(e.k))}</button>${scCat(e)}</div><div class="scgs">${scGr(e.g,true)}</div>${ex?`<p class="scx">${esc(ex[L()])}</p>`:""}</div>`; }
function scCountryBody(c){ const law=GX.law[GX.maplaw[c.root]];
  return `${law?`<p class="sclaw">${esc(law.sum[L()])}</p>`:""}<div class="sctop"><span class="mtlab">${t("scTop")}</span><div class="scgs">${scGr(c.top,false)}</div></div>`+
   c.regs.map(r=>{ const m=MBY[r.mid], isRoot=r.mid===c.root;
     return `<details class="screg" ${isRoot?"open":""}><summary><b>${esc(isRoot?t("scMain"):mTitle(m))}</b><span class="muted">${r.items.length+(r.head?1:0)}</span></summary>${r.head?`<div class="schead">${scRow(r.head)}</div>`:""}${r.items.map(scRow).join("")}</details>`; }).join(""); }
function scGrapeBody(x){ const S=schBuild(); const sheet=GBY[x.k];
  return `${sheet?`<p class="scx"><b>${esc(gTri(sheet.sig))}</b> · ${esc(gTri(sheet.tr))} <button type="button" class="chip" data-gsee="${esc(x.k)}">${t("scSheet")}</button></p>`:""}${x.al.size?`<p class="scx">${t("gvSyn")}: ${esc([...x.al].join(", "))}</p>`:""}`+
   S.C.filter(c=>x.by[c.id]).map(c=>{ const regs=x.by[c.id];
     return `<div class="scgc"><h4>${esc(c.nm[L()])}</h4>${Object.entries(regs).map(([mid,arr])=>`<div class="scgr"><span class="scgrn">${esc(mid===c.root?t("scMain"):mTitle(MBY[mid]))}</span><span class="scgl">${arr.map(({e,j,v})=>`<button type="button" class="scn sm${j===0?" p":""}" data-scmap="${e.mid}:${e.i}">${esc(mName(e.k))}${v!==x.k?` <i>(${esc(v)})</i>`:""}</button>`).join("")}</span></div>`).join("")}</div>`; }).join(""); }
function renderSchemi(){ const S=schBuild();
  const seg=`<div class="seg" role="group">${[["c","scByC"],["g","scByG"]].map(([k,l])=>`<button type="button" data-scmode="${k}" aria-pressed="${scMode===k}">${t(l)}</button>`).join("")}</div>`;
  const col=scMode==="g"?`<div class="seg" role="group">${[["all","gvAll"],["w","gvW"],["b","gvB"]].map(([k,l])=>`<button type="button" data-sccol="${k}" aria-pressed="${scCol===k}">${t(l)}</button>`).join("")}</div>`:"";
  let body;
  if(scMode==="c") body=S.C.map(c=>`<details class="scc" data-sck="c:${c.id}" data-scs="${esc([c.nm.join(" "),...c.regs.flatMap(r=>[mTitle(MBY[r.mid]),...(r.head?[r.head]:[]).concat(r.items).flatMap(e=>[e.k,mName(e.k),...e.g])])].join(" ").toLowerCase())}"><summary><span class="scname">${esc(c.nm[L()])}</span><span class="muted scmeta">${c.n} ${t("scApp")} · ${c.top.slice(0,4).map(esc).join(", ")}</span></summary><div class="scbody"></div></details>`).join("");
  else body=S.G.filter(x=>scCol==="all"||x.c===scCol).map(x=>`<details class="scc g" data-sck="g:${esc(x.k)}" data-scs="${esc([x.k,...x.al,...Object.values(x.by).flatMap(o=>Object.values(o).flat().map(a=>mName(a.e.k)))].join(" ").toLowerCase())}"><summary><span class="gdot ${x.c==="w"?"gw":"gb"}"></span><span class="scname">${esc(x.k)}</span><span class="muted scmeta">${Object.keys(x.by).map(id=>esc(SCC.find(c=>c[0]===id)[1][L()])).join(", ")} · ${x.n} ${t("scApp")}</span></summary><div class="scbody"></div></details>`).join("");
  return `<section class="view"><div class="card"><div class="ghead"><div><h2>${t("tr_schemi")}</h2><p class="muted" style="max-width:68ch;font-size:.9rem">${t(scMode==="c"?"scIntroC":"scIntroG")}</p></div>${gfree("n16",150)}</div>
   <div class="gfilt">${seg}${col}<input type="search" id="sc-q" class="gq" placeholder="${esc(t("scSearch"))}" value="${esc(scQ)}" autocomplete="off"><button type="button" class="btn" id="sc-all">${t("scOpenAll")}</button></div></div>
   <div id="sc-list" class="sclist">${body}</div><p class="muted" id="sc-none" hidden>${t("gvNone")}</p></section>`; }
function scFill(d){ const b=d.querySelector(".scbody"); if(!b||b.dataset.f) return; const [k,id]=[d.dataset.sck.slice(0,1),d.dataset.sck.slice(2)]; const S=schBuild();
  b.innerHTML=k==="c"?scCountryBody(S.C.find(c=>c.id===id)):scGrapeBody(S.G.find(x=>x.k===id)); b.dataset.f=1; if(scQ) scMark(b); }
function scMark(b){ const q=scQ.trim().toLowerCase(); if(!q) return; b.querySelectorAll(".scn,.scg").forEach(x=>x.classList.toggle("hit",x.textContent.toLowerCase().includes(q)));
  b.querySelectorAll(".screg").forEach(r=>{ if(r.textContent.toLowerCase().includes(q)) r.open=true; }); }
function scFilter(){ const q=scQ.trim().toLowerCase(); let n=0; document.querySelectorAll(".scc").forEach(d=>{ const ok=!q||d.dataset.scs.includes(q); d.hidden=!ok; if(ok){ n++; if(q&&n<=3){ d.open=true; scFill(d); scMark(d.querySelector(".scbody")); } } }); const e=$("#sc-none"); if(e) e.hidden=!!n; }
document.getElementById("main").addEventListener("toggle",e=>{ const d=e.target; if(d.classList&&d.classList.contains("scc")&&d.open) scFill(d); },true);
document.getElementById("main").addEventListener("input",e=>{ if(view==="schemi"&&e.target.id==="sc-q"){ scQ=e.target.value; scFilter(); } });
document.getElementById("main").addEventListener("click",e=>{ if(view!=="schemi") return; const x=e.target;
  const sm=x.closest("[data-scmode]"); if(sm){ scMode=sm.dataset.scmode; lsSet("wset3-scmode",scMode); render(); return; }
  const sc=x.closest("[data-sccol]"); if(sc){ scCol=sc.dataset.sccol; render(); return; }
  const mp=x.closest("[data-scmap]"); if(mp){ const [mid,i]=mp.dataset.scmap.split(":"); view=trainV="maps"; lsSet("wset3-trainv",trainV); mg=mgNew(mid,"explore"); mg.hl=+i; render(); setTimeout(()=>{ try{ mFocus([+i],false,true); mDraw(); }catch(err){} },80); return; }
  const gg=x.closest("[data-scg]"); if(gg){ scMode="g"; scCol="all"; lsSet("wset3-scmode","g"); scQ=gg.dataset.scg.toLowerCase(); render(); const d=document.querySelector(`.scc[data-sck="g:${CSS.escape(gg.dataset.scg)}"]`); if(d){ document.querySelectorAll(".scc").forEach(z=>z.hidden=z!==d); d.open=true; scFill(d); d.scrollIntoView({block:"start"}); } return; }
  if(x.closest("#sc-all")){ const ds=[...document.querySelectorAll(".scc")].filter(d=>!d.hidden); const open=!ds.every(d=>d.open); ds.forEach(d=>{ d.open=open; if(open){ scFill(d); d.querySelectorAll(".screg").forEach(r=>r.open=true); } }); return; }
  const see=x.closest("[data-gsee]"); if(see){ const k=see.dataset.gsee; view=trainV="grapes"; lsSet("wset3-trainv",trainV); gvQ=k.toLowerCase(); gvUnit="all"; gvCol="all"; render(); gvFilter(); const d=[...document.querySelectorAll(".gcard")].find(d=>!d.hidden); if(d){ d.open=true; d.scrollIntoView({block:"start"}); } }
});
