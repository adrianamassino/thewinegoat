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
    barrelUp: `<svg viewBox="0 0 80 90"><path d="M14 6h52c8 14 8 64 0 78H14C6 70 6 20 14 6z" fill="${B}"/><path d="M27 6c-4 20-4 58 0 78M40 6v78M53 6c4 20 4 58 0 78" stroke="${B2}" stroke-width="1.6" opacity=".7"/><path d="M10 18h60M7 45h66M10 72h60" stroke="#3b2a1a" stroke-width="5"/><ellipse cx="40" cy="6" rx="26" ry="4" fill="#a0703c"/></svg>`,
    cork: `<svg viewBox="0 0 50 60"><path d="M10 10h30l-3 44H13z" fill="#d9b27c"/><ellipse cx="25" cy="10" rx="15" ry="5" fill="#e9c995"/><circle cx="18" cy="26" r="1.6" fill="${B}"/><circle cx="29" cy="34" r="1.4" fill="${B}"/><circle cx="22" cy="44" r="1.6" fill="${B}"/><path d="M14 48h22" stroke="${W}" stroke-width="3" opacity=".5"/></svg>`
  };
  const GOATS = ["leap", "ig-n04", "peek", "ig-n12", "quick", "ig-n20", "ig-g10", "ig-n29", "scoot", "ig-n05", "ig-n33", "ig-g02", "ig-n16", "ig-n26", "ig-n35", "ig-g14", "ig-n07", "ig-n21"];
  const KEYS = ["grapes", "glass", "bottle", "barrel", "flute", "cork"];
  /* goat scenes: each uses one of the brand goat illustrations plus small animated props */
  const SCENES = [["sip", "ig-n12"], ["pop", "ig-n29"], ["juggle", "ig-n05"], ["laugh", "final"], ["barrel", "ig-g14"], ["hop", "leap"], ["sip", "ig-n04"], ["juggle", "ig-n26"],
    ["laugh", "feat"], ["pop", "ig-n35"], ["barrel", "method"], ["sip", "ig-n33"], ["juggle", "ig-n32"], ["hop", "hero"], ["sip", "quick"], ["laugh", "ig-n13"]];
  const WALKERS = ["free", "ig-g14", "ig-n16", "leap", "ig-n20", "hero"];
  const heart = `<svg viewBox="0 0 20 18"><path d="M10 17S1 11 1 5.5A4.5 4.5 0 0 1 10 3a4.5 4.5 0 0 1 9 2.5C19 11 10 17 10 17z" fill="${W2}"/></svg>`;
  const scene = (t, img) => {
    const g = `<img class="x-sg" src="/img/goats/${img}.webp" alt="">`;
    if (t === "sip") return `<div class="x-sc x-sip">${g}<span class="x-ht x-h1">${heart}</span><span class="x-ht x-h2">${heart}</span></div>`;
    if (t === "laugh") return `<div class="x-sc x-laugh">${g}<span class="x-ha">Ha ha!</span></div>`;
    if (t === "juggle") return `<div class="x-sc x-juggle">${g}<span class="x-jg x-j1">${S.grapes}</span><span class="x-jg x-j2">${S.grapes}</span></div>`;
    if (t === "barrel") return `<div class="x-sc x-onb"><span class="x-bb">${S.barrelUp}</span>${g}</div>`;
    if (t === "pop") return `<div class="x-sc x-pop">${g}<span class="x-pb">${S.bottle}</span><span class="x-pc">${S.cork}</span><span class="x-pf"><i></i><i></i><i></i><i></i><i></i></span><span class="x-pw">POP!</span></div>`;
    return `<div class="x-sc x-hopx">${g}</div>`;
  };
  const css = `.dk-layer{position:absolute;left:0;top:0;width:100%;height:0;pointer-events:none;z-index:2}
.dk{position:absolute;pointer-events:none;opacity:.9;filter:drop-shadow(0 10px 14px rgba(70,20,35,.14))}.dk svg,.dk img{display:block;width:100%;height:auto}
.dk.fl{animation:dkFloat 7s ease-in-out infinite}.dk.sw{transform-origin:50% 0;animation:dkSway 6s ease-in-out infinite}
.dk.goat{animation:dkHop 5.5s cubic-bezier(.3,.7,.4,1) infinite}.dk.goat:after{content:"";position:absolute;left:20%;right:20%;bottom:-8px;height:10px;border-radius:50%;background:rgba(70,20,35,.18);animation:dkShadow 5.5s infinite}
.x-sc{position:relative}.x-sc .x-sg{display:block;width:100%;height:auto;position:relative;z-index:1}
.x-sc.x-hopx .x-sg{animation:dkHop 5.5s cubic-bezier(.3,.7,.4,1) infinite}
.x-sc.x-sip .x-sg{transform-origin:50% 90%;animation:dkSip 4.2s ease-in-out infinite}.x-sc .x-ht{position:absolute;width:16px;top:8%;right:6%;opacity:0;z-index:2;animation:dkHeart 4.2s ease-out infinite}.x-sc .x-ht.x-h2{right:22%;width:11px;animation-delay:.5s}
.x-sc.x-laugh .x-sg{transform-origin:50% 100%;animation:dkGiggle 3.6s ease-in-out infinite}.x-sc .x-ha{position:absolute;top:-6px;right:-8px;z-index:2;background:#fff;color:${W};font:800 13px/1 system-ui,sans-serif;padding:6px 9px;border-radius:14px;box-shadow:0 4px 12px rgba(70,20,35,.18);opacity:0;animation:dkHa 3.6s ease-out infinite}
.x-sc.x-juggle .x-jg{position:absolute;width:26%;left:6%;top:0;z-index:2;animation:dkJug 2.4s ease-in-out infinite}.x-sc.x-juggle .x-jg.x-j2{left:auto;right:4%;animation-delay:-1.2s}
.x-sc.x-onb{padding-top:0}.x-sc.x-onb .x-bb{position:absolute;width:46%;right:2%;bottom:0;z-index:0}.x-sc.x-onb .x-sg{width:62%;animation:dkOnBarrel 6s cubic-bezier(.3,.7,.4,1) infinite}
.x-sc.x-pop .x-pb{position:absolute;width:20%;left:-4%;bottom:4%;z-index:2;transform:rotate(-14deg)}.x-sc.x-pop .x-pc{position:absolute;width:11%;left:2%;bottom:52%;z-index:3;animation:dkCork 4s cubic-bezier(.2,.8,.3,1) infinite}
.x-sc.x-pop .x-pf{position:absolute;left:4%;bottom:50%;width:30%;height:30%;z-index:2}.x-sc.x-pop .x-pf i{position:absolute;left:10%;bottom:0;width:7px;height:7px;border-radius:50%;background:#f2cf87;opacity:0;animation:dkSpray 4s ease-out infinite}
.x-sc.x-pop .x-pf i:nth-child(2){left:28%;animation-delay:.05s}.x-sc.x-pop .x-pf i:nth-child(3){left:0;animation-delay:.1s;background:#fff}.x-sc.x-pop .x-pf i:nth-child(4){left:40%;animation-delay:.12s;width:5px;height:5px}.x-sc.x-pop .x-pf i:nth-child(5){left:18%;animation-delay:.18s;background:#fff}
.x-sc.x-pop .x-pw{position:absolute;left:-8%;top:6%;z-index:3;font:900 15px/1 system-ui,sans-serif;color:${G};text-shadow:0 2px 0 ${W};opacity:0;animation:dkPopW 4s ease-out infinite}
@keyframes dkSip{0%,30%,100%{transform:rotate(0)}40%,62%{transform:rotate(-9deg) translateY(-3px)}50%{transform:rotate(-11deg) translateY(-4px)}}
@keyframes dkHeart{0%,55%{opacity:0;transform:translateY(0) scale(.6)}65%{opacity:1}100%{opacity:0;transform:translateY(-40px) scale(1.1)}}
@keyframes dkGiggle{0%,40%,100%{transform:rotate(0)}44%{transform:rotate(-5deg)}48%{transform:rotate(5deg)}52%{transform:rotate(-5deg)}56%{transform:rotate(4deg)}60%{transform:rotate(-3deg)}64%{transform:rotate(0)}}
@keyframes dkHa{0%,40%{opacity:0;transform:scale(.5)}46%{opacity:1;transform:scale(1.08)}52%,72%{opacity:1;transform:scale(1)}80%,100%{opacity:0;transform:translateY(-8px)}}
@keyframes dkJug{0%,100%{transform:translateY(40%) rotate(-10deg)}50%{transform:translateY(-70%) rotate(18deg)}}
@keyframes dkOnBarrel{0%,15%{transform:translate(0,0)}25%{transform:translate(18%,-40%) rotate(-8deg)}33%,62%{transform:translate(40%,-48%)}66%{transform:translate(40%,-56%)}70%,72%{transform:translate(40%,-48%)}82%{transform:translate(18%,-30%) rotate(6deg)}90%,100%{transform:translate(0,0)}}
@keyframes dkCork{0%,35%{transform:translate(0,0) rotate(0);opacity:1}40%{transform:translate(-6px,-70px) rotate(-220deg);opacity:1}55%{transform:translate(-14px,-30px) rotate(-420deg);opacity:0}100%{opacity:0}}
@keyframes dkSpray{0%,36%{opacity:0;transform:translate(0,0)}40%{opacity:1}60%{opacity:0;transform:translate(var(--dx,-10px),-46px)}100%{opacity:0}}
@keyframes dkPopW{0%,36%{opacity:0;transform:scale(.4) rotate(-12deg)}42%{opacity:1;transform:scale(1.15) rotate(-8deg)}60%{opacity:1;transform:scale(1) rotate(-8deg)}70%,100%{opacity:0}}
.dk-walk{position:relative;height:96px;overflow:hidden;pointer-events:none;margin:0}.dk-walk:before{content:"";position:absolute;left:4%;right:4%;bottom:12px;border-top:2px dotted rgba(122,31,61,.18)}
.dk-walk .x-wk{position:absolute;bottom:12px;left:0;width:70px;animation:dkWalk 30s linear infinite}.dk-walk .x-wk img{display:block;width:100%;animation:dkStep .55s ease-in-out infinite alternate}
.dk-walk .x-wk.x-rev{animation-direction:reverse}.dk-walk .x-wk.x-rev img{transform:scaleX(-1);animation-name:dkStepR}
@keyframes dkWalk{0%{transform:translateX(-90px)}100%{transform:translateX(calc(100vw + 20px))}}
@keyframes dkStep{0%{transform:translateY(0) rotate(-2deg)}100%{transform:translateY(-6px) rotate(2deg)}}@keyframes dkStepR{0%{transform:scaleX(-1) translateY(0) rotate(-2deg)}100%{transform:scaleX(-1) translateY(-6px) rotate(2deg)}}
@media (max-width:700px){.dk-walk{height:76px}.dk-walk .x-wk{width:54px;animation-duration:16s}}
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
@media (prefers-reduced-motion:reduce){.dk,.dk *,.dk-b,.dk-bub i,.dk.goat:after,.dk-walk *{animation:none!important}.dk-bub{display:none}.dk-walk .x-wk{left:45%}.x-sc .x-ht,.x-sc .x-ha,.x-sc .x-pc,.x-sc .x-pf,.x-sc .x-pw{display:none}}`;
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
    if (i % (isHome ? 2 : 3) === 1) {
      const w = document.createElement("div"); w.className = "dk-walk"; w.setAttribute("aria-hidden", "true");
      const rev = i % 4 === 3, img = WALKERS[(i >> 1) % WALKERS.length];
      w.innerHTML = `<div class="x-wk${rev ? " x-rev" : ""}" style="animation-delay:-${(i * 7) % 30}s"><img src="/img/goats/${img}.webp" alt=""></div>`;
      el.parentNode.insertBefore(w, el); return;
    }
    const d = document.createElement("div"); d.className = "dk-div"; d.setAttribute("aria-hidden", "true");
    const a = KEYS[k++ % KEYS.length], b = KEYS[(k + 2) % KEYS.length];
    const mid = i % 2 === 0 ? `<span class="gt"><img src="${goatSrc(GOATS[(i * 5) % GOATS.length])}" alt="" width="62" height="80"></span>` : `<span>${S[KEYS[(k + 4) % KEYS.length]]}</span>`;
    d.innerHTML = `<span>${S[a]}</span>${mid}<span>${S[b]}</span>`;
    el.parentNode.insertBefore(d, el);
  });

  // wide screens: decorations in the empty side margins
  const layer = document.createElement("div"); layer.className = "dk-layer"; layer.setAttribute("aria-hidden", "true"); document.body.appendChild(layer);
  const SZ = { barrel: 118, bottle: 58, flute: 56, glass: 74, grapes: 92, cork: 50 };
  const items = []; let n = 0;
  blocks.forEach((el, i) => {
    const per = Math.max(1, Math.round(el.offsetHeight / 760));
    ["l", "r"].forEach((side, j) => {
      for (let q = 0; q < per; q++, n++) {
        const goat = n % 3 === 1, key = KEYS[(n * 3 + i) % KEYS.length], d = document.createElement("div");
        const sc = SCENES[Math.floor(n / 3) % SCENES.length], size = goat ? (sc[0] === "barrel" || sc[0] === "pop" ? 150 : 128) : SZ[key];
        d.className = "dk " + (goat ? "x-gsc" : key === "grapes" ? "sw" : "fl");
        d.style.width = size + "px"; d.style.animationDelay = -(n * 1.3) + "s";
        d.innerHTML = goat ? scene(sc[0], sc[1]) : S[key];
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
