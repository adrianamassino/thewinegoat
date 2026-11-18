/* The Wine Goat — Spirits Level 1 structure (checked against the 2016/2017 specification and the 2021/2022 course
   workbook, which is newer: XO = 10+ years, aromatised wines and cocktail families added, bar tools no longer covered). Same engines as wine Levels 1–2: groups → chapters → lessons; every item carries a chapter id.
   Exam: 30 multiple-choice questions, 45 minutes, pass 70% (no grades above pass).
   "w" on a group = exam questions in that area (5 / 20 / 5 in the specification); "w" on a chapter = our own estimate of how
   those questions spread, used only to weight practice and the mock exam.
   No exam-body or book names appear in the app text. */
window.TWG_S1 = {
  level: 1, track: "spirits",
  exam: { questions: 30, minutes: 45, pass: 70, written: false, tasting: false, trueFalse: true },
  groups: [
    { k: "p", w: 5, n: { it: "Come si fa un distillato", fr: "Comment on fait un spiritueux", en: "How a spirit is made", es: "Cómo se hace un destilado" }, c: ["p1", "p2"] },
    { k: "s", w: 20, n: { it: "Le grandi famiglie di distillati", fr: "Les grandes familles de spiritueux", en: "The main spirit families", es: "Las grandes familias de destilados" }, c: ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"] },
    { k: "t", w: 5, n: { it: "Degustare e miscelare", fr: "Déguster et mélanger", en: "Taste and mix", es: "Catar y mezclar" }, c: ["t1", "t2", "t3"] }
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
      lessons: ["grapes from a defined area north of Bordeaux; pressed and fermented straight away", "double distillation in pot stills, required by law",
                "at least two years in oak; most are blends, often with caramel and a little sugar", "age terms: VS (2+ years), VSOP (4+ years), XO (10+ years)"] },
    s2: { w: 2, n: { it: "Vodka", fr: "Vodka", en: "Vodka", es: "Vodka" },
      lessons: ["any raw material, anywhere (grains and potatoes for premium vodka)", "neutral spirit: 95–96% abv, column still; unaged, bottled around 40%",
                "neutral style vs vodka with a little character"] },
    s3: { w: 3, n: { it: "Whisky scozzese", fr: "Whisky écossais", en: "Scotch whisky", es: "Whisky escocés" },
      lessons: ["grain → malting → crushing → warm water: enzymes turn starch into sugar", "all Scotch: distilled and aged 3+ years in Scotland",
                "single malt: 100% malted barley, pot stills, one distillery; peat smoke in a few", "blended Scotch: malt + grain whisky from several distilleries; grain whisky is column-distilled and light"] },
    s4: { w: 3, n: { it: "Whiskey americano e altri whisky", fr: "Whiskey américain et autres whiskies", en: "American and other whiskies", es: "Whiskey americano y otros whiskies" },
      lessons: ["Bourbon: 51%+ corn, low-strength column distillation, new charred oak; anywhere in the USA (Kentucky leads)", "Tennessee: like Bourbon plus maple charcoal filtering before the barrel",
                "Rye: 51%+ rye, spicy and peppery", "Ireland (pot + column blends; unmalted barley), Canada (many grains, rye signature), Japan (Scottish model)"] },
    s5: { w: 3, n: { it: "Rum dei Caraibi", fr: "Rhum des Caraïbes", en: "Caribbean rum", es: "Ron del Caribe" },
      lessons: ["cane juice (grassy; rhum agricole from Martinique and Guadeloupe) vs molasses (caramel, brown sugar)", "fermentation can build tropical fruit (Jamaica)",
                "pot still or short column for character; tall column for light rums (Cuba, Puerto Rico)", "aged or unaged; charcoal filtering for white aged rum; blending; sugar and caramel in some countries"] },
    s6: { w: 2, n: { it: "Tequila", fr: "Tequila", en: "Tequila", es: "Tequila" },
      lessons: ["blue agave from named Mexican states; cores cooked in ovens, then crushed", "51%+ agave sugars; '100% agave' = agave only",
                "best: double pot distilled to a low strength", "blanco/silver and joven/oro (unaged); reposado (2–12 months) and añejo (12+ months)"] },
    s7: { w: 3, n: { it: "Distillati aromatizzati e liquori", fr: "Spiritueux aromatisés et liqueurs", en: "Flavoured spirits and liqueurs", es: "Destilados aromatizados y licores" },
      lessons: ["usually a bought-in neutral spirit; three ways to add flavour: redistillation, maceration, flavourings", "flavoured vodka; gin (juniper first; London Dry = flavour added by redistillation, made anywhere)",
                "bitter spirits and cocktail bitters; spiced rum", "liqueurs: flavoured and sweetened by law, any flavour (even cream), often coloured"] },
    s8: { w: 1, n: { it: "Vini aromatizzati", fr: "Vins aromatisés", en: "Aromatised wines", es: "Vinos aromatizados" },
      lessons: ["four parts: base wine, flavourings with something bitter, sugar, a little spirit (caramel optional)", "vermouth: white wine base + wormwood; France and Italy; even 'dry' has some sugar"] },

    /* ---------- tasting and mixing (exam: 5 questions) ---------- */
    t1: { w: 1, n: { it: "Degustare un distillato", fr: "Déguster un spiritueux", en: "Tasting a spirit", es: "Catar un destilado" },
      lessons: ["the right conditions and glass", "small sample, look and smell, add the same amount of water, smell again, taste, spit",
                "colour, nose intensity, aromas by source, palate, finish"] },
    t2: { w: 1, n: { it: "Il cocktail equilibrato", fr: "Le cocktail équilibré", en: "A balanced cocktail", es: "El cóctel equilibrado" },
      lessons: ["strong vs weak: base spirit vs dilution, juices, sodas", "sweet vs bitter and/or sour: syrups and liqueurs vs citrus and bitters",
                "short drinks vs long drinks"] },
    t3: { w: 3, n: { it: "Famiglie di cocktail", fr: "Familles de cocktails", en: "Cocktail families", es: "Familias de cócteles" },
      lessons: ["spirit-forward: Old Fashioned, Sazerac, Rusty Nail, Manhattan, Martini, Negroni (and the Alexander)", "short sour: Pisco Sour, Whiskey Sour, Daiquiri; Sidecar, Margarita, Clover Club",
                "highball: Cuba Libre, Greyhound, Horse's Neck, Americano", "long sour: Tom Collins, Paloma, French 75, Mojito, Singapore Sling"] }
  },
  /* course tastings: about nine benchmark spirits — used by "My spirits" and the tasting game (simple 4-step grid) */
  tastings: { min: 9, suggest: ["vodka", "VS Cognac", "VSOP or XO Cognac", "Blended Scotch", "straight Bourbon", "white rum", "golden rum", "blanco Tequila 100% agave", "London Dry Gin", "a liqueur", "a vermouth"] },
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
