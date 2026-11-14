/* The Wine Goat — "My wines": tasted-wine archive.
   Label photo (on-device text reading → name / producer / vintage suggestions), glass photo
   (on-device colour reading → WSET colour + intensity), type, grape, region, structure, quality, notes.
   Everything stays on this device (IndexedDB); photos are resized before saving. */
(function(){
"use strict";
const W = window;
const TX = {
 it:{cel:"I miei vini",celD:"Fotografa etichetta e calice: archivio dei vini degustati",celKick:"Diario di degustazione",celTitle:"I miei vini",celIntro:"Fotografa l'etichetta e il vino nel calice: la app legge il testo dell'etichetta e il colore del vino, tu completi la scheda.",
  add:"Aggiungi un vino",label:"Etichetta",glass:"Vino nel calice",takeL:"📷 Fotografa l'etichetta",takeG:"🍷 Fotografa il calice",retake:"Rifai",reading:"Leggo l'etichetta…",readFail:"Non sono riuscito a leggere il testo: scrivilo tu.",sugg:"Tocca per usare il testo letto:",
  tapWine:"Tocca il vino nella foto per misurare il colore",colour:"Colore",intens:"Intensità",name:"Nome del vino",prod:"Produttore",vint:"Annata",type:"Tipologia",grape:"Vitigno/i",region:"Regione / Paese",
  t_white:"Bianco",t_rose:"Rosato",t_red:"Rosso",t_spark:"Spumante",t_sweet:"Dolce",t_fort:"Fortificato",
  struct:"Caratteristiche",sw:"Dolcezza",ac:"Acidità",tan:"Tannino",alc:"Alcol",body:"Corpo",fin:"Finale",nose:"Naso (aromi)",pal:"Bocca (sapori)",qual:"Qualità",
  q_poor:"Scarsa",q_acc:"Accettabile",q_good:"Buona",q_vg:"Molto buona",q_out:"Eccellente",notes:"Note personali",rate:"Il mio voto",when:"Data",save:"Salva nel diario",saved:"Vino salvato ✓",del:"Elimina",delQ:"Eliminare questo vino?",edit:"Modifica",back:"‹ I miei vini",
  empty:"Ancora nessun vino. Fotografa la prossima etichetta che assaggi!",search:"Cerca per nome, vitigno, regione…",all:"Tutti",n:"vini",n1:"vino",local:"Le foto restano su questo dispositivo.",need:"Inserisci almeno il nome del vino.",
  lo:"bassa",ml:"medio-bassa",me:"media",mh:"medio-alta",hi:"alta",sh:"corto",lg:"lungo",li:"leggero",fu:"pieno",dr:"secco",od:"abboccato",swt:"dolce",
  c_lemongreen:"giallo verdolino",c_lemon:"giallo paglierino",c_gold:"dorato",c_amber:"ambrato",c_pink:"rosa",c_salmon:"salmone",c_orange:"buccia di cipolla",c_purple:"porpora",c_ruby:"rubino",c_garnet:"granato",c_tawny:"aranciato (tawny)",c_brown:"marrone",
  i_pale:"pallido",i_medium:"medio",i_deep:"intenso",colAuto:"Colore letto dalla foto:"},
 fr:{cel:"Mes vins",celD:"Photographiez étiquette et verre : votre carnet de dégustation",celKick:"Carnet de dégustation",celTitle:"Mes vins",celIntro:"Photographiez l'étiquette et le vin dans le verre : l'app lit le texte de l'étiquette et la couleur du vin, vous complétez la fiche.",
  add:"Ajouter un vin",label:"Étiquette",glass:"Vin dans le verre",takeL:"📷 Photographier l'étiquette",takeG:"🍷 Photographier le verre",retake:"Reprendre",reading:"Lecture de l'étiquette…",readFail:"Texte illisible : saisissez-le vous-même.",sugg:"Touchez pour utiliser le texte lu :",
  tapWine:"Touchez le vin sur la photo pour mesurer la couleur",colour:"Couleur",intens:"Intensité",name:"Nom du vin",prod:"Producteur",vint:"Millésime",type:"Type",grape:"Cépage(s)",region:"Région / Pays",
  t_white:"Blanc",t_rose:"Rosé",t_red:"Rouge",t_spark:"Effervescent",t_sweet:"Doux",t_fort:"Muté",
  struct:"Caractéristiques",sw:"Sucre",ac:"Acidité",tan:"Tanins",alc:"Alcool",body:"Corps",fin:"Finale",nose:"Nez (arômes)",pal:"Bouche (saveurs)",qual:"Qualité",
  q_poor:"Médiocre",q_acc:"Acceptable",q_good:"Bon",q_vg:"Très bon",q_out:"Excellent",notes:"Notes personnelles",rate:"Ma note",when:"Date",save:"Enregistrer",saved:"Vin enregistré ✓",del:"Supprimer",delQ:"Supprimer ce vin ?",edit:"Modifier",back:"‹ Mes vins",
  empty:"Aucun vin pour l'instant. Photographiez la prochaine étiquette que vous dégustez !",search:"Rechercher par nom, cépage, région…",all:"Tous",n:"vins",n1:"vin",local:"Les photos restent sur cet appareil.",need:"Saisissez au moins le nom du vin.",
  lo:"faible",ml:"moyen-faible",me:"moyen",mh:"moyen-élevé",hi:"élevé",sh:"courte",lg:"longue",li:"léger",fu:"corsé",dr:"sec",od:"demi-sec",swt:"doux",
  c_lemongreen:"citron-vert",c_lemon:"citron",c_gold:"or",c_amber:"ambre",c_pink:"rose",c_salmon:"saumon",c_orange:"orangé",c_purple:"pourpre",c_ruby:"rubis",c_garnet:"grenat",c_tawny:"tuilé",c_brown:"brun",
  i_pale:"pâle",i_medium:"moyenne",i_deep:"profonde",colAuto:"Couleur lue sur la photo :"},
 en:{cel:"My wines",celD:"Snap the label and the glass: your tasted-wine archive",celKick:"Tasting diary",celTitle:"My wines",celIntro:"Photograph the label and the wine in the glass: the app reads the label text and the wine's colour, you complete the card.",
  add:"Add a wine",label:"Label",glass:"Wine in the glass",takeL:"📷 Photograph the label",takeG:"🍷 Photograph the glass",retake:"Retake",reading:"Reading the label…",readFail:"Couldn't read the text: type it in.",sugg:"Tap to use the text found:",
  tapWine:"Tap the wine in the photo to measure its colour",colour:"Colour",intens:"Intensity",name:"Wine name",prod:"Producer",vint:"Vintage",type:"Type",grape:"Grape(s)",region:"Region / Country",
  t_white:"White",t_rose:"Rosé",t_red:"Red",t_spark:"Sparkling",t_sweet:"Sweet",t_fort:"Fortified",
  struct:"Characteristics",sw:"Sweetness",ac:"Acidity",tan:"Tannin",alc:"Alcohol",body:"Body",fin:"Finish",nose:"Nose (aromas)",pal:"Palate (flavours)",qual:"Quality",
  q_poor:"Poor",q_acc:"Acceptable",q_good:"Good",q_vg:"Very good",q_out:"Outstanding",notes:"Personal notes",rate:"My rating",when:"Date",save:"Save to my diary",saved:"Wine saved ✓",del:"Delete",delQ:"Delete this wine?",edit:"Edit",back:"‹ My wines",
  empty:"No wines yet. Photograph the next label you taste!",search:"Search by name, grape, region…",all:"All",n:"wines",n1:"wine",local:"Photos stay on this device.",need:"Enter at least the wine name.",
  lo:"low",ml:"medium(-)",me:"medium",mh:"medium(+)",hi:"high",sh:"short",lg:"long",li:"light",fu:"full",dr:"dry",od:"off-dry",swt:"sweet",
  c_lemongreen:"lemon-green",c_lemon:"lemon",c_gold:"gold",c_amber:"amber",c_pink:"pink",c_salmon:"salmon",c_orange:"orange",c_purple:"purple",c_ruby:"ruby",c_garnet:"garnet",c_tawny:"tawny",c_brown:"brown",
  i_pale:"pale",i_medium:"medium",i_deep:"deep",colAuto:"Colour read from the photo:"},
};
TX.es={cel:"Mis vinos",celD:"Fotografía etiqueta y copa: tu archivo de vinos catados",celKick:"Diario de cata",celTitle:"Mis vinos",celIntro:"Fotografía la etiqueta y el vino en la copa: la app lee el texto de la etiqueta y el color del vino, y tú completas la ficha.",
  add:"Añadir un vino",label:"Etiqueta",glass:"Vino en la copa",takeL:"📷 Fotografiar la etiqueta",takeG:"🍷 Fotografiar la copa",retake:"Repetir",reading:"Leyendo la etiqueta…",readFail:"No pude leer el texto: escríbelo tú.",sugg:"Toca para usar el texto leído:",
  tapWine:"Toca el vino en la foto para medir el color",colour:"Color",intens:"Intensidad",name:"Nombre del vino",prod:"Bodega",vint:"Añada",type:"Tipo",grape:"Uva(s)",region:"Región / País",
  t_white:"Blanco",t_rose:"Rosado",t_red:"Tinto",t_spark:"Espumoso",t_sweet:"Dulce",t_fort:"Generoso",
  struct:"Características",sw:"Dulzor",ac:"Acidez",tan:"Tanino",alc:"Alcohol",body:"Cuerpo",fin:"Final",nose:"Nariz (aromas)",pal:"Boca (sabores)",qual:"Calidad",
  q_poor:"Pobre",q_acc:"Aceptable",q_good:"Buena",q_vg:"Muy buena",q_out:"Excelente",notes:"Notas personales",rate:"Mi nota",when:"Fecha",save:"Guardar en el diario",saved:"Vino guardado ✓",del:"Eliminar",delQ:"¿Eliminar este vino?",edit:"Editar",back:"‹ Mis vinos",
  empty:"Todavía no hay vinos. ¡Fotografía la próxima etiqueta que pruebes!",search:"Busca por nombre, uva, región…",all:"Todos",n:"vinos",n1:"vino",local:"Las fotos se quedan en este dispositivo.",need:"Escribe al menos el nombre del vino.",
  lo:"baja",ml:"media(-)",me:"media",mh:"media(+)",hi:"alta",sh:"corto",lg:"largo",li:"ligero",fu:"con cuerpo",dr:"seco",od:"semiseco",swt:"dulce",
  c_lemongreen:"limón verdoso",c_lemon:"limón",c_gold:"dorado",c_amber:"ámbar",c_pink:"rosa",c_salmon:"salmón",c_orange:"anaranjado",c_purple:"púrpura",c_ruby:"rubí",c_garnet:"granate",c_tawny:"teja",c_brown:"marrón",
  i_pale:"pálido",i_medium:"medio",i_deep:"profundo",colAuto:"Color leído en la foto:"};
TX["es-ar"]=Object.assign({},TX.es,{celD:"Sacale foto a la etiqueta y a la copa: tu archivo de vinos catados",celIntro:"Sacale una foto a la etiqueta y al vino en la copa: la app lee el texto de la etiqueta y el color del vino, y vos completás la ficha.",
  add:"Agregar un vino",readFail:"No pude leer el texto: escribilo vos.",sugg:"Tocá para usar el texto leído:",tapWine:"Tocá el vino en la foto para medir el color",
  empty:"Todavía no hay vinos. ¡Sacale una foto a la próxima etiqueta que pruebes!",search:"Buscá por nombre, uva, región…",need:"Escribí al menos el nombre del vino.",retake:"Sacar otra"});
const lg=()=>{ let l="en"; try{ l=localStorage.getItem("wset3-lang")||(typeof lang!=="undefined"?lang:"en"); }catch(e){} return TX[l]?l:"en"; };
const x=k=>(TX[lg()][k]!=null?TX[lg()][k]:TX.en[k]);
const es=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

/* ---------- storage (IndexedDB, with in-memory fallback) ---------- */
let DBP=null; const MEM=new Map();
function db(){ if(DBP) return DBP; DBP=new Promise(res=>{ try{ const r=indexedDB.open("twg-cellar",1); r.onupgradeneeded=()=>r.result.createObjectStore("wines",{keyPath:"id"}); r.onsuccess=()=>res(r.result); r.onerror=()=>res(null); }catch(e){ res(null); } }); return DBP; }
async function all(){ const d=await db(); if(!d) return [...MEM.values()]; return new Promise(res=>{ const q=d.transaction("wines").objectStore("wines").getAll(); q.onsuccess=()=>res(q.result||[]); q.onerror=()=>res([]); }); }
async function put(w){ const d=await db(); if(!d){ MEM.set(w.id,w); return; } return new Promise(res=>{ const tx=d.transaction("wines","readwrite"); tx.objectStore("wines").put(w); tx.oncomplete=res; tx.onerror=res; }); }
async function del(id){ const d=await db(); if(!d){ MEM.delete(id); return; } return new Promise(res=>{ const tx=d.transaction("wines","readwrite"); tx.objectStore("wines").delete(id); tx.oncomplete=res; tx.onerror=res; }); }

/* ---------- images ---------- */
function fileToImg(f){ return new Promise((res,rej)=>{ const u=URL.createObjectURL(f); const im=new Image(); im.onload=()=>res(im); im.onerror=rej; im.src=u; }); }
async function shrink(f,max){ const im=await fileToImg(f); const s=Math.min(1,max/Math.max(im.width,im.height)); const c=document.createElement("canvas"); c.width=Math.round(im.width*s); c.height=Math.round(im.height*s); c.getContext("2d").drawImage(im,0,0,c.width,c.height); return c.toDataURL("image/jpeg",.82); }

/* ---------- colour reading ---------- */
function rgb2hsl(r,g,b){ r/=255; g/=255; b/=255; const mx=Math.max(r,g,b), mn=Math.min(r,g,b); let h=0,s=0; const l=(mx+mn)/2; if(mx!==mn){ const d=mx-mn; s=l>.5?d/(2-mx-mn):d/(mx+mn); h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4; h*=60; } return [h,s,l]; }
function classify(r,g,b){ const [h,s,l]=rgb2hsl(r,g,b); const redish=h>=300||h<35;
  let fam, term, inten;
  if(redish&&l<.42&&s>.18){ fam="red"; term=h>=300&&h<345?"purple":(h>=345||h<8)?"ruby":h<20?"garnet":l>.22?"tawny":"garnet"; inten=l<.17?"deep":l<.3?"medium":"pale"; }
  else if(redish&&s>.2){ fam="rose"; term=(h>=320||h<6)?"pink":h<18?"salmon":"orange"; inten=l>.78?"pale":l>.62?"medium":"deep"; }
  else { fam="white"; term=h>=65&&s<.6?"lemongreen":h>=48?"lemon":h>=38?"gold":(l<.5?"brown":"amber"); inten=(l>.82||s<.18)?"pale":l>.62?"medium":"deep"; }
  return {fam,term,inten,hex:"#"+[r,g,b].map(v=>Math.round(v).toString(16).padStart(2,"0")).join("")}; }
function sampleAt(cv,px,py){ const c=cv.getContext("2d"), R=Math.max(6,Math.round(Math.min(cv.width,cv.height)*.04)); const d=c.getImageData(Math.max(0,px-R),Math.max(0,py-R),R*2,R*2).data; let r=0,g=0,b=0,n=0;
  for(let i=0;i<d.length;i+=4){ const mx=Math.max(d[i],d[i+1],d[i+2]); if(mx>245&&Math.min(d[i],d[i+1],d[i+2])>235) continue; r+=d[i]; g+=d[i+1]; b+=d[i+2]; n++; } if(!n) return null; return classify(r/n,g/n,b/n); }

/* ---------- label text reading (on device) ---------- */
let TP=null, TW=null; const OCR=new URL("vendor/ocr/",document.baseURI).href;
function loadTess(){ if(W.Tesseract) return Promise.resolve(W.Tesseract); if(TP) return TP; TP=new Promise((res,rej)=>{ const s=document.createElement("script"); s.src=OCR+"tesseract.min.js"; s.onload=()=>res(W.Tesseract); s.onerror=rej; document.head.appendChild(s); }); return TP; }
async function readLabel(dataUrl){
  const im=new Image(); im.src=dataUrl; await im.decode().catch(()=>{});
  let lines=[];
  try{ if("TextDetector" in W){ const det=new W.TextDetector(); const r=await det.detect(im); lines=r.map(z=>({t:z.rawValue,h:z.boundingBox.height})); } }catch(e){}
  if(!lines.length){ const T=await loadTess(); if(!TW) TW=await T.createWorker("eng",1,{workerPath:OCR+"worker.min.js",corePath:OCR,langPath:OCR.replace(/\/$/,""),gzip:true}); const r=await TW.recognize(dataUrl); lines=((r&&r.data&&r.data.lines)||[]).filter(z=>z.confidence>45).map(z=>({t:z.text,h:z.bbox.y1-z.bbox.y0})); }
  const clean=lines.map(z=>({t:z.t.replace(/[^\p{L}\p{N}' .&-]/gu," ").replace(/\s+/g," ").trim(),h:z.h})).filter(z=>/\p{L}{3}/u.test(z.t)&&z.t.length<=48);
  const seen=new Set(); const out=clean.sort((a,b)=>b.h-a.h).filter(z=>{ const k=z.t.toLowerCase(); if(seen.has(k)) return false; seen.add(k); return true; }).slice(0,8).map(z=>z.t);
  const yr=(lines.map(z=>z.t).join(" ").match(/\b(19[5-9]\d|20[0-4]\d)\b/)||[])[0]||"";
  const top=clean.length?Math.max(...clean.map(z=>z.h)):0; const big=clean.filter(z=>z.h>=top*.7).slice(0,3).map(z=>z.t);
  return {lines:out,year:yr,name:big.join(" ")}; }

/* ---------- state ---------- */
let LIST=[], CUR=null, MODE="list", Q="", F="", LOADED=false, MSG="";
const SC={sw:["dr","od","me","swt"],ac:["lo","ml","me","mh","hi"],tan:["lo","ml","me","mh","hi"],alc:["lo","me","hi"],body:["li","ml","me","mh","fu"],fin:["sh","ml","me","mh","lg"]};
const TYPES=["white","rose","red","spark","sweet","fort"], QUAL=["poor","acc","good","vg","out"];
const fresh=()=>({id:"w"+Date.now().toString(36)+Math.random().toString(36).slice(2,6),ts:Date.now(),date:new Date().toISOString().slice(0,10),name:"",prod:"",vint:"",type:"",grape:"",region:"",col:null,s:{},nose:"",pal:"",q:"",rate:0,notes:"",label:"",glass:"",ocr:null});
async function load(){ LIST=(await all()).sort((a,b)=>b.ts-a.ts); LOADED=true; }

/* ---------- views ---------- */
const typeLbl=k=>k?x("t_"+k):"";
function card(w){ const c=w.col; return `<button type="button" class="cl-item" data-cel="open" data-id="${w.id}">
  <span class="cl-th">${w.label?`<img src="${w.label}" alt="">`:w.glass?`<img src="${w.glass}" alt="">`:"🍷"}</span>
  <span class="cl-tx"><b>${es(w.name)}${w.vint?` <i>${es(w.vint)}</i>`:""}</b><span>${es([w.prod,w.region].filter(Boolean).join(" · "))}</span>
  <span class="cl-tags">${w.type?`<em class="cl-ty t-${w.type}">${es(typeLbl(w.type))}</em>`:""}${c?`<em class="cl-sw" style="--c:${c.hex}"></em>${es(x("c_"+c.term))}`:""}${w.rate?` <span class="cl-st">${"★".repeat(w.rate)}</span>`:""}</span></span></button>`; }
function listHTML(){
  if(!LOADED){ load().then(()=>W.render&&W.render()); }
  const q=Q.toLowerCase(); const L=LIST.filter(w=>(!F||w.type===F)&&(!q||[w.name,w.prod,w.grape,w.region,w.notes].join(" ").toLowerCase().includes(q)));
  return `<section class="view cellar">
   <p class="cl-intro">${es(x("celIntro"))}</p>
   <button type="button" class="btn primary cl-add" data-cel="new">＋ ${es(x("add"))}</button>
   ${LIST.length?`<div class="cl-bar"><input type="search" id="cl-q" placeholder="${es(x("search"))}" value="${es(Q)}"><div class="cl-f">${["",...TYPES].map(k=>`<button type="button" data-cel="f" data-f="${k}" aria-pressed="${F===k}">${es(k?typeLbl(k):x("all"))}</button>`).join("")}</div></div>
   <p class="cl-count">${L.length} ${es(x(L.length===1?"n1":"n"))}</p><div class="cl-list">${L.map(card).join("")}</div>`:`<p class="cl-empty">${es(x("empty"))}</p>`}
   <p class="cl-local">🔒 ${es(x("local"))}</p></section>`; }
function scaleRow(k){ const v=CUR.s[k]||""; return `<div class="cl-sc"><span>${es(x(k))}</span><div>${SC[k].map(o=>`<button type="button" data-cel="sc" data-k="${k}" data-v="${o}" aria-pressed="${v===o}">${es(x(o))}</button>`).join("")}</div></div>`; }
function photo(kind){ const src=CUR[kind]; const isG=kind==="glass";
  return `<div class="cl-ph">
   <p class="cl-lab">${es(x(isG?"glass":"label"))}</p>
   ${src?`<div class="cl-pic ${isG?"cl-tap":""}">${isG?`<canvas id="cl-cv"></canvas>${CUR.col&&CUR.col.px!=null?`<i class="cl-dot" style="left:${CUR.col.px*100}%;top:${CUR.col.py*100}%"></i>`:""}`:`<img src="${src}" alt="">`}</div>
     ${isG?`<p class="cl-hint">${es(x("tapWine"))}</p>`:""}
     <label class="btn ghost sm">${es(x("retake"))}<input type="file" accept="image/*" capture="environment" data-cel-file="${kind}" hidden></label>`
   :`<label class="cl-shot">${es(x(isG?"takeG":"takeL"))}<input type="file" accept="image/*" capture="environment" data-cel-file="${kind}" hidden></label>`}
   ${!isG&&CUR.ocr?(CUR.ocr==="busy"?`<p class="cl-hint">⏳ ${es(x("reading"))}</p>`:CUR.ocr==="fail"?`<p class="cl-hint">${es(x("readFail"))}</p>`:CUR.ocr.lines&&CUR.ocr.lines.length?`<p class="cl-hint">${es(x("sugg"))}</p><div class="cl-chips">${CUR.ocr.lines.map((l,i)=>`<button type="button" data-cel="chip" data-i="${i}">${es(l)}</button>`).join("")}</div>`:`<p class="cl-hint">${es(x("readFail"))}</p>`):""}
   ${isG&&CUR.col?`<div class="cl-col"><i style="background:${CUR.col.hex}"></i><span>${es(x("colAuto"))}<b>${es(x("c_"+CUR.col.term))}</b> · ${es(x("i_"+CUR.col.inten))}</span></div>`:""}
  </div>`; }
function inp(k,lbl,type){ return `<label class="cl-in"><span>${es(x(lbl))}</span><input ${type?`type="${type}"`:""} data-cel-in="${k}" value="${es(CUR[k])}"></label>`; }
function area(k,lbl){ return `<label class="cl-in"><span>${es(x(lbl))}</span><textarea rows="2" data-cel-in="${k}">${es(CUR[k])}</textarea></label>`; }
function editHTML(){ const w=CUR;
  return `<section class="view cellar">
   <button type="button" class="cl-back" data-cel="list">${es(x("back"))}</button>
   <div class="cl-phs">${photo("label")}${photo("glass")}</div>
   <div class="cl-form">
    ${inp("name","name")}${inp("prod","prod")}
    <div class="cl-2">${inp("vint","vint")}${inp("date","when","date")}</div>
    <div class="cl-in"><span>${es(x("type"))}</span><div class="cl-seg">${TYPES.map(k=>`<button type="button" data-cel="type" data-v="${k}" aria-pressed="${w.type===k}">${es(typeLbl(k))}</button>`).join("")}</div></div>
    ${inp("grape","grape")}${inp("region","region")}
    <h2>${es(x("struct"))}</h2>
    ${["sw","ac",w.type==="white"||w.type==="spark"?null:"tan","alc","body","fin"].filter(Boolean).map(scaleRow).join("")}
    ${area("nose","nose")}${area("pal","pal")}
    <div class="cl-in"><span>${es(x("qual"))}</span><div class="cl-seg">${QUAL.map(k=>`<button type="button" data-cel="q" data-v="${k}" aria-pressed="${w.q===k}">${es(x("q_"+k))}</button>`).join("")}</div></div>
    <div class="cl-in"><span>${es(x("rate"))}</span><div class="cl-stars">${[1,2,3,4,5].map(n=>`<button type="button" data-cel="rate" data-v="${n}" aria-pressed="${w.rate>=n}">★</button>`).join("")}</div></div>
    ${area("notes","notes")}
    ${MSG?`<p class="cl-msg">${es(MSG)}</p>`:""}
    <div class="cl-act"><button type="button" class="btn primary" data-cel="save">${es(x("save"))}</button>${LIST.some(z=>z.id===w.id)?`<button type="button" class="btn ghost cl-del" data-cel="del">${es(x("del"))}</button>`:""}</div>
   </div></section>`; }
W.renderCellar=function(){ return MODE==="edit"&&CUR?editHTML():listHTML(); };
function after(){ if(MODE==="edit"&&CUR&&CUR.glass){ const cv=document.getElementById("cl-cv"); if(!cv) return; const im=new Image(); im.onload=()=>{ const s=Math.min(1,900/Math.max(im.width,im.height)); cv.width=Math.round(im.width*s); cv.height=Math.round(im.height*s); cv.getContext("2d").drawImage(im,0,0,cv.width,cv.height); }; im.src=CUR.glass; } }
function rr(){ if(typeof W.render==="function") W.render(); }

/* hook into the app's render: draw the glass canvas after each render of this view */
const mo=new MutationObserver(()=>{ if(typeof view!=="undefined"&&view==="cellar") after(); });
mo.observe(document.getElementById("main"),{childList:true});

/* ---------- events ---------- */
document.addEventListener("click",async e=>{
  const b=e.target.closest&&e.target.closest("[data-cel]"); if(b){ const k=b.dataset.cel; e.preventDefault();
    if(k==="new"){ CUR=fresh(); MODE="edit"; MSG=""; rr(); return; }
    if(k==="open"){ const w=LIST.find(z=>z.id===b.dataset.id); if(w){ CUR=JSON.parse(JSON.stringify(w)); MODE="edit"; MSG=""; rr(); } return; }
    if(k==="list"){ MODE="list"; CUR=null; rr(); return; }
    if(k==="f"){ F=b.dataset.f; rr(); return; }
    if(k==="type"){ CUR.type=CUR.type===b.dataset.v?"":b.dataset.v; rr(); return; }
    if(k==="q"){ CUR.q=CUR.q===b.dataset.v?"":b.dataset.v; rr(); return; }
    if(k==="rate"){ const n=+b.dataset.v; CUR.rate=CUR.rate===n?0:n; rr(); return; }
    if(k==="sc"){ const kk=b.dataset.k; CUR.s[kk]=CUR.s[kk]===b.dataset.v?"":b.dataset.v; rr(); return; }
    if(k==="chip"){ const v=CUR.ocr.lines[+b.dataset.i]; if(!CUR.name) CUR.name=v; else if(!CUR.prod&&CUR.name!==v) CUR.prod=v; else CUR.name=v; rr(); return; }
    if(k==="save"){ if(!CUR.name.trim()){ MSG=x("need"); rr(); return; } const w=Object.assign({},CUR); if(w.ocr&&typeof w.ocr!=="object") w.ocr=null; w.ts=w.ts||Date.now(); await put(w); await load(); MODE="list"; CUR=null; MSG=""; rr(); toast(x("saved")); return; }
    if(k==="del"){ if(!confirmDel()) return; await del(CUR.id); await load(); MODE="list"; CUR=null; rr(); return; }
  }
  const cv=e.target.closest&&e.target.closest("#cl-cv"); if(cv&&CUR){ const r=cv.getBoundingClientRect(); const fx=(e.clientX-r.left)/r.width, fy=(e.clientY-r.top)/r.height; const c=sampleAt(cv,Math.round(fx*cv.width),Math.round(fy*cv.height)); if(c){ CUR.col=Object.assign(c,{px:fx,py:fy}); if(!CUR.type||["white","rose","red"].includes(CUR.type)) CUR.type=c.fam; rr(); } }
});
let delArm=0; function confirmDel(){ const n=Date.now(); if(n-delArm<4000){ delArm=0; return true; } delArm=n; toast(x("delQ")+" ↻"); return false; }
function toast(s){ let d=document.getElementById("cl-toast"); if(!d){ d=document.createElement("div"); d.id="cl-toast"; document.body.appendChild(d); } d.textContent=s; d.classList.add("on"); clearTimeout(d._t); d._t=setTimeout(()=>d.classList.remove("on"),2400); }
document.addEventListener("input",e=>{ const el=e.target; if(el.id==="cl-q"){ Q=el.value; const p=el.selectionStart; rr(); const n=document.getElementById("cl-q"); if(n){ n.focus(); try{n.setSelectionRange(p,p)}catch(_){} } return; }
  const k=el.dataset&&el.dataset.celIn; if(k&&CUR) CUR[k]=el.value; });
document.addEventListener("change",async e=>{ const el=e.target; const kind=el.dataset&&el.dataset.celFile; if(!kind||!CUR||!el.files||!el.files[0]) return;
  const f=el.files[0];
  if(kind==="label"){ CUR.label=await shrink(f,1100); CUR.ocr="busy"; rr();
    try{ const r=await readLabel(CUR.label); if(!CUR) return; CUR.ocr=r; if(r.year&&!CUR.vint) CUR.vint=r.year; if(!CUR.name&&(r.name||r.lines[0])) CUR.name=r.name||r.lines[0]; }catch(err){ if(CUR) CUR.ocr="fail"; }
    rr(); }
  else { CUR.glass=await shrink(f,1000); CUR.col=null; rr();
    /* first guess: centre of the photo, where the wine usually is */
    setTimeout(()=>{ const cv=document.getElementById("cl-cv"); if(!cv||!CUR) return; const tryIt=()=>{ if(!cv.width||cv.width<10) return setTimeout(tryIt,80); const c=sampleAt(cv,Math.round(cv.width*.5),Math.round(cv.height*.55)); if(c){ CUR.col=Object.assign(c,{px:.5,py:.55}); if(!CUR.type) CUR.type=c.fam; rr(); } }; tryIt(); },60); }
});

/* ---------- register the view in the app ---------- */
try{ TABG.cellar="wine"; SUBV.cellar="wine"; SUBT.cellar="cel"; ["it","fr","en"].forEach(l=>{ T[l].cel=TX[l].cel; T[l].tr_cellar=TX[l].cel; T[l].trd_cellar=TX[l].celD; }); }catch(e){}
try{ ICO.cellar='<svg viewBox="0 0 48 48"><rect x="6" y="6" width="36" height="36" rx="10" fill="#7a1f3d"/><path d="M18 11h12l-1 9a5 5 0 0 1-10 0z" fill="#fff"/><path d="M24 25v8M19 35h10" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="33" cy="14" r="4" fill="#e9c46a"/></svg>'; }catch(e){}
const celCard=()=>`<button type="button" class="schome clhome" data-go="cellar"><span class="scic">🍷</span><span><b>${es(x("cel"))}</b><small>${es(x("celD"))}</small></span><i>▸</i></button>`;
try{ const RW=W.renderWine; if(typeof RW==="function"){ W.renderWine=function(){ const h=RW.apply(this,arguments); return h.includes('class="rvpod2"')?h.replace('<button type="button" class="rvpod2"',celCard()+'<button type="button" class="rvpod2"'):h.replace(/(<\/header>)/,"$1"+celCard()); }; } }catch(e){}
try{ const RH=W.renderHome; if(typeof RH==="function"){ W.renderHome=function(){ const h=RH.apply(this,arguments); return h.includes('class="schome" data-go="school"')?h.replace('<button type="button" class="schome" data-go="school"',celCard()+'<button type="button" class="schome" data-go="school"'):h; }; } }catch(e){}
const st=document.createElement("style"); st.textContent=`
.cellar{max-width:760px;margin:0 auto}
.cl-kick{margin:0;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--wine,#7a1f3d);font-weight:700}
.cellar h1{margin:4px 0 6px}.cl-intro{margin:0 0 14px;color:var(--muted,#5d6660);line-height:1.45}
.cl-add{width:100%;padding:14px;font-size:16px;margin-bottom:14px}
.cl-bar{display:flex;flex-direction:column;gap:8px;margin-bottom:8px}.cl-bar input{width:100%;padding:11px 14px;border-radius:12px;border:1px solid var(--line,#e5ddd3);background:var(--surface,#fff);color:inherit;font:inherit}
.cl-f,.cl-seg{display:flex;flex-wrap:wrap;gap:6px}.cl-f button,.cl-seg button,.cl-sc button,.cl-chips button{border:1px solid var(--line,#e5ddd3);background:var(--surface,#fff);color:inherit;border-radius:999px;padding:6px 12px;font:inherit;font-size:13.5px;cursor:pointer}
.cl-f button[aria-pressed=true],.cl-seg button[aria-pressed=true],.cl-sc button[aria-pressed=true]{background:var(--wine,#7a1f3d);border-color:var(--wine,#7a1f3d);color:#fff}
.cl-count{font-size:13px;color:var(--faint,#8a8f8b);margin:6px 0}
.cl-list{display:grid;gap:10px}.cl-item{display:flex;gap:12px;align-items:center;text-align:left;border:1px solid var(--line,#e5ddd3);background:var(--surface,#fff);border-radius:16px;padding:10px;cursor:pointer;color:inherit;font:inherit}
.cl-th{flex:0 0 64px;height:64px;border-radius:12px;overflow:hidden;background:var(--sunk,#f3eee8);display:grid;place-items:center;font-size:28px}.cl-th img{width:100%;height:100%;object-fit:cover}
.cl-tx{display:flex;flex-direction:column;gap:2px;min-width:0}.cl-tx b{font-size:15.5px}.cl-tx b i{font-style:normal;color:var(--muted,#5d6660);font-weight:500}.cl-tx>span{font-size:13px;color:var(--muted,#5d6660)}
.cl-tags{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.cl-ty{font-style:normal;font-size:11.5px;padding:2px 8px;border-radius:999px;background:var(--wine-s,#f6e3ea);color:var(--wine,#7a1f3d);font-weight:700}
.cl-sw{display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--c);box-shadow:0 0 0 1px rgba(0,0,0,.15)}.cl-st{color:#d4a017;letter-spacing:1px}
.cl-empty{padding:30px 16px;text-align:center;border:1px dashed var(--line,#e5ddd3);border-radius:16px;color:var(--muted,#5d6660)}
.cl-local{font-size:12.5px;color:var(--faint,#8a8f8b);margin-top:14px}
.cl-back{border:0;background:none;color:var(--wine,#7a1f3d);font:inherit;font-weight:700;padding:4px 0 12px;cursor:pointer}
.cl-phs{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px}@media(max-width:560px){.cl-phs{grid-template-columns:1fr}}
.cl-ph{border:1px solid var(--line,#e5ddd3);border-radius:16px;padding:12px;background:var(--surface,#fff);display:flex;flex-direction:column;gap:8px}
.cl-lab{margin:0;font-weight:700}.cl-shot{display:grid;place-items:center;min-height:150px;border:2px dashed var(--line2,#d8cfc4);border-radius:14px;cursor:pointer;font-weight:700;color:var(--wine,#7a1f3d);text-align:center;padding:12px}
.cl-pic{position:relative;border-radius:12px;overflow:hidden;background:#000}.cl-pic img,.cl-pic canvas{display:block;width:100%;height:auto;max-height:340px;object-fit:contain}.cl-tap canvas{cursor:crosshair}
.cl-dot{position:absolute;width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 2px rgba(0,0,0,.45);pointer-events:none}
.cl-hint{margin:0;font-size:13px;color:var(--muted,#5d6660)}.cl-chips{display:flex;flex-wrap:wrap;gap:6px}
.cl-col{display:flex;align-items:center;gap:10px;font-size:14px}.cl-col i{flex:0 0 34px;height:34px;border-radius:50%;box-shadow:inset 0 0 0 2px rgba(255,255,255,.5),0 0 0 1px rgba(0,0,0,.2)}.cl-col b{margin-left:4px}
.cl-form{display:flex;flex-direction:column;gap:12px}.cl-form h2{margin:8px 0 0;font-size:18px}
.cl-in{display:flex;flex-direction:column;gap:6px}.cl-in>span{font-size:13px;font-weight:700;color:var(--muted,#5d6660)}
.cl-in input,.cl-in textarea{width:100%;padding:11px 13px;border-radius:12px;border:1px solid var(--line,#e5ddd3);background:var(--surface,#fff);color:inherit;font:inherit;box-sizing:border-box}
.cl-2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.cl-sc{display:flex;flex-direction:column;gap:6px}.cl-sc>span{font-size:13px;font-weight:700;color:var(--muted,#5d6660)}.cl-sc>div{display:flex;flex-wrap:wrap;gap:6px}
.cl-stars button{border:0;background:none;font-size:30px;color:var(--line2,#d8cfc4);cursor:pointer;padding:0 2px}.cl-stars button[aria-pressed=true]{color:#d4a017}
.cl-act{display:flex;gap:10px;flex-wrap:wrap;margin-top:6px}.cl-act .primary{flex:1;padding:14px}.cl-del{color:var(--bad,#b3261e)}
.cl-msg{color:var(--bad,#b3261e);margin:0}
#cl-toast{position:fixed;left:50%;bottom:90px;transform:translate(-50%,20px);background:#2a2230;color:#fff;padding:10px 16px;border-radius:999px;font-size:14px;opacity:0;transition:.25s;z-index:9999;pointer-events:none}#cl-toast.on{opacity:1;transform:translate(-50%,0)}
.clhome{margin-bottom:12px}`;
document.head.appendChild(st);
})();
