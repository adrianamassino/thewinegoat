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
 * - --safe draws the story/reel UI safe zones (top 250px, bottom 300px) for checking only.
 * To make a new batch: copy batches/batch-01.js, change id/out and the content, run the script.
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

const batch = require(`./batches/${batchName}.js`);
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
    for (const kind of ['q', 'a']) {
      const name = `${st.id}_${kind === 'q' ? '1-question' : '2-answer'}.png`;
      const html = batch.v2 ? R.storyFrame2(st, { kind, ...st[kind] }) : R.storyFrame({ kind, ...st[kind] });
      const page = await open(browser, safeOverlay(html), 1080, 1920);
      await check(page, name, { safeTop: 250, safeBottom: 300 });
      await page.screenshot({ path: path.join(dir, name), clip: { x: 0, y: 0, width: 1080, height: 1920 } });
      await page.close();
    }
    console.log('story', st.id);
  }
}

const keyTime = (s) => Math.min(s.end - 0.4, s.start + 0.9 + (s.lines || []).length * (s.lineGap || 0.55));

async function openReel(browser, reel) {
  for (const s of reel.scenes) if (s.goat && R.FORBIDDEN_GOATS.includes(s.goat.src)) throw new Error('logo goat used in reel ' + reel.id);
  if (batch.v2) for (const s of reel.scenes) if (s.goat && reel.course !== 'wine' && !R.NEUTRAL_GOATS.includes(s.goat.src)) throw new Error(`wine goat on ${reel.course} reel ${reel.id}`);
  const tpl = fs.readFileSync(path.join(__dirname, 'templates', batch.reelTemplate || 'reel.html'), 'utf8');
  const data = batch.v2 ? { ...reel, badge: R.badgeText(reel) } : reel;
  const html = safeOverlay(tpl.replace('<!--BASE-->', `<base href="file://${R.ROOT}/"><script>window.REEL=${JSON.stringify(data)};</script>`));
  const page = await open(browser, html, 1080, 1920);
  await page.evaluate(() => window.reelReady);
  return page;
}

async function buildReels(browser) {
  const dir = path.join(OUT, 'reels');
  mk(dir);
  for (const reel of batch.reels) {
    const page = await openReel(browser, reel);
    const fps = 30;
    const dur = reel.scenes[reel.scenes.length - 1].end;
    const frames = Math.round(dur * fps);
    const fdir = path.join(TMP, reel.id);
    mk(fdir);
    // cover
    await page.evaluate((t) => window.render(t), reel.cover.t);
    await check(page, `${reel.id} cover`, { safeTop: 250, safeBottom: 300 });
    await page.evaluate(() => { document.getElementById('prog').style.visibility = 'hidden'; document.getElementById('cap').style.visibility = 'hidden'; });
    await page.screenshot({ path: path.join(dir, `${reel.id}_cover.png`), clip: { x: 0, y: 0, width: 1080, height: 1920 } });
    await page.evaluate(() => { document.getElementById('prog').style.visibility = ''; document.getElementById('cap').style.visibility = ''; });
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
    execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', path.join(fdir, '%05d.jpg'),
      '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100',
      '-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'slow', '-r', String(fps),
      '-c:a', 'aac', '-b:a', '128k', '-shortest', '-movflags', '+faststart', mp4]);
    console.log('reel', reel.id, frames, 'frames', dur + 's');
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
  const st = fs.readdirSync(sdir).filter((f) => f.endsWith('.png')).sort();
  sec.push(`<h3>stories</h3><div class="r">${st.map((f) => `<figure><img class="t" src="${rel(path.join(sdir, f))}"><figcaption>${f.replace('.png', '').replace('story-', '')}</figcaption></figure>`).join('')}</div>`);
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
    sec.push(`<h3>${reel.id} (cover + scenes)</h3><div class="r"><figure><img class="t" src="${rel(cover)}"><figcaption>cover</figcaption></figure>${keys.map((k, i) => `<figure><img class="t" src="${rel(k)}"><figcaption>scene ${i + 1}</figcaption></figure>`).join('')}</div>`);
  }
  const html = `<!doctype html><html><head><meta charset="utf-8"><base href="file://${R.ROOT}/"><link rel="stylesheet" href="tools/social/templates/base.css">
<style>html,body{width:1900px;height:auto;overflow:visible;background:#efe7dc}body{padding:40px 50px;font-family:var(--sans)}
h1{font:800 54px/1 var(--serif);color:var(--burgundy);margin-bottom:6px}p.m{color:var(--muted);font:500 22px/1.3 var(--sans);margin-bottom:20px}
h3{font:800 24px/1 var(--sans);color:var(--plum);margin:26px 0 12px;letter-spacing:.04em}
.r{display:flex;gap:14px;flex-wrap:wrap}figure{display:flex;flex-direction:column;align-items:center}
img.f{width:240px;height:300px;border-radius:10px;box-shadow:0 4px 14px rgba(0,0,0,.18)}img.t{width:180px;height:320px;border-radius:10px;box-shadow:0 4px 14px rgba(0,0,0,.18)}
figcaption{font:600 16px/1 var(--sans);color:var(--muted);margin-top:6px}</style></head>
<body><h1>@the.winegoat · ${batch.id}</h1><p class="m">Contact sheet for review: carousels (1080×1350), stories (1080×1920), reels (cover + one frame per scene).</p>${sec.join('')}</body></html>`;
  const page = await open(browser, html, 1900, 1000);
  await page.screenshot({ path: path.join(OUT, batch.grid ? 'contact-sheet.png' : 'preview.png'), fullPage: true });
  await page.close();
  console.log(batch.grid ? 'contact-sheet.png' : 'preview.png');
  if (batch.grid) await buildGrid(browser);
}


// Profile-grid preview (batch.grid): this batch's feed posts newest first, then the previous batch's,
// cropped to the 4:5 grid tiles Instagram shows (reel covers are centre-cropped from 9:16).
async function buildGrid(browser) {
  const tile = (p) => {
    const f = p.reel ? path.join(R.ROOT, p.dir, 'reels', `${p.id}_cover.png`) : path.join(R.ROOT, p.dir, 'posts', p.id, `${p.id}_01.png`);
    return `<div class="t${p.old ? ' old' : ''}"><img src="file://${f}">${p.reel ? '<span class="rl">▶ Reel</span>' : '<span class="rl c">❐</span>'}${p.label ? `<span class="lb">${p.label}</span>` : ''}</div>`;
  };
  const dirRel = path.relative(R.ROOT, OUT);
  const mine = batch.feed.map((id) => {
    const reel = batch.reels.find((r) => r.id === id); const post = batch.posts.find((p) => p.id === id);
    const it = reel || post;
    return { id, reel: !!reel, dir: dirRel, label: `${R.badgeText(it)}` };
  }).reverse();
  const prev = batch.grid.prev.map((x) => ({ ...x, old: true })).reverse();
  const legend = batch.grid.legend.map((l) => `<span><i style="background:${l.c}"></i>${l.t}</span>`).join('');
  const html = `<!doctype html><html><head><meta charset="utf-8"><base href="file://${R.ROOT}/"><link rel="stylesheet" href="tools/social/templates/base.css">
<style>html,body{width:1000px;height:auto;overflow:visible;background:#fff}body{padding:34px 30px;font-family:var(--sans)}
h1{font:800 40px/1 var(--serif);color:#6e1532;margin-bottom:8px}p.m{color:#5c4a50;font:500 19px/1.35 var(--sans);margin-bottom:14px}
.lg{display:flex;flex-wrap:wrap;gap:10px 22px;margin:0 0 18px}.lg span{display:inline-flex;align-items:center;gap:8px;font:700 18px/1 var(--sans);color:#2a1b20}.lg i{width:22px;height:22px;border-radius:6px;display:inline-block}
.g{display:grid;grid-template-columns:repeat(3,1fr);gap:4px}.t{position:relative;aspect-ratio:4/5;overflow:hidden;background:#eee}.t img{width:100%;height:100%;object-fit:cover;object-position:center}
.t .rl{position:absolute;right:10px;top:10px;background:rgba(0,0,0,.55);color:#fff;font:700 15px/1 var(--sans);padding:6px 9px;border-radius:8px}.t .rl.c{font-size:18px;padding:4px 8px}
.t .lb{position:absolute;left:8px;bottom:8px;background:rgba(255,255,255,.92);color:#2a1b20;font:800 13px/1 var(--sans);letter-spacing:.06em;text-transform:uppercase;padding:6px 8px;border-radius:6px}
.sep{grid-column:1/-1;font:800 16px/1 var(--sans);letter-spacing:.12em;text-transform:uppercase;color:#5c4a50;padding:14px 4px 8px}</style></head>
<body><h1>@the.winegoat · profile grid preview</h1><p class="m">${batch.grid.note}</p><div class="lg">${legend}</div>
<div class="g">${mine.map(tile).join('')}${prev.map(tile).join('')}</div></body></html>`;
  const page = await open(browser, html, 1000, 1000);
  await page.screenshot({ path: path.join(OUT, 'preview.png'), fullPage: true });
  await page.close();
  console.log('preview.png (grid)');
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
  if (warnings.length) {
    console.log(`\n${warnings.length} layout warning(s):`);
    warnings.forEach((w) => console.log(' - ' + w));
  } else console.log('\nNo layout warnings.');
})().catch((e) => { console.error(e); process.exit(1); });
