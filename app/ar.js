/* The Wine Goat — Argentine touch (only when the app language is es-ar):
   now and then a golden cup pops up after a right answer, and more often when a quiz, path step or game is passed. */
(function () {
  "use strict";
  function on() { try { return typeof lang !== "undefined" && lang === "es-ar"; } catch (e) { return false; } }
  function rm() { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } }
  const MSG = ["¡Esto es de copa!", "¡Copa para vos!", "¡Jugada de campeonato!", "¡Vamos, que es de copa!", "¡Nivel campeón!"];
  const CUP = '<svg viewBox="0 0 120 150" aria-hidden="true">' +
    '<defs><linearGradient id="arcg" x1="0" x2="1"><stop offset="0" stop-color="#b8860b"/><stop offset=".45" stop-color="#ffe27a"/><stop offset=".7" stop-color="#e8b631"/><stop offset="1" stop-color="#9a6d08"/></linearGradient></defs>' +
    '<path d="M30 14h60v22c0 22-12 38-30 42-18-4-30-20-30-42z" fill="url(#arcg)" stroke="#8a5f05" stroke-width="2"/>' +
    '<path d="M30 22H16c0 18 8 28 18 30M90 22h14c0 18-8 28-18 30" fill="none" stroke="#c99a1e" stroke-width="6" stroke-linecap="round"/>' +
    '<path d="M54 78h12v18H54z" fill="url(#arcg)" stroke="#8a5f05" stroke-width="1.5"/>' +
    '<path d="M40 96h40l6 14H34z" fill="url(#arcg)" stroke="#8a5f05" stroke-width="1.5"/>' +
    '<rect x="28" y="110" width="64" height="9" fill="#75aadb"/><rect x="28" y="119" width="64" height="9" fill="#fff"/><rect x="28" y="128" width="64" height="9" fill="#75aadb"/>' +
    '<rect x="28" y="110" width="64" height="27" fill="none" stroke="#3d6f9e" stroke-width="1.5"/>' +
    '<path d="M60 26l3.5 7.2 8 1.2-5.8 5.6 1.4 8-7.1-3.8-7.1 3.8 1.4-8-5.8-5.6 8-1.2z" fill="#fff6c8" stroke="#a87a12" stroke-width="1"/>' +
    '<path d="M42 20c-2 10-1 20 4 28" fill="none" stroke="#fff8d8" stroke-width="3" stroke-linecap="round" opacity=".7"/></svg>';
  let st = null;
  function css() {
    if (st) return; st = document.createElement("style");
    st.textContent = ".ar-cup{position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:auto;background:radial-gradient(circle,rgba(117,170,219,.28),rgba(0,0,0,0) 60%)}" +
      ".ar-cup svg{width:min(42vw,170px);height:auto;filter:drop-shadow(0 10px 18px rgba(0,0,0,.25));animation:arIn .7s cubic-bezier(.2,1.6,.4,1) both}" +
      ".ar-cup b{margin-top:10px;font:800 1.25rem/1.2 system-ui,sans-serif;color:#1f3f66;background:#fff;border:3px solid #75aadb;border-radius:999px;padding:.4em 1em;animation:arIn .7s .15s cubic-bezier(.2,1.6,.4,1) both}" +
      ".ar-cup i{position:absolute;top:-4vh;width:9px;height:14px;border-radius:2px;animation:arFall var(--d) linear forwards}" +
      ".ar-cup.out{transition:opacity .4s;opacity:0}" +
      "@keyframes arIn{0%{transform:scale(.2) rotate(-25deg);opacity:0}100%{transform:scale(1) rotate(0);opacity:1}}" +
      "@keyframes arFall{to{transform:translate(var(--dx),110vh) rotate(540deg)}}";
    document.head.appendChild(st);
  }
  let busy = false;
  function cup() {
    if (busy || rm()) return; busy = true; css();
    const el = document.createElement("div"); el.className = "ar-cup"; el.setAttribute("role", "status");
    el.innerHTML = CUP + "<b>" + MSG[Math.floor(Math.random() * MSG.length)] + "</b>";
    for (let k = 0; k < 26; k++) {
      const c = document.createElement("i"); c.style.left = Math.random() * 100 + "vw";
      c.style.background = k % 3 === 2 ? "#e8b631" : (k % 2 ? "#75aadb" : "#ffffff");
      c.style.boxShadow = "0 0 0 1px rgba(61,111,158,.25)";
      c.style.setProperty("--d", 1.6 + Math.random() * 1.4 + "s"); c.style.setProperty("--dx", (Math.random() - .5) * 30 + "vw");
      c.style.animationDelay = Math.random() * .4 + "s"; el.appendChild(c);
    }
    const close = () => { el.classList.add("out"); setTimeout(() => { el.remove(); busy = false; }, 400); };
    el.addEventListener("click", close); document.body.appendChild(el); setTimeout(close, 2600);
  }
  function hook() {
    try {
      if (typeof goatPop === "function") { const g = goatPop; goatPop = function (ok) { const r = g.apply(this, arguments); if (ok && on() && Math.random() < 0.15) setTimeout(cup, 450); return r; }; }
      /* cheers(n) with a big n = quiz finished well, path step or mock passed, game won */
      if (typeof cheers === "function") { const c = cheers; cheers = function (n) { const r = c.apply(this, arguments); if (on() && (n || 34) >= 36 && Math.random() < 0.6) setTimeout(cup, 700); return r; }; }
    } catch (e) {}
    window.TWG_AR_CUP = cup;
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", hook); else hook();
})();
