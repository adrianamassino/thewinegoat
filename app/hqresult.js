/* The Wine Goat — result of the home quiz (assets/homequiz.js: a fixed set of 20 questions per theme), shown in the app
   once the visitor has an account. The home saves the result in localStorage "twg-hq-result" (same origin):
   {v,theme,score,total,topics:{topic:[right,asked]},a:[[question id, chosen option (0 = correct)]…],ts,lang,home,seen}
   and sends the visitor here with #go=signup. After sign-up / sign-in this file shows: score (x/20) and %, a level
   reading, 3–5 recommendations from the weakest topics (links to the matching level of the app), a review of every
   answer (correct option + explanation: shown only here, never on the home) and, for wine, spirits, sake and beer (not mix), an estimated
   preparation time for a target grade (Pass / Merit / Distinction) at 1 / 2 / 3 hours a day (app only, or a course + the app), plus a button to the app's
   existing 50-question mock exam (Level 2 / Spirits 2) or 30-question mock (Sake 1 / Beer 1, the only sake and beer levels). The result is also saved in the account (table user_docs,
   doc_id "homequiz/last", the same per-user document store as the progress, no schema change); if that fails it simply
   stays on the device. #go=hqresult shows the last result again. Texts: it / fr / en / es / es-ar here; the map-based
   languages translate the English text through TWG_I18N (tools/i18n, scope core/093). */
(function () {
  "use strict";
  const KEY = "twg-hq-result", DOC = "homequiz/last";
  const D = {
    it: { tmB2: "Punto di partenza: il tempo di studio consigliato per il livello ({r} h), con un ampio margine di sicurezza, adattato al tuo punteggio. Meglio abbondare ed essere pronti.", tmBs2: "Punto di partenza: il tempo di studio consigliato per il livello ({r} h), con un ampio margine di sicurezza e il 30% in più perché studi senza insegnante, adattato al tuo punteggio.", l3X: "Il Livello 3 aggiunge una degustazione alla cieca e domande a risposta aperta scritta, molto più difficili delle crocette: il tempo in più è già incluso.", bkK: "Come dividere il tempo:", bkM: "Domande a scelta multipla", bkW: "Risposte aperte scritte", bkT: "Degustazione", rcOpen: "Risposte scritte: completa TUTTE le domande a risposta aperta dell'app e rielabora ciascuna finché non è almeno sufficiente, idealmente eccellente.", oCnt: "{x} domande aperte su {n} a livello sufficiente", oGo: "Apri le domande a risposta aperta", mdK: "Come studierai?", mdA: "Solo con l'app (in autonomia)", mdC: "Con un corso in aula o online + l'app", mdP: "Scegli come studierai per vedere la stima.", mdNC: "Questo è il tuo studio con l'app (studio personale e ripasso). Le ore guidate del corso (circa {g} h) si aggiungono, secondo il calendario del corso.", mdNS: "Studiando da solo/a: aggiungi esercizi regolari di degustazione e ricorda che l'esame va comunque prenotato presso un ente formativo autorizzato.", rcRv: "Leggi tutte le spiegazioni in «Rivedi le tue risposte», qui sotto, anche per le domande giuste: ognuna è una piccola lezione.", grK: "Voto obiettivo:", grNP: "Pass: il tempo di studio consigliato per il livello, adattato al tuo punteggio.", grNM: "Il Merit richiede conoscenze dettagliate e sicure su tutto il programma: metti in conto più esercizio e ripassi regolari.", grND: "La Distinction richiede una memoria precisa e pronta per l'esame: prevedi domande di allenamento ogni giorno, esami simulati in condizioni d'esame e ripasso attivo di ogni capitolo.", grL1: "Questo livello si supera o non si supera, senza voti.", rcQ2: "{g}: {c}/{n} giuste. Risposte corrette e spiegazioni sono in «Rivedi le tue risposte», qui sotto.", rvK: "Rivedi le tue risposte", rvYou: "La tua risposta:", rvOk: "Risposta corretta:", rvErr: "Al momento non è stato possibile caricare le domande.", kick: "Il risultato del tuo quiz", thWine: "Vino", thBeer: "Birra", thSpirits: "Distillati", thSake: "Sake", thMix: "Mix",
      sc: "{n} risposte giuste su {t}", lvK: "Il tuo livello", lvW: "Vino Livello {n}", lvS: "Distillati Livello {n}", lvK1: "Sake Livello {n}", lvB1: "Birra Livello {n}",
      rA: "Sei all'inizio: comincia da {L1}, le basi.", rB: "Hai buone basi: puoi iniziare {L2}.",
      rC: "Sei vicino al livello d'esame: rinforza i tuoi punti deboli in {L2}.", rD: "Ottimo: sembri pronto per l'esame di {L2} e puoi iniziare {L3}.",
      gA: "Sei all'inizio: è il momento giusto per imparare le basi.", gB: "Hai buone basi e conosci l'essenziale.",
      gC: "Conoscenze solide: restano pochi argomenti da rifinire.", gD: "Ottimo: conosci davvero bene l'argomento.",
      tpK: "Il tuo punteggio per argomento", rcK: "Cosa fare adesso",
      rcT: "{g}: {c}/{n} giuste. Ripassa le lezioni, poi fai il quiz del capitolo.", rcStart: "Parti dalle prime lezioni di {L}: capitoli brevi, ognuno con il suo quiz.", rcMock: "Quando i punti deboli superano il 70%, fai un esame simulato in {L}.",
      rcNext: "Puoi andare oltre: inizia {L}.", rcCourse: "I corsi dell'app riguardano vino e distillati: un buon passo successivo è {L}.",
      rcAll: "Nessun punto debole: complimenti! Tieni fresca la memoria con un quiz misto ogni pochi giorni.",
      rcDaily: "Meglio poco ogni giorno: {d} h al giorno valgono più di una lunga sessione a settimana.",
      mock: "Fai l'esame simulato completo da 50 domande ({L})", mock30: "Fai l'esame simulato completo da 30 domande ({L})", open: "Apri {L}", tmK: "Tempo di preparazione stimato", tmL: "Per arrivare pronti all'esame di {L}",
      w1: "circa 1 settimana", wN: "circa {w} settimane",
      tmH: "≈ {h} ore di studio in totale, con {d} h al giorno, 6 giorni a settimana.", tmN: "È una stima, non una promessa: dipende dal tuo ritmo e dal tuo corso.",
      pace: "Tempo di studio al giorno:", paceB: "{d} h", cta: "Continua nell'app", svA: "Salvato nel tuo account.", svL: "Salvato su questo dispositivo.",
      gate: "Crea il tuo account gratuito per vedere il punteggio e il tuo piano personalizzato.", close: "Chiudi",
      w_grapes: "Vitigni", w_regions: "Regioni del vino", w_winemaking: "Vigna e vinificazione", w_styles: "Spumanti, vini dolci e fortificati",
      w_service: "Conservazione, servizio e abbinamenti", w_tasting: "Degustazione", s_production: "Distillazione e invecchiamento", s_whisky: "Whisky",
      s_brandy: "Cognac e distillati di frutta", s_cane: "Rum e Tequila", s_white: "Vodka, gin e liquori", s_cocktails: "Cocktail",
      b_ingredients: "Ingredienti della birra", b_brewing: "Produzione della birra", b_styles: "Stili di birra", b_service: "Servizio e degustazione della birra",
      k_ingredients: "Riso, koji e acqua", k_brewing: "Produzione del sake", k_styles: "Stili e categorie di sake", k_service: "Servizio del sake" },
    fr: { tmB2: "Point de départ : le temps d'étude recommandé pour le niveau ({r} h), avec une large marge de sécurité, ajusté à votre score. Mieux vaut prévoir large et être prêt.", tmBs2: "Point de départ : le temps d'étude recommandé pour le niveau ({r} h), avec une large marge de sécurité et 30 % de plus pour l'étude sans formateur, ajusté à votre score.", l3X: "Le Niveau 3 ajoute une dégustation à l'aveugle et des questions à réponse courte écrite, bien plus difficiles que le QCM : le temps supplémentaire est inclus.", bkK: "Comment répartir votre temps :", bkM: "QCM", bkW: "Réponses courtes écrites", bkT: "Dégustation", rcOpen: "Réponses écrites : faites TOUTES les questions à réponse courte de l'appli et retravaillez chacune jusqu'à ce qu'elle soit au moins suffisante, idéalement excellente.", oCnt: "{x} questions à réponse courte sur {n} au niveau suffisant", oGo: "Ouvrir les questions à réponse courte", mdK: "Comment allez-vous étudier ?", mdA: "Uniquement avec l'appli (en autonomie)", mdC: "Avec un cours en salle ou en ligne + l'appli", mdP: "Choisissez comment vous allez étudier pour voir l'estimation.", mdNC: "C'est votre travail avec l'appli (étude personnelle et révisions). Les heures encadrées du cours (environ {g} h) s'ajoutent, selon le calendrier de votre cours.", mdNS: "En autonomie : ajoutez une pratique régulière de la dégustation, et n'oubliez pas que l'examen doit être réservé auprès d'un organisme de formation agréé.", rcRv: "Lisez toutes les explications dans « Revoir vos réponses », ci-dessous, même pour les bonnes réponses : chacune est une petite leçon.", grK: "Mention visée :", grNP: "Pass : le temps d'étude recommandé pour le niveau, ajusté à votre score.", grNM: "Le Merit demande des connaissances détaillées et sûres sur tout le programme : prévoyez plus d'entraînement et des révisions régulières.", grND: "La Distinction exige une mémorisation précise, prête pour l'examen : prévoyez des questions d'entraînement chaque jour, des examens blancs en conditions réelles et une révision active de chaque chapitre.", grL1: "Ce niveau se réussit ou non, sans mention.", rcQ2: "{g} : {c}/{n} bonnes réponses. Les bonnes réponses et les explications sont dans « Revoir vos réponses », ci-dessous.", rvK: "Revoir vos réponses", rvYou: "Votre réponse :", rvOk: "Bonne réponse :", rvErr: "Les questions n'ont pas pu être chargées pour le moment.", kick: "Le résultat de votre quiz", thWine: "Vin", thBeer: "Bière", thSpirits: "Spiritueux", thSake: "Saké", thMix: "Mix",
      sc: "{n} bonnes réponses sur {t}", lvK: "Votre niveau", lvW: "Vin Niveau {n}", lvS: "Spiritueux Niveau {n}", lvK1: "Saké Niveau {n}", lvB1: "Bière Niveau {n}",
      rA: "Vous débutez : commencez par {L1}, les bases.", rB: "Vous avez de bonnes bases : vous pouvez commencer {L2}.",
      rC: "Vous êtes proche du niveau de l'examen : renforcez vos points faibles dans {L2}.", rD: "Excellent : vous semblez au niveau de l'examen de {L2} et pouvez commencer {L3}.",
      gA: "Vous débutez : c'est le bon moment pour apprendre les bases.", gB: "Vous avez de bonnes bases et connaissez l'essentiel.",
      gC: "Des connaissances solides : il reste quelques sujets à peaufiner.", gD: "Excellent : vous connaissez vraiment bien le sujet.",
      tpK: "Votre score par thème", rcK: "Que faire maintenant",
      rcT: "{g} : {c}/{n} bonnes réponses. Revoyez les leçons, puis faites le quiz du chapitre.", rcStart: "Commencez par les premières leçons de {L} : des chapitres courts, chacun avec son quiz.", rcMock: "Quand vos points faibles dépassent 70 %, faites un examen blanc dans {L}.",
      rcNext: "Vous pouvez aller plus loin : commencez {L}.", rcCourse: "Les cours de l'appli portent sur le vin et les spiritueux : une bonne suite est {L}.",
      rcAll: "Aucun point faible : bravo ! Entretenez vos connaissances avec un quiz mixte tous les quelques jours.",
      rcDaily: "Mieux vaut un peu chaque jour : {d} h par jour valent mieux qu'une longue séance par semaine.",
      mock: "Passer l'examen blanc complet de 50 questions ({L})", mock30: "Passer l'examen blanc complet de 30 questions ({L})", open: "Ouvrir {L}", tmK: "Temps de préparation estimé", tmL: "Pour arriver au niveau de l'examen de {L}",
      w1: "environ 1 semaine", wN: "environ {w} semaines",
      tmH: "≈ {h} heures d'étude au total, à raison de {d} h par jour, 6 jours par semaine.", tmN: "C'est une estimation, pas une promesse : elle dépend de votre rythme et de votre cours.",
      pace: "Temps d'étude par jour :", paceB: "{d} h", cta: "Continuer dans l'appli", svA: "Enregistré dans votre compte.", svL: "Enregistré sur cet appareil.",
      gate: "Créez votre compte gratuit pour voir votre score et votre plan personnalisé.", close: "Fermer",
      w_grapes: "Cépages", w_regions: "Régions viticoles", w_winemaking: "Vigne et vinification", w_styles: "Effervescents, vins doux et vins mutés",
      w_service: "Conservation, service et accords", w_tasting: "Dégustation", s_production: "Distillation et vieillissement", s_whisky: "Whisky",
      s_brandy: "Cognac et eaux-de-vie de fruits", s_cane: "Rhum et Tequila", s_white: "Vodka, gin et liqueurs", s_cocktails: "Cocktails",
      b_ingredients: "Ingrédients de la bière", b_brewing: "Brassage", b_styles: "Styles de bière", b_service: "Service et dégustation de la bière",
      k_ingredients: "Riz, koji et eau", k_brewing: "Élaboration du saké", k_styles: "Styles et catégories de saké", k_service: "Service du saké" },
    en: { tmB2: "Starting point: the recommended study time for the level ({r} h), with a generous safety margin, adjusted to your score. Better to over-estimate and be ready.", tmBs2: "Starting point: the recommended study time for the level ({r} h), with a generous safety margin and 30% more for studying without a teacher, adjusted to your score.", l3X: "Level 3 adds a blind tasting and written short-answer questions, much harder than multiple choice: extra time is included.", bkK: "How to split your time:", bkM: "Multiple choice", bkW: "Written short answers", bkT: "Tasting", rcOpen: "Written answers: complete ALL the short-answer questions in the app and keep reworking each one until it is at least sufficient, ideally excellent.", oCnt: "{x} of {n} short-answer questions at sufficient level", oGo: "Open the short-answer questions", mdK: "How will you study?", mdA: "Only with the app (self-study)", mdC: "With a classroom or online course + the app", mdP: "Choose how you will study to see your estimate.", mdNC: "This is your study with the app (private study and revision). The course's guided hours (about {g} h) come on top, as scheduled by your course.", mdNS: "Studying on your own: add regular tasting practice, and remember that the exam itself must be booked with an approved course provider.", rcRv: "Read every explanation in “Review your answers” below, even for the questions you got right: each one is a short lesson.", grK: "Target grade:", grNP: "Pass: the recommended study time for the level, adjusted to your score.", grNM: "Merit asks for detailed, reliable knowledge across the whole syllabus: plan more practice and regular review.", grND: "Distinction requires precise, exam-ready recall: plan for daily practice questions, mock exams under exam conditions and active review of every chapter.", grL1: "This level is graded pass or fail.", rcQ2: "{g}: {c}/{n} correct. The correct answers and explanations are in “Review your answers” below.", rvK: "Review your answers", rvYou: "Your answer:", rvOk: "Correct answer:", rvErr: "The questions could not be loaded right now.", kick: "Your quiz result", thWine: "Wine", thBeer: "Beer", thSpirits: "Spirits", thSake: "Sake", thMix: "Mix",
      sc: "{n} out of {t} correct", lvK: "Your level", lvW: "Wine Level {n}", lvS: "Spirits Level {n}", lvK1: "Sake Level {n}", lvB1: "Beer Level {n}",
      rA: "You are just starting out: begin with {L1}, the foundations.", rB: "You have good basics: you look ready to start {L2}.",
      rC: "You are close to exam standard: strengthen your weak topics in {L2}.", rD: "Excellent: you look ready for the {L2} exam and can start {L3}.",
      gA: "You are just starting out: a great moment to learn the basics.", gB: "You have good basics and know the essentials.",
      gC: "Solid knowledge: just a few topics left to polish.", gD: "Excellent: you really know your subject.",
      tpK: "Your score by topic", rcK: "What to do next",
      rcT: "{g}: {c}/{n} correct. Go through the lessons, then take the chapter quiz.", rcStart: "Start with the first lessons of {L}: short chapters, each with its own quiz.", rcMock: "When your weak topics are above 70%, take a mock exam in {L}.",
      rcNext: "You are ready for more: start {L}.", rcCourse: "The courses in the app cover wine and spirits: a good next step is {L}.",
      rcAll: "No weak topic: well done! Keep it fresh with a mixed quiz every few days.",
      rcDaily: "A little every day works best: {d} h a day beats one long session a week.",
      mock: "Take the full 50-question mock exam ({L})", mock30: "Take the full 30-question mock exam ({L})", open: "Open {L}", tmK: "Estimated preparation time", tmL: "To be ready for the {L} exam",
      w1: "about 1 week", wN: "about {w} weeks",
      tmH: "≈ {h} hours of study in total, at {d} h a day, 6 days a week.", tmN: "This is an estimate, not a promise: it depends on your pace and on your course.",
      pace: "Study time per day:", paceB: "{d} h", cta: "Continue to the app", svA: "Saved to your account.", svL: "Saved on this device.",
      gate: "Create your free account to see your score and your personalised plan.", close: "Close",
      w_grapes: "Grape varieties", w_regions: "Wine regions", w_winemaking: "Vineyard and winemaking", w_styles: "Sparkling, sweet and fortified wines",
      w_service: "Storage, service and food pairing", w_tasting: "Tasting", s_production: "Distillation and maturation", s_whisky: "Whisky",
      s_brandy: "Cognac and fruit spirits", s_cane: "Rum and Tequila", s_white: "Vodka, gin and liqueurs", s_cocktails: "Cocktails",
      b_ingredients: "Beer ingredients", b_brewing: "Brewing", b_styles: "Beer styles", b_service: "Serving and tasting beer",
      k_ingredients: "Rice, koji and water", k_brewing: "Sake brewing", k_styles: "Sake styles and grades", k_service: "Serving sake" }
  };
  /* Spanish (es) and the Río de la Plata variant (only the keys that differ) */
  const ES = { tmB2: "Punto de partida: el tiempo de estudio recomendado para el nivel ({r} h), con un amplio margen de seguridad, ajustado a tu resultado. Mejor pasarse y llegar preparado.", tmBs2: "Punto de partida: el tiempo de estudio recomendado para el nivel ({r} h), con un amplio margen de seguridad y un 30 % más por estudiar sin profesor, ajustado a tu resultado.", l3X: "El Nivel 3 añade una cata a ciegas y preguntas de respuesta corta escrita, mucho más difíciles que las de opción múltiple: el tiempo extra ya está incluido.", bkK: "Cómo repartir tu tiempo:", bkM: "Opción múltiple", bkW: "Respuestas cortas escritas", bkT: "Cata", rcOpen: "Respuestas escritas: completa TODAS las preguntas de respuesta corta de la app y vuelve a trabajar cada una hasta que sea al menos suficiente, idealmente excelente.", oCnt: "{x} de {n} preguntas de respuesta corta con nivel suficiente", oGo: "Abrir las preguntas de respuesta corta", mdK: "¿Cómo vas a estudiar?", mdA: "Solo con la app (por mi cuenta)", mdC: "Con un curso presencial u online + la app", mdP: "Elige cómo vas a estudiar para ver la estimación.", mdNC: "Este es tu estudio con la app (estudio personal y repaso). Las horas guiadas del curso (unas {g} h) se suman aparte, según el calendario de tu curso.", mdNS: "Estudiando por tu cuenta: añade práctica de cata regular y recuerda que el examen hay que reservarlo con un centro de formación autorizado.", rcRv: "Lee todas las explicaciones en «Revisa tus respuestas», más abajo, también las de las preguntas acertadas: cada una es una pequeña lección.", grK: "Calificación objetivo:", grNP: "Pass: el tiempo de estudio recomendado para el nivel, ajustado a tu resultado.", grNM: "El Merit exige conocimientos detallados y seguros de todo el programa: prevé más práctica y repasos regulares.", grND: "La Distinction exige un recuerdo preciso y listo para el examen: prevé preguntas de práctica a diario, exámenes de prueba en condiciones reales y repaso activo de cada capítulo.", grL1: "Este nivel se aprueba o no, sin calificación.", rcQ2: "{g}: {c}/{n} correctas. Las respuestas correctas y las explicaciones están en «Revisa tus respuestas», más abajo.", rvK: "Revisa tus respuestas", rvYou: "Tu respuesta:", rvOk: "Respuesta correcta:", rvErr: "Ahora mismo no se pudieron cargar las preguntas.", kick: "El resultado de tu quiz", thWine: "Vino", thBeer: "Cerveza", thSpirits: "Destilados", thSake: "Sake", thMix: "Mix",
    sc: "{n} respuestas correctas de {t}", lvK: "Tu nivel", lvW: "Vino Nivel {n}", lvS: "Destilados Nivel {n}", lvK1: "Sake Nivel {n}", lvB1: "Cerveza Nivel {n}",
    rA: "Estás empezando: comienza por {L1}, las bases.", rB: "Tienes buenas bases: puedes empezar {L2}.",
    rC: "Estás cerca del nivel del examen: refuerza tus puntos débiles en {L2}.", rD: "Excelente: pareces a punto para el examen de {L2} y puedes empezar {L3}.",
    gA: "Estás empezando: es un buen momento para aprender las bases.", gB: "Tienes buenas bases y conoces lo esencial.",
    gC: "Conocimientos sólidos: quedan pocos temas por pulir.", gD: "Excelente: conoces muy bien el tema.",
    tpK: "Tu resultado por tema", rcK: "Qué hacer ahora",
    rcT: "{g}: {c}/{n} correctas. Repasa las lecciones y luego haz el quiz del capítulo.", rcStart: "Empieza por las primeras lecciones de {L}: capítulos cortos, cada uno con su quiz.", rcMock: "Cuando tus puntos débiles superen el 70 %, haz un examen de prueba en {L}.",
    rcNext: "Puedes ir más lejos: empieza {L}.", rcCourse: "Los cursos de la app tratan de vino y destilados: un buen siguiente paso es {L}.",
    rcAll: "Ningún punto débil: ¡enhorabuena! Mantén la memoria fresca con un quiz mixto cada pocos días.",
    rcDaily: "Mejor un poco cada día: {d} h al día valen más que una sesión larga a la semana.",
    mock: "Haz el examen de prueba completo de 50 preguntas ({L})", mock30: "Haz el examen de prueba completo de 30 preguntas ({L})", open: "Abrir {L}", tmK: "Tiempo de preparación estimado", tmL: "Para llegar a punto al examen de {L}",
    w1: "alrededor de 1 semana", wN: "alrededor de {w} semanas",
    tmH: "≈ {h} horas de estudio en total, con {d} h al día, 6 días a la semana.", tmN: "Es una estimación, no una promesa: depende de tu ritmo y de tu curso.",
    pace: "Tiempo de estudio al día:", paceB: "{d} h", cta: "Seguir en la app", svA: "Guardado en tu cuenta.", svL: "Guardado en este dispositivo.",
    gate: "Crea tu cuenta gratuita para ver tu puntuación y tu plan personalizado.", close: "Cerrar",
    w_grapes: "Variedades de uva", w_regions: "Regiones vinícolas", w_winemaking: "Viña y vinificación", w_styles: "Espumosos, vinos dulces y fortificados",
    w_service: "Conservación, servicio y maridaje", w_tasting: "Cata", s_production: "Destilación y envejecimiento", s_whisky: "Whisky",
    s_brandy: "Cognac y destilados de fruta", s_cane: "Ron y Tequila", s_white: "Vodka, ginebra y licores", s_cocktails: "Cócteles",
    b_ingredients: "Ingredientes de la cerveza", b_brewing: "Elaboración de la cerveza", b_styles: "Estilos de cerveza", b_service: "Servicio y cata de la cerveza",
    k_ingredients: "Arroz, koji y agua", k_brewing: "Elaboración del sake", k_styles: "Estilos y categorías de sake", k_service: "Servicio del sake" };
  const AR = { tmB2: "Punto de partida: el tiempo de estudio recomendado para el nivel ({r} h), con un amplio margen de seguridad, ajustado a tu puntaje. Mejor pasarse y llegar preparado.", tmBs2: "Punto de partida: el tiempo de estudio recomendado para el nivel ({r} h), con un amplio margen de seguridad y un 30 % más por estudiar sin profesor, ajustado a tu puntaje.", l3X: "El Nivel 3 suma una cata a ciegas y preguntas de respuesta corta escrita, mucho más difíciles que las de opción múltiple: el tiempo extra ya está incluido.", rcOpen: "Respuestas escritas: completá TODAS las preguntas de respuesta corta de la app y volvé a trabajar cada una hasta que sea al menos suficiente, idealmente excelente.", mdP: "Elegí cómo vas a estudiar para ver la estimación.", mdNS: "Estudiando por tu cuenta: sumá práctica de cata regular y recordá que el examen hay que reservarlo con un centro de formación autorizado.", rcRv: "Leé todas las explicaciones en «Revisá tus respuestas», más abajo, también las de las preguntas acertadas: cada una es una pequeña lección.", grNP: "Pass: el tiempo de estudio recomendado para el nivel, ajustado a tu puntaje.", grND: "La Distinction exige un recuerdo preciso y listo para el examen: prevé preguntas de práctica todos los días, exámenes de prueba en condiciones reales y repaso activo de cada capítulo.", rcQ2: "{g}: {c}/{n} correctas. Las respuestas correctas y las explicaciones están en «Revisá tus respuestas», más abajo.", rvK: "Revisá tus respuestas", rvErr: "Ahora no se pudieron cargar las preguntas.", rA: "Estás empezando: arrancá por {L1}, las bases.", rB: "Tenés buenas bases: podés empezar {L2}.",
    rC: "Estás cerca del nivel del examen: reforzá tus puntos débiles en {L2}.", rD: "Excelente: parecés a punto para el examen de {L2} y podés empezar {L3}.",
    gB: "Tenés buenas bases y conocés lo esencial.", gD: "Excelente: conocés muy bien el tema.",
    rcT: "{g}: {c}/{n} correctas. Repasá las lecciones y después hacé el quiz del capítulo.", rcStart: "Empezá por las primeras lecciones de {L}: capítulos cortos, cada uno con su quiz.", rcMock: "Cuando tus puntos débiles superen el 70 %, hacé un examen de prueba en {L}.",
    rcNext: "Podés ir más lejos: empezá {L}.", rcAll: "Ningún punto débil: ¡felicitaciones! Mantené la memoria fresca con un quiz mixto cada pocos días.",
    rcDaily: "Mejor un poco cada día: {d} h por día valen más que una sesión larga por semana.",
    tmH: "≈ {h} horas de estudio en total, con {d} h por día, 6 días por semana.", tmN: "Es una estimación, no una promesa: depende de tu ritmo y de tu curso.",
    mock: "Hacé el examen de prueba completo de 50 preguntas ({L})", mock30: "Hacé el examen de prueba completo de 30 preguntas ({L})", pace: "Tiempo de estudio por día:", gate: "Creá tu cuenta gratuita para ver tu puntaje y tu plan personalizado.",
    s_white: "Vodka, gin y licores", s_cocktails: "Cócteles y tragos", w_tasting: "Cata" };

  const ls = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  const lang = () => ls.get("wset3-lang") || window.TWG_LANG || "en";
  function tr(k) {
    const l = lang(), en = D.en[k];
    if (D[l]) return D[l][k] || en;
    if (l === "es") return ES[k] || en;
    if (l === "es-ar") return AR[k] || ES[k] || en;
    const M = window.TWG_I18N && window.TWG_I18N[l]; return (M && M[en]) || en;
  }
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fill = (s, o) => s.replace(/\{(\w+)\}/g, (m, k) => (o[k] != null ? o[k] : m));

  function read() {
    try { const r = JSON.parse(ls.get(KEY) || "null");
      if (!r || r.v !== 1 || !(r.total > 0) || !(r.score >= 0) || r.score > r.total || !r.topics || typeof r.topics !== "object") return null;
      if (["wine", "beer", "spirits", "sake", "mix"].indexOf(r.theme) < 0) return null; return r; } catch (e) { return null; }
  }
  const acct = () => window.twgAccount || null;
  const signed = () => { const a = acct(); return !!(a && a.enabled() && a.signedIn()); };

  /* ---- the reading: band, level, hours ---- */
  const BAND = p => (p < .35 ? 0 : p < .55 ? 1 : p < .8 ? 2 : 3);
  const lvName = (trk, n) => fill(tr({ s: "lvS", k: "lvK1", b: "lvB1" }[trk] || "lvW"), { n });
  const lvCode = (trk, n) => ({ s: "s", k: "k", b: "b" }[trk] || "") + n;
  /* sake and beer: one level in the app (Level 1: 30 questions, 45 minutes, pass 70%) */
  const ONE = trk => trk === "k" || trk === "b";
  /* Recommended study time per level (guided learning + private study, i.e. total qualification time), from the official
     qualification specifications / course pages, checked 2026-11-20:
       Wine L1 6 h (spec. Mar 2018: "TQT … 6 hours, all as GLH"), Wine L2 28 h (16 GL + 11 private + 1 exam),
       Wine L3 84 h (30 GL + 54 private), Spirits L1 6 h (spec. Jul 2017), Spirits L2 26 h (spec. May 2022 issue 2:
       15 GLH + 11 private), Spirits L3 84 h (30 GL + 51.5 private + exam), Sake L1 6 h (all GLH incl. 45 min exam),
       Beer L1 6 h (spec. Dec 2023 issue 1: 6 h GLH incl. 45 min exam).
     On screen this is only called "the recommended study time for the level".
     Generous on purpose (better to over-estimate so people pass):
       hours = TQT × 1.5 (safety margin) × (1 − 0.2·p) (what the quiz shows they know: at most −20%)
               × 1.3 for Level 3 (blind tasting + written short answers, much harder than multiple choice)
               × 1.3 when studying with the app only (no teacher, no guided tasting)
               × target grade: Pass 1, Merit 1.4, Distinction 1.9 (Level 1 is pass/fail only)
       and never fewer than the recommended time for the level. p = score / 20.
     "course + app": the course's guided hours (GLH) come on top, on the course's own schedule.
     Level 3 is shown in three blocks: multiple choice 30 %, written short answers 45 %, tasting 25 %. */
  const TQT = { w: { 1: 6, 2: 28, 3: 84 }, s: { 1: 6, 2: 26, 3: 84 }, k: { 1: 6 }, b: { 1: 6 } }, GLH = { w: { 1: 6, 2: 16, 3: 30 }, s: { 1: 6, 2: 15, 3: 30 }, k: { 1: 6 }, b: { 1: 6 } };
  const GRX = { pass: 1, merit: 1.4, dist: 1.9 }, SELF = 1.3, L3X = 1.3, BLOCKS = [["bkM", .3], ["bkW", .45], ["bkT", .25]];
  function hours(trk, lvl, p, grade, mode) {
    const t = TQT[trk][lvl], h = t * 1.5 * (1 - .2 * p) * (lvl === 3 ? L3X : 1) * (mode === "self" ? SELF : 1) * (lvl === 1 ? 1 : GRX[grade]);
    return Math.round(Math.max(t, h)); }
  const weeks = (h, d) => Math.max(1, Math.ceil(h / (d * 6)));

  /* Level 3 wine short-answer questions: the app's own list (OPEN) and saved attempts (OA, localStorage
     "wset3-open-v1", synced by the app); "sufficient" = best attempt at 55 % or more, as in the app. Read-only. */
  function openCount(trk) {
    try { if (trk !== "w") return "";
      const list = typeof OPEN !== "undefined" && Array.isArray(OPEN) ? OPEN : null; if (!list || !list.length) return "";
      let A = typeof OA !== "undefined" && OA && typeof OA === "object" ? OA : null;
      if (!A) { try { A = JSON.parse(ls.get("wset3-open-v1") || "{}") || {}; } catch (e) { A = {}; } }
      const ok = list.filter(o => (A[o.id] || []).some(x => x && x.m > 0 && x.s / x.m >= .55)).length;
      return fill(tr("oCnt"), { x: ok, n: list.length });
    } catch (e) { return ""; } }
  let PACE = 2, GRADE = "pass", SMODE = "", R = null, saved = false, prevFocus = null;
  function model(r) {
    const p = r.score / r.total, band = BAND(p), trk = { wine: "w", spirits: "s", sake: "k", beer: "b" }[r.theme] || null, one = ONE(trk);
    const startN = one ? 1 : band === 0 ? 1 : band === 3 ? 3 : 2, examN = one ? 1 : band === 0 ? 1 : 2;
    const rows = Object.keys(r.topics).map(k => ({ k, c: +r.topics[k][0] || 0, n: +r.topics[k][1] || 0 })).filter(x => x.n > 0 && D.en[x.k]);
    const weak = rows.filter(x => x.c / x.n < .8).sort((a, b) => a.c / a.n - b.c / b.n || b.n - a.n).slice(0, 3);
    const recs = [];
    const course = trk || "w", L = lvName(course, startN), code = lvCode(course, startN);
    const lv = x => { const t = "skb".includes(x.k[0]) ? x.k[0] : "w", n = ONE(t) ? 1 : startN === 3 ? 2 : startN; return { name: lvName(t, n), code: lvCode(t, n) }; };
    if (trk && band === 0) recs.push({ t: fill(tr("rcStart"), { L }), lvl: code, L });
    weak.forEach(x => {
      const g = tr(x.k);
      if ("wskb".includes(x.k[0])) { const v = lv(x); recs.push({ t: fill(tr("rcT"), { g, c: x.c, n: x.n }), lvl: v.code, L: v.name }); }
      else recs.push({ t: fill(tr("rcQ2"), { g, c: x.c, n: x.n }) });
    });
    if (!weak.length) recs.push({ t: tr("rcAll") });
    if (trk && (band === 1 || band === 2 || (one && band === 3))) recs.push({ t: fill(tr("rcMock"), { L }), lvl: code, L });
    if (trk && band === 3 && !one) recs.push({ t: fill(tr("rcNext"), { L }), lvl: code, L });
    if (!trk) { const n = band === 0 ? 1 : 2, Lc = lvName("w", n); recs.push({ t: fill(tr("rcCourse"), { L: Lc }), lvl: lvCode("w", n), L: Lc }); }
    const l3 = trk && !one && (band === 3 ? 3 : examN) === 3;
    while (recs.length > (l3 ? 3 : 4)) recs.splice(recs.length - 2, 1);
    if (l3) recs.splice(1, 0, { t: tr("rcOpen"), sub: openCount(trk), lvl: trk === "s" ? "s3" : "3", go: trk === "s" ? "study" : "open", L: tr("oGo"), lab: 1 });           /* keep the first ones and the closing step */
    if (trk) recs.push({ t: fill(tr("rcDaily"), { d: PACE }) });
    else if (recs.length < 3 && Array.isArray(r.a) && r.a.length) recs.push({ t: tr("rcRv") });
    const reading = trk && !one ? fill(tr("r" + "ABCD"[band]), { L1: lvName(trk, 1), L2: lvName(trk, 2), L3: lvName(trk, 3) }) : tr("g" + "ABCD"[band]);
    /* time estimate: wine, spirits, sake and beer (mix has no course); sake and beer have Level 1 only */
    const tl = one ? 1 : band === 3 ? 3 : examN, h = trk && SMODE ? hours(trk, tl, p, GRADE, SMODE) : 0, w = h ? weeks(h, PACE) : 0;
    const target = trk ? fill(tr("tmL"), { L: lvName(trk, tl) }) : "";
    return { p, band, rows, recs, reading, h, w, target, trk, tl, base: trk ? TQT[trk][tl] : 0, glh: trk ? GLH[trk][tl] : 0, start: trk ? { L, code } : null, mock: trk ? (one ? { L: lvName(trk, 1), code: lvCode(trk, 1), k: "mock30" } : { L: lvName(trk, 2), code: lvCode(trk, 2) }) : null };   /* Level 2 / Spirits 2: the 50-question mock; Sake 1 / Beer 1: 30 questions */
  }

  const CSS = `.hqr-bg{position:fixed;inset:0;z-index:400;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:12px}
.hqr{position:relative;background:var(--surface,#fff);color:var(--fg,#2b1a20);width:100%;max-width:560px;max-height:calc(100vh - 24px);max-height:calc(100dvh - 24px);overflow:auto;border-radius:20px;padding:22px 20px 20px;box-shadow:0 16px 50px rgba(0,0,0,.3);overscroll-behavior:contain;font-size:.95rem;line-height:1.45;overflow-wrap:anywhere}
.hqr :focus-visible{outline:3px solid var(--accent,#8c1d40);outline-offset:2px}
.hqr-x{position:absolute;top:10px;inset-inline-end:10px;width:40px;height:40px;border-radius:50%;border:1px solid var(--line,#e5d7cf);background:var(--bg,#fdf8f3);color:var(--fg,#2b1a20);font-size:1.1rem;cursor:pointer}
.hqr-k{margin:0 48px 2px 0;margin-inline:0 48px;font-size:.74rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted,#6b5a5f)}
.hqr h2{margin:0 48px 12px 0;margin-inline:0 48px;font-size:1.5rem;line-height:1.2;color:var(--accent,#8c1d40)}
.hqr h3{margin:18px 0 8px;font-size:.78rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted,#6b5a5f)}
.hqr-top{display:flex;gap:16px;align-items:center}
.hqr-ring{flex:none;width:104px;height:104px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(var(--accent,#8c1d40) calc(var(--p)*1%),var(--line,#e5d7cf) 0)}
.hqr-ring b{width:80px;height:80px;border-radius:50%;background:var(--surface,#fff);display:grid;place-items:center;font-size:1.5rem;font-weight:800;color:var(--fg,#2b1a20)}
.hqr-sc{margin:0;font-weight:700;font-size:1.05rem}.hqr-rd{margin:4px 0 0}
.hqr-box{border:1px solid var(--line,#e5d7cf);border-radius:14px;padding:14px;background:var(--bg,#fdf8f3)}
.hqr-tl{margin:0;color:var(--muted,#6b5a5f);font-size:.88rem}.hqr-tw{margin:2px 0 4px;font-size:1.45rem;font-weight:800;color:var(--accent,#8c1d40)}
.hqr-th{margin:0;font-size:.88rem}.hqr-tn{margin:6px 0 0;font-size:.8rem;color:var(--muted,#6b5a5f)}
.hqr-pace{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:10px;font-size:.88rem}.hqr-pace span{flex:1 1 100%}
.hqr-pace button{min-width:56px;min-height:40px;padding:6px 12px;border-radius:999px;border:1px solid var(--line,#e5d7cf);background:var(--surface,#fff);color:var(--fg,#2b1a20);font:inherit;font-weight:700;cursor:pointer}
.hqr-pace button[aria-pressed=true]{background:var(--accent,#8c1d40);border-color:var(--accent,#8c1d40);color:var(--on-accent,#fff)}
.hqr ol{margin:0;padding:0;list-style:none;counter-reset:r;display:flex;flex-direction:column;gap:8px}
.hqr ol li{counter-increment:r;position:relative;padding:10px 12px;padding-inline-start:42px;border:1px solid var(--line,#e5d7cf);border-radius:12px}
.hqr ol li:before{content:counter(r);position:absolute;inset-inline-start:10px;top:10px;width:22px;height:22px;border-radius:50%;background:var(--accent,#8c1d40);color:var(--on-accent,#fff);font-size:.78rem;font-weight:700;display:grid;place-items:center}
.hqr ol a{display:inline-block;margin-top:4px;font-weight:700;color:var(--accent,#8c1d40)}
.hqr-tp{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px}
.hqr-tp li{display:grid;grid-template-columns:1fr auto;gap:2px 10px;font-size:.9rem}
.hqr-tp i{grid-column:1/-1;height:6px;border-radius:6px;background:var(--line,#e5d7cf);overflow:hidden}.hqr-tp i u{display:block;height:100%;background:var(--accent,#8c1d40)}
.hqr-tp span:last-of-type{font-weight:700;white-space:nowrap}
.hqr-mk{display:block;width:100%;margin-top:18px;padding:12px;border-radius:12px;border:2px solid var(--accent,#8c1d40);background:var(--surface,#fff);color:var(--accent,#8c1d40);font:inherit;font-weight:700;font-size:.95rem;cursor:pointer;text-align:center}.hqr-mk+.hqr-go{margin-top:10px}
.hqr-go{display:block;width:100%;margin-top:18px;padding:13px;border-radius:12px;border:0;background:var(--accent,#8c1d40);color:var(--on-accent,#fff);font:inherit;font-weight:700;font-size:1rem;cursor:pointer}
.hqr-gn{margin:8px 0 0;font-size:.84rem}.hqr-bk{margin:6px 0 0;padding:0;list-style:none;display:grid;gap:4px;font-size:.88rem}.hqr-bk li{display:flex;justify-content:space-between;gap:10px;padding:6px 10px;border-radius:8px;background:var(--surface,#fff)}.hqr-bk b{white-space:nowrap}.hqr-md{margin:0 0 10px}.hqr-md button{flex:1 1 100%;text-align:start;border-radius:12px;min-height:44px}
.hqr-rv{margin-top:18px;border:1px solid var(--line,#e5d7cf);border-radius:14px;padding:0 14px}
.hqr-rv summary{cursor:pointer;padding:12px 0;font-weight:700;color:var(--accent,#8c1d40);min-height:24px}.hqr-rv summary span{color:var(--muted,#6b5a5f);font-weight:600}
.hqr-rvl{margin:0 0 12px;padding:0;list-style:none;display:flex;flex-direction:column;gap:10px}
.hqr-rvl li{padding:10px 12px;border-radius:12px;border:1px solid var(--line,#e5d7cf);background:var(--bg,#fdf8f3)}
.hqr-rvl li.ok{border-inline-start:4px solid #2e7d32}.hqr-rvl li.ko{border-inline-start:4px solid #c62828}
.hqr-rvl p{margin:4px 0 0;font-size:.88rem}.hqr-rvl .hqr-rq{margin:0;font-weight:700;font-size:.92rem}.hqr-rvl li.ok .hqr-rq b{color:#2e7d32}.hqr-rvl li.ko .hqr-rq b{color:#c62828}
.hqr-rvl p span{color:var(--muted,#6b5a5f)}.hqr-rvl .hqr-rc{font-weight:600}.hqr-rvl .hqr-re{color:var(--muted,#6b5a5f)}
.hqr-sv{margin:8px 0 0;text-align:center;font-size:.8rem;color:var(--muted,#6b5a5f)}
.hqr-note{padding:10px 12px;border-radius:10px;background:var(--bg,#fdf8f3);border:1px solid var(--line,#e5d7cf);color:var(--fg,#2b1a20)!important;font-weight:600}
@media (max-width:420px){.hqr{padding:20px 14px 16px}.hqr-ring{width:88px;height:88px}.hqr-ring b{width:68px;height:68px;font-size:1.25rem}}`;

  function html(r) {
    const m = model(r), pc = Math.round(m.p * 100), th = tr("th" + r.theme[0].toUpperCase() + r.theme.slice(1));
    const link = x => (x.sub ? `<br><b class="hqr-oc">${esc(x.sub)}</b>` : "") + (x.lvl ? `<br><a href="#lvl=${esc(x.lvl)}&go=${x.go || "study"}" data-hqr-lvl="${esc(x.lvl)}" data-hqr-go="${x.go || "study"}">${esc(x.lab ? x.L : fill(tr("open"), { L: x.L }))} →</a>` : "");
    const G = m.tl === 1 ? ["pass"] : ["pass", "merit", "dist"], GN = { pass: "Pass", merit: "Merit", dist: "Distinction" };
    const MD = ["self", "course"], MN = { self: "mdA", course: "mdC" };
    const ask = `<div class="hqr-pace hqr-md" role="group" aria-label="${esc(tr("mdK"))}"><span>${esc(tr("mdK"))}</span>${MD.map(x => `<button type="button" data-hqr-mode="${x}" aria-pressed="${x === SMODE}">${esc(tr(MN[x]))}</button>`).join("")}</div>`;
    const time = !m.trk ? "" : !SMODE ? `<h3>${esc(tr("tmK"))}</h3><div class="hqr-box">${ask}<p class="hqr-gn">${esc(tr("mdP"))}</p></div>` : `<h3>${esc(tr("tmK"))}</h3><div class="hqr-box">${ask}<p class="hqr-tl">${esc(m.target)}${m.tl === 1 ? "" : " · " + GN[GRADE]}</p><p class="hqr-tw">${esc(m.w === 1 ? tr("w1") : fill(tr("wN"), { w: m.w }))}</p>
<p class="hqr-th">${esc(fill(tr("tmH"), { h: m.h, d: PACE }))}</p>
${m.tl === 3 ? `<p class="hqr-gn">${esc(tr("l3X"))}</p><p class="hqr-gn"><b>${esc(tr("bkK"))}</b></p><ul class="hqr-bk">${BLOCKS.map(([k, f]) => `<li><span>${esc(tr(k))}</span><b>≈ ${Math.round(m.h * f)} h</b></li>`).join("")}</ul>` : ""}
<p class="hqr-gn">${esc(SMODE === "course" ? fill(tr("mdNC"), { g: m.glh }) : tr("mdNS"))}</p>
${m.tl === 1 ? `<p class="hqr-gn">${esc(tr("grL1"))}</p>` : `<div class="hqr-pace" role="group" aria-label="${esc(tr("grK"))}"><span>${esc(tr("grK"))}</span>${G.map(g => `<button type="button" data-hqr-grade="${g}" aria-pressed="${g === GRADE}">${GN[g]}</button>`).join("")}</div>
<p class="hqr-gn">${esc(tr(GRADE === "pass" ? "grNP" : GRADE === "merit" ? "grNM" : "grND"))}</p>`}
<div class="hqr-pace" role="group" aria-label="${esc(tr("pace"))}"><span>${esc(tr("pace"))}</span>${[1, 2, 3].map(d => `<button type="button" data-hqr-pace="${d}" aria-pressed="${d === PACE}">${esc(fill(tr("paceB"), { d }))}</button>`).join("")}</div>
<p class="hqr-tn">${esc(fill(tr(SMODE === "self" ? "tmBs2" : "tmB2"), { r: m.base }))} ${esc(tr("tmN"))}</p></div>`;
    return `<button type="button" class="hqr-x" data-hqr-close aria-label="${esc(tr("close"))}">✕</button>
<p class="hqr-k">${esc(tr("kick"))}</p><h2 id="hqr-t" tabindex="-1">${esc(th)} · ${r.score}/${r.total}</h2>
<div class="hqr-top"><div class="hqr-ring" style="--p:${pc}" aria-hidden="true"><b>${pc}%</b></div>
<div><p class="hqr-sc">${esc(fill(tr("sc"), { n: r.score, t: r.total }))} (${pc}%)</p><p class="hqr-rd"><b>${esc(tr("lvK"))}:</b> ${esc(m.reading)}</p></div></div>
${time}
<h3>${esc(tr("rcK"))}</h3><ol>${m.recs.map(x => `<li>${esc(x.t)}${link(x)}</li>`).join("")}</ol>
<h3>${esc(tr("tpK"))}</h3><ul class="hqr-tp">${m.rows.map(x => `<li><span>${esc(tr(x.k))}</span><span>${x.c}/${x.n}</span><i><u style="width:${Math.round(x.c / x.n * 100)}%"></u></i></li>`).join("")}</ul>
${Array.isArray(r.a) && r.a.length ? `<details class="hqr-rv" data-hqr-rv${RVOPEN ? " open" : ""}><summary>${esc(tr("rvK"))} <span>(${r.score}/${r.total})</span></summary><div class="hqr-rvb" data-hqr-rvb>…</div></details>` : ""}
${m.mock ? `<button type="button" class="hqr-mk" data-hqr-mock="${m.mock.code}">📝 ${esc(fill(tr(m.mock.k || "mock"), { L: m.mock.L }))}</button>` : ""}<button type="button" class="hqr-go" data-hqr-close>${esc(tr("cta"))}</button><p class="hqr-sv" data-hqr-sv>${esc(tr(saved ? "svA" : "svL"))}</p>`;
  }
  /* "review your answers": the questions come from the home quiz file of the language the visitor answered in */
  let RVOPEN = false; const QB = {};
  function review() {
    const box = document.querySelector("[data-hqr-rvb]"), d = document.querySelector("[data-hqr-rv]"); if (!box || !R || !Array.isArray(R.a)) return;
    if (d && !d._t) { d._t = 1; d.addEventListener("toggle", () => { RVOPEN = d.open; }); }
    const lg = /^[a-z]{2}(-[a-z]{2,4})?$/.test(R.lang || "") ? R.lang : "en";
    const draw = B => { const by = {}; ["wine", "beer", "spirits", "sake"].forEach(t => (B[t] || []).forEach(q => { by[q.id] = q; }));
      const rows = R.a.map(([id, k], n) => { const q = by[id]; if (!q) return ""; const ok = k === 0, you = q.o[k] != null ? q.o[k] : "–";
        return `<li class="${ok ? "ok" : "ko"}"><p class="hqr-rq"><b aria-hidden="true">${ok ? "✓" : "✗"}</b> ${n + 1}. ${esc(q.q)}</p>
<p><span>${esc(tr("rvYou"))}</span> ${esc(you)}</p>${ok ? "" : `<p class="hqr-rc"><span>${esc(tr("rvOk"))}</span> ${esc(q.o[0])}</p>`}<p class="hqr-re">${esc(q.e)}</p></li>`; }).join("");
      box.innerHTML = `<ul class="hqr-rvl" lang="${esc(lg)}">${rows}</ul>`; };
    if (QB[lg]) return draw(QB[lg]);
    fetch("/assets/homequiz/" + lg + ".json?v=3", { credentials: "same-origin" }).then(r => { if (!r.ok) throw 0; return r.json(); })
      .then(B => { QB[lg] = B; const b2 = document.querySelector("[data-hqr-rvb]"); if (b2) draw(B); })
      .catch(() => { const b2 = document.querySelector("[data-hqr-rvb]"); if (b2) b2.innerHTML = `<p>${esc(tr("rvErr"))}</p>`; });
  }
  function paint(keep) {
    const el = document.getElementById("hqr"); if (!el || !R) return;
    const y = el.scrollTop, ae = keep && document.activeElement, a = ae && (ae.hasAttribute("data-hqr-pace") ? `[data-hqr-pace="${ae.getAttribute("data-hqr-pace")}"]` : ae.hasAttribute("data-hqr-grade") ? `[data-hqr-grade="${ae.getAttribute("data-hqr-grade")}"]` : ae.hasAttribute("data-hqr-mode") ? `[data-hqr-mode="${ae.getAttribute("data-hqr-mode")}"]` : "");
    el.innerHTML = html(R); el.scrollTop = keep ? y : 0; review();
    const f = a ? el.querySelector(a) : el.querySelector("#hqr-t"); if (f) try { f.focus({ preventScroll: !!keep }); } catch (e) {}
  }
  function close() { const b = document.getElementById("hqr-bg"); if (b) b.remove(); if (prevFocus && prevFocus.focus) try { prevFocus.focus(); } catch (e) {} }
  function show(r) {
    if (document.getElementById("hqr-bg")) return;
    if (!document.getElementById("hqr-css")) { const st = document.createElement("style"); st.id = "hqr-css"; st.textContent = CSS; document.head.appendChild(st); }
    R = r; prevFocus = document.activeElement; GRADE = "pass"; RVOPEN = false; SMODE = r.mode === "self" || r.mode === "course" ? r.mode : "";
    const bg = document.createElement("div"); bg.id = "hqr-bg"; bg.className = "hqr-bg";
    bg.innerHTML = `<div class="hqr" id="hqr" role="dialog" aria-modal="true" aria-labelledby="hqr-t"></div>`;
    document.body.appendChild(bg); paint();
    bg.addEventListener("click", e => {
      if (e.target === bg || e.target.closest("[data-hqr-close]")) return close();
      const p = e.target.closest("[data-hqr-pace]"); if (p) { PACE = +p.getAttribute("data-hqr-pace") || 2; return paint(true); }
      const gr = e.target.closest("[data-hqr-grade]"); if (gr) { GRADE = gr.getAttribute("data-hqr-grade") || "pass"; return paint(true); }
      const md = e.target.closest("[data-hqr-mode]"); if (md) { SMODE = md.getAttribute("data-hqr-mode") === "course" ? "course" : "self";
        R.mode = SMODE; ls.set(KEY, JSON.stringify(R)); paint(true); return store(R, true); }   /* remembered with the result (device + account) */
      const mk = e.target.closest("[data-hqr-mock]"); if (mk) { const v = mk.getAttribute("data-hqr-mock");
        try { sessionStorage.setItem("twg-hq-mock", "1"); } catch (x) {}
        if (ls.get("twg-level") === v) { close(); location.hash = "go=study"; return openMock(); }
        ls.set("twg-level", v); location.hash = "go=study"; location.reload(); return; }
      const a = e.target.closest("[data-hqr-lvl]"); if (a) { e.preventDefault(); const v = a.getAttribute("data-hqr-lvl"), g = a.getAttribute("data-hqr-go") === "open" ? "open" : "study";
        if (ls.get("twg-level") === v || (!ls.get("twg-level") && v === "3")) { close(); location.hash = "go=" + g; return; }
        ls.set("twg-level", v); location.hash = "go=" + g; location.reload(); }
    });
    bg.addEventListener("keydown", e => {
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); return close(); }
      if (e.key !== "Tab") return;
      const f = [].slice.call(bg.querySelectorAll("button,a[href]")).filter(x => x.offsetParent !== null); if (!f.length) return;
      const a = f[0], z = f[f.length - 1], cur = document.activeElement;
      if (e.shiftKey && (cur === a || cur.id === "hqr-t")) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && cur === z) { e.preventDefault(); a.focus(); }
    });
    if (!r.seen) { r.seen = 1; ls.set(KEY, JSON.stringify(r)); }
    store(r);
  }
  /* the account copy: user_docs (user_id, doc_id, data), the same per-user document table as the progress */
  async function store(r, again) {
    try { const a = acct(), sb = a && a.client && a.client(), uid = a && a.uid && a.uid(); if (!sb || !uid || (r.cloud && !again)) return;
      const data = { v: 1, theme: r.theme, score: r.score, total: r.total, topics: r.topics, a: Array.isArray(r.a) ? r.a : [], mode: r.mode || "", ts: r.ts, lang: r.lang || "" };
      const { error } = await sb.from("user_docs").upsert({ user_id: uid, doc_id: DOC, data, updated_at: new Date().toISOString() }, { onConflict: "user_id,doc_id" });
      if (error) return; r.cloud = 1; ls.set(KEY, JSON.stringify(r)); saved = true;
      const s = document.querySelector("[data-hqr-sv]"); if (s) s.textContent = tr("svA");
    } catch (e) {}
  }
  function check(force) { const r = read(); if (!r || !signed()) return false; if (r.seen && !force) return false; saved = !!r.cloud; show(r); return true; }
  /* while the visitor has a result waiting and no account yet: say so in the account window */
  function note() {
    const r = read(); if (!r || r.seen || signed()) return;
    const d = document.querySelector("#acct-bg .acct"); if (!d || d.querySelector(".hqr-note")) return;
    if (!document.getElementById("hqr-css")) { const st = document.createElement("style"); st.id = "hqr-css"; st.textContent = CSS; document.head.appendChild(st); }
    const p = document.createElement("p"); p.className = "hqr-note"; p.textContent = "🔒 " + tr("gate"); const h = d.querySelector("h2"); if (h) h.after(p); else d.prepend(p);
  }
  function hash() { if (/[#&]go=hqresult\b/.test(location.hash || "")) { try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {} if (!check(true)) { const a = acct(); if (a && !signed() && read()) a.open(); } } }
  /* after "take the full mock": open the existing mock exam of the study hub (button data-l2="exam") once it is on screen */
  function openMock() {
    let ok = false; try { ok = sessionStorage.getItem("twg-hq-mock") === "1"; sessionStorage.removeItem("twg-hq-mock"); } catch (e) {}
    if (!ok) return; let n = 0;
    const t = setInterval(() => { const b = document.querySelector('[data-l2="exam"]');
      if (b) { clearInterval(t); b.click(); window.scrollTo(0, 0); } else if (++n > 40) clearInterval(t); }, 150);
  }
  function boot() {
    openMock();
    const a = acct(); if (!a) return;
    try { new MutationObserver(note).observe(document.body, { childList: true }); } catch (e) {}
    Promise.resolve(a.ready).then(() => { setTimeout(() => { check(false); hash(); }, 400); });
    window.addEventListener("twg-account", () => setTimeout(() => check(false), 50));
    window.addEventListener("hashchange", hash);
  }
  window.twgHomeQuizResult = { show: () => check(true), pending: () => { const r = read(); return !!(r && !r.seen); } };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
