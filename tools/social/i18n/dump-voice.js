// Prints the reels of a localised batch as JSON (id, duration, scenes with start/end and the voiceover text)
// for voice.py. Usage: node tools/social/i18n/dump-voice.js <lang> [batch-03]
'use strict';
const R = require('../lib/render');
const [lang, batch = 'batch-03'] = process.argv.slice(2);
R.setLang(require('./ui')(lang));
const data = require('./load')(batch, lang);
process.stdout.write(JSON.stringify({ lang, out: data.out, reels: data.reels.map((r) => ({ id: r.id,
  dur: r.scenes[r.scenes.length - 1].end, scenes: r.scenes.map((s) => ({ start: s.start, end: s.end, text: s.voiceText })) })) }, null, 1));
