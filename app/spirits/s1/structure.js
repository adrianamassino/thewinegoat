/* The Wine Goat — Spirits Level 1 structure (checked against the 2016/2017 issue of the course specification).
   Content still to be written. Same engines as wine Levels 1–2: groups → chapters → lessons; every item carries a chapter id.
   Exam: 30 multiple-choice questions, 45 minutes, pass 70% (no grades above pass).
   "w" on a group = exam questions in that area (official split 5 / 20 / 5); "w" on a chapter = our own estimate of how
   those questions spread, used only to weight practice and the mock exam.
   No exam-body or book names appear in the app text. */
window.TWG_S1 = {
  level: 1, track: "spirits",
  exam: { questions: 30, minutes: 45, pass: 70, written: false, tasting: false, trueFalse: true },
  groups: [
    { k: "p", w: 5, n: { it: "Come si fa un distillato", fr: "Comment on fait un spiritueux", en: "How a spirit is made", es: "Cómo se hace un destilado" }, c: ["p1", "p2"] },
    { k: "s", w: 20, n: { it: "Le grandi famiglie di distillati", fr: "Les grandes familles de spiritueux", en: "The main spirit families", es: "Las grandes familias de destilados" }, c: ["s1", "s2", "s3", "s4", "s5", "s6", "s7"] },
    { k: "t", w: 5, n: { it: "Conservare, servire, miscelare", fr: "Conserver, servir, mélanger", en: "Store, serve, mix", es: "Conservar, servir, mezclar" }, c: ["t1", "t2", "t3"] }
  ],
  chapters: {
    /* ---------- how a spirit is made (exam: 5 questions) ---------- */
    p1: { w: 3, n: { it: "I quattro passaggi e gli alambicchi", fr: "Les quatre étapes et les alambics", en: "Four steps and two stills", es: "Los cuatro pasos y los alambiques" },
      lessons: ["four steps: prepare the raw material, ferment, distil, finish after distillation", "fermentation makes the alcohol; distillation concentrates it",
                "pot still: one batch at a time, lower strength, more flavour", "column still: runs continuously; low strength = flavourful, high strength = light or neutral"] },
    p2: { w: 2, n: { it: "Gusto, dolcezza e colore", fr: "Goût, douceur et couleur", en: "Flavour, sweetness and colour", es: "Sabor, dulzor y color" },
      lessons: ["where flavour comes from: raw material, fermentation, distillation strength", "unaged vs aged in new or used oak",
                "blending for consistency and complexity; redistillation, maceration, added flavourings; dilution with water",
                "sweetness comes from added sugar", "colour: oak, caramel, other natural or artificial colours"] },

    /* ---------- the main spirit families (exam: 20 questions) ---------- */
    s1: { w: 3, n: { it: "Cognac", fr: "Cognac", en: "Cognac", es: "Coñac" },
      lessons: ["grapes from a defined area; double distillation in pot stills", "at least two years in oak; often lightly sweetened",
                "age terms: VS (2+ years), VSOP (4+ years), XO"] },
    s2: { w: 2, n: { it: "Vodka", fr: "Vodka", en: "Vodka", es: "Vodka" },
      lessons: ["any raw material (grain and potato are the classics)", "distilled to around 95–96% abv, so very neutral; not aged"] },
    s3: { w: 4, n: { it: "Whisky scozzese", fr: "Whisky écossais", en: "Scotch whisky", es: "Whisky escocés" },
      lessons: ["malting barley so its starch can become sugar", "single malt: barley only, pot stills, made and aged in Scotland, 3+ years, peat optional",
                "blended Scotch: malt + grain whisky, 3+ years in Scotland", "label words: single, malt, blended"] },
    s4: { w: 4, n: { it: "Whiskey americano e altri whisky", fr: "Whiskey américain et autres whiskies", en: "American and other whiskies", es: "Whiskey americano y otros whiskies" },
      lessons: ["Bourbon: 51%+ corn, new oak barrels, anywhere in the USA (Kentucky leads)", "Tennessee: made only in Tennessee, charcoal filtering, new oak",
                "Rye: 51%+ rye, new oak", "other whisky countries: Ireland, Canada, Japan"] },
    s5: { w: 3, n: { it: "Rum dei Caraibi", fr: "Rhum des Caraïbes", en: "Caribbean rum", es: "Ron del Caribe" },
      lessons: ["from sugar cane juice or molasses", "pot still and column still rums; blending", "white, golden and dark; colour and sugar may be added"] },
    s6: { w: 2, n: { it: "Tequila", fr: "Tequila", en: "Tequila", es: "Tequila" },
      lessons: ["blue agave from a defined area; cooked to make sugar; usually distilled to a low strength",
                "Tequila vs Tequila 100% agave", "blanco/silver, oro/joven/gold, reposado, añejo"] },
    s7: { w: 2, n: { it: "Distillati aromatizzati e liquori", fr: "Spiritueux aromatisés et liqueurs", en: "Flavoured spirits and liqueurs", es: "Destilados aromatizados y licores" },
      lessons: ["spiced rum and flavoured vodka", "gin: juniper must lead the flavour", "liqueurs: always sweetened, often coloured, on a neutral or characterful base"] },

    /* ---------- store, serve, mix (exam: 5 questions) ---------- */
    t1: { w: 1, n: { it: "Conservare i distillati", fr: "Conserver les spiritueux", en: "Storing spirits", es: "Conservar los destilados" },
      lessons: ["ideal conditions", "what poor storage does"] },
    t2: { w: 2, n: { it: "Attrezzi e bicchieri", fr: "Matériel et verres", en: "Bar tools and glasses", es: "Utensilios y vasos" },
      lessons: ["jigger, pourer, muddler, Boston shaker, bar spoon, mixing glass", "strainers: Hawthorne, julep, fine sieve",
                "glasses: cocktail/Martini, Margarita, tumbler/Old Fashioned, highball/Collins, shot"] },
    t3: { w: 2, n: { it: "Il cocktail equilibrato", fr: "Le cocktail équilibré", en: "A balanced cocktail", es: "El cóctel equilibrado" },
      lessons: ["key ingredients: fresh juices, simple syrup, bitters", "balance four things: strong, weak, sour/bitter, sweet"] }
  },
  /* course tastings: about nine benchmark spirits — used by "My spirits" and the tasting game (simple 4-step grid) */
  tastings: { min: 9, suggest: ["vodka", "VS Cognac", "VSOP or XO Cognac", "Blended Scotch", "straight Bourbon", "white rum", "golden rum", "blanco Tequila 100% agave", "London Dry Gin", "a liqueur"] },
  /* simple tasting grid (our own wording of the course grid): colour → nose intensity + aromas → palate flavours, sweetness, texture → finish */
  grid: {
    colour: ["colourless", "lemon", "gold", "amber", "brown", "other (pink, red, orange, yellow, green, blue, purple, black)"],
    noseIntensity: ["neutral", "light", "medium", "pronounced"],
    aromaFamilies: ["fruity", "floral", "vegetable", "grain", "spice", "herb", "oak"],
    finishLength: ["short", "medium", "long"],
    finishNature: ["neutral", "simple", "some complexity", "very complex"]
  },
  formats: {
    question: "{id, c:chapter, q:[it,fr,en,es], o:[[it,fr,en,es] ×4 or ×2 for true/false, first = correct], e:[it,fr,en,es] short why, d:[it,fr,en,es] distractor note}",
    lesson: "{c:chapter, t:[it,fr,en,es] title, p:[[it,fr,en,es] paragraphs], keys:[[it,fr,en,es] key points]}",
    flash: "{c:chapter, f:[it,fr,en,es] front, b:[it,fr,en,es] back}"
  }
};
