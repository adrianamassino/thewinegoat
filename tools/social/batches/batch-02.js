// Instagram batch 02 — The Wine Goat (@the.winegoat). ENGLISH ONLY.
// v2 look: the website's cream/white base with burgundy shading; variety through layouts
// (editorial, map, myth vs fact, photo + comparison, typographic, flow diagram, flashcard).
// Course shown by a badge + thin accent line. Levels checked against the course specifications.
// Facts: app content (app/l2, app/l4/d4, app/l4/d5, app/sake/k1, app/beer/b1, app/spirits/s1, app/spirits/s2)
// and the site's own Level 3 short-answer guide. No wine imagery on Spirits, Sake or Beer posts;
// white-wine topics use white grapes / pale glasses only.
'use strict';
const { B, B2 } = require('../lib/render');
const I = require('../lib/illus');
const map = require('./bordeaux-map');

const G = (name) => `img/goats/${name}.webp`;
const arrow = '<span style="color:#8c1d40;font-weight:800">→</span>';

/* =========================== FEED CAROUSELS (1080x1350) =========================== */
const posts = [
  /* ---------- 1. Sake: how sake is brewed (flow diagram) ---------- */
  {
    id: 'sake-how-sake-is-brewed', course: 'sake', level: 1, tpl: 'flow',
    slides: [
      { layout: 'cover', kicker: 'Brewing basics',
        title: 'How sake <em>is brewed</em>', titleWidth: 640,
        sub: 'From rice to glass, and why sake is not a spirit', subWidth: 560,
        art: { svg: I.tokkuri(430), style: { right: 70, bottom: 150 } } },
      { layout: 'content', kicker: 'The ingredients',
        title: 'Four ingredients, <em>plus one option</em>',
        html: B.bullets([
          '<b>Steamed white rice</b>: polished, washed, soaked and steamed so it softens',
          '<b>Kōji</b>: steamed rice on which a special mould has been grown',
          '<b>Water</b>: local, almost any, as long as it is clean',
          '<b>Yeast</b>: carefully chosen strains',
        ]) + B.note('<b>Optional:</b> a high-strength distilled alcohol. Whether it is used matters for the label.'),
        art: { svg: I.grain(190), style: { right: 80, bottom: 150 } } },
      { layout: 'content', kicker: 'The key idea',
        title: 'No kōji, <em>no sugar</em>',
        sub: 'Rice holds starch, not sugar. Yeast cannot eat starch.',
        html: B2.par({ b: 'Kōji enzymes', t: 'turn starch into sugar' }, '+', { b: 'Yeast', t: 'turns sugar into alcohol and CO₂' })
          + B.note('<b>Parallel fermentation:</b> both happen at the same time, in the same tank. The liquid reaches about <b>20% abv</b>. In beer the two steps are separate.') },
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
        ]).replace(/<span>/g, '<span style="font-size:32px">') },
      { layout: 'cta', kicker: 'Quick check',
        title: 'Brewed like beer, <em>but in parallel</em>',
        sub: 'Which step surprised you most? Tell us in the comments and save this for revision.',
        art: { svg: I.tokkuri(360), style: { right: 70, bottom: 150 } } },
    ],
  },

  /* ---------- 3. Wine L3: traditional method (editorial) ---------- */
  {
    id: 'wine-traditional-method', course: 'wine', level: 3, tpl: 'editorial',
    slides: [
      { layout: 'cover', kicker: 'Sparkling wine',
        title: 'The traditional method <em>in six steps</em>', titleWidth: 820,
        html: B2.edIndex(['Base wine', 'Tirage', 'Second fermentation', 'Lees ageing', 'Riddling', 'Disgorgement']),
        art: { svg: I.glass(150, 'sparkling') + I.grapes(190, 'white'), style: { right: 70, bottom: 150, display: 'flex', 'align-items': 'flex-end', gap: '6px' } } },
      { layout: 'content', kicker: 'Step 01',
        html: B2.edNum('01') + '<h2>Base wine</h2>'
          + B2.edP('Just-ripe grapes give <b>high acidity</b>, low sugar and delicate aromas. They are pressed gently, fermented to a dry still wine and <b>blended</b> across sites, grapes and years.')
          + B2.edFacts([{ v: '9–11%', t: 'abv in a typical base wine' }, { v: 'Cool', t: 'climates at the margin of ripening suit it best' }]) },
      { layout: 'content', kicker: 'Steps 02–03',
        html: B2.edNum('02') + '<h2>Tirage, <em>then a second fermentation</em></h2>'
          + B2.edP('<b>Liqueur de tirage</b> (wine, sugar, yeast, nutrients) goes into the base wine, and the bottle is closed with a crown cap. The yeast ferments the sugar <b>in the bottle the wine will be sold in</b>: the CO₂ stays trapped as bubbles.')
          + B2.edFacts([{ v: '≈ 6 atm', t: 'pressure built in the bottle' }, { v: '+1–2%', t: 'abv added by the second fermentation' }]) },
      { layout: 'content', kicker: 'Step 04',
        html: B2.edNum('04') + '<h2>Lees ageing</h2>'
          + B2.edP('The dead yeast cells break down: <b>autolysis</b>. It brings brioche and biscuit aromas. The effects show after the first year and keep building for years.')
          + B2.edFacts([{ v: '12 months', t: 'minimum on lees for non-vintage Champagne' }, { v: 'Brioche', t: 'biscuit, toast: the autolytic notes' }]) },
      { layout: 'content', kicker: 'Steps 05–06',
        html: B2.edNum('05') + '<h2>Riddling <em>and disgorgement</em></h2>'
          + B2.edP('<b>Riddling</b> moves the lees into the neck: by hand on pupitres (up to 8 weeks) or in gyropalettes (3–4 days). For <b>disgorgement</b> the neck is frozen and the pressure pushes out the plug of lees.')
          + B2.edFacts([{ v: 'Dosage', t: 'wine + sugar (liqueur d’expédition) sets the sweetness' }, { v: '0–12 g/L', t: 'sugar for Brut' }]) },
      { layout: 'cta', kicker: 'True or false?',
        title: '“Extra Dry” is sweeter <em>than Brut</em>', titleSize: 76,
        sub: 'True: Extra Dry is 12–17 g/L, Brut 0–12 g/L. Did you get it? Tell us below.', subWidth: 560,
        art: { svg: I.bottle(150, '#6e1532', -14), style: { right: 110, bottom: 140 } } },
    ],
  },

  /* ---------- 4. Spirits L2: Tequila vs Mezcal (photo cover + comparison) ---------- */
  {
    id: 'spirits-tequila-vs-mezcal', course: 'spirits', level: 2, tpl: 'photo',
    slides: [
      { layout: 'cover', kicker: 'Agave spirits',
        title: 'Tequila <em>vs</em> Mezcal', titleSize: 118,
        sub: 'Both start with agave. Here is what sets them apart.', subWidth: 760,
        photo: 'img/photos/blue-agave-field-jalisco-tequila.webp', photoPos: 'center 30%',
        photoCaption: 'An agave field in Jalisco, Mexico, seen from above.' },
      { layout: 'content', kicker: 'From plant to spirit',
        title: 'Agave first, <em>then the piña</em>',
        html: B.bullets([
          'Agave stores its reserves as <b>inulin</b> in its hard core.',
          'It flowers once after many years, then dies: growers harvest <b>just before flowering</b>.',
          'The leaves are trimmed, leaving the <b>piña</b>.',
          'Inulin cannot ferment as it is: the piña is <b>always cooked</b> first.',
        ]),
        art: { svg: I.agave(260), style: { right: 70, bottom: 140 } } },
      { layout: 'content', kicker: 'Side by side',
        title: 'Two <em>geographical indications</em>', titleSize: 64,
        html: B2.vs2('Tequila', 'Mezcal', [
          ['Agave', 'Only <b>blue agave</b>', 'Several species, mainly <b>espadín</b>'],
          ['Where', 'Five states, mainly <b>Jalisco</b>', 'Several states, mainly <b>Oaxaca</b>'],
          ['Cooking', 'Steamed: brick ovens or pressurised ovens', 'Often roasted in <b>stone-lined pits</b>: smoke'],
          ['Producers', 'Dominated by large companies', 'Dominated by small producers'],
        ]) },
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
        ]) },
      { layout: 'cta', kicker: 'Your pick',
        title: 'Team Tequila or <em>team Mezcal?</em>',
        sub: 'Tell us in the comments, and save this for your spirits exam.',
        art: { svg: I.agave(300), style: { right: 70, bottom: 150 } } },
    ],
  },

  /* ---------- 5. Beer L1: colour vs strength (myth vs fact) ---------- */
  {
    id: 'beer-colour-strength-myths', course: 'beer', level: 1, tpl: 'myth',
    slides: [
      { layout: 'cover', kicker: 'Myth or fact?',
        title: 'Dark beer is <em>always strong</em>…', titleWidth: 700,
        html: '<div class="bigmf" style="margin-top:30px"><div class="x">Myth.</div></div><div class="sub" style="max-width:440px">5 beer myths about colour and strength</div>',
        art: { svg: I.beer(180, '#f0c64a') + I.beer(180, '#2a1410'), style: { right: 70, bottom: 150, display: 'flex', gap: '14px', 'align-items': 'flex-end' } } },
      { layout: 'content', kicker: 'Myth 1',
        html: B2.mf({ myth: 'Dark beer is always strong.', fact: 'Colour comes from <em>malt</em>. Strength comes from <em>sugar</em>.', why: '<b>Speciality malts</b>, kilned hotter or roasted, give amber, brown or black. Alcohol depends on how much sugar the yeast ferments.' }) },
      { layout: 'content', kicker: 'Myth 2',
        html: B2.mf({ myth: 'Pale beer is always light.', fact: 'Tripel is <em>gold</em> and high to very high in alcohol.', why: 'Stronger than a <b>dubbel</b>, which is copper to brown.' }) },
      { layout: 'content', kicker: 'Myth 3',
        html: B2.mf({ myth: 'Every stout is a heavyweight.', fact: 'Porter and stout range from <em>low to very high</em> alcohol.', why: 'The very strong, roasty versions often carry the word <b>“imperial”</b>.' }) },
      { layout: 'content', kicker: 'Myth 4',
        html: B2.mf({ myth: 'Lager is always pale.', fact: 'Munich dunkel is a <em>copper to brown</em> lager.', why: 'Ale or lager depends on the <b>yeast</b>, not on the colour.' }) },
      { layout: 'content', kicker: 'Myth 5',
        html: B2.mf({ myth: 'A sour beer has gone off.', fact: 'In sour styles, the sourness is <em>on purpose</em>.', why: 'Bacteria such as <b>lactic acid bacteria</b> add the acidity. Berliner weisse: straw, hazy, low in alcohol.' }) },
      { layout: 'cta', kicker: 'The takeaway',
        title: 'Judge strength by the label, <em>not the colour</em>', titleSize: 70,
        html: B2.scale([{ v: '≤ 4%', t: 'low' }, { v: '4.1–5.9%', t: 'medium' }, { v: '6–9%', t: 'high' }, { v: '> 9%', t: 'very high' }])
          + '<div class="sub" style="margin-top:26px;max-width:880px">Which myth did you believe? Tell us below.</div>' },
    ],
  },

  /* ---------- 7. Wine L2: Bordeaux Left Bank vs Right Bank (map) ---------- */
  {
    id: 'wine-bordeaux-left-right-bank', course: 'wine', level: 2, tpl: 'map',
    slides: [
      { layout: 'cover', kicker: 'Bordeaux',
        title: 'Left Bank <em>vs</em> Right Bank', titleSize: 96,
        html: '<div style="margin-top:10px">' + B2.mapbox(map(690, { names: false, compact: true })) + '</div>' },
      { layout: 'content', kicker: 'The map',
        title: 'Two rivers, <em>one estuary</em>',
        sub: 'The Garonne and the Dordogne meet to form the Gironde.', subWidth: 900,
        html: B2.mapbox(map(780)) },
      { layout: 'content', kicker: 'Side by side',
        title: 'Gravel <em>or clay?</em>',
        html: B2.pair([
          { title: 'Left Bank', where: 'West & south of Gironde and Garonne', rows: [['Soil', 'Warm <b>gravel</b>'], ['Leads', '<b>Cabernet Sauvignon</b>, with Merlot'], ['Names', 'Haut-Médoc (Margaux, Pauillac), Graves (Pessac-Léognan)']] },
          { title: 'Right Bank', where: 'North & east of Gironde and Dordogne', rows: [['Soil', 'Cool <b>clay</b>'], ['Leads', '<b>Merlot</b>; Cabernet Franc too, in Saint-Émilion'], ['Names', 'Saint-Émilion, Pomerol']] },
        ]),
        art: { svg: I.grapes(150, 'red'), style: { right: 80, bottom: 120 } } },
      { layout: 'content', kicker: 'The why',
        title: 'Why gravel <em>suits Cabernet</em>',
        html: B.ladder([
          { n: '1', title: 'Rainy maritime climate', text: 'Late-ripening Cabernet struggles on the coolest sites.' },
          { n: '2', title: 'Gravel drains', text: 'Water runs away quickly after heavy rain.' },
          { n: '3', title: 'Gravel holds heat', text: 'It soaks up warmth by day and keeps the vineyard warm into the evening.' },
          { n: '★', title: 'Cool clay suits Merlot', text: 'It ripens earlier. Merlot is the most planted grape in all of Bordeaux.', hi: true },
        ]) },
      { layout: 'content', kicker: 'Quick quiz',
        title: 'Which one is <em>Merlot-led?</em>',
        html: B.options(['Pauillac', 'Pomerol', 'Margaux'], 'B')
          + B.note('<b>B · Pomerol</b>, on the Right Bank. Pauillac and Margaux are in the Haut-Médoc, on the Left Bank: Cabernet-led blends.'),
        goat: { src: G('goat-traveller-with-wine-map-and-suitcase'), style: { right: 70, bottom: 110, height: 250 } } },
      { layout: 'cta', kicker: 'Your turn',
        title: 'Team Left Bank or <em>team Right Bank?</em>',
        sub: 'Tell us in the comments and save the map for revision.',
        goat: { src: G('goat-resting-by-barrel-with-red-wine'), style: { right: 50, bottom: 110, height: 470 } } },
    ],
  },

  /* ---------- 9. Wine L3: how to answer a short written-answer question (typographic) ---------- */
  {
    id: 'wine-level3-short-answers', course: 'wine', level: 3, tpl: 'typo',
    slides: [
      { layout: 'cover', kicker: 'Written answers',
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
        title: 'Same facts, <em>more marks</em>', titleSize: 66,
        sub: 'Why does the Mosel make light, high-acid Riesling?', subWidth: 900,
        html: B2.wa('The Mosel is cold. Slate soils. Steep slopes. Riesling has high acidity.',
          'The cool climate <b>means</b> grapes ripen slowly and keep high acidity. Steep south-facing slopes <b>catch more sunlight</b>, helping ripening. Slate <b>absorbs heat by day and releases it at night</b>.') },
      { layout: 'cta', kicker: 'Over to you',
        title: 'What scares you most: <em>MCQs, written answers or tasting?</em>', titleSize: 66,
        sub: 'Tell us below. Save this for your next practice paper.',
        goat: { src: G('goat-with-glasses-and-pencil-on-wine-books'), style: { right: 50, bottom: 100, height: 400 } } },
    ],
  },

  /* ---------- 11. Wine L4 (Diploma): Sherry styles (flashcards) ---------- */
  {
    id: 'wine-sherry-styles', course: 'wine', level: 4, levelNote: 'Diploma', tpl: 'flash',
    slides: [
      { layout: 'cover', kicker: '',
        cardOpen: '<div class="card2 cover-card"><div class="kicker">Fortified wines · flashcards</div>', cardClose: '</div>',
        title: 'Sherry styles, <em>card by card</em>', titleSize: 100,
        sub: 'Flor or oxygen? That one choice shapes almost every style.', subWidth: 760,
        art: { svg: I.glass(110, 'sherry') + I.glass(110, 'amber') + I.glass(110, 'dark'), style: { right: 110, bottom: 140, display: 'flex', gap: '20px', 'align-items': 'flex-end' } } },
      { layout: 'content', kicker: 'Card 1 · The split',
        title: 'Two ways <em>to age</em>',
        html: B2.par({ b: 'Biological', t: 'under flor; fortified to 15–15.5%' }, 'or', { b: 'Oxidative', t: 'no flor; fortified to 17%' })
          + B.bullets(['<b>Flor</b> is a film of yeast: it needs no more than 15.5% abv and gives bread dough, almond and bruised apple.', 'Both age in a <b>solera</b>: fractional blending in old American oak butts.']) },
      { layout: 'content', kicker: 'Card 2',
        html: B2.card({ small: 'Biological only', title: 'Fino & Manzanilla', rows: [
          ['Colour', B2.chip('#f1e7b0') + 'Pale lemon'],
          ['Alcohol', '15–15.5%'],
          ['Aromas', 'Almond, herbs, bread dough'],
          ['Manzanilla', 'From <b>Sanlúcar de Barrameda</b>: thicker flor all year, lighter, with a salty note'],
        ] }) },
      { layout: 'content', kicker: 'Card 3',
        html: B2.minis([
          { small: 'Flor, then oxygen', title: 'Amontillado', items: ['Starts under flor, then ages oxidatively', 'Amber', 'Yeasty notes with walnut and caramel'] },
          { small: 'The in-between', title: 'Palo Cortado', items: ['The aromatic finesse of an Amontillado', 'The body of an Oloroso'] },
        ]) },
      { layout: 'content', kicker: 'Card 4',
        html: B2.card({ small: 'Oxidative only', title: 'Oloroso', rows: [
          ['Colour', B2.chip('#6b3a1e') + 'Brown'],
          ['Alcohol', '18–22%'],
          ['Body', 'Full'],
          ['Aromas', 'Walnut, toffee, spice, leather'],
        ] }) },
      { layout: 'content', kicker: 'Card 5 · Sweet',
        html: B2.minis([
          { small: 'Naturally sweet', title: 'Pedro Ximénez', items: ['Sun-dried grapes', 'At least 212 g/L sugar, usually 450–500', 'Almost black: raisin, molasses, liquorice'] },
          { small: 'Sweetened blend', title: 'Cream', items: ['Oloroso blended with PX', '115–140 g/L sugar'] },
        ]) + B.note('<b>Dry styles</b> (Fino, Manzanilla, Amontillado, Oloroso, Palo Cortado) have no more than 4 g/L.') },
      { layout: 'cta', kicker: 'Bonus card',
        title: 'VOS and <em>VORS</em>',
        sub: 'Average age of at least 20 years (VOS) and 30 years (VORS). Fino or Oloroso: which do you reach for?', subWidth: 620,
        art: { svg: I.glass(130, 'sherry') + I.glass(130, 'brown'), style: { right: 90, bottom: 140, display: 'flex', gap: '20px', 'align-items': 'flex-end' } } },
    ],
  },
];

/* =========================== REELS (1080x1920, 30 fps, light template) =========================== */
const grainRow = (items) => `<div style="display:flex;gap:30px;justify-content:center;align-items:flex-end">${items.map(([r, t]) => `<div style="display:flex;flex-direction:column;align-items:center;gap:8px">${I.grain(220, r)}<b style="font:800 40px/1 var(--serif);color:#3b3f8f">${t}</b></div>`).join('')}</div>`;
const reels = [
  { id: 'reel-wine-spanish-ageing-terms', course: 'wine', level: 2,
    cover: { t: 1.8 },
    scenes: [
      { start: 0, end: 2.8, kicker: 'Spanish label terms', title: 'Crianza, Reserva, <em>Gran Reserva</em>', titleSize: 92,
        caption: 'Three words on Spanish red labels. What do they mean?',
        art: { svg: I.grapes(260, 'red') + I.glass(170, 'red'), top: 1010 } },
      { start: 2.8, end: 6.4, kicker: 'Step 0', title: 'Joven',
        lines: ['<b>No minimum</b> ageing', 'In Rioja the term is <b>Genérico</b>'],
        caption: 'Joven: no minimum ageing. In Rioja you will see Genérico.',
        art: { svg: I.glass(190, 'red'), top: 1060 } },
      { start: 6.4, end: 10.2, kicker: 'Red wines', title: 'Crianza',
        lines: ['At least <b>24 months</b> in total', 'At least <b>6 in oak</b>'],
        caption: 'Crianza: at least 24 months, with 6 in oak.' },
      { start: 10.2, end: 14.0, kicker: 'Red wines', title: 'Reserva',
        lines: ['At least <b>36 months</b> in total', 'At least <b>12 in oak</b>'],
        caption: 'Reserva: at least 36 months, with 12 in oak.' },
      { start: 14.0, end: 17.8, kicker: 'Red wines', title: 'Gran Reserva',
        lines: ['At least <b>60 months</b> in total', 'At least <b>18 in oak</b>'],
        caption: 'Gran Reserva: at least 60 months, with 18 in oak.' },
      { start: 17.8, end: 21.6, kicker: 'Memory trick', title: '24 · 36 · 60', titleSize: 110,
        lines: ['Oak: <b>6 · 12 · 18</b> months', 'Many producers age for longer', 'Some regions, such as <b>Rioja</b>, require more'],
        caption: 'Total 24, 36, 60. Oak 6, 12, 18. Rioja asks for more.' },
      { start: 21.6, end: 24.2, kicker: 'Save it', title: 'Which one is <em>in your glass?</em>',
        lines: ['Practise free on <b>thewinegoat.com</b>'],
        caption: 'Tell us in the comments, and follow for more.',
        goat: { src: G('goat-on-wine-barrel-raising-red-wine'), h: 420, top: 960 } },
    ] },
  { id: 'reel-sake-polishing-ratio', course: 'sake', level: 1,
    cover: { t: 1.9 },
    scenes: [
      { start: 0, end: 2.8, kicker: 'Sake labels', title: 'Polishing ratio <em>in 20 seconds</em>', titleSize: 96,
        caption: 'That percentage on a sake label: what does it mean?',
        art: { svg: I.tokkuri(380), top: 1000 } },
      { start: 2.8, end: 6.8, kicker: 'The number', title: 'It is what <em>remains</em>',
        lines: ['“60%” = <b>60% of the grain is left</b>', '<b>40%</b> has been polished away'],
        vis: grainRow([[1, '100%'], [0.6, '60%']]),
        caption: 'The number is what is left of the grain, not what was removed.' },
      { start: 6.8, end: 10.8, kicker: 'Why polish?', title: 'The outer layers',
        lines: ['Bring more <b>acidity and umami</b>', 'Plus <b>cereal and lactic</b> aromas', 'The core is mostly <b>starch</b>'],
        caption: 'Outer layers add acidity, umami, cereal and lactic notes.' },
      { start: 10.8, end: 15.2, kicker: 'Premium grades', title: 'The limits',
        lines: ['Honjōzō · <b>70% or less</b>', 'Ginjō · <b>60% or less</b>', 'Daiginjō · <b>50% or less</b>'],
        caption: 'Honjōzō 70%, ginjō 60%, daiginjō 50%: the lower, the more polished.' },
      { start: 15.2, end: 19.2, kicker: 'The style', title: 'Fruity <em>and floral</em>',
        lines: ['Highly polished rice', '+ special yeasts + <b>cool fermentation</b>', '= apple, pear, white flowers'],
        vis: grainRow([[0.7, '70%'], [0.6, '60%'], [0.5, '50%']]),
        caption: 'Ginjō aromas need polished rice, special yeasts and a cool fermentation.' },
      { start: 19.2, end: 22.0, kicker: 'Save it', title: 'For your <em>sake exam</em>',
        lines: ['Practise free on <b>thewinegoat.com</b>'],
        caption: 'Follow for more sake basics.',
        art: { svg: I.tokkuri(360), top: 1010 } },
    ] },
  { id: 'reel-spirits-single-malt-scotch', course: 'spirits', level: 1,
    cover: { t: 1.9 },
    scenes: [
      { start: 0, end: 2.8, kicker: 'Whisky basics', title: 'Single Malt Scotch: <em>3 words</em>', titleSize: 94,
        caption: 'Three words on the label, three rules. Ready?',
        art: { svg: I.whisky(400), top: 990 } },
      { start: 2.8, end: 6.6, kicker: 'Word 1', title: 'Scotch',
        lines: ['<b>Distilled</b> in Scotland', '<b>Aged</b> in Scotland, at least <b>3 years</b> in oak'],
        caption: 'Scotch: distilled and aged in Scotland, at least three years in oak.' },
      { start: 6.6, end: 10.2, kicker: 'Word 2', title: 'Malt',
        lines: ['Only <b>malted barley</b>', 'Distilled in <b>pot stills</b>'],
        caption: 'Malt: only malted barley, distilled in pot stills.',
        art: { svg: I.barley(150, '#9a5f1e'), top: 1080 } },
      { start: 10.2, end: 13.8, kicker: 'Word 3', title: 'Single',
        lines: ['From <b>one distillery</b>', 'Not one barrel!'],
        caption: 'Single means one distillery, not one barrel.',
        art: { svg: I.potstill(360), top: 1060 } },
      { start: 13.8, end: 17.8, kicker: 'And Blended Scotch?', title: 'Malt <em>+ grain</em>', titleSize: 96,
        lines: ['Malt and grain whiskies', 'From <b>different distilleries</b>', 'Grain whisky: column still, <b>lighter</b>'],
        caption: 'Blended Scotch mixes malt and grain whiskies from different distilleries.' },
      { start: 17.8, end: 21.4, kicker: 'Bonus', title: 'Peat smoke',
        lines: ['From <b>peat</b> burned when the malted barley is dried', 'Only <b>a few</b> Single Malts are peaty'],
        caption: 'Smoky whisky? That is peat, and only a few Single Malts have it.' },
      { start: 21.4, end: 24.0, kicker: 'Save it', title: 'For your <em>spirits exam</em>',
        lines: ['Practise free on <b>thewinegoat.com</b>'],
        caption: 'Follow for more spirits basics.',
        art: { svg: I.whisky(360), top: 1010 } },
    ] },
  { id: 'reel-beer-ale-vs-lager', course: 'beer', level: 1,
    cover: { t: 1.9 },
    scenes: [
      { start: 0, end: 2.8, kicker: 'Beer basics', title: 'Ale or lager? <em>15 seconds</em>', titleSize: 96,
        caption: 'What really makes an ale an ale?',
        art: { svg: I.beer(240, '#f0c64a') + I.hop(170), top: 1010 } },
      { start: 2.8, end: 6.4, kicker: 'The answer', title: 'It is <em>the yeast</em>',
        lines: ['Ale yeast <b>→ ales</b>', 'Lager yeast <b>→ lagers</b>'],
        caption: 'Two yeasts, two families: ales and lagers.' },
      { start: 6.4, end: 10.4, kicker: 'Ale yeast', title: 'Fast <em>and fruity</em>',
        lines: ['Works <b>fast</b>, fairly <b>warm</b>', 'Many <b>fruity and spicy</b> aromas', 'e.g. weissbier, tripel, saison'],
        caption: 'Ale yeast: fast, warmer, lots of fruity and spicy aromas.',
        art: { svg: I.beer(230, '#d9a441'), top: 1110 } },
      { start: 10.4, end: 14.4, kicker: 'Lager yeast', title: 'Slow <em>and clean</em>',
        lines: ['<b>Slower</b> and <b>cooler</b>', 'Fewer strains, <b>less aroma</b>', 'e.g. pilsner, Munich helles'],
        caption: 'Lager yeast: slower, cooler, less aroma.',
        art: { svg: I.beer(230, '#f3d36a'), top: 1110 } },
      { start: 14.4, end: 18.2, kicker: 'Careful', title: 'Colour is <em>not the clue</em>', titleSize: 96,
        lines: ['Munich dunkel: a <b>copper to brown lager</b>', 'Blonde ale: a <b>straw to gold ale</b>'],
        caption: 'Dark lagers and pale ales both exist. Check the yeast, not the colour.',
        art: { svg: I.beer(200, '#7a3a14') + I.beer(200, '#f3d36a'), top: 1130 } },
      { start: 18.2, end: 20.8, kicker: 'Save it', title: 'For your <em>beer exam</em>',
        lines: ['Practise free on <b>thewinegoat.com</b>'],
        caption: 'Follow for more beer basics.',
        art: { svg: I.hop(200) + I.barley(120), top: 1030 } },
    ] },
];
// art blocks with two drawings side by side
for (const r of reels) for (const s of r.scenes) if (s.art && s.art.svg.split('<svg').length > 2) s.art.svg = `<div style="display:flex;gap:24px;align-items:flex-end">${s.art.svg}</div>`;

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
// Chosen so that neighbouring grid tiles rarely share a course or a layout.
const FX = 'social/instagram/batch-01-fixed';
const fixed = (id, label, reel = false) => ({ id, reel, dir: FX, label });
const feed = [
  fixed('a-same-grape-two-wines', 'Wine · Level 2'),
  'sake-how-sake-is-brewed',
  fixed('reel-1-three-grapes', 'Wine · Level 1', true),
  'spirits-tequila-vs-mezcal',
  'reel-wine-spanish-ageing-terms',
  'beer-colour-strength-myths',
  fixed('sancerre-quiz', 'Wine · Level 1'),
  'reel-sake-polishing-ratio',
  'wine-traditional-method',
  'reel-spirits-single-malt-scotch',
  'wine-bordeaux-left-right-bank',
  'reel-beer-ale-vs-lager',
  'wine-level3-short-answers',
  'wine-sherry-styles',
];

const B1 = 'social/instagram/batch-01';
const grid = {
  cols: 4,
  note: 'Newest first: batch 02 with the three corrected batch-01 items (14 feed posts), then the batch-01 posts that stay up (old carousel A and reel 1 removed). 4:5 tiles; reel covers centre-cropped. Badges show course and level; the coloured top line tells the course.',
  legend: [{ c: '#8c1d40', t: 'Wine' }, { c: '#9a5f1e', t: 'Spirits' }, { c: '#3b3f8f', t: 'Sake' }, { c: '#d4a23a', t: 'Beer' }],
  prev: [
    { id: 'b-quiz-which-grape' }, { id: 'e-serving-temperatures' },
    { id: 'c-pot-vs-column-still' }, { id: 'reel-2-neutral-spirit-96', reel: true }, { id: 'd-german-wine-label' }, { id: 'f-tasting-mistakes' },
  ].map((x) => ({ ...x, dir: B1, label: 'batch 01' })),
};

module.exports = { id: 'batch-02', out: 'social/instagram/batch-02', v2: true, reelTemplate: 'reel-light.html', slideRange: [5, 7], posts, stories, reels, feed, grid };
