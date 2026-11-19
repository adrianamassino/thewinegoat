// Instagram batch 01 — The Wine Goat (@the.winegoat). ENGLISH ONLY.
// Facts are taken from the app content (app/l1, app/l2, app/spirits/s1, app/spirits/s2 — English index 2).
// Rules: educational, no prices/discounts/payment, never claim WSET affiliation or "official" questions.
'use strict';
const { B } = require('../lib/render');

const G = (name) => `img/goats/${name}.webp`;

/* =========================== FEED CAROUSELS (1080x1350) =========================== */
const posts = [
  /* ---------- a. Cool vs warm climate ---------- */
  {
    id: 'a-cool-vs-warm-climate',
    slides: [
      { layout: 'cover', theme: 'dark', kicker: 'Climate 101',
        title: 'Same grape.<br><em>Two wines.</em>',
        sub: 'How cool and warm climates reshape Chardonnay and Sauvignon Blanc',
        subWidth: 520,
        goat: { src: G('ig-n20'), style: { right: 40, bottom: 120, height: 640 } } },
      { layout: 'content', theme: 'light', kicker: 'The rule',
        title: 'Heat changes <em>the grape</em>',
        html: B.compare([
          { tag: 'Cool climate', tone: 'cool', title: 'Fresher', items: ['Less sugar, more acidity', 'Lighter wines', 'Green fruit and citrus'], eg: 'e.g. Germany, northern France' },
          { tag: 'Warm climate', tone: 'warm', title: 'Riper', items: ['More sugar, less acidity', 'Fuller, richer wines', 'Stone and tropical fruit'], eg: 'e.g. parts of Australia and California' },
        ]) + B.note('<b>Growing-season average:</b> cool 16.5&nbsp;°C (62&nbsp;°F) or below · moderate 16.5–18.5&nbsp;°C · warm 18.5–21&nbsp;°C (65–70&nbsp;°F)') },
      { layout: 'content', theme: 'light', kicker: 'Example 1',
        title: 'Chardonnay',
        sub: 'Top quality in cool, moderate and warm climates alike',
        html: B.compare([
          { tag: 'Cool', tone: 'cool', title: 'Lean & stony', items: ['High acidity', 'Light to medium body', 'Green apple, pear, lemon, wet stones'], eg: 'e.g. Chablis' },
          { tag: 'Warm', tone: 'warm', title: 'Rich & sunny', items: ['Medium acidity', 'Full body', 'Peach, pineapple, banana'], eg: 'e.g. Pays d’Oc IGP' },
        ]) + B.note('<b>Oak is a separate choice:</b> it can add vanilla in any climate.') },
      { layout: 'content', theme: 'light', kicker: 'Example 2',
        title: 'Sauvignon Blanc',
        sub: 'Ripeness moves the fruit; the “green” notes stay',
        html: B.compare([
          { tag: 'Less ripe', tone: 'cool', title: 'Zesty', items: ['Green apple, gooseberry', 'Grapefruit, wet stones'], eg: 'e.g. Sancerre, cool Loire' },
          { tag: 'Riper', tone: 'warm', title: 'Tropical', items: ['Peach', 'Passion fruit'], eg: 'e.g. Marlborough, New Zealand' },
        ]) + B.note('<b>Always there:</b> high acidity and herbaceous notes (grass, green bell pepper, asparagus). It prefers cool and moderate climates: much of the warm Languedoc is too hot for it.') },
      { layout: 'content', theme: 'light', kicker: 'Recap',
        title: 'Two questions <em>for any glass</em>',
        html: B.ladder([
          { n: '1', title: 'Cool or warm?', text: 'Apple and lemon with high acidity point to cool. Peach and pineapple with a fuller body point to warm.' },
          { n: '2', title: 'Oak or not?', text: 'Vanilla says oak. Pure, fresh fruit usually means stainless steel or other inert vessels.' },
          { n: '★', title: 'Same grape, different style', text: 'The climate makes the difference.', hi: true },
        ]),
        goat: { src: G('ig-n13'), style: { right: 70, bottom: 120, height: 220 } } },
      { layout: 'cta', theme: 'dark', kicker: 'Your turn',
        title: 'Cool or warm: <em>which style do you prefer?</em>',
        sub: 'Tell us in the comments and save this for your next tasting.',
        goat: { src: G('ig-n26'), style: { right: 50, bottom: 110, height: 600 } } },
    ],
  },

  /* ---------- b. Quiz: Which grape is it? ---------- */
  {
    id: 'b-quiz-which-grape',
    slides: [
      { layout: 'content', theme: 'dark', kicker: 'Which grape is it? · 1 of 3',
        title: 'Blackcurrant, mint <em>and cedar</em>',
        html: B.clues(['Dry red', 'High tannin', 'High acidity', 'Black cherry', 'Green bell pepper', 'Oak: cedar, vanilla'])
          + B.options(['Pinot Noir', 'Cabernet Sauvignon', 'Merlot'])
          + '<div class="hint">Answer on the next slide</div>',
        goat: { src: G('explore'), style: { right: 40, bottom: 105, height: 330 } } },
      { layout: 'content', theme: 'light', kicker: 'Answer 1',
        title: 'B · Cabernet <em>Sauvignon</em>',
        html: B.options(['Pinot Noir', 'Cabernet Sauvignon', 'Merlot'], 'B') + '<div style="height:30px"></div>'
          + B.bullets(['<b>Blackcurrant</b> is its signature aroma.', 'High tannin, so it is often blended: with <b>Merlot</b> in Bordeaux to soften it.', 'Pinot Noir is red fruit and lower tannin; Merlot is softer, with medium tannin.']) },
      { layout: 'content', theme: 'dark', kicker: 'Which grape is it? · 2 of 3',
        title: 'Grass <em>and grapefruit</em>',
        html: B.clues(['Dry white', 'Pronounced aromas', 'High acidity', 'Passion fruit', 'Asparagus', 'Usually no oak'])
          + B.options(['Chardonnay', 'Riesling', 'Sauvignon Blanc'])
          + '<div class="hint">Answer on the next slide</div>',
        goat: { src: G('peek'), style: { right: 40, bottom: 105, height: 320 } } },
      { layout: 'content', theme: 'light', kicker: 'Answer 2',
        title: 'C · Sauvignon <em>Blanc</em>',
        html: B.options(['Chardonnay', 'Riesling', 'Sauvignon Blanc'], 'C') + '<div style="height:30px"></div>'
          + B.bullets(['Fresh fruit plus <b>“green” notes</b> (grass, green bell pepper, asparagus) is its signature.', 'Key wines: <b>Sancerre</b> (Loire) and <b>New Zealand</b> (e.g. Marlborough).', 'Riesling leans floral, lime and peach; Chardonnay often shows oak.']) },
      { layout: 'content', theme: 'dark', kicker: 'Which grape is it? · 3 of 3',
        title: 'Black fruit, <em>black pepper</em>',
        html: B.clues(['Dry red', 'Medium to full body', 'Medium to high tannin', 'Blackberry', 'Liquorice', 'It has two names'])
          + B.options(['Merlot', 'Pinot Noir', 'Syrah / Shiraz'])
          + '<div class="hint">Answer on the next slide</div>',
        goat: { src: G('ig-n12'), style: { right: 40, bottom: 105, height: 320 } } },
      { layout: 'content', theme: 'light', kicker: 'Answer 3',
        title: 'C · Syrah <em>/ Shiraz</em>',
        html: B.bullets(['Same grape: <b>Syrah</b> in France, <b>Shiraz</b> in Australia.', '<b>Northern Rhône:</b> medium body, fresh blackberry, black pepper.', '<b>Warm Barossa Valley:</b> full body, jammy black cherry, liquorice.'])
          + B.note('<b>How many did you get?</b> Drop your score in the comments.<br>Practise free on thewinegoat.com'),
        goat: { src: G('trophy'), style: { right: 70, bottom: 110, height: 250 } } },
    ],
  },

  /* ---------- c. Pot still vs column still ---------- */
  {
    id: 'c-pot-vs-column-still',
    slides: [
      { layout: 'cover', theme: 'dark', kicker: 'Spirits basics',
        title: 'Pot still <em>vs</em> column still',
        sub: 'The difference in 5 slides',
        subWidth: 480,
        goat: { src: G('mods'), style: { right: 40, bottom: 110, height: 600 } } },
      { layout: 'content', theme: 'light', kicker: 'Still 1',
        title: 'The pot still',
        sub: 'Batch by batch, like a washing machine',
        html: B.bullets([
          'Three parts: a <b>pot</b> over a heat source, a <b>condenser</b>, and a pipe linking them.',
          'Load, distil, empty, clean: it <b>cannot run non-stop</b>.',
          'Usually two runs: <b>~10% → ~25% → ~75% abv</b>.',
          'Result: lower strength, <b>medium to pronounced aromas</b>, lots of character.',
        ]) + B.note('<b>Never neutral:</b> however many times you redistil, a pot still cannot reach a very high-strength neutral spirit.') },
      { layout: 'content', theme: 'light', kicker: 'Still 2',
        title: 'The column still',
        sub: 'Non-stop, like an escalator',
        html: B.bullets([
          'A tall column divided into many <b>plates</b>.',
          'Vapour rises, liquid falls: a small distillation on <b>every plate, all at once</b>.',
          'Strength is <b>highest at the top</b> of the column.',
          'Runs <b>continuously</b>; stopped only for cleaning.',
          'With enough plates: <b>up to 96% abv</b>.',
        ]) },
      { layout: 'content', theme: 'light', kicker: 'The golden rule',
        title: 'Higher strength, <em>less aroma</em>',
        html: B.ladder([
          { n: '75%', title: 'Medium to pronounced', text: 'Armagnac, Bourbon, rhum agricole: all made in column stills!' },
          { n: '90%', title: 'Light', text: 'Light rums, Scottish grain whisky' },
          { n: '96%', title: 'Neutral spirit', text: 'Almost no aroma: the base of vodka', hi: true },
        ]) + B.note('<b>Myth buster:</b> a column still does not mean neutral. The distiller chooses the strength.') },
      { layout: 'cta', theme: 'dark', kicker: 'Quick quiz',
        title: 'Which still can reach <em>96% abv?</em>',
        sub: 'Answer: only a column still. A pot still never makes a neutral spirit.',
        subWidth: 600,
        html: '<div class="sub" style="max-width:560px;font-size:32px;margin-top:-6px">Save it for your spirits exam.</div>',
        goat: { src: G('mosaic'), style: { right: 40, bottom: 110, height: 470 } } },
    ],
  },

  /* ---------- d. How to read a German wine label ---------- */
  {
    id: 'd-german-wine-label',
    slides: [
      { layout: 'cover', theme: 'dark', kicker: 'Label reading',
        title: 'How to read a <em>German</em> wine label',
        titleSize: 100,
        sub: 'Kabinett, Spätlese, Auslese… decoded',
        subWidth: 470,
        goat: { src: G('books'), style: { right: 40, bottom: 120, height: 470 } } },
      { layout: 'content', theme: 'light', kicker: 'Step 1',
        title: 'Find the <em>category</em>',
        sub: 'The terms measure how ripe (sugary) the grapes were at harvest.',
        html: B.ladder([
          { n: '1', title: 'Landwein · PGI', text: 'Usually light and dry to off-dry.' },
          { n: '2', title: 'Qualitätswein · PDO', text: 'From one of 13 wine-growing areas, such as Mosel or Rheingau. Riper grapes.' },
          { n: '3', title: 'Prädikatswein · PDO', text: 'Higher minimum sugar in the grapes, from a single area.', hi: true },
        ]) },
      { layout: 'content', theme: 'light', kicker: 'Step 2',
        title: 'The six <em>Prädikat</em> levels',
        sub: 'Ranked by the minimum sugar in the grapes',
        html: B.ladder([
          { n: '1', title: 'Kabinett' },
          { n: '2', title: 'Spätlese' },
          { n: '3', title: 'Auslese' },
          { n: '4', title: 'Beerenauslese (BA)' },
          { n: '4', title: 'Eiswein', text: 'Same minimum sugar as BA: the one exception' },
          { n: '5', title: 'Trockenbeerenauslese (TBA)', hi: true },
        ]).replace(/class="ladder"/, 'class="ladder" style="gap:12px"').replace(/class="step/g, 'style="padding:14px 26px" class="step') },
      { layout: 'content', theme: 'light', kicker: 'Step 3',
        title: 'Dry <em>or sweet?</em>',
        html: B.compare([
          { tag: 'Riper grapes', tone: 'gold', title: 'Kabinett · Spätlese · Auslese', items: ['Can be dry or have some sweetness', 'If dry: riper = more alcohol', 'Dry Auslese > dry Spätlese > dry Kabinett'] },
          { tag: 'Concentrated', tone: 'wine', title: 'BA · TBA · Eiswein', items: ['Always sweet, low in alcohol', 'BA, TBA: noble rot (botrytis)', 'Eiswein: grapes frozen on the vine, no botrytis'] },
        ]) + B.note('<b>Two words worth knowing:</b> Trocken = dry · Halbtrocken = some sweetness') },
      { layout: 'content', theme: 'light', kicker: 'Recap & quiz',
        title: 'Which is stronger: <em>a dry Kabinett or a dry Auslese?</em>',
        titleSize: 64,
        html: B.note('<b>Answer: the dry Auslese.</b> Riper grapes have more sugar, and in a dry wine that sugar has become alcohol.')
          + '<div style="height:26px"></div>'
          + B.bullets(['Category first: <b>Landwein → Qualitätswein → Prädikatswein</b>', 'Then the level: <b>Kabinett → Spätlese → Auslese → BA / Eiswein → TBA</b>', 'Then sweetness: <b>Trocken</b> or <b>Halbtrocken</b>']) },
      { layout: 'cta', theme: 'dark', kicker: 'Over to you',
        title: 'Which German term <em>trips you up?</em>',
        sub: 'Ask in the comments: we will answer the trickiest ones.',
        goat: { src: G('study'), style: { right: 40, bottom: 110, height: 500 } } },
    ],
  },

  /* ---------- e. Serving temperatures cheat sheet ---------- */
  {
    id: 'e-serving-temperatures',
    slides: [
      { layout: 'cover', theme: 'dark', kicker: 'Cheat sheet · save it',
        title: 'Serving <em>temperatures</em>',
        sub: 'From Sauternes to Shiraz, in °C and °F',
        subWidth: 520,
        goat: { src: G('ig-n35'), style: { right: 30, bottom: 120, height: 430 } } },
      { layout: 'content', theme: 'light', kicker: 'Whites, sparkling & sweet',
        title: 'Chill, <em>but how much?</em>',
        html: B.rows([
          { name: 'Sweet wines', desc: 'e.g. Sauternes · well chilled', c: '6–8 °C', f: '43–46 °F' },
          { name: 'Sparkling', desc: 'e.g. Champagne · well chilled', c: '6–10 °C', f: '43–50 °F' },
          { name: 'Light & medium whites, rosés', desc: 'e.g. Pinot Grigio · chilled', c: '7–10 °C', f: '45–50 °F' },
          { name: 'Full-bodied whites', desc: 'e.g. oaked Chardonnay · lightly chilled', c: '10–13 °C', f: '50–55 °F' },
        ]) + B.note('Too cold hides the richer aromas of a full-bodied white.') },
      { layout: 'content', theme: 'light', kicker: 'Reds',
        title: 'Room temperature <em>is a range</em>',
        html: B.rows([
          { name: 'Light reds', desc: 'e.g. Beaujolais · lightly chilled', c: '13 °C', f: '55 °F' },
          { name: 'Medium & full reds', desc: 'e.g. Shiraz · room temperature', c: '15–18 °C', f: '59–64 °F' },
        ]) + B.note('<b>Why a range?</b> Central heating and air conditioning make “room temperature” very variable.'),
        goat: { src: G('ig-g10'), style: { right: 70, bottom: 120, height: 330 } } },
      { layout: 'content', theme: 'light', kicker: 'Service tips',
        title: 'Three habits <em>of good service</em>',
        html: B.ladder([
          { n: '1', title: 'Ice and water', text: 'Fill the bucket with ice and cold water: water surrounds the bottle, ice alone chills far less.' },
          { n: '2', title: 'No radiators', text: 'Red too cold? Leave it in the room and let it warm up naturally.' },
          { n: '3', title: 'The guest decides', text: 'Temperatures are a guide: a guest’s preference comes first.', hi: true },
        ]) },
      { layout: 'content', theme: 'light', kicker: 'At a glance',
        title: 'The whole chart',
        html: B.therm([
          { name: 'Sweet', eg: 'Sauternes', from: 6, to: 8, color: '#c99a2e' },
          { name: 'Sparkling', eg: 'Champagne', from: 6, to: 10, color: '#d4a23a' },
          { name: 'Light whites, rosés', eg: 'Pinot Grigio', from: 7, to: 10, color: '#b9862b' },
          { name: 'Full whites', eg: 'oaked Chardonnay', from: 10, to: 13, color: '#9a6a1f' },
          { name: 'Light reds', eg: 'Beaujolais', from: 13, to: 13, color: '#a3405f' },
          { name: 'Medium/full reds', eg: 'Shiraz', from: 15, to: 18, color: '#6b1f3a' },
        ]) + B.note('°F: 6 °C = 43 °F · 10 °C = 50 °F · 13 °C = 55 °F · 18 °C = 64 °F') },
      { layout: 'cta', theme: 'dark', kicker: 'Quick poll',
        title: 'Do you chill <em>your light reds?</em>',
        sub: 'Yes or no: tell us below. Save this for your next dinner.',
        goat: { src: G('ig-n16'), style: { right: 40, bottom: 110, height: 520 } } },
    ],
  },

  /* ---------- f. 5 tasting mistakes ---------- */
  {
    id: 'f-tasting-mistakes',
    slides: [
      { layout: 'cover', theme: 'dark', kicker: 'Systematic tasting',
        title: '5 tasting mistakes <em>students make</em>',
        sub: 'And the quick fix for each',
        subWidth: 470,
        goat: { src: G('exam'), style: { right: 40, bottom: 110, height: 520 } } },
      { layout: 'content', theme: 'light', kicker: 'Mistakes 1–2',
        title: 'Before <em>the first sip</em>',
        html: B.mistakes([
          { n: 1, bad: 'Tasting after toothpaste or perfume', fix: 'Keep your palate clean and skip the perfume. Taste in good light, away from strong smells.' },
          { n: 2, bad: 'Pouring a full glass', fix: 'About <b>5 cL</b> is enough to judge appearance, nose and palate, and you can swirl without spilling.' },
        ]) },
      { layout: 'content', theme: 'light', kicker: 'Mistakes 3–4',
        title: 'On <em>the palate</em>',
        html: B.mistakes([
          { n: 3, bad: 'Judging acidity by sourness', fix: 'Sugar can mask acid. Judge by how much and how long your <b>mouth waters</b>. Tannin dries; acidity waters.' },
          { n: 4, bad: 'Counting bitterness in the finish', fix: 'The finish counts only <b>pleasant</b> sensations. If only acid or bitterness lingers, the finish is short.' },
        ]) },
      { layout: 'content', theme: 'light', kicker: 'Mistake 5',
        title: 'Judging <em>quality</em>',
        html: B.mistakes([
          { n: 5, bad: 'Thinking “more” always means better', fix: 'Beyond a point, more intensity is not higher quality, and complexity is not essential: some great wines win on purity (many icewines).' },
        ]) + '<div style="height:26px"></div>' + B.note('<b>Use four criteria:</b> balance · length · intensity · complexity.<br>4 positive = outstanding · 3 = very good · 2 = good · 1 = acceptable') },
      { layout: 'cta', theme: 'dark', kicker: 'Be honest',
        title: 'Which mistake <em>were you making?</em>',
        sub: 'Comment the number. Save this for your next tasting.',
        goat: { src: G('ig-n32'), style: { right: 40, bottom: 110, height: 520 } } },
    ],
  },
];

/* =========================== STORIES (1080x1920) =========================== */
// 3 pairs: question frame (leave room for a poll/quiz sticker) + answer frame.
const stories = [
  { id: 'story-1-sancerre',
    q: { question: 'Sancerre is made from…', options: ['Chardonnay', 'Sauvignon Blanc'],
         goat: { src: G('faq'), style: { right: 30, bottom: 30, height: 360 } } },
    a: { answer: 'B · <em>Sauvignon Blanc</em>',
         explain: 'Sancerre, in the cool Loire Valley, is dry with <b>high acidity</b>, green apple and grassy, herbaceous notes.<br><br>The label usually doesn’t name the grape, so you need to know it.',
         foot: 'More quizzes on thewinegoat.com',
         goat: { src: G('ig-n21'), style: { left: 30, bottom: 20, height: 400 } } } },
  { id: 'story-2-syrah-shiraz',
    q: { question: 'Syrah and Shiraz are…', options: ['Two different grapes', 'The same grape'],
         goat: { src: G('ig-n10'), style: { left: 30, bottom: 30, height: 380 } } },
    a: { answer: 'B · <em>The same grape</em>',
         explain: '<b>Syrah</b> in France, <b>Shiraz</b> in Australia.<br><br>Northern Rhône: medium body, fresh blackberry, black pepper.<br>Warm Barossa Valley: full body, jammy black cherry, liquorice.',
         foot: 'More quizzes on thewinegoat.com',
         goat: { src: G('ig-g14'), style: { right: 30, bottom: 20, height: 380 } } } },
  { id: 'story-3-eiswein',
    q: { question: 'Eiswein grapes are…', options: ['Shrivelled by noble rot', 'Frozen on the vine'],
         goat: { src: G('scoot'), style: { right: 20, bottom: 20, height: 380 } } },
    a: { answer: 'B · <em>Frozen on the vine</em>',
         explain: 'No botrytis: Eiswein shows fresh <b>peach, apricot, mango</b> and <b>pineapple</b>.<br><br>Noble rot is behind Beerenauslese (BA) and Trockenbeerenauslese (TBA).',
         foot: 'More quizzes on thewinegoat.com',
         goat: { src: G('leap'), style: { left: 30, bottom: 20, height: 400 } } } },
];

/* =========================== REELS (1080x1920, 30 fps) =========================== */
const reels = [
  { id: 'reel-1-three-grapes',
    cover: { t: 1.8 },
    scenes: [
      { start: 0, end: 2.6, kicker: 'Grape speed round', title: '3 grapes in <em>15 seconds</em>',
        caption: 'Three grapes every wine student should know. Ready?',
        goat: { src: G('ig-n05'), h: 460, top: 900 } },
      { start: 2.6, end: 7.0, kicker: 'Grape 1', title: 'Chardonnay', tag: 'White',
        lines: ['Cool: <b>green apple, lemon</b>, high acidity', 'Warm: <b>peach, pineapple</b>, fuller body', 'Oak adds <b>vanilla</b>'],
        caption: 'Chardonnay follows the climate: apple and lemon when cool, peach and pineapple when warm.',
        goat: { src: G('ig-n04'), h: 330, top: 1060 } },
      { start: 7.0, end: 11.4, kicker: 'Grape 2', title: 'Sauvignon Blanc', titleSize: 96, tag: 'White',
        lines: ['Pronounced aromas, <b>high acidity</b>', '<b>Grass, green bell pepper</b>, asparagus', 'Grapefruit to <b>passion fruit</b>'],
        caption: 'Sauvignon Blanc: zesty and herbaceous. Think grass, green pepper and grapefruit.',
        goat: { src: G('ig-n23'), h: 330, top: 1060 } },
      { start: 11.4, end: 15.8, kicker: 'Grape 3', title: 'Pinot Noir', tag: 'Black grape',
        lines: ['Light to medium body, <b>high acidity</b>', '<b>Low to medium</b> tannin', '<b>Strawberry, red cherry</b>, raspberry'],
        caption: 'Pinot Noir: delicate red fruit, fresh acidity, gentle tannin.',
        goat: { src: G('ig-n33'), h: 330, top: 1060 } },
      { start: 15.8, end: 18.5, kicker: 'Your turn', title: 'Which one do you <em>drink most?</em>',
        lines: ['Practise free on <b>thewinegoat.com</b>'],
        caption: 'Tell us in the comments, and follow for more.',
        goat: { src: G('final'), h: 420, top: 960 } },
    ] },
  { id: 'reel-2-neutral-spirit-96',
    cover: { t: 2.0 },
    scenes: [
      { start: 0, end: 2.8, kicker: 'Spirits basics', title: 'Neutral spirit: <em>96% in 20 seconds</em>', titleSize: 96,
        caption: 'Why does vodka smell of almost nothing? Watch.',
        goat: { src: G('mods'), h: 440, top: 930 } },
      { start: 2.8, end: 6.6, kicker: 'Step 1', title: 'Fermentation',
        lines: ['Yeast + sugar → <b>ethanol + CO₂</b>', 'The liquid ends at about <b>8–10% abv</b>'],
        caption: 'First, yeast turns sugar into alcohol: about 8 to 10% abv.',
        goat: { src: G('ig-n29'), h: 380, top: 1000 } },
      { start: 6.6, end: 10.4, kicker: 'Step 2', title: 'Distillation',
        lines: ['Ethanol <b>boils before water</b>', 'The vapours are <b>stronger</b> than the liquid left behind'],
        caption: 'Heat it: alcohol boils first, so the vapours are stronger.',
        goat: { src: G('guide'), h: 360, top: 1020 } },
      { start: 10.4, end: 14.8, kicker: 'The golden rule', title: 'Higher strength, <em>less aroma</em>', titleSize: 92,
        lines: ['~75% abv · <b>medium to pronounced</b>', '~90% abv · <b>light</b>', '95–96% abv · <b>neutral</b>'],
        caption: 'The higher the strength, the fewer aromas survive. At 95–96% it is neutral.',
        goat: null },
      { start: 14.8, end: 18.6, kicker: 'The tool', title: 'Only a <em>column still</em>', titleSize: 96,
        lines: ['Pot still: batches, <b>never neutral</b>', 'Column still: non-stop, <b>up to 96% abv</b>'],
        caption: 'Only a column still can reach 96%. A pot still never makes a neutral spirit.',
        goat: { src: G('method'), h: 380, top: 1010 } },
      { start: 18.6, end: 21.6, kicker: 'Then', title: 'Add <em>pure water</em>',
        lines: ['Vodka = <b>diluted neutral spirit</b>', 'Usually bottled at <b>40% abv</b>'],
        caption: 'Vodka is neutral spirit, diluted with pure water, usually to 40% abv.',
        goat: { src: G('feat'), h: 360, top: 1020 } },
      { start: 21.6, end: 24.0, kicker: 'Save it', title: 'For your <em>spirits exam</em>',
        lines: ['Practise free on <b>thewinegoat.com</b>'],
        caption: 'Follow for more spirits basics.',
        goat: { src: G('levels'), h: 440, top: 940 } },
    ] },
];

module.exports = { id: 'batch-01', out: 'social/instagram/batch-01', posts, stories, reels };
