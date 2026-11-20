/* Playwright check of "Delete my account" (app/account-delete.js). Supabase is stubbed: no real account, no network.
   Usage: NODE_PATH=$(npm root -g) node tools/account/test_delete.js http://localhost:8894 <outDir> */
const { chromium } = require("playwright");
const BASE = process.argv[2] || "http://localhost:8894", OUT = process.argv[3] || ".";
const STUB = `window.supabase={createClient(){const cbs=[];
 const ses=()=>{try{return localStorage.getItem("stub-session")?{access_token:"x",user:{id:"00000000-0000-0000-0000-000000000001",email:"Stub.User@Example.invalid",user_metadata:{}}}:null}catch(e){return null}};
 const chain=()=>{const o=new Proxy(function(){},{get(t,k){if(k==="then")return r=>r({data:null,error:null});return()=>o},apply(){return o}});return o};
 const log=(k,v)=>{let o={};try{o=JSON.parse(window.name||"{}")}catch(e){}(o[k]=o[k]||[]).push(v);window.name=JSON.stringify(o)};
 window.__rpc=[];
 return {from(){return chain()},
  rpc(name,args){window.__rpc.push({name,args});const m=window.__rpcMode||"ok";if(m==="ok")log("rpc",{name,args});
   if(m==="network")return Promise.reject(new TypeError("Failed to fetch"));
   const err={missing:{code:"PGRST202",message:"Could not find the function public.delete_my_account(p_confirm_email) in the schema cache"},admin:{code:"42501",message:"an administrator account cannot be deleted from the app"},mismatch:{code:"22023",message:"confirmation email does not match"}}[m];
   return Promise.resolve(err?{data:null,error:err}:{data:{deleted:true},error:null})},
  auth:{getSession:async()=>({data:{session:ses()},error:null}),getUser:async()=>({data:{user:ses()&&ses().user},error:null}),
   onAuthStateChange(cb){cbs.push(cb);return{data:{subscription:{unsubscribe(){}}}}},
   signOut:async(o)=>{window.__signOut=o||{};log("signOut",o||{});try{localStorage.removeItem("stub-session")}catch(e){}cbs.forEach(c=>{try{c("SIGNED_OUT",null)}catch(e){}});return{error:null}}}}}};`;
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log("  ✗ " + m); } else console.log("  ✓ " + m); };
(async () => {
  const b = await chromium.launch();
  async function open(lang, signed) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
    await ctx.route(/supabase-2\.119\.0\.js/, r => r.fulfill({ contentType: "application/javascript", body: STUB }));
    await ctx.route(u => !u.href.startsWith(BASE), r => r.abort());
    await ctx.addInitScript(([lang, signed]) => { try { if (/^http/.test(location.protocol) && !window.name) { window.name = '{"seeded":1}';
      localStorage.setItem("wset3-onb", "1"); localStorage.setItem("wset3-lang", lang); localStorage.setItem("twg-level", "1"); localStorage.setItem("wset3-fake-progress", "42");
      if (signed) localStorage.setItem("stub-session", "1"); } } catch (e) {} }, [lang, signed]);
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", e => errs.push(String(e.message).slice(0, 160)));
    await page.goto(BASE + "/app/#lvl=1", { waitUntil: "load" }); await page.waitForTimeout(1800);
    return { ctx, page, errs };
  }
  const acct = async page => { await page.evaluate(() => window.twgAccount.open()); await page.waitForSelector("#acct-bg .acct"); await page.waitForTimeout(250); };
  const msg = page => page.evaluate(() => { const m = document.getElementById("twgdel-msg"); return m && !m.hidden ? m.textContent : ""; });

  console.log("1. signed in, Italian");
  let { ctx, page, errs } = await open("it", true);
  await page.evaluate(() => new Promise(r => { const q = indexedDB.open("twg-cellar", 1); q.onupgradeneeded = () => q.result.createObjectStore("w"); q.onsuccess = () => { q.result.close(); r(); }; q.onerror = () => r(); }));
  await acct(page);
  ok(await page.locator("#acct-bg .acct b").first().innerText() === "Stub.User@Example.invalid", "account window shows the signed-in email");
  ok(await page.locator('[data-twgdel="ask"]').innerText() === "Elimina il mio account", "link 'Elimina il mio account' present");
  await page.screenshot({ path: OUT + "/del-1-link.png" });
  await page.click('[data-twgdel="ask"]'); await page.waitForSelector("#twgdel-e");
  ok((await page.locator("#acct-bg .acct h2").innerText()).includes("Eliminare il tuo account"), "confirmation view opens");
  ok(await page.locator(".twgdel-mail").innerText() === "Stub.User@Example.invalid", "confirmation shows the account email");
  ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2), "no horizontal overflow");
  await page.screenshot({ path: OUT + "/del-2-confirm.png" });
  await page.click('[data-twgdel="go"]');
  ok((await msg(page)).includes("non corrisponde") && (await page.evaluate(() => window.__rpc.length)) === 0, "empty email: refused, nothing sent");
  await page.fill("#twgdel-e", "someone@else.invalid"); await page.click('[data-twgdel="go"]');
  ok((await msg(page)).includes("non corrisponde") && (await page.evaluate(() => window.__rpc.length)) === 0, "wrong email: refused, nothing sent");
  await page.fill("#twgdel-e", "  stub.user@example.INVALID ");
  for (const [mode, want] of [["missing", "hello@thewinegoat.com"], ["admin", "amministratore"], ["network", "Controlla la connessione"], ["mismatch", "non corrisponde"]]) {
    await page.evaluate(m => { window.__rpcMode = m; }, mode); await page.click('[data-twgdel="go"]'); await page.waitForTimeout(250);
    const m = await msg(page), dis = await page.locator('[data-twgdel="go"]').isDisabled();
    ok(m.includes(want) && !dis, `server answer "${mode}": message shown, button usable again`);
    ok(await page.evaluate(() => !!localStorage.getItem("stub-session") && localStorage.getItem("wset3-fake-progress") === "42"), `  "${mode}": nothing erased on this device`);
  }
  await page.screenshot({ path: OUT + "/del-3-error.png" });
  console.log("2. cancel goes back to the account window");
  await page.click('[data-twgdel="no"]'); await page.waitForTimeout(300);
  ok(await page.locator('#acct-bg [data-a="out"]').count() === 1 && await page.locator("#twgdel-e").count() === 0, "back to the signed-in account window");
  ok(await page.locator('[data-twgdel="ask"]').count() === 1, "link is there again");
  console.log("3. deletion");
  await page.click('[data-twgdel="ask"]'); await page.waitForSelector("#twgdel-e");
  /* like the app, something saves to the device while the page closes: it must not come back after the deletion */
  await page.evaluate(() => { window.__rpcMode = "ok"; window.__rpc = []; window.addEventListener("pagehide", () => { try { localStorage.setItem("wset3-saved-while-closing", "1"); } catch (e) {} }); });
  await page.fill("#twgdel-e", "stub.user@example.invalid");
  await Promise.all([page.waitForNavigation({ waitUntil: "load" }), page.keyboard.press("Enter")]);   // the app restarts when the session ends
  await page.waitForSelector("#twgdel-done"); await page.waitForTimeout(1200);
  const st = await page.evaluate(async () => ({ log: JSON.parse(window.name || "{}"), keys: Object.keys(localStorage).sort(), lang: localStorage.getItem("wset3-lang"),
    dbs: indexedDB.databases ? (await indexedDB.databases()).map(d => d.name) : null, text: document.querySelector("#twgdel-done h2").textContent,
    acct: !!document.getElementById("acct-bg"), signed: window.twgAccount.signedIn() }));
  const rpc = st.log.rpc || [];
  ok(rpc.length === 1 && rpc[0].name === "delete_my_account" && rpc[0].args.p_confirm_email === "stub.user@example.invalid", "database function called once with the typed email");
  ok((st.log.signOut || []).length === 1 && st.log.signOut[0].scope === "local", "session closed on this device");
  ok(!st.signed, "app restarted signed out");
  ok(!st.keys.includes("stub-session") && !st.keys.includes("wset3-fake-progress"), "saved data erased from this device");
  ok(!st.keys.includes("wset3-saved-while-closing"), "nothing written back while the app was closing");
  ok(!st.keys.includes("twg-account-deleted"), "restart flag used and removed");
  ok(st.lang === "it", "language choice kept");
  ok(st.dbs === null || !st.dbs.includes("twg-cellar"), "wine diary database erased");
  ok(st.text === "Il tuo account è stato eliminato." && !st.acct, "confirmation shown after the restart");
  console.log("     keys left on the device: " + st.keys.join(", "));
  await page.screenshot({ path: OUT + "/del-4-done.png" });
  await page.click('#twgdel-done button'); await page.waitForTimeout(300);
  ok(await page.evaluate(() => !document.getElementById("twgdel-done")), "OK closes the confirmation");
  await page.reload({ waitUntil: "load" }); await page.waitForTimeout(1200);
  ok(await page.evaluate(() => !document.getElementById("twgdel-done")), "confirmation is not shown again");
  await acct(page);
  ok(await page.locator('[data-twgdel]').count() === 0, "signed out: no delete link in the account window");
  ok(errs.length === 0, "no page errors" + (errs.length ? ": " + errs.join(" | ") : "")); await ctx.close();

  console.log("4. other languages");
  const want = { en: "Delete my account", fr: "Supprimer mon compte", es: "Eliminar mi cuenta", "es-ar": "Eliminar mi cuenta", de: "Mein Konto löschen", nl: "Mijn account verwijderen", el: "Διαγραφή του λογαριασμού μου", ja: "アカウントを削除する", ko: "내 계정 삭제", "zh-hant": "刪除我的帳號", pt: "Excluir minha conta", tr: "Hesabımı sil", th: "ลบบัญชีของฉัน" };
  for (const lg of Object.keys(want)) {
    const o = await open(lg, true); await acct(o.page);
    const t = await o.page.locator('[data-twgdel="ask"]').innerText().catch(() => "");
    await o.page.click('[data-twgdel="ask"]').catch(() => {}); await o.page.waitForTimeout(200);
    const ov = await o.page.evaluate(() => { const a = document.querySelector("#acct-bg .acct"); return a ? a.scrollWidth - a.clientWidth : -1; });
    ok(t === want[lg] && ov <= 0 && o.errs.length === 0, `${lg}: "${t}", fits the window, no errors`);
    if (lg === "ja" || lg === "de") await o.page.screenshot({ path: OUT + `/del-5-${lg}.png` });
    await o.ctx.close();
  }
  await b.close(); console.log(fails ? `\nFAILED: ${fails}` : "\nALL PASSED"); process.exit(fails ? 1 : 0);
})();
