// Instagram batch 03, localised layout. Same slides, art, photos, timings and sizes as tools/social/batches/batch-03.js
// (the verified English source); every visible word comes from the language table T (tools/social/i18n/<lang>/batch-03.js).
// Facts must stay exactly those of the English batch: translate, never add. Built by tools/social/i18n/load.js.
'use strict';
const { B, B2 } = require('../lib/render');
const D = require('../lib/illus2');
const E = require('../lib/illus3');
const { PH } = require('../lib/photos');

const G = (name) => `img/goats/${name}.webp`;
const inl = (svg, { justify = 'flex-end', mt = 'auto', gap = 24, pad = 0 } = {}) => `<div style="margin-top:${mt};display:flex;justify-content:${justify};align-items:flex-end;gap:${gap}px;padding:0 ${pad}px">${svg}</div>`;
const ICON = {
  save: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"><path d="M6 3h12v18l-6-4.5L6 21z"/></svg>',
  share: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"><path d="M22 3 2 10.5l8 2.8L13 21z"/><path d="M22 3 10 13.3"/></svg>',
};

const P = {
  pergola: PH('grapevine-pergola-crete'),
  rabelo: PH('rabelo-boat-port-barrels-douro'),
  bottles: PH('1076-brewing-beer-bottles-2018-g1'),
  corkscrews: PH('three-corkscrews-old-and-modern'),
  whiteGrapes: PH('ripe-white-grapes-close-up-stuttgart'),
  mosel: PH('mosel-river-vineyards-neumagen-dhron'),
  coriander: PH('coriander-seeds-close-up'),
  citrus: PH('citrus-fruit-slices-backlit'),
};

module.exports = function build(T) {
  const C = T.common;
  const acts = (share = C.share) => `<div class="acts"><span><i>${ICON.save}</i>${C.save}</span><span><i>${ICON.share}</i>${share}</span></div>`;
  const cta = (o) => ({ layout: 'cta', kicker: o.kicker || C.beforeYouGo, title: o.title, titleSize: o.titleSize || 76, titleWidth: o.titleWidth || 860,
    sub: o.sub, subWidth: o.subWidth || 760, html: acts(o.share), cta: C.cta, goat: o.goat, art: o.art });
  const tip = (l, t) => `<div class="tip"><small>${l}</small><p>${t}</p></div>`;
  const ans = `<div class="sub" style="margin-top:22px;font-size:30px">${C.answerNext}</div>`;
  const L = T.labels; // words printed on the drawn bottle labels
  const N = (x) => (T.names || {})[x] || x; // grape / place / spirit names where the language writes them differently (ru)
  const opts = (xs, r) => B.options(xs.map(N), r);
  const chablis = (w) => E.labelBottle(w, { glass: 'flint', wine: 'white', big: 'Chablis', small: 'APPELLATION CHABLIS CONTRÔLÉE' });
  const maipo = (w) => E.labelBottle(w, { top: L.maipo, big: 'Cabernet', small: 'SAUVIGNON', bigSize: 32 });
  const rioja = (w) => E.labelBottle(w, { top: L.spain, big: 'Rioja', small: 'DOCa' });

  /* ---------- carousels ---------- */
  const t1 = T.blackGrapes;
  const cheat = (cards, hi) => `<div class="cheat">${cards.map((c, i) => `<div class="cr"><h3>${c.name}</h3><div class="chips">${c.chips.map((x, j) => `<span${hi[i].includes(j) ? ' class="hi"' : ''}>${x}</span>`).join('')}</div><div class="ar">${c.ar}</div><div class="wh">${c.wh}</div></div>`).join('')}</div>`;
  const t2 = T.cognac, t3 = T.sake, t4 = T.beer, t5 = T.levels, t6 = T.wineMyths, t7 = T.port;

  const posts = [
    {
      id: 'wine-black-grapes-cheat-sheet', bg: 'burgundy', course: 'wine', level: 2, tpl: 'flash', photos: [P.pergola],
      slides: [
        { layout: 'cover', tile: { variant: 'arch', photo: P.pergola.src, pos: '70% 40%', tone: 'burgundy', head: t1.head, headSize: 92, sub: t1.sub, archH: 660 } },
        { layout: 'content', kicker: t1.k1, title: t1.title1, titleSize: 64, html: cheat(t1.cards1, [[0, 1], [], []]) },
        { layout: 'content', kicker: t1.k2, title: t1.title2, titleSize: 64, html: cheat(t1.cards2, [[], [0], []]) },
        { layout: 'content', kicker: t1.q1k, title: t1.q1, titleSize: 56, center: true,
          html: opts(['Grenache', 'Pinot Noir', 'Shiraz']) + ans + inl(D.glassPhoto(140, 'lightred'), { justify: 'center', mt: '8px' }) },
        { layout: 'content', kicker: t1.a1k, title: `B · <em>${N('Pinot Noir')}</em>`, titleSize: 84, center: true,
          html: opts(['Grenache', 'Pinot Noir', 'Shiraz'], 'B') + B.note(t1.a1) + inl(D.grapes(180, 'red', { seed: 8 }), { justify: 'center', mt: '12px' }) },
        { layout: 'content', kicker: t1.q2k, title: t1.q2, titleSize: 56, center: true,
          html: opts(['Syrah', 'Tempranillo', 'Cabernet Sauvignon']) + ans + inl(D.glassPhoto(130, 'deepred'), { justify: 'center', mt: '8px' }) },
        { layout: 'content', kicker: t1.a2k, title: `A · <em>${N('Syrah')}</em>`, titleSize: 84, center: true,
          html: opts(['Syrah', 'Tempranillo', 'Cabernet Sauvignon'], 'A') + B.note(t1.a2) + inl(D.grapes(150, 'red', { seed: 12 }), { justify: 'center', mt: '12px' }) },
        cta({ title: t1.ctaTitle, titleSize: 72, titleWidth: 720, sub: C.tellUs, goat: { src: G('goat-with-glasses-and-pencil-on-wine-books'), style: { right: 50, bottom: 100, height: 360 } } }),
      ],
    },
    {
      id: 'spirits-cognac-vs-armagnac', bg: 'course', course: 'spirits', level: 2, tpl: 'photo',
      slides: [
        { layout: 'cover', tile: { variant: 'solid', arc: t2.arc, arcSize: 78, art: D.row([D.potStill(380), E.columnStill(200)], 50), artTop: 560, sub: t2.sub } },
        { layout: 'content', kicker: t2.k1, title: t2.title1, center: true,
          html: B.bullets(t2.share) + inl(D.row([D.whiskyBottle(120), D.glencairn(130)], 20), { mt: '30px' }) },
        { layout: 'content', kicker: t2.k2, title: t2.title2, titleSize: 66, center: true, html: B2.vs2(N('Cognac'), N('Armagnac'), t2.rows) },
        { layout: 'content', kicker: t2.k3, title: t2.title3, center: true,
          html: B2.minis(t2.minis) + inl(E.columnStill(200), { justify: 'center', mt: '8px' }) },
        { layout: 'content', kicker: t2.qk, title: t2.q, titleSize: 56, center: true,
          html: opts(['Ugni Blanc', 'Baco', 'Folle Blanche']) + ans + inl(D.row([D.whiskyBottle(105), D.glencairn(120)], 30), { justify: 'center', mt: '8px' }) },
        { layout: 'content', kicker: t2.ak, title: `B · <em>${N('Baco')}</em>`, titleSize: 84, center: true,
          html: opts(['Ugni Blanc', 'Baco', 'Folle Blanche'], 'B') + B.note(t2.a) + inl(D.glencairn(125), { justify: 'center', mt: '10px' }) },
        cta({ title: t2.ctaTitle, titleSize: 74, titleWidth: 720, sub: C.tellUs, art: { svg: D.row([D.potStill(300), E.columnStill(160)], 20), style: { right: 60, bottom: 120 } } }),
      ],
    },
    {
      id: 'sake-myth-or-fact', bg: 'course', course: 'sake', level: 1, tpl: 'myth',
      slides: [
        { layout: 'cover', tile: { variant: 'edit', head: t3.head, headSize: 150, sub: t3.sub, gap: 40,
          items: [{ svg: D.tokkuri(330), h: 380, label: t3.tokkuri }, { svg: E.ochoko(170), h: 380, label: t3.ochoko }, { svg: E.masu(230), h: 380, label: t3.masu }] } },
        ...t3.myths.map((m, i) => ({ layout: 'content', kicker: `${T.ui.myth} ${i + 1}`,
          html: B2.mf(m) + [inl(D.tokkuri(300), { justify: 'center', mt: '40px' }), inl(E.ochoko(250), { justify: 'center', mt: '50px' }), inl(E.ochoko(250), { justify: 'center', mt: '50px' }),
            inl(E.masu(320), { justify: 'center', mt: '40px' }), inl(D.tokkuri(290), { justify: 'center', mt: '30px' })][i] })),
        cta({ title: t3.ctaTitle, sub: C.score, art: { svg: D.tokkuri(400), style: { right: 60, bottom: 120 } } }),
      ],
    },
    {
      id: 'beer-five-serving-mistakes', bg: 'course', course: 'beer', level: 1, tpl: 'myth', photos: [P.bottles],
      slides: [
        { layout: 'cover', tile: { variant: 'arch', photo: P.bottles.src, pos: 'center 40%', tone: 'course', head: t4.head, headSize: 80, sub: t4.sub, archH: 640 } },
        { layout: 'content', center: true, html: `<div class="bign"><div class="n gt">1</div><div class="t">${t4.m[0].t}</div></div>` + tip(t4.what, t4.m[0].a) + tip(t4.fix, t4.m[0].b)
          + inl(D.row([E.beerBottle(100, 'brown'), E.beerBottle(100, 'green'), E.beerBottle(100, 'clear')], 46), { justify: 'center', mt: '26px' }) },
        { layout: 'content', center: true, html: `<div class="bign"><div class="n gt">2</div><div class="t">${t4.m[1].t}</div></div>` + tip(t4.what, t4.m[1].a) + tip(t4.fix, t4.m[1].b)
          + inl(D.row([D.beerGlass(130, 'gold', { seed: 51 }), D.barley(90, 5)], 20), { justify: 'center', mt: '26px' }) },
        { layout: 'content', center: true, html: `<div class="bign"><div class="n gt">3</div><div class="t">${t4.m[2].t}</div></div>` + tip(t4.means, t4.m[2].a) + tip(t4.fix, t4.m[2].b)
          + inl(D.beerGlass(150, 'straw', { seed: 52 }), { justify: 'center', mt: '26px' }) },
        { layout: 'content', center: true, html: `<div class="bign"><div class="n gt">4</div><div class="t">${t4.m[3].t}</div></div>` + tip(t4.fix, t4.m[3].a) + tip(t4.bottleCond, t4.m[3].b)
          + inl(D.beerGlass(150, 'hazy', { shape: 'weizen', seed: 53 }), { justify: 'center', mt: '30px' }) },
        { layout: 'content', center: true, html: `<div class="bign"><div class="n gt">5</div><div class="t">${t4.m[4].t}</div></div>`
          + `<div class="temps">${t4.temps.map(([c, i, s]) => `<div><b>${c}</b><i>${i}</i><span>${s}</span></div>`).join('')}</div>`
          + `<div class="sub" style="margin-top:24px;font-size:31px;max-width:900px">${t4.m[4].a}</div>`
          + inl(D.row([D.beerGlass(130, 'straw', { seed: 61 }), D.beerGlass(130, 'black', { seed: 62 }), D.beerGlass(130, 'copper', { shape: 'goblet', seed: 63 })], 110), { justify: 'center', mt: '34px' }) },
        cta({ title: t4.ctaTitle, sub: t4.ctaSub, share: t4.share, art: { svg: D.row([D.beerGlass(190, 'amber', { seed: 54 }), E.beerBottle(130, 'brown')], 20), style: { right: 70, bottom: 120 } } }),
      ],
    },
    {
      id: 'wine-which-level-is-right', bg: 'cream', course: 'wine', level: 1, badge: t5.badge, tpl: 'flow',
      slides: [
        { layout: 'cover', tile: { variant: 'solid', tone: 'cream', arc: t5.arc, arcSize: 62, arcR: 1400, arcY: 1720,
          art: `<img src="${G('goat-traveller-with-wine-map-and-suitcase')}" style="height:440px" alt="">`, artTop: 520, sub: t5.sub } },
        { layout: 'content', kicker: t5.k1, title: t5.title1, titleSize: 58,
          html: `<div class="lv">${t5.flow.map(([q, lv], i) => `<div class="q"><p><small>${t5.question} ${i + 1}</small>${q}</p><b><small>${t5.yes}</small>${lv}</b></div>`).join(`<div class="no">${t5.no} ↓</div>`)}</div>` },
        { layout: 'content', kicker: t5.l1.k, title: t5.l1.title, center: true,
          html: B2.edFacts(t5.l1.facts) + B.note(t5.l1.note) + inl(D.row([D.glassPhoto(140, 'pale'), D.glassPhoto(140, 'ruby')], 40), { justify: 'center', mt: '40px' }) },
        { layout: 'content', kicker: t5.l2.k, title: t5.l2.title, center: true,
          html: B2.edFacts(t5.l2.facts) + B.note(t5.l2.note) + inl(D.row([chablis(130), rioja(130)], 50), { justify: 'center', mt: '34px' }) },
        { layout: 'content', kicker: t5.l3.k, title: t5.l3.title, center: true,
          html: B2.edFacts(t5.l3.facts) + B.note(t5.l3.note) + inl(`<div class="glabs" style="gap:60px"><figure>${D.glassPhoto(115, 'pale')}<figcaption>1</figcaption></figure><figure>${D.glassPhoto(115, 'ruby')}<figcaption>2</figcaption></figure></div>`, { justify: 'center', mt: '30px' }) },
        { layout: 'content', kicker: t5.l4.k, title: t5.l4.title, center: true,
          html: B2.edFacts(t5.l4.facts) + B.note(t5.l4.note) + inl(D.row([D.flute(90), D.glassPhoto(130, 'ruby'), D.glassPhoto(130, 'tawny'), D.glassPhoto(130, 'pale')], 30), { justify: 'center', mt: '40px' }) },
        cta({ kicker: t5.ctaKicker, title: t5.ctaTitle, sub: t5.ctaSub, share: t5.share,
          goat: { src: G('goat-traveller-with-wine-map-and-suitcase'), style: { right: 40, bottom: 100, height: 370 } } }),
      ],
    },
    {
      id: 'wine-myth-or-fact', bg: 'course', course: 'wine', level: 3, tpl: 'myth', photos: [P.corkscrews],
      slides: [
        { layout: 'cover', tile: { variant: 'frame', photo: P.corkscrews.src, pos: 'center 55%', tone: 'course', head: t6.head, headSize: 86, sub: t6.sub } },
        ...t6.myths.map((m, i) => ({ layout: 'content', kicker: `${T.ui.myth} ${i + 1}`,
          html: B2.mf(m) + [inl(D.glassPhoto(150, 'ruby'), { justify: 'center', mt: '24px' }), inl(D.bottle(110, { label: true }), { justify: 'center', mt: '24px' }),
            inl(D.row([D.bottle(92, { label: true }), E.cork(72)], 40), { justify: 'center', mt: '12px' }),
            inl(D.row([D.grapes(160, 'red', { seed: 21, leafOn: false }), D.glassPhoto(115, 'pale')], 40), { justify: 'center', mt: '20px' }),
            inl(D.flute(105), { justify: 'center', mt: '36px' })][i] })),
        cta({ title: t6.ctaTitle, sub: C.score, art: { svg: D.row([D.glassPhoto(170, 'ruby'), D.glassPhoto(170, 'pale')], 24), style: { right: 70, bottom: 120 } } }),
      ],
    },
    {
      id: 'wine-port-styles', bg: 'burgundy', course: 'wine', level: 4, levelNote: t7.levelNote, tpl: 'flash', photos: [P.rabelo],
      slides: [
        { layout: 'cover', tile: { variant: 'arch', photo: P.rabelo.src, pos: 'center 55%', tone: 'burgundy', head: t7.head, headSize: 90, sub: t7.sub, archH: 660 } },
        { layout: 'content', kicker: t7.k1, title: t7.title1, center: true,
          html: B2.par(t7.par[0], t7.or, t7.par[1]) + B.bullets(t7.bullets) + inl(D.row([D.glassPhoto(130, 'ruby'), D.glassPhoto(130, 'tawny')], 40), { justify: 'center', mt: 'auto' }) },
        { layout: 'content', kicker: t7.k2, html: B2.card(t7.ruby) },
        { layout: 'content', kicker: t7.k3, html: B2.card(t7.tawny) + inl(D.glassPhoto(120, 'tawny'), { mt: '30px', pad: 30 }) },
        { layout: 'content', kicker: t7.qk, title: t7.q, titleSize: 62, center: true,
          html: B.options(t7.opts) + ans + inl(D.row([D.glassPhoto(140, 'tawny'), D.glassPhoto(140, 'tawny'), D.glassPhoto(140, 'tawny')], 40), { justify: 'center', mt: '40px' }) },
        { layout: 'content', kicker: t7.ak, title: t7.aTitle, titleSize: 76, center: true,
          html: B.options(t7.opts, 'B') + B.note(t7.a) + inl(D.glassPhoto(130, 'tawny'), { justify: 'center', mt: '24px' }) },
        cta({ title: t7.ctaTitle, titleSize: 72, titleWidth: 700, sub: C.tellUs, goat: { src: G('goat-winking-with-glass-of-red-wine'), style: { right: 40, bottom: 100, height: 380 } } }),
      ],
    },
  ];

  /* ---------- reels ---------- */
  const ph = (p, o = {}) => ({ src: p.src, pos: o.pos || 'center', h: o.h || 1000, textTop: o.textTop });
  const glabs = (items, gap = 40) => `<div class="glabs" style="gap:${gap}px">${items.map(([svg, l, w]) => `<figure>${svg}<figcaption class="${w ? 'w' : ''}">${l}</figcaption></figure>`).join('')}</div>`;
  const end = { fadeOut: 0.6 };
  const r1 = T.rankBody, r2 = T.guessGrape, r3 = T.pov, r4 = T.redFlags, r5 = T.fault, r6 = T.placeGrape, r7 = T.guessSpirit;
  const abc = (x) => x.map((h) => ({ html: h, at: -1 }));

  const reels = [
    { id: 'reel-wine-rank-by-body', bg: 'cream', course: 'wine', level: 1, music: 'bossa', ...end,
      tile: { variant: 'edit', head: r1.tileHead, headSize: 136, sub: r1.tileSub, gap: 46, reelHint: true,
        items: ['A', 'B', 'C'].map((l) => ({ svg: D.glassPhoto(150, 'ruby'), h: 370, label: l })) },
      scenes: [
        { start: 0, end: 2.4, hook: true, kicker: r1.s[0].k, title: r1.s[0].t, titleSize: 104, lines: abc(r1.abc), caption: r1.s[0].c },
        { start: 2.4, end: 5.4, kicker: r1.s[1].k, title: r1.s[1].t, lines: abc(r1.abc), timer: { at: 0, n: 3, top: 1100, label: r1.s[1].timer }, caption: r1.s[1].c },
        { start: 5.4, end: 7.2, kicker: r1.s[2].k, title: r1.s[2].t, titleSize: 92, lines: [r1.s[2].l], caption: r1.s[2].c },
        { start: 7.2, end: 9.0, kicker: r1.s[3].k, title: r1.s[3].t, titleSize: 110, art: { svg: D.glassPhoto(150, 'lightred'), top: 740 }, pop: { at: 0.5, html: `<small>${r1.body}</small>${r1.s[3].pop}`, top: 1150 }, caption: r1.s[3].c },
        { start: 9.0, end: 10.8, kicker: r1.s[4].k, title: r1.s[4].t, titleSize: 104, art: { svg: D.glassPhoto(150, 'ruby'), top: 740 }, pop: { at: 0.5, html: `<small>${r1.body}</small>${r1.s[4].pop}`, top: 1150 }, caption: r1.s[4].c },
        { start: 10.8, end: 12.8, kicker: r1.s[5].k, title: r1.s[5].t, titleSize: 100, art: { svg: D.glassPhoto(150, 'deepred'), top: 740 }, pop: { at: 0.5, html: `<small>${r1.body}</small>${r1.s[5].pop}`, top: 1150 }, caption: r1.s[5].c },
        { start: 12.8, end: 15.0, kicker: r1.s[6].k, title: r1.s[6].t, titleSize: 88, art: { svg: D.glassPhoto(170, 'gold'), top: 860 }, caption: r1.s[6].c },
        { start: 15.0, end: 17.0, kicker: r1.s[7].k, title: 'B · C · A', titleSize: 150, lines: [r1.s[7].l], goat: { src: G('goat-leaping-with-glass-of-red-wine'), h: 420, top: 980 }, caption: r1.s[7].c },
      ] },
    { id: 'reel-wine-guess-the-grape', bg: 'cream', course: 'wine', level: 2, music: 'lofi', ...end, photos: [P.whiteGrapes, P.mosel],
      tile: { variant: 'arch', photo: P.whiteGrapes.src, pos: 'center 45%', tone: 'cream', head: r2.tileHead, headSize: 96, sub: r2.tileSub, archH: 640 },
      scenes: [
        { start: 0, end: 2.2, hook: true, kicker: r2.s[0].k, title: r2.s[0].t, titleSize: 112, photo: ph(P.whiteGrapes, { pos: 'center 45%', h: 980 }), caption: r2.s[0].c },
        { start: 2.2, end: 4.6, kicker: r2.s[1].k, title: r2.s[1].t, titleSize: 100, lines: r2.s[1].l, caption: r2.s[1].c },
        { start: 4.6, end: 7.2, kicker: r2.s[2].k, title: r2.s[2].t, titleSize: 108, photo: ph(P.mosel, { h: 860, pos: 'center 55%' }), lines: r2.s[2].l, caption: r2.s[2].c },
        { start: 7.2, end: 9.6, kicker: r2.s[3].k, title: r2.s[3].t, titleSize: 100, lines: r2.s[3].l, caption: r2.s[3].c },
        { start: 9.6, end: 12.6, kicker: r2.s[4].k, title: r2.s[4].t, titleSize: 140, sub: r2.s[4].sub, timer: { at: 0, n: 3, top: 1020, label: r2.s[4].timer }, caption: r2.s[4].c },
        { start: 12.6, end: 15.0, kicker: r2.s[5].k, title: r2.s[5].t, titleSize: 128, art: { svg: D.glassPhoto(190, 'pale'), top: 820 }, lines: [r2.regions || 'Mosel · Alsace · Clare & Eden Valley'], caption: r2.s[5].c },
        { start: 15.0, end: 17.0, kicker: r2.s[6].k, title: r2.s[6].t, titleSize: 104, lines: [{ html: r2.s[6].l, cls: 'big' }], caption: r2.s[6].c },
      ] },
    { id: 'reel-wine-pov-blind-tasting', bg: 'burgundy', course: 'wine', level: 3, music: 'cinematic', ...end,
      tile: { variant: 'solid', tone: 'burgundy', arc: r3.tileArc, arcSize: 60, arcR: 1100,
        art: `<img src="${G('goat-detective-with-magnifying-glass-and-red-wine')}" style="height:470px" alt="">`, artTop: 520, sub: r3.tileSub },
      scenes: [
        { start: 0, end: 2.4, hook: true, kicker: r3.s[0].k, title: r3.s[0].t, titleSize: 120, sub: r3.s[0].sub, goat: { src: G('goat-detective-with-magnifying-glass-and-red-wine'), h: 470, top: 900 }, caption: r3.s[0].c },
        { start: 2.4, end: 4.6, kicker: r3.s[1].k, title: r3.s[1].t, titleSize: 140, art: { svg: D.glassPhoto(150, 'ruby'), top: 900 }, lines: [{ html: `<span class="tagx ok">${r3.s[1].tag}</span>${r3.s[1].l}`, at: 0.8 }], caption: r3.s[1].c },
        { start: 4.6, end: 6.8, kicker: r3.s[2].k, title: r3.s[2].t, titleSize: 96, lines: [{ html: r3.s[2].l[0], at: 0.7 }, { html: r3.s[2].l[1], at: 1.2 }], caption: r3.s[2].c },
        { start: 6.8, end: 9.0, kicker: r3.s[3].k, title: r3.s[3].t, titleSize: 92, goat: { src: G('goat-peering-over-open-wine-book'), h: 340, top: 1010, at: 0.3 }, lines: [{ html: r3.s[3].l, at: 0.6 }], caption: r3.s[3].c },
        { start: 9.0, end: 11.2, kicker: r3.s[4].k, title: r3.s[4].t, titleSize: 100, pop: { at: 0.6, html: `<small>${r3.s[4].popSmall}</small>${r3.s[4].pop}`, top: 1060, tone: 'red' }, caption: r3.s[4].c },
        { start: 11.2, end: 13.8, kicker: r3.s[5].k, title: r3.s[5].t, titleSize: 130, lines: [{ html: r3.s[5].l[0], cls: 'big', at: 0.5 }, { html: r3.s[5].l[1], at: 1.1 }], caption: r3.s[5].c },
        { start: 13.8, end: 16.0, kicker: r3.s[6].k, title: r3.s[6].t, titleSize: 104, goat: { src: G('goat-winking-with-glass-of-red-wine'), h: 440, top: 1000 }, caption: r3.s[6].c },
      ] },
    { id: 'reel-wine-red-flags-tasting', bg: 'course', course: 'wine', level: 1, music: 'funk', ...end,
      tile: { variant: 'solid', arc: r4.tileArc, arcSize: 62, arcR: 1100, art: E.redFlag(330), artTop: 540, sub: r4.tileSub },
      scenes: [
        { start: 0, end: 2.2, hook: true, kicker: r4.s0.k, title: r4.s0.t, titleSize: 116, art: { svg: E.redFlag(300), top: 860 }, caption: r4.s0.c },
        ...r4.flags.map(([t, l, c], i) => ({ start: 2.2 + i * 2, end: 4.2 + i * 2, kicker: `${r4.flag} ${i + 1}`, title: t, titleSize: t.replace(/<[^>]+>/g, '').length > 24 ? 92 : 108,
          lines: [{ html: `<span class="tagx ok">${r4.fix}</span>${l}`, at: 0.5 }], art: { svg: E.redFlag(250), top: 930, at: 0.15 }, caption: c })),
        { start: 14.2, end: 16.4, kicker: r4.sEnd.k, title: r4.sEnd.t, titleSize: 108, lines: [{ html: r4.sEnd.l, cls: 'big' }], art: { svg: E.redFlag(250), top: 920 }, caption: r4.sEnd.c },
      ] },
    { id: 'reel-wine-spot-the-fault', bg: 'course', course: 'wine', level: 3, music: 'synthwave', ...end,
      tile: { variant: 'solid', arc: r5.tileArc, arcSize: 60, arcR: 1100,
        art: glabs([[E.glassCrystals(170), 'A'], [D.glassPhoto(170, 'pale'), 'B'], [D.glassPhoto(170, 'oxidised'), 'C']], 34), artTop: 470, sub: r5.tileSub },
      scenes: [
        { start: 0, end: 2.4, hook: true, kicker: r5.s[0].k, title: r5.s[0].t, titleSize: 128, sub: r5.s[0].sub,
          vis: glabs([[E.glassCrystals(180), 'A'], [D.glassPhoto(180, 'pale'), 'B'], [D.glassPhoto(180, 'oxidised'), 'C']], 46), caption: r5.s[0].c },
        { start: 2.4, end: 5.4, kicker: r5.s[1].k, title: r5.s[1].t, titleSize: 128,
          vis: glabs([[E.glassCrystals(150), 'A'], [D.glassPhoto(150, 'pale'), 'B'], [D.glassPhoto(150, 'oxidised'), 'C']], 40), timer: { at: 0, n: 3, top: 1170, label: r5.s[1].timer }, caption: r5.s[1].c },
        { start: 5.4, end: 7.8, kicker: r5.s[2].k, title: r5.s[2].t, titleSize: 128, art: { svg: E.glassCrystals(150), top: 760 }, pop: { at: 0.6, html: `<small>${r5.s[2].popSmall}</small>${r5.s[2].pop}`, top: 1150, tone: 'green' }, caption: r5.s[2].c },
        { start: 7.8, end: 10.2, kicker: r5.s[3].k, title: r5.s[3].t, titleSize: 110, art: { svg: E.cork(160, true), top: 900 }, lines: [{ html: r5.s[3].l, at: 0.6 }], caption: r5.s[3].c },
        { start: 10.2, end: 12.6, kicker: r5.s[4].k, title: r5.s[4].t, titleSize: 140, art: { svg: D.glassPhoto(150, 'oxidised'), top: 960 }, lines: [{ html: r5.s[4].l[0], at: 0.5 }, { html: r5.s[4].l[1], at: 1.0 }], caption: r5.s[4].c },
        { start: 12.6, end: 14.8, kicker: r5.s[5].k, title: r5.s[5].t, titleSize: 100, lines: [{ html: r5.s[5].l, at: 0.5 }], art: { svg: D.glassPhoto(150, 'amber'), top: 900, at: 0.4 }, caption: r5.s[5].c },
        { start: 14.8, end: 17.0, kicker: r5.s[6].k, title: r5.s[6].t, titleSize: 130, vis: glabs([[E.glassCrystals(170), 'A']], 0), caption: r5.s[6].c },
      ] },
    { id: 'reel-wine-place-or-grape', bg: 'cream', course: 'wine', level: 2, music: 'ukulele', ...end,
      tile: { variant: 'edit', head: r6.tileHead, headSize: 140, sub: r6.tileSub, gap: 70, reelHint: true,
        items: [{ svg: chablis(140), h: 430, label: r6.this }, { svg: maipo(140), h: 430, label: r6.that }] },
      scenes: [
        { start: 0, end: 2.2, hook: true, kicker: r6.s0.k, title: r6.s0.t, titleSize: 112, sub: r6.s0.sub, art: { svg: D.row([chablis(150), maipo(150)], 80), top: 900, at: -1 }, caption: r6.s0.c },
        ...[
          [chablis(160), 'Chablis', r6.place],
          [maipo(160), 'Cabernet Sauvignon', r6.grape],
          [rioja(160), 'Rioja', r6.place],
          [E.labelBottle(160, { top: L.france, big: 'Bordeaux', small: 'APPELLATION BORDEAUX', bigSize: 30 }), 'Bordeaux', r6.place],
        ].map(([svg, t0, k], i) => N(t0) && ({ t: N(t0), svg, k, i })).map(({ svg, t, k, i }) => ({ start: 2.2 + i * 2.2, end: 4.4 + i * 2.2, kicker: `${r6.label} ${i + 1} · ${r6.q}`, title: t, titleSize: t.length > 12 ? 80 : 120,
          art: { svg, top: 690, at: 0 }, pop: { at: 0.9, html: `${k}<span>${r6.labels[i][0]}</span>`, top: 1190 }, caption: r6.labels[i][1] })),
        { start: 11.0, end: 13.4, kicker: r6.twist.k, title: r6.twist.t, titleSize: 96,
          art: { svg: E.labelBottle(150, { glass: 'flint', wine: 'white', top: 'Alsace', big: 'Pinot Gris', small: 'APPELLATION ALSACE', bigSize: 30 }), top: 880, at: 0.1 }, caption: r6.twist.c },
        { start: 13.4, end: 15.6, kicker: r6.rule.k, title: r6.rule.t, titleSize: 84, lines: [{ html: r6.rule.l, at: 0.7 }], caption: r6.rule.c },
        { start: 15.6, end: 17.6, kicker: r6.sEnd.k, title: r6.sEnd.t, titleSize: 110, lines: [{ html: r6.sEnd.l, cls: 'big' }], caption: r6.sEnd.c },
      ] },
    { id: 'reel-spirits-guess-the-spirit', bg: 'course', course: 'spirits', level: 1, music: 'swing', ...end, photos: [P.coriander, P.citrus],
      tile: { variant: 'frame', photo: P.coriander.src, pos: 'center', tone: 'course', head: r7.tileHead, headSize: 92, sub: r7.tileSub },
      scenes: [
        { start: 0, end: 2.2, hook: true, kicker: r7.s[0].k, title: r7.s[0].t, titleSize: 120, photo: ph(P.coriander, { h: 980 }), caption: r7.s[0].c },
        { start: 2.2, end: 4.4, kicker: r7.s[1].k, title: r7.s[1].t, titleSize: 104, caption: r7.s[1].c, art: { svg: E.ginBottle(160).replace('>GIN<', '>?<'), top: 860 } },
        { start: 4.4, end: 6.8, kicker: r7.s[2].k, title: r7.s[2].t, titleSize: 92, photo: ph(P.citrus, { h: 820 }), lines: [{ html: r7.s[2].l, at: 0.6 }], caption: r7.s[2].c },
        { start: 6.8, end: 9.0, kicker: r7.s[3].k, title: r7.s[3].t, titleSize: 120, art: { svg: E.juniper(560), top: 900 }, lines: [{ html: r7.s[3].l, at: 0.6 }], caption: r7.s[3].c },
        { start: 9.0, end: 12.0, kicker: r7.s[4].k, title: r7.s[4].t, titleSize: 140, sub: r7.s[4].sub, timer: { at: 0, n: 3, top: 1020, label: r7.s[4].timer }, caption: r7.s[4].c },
        { start: 12.0, end: 14.4, kicker: r7.s[5].k, title: r7.s[5].t, titleSize: 150, art: { svg: E.ginBottle(140), top: 720 }, pop: { at: 0.7, html: `<small>${r7.s[5].popSmall}</small>${r7.s[5].pop}`, top: 1140 }, caption: r7.s[5].c },
        { start: 14.4, end: 16.6, kicker: r7.s[6].k, title: r7.s[6].t, titleSize: 92, lines: [{ html: r7.s[6].l, at: 0.6 }], caption: r7.s[6].c },
        { start: 16.6, end: 18.6, kicker: r7.s[7].k, title: r7.s[7].t, titleSize: 130, lines: [{ html: r7.s[7].l, cls: 'big' }], caption: r7.s[7].c },
      ] },
  ];

  /* ---------- stories ---------- */
  const S = T.stories;
  const stories = [
    { id: 'story-1-poll-screwcap-or-cork', course: 'wine', level: 3, single: true,
      q: { kicker: S[0].k, question: S[0].q, options: [], hint: S[0].hint, art: { svg: D.row([D.bottle(120, { label: true }), E.cork(100)], 60), style: { left: '50%', transform: 'translateX(-50%)', bottom: 330 } } } },
    { id: 'story-2-quiz-not-a-fault', course: 'wine', level: 3, single: true, q: { kicker: S[1].k, question: S[1].q, options: S[1].o, hint: S[1].hint } },
    { id: 'story-3-slider-blind-tasting', course: 'wine', level: 3, single: true,
      q: { kicker: S[2].k, question: S[2].q, options: [], hint: S[2].hint, art: { svg: D.glassPhoto(170, 'ruby'), style: { left: '50%', transform: 'translateX(-50%)', bottom: 330 } } } },
    { id: 'story-4-quiz-beer-glass', course: 'beer', level: 1, single: true, q: { kicker: S[3].k, question: S[3].q, options: S[3].o, hint: S[3].hint } },
  ];

  const feed = ['reel-wine-rank-by-body', 'beer-five-serving-mistakes', 'reel-wine-guess-the-grape', 'wine-myth-or-fact', 'reel-spirits-guess-the-spirit',
    'wine-black-grapes-cheat-sheet', 'reel-wine-spot-the-fault', 'sake-myth-or-fact', 'reel-wine-pov-blind-tasting', 'spirits-cognac-vs-armagnac',
    'reel-wine-place-or-grape', 'wine-port-styles', 'reel-wine-red-flags-tasting', 'wine-which-level-is-right'];
  const grid = { cols: 4, note: 'First 14 posts of the new account, newest first (4:5 tiles; reel covers centre-cropped).',
    legend: [{ c: '#8c1d40', t: T.ui.course.wine }, { c: '#9a5f1e', t: T.ui.course.spirits }, { c: '#3b3f8f', t: T.ui.course.sake }, { c: '#d4a23a', t: T.ui.course.beer }], prev: [] };

  return { id: 'batch-03', v2: true, reelTemplate: 'reel-viral.html', slideRange: [5, 10], maxMB: 9.5, preset: 'veryfast', uniqueMusic: true, posts, stories, reels, feed, grid, photos: P };
};
