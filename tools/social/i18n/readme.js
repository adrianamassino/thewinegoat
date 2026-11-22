// Writes social/instagram/<lang>/README.md: suggested handle, bio (checked against Instagram's 150-character limit and
// against the site path of the language, which must exist in the repo), and the posting schedule of the batch.
// Usage: NODE_PATH=$(npm root -g) node tools/social/i18n/readme.js [lang ...]   (default: all languages)
'use strict';
const fs = require('fs');
const path = require('path');
const R = require('../lib/render');
const ui = require('./ui');

const BIO = {
  it: { name: 'The Wine Goat · Quiz sul vino', tz: 'Europe/Rome', lines: ['Quanto ne sai di vino? 🍷', 'App di studio per WSET Livello 1, 2, 3 e 4', 'Vino · distillati · sake · birra', 'Allenati gratis 👇'] },
  fr: { name: 'The Wine Goat · Quiz vin', tz: 'Europe/Paris', lines: ['Que savez-vous du vin ? 🍷', 'App de révision WSET Niveaux 1, 2, 3 et 4', 'Vin · spiritueux · saké · bière', 'Entraînez-vous gratuitement 👇'] },
  de: { name: 'The Wine Goat · Weinquiz', tz: 'Europe/Berlin', lines: ['Wie viel weißt du über Wein? 🍷', 'Lern-App für WSET Level 1, 2, 3 & 4', 'Wein · Spirituosen · Sake · Bier', 'Kostenlos üben 👇'] },
  ru: { name: 'The Wine Goat · Винный квиз', tz: 'Europe/Moscow', lines: ['Много ли вы знаете о вине? 🍷', 'Учебное приложение: WSET 1, 2, 3 и 4', 'Вино · крепкие напитки · саке · пиво', 'Тренируйтесь бесплатно 👇'] },
  pl: { name: 'The Wine Goat · Quiz o winie', tz: 'Europe/Warsaw', lines: ['Ile wiesz o winie? 🍷', 'Aplikacja do nauki WSET Poziom 1, 2, 3 i 4', 'Wino · alkohole mocne · sake · piwo', 'Ćwicz za darmo 👇'] },
  es: { name: 'The Wine Goat · Quiz de vino', tz: 'Europe/Madrid', lines: ['¿Cuánto sabes de vino? 🍷', 'App de estudio para WSET Nivel 1, 2, 3 y 4', 'Vino · destilados · sake · cerveza', 'Practica gratis 👇'] },
  'es-ar': { name: 'The Wine Goat · Quiz de vino', tz: 'America/Argentina/Buenos_Aires', late: 1, lines: ['¿Cuánto sabés de vino? 🍷', 'App para estudiar WSET Nivel 1, 2, 3 y 4', 'Vino · destilados · sake · cerveza', 'Practicá gratis 👇'] },
  'pt-br': { name: 'The Wine Goat · Quiz de vinho', tz: 'America/Sao_Paulo', lines: ['Quanto você sabe sobre vinho? 🍷', 'App de estudo: WSET Níveis 1, 2, 3 e 4', 'Vinho · destilados · saquê · cerveja', 'Pratique grátis 👇'] },
  nl: { name: 'The Wine Goat · Wijnquiz', tz: 'Europe/Amsterdam', lines: ['Hoeveel weet jij van wijn? 🍷', 'Studie-app voor WSET Level 1, 2, 3 & 4', 'Wijn · spirits · sake · bier', 'Oefen gratis 👇'] },
};
// Posting order of batch 03 (same as the English account: no two neighbouring grid tiles share a background family).
// [day, time, item id or story index]; times are local to the account's audience.
const PLAN = [[1, '13:00', 'reel-wine-rank-by-body'], [2, '18:30', 'beer-five-serving-mistakes'], [3, '13:00', 'reel-wine-guess-the-grape'],
  [4, '12:30', 0], [4, '18:30', 'wine-myth-or-fact'], [5, '13:00', 'reel-spirits-guess-the-spirit'], [6, '11:00', 'wine-black-grapes-cheat-sheet'],
  [7, '13:00', 'reel-wine-spot-the-fault'], [7, '19:00', 1], [8, '18:30', 'sake-myth-or-fact'], [9, '13:00', 'reel-wine-pov-blind-tasting'],
  [10, '12:30', 2], [10, '18:30', 'spirits-cognac-vs-armagnac'], [13, '11:00', 'reel-wine-place-or-grape'], [14, '18:30', 'wine-port-styles'],
  [15, '19:00', 3], [16, '13:00', 'reel-wine-red-flags-tasting'], [20, '11:00', 'wine-which-level-is-right']];
const WD = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const langs = process.argv.slice(2).length ? process.argv.slice(2) : ui.LANGS;
for (const lang of langs) {
  const U = ui(lang);
  R.setLang(U);
  const B = BIO[lang];
  const site = `thewinegoat.com/${lang}/`;
  if (!fs.existsSync(path.join(R.ROOT, lang, 'index.html'))) throw new Error(`site path /${lang}/ missing`);
  const bio = [...B.lines, site].join('\n');
  const len = [...bio].length;
  if (len > 150) throw new Error(`${lang}: bio is ${len} characters (max 150)`);
  const data = require('./load')('batch-03', lang);
  const C = require(`./${lang}/captions-batch-03.js`);
  const shift = (t) => (B.late && t >= '18:00' ? `${String(Number(t.slice(0, 2)) + 1).padStart(2, '0')}${t.slice(2)}` : t);
  const rows = PLAN.map(([d, t, id]) => {
    if (typeof id === 'number') {
      const s = data.stories[id];
      return `| Day ${d} (${WD[(d - 1) % 7]}) | ${shift(t)} | Story · ${C.stories[id].text.replace(/\|/g, '/')} | ${R.badgeText(s)} | \`batch-03/stories/${s.id}.png\` + ${C.stories[id].sticker} |`;
    }
    const it = [...data.reels, ...data.posts].find((x) => x.id === id);
    const reel = data.reels.includes(it);
    return `| Day ${d} (${WD[(d - 1) % 7]}) | ${shift(t)} | ${reel ? 'Reel' : 'Carousel'} · ${C.items[id].name} | ${R.badgeText(it)}${it.levelNote ? ` · ${it.levelNote}` : ''} | \`batch-03/${reel ? `reels/${id}.mp4` : `posts/${id}/`}\` |`;
  });
  const md = `# ${U.handle} · The Wine Goat on Instagram (${C.langName})

Account for the ${C.langName}-speaking audience of The Wine Goat (thewinegoat.com). Content is translated from the verified
English account @the.winegoat: same facts, same images, local wine vocabulary. Never mention prices, never claim WSET
affiliation or call the questions official, never name schools.

## Profile

- **Suggested handle:** \`${U.handle}\`${lang === 'es-ar' ? ' (Argentina; the Spain/neutral account is `@thewinegoat.es`)' : lang === 'pt-br' ? ' (Brazil)' : ''}
- **Name field** (searchable): \`${B.name}\`
- **Website / link in bio:** https://${site}
- **Category:** Education
- **Bio** (${len} of 150 characters; one line each):

\`\`\`
${bio}
\`\`\`

- **Profile picture:** the round goat logo (\`img/logo-emblem.webp\`), same as the English account.

## Batch 03 (ready to post)

\`batch-03/\`: 7 carousels (\`posts/\`, 1080×1350, upload the slides in numeric order), 7 reels (\`reels/\`, MP4 1080×1920 with
a \`_cover.png\` to set as cover), 4 interactive stories (\`stories/\`, add the sticker in the app), \`captions.md\` (caption,
hashtags, alt text and photo credits for every post), \`contact-sheet.png\` (every slide and scene), \`preview.png\` (grid).

## Posting schedule (times in ${B.tz})

Start on a Monday once the account is set up; post the reels at lunch or in the evening, carousels in the early evening on
weekdays and late morning at weekends, stories at lunch or in the evening. After two weeks, check Insights → "Most active
times" and move the slots to your real peaks.

| Day | Time | What | Course · level | File |
|---|---|---|---|---|
${rows.join('\n')}

After the last post, **pin** the carousel "${C.items['wine-which-level-is-right'].name}" (the best first stop for a new visitor), then the
"${C.items['wine-black-grapes-cheat-sheet'].name}" cheat sheet.

**Engagement routine:** reply to every comment in the first hour, ideally with a question back; on quiz reels and carousels
wait a few hours before revealing the answer in your own comment; share each new reel and carousel to your story the same day
with a poll or "answer in the post" sticker.

Rebuild or edit: texts in \`tools/social/i18n/${lang}/\`, then \`tools/social/i18n/build-lang.sh ${lang}\` (see \`tools/social/i18n/README.md\`).
`;
  const out = path.join(R.ROOT, 'social', 'instagram', lang, 'README.md');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, md);
  console.log(`${lang}: README.md (bio ${len} chars)`);
}
