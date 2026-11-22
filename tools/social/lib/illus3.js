// Painterly SVG drawings added for batch 03 (same approach as lib/illus2.js: gradients, highlights, soft cast
// shadows, realistic proportions; never flat icons). Wine objects only on Wine posts.
'use strict';
const D = require('./illus2');

let N = 0;
const uid = (p) => `${p}3${++N}`;
const svg = (vb, w, inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${w}" style="display:block;overflow:visible">${inner}</svg>`;
const lin = (id, stops, x1 = 0, y1 = 0, x2 = 1, y2 = 0) => `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</linearGradient>`;
const rad = (id, stops, cx = 0.5, cy = 0.5, r = 0.5, fx = cx, fy = cy) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}" fx="${fx}" fy="${fy}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</radialGradient>`;
const blur = (id, sd) => `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${sd}"/></filter>`;
const shadow = (cx, cy, rx, ry, op = 0.32, sd = 7) => { const f = uid('sh'); return `<defs>${blur(f, sd)}</defs><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#1a0a10" opacity="${op}" filter="url(#${f})"/>`; };
const rnd = (seed) => { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; };

/* red flag on a wooden pole: satin cloth with deep folds, rim light, shadow from the pole, finial */
function redFlag(w = 260) {
  const p = uid('fp'), c = uid('fc'), hl = uid('fh'), sh = uid('fs'), f = uid('ff');
  const cloth = 'M62 40 C110 14 150 64 196 44 C236 26 270 30 304 46 L304 206 C270 190 236 186 196 204 C150 224 110 174 62 200 Z';
  return svg('0 0 330 520', w, `
  <defs>
    ${lin(p, [[0, '#4a2a12'], [0.3, '#c8925a'], [0.55, '#9a6638'], [1, '#3e220e']])}
    ${lin(c, [[0, '#6a0a1c'], [0.12, '#c8243e'], [0.26, '#f05a6e'], [0.38, '#a8142e'], [0.5, '#7a0c22'], [0.62, '#d8324a'], [0.74, '#f4707e'], [0.86, '#b81c36'], [1, '#7a0c22']])}
    ${lin(hl, [[0, '#ffffff', 0.4], [0.25, '#ffffff', 0], [0.8, '#000000', 0], [1, '#3a0010', 0.35]], 0, 0, 0, 1)}
    ${lin(sh, [[0, '#2a0008', 0.55], [1, '#2a0008', 0]])}
    ${rad(f, [[0, '#fff3c4'], [0.5, '#e6b84a'], [1, '#8a6414']], 0.35, 0.35, 0.6)}
  </defs>
  ${shadow(72, 506, 64, 8)}
  <rect x="52" y="24" width="16" height="482" rx="7" fill="url(#${p})"/>
  <path d="M56 30 L56 500" stroke="#f0c890" stroke-width="2" opacity=".5"/>
  <path d="${cloth}" fill="url(#${c})"/>
  <path d="${cloth}" fill="url(#${hl})"/>
  <path d="M62 40 L104 30 L104 190 L62 200 Z" fill="url(#${sh})"/>
  <path d="M150 40 C156 100 154 160 148 214" stroke="#ffd0d8" stroke-width="3" opacity=".45" fill="none"/>
  <path d="M252 34 C258 94 258 150 252 196" stroke="#ffd0d8" stroke-width="3" opacity=".4" fill="none"/>
  <path d="M196 44 C202 100 202 160 196 204" stroke="#4a0012" stroke-width="7" opacity=".28" fill="none"/>
  <path d="M62 200 C110 174 150 224 196 204 C236 186 270 190 304 206" stroke="#3a0010" stroke-width="2.5" opacity=".45" fill="none"/>
  <path d="M62 40 C110 14 150 64 196 44 C236 26 270 30 304 46" stroke="#ffb0bc" stroke-width="2" opacity=".6" fill="none"/>
  ${[52, 92, 132, 172].map((y) => `<circle cx="63" cy="${y}" r="3.2" fill="#d4a23a" stroke="#6a4a10" stroke-width="1"/>`).join('')}
  <circle cx="60" cy="20" r="14" fill="url(#${f})"/>`);
}

/* juniper sprig: needle whorls, blue-black berries with a pale waxy bloom, a few green unripe ones */
function juniper(w = 300, seed = 5) {
  const r = rnd(seed);
  const b = uid('jb'), g = uid('jg'), n = uid('jn');
  const needles = [];
  for (let i = 0; i < 30; i++) {
    const t = i / 30, x = 40 + t * 300, y = 300 - t * 200 + Math.sin(t * 6) * 8;
    for (const s of [-1, 1]) {
      const a = (-40 - r() * 30) * s, L = 46 + r() * 22;
      const ex = x + Math.cos((a - 60) * Math.PI / 180) * L * 0.7, ey = y + Math.sin((a - 60) * Math.PI / 180) * L * s;
      needles.push(`<path d="M${x.toFixed(1)} ${y.toFixed(1)} L${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="url(#${n})" stroke-width="4.2" stroke-linecap="round"/>`);
    }
  }
  const berries = [[120, 250, 24, 1], [150, 228, 22, 1], [138, 272, 21, 1], [200, 196, 23, 1], [228, 178, 21, 0], [176, 222, 20, 1], [262, 150, 22, 1], [250, 186, 18, 0], [96, 282, 19, 1]]
    .map(([x, y, rr, ripe]) => `<circle cx="${x}" cy="${y}" r="${rr}" fill="url(#${ripe ? b : g})"/><circle cx="${x - rr * 0.35}" cy="${y - rr * 0.38}" r="${rr * 0.28}" fill="#fff" opacity="${ripe ? 0.45 : 0.55}"/>${ripe ? `<path d="M${x - 5} ${y + rr * 0.55} l5 -6 l5 6" stroke="#2a2440" stroke-width="2" fill="none" opacity=".5"/>` : ''}`).join('');
  return svg('0 0 380 340', w, `
  <defs>
    ${rad(b, [[0, '#9aa4c8'], [0.35, '#5a5f8e'], [0.75, '#2e2c52'], [1, '#1a1834']], 0.38, 0.35, 0.65)}
    ${rad(g, [[0, '#c8dca0'], [0.6, '#7a9a4a'], [1, '#4a6a2a']], 0.38, 0.35, 0.65)}
    ${lin(n, [[0, '#2f5a3a'], [0.5, '#5f8a5a'], [1, '#2a4a30']])}
  </defs>
  ${shadow(200, 326, 150, 8, 0.22, 8)}
  <path d="M30 312 C120 260 220 190 350 90" stroke="#6a4a2a" stroke-width="9" stroke-linecap="round" fill="none"/>
  <path d="M30 312 C120 260 220 190 350 90" stroke="#a87a4a" stroke-width="3" stroke-linecap="round" fill="none" opacity=".7" transform="translate(-1 -3)"/>
  ${needles.join('')}${berries}`);
}

/* tall clear gin bottle with a juniper-sprig label (no brand) */
function ginBottle(w = 170) {
  const gl = uid('gg'), lq = uid('gq'), lb = uid('gl');
  return svg('0 0 200 560', w, `
  <defs>
    ${lin(gl, [[0, '#9fb8c0', 0.75], [0.12, '#e8f2f4', 0.35], [0.3, '#ffffff', 0.08], [0.75, '#ffffff', 0.06], [0.9, '#cfe0e4', 0.35], [1, '#8aa4ac', 0.75]])}
    ${lin(lq, [[0, '#b8d0d6', 0.95], [0.3, '#f4fbfc', 0.92], [0.6, '#e4f0f2', 0.9], [1, '#a8c4cc', 0.95]])}
    ${lin(lb, [[0, '#ece4d2'], [0.3, '#fffaf0'], [1, '#ddd0b6']])}
  </defs>
  ${shadow(104, 544, 82, 9, 0.3)}
  <rect x="78" y="14" width="44" height="56" rx="7" fill="#2a3a4a"/><rect x="78" y="14" width="44" height="12" rx="6" fill="#4a5e70"/>
  <path d="M82 70 L118 70 L118 118 C118 150 172 160 172 204 L172 520 C172 532 162 540 150 540 L50 540 C38 540 28 532 28 520 L28 204 C28 160 82 150 82 118 Z" fill="url(#${lq})"/>
  <path d="M82 70 L118 70 L118 118 C118 150 172 160 172 204 L172 520 C172 532 162 540 150 540 L50 540 C38 540 28 532 28 520 L28 204 C28 150 82 150 82 118 Z" fill="url(#${gl})" stroke="#5a7a84" stroke-opacity=".55" stroke-width="2"/>
  <path d="M30 520 C60 530 140 530 170 520" stroke="#7a9aa4" stroke-width="5" opacity=".5" fill="none"/>
  <rect x="44" y="270" width="112" height="170" rx="8" fill="url(#${lb})"/>
  <rect x="51" y="277" width="98" height="156" rx="4" fill="none" stroke="#2f5a3a" stroke-width="2"/>
  <text x="100" y="330" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-weight="800" font-size="40" fill="#1f3a2a">GIN</text>
  <rect x="70" y="342" width="60" height="3" fill="#2f5a3a" opacity=".6"/>
  <g transform="translate(62 352) scale(.2)">${juniper(380, 3).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g>
  <path d="M40 200 L40 510" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".55"/>
  <path d="M160 214 L160 500" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".4"/>`);
}

/* wine bottle with a readable label (generic place or grape name, no producer) */
function labelBottle(w = 180, { glass = 'green', wine = 'red', top = '', big = 'Chablis', small = '', bigSize = 34 } = {}) {
  const gb = uid('lb'), gs = uid('ls'), lb = uid('ll'), fo = uid('lf');
  const G = { green: ['#0e2a16', '#2f5a34', '#5f8a5a'], flint: ['#a8b8a8', '#e8f0e4', '#c8d4c4'], dark: ['#0a0f0a', '#1e2a1e', '#3a4a3a'] }[glass];
  const liquid = wine === 'white' ? '#d8c060' : '#2a0610';
  return svg('0 0 200 600', w, `
  <defs>
    ${lin(gb, [[0, G[0]], [0.22, G[1]], [0.38, G[2]], [0.55, G[1]], [1, G[0]]])}
    ${lin(gs, [[0, '#ffffff', 0], [0.5, '#ffffff', 0.55], [1, '#ffffff', 0]])}
    ${lin(lb, [[0, '#ebe2cc'], [0.25, '#fffbf2'], [0.75, '#fbf5e8'], [1, '#dccdb0']])}
    ${lin(fo, [[0, '#4a0a18'], [0.4, '#a8203e'], [0.6, '#c43a58'], [1, '#4a0a18']])}
  </defs>
  ${shadow(104, 586, 80, 9, 0.32)}
  <path d="M82 120 L118 120 L118 190 C118 236 170 250 170 300 L170 566 C170 576 162 582 152 582 L48 582 C38 582 30 576 30 566 L30 300 C30 250 82 236 82 190 Z" fill="${glass === 'flint' ? liquid : 'url(#' + gb + ')'}"/>
  ${glass === 'flint' ? `<path d="M82 120 L118 120 L118 190 C118 236 170 250 170 300 L170 566 C170 576 162 582 152 582 L48 582 C38 582 30 576 30 566 L30 300 C30 250 82 236 82 190 Z" fill="url(#${gb})" opacity=".35"/>` : ''}
  <path d="M80 18 L120 18 L120 128 L80 128 Z" fill="url(#${fo})"/><rect x="78" y="14" width="44" height="12" rx="4" fill="#6a1024"/>
  <path d="M80 112 L120 112" stroke="#2a0410" stroke-width="3" opacity=".5"/>
  <rect x="38" y="352" width="124" height="178" rx="4" fill="url(#${lb})"/>
  <rect x="45" y="359" width="110" height="164" rx="2" fill="none" stroke="#8a6a3a" stroke-width="1.6"/>
  ${top ? `<text x="100" y="392" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-weight="600" font-style="italic" font-size="17" fill="#6a4a2a"${top.length > 13 ? ' textLength="110" lengthAdjust="spacingAndGlyphs"' : ''}>${top}</text>` : ''}
  <text x="100" y="${top ? 440 : 430}" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-weight="800" font-size="${bigSize}" fill="#3e0f22"${big.length * bigSize * 0.56 > 112 ? ' textLength="112" lengthAdjust="spacingAndGlyphs"' : ''}>${big}</text>
  <path d="M74 ${top ? 456 : 448} L126 ${top ? 456 : 448}" stroke="#8c1d40" stroke-width="2"/>
  ${small ? `<text x="100" y="${top ? 482 : 474}" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-weight="700" font-size="12.5" letter-spacing="1.2" fill="#5c4a50"${small.length > 15 ? ' textLength="108" lengthAdjust="spacingAndGlyphs"' : ''}>${small}</text>` : ''}
  <path d="M44 300 L44 560" stroke="url(#${gs})" stroke-width="12" stroke-linecap="round" opacity=".7"/>
  <path d="M90 140 L90 200" stroke="#fff" stroke-width="4" opacity=".35" stroke-linecap="round"/>`);
}

/* beer bottle in brown, green or clear glass, crown cap, beer visible */
function beerBottle(w = 130, col = 'brown') {
  const G = { brown: ['#2a1204', '#6a3410', '#a8601e'], green: ['#0e3a1a', '#2f7a3e', '#6ab87a'], clear: ['#b8c4bc', '#f2f6f0', '#d4ddd6'] }[col];
  const gb = uid('bb'), gs = uid('bs'), cp = uid('bc');
  return svg('0 0 160 520', w, `
  <defs>
    ${lin(gb, [[0, G[0]], [0.25, G[1]], [0.4, G[2]], [0.6, G[1]], [1, G[0]]])}
    ${lin(gs, [[0, '#ffffff', 0], [0.5, '#ffffff', 0.6], [1, '#ffffff', 0]])}
    ${lin(cp, [[0, '#7a7a7a'], [0.4, '#e8e8e8'], [0.7, '#b8b8b8'], [1, '#6a6a6a']])}
  </defs>
  ${shadow(84, 506, 64, 8, 0.32)}
  ${col === 'clear' ? '<path d="M62 70 L98 70 L98 120 C98 170 132 190 132 240 L132 488 C132 496 126 500 118 500 L42 500 C34 500 28 496 28 488 L28 240 C28 190 62 170 62 120 Z" fill="#e8b84a"/>' : ''}
  <path d="M62 40 L98 40 L98 120 C98 170 132 190 132 240 L132 488 C132 496 126 500 118 500 L42 500 C34 500 28 496 28 488 L28 240 C28 190 62 170 62 120 Z" fill="url(#${gb})" opacity="${col === 'clear' ? 0.55 : 1}"/>
  <rect x="58" y="22" width="44" height="22" rx="4" fill="url(#${cp})"/>
  ${Array.from({ length: 7 }, (_, i) => `<path d="M${60 + i * 6.5} 40 L${60 + i * 6.5} 46" stroke="#5a5a5a" stroke-width="2"/>`).join('')}
  <path d="M62 52 L98 52" stroke="#000" stroke-opacity=".25" stroke-width="3"/>
  <path d="M38 230 L38 480" stroke="url(#${gs})" stroke-width="11" stroke-linecap="round" opacity=".75"/>
  <path d="M70 70 L70 130" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".45"/>
  <path d="M124 260 L124 470" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".25"/>`);
}

/* sake cup (o-choko) and cedar masu box */
function ochoko(w = 160) {
  const c = uid('oc'), s = uid('os');
  return svg('0 0 200 170', w, `
  <defs>${lin(c, [[0, '#cfc6b8'], [0.3, '#fffdf8'], [1, '#bfb4a4']])}${rad(s, [[0, '#fdfbf0'], [1, '#e6e0c4']])}</defs>
  ${shadow(100, 158, 80, 8, 0.28)}
  <path d="M30 40 L170 40 C168 108 148 150 100 152 C52 150 32 108 30 40 Z" fill="url(#${c})"/>
  <ellipse cx="100" cy="40" rx="70" ry="18" fill="url(#${s})" stroke="#b9ae9e" stroke-width="2"/>
  <ellipse cx="100" cy="42" rx="44" ry="10" fill="none" stroke="#2e3a8a" stroke-width="5" opacity=".75"/>
  <ellipse cx="100" cy="42" rx="20" ry="4.5" fill="none" stroke="#2e3a8a" stroke-width="5" opacity=".75"/>
  <path d="M42 58 C46 100 62 128 84 142" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".6" fill="none"/>`);
}
function masu(w = 240) {
  const a = uid('ma'), b = uid('mb'), t = uid('mt');
  const grain = (x0, y0, x1, y1, n, seed) => { const r = rnd(seed); return Array.from({ length: n }, (_, i) => { const k = (i + 0.5) / n; const yy = y0 + (y1 - y0) * k; return `<path d="M${x0} ${yy.toFixed(1)} C${x0 + (x1 - x0) * 0.3} ${(yy + (r() - 0.5) * 6).toFixed(1)} ${x0 + (x1 - x0) * 0.7} ${(yy + (r() - 0.5) * 6).toFixed(1)} ${x1} ${yy.toFixed(1)}" stroke="#9a6a3a" stroke-width="1.4" opacity=".45" fill="none"/>`; }).join(''); };
  return svg('0 0 300 260', w, `
  <defs>${lin(a, [[0, '#e8c896'], [0.5, '#f6dcae'], [1, '#d6b07a']])}${lin(b, [[0, '#d4ac72'], [1, '#c09058']])}${lin(t, [[0, '#f4ecd0'], [1, '#e4d8b0']])}</defs>
  ${shadow(150, 246, 130, 10, 0.3)}
  <path d="M30 80 L150 120 L150 236 L30 196 Z" fill="url(#${a})"/>
  ${grain(30, 90, 150, 130, 8, 3).replace(/M30 /g, 'M30 ')}
  <path d="M150 120 L270 80 L270 196 L150 236 Z" fill="url(#${b})"/>
  ${grain(150, 130, 270, 90, 8, 7)}
  <path d="M30 80 L150 40 L270 80 L150 120 Z" fill="#c8985e"/>
  <path d="M44 80 L150 46 L256 80 L150 114 Z" fill="url(#${t})"/>
  <path d="M44 80 L150 46 L256 80" stroke="#a87a44" stroke-width="2" fill="none"/>
  <path d="M150 120 L150 236" stroke="#8a5a2a" stroke-width="2" opacity=".6"/>
  <path d="M60 96 L60 200" stroke="#fff" stroke-width="5" opacity=".3" stroke-linecap="round"/>`);
}

/* copper continuous (column) still: plates behind portholes, rivets, pipework */
function columnStill(w = 240) {
  const cu = uid('cc'), gl = uid('cg');
  const plates = Array.from({ length: 7 }, (_, i) => 120 + i * 52);
  return svg('0 0 260 520', w, `
  <defs>
    ${lin(cu, [[0, '#4a1a06'], [0.16, '#a24e22'], [0.32, '#f0a070'], [0.48, '#c8683a'], [0.8, '#7a3412'], [1, '#3e1404']])}
    ${rad(gl, [[0, '#fff2c8', 0.95], [0.6, '#f0c060', 0.7], [1, '#8a5a1a', 0.9]], 0.4, 0.4, 0.6)}
  </defs>
  ${shadow(120, 504, 110, 10, 0.32)}
  <rect x="70" y="40" width="100" height="440" rx="18" fill="url(#${cu})"/>
  <path d="M70 60 C70 30 170 30 170 60" fill="url(#${cu})"/>
  ${plates.map((y) => `<rect x="70" y="${y}" width="100" height="5" fill="#3e1404" opacity=".45"/>${[82, 102, 122, 142, 160].map((x) => `<circle cx="${x}" cy="${y + 12}" r="2.2" fill="#ffd2b0" opacity=".7"/>`).join('')}`).join('')}
  ${plates.slice(0, 6).map((y) => `<circle cx="120" cy="${y + 30}" r="12" fill="url(#${gl})" stroke="#5a2408" stroke-width="4"/>`).join('')}
  <path d="M120 30 C120 10 200 6 214 40 L214 300" stroke="url(#${cu})" stroke-width="16" fill="none"/>
  <rect x="196" y="300" width="40" height="150" rx="10" fill="url(#${cu})"/>
  <path d="M216 450 L216 480 L244 480" stroke="#a24e22" stroke-width="8" fill="none"/>
  <path d="M30 470 L70 470 M30 440 L70 440" stroke="#6a5a52" stroke-width="8"/>
  <path d="M86 70 L86 460" stroke="#ffe0c8" stroke-width="9" stroke-linecap="round" opacity=".45"/>
  <rect x="58" y="470" width="124" height="20" rx="4" fill="#5a4a42"/>`);
}

/* white wine glass with harmless tartrate crystals settled at the bottom of the bowl */
function glassCrystals(w = 200) {
  const r = rnd(11);
  const cr = Array.from({ length: 22 }, () => {
    const x = 88 + r() * 60, y = 284 - r() * 14, s = 5 + r() * 8;
    return `<path d="M${x.toFixed(1)} ${y.toFixed(1)} l${s} ${-s * 0.9} l${s * 0.9} ${s * 0.4} l${-s * 0.5} ${s} z" fill="#ffffff" stroke="#b8a868" stroke-width="1" opacity=".95"/>`;
  }).join('');
  return `<div style="position:relative;width:${w}px">${D.glassPhoto(w, 'pale')}<div style="position:absolute;left:0;top:0;width:${w}px">${svg('0 0 240 560', w, cr)}</div></div>`;
}

/* natural cork, optionally with a damp stain at the wine end */
function cork(w = 120, stained = false) {
  const c = uid('ck'), e = uid('ce');
  const r = rnd(stained ? 9 : 4);
  const pores = Array.from({ length: 40 }, () => `<ellipse cx="${(22 + r() * 76).toFixed(1)}" cy="${(30 + r() * 170).toFixed(1)}" rx="${(1.2 + r() * 2.4).toFixed(1)}" ry="${(0.8 + r() * 1.4).toFixed(1)}" fill="#7a4a1e" opacity=".55"/>`).join('');
  return svg('0 0 120 240', w, `
  <defs>${lin(c, [[0, '#a8743e'], [0.3, '#e2b47a'], [0.6, '#d0a066'], [1, '#8a5a2a']])}${rad(e, [[0, '#e8c08a'], [1, '#c0905a']])}</defs>
  ${shadow(60, 226, 48, 7, 0.28)}
  <rect x="18" y="22" width="84" height="196" rx="10" fill="url(#${c})"/>
  ${pores}
  <ellipse cx="60" cy="22" rx="42" ry="10" fill="url(#${e})"/>
  ${stained ? '<path d="M18 168 C40 160 80 176 102 166 L102 208 C102 214 96 218 90 218 L30 218 C24 218 18 214 18 208 Z" fill="#5a1426" opacity=".55"/>' : ''}
  <path d="M28 40 L28 200" stroke="#fff" stroke-width="5" opacity=".25" stroke-linecap="round"/>`);
}

module.exports = { redFlag, juniper, ginBottle, labelBottle, beerBottle, ochoko, masu, columnStill, glassCrystals, cork };
