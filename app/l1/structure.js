/* The Wine Goat — Level 1 structure (content to be filled from the course material).
   Same engines as Level 3: groups → chapters → lessons; every item carries a chapter id.
   Exam: 30 multiple-choice questions, 45 minutes, pass 70%. "w" = exam questions per area (out of 30).
   No exam-body or book names appear in the app text. */
window.TWG_L1 = {
  level: 1,
  exam: { questions: 30, minutes: 45, pass: 70, written: false, tasting: false, trueFalse: true },
  groups: [
    { k: "p", w: 6, n: { it: "Dalla vigna al vino", fr: "De la vigne au vin", en: "From vine to wine", es: "De la viña al vino" }, c: ["p1", "p2"] },
    { k: "w", w: 18, n: { it: "Tipi, stili e vitigni", fr: "Types, styles et cépages", en: "Types, styles and grapes", es: "Tipos, estilos y uvas" }, c: ["w1", "w2", "w3", "w4", "w5"] },
    { k: "t", w: 6, n: { it: "Conservare, servire, abbinare", fr: "Conserver, servir, accorder", en: "Store, serve, pair", es: "Conservar, servir, maridar" }, c: ["t1", "t2", "t3"] }
  ],
  chapters: {
    /* ---------- from vine to wine (exam: 6 questions) ---------- */
    p1: { w: 3, n: { it: "L'uva, la vite e il clima", fr: "Le raisin, la vigne et le climat", en: "Grapes, vines and climate", es: "La uva, la vid y el clima" },
      lessons: ["parts of a grape: skin (colour, tannin), pulp (water, sugar, acid)", "the vine's year: flowering, ripening",
                "what happens as grapes ripen", "cool climate vs warm climate grapes"] },
    p2: { w: 3, n: { it: "Come si fa il vino", fr: "Comment on fait le vin", en: "How wine is made", es: "Cómo se hace el vino" },
      lessons: ["alcoholic fermentation: sugar + yeast → alcohol + carbon dioxide", "white wine: crushing, pressing, fermentation, maturation, bottling",
                "red wine: crushing, fermentation, draining, pressing, maturation, bottling", "rosé wine: crushing, fermentation, draining, maturation, bottling"] },

    /* ---------- types, styles and grapes (exam: 18 questions) ---------- */
    w1: { w: 4, n: { it: "Tipi e stili di vino", fr: "Types et styles de vins", en: "Types and styles of wine", es: "Tipos y estilos de vino" },
      lessons: ["still, sparkling, fortified", "colour: white, red, rosé", "structure: sweetness, acidity, tannin, alcohol, body",
                "aromas and flavours: fruit, oak, other", "a style = the sum of these characteristics"] },
    w2: { w: 4, n: { it: "I quattro bianchi principali", fr: "Les quatre grands blancs", en: "The four key white grapes", es: "Las cuatro grandes blancas" },
      grapes: ["Chardonnay", "Sauvignon Blanc", "Pinot Grigio", "Riesling"] },
    w3: { w: 4, n: { it: "I quattro rossi principali", fr: "Les quatre grands rouges", en: "The four key black grapes", es: "Las cuatro grandes tintas" },
      grapes: ["Cabernet Sauvignon", "Merlot", "Pinot Noir", "Syrah / Shiraz"] },
    w4: { w: 3, n: { it: "Vini famosi dai vitigni principali", fr: "Vins célèbres des grands cépages", en: "Famous wines from the key grapes", es: "Vinos famosos de las uvas principales" },
      wines: { white: ["Sancerre", "Chablis", "Burgundy (white)"], red: ["Burgundy (red)", "Bordeaux"], sparkling: ["Champagne"] } },
    w5: { w: 3, n: { it: "Altri vini da conoscere", fr: "Autres vins à connaître", en: "Other wines to know", es: "Otros vinos que conocer" },
      wines: { white: ["Sauternes"], rose: ["White Zinfandel"], red: ["Beaujolais", "Côtes du Rhône", "Chianti", "Rioja", "Châteauneuf-du-Pape"],
               sparkling: ["Prosecco", "Cava"], fortified: ["Sherry", "Port"] } },

    /* ---------- store, serve, pair (exam: 6 questions) ---------- */
    t1: { w: 3, n: { it: "Conservare e servire il vino", fr: "Conserver et servir le vin", en: "Storing and serving wine", es: "Conservar y servir el vino" },
      lessons: ["storage: temperature, light, bottle position", "keeping opened wine: vacuum and blanket (inert gas) systems",
                "service temperatures: sparkling and sweet well chilled; light/medium whites and rosés chilled; full whites lightly chilled; light reds lightly chilled; medium/full reds room temperature",
                "opening still and sparkling wine", "glassware; checking appearance and nose before serving"] },
    t2: { w: 3, n: { it: "Cibo e vino", fr: "Mets et vins", en: "Food and wine", es: "Comida y vino" },
      lessons: ["food components: sweetness, umami, salt, acidity, flavour intensity, fat, chilli heat",
                "what they do to wine: sweetness, acidity, bitterness (tannin, oak), fruitiness, alcohol"] },
    t3: { w: 0, n: { it: "Degustare: i primi passi", fr: "Déguster : premiers pas", en: "Tasting: first steps", es: "Catar: primeros pasos" },
      lessons: ["appearance: colour", "nose: fruit, oak, other", "palate: sweetness, acidity, tannin, alcohol, body; flavours"] }
  },
  /* suggested first tasting flight (for "My wines") */
  tastings: [["light, high-acid unoaked Sauvignon Blanc", "full-bodied oaked Chardonnay", "light unoaked Pinot Noir", "medium-bodied oaked Merlot",
              "full-bodied, highly oaked Cabernet Sauvignon", "Sauternes"]],
  formats: {
    question: "{id, c:chapter, q:[it,fr,en], o:[[it,fr,en] ×4 or ×2 for true/false, first = correct], e:[it,fr,en] short why}",
    lesson: "{c:chapter, t:[it,fr,en] title, p:[[it,fr,en] paragraphs], keys:[[it,fr,en] key points]}",
    flash: "{c:chapter, f:[it,fr,en] front, b:[it,fr,en] back}"
  }
};
