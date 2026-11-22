// Instagram batch 02 — The Wine Goat (@the.winegoat). ENGLISH ONLY.
// v2 look: the website's cream/white base with burgundy shading; variety through layouts
// (editorial, map, myth vs fact, photo + comparison, typographic, flow diagram, flashcard).
// Course shown by a badge + thin accent line. Levels checked against the course specifications.
// Facts: app content (app/l2, app/l4/d4, app/l4/d5, app/sake/k1, app/beer/b1, app/spirits/s1, app/spirits/s2)
// and the site's own Level 3 short-answer guide. No wine imagery on Spirits, Sake or Beer posts;
// white-wine topics use white grapes / pale glasses only.
'use strict';
// Imagery (Nov 2026 rebuild): a mix of real photos from the site's library (img/photos, Wikimedia Commons, CC BY /
// BY-SA: credited in captions.md), the painted goats (red-wine posts only; the traveller goat is neutral) and
// painterly SVG drawings (lib/illus2.js). Photos only where they show exactly the topic.
const { B, B2 } = require('../lib/render');
const I = require('../lib/illus');   // old line icons: kept only for the stories (not rebuilt)
const D = require('../lib/illus2');  // painterly drawings
const { PH } = require('../lib/photos');
const map = require('./bordeaux-map');

const G = (name) => `img/goats/${name}.webp`;
const arrow = '<span style="color:var(--hl, #8c1d40);font-weight:800">→</span>';
// drawing placed in the content flow (pushed to the bottom of the area, never over text)
const inl = (svg, { justify = 'flex-end', mt = 'auto', gap = 24, pad = 0 } = {}) => `<div style="margin-top:${mt};display:flex;justify-content:${justify};align-items:flex-end;gap:${gap}px;padding:0 ${pad}px">${svg}</div>`;
const numArt = (n, svg) => `<div style="display:flex;justify-content:space-between;align-items:flex-end">${B2.edNum(n).replace('<div class="ed-rule"></div>', '')}<div style="margin-bottom:6px">${svg}</div></div><div class="ed-rule"></div>`;
const lying = (svg, w, h) => `<div style="width:${h}px;height:${w}px;position:relative"><div style="position:absolute;left:50%;top:50%;width:${w}px;transform:translate(-50%,-50%) rotate(-90deg)">${svg}</div></div>`;

// photos used in this batch (captions describe exactly what each shows; credit lines go in captions.md)
const P = {
  champagne: PH('champagne-vineyards-montagne-de-reims-marne', 'Vineyards near Verzenay, Champagne, with a windmill on the hilltop.'),
  agave: PH('blue-agave-field-jalisco-tequila', 'An agave field in Jalisco, Mexico, seen from above.'),
  beers: PH('0871-beer-glasses-aufse-bier', 'A tray of beers at a brewery inn in Aufseß, Germany.'),
  stemilion: PH('0524-vineyards-in-gironde-saint-emilion-33-la-grande-muraille-2013', 'Vines beside La Grande Muraille, a ruined convent wall in Saint-Émilion.'),
  mosel: PH('steep-vineyard-urzig-mosel', 'Steep vineyard above a stone wall at Ürzig, on the Mosel.'),
  laguardia: PH('laguardia-autumn-vineyard-rioja-alavesa', 'A vineyard in autumn near Laguardia, Rioja Alavesa.'),
  elvillar: PH('elvillar-autumn-vineyard-rioja-alavesa', 'Autumn vines near Elvillar, Rioja Alavesa.'),
  barleyGold: PH('barley-field-golden-hour-nottuln', 'A barley field at golden hour near Nottuln, Germany.'),
  barleyEars: PH('1356-barley-field-ears-dulmen-hausdulmen-feld-2018-3438', 'Ears of barley in a field near Dülmen, Germany.'),
  tobermory: PH('tobermory-distillery-isle-of-mull', 'Tobermory Distillery on the Isle of Mull, Scotland.'),
  studioGrapes: PH('red-and-white-grape-bunches-hanging', 'A bunch of black grapes (cut out from a studio photo).'),
  glass: PH('wine-glass-on-vineyard-post', 'An empty tulip-shaped wine glass on a vineyard post among vine leaves.'),
  blackGrapes: PH('black-grape-bunch-autumn-vine', 'A bunch of black grapes on the vine in autumn.'),
  langhe: PH('serralunga-d-alba-castle-langhe-vineyards', 'Serralunga d’Alba and its castle above the vineyards of the Langhe, Piedmont.'),
  ay: PH('champagne-vineyards-ay-marne', 'Vineyards near Aÿ, Champagne.'),
  peat: PH('1007-peat-cutting-a-peat-bog-below-the-top-of-doune-hill-l', 'A peat bog below Doune Hill, in the Luss Hills, Scotland.'),
};

/* =========================== FEED CAROUSELS (1080x1350) =========================== */
const posts = [
  /* ---------- 0. PINNED: How much do you know about wine? (quiz, Level 1 to Diploma) ---------- */
  {
    id: 'pinned-how-much-do-you-know', bg: 'burgundy', course: 'wine', level: 1, badge: 'Wine · Levels 1–4', tpl: 'flash', pinned: true,
    imagery: 'Photos: wine glass on a vineyard post (cover), black grapes on the vine, Serralunga d’Alba in the Langhe, vineyards near Aÿ in Champagne; drawings: sherry copitas',
    photos: [P.glass, P.blackGrapes, P.studioGrapes, P.langhe, P.ay],
    slides: [
      { layout: 'cover', tile: { variant: 'arch', photo: P.glass.src, pos: 'center 50%', tone: 'burgundy', head: 'How much do you know <em>about wine?</em>', headSize: 92,
          sub: '4 questions, from Level 1 to Diploma. Keep score!', archH: 720 } },
      { layout: 'content', kicker: 'Question 1 · Level 1', photo: P.blackGrapes.src, photoMode: 'top', photoH: 520, photoPos: 'center 40%',
        title: 'Black grape skins give red wine its colour <em>and…</em>', titleSize: 60,
        html: B.options(['Sweetness', 'Tannin', 'Acidity']) + '<div class="sub" style="margin-top:22px;font-size:30px">Answer on the next slide</div>' },
      { layout: 'content', edit: { head: 'B · <em>Tannin</em>', headSize: 140,
          sub: 'Black grape skins hold both the colour and the tannins.', arrows: true, gap: 16,
          items: [{ src: 'tools/social/assets/cutouts/grapes-black.png', h: 470, label: 'Black grape skins' }, { svg: D.glassPhoto(190, 'red'), h: 450, label: 'Colour + tannin' }] } },
      { layout: 'content', kicker: 'Question 2 · Level 2', photo: P.langhe.src, photoMode: 'top', photoH: 520, photoPos: 'center 50%',
        title: 'Barolo DOCG is made <em>exclusively from…</em>', titleSize: 60,
        html: B.options(['Sangiovese', 'Nebbiolo', 'Barbera']) + '<div class="sub" style="margin-top:22px;font-size:30px">Answer on the next slide</div>' },
      { layout: 'content', kicker: 'Answer 2', title: 'B · <em>Nebbiolo</em>', titleSize: 84,
        html: B.options(['Sangiovese', 'Nebbiolo', 'Barbera'], 'B') + B.note('Barolo, in Piedmont’s Langhe hills, is made only from <b>Nebbiolo</b>: pale in colour, but high in tannin and acidity.') + inl(D.glass(96, 'red'), { pad: 30, mt: '10px' }) },
      { layout: 'content', kicker: 'Question 3 · Level 3', photo: P.ay.src, photoMode: 'top', photoH: 520, photoPos: 'center 55%',
        title: 'In Champagne, brioche and biscuit aromas <em>come from…</em>', titleSize: 56,
        html: B.options(['Oak barrels', 'Ageing on the dead yeast', 'The dosage']) + '<div class="sub" style="margin-top:22px;font-size:30px">Answer on the next slide</div>' },
      { layout: 'content', kicker: 'Answer 3', title: 'B · <em>Autolysis</em>', titleSize: 84,
        html: B.options(['Oak barrels', 'Ageing on the dead yeast', 'The dosage'], 'B') + B.note('On the lees the dead yeast cells break down: <b>autolysis</b>. Non-vintage Champagne spends at least <b>12 months</b> on its lees.') + inl(D.flute(100), { pad: 40 }) },
      { layout: 'content', kicker: 'Question 4 · Diploma',
        title: 'Which Sherry ages under <em>a film of flor?</em>', titleSize: 66,
        html: B.options(['Oloroso', 'Fino', 'Cream']) + '<div class="sub" style="margin-top:22px;font-size:30px">Answer on the next slide</div>'
          + inl(D.row([D.glass(110, 'sherry'), D.glass(110, 'brown'), D.glass(110, 'dark')], 34), { justify: 'center' }) },
      { layout: 'content', kicker: 'Answer 4', title: 'B · <em>Fino</em>', titleSize: 84,
        html: B.options(['Oloroso', 'Fino', 'Cream'], 'B') + B.note('Fino is fortified to 15–15.5%, so flor can grow: <b>biological ageing</b>. Oloroso is fortified to 17%: no flor, oxidative ageing. Cream is Oloroso sweetened with PX.') },
      { layout: 'cta', kicker: 'Your score?', title: 'Find your level <em>in minutes</em>', titleSize: 84,
        sub: 'Comment your score from 0 to 4. Then try the free quizzes for Wine Levels 1–3 and Diploma topics: link in bio.', subWidth: 760,
        cta: 'Find your level on thewinegoat.com',
        goat: { src: G('goat-raising-golden-trophy-on-rock'), style: { right: 60, bottom: 110, height: 430 } } },
    ],
  },
  /* ---------- 1. Sake: how sake is brewed (flow diagram) ---------- */
  {
    id: 'sake-how-sake-is-brewed', bg: 'course', course: 'sake', level: 1, tpl: 'flow',
    imagery: 'Drawings: sake flask (tokkuri) and cup, rice grains',
    slides: [
      { layout: 'cover', tile: { variant: 'solid', arc: 'How sake is brewed', arcSize: 96, art: D.tokkuri(500), artTop: 500,
          sub: 'From rice to glass, and why sake is not a spirit' },
        kicker: 'Brewing basics',
        title: 'How sake <em>is brewed</em>', titleWidth: 600,
        sub: 'From rice to glass, and why sake is not a spirit', subWidth: 520,
        art: { svg: D.tokkuri(470), style: { right: 50, bottom: 140 } } },
      { layout: 'content', kicker: 'The ingredients',
        title: 'Four ingredients, <em>plus one option</em>',
        html: B.bullets([
          '<b>Steamed white rice</b>: polished, washed, soaked and steamed so it softens',
          '<b>Kōji</b>: steamed rice on which a special mould has been grown',
          '<b>Water</b>: local, almost any, as long as it is clean',
          '<b>Yeast</b>: carefully chosen strains',
        ]) + B.note('<b>Optional:</b> a high-strength distilled alcohol. Whether it is used matters for the label.'), center: true },
      { layout: 'content', kicker: 'The key idea',
        title: 'No kōji, <em>no sugar</em>',
        sub: 'Rice holds starch, not sugar. Yeast cannot eat starch.',
        html: B2.par({ b: 'Kōji enzymes', t: 'turn starch into sugar' }, '+', { b: 'Yeast', t: 'turns sugar into alcohol and CO₂' })
          + B.note('<b>Parallel fermentation:</b> both happen at the same time, in the same tank. The liquid reaches about <b>20% abv</b>. In beer the two steps are separate.'), center: true },
      { layout: 'content', kicker: 'The steps that always happen',
        title: 'From rice <em>to bottle</em>',
        html: B2.flow([
          { title: 'Prepare the rice', text: 'Polish, wash, soak, steam' },
          { title: 'Make kōji', text: 'From a small part of the steamed rice' },
          { title: 'Starter', text: 'Builds a healthy yeast population' },
          { title: 'Main fermentation', text: 'More rice, kōji and water, added little by little', hi: true },
          { title: 'Filtration', text: 'Required by law: the rice solids are removed' },
          { title: 'Bottling' },
        ]) },
      { layout: 'content', kicker: 'Three optional choices',
        title: 'The brewer <em>decides</em>',
        html: B2.flow([
          { n: '+', opt: true, title: 'Distilled alcohol', text: 'Before filtration, to draw out flavour from the rice solids. Not added? The sake can be <b>junmai</b>.' },
          { n: '+', opt: true, title: 'Water', text: 'Brings about 20% abv down to the usual 15–17%' },
          { n: '+', opt: true, title: 'Pasteurisation', text: 'Heat stops faulty aromas developing. Skipped? That style is <b>nama</b>.' },
        ]).replace(/<span>/g, '<span style="font-size:32px">'), center: true },
      { layout: 'cta', kicker: 'Quick check',
        title: 'Brewed like beer, <em>but in parallel</em>', titleWidth: 640,
        sub: 'Which step surprised you most? Tell us in the comments and save this for revision.', subWidth: 560,
        art: { svg: D.tokkuri(330), style: { right: 50, bottom: 130 } } },
    ],
  },

  /* ---------- 3. Wine L3: traditional method (editorial) ---------- */
  {
    id: 'wine-traditional-method', bg: 'cream', course: 'wine', level: 3, tpl: 'editorial',
    imagery: 'Photo (cover): Champagne vineyards near Verzenay; drawings: base-wine glass, bottle on lees with crown cap, riddling rack, sparkling bottle and flute',
    photos: [P.champagne],
    slides: [
      { layout: 'cover', tile: { variant: 'frame', photo: P.champagne.src, pos: 'center 60%', tone: 'burgundy',
          head: 'The traditional method <em>in six steps</em>', headSize: 84, sub: 'From still wine to bubbles in the bottle' },
        kicker: 'Sparkling wine',
        photo: P.champagne.src, photoMode: 'top', photoH: 700, photoPos: 'center 60%',
        title: 'The traditional method <em>in six steps</em>', titleWidth: 860, titleSize: 92,
        html: '<div style="height:26px"></div>' + B2.edIndex(['Base wine', 'Tirage', 'Second fermentation', 'Lees ageing', 'Riddling', 'Disgorgement']).replace('class="ed-index"', 'class="ed-index" style="margin-top:0;max-width:720px"'),
        photoCaption: '' },
      { layout: 'content', kicker: 'Step 01',
        html: numArt('01', D.row([D.grapes(175, 'white', { leafOn: false }), D.glass(115, 'pale')], 4)) + '<h2>Base wine</h2>'
          + B2.edP('Just-ripe grapes give <b>high acidity</b>, low sugar and delicate aromas. They are pressed gently, fermented to a dry still wine and <b>blended</b> across sites, grapes and years.')
          + B2.edFacts([{ v: '9–11%', t: 'abv in a typical base wine' }, { v: 'Cool', t: 'climates at the margin of ripening suit it best' }]) },
      { layout: 'content', kicker: 'Steps 02–03',
        html: numArt('02', D.bottle(82, { crown: true, label: false })) + '<h2>Tirage, <em>then a second fermentation</em></h2>'
          + B2.edP('<b>Liqueur de tirage</b> (wine, sugar, yeast, nutrients) goes into the base wine, and the bottle is closed with a crown cap. The yeast ferments the sugar <b>in the bottle the wine will be sold in</b>: the CO₂ stays trapped as bubbles.')
          + B2.edFacts([{ v: '≈ 6 atm', t: 'pressure built in the bottle' }, { v: '+1–2%', t: 'abv added by the second fermentation' }]) },
      { layout: 'content', kicker: 'Step 04',
        html: numArt('04', lying(D.bottle(100, { crown: true, leesSide: true, label: false }), 100, 325)) + '<h2>Lees ageing</h2>'
          + B2.edP('The dead yeast cells break down: <b>autolysis</b>. It brings brioche and biscuit aromas. The effects show after the first year and keep building for years.')
          + B2.edFacts([{ v: '12 months', t: 'minimum on lees for non-vintage Champagne' }, { v: 'Brioche', t: 'biscuit, toast: the autolytic notes' }]) },
      { layout: 'content', kicker: 'Steps 05–06',
        html: numArt('05', D.pupitre(200)) + '<h2>Riddling <em>and disgorgement</em></h2>'
          + B2.edP('<b>Riddling</b> moves the lees into the neck: by hand on pupitres (up to 8 weeks) or in gyropalettes (3–4 days). For <b>disgorgement</b> the neck is frozen and the pressure pushes out the plug of lees.')
          + B2.edFacts([{ v: 'Dosage', t: 'wine + sugar (liqueur d’expédition) sets the sweetness' }, { v: '0–12 g/L', t: 'sugar for Brut' }]) },
      { layout: 'cta', kicker: 'True or false?',
        title: '“Extra Dry” is sweeter <em>than Brut</em>', titleSize: 76, titleWidth: 640,
        sub: 'True: Extra Dry is 12–17 g/L, Brut 0–12 g/L. Did you get it? Tell us below.', subWidth: 560,
        art: { svg: D.row([D.bottle(120), D.flute(112)], 8), style: { right: 80, bottom: 140 } } },
    ],
  },

  /* ---------- 4. Spirits L2: Tequila vs Mezcal (photo cover + comparison) ---------- */
  {
    id: 'spirits-tequila-vs-mezcal', bg: 'course', course: 'spirits', level: 2, tpl: 'photo',
    imagery: 'Photo (cover): agave field in Jalisco; drawings: blue agave plant',
    photos: [P.agave],
    slides: [
      { layout: 'cover', tile: { variant: 'arch', photo: P.agave.src, pos: 'center 30%', tone: 'course',
          head: 'Tequila <em>vs</em> Mezcal', headSize: 104, sub: 'Both start with agave. Here is what sets them apart.', archH: 650 },
        kicker: 'Agave spirits',
        title: 'Tequila <em>vs</em> Mezcal', titleSize: 118,
        sub: 'Both start with agave. Here is what sets them apart.', subWidth: 760,
        photo: P.agave.src, photoPos: 'center 30%',
        photoCaption: P.agave.cap },
      { layout: 'content', kicker: 'From plant to spirit',
        title: 'Agave first, <em>then the piña</em>',
        html: B.bullets([
          'Agave stores its reserves as <b>inulin</b> in its hard core.',
          'It flowers once after many years, then dies: growers harvest <b>just before flowering</b>.',
          'The leaves are trimmed, leaving the <b>piña</b>.',
          'Inulin cannot ferment as it is: the piña is <b>always cooked</b> first.',
        ]) + inl(D.agave(330)) },
      { layout: 'content', kicker: 'Side by side',
        title: 'Two <em>geographical indications</em>', titleSize: 64,
        html: B2.vs2('Tequila', 'Mezcal', [
          ['Agave', 'Only <b>blue agave</b>', 'Several species, mainly <b>espadín</b>'],
          ['Where', 'Five states, mainly <b>Jalisco</b>', 'Several states, mainly <b>Oaxaca</b>'],
          ['Cooking', 'Steamed: brick ovens or pressurised ovens', 'Often roasted in <b>stone-lined pits</b>: smoke'],
          ['Producers', 'Dominated by large companies', 'Dominated by small producers'],
        ]), center: true },
      { layout: 'content', kicker: 'Reading a Tequila label',
        title: '100% agave <em>or not?</em>',
        sub: '“Tequila” alone needs only 51% agave sugars. “100% agave” means all of them.',
        html: B.ladder([
          { n: '1', title: 'Blanco (Silver)', text: 'No ageing requirement' },
          { n: '2', title: 'Gold (Joven / Oro)', text: 'Unaged, coloured and softened with abocado' },
          { n: '3', title: 'Reposado', text: 'At least 2 months in oak' },
          { n: '4', title: 'Añejo', text: 'At least 1 year in oak barrels' },
          { n: '5', title: 'Extra Añejo', text: 'At least 3 years in barrels', hi: true },
        ]).replace(/class="step/g, 'style="padding:16px 26px" class="step') },
      { layout: 'content', kicker: 'Reading a Mezcal label',
        title: 'Three categories, <em>more tradition</em>',
        html: B2.flow([
          { title: 'Mezcal', text: 'Any cooking method, any still, even a column' },
          { title: 'Artisanal Mezcal', text: 'Pits or brick ovens; fermented with the fibres; directly heated pot stills' },
          { title: 'Ancestral Mezcal', text: 'Pits only, no mechanical mills, directly heated clay stills', hi: true },
        ]), center: true },
      { layout: 'cta', kicker: 'Your pick',
        title: 'Team Tequila or <em>team Mezcal?</em>', titleWidth: 700,
        sub: 'Tell us in the comments, and save this for your spirits exam.', subWidth: 600,
        art: { svg: D.agave(440), style: { right: 50, bottom: 140 } } },
    ],
  },

  /* ---------- 5. Beer L1: colour vs strength (myth vs fact) ---------- */
  {
    id: 'beer-colour-strength-myths', bg: 'course', course: 'beer', level: 1, tpl: 'myth',
    imagery: 'Drawings: beer glasses in the colour of each style (cover: solid amber tile)',
    photos: [],
    slides: [
      { layout: 'cover', tile: { variant: 'solid', arc: 'Dark beer = strong beer?', arcSize: 78,
          art: D.row([D.beerGlass(200, 'straw', { seed: 41 }), D.beerGlass(200, 'amber', { seed: 42 }), D.beerGlass(200, 'black', { seed: 43 })], 40), artTop: 520,
          head: 'Myth or fact?', headSize: 64, sub: '5 beer myths about colour and strength' },
        kicker: 'Myth or fact?',
        photo: P.beers.src, photoMode: 'top', photoH: 760, photoPos: 'center 30%',
        title: 'Dark beer is <em>always strong</em>…', titleSize: 92, titleWidth: 900,
        html: '<div class="bigmf" style="margin:18px 0 6px"><div class="x" style="font-size:120px">Myth.</div></div><div class="sub" style="max-width:860px;margin-bottom:0">5 beer myths about colour and strength</div>' },
      { layout: 'content', kicker: 'Myth 1',
        html: B2.mf({ myth: 'Dark beer is always strong.', fact: 'Colour comes from <em>malt</em>. Strength comes from <em>sugar</em>.', why: '<b>Speciality malts</b>, kilned hotter or roasted, give amber, brown or black. Alcohol depends on how much sugar the yeast ferments.' })
          + inl(D.row([D.beerGlass(150, 'straw'), D.beerGlass(150, 'amber', { seed: 8 }), D.beerGlass(150, 'black', { seed: 9 })], 30), { justify: 'center', mt: '44px' }) },
      { layout: 'content', kicker: 'Myth 2',
        html: B2.mf({ myth: 'Pale beer is always light.', fact: 'Tripel is <em>gold</em> and high to very high in alcohol.', why: 'Stronger than a <b>dubbel</b>, which is copper to brown.' })
          + inl(D.row([D.beerGlass(190, 'gold', { shape: 'goblet' }), D.beerGlass(190, 'copper', { shape: 'goblet', seed: 12 })], 40), { justify: 'center', mt: '44px' }) },
      { layout: 'content', kicker: 'Myth 3',
        html: B2.mf({ myth: 'Every stout is a heavyweight.', fact: 'Porter and stout range from <em>low to very high</em> alcohol.', why: 'The very strong, roasty versions often carry the word <b>“imperial”</b>.' })
          + inl(D.row([D.beerGlass(160, 'black', { seed: 3 }), D.beerGlass(160, 'brown', { seed: 4 })], 40), { justify: 'center', mt: '44px' }) },
      { layout: 'content', kicker: 'Myth 4',
        html: B2.mf({ myth: 'Lager is always pale.', fact: 'Munich dunkel is a <em>copper to brown</em> lager.', why: 'Ale or lager depends on the <b>yeast</b>, not on the colour.' })
          + inl(D.row([D.beerGlass(160, 'copper', { seed: 6 }), D.beerGlass(160, 'straw', { seed: 7 })], 40), { justify: 'center', mt: '44px' }) },
      { layout: 'content', kicker: 'Myth 5',
        html: B2.mf({ myth: 'A sour beer has gone off.', fact: 'In sour styles, the sourness is <em>on purpose</em>.', why: 'Bacteria such as <b>lactic acid bacteria</b> add the acidity. Berliner weisse: straw, hazy, low in alcohol.' })
          + inl(D.beerGlass(170, 'hazy', { seed: 14 }), { justify: 'center', mt: '44px' }) },
      { layout: 'cta', kicker: 'The takeaway',
        title: 'Judge strength by the label, <em>not the colour</em>', titleSize: 70,
        html: B2.scale([{ v: '≤ 4%', t: 'low' }, { v: '4.1–5.9%', t: 'medium' }, { v: '6–9%', t: 'high' }, { v: '> 9%', t: 'very high' }])
          + '<div class="sub" style="margin-top:26px;max-width:880px">Which myth did you believe? Tell us below.</div>'
          + inl(D.row([D.beerGlass(120, 'straw', { seed: 31 }), D.beerGlass(120, 'gold', { seed: 32 }), D.beerGlass(120, 'amber', { seed: 33 }), D.beerGlass(120, 'copper', { seed: 34 }), D.beerGlass(120, 'black', { seed: 35 })], 26), { justify: 'center', mt: '40px' }) },
    ],
  },

  /* ---------- 7. Wine L2: Bordeaux Left Bank vs Right Bank (map) ---------- */
  {
    id: 'wine-bordeaux-left-right-bank', bg: 'cream', course: 'wine', level: 2, tpl: 'map',
    imagery: 'Photo (cover): vines by La Grande Muraille, Saint-Émilion; stylised map; drawing: black grapes; goats: traveller (quiz), resting by a barrel with red wine (CTA)',
    photos: [P.stemilion],
    slides: [
      { layout: 'cover', tile: { variant: 'arch', photo: P.stemilion.src, pos: 'center 40%', tone: 'cream',
          head: 'Left Bank <em>vs</em> Right Bank', headSize: 96, sub: 'Gravel or clay, Cabernet or Merlot', archH: 620 },
        kicker: 'Bordeaux',
        photo: P.stemilion.src, photoMode: 'top', photoH: 760, photoPos: 'center 45%',
        title: 'Left Bank <em>vs</em> Right Bank', titleSize: 100,
        sub: 'Gravel or clay, Cabernet or Merlot: the map in five slides.', subWidth: 820,
        photoCaption: P.stemilion.cap },
      { layout: 'content', kicker: 'The map',
        title: 'Two rivers, <em>one estuary</em>',
        sub: 'The Garonne and the Dordogne meet to form the Gironde.', subWidth: 900,
        html: B2.mapbox(map(780)) },
      { layout: 'content', kicker: 'Side by side',
        title: 'Gravel <em>or clay?</em>',
        html: B2.pair([
          { title: 'Left Bank', where: 'West & south of Gironde and Garonne', rows: [['Soil', 'Warm <b>gravel</b>'], ['Leads', '<b>Cabernet Sauvignon</b>, with Merlot'], ['Names', 'Haut-Médoc (Margaux, Pauillac), Graves (Pessac-Léognan)']] },
          { title: 'Right Bank', where: 'North & east of Gironde and Dordogne', rows: [['Soil', 'Cool <b>clay</b>'], ['Leads', '<b>Merlot</b>; Cabernet Franc too, in Saint-Émilion'], ['Names', 'Saint-Émilion, Pomerol']] },
        ]) + inl(D.grapes(200, 'red', { seed: 5 }), { mt: '10px', pad: 20 }) },
      { layout: 'content', kicker: 'The why',
        title: 'Why gravel <em>suits Cabernet</em>',
        html: B.ladder([
          { n: '1', title: 'Rainy maritime climate', text: 'Late-ripening Cabernet struggles on the coolest sites.' },
          { n: '2', title: 'Gravel drains', text: 'Water runs away quickly after heavy rain.' },
          { n: '3', title: 'Gravel holds heat', text: 'It soaks up warmth by day and keeps the vineyard warm into the evening.' },
          { n: '★', title: 'Cool clay suits Merlot', text: 'It ripens earlier. Merlot is the most planted grape in all of Bordeaux.', hi: true },
        ]), center: true },
      { layout: 'content', kicker: 'Quick quiz',
        title: 'Which one is <em>Merlot-led?</em>',
        html: B.options(['Pauillac', 'Pomerol', 'Margaux'], 'B')
          + B.note('<b>B · Pomerol</b>, on the Right Bank. Pauillac and Margaux are in the Haut-Médoc, on the Left Bank: Cabernet-led blends.'),
        goat: { src: G('goat-traveller-with-wine-map-and-suitcase'), style: { right: 70, bottom: 110, height: 250 } } },
      { layout: 'cta', kicker: 'Your turn',
        title: 'Team Left Bank or <em>team Right Bank?</em>', titleWidth: 720,
        sub: 'Tell us in the comments and save the map for revision.', subWidth: 520,
        goat: { src: G('goat-resting-by-barrel-with-red-wine'), style: { right: 50, bottom: 110, height: 470 } } },
    ],
  },

  /* ---------- 9. Wine L3: how to answer a short written-answer question (typographic) ---------- */
  {
    id: 'wine-level3-short-answers', bg: 'burgundy', course: 'wine', level: 3, tpl: 'typo',
    imagery: 'Typographic; photo (practice-question slide): steep Mosel vineyard at Ürzig; goat: traveller (CTA, neutral)',
    photos: [P.mosel],
    slides: [
      { layout: 'cover', tile: { variant: 'solid', arc: 'Facts don’t score.', arcSize: 96,
          art: `<img src="${G('goat-traveller-with-wine-map-and-suitcase')}" style="height:430px" alt="">`, artTop: 530,
          extra: '<div class="tl-sub" style="font-size:78px;line-height:1;color:#f3d58c">Linked facts do.</div><div class="tl-sub" style="font:500 30px/1.3 var(--sans);opacity:.9">How to answer a Level 3 short written-answer question</div>' },
        kicker: 'Written answers',
        title: '', html: B2.tq('Facts don’t score. <em class="gt">Linked facts do.</em>')
          + '<div class="sub" style="max-width:700px">How to answer a Level 3 short written-answer question</div>' },
      { layout: 'content', kicker: 'Where they sit',
        html: B2.tbig('4', 'short written answers', 'sit beside <b>50 multiple-choice questions</b> in the theory paper. Theory and tasting are separate units, and each needs <b>55%</b>.') },
      { layout: 'content', kicker: 'How marks work',
        html: B2.tbig('1', 'mark = 1 precise point', 'Answers are marked against a list of acceptable points. A 4-mark sub-part needs at least <b>4 distinct, correct points</b>: one or two extra is a safe margin.')
          + B2.ex('Precision pays', '“A cool continental climate with cold winters and short, warm summers” scores more than “a cool climate”.') },
      { layout: 'content', kicker: 'A method for every question',
        title: 'Five steps, <em>one minute of planning</em>', titleSize: 64,
        html: B2.flow([
          { title: 'Read every sub-part', text: 'Underline the command word and the marks' },
          { title: 'Plan in keywords', text: 'One per mark, plus one or two', hi: true },
          { title: 'Assign each keyword', text: 'To the right sub-part: no repeats, no gaps' },
          { title: 'Write linked sentences', text: 'Cause and effect, exam vocabulary' },
          { title: 'Reread', text: 'Does every “why” have a “because”?' },
        ]) },
      { layout: 'content', kicker: 'The chain',
        title: 'Think in <em>cause and effect</em>',
        html: `<div class="tq" style="font-size:58px;line-height:1.3">Climate ${arrow} site ${arrow} grape ${arrow} vineyard ${arrow} winery ${arrow} maturation ${arrow} <em class="gt">style</em></div><div class="tbar"></div>`
          + B2.ex('A linked sentence', 'Cool nights preserve acidity, so the wine tastes fresh.') },
      { layout: 'content', kicker: 'Our own practice question',
        photo: P.mosel.src, photoMode: 'top', photoH: 430, photoPos: 'center 55%',
        title: 'Why does the Mosel make <em>light, high-acid Riesling?</em>', titleSize: 54, titleWidth: 900,
        html: B2.wa('The Mosel is cold. Slate soils. Steep slopes. Riesling has high acidity.',
          'The cool climate <b>means</b> grapes ripen slowly and keep high acidity. Steep south-facing slopes <b>catch more sunlight</b>, helping ripening. Slate <b>absorbs heat by day and releases it at night</b>.') },
      { layout: 'cta', kicker: 'Over to you',
        title: 'What scares you most: <em>MCQs, written answers or tasting?</em>', titleSize: 66, titleWidth: 760,
        sub: 'Tell us below. Save this for your next practice paper.', subWidth: 560,
        goat: { src: G('goat-traveller-with-wine-map-and-suitcase'), style: { right: 60, bottom: 110, height: 420 } } },
    ],
  },

  /* ---------- 11. Wine L4 (Diploma): Sherry styles (flashcards) ---------- */
  {
    id: 'wine-sherry-styles', bg: 'course', course: 'wine', level: 4, levelNote: 'Diploma', tpl: 'flash',
    imagery: 'Editorial cut-out cover: four near-photographic glasses from pale lemon (Fino) to almost black (PX); drawings: copitas, solera of stacked butts',
    slides: [
      { layout: 'cover', tile: { variant: 'edit', head: 'Sherry <em>styles</em>', headSize: 150,
          sub: 'Flor or oxygen: one choice shapes almost every style.', gap: 34,
          items: [{ svg: D.glassPhoto(176, 'sherry'), h: 430, label: 'Fino' }, { svg: D.glassPhoto(176, 'amber'), h: 430, label: 'Amontillado' }, { svg: D.glassPhoto(176, 'brown'), h: 430, label: 'Oloroso' }, { svg: D.glassPhoto(176, 'dark'), h: 430, label: 'PX' }] },
        kicker: '',
        cardOpen: '<div class="card2 cover-card"><div class="kicker">Fortified wines · flashcards</div>', cardClose: '</div>',
        title: 'Sherry styles, <em>card by card</em>', titleSize: 100,
        sub: 'Flor or oxygen? That one choice shapes almost every style.', subWidth: 760,
        art: { svg: D.row([D.glass(104, 'sherry'), D.glass(104, 'amber'), D.glass(104, 'brown'), D.glass(104, 'dark')], 26), style: { right: 90, bottom: 140 } } },
      { layout: 'content', kicker: 'Card 1 · The split',
        title: 'Two ways <em>to age</em>',
        html: B2.par({ b: 'Biological', t: 'under flor; fortified to 15–15.5%' }, 'or', { b: 'Oxidative', t: 'no flor; fortified to 17%' })
          + B.bullets(['<b>Flor</b> is a film of yeast: it needs no more than 15.5% abv and gives bread dough, almond and bruised apple.', 'Both age in a <b>solera</b>: fractional blending in old American oak butts.'])
          + inl(D.solera(330), { justify: 'center', mt: 'auto' }) },
      { layout: 'content', kicker: 'Card 2',
        html: B2.card({ small: 'Biological only', title: 'Fino & Manzanilla', rows: [
          ['Colour', B2.chip('#f1e7b0') + 'Pale lemon'],
          ['Alcohol', '15–15.5%'],
          ['Aromas', 'Almond, herbs, bread dough'],
          ['Manzanilla', 'From <b>Sanlúcar de Barrameda</b>: thicker flor all year, lighter, with a salty note'],
        ] }) + inl(D.glass(110, 'sherry'), { mt: '30px', pad: 30 }) },
      { layout: 'content', kicker: 'Card 3',
        html: B2.minis([
          { small: 'Flor, then oxygen', title: 'Amontillado', items: ['Starts under flor, then ages oxidatively', 'Amber', 'Yeasty notes with walnut and caramel'] },
          { small: 'The in-between', title: 'Palo Cortado', items: ['The aromatic finesse of an Amontillado', 'The body of an Oloroso'] },
        ]) + inl(D.glass(110, 'amber'), { mt: '30px', pad: 30 }) },
      { layout: 'content', kicker: 'Card 4',
        html: B2.card({ small: 'Oxidative only', title: 'Oloroso', rows: [
          ['Colour', B2.chip('#6b3a1e') + 'Brown'],
          ['Alcohol', '18–22%'],
          ['Body', 'Full'],
          ['Aromas', 'Walnut, toffee, spice, leather'],
        ] }) + inl(D.glass(110, 'brown'), { mt: '30px', pad: 30 }) },
      { layout: 'content', kicker: 'Card 5 · Sweet',
        html: B2.minis([
          { small: 'Naturally sweet', title: 'Pedro Ximénez', items: ['Sun-dried grapes', 'At least 212 g/L sugar, usually 450–500', 'Almost black: raisin, molasses, liquorice'] },
          { small: 'Sweetened blend', title: 'Cream', items: ['Oloroso blended with PX', '115–140 g/L sugar'] },
        ]) + B.note('<b>Dry styles</b> (Fino, Manzanilla, Amontillado, Oloroso, Palo Cortado) have no more than 4 g/L.')
          + inl(D.row([D.glass(100, 'dark'), D.glass(100, 'brown')], 30), { mt: 'auto', pad: 30 }) },
      { layout: 'cta', kicker: 'Bonus card',
        title: 'VOS and <em>VORS</em>',
        sub: 'Average age of at least 20 years (VOS) and 30 years (VORS). Fino or Oloroso: which do you reach for?', subWidth: 560,
        art: { svg: D.row([D.glass(130, 'sherry'), D.glass(130, 'brown')], 34), style: { right: 90, bottom: 140 } } },
    ],
  },
];

/* =========================== REELS (1080x1920, 30 fps, light template) =========================== */
const grainRow = (items, w = 220) => `<div style="display:flex;gap:30px;justify-content:center;align-items:flex-end">${items.map(([r, t]) => `<div style="display:flex;flex-direction:column;align-items:center;gap:8px">${D.grain(w, r)}<b style="font:800 40px/1 var(--serif);color:#3b3f8f">${t}</b></div>`).join('')}</div>`;
// months bar: total ageing with the oak part, on a 0–60 month scale
const ageBar = (total, oak) => `<div class="agebar"><div class="tr"><div class="tot" style="width:${(total / 60) * 100}%"></div><div class="oak" style="width:${(oak / 60) * 100}%"></div></div><div class="sc">${[0, 12, 24, 36, 48, 60].map((m) => `<span style="left:${(m / 60) * 100}%">${m}</span>`).join('')}</div><div class="lab"><i>In oak: <b>${oak}</b></i><span>Total: <b>${total} months</b></span></div></div>`;
const ph = (p, o = {}) => ({ src: p.src, pos: o.pos || 'center', h: o.h || 1000, textTop: o.textTop });
const reels = [
  { id: 'reel-pinned-how-much-do-you-know', bg: 'burgundy', course: 'wine', level: 1, badge: 'Wine · Levels 1–4',
    imagery: 'Photos: wine glass on a vineyard post, black grapes, Serralunga d’Alba (Langhe), vineyards near Aÿ; drawings: sherry copitas; goat raising a trophy',
    photos: [P.glass, P.blackGrapes, P.langhe, P.ay],
    tile: { variant: 'minimal', photo: P.blackGrapes.src, pos: 'center 45%', tag: '4 questions · keep score', line: 'How much do you know <em>about wine?</em>' },
    cover: { t: 1.8 },
    scenes: [
      { start: 0, end: 2.6, kicker: 'Keep score', title: 'How much do you know <em>about wine?</em>', titleSize: 88,
        photo: ph(P.glass, { pos: 'center 50%' }), caption: 'Four questions, from Level 1 to Diploma. Ready?' },
      { start: 2.6, end: 7.0, kicker: 'Q1 · Level 1', title: 'Skins give red wine colour <em>and…</em>', titleSize: 64,
        photo: ph(P.blackGrapes, { h: 760, pos: 'center 40%' }), lineGap: 0.5,
        lines: ['A · Sweetness', 'B · Tannin', 'C · Acidity', '✓ <b>B · Tannin</b>'],
        caption: 'Black grape skins hold both the colour and the tannins.' },
      { start: 7.0, end: 11.4, kicker: 'Q2 · Level 2', title: 'Barolo DOCG is made <em>only from…</em>', titleSize: 64,
        photo: ph(P.langhe, { h: 760, pos: 'center 50%' }), lineGap: 0.5,
        lines: ['A · Sangiovese', 'B · Nebbiolo', 'C · Barbera', '✓ <b>B · Nebbiolo</b>'],
        caption: 'Barolo, in the Langhe hills of Piedmont, is 100% Nebbiolo.' },
      { start: 11.4, end: 15.8, kicker: 'Q3 · Level 3', title: 'Champagne’s brioche notes <em>come from…</em>', titleSize: 64,
        photo: ph(P.ay, { h: 760, pos: 'center 55%' }), lineGap: 0.5,
        lines: ['A · Oak barrels', 'B · The dead yeast', 'C · The dosage', '✓ <b>B · Autolysis</b>'],
        caption: 'Autolysis: dead yeast cells break down during lees ageing.' },
      { start: 15.8, end: 20.2, kicker: 'Q4 · Diploma', title: 'Which Sherry ages <em>under flor?</em>', titleSize: 72, lineGap: 0.5,
        lines: ['A · Oloroso', 'B · Fino', 'C · Cream', '✓ <b>B · Fino</b>'],
        caption: 'Fino: fortified to 15–15.5%, so flor can grow.',
        art: { svg: D.row([D.glass(96, 'sherry'), D.glass(96, 'brown'), D.glass(96, 'dark')], 30), top: 1150 } },
      { start: 20.2, end: 23.0, kicker: 'Your score?', title: 'Find your level <em>in minutes</em>',
        lines: ['Free quizzes on <b>thewinegoat.com</b>'],
        caption: 'Comment your score from 0 to 4. Link in bio.',
        goat: { src: G('goat-raising-golden-trophy-on-rock'), h: 430, top: 960 } },
    ] },
  { id: 'reel-wine-spanish-ageing-terms', bg: 'burgundy', course: 'wine', level: 2,
    tile: { variant: 'arch', photo: P.laguardia.src, pos: 'center 45%', tone: 'burgundy', head: 'Crianza, Reserva, <em>Gran Reserva</em>', headSize: 90, sub: 'Spanish label terms in 20 seconds', archH: 640 },
    imagery: 'Photos: Rioja Alavesa vineyards in autumn (Laguardia, Elvillar); drawings: red wine glass and oak barrel; months bars; goat on barrel raising red wine',
    photos: [P.laguardia, P.elvillar],
    cover: { t: 1.8 },
    scenes: [
      { start: 0, end: 2.8, kicker: 'Spanish label terms', title: 'Crianza, Reserva, <em>Gran Reserva</em>', titleSize: 92,
        photo: ph(P.laguardia, { pos: 'center 40%' }),
        caption: 'Three words on Spanish red labels. What do they mean?' },
      { start: 2.8, end: 6.4, kicker: 'Step 0', title: 'Joven',
        lines: ['<b>No minimum</b> ageing', 'In Rioja the term is <b>Genérico</b>'],
        caption: 'Joven: no minimum ageing. In Rioja you will see Genérico.',
        art: { svg: D.glass(170, 'red'), top: 960 } },
      { start: 6.4, end: 10.2, kicker: 'Red wines', title: 'Crianza',
        lines: ['At least <b>24 months</b> in total', 'At least <b>6 in oak</b>'],
        vis: ageBar(24, 6),
        art: { svg: D.barrel(210), top: 1150 },
        caption: 'Crianza: at least 24 months, with 6 in oak.' },
      { start: 10.2, end: 14.0, kicker: 'Red wines', title: 'Reserva',
        lines: ['At least <b>36 months</b> in total', 'At least <b>12 in oak</b>'],
        vis: ageBar(36, 12),
        art: { svg: D.barrel(210), top: 1150 },
        caption: 'Reserva: at least 36 months, with 12 in oak.' },
      { start: 14.0, end: 17.8, kicker: 'Red wines', title: 'Gran Reserva',
        lines: ['At least <b>60 months</b> in total', 'At least <b>18 in oak</b>'],
        vis: ageBar(60, 18),
        art: { svg: D.barrel(210), top: 1150 },
        caption: 'Gran Reserva: at least 60 months, with 18 in oak.' },
      { start: 17.8, end: 21.6, kicker: 'Memory trick', title: '24 · 36 · 60', titleSize: 110,
        photo: ph(P.elvillar, { h: 900, pos: 'center 45%' }),
        lines: ['Oak: <b>6 · 12 · 18</b> months', 'Some regions, such as <b>Rioja</b>, require more'],
        caption: 'Total 24, 36, 60. Oak 6, 12, 18. Rioja asks for more.' },
      { start: 21.6, end: 24.2, kicker: 'Save it', title: 'Which one is <em>in your glass?</em>',
        lines: ['Practise free on <b>thewinegoat.com</b>'],
        caption: 'Tell us in the comments, and follow for more.',
        goat: { src: G('goat-on-wine-barrel-raising-red-wine'), h: 440, top: 950 } },
    ] },
  { id: 'reel-sake-polishing-ratio', bg: 'cream', course: 'sake', level: 1,
    tile: { variant: 'solid', tone: 'cream', arc: 'Polishing ratio', arcSize: 96,
      art: D.row([D.grain(240, 1), D.grain(240, 0.6), D.grain(240, 0.5)], 0), artTop: 540, sub: 'What the % on a sake label really means', head: 'in 20 seconds', headSize: 60 },
    imagery: 'Drawings: sake flask and cup, rice grains polished to 70/60/50%',
    cover: { t: 1.9 },
    scenes: [
      { start: 0, end: 2.8, kicker: 'Sake labels', title: 'Polishing ratio <em>in 20 seconds</em>', titleSize: 96,
        caption: 'That percentage on a sake label: what does it mean?',
        art: { svg: D.tokkuri(370), top: 975 } },
      { start: 2.8, end: 6.8, kicker: 'The number', title: 'It is what <em>remains</em>',
        lines: ['“60%” = <b>60% of the grain is left</b>', '<b>40%</b> has been polished away'],
        vis: grainRow([[1, '100%'], [0.6, '60%']], 240),
        caption: 'The number is what is left of the grain, not what was removed.' },
      { start: 6.8, end: 10.8, kicker: 'Why polish?', title: 'The outer layers',
        lines: ['Bring more <b>acidity and umami</b>', 'Plus <b>cereal and lactic</b> aromas', 'The core is mostly <b>starch</b>'],
        caption: 'Outer layers add acidity, umami, cereal and lactic notes.',
        art: { svg: D.grain(260, 1), top: 1130 } },
      { start: 10.8, end: 15.2, kicker: 'Premium grades', title: 'The limits',
        lines: ['Honjōzō · <b>70% or less</b>', 'Ginjō · <b>60% or less</b>', 'Daiginjō · <b>50% or less</b>'],
        caption: 'Honjōzō 70%, ginjō 60%, daiginjō 50%: the lower, the more polished.' },
      { start: 15.2, end: 19.2, kicker: 'The style', title: 'Fruity <em>and floral</em>',
        lines: ['Highly polished rice', '+ special yeasts + <b>cool fermentation</b>', '= apple, pear, white flowers'],
        vis: grainRow([[0.7, '70%'], [0.6, '60%'], [0.5, '50%']], 200),
        caption: 'Ginjō aromas need polished rice, special yeasts and a cool fermentation.' },
      { start: 19.2, end: 22.0, kicker: 'Save it', title: 'For your <em>sake exam</em>',
        lines: ['Practise free on <b>thewinegoat.com</b>'],
        caption: 'Follow for more sake basics.',
        art: { svg: D.tokkuri(360), top: 1000 } },
    ] },
  { id: 'reel-spirits-single-malt-scotch', bg: 'burgundy', course: 'spirits', level: 1,
    tile: { variant: 'arch', photo: P.barleyGold.src, pos: 'center 55%', tone: 'course', head: 'Single Malt Scotch: <em>3 words</em>', headSize: 94, sub: 'Three words on the label, three rules', archH: 640 },
    imagery: 'Photos: barley field at golden hour (Nottuln), Tobermory Distillery (Isle of Mull), ears of barley (Dülmen), peat bog (Luss Hills, Scotland); drawings: copper pot still, whisky bottle and nosing glass',
    photos: [P.barleyGold, P.tobermory, P.barleyEars, P.peat],
    cover: { t: 1.9 },
    scenes: [
      { start: 0, end: 2.8, kicker: 'Whisky basics', title: 'Single Malt Scotch: <em>3 words</em>', titleSize: 94,
        photo: ph(P.barleyGold, { pos: 'center 55%' }),
        caption: 'Three words on the label, three rules. Ready?' },
      { start: 2.8, end: 6.6, kicker: 'Word 1', title: 'Scotch',
        photo: ph(P.tobermory, { h: 900, pos: 'center 60%' }),
        lines: ['<b>Distilled</b> in Scotland', '<b>Aged</b> in Scotland, at least <b>3 years</b> in oak'],
        caption: 'Scotch: distilled and aged in Scotland, at least three years in oak.' },
      { start: 6.6, end: 10.2, kicker: 'Word 2', title: 'Malt',
        photo: ph(P.barleyEars, { h: 900, pos: 'center 40%' }),
        lines: ['Only <b>malted barley</b>', 'Distilled in <b>pot stills</b>'],
        caption: 'Malt: only malted barley, distilled in pot stills.' },
      { start: 10.2, end: 13.8, kicker: 'Word 3', title: 'Single',
        lines: ['From <b>one distillery</b>', 'Not one barrel!'],
        caption: 'Single means one distillery, not one barrel.',
        art: { svg: D.potStill(420), top: 1000 } },
      { start: 13.8, end: 17.8, kicker: 'And Blended Scotch?', title: 'Malt <em>+ grain</em>', titleSize: 96,
        lines: ['Malt and grain whiskies', 'From <b>different distilleries</b>', 'Grain whisky: column still, <b>lighter</b>'],
        caption: 'Blended Scotch mixes malt and grain whiskies from different distilleries.' },
      { start: 17.8, end: 21.4, kicker: 'Bonus', title: 'Peat smoke',
        photo: ph(P.peat, { h: 900, pos: 'center 55%' }),
        lines: ['From <b>peat</b> burned when the malted barley is dried', 'Only <b>a few</b> Single Malts are peaty'],
        caption: 'Smoky whisky? That is peat, and only a few Single Malts have it.' },
      { start: 21.4, end: 24.0, kicker: 'Save it', title: 'For your <em>spirits exam</em>',
        lines: ['Practise free on <b>thewinegoat.com</b>'],
        caption: 'Follow for more spirits basics.',
        art: { svg: D.row([D.whiskyBottle(170), D.glencairn(170)], 20), top: 980 } },
    ] },
  { id: 'reel-beer-ale-vs-lager', bg: 'burgundy', course: 'beer', level: 1,
    tile: { variant: 'frame', photo: P.beers.src, pos: 'center 35%', tone: 'burgundy', head: 'Ale or lager?', headSize: 104, sub: 'Hint: it isn’t the colour' },
    imagery: 'Photo: tray of beers in Aufseß; drawings: beer glasses (tripel chalice, wheat beer, pilsner, dunkel, blonde), barley',
    photos: [P.beers],
    cover: { t: 1.9 },
    scenes: [
      { start: 0, end: 2.8, kicker: 'Beer basics', title: 'Ale or lager? <em>15 seconds</em>', titleSize: 96,
        photo: ph(P.beers, { h: 1040, pos: 'center 35%' }),
        caption: 'What really makes an ale an ale?' },
      { start: 2.8, end: 6.4, kicker: 'The answer', title: 'It is <em>the yeast</em>',
        lines: ['Ale yeast <b>→ ales</b>', 'Lager yeast <b>→ lagers</b>'],
        caption: 'Two yeasts, two families: ales and lagers.',
        art: { svg: D.row([D.beerGlass(200, 'amber', { seed: 21 }), D.beerGlass(200, 'straw', { seed: 22 })], 40), top: 1000 } },
      { start: 6.4, end: 10.4, kicker: 'Ale yeast', title: 'Fast <em>and fruity</em>',
        lines: ['Works <b>fast</b>, fairly <b>warm</b>', 'Many <b>fruity and spicy</b> aromas', 'e.g. weissbier, tripel, saison'],
        caption: 'Ale yeast: fast, warmer, lots of fruity and spicy aromas.',
        art: { svg: D.row([D.beerGlass(150, 'hazy', { shape: 'weizen', seed: 23 }), D.beerGlass(190, 'gold', { shape: 'goblet', seed: 24 })], 30), top: 1040 } },
      { start: 10.4, end: 14.4, kicker: 'Lager yeast', title: 'Slow <em>and clean</em>',
        lines: ['<b>Slower</b> and <b>cooler</b>', 'Fewer strains, <b>less aroma</b>', 'e.g. pilsner, Munich helles'],
        caption: 'Lager yeast: slower, cooler, less aroma.',
        art: { svg: D.beerGlass(190, 'straw', { seed: 25 }), top: 1130 } },
      { start: 14.4, end: 18.2, kicker: 'Careful', title: 'Colour is <em>not the clue</em>', titleSize: 96,
        lines: ['Munich dunkel: a <b>copper to brown lager</b>', 'Blonde ale: a <b>straw to gold ale</b>'],
        caption: 'Dark lagers and pale ales both exist. Check the yeast, not the colour.',
        art: { svg: D.row([D.beerGlass(180, 'copper', { seed: 26 }), D.beerGlass(180, 'straw', { seed: 27 })], 40), top: 1090 } },
      { start: 18.2, end: 20.8, kicker: 'Save it', title: 'For your <em>beer exam</em>',
        lines: ['Practise free on <b>thewinegoat.com</b>'],
        caption: 'Follow for more beer basics.',
        art: { svg: D.row([D.barley(110), D.beerGlass(210, 'gold', { seed: 28 }), D.barley(110, 7)], 26), top: 960 } },
    ] },
];
/* =========================== STORIES (1080x1920) =========================== */
const stories = [
  { id: 'story-1-red-wine-colour', course: 'wine', level: 1,
    q: { question: 'Red wine gets its colour from…', options: ['The grape juice', 'The grape skins'],
         art: { svg: I.grapes(230, 'red'), style: { right: 60, bottom: 40 } } },
    a: { answer: 'B · <em>The skins</em>',
         explain: 'Black grape skins hold the <b>colour</b> and the <b>tannins</b>. For red wine, juice and skins ferment together.<br><br>For white wine, the juice is pressed off the skins before fermentation.',
         foot: 'More quizzes on thewinegoat.com',
         art: { svg: I.glass(150, 'red') + I.glass(150, 'white'), style: { left: '50%', transform: 'translateX(-50%)', bottom: 40, display: 'flex', gap: '40px' } } } },
  { id: 'story-2-xo-cognac', course: 'spirits', level: 1,
    q: { question: '“XO” Cognac: the youngest spirit is at least…', options: ['4 years old', '10 years old'],
         art: { svg: I.potstill(300), style: { right: 50, bottom: 30 } } },
    a: { answer: 'B · <em>10 years</em>',
         explain: '<b>VS</b> at least 2 years · <b>VSOP</b> at least 4 · <b>XO</b> at least 10.<br><br>The age always refers to the <b>youngest</b> spirit in the blend.',
         foot: 'More quizzes on thewinegoat.com',
         art: { svg: I.whisky(300), style: { left: '50%', transform: 'translateX(-50%)', bottom: 20 } } } },
  { id: 'story-3-sake-not-a-spirit', course: 'sake', level: 1,
    q: { question: 'Sake is…', options: ['A spirit, like vodka', 'Fermented, like wine and beer'],
         art: { svg: I.tokkuri(300), style: { left: 60, bottom: 30 } } },
    a: { answer: 'B · <em>Fermented</em>',
         explain: 'Sake is not distilled. A typical sake has <b>15–17% abv</b>, a little more than most wines, and is usually slightly sweet and lightly acidic.',
         foot: 'More quizzes on thewinegoat.com',
         art: { svg: I.tokkuri(280), style: { left: '50%', transform: 'translateX(-50%)', bottom: 20 } } } },
];

// Posting order (oldest first), batch 02 interleaved with the corrected batch-01 items (batch-01-fixed).
// Backgrounds cycle so that no two neighbouring tiles of the 4-column grid (newest first) share a
// background family, including the 4 old dark batch-01 posts below them.
const FX = 'social/instagram/batch-01-fixed';
const fixed = (id, label, reel = false) => ({ id, reel, dir: FX, label });
const feed = [
  fixed('sancerre-quiz', 'Wine · Level 1'),
  'reel-sake-polishing-ratio',
  fixed('a-same-grape-two-wines', 'Wine · Level 2'),
  'beer-colour-strength-myths',
  fixed('reel-1-three-grapes', 'Wine · Level 1', true),
  'reel-beer-ale-vs-lager',
  'wine-sherry-styles',
  'reel-spirits-single-malt-scotch',
  'spirits-tequila-vs-mezcal',
  'wine-traditional-method',
  'reel-wine-spanish-ageing-terms',
  'sake-how-sake-is-brewed',
  'wine-bordeaux-left-right-bank',
  'wine-level3-short-answers',
  'reel-pinned-how-much-do-you-know',
  'pinned-how-much-do-you-know',
];

const B1 = 'social/instagram/batch-01';
const grid = {
  cols: 4,
  note: 'Pinned quiz first, then newest first: batch 02 with the three corrected batch-01 items (16 feed posts), then the 4 batch-01 posts that stay up (old A, Sancerre and reel 1 replaced; Neutral spirit and Pot still deleted). 4:5 tiles; reel covers centre-cropped. Photo-led tiles with an arch or frame panel alternate with calm solid-colour and minimal-caption tiles.',
  legend: [{ c: '#8c1d40', t: 'Wine' }, { c: '#9a5f1e', t: 'Spirits' }, { c: '#3b3f8f', t: 'Sake' }, { c: '#d4a23a', t: 'Beer' }],
  prev: [
    { id: 'b-quiz-which-grape' }, { id: 'e-serving-temperatures' }, { id: 'd-german-wine-label' }, { id: 'f-tasting-mistakes' },
  ].map((x) => ({ ...x, dir: B1, label: 'batch 01' })),
};

module.exports = { id: 'batch-02', out: 'social/instagram/batch-02', v2: true, reelTemplate: 'reel-light.html', slideRange: [5, 10], posts, stories, reels, feed, grid };
