#!/usr/bin/env node
/*
 * The Wine Goat — Instagram batch builder.
 *
 * Usage (from the repo root):
 *   NODE_PATH=$(npm root -g) node tools/social/build.js [batch-01] [--only=posts,stories,reels,preview] [--safe]
 *
 * - Content for each batch lives in tools/social/batches/<batch>.js (posts, stories, reels).
 * - Layouts/HTML live in tools/social/lib/render.js, styles in tools/social/templates/base.css,
 *   reel animation in tools/social/templates/reel.html.
 * - Output goes to the batch's `out` folder (e.g. social/instagram/batch-01/).
 * - Needs Playwright (Chromium) and ffmpeg (/usr/local/bin/ffmpeg or on PATH).
 * - --reels=id1,id2 rebuilds only those reels.
 * - --lang=it (it, fr, de, ru, pl, es, es-ar, pt-br, nl) builds the localised batch: UI strings and fonts from
 *   tools/social/i18n/ui.js, content from tools/social/i18n/<batch>.js + i18n/<lang>/<batch>.js, output in
 *   social/instagram/<lang>/<batch>/ (voiceover: tools/social/i18n/voice.py, see tools/social/i18n/README.md).
 * - --safe draws the story/reel UI safe zones (top 250px, bottom 300px) for checking only.
 * To make a new batch: copy batches/batch-01.js, change id/out and the content, run the script.
 *
 * Voiceover reels (batch.voiceover, batch 04+): every scene has a `vo` script (one or more short sentences). Each
 * sentence is spoken by Kokoro TTS (lib/voice.py; voice per reel = reel.voice || batch.voice || $TWG_VOICE ||
 * 'bf_emma'), scene length = max(lead + voice + pad, scene.min), captions show each sentence while it is spoken, and
 * timings inside a scene can follow the voice: at: 's2' = when sentence 2 starts, 'e1' = when sentence 1 ends,
 * 'v' = after the last sentence (lines, pop, art/goat, timer). Music = reel.music, a style from lib/music.py
 * (python3 tools/social/lib/music.py --list); a batch with uniqueMusic refuses two reels with the same style.
 * The mix (voice -16 LUFS, music ducked 14 dB under it, final batch.loudness || -15 LUFS, -1.5 dBTP) and the
 * measured loudness go to <out>/voice-check.md.
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const R = require('./lib/render');

const args = process.argv.slice(2);
const batchName = args.find((a) => !a.startsWith('--')) || 'batch-01';
const onlyArg = (args.find((a) => a.startsWith('--only=')) || '').slice(7);
const only = onlyArg ? onlyArg.split(',') : ['posts', 'stories', 'reels', 'preview'];
const SAFE = args.includes('--safe');
const FFMPEG = fs.existsSync('/usr/local/bin/ffmpeg') ? '/usr/local/bin/ffmpeg' : 'ffmpeg';

const LANG = (args.find((a) => a.startsWith('--lang=')) || '').slice(7);
if (LANG) R.setLang(require('./i18n/ui.js')(LANG));
const batch = LANG ? require('./i18n/load.js')(batchName, LANG) : require(`./batches/${batchName}.js`);
const OUT = process.env.SOCIAL_OUT ? path.resolve(process.env.SOCIAL_OUT) : path.join(R.ROOT, batch.out);
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'twg-social-'));
const warnings = [];

const pad = (n, w = 2) => String(n).padStart(w, '0');
const mk = (d) => fs.mkdirSync(d, { recursive: true });

async function open(browser, html, w, h) {
  const file = path.join(TMP, `p${Math.random().toString(36).slice(2)}.html`);
  fs.writeFileSync(file, html);
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.goto('file://' + file, { waitUntil: 'load' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((im) => (im.complete ? im.decode().catch(() => {}) : new Promise((r) => { im.onload = im.onerror = r; }))));
  });
  return page;
}

// Layout checks: overflowing areas, text outside canvas / safe zones, missing images & fonts.
async function check(page, label, { safeTop = 0, safeBottom = 0 } = {}) {
  const res = await page.evaluate(({ safeTop, safeBottom }) => {
    const out = [];
    const cv = document.getElementById('cv') || document.body;
    const H = cv.clientHeight, W = cv.clientWidth;
    document.querySelectorAll('.area,.st-area').forEach((a) => {
      if (a.scrollHeight > a.clientHeight + 1) out.push(`content overflows its area by ${a.scrollHeight - a.clientHeight}px`);
    });
    document.querySelectorAll('img').forEach((im) => { if (!im.naturalWidth) out.push('image failed: ' + im.getAttribute('src')); });
    if (![...document.fonts].some((f) => f.family.includes('Fraunces') && f.status === 'loaded')) out.push('Fraunces not loaded');
    // text boxes
    const walker = document.createTreeWalker(cv, NodeFilter.SHOW_TEXT);
    const goats = [...document.querySelectorAll('.goat')].map((g) => g.getBoundingClientRect());
    let n;
    while ((n = walker.nextNode())) {
      if (!n.textContent.trim()) continue;
      const r = document.createRange(); r.selectNodeContents(n);
      for (const b of r.getClientRects()) {
        if (b.width < 1) continue;
        const t = n.textContent.trim().slice(0, 40);
        if (b.right > W - 40 || b.left < 40 || b.bottom > H - 40 || b.top < 40) out.push(`text near/over edge: "${t}"`);
        if (safeTop && (b.top < safeTop || b.bottom > H - safeBottom)) out.push(`text in UI safe zone: "${t}" (y ${Math.round(b.top)}–${Math.round(b.bottom)})`);
        for (const g of goats) {
          const ix = Math.min(b.right, g.right) - Math.max(b.left, g.left);
          const iy = Math.min(b.bottom, g.bottom) - Math.max(b.top, g.top);
          if (ix > 30 && iy > 20) out.push(`text box overlaps goat image box: "${t}" (check visually)`);
        }
      }
    }
    return [...new Set(out)];
  }, { safeTop, safeBottom });
  res.forEach((m) => warnings.push(`${label}: ${m}`));
}

const safeOverlay = (html) => (SAFE ? html.replace('</body>', '<div class="safe-top"></div><div class="safe-bot"></div></body>') : html);

async function buildPosts(browser) {
  for (const post of batch.posts) {
    const dir = path.join(OUT, 'posts', post.id);
    mk(dir);
    fs.readdirSync(dir).filter((f) => f.endsWith('.png')).forEach((f) => fs.unlinkSync(path.join(dir, f)));
    const total = post.slides.length;
    const [smin, smax] = batch.slideRange || [3, 6];
    if (total < smin || total > smax) warnings.push(`${post.id}: ${total} slides (brief: ${smin}–${smax})`);
    for (let i = 0; i < total; i++) {
      const html = batch.v2 ? R.feedSlide2(post, post.slides[i], i + 1, total) : R.feedSlide(post.slides[i], i + 1, total);
      const page = await open(browser, html, 1080, 1350);
      await check(page, `${post.id} #${i + 1}`);
      await page.screenshot({ path: path.join(dir, `${post.id}_${pad(i + 1)}.png`), clip: { x: 0, y: 0, width: 1080, height: 1350 } });
      await page.close();
    }
    console.log('post', post.id, total, 'slides');
  }
}

async function buildStories(browser) {
  const dir = path.join(OUT, 'stories');
  mk(dir);
  for (const st of batch.stories) {
    // st.single: one interactive frame (poll / quiz / slider / question sticker added in the app), no answer frame
    for (const kind of st.single ? ['q'] : ['q', 'a']) {
      const name = st.single ? `${st.id}.png` : `${st.id}_${kind === 'q' ? '1-question' : '2-answer'}.png`;
      const html = batch.v2 ? R.storyFrame2(st, { kind, ...st[kind] }) : R.storyFrame({ kind, ...st[kind] });
      const page = await open(browser, safeOverlay(html), 1080, 1920);
      await check(page, name, { safeTop: 250, safeBottom: 300 });
      await page.screenshot({ path: path.join(dir, name), clip: { x: 0, y: 0, width: 1080, height: 1920 } });
      await page.close();
    }
    console.log('story', st.id);
  }
}


const DEFAULT_VOICE = process.env.TWG_VOICE || batch.voice || 'bf_emma';
const voiceOf = (reel) => reel.voice || DEFAULT_VOICE;
const splitSentences = (t) => String(t).replace(/\s+/g, ' ').trim().split(/(?<=[.!?…])\s+(?=[A-Z0-9“"‘'(])/).filter(Boolean);
const report = {}; // per reel: style, voice, duration, size, mix numbers

// Voiceover plan: synthesise every sentence (cached), then time the scenes to the voice.
function planVoice(reel) {
  if (reel._planned) return;
  const voice = voiceOf(reel);
  const jobs = [];
  reel.scenes.forEach((s, i) => splitSentences(s.vo || '').forEach((t, j) => jobs.push({ id: `${i}.${j}`, text: t, voice, speed: reel.speed || batch.speed || 1.08 })));
  const jf = path.join(TMP, `${reel.id}-jobs.json`), of = path.join(TMP, `${reel.id}-vo.json`);
  fs.writeFileSync(jf, JSON.stringify(jobs));
  execFileSync('python3', [path.join(__dirname, 'lib', 'voice.py'), 'synth', jf, of], { stdio: ['ignore', 'ignore', 'inherit'] });
  const vo = JSON.parse(fs.readFileSync(of, 'utf8'));
  let t = 0;
  reel.clips = [];
  reel.scenes.forEach((s, i) => {
    const sents = splitSentences(s.vo || '');
    if (!sents.length) throw new Error(`${reel.id} scene ${i}: no voiceover script (vo)`);
    const lead = s.lead ?? (i === 0 ? 0.1 : 0.22), gap = s.gap ?? 0.14;
    const marks = {}; let lt = lead;
    s.caps = [];
    sents.forEach((txt, j) => {
      const c = vo[`${i}.${j}`];
      marks[`s${j + 1}`] = lt; marks[`e${j + 1}`] = lt + c.dur;
      reel.clips.push({ wav: c.wav, t: t + lt, text: txt });
      s.caps.push([j === 0 ? 0 : lt - 0.05, txt]);
      lt += c.dur + (j < sents.length - 1 ? gap : 0);
    });
    marks.v = lt;
    const at = (x) => (typeof x === 'string' ? (x in marks ? marks[x] : (() => { const m = /^(s\d+|e\d+|v)([+-][\d.]+)$/.exec(x); if (!m || !(m[1] in marks)) throw new Error(`${reel.id} scene ${i}: bad time ${x}`); return marks[m[1]] + parseFloat(m[2]); })()) : x);
    (s.lines || []).forEach((l) => { if (typeof l === 'object' && l.at != null) l.at = at(l.at); });
    if (s.pop) s.pop.at = at(s.pop.at);
    if (s.art && s.art.at != null) s.art.at = at(s.art.at);
    if (s.goat && s.goat.at != null) s.goat.at = at(s.goat.at);
    let len = Math.max(lt + (s.pad ?? 0.35), s.min || 1.6);
    if (s.timer) { s.timer.at = at(s.timer.at ?? 'v'); len = Math.max(len, s.timer.at + (s.timer.n || 3) + 0.25); }
    if (s.hold) len += s.hold;
    s.start = +t.toFixed(3); s.end = +(t + len).toFixed(3);
    s.caption = '';
    t += len;
  });
  reel._planned = true;
}

const keyTime = (s) => batch.voiceover ? Math.max(s.start + 0.5, s.end - 0.35) : Math.min(s.end - 0.4, s.start + 0.9 + (s.lines || []).length * (s.lineGap || 0.55));

async function openReel(browser, reel) {
  if (batch.voiceover) planVoice(reel);
  for (const s of reel.scenes) if (s.goat && R.FORBIDDEN_GOATS.includes(s.goat.src)) throw new Error('logo goat used in reel ' + reel.id);
  if (batch.v2) for (const s of reel.scenes) if (s.goat && reel.course !== 'wine' && !R.NEUTRAL_GOATS.includes(s.goat.src)) throw new Error(`wine goat on ${reel.course} reel ${reel.id}`);
  const tpl = fs.readFileSync(path.join(__dirname, 'templates', batch.reelTemplate || 'reel.html'), 'utf8');
  const { clips, ...rest } = reel;
  const data = batch.v2 ? { ...rest, badge: R.badgeText(reel), bgc: R.bgClass(reel) } : rest;
  const html = safeOverlay(tpl.replace('<html lang="en">', `<html lang="${R.UI.lang}">`).replace('<!--BASE-->', `<base href="file://${R.ROOT}/">${R.UI.head}<script>window.REEL=${JSON.stringify(data)};</script>`));
  const page = await open(browser, html, 1080, 1920);
  await page.evaluate(() => window.reelReady);
  return page;
}

// Original music (tools/social/lib/music.py, synthesised in code: no third-party audio), one mood per course,
// soft accents on scene changes; mastered to -16 LUFS integrated, -1.5 dBTP, with fade-in/out, exact reel length.
function makeMusic(reel, dur, dir) {
  const mood = reel.music || { wine: 'wine', beer: 'beer', sake: 'sake', spirits: 'spirits' }[reel.course];
  const raw = path.join(dir, 'music-raw.wav');
  const out = path.join(dir, 'music.wav');
  execFileSync('python3', [path.join(__dirname, 'lib', 'music.py'), mood, String(dur + 0.5), raw, reel.scenes.map((x) => x.start).join(',')]);
  const fo = reel.fadeOut || 1.4; // short fade for loop-friendly reels
  const pre = `afade=t=in:st=0:d=${reel.fadeIn || 0.6},afade=t=out:st=${(dur - fo).toFixed(2)}:d=${fo}`;
  // ffmpeg prints the loudnorm JSON on stderr
  const err = require('child_process').spawnSync(FFMPEG, ['-hide_banner', '-i', raw, '-t', String(dur), '-af', `${pre},loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json`, '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
  const j = JSON.parse(err.slice(err.lastIndexOf('{'), err.lastIndexOf('}') + 1));
  const ln = `loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=${j.input_i}:measured_TP=${j.input_tp}:measured_LRA=${j.input_lra}:measured_thresh=${j.input_thresh}:offset=${j.target_offset}:linear=true`;
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-i', raw, '-t', String(dur), '-af', `${pre},${ln},aresample=44100`, '-ar', '44100', '-ac', '2', out]);
  return out;
}


// Voiceover reels: music in the reel's style (lib/music.py), voice clips placed on the timeline, ducked mix (lib/voice.py).
function makeVoiceMix(reel, dur, dir) {
  const style = reel.music;
  const raw = path.join(dir, 'music-raw.wav');
  execFileSync('python3', [path.join(__dirname, 'lib', 'music.py'), style, String(dur + 0.5), raw]);
  const cfg = path.join(dir, 'mix.json'), out = path.join(dir, 'mix.wav');
  fs.writeFileSync(cfg, JSON.stringify({ dur, music: raw, clips: reel.clips, out, voice_lufs: -16, duck_db: 14, bed_lufs: -22,
    target_lufs: batch.loudness || -15, tp: -1.5, fade_out: reel.fadeOut || 0.6 }));
  const rep = JSON.parse(execFileSync('python3', [path.join(__dirname, 'lib', 'voice.py'), 'mix', cfg], { encoding: 'utf8' }).trim().split('\n').pop());
  return { wav: out, rep };
}

// Measure the final MP4 audio with ffmpeg (EBU R128 integrated, true peak, LRA) and look for silent gaps.
function measure(mp4) {
  const e = require('child_process').spawnSync(FFMPEG, ['-hide_banner', '-nostats', '-i', mp4, '-af', 'ebur128=peak=true,silencedetect=n=-45dB:d=0.3', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
  const sum = e.slice(e.lastIndexOf('Summary:'));
  const num = (re) => { const m = re.exec(sum); return m ? parseFloat(m[1]) : null; };
  return { I: num(/I:\s+(-?[\d.]+) LUFS/), LRA: num(/LRA:\s+(-?[\d.]+) LU/), TP: num(/Peak:\s+(-?[\d.]+) dBFS/), silences: (e.match(/silence_start/g) || []).length };
}

async function buildReels(browser) {
  const dir = path.join(OUT, 'reels');
  mk(dir);
  const pick = (args.find((a) => a.startsWith('--reels=')) || '').slice(8).split(',').filter(Boolean);
  if (batch.uniqueMusic) {
    const styles = execFileSync('python3', [path.join(__dirname, 'lib', 'music.py'), '--list'], { encoding: 'utf8' }).trim().split('\n').map((l) => l.split('\t')[0]);
    const seen = {};
    for (const r of batch.reels) {
      if (!styles.includes(r.music)) throw new Error(`${r.id}: music style "${r.music}" not in the library (${styles.join(', ')})`);
      if (seen[r.music]) throw new Error(`music style "${r.music}" used twice: ${seen[r.music]} and ${r.id}`);
      seen[r.music] = r.id;
    }
  }
  if (batch.voiceover) batch.reels.forEach((r, i) => { if (i && voiceOf(r) === voiceOf(batch.reels[i - 1])) warnings.push(`${r.id}: same voice as the previous reel (${voiceOf(r)})`); });
  for (const reel of batch.reels.filter((r) => !pick.length || pick.includes(r.id))) {
    const page = await openReel(browser, reel);
    const fps = 30;
    const dur = reel.scenes[reel.scenes.length - 1].end;
    const frames = Math.round(dur * fps);
    const fdir = path.join(TMP, reel.id);
    fs.rmSync(fdir, { recursive: true, force: true });
    mk(fdir);
    // cover: a designed tile (reel.tile, shape kept inside the 4:5 grid crop) or a frame of the reel
    if (reel.tile) {
      const cp = await open(browser, R.coverTile(reel, reel.tile, { w: 1080, h: 1920, reel: true }), 1080, 1920);
      await check(cp, `${reel.id} cover`, { safeTop: 285, safeBottom: 285 });
      await cp.screenshot({ path: path.join(dir, `${reel.id}_cover.png`), clip: { x: 0, y: 0, width: 1080, height: 1920 } });
      await cp.close();
    } else {
      await page.evaluate((t) => window.render(t), reel.cover.t);
      await check(page, `${reel.id} cover`, { safeTop: 250, safeBottom: 300 });
      await page.evaluate(() => { document.getElementById('prog').style.visibility = 'hidden'; document.getElementById('cap').style.visibility = 'hidden'; });
      await page.screenshot({ path: path.join(dir, `${reel.id}_cover.png`), clip: { x: 0, y: 0, width: 1080, height: 1920 } });
      await page.evaluate(() => { document.getElementById('prog').style.visibility = ''; document.getElementById('cap').style.visibility = ''; });
    }
    if (args.includes('--covers-only')) { await page.close(); console.log('cover', reel.id); continue; }
    // check each scene at its fully-shown moment
    for (const s of reel.scenes) {
      await page.evaluate((t) => window.render(t), keyTime(s));
      await check(page, `${reel.id} scene "${s.title.replace(/<[^>]+>/g, '')}"`, { safeTop: 250, safeBottom: 300 });
    }
    for (let f = 0; f < frames; f++) {
      await page.evaluate((t) => window.render(t), f / fps);
      await page.screenshot({ path: path.join(fdir, `${pad(f, 5)}.jpg`), type: 'jpeg', quality: 94, clip: { x: 0, y: 0, width: 1080, height: 1920 } });
    }
    await page.close();
    const mp4 = path.join(dir, `${reel.id}.mp4`);
    let wav, mixRep = null;
    if (batch.voiceover) ({ wav, rep: mixRep } = makeVoiceMix(reel, dur, fdir)); else wav = makeMusic(reel, dur, fdir);
    if (batch.maxMB) {
      // size cap (browser upload): two-pass H.264 at the bitrate that fits maxMB with 128 kbps audio, max 6 Mbps
      const kbps = Math.min(6000, Math.floor((batch.maxMB * 8192 * 0.96) / dur - 128));
      const log = path.join(fdir, 'x264');
      const common = ['-framerate', String(fps), '-i', path.join(fdir, '%05d.jpg')];
      const v = ['-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-preset', batch.preset || 'slow', '-b:v', `${kbps}k`, '-maxrate', `${Math.round(kbps * 1.6)}k`, '-bufsize', `${kbps * 2}k`, '-r', String(fps), '-passlogfile', log];
      execFileSync(FFMPEG, ['-y', '-loglevel', 'error', ...common, ...v, '-pass', '1', '-an', '-t', String(dur), '-f', 'mp4', '/dev/null']);
      execFileSync(FFMPEG, ['-y', '-loglevel', 'error', ...common, '-i', wav, ...v, '-pass', '2',
        '-c:a', 'aac', '-b:a', '128k', '-ar', '44100', '-ac', '2', '-t', String(dur), '-movflags', '+faststart', mp4]);
      const mb = fs.statSync(mp4).size / 1048576;
      if (mb > batch.maxMB) warnings.push(`${reel.id}: ${mb.toFixed(1)} MB (cap ${batch.maxMB} MB)`);
      fs.rmSync(log + '-0.log', { force: true }); fs.rmSync(log + '-0.log.mbtree', { force: true });
    } else {
    execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', path.join(fdir, '%05d.jpg'), '-i', wav,
      '-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'slow', '-r', String(fps),
      '-c:a', 'aac', '-b:a', '192k', '-ar', '44100', '-ac', '2', '-t', String(dur), '-movflags', '+faststart', mp4]);
    }
    console.log('reel', reel.id, frames, 'frames', dur + 's', (fs.statSync(mp4).size / 1048576).toFixed(1) + ' MB');
    if (batch.voiceover) {
      const m = measure(mp4);
      report[reel.id] = { style: reel.music, voice: voiceOf(reel), dur: +dur.toFixed(1), mb: +(fs.statSync(mp4).size / 1048576).toFixed(2), mix: mixRep, final: m };
      if (m.I < -16.5 || m.I > -13.5) warnings.push(`${reel.id}: integrated loudness ${m.I} LUFS`);
      if (m.TP > -1.0) warnings.push(`${reel.id}: true peak ${m.TP} dBTP`);
      if (m.silences) warnings.push(`${reel.id}: ${m.silences} silent gap(s)`);
      if (mixRep.duck_db_measured != null && mixRep.duck_db_measured < 11) warnings.push(`${reel.id}: music only ${mixRep.duck_db_measured} dB under the voice`);
      console.log('   mix', JSON.stringify(mixRep), 'final', JSON.stringify(m));
    }
    fs.rmSync(fdir, { recursive: true, force: true }); // free disk: frames are big
  }
}

async function buildPreview(browser) {
  const rel = (p) => 'file://' + p;
  const sec = [];
  for (const post of batch.posts) {
    const dir = path.join(OUT, 'posts', post.id);
    const imgs = fs.readdirSync(dir).filter((f) => f.endsWith('.png')).sort();
    sec.push(`<h3>${post.id}</h3><div class="r">${imgs.map((f) => `<figure><img class="f" src="${rel(path.join(dir, f))}"><figcaption>${f.replace(/^.*_/, '').replace('.png', '')}</figcaption></figure>`).join('')}</div>`);
  }
  const sdir = path.join(OUT, 'stories');
  if ((batch.stories || []).length) mk(sdir);
  const st = !fs.existsSync(sdir) ? [] : fs.readdirSync(sdir).filter((f) => f.endsWith('.png')).sort();
  if (st.length) sec.push(`<h3>stories</h3><div class="r">${st.map((f) => `<figure><img class="t" src="${rel(path.join(sdir, f))}"><figcaption>${f.replace('.png', '').replace('story-', '')}</figcaption></figure>`).join('')}</div>`);
  for (const reel of batch.reels) {
    const cover = path.join(OUT, 'reels', `${reel.id}_cover.png`);
    const page = await openReel(browser, reel);
    const keys = [];
    for (const [k, s] of reel.scenes.entries()) {
      await page.evaluate((t) => window.render(t), keyTime(s));
      const p = path.join(TMP, `${reel.id}_k${k}.png`);
      await page.screenshot({ path: p, clip: { x: 0, y: 0, width: 1080, height: 1920 } });
      keys.push(p);
    }
    await page.close();
    const info = batch.voiceover ? ` · ${R.badgeText(reel)} · music: ${reel.music} · voice: ${voiceOf(reel)} · ${reel.scenes[reel.scenes.length - 1].end.toFixed(1)} s` : '';
    sec.push(`<h3>${reel.id} (cover + scenes)${info}</h3><div class="r"><figure><img class="t" src="${rel(cover)}"><figcaption>cover</figcaption></figure>${keys.map((k, i) => `<figure><img class="t" src="${rel(k)}"><figcaption>scene ${i + 1}</figcaption></figure>`).join('')}</div>`);
  }
  const html = `<!doctype html><html><head><meta charset="utf-8"><base href="file://${R.ROOT}/"><link rel="stylesheet" href="tools/social/templates/base.css">
<style>html,body{width:1900px;height:auto;overflow:visible;background:#efe7dc}body{padding:40px 50px;font-family:var(--sans)}
h1{font:800 54px/1 var(--serif);color:var(--burgundy);margin-bottom:6px}p.m{color:var(--muted);font:500 22px/1.3 var(--sans);margin-bottom:20px}
h3{font:800 24px/1 var(--sans);color:var(--plum);margin:26px 0 12px;letter-spacing:.04em}
.r{display:flex;gap:14px;flex-wrap:wrap}figure{display:flex;flex-direction:column;align-items:center}
img.f{width:240px;height:300px;border-radius:10px;box-shadow:0 4px 14px rgba(0,0,0,.18)}img.t{width:180px;height:320px;border-radius:10px;box-shadow:0 4px 14px rgba(0,0,0,.18)}
figcaption{font:600 16px/1 var(--sans);color:var(--muted);margin-top:6px}</style></head>
<body><h1>${R.UI.handle} · ${batch.id}${LANG ? ` · ${LANG}` : ''}</h1><p class="m">Contact sheet for review: carousels (1080×1350), stories (1080×1920), reels (cover + one frame per scene).</p>${sec.join('')}</body></html>`;
  const page = await open(browser, html, 1900, 1000);
  const sheet = batch.grid || batch.coverGrid ? 'contact-sheet.png' : 'preview.png';
  await page.screenshot({ path: path.join(OUT, sheet), fullPage: true });
  await page.close();
  console.log(sheet);
  if (batch.grid) await buildGrid(browser);
  if (batch.coverGrid) await buildCoverGrid(browser);
}

// Reel-only batches: preview.png = the reel covers side by side (full 9:16 cover, with the 4:5 profile-grid crop marked).
async function buildCoverGrid(browser) {
  const tiles = batch.reels.map((r) => {
    const f = path.join(OUT, 'reels', `${r.id}_cover.png`);
    const meta = batch.voiceover ? `${r.music} · ${voiceOf(r)} · ${r.scenes[r.scenes.length - 1].end.toFixed(0)} s` : '';
    return `<figure><div class="c"><img src="file://${f}"><i class="crop"></i></div><figcaption><b>${R.badgeText(r)}</b>${r.title || r.id}<small>${meta}</small></figcaption></figure>`;
  }).join('');
  const html = `<!doctype html><html><head><meta charset="utf-8"><base href="file://${R.ROOT}/"><link rel="stylesheet" href="tools/social/templates/base.css">
<style>html,body{width:1500px;height:auto;overflow:visible;background:#f6f0e8}body{padding:40px 44px;font-family:var(--sans)}
h1{font:800 46px/1 var(--serif);color:#6e1532;margin-bottom:8px}p.m{color:#5c4a50;font:500 20px/1.35 var(--sans);margin-bottom:22px}
.g{display:grid;grid-template-columns:repeat(${batch.coverCols || 3},1fr);gap:26px}figure{margin:0}
.c{position:relative;aspect-ratio:9/16;border-radius:14px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,.18)}.c img{width:100%;height:100%;display:block}
.c .crop{position:absolute;left:0;right:0;top:${((1920 - 1350) / 2 / 1920 * 100).toFixed(2)}%;height:${(1350 / 1920 * 100).toFixed(2)}%;border:3px dashed rgba(212,162,58,.9);border-left:0;border-right:0}
figcaption{margin-top:10px;font:600 19px/1.3 var(--sans);color:#2a1b20}figcaption b{display:block;font:800 14px/1 var(--sans);letter-spacing:.1em;text-transform:uppercase;color:#8c1d40;margin-bottom:5px}
figcaption small{display:block;color:#7a6a70;font:500 15px/1.3 var(--sans);margin-top:3px}</style></head>
<body><h1>@the.winegoat · ${batch.id} · reel covers</h1><p class="m">${batch.coverNote || 'Covers in posting order. The dashed band is the 4:5 crop shown on the profile grid.'}</p><div class="g">${tiles}</div></body></html>`;
  const page = await open(browser, html, 1500, 1000);
  await page.screenshot({ path: path.join(OUT, 'preview.png'), fullPage: true });
  await page.close();
  console.log('preview.png (covers)');
}


// Profile-grid preview (batch.grid): this batch's feed posts newest first, then the previous batch's,
// cropped to the 4:5 grid tiles Instagram shows (reel covers are centre-cropped from 9:16).
async function buildGrid(browser) {
  const tile = (p) => {
    const f = p.reel ? path.join(R.ROOT, p.dir, 'reels', `${p.id}_cover.png`) : path.join(R.ROOT, p.dir, 'posts', p.id, `${p.id}_01.png`);
    return `<div class="t${p.old ? ' old' : ''}"><img src="file://${f}">${p.pinned ? '<span class="rl pn">Pinned</span>' : p.reel ? '<span class="rl">▶ Reel</span>' : '<span class="rl c">❐</span>'}${p.label ? `<span class="lb">${p.label}</span>` : ''}</div>`;
  };
  const dirRel = path.relative(R.ROOT, OUT);
  const mine = batch.feed.map((id) => {
    if (typeof id === 'object') return { ...id };
    const reel = batch.reels.find((r) => r.id === id); const post = batch.posts.find((p) => p.id === id);
    const it = reel || post;
    return { id, reel: !!reel, dir: dirRel, label: `${R.badgeText(it)}`, pinned: !!it.pinned };
  }).reverse().sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  const prev = batch.grid.prev.map((x) => ({ ...x, old: true })).reverse();
  // a pinned post from an earlier batch stays first on the profile
  if (prev.some((x) => x.pinned)) { const all = [...mine, ...prev]; const pin = all.filter((x) => x.pinned); mine.length = 0; mine.push(...pin, ...all.filter((x) => !x.pinned)); prev.length = 0; }
  const legend = batch.grid.legend.map((l) => `<span><i style="background:${l.c}"></i>${l.t}</span>`).join('');
  const html = `<!doctype html><html><head><meta charset="utf-8"><base href="file://${R.ROOT}/"><link rel="stylesheet" href="tools/social/templates/base.css">
<style>html,body{width:1000px;height:auto;overflow:visible;background:#fff}body{padding:34px 30px;font-family:var(--sans)}
h1{font:800 40px/1 var(--serif);color:#6e1532;margin-bottom:8px}p.m{color:#5c4a50;font:500 19px/1.35 var(--sans);margin-bottom:14px}
.lg{display:flex;flex-wrap:wrap;gap:10px 22px;margin:0 0 18px}.lg span{display:inline-flex;align-items:center;gap:8px;font:700 18px/1 var(--sans);color:#2a1b20}.lg i{width:22px;height:22px;border-radius:6px;display:inline-block}
.g{display:grid;grid-template-columns:repeat(${batch.grid.cols || 3},1fr);gap:4px}.t{position:relative;aspect-ratio:4/5;overflow:hidden;background:#eee}.t img{width:100%;height:100%;object-fit:cover;object-position:center}
.t .rl{position:absolute;right:10px;top:10px;background:rgba(0,0,0,.55);color:#fff;font:700 15px/1 var(--sans);padding:6px 9px;border-radius:8px}.t .rl.c{font-size:18px;padding:4px 8px}.t .rl.pn{background:#d4a23a;color:#2a1b20}
.t .lb{position:absolute;left:8px;bottom:8px;background:rgba(255,255,255,.92);color:#2a1b20;font:800 11px/1 var(--sans);letter-spacing:.05em;text-transform:uppercase;padding:5px 6px;border-radius:6px}
.sep{grid-column:1/-1;font:800 16px/1 var(--sans);letter-spacing:.12em;text-transform:uppercase;color:#5c4a50;padding:14px 4px 8px}</style></head>
<body><h1>${R.UI.handle} · profile grid preview</h1><p class="m">${batch.grid.note}</p><div class="lg">${legend}</div>
<div class="g">${mine.map(tile).join('')}${prev.map(tile).join('')}</div></body></html>`;
  const page = await open(browser, html, 1000, 1000);
  await page.screenshot({ path: path.join(OUT, 'preview.png'), fullPage: true });
  await page.close();
  console.log('preview.png (grid)');
}

// voice-check.md: per reel music style, voice, duration, size and measured loudness (merged across partial rebuilds).
function writeVoiceCheck() {
  const store = path.join(os.tmpdir(), `twg-voice-check-${batch.id}.json`);
  let all = {};
  try { all = JSON.parse(fs.readFileSync(store, 'utf8')); } catch (e) { /* first run */ }
  Object.assign(all, report);
  fs.writeFileSync(store, JSON.stringify(all));
  const rows = batch.reels.filter((r) => all[r.id]).map((r, i) => {
    const x = all[r.id];
    return `| ${i + 1} | ${r.id} | ${R.badgeText(r)} | ${x.style} | ${x.voice} | ${x.dur} s | ${x.mb} MB | ${x.final.I} | ${x.final.TP} | ${x.final.LRA} | ${x.mix.voice_lufs} | ${x.mix.music_under_voice_lufs} (−${x.mix.duck_db_measured} dB) | ${x.mix.music_bed_lufs ?? '–'} | ${x.mix.short_term_min_lufs} | ${x.final.silences} |`;
  });
  const lib = execFileSync('python3', [path.join(__dirname, 'lib', 'music.py'), '--list'], { encoding: 'utf8' }).trim().split('\n').map((l) => l.split('\t'));
  const used = batch.reels.map((r) => r.music);
  const md = `# ${batch.id} · voice check

Measured on the final MP4s (AAC) with ffmpeg \`ebur128=peak=true\` and \`silencedetect=n=-45dB:d=0.3\`; voice and music levels from the mix stage (lib/voice.py, BS.1770 gating).
Targets: voice about −16 LUFS, music about 14 dB under the voice while it speaks, final −14 to −16 LUFS integrated, true peak ≤ −1.5 dBTP, no silent gaps.

| # | Reel | Course | Music style | Voice | Duration | Size | Final I (LUFS) | True peak (dBTP) | LRA (LU) | Voice (LUFS) | Music under voice (LUFS) | Music bed, no voice (LUFS) | Min short-term (LUFS) | Silent gaps |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
${rows.join('\n')}

Voices: bf_emma = British female (en-gb), af_heart = American female (en-us), bm_george = British male (en-gb). One voice per reel, rotated so neighbouring reels never share one.
Change a voice: set \`voice\` on the reel (or \`voice\` on the batch / \`TWG_VOICE\` for all) in tools/social/batches/${batch.id}.js and rebuild that reel with \`--reels=<id>\`.

Music library (tools/social/lib/music.py, original, synthesised in code). ✔ = used in this batch (each style at most once):
${lib.map(([k, d]) => `- ${used.includes(k) ? '✔' : '·'} **${k}**: ${d}`).join('\n')}
`;
  fs.writeFileSync(path.join(OUT, 'voice-check.md'), md);
  console.log('voice-check.md');
}

(async () => {
  mk(OUT);
  const browser = await chromium.launch();
  try {
    if (only.includes('posts')) await buildPosts(browser);
    if (only.includes('stories')) await buildStories(browser);
    if (only.includes('reels')) await buildReels(browser);
    if (only.includes('preview')) await buildPreview(browser);
  } finally {
    await browser.close();
  }
  fs.rmSync(TMP, { recursive: true, force: true });
  if (batch.voiceover && Object.keys(report).length) writeVoiceCheck();
  if (warnings.length) {
    console.log(`\n${warnings.length} layout warning(s):`);
    warnings.forEach((w) => console.log(' - ' + w));
  } else console.log('\nNo layout warnings.');
})().catch((e) => { console.error(e); process.exit(1); });
