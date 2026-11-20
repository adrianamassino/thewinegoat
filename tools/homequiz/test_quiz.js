/* Playwright check of the home quiz and of the result screen in the app (Supabase is stubbed: no real account, no network).
   Usage: NODE_PATH=$(npm root -g) node tools/homequiz/test_quiz.js http://localhost:8813 [outDir] [lang …]
   For each home (default en it de ja ar es-ar) at 375 px: every theme gives its fixed 20 questions (set.txt order) in the page language,
   a retake shows the same questions, a run resumes
   after a reload, the gate appears at the end without the score, the app shows score, recommendations and time estimate. */
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
const BASE = process.argv[2] || "http://localhost:8813", OUT = process.argv[3] || "/tmp/hq-shots";
const LANGS = process.argv.slice(4).length ? process.argv.slice(4) : ["en", "it", "de", "ja", "ar", "es-ar"];
const N = 20, MIXN = { w: 8, s: 5, b: 4, k: 3 };
const ROOT = path.resolve(__dirname, "../..");
const STUB = `window.supabase={createClient(){const cbs=[];const ses=()=>{try{return localStorage.getItem("stub-session")?{access_token:"x",user:{id:"00000000-0000-0000-0000-000000000001",email:"stub@example.invalid",user_metadata:{}}}:null}catch(e){return null}};
 window.__sbWrites=[];const q=(t)=>{const o={select(){return o},eq(){return o},maybeSingle:async()=>({data:null,error:null}),upsert:async(row)=>{window.__sbWrites.push({t,row});try{localStorage.setItem("stub-writes",JSON.stringify(window.__sbWrites))}catch(e){};return {error:null}},delete(){return o},then(r){return Promise.resolve({data:[],error:null}).then(r)}};return o};
 return {auth:{getSession:async()=>({data:{session:ses()}}),onAuthStateChange(cb){cbs.push(cb);return {data:{subscription:{unsubscribe(){}}}}},signOut:async()=>({}),signUp:async()=>({data:{session:null},error:null}),signInWithPassword:async()=>({error:null}),signInWithOtp:async()=>({error:null}),updateUser:async()=>({error:null}),resetPasswordForEmail:async()=>({error:null}),verifyOtp:async()=>({error:null}),signInWithOAuth:async()=>({error:null})},from:q,functions:{invoke:async()=>({data:null,error:null})},channel(){return {on(){return this},subscribe(){return this}}}}}};`;
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log("  FAIL " + m); } };
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const br = await chromium.launch();
  for (const lg of LANGS) {
    const ctx = await br.newContext({ viewport: { width: 375, height: 740 }, deviceScaleFactor: 2 });
    await ctx.route(/supabase-2\.119\.0\.js/, r => r.fulfill({ contentType: "application/javascript", body: STUB }));
    await ctx.route(u => !u.href.startsWith(BASE), r => r.abort());
    const page = await ctx.newPage(); const errs = [];
    page.on("console", m => { if (m.type() === "error" && !/Failed to load resource|net::ERR/.test(m.text())) errs.push(m.text()); });
    page.on("pageerror", e => errs.push("pageerror " + e.message));
    const home = BASE + (lg === "en" ? "/" : "/" + lg + "/");
    const bank = JSON.parse(fs.readFileSync(path.join(ROOT, "assets/homequiz", lg + ".json"), "utf8"));
    const BY = {}; for (const t of ["wine", "beer", "spirits", "sake"]) for (const q of bank[t]) BY[q.id] = q;
    ok(["wine", "beer", "spirits", "sake"].every(t => bank[t].length === N) && bank.mix.length === N, lg + " fixed sets of " + N);
    const flagged = Object.values(BY).filter(q => q.x).length;
    await page.goto(home, { waitUntil: "load" });
    /* nothing of the dialog outside the viewport or wider than its card (the home locks page scroll while the dialog is open) */
    const noOverflow = async tag => { const o = await page.evaluate(() => { const c = document.querySelector("#hqr") || document.querySelector(".hqz-card"), w = innerWidth; const bad = [...c.querySelectorAll("*"), c].filter(e => { const r = e.getBoundingClientRect(); return r.width && (r.right > w + 1 || r.left < -1); }).length; return [bad, c.scrollWidth - c.clientWidth, document.documentElement.scrollWidth - w, Math.round(document.documentElement.getBoundingClientRect().width) - w]; }); ok(!o[0] && o[1] <= 1 && o[2] <= 0 && o[3] === 0, `${lg} overflow ${tag} ${o}`); };
    const openQuiz = async () => { await page.click('.ctas3 a[data-hqz]'); await page.waitForSelector(".hqz:not([hidden]) .hqz-th"); };
    await openQuiz(); await noOverflow("picker");
    await page.screenshot({ path: `${OUT}/${lg}-1-picker.png` });
    /* focus trap + Esc */
    for (let k = 0; k < 9; k++) await page.keyboard.press("Tab");
    ok(await page.evaluate(() => !!document.activeElement.closest(".hqz")), lg + " focus stays in the dialog");
    await page.keyboard.press("Escape"); ok(await page.evaluate(() => document.querySelector(".hqz").hidden), lg + " Esc closes");
    let shot = 0, total = 0;
    for (const th of ["wine", "beer", "spirits", "sake", "mix"]) {
      await openQuiz(); await page.click(`.hqz-th[data-th=${th}]`); await page.waitForSelector(".hqz-q");
      const run = await page.evaluate(t => JSON.parse(localStorage.getItem("twg-hq-run"))[t], th);
      ok(run.ids.length === N && new Set(run.ids).size === N && new Set(run.ids.map(i => BY[i].t)).size >= 4, `${lg} ${th}: ${run.ids.length} questions`);
      const want = th === "mix" ? bank.mix : bank[th].map(q => q.id);
      ok(run.ids.join() === want.join(), `${lg} ${th}: the fixed set, in order`);
      if (th === "mix") { const c = {}; run.ids.forEach(i => c[i[0]] = (c[i[0]] || 0) + 1); ok(["w", "s", "b", "k"].every(k => c[k] === MIXN[k]), `${lg} mix split ${JSON.stringify(c)}`); }
      for (let n = 0; n < N; n++) {
        const st = await page.evaluate(() => ({ n: document.querySelector(".hqz-n").textContent, q: document.querySelector(".hqz-q").textContent, o: [...document.querySelectorAll(".hqz-o")].map(x => x.textContent) }));
        ok(st.n === `${n + 1} / ${N}`, `${lg} ${th} progress ${st.n} at ${n + 1}`);
        const q = BY[run.ids[n]]; ok(q && st.q === q.q && st.o.length === 4 && st.o.every(x => q.o.includes(x)), `${lg} ${th} q${n + 1} text is the ${lg} text`);
        if (n === 0 && th === "wine") { await noOverflow("question"); }
        /* answer: right on even questions, wrong on odd ones for wine; other themes vary */
        const right = th === "wine" ? n % 2 === 0 : th === "beer" ? n < 5 : th === "spirits" ? n % 3 !== 0 : th === "sake" ? n < 19 : n % 4 !== 0;
        const idx = await page.evaluate(r => { const b = [...document.querySelectorAll(".hqz-o")]; const i = b.findIndex(x => (x.getAttribute("data-o") === "0") === r); return i; }, right);
        await page.locator(".hqz-o").nth(idx).click();
        ok(await page.locator(".hqz-fb").count() === 1 && (await page.locator(".hqz-fb").textContent()).includes(q.e), `${lg} ${th} q${n + 1} explanation`);
        if (n === 1 && th === "wine") { await noOverflow("answer"); await page.screenshot({ path: `${OUT}/${lg}-2-question.png` }); }
        if (n === 2) { /* close, reload, resume at question 4 */
          await page.keyboard.press("Escape"); await page.reload({ waitUntil: "load" }); await openQuiz();
          ok((await page.locator(`.hqz-th[data-th=${th}] .hqz-run`).textContent()).includes("3/" + N), `${lg} ${th} resume badge`);
          if (th === "wine") await page.screenshot({ path: `${OUT}/${lg}-3-resume.png` });
          await page.click(`.hqz-th[data-th=${th}]`); await page.waitForSelector(".hqz-q");
          ok((await page.locator(".hqz-n").textContent()) === "4 / " + N, `${lg} ${th} resumes at 4`); continue;
        }
        await page.click("[data-hqz-next]"); total++;
      }
      await page.waitForSelector(".hqz-end");
      const g = await page.evaluate(() => ({ t: document.querySelector(".hqz-end").textContent, href: document.querySelector("[data-hqz-go]").getAttribute("href"), res: JSON.parse(localStorage.getItem("twg-hq-result")) }));
      ok(!/\d+\s*\/\s*\d+/.test(g.t.replace("?/" + N, "")) && !/%/.test(g.t), `${lg} ${th} gate shows no score`);
      ok(g.res.theme === th && g.res.total === N && Object.values(g.res.topics).reduce((a, x) => a + x[1], 0) === N && g.res.ts > 0, `${lg} ${th} result saved`);
      ok(/\/app\/\?lang=[a-z-]+#(lvl=(1|2|s1|s2)&)?go=signup$/.test(g.href) || (lg === "ar" && /\/app\/#(lvl=\w+&)?go=signup$/.test(g.href)), `${lg} ${th} link ${g.href}`);
      await noOverflow("gate"); if (th === "wine") await page.screenshot({ path: `${OUT}/${lg}-4-gate.png` });
      /* → the app (not signed in: the account window opens with the note), then "signed in" through the stub */
      await page.click("[data-hqz-go]");
      /* some homes first show their note on the exam language, then go on to the app */
      await page.waitForTimeout(400); if (await page.locator(".lnm button").isVisible().catch(() => false)) await page.click(".lnm button");
      await page.waitForURL(/\/app\//); 
      const lang2 = await page.evaluate(() => localStorage.getItem("wset3-lang"));
      if (th === "wine") { await page.waitForSelector("#acct-bg .hqr-note", { timeout: 15000 }); ok(await page.locator("#hqr-bg").count() === 0, lg + " no result before the account"); await page.screenshot({ path: `${OUT}/${lg}-5-app-signup.png` }); }
      await page.evaluate(() => localStorage.setItem("stub-session", "1")); await page.reload({ waitUntil: "load" });
      await page.waitForSelector("#hqr-bg #hqr-t", { timeout: 20000 });
      const r = await page.evaluate(() => ({ h: document.querySelector("#hqr-t").textContent, sc: document.querySelector(".hqr-sc").textContent, ring: document.querySelector(".hqr-ring").textContent, recs: document.querySelectorAll(".hqr ol li").length, links: [...document.querySelectorAll(".hqr ol a")].map(a => a.getAttribute("href")), w: document.querySelector(".hqr-tw").textContent, hrs: document.querySelector(".hqr-th").textContent, note: document.querySelector(".hqr-tn").textContent, tp: document.querySelectorAll(".hqr-tp li").length, rd: document.querySelector(".hqr-rd").textContent }));
      const exp = g.res.score;
      ok(r.h.includes(exp + "/" + N) && r.ring === Math.round(exp / N * 100) + "%" && r.sc.includes(String(exp)), `${lg} ${th} score ${r.h} ${r.ring}`);
      ok(r.recs >= 3 && r.recs <= 5, `${lg} ${th} ${r.recs} recommendations`); ok(r.links.length >= 1, `${lg} ${th} recommendation links`);
      ok(/\d/.test(r.w) && /\d/.test(r.hrs) && r.note.length > 10 && r.tp >= 4, `${lg} ${th} time estimate`);
      await page.click('[data-hqr-pace="1"]'); const w1 = await page.locator(".hqr-tw").textContent(); await page.click('[data-hqr-pace="3"]'); const w3 = await page.locator(".hqr-tw").textContent();
      ok(parseInt(w1.replace(/\D/g, "")) >= parseInt(w3.replace(/\D/g, "")) && (await page.locator('[data-hqr-pace="3"]').getAttribute("aria-pressed")) === "true", `${lg} ${th} pace ${w1} / ${w3}`);
      await page.click('[data-hqr-pace="2"]'); await noOverflow("result");
      ok((await page.locator("[data-hqr-mock]").count()) === (th === "wine" || th === "spirits" ? 1 : 0), `${lg} ${th} mock button`);
      await page.waitForFunction(() => (localStorage.getItem("stub-writes") || "").includes("homequiz/last"), null, { timeout: 5000 }).catch(() => ok(false, `${lg} ${th} account copy`));
      await page.screenshot({ path: `${OUT}/${lg}-6-result-${th}.png` });
      await page.evaluate(() => document.querySelector(".hqr").scrollTo(0, 99999)); await page.screenshot({ path: `${OUT}/${lg}-7-result-${th}-end.png` });
      console.log(`  ${lg} ${th}: ${exp}/${N} → app lang ${lang2} · ${r.w} · ${r.recs} recs · ${r.rd.slice(0, 70)}`);
      await page.keyboard.press("Escape"); ok(await page.locator("#hqr-bg").count() === 0, lg + " Esc closes the result");
      await page.reload({ waitUntil: "load" }); await page.waitForTimeout(1500); ok(await page.locator("#hqr-bg").count() === 0, lg + " result shown once");
      if (th === "wine" && lg === "en") {   /* the mock button opens the app's existing 50-question mock (Level 2) */
        await page.evaluate(() => window.twgHomeQuizResult.show()); await page.waitForSelector("[data-hqr-mock]");
        await page.click("[data-hqr-mock]"); await page.waitForLoadState("load"); await page.waitForTimeout(2500);
        const mk = await page.evaluate(() => ({ lvl: localStorage.getItem("twg-level"), n: (document.body.innerText.match(/(\d+)\s*\/\s*50\b/) || [])[0] || "" }));
        ok(mk.lvl === "2" && !!mk.n, `${lg} mock opens the Level 2 mock (${JSON.stringify(mk)})`);
        await page.screenshot({ path: `${OUT}/${lg}-8-mock.png` });
      }
      await page.evaluate(() => { localStorage.removeItem("stub-session"); localStorage.removeItem("stub-writes"); localStorage.removeItem("twg-level"); });
      await page.goto(home, { waitUntil: "load" });
      if (th === "beer") {   /* retake: the same 20 questions in the same order */
        await openQuiz(); await page.click(`.hqz-th[data-th=beer]`); await page.waitForSelector(".hqz-q");
        const r2 = await page.evaluate(() => JSON.parse(localStorage.getItem("twg-hq-run")).beer.ids);
        ok(r2.join() === bank.beer.map(q => q.id).join() && (await page.locator(".hqz-q").textContent()) === bank.beer[0].q, `${lg} retake shows the same questions`);
        await page.keyboard.press("Escape"); await page.evaluate(() => { const r = JSON.parse(localStorage.getItem("twg-hq-run")); delete r.beer; localStorage.setItem("twg-hq-run", JSON.stringify(r)); });
      }
    }
    ok(!flagged, `${lg}: ${flagged} questions still in English`);
    ok(!errs.length, `${lg} console errors: ${errs.slice(0, 3).join(" | ")}`);
    console.log(`${lg}: done, ${total} answers, ${errs.length} console errors`);
    await ctx.close();
  }
  await br.close(); console.log(fails ? `${fails} FAILED` : "ALL OK"); process.exit(fails ? 1 : 0);
})();
