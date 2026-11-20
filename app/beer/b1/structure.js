/* The Wine Goat — Beer Level 1 structure (beginner course: ingredients and brewing, 20 named styles in four families,
   tasting, storage, service, faults and food). Same engines as wine Levels 1–2 and Spirits 1: groups → chapters → lessons.
   Exam: 30 multiple-choice questions, 45 minutes, 1 mark each, pass 70% (21/30), pass/fail only.
   "w" on a group = exam questions in that area (ingredients and production 13 · styles 13 · storage, service and food 4);
   "w" on a chapter = our own estimate of how those questions spread, used only to weight practice and the mock exam.
   No exam-body or book names appear in the app text. */
window.TWG_B1 = {
  level: 1, track: "beer",
  exam: { questions: 30, minutes: 45, pass: 70, written: false, tasting: false },
  groups: [
    { k: "p", w: 13, n: { it: "Ingredienti e produzione", fr: "Ingrédients et production", en: "Ingredients and production", es: "Ingredientes y producción" }, c: ["b01", "b02", "b03", "b04", "b05"] },
    { k: "s", w: 13, n: { it: "Gli stili di birra", fr: "Les styles de bière", en: "Beer styles", es: "Los estilos de cerveza" }, c: ["b06", "b07", "b08", "b09", "b10", "b11"] },
    { k: "t", w: 4, n: { it: "Conservazione, servizio e cibo", fr: "Conservation, service et mets", en: "Storage, service and food", es: "Conservación, servicio y comida" }, c: ["b12", "b13", "b14"] }
  ],
  chapters: {
    /* ---------- ingredients and production (exam: 13 questions) ---------- */
    b01: { w: 2, n: { it: "Che cos'è la birra", fr: "Qu'est-ce que la bière ?", en: "What beer is", es: "Qué es la cerveza" },
      lessons: ["fermentation: sugar + yeast → alcohol + CO2 + aromas; abv and the scale low / medium / high / very high",
                "four ingredients: malt, water, hops, yeast and what each does", "starch conversion: enzymes from the malt turn starch into sugar"] },
    b02: { w: 3, n: { it: "Malto e altre fonti di zucchero", fr: "Malt et autres sources de sucre", en: "Malt and other sugar sources", es: "Malta y otras fuentes de azúcar" },
      lessons: ["grains (barley first) and the life of a grain: embryo, starch, husk", "malting: steeping, germination, kilning",
                "base malts vs speciality malts (kilned longer/hotter or roasted)", "other grains, sugars and syrups; the grain bill"] },
    b03: { w: 4, n: { it: "Le tappe della birrificazione", fr: "Les étapes du brassage", en: "The brewing steps", es: "Los pasos de la elaboración" },
      lessons: ["milling (grist) and mashing (mash, wort, spent grains); water", "wort boiling: safety, hops, rapid cooling; fermentation",
                "carbonation: from fermentation, added CO2, bottle-conditioning; packaging in cans, bottles, kegs"] },
    b04: { w: 2, n: { it: "Luppolo e altri aromi", fr: "Houblon et autres aromates", en: "Hops and other flavourings", es: "Lúpulo y otros aromatizantes" },
      lessons: ["the hop plant, cones, drying and pellets", "hop countries: traditional German, Czech, British vs American, New Zealand, Australian",
                "when hops go in: early for bitterness, late for aroma, dry hopping; other flavourings"] },
    b05: { w: 2, n: { it: "Il lievito", fr: "La levure", en: "Yeast", es: "La levadura" },
      lessons: ["ale yeast vs lager yeast", "Brettanomyces and lactic acid bacteria", "cultured yeast vs spontaneous fermentation"] },

    /* ---------- beer styles (exam: 13 questions) ---------- */
    b06: { w: 1, n: { it: "Degustare la birra", fr: "Déguster la bière", en: "Tasting beer", es: "Catar la cerveza" },
      lessons: ["preparing a tasting; the grid: appearance (clarity, colour, foam), nose, palate", "aromas by source: malt and grain, hops, yeast"] },
    b07: { w: 2, n: { it: "Stili di malto: solo malti base", fr: "Styles de malt : malts de base seuls", en: "Malt-driven styles: base malts only", es: "Estilos de malta: solo maltas base" },
      lessons: ["what base malts give; rice, maize and sugars lighten", "American or international pale lager, Munich helles, blonde ale"] },
    b08: { w: 3, n: { it: "Stili di malto: con malti speciali", fr: "Styles de malt : avec malts spéciaux", en: "Malt-driven styles: some speciality malts", es: "Estilos de malta: con maltas especiales" },
      lessons: ["Munich dunkel and brown ale", "porter and stout (imperial)", "barley wine"] },
    b09: { w: 3, n: { it: "Stili di luppolo", fr: "Styles de houblon", en: "Hop-driven styles", es: "Estilos de lúpulo" },
      lessons: ["two ways to be hoppy; traditional hops: Czech or German pilsner, bitter", "new-world hops: American pale ale, American IPA, hazy IPA"] },
    b10: { w: 3, n: { it: "Stili di lievito", fr: "Styles de levure", en: "Yeast-driven styles", es: "Estilos de levadura" },
      lessons: ["weissbier and witbier", "dubbel and tripel", "saison"] },
    b11: { w: 1, n: { it: "Stili acidi", fr: "Styles acides", en: "Sour styles", es: "Estilos ácidos" },
      lessons: ["where sourness comes from; Berliner weisse", "geuze and spontaneous fermentation"] },

    /* ---------- storage, service and food (exam: 4 questions) ---------- */
    b12: { w: 2, n: { it: "Conservazione e difetti", fr: "Conservation et défauts", en: "Storage and faults", es: "Conservación y defectos" },
      lessons: ["drink fresh, keep cool, protect from light, keep sealed", "faults: staling, light strike, bacterial infection"] },
    b13: { w: 1, n: { it: "Servire la birra", fr: "Servir la bière", en: "Serving beer", es: "Servir la cerveza" },
      lessons: ["glassware and clean glasses", "pouring from the keg and from the bottle (with or without sediment)", "service temperatures"] },
    b14: { w: 1, n: { it: "Birra e cibo", fr: "Bière et mets", en: "Beer and food", es: "Cerveza y comida" },
      lessons: ["preferences; the primary interactions", "high-bitterness, high-acidity and high-alcohol styles; intensity and aromas"] }
  },
  tastings: { min: 6, suggest: ["international pale lager or Munich helles", "porter or stout", "Czech or German pilsner", "American IPA", "weissbier or tripel", "Berliner weisse or geuze"] },
  grid: {
    clarity: ["clear", "hazy", "opaque"],
    colour: ["straw", "gold", "amber", "copper", "brown", "black"],
    aromaFamilies: ["malt and grain", "hops", "yeast", "other"],
    palateNotes: ["intensity", "carbonation", "body", "alcohol", "bitterness", "sweetness", "acidity"]
  },
  ui: {
    tab_study: ["Birra 1", "Bière 1", "Beer 1", "Cerveza 1"],
    l2Title: ["Esame Birra 1", "Examen Bière 1", "Beer 1 exam", "Examen Cerveza 1"],
    l2Intro: ["Lezioni, quiz e flashcard su ingredienti, birrificazione, stili e servizio della birra.", "Leçons, quiz et flashcards sur les ingrédients, le brassage, les styles et le service de la bière.", "Lessons, quizzes and flashcards on beer ingredients, brewing, styles and service.", "Lecciones, tests y tarjetas sobre ingredientes, elaboración, estilos y servicio de la cerveza."],
    l2FlD: ["Ripassa ingredienti, stili e termini della birra", "Révisez ingrédients, styles et termes de la bière", "Review beer ingredients, styles and terms", "Repasa ingredientes, estilos y términos de la cerveza"],
    l2RevT: ["Tutto Birra 1", "Tout Bière 1", "All of Beer 1", "Todo Cerveza 1"],
    l2RevI: ["Lezioni, flashcard ed errori: solo il programma di Birra 1.", "Leçons, flashcards et erreurs : uniquement le programme Bière 1.", "Lessons, flashcards and mistakes: only the Beer 1 syllabus.", "Lecciones, tarjetas y errores: solo el programa de Cerveza 1."],
    l2PlayT: ["Giochi di Birra 1", "Jeux Bière 1", "Beer 1 games", "Juegos de Cerveza 1"],
    l2PlayI: ["Giochi brevi sulle domande e sui termini di Birra 1.", "Des jeux courts sur les questions et les termes de Bière 1.", "Short games on Beer 1 questions and terms.", "Juegos cortos sobre preguntas y términos de Cerveza 1."],
    obHi: ["Ciao! Sono la tua capra della birra 🍺", "Bonjour ! Je suis votre chèvre de la bière 🍺", "Hi! I'm your beer goat 🍺", "¡Hola! Soy tu cabra de la cerveza 🍺"],
    obHiP: ["Ti preparo un percorso su misura per passare l'esame Birra 1. Bastano 5 domande veloci.", "Je vous prépare un parcours sur mesure pour réussir l'examen Bière 1. Il suffit de 5 questions rapides.", "I'll build you a tailor-made path to pass your Beer 1 exam. It takes 5 quick questions.", "Te preparo un recorrido a medida para aprobar el examen Cerveza 1. Bastan 5 preguntas rápidas."]
  },
  formats: {
    question: "{id, c:chapter, q:[it,fr,en,es], o:[[it,fr,en,es] ×4, first = correct], e:[it,fr,en,es] short why, d:[it,fr,en,es] distractor note}",
    lesson: "{c:chapter, t:[it,fr,en,es] title, p:[[it,fr,en,es] paragraphs], keys:[[it,fr,en,es] key points]}",
    flash: "{c:chapter, f:[it,fr,en,es] front, b:[it,fr,en,es] back}"
  }
};
