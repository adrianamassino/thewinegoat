// Generates social/instagram/batch-04/captions.md (run after the build: node tools/social/batches/batch-04-captions.js).
// measured report (durations, sizes, loudness). Captions/alt text below.
const fs = require('fs');
const path = require('path');
const os = require('os');
const ROOT = path.resolve(__dirname, '..', '..', '..');
const batch = require(path.join(ROOT, 'tools/social/batches/batch-04.js'));
const R = require(path.join(ROOT, 'tools/social/lib/render.js'));
const rep = JSON.parse(fs.readFileSync(path.join(os.tmpdir(), 'twg-voice-check-batch-04.json'), 'utf8'));
const tpl = fs.readFileSync(path.join(__dirname, '..', 'templates', 'captions-batch-04.tpl.md'), 'utf8');
const STYLE = { bossa: 'bossa nova', lofi: 'lo-fi hip hop', cinematic: 'cinematic strings', swing: 'jazz swing', funk: 'funk', pop: 'upbeat pop pluck' };
const VOICE = { bf_emma: 'bf_emma (British female)', af_heart: 'af_heart (American female)', bm_george: 'bm_george (British male)' };

const C = {
  'reel-wine-food-myths': {
    n: 1, name: 'Food & wine: myth or fact?', format: 'myth vs fact, 4 rounds, score comment, loop', date: 'Mon 4 Jan', time: '13:00',
    caption: `WINE · LEVEL 1
4 food & wine "rules" most people believe. All 4 are myths 👇
1. Sweet food makes wine taste sweeter → no: less sweet, more acidic. Pick a wine at least as sweet as the dish.
2. Salty food is hard to pair → no: salt makes wine seem less bitter, less acidic, fruitier.
3. Lemon makes a crisp wine too sharp → no: acidity in food makes wine seem less acidic and fruitier.
4. A strong wine cools the chilli → no: the burn gets stronger and the alcohol stands out more.

How many did you believe? Comment 0 to 4.
Practise free on thewinegoat.com`,
    tags: '#wset #wset1 #winestudent #foodandwine #winepairing #foodpairing #learnwine #winetasting #wineeducation #mythorfact #sommelier',
    alt: 'Animated reel on a cream background with a "Wine · Level 1" badge and a voiceover. Opens on "Food & wine: 4 myths" with drawings of a slice of strawberry cream cake, a dish of sea salt, a lemon wedge and a red chilli. Each myth is shown as a quote with a red "Myth!" stamp, then the fact: sweet food makes wine seem less sweet and more acidic, so pick a wine at least as sweet as the dish; salt makes wine seem less bitter, less acidic and fruitier; over a photo of grilled salmon with potatoes and lemon wedges, acidity in food makes wine seem less acidic and fruitier; chilli makes the burn stronger and the alcohol stand out more. Ends asking "How many did you believe? Comment 0 to 4". Captions match the voice; original bossa nova music.',
    credit: 'Photo: Petar Milošević, CC BY-SA 4.0, via Wikimedia Commons',
  },
  'reel-wine-sweet-whites-guess': {
    n: 2, name: '3 sweet whites, 3 tricks (guess it)', format: 'guess it: match 3 wines to 3 methods, countdown, reveals', date: 'Wed 6 Jan', time: '19:30',
    caption: `WINE · LEVEL 2
3 sweet white wines. 3 ways to get the sugar. Can you match them? 🍯
Tricks: 1 a fungus · 2 frozen grapes · 3 a late harvest
Wines: A Sauternes · B Icewine (Eiswein) · C Alsace Vendanges Tardives

Lock in your answer before the countdown ends. The reveal is at the end.

How many did you match? Comment 0 to 3.
Practise free on thewinegoat.com`,
    tags: '#wset #wset2 #winestudent #sweetwine #sauternes #icewine #eiswein #noblerot #alsace #learnwine #winequiz #dessertwine',
    alt: 'Animated reel on a deep green background with a "Wine · Level 2" badge and a voiceover. Opens on "3 sweet whites. 3 tricks." with three drawn glasses of gold, pale and light white wine labelled A, B and C. It lists three tricks (a fungus pierces the skins, the grapes freeze on the vine, picked late and extra ripe) and three wines (Sauternes, Icewine, Alsace Vendanges Tardives), then a 3-second countdown. Reveals: Sauternes is noble rot; icewine is frozen on the vine and pressed while still frozen, with a drawn snowflake; Vendanges Tardives is late harvest. Ends asking how many you matched. The cover shows a cut-out bunch of green-white grapes next to the three glasses. Captions match the voice; original lo-fi hip hop music.',
    credit: 'Photo (cover cut-out): Franz van Duns, CC BY-SA 4.0, via Wikimedia Commons (adapted)',
  },
  'reel-wine-burgundy-rank': {
    n: 3, name: 'Rank the Burgundy pyramid', format: 'rank it, countdown, bottom-to-top reveal, twist, loop', date: 'Fri 8 Jan', time: '13:00',
    caption: `WINE · LEVEL 3
Rank these 4 red Burgundies from lowest to highest 👇
A · Chambertin
B · Bourgogne
C · Gevrey-Chambertin
D · Gevrey-Chambertin Premier Cru

Hint: the trap is in the names 👀 Write your order before the reveal.

Comment your score out of 4.
Practise free on thewinegoat.com`,
    tags: '#wset #wset3 #winestudent #burgundy #bourgogne #pinotnoir #grandcru #premiercru #gevreychambertin #winequiz #sommelier #learnwine',
    alt: 'Animated reel on a deep burgundy background with a "Wine · Level 3" badge and a voiceover. Opens over a photo of vine rows leading to the Château de la Tour in the Clos de Vougeot with "Burgundy: lowest → highest". Lists A Chambertin, B Bourgogne, C Gevrey-Chambertin, D Gevrey-Chambertin Premier Cru, then a countdown. Drawn red-wine bottles with generic labels reveal the order with pop-ups: Bourgogne, regional; Gevrey-Chambertin, village; Premier Cru, village plus vineyard; Chambertin, grand cru with its own appellation. Then the trap: Gevrey-Chambertin is the village, Chambertin the grand cru. Ends on "B · C · D · A" with a painted goat on a barrel raising a glass of red wine. Captions match the voice; original cinematic strings music.',
    credit: 'Photo: © Pierre André, CC BY-SA 4.0, via Wikimedia Commons',
  },
  'reel-spirits-label-mistakes': {
    n: 4, name: '3 mistakes reading a spirits label', format: '3 mistakes, recap, comment the number', date: 'Sun 10 Jan', time: '11:00',
    caption: `SPIRITS · LEVEL 1
3 mistakes people make reading a spirits label (no. 3 is sneaky) 🥃
1. "Darker means older." Not always: many blenders add a little caramel to keep the same colour batch after batch.
2. "12 years is the average age." No: an age statement is the age of the youngest spirit in the blend.
3. "Ten years in my cupboard makes it 22." Sorry: ageing happens in the barrel. Time in the bottle doesn't count.

Which one got you? Comment 1, 2 or 3.
Practise free on thewinegoat.com`,
    tags: '#wsetspirits #wset #spirits #whisky #brandy #spiritseducation #learnspirits #spiritsstudent #bartender #whiskylover #mixology',
    alt: 'Animated reel on a whisky-brown background with a "Spirits · Level 1" badge and a voiceover. Opens on "3 mistakes reading a spirits label" with a drawn amber spirits bottle with a plain label and a tasting glass. Mistake 1, "Darker means older", gets a "Not always!" stamp: many blenders add a little caramel for the same colour batch after batch. Mistake 2, "12 years is the average age": the age shown is the youngest spirit in the blend. Mistake 3, over a photo of numbered oak brandy casks in a cellar in Yerevan: "It kept ageing in the bottle"; ageing happens in the barrel, time in bottle does not count. A recap, then "Which one got you? Comment 1, 2 or 3" with a drawn barrel. Captions match the voice; original jazz swing music.',
    credit: 'Photo: Vyacheslav Argenberg, CC BY 4.0, via Wikimedia Commons',
  },
  'reel-beer-malt-or-hops': {
    n: 5, name: 'Malt or hops?', format: 'this or that, 5 quick questions, pop reveals, score', date: 'Tue 12 Jan', time: '19:30',
    caption: `BEER · LEVEL 1
Malt or hops? Answer fast 🍺
1. The bitterness
2. The colour
3. Coffee and roast notes
4. Banana and clove
Bonus: the biggest ingredient in beer

Say your answers out loud before each pop-up. Question 4 is a trap.

Your score out of 5? Comment it 👇
Practise free on thewinegoat.com`,
    tags: '#wsetbeer #wset #beer #beereducation #learnbeer #craftbeer #malt #hops #brewing #beerquiz #beerlover',
    alt: 'Animated reel on an amber background with a "Beer · Level 1" badge and a voiceover. Opens over a photo of a barley field at golden hour with "Malt or hops?". Each question shows two buttons, Malt and Hops, then a pop-up answer: bitterness, hops (added early in the boil = more bitter); colour, malt (kilned longer and hotter, or roasted); coffee and roast notes, malt, with a drawn glass of dark beer and an ear of barley; banana and clove, "Neither! It\'s the yeast", with a drawn hazy wheat beer; the biggest ingredient, water. Ends asking for your score out of 5 with three drawn beers. Captions match the voice; original funk music.',
    credit: 'Photo: Dietmar Rabich, CC BY-SA 4.0, via Wikimedia Commons',
  },
  'reel-sake-pov-warm-or-chilled': {
    n: 6, name: 'POV: your friend wants to heat the daiginjō', format: 'POV, quick rules, comment your favourite', date: 'Thu 14 Jan', time: '13:00',
    caption: `SAKE · LEVEL 1
POV: your friend wants to heat the junmai daiginjō 🔥❄️
Stop! Daiginjō is a ginjō style: heat kills its fruity, floral aromas. Serve it chilled (6–13 °C).
What can you warm? Junmai, honjōzō and futsū-shu: chilled, room temperature (15–18 °C) or warm all work.
Warm = 40–50 °C: put the flask in water at about 80 °C and use a thermometer.
Warm sake seems more intense, fuller and more acidic. Great with food.
Sparkling sake? Chilled only.

Chilled, room temperature or warm: which is your favourite? Comment below.
Practise free on thewinegoat.com`,
    tags: '#wsetsake #wset #sake #nihonshu #japanesesake #daiginjo #junmai #sakelover #sakeeducation #learnsake #warmsake',
    alt: 'Animated reel on an indigo background with a "Sake · Level 1" badge and a voiceover. Opens on "POV: your friend wants to heat the daiginjō" with a drawn white sake flask with a blue band, a small cup and a red thermometer. "Stop! Ginjō styles: serve chilled", with a blue thermometer: heat kills the fruity, floral aromas; chilled is 6–13 °C. Junmai, honjōzō and futsū-shu can be chilled, room temperature or warm, with three thermometers. Warm is 40–50 °C, the flask in water at about 80 °C, always with a thermometer. Warm sake seems more intense, fuller and more acidic. Sparkling sake: chilled only. Ends with a drawn cedar box and cup asking for your favourite. Captions match the voice; original upbeat pop music.',
    credit: '',
  },
};

const sched = batch.reels.map((r) => { const c = C[r.id]; return `| ${c.date} | ${c.time} | ${c.name} | ${R.badgeText(r)} | ${c.format} | ${STYLE[r.music]} | ${r.voice} |`; }).join('\n');
const blocks = batch.reels.map((r) => {
  const c = C[r.id]; const x = rep[r.id];
  const vo = r.scenes.map((s, i) => `${i + 1}. ${s.vo}`).join('\n');
  return `## Reel ${c.n} · ${c.name}
Files: \`reels/${r.id}.mp4\` (${x.dur} s, ${x.mb} MB) + \`_cover.png\` · ${R.badgeText(r)} · format: ${c.format}
**Music:** ${STYLE[r.music]} (\`${r.music}\`) · **Voice:** ${VOICE[r.voice]} · measured ${x.final.I} LUFS, true peak ${x.final.TP} dBTP

**Caption**
${c.caption}
${c.credit ? `\n${c.credit}\n` : ''}
${c.tags}

**Alt text**
${c.alt}

**Voiceover script** (one line per scene; each sentence is also the burned-in caption while it is spoken)
${vo}

---
`;
}).join('\n');
let out = tpl.replace('{{SCHEDULE}}', sched).replace('{{REELS}}', blocks);
for (const c of Object.values(C)) {
  const n = c.tags.split(/\s+/).length;
  if (n < 8 || n > 13) throw new Error(`${c.name}: ${n} hashtags`);
  if (!c.caption.includes('Practise free on thewinegoat.com')) throw new Error('cta missing');
}
fs.writeFileSync(path.join(ROOT, 'social/instagram/batch-04/captions.md'), out);
console.log('captions.md written');
