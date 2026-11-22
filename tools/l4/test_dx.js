/* Playwright checks for content added to an existing Diploma unit (new lessons, written questions, tasting notes),
   plus a smoke test that the other units and levels still load.
   New items are found by diffing app/l4/<unit>/content.js against origin/main.
   Server: cd <repo> && python3 -m http.server 8931
   Run:    NODE_PATH=$(npm root -g) node tools/l4/test_dx.js D5 [http://localhost:8931/app/] [screenshot dir] */
const { chromium } = require("playwright");
const { execSync } = require("child_process");
const fs = require("fs"), path = require("path");
const UNIT = (process.argv[2] || "D5").toUpperCase(), BASE = process.argv[3] || "http://localhost:8931/app/", SHOT = process.argv[4] || "";
const ROOT = path.join(__dirname, "..", "..");
const load = src => { const window = {}; new Function("window", src)(window); return window["TWG_" + UNIT + "C"]; };
const NOW = load(fs.readFileSync(path.join(ROOT, "app/l4", UNIT.toLowerCase(), "content.js"), "utf8"));
let OLD; try { OLD = load(execSync(`git -C ${ROOT} show origin/main:app/l4/${UNIT.toLowerCase()}/content.js`, { encoding: "utf8", maxBuffer: 1 << 26 })); } catch (e) { OLD = { lessons: [], open: [] }; }
const oldIds = new Set(OLD.open.map(o => o.id)), oldLes = new Set(OLD.lessons.map(l => l.t[2]));
const NEWO = NOW.open.filter(o => !oldIds.has(o.id)), NEWL = NOW.lessons.filter(l => !oldLes.has(l.t[2]));
console.log(`${UNIT}: ${NEWO.length} new written/tasting items (${NEWO.filter(o => o.tas).length} tasting), ${NEWL.length} new lessons`);
const LI = { it: 0, fr: 1, en: 2, es: 3 };
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
  const dlg = await p.$(".exdlg [data-exok]"); if (dlg) { await dlg.click(); await p.waitForTimeout(150); }
  return { ctx, p, errs };
}
const overflow = p => p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
const hub = async p => { await p.evaluate(() => { go("study"); }); await p.waitForTimeout(150); };
async function unitRun(b, lg, w) {
  const tag = `${UNIT} ${lg} ${w}px`, k = LI[lg], { ctx, p, errs } = await open(b, lg, "4", w, UNIT);
  const chk = async what => { const o = await overflow(p); if (o > 1) bad(tag, what, "horizontal overflow", o); };
  await hub(p);
  const sel = await p.evaluate(() => (document.querySelector('.d4units [aria-selected="true"] b') || {}).innerText);
  if (sel !== UNIT) bad(tag, "unit not selected", sel);
  const tx = await p.evaluate(() => (document.querySelector(".d4hub") || {}).innerText || "");
  if (/d4[A-Z]\w+/.test(tx)) bad(tag, "untranslated key in hub", tx.match(/d4[A-Z]\w+/)[0]);
  await chk("hub"); if (SHOT) await p.screenshot({ path: `${SHOT}/${UNIT}-${lg}-${w}-hub.png`, fullPage: true });
  /* new lessons render */
  for (const l of NEWL) {
    await hub(p); await p.click('.d4hub [data-go="l2les"]'); await p.waitForTimeout(150);
    await p.evaluate(() => document.querySelectorAll(".l2chap").forEach(d => d.open = true));
    const ok = await p.evaluate(t => { const x = [...document.querySelectorAll('.l2chap [data-d4="les"]')].find(e => e.innerText.trim() === t); if (x) x.click(); return !!x; }, l.t[k]);
    if (!ok) { bad(tag, "new lesson not listed", l.t[2]); continue; }
    await p.waitForTimeout(200);
    const art = await p.evaluate(() => (document.querySelector(".l2art") || {}).innerText || "");
    if (art.length < 800) bad(tag, "lesson too short", l.t[2], art.length);
    await chk("lesson " + l.t[2]); if (SHOT && w === 375) await p.screenshot({ path: `${SHOT}/${UNIT}-${lg}-lesson.png`, fullPage: true });
  }
  /* every new written question / tasting note opens and gets marked */
  let shot = 0;
  for (const o of NEWO) {
    await hub(p); await p.click(`.d4hub [data-d4="${o.tas ? "tas" : "open"}"]`); await p.waitForTimeout(150);
    const it = await p.$(`.d4oqi[data-oq="${o.id}"]`);
    if (!it) { bad(tag, "new item not listed", o.q[2].slice(0, 60)); continue; }
    await it.scrollIntoViewIfNeeded(); await it.click(); await p.waitForTimeout(200);
    const head = await p.evaluate(() => document.body.innerText);
    if (o.g && !/(nostra proposta|notre proposition|our own practice design|nuestra propuesta)/.test(head)) bad(tag, "marking guide label missing", o.q[2].slice(0, 60));
    const tas = await p.$$("textarea");
    if (tas.length !== o.parts.length) bad(tag, "answer boxes", tas.length, "expected", o.parts.length, o.q[2].slice(0, 50));
    for (let i = 0; i < tas.length; i++) await tas[i].fill((o.parts[i] || o.parts[0]).k[k].replace(/;/g, ". "));
    await p.click("#o-grade"); await p.waitForTimeout(400);
    const res = await p.evaluate(() => document.body.innerText);
    const m = res.match(/(\d+(?:[.,]\d)?)\s*\/\s*(\d+)/);
    if (!m) bad(tag, "no mark after grading", o.q[2].slice(0, 60));
    else { const got = parseFloat(m[1].replace(",", ".")), max = parseFloat(m[2]); if (!(got >= max * 0.6)) bad(tag, `key points scored low ${got}/${max}`, o.q[2].slice(0, 60)); }
    await chk("item " + o.q[2].slice(0, 40));
    if (SHOT && w === 375 && shot++ < 2) await p.screenshot({ path: `${SHOT}/${UNIT}-${lg}-item${shot}.png`, fullPage: true });
  }
  /* the practice paper still starts and is marked */
  await hub(p); const pk = await p.$('.mockcard[data-d4="paper"]');
  if (!pk) bad(tag, "no practice paper"); else {
    await pk.click(); await p.waitForTimeout(150); await p.click('[data-d4="pgo"]'); await p.waitForTimeout(250);
    const n = await p.$$eval(".d4pq", a => a.length); if (n < Math.min(3, (NOW.exam && NOW.exam.q) || 3)) bad(tag, "paper questions", n);
    const ta = await p.$(".d4pq textarea"); if (ta) await ta.fill("acidity tannin alcohol sugar flor solera oak acidité acidez acidità");
    await p.click('[data-d4="psub"]'); await p.waitForTimeout(400);
    if (!(await p.$(".result-score"))) bad(tag, "paper not marked"); await chk("paper result"); }
  errs.forEach(e => bad(tag, "console:", e)); await ctx.close();
}
async function other(b, lv, unit) {
  const { ctx, p, errs } = await open(b, "en", lv, 375, unit), tag = `level ${lv} ${unit || ""}`;
  if (lv === "4") { await hub(p); const u = await p.evaluate(() => (document.querySelector('.d4units [aria-selected="true"] b') || {}).innerText); if (u !== unit) bad(tag, "unit not selected", u);
    await p.click('.d4hub [data-go="l2les"]'); await p.waitForTimeout(150); if (!(await p.$$(".l2chap")).length) bad(tag, "no lessons");
    await hub(p); const pc = await p.$('.mockcard[data-d4="paper"], .mockcard[data-pk]'); if (!pc) bad(tag, "no practice paper");
    else { await pc.click(); await p.waitForTimeout(150); if (!(await p.$('[data-d4="pgo"]'))) bad(tag, "paper did not open"); } }
  else { const n = await p.evaluate(() => document.body.innerText.length); if (n < 200) bad(tag, "page empty"); }
  errs.forEach(e => bad(tag, "console:", e)); await ctx.close();
}
(async () => {
  const b = await chromium.launch();
  for (const lg of ["it", "fr", "en", "es"]) for (const w of [375, 1280]) await unitRun(b, lg, w);
  for (const u of ["D1", "D2", "D3", "D4", "D5"].filter(u => u !== UNIT)) await other(b, "4", u);
  for (const lv of ["1", "2", "3", "s1", "s2", "k1", "b1"]) await other(b, lv);
  await b.close(); console.log(fails ? `${fails} FAILURE(S)` : "ALL OK"); process.exit(fails ? 1 : 0);
})();
