/* ---------- v115: UX — appunti chiari e raggiungibili, Ripasso diviso in sezioni, collegamenti diretti (#go=…) ---------- */
Object.assign(T.it,{pdIntro:"Ogni tema raccontato come una lezione: ascoltala e segui il testo mentre parla.",trd_pods:"Lezioni da ascoltare, tema per tema",
 rvSecNotes:"✍️ I tuoi appunti",rvSecListen:"🎧 Ascolta e guarda",rvSecRead:"📚 Leggi e memorizza",rvSecMaps:"🗺️ Mappe",
 ntRec:"Registra una lezione",ntRecD:"Premi, appoggia il telefono vicino all'insegnante: l'app scrive mentre parla.",
 ntSnap:"Fotografa gli appunti",ntSnapD:"Scatta le pagine scritte a mano: restano qui, ordinate, con il tuo testo.",
 ntOpenAll:"Apri tutti gli appunti",ntCount:"{n} appunti salvati",ntCount0:"Nessun appunto ancora",
 ntHow:"Come funziona",ntStepsL:["Scegli la lingua dell'insegnante","Premi «Inizia ad ascoltare» e appoggia il telefono vicino a chi parla","Aggiungi le tue note quando vuoi","Premi «Termina e salva»: la lezione va nei tuoi appunti"],
 ntStepsP:["Premi «Fotocamera» o scegli le foto dalla galleria","Fotografa una o più pagine (fino a 8)","Premi «Salva le pagine»","Ritrovi l'appunto qui, con lo spazio per il tuo testo"],
 ntAll:"Tutti",ntOnlyL:"Lezioni",ntOnlyP:"Foto"});
Object.assign(T.fr,{pdIntro:"Chaque thème raconté comme une leçon : écoutez-la et suivez le texte pendant qu'elle parle.",trd_pods:"Des leçons à écouter, thème par thème",
 rvSecNotes:"✍️ Vos notes",rvSecListen:"🎧 Écouter et regarder",rvSecRead:"📚 Lire et mémoriser",rvSecMaps:"🗺️ Cartes",
 ntRec:"Enregistrer un cours",ntRecD:"Appuyez, posez le téléphone près de l'enseignant : l'application écrit pendant qu'il parle.",
 ntSnap:"Photographier mes notes",ntSnapD:"Prenez vos pages manuscrites en photo : elles restent ici, classées, avec votre texte.",
 ntOpenAll:"Ouvrir toutes les notes",ntCount:"{n} notes enregistrées",ntCount0:"Aucune note pour l'instant",
 ntHow:"Comment ça marche",ntStepsL:["Choisissez la langue de l'enseignant","Appuyez sur « Commencer l'écoute » et posez le téléphone près de la personne qui parle","Ajoutez vos annotations quand vous voulez","Appuyez sur « Terminer et enregistrer » : le cours rejoint vos notes"],
 ntStepsP:["Appuyez sur « Appareil photo » ou choisissez des photos dans la galerie","Photographiez une ou plusieurs pages (jusqu'à 8)","Appuyez sur « Enregistrer les pages »","Retrouvez la note ici, avec la place pour votre texte"],
 ntAll:"Toutes",ntOnlyL:"Cours",ntOnlyP:"Photos"});
Object.assign(T.en,{pdIntro:"Every topic told as a lesson: listen and follow the text as it plays.",trd_pods:"Lessons to listen to, topic by topic",
 rvSecNotes:"✍️ Your notes",rvSecListen:"🎧 Listen and watch",rvSecRead:"📚 Read and memorise",rvSecMaps:"🗺️ Maps",
 ntRec:"Record a lesson",ntRecD:"Tap, place your phone near the teacher: the app writes as they speak.",
 ntSnap:"Photograph my notes",ntSnapD:"Snap your handwritten pages: they stay here, organised, with your own text.",
 ntOpenAll:"Open all notes",ntCount:"{n} saved notes",ntCount0:"No notes yet",
 ntHow:"How it works",ntStepsL:["Choose the teacher's language","Tap “Start listening” and place your phone near the speaker","Add your own notes whenever you like","Tap “Finish and save”: the lesson goes into your notes"],
 ntStepsP:["Tap “Camera” or choose photos from your gallery","Photograph one or more pages (up to 8)","Tap “Save the pages”","Find the note here, with room for your own text"],
 ntAll:"All",ntOnlyL:"Lessons",ntOnlyP:"Photos"});

let NTF="all";
function ntPanel(compact){ const n=NOTES.length;
  return `<div class="ntpanel${compact?" compact":""}">
    <button type="button" class="ntbig2 nrec" data-ntgo="lesson"><span class="ntb-ic" aria-hidden="true"><i class="ntb-dot"></i>🎙️</span><span class="ntb-tx"><b>${esc(t("ntRec"))}</b><small>${esc(t("ntRecD"))}</small></span><span class="ntb-go" aria-hidden="true">▸</span></button>
    <button type="button" class="ntbig2 nsnap" data-ntgo="photo"><span class="ntb-ic" aria-hidden="true">📷</span><span class="ntb-tx"><b>${esc(t("ntSnap"))}</b><small>${esc(t("ntSnapD"))}</small></span><span class="ntb-go" aria-hidden="true">▸</span></button>
    <button type="button" class="ntall" data-ntgo="list"><span>📝 ${esc(n?t("ntCount").replace("{n}",n):t("ntCount0"))}</span><b>${esc(t("ntOpenAll"))} ▸</b></button></div>`; }
function ntSteps(arr){ return `<details class="ntsteps" open><summary>${esc(t("ntHow"))}</summary><ol>${arr.map(x=>`<li>${esc(x)}</li>`).join("")}</ol></details>`; }

/* notes page: clearer list mode, steps in the two tools */
{ const _rn27=renderNotes; renderNotes=function(){
  if(NTV==="list"){
    const live=LS.on||LS.final||LS.mine;
    const items=NOTES.filter(n=>NTF==="all"||(NTF==="lesson"?n.src==="lesson":n.src==="photo"));
    const chips=NOTES.length?`<div class="dccats">${[["all",t("ntAll")],["lesson","🎙️ "+t("ntOnlyL")],["photo","📷 "+t("ntOnlyP")]].map(([k,x])=>`<button type="button" class="chip" data-ntf="${k}" aria-pressed="${NTF===k}">${esc(x)}</button>`).join("")}</div>`:"";
    const list=items.length?items.map(n=>`<button type="button" class="ntitem" data-ntopen="${n.id}"><span class="ntic">${n.src==="lesson"?"🎙️":"📷"}</span><span class="nttxt"><b>${esc(n.t||"")}</b><small>${esc(ntDate(n.at))} · ${n.imgs&&n.imgs.length?n.imgs.length+" 📄":ntWords((n.txt||"")+" "+(n.mine||""))+" "+esc(t("ntWords"))}</small><span class="ntex">${esc(String(n.txt||n.mine||"").slice(0,140))}</span></span><i>▸</i></button>`).join(""):`<p class="muted">${esc(t("ntEmpty"))}</p>`;
    return `<section class="view ntv"><div class="qzhero"><div class="qzhtx"><small>${esc(t("rvKick"))}</small><h1>${esc(t("tr_notes"))}</h1></div>${gfree("n13",90)}<p class="phi">${esc(t("ntIntro"))}</p></div>
      ${live?`<button type="button" class="ntresume" data-ntgo="lesson"><i class="ntb-dot"></i> ${esc(LS.on&&!LS.paused?t("ntListening"):t("ntPausedL"))} · ${esc(t("ntLesson"))} ▸</button>`:""}
      <div class="ntpanel"><button type="button" class="ntbig2 nrec" data-ntgo="lesson"><span class="ntb-ic" aria-hidden="true"><i class="ntb-dot"></i>🎙️</span><span class="ntb-tx"><b>${esc(t("ntRec"))}</b><small>${esc(t("ntRecD"))}</small></span><span class="ntb-go" aria-hidden="true">▸</span></button>
      <button type="button" class="ntbig2 nsnap" data-ntgo="photo"><span class="ntb-ic" aria-hidden="true">📷</span><span class="ntb-tx"><b>${esc(t("ntSnap"))}</b><small>${esc(t("ntSnapD"))}</small></span><span class="ntb-go" aria-hidden="true">▸</span></button></div>
      <h2 class="nth2">${esc(t("ntList"))} <span class="muted small">(${NOTES.length})</span></h2>${chips}<div class="ntlist">${list}</div></section>`; }
  let h=_rn27.apply(this,arguments);
  try{ if(NTV==="lesson") h=h.replace(/(<h1 class="nth">[\s\S]*?<\/h1>)/,`$1${LS.on||LS.final?"":ntSteps(t("ntStepsL"))}`);
       if(NTV==="photo") h=h.replace(/(<h1 class="nth">[\s\S]*?<\/h1>)/,`$1${PH.files.length?"":ntSteps(t("ntStepsP"))}`); }catch(e){}
  return h; }; }
function ntGo(where){ NTV=where==="lesson"||where==="photo"?where:"list"; NTMSG=""; NTERR=false; if(NTV==="photo") phReset("__notes"); go("notes"); window.scrollTo(0,0); }
document.addEventListener("click",e=>{ const b=e.target.closest&&e.target.closest("[data-ntgo],[data-ntf]"); if(!b) return; e.preventDefault(); e.stopPropagation();
  if(b.dataset.ntf){ NTF=b.dataset.ntf; render(); return; }
  ntGo(b.dataset.ntgo); },true);

/* Ripasso hub: notes first, then clear sections */
{ const _rw27=renderWine; renderWine=function(){ let h=_rw27.apply(this,arguments); try{
    const sec=k=>`<h2 class="rvsec">${esc(t(k))}</h2>`;
    h=h.replace(/(<\/header>)/,`$1${sec("rvSecNotes")}${ntPanel(true)}${sec("rvSecListen")}`);
    h=h.replace(/(<button type="button" class="rvt2 rv-flash)/,`<h2 class="rvsec full">${esc(t("rvSecRead"))}</h2>$1`);
    h=h.replace(/(<button type="button" class="rvt2 rv-atlas)/,`<h2 class="rvsec full">${esc(t("rvSecMaps"))}</h2>$1`);
  }catch(e){} return h; }; }
/* Home: the two note tools directly */
{ const _rh27=renderHome; renderHome=function(){ const h=_rh27.apply(this,arguments); try{
    return h.replace(/(<button type="button" class="hero2"[\s\S]*?<\/button>)/,`$1<h2 class="hsec">${esc(t("rvSecNotes"))}</h2>${ntPanel(true)}`); }catch(e){ return h; } }; }

/* direct links from the website: …/app/#go=films, #go=notes-lesson, #go=pods … */
function deepGo(){ try{ const m=/[#&]go=([a-z_]+)(?:-([a-z]+))?/.exec(location.hash||""); if(!m) return; const v=m[1], sub=m[2];
    if(v==="notes"){ ntGo(sub||"list"); }
    else if(typeof TABG==="object"&&TABG[v]){ go(v); window.scrollTo(0,0); }
    history.replaceState(null,"",location.pathname+location.search); }catch(e){} }
setTimeout(deepGo,60); window.addEventListener("hashchange",deepGo);

try{ const st27=document.createElement("style"); st27.textContent=`
.rvsec{margin:18px 2px 6px;font-size:1.05rem;font-weight:800;letter-spacing:.01em}
.rvgrid2 .rvsec.full{grid-column:1/-1;margin:10px 2px 0}
.ntpanel{display:flex;flex-direction:column;gap:10px;margin:6px 0 4px}
.ntbig2{font:inherit;display:flex;align-items:center;gap:14px;text-align:left;width:100%;padding:16px 18px;border-radius:20px;border:0;cursor:pointer;color:#fff;box-shadow:0 5px 0 rgba(0,0,0,.25)}
.ntbig2.nrec{background:linear-gradient(135deg,#7a1230,#c2185b)}.ntbig2.nsnap{background:linear-gradient(135deg,#123a3a,#1f6f6b)}
.ntbig2:active{transform:translateY(3px);box-shadow:0 2px 0 rgba(0,0,0,.25)}
.ntb-ic{position:relative;flex:none;width:52px;height:52px;border-radius:50%;background:rgba(255,255,255,.18);display:grid;place-items:center;font-size:1.6rem}
.ntb-dot{position:absolute;top:4px;right:4px;width:11px;height:11px;border-radius:50%;background:#ff4d4d;box-shadow:0 0 0 2px #fff;animation:ntp 1.4s infinite}
.ntb-tx{display:flex;flex-direction:column;gap:2px;min-width:0}.ntb-tx b{font-size:1.08rem}.ntb-tx small{opacity:.92;line-height:1.35}
.ntb-go{margin-left:auto;font-size:1.3rem;opacity:.9}
.ntall{font:inherit;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;padding:12px 16px;border-radius:16px;border:1.5px solid var(--line,#eadfd4);background:var(--surface,#fff);color:inherit;cursor:pointer}
.ntall b{color:var(--wine,#7a1d3a)}
.ntpanel.compact .ntbig2{padding:13px 15px}.ntpanel.compact .ntb-ic{width:44px;height:44px;font-size:1.35rem}
.ntresume{font:inherit;font-weight:800;display:flex;align-items:center;gap:10px;padding:12px 16px;border-radius:14px;border:2px solid #d32f2f;background:#fff4f4;color:#b3261e;cursor:pointer;position:relative}
.ntresume .ntb-dot{position:static;box-shadow:none}
.ntsteps{border-radius:14px;background:var(--sunk,#f6efe6);padding:10px 14px}
.ntsteps summary{font-weight:800;cursor:pointer}
.ntsteps ol{margin:8px 0 2px;padding-left:22px;line-height:1.5}
`; document.head.appendChild(st27); }catch(e){}
