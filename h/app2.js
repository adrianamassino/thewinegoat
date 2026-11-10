/* ---------- v33: app shell (Oggi · Studia · Gioca · Esame · Io), coach, notifications, games ---------- */
const TABG={home:"home",study:"study",practice:"study",open:"study",sat:"study",exam:"study",wine:"wine",grapes:"wine",schemi:"wine",maps:"wine",
  play:"play",match:"play",g_tf:"play",g_guess:"play",g_surv:"play",g_order:"play",me:"me",errors:"me",history:"me",settings:"me"};
const SUBV={practice:"study",open:"study",sat:"study",exam:"study",grapes:"wine",schemi:"wine",maps:"wine",match:"play",g_tf:"play",g_guess:"play",g_surv:"play",g_order:"play",errors:"me",history:"me",settings:"me"};
const SUBT={practice:"tr_practice",open:"tr_open",sat:"tr_sat",exam:"exMock",grapes:"tr_grapes",schemi:"tr_schemi",maps:"tr_maps",match:"tr_match",g_tf:"gTf",g_guess:"gGuess",g_surv:"gSurv",g_order:"gOrder",errors:"revTab",history:"history",settings:"meSet"};
const TABS=["home","study","wine","play","me"];
Object.assign(T.it,{tab_study:"WSET 3",tab_wine:"Vino",tab_play:"Giochi",exMock:"Esame simulato",
  wsKick:"Preparazione d'esame",wsTitle:"Esame WSET 3",wsIntro:"Solo esercizi nel formato dell'esame: scelta multipla, risposte scritte, degustazione SAT.",
  wsMock:"Esame simulato",wsMockD:"Crocette, risposte scritte e SAT a tempo, come il giorno dell'esame",wsSec1:"Allenamento per l'esame",
  wnKick:"Cultura del vino",wnTitle:"Il mondo del vino",wnIntro:"Vitigni, regioni e mappe da esplorare con calma, senza voti né cronometro.",wnSec:"Esplora",
  plKick:"Pausa ricreativa",plTitle:"Giochi",plIntro:"Giochi brevi e veloci per fissare i concetti divertendoti."});
Object.assign(T.fr,{tab_study:"WSET 3",tab_wine:"Vin",tab_play:"Jeux",exMock:"Examen blanc",
  wsKick:"Préparation à l'examen",wsTitle:"Examen WSET 3",wsIntro:"Uniquement des exercices au format de l'examen : QCM, réponses rédigées, dégustation SAT.",
  wsMock:"Examen blanc",wsMockD:"QCM, réponses rédigées et SAT chronométrés, comme le jour J",wsSec1:"Entraînement à l'examen",
  wnKick:"Culture du vin",wnTitle:"L'univers du vin",wnIntro:"Cépages, régions et cartes à explorer tranquillement, sans note ni chrono.",wnSec:"Explorer",
  plKick:"Pause récré",plTitle:"Jeux",plIntro:"Des jeux courts et rapides pour retenir l'essentiel en s'amusant."});
Object.assign(T.en,{tab_study:"WSET 3",tab_wine:"Wine",tab_play:"Games",exMock:"Mock exam",
  wsKick:"Exam preparation",wsTitle:"WSET 3 exam",wsIntro:"Only exam-format practice: multiple choice, written answers, SAT tasting.",
  wsMock:"Mock exam",wsMockD:"Timed multiple choice, written answers and SAT, just like exam day",wsSec1:"Exam training",
  wnKick:"Wine knowledge",wnTitle:"The world of wine",wnIntro:"Grapes, regions and maps to explore at your own pace, no scores, no timer.",wnSec:"Explore",
  plKick:"Play break",plTitle:"Games",plIntro:"Short, quick games to make it stick while having fun."});
const go=v=>{ quiz=null; oq=null; satShow=null; satEdit=false; mg=null; ML=null; GM=null; view=v; if(TRAIN.includes(v)){ trainV=v; lsSet("wset3-trainv",v); } render(); window.scrollTo(0,0); };
const ICO={
 quiz:'<svg viewBox="0 0 48 48"><rect x="6" y="6" width="36" height="36" rx="10" fill="#1f6f6b"/><path d="M16 25l6 6 11-13" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 open:'<svg viewBox="0 0 48 48"><rect x="6" y="8" width="36" height="32" rx="9" fill="#8e5ba8"/><path d="M14 19h20M14 26h14M14 33h9" stroke="#fff" stroke-width="4" stroke-linecap="round"/></svg>',
 sat:'<svg viewBox="0 0 48 48"><path d="M14 6h20c0 13-4 20-10 20S14 19 14 6z" fill="#b5334a"/><path d="M14 6h20" stroke="#8c1d40" stroke-width="3"/><path d="M24 26v12M16 41h16" stroke="#b9a9a0" stroke-width="4" stroke-linecap="round"/></svg>',
 grapes:'<svg viewBox="0 0 48 48"><g fill="#6b2d5c"><circle cx="17" cy="19" r="6"/><circle cx="29" cy="19" r="6"/><circle cx="23" cy="29" r="6"/><circle cx="11" cy="28" r="5.5"/><circle cx="35" cy="28" r="5.5"/><circle cx="17" cy="38" r="5.5"/><circle cx="29" cy="38" r="5.5"/></g><path d="M23 13c0-5 4-8 8-9" stroke="#44691f" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
 schemi:'<svg viewBox="0 0 48 48"><rect x="17" y="5" width="14" height="10" rx="3" fill="#d9774b"/><rect x="5" y="31" width="14" height="10" rx="3" fill="#d4a23a"/><rect x="29" y="31" width="14" height="10" rx="3" fill="#d4a23a"/><path d="M24 15v8M12 31v-8h24v8" stroke="#8a5a1c" stroke-width="3" fill="none"/></svg>',
 maps:'<svg viewBox="0 0 48 48"><path d="M5 11l12-5 14 5 12-5v31l-12 5-14-5-12 5z" fill="#1f6f6b"/><path d="M17 6v31M31 11v31" stroke="#15524f" stroke-width="2.5"/><circle cx="25" cy="21" r="5" fill="#b5334a"/></svg>',
 tf:'<svg viewBox="0 0 48 48"><circle cx="16" cy="24" r="12" fill="#5e8c31"/><circle cx="32" cy="24" r="12" fill="#b5334a"/><path d="M10 24l4 4 7-8" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M28 20l8 8M36 20l-8 8" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/></svg>',
 guess:'<svg viewBox="0 0 48 48"><circle cx="21" cy="21" r="13" fill="#d4a23a"/><circle cx="21" cy="21" r="8" fill="#fff"/><path d="M30 30l11 11" stroke="#8a5a1c" stroke-width="6" stroke-linecap="round"/><path d="M18.5 18a3 3 0 1 1 3.8 3c-1 .3-1.3 1-1.3 2" stroke="#3a2a2f" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>',
 surv:'<svg viewBox="0 0 48 48"><path d="M24 43S5 32 5 18a9.5 9.5 0 0 1 19-4 9.5 9.5 0 0 1 19 4c0 14-19 25-19 25z" fill="#b5334a"/><path d="M26 12l-6 12h7l-4 12 10-15h-7l4-9z" fill="#d4a23a"/></svg>',
 order:'<svg viewBox="0 0 48 48"><rect x="6" y="6" width="22" height="9" rx="4" fill="#5e8c31"/><rect x="6" y="19.5" width="29" height="9" rx="4" fill="#1f6f6b"/><rect x="6" y="33" width="36" height="9" rx="4" fill="#8e5ba8"/></svg>',
 bell:'<svg viewBox="0 0 24 24"><path d="M12 2.5a6 6 0 0 0-6 6v4.2l-1.8 3.1c-.4.7.1 1.5.9 1.5h13.8c.8 0 1.3-.8.9-1.5L18 12.7V8.5a6 6 0 0 0-6-6z" fill="#d4a23a" stroke="#a87b1e" stroke-width="1.2"/><path d="M9.5 19.5a2.5 2.5 0 0 0 5 0" fill="#a87b1e"/></svg>',
 chev:'<svg viewBox="0 0 24 24" width="22" height="22"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 back:'<svg viewBox="0 0 24 24" width="24" height="24"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};
function trainNav(){ const p=SUBV[view]; if(!p) return ""; return `<div class="backbar"><button type="button" class="backbtn" data-go="${p}" aria-label="${esc(t("tab_"+p))}">${ICO.back}</button><h1>${esc(t(SUBT[view]))}</h1></div>`; }
document.addEventListener("click",e=>{ const b=e.target.closest("[data-go]"); if(!b) return; e.preventDefault(); go(b.dataset.go); });

/* ---------- coach: readiness + recommendations ---------- */
function coach(){
  const tot=BANK.length; let seen=0, mast=0, att=0, cor=0;
  const ch={}; Object.keys(CH).forEach(c=>ch[c]={n:0,m:0,a:0,c:0,seen:0});
  BANK.forEach(b=>{ const x=ch[b.c]; if(!x) return; x.n++; const q=P.q[b.id]; if(q){ seen++; x.seen++; x.a+=q[0]; x.c+=q[1]; att+=q[0]; cor+=q[1]; if(q[1]>0&&!(P.e[b.id]&&!P.e[b.id].r)){ mast++; x.m++; } } });
  const er=activeErrs().length, mocks=(P.s||[]).filter(s=>s.m==="mock"), lastMock=mocks.length?mocks[mocks.length-1]:null;
  const ready=Math.round(mast/tot*100), acc=att?Math.round(cor/att*100):null;
  const order=GROUPS.flatMap(g=>g.c);
  const weak=order.filter(c=>ch[c].seen>=5).map(c=>[c,ch[c].c/ch[c].a]).filter(x=>x[1]<.65).sort((a,b)=>a[1]-b[1]);
  const fresh=order.filter(c=>ch[c].seen===0);
  const half=order.filter(c=>ch[c].seen>0&&ch[c].m/ch[c].n<.5).sort((a,b)=>ch[a].m/ch[a].n-ch[b].m/ch[b].n);
  const evs=BANK.filter(b=>b.s===1&&!P.q[b.id]).length;
  const gm=GRAPES.filter(g=>gMast(g.k)>=1).length, maps=Object.keys(MAPP||{}).filter(k=>!k.startsWith("_")&&MBY[k]).length;
  const today=duoToday(), streak=duoStreak();
  const R=[];
  if(er) R.push({k:"err",ic:"surv",t:t("rcErr").replace("{N}",er),d:t("rcErrD"),act:"err"});
  if(weak.length) R.push({k:"weak",ic:"quiz",t:t("rcWeak").replace("{C}",chName(weak[0][0])),d:t("rcWeakD").replace("{P}",Math.round(weak[0][1]*100)),act:"ch:"+weak[0][0]});
  if(fresh.length) R.push({k:"new",ic:"quiz",t:t("rcNew").replace("{C}",chName(fresh[0])),d:t("rcNewD"),act:"ch:"+fresh[0]});
  else if(half.length) R.push({k:"half",ic:"quiz",t:t("rcHalf").replace("{C}",chName(half[0])),d:t("rcHalfD").replace("{P}",Math.round(ch[half[0]].m/ch[half[0]].n*100)),act:"ch:"+half[0]});
  if(gm<GRAPES.length/2) R.push({k:"grapes",ic:"grapes",t:t("rcGrapes"),d:t("rcGrapesD").replace("{N}",GRAPES.length-gm),act:"go:match"});
  if(maps<5) R.push({k:"maps",ic:"maps",t:t("rcMaps"),d:t("rcMapsD"),act:"go:maps"});
  if(ready>=40&&(!lastMock||Date.now()-lastMock.t>7*DAY)) R.push({k:"mock",ic:"guess",t:t("rcMock"),d:lastMock?t("rcMockD2").replace("{P}",lastMock.c):t("rcMockD"),act:"go:exam"});
  if(!R.length) R.push({k:"mix",ic:"quiz",t:t("rcMix"),d:t("rcMixD"),act:"mix"});
  const left=tot-mast, sess=Math.ceil(left/10);
  return {tot,seen,mast,ready,acc,er,ch,R,left,sess,lastMock,streak,today,evs,gm,maps};
}
function runAct(a){
  if(a==="err") return startQuiz(shuffle(activeErrs()).slice(0,20),"errors",[]);
  if(a==="evs"){ const ids=shuffle(BANK.filter(b=>b.s===1&&!P.q[b.id]).map(b=>b.id)).slice(0,10); return startQuiz(ids,"practice",[]); }
  if(a==="mix"){ const pool=BANK.map(b=>b.id); const due=pool.filter(id=>!P.q[id]); return startQuiz(shuffle(due.length>=10?due:pool).slice(0,10),"practice",[]); }
  if(a.startsWith("ch:")) return startCh(a.slice(3));
  if(a.startsWith("go:")) return go(a.slice(3));
}
function startCh(ch){ const pool=BANK.filter(x=>x.c===ch).map(x=>x.id);
  const fresh=shuffle(pool.filter(id=>!P.q[id]||(P.e[id]&&!P.e[id].r))), rest=shuffle(pool.filter(id=>!fresh.includes(id))); startQuiz(fresh.concat(rest).slice(0,10),"practice",[ch]); }
document.addEventListener("click",e=>{ const b=e.target.closest("[data-act]"); if(b){ e.preventDefault(); runAct(b.dataset.act); return; }
  const c=e.target.closest("[data-qch]"); if(c){ e.preventDefault(); startCh(c.dataset.qch); } });

const ring=(p,sz,col,inner)=>{ const r=(sz-12)/2, C=2*Math.PI*r; return `<svg class="ring" viewBox="0 0 ${sz} ${sz}" width="${sz}" height="${sz}" aria-hidden="true"><circle cx="${sz/2}" cy="${sz/2}" r="${r}" fill="none" stroke="var(--line)" stroke-width="12"/><circle cx="${sz/2}" cy="${sz/2}" r="${r}" fill="none" stroke="${col}" stroke-width="12" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-Math.min(1,p))}" transform="rotate(-90 ${sz/2} ${sz/2})"/></svg>${inner||""}`; };
function hello(){ const h=new Date().getHours(); return t(h<12?"hiM":h<18?"hiA":"hiE"); }
function renderHome(){ const C=coach(), top=C.R[0], rest=C.R.slice(1,4), pc=Math.min(1,C.today/DGOAL);
  return `<section class="view home2">
   <div class="hhead"><div><p class="hsmall">${esc(hello())}</p><h1>${t("hTitle")}</h1></div>${gfree("n09",130)}</div>
   <button type="button" class="hero2" data-act="${top.act}"><span class="hero2-ic">${ICO[top.ic]}</span><span class="hero2-tx"><small>${t("hNext")}</small><b>${esc(top.t)}</b><span>${esc(top.d)}</span></span><span class="hero2-go">${t("hStart")}</span></button>
   <div class="duo2"><div class="tile2 goal">${glass(pc,"white",`${Math.min(C.today,DGOAL)}/${DGOAL}`,96)}<span>${t("duoGoal")}</span></div>
     <div class="tile2 ready" data-go="me">${glass(C.ready/100,"red",`${C.ready}%`,96)}<span>${t("hReady")}</span></div></div>
   <p class="hleft">${C.left?t("hLeft").replace("{N}",C.left).replace("{S}",C.sess):t("hDone")}</p>
   ${rest.length?`<h2 class="hsec">${t("hForYou")}</h2><div class="reclist">${rest.map(r=>`<button type="button" class="rec" data-act="${r.act}"><span class="rec-ic">${ICO[r.ic]}</span><span class="rec-tx"><b>${esc(r.t)}</b><span>${esc(r.d)}</span></span>${ICO.chev}</button>`).join("")}</div>`:""}
  </section>`; }

/* ---------- hubs ---------- */
const hubRow=(go_,ic,ti,sub,meta)=>`<button type="button" class="hubrow" data-go="${go_}"><span class="hub-ic">${ICO[ic]}</span><span class="hub-tx"><b>${esc(ti)}</b><span>${esc(sub)}</span></span>${meta?`<span class="hub-meta">${meta}</span>`:ICO.chev}</button>`;
const hubHead=(cls,kick,ti,intro,gk)=>`<header class="hubban ${cls}"><div class="hb-tx"><small>${esc(t(kick))}</small><h1>${esc(t(ti))}</h1><p>${esc(t(intro))}</p></div><div class="hb-goat">${gfree(gk,132)}</div></header>`;
function renderStudy(){ const C=coach();
  return `<section class="view hub area-wset">${hubHead("ban-wset","wsKick","wsTitle","wsIntro","n37")}
   <button type="button" class="mockcard" data-go="exam"><span class="mk-seal">WSET<br><b>3</b></span><span class="mk-tx"><b>${esc(t("wsMock"))}</b><span>${esc(t("wsMockD"))}</span></span>${C.lastMock?`<span class="mk-last">${C.lastMock.c}%</span>`:ICO.chev}</button>
   <button type="button" class="podcard" data-go="pods"><span class="pc-ic">${ICO.pod||""}</span><span class="pc-tx"><b>${esc(t("tr_pods"))}</b><span>${esc(t("trd_pods"))}</span></span>${ICO.chev}</button>
   <h2 class="hsec">${esc(t("wsSec1"))}</h2>
   <div class="hublist">${hubRow("practice","quiz",t("tr_practice"),t("stQuiz"),`${C.ready}%`)}${hubRow("open","open",t("tr_open"),t("trd_open"))}${hubRow("sat","sat",t("tr_sat"),t("trd_sat"))}</div></section>`; }
function renderWine(){
  const big=(g,ic,ti,sub,cls)=>`<button type="button" class="winecard ${cls}" data-go="${g}"><span class="wc-ic">${ICO[ic]}</span><b>${esc(ti)}</b><span>${esc(sub)}</span></button>`;
  return `<section class="view hub area-wine">${hubHead("ban-wine","wnKick","wnTitle","wnIntro","n11")}
   <div class="winegrid">${big("films","film",t("tr_films"),t("trd_films"),"wc-film")}${big("grapes","grapes",t("tr_grapes"),t("trd_grapes"),"wc-grape")}${big("maps","maps",t("tr_maps"),t("trd_maps"),"wc-map")}${big("schemi","schemi",t("tr_schemi"),t("stSchemi"),"wc-sch")}</div></section>`; }
function gBest(k){ return ((MT.best||{})[k])||0; }
function renderPlay(){
  const card=(g,ic,ti,sub,col,nw)=>`<button type="button" class="game" data-go="${g}" style="--gc:${col}">${nw&&!gBest(g)?`<span class="game-new">${t("newG")}</span>`:""}<span class="game-ic">${ICO[ic]}</span><span class="game-tx"><b>${esc(ti)}</b><span>${esc(sub)}</span></span>${g!=="maps"&&g!=="match"&&gBest(g)?`<span class="game-best">🏆 ${gBest(g)}</span>`:""}</button>`;
  return `<section class="view hub area-play">${hubHead("ban-play","plKick","plTitle","plIntro","n33")}
   <div class="gamegrid">${card("g_harv","harv",t("gHarv"),t("gHarvD"),"var(--plum)",1)}${card("g_bub","bub",t("gBub"),t("gBubD"),"var(--gold-d)",1)}${card("g_wm","wm",t("gWm"),t("gWmD"),"var(--wine)",1)}${card("g_tf","tf",t("gTf"),t("gTfD"),"var(--green)")}${card("g_guess","guess",t("gGuess"),t("gGuessD"),"var(--gold)")}${card("g_surv","surv",t("gSurv"),t("gSurvD"),"var(--red)")}
   ${card("g_order","order",t("gOrder"),t("gOrderD"),"var(--blue)")}${card("match","grapes",t("tr_match"),t("trd_match"),"var(--purple)")}</div></section>`; }

/* ---------- me: profile + settings ---------- */
function level(xp){ return Math.floor(Math.sqrt(xp/40))+1; }
function renderMe(){ const C=coach(), xp=duoXP(), lv=level(xp), nx=Math.pow(lv,2)*40, pv=Math.pow(lv-1,2)*40;
  const grp=GROUPS.map(g=>{ let n=0,m=0; g.c.forEach(c=>{n+=C.ch[c].n;m+=C.ch[c].m;}); const p=n?m/n:0;
    return `<details class="megrp"><summary><span class="mg-n">${esc(g.n[lang])}</span><span class="mg-p">${Math.round(p*100)}%</span><span class="mg-bar"><i style="width:${Math.round(p*100)}%"></i></span></summary><div class="mg-list">${g.c.map(c=>{ const x=C.ch[c], q=x.n?x.m/x.n:0; return `<button type="button" class="mg-row" data-qch="${c}"><span>${esc(chName(c))}</span><span class="mg-bar sm"><i style="width:${Math.round(q*100)}%"></i></span><b>${Math.round(q*100)}%</b></button>`; }).join("")}</div></details>`; }).join("");
  return `<section class="view me">
   <div class="mehead">${goat("n10","md")}<div><h1>${t("meTitle")}</h1><p>${t("meLevel")} ${lv} · ${xp} XP</p><div class="mebar"><i style="width:${Math.round((xp-pv)/(nx-pv)*100)}%"></i></div></div></div>
   <div class="mestats"><div><b>🔥 ${C.streak}</b><span>${t("duoStreak")}</span></div><div><b>✅ ${C.mast}</b><span>${t("meMast")}</span></div><div><b>🎯 ${C.acc==null?"–":C.acc+"%"}</b><span>${t("acc")}</span></div><div><b>🍇 ${C.gm}</b><span>${t("duoGrapes")}</span></div></div>
   <h2 class="hsec">${t("meRoad")}</h2>
   <div class="road">${glass(C.ready/100,"red",`${C.ready}%`,124)}<div><p><b>${t("meRoadA").replace("{M}",C.mast).replace("{T}",C.tot)}</b></p><p class="muted">${C.left?t("hLeft").replace("{N}",C.left).replace("{S}",C.sess):t("hDone")}</p>${C.lastMock?`<p class="muted">${t("meMock").replace("{P}",C.lastMock.c)}</p>`:""}</div></div>
   <div class="megrps">${grp}</div>
   <div class="hublist">${hubRow("errors","surv",t("revTab"),t("meErrD"),C.er?`<span class="pillc red">${C.er}</span>`:"")}${hubRow("history","order",t("history"),t("meHistD"))}${hubRow("settings","schemi",t("meSet"),t("meSetD"))}</div>
  </section>`; }
function renderSettings(){ const th=lsGet("wset3-theme")||"auto"; const np=typeof Notification!=="undefined"?Notification.permission:"na";
  const seg=(k,opts,cur)=>`<div class="seg big" role="group">${opts.map(([v,l])=>`<button type="button" data-set="${k}:${v}" aria-pressed="${String(cur)===String(v)}">${esc(l)}</button>`).join("")}</div>`;
  return `<section class="view setv">${gfree("n18",140)}
   <div class="setrow"><b>${t("setGoal")}</b>${seg("goal",[[1,"1"],[3,"3"],[5,"5"]],DGOAL)}<span class="muted">${t("setGoalD")}</span></div>
   <div class="setrow"><b>${t("setLang")}</b>${seg("lang",[["it","Italiano"],["fr","Français"],["en","English"]],lang)}</div>
   <div class="setrow"><b>${t("setTheme")}</b>${seg("theme",[["auto",t("setAuto")],["light",t("setLight")],["dark",t("setDark")]],th)}</div>
   <div class="setrow"><b>${t("setNotif")}</b><span class="muted">${t("setNotifD")}</span>${np==="na"?`<span class="muted">${t("setNotifNA")}</span>`:np==="granted"?`<span class="okc">✓ ${t("setNotifOn")}</span>`:`<button type="button" class="btn primary" id="notif-ask">${t("setNotifBtn")}</button>`}</div>
   <div class="setrow"><b>${t("account")}</b><span class="muted">${docRef?t("accountTxt"):t("accountLocal")}</span></div>
   <div class="setrow" id="reset-zone"><button type="button" class="btn ghost danger" id="reset2">${t("resetQ")}</button></div>
  </section>`; }
function applyTheme(){ const th=lsGet("wset3-theme")||"auto"; if(th==="auto") document.documentElement.removeAttribute("data-theme"); else document.documentElement.setAttribute("data-theme",th); }
applyTheme();
document.addEventListener("click",e=>{
  const s=e.target.closest("[data-set]"); if(s){ const [k,v]=s.dataset.set.split(":");
    if(k==="goal"){ DGOAL=+v; lsSet("wset3-goal",v); } if(k==="lang"){ lang=v; lsSet(LSL,lang); } if(k==="theme"){ lsSet("wset3-theme",v); applyTheme(); } render(); return; }
  if(e.target.closest("#notif-ask")){ try{ Notification.requestPermission().then(()=>render()); }catch(err){} return; }
  if(e.target.closest("#reset2")){ $("#reset-zone").innerHTML=`<span>${t("resetSure")}</span><button class="btn danger" id="reset-yes2">${t("yes")}</button><button class="btn ghost" id="reset-no2">${t("no")}</button>`; return; }
  if(e.target.closest("#reset-yes2")){ P=blank(); save(); go("home"); return; }
  if(e.target.closest("#reset-no2")){ render(); return; }
});

/* ---------- notifications ---------- */
const LSN="wset3-notif";
let NR=(()=>{try{return JSON.parse(lsGet(LSN)||"{}")||{}}catch(e){return {}}})();
function notifs(){ const C=coach(), d=dayKey(Date.now()), h=new Date().getHours(), out=[];
  out.push({id:"evs2",ic:"quiz",t:t("nEvs"),d:t("nEvsD"),act:"mix"});
  out.push({id:"v33",ic:"tf",t:t("nGames"),d:t("nGamesD"),act:"go:play"});
  out.push({id:"hun1",ic:"maps",t:t("nHun"),d:t("nHunD"),act:"go:maps"});
  if(C.streak>0&&!C.today&&h>=17) out.unshift({id:"streak-"+d,ic:"surv",t:t("nStreak").replace("{N}",C.streak),d:t("nStreakD"),act:C.R[0].act});
  if(C.er>=10) out.unshift({id:"err-"+d,ic:"surv",t:t("nErr").replace("{N}",C.er),d:t("rcErrD"),act:"err"});
  if(C.today>=DGOAL) out.unshift({id:"goal-"+d,ic:"guess",t:t("nGoal"),d:t("nGoalD"),act:"go:play"});
  const wk=(()=>{ const x=new Date(); x.setHours(0,0,0,0); x.setDate(x.getDate()-((x.getDay()+6)%7)); return dayKey(x.getTime()); })();
  const ws=(P.s||[]).filter(s=>s.t>=new Date(wk).getTime());
  if(ws.length) out.push({id:"week-"+wk,ic:"order",t:t("nWeek").replace("{N}",ws.length),d:t("nWeekD").replace("{X}",duoXP()),act:"go:me"});
  return out; }
const unread=()=>notifs().filter(n=>!NR[n.id]).length;
function paintBell(){ document.querySelectorAll(".bellb i").forEach(i=>{ const n=unread(); i.textContent=n?String(n):""; }); }
function openNotifs(){ const L=notifs(); closeNotifs(); const bg=document.createElement("div"); bg.className="sheet-bg"; bg.id="nsheet";
  bg.innerHTML=`<div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(t("nTitle"))}"><div class="sheet-h"><h2>${t("nTitle")}</h2><button type="button" class="btn ghost" id="nclose" aria-label="✕">✕</button></div>
   <div class="nlist">${L.map(n=>`<button type="button" class="nrow ${NR[n.id]?"":"new"}" data-nid="${n.id}" data-nact="${n.act}"><span class="rec-ic">${ICO[n.ic]}</span><span class="rec-tx"><b>${esc(n.t)}</b><span>${esc(n.d)}</span></span></button>`).join("")}</div></div>`;
  document.body.appendChild(bg); L.forEach(n=>NR[n.id]=1); lsSet(LSN,JSON.stringify(NR)); setTimeout(paintBell,0); }
function closeNotifs(){ const b=$("#nsheet"); if(b) b.remove(); }
document.addEventListener("click",e=>{ if(e.target.closest(".bellb")){ openNotifs(); return; }
  if(e.target.id==="nsheet"||e.target.closest("#nclose")){ closeNotifs(); return; }
  const r=e.target.closest("[data-nact]"); if(r){ closeNotifs(); runAct(r.dataset.nact); } });
function sysNotify(){ try{ if(typeof Notification==="undefined"||Notification.permission!=="granted") return; const C=coach(), d=dayKey(Date.now());
  if(C.streak>0&&!C.today&&new Date().getHours()>=17&&lsGet("wset3-sysn")!==d){ lsSet("wset3-sysn",d); new Notification("The Wine Goat",{body:t("nStreak").replace("{N}",C.streak)}); } }catch(e){} }
setTimeout(sysNotify,4000);

/* ---------- games: shared ---------- */
let GM=null;
const GNAME={g_tf:"gTf",g_guess:"gGuess",g_surv:"gSurv",g_order:"gOrder"};
function gAward(k,score,xp){ setTimeout(()=>cheers(score?36:12),150); MT.best=MT.best||{}; const nb=score>(MT.best[k]||0); if(nb) MT.best[k]=score; MT.xp=(MT.xp||0)+xp;
  const d=dayKey(Date.now()); MT.days=[...new Set([...(MT.days||[]),d])].sort().slice(-400); MT.dl=(MT.dl&&MT.dl.d===d)?{d,n:MT.dl.n+1}:{d,n:1}; saveMT(); return nb; }
function gIntro(k,ic,desc){ return `<section class="view gintro">${gfree((GEXT[k]&&GEXT[k].gk)||{g_tf:"n14",g_guess:"n13",g_surv:"n21",g_order:"n29"}[k],170)}<div class="gi-ic">${ICO[ic]}</div><h1>${t(GNAME[k])}</h1><p>${t(desc)}</p>${gBest(k)?`<p class="gi-best">🏆 ${t("gBest")}: ${gBest(k)}</p>`:""}<button type="button" class="btn primary big" data-gstart="${k}">${t("gPlay")}</button></section>`; }
function gTop(g,prog,right){ return `<div class="mthead"><button type="button" class="btn ghost mtq" data-gquit aria-label="${esc(t("mtQuit"))}">✕</button><div class="mtprog"><i style="width:${Math.round(prog*100)}%"></i></div>${right||""}</div>`; }
function gEnd(g,score,unit,xp,nb,extra){ return `<section class="view"><div class="card mtend">${gfree(score?"n14":"n03",160)}<h2>${t("gOver")}</h2>${nb?`<p class="mtperf">🏆 ${t("gNewBest")}</p>`:""}
  <div class="mtstats"><div><b>${score}</b><span>${esc(unit)}</span></div><div><b>+${xp}</b><span>XP</span></div><div><b>${gBest(g.k)}</b><span>${t("gBest")}</span></div></div>${extra||""}
  <div class="row"><button type="button" class="btn primary" data-gstart="${g.k}">${t("gAgain")}</button><button type="button" class="btn" data-go="play">${t("gBack")}</button></div></div></section>`; }
function renderGame(k){ if(!GM||GM.k!==k) return gIntro(k,GEXT[k]?GEXT[k].ic:{g_tf:"tf",g_guess:"guess",g_surv:"surv",g_order:"order"}[k],GNAME[k]+"D2");
  return GEXT[k]?GEXT[k].r():{g_tf:tfRender,g_guess:guRender,g_surv:svRender,g_order:orRender}[k](); }
document.addEventListener("click",e=>{ const s=e.target.closest("[data-gstart]"); if(s){ gStart(s.dataset.gstart); return; }
  if(e.target.closest("[data-gquit]")){ clearInterval(GM&&GM.iv); if(GM&&GM.raf) cancelAnimationFrame(GM.raf); GM=null; render(); } });
function gStart(k){ clearInterval(GM&&GM.iv); if(GM&&GM.raf) cancelAnimationFrame(GM.raf); GM=GEXT[k]?GEXT[k].n():{g_tf:tfNew,g_guess:guNew,g_surv:svNew,g_order:orNew}[k](); GM.k=k; view=k; render(); window.scrollTo(0,0); if(GM.timer) gTick(); if(GEXT[k]&&GEXT[k].go) GEXT[k].go(); }
function gTick(){ const g=GM; clearInterval(g.iv); g.iv=setInterval(()=>{ if(GM!==g){ clearInterval(g.iv); return; } g.left-=.1; const el=$("#gtime"); if(el) el.textContent=Math.ceil(Math.max(0,g.left));
  const pb=$(".mtprog i"); if(pb&&g.k==="g_tf") pb.style.width=Math.max(0,g.left/g.timer*100)+"%"; if(pb&&g.k==="g_surv") pb.style.width=Math.max(0,g.left/g.timer*100)+"%";
  if(g.left<=0){ clearInterval(g.iv); g.onTime(); } },100); }
const cName={fr:["Francia","France","France"]};
function countryOf(key){ const S=schBuild(); for(const c of S.C) for(const r of c.regs) if((r.head&&r.head.k===key)||r.items.some(e=>e.k===key)) return c; return null; }
function grapeCountries(gk){ const S=schBuild(); const x=S.G.find(z=>z.k===gk); return x?Object.keys(x.by):[]; }

/* game 1: true / false */
function tfItem(){ const S=schBuild(), r=Math.random();
  if(r<.5){ const C=S.C[Math.floor(Math.random()*S.C.length)]; const es=C.regs.flatMap(x=>[x.head,...x.items]).filter(e=>e&&e.g.length&&!e.umb); const e=es[Math.floor(Math.random()*es.length)]; if(!e) return tfItem();
    const truth=Math.random()<.5; let gr;
    if(truth) gr=e.g[0]; else { const cand=S.G.filter(x=>!x.by[C.id]&&x.n>=3); if(!cand.length) return tfItem(); gr=cand[Math.floor(Math.random()*cand.length)].k; }
    return {a:mName(e.k),b:gr,q:t("tfQ1"),truth,why:`${mName(e.k)} (${C.nm[L()]}): ${e.g.join(", ")}`}; }
  if(r<.75){ const g=GRAPES[Math.floor(Math.random()*GRAPES.length)], truth=Math.random()<.5; let o=g; if(!truth){ while(o===g) o=GRAPES[Math.floor(Math.random()*GRAPES.length)]; }
    return {a:g.k,b:gTri(o.tr),q:t("tfQ2"),truth,why:`${g.k}: ${gTri(g.tr)}`}; }
  const C=S.C[Math.floor(Math.random()*S.C.length)]; const es=C.regs.flatMap(x=>[x.head,...x.items]).filter(Boolean); const e=es[Math.floor(Math.random()*es.length)]; if(!e) return tfItem();
  const truth=Math.random()<.5; let cc=C; if(!truth){ while(cc===C) cc=S.C[Math.floor(Math.random()*S.C.length)]; }
  return {a:mName(e.k),b:cc.nm[L()],q:t("tfQ3"),truth,why:`${mName(e.k)} → ${C.nm[L()]}`}; }
function tfNew(){ return {timer:60,left:60,score:0,combo:0,best:0,item:tfItem(),miss:[],fb:null,onTime(){ tfEnd(); }}; }
function tfRender(){ const g=GM; if(g.fin) return g.fin; const it=g.item;
  return `<section class="view gplay">${gTop(g,g.left/g.timer,`<div class="gscore"><span id="gtime">${Math.ceil(g.left)}</span>s · <b>${g.score}</b></div>`)}
   <div class="mascot">${gfree("n05",84)}<div class="bubble">${esc(it.q)}${g.combo>=3?` · 🔥×${g.combo}`:""}</div></div>
   <div class="tfcard ${g.fb?(g.fb.ok?"ok":"bad"):""}"><b>${esc(it.a)}</b><span class="tfx">↔</span><b>${esc(it.b)}</b></div>
   <div class="tfbtns"><button type="button" class="btn big tfno" data-tf="0">✗ ${t("tfFalse")}</button><button type="button" class="btn big tfyes primary" data-tf="1">✓ ${t("tfTrue")}</button></div>
   <p class="muted mtkeys">${t("tfKeys")}</p></section>`; }
function tfAns(v){ const g=GM; if(!g||g.k!=="g_tf"||g.fin||g.lock) return; const ok=v===g.item.truth; g.lock=true;
  if(ok){ g.combo++; g.score+=g.combo>=5?2:1; mtBeep(true); } else { g.combo=0; g.left=Math.max(0,g.left-3); g.miss.push(g.item); mtBeep(false); }
  g.fb={ok}; render(); setTimeout(()=>{ if(GM!==g||g.fin) return; g.fb=null; g.lock=false; g.item=tfItem(); render(); },ok?260:700); }
function tfEnd(){ const g=GM; const xp=Math.round(g.score/2)+5, nb=gAward("g_tf",g.score,xp);
  g.fin=gEnd(g,g.score,t("gPts"),xp,nb,g.miss.length?`<div class="gsec2"><h4>${t("gReview")}</h4>${g.miss.slice(0,6).map(m=>`<p>${esc(m.why)}</p>`).join("")}</div>`:""); render(); }
document.addEventListener("click",e=>{ const b=e.target.closest("[data-tf]"); if(b) tfAns(b.dataset.tf==="1"); });

/* game 2: guess the grape */
function maskG(s,g){ let x=s; [g.k,...g.syn].forEach(n=>{ if(!n) return; x=x.split(n).join("▢▢▢"); }); return x; }
function guClues(g){ const st=[t(g.c==="w"?"gvWhite1":"gvBlack1"), g.rip?t("gvRip")+": "+gRip(g.rip):"", g.a?t("gvA")+": "+gWord(g.a,"a"):"", g.c==="b"&&g.t?t("gvT")+": "+gWord(g.t,"t"):"", g.b?t("gvBo")+": "+gWord(g.b,"b"):""].filter(Boolean).join(" · ");
  return [st, maskG(gTri(g.ar),g), maskG(gTri(g.cl),g), maskG(gTri(g.wm),g), t("gvReg")+": "+g.reg.slice(0,3).map(mName).join(", ")]; }
function guRound(used){ const pool=GRAPES.filter(g=>!used.includes(g.k)); const g=pool[Math.floor(Math.random()*pool.length)];
  const same=shuffle(GRAPES.filter(x=>x!==g&&x.c===g.c)).slice(0,3); return {g,clues:guClues(g),shown:1,opts:shuffle([g,...same]),pick:null}; }
function guNew(){ const r=guRound([]); return {n:8,i:0,score:0,used:[r.g.k],r,hist:[]}; }
function guRender(){ const G=GM; if(G.fin) return G.fin; const r=G.r, pts=6-r.shown;
  return `<section class="view gplay">${gTop(G,G.i/G.n,`<div class="gscore"><b>${G.score}</b> ${t("gPts")}</div>`)}
   <div class="mascot">${gfree("n13",84)}<div class="bubble">${t("guQ")} · ${t("guWorth").replace("{N}",r.pick?0:pts)}</div></div>
   <div class="clues">${r.clues.slice(0,r.shown).map((c,i)=>`<div class="clue"><span>${i+1}</span><p>${esc(c)}</p></div>`).join("")}</div>
   ${!r.pick&&r.shown<r.clues.length?`<button type="button" class="btn ghost" data-gu-more>${t("guMore")}</button>`:""}
   <div class="guopts">${r.opts.map(o=>`<button type="button" class="choice ${r.pick?(o===r.g?"ok":o.k===r.pick?"no":""):""}" data-gu="${esc(o.k)}" ${r.pick?"disabled":""}>${esc(o.k)}</button>`).join("")}</div>
   ${r.pick?`<div class="fbbar ${r.pick===r.g.k?"good":"bad"}"><b>${t(r.pick===r.g.k?"mtOk1":"guWas")} ${r.pick===r.g.k?"":esc(r.g.k)}</b><span>${esc(gTri(r.g.tip))}</span><button type="button" class="btn primary" data-gu-next>${t("gNext")}</button></div>`:""}
  </section>`; }
document.addEventListener("click",e=>{ const G=GM; if(!G||G.k!=="g_guess"||G.fin) return;
  if(e.target.closest("[data-gu-more]")){ G.r.shown=Math.min(G.r.clues.length,G.r.shown+1); render(); return; }
  const o=e.target.closest("[data-gu]"); if(o&&!G.r.pick){ G.r.pick=o.dataset.gu; const ok=G.r.pick===G.r.g.k; if(ok){ G.score+=6-G.r.shown; const d=gdOf(G.r.g.k); d.ok++; } else { const d=gdOf(G.r.g.k); d.ko++; d.w=(d.w||0)+2; } mtBeep(ok); G.hist.push([G.r.g.k,ok]); render(); return; }
  if(e.target.closest("[data-gu-next]")){ G.i++; if(G.i>=G.n){ const xp=G.score+5, nb=gAward("g_guess",G.score,xp); G.fin=gEnd(G,G.score,t("gPts"),xp,nb,`<div class="gsec2">${G.hist.map(([k,ok])=>`<span class="chip" data-gsee2="${esc(k)}">${ok?"✓":"✗"} ${esc(k)}</span>`).join(" ")}</div>`); render(); return; }
    G.r=guRound(G.used); G.used.push(G.r.g.k); render(); window.scrollTo(0,0); } });

/* game 3: survival */
function svPick(G){ const lvl=G.score<5?"b":G.score<12?"a":"h"; const pool=BANK.filter(b=>!G.used.has(b.id)&&(lvl==="a"||(lvl==="h"?b.h:!b.h)));
  const b=pool[Math.floor(Math.random()*pool.length)]||BANK[0]; G.used.add(b.id); return {b,ord:shuffle([0,1,2,3]),pick:null}; }
function svNew(){ const G={timer:20,left:20,score:0,hearts:3,used:new Set(),miss:[],onTime(){ svAns(-1); }}; G.q=svPick(G); return G; }
function svRender(){ const G=GM; if(G.fin) return G.fin; const q=G.q, l=L();
  return `<section class="view gplay">${gTop(G,G.left/G.timer,`<div class="mthearts">${[0,1,2].map(i=>heartSvg(i<G.hearts)).join("")}</div>`)}
   <p class="mtkind">${esc(chName(q.b.c))} · <span id="gtime">${Math.ceil(G.left)}</span>s · <b>${G.score}</b> ✓</p>
   <h2 class="qtext">${esc(q.b.q[l])}</h2>
   <div class="choices">${q.ord.map((o,i)=>`<button type="button" class="choice ${q.pick!=null?(o===0?"ok":o===q.pick?"no":""):""}" data-sv="${o}" ${q.pick!=null?"disabled":""}><span class="k">${i+1}</span><span>${esc(q.b.o[o][l])}</span></button>`).join("")}</div>
   ${q.pick!=null?`<div class="fbbar ${q.pick===0?"good":"bad"}"><b>${t(q.pick===0?"mtOk2":q.pick===-1?"svTime":"svNo")}</b><span>${esc((q.b.e||q.b.d)[l])}</span><button type="button" class="btn primary" data-sv-next>${t(G.hearts>0?"gNext":"gSee")}</button></div>`:""}
  </section>`; }
function svAns(o){ const G=GM; if(!G||G.k!=="g_surv"||G.q.pick!=null) return; clearInterval(G.iv); G.q.pick=o; const ok=o===0;
  const id=G.q.b.id, x=P.q[id]||[0,0]; P.q[id]=[x[0]+1,x[1]+(ok?1:0)]; save();
  if(ok) G.score++; else { G.hearts--; G.miss.push(G.q.b); } mtBeep(ok); render(); }
document.addEventListener("click",e=>{ const G=GM; if(!G||G.k!=="g_surv"||G.fin) return;
  const b=e.target.closest("[data-sv]"); if(b){ svAns(+b.dataset.sv); return; }
  if(e.target.closest("[data-sv-next]")){ if(G.hearts<=0){ const xp=G.score*2+5, nb=gAward("g_surv",G.score,xp); G.fin=gEnd(G,G.score,t("svUnit"),xp,nb,""); render(); return; }
    G.q=svPick(G); G.left=G.timer; render(); window.scrollTo(0,0); gTick(); } });

/* game 4: put in order */
const ORD=__ORDERS__;
function orNew(){ const qs=shuffle(ORD).slice(0,6); const G={qs,i:0,score:0,hist:[]}; orSet(G); return G; }
function orSet(G){ const s=G.qs[G.i]; G.cur={s,pool:shuffle(s.it.map((_,i)=>i)),placed:[],checked:false}; }
function orRender(){ const G=GM; if(G.fin) return G.fin; const c=G.cur, l=L(), lab=i=>{ const x=c.s.it[i]; return Array.isArray(x)?x[l]:x; };
  const ok=c.checked&&c.placed.every((v,i)=>v===i);
  return `<section class="view gplay">${gTop(G,G.i/G.qs.length,`<div class="gscore"><b>${G.score}</b> ✓</div>`)}
   <div class="mascot">${gfree("n29",84)}<div class="bubble">${esc(c.s.q[l])}</div></div>
   <div class="orslots">${c.s.it.map((_,i)=>{ const v=c.placed[i]; return `<button type="button" class="orslot ${v==null?"empty":""} ${c.checked&&v!=null?(v===i?"ok":"bad"):""}" data-orx="${i}" ${c.checked?"disabled":""}><span class="ornum">${i+1}</span>${v!=null?esc(lab(v)):""}</button>`; }).join("")}</div>
   <div class="orpool">${c.pool.map(i=>`<button type="button" class="chip big" data-orp="${i}" ${c.checked?"disabled":""}>${esc(lab(i))}</button>`).join("")}</div>
   ${c.checked?`<div class="fbbar ${ok?"good":"bad"}"><b>${t(ok?"mtOk1":"orFix")}</b><span>${c.s.it.map((_,i)=>esc(lab(i))).join(" → ")}</span><button type="button" class="btn primary" data-or-next>${t("gNext")}</button></div>`
    :`<button type="button" class="btn primary big wide" data-or-check ${c.pool.length?"disabled":""}>${t("orCheck")}</button>`}
  </section>`; }
document.addEventListener("click",e=>{ const G=GM; if(!G||G.k!=="g_order"||G.fin) return; const c=G.cur;
  const p=e.target.closest("[data-orp]"); if(p&&!c.checked){ const i=+p.dataset.orp; c.pool=c.pool.filter(x=>x!==i); const k=c.placed.findIndex(v=>v==null); if(k>=0) c.placed[k]=i; else c.placed.push(i); render(); return; }
  const x=e.target.closest("[data-orx]"); if(x&&!c.checked){ const k=+x.dataset.orx, v=c.placed[k]; if(v!=null){ c.placed[k]=null; c.pool.push(v); } render(); return; }
  if(e.target.closest("[data-or-check]")){ c.checked=true; const ok=c.placed.every((v,i)=>v===i); if(ok) G.score++; G.hist.push(ok); mtBeep(ok); render(); return; }
  if(e.target.closest("[data-or-next]")){ G.i++; if(G.i>=G.qs.length){ const xp=G.score*3+5, nb=gAward("g_order",G.score,xp); G.fin=gEnd(G,G.score+"/"+G.qs.length,t("orUnit"),xp,nb,""); render(); return; } orSet(G); render(); window.scrollTo(0,0); } });
document.addEventListener("keydown",e=>{ const G=GM; if(!G||e.ctrlKey||e.metaKey) return; const tg=e.target; if(tg&&(tg.tagName==="INPUT"||tg.tagName==="TEXTAREA")) return;
  if(G.k==="g_tf"&&!G.fin){ if(e.key==="ArrowLeft"||e.key.toLowerCase()==="f"){ e.preventDefault(); tfAns(false); } if(e.key==="ArrowRight"||e.key.toLowerCase()==="j"){ e.preventDefault(); tfAns(true); } }
  if(G.k==="g_surv"&&!G.fin&&G.q.pick==null){ const n="1234".indexOf(e.key); if(n>=0){ e.preventDefault(); svAns(G.q.ord[n]); } } });
document.addEventListener("click",e=>{ const s=e.target.closest("[data-gsee2]"); if(!s) return; const k=s.dataset.gsee2; GM=null; view=trainV="grapes"; gvQ=k.toLowerCase(); gvUnit="all"; gvCol="all"; render(); gvFilter(); const d=[...document.querySelectorAll(".gcard")].find(d=>!d.hidden); if(d){ d.open=true; d.scrollIntoView({block:"start"}); } });

/* practice: simple chapter path first, custom builder folded */
const renderPracticeOld=renderPractice;
renderPractice=function(){ const C=coach(); 
  const path=GROUPS.map((g,gi)=>`<div class="unit2" style="--gi:${gi}"><h3>${esc(g.n[lang])}</h3>${g.c.map(c=>{ const x=C.ch[c], p=x.n?x.m/x.n:0; return `<button type="button" class="chap2" data-qch="${c}"><span class="c2-ring">${ring(p,44,"var(--green)","")}</span><span class="c2-n">${esc(chName(c))}</span><span class="c2-p">${Math.round(p*100)}%</span></button>`; }).join("")}</div>`).join("");
  return `<div class="hubhead"><p class="pint">${t("prIntro")}</p>${gfree("n32",100)}</div><div class="path2">${path}</div><details class="custom"><summary>${t("prCustom")}</summary>${renderPracticeOld()}</details>`; };

/* ---------- v38: wine effects ---------- */
let GLN=0;
function glass(p,kind,label,h){ const id="gl"+(++GLN), lv=Math.max(0,Math.min(1,p)), top=12, bot=74, y=bot-(bot-top)*Math.max(lv,.04);
  const c1=kind==="white"?"#f3d27a":"#9b1f45", c2=kind==="white"?"#d9a93f":"#5f1129";
  return `<div class="glassw" style="--gh:${h}px"><svg class="glass ${kind}" viewBox="0 0 100 140" aria-hidden="true">
   <defs><clipPath id="${id}"><path d="M22 10h56c0 38-9 64-28 64S22 48 22 10z"/></clipPath><linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
   <g clip-path="url(#${id})"><rect x="0" y="${y}" width="100" height="80" fill="url(#${id}g)"/>
    <g class="wave" style="transform:translateY(${y-4}px)"><path d="M-100 4 Q-87.5 0 -75 4 T-50 4 T-25 4 T0 4 T25 4 T50 4 T75 4 T100 4 T125 4 T150 4 T175 4 T200 4 V12 H-100z" fill="url(#${id}g)"/></g>
    ${kind==="white"&&lv>0?`<g class="gbub"><circle cx="40" cy="70" r="1.6"/><circle cx="55" cy="66" r="1.2"/><circle cx="62" cy="72" r="1.4"/><circle cx="47" cy="60" r="1"/></g>`:""}</g>
   <path class="gl-glass" d="M22 10h56c0 38-9 64-28 64S22 48 22 10z"/><path class="gl-shine" d="M30 18c0 20 3 34 10 44"/>
   <path class="gl-stem" d="M50 74v44M34 124c4-4 28-4 32 0"/></svg><b>${esc(label)}</b></div>`; }
function cheers(n){ try{ if(matchMedia("(prefers-reduced-motion: reduce)").matches) return; }catch(e){}
  const box=document.createElement("div"); box.className="cheers"; n=n||34;
  for(let i=0;i<n;i++){ const s=document.createElement("i"); const x=50+(Math.random()-.5)*60; s.style.left=x+"vw"; s.style.setProperty("--dx",((Math.random()-.5)*30)+"vw");
    s.style.setProperty("--d",(1.6+Math.random()*1.6)+"s"); s.style.setProperty("--s",(6+Math.random()*12)+"px"); s.style.animationDelay=(Math.random()*.35)+"s";
    if(i%5===0) s.className="g"; box.appendChild(s); }
  document.body.appendChild(box); setTimeout(()=>box.remove(),3800); }
