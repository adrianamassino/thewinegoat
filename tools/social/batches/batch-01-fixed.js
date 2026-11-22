// Batch 01, corrected imagery (v2 cream/burgundy look, course + level badge).
// Replaces three published batch-01 items:
//  - carousel A "Same grape. Two wines." (Chardonnay / Sauvignon Blanc: white grapes and pale glasses only)
//  - the Sancerre quiz (was a story pair) as a 2-slide 1080x1350 carousel (Sauvignon Blanc: white imagery)
//  - reel 1 "3 grapes in 15 seconds" (Chardonnay and Sauvignon Blanc frames white, Pinot Noir frame red)
// Same facts and captions as batch-01 (app/l1, app/l2 content). Levels checked against the specifications:
// climate effect + Pays d'Oc / Marlborough examples are Level 2; Sancerre and the three grapes are Level 1.
'use strict';
const { B, B2 } = require('../lib/render');
const I = require('../lib/illus');

const row = (...svgs) => `<div style="display:flex;gap:18px;align-items:flex-end">${svgs.join('')}</div>`;

const posts = [
  {
    id: 'a-same-grape-two-wines', course: 'wine', level: 2, tpl: 'compare',
    slides: [
      { layout: 'cover', kicker: 'Climate 101',
        title: 'Same grape.<br><em>Two wines.</em>', titleSize: 116,
        sub: 'How cool and warm climates reshape Chardonnay and Sauvignon Blanc', subWidth: 560,
        art: { svg: row(I.grapes(220, 'white'), I.glass(140, 'pale'), I.glass(140, 'gold')), style: { right: 70, bottom: 140 } } },
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
        art: { svg: I.grapes(170, 'white'), style: { right: 80, bottom: 140 } } },
      { layout: 'cta', kicker: 'Your turn',
        title: 'Cool or warm: <em>which style do you prefer?</em>', titleSize: 76,
        sub: 'Tell us in the comments and save this for your next tasting.',
        art: { svg: row(I.glass(150, 'pale'), I.glass(150, 'gold')), style: { right: 90, bottom: 140 } } },
    ],
  },
  {
    id: 'sancerre-quiz', course: 'wine', level: 1, tpl: 'flash',
    slides: [
      { layout: 'cover', kicker: 'Quick quiz · A or B?',
        title: 'Sancerre <em>is made from…</em>', titleSize: 96,
        html: '<div style="height:40px"></div>' + B.options(['Chardonnay', 'Sauvignon Blanc'])
          + '<div class="sub" style="margin-top:30px">Answer in the comments, then swipe.</div>',
        art: { svg: row(I.grapes(200, 'white'), I.glass(140, 'pale')), style: { right: 80, bottom: 140 } } },
      { layout: 'cta', kicker: 'The answer',
        title: 'B · <em>Sauvignon Blanc</em>', titleSize: 92,
        sub: 'Sancerre, in the cool Loire Valley, is dry with <b>high acidity</b>, green apple and grassy, herbaceous notes.<br><br>The label usually doesn’t name the grape, so you need to know it.', subWidth: 860,
        cta: 'More quizzes on thewinegoat.com',
        art: { svg: I.grapes(190, 'white'), style: { right: 80, bottom: 140 } } },
    ],
  },
];

const two = (a, b) => `<div style="display:flex;gap:24px;align-items:flex-end">${a}${b}</div>`;
const reels = [
  { id: 'reel-1-three-grapes', course: 'wine', level: 1,
    cover: { t: 1.8 },
    scenes: [
      { start: 0, end: 2.6, kicker: 'Grape speed round', title: '3 grapes in <em>15 seconds</em>',
        caption: 'Three grapes every wine student should know. Ready?',
        art: { svg: `<div style="display:flex;gap:22px;align-items:flex-end">${I.grapes(200, 'white')}${I.glass(130, 'pale')}${I.glass(130, 'red')}${I.grapes(200, 'red')}</div>`, top: 1010 } },
      { start: 2.6, end: 7.0, kicker: 'Grape 1', title: 'Chardonnay', tag: 'White',
        lines: ['Cool: <b>green apple, lemon</b>, high acidity', 'Warm: <b>peach, pineapple</b>, fuller body', 'Oak adds <b>vanilla</b>'],
        caption: 'Chardonnay follows the climate: apple and lemon when cool, peach and pineapple when warm.',
        art: { svg: two(I.grapes(170, 'white'), I.glass(96, 'gold')), top: 1150 } },
      { start: 7.0, end: 11.4, kicker: 'Grape 2', title: 'Sauvignon Blanc', titleSize: 96, tag: 'White',
        lines: ['Pronounced aromas, <b>high acidity</b>', '<b>Grass, green bell pepper</b>, asparagus', 'Grapefruit to <b>passion fruit</b>'],
        caption: 'Sauvignon Blanc: zesty and herbaceous. Think grass, green pepper and grapefruit.',
        art: { svg: two(I.grapes(170, 'white'), I.glass(96, 'pale')), top: 1150 } },
      { start: 11.4, end: 15.8, kicker: 'Grape 3', title: 'Pinot Noir', tag: 'Black grape',
        lines: ['Light to medium body, <b>high acidity</b>', '<b>Low to medium</b> tannin', '<b>Strawberry, red cherry</b>, raspberry'],
        caption: 'Pinot Noir: delicate red fruit, fresh acidity, gentle tannin.',
        art: { svg: two(I.grapes(170, 'red'), I.glass(96, 'red')), top: 1150 } },
      { start: 15.8, end: 18.5, kicker: 'Your turn', title: 'Which one do you <em>drink most?</em>',
        lines: ['Practise free on <b>thewinegoat.com</b>'],
        caption: 'Tell us in the comments, and follow for more.',
        art: { svg: `<div style="display:flex;gap:30px;align-items:flex-end">${I.glass(140, 'gold')}${I.glass(140, 'pale')}${I.glass(140, 'red')}</div>`, top: 1040 } },
    ] },
];

module.exports = { id: 'batch-01-fixed', out: 'social/instagram/batch-01-fixed', v2: true, reelTemplate: 'reel-light.html', slideRange: [2, 7], posts, stories: [], reels };
