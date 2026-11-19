// Smoke test (Playwright): server on :8821 from the repo root, then  S=<dir for screenshots> NODE_PATH=$(npm root -g) node tools/site_i18n/test_pages.js /de/<slug>/ …
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const pages = process.argv.length > 2 ? process.argv.slice(2) : ['/', '/es-ar/', '/wset-level-2/', '/es-ar/wset-nivel-2/'];
  for (const w of [375, 1280]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 800 } });
    for (const p of pages) {
      const pg = await ctx.newPage(); const errs = [];
      pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
      pg.on('pageerror', e => errs.push('PAGEERR ' + e.message));
      const r = await pg.goto('http://localhost:8821' + p, { waitUntil: 'load' });
      await pg.waitForTimeout(400);
      const info = await pg.evaluate(() => ({ lang: document.documentElement.lang, dir: getComputedStyle(document.body).direction, sw: document.documentElement.scrollWidth,
        wide: [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.right > innerWidth + 2 && getComputedStyle(e).position !== 'fixed'; }).slice(0, 3).map(e => e.tagName + '.' + e.className),
        links: [...new Set([...document.querySelectorAll('a[href]')].map(a => a.href).filter(h => h.startsWith(location.origin)))], h1: (document.querySelector('h1') || {}).textContent }));
      let bad = [];
      for (const h of info.links) { const u = h.split('#')[0]; const rr = await ctx.request.get(u); if (rr.status() >= 400) bad.push(u + ' ' + rr.status()); }
      console.log(w, p, r.status(), info.lang, info.dir, 'scrollW', info.sw, 'overflow', JSON.stringify(info.wide), 'links', info.links.length, 'bad', bad.length, bad.slice(0, 3), 'errs', errs.slice(0, 3), (info.h1 || '').slice(0, 50));
      if (w === 375) await pg.screenshot({ path: `${process.env.S}/shot${p.replace(/\//g, '_')}.png` });
      await pg.close();
    }
    await ctx.close();
  }
  await b.close();
})();
