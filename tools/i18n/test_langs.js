/* Playwright checks for the map-based app languages and the exam-language notice.
   Server: cd <repo> && python3 -m http.server 8810
   Run:    NODE_PATH=$(npm root -g) node tools/i18n/test_langs.js [http://localhost:8810/app/] [screenshot dir]
   Each new language gets a tiny fake map (served instead of app/i18n/<lang>.js and <lang>/<level>.js): the interface strings
   of src/core/000.json become "‹lang› English", plus the first string of the level scope. */
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
const BASE = process.argv[2] || "http://localhost:8810/app/", SHOT = process.argv[3] || "";
const SRC = path.join(__dirname, "src");
const NEW = ["de", "nl", "el", "ja", "ko", "zh-hant", "pt", "tr", "th"];
const LEVELS = { "3": "wine3", "1": "wine1", "2": "wine2", "s1": "spirits1", "s2": "spirits2" };
const SCOPE = { "1": "l1", "2": "l2", "s1": "s1", "s2": "s2" };
const EXAM = { wine1: ["en","zh-hant","nl","fr","de","el","it","ja","ko","pt","es","tr","ru"], wine2: ["en","zh-hant","nl","fr","de","el","it","ja","ko","pt","es","tr"],
  wine3: ["en","nl","fr","de","el","ja","ko","pt","es"], spirits1: ["en","zh-hant","fr","de","ko","pt","es","th","tr"], spirits2: ["en","zh-hant","fr","de","pt","es"] };
const ui = JSON.parse(fs.readFileSync(path.join(SRC, "core", "000.json"), "utf8"));
const lvFirst = sc => JSON.parse(fs.readFileSync(path.join(SRC, sc, "000.json"), "utf8"))[0].en;
const fake = (lg, file) => { const m = {};
  if (!file.includes("/")) ui.forEach(x => { m[x.en] = "‹" + lg + "› " + x.en; });
  else { const sc = file.split("/")[1]; m[lvFirst(sc)] = "‹" + lg + "› " + lvFirst(sc); }
  return `window.TWG_I18N=window.TWG_I18N||{};TWG_I18N[${JSON.stringify(lg)}]=Object.assign(TWG_I18N[${JSON.stringify(lg)}]||{},${JSON.stringify(m)});(window.TWG_I18N_F=window.TWG_I18N_F||{})[${JSON.stringify(file)}]=1;`; };
let fails = 0; const bad = (...a) => { fails++; console.log("FAIL", ...a); };
const external = t => /ERR_TUNNEL|ERR_NAME|ERR_CONNECTION|ERR_INTERNET|ERR_PROXY|net::ERR_FAILED|status of 40[34].*(supabase|stripe|google)/i.test(t);

async function open(b, lg, lv, opt = {}) {
  const ctx = await b.newContext({ viewport: { width: opt.w || 375, height: 812 }, locale: opt.locale || "en-GB" });
  await ctx.addInitScript(([l, v, keepLang]) => { try { localStorage.setItem("wset3-onb", "1"); localStorage.setItem("twg-level", v); if (l && !keepLang) localStorage.setItem("wset3-lang", l); } catch (e) {} }, [lg, lv, !!opt.noLang]);
  await ctx.route(/\/app\/i18n\/(de|nl|el|ja|ko|zh-hant|pt|tr|th)(\/(l1|l2|s1|s2))?\.js/, r => {
    const m = /\/app\/i18n\/([\w-]+(?:\/\w+)?)\.js/.exec(r.request().url()); const f = m[1], l = f.split("/")[0];
    r.fulfill({ contentType: "application/javascript", body: fake(l, f) }); });
  await ctx.route(/supabase\.co|stripe\.com|fonts\.g/, r => r.abort());
  const p = await ctx.newPage(), errs = [];
  p.on("console", m => { if (m.type() === "error" && !external(m.text())) errs.push(m.text()); });
  p.on("pageerror", e => errs.push("pageerror: " + e.message));
  p.on("requestfailed", q => { if (!/supabase|stripe|fonts\.g/.test(q.url())) errs.push("requestfailed " + q.url()); });
  p.on("response", r => { if (r.status() >= 400 && /\/app\//.test(r.url())) errs.push(r.status() + " " + r.url()); });
  await p.goto(BASE + (opt.query || ""), { waitUntil: "load", timeout: 120000 });
  await p.waitForFunction(() => typeof render === "function" && document.querySelector("#main section"), null, { timeout: 60000 });
  await p.waitForTimeout(900);
  return { ctx, p, errs };
}
const state = p => p.evaluate(() => ({ lang, on: TES.on, html: document.documentElement.lang, tabs: [...document.querySelectorAll("nav.tabs button .tl")].map(e => e.textContent),
  banner: !!document.querySelector(".exnote[data-exn]"), dlg: !!document.querySelector(".exdlg"), lvl: exLvl(), view,
  over: Math.round(Math.max(0, ...[...document.querySelectorAll("body *")].filter(e => { if (e.closest("svg") || !e.getClientRects().length) return false; for (let a = e; a && a !== document.body; a = a.parentElement) { const c = getComputedStyle(a); if (c.position === "fixed" || (a !== e && c.overflowX !== "visible")) return false; } return true; }).map(e => e.getBoundingClientRect().right)) - window.innerWidth),   /* layout overflow (animated SVG internals excluded) */ lvKeys: Object.keys(TES.m || {}).length, T_en_tab: T.en.tab_home }));

(async () => {
  const b = await chromium.launch();
  // 1. every new language × every level: translations, notice per table, no errors, 375 px
  for (const lg of NEW) for (const [lv, key] of Object.entries(LEVELS)) {
    const { ctx, p, errs } = await open(b, lg, lv);
    const s = await state(p), want = !EXAM[key].includes(lg);
    if (s.lang !== lg || !s.on) bad(lg, lv, "lang/TES", s.lang, s.on);
    if (!s.tabs.some(x => x.startsWith("‹" + lg + "›"))) bad(lg, lv, "tabs not translated", s.tabs);
    if (s.lvl !== key) bad(lg, lv, "level", s.lvl);
    if (s.banner !== want || s.dlg !== want) bad(lg, lv, "notice", { want, banner: s.banner, dlg: s.dlg });
    if (s.over > 0) bad(lg, lv, "horizontal overflow", s.over);
    if (SCOPE[lv]) { const ok = await p.evaluate(k => TES.m[k] != null, lvFirst(SCOPE[lv])); if (!ok) bad(lg, lv, "level file not merged"); }
    if (errs.length) bad(lg, lv, "errors", errs.slice(0, 4));
    if (SHOT && (lv === "3" || lg === "tr")) await p.screenshot({ path: path.join(SHOT, `${lg}-${lv}.png`) });
    console.log(lg.padEnd(7), lv.padEnd(2), "notice", want ? "yes" : "no ", "ok");
    await ctx.close();
  }
  // 2. native languages and Spanish unchanged (no map markers), notice still follows the table (it on L3 / spirits → notice)
  for (const lg of ["it", "fr", "en", "es", "es-ar"]) for (const [lv, key] of Object.entries(LEVELS)) {
    const { ctx, p, errs } = await open(b, lg, lv);
    const s = await state(p), want = !EXAM[key].includes(lg === "es-ar" ? "es" : lg);
    const exp = await p.evaluate(() => [...document.querySelectorAll("nav.tabs button")].map(b2 => b2.dataset.v).map(v => T[lang]["tab_" + v]));
    if (s.tabs.some(x => x.includes("‹"))) bad(lg, lv, "marker in native language");
    if (JSON.stringify(s.tabs) !== JSON.stringify(exp)) bad(lg, lv, "tabs", s.tabs, exp);
    if (s.on !== (lg.startsWith("es"))) bad(lg, lv, "TES.on", s.on);
    if (lg.startsWith("es") && s.lvKeys < 1000) bad(lg, lv, "Spanish map not loaded", s.lvKeys);
    if (s.banner !== want) bad(lg, lv, "notice", want, s.banner);
    if (errs.length) bad(lg, lv, "errors", errs.slice(0, 4));
    if (SHOT && lv === "3") await p.screenshot({ path: path.join(SHOT, `${lg}-${lv}.png`) });
    console.log(lg.padEnd(7), lv.padEnd(2), "notice", want ? "yes" : "no ", "ok");
    await ctx.close();
  }
  // 3. detection from the browser language and from ?lang=
  for (const [loc, want] of [["de-AT", "de"], ["zh-TW", "zh-hant"], ["zh-HK", "zh-hant"], ["zh-CN", "en"], ["pt-PT", "pt"], ["th-TH", "th"], ["es-AR", "es-ar"], ["it-IT", "it"]]) {
    const { ctx, p } = await open(b, "", "3", { locale: loc, noLang: true });
    const l = await p.evaluate(() => lang); if (l !== want) bad("detect", loc, l, want); else console.log("detect", loc, "→", l, "ok"); await ctx.close();
  }
  { const { ctx, p } = await open(b, "", "2", { query: "?lang=zh-TW", noLang: true }); const s = await state(p);
    if (s.lang !== "zh-hant" || !s.tabs[0].startsWith("‹zh-hant›") || s.html !== "zh-Hant-TW") bad("?lang=zh-TW", s); else console.log("?lang=zh-TW ok"); await ctx.close(); }
  // 4. switching without reload: settings → Deutsch on L2; chip in the notice; dismissal remembered; compact notice in settings
  { const { ctx, p, errs } = await open(b, "it", "3");
    if (!(await state(p)).banner) bad("it L3 banner missing");
    await p.click(".exdlg [data-exok]"); await p.click("[data-exnx]");
    await p.evaluate(() => render()); if ((await state(p)).banner) bad("dismiss not remembered");
    await p.evaluate(() => { view = "settings"; render(); });
    if (!(await p.$(".setv .exnote.sm"))) bad("compact notice missing in settings");
    if (SHOT) await p.screenshot({ path: path.join(SHOT, "it-settings.png"), fullPage: true });
    await p.click('[data-set="lang:de"]'); await p.waitForTimeout(500);
    let s = await state(p); if (s.lang !== "de" || !s.tabs[0].startsWith("‹de›")) bad("settings switch", s.lang, s.tabs);
    const ok = await p.$(".setv .exnote.sm.ok"); if (!ok) bad("compact notice (available) missing for de on L3");
    if (SHOT) await p.screenshot({ path: path.join(SHOT, "de-settings.png"), fullPage: true });
    await p.evaluate(() => { view = "home"; setLangTo("th"); }); await p.waitForTimeout(500);
    s = await state(p); if (!s.banner) bad("th on L3: banner missing");
    await p.click(".exdlg [data-exlang=\"en\"]"); await p.waitForTimeout(400);
    s = await state(p); if (s.lang !== "en" || s.banner) bad("chip switch to en", s.lang, s.banner);
    if (errs.length) bad("switch errors", errs.slice(0, 4)); else console.log("switching ok");
    await ctx.close(); }
  { const { ctx, p, errs } = await open(b, "fr", "s2");   // header picker at desktop width
    await p.setViewportSize({ width: 1280, height: 900 }); await p.click("#lang-ko"); await p.waitForTimeout(500);
    const s = await state(p); if (s.lang !== "ko" || !s.on) bad("header picker ko", s.lang);
    const lvl = await p.evaluate(() => window.TWG_I18N_F && window.TWG_I18N_F["ko/s2"]); if (!lvl) bad("level file not loaded on switch");
    if (SHOT) await p.screenshot({ path: path.join(SHOT, "ko-s2-desktop.png") });
    if (errs.length) bad("picker errors", errs.slice(0, 4)); else console.log("header picker ok");
    await ctx.close(); }
  // 5. a missing translation file: English, no crash
  { const ctx = await b.newContext({ viewport: { width: 375, height: 812 } });
    await ctx.addInitScript(() => { localStorage.setItem("wset3-onb", "1"); localStorage.setItem("wset3-lang", "nl"); localStorage.setItem("twg-level", "2"); });
    await ctx.route(/\/app\/i18n\/nl/, r => r.fulfill({ status: 404, body: "" }));
    const p = await ctx.newPage(), pe = []; p.on("pageerror", e => pe.push(e.message));
    await p.goto(BASE); await p.waitForTimeout(2000);
    const s = await state(p); if (s.lang !== "nl" || s.tabs[0] !== (await p.evaluate(() => T.en.tab_home)) || pe.length) bad("missing file", s.tabs, pe); else console.log("missing file → English ok");
    await ctx.close(); }
  await b.close();
  console.log(fails ? `${fails} FAILURES` : "ALL OK"); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
