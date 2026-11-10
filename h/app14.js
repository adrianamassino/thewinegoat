/* ---------- v77: clean wine-atlas maps (country → region → sub-region), interactive explorer, geo-relevance filter ---------- */
Object.assign(T.it,{tr_atlas:"Atlante interattivo",trd_atlas:"Tocca un paese, poi una regione, poi una sottoregione: zoom, vitigni, suoli e regole di ogni zona.",atAll:"Tutta la mappa",atOpen:"Apri la mappa di",atZoom:"Zoom sulla zona",atGr:"Vitigni",atSoil:"Suoli",atLaw:"Livello",atTap:"Tocca una zona sulla mappa o nella legenda.",atExplore:"Esplora sulla mappa interattiva",atBack:"Torna al quiz",atCountries:"Paesi",atZones:"zone"});
Object.assign(T.fr,{tr_atlas:"Atlas interactif",trd_atlas:"Touchez un pays, puis une région, puis une sous-région : zoom, cépages, sols et règles de chaque zone.",atAll:"Toute la carte",atOpen:"Ouvrir la carte de",atZoom:"Zoomer sur la zone",atGr:"Cépages",atSoil:"Sols",atLaw:"Niveau",atTap:"Touchez une zone sur la carte ou dans la légende.",atExplore:"Explorer sur la carte interactive",atBack:"Retour au quiz",atCountries:"Pays",atZones:"zones"});
Object.assign(T.en,{tr_atlas:"Interactive atlas",trd_atlas:"Tap a country, then a region, then a sub-region: zoom, grapes, soils and rules for every area.",atAll:"Whole map",atOpen:"Open the map of",atZoom:"Zoom on the area",atGr:"Grapes",atSoil:"Soils",atLaw:"Level",atTap:"Tap an area on the map or in the legend.",atExplore:"Explore on the interactive map",atBack:"Back to the quiz",atCountries:"Countries",atZones:"areas"});
try{ TABG.atlas="wine"; SUBV.atlas="wine"; SUBT.atlas="tr_atlas"; }catch(e){}
const APAL=["#e5b937","#d9577f","#ef9a3c","#5d8c58","#45a9bd","#a7bf45","#b9526a","#7563b0","#d47f3a","#3a87b0","#8fb07a","#c98bb0","#c7a25a","#5aa58f"];
const pathBox=d=>{ const n=(d.match(/-?\d+(\.\d+)?/g)||[]).map(Number); let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9; for(let i=0;i+1<n.length;i+=2){ const x=n[i],y=n[i+1]; if(x<x0)x0=x; if(x>x1)x1=x; if(y<y0)y0=y; if(y>y1)y1=y; } return x1<x0?null:[x0,y0,x1-x0,y1-y0]; };
const itemBox=x=>x[5]==="z"&&x[7]?pathBox(x[7]):[x[2]-20,x[3]-20,40,40];
const atName=x=>(x[0]==="c"?(typeof mLab==="function"?mLab(x[1]):x[1]):mName(x[1])).replace(/\s*\(grand cru\)$/i,"");
function atChild(mid,k){ return (MTREE[mid]||[]).find(c=>MBY[c]&&(MBY[c].t.some(t=>t.replace(/\s*\(.*\)$/,"")===mName(k))||MBY[c].t[2]===k||(typeof GQREG!=="undefined"&&(GQREG[c]||[])[0]===k))); }
/* opts: hl:[i], vb:[x,y,w,h], sel:i, inter:true, relief:true */
function atlasSvg(mid,o){ o=o||{}; const m=MBY[mid], G=MGEO[mid]; if(!m||!G) return ""; const u="at"+(++GQUID);
  const vb=o.vb||[-G.w*.02,-G.h*.02,G.w*1.04,G.h*1.04], s=vb[2]/1000, fs=Math.max(vb[2],vb[3]*.75)*.026;
  const hl=o.hl||[], H=new Map(); hl.forEach((j,q)=>H.set(j,q));
  let o_=`<defs><clipPath id="${u}c"><path d="${G.land}"/></clipPath></defs>`;
  o_+=`<rect x="${vb[0]-vb[2]}" y="${vb[1]-vb[3]}" width="${vb[2]*3}" height="${vb[3]*3}" fill="#bcd9ec"/><path d="${G.land}" fill="#f3f0e8" stroke="#9fc3dc" stroke-width="${2.2*s}"/>`;
  if(o.relief!==false) o_+=`<image href="relief/${mid}.jpg" x="0" y="0" width="${G.w}" height="${G.h}" preserveAspectRatio="none" clip-path="url(#${u}c)" style="filter:grayscale(1) contrast(1.25)" opacity=".22"/>`;
  o_+=`<path d="${G.lake||""}" fill="#bcd9ec"/><path d="${G.b1||""}" fill="none" stroke="rgba(120,110,100,.35)" stroke-width="${1*s}" stroke-dasharray="${5*s} ${4*s}"/><path d="${G.b0||""}" fill="none" stroke="#6f6a66" stroke-width="${1.8*s}" stroke-dasharray="${9*s} ${4*s} ${2*s} ${4*s}"/>`;
  o_+=`<path d="${G.riv||""}" fill="none" stroke="#86b6dc" stroke-width="${1.6*s}" stroke-linecap="round"/>`;
  const zones=m.it.map((x,i)=>[x,i]).filter(([x])=>x[0]==="w"&&x[5]==="z").sort((a,b)=>(b[0][6]-a[0][6])||((itemBox(b[0])||[0,0,0,0])[2]*(itemBox(b[0])||[0,0,0,0])[3]-(itemBox(a[0])||[0,0,0,0])[2]*(itemBox(a[0])||[0,0,0,0])[3]));
  const col=i=>APAL[i%APAL.length];
  const NEU=["#e6d9bd","#dacdae","#ece2cb","#e0d3b6","#d4c6a6"]; const anyOn=hl.length||o.sel!=null;
  zones.forEach(([x,i])=>{ const on=H.has(i)||o.sel===i, umb=x[6]&&!on;
    if(umb){ o_+=`<path d="${x[7]}" fill="transparent" stroke="#a08c74" stroke-width="${1.2*s}" stroke-dasharray="${6*s} ${4*s}" ${o.inter?`data-az="${i}" class="atz"`:""}/>`; return; }
    o_+=`<path d="${x[7]}" fill="${on?"#a3264f":NEU[i%NEU.length]}" fill-opacity="${on?.92:(anyOn?.75:1)}" stroke="#fff" stroke-width="${(on?2.6:1.3)*s}" ${o.inter?`data-az="${i}" class="atz"`:""}/>`; });
  m.it.forEach(x=>{ if(x[5]==="l") o_+=`<path d="${x[7]}" fill="none" stroke="#5b9fd2" stroke-width="${2.6*s}" stroke-linecap="round"/>`; });
  const R=4.2*s;
  m.it.forEach((x,i)=>{ if(x[5]!=="p") return; const on=H.has(i)||o.sel===i;
    if(x[0]==="c"&&(x[4]===1||on||s<.6)) o_+=`<circle cx="${x[2]}" cy="${x[3]}" r="${R*.85}" fill="#fff" stroke="#3a2f2a" stroke-width="${1.5*s}"/>`;
    if(x[0]==="w"&&(on||x[4]===1||s<.6)) o_+=`<circle cx="${x[2]}" cy="${x[3]}" r="${on?R*1.6:R}" fill="${on?"#a3264f":"#8d7b68"}" stroke="#fff" stroke-width="${1.5*s}" ${o.inter?`data-az="${i}" class="atz"`:""}/>`; });
  /* labels */
  const placed=[], lab=[]; const inV=(x,y)=>x>vb[0]&&x<vb[0]+vb[2]&&y>vb[1]&&y<vb[1]+vb[3];
  const fits=r=>r[0]>=vb[0]+2*s&&r[1]>=vb[1]+2*s&&r[0]+r[2]<=vb[0]+vb[2]-2*s&&r[1]+r[3]<=vb[1]+vb[3]-2*s&&!placed.some(p=>r[0]<p[0]+p[2]&&r[0]+r[2]>p[0]&&r[1]<p[1]+p[3]&&r[1]+r[3]>p[1]);
  const cand=[]; m.it.forEach((x,i)=>{ if(!inV(x[2],x[3])) return; const on=H.has(i)||o.sel===i;
    if(on) cand.push([0,i]); else if(x[0]==="w"&&x[5]==="z"&&!x[6]&&(x[4]===1||s<.6)) cand.push([x[4]===1?1:2,i]); else if(x[0]==="w"&&x[5]!=="z"&&!x[6]&&(x[4]===1&&s<.8||s<.5)) cand.push([2.5,i]); else if(x[0]==="c"&&x[4]===1) cand.push([3,i]); else if((x[0]==="r"||x[0]==="g")&&x[4]===1) cand.push([3.2,i]); else if(x[0]==="x") cand.push([4,i]); });
  cand.sort((a,b)=>a[0]-b[0]);
  cand.forEach(([pr,i])=>{ const x=m.it[i], t=atName(x), sx=x[2], sy=x[3];
    if(pr===0){ const f=fs*1.05, txt=t.toUpperCase(), tw=txt.length*f*.62+f*1.2, th=f*1.75; const opts=[[sx-tw/2,sy-th-f*.9],[sx-tw/2,sy+f*.9],[sx+f,sy-th/2],[sx-f-tw,sy-th/2]]; [1.8,-1.8,3.2,-3.2].forEach(d=>{ opts.push([sx-tw/2,sy-th/2+d*f]); });
      const r=opts.map(p=>[p[0],p[1],tw,th]).find(fits)||[Math.max(vb[0]+2*s,Math.min(vb[0]+vb[2]-tw-2*s,sx-tw/2)),Math.max(vb[1]+2*s,sy-th-f),tw,th]; placed.push(r);
      const ax=Math.max(r[0]+th*.5,Math.min(r[0]+tw-th*.5,sx)), below=r[1]>sy;
      lab.push(`<g pointer-events="none"><path d="M${ax-f*.4} ${below?r[1]:r[1]+th}L${sx} ${sy}L${ax+f*.4} ${below?r[1]:r[1]+th}Z" fill="#2a1b20"/><rect x="${r[0]}" y="${r[1]}" width="${tw}" height="${th}" rx="${th*.3}" fill="#2a1b20"/><text x="${r[0]+tw/2}" y="${r[1]+th*.68}" text-anchor="middle" font-size="${f}" font-family="DM Sans,system-ui,sans-serif" font-weight="800" letter-spacing="${f*.04}" fill="#fff">${esc(txt)}</text></g>`); return; }
    const isZ=x[0]==="w"&&x[5]==="z", isW=x[0]==="w", isC=x[0]==="c", isR=x[0]==="r", isG=x[0]==="g", isX=x[0]==="x";
    const f=fs*(isZ?(x[4]===1?.85:.72):isW?.7:isC?.74:isX?.9:.76), txt=isZ||(isW&&x[6])?t.toUpperCase():isR?t:t, tw=txt.length*f*(isZ?.62:.55), th=f*1.15;
    const opts=isC||(isW&&!isZ)?[[sx+f*.55,sy-th/2],[sx-f*.55-tw,sy-th/2],[sx-tw/2,sy-th-f*.4],[sx-tw/2,sy+f*.4]]:[[sx-tw/2,sy-th/2],[sx-tw/2,sy-th*1.4],[sx-tw/2,sy+th*.4]];
    const r=opts.map(p=>[p[0],p[1],tw,th]).find(fits); if(!r) return; placed.push(r);
    const fill=isZ?"#4a3a2e":isW?"#5a4a3c":isC?"#3a2f2a":isR?"#3c7fb6":isX?"#6f9fc4":"#7a6650";
    lab.push(`<text x="${r[0]}" y="${r[1]+th*.82}" font-size="${f}" font-family="DM Sans,system-ui,sans-serif" font-weight="${isZ?800:isC?600:700}" ${isR||isX||isG?`font-style="italic"`:""} letter-spacing="${isZ?f*.05:0}" fill="${fill}" stroke="rgba(255,255,255,.85)" stroke-width="${f*.24}" paint-order="stroke" stroke-linejoin="round" pointer-events="none">${esc(txt)}</text>`); });
  return `<svg class="atsvg" viewBox="${vb.join(" ")}" preserveAspectRatio="xMidYMid meet">${o_}${lab.join("")}</svg>`; }
function atLegend(mid,o){ const m=MBY[mid], hl=new Set(o.hl||[]); const zs=m.it.map((x,i)=>[x,i]).filter(([x])=>x[0]==="w"&&!x[6]);
  return `<div class="atleg">${zs.map(([x,i])=>`<button type="button" class="atl${hl.has(i)||o.sel===i?" on":""}" ${o.inter?`data-az="${i}"`:""}>${esc(atName(x))}</button>`).join("")}</div>`; }
/* ----- interactive atlas view ----- */
let AT=null;
const AROOTS=["fra","ita","esp","por","ger","aut","hun","gre","nam","chi","arg","rsaz","ausz","nzl"];
function atOpen(mid,sel,hl){ AT={mid,sel:sel==null?null:sel,hl:hl||[],vb:null,stack:[]}; if(sel!=null) atZoomTo(sel); }
function atZoomTo(i){ const m=MBY[AT.mid], G=MGEO[AT.mid], b=itemBox(m.it[i]); if(!b){ AT.vb=null; return; }
  const cx=b[0]+b[2]/2, cy=b[1]+b[3]/2; let w=Math.max(b[2]*2.2,G.w*.28), h=Math.max(b[3]*2.2,G.h*.28); const R=G.w/G.h; if(w/h<R) w=h*R; else h=w/R; if(w>=G.w*.95){ AT.vb=null; return; } AT.vb=[cx-w/2,cy-h/2,w,h]; }
function renderAtlas(){ const l=L(); if(!AT) atOpen("fra");
  const m=MBY[AT.mid], root=gqRoot(AT.mid); const chain=[]; let c=AT.mid; while(c){ chain.unshift(c); c=GQPAR[c]; }
  const sel=AT.sel!=null?m.it[AT.sel]:null;
  let info=`<p class="atti">${esc(t("atTap"))}</p>`;
  if(sel){ const k=sel[1], d=GX.items[k], ex_=d&&GX.ex[d[2]], cat=gCat(AT.mid,AT.sel), law=gLaw(AT.mid).opts.find(op=>op[0]===cat), ch=atChild(AT.mid,k), li=lang==="fr"?2:lang==="en"?3:1, ss=(SOILOF[k]||"").split(",").filter(Boolean);
    info=`<div class="atinfo"><h3><i style="background:#a3264f"></i>${esc(atName(sel))}</h3>
      ${law?`<p><b>${esc(t("atLaw"))}:</b> ${esc(law[1][l])}</p>`:""}${d&&d[0]&&d[0].length?`<p><b>${esc(t("atGr"))}:</b> ${esc(d[0].join(", "))}</p>`:""}${ss.length?`<p><b>${esc(t("atSoil"))}:</b> ${esc(ss.map(s=>SOILS[s][li].toLowerCase()).join(", "))}</p>`:""}
      ${ex_?`<p class="atex">${esc(ex_[l])}</p>`:""}
      <div class="atbtns">${ch?`<button type="button" class="qzgo" data-atgo="${ch}">🔎 ${esc(t("atOpen"))} ${esc(MBY[ch].t[l])}</button>`:""}${AT.vb?`<button type="button" class="qzsm" data-atall="1">↺ ${esc(t("atAll"))}</button>`:""}</div></div>`; }
  return `<section class="view atv">
   <div class="atroots">${AROOTS.map(r=>`<button type="button" class="atr${r===root?" on":""}" data-atgo="${r}">${typeof tgFlag==="function"&&typeof TRFLAG!=="undefined"&&TRFLAG[r]?tgFlag(TRFLAG[r]):""}${esc(MBY[r].t[l])}</button>`).join("")}</div>
   <div class="atcrumb">${chain.map((c,j)=>`<button type="button" data-atgo="${c}" class="${j===chain.length-1?"on":""}">${esc(MBY[c].t[l])}</button>`).join("<span>›</span>")}${(MTREE[AT.mid]||[]).length?`<span class="atsub">${(MTREE[AT.mid]).map(c=>`<button type="button" data-atgo="${c}">＋ ${esc(MBY[c].t[l])}</button>`).join("")}</span>`:""}</div>
   <div class="atmap">${atlasSvg(AT.mid,{inter:true,sel:AT.sel,hl:AT.hl,vb:AT.vb})}${AT.vb?`<button type="button" class="atallb" data-atall="1">↺ ${esc(t("atAll"))}</button>`:""}</div>
   ${info}
   ${atLegend(AT.mid,{inter:true,sel:AT.sel,hl:AT.hl})}</section>`; }
document.addEventListener("click",e=>{ const el=e.target.closest&&e.target.closest("[data-az],[data-atgo],[data-atall],[data-atopen]"); if(!el) return;
  if(el.dataset.atopen){ e.preventDefault(); e.stopPropagation(); const [mid,sel]=el.dataset.atopen.split(":"); try{ gqStop(); }catch(_){} const hl=(el.dataset.athl||"").split(",").filter(Boolean).map(Number); atOpen(mid,sel===""||sel==null?null:+sel,hl);
    atShow(); return; }
  const inM=el.closest("#atmodal"); if(view!=="atlas"&&!inM){ const g=el.closest(".geoq"); if(g&&el.dataset.az!=null){ const map=el.closest("[data-atmid]"); if(map){ e.preventDefault(); e.stopPropagation(); atOpen(map.dataset.atmid,+el.dataset.az,[]); atShow(); } } return; }
  e.preventDefault();
  if(el.dataset.atgo){ AT={mid:el.dataset.atgo,sel:null,hl:[],vb:null}; atRender(); return; }
  if(el.dataset.atall){ AT.vb=null; AT.sel=null; atRender(); return; }
  if(el.dataset.az!=null){ const i=+el.dataset.az, k=MBY[AT.mid].it[i][1], ch=atChild(AT.mid,k);
    if(AT.sel===i&&ch){ AT={mid:ch,sel:null,hl:[],vb:null}; atRender(); return; }
    AT.sel=i; atZoomTo(i); atRender(); const inf=document.querySelector(".atinfo"); if(inf&&window.innerWidth<700) setTimeout(()=>inf.scrollIntoView({block:"nearest",behavior:"smooth"}),50); } });
/* atlas inside the quiz opens as an overlay: the quiz stays where it is */
function atShow(){ if(quiz&&!quiz.done){ let md=document.getElementById("atmodal"); if(!md){ md=document.createElement("div"); md.id="atmodal"; document.body.appendChild(md); document.documentElement.classList.add("atlock"); } atRender(); } else go("atlas"); }
function atClose(){ const md=document.getElementById("atmodal"); if(md) md.remove(); document.documentElement.classList.remove("atlock"); }
function atRender(){ const md=document.getElementById("atmodal"); if(md){ md.innerHTML=`<div class="atmw"><div class="atmh"><b>🗺️ ${esc(t("tr_atlas"))}</b><button type="button" class="atmx" data-atclose="1">✕ ${esc(t("atBack"))}</button></div>${renderAtlas()}</div>`; } else render(); }
document.addEventListener("click",e=>{ const x=e.target.closest&&e.target.closest("[data-atclose]"); if(x){ e.preventDefault(); e.stopPropagation(); atClose(); } else if(e.target&&e.target.id==="atmodal"){ atClose(); } },true);
/* Ripasso: atlas tile next to maps */
const _rWine14=renderWine;
renderWine=function(){ const h=_rWine14(); return h.replace('<button type="button" class="rvt2 rv-maps"',`<button type="button" class="rvt2 rv-atlas wide" data-go="atlas">${RVDECO.bottle||""}<i class="rvshine"></i><span class="game-new rvbadge">${esc(t("newG"))}</span><span class="rvic">${ICO.maps||""}</span><span class="rvtx"><b>${esc(t("tr_atlas"))}</b><span>${esc(t("trd_atlas"))}</span></span><span class="rvnum"><b>${MAPS.length}</b><small>${esc(t("rvMaps"))}</small></span></button><button type="button" class="rvt2 rv-maps"`); };
/* ----- relevance: only geography / climate / style questions get maps ----- */
const GEOPRE=["clima","climat","fresc","cald","temperat","tempér","piogg","precipit","plui","rain","solegg","ensoleil","sunshine","umid","humid","wind","nebbi","brouill","fog","gelat","gelée","frost","grandin","grêle","hail","altitud","elevat","quota","latitud","ocean","océan","oceano","maritt","maritim","continental","mediterr","méditerr","fium","fleuv","rivier","river","lake","lago","laghi","vallée","valley","valli","collin","colline","hill","coteau","pendi","pente","slope","terrazz","terrass","montagn","mountain","esposiz","exposit","versant","suol","terren","soil","ghiai","gravel","gravier","calcar","calcair","limestone","argill","argil","clay","scist","schist","slate","ardois","ardesi","granit","vulcan","volcan","sabbi","sable","sandy","gesso","craie","chalk","regione","région","region","zona","zone","sottozon","sous-zon","subzon","sottoregion","sous-région","subregion","sub-region","distrett","district","situat","situé","located","costier","côtier","coast","inland","nord","north","south","ovest","ouest","west","settentrional","meridional","septentrional","freddo","froid","cold","fillossera","phylloxéra","phylloxera","irrigaz","irrigat","siccit","sécheresse","drought","pianur","plaine","plain","altopian","plateau"];
const GEOEX=["dove","where","sud","sol","sols","sole","soleil","sun","vento","venti","vent","vents"];
const STYPRE=["stile","style","aromi","arômes","aroma","corpo","corps","body","acidit","maturaz","maturit","ripen","matura","mûri","com'è","comment est","what is","come sono","comment sont","what are"];
let GEOREX=null, STYREX=null;
function geoRel(b){ const esc_=s=>flNorm(s).replace(/[^a-z0-9' -]+/g,"").replace(/ /g,"\\s"); if(!GEOREX){ GEOREX=new RegExp("(?:^|[^a-z0-9])(?:"+GEOPRE.map(esc_).filter(Boolean).join("|")+")|(?:^|[^a-z0-9])(?:"+GEOEX.map(esc_).join("|")+")(?=$|[^a-z0-9])","g"); STYREX=new RegExp("(?:^|[^a-z0-9])(?:"+STYPRE.map(esc_).join("|")+")","g"); }
  const q=flNorm((b.q||[]).join(" ")), ex_=flNorm([b.o[0]||[],b.e||[],b.d||[]].map(a=>a.join(" ")).join(" "));
  GEOREX.lastIndex=0; if(GEOREX.test(q)) return true;
  const eh=(ex_.match(GEOREX)||[]).length; STYREX.lastIndex=0;
  if(STYREX.test(q)&&eh>=4) return true;
  return eh>=10; }
const _geoFor14=geoFor;
geoFor=function(b){ if(GQC[b.id]!==undefined) return GQC[b.id]; if(!geoRel(b)) return GQC[b.id]=null; return _geoFor14(b); };
/* answer block: new style for the country and region maps + link to the atlas */
const _gqSvg14=gqSvg;
gqSvg=function(mid,hl,mode){ if(mode===2) return _gqSvg14(mid,hl,mode); const base=_gqSvg14(mid,hl,mode); let vb=null;
  if(mode===1&&hl.length){ const G=MGEO[mid], bs=hl.map(i=>itemBox(MBY[mid].it[i])).filter(Boolean); if(bs.length){ const x0=Math.min(...bs.map(b=>b[0])), y0=Math.min(...bs.map(b=>b[1])), x1=Math.max(...bs.map(b=>b[0]+b[2])), y1=Math.max(...bs.map(b=>b[1]+b[3])); let w=Math.max((x1-x0)*2.4,G.w*.45), h=Math.max((y1-y0)*2.4,G.h*.45); const R=G.w/G.h; if(w/h<R) w=h*R; else h=w/R; if(w<G.w*.95) vb=[(x0+x1)/2-w/2,(y0+y1)/2-h/2,w,h]; } }
  const svg=`<div class="atwrap" data-atmid="${mid}">${atlasSvg(mid,{hl,vb,inter:true,relief:mode===1})}</div>`;
  const m=MBY[mid]; const def=(base.leg.match(/<div class="gqdef">[\s\S]*<\/div>/)||[""])[0];
  const lg=`<div class="atleg">${hl.map(i=>`<span class="atl on">${esc(atName(m.it[i]))}</span>`).join("")}</div>`+(mode===1?def:"");
  return {svg, leg:lg+`<button type="button" class="atlink" data-atopen="${mid}:${hl.length?hl[0]:""}" data-athl="${hl.join(",")}">🔎 ${esc(t("atExplore"))}</button>`}; };
try{ const st17=document.createElement("style"); st17.textContent=`
#atmodal{position:fixed;inset:0;z-index:10000;background:rgba(20,10,14,.55);display:flex;align-items:flex-end;justify-content:center;animation:gqin .25s ease-out}
.atmw{background:var(--bg,#faf6ef);width:min(760px,100%);max-height:94vh;overflow:auto;border-radius:22px 22px 0 0;padding:0 14px calc(18px + env(safe-area-inset-bottom,0px))}
@media (min-width:800px){#atmodal{align-items:center}.atmw{border-radius:22px}}
.atmh{position:sticky;top:0;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 2px;background:var(--bg,#faf6ef)}.atmh b{font-family:var(--f-display);font-size:1.1rem}
.atmx{border:0;border-radius:999px;background:#7a1d3a;color:#fff;font:800 .82rem var(--f-body,system-ui);padding:8px 14px;cursor:pointer}
html.atlock,html.atlock body{overflow:hidden}
.rv-atlas{--bg:linear-gradient(140deg,#1f5a7a,#3a87b0 50%,#e5b937);--sh:#123a50}
.atv{display:flex;flex-direction:column;gap:10px}
.atroots{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding-bottom:2px}.atroots::-webkit-scrollbar{display:none}
.atr{display:inline-flex;align-items:center;gap:6px;white-space:nowrap;border:1px solid var(--line,#eadfce);background:var(--surface,#fff);color:inherit;border-radius:999px;padding:6px 12px;font:800 .8rem var(--f-body,system-ui);cursor:pointer}.atr .tgflag{width:20px;height:14px}
.atr.on{background:#1f5a7a;color:#fff;border-color:#1f5a7a}
.atcrumb{display:flex;flex-wrap:wrap;align-items:center;gap:4px;font-size:.85rem}.atcrumb>button{border:0;background:transparent;font:800 .9rem var(--f-display,inherit);color:#7a1d3a;cursor:pointer;padding:2px 4px}.atcrumb>button.on{color:var(--fg,#2a1b20)}.atcrumb>span{color:var(--muted,#7b6a5c)}
.atsub{display:flex;flex-wrap:wrap;gap:4px;width:100%}.atsub button{border:1px dashed #7a1d3a;background:transparent;color:#7a1d3a;border-radius:999px;padding:4px 10px;font:700 .75rem var(--f-body,system-ui);cursor:pointer}
.atmap{position:relative;border-radius:18px;overflow:hidden;border:1px solid #c9d6de;background:#bcd9ec;box-shadow:0 5px 0 rgba(31,90,122,.15)}
.atsvg{display:block;width:100%;height:auto;max-height:70vh}
.atz{cursor:pointer;transition:fill-opacity .15s}.atz:hover{fill-opacity:1}
.atallb{position:absolute;top:8px;right:8px;border:0;border-radius:999px;background:rgba(20,10,14,.8);color:#fff;font:800 .75rem var(--f-body,system-ui);padding:6px 12px;cursor:pointer}
.atti{margin:0;font-size:.85rem;color:var(--muted,#7b6a5c);text-align:center}
.atinfo{border-radius:16px;background:var(--surface,#fff);border:1px solid var(--line,#eadfce);padding:12px 14px;animation:gqin .35s ease-out}
.atinfo h3{margin:0 0 6px;font-family:var(--f-display);font-size:1.2rem;display:flex;align-items:center;gap:8px}.atinfo h3 i{width:14px;height:14px;border-radius:4px}
.atinfo p{margin:4px 0;font-size:.88rem;line-height:1.45}.atex{color:var(--fg,#2a1b20)}
.atbtns{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
.atleg{display:flex;flex-wrap:wrap;gap:6px}.atl{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--line,#eadfce);background:var(--surface,#fff);color:inherit;border-radius:999px;padding:5px 10px;font:700 .78rem var(--f-body,system-ui);cursor:pointer}.atl i{width:11px;height:11px;border-radius:3px;flex:none}.atl.on{border-color:#a3264f;background:#a3264f;color:#fff}
.atwrap .atsvg{max-height:62vh}
.atlink{display:block;width:100%;margin-top:6px;border:0;border-radius:12px;background:#e3f1f3;color:#1f5a7a;font:800 .82rem var(--f-body,system-ui);padding:8px 12px;cursor:pointer;text-align:left}
`; document.head.appendChild(st17); }catch(e){}
try{ const st18=document.createElement("style"); st18.textContent=`
.geomap .atsvg{display:block;width:100%;height:auto;max-height:62vh}
.gqlay>.atwrap{width:100%;height:100%;transform-origin:var(--zx) var(--zy);transition:transform 7s ease-in-out}.gqlay>.atwrap .atsvg{width:100%;height:100%;max-height:none}
.gqlay[data-l="0"].zoom>.atwrap{transform:scale(var(--zs))}.gqlay[data-l="1"].zoom>.atwrap{transform:scale(1.06)}
`; document.head.appendChild(st18); }catch(e){}
