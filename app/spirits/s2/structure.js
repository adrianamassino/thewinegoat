/* The Wine Goat — Spirits Level 2 structure (checked against the current issue of the course specification and the 2017 tasting grid).
   Content still to be written. Same engines as wine Levels 1–2: groups → chapters → lessons; every item carries a chapter id.
   Exam: 50 multiple-choice questions, 60 minutes. Pass 55%, Merit 70%, Distinction 85%.
   "w" on a group = exam questions in that area (official split 14 / 23 / 7 / 6); "w" on a chapter = our own estimate.
   No exam-body or book names appear in the app text. */
window.TWG_S2 = {
  level: 2, track: "spirits",
  exam: { questions: 50, minutes: 60, pass: 55, merit: 70, distinction: 85, written: false, tasting: false, trueFalse: false },
  groups: [
    { k: "p", w: 14, n: { it: "Produzione dei distillati", fr: "Production des spiritueux", en: "Spirits production", es: "Producción de destilados" }, c: ["p1", "p2", "p3", "p4", "p5"] },
    { k: "s", w: 23, n: { it: "I principali distillati del mondo", fr: "Les grands spiritueux du monde", en: "The principal spirits", es: "Los principales destilados" }, c: ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"] },
    { k: "f", w: 7, n: { it: "Aromatizzati, liquori e vini aromatizzati", fr: "Aromatisés, liqueurs et vins aromatisés", en: "Flavoured spirits, liqueurs, aromatised wines", es: "Aromatizados, licores y vinos aromatizados" }, c: ["f1", "f2", "f3", "f4"] },
    { k: "t", w: 6, n: { it: "Il bar e i cocktail", fr: "Le bar et les cocktails", en: "The bar and cocktails", es: "La barra y los cócteles" }, c: ["t1", "t2", "t3", "t0"] }
  ],
  chapters: {
    /* ---------- spirits production (exam: 14 questions) ---------- */
    p1: { w: 3, n: { it: "Materie prime e fermentazione", fr: "Matières premières et fermentation", en: "Raw materials and fermentation", es: "Materias primas y fermentación" },
      lessons: ["the four stages of making a spirit", "what a raw material gives the distiller: carbohydrates and congeners",
                "starch (grains, potato) and inulin (agave) must become sugar first", "fermentation: sugar + yeast → alcohol + carbon dioxide, plus congeners"] },
    p2: { w: 3, n: { it: "Principi della distillazione", fr: "Principes de la distillation", en: "How distillation works", es: "Cómo funciona la destilación" },
      lessons: ["concentrating ethanol and choosing which congeners to keep", "heat, condense, separate: heads, hearts, tails, liquid waste",
                "higher distillation strength = less aroma"] },
    p3: { w: 3, n: { it: "L'alambicco discontinuo", fr: "L'alambic à repasse", en: "The pot still", es: "El alambique discontinuo" },
      lessons: ["parts: heat source, pot, drain, swan neck, still head, lyne arm, condenser", "first distillation → low wines; second distillation → cut into heads, hearts, tails",
                "heads and tails go back into the next batch", "result: medium to pronounced aroma"] },
    p4: { w: 2, n: { it: "La colonna", fr: "La colonne", en: "The column still", es: "La columna" },
      lessons: ["parts: heat source, plates, downcomers, bubble caps", "many distillations at once, running non-stop",
                "result: anything from neutral to pronounced"] },
    p5: { w: 3, n: { it: "Dopo la distillazione", fr: "Après la distillation", en: "After distillation", es: "Después de la destilación" },
      lessons: ["oak or inert vessels (steel, glass); oak age, previous contents, warehouse temperature", "adding other flavours: redistillation, maceration, flavourings",
                "blending for consistency and complexity", "finishing: water, colour in or out, sweetness, filtration"] },

    /* ---------- the principal spirits (exam: 23 questions) ---------- */
    s1: { w: 4, n: { it: "Distillati di frutta: Cognac e Armagnac", fr: "Eaux-de-vie de fruits : Cognac et Armagnac", en: "Fruit spirits: Cognac and Armagnac", es: "Destilados de fruta: Coñac y Armañac" },
      lessons: ["processing grapes, apples, pears and pomace (white vs black grape skins)", "Cognac: Ugni Blanc, double pot distillation, 2+ years in oak; crus and age terms (VS, VSOP, XO, Napoléon, Hors d'âge)",
                "Armagnac: Ugni Blanc, Folle Blanche, Baco; column or pot; Bas Armagnac, Ténarèze; Blanche and vintage"] },
    s2: { w: 2, n: { it: "Calvados, Grappa e Pisco", fr: "Calvados, Grappa et Pisco", en: "Calvados, Grappa and Pisco", es: "Calvados, Grappa y Pisco" },
      lessons: ["Calvados: apples and pears, pot or column, oak aged", "Grappa: Italian grape pomace, usually unaged", "Pisco (Chile and Peru): aromatic grapes, usually unaged"] },
    s3: { w: 4, n: { it: "Whiskey americano", fr: "Whiskey américain", en: "American whiskey", es: "Whiskey americano" },
      lessons: ["turning grain starch into sugar: malted barley vs cooked grains", "Bourbon: 51%+ corn, low-strength distillation, charred new oak",
                "Tennessee: Lincoln County Process (charcoal filtering)", "Rye whiskey", "label words: straight, proof, sour mash, single barrel, small batch"] },
    s4: { w: 4, n: { it: "Whisky scozzese", fr: "Whisky écossais", en: "Scotch whisky", es: "Whisky escocés" },
      lessons: ["3+ years in oak in Scotland", "malt whisky: 100% malted barley, pot stills, ex-Bourbon and ex-Sherry casks, wood finishes",
                "grain whisky and Blended Scotch", "label words: single, age statement, non-chill filtered, cask strength",
                "regions: Islay, Campbeltown, Highland, Speyside, Lowland"] },
    s5: { w: 2, n: { it: "Whisky di Irlanda, Canada e Giappone", fr: "Whiskies d'Irlande, du Canada et du Japon", en: "Irish, Canadian and Japanese whisky", es: "Whisky de Irlanda, Canadá y Japón" },
      lessons: ["Canada: blends of corn and flavouring whiskies; Canadian Rye", "Ireland: blends and malts; triple pot distillation", "Japan: malt, grain and blended whiskies"] },
    s6: { w: 3, n: { it: "Rum", fr: "Rhum", en: "Rum", es: "Ron" },
      lessons: ["cane juice vs molasses", "pot and column; light and heavy marks; aged or unaged; colour, filtration, sugar",
                "white, golden/amber, dark", "traditions: Spanish (Cuba, Panama…), French (Martinique, Guadeloupe), British (Barbados, Jamaica, Guyana), Brazil",
                "label words: age statements, rhum agricole, cachaça, overproof"] },
    s7: { w: 2, n: { it: "Tequila e Mezcal", fr: "Tequila et Mezcal", en: "Tequila and Mezcal", es: "Tequila y Mezcal" },
      lessons: ["agave: inulin → sugar by steaming or roasting the piña", "Tequila: blue agave, Jalisco and named states; 100% agave; blanco, joven/oro, reposado, añejo, extra añejo; abocado",
                "Mezcal: espadín and other agaves, Oaxaca; roasting; Mezcal, Artisanal, Ancestral"] },
    s8: { w: 2, n: { it: "Vodka", fr: "Vodka", en: "Vodka", es: "Vodka" },
      lessons: ["any raw material; converting starch with enzymes or malt", "neutral spirit at 95% (USA) or 96% (EU) in a column; charcoal filtration; additives",
                "neutral vs characterful; traditional countries: Poland, Russia, Sweden, Finland"] },

    /* ---------- flavoured spirits, liqueurs, aromatised wines (exam: 7 questions) ---------- */
    f1: { w: 3, n: { it: "Gin", fr: "Gin", en: "Gin", es: "Ginebra" },
      lessons: ["botanicals: juniper first, then coriander, citrus peel, angelica, orris", "base spirit in the EU vs the USA",
                "three ways to redistil with botanicals: steep, basket, distil separately and blend", "London Dry, Distilled Gin, Old Tom"] },
    f2: { w: 2, n: { it: "Altri aromatizzati: anice, amari, rum speziato, vodka aromatizzata", fr: "Autres aromatisés : anisés, amers, rhum épicé, vodka aromatisée", en: "Other flavoured spirits", es: "Otros aromatizados" },
      lessons: ["natural vs artificial flavour and colour", "spiced rum; flavoured vodka (traditional and modern)",
                "aniseed spirits: anethole from aniseed, star anise, fennel; pastis and absinthe", "bitters: quinine, gentian, bitter orange; aperitif, digestif, cocktail"] },
    f3: { w: 1, n: { it: "Liquori", fr: "Liqueurs", en: "Liqueurs", es: "Licores" },
      lessons: ["neutral or characterful base; any flavouring, cream included", "always sweetened; colour optional"] },
    f4: { w: 1, n: { it: "Vini aromatizzati: il vermouth", fr: "Vins aromatisés : le vermouth", en: "Aromatised wines: vermouth", es: "Vinos aromatizados: el vermut" },
      lessons: ["dry base wine + alcohol + botanical extracts + sugar (+ caramel)", "blending the ingredients"] },

    /* ---------- the bar and cocktails (exam: 6 questions) ---------- */
    t1: { w: 2, n: { it: "Postazione, attrezzi e bicchieri", fr: "Poste de travail, matériel et verres", en: "Workstation, tools and glassware", es: "Estación, utensilios y cristalería" },
      lessons: ["the workstation: ice well, speed rail, sink, drip mat", "tools: jigger, shaker, mixing glass, strainers, muddler, peeler, channel knife, ice scoop and tongs…",
                "glasses: balloon, tumbler, coupe, Martini, Margarita, highball, sling, hurricane, Mule mug, julep cup, toddy, tiki mug"] },
    t2: { w: 1, n: { it: "Ingredienti ed equilibrio", fr: "Ingrédients et équilibre", en: "Ingredients and balance", es: "Ingredientes y equilibrio" },
      lessons: ["fresh juice, simple and flavoured syrups, bitters, garnishes, cubed and crushed ice", "balance: strong, weak, sour/bitter, sweet"] },
    t3: { w: 3, n: { it: "Famiglie di cocktail", fr: "Familles de cocktails", en: "Cocktail families", es: "Familias de cócteles" },
      lessons: ["highball: Cuba Libre, Moscow Mule", "sour: Pisco Sour, Whisky Sour, Daiquiri, Tommy's; Sidecar, Margarita, Cosmopolitan",
                "Collins: Tom, Vodka, Pierre Collins; Mojito, Paloma", "spirit-forward: Manhattan, Martini, Old Fashioned, Sazerac, Negroni; Rob Roy, wet and dirty Martini"] },
    t0: { w: 0, n: { it: "Degustare e valutare i distillati", fr: "Déguster et évaluer les spiritueux", en: "Tasting and judging spirits", es: "Catar y valorar destilados" },
      lessons: ["tasting conditions, glass, small sample, adding water", "appearance, nose, palate, finish: what each step tells you",
                "aromas by source: raw material, processing, oak and age", "judging quality: from faulty to outstanding"] }
  },
  /* course tastings: about 29 spirits — used by "My spirits" and the tasting game */
  tastings: { min: 29, suggest: ["VS, VSOP, XO Cognac", "Armagnac / Grappa / Pisco", "Tennessee, Bourbon, Rye", "two single malts + a blend", "Cuban-style white rum",
                                  "aged rum with rancio", "Tequila blanco + reposado/añejo", "artisanal Mezcal", "neutral and characterful vodka", "London Dry + modern gin", "two liqueurs"] },
  /* tasting grid levels (our own wording): appearance → nose → palate → finish → quality */
  grid: {
    clarity: ["clear", "hazy"], intensity: ["water-white", "pale", "medium", "deep", "opaque"],
    colour: ["colourless", "lemon", "gold", "amber", "brown", "other"], other: ["louching"],
    condition: ["clean", "unclean"], aroma: ["neutral", "light", "medium", "pronounced"],
    sweetness: ["dry", "off-dry", "medium", "sweet"], texture: ["rough", "smooth", "watery", "mouthfilling", "warming"],
    flavour: ["neutral", "light", "medium", "pronounced"], finishLength: ["short", "medium", "long"],
    finishNature: ["neutral", "simple", "some complexity", "very complex"],
    quality: ["faulty", "poor", "acceptable", "good", "very good", "outstanding"],
    aromaSources: ["raw material", "processing", "oak and maturation"]
  },
  formats: {
    question: "{id, c:chapter, q:[it,fr,en,es], o:[[it,fr,en,es] ×4, first = correct], e:[it,fr,en,es] short why, d:[it,fr,en,es] distractor note}",
    lesson: "{c:chapter, t:[it,fr,en,es] title, p:[[it,fr,en,es] paragraphs], keys:[[it,fr,en,es] key points]}",
    flash: "{c:chapter, f:[it,fr,en,es] front, b:[it,fr,en,es] back}"
  }
};
