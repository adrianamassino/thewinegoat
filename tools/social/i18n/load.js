// Loads a localised Instagram batch for build.js --lang=xx:
//   layout  tools/social/i18n/<batch>.js (function of the language table T)
//   strings tools/social/i18n/<lang>/<batch>.js (same shape as i18n/en/<batch>.js)
//   voice   tools/social/i18n/<lang>/voice-<batch>.json (optional, written by voice.py tts): spoken length of each reel
//           scene; scenes are lengthened so the voiceover fits (the animation is driven by scene start/end).
// Font sizes: where a translated heading is longer than the English one, its explicit size is scaled down
// (area ~ characters x size², so size x sqrt(en/len)); T.fit then sets exact sizes after visual checks:
//   fit: { 'post-id/2': { titleSize: 58 }, 'post-id/1/tile': { headSize: 80 }, 'reel-id/3': { titleSize: 90 }, 'reel-id/tile': {...}, 'story-id': {...} }
'use strict';
const fs = require('fs');
const path = require('path');
const ui = require('./ui');

const plain = (s) => String(s || '').replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, 'x').trim();
const EN_UI = { course: { wine: 'Wine', spirits: 'Spirits', sake: 'Sake', beer: 'Beer' }, myth: 'Myth' };

function scale(loc, en, sizeKey, textKey, linear) {
  if (!loc || !en || !loc[sizeKey] || loc[sizeKey] !== en[sizeKey]) return;
  const a = plain(loc[textKey]).length, b = plain(en[textKey]).length;
  if (!a || !b || a <= b * 1.06) return;
  const f = Math.max(linear ? 0.6 : 0.72, linear ? b / a : Math.sqrt(b / a));
  loc[sizeKey] = Math.round(loc[sizeKey] * f);
}
function autofit(item, en) {
  scale(item, en, 'titleSize', 'title');
  if (item.tile && en.tile) { scale(item.tile, en.tile, 'headSize', 'head'); scale(item.tile, en.tile, 'arcSize', 'arc', true); }
}

module.exports = function load(batchName, lang) {
  const build = require(`./${batchName}.js`);
  const T = require(`./${lang}/${batchName}.js`);
  const U = ui(lang);
  const data = build({ ...T, ui: U });
  const en = build({ ...require(`./en/${batchName}.js`), ui: EN_UI });
  data.lang = lang;
  data.out = `social/instagram/${lang}/${batchName}`;
  data.handle = U.handle;

  data.posts.forEach((p, i) => p.slides.forEach((s, j) => autofit(s, en.posts[i].slides[j])));
  data.reels.forEach((r, i) => { autofit(r, en.reels[i]); r.scenes.forEach((s, j) => autofit(s, en.reels[i].scenes[j])); });

  // exact overrides after visual checks
  const fit = T.fit || {};
  for (const [k, v] of Object.entries(fit)) {
    const [id, idx, sub] = k.split('/');
    const it = [...data.posts, ...data.reels, ...data.stories].find((x) => x.id === id);
    if (!it) throw new Error(`fit: unknown item ${id}`);
    let o = it;
    if (idx === 'tile') o = it.tile;
    else if (idx === 'q') o = it.q;
    else if (idx != null) o = (it.slides || it.scenes)[Number(idx)];
    if (sub) o = o[sub];
    if (!o) throw new Error(`fit: no target for ${k}`);
    Object.assign(o, v);
  }

  // voiceover text of each scene: the burned-in caption, or T.voice['reel-id/idx'] where symbols would be read badly
  for (const r of data.reels) r.scenes.forEach((s, j) => { s.voiceText = (T.voice || {})[`${r.id}/${j}`] || plain(s.caption); });

  // voiceover timing: stretch scenes so each spoken line fits (lead-in 0.25 s, 0.35 s tail)
  const vf = path.join(__dirname, lang, `voice-${batchName}.json`);
  if (fs.existsSync(vf) && !process.env.SOCIAL_NO_VOICE) {
    const V = JSON.parse(fs.readFileSync(vf, 'utf8'));
    for (const r of data.reels) {
      const v = V.reels && V.reels[r.id];
      if (!v) continue;
      let t = 0;
      r.scenes.forEach((s, j) => {
        const d0 = s.end - s.start;
        const d = Math.max(d0, Math.ceil(((v.durations[j] || 0) + 0.6) * 10) / 10);
        s.start = +t.toFixed(2); s.end = +(t + d).toFixed(2); t += d;
      });
      r.voice = { file: `voice-${batchName}.json`, starts: r.scenes.map((s) => s.start) };
    }
  }
  return data;
};
