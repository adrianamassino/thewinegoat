/* ---------- v126: level test when the profile is created + longer study times + super-intensive training ---------- */
Object.assign(T.it,{obMin_60:"Molto intensa",obMin_90:"Full immersion",obMin_120:"Bootcamp",obIntT:"Training super intensivo",obIntD:"Poche settimane all'esame? 2–3 ore al giorno, una simulazione d'esame a settimana e ripasso mirato dei punti deboli.",
 asQ:"Facciamo un test di livello per capire da dove parti?",asP:"12 domande su tutto il programma, circa 5 minuti. Il piano partirà dai tuoi punti deboli.",asGo:"Inizia il test",asSkip:"Salta il test",
 asResT:"Ecco dove sei",asScore:"{c} risposte giuste su {n}",asLvl_b:"Livello base",asLvl_i:"Livello intermedio",asLvl_a:"Livello avanzato",
 asLvlP_b:"Partiamo dalle basi: il piano segue il programma capitolo per capitolo, con tanta pratica.",asLvlP_i:"Hai già buone basi: il piano insiste sugli argomenti dove hai sbagliato.",asLvlP_a:"Sei già a buon punto: più simulazioni d'esame e domande aperte, con ripasso mirato.",
 asWeak:"Da rinforzare",asStrong:"Punti forti",asRecInt:"Con il tempo che ti resta ti consigliamo il training super intensivo.",asIntOn:"Attiva il training intensivo",asSeePlan:"Vedi il mio piano",asAgain:"Rifai il test di livello",plT_mockI:"Simulazione d'esame completa"});
Object.assign(T.fr,{obMin_60:"Très intense",obMin_90:"Immersion totale",obMin_120:"Bootcamp",obIntT:"Entraînement super intensif",obIntD:"Peu de semaines avant l'examen ? 2 à 3 heures par jour, un examen blanc par semaine et une révision ciblée de vos points faibles.",
 asQ:"On fait un test de niveau pour savoir d'où vous partez ?",asP:"12 questions sur tout le programme, environ 5 minutes. Le plan commencera par vos points faibles.",asGo:"Commencer le test",asSkip:"Passer le test",
 asResT:"Voici où vous en êtes",asScore:"{c} bonnes réponses sur {n}",asLvl_b:"Niveau débutant",asLvl_i:"Niveau intermédiaire",asLvl_a:"Niveau avancé",
 asLvlP_b:"On part des bases : le plan suit le programme chapitre par chapitre, avec beaucoup de pratique.",asLvlP_i:"Vous avez déjà de bonnes bases : le plan insiste sur les sujets où vous vous êtes trompé.",asLvlP_a:"Vous êtes déjà bien avancé : plus d'examens blancs et de questions ouvertes, avec une révision ciblée.",
 asWeak:"À renforcer",asStrong:"Points forts",asRecInt:"Avec le temps qu'il vous reste, nous vous conseillons l'entraînement super intensif.",asIntOn:"Activer l'entraînement intensif",asSeePlan:"Voir mon plan",asAgain:"Refaire le test de niveau",plT_mockI:"Examen blanc complet"});
Object.assign(T.en,{obMin_60:"Very intense",obMin_90:"Full immersion",obMin_120:"Bootcamp",obIntT:"Super-intensive training",obIntD:"Only a few weeks to the exam? 2–3 hours a day, a full mock exam every week and targeted revision of your weak points.",
 asQ:"Shall we do a quick level test to see where you stand?",asP:"12 questions across the whole syllabus, about 5 minutes. Your plan will start from your weak points.",asGo:"Start the test",asSkip:"Skip the test",
 asResT:"Here's where you stand",asScore:"{c} correct out of {n}",asLvl_b:"Beginner level",asLvl_i:"Intermediate level",asLvl_a:"Advanced level",
 asLvlP_b:"We start from the basics: your plan follows the syllabus chapter by chapter, with plenty of practice.",asLvlP_i:"You already have good foundations: your plan focuses on the topics you got wrong.",asLvlP_a:"You're well on your way: more mock exams and written questions, with targeted revision.",
 asWeak:"To strengthen",asStrong:"Strong points",asRecInt:"With the time you have left, we recommend the super-intensive training.",asIntOn:"Switch on intensive training",asSeePlan:"See my plan",asAgain:"Retake the level test",plT_mockI:"Full mock exam"});
if(T.es) Object.assign(T.es,{obMin_60:"Muy intensa",obMin_90:"Inmersión total",obMin_120:"Bootcamp",obIntT:"Entrenamiento superintensivo",obIntD:"¿Pocas semanas para el examen? 2–3 horas al día, un simulacro completo por semana y repaso dirigido de tus puntos débiles.",
 asQ:"¿Hacemos un test de nivel para saber desde dónde partes?",asP:"12 preguntas de todo el temario, unos 5 minutos. El plan empezará por tus puntos débiles.",asGo:"Empezar el test",asSkip:"Saltar el test",
 asResT:"Aquí es donde estás",asScore:"{c} respuestas correctas de {n}",asLvl_b:"Nivel básico",asLvl_i:"Nivel intermedio",asLvl_a:"Nivel avanzado",
 asLvlP_b:"Empezamos por lo básico: el plan sigue el temario capítulo a capítulo, con mucha práctica.",asLvlP_i:"Ya tienes buenas bases: el plan insiste en los temas donde fallaste.",asLvlP_a:"Ya estás bastante avanzado: más simulacros y preguntas abiertas, con repaso dirigido.",
 asWeak:"Por reforzar",asStrong:"Puntos fuertes",asRecInt:"Con el tiempo que te queda, te recomendamos el entrenamiento superintensivo.",asIntOn:"Activar el entrenamiento intensivo",asSeePlan:"Ver mi plan",asAgain:"Repetir el test de nivel",plT_mockI:"Simulacro de examen completo"});

let ASCUR=null;
const asGroupName=g=>{ try{ return (g.n&&(g.n[lang]||g.n.en||g.n.it))||g.k; }catch(e){ return g.k; } };
function asPick(){ const chs=GROUPS.flatMap(g=>g.c).filter(c=>BANK.some(b=>b.c===c)); const ids=[], N=12;
  for(let i=0;i<N;i++){ const c=chs[Math.floor(i*chs.length/N)]; const pool=BANK.filter(b=>b.c===c&&!ids.includes(b.id)&&!b.h); const p=pool.length?pool:BANK.filter(b=>b.c===c&&!ids.includes(b.id));
    if(p.length) ids.push(p[Math.floor(Math.random()*p.length)].id); }
  return shuffle(ids); }
function asDaysLeft(){ if(!OB||OB.unk||!OB.exam) return 56; return Math.max(1,Math.round((new Date(OB.exam+"T12:00:00")-Date.now())/864e5)); }

/* study time: more than 60 minutes + super-intensive option */
{ const _rs37=renderStart; renderStart=function(){ if(!OB) obInit();
    if(OB.as===1&&!OB.asDone){ /* level-test intro */
      return `<section class="view obv"><div class="obbody"><div class="obhero">${gfree("n13",170)}<h1>${esc(t("asQ"))}</h1><p>${esc(t("asP"))}</p></div></div>
        <div class="obfoot"><button type="button" class="obgo" data-as="go">${esc(t("asGo"))}</button><button type="button" class="oblater" data-as="skip">${esc(t("asSkip"))}</button></div></section>`; }
    const h=_rs37.apply(this,arguments);
    if(OB.s!==3) return h;
    const card=(attr,on,ic,ti,ds)=>`<button type="button" class="obopt${on?" on":""}" ${attr} aria-pressed="${on}"><span class="obic">${ic}</span><span class="obtx"><b>${esc(ti)}</b>${ds?`<small>${esc(ds)}</small>`:""}</span></button>`;
    const list=`<div class="oblist">${[[10,"🌱"],[20,"🍇"],[30,"🍷"],[45,"🔥"],[60,"🚀"],[90,"🏋️"],[120,"🎯"]].map(([m,ic])=>card(`data-obmin="${m}"`,OB.min===m&&!OB.int,ic,(m>=60?(m/60).toString().replace(".",",")+" h":m+" "+t("plMin")),t("obMin_"+m))).join("")}
      ${card(`data-obmin="150" data-obint="1"`,!!OB.int,"⚡",t("obIntT")+" · 2–3 h",t("obIntD"))}</div>`;
    return h.replace(/<div class="oblist">[\s\S]*?<\/div>(?=<\/div><div class="obfoot">)/,list); }; }
/* the intensive flag travels with the plan */
{ const _od37=obDone; obDone=function(){ const r=_od37.apply(this,arguments); try{ if(PL){ PL.int=!!(OB&&OB.int); if(OB&&OB.asLvl) PL.lvl=OB.asLvl; lsSet(PLK,JSON.stringify(PL)); } }catch(e){} return r; }; }
{ const _pb37=plBuild; plBuild=function(){ const B=_pb37.apply(this,arguments);
    try{ if(PL&&PL.int&&B.days){ let k=0; B.days.forEach(d=>{ if(d.rest||!d.tasks||!d.tasks.length) return; k++;
        if(k%6===0&&!d.tasks.some(x=>x.id==="mock")) d.tasks.push({id:"mockI",ic:"⏱️",tx:t("plT_mockI"),act:"go:exam"});
        if(k%2===0&&!d.tasks.some(x=>x.id==="mix")) d.tasks.push({id:"mix",ic:"🔀",tx:t("plT_mix").replace("{n}",20),act:"mix"}); }); } }catch(e){}
    return B; }; }

/* clicks: run before the onboarding's own handler (window capture) */
window.addEventListener("click",e=>{
  const b=e.target.closest&&e.target.closest("[data-obmin],[data-ob],[data-as]"); if(!b) return;
  const d=b.dataset;
  if(d.obmin&&typeof view!=="undefined"&&view==="start"&&OB){ OB.int=!!d.obint; return; }
  if(d.ob==="next"&&view==="start"&&OB&&OB.s===5&&!OB.asDone&&!OB.as){ e.preventDefault(); e.stopPropagation(); OB.as=1; render(); window.scrollTo(0,0); return; }
  if(!d.as) return; e.preventDefault(); e.stopPropagation();
  if(d.as==="go"){ const ids=asPick(); if(!ids.length){ OB.asDone=true; OB.s=6; render(); return; } ASCUR={saved:false}; startQuiz(ids,"practice",[]); return; }
  if(d.as==="skip"){ OB.asDone=true; OB.s=6; render(); window.scrollTo(0,0); return; }
  if(d.as==="int"){ if(OB){ OB.int=true; OB.min=150; } b.closest(".asrec")&&b.closest(".asrec").classList.add("on"); b.disabled=true; return; }
  if(d.as==="plan"){ ASCUR=null; quiz=null; if(!OB) obInit(); OB.asDone=true; OB.s=6; view="start"; render(); window.scrollTo(0,0); return; }
  if(d.as==="again"){ OB=null; obInit(); OB.s=5; OB.as=1; go("start"); window.scrollTo(0,0); return; }
},true);

/* result of the level test */
{ const _rr37=renderResult; renderResult=function(){ if(!ASCUR||!quiz||!quiz.done) return _rr37.apply(this,arguments);
    const items=quiz.items.filter(x=>x.pick!==null), n=items.length, c=items.filter(x=>x.pick===0).length, s=n?c/n:0;
    const lvl=s<.4?"b":s<.7?"i":"a"; if(OB){ OB.asLvl=lvl; }
    const by={}; items.forEach(x=>{ const b=BANK.find(q=>q.id===x.id); if(!b) return; const g=GROUPS.find(G=>G.c.includes(b.c)); if(!g) return; const k=g.k; by[k]=by[k]||{g,n:0,c:0}; by[k].n++; if(x.pick===0) by[k].c++; });
    const rows=Object.values(by).sort((a,b)=>a.c/a.n-b.c/b.n);
    const bar=r=>`<li class="asrow"><span>${esc(asGroupName(r.g))}</span><i><b style="width:${Math.round(r.c/r.n*100)}%"></b></i><em>${r.c}/${r.n}</em></li>`;
    const needInt=(asDaysLeft()<=42)&&!(OB&&OB.int);
    return `<section class="view asres"><div class="asgo">${gfree(lvl==="a"?"dance":lvl==="i"?"n04":"n13",140)}</div>
      <p class="aslvlk">${esc(t("asResT"))}</p><h1>${esc(t("asLvl_"+lvl))}</h1><p class="asscore">${esc(t("asScore").replace("{c}",c).replace("{n}",n))}</p>
      <p class="aslvlp">${esc(t("asLvlP_"+lvl))}</p>
      <ul class="asrows">${rows.map(bar).join("")}</ul>
      ${needInt?`<div class="asrec"><p>⚡ ${esc(t("asRecInt"))}</p><button type="button" class="oblater" data-as="int">${esc(t("asIntOn"))}</button></div>`:""}
      <button type="button" class="obgo" data-as="plan">${esc(t("asSeePlan"))}</button><button type="button" id="r-again" hidden></button><button type="button" id="r-back" hidden></button></section>`; }; }

/* profile: retake the level test */
{ const _rp37=renderProfile; renderProfile=function(){ const h=_rp37.apply(this,arguments);
    try{ const btn=`<button type="button" class="btn asagain" data-as="again">🎯 ${esc(t("asAgain"))}</button>`; const i=h.lastIndexOf("</section>"); return i>0?h.slice(0,i)+btn+h.slice(i):h+btn; }catch(e){ return h; } }; }

try{ const st37=document.createElement("style"); st37.textContent=`
.asres{max-width:560px;margin:0 auto;padding:10px 4px 30px;text-align:center}
.asres .asgo{display:flex;justify-content:center}
.aslvlk{margin:6px 0 0;font-weight:800;letter-spacing:.06em;text-transform:uppercase;font-size:.8rem;color:var(--muted,#8a7a80)}
.asres h1{margin:4px 0 2px}
.asscore{margin:0 0 10px;font-weight:800;color:var(--wine,#8c1d40)}
.aslvlp{margin:0 auto 16px;max-width:460px}
.asrows{list-style:none;padding:0;margin:0 0 16px;display:grid;gap:10px;text-align:left}
.asrow{display:grid;grid-template-columns:1fr 110px 40px;gap:10px;align-items:center;font-weight:700;font-size:.95rem}
.asrow i{height:10px;border-radius:6px;background:var(--sunk,#f1e7df);overflow:hidden}
.asrow i b{display:block;height:100%;border-radius:6px;background:linear-gradient(90deg,#b8892e,#5f7a3c)}
.asrow em{font-style:normal;text-align:right;color:var(--muted,#8a7a80)}
.asrec{border-radius:16px;padding:12px 14px;margin:0 0 14px;background:var(--wine-s,#f6ecee);text-align:left}
.asrec p{margin:0 0 10px;font-weight:700}.asrec.on{box-shadow:inset 0 0 0 2px #5f7a3c}
.asrec .oblater{width:100%}
.asres .obgo{width:100%}
.asagain{margin:14px auto 0;display:block}
@media (max-width:420px){.asrow{grid-template-columns:1fr 80px 34px;font-size:.88rem}}
`; document.head.appendChild(st37); }catch(e){}
