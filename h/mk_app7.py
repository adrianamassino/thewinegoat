#!/usr/bin/env python3
"""Build app7.js: the "Ripasso" (review) hub + the dictionary of book terms."""
import json, glob, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
D = []
for f in sorted(glob.glob('rip/dict_*.txt')):
    for ln in open(f, encoding='utf-8'):
        ln = ln.strip()
        if not ln or ln.startswith('#'): continue
        p = ln.split('|')
        assert len(p) == 7, (f, ln[:60], len(p))
        D.append([p[0], p[2], p[1], p[3], p[5], p[4], p[6]])  # cat, it, fr, en, def it, def fr, def en
NUMS = []
def _t3(x):
    p = [y.strip() for y in x.split(' ~ ')]
    return p if len(p) == 3 else [x.strip()] * 3
for ln in open('rip/nums.txt', encoding='utf-8'):
    ln = ln.rstrip('\n')
    if not ln.strip() or ln.startswith('# '): continue
    if ln.startswith('## '):
        k, a, b, c = ln[3:].split('|'); NUMS.append([k, [a, b, c], []]); continue
    p = ln.split('|'); assert len(p) == 3, ln
    NUMS[-1][2].append([_t3(p[0]), _t3(p[1]), _t3(p[2]) if p[2].strip() else ['', '', '']])
seen = set()
for d in D:
    assert d[2] not in seen, d[2]; seen.add(d[2])
JS = r"""
/* ---------- v53: "Ripasso" study area (no scoring) + dictionary of the book's terms ---------- */
const DICT=__DICT__;
const DCATS={vig:["Vigna e vigneto","Vigne et vignoble","Vine and vineyard"],vin:["Vinificazione","Vinification","Winemaking"],ele:["Affinamento e imbottigliamento","Élevage et mise en bouteille","Maturation and bottling"],eff:["Spumanti","Effervescents","Sparkling wines"],mut:["Fortificati e vini dolci","Vins mutés et doux","Fortified and sweet wines"],deg:["Degustazione e difetti","Dégustation et défauts","Tasting and faults"],lab:["Etichette e leggi","Étiquettes et législation","Labels and law"]};
Object.assign(T.it,{tab_wine:"Ripasso",wnKick:"Ripasso",wnTitle:"Tutto da ripassare",wnIntro:"Podcast, film, dizionario, schede e mappe: il materiale del libro da leggere e ascoltare, senza voti né cronometro.",
  tr_dict:"Dizionario",trd_dict:"Tutti i termini del libro, dal francese all'italiano",dcSearch:"Cerca un termine (es. soutirage)",dcAll:"Tutti",dcN:"termini",dcNone:"Nessun termine trovato.",dcEq:"In altre lingue",
  tr_gtab:"Confronto vitigni",trd_gtab:"Tutte le uve del libro a confronto, in una tabella",gtName:"Vitigno",gtCol:"Colore",gtBud:"Germogliamento",gtRip:"Maturazione",gtA:"Acidità",gtT:"Tannino",gtB:"Corpo",gtY:"Da giovane",gtAg:"Con l'età",gtH:"Vigna e rischi",gtReg:"Regioni",gtSort:"Ordina per",gtSearch:"Cerca un vitigno, un aroma, una regione",gtE:"precoce",gtM:"media",gtL:"tardiva",gtN:"vitigni",gtHint:"Scorri la tabella di lato · tocca un nome per la scheda completa",tr_nums:"Cifre del libro",trd_nums:"Tutti i numeri da sapere: crus, affinamenti, percentuali",nmSearch:"Cerca una cifra (es. crus, solera, Barolo)",nmAll:"Tutte",nmN:"cifre"});
Object.assign(T.fr,{tab_wine:"Révision",wnKick:"Révision",wnTitle:"Tout pour réviser",wnIntro:"Podcasts, films, dictionnaire, fiches et cartes : le contenu du livre à lire et écouter, sans note ni chrono.",
  tr_dict:"Dictionnaire",trd_dict:"Tous les termes du livre, avec définitions",dcSearch:"Chercher un terme (ex. soutirage)",dcAll:"Tous",dcN:"termes",dcNone:"Aucun terme trouvé.",dcEq:"Dans les autres langues",
  tr_gtab:"Comparatif des cépages",trd_gtab:"Tous les cépages du livre comparés dans un tableau",gtName:"Cépage",gtCol:"Couleur",gtBud:"Débourrement",gtRip:"Maturité",gtA:"Acidité",gtT:"Tanin",gtB:"Corps",gtY:"Jeune",gtAg:"Avec l'âge",gtH:"Vignoble et risques",gtReg:"Régions",gtSort:"Trier par",gtSearch:"Chercher un cépage, un arôme, une région",gtE:"précoce",gtM:"moyen",gtL:"tardif",gtN:"cépages",gtHint:"Faites défiler le tableau sur le côté · touchez un nom pour la fiche complète",tr_nums:"Les chiffres du livre",trd_nums:"Tous les chiffres à connaître : crus, élevages, pourcentages",nmSearch:"Chercher un chiffre (ex. crus, solera, Barolo)",nmAll:"Tous",nmN:"chiffres"});
Object.assign(T.en,{tab_wine:"Review",wnKick:"Review",wnTitle:"Everything to review",wnIntro:"Podcasts, films, dictionary, fact sheets and maps: the book's content to read and listen to, no scores, no timer.",
  tr_dict:"Dictionary",trd_dict:"All the book's terms, French to English",dcSearch:"Search a term (e.g. soutirage)",dcAll:"All",dcN:"terms",dcNone:"No term found.",dcEq:"In other languages",
  tr_gtab:"Grape comparison",trd_gtab:"Every grape in the book side by side, in one table",gtName:"Grape",gtCol:"Colour",gtBud:"Budburst",gtRip:"Ripening",gtA:"Acidity",gtT:"Tannin",gtB:"Body",gtY:"Young",gtAg:"With age",gtH:"Vineyard & hazards",gtReg:"Regions",gtSort:"Sort by",gtSearch:"Search a grape, aroma or region",gtE:"early",gtM:"mid",gtL:"late",gtN:"grapes",gtHint:"Scroll the table sideways · tap a name for the full profile",tr_nums:"Key figures",trd_nums:"Every number to know: crus, ageing rules, percentages",nmSearch:"Search a figure (e.g. crus, solera, Barolo)",nmAll:"All",nmN:"figures"});
Object.assign(TABG,{pods:"wine",pod:"wine",dict:"wine",gtab:"wine",nums:"wine"}); Object.assign(SUBV,{pods:"wine",pod:"pods",dict:"wine",gtab:"wine",nums:"wine"}); Object.assign(SUBT,{dict:"tr_dict",gtab:"tr_gtab",nums:"tr_nums"});
ICO.dict='<svg viewBox="0 0 48 48"><path d="M9 8h13a5 5 0 0 1 5 5v27a4 4 0 0 0-4-4H9z" fill="#6b2d5c"/><path d="M39 8H27v32a4 4 0 0 1 4-4h8z" fill="#8a3d75"/><path d="M13 15h9M13 21h9M31 15h5M31 21h5" stroke="#f3e2c0" stroke-width="2.4" stroke-linecap="round"/><circle cx="36" cy="34" r="6" fill="none" stroke="#d4a23a" stroke-width="3"/><path d="M40.5 38.5l4 4" stroke="#d4a23a" stroke-width="3" stroke-linecap="round"/></svg>';
function renderStudy(){ const C=coach();
  return `<section class="view hub area-wset">${hubHead("ban-wset","wsKick","wsTitle","wsIntro","n37")}
   <button type="button" class="mockcard" data-go="exam"><span class="mk-seal">WSET<br><b>3</b></span><span class="mk-tx"><b>${esc(t("wsMock"))}</b><span>${esc(t("wsMockD"))}</span></span>${C.lastMock?`<span class="mk-last">${C.lastMock.c}%</span>`:ICO.chev}</button>
   <h2 class="hsec">${esc(t("wsSec1"))}</h2>
   <div class="hublist">${hubRow("practice","quiz",t("tr_practice"),t("stQuiz"),`${C.ready}%`)}${hubRow("open","open",t("tr_open"),t("trd_open"))}${hubRow("sat","sat",t("tr_sat"),t("trd_sat"))}</div></section>`; }
function renderWine(){
  const big=(g,ic,ti,sub,cls)=>`<button type="button" class="winecard ${cls}" data-go="${g}"><span class="wc-ic">${ICO[ic]||""}</span><b>${esc(ti)}</b><span>${esc(sub)}</span></button>`;
  return `<section class="view hub area-wine">${hubHead("ban-wine","wnKick","wnTitle","wnIntro","n11")}
   <button type="button" class="podcard" data-go="pods"><span class="pc-ic">${ICO.pod||""}</span><span class="pc-tx"><b>${esc(t("tr_pods"))}</b><span>${esc(t("trd_pods"))}</span></span>${ICO.chev}</button>
   <div class="winegrid">${big("films","film",t("tr_films"),t("trd_films"),"wc-film")}${big("dict","dict",t("tr_dict"),t("trd_dict"),"wc-dict")}${big("gtab","gtab",t("tr_gtab"),t("trd_gtab"),"wc-gtab")}${big("nums","nums",t("tr_nums"),t("trd_nums"),"wc-nums")}${big("grapes","grapes",t("tr_grapes"),t("trd_grapes"),"wc-grape")}${big("schemi","schemi",t("tr_schemi"),t("stSchemi"),"wc-sch")}${big("maps","maps",t("tr_maps"),t("trd_maps"),"wc-map")}</div></section>`; }
let dcQ="", dcCat="all";
const dcNorm=s=>String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[’']/g,"'");
function dcRow(d){ const l=L(), lg=["it","fr","en"], hw=d[1+l], fr=d[2], oth=[0,2].filter(i=>i!==l);
  return `<div class="dcrow" data-dcq="${esc(dcNorm(d.slice(1).join(" ")))}" data-dcc="${d[0]}"><div class="dch"><b lang="fr">${esc(fr)}</b>${l!==1&&dcNorm(hw)!==dcNorm(fr)?`<span class="dct">${esc(hw)}</span>`:""}</div>
   <p>${esc(d[4+l])}</p><div class="dceq">${oth.map(i=>`<span><small>${lg[i].toUpperCase()}</small> ${esc(d[1+i])}</span>`).join("")}</div></div>`; }
function renderDict(){ const l=L(); const S=[...DICT].sort((a,b)=>dcNorm(a[2]).localeCompare(dcNorm(b[2]),"fr"));
  let last="", body="";
  S.forEach(d=>{ const k=dcNorm(d[2]).replace(/^[^a-z]+/,"")[0].toUpperCase(); if(k!==last){ body+=`<h3 class="dcl" data-dcl="${k}">${k}</h3>`; last=k; } body+=dcRow(d); });
  const chips=[["all",t("dcAll")],...Object.keys(DCATS).map(k=>[k,DCATS[k][l]])].map(([k,x])=>`<button type="button" class="chip" data-dcat="${k}" aria-pressed="${dcCat===k}">${esc(x)}</button>`).join("");
  return `<section class="view dictv"><div class="dcbar"><input type="search" id="dc-q" placeholder="${esc(t("dcSearch"))}" value="${esc(dcQ)}" autocomplete="off" spellcheck="false"><span class="muted" id="dc-n"></span></div>
   <div class="dccats">${chips}</div><div class="dclist">${body}</div><p class="muted" id="dc-none" hidden>${esc(t("dcNone"))}</p></section>`; }
function dcFilter(){ const q=dcNorm(dcQ.trim()); let n=0; document.querySelectorAll(".dcrow").forEach(r=>{ const ok=(dcCat==="all"||r.dataset.dcc===dcCat)&&(!q||r.dataset.dcq.includes(q)); r.hidden=!ok; if(ok) n++; });
  document.querySelectorAll(".dcl").forEach(h=>{ let e=h.nextElementSibling, any=false; while(e&&!e.classList.contains("dcl")){ if(!e.hidden) any=true; e=e.nextElementSibling; } h.hidden=!any; });
  const c=$("#dc-n"); if(c) c.textContent=n+" "+t("dcN"); const z=$("#dc-none"); if(z) z.hidden=!!n; }
document.addEventListener("input",e=>{ if(e.target&&e.target.id==="dc-q"){ dcQ=e.target.value; dcFilter(); } });
document.addEventListener("click",e=>{ const b=e.target.closest&&e.target.closest("[data-dcat]"); if(!b) return; dcCat=b.dataset.dcat; document.querySelectorAll("[data-dcat]").forEach(x=>x.setAttribute("aria-pressed",x===b)); dcFilter(); });
new MutationObserver(()=>{ const r=document.querySelector(".dictv:not([data-dcok])"); if(r){ r.dataset.dcok=1; dcFilter(); } }).observe(document.body,{childList:true,subtree:true});
try{ const st=document.createElement("style"); st.textContent=`
.area-wine .podcard{margin-bottom:4px}
.winecard.wc-dict{background:radial-gradient(120% 130% at 0% 0%,#3d5f96,#28456f 50%,#121f36)}
.area-wine .winegrid .winecard:not(.wc-film){grid-column:auto!important;min-height:0}.winecard.wc-nums{background:radial-gradient(120% 130% at 0% 0%,#5a6e3a,#3f5226 50%,#1c2610)}
.winecard.wc-gtab{background:radial-gradient(120% 130% at 0% 0%,#b0413e,#86282b 50%,#3e1012)}
.dictv{display:flex;flex-direction:column;gap:12px}
.dcbar{display:flex;flex-direction:column;align-items:stretch;gap:4px;position:sticky;top:0;z-index:3;background:var(--bg);padding:6px 0}
.dcbar input{width:100%;box-sizing:border-box;font:inherit;padding:10px 12px;border:1px solid var(--line);border-radius:10px;background:var(--surface);color:var(--fg)}
.dcbar .muted{font-size:.78rem;padding-left:4px}
.dccats{display:flex;gap:6px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none}.dccats .chip{white-space:nowrap;flex:none}
.dclist{display:flex;flex-direction:column;gap:8px}
.dcl{margin:10px 0 0;font-family:var(--f-mono);font-size:.85rem;color:var(--wine,#6b2d5c);border-bottom:1px solid var(--line);padding-bottom:2px}
.dcrow{border:1px solid var(--line);border-radius:10px;padding:10px 12px;background:var(--surface);display:flex;flex-direction:column;gap:4px}
.dch{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 10px}.dch b{font-size:1.02rem}.dct{font-style:italic;opacity:.85}
.dcrow p{margin:0;font-size:.92rem;line-height:1.4}
.dceq{display:flex;flex-wrap:wrap;gap:4px 14px;font-size:.78rem;opacity:.8}.dceq small{font-family:var(--f-mono);font-weight:700;margin-right:2px}
`; document.head.appendChild(st); }catch(e){}

ICO.gtab='<svg viewBox="0 0 48 48"><rect x="6" y="9" width="36" height="30" rx="4" fill="#86282b"/><path d="M6 18h36M6 27h36M18 9v30M30 9v30" stroke="#f3e2c0" stroke-width="2.2"/><circle cx="12" cy="13.5" r="2.4" fill="#d4a23a"/><circle cx="12" cy="22.5" r="2.4" fill="#f3e2c0"/><circle cx="12" cy="31.5" r="2.4" fill="#d4a23a"/></svg>';
let gtCol="all", gtUnit="all", gtSortK="k", gtQ="";
const GTR={E:0,M:1,L:2}; const gtLv=c=>{ if(!c) return -1; const p=c.split("/"); return (GSC[p[0]]+GSC[p[p.length-1]])/2; };
function gtBar(c){ if(!c) return `<span class="muted">—</span>`; const p=c.split("/"), a=GSC[p[0]], b=GSC[p[p.length-1]]; return `<span class="gtbar" title="${esc(c)}">${[0,1,2,3,4].map(i=>`<i class="${i>=a&&i<=b?"on":""}"></i>`).join("")}</span>`; }
function gtRp(c){ return c?`<span class="gtrp gtrp-${c}">${esc(t("gt"+c))}</span>`:`<span class="muted">—</span>`; }
function renderGTab(){ const l=L();
  let G=GRAPES.filter(g=>(gtCol==="all"||g.c===gtCol)&&(gtUnit==="all"||g.u===gtUnit));
  const key={k:g=>g.k.toLowerCase(),bud:g=>g.bud?GTR[g.bud]:9,rip:g=>g.rip?GTR[g.rip]:9,a:g=>-gtLv(g.a),t:g=>-gtLv(g.t),b:g=>-gtLv(g.b)}[gtSortK];
  G=[...G].sort((x,y)=>{ const a=key(x), b=key(y); return a<b?-1:a>b?1:x.k.localeCompare(y.k); });
  const sorts=[["k","gtName"],["bud","gtBud"],["rip","gtRip"],["a","gtA"],["t","gtT"],["b","gtB"]].map(([k,x])=>`<option value="${k}"${gtSortK===k?" selected":""}>${esc(t(x))}</option>`).join("");
  const units=[["all",t("gvAll")],...GUNITS.map(u=>[u[0],u[1][l]])].map(([k,x])=>`<option value="${k}"${gtUnit===k?" selected":""}>${esc(x)}</option>`).join("");
  const cols=[["all","gvAll"],["w","gvW"],["b","gvB"]].map(([k,x])=>`<button type="button" class="chip" data-gtcol="${k}" aria-pressed="${gtCol===k}">${esc(t(x))}</button>`).join("");
  const rows=G.map(g=>{ const x=g.x||{y:["","",""],a:["","",""],h:["","",""]};
    const q=dcNorm([g.k,...g.syn,x.y[l],x.a[l],x.h[l],...g.reg,...g.reg.map(mName)].join(" "));
    return `<tr data-gtq="${esc(q)}"><th scope="row"><button type="button" class="gtnm" data-gsee="${esc(g.k)}"><i class="gtdot ${g.c==="w"?"gw":"gb"}"></i>${esc(g.k)}</button>${g.syn.length?`<small>${esc(g.syn.slice(0,3).join(", "))}</small>`:""}</th>
      <td>${gtRp(g.bud)}</td><td>${gtRp(g.rip)}</td><td>${gtBar(g.a)}</td><td>${g.c==="b"?gtBar(g.t):`<span class="muted">—</span>`}</td><td>${gtBar(g.b)}</td>
      <td class="gtx">${esc(x.y[l])}</td><td class="gtx">${esc(x.a[l])}</td><td class="gtx">${esc(x.h[l])}</td><td class="gtx">${esc(g.reg.map(mName).join(", "))}</td></tr>`; }).join("");
  return `<section class="view gtabv"><div class="gtbar1"><input type="search" id="gt-q" placeholder="${esc(t("gtSearch"))}" value="${esc(gtQ)}" autocomplete="off" spellcheck="false">
   <div class="gtctl"><div class="gtcols">${cols}</div><select id="gt-unit" class="chip">${units}</select><label class="gtsort"><span>${esc(t("gtSort"))}</span><select id="gt-sort" class="chip">${sorts}</select></label></div>
   <p class="muted gthint"><span id="gt-n"></span> · ${esc(t("gtHint"))}</p></div>
   <div class="gtwrap"><table class="gtab"><thead><tr><th scope="col">${esc(t("gtName"))}</th><th scope="col">${esc(t("gtBud"))}</th><th scope="col">${esc(t("gtRip"))}</th><th scope="col">${esc(t("gtA"))}</th><th scope="col">${esc(t("gtT"))}</th><th scope="col">${esc(t("gtB"))}</th><th scope="col">${esc(t("gtY"))}</th><th scope="col">${esc(t("gtAg"))}</th><th scope="col">${esc(t("gtH"))}</th><th scope="col">${esc(t("gtReg"))}</th></tr></thead><tbody>${rows}</tbody></table></div></section>`; }
function gtFilter(){ const q=dcNorm(gtQ.trim()); let n=0; document.querySelectorAll(".gtab tbody tr").forEach(r=>{ const ok=!q||r.dataset.gtq.includes(q); r.hidden=!ok; if(ok) n++; }); const c=$("#gt-n"); if(c) c.textContent=n+" "+t("gtN"); }
document.addEventListener("input",e=>{ if(e.target&&e.target.id==="gt-q"){ gtQ=e.target.value; gtFilter(); } });
document.addEventListener("change",e=>{ const id=e.target&&e.target.id; if(id==="gt-sort"){ gtSortK=e.target.value; render(); } else if(id==="gt-unit"){ gtUnit=e.target.value; render(); } });
document.addEventListener("click",e=>{ if(view!=="gtab") return; const n=e.target.closest&&e.target.closest(".gtnm"); if(!n) return; e.stopPropagation(); const k=n.dataset.gsee; ML=null; view="grapes"; gvQ=k.toLowerCase(); gvUnit="all"; gvCol="all"; render(); gvFilter(); const cs=[...document.querySelectorAll(".gcard")].filter(d=>!d.hidden); const d=cs.find(d=>d.dataset.gname.startsWith(gvQ))||cs[0]; if(d){ d.open=true; d.scrollIntoView({block:"start"}); } },true);
document.addEventListener("click",e=>{ const b=e.target.closest&&e.target.closest("[data-gtcol]"); if(!b) return; gtCol=b.dataset.gtcol; render(); });
new MutationObserver(()=>{ const r=document.querySelector(".gtabv:not([data-gtok])"); if(r){ r.dataset.gtok=1; gtFilter(); } }).observe(document.body,{childList:true,subtree:true});
try{ const st=document.createElement("style"); st.textContent=`
.gtabv{display:flex;flex-direction:column;gap:10px}
.gtbar1{display:flex;flex-direction:column;gap:8px}
.gtbar1 input{width:100%;box-sizing:border-box;font:inherit;padding:10px 12px;border:1px solid var(--line);border-radius:10px;background:var(--surface);color:var(--fg)}
.gtctl{display:flex;flex-wrap:wrap;gap:8px;align-items:center}.gtcols{display:flex;gap:6px}
.gtctl select{font:inherit;font-size:.85rem;max-width:100%}.gtsort{display:flex;align-items:center;gap:6px;font-size:.82rem}
.gthint{margin:0;font-size:.78rem}
.gtwrap{overflow:auto;max-height:calc(100vh - 250px);border:1px solid var(--line);border-radius:10px;background:var(--surface);-webkit-overflow-scrolling:touch}
.gtab{border-collapse:separate;border-spacing:0;font-size:.82rem;min-width:1180px}
.gtab th,.gtab td{padding:8px 10px;border-bottom:1px solid var(--line);vertical-align:top;text-align:left}
.gtab thead th{position:sticky;top:0;z-index:2;background:var(--surface);font-size:.72rem;text-transform:uppercase;letter-spacing:.04em;white-space:nowrap;box-shadow:0 1px 0 var(--line)}
.gtab tbody th{position:sticky;left:0;z-index:1;background:var(--surface);min-width:132px;max-width:150px;box-shadow:1px 0 0 var(--line)}
.gtab thead th:first-child{left:0;z-index:3}
.gtnm{all:unset;cursor:pointer;font-weight:700;display:flex;align-items:center;gap:6px;color:var(--fg)}.gtnm:hover{text-decoration:underline}
.gtab tbody th,.gtab tbody th *{text-transform:none!important;letter-spacing:0!important}
.gtab tbody th small{display:block;font-weight:400;opacity:.7;font-size:.7rem;margin-top:2px}
.gtdot{width:9px;height:9px;border-radius:50%;flex:none}.gtdot.gw{background:#e2c55a}.gtdot.gb{background:#6b2d5c}
.gtx{min-width:170px;max-width:220px;line-height:1.35}
.gtbar{display:inline-flex;gap:2px}.gtbar i{width:9px;height:9px;border-radius:2px;background:color-mix(in srgb,var(--fg) 14%,transparent)}.gtbar i.on{background:var(--wine,#86282b)}
.gtrp{font-size:.75rem;padding:2px 7px;border-radius:999px;white-space:nowrap}.gtrp-E{background:#2f8a8326;color:#2f8a83}.gtrp-M{background:#d4a23a2e;color:#a87b1e}.gtrp-L{background:#b0413e26;color:#b0413e}
.gtab tbody tr:hover th,.gtab tbody tr:hover td{background:color-mix(in srgb,var(--fg) 4%,var(--surface))}
`; document.head.appendChild(st); }catch(e){}

const NUMS=__NUMS__;
ICO.nums='<svg viewBox="0 0 48 48"><rect x="7" y="7" width="34" height="34" rx="7" fill="#3f5226"/><text x="24" y="30" text-anchor="middle" font-family="Georgia,serif" font-size="17" font-weight="700" fill="#f3e2c0">10</text><circle cx="36" cy="12" r="4" fill="#d4a23a"/></svg>';
let nmQ="", nmSec="all";
function renderNums(){ const l=L();
  const chips=[["all",t("nmAll")],...NUMS.map(s=>[s[0],s[1][l]])].map(([k,x])=>`<button type="button" class="chip" data-nmsec="${k}" aria-pressed="${nmSec===k}">${esc(x)}</button>`).join("");
  const body=NUMS.map(s=>`<section class="nmsec" data-nms="${s[0]}"><h3>${esc(s[1][l])}</h3><div class="nmgrid">${s[2].map(it=>`<div class="nmcard" data-nmq="${esc(dcNorm(it[0].concat(it[1],it[2]).join(" ")))}"><b class="nmv">${esc(it[0][l])}</b><span class="nml">${esc(it[1][l])}</span>${it[2][l]?`<span class="nmd">${esc(it[2][l])}</span>`:""}</div>`).join("")}</div></section>`).join("");
  return `<section class="view numsv"><div class="dcbar"><input type="search" id="nm-q" placeholder="${esc(t("nmSearch"))}" value="${esc(nmQ)}" autocomplete="off" spellcheck="false"><span class="muted" id="nm-n"></span></div><div class="dccats">${chips}</div>${body}<p class="muted" id="nm-none" hidden>${esc(t("dcNone"))}</p></section>`; }
function nmFilter(){ const q=dcNorm(nmQ.trim()); let n=0; document.querySelectorAll(".nmsec").forEach(s=>{ let k=0; const on=nmSec==="all"||s.dataset.nms===nmSec; s.querySelectorAll(".nmcard").forEach(c=>{ const ok=on&&(!q||c.dataset.nmq.includes(q)); c.hidden=!ok; if(ok) k++; }); s.hidden=!k; n+=k; });
  const c=$("#nm-n"); if(c) c.textContent=n+" "+t("nmN"); const z=$("#nm-none"); if(z) z.hidden=!!n; }
document.addEventListener("input",e=>{ if(e.target&&e.target.id==="nm-q"){ nmQ=e.target.value; nmFilter(); } });
document.addEventListener("click",e=>{ const b=e.target.closest&&e.target.closest("[data-nmsec]"); if(!b) return; nmSec=b.dataset.nmsec; document.querySelectorAll("[data-nmsec]").forEach(x=>x.setAttribute("aria-pressed",x===b)); nmFilter(); });
new MutationObserver(()=>{ const r=document.querySelector(".numsv:not([data-nmok])"); if(r){ r.dataset.nmok=1; nmFilter(); } }).observe(document.body,{childList:true,subtree:true});
try{ const st=document.createElement("style"); st.textContent=`
.numsv{display:flex;flex-direction:column;gap:12px}
.nmsec h3{margin:8px 0 8px;font-size:1rem}
.nmgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px}
.nmcard{border:1px solid var(--line);border-radius:10px;padding:10px 12px;background:var(--surface);display:flex;flex-direction:column;gap:3px}
.nmv{font-family:Georgia,"Times New Roman",serif;font-size:1.45rem;line-height:1.1;color:var(--wine,#86282b)}
.nml{font-weight:600;font-size:.9rem;line-height:1.3}.nmd{font-size:.8rem;opacity:.8;line-height:1.35}
`; document.head.appendChild(st); }catch(e){}
"""
open('app7.js', 'w', encoding='utf-8').write(JS.replace('__DICT__', json.dumps(D, ensure_ascii=False, separators=(',', ':'))).replace('__NUMS__', json.dumps(NUMS, ensure_ascii=False, separators=(',', ':'))))
print('nums', sum(len(x[2]) for x in NUMS))
print('dict', len(D))
