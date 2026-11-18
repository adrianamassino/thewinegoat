/* The Wine Goat — podcasts and films for the levels that use the shared Level 1/2 screens (wine L1, L2, spirits L1–L3).
   Data: <level dir>/media.js sets window.TWG_MEDIA = {base, pods:[{id,n,c,t:[it,fr,en],d:{lang:seconds},T:{lang:[para start times]}}], films:[…]}.
   Podcast text: <base>podtext/<lang>.json ({id:{p:[…]}}); recorded audio (optional): <base>pods/<lang>/<id>.mp3 — without it the
   device's own voice reads the text. Hooked into the main app by window.L2MEDIA(), called right after L2UI.init(). */
(function () {
  "use strict";
  const M = window.TWG_MEDIA;
  if (!M) return;
  const hasPods = !!(M.pods && M.pods.length), hasFilms = !!(M.films && M.films.length);
  window.TWG_MEDIA_ALLOW = new Set([...(hasPods ? ["pods", "pod"] : []), ...(hasFilms ? ["films", "film"] : [])]);
  const TXT = {
    it: { pods: "Podcast", podsD: "Lezioni da ascoltare, capitolo per capitolo", films: "Film animati", filmsD: "Ogni processo animato e spiegato a voce", lis: "🎧 Ascolta e guarda" },
    fr: { pods: "Podcasts", podsD: "Des leçons à écouter, chapitre par chapitre", films: "Films animés", filmsD: "Chaque processus animé et expliqué à voix haute", lis: "🎧 Écouter et regarder" },
    en: { pods: "Podcasts", podsD: "Lessons to listen to, chapter by chapter", films: "Animated films", filmsD: "Every process animated and explained aloud", lis: "🎧 Listen and watch" }
  };
  window.L2MEDIA = function () {
    const C = window.TWG_L2C || window.TWG_L1C || window.TWG_S1C || window.TWG_S2C || window.TWG_S3C;
    const lgx = () => ["it", "fr", "en"][L()] || "en";
    const tt = k => (TXT[lgx()] || TXT.en)[k];
    try { Object.assign(X.es, { "Podcasts": "Pódcasts", "Lessons to listen to, chapter by chapter": "Lecciones para escuchar, capítulo a capítulo", "Animated films": "Películas animadas", "Every process animated and explained aloud": "Cada proceso animado y explicado en voz alta", "🎧 Listen and watch": "🎧 Escucha y mira" }); } catch (e) {}
    if (hasPods) {
      PODS.length = 0; M.pods.forEach(p => PODS.push(Object.assign({ d: {}, T: {} }, p)));
      Object.keys(PCH).forEach(k => delete PCH[k]); M.pods.forEach(p => { PCH[p.n] = p.c; });
      Object.keys(PX).forEach(k => delete PX[k]); Object.keys(PXP).forEach(k => delete PXP[k]);
      pdText = function (lg) {
        if (PX[lg]) return Promise.resolve(PX[lg]); if (PXP[lg]) return PXP[lg];
        return (PXP[lg] = fetch(M.base + "podtext/" + lg + ".json").then(r => { if (!r.ok) throw 0; return r.json(); }).then(j => { PX[lg] = j; return j; }).catch(() => { PXP[lg] = null; PX[lg] = {}; return PX[lg]; }));
      };
      pdSrc = function (p) { const lg = pdLang(), m = pdMode(p); return m === "rec" ? M.base + "pods/" + lg + "/" + p.id + ".mp3" : "synth:" + lg + "/" + p.id + "/" + encodeURIComponent(m); };
      renderPods = function () {
        const st = pdState(), lg = pdLang(); if (!PX[lg]) pdText(lg).then(() => { if (view === "pods") render(); });
        const li = L(), secs = (C.groups || [{ c: PODS.map(p => p.c) }]).map(g => {
          const P_ = PODS.filter(p => g.c.includes(p.c)); if (!P_.length) return "";
          return `${g.n ? `<h2 class="hsec">${esc(g.n[["it", "fr", "en"][li]] || g.n.en)}</h2>` : ""}<div class="pdlist">${P_.map(p => {
            const x = st[p.id] || {}, d = pdD(p, lg), pr = x.done ? 1 : (d && x.pos ? Math.min(1, x.pos / d) : 0);
            return `<button type="button" class="pdrow${x.done ? " done" : ""}" data-pod="${p.id}"><span class="pdn">${p.n}</span><span class="pdtx"><b>${esc(p.t[li])}</b><span>${d ? Math.max(1, Math.round(d / 60)) + " " + t("pdMin") : "…"}${x.done ? " · ✓ " + esc(t("pdDone")) : ""}</span><span class="pdbar"><i style="width:${Math.round(pr * 100)}%"></i></span></span><span class="pdplay">${PCUR === p.id && PA && !PA.paused ? "❚❚" : "▶"}</span></button>`;
          }).join("")}</div>`;
        }).join("");
        return `<section class="view pods"><div class="pdhero"><p>${esc(t("pdIntro"))}</p></div>${secs}</section>`;
      };
    }
    if (hasFilms) {
      FILMS.length = 0; M.films.forEach(f => FILMS.push(f));
      if (M.fsec) Object.keys(M.fsec).forEach(k => { FSEC[k] = M.fsec[k]; });
    }
    /* entry points in the Review hub */
    const row = (go, ic, ti, sub) => `<button type="button" class="hubrow" data-go="${go}"><span class="hub-ic">${ICO[ic] || ""}</span><span class="hub-tx"><b>${esc(ti)}</b><span>${esc(sub)}</span></span>${ICO.chev || ""}</button>`;
    const W0 = L2UI.wine;
    L2UI.wine = function () {
      const h = W0.apply(this, arguments);
      const add = (hasPods ? row("pods", "pod", tt("pods"), PODS.length + " · " + tt("podsD")) : "") + (hasFilms ? row("films", "films", tt("films"), FILMS.length + " · " + tt("filmsD")) : "");
      return add ? h.replace('<div class="hublist">', `<div class="hublist">${add}`) : h;
    };
  };
})();
