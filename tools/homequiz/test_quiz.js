/* Playwright check of the home quiz (theme → level → 25 fixed questions with immediate feedback) and of the result screen in
   the app (Supabase is stubbed: no real account, no network).
   Usage: NODE_PATH=$(npm root -g) node tools/homequiz/test_quiz.js http://localhost:8813 [outDir] [lang …]
   For each home (default en it de ar), at 375 px and 1280 px, it runs Wine Level 1, Wine Diploma (w4) and Spirits Level 2 to
   the end: the level picker, 25 questions in the fixed order of assets/homequiz/<lang>/<set>.json, after each answer right/
   wrong + the correct option highlighted + the explanation, no score on the home, the account gate, then in the app the
   result for that level (score x/25, level name, topics, recommendations, time estimate with study mode / grade / pace,
   Diploma split by unit, review of the 25 answers). Also: a run resumes after a reload; no console errors; no overflow. */
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
const BASE = process.argv[2] || "http://localhost:8813", OUT = process.argv[3] || "/tmp/hq-shots";
const LANGS = process.argv.slice(4).length ? process.argv.slice(4) : ["en", "it", "de", "ar"];
const N = 25, ROOT = path.resolve(__dirname, "../..");
const RUNS = [["wine", "w1"], ["wine", "w4"], ["spirits", "s2"]];
const LVCODE = { w1: "1", w4: "4", s2: "s2" };
const STUB = `window.supabase={createClient(){const cbs=[];const ses=()=>{try{return localStorage.getItem("stub-session")?{access_token:"x",user:{id:"00000000-0000-0000-0000-000000000001",email:"stub@example.invalid",user_metadata:{}}}:null}catch(e){return null}};
 window.__sbWrites=[];const q=(t)=>{const o={select(){return o},eq(){return o},maybeSingle:async()=>({data:null,error:null}),upsert:async(row)=>{window.__sbWrites.push({t,row});try{localStorage.setItem("stub-writes",JSON.stringify(window.__sbWrites))}catch(e){};return {error:null}},delete(){return o},then(r){return Promise.resolve({data:[],error:null}).then(r)}};return o};
 return {auth:{getSession:async()=>({data:{session:ses()}}),onAuthStateChange(cb){cbs.push(cb);return {data:{subscription:{unsubscribe(){}}}}},signOut:async()=>({}),signUp:async()=>({data:{session:null},error:null}),signInWithPassword:async()=>({error:null}),signInWithOtp:async()=>({error:null}),updateUser:async()=>({error:null}),resetPasswordForEmail:async()=>({error:null}),verifyOtp:async()=>({error:null}),signInWithOAuth:async()=>({error:null})},from:q,functions:{invoke:async()=>({data:null,error:null})},channel(){return {on(){return this},subscribe(){return this}}}}}};`;
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log("  FAIL " + m); } };
const num = x => parseInt(String(x).replace(/[^\d]+/g, " ").trim().split(" ")[0]);
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const br = await chromium.launch();
  for (const lg of LANGS) for (const [W, H] of [[375, 740], [1280, 800]]) {
    const tag = `${lg}-${W}`;
    const ctx = await br.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
    await ctx.route(/supabase-2\.119\.0\.js/, r => r.fulfill({ contentType: "application/javascript", body: STUB }));
    await ctx.route(u => !u.href.startsWith(BASE), r => r.abort());
    const page = await ctx.newPage(); const errs = [];
    page.on("console", m => { if (m.type() === "error" && !/Failed to load resource|net::ERR/.test(m.text())) errs.push(m.text()); });
    page.on("pageerror", e => errs.push("pageerror " + e.message));
    const home = BASE + (lg === "en" ? "/" : "/" + lg + "/");
    const noOverflow = async where => { const o = await page.evaluate(() => { const c = document.querySelector("#hqr") || document.querySelector(".hqz:not([hidden]) .hqz-card"), w = innerWidth; const bad = c ? [...c.querySelectorAll("*"), c].filter(e => { const r = e.getBoundingClientRect(); return r.width && (r.right > w + 1 || r.left < -1); }).length : 0; return [bad, c ? c.scrollWidth - c.clientWidth : 0, document.documentElement.scrollWidth - w]; }); ok(!o[0] && o[1] <= 1 && o[2] <= 0, `${tag} overflow ${where} ${o}`); };
    const openQuiz = async () => { await page.click(".ctas3 a[data-hqz]"); await page.waitForSelector(".hqz:not([hidden]) .hqz-th"); };
    await page.goto(home, { waitUntil: "load" }); await page.evaluate(() => localStorage.clear());
    for (const [th, set] of RUNS) {
      const bank = JSON.parse(fs.readFileSync(path.join(ROOT, "assets/homequiz", lg, set + ".json"), "utf8")), Q = bank.qs;
      ok(Q.length === N && new Set(Q.map(q => q.id)).size === N, `${tag} ${set}: ${Q.length} questions`);
      await page.goto(home, { waitUntil: "load" }); await page.evaluate(() => localStorage.clear());
      await openQuiz(); await noOverflow("picker"); if (set === "w1") await page.screenshot({ path: `${OUT}/${tag}-1-picker.png` });
      await page.click(`.hqz-th[data-th=${th}]`); await page.waitForSelector(".hqz-lv");
      const lv = await page.evaluate(() => [...document.querySelectorAll(".hqz-lv")].map(b => b.getAttribute("data-set")));
      ok(lv.join() === (th === "wine" ? "w1,w2,w3,w4" : "s1,s2"), `${tag} ${th} levels ${lv}`);
      await page.waitForTimeout(300); await noOverflow("levels"); if (set !== "s2") await page.screenshot({ path: `${OUT}/${tag}-2-levels-${th}.png` });
      await page.click(`.hqz-lv[data-set=${set}]`); await page.waitForSelector(".hqz-q");
      let good = 0;
      for (let n = 0; n < N; n++) {
        const st = await page.evaluate(() => ({ n: document.querySelector(".hqz-n").textContent, q: document.querySelector(".hqz-q").textContent, o: [...document.querySelectorAll(".hqz-o")].map(x => x.textContent), chip: document.querySelector(".hqz-chip").textContent }));
        const q = Q[n];
        ok(st.n === `${n + 1} / ${N}` && st.q === q.q && st.o.length === q.o.length && st.o.every(x => q.o.includes(x)), `${tag} ${set} q${n + 1}: ${st.n} text matches`);
        const right = n % 2 === 0; if (right) good++;
        const idx = await page.evaluate(r => [...document.querySelectorAll(".hqz-o")].findIndex(x => (x.getAttribute("data-o") === "0") === r), right);
        await page.locator(".hqz-o").nth(idx).click();
        const fb = await page.evaluate(() => ({ ok: document.querySelectorAll(".hqz-o.ok").length, ko: document.querySelectorAll(".hqz-o.ko").length, okText: (document.querySelector(".hqz-o.ok") || {}).textContent, vd: (document.querySelector(".hqz-vd") || {}).className || "", fb: (document.querySelector(".hqz-fb") || {}).textContent || "", dis: [...document.querySelectorAll(".hqz-o")].every(b => b.disabled), next: !!document.querySelector("[data-hqz-next]"), card: document.querySelector(".hqz-card").textContent }));
        ok(fb.ok === 1 && fb.okText === q.o[0] && fb.ko === (right ? 0 : 1) && fb.vd.includes(right ? "ok" : "ko") && fb.fb.includes(q.e) && (right || fb.fb.includes(q.o[0])) && fb.dis && fb.next, `${tag} ${set} q${n + 1} feedback ${JSON.stringify({ ok: fb.ok, ko: fb.ko, vd: fb.vd, e: fb.fb.includes(q.e) })}`);
        ok(!/\d+\s*\/\s*\d+/.test(fb.card.replace(`${n + 1} / ${N}`, "").replace(q.q, "").replace(q.e, "").split(q.o[0]).join("")), `${tag} ${set} q${n + 1}: no running score`);
        if (n === 1) { await noOverflow("feedback"); if (set !== "s2") await page.screenshot({ path: `${OUT}/${tag}-3-feedback-${set}.png` }); }
        if (n === 2 && set === "w1") {   /* close, reload, resume at question 4 */
          await page.keyboard.press("Escape"); await page.reload({ waitUntil: "load" }); await openQuiz();
          ok(((await page.locator(".hqz-th[data-th=wine] .hqz-run").textContent().catch(() => "")) || "").includes("3/" + N), `${tag} resume badge`);
          await page.click(".hqz-th[data-th=wine]"); await page.waitForSelector(".hqz-lv"); await page.click(".hqz-lv[data-set=w1]"); await page.waitForSelector(".hqz-q");
          ok((await page.locator(".hqz-n").textContent()) === "4 / " + N, `${tag} resumes at 4`); continue;
        }
        await page.click("[data-hqz-next]");
      }
      await page.waitForSelector(".hqz-end");
      const g = await page.evaluate(() => ({ t: document.querySelector(".hqz-end").textContent, href: document.querySelector("[data-hqz-go]").getAttribute("href"), res: JSON.parse(localStorage.getItem("twg-hq-result")) }));
      ok(!/\d+\s*\/\s*\d+/.test(g.t.replace("?/" + N, "")) && !/%/.test(g.t), `${tag} ${set} gate shows no score`);
      ok(g.res.v === 2 && g.res.set === set && g.res.total === N && g.res.score === good && Object.values(g.res.topics).reduce((a, x) => a + x[1], 0) === N, `${tag} ${set} result saved ${g.res.score}/${g.res.total}`);
      ok(new RegExp(`/app/(\\?lang=[a-z-]+)?#lvl=${LVCODE[set]}&go=signup$`).test(g.href), `${tag} ${set} link ${g.href}`);
      await noOverflow("gate"); await page.screenshot({ path: `${OUT}/${tag}-4-gate-${set}.png` });
      await page.click("[data-hqz-go]");
      await page.waitForTimeout(400); if (await page.locator(".lnm button").isVisible().catch(() => false)) await page.click(".lnm button");
      await page.waitForURL(/\/app\//);
      if (set === "w1") { await page.waitForSelector("#acct-bg .hqr-note", { timeout: 20000 }); ok(await page.locator("#hqr-bg").count() === 0, `${tag} no result before the account`); await page.screenshot({ path: `${OUT}/${tag}-5-app-signup.png` }); }
      await page.evaluate(() => localStorage.setItem("stub-session", "1")); await page.reload({ waitUntil: "load" });
      await page.waitForSelector("#hqr-bg #hqr-t", { timeout: 30000 });
      const lvl = await page.evaluate(() => localStorage.getItem("twg-level"));
      ok(lvl === LVCODE[set], `${tag} ${set} app level ${lvl}`);
      const r = await page.evaluate(() => { const q = s => document.querySelector(s); return { h: q("#hqr-t").textContent, ring: q(".hqr-ring").textContent, recs: document.querySelectorAll(".hqr ol li").length, links: [...document.querySelectorAll(".hqr ol a")].map(a => a.getAttribute("href")), tp: [...document.querySelectorAll(".hqr-tp li span:first-child")].map(x => x.textContent), modes: document.querySelectorAll("[data-hqr-mode]").length, mock: (q("[data-hqr-mock]") || {}).outerHTML || "" }; });
      ok(r.h.includes(good + "/" + N) && r.ring === Math.round(good / N * 100) + "%", `${tag} ${set} score ${r.h} ${r.ring}`);
      ok(set === "w4" ? r.h.includes("Diploma") : /\d/.test(r.h.replace(good + "/" + N, "")), `${tag} ${set} level in the title: ${r.h}`);
      ok(r.recs >= 3 && r.recs <= 5 && r.links.length >= 1 && r.links.every(h => new RegExp(`#lvl=(${LVCODE[set]}|${set === "w1" ? "2" : set === "s2" ? "s2" : "4"}|3)&go=(study|open)`).test(h)), `${tag} ${set} recs ${r.recs} ${r.links}`);
      ok(r.tp.length >= 3 && r.tp.every(x => x && !/^[a-z]\d?:/.test(x)), `${tag} ${set} topics ${r.tp}`);
      ok(set === "w4" ? !r.mock : r.mock.includes(`data-hqr-mock="${LVCODE[set]}"`), `${tag} ${set} mock button`);
      ok(r.modes === 2, `${tag} ${set} asks the study mode`);
      await page.click('[data-hqr-mode="self"]'); const hSelf = num(await page.locator(".hqr-th").textContent());
      await page.click('[data-hqr-mode="course"]'); const hCourse = num(await page.locator(".hqr-th").textContent());
      const p = good / N, base = { w1: 6, w4: 500, s2: 26 }[set], mult = set === "w4" ? 1.5 * 1.3 : 1.5;
      const exp = s => Math.round(Math.max(base, base * mult * (1 - .2 * p) * (s ? 1.3 : 1)));
      ok(hCourse === exp(false) && hSelf === exp(true), `${tag} ${set} hours ${hCourse}/${hSelf} (expected ${exp(false)}/${exp(true)})`);
      const grades = await page.locator("[data-hqr-grade]").count(); ok(grades === (set === "w1" ? 0 : 3), `${tag} ${set} grades ${grades}`);
      if (set === "w4") {
        const u = await page.evaluate(() => ({ li: [...document.querySelectorAll(".hqr-bk li")].map(x => x.textContent), tot: parseInt(document.querySelector(".hqr-th").textContent.replace(/[^\d]+/g, " ").trim()) }));
        ok(u.li.length === 6 && /D1/.test(u.li[0]) && /D6/.test(u.li[5]), `${tag} Diploma split by unit ${u.li}`);
        const wk = async gr => { await page.click(`[data-hqr-grade="${gr}"]`); return num(await page.locator(".hqr-tw").textContent()); };
        const P = await wk("pass"), M = await wk("merit"), D = await wk("dist"); ok(P <= M && M < D, `${tag} Diploma grades ${P}/${M}/${D} weeks`); await wk("pass");
      }
      await page.click('[data-hqr-pace="1"]'); const w1 = num(await page.locator(".hqr-tw").textContent()); await page.click('[data-hqr-pace="3"]'); const w3 = num(await page.locator(".hqr-tw").textContent());
      ok(w1 >= w3, `${tag} ${set} pace ${w1}/${w3}`); await page.click('[data-hqr-pace="2"]');
      await page.evaluate(() => document.querySelector(".hqr").scrollTo(0, 0)); await noOverflow("result"); await page.screenshot({ path: `${OUT}/${tag}-6-result-${set}.png` });
      await page.evaluate(() => { const d = document.querySelector("[data-hqr-rv]"); d.open = true; d.scrollIntoView(); });
      await page.waitForSelector(".hqr-rvl li");
      const rv = await page.evaluate(() => ({ n: document.querySelectorAll(".hqr-rvl li").length, ko: document.querySelectorAll(".hqr-rvl li.ko").length, e: [...document.querySelectorAll(".hqr-rvl .hqr-re")].map(x => x.textContent) }));
      ok(rv.n === N && rv.ko === N - good && rv.e.every((x, k) => x === Q[k].e), `${tag} ${set} review ${rv.n}/${rv.ko}`);
      await noOverflow("review"); await page.screenshot({ path: `${OUT}/${tag}-7-review-${set}.png` });
      console.log(`  ${tag} ${set}: ${good}/${N} · ${r.h} · ${hCourse}/${hSelf} h · ${r.recs} recs · topics ${r.tp.join(" | ").slice(0, 90)}`);
      await page.keyboard.press("Escape");
    }
    ok(!errs.length, `${tag} console errors: ${errs.slice(0, 3).join(" | ")}`);
    console.log(`${tag}: done, ${errs.length} console errors`);
    await ctx.close();
  }
  await br.close(); console.log(fails ? `${fails} FAILED` : "ALL OK"); process.exit(fails ? 1 : 0);
})();
