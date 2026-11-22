// Instagram batch 03 — The Wine Goat (@the.winegoat). ENGLISH ONLY. Built for reach: saves, shares, comments, rewatches.
// 7 carousels (cheat sheet, X vs Y, myth or fact, mistakes, decision flow, Diploma cheat sheet), 7 reels
// (guess in 3 clues, rank by body, POV, red flags, spot the fault, this-or-that labels, guess the spirit) and
// 4 interactive story frames (poll, quiz, slider, quiz).
// Facts: app content (app/l1, app/l2, app/spirits/s1, app/spirits/s2, app/l4/d5) and the course books/specifications
// (sake and beer Level 1, Level 3 wine textbook, D5, Level 1–4 wine specifications). Nothing on prices; no affiliation.
// Imagery rules: no wine imagery on Spirits/Sake/Beer; white-wine topics use white grapes / pale wine; painted goats only
// on red-wine topics (traveller goat neutral) and only occasionally; real photos only where they show exactly the subject.
'use strict';
const { B, B2 } = require('../lib/render');
const D = require('../lib/illus2');
const E = require('../lib/illus3');
const { PH } = require('../lib/photos');

const G = (name) => `img/goats/${name}.webp`;
const inl = (svg, { justify = 'flex-end', mt = 'auto', gap = 24, pad = 0 } = {}) => `<div style="margin-top:${mt};display:flex;justify-content:${justify};align-items:flex-end;gap:${gap}px;padding:0 ${pad}px">${svg}</div>`;
const ICON = {
  save: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"><path d="M6 3h12v18l-6-4.5L6 21z"/></svg>',
  share: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"><path d="M22 3 2 10.5l8 2.8L13 21z"/><path d="M22 3 10 13.3"/></svg>',
};
const acts = (share = 'Share with your study buddy') => `<div class="acts"><span><i>${ICON.save}</i>Save this</span><span><i>${ICON.share}</i>${share}</span></div>`;
// standard last slide: comment question + Save / Share / Practise free
const cta = (o) => ({ layout: 'cta', kicker: o.kicker || 'Before you go', title: o.title, titleSize: o.titleSize || 76, titleWidth: o.titleWidth || 860,
  sub: o.sub, subWidth: o.subWidth || 760, html: acts(o.share), cta: 'Practise free on thewinegoat.com', goat: o.goat, art: o.art });
const tip = (l, t) => `<div class="tip"><small>${l}</small><p>${t}</p></div>`;
const ans = '<div class="sub" style="margin-top:22px;font-size:30px">Answer on the next slide</div>';

const P = {
  pergola: PH('grapevine-pergola-crete', 'Bunches of black grapes hanging from a vine pergola in Crete.'),
  rabelo: PH('rabelo-boat-port-barrels-douro', 'A rabelo boat loaded with barrels on the Douro, in front of Porto.'),
  bottles: PH('1076-brewing-beer-bottles-2018-g1', 'Empty bottles in brown, olive, green and blue glass, with coloured shadows.'),
  corkscrews: PH('three-corkscrews-old-and-modern', 'Three corkscrews on a wooden table, two modern and one old.'),
  whiteGrapes: PH('ripe-white-grapes-close-up-stuttgart', 'Ripe pale-green grapes hanging from a vine.'),
  mosel: PH('mosel-river-vineyards-neumagen-dhron', 'The Mosel river between vine-covered slopes at Neumagen-Dhron, Germany.'),
  coriander: PH('coriander-seeds-close-up', 'Close-up of dried coriander seeds.'),
  citrus: PH('citrus-fruit-slices-backlit', 'Backlit slices of orange, lemon and lime.'),
};

/* =========================== FEED CAROUSELS (1080x1350) =========================== */
const posts = [
  /* ---------- 1. Wine L2: black grapes cheat sheet + test yourself ---------- */
  {
    id: 'wine-black-grapes-cheat-sheet', bg: 'burgundy', course: 'wine', level: 2, tpl: 'flash',
    imagery: 'Photo (cover): black grapes on a vine pergola in Crete; drawings: black grapes, red wine glasses; goat with glasses and pencil on wine books (CTA)',
    photos: [P.pergola],
    slides: [
      { layout: 'cover', tile: { variant: 'arch', photo: P.pergola.src, pos: '70% 40%', tone: 'burgundy',
          head: '6 black grapes.<br><em>1 cheat sheet.</em>', headSize: 92, sub: 'Save this before your exam', archH: 660 } },
      { layout: 'content', kicker: 'Cheat sheet · 1 of 2', title: 'The <em>structured</em> three', titleSize: 64,
        html: `<div class="cheat">
          <div class="cr"><h3>Cabernet Sauvignon</h3><div class="chips"><span class="hi">Tannin high</span><span class="hi">Acidity high</span></div><div class="ar"><b>Blackcurrant</b>, black cherry, green bell pepper, mint</div><div class="wh">Bordeaux Left Bank · Chile’s most planted grape</div></div>
          <div class="cr"><h3>Syrah <small>= Shiraz</small></h3><div class="chips"><span>Tannin medium–high</span><span>Acidity medium–high</span></div><div class="ar"><b>Black fruit</b> and <b>black pepper</b></div><div class="wh">Northern Rhône · Barossa (full-bodied Shiraz)</div></div>
          <div class="cr"><h3>Tempranillo</h3><div class="chips"><span>Medium acidity</span><span>Medium tannin</span><span>Medium–full body</span></div><div class="ar"><b>Strawberry</b>, red cherry + blackberry, black plum</div><div class="wh">Rioja: blends led by Tempranillo</div></div>
        </div>` },
      { layout: 'content', kicker: 'Cheat sheet · 2 of 2', title: 'The <em>softer</em> three', titleSize: 64,
        html: `<div class="cheat">
          <div class="cr"><h3>Merlot</h3><div class="chips"><span>Tannin medium</span><span>Acidity medium</span></div><div class="ar">Brings <b>softness</b> and body; just ripe: <b>strawberry</b></div><div class="wh">Bordeaux Right Bank: Saint-Émilion, Pomerol</div></div>
          <div class="cr"><h3>Pinot Noir</h3><div class="chips"><span class="hi">Acidity high</span><span>Tannin low–medium</span><span>Pale–medium colour</span></div><div class="ar"><b>Strawberry</b>, raspberry, red cherry</div><div class="wh">Burgundy · Central Otago</div></div>
          <div class="cr"><h3>Grenache <small>= Garnacha</small></h3><div class="chips"><span>High sugar</span><span>Low acidity</span></div><div class="ar"><b>Strawberry</b>, red plum, red cherry; white pepper</div><div class="wh">Southern Rhône · Priorat · Barossa</div></div>
        </div>` },
      { layout: 'content', kicker: 'Test yourself · 1', title: 'Pale, high acidity, <em>strawberry and raspberry.</em> Which grape?', titleSize: 56,
        center: true, html: B.options(['Grenache', 'Pinot Noir', 'Shiraz']) + ans + inl(D.glassPhoto(140, 'lightred'), { justify: 'center', mt: '8px' }) },
      { layout: 'content', kicker: 'Answer 1', title: 'B · <em>Pinot Noir</em>', titleSize: 84,
        html: B.options(['Grenache', 'Pinot Noir', 'Shiraz'], 'B') + B.note('Thin skins give a <b>pale to medium</b> colour; acidity stays <b>high</b> and tannin <b>low to medium</b>.') + inl(D.grapes(180, 'red', { seed: 8 }), { justify: 'center', mt: '12px' }), center: true },
      { layout: 'content', kicker: 'Test yourself · 2', title: 'Black fruit, black pepper, <em>Northern Rhône.</em> Which grape?', titleSize: 56,
        center: true, html: B.options(['Syrah', 'Tempranillo', 'Cabernet Sauvignon']) + ans + inl(D.glassPhoto(130, 'deepred'), { justify: 'center', mt: '8px' }) },
      { layout: 'content', kicker: 'Answer 2', title: 'A · <em>Syrah</em>', titleSize: 84,
        html: B.options(['Syrah', 'Tempranillo', 'Cabernet Sauvignon'], 'A') + B.note('Same grape as <b>Shiraz</b>. Moderate climates: medium body, fresh black fruit, pepper. Warm Australian regions: <b>full-bodied</b>, riper.') + inl(D.grapes(150, 'red', { seed: 12 }), { justify: 'center', mt: '12px' }), center: true },
      cta({ title: 'Which two grapes <em>do you mix up?</em>', titleSize: 72, titleWidth: 720, sub: 'Tell us in the comments.', subWidth: 760,
        goat: { src: G('goat-with-glasses-and-pencil-on-wine-books'), style: { right: 50, bottom: 100, height: 360 } } }),
    ],
  },

  /* ---------- 2. Spirits L2: Cognac vs Armagnac ---------- */
  {
    id: 'spirits-cognac-vs-armagnac', bg: 'course', course: 'spirits', level: 2, tpl: 'photo',
    imagery: 'Solid whisky-brown cover with drawings of a copper pot still (Cognac) and a short copper column still (Armagnac); drawings: brandy bottle and nosing glass',
    slides: [
      { layout: 'cover', tile: { variant: 'solid', arc: 'Cognac vs Armagnac', arcSize: 78,
          art: D.row([D.potStill(380), E.columnStill(200)], 50), artTop: 560, sub: 'Two French grape brandies. Spot the difference.' } },
      { layout: 'content', kicker: 'What they share', title: 'Same family, <em>same grape</em>', center: true,
        html: B.bullets([
          'Both are <b>French grape brandies</b>, distilled from wine.',
          '<b>Ugni Blanc</b> is the most planted grape in both.',
          'Both mature in <b>oak</b>; every Cognac spends at least <b>two years</b> there.',
          'Both use age terms such as <b>VS, VSOP, XO</b> (Armagnac’s minimum ages differ slightly).',
        ]) + inl(D.row([D.whiskyBottle(120), D.glencairn(130)], 20), { mt: '30px' }) },
      { layout: 'content', kicker: 'Side by side', title: 'Where they <em>part ways</em>', titleSize: 66, center: true,
        html: B2.vs2('Cognac', 'Armagnac', [
          ['Where', 'Just <b>north</b> of Bordeaux', '<b>South</b> of Bordeaux'],
          ['Still', 'Copper <b>pot stills</b>, twice, over a direct flame', 'Almost always a <b>short column</b>: low strength, full of character'],
          ['Grapes', 'Ugni Blanc dominates', 'More <b>Baco</b> and <b>Folle Blanche</b> too'],
          ['Producers', 'Four big companies dominate', '<b>Small producers</b>; “Château” = one small estate'],
        ]) },
      { layout: 'content', kicker: 'Only in Armagnac (mostly)', title: 'Two styles <em>to remember</em>', center: true,
        html: B2.minis([
          { small: 'Common here, rare in Cognac', title: 'Vintage', items: ['Grapes from a <b>single harvest</b>', 'Not a blend of ages'] },
          { small: 'Never sees oak', title: 'Blanche', items: ['Made like other Armagnacs', 'Bottled <b>colourless</b>'] },
        ]) + inl(E.columnStill(200), { justify: 'center', mt: '8px' }) },
      { layout: 'content', kicker: 'Test yourself', title: 'A brandy smells of <em>prunes.</em> Which grape is the clue?', titleSize: 56,
        center: true, html: B.options(['Ugni Blanc', 'Baco', 'Folle Blanche']) + ans + inl(D.row([D.whiskyBottle(105), D.glencairn(120)], 30), { justify: 'center', mt: '8px' }) },
      { layout: 'content', kicker: 'Answer', title: 'B · <em>Baco</em>', titleSize: 84,
        html: B.options(['Ugni Blanc', 'Baco', 'Folle Blanche'], 'B') + B.note('Baco gives the <b>prune</b> note of many Armagnacs. Folle Blanche: pronounced floral and fruity. Ugni Blanc, once distilled: <b>raisin and violet</b>.') + inl(D.glencairn(125), { justify: 'center', mt: '10px' }), center: true },
      cta({ title: 'Team Cognac or <em>team Armagnac?</em>', titleSize: 74, titleWidth: 720, sub: 'Tell us in the comments.', subWidth: 760,
        art: { svg: D.row([D.potStill(300), E.columnStill(160)], 20), style: { right: 60, bottom: 120 } } }),
    ],
  },

  /* ---------- 3. Sake L1: myth or fact ---------- */
  {
    id: 'sake-myth-or-fact', bg: 'course', course: 'sake', level: 1, tpl: 'myth',
    imagery: 'Editorial cut-out cover: drawings of a sake flask (tokkuri), a sake cup (o-choko) and a cedar box (masu); drawings in the slides',
    slides: [
      { layout: 'cover', tile: { variant: 'edit', head: 'Sake <em>myths</em>', headSize: 150, sub: '5 things people get wrong about sake.', gap: 40,
          items: [{ svg: D.tokkuri(330), h: 380, label: 'Tokkuri' }, { svg: E.ochoko(170), h: 380, label: 'O-choko' }, { svg: E.masu(230), h: 380, label: 'Masu' }] } },
      { layout: 'content', kicker: 'Myth 1',
        html: B2.mf({ myth: 'Sake is always served hot.', fact: 'Fruity premium styles are best <em>chilled</em>.', why: 'Ginjō styles lose aroma when heated. Futsū-shu, junmai and honjōzō can also be served <b>warm</b> (40–50°C): it makes them seem richer.' })
          + inl(D.tokkuri(300), { justify: 'center', mt: '40px' }) },
      { layout: 'content', kicker: 'Myth 2',
        html: B2.mf({ myth: 'Sake gets better with age, like fine wine.', fact: 'Most sake is best <em>within a year</em> of release.', why: 'After that it typically loses freshness. Aged sake, <b>koshu</b>, is a speciality style: often amber, with nuts and dried fruit.' })
          + inl(E.ochoko(250), { justify: 'center', mt: '50px' }) },
      { layout: 'content', kicker: 'Myth 3',
        html: B2.mf({ myth: 'Sake is always clear.', fact: '<em>Nigori</em> is cloudy on purpose.', why: 'It is <b>roughly filtered</b>, so rice particles stay in the sake: from lightly cloudy to thick, with lumps of rice.' })
          + inl(E.ochoko(250), { justify: 'center', mt: '50px' }) },
      { layout: 'content', kicker: 'Myth 4',
        html: B2.mf({ myth: 'The wooden masu is the best way to drink it.', fact: 'The cedar <em>adds flavour</em> to the sake.', why: 'Small, <b>tulip-shaped glasses</b> are ideal for premium sake. The masu was used to measure rice; it appears at ceremonial occasions.' })
          + inl(E.masu(320), { justify: 'center', mt: '40px' }) },
      { layout: 'content', kicker: 'Myth 5',
        html: B2.mf({ myth: 'Store sake on its side, like wine.', fact: 'Keep it <em>upright, cool and dark</em>.', why: 'Heat and strong light damage sake. Once open, keep it in the fridge: usually <b>about two weeks</b>, ginjō styles about one.' })
          + inl(D.tokkuri(290), { justify: 'center', mt: '30px' }) },
      cta({ title: 'How many <em>did you believe?</em>', sub: 'Comment your score from 0 to 5.', subWidth: 760,
        art: { svg: D.tokkuri(400), style: { right: 60, bottom: 120 } } }),
    ],
  },

  /* ---------- 4. Beer L1: 5 serving mistakes ---------- */
  {
    id: 'beer-five-serving-mistakes', bg: 'course', course: 'beer', level: 1, tpl: 'myth',
    imagery: 'Photo (cover): empty bottles in brown, olive, green and blue glass; drawings: beer bottles in brown, green and clear glass, beer glasses',
    photos: [P.bottles],
    slides: [
      { layout: 'cover', tile: { variant: 'arch', photo: P.bottles.src, pos: 'center 40%', tone: 'course',
          head: '5 beer mistakes <em>you can taste</em>', headSize: 88, sub: 'Storage and serving, fixed in one swipe', archH: 640 } },
      { layout: 'content', center: true,
        html: '<div class="bign"><div class="n gt">1</div><div class="t">Keeping it <br>in the light</div></div>'
          + tip('What happens', '<b>Light strike</b>: light reacts with hop compounds and gives a skunky, scorched-hair aroma.')
          + tip('The fix', '<b>Brown</b> glass blocks almost all damaging light. Green or clear glass offers little or none: keep those in closed boxes.')
          + inl(D.row([E.beerBottle(100, 'brown'), E.beerBottle(100, 'green'), E.beerBottle(100, 'clear')], 46), { justify: 'center', mt: '26px' }) },
      { layout: 'content', center: true,
        html: '<div class="bign"><div class="n gt">2</div><div class="t">Saving it <br>“for later”</div></div>'
          + tip('What happens', 'Most beers are best <b>fresh</b>. Hop aroma and bitterness fade; paper or wet-cardboard notes appear.')
          + tip('The fix', 'Check the <b>bottled-on</b> or <b>best-before</b> date. Keep beer cool, ideally in the fridge.')
          + inl(D.row([D.beerGlass(130, 'gold', { seed: 51 }), D.barley(90, 5)], 20), { justify: 'center', mt: '26px' }) },
      { layout: 'content', center: true,
        html: '<div class="bign"><div class="n gt">3</div><div class="t">Bubbles stuck <br>to the glass</div></div>'
          + tip('What it means', 'The glass is <b>not completely clean</b>.')
          + tip('The fix', 'An odourless glass with no residue: no detergent, no dishwasher salts, no dirty polishing cloth.')
          + inl(D.beerGlass(150, 'straw', { seed: 52 }), { justify: 'center', mt: '26px' }) },
      { layout: 'content', center: true,
        html: '<div class="bign"><div class="n gt">4</div><div class="t">Pouring <br>straight down</div></div>'
          + tip('The fix', 'Glass at <b>45°</b>, pour down the side. At about <b>50–70%</b> full, stand it upright and pour into the centre to build the <b>foam</b>.')
          + tip('Bottle-conditioned?', 'Pour gently; stop when the yeast sediment reaches the neck. Weissbier and witbier: roll the bottle, pour it all.') + inl(D.beerGlass(150, 'hazy', { shape: 'weizen', seed: 53 }), { justify: 'center', mt: '30px' }) },
      { layout: 'content', center: true,
        html: '<div class="bign"><div class="n gt">5</div><div class="t">Serving every <br>beer ice-cold</div></div>'
          + '<div class="temps"><div><b>3–7°C</b><i>Well chilled</i><span>Pilsner, international lager, weissbier</span></div><div><b>7–12°C</b><i>Chilled</i><span>Porter, American pale ale, IPA</span></div><div><b>12–15°C</b><i>Lightly chilled</i><span>Barley wine, dubbel</span></div></div>'
          + '<div class="sub" style="margin-top:24px;font-size:31px;max-width:900px">Stronger, more aromatic styles: a little warmer. Personal taste still counts.</div>' + inl(D.row([D.beerGlass(130, 'straw', { seed: 61 }), D.beerGlass(130, 'black', { seed: 62 }), D.beerGlass(130, 'copper', { shape: 'goblet', seed: 63 })], 110), { justify: 'center', mt: '34px' }) },
      cta({ title: 'Which one <em>are you guilty of?</em>', sub: 'Tell us 1 to 5 in the comments.', subWidth: 760, share: 'Send to your beer buddy',
        art: { svg: D.row([D.beerGlass(190, 'amber', { seed: 54 }), E.beerBottle(130, 'brown')], 20), style: { right: 70, bottom: 120 } } }),
    ],
  },

  /* ---------- 5. Wine Levels 1–4: which level is right for you? (decision flow) ---------- */
  {
    id: 'wine-which-level-is-right', bg: 'cream', course: 'wine', level: 1, badge: 'Wine · Levels 1–4', tpl: 'flow',
    imagery: 'Solid cream cover with the traveller goat (neutral); typographic decision flow',
    slides: [
      { layout: 'cover', tile: { variant: 'solid', tone: 'cream', arc: 'Which level is right for you?', arcSize: 62, arcR: 1400, arcY: 1720,
          art: `<img src="${G('goat-traveller-with-wine-map-and-suitcase')}" style="height:440px" alt="">`, artTop: 520,
          sub: 'A 30-second decision flow, Level 1 to Diploma' } },
      { layout: 'content', kicker: 'Start here', title: 'Answer <em>yes</em> to the first one that fits', titleSize: 58,
        html: `<div class="lv">
          <div class="q"><p><small>Question 1</small>New to wine? You want the basics: main grapes, styles and serving.</p><b><small>Yes</small>Level 1</b></div><div class="no">No ↓</div>
          <div class="q"><p><small>Question 2</small>You want to read labels and know the key grapes and regions.</p><b><small>Yes</small>Level 2</b></div><div class="no">No ↓</div>
          <div class="q"><p><small>Question 3</small>You want to explain <i>why</i> a wine tastes as it does, and blind taste.</p><b><small>Yes</small>Level 3</b></div><div class="no">No ↓</div>
          <div class="q"><p><small>Question 4</small>You hold Level 3 and want the deep dive.</p><b><small>Yes</small>Diploma</b></div>
        </div>` },
      { layout: 'content', kicker: 'Level 1', title: 'The <em>first step</em>', center: true,
        html: B2.edFacts([{ v: 'None', t: 'entry requirements' }, { v: '6 h', t: 'total study time' }, { v: '30 MCQ', t: 'in 45 minutes' }])
          + B.note('The key stages of grape growing and winemaking, the main grapes and styles, and how to store and serve wine.') + inl(D.row([D.glassPhoto(140, 'pale'), D.glassPhoto(140, 'ruby')], 40), { justify: 'center', mt: '40px' }) },
      { layout: 'content', kicker: 'Level 2', title: 'Grapes, regions, <em>labels</em>', center: true,
        html: B2.edFacts([{ v: 'None', t: 'entry requirements' }, { v: '28 h', t: '17 guided + 11 private study' }, { v: '50 MCQ', t: 'in 60 minutes' }])
          + B.note('<b>Pass</b> from 55%, <b>Pass with Merit</b> from 70%, <b>Pass with Distinction</b> from 85%.') + inl(D.row([E.labelBottle(130, { glass: 'flint', wine: 'white', big: 'Chablis', small: 'APPELLATION CHABLIS CONTRÔLÉE' }), E.labelBottle(130, { top: 'Spain', big: 'Rioja', small: 'DOCa' })], 50), { justify: 'center', mt: '34px' }) },
      { layout: 'content', kicker: 'Level 3', title: 'The <em>why</em> behind the style', center: true,
        html: B2.edFacts([{ v: 'Level 2', t: 'or equivalent, recommended' }, { v: '84 h', t: '32.5 guided + 51.5 private study' }])
          + B.note('<b>Theory:</b> 50 multiple-choice questions plus short written answers.<br><b>Tasting:</b> a blind tasting of <b>2 wines</b> in 30 minutes.') + inl(`<div class="glabs" style="gap:60px"><figure>${D.glassPhoto(115, 'pale')}<figcaption>1</figcaption></figure><figure>${D.glassPhoto(115, 'ruby')}<figcaption>2</figcaption></figure></div>`, { justify: 'center', mt: '30px' }) },
      { layout: 'content', kicker: 'Diploma (Level 4)', title: 'The <em>deep dive</em>', center: true,
        html: B2.edFacts([{ v: 'Level 3', t: 'required to enrol' }, { v: '6 units', t: 'D1 to D6' }, { v: '500 h', t: 'total qualification time' }])
          + B.note('Wine production, the wine business, wines of the world, sparkling, fortified and an independent research assignment.') + inl(D.row([D.flute(90), D.glassPhoto(130, 'ruby'), D.glassPhoto(130, 'tawny'), D.glassPhoto(130, 'pale')], 30), { justify: 'center', mt: '40px' }) },
      cta({ kicker: 'Your turn', title: 'Where are you <em>right now?</em>', sub: 'Comment L1, L2, L3 or D, and the date of your exam.', subWidth: 760, share: 'Send to a friend who keeps asking',
        goat: { src: G('goat-traveller-with-wine-map-and-suitcase'), style: { right: 60, bottom: 110, height: 420 } } }),
    ],
  },

  /* ---------- 6. Wine L3: myth or fact ---------- */
  {
    id: 'wine-myth-or-fact', bg: 'course', course: 'wine', level: 3, tpl: 'myth',
    imagery: 'Photo (cover): three corkscrews on a wooden table, in a thin frame; drawings: wine glasses, bottles, black grapes, flute',
    photos: [P.corkscrews],
    slides: [
      { layout: 'cover', tile: { variant: 'frame', photo: P.corkscrews.src, pos: 'center 55%', tone: 'course',
          head: '5 wine “facts” <em>that are wrong</em>', headSize: 86, sub: 'Myth or fact? Keep score.' } },
      { layout: 'content', kicker: 'Myth 1',
        html: B2.mf({ myth: 'Thick legs mean a better wine.', fact: 'Legs show <em>alcohol and sugar</em>.', why: 'Wines with sugar or high alcohol are more viscous: thicker, slower legs. Quality is judged on <b>balance, length, intensity and complexity</b>.' })
          + inl(D.glassPhoto(150, 'ruby'), { justify: 'center', mt: '24px' }) },
      { layout: 'content', kicker: 'Myth 2',
        html: B2.mf({ myth: 'All wine gets better with age.', fact: 'Most wines are best <em>within a year</em> of bottling.', why: 'Ageing them costs fresh fruit. Some, such as <b>Vintage Port</b>, need years in bottle to show their best.' })
          + inl(D.bottle(110, { label: true }), { justify: 'center', mt: '24px' }) },
      { layout: 'content', kicker: 'Myth 3',
        html: B2.mf({ myth: 'A screwcap means a cheap wine.', fact: 'The closure is a <em>winemaking choice</em>.', why: 'Screwcaps do not taint the wine and keep <b>fresh fruit</b> longer than cork, for whites and reds. Acceptance still varies from market to market.' })
          + inl(D.row([D.bottle(92, { label: true }), E.cork(72)], 40), { justify: 'center', mt: '12px' }) },
      { layout: 'content', kicker: 'Myth 4',
        html: B2.mf({ myth: 'White wine needs white grapes.', fact: 'Black grapes can make <em>white wine</em>.', why: 'The colour is in the <b>skins</b>, not the pulp. Pressed gently and fermented without the skins, the juice stays almost colourless.' })
          + inl(D.row([D.grapes(160, 'red', { seed: 21, leafOn: false }), D.glassPhoto(115, 'pale')], 40), { justify: 'center', mt: '20px' }) },
      { layout: 'content', kicker: 'Myth 5',
        html: B2.mf({ myth: 'More bubbles = a better sparkling wine.', fact: 'Bubbles say little about <em>quality</em>.', why: 'Several factors, above all <b>how clean the glass is</b>, change how the bubbles look, so they cannot reliably show quality.' })
          + inl(D.flute(105), { justify: 'center', mt: '36px' }) },
      cta({ title: 'Which one <em>fooled you?</em>', sub: 'Comment your score from 0 to 5.', subWidth: 760,
        art: { svg: D.row([D.glassPhoto(170, 'ruby'), D.glassPhoto(170, 'pale')], 24), style: { right: 70, bottom: 120 } } }),
    ],
  },

  /* ---------- 7. Wine L4 (Diploma): Port styles cheat sheet ---------- */
  {
    id: 'wine-port-styles', bg: 'burgundy', course: 'wine', level: 4, levelNote: 'Diploma', tpl: 'flash',
    imagery: 'Photo (cover): a rabelo boat loaded with barrels on the Douro at Porto; drawings: ruby and tawny glasses; goat winking with a glass of red wine (CTA)',
    photos: [P.rabelo],
    slides: [
      { layout: 'cover', tile: { variant: 'arch', photo: P.rabelo.src, pos: 'center 55%', tone: 'burgundy',
          head: 'Ruby or Tawny? <em>Port, decoded</em>', headSize: 90, sub: 'The D5 cheat sheet: save it', archH: 660 } },
      { layout: 'content', kicker: 'The split', title: 'Two families', center: true,
        html: B2.par({ b: 'Ruby styles', t: 'protective: deep colour, primary fruit' }, 'or', { b: 'Aged Tawny', t: 'years in small old casks: colour fades' })
          + B.bullets(['Aged Tawny gains <b>dried fruit</b>, coffee, caramel and walnut; the old casks add no oak flavour.', 'A <b>basic Tawny</b> gets its pale colour from light extraction, not from long ageing.'])
          + inl(D.row([D.glassPhoto(130, 'ruby'), D.glassPhoto(130, 'tawny')], 40), { justify: 'center', mt: 'auto' }) },
      { layout: 'content', kicker: 'Ruby family',
        html: B2.card({ small: 'From simple to serious', title: 'Ruby styles', rows: [
          ['Ruby', 'Up to <b>3 years</b> in large vessels; simple, fruity'],
          ['Reserve', 'Higher quality, panel-approved; no minimum age'],
          ['LBV', 'One vintage, bottled <b>4–6 years</b> after harvest; most are filtered'],
          ['Crusted', 'Several vintages, unfiltered: forms a crust'],
          ['Vintage', '<b>Declared</b> years only; most bottled after 18–20 months in wood'],
        ] }) },
      { layout: 'content', kicker: 'Tawny family',
        html: B2.card({ small: 'Oxidative ageing', title: 'Tawny styles', rows: [
          ['Basic', 'Light extraction; aged about as long as Ruby'],
          ['Reserve', 'At least <b>6 years</b> in wood'],
          ['10–50 years', 'An indication of age: <b>10, 20, 30, 40 or 50</b>'],
          ['Colheita', 'One vintage, at least <b>7 years</b> in small old casks'],
        ] }) + inl(D.glassPhoto(120, 'tawny'), { mt: '30px', pad: 30 }) },
      { layout: 'content', kicker: 'Spot the trap', title: '“20 Year Old Tawny”: every drop is <em>at least 20?</em>', titleSize: 62,
        center: true, html: B.options(['Yes, 20 is the minimum', 'No, it is closer to an average']) + ans + inl(D.row([D.glassPhoto(140, 'tawny'), D.glassPhoto(140, 'tawny'), D.glassPhoto(140, 'tawny')], 40), { justify: 'center', mt: '40px' }) },
      { layout: 'content', kicker: 'Answer', title: 'B · <em>An average, roughly</em>', titleSize: 76,
        html: B.options(['Yes, 20 is the minimum', 'No, it is closer to an average'], 'B') + B.note('It blends batches <b>younger and older</b> than 20 years. A tasting panel checks it shows the character of that age. Need one single year? That is a <b>Colheita</b>.') + inl(D.glassPhoto(130, 'tawny'), { justify: 'center', mt: '24px' }), center: true },
      cta({ title: 'Ruby or Tawny: <em>which is yours?</em>', titleSize: 72, titleWidth: 700, sub: 'Tell us in the comments.', subWidth: 760,
        goat: { src: G('goat-winking-with-glass-of-red-wine'), style: { right: 60, bottom: 110, height: 430 } } }),
    ],
  },
];

/* =========================== REELS (1080x1920, 30 fps, viral template) =========================== */
const ph = (p, o = {}) => ({ src: p.src, pos: o.pos || 'center', h: o.h || 1000, textTop: o.textTop });
const glabs = (items, gap = 40) => `<div class="glabs" style="gap:${gap}px">${items.map(([svg, l, w]) => `<figure>${svg}<figcaption class="${w ? 'w' : ''}">${l}</figcaption></figure>`).join('')}</div>`;
const end = { music: undefined, fadeOut: 0.6 };

const reels = [
  /* R1 · Wine L1: rank by body */
  { id: 'reel-wine-rank-by-body', bg: 'cream', course: 'wine', level: 1, ...end,
    imagery: 'Drawings: near-photographic red wine glasses (pale, medium and deep ruby) and a gold glass (Sauternes); goat raising a glass of red wine (end card)',
    tile: { variant: 'edit', head: 'Lightest <em>to fullest?</em>', headSize: 136, sub: 'Rank these 3 reds by body. No peeking.', gap: 46, reelHint: true,
      items: [{ svg: D.glassPhoto(150, 'ruby'), h: 370, label: 'A' }, { svg: D.glassPhoto(150, 'ruby'), h: 370, label: 'B' }, { svg: D.glassPhoto(150, 'ruby'), h: 370, label: 'C' }] },
    scenes: [
      { start: 0, end: 2.4, hook: true, kicker: 'Body test · Level 1', title: 'Rank these <em>lightest → fullest</em>', titleSize: 104,
        lines: [{ html: '<b>A</b> · Californian Cabernet Sauvignon', at: -1 }, { html: '<b>B</b> · Beaujolais', at: -1 }, { html: '<b>C</b> · Côtes du Rhône', at: -1 }],
        caption: 'Three reds. Which is lightest, which is fullest?' },
      { start: 2.4, end: 5.4, kicker: 'Your turn', title: 'Lock in <em>your order</em>',
        lines: [{ html: '<b>A</b> · Californian Cabernet Sauvignon', at: -1 }, { html: '<b>B</b> · Beaujolais', at: -1 }, { html: '<b>C</b> · Côtes du Rhône', at: -1 }],
        timer: { at: 0, n: 3, top: 1100, label: 'Pause and rank' }, caption: 'Comment your order before the reveal!' },
      { start: 5.4, end: 7.2, kicker: 'Quick reminder', title: 'Body = how <em>mouth-filling</em> it feels', titleSize: 92,
        lines: ['Judged on the <b>palate</b>, not by the colour'], caption: 'Light feels delicate. Full feels dense and rich.' },
      { start: 7.2, end: 9.0, kicker: 'Lightest', title: '<em>B</em> · Beaujolais', titleSize: 110, art: { svg: D.glassPhoto(150, 'lightred'), top: 740 },
        pop: { at: 0.5, html: '<small>Body</small>Light', top: 1150 }, caption: 'Beaujolais: light-bodied.' },
      { start: 9.0, end: 10.8, kicker: 'In the middle', title: '<em>C</em> · Côtes du Rhône', titleSize: 104, art: { svg: D.glassPhoto(150, 'ruby'), top: 740 },
        pop: { at: 0.5, html: '<small>Body</small>Medium', top: 1150 }, caption: 'Côtes du Rhône: medium-bodied.' },
      { start: 10.8, end: 12.8, kicker: 'Fullest', title: '<em>A</em> · Californian Cabernet', titleSize: 100, art: { svg: D.glassPhoto(150, 'deepred'), top: 740 },
        pop: { at: 0.5, html: '<small>Body</small>Full', top: 1150 }, caption: 'Californian Cabernet Sauvignon: full-bodied.' },
      { start: 12.8, end: 15.0, kicker: 'Plot twist', title: 'Sauternes, a sweet white, <em>is full-bodied too</em>', titleSize: 88, art: { svg: D.glassPhoto(170, 'gold'), top: 860 },
        caption: 'So colour is no clue to body: taste it.' },
      { start: 15.0, end: 17.0, kicker: 'The answer', title: 'B · C · A', titleSize: 150,
        lines: ['Got all three? Comment <b>3/3</b>'], goat: { src: G('goat-leaping-with-glass-of-red-wine'), h: 420, top: 980 },
        caption: 'Now watch again and time yourself.' },
    ] },

  /* R2 · Wine L2: guess the grape in 3 clues (Riesling) */
  { id: 'reel-wine-guess-the-grape', bg: 'cream', course: 'wine', level: 2, ...end,
    imagery: 'Photos: ripe pale-green grapes on the vine (no variety named), the Mosel river between vine-covered slopes at Neumagen-Dhron; drawing: glass of pale white wine',
    photos: [P.whiteGrapes, P.mosel],
    tile: { variant: 'arch', photo: P.whiteGrapes.src, pos: 'center 45%', tone: 'cream', head: 'Guess the grape <em>in 3 clues</em>', headSize: 96, sub: 'One white grape. Can you get it by clue 1?', archH: 640 },
    scenes: [
      { start: 0, end: 2.2, hook: true, kicker: 'Guess the grape', title: '3 clues. <em>1 white grape.</em>', titleSize: 112,
        photo: ph(P.whiteGrapes, { pos: 'center 45%', h: 980 }), caption: 'Can you name it before clue 3?' },
      { start: 2.2, end: 4.6, kicker: 'Clue 1', title: 'Aromatic, with <em>high acidity</em>', titleSize: 100,
        lines: ['Just ripe: <b>lemon, lime, green apple</b>', 'Usually made <b>without new oak</b>'], caption: 'Clue 1: aromatic, high acidity.' },
      { start: 4.6, end: 7.2, kicker: 'Clue 2', title: 'From <em>dry</em> to <em>sweet</em>', titleSize: 108,
        photo: ph(P.mosel, { h: 860, pos: 'center 55%' }), lines: ['Often <b>light-bodied</b> on the Mosel'], caption: 'Clue 2: dry to sweet. Mosel versions are often light.' },
      { start: 7.2, end: 9.6, kicker: 'Clue 3', title: 'With age: <em>honey and petrol</em>', titleSize: 100,
        lines: ['Acidity keeps it fresh for <b>years, even decades</b>'], caption: 'Clue 3: honey and petrol with bottle age.' },
      { start: 9.6, end: 12.6, kicker: 'Last chance', title: 'Got it?', titleSize: 140, sub: 'Type it in the comments before the reveal',
        timer: { at: 0, n: 3, top: 1020, label: 'Lock in your answer' }, caption: 'Three… two… one…' },
      { start: 12.6, end: 15.0, kicker: 'The answer', title: 'It’s <em>Riesling</em>', titleSize: 128, art: { svg: D.glassPhoto(190, 'pale'), top: 820 },
        lines: ['Mosel · Alsace · Clare & Eden Valley'], caption: 'Riesling! Dry, refreshing and lime-scented in Clare and Eden Valley.' },
      { start: 15.0, end: 17.0, kicker: 'Your score', title: 'Which clue <em>gave it away?</em>', titleSize: 104,
        lines: [{ html: 'Comment <b>1</b>, <b>2</b> or <b>3</b>', cls: 'big' }], caption: 'Watch again: can you get it at clue 1?' },
    ] },

  /* R3 · Wine L3: POV first blind tasting (goat as the character) */
  { id: 'reel-wine-pov-blind-tasting', bg: 'burgundy', course: 'wine', level: 3, ...end,
    imagery: 'Goats: detective with a magnifying glass and red wine, goat peering over an open wine book, goat winking with a glass of red wine; drawing: glass of ruby red wine',
    tile: { variant: 'solid', tone: 'burgundy', arc: 'POV: your first blind tasting', arcSize: 60, arcR: 1100,
      art: `<img src="${G('goat-detective-with-magnifying-glass-and-red-wine')}" style="height:470px" alt="">`, artTop: 520, sub: 'Level 3 · two wines · no labels' },
    scenes: [
      { start: 0, end: 2.4, hook: true, kicker: 'POV', title: 'Your first <em>blind tasting</em>', titleSize: 120, sub: 'Two wines. 30 minutes. No labels.',
        goat: { src: G('goat-detective-with-magnifying-glass-and-red-wine'), h: 470, top: 900 }, caption: 'Level 3 tasting exam, glass 1…' },
      { start: 2.4, end: 4.6, kicker: 'Appearance', title: '“It’s… <em>red.</em>”', titleSize: 140, art: { svg: D.glassPhoto(150, 'ruby'), top: 900 },
        lines: [{ html: '<span class="tagx ok">Good start</span><b>Ruby</b> is the most common red', at: 0.8 }], caption: 'Then you remember: clarity, intensity, colour.' },
      { start: 4.6, end: 6.8, kicker: 'Nose', title: 'Swirl. Sniff. <em>It smells of… wine.</em>', titleSize: 96,
        lines: [{ html: 'Short sniffs: <b>condition</b>, <b>intensity</b>, <b>development</b>', at: 0.7 }, { html: 'Then the aroma clusters, one by one', at: 1.2 }], caption: 'Work through the clusters: fruit, floral, oak…' },
      { start: 6.8, end: 9.0, kicker: 'Palate', title: 'Medium(+)? Medium? <em>Medium(−)?</em>', titleSize: 92,
        goat: { src: G('goat-peering-over-open-wine-book'), h: 340, top: 1010, at: 0.3 }, lines: [{ html: 'Pick <b>low, medium or high</b> first', at: 0.6 }],
        caption: 'Then refine with (+) or (−).' },
      { start: 9.0, end: 11.2, kicker: 'Colour', title: 'You write <em>“ruby to garnet”</em>', titleSize: 100,
        pop: { at: 0.6, html: '<small>Examiner</small>No mark', top: 1060 }, tone: 'red', caption: 'A range is not specific enough. Pick one.' },
      { start: 11.2, end: 13.8, kicker: 'Quality', title: 'Count <em>to four</em>', titleSize: 130,
        lines: [{ html: 'Balance · Length · Intensity · Complexity', cls: 'big', at: 0.5 }, { html: 'All four positive = <b>outstanding</b>', at: 1.1 }], caption: 'Three out of four? Very good.' },
      { start: 13.8, end: 16.0, kicker: 'Meanwhile', title: 'Glass 2 is <em>already poured…</em>', titleSize: 104,
        goat: { src: G('goat-winking-with-glass-of-red-wine'), h: 440, top: 1000 }, caption: 'Same steps, every glass. Tag your tasting buddy.' },
    ] },

  /* R4 · Wine L1: red flags at a wine tasting */
  { id: 'reel-wine-red-flags-tasting', bg: 'course', course: 'wine', level: 1, ...end,
    imagery: 'Drawings: red flag on a wooden pole, white wine glass',
    tile: { variant: 'solid', arc: 'Red flags at a wine tasting', arcSize: 62, arcR: 1100, art: E.redFlag(330), artTop: 540, sub: 'How many have you seen?' },
    scenes: [
      { start: 0, end: 2.2, hook: true, kicker: 'Wine tasting', title: '6 red flags <em>at a tasting</em>', titleSize: 116, art: { svg: E.redFlag(300), top: 860 },
        caption: 'How many have you seen? Count them.' },
      ...[
        ['Heavy perfume', 'The room should be free of <b>strong smells</b>', 'Perfume masks the wine, and bothers your neighbours.'],
        ['Brushing your teeth just before', 'Toothpaste and coffee <b>distort the wine</b>', 'Start with a clean palate.'],
        ['A glass full to the brim', 'About <b>5 cl</b> is enough: room to swirl', 'Same small pour in every glass.'],
        ['Glasses that smell of detergent', 'Odourless, <b>no residue</b>, no dirty cloth', 'A clean glass, every time.'],
        ['Nowhere to spit', 'Spittoons close by, and <b>drink water</b>', 'Dehydration can dull your sense of smell.'],
        ['Dim lighting', 'Good light and a <b>white surface</b> for colour', 'You cannot judge colour in the dark.'],
      ].map(([t, l, c], i) => ({ start: 2.2 + i * 2, end: 4.2 + i * 2, kicker: `Red flag ${i + 1}`, title: t, titleSize: t.length > 24 ? 92 : 108,
        lines: [{ html: `<span class="tagx ok">Fix</span>${l}`, at: 0.5 }], art: { svg: E.redFlag(250), top: 930, at: 0.15 }, caption: c })),
      { start: 14.2, end: 16.4, kicker: 'Your turn', title: 'Which one <em>have you seen?</em>', titleSize: 108,
        lines: [{ html: 'Comment the <b>number</b>', cls: 'big' }], art: { svg: E.redFlag(250), top: 920 }, caption: 'Send this to the friend who wears perfume to tastings.' },
    ] },

  /* R5 · Wine L3: can you spot the faulty wine? */
  { id: 'reel-wine-spot-the-fault', bg: 'course', course: 'wine', level: 3, ...end,
    imagery: 'Drawings: three white wine glasses (one with tartrate crystals, one normal-looking, one browned by oxidation), a cork with a damp stain',
    tile: { variant: 'solid', arc: 'Can you spot the faulty wine?', arcSize: 60, arcR: 1100,
      art: glabs([[E.glassCrystals(170), 'A'], [D.glassPhoto(170, 'pale'), 'B'], [D.glassPhoto(170, 'oxidised'), 'C']], 34), artTop: 470, sub: 'Only one of them is fine' },
    scenes: [
      { start: 0, end: 2.4, hook: true, kicker: 'Wine faults', title: 'Only one <em>is fine.</em>', titleSize: 128, sub: 'Which glass would you drink?',
        vis: glabs([[E.glassCrystals(180), 'A'], [D.glassPhoto(180, 'pale'), 'B'], [D.glassPhoto(180, 'oxidised'), 'C']], 46), caption: 'Two of these white wines are faulty.' },
      { start: 2.4, end: 5.4, kicker: 'Pick one', title: 'A, B <em>or C?</em>', titleSize: 128,
        vis: glabs([[E.glassCrystals(150), 'A'], [D.glassPhoto(150, 'pale'), 'B'], [D.glassPhoto(150, 'oxidised'), 'C']], 40),
        timer: { at: 0, n: 3, top: 1170, label: 'Comment your pick' }, caption: 'Comment A, B or C before the answer.' },
      { start: 5.4, end: 7.8, kicker: 'A · crystals at the bottom', title: 'Not a <em>fault</em>', titleSize: 128, art: { svg: E.glassCrystals(150), top: 760 },
        pop: { at: 0.6, html: '<small>Tartrate crystals</small>Harmless', top: 1150 }, tone: 'green', caption: 'Tartrates: harmless and flavourless. Cold speeds them up.' },
      { start: 7.8, end: 10.2, kicker: 'B · looks perfect, smells of damp cardboard', title: 'Cork taint <em>(TCA)</em>', titleSize: 110, art: { svg: E.cork(160, true), top: 900 },
        lines: [{ html: 'Fruit seems <b>muted</b>, less fresh', at: 0.6 }], caption: 'Often called “corked”: mainly from contaminated cork.' },
      { start: 10.2, end: 12.6, kicker: 'C · browner than it should be', title: '<em>Oxidised</em>', titleSize: 140, art: { svg: D.glassPhoto(150, 'oxidised'), top: 960 },
        lines: [{ html: 'Toffee, honey, caramel or coffee', at: 0.5 }, { html: 'No <b>freshness</b>, no fruit', at: 1.0 }], caption: 'Usually a closure letting oxygen in.' },
      { start: 12.6, end: 14.8, kicker: 'The twist', title: 'In some wines, <em>it’s the style</em>', titleSize: 100,
        lines: [{ html: 'Made in an <b>oxidative style</b>? Not a fault.', at: 0.5 }], art: { svg: D.glassPhoto(150, 'amber'), top: 900, at: 0.4 }, caption: 'It is only a fault when the wine was not meant to taste that way.' },
      { start: 14.8, end: 17.0, kicker: 'So…', title: 'Did you <em>pick A?</em>', titleSize: 130,
        vis: glabs([[E.glassCrystals(170), 'A']], 0), caption: 'Watch again: which clue gave it away?' },
    ] },

  /* R6 · Wine L2: This or that, Old World vs New World labels (place or grape?) */
  { id: 'reel-wine-place-or-grape', bg: 'cream', course: 'wine', level: 2, ...end,
    imagery: 'Drawings: wine bottles with generic labels (Chablis, Cabernet Sauvignon from Maipo Valley, Rioja, Bordeaux, Alsace Pinot Gris); white-wine bottles in pale glass',
    tile: { variant: 'edit', head: 'Place <em>or grape?</em>', headSize: 140, sub: 'Old World vs New World labels', gap: 70, reelHint: true,
      items: [{ svg: E.labelBottle(140, { glass: 'flint', wine: 'white', big: 'Chablis', small: 'APPELLATION CHABLIS CONTRÔLÉE' }), h: 430, label: 'This…' },
        { svg: E.labelBottle(140, { top: 'Maipo Valley · Chile', big: 'Cabernet', small: 'SAUVIGNON', bigSize: 32 }), h: 430, label: '…or that?' }] },
    scenes: [
      { start: 0, end: 2.2, hook: true, kicker: 'This or that', title: 'Old World <em>or New World?</em>', titleSize: 112, sub: 'Read the label in 1 second',
        art: { svg: D.row([E.labelBottle(150, { glass: 'flint', wine: 'white', big: 'Chablis', small: 'APPELLATION CHABLIS CONTRÔLÉE' }), E.labelBottle(150, { top: 'Maipo Valley · Chile', big: 'Cabernet', small: 'SAUVIGNON', bigSize: 32 })], 80), top: 900, at: -1 },
        caption: 'Does the label name the place or the grape?' },
      ...[
        [E.labelBottle(160, { glass: 'flint', wine: 'white', big: 'Chablis', small: 'APPELLATION CHABLIS CONTRÔLÉE' }), 'Chablis', 'Place', 'Inside: <b>Chardonnay</b>', 'Chablis names the place. The grape is Chardonnay.'],
        [E.labelBottle(160, { top: 'Maipo Valley · Chile', big: 'Cabernet', small: 'SAUVIGNON', bigSize: 32 }), 'Cabernet Sauvignon', 'Grape', 'Chile’s <b>most planted</b> grape', 'Outside Europe, the grape often leads the label.'],
        [E.labelBottle(160, { top: 'Spain', big: 'Rioja', small: 'DOCa' }), 'Rioja', 'Place', 'A blend led by <b>Tempranillo</b>', 'Rioja names the place: usually a blend led by Tempranillo.'],
        [E.labelBottle(160, { top: 'France', big: 'Bordeaux', small: 'APPELLATION BORDEAUX', bigSize: 30 }), 'Bordeaux', 'Place', 'A blend: <b>Cabernet Sauvignon + Merlot</b>', 'Red Bordeaux is usually a blend of Cabernet Sauvignon and Merlot.'],
      ].map(([svg, t, k, r, c], i) => ({ start: 2.2 + i * 2.2, end: 4.4 + i * 2.2, kicker: `Label ${i + 1} · place or grape?`, title: t, titleSize: t.length > 12 ? 92 : 120,
        art: { svg, top: 690, at: 0 }, pop: { at: 0.9, html: `${k}!<span>${r}</span>`, top: 1190 }, caption: c })),
      { start: 11.0, end: 13.4, kicker: 'Plot twist', title: 'Europe, but <em>the grape</em> is on it', titleSize: 96,
        art: { svg: E.labelBottle(150, { glass: 'flint', wine: 'white', top: 'Alsace', big: 'Pinot Gris', small: 'APPELLATION ALSACE', bigSize: 30 }), top: 880, at: 0.1 },
        caption: 'Alsace labels normally show the grape.' },
      { start: 13.4, end: 15.6, kicker: 'The rule of thumb', title: 'Europe: often <em>the place</em>. Elsewhere: often <em>the grape</em>.', titleSize: 84,
        lines: [{ html: 'So learn which grapes hide <b>behind the names</b>', at: 0.7 }], caption: 'Learn the famous names and you can read most wine lists.' },
      { start: 15.6, end: 17.6, kicker: 'Your turn', title: 'Which label <em>fooled you?</em>', titleSize: 110,
        lines: [{ html: 'Comment <b>1</b> to <b>5</b>', cls: 'big' }], caption: 'Watch again and beat the pop-ups.' },
    ] },

  /* R7 · Spirits L1: guess the spirit in 3 clues (gin) */
  { id: 'reel-spirits-guess-the-spirit', bg: 'course', course: 'spirits', level: 1, ...end,
    imagery: 'Photos: close-up of dried coriander seeds, backlit citrus slices; drawings: juniper sprig with berries, clear gin bottle with a juniper label (no brand)',
    photos: [P.coriander, P.citrus],
    tile: { variant: 'frame', photo: P.coriander.src, pos: 'center', tone: 'course', head: 'Guess the spirit <em>in 3 clues</em>', headSize: 92, sub: 'Can you name it at clue 1?' },
    scenes: [
      { start: 0, end: 2.2, hook: true, kicker: 'Guess the spirit', title: '3 clues. <em>1 spirit.</em>', titleSize: 120,
        photo: ph(P.coriander, { h: 980 }), caption: 'Name it before clue 3.' },
      { start: 2.2, end: 4.4, kicker: 'Clue 1', title: 'Usually <em>colourless</em> and unaged', titleSize: 104,
        caption: 'Clue 1: clear, and no time in a barrel.', art: { svg: E.ginBottle(160).replace('>GIN<', '>?<'), top: 860 } },
      { start: 4.4, end: 6.8, kicker: 'Clue 2', title: 'Neutral spirit, <em>flavoured with plants</em>', titleSize: 92,
        photo: ph(P.citrus, { h: 820 }), lines: [{ html: 'Coriander seed, angelica, orris root, <b>citrus peel</b>', at: 0.6 }], caption: 'Clue 2: a neutral base, flavoured with botanicals.' },
      { start: 6.8, end: 9.0, kicker: 'Clue 3', title: 'One plant <em>must lead</em>', titleSize: 120, art: { svg: E.juniper(560), top: 900 },
        lines: [{ html: 'Resinous, <b>piney</b>', at: 0.6 }], caption: 'Clue 3: resinous, piney berries.' },
      { start: 9.0, end: 12.0, kicker: 'Last chance', title: 'Got it?', titleSize: 140, sub: 'Type it in the comments',
        timer: { at: 0, n: 3, top: 1020, label: 'Lock in your answer' }, caption: 'Three… two… one…' },
      { start: 12.0, end: 14.4, kicker: 'The answer', title: 'It’s <em>gin</em>', titleSize: 150, art: { svg: E.ginBottle(140), top: 720 },
        pop: { at: 0.7, html: '<small>The one rule</small>Juniper leads', top: 1140 }, caption: 'Gin: juniper must be the leading flavour.' },
      { start: 14.4, end: 16.6, kicker: 'Bonus', title: '“London Dry” <em>can be made anywhere</em>', titleSize: 92,
        lines: [{ html: 'It means the flavours went in <b>during redistillation</b>', at: 0.6 }], caption: 'London Dry Gin is a method, not a place.' },
      { start: 16.6, end: 18.6, kicker: 'Your score', title: 'Clue <em>1, 2 or 3?</em>', titleSize: 130,
        lines: [{ html: 'Comment when you got it', cls: 'big' }], caption: 'Watch again: could you get it at clue 1?' },
    ] },
];
// the pop tone sits on the scene object for readability; move it into pop.tone
for (const r of reels) for (const s of r.scenes) if (s.tone && s.pop) { s.pop.tone = s.tone; delete s.tone; }

/* =========================== STORIES (1080x1920, one interactive frame each) =========================== */
// Leave the empty space under the question for Instagram's sticker (poll / quiz / slider), added in the app.
const stories = [
  { id: 'story-1-poll-screwcap-or-cork', course: 'wine', level: 3, single: true,
    q: { kicker: 'Poll', question: 'Screwcap or cork: <em>which do you trust?</em>', options: [], hint: 'Vote below',
         art: { svg: D.row([D.bottle(120, { label: true }), E.cork(100)], 60), style: { left: '50%', transform: 'translateX(-50%)', bottom: 330 } } } },
  { id: 'story-2-quiz-not-a-fault', course: 'wine', level: 3, single: true,
    q: { kicker: 'Quiz', question: 'Which one is <em>NOT</em> a wine fault?', options: ['Cork taint (TCA)', 'Tartrate crystals', 'Oxidation'], hint: 'Tap your answer below' } },
  { id: 'story-3-slider-blind-tasting', course: 'wine', level: 3, single: true,
    q: { kicker: 'Be honest', question: 'How ready are you for <em>blind tasting?</em>', options: [], hint: 'Slide to answer',
         art: { svg: D.glassPhoto(170, 'ruby'), style: { left: '50%', transform: 'translateX(-50%)', bottom: 330 } } } },
  { id: 'story-4-quiz-beer-glass', course: 'beer', level: 1, single: true,
    q: { kicker: 'Quiz', question: 'Bubbles clinging to the side of your beer glass mean…', options: ['The beer is very fresh', 'The glass is not clean', 'It is a strong beer'], hint: 'Tap your answer below' } },
];

/* =========================== GRID =========================== */
// Posting order (oldest first). Backgrounds chosen so that no two neighbouring tiles in the 4-column grid share a
// background family, with the batch-02 pinned quiz staying first and the published batch-02 posts below.
const feed = [
  'reel-wine-rank-by-body',          // cream (editorial)
  'beer-five-serving-mistakes',      // course: amber (photo arch)
  'reel-wine-guess-the-grape',       // cream (photo arch)
  'wine-myth-or-fact',               // course: green (photo frame)
  'reel-spirits-guess-the-spirit',   // course: brown (minimal photo)
  'wine-black-grapes-cheat-sheet',   // burgundy (photo arch)
  'reel-wine-spot-the-fault',        // course: green (solid)
  'sake-myth-or-fact',               // cream (editorial)
  'reel-wine-pov-blind-tasting',     // burgundy (solid)
  'spirits-cognac-vs-armagnac',      // course: brown (solid)
  'reel-wine-place-or-grape',        // cream (editorial)
  'wine-port-styles',                // burgundy (photo arch)
  'reel-wine-red-flags-tasting',     // course: green (solid)
  'wine-which-level-is-right',       // cream (solid)
];

const B1 = 'social/instagram/batch-01';
const B2D = 'social/instagram/batch-02';
const FX = 'social/instagram/batch-01-fixed';
const pub = (id, dir, reel = false, pinned = false) => ({ id, dir, reel, pinned, label: pinned ? '' : 'published' });
const grid = {
  cols: 4,
  note: 'Pinned quiz first, then batch 03 newest first (14 posts: 7 reels, 7 carousels), then the 20 posts already published (batch 02 with the corrected batch-01 items, and the 4 batch-01 posts). 4:5 tiles; reel covers centre-cropped. No two neighbouring tiles share a background family.',
  legend: [{ c: '#8c1d40', t: 'Wine' }, { c: '#9a5f1e', t: 'Spirits' }, { c: '#3b3f8f', t: 'Sake' }, { c: '#d4a23a', t: 'Beer' }],
  prev: [
    pub('b-quiz-which-grape', B1), pub('e-serving-temperatures', B1), pub('d-german-wine-label', B1), pub('f-tasting-mistakes', B1),
    pub('sancerre-quiz', FX), pub('reel-sake-polishing-ratio', B2D, true), pub('a-same-grape-two-wines', FX), pub('beer-colour-strength-myths', B2D),
    pub('reel-1-three-grapes', FX, true), pub('reel-beer-ale-vs-lager', B2D, true), pub('wine-sherry-styles', B2D), pub('reel-spirits-single-malt-scotch', B2D, true),
    pub('spirits-tequila-vs-mezcal', B2D), pub('wine-traditional-method', B2D), pub('reel-wine-spanish-ageing-terms', B2D, true), pub('sake-how-sake-is-brewed', B2D),
    pub('wine-bordeaux-left-right-bank', B2D), pub('wine-level3-short-answers', B2D), pub('reel-pinned-how-much-do-you-know', B2D, true), pub('pinned-how-much-do-you-know', B2D, false, true),
  ],
};

module.exports = { id: 'batch-03', out: 'social/instagram/batch-03', v2: true, reelTemplate: 'reel-viral.html', slideRange: [5, 10], maxMB: 9.5, posts, stories, reels, feed, grid };
