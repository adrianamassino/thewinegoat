// Line-art SVG illustrations for v2 posts (batch 02+). Subject-specific drawings so that Spirits,
// Sake and Beer posts never use wine imagery. Colours: stroke = burgundy by default, fill = soft tones.
'use strict';
const W = '#8c1d40', D = '#6e1532', CREAM = '#fbf7f1';
const svg = (vb, w, inner, style = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${w}" style="${style}" fill="none" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

const I = {
  // sake flask (tokkuri) + cup (ochoko)
  tokkuri: (w = 360, c = '#3b3f8f') => svg('0 0 360 400', w, `
    <ellipse cx="180" cy="378" rx="150" ry="14" fill="${c}" opacity=".08" stroke="none"/>
    <path d="M150 40 h44 v22 c0 12 6 18 14 30 c30 44 62 80 62 150 c0 72 -42 120 -98 120 c-56 0 -98 -48 -98 -120 c0 -70 32 -106 62 -150 c8 -12 14 -18 14 -30z" fill="#fff" stroke="${c}" stroke-width="7"/>
    <path d="M150 40 h44" stroke="${c}" stroke-width="10"/>
    <path d="M100 236 c40 18 104 18 152 0" stroke="${c}" stroke-width="5" opacity=".55"/>
    <path d="M110 268 c36 14 96 14 134 0" stroke="${c}" stroke-width="5" opacity=".35"/>
    <circle cx="176" cy="300" r="16" stroke="${W}" stroke-width="5" fill="#f6e3e8"/>
    <path d="M262 318 h78 l-10 44 c-2 8 -8 12 -16 12 h-26 c-8 0 -14 -4 -16 -12z" fill="#fff" stroke="${c}" stroke-width="7"/>
    <path d="M270 334 h62" stroke="${c}" stroke-width="4" opacity=".5"/>`),
  // single rice grain, with optional polished core (ratio 0-1)
  grain: (w = 300, ratio = 1, c = '#3b3f8f') => {
    const rx = 70, ry = 120, k = Math.sqrt(ratio);
    return svg('0 0 300 300', w, `
      <ellipse cx="150" cy="150" rx="${rx}" ry="${ry}" fill="#efe6d6" stroke="${c}" stroke-width="5" stroke-dasharray="${ratio < 1 ? '10 10' : '0'}"/>
      <ellipse cx="150" cy="150" rx="${rx * k}" ry="${ry * k}" fill="#fff" stroke="${c}" stroke-width="6"/>
      <ellipse cx="150" cy="${150 + ry * k * 0.15}" rx="${rx * k * 0.55}" ry="${ry * k * 0.55}" fill="${c}" opacity=".10" stroke="none"/>`);
  },
  // beer glass (nonic pint) with foam; colour = beer colour
  beer: (w = 260, beer = '#e2b33c', c = W) => svg('0 0 260 380', w, `
    <ellipse cx="130" cy="366" rx="96" ry="10" fill="${c}" opacity=".08" stroke="none"/>
    <path d="M44 70 l14 270 c1 12 10 20 22 20 h100 c12 0 21 -8 22 -20 l14 -270z" fill="${beer}"/>
    <path d="M40 40 c0 -20 30 -26 44 -16 c10 -18 44 -20 56 -2 c14 -14 46 -8 46 14 c18 0 30 12 30 26 v8 h-176 v-8 c0 -10 0 -18 0 -22z" fill="#fffaf0" stroke="${c}" stroke-width="6"/>
    <path d="M44 70 l14 270 c1 12 10 20 22 20 h100 c12 0 21 -8 22 -20 l14 -270" stroke="${c}" stroke-width="7"/>
    <path d="M58 150 c-8 6 -8 18 0 24" stroke="${c}" stroke-width="6"/>
    <circle cx="110" cy="250" r="5" fill="#fff" opacity=".7" stroke="none"/><circle cx="140" cy="210" r="4" fill="#fff" opacity=".7" stroke="none"/><circle cx="125" cy="300" r="4" fill="#fff" opacity=".7" stroke="none"/><circle cx="160" cy="270" r="3" fill="#fff" opacity=".7" stroke="none"/>`),
  // hop cone
  hop: (w = 200, c = '#4f7a35') => svg('0 0 200 260', w, `
    <path d="M100 10 c0 20 -6 30 -6 30" stroke="${c}" stroke-width="6"/>
    <path d="M96 30 c30 -16 62 -8 78 8 c-24 6 -50 4 -78 -8z" fill="#cfe0b8" stroke="${c}" stroke-width="5"/>
    ${[0, 1, 2, 3, 4].map((r) => { const y = 60 + r * 34, wd = 70 - Math.abs(r - 1.6) * 14; return `<path d="M${100 - wd} ${y} c10 26 ${wd - 10} 40 ${wd} 44 c${10} -4 ${wd - 10} -18 ${wd} -44 c-20 10 -${wd * 2 - 40} 10 -${wd * 2} 0z" fill="#e1edcf" stroke="${c}" stroke-width="5"/>`; }).join('')}`),
  // ear of barley
  barley: (w = 150, c = '#a8722a') => svg('0 0 150 360', w, `
    <path d="M75 350 C75 260 75 200 75 120" stroke="${c}" stroke-width="6"/>
    ${[0, 1, 2, 3, 4, 5].map((i) => { const y = 60 + i * 30; return `<ellipse cx="58" cy="${y}" rx="13" ry="24" transform="rotate(-28 58 ${y})" fill="#f3d58c" stroke="${c}" stroke-width="4"/><ellipse cx="92" cy="${y}" rx="13" ry="24" transform="rotate(28 92 ${y})" fill="#f3d58c" stroke="${c}" stroke-width="4"/><path d="M50 ${y - 20} l-26 -34 M100 ${y - 20} l26 -34" stroke="${c}" stroke-width="3"/>`; }).join('')}
    <ellipse cx="75" cy="40" rx="12" ry="22" fill="#f3d58c" stroke="${c}" stroke-width="4"/><path d="M75 18 v-16" stroke="${c}" stroke-width="3"/>`),
  // copper pot still with swan neck
  potstill: (w = 360, c = '#9a5f1e') => svg('0 0 360 360', w, `
    <ellipse cx="160" cy="344" rx="140" ry="12" fill="${c}" opacity=".1" stroke="none"/>
    <path d="M60 330 c-30 -60 -20 -150 50 -170 c10 -40 70 -40 80 0 c70 20 80 110 50 170z" fill="#f2d2a8" stroke="${c}" stroke-width="7"/>
    <path d="M118 160 c0 -40 64 -40 64 0" fill="#f7e2c4" stroke="${c}" stroke-width="7"/>
    <path d="M150 122 c0 -70 40 -96 110 -90 l60 6" stroke="${c}" stroke-width="12"/>
    <path d="M300 40 v120 c0 10 8 18 18 18 h10 v150 h-50 v-150 h10" stroke="${c}" stroke-width="6" fill="#fff"/>
    <path d="M286 220 c20 10 30 10 40 0 M286 250 c20 10 30 10 40 0 M286 280 c20 10 30 10 40 0" stroke="${c}" stroke-width="4"/>
    <path d="M80 230 h160" stroke="${c}" stroke-width="4" opacity=".5"/><path d="M90 260 h140" stroke="${c}" stroke-width="4" opacity=".35"/>`),
  // whisky bottle + tumbler with ice
  whisky: (w = 340, c = '#9a5f1e') => svg('0 0 340 400', w, `
    <ellipse cx="170" cy="386" rx="150" ry="12" fill="${c}" opacity=".1" stroke="none"/>
    <path d="M80 20 h44 v60 c0 14 34 24 34 54 v230 c0 10 -8 16 -18 16 h-76 c-10 0 -18 -6 -18 -16 v-230 c0 -30 34 -40 34 -54z" fill="#fff" stroke="${c}" stroke-width="7"/>
    <path d="M48 200 v164 c0 10 8 16 18 16 h76 c10 0 18 -6 18 -16 v-164z" fill="#d79a4c" opacity=".75" stroke="none"/>
    <rect x="62" y="210" width="80" height="80" rx="8" fill="${CREAM}" stroke="${c}" stroke-width="5"/>
    <path d="M78 236 h48 M78 254 h48 M84 272 h36" stroke="${c}" stroke-width="4"/>
    <path d="M200 270 h116 l-10 100 c-1 10 -8 14 -18 14 h-60 c-10 0 -17 -4 -18 -14z" fill="#fff" stroke="${c}" stroke-width="7"/>
    <path d="M206 320 h104 l-5 50 c-1 8 -6 12 -14 12 h-66 c-8 0 -13 -4 -14 -12z" fill="#d79a4c" opacity=".75" stroke="none"/>
    <rect x="228" y="300" width="34" height="34" rx="6" transform="rotate(-12 245 317)" fill="#fff" stroke="${c}" stroke-width="4"/>
    <rect x="262" y="306" width="30" height="30" rx="6" transform="rotate(10 277 321)" fill="#fff" stroke="${c}" stroke-width="4"/>`),
  // agave plant
  agave: (w = 320, c = '#3f7f6e') => svg('0 0 320 300', w, `
    <ellipse cx="160" cy="284" rx="130" ry="12" fill="${c}" opacity=".12" stroke="none"/>
    ${[[-70, 0.95], [-45, 1.1], [-20, 1.2], [0, 1.25], [20, 1.2], [45, 1.1], [70, 0.95], [-85, 0.7], [85, 0.7]].map(([a, s]) => `<path d="M160 270 c-16 -60 -12 -150 0 -${190 * s} c12 ${40 * s} 16 ${130 * s} 0 ${190 * s}z" transform="rotate(${a} 160 270)" fill="#cfe3dc" stroke="${c}" stroke-width="5"/>`).join('')}
    <ellipse cx="160" cy="262" rx="46" ry="22" fill="#e9c98a" stroke="#9a5f1e" stroke-width="5"/>`),
  // grape bunch (wine posts only). kind: 'red' (black grapes), 'white' (green-gold), 'pink' (rosé)
  grapes: (w = 220, kind = 'red') => {
    const P = { red: ['#a3264f', '#6e1532'], white: ['#c9d27a', '#7d8a2e'], pink: ['#e7a0b4', '#b0506e'] }[kind];
    return svg('0 0 220 300', w, `
    <path d="M110 40 c0 -20 10 -30 24 -36" stroke="#5f7a35" stroke-width="6"/>
    <path d="M114 38 c30 -24 70 -18 86 4 c-30 12 -60 10 -86 -4z" fill="#d7e4c3" stroke="#5f7a35" stroke-width="5"/>
    ${[[80, 70], [120, 70], [60, 108], [100, 108], [140, 108], [80, 146], [120, 146], [160, 140], [100, 184], [140, 180], [120, 220], [80, 184]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="22" fill="${P[0]}" stroke="${P[1]}" stroke-width="4"/><circle cx="${x - 7}" cy="${y - 7}" r="5" fill="#fff" opacity=".5" stroke="none"/>`).join('')}`);
  },
  // wine glass; kind: 'red' | 'white' | 'pink' | 'sparkling' | 'sherry' (copita, pale) | 'amber' (oxidative sherry)
  glass: (w = 160, kind = 'white', c = W) => {
    const fill = { red: '#8c1d40', white: '#f1e4a0', pink: '#f2b3c4', sparkling: '#f3e2a2', sherry: '#f1e7b0', amber: '#b9772c', brown: '#6b3a1e', dark: '#2a1410' }[kind];
    if (kind === 'sparkling') return svg('0 0 160 400', w, `<ellipse cx="80" cy="388" rx="60" ry="8" fill="${c}" opacity=".1" stroke="none"/><path d="M52 20 h56 l-6 170 c-2 26 -14 40 -22 40 c-8 0 -20 -14 -22 -40z" fill="#fff" stroke="${c}" stroke-width="6"/><path d="M55 80 h50 l-4 110 c-2 22 -12 34 -21 34 c-9 0 -19 -12 -21 -34z" fill="${fill}"/>${[[70, 200], [86, 170], [74, 140], [90, 120], [78, 100]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#fff" stroke="none"/>`).join('')}<path d="M80 230 v130 M44 372 h72" stroke="${c}" stroke-width="7"/>`);
    const narrow = kind === 'sherry' || kind === 'amber' || kind === 'brown' || kind === 'dark';
    const bowl = narrow ? 'M46 30 h68 c4 60 6 110 -8 140 c-8 16 -18 22 -26 22 c-8 0 -18 -6 -26 -22 c-14 -30 -12 -80 -8 -140z' : 'M30 40 h100 c8 70 4 120 -20 146 c-10 10 -20 14 -30 14 c-10 0 -20 -4 -30 -14 c-24 -26 -28 -76 -20 -146z';
    const liq = narrow ? 'M44 110 h72 c0 30 -2 48 -10 60 c-8 16 -18 22 -26 22 c-8 0 -18 -6 -26 -22 c-8 -12 -10 -30 -10 -60z' : 'M28 120 h104 c-2 32 -8 52 -22 66 c-10 10 -20 14 -30 14 c-10 0 -20 -4 -30 -14 c-14 -14 -20 -34 -22 -66z';
    return svg('0 0 160 400', w, `<ellipse cx="80" cy="388" rx="60" ry="8" fill="${c}" opacity=".1" stroke="none"/><path d="${liq}" fill="${fill}"/><path d="${bowl}" stroke="${c}" stroke-width="6"/><path d="M80 ${narrow ? 192 : 200} v160 M44 372 h72" stroke="${c}" stroke-width="7"/><path d="M${narrow ? 56 : 46} ${narrow ? 50 : 60} c-4 30 -2 60 4 80" stroke="#fff" stroke-width="6" opacity=".8"/>`);
  },
  // sparkling wine bottle with riddling angle (wine)
  bottle: (w = 140, c = W, rot = 0) => svg('0 0 140 420', w, `
    <g transform="rotate(${rot} 70 210)"><path d="M56 10 h28 v90 c0 30 36 50 36 90 v200 c0 10 -8 18 -18 18 h-64 c-10 0 -18 -8 -18 -18 v-200 c0 -40 36 -60 36 -90z" fill="#3d4a33" stroke="${c}" stroke-width="6"/>
    <path d="M50 10 h40 v50 h-40z" fill="#d4a23a" stroke="${c}" stroke-width="5"/>
    <rect x="34" y="230" width="72" height="90" rx="8" fill="${CREAM}" stroke="${c}" stroke-width="4"/></g>`),
};
module.exports = I;
