/* Home quiz by level: a FIXED set of 25 questions per theme + level, taken from the app's own question banks (with their
   explanations), in every home language.  →  assets/homequiz/<lang>/<set>.json  (+ assets/homequiz/sets.json, the summary)

   Sets: w1 w2 w3 w4 (Wine Level 1, 2, 3, Diploma D1–D5 multiple choice), s1 s2 (Spirits 1, 2), k1 (Sake 1), b1 (Beer 1),
   mix (Level 1 of the four themes: 7 wine, 6 spirits, 6 beer, 6 sake, taken from the w1/s1/b1/k1 sets).
   Sources: app/l1/content.js (TWG_L1C), app/l2/content.js, the Level 3 BANK/GROUPS/CH of app/index.html, app/l4/d1–d5,
   app/spirits/s1–s2, app/sake/k1, app/beer/b1 (the app's own banks: options[0] is the correct one).
   Choice (the same for every language, so the set is fixed): the 25 places are shared out over the level's groups of
   chapters in proportion to the app's exam weighting of each group (groups[].w = exam questions; Level 3: chapters per
   group; Diploma: D1 6, D2 3, D3 10, D4 3, D5 3), at least 2 per group, then spread evenly over the chapters of each group;
   in each chapter the question that exists in the most app languages wins (then: 4 options, not flagged hard, a
   question of medium length, a stable hash of its id).
   Languages: exactly what the app shows. it / fr / en: the bank's own texts; es and es-ar: the Spanish maps of the app
   (TWG_ES + the level's TWG_ESX, the Diploma's 4th element); de nl el ja ko zh-hant pt tr th: the app's maps
   (app/i18n/<lang>.js + app/i18n/<lang>/<level>.js); pt-br uses the app's Portuguese. A question counts as translated
   when its text, its explanation and every option exist in that language (an option that is the same word in it/fr/en,
   a name or a number, may stay as it is); otherwise the whole question stays in English and is marked x:1 (the page
   sets lang="en" on it), like the earlier home quiz. pl, ru, ar and zh-hans: the app has no such texts, so English.
   Explanation: the app's detailed one (d) when it exists in that language, else the short one (e).
   Topics (the result's per-topic breakdown in the app) = the level's groups of chapters (Diploma: the units).
   Usage from repo root:  node tools/homequiz/build_levels.js [--check]      (writes only files whose content changes) */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm"), crypto = require("crypto");
const ROOT = path.resolve(__dirname, "../.."), A = p => path.join(ROOT, "app", p);
const N = 25, V = 1;
const HOME = ["en", "it", "fr", "es", "es-ar", "de", "nl", "pl", "pt", "pt-br", "ru", "el", "ja", "ko", "zh-hans", "zh-hant", "ar", "th", "tr"];
const XLN = ["de", "nl", "el", "ja", "ko", "zh-hant", "pt", "tr", "th"];

function ctx() { const c = {}; c.window = c; return vm.createContext(c); }   /* window === the global, as in a page */
function load(file, c) { c = c || ctx(); vm.runInContext(fs.readFileSync(file, "utf8"), c, { filename: file }); return c; }

/* ---- the app's banks ---- */
function level(file, v) { const w = load(A(file)); return { C: w[v], ESX: w.TWG_ESX || { es: {}, ar: {} } }; }
function level3() {
  const s = fs.readFileSync(A("index.html"), "utf8"), m = k => { const r = new RegExp("^let " + k + " = (.*);?\\s*$", "m").exec(s); if (!r) throw new Error("index.html: " + k); return r[1].replace(/;\s*$/, ""); };
  const BANK = JSON.parse(m("BANK")), CH = JSON.parse(m("CH")), GROUPS = JSON.parse(m("GROUPS"));
  return { C: { bank: BANK, ch: CH, groups: GROUPS.map(g => Object.assign({}, g, { w: g.c.length })) }, ESX: { es: {}, ar: {} } };
}
function diploma() {
  const U = [["D1", 6], ["D2", 3], ["D3", 10], ["D4", 3], ["D5", 3]], bank = [], ch = {}, groups = [];
  for (const [u, w] of U) { const C = load(A(`l4/${u.toLowerCase()}/content.js`))["TWG_" + u + "C"];
    bank.push(...C.bank); Object.assign(ch, C.ch);
    groups.push({ k: u, w, fixed: 1, n: { it: C.name.it, fr: C.name.fr, en: C.name.en, es: C.name.es }, c: Object.keys(C.ch).filter(c => C.bank.some(b => b.c === c)) }); }
  return { C: { bank, ch, groups }, ESX: { es: {}, ar: {} }, es4: 1 };
}
const SRC = {
  w1: () => level("l1/content.js", "TWG_L1C"), w2: () => level("l2/content.js", "TWG_L2C"), w3: level3, w4: diploma,
  s1: () => level("spirits/s1/content.js", "TWG_S1C"), s2: () => level("spirits/s2/content.js", "TWG_S2C"),
  k1: () => level("sake/k1/content.js", "TWG_K1C"), b1: () => level("beer/b1/content.js", "TWG_B1C")
};
const SCOPE = { w1: "l1", w2: "l2", w3: "", w4: null, s1: "s1", s2: "s2", k1: "k1", b1: "b1" };

/* ---- the app's translation maps, per level (as the app merges them: core + the level's file) ---- */
const ESW = load(A("i18n/es.js")).TWG_ES;
const XM = {}; for (const l of XLN) XM[l] = load(A(`i18n/${l}.js`)).TWG_I18N[l] || {};
function maps(set, S) {
  const M = {};
  if (S.es4) { M.es = M["es-ar"] = null; } else {
    M.es = Object.assign({}, ESW.es, S.ESX.es || {});
    M["es-ar"] = Object.assign({}, ESW.es, ESW.ar || {}, S.ESX.es || {}, S.ESX.ar || {});
  }
  for (const l of XLN) {
    if (SCOPE[set] === null) { M[l] = null; continue; }
    let m = XM[l]; const f = SCOPE[set] && A(`i18n/${l}/${SCOPE[set]}.js`);
    if (f && fs.existsSync(f)) m = Object.assign({}, m, load(f).TWG_I18N[l] || {});
    M[l] = m;
  }
  return M;
}
/* text of an [it, fr, en(, es)] array in a language, or null when the app has none */
function tx(arr, lg, M, S) {
  const en = arr[2];
  if (lg === "en") return en; if (lg === "it") return arr[0] || null; if (lg === "fr") return arr[1] || null;
  if (S.es4 && (lg === "es" || lg === "es-ar")) return arr[3] || null;
  const m = M[lg === "pt-br" ? "pt" : lg]; if (!m) return null;
  const v = m[en] != null ? m[en] : m[String(en).trim()]; return v != null && String(v).trim() ? v : null;
}
const neutral = a => a[0] === a[2] && a[1] === a[2];            /* a name or a number: the same in it/fr/en */
function inLang(b, lg, M, S) {
  if (lg === "en") return { q: b.q[2], o: b.o.map(o => o[2]), e: (b.d && b.d[2]) || b.e[2] };
  const q = tx(b.q, lg, M, S), e = tx(b.e, lg, M, S), d = b.d ? tx(b.d, lg, M, S) : null;
  const o = b.o.map(a => tx(a, lg, M, S) || (neutral(a) ? a[2] : null));
  if (!q || !(e || d) || o.some(x => !x) || new Set(o).size !== o.length) return null;
  return { q, o, e: d || e };
}
const LANGS_T = HOME.filter(l => l !== "en");
const hash = s => parseInt(crypto.createHash("md5").update(s).digest("hex").slice(0, 8), 16);
const BAD = /\b(map|picture|photo|image|shown|illustrat|diagram|label below|this label)\b/i;

/* largest remainder, at least 2 per group (fixed weights are taken as they are) */
function share(groups) {
  if (groups.every(g => g.fixed)) return groups.map(g => g.w);
  const W = groups.reduce((a, g) => a + g.w, 0); let n = groups.map(g => Math.max(2, Math.floor(N * g.w / W)));
  while (n.reduce((a, x) => a + x, 0) > N) { const i = n.indexOf(Math.max(...n)); n[i]--; }
  const rem = groups.map((g, i) => [N * g.w / W - n[i], i]).sort((a, b) => b[0] - a[0]);
  for (let k = 0; n.reduce((a, x) => a + x, 0) < N; k++) n[rem[k % rem.length][1]]++;
  return n;
}
function pick(set) {
  const S = SRC[set](), M = maps(set, S), C = S.C;
  const byC = {}; for (const b of C.bank) (byC[b.c] = byC[b.c] || []).push(b);
  const score = b => { const cov = LANGS_T.filter(l => inLang(b, l, M, S)).length, L = b.q[2].length;
    return [cov, b.o.length === 4 ? 1 : 0, BAD.test(b.q[2]) ? 0 : 1, b.h ? 0 : 1, L >= 30 && L <= 150 ? 1 : 0, -hash(set + b.id) / 4294967296]; };
  const cmp = (x, y) => { for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return y[i] - x[i]; return 0; };
  const groups = C.groups.filter(g => g.c.some(c => byC[c]));
  const n = share(groups), out = [];
  groups.forEach((g, gi) => {
    const chs = g.c.filter(c => byC[c]), k = n[gi], used = new Set(), order = [];
    /* chapters spread evenly through the group; round after round when the group has fewer chapters than places */
    for (let r = 0; order.length < k; r++) { const m = Math.min(chs.length, k - order.length);
      for (let j = 0; j < m; j++) order.push(chs[Math.floor((j + .5) * chs.length / m)]); }
    for (const c of order) {
      const cand = byC[c].filter(b => !used.has(b.id)).map(b => [score(b), b]).sort((x, y) => cmp(x[0], y[0]));
      if (!cand.length) throw new Error(`${set}: chapter ${c} has no question left`);
      const b = cand[0][1]; used.add(b.id); out.push({ b, g: g.k });
    }
  });
  if (out.length !== N) throw new Error(`${set}: ${out.length} questions`);
  return { S, M, C, groups, out };
}

const THEME = { w: "wine", s: "spirits", k: "sake", b: "beer" };
function write(file, obj) {
  const js = JSON.stringify(obj) + "\n", dst = path.join(ROOT, "assets/homequiz", file);
  if (process.argv.includes("--check")) return;
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  if (!fs.existsSync(dst) || fs.readFileSync(dst, "utf8") !== js) fs.writeFileSync(dst, js);
}
function main() {
  const P = {}, sum = {};
  for (const set of Object.keys(SRC)) P[set] = pick(set);
  /* mix: Level 1 of the four themes, the first questions of each L1 set, alternating */
  const MIX = [["w1", 7], ["s1", 6], ["b1", 6], ["k1", 6]];
  for (const lg of HOME) {
    for (const set of [...Object.keys(SRC), "mix"]) {
      const items = set === "mix" ? (() => { const L = MIX.map(([s, k]) => P[s].out.slice(0, k).map(x => [s, x])), r = [];
        for (let i = 0; r.length < N; i++) L.forEach(l => { if (l[i]) r.push(l[i]); }); return r; })() : P[set].out.map(x => [set, x]);
      const tn = {}, qs = items.map(([s, { b, g }]) => {
        const { S, M, groups } = P[s], t = set === "mix" ? THEME[s[0]] : s + ":" + g;
        if (set !== "mix") { const G = groups.find(x => x.k === g); tn[t] = tx([G.n.it, G.n.fr, G.n.en, G.n.es], lg, M, S) || G.n.en; }
        const T = inLang(b, lg, M, S) || inLang(b, "en", M, S), x = !inLang(b, lg, M, S);
        const q = { id: b.id, t, q: T.q, o: T.o, e: T.e }; if (x) q.x = 1; return q;
      });
      write(`${lg}/${set}.json`, { v: V, lang: lg, set, tn, qs });
      (sum[set] = sum[set] || {})[lg] = qs.filter(q => !q.x).length;
    }
  }
  write("sets.json", { v: V, n: N, sets: Object.fromEntries(Object.keys(sum).map(s => [s, { ids: s === "mix" ? null : P[s].out.map(x => x.b.id), native: sum[s] }])) });
  console.log("questions in the language of the home (of " + N + "):");
  console.log("set   " + HOME.map(l => l.padStart(7)).join(""));
  for (const s of Object.keys(sum)) console.log(s.padEnd(6) + HOME.map(l => String(sum[s][l]).padStart(7)).join(""));
  for (const s of Object.keys(P)) { const c = {}; P[s].out.forEach(x => c[x.g] = (c[x.g] || 0) + 1); console.log(`  ${s}: ` + Object.entries(c).map(([k, v]) => k + " " + v).join(" · ") + ` · ${new Set(P[s].out.map(x => x.b.c)).size} chapters`); }
}
main();
