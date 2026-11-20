/* Exports the app's UI dictionaries (T.en / T.it, as built at runtime) for every level, for extract_all.py.
   Usage: NODE_PATH=$(npm root -g) node tools/i18n/export_ui.js http://localhost:8810/app/ tools/i18n/ui
   Writes <out>/ui-<level>.json = {"en":{key:text|[texts]}, "it":{…}} for levels 3 (core), 1, 2, s1, s2, 4 (Diploma). */
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
const [base, out] = [process.argv[2] || "http://localhost:8810/app/", process.argv[3] || path.join(__dirname, "ui")];
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  for (const lv of ["3", "1", "2", "s1", "s2", "4"]) {
    const ctx = await b.newContext();
    await ctx.addInitScript(l => { try { localStorage.setItem("twg-level", l); localStorage.setItem("wset3-lang", "en"); localStorage.setItem("wset3-onb", "1"); } catch (e) {} }, lv);
    const p = await ctx.newPage();
    await p.goto(base + "?lang=en", { waitUntil: "load", timeout: 120000 });
    await p.waitForFunction(() => typeof T !== "undefined" && T.en && document.querySelector("#main"), null, { timeout: 60000 });
    await p.waitForTimeout(1500);
    const d = await p.evaluate(() => {
      const ok = v => typeof v === "string" || (Array.isArray(v) && v.every(x => typeof x === "string"));
      const o = { en: {}, it: {} };
      for (const k of Object.keys(T.en)) { const v = T.en[k]; if (!ok(v)) continue; o.en[k] = v; const i = T.it[k]; if (ok(i)) o.it[k] = i; }
      return o;
    });
    fs.writeFileSync(path.join(out, "ui-" + lv + ".json"), JSON.stringify(d));
    console.log("level", lv, Object.keys(d.en).length, "keys");
    await ctx.close();
  }
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
