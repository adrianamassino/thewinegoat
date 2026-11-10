/* ---------- v114: modalità autonoma — nessun servizio esterno.
   Le domande aperte si correggono in locale confrontando la risposta con i punti chiave del libro;
   chat IA, analisi IA della degustazione, lettura IA delle foto e traduzioni IA sono rimosse. ---------- */
sampleFn=null; try{ sampleReady.then(()=>{ sampleFn=null; }); }catch(e){}
chatOff=true;
chatBox=function(){ return ""; };
Object.assign(T.it,{oGrade:"Correggi",oGrading:"Correzione…",trd_open:"Risposte scritte corrette in base ai punti chiave del libro",
 oIntro:"Domande aperte come nella parte scritta dell'esame, su tutti gli argomenti. Scrivi la risposta per ogni punto: l'app la confronta con i punti chiave del libro, ti dà un punteggio per punto, ti dice cosa hai centrato e cosa manca e ti mostra la risposta modello.",
 mkS_openD:"4 domande da capitoli diversi, corrette alla fine in base ai punti chiave del libro.",mkNoAI:"non corretta",
 sAIoff:"Confronta i tuoi aromi con il profilo atteso qui sotto.",sNoAIb:"Nota salvata nel diario.",sModeBd:"Compila la SAT mentre assaggi: la nota resta salvata nel tuo diario.",
 sIntro:"Allena l'approccio sistematico alla degustazione (SAT) del Level 3 con i termini ufficiali. Due modi: scrivi la nota tipica di un vino classico (l'app corregge struttura e conclusioni e ti mostra il profilo atteso), oppure registra la nota di un vino che stai assaggiando. Le note restano salvate nel tuo diario.",
 sSaveOnly:"Salva la nota",pfKeys:"Risposta modello costruita dai punti chiave del libro:",
 lgFbHi:"Ottima risposta: hai toccato quasi tutti i punti chiave.",lgFbMid:"Risposta sufficiente: completa con i punti mancanti qui sotto per salire di punteggio.",lgFbLo:"Mancano diversi punti chiave: rileggili qui sotto e prova a riscrivere la risposta.",
 lgNote:"Correzione automatica basata sui punti chiave del libro: se hai espresso un concetto con parole molto diverse, controlla tu stesso nella risposta modello.",
 lgShort:"Risposta molto breve: all'esame servono frasi complete che spieghino il perché.",
 accountTxt:"I tuoi progressi sono salvati su questo dispositivo, in questo browser.",accountLocal:"I tuoi progressi sono salvati su questo dispositivo, in questo browser."});
Object.assign(T.fr,{oGrade:"Corriger",oGrading:"Correction…",trd_open:"Réponses rédigées corrigées d'après les points clés du livre",
 oIntro:"Questions ouvertes comme dans l'épreuve écrite, sur tous les thèmes. Rédigez la réponse à chaque partie : l'application la compare aux points clés du livre, donne une note par partie, indique ce que vous avez trouvé et ce qui manque, et montre la réponse modèle.",
 mkS_openD:"4 questions de chapitres différents, corrigées à la fin d'après les points clés du livre.",mkNoAI:"non corrigée",
 sAIoff:"Comparez vos arômes au profil attendu ci-dessous.",sNoAIb:"Note enregistrée dans le carnet.",sModeBd:"Remplissez la SAT pendant la dégustation : la note reste enregistrée dans votre carnet.",
 sIntro:"Entraînez-vous à l'approche systématique de la dégustation (SAT) du niveau 3 avec les termes officiels. Deux modes : rédigez la note type d'un vin classique (l'application corrige la structure et les conclusions et montre le profil attendu), ou enregistrez la note d'un vin que vous dégustez. Les notes restent dans votre carnet.",
 sSaveOnly:"Enregistrer la note",pfKeys:"Réponse modèle construite à partir des points clés du livre :",
 lgFbHi:"Très bonne réponse : vous avez abordé presque tous les points clés.",lgFbMid:"Réponse suffisante : complétez avec les points manquants ci-dessous pour gagner des points.",lgFbLo:"Il manque plusieurs points clés : relisez-les ci-dessous et réessayez.",
 lgNote:"Correction automatique d'après les points clés du livre : si vous avez exprimé une idée avec des mots très différents, vérifiez vous-même dans la réponse modèle.",
 lgShort:"Réponse très courte : à l'examen, il faut des phrases complètes qui expliquent le pourquoi.",
 accountTxt:"Votre progression est enregistrée sur cet appareil, dans ce navigateur.",accountLocal:"Votre progression est enregistrée sur cet appareil, dans ce navigateur."});
Object.assign(T.en,{oGrade:"Mark",oGrading:"Marking…",trd_open:"Written answers marked against the textbook key points",
 oIntro:"Open questions like the Level 3 written paper, across every topic. Write your answer to each part: the app compares it with the textbook key points, gives a score per part, tells you what you got and what is missing, and shows the model answer.",
 mkS_openD:"4 questions from different chapters, marked at the end against the textbook key points.",mkNoAI:"not marked",
 sAIoff:"Compare your aromas with the expected profile below.",sNoAIb:"Note saved to your journal.",sModeBd:"Fill in the SAT while you taste: the note is saved to your journal.",
 sIntro:"Practise the Level 3 Systematic Approach to Tasting (SAT) with the official terms. Two modes: write the typical note for a classic wine (the app marks structure and conclusions and shows the expected profile), or record a note for a wine you are tasting. Notes stay in your journal.",
 sSaveOnly:"Save the note",pfKeys:"Model answer built from the textbook key points:",
 lgFbHi:"Excellent answer: you covered nearly all the key points.",lgFbMid:"A pass: add the missing points below to score higher.",lgFbLo:"Several key points are missing: read them below and try writing the answer again.",
 lgNote:"Automatic marking against the textbook key points: if you expressed an idea in very different words, check it yourself against the model answer.",
 lgShort:"Very short answer: the exam needs full sentences that explain why.",
 accountTxt:"Your progress is saved on this device, in this browser.",accountLocal:"Your progress is saved on this device, in this browser."});

/* ---- local marking ---- */
const LGSW=new Set(("il lo la i gli le un una uno di da del della dei delle degli dal dalla al alla ai alle agli nel nella nei nelle con per tra fra su sul sulla che chi cui non piu meno molto poco anche come quando dove perche e o ma se si ne ci essere sono era hanno ha ho puo possono viene vengono questo questa questi queste quello quella loro suo sua suoi sue piu " +
 "le la les un une des du de d l au aux en dans par pour sur sous avec sans que qui quoi dont ou et mais donc ni car ne pas plus moins tres peu aussi comme quand est sont etre avoir ont a peut peuvent ce cet cette ces leur leurs son sa ses se " +
 "the a an of to in on at by for from with without and or but not no more less very much many also as when where which who that this these those is are be been being was were has have had can may its their his her it they them than then into onto " +
 "vino vini vin vins wine wines uva uve raisin raisins grape grapes stile stili style styles esempio exemple example ecc etc").split(/\s+/));
function lgN(s){ return String(s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[’'`]/g," ").replace(/\u001F/g," "); }
function lgStem(w){ if(/\d/.test(w)) return w; return w.length>=6?w.slice(0,5):w; }
function lgToks(s){ return (lgN(s).match(/[a-z]+|\d+(?:[.,]\d+)?/g)||[]).filter(w=>(w.length>=3||/\d/.test(w))&&!LGSW.has(w)).map(lgStem); }
function lgPoints(txt){ return String(txt||"").split(/;|\n/).map(s=>s.trim().replace(/^[-•·\s]+/,"").replace(/[.\s]+$/,"")).filter(s=>s.length>2); }
function lgPointHit(pt,ansSet){ let k=[...new Set(lgToks(pt))]; if(!k.length) return false;
  if(k.length>7) k=k.sort((a,b)=>b.length-a.length).slice(0,7);
  const got=k.filter(x=>ansSet.has(x)).length, need=k.length<=1?1:k.length===2?2:Math.max(2,Math.ceil(k.length*0.5));
  return got>=need; }
function lgPart(p,ans){ const l=L(), langs=[l,...[0,1,2].filter(x=>x!==l)];
  const txt=p.f?oAnsText(p,ans,l):String(ans||""); const set=new Set(lgToks(txt));
  const base=lgPoints(oKey(p,l)); const alt=langs.slice(1).map(x=>lgPoints(oKey(p,x))).filter(a=>a.length===base.length);
  const hi=[], mi=[];
  base.forEach((pt,j)=>{ (lgPointHit(pt,set)||alt.some(a=>lgPointHit(a[j],set))?hi:mi).push(j); });
  const n=base.length||1, m=p.m; let sc=n<=m?hi.length*(m/n):Math.min(m,hi.length); sc=Math.max(0,Math.min(m,Math.round(sc*2)/2));
  if(!txt.trim()) sc=0;
  return {score:sc,max:m,hi,mi,words:(txt.trim().match(/\S+/g)||[]).length}; }
function lgModel(o,lg){ return o.parts.map((p,i)=>{ const pts=lgPoints(oKey(p,lg)).map(s=>s.charAt(0).toUpperCase()+s.slice(1)+".");
  return `**${oLetter(p,i)})** ${pts.join(" ")}`; }).join("\n\n"); }
function lgView(o,g){ const lg=L(); const pts=o.parts.map(p=>lgPoints(oKey(p,lg)));
  const s=g.parts.reduce((a,x)=>a+x.score,0), m=g.parts.reduce((a,x)=>a+x.max,0), pc=m?s/m:0;
  return {lang,local:1,model:lgModel(o,lg),feedback:(pc>=.75?t("lgFbHi"):pc>=.55?t("lgFbMid"):t("lgFbLo"))+" "+t("lgNote"),
    parts:g.parts.map((x,i)=>({score:x.score,max:x.max,hit:(x.hi||[]).map(j=>pts[i][j]).filter(Boolean),missed:(x.mi||[]).map(j=>pts[i][j]).filter(Boolean).slice(0,8),comment:x.words<8&&x.max>=2&&x.score<x.max?t("lgShort"):""}))}; }
function lgGrade(o,ans){ const parts=o.parts.map((p,i)=>lgPart(p,ans[i])); return lgView(o,{parts}); }

gradePrompt=function(o,ans){ return {__local:lgGrade(o,ans)}; };
aiJSON=async function(prompt){ if(prompt&&prompt.__local) return prompt.__local; throw {code:"not_granted"}; };
{ const _cg26=cleanGrade; cleanGrade=function(o,g){ if(g&&g.local){ g.parts.forEach((x,i)=>{ x.hi=x.hi||[]; }); return g; } return _cg26.apply(this,arguments); }; }
gradeOpen=async function(id){
  const o=OBY[id]; const ans=o.parts.map((p,i)=>((ODR[id]||[])[i]||"").trim());
  if(!ans.some(a=>a)){ oMsg=t("oEmpty"); render(); return; }
  const raw={parts:o.parts.map((p,i)=>lgPart(p,ans[i]))};
  const g=Object.assign(lgView(o,raw),{raw});
  const s=g.parts.reduce((a,x)=>a+x.score,0), m=omax(o), now=Date.now();
  (OA[id]=OA[id]||[]).push({ts:now,a:ans,g,s,m}); if(OA[id].length>8) OA[id]=OA[id].slice(-8);
  saveOA(id); delete ODR[id]; saveDraft(); oSel[id]=OA[id].length-1;
  P.s.push({t:now,m:"open",n:m,c:s,ch:[o.c]}); save(); oMsg="";
  if(oq===id&&view==="open") render(); };
/* a local marking is redrawn in the current language; an older marking is shown as it was written */
{ const _gv26=gradeView; gradeView=function(att,o){ try{ const g=att&&att.g; if(!g) return _gv26.apply(this,arguments);
    if(g.local){ const raw=g.raw||{parts:(g.parts||[]).map(x=>({score:x.score,max:x.max,hi:x.hi||[],mi:x.mi||[],words:99}))}; const v=lgView(o,raw); return _gv26.call(this,Object.assign({},att,{g:v}),o); }
    if(g.lang!==lang) return _gv26.call(this,Object.assign({},att,{g:Object.assign({},g,{lang})}),o);
  }catch(e){} return _gv26.apply(this,arguments); }; }
/* the mark button is always available; no "AI unavailable" notes */
{ const _ro26=renderOQ; renderOQ=function(){ let h=_ro26.apply(this,arguments); try{
    h=h.replace(/(id="o-grade")\s*disabled/,"$1").replace(`<p class="muted" style="font-size:.85rem;margin:0">${t("oOff")}</p>`,"");
  }catch(e){} return h; }; }
phBox=function(){ return ""; };
pfBox=function(o){ const id=o.id, open=!!PFOPEN[id];
  const body=open?`<div class="pfbody"><p class="muted small" style="margin:0 0 6px">${esc(t("pfKeys"))}</p><div class="pftx">${md(lgModel(o,L()))}</div></div>`:"";
  return `<div class="pfcard"><div class="pftop"><div><b>${esc(t("pfT"))}</b><div class="muted small">${esc(t("pfD"))}</div></div><button type="button" class="btn ${open?"ghost":"primary"}" data-pf="${id}">${esc(open?t("pfHide"):t("pfShow"))}</button></div>${body}</div>`; };
pfMake=function(){ render(); };
trGrade=async function(){};
/* tasting: no AI analysis button, no AI notes */
{ const _rse26=renderSatEd; renderSatEd=function(){ let h=_rse26.apply(this,arguments); try{
    h=h.replace(/<button class="btn primary" id="s-analyse"[^>]*>[^<]*<\/button>/,"").replace(`<p class="muted small" style="margin:0">${t("oOff")}</p>`,"")
     .replace('<button class="btn" id="s-saveonly">','<button class="btn primary" id="s-saveonly">');
  }catch(e){} return h; }; }
satAsk=async function(){ throw {code:"not_granted"}; };
try{ const st26=document.createElement("style"); st26.textContent=`.pdchat,.chat,.chat-t{display:none!important}`; document.head.appendChild(st26); }catch(e){}
/* notes: photos kept as pages, no AI reading */
Object.assign(T.it,{trd_notes:"Foto degli appunti · trascrizione delle lezioni",ntIntro:"Tutti i tuoi appunti in un posto solo: fotografa le pagine scritte a mano e ritrovale qui, con il tuo testo accanto, oppure lascia che l'app ascolti l'insegnante e trascriva la lezione mentre parla.",
 ntPhotoD:"Le pagine fotografate restano nei tuoi appunti, sul tuo dispositivo",ntPhotoIntro:"Scatta o scegli fino a {n} pagine: vengono salvate in un appunto su questo dispositivo, dove puoi aggiungere il tuo testo.",
 ntReadGo:"Salva le pagine",ntRead:"Salvataggio delle pagine…",ntFail:"Non sono riuscito a salvare le foto: riprova.",ntTxPh:"Scrivi qui il testo o un riassunto delle pagine (facoltativo)",ntRaw:"Testo"});
Object.assign(T.fr,{trd_notes:"Photos des notes · transcription des cours",ntIntro:"Toutes vos notes au même endroit : photographiez vos pages manuscrites et retrouvez-les ici, avec votre texte à côté, ou laissez l'application écouter l'enseignant et transcrire le cours pendant qu'il parle.",
 ntPhotoD:"Les pages photographiées restent dans vos notes, sur votre appareil",ntPhotoIntro:"Prenez ou choisissez jusqu'à {n} pages : elles sont enregistrées dans une note sur cet appareil, où vous pouvez ajouter votre texte.",
 ntReadGo:"Enregistrer les pages",ntRead:"Enregistrement des pages…",ntFail:"Impossible d'enregistrer les photos : réessayez.",ntTxPh:"Écrivez ici le texte ou un résumé des pages (facultatif)",ntRaw:"Texte"});
Object.assign(T.en,{trd_notes:"Photos of your notes · lesson transcription",ntIntro:"All your notes in one place: photograph your handwritten pages and find them here with your own text alongside, or let the app listen to your teacher and transcribe the lesson as they speak.",
 ntPhotoD:"Photographed pages stay in your notes, on your device",ntPhotoIntro:"Take or choose up to {n} pages: they are saved in a note on this device, where you can add your own text.",
 ntReadGo:"Save the pages",ntRead:"Saving your pages…",ntFail:"Couldn't save the photos: please try again.",ntTxPh:"Type the text or a summary of the pages here (optional)",ntRaw:"Text"});
