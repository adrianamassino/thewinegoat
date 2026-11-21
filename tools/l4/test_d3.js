/* Playwright checks for the Diploma unit D3 (and that the other units and levels still load).
   Server: cd <repo> && python3 -m http.server 8931
   Run:    NODE_PATH=$(npm root -g) node tools/l4/test_d3.js [http://localhost:8931/app/] [screenshot dir] */
const { chromium } = require("playwright");
const BASE = process.argv[2] || "http://localhost:8931/app/", SHOT = process.argv[3] || "";
let fails = 0; const bad = (...a) => { fails++; console.log("FAIL", ...a); };
const external = t => /ERR_TUNNEL|ERR_NAME|ERR_CONNECTION|ERR_INTERNET|ERR_PROXY|net::ERR_FAILED|supabase|stripe|google|Failed to load resource/i.test(t);
async function open(b, lg, lv, w, unit) {
  const ctx = await b.newContext({ viewport: { width: w, height: 812 } });
  await ctx.addInitScript(([l, v, u]) => { try { localStorage.setItem("wset3-onb", "1"); localStorage.setItem("twg-level", v); localStorage.setItem("wset3-lang", l); if (u) localStorage.setItem("twg-d4-unit", u); } catch (e) {} }, [lg, lv, unit || ""]);
  const p = await ctx.newPage(), errs = [];
  p.on("console", m => { if (m.type() === "error" && !external(m.text())) errs.push(m.text().slice(0, 200)); });
  p.on("pageerror", e => errs.push("pageerror " + e.message.slice(0, 300)));
  p.on("dialog", d => d.accept());
  await p.goto(BASE, { waitUntil: "load" }); await p.waitForTimeout(900);
  const dlg = await p.$(".exdlg [data-exok]"); if (dlg) { await dlg.click(); await p.waitForTimeout(150); }   /* the exam-language notice (the exam is not offered in every language) */
  return { ctx, p, errs };
}
const overflow = p => p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
const hub = async p => { await p.evaluate(() => { go("study"); }); await p.waitForTimeout(150); };
async function d3(b, lg, w) {
  const tag = `D3 ${lg} ${w}px`, { ctx, p, errs } = await open(b, lg, "4", w, "D1");
  const chk = async what => { const o = await overflow(p); if (o > 1) bad(tag, what, "horizontal overflow", o); };
  await hub(p);
  if (!(await p.$('.d4hub [data-d4u="D3"]'))) { bad(tag, "no D3 tab in the Diploma hub"); await ctx.close(); return; }
  await p.click('.d4hub [data-d4u="D3"]'); await p.waitForTimeout(150);
  const h = await p.evaluate(() => ({ avail: (document.querySelector(".d4avail") || {}).innerText || "", papers: document.querySelectorAll('.mockcard[data-d4="paper"]').length, exl: (document.querySelector(".d4exl") || {}).innerText || "", tx: document.querySelector(".d4hub").innerText }));
  if (!h.avail || h.avail.length < 40) bad(tag, "no list of available regions");
  if (h.papers !== 4) bad(tag, "expected 4 practice papers, got", h.papers);
  if (!/55/.test(h.exl)) bad(tag, "exam line missing");
  if (/d4[A-Z]\w+/.test(h.tx)) bad(tag, "untranslated key in hub", h.tx.match(/d4[A-Z]\w+/)[0]);
  await chk("hub"); if (SHOT) await p.screenshot({ path: `${SHOT}/d3-${lg}-${w}-hub.png`, fullPage: true });
  /* lessons: every chapter has lessons, one renders */
  await p.click('.d4hub [data-go="l2les"]'); await p.waitForTimeout(150);
  const nch = await p.$$eval(".l2chap", a => a.length), nl = await p.$$eval('.l2chap [data-d4="les"]', a => a.length);
  if (!nch || !nl) bad(tag, "no lessons listed");
  await p.evaluate(() => document.querySelectorAll(".l2chap").forEach(d => d.open = true));
  const all = await p.$$('.l2chap [data-d4="les"]'); await all[Math.floor(all.length / 2)].click(); await p.waitForTimeout(150);
  const art = await p.evaluate(() => (document.querySelector(".l2art") || {}).innerText || "");
  if (art.length < 800) bad(tag, "lesson too short", art.length);
  await chk("lesson"); if (SHOT && w === 375) await p.screenshot({ path: `${SHOT}/d3-${lg}-${w}-lesson.png` });
  /* chapter quiz */
  await p.click('[data-d4="cquiz"]'); await p.waitForTimeout(250);
  const opts = await p.$$("button.choice");
  if (opts.length < 4) bad(tag, "quiz did not start", opts.length);
  else { await opts[0].click(); await p.waitForTimeout(250); const fb = await p.evaluate(() => document.querySelectorAll("button.choice.ok, button.choice.correct, button.choice[disabled], .expl, .explain").length); if (!fb) bad(tag, "quiz feedback"); }
  await chk("quiz");
  /* written answer: write, mark, see a score and the model answer */
  await hub(p); await p.click('.d4hub [data-d4="open"]'); await p.waitForTimeout(150);
  const first = await p.$(".d4oqi"); if (!first) bad(tag, "no written questions");
  else { await first.click(); await p.waitForTimeout(200);
    const tas = await p.$$("textarea"); if (!tas.length) bad(tag, "no answer box");
    for (const t of tas) await t.fill("Gravel drains well and gives back heat, so Cabernet Sauvignon ripens; clay suits Merlot. La ghiaia drena, argilla, Merlot 80%, Cabernet Sauvignon, tannini alti. graves drainage argile; grava drenaje arcilla taninos altos acidez alta.");
    await p.click("#o-grade"); await p.waitForTimeout(500);
    const res = await p.evaluate(() => document.body.innerText);
    if (!/\d+([.,]\d)?\s*\/\s*\d+/.test(res)) bad(tag, "no mark after grading");
    await chk("written answer"); if (SHOT && w === 375) await p.screenshot({ path: `${SHOT}/d3-${lg}-${w}-open.png`, fullPage: true }); }
  /* tasting notes list */
  await hub(p); if (!(await p.$('.d4hub [data-d4="tas"]'))) bad(tag, "no tasting row"); else { await p.click('.d4hub [data-d4="tas"]'); await p.waitForTimeout(150); if (!(await p.$$(".d4oqi")).length) bad(tag, "no tasting notes"); await chk("tasting list"); }
  /* flashcards flip */
  await hub(p); await p.click('.d4hub [data-go="l2fl"]'); await p.waitForTimeout(150);
  const f0 = await p.evaluate(() => (document.querySelector(".l2card b") || {}).innerText || ""); await p.click(".l2card"); await p.waitForTimeout(150);
  const f1 = await p.evaluate(() => ({ t: (document.querySelector(".l2card b") || {}).innerText || "", flip: !!document.querySelector(".l2card.flip") }));
  if (!f0 || !f1.flip || f1.t === f0) bad(tag, "flashcard did not flip"); await chk("flashcards");
  /* the four practice papers start, the theory one is marked */
  for (let i = 0; i < 4; i++) { await hub(p); await p.click(`.mockcard[data-pk="${i}"]`); await p.waitForTimeout(150);
    if (!(await p.$('[data-d4="pgo"]'))) { bad(tag, "paper " + i + " did not open"); continue; }
    await p.click('[data-d4="pgo"]'); await p.waitForTimeout(200);
    const n = await p.$$eval(".d4pq", a => a.length), tn = await p.$$eval("#d4clock", a => a.length);
    if (i < 2 ? n < 3 : n < 1) bad(tag, "paper " + i + " questions", n); if (!tn) { await p.waitForTimeout(1100); if (!(await p.$("#d4clock"))) bad(tag, "no clock"); }
    await chk("paper " + i);
    if (i === 0) { const ta = await p.$(".d4pq textarea"); await ta.fill("Merlot argilla clay argile arcilla; Cabernet Sauvignon ghiaia gravel graves grava; 25 hL/ha; courtier 2%."); await p.click('[data-d4="psub"]'); await p.waitForTimeout(400);
      if (!(await p.$(".result-score"))) bad(tag, "paper not marked"); await chk("paper result"); await p.click('[data-d4="presx"]'); }
    else await p.click('[data-d4="pquit"]'); }
  errs.forEach(e => bad(tag, "console:", e)); await ctx.close();
}
async function other(b, lv, unit) {
  const { ctx, p, errs } = await open(b, "en", lv, 375, unit), tag = `level ${lv} ${unit || ""}`;
  if (lv === "4") { await hub(p); const u = await p.evaluate(() => (document.querySelector('.d4units [aria-selected="true"] b') || {}).innerText); if (u !== unit) bad(tag, "unit not selected", u);
    await p.click('.d4hub [data-go="l2les"]'); await p.waitForTimeout(150); if (!(await p.$$(".l2chap")).length) bad(tag, "no lessons");
    await hub(p); if ((await p.$$('.mockcard[data-d4="paper"]')).length !== 1) bad(tag, "expected one practice paper");
    else { await p.click('.mockcard[data-d4="paper"]'); await p.waitForTimeout(150); if (!(await p.$('[data-d4="pgo"]'))) bad(tag, "paper did not open"); } }
  else { const n = await p.evaluate(() => document.body.innerText.length); if (n < 200) bad(tag, "page empty"); }
  errs.forEach(e => bad(tag, "console:", e)); await ctx.close();
}
(async () => {
  const b = await chromium.launch();
  for (const lg of ["it", "fr", "en", "es"]) for (const w of [375, 1280]) await d3(b, lg, w);
  for (const u of ["D1", "D2", "D4", "D5"]) await other(b, "4", u);
  for (const lv of ["1", "2", "3", "s1", "s2"]) await other(b, lv);
  await b.close(); console.log(fails ? `${fails} FAILURE(S)` : "ALL OK"); process.exit(fails ? 1 : 0);
})();
