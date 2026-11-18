/* The Wine Goat — Spirits Level 3 structure (checked against the February 2025 issue of the course specification
   and the 2019 tasting grid). Content still to be written.
   Two units, both must be passed:
     Unit 1 theory (2 h 10 min): Part 1 = 50 multiple-choice (pass 55%), Part 2 = 10 short written answers, 80 marks
       (6 × 5, 3 × 10, 1 × 20; pass 55%). Short answers cover only groups "p" and "s"; group "o" is multiple-choice only.
     Unit 2 tasting (30 min): 2 spirits served blind, 25 marks each (appearance 2, nose 5, palate 10, conclusions 8), pass 55%.
   Final grade = average of MCQ %, short-answer % and tasting %: Pass 55%, Merit 65%, Distinction 80% with no part under 65%.
   "w" on a group = MCQ marks (official 10 / 15 / 25); "w" on a chapter = our own estimate. "x: true" = a chapter that can
   be asked as an 'explain why' short answer. Same engines as wine Level 3: MCQ, open questions with model answers,
   tasting-note trainer. No exam-body or book names appear in the app text. */
window.TWG_S3 = {
  level: 3, track: "spirits",
  exam: {
    theory: { minutes: 130, mcq: { questions: 50, pass: 55, suggestMinutes: 40 },
              short: { marks: 80, split: [[6, 5], [3, 10], [1, 20]], pass: 55, suggestMinutes: 80, groups: ["p", "s"] } },
    tasting: { samples: 2, minutes: 30, marks: { appearance: 2, nose: 5, palate: 10, conclusions: 8 }, pass: 55 },
    grades: { pass: 55, merit: 65, distinction: 80, distinctionFloor: 65 },
    written: true, tasting: true
  },
  groups: [
    { k: "p", w: 10, n: { it: "Principi della produzione", fr: "Principes de production", en: "Principles of production", es: "Principios de producción" }, c: ["p1", "p2", "p3", "p4", "p5", "p6", "p7"] },
    { k: "s", w: 15, n: { it: "Distillati selezionati", fr: "Spiritueux sélectionnés", en: "Selected spirits", es: "Destilados seleccionados" }, c: ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "s12"] },
    { k: "o", w: 25, n: { it: "Gli altri distillati del mondo", fr: "Les autres spiritueux du monde", en: "Other spirits of the world", es: "Otros destilados del mundo" }, c: ["o1", "o2", "o3", "o4", "o5", "o6", "o7", "o8", "o9", "o10"] },
    { k: "t", w: 0, n: { it: "Degustazione alla cieca", fr: "Dégustation à l'aveugle", en: "Blind tasting", es: "Cata a ciegas" }, c: ["t1", "t2"] }
  ],
  chapters: {
    /* ---------- principles of production (MCQ 10 marks; short answers) ---------- */
    p1: { w: 1, x: false, n: { it: "Materie prime e carboidrati", fr: "Matières premières et glucides", en: "Raw materials and carbohydrates", es: "Materias primas y carbohidratos" },
      lessons: ["what carbohydrates are", "which sugars yeast can use and which need converting first"] },
    p2: { w: 2, x: true, n: { it: "Lieviti, fermentazione e batteri", fr: "Levures, fermentation et bactéries", en: "Yeast, fermentation and bacteria", es: "Levaduras, fermentación y bacterias" },
      lessons: ["what yeast need (temperature, nutrients, oxygen) and what they produce", "spoilage competitors; choosing a yeast",
                "sequential vs parallel conversion; liquid, semi-solid and solid-state fermentation", "short vs long fermentations and the flavour bacteria add"] },
    p3: { w: 2, x: true, n: { it: "Fondamenti della distillazione", fr: "Fondamentaux de la distillation", en: "Distillation fundamentals", es: "Fundamentos de la destilación" },
      lessons: ["key terms: fractions, congeners, vapour, highly rectified and neutral spirit", "boiling points and volatility; concentration and selection",
                "reflux and rectification; the fractions of a fermented liquid", "other flavour levers: Maillard reactions, esters, pressure, sulfur and copper"] },
    p4: { w: 1, x: true, n: { it: "Alambicchi discontinui", fr: "Alambics à repasse", en: "Pot stills", es: "Alambiques discontinuos" },
      lessons: ["heat sources and still design", "double distillation, step by step", "shaping style: what goes into the still and what is cut out",
                "pros and cons of pot stills"] },
    p5: { w: 1, x: true, n: { it: "Colonne e alambicchi ibridi", fr: "Colonnes et alambics hybrides", en: "Column and hybrid stills", es: "Columnas y alambiques híbridos" },
      lessons: ["plates, packed columns, condensers, controlling reflux", "making neutral spirit from ethanol and water",
                "a tall single column: stripping and rectifying sections; running continuously", "double and multi-column stills", "hybrid stills: how and why"] },
    p6: { w: 2, x: true, n: { it: "Conservazione e maturazione", fr: "Stockage et vieillissement", en: "Storage and maturation", es: "Almacenamiento y crianza" },
      lessons: ["how a barrel is made and what oak does", "size, toast/char, previous contents, refills (oak species: facts only, not 'explain')",
                "matching spirit to cask; warehouse location; re-casking and finishing; oak alternatives and other woods", "inert vessels: storing, resting, preserving"] },
    p7: { w: 1, x: true, n: { it: "Assemblaggio, aggiunte e confezionamento", fr: "Assemblage, ajouts et conditionnement", en: "Blending, additions and packaging", es: "Mezcla, adiciones y envasado" },
      lessons: ["blending for style, complexity and consistency", "filtration; adding colour, sweetness or texture; adjusting strength", "bottles and closures"] },

    /* ---------- selected spirits (MCQ 15 marks; short answers; also the blind-tasting list) ---------- */
    s1: { w: 1, x: true, n: { it: "Dall'amido allo zucchero", fr: "De l'amidon au sucre", en: "From starch to sugar", es: "Del almidón al azúcar" },
      lessons: ["how starch forms and the stages of conversion", "malting barley; distillers' and speciality malts", "cooking unmalted grains; working with potatoes",
                "Asian approach: moulds grown on grain"] },
    s2: { w: 2, x: true, n: { it: "Whisky scozzese", fr: "Whisky écossais", en: "Scotch whisky", es: "Whisky escocés" },
      lessons: ["making malt, grain and blended Scotch", "the rules for all Scotch and the five categories; other label terms",
                "style choices: barley and peat, fermentation, still shape and cuts, casks"] },
    s3: { w: 2, x: true, n: { it: "Whiskey americano", fr: "Whiskey américain", en: "American whiskey", es: "Whiskey americano" },
      lessons: ["making Bourbon, Tennessee and rye", "legal types and label terms", "style choices: mash bill, distillation, new charred oak, warehouses"] },
    s4: { w: 1, x: true, n: { it: "Lavorare la frutta e le vinacce", fr: "Travailler les fruits et le marc", en: "Processing fruit and pomace", es: "Procesar fruta y orujo" },
      lessons: ["crush–press–ferment vs macerate–distil", "difficulties with fresh fruit", "white vs black grape pomace"] },
    s5: { w: 2, x: true, n: { it: "Cognac e Armagnac", fr: "Cognac et Armagnac", en: "Cognac and Armagnac", es: "Coñac y Armañac" },
      lessons: ["grapes and fermentation", "Charentais double distillation vs the Armagnac column", "ageing and blending", "the rules for each", "style choices"] },
    s6: { w: 1, x: true, n: { it: "Lavorare la canna da zucchero", fr: "Travailler la canne à sucre", en: "Processing sugar cane", es: "Procesar la caña de azúcar" },
      lessons: ["juice, syrup, molasses, brown sugar; what affects their quality", "short vs long fermentation; esters",
                "pot stills with retorts; the agricole column; other columns", "ageing in the tropics and other finishing"] },
    s7: { w: 1, x: true, n: { it: "Rum dei Caraibi: Martinica, Guadalupa, Cuba, Giamaica", fr: "Rhums des Caraïbes : Martinique, Guadeloupe, Cuba, Jamaïque", en: "Caribbean rum: Martinique, Guadeloupe, Cuba, Jamaica", es: "Ron del Caribe: Martinica, Guadalupe, Cuba, Jamaica" },
      lessons: ["context and the rules", "Martinique and Guadeloupe", "Cuba", "Jamaica"] },
    s8: { w: 1, x: true, n: { it: "Coltivare e lavorare l'agave", fr: "Cultiver et travailler l'agave", en: "Growing and processing agave", es: "Cultivar y procesar el agave" },
      lessons: ["what agave is, how it grows, how it is harvested", "fructans; cooking (ovens, autoclaves, pits); crushing (tahona, shredders); diffusers"] },
    s9: { w: 1, x: true, n: { it: "Tequila e Mezcal", fr: "Tequila et Mezcal", en: "Tequila and Mezcal", es: "Tequila y Mezcal" },
      lessons: ["making Tequila and Mezcal", "the rules for each", "style choices (distillation is never an 'explain' question here)"] },
    s10: { w: 1, x: true, n: { it: "Vodka", fr: "Vodka", en: "Vodka", es: "Vodka" },
      lessons: ["making neutral spirit and vodka", "rules in the USA and the EU", "style choices: raw material, distillation, filtration and finishing"] },
    s11: { w: 1, x: true, n: { it: "Aromi e colori non dal legno", fr: "Arômes et couleurs hors bois", en: "Flavour and colour from outside the cask", es: "Aromas y colores sin madera" },
      lessons: ["types of flavourings", "adding botanicals: maceration, percolation, redistillation", "other and animal flavourings", "natural and artificial colours"] },
    s12: { w: 1, x: true, n: { it: "Gin", fr: "Gin", en: "Gin", es: "Ginebra" },
      lessons: ["base spirit and finishing", "rules in the USA and the EU", "style choices: botanical recipe, redistillation, what happens afterwards"] },

    /* ---------- other spirits of the world (MCQ 25 marks; never in short answers) ---------- */
    o1: { w: 3, n: { it: "Altri whiskey americani; Irlanda, Canada, Giappone", fr: "Autres whiskeys américains ; Irlande, Canada, Japon", en: "Other American whiskeys; Ireland, Canada, Japan", es: "Otros whiskeys americanos; Irlanda, Canadá, Japón" },
      lessons: ["wheat, malt and corn whiskey", "Irish whiskey: making it, the rules, the types", "Canadian whisky: making it, the rules, the styles", "Japanese whisky: making it, law and identity, styles"] },
    o2: { w: 2, n: { it: "Shōchū", fr: "Shōchū", en: "Shōchū", es: "Shōchū" },
      lessons: ["column vs pot-distilled shōchū (honkaku, awamori)", "the rules", "styles"] },
    o3: { w: 3, n: { it: "Baijiu", fr: "Baijiu", en: "Baijiu", es: "Baijiu" },
      lessons: ["overview: raw material, solid-state fermentation, distillation, ageing", "qu and traditional stills",
                "strong, sauce, light and rice aroma styles"] },
    o4: { w: 1, n: { it: "Soju", fr: "Soju", en: "Soju", es: "Soju" },
      lessons: ["diluted soju and what shapes its style", "distilled soju and its styles"] },
    o5: { w: 3, n: { it: "Altri distillati di frutta", fr: "Autres eaux-de-vie de fruits", en: "Other fruit spirits", es: "Otros destilados de fruta" },
      lessons: ["Brandy de Jerez", "Pisco from Peru and Chile", "South African brandy", "Grappa", "Calvados (label terms not tested)", "other European fruit spirits"] },
    o6: { w: 3, n: { it: "Altri rum e la cachaça", fr: "Autres rhums et la cachaça", en: "Other rums and cachaça", es: "Otros rones y la cachaça" },
      lessons: ["Haiti, Puerto Rico, Barbados, Trinidad and Tobago, Guyana", "Central America, Colombia, Venezuela; blended rums", "Brazil: styles, making and rules of cachaça"] },
    o7: { w: 1, n: { it: "Altre agavi e sotol", fr: "Autres agaves et sotol", en: "Other agave spirits and sotol", es: "Otros agaves y sotol" },
      lessons: ["Bacanora", "Raicilla", "Sotol"] },
    o8: { w: 4, n: { it: "Altri distillati aromatizzati", fr: "Autres spiritueux aromatisés", en: "Other flavoured spirits", es: "Otros destilados aromatizados" },
      lessons: ["flavoured vodka", "aniseed spirits and their rules", "aquavit", "bitter spirits (amari) and cocktail bitters", "genever",
                "spiced rum and flavoured whiskey", "non-alcoholic spirits"] },
    o9: { w: 3, n: { it: "Liquori", fr: "Liqueurs", en: "Liqueurs", es: "Licores" },
      lessons: ["making liqueurs", "types of liqueur", "the main rules"] },
    o10: { w: 2, n: { it: "Vini aromatizzati", fr: "Vins aromatisés", en: "Aromatised wines", es: "Vinos aromatizados" },
      lessons: ["base wine, sweetness, botanical extracts, blending, resting, storage", "rules in the USA and the EU",
                "style choices and the main styles"] },

    /* ---------- blind tasting (Unit 2) ---------- */
    t1: { w: 0, n: { it: "La nota di degustazione", fr: "La note de dégustation", en: "Writing the tasting note", es: "La nota de cata" },
      lessons: ["appearance, nose, palate, finish: one choice per line", "describing aromas by source: raw material, processing (smoke, esters, heads, tails), oak and age",
                "judging quality: balance, length and intensity, complexity, expressiveness"] },
    t2: { w: 0, n: { it: "Riconoscere categoria e tipo", fr: "Reconnaître catégorie et type", en: "Naming category and type", es: "Reconocer categoría y tipo" },
      lessons: ["Scotch (single malt vs blend)", "American (Bourbon vs rye)", "grape (Cognac vs Armagnac)", "cane (molasses vs juice)",
                "agave (Tequila vs Mezcal)", "gin (juniper-forward vs contemporary)"] }
  },
  /* the 12 spirits that can be served blind: drives the tasting trainer and the "which one is it?" game */
  blind: [
    { type: "Scotch", cats: ["Single Malt", "Blended"] }, { type: "American whiskey", cats: ["Bourbon", "Rye"] },
    { type: "Grape", cats: ["Cognac", "Armagnac"] }, { type: "Sugar cane", cats: ["molasses", "cane juice"] },
    { type: "Agave", cats: ["Tequila", "Mezcal"] }, { type: "Gin", cats: ["juniper-forward", "contemporary"] }
  ],
  /* tasting grid levels (our own wording): Level 3 adds medium(-)/medium(+) and a reasoned quality verdict */
  grid: {
    clarity: ["clear", "hazy"], intensity: ["water-white", "pale", "medium", "deep", "opaque"],
    colour: ["colourless", "lemon", "gold", "amber", "brown", "other"], other: ["louching: slightly hazy → cloudy", "particles"],
    condition: ["clean", "unclean"], aroma: ["neutral", "light", "medium(-)", "medium", "medium(+)", "pronounced"],
    sweetness: ["dry", "off-dry", "medium", "sweet"], flavour: ["neutral", "light", "medium(-)", "medium", "medium(+)", "pronounced"],
    texture: ["rough", "smooth", "watery", "mouthfilling", "warming", "bitterness"],
    finishLength: ["short", "medium(-)", "medium", "medium(+)", "long"], finishNature: ["neutral", "simple", "some complexity", "very complex"],
    qualityArgs: ["balance", "length and intensity", "complexity", "expressiveness"],
    quality: ["faulty", "poor", "acceptable", "good", "very good", "outstanding"],
    aromaSources: ["raw material", "processing", "oak and maturation"]
  },
  formats: {
    question: "{id, c:chapter, q:[it,fr,en,es], o:[[it,fr,en,es] ×4, first = correct], e:[it,fr,en,es] short why, d:[it,fr,en,es] distractor note}",
    open: "{id, c:chapter, marks:5|10|20, kind:'state'|'describe'|'explain', q:[it,fr,en,es], points:[[it,fr,en,es] one mark each], model:[it,fr,en,es]}",
    tasting: "{id, type, cat, quality, note:{appearance, nose, palate, finish}, why:[it,fr,en,es]}",
    lesson: "{c:chapter, t:[it,fr,en,es] title, p:[[it,fr,en,es] paragraphs], keys:[[it,fr,en,es] key points]}",
    flash: "{c:chapter, f:[it,fr,en,es] front, b:[it,fr,en,es] back}"
  }
};
