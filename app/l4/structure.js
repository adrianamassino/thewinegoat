/* The Wine Goat — Diploma (Level 4) structure (content to be filled from the course material).
   Six units, each assessed separately; the Diploma is mostly OPEN-RESPONSE (written answers) plus blind tasting,
   so it uses the app's open-question engine, the tasting-note engine and timed written mocks rather than MCQs.
   "w" = unit weighting in the final grade (%). Pass grades: unit pass 55% (D3: 55% in theory AND tasting;
   D4/D5: 45% in each component and 55% overall); Merit 65–74%, Distinction 75%+ (weighted aggregate).
   No exam-body or book names appear in the app text.
   Planning file, not loaded by the app. Built units: content in tools/l4/src/<unit>/ (node tools/l4/build.js) →
   app/l4/<unit>/content.js, run by app/l4/d4app.js; their chapters (D1: d1a–d1f) supersede the lists below. */
window.TWG_L4 = {
  level: 4,
  units: [
    { k: "D1", w: 20, n: { it: "Produzione del vino", fr: "Production du vin", en: "Wine production", es: "Producción del vino" },
      exam: { type: "open", minutes: 90 }, note: "first unit to sit", c: ["d1a", "d1b", "d1c", "d1d", "d1e", "d1f"] },
    { k: "D2", w: 10, n: { it: "Il business del vino", fr: "Le commerce du vin", en: "Wine business", es: "El negocio del vino" },
      exam: { type: "open", minutes: 60 }, c: ["d2a", "d2b", "d2c"] },
    { k: "D3", w: 50, n: { it: "I vini del mondo", fr: "Les vins du monde", en: "Wines of the world", es: "Vinos del mundo" },
      exam: { type: "open+tasting", theory: [120, 80], tasting: { wines: 12, papers: 2, minutes: 90 } },
      c: ["d3fr1", "d3fr2", "d3fr3", "d3de", "d3at", "d3hu", "d3gr", "d3it1", "d3it2", "d3es", "d3pt", "d3us", "d3ca", "d3cl", "d3ar", "d3za", "d3au", "d3nz", "d3cn", "d3t"] },
    { k: "D4", w: 5, n: { it: "Vini spumanti", fr: "Vins effervescents", en: "Sparkling wines", es: "Vinos espumosos" },
      exam: { type: "open+tasting", minutes: 90, tasting: { wines: 3 } }, c: ["d4a", "d4b", "d4t"] },
    { k: "D5", w: 5, n: { it: "Vini fortificati", fr: "Vins mutés", en: "Fortified wines", es: "Vinos generosos" },
      exam: { type: "open+tasting", minutes: 90, tasting: { wines: 3 } }, c: ["d5a", "d5b", "d5t"] },
    { k: "D6", w: 10, n: { it: "Ricerca individuale", fr: "Travail de recherche", en: "Research assignment", es: "Trabajo de investigación" },
      exam: { type: "essay", words: 3000 }, c: ["d6a"] }
  ],
  chapters: {
    /* ---------- D1 wine production ---------- */
    d1a: { n: { it: "La vite e l'ambiente", fr: "La vigne et son environnement", en: "The vine and its environment", es: "La vid y su entorno" },
      lessons: ["vine anatomy; grape components and how they develop", "the growth cycle from dormancy to extra-ripening; the vine's needs",
                "temperature and sunlight: latitude, altitude, slope, aspect, water, wind, soil, cloud, diurnal range", "water and nutrients: rainfall, soil, evapotranspiration, pH, soil health",
                "climate classifications; weather and vintage variation; climate change", "hazards (drought, frost, hail, sunburn, fire, smoke taint) and pests and diseases"] },
    d1b: { n: { it: "Viticoltura", fr: "Viticulture", en: "Grape growing", es: "Viticultura" },
      lessons: ["conventional, sustainable, organic, biodynamic, precision viticulture", "vineyard establishment: site, soil, variety, clone, rootstock",
                "propagation, crossings and hybrids, grafting, vine age", "nutrient, soil and water management", "canopy management", "harvest timing and methods",
                "managing hazards, pests and diseases", "linking choices to style, quality (poor → outstanding) and price (inexpensive → super-premium)"] },
    d1c: { n: { it: "Vinificazione", fr: "Vinification", en: "Winemaking", es: "Vinificación" },
      lessons: ["wine components: water, alcohols, acids, aromatics, sugars, glycerol, phenolics", "reception, sorting, destemming, crushing; extraction techniques; oxygen and SO2",
                "clarification before fermentation; must adjustments", "alcoholic fermentation choices; carbonic and semi-carbonic maceration; stopping", "malolactic conversion",
                "maturation: oak, neutral vessels, lees, micro-oxygenation; blending", "fining, filtration, stabilisation; finishing; packaging and closures; transport"] },
    d1d: { n: { it: "Difetti e controllo qualità", fr: "Défauts et contrôle qualité", en: "Faults and quality control", es: "Defectos y control de calidad" },
      lessons: ["hazes, tartrates, refermentation, cork taint, oxidation, volatile acidity, reduction, brettanomyces", "hygiene, HACCP, ISO, traceability"] },
    /* ---------- D2 wine business ---------- */
    d2a: { n: { it: "Il prezzo del vino", fr: "Le prix du vin", en: "The price of wine", es: "El precio del vino" },
      lessons: ["supply and demand", "costs: vineyard, winery, packaging, transport, import, sales, marketing", "tax, duty, trade barriers, subsidies, minimum pricing, labelling laws", "currency exchange and how to limit its impact"] },
    d2b: { n: { it: "Imprese e canali di vendita", fr: "Entreprises et circuits de vente", en: "Businesses and routes to market", es: "Empresas y canales de venta" },
      lessons: ["estate, grower, merchant, co-operative, custom crush, virtual winery, conglomerate", "importers and distributors", "retail, HoReCa, direct to consumer", "free market, monopoly, three-tier system"] },
    d2c: { n: { it: "Marketing del vino", fr: "Marketing du vin", en: "Wine marketing", es: "Marketing del vino" },
      lessons: ["product and brand, market analysis, target consumer", "objectives and strategy; the marketing mix (5Ps)"] },
    /* ---------- D3 wines of the world (+ tasting 12 wines) ---------- */
    d3fr1: { n: { it: "Francia: Bordeaux e Sud-Ovest", fr: "France : Bordeaux et Sud-Ouest", en: "France: Bordeaux and South West", es: "Francia: Burdeos y Suroeste" }, regions: ["Bordeaux", "South West France"] },
    d3fr2: { n: { it: "Francia: Borgogna, Beaujolais, Jura", fr: "France : Bourgogne, Beaujolais, Jura", en: "France: Burgundy, Beaujolais, Jura", es: "Francia: Borgoña, Beaujolais, Jura" }, regions: ["Burgundy", "Beaujolais", "Jura"] },
    d3fr3: { n: { it: "Francia: Alsazia, Loira, Rodano, Sud", fr: "France : Alsace, Loire, Rhône, Sud", en: "France: Alsace, Loire, Rhône, South", es: "Francia: Alsacia, Loira, Ródano, Sur" }, regions: ["Alsace", "Loire Valley", "Rhône Valley", "South of France"] },
    d3de: { n: { it: "Germania", fr: "Allemagne", en: "Germany", es: "Alemania" }, regions: ["Ahr", "Mosel", "Nahe", "Rheingau", "Rheinhessen", "Pfalz", "Baden", "Franken", "Württemberg"] },
    d3at: { n: { it: "Austria", fr: "Autriche", en: "Austria", es: "Austria" }, regions: ["Niederösterreich", "Burgenland", "Steiermark"] },
    d3hu: { n: { it: "Ungheria: Tokaj", fr: "Hongrie : Tokaj", en: "Hungary: Tokaj", es: "Hungría: Tokaj" }, regions: ["Tokaj"] },
    d3gr: { n: { it: "Grecia", fr: "Grèce", en: "Greece", es: "Grecia" }, regions: ["Macedonia", "Peloponnese", "the Islands"] },
    d3it1: { n: { it: "Italia: Nord", fr: "Italie : Nord", en: "Italy: North", es: "Italia: Norte" }, regions: ["Trentino-Alto Adige", "Friuli-Venezia Giulia", "Veneto", "Piemonte"] },
    d3it2: { n: { it: "Italia: Centro, Sud e isole", fr: "Italie : Centre, Sud et îles", en: "Italy: Centre, South and islands", es: "Italia: Centro, Sur e islas" },
      regions: ["Tuscany", "Marche", "Umbria", "Lazio", "Abruzzo", "Campania", "Puglia", "Basilicata", "Sicily", "Sardinia"] },
    d3es: { n: { it: "Spagna", fr: "Espagne", en: "Spain", es: "España" }, regions: ["Catalunya", "Valencia", "Murcia", "Aragón", "Castilla-La Mancha", "Castilla y León", "La Rioja", "Navarra", "Galicia"] },
    d3pt: { n: { it: "Portogallo", fr: "Portugal", en: "Portugal", es: "Portugal" }, regions: ["Vinho Verde", "Douro", "Dão", "Bairrada", "Alentejo", "Lisboa", "Península de Setúbal", "Tejo"] },
    d3us: { n: { it: "Stati Uniti", fr: "États-Unis", en: "USA", es: "Estados Unidos" }, regions: ["California", "Oregon", "Washington", "New York"] },
    d3ca: { n: { it: "Canada", fr: "Canada", en: "Canada", es: "Canadá" }, regions: ["Ontario", "British Columbia"] },
    d3cl: { n: { it: "Cile", fr: "Chili", en: "Chile", es: "Chile" }, regions: ["Coquimbo", "Aconcagua", "Central Valley", "Southern Region"] },
    d3ar: { n: { it: "Argentina", fr: "Argentine", en: "Argentina", es: "Argentina" }, regions: ["Salta", "San Juan", "Mendoza", "Patagonia"] },
    d3za: { n: { it: "Sudafrica", fr: "Afrique du Sud", en: "South Africa", es: "Sudáfrica" }, regions: ["Coastal Region", "Breede River Valley", "Cape South Coast", "Olifants River"] },
    d3au: { n: { it: "Australia", fr: "Australie", en: "Australia", es: "Australia" }, regions: ["South Australia", "Victoria", "New South Wales", "Tasmania", "Western Australia"] },
    d3nz: { n: { it: "Nuova Zelanda", fr: "Nouvelle-Zélande", en: "New Zealand", es: "Nueva Zelanda" }, regions: ["North Island", "South Island"] },
    d3cn: { n: { it: "Cina", fr: "Chine", en: "China", es: "China" }, regions: ["China"] },
    d3t: { n: { it: "Degustazione: 12 vini alla cieca", fr: "Dégustation : 12 vins à l'aveugle", en: "Tasting: 12 wines blind", es: "Cata: 12 vinos a ciegas" },
      lessons: ["advanced tasting note: appearance, nose, palate", "quality assessment with justification", "readiness for drinking / ageing potential with justification", "origin, variety and price indicators"] },
    /* every D3 region is studied through the same lens */
    _d3lens: ["growing environment", "grape growing options", "winemaking options", "law and regulation (GI, PDO, PGI, labelling terms)", "business: price, producers, routes to market, marketing", "style, quality and price compared"],
    /* ---------- D4 sparkling ---------- */
    d4a: { n: { it: "Metodi e scelte di produzione", fr: "Méthodes et choix de production", en: "Methods and production choices", es: "Métodos y decisiones de producción" },
      lessons: ["traditional, transfer, tank, Asti, carbonation, pétillant naturel", "pressing, base wine, reserve wines, blending", "second fermentation, time on lees, riddling, disgorgement, dosage", "sweetness terms and labelling"] },
    d4b: { n: { it: "Gli spumanti del mondo", fr: "Les effervescents du monde", en: "Sparkling wines of the world", es: "Espumosos del mundo" },
      regions: ["Champagne", "Crémant (Alsace, Bourgogne, Loire)", "Saumur", "Vouvray", "Sekt", "Asti", "Franciacorta", "Lambrusco", "Prosecco", "Trentodoc", "Cava", "England and Wales",
                "California", "Oregon", "Washington State", "Chile", "Argentina", "South Africa", "Australia", "New Zealand"] },
    d4t: { n: { it: "Degustazione: 3 spumanti", fr: "Dégustation : 3 effervescents", en: "Tasting: 3 sparkling wines", es: "Cata: 3 espumosos" } },
    /* ---------- D5 fortified ---------- */
    d5a: { n: { it: "Sherry e Porto", fr: "Xérès et Porto", en: "Sherry and Port", es: "Jerez y Oporto" }, regions: ["Sherry", "Port"] },
    d5b: { n: { it: "Madeira, VDN e Rutherglen Muscat", fr: "Madère, VDN et Rutherglen Muscat", en: "Madeira, VDN and Rutherglen Muscat", es: "Madeira, VDN y Rutherglen Muscat" },
      regions: ["Madeira", "Vins Doux Naturels (Grenache, Muscat)", "Rutherglen Muscat"] },
    d5t: { n: { it: "Degustazione: 3 fortificati", fr: "Dégustation : 3 vins mutés", en: "Tasting: 3 fortified wines", es: "Cata: 3 generosos" } },
    /* ---------- D6 research ---------- */
    d6a: { n: { it: "Scrivere la ricerca (3.000 parole)", fr: "Rédiger le mémoire (3 000 mots)", en: "Writing the research paper (3,000 words)", es: "Escribir la investigación (3.000 palabras)" },
      lessons: ["reading the brief", "finding and judging sources beyond the course material", "structure and argument", "referencing", "planning to the submission date"] }
  },
  formats: {
    open: "{id, c:chapter, q:[it,fr,en], marks, keys:[[it,fr,en] marking points], model:[it,fr,en]}",
    tasting: "{id, c:chapter, wine:'…', note:{appearance, nose, palate, quality, readiness}, why:[it,fr,en]}",
    lesson: "{c:chapter, t:[it,fr,en] title, p:[[it,fr,en] paragraphs], keys:[[it,fr,en] key points]}",
    flash: "{c:chapter, f:[it,fr,en] front, b:[it,fr,en] back}"
  }
};
