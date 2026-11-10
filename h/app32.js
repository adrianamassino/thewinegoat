/* ---------- v120: «A lezione» — its own tab, put forward and explained: record what the teacher says (live transcription)
   and photograph your notes. Removed from Ripasso/Home where it was unclear. Footer without exam/book names. ---------- */
Object.assign(T.it,{tab_school:"Lezione",scKick:"Solo su The Wine Goat",scTitle:"A lezione",scIntro:"Segui un corso? Porta il telefono in aula. The Wine Goat è l'unica app per il vino che ascolta l'insegnante e scrive gli appunti per te, e conserva le foto delle tue pagine. Tutto resta nell'app, accanto ai quiz e al tuo piano.",
 scRecT:"Registra la lezione",scRecP:"Appoggia il telefono sul banco e premi Avvia: mentre l'insegnante parla, l'app trasforma le sue parole in testo. Puoi mettere in pausa, aggiungere le tue note e salvare.",scRecS:["All'inizio della lezione apri «Registra la lezione»","Appoggia il telefono vicino all'insegnante e premi Avvia","Alla fine premi Salva: il testo completo ti aspetta nei tuoi appunti"],scRecTip:"Serve la connessione internet e il permesso di usare il microfono. Funziona in Chrome e Safari.",scRecB:"Registra la lezione",
 scPhT:"Fotografa gli appunti",scPhP:"Fotografa le pagine del quaderno, la lavagna o le slide: le foto restano ordinate nell'app, sempre con te, da ingrandire quando ripassi.",scPhS:["Tocca «Fotografa gli appunti»","Scatta o scegli fino a 8 foto","Dai un titolo: le ritrovi in «I miei appunti»"],scPhB:"Fotografa gli appunti",
 scMine:"I miei appunti",scMineN:"{n} appunti salvati",scMine0:"Ancora nessun appunto",scOpen:"Apri",scWhy:"Perché ti serve",scWhyL:["Non perdi niente di quello che dice l'insegnante","Ripassi le parole del corso insieme ai quiz","Tutto in un posto: niente quaderni dimenticati a casa"],scHome:"A lezione? Registra quello che dice l'insegnante",scHomeP:"L'unica app che trascrive la lezione e conserva le foto dei tuoi appunti.",scSteps:"Come funziona",scFoot:"The Wine Goat · il tuo coach per l'esame"});
Object.assign(T.fr,{tab_school:"En cours",scKick:"Uniquement sur The Wine Goat",scTitle:"En cours",scIntro:"Vous suivez un cours ? Apportez votre téléphone. The Wine Goat est la seule appli du vin qui écoute l'enseignant et prend les notes pour vous, et qui garde les photos de vos pages. Tout reste dans l'appli, à côté des QCM et de votre plan.",
 scRecT:"Enregistrer le cours",scRecP:"Posez le téléphone sur la table et appuyez sur Démarrer : pendant que l'enseignant parle, l'appli transforme ses paroles en texte. Vous pouvez faire pause, ajouter vos notes et enregistrer.",scRecS:["Au début du cours, ouvrez « Enregistrer le cours »","Posez le téléphone près de l'enseignant et appuyez sur Démarrer","À la fin, appuyez sur Enregistrer : le texte complet vous attend dans vos notes"],scRecTip:"Il faut une connexion internet et l'autorisation du micro. Fonctionne dans Chrome et Safari.",scRecB:"Enregistrer le cours",
 scPhT:"Photographier ses notes",scPhP:"Photographiez les pages du cahier, le tableau ou les diapos : les photos restent rangées dans l'appli, toujours avec vous, à agrandir pendant les révisions.",scPhS:["Touchez « Photographier mes notes »","Prenez ou choisissez jusqu'à 8 photos","Donnez un titre : vous les retrouvez dans « Mes notes »"],scPhB:"Photographier mes notes",
 scMine:"Mes notes",scMineN:"{n} notes enregistrées",scMine0:"Pas encore de notes",scOpen:"Ouvrir",scWhy:"Pourquoi c'est utile",scWhyL:["Vous ne perdez rien de ce que dit l'enseignant","Vous révisez les mots du cours avec les QCM","Tout au même endroit : plus de cahier oublié"],scHome:"En cours ? Enregistrez ce que dit l'enseignant",scHomeP:"La seule appli qui transcrit le cours et garde les photos de vos notes.",scSteps:"Comment ça marche",scFoot:"The Wine Goat · votre coach pour l'examen"});
Object.assign(T.en,{tab_school:"Class",scKick:"Only on The Wine Goat",scTitle:"In class",scIntro:"Taking a course? Bring your phone to class. The Wine Goat is the only wine app that listens to your teacher and writes the notes for you, and keeps photos of your pages. Everything stays in the app, next to your quizzes and your plan.",
 scRecT:"Record the lesson",scRecP:"Put your phone on the desk and press Start: while the teacher talks, the app turns their words into text. You can pause, add your own notes and save.",scRecS:["At the start of class, open “Record the lesson”","Put the phone near the teacher and press Start","At the end press Save: the full text is waiting in your notes"],scRecTip:"Needs an internet connection and microphone permission. Works in Chrome and Safari.",scRecB:"Record the lesson",
 scPhT:"Photograph your notes",scPhP:"Snap your notebook pages, the whiteboard or the slides: the photos stay organised in the app, always with you, ready to zoom in when you revise.",scPhS:["Tap “Photograph my notes”","Take or pick up to 8 photos","Add a title: find them in “My notes”"],scPhB:"Photograph my notes",
 scMine:"My notes",scMineN:"{n} notes saved",scMine0:"No notes yet",scOpen:"Open",scWhy:"Why it helps",scWhyL:["You miss nothing the teacher says","You revise the course words alongside the quizzes","Everything in one place: no more forgotten notebooks"],scHome:"In class? Record what the teacher says",scHomeP:"The only app that transcribes the lesson and keeps photos of your notes.",scSteps:"How it works",scFoot:"The Wine Goat · your exam coach"});
function renderSchool(){ const n=NOTES.length;
  const steps=a=>`<ol class="scst">${a.map((x,i)=>`<li><span>${i+1}</span>${esc(x)}</li>`).join("")}</ol>`;
  return `<section class="view scv">
   <header class="hubban ban-wine"><div class="hb-tx"><small>${esc(t("scKick"))}</small><h1>🎓 ${esc(t("scTitle"))}</h1><p>${esc(t("scIntro"))}</p></div><div class="hb-goat">${gfree("n13",132)}</div></header>
   <article class="sccard screc"><div class="schd"><span class="scic">🎙️</span><h2>${esc(t("scRecT"))}</h2></div><p>${esc(t("scRecP"))}</p><h3>${esc(t("scSteps"))}</h3>${steps(t("scRecS"))}<p class="sctip">ℹ️ ${esc(t("scRecTip"))}</p>
    <button type="button" class="scgo" data-ntgo="lesson"><i class="ntb-dot"></i> ${esc(t("scRecB"))} ▸</button></article>
   <article class="sccard scph"><div class="schd"><span class="scic">📷</span><h2>${esc(t("scPhT"))}</h2></div><p>${esc(t("scPhP"))}</p><h3>${esc(t("scSteps"))}</h3>${steps(t("scPhS"))}
    <button type="button" class="scgo" data-ntgo="photo">📷 ${esc(t("scPhB"))} ▸</button></article>
   <button type="button" class="scmine" data-ntgo="list"><span class="scic">📝</span><span><b>${esc(t("scMine"))}</b><small>${esc(n?t("scMineN").replace("{n}",n):t("scMine0"))}</small></span><i>${esc(t("scOpen"))} ▸</i></button>
   <div class="scwhy"><h3>${esc(t("scWhy"))}</h3><ul>${t("scWhyL").map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div></section>`; }
try{ TABS.push("school"); TABG.school="school"; TABG.notes="school"; SUBV.notes="school"; }catch(e){}
/* bottom tab */
(function(){ try{ const w=document.getElementById("tab-wine"); if(!w||document.getElementById("tab-school")) return;
  const b=document.createElement("button"); b.setAttribute("role","tab"); b.id="tab-school"; b.dataset.v="school";
  b.innerHTML=`<i class="ti" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 16 6l13 6-13 6z"/><path d="M8 14.5v6c0 2 3.6 4 8 4s8-2 8-4v-6"/><path d="M29 12v8"/></svg></i><span class="tl"></span>`;
  w.parentNode.insertBefore(b,w.nextSibling);
  b.addEventListener("click",e=>{ e.preventDefault(); e.stopPropagation(); quiz=null; go("school"); window.scrollTo(0,0); },true); }catch(e){} })();
/* remove the unclear note panels from Ripasso and Home; Home gets one clear invitation instead */
{ const _rw32=renderWine; renderWine=function(){ let h=_rw32.apply(this,arguments); return h.replace(/<h2 class="rvsec">[^<]*<\/h2><div class="ntpanel compact">[\s\S]*?<\/button><\/div>/,""); }; }
{ const _rh32=renderHome; renderHome=function(){ let h=_rh32.apply(this,arguments);
    h=h.replace(/<h2 class="hsec">[^<]*<\/h2><div class="ntpanel compact">[\s\S]*?<\/button><\/div>/,"");
    const card=`<button type="button" class="schome" data-go="school"><span class="scic">🎓</span><span><b>${esc(t("scHome"))}</b><small>${esc(t("scHomeP"))}</small></span><i>▸</i></button>`;
    return h.replace(/(<button type="button" class="hero2")/,card+"$1"); }; }
/* the footer line: no exam or book names inside the app */
setFoot=function(){ const f=document.getElementById("gfoot"); if(!f) return; const pool=["logo",...GK.filter(k=>!GOATS[k].l&&!GOATS[k].r)]; const k=pool[Math.floor(Math.random()*pool.length)]; f.innerHTML=`${gfree(k,k==="logo"?96:110)}<span>${esc(t("scFoot"))}</span>`; };
try{ const st32=document.createElement("style"); st32.textContent=`
.scv{max-width:760px;margin:0 auto}
.sccard{position:relative;border-radius:24px;padding:20px;margin:0 0 16px;background:var(--surface,#fff);border:2px solid var(--line,#eadfd4);border-bottom-width:5px}
.sccard.screc{border-color:#e7b9c8}.sccard.scph{border-color:#b6dad6}
.schd{display:flex;align-items:center;gap:12px}.schd h2{margin:0;font-size:1.35rem}
.scic{display:inline-grid;place-items:center;flex:none;width:52px;height:52px;border-radius:16px;font-size:1.6rem;background:#fbe9ee}
.sccard.scph .scic{background:#e3f2f0}
.sccard p{margin:12px 0}.sccard h3{margin:14px 0 8px;font-size:1rem;text-transform:uppercase;letter-spacing:.06em;color:var(--muted,#7b6a5c)}
.scst{list-style:none;padding:0;margin:0;display:grid;gap:8px}.scst li{display:flex;gap:10px;align-items:flex-start;font-weight:600}
.scst span{flex:none;display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:#8c1d40;color:#fff;font-weight:900;font-size:.85rem}
.sccard.scph .scst span{background:#1f6f6b}
.sctip{font-size:.85rem;color:var(--muted,#7b6a5c);background:var(--sunk,#f6efe6);border-radius:12px;padding:8px 12px}
.scgo{font:inherit;font-weight:900;display:flex;align-items:center;justify-content:center;gap:8px;width:100%;min-height:56px;margin-top:14px;border:0;border-radius:16px;color:#fff;cursor:pointer;
  background:linear-gradient(135deg,#7a1230,#c2185b);box-shadow:0 5px 0 #4f0f25}
.sccard.scph .scgo{background:linear-gradient(135deg,#123a3a,#1f6f6b);box-shadow:0 5px 0 #0b2a28}
.scgo:active{transform:translateY(3px);box-shadow:none}
.scmine,.schome{font:inherit;display:flex;align-items:center;gap:14px;width:100%;text-align:left;padding:14px 16px;border-radius:20px;border:2px solid var(--line,#eadfd4);background:var(--surface,#fff);color:inherit;cursor:pointer;margin:0 0 16px}
.scmine>span:nth-child(2),.schome>span:nth-child(2){flex:1;display:flex;flex-direction:column}.scmine small,.schome small{color:var(--muted,#7b6a5c)}.scmine i,.schome i{font-style:normal;font-weight:900;color:var(--wine,#8c1d40)}
.schome{border-color:#e7b9c8;background:linear-gradient(135deg,#fff,#fdf0f4)}
.scwhy{border-radius:20px;padding:16px 18px;background:var(--sunk,#f6efe6)}.scwhy h3{margin:0 0 8px}.scwhy ul{margin:0;padding-left:20px}.scwhy li{margin:4px 0}
nav.tabs{flex-wrap:nowrap!important;grid-template-columns:repeat(6,1fr)!important}nav.tabs button .ti{width:26px!important;height:26px!important}nav.tabs button{flex:1 1 0!important;min-width:0!important;padding-left:2px!important;padding-right:2px!important}nav.tabs .tl{font-size:.62rem!important;letter-spacing:.02em!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
`; document.head.appendChild(st32); }catch(e){}
