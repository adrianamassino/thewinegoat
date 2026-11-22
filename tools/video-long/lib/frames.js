// Renders slide specs to JPEG with Playwright (one browser, one page).
// Usage: NODE_PATH=$(npm root -g) node frames.js jobs.json
// jobs.json = {"page": "/abs/slide.html", "jobs": [{"spec": {...}, "out": "/abs/x.jpg", "w": 1920, "h": 1080}]}
const fs = require('fs');
const { chromium } = require('playwright');
(async () => {
  const J = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto('file://' + J.page);
  const warn = [];
  for (const j of J.jobs) {
    const w = j.w || 1920, h = j.h || 1080;
    await page.setViewportSize({ width: w, height: h });
    const bad = await page.evaluate(s => window.render(s), j.spec);
    if (bad && bad.length) warn.push(j.out.split('/').pop() + ': ' + bad.join(', '));
    await page.screenshot({ path: j.out, type: 'jpeg', quality: 92, clip: { x: 0, y: 0, width: w, height: h } });
  }
  await browser.close();
  if (warn.length) console.log('OVERFLOW ' + JSON.stringify(warn));
})().catch(e => { console.error(e); process.exit(1); });
