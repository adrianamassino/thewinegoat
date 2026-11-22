// Writes social/instagram/<lang>/<batch>/captions.md from tools/social/i18n/<lang>/captions-<batch>.js
// (caption, hashtags, alt text per post, story stickers) plus the photo credits from the photo library.
// Usage: NODE_PATH=$(npm root -g) node tools/social/i18n/captions.js <lang> [batch-03]
'use strict';
const fs = require('fs');
const path = require('path');
const R = require('../lib/render');

const [lang, batchName = 'batch-03'] = process.argv.slice(2);
const U = require('./ui')(lang);
R.setLang(U);
const data = require('./load')(batchName, lang);
const C = require(`./${lang}/captions-${batchName}.js`);
const OUT = path.join(R.ROOT, data.out);

const KEY = { 'grapevine-pergola-crete': 'pergola', 'rabelo-boat-port-barrels-douro': 'rabelo', '1076-brewing-beer-bottles-2018-g1': 'bottles',
  'three-corkscrews-old-and-modern': 'corkscrews', 'ripe-white-grapes-close-up-stuttgart': 'whiteGrapes', 'mosel-river-vineyards-neumagen-dhron': 'mosel',
  'coriander-seeds-close-up': 'coriander', 'citrus-fruit-slices-backlit': 'citrus' };
const credit = (photos) => {
  if (!photos || !photos.length) return '';
  const one = (p) => `${C.photoDesc[KEY[p.stem]]} · ${p.author.replace(/\s*\(Website\)/, '')}, ${/public domain/i.test(p.licence) ? C.pd : p.licence}`;
  return `${C.photoWord}: ${photos.map(one).join('; ')} (${C.via})`;
};
const voice = (() => { try { return JSON.parse(fs.readFileSync(path.join(__dirname, lang, `voice-${batchName}.json`), 'utf8')); } catch (e) { return null; } })();

const items = [...data.reels.map((r) => ({ ...r, kind: 'reel' })), ...data.posts.map((p) => ({ ...p, kind: 'post' }))];
const out = [];
out.push(`# ${U.handle} · Instagram ${batchName} (${C.langName})`, '');
out.push(`Files: \`posts/<post>/\` (carousels, 1080×1350, upload the slides in numeric order), \`reels/\` (MP4 1080×1920, 30 fps, H.264 + AAC, under 9.5 MB, with a \`_cover.png\` to set as the cover), \`stories/\` (4 single interactive frames, 1080×1920). \`contact-sheet.png\` = every slide, story and reel scene; \`preview.png\` = the profile grid of this batch.`);
out.push(`Translated from the verified English batch (\`social/instagram/${batchName}/\`): same facts, same images. Posting order and times: see \`../README.md\`.`);
out.push(`Rebuild: \`python3 tools/social/i18n/voice.py tts ${lang}\`, then \`NODE_PATH=$(npm root -g) node tools/social/build.js ${batchName} --lang=${lang}\`, then \`python3 tools/social/i18n/voice.py mix ${lang}\` and \`node tools/social/i18n/captions.js ${lang}\` (texts in \`tools/social/i18n/${lang}/\`).`);
out.push(`Reels: ${voice ? `voiceover in ${C.langName} (${voice.voice}, neural TTS) over original music (a different style per reel), ducked under the voice; loudness -16 LUFS.` : 'original music only (no voiceover for this language).'} Burned-in captions on screen.`, '', '---', '');

let n = 0;
for (const it of items) {
  const c = C.items[it.id];
  if (!c) throw new Error(`captions: missing ${it.id}`);
  n++;
  const files = it.kind === 'reel'
    ? `\`reels/${it.id}.mp4\` (${it.scenes[it.scenes.length - 1].end.toFixed(1)} s) + \`reels/${it.id}_cover.png\``
    : `\`posts/${it.id}/\` (${it.slides.length} slides)`;
  out.push(`## ${it.kind === 'reel' ? 'Reel' : 'Carousel'} · ${c.name}`, `Files: ${files}`, '', '**Caption**');
  out.push(R.badgeText(it).toUpperCase() + (it.levelNote ? ` · ${it.levelNote.toUpperCase()}` : ''));
  out.push(c.cap.trim(), '');
  out.push(U.cta);
  const cr = credit(it.photos);
  if (cr) out.push('', cr);
  out.push('', c.tags.trim(), '', '**Alt text**', c.alt.trim(), '', '---', '');
}
out.push('## Stories (4 single frames · 1080×1920)', '', '| # | File | Text on the frame | Sticker to add in the app | Alt text |', '|---|---|---|---|---|');
data.stories.forEach((s, i) => {
  const c = C.stories[i];
  out.push(`| ${i + 1} | \`stories/${s.id}.png\` | ${c.text} | ${c.sticker} | ${c.alt} |`);
});
out.push('', '---', '', '## Checks', 'No prices of The Wine Goat, no claim of WSET affiliation, questions never called official, no school named. Facts unchanged from the English batch. "Pass / Merit / Distinction" kept in English. Photo credits name exactly what each photo shows.', '');
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'captions.md'), out.join('\n'));
console.log(`captions.md: ${n} posts, ${data.stories.length} stories → ${path.relative(R.ROOT, OUT)}`);
