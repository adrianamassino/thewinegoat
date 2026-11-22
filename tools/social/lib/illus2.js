// Painterly SVG illustrations for Instagram posts (batch 02 rebuild onwards).
// Replaces the flat line icons of lib/illus.js: gradients, highlights, soft cast shadows and realistic
// proportions, so the drawings sit well next to the painted goats and real photos.
// Rules: wine imagery (glasses of wine, grapes, wine bottles) only on Wine posts; white-wine topics use
// green-gold grapes and pale wine; Spirits / Sake / Beer posts use their own subjects only.
'use strict';

let N = 0;
const uid = (p) => `${p}${++N}`;
const svg = (vb, w, inner, extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${w}" style="display:block;overflow:visible" ${extra}>${inner}</svg>`;
const lin = (id, stops, x1 = 0, y1 = 0, x2 = 1, y2 = 0) => `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</linearGradient>`;
const rad = (id, stops, cx = 0.5, cy = 0.5, r = 0.5, fx = cx, fy = cy) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}" fx="${fx}" fy="${fy}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</radialGradient>`;
const blur = (id, sd) => `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${sd}"/></filter>`;
const shadow = (cx, cy, rx, ry, op = 0.35, sd = 7) => { const f = uid('sh'); return `<defs>${blur(f, sd)}</defs><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#1a0a10" opacity="${op}" filter="url(#${f})"/>`; };
// deterministic pseudo-random
const rnd = (seed) => { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; };

/* ------------------------------------------------------------------ wine colours */
const WINE = {
  red: ['#3d0816', '#7a1630', '#a8304e'],
  pale: ['#e9dc8e', '#f4ecb6', '#fffbe0'],
  white: ['#e9dc8e', '#f4ecb6', '#fffbe0'],
  gold: ['#d4a338', '#e9c463', '#fbe7a6'],
  pink: ['#e07a92', '#f3a9b8', '#fde1e6'],
  sparkling: ['#e6d27e', '#f2e3a4', '#fff8dc'],
  sherry: ['#e3d590', '#efe5b2', '#fdf8dc'],
  amber: ['#9a5418', '#c47c2c', '#e8b261'],
  brown: ['#4a1f08', '#7a3a12', '#b0662a'],
  dark: ['#140503', '#2e0d06', '#5a2010'],
};

/* ------------------------------------------------------------------ wine glass (tulip / copita) */
function glass(w = 160, kind = 'white', { shape } = {}) {
  if (kind === 'sparkling') return flute(w);
  const narrow = shape === 'copita' || ['sherry', 'amber', 'brown', 'dark'].includes(kind);
  const [c0, c1, c2] = WINE[kind] || WINE.white;
  const g = uid('g'), l = uid('l'), lh = uid('lh'), st = uid('st'), sf = uid('sf');
  // bowl outline
  const bowl = narrow
    ? 'M66 22 C60 70 40 120 44 170 C48 215 74 236 100 238 C126 236 152 215 156 170 C160 120 140 70 134 22 Z'
    : 'M44 20 C34 90 30 160 48 196 C62 224 82 234 100 235 C118 234 138 224 152 196 C170 160 166 90 156 20 Z';
  const sy = narrow ? 150 : 128; // liquid surface
  const half = narrow ? 56 : 62;
  const liq = narrow
    ? `M${100 - half} ${sy} C${46} 200 74 236 100 238 C126 236 154 200 ${100 + half} ${sy} Z`
    : `M${100 - half} ${sy} C40 178 60 228 100 235 C140 228 160 178 ${100 + half} ${sy} Z`;
  const rimRx = narrow ? 34 : 56;
  return svg('0 0 200 470', w, `
  <defs>
    ${lin(g, [[0, '#ffffff', 0.55], [0.35, '#ffffff', 0.08], [0.7, '#ffffff', 0.04], [1, '#ffffff', 0.35]])}
    ${lin(l, [[0, c0], [0.45, c1], [0.8, c1], [1, c0]])}
    ${rad(lh, [[0, c2, 0.95], [1, c2, 0]], 0.38, 0.35, 0.55)}
    ${lin(st, [[0, '#ffffff', 0.25], [0.5, '#ffffff', 0.9], [1, '#d9d2cc', 0.6]])}
    ${lin(sf, [[0, '#ffffff', 0.9], [1, '#e8e1da', 0.7]], 0, 0, 0, 1)}
  </defs>
  ${shadow(108, 452, 78, 9, 0.3, 6)}
  <path d="${liq}" fill="url(#${l})"/>
  <path d="${liq}" fill="url(#${lh})"/>
  <ellipse cx="100" cy="${sy}" rx="${half}" ry="7" fill="${c2}" opacity=".9"/>
  <ellipse cx="100" cy="${sy}" rx="${half}" ry="7" fill="none" stroke="${c0}" stroke-opacity=".35" stroke-width="1.5"/>
  <path d="${bowl}" fill="url(#${g})" stroke="#7d6b72" stroke-opacity=".38" stroke-width="2.2"/>
  <ellipse cx="100" cy="${narrow ? 22 : 20}" rx="${rimRx}" ry="5" fill="none" stroke="#7d6b72" stroke-opacity=".4" stroke-width="2"/>
  <path d="M${narrow ? 60 : 50} ${narrow ? 60 : 50} C${narrow ? 52 : 42} 110 ${narrow ? 52 : 42} 160 ${narrow ? 64 : 56} 196" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".8"/>
  <path d="M${narrow ? 140 : 150} ${narrow ? 70 : 60} C${narrow ? 146 : 156} 100 ${narrow ? 148 : 158} 130 ${narrow ? 146 : 156} 150" stroke="#fff" stroke-width="3.5" stroke-linecap="round" fill="none" opacity=".55"/>
  <path d="M96 237 C97 300 97 380 95 438 L105 438 C103 380 103 300 104 237 Z" fill="url(#${st})" stroke="#7d6b72" stroke-opacity=".3" stroke-width="1.4"/>
  <ellipse cx="100" cy="444" rx="68" ry="11" fill="url(#${sf})" stroke="#7d6b72" stroke-opacity=".35" stroke-width="1.6"/>
  <ellipse cx="84" cy="441" rx="28" ry="3" fill="#fff" opacity=".8"/>`);
}

function flute(w = 120) {
  const [c0, c1, c2] = WINE.sparkling;
  const g = uid('g'), l = uid('l'), st = uid('st');
  const r = rnd(7);
  const bubbles = Array.from({ length: 34 }, () => { const y = 110 + r() * 170; const sp = 18 - (y - 110) / 170 * 10; return `<circle cx="${(100 + (r() - 0.5) * 2 * sp).toFixed(1)}" cy="${y.toFixed(1)}" r="${(1 + r() * 2.2).toFixed(1)}" fill="#fff" opacity="${(0.55 + r() * 0.4).toFixed(2)}"/>`; }).join('');
  return svg('0 0 200 520', w, `
  <defs>
    ${lin(g, [[0, '#ffffff', 0.55], [0.4, '#ffffff', 0.06], [1, '#ffffff', 0.35]])}
    ${lin(l, [[0, c0], [0.5, c2], [1, c0]])}
    ${lin(st, [[0, '#ffffff', 0.3], [0.5, '#ffffff', 0.9], [1, '#d9d2cc', 0.6]])}
  </defs>
  ${shadow(106, 504, 62, 8, 0.3, 6)}
  <path d="M71 92 C70 170 76 250 88 286 C92 296 96 300 100 300 C104 300 108 296 112 286 C124 250 130 170 129 92 Z" fill="url(#${l})"/>
  <ellipse cx="100" cy="92" rx="29" ry="5" fill="#fffbe6"/>
  <path d="M74 86 C76 80 82 78 88 82 C92 76 100 76 104 81 C110 76 120 78 126 86 C120 92 80 92 74 86Z" fill="#fffdf2" opacity=".9"/>
  ${bubbles}
  <path d="M68 16 C66 120 72 240 88 290 C92 300 96 304 100 304 C104 304 108 300 112 290 C128 240 134 120 132 16 Z" fill="url(#${g})" stroke="#7d6b72" stroke-opacity=".38" stroke-width="2.2"/>
  <ellipse cx="100" cy="16" rx="32" ry="4.5" fill="none" stroke="#7d6b72" stroke-opacity=".4" stroke-width="2"/>
  <path d="M76 40 C74 120 78 210 88 262" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".85"/>
  <path d="M97 304 C98 360 98 430 96 490 L104 490 C102 430 102 360 103 304Z" fill="url(#${st})" stroke="#7d6b72" stroke-opacity=".3" stroke-width="1.3"/>
  <ellipse cx="100" cy="495" rx="56" ry="9" fill="#fbf8f4" stroke="#7d6b72" stroke-opacity=".35" stroke-width="1.5"/>
  <ellipse cx="86" cy="493" rx="22" ry="2.5" fill="#fff"/>`);
}


/* ------------------------------------------------------------------ near-photographic wine glass (for white "cut-out" layouts) */
// Tulip glass rendered like a studio photo on white: refraction-darkened glass edges, deep-edged wine with a bright
// meniscus, soft window reflections, a thick stem with glass edges and a wine-tinted caustic shadow.
function glassPhoto(w = 260, kind = 'white') {
  const C = { white: ['#c9a93c', '#ecd97e', '#fbf3c4'], pale: ['#cdb24a', '#efe09a', '#fcf6d4'], gold: ['#b07a14', '#e0a838', '#f9d888'], red: ['#2a0410', '#5e0c24', '#9a2442'],
    pink: ['#c45a72', '#ee9aac', '#fbd6de'], sherry: ['#c8ac4a', '#eedc94', '#fbf4cf'], amber: ['#7a3a08', '#c07224', '#eaa654'], brown: ['#3a1404', '#6e2e0c', '#a8581e'], dark: ['#0e0302', '#260904', '#4e1608'] }[kind] || ['#c9a93c', '#ecd97e', '#fbf3c4'];
  const id = uid('gp');
  const bowl = 'M58 30 C50 110 40 170 44 214 C50 262 78 290 120 292 C162 290 190 262 196 214 C200 170 190 110 182 30 Z';
  const sy = 170;
  const liq = `M43 ${sy} C42 186 43 200 44 214 C50 262 78 290 120 292 C162 290 190 262 196 214 C197 200 198 186 197 ${sy} Z`;
  return svg('0 0 240 560', w, `
  <defs>
    ${lin(id + 'e', [[0, '#5a5558', 0.42], [0.07, '#9a9598', 0.16], [0.18, '#ffffff', 0], [0.82, '#ffffff', 0], [0.93, '#9a9598', 0.16], [1, '#5a5558', 0.42]])}
    ${lin(id + 'l', [[0, C[0]], [0.16, C[1]], [0.5, C[2]], [0.84, C[1]], [1, C[0]]])}
    ${lin(id + 'lv', [[0, '#ffffff', 0.25], [0.25, '#ffffff', 0], [0.6, '#ffffff', 0], [1, C[0], 0.7]], 0, 0, 0, 1)}
    ${lin(id + 's', [[0, '#8a8588', 0.55], [0.35, '#ffffff', 0.2], [0.5, '#ffffff', 0.9], [0.65, '#ffffff', 0.2], [1, '#8a8588', 0.55]])}
    ${rad(id + 'f', [[0, '#ffffff', 0.15], [0.8, '#d8d4d6', 0.35], [0.95, '#8a8588', 0.6], [1, '#8a8588', 0.2]])}
    ${rad(id + 'c', [[0, C[1], 0.5], [0.6, C[1], 0.18], [1, C[1], 0]])}
    ${blur(id + 'b1', 2.2)}${blur(id + 'b2', 9)}${blur(id + 'b3', 1)}
  </defs>
  <ellipse cx="132" cy="540" rx="96" ry="12" fill="#2a1a20" opacity=".22" filter="url(#${id}b2)"/>
  <ellipse cx="150" cy="543" rx="70" ry="9" fill="url(#${id}c)" filter="url(#${id}b2)"/>
  <path d="${liq}" fill="url(#${id}l)"/>
  <path d="${liq}" fill="url(#${id}lv)"/>
  <ellipse cx="120" cy="${sy}" rx="77" ry="9" fill="${C[2]}"/>
  <ellipse cx="120" cy="${sy + 1}" rx="77" ry="9" fill="none" stroke="${C[0]}" stroke-width="2" opacity=".45"/>
  <path d="M46 ${sy + 1} C80 ${sy + 9} 160 ${sy + 9} 194 ${sy + 1}" stroke="#fff" stroke-width="2.4" fill="none" opacity=".9"/>
  <path d="${bowl}" fill="url(#${id}e)"/>
  <path d="${bowl}" fill="none" stroke="#6e686b" stroke-opacity=".38" stroke-width="1.3"/>
  <ellipse cx="120" cy="30" rx="62" ry="4.5" fill="none" stroke="#6e686b" stroke-opacity=".45" stroke-width="1.6"/>
  <ellipse cx="120" cy="30.8" rx="60" ry="3.4" fill="none" stroke="#fff" stroke-width="1.2" opacity=".9"/>
  <path d="M66 56 C58 110 52 170 60 228" stroke="#fff" stroke-width="9" stroke-linecap="round" fill="none" opacity=".85" filter="url(#${id}b1)"/>
  <path d="M74 64 C70 100 68 130 70 160" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".95"/>
  <path d="M178 70 C184 120 186 170 180 220" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none" opacity=".6" filter="url(#${id}b1)"/>
  <path d="M106 290 C112 298 113 312 113 330 L112 498 C108 512 98 518 92 524 L148 524 C142 518 132 512 128 498 L127 330 C127 312 128 298 134 290 Z" fill="url(#${id}s)"/>
  <path d="M113 304 L112 498 M127 304 L128 498" stroke="#5a5558" stroke-opacity=".45" stroke-width="1.4"/>
  <path d="M117 306 L117 494" stroke="#fff" stroke-width="2.2" opacity=".95"/>
  <ellipse cx="120" cy="291" rx="16" ry="5" fill="${C[0]}" opacity=".35"/>
  <ellipse cx="120" cy="528" rx="86" ry="13" fill="url(#${id}f)"/>
  <ellipse cx="120" cy="528" rx="86" ry="13" fill="none" stroke="#6e686b" stroke-opacity=".35" stroke-width="1.2"/>
  <path d="M48 526 C70 520 100 518 130 518" stroke="#fff" stroke-width="2.4" fill="none" opacity=".9" filter="url(#${id}b3)"/>`);
}

/* ------------------------------------------------------------------ vine leaf */
function leafPath(cx, cy, R, rot = 0) {
  const pts = [];
  for (let i = 0; i <= 180; i++) {
    const t = -Math.PI + (i / 180) * 2 * Math.PI;
    const lobes = 0.62 + 0.38 * Math.pow(Math.abs(Math.cos(2.5 * t)), 0.7);
    const teeth = 1 + 0.045 * Math.sin(36 * t);
    const notch = Math.abs(t) > 2.75 ? 0.55 : 1; // petiole sinus
    const r = R * lobes * teeth * notch;
    const a = t + rot - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return 'M' + pts.join(' L') + 'Z';
}
function leaf(cx, cy, R, rot, tone = 'green') {
  const id = uid('lf');
  const cols = tone === 'gold' ? ['#8a7a22', '#c9b44a', '#e9d98a'] : ['#2f5a24', '#5b8a36', '#9cc068'];
  const veins = [0, 1.25, -1.25, 2.4, -2.4].map((a) => { const aa = a + rot - Math.PI / 2 + Math.PI; return `<path d="M${cx} ${cy} L${(cx + R * 0.8 * Math.cos(aa)).toFixed(1)} ${(cy + R * 0.8 * Math.sin(aa)).toFixed(1)}" stroke="${cols[2]}" stroke-width="2" opacity=".7"/>`; }).join('');
  return `<defs>${rad(id, [[0, cols[2]], [0.55, cols[1]], [1, cols[0]]], 0.45, 0.4, 0.7)}</defs><path d="${leafPath(cx, cy, R, rot)}" fill="url(#${id})" stroke="${cols[0]}" stroke-width="1.5" stroke-opacity=".6"/>${veins}`;
}

/* ------------------------------------------------------------------ grape bunch */
function grapes(w = 220, kind = 'red', { leafOn = true, seed = 3 } = {}) {
  const P = {
    red: { hi: '#8a6a9e', mid: '#4a1d45', lo: '#1c0a1e', bloom: '#b8a9cc' },
    white: { hi: '#fbf6c4', mid: '#cfd27a', lo: '#7f8f2e', bloom: '#ffffff' },
    pink: { hi: '#f3c7cf', mid: '#c46b7f', lo: '#7a2d44', bloom: '#ffe9ee' },
  }[kind];
  const b = uid('b'), bl = uid('bl'), stem = uid('sm');
  const r = rnd(seed);
  // berry layout: inverted cone, back rows first
  const berries = [];
  const rows = [[0, 5], [1, 5], [2, 5], [3, 4], [4, 4], [5, 3], [6, 3], [7, 2], [8, 1]];
  for (const [ri, n] of rows) {
    const y = 120 + ri * 30;
    const span = (n - 1) * 30;
    for (let k = 0; k < n; k++) {
      const x = 150 - span / 2 + k * 30 + (r() - 0.5) * 8 + (ri % 2 ? 6 : -4);
      berries.push({ x, y: y + (r() - 0.5) * 8, rr: 19 + r() * 3, d: r() });
    }
  }
  // second (front) layer, slightly offset
  const front = berries.filter((_, i) => i % 2 === 0).map((q) => ({ x: q.x + 13, y: q.y + 14, rr: q.rr * 0.97, d: 1 + q.d }));
  const all = [...berries.map((q) => ({ ...q, d: q.d * 0.5 })), ...front].sort((a, c) => a.y - c.y || a.d - c.d);
  const berry = (q) => `<g><circle cx="${q.x.toFixed(1)}" cy="${q.y.toFixed(1)}" r="${q.rr.toFixed(1)}" fill="url(#${b})"/><circle cx="${q.x.toFixed(1)}" cy="${q.y.toFixed(1)}" r="${q.rr.toFixed(1)}" fill="url(#${bl})"/><ellipse cx="${(q.x - q.rr * 0.35).toFixed(1)}" cy="${(q.y - q.rr * 0.42).toFixed(1)}" rx="${(q.rr * 0.28).toFixed(1)}" ry="${(q.rr * 0.18).toFixed(1)}" fill="#fff" opacity="${kind === 'red' ? 0.55 : 0.75}" transform="rotate(-30 ${(q.x - q.rr * 0.35).toFixed(1)} ${(q.y - q.rr * 0.42).toFixed(1)})"/></g>`;
  return svg('0 0 300 440', w, `
  <defs>
    ${rad(b, [[0, P.hi], [0.45, P.mid], [1, P.lo]], 0.36, 0.32, 0.72)}
    ${rad(bl, [[0.6, P.bloom, 0], [1, P.bloom, kind === 'red' ? 0.35 : 0.18]], 0.5, 0.5, 0.5)}
    ${lin(stem, [[0, '#7a5a34'], [1, '#4a3420']])}
  </defs>
  ${shadow(160, 425, 70, 8, 0.25, 7)}
  ${leafOn ? leaf(214, 92, 74, 0.5) : ''}
  <path d="M150 112 C150 80 160 52 182 22" stroke="url(#${stem})" stroke-width="9" stroke-linecap="round" fill="none"/>
  <path d="M182 22 C188 12 200 8 210 10" stroke="#4a3420" stroke-width="6" stroke-linecap="round" fill="none"/>
  <path d="M150 112 C150 200 150 300 155 380" stroke="#5a4028" stroke-width="4" fill="none" opacity=".6"/>
  ${all.map(berry).join('')}`);
}

/* ------------------------------------------------------------------ bottles */
function bottle(w = 140, { rot = 0, glassCol = 'green', foil = 'gold', label = true, crown = false, lees = false, leesSide = false } = {}) {
  const gc = { green: ['#0e1f12', '#2d4a2a', '#4e6e44'], dark: ['#0b0a08', '#2a2420', '#4a423a'] }[glassCol];
  const gb = uid('gb'), fo = uid('fo'), lb = uid('lb');
  const fc = foil === 'gold' ? ['#8a6418', '#e7c15d', '#fff0b8'] : ['#4a0c1e', '#8c1d40', '#c95a78'];
  return svg('0 0 160 520', w, `
  <defs>
    ${lin(gb, [[0, gc[0]], [0.22, gc[2]], [0.34, gc[1]], [0.75, gc[0]], [1, gc[1]]])}
    ${lin(fo, [[0, fc[0]], [0.35, fc[2]], [0.6, fc[1]], [1, fc[0]]])}
    ${lin(lb, [[0, '#e9dfcc'], [0.3, '#fffaf0'], [1, '#d8ccb4']])}
  </defs>
  ${rot ? '' : shadow(84, 506, 64, 8, 0.35, 6)}
  <g transform="rotate(${rot} 80 260)">
  <path d="M64 20 L96 20 L97 140 C98 175 132 196 134 236 L134 482 C134 494 124 500 112 500 L48 500 C36 500 26 494 26 482 L26 236 C28 196 62 175 63 140 Z" fill="url(#${gb})"/>
  ${leesSide ? '<path d="M27 250 C33 300 33 420 29 484 C30 492 34 496 40 498 L40 494 C36 470 38 330 40 250 Z" fill="#e2cf9c" opacity=".95"/><path d="M33 262 C37 330 36 440 35 490" stroke="#fff6dc" stroke-width="2" opacity=".6"/>' : ''}
  ${lees ? '<path d="M30 470 C60 486 100 486 130 470 L130 482 C130 492 122 498 112 498 L48 498 C38 498 30 492 30 482Z" fill="#d9c79a" opacity=".85"/>' : ''}
  ${crown ? `<rect x="60" y="10" width="40" height="22" rx="4" fill="#b9b4ac"/><rect x="60" y="10" width="40" height="8" rx="3" fill="#e6e2dc"/>${Array.from({ length: 7 }, (_, i) => `<rect x="${62 + i * 5.4}" y="22" width="2.4" height="10" fill="#8a857c"/>`).join('')}`
    : `<path d="M60 14 L100 14 L101 150 C101 162 59 162 59 150 Z" fill="url(#${fo})"/><path d="M60 128 L100 128" stroke="${fc[0]}" stroke-width="3" opacity=".6"/><ellipse cx="80" cy="14" rx="20" ry="5" fill="${fc[1]}"/>`}
  ${label ? `<rect x="34" y="300" width="92" height="128" rx="6" fill="url(#${lb})"/><rect x="40" y="306" width="80" height="116" rx="3" fill="none" stroke="#b08a2e" stroke-width="2"/>
  <rect x="52" y="330" width="56" height="7" rx="3" fill="#6e1532" opacity=".85"/><rect x="58" y="348" width="44" height="4" rx="2" fill="#8a7a6a"/><rect x="54" y="360" width="52" height="4" rx="2" fill="#8a7a6a"/><path d="M62 392 C72 384 88 384 98 392" stroke="#b08a2e" stroke-width="2.5" fill="none"/>` : ''}
  <path d="M40 240 C40 300 40 400 42 480" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".22"/>
  <path d="M70 40 L70 140" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".25"/>
  </g>`);
}

/* ------------------------------------------------------------------ riddling rack (pupitre) */
function pupitre(w = 420) {
  const wd = uid('wd'), hole = uid('ho'), gb = uid('gb');
  const holes = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
    const x = 70 + c * 80, y = 70 + r * 88;
    holes.push(`<ellipse cx="${x}" cy="${y}" rx="26" ry="30" fill="url(#${hole})"/><circle cx="${x}" cy="${y + 4}" r="18" fill="url(#${gb})"/><circle cx="${x}" cy="${y + 4}" r="8" fill="#0b160c" opacity=".7"/><path d="M${x - 10} ${y - 6} a14 14 0 0 1 12 -6" stroke="#fff" stroke-width="2.5" opacity=".35" fill="none"/>`);
  }
  return svg('0 0 400 460', w, `
  <defs>
    ${lin(wd, [[0, '#a8743e'], [0.5, '#c89660'], [1, '#8a5a2c']])}
    ${rad(hole, [[0, '#2a1608'], [1, '#4a2a12']])}
    ${rad(gb, [[0, '#4e6e44'], [0.7, '#1e3420'], [1, '#0e1f12']], 0.4, 0.35, 0.6)}
  </defs>
  ${shadow(200, 448, 190, 10, 0.3, 8)}
  <path d="M10 448 L40 20 L360 20 L390 448" fill="none" stroke="#6e4620" stroke-width="10"/>
  <rect x="30" y="20" width="340" height="380" rx="8" fill="url(#${wd})"/>
  ${Array.from({ length: 9 }, (_, i) => `<path d="M30 ${44 + i * 42} C130 ${40 + i * 42} 260 ${50 + i * 42} 370 ${44 + i * 42}" stroke="#7a4e24" stroke-width="1.6" opacity=".35" fill="none"/>`).join('')}
  ${holes.join('')}
  <rect x="30" y="20" width="340" height="380" rx="8" fill="none" stroke="#6e4620" stroke-width="4"/>`);
}

/* ------------------------------------------------------------------ oak barrel (side) and barrel heads (solera) */
function barrel(w = 300) {
  const st = uid('st'), hp = uid('hp');
  return svg('0 0 300 300', w, `
  <defs>
    ${lin(st, [[0, '#5a3214'], [0.2, '#9a6030'], [0.45, '#c88a4c'], [0.7, '#9a6030'], [1, '#4a2810']])}
    ${lin(hp, [[0, '#2a2a2a'], [0.4, '#6a6a66'], [0.55, '#9a9a94'], [1, '#2a2a2a']])}
  </defs>
  ${shadow(150, 286, 120, 10, 0.35, 7)}
  <path d="M60 20 C30 90 30 210 60 280 L240 280 C270 210 270 90 240 20 Z" fill="url(#${st})"/>
  ${[90, 120, 150, 180, 210].map((x) => `<path d="M${x} 20 C${x + (x - 150) * 0.12} 100 ${x + (x - 150) * 0.12} 200 ${x} 280" stroke="#4a2810" stroke-width="2" opacity=".45" fill="none"/>`).join('')}
  ${[44, 96, 204, 256].map((y) => `<path d="M${y < 150 ? 52 - (96 - y) * 0.05 : 48} ${y} C120 ${y + 6} 180 ${y + 6} ${y < 150 ? 248 : 252} ${y}" stroke="url(#${hp})" stroke-width="12" fill="none"/>`).join('')}
  <ellipse cx="150" cy="150" rx="10" ry="7" fill="#3a1e0a"/>`);
}
function barrelHead(x, y, R, id) {
  return `<g><circle cx="${x}" cy="${y}" r="${R}" fill="url(#${id}h)"/>
  ${[0.8, 0.6, 0.4].map((k) => `<circle cx="${x}" cy="${y}" r="${(R * k).toFixed(1)}" fill="none" stroke="#6a3c18" stroke-width="1.5" opacity=".4"/>`).join('')}
  ${[-0.5, 0, 0.5].map((k) => `<path d="M${(x + R * k).toFixed(1)} ${(y - Math.sqrt(1 - k * k) * R * 0.92).toFixed(1)} L${(x + R * k).toFixed(1)} ${(y + Math.sqrt(1 - k * k) * R * 0.92).toFixed(1)}" stroke="#6a3c18" stroke-width="1.6" opacity=".5"/>`).join('')}
  <circle cx="${x}" cy="${y}" r="${R}" fill="none" stroke="url(#${id}r)" stroke-width="${(R * 0.14).toFixed(1)}"/>
  <circle cx="${x}" cy="${y}" r="${(R * 1.07).toFixed(1)}" fill="none" stroke="#2a2a28" stroke-width="${(R * 0.06).toFixed(1)}"/></g>`;
}
// stacked sherry butts (solera): rows of barrel heads, oldest at the bottom
function solera(w = 420, { label = false } = {}) {
  const id = uid('so');
  const R = 58;
  const rows = [[3, 370], [3, 238], [3, 106]];
  const beams = rows.map(([, y]) => `<rect x="10" y="${y + R + 4}" width="400" height="14" rx="3" fill="#4a2c16"/><rect x="10" y="${y + R + 4}" width="400" height="4" rx="2" fill="#7a5030"/>`).join('');
  const heads = rows.map(([n, y]) => Array.from({ length: n }, (_, i) => barrelHead(80 + i * 130, y, R, id) + `<circle cx="${80 + i * 130}" cy="${y - R * 0.55}" r="5" fill="#3a1e0a"/>`).join('')).join('') + beams;
  const chalk = label ? [['SOLERA', 380], ['1st CRIADERA', 254], ['2nd CRIADERA', 128]].map(([t, y]) => `<text x="210" y="${y + R + 30}" font-family="DM Sans" font-weight="800" font-size="20" letter-spacing="3" fill="#f6efe0" text-anchor="middle" opacity=".95">${t}</text>`).join('') : '';
  return svg('0 0 420 480', w, `
  <defs>
    ${rad(id + 'h', [[0, '#d9a066'], [0.7, '#a8693a'], [1, '#7a4620']], 0.42, 0.38, 0.65)}
    ${lin(id + 'r', [[0, '#5a3a20'], [0.5, '#8a5a30'], [1, '#4a2a12']], 0, 0, 0, 1)}
  </defs>
  ${shadow(210, 466, 200, 10, 0.35, 8)}
  ${heads}${chalk}`);
}

/* ------------------------------------------------------------------ beer */
const BEER = {
  straw: ['#e9b93a', '#f7d86a', '#fff2b0'],
  gold: ['#d8961c', '#f0bd3c', '#ffe08a'],
  amber: ['#9a4a0c', '#c8701c', '#eaa04a'],
  copper: ['#6a2a08', '#9a4a14', '#c8742e'],
  brown: ['#3a1406', '#5e2410', '#8a4020'],
  black: ['#0c0403', '#1e0906', '#4a1a0c'],
  hazy: ['#e8c25a', '#f3dc8e', '#fff4c8'],
};
function beerGlass(w = 220, col = 'gold', { shape = 'pint', seed = 5 } = {}) {
  const [c0, c1, c2] = BEER[col] || BEER.gold;
  const head = col === 'black' || col === 'brown' ? ['#d9b98a', '#efdcbc', '#fbf1e0'] : ['#e9e0cc', '#f7f1e4', '#ffffff'];
  const L = uid('L'), G = uid('G'), H = uid('H'), Hz = uid('Hz');
  const r = rnd(seed);
  const shapes = {
    // body path (outside), liquid path, foam top y, rim width
    pint: { vb: '0 0 240 420', body: 'M38 40 L46 120 C40 140 46 160 50 190 L64 386 C65 398 74 404 86 404 L154 404 C166 404 175 398 176 386 L190 190 C194 160 200 140 194 120 L202 40 Z', liq: 'M44 96 L48 120 C42 140 48 160 52 190 L66 372 L174 372 L188 190 C192 160 198 140 192 120 L196 96 Z', foamTop: 40, foamBot: 98, x0: 38, x1: 202, base: [66, 372, 174, 402] },
    goblet: { vb: '0 0 240 400', body: 'M22 60 C22 150 60 200 120 204 C180 200 218 150 218 60 Z', liq: 'M25 104 C28 160 64 198 120 200 C176 198 212 160 215 104 Z', foamTop: 60, foamBot: 106, x0: 22, x1: 218, stem: true },
    weizen: { vb: '0 0 240 480', body: 'M60 30 C50 90 64 150 74 200 C84 250 70 330 76 446 C77 458 86 464 96 464 L144 464 C154 464 163 458 164 446 C170 330 156 250 166 200 C176 150 190 90 180 30 Z', liq: 'M58 86 C56 120 66 160 76 200 C86 250 72 330 78 434 L162 434 C168 330 154 250 164 200 C174 160 184 120 182 86 Z', foamTop: 30, foamBot: 88, x0: 60, x1: 180, base: [78, 434, 162, 462] },
  };
  const S = shapes[shape];
  const cx = (S.x0 + S.x1) / 2;
  const fw = (S.x1 - S.x0) / 2;
  // foam: a creamy dome rising just above the rim, lumpy top contour, fine bubbles
  const nL = 10, step = (S.x1 - S.x0) / nL;
  let top = `M${S.x0 + 2} ${S.foamBot}`;
  top += ` L${S.x0 + 1} ${S.foamTop + 8}`;
  for (let i = 0; i < nL; i++) { const xa = S.x0 + i * step, xb = xa + step; const m = Math.pow(Math.sin(Math.PI * (i + 0.5) / nL), 0.6); const base = S.foamTop - 4 - 18 * Math.pow(Math.sin(Math.PI * (i + 1) / nL), 0.8); const h = (14 + r() * 10) * m; top += ` C${(xa + step * 0.05).toFixed(1)} ${(base - h * 1.3).toFixed(1)} ${(xb - step * 0.05).toFixed(1)} ${(base - h * 1.3).toFixed(1)} ${xb.toFixed(1)} ${(i === nL - 1 ? S.foamTop + 6 : base).toFixed(1)}`; }
  top += ` L${S.x1 - 2} ${S.foamBot} Z`;
  const foamBubbles = Array.from({ length: 90 }, () => {
    const x = S.x0 + 8 + r() * (S.x1 - S.x0 - 16);
    const y = S.foamTop - 14 + r() * (S.foamBot - S.foamTop + 8);
    const rr = 1 + r() * 3.2;
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr.toFixed(1)}" fill="${head[0]}" opacity="${(0.25 + r() * 0.35).toFixed(2)}"/><circle cx="${(x - rr * 0.3).toFixed(1)}" cy="${(y - rr * 0.3).toFixed(1)}" r="${(rr * 0.45).toFixed(1)}" fill="#fff" opacity=".8"/>`;
  }).join('');
  const lumps = '';
  const liqTop = S.foamBot - 2;
  const liqBottom = S.base ? S.base[1] : 196;
  const bubbles = Array.from({ length: col === 'black' ? 10 : 40 }, () => { const x = cx + (r() - 0.5) * fw * 1.2; const y = liqTop + 20 + r() * (liqBottom - liqTop - 40); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(1 + r() * 2).toFixed(1)}" fill="${c2}" opacity="${(0.5 + r() * 0.5).toFixed(2)}"/>`; }).join('');
  // chalice: thick short stem with a knop and a heavy foot (Belgian-style beer chalice, not a wine glass)
  const H2 = S.stem ? `<path d="M104 203 C108 220 110 236 108 252 C100 258 100 270 108 276 C110 300 104 320 92 336 L148 336 C136 320 130 300 132 276 C140 270 140 258 132 252 C130 236 132 220 136 203 Z" fill="#efe9e2" opacity=".85" stroke="#7d6b72" stroke-opacity=".3" stroke-width="1.5"/><path d="M48 346 C60 334 180 334 192 346 C192 356 48 356 48 346Z" fill="#f4efe9" stroke="#7d6b72" stroke-opacity=".35" stroke-width="1.6"/><ellipse cx="100" cy="341" rx="28" ry="3" fill="#fff"/><path d="M112 210 L114 330" stroke="#fff" stroke-width="3" opacity=".7"/>` : '';
  const ground = S.stem ? 360 : (S.base ? S.base[3] + 8 : 410);
  return svg(S.vb, w, `
  <defs>
    ${lin(L, [[0, c0], [0.3, c1], [0.55, c2], [0.8, c1], [1, c0]])}
    ${lin(G, [[0, '#ffffff', 0.5], [0.25, '#ffffff', 0.06], [0.75, '#ffffff', 0.04], [1, '#ffffff', 0.32]])}
    ${lin(H, [[0, head[2]], [0.6, head[1]], [1, head[0]]], 0, 0, 0, 1)}
    ${lin(Hz, [[0, '#ffffff', 0.0], [0.5, '#ffffff', col === 'hazy' ? 0.28 : 0], [1, '#ffffff', 0]], 0, 0, 0, 1)}
  </defs>
  ${shadow(cx + 8, ground, fw * 0.95, 9, 0.32, 7)}
  <path d="${S.liq}" fill="url(#${L})"/>
  <path d="${S.liq}" fill="url(#${Hz})"/>
  ${bubbles}
  ${S.base ? `<path d="M${S.base[0]} ${S.base[1]} L${S.base[2]} ${S.base[1]} L${S.base[2] + 1} ${S.base[3]} L${S.base[0] - 1} ${S.base[3]}Z" fill="#ffffff" opacity=".28"/><path d="M${S.base[0]} ${S.base[1]} L${S.base[2]} ${S.base[1]}" stroke="${c0}" stroke-width="3" opacity=".5"/>` : ''}
  <path d="${top}" fill="url(#${H})" stroke="${head[0]}" stroke-width="1.6" stroke-opacity=".8"/>
  ${foamBubbles}
  <path d="M${S.x0 + 6} ${S.foamBot} C${cx - fw * 0.4} ${S.foamBot + 6} ${cx + fw * 0.4} ${S.foamBot + 6} ${S.x1 - 6} ${S.foamBot}" stroke="${head[0]}" stroke-width="3" fill="none" opacity=".7"/>
  <path d="${S.body}" fill="url(#${G})" stroke="#7d6b72" stroke-opacity=".35" stroke-width="2"/>
  <path d="M${S.x0 + 14} ${S.foamBot + 20} C${S.x0 + 18} ${S.foamBot + 120} ${S.x0 + 26} ${liqBottom - 120} ${S.x0 + 32} ${liqBottom - 20}" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".45"/>
  <path d="M${S.x1 - 16} ${S.foamBot + 30} C${S.x1 - 18} ${S.foamBot + 60} ${S.x1 - 22} ${S.foamBot + 90} ${S.x1 - (S.stem ? 40 : 26)} ${S.foamBot + (S.stem ? 100 : 200)}" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".35"/>
  ${H2}`);
}

function hop(w = 200, seed = 2) {
  const id = uid('hp');
  const r = rnd(seed);
  const bracts = [];
  for (let row = 0; row < 8; row++) {
    const y = 70 + row * 26;
    const half = 52 - Math.abs(row - 3) * 7 - (row > 5 ? 10 : 0);
    const n = 3;
    for (let k = 0; k < n; k++) {
      const x = 100 - half + (k + 0.5) * ((half * 2) / n) + (row % 2 ? 8 : -8) + (r() - 0.5) * 4;
      bracts.push(`<path d="M${x.toFixed(1)} ${(y - 26).toFixed(1)} C${(x + 26).toFixed(1)} ${(y - 18).toFixed(1)} ${(x + 22).toFixed(1)} ${(y + 18).toFixed(1)} ${x.toFixed(1)} ${(y + 26).toFixed(1)} C${(x - 22).toFixed(1)} ${(y + 18).toFixed(1)} ${(x - 26).toFixed(1)} ${(y - 18).toFixed(1)} ${x.toFixed(1)} ${(y - 26).toFixed(1)}Z" fill="url(#${id})" stroke="#4f7a2a" stroke-width="1.4" stroke-opacity=".7"/><path d="M${x.toFixed(1)} ${(y - 14).toFixed(1)} L${x.toFixed(1)} ${(y + 18).toFixed(1)}" stroke="#8fb455" stroke-width="1.4" opacity=".6"/>`);
    }
  }
  return svg('0 0 200 320', w, `
  <defs>${rad(id, [[0, '#e6f0b0'], [0.6, '#a9c95e'], [1, '#6e9a36']], 0.4, 0.3, 0.75)}</defs>
  ${shadow(104, 306, 50, 6, 0.25, 6)}
  <path d="M100 44 C100 30 106 16 120 6" stroke="#5a7a30" stroke-width="5" fill="none" stroke-linecap="round"/>
  ${leaf(150, 40, 40, 1.1)}
  ${bracts.join('')}`);
}

function barley(w = 120, seed = 4) {
  const id = uid('ba');
  const r = rnd(seed);
  const grains = [];
  for (let i = 0; i < 9; i++) {
    const y = 60 + i * 26;
    for (const s of [-1, 1]) {
      const x = 60 + s * 13;
      grains.push(`<path d="M${x} ${y - 10} L${x + s * (40 + r() * 10)} ${y - 120 - r() * 30}" stroke="#d6b469" stroke-width="1.6" opacity=".9"/><ellipse cx="${x}" cy="${y}" rx="11" ry="20" transform="rotate(${s * 22} ${x} ${y})" fill="url(#${id})" stroke="#a8782a" stroke-width="1.2"/><path d="M${x} ${y - 12} L${x} ${y + 12}" transform="rotate(${s * 22} ${x} ${y})" stroke="#b88a36" stroke-width="1.2" opacity=".7"/>`);
    }
  }
  return svg('0 0 120 520', w, `
  <defs>${rad(id, [[0, '#fff2c4'], [0.55, '#ebc979'], [1, '#c39642']], 0.4, 0.3, 0.75)}</defs>
  <path d="M60 300 C60 380 58 450 54 515" stroke="#c8a456" stroke-width="5" fill="none"/>
  <path d="M60 40 L60 300" stroke="#b8923e" stroke-width="3"/>
  ${grains.join('')}`);
}

/* ------------------------------------------------------------------ sake */
function tokkuri(w = 300) {
  const c = uid('cr'), sh = uid('cs'), cup = uid('cu'), sk = uid('sk');
  return svg('0 0 420 460', w, `
  <defs>
    ${lin(c, [[0, '#cfc8bd'], [0.25, '#fbf8f2'], [0.5, '#efe9df'], [1, '#b7ad9f']])}
    ${rad(sh, [[0, '#ffffff', 0.85], [1, '#ffffff', 0]], 0.3, 0.3, 0.5)}
    ${lin(cup, [[0, '#d6cfc4'], [0.3, '#fffdf8'], [1, '#c4baab']])}
    ${rad(sk, [[0, '#fdfbf0'], [1, '#e8e3c8']])}
  </defs>
  ${shadow(200, 444, 180, 12, 0.32, 8)}
  <!-- flask -->
  <path d="M132 30 L188 30 L186 52 C186 70 196 84 210 104 C246 154 280 210 280 288 C280 380 230 436 160 436 C90 436 40 380 40 288 C40 210 74 154 110 104 C124 84 134 70 134 52 Z" fill="url(#${c})"/>
  <path d="M132 30 L188 30 L186 52 C186 70 196 84 210 104 C246 154 280 210 280 288 C280 380 230 436 160 436 C90 436 40 380 40 288 C40 210 74 154 110 104 C124 84 134 70 134 52 Z" fill="url(#${sh})"/>
  <ellipse cx="160" cy="30" rx="30" ry="7" fill="#e9e3d8" stroke="#a89e90" stroke-width="2"/>
  <ellipse cx="160" cy="30" rx="18" ry="4" fill="#6a6258"/>
  <path d="M52 250 C110 272 210 272 268 250 L272 274 C210 298 110 298 48 274 Z" fill="#2e3a8a" opacity=".88"/>
  <path d="M58 300 C112 318 208 318 262 300" stroke="#2e3a8a" stroke-width="4" fill="none" opacity=".6"/>
  <path d="M80 160 C66 200 60 250 64 300" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".55" fill="none"/>
  <path d="M42 300 C44 370 90 430 160 434" stroke="#8a8072" stroke-width="2" fill="none" opacity=".5"/>
  <!-- cup (ochoko) with janome rings -->
  <path d="M290 330 L400 330 C398 380 384 412 345 414 C306 412 292 380 290 330 Z" fill="url(#${cup})"/>
  <ellipse cx="345" cy="330" rx="55" ry="15" fill="url(#${sk})" stroke="#b9ae9e" stroke-width="2"/>
  <ellipse cx="345" cy="332" rx="34" ry="8.5" fill="none" stroke="#2e3a8a" stroke-width="4" opacity=".75"/>
  <ellipse cx="345" cy="332" rx="16" ry="4" fill="none" stroke="#2e3a8a" stroke-width="4" opacity=".75"/>
  <path d="M300 344 C302 376 314 398 334 406" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".6" fill="none"/>`);
}

// rice grain with optional polished core: ratio = fraction remaining (1 = brown/unpolished)
function grain(w = 240, ratio = 1) {
  const sh = uid('gs'), co = uid('gc'), hl = uid('gh');
  const k = Math.sqrt(ratio);
  const grainPath = (s) => { const rx = 70 * s, ry = 118 * s; return `M150 ${150 - ry} C${150 + rx * 1.15} ${150 - ry} ${150 + rx * 1.05} ${150 + ry * 0.9} 150 ${150 + ry} C${150 - rx * 1.05} ${150 + ry * 0.9} ${150 - rx * 1.2} ${150 - ry * 0.6} ${150 - rx * 0.55} ${150 - ry * 0.92} C${150 - rx * 0.35} ${150 - ry * 1.0} ${150 - rx * 0.1} ${150 - ry} 150 ${150 - ry} Z`; };
  return svg('0 0 300 300', w, `
  <defs>
    ${rad(sh, [[0, '#f3e6c6'], [0.7, '#dcc596'], [1, '#b99a62']], 0.4, 0.35, 0.7)}
    ${rad(co, [[0, '#ffffff'], [0.6, '#f6f3ec'], [1, '#d9d3c6']], 0.4, 0.35, 0.7)}
    ${rad(hl, [[0, '#ffffff', 0.95], [1, '#ffffff', 0]])}
  </defs>
  ${shadow(156, 284, 66 * Math.max(k, 0.6), 6, 0.25, 5)}
  ${ratio < 1 ? `<path d="${grainPath(1)}" fill="url(#${sh})" opacity=".35" stroke="#b99a62" stroke-width="2.5" stroke-dasharray="3 7" stroke-linecap="round"/>` : ''}
  <path d="${grainPath(k)}" fill="url(#${ratio < 1 ? co : sh})" stroke="${ratio < 1 ? '#c9c0ae' : '#a88a52'}" stroke-width="2"/>
  <ellipse cx="${150 - 22 * k}" cy="${150 - 45 * k}" rx="${16 * k}" ry="${34 * k}" fill="url(#${hl})" transform="rotate(12 ${150 - 22 * k} ${150 - 45 * k})"/>
  <path d="M${150 + 30 * k} ${150 - 60 * k} C${150 + 40 * k} ${150} ${150 + 36 * k} ${150 + 50 * k} ${150 + 20 * k} ${150 + 90 * k}" stroke="#000" stroke-opacity=".06" stroke-width="${8 * k}" fill="none"/>`);
}

/* ------------------------------------------------------------------ spirits */
function glencairn(w = 180, col = 'amber') {
  const C = { amber: ['#7a3a0a', '#c0701e', '#f0b050'], gold: ['#a8701a', '#e0a840', '#f8d48a'], clear: ['#d8dee0', '#eef2f2', '#ffffff'] }[col];
  const g = uid('g'), l = uid('l');
  return svg('0 0 200 360', w, `
  <defs>
    ${lin(g, [[0, '#ffffff', 0.5], [0.3, '#ffffff', 0.06], [1, '#ffffff', 0.32]])}
    ${lin(l, [[0, C[0]], [0.5, C[2]], [1, C[0]]])}
  </defs>
  ${shadow(106, 344, 66, 8, 0.32, 6)}
  <path d="M38 180 C38 220 62 250 100 250 C138 250 162 220 162 180 C162 170 160 164 158 160 L42 160 C40 164 38 170 38 180Z" fill="url(#${l})"/>
  <ellipse cx="100" cy="160" rx="58" ry="7" fill="${C[2]}" opacity=".9"/>
  <path d="M70 20 C70 70 34 120 34 180 C34 228 62 254 100 254 C138 254 166 228 166 180 C166 120 130 70 130 20 Z" fill="url(#${g})" stroke="#7d6b72" stroke-opacity=".38" stroke-width="2.2"/>
  <ellipse cx="100" cy="20" rx="30" ry="5" fill="none" stroke="#7d6b72" stroke-opacity=".4" stroke-width="2"/>
  <path d="M86 254 L84 300 L116 300 L114 254" fill="#f1ece6" stroke="#7d6b72" stroke-opacity=".3" stroke-width="1.5"/>
  <path d="M40 300 L160 300 L156 322 C154 330 148 334 140 334 L60 334 C52 334 46 330 44 322Z" fill="#f4efe9" stroke="#7d6b72" stroke-opacity=".35" stroke-width="1.8"/>
  <path d="M52 140 C42 170 44 210 64 236" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".8"/>
  <path d="M60 306 L120 306" stroke="#fff" stroke-width="3" opacity=".8"/>`);
}

function whiskyBottle(w = 150) {
  const gb = uid('gb'), lq = uid('lq'), lb = uid('lb');
  return svg('0 0 180 500', w, `
  <defs>
    ${lin(gb, [[0, '#ffffff', 0.35], [0.2, '#ffffff', 0.05], [0.8, '#ffffff', 0.04], [1, '#ffffff', 0.25]])}
    ${lin(lq, [[0, '#6a2e06'], [0.3, '#c0701e'], [0.55, '#e8a24a'], [1, '#6a2e06']])}
    ${lin(lb, [[0, '#e9dfcc'], [0.3, '#fffaf0'], [1, '#d8ccb4']])}
  </defs>
  ${shadow(94, 486, 74, 8, 0.35, 6)}
  <path d="M74 76 L106 76 L106 120 C106 140 152 150 152 186 L152 466 C152 476 144 482 134 482 L46 482 C36 482 28 476 28 466 L28 186 C28 150 74 140 74 120 Z" fill="url(#${lq})"/>
  <rect x="70" y="20" width="40" height="60" rx="6" fill="#3a1a0a"/><rect x="70" y="20" width="40" height="14" rx="5" fill="#5a2e14"/>
  <path d="M74 76 L106 76 L106 120 C106 140 152 150 152 186 L152 466 C152 476 144 482 134 482 L46 482 C36 482 28 476 28 466 L28 186 C28 150 74 140 74 120 Z" fill="url(#${gb})" stroke="#5a2e10" stroke-opacity=".4" stroke-width="2"/>
  <rect x="38" y="260" width="104" height="140" rx="6" fill="url(#${lb})"/>
  <rect x="45" y="267" width="90" height="126" rx="3" fill="none" stroke="#8a5a20" stroke-width="2"/>
  <rect x="58" y="292" width="64" height="8" rx="3" fill="#3e0f22" opacity=".85"/><rect x="64" y="312" width="52" height="4" rx="2" fill="#8a7a6a"/><rect x="60" y="324" width="60" height="4" rx="2" fill="#8a7a6a"/>
  <path d="M72 352 C84 344 96 344 108 352" stroke="#8a5a20" stroke-width="2.5" fill="none"/>
  <path d="M40 196 L40 460" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".35"/>`);
}

function potStill(w = 360) {
  const cu = uid('cu'), cu2 = uid('cv');
  return svg('0 0 440 420', w, `
  <defs>
    ${lin(cu, [[0, '#5a2408'], [0.18, '#b4582a'], [0.35, '#f0a070'], [0.5, '#c8683a'], [0.8, '#7a3412'], [1, '#4a1a06']])}
    ${lin(cu2, [[0, '#7a3412'], [0.5, '#e8946a'], [1, '#7a3412']], 0, 0, 0, 1)}
  </defs>
  ${shadow(170, 404, 160, 12, 0.35, 8)}
  <rect x="40" y="340" width="260" height="56" rx="8" fill="#6a5a52"/><rect x="40" y="340" width="260" height="10" fill="#8a7a72"/>
  ${Array.from({ length: 6 }, (_, i) => `<rect x="${52 + i * 42}" y="356" width="30" height="34" rx="3" fill="#4a3c36"/>`).join('')}
  <path d="M60 340 C40 260 60 170 170 160 C280 170 300 260 280 340 Z" fill="url(#${cu})"/>
  <path d="M124 166 C120 120 150 96 170 96 C190 96 220 120 216 166 Z" fill="url(#${cu})"/>
  <path d="M152 100 C150 60 166 34 200 26 L360 40" stroke="url(#${cu2})" stroke-width="22" fill="none" stroke-linecap="round"/>
  <path d="M152 100 C150 60 166 34 200 26 L360 40" stroke="#ffd2b0" stroke-width="4" fill="none" opacity=".5" transform="translate(-4 -6)"/>
  <path d="M330 120 L420 120 L414 396 L336 396 Z" fill="url(#${uid('x')})" style="fill:#8a5a30"/><path d="M330 120 L420 120 L414 396 L336 396 Z" fill="none" stroke="#4a2a12" stroke-width="2"/>
  ${[340, 356, 372, 388, 404].map((x) => `<path d="M${x} 122 L${x - (x - 375) * 0.07} 394" stroke="#5a3418" stroke-width="2" opacity=".5"/>`).join('')}
  ${[150, 260, 370].map((y) => `<path d="M330 ${y} L420 ${y}" stroke="#3a3a38" stroke-width="9"/>`).join('')}
  <ellipse cx="375" cy="120" rx="45" ry="9" fill="#3e2a18"/><path d="M360 40 C374 44 378 70 376 118" stroke="url(#${cu2})" stroke-width="18" fill="none"/>
  <path d="M414 360 L436 360 L436 380" stroke="#b4582a" stroke-width="8" fill="none"/>
  ${[200, 250, 300].map((y) => `<path d="M${70 + (y - 200) * 0.05} ${y} C130 ${y + 8} 210 ${y + 8} ${270 - (y - 200) * 0.05} ${y}" stroke="#5a2408" stroke-width="2" opacity=".35" fill="none"/>`).join('')}
  ${Array.from({ length: 9 }, (_, i) => `<circle cx="${82 + i * 22}" cy="${330}" r="3" fill="#ffd2b0" opacity=".6"/>`).join('')}
  <path d="M92 210 C80 240 80 290 90 330" stroke="#ffe0c8" stroke-width="12" stroke-linecap="round" opacity=".45" fill="none"/>`);
}

function agave(w = 320, seed = 9) {
  const id = uid('ag'), id2 = uid('ah');
  const r = rnd(seed);
  const leaves = [];
  const set = [[-78, 0.62], [78, 0.62], [-60, 0.85], [60, 0.85], [-40, 1.0], [40, 1.0], [-20, 1.1], [20, 1.1], [0, 1.18], [-50, 0.7], [50, 0.7], [-10, 0.8], [10, 0.8]];
  for (const [a, s] of set) {
    const L = 230 * s, W = 26 + s * 6;
    const spines = Array.from({ length: 6 }, (_, i) => { const t = 0.2 + i * 0.12; const y = -L * t; const x = W * (1 - t) * 0.95; return `<path d="M${x.toFixed(1)} ${y.toFixed(1)} l6 -5 M${(-x).toFixed(1)} ${y.toFixed(1)} l-6 -5" stroke="#5a3a1a" stroke-width="1.6"/>`; }).join('');
    leaves.push({ a, s, d: `<g transform="translate(200 330) rotate(${a + (r() - 0.5) * 4})"><path d="M${-W} 0 C${-W} ${-L * 0.4} ${-W * 0.4} ${-L * 0.85} 0 ${-L} C${W * 0.4} ${-L * 0.85} ${W} ${-L * 0.4} ${W} 0 Z" fill="url(#${id})" stroke="#3e6e66" stroke-width="1.5"/><path d="M0 -10 L0 ${-L * 0.92}" stroke="#d4ece6" stroke-width="2.5" opacity=".55"/><path d="M0 ${-L} l0 -14" stroke="#5a3a1a" stroke-width="3"/>${spines}</g>` });
  }
  leaves.sort((p, q) => q.s - p.s || Math.abs(q.a) - Math.abs(p.a));
  return svg('0 0 400 370', w, `
  <defs>
    ${lin(id, [[0, '#4e8a80'], [0.45, '#9cc8bc'], [0.6, '#bfe0d6'], [1, '#4a7e74']])}
    ${rad(id2, [[0, '#a8c49a'], [1, '#5a7a50']])}
  </defs>
  ${shadow(200, 350, 170, 12, 0.32, 8)}
  ${leaves.map((x) => x.d).join('')}`);
}

function pina(w = 220, cooked = false) {
  const id = uid('pi');
  const cols = cooked ? ['#7a3a10', '#c07a32', '#e8ad62'] : ['#a8a878', '#e2dfb8', '#f6f2d8'];
  const r = rnd(11);
  const stubs = [];
  for (let row = 0; row < 5; row++) for (let k = 0; k < 6; k++) {
    const x = 50 + k * 26 + (row % 2) * 13, y = 80 + row * 34;
    if ((x - 110) ** 2 / 90 ** 2 + (y - 150) ** 2 / 100 ** 2 > 0.85) continue;
    stubs.push(`<path d="M${x - 12} ${y + 8} L${x} ${y - 10 - r() * 4} L${x + 12} ${y + 8} Z" fill="${cooked ? '#5a2a0a' : '#6e9a8a'}" opacity=".8"/>`);
  }
  return svg('0 0 220 280', w, `
  <defs>${rad(id, [[0, cols[2]], [0.65, cols[1]], [1, cols[0]]], 0.4, 0.35, 0.7)}</defs>
  ${shadow(114, 266, 86, 9, 0.3, 6)}
  <ellipse cx="110" cy="150" rx="94" ry="108" fill="url(#${id})"/>
  ${stubs.join('')}
  <path d="M80 50 C60 90 52 150 64 210" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".3" fill="none"/>`);
}

/* ------------------------------------------------------------------ helpers */
// several drawings side by side, bottom-aligned
const row = (items, gap = 18) => `<div style="display:flex;gap:${gap}px;align-items:flex-end">${items.join('')}</div>`;

module.exports = { glassPhoto, glass, flute, grapes, bottle, pupitre, barrel, solera, beerGlass, hop, barley, tokkuri, grain, glencairn, whiskyBottle, potStill, agave, pina, row, leaf };
