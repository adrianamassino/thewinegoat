/* The Wine Goat — Level 2 structure (content to be filled from the course material).
   Organised like the Level 3 app: groups → chapters → lessons; every question, flashcard and
   map pin will carry a chapter id. Exam: 50 multiple-choice questions, 60 minutes, pass 55%.
   "w" = number of exam questions per area (out of 50) — used for mock exams and the study plan.
   No exam-body or book names appear in the app text. */
window.TWG_L2 = {
  level: 2,
  exam: { questions: 50, minutes: 60, pass: 55, written: false, tasting: false },
  groups: [
    { k: "p", w: 9, n: { it: "Dal vigneto alla cantina", fr: "De la vigne au chai", en: "From vineyard to winery", es: "Del viñedo a la bodega" },
      c: ["p1", "p2", "p3", "p4", "p5", "p6"] },
    { k: "g", w: 19, n: { it: "I grandi vitigni internazionali", fr: "Les grands cépages internationaux", en: "The principal grapes", es: "Las grandes uvas internacionales" },
      c: ["g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g9"] },
    { k: "r", w: 12, n: { it: "Vitigni regionali", fr: "Cépages régionaux", en: "Regional grapes", es: "Uvas regionales" },
      c: ["r1", "r2", "r3", "r4"] },
    { k: "s", w: 6, n: { it: "Spumanti e fortificati", fr: "Effervescents et vins mutés", en: "Sparkling and fortified", es: "Espumosos y generosos" },
      c: ["s1", "s2", "s3"] },
    { k: "t", w: 4, n: { it: "Servizio, conservazione e abbinamenti", fr: "Service, conservation et accords", en: "Service, storage and food", es: "Servicio, conservación y maridaje" },
      c: ["t1", "t2", "t3", "t4"] }
  ],
  chapters: {
    /* ---------- from vineyard to winery (exam: 5 + 4 questions) ---------- */
    p1: { w: 1.5, n: { it: "La vite e l'uva", fr: "La vigne et le raisin", en: "The vine and the grape", es: "La vid y la uva" },
      lessons: ["parts of the grape: skin, pulp, seeds, stems", "what a vine needs: warmth, sunlight, water, nutrients, CO2",
                "flowering, fruit set, véraison", "unripe, ripe, extra-ripe (late harvest, raisined)", "how colour, sugar, acid, tannin and flavours change"] },
    p2: { w: 1.5, n: { it: "Clima, meteo e ambiente", fr: "Climat, météo et environnement", en: "Climate, weather and site", es: "Clima, tiempo y entorno" },
      lessons: ["cool, moderate, warm climates", "latitude, altitude, mountains, slope, aspect", "soils, seas, rivers, fog, cloud, mist",
                "weather: drought, frost, hail, rain, sunlight, temperature", "ripeness and wine style and quality"] },
    p3: { w: 1, n: { it: "Le scelte in vigneto", fr: "Les choix au vignoble", en: "Choices in the vineyard", es: "Decisiones en el viñedo" },
      lessons: ["training and pruning", "irrigation", "weeds, pests and diseases; organic production", "yield and harvest",
                "concentrating sugar: extra-ripe, botrytis/noble rot, frozen grapes"] },
    p4: { w: 1, n: { it: "Leggere l'etichetta: origine e regole", fr: "Lire l'étiquette : origine et règles", en: "Reading the label: origin and rules", es: "Leer la etiqueta: origen y normas" },
      lessons: ["geographical indications; PDO and PGI", "France: AOC/AOP, IGP", "Italy: DOCG, DOC, IGT", "Spain: DOCa, DO, Vino de la Tierra",
                "Germany: Qualitätswein, Prädikatswein, Landwein", "old vines, vintage, late harvest, botrytis/noble rot, icewine"] },
    p5: { w: 2, n: { it: "La vinificazione", fr: "La vinification", en: "Winemaking", es: "La vinificación" },
      lessons: ["alcoholic fermentation: yeast, sugar, alcohol, CO2", "crushing, fermentation, pressing, storage/maturation, blending, packaging",
                "white, rosé and red wines step by step", "adding sugar, adjusting acidity; cool vs warm fermentation",
                "red extraction; rosé by short maceration or blending; sweet wines: stopped fermentation, added sweetness"] },
    p6: { w: 2, n: { it: "Scelte di cantina e invecchiamento", fr: "Choix au chai et vieillissement", en: "Winery choices and ageing", es: "Decisiones en bodega y envejecimiento" },
      lessons: ["stainless steel, concrete, oak", "oak: small/large, new/old, toast level", "malolactic conversion", "lees", "blending: consistency, complexity, style",
                "bottle ageing of red and white wines"] },

    /* ---------- principal grapes (exam: 19 questions) ---------- */
    g1: { w: 2.5, grape: "Chardonnay", col: "w", n: { it: "Chardonnay", fr: "Chardonnay", en: "Chardonnay", es: "Chardonnay" },
      gis: { eu: ["Pays d'Oc (IGP)", "Bourgogne", "Chablis", "Puligny-Montrachet", "Meursault", "Mâcon", "Pouilly-Fuissé"],
             world: ["California", "Sonoma", "Los Carneros", "Napa Valley", "Santa Barbara County", "Oregon", "Central Valley (Chile)", "Casablanca Valley",
                     "Western Cape", "Walker Bay", "South Eastern Australia", "Yarra Valley", "Adelaide Hills", "Margaret River", "Marlborough", "Hawke's Bay"] } },
    g2: { w: 2.5, grape: "Sauvignon Blanc", col: "w", n: { it: "Sauvignon Blanc", fr: "Sauvignon Blanc", en: "Sauvignon Blanc", es: "Sauvignon Blanc" },
      gis: { eu: ["Pays d'Oc (IGP)", "Sancerre", "Pouilly-Fumé", "Touraine", "Bordeaux", "Graves", "Pessac-Léognan"],
             world: ["Napa Valley", "Central Valley (Chile)", "Casablanca Valley", "Elgin", "Constantia", "Adelaide Hills", "Margaret River", "Marlborough"] } },
    g3: { w: 2, grape: "Riesling", col: "w", n: { it: "Riesling", fr: "Riesling", en: "Riesling", es: "Riesling" },
      gis: { eu: ["Alsace", "Mosel", "Rheingau", "Pfalz"], world: ["Clare Valley", "Eden Valley"] } },
    g4: { w: 1.5, grape: "Pinot Grigio / Pinot Gris", col: "w", n: { it: "Pinot Grigio", fr: "Pinot Gris", en: "Pinot Grigio / Pinot Gris", es: "Pinot Grigio / Pinot Gris" },
      gis: { eu: ["Veneto (IGP)", "Alsace", "Delle Venezie", "Friuli-Venezia Giulia"], world: [] } },
    g5: { w: 2.5, grape: "Pinot Noir", col: "r", n: { it: "Pinot Nero", fr: "Pinot Noir", en: "Pinot Noir", es: "Pinot Noir" },
      gis: { eu: ["Bourgogne", "Gevrey-Chambertin", "Nuits-Saint-Georges", "Beaune", "Pommard"],
             world: ["Sonoma", "Los Carneros", "Santa Barbara County", "Oregon", "Casablanca Valley", "Walker Bay", "Yarra Valley", "Mornington Peninsula", "Martinborough", "Marlborough", "Central Otago"] } },
    g6: { w: 2.5, grape: "Cabernet Sauvignon", col: "r", n: { it: "Cabernet Sauvignon", fr: "Cabernet Sauvignon", en: "Cabernet Sauvignon", es: "Cabernet Sauvignon" },
      gis: { eu: ["Pays d'Oc (IGP)", "Bordeaux", "Haut-Médoc", "Pauillac", "Margaux", "Graves", "Pessac-Léognan"],
             world: ["California", "Napa Valley (Oakville, Rutherford, Calistoga)", "Sonoma", "Central Valley (Chile)", "Maipo Valley", "Colchagua Valley", "Stellenbosch", "Coonawarra", "Margaret River", "Hawke's Bay"] } },
    g7: { w: 2, grape: "Merlot", col: "r", n: { it: "Merlot", fr: "Merlot", en: "Merlot", es: "Merlot" },
      gis: { eu: ["Pays d'Oc (IGP)", "Bordeaux", "Saint-Émilion", "Pomerol"], world: ["California", "Napa Valley", "Sonoma", "Central Valley (Chile)", "Stellenbosch", "Margaret River", "Hawke's Bay"] } },
    g8: { w: 2, grape: "Syrah / Shiraz", col: "r", n: { it: "Syrah / Shiraz", fr: "Syrah", en: "Syrah / Shiraz", es: "Syrah / Shiraz" },
      gis: { eu: ["Pays d'Oc (IGP)", "Crozes-Hermitage", "Hermitage", "Côte-Rôtie", "Minervois"], world: ["South Eastern Australia", "Barossa Valley", "Hunter Valley"] } },
    g9: { w: 1.5, n: { it: "Menzioni in etichetta: Borgogna, Bordeaux, Alsazia, Germania", fr: "Mentions d'étiquette : Bourgogne, Bordeaux, Alsace, Allemagne", en: "Label terms: Burgundy, Bordeaux, Alsace, Germany", es: "Menciones de etiqueta: Borgoña, Burdeos, Alsacia, Alemania" },
      terms: ["Premier Cru", "Grand Cru (Burgundy, Alsace)", "Bordeaux Supérieur", "Cru Bourgeois", "Grand Cru Classé", "Prädikatswein", "Kabinett", "Spätlese", "Auslese",
              "Beerenauslese (BA)", "Trockenbeerenauslese (TBA)", "Eiswein", "Trocken", "Halbtrocken"] },

    /* ---------- regional grapes (exam: 12 questions) ---------- */
    r1: { w: 3, n: { it: "Rossi di Francia e Spagna", fr: "Rouges de France et d'Espagne", en: "Reds of France and Spain", es: "Tintos de Francia y España" },
      grapes: { "Gamay": ["Beaujolais", "Beaujolais Villages", "Fleurie (cru)"], "Grenache / Garnacha": ["Côtes du Rhône", "Côtes du Rhône Villages", "Châteauneuf-du-Pape", "Minervois", "Côtes de Provence", "Rioja", "Navarra", "Priorat", "Barossa Valley", "McLaren Vale"],
                "Tempranillo": ["Rioja", "Ribera del Duero", "Catalunya"] }, terms: ["Joven / Genérico", "Crianza", "Reserva", "Gran Reserva"] },
    r2: { w: 3, n: { it: "Rossi d'Italia", fr: "Rouges d'Italie", en: "Reds of Italy", es: "Tintos de Italia" },
      grapes: { "Nebbiolo": ["Barolo", "Barbaresco"], "Barbera": ["Barbera d'Asti"], "Sangiovese": ["Chianti", "Chianti Classico", "Brunello di Montalcino"],
                "Corvina": ["Valpolicella", "Amarone della Valpolicella", "Recioto della Valpolicella"], "Montepulciano": ["Montepulciano d'Abruzzo"], "Primitivo": ["Puglia"] },
      terms: ["Riserva", "Classico"] },
    r3: { w: 2, n: { it: "Rossi del Nuovo Mondo", fr: "Rouges du Nouveau Monde", en: "New World reds", es: "Tintos del Nuevo Mundo" },
      grapes: { "Zinfandel": ["California"], "Pinotage": ["Western Cape"], "Carmenère": ["Central Valley (Chile)"], "Malbec": ["Mendoza"] }, terms: ["Cape Blend"] },
    r4: { w: 4, n: { it: "Bianchi regionali", fr: "Blancs régionaux", en: "Regional whites", es: "Blancos regionales" },
      grapes: { "Chenin Blanc": ["Vouvray", "Western Cape"], "Sémillon": ["Sauternes", "Hunter Valley", "Barossa Valley"], "Viognier": ["Condrieu"], "Gewurztraminer": ["Alsace", "Alsace Grand Cru"],
                "Verdicchio": ["Verdicchio dei Castelli di Jesi"], "Cortese": ["Gavi"], "Garganega": ["Soave", "Recioto di Soave"], "Fiano": ["Fiano di Avellino"], "Albariño": ["Rías Baixas"], "Furmint": ["Tokaj"] },
      terms: ["Classico", "Aszú"] },

    /* ---------- sparkling and fortified (exam: 6 questions) ---------- */
    s1: { w: 3, n: { it: "Spumanti", fr: "Effervescents", en: "Sparkling wines", es: "Espumosos" },
      lessons: ["grapes: Chardonnay, Pinot Noir, Meunier, Moscato, Glera", "traditional method (second fermentation in bottle)", "tank method: dry and sweet styles",
                "Champagne, Cava, Prosecco, Asti; South Africa, USA, Australia, New Zealand"], terms: ["Brut", "Demi-Sec", "Vintage / Non-Vintage", "Traditional Method", "Cap Classique"] },
    s2: { w: 1.5, n: { it: "Sherry (Jerez)", fr: "Xérès", en: "Sherry", es: "Jerez" },
      lessons: ["fortification after fermentation", "ageing under flor", "oxidative ageing"], terms: ["Fino", "Amontillado", "Oloroso", "Pale Cream", "Medium", "Cream", "PX (Pedro Ximénez)"] },
    s3: { w: 1.5, n: { it: "Porto", fr: "Porto", en: "Port", es: "Oporto" },
      lessons: ["fortification to stop fermentation", "ageing"], terms: ["Ruby", "Reserve Ruby", "Late Bottled Vintage (LBV)", "Vintage", "Tawny"] },

    /* ---------- service, storage and food (exam: 4 questions) ---------- */
    t1: { w: 1, n: { it: "Conservare il vino", fr: "Conserver le vin", en: "Storing wine", es: "Conservar el vino" },
      lessons: ["temperature, light, bottle position", "preserving opened wine: vacuum and inert gas"] },
    t2: { w: 1, n: { it: "Servire il vino", fr: "Servir le vin", en: "Serving wine", es: "Servir el vino" },
      lessons: ["service temperatures by style", "opening still and sparkling wine", "decanting", "glassware; checking appearance and nose", "faults: cork taint, closure failure, heat damage"] },
    t3: { w: 1.5, n: { it: "Abbinamento cibo-vino", fr: "Accords mets-vins", en: "Food and wine", es: "Maridaje" },
      lessons: ["food components: sweetness, umami, acid, salt, flavour intensity, fat, chilli heat", "wine components affected: sweetness, acidity, bitterness, fruitiness, alcohol"] },
    t4: { w: 0.5, n: { it: "Degustare con metodo", fr: "Déguster avec méthode", en: "Tasting with a method", es: "Catar con método" },
      lessons: ["appearance, nose, palate, conclusions at Level 2", "describing structure and quality"] }
  },
  /* the 8 classroom tastings, used for the tasting diary and "what to taste next" */
  tastings: [
    ["Pinot Grigio", "oaked Chenin Blanc / Sémillon / Chardonnay", "Gewurztraminer Alsace Grand Cru", "Beaujolais Villages", "Barolo"],
    ["red Burgundy village wine", "New World Pinot Noir", "red Zinfandel"],
    ["white Zinfandel", "dry Australian Riesling", "German Spätlese Riesling", "Chenin Blanc or Sémillon", "Tokaji or Sauternes"],
    ["Chablis Premier Cru", "Puligny-Montrachet / Meursault / Pouilly-Fuissé", "New World Chardonnay", "Sancerre or Pouilly-Fumé", "Marlborough Sauvignon Blanc", "Albariño / Pinot Gris / Viognier"],
    ["Merlot (IGP or brand)", "Saint-Émilion Grand Cru", "Haut-Médoc Cru Classé", "New World Cabernet Sauvignon", "Northern Rhône Syrah", "Barossa Valley Shiraz"],
    ["Côtes du Rhône", "Châteauneuf-du-Pape", "rosé or Rioja Genérico", "Rioja Reserva", "Mendoza Malbec or Chilean Carmenère", "South African Pinotage"],
    ["Gavi / Soave / Verdicchio", "Fiano / Soave / Verdicchio", "Barbera d'Asti", "Valpolicella Classico", "Chianti Classico Riserva", "Sauternes or Tokaji"],
    ["Prosecco", "Cava", "Champagne", "Asti", "Fino or Oloroso Sherry", "LBV or Tawny Port"]
  ],
  /* item formats the Level 2 content will use (same engines as Level 3) */
  formats: {
    question: "{id, c:chapter, q:[it,fr,en], o:[[it,fr,en] ×4, first = correct], e:[it,fr,en] short why, d:[it,fr,en] longer explanation}",
    lesson: "{c:chapter, t:[it,fr,en] title, p:[[it,fr,en] paragraphs], keys:[[it,fr,en] key points]}",
    flash: "{c:chapter, f:[it,fr,en] front, b:[it,fr,en] back}",
    map: "{c:chapter, gi:'name', lat, lng, grape:[...]}"
  }
};
