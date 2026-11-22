// Painterly SVG drawings added for batch 04 (same approach as lib/illus2.js and lib/illus3.js: gradients, highlights,
// soft cast shadows, realistic proportions; never flat icons). Food items for the food-and-wine reel, a thermometer
// for sake service, a snowflake for icewine. None of them is wine imagery, so they are safe on any course.
'use strict';

let N = 0;
const uid = (p) => `${p}4${++N}`;
const svg = (vb, w, inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${w}" style="display:block;overflow:visible">${inner}</svg>`;
const lin = (id, stops, x1 = 0, y1 = 0, x2 = 1, y2 = 0) => `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</linearGradient>`;
const rad = (id, stops, cx = 0.5, cy = 0.5, r = 0.5, fx = cx, fy = cy) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}" fx="${fx}" fy="${fy}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</radialGradient>`;
const blur = (id, sd) => `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${sd}"/></filter>`;
const shadow = (cx, cy, rx, ry, op = 0.3, sd = 7) => { const f = uid('sh'); return `<defs>${blur(f, sd)}</defs><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#1a0a10" opacity="${op}" filter="url(#${f})"/>`; };

/* lemon wedge: glossy peel, pith ring, translucent segments with juice highlights */
function lemon(w = 220) {
  const p = uid('lp'), f = uid('lf'), h = uid('lh');
  const segs = [-62, -31, 0, 31, 62].map((a) => {
    const r = (a * Math.PI) / 180, r2 = ((a + 27) * Math.PI) / 180;
    const cx = 150, cy = 210;
    const x1 = cx + 112 * Math.sin(r - 0.21), y1 = cy - 112 * Math.cos(r - 0.21);
    const x2 = cx + 112 * Math.sin(r2 - 0.21 - 0.47 + 0.2), y2 = cy - 112 * Math.cos(r2 - 0.21 - 0.47 + 0.2);
    return `<path d="M${cx} ${cy - 8} L${x1.toFixed(1)} ${y1.toFixed(1)} A112 112 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z" fill="url(#${f})" stroke="#fff6c8" stroke-width="5" stroke-linejoin="round"/>`;
  }).join('');
  return svg('0 0 300 250', w, `<defs>${lin(p, [[0, '#d9a400'], [0.45, '#ffd83a'], [1, '#e0a800']])}${rad(f, [[0, '#fff7b8'], [0.6, '#ffe46a'], [1, '#f2c42a']], 0.5, 0.9, 0.9)}${lin(h, [[0, '#ffffff', 0.7], [1, '#ffffff', 0]], 0, 0, 0, 1)}</defs>
  ${shadow(150, 232, 120, 10)}
  <path d="M14 214 A136 136 0 0 1 286 214 Z" fill="url(#${p})"/>
  <path d="M24 212 A126 126 0 0 1 276 212 Z" fill="#fffbe6"/>
  <path d="M34 210 A116 116 0 0 1 266 210 Z" fill="#fff1a8"/>
  ${segs}
  <circle cx="150" cy="206" r="9" fill="#fffbe6"/>
  <path d="M58 150 C80 112 118 96 150 94" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none" opacity=".75"/>
  <path d="M14 214 L286 214" stroke="#b88a00" stroke-width="3" opacity=".5"/>`);
}

/* red chilli: glossy curved pod with green calyx and stem */
function chilli(w = 260) {
  const b = uid('cb'), s = uid('cs');
  return svg('0 0 320 200', w, `<defs>${lin(b, [[0, '#ff5a3a'], [0.4, '#d4140c'], [1, '#7a0606']], 0, 0, 0, 1)}${lin(s, [[0, '#9ac25a'], [1, '#3f6a1c']], 0, 0, 0, 1)}</defs>
  ${shadow(160, 182, 130, 9)}
  <path d="M70 58 C120 40 220 60 270 110 C292 132 300 160 296 170 C280 150 240 128 180 116 C130 106 90 104 64 96 C50 90 52 64 70 58 Z" fill="url(#${b})"/>
  <path d="M92 66 C140 56 210 72 256 108" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".55"/>
  <path d="M100 70 C130 64 160 66 186 72" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".85"/>
  <path d="M56 62 C46 70 44 88 58 96 C66 84 74 70 72 58 C66 56 60 58 56 62 Z" fill="url(#${s})"/>
  <path d="M60 70 C40 60 28 40 34 18" stroke="#4a7a22" stroke-width="8" stroke-linecap="round" fill="none"/>
  <path d="M60 70 C40 60 28 40 34 18" stroke="#a8d070" stroke-width="2.5" stroke-linecap="round" fill="none" opacity=".7"/>`);
}

/* little white ceramic dish of flaky sea salt */
function salt(w = 220) {
  const d = uid('sd'), r = uid('sr');
  let flakes = '';
  let seed = 11;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  for (let i = 0; i < 70; i++) {
    const x = 70 + rnd() * 160, y = 70 + rnd() * 34 - Math.max(0, 30 - Math.abs(x - 150) * 0.35);
    const s = 4 + rnd() * 7;
    flakes += `<path d="M${x.toFixed(1)} ${y.toFixed(1)} l${s} ${(-s * 0.4).toFixed(1)} l${(s * 0.5).toFixed(1)} ${s.toFixed(1)} l${(-s).toFixed(1)} ${(s * 0.3).toFixed(1)} Z" fill="${rnd() > 0.5 ? '#ffffff' : '#e8e4ea'}" stroke="#c9c2cc" stroke-width=".8"/>`;
  }
  return svg('0 0 300 200', w, `<defs>${lin(d, [[0, '#d8d2da'], [0.35, '#ffffff'], [1, '#b8b0bc']])}${rad(r, [[0, '#f4f0f6'], [1, '#d4ccd8']])}</defs>
  ${shadow(150, 186, 118, 10)}
  <path d="M30 96 C34 150 80 178 150 178 C220 178 266 150 270 96 Z" fill="url(#${d})"/>
  <ellipse cx="150" cy="96" rx="120" ry="26" fill="url(#${r})"/>
  ${flakes}
  <path d="M46 112 C56 140 84 156 112 162" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none" opacity=".8"/>
  <ellipse cx="150" cy="96" rx="120" ry="26" fill="none" stroke="#a8a0ac" stroke-width="2"/>`);
}

/* slice of layered sponge cake with cream and a strawberry */
function cake(w = 240) {
  const sp = uid('ks'), cr = uid('kc'), st = uid('kt');
  return svg('0 0 300 260', w, `<defs>${lin(sp, [[0, '#f6d28e'], [1, '#d9a454']], 0, 0, 0, 1)}${lin(cr, [[0, '#fffaf0'], [1, '#f1e4cc']], 0, 0, 0, 1)}${rad(st, [[0, '#ff7a7a'], [0.7, '#d61a2a'], [1, '#8a0a14']], 0.4, 0.35, 0.7)}</defs>
  ${shadow(150, 244, 128, 10)}
  <path d="M30 120 L270 150 L270 236 L30 206 Z" fill="url(#${sp})"/>
  <path d="M30 150 L270 180 L270 194 L30 164 Z" fill="url(#${cr})"/>
  <path d="M30 120 L270 150 L270 160 L30 130 Z" fill="url(#${cr})"/>
  <path d="M30 120 L150 70 L270 150 Z" fill="#fff8ea"/>
  <path d="M30 120 L150 70 L270 150" stroke="#e9d8b8" stroke-width="2" fill="none"/>
  ${[60, 100, 140, 180, 220].map((x, i) => `<circle cx="${x}" cy="${178 + i * 5 + (i % 2) * 18}" r="3" fill="#c8913e" opacity=".55"/>`).join('')}
  <path d="M150 52 C128 52 118 72 128 92 C136 108 150 116 152 116 C156 114 172 104 176 88 C182 68 170 52 150 52 Z" fill="url(#${st})"/>
  ${[[140, 70], [158, 66], [148, 86], [164, 84], [138, 96], [156, 100]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.6" ry="2.4" fill="#ffe08a"/>`).join('')}
  <path d="M136 54 C142 42 160 42 166 54 C158 50 144 50 136 54 Z" fill="#4f8a2a"/>`);
}

/* glass thermometer: tone 'cold' (blue column, low) or 'warm' (red column, high), with tick marks */
function thermometer(w = 90, tone = 'cold', level = 0.3) {
  const g = uid('tg'), c = uid('tc');
  const col = tone === 'warm' ? ['#ff6a4a', '#c81e12'] : tone === 'room' ? ['#ffc24a', '#d48a10'] : ['#7ac8ff', '#1e6ad4'];
  const top = 40 + (1 - level) * 300;
  return svg('0 0 100 440', w, `<defs>${lin(g, [[0, '#cfd6dc', 0.9], [0.3, '#ffffff', 0.95], [0.7, '#eef2f4', 0.9], [1, '#aab4bc', 0.9]])}${rad(c, [[0, col[0]], [1, col[1]]], 0.4, 0.4, 0.6)}</defs>
  ${shadow(50, 430, 40, 6, 0.25, 5)}
  <rect x="30" y="20" width="40" height="350" rx="20" fill="url(#${g})" stroke="#9aa4ac" stroke-width="2"/>
  <circle cx="50" cy="380" r="38" fill="url(#${g})" stroke="#9aa4ac" stroke-width="2"/>
  <rect x="43" y="${top}" width="14" height="${380 - top}" rx="7" fill="${col[1]}"/>
  <circle cx="50" cy="380" r="28" fill="url(#${c})"/>
  ${Array.from({ length: 11 }, (_, i) => `<path d="M70 ${60 + i * 28} h${i % 2 ? 8 : 14}" stroke="#6a7278" stroke-width="2.5"/>`).join('')}
  <path d="M38 40 L38 330" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".9"/>
  <circle cx="40" cy="370" r="7" fill="#fff" opacity=".6"/>`);
}

/* frosty snowflake (six branches with side spurs), icy blue with a white edge */
function snowflake(w = 200) {
  const g = uid('sf');
  const arm = `<path d="M0 0 L0 -86 M0 -30 L-18 -48 M0 -30 L18 -48 M0 -56 L-14 -70 M0 -56 L14 -70" stroke="url(#${g})" stroke-width="9" stroke-linecap="round" fill="none"/><path d="M0 0 L0 -86 M0 -30 L-18 -48 M0 -30 L18 -48 M0 -56 L-14 -70 M0 -56 L14 -70" stroke="#ffffff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".9"/>`;
  return svg('0 0 200 200', w, `<defs>${lin(g, [[0, '#9fd8ff'], [1, '#3f86d6']], 0, 0, 0, 1)}</defs>
  <g transform="translate(100 100)">${[0, 60, 120, 180, 240, 300].map((a) => `<g transform="rotate(${a})">${arm}</g>`).join('')}<circle r="12" fill="#e8f6ff" stroke="#5a9ee0" stroke-width="3"/></g>`);
}

module.exports = { lemon, chilli, salt, cake, thermometer, snowflake };
