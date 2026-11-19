// HTML builders for The Wine Goat Instagram templates.
// Every page is rendered with <base href> = repo root, so asset paths are repo-relative
// (img/goats/*.webp, fonts/...). Content lives in tools/social/batches/*.js.
'use strict';
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const CSS = 'tools/social/templates/base.css';
const LOGO = 'img/logo-emblem.webp';         // logo goat: ONLY as the small logo
const WM_DARK_BG = 'img/wordmark-light.webp'; // wordmark for plum backgrounds
const WM_LIGHT_BG = 'img/wordmark.webp';      // wordmark for cream backgrounds
const HANDLE = '@the.winegoat';

// The logo goat must never be used as an illustration.
const FORBIDDEN_GOATS = ['img/goats/hero.webp', 'img/logo-emblem.webp', 'img/logo.png', 'img/logo-full.webp'];

function page(inner, { w, h, extraHead = '' }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<base href="file://${ROOT}/">
<link rel="stylesheet" href="${CSS}">
<style>html,body{width:${w}px;height:${h}px;overflow:hidden}</style>${extraHead}
</head><body>${inner}</body></html>`;
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ---------------- content blocks (return HTML strings) ---------------- */
const B = {
  bullets: (items) => `<ul class="bul">${items.map((i) => `<li>${i}</li>`).join('')}</ul>`,
  compare: (cards) => `<div class="cmp">${cards.map(B.card).join('')}</div>`,
  card: (c) => `<div class="card">${c.tag ? `<span class="tag ${c.tone || 'wine'}">${c.tag}</span>` : ''}${c.title ? `<h3>${c.title}</h3>` : ''}<ul>${c.items.map((i) => `<li>${i}</li>`).join('')}</ul>${c.eg ? `<div class="eg">${c.eg}</div>` : ''}</div>`,
  note: (t) => `<div class="note">${t}</div>`,
  rows: (rows) => `<div class="rows">${rows.map((r) => `<div class="row"><div class="l"><b>${r.name}</b><span>${r.desc}</span></div><div class="v"><b>${r.c}</b><span>${r.f}</span></div></div>`).join('')}</div>`,
  ladder: (steps) => `<div class="ladder">${steps.map((s, i) => `<div class="step${s.hi ? ' hi' : ''}"><div class="n">${s.n || i + 1}</div><div><b>${s.title}</b>${s.text ? `<span>${s.text}</span>` : ''}</div></div>`).join('')}</div>`,
  mistakes: (ms) => `<div class="mist">${ms.map((m) => `<div class="mi"><div class="num">Mistake ${m.n}</div><div class="bad">${m.bad}</div><div class="fix">${m.fix}</div></div>`).join('')}</div>`,
  clues: (cl) => `<div class="clues">${cl.map((c) => `<span class="clue">${c}</span>`).join('')}</div>`,
  options: (opts, right) => `<div class="opts">${opts.map((o, i) => {
    const k = 'ABC'[i];
    const cls = right == null ? '' : (k === right ? ' right' : ' dim');
    return `<div class="opt${cls}"><span class="k">${k}</span><span>${o}</span></div>`;
  }).join('')}</div>`,
  // horizontal temperature chart: items {name, eg, from, to, color}
  therm: (items, { min = 5, max = 19, ticks = [6, 8, 10, 12, 14, 16, 18] } = {}) => {
    const pct = (v) => ((v - min) / (max - min)) * 100;
    const axis = ticks.map((t) => `<span style="left:${pct(t)}%">${t}°</span>`).join('');
    const rows = items.map((it) => {
      const l = pct(it.from), wd = Math.max(pct(it.to) - l, 6);
      const label = it.from === it.to ? `${it.from}°C` : `${it.from}–${it.to}°C`;
      return `<div class="tr"><div class="nm">${it.name}<small>${it.eg}</small></div><div class="track"><div class="bar" style="left:${l}%;width:${wd}%;background:${it.color}">${label}</div></div></div>`;
    }).join('');
    return `<div class="therm"><div class="axis">${axis}</div>${rows}</div>`;
  },
};

/* ---------------- feed slide (1080x1350) ---------------- */
function brand(dark) {
  return `<div class="brand"><img class="em" src="${LOGO}" alt=""><img class="wm" src="${dark ? WM_DARK_BG : WM_LIGHT_BG}" alt=""></div>`;
}

function goatTag(g) {
  if (!g) return '';
  if (FORBIDDEN_GOATS.includes(g.src)) throw new Error(`Logo goat used as illustration: ${g.src}`);
  const st = Object.entries(g.style || {}).map(([k, v]) => `${k}:${typeof v === 'number' ? v + 'px' : v}`).join(';');
  return `<img class="goat" src="${g.src}" style="${st}" alt="">`;
}

function feedSlide(s, idx, total) {
  const dark = s.theme === 'dark';
  const last = idx === total;
  const head = `${brand(dark)}<div class="count">${idx} / ${total}</div>`;
  const foot = `<div class="foot"><span>${HANDLE}</span>${last ? '<span>thewinegoat.com</span>' : '<span class="swipe">Swipe <i></i></span>'}</div>`;
  let body = '';
  if (s.layout === 'cover') {
    body = `<div class="area" style="justify-content:flex-start;padding-top:40px">
      ${s.kicker ? `<div class="kicker">${s.kicker}</div>` : ''}
      <h1 style="max-width:${s.titleWidth || 900}px;${s.titleSize ? `font-size:${s.titleSize}px` : ''}">${s.title}</h1>
      ${s.sub ? `<div class="sub" style="margin-top:34px;max-width:${s.subWidth || 600}px">${s.sub}</div>` : ''}
    </div>`;
  } else if (s.layout === 'cta') {
    body = `<div class="area" style="justify-content:flex-start;padding-top:40px">
      ${s.kicker ? `<div class="kicker">${s.kicker}</div>` : ''}
      <h2 style="font-size:${s.titleSize || 84}px;max-width:${s.titleWidth || 900}px">${s.title}</h2>
      ${s.sub ? `<div class="sub" style="max-width:${s.subWidth || 560}px">${s.sub}</div>` : ''}
      ${s.html || ''}
      <div><span class="cta-line">${s.cta || 'Practise free on thewinegoat.com'}</span></div>
    </div>`;
  } else {
    body = `<div class="area">
      ${s.kicker ? `<div class="kicker">${s.kicker}</div>` : ''}
      ${s.title ? `<h2 style="${s.titleSize ? `font-size:${s.titleSize}px;` : ''}${s.titleWidth ? `max-width:${s.titleWidth}px` : ''}">${s.title}</h2>` : ''}
      ${s.sub ? `<div class="sub" style="${s.subWidth ? `max-width:${s.subWidth}px` : ''}">${s.sub}</div>` : ''}
      ${s.html || ''}
    </div>`;
  }
  const inner = `<div class="cv feed ${dark ? 'dark' : 'light'}" id="cv">${head}${goatTag(s.goat)}${body}${foot}</div>`;
  return page(inner, { w: 1080, h: 1350 });
}

/* ---------------- story frame (1080x1920) ---------------- */
// Safe zone: nothing but background/illustration in the top 250px and bottom 300px.
function storyFrame(s) {
  let inner;
  if (s.kind === 'q') {
    inner = `<div class="st-area">
      <div class="kicker">${s.kicker || 'A or B?'}</div>
      <div class="st-q">${s.question}</div>
      ${B.options(s.options)}
      <div class="sticker-space" data-role="sticker"></div>
      <div class="st-hint">${s.hint || 'Vote, then tap for the answer'}</div>
    </div>`;
  } else {
    inner = `<div class="st-area">
      <div class="kicker">${s.kicker || 'The answer'}</div>
      <div class="st-big">${s.answer}</div>
      <div class="st-exp">${s.explain}</div>
      <div class="grow"></div>
      ${s.foot ? `<div class="st-hint">${s.foot}</div>` : ''}
    </div>`;
  }
  const cv = `<div class="cv tall dark" id="cv">${brand(true)}${goatTag(s.goat)}${inner}</div>`;
  return page(cv, { w: 1080, h: 1920 });
}

module.exports = { ROOT, page, esc, B, feedSlide, storyFrame, FORBIDDEN_GOATS, LOGO, WM_DARK_BG, WM_LIGHT_BG, HANDLE };
