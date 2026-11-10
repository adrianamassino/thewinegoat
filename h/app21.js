/* ---------- v103: written answers — answer on paper and send a photo; "perfect answer" available anytime ---------- */
Object.assign(T.it,{phMax:"Puoi inviare al massimo {n} foto per risposta: ho tenuto le prime {n}.",phT:"Hai risposto su un foglio?",phD:"Fotografa la tua risposta scritta a mano (puoi selezionare più foto insieme): la trascrivo nei riquadri e poi la correggo.",phPick:"📷 Scatta o carica le foto",phMore:"+ Aggiungi un'altra pagina",phGo:"Trascrivi e correggi",phReading:"Sto leggendo la tua calligrafia…",phDone:"Ho trascritto la tua risposta qui sopra: controllala. La correzione parte subito.",phFail:"Non sono riuscito a leggere la foto. Riprova con più luce, il foglio dritto e ben inquadrato.",phNoImg:"Le foto non sono disponibili in questa versione dell'app: scrivi la risposta nei riquadri.",phRm:"Togli",pfT:"✨ Risposta perfetta",pfD:"La risposta modello da pieni voti, parte per parte.",pfShow:"Mostra la risposta perfetta",pfGen:"Preparo la risposta perfetta…",pfKeys:"Punti chiave da citare (risposta perfetta non disponibile senza l'IA):",pfHide:"Nascondi",pfMarks:"punti",pfErr:"Non sono riuscito a preparare la risposta perfetta: riprova."});
Object.assign(T.fr,{phMax:"Vous pouvez envoyer au maximum {n} photos par réponse : j'ai gardé les {n} premières.",phT:"Vous avez répondu sur papier ?",phD:"Photographiez votre réponse manuscrite (vous pouvez sélectionner plusieurs photos à la fois) : je la retranscris dans les cadres, puis je la corrige.",phPick:"📷 Prendre ou charger les photos",phMore:"+ Ajouter une autre page",phGo:"Retranscrire et corriger",phReading:"Je lis votre écriture…",phDone:"J'ai retranscrit votre réponse ci-dessus : vérifiez-la. La correction démarre tout de suite.",phFail:"Je n'ai pas réussi à lire la photo. Réessayez avec plus de lumière, la feuille droite et bien cadrée.",phNoImg:"Les photos ne sont pas disponibles dans cette version de l'application : écrivez la réponse dans les cadres.",phRm:"Retirer",pfT:"✨ Réponse parfaite",pfD:"La réponse modèle qui obtient tous les points, partie par partie.",pfShow:"Afficher la réponse parfaite",pfGen:"Je prépare la réponse parfaite…",pfKeys:"Points clés à citer (réponse parfaite indisponible sans l'IA) :",pfHide:"Masquer",pfMarks:"points",pfErr:"Je n'ai pas réussi à préparer la réponse parfaite : réessayez."});
Object.assign(T.en,{phMax:"You can send at most {n} photos per answer: I kept the first {n}.",phT:"Answered on paper?",phD:"Take a photo of your handwritten answer (you can select several photos at once): I'll transcribe it into the boxes and then mark it.",phPick:"📷 Take or upload photos",phMore:"+ Add another page",phGo:"Transcribe and mark",phReading:"Reading your handwriting…",phDone:"I've transcribed your answer above: check it. Marking starts right away.",phFail:"I couldn't read the photo. Try again with more light and the page straight and well framed.",phNoImg:"Photos aren't available in this version of the app: type your answer in the boxes.",phRm:"Remove",pfT:"✨ Perfect answer",pfD:"The full-marks model answer, part by part.",pfShow:"Show the perfect answer",pfGen:"Preparing the perfect answer…",pfKeys:"Key points to cover (perfect answer unavailable without AI):",pfHide:"Hide",pfMarks:"marks",pfErr:"I couldn't prepare the perfect answer: please try again."});
let PH={id:null,files:[],urls:[],busy:false,msg:"",err:false}, PHCAP=null;
(async()=>{ try{ if(sampleFn===undefined) await sampleReady; if(sampleFn&&typeof sampleFn.limits==="function"){ const c=await sampleFn.limits().catch(()=>null); PHCAP=c&&c.images?c.images:false; } else PHCAP=false; }catch(e){ PHCAP=false; } if(oq&&view==="open") render(); })();
function phReset(id){ PH.urls.forEach(u=>{try{URL.revokeObjectURL(u)}catch(e){}}); PH={id,files:[],urls:[],busy:false,msg:"",err:false}; }
/* perfect answer cache: per question, per language */
const PFK="wset3-perfect"; let PF={}; try{ PF=JSON.parse(lsGet(PFK)||"{}")||{}; }catch(e){ PF={}; }
let PFOPEN={}, PFBUSY={}, PFERR={};
function pfSave(){ try{ lsSet(PFK,JSON.stringify(PF)); }catch(e){} }
async function pfMake(id){ const o=OBY[id], lg=lang; if(PFBUSY[id]) return; PFBUSY[id]=1; PFERR[id]=0; render();
  try{
    if(sampleFn===undefined) await sampleReady; if(!sampleFn||typeof sampleFn.json!=="function") throw 0;
    const l=L();
    const prompt=`You are a Level 3 wine examiner. Write the PERFECT full-marks answer a top student would write by hand in the exam for this written question, in ${CLN[lg]}. For each part, write a well-organised answer that covers every key point needed for full marks, in proportion to the marks (roughly two clear points per mark), with cause-and-effect explanations; plain sentences or short bullet-like lines, no headings, no tables.\n\nQuestion: ${o.q[l]}\n${o.parts.map((p,i)=>`${"abcdefgh"[i]}) ${p.t[l]} [${p.m} marks]\nKey points (reference): ${oKey(p,2)}`).join("\n\n")}\n\nReply with ONLY this JSON: {"parts":["answer to a)","answer to b)", …]} — exactly ${o.parts.length} strings, all in ${CLN[lg]}.`;
    const out=await sampleFn.json(prompt,{cache:true});
    const arr=out&&Array.isArray(out.parts)?out.parts.map(x=>String(x||"").trim()):[];
    if(arr.length!==o.parts.length||!arr.every(x=>x)) throw 0;
    (PF[id]=PF[id]||{})[lg]=arr; pfSave();
  }catch(e){ PFERR[id]=1; }
  PFBUSY[id]=0; if(oq===id&&view==="open") render(); }
function pfBox(o){ const id=o.id, l=L(), has=PF[id]&&PF[id][lang], open=!!PFOPEN[id], off=chatOff||sampleFn===null;
  let body="";
  if(open){
    if(has) body=`<div class="pfbody">${o.parts.map((p,i)=>`<div class="pfpart"><div class="pfh"><b>${"abcdefgh"[i]})</b> ${esc(p.t[l])} <span class="tag">${p.m} ${t("pfMarks")}</span></div><div class="pftx">${esc(PF[id][lang][i]).replace(/\n/g,"<br>")}</div></div>`).join("")}</div>`;
    else if(off) body=`<div class="pfbody"><p class="muted small" style="margin:0 0 6px">${esc(t("pfKeys"))}</p>${o.parts.map((p,i)=>`<div class="pfpart"><div class="pfh"><b>${"abcdefgh"[i]})</b> ${esc(p.t[l])}</div><div class="pftx">${esc(oKey(p,l))}</div></div>`).join("")}</div>`;
    else if(PFBUSY[id]) body=`<p class="muted pfbody">⏳ ${esc(t("pfGen"))}</p>`;
    else if(PFERR[id]) body=`<p class="chat-err pfbody">${esc(t("pfErr"))}</p>`;
  }
  return `<div class="pfcard"><div class="pftop"><div><b>${esc(t("pfT"))}</b><div class="muted small">${esc(t("pfD"))}</div></div><button type="button" class="btn ${open?"ghost":"primary"}" data-pf="${id}">${esc(open?t("pfHide"):t("pfShow"))}</button></div>${body}</div>`; }
function phBox(o){ const id=o.id; if(PH.id!==id) phReset(id);
  if(PHCAP===false) return "";
  const busy=PH.busy||(OPEND&&OPEND.id===id);
  const th=PH.urls.map((u,i)=>`<div class="phth"><img src="${u}" alt=""><button type="button" data-phrm="${i}" ${busy?"disabled":""}>${esc(t("phRm"))}</button></div>`).join("");
  const max=PHCAP&&PHCAP.maxCount?PHCAP.maxCount:4, acc=PHCAP&&PHCAP.mediaTypes?PHCAP.mediaTypes.join(","):"image/*";
  return `<div class="phcard"><div><b>${esc(t("phT"))}</b><div class="muted small">${esc(t("phD"))}</div></div>
    ${th?`<div class="phths">${th}</div>`:""}
    <div class="row" style="gap:8px;flex-wrap:wrap">${PH.files.length<max&&camAvail()?`<button type="button" class="btn primary" id="ph-cam" ${busy?"disabled":""}>📸 ${esc(t("phCam"))}</button>`:""}${PH.files.length<max?`<label class="btn ${PH.files.length||camAvail()?"":"primary"} phpick"><input type="file" accept="${acc}" multiple id="ph-in" ${busy?"disabled":""} hidden>${esc(PH.files.length?t("phMore"):t("phPick"))}</label>`:""}
    ${PH.files.length?`<button type="button" class="btn primary" id="ph-go" ${busy?"disabled":""}>${esc(t("phGo"))}</button>`:""}</div>
    ${PH.msg?`<p class="${PH.err?"chat-err":"muted"} small" style="margin:0" aria-live="polite">${PH.busy?"⏳ ":""}${esc(PH.msg)}</p>`:""}</div>`; }
async function phRun(id){ const o=OBY[id]; if(!PH.files.length||PH.busy) return; PH.busy=true; PH.err=false; PH.msg=t("phReading"); render();
  try{
    if(sampleFn===undefined) await sampleReady; if(!sampleFn||typeof sampleFn.json!=="function") throw {code:"off"};
    const l=L();
    const prompt=`The attached photo(s) show a student's HANDWRITTEN answer, on paper, to this written wine exam question (pages in order). Transcribe faithfully what the student wrote — do not correct, improve or add anything; keep their wording, abbreviations and mistakes; write [?] for an illegible word. Split the text by part: the student may label parts a), b), c)… — if there are no labels, assign each passage to the part it answers. A part with no answer is an empty string.\n\nQuestion: ${o.q[l]}\n${o.parts.map((p,i)=>`${"abcdefgh"[i]}) ${p.t[l]}`).join("\n")}\n\nReply with ONLY this JSON: {"parts":["text for a)","text for b)", …]} — exactly ${o.parts.length} strings, in the language the student wrote in.`;
    const out=await sampleFn.json(prompt,{images:PH.files,cache:false});
    const arr=out&&Array.isArray(out.parts)?out.parts.map(x=>String(x||"").trim()):[];
    if(arr.length!==o.parts.length||!arr.some(x=>x)) throw {code:"empty"};
    ODR[id]=arr; saveDraft(); oSel[id]=-1;
    PH.busy=false; PH.msg=t("phDone"); render();
    await gradeOpen(id);
    if(OA[id]&&OA[id].length){ const a=OA[id][OA[id].length-1]; if(a&&!a.ph){ a.ph=PH.files.length; saveOA(id); } }
    phReset(id); render();
  }catch(e){ PH.busy=false; PH.err=true; const c=e&&e.code;
    if(c==="images_unavailable"){ PHCAP=false; PH.msg=t("phNoImg"); }
    else if(["not_granted","sampling_disabled","not_declared","capability_disabled","off"].includes(c)){ chatOff=true; PH.msg=t("oOff"); }
    else if(c==="rate_limited") PH.msg=t("oRate");
    else PH.msg=t("phFail");
    render(); } }
{ const _ro21=renderOQ; renderOQ=function(){ let h=_ro21.apply(this,arguments); try{
    const o=OBY[oq], atts=OA[oq]||[]; let sel=oSel[oq]; if(sel===undefined) sel=atts.length&&!ODR[oq]?atts.length-1:-1;
    const extra=(sel<0?phBox(o):"")+pfBox(o);
    h=h.replace('<p class="chat-err small" id="o-err"',extra+'<p class="chat-err small" id="o-err"');
  }catch(e){} return h; }; }
document.addEventListener("change",e=>{ const i=e.target; if(!i||i.id!=="ph-in"||!i.files||!i.files.length) return;
  const max=PHCAP&&PHCAP.maxCount?PHCAP.maxCount:4;
  let drop=0; [...i.files].forEach(f=>{ if(!/^image\//.test(f.type||"image/")) return; if(PH.files.length<max){ PH.files.push(f); PH.urls.push(URL.createObjectURL(f)); } else drop++; });
  PH.msg=drop?t("phMax").replace("{n}",max):""; PH.err=!!drop; render(); });
document.addEventListener("click",e=>{ const b=e.target.closest&&e.target.closest("#ph-go,[data-phrm],[data-pf]"); if(!b) return;
  if(b.id==="ph-go"){ e.preventDefault(); phRun(oq); return; }
  if(b.dataset.phrm!==undefined){ const k=+b.dataset.phrm; try{URL.revokeObjectURL(PH.urls[k])}catch(x){} PH.files.splice(k,1); PH.urls.splice(k,1); render(); return; }
  if(b.dataset.pf){ const id=b.dataset.pf; PFOPEN[id]=!PFOPEN[id]; if(PFOPEN[id]&&!(PF[id]&&PF[id][lang])&&!(chatOff||sampleFn===null)) pfMake(id); else render(); } });
try{ const st21=document.createElement("style"); st21.textContent=`
.phcard,.pfcard{display:flex;flex-direction:column;gap:10px;padding:14px;border-radius:16px;border:1.5px dashed color-mix(in srgb,var(--wine,#7a1d3a) 40%,transparent);background:color-mix(in srgb,var(--wine,#7a1d3a) 4%,var(--surface,#fff))}
.pfcard{border-style:solid;background:color-mix(in srgb,#d4a017 7%,var(--surface,#fff));border-color:color-mix(in srgb,#d4a017 45%,transparent)}
.pftop{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
.phpick{cursor:pointer;display:inline-flex;align-items:center}
.phths{display:flex;gap:8px;flex-wrap:wrap}
.phth{display:flex;flex-direction:column;gap:4px;align-items:center}
.phth img{width:84px;height:110px;object-fit:cover;border-radius:10px;border:1px solid var(--line,#ddd)}
.phth button{font:inherit;font-size:.75rem;border:0;background:none;color:var(--muted,#7b6a5c);text-decoration:underline;cursor:pointer}
.pfbody{display:flex;flex-direction:column;gap:12px;margin:0}
.pfh{font-size:.88rem;margin-bottom:4px}.pfh .tag{margin-left:6px}
.pftx{white-space:normal;line-height:1.55;font-size:.95rem;padding:10px 12px;border-radius:12px;background:var(--surface,#fff);border:1px solid var(--line,#eee)}
`; document.head.appendChild(st21); }catch(e){}
