// Copia l'app web (../app) con immagini e caratteri in ./www, la cartella che Capacitor mette dentro le app.
// Audio e podcast (oltre 230 MB) NON vengono inclusi: superano il limite dei 200 MB di Google Play,
// quindi l'app li ascolta in streaming da thewinegoat.com.
import { rmSync, mkdirSync, cpSync, writeFileSync, readFileSync } from "node:fs";
const root = new URL("../../", import.meta.url).pathname, www = new URL("../www/", import.meta.url).pathname;
const REMOTE = "https://thewinegoat.com/app/";
rmSync(www, { recursive: true, force: true }); mkdirSync(www, { recursive: true });
cpSync(root + "app", www + "app", { recursive: true, filter: s => !/\/app\/(audio|pods)(\/|$)/.test(s) });
for (const d of ["img", "fonts"]) cpSync(root + d, www + d, { recursive: true });
let h = readFileSync(www + "app/index.html", "utf8"); const n0 = h.length;
const rep = [['?"pods/"+lg', `?"${REMOTE}pods/"+lg`], ["`pods/${", "`" + REMOTE + "pods/${"], ["`audio/${", "`" + REMOTE + "audio/${"]];
for (const [a, b] of rep) { if (!h.includes(a)) throw new Error("percorso non trovato: " + a); h = h.split(a).join(b); }
h = h.replace("<head>", '<head><meta name="twg-native" content="1">');
writeFileSync(www + "app/index.html", h);
writeFileSync(www + "index.html", '<!DOCTYPE html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><script>location.replace("app/index.html"+location.hash)</script>');
console.log("www pronta", (h.length - n0) + " byte di percorsi cambiati");
