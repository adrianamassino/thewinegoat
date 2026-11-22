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
// UI strings of the templates (English defaults). Localised builds (build.js --lang=xx) call setLang() with the
// table from tools/social/i18n/ui.js; `head` is extra <head> markup (fonts with full Latin-ext/Cyrillic coverage).
const UI = { lang: 'en', handle: HANDLE, head: '', swipe: 'Swipe', cta: 'Practise free on thewinegoat.com', mistake: 'Mistake',
  myth: 'Myth', fact: 'Fact', weak: 'Weak answer', strong: 'Strong answer', photo: 'Photo', aOrB: 'A or B?',
  vote: 'Vote, then tap for the answer', answer: 'The answer', watch: 'Watch', level: 'Level',
  course: { wine: 'Wine', spirits: 'Spirits', sake: 'Sake', beer: 'Beer' } };
function setLang(t) { Object.assign(UI, t); }

// The logo goat must never be used as an illustration.
const FORBIDDEN_GOATS = ['img/goats/hero.webp', 'img/logo-emblem.webp', 'img/logo.png', 'img/logo-full.webp'];

function page(inner, { w, h, extraHead = '' }) {
  return `<!doctype html><html lang="${UI.lang}"><head><meta charset="utf-8">
<base href="file://${ROOT}/">
<link rel="stylesheet" href="${CSS}">${UI.head}
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
  ladder: (steps) => `<div class="ladder">${steps.map((s, i) => `<div class="step${s.hi ? ' hi' : ''}"><div class="n"${String(s.n || '').length > 2 ? ' style="font-size:25px"' : ''}>${s.n || i + 1}</div><div><b>${s.title}</b>${s.text ? `<span>${s.text}</span>` : ''}</div></div>`).join('')}</div>`,
  mistakes: (ms) => `<div class="mist">${ms.map((m) => `<div class="mi"><div class="num">${UI.mistake} ${m.n}</div><div class="bad">${m.bad}</div><div class="fix">${m.fix}</div></div>`).join('')}</div>`,
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
      // single values get a pill centred on the value, wide enough for its label
      let l = pct(it.from), wd = pct(it.to) - l;
      if (wd < 18) { const c = l + wd / 2; wd = 18; l = Math.min(100 - wd, Math.max(0, c - wd / 2)); }
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
  const foot = `<div class="foot"><span>${UI.handle}</span>${last ? '<span>thewinegoat.com</span>' : `<span class="swipe">${UI.swipe} <i></i></span>`}</div>`;
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
      <div><span class="cta-line">${s.cta || UI.cta}</span></div>
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
      <div class="kicker">${s.kicker || UI.aOrB}</div>
      <div class="st-q">${s.question}</div>
      ${B.options(s.options)}
      <div class="st-hint" style="margin-top:34px">${s.hint || UI.vote}</div>
      <div class="sticker-space" data-role="sticker"></div>
    </div>`;
  } else {
    inner = `<div class="st-area">
      <div class="kicker">${s.kicker || UI.answer}</div>
      <div class="st-big">${s.answer}</div>
      <div class="st-exp">${s.explain}</div>
      ${s.foot ? `<div class="st-hint" style="margin-top:40px">${s.foot}</div>` : ''}
    </div>`;
  }
  const cv = `<div class="cv tall dark" id="cv">${brand(true)}${goatTag(s.goat)}${inner}</div>`;
  return page(cv, { w: 1080, h: 1920 });
}


/* =====================================================================================
   v2 (batch 02+): cream/white site look, layout templates, course badge + accent line.
   post = { id, course: 'wine'|'spirits'|'sake'|'beer', level, levelNote, tpl, slides }
   ===================================================================================== */
const COURSE_NAME = { wine: 'Wine', spirits: 'Spirits', sake: 'Sake', beer: 'Beer' };
const MAX_LEVEL = { wine: 4, spirits: 3, sake: 3, beer: 2 };
function badgeText(post) {
  if (post.badge) return post.badge;
  if (!COURSE_NAME[post.course]) throw new Error(`${post.id}: unknown course ${post.course}`);
  if (!(post.level >= 1 && post.level <= MAX_LEVEL[post.course])) throw new Error(`${post.id}: level ${post.level} not valid for ${post.course}`);
  return UI.badge ? UI.badge(post.course, post.level) : `${UI.course[post.course]} · ${UI.level} ${post.level}`;
}
const badge = (post, lg) => `<div class="${lg ? 'badge-lg' : 'badge'}">${badgeText(post)}${post.levelNote ? ` <small>${post.levelNote}</small>` : ''}</div>`;
// Wine imagery is forbidden on Spirits, Sake and Beer posts: only neutral goats there.
const NEUTRAL_GOATS = ['img/goats/goat-traveller-with-wine-map-and-suitcase.webp'];
function goatTag2(post, g) {
  if (!g) return '';
  if (post.course !== 'wine' && !NEUTRAL_GOATS.includes(g.src)) throw new Error(`${post.id}: wine goat ${g.src} on a ${post.course} post`);
  return goatTag(g);
}
const art = (a) => (a ? `<div class="art" style="position:absolute;z-index:1;${Object.entries(a.style || {}).map(([k, v]) => `${k}:${typeof v === 'number' ? v + 'px' : v}`).join(';')}">${a.svg}</div>` : '');

const B2 = {
  edIndex: (items) => `<div class="ed-index">${items.map((t, i) => `<span><b>${String(i + 1).padStart(2, '0')}</b>${t}</span>`).join('')}</div>`,
  edNum: (n) => `<div class="ed-num gt">${n}</div><div class="ed-rule"></div>`,
  edP: (t) => `<div class="ed-p">${t}</div>`,
  edFacts: (fs) => `<div class="ed-facts">${fs.map((f) => `<div class="ed-fact"><b>${f.v}</b><span>${f.t}</span></div>`).join('')}</div>`,
  mapbox: (svg) => `<div class="mapbox">${svg}</div>`,
  legend: (items) => `<div class="legend">${items.map((l) => `<span><i style="background:${l.c}"></i>${l.t}</span>`).join('')}</div>`,
  pair: (cards) => `<div class="pair">${cards.map((c) => `<div class="pc"><h3>${c.title}</h3><div class="where">${c.where}</div><dl>${c.rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl></div>`).join('')}</div>`,
  mf: (m) => `<div class="mf"><div class="m"><span class="lab">${UI.myth}</span><div class="t">${m.myth}</div></div><div class="f"><span class="lab">${UI.fact}</span><div class="t">${m.fact}</div>${m.why ? `<div class="w">${m.why}</div>` : ''}</div></div>`,
  scale: (items) => `<div class="scale">${items.map((i) => `<div><b>${i.v}</b><span>${i.t}</span></div>`).join('')}</div>`,
  vs2: (a, b, rows) => `<div class="vs2"><div class="hd">${a}</div><div class="hd b">${b}</div>${rows.map(([k, x, y]) => `<div class="cell"><small>${k}</small>${x}</div><div class="cell"><small>${k}</small>${y}</div>`).join('')}</div>`,
  tq: (t) => `<div class="tq">${t}</div><div class="tbar"></div>`,
  tbig: (n, h, p) => `<div class="tbig"><div class="n gt">${n}</div><div><h3>${h}</h3><p>${p}</p></div></div>`,
  ex: (label, t) => `<div class="ex"><b>${label}</b>${t}</div>`,
  wa: (weak, strong) => `<div class="wa"><div class="w weak"><h4>${UI.weak}</h4><p>${weak}</p></div><div class="w strong"><h4>${UI.strong}</h4><p>${strong}</p></div></div>`,
  flow: (nodes) => `<div class="flow">${nodes.map((n, i) => `<div class="nd${n.hi ? ' hi' : ''}${n.opt ? ' optn' : ''}"><div class="dot">${n.n || i + 1}</div><div><b>${n.title}</b>${n.text ? `<span>${n.text}</span>` : ''}</div></div>`).join('')}</div>`,
  par: (a, mid, b) => `<div class="par"><div class="box"><b>${a.b}</b><span>${a.t}</span></div><div class="mid">${mid}</div><div class="box"><b>${b.b}</b><span>${b.t}</span></div></div>`,
  card: (c) => `<div class="card2"><div class="band">${c.small ? `<small>${c.small}</small>` : ''}<b>${c.title}</b>${c.sub ? `<i>${c.sub}</i>` : ''}</div><dl class="rowsx">${c.rows.map(([k, v]) => `<div class="rx"><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></div>`,
  minis: (cards) => `<div class="two">${cards.map((c) => `<div class="mini"><div class="band">${c.small ? `<small>${c.small}</small>` : ''}<b>${c.title}</b></div><ul>${c.items.map((i) => `<li>${i}</li>`).join('')}</ul></div>`).join('')}</div>`,
  // photo panel inside the content flow. p = { src, h, pos, cap, credit }
  photo: (p) => `<figure class="phx" style="height:${p.h || 380}px"><img src="${p.src}" alt="" style="object-position:${p.pos || 'center'}">${p.cap ? `<figcaption>${p.cap}</figcaption>` : ''}${p.credit ? `<span class="phcr">${UI.photo}: ${p.credit}</span>` : ''}</figure>`,
  chip: (color) => `<span class="chip" style="background:${color}"></span>`,
};

// Background family: 'cream' (site look), 'burgundy' (deep burgundy, light text) or 'course'
// (themed per course: wine deep green, spirits whisky brown, sake indigo, beer amber; light text).
const BGS = ['cream', 'burgundy', 'course'];
function bgClass(item) {
  const b = item.bg || 'cream';
  if (!BGS.includes(b)) throw new Error(`${item.id}: unknown bg ${b}`);
  return b === 'course' ? item.course : b;
}

function feedSlide2(post, s, idx, total) {
  if (s.tile) return coverTile(post, s.tile, { idx, total });
  if (s.edit) return editorial(post, s.edit, { idx, total });
  const last = idx === total;
  const isCover = s.layout === 'cover';
  const photo = s.photo && (isCover || s.photoMode === 'top');
  const ptop = photo && s.photoMode === 'top';
  const bgc = bgClass(post);
  const dk = bgc !== 'cream';
  const head = `<div class="accent"></div>${brand(dk)}${isCover ? '' : badge(post)}`;
  const foot = `<div class="foot"><span>${UI.handle}</span><span class="rt"><span class="cnt">${idx} / ${total}</span>${last ? '<span>thewinegoat.com</span>' : `<span class="swipe">${UI.swipe} <i></i></span>`}</span></div>`;
  const tw = s.titleWidth ? `max-width:${s.titleWidth}px;` : '';
  const ts = s.titleSize ? `font-size:${s.titleSize}px;` : '';
  let body;
  if (isCover) {
    body = `<div class="area cover" style="${photo ? `justify-content:flex-end;padding-bottom:${s.padBottom ?? 10}px` : 'justify-content:flex-start;padding-top:30px'}">
      ${badge(post, true)}
      ${s.kicker ? `<div class="kicker"${photo && (!ptop || dk) ? ' style="color:#f3d58c"' : ''}>${s.kicker}</div>` : ''}
      ${s.cardOpen || ''}<h1 style="${tw}${ts}">${s.title}</h1>
      ${s.sub ? `<div class="sub" style="margin-top:28px;max-width:${s.subWidth || 640}px">${s.sub}</div>` : ''}${s.cardClose || ''}
      ${photo && s.photoCaption ? `<div class="phcap">${s.photoCaption}</div>` : ''}
      ${s.html || ''}
    </div>`;
  } else if (s.layout === 'cta') {
    body = `<div class="area" style="justify-content:${ptop ? 'flex-end;padding-bottom:10px' : 'flex-start;padding-top:30px'}">
      ${s.kicker ? `<div class="kicker">${s.kicker}</div>` : ''}
      <h2 style="font-size:${s.titleSize || 82}px;max-width:${s.titleWidth || 900}px">${s.title}</h2>
      ${s.sub ? `<div class="sub" style="max-width:${s.subWidth || 600}px">${s.sub}</div>` : ''}
      ${s.html || ''}
      <div><span class="cta-line">${s.cta || UI.cta}</span></div>
    </div>`;
  } else {
    body = `<div class="area" style="${ptop ? `top:${(s.photoH || 640) - 40}px;` : ''}${s.center ? 'justify-content:center;padding-bottom:40px;' : ''}">
      ${s.kicker ? `<div class="kicker">${s.kicker}</div>` : ''}
      ${s.title ? `<h2 style="${ts}${tw}">${s.title}</h2>` : ''}
      ${s.sub ? `<div class="sub" style="${s.subWidth ? `max-width:${s.subWidth}px` : ''}">${s.sub}</div>` : ''}
      ${s.html || ''}
    </div>`;
  }
  const credit = photo && s.photoCredit ? `<div class="phcredit"${ptop ? ` style="top:${Math.round((s.photoH || 640) * 0.45)}px"` : ''}>${UI.photo}: ${s.photoCredit}</div>` : '';
  const bg = photo ? `<div class="ph${ptop ? ' top' : ''}"${ptop ? ` style="height:${s.photoH || 640}px"` : ''}><img src="${s.photo}" alt="" style="object-position:${s.photoPos || 'center'}"></div>${credit}` : '';
  const cls = `cv feed v2 tpl-${s.tpl || post.tpl} c-${post.course} bg-${bgc}${dk ? ' dk' : ''}${isCover ? ' cover' : ''}${photo ? (ptop ? ' phtop' : ' phfull') : ''}`;
  return page(`<div class="${cls}" id="cv">${bg}${head}${goatTag2(post, s.goat)}${art(s.art)}${body}${foot}</div>`, { w: 1080, h: 1350 });
}

/* =====================================================================================
   Cover tiles (Nov 2026 grid redesign): photo-led tiles with one bold solid shape (arch panel or thin frame)
   holding a short condensed uppercase headline and the round goat logo badge, alternating with calm
   solid-colour tiles (arched headline) and minimal photo tiles (one serif line + a small label tag).
   c = { variant: 'arch'|'frame'|'solid'|'minimal', photo, pos, tone: 'burgundy'|'cream'|'course',
         head, headSize, sub, tag, line, arc, arcSize, art, extra }
   Used for slide 1 of carousels (1080x1350) and for reel covers (1080x1920, shape kept inside the 4:5 grid crop).
   ===================================================================================== */
/* Editorial "cut-out" page: white, big burgundy serif headline, thin rule with a diamond, short serif sub-headline,
   then a simple visual explanation with cut-out objects (photo cut-outs from tools/social/assets/cutouts or
   near-photographic SVG) each with a serif label, arrows between; goat logo + wordmark with the diamond rule at the
   bottom and a page counter. e = { head, headSize, sub, items: [{ src|svg, h, label }], arrows } */
function editorial(item, e, { w = 1080, h = 1350, idx = 1, total = 1 } = {}) {
  const rule = (wd) => `<div class="ed2-rule" style="width:${wd}px"><i></i><b></b><i></i></div>`;
  const obj = (it) => `<figure class="ed2-obj">${it.src ? `<img src="${it.src}" style="height:${it.h || 420}px" alt="">` : `<div style="height:${it.h || 420}px;display:flex;align-items:flex-end">${it.svg}</div>`}${it.label ? `<figcaption>${it.label}</figcaption>` : ''}</figure>`;
  const arrow = '<div class="ed2-arrow"><svg width="110" height="24" viewBox="0 0 110 24"><path d="M2 12 H100 M88 2 L104 12 L88 22" stroke="#7a1430" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';
  const items = (e.items || []).map((it, i) => (i && e.arrows && (e.arrowAt ? e.arrowAt.includes(i) : true) ? arrow : '') + obj(it)).join('');
  const body = `<div class="ed2-top"><div class="ed2-badge">${badgeText(item)}${item.levelNote ? ` · ${item.levelNote}` : ''}</div>
    <div class="ed2-head" style="font-size:${e.headSize || 150}px">${e.head}</div>${rule(760)}
    ${e.sub ? `<div class="ed2-sub" style="${e.subSize ? `font-size:${e.subSize}px` : ''}">${e.sub}</div>` : ''}</div>
    <div class="ed2-row" style="gap:${e.gap ?? 26}px">${items}</div>${e.extra || ''}
    <div class="ed2-foot"><div class="ed2-brand"><img class="em" src="${LOGO}" alt=""><img class="wm" src="${WM_LIGHT_BG}" alt=""></div>${rule(260)}</div>
    ${total > 1 ? `<div class="ed2-count">${idx} / ${total}</div>` : ''}`;
  // reel covers (1080x1920): the 4:5 page sits in the centre, inside the profile-grid crop
  const inner = h > 1350 ? `<div style="position:absolute;left:0;right:0;top:${(h - 1350) / 2}px;height:1350px">${body}${e.reelHint ? `<div class="ed2-hint">▶ ${UI.watch}</div>` : ''}</div>` : body;
  return page(`<div class="cv v2 ed2 c-${item.course}" id="cv" style="width:${w}px;height:${h}px"><div class="accent"></div>${inner}</div>`, { w, h });
}

function coverTile(item, c, { w = 1080, h = 1350, idx = 1, total = 1, reel = false } = {}) {
  if (c.variant === 'edit') return editorial(item, c, { w, h, idx, total });
  const { hires } = require('./photos');
  const bgc = bgClass(item);
  const tone = c.tone || (bgc === 'cream' ? 'cream' : bgc === 'burgundy' ? 'burgundy' : 'course');
  const toneCls = tone === 'course' ? `tn-${item.course}` : `tn-${tone}`;
  const off = reel ? (h - 1350) / 2 : 0; // grid crop: keep the shape inside the central 4:5 area
  const logo = `<div class="tl-logo"><img src="${LOGO}" alt=""></div>`;
  const bd = `<div class="tl-badge">${badgeText(item)}${item.levelNote ? ` <small>${item.levelNote}</small>` : ''}</div>`;
  const hint = reel ? `<div class="tl-hint">▶ ${UI.watch}</div>` : (total > 1 ? `<div class="tl-hint">${UI.swipe} <i></i></div>` : '');
  const photo = c.photo ? `<div class="tl-ph"><img src="${hires(c.photo)}" alt="" style="object-position:${c.pos || 'center'}"></div>` : '';
  const head = c.head ? `<div class="tl-head" style="font-size:${c.headSize || 86}px">${c.head}</div>` : '';
  const sub = c.sub ? `<div class="tl-sub">${c.sub}</div>` : '';
  let inner = '';
  if (c.variant === 'arch') {
    inner = `${photo}<div class="tl-arch ${toneCls}" style="bottom:${off}px;height:${c.archH || 640}px">${logo}${bd}${head}${sub}${c.extra || ''}${hint}</div>`;
  } else if (c.variant === 'frame') {
    inner = `${photo}<div class="tl-frame" style="top:${off + 110}px;bottom:${off + 46}px"></div><div class="tl-flogo" style="top:${off + 110 - 52}px">${logo}</div>
      <div class="tl-block ${toneCls}" style="bottom:${off + 96}px">${bd}${head}${sub}${c.extra || ''}${hint}</div>`;
  } else if (c.variant === 'minimal') {
    inner = `${photo}<div class="tl-shade"></div><div class="tl-mtop" style="top:${off + 70}px">${logo}${c.tag ? `<div class="tl-tag">${c.tag}</div>` : ''}</div>
      <div class="tl-line" style="top:${h / 2 - 90}px">${c.line}</div>
      <div class="tl-mbot" style="bottom:${off + 70}px">${bd}${hint}</div>`;
  } else { // solid: calm full-colour tile, headline set on an arc
    const R = c.arcR || 900, cx = w / 2, cy = off + (c.arcY || 1310); // shallow arc: apex ~300 px from the top
    const arc = c.arc ? `<svg class="tl-arc" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><path id="arc-${item.id}" d="M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}"/></defs>
      <text font-family="TWG Condensed" font-weight="800" font-size="${c.arcSize || 92}" letter-spacing="2" text-anchor="middle"><textPath href="#arc-${item.id}" startOffset="50%">${String(c.arc).toUpperCase()}</textPath></text></svg>` : '';
    inner = `<div class="tl-solid ${toneCls}"></div>${arc}<div class="tl-stop" style="top:${off + 70}px">${logo}</div>
      ${c.art ? `<div class="tl-art" style="top:${off + (c.artTop || 560)}px">${c.art}</div>` : ''}
      <div class="tl-sbot" style="bottom:${off + 64}px">${head}${sub}${c.extra || ''}<div class="tl-row">${bd}${hint}</div></div>`;
  }
  const cls = `cv tile v2 c-${item.course} tl-${c.variant} ${toneCls}${reel ? ' tl-reel' : ''}`;
  return page(`<div class="${cls}" id="cv" style="width:${w}px;height:${h}px"><div class="accent"></div>${inner}</div>`, { w, h });
}

function storyFrame2(st, s) {
  let inner;
  if (s.kind === 'q') {
    inner = `<div class="st-area">
      <div class="kicker">${s.kicker || UI.aOrB}</div>
      <div class="st-q">${s.question}</div>
      ${B.options(s.options)}
      <div class="st-hint" style="margin-top:34px">${s.hint || UI.vote}</div>
      <div class="sticker-space" data-role="sticker"></div>
    </div>`;
  } else {
    inner = `<div class="st-area">
      <div class="kicker">${s.kicker || UI.answer}</div>
      <div class="st-big">${s.answer}</div>
      <div class="st-exp">${s.explain}</div>
      ${s.foot ? `<div class="st-hint" style="margin-top:40px">${s.foot}</div>` : ''}
    </div>`;
  }
  const cv = `<div class="cv tall v2 tpl-${s.tpl || st.tpl || 'flash'} c-${st.course}" id="cv"><div class="accent"></div>${brand(false)}${badge(st)}${goatTag2(st, s.goat)}${art(s.art)}${inner}</div>`;
  return page(cv, { w: 1080, h: 1920 });
}

module.exports = { UI, setLang, editorial, coverTile, bgClass, B2, feedSlide2, storyFrame2, badgeText, NEUTRAL_GOATS, ROOT, page, esc, B, feedSlide, storyFrame, FORBIDDEN_GOATS, LOGO, WM_DARK_BG, WM_LIGHT_BG, HANDLE };
