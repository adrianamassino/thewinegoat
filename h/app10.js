/* ---------- v58: "Révision" redesigned like a wine cellar of labels + exam keyword recap at the end of every film ---------- */
Object.assign(T.it,{rvKick:"Ripasso",rvTitle:"La cantina del ripasso",rvIntro:"Podcast, film, dizionario, schede e mappe: tutto il libro da leggere, ascoltare e guardare, con calma.",rvListen:"Ascolta",rvOpen:"Apri",rvFilms:"film",rvTerms:"termini",rvGrapes:"vitigni",rvFigs:"cifre",rvMaps:"mappe",rvChap:"capitoli",trd_films:"Vigna, cantina, spumanti, vini dolci, Sherry, Porto, abbinamenti e tutti i paesi con le mappe",
  kwTitle:"Da ricordare per l'esame",kwWords:"Parole chiave",kwSum:"Riassunto",kwGrapes:"Vitigni",kwPlaces:"Regioni e luoghi",kwTech:"Termini tecnici",kwNums:"Cifre",kwOpen:"Riassunto e parole chiave"});
Object.assign(T.fr,{rvKick:"Révision",rvTitle:"La cave de révision",rvIntro:"Podcasts, films, dictionnaire, fiches et cartes : tout le livre à lire, écouter et regarder, en prenant son temps.",rvListen:"Écouter",rvOpen:"Ouvrir",rvFilms:"films",rvTerms:"termes",rvGrapes:"cépages",rvFigs:"chiffres",rvMaps:"cartes",rvChap:"chapitres",trd_films:"Vigne, chai, effervescents, vins doux, Xérès, Porto, accords et tous les pays en cartes",
  kwTitle:"À retenir pour l'examen",kwWords:"Mots clés",kwSum:"Résumé",kwGrapes:"Cépages",kwPlaces:"Régions et lieux",kwTech:"Termes techniques",kwNums:"Chiffres",kwOpen:"Résumé et mots clés"});
Object.assign(T.en,{rvKick:"Review",rvTitle:"The review cellar",rvIntro:"Podcasts, films, dictionary, fact sheets and maps: the whole book to read, listen to and watch, at your own pace.",rvListen:"Listen",rvOpen:"Open",rvFilms:"films",rvTerms:"terms",rvGrapes:"grapes",rvFigs:"figures",rvMaps:"maps",rvChap:"chapters",trd_films:"Vineyard, winery, sparkling, sweet wines, Sherry, Port, food pairing and every country on maps",
  kwTitle:"To remember for the exam",kwWords:"Key words",kwSum:"Summary",kwGrapes:"Grapes",kwPlaces:"Regions and places",kwTech:"Technical terms",kwNums:"Figures",kwOpen:"Summary and key words"});
try{ const lk=document.createElement("link"); lk.rel="stylesheet"; lk.href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap"; document.head.appendChild(lk); }catch(e){}
const RV_ORN=`<svg class="rvorn" viewBox="0 0 220 24" aria-hidden="true"><path d="M4 12H86M134 12H216" stroke="currentColor" stroke-width=".8"/><path d="M92 12c6-8 14-8 18 0c4-8 12-8 18 0c-6 8-14 8-18 0c-4 8-12 8-18 0z" fill="none" stroke="currentColor" stroke-width=".9"/><circle cx="110" cy="12" r="2.2" fill="currentColor"/></svg>`;
const RVDECO={
 glass:`<svg class="rvdeco" viewBox="0 0 100 140" aria-hidden="true"><path d="M22 8h56c0 34-8 54-28 58c-20-4-28-24-28-58z" fill="currentColor" opacity=".18"/><path d="M26 30h48c-2 18-9 30-24 32c-15-2-22-14-24-32z" fill="currentColor" opacity=".28"/><path d="M50 66v52M30 128h40" stroke="currentColor" stroke-width="5" stroke-linecap="round" opacity=".2"/></svg>`,
 bottle:`<svg class="rvdeco" viewBox="0 0 100 140" aria-hidden="true"><path d="M42 4h16v26c0 8 14 14 14 32v70c0 4-3 6-6 6H34c-3 0-6-2-6-6V62c0-18 14-24 14-32z" fill="currentColor" opacity=".18"/><rect x="30" y="74" width="40" height="34" rx="3" fill="currentColor" opacity=".22"/></svg>`,
 grape:`<svg class="rvdeco" viewBox="0 0 100 140" aria-hidden="true">${[[50,40],[34,54],[66,54],[50,68],[26,72],[74,72],[38,86],[62,86],[50,102],[44,118],[56,118]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="11" fill="currentColor" opacity=".2"/>`).join("")}<path d="M50 30C52 16 60 10 70 8" stroke="currentColor" stroke-width="4" fill="none" opacity=".25"/></svg>`,
 cork:`<svg class="rvdeco" viewBox="0 0 100 140" aria-hidden="true"><rect x="30" y="20" width="40" height="80" rx="10" fill="currentColor" opacity=".18"/><path d="M30 40h40M30 60h40M30 80h40" stroke="currentColor" stroke-width="3" opacity=".2"/><circle cx="50" cy="120" r="12" fill="none" stroke="currentColor" stroke-width="4" opacity=".2"/></svg>`};
function renderWine(){
  const tile=(g,ic,ti,sub,cls,num,unit,deco,badge)=>`<button type="button" class="rvt2 ${cls}" data-go="${g}">${RVDECO[deco]||""}<i class="rvshine"></i>${badge?`<span class="game-new rvbadge">${esc(badge)}</span>`:""}<span class="rvic">${ICO[ic]||""}</span><span class="rvtx"><b>${esc(ti)}</b><span>${esc(sub)}</span></span>${num!==""?`<span class="rvnum"><b>${num}</b><small>${esc(unit)}</small></span>`:""}</button>`;
  const bars=Array.from({length:28},(_,i)=>`<i style="--d:${(i*137%100)/100}s;--h:${30+((i*53)%70)}%"></i>`).join("");
  const nFig=NUMS.reduce((a,s)=>a+s[2].length,0);
  return `<section class="view hub area-wine rv2">${hubHead("ban-wine","wnKick","wnTitle","wnIntro","n11")}
   <button type="button" class="rvpod2" data-go="pods"><span class="rvwave" aria-hidden="true">${bars}</span><span class="rvplay">${ICO.pod||""}</span><span class="rvptx"><small>${esc(PODS.length+" "+t("rvChap"))}</small><b>${esc(t("tr_pods"))}</b><span>${esc(t("trd_pods"))}</span></span><span class="rvgo2">${esc(t("rvListen"))} ▸</span></button>
   <div class="rvgrid2">
    ${tile("films","film",t("tr_films"),t("trd_films"),"rv-films wide",FILMS.length,t("rvFilms"),"glass",t("newG"))}
    ${tile("flash","quiz",t("tr_flash"),t("trd_flash"),"rv-flash wide",fcAll().length,t("fcCards"),"cork",t("newG"))}
    ${tile("uve","grapes",t("tr_uve"),t("trd_uve"),"rv-uve wide",GRAPES.length,t("rvGrapes"),"grape",t("newG"))}
    ${tile("dict","dict",t("tr_dict"),t("trd_dict"),"rv-dict",DICT.length,t("rvTerms"),"cork")}
    ${tile("nums","nums",t("tr_nums"),t("trd_nums"),"rv-nums",nFig,t("rvFigs"),"bottle")}
    ${tile("schemi","schemi",t("tr_schemi"),t("stSchemi"),"rv-sch","","","cork")}
    ${tile("maps","maps",t("tr_maps"),t("trd_maps"),"rv-maps",MAPS.length,t("rvMaps"),"bottle")}
   </div></section>`; }

/* ---------- keyword recap ---------- */
const KWC={};
function kwLex(){ const l=L(); if(KWC[l]) return KWC[l]; const terms=new Map();
  const add=(s,cat)=>{ s=String(s||"").trim(); if(s.length<4||/^\d/.test(s)) return; const k=s.toLowerCase(); if(!terms.has(k)) terms.set(k,{t:s,c:cat}); };
  try{ DICT.forEach(d=>{ add(d[1+l],"tech"); add(d[2],"tech"); String(d[1+l]).split(/\s*[\/(]\s*/).forEach(x=>add(x.replace(/\)$/,""),"tech")); }); }catch(e){}
  try{ GRAPES.forEach(g=>{ add(g.k,"grape"); (g.syn||[]).forEach(s=>add(s,"grape")); }); }catch(e){}
  try{ MAPS.forEach(m=>m.it.forEach(x=>{ if(x[0]==="x") return; const nm=x[0]==="c"&&typeof mLab==="function"?mLab(x[1]):mName(x[1]); add(nm,"place"); add(x[1].replace(/ (town|village)$/,"").replace(/\s*\(Grand Cru\)$/,""),"place"); })); }catch(e){}
  ["Kabinett","Spätlese","Auslese","Beerenauslese","Trockenbeerenauslese","Eiswein","Prädikatswein","Qualitätswein","Grosses Gewächs","Grosse Lage","Erste Lage","VDP","DOCG","DOC","AOC","AOP","IGP","DOCa","DOP","Crianza","Reserva","Gran Reserva","Riserva","Classico","Gran Selezione","Superiore","Premier Cru","Grand Cru","Cru Classé","Cru Bourgeois","Village","Fino","Manzanilla","Amontillado","Oloroso","Palo Cortado","Ruby","Tawny","Late Bottled Vintage","LBV","Colheita","Vintage","Eszencia","Szamorodni","Aszú","puttonyos","Smaragd","Federspiel","Steinfeder","Crémant","Cava","Prosecco","Franciacorta","Cap Classique","Sekt","Asti","Moscato d'Asti","SGN","Vendanges Tardives","Vin Santo","Recioto","Amarone","Ripasso","appassimento","passerillage","Botrytis cinerea","Süssreserve","sobretabla","criadera","solera","saca","rocío","flor","aguardente","lagar","autovinificateur","GI","AVA","WO"].forEach(x=>add(x,"tech"));
  const list=[...terms.values()].sort((a,b)=>b.t.length-a.t.length);
  const esc_=s=>s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
  const re=new RegExp("(?<![\\p{L}\\p{N}])("+list.map(x=>esc_(x.t)).join("|")+")(?![\\p{L}\\p{N}])","giu");
  const byk=new Map(list.map(x=>[x.t.toLowerCase(),x]));
  return KWC[l]={re,byk}; }
const KWNUM=/\d[\d\s.,]*\s?(?:%|°C|°|g\/l|hl\/ha|l\b|litri|litres|liters|mètres|metri|metres|meters|m\b|km|ha\b|hectares|ettari|mois|mesi|months|ans\b|anni\b|years|atm|kg|ore|heures|hours|giorni|jours|days)/g;
function kwMark(text){ const {re,byk}=kwLex(); let h=esc(text);
  h=h.replace(re,m=>`<b class="kw">${m}</b>`);
  h=h.replace(/(^|[^>\w])(\d[\d\s.,]*\s?(?:%|°C|g\/l|hl\/ha|mesi|mois|months|anni|ans|years|atm|ettari|hectares|metri|mètres|metres|m\b|km|giorni|jours|days|ore|heures|hours|litri|litres|liters|kg))/g,(m,a,b)=>`${a}<b class="kw num">${b}</b>`);
  return h; }
function kwCollect(f){ const {re,byk}=kwLex(); const out={grape:new Map(),place:new Map(),tech:new Map(),num:new Map()};
  f.s.forEach(sc=>{ const txt=tx(sc.h)+". "+tx(sc.c); let m; re.lastIndex=0;
    while((m=re.exec(txt))){ const e=byk.get(m[0].toLowerCase()); if(!e) continue; const k=m[0].toLowerCase(); if(!out[e.c].has(k)) out[e.c].set(k,/^[a-zà-ÿ]/.test(m[0])&&/^[A-ZÀ-Ý]/.test(e.t)?e.t:m[0]); }
    (txt.match(KWNUM)||[]).forEach(x=>{ x=x.trim().replace(/[.,]$/,""); if(!out.num.has(x)) out.num.set(x,x); }); });
  return out; }
function kwFirst(s){ const m=String(s).match(/^[^.!?…]+[.!?…]/); return m?m[0]:String(s); }
function renderKw(f){ const K=kwCollect(f);
  const grp=(k,lab)=>K[k].size?`<div class="kwg"><h4>${esc(t(lab))}</h4><div class="kwchips">${[...K[k].values()].map(x=>`<b class="kwc kw-${k}">${esc(x)}</b>`).join("")}</div></div>`:"";
  const sum=f.s.map((sc,i)=>{ const c=tx(sc.c); if(!c||c==="…") return ""; return `<li><b class="kwh">${esc(tx(sc.h))}</b><span>${kwMark(i===0&&f.pod?c:c)}</span></li>`; }).join("");
  return `<div class="kwbox"><div class="kwhead">${RV_ORN}<h3>${esc(t("kwTitle"))}</h3><p class="muted">${esc(tx(f.t))}</p></div>
    <section class="kwsec"><h3>${esc(t("kwWords"))}</h3>${grp("tech","kwTech")}${grp("grape","kwGrapes")}${grp("place","kwPlaces")}${grp("num","kwNums")}</section>
    <section class="kwsec"><h3>${esc(t("kwSum"))}</h3><ol class="kwsum">${sum}</ol></section></div>`; }
/* end screen of every film = recap + keywords, then the usual buttons */
Object.assign(T.it,{flTestV:"Test su questo video",flTestN:"domande sul contenuto del film"});
Object.assign(T.fr,{flTestV:"Test sur cette vidéo",flTestN:"questions sur le contenu du film"});
Object.assign(T.en,{flTestV:"Quiz on this video",flTestN:"questions on what the film covered"});
const FQC={}; let BKDOC=null;
function bkDocs(l){ if(BKDOC&&BKDOC.l===l) return BKDOC; const d=BANK.map(b=>" "+flNorm(b.q[l]+" "+b.o[0][l]+" "+(b.e?b.e[l]:""))+" "); return BKDOC={l,d}; }
function filmQuizIds(f){ const l=L(), key=f.id+"|"+l; if(FQC[key]) return FQC[key];
  const ded=BANK.filter(b=>b.f===f.id).map(b=>b.id);
  const K=kwCollect(f), terms=new Set();
  ["tech","grape","place"].forEach(k=>K[k].forEach(v=>terms.add(flNorm(v))));
  if(f.pod){ const pf=PFS.find(p=>p.pod===f.pod); if(pf) pf.s.forEach(sc=>{ const m=MBY[sc.m]; sc.hl.forEach(j=>{ const x=m.it[j]; terms.add(flNorm(x[0]==="c"&&typeof mLab==="function"?mLab(x[1]):mName(x[1]))); }); sc.g.forEach(g=>terms.add(flNorm(g))); }); terms.add(flNorm(tx(f.t))); }
  const {d}=bkDocs(l), N=d.length, W=[];
  terms.forEach(tm=>{ if(tm.length<4) return; const pat=" "+tm; let df=0; for(const s of d) if(s.includes(pat)) df++; if(df&&df<N*.06) W.push([pat,Math.log(N/df)]); });
  const sc=BANK.map((b,i)=>{ let s=0; for(const [p,w] of W) if(d[i].includes(p)) s+=w; if(b.c===f.ch) s*=1.4; return [b.id,s]; }).filter((x,i)=>{ const b=BANK[i]; if(ded.includes(x[0])||x[1]<4.2) return false; if(f.ch==="deg") return b.c==="deg"; if(!f.pod&&b.c!==f.ch&&x[1]<7) return false; return true; }).sort((a,b)=>b[1]-a[1]);
  return FQC[key]={ded,kw:sc.slice(0,30).map(x=>x[0])}; }
function startFilmQuiz(fi){ const f=FILMS[fi], Q=filmQuizIds(f);
  let ids=shuffle(Q.ded.slice()).slice(0,10); if(ids.length<10) ids=ids.concat(shuffle(Q.kw.slice(0,18)).slice(0,10-ids.length));
  if(ids.length<4) return startCh(f.ch); flStop&&flStop(); startQuiz(ids,"practice",[f.ch]); }
document.addEventListener("click",e=>{ const b=e.target.closest&&e.target.closest("[data-qfilm]"); if(!b) return; e.preventDefault(); e.stopPropagation(); startFilmQuiz(+b.dataset.qfilm); },true);
function renderFilmKw(){ const f=FILMS[FL.f];
  if(f.pod){ const lg=flLang(); if(!(PX[lg]&&PX[lg][f.pod])&&typeof pdText==="function"){ pdText(lg).then(()=>{ if(view==="film") render(); }); } }
  const Q=filmQuizIds(f), nq=Math.min(10,Q.ded.length+Q.kw.length);
  return `<section class="view film yt"><div class="flend card">${gfree("n04",150)}<h2>${t("flEnd")}</h2><p><b>${esc(tx(f.t))}</b></p>
   <div class="row"><button type="button" class="btn primary" data-qfilm="${FL.f}">${esc(t("flTestV"))}${nq>=4?` · ${nq} ${esc(t("flTestN"))}`:""}</button></div>
   <div class="row"><button type="button" class="btn" data-fl="again">${t("flAgain")}</button>${FL.f<FILMS.length-1?`<button type="button" class="btn" data-fl="nextfilm">${t("flNext")}</button>`:""}<button type="button" class="btn ghost" data-go="films">${t("tr_films")}</button></div></div>
   <div class="card kwend">${renderKw(f)}</div></section>`; }
document.addEventListener("click",e=>{ const b=e.target.closest&&e.target.closest("[data-kwopen]"); if(!b||!FL) return; e.stopPropagation(); flStop(); FL.play=false; FL.end=true; render(); window.scrollTo(0,0); },true);
try{ const st=document.createElement("style"); st.textContent=`
:root{--rv-paper:#fbf6ea;--rv-paper2:#f1e6cf;--rv-ink:#2a1418;--rv-gold:#b8913f;--rv-gold2:#d9b86a;--rv-wine:#6e1630;--rv-muted:#7b6a5c}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--rv-paper:#2a1a1e;--rv-paper2:#1d1215;--rv-ink:#f3e6cf;--rv-gold:#c9a457;--rv-gold2:#e2c27a;--rv-wine:#e7b7a3;--rv-muted:#b9a58f}}
[data-theme="dark"]{--rv-paper:#2a1a1e;--rv-paper2:#1d1215;--rv-ink:#f3e6cf;--rv-gold:#c9a457;--rv-gold2:#e2c27a;--rv-wine:#e7b7a3;--rv-muted:#b9a58f}
.rv2{display:flex;flex-direction:column;gap:14px}
.rv2 .ban-wine{background:radial-gradient(90% 120% at 100% 0%,rgba(255,111,145,.45),transparent 55%),radial-gradient(130% 120% at 0% 0%,#a3264f 0%,#6e1630 45%,#2c0814 100%)!important}
.rvpod2{position:relative;overflow:hidden;display:flex;align-items:center;gap:14px;text-align:left;border:0;border-radius:24px;padding:20px 18px;color:#fff;cursor:pointer;
 background:radial-gradient(120% 140% at 100% 0%,#c2185b33,transparent 55%),linear-gradient(135deg,#3a0a1e 0%,#6e1630 48%,#9b2045 100%);box-shadow:0 6px 0 #2a0614,0 14px 30px rgba(110,22,48,.35);transition:transform .12s}
.rvpod2:active{transform:translateY(3px);box-shadow:0 3px 0 #2a0614}
.rvwave{position:absolute;right:-6px;bottom:0;height:62%;width:44%;display:flex;align-items:flex-end;gap:3px;opacity:.26;pointer-events:none}
.rvwave i{flex:1;height:var(--h);border-radius:3px 3px 0 0;background:linear-gradient(#ffd27a,#d4a23a);animation:rvwv 1.4s ease-in-out infinite alternate;animation-delay:calc(var(--d)*-1);transform-origin:bottom}
@keyframes rvwv{from{transform:scaleY(.35)}to{transform:scaleY(1)}}
.rvplay{position:relative;flex:none;width:58px;height:58px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#ffe3a1,#d4a23a);box-shadow:0 0 0 5px rgba(255,214,130,.22),0 8px 18px rgba(0,0,0,.35)}
.rvplay svg{width:30px;height:30px}
.rvptx{position:relative;flex:1;display:flex;flex-direction:column;gap:2px;min-width:0}
.rvptx small{font-size:.66rem;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#ffd27a}
.rvptx b{font-family:var(--f-display);font-size:1.5rem;line-height:1.1}
.rvptx span{font-size:.86rem;opacity:.9;line-height:1.35}
.rvgo2{position:relative;flex:none;font-size:.72rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;background:#fff;color:#6e1630;padding:8px 12px;border-radius:999px;box-shadow:0 3px 0 rgba(0,0,0,.2)}
.rvgrid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
@media (min-width:900px){.rvgrid2{grid-template-columns:repeat(3,minmax(0,1fr))}.rvt2.wide{grid-column:span 2}}
.rvt2{position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:flex-start;gap:10px;text-align:left;border:0;border-radius:22px;padding:18px 16px 16px;min-height:200px;color:#fff;cursor:pointer;
 background:var(--bg);box-shadow:0 6px 0 var(--sh),0 12px 26px rgba(40,10,20,.18);transition:transform .12s,box-shadow .12s;isolation:isolate}
.rvt2:hover{transform:translateY(-2px)}.rvt2:active{transform:translateY(4px);box-shadow:0 2px 0 var(--sh)}
.rvt2:focus-visible,.rvpod2:focus-visible{outline:3px solid #ffd27a;outline-offset:3px}
.rvt2.wide{grid-column:1/-1;min-height:170px}
.rvdeco{position:absolute;right:-14px;bottom:-14px;width:44%;max-width:120px;height:auto;color:#fff;z-index:-1;transform:rotate(-12deg)}
.rvshine{position:absolute;inset:0;z-index:-1;background:radial-gradient(90% 60% at 0% 0%,rgba(255,255,255,.28),transparent 60%),linear-gradient(115deg,transparent 40%,rgba(255,255,255,.14) 50%,transparent 60%);background-size:100% 100%,250% 100%;animation:rvsh 6s ease-in-out infinite}
@keyframes rvsh{0%,70%{background-position:0 0,120% 0}100%{background-position:0 0,-120% 0}}
.rvic{width:52px;height:52px;border-radius:50%;background:#fff;display:grid;place-items:center;box-shadow:0 4px 10px rgba(0,0,0,.18)}.rvic svg{width:30px;height:30px}
.rvtx{display:flex;flex-direction:column;gap:4px}.rvtx b{font-family:var(--f-display);font-size:1.22rem;line-height:1.12}.rvtx span{font-size:.82rem;line-height:1.35;opacity:.92;font-weight:600}
.rvnum{margin-top:auto;display:flex;align-items:baseline;gap:6px;background:rgba(0,0,0,.18);border:1px solid rgba(255,255,255,.22);backdrop-filter:blur(4px);padding:4px 12px 4px 10px;border-radius:999px}
.rvnum b{font-family:var(--f-display);font-size:1.25rem;color:#ffe3a1}.rvnum small{font-size:.66rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase}
.rvbadge{position:absolute;top:12px;right:12px}
.rv-films{--bg:radial-gradient(120% 120% at 100% 0%,#ff6f91 0%,transparent 45%),linear-gradient(135deg,#7a0f33,#b3214c 60%,#e0485e);--sh:#4d0a20}
.rv-films .rvtx b{font-size:1.5rem}
.rv-dict{--bg:linear-gradient(150deg,#1e2f5c,#3b4f9a 70%,#6273c9);--sh:#121c3a}
.rv-gtab{--bg:linear-gradient(150deg,#4b1248,#7e2a78 65%,#b04a9c);--sh:#2e0b2c}
.rv-nums{--bg:linear-gradient(150deg,#8a5a0c,#c8901f 60%,#f0bf4c);--sh:#5c3c08}
.rv-grapes{--bg:linear-gradient(150deg,#1d4b2a,#2f7a43 65%,#64a85a);--sh:#11301a}
.rv-sch{--bg:linear-gradient(150deg,#7a2a12,#b7472a 60%,#e07a4f);--sh:#4f1b0b}
.rv-maps{--bg:linear-gradient(150deg,#0f4a52,#1b7a7f 65%,#3fb0a6);--sh:#08302f}
@media (max-width:380px){.rvt2{min-height:180px;padding:14px 12px}.rvtx b{font-size:1.08rem}.rvgo2{display:none}}
/* dictionary */
.dictv .dcbar input,.gtbar1 input,.numsv .dcbar input{border:1px solid var(--rv-gold);border-radius:999px;padding:11px 16px;background:var(--rv-paper);font-family:"Cormorant Garamond",Georgia,serif;font-size:1.1rem;color:var(--rv-ink)}
.dccats .chip,.gtcols .chip,.gtctl select.chip{border:1px solid color-mix(in srgb,var(--rv-gold) 70%,transparent);background:transparent;color:var(--rv-ink);border-radius:999px;font-weight:600}
.dccats .chip[aria-pressed="true"],.gtcols .chip[aria-pressed="true"]{background:#6e1630;border-color:#6e1630;color:#fbf0dc}
.dcl{border:0!important;display:block;position:relative;margin:18px 0 4px!important;font-family:"Cormorant Garamond",Georgia,serif!important;font-size:2rem!important;font-weight:700;font-style:italic;color:var(--rv-wine)!important;line-height:1}
.dcl::first-letter{display:inline-block;color:#fff;background:linear-gradient(135deg,#6e1630,#c2185b);padding:4px 14px;border-radius:14px;font-style:normal;font-size:1.5rem;box-shadow:0 4px 0 #3a0a1e}
.dcl::after{content:"";position:absolute;left:62px;right:0;top:50%;height:1px;background:linear-gradient(90deg,var(--rv-gold),transparent)}
.dcrow{position:relative;background:linear-gradient(180deg,var(--rv-paper),var(--rv-paper2))!important;border:1px solid color-mix(in srgb,var(--rv-gold) 55%,transparent)!important;border-left:3px solid #6e1630!important;border-radius:12px!important;padding:12px 16px!important;box-shadow:0 3px 10px rgba(60,20,20,.06)}
.dch b{font-family:"Cormorant Garamond",Georgia,serif;font-size:1.35rem;font-weight:700;color:var(--rv-wine)}
.dct{font-family:var(--f-mono);font-style:normal!important;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--rv-gold)}
.dcrow p{color:var(--rv-ink);font-size:.95rem!important}
.dceq{border-top:1px dashed color-mix(in srgb,var(--rv-gold) 45%,transparent);padding-top:6px;margin-top:2px}
/* grape table */
.gtwrap{border-color:var(--rv-gold)!important;background:var(--rv-paper)!important;border-radius:14px!important}
.gtab thead th{background:#4a0f22!important;color:#f6e7c8!important;font-family:var(--f-mono);letter-spacing:.12em;box-shadow:inset 0 -2px 0 var(--rv-gold)!important}
.gtab tbody th{background:var(--rv-paper)!important}.gtab tbody tr:nth-child(even) td,.gtab tbody tr:nth-child(even) th{background:var(--rv-paper2)!important}
.gtnm{font-family:"Cormorant Garamond",Georgia,serif;font-size:1.12rem;color:var(--rv-wine)!important}
.gtab td,.gtab th{border-bottom-color:color-mix(in srgb,var(--rv-gold) 30%,transparent)!important}
/* figures */
.nmsec h3{font-family:"Cormorant Garamond",Georgia,serif;font-style:italic;font-size:1.6rem;color:var(--rv-wine);display:flex;align-items:center;gap:12px}
.nmsec h3::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,var(--rv-gold),transparent)}
.nmcard{background:linear-gradient(180deg,var(--rv-paper),var(--rv-paper2))!important;border:1px solid color-mix(in srgb,var(--rv-gold) 60%,transparent)!important;border-radius:12px!important;position:relative;padding:14px 16px!important}
.nmcard::before{content:"";position:absolute;inset:4px;border:1px solid color-mix(in srgb,var(--rv-gold) 30%,transparent);border-radius:9px;pointer-events:none}
.nmv{font-family:"Cormorant Garamond",Georgia,serif!important;font-size:2rem!important;font-weight:700;color:var(--rv-wine)!important;border-bottom:1px solid var(--rv-gold);align-self:flex-start;padding-bottom:2px}
.nml{color:var(--rv-ink)}.nmd{color:var(--rv-muted)}
/* keyword recap */
.kwend{gap:16px;text-align:left!important;align-items:stretch!important}.kwend .kwhead{text-align:center}
.kwbox{display:flex;flex-direction:column;gap:16px}
.kwhead{text-align:center;color:var(--rv-gold)}.kwhead .rvorn{margin:0 auto 4px}.kwhead h3{margin:0;font-family:"Cormorant Garamond",Georgia,serif;font-size:1.8rem;font-style:italic;color:var(--rv-wine)}.kwhead p{margin:2px 0 0}
.kwsec{background:linear-gradient(180deg,var(--rv-paper),var(--rv-paper2));border:1px solid color-mix(in srgb,var(--rv-gold) 55%,transparent);border-radius:14px;padding:14px 16px}
.kwsec>h3{margin:0 0 10px;font-family:var(--f-mono);font-size:.74rem;letter-spacing:.24em;text-transform:uppercase;color:var(--rv-gold)}
.kwg{margin-bottom:10px}.kwg h4{margin:0 0 6px;font-family:"Cormorant Garamond",Georgia,serif;font-size:1.15rem;color:var(--rv-wine)}
.kwchips{display:flex;flex-wrap:wrap;gap:6px}
.kwc{font-weight:800;font-size:.86rem;padding:4px 10px;border-radius:999px;background:color-mix(in srgb,#6e1630 10%,transparent);border:1px solid color-mix(in srgb,#6e1630 30%,transparent);color:var(--rv-ink)}
.kwc.kw-grape{background:color-mix(in srgb,#5b1d4a 14%,transparent)}.kwc.kw-place{background:color-mix(in srgb,#1f5160 14%,transparent);border-color:color-mix(in srgb,#1f5160 35%,transparent)}.kwc.kw-num{background:color-mix(in srgb,#b8913f 22%,transparent);border-color:color-mix(in srgb,#b8913f 50%,transparent)}
.kwsum{margin:0;padding-left:1.4em;display:flex;flex-direction:column;gap:10px}.kwsum li{line-height:1.55}.kwsum li::marker{color:var(--rv-gold);font-weight:700}
.kwh{display:block;font-family:"Cormorant Garamond",Georgia,serif;font-size:1.12rem;color:var(--rv-wine)}
.kwsum b.kw{font-weight:800;color:var(--rv-ink);background:linear-gradient(transparent 62%,color-mix(in srgb,#d9b86a 45%,transparent) 62%)}
.kwsum b.kw.num{background:linear-gradient(transparent 62%,color-mix(in srgb,#6e1630 25%,transparent) 62%)}
.ytchap li.kwli button{color:var(--rv-wine);font-weight:700}
`; document.head.appendChild(st); }catch(e){}

/* ---------- film search ---------- */
Object.assign(T.it,{flIntro:"Vigna, cantina, stili e paesi del vino: ogni passaggio animato e spiegato a voce, con mappe e schemi da ricordare. Alla fine di ogni film trovi le parole chiave e un test sul contenuto del video.",flsPh:"Cerca un film: Champagne, Riesling, solera, Barolo…",flsNone:"Nessun film trovato per questa ricerca.",flsN:"film trovati"});
Object.assign(T.fr,{flIntro:"Vigne, chai, styles et pays du vin : chaque étape animée et expliquée à voix haute, avec cartes et schémas à retenir. À la fin de chaque film, les mots clés et un test sur le contenu de la vidéo.",flsPh:"Chercher un film : Champagne, riesling, solera, Barolo…",flsNone:"Aucun film trouvé pour cette recherche.",flsN:"films trouvés"});
Object.assign(T.en,{flIntro:"Vineyard, winery, styles and wine countries: every step animated and narrated, with maps and charts to remember. Each film ends with the key words and a quiz on what the video covered.",flsPh:"Search films: Champagne, Riesling, solera, Barolo…",flsNone:"No film matches this search.",flsN:"films found"});
const flNorm=s=>String(s||"").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g,"").replace(/[’']/g," ");
const FLIX={};
function flIndex(f){ const k=f.id+"|"+flLang(); if(FLIX[k]) return FLIX[k]; const parts=[];
  const all=x=>Array.isArray(x)?x.join(" "):String(x||"");
  parts.push(all(f.t));
  if(f.pod){ const pf=PFS.find(p=>p.pod===f.pod); if(pf){ pf.s.forEach(sc=>{ const m=MBY[sc.m]; sc.hl.forEach(j=>{ const x=m.it[j]; parts.push(x[1]); try{ parts.push(mName(x[1])); }catch(e){} }); parts.push(sc.g.join(" ")); (sc.h||[]).forEach(h=>parts.push(h||"")); (sc.nb||[]).forEach(n=>parts.push(n.join(" "))); });
      const m0=MBY[pf.s[0].m]; if(m0) m0.it.forEach(x=>parts.push(x[1])); }
    const X=PX[flLang()]&&PX[flLang()][f.pod]; if(X) parts.push(X.p.join(" ")); }
  else f.s.forEach(sc=>{ parts.push(all(sc.h)); parts.push(all(sc.c)); });
  const r=flNorm(parts.join(" ")); if(!f.pod||(PX[flLang()]&&PX[flLang()][f.pod])) FLIX[k]=r; return r; }
let FLQ="";
function flFilter(){ const q=flNorm(FLQ).trim(), ws=q.split(/\s+/).filter(Boolean); let n=0;
  document.querySelectorAll(".films .flcard").forEach(b=>{ const f=FILMS[+b.dataset.film]; const ok=!ws.length||ws.every(w=>flNorm(tx(f.t)).includes(w)||flIndex(f).includes(w)); b.hidden=!ok; if(ok) n++; });
  document.querySelectorAll(".films .flsecw").forEach(s=>{ s.hidden=!s.querySelector(".flcard:not([hidden])"); });
  const c=document.querySelector(".flscount"); if(c) c.textContent=ws.length?(n?`${n} ${t("flsN")}`:t("flsNone")):"";
  const x=document.querySelector(".flsx"); if(x) x.hidden=!ws.length; }
const FLTAGS=["Champagne","Bordeaux","Bourgogne","Riesling","Pinot Noir","Nebbiolo","Sherry","Porto","Tokaji","rosé","solera","botrytis"];
function renderFilms(){ const seen=flSeen(); let n=0;
  if(typeof pdText==="function"&&!(PX[flLang()])) pdText(flLang()).then(()=>{ if(view==="films"&&FLQ) flFilter(); });
  return `<section class="view films"><p class="flintro">${t("flIntro")}</p>
   <div class="flsearch"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg><input type="search" id="flsq" value="${esc(FLQ)}" placeholder="${esc(t("flsPh"))}" aria-label="${esc(t("flsPh"))}" autocomplete="off"><button type="button" class="flsx" aria-label="×" ${FLQ?"":"hidden"}>×</button></div>
   <div class="flstags">${FLTAGS.map(x=>`<button type="button" class="chip" data-flt="${esc(x)}">${esc(x)}</button>`).join("")}</div><p class="flscount" aria-live="polite"></p>
   ${["e","v","c","r","m","s","t"].map(sec=>{ const L_=FILMS.map((f,i)=>[f,i]).filter(([f])=>(f.map&&f.sec==="r"?"m":f.sec)===sec); if(!L_.length) return "";
    return `<div class="flsecw"><h2 class="hsec">${esc(tx(FSEC[sec]))}</h2><div class="flgrid">${L_.map(([f,i])=>`<button type="button" class="flcard${flSeenN(f)?" isseen":""}" data-film="${i}"><span class="flthumb">${f.th?f.th():f.s[0].v()}<span class="flplay">▶</span><span class="flnum">${++n}</span>${flSeenN(f)?`<span class="flseen">✓ ${flSeenN(f)}×</span>`:""}${f.nw&&!seen[f.id]?`<span class="flnew">${esc(t("ytNew"))}</span>`:""}</span><span class="fltx"><b>${esc(tx(f.t))}</b><span>${f.s.length} ${t("flScenes")} · ${flSeenN(f)?`<span class="flseenl">✓ ${esc(flSeenTxt(flSeenN(f)))}</span>`:`<span class="flnot">${esc(t("notSeen"))}</span>`}</span></span></button>`).join("")}</div></div>`; }).join("")}</section>`; }
document.addEventListener("input",e=>{ if(e.target&&e.target.id==="flsq"){ FLQ=e.target.value; flFilter(); } });
document.addEventListener("click",e=>{ const tg=e.target.closest&&e.target.closest("[data-flt]"); if(tg){ FLQ=tg.dataset.flt; const i=document.getElementById("flsq"); if(i) i.value=FLQ; flFilter(); return; }
  const x=e.target.closest&&e.target.closest(".flsx"); if(x){ FLQ=""; const i=document.getElementById("flsq"); if(i){ i.value=""; i.focus(); } flFilter(); } });
new MutationObserver(()=>{ if(view==="films"&&FLQ&&document.getElementById("flsq")&&!document.querySelector(".films[data-fq]")){ const s=document.querySelector(".films"); if(s){ s.dataset.fq=1; flFilter(); } } }).observe(document.documentElement,{childList:true,subtree:true});
try{ const st3=document.createElement("style"); st3.textContent=`
.flsearch{position:sticky;top:8px;z-index:5;display:flex;align-items:center;gap:10px;padding:6px 8px 6px 16px;border-radius:999px;background:linear-gradient(135deg,#6e1630,#a3264f);box-shadow:0 5px 0 #3a0a1e,0 12px 24px rgba(110,22,48,.28);color:#ffe3a1;margin:4px 0 2px}
.flsearch svg{width:20px;height:20px;flex:none}
.flsearch input{flex:1;min-width:0;border:0;outline:0;background:#fff;color:#2a1418;border-radius:999px;padding:11px 16px;font:600 1rem var(--f-body,inherit)}
[data-theme="dark"] .flsearch input{background:#2a1a1e;color:#f3e6cf}@media (prefers-color-scheme: dark){:root:not([data-theme="light"]) .flsearch input{background:#2a1a1e;color:#f3e6cf}}
.flsearch input::-webkit-search-cancel-button{display:none}
.flsx{flex:none;width:34px;height:34px;border-radius:50%;border:0;background:rgba(255,255,255,.18);color:#fff;font-size:1.3rem;line-height:1;cursor:pointer}
.flstags{display:flex;gap:6px;overflow-x:auto;padding:8px 2px 2px;scrollbar-width:none}.flstags::-webkit-scrollbar{display:none}
.flstags .chip{flex:none;border-radius:999px;border:1px solid color-mix(in srgb,#a3264f 40%,transparent);background:color-mix(in srgb,#a3264f 8%,transparent);color:inherit;font-weight:700;padding:6px 12px;cursor:pointer}
.flscount{margin:4px 2px 0;font-weight:700;color:#a3264f;min-height:1em}
.flsecw[hidden],.flcard[hidden]{display:none!important}
`; document.head.appendChild(st3); }catch(e){}

/* ---------- v61: quiz page — start first, topics optional ---------- */
Object.assign(T.it,{qzKick:"Quiz a scelta multipla",qzTitle:"Pronta per un quiz?",qzHow:"Quante domande?",qzGo:"Inizia il quiz",qzQ:"domande",qzAll:"Tutte",qzTopics:"Argomenti",qzTopicsH:"Facoltativo: scegli solo gli argomenti che vuoi ripassare. Di base sono inclusi tutti.",qzOpts:"Opzioni",qzAllT:"tutti gli argomenti",qzSome:"argomenti scelti",qzGroup:"tutto il gruppo"});
Object.assign(T.fr,{qzKick:"Quiz à choix multiple",qzTitle:"Prête pour un quiz ?",qzHow:"Combien de questions ?",qzGo:"Commencer le quiz",qzQ:"questions",qzAll:"Toutes",qzTopics:"Thèmes",qzTopicsH:"Facultatif : choisissez seulement les thèmes à réviser. Par défaut, tous sont inclus.",qzOpts:"Options",qzAllT:"tous les thèmes",qzSome:"thèmes choisis",qzGroup:"tout le groupe"});
Object.assign(T.en,{qzKick:"Multiple-choice quiz",qzTitle:"Ready for a quiz?",qzHow:"How many questions?",qzGo:"Start the quiz",qzQ:"questions",qzAll:"All",qzTopics:"Topics",qzTopicsH:"Optional: pick only the topics you want to revise. By default all are included.",qzOpts:"Options",qzAllT:"all topics",qzSome:"topics chosen",qzGroup:"whole group"});
let qzN=(()=>{ try{ return +localStorage.getItem("wset3-qzn")||20; }catch(e){ return 20; } })();
function qzLabel(){ const all=pSel&&pSel.size===Object.keys(CH).length; return all?t("qzAllT"):`${pSel.size} ${t("qzSome")}`; }
renderPractice=function(){ if(!pSel) pSel=new Set(Object.keys(CH)); const C=coach();
  const n=BANK.filter(b=>pSel.has(b.c)&&lvOk(b)).length;
  const seg=[10,20,30,50,0].map(k=>`<button type="button" class="qzseg${qzN===k?" on":""}" data-qzn="${k}">${k||esc(t("qzAll"))}</button>`).join("");
  const groups=GROUPS.map(g=>{ const allOn=g.c.every(c=>pSel.has(c)); return `<div class="qzg"><div class="qzgh"><h3>${esc(g.n[lang])}</h3><button type="button" class="qzgt${allOn?" on":""}" data-qzg="${g.k}">${allOn?"✓ ":""}${esc(t("qzGroup"))}</button></div><div class="qzchips">${g.c.map(c=>{ const x=C.ch[c], p=x&&x.n?x.m/x.n:0;
    return `<label class="qzc${pSel.has(c)?" on":""}"><input type="checkbox" data-ch="${c}" ${pSel.has(c)?"checked":""}><span class="qzcn">${esc(chName(c))}</span><span class="qzcb"><i style="width:${Math.round(p*100)}%"></i></span><span class="qzcp">${Math.round(p*100)}%</span></label>`; }).join("")}</div></div>`; }).join("");
  return `<section class="view qz">
   <div class="qzhero"><div class="qzhtx"><small>${esc(t("qzKick"))}</small><h1>${esc(t("qzTitle"))}</h1></div>${gfree("n32",96)}
    <p class="qzlab">${esc(t("qzHow"))}</p><div class="qzsegs">${seg}</div>
    <select id="p-count" hidden>${[10,20,30,50].map(k=>`<option ${qzN===k?"selected":""}>${k}</option>`).join("")}<option value="0" ${qzN===0?"selected":""}>${t("all")} (${n})</option></select>
    <button type="button" class="qzgo" id="p-start" ${n?"":"disabled"}>${esc(t("qzGo"))} ▸</button>
    <p class="qzstate" id="qzstate">${esc(qzStateTxt())}</p><p class="qzmsg"><span id="qztop">${esc(qzLabel())}</span> · <span id="p-msg">${n?`${n} questions · ${pSel.size} ${t("exItems")}`:t("noneSel")}</span></p></div>
   <details class="qzopts"><summary>${esc(t("qzOpts"))}</summary><div class="qzorow"><label>${t("lvl")} <select id="p-lvl"><option value="a" ${pLvl==="a"?"selected":""}>${t("lvAll")}</option><option value="h" ${pLvl==="h"?"selected":""}>${t("lvHard")}</option><option value="b" ${pLvl==="b"?"selected":""}>${t("lvBase")}</option><option value="t" ${pLvl==="t"?"selected":""}>${t("lvTrap")}</option></select></label><input type="checkbox" id="p-new" checked hidden></div></details>
   <div class="qztopics"><div class="qzth"><div><h2>${esc(t("qzTopics"))}</h2><p>${esc(t("qzTopicsH"))}</p></div><div class="qzbtns"><button type="button" class="qzsm" id="sel-all">${t("all")}</button><button type="button" class="qzsm" id="sel-none">${t("none")}</button></div></div>${groups}</div>
  </section>`; };
document.addEventListener("click",e=>{ if(view!=="practice") return;
  const s=e.target.closest&&e.target.closest("[data-qzn]"); if(s){ qzN=+s.dataset.qzn; try{ localStorage.setItem("wset3-qzn",qzN); }catch(_){} const sel=document.getElementById("p-count"); if(sel) sel.value=String(qzN); document.querySelectorAll(".qzseg").forEach(b=>b.classList.toggle("on",b===s)); return; }
  const g=e.target.closest&&e.target.closest("[data-qzg]"); if(g){ const G=GROUPS.find(x=>x.k===g.dataset.qzg); const allOn=G.c.every(c=>pSel.has(c)); G.c.forEach(c=>allOn?pSel.delete(c):pSel.add(c)); render(); } });
document.addEventListener("change",e=>{ if(view!=="practice"||!e.target.dataset||!e.target.dataset.ch) return; const l=e.target.closest(".qzc"); if(l) l.classList.toggle("on",e.target.checked);
  const tp=document.getElementById("qztop"); if(tp) setTimeout(()=>{ tp.textContent=qzLabel(); const qs=document.getElementById("qzstate"); if(qs) qs.textContent=qzStateTxt(); document.querySelectorAll("[data-qzg]").forEach(b=>{ const G=GROUPS.find(x=>x.k===b.dataset.qzg), on=G.c.every(c=>pSel.has(c)); b.classList.toggle("on",on); b.textContent=(on?"✓ ":"")+t("qzGroup"); }); },0); });
try{ const st4=document.createElement("style"); st4.textContent=`
.qz{display:flex;flex-direction:column;gap:14px}
.qzhero{position:relative;overflow:hidden;border-radius:24px;padding:20px 18px 18px;color:#fff;background:radial-gradient(90% 120% at 100% 0%,rgba(255,111,145,.45),transparent 55%),radial-gradient(130% 120% at 0% 0%,#a3264f 0%,#6e1630 45%,#2c0814 100%);box-shadow:0 6px 0 #2a0614,0 14px 30px rgba(110,22,48,.3);display:grid;grid-template-columns:1fr auto;align-items:start;gap:4px 10px}
.qzhero>*{grid-column:1/-1}.qzhero .qzhtx{grid-column:1}.qzhero>.gfree,.qzhero>img,.qzhero>svg,.qzhero>span:not(.qzsegs){grid-column:2;grid-row:1}
.qzhtx small{font-size:.68rem;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#ffd27a}
.qzhtx h1{margin:4px 0 0;font-family:var(--f-display);font-size:clamp(1.6rem,6vw,2.2rem);line-height:1.08;color:#fff}
.qzlab{margin:10px 0 2px;font-weight:700;font-size:.9rem;opacity:.92}
.qzsegs{display:flex;gap:6px;flex-wrap:wrap}
.qzseg{flex:1;min-width:52px;border:0;border-radius:14px;padding:12px 0;font:800 1.05rem var(--f-body,inherit);background:rgba(255,255,255,.14);color:#fff;cursor:pointer;box-shadow:inset 0 0 0 1px rgba(255,255,255,.25);transition:transform .1s}
.qzseg.on{background:#fff;color:#6e1630;box-shadow:0 4px 0 rgba(0,0,0,.25)}.qzseg:active{transform:translateY(2px)}
.qzgo{margin-top:12px;border:0;border-radius:16px;padding:16px;font:900 1.1rem var(--f-body,inherit);letter-spacing:.04em;background:linear-gradient(135deg,#ffe3a1,#d4a23a);color:#3a0a1e;box-shadow:0 5px 0 #8a6420;cursor:pointer}
.qzgo:active{transform:translateY(3px);box-shadow:0 2px 0 #8a6420}.qzgo:disabled{opacity:.5}
.qzstate{margin:10px 0 0;text-align:center;font-weight:800;font-size:.86rem;color:#ffe3a1}.qzmsg{margin:4px 0 0;font-size:.8rem;opacity:.85;text-align:center}
.qzopts{border-radius:16px;background:var(--surface,#fff);box-shadow:0 1px 0 rgba(0,0,0,.06);border:1px solid var(--line,#eadfce);padding:10px 14px}
.qzopts summary{cursor:pointer;font-weight:800}.qzorow{display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin-top:10px}.qzorow select{border-radius:10px;padding:6px 8px}
.qztopics{border-radius:20px;background:var(--surface,#fff);border:1px solid var(--line,#eadfce);padding:16px 14px}
.qzth{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}.qzth h2{margin:0;font-family:var(--f-display)}.qzth p{margin:4px 0 0;font-size:.84rem;color:var(--muted,#7b6a5c)}
.qzbtns{display:flex;gap:6px;flex:none}.qzsm{border:1px solid color-mix(in srgb,#a3264f 40%,transparent);background:transparent;color:inherit;border-radius:999px;padding:6px 12px;font-weight:700;cursor:pointer}
.qzg{margin-top:16px}.qzgh{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px}.qzgh h3{margin:0;font-size:.95rem;color:#a3264f}
.qzgt{border:0;background:transparent;color:var(--muted,#7b6a5c);font-size:.78rem;font-weight:700;cursor:pointer}.qzgt.on{color:#a3264f}
.qzchips{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}
.qzc{position:relative;display:grid;grid-template-columns:1fr auto;gap:4px 8px;align-items:center;padding:10px 12px;border-radius:14px;border:1.5px solid var(--line,#eadfce);cursor:pointer;background:var(--bg,transparent);transition:background .15s,border-color .15s}
.qzc input{position:absolute;opacity:0;pointer-events:none}
.qzc.on{border-color:#a3264f;background:color-mix(in srgb,#a3264f 9%,transparent)}
.qzc.on::after{content:"✓";position:absolute;top:-7px;right:-7px;width:18px;height:18px;border-radius:50%;background:#a3264f;color:#fff;font-size:.7rem;display:grid;place-items:center;font-weight:900}
.qzcn{font-weight:700;font-size:.86rem;line-height:1.2;grid-column:1/-1}
.qzcb{height:5px;border-radius:3px;background:color-mix(in srgb,#a3264f 14%,transparent);overflow:hidden}.qzcb i{display:block;height:100%;background:linear-gradient(90deg,#d4a23a,#5f9a2e)}
.qzcp{font-size:.7rem;font-weight:700;color:var(--muted,#7b6a5c)}
.qzc:focus-within{outline:2px solid #d4a23a;outline-offset:2px}
`; document.head.appendChild(st4); }catch(e){}

Object.assign(T.it,{tab_study:"Esame",wsTitle:"Il tuo esame"}); Object.assign(T.fr,{tab_study:"Examen",wsTitle:"Ton examen"}); Object.assign(T.en,{tab_study:"Exam",wsTitle:"Your exam"});

/* ---------- v62: watched badge + count ---------- */
Object.assign(T.it,{seen1:"Visto 1 volta",seenN:"Visto {n} volte",notSeen:"Da vedere"});
Object.assign(T.fr,{seen1:"Vu 1 fois",seenN:"Vu {n} fois",notSeen:"À voir"});
Object.assign(T.en,{seen1:"Watched once",seenN:"Watched {n} times",notSeen:"Not watched yet"});
function flSeenN(f){ const v=(MT.films||{})[f.id]; return v?(+v||1):0; }
function flSeenTxt(n){ return n===1?t("seen1"):t("seenN").replace("{n}",n); }
try{ const st5=document.createElement("style"); st5.textContent=`
.flseen{position:absolute;top:8px;left:8px;z-index:2;display:inline-flex;align-items:center;gap:4px;background:#2e7d4f;color:#fff;font:800 .72rem var(--f-body,inherit);padding:4px 9px;border-radius:999px;box-shadow:0 2px 6px rgba(0,0,0,.3)}
.flcard.isseen .flthumb{opacity:.92}.flcard.isseen .fltx b::after{content:"";}
.fltx .flseenl{color:#2e7d4f;font-weight:800}.fltx .flnot{color:var(--muted,#8a7a6a)}
.ytseen{background:#2e7d4f!important;color:#fff!important;border-color:#2e7d4f!important}
[data-theme="dark"] .fltx .flseenl{color:#7fd39b}@media (prefers-color-scheme: dark){:root:not([data-theme="light"]) .fltx .flseenl{color:#7fd39b}}
`; document.head.appendChild(st5); }catch(e){}

/* ---------- v63: flashcards for the whole programme (Leitner boxes, flip cards) ---------- */
Object.assign(T.it,{tr_flash:"Flashcard",trd_flash:"Tutto il materiale in carte da girare: domande, termini, cifre e vitigni. Ripeti più spesso quelle che non sai.",fcCards:"carte",fcKick:"Flashcard",fcTitle:"Ripassa con le carte",fcHow:"Quante carte?",fcGo:"Inizia",fcTypes:"Tipi di carte",fcTopics:"Argomenti",fcTopicsH:"Facoltativo: di base c'è tutto il programma.",fcQ:"Domande",fcD:"Termini",fcN:"Cifre",fcG:"Vitigni",fcFlip:"Tocca la carta per girarla",fcShow:"Mostra la risposta",fcNo:"Da ripassare",fcYes:"La sapevo",fcDone:"Sessione finita!",fcKnown:"sapute",fcAgain:"da ripassare",fcRestart:"Nuova sessione",fcRetry:"Ripassa le sbagliate",fcBack:"Torna alle flashcard",fcMast:"carte imparate",fcNew:"nuove",fcLearn:"in corso",fcAll:"Tutti"});
Object.assign(T.fr,{tr_flash:"Flashcards",trd_flash:"Toute la matière en cartes à retourner : questions, termes, chiffres et cépages. Revoyez plus souvent celles que vous ne savez pas.",fcCards:"cartes",fcKick:"Flashcards",fcTitle:"Réviser avec les cartes",fcHow:"Combien de cartes ?",fcGo:"Commencer",fcTypes:"Types de cartes",fcTopics:"Thèmes",fcTopicsH:"Facultatif : par défaut, tout le programme.",fcQ:"Questions",fcD:"Termes",fcN:"Chiffres",fcG:"Cépages",fcFlip:"Touchez la carte pour la retourner",fcShow:"Voir la réponse",fcNo:"À revoir",fcYes:"Je savais",fcDone:"Session terminée !",fcKnown:"sues",fcAgain:"à revoir",fcRestart:"Nouvelle session",fcRetry:"Revoir les ratées",fcBack:"Retour aux flashcards",fcMast:"cartes apprises",fcNew:"nouvelles",fcLearn:"en cours",fcAll:"Tous"});
Object.assign(T.en,{tr_flash:"Flashcards",trd_flash:"Everything to learn as flip cards: questions, terms, figures and grapes. The ones you miss come back more often.",fcCards:"cards",fcKick:"Flashcards",fcTitle:"Revise with cards",fcHow:"How many cards?",fcGo:"Start",fcTypes:"Card types",fcTopics:"Topics",fcTopicsH:"Optional: by default, the whole syllabus.",fcQ:"Questions",fcD:"Terms",fcN:"Figures",fcG:"Grapes",fcFlip:"Tap the card to flip it",fcShow:"Show answer",fcNo:"Review again",fcYes:"I knew it",fcDone:"Session complete!",fcKnown:"known",fcAgain:"to review",fcRestart:"New session",fcRetry:"Review the missed ones",fcBack:"Back to flashcards",fcMast:"cards learnt",fcNew:"new",fcLearn:"learning",fcAll:"All"});
try{ TABG.flash="wine"; SUBV.flash="wine"; SUBT.flash="tr_flash"; }catch(e){}
const FCT=[["tas",I3("Degustazione e servizio","Dégustation et service","Tasting and service"),["deg","cib","srv"],["deg"],[]],
 ["vig",I3("Vigna e ambiente","Vigne et environnement","Vineyard and environment"),["vig","env","vgm"],["vig"],["vig"]],
 ["win",I3("Cantina","Chai","Winemaking"),["vin","wht","red","prx"],["vin","ele","lab"],["vin"]],
 ["fra",I3("Francia","France","France"),["bdx","bgn","als","rho","sfr"],[],["bdx","bgn","rho","loi"]],
 ["eur",I3("Resto d'Europa","Reste de l'Europe","Rest of Europe"),["ger","aut","gre","ita","esp","por"],[],["ita","esp","ger"]],
 ["nw",I3("Nuovo Mondo","Nouveau Monde","New World"),["usa","chi","rsa","aus"],[],["nw"]],
 ["spu",I3("Spumanti","Effervescents","Sparkling wines"),["spu"],["eff"],["spu"]],
 ["mut",I3("Vini fortificati","Vins mutés","Fortified wines"),["she","prt"],["mut"],["she"]]];
let FCC=null;
function fcAll(){ if(FCC) return FCC; const out=[], tpOf=(arr,k)=>(FCT.find(x=>x[arr].includes(k))||[])[0]||"tas";
  BANK.forEach(b=>out.push({id:"q"+b.id,k:"q",tp:tpOf(2,b.c),b}));
  DICT.forEach((d,i)=>out.push({id:"d"+i,k:"d",tp:tpOf(3,d[0]),d}));
  NUMS.forEach(s=>s[2].forEach((x,j)=>out.push({id:"n"+s[0]+j,k:"n",tp:tpOf(4,s[0]),x,sec:s[1]})));
  GRAPES.forEach(g=>out.push({id:"g"+g.k,k:"g",tp:"grp",g}));
  return FCC=out; }
let FCS=(()=>{ try{ return JSON.parse(localStorage.getItem("wset3-fc")||"{}")||{}; }catch(e){ return {}; } })();
const fcSave=()=>{ try{ localStorage.setItem("wset3-fc",JSON.stringify(FCS)); }catch(e){} };
let fcN=(()=>{ try{ return +localStorage.getItem("wset3-fcn")||20; }catch(e){ return 20; } })();
let fcK=new Set(["q","d","n","g"]), fcTp=null, FCX=null;
function fcPool(){ if(!fcTp) fcTp=new Set(FCT.map(x=>x[0]).concat(["grp"])); return fcAll().filter(c=>fcK.has(c.k)&&fcTp.has(c.k==="g"?"grp":c.tp)); }
function fcStart(ids){ const pool=fcPool(); let list;
  if(ids) list=fcAll().filter(c=>ids.includes(c.id));
  else { const sh=a=>a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(x=>x[1]); const by=[0,1,2,3,4,5].map(b=>sh(pool.filter(c=>(FCS[c.id]||0)===b))); list=[].concat(...by); if(fcN) list=list.slice(0,fcN); list=sh(list); }
  FCX={list,i:0,flip:false,ok:[],no:[]}; render(); window.scrollTo(0,0); }
function fcFront(c){ const l=L(), P=`<span class="fcpic">${fcPic(c)}</span>`;
  if(c.k==="q") return P+`<span class="fck">${esc(chName(c.b.c))}</span><p class="fcq">${esc(c.b.q[l])}</p>`;
  if(c.k==="d") return P+`<span class="fck">${esc(t("fcD"))}</span><p class="fcterm">${esc(c.d[2])}</p>${l!==1?`<p class="fcsub">${esc(c.d[1+l])}</p>`:""}`;
  if(c.k==="n") return P+`<span class="fck">${esc(tx(c.sec))}</span><p class="fcq">${esc(c.x[1][l])}</p><p class="fcsub">?</p>`;
  return P+`<span class="fck">${esc(t("fcG"))}</span><p class="fcterm"><i class="fcdot ${c.g.c==="w"?"w":"r"}"></i>${esc(c.g.k)}</p>${c.g.syn&&c.g.syn.length?`<p class="fcsub">${esc(c.g.syn.join(" · "))}</p>`:""}`; }
function fcBackS(c){ const l=L();
  if(c.k==="q"){ const e=c.b.e?c.b.e[l]:(c.b.d?c.b.d[l]:""); return `<p class="fcans">${esc(c.b.o[0][l])}</p>${e?`<p class="fcexp">${typeof kwMark==="function"?kwMark(e):esc(e)}</p>`:""}`; }
  if(c.k==="d") return `${l!==1?`<p class="fcans">${esc(c.d[1+l])}</p>`:`<p class="fcans">${esc(c.d[2])}</p>`}<p class="fcexp">${esc(c.d[4+l])}</p>`;
  if(c.k==="n") return `<p class="fcbig">${esc(c.x[0][l])}</p>${c.x[2]?`<p class="fcexp">${esc(c.x[2][l])}</p>`:""}`;
  const g=c.g; return `<p class="fcans">${esc(tx(g.sig||g.tr||""))}</p>${g.tr?`<p class="fcexp"><b>${esc(tx(g.tr))}</b></p>`:""}${g.cl?`<p class="fcexp">${esc(tx(g.cl))}</p>`:""}${g.reg&&g.reg.length?`<p class="fcexp fcreg">${g.reg.slice(0,6).map(r=>`<span>${esc(typeof mName==="function"?mName(r):r)}</span>`).join("")}</p>`:""}`; }
function renderFlash(){
  if(FCX&&FCX.i<FCX.list.length){ const c=FCX.list[FCX.i], n=FCX.list.length, b=FCS[c.id]||0;
    return `<section class="view fc"><div class="fctop"><span>${FCX.i+1} / ${n}</span><div class="fcbar"><i style="width:${Math.round(FCX.i/n*100)}%"></i></div><button type="button" class="fcx" data-fc="quit" aria-label="×">×</button></div>
     <div class="fcstage"><button type="button" class="fccard${FCX.flip?" flip":""}" data-fc="flip" aria-label="${esc(t("fcFlip"))}"><span class="fcin"><span class="fcface fcf">${fcFront(c)}<span class="fchint">${esc(t("fcFlip"))} ↻</span></span><span class="fcface fcb"><span class="fcpic sm">${fcPic(c)}</span>${fcBackS(c)}</span></span></button></div>
     <div class="fcboxes">${[0,1,2,3,4].map(k=>`<i class="${k<=b-1?"on":""}"></i>`).join("")}</div>
     ${FCX.flip?`<div class="fcact"><button type="button" class="fcno" data-fc="no">✗ ${esc(t("fcNo"))}</button><button type="button" class="fcyes" data-fc="yes">✓ ${esc(t("fcYes"))}</button></div>`:`<div class="fcact"><button type="button" class="fcshow" data-fc="flip">${esc(t("fcShow"))}</button></div>`}
    </section>`; }
  if(FCX){ return `<section class="view fc"><div class="fcend">${gfree("n04",140)}<h2>${esc(t("fcDone"))}</h2><div class="fcres"><div><b class="ok">${FCX.ok.length}</b><span>${esc(t("fcKnown"))}</span></div><div><b class="no">${FCX.no.length}</b><span>${esc(t("fcAgain"))}</span></div></div>
     <div class="fcendb">${FCX.no.length?`<button type="button" class="qzgo" data-fc="retry">${esc(t("fcRetry"))} (${FCX.no.length})</button>`:""}<button type="button" class="qzgo alt" data-fc="new">${esc(t("fcRestart"))}</button><button type="button" class="qzsm" data-fc="home">${esc(t("fcBack"))}</button></div></div></section>`; }
  const all=fcAll(), pool=fcPool(), mast=all.filter(c=>(FCS[c.id]||0)>=3).length, lrn=all.filter(c=>{ const v=FCS[c.id]||0; return v>0&&v<3; }).length;
  if(!fcTp) fcTp=new Set(FCT.map(x=>x[0]).concat(["grp"]));
  const seg=[10,20,30,50,0].map(k=>`<button type="button" class="qzseg${fcN===k?" on":""}" data-fcn="${k}">${k||esc(t("fcAll"))}</button>`).join("");
  const types=[["q","fcQ"],["d","fcD"],["n","fcN"],["g","fcG"]].map(([k,lab])=>`<button type="button" class="fct${fcK.has(k)?" on":""}" data-fck="${k}">${esc(t(lab))} <small>${all.filter(c=>c.k===k).length}</small></button>`).join("");
  const tps=FCT.map(x=>[x[0],tx(x[1])]).concat([["grp",t("fcG")]]).map(([k,lab])=>`<button type="button" class="fct${fcTp.has(k)?" on":""}" data-fctp="${k}">${esc(lab)}</button>`).join("");
  return `<section class="view qz fcset">
   <div class="qzhero"><div class="qzhtx"><small>${esc(t("fcKick"))}</small><h1>${esc(t("fcTitle"))}</h1></div>${gfree("n11",96)}
    <div class="fcstats"><span><b>${mast}</b> ${esc(t("fcMast"))}</span><span><b>${lrn}</b> ${esc(t("fcLearn"))}</span><span><b>${all.length-mast-lrn}</b> ${esc(t("fcNew"))}</span></div>
    <p class="qzlab">${esc(t("fcHow"))}</p><div class="qzsegs">${seg}</div>
    <button type="button" class="qzgo" data-fc="start" ${pool.length?"":"disabled"}>${esc(t("fcGo"))} ▸</button>
    <p class="qzmsg">${pool.length} ${esc(t("fcCards"))}</p></div>
   <div class="qztopics"><h2>${esc(t("fcTypes"))}</h2><div class="fctypes">${types}</div>
    <h2 style="margin-top:18px">${esc(t("fcTopics"))}</h2><p class="fcth">${esc(t("fcTopicsH"))}</p><div class="fctypes">${tps}</div></div>
  </section>`; }
function fcActs(){ return FCX.flip?`<button type="button" class="fcno" data-fc="no">✗ ${esc(t("fcNo"))}</button><button type="button" class="fcyes" data-fc="yes">✓ ${esc(t("fcYes"))}</button>`:`<button type="button" class="fcshow" data-fc="flip">${esc(t("fcShow"))}</button>`; }
function fcFlip(){ FCX.flip=!FCX.flip; const cd=document.querySelector(".fccard"), ac=document.querySelector(".fcact"); if(cd&&ac){ cd.classList.toggle("flip",FCX.flip); ac.innerHTML=fcActs(); } else render(); }
function fcMark(ok){ const c=FCX.list[FCX.i]; const b=FCS[c.id]||0; FCS[c.id]=ok?Math.min(5,b+1):0; fcSave(); (ok?FCX.ok:FCX.no).push(c.id); FCX.i++; FCX.flip=false; render(); }
document.addEventListener("click",e=>{ if(view!=="flash") return; const el=e.target.closest&&e.target.closest("[data-fc],[data-fcn],[data-fck],[data-fctp]"); if(!el) return; e.preventDefault();
  if(el.dataset.fcn!==undefined){ fcN=+el.dataset.fcn; try{ localStorage.setItem("wset3-fcn",fcN); }catch(_){} render(); return; }
  if(el.dataset.fck){ const k=el.dataset.fck; fcK.has(k)?fcK.delete(k):fcK.add(k); if(!fcK.size) fcK.add(k); render(); return; }
  if(el.dataset.fctp){ const k=el.dataset.fctp; fcTp.has(k)?fcTp.delete(k):fcTp.add(k); if(!fcTp.size) fcTp.add(k); render(); return; }
  const a=el.dataset.fc;
  if(a==="start") fcStart(); else if(a==="flip") fcFlip();
  else if(a==="yes") fcMark(true); else if(a==="no") fcMark(false);
  else if(a==="retry") fcStart(FCX.no.slice()); else if(a==="new") fcStart(); else if(a==="quit"||a==="home"){ FCX=null; render(); } });
document.addEventListener("keydown",e=>{ if(view!=="flash"||!FCX||FCX.i>=FCX.list.length) return; if(e.key===" "){ e.preventDefault(); fcFlip(); } else if(FCX.flip&&(e.key==="ArrowRight"||e.key==="1")) fcMark(true); else if(FCX.flip&&(e.key==="ArrowLeft"||e.key==="0")) fcMark(false); });
try{ const st6=document.createElement("style"); st6.textContent=`
.rv-flash{--bg:radial-gradient(120% 120% at 100% 0%,#f4b860 0%,transparent 45%),linear-gradient(135deg,#5a1436,#8c1d40 55%,#c2185b);--sh:#3a0a22}
.fcstats{display:flex;gap:14px;flex-wrap:wrap;font-size:.8rem;margin-top:6px}.fcstats b{font-size:1.1rem;color:#ffe3a1}
.fctypes{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
.fct{border:1.5px solid var(--line,#eadfce);background:transparent;color:inherit;border-radius:999px;padding:8px 14px;font-weight:700;cursor:pointer}
.fct small{opacity:.6;font-weight:600;margin-left:2px}.fct.on{border-color:#a3264f;background:color-mix(in srgb,#a3264f 12%,transparent);color:#a3264f}
[data-theme="dark"] .fct.on{color:#ff9fb6}@media (prefers-color-scheme: dark){:root:not([data-theme="light"]) .fct.on{color:#ff9fb6}}
.fcth{margin:4px 0 0;font-size:.84rem;color:var(--muted,#7b6a5c)}
.fc{display:flex;flex-direction:column;gap:14px}
.fctop{display:flex;align-items:center;gap:10px;font-weight:800;font-size:.85rem}.fcbar{flex:1;height:8px;border-radius:4px;background:color-mix(in srgb,#a3264f 15%,transparent);overflow:hidden}.fcbar i{display:block;height:100%;background:linear-gradient(90deg,#c2185b,#d4a23a);transition:width .3s}
.fcx{border:0;background:transparent;font-size:1.6rem;line-height:1;cursor:pointer;color:inherit}
.fcstage{perspective:1400px}
.fccard{all:unset;display:block;width:100%;min-height:min(62vh,440px);cursor:pointer;box-sizing:border-box}
.fcin{position:relative;display:block;width:100%;min-height:inherit;transition:transform .55s cubic-bezier(.2,.8,.2,1);transform-style:preserve-3d}
.fccard.flip .fcin{transform:rotateY(180deg)}
.fcface{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:24px;padding:26px 22px;display:flex;flex-direction:column;justify-content:center;gap:12px;box-sizing:border-box;overflow:auto}
.fcf{background:radial-gradient(120% 100% at 100% 0%,rgba(255,111,145,.35),transparent 55%),linear-gradient(150deg,#6e1630,#3a0a1e);color:#fff;box-shadow:0 6px 0 #2a0614,0 16px 34px rgba(110,22,48,.3)}
.fcb{transform:rotateY(180deg);background:var(--surface,#fffaf2);border:2px solid #d4a23a;color:var(--fg,#2a1418);box-shadow:0 6px 0 #b8913f,0 16px 34px rgba(60,20,20,.2)}
.fck{font-size:.7rem;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:#ffd27a}
.fcq{margin:0;font-family:var(--f-display);font-size:clamp(1.25rem,4.6vw,1.7rem);line-height:1.3}
.fcterm{margin:0;font-family:var(--f-display);font-size:clamp(1.8rem,7vw,2.6rem);line-height:1.1;display:flex;align-items:center;gap:12px}
.fcsub{margin:0;font-size:1rem;opacity:.85}
.fcdot{width:18px;height:18px;border-radius:50%;flex:none;border:2px solid #fff}.fcdot.w{background:#e8d36a}.fcdot.r{background:#7a1f52}
.fchint{margin-top:auto;font-size:.78rem;opacity:.7;text-align:center}
.fcans{margin:0;font-family:var(--f-display);font-size:clamp(1.2rem,4.4vw,1.55rem);line-height:1.3;color:#8c1d40}
[data-theme="dark"] .fcans{color:#ff9fb6}@media (prefers-color-scheme: dark){:root:not([data-theme="light"]) .fcans{color:#ff9fb6}}
.fcbig{margin:0;font-family:var(--f-display);font-size:clamp(2.2rem,9vw,3.4rem);line-height:1;color:#8c1d40}
.fcexp{margin:0;font-size:.95rem;line-height:1.5}
.fcexp b.kw{font-weight:800}
.fcreg{display:flex;flex-wrap:wrap;gap:6px}.fcreg span{background:color-mix(in srgb,#13857f 14%,transparent);border-radius:999px;padding:3px 10px;font-size:.8rem;font-weight:700}
.fcboxes{display:flex;justify-content:center;gap:6px}.fcboxes i{width:26px;height:6px;border-radius:3px;background:color-mix(in srgb,#a3264f 15%,transparent)}.fcboxes i.on{background:#5f9a2e}
.fcact{display:flex;gap:10px}
.fcact button{flex:1;border:0;border-radius:16px;padding:16px;font:900 1rem var(--f-body,inherit);cursor:pointer}
.fcshow{background:linear-gradient(135deg,#ffe3a1,#d4a23a);color:#3a0a1e;box-shadow:0 5px 0 #8a6420}
.fcno{background:#fbe1e4;color:#a8243a;box-shadow:0 5px 0 #e3a3ad}.fcyes{background:#2e7d4f;color:#fff;box-shadow:0 5px 0 #1d5233}
.fcact button:active{transform:translateY(3px);box-shadow:none}
.fcend{display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center;padding:10px 0}
.fcres{display:flex;gap:30px}.fcres div{display:flex;flex-direction:column}.fcres b{font-family:var(--f-display);font-size:2.4rem}.fcres b.ok{color:#2e7d4f}.fcres b.no{color:#a8243a}
.fcendb{display:flex;flex-direction:column;gap:10px;width:100%;max-width:420px}.qzgo.alt{background:linear-gradient(135deg,#c2185b,#6e1630);color:#fff;box-shadow:0 5px 0 #3a0a1e}
`; document.head.appendChild(st6); }catch(e){}

/* ---------- v64: memory drawings for every flashcard ---------- */
const FCPICC=new Map();
const FCSC={
 botr:()=>fSvg(`${xBunch(110,70,1.7,"#b8a050")}${xBotry(200,110,30)}`,"dusk"),
 sherry:()=>fSvg(`${xButt(160,125,1.25)}`),
 port:()=>fSvg(`${fBottle(110,175,{col:"#2a0a12"})}${fGlass(205,150,"#5a1020",1.3)}`),
 spark:()=>fSvg(`${fFlute(125,160,"#f0e08a",1.7)}${fFlute(195,160,"#f6c8c8",1.7)}`),
 riddle:()=>fSvg(`${xPupitre(160,160,30)}`),
 carb:()=>fSvg(`${xBunch(140,90,1.5)}${xCO2(150,52,130,5)}`),
 mlf:()=>fSvg(`<g transform="translate(160 110) scale(2) translate(-160 -110)">${xBact(130,100,0)}${xBact(175,120,.4)}${xBact(200,92,.8)}</g>`),
 ferm:()=>fSvg(`${fTank(110,36,90,140,{col:"#7a1530",lv:.7,bub:8})}${[[240,90],[262,122],[236,140]].map(([x,y])=>`<g transform="translate(${x} ${y}) scale(2.2) translate(${-x} ${-y})">${fYeast(x,y)}</g>`).join("")}`),
 oak:()=>fSvg(`${fBarrel(160,125,1.35)}`),
 press:()=>fSvg(`${fPress(90,56,"#e8d36a","#8a7a3a")}`),
 frost:()=>fSvg(`${fVine("winter",0)}${fSnow()}`,"night"),
 rain:()=>fSvg(`${fCloud(110,46,1.3,"#cfd8e0")}${fDrops(110,66,170,"#6fa8dc",9)}${fVine("summer",0)}`,"spring"),
 sun:()=>fSvg(`${fSun(80,58,28)}${fThermo(232,40,"30 °C",.8,"#c0263f")}${fVine("summer",0)}`,"summer"),
 soil:()=>fSvg(`${fSoil(40,70,240,120,[{f:.25,c:"#6b4a2e"},{f:.35,c:"#c9b38a"},{f:.4,c:"#e8e2d0"}])}${fRoots(160,78)}`,"spring"),
 vine:()=>fSvg(`${fVine("summer",0)}`,"spring"),
 harv:()=>fSvg(`${xHod(120,150,1.5)}${xBunch(205,95,1.2)}`,"dusk"),
 pest:()=>fSvg(`${fRoots(160,80,1)}${[[120,110],[205,128],[165,152],[245,95]].map(([x,y])=>`<g transform="translate(${x} ${y}) scale(3.2) translate(${-x} ${-y})">${fBug(x,y,"#3a2a1a")}</g>`).join("")}`,"spring"),
 taste:()=>fSvg(`${fStemGlass(125,165,"red","#7a1530")}${fStemGlass(200,165,"white","#f0e08a")}`),
 food:()=>fSvg(`${xPlate(135,125,"",1.5)}${fGlass(245,150,"#7a1530",1.1)}`),
 serve:()=>fSvg(`${fDecanter(140,160,"#7a1530")}${fClosure("cork",240,130)}`),
 label:()=>fSvg(`<g transform="translate(160 185) scale(2.1) translate(-160 -185)">${fBottle(160,185,{col:"#2d4a2a"})}</g>`),
 mol:()=>fSvg(`${xMol(120,100,"SO₂","#d4a23a")}${xMol(205,100,"O₂","#3b7fa8")}`),
 sweet:()=>fSvg(`${xRack(70,110,180,1)}`,"summer"),
 rose:()=>fSvg(`${fGlass(160,150,"#f2a0a8",1.7)}`),
 fort:()=>fSvg(`${xStill(160,150)}`),
 clock:()=>fSvg(`${fBarrel(110,130,1)}${fClock(230,90,"")}`),
 white:()=>fSvg(`${fGlass(160,150,"#f0e08a",1.7)}`),
 red:()=>fSvg(`${fGlass(160,150,"#7a1530",1.7)}`)};
const FCRX=[["botr",/noble rot|botryti|Sauternes|Tokaj|Aszú|Beerenauslese|Trockenbeer|SGN|S[ée]lection de Grains/i],["sherry",/\bflor\b|sherry|fino|manzanilla|solera|criadera|amontillado|oloroso|palo cortado|Jerez/i],["port",/\bport\b|tawny|\bruby\b|LBV|colheita|Douro|Madeira|Banyuls|Rutherglen/i],["riddle",/riddl|remuage|pupitre|gyropalette|disgorg/i],["spark",/sparkling|champagne|cava\b|prosecco|crémant|cremant|sekt|bubbles|autolys|dosage|liqueur de|tank method|transfer method|asti/i],["carb",/carbonic|carbonique|whole[- ]bunch/i],["mlf",/malolactic|lactic|diacetyl|bacteria/i],["fort",/fortif|spirit|mutage|mutation|vin doux naturel|grape spirit/i],["botr",/ice ?wine|eiswein/i],["sweet",/dried grapes|passito|appassim|raisin|straw|vin santo|recioto|amarone|late harvest|vendanges tardives|residual sugar|sweet/i],["rose",/ros[ée]\b|saign/i],["mol",/sulfur|sulphur|SO2|oxygen|oxidat|reduct|anaerob/i],["oak",/\boak|barrel|barrique|vanilla|cask|toast|chêne|wood/i],["press",/press|free[- ]run|crush/i],["ferm",/yeast|ferment|chaptal|acidif|enrich|stainless|tank|vat/i],["pest",/phylloxer|mildew|oidium|botrytis bunch|pest|disease|virus|nematod|insect|bird/i],["frost",/frost|winter|cold|freez/i],["rain",/rain|water|irrigat|humid|drought|hail|fog|mist/i],["sun",/sun|heat|warm|hot\b|temperature|ripen|degree days|latitude|altitude|climate|continental|maritime|mediterranean/i],["soil",/soil|limestone|chalk|granite|slate|schist|gravel|clay|sand|volcan|drain|loess|marl/i],["harv",/harvest|picking|pick\b|machine/i],["vine",/prun|cordon|guyot|trellis|canopy|training|spur|cane|vine|shoot|bud|flower|veraison|clone|rootstock|graft|vineyard|density|yield/i],["food",/food|pairing|dish|cheese|salt|umami|sweetness in food|chilli|fish|meat/i],["serve",/serv|decant|storage|store|closure|cork|screwcap|glassware|temperature to serve|sommelier/i],["taste",/tast|SAT|nose|palate|aroma|acidity|tannin|body|finish|colour|appearance|intensity|quality/i],["label",/label|appellation|PDO|PGI|AOC|AOP|DOCG|DOC\b|IGT|IGP|AVA|classif|grand cru|premier cru|cru\b|law|regulation|Prädikat|VDP|DAC/i],["clock",/age|ageing|aging|matur|years|months/i]];
let FCMI=null;
function fcMapIdx(){ if(FCMI) return FCMI; const stop=new Set(["Orange","Southern","Central Valley","Coastal Region","Northern Cape","Western Cape","Victoria","Washington","Ontario","Sonoma","Napa","Melon","Village","Bourg"]); const m=new Map();
  MAPS.forEach(mp=>mp.it.forEach((x,i)=>{ if(x[0]!=="w"||x[1].length<4||stop.has(x[1])) return; const k=x[1]; const prev=m.get(k); const sc=(MGEO[mp.id]?1:0)*(mp.sc==="micro"?2:1); if(!prev||sc>prev[2]) m.set(k,[mp.id,i,sc]); }));
  const names=[...m.keys()].sort((p,q)=>q.length-p.length); FCMI={m,re:new RegExp("(?<![\\p{L}])("+names.map(n=>n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("|")+")(?![\\p{L}])","u")}; return FCMI; }
function fcText(c){ if(c.k==="q") return c.b.q[2]+" "+c.b.o[0][2]; if(c.k==="d") return c.d[3]+" "+c.d[6]; if(c.k==="n") return c.x[1][2]+" "+(c.x[2]?c.x[2][2]:"")+" "+c.x[0][2]; return ""; }
function fcPic(c){ if(FCPICC.has(c.id)) return FCPICC.get(c.id); let s="";
  try{
   if(c.k==="g") s=fSvg(`${xBunch(160,92,2.2,c.g.c==="w"?"#c9b84a":"#3d1240")}`,"spring");
   else { const txt=fcText(c);
     if(c.k==="n"){ const v=c.x[0][2]; s=/°C/.test(v)?FCSC.sun():/%/.test(v)?FCSC.taste():/year|month|day/i.test(v+" "+txt)?FCSC.clock():/g\/l/.test(v)?FCSC.sweet():/°/.test(v)?FCSC.sun():""; }
     if(!s&&["fra","eur","nw","spu","mut"].includes(c.tp)&&typeof xMapView==="function"){ const I=fcMapIdx(), mm=txt.match(I.re); if(mm){ const r=I.m.get(mm[1]); if(r&&MGEO[r[0]]) s=`<svg class="fsvg" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${fDefs}${FXD}${xMapView(r[0],[r[1]],{x:0,y:0,w:320,h:200,noInset:1})}</svg>`; } }
     if(!s){ const hit=FCRX.find(([k,re])=>re.test(txt)); if(hit) s=FCSC[hit[0]](); }
     if(!s) s=(FCSC[{tas:"taste",vig:"vine",win:"ferm",fra:"label",eur:"label",nw:"label",spu:"spark",mut:"fort"}[c.tp]]||FCSC.red)(); }
  }catch(e){ s=""; }
  FCPICC.set(c.id,s); return s; }
try{ const st7=document.createElement("style"); st7.textContent=`
.fcpic{display:block;border-radius:16px;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,.25);flex:none}
.fcpic svg{display:block;width:100%;height:auto;aspect-ratio:16/10}
.fcf .fcpic{margin-bottom:4px}
.fcpic.sm{width:42%;max-width:180px;align-self:flex-start;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,.15)}
.fcface{justify-content:flex-start!important}
.fcf .fcq{font-size:clamp(1.1rem,4.2vw,1.5rem)}
.fccard{min-height:min(72vh,560px)!important}
`; document.head.appendChild(st7); }catch(e){}

/* ---------- v65: quiz = only new questions until exhausted, then the wrong ones ---------- */
Object.assign(T.it,{qzNewLeft:"{N} domande nuove ancora da fare",qzNoNew:"Hai fatto tutte le domande: ora ripassi quelle sbagliate ({N})",qzAllOk:"Hai fatto e sapevi tutte le domande: ripasso libero"});
Object.assign(T.fr,{qzNewLeft:"{N} questions nouvelles encore à faire",qzNoNew:"Toutes les questions faites : place aux questions ratées ({N})",qzAllOk:"Toutes les questions faites et réussies : révision libre"});
Object.assign(T.en,{qzNewLeft:"{N} new questions still to do",qzNoNew:"All questions done: now reviewing the ones you missed ({N})",qzAllOk:"All questions done and known: free review"});
function qzWrong(b){ const q=P.q[b.id]; return (P.e[b.id]&&!P.e[b.id].r)||(q&&!(q[1]>0)); }
function qzState(){ const pool=BANK.filter(b=>pSel.has(b.c)&&lvOk(b)); const fresh=pool.filter(b=>!P.q[b.id]), wrong=pool.filter(b=>P.q[b.id]&&qzWrong(b)); return {pool,fresh,wrong}; }
function qzStateTxt(){ const S=qzState(); if(S.fresh.length) return t("qzNewLeft").replace("{N}",S.fresh.length); if(S.wrong.length) return t("qzNoNew").replace("{N}",S.wrong.length); return t("qzAllOk"); }
function pickPractice(){ const S=qzState(); let n=+$("#p-count").value; const sh=a=>shuffle(a.map(b=>b.id));
  let ids;
  if(S.fresh.length) ids=sh(S.fresh);
  else if(S.wrong.length) ids=sh(S.wrong);
  else ids=S.pool.slice().sort((x,y)=>((P.q[x.id]||[0,0,0])[2]||0)-((P.q[y.id]||[0,0,0])[2]||0)).map(b=>b.id);
  if(!n) n=ids.length;
  startQuiz(ids.slice(0,n),"practice",[...pSel]); }

/* ---------- v66: safer answers on touch screens — ignore taps while scrolling, tap to select then confirm ---------- */
Object.assign(T.it,{qzConfirm:"Conferma la risposta",qzTapAgain:"Tocca di nuovo la risposta o premi Conferma"});
Object.assign(T.fr,{qzConfirm:"Valider la réponse",qzTapAgain:"Touchez à nouveau la réponse ou appuyez sur Valider"});
Object.assign(T.en,{qzConfirm:"Confirm answer",qzTapAgain:"Tap the answer again or press Confirm"});
let TG={x:0,y:0,t:0,moved:false,lastScroll:0};
window.addEventListener("scroll",()=>{ TG.lastScroll=Date.now(); },{passive:true,capture:true});
document.addEventListener("touchstart",e=>{ const p=e.touches[0]; TG={...TG,x:p.clientX,y:p.clientY,t:Date.now(),moved:false,sy:window.scrollY}; },{passive:true,capture:true});
document.addEventListener("touchmove",e=>{ const p=e.touches[0]; if(Math.abs(p.clientX-TG.x)>10||Math.abs(p.clientY-TG.y)>10) TG.moved=true; },{passive:true,capture:true});
function qzPick(o){ const ch=document.querySelectorAll(".choice"); ch.forEach(b=>{ const on=+b.dataset.o===o; b.classList.toggle("presel",on); b.setAttribute("aria-pressed",on?"true":"false"); });
  let bar=document.getElementById("qzconf"); if(!bar){ bar=document.createElement("div"); bar.id="qzconf"; bar.className="qzconf"; const host=document.querySelector(".choices"); if(host) host.after(bar); }
  bar.innerHTML=`<p>${esc(t("qzTapAgain"))}</p><button type="button" class="qzgo" data-qzconf="${o}">${esc(t("qzConfirm"))} ✓</button>`;
  try{ const r=bar.getBoundingClientRect(); if(r.bottom>window.innerHeight-80) bar.scrollIntoView({block:"center",behavior:"smooth"}); }catch(_){} }
document.addEventListener("click",e=>{
  const cf=e.target.closest&&e.target.closest("[data-qzconf]"); if(cf){ e.preventDefault(); e.stopPropagation(); if(Date.now()-TG.lastScroll<350&&TG.moved) return; answer(+cf.dataset.qzconf); return; }
  const b=e.target.closest&&e.target.closest(".choice"); if(!b||b.disabled||typeof quiz==="undefined"||!quiz||view==="practice"&&false) return;
  if(!b.closest(".choices")||b.dataset.o===undefined) return;
  const recentTouch=TG.t&&Date.now()-TG.t<1500; const scrolling=(recentTouch&&TG.moved)||(Date.now()-TG.lastScroll<350)||(recentTouch&&Math.abs((TG.sy||0)-window.scrollY)>8);
  if(scrolling){ e.preventDefault(); e.stopPropagation(); TG.moved=false; return; }
  if(!b.classList.contains("presel")){ e.preventDefault(); e.stopPropagation(); qzPick(+b.dataset.o); return; }
},true);
try{ const st8=document.createElement("style"); st8.textContent=`
.choice{touch-action:manipulation;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}
.choice.presel{border-color:#a3264f!important;background:color-mix(in srgb,#a3264f 12%,var(--surface,#fff))!important;box-shadow:0 0 0 2px #a3264f inset}
.choice.presel .k{background:#a3264f;color:#fff;border-color:#a3264f}
.qzconf{position:relative;margin-top:4px;display:flex;flex-direction:column;gap:6px;padding:10px;border-radius:18px;background:var(--surface,#fff);box-shadow:0 8px 24px rgba(0,0,0,.18);border:1px solid var(--line,#eadfce)}
.qzconf p{margin:0;text-align:center;font-size:.78rem;color:var(--muted,#7b6a5c)}
.qzconf .qzgo{margin:0;width:100%}
`; document.head.appendChild(st8); }catch(e){}

/* ---------- v67: budburst & ripening comparison ---------- */
Object.assign(T.it,{tr_phen:"Germogliamento e maturazione",trd_phen:"Tutte le uve a confronto: quando germogliano, quando maturano e che cosa comporta.",phIntro:"Due momenti del ciclo della vite decidono dove un'uva può crescere bene: il germogliamento in primavera e la maturazione alla fine dell'estate.",
 phBudT:"Germogliamento (débourrement)",phBudD:"È il momento in cui le gemme si aprono in primavera. Più è precoce, più i giovani germogli sono esposti alle gelate primaverili: servono siti protetti, pendii ben drenati o protezioni antigelo. Un germogliamento tardivo evita in gran parte questo rischio.",
 phRipT:"Maturazione (maturité)",phRipD:"È il momento in cui l'uva raggiunge zucchero, aromi e tannini maturi. Un'uva precoce matura anche dove l'estate è breve e fresca, ma nei climi caldi rischia di perdere acidità e freschezza. Un'uva tardiva ha bisogno di una stagione lunga e calda e di un autunno asciutto: altrimenti resta acida e acerba o subisce piogge e marciume.",
 phMatrix:"La matrice: germogliamento × maturazione",phBud:"Germogliamento",phRip:"Maturazione",phE:"precoce",phM:"medio",phL:"tardivo",phNA:"non indicato",phAll:"Tutte",phW:"Bianche",phR:"Nere",phSearch:"Cerca un'uva…",phTable:"Tabella completa",phGrape:"Uva",phCons:"Conseguenze",phClim:"Clima e note",
 phC_EE:"Rischio gelate in primavera; matura presto: ideale nei climi freschi, nei climi caldi perde acidità.",phC_EM:"Rischio gelate in primavera; maturazione a metà stagione: climi da freschi a moderati.",phC_EL:"Doppio rischio: gelate in primavera e bisogno di una stagione lunga e calda; teme le piogge d'autunno.",
 phC_ME:"Sfugge in parte alle gelate e matura presto: adatto ai climi freschi, conserva freschezza e aromi.",phC_MM:"Ciclo equilibrato, adattabile; climi da moderati a caldi.",phC_ML:"Ha bisogno di calore e di un autunno lungo e asciutto; nei climi freschi fatica a maturare.",
 phC_LE:"Evita le gelate e matura presto: perfetto per i climi freddi e marginali.",phC_LM:"Evita le gelate; maturazione media, climi da moderati a caldi.",phC_LL:"Evita le gelate ma matura tardi: serve molto calore o un lungo autunno; rischio piogge e uva acerba negli anni freschi."});
Object.assign(T.fr,{tr_phen:"Débourrement et maturité",trd_phen:"Tous les cépages comparés : quand ils débourrent, quand ils mûrissent et ce que cela implique.",phIntro:"Deux moments du cycle de la vigne décident où un cépage peut bien pousser : le débourrement au printemps et la maturité à la fin de l'été.",
 phBudT:"Débourrement",phBudD:"C'est le moment où les bourgeons s'ouvrent au printemps. Plus il est précoce, plus les jeunes pousses sont exposées aux gelées de printemps : il faut des sites protégés, des coteaux bien drainés ou des protections antigel. Un débourrement tardif évite en grande partie ce risque.",
 phRipT:"Maturité",phRipD:"C'est le moment où le raisin atteint des sucres, des arômes et des tanins mûrs. Un cépage précoce mûrit même là où l'été est court et frais, mais en climat chaud il risque de perdre son acidité et sa fraîcheur. Un cépage tardif a besoin d'une saison longue et chaude et d'un automne sec : sinon il reste acide et vert, ou subit les pluies et la pourriture.",
 phMatrix:"La matrice : débourrement × maturité",phBud:"Débourrement",phRip:"Maturité",phE:"précoce",phM:"moyen",phL:"tardif",phNA:"non indiqué",phAll:"Tous",phW:"Blancs",phR:"Noirs",phSearch:"Chercher un cépage…",phTable:"Tableau complet",phGrape:"Cépage",phCons:"Conséquences",phClim:"Climat et notes",
 phC_EE:"Risque de gelées de printemps ; mûrit tôt : idéal en climat frais, perd son acidité en climat chaud.",phC_EM:"Risque de gelées de printemps ; maturité de mi-saison : climats frais à modérés.",phC_EL:"Double risque : gelées de printemps et besoin d'une saison longue et chaude ; craint les pluies d'automne.",
 phC_ME:"Échappe en partie aux gelées et mûrit tôt : adapté aux climats frais, garde fraîcheur et arômes.",phC_MM:"Cycle équilibré, adaptable ; climats modérés à chauds.",phC_ML:"A besoin de chaleur et d'un automne long et sec ; en climat frais, mûrit difficilement.",
 phC_LE:"Évite les gelées et mûrit tôt : parfait pour les climats froids et marginaux.",phC_LM:"Évite les gelées ; maturité moyenne, climats modérés à chauds.",phC_LL:"Évite les gelées mais mûrit tard : il faut beaucoup de chaleur ou un long automne ; risque de pluies et de raisins verts les années fraîches."});
Object.assign(T.en,{tr_phen:"Budburst and ripening",trd_phen:"Every grape compared: when it buds, when it ripens and what that means.",phIntro:"Two moments of the vine's cycle decide where a grape grows well: budburst in spring and ripening at the end of summer.",
 phBudT:"Budburst",phBudD:"The moment the buds open in spring. The earlier it is, the more the young shoots are exposed to spring frost: they need protected sites, well-drained slopes or frost protection. Late budburst largely avoids this risk.",
 phRipT:"Ripening",phRipD:"The moment the grapes reach ripe sugar, aromas and tannins. An early-ripening grape ripens even where summers are short and cool, but in hot climates it may lose acidity and freshness. A late-ripening grape needs a long, warm season and a dry autumn: otherwise it stays sharp and green, or suffers rain and rot.",
 phMatrix:"The matrix: budburst × ripening",phBud:"Budburst",phRip:"Ripening",phE:"early",phM:"mid",phL:"late",phNA:"not stated",phAll:"All",phW:"White",phR:"Black",phSearch:"Search a grape…",phTable:"Full table",phGrape:"Grape",phCons:"Consequences",phClim:"Climate and notes",
 phC_EE:"Spring-frost risk; ripens early: ideal in cool climates, loses acidity in hot ones.",phC_EM:"Spring-frost risk; mid-season ripening: cool to moderate climates.",phC_EL:"Double risk: spring frost and the need for a long, warm season; fears autumn rain.",
 phC_ME:"Partly escapes frost and ripens early: suits cool climates, keeps freshness and aromas.",phC_MM:"Balanced cycle, adaptable; moderate to warm climates.",phC_ML:"Needs warmth and a long, dry autumn; struggles to ripen in cool climates.",
 phC_LE:"Avoids frost and ripens early: perfect for cold, marginal climates.",phC_LM:"Avoids frost; mid ripening, moderate to warm climates.",phC_LL:"Avoids frost but ripens late: needs plenty of heat or a long autumn; risk of rain and unripe grapes in cool years."});
try{ TABG.phen="wine"; SUBV.phen="wine"; SUBT.phen="tr_phen"; }catch(e){}
let phF={c:"a",q:"",s:"name"};
function phLab(k){ return k==="E"?t("phE"):k==="M"?t("phM"):k==="L"?t("phL"):t("phNA"); }
function phPill(k){ return `<span class="phpill ph${k||"N"}">${esc(phLab(k))}</span>`; }
function phChip(g){ return `<button type="button" class="phchip" data-gsee2="${esc(g.k)}"><i class="${g.c==="w"?"w":"r"}"></i>${esc(g.k)}</button>`; }
const PHMAIN=["Chardonnay","Sauvignon Blanc","Riesling","Chenin Blanc","Sémillon","Pinot Gris","Gewurztraminer","Viognier","Muscat","Cabernet Sauvignon","Merlot","Cabernet Franc","Pinot Noir","Syrah","Grenache","Malbec","Tempranillo","Sangiovese","Nebbiolo","Zinfandel","Gamay","Mourvèdre","Pinotage"];
const phIsMain=g=>PHMAIN.includes(g.k);
function phCons(g){ const K="EML"; if(K.includes(g.bud||"x")&&K.includes(g.rip||"x")) return t("phC_"+g.bud+g.rip); if(K.includes(g.rip||"x")) return t("phR_"+g.rip); return ""; }
function phTable(rows,K){ return `<div class="phtblw"><table class="phtbl"><thead><tr><th><button type="button" data-phs="name">${esc(t("phGrape"))}${phF.s==="name"?" ▾":""}</button></th><th><button type="button" data-phs="bud">${esc(t("phBud"))}${phF.s==="bud"?" ▾":""}</button></th><th><button type="button" data-phs="rip">${esc(t("phRip"))}${phF.s==="rip"?" ▾":""}</button></th><th>${esc(t("phCons"))}</th><th>${esc(t("phClim"))}</th></tr></thead><tbody>${rows.map(g=>`<tr><th><button type="button" class="phgn" data-gsee2="${esc(g.k)}"><i class="${g.c==="w"?"w":"r"}"></i>${esc(g.k)}</button></th><td>${phPill(g.bud)}</td><td>${phPill(g.rip)}</td><td class="phcons">${esc(phCons(g))}</td><td class="phclim">${esc(tx(g.cl||""))}</td></tr>`).join("")}</tbody></table></div>`; }
function renderPhen(){ const ALL=GRAPES.slice().sort((a,b)=>a.k.localeCompare(b.k)); const G=ALL.filter(phIsMain), SEC=ALL.filter(g=>!phIsMain(g)); const K=["E","M","L"]; const ord={E:0,M:1,L:2};
  const srt=a=>{ a=a.slice(); if(phF.s==="bud") a.sort((x,y)=>(ord[x.bud]??3)-(ord[y.bud]??3)||x.k.localeCompare(y.k)); if(phF.s==="rip") a.sort((x,y)=>(ord[x.rip]??3)-(ord[y.rip]??3)||x.k.localeCompare(y.k)); return a; };
  const cell=(b,r)=>{ const L_=G.filter(g=>g.bud===b&&g.rip===r); return `<div class="phcell ph-${b}${r}"><div class="phlab">${esc(t("phBud"))} ${phPill(b)} · ${esc(t("phRip"))} ${phPill(r)}</div><div class="phch">${esc(t("phC_"+b+r))}</div><div class="phchips">${L_.map(phChip).join("")||"<span class='phnone'>—</span>"}</div></div>`; };
  const matrix=`<div class="phmat"><div class="phcorner"><span>${esc(t("phBud"))} ↓</span><span>${esc(t("phRip"))} →</span></div>${K.map(r=>`<div class="phcolh">${phPill(r)}</div>`).join("")}${K.map(b=>`<div class="phrowh">${phPill(b)}</div>${K.map(r=>cell(b,r)).join("")}`).join("")}</div>`;
  const naM=G.filter(g=>!K.includes(g.bud)||!K.includes(g.rip));
  const mbox=`<div class="phmain"><div class="phmh"><span class="phstar">★</span><div><h2>${esc(t("phMainT"))}</h2><p>${esc(t("phMainD"))}</p></div></div>
    <div class="phcols">${K.map(r=>`<div class="phcol phc${r}"><h3>${["☀️","🍇","🍂"][ord[r]]} ${esc(t("phRip"))}: ${esc(phLab(r))}</h3><p class="phcd">${esc(t("phR_"+r))}</p><div class="phmg">${["w","b"].map(c=>G.filter(g=>g.rip===r&&(c==="w"?g.c==="w":g.c!=="w")).map(g=>`<button type="button" class="phmc" data-gsee2="${esc(g.k)}"><i class="${g.c==="w"?"w":"r"}"></i><b>${esc(g.k)}</b><span>🌱 ${esc(phLab(g.bud))}</span></button>`).join("")).join("")}</div></div>`).join("")}</div>
    <button type="button" class="qzgo" data-go="g_phen">🎮 ${esc(t("pgPlay"))} ▸</button></div>`;
  const rows=srt(SEC.filter(g=>(phF.c==="a"||(phF.c==="w"?g.c==="w":g.c!=="w"))&&(!phF.q||flNorm(g.k+" "+(g.syn||[]).join(" ")).includes(flNorm(phF.q)))));
  return `<section class="view ph">
   <div class="qzhero"><div class="qzhtx"><small>${esc(t("tr_grapes"))}</small><h1>${esc(t("tr_phen"))}</h1></div>${gfree("n11",90)}<p class="phi">${esc(t("phIntro"))}</p></div>
   <div class="phexp"><div class="phx bud"><h3>🌱 ${esc(t("phBudT"))}</h3><p>${esc(t("phBudD"))}</p></div><div class="phx rip"><h3>🍇 ${esc(t("phRipT"))}</h3><p>${esc(t("phRipD"))}</p></div></div>
   ${mbox}
   <h2 class="phh">${esc(t("phMatrix"))} <small class="phsm">★ ${esc(t("phMainS"))}</small></h2>${matrix}
   ${naM.length?`<p class="phna"><b>${esc(t("phNA"))}:</b> ${naM.map(g=>`${esc(g.k)} (${esc(t("phBud"))}: ${esc(phLab(g.bud))} / ${esc(t("phRip"))}: ${esc(phLab(g.rip))})`).join(", ")}</p>`:""}
   <h2 class="phh">${esc(t("phTable"))} <small class="phsm">★ ${esc(t("phMainS"))}</small></h2>
   ${phTable(srt(G),K)}
   <details class="phopt" id="phopt"${phF.o?" open":""}><summary><span><b>${esc(t("phOptT"))}</b><small>${esc(t("phOptD").replace("{n}",SEC.length))}</small></span><i>▾</i></summary>
   <div class="phoptb"><div class="phctl"><input type="search" id="phq" value="${esc(phF.q)}" placeholder="${esc(t("phSearch"))}"><div class="phseg">${[["a","phAll"],["w","phW"],["r","phR"]].map(([k,l])=>`<button type="button" class="fct${phF.c===k?" on":""}" data-phc="${k}">${esc(t(l))}</button>`).join("")}</div></div>
   ${phTable(rows,K)}</div></details></section>`; }
document.addEventListener("toggle",e=>{ if(e.target&&e.target.id==="phopt") phF.o=e.target.open; },true);
Object.assign(T.it,{phMainT:"Le uve principali: da sapere a memoria",phMainD:"Sono le uve che tornano più spesso nelle domande. Concentrati prima su queste: quando maturano e quando germogliano.",phMainS:"solo uve principali",phOptT:"Uve secondarie (facoltativo)",phOptD:"{n} uve citate molto meno spesso. Da consultare solo se ti serve.",phR_E:"Matura presto: riesce anche in climi freschi con estati corte; nei climi caldi rischia di perdere acidità.",phR_M:"Maturazione di metà stagione: si adatta a climi moderati e caldi.",phR_L:"Matura tardi: ha bisogno di una stagione lunga e calda e di un autunno asciutto."});
Object.assign(T.fr,{phMainT:"Les cépages principaux : à connaître par cœur",phMainD:"Ce sont les cépages qui reviennent le plus souvent dans les questions. Concentrez-vous d'abord sur eux : quand ils mûrissent et quand ils débourrent.",phMainS:"cépages principaux seulement",phOptT:"Cépages secondaires (facultatif)",phOptD:"{n} cépages beaucoup moins cités. À consulter seulement si besoin.",phR_E:"Mûrit tôt : réussit même en climat frais aux étés courts ; en climat chaud, risque de perdre son acidité.",phR_M:"Maturité de mi-saison : s'adapte aux climats modérés et chauds.",phR_L:"Mûrit tard : a besoin d'une saison longue et chaude et d'un automne sec."});
Object.assign(T.en,{phMainT:"The principal grapes: know them by heart",phMainD:"These are the grapes that come up most often in the questions. Focus on them first: when they ripen and when they bud.",phMainS:"principal grapes only",phOptT:"Secondary grapes (optional)",phOptD:"{n} grapes mentioned far less often. Look them up only if you need to.",phR_E:"Ripens early: succeeds even in cool climates with short summers; in hot climates it risks losing acidity.",phR_M:"Mid-season ripening: adapts to moderate and warm climates.",phR_L:"Ripens late: needs a long, warm season and a dry autumn."});
document.addEventListener("click",e=>{ if(view!=="phen") return; const c=e.target.closest&&e.target.closest("[data-phc],[data-phs]"); if(!c) return;
  if(c.dataset.phc){ phF.c=c.dataset.phc; render(); return; } if(c.dataset.phs){ phF.s=c.dataset.phs; render(); return; }
});
document.addEventListener("input",e=>{ if(e.target&&e.target.id==="phq"){ phF.q=e.target.value; const pos=e.target.selectionStart; render(); const i=document.getElementById("phq"); if(i){ i.focus(); try{ i.setSelectionRange(pos,pos); }catch(_){} } } });
try{ const st9=document.createElement("style"); st9.textContent=`
.rv-phen{--bg:linear-gradient(150deg,#2f5a1e,#5f9a2e 60%,#b5c94a);--sh:#1d3a12}
.ph{display:flex;flex-direction:column;gap:14px}.phi{margin:8px 0 0;font-size:.92rem;line-height:1.45;opacity:.95}
.phexp{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px}
.phx{border-radius:18px;padding:14px 16px;border:1px solid var(--line,#eadfce);background:var(--surface,#fff)}.phx h3{margin:0 0 6px;font-family:var(--f-display)}.phx p{margin:0;line-height:1.5;font-size:.92rem}
.phx.bud{border-left:5px solid #5f9a2e}.phx.rip{border-left:5px solid #a3264f}
.phh{margin:10px 0 0;font-family:var(--f-display)}
.phmat{display:grid;grid-template-columns:72px repeat(3,minmax(0,1fr));gap:6px;overflow-x:auto}
.phcorner{display:flex;flex-direction:column;justify-content:center;gap:4px;font-size:.66rem;font-weight:800;color:var(--muted,#7b6a5c);line-height:1.2}
.phcolh,.phrowh{display:flex;align-items:center;justify-content:center}
.phcell{border-radius:14px;padding:8px;min-height:90px;display:flex;flex-direction:column;gap:6px;border:1px solid var(--line,#eadfce)}
.phch{font-size:.68rem;line-height:1.3;color:var(--muted,#7b6a5c);font-weight:600}
.ph-EE,.ph-EM,.ph-EL{background:color-mix(in srgb,#5fa0d8 10%,transparent)}.ph-EL{background:color-mix(in srgb,#c2185b 10%,transparent)}
.ph-LL,.ph-ML{background:color-mix(in srgb,#e0662a 10%,transparent)}.ph-LE{background:color-mix(in srgb,#5f9a2e 14%,transparent)}
.phchips{display:flex;flex-wrap:wrap;gap:4px}.phnone{color:var(--muted,#7b6a5c)}
.phchip,.phgn{border:1px solid var(--line,#eadfce);background:var(--surface,#fff);color:inherit;border-radius:999px;padding:3px 8px;font-size:.74rem;font-weight:700;display:inline-flex;align-items:center;gap:5px;cursor:pointer}
.phgn{border:0;background:transparent;padding:0;font-size:.88rem;font-family:var(--f-display)}
.phchip i,.phgn i{width:9px;height:9px;border-radius:50%;flex:none}.phchip i.w,.phgn i.w{background:#d9c23a}.phchip i.r,.phgn i.r{background:#6e1630}
.phpill{display:inline-block;padding:3px 9px;border-radius:999px;font-size:.72rem;font-weight:800;white-space:nowrap}
.phE{background:#dcefd0;color:#2f5a1e}.phM{background:#f6e7bf;color:#7a5a10}.phL{background:#f6d5c4;color:#8a3410}.phN,.phundefined,.ph-{background:var(--sunk,#eee);color:var(--muted,#777)}
.phna{font-size:.82rem;color:var(--muted,#7b6a5c);margin:0}
.phctl{display:flex;gap:10px;flex-wrap:wrap;align-items:center}.phctl input{flex:1;min-width:180px;border:1px solid var(--line,#eadfce);border-radius:999px;padding:9px 14px;background:var(--surface,#fff);color:inherit;font:inherit}.phseg{display:flex;gap:6px}
.phtblw{overflow-x:auto;border:1px solid var(--line,#eadfce);border-radius:14px;background:var(--surface,#fff)}
.phtbl{border-collapse:collapse;width:100%;min-width:720px;font-size:.84rem}
.phtbl th,.phtbl td{padding:8px 10px;border-bottom:1px solid var(--line,#eadfce);text-align:left;vertical-align:top;white-space:normal}
.phtbl thead th{position:sticky;top:0;background:#4a0f22;color:#f6e7c8;font-size:.72rem;letter-spacing:.06em;text-transform:uppercase}
.phtbl thead button{all:unset;cursor:pointer}
.phtbl tbody th{position:sticky;left:0;background:var(--surface,#fff);z-index:1;min-width:120px}
.phcons{min-width:200px}.phclim{min-width:240px;color:var(--muted,#7b6a5c)}
.phlab{display:none}.phchip{white-space:nowrap}
.phmain{border-radius:22px;padding:16px;background:linear-gradient(150deg,#4a0f22,#7a1d3a 55%,#a3264f);color:#fbf0dc;box-shadow:0 8px 0 #2a0814;display:flex;flex-direction:column;gap:12px}
.phmh{display:flex;gap:12px;align-items:flex-start}.phmh h2{margin:0;font-family:var(--f-display);color:#fff}.phmh p{margin:4px 0 0;font-size:.9rem;opacity:.9;line-height:1.4}
.phstar{font-size:1.6rem;color:#f2c14e;line-height:1}
.phcols{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.phcol{border-radius:16px;padding:10px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18)}.phcol h3{margin:0;font-size:.95rem;font-family:var(--f-display);color:#fff}
.phcE{border-top:4px solid #9ccc65}.phcM{border-top:4px solid #f2c14e}.phcL{border-top:4px solid #ff8a50}
.phcd{margin:4px 0 8px;font-size:.74rem;opacity:.85;line-height:1.35}
.phmg{display:flex;flex-direction:column;gap:5px}
.phmc{all:unset;cursor:pointer;display:flex;align-items:center;gap:7px;padding:6px 9px;border-radius:12px;background:#fff8ec;color:#3a1020;font-size:.84rem}
.phmc{flex-wrap:wrap;row-gap:2px}.phmc b{flex:1 1 auto;min-width:0}.phmc span{margin-left:auto;font-size:.66rem;font-weight:700;color:#7b6a5c;white-space:nowrap}.phmc i{width:9px;height:9px;border-radius:50%;flex:none}.phmc i.w{background:#d9c23a}.phmc i.r{background:#6e1630}
.phmain .qzgo{align-self:flex-start}
.phsm{font-family:var(--f-body,inherit);font-size:.7rem;font-weight:800;color:#a3264f;background:color-mix(in srgb,#a3264f 10%,transparent);padding:3px 9px;border-radius:999px;vertical-align:middle}
.phopt{border:1px dashed var(--line,#d8c8b4);border-radius:16px;background:var(--surface,#fff);margin-top:6px}
.phopt summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:10px;padding:12px 14px}.phopt summary::-webkit-details-marker{display:none}
.phopt summary span{display:flex;flex-direction:column;gap:2px}.phopt summary small{color:var(--muted,#7b6a5c)}.phopt summary i{font-style:normal;transition:transform .2s}.phopt[open] summary i{transform:rotate(180deg)}
.phopt .phgn{color:var(--ink,#2a1b20)}.phoptb{padding:0 12px 12px;display:flex;flex-direction:column;gap:10px}
@media (max-width:700px){.phcols{grid-template-columns:1fr}}
@media (max-width:700px){.phmat{display:flex;flex-direction:column;gap:8px;overflow:visible}.phcorner,.phcolh,.phrowh{display:none}.phlab{display:flex;flex-wrap:wrap;align-items:center;gap:4px;font-size:.74rem;font-weight:800}.phcell{min-height:0}}
`; document.head.appendChild(st9); }catch(e){}

/* ---------- v68: game "La corsa alla vendemmia" — budburst & (above all) ripening ---------- */
Object.assign(T.it,{gPhen:"La corsa alla vendemmia",gPhenD:"Germoglia presto? Matura tardi? Indovina il calendario di ogni uva prima che arrivino gelo e pioggia!",pgStart:"Gioca",pgRules:"12 round. Rispondi in fretta per avere più punti, fai combo di risposte giuste. Hai 3 grappoli: ogni errore ne costa uno.",pgQRip:"Quando matura",pgQBud:"Quando germoglia",pgQCmp:"Quale matura PRIMA?",pgQCmpL:"Quale matura PER ULTIMA?",pgQCool:"Clima fresco, estate corta: quale uva riesce a maturare?",pgQHot:"Clima caldo con un autunno lungo e asciutto: quale uva ne ha davvero bisogno per maturare?",pgE:"Precoce",pgM:"Media",pgL:"Tardiva",pgEb:"Precoce",pgMb:"Medio",pgLb:"Tardivo",pgOk:"Giusto!",pgNo:"No!",pgNext:"Avanti",pgScore:"Punti",pgRound:"Round",pgCombo:"Combo",pgEnd:"Vendemmia finita!",pgLost:"Grandine! Hai perso tutti i grappoli",pgAgain:"Rigioca",pgBack:"Giochi",pgBest:"Record",pgFrost:"Gelata di primavera!",pgRain:"Pioggia d'autunno!",pgSun:"Estate corta: ce la fa!",pgPlay:"Gioca: La corsa alla vendemmia",pgReview:"Da ripassare"});
Object.assign(T.fr,{gPhen:"La course aux vendanges",gPhenD:"Débourrement précoce ? Maturité tardive ? Devinez le calendrier de chaque cépage avant le gel et la pluie !",pgStart:"Jouer",pgRules:"12 manches. Répondez vite pour gagner plus de points, enchaînez les bonnes réponses. Vous avez 3 grappes : chaque erreur en coûte une.",pgQRip:"Quand mûrit",pgQBud:"Quand débourre",pgQCmp:"Lequel mûrit EN PREMIER ?",pgQCmpL:"Lequel mûrit EN DERNIER ?",pgQCool:"Climat frais, été court : quel cépage arrive à mûrir ?",pgQHot:"Climat chaud avec un automne long et sec : quel cépage en a vraiment besoin pour mûrir ?",pgE:"Précoce",pgM:"Moyenne",pgL:"Tardive",pgEb:"Précoce",pgMb:"Moyen",pgLb:"Tardif",pgOk:"Bravo !",pgNo:"Raté !",pgNext:"Suivant",pgScore:"Points",pgRound:"Manche",pgCombo:"Combo",pgEnd:"Vendanges terminées !",pgLost:"La grêle ! Vous avez perdu toutes vos grappes",pgAgain:"Rejouer",pgBack:"Jeux",pgBest:"Record",pgFrost:"Gelée de printemps !",pgRain:"Pluie d'automne !",pgSun:"Été court : il y arrive !",pgPlay:"Jouer : la course aux vendanges",pgReview:"À revoir"});
Object.assign(T.en,{gPhen:"The race to harvest",gPhenD:"Early budding? Late ripening? Guess each grape's calendar before frost and rain arrive!",pgStart:"Play",pgRules:"12 rounds. Answer fast for more points and build combos. You have 3 bunches: every mistake costs one.",pgQRip:"When does it ripen:",pgQBud:"When does it bud:",pgQCmp:"Which one ripens FIRST?",pgQCmpL:"Which one ripens LAST?",pgQCool:"Cool climate, short summer: which grape manages to ripen?",pgQHot:"Hot climate with a long, dry autumn: which grape really needs it to ripen?",pgE:"Early",pgM:"Mid",pgL:"Late",pgEb:"Early",pgMb:"Mid",pgLb:"Late",pgOk:"Correct!",pgNo:"Wrong!",pgNext:"Next",pgScore:"Points",pgRound:"Round",pgCombo:"Combo",pgEnd:"Harvest over!",pgLost:"Hail! You lost all your bunches",pgAgain:"Play again",pgBack:"Games",pgBest:"Best",pgFrost:"Spring frost!",pgRain:"Autumn rain!",pgSun:"Short summer: it makes it!",pgPlay:"Play: the race to harvest",pgReview:"To review"});
try{ TABG.g_phen="play"; SUBV.g_phen="play"; SUBT.g_phen="gPhen"; }catch(e){}
let PG=null, PGT=null;
const pgRand=a=>a[Math.floor(Math.random()*a.length)], pgSh=a=>a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(x=>x[1]);
function pgPool(){ return GRAPES.filter(g=>phIsMain(g)&&"EML".includes(g.rip||"x")); }
const pgBudP=()=>pgPool().filter(g=>"EML".includes(g.bud||"x"));
const PGCLX=[];
function pgQ(){ const P=pgPool(), r=Math.random(), ord={E:0,M:1,L:2};
  if(r<.42){ const g=pgRand(P); return {k:"rip",g,ans:g.rip}; }
  if(r<.62){ const g=pgRand(pgBudP()); return {k:"bud",g,ans:g.bud}; }
  if(r<.84){ let a,b; do{ a=pgRand(P); b=pgRand(P); }while(a===b||a.rip===b.rip); const last=Math.random()<.35; const win=last?(ord[a.rip]>ord[b.rip]?a:b):(ord[a.rip]<ord[b.rip]?a:b); return {k:last?"cmpL":"cmp",opts:pgSh([a,b]),win}; }
  const P2=P.filter(g=>!PGCLX.includes(g.k)); const E=P2.filter(g=>g.rip==="E"), M=P2.filter(g=>g.rip==="M"), L_=P2.filter(g=>g.rip==="L"); const hot=Math.random()<.45; const win=hot?pgRand(L_):pgRand(E); return {k:hot?"hot":"cool",opts:pgSh([pgRand(E.filter(x=>x!==win).length?(hot?E:E.filter(x=>x!==win)):E),pgRand(M),pgRand(L_.filter(x=>x!==win).length?(hot?L_.filter(x=>x!==win):L_):L_)].map((x,i)=>x)).slice(0,3),win,hotq:hot}; }
function pgFixOpts(q){ if((q.k==="cool"||q.k==="hot")){ const P=pgPool().filter(g=>!PGCLX.includes(g.k)); const E=P.filter(g=>g.rip==="E"), M=P.filter(g=>g.rip==="M"), L_=P.filter(g=>g.rip==="L"); q.opts=pgSh([q.win, pgRand(M), q.k==="cool"?pgRand(L_):pgRand(E)]); } return q; }
function pgStart(){ PG={i:0,n:12,score:0,lives:3,combo:0,q:pgFixOpts(pgQ()),pick:null,t0:Date.now(),miss:[],fin:false}; render(); pgTimer(); window.scrollTo(0,0); }
function pgTimer(){ clearInterval(PGT); PGT=setInterval(()=>{ if(view!=="g_phen"||!PG||PG.pick!==null||PG.fin){ clearInterval(PGT); return; } const el=document.querySelector(".pgtime i"); const left=Math.max(0,1-(Date.now()-PG.t0)/12000); if(el) el.style.width=(left*100)+"%"; if(left<=0){ pgAnswer("__timeout"); } },100); }
function pgAnswer(v){ if(!PG||PG.pick!==null) return; const q=PG.q; let ok;
  if(q.k==="rip"||q.k==="bud") ok=v===q.ans; else ok=v===q.win.k;
  PG.pick=v; PG.ok=ok; clearInterval(PGT);
  if(ok){ PG.combo++; const speed=Math.max(0,1-(Date.now()-PG.t0)/12000); PG.gain=Math.round(100+speed*100)*(1+Math.min(PG.combo-1,4)*.25)|0; PG.score+=PG.gain; }
  else { PG.combo=0; PG.lives--; PG.gain=0; const g=q.g||q.win; if(!PG.miss.includes(g.k)) PG.miss.push(g.k); }
  render(); }
function pgNext(){ if(!PG) return; PG.i++; if(PG.lives<=0||PG.i>=PG.n){ PG.fin=true; try{ PG.nb=gAward("g_phen",PG.score,Math.round(PG.score/40)); }catch(e){} render(); return; } PG.q=pgFixOpts(pgQ()); PG.pick=null; PG.t0=Date.now(); render(); pgTimer(); }
function pgScene(q,fb){ const g=q.g||q.win; const col=g&&g.c==="w"?"#c9b84a":"#3d1240";
  const months=L()===1?["mar","avr","mai","juin","juil","août","sept","oct"]:L()===2?["Mar","Apr","May","Jun","Jul","Aug","Sep","Oct"]:["mar","apr","mag","giu","lug","ago","set","ott"];
  let fx="";
  if(fb&&q.k==="bud"&&q.ans==="E") fx=`${fSnow()}${fT(160,40,t("pgFrost"),12,"#cfe8ff")}`;
  else if(fb&&(q.k==="rip"||q.k==="hot")&&(q.ans==="L"||q.k==="hot")) fx=`${fCloud(220,40,1.1,"#cfd8e0")}${fDrops(220,58,150,"#6fa8dc",8)}${fT(110,40,t("pgRain"),12,"#cfe8ff")}`;
  else if(fb&&(q.k==="rip"&&q.ans==="E"||q.k==="cool")) fx=`${fSun(70,50,22)}${fT(200,44,t("pgSun"),12,"#ffe3a1")}`;
  const sel=q.k==="bud"?(fb?{E:0,M:1,L:2}[q.ans]:-1):(q.k==="rip"&&fb?{E:4,M:5,L:6}[q.ans]:-1);
  const tl=`<g>${months.map((m,i)=>`<rect x="${16+i*36}" y="168" width="34" height="22" rx="5" fill="${i===sel||(q.k==="bud"&&fb&&i===sel)?"#d4a23a":"rgba(255,255,255,.14)"}"/>${fT(33+i*36,183,m,8.5,i===sel?"#2a1b20":"#fff4dc")}`).join("")}</g>`;
  const vis=q.k==="cmp"||q.k==="cmpL"||q.k==="cool"||q.k==="hot"?`${(q.opts||[]).map((o,i,a)=>`<g transform="translate(${(i+1)*320/(a.length+1)} 95)">${xBunch(0,-20,1.15,o.c==="w"?"#c9b84a":"#3d1240")}</g>`).join("")}`:`${xBunch(160,70,1.7,col)}`;
  return fSvg(`${vis}${fx}${tl}`,q.k==="bud"?"spring":fb&&q.k==="rip"&&q.ans==="L"?"dusk":"summer").replace("xMidYMid meet","xMidYMid slice"); }
function renderPhenGame(){
  if(!PG) return `<section class="view pg"><div class="qzhero pghero"><div class="qzhtx"><small>${esc(t("plKick"))}</small><h1>${esc(t("gPhen"))}</h1></div>${gfree("n33",100)}<p class="phi">${esc(t("gPhenD"))}</p><p class="phi">${esc(t("pgRules"))}</p>${gBest("g_phen")?`<p class="qzstate">🏆 ${esc(t("pgBest"))}: ${gBest("g_phen")}</p>`:""}<button type="button" class="qzgo" data-pg="start">${esc(t("pgStart"))} ▸</button></div><div class="pgprev">${pgScene({k:"rip",g:GRAPES.find(phIsMain)||GRAPES[0]},false)}</div></section>`;
  if(PG.fin) return `<section class="view pg"><div class="fcend">${gfree(PG.lives>0?"n04":"n33",140)}<h2>${esc(t(PG.lives>0?"pgEnd":"pgLost"))}</h2><div class="fcres"><div><b class="ok">${PG.score}</b><span>${esc(t("pgScore"))}</span></div><div><b>${"🍇".repeat(Math.max(0,PG.lives))||"—"}</b><span>${PG.i>=PG.n?PG.n:PG.i}/${PG.n}</span></div></div>${PG.nb?`<p class="qzstate" style="color:#a3264f">🏆 ${esc(t("pgBest"))}!</p>`:""}
    ${PG.miss.length?`<div class="pgmiss"><h3>${esc(t("pgReview"))}</h3>${PG.miss.map(k=>{ const g=GRAPES.find(x=>x.k===k); return `<div class="pgm"><button type="button" class="phgn" data-gsee2="${esc(k)}"><i class="${g.c==="w"?"w":"r"}"></i>${esc(k)}</button> ${phPill(g.bud)} ${phPill(g.rip)}<span>${esc(phCons(g))}</span></div>`; }).join("")}</div>`:""}
    <div class="fcendb"><button type="button" class="qzgo" data-pg="start">${esc(t("pgAgain"))}</button><button type="button" class="qzgo alt" data-go="phen">${esc(t("tr_phen"))}</button><button type="button" class="qzsm" data-pg="back">${esc(t("pgBack"))}</button></div></div></section>`;
  const q=PG.q, fb=PG.pick!==null;
  let prompt="", btns="";
  const opt3=(labs)=>["E","M","L"].map((k,i)=>{ const cls=fb?(k===q.ans?" ok":k===PG.pick?" no":""):""; return `<button type="button" class="pgb pg${k}${cls}" data-pga="${k}" ${fb?"disabled":""}><span class="pgic">${["🌱","🌿","🍂"][i]}</span>${esc(t(labs[i]))}</button>`; }).join("");
  if(q.k==="rip"){ prompt=`${esc(t("pgQRip"))} <b>${esc(q.g.k)}</b>?`; btns=opt3(["pgE","pgM","pgL"]).replace(/🌱/,"☀️").replace(/🌿/,"🍇").replace(/🍂/,"🍂"); }
  else if(q.k==="bud"){ prompt=`${esc(t("pgQBud"))} <b>${esc(q.g.k)}</b>?`; btns=opt3(["pgEb","pgMb","pgLb"]); }
  else { prompt=esc(t({cmp:"pgQCmp",cmpL:"pgQCmpL",cool:"pgQCool",hot:"pgQHot"}[q.k])); btns=q.opts.map(o=>{ const cls=fb?(o.k===q.win.k?" ok":o.k===PG.pick?" no":""):""; return `<button type="button" class="pgb pgg${cls}" data-pga="${esc(o.k)}" ${fb?"disabled":""}><i class="${o.c==="w"?"w":"r"}"></i>${esc(o.k)}${fb?` <small>${phPill(o.bud)} ${phPill(o.rip)}</small>`:""}</button>`; }).join(""); }
  const g=q.g||q.win;
  return `<section class="view pg"><div class="pgtop"><span>${esc(t("pgRound"))} ${PG.i+1}/${PG.n}</span><span class="pglives">${"🍇".repeat(PG.lives)}${"<i>🍇</i>".repeat(3-PG.lives)}</span><b>${PG.score}</b></div>
   <div class="pgtime"><i style="width:${fb?0:100}%"></i></div>
   <p class="pgq">${prompt}</p>
   <div class="pgstage${fb?(PG.ok?" good":" bad"):""}">${pgScene(q,fb)}${PG.combo>1&&fb&&PG.ok?`<span class="pgcombo">${esc(t("pgCombo"))} ×${PG.combo}</span>`:""}${fb?`<span class="pgfb ${PG.ok?"ok":"no"}">${esc(t(PG.ok?"pgOk":"pgNo"))}${PG.ok?` +${PG.gain}`:""}</span>`:""}</div>
   <div class="pgbtns ${q.k==="rip"||q.k==="bud"?"three":"names"}">${btns}</div>
   ${fb?`<div class="pgexp"><b>${esc(g.k)}</b>: ${esc(t("phBud"))} ${phPill(g.bud)} · ${esc(t("phRip"))} ${phPill(g.rip)}<p>${esc(phCons(g))}</p></div><button type="button" class="qzgo" data-pg="next">${esc(t("pgNext"))} ▸</button>`:""}
  </section>`; }
document.addEventListener("click",e=>{ if(view!=="g_phen") return; const b=e.target.closest&&e.target.closest("[data-pg],[data-pga]"); if(!b) return; e.preventDefault();
  if(b.dataset.pga){ pgAnswer(b.dataset.pga); return; } const a=b.dataset.pg; if(a==="start") pgStart(); else if(a==="next") pgNext(); else if(a==="back"){ PG=null; go("play"); } });
const _rPlay=renderPlay;
renderPlay=function(){ const h=_rPlay(); return h.replace('<div class="gamegrid">',`<div class="gamegrid"><button type="button" class="game game-phen" data-go="g_phen" style="--gc:#2f7a43">${!gBest("g_phen")?`<span class="game-new">${t("newG")}</span>`:""}<span class="game-ic">${ICO.grapes}</span><span class="game-tx"><b>${esc(t("gPhen"))}</b><span>${esc(t("gPhenD"))}</span></span>${gBest("g_phen")?`<span class="game-best">🏆 ${gBest("g_phen")}</span>`:""}</button>`); };
try{ const st10=document.createElement("style"); st10.textContent=`
.pg{display:flex;flex-direction:column;gap:12px}
.pghero .qzgo{margin-top:14px}.pgprev .fsvg{width:100%;height:auto;border-radius:18px;display:block}
.pgtop{display:flex;justify-content:space-between;align-items:center;font-weight:800}.pgtop b{font-family:var(--f-display);font-size:1.5rem;color:#a3264f}
.pglives{font-size:1.2rem;letter-spacing:2px}.pglives i{font-style:normal;filter:grayscale(1);opacity:.3}
.pgtime{height:8px;border-radius:4px;background:color-mix(in srgb,#a3264f 15%,transparent);overflow:hidden}.pgtime i{display:block;height:100%;background:linear-gradient(90deg,#c2185b,#d4a23a,#5f9a2e);transition:width .1s linear}
.pgstage{position:relative;border-radius:20px;overflow:hidden;box-shadow:0 6px 0 rgba(0,0,0,.15)}.pgstage .fsvg{display:block;width:100%;height:auto;aspect-ratio:16/9}@media (max-width:560px){.pgstage .fsvg{aspect-ratio:16/8.6}}
.pgstage.good{box-shadow:0 0 0 4px #5f9a2e,0 6px 0 #2f5a1e}.pgstage.bad{box-shadow:0 0 0 4px #c2185b,0 6px 0 #6e1630;animation:pgshake .4s}
@keyframes pgshake{25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
.pgfb{position:absolute;top:12px;left:50%;transform:translateX(-50%);padding:8px 18px;border-radius:999px;font:900 1.1rem var(--f-body,inherit);color:#fff;animation:pgpop .45s cubic-bezier(.2,1.6,.4,1)}.pgfb.ok{background:#2e7d4f}.pgfb.no{background:#c2185b}
.pgcombo{position:absolute;top:56px;right:12px;background:#d4a23a;color:#2a1b20;font-weight:900;padding:4px 12px;border-radius:999px;animation:pgpop .5s .1s both}
@keyframes pgpop{from{transform:translateX(-50%) scale(.3);opacity:0}to{opacity:1}}
.pgcombo{animation-name:pgpop2}@keyframes pgpop2{from{transform:scale(.3);opacity:0}to{transform:scale(1);opacity:1}}
.pgq{margin:4px 0 0;font-family:var(--f-display);font-size:clamp(1.25rem,5vw,1.6rem);text-align:center;line-height:1.25}.pgq b{color:#a3264f}
.pgbtns{display:grid;gap:10px}.pgbtns.three{grid-template-columns:repeat(3,1fr)}.pgbtns.names{grid-template-columns:1fr}
.pgb{border:0;border-radius:18px;padding:14px 8px;font:900 1rem var(--f-body,inherit);color:#fff;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px;touch-action:manipulation;transition:transform .08s}
.pgb:active{transform:translateY(3px)}.pgic{font-size:1.6rem}
.pgE{background:#5f9a2e;box-shadow:0 5px 0 #2f5a1e}.pgM{background:#c8901f;box-shadow:0 5px 0 #6a4a10}.pgL{background:#b7472a;box-shadow:0 5px 0 #5a1f10}
.pgg{background:var(--surface,#fff);color:var(--fg,#2a1418);border:2px solid var(--line,#eadfce);box-shadow:0 4px 0 var(--line,#eadfce);flex-direction:row;justify-content:flex-start;gap:10px;padding:14px 16px;font-family:var(--f-display);font-size:1.2rem}
.pgg i{width:14px;height:14px;border-radius:50%;flex:none}.pgg i.w{background:#d9c23a}.pgg i.r{background:#6e1630}.pgg small{margin-left:auto;display:flex;gap:4px}
.pgb.ok{outline:4px solid #2e7d4f;outline-offset:2px}.pgb.no{opacity:.55;filter:grayscale(.6)}.pgb:disabled{cursor:default}
.pgexp{border-radius:16px;padding:12px 14px;background:var(--surface,#fff);border:1px solid var(--line,#eadfce);line-height:1.5}.pgexp p{margin:6px 0 0;font-size:.9rem}
.pgmiss{width:100%;max-width:520px;text-align:left;display:flex;flex-direction:column;gap:8px}.pgmiss h3{margin:0;font-family:var(--f-display)}
.pgm{display:flex;flex-wrap:wrap;gap:6px;align-items:center;padding:8px 10px;border-radius:12px;border:1px solid var(--line,#eadfce)}.pgm span{flex-basis:100%;font-size:.82rem;color:var(--muted,#7b6a5c)}
`; document.head.appendChild(st10); }catch(e){}

/* ---------- v70: top-3 most planted white & black grapes per country ---------- */
const TOPG=[
 ["fr",{it:"Francia",fr:"France",en:"France"},[["Ugni Blanc","Trebbiano"],["Chardonnay"],["Sauvignon Blanc"]],[["Merlot"],["Grenache"],["Syrah"]]],
 ["it",{it:"Italia",fr:"Italie",en:"Italy"},[["Glera"],["Pinot Grigio","Pinot Gris"],["Trebbiano Toscano","Trebbiano"]],[["Sangiovese"],["Montepulciano"],["Merlot"]]],
 ["es",{it:"Spagna",fr:"Espagne",en:"Spain"},[["Airén"],["Macabeo (Viura)","Viura"],["Verdejo"]],[["Tempranillo"],["Garnacha","Grenache"],["Bobal",null]]],
 ["pt",{it:"Portogallo",fr:"Portugal",en:"Portugal"},[["Fernão Pires"],["Síria (Roupeiro)",null],["Arinto"]],[["Tinta Roriz / Aragonez","Tempranillo"],["Touriga Franca"],["Castelão"]]],
 ["de",{it:"Germania",fr:"Allemagne",en:"Germany"},[["Riesling"],["Müller-Thurgau"],["Grauburgunder","Pinot Gris"]],[["Spätburgunder","Pinot Noir"],["Dornfelder"],["Portugieser",null]]],
 ["at",{it:"Austria",fr:"Autriche",en:"Austria"},[["Grüner Veltliner"],["Welschriesling"],["Riesling"]],[["Zweigelt"],["Blaufränkisch"],["Blauer Portugieser",null]]],
 ["hu",{it:"Ungheria",fr:"Hongrie",en:"Hungary"},[["Bianca",null],["Cserszegi Fűszeres",null],["Furmint"]],[["Kékfrankos","Blaufränkisch"],["Cabernet Sauvignon"],["Merlot"]]],
 ["gr",{it:"Grecia",fr:"Grèce",en:"Greece"},[["Savatiano",null],["Roditis",null],["Assyrtiko"]],[["Agiorgitiko"],["Liatiko",null],["Xinomavro"]]],
 ["us",{it:"Stati Uniti",fr:"États-Unis",en:"USA"},[["Chardonnay"],["Pinot Gris"],["Colombard"]],[["Cabernet Sauvignon"],["Pinot Noir"],["Merlot"]]],
 ["ca",{it:"Canada",fr:"Canada",en:"Canada"},[["Chardonnay"],["Riesling"],["Vidal"]],[["Merlot"],["Cabernet Franc"],["Pinot Noir"]]],
 ["cl",{it:"Cile",fr:"Chili",en:"Chile"},[["Sauvignon Blanc"],["Chardonnay"],["Moscatel de Alejandría"]],[["Cabernet Sauvignon"],["País"],["Carmenère"]]],
 ["ar",{it:"Argentina",fr:"Argentine",en:"Argentina"},[["Pedro Giménez",null],["Torrontés Riojano","Torrontés"],["Chardonnay"]],[["Malbec"],["Bonarda"],["Cabernet Sauvignon"]]],
 ["za",{it:"Sudafrica",fr:"Afrique du Sud",en:"South Africa"},[["Chenin Blanc"],["Colombard"],["Sauvignon Blanc"]],[["Cabernet Sauvignon"],["Shiraz","Syrah"],["Pinotage"]]],
 ["au",{it:"Australia",fr:"Australie",en:"Australia"},[["Chardonnay"],["Sauvignon Blanc"],["Sémillon"]],[["Shiraz","Syrah"],["Cabernet Sauvignon"],["Merlot"]]],
 ["nz",{it:"Nuova Zelanda",fr:"Nouvelle-Zélande",en:"New Zealand"},[["Sauvignon Blanc"],["Chardonnay"],["Pinot Gris"]],[["Pinot Noir"],["Merlot"],["Syrah"]]]];
const TOPGN={
 it:{ar:"Senza contare le uve rosa Cereza e Criolla, molto piantate.",gr:"Il Roditis ha la buccia rosata ma dà vini bianchi.",pt:"Il Tempranillo si chiama Tinta Roriz nel Douro e Aragonez in Alentejo.",fr:"L'Ugni Blanc (Trebbiano) serve soprattutto per il Cognac e l'Armagnac.",us:"Lo Zinfandel segue subito dopo il Merlot."},
 fr:{ar:"Sans compter les raisins roses Cereza et Criolla, très plantés.",gr:"Le Roditis a la peau rosée mais donne des vins blancs.",pt:"Le Tempranillo s'appelle Tinta Roriz dans le Douro et Aragonez en Alentejo.",fr:"L'Ugni Blanc (Trebbiano) sert surtout au Cognac et à l'Armagnac.",us:"Le Zinfandel suit juste après le Merlot."},
 en:{ar:"Not counting the widely planted pink grapes Cereza and Criolla.",gr:"Roditis is pink-skinned but makes white wines.",pt:"Tempranillo is called Tinta Roriz in the Douro and Aragonez in Alentejo.",fr:"Ugni Blanc (Trebbiano) is used mainly for Cognac and Armagnac.",us:"Zinfandel comes right after Merlot."}};
Object.assign(T.it,{tr_topg:"I 3 vitigni più piantati per paese",trd_topg:"Bianchi e neri: il podio di ogni paese.",tgW:"Bianchi",tgB:"Neri",tgHide:"Mettiti alla prova",tgHideD:"Nascondi i nomi e tocca per scoprirli.",tgShow:"Mostra tutto",tgNote:"Classifica per superficie vitata (dati indicativi, cambiano negli anni). ★ = uva principale da sapere.",tgCountries:"paesi"});
Object.assign(T.fr,{tr_topg:"Les 3 cépages les plus plantés par pays",trd_topg:"Blancs et noirs : le podium de chaque pays.",tgW:"Blancs",tgB:"Noirs",tgHide:"Testez-vous",tgHideD:"Masquez les noms et touchez pour les découvrir.",tgShow:"Tout afficher",tgNote:"Classement par surface plantée (données indicatives, qui évoluent avec les années). ★ = cépage principal à connaître.",tgCountries:"pays"});
Object.assign(T.en,{tr_topg:"The 3 most planted grapes per country",trd_topg:"White and black: each country's podium.",tgW:"White",tgB:"Black",tgHide:"Test yourself",tgHideD:"Hide the names and tap to reveal them.",tgShow:"Show all",tgNote:"Ranked by vineyard area (indicative figures that change over the years). ★ = principal grape to know.",tgCountries:"countries"});
try{ TABG.topg="wine"; SUBV.topg="wine"; SUBT.topg="tr_topg"; }catch(e){}
let TGH=false;
function tgFlag(c){ const f=(typeof FLG!=="undefined"&&FLG[c])||["h",["#ccc","#eee"]]; const [d,cols]=f; return `<span class="tgflag" style="background:linear-gradient(${d==="v"?"90deg":"180deg"},${cols.map((x,i)=>`${x} ${i*100/cols.length}% ${(i+1)*100/cols.length}%`).join(",")})"></span>`; }
function tgItem(it,i,c){ const nm=it[0], key=it.length>1?it[1]:it[0]; const g=key&&GRAPES.find(x=>x.k===key); const star=g&&phIsMain(g)?`<em>★</em>`:""; const inner=`<span class="tgrk">${["🥇","🥈","🥉"][i]}</span><span class="tgnm">${esc(nm)}${star}</span>`;
  return g?`<button type="button" class="tgit ${c}" data-gsee2="${esc(g.k)}">${inner}</button>`:`<div class="tgit ${c}">${inner}</div>`; }
function renderTopG(){ const l=lang; const nm=o=>o[l]||o.it;
  return `<section class="view tg${TGH?" hide":""}">
   <div class="qzhero"><div class="qzhtx"><small>${esc(t("tr_grapes"))}</small><h1>${esc(t("tr_topg"))}</h1></div>${gfree("n11",90)}<p class="phi">${esc(t("trd_topg"))}</p>
   <button type="button" class="qzgo" data-tgh="1">${TGH?"👁 "+esc(t("tgShow")):"🙈 "+esc(t("tgHide"))}</button>${TGH?"":`<p class="phi" style="font-size:.8rem">${esc(t("tgHideD"))}</p>`}</div>
   <p class="phna">${esc(t("tgNote"))}</p>
   <div class="tggrid">${TOPG.map(([c,n,W,B])=>`<article class="tgc"><h2>${tgFlag(c)}${esc(nm(n))}</h2>
    <div class="tgcols"><div><h3><i class="w"></i>${esc(t("tgW"))}</h3>${W.map((x,i)=>tgItem(x,i,"w")).join("")}</div><div><h3><i class="r"></i>${esc(t("tgB"))}</h3>${B.map((x,i)=>tgItem(x,i,"r")).join("")}</div></div>
    ${(TOPGN[l]||TOPGN.it)[c]?`<p class="tgn">${esc((TOPGN[l]||TOPGN.it)[c])}</p>`:""}</article>`).join("")}</div></section>`; }
document.addEventListener("click",e=>{ if(view!=="topg") return; const h=e.target.closest&&e.target.closest("[data-tgh]"); if(h){ TGH=!TGH; render(); return; }
  if(TGH){ const it=e.target.closest&&e.target.closest(".tgit"); if(it&&!it.classList.contains("on")){ e.preventDefault(); e.stopImmediatePropagation(); it.classList.add("on"); } } },true);
try{ const st11=document.createElement("style"); st11.textContent=`
.rv-topg{--bg:linear-gradient(150deg,#13375e,#2c6aa0 55%,#d4a23a);--sh:#0b2340}
.tg{display:flex;flex-direction:column;gap:14px}
.tggrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,350px),1fr));gap:12px}
.tgc{border-radius:20px;padding:14px;background:var(--surface,#fff);border:1px solid var(--line,#eadfce);box-shadow:0 5px 0 color-mix(in srgb,#4a0f22 12%,transparent);display:flex;flex-direction:column;gap:10px}
.tgc h2{margin:0;font-family:var(--f-display);font-size:1.3rem;display:flex;align-items:center;gap:10px}
.tgflag{width:30px;height:20px;border-radius:4px;flex:none;box-shadow:0 0 0 1px rgba(0,0,0,.12)}
.tgcols{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px}.tgnm{min-width:0;overflow-wrap:break-word;hyphens:auto}
.tgcols h3{margin:0 0 6px;font-size:.7rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted,#7b6a5c);display:flex;align-items:center;gap:6px}
.tgcols h3 i{width:10px;height:10px;border-radius:50%}.tgcols h3 i.w{background:#d9c23a}.tgcols h3 i.r{background:#6e1630}
.tgit{all:unset;box-sizing:border-box;width:100%;display:flex;align-items:center;gap:6px;padding:7px 9px;margin-bottom:5px;border-radius:12px;font-size:.86rem;font-weight:700;cursor:pointer;line-height:1.2}
div.tgit{cursor:default}
.tgit.w{background:#fbf3d2;color:#4a3a08}.tgit.r{background:#f6dde3;color:#4a0f22}
.tgit em{font-style:normal;color:#c2185b;margin-left:4px}
.tgrk{flex:none}
.tgn{margin:0;font-size:.76rem;color:var(--muted,#7b6a5c);line-height:1.35;border-top:1px dashed var(--line,#eadfce);padding-top:8px}
.tg.hide .tgit .tgnm{filter:blur(6px);transition:filter .25s}.tg.hide .tgit.on .tgnm{filter:none}.tg.hide .tgit{cursor:pointer}
@media (max-width:380px){.tgcols{grid-template-columns:1fr}}
`; document.head.appendChild(st11); }catch(e){}

/* ---------- v72: one "Grapes" card in Review that opens every grape topic ---------- */
Object.assign(T.it,{tr_uve:"Le uve",trd_uve:"Schede, confronti, germogliamento e maturazione, uve più piantate per paese: tutto sulle uve in un solo posto.",uvIntro:"Scegli un argomento. Comincia dalle uve principali: sono quelle che tornano più spesso nelle domande.",uvPlay:"Gioca con le uve",tab_uve:"Le uve"});
Object.assign(T.fr,{tr_uve:"Les cépages",trd_uve:"Fiches, comparatifs, débourrement et maturité, cépages les plus plantés par pays : tout sur les cépages au même endroit.",uvIntro:"Choisissez un thème. Commencez par les cépages principaux : ce sont ceux qui reviennent le plus souvent dans les questions.",uvPlay:"Jouer avec les cépages",tab_uve:"Les cépages"});
Object.assign(T.en,{tr_uve:"Grapes",trd_uve:"Profiles, comparisons, budburst and ripening, most planted grapes by country: everything about grapes in one place.",uvIntro:"Pick a topic. Start with the principal grapes: they are the ones that come up most often in the questions.",uvPlay:"Play with grapes",tab_uve:"Grapes"});
try{ TABG.uve="wine"; SUBV.uve="wine"; SUBT.uve="tr_uve"; ["grapes","gtab","phen","topg"].forEach(v=>{ SUBV[v]="uve"; TABG[v]="wine"; }); }catch(e){}
function renderUve(){
  const tile=(g,ic,ti,sub,cls,num,unit,deco)=>`<button type="button" class="rvt2 ${cls}" data-go="${g}">${RVDECO[deco]||""}<i class="rvshine"></i><span class="rvic">${ICO[ic]||""}</span><span class="rvtx"><b>${esc(ti)}</b><span>${esc(sub)}</span></span>${num!==""?`<span class="rvnum"><b>${num}</b><small>${esc(unit)}</small></span>`:""}</button>`;
  return `<section class="view hub area-wine rv2 uvh">
   <div class="qzhero"><div class="qzhtx"><small>${esc(t("rvKick"))}</small><h1>${esc(t("tr_uve"))}</h1></div>${gfree("n11",90)}<p class="phi">${esc(t("uvIntro"))}</p></div>
   <div class="rvgrid2">
    ${tile("grapes","grapes",t("tr_grapes"),t("trd_grapes"),"rv-grapes wide",GRAPES.length,t("rvGrapes"),"grape")}
    ${tile("phen","gtab",t("tr_phen"),t("trd_phen"),"rv-phen",PHMAIN.length,t("rvGrapes"),"grape")}
    ${tile("gtab","gtab",t("tr_gtab"),t("trd_gtab"),"rv-gtab",GRAPES.length,t("rvGrapes"),"grape")}
    ${tile("topg","grapes",t("tr_topg"),t("trd_topg"),"rv-topg wide",TOPG.length,t("tgCountries"),"bottle")}
   </div>
   <button type="button" class="uvplay" data-go="g_phen"><span>🎮</span><b>${esc(t("uvPlay"))}</b><small>${esc(t("gPhen"))} ▸</small></button>
   <button type="button" class="uvplay" data-go="g_terr" style="background:linear-gradient(120deg,#1f5a7a,#2f8a83)"><span>🗺️</span><b>${esc(t("gTerr"))}</b><small>${esc(t("trPairs"))} ▸</small></button>
  </section>`; }
try{ const st12=document.createElement("style"); st12.textContent=`
.rv-uve{--bg:linear-gradient(140deg,#3d0f2e,#7a1d4f 45%,#5f9a2e);--sh:#25081b}
.uvh{display:flex;flex-direction:column;gap:14px}
.uvplay{display:flex;align-items:center;gap:12px;border:0;border-radius:18px;padding:14px 18px;background:linear-gradient(120deg,#2f7a43,#5f9a2e);color:#fff;font:inherit;cursor:pointer;box-shadow:0 5px 0 #1d4a28;text-align:left}
.uvplay span{font-size:1.6rem}.uvplay b{font-family:var(--f-display);font-size:1.15rem;flex:1}.uvplay small{font-weight:800;opacity:.9}
`; document.head.appendChild(st12); }catch(e){}

/* ---------- v73: "Key figures" — complete, fully localised, redesigned ---------- */
(function(){
 const S=(k,t,items)=>[k,t,items], X=(v,l,d)=>[v,l,d||["","",""]];
 const add=(k,items)=>{ const s=NUMS.find(x=>x[0]===k); if(s) s[2].push(...items); };
 /* exam & tasting grid */
 NUMS.unshift(S("esa",["Esame e degustazione","Examen et dégustation","Exam and tasting"],[
  X(["55 %","55 %","55%"],["Punteggio minimo per superare ogni prova","Note minimale pour réussir chaque épreuve","Pass mark for each paper"],["Teoria e degustazione si superano separatamente","Théorie et dégustation se valident séparément","Theory and tasting are passed separately"]),
  X(["2 ore","2 heures","2 hours"],["Durata della prova teorica, senza appunti","Durée de l'épreuve théorique, sans notes","Length of the theory paper, closed book"],["50 domande a scelta multipla + 4 domande a risposta breve","50 QCM + 4 questions à réponse courte","50 multiple-choice + 4 short written-answer questions"]),
  X(["50","50","50"],["Domande a scelta multipla","Questions à choix multiples","Multiple-choice questions"],["1 punto ciascuna, nessuna penalità per gli errori","1 point chacune, aucune pénalité en cas d'erreur","1 mark each, no penalty for wrong answers"]),
  X(["4 × 25","4 × 25","4 × 25"],["Domande a risposta breve e punti per domanda","Questions à réponse courte et points par question","Short written-answer questions and marks each"],["Un punto per ogni idea precisa: causa → effetto","Un point par idée précise : cause → effet","One mark per precise idea: cause → effect"]),
  X(["30 min","30 min","30 min"],["Prova di degustazione alla cieca","Épreuve de dégustation à l'aveugle","Blind tasting paper"],["2 vini fermi: un bianco (20 punti) e un rosso (21 punti)","2 vins tranquilles : un blanc (20 points) et un rouge (21 points)","2 still wines: one white (20 marks) and one red (21 marks)"]),
  X(["< 11 %","< 11 %","< 11%"],["Alcol basso (vini fermi)","Alcool faible (vins tranquilles)","Low alcohol (still wines)"],["Medio 11–13,9 %, alto ≥ 14 %","Moyen 11–13,9 %, élevé ≥ 14 %","Medium 11–13.9%, high ≥ 14%"]),
  X(["15–16,4 %","15–16,4 %","15–16.4%"],["Alcol basso (vini fortificati)","Alcool faible (vins mutés)","Low alcohol (fortified wines)"],["Medio 16,5–18,4 %, alto ≥ 18,5 %","Moyen 16,5–18,4 %, élevé ≥ 18,5 %","Medium 16.5–18.4%, high ≥ 18.5%"]),
  X(["6","6","6"],["Livelli di dolcezza della griglia","Niveaux de sucrosité de la grille","Sweetness levels on the grid"],["Secco, abboccato, semisecco, amabile, dolce, molto dolce","Sec, pas tout à fait sec, demi-sec, moelleux, doux, très doux","Dry, off-dry, medium-dry, medium-sweet, sweet, luscious"]),
  X(["4","4","4"],["Criteri per giudicare la qualità","Critères pour juger la qualité","Criteria for judging quality"],["Equilibrio, lunghezza, intensità, complessità","Équilibre, longueur, intensité, complexité","Balance, length, intensity, complexity"])]));
 /* sweet & fortified */
 const iSh=NUMS.findIndex(x=>x[0]==="she");
 NUMS.splice(iSh,0,S("dol",["Vini dolci e fortificati","Vins doux et mutés","Sweet and fortified wines"],[
  X(["45 g/l","45 g/l","45 g/l"],["Oltre questa soglia un vino è «dolce» (UE)","Au-delà de ce seuil, un vin est « doux » (UE)","Above this level a wine is 'sweet' (EU)"],["Secco ≤ 4, abboccato ≤ 12, amabile ≤ 45 g/l","Sec ≤ 4, demi-sec ≤ 12, moelleux ≤ 45 g/l","Dry ≤ 4, medium-dry ≤ 12, medium ≤ 45 g/l"]),
  X(["−7 °C","−7 °C","−7 °C"],["Temperatura massima per vendemmiare l'Eiswein","Température maximale pour vendanger l'Eiswein","Highest temperature for picking Eiswein"],["Icewine del Canada: −8 °C","Icewine du Canada : −8 °C","Canadian Icewine: −8 °C"]),
  X(["15 % vol","15 % vol","15% abv"],["Alcol minimo di un vin doux naturel","Alcool minimal d'un vin doux naturel","Minimum alcohol of a vin doux naturel"],["Mutage con alcol di vino durante la fermentazione (es. Muscat de Beaumes-de-Venise)","Mutage à l'alcool de vin pendant la fermentation (ex. muscat de Beaumes-de-Venise)","Grape spirit added during fermentation (e.g. Muscat de Beaumes-de-Venise)"]),
  X(["5–6","5–6","5–6"],["Puttonyos indicati sul Tokaji Aszú","Puttonyos indiqués sur le tokaji aszú","Puttonyos shown on Tokaji Aszú"],["Oggi il minimo è 120 g/l di zucchero residuo","Aujourd'hui le minimum est de 120 g/l de sucre résiduel","Today the minimum is 120 g/l residual sugar"]),
  X(["4","4","4"],["Categorie del Rutherglen Muscat","Catégories du Rutherglen Muscat","Rutherglen Muscat categories"],["Rutherglen, Classic, Grand, Rare","Rutherglen, Classic, Grand, Rare","Rutherglen, Classic, Grand, Rare"]),
  X(["45–50 °C","45–50 °C","45–50 °C"],["Estufagem del Madeira","Estufagem du madère","Madeira estufagem"],["Almeno 3 mesi in vasca riscaldata; il canteiro invecchia in soffitte calde per anni","Au moins 3 mois en cuve chauffée ; le canteiro vieillit des années dans des greniers chauds","At least 3 months in heated tanks; canteiro ages for years in warm lofts"]),
  X(["4","4","4"],["Vitigni nobili del Madeira, dal più secco al più dolce","Cépages nobles du madère, du plus sec au plus doux","Noble Madeira grapes, driest to sweetest"],["Sercial, Verdelho, Boal, Malmsey","Sercial, verdelho, boal, malmsey","Sercial, Verdelho, Boal, Malmsey"]),
  X(["6–8 %","6–8 %","6–8%"],["Alcol del mosto quando si aggiunge l'aguardente al Porto","Alcool du moût quand on ajoute l'aguardente au porto","Must alcohol when aguardente is added to Port"],["Lo zucchero restante rende il Porto dolce","Le sucre restant rend le porto doux","The remaining sugar makes Port sweet"]),
  X(["7 anni","7 ans","7 years"],["Colheita: invecchiamento minimo in botte","Colheita : vieillissement minimal en fût","Colheita: minimum ageing in cask"],["Tawny di una sola annata","Tawny d'un seul millésime","Single-vintage tawny"])]));
 add("spu",[
  X(["7","7","7"],["Livelli di dosaggio dei vini spumanti","Niveaux de dosage des effervescents","Sweetness levels for sparkling wines"],["Brut Nature 0–3, Extra Brut 0–6, Brut < 12, Extra Dry 12–17, Sec 17–32, Demi-Sec 32–50, Doux > 50 g/l","Brut nature 0–3, extra-brut 0–6, brut < 12, extra-dry 12–17, sec 17–32, demi-sec 32–50, doux > 50 g/l","Brut Nature 0–3, Extra Brut 0–6, Brut < 12, Extra Dry 12–17, Sec 17–32, Demi-Sec 32–50, Doux > 50 g/l"]),
  X(["4 000 kg → 2 550 l","4 000 kg → 2 550 l","4,000 kg → 2,550 l"],["Pressatura dello Champagne (un marc)","Pressurage en Champagne (un marc)","Champagne pressing (one marc)"],["Cuvée 2 050 l + taille 500 l","Cuvée 2 050 l + taille 500 l","Cuvée 2,050 l + taille 500 l"])]);
 /* localise values / fix numbers */
 const loc=(v,l)=>{ if(l===0) return v; let s=v;
  s=s.replace(/(\d)\s*mesi\b/g,l===1?"$1 mois":"$1 months").replace(/\b1 anno\b/g,l===1?"1 an":"1 year").replace(/(\d)\s*anni\b/g,l===1?"$1 ans":"$1 years").replace(/ o più/g,l===1?" ou plus":" or more");
  if(l===2){ s=s.replace(/(\d)\.(\d{3})\b/g,"$1,$2").replace(/(\d),(\d)(?!\d{2}\b)/g,"$1.$2").replace(/\s%\s?vol\b/g,"% abv").replace(/(\d)\s%/g,"$1%"); }
  if(l===1){ s=s.replace(/(\d)\.(\d{3})\b/g,"$1 $2"); }
  return s; };
 NUMS.forEach(sec=>sec[2].forEach(it=>{ it[0]=[it[0][0],loc(it[0][1],1),loc(it[0][2],2)]; }));
})();
Object.assign(T.it,{tr_nums:"Le cifre da sapere",trd_nums:"Tutti i numeri che servono all'esame: crus, affinamenti, percentuali, soglie.",nmIntro:"Cerca, filtra per tema e mettiti alla prova: nascondi le cifre e tocca per scoprirle.",nmHide:"Mettiti alla prova",nmShow:"Mostra le cifre",nmSecs:"temi",nmTap:"Tocca una carta per scoprire la cifra."});
Object.assign(T.fr,{tr_nums:"Les chiffres à connaître",trd_nums:"Tous les chiffres utiles à l'examen : crus, élevages, pourcentages, seuils.",nmIntro:"Cherchez, filtrez par thème et testez-vous : masquez les chiffres et touchez pour les découvrir.",nmHide:"Testez-vous",nmShow:"Afficher les chiffres",nmSecs:"thèmes",nmTap:"Touchez une carte pour découvrir le chiffre."});
Object.assign(T.en,{tr_nums:"Key figures",trd_nums:"Every number you need for the exam: crus, ageing rules, percentages, thresholds.",nmIntro:"Search, filter by topic and test yourself: hide the figures and tap to reveal them.",nmHide:"Test yourself",nmShow:"Show the figures",nmSecs:"topics",nmTap:"Tap a card to reveal the figure."});
const NMSTY={esa:["🎓","#6b2fa0","#a35ad8"],vig:["🌿","#2f7a43","#6fb04a"],vin:["🧪","#7a1d3a","#c2185b"],bdx:["🏰","#6e1630","#a3264f"],bgn:["⛪","#8a4b1e","#d08a3a"],rho:["☀️","#b8452a","#e37a3a"],loi:["🏞️","#1f6a7a","#3fa3b0"],spu:["🥂","#a07a12","#d9b23a"],ita:["🇮🇹","#1d7a4a","#c63a3a"],esp:["🇪🇸","#b0202a","#e0a020"],dol:["🍯","#9a5a10","#e0a030"],she:["🏺","#7a4a1a","#b8733a"],ger:["🏔️","#2a4a7a","#5a8ad0"],nw:["🌎","#1f5a8a","#3a9ad0"]};
let NMH=false;
renderNums=function(){ const l=L(); const tot=NUMS.reduce((a,s)=>a+s[2].length,0);
  const st=k=>NMSTY[k]||["🔢","#6e1630","#a3264f"];
  const chips=[["all","🔢",t("nmAll")],...NUMS.map(s=>[s[0],st(s[0])[0],s[1][l]])].map(([k,ic,x])=>`<button type="button" class="chip nmchip" data-nm2sec="${k}" aria-pressed="${nmSec===k}"><span>${ic}</span>${esc(x)}</button>`).join("");
  const body=NUMS.map(s=>{ const [ic,c1,c2]=st(s[0]); return `<section class="nm2sec" data-nms="${s[0]}" style="--c1:${c1};--c2:${c2}"><header class="nm2h"><span class="nm2ic">${ic}</span><h3>${esc(s[1][l])}</h3><small>${s[2].length}</small></header><div class="nm2grid">${s[2].map(it=>`<button type="button" class="nm2card" data-nmq="${esc(dcNorm(it[0].concat(it[1],it[2]).join(" ")))}"><b class="nm2v">${esc(it[0][l])}</b><span class="nm2l">${esc(it[1][l])}</span>${it[2][l]?`<span class="nm2d">${esc(it[2][l])}</span>`:""}</button>`).join("")}</div></section>`; }).join("");
  return `<section class="view nm2${NMH?" hide":""}">
   <div class="qzhero nm2hero"><div class="qzhtx"><small>${esc(t("rvKick"))}</small><h1>${esc(t("tr_nums"))}</h1></div>${gfree("n11",90)}<p class="phi">${esc(t("nmIntro"))}</p>
    <div class="nm2stats"><div><b>${tot}</b><span>${esc(t("nmN"))}</span></div><div><b>${NUMS.length}</b><span>${esc(t("nmSecs"))}</span></div></div>
    <button type="button" class="qzgo" data-nmh="1">${NMH?"👁 "+esc(t("nmShow")):"🙈 "+esc(t("nmHide"))}</button>${NMH?`<p class="phi" style="font-size:.8rem">${esc(t("nmTap"))}</p>`:""}</div>
   <div class="nm2bar"><div class="nm2search"><span>🔎</span><input type="search" id="nm2-q" placeholder="${esc(t("nmSearch"))}" value="${esc(nmQ)}" autocomplete="off" spellcheck="false"><span id="nm2-n"></span></div><div class="nm2chips">${chips}</div></div>
   ${body}<p class="muted" id="nm2-none" hidden>${esc(t("dcNone"))}</p></section>`; };
function nm2Filter(){ const q=dcNorm(nmQ.trim()); let n=0; document.querySelectorAll(".nm2sec").forEach(s=>{ let k=0; const on=nmSec==="all"||s.dataset.nms===nmSec; s.querySelectorAll(".nm2card").forEach(c=>{ const ok=on&&(!q||c.dataset.nmq.includes(q)); c.hidden=!ok; if(ok) k++; }); s.hidden=!k; n+=k; });
  const c=document.getElementById("nm2-n"); if(c) c.textContent=n+" "+t("nmN"); const z=document.getElementById("nm2-none"); if(z) z.hidden=!!n; }
document.addEventListener("input",e=>{ if(e.target&&e.target.id==="nm2-q"){ nmQ=e.target.value; nm2Filter(); } });
new MutationObserver(()=>{ const r=document.querySelector(".nm2:not([data-nmok])"); if(r){ r.dataset.nmok=1; nm2Filter(); } }).observe(document.body,{childList:true,subtree:true});
document.addEventListener("click",e=>{ if(view!=="nums") return; const sc=e.target.closest&&e.target.closest("[data-nm2sec]"); if(sc){ nmSec=sc.dataset.nm2sec; document.querySelectorAll("[data-nm2sec]").forEach(x=>x.setAttribute("aria-pressed",x===sc)); nm2Filter(); return; } const h=e.target.closest&&e.target.closest("[data-nmh]"); if(h){ NMH=!NMH; render(); return; }
  const c=e.target.closest&&e.target.closest(".nm2card"); if(c&&NMH) c.classList.toggle("on"); });
try{ const st13=document.createElement("style"); st13.textContent=`
.nm2{gap:16px}
.nm2stats{display:flex;gap:10px;margin:12px 0 4px}.nm2stats div{background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.22);border-radius:14px;padding:8px 14px;display:flex;flex-direction:column;line-height:1.1}
.nm2stats b{font-family:var(--f-display);font-size:1.5rem;color:#f3cd8a}.nm2stats span{font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;opacity:.85}
.nm2hero .qzgo{margin-top:10px}
.nm2bar{position:sticky;top:0;z-index:5;background:var(--bg,#faf6ef);padding:8px 0;display:flex;flex-direction:column;gap:8px}
.nm2chips{display:flex;gap:6px;overflow-x:auto;flex-wrap:nowrap;padding-bottom:4px;scrollbar-width:none}.nm2chips::-webkit-scrollbar{display:none}
.nmchip{white-space:nowrap;display:inline-flex;gap:6px;align-items:center}
.nm2sec{display:flex;flex-direction:column;gap:10px}
.nm2h{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:16px;background:linear-gradient(120deg,var(--c1),var(--c2));color:#fff;box-shadow:0 4px 0 color-mix(in srgb,var(--c1) 70%,#000)}
.nm2h h3{margin:0;flex:1;font-family:var(--f-display);font-size:1.15rem;color:#fff}.nm2ic{font-size:1.3rem;width:34px;height:34px;display:grid;place-items:center;background:rgba(255,255,255,.2);border-radius:10px}
.nm2h small{font-weight:900;background:rgba(255,255,255,.22);padding:3px 10px;border-radius:999px}
.nm2grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,250px),1fr));gap:10px}
.nm2card{all:unset;box-sizing:border-box;cursor:default;display:flex;flex-direction:column;gap:5px;padding:14px 14px 13px 16px;border-radius:16px;background:var(--surface,#fff);border:1px solid var(--line,#eadfce);border-left:5px solid var(--c2);box-shadow:0 3px 0 color-mix(in srgb,var(--c1) 14%,transparent);transition:transform .15s}
.nm2card:hover{transform:translateY(-2px)}
.nm2card .nm2v{font-family:var(--f-display);font-size:1.7rem;line-height:1.05;background:linear-gradient(120deg,var(--c1),var(--c2));-webkit-background-clip:text;background-clip:text;color:transparent;font-weight:700}
.nm2card .nm2l{font-weight:800;font-size:.9rem;line-height:1.3;color:var(--fg,#2a1b20)}
.nm2card .nm2d{font-size:.8rem;line-height:1.4;color:var(--muted,#7b6a5c)}
.nm2.hide .nm2card{cursor:pointer}.nm2.hide .nm2card .nm2v{filter:blur(9px);transition:filter .25s}.nm2.hide .nm2card.on .nmv{filter:none}
.nm2.hide .nm2card .nm2d{opacity:.25;transition:opacity .25s}.nm2.hide .nm2card.on .nmd{opacity:1}
.nm2search{display:flex;align-items:center;gap:10px;background:var(--surface,#fff);border:2px solid color-mix(in srgb,#a3264f 35%,transparent);border-radius:999px;padding:4px 6px 4px 16px;box-shadow:0 3px 0 color-mix(in srgb,#a3264f 15%,transparent)}
.view.nm2 .nm2search input[type=search]{flex:1;min-width:0;border:0!important;outline:0;background:transparent!important;box-shadow:none!important;font:600 1rem var(--f-body,system-ui)!important;color:inherit;padding:9px 0!important;border-radius:0!important}
.nm2search #nm2-n{font-size:.75rem;font-weight:800;color:#fff;background:#a3264f;border-radius:999px;padding:6px 12px;white-space:nowrap}
`; document.head.appendChild(st13); }catch(e){}
