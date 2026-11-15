/* The Wine Goat — themed decorations for every page of the site (not the app).
   Grapes, glasses, bottles, barrels, corks, vine leaves, rising bubbles and jumping goats, placed in the empty
   side margins on wide screens and as small dividers between sections on phones. Purely decorative
   (aria-hidden, no pointer events); motion is switched off for people who prefer reduced motion. */
(function () {
  if (window.__twgDeco) return; window.__twgDeco = 1;
  const W = "#7a1f3d", W2 = "#9b2c52", G = "#c9a24a", L = "#6b8a3a", L2 = "#86a64a", C = "#f4e6c8", B = "#8a5a2b", B2 = "#6e4420";
  const S = {
    grapes: `<svg viewBox="0 0 64 80"><path d="M32 14c2-8 9-12 16-11-2 7-8 11-16 11z" fill="${L}"/><path d="M33 4c-1 4-1 7-1 11" stroke="${B}" stroke-width="2.4" fill="none" stroke-linecap="round"/>${[[20,22],[32,22],[44,22],[14,34],[26,34],[38,34],[50,34],[20,46],[32,46],[44,46],[26,58],[38,58],[32,70]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="7.2" fill="${i % 3 ? W : W2}"/><circle cx="${x - 2.4}" cy="${y - 2.6}" r="1.8" fill="#fff" opacity=".35"/>`).join("")}</svg>`,
    glass: `<svg viewBox="0 0 64 96"><path d="M14 6h36c2 18-2 34-18 38C16 40 12 24 14 6z" fill="#fff" fill-opacity=".55" stroke="${W}" stroke-width="2.4"/><path d="M15.5 20h33c-1 12-6 21-16.5 22.5C21.5 41 16.5 32 15.5 20z" fill="${W}"/><path d="M19 22c1 6 3 11 7 14" stroke="#fff" stroke-width="2" opacity=".35" fill="none" stroke-linecap="round"/><path d="M32 44v34" stroke="${W}" stroke-width="2.6"/><ellipse cx="32" cy="82" rx="16" ry="4.5" fill="none" stroke="${W}" stroke-width="2.6"/></svg>`,
    flute: `<svg viewBox="0 0 48 100"><path d="M14 4h20c1 22-1 40-10 44C15 44 13 26 14 4z" fill="#fff" fill-opacity=".5" stroke="${G}" stroke-width="2.4"/><path d="M15 14h18c0 16-2 28-9 31-7-3-9-15-9-31z" fill="#f2cf87"/>${[[20,38,1.6],[26,30,1.3],[22,24,1.1],[28,20,1.4],[19,17,1]].map(([x, y, r]) => `<circle class="dk-b" cx="${x}" cy="${y}" r="${r}" fill="#fff"/>`).join("")}<path d="M24 48v38" stroke="${G}" stroke-width="2.6"/><ellipse cx="24" cy="89" rx="13" ry="4" fill="none" stroke="${G}" stroke-width="2.6"/></svg>`,
    bottle: `<svg viewBox="0 0 40 110"><rect x="15" y="2" width="10" height="10" rx="2" fill="${G}"/><path d="M16 12h8v18c0 6 10 10 10 22v52c0 3-2 4-4 4H10c-2 0-4-1-4-4V52c0-12 10-16 10-22z" fill="${W}"/><rect x="8" y="58" width="24" height="26" rx="2" fill="${C}"/><path d="M12 66h16M12 72h12M12 77h14" stroke="${W}" stroke-width="1.6" opacity=".6"/><path d="M11 50c0-6 3-9 6-12" stroke="#fff" stroke-width="2" opacity=".25" fill="none"/></svg>`,
    barrel: `<svg viewBox="0 0 90 80"><ellipse cx="45" cy="40" rx="40" ry="36" fill="${B}"/><path d="M45 4c-14 8-14 64 0 72M45 4c14 8 14 64 0 72M45 4v72M24 9c-9 12-9 50 0 62M66 9c9 12 9 50 0 62" stroke="${B2}" stroke-width="1.6" fill="none" opacity=".7"/><path d="M8 22c24-6 50-6 74 0M5 40h80M8 58c24 6 50 6 74 0" stroke="#3b2a1a" stroke-width="4" fill="none"/><circle cx="45" cy="40" r="4" fill="${B2}"/></svg>`,
    leaf: `<svg viewBox="0 0 70 70"><path d="M35 66V40" stroke="${B}" stroke-width="2.4"/><path d="M35 42C20 44 6 34 6 20c8 2 12-2 14-8 6 6 10 4 15-6 5 10 9 12 15 6 2 6 6 10 14 8 0 14-14 24-29 22z" fill="${L2}"/><path d="M35 42V12M35 34 18 22M35 34l17-12" stroke="${L}" stroke-width="1.6" fill="none"/></svg>`,
    cork: `<svg viewBox="0 0 50 60"><path d="M10 10h30l-3 44H13z" fill="#d9b27c"/><ellipse cx="25" cy="10" rx="15" ry="5" fill="#e9c995"/><circle cx="18" cy="26" r="1.6" fill="${B}"/><circle cx="29" cy="34" r="1.4" fill="${B}"/><circle cx="22" cy="44" r="1.6" fill="${B}"/><path d="M14 48h22" stroke="${W}" stroke-width="3" opacity=".5"/></svg>`
  };
  const GOATS = ["leap", "ig-n04", "peek", "ig-n12", "quick", "ig-n20", "ig-g10", "ig-n29", "scoot", "ig-n05", "ig-n33", "ig-g02", "ig-n16", "ig-n26", "ig-n35", "ig-g14", "ig-n07", "ig-n21"];
  const KEYS = ["grapes", "glass", "bottle", "barrel", "flute", "leaf", "cork"];
  const css = `.dk-layer{position:absolute;left:0;top:0;width:100%;height:0;pointer-events:none;z-index:2}
.dk{position:absolute;pointer-events:none;opacity:.9;filter:drop-shadow(0 10px 14px rgba(70,20,35,.14))}.dk svg,.dk img{display:block;width:100%;height:auto}
.dk.fl{animation:dkFloat 7s ease-in-out infinite}.dk.sw{transform-origin:50% 0;animation:dkSway 6s ease-in-out infinite}
.dk.goat{animation:dkHop 5.5s cubic-bezier(.3,.7,.4,1) infinite}.dk.goat:after{content:"";position:absolute;left:20%;right:20%;bottom:-8px;height:10px;border-radius:50%;background:rgba(70,20,35,.18);animation:dkShadow 5.5s infinite}
.dk-b{animation:dkFizz 2.6s linear infinite}.dk-b:nth-child(odd){animation-duration:3.3s}
@keyframes dkFloat{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-12px) rotate(3deg)}}
@keyframes dkSway{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(6deg)}}
@keyframes dkHop{0%,62%,100%{transform:translateY(0) scale(1,1)}66%{transform:translateY(4px) scale(1.06,.92)}74%{transform:translateY(-46px) rotate(-6deg) scale(.98,1.04)}82%{transform:translateY(0) rotate(0) scale(1.05,.95)}86%{transform:translateY(-12px)}90%{transform:translateY(0)}}
@keyframes dkShadow{0%,62%,100%{transform:scale(1);opacity:1}74%{transform:scale(.6);opacity:.4}82%{transform:scale(1);opacity:1}}
@keyframes dkFizz{0%{transform:translateY(0);opacity:0}15%{opacity:1}100%{transform:translateY(-14px);opacity:0}}
.dk-bub{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0}.dk-bub i{position:absolute;bottom:-30px;border-radius:50%;background:radial-gradient(circle at 30% 30%,rgba(255,255,255,.9),rgba(242,207,135,.35) 60%,rgba(242,207,135,.08));border:1px solid rgba(255,255,255,.35);animation:dkRise linear infinite}
@keyframes dkRise{0%{transform:translate(0,0);opacity:0}10%{opacity:.85}50%{transform:translate(12px,-45vh)}100%{transform:translate(-8px,-95vh);opacity:0}}
.dk-host{position:relative;isolation:isolate}.dk-host>*:not(.dk-bub){position:relative;z-index:1}
.dk-div{display:flex;align-items:center;justify-content:center;gap:16px;margin:10px auto;max-width:340px;padding:0 16px;pointer-events:none}.dk-div:before,.dk-div:after{content:"";flex:1;border-top:2px dotted rgba(122,31,61,.25)}.dk-div span{display:block;width:38px}.dk-div span svg{display:block;width:100%;height:auto}.dk-div span.gt{width:62px}.dk-div span.gt img{width:100%;display:block}
@media (min-width:1100px){.dk-div{display:none}}
@media (prefers-reduced-motion:reduce){.dk,.dk *,.dk-b,.dk-bub i,.dk.goat:after{animation:none!important}.dk-bub{display:none}}`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  const goatSrc = n => `/img/goats/${n}.webp`;
  const isHome = !!document.querySelector(".hero3, #levels");
  // blocks that get one margin decoration each
  const blocks = [...document.querySelectorAll(isHome ? "section.sec3, footer" : "main section, main .seosec, article > section, .seo section")]
    .filter((el, i, a) => a.indexOf(el) === i && el.offsetHeight > 160 && !el.closest(".dk-layer"));
  // rising bubbles in hero / closing call-to-action areas
  document.querySelectorAll(".hero3, .fin3, .seocta, .seohero, .tldr").forEach(h => {
    if (h.querySelector(".dk-bub")) return;
    const box = document.createElement("div"); box.className = "dk-bub"; box.setAttribute("aria-hidden", "true");
    const n = h.matches(".hero3") ? 16 : 10;
    for (let i = 0; i < n; i++) {
      const b = document.createElement("i"), s = 5 + Math.round(Math.random() * 14);
      b.style.cssText = `left:${Math.round(Math.random() * 96)}%;width:${s}px;height:${s}px;animation-duration:${9 + Math.random() * 10}s;animation-delay:-${Math.random() * 18}s`;
      box.appendChild(b);
    }
    h.classList.add("dk-host"); h.insertBefore(box, h.firstChild);
  });

  // phones and tablets: small themed dividers between sections
  let k = 0;
  blocks.forEach((el, i) => {
    if (i === 0) return;
    const d = document.createElement("div"); d.className = "dk-div"; d.setAttribute("aria-hidden", "true");
    const a = KEYS[k++ % KEYS.length], b = KEYS[(k + 2) % KEYS.length];
    const mid = i % 2 === 0 ? `<span class="gt"><img src="${goatSrc(GOATS[(i * 5) % GOATS.length])}" alt="" width="62" height="80"></span>` : `<span>${S[KEYS[(k + 4) % KEYS.length]]}</span>`;
    d.innerHTML = `<span>${S[a]}</span>${mid}<span>${S[b]}</span>`;
    el.parentNode.insertBefore(d, el);
  });

  // wide screens: decorations in the empty side margins
  const layer = document.createElement("div"); layer.className = "dk-layer"; layer.setAttribute("aria-hidden", "true"); document.body.appendChild(layer);
  const SZ = { barrel: 118, bottle: 58, flute: 56, glass: 74, grapes: 92, leaf: 84, cork: 50 };
  const items = []; let n = 0;
  blocks.forEach((el, i) => {
    const per = Math.max(1, Math.round(el.offsetHeight / 760));
    ["l", "r"].forEach((side, j) => {
      for (let q = 0; q < per; q++, n++) {
        const goat = n % 4 === 1, key = KEYS[(n * 3 + i) % KEYS.length], d = document.createElement("div");
        const size = goat ? 124 : SZ[key];
        d.className = "dk " + (goat ? "goat" : key === "grapes" || key === "leaf" ? "sw" : "fl");
        d.style.width = size + "px"; d.style.animationDelay = -(n * 1.3) + "s";
        d.innerHTML = goat ? `<img src="${goatSrc(GOATS[(n >> 2) % GOATS.length])}" alt="">` : S[key];
        layer.appendChild(d);
        const step = 1 / per, base = per === 1 ? (j ? [0.62, 0.3, 0.75, 0.45][i % 4] : [0.2, 0.55, 0.35, 0.68][i % 4]) : step * q + step * (j ? 0.72 : 0.28);
        items.push({ el, d, size, side, y: Math.min(0.9, base) });
      }
    });
  });
  function contentBox(el) {
    const inner = el.querySelector(":scope > .w, :scope > .wrap, :scope > div") || el;
    const r = inner.getBoundingClientRect(), cs = getComputedStyle(inner);
    const pl = parseFloat(cs.paddingLeft) || 0, pr = parseFloat(cs.paddingRight) || 0;
    return { left: r.left + pl, right: r.right - pr, top: el.getBoundingClientRect().top + scrollY, h: el.offsetHeight };
  }
  function place() {
    const vw = document.documentElement.clientWidth, wide = vw >= 1100;
    items.forEach(it => {
      if (!wide) { it.d.style.display = "none"; return; }
      const b = contentBox(it.el), gap = it.side === "l" ? b.left : vw - b.right, room = gap - 24;
      if (room < Math.min(it.size, 44) + 8) { it.d.style.display = "none"; return; }
      const w = Math.min(it.size, room - 8); it.d.style.width = w + "px"; it.d.style.display = "";
      it.d.style.left = (it.side === "l" ? Math.max(8, (b.left - w) / 2) : b.right + (gap - w) / 2) + "px";
      it.d.style.top = Math.round(b.top + b.h * it.y) + "px";
    });
  }
  let raf = 0; const req = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(place); };
  addEventListener("resize", req); addEventListener("load", req); setTimeout(req, 600); setTimeout(req, 2500); place();
  if ("ResizeObserver" in window) new ResizeObserver(req).observe(document.body);
})();
