/* The Wine Goat — service worker: rende l'app installabile e utilizzabile anche senza rete.
   La pagina dell'app arriva sempre prima dalla rete (così gli aggiornamenti si vedono subito),
   con la copia salvata come riserva offline. Immagini, caratteri e script: dalla copia salvata.
   Audio e podcast non vengono salvati (troppo pesanti); account e pagamenti passano sempre dalla rete. */
const V = "twg-v1";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./vendor/supabase-2.119.0.js", "./icons/icon-192.png", "./icons/icon-512.png", "../img/wordmark.webp", "../img/logo-emblem.webp"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin) return;            // Supabase, Stripe, ecc.
  if (/\/(audio|pods)\//.test(u.pathname) || r.headers.has("range")) return; // audio in streaming
  if (r.mode === "navigate" || u.pathname.endsWith("/app/") || u.pathname.endsWith("/app/index.html")) {
    e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(V).then(x => x.put("./index.html", c)); return res; })
      .catch(() => caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => {
    if (res.ok && /\.(js|css|png|webp|jpg|svg|woff2|json|webmanifest)$/.test(u.pathname)) { const c = res.clone(); caches.open(V).then(x => x.put(r, c)); }
    return res; })));
});
/* notifiche (promemoria della serie): un tocco riapre l'app */
self.addEventListener("notificationclick", e => { e.notification.close(); e.waitUntil(self.clients.matchAll({ type: "window" }).then(cs => cs.length ? cs[0].focus() : self.clients.openWindow("./"))); });
