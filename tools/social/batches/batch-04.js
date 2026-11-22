// Instagram batch 04 — The Wine Goat (@the.winegoat). ENGLISH ONLY. Six voiceover reels (owner feedback on batch 03:
// every reel needs a voice reading the on-screen text, and every reel needs its own, clearly different music).
// Formats: myth vs fact, guess it, rank it, 3 mistakes, this or that, POV. Courses: Wine Levels 1, 2 and 3,
// Spirits Level 1, Beer Level 1, Sake Level 1.
// Every scene has a `vo` script (short sentences); build.js speaks it with Kokoro TTS, times the scene to the voice and
// burns in each sentence as the caption while it is spoken. Line/pop timings can follow the voice ('s2' = when
// sentence 2 starts, 'e1' = when sentence 1 ends, 'v' = after the voice).
// Voices rotate (owner, Nov 2026): bf_emma, af_heart, bm_george, each twice, never the same on neighbouring reels.
// Music: one style per reel from tools/social/lib/music.py, no style used twice (enforced by uniqueMusic).
// Facts: app content only (app/l1, app/l2, app/index.html Level 3 Burgundy, app/spirits/s1 + s2, app/beer/b1,
// app/sake/k1), cross-checked with the course books; nothing quoted from them. No prices; no affiliation.
// Imagery: no wine imagery on Spirits/Beer/Sake; white-wine topic with pale/gold wine only; one painted goat, on the
// red-wine (Burgundy) reel only; real photos only where they show exactly what the caption says.
'use strict';
const D = require('../lib/illus2');
const E = require('../lib/illus3');
const F = require('../lib/illus4');
const { PH } = require('../lib/photos');

const G = (name) => `img/goats/${name}.webp`;
const ph = (p, o = {}) => ({ src: p.src, pos: o.pos || 'center', h: o.h || 1000, textTop: o.textTop });
const glabs = (items, gap = 40) => `<div class="glabs" style="gap:${gap}px">${items.map(([svg, l, w]) => `<figure>${svg}${l ? `<figcaption class="${w ? 'w' : ''}">${l}</figcaption>` : ''}</figure>`).join('')}</div>`;
const row = (items, gap = 30) => `<div style="display:flex;justify-content:center;align-items:flex-end;gap:${gap}px">${items.join('')}</div>`;
const duo = (a, b) => `<div style="display:flex;justify-content:center;gap:34px;margin-top:6px">${[a, b].map((x) => `<span style="font:800 64px/1 var(--serif);padding:26px 44px;border-radius:28px;background:rgba(255,255,255,.14);border:3px solid rgba(255,255,255,.55);color:#fff">${x}</span>`).join('<span style="font:800 40px/120px var(--sans);color:#f3d58c">or</span>')}</div>`;
const CUT_WHITE = 'tools/social/assets/cutouts/grapes-white.png';

const P = {
  salmon: PH('grilled-salmon-with-potatoes-and-lemon', 'Grilled salmon fillet with roast potato wedges and lemon wedges on a white plate.'),
  vougeot: PH('clos-de-vougeot-chateau-de-la-tour', 'Vine rows leading to the Château de la Tour in the Clos de Vougeot, Côte de Nuits, Burgundy.'),
  casks: PH('brandy-barrels-yerevan-armenia', 'Numbered oak casks of brandy ageing in a cellar in Yerevan, Armenia.'),
  barley: PH('barley-field-golden-hour-nottuln', 'A barley field at golden hour near Nottuln, Germany.'),
  grapes: PH('red-and-white-grape-bunches-hanging', 'Cut-out of the green-white grape bunch from a studio photo of hanging grape bunches.'),
};

const reels = [
  /* R1 · Wine L1 · myth vs fact: food and wine (bossa nova, bf_emma) */
  { id: 'reel-wine-food-myths', title: 'Food & wine: myth or fact?', bg: 'cream', course: 'wine', level: 1, music: 'bossa', voice: 'bf_emma',
    imagery: 'Drawings: slice of strawberry cream cake, dish of sea salt, lemon wedge, red chilli; photo: grilled salmon with potatoes and lemon wedges',
    photos: [P.salmon],
    tile: { variant: 'edit', head: 'Myth <em>or fact?</em>', headSize: 150, sub: 'Food & wine: 4 myths most people believe', gap: 22, reelHint: true,
      items: [{ svg: F.cake(230), h: 300 }, { svg: F.salt(220), h: 300 }, { svg: F.lemon(220), h: 300 }, { svg: F.chilli(230), h: 300 }] },
    scenes: [
      { hook: true, kicker: 'Myth or fact?', title: 'Food & wine: <em>4 myths</em>', titleSize: 128, sub: 'How many did you believe?',
        vis: row([F.cake(200), F.salt(190), F.lemon(190), F.chilli(200)], 18), vo: 'Four food and wine myths. How many do you believe?' },
      { kicker: 'Myth 1', title: '“Sweet food makes wine taste <em>sweeter</em>”', titleSize: 92, vis: F.cake(210),
        lines: [{ html: 'Wine seems <b>less sweet, more acidic</b>', at: 's3' }, { html: 'Pick a wine <b>at least as sweet</b> as the dish', at: 's4' }],
        pop: { at: 's2', html: 'Myth!', top: 1215 }, tone: 'red',
        vo: 'Sweet food makes wine taste sweeter? Myth! It makes wine seem less sweet, and more acidic. Pick a wine at least as sweet as the dish.' },
      { kicker: 'Myth 2', title: '“Salty food is <em>hard to pair</em>”', titleSize: 100, vis: F.salt(210),
        lines: [{ html: 'Wine seems <b>less bitter, less acidic</b>', at: 's3' }, { html: '…and <b>fruitier, fuller</b>', at: 's3+1.6' }],
        pop: { at: 's2', html: 'Myth!', top: 1215 }, tone: 'red',
        vo: 'Salty food is hard to pair? Myth! Salt makes wine seem less bitter, less acidic, and fruitier.' },
      { kicker: 'Myth 3', title: '“Lemon on the fish makes a crisp wine <em>too sharp</em>”', titleSize: 80,
        photo: ph(P.salmon, { h: 760, pos: 'center 45%', textTop: 640 }),
        lines: [{ html: 'Acid in food makes wine seem <b>less acidic</b>', at: 's3' }, { html: '…and <b>sweeter, fruitier</b>', at: 's3+1.6' }],
        pop: { at: 's2', html: 'Myth!', top: 1190 }, tone: 'red',
        vo: 'Lemon on the fish makes a crisp wine too sharp? Myth! Acidity in food makes wine seem less acidic, and fruitier.' },
      { kicker: 'Myth 4', title: '“A strong wine <em>cools the chilli</em>”', titleSize: 100, vis: F.chilli(230),
        lines: [{ html: 'The chilli burn gets <b>stronger</b>', at: 's3' }, { html: 'Chilli makes the alcohol <b>stand out</b> more', at: 's3+1.4' }],
        pop: { at: 's2', html: 'Myth!', top: 1215 }, tone: 'red',
        vo: 'A strong wine cools down the chilli? Myth! The burn gets stronger, and the alcohol stands out more.' },
      { kicker: 'Your score', title: 'How many <em>did you believe?</em>', titleSize: 108,
        lines: [{ html: 'Comment <b>0</b> to <b>4</b>', cls: 'big', at: 0.3 }], vis: row([F.cake(150), F.salt(140), F.lemon(140), F.chilli(150)], 14),
        vo: 'How many did you believe? Comment zero to four. Practise free on thewinegoat.com.' },
    ] },

  /* R2 · Wine L2 · guess it: three ways to make a sweet white (lo-fi hip hop, af_heart) */
  { id: 'reel-wine-sweet-whites-guess', title: '3 sweet whites, 3 tricks', bg: 'course', course: 'wine', level: 2, music: 'lofi', voice: 'af_heart',
    imagery: 'Drawings: glasses of gold, pale and light white wine, snowflake; cut-out: bunch of green-white grapes (cover)',
    photos: [P.grapes],
    tile: { variant: 'edit', head: '3 sweet whites. <em>3 tricks.</em>', headSize: 118, sub: 'Noble rot, frozen grapes or late harvest?', gap: 40, reelHint: true,
      items: [{ src: CUT_WHITE, h: 400 }, { svg: D.glassPhoto(150, 'gold'), h: 400, label: 'A' }, { svg: D.glassPhoto(150, 'pale'), h: 400, label: 'B' }, { svg: D.glassPhoto(150, 'white'), h: 400, label: 'C' }] },
    scenes: [
      { hook: true, kicker: 'Guess it', title: '3 sweet whites. <em>3 tricks.</em>', titleSize: 118, sub: 'Can you match them?',
        vis: glabs([[D.glassPhoto(150, 'gold'), 'A'], [D.glassPhoto(150, 'pale'), 'B'], [D.glassPhoto(150, 'white'), 'C']], 50),
        vo: 'Three sweet whites. Three tricks. Can you match them?' },
      { kicker: 'The tricks', title: 'How did the sugar <em>get there?</em>', titleSize: 100,
        lines: [{ html: '<b>1</b> · A fungus pierces the skins', at: 's1' }, { html: '<b>2</b> · The grapes freeze on the vine', at: 's2' }, { html: '<b>3</b> · Picked late, extra ripe', at: 's3' }],
        vo: 'One: a fungus. Two: frozen grapes. Three: a late harvest.' },
      { kicker: 'The wines', title: 'Match them', titleSize: 120,
        lines: [{ html: '<b>A</b> · Sauternes', at: -1 }, { html: '<b>B</b> · Icewine (Eiswein)', at: -1 }, { html: '<b>C</b> · Alsace Vendanges Tardives', at: -1 }],
        timer: { at: 'v', n: 3, top: 1120, label: 'Lock in your answer' },
        vo: 'Sauternes, icewine, or Vendanges Tardives? Match them!' },
      { kicker: 'A · Sauternes', title: '<em>Noble rot</em>', titleSize: 130, vis: D.glassPhoto(150, 'gold'),
        lines: [{ html: 'Botrytis makes tiny holes: <b>water evaporates</b>', at: 's2' }, { html: 'Sugar, acid, flavour: <b>concentrated</b>', at: 's3' }],
        vo: 'Sauternes: noble rot. The fungus pierces the skins, and water evaporates. Sugar, acid and flavour concentrate.' },
      { kicker: 'B · Icewine', title: '<em>Frozen</em> on the vine', titleSize: 120, vis: row([F.snowflake(170), D.glassPhoto(130, 'pale')], 40),
        lines: [{ html: 'Pressed <b>while still frozen</b>', at: 's2' }, { html: 'The ice stays behind: <b>concentrated juice</b>', at: 's2+1.6' }],
        vo: 'Icewine: grapes frozen on the vine. They are pressed while still frozen, so the ice stays behind.' },
      { kicker: 'C · Vendanges Tardives', title: '<em>Late</em> harvest', titleSize: 130, vis: D.glassPhoto(150, 'white'),
        lines: [{ html: 'Left on the vine longer: <b>riper grapes</b>', at: 's2' }, { html: '…and a <b>sweeter wine</b>', at: 's2+0.9' }],
        vo: 'Vendanges Tardives: late harvest. Riper grapes, sweeter wine.' },
      { kicker: 'Your score', title: 'How many <em>did you match?</em>', titleSize: 110,
        lines: [{ html: 'Comment <b>0</b> to <b>3</b>', cls: 'big', at: 0.3 }], vis: glabs([[D.glassPhoto(120, 'gold'), 'A'], [D.glassPhoto(120, 'pale'), 'B'], [D.glassPhoto(120, 'white'), 'C']], 40),
        vo: 'How many did you match? Comment zero to three.' },
    ] },

  /* R3 · Wine L3 · rank it: the Burgundy pyramid (cinematic strings, bm_george) */
  { id: 'reel-wine-burgundy-rank', title: 'Rank the Burgundy pyramid', bg: 'burgundy', course: 'wine', level: 3, music: 'cinematic', voice: 'bm_george',
    imagery: 'Photo: vine rows leading to the Château de la Tour in the Clos de Vougeot; drawings: four red-wine bottles with generic labels (Bourgogne, Gevrey-Chambertin, Gevrey-Chambertin Premier Cru, Chambertin Grand Cru); goat on a wine barrel raising a glass of red wine (end)',
    photos: [P.vougeot],
    tile: { variant: 'arch', photo: P.vougeot.src, pos: 'center 40%', tone: 'burgundy', head: 'Rank the <em>Burgundy pyramid</em>', headSize: 90, sub: 'Lowest to highest. Four labels.', archH: 640 },
    scenes: [
      { hook: true, kicker: 'Rank it', title: 'Burgundy: <em>lowest → highest</em>', titleSize: 112, sub: 'Four reds. One pyramid.',
        photo: ph(P.vougeot, { h: 900, pos: 'center 45%', textTop: 760 }),
        vo: 'Four red Burgundies. Rank them, lowest to highest.' },
      { kicker: 'Your order?', title: 'A, B, C <em>or D?</em>', titleSize: 116,
        lines: [{ html: '<b>A</b> · Chambertin', at: 's1' }, { html: '<b>B</b> · Bourgogne', at: 's2' }, { html: '<b>C</b> · Gevrey-Chambertin', at: 's3' }, { html: '<b>D</b> · Gevrey-Chambertin Premier Cru', at: 's4' }],
        timer: { at: 'v', n: 3, top: 1170, label: 'Lowest to highest' },
        vo: 'Chambertin. Bourgogne. Gevrey-Chambertin. Gevrey-Chambertin Premier Cru. Lock it in!' },
      { kicker: 'Bottom', title: '<em>B</em> · Bourgogne', titleSize: 120, vis: E.labelBottle(120, { top: 'France', big: 'Bourgogne', small: 'APPELLATION BOURGOGNE CONTRÔLÉE', bigSize: 28 }),
        pop: { at: 's2', html: '<small>Level</small>Regional', top: 1240 }, vo: 'Bottom: Bourgogne. The regional level.' },
      { kicker: 'Next', title: '<em>C</em> · Gevrey-Chambertin', titleSize: 100, vis: E.labelBottle(120, { top: 'Côte de Nuits', big: 'Gevrey-Chambertin', small: 'APPELLATION CONTRÔLÉE', bigSize: 17 }),
        pop: { at: 's2', html: '<small>Level</small>Village', top: 1240 }, vo: 'Next: Gevrey-Chambertin. A village.' },
      { kicker: 'Second from top', title: '<em>D</em> · Premier Cru', titleSize: 116, vis: E.labelBottle(120, { top: 'Gevrey-Chambertin', big: '1er Cru', small: 'APPELLATION CONTRÔLÉE', bigSize: 30 }),
        pop: { at: 's1+1.1', html: '<small>Premier Cru</small><b style="font-size:66px">Village + vineyard</b>', top: 1240 }, vo: 'Then Premier Cru: the village name, plus the vineyard.' },
      { kicker: 'Top', title: '<em>A</em> · Chambertin', titleSize: 120, vis: E.labelBottle(120, { top: 'Grand Cru', big: 'Chambertin', small: 'APPELLATION CONTRÔLÉE', bigSize: 25 }),
        pop: { at: 's2', html: '<small>Grand Cru</small><b style="font-size:66px">Its own appellation</b>', top: 1240 },
        vo: 'Top: Chambertin, a grand cru. Its own appellation, so only the vineyard is on the label.' },
      { kicker: 'The trap', title: 'The village <em>borrowed the name</em>', titleSize: 104,
        lines: [{ html: '<b>Gevrey-Chambertin</b> = the village', at: 's3' }, { html: '<b>Chambertin</b> = the grand cru', at: 's4' }],
        vo: 'The trap? Many villages added the name of their famous grand cru. Gevrey-Chambertin is the village. Chambertin is the grand cru.' },
      { kicker: 'The answer', title: 'B · C · D · A', titleSize: 150, goat: { src: G('goat-on-wine-barrel-raising-red-wine'), h: 430, top: 960 },
        lines: [{ html: 'Comment your score <b>out of 4</b>', at: 0.3 }],
        vo: 'B, C, D, A. Comment your score!' },
    ] },

  /* R4 · Spirits L1 · 3 mistakes reading a spirits label (jazz swing, bf_emma) */
  { id: 'reel-spirits-label-mistakes', title: '3 mistakes reading a spirits label', bg: 'course', course: 'spirits', level: 1, music: 'swing', voice: 'bf_emma',
    imagery: 'Drawings: amber spirits bottle with a plain label, tasting glass of amber spirit, oak barrel; photo: numbered oak casks of brandy in a cellar in Yerevan',
    photos: [P.casks],
    tile: { variant: 'frame', photo: P.casks.src, pos: 'center', tone: 'course', head: '3 mistakes <em>reading a spirits label</em>', headSize: 80, sub: 'Number 3 is the sneaky one' },
    scenes: [
      { hook: true, kicker: '3 mistakes', title: 'Reading a <em>spirits label</em>', titleSize: 124, sub: 'Number 3 is the sneaky one',
        vis: row([D.whiskyBottle(150), D.glencairn(140, 'amber')], 40), vo: 'Three mistakes people make reading a spirits label. Number three is sneaky.' },
      { kicker: 'Mistake 1', title: '“Darker means <em>older</em>”', titleSize: 116, vis: D.glencairn(140, 'amber'),
        lines: [{ html: 'Many blenders add a little <b>caramel</b>', at: 's3' }, { html: 'Same colour <b>batch after batch</b>', at: 's3+1.8' }],
        pop: { at: 's2', html: 'Not always!', top: 1230 }, tone: 'red',
        vo: 'Darker means older? Not always! Many blenders add a little caramel, to keep the same colour batch after batch.' },
      { kicker: 'Mistake 2', title: '“12 years is the <em>average</em> age”', titleSize: 104, vis: D.whiskyBottle(115),
        lines: [{ html: 'The age shown is the <b>youngest</b> spirit in the blend', at: 's2' }],
        pop: { at: 's2', html: '<small>Age statement</small>Youngest', top: 1230 }, tone: 'green',
        vo: 'Twelve years is the average age? No. It is the age of the youngest spirit in the blend.' },
      { kicker: 'Mistake 3', title: '“It kept ageing <em>in the bottle</em>”', titleSize: 100,
        photo: ph(P.casks, { h: 800, textTop: 680 }),
        lines: [{ html: 'Ageing happens <b>in the barrel</b>', at: 's3' }, { html: 'Time in bottle <b>doesn’t count</b>', at: 's3+1.4' }],
        vo: 'Ten years in my cupboard, so it is twenty-two now? Sorry! Ageing happens in the barrel, not the bottle.' },
      { kicker: 'Recap', title: 'Read it <em>like a pro</em>', titleSize: 116,
        lines: [{ html: 'Colour <b>≠</b> age', cls: 'big', at: 's1' }, { html: 'Age = the <b>youngest</b>', cls: 'big', at: 's2' }, { html: 'Bottle years <b>don’t count</b>', cls: 'big', at: 's3' }],
        vo: 'Colour is not age. Age means the youngest. Bottle years do not count.' },
      { kicker: 'Your turn', title: 'Which one <em>got you?</em>', titleSize: 120, vis: D.barrel(240),
        lines: [{ html: 'Comment <b>1</b>, <b>2</b> or <b>3</b>', cls: 'big', at: 0.3 }],
        vo: 'Which one got you? Comment one, two or three.' },
    ] },

  /* R5 · Beer L1 · this or that: malt or hops? (funk, af_heart) */
  { id: 'reel-beer-malt-or-hops', title: 'Malt or hops?', bg: 'course', course: 'beer', level: 1, music: 'funk', voice: 'af_heart',
    imagery: 'Photo: a barley field at golden hour near Nottuln; drawings: barley ear, pint of golden beer, dark beer, hazy wheat beer in a tall glass',
    photos: [P.barley],
    tile: { variant: 'arch', photo: P.barley.src, pos: 'center 60%', tone: 'course', head: 'Malt <em>or hops?</em>', headSize: 120, sub: '5 beer questions. Answer fast.', archH: 600 },
    scenes: [
      { hook: true, kicker: 'This or that', title: 'Malt <em>or hops?</em>', titleSize: 140, sub: '5 questions. Answer fast.',
        photo: ph(P.barley, { h: 900, pos: 'center 60%', textTop: 760 }), vo: 'Malt or hops? Five beer questions. Answer fast!' },
      { kicker: 'Question 1', title: 'The <em>bitterness?</em>', titleSize: 130, vis: duo('Malt', 'Hops'),
        lines: [], pop: { at: 's2', html: 'Hops!<span>Added early in the boil = more bitter</span>', top: 1050 },
        vo: 'The bitterness? Hops! The earlier they go into the boil, the more bitter the beer.' },
      { kicker: 'Question 2', title: 'The <em>colour?</em>', titleSize: 140, vis: duo('Malt', 'Hops'),
        pop: { at: 's2', html: 'Malt!<span>Kilned longer and hotter, or roasted</span>', top: 1050 },
        vo: 'The colour? Malt! Speciality malts are kilned longer and hotter, or roasted.' },
      { kicker: 'Question 3', title: 'Coffee and <em>roast</em> notes?', titleSize: 116, vis: row([D.beerGlass(110, 'black'), D.barley(60)], 20),
        pop: { at: 's2', html: 'Malt!<span>From heavily roasted malts</span>', top: 1170 },
        vo: 'Coffee and roast notes? Malt again, from heavily roasted malts.' },
      { kicker: 'Question 4', title: 'Banana and <em>clove?</em>', titleSize: 130, vis: D.beerGlass(100, 'hazy', { shape: 'weizen' }),
        pop: { at: 's2', html: 'Neither!<span>It’s the yeast</span>', top: 1170 }, tone: 'green',
        vo: 'Banana and clove? Neither! That is the yeast.' },
      { kicker: 'Bonus', title: 'The <em>biggest</em> ingredient?', titleSize: 120, vis: row([D.beerGlass(110, 'gold'), D.barley(60)], 20),
        pop: { at: 's2', html: 'Water<span>By far</span>', top: 1170 },
        vo: 'Bonus: the biggest ingredient in beer? Water, by far.' },
      { kicker: 'Your score', title: 'How many <em>out of 5?</em>', titleSize: 116,
        lines: [{ html: 'Comment your <b>score</b>', cls: 'big', at: 0.3 }], vis: row([D.beerGlass(110, 'gold'), D.beerGlass(110, 'black'), D.beerGlass(110, 'hazy', { shape: 'weizen' })], 26),
        vo: 'How many out of five? Comment your score.' },
    ] },

  /* R6 · Sake L1 · POV: your friend wants to heat the daiginjō (upbeat pop pluck, bm_george) */
  { id: 'reel-sake-pov-warm-or-chilled', title: 'POV: your friend wants to heat the daiginjō', bg: 'course', course: 'sake', level: 1, music: 'pop', voice: 'bm_george',
    imagery: 'Drawings: sake flask (tokkuri) and small cup (ochoko), glass thermometers (blue = chilled, red = warm), cedar box (masu)',
    tile: { variant: 'solid', tone: 'course', arc: 'POV: heating the daiginjō', arcSize: 64, arcR: 1000,
      art: row([D.tokkuri(230), F.thermometer(84, 'warm', 0.8)], 30), artTop: 640, sub: 'Chilled, room temperature or warm?' },
    scenes: [
      { hook: true, kicker: 'POV', title: 'Your friend wants to <em>heat the daiginjō</em>', titleSize: 104,
        vis: row([D.tokkuri(200), F.thermometer(80, 'warm', 0.8)], 40), vo: 'POV: your friend wants to heat the junmai daiginjō.' },
      { kicker: 'Stop!', title: 'Ginjō styles: <em>serve chilled</em>', titleSize: 110, vis: row([F.thermometer(80, 'cold', 0.25), E.ochoko(150)], 40),
        lines: [{ html: 'Heat kills the <b>fruity, floral aromas</b>', at: 's3' }, { html: 'Chilled: <b>6–13 °C</b>', at: 's4' }],
        vo: 'Stop! Daiginjō is a ginjō style. Heat kills its fruity, floral aromas. Serve it chilled.' },
      { kicker: 'So what can you warm?', title: 'Junmai, honjōzō, <em>futsū-shu</em>', titleSize: 100,
        lines: [{ html: 'Chilled, <b>room temperature</b> or <b>warm</b>', at: 's3' }],
        vis: row([F.thermometer(70, 'cold', 0.25), F.thermometer(70, 'room', 0.5), F.thermometer(70, 'warm', 0.8)], 50),
        vo: 'So what can you warm? Junmai, honjōzō and futsū-shu. Chilled, room temperature or warm: all fine.' },
      { kicker: 'How to warm it', title: '<em>40–50 °C</em> in the cup', titleSize: 120, vis: row([D.tokkuri(170), F.thermometer(76, 'warm', 0.7)], 30),
        lines: [{ html: 'Flask in water at about <b>80 °C</b>', at: 's2' }, { html: 'Always use a <b>thermometer</b>', at: 's2+1.4' }],
        vo: 'Warm means forty to fifty degrees. Use a water bath, and a thermometer.' },
      { kicker: 'Why warm it?', title: 'Heat makes sake seem <em>fuller</em>', titleSize: 104, vis: row([D.tokkuri(150), E.ochoko(120)], 24),
        lines: [{ html: 'More intense, fuller, <b>more acidic</b>', at: 's1+0.8' }, { html: 'Useful <b>at the table</b>', at: 's2' }],
        vo: 'Warm sake seems more intense, fuller and more acidic. Great with food.' },
      { kicker: 'And sparkling sake?', title: '<em>Chilled</em> only', titleSize: 140, vis: F.thermometer(90, 'cold', 0.25),
        vo: 'Sparkling sake? Chilled only.' },
      { kicker: 'Your turn', title: 'Chilled, room <em>or warm?</em>', titleSize: 116, vis: row([E.masu(170), E.ochoko(130)], 30),
        lines: [{ html: 'Comment your <b>favourite</b>', cls: 'big', at: 0.3 }],
        vo: 'Chilled, room temperature or warm? Comment your favourite.' },
    ] },
];
// the pop tone sits on the scene object for readability; move it into pop.tone
for (const r of reels) for (const s of r.scenes) if (s.tone && s.pop) { s.pop.tone = s.tone; delete s.tone; }

module.exports = {
  id: 'batch-04', out: 'social/instagram/batch-04', v2: true, reelTemplate: 'reel-viral.html', maxMB: 9.5, preset: 'veryfast',
  voiceover: true, voice: 'bf_emma', speed: 1.12, loudness: -15, uniqueMusic: true, coverGrid: true, coverCols: 3,
  coverNote: 'Six voiceover reels in posting order. Each has its own voice (rotated) and its own music style. The dashed band is the 4:5 crop shown on the profile grid.',
  posts: [], stories: [], reels,
};
