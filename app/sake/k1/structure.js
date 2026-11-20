/* The Wine Goat — Sake Level 1 structure (beginner course: what sake is, how it is made, the main grades and speciality
   styles, tasting, storage, service and food). Same engines as wine Levels 1–2 and Spirits 1: groups → chapters → lessons;
   every item carries a chapter id.
   Exam: 30 multiple-choice questions, 45 minutes, 1 mark each, pass 70%, pass/fail only (checked against the specification).
   "w" on a group = exam questions in that area (ingredients and production 10 · categories, grades, speciality styles and
   labels 15 · storage, service and food 5); "w" on a chapter = our own estimate of how those questions spread, used only
   to weight practice and the mock exam.
   No exam-body or book names appear in the app text. */
window.TWG_K1 = {
  level: 1, track: "sake",
  exam: { questions: 30, minutes: 45, pass: 70, written: false, tasting: false },
  groups: [
    { k: "p", w: 10, n: { it: "Ingredienti e produzione", fr: "Ingrédients et élaboration", en: "Ingredients and brewing", es: "Ingredientes y elaboración" }, c: ["k01", "k02", "k03", "k04", "k05"] },
    { k: "s", w: 15, n: { it: "Categorie e stili", fr: "Catégories et styles", en: "Categories and styles", es: "Categorías y estilos" }, c: ["k06", "k07", "k08"] },
    { k: "t", w: 5, n: { it: "Degustare, conservare, servire", fr: "Déguster, conserver, servir", en: "Tasting, storage and service", es: "Catar, conservar, servir" }, c: ["k09", "k10", "k11", "k12"] }
  ],
  chapters: {
    /* ---------- ingredients and brewing ---------- */
    k01: { w: 2, n: { it: "Che cos'è il sake", fr: "Qu'est-ce que le saké ?", en: "What sake is", es: "Qué es el sake" },
      lessons: ["a Japanese rice drink: usually clear, 15–17% abv, slightly sweet, lightly acidic, delicate cereal, lactic or fruity notes; nihon-shu",
                "four main ingredients (steamed white rice, kōji, water, yeast) + optional high-strength distilled alcohol; where each comes from",
                "alcoholic fermentation (sugar + yeast → alcohol + CO2); rice has starch, not sugar: kōji enzymes convert it"] },
    k02: { w: 2, n: { it: "Le tappe della produzione", fr: "Les étapes de l'élaboration", en: "The brewing steps", es: "Los pasos de la elaboración" },
      lessons: ["always: fermentation (starter → main), filtration (required by law), bottling (glass)", "parallel fermentation: sugar made and eaten at the same time; about 20% abv at the end",
                "optional: neutral distilled alcohol before filtration, water before bottling (down to 15–17%), pasteurisation"] },
    k03: { w: 3, n: { it: "Dal riso integrale al riso cotto a vapore", fr: "Du riz brun au riz cuit à la vapeur", en: "From brown rice to steamed rice", es: "Del arroz integral al arroz al vapor" },
      lessons: ["polishing: outer (brown), middle (white) layers and starch core; what the outer layers bring", "polishing ratio: % of the grain left; 70 / 60 / 50% and the grades",
                "washing, soaking, steaming: why each step"] },
    k04: { w: 1, n: { it: "Come si fa il kōji", fr: "Comment on fait le kōji", en: "Making kōji", es: "Cómo se hace el kōji" },
      lessons: ["the kōji rooms: precise temperature and humidity", "four stages: cool the rice, spread the spores, fast first growth (turned by hand), slow and stop the growth"] },
    k05: { w: 2, n: { it: "Fermentazione e stile", fr: "Fermentation et style", en: "Fermentation and style", es: "Fermentación y estilo" },
      lessons: ["yeast gives most of the flavour; starter then main fermentation", "special yeast + cool temperatures = fruity, floral ginjō aromas; warmer = cereal and lactic"] },

    /* ---------- categories and styles ---------- */
    k06: { w: 6, n: { it: "Sake base e sake premium", fr: "Saké de base et saké premium", en: "Basic and premium sake", es: "Sake básico y sake premium" },
      lessons: ["futsū-shu, the basic sake", "six premium grades: ginjō styles (fruity, floral) vs junmai and honjōzō (cereal, lactic, more acid and umami)",
                "junmai = pure rice, no added distilled alcohol; the grid of grades with polishing, yeast and temperature"] },
    k07: { w: 3, n: { it: "Leggere un'etichetta giapponese", fr: "Lire une étiquette japonaise", en: "Reading a Japanese label", es: "Leer una etiqueta japonesa" },
      lessons: ["four key words and seven kanji: junmai 純米, honjōzō 本醸造, ginjō 吟醸, daiginjō 大吟醸"] },
    k08: { w: 6, n: { it: "Gli stili speciali", fr: "Les styles spéciaux", en: "Speciality styles", es: "Los estilos especiales" },
      lessons: ["nama (unpasteurised, keep cold, drink soon) and nigori (roughly filtered, cloudy)", "sparkling sake and koshu (aged sake)", "speciality styles combine with any grade"] },

    /* ---------- tasting, storage and service ---------- */
    k09: { w: 1, n: { it: "Degustare il sake", fr: "Déguster le saké", en: "Tasting sake", es: "Catar el sake" },
      lessons: ["preparing: no smells, white surface, tulip glass, clean palate", "a simple grid: appearance, nose, palate"] },
    k10: { w: 1, n: { it: "Conservazione e difetti", fr: "Conservation et défauts", en: "Storage and faults", es: "Conservación y defectos" },
      lessons: ["keep cool, drink young, store upright, avoid light; open bottles in the fridge (about 2 weeks, ginjō about 1)", "faults: oxidation, out of condition, nama-hine", "drinking in moderation"] },
    k11: { w: 2, n: { it: "Servire il sake", fr: "Servir le saké", en: "Serving sake", es: "Servir el sake" },
      lessons: ["temperatures: chilled 6–13 °C, room 15–18 °C, warm 40–50 °C; what heat does; which styles", "warming: water bath (about 80 °C, 2–4 min) or microwave (20–40 s for 180 mL)",
                "tokkuri, o-choko, masu and wine glasses"] },
    k12: { w: 1, n: { it: "Sake e cibo", fr: "Saké et mets", en: "Sake and food", es: "Sake y comida" },
      lessons: ["taste interactions: salt and acid help; umami, sugar, chilli and bitterness are harder", "sake is food-friendly: preference first, match intensity, match sweetness"] }
  },
  /* course tastings, for the tasting notes */
  tastings: { min: 4, suggest: ["futsū-shu or junmai", "ginjō or daiginjō", "nigori", "sparkling sake", "koshu"] },
  /* simple tasting grid (our own wording): appearance → nose → palate */
  grid: {
    clarity: ["clear", "cloudy"],
    aromaFamilies: ["fruity / floral", "cereal / grain / nut", "lactic / dairy", "other"],
    flavourIntensity: ["light", "medium", "pronounced"],
    palateNotes: ["sweetness", "acidity", "texture", "umami", "rice particles", "bubbles", "finish"]
  },
  /* level-specific texts of the shared study screens (l2/l2app.js), [it, fr, en, es] */
  ui: {
    tab_study: ["Sake 1", "Saké 1", "Sake 1", "Sake 1"],
    l2Title: ["Esame Sake 1", "Examen Saké 1", "Sake 1 exam", "Examen Sake 1"],
    l2Intro: ["Lezioni, quiz e flashcard su riso, kōji, categorie di sake e servizio.", "Leçons, quiz et flashcards sur le riz, le kōji, les catégories de saké et le service.", "Lessons, quizzes and flashcards on rice, kōji, sake grades and service.", "Lecciones, tests y tarjetas sobre arroz, kōji, categorías de sake y servicio."],
    l2FlD: ["Ripassa termini giapponesi, categorie e stili", "Révisez termes japonais, catégories et styles", "Review Japanese terms, grades and styles", "Repasa términos japoneses, categorías y estilos"],
    l2RevT: ["Tutto Sake 1", "Tout Saké 1", "All of Sake 1", "Todo Sake 1"],
    l2RevI: ["Lezioni, flashcard ed errori: solo il programma di Sake 1.", "Leçons, flashcards et erreurs : uniquement le programme Saké 1.", "Lessons, flashcards and mistakes: only the Sake 1 syllabus.", "Lecciones, tarjetas y errores: solo el programa de Sake 1."],
    l2PlayT: ["Giochi di Sake 1", "Jeux Saké 1", "Sake 1 games", "Juegos de Sake 1"],
    l2PlayI: ["Giochi brevi sulle domande e sui termini di Sake 1.", "Des jeux courts sur les questions et les termes de Saké 1.", "Short games on Sake 1 questions and terms.", "Juegos cortos sobre preguntas y términos de Sake 1."],
    obHi: ["Ciao! Sono la tua capra del sake 🍶", "Bonjour ! Je suis votre chèvre du saké 🍶", "Hi! I'm your sake goat 🍶", "¡Hola! Soy tu cabra del sake 🍶"],
    obHiP: ["Ti preparo un percorso su misura per passare l'esame Sake 1. Bastano 5 domande veloci.", "Je vous prépare un parcours sur mesure pour réussir l'examen Saké 1. Il suffit de 5 questions rapides.", "I'll build you a tailor-made path to pass your Sake 1 exam. It takes 5 quick questions.", "Te preparo un recorrido a medida para aprobar el examen Sake 1. Bastan 5 preguntas rápidas."]
  },
  formats: {
    question: "{id, c:chapter, q:[it,fr,en,es], o:[[it,fr,en,es] ×4, first = correct], e:[it,fr,en,es] short why, d:[it,fr,en,es] distractor note}",
    lesson: "{c:chapter, t:[it,fr,en,es] title, p:[[it,fr,en,es] paragraphs], keys:[[it,fr,en,es] key points]}",
    flash: "{c:chapter, f:[it,fr,en,es] front, b:[it,fr,en,es] back}"
  }
};
