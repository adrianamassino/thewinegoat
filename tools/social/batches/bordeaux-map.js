// Stylised (not to scale) map of the Bordeaux rivers for the batch-02 Left/Right Bank carousel.
'use strict';
module.exports = (w = 900, { names = true, compact = false } = {}) => {
  const lab = (x, y, t, o = {}) => `<text x="${x}" y="${y}" font-family="DM Sans" font-weight="${o.w || 700}" font-size="${o.s || 26}" fill="${o.c || '#2a1b20'}" text-anchor="${o.a || 'middle'}"${o.i ? ' font-style="italic"' : ''}${o.ls ? ` letter-spacing="${o.ls}"` : ''}>${t}</text>`;
  const dot = (x, y, r = 9) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#6e1532" stroke-width="5"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 760" width="${w}">
  <rect x="0" y="0" width="900" height="760" fill="#fdfaf6"/>
  <!-- Atlantic -->
  <path d="M0 0 H86 C70 160 96 330 74 520 C62 640 70 700 60 760 H0z" fill="#e3ecef"/>
  ${lab(42, 380, 'Atlantic', { s: 22, c: '#24505e', i: 1, w: 600 }).replace('<text', '<text transform="rotate(-90 42 380)"')}
  <!-- Left Bank (west/south of Gironde + Garonne) -->
  <path d="M86 0 H170 L470 418 L430 500 L470 590 L650 760 H60 C70 700 62 640 74 520 C96 330 70 160 86 0z" fill="#f6e3e8"/>
  <!-- Right Bank (north/east of Gironde + Dordogne) -->
  <path d="M235 0 H900 V375 L760 388 L630 402 L520 412 L478 410z" fill="#fbefd9"/>
  <!-- rivers -->
  <path d="M170 0 C260 120 340 260 470 418" stroke="#7fa4b0" stroke-width="56" fill="none" stroke-linecap="round"/>
  <path d="M205 -10 C290 120 370 260 478 410" stroke="#e3ecef" stroke-width="0"/>
  <path d="M470 418 C440 450 425 480 430 500 C440 540 455 570 470 590 C540 650 600 700 660 770" stroke="#7fa4b0" stroke-width="20" fill="none" stroke-linecap="round"/>
  <path d="M470 418 C520 412 580 408 630 402 C700 394 760 388 910 375" stroke="#7fa4b0" stroke-width="20" fill="none" stroke-linecap="round"/>
  ${lab(300, 150, 'GIRONDE', { s: 22, c: '#24505e', ls: 4, w: 800 }).replace('<text', '<text transform="rotate(52 300 150)"')}
  ${lab(520, 655, 'Garonne', { s: 24, c: '#24505e', i: 1, w: 600 }).replace('<text', '<text transform="rotate(42 520 655)"')}
  ${lab(780, 420, 'Dordogne', { s: 24, c: '#24505e', i: 1, w: 600 })}
  <!-- places -->
  ${dot(412, 500, 12)}${lab(392, 508, 'Bordeaux', { a: 'end', s: 26, w: 800 })}
  ${names ? `
  ${dot(232, 168)}${lab(220, 176, 'Pauillac', { a: 'end' })}
  ${dot(345, 322)}${lab(333, 330, 'Margaux', { a: 'end' })}
  ${lab(150, 250, 'HAUT-MÉDOC', { s: 22, c: '#8c1d40', ls: 3, w: 800 })}
  ${dot(360, 572)}${lab(348, 580, 'Pessac-Léognan', { a: 'end' })}
  ${lab(250, 650, 'GRAVES', { s: 22, c: '#8c1d40', ls: 3, w: 800 })}
  ${dot(612, 362)}${lab(612, 340, 'Pomerol')}
  ${dot(700, 352)}${lab(724, 330, 'Saint-Émilion', { a: 'start' })}
  ` : ''}
  ${lab(compact ? 250 : 230, compact ? 450 : 455, 'LEFT BANK', { s: compact ? 40 : 34, c: '#6e1532', ls: 4, w: 800 })}
  ${lab(640, 190, 'RIGHT BANK', { s: compact ? 40 : 34, c: '#7a5a10', ls: 4, w: 800 })}
  ${lab(860, 740, 'Stylised map, not to scale', { a: 'end', s: 18, c: '#5c4a50', i: 1, w: 500 })}
</svg>`;
};
