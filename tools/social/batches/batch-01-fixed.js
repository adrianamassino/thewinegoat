// Batch 01, corrected imagery (v2 cream/burgundy look, course + level badge).
// Replaces three published batch-01 items:
//  - carousel A "Same grape. Two wines." (Chardonnay / Sauvignon Blanc: white grapes and pale glasses only)
//  - the Sancerre quiz (was a story pair) as a 2-slide 1080x1350 carousel (Sauvignon Blanc: white imagery)
//  - reel 1 "3 grapes in 15 seconds" (Chardonnay and Sauvignon Blanc frames white, Pinot Noir frame red)
// Same facts and captions as batch-01 (app/l1, app/l2 content). Levels checked against the specifications:
// climate effect + Pays d'Oc / Marlborough examples are Level 2; Sancerre and the three grapes are Level 1.
'use strict';
// Imagery rebuild (Nov 2026): real photos from the site's library (credited in captions.md) and painterly
// drawings (lib/illus2.js). White-wine topics: green-gold grapes and pale wine only; Pinot Noir frame red.
const { B, B2 } = require('../lib/render');
const I = require('../lib/illus2');
const { PH } = require('../lib/photos');

const row = (...svgs) => `<div style="display:flex;gap:18px;align-items:flex-end">${svgs.join('')}</div>`;
const inl = (svg, { justify = 'flex-end', mt = 'auto', pad = 0 } = {}) => `<div style="margin-top:${mt};display:flex;justify-content:${justify};align-items:flex-end;padding:0 ${pad}px">${svg}</div>`;
const P = {
  studioGrapes: PH('red-and-white-grape-bunches-hanging', 'A bunch of white grapes (cut out from a studio photo).'),
  whiteGrapes: PH('ripe-white-grapes-palatinate-vineyard', 'Ripe white grapes in a Palatinate (Pfalz) vineyard, Germany.'),
  sancerre: PH('sancerre-vineyards-loire-valley', 'Vineyards near Sancerre, in the Loire Valley.'),
  sauvignon: PH('sauvignon-blanc-grapes-serbia', 'Sauvignon Blanc grapes on the vine.'),
  pinot: PH('clos-de-vougeot-vineyard-chateau-burgundy', 'Pinot Noir vines in front of the Clos de Vougeot, Burgundy.'),
};

const posts = [
  {
    id: 'a-same-grape-two-wines', bg: 'cream', course: 'wine', level: 2, tpl: 'compare',
    imagery: 'Editorial cut-out cover: photo cut-out of a white grape bunch (studio photo) and two near-photographic glasses (pale and gold white wine); drawings: white grapes and glasses (CTA)',
    photos: [P.studioGrapes],
    slides: [
      { layout: 'cover', tile: { variant: 'edit', head: 'Same grape. <em>Two wines.</em>', headSize: 112,
          sub: 'Climate turns one grape into two styles.', arrows: true, arrowAt: [1], gap: 10,
          items: [{ src: 'tools/social/assets/cutouts/grapes-white.png', h: 440, label: 'White grapes' }, { svg: I.glassPhoto(170, 'pale'), h: 420, label: 'Cool' }, { svg: I.glassPhoto(170, 'gold'), h: 420, label: 'Warm' }] },
        kicker: 'Climate 101',
        photo: P.whiteGrapes.src, photoMode: 'top', photoH: 760, photoPos: 'center 40%',
        title: 'Same grape.<br><em>Two wines.</em>', titleSize: 108,
        sub: 'How cool and warm climates reshape Chardonnay and Sauvignon Blanc', subWidth: 560,
        art: { svg: row(I.glass(118, 'pale'), I.glass(118, 'gold')), style: { right: 80, bottom: 140 } } },
      { layout: 'content', kicker: 'The rule',
        title: 'Heat changes <em>the grape</em>',
        html: B2.vs2('Cool climate', 'Warm climate', [
          ['Grapes', 'Less sugar, <b>more acidity</b>', '<b>More sugar</b>, less acidity'],
          ['Wines', 'Lighter', 'Fuller, richer'],
          ['Fruit', 'Green fruit and citrus', 'Stone and tropical fruit'],
          ['For example', 'Germany, northern France', 'Parts of Australia and California'],
        ]) + '<div style="height:24px"></div>'
          + B.note('<b>Growing-season average:</b> cool 16.5&nbsp;°C (62&nbsp;°F) or below · moderate 16.5–18.5&nbsp;°C · warm 18.5–21&nbsp;°C (65–70&nbsp;°F)') },
      { layout: 'content', kicker: 'Example 1',
        title: 'Chardonnay',
        sub: 'Top quality in cool, moderate and warm climates alike', subWidth: 900,
        html: B2.vs2('Cool', 'Warm', [
          ['Style', '<b>Lean & stony</b>', '<b>Rich & sunny</b>'],
          ['Acidity', 'High', 'Medium'],
          ['Body', 'Light to medium', 'Full'],
          ['Aromas', 'Green apple, pear, lemon, wet stones', 'Peach, pineapple, banana'],
          ['For example', 'Chablis', 'Pays d’Oc IGP'],
        ]) + '<div style="height:24px"></div>' + B.note('<b>Oak is a separate choice:</b> it can add vanilla in any climate.') },
      { layout: 'content', kicker: 'Example 2',
        title: 'Sauvignon Blanc',
        sub: 'Ripeness moves the fruit; the “green” notes stay', subWidth: 900,
        html: B2.vs2('Less ripe', 'Riper', [
          ['Style', '<b>Zesty</b>', '<b>Tropical</b>'],
          ['Fruit', 'Green apple, gooseberry, grapefruit, wet stones', 'Peach, passion fruit'],
          ['For example', 'Sancerre, cool Loire', 'Marlborough, New Zealand'],
        ]) + '<div style="height:24px"></div>' + B.note('<b>Always there:</b> high acidity and herbaceous notes (grass, green bell pepper, asparagus). It prefers cool and moderate climates: much of the warm Languedoc is too hot for it.') },
      { layout: 'content', kicker: 'Recap',
        title: 'Two questions <em>for any glass</em>',
        html: B2.flow([
          { title: 'Cool or warm?', text: 'Apple and lemon with high acidity point to cool. Peach and pineapple with a fuller body point to warm.' },
          { title: 'Oak or not?', text: 'Vanilla says oak. Pure, fresh fruit usually means stainless steel or other inert vessels.' },
          { n: '★', title: 'Same grape, different style', text: 'The climate makes the difference.', hi: true },
        ]),
        center: true },
      { layout: 'cta', kicker: 'Your turn',
        title: 'Cool or warm: <em>which style do you prefer?</em>', titleSize: 76, titleWidth: 700,
        sub: 'Tell us in the comments and save this for your next tasting.', subWidth: 560,
        art: { svg: row(I.grapes(220, 'white'), I.glass(140, 'pale'), I.glass(140, 'gold')), style: { right: 70, bottom: 140 } } },
    ],
  },
  {
    id: 'sancerre-quiz', bg: 'course', course: 'wine', level: 1, tpl: 'flash',
    imagery: 'Photos: Sancerre vineyards (question), Sauvignon Blanc grapes on the vine (answer)',
    photos: [P.sancerre, P.sauvignon],
    slides: [
      { layout: 'cover', tile: { variant: 'arch', photo: P.sancerre.src, pos: 'center 55%', tone: 'course',
          head: 'Sancerre is made from…?', headSize: 84, archH: 700,
          extra: '<div class="tl-ab"><span><b>A</b>Chardonnay</span><span><b>B</b>Sauvignon Blanc</span></div><div class="tl-sub" style="font-size:28px">Answer in the comments, then swipe</div>' },
        kicker: 'Quick quiz · A or B?',
        photo: P.sancerre.src, photoMode: 'top', photoH: 620, photoPos: 'center 55%',
        title: 'Sancerre <em>is made from…</em>', titleSize: 92,
        html: '<div style="height:28px"></div>' + B.options(['Chardonnay', 'Sauvignon Blanc'])
          + '<div class="sub" style="margin:26px 0 0">Answer in the comments, then swipe.</div>' },
      { layout: 'cta', kicker: 'The answer',
        photo: P.sauvignon.src, photoMode: 'top', photoH: 600, photoPos: 'center 45%',
        title: 'B · <em>Sauvignon Blanc</em>', titleSize: 88,
        sub: 'Sancerre, in the cool Loire Valley, is dry with <b>high acidity</b>, green apple and grassy, herbaceous notes. The label usually doesn’t name the grape, so you need to know it.', subWidth: 900,
        cta: 'More quizzes on thewinegoat.com' },
    ],
  },
];

const two = (a, b) => `<div style="display:flex;gap:24px;align-items:flex-end">${a}${b}</div>`;
const reels = [
  { id: 'reel-1-three-grapes', bg: 'cream', course: 'wine', level: 1,
    tile: { variant: 'minimal', photo: P.sauvignon.src, pos: 'center 45%', tag: 'Wine students, take note', line: '3 grapes <em>in 15 seconds</em>' },
    imagery: 'Drawings: white and black grapes, pale/gold/red wine glasses; photos: Sauvignon Blanc grapes, Pinot Noir vines at the Clos de Vougeot',
    photos: [P.sauvignon, P.pinot],
    cover: { t: 1.8 },
    scenes: [
      { start: 0, end: 2.6, kicker: 'Grape speed round', title: '3 grapes in <em>15 seconds</em>',
        caption: 'Three grapes every wine student should know. Ready?',
        art: { svg: `<div style="display:flex;gap:22px;align-items:flex-end">${I.grapes(210, 'white')}${I.glass(120, 'pale')}${I.glass(120, 'red')}${I.grapes(210, 'red', { seed: 6 })}</div>`, top: 990 } },
      { start: 2.6, end: 7.0, kicker: 'Grape 1', title: 'Chardonnay', tag: 'White',
        lines: ['Cool: <b>green apple, lemon</b>, high acidity', 'Warm: <b>peach, pineapple</b>, fuller body', 'Oak adds <b>vanilla</b>'],
        caption: 'Chardonnay follows the climate: apple and lemon when cool, peach and pineapple when warm.',
        art: { svg: two(I.grapes(170, 'white', { seed: 9 }), I.glass(96, 'gold')), top: 1150 } },
      { start: 7.0, end: 11.4, kicker: 'Grape 2', title: 'Sauvignon Blanc', titleSize: 96, tag: 'White',
        lines: ['Pronounced aromas, <b>high acidity</b>', '<b>Grass, green bell pepper</b>, asparagus', 'Grapefruit to <b>passion fruit</b>'],
        caption: 'Sauvignon Blanc: zesty and herbaceous. Think grass, green pepper and grapefruit.',
        photo: { src: P.sauvignon.src, h: 860, pos: 'center 45%' } },
      { start: 11.4, end: 15.8, kicker: 'Grape 3', title: 'Pinot Noir', tag: 'Black grape',
        lines: ['Light to medium body, <b>high acidity</b>', '<b>Low to medium</b> tannin', '<b>Strawberry, red cherry</b>, raspberry'],
        caption: 'Pinot Noir: delicate red fruit, fresh acidity, gentle tannin.',
        photo: { src: P.pinot.src, h: 860, pos: 'center 60%' } },
      { start: 15.8, end: 18.5, kicker: 'Your turn', title: 'Which one do you <em>drink most?</em>',
        lines: ['Practise free on <b>thewinegoat.com</b>'],
        caption: 'Tell us in the comments, and follow for more.',
        art: { svg: `<div style="display:flex;gap:30px;align-items:flex-end">${I.glass(130, 'gold')}${I.glass(130, 'pale')}${I.glass(130, 'red')}</div>`, top: 1020 } },
    ] },
];

module.exports = { id: 'batch-01-fixed', out: 'social/instagram/batch-01-fixed', v2: true, reelTemplate: 'reel-light.html', slideRange: [2, 7], posts, stories: [], reels };
