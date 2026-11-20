/* Playwright checks for app/sfx.js (sounds) at 375 px.
   Server: cd <repo> && python3 -m http.server 8871
   Run:    NODE_PATH=$(npm root -g) node tools/sfx/test_sfx.js [http://localhost:8871/app/] [screenshot dir]
   TWG_SFX.log lists every sound actually sent to the AudioContext, TWG_SFX.state() the context state. */
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
const BASE = process.argv[2] || "http://localhost:8871/app/", SHOT = process.argv[3] || "";
const ROOT = path.join(__dirname, "..", "..");
let fails = 0, checks = 0; const bad = (...a) => { fails++; console.log("FAIL", ...a); };
const eq = (tag, got, want) => { checks++; if (JSON.stringify(got) !== JSON.stringify(want)) bad(tag, "got", JSON.stringify(got), "want", JSON.stringify(want)); };
const external = t => /ERR_TUNNEL|ERR_NAME|ERR_CONNECTION|ERR_INTERNET|ERR_PROXY|net::ERR_FAILED|status of 40[34].*(supabase|stripe|google)/i.test(t);
async function open(b, lg, lv, opt = {}) {
  const ctx = await b.newContext({ viewport: { width: 375, height: 812 }, locale: "en-GB", reducedMotion: opt.rm ? "reduce" : "no-preference", hasTouch: true });
  await ctx.addInitScript(([l, v, pre]) => { try { if (sessionStorage.getItem("t-init")) return; sessionStorage.setItem("t-init", "1"); localStorage.setItem("wset3-onb", "1"); localStorage.setItem("twg-level", v); localStorage.setItem("wset3-lang", l); if (pre != null) localStorage.setItem("twg-sfx", pre); } catch (e) {} }, [lg, lv, opt.pre == null ? null : opt.pre]);
  await ctx.route(/supabase\.co|stripe\.com|fonts\.g/, r => r.abort());
  const p = await ctx.newPage(), errs = [];
  p.on("console", m => { if (m.type() === "error" && !external(m.text())) errs.push(m.text()); });
  p.on("pageerror", e => errs.push("pageerror: " + e.message));
  p.on("response", r => { if (r.status() >= 400 && /\/app\//.test(r.url())) errs.push(r.status() + " " + r.url()); });
  await load(p, opt.query);
  return { ctx, p, errs };
}
async function load(p, q) { await p.goto(BASE + (q || ""), { waitUntil: "load", timeout: 120000 });
  await p.waitForFunction(() => typeof render === "function" && document.querySelector("#main section") && window.TWG_SFX, null, { timeout: 60000 }); await p.waitForTimeout(700); }
const st = p => p.evaluate(() => Object.assign(TWG_SFX.state(), { log: TWG_SFX.log.map(x => x.n) }));
const names = async (p, from) => (await st(p)).log.slice(from);
const n = async p => (await st(p)).log.length;
const settle = (p, ms) => p.waitForTimeout(ms || 120);
async function dismiss(p) { const d = p.locator(".exdlg [data-exok]"); if (!(await d.count())) return false; await d.click(); await p.waitForTimeout(150); return true; }
async function answer(p, right) {   /* taps a quiz option; returns the sounds it produced */
  const c = p.locator(`.choice[data-o="${right ? 0 : 1}"]`); await c.scrollIntoViewIfNeeded(); await p.waitForTimeout(450);   /* the app ignores taps right after a scroll */
  const k0 = await n(p); await c.click(); await settle(p);   /* 1st tap selects (tick), Confirm answers */
  const pre = await names(p, k0); if (pre.join() !== "tap" && !(await p.evaluate(() => TWG_SFX.examOn() || !TWG_SFX.enabled))) bad("selecting an option should tick", pre);
  const k = await n(p); await p.locator("[data-qzconf]").click({ timeout: 5000 }).catch(async e => { console.log("DEBUG", await p.evaluate(() => ({ q: JSON.stringify(quiz).slice(0, 400), view, ch: [...document.querySelectorAll(".choice")].map(x => x.className + x.dataset.o + x.disabled), sy: scrollY, TG: JSON.stringify(TG), now: Date.now(), top: document.elementFromPoint(187, 400).outerHTML.slice(0, 200) }))); throw e; }); await settle(p); return names(p, k); }

(async () => {
  const b = await chromium.launch({ args: ["--autoplay-policy=user-gesture-required"] });
  for (const [lg, lv] of [["it", "3"], ["it", "1"], ["it", "2"], ["it", "s1"], ["it", "s2"], ["en", "3"], ["en", "1"], ["en", "2"], ["en", "s1"], ["en", "s2"], ["it", "4"], ["en", "4"], ["de", "3"], ["de", "2"]]) {
    const tag = lg + "/" + lv, { ctx, p, errs } = await open(b, lg, lv);
    let s = await st(p);
    eq(tag + " before any gesture: on, no AudioContext, nothing played", [s.on, s.unlocked, s.ctx, s.log.length], [true, false, null, 0]);
    eq(tag + " play() before a gesture is refused", await p.evaluate(() => TWG_SFX.play("correct")), false);
    /* tap on a tab (first close the exam-language notice where the app shows one: also a tap) */
    if (await dismiss(p)) eq(tag + " notice OK = tap", (await st(p)).log, ["tap"]);
    let k = await n(p); await p.locator("nav.tabs button").nth(1).click(); await settle(p); s = await st(p);
    eq(tag + " tab tap", [s.log.slice(k), s.ctx], [["tap"], "running"]);
    /* practice quiz: right, wrong, right -> finished */
    await p.evaluate(() => startQuiz(shuffle(BANK.map(x => x.id)).slice(0, 3), "practice", [])); await settle(p);
    eq(tag + " right answer", await answer(p, true), ["correct"]);
    k = await n(p); await p.locator("#q-next").click(); await settle(p); eq(tag + " next = tap", await names(p, k), ["tap"]);
    eq(tag + " wrong answer", await answer(p, false), ["wrong"]);
    await p.locator("#q-next").click(); await settle(p, 600);
    eq(tag + " right answer 2", await answer(p, true), ["correct"]);
    k = await n(p); await p.locator("#q-next").click(); await settle(p, 700);
    eq(tag + " quiz finished (2/3)", (await names(p, k)).filter(x => x !== "tap"), ["complete"]);
    /* streak of three */
    await p.evaluate(() => { quiz = null; startQuiz(shuffle(BANK.map(x => x.id)).slice(0, 4), "practice", []); }); await settle(p, 1700);
    const seq = []; for (let i = 0; i < 3; i++) { seq.push(...await answer(p, true)); await p.locator("#q-next").click(); await settle(p, i === 1 ? 950 : 150); }
    eq(tag + " three in a row (the app's streak carries over from the last right answer of the quiz before)", seq, ["correct", "streak", "correct"]);
    await p.evaluate(() => { quiz = null; go("home"); }); await settle(p, 1700);
    /* flashcard flip */
    if (lv === "3") { await p.evaluate(() => go("flash")); await settle(p); await p.locator('[data-fc="start"]').first().click(); await settle(p);
      k = await n(p); await p.locator('[data-fc="flip"]').first().click(); await settle(p); eq(tag + " flashcard flip", await names(p, k), ["flip"]);
      k = await n(p); await p.locator('[data-fc="yes"]').click(); await settle(p); eq(tag + " flashcard known = tap", await names(p, k), ["tap"]);
    } else if (lv === "4") { await p.evaluate(() => go("l2fl")); await settle(p);
      k = await n(p); await p.locator('[data-d4="flip"]').first().click(); await settle(p); eq(tag + " diploma flashcard flip", await names(p, k), ["flip"]);
      await p.evaluate(() => go("play")); await settle(p); await p.locator('[data-d4="match"]').click(); await settle(p);
      k = await n(p); await p.locator('.l2mc[data-s="L"][data-i="0"]').click(); await settle(p); await p.locator('.l2mc[data-s="R"][data-i="0"]').click(); await settle(p);
      eq(tag + " diploma match pair", await names(p, k), ["tap", "correct"]);
      k = await n(p); await p.locator('.l2mc[data-s="L"][data-i="1"]').click(); await settle(p); await p.locator('.l2mc[data-s="R"][data-i="2"]').click(); await settle(p);
      eq(tag + " diploma match miss", await names(p, k), ["tap", "wrong"]);
    } else { await p.evaluate(() => go("l2fl")); await settle(p);
      k = await n(p); await p.locator('[data-l2="flip"]').click(); await settle(p); eq(tag + " flashcard flip", await names(p, k), ["flip"]);
      /* pair matching */
      await p.evaluate(() => go("play")); await settle(p); await p.locator('[data-l2="match"]').click(); await settle(p);
      k = await n(p); await p.locator('.l2mc[data-s="L"][data-i="0"]').click(); await settle(p); await p.locator('.l2mc[data-s="R"][data-i="0"]').click(); await settle(p);
      eq(tag + " match pair", await names(p, k), ["tap", "correct"]);
      k = await n(p); await p.locator('.l2mc[data-s="L"][data-i="1"]').click(); await settle(p); await p.locator('.l2mc[data-s="R"][data-i="2"]').click(); await settle(p);
      eq(tag + " match miss", await names(p, k), ["tap", "wrong"]); }
    /* mock / timed exam: silent until the result */
    if (lv === "3") { await p.evaluate(() => go("exam")); await settle(p);
      for (const x of ["open", "sat", "map"]) await p.locator(`input[data-mks="${x}"]`).uncheck();
      await p.locator("#mk-n").selectOption("10"); k = await n(p); await p.locator("#mk-start").click(); await settle(p, 300);
      eq(tag + " mock running", (await st(p)).exam, true);
      const k2 = await n(p), nq = await p.evaluate(() => MK.mcq.items.length);
      await p.locator("#main .choice").nth(1).click(); await settle(p); await p.locator("#mk-next").click(); await settle(p);   /* choosing and Next inside the mock: no sound */
      await p.evaluate(() => { MK.mcq.items.forEach(x => { x.pick = 0; }); }); await settle(p);
      eq(tag + " mock exam silent (" + nq + " q)", await names(p, k2), []);
      await p.evaluate(() => { view = "exam"; render(); return mkFinish(); }); await settle(p, 300);
      eq(tag + " mock passed", (await names(p, k2)), ["fanfare"]);
    } else if (lv === "4") {
      /* written answer marked: sufficient = fanfare, not sufficient = two neutral notes */
      await p.evaluate(() => { go("open"); openQ(OPEN[0].id); }); await settle(p, 1700);
      k = await n(p); await p.evaluate(() => { const o = OPEN[0]; ODR[o.id] = o.parts.map(x => Array.isArray(x.k) ? x.k[2] : x.k); return gradeOpen(o.id); }); await settle(p, 300);
      eq(tag + " written answer sufficient", [await names(p, k), await p.evaluate(() => { const a = OA[OPEN[0].id].slice(-1)[0]; return a.s / a.m >= 0.55; })], [["fanfare"], true]);
      await settle(p, 1700); k = await n(p); await p.evaluate(() => { const o = OPEN[1]; ODR[o.id] = o.parts.map(() => "boh"); return gradeOpen(o.id); }); await settle(p, 300);
      eq(tag + " written answer not sufficient", await names(p, k), ["done"]);
      /* timed practice paper: silent, then only the result */
      p.on("dialog", d => d.accept().catch(() => {}));
      await p.evaluate(() => go("open")); await settle(p, 1700); await p.locator('[data-d4="paper"]').first().click(); await settle(p, 300); await p.locator('[data-d4="pgo"]').click(); await settle(p, 1300);
      eq(tag + " practice paper running (clock)", [(await st(p)).exam, await p.locator("#d4clock").count()], [true, 1]);
      const k2 = await n(p); await p.locator("textarea[data-d4pa]").first().fill("boh"); await p.locator("nav.tabs button").first().click().catch(() => {}); await settle(p);
      await p.evaluate(() => { view = "open"; render(); }); await settle(p);
      eq(tag + " practice paper silent", await names(p, k2), []);
      await p.locator('[data-d4="psub"]').click(); await settle(p, 400);
      eq(tag + " practice paper handed in -> result sound only", await names(p, k2), ["done"]);
      await p.evaluate(() => { quiz = null; go("home"); });
    } else { await p.evaluate(() => go("study")); await settle(p, 1700); k = await n(p); await p.locator('[data-l2="exam"]').click(); await settle(p, 1200);
      eq(tag + " timed exam running (clock)", [(await st(p)).exam, await p.locator("#l2clock").count()], [true, 1]);
      const k2 = await n(p);
      for (let i = 0; i < 2; i++) { await p.locator(".choice").first().scrollIntoViewIfNeeded(); await p.waitForTimeout(450); await p.locator(".choice").first().click(); await settle(p); await p.locator("[data-qzconf]").click(); await settle(p); const nx = p.locator("#q-next"); if (await nx.count()) { await nx.click(); await settle(p); } }
      eq(tag + " timed exam silent", await names(p, k2), []);
      await p.evaluate(() => { quiz.items.forEach(x => { x.pick = 0; }); quiz.i = quiz.items.length - 1; nextQ(); }); await settle(p, 700);
      eq(tag + " exam passed -> result sound only", await names(p, k2), ["fanfare"]);
      await p.evaluate(() => { quiz = null; startQuiz(BANK.map(x => x.id).slice(0, 4), "exam", []); quiz.items.forEach(x => { x.pick = 1; }); quiz.i = 3; }); await settle(p, 1700);
      k = await n(p); await p.evaluate(() => nextQ()); await settle(p, 700); eq(tag + " exam failed -> gentle", await names(p, k), ["done"]);
      await p.evaluate(() => { quiz = null; go("home"); }); }
    /* settings toggle */
    await p.evaluate(() => { quiz = null; go("settings"); }); await settle(p, 300);
    const row = p.locator("#sfx-row"); eq(tag + " settings row", await row.count(), 1);
    const label = await row.locator("b").first().innerText(), want = { it: "🔊 Suoni", en: "🔊 Sounds", de: "🔊 Töne" }[lg];
    eq(tag + " label", label, want);
    eq(tag + " row fits 375", await p.evaluate(() => { const r = document.getElementById("sfx-row").getBoundingClientRect(); return r.right <= innerWidth && r.left >= 0 && document.documentElement.scrollWidth <= innerWidth; }), true);
    if (SHOT && lv === "3") { await row.scrollIntoViewIfNeeded(); await p.screenshot({ path: path.join(SHOT, "settings-" + lg + ".png") }); }
    k = await n(p); await row.locator('[data-sfx="0"]').click(); await settle(p); s = await st(p);
    eq(tag + " off: context closed, stored", [s.on, s.ctx, await p.evaluate(() => localStorage.getItem("twg-sfx")), await row.locator("b").first().innerText().then(x => x.slice(0, 2))], [false, null, "0", "🔇"]);
    await p.locator("nav.tabs button").nth(2).click(); await settle(p);
    await p.evaluate(() => startQuiz(shuffle(BANK.map(x => x.id)).slice(0, 2), "practice", [])); await settle(p); await answer(p, true); await p.locator("#q-next").click(); await answer(p, false); await p.locator("#q-next").click(); await settle(p, 600); s = await st(p);
    eq(tag + " off: no sound, no AudioContext", [s.log.length - k, s.ctx], [0, null]);
    await load(p); await dismiss(p); await p.locator("nav.tabs button").nth(1).click(); await settle(p); s = await st(p);
    eq(tag + " off survives reload", [s.on, s.ctx, s.log.length], [false, null, 0]);
    await p.evaluate(() => go("settings")); await settle(p, 300); await p.locator('#sfx-row [data-sfx="1"]').click(); await settle(p); s = await st(p);
    eq(tag + " on again: bleat as confirmation", [s.on, s.ctx, s.log, await p.evaluate(() => localStorage.getItem("twg-sfx"))], [true, "running", ["bleat"], "1"]);
    k = await n(p); await p.locator("#sfx-row [data-sfxp]").click(); await settle(p);
    eq(tag + " try the sounds button opens the panel", [await names(p, k), await p.locator("#sfx-panel").count()], [["tap"], 1]);
    k = await n(p); await p.locator('[data-sfxt="correct:1"]').click(); await settle(p); eq(tag + " panel plays", await names(p, k), ["correct"]);
    await p.locator('[data-sfxt="x"]').click(); await settle(p);
    /* hidden page */
    eq(tag + " hidden page = silent", await p.evaluate(() => { Object.defineProperty(document, "hidden", { get: () => true, configurable: true }); const r = TWG_SFX.play("correct"); delete document.hidden; return r; }), false);
    if (errs.length) bad(tag, "console errors", errs.slice(0, 4));
    console.log("ok", tag, "(checks so far " + checks + ", fails " + fails + ")");
    await ctx.close();
  }
  /* reduced motion: off by default, can be switched on */
  { const { ctx, p, errs } = await open(b, "en", "3", { rm: true }); await dismiss(p); await p.locator("nav.tabs button").nth(1).click(); await settle(p); let s = await st(p);
    eq("reduced motion: default off", [s.on, s.ctx, s.log.length], [false, null, 0]);
    await p.evaluate(() => go("settings")); await settle(p, 300); eq("reduced motion: row shows off", await p.locator('#sfx-row [data-sfx="0"]').getAttribute("aria-pressed"), "true");
    await p.locator('#sfx-row [data-sfx="1"]').click(); await settle(p); s = await st(p); eq("reduced motion: switched on", [s.on, s.log], [true, ["bleat"]]);
    if (errs.length) bad("rm console errors", errs.slice(0, 4)); await ctx.close(); }
  /* the other interface languages have their own label */
  for (const [lg, w] of [["fr", "Sons"], ["es", "Sonidos"], ["es-ar", "Sonidos"], ["nl", "Geluiden"], ["el", "Ήχοι"], ["ja", "サウンド"], ["ko", "소리"], ["zh-hant", "音效"], ["pt", "Sons"], ["tr", "Sesler"], ["th", "เสียง"]]) {
    const { ctx, p, errs } = await open(b, lg, "3"); await dismiss(p); await p.evaluate(() => go("settings")); await settle(p, 300);
    eq(lg + " label", await p.locator("#sfx-row b").first().innerText(), "🔊 " + w);
    eq(lg + " row fits 375", await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.getElementById("sfx-row").getBoundingClientRect().right <= innerWidth), true);
    if (errs.length) bad(lg, "console errors", errs.slice(0, 4)); await ctx.close(); }
  /* test panel (?sfx) and console helper */
  { const { ctx, p, errs } = await open(b, "en", "3", { query: "?sfx" }); eq("panel", await p.locator("#sfx-panel").count(), 1); await dismiss(p); const k = await n(p);
    await p.locator('[data-sfxt="bleat:2"]').click(); await settle(p); await p.locator('[data-sfxt="fanfare"]').click(); await settle(p);
    eq("panel plays", await names(p, k), ["bleat", "fanfare"]); eq("TWG_SFX.test", await p.evaluate(() => TWG_SFX.test("bleat")), true);
    if (SHOT) await p.screenshot({ path: path.join(SHOT, "panel.png") });
    await p.locator('[data-sfxt="x"]').click(); eq("panel closes", await p.locator("#sfx-panel").count(), 0);
    if (errs.length) bad("panel console errors", errs.slice(0, 4)); await ctx.close(); }
  /* app only: no public page loads sfx.js */
  { const hits = []; const walk = d => fs.readdirSync(d, { withFileTypes: true }).forEach(e => { const f = path.join(d, e.name);
      if (e.isDirectory()) { if (!/^(\.git|node_modules|tools|scratchpad|mobile)$/.test(e.name) && f !== path.join(ROOT, "app")) walk(f); } else if (/\.html$/.test(e.name) && /sfx\.js/.test(fs.readFileSync(f, "utf8"))) hits.push(f); });
    walk(ROOT); eq("public pages do not load sfx.js", hits, []);
    eq("the other deferred scripts are still loaded", ["ar", "photos", "hqresult", "account-delete"].map(x => new RegExp('<script src="' + x + '\\.js\\?v=\\d+" defer></script>').test(fs.readFileSync(path.join(ROOT, "app", "index.html"), "utf8").slice(-600))), [true, true, true, true]);
    eq("app loads sfx.js once, deferred", (fs.readFileSync(path.join(ROOT, "app", "index.html"), "utf8").match(/<script src="sfx\.js\?v=\d+" defer><\/script>/g) || []).length, 1); }
  await b.close();
  console.log(fails ? "FAILED " + fails : "ALL OK", "(" + checks + " checks)"); process.exit(fails ? 1 : 0);
})();
