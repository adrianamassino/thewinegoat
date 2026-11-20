// Prepara ./www, la cartella che Capacitor mette dentro le app Android e iOS, a partire dall'app web (../app).
//
// Cosa entra nelle app:
//   - tutta l'app web, TRANNE audio e podcast: le cartelle "audio" e "pods", a qualsiasi livello (app/pods,
//     app/l1/pods, app/spirits/s1/pods, ...). Sono centinaia di MB di MP3 e Google Play accetta al massimo
//     200 MB: le app li ascoltano in streaming da thewinegoat.com;
//   - delle immagini del sito solo quelle che l'app usa davvero: logo, capre (assets/deco.js) e le foto
//     delle lezioni elencate in app/photos.js;
//   - i caratteri.
// Cosa viene adattato nella copia (mai nei file originali):
//   - i percorsi di audio e podcast puntano a thewinegoat.com;
//   - i link alle pagine del sito (crediti fotografici) e i link nelle email di accesso puntano al sito
//     pubblico, perché dentro le app l'indirizzo locale non esiste fuori dal telefono.
// Alla fine lo script controlla che i file indispensabili ci siano, che non sia rimasto nessun MP3 e che
// il pacchetto resti sotto il limite: se qualcosa non torna si ferma con un errore, così il build fallisce
// invece di produrre un'app rotta o troppo grande.
import { rmSync, mkdirSync, cpSync, writeFileSync, readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
const www = fileURLToPath(new URL("../www/", import.meta.url));
const SITE = "https://thewinegoat.com", REMOTE = SITE + "/app/";
const MAX_MB = 150; // margine ampio sotto i 200 MB di Google Play

const fail = m => { throw new Error(m); };
const read = f => readFileSync(www + f, "utf8");
/** Sostituisce `a` con `b` in un file della copia; si ferma se il testo atteso non c'è più. */
function patch(file, pairs) {
  let h = read(file), n = 0;
  for (const [a, b] of pairs) {
    const parts = h.split(a);
    if (parts.length < 2) fail(`${file}: testo non trovato, lo script va aggiornato: ${a}`);
    n += parts.length - 1; h = parts.join(b);
  }
  writeFileSync(www + file, h);
  return n;
}

rmSync(www, { recursive: true, force: true }); mkdirSync(www, { recursive: true });

// 1. l'app web, senza audio e podcast
const appSrc = root + "app";
cpSync(appSrc, www + "app", { recursive: true, filter: s => !/[\\/](audio|pods)([\\/]|$)/.test(s.slice(appSrc.length)) });

// 2. caratteri
cpSync(root + "fonts", www + "fonts", { recursive: true });

// 3. solo le immagini che l'app usa
mkdirSync(www + "img/photos", { recursive: true });
for (const f of readdirSync(root + "img")) if (/^(logo-emblem|wordmark)/.test(f)) cpSync(root + "img/" + f, www + "img/" + f);
cpSync(root + "img/goats/x", www + "img/goats/x", { recursive: true });
const stems = [...new Set([...read("app/photos.js").matchAll(/"([a-z0-9-]+)":\{"w":\d+/g)].map(m => m[1]))];
if (!stems.length) fail("app/photos.js: nessuna foto trovata, lo script va aggiornato");
for (const s of stems) for (const suf of ["", "-sm"]) {
  const f = `img/photos/${s}${suf}.webp`;
  if (!existsSync(root + f)) fail("foto mancante: " + f);
  cpSync(root + f, www + f);
}

// 4. le capre dell'app (assets/deco.js, caricato dall'app come /assets/deco.js)
mkdirSync(www + "assets", { recursive: true });
cpSync(root + "assets/deco.js", www + "assets/deco.js");

// 5. adattamenti nella copia
let n = 0;
n += patch("app/index.html", [
  ['?"pods/"+lg', `?"${REMOTE}pods/"+lg`],                 // podcast del livello 3
  ["`pods/${", "`" + REMOTE + "pods/${"],                    // audio dei film (podcast)
  ["`audio/${", "`" + REMOTE + "audio/${"],                  // audio dei film
  ["RedirectTo:location.origin+location.pathname", `RedirectTo:"${REMOTE}"`], // email di conferma e accesso
  ["redirectTo:location.origin+location.pathname", `redirectTo:"${REMOTE}"`], // email di recupero password
  // l'accesso con Google o Apple dentro le app richiede un'integrazione nativa (Google lo blocca nelle
  // finestre web incorporate): finché non c'è, nelle app restano email e password / codice via email
  ['const on=["google","apple"].filter(p=>j.external[p]);', "const on=[];"],
  // dentro le app la pagina non deve mai scorrere di lato (una decorazione sporge di 2 px)
  ["<head>", '<head><meta name="twg-native" content="1"><style>html:root{overflow-x:hidden;overflow-x:clip}</style>'],
]);
n += patch("app/l2/media.js", [['M.base + "pods/"', `"${REMOTE}" + M.base + "pods/"`]]); // podcast dei livelli 1, 2, Spirits
n += patch("app/photos.js", [['href="${esc(D.CR[l] || D.CR.en)}"', 'href="' + SITE + '${esc(D.CR[l] || D.CR.en)}"']]); // crediti foto
writeFileSync(www + "index.html", '<!DOCTYPE html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><script>location.replace("app/index.html"+location.hash)</script>');

// 6. controlli
const must = ["app/index.html", "app/l2/media.js", "app/vendor/ocr/tesseract.min.js", "assets/deco.js", "img/logo-emblem.webp", "img/wordmark.webp", "img/wordmark-light.webp", "img/goats/x/e001.webp"];
for (const f of must) if (!existsSync(www + f)) fail("file indispensabile mancante nel pacchetto: " + f);
// i file locali citati in modo fisso da index.html (script, fogli di stile, icone) devono esistere
const html = read("app/index.html"), missing = new Set();
for (const m of html.matchAll(/<(?:script|link)\b[^>]*?\b(?:src|href)="([^"'+${}<>:]+?)(?:[?#][^"]*)?"/g)) {
  const p = m[1].startsWith("/") ? m[1].slice(1) : "app/" + m[1];
  if (!existsSync(www + p)) missing.add(m[1]);
}
if (missing.size) fail("index.html cita file che non sono nel pacchetto: " + [...missing].join(", "));
let bytes = 0, files = 0; const mp3 = [], top = {};
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = d + f, st = statSync(p);
    if (st.isDirectory()) { walk(p + "/"); continue; }
    bytes += st.size; files++;
    if (/\.(mp3|m4a|ogg|wav)$/i.test(f)) mp3.push(p.slice(www.length));
    const k = p.slice(www.length).split("/").slice(0, 2).join("/"); top[k] = (top[k] || 0) + st.size;
  }
})(www);
if (mp3.length) fail(`audio rimasto nel pacchetto (${mp3.length} file), per esempio ${mp3[0]}`);
const mb = b => (b / 1048576).toFixed(1) + " MB";
const big = Object.entries(top).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, v]) => `${k} ${mb(v)}`).join(" · ");
console.log(`www pronta: ${files} file, ${mb(bytes)} (limite ${MAX_MB} MB) · ${stems.length} foto · ${n} percorsi adattati`);
console.log("più pesanti: " + big);
if (bytes > MAX_MB * 1048576) fail(`pacchetto troppo grande: ${mb(bytes)}, il limite è ${MAX_MB} MB`);
