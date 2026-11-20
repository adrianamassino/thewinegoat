/* The Wine Goat — Diploma (Level 4) mode. Loaded only when localStorage "twg-level" is "4", after the unit content
   files (l4/d1/content.js, l4/d2/content.js… each registers itself in window.TWG_D4) and before the main script.
   The units are merged into one level object (window.TWG_D4C) that the main script uses like the Level 1/2 content:
   BANK / CH / GROUPS are swapped, so quizzes, mistakes, games and progress work unchanged. This file adds the Diploma
   hub (one unit at a time: D1, D2… later D3–D6 slot in by adding l4/dN/content.js), the lessons reader, flashcards,
   the written (open-response) questions with local marking against key points and a model answer, essay prompts,
   timed practice papers and the study-time estimate.
   Content arrays are [it, fr, en, es]: the app reads index 0–2 and Spanish comes from the 4th element through the
   English→Spanish map (TWG_ESX), like the other levels; open-question key points are read in Spanish directly. */
(function () {
  const D = window.TWG_D4; if (!D) return;
  const ORDER = ["D1", "D2", "D3", "D4", "D5", "D6"], UNITS = ORDER.filter(u => D[u]);
  if (!UNITS.length) return;
  /* ---------- merge the units into one level object ---------- */
  const C = { level: 4, track: "diploma", exam: { questions: 0, minutes: 0, pass: 55, written: true, tasting: false }, ch: {}, groups: [], bank: [], lessons: [], flash: [], open: [], units: {} };
  UNITS.forEach(u => { const x = D[u];
    Object.assign(C.ch, x.ch || {});
    C.groups.push({ k: u, w: 0, n: x.name, c: Object.keys(x.ch || {}) });
    (x.bank || []).forEach(b => C.bank.push(b)); (x.lessons || []).forEach(l => C.lessons.push(Object.assign({ u }, l)));
    (x.flash || []).forEach(f => C.flash.push(f)); (x.open || []).forEach(o => C.open.push(Object.assign({ u }, o)));
    C.units[u] = { name: x.name, exam: x.exam || {}, hours: x.hours || 0, w: x.w || 0, ch: Object.keys(x.ch || {}) }; });
  window.TWG_D4C = C;
  const chUnit = {}; C.groups.forEach(g => g.c.forEach(c => chUnit[c] = g.k));

  /* ---------- Spanish: English → Spanish from the 4th element of every content array ---------- */
  const X = window.TWG_ESX || (window.TWG_ESX = { es: {}, ar: {} });
  (function walk(o) {
    if (Array.isArray(o)) { if (o.length === 4 && o.every(s => typeof s === "string")) { if (o[2] && o[3]) X.es[o[2]] = o[3]; return; } o.forEach(walk); return; }
    if (o && typeof o === "object") { if (typeof o.en === "string" && typeof o.es === "string") { X.es[o.en] = o.es; return; } Object.keys(o).forEach(k => walk(o[k])); } })(C);

  /* ---------- texts ---------- */
  const U = {
    it: { tab_study: "Diploma", oKeys: "Guida di correzione (punti chiave)", l2RevK: "Ripasso", l2Err: "I miei errori", l2ErrD: "Le domande sbagliate tornano finché non le sai", l2PlayK: "Pausa ricreativa", l2Surv: "Sopravvivenza", l2SurvD: "3 cuori, 20 secondi a domanda", l2Match: "Abbina!", l2MatchD: "Collega ogni termine alla sua spiegazione", l2Lamp: "Quiz lampo", l2LampD: "10 domande a caso dall'unità", l2Again: "Nuova partita", l2Bravo: "Bravo! Tutte abbinate", l2Time: "Tempo rimasto",
      d4Kick: "Diploma · preparazione", d4Title: "Diploma", d4Intro: "Lezioni approfondite, quiz di ripasso, domande a risposta aperta corrette e simulazioni a tempo, unità per unità.",
      d4Unit: "Unità", d4Paper: "Simulazione d'esame", d4PaperD: "{q} domande aperte in {m} minuti · soglia 55%", d4Les: "Lezioni", d4LesD: "Il programma dell'unità, risultato per risultato",
      d4Quiz: "Quiz di ripasso", d4QuizD: "Domande a scelta multipla con spiegazione", d4Open: "Risposte scritte", d4OpenD: "{n} domande in stile esame, con correzione e risposta modello",
      d4Ess: "Saggi e casi", d4EssD: "{n} tracce lunghe con schema e criteri di valutazione", d4Fl: "Flashcard", d4FlD: "Termini, cifre e concetti chiave",
      d4Sec: "Allenamento", d4Rule: "La regola: completa tutte le domande aperte finché ognuna è almeno sufficiente (55%).", d4Suff: "sufficienti", d4NextO: "Prossima domanda da portare al 55%",
      d4AllOk: "Tutte le domande aperte sono almeno sufficienti: ottimo! Ora alza i punteggi più bassi e fai le simulazioni.",
      d4Keys: "Da ricordare", d4QCh: "Quiz sul capitolo", d4OCh: "Domande aperte del capitolo", d4Prev: "Precedente", d4Next: "Successiva", d4Back: "Tutte le lezioni", d4All: "Tutti i capitoli",
      d4Flip: "Tocca la carta per girarla", d4Shuf: "Mescola", d4Of: "di",
      d4OTitle: "Risposte scritte · {u}", d4OIntro: "Domande a risposta aperta come all'esame: spiega cause ed effetti, confronta, valuta. Scrivi, poi correggi: l'app confronta la risposta con i punti chiave, dà un punteggio per parte e mostra una risposta modello.",
      d4FAll: "Tutte", d4FTodo: "Da fare", d4FLow: "Sotto il 55%", d4FOk: "Sufficienti", d4FEss: "Saggi e casi", d4StNew: "da fare", d4StLow: "sotto il 55%", d4StOk: "sufficiente",
      d4EssTag: "Saggio", d4Min: "{m} min consigliati", d4Guide: "Schema consigliato e criteri", d4Crit: "Cosa viene premiato",
      d4PStart: "Inizia la simulazione", d4PIntro: "Formato di allenamento: {q} domande aperte da capitoli diversi, {m} minuti. Rispondi come all'esame, poi consegna: ogni risposta viene corretta e conta per la regola del 55%.",
      d4PSubmit: "Consegna", d4PSure: "Consegnare ora? Le parti vuote valgono 0.", d4PRes: "Risultato della simulazione", d4PAgain: "Nuova simulazione", d4PReview: "Rivedi la domanda",
      d4PBand0: "Non ancora sufficiente (sotto il 55%)", d4PBand1: "Pass (55–64%)", d4PBand2: "Pass with Merit (65–74%)", d4PBand3: "Pass with Distinction (75% e oltre)", d4PEmpty: "Non hai scritto niente: niente da correggere.",
      d4Time: "Tempo di studio", d4TimeI: "Il tempo consigliato per tutto il Diploma è di 500 ore (lezioni guidate + studio personale). Lo dividiamo secondo il peso di ogni unità e aggiungiamo un ampio margine di sicurezza: meglio abbondare ed essere pronti.",
      d4TRec: "Tempo consigliato per {u}: circa {h} h ({w}% del Diploma).", d4TGoal: "Obiettivo", d4TMode: "Come studi", d4TSelf: "Solo con l'app", d4TCourse: "Corso + app",
      d4TH: "≈ {h} ore di studio in totale: {wk} settimane a {d} h al giorno, 6 giorni su 7.", d4TPace: "Ore al giorno", d4TNote: "Stima prudente, non una promessa: dipende dal tuo ritmo e dal tuo corso. Con un corso, le sue ore guidate si aggiungono secondo il suo calendario.",
      d4TOrder: "D1 e D2 si studiano per prime; l'esame D1 si sostiene per primo.", d4Ex: "Esame {u}: {f}", d4ExD1: "prova scritta a risposta aperta, 90 minuti", d4ExD2: "prova scritta a risposta aperta, 60 minuti",
      plT_les: "Lezioni: {c}", plT_d4o: "Risposta scritta: {c}", plT_d4p: "Simulazione a tempo · {u}", plT_d4e: "Saggio o caso: {c}",
      obHi: "Ciao! Sono la tua capra del Diploma 🍷", obHiP: "Ti preparo un percorso su misura per l'unità {u}. Bastano 5 domande veloci.", obW4: "Tra 3 mesi", obW8: "Tra 6 mesi", obW12: "Tra 9 mesi",
      obGoal_passD: "Almeno il 55%: il minimo, senza stress", obGoal_meritD: "Dal 65%: un risultato solido", obGoal_distD: "Dal 75%: il massimo",
      plG_merit: "Pass with Merit", plG_dist: "Pass with Distinction", plGoalD: "Pass dal 55%, Pass with Merit dal 65%, Pass with Distinction dal 75%: più alto è l'obiettivo, più lavoro al giorno.",
      oIntro: "Domande a risposta aperta come all'esame. Scrivi la risposta per ogni parte: l'app la confronta con i punti chiave, dà un punteggio per parte, ti dice cosa hai centrato e cosa manca e mostra la risposta modello.",
      lgNote: "Correzione automatica in base ai punti chiave: se hai espresso un concetto con parole molto diverse, controllalo tu nella risposta modello.", pfKeys: "Risposta modello:",
      lgShort: "Risposta molto breve: all'esame servono frasi complete che spieghino cause ed effetti.",
      wlOP: "Le hai provate: sono quelle che fanno la differenza all'esame. Sblocca tutte le domande aperte del Diploma con correzione.", wlList: "Tutte le domande del Diploma · risposte scritte corrette · simulazioni a tempo · flashcard" },
    fr: { tab_study: "Diploma", oKeys: "Grille de correction (points clés)", l2RevK: "Révision", l2Err: "Mes erreurs", l2ErrD: "Les questions ratées reviennent jusqu'à ce que vous les sachiez", l2PlayK: "Pause récré", l2Surv: "Survie", l2SurvD: "3 cœurs, 20 secondes par question", l2Match: "Associez !", l2MatchD: "Reliez chaque terme à son explication", l2Lamp: "Quiz éclair", l2LampD: "10 questions au hasard sur l'unité", l2Again: "Nouvelle partie", l2Bravo: "Bravo ! Tout est associé", l2Time: "Temps restant",
      d4Kick: "Diploma · préparation", d4Title: "Diploma", d4Intro: "Leçons approfondies, quiz de révision, questions ouvertes corrigées et épreuves blanches chronométrées, unité par unité.",
      d4Unit: "Unité", d4Paper: "Épreuve blanche", d4PaperD: "{q} questions ouvertes en {m} minutes · seuil 55 %", d4Les: "Leçons", d4LesD: "Le programme de l'unité, objectif par objectif",
      d4Quiz: "Quiz de révision", d4QuizD: "QCM avec explications", d4Open: "Réponses rédigées", d4OpenD: "{n} questions de type examen, corrigées, avec réponse modèle",
      d4Ess: "Dissertations et cas", d4EssD: "{n} sujets longs avec plan et critères d'évaluation", d4Fl: "Flashcards", d4FlD: "Termes, chiffres et notions clés",
      d4Sec: "Entraînement", d4Rule: "La règle : faites toutes les questions ouvertes jusqu'à ce que chacune soit au moins suffisante (55 %).", d4Suff: "suffisantes", d4NextO: "Prochaine question à amener à 55 %",
      d4AllOk: "Toutes les questions ouvertes sont au moins suffisantes : bravo ! Remontez maintenant les notes les plus basses et faites les épreuves blanches.",
      d4Keys: "À retenir", d4QCh: "Quiz sur le chapitre", d4OCh: "Questions ouvertes du chapitre", d4Prev: "Précédente", d4Next: "Suivante", d4Back: "Toutes les leçons", d4All: "Tous les chapitres",
      d4Flip: "Touchez la carte pour la retourner", d4Shuf: "Mélanger", d4Of: "sur",
      d4OTitle: "Réponses rédigées · {u}", d4OIntro: "Des questions ouvertes comme à l'examen : expliquer causes et effets, comparer, évaluer. Rédigez, puis corrigez : l'application compare la réponse aux points clés, note chaque partie et montre une réponse modèle.",
      d4FAll: "Toutes", d4FTodo: "À faire", d4FLow: "Sous 55 %", d4FOk: "Suffisantes", d4FEss: "Dissertations et cas", d4StNew: "à faire", d4StLow: "sous 55 %", d4StOk: "suffisante",
      d4EssTag: "Dissertation", d4Min: "{m} min conseillées", d4Guide: "Plan conseillé et critères", d4Crit: "Ce qui rapporte des points",
      d4PStart: "Commencer l'épreuve", d4PIntro: "Format d'entraînement : {q} questions ouvertes de chapitres différents, {m} minutes. Répondez comme à l'examen, puis rendez la copie : chaque réponse est corrigée et compte pour la règle des 55 %.",
      d4PSubmit: "Rendre la copie", d4PSure: "Rendre maintenant ? Les parties vides valent 0.", d4PRes: "Résultat de l'épreuve blanche", d4PAgain: "Nouvelle épreuve", d4PReview: "Revoir la question",
      d4PBand0: "Pas encore suffisant (moins de 55 %)", d4PBand1: "Pass (55–64 %)", d4PBand2: "Pass with Merit (65–74 %)", d4PBand3: "Pass with Distinction (75 % et plus)", d4PEmpty: "Vous n'avez rien écrit : rien à corriger.",
      d4Time: "Temps d'étude", d4TimeI: "Le temps conseillé pour tout le Diploma est de 500 heures (cours guidés + travail personnel). Nous le répartissons selon le poids de chaque unité et ajoutons une large marge de sécurité : mieux vaut prévoir large et être prêt.",
      d4TRec: "Temps conseillé pour {u} : environ {h} h ({w} % du Diploma).", d4TGoal: "Objectif", d4TMode: "Votre façon d'étudier", d4TSelf: "Avec l'app seule", d4TCourse: "Cours + app",
      d4TH: "≈ {h} heures d'étude au total : {wk} semaines à {d} h par jour, 6 jours sur 7.", d4TPace: "Heures par jour", d4TNote: "Estimation prudente, pas une promesse : elle dépend de votre rythme et de votre cours. Avec un cours, ses heures guidées s'ajoutent selon son calendrier.",
      d4TOrder: "D1 et D2 s'étudient en premier ; l'examen D1 se passe en premier.", d4Ex: "Examen {u} : {f}", d4ExD1: "épreuve écrite à réponses ouvertes, 90 minutes", d4ExD2: "épreuve écrite à réponses ouvertes, 60 minutes",
      plT_les: "Leçons : {c}", plT_d4o: "Réponse rédigée : {c}", plT_d4p: "Épreuve blanche chronométrée · {u}", plT_d4e: "Dissertation ou cas : {c}",
      obHi: "Bonjour ! Je suis votre chèvre du Diploma 🍷", obHiP: "Je vous prépare un parcours sur mesure pour l'unité {u}. Il suffit de 5 questions rapides.", obW4: "Dans 3 mois", obW8: "Dans 6 mois", obW12: "Dans 9 mois",
      obGoal_passD: "Au moins 55 % : le minimum, sans stress", obGoal_meritD: "Dès 65 % : un résultat solide", obGoal_distD: "Dès 75 % : le sommet",
      plG_merit: "Pass with Merit", plG_dist: "Pass with Distinction", plGoalD: "Pass dès 55 %, Pass with Merit dès 65 %, Pass with Distinction dès 75 % : plus l'objectif est élevé, plus il y a de travail par jour.",
      oIntro: "Des questions ouvertes comme à l'examen. Rédigez la réponse à chaque partie : l'application la compare aux points clés, note chaque partie, indique ce que vous avez trouvé et ce qui manque, et montre la réponse modèle.",
      lgNote: "Correction automatique d'après les points clés : si vous avez exprimé une idée avec des mots très différents, vérifiez-la vous-même dans la réponse modèle.", pfKeys: "Réponse modèle :",
      lgShort: "Réponse très courte : à l'examen, il faut des phrases complètes qui expliquent causes et effets.",
      wlOP: "Vous les avez essayées : ce sont elles qui font la différence à l'examen. Débloquez toutes les questions ouvertes du Diploma, corrigées.", wlList: "Toutes les questions du Diploma · réponses rédigées corrigées · épreuves blanches chronométrées · flashcards" },
    en: { tab_study: "Diploma", oKeys: "Marking guide (key points)", l2RevK: "Review", l2Err: "My mistakes", l2ErrD: "Wrong answers come back until you know them", l2PlayK: "Break time", l2Surv: "Survival", l2SurvD: "3 hearts, 20 seconds per question", l2Match: "Match it!", l2MatchD: "Link each term to its explanation", l2Lamp: "Lightning quiz", l2LampD: "10 random questions from the unit", l2Again: "New game", l2Bravo: "Well done! All matched", l2Time: "Time left",
      d4Kick: "Diploma · exam preparation", d4Title: "Diploma", d4Intro: "In-depth lessons, revision quizzes, marked open-response questions and timed practice papers, unit by unit.",
      d4Unit: "Unit", d4Paper: "Practice paper", d4PaperD: "{q} open-response questions in {m} minutes · pass mark 55%", d4Les: "Lessons", d4LesD: "The unit's syllabus, outcome by outcome",
      d4Quiz: "Revision quizzes", d4QuizD: "Multiple choice with explanations", d4Open: "Written answers", d4OpenD: "{n} exam-style questions, marked, with a model answer",
      d4Ess: "Essays and cases", d4EssD: "{n} long prompts with a structure guide and marking criteria", d4Fl: "Flashcards", d4FlD: "Key terms, figures and concepts",
      d4Sec: "Practice", d4Rule: "The rule: complete every open question until each one is at least sufficient (55%).", d4Suff: "sufficient", d4NextO: "Next question to bring up to 55%",
      d4AllOk: "Every open question is at least sufficient: well done! Now raise your lowest scores and sit the practice papers.",
      d4Keys: "Key points", d4QCh: "Quiz on this chapter", d4OCh: "Open questions on this chapter", d4Prev: "Previous", d4Next: "Next", d4Back: "All lessons", d4All: "All chapters",
      d4Flip: "Tap the card to turn it over", d4Shuf: "Shuffle", d4Of: "of",
      d4OTitle: "Written answers · {u}", d4OIntro: "Open-response questions like the exam: explain causes and effects, compare, evaluate. Write, then mark: the app compares your answer with the key points, scores each part and shows a model answer.",
      d4FAll: "All", d4FTodo: "To do", d4FLow: "Below 55%", d4FOk: "Sufficient", d4FEss: "Essays and cases", d4StNew: "to do", d4StLow: "below 55%", d4StOk: "sufficient",
      d4EssTag: "Essay", d4Min: "{m} min suggested", d4Guide: "Suggested structure and criteria", d4Crit: "What earns marks",
      d4PStart: "Start the paper", d4PIntro: "Practice format: {q} open-response questions from different chapters, {m} minutes. Answer as in the exam, then hand in: every answer is marked and counts towards the 55% rule.",
      d4PSubmit: "Hand in", d4PSure: "Hand in now? Blank parts score 0.", d4PRes: "Practice paper result", d4PAgain: "New paper", d4PReview: "Review the question",
      d4PBand0: "Not yet sufficient (below 55%)", d4PBand1: "Pass (55–64%)", d4PBand2: "Pass with Merit (65–74%)", d4PBand3: "Pass with Distinction (75% and above)", d4PEmpty: "You haven't written anything: nothing to mark.",
      d4Time: "Study time", d4TimeI: "The recommended time for the whole Diploma is 500 hours (guided learning + private study). We split it by the weight of each unit and add a generous safety margin: better to over-estimate and be ready.",
      d4TRec: "Recommended time for {u}: about {h} h ({w}% of the Diploma).", d4TGoal: "Goal", d4TMode: "How you study", d4TSelf: "App only", d4TCourse: "Course + app",
      d4TH: "≈ {h} hours of study in total: {wk} weeks at {d} h a day, 6 days a week.", d4TPace: "Hours a day", d4TNote: "A cautious estimate, not a promise: it depends on your pace and your course. With a course, its guided hours come on top, on its own schedule.",
      d4TOrder: "D1 and D2 are studied first; the D1 exam is sat first.", d4Ex: "{u} exam: {f}", d4ExD1: "open-response written paper, 90 minutes", d4ExD2: "open-response written paper, 60 minutes",
      plT_les: "Lessons: {c}", plT_d4o: "Written answer: {c}", plT_d4p: "Timed practice paper · {u}", plT_d4e: "Essay or case: {c}",
      obHi: "Hi! I'm your Diploma goat 🍷", obHiP: "I'll build you a tailor-made path for unit {u}. It takes 5 quick questions.", obW4: "In 3 months", obW8: "In 6 months", obW12: "In 9 months",
      obGoal_passD: "At least 55%: the minimum, stress-free", obGoal_meritD: "From 65%: a solid result", obGoal_distD: "From 75%: the top",
      plG_merit: "Pass with Merit", plG_dist: "Pass with Distinction", plGoalD: "Pass from 55%, Pass with Merit from 65%, Pass with Distinction from 75%: the higher the goal, the more work per day.",
      oIntro: "Open-response questions like the exam. Write your answer to each part: the app compares it with the key points, scores each part, tells you what you got and what is missing, and shows the model answer.",
      lgNote: "Automatic marking against the key points: if you expressed an idea in very different words, check it yourself against the model answer.", pfKeys: "Model answer:",
      lgShort: "Very short answer: the exam needs full sentences that explain causes and effects.",
      wlOP: "You've tried them: they are what makes the difference in the exam. Unlock every Diploma open question, with marking.", wlList: "Every Diploma question · marked written answers · timed practice papers · flashcards" },
    es: { tab_study: "Diploma", oKeys: "Guía de corrección (puntos clave)", l2RevK: "Repaso", l2Err: "Mis errores", l2ErrD: "Las preguntas falladas vuelven hasta que las sepas", l2PlayK: "Recreo", l2Surv: "Supervivencia", l2SurvD: "3 corazones, 20 segundos por pregunta", l2Match: "¡Empareja!", l2MatchD: "Une cada término con su explicación", l2Lamp: "Test relámpago", l2LampD: "10 preguntas al azar de la unidad", l2Again: "Nueva partida", l2Bravo: "¡Bien hecho! Todo emparejado", l2Time: "Tiempo restante",
      d4Kick: "Diploma · preparación", d4Title: "Diploma", d4Intro: "Lecciones en profundidad, tests de repaso, preguntas abiertas corregidas y simulacros cronometrados, unidad por unidad.",
      d4Unit: "Unidad", d4Paper: "Simulacro de examen", d4PaperD: "{q} preguntas abiertas en {m} minutos · aprobado con 55 %", d4Les: "Lecciones", d4LesD: "El programa de la unidad, objetivo por objetivo",
      d4Quiz: "Tests de repaso", d4QuizD: "Preguntas de opción múltiple con explicación", d4Open: "Respuestas escritas", d4OpenD: "{n} preguntas tipo examen, corregidas, con respuesta modelo",
      d4Ess: "Ensayos y casos", d4EssD: "{n} enunciados largos con esquema y criterios de evaluación", d4Fl: "Tarjetas", d4FlD: "Términos, cifras y conceptos clave",
      d4Sec: "Práctica", d4Rule: "La regla: completa todas las preguntas abiertas hasta que cada una sea al menos suficiente (55 %).", d4Suff: "suficientes", d4NextO: "Siguiente pregunta para llevar al 55 %",
      d4AllOk: "Todas las preguntas abiertas son al menos suficientes: ¡muy bien! Ahora sube las notas más bajas y haz los simulacros.",
      d4Keys: "Para recordar", d4QCh: "Test del capítulo", d4OCh: "Preguntas abiertas del capítulo", d4Prev: "Anterior", d4Next: "Siguiente", d4Back: "Todas las lecciones", d4All: "Todos los capítulos",
      d4Flip: "Toca la tarjeta para darle la vuelta", d4Shuf: "Mezclar", d4Of: "de",
      d4OTitle: "Respuestas escritas · {u}", d4OIntro: "Preguntas abiertas como en el examen: explicar causas y efectos, comparar, evaluar. Escribe y luego corrige: la app compara tu respuesta con los puntos clave, puntúa cada parte y muestra una respuesta modelo.",
      d4FAll: "Todas", d4FTodo: "Pendientes", d4FLow: "Por debajo del 55 %", d4FOk: "Suficientes", d4FEss: "Ensayos y casos", d4StNew: "pendiente", d4StLow: "por debajo del 55 %", d4StOk: "suficiente",
      d4EssTag: "Ensayo", d4Min: "{m} min recomendados", d4Guide: "Esquema recomendado y criterios", d4Crit: "Lo que suma puntos",
      d4PStart: "Empezar el simulacro", d4PIntro: "Formato de práctica: {q} preguntas abiertas de capítulos distintos, {m} minutos. Responde como en el examen y entrega: cada respuesta se corrige y cuenta para la regla del 55 %.",
      d4PSubmit: "Entregar", d4PSure: "¿Entregar ahora? Las partes vacías valen 0.", d4PRes: "Resultado del simulacro", d4PAgain: "Nuevo simulacro", d4PReview: "Revisar la pregunta",
      d4PBand0: "Todavía no suficiente (menos del 55 %)", d4PBand1: "Pass (55–64 %)", d4PBand2: "Pass with Merit (65–74 %)", d4PBand3: "Pass with Distinction (75 % o más)", d4PEmpty: "No has escrito nada: no hay nada que corregir.",
      d4Time: "Tiempo de estudio", d4TimeI: "El tiempo recomendado para todo el Diploma es de 500 horas (clases guiadas + estudio personal). Lo repartimos según el peso de cada unidad y añadimos un amplio margen de seguridad: mejor pasarse y llegar preparado.",
      d4TRec: "Tiempo recomendado para {u}: unas {h} h ({w} % del Diploma).", d4TGoal: "Objetivo", d4TMode: "Cómo estudias", d4TSelf: "Solo con la app", d4TCourse: "Curso + app",
      d4TH: "≈ {h} horas de estudio en total: {wk} semanas a {d} h al día, 6 días por semana.", d4TPace: "Horas al día", d4TNote: "Estimación prudente, no una promesa: depende de tu ritmo y de tu curso. Con un curso, sus horas guiadas se suman según su calendario.",
      d4TOrder: "D1 y D2 se estudian primero; el examen D1 se hace primero.", d4Ex: "Examen {u}: {f}", d4ExD1: "prueba escrita de respuesta abierta, 90 minutos", d4ExD2: "prueba escrita de respuesta abierta, 60 minutos",
      plT_les: "Lecciones: {c}", plT_d4o: "Respuesta escrita: {c}", plT_d4p: "Simulacro cronometrado · {u}", plT_d4e: "Ensayo o caso: {c}",
      obHi: "¡Hola! Soy tu cabra del Diploma 🍷", obHiP: "Te preparo un recorrido a medida para la unidad {u}. Bastan 5 preguntas rápidas.", obW4: "Dentro de 3 meses", obW8: "Dentro de 6 meses", obW12: "Dentro de 9 meses",
      obGoal_passD: "Al menos un 55 %: lo mínimo, sin estrés", obGoal_meritD: "Desde el 65 %: un resultado sólido", obGoal_distD: "Desde el 75 %: lo máximo",
      plG_merit: "Pass with Merit", plG_dist: "Pass with Distinction", plGoalD: "Pass desde el 55 %, Pass with Merit desde el 65 %, Pass with Distinction desde el 75 %: cuanto más alto el objetivo, más trabajo al día.",
      oIntro: "Preguntas abiertas como en el examen. Escribe la respuesta a cada parte: la app la compara con los puntos clave, puntúa cada parte, te dice qué has acertado y qué falta y muestra la respuesta modelo.",
      lgNote: "Corrección automática según los puntos clave: si has expresado una idea con palabras muy distintas, compruébalo tú en la respuesta modelo.", pfKeys: "Respuesta modelo:",
      lgShort: "Respuesta muy breve: en el examen hacen falta frases completas que expliquen causas y efectos.",
      wlOP: "Ya las has probado: son las que marcan la diferencia en el examen. Desbloquea todas las preguntas abiertas del Diploma, con corrección.", wlList: "Todas las preguntas del Diploma · respuestas escritas corregidas · simulacros cronometrados · tarjetas" }
  };
  U.it.tab_study = U.fr.tab_study = U.en.tab_study = U.es.tab_study = "Diploma";
  const ES_ = () => lang === "es" || lang === "es-ar";
  const LX = () => (ES_() ? 3 : L());                                    /* index into [it,fr,en,es] arrays, for texts read directly */
  const tx = a => (Array.isArray(a) ? (a[LX()] || a[2]) : a && typeof a === "object" ? (a[ES_() ? "es" : LC()] || a.en) : a);
  const fill = (s, o) => String(s).replace(/\{(\w+)\}/g, (m, k) => (o[k] != null ? o[k] : m));
  const LSU = "twg-d4-unit";
  let unit = (() => { try { const u = localStorage.getItem(LSU); return UNITS.includes(u) ? u : UNITS[0]; } catch (e) { return UNITS[0]; } })();
  const setUnit = u => { if (!UNITS.includes(u)) return; unit = u; try { localStorage.setItem(LSU, u); } catch (e) {} };
  const UX = () => C.units[unit];
  const uName = u => `${u} · ${tx(C.units[u].name)}`;
  const inUnit = c => chUnit[c] === unit;
  const openOf = (u, ess) => C.open.filter(o => o.u === (u || unit) && (ess == null || !!o.ess === ess));
  const best = id => { try { return oBest(id); } catch (e) { return null; } };
  const pctOf = id => { const b = best(id); return b && b.m ? b.s / b.m : null; };
  const stOf = id => { const p = pctOf(id); return p == null ? "new" : p >= .55 ? "ok" : "low"; };
  const nextOpen = u => { const L_ = openOf(u); return L_.find(o => stOf(o.id) === "low") || L_.find(o => stOf(o.id) === "new") || null; };

  let les = null, fl = { c: "", i: 0, flip: false, order: null }, oF = "", PAP = null, PRES = null, timer = null, TM = { g: "pass", m: "self", d: 2 };
  const ico = k => (typeof ICO !== "undefined" && ICO[k]) || "";
  const row = (attr, ic, ti, sub, extra) => `<button type="button" class="hubrow" ${attr}><span class="hub-ic">${ico(ic)}</span><span class="hub-tx"><b>${esc(ti)}</b><span>${esc(sub)}</span>${extra || ""}</span>${ico("chev")}</button>`;
  const lessonsOf = c => C.lessons.map((l, i) => [l, i]).filter(x => x[0].c === c);
  const unitLessons = () => C.lessons.map((l, i) => [l, i]).filter(x => x[0].u === unit);

  /* ---------- study time: the spec's total time split by unit weight, with the app's generous multipliers ---------- */
  /* TQT 500 h for the whole Diploma (128 GLH + 372 private study); unit share = its weighting (D1 20% → 100 h, D2 10% → 50 h).
     hours = share × 1.5 (safety margin) × 1.3 (open-response writing, like Level 3) × 1.3 if app only × goal (Pass 1, Merit 1.4,
     Distinction 1.9); never below the share. "Course + app": the course's own guided hours come on top. */
  const TQT = 500, GRX = { pass: 1, merit: 1.4, dist: 1.9 };
  const uHours = u => Math.round(TQT * (C.units[u].w || 0) / 100);
  const estH = (u, g, m) => { const s = uHours(u); return Math.round(Math.max(s, s * 1.5 * 1.3 * (m === "self" ? 1.3 : 1) * GRX[g])); };
  function timeCard() {
    const u = unit, h = estH(u, TM.g, TM.m), wk = Math.max(1, Math.ceil(h / (TM.d * 6)));
    const seg = (k, opts) => `<div class="seg d4seg" role="group">${opts.map(([v, l]) => `<button type="button" data-d4tm="${k}:${v}" aria-pressed="${String(TM[k]) === String(v)}">${esc(l)}</button>`).join("")}</div>`;
    return `<div class="card d4time"><h2 class="hsec" style="margin-top:0">⏳ ${esc(t("d4Time"))}</h2><p class="muted small">${esc(t("d4TimeI"))}</p>
      <p><b>${esc(fill(t("d4TRec"), { u, h: uHours(u), w: C.units[u].w }))}</b></p>
      <div class="d4tm"><span>${esc(t("d4TGoal"))}</span>${seg("g", [["pass", "Pass"], ["merit", "Merit"], ["dist", "Distinction"]])}</div>
      <div class="d4tm"><span>${esc(t("d4TMode"))}</span>${seg("m", [["self", t("d4TSelf")], ["course", t("d4TCourse")]])}</div>
      <div class="d4tm"><span>${esc(t("d4TPace"))}</span>${seg("d", [[1, "1 h"], [2, "2 h"], [3, "3 h"]])}</div>
      <p class="d4th">${esc(fill(t("d4TH"), { h, wk, d: TM.d }))}</p><p class="muted small">${esc(t("d4TOrder"))} ${esc(t("d4TNote"))}</p></div>`;
  }

  /* ---------- hub ---------- */
  function unitTabs() {
    if (UNITS.length < 2) return "";
    return `<div class="d4units" role="tablist" aria-label="${esc(t("d4Unit"))}">${UNITS.map(u => `<button type="button" role="tab" data-d4u="${u}" aria-selected="${u === unit}"><b>${u}</b><span>${esc(tx(C.units[u].name))}</span></button>`).join("")}</div>`;
  }
  function ruleCard() {
    const L_ = openOf(unit), ok = L_.filter(o => stOf(o.id) === "ok").length, n = L_.length, nx = nextOpen(unit);
    return `<div class="card d4rule"><p class="d4rt"><b>${ok}</b> / ${n} ${esc(t("d4Suff"))}</p><div class="d4bar"><i style="width:${n ? Math.round(ok / n * 100) : 0}%"></i></div>
      <p class="small">${esc(ok === n && n ? t("d4AllOk") : t("d4Rule"))}</p>${nx ? `<button type="button" class="btn primary" data-d4="onext">✍️ ${esc(t("d4NextO"))}</button>` : ""}</div>`;
  }
  function study() {
    const u = unit, X_ = UX(), ex = X_.exam || {}, nO = openOf(u, false).length, nE = openOf(u, true).length;
    const exl = t("d4Ex" + u) !== "d4Ex" + u ? fill(t("d4Ex"), { u, f: t("d4Ex" + u) }) : "";
    return `<section class="view hub area-wset d4hub">${lvSw()}${hubHead("ban-wset", "d4Kick", "d4Title", "d4Intro", "n37")}${unitTabs()}
      <h2 class="hsec">${esc(uName(u))}</h2>${exl ? `<p class="muted small d4exl">📝 ${esc(exl)}</p>` : ""}
      ${ex.minutes && nO ? `<button type="button" class="mockcard" data-d4="paper"><span class="mk-seal"> <br><b>${u}</b></span><span class="mk-tx"><b>${esc(t("d4Paper"))}</b><span>${esc(fill(t("d4PaperD"), { q: ex.q || 3, m: ex.minutes }))}</span></span>${ico("chev")}</button>` : ""}
      ${nO ? ruleCard() : ""}
      <h2 class="hsec">${esc(t("d4Sec"))}</h2>
      <div class="hublist">${row('data-go="l2les"', "schemi", t("d4Les"), t("d4LesD"))}${row('data-d4="quiz"', "quiz", t("d4Quiz"), t("d4QuizD"))}${nO ? row('data-d4="open"', "open", t("d4Open"), fill(t("d4OpenD"), { n: nO })) : ""}${nE ? row('data-d4="ess"', "open", t("d4Ess"), fill(t("d4EssD"), { n: nE })) : ""}${row('data-go="l2fl"', "grapes", t("d4Fl"), t("d4FlD"))}</div>
      ${timeCard()}</section>`;
  }

  /* ---------- lessons ---------- */
  function lessons() {
    const k = L();
    if (les != null && C.lessons[les]) {
      const L_ = C.lessons[les], same = lessonsOf(L_.c), pos = same.findIndex(x => x[1] === les), all = unitLessons().map(x => x[1]), j = all.indexOf(les);
      const prev = j > 0 ? all[j - 1] : null, next = j >= 0 && j < all.length - 1 ? all[j + 1] : null, hasO = C.open.some(o => o.c === L_.c);
      return `<section class="view l2les d4les"><p class="l2crumb"><button type="button" class="btn ghost" data-d4="list">← ${esc(t("d4Back"))}</button></p>
        <article class="card l2art"><small class="l2ch">${esc(L_.u)} · ${esc(chName(L_.c))} · ${pos + 1}/${same.length}</small><h2>${esc(L_.t[k])}</h2>
        ${L_.p.map(p => `<p>${esc(p[k])}</p>`).join("")}
        ${L_.k && L_.k.length ? `<div class="l2keys"><h3>${esc(t("d4Keys"))}</h3><ul>${L_.k.map(x => `<li>${esc(x[k])}</li>`).join("")}</ul></div>` : ""}</article>
        <div class="row l2nav">${prev != null ? `<button type="button" class="btn" data-d4="les" data-i="${prev}">← ${esc(t("d4Prev"))}</button>` : "<span></span>"}
        ${next != null ? `<button type="button" class="btn" data-d4="les" data-i="${next}">${esc(t("d4Next"))} →</button>` : ""}</div>
        <div class="row l2nav"><button type="button" class="btn primary" data-d4="cquiz" data-c="${L_.c}">${esc(t("d4QCh"))}</button>${hasO ? `<button type="button" class="btn" data-d4="copen" data-c="${L_.c}">✍️ ${esc(t("d4OCh"))}</button>` : ""}</div></section>`;
    }
    const g = C.groups.find(G => G.k === unit) || C.groups[0];
    return `<section class="view l2les d4les">${unitTabs()}<div class="group"><h3>${esc(uName(g.k))}</h3>${g.c.map(c => {
      const ls = lessonsOf(c); if (!ls.length) return "";
      return `<details class="l2chap"><summary><b>${esc(chName(c))}</b><span class="mono">${ls.length}</span></summary><ol>${ls.map(([l, i]) => `<li><button type="button" class="l2link" data-d4="les" data-i="${i}">${esc(l.t[k])}</button></li>`).join("")}</ol></details>`;
    }).join("")}</div></section>`;
  }

  /* ---------- flashcards ---------- */
  function flash() {
    const pool = C.flash.map((f, i) => i).filter(i => inUnit(C.flash[i].c) && (!fl.c || C.flash[i].c === fl.c));
    if (!fl.order || fl.order.length !== pool.length || fl.order.some(i => !pool.includes(i))) { fl.order = pool; fl.i = 0; fl.flip = false; }
    const k = L(), n = fl.order.length, F = n ? C.flash[fl.order[fl.i]] : null;
    const opts = `<option value="">${esc(t("d4All"))}</option>` + (C.groups.find(g => g.k === unit) || { c: [] }).c.filter(c => C.flash.some(f => f.c === c)).map(c => `<option value="${c}"${fl.c === c ? " selected" : ""}>${esc(chName(c))}</option>`).join("");
    return `<section class="view l2fl">${unitTabs()}<div class="row l2flbar"><select id="d4-flc" aria-label="${esc(t("d4All"))}">${opts}</select><button type="button" class="btn ghost" data-d4="fshuf">${esc(t("d4Shuf"))}</button></div>
      ${F ? `<button type="button" class="l2card${fl.flip ? " flip" : ""}" data-d4="flip" aria-live="polite"><small>${esc(chName(F.c))}</small><b>${esc((fl.flip ? F.b : F.f)[k])}</b><span class="l2hint">${fl.flip ? "" : esc(t("d4Flip"))}</span></button>
      <div class="row l2nav"><button type="button" class="btn" data-d4="fprev"${fl.i ? "" : " disabled"}>← ${esc(t("d4Prev"))}</button><span class="mono">${fl.i + 1} ${esc(t("d4Of"))} ${n}</span><button type="button" class="btn primary" data-d4="fnext"${fl.i < n - 1 ? "" : " disabled"}>${esc(t("d4Next"))} →</button></div>` : ""}</section>`;
  }

  /* ---------- review and play hubs (as the other levels) ---------- */
  function wine() {
    return `<section class="view hub area-wine">${hubHead("ban-wine", "l2RevK", "d4Title", "d4LesD", "n33")}${unitTabs()}<div class="hublist">${row('data-go="l2les"', "schemi", t("d4Les"), t("d4LesD"))}${row('data-go="l2fl"', "grapes", t("d4Fl"), t("d4FlD"))}${row('data-go="errors"', "quiz", t("l2Err"), t("l2ErrD"))}</div></section>`;
  }
  function play() {
    return `<section class="view hub area-play">${hubHead("ban-play", "l2PlayK", "d4Title", "l2LampD", "n05")}<div class="hublist">${row('data-go="g_surv"', "quiz", t("l2Surv"), t("l2SurvD"))}${row('data-d4="match"', "grapes", t("l2Match"), t("l2MatchD"))}${row('data-d4="lampo"', "quiz", t("l2Lamp"), t("l2LampD"))}</div></section>`;
  }
  let mt = null;
  function newMatch() {
    const pool = shuffle(C.flash.filter(f => inUnit(f.c) && f.f[2].length < 40 && f.b[2].length < 90)).slice(0, 5);
    mt = { p: pool, L: shuffle(pool.map((_, i) => i)), R: shuffle(pool.map((_, i) => i)), sel: null, ok: new Set(), bad: null };
  }
  function match() {
    if (!mt) newMatch(); const k = L(), done = mt.ok.size === mt.p.length;
    const cell = (side, i) => { const x = mt.p[i], ok = mt.ok.has(i), on = mt.sel && mt.sel[0] === side && mt.sel[1] === i, bad = mt.bad && mt.bad[0] === side && mt.bad[1] === i;
      return `<button type="button" class="l2mc${ok ? " ok" : ""}${on ? " on" : ""}${bad ? " bad" : ""}" data-d4="mc" data-s="${side}" data-i="${i}"${ok ? " disabled" : ""}>${esc((side === "L" ? x.f : x.b)[k])}</button>`; };
    return `<section class="view l2match">${done ? `<p class="l2done">🎉 ${esc(t("l2Bravo"))}</p>` : ""}<div class="l2mg"><div>${mt.L.map(i => cell("L", i)).join("")}</div><div>${mt.R.map(i => cell("R", i)).join("")}</div></div>
      <div class="row l2nav"><button type="button" class="btn primary" data-d4="mnew">${esc(t("l2Again"))}</button></div></section>`;
  }

  /* ---------- written answers: the list, with the 55% rule ---------- */
  function openList() {
    const all = openOf(unit), L_ = all.filter(o => oF === "ess" ? o.ess : oF === "todo" ? stOf(o.id) === "new" : oF === "low" ? stOf(o.id) === "low" : oF === "ok" ? stOf(o.id) === "ok" : oF ? o.c === oF : true);
    const k = L(), nE = all.filter(o => o.ess).length;
    const opt = (v, l, n) => `<option value="${v}"${oF === v ? " selected" : ""}>${esc(l)} (${n})</option>`;
    const sel = `<select id="d4-of" aria-label="${esc(t("d4FAll"))}">${opt("", t("d4FAll"), all.length)}${opt("todo", t("d4FTodo"), all.filter(o => stOf(o.id) === "new").length)}${opt("low", t("d4FLow"), all.filter(o => stOf(o.id) === "low").length)}${opt("ok", t("d4FOk"), all.filter(o => stOf(o.id) === "ok").length)}${nE ? opt("ess", t("d4FEss"), nE) : ""}${UX().ch.filter(c => all.some(o => o.c === c)).map(c => opt(c, chName(c), all.filter(o => o.c === c).length)).join("")}</select>`;
    const items = L_.map(o => { const b = best(o.id), p = b ? Math.round(b.s / b.m * 100) : null, st = stOf(o.id);
      return `<button type="button" class="oqi d4oqi" data-oq="${o.id}"><span class="emeta"><span class="tag">${esc(chName(o.c))}</span>${o.ess ? `<span class="tag">${esc(t("d4EssTag"))}</span>` : ""}<span class="mono">${omax(o)} ${esc(t("oMarks"))}${o.min ? " · " + esc(fill(t("d4Min"), { m: o.min })) : ""}</span><span class="tag ${st === "ok" ? "fixed" : st === "low" ? "active" : ""}">${st === "new" ? esc(t("d4StNew")) : `${p} % · ${esc(t(st === "ok" ? "d4StOk" : "d4StLow"))}`}</span></span><span class="ot">${esc(o.q[k])}</span><span class="muted" style="font-size:.88rem">${o.parts.map((p, i) => "abcdefgh"[i] + ") " + esc(p.t[k])).join("<br>")}</span></button>`; }).join("");
    const ex = UX().exam || {};
    return `<section class="view">${unitTabs()}<div class="card"><h2>${esc(fill(t("d4OTitle"), { u: unit }))}</h2><p class="muted" style="max-width:68ch;font-size:.9rem">${esc(t("d4OIntro"))}</p></div>
      ${ruleCard()}
      <div class="row" style="gap:8px;flex-wrap:wrap;margin:12px 0">${ex.minutes ? `<button type="button" class="btn" data-d4="paper">⏱️ ${esc(t("d4Paper"))}</button>` : ""}${sel}</div>
      <div class="olist">${items || `<div class="empty">${esc(t("oNone"))}</div>`}</div></section>`;
  }

  /* ---------- timed practice paper ---------- */
  function pickPaper(u) {
    const ex = C.units[u].exam || {}, q = ex.q || 3, pool = shuffle(openOf(u, false)), out = [], used = new Set();
    pool.forEach(o => { if (out.length < q && !used.has(o.c)) { used.add(o.c); out.push(o.id); } });
    pool.forEach(o => { if (out.length < q && !out.includes(o.id)) out.push(o.id); });
    return out;
  }
  function startPaper() {
    if (typeof gOpen === "function" && !gOpen() && typeof wallOpen === "function") { wallOpen("o", { c: (UX().ch || [])[0] }); return; }
    const ex = UX().exam || {}; PRES = null; PAP = { u: unit, ids: pickPaper(unit), ans: {}, end: Date.now() + (ex.minutes || 60) * 60000, started: false };
    oq = null; view = "open"; render(); window.scrollTo(0, 0);
  }
  function paperView() {
    const k = L(), ex = C.units[PAP.u].exam || {};
    if (!PAP.started) return `<section class="view"><div class="card d4pap"><small class="l2ch">${esc(PAP.u)} · ${esc(t("d4Paper"))}</small><h2>${esc(uName(PAP.u))}</h2>
      <p>${esc(fill(t("d4PIntro"), { q: PAP.ids.length, m: ex.minutes || 60 }))}</p><div class="row" style="gap:8px"><button type="button" class="btn primary" data-d4="pgo">${esc(t("d4PStart"))}</button><button type="button" class="btn ghost" data-d4="pquit">${esc(t("oBack"))}</button></div></div></section>`;
    const qs = PAP.ids.map((id, n) => { const o = OBY[id]; if (!o) return ""; const a = PAP.ans[id] || [];
      return `<div class="card d4pq"><div class="row" style="gap:6px"><span class="tag">${esc(t("oxQ"))} ${n + 1}</span><span class="tag">${esc(chName(o.c))}</span><span class="tag mono">${omax(o)} ${esc(t("oMarks"))}</span></div>
        <p class="qtext" style="margin:0">${esc(o.q[k])}</p>${o.parts.map((p, i) => `<div class="opart"><div class="ph"><b>${"abcdefgh"[i]}) ${esc(p.t[k])}</b><span class="mono muted">${p.m} ${esc(t("oMarks"))}</span></div><textarea data-d4pa="${id}|${i}" aria-label="${n + 1}${"abcdefgh"[i]}">${esc(a[i] || "")}</textarea></div>`).join("")}</div>`; }).join("");
    return `<section class="view d4papv"><div class="qhead"><span class="label">${esc(t("d4Paper"))} · ${esc(PAP.u)}</span><button class="btn ghost" data-d4="pquit">${esc(t("quit"))}</button></div>${qs}
      <div class="row"><button type="button" class="btn primary" data-d4="psub">${esc(t("d4PSubmit"))}</button></div></section>`;
  }
  function markPaper() {
    const res = { u: PAP.u, ts: Date.now(), q: [] }; let S = 0, M = 0;
    PAP.ids.forEach(id => { const o = OBY[id]; if (!o) return; const ans = o.parts.map((p, i) => ((PAP.ans[id] || [])[i] || "").trim()); const m = omax(o);
      if (!ans.some(a => a)) { res.q.push({ id, s: 0, m }); M += m; return; }
      const raw = { parts: o.parts.map((p, i) => lgPart(p, ans[i])) }, g = Object.assign(lgView(o, raw), { raw }), s = g.parts.reduce((a, x) => a + x.score, 0);
      (OA[id] = OA[id] || []).push({ ts: res.ts, a: ans, g, s, m }); if (OA[id].length > 8) OA[id] = OA[id].slice(-8); saveOA(id);
      P.s.push({ t: res.ts, m: "open", n: m, c: s, ch: [o.c] }); res.q.push({ id, s, m }); S += s; M += m; });
    res.s = S; res.m = M; save(); PRES = res; PAP = null; clearInterval(timer); const e = document.getElementById("d4clock"); if (e) e.remove();
    try { const h = JSON.parse(localStorage.getItem("twg-d4-papers") || "[]"); h.push({ u: res.u, ts: res.ts, s: S, m: M }); localStorage.setItem("twg-d4-papers", JSON.stringify(h.slice(-30))); } catch (e) {}
  }
  function paperRes() {
    const r = PRES, p = r.m ? Math.round(r.s / r.m * 100) : 0, band = p >= 75 ? 3 : p >= 65 ? 2 : p >= 55 ? 1 : 0, k = L();
    return `<section class="view"><div class="card" style="display:flex;flex-direction:column;gap:10px"><span class="label">${esc(t("d4PRes"))} · ${esc(r.u)}</span>
      <div class="row" style="align-items:baseline;gap:16px"><span class="result-score ${p >= 55 ? "pass" : "fail"}">${p} %</span><span class="mono muted">${Math.round(r.s * 2) / 2}/${r.m}</span></div><p><b>${esc(t("d4PBand" + band))}</b></p>
      ${r.q.map((x, n) => { const o = OBY[x.id], pp = x.m ? Math.round(x.s / x.m * 100) : 0; return `<div class="d4prow"><div><b>${esc(t("oxQ"))} ${n + 1}</b> · ${esc(chName(o.c))}<br><span class="muted small">${esc(o.q[k])}</span></div><span class="tag ${pp >= 55 ? "fixed" : "active"}">${Math.round(x.s * 2) / 2}/${x.m} · ${pp} %</span><button type="button" class="btn sm" data-oq="${x.id}">${esc(t("d4PReview"))}</button></div>`; }).join("")}
      <div class="row" style="gap:8px"><button type="button" class="btn primary" data-d4="paper">${esc(t("d4PAgain"))}</button><button type="button" class="btn ghost" data-d4="presx">${esc(t("oBack"))}</button></div></div></section>`;
  }
  function tick() {
    clearInterval(timer);
    timer = setInterval(() => {
      if (!PAP || !PAP.started) { clearInterval(timer); const e = document.getElementById("d4clock"); if (e) e.remove(); return; }
      const left = Math.max(0, PAP.end - Date.now()), m = Math.floor(left / 60000), s = Math.floor(left / 1000) % 60;
      let e = document.getElementById("d4clock");
      if (!e) { e = document.createElement("div"); e.id = "d4clock"; e.className = "l2clock"; document.body.appendChild(e); }
      e.textContent = `${t("l2Time")} ${m}:${String(s).padStart(2, "0")}`;
      if (!left) { markPaper(); render(); window.scrollTo(0, 0); }
    }, 1000);
  }

  /* ---------- events ---------- */
  document.addEventListener("click", e => {
    const tm = e.target.closest && e.target.closest("[data-d4tm]");
    if (tm) { const [k, v] = tm.dataset.d4tm.split(":"); TM[k] = k === "d" ? +v : v; const y = scrollY; render(); scrollTo(0, y); return; }
    const ub = e.target.closest && e.target.closest("[data-d4u]");
    if (ub) { setUnit(ub.dataset.d4u); fl.order = null; fl.c = ""; oF = ""; les = null; mt = null; render(); return; }
    const pa = e.target.closest && e.target.closest("[data-plact]");
    if (pa) { const a = pa.dataset.plact;
      if (a.startsWith("d4l:")) { const c = a.slice(4), ls = lessonsOf(c), i = ls.length ? ls[0][1] : null; setUnit(chUnit[c]); les = i; go("l2les"); window.scrollTo(0, 0); return; }
      if (a.startsWith("d4o:") || a.startsWith("d4e:")) { const c = a.slice(4), ess = a[2] === "e", L_ = C.open.filter(o => o.c === c && !!o.ess === ess); const pick = L_.find(o => stOf(o.id) === "low") || L_.find(o => stOf(o.id) === "new") || L_[0];
        setUnit(chUnit[c]); go("open"); if (pick) openQ(pick.id); window.scrollTo(0, 0); return; }
      if (a.startsWith("d4p:")) { setUnit(a.slice(4)); startPaper(); return; }
      return; }
    const b = e.target.closest && e.target.closest("[data-d4]"); if (!b) return;
    const a = b.dataset.d4;
    if (a === "paper") return startPaper();
    if (a === "pgo") { PAP.started = true; PAP.end = Date.now() + ((C.units[PAP.u].exam || {}).minutes || 60) * 60000; render(); tick(); window.scrollTo(0, 0); return; }
    if (a === "pquit") { PAP = null; clearInterval(timer); const c = document.getElementById("d4clock"); if (c) c.remove(); render(); return; }
    if (a === "psub") { const any = PAP && Object.values(PAP.ans).some(x => x.some(s => s && s.trim())); if (!any) { alert(t("d4PEmpty")); return; } if (!confirm(t("d4PSure"))) return; markPaper(); render(); window.scrollTo(0, 0); return; }
    if (a === "presx") { PRES = null; render(); return; }
    if (a === "quiz") { go("practice"); return; }
    if (a === "open") { oF = ""; oq = null; go("open"); return; }
    if (a === "ess") { oF = "ess"; oq = null; go("open"); return; }
    if (a === "onext") { const o = nextOpen(unit); if (o) { go("open"); openQ(o.id); window.scrollTo(0, 0); } return; }
    if (a === "copen") { oF = b.dataset.c; oq = null; go("open"); window.scrollTo(0, 0); return; }
    if (a === "cquiz") { const pool = shuffle(BANK.filter(x => x.c === b.dataset.c).map(x => x.id)); startQuiz(pool.slice(0, 10), "practice", [b.dataset.c]); return; }
    if (a === "match") { newMatch(); view = "l2match"; render(); window.scrollTo(0, 0); return; }
    if (a === "mnew") { newMatch(); render(); return; }
    if (a === "lampo") { startQuiz(shuffle(BANK.filter(x => inUnit(x.c)).map(x => x.id)).slice(0, 10), "practice", []); return; }
    if (a === "mc") { const side = b.dataset.s, i = +b.dataset.i;
      if (!mt.sel || mt.sel[0] === side) { mt.sel = [side, i]; mt.bad = null; render(); return; }
      if (mt.sel[1] === i) { mt.ok.add(i); mt.sel = null; mt.bad = null; } else { mt.bad = [side, i]; mt.sel = null; }
      render(); return; }
    if (a === "list") { les = null; render(); return; }
    if (a === "les") { les = +b.dataset.i; if (view !== "l2les") view = "l2les"; render(); window.scrollTo(0, 0); return; }
    if (a === "flip") { fl.flip = !fl.flip; render(); return; }
    if (a === "fnext") { fl.i = Math.min(fl.i + 1, fl.order.length - 1); fl.flip = false; render(); return; }
    if (a === "fprev") { fl.i = Math.max(0, fl.i - 1); fl.flip = false; render(); return; }
    if (a === "fshuf") { fl.order = shuffle(fl.order); fl.i = 0; fl.flip = false; render(); return; }
  });
  document.addEventListener("change", e => { const x = e.target; if (!x) return;
    if (x.id === "d4-flc") { fl.c = x.value; fl.order = null; render(); }
    if (x.id === "d4-of") { oF = x.value; render(); } });
  document.addEventListener("input", e => { const x = e.target; if (!x || !x.dataset || !x.dataset.d4pa || !PAP) return; const [id, i] = x.dataset.d4pa.split("|"); (PAP.ans[id] = PAP.ans[id] || [])[+i] = x.value; });

  /* ---------- wiring into the main script (called by it once everything is defined) ---------- */
  function init() {
    ["it", "fr", "en"].forEach(l => Object.assign(T[l], U[l], { obHiP: fill(U[l].obHiP, { u: unit }) }));
    try { Object.assign(T.es, U.es, { obHiP: fill(U.es.obHiP, { u: unit }) }); Object.assign(T["es-ar"], U.es, { obHiP: fill(U.es.obHiP, { u: unit }) }); } catch (e) {}
    try { Object.assign(TABG, { l2les: "study", l2fl: "study", l2match: "play" }); Object.assign(SUBV, { l2les: "study", l2fl: "study", l2match: "play" }); Object.assign(SUBT, { l2les: "d4Les", l2fl: "d4Fl", l2match: "l2Match" }); } catch (e) {}
    /* the Diploma's own written questions replace the Level 3 ones while this level is open; the Level 2 mode lets the view through */
    try { OPEN.splice(0, OPEN.length, ...C.open); Object.keys(OBY).forEach(k => delete OBY[k]); OPEN.forEach(o => OBY[o.id] = o); } catch (e) { console.warn(e); }
    const MA = window.TWG_MEDIA_ALLOW || (window.TWG_MEDIA_ALLOW = new Set()); MA.add("open");
    /* key points and model answers in the reader's language: Spanish is the 4th element */
    oKey = function (p, l) { return Array.isArray(p.k) ? (p.k[l === 2 && ES_() ? 3 : l] || p.k[2]) : p.k; };
    const keyAt = (p, j) => (Array.isArray(p.k) ? p.k[j] || "" : p.k);
    lgPart = function (p, ans) { const l = LX(), txt = String(ans || ""), set = new Set(lgToks(txt));
      const base = lgPoints(keyAt(p, l)), alt = [0, 1, 2, 3].filter(x => x !== l).map(x => lgPoints(keyAt(p, x))).filter(a => a.length === base.length);
      const hi = [], mi = [];
      base.forEach((pt, j) => { (lgPointHit(pt, set) || alt.some(a => lgPointHit(a[j], set)) ? hi : mi).push(j); });
      const n = base.length || 1, m = p.m; let sc = n <= m ? hi.length * (m / n) : Math.min(m, hi.length); sc = Math.max(0, Math.min(m, Math.round(sc * 2) / 2));
      if (!txt.trim()) sc = 0;
      return { score: sc, max: m, hi, mi, words: (txt.trim().match(/\S+/g) || []).length }; };
    const _lm = lgModel; lgModel = function (o, lg) { if (!o || !o.parts || !o.parts.some(p => p.a)) return _lm.apply(this, arguments);
      return o.parts.map((p, i) => `**${"abcdefgh"[i]})** ${tx(p.a) || ""}`).join("\n\n"); };
    /* the list of written answers, the practice paper and its result */
    renderOpen = function () { try { if (PAP) return paperView(); if (PRES) return paperRes(); } catch (e) { console.warn(e); } return openList(); };
    /* essays: structure guide and marking criteria above the answer box */
    const _ro = renderOQ; renderOQ = function () { let h = _ro.apply(this, arguments); try { const o = OBY[oq]; if (!o) return h;
        const st = stOf(o.id), extra = `<div class="row d4oqm" style="gap:6px">${o.min ? `<span class="tag">⏱️ ${esc(fill(t("d4Min"), { m: o.min }))}</span>` : ""}${st !== "new" ? `<span class="tag ${st === "ok" ? "fixed" : "active"}">${esc(t(st === "ok" ? "d4StOk" : "d4StLow"))}</span>` : ""}</div>`
          + (o.g ? `<details class="model d4guide" open><summary>${esc(t("d4Guide"))}</summary><div class="mb">${md(tx(o.g))}</div></details>` : "");
        const i = h.indexOf('<p class="qtext"'); if (i >= 0) { const j = h.indexOf("</p>", i); if (j > 0) h = h.slice(0, j + 4) + extra + h.slice(j + 4); }
      } catch (e) {} return h; };
    /* the plan: lessons and written answers alongside the quizzes; only the current unit */
    const _plB = plBuild; plBuild = function () { const G = GROUPS; let r;
      try { GROUPS = G.filter(g => g.k === unit); r = _plB.apply(this, arguments); } finally { GROUPS = G; }
      try { const todo = openOf(unit).filter(o => stOf(o.id) !== "ok"), ess = todo.filter(o => o.ess); let k = 0;
        (r.days || []).forEach((d, i) => { if (d.rest || !d.tasks) return;
          const q = d.tasks.find(x => /^(q:|w:)/.test(x.id)), c = q && q.id.slice(2);
          if (c && d.phase === "L" && C.lessons.some(l => l.c === c) && !d.tasks.some(x => x.id === "d4l:" + c)) d.tasks.unshift({ id: "d4l:" + c, ic: "📖", tx: fill(t("plT_les"), { c: chName(c) }), act: "d4l:" + c });
          if (i % 2 === 1 && todo.length) { const o = todo[k++ % todo.length]; if (o && !o.ess) d.tasks.push({ id: "d4o:" + o.c, ic: "✍️", tx: fill(t("plT_d4o"), { c: chName(o.c) }), act: "d4o:" + o.c }); }
          if (ess.length && i % 5 === 4) { const o = ess[(i / 5 | 0) % ess.length]; d.tasks.push({ id: "d4e:" + o.c, ic: "📝", tx: fill(t("plT_d4e"), { c: chName(o.c) }), act: "d4e:" + o.c }); }
          if (d.phase === "R" && i % 4 === 2 && (UX().exam || {}).minutes) d.tasks.push({ id: "d4p:" + unit, ic: "⏱️", tx: fill(t("plT_d4p"), { u: unit }), act: "d4p:" + unit }); }); } catch (e) { console.warn(e); }
      return r; };
    /* render: onboarding dates in months; drop the paper state when leaving the view */
    const _r = render; render = function () { if (view !== "open") { PAP && clearInterval(timer); } const out = _r.apply(this, arguments);
      try { if (view === "start") document.querySelectorAll("[data-obweeks]").forEach(b => { const d = { 28: 91, 56: 182, 91: 273 }[b.dataset.obweeks]; if (d) { b.dataset.obweeks = d; try { const on = !OB.unk && OB.exam === obISO(d); b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); } catch (e) {} } }); } catch (e) {}
      return out; };
    const st = document.createElement("style");
    st.textContent = `.l2chap{border:1px solid var(--line);border-radius:14px;background:var(--surface);margin:8px 0;padding:0 14px}.l2chap summary{display:flex;justify-content:space-between;gap:10px;padding:13px 0;cursor:pointer}
.l2chap ol{margin:0 0 12px;padding-left:22px}.l2link{border:0;background:none;color:var(--fg);font:inherit;text-align:left;padding:6px 0;cursor:pointer;text-decoration:underline;text-decoration-color:var(--line)}
.l2art h2{margin:.2em 0 .6em}.l2art p{line-height:1.7}.l2ch{color:var(--muted);font-weight:700;letter-spacing:.04em;text-transform:uppercase;font-size:12px}
.l2keys{margin-top:16px;padding:14px 16px;border-radius:14px;background:var(--surface2,#fbf4e6);border-left:5px solid var(--gold,#c9a24a)}.l2keys h3{margin:0 0 6px;font-size:15px}.l2keys ul{margin:0;padding-left:20px;line-height:1.6}
.l2nav{justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-top:12px}.l2flbar{gap:8px;margin-bottom:12px}.l2flbar select{flex:1;min-width:0;padding:10px;border-radius:12px;border:1px solid var(--line);background:var(--surface);color:var(--fg);font:inherit}
.l2card{display:flex;flex-direction:column;justify-content:center;align-items:center;gap:12px;width:100%;min-height:260px;padding:28px 22px;border-radius:22px;border:1px solid var(--line);background:var(--surface);color:var(--fg);font:inherit;text-align:center;cursor:pointer;box-shadow:0 10px 30px rgba(0,0,0,.08)}
.l2card b{font-size:clamp(17px,4.4vw,22px);line-height:1.35}.l2card.flip{background:linear-gradient(135deg,#5c1530,#7a1f3d);color:#fff}.l2card.flip b{font-size:clamp(15px,3.9vw,19px);font-weight:600}.l2card small{opacity:.7;font-weight:700;text-transform:uppercase;letter-spacing:.05em;font-size:11px}.l2hint{font-size:12px;opacity:.6}
.l2mg{display:grid;grid-template-columns:1fr 1fr;gap:10px}.l2mg>div{display:grid;gap:10px;align-content:start}.l2mc{border:1.5px solid var(--line);background:var(--surface);color:var(--fg);border-radius:14px;padding:12px;font:inherit;font-size:14px;line-height:1.35;text-align:left;cursor:pointer;min-height:56px}
.l2mc.on{border-color:var(--wine,#7a1f3d);box-shadow:0 0 0 3px rgba(122,31,61,.15)}.l2mc.ok{background:#e7f2e3;border-color:#7aa86a;color:#2f5a24;opacity:.75}.l2mc.bad{border-color:#c0392b}
.l2done{text-align:center;font-weight:800;font-size:18px;color:var(--wine,#7a1f3d)}
.l2clock{position:fixed;bottom:calc(env(safe-area-inset-bottom,0px) + 84px);left:50%;transform:translateX(-50%);z-index:60;background:#7a1f3d;color:#fff;border-radius:999px;padding:6px 12px;font-weight:700;font-size:13px;box-shadow:0 6px 18px rgba(0,0,0,.2)}
.d4units{display:flex;gap:8px;margin:0 0 14px;overflow-x:auto;padding-bottom:2px}.d4units button{flex:1 1 0;min-width:0;display:flex;flex-direction:column;align-items:flex-start;gap:2px;padding:10px 12px;border-radius:14px;border:1.5px solid var(--line);background:var(--surface);color:var(--fg);font:inherit;text-align:left;cursor:pointer}
.d4units button b{font-size:15px}.d4units button span{font-size:12px;color:var(--muted);line-height:1.25}.d4units button[aria-selected=true]{border-color:var(--wine,#7a1f3d);background:color-mix(in srgb,var(--wine,#7a1f3d) 8%,var(--surface,#fff))}
.d4rule{display:flex;flex-direction:column;gap:8px;margin:12px 0}.d4rule p{margin:0}.d4rt{font-size:15px}.d4rt b{font:800 26px/1 Fraunces,Georgia,serif;color:var(--wine,#7a1f3d)}
.d4bar{height:10px;border-radius:99px;background:var(--sunk,#f3efe8);overflow:hidden}.d4bar i{display:block;height:100%;background:var(--good,#2e7d4f);border-radius:99px}
.d4rule .btn{align-self:flex-start}.d4exl{margin:-4px 0 10px}
.d4time{margin-top:16px;display:flex;flex-direction:column;gap:10px}.d4time p{margin:0}.d4tm{display:flex;flex-direction:column;gap:6px}.d4tm>span{font-size:13px;font-weight:700;color:var(--muted)}
.d4seg{display:flex;flex-wrap:wrap;gap:6px}.d4seg button{border:1px solid var(--line);background:var(--surface);color:var(--fg);border-radius:999px;padding:7px 12px;font:inherit;font-size:13px;font-weight:700;cursor:pointer}
.d4time .d4seg button[aria-pressed=true]{background:var(--wine,#7a1f3d);border-color:var(--wine,#7a1f3d);color:#fff}.d4th{font-weight:800;font-size:16px;padding:10px 12px;border-radius:12px;background:var(--sunk,#f3efe8)}
.d4pap{display:flex;flex-direction:column;gap:10px}.d4pq{display:flex;flex-direction:column;gap:14px;margin-bottom:14px}.d4pq textarea{width:100%;min-height:150px;box-sizing:border-box}
.d4prow{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;padding:10px 0;border-top:1px solid var(--line)}.d4prow .btn{grid-column:1/-1;justify-self:start}
.d4guide .mb{line-height:1.55}.d4oqm{margin-top:-6px}`;
    document.head.appendChild(st);
  }
  window.L2UI = { init, study, lessons, flash, wine, play, match, lvSwitch: () => "" };
})();
