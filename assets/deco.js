/* The Wine Goat — themed decorations for every page of the site (not the app).
   Painted goats from the brand set doing things (sipping, uncorking, playing with grapes, laughing, jumping onto a
   barrel, leaping, toasting, walking), plus detailed wine props (grapes, glasses, bottles, flutes, barrels, corks,
   corkscrew) scattered with a seeded random layout: varied size, tilt and depth, slow parallax, small still lifes.
   Side margins on wide screens; on phones, walking goats and small vignettes between sections.
   Purely decorative (aria-hidden, no pointer events); motion off for prefers-reduced-motion. */
(function () {
  if (window.__twgDeco) return; window.__twgDeco = 1;
  const X = n => `/img/goats/x/e${String(n).padStart(3, "0")}.webp`;
  const IMG = n => `<img src="${X(n)}" alt="" loading="lazy" decoding="async">`;
  let uid = 0; const id = p => "dk" + p + (++uid);

  /* ---------- detailed props (gradients, highlights, shading) ---------- */
  function grapes(kind) {
    const a = id("g"), st = id("s"), red = kind !== "white";
    const c1 = red ? "#c2577f" : "#eef4b0", c2 = red ? "#7a1f3d" : "#b3c255", c3 = red ? "#3f0c1f" : "#5f6d1f";
    const B = [[50, 30, 11], [36, 34, 11], [64, 35, 11], [28, 47, 10.5], [44, 46, 11.5], [59, 48, 11], [73, 48, 9.5], [36, 60, 11], [52, 61, 11.5], [67, 61, 10], [44, 74, 10.5], [59, 75, 10], [51, 88, 9.5], [38, 86, 7.5], [58, 99, 7]];
    return `<svg viewBox="0 0 100 112"><defs><radialGradient id="${a}" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="${c1}"/><stop offset=".55" stop-color="${c2}"/><stop offset="1" stop-color="${c3}"/></radialGradient><linearGradient id="${st}" x1="0" x2="1"><stop offset="0" stop-color="#7a5230"/><stop offset="1" stop-color="#4a2f18"/></linearGradient></defs>
<path d="M51 24c-1-9 2-15 7-20" stroke="url(#${st})" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M58 6c6 2 9 7 8 12M66 18c3 2 2 6-1 6" stroke="#8a6a3a" stroke-width="1.5" fill="none" stroke-linecap="round"/>
${B.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${a})" stroke="${c3}" stroke-opacity=".35" stroke-width=".8"/><ellipse cx="${(x - r * .35).toFixed(1)}" cy="${(y - r * .4).toFixed(1)}" rx="${(r * .28).toFixed(1)}" ry="${(r * .17).toFixed(1)}" fill="#fff" opacity=".55" transform="rotate(-30 ${(x - r * .35).toFixed(1)} ${(y - r * .4).toFixed(1)})"/>`).join("")}</svg>`;
  }
  function glass(kind) {
    const w = id("w"), gl = id("gl"), col = { red: ["#a3204b", "#4a0718"], rose: ["#f6a3b5", "#d4687f"], white: ["#f7e6a3", "#d9b75a"] }[kind || "red"];
    return `<svg viewBox="0 0 70 120"><defs><linearGradient id="${w}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${col[0]}"/><stop offset="1" stop-color="${col[1]}"/></linearGradient><linearGradient id="${gl}" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".8"/><stop offset=".35" stop-color="#fff" stop-opacity=".14"/><stop offset=".8" stop-color="#fff" stop-opacity=".06"/><stop offset="1" stop-color="#fff" stop-opacity=".5"/></linearGradient></defs>
<path d="M12 4h46c3 24 1 46-23 52C11 50 9 28 12 4z" fill="url(#${gl})" stroke="#c9b8a8" stroke-width="1.2"/><path d="M13.3 26h43.4c-1 15-7 26-21.7 28C20 52 14 41 13.3 26z" fill="url(#${w})"/><ellipse cx="35" cy="26" rx="21.7" ry="3.2" fill="${col[0]}"/><ellipse cx="35" cy="26" rx="21.7" ry="3.2" fill="none" stroke="#fff" stroke-opacity=".4"/>
<path d="M17 9c-1 14 0 28 6 37" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".55" fill="none"/><path d="M33.6 56h2.8l.6 44h-4z" fill="#ece5dc" stroke="#c9b8a8" stroke-width=".8"/><ellipse cx="35" cy="104" rx="19" ry="5" fill="#f5efe8" stroke="#c9b8a8" stroke-width="1.2"/><ellipse cx="31" cy="103" rx="8" ry="1.4" fill="#fff" opacity=".85"/></svg>`;
  }
  function flute() {
    const w = id("f"), gl = id("fg");
    return `<svg viewBox="0 0 44 128"><defs><linearGradient id="${w}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbe7a8"/><stop offset="1" stop-color="#d9a93f"/></linearGradient><linearGradient id="${gl}" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset=".4" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity=".5"/></linearGradient></defs>
<path d="M10 3h24c2 30 0 54-12 60C10 57 8 33 10 3z" fill="url(#${gl})" stroke="#cdbfae" stroke-width="1.1"/><path d="M11 14h22c0 24-2 42-11 47-9-5-11-23-11-47z" fill="url(#${w})"/><ellipse cx="22" cy="14" rx="11" ry="1.8" fill="#fff8d8"/>
${[[16, 52, 1.3], [20, 44, 1.1], [25, 50, 1.2], [18, 34, 1], [24, 28, 1.1], [21, 21, .9], [27, 38, .9]].map(([x, y, r], i) => `<circle class="dkB" style="animation-delay:-${(i * .45).toFixed(2)}s" cx="${x}" cy="${y}" r="${r}" fill="#fff"/>`).join("")}
<path d="M14 8c-1 18 0 34 4 46" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".6" fill="none"/><path d="M21 63h2l.5 50h-3z" fill="#ece4da"/><ellipse cx="22" cy="116" rx="14" ry="4" fill="#f5efe8" stroke="#cdbfae" stroke-width="1.1"/></svg>`;
  }
  function bottle(kind) {
    const g = id("b"), f = id("bf"), lab = id("bl"), sp = kind === "sparkling";
    const gc = kind === "white" ? ["#9fb466", "#3f4f1c"] : ["#46562f", "#141a0e"];
    const body = sp ? "M19 4h12v34c0 10 13 12 13 26v72c0 4-3 6-6 6H12c-3 0-6-2-6-6V64c0-14 13-16 13-26z" : "M19 4h12v40c0 6 13 10 13 22v70c0 4-3 6-6 6H12c-3 0-6-2-6-6V66c0-12 13-16 13-22z";
    return `<svg viewBox="0 0 50 150"><defs><linearGradient id="${g}" x1="0" x2="1"><stop offset="0" stop-color="${gc[1]}"/><stop offset=".3" stop-color="${gc[0]}"/><stop offset=".55" stop-color="${gc[1]}"/><stop offset="1" stop-color="#050704"/></linearGradient><linearGradient id="${f}" x1="0" x2="1"><stop offset="0" stop-color="${sp ? "#8a6a1e" : "#5c0f26"}"/><stop offset=".4" stop-color="${sp ? "#f2d27a" : "#a5284f"}"/><stop offset="1" stop-color="${sp ? "#7a5a14" : "#4a0a1e"}"/></linearGradient><linearGradient id="${lab}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbf3df"/><stop offset="1" stop-color="#eadbb8"/></linearGradient></defs>
<path d="${body}" fill="url(#${g})"/><path d="M18 2h14v${sp ? 30 : 24}H18z" fill="url(#${f})"/>${sp ? `<path d="M17 30h16l2 10H15z" fill="url(#${f})"/>` : `<rect x="17" y="24" width="16" height="3" fill="#2a0712" opacity=".5"/>`}
<rect x="9" y="84" width="32" height="40" rx="2" fill="url(#${lab})"/><rect x="11.5" y="86.5" width="27" height="35" rx="1" fill="none" stroke="#7a1f3d" stroke-width=".8"/><path d="M25 92c-3 0-5 3-5 6 0 4 5 7 5 7s5-3 5-7c0-3-2-6-5-6z" fill="#7a1f3d" opacity=".85"/><path d="M15 110h20M17 114h16M19 118h12" stroke="#7a1f3d" stroke-width="1.1" opacity=".55"/>
<path d="M11 72c1-6 4-10 8-13M11 80v56" stroke="#fff" stroke-width="2.4" opacity=".22" fill="none" stroke-linecap="round"/></svg>`;
  }
  function barrel() {
    const w = id("wd"), h = id("hp"), t = id("tp");
    return `<svg viewBox="0 0 100 116"><defs><linearGradient id="${w}" x1="0" x2="1"><stop offset="0" stop-color="#4f2c14"/><stop offset=".25" stop-color="#9a6234"/><stop offset=".5" stop-color="#b57a44"/><stop offset=".75" stop-color="#8a5428"/><stop offset="1" stop-color="#3f220e"/></linearGradient><linearGradient id="${h}" x1="0" x2="1"><stop offset="0" stop-color="#2a2a2a"/><stop offset=".35" stop-color="#8d8d8d"/><stop offset=".5" stop-color="#cfcfcf"/><stop offset=".7" stop-color="#6d6d6d"/><stop offset="1" stop-color="#1f1f1f"/></linearGradient><radialGradient id="${t}" cx="50%" cy="50%" r="60%"><stop offset="0" stop-color="#c58d55"/><stop offset="1" stop-color="#7a4a22"/></radialGradient></defs>
<path d="M16 10h68c10 30 10 66 0 96H16C6 76 6 40 16 10z" fill="url(#${w})"/>${[26, 38, 50, 62, 74].map(x => `<path d="M${x} 10c${((x - 50) * .18).toFixed(1)} 30 ${((x - 50) * .18).toFixed(1)} 66 0 96" stroke="#3a1f0c" stroke-opacity=".45" stroke-width="1.2" fill="none"/>`).join("")}
<path d="M13 18h74M9 44h82M9 74h82M13 100h74" stroke="url(#${h})" stroke-width="6"/>${[[20, 18], [80, 18], [12, 44], [88, 44], [12, 74], [88, 74]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.3" fill="#e6e6e6"/>`).join("")}
<ellipse cx="50" cy="10" rx="34" ry="6" fill="url(#${t})"/><ellipse cx="50" cy="10" rx="34" ry="6" fill="none" stroke="#2a2a2a" stroke-width="2.4"/><path d="M50 4v12M36 5v10M64 5v10" stroke="#6a3f1c" stroke-width=".8" opacity=".6"/><circle cx="50" cy="60" r="4" fill="#3a1f0c"/><circle cx="49" cy="59" r="1.4" fill="#c58d55"/></svg>`;
  }
  function cork() {
    const c = id("ck");
    return `<svg viewBox="0 0 40 56"><defs><linearGradient id="${c}" x1="0" x2="1"><stop offset="0" stop-color="#b98a52"/><stop offset=".45" stop-color="#e2bd86"/><stop offset="1" stop-color="#a87a44"/></linearGradient></defs><path d="M7 8h26l-2 42H9z" fill="url(#${c})"/><ellipse cx="20" cy="8" rx="13" ry="4.5" fill="#ecd0a2" stroke="#b98a52" stroke-width=".8"/><ellipse cx="20" cy="50" rx="11" ry="3.6" fill="#8a2242"/>
${[[13, 20], [26, 26], [17, 33], [24, 40], [14, 43], [27, 15]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.4" ry=".9" fill="#7a5230" opacity=".7"/>`).join("")}<path d="M10 46c4 2 16 2 20 0" stroke="#8a2242" stroke-width="3" opacity=".55"/></svg>`;
  }
  function corkscrew() {
    const m = id("m");
    return `<svg viewBox="0 0 110 64"><defs><linearGradient id="${m}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5c1530"/><stop offset=".5" stop-color="#9b2c52"/><stop offset="1" stop-color="#3d1022"/></linearGradient></defs><rect x="6" y="8" width="98" height="14" rx="7" fill="url(#${m})"/><rect x="10" y="10" width="88" height="3" rx="1.5" fill="#fff" opacity=".25"/><circle cx="55" cy="15" r="3" fill="#d8c08a"/>
<path d="M55 22v6c-5 1-5 5 0 6s5 5 0 6-5 5 0 6 5 5 0 6" stroke="#bdbdbd" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M14 22l10 8" stroke="#bdbdbd" stroke-width="3" stroke-linecap="round"/></svg>`;
  }
  const PROPS = { grapesR: () => grapes("red"), grapesW: () => grapes("white"), glassR: () => glass("red"), glassRo: () => glass("rose"), glassW: () => glass("white"), flute, bottleR: () => bottle("red"), bottleS: () => bottle("sparkling"), bottleW: () => bottle("white"), barrel, cork, corkscrew };
  const PSIZE = { grapesR: 84, grapesW: 78, glassR: 52, glassRo: 50, glassW: 50, flute: 34, bottleR: 40, bottleS: 40, bottleW: 40, barrel: 84, cork: 30, corkscrew: 78 };
  const GROUPS = [
    [["bottleR", 4, 0, 1], ["glassR", 46, 34, .9], ["grapesR", 50, 62, .7]],
    [["flute", 10, 6, 1.1], ["flute", 46, 16, 1], ["cork", 72, 72, .9]],
    [["barrel", 0, 24, .9], ["glassR", 62, 0, .85]],
    [["grapesW", 0, 30, .85], ["glassW", 52, 0, .95]],
    [["bottleS", 8, 0, 1], ["flute", 50, 32, .95]],
    [["corkscrew", 0, 64, .7], ["cork", 66, 6, .9], ["glassRo", 38, 4, .8]]
  ];

  /* ---------- goats (painted brand set) and their little stories ---------- */
  const heart = c => `<svg viewBox="0 0 20 18"><path d="M10 17S1 11 1 5.5A4.5 4.5 0 0 1 10 3a4.5 4.5 0 0 1 9 2.5C19 11 10 17 10 17z" fill="${c}"/></svg>`;
  const SC = {
    sip: n => `<div class="dkS dkSip">${IMG(n)}<i class="dkH">${heart("#c2577f")}</i><i class="dkH h2">${heart("#e58aa7")}</i></div>`,
    pop: n => `<div class="dkS dkPop">${IMG(n)}<i class="dkCk">${cork()}</i><i class="dkSpr"><b></b><b></b><b></b><b></b><b></b><b></b></i><i class="dkPw">POP!</i></div>`,
    play: n => `<div class="dkS dkPlay">${IMG(n)}<i class="dkJ">${grapes("red")}</i></div>`,
    laugh: n => `<div class="dkS dkLaugh">${IMG(n)}<i class="dkHa">Ha ha!</i></div>`,
    barrel: n => `<div class="dkS dkOnB"><i class="dkBr">${barrel()}</i>${IMG(n)}</div>`,
    leap: n => `<div class="dkS dkLeap">${IMG(n)}</div>`,
    cheers: n => `<div class="dkS dkCheers">${IMG(n)}<i class="dkCg">${glass("red")}</i><i class="dkTing">✦</i></div>`
  };
  const STORIES = [["sip", 4], ["pop", 6], ["play", 11], ["barrel", 8], ["laugh", 3], ["leap", 14], ["sip", 49], ["play", 43], ["pop", 50], ["cheers", 38],
    ["barrel", 44], ["laugh", 42], ["sip", 54], ["leap", 41], ["play", 34], ["pop", 45], ["cheers", 1], ["barrel", 56], ["sip", 17], ["leap", 53], ["laugh", 15], ["play", 30]];
  const WALKERS = [5, 38, 44, 51, 56, 8, 26, 32];

  const css = `.dkL{position:absolute;left:0;top:0;width:100%;height:0;pointer-events:none;z-index:2}
.dkI{position:absolute;pointer-events:none;will-change:transform}.dkI svg,.dkI img,.dkMob svg,.dkMob img,.dkWalk svg,.dkWalk img{display:block;width:100%;height:auto}
.dkI.far{filter:blur(1.2px) saturate(.85);opacity:.55}.dkI.mid{opacity:.9}.dkI.near{filter:drop-shadow(0 14px 18px rgba(60,15,30,.18))}
.dkA.fl{animation:dkFl 9s ease-in-out infinite}.dkA.sw{transform-origin:50% 4%;animation:dkSw 7s ease-in-out infinite}.dkA.bo{animation:dkBo 6s ease-in-out infinite}.dkA{transform:rotate(var(--r,0deg))}
@keyframes dkFl{0%,100%{transform:translateY(0) rotate(var(--r,0deg))}50%{transform:translateY(-14px) rotate(calc(var(--r,0deg) + 4deg))}}
@keyframes dkSw{0%,100%{transform:rotate(calc(var(--r,0deg) - 7deg))}50%{transform:rotate(calc(var(--r,0deg) + 7deg))}}
@keyframes dkBo{0%,100%{transform:translateY(0) rotate(var(--r,0deg))}40%{transform:translateY(-8px) rotate(calc(var(--r,0deg) - 3deg))}70%{transform:translateY(-3px) rotate(calc(var(--r,0deg) + 2deg))}}
.dkB{animation:dkFz 2.8s linear infinite}@keyframes dkFz{0%{transform:translateY(0);opacity:0}15%{opacity:1}100%{transform:translateY(-16px);opacity:0}}
.dkS{position:relative}.dkS>img{position:relative;z-index:1;display:block;width:100%;height:auto}.dkS i{position:absolute;font-style:normal;z-index:2;pointer-events:none}.dkS i svg{width:100%;height:auto;display:block}
.dkSip>img{transform-origin:50% 92%;animation:dkSipA 4.6s ease-in-out infinite}.dkSip .dkH{width:16%;top:4%;right:4%;opacity:0;animation:dkHeart 4.6s ease-out infinite}.dkSip .h2{width:10%;right:20%;top:12%;animation-delay:.45s}
@keyframes dkSipA{0%,28%,100%{transform:rotate(0)}38%,60%{transform:rotate(-8deg) translateY(-3px)}48%{transform:rotate(-10deg) translateY(-5px)}}
@keyframes dkHeart{0%,52%{opacity:0;transform:translateY(0) scale(.5)}62%{opacity:1}100%{opacity:0;transform:translateY(-46px) scale(1.15) rotate(12deg)}}
.dkPop>img{transform-origin:50% 95%;animation:dkPopG 4.4s ease-in-out infinite}.dkPop .dkCk{width:12%;left:58%;top:6%;opacity:0;animation:dkCork 4.4s cubic-bezier(.2,.8,.3,1) infinite}
.dkPop .dkSpr{left:58%;top:12%;width:30%;height:30%}.dkPop .dkSpr b{position:absolute;left:20%;top:40%;width:8px;height:8px;border-radius:50%;background:radial-gradient(circle at 30% 30%,#fff,#f2cf87);opacity:0;animation:dkSpray 4.4s ease-out infinite}
.dkPop .dkSpr b:nth-child(2){--dx:22px;--dy:-30px;animation-delay:.04s}.dkPop .dkSpr b:nth-child(3){--dx:-18px;--dy:-34px;animation-delay:.08s;width:6px;height:6px}.dkPop .dkSpr b:nth-child(4){--dx:30px;--dy:-12px;animation-delay:.1s}.dkPop .dkSpr b:nth-child(5){--dx:6px;--dy:-44px;animation-delay:.14s;width:5px;height:5px}.dkPop .dkSpr b:nth-child(6){--dx:-26px;--dy:-14px;animation-delay:.16s}
.dkPop .dkPw{right:-6%;top:-4%;font:900 15px/1 system-ui,sans-serif;color:#f2cf87;text-shadow:0 2px 0 #7a1f3d,0 0 8px rgba(255,255,255,.6);opacity:0;animation:dkPopW 4.4s ease-out infinite}
@keyframes dkPopG{0%,30%,100%{transform:rotate(0)}34%{transform:rotate(3deg) scale(1.02,.98)}38%{transform:rotate(-4deg) translateY(-4px)}46%{transform:rotate(0)}}
@keyframes dkCork{0%,34%{opacity:0;transform:translate(0,0) rotate(0)}36%{opacity:1}48%{opacity:1;transform:translate(16px,-80px) rotate(260deg)}64%{opacity:0;transform:translate(30px,-40px) rotate(520deg)}100%{opacity:0}}
@keyframes dkSpray{0%,35%{opacity:0;transform:translate(0,0)}38%{opacity:1}62%{opacity:0;transform:translate(var(--dx,12px),var(--dy,-36px))}100%{opacity:0}}
@keyframes dkPopW{0%,35%{opacity:0;transform:scale(.3) rotate(-14deg)}42%{opacity:1;transform:scale(1.2) rotate(-8deg)}60%{opacity:1;transform:scale(1) rotate(-8deg)}72%,100%{opacity:0}}
.dkPlay>img{transform-origin:50% 95%;animation:dkPlayG 3s ease-in-out infinite}.dkPlay .dkJ{width:26%;left:-6%;top:-4%;animation:dkToss 3s cubic-bezier(.45,0,.55,1) infinite}
@keyframes dkPlayG{0%,100%{transform:rotate(0)}20%{transform:rotate(-3deg) translateY(2px)}30%{transform:rotate(2deg) translateY(-4px)}}
@keyframes dkToss{0%,100%{transform:translate(40%,90%) rotate(-20deg)}30%{transform:translate(0,-60%) rotate(140deg)}55%{transform:translate(-20%,-20%) rotate(250deg)}80%{transform:translate(30%,70%) rotate(330deg)}}
.dkLaugh>img{transform-origin:50% 100%;animation:dkGig 3.8s ease-in-out infinite}.dkLaugh .dkHa{top:-8%;right:-10%;background:#fff;color:#7a1f3d;font:800 12px/1 system-ui,sans-serif;padding:6px 9px;border-radius:14px 14px 14px 3px;box-shadow:0 6px 14px rgba(60,15,30,.18);opacity:0;animation:dkHa 3.8s ease-out infinite;white-space:nowrap}
@keyframes dkGig{0%,38%,100%{transform:rotate(0)}42%{transform:rotate(-4deg) scale(1.02)}46%{transform:rotate(4deg)}50%{transform:rotate(-4deg) scale(1.03)}54%{transform:rotate(3deg)}58%{transform:rotate(-2deg)}62%{transform:rotate(0)}}
@keyframes dkHa{0%,38%{opacity:0;transform:scale(.4)}44%{opacity:1;transform:scale(1.1)}50%,70%{opacity:1;transform:scale(1)}82%,100%{opacity:0;transform:translateY(-10px)}}
.dkOnB{padding-top:22%}.dkOnB .dkBr{width:50%;right:0;bottom:0;z-index:0}.dkOnB>img{width:54%;animation:dkJump 6.5s cubic-bezier(.3,.7,.4,1) infinite}
@keyframes dkJump{0%,12%{transform:translate(0,0)}16%{transform:translate(0,6%) scale(1.05,.94)}26%{transform:translate(40%,-48%) rotate(-10deg)}34%,58%{transform:translate(82%,-40%) rotate(0)}38%{transform:translate(82%,-37%) scale(1.04,.96)}62%{transform:translate(82%,-54%)}66%,70%{transform:translate(82%,-40%)}82%{transform:translate(38%,-32%) rotate(8deg)}90%,100%{transform:translate(0,0)}}
.dkLeap>img{animation:dkLeapA 5s cubic-bezier(.3,.7,.4,1) infinite}@keyframes dkLeapA{0%,58%,100%{transform:translateY(0) scale(1)}62%{transform:translateY(5px) scale(1.05,.93)}72%{transform:translateY(-52px) rotate(-7deg)}82%{transform:translateY(0) scale(1.04,.96)}87%{transform:translateY(-12px)}92%{transform:translateY(0)}}
.dkCheers>img{transform-origin:40% 95%;animation:dkChG 4s ease-in-out infinite}.dkCheers .dkCg{width:20%;right:-12%;top:18%;transform-origin:50% 100%;animation:dkChC 4s ease-in-out infinite}.dkCheers .dkTing{right:2%;top:10%;color:#f2cf87;font-size:18px;text-shadow:0 0 6px #fff;opacity:0;animation:dkTing 4s ease-out infinite}
@keyframes dkChG{0%,30%,100%{transform:rotate(0)}42%,55%{transform:rotate(6deg)}}@keyframes dkChC{0%,30%,100%{transform:rotate(0)}42%,55%{transform:rotate(-16deg) translateX(-8px)}}@keyframes dkTing{0%,42%{opacity:0;transform:scale(.4)}46%{opacity:1;transform:scale(1.3)}60%,100%{opacity:0;transform:scale(.8)}}
.dkWalk{position:relative;height:118px;overflow:hidden;pointer-events:none}.dkWalk:before{content:"";position:absolute;left:6%;right:6%;bottom:12px;height:14px;background:radial-gradient(ellipse at center,rgba(122,31,61,.10),transparent 70%)}
.dkWalk .dkW{position:absolute;bottom:14px;left:0;width:80px;animation:dkWalkX var(--t,34s) linear infinite}.dkWalk .dkW img{animation:dkStep .5s ease-in-out infinite alternate}
.dkWalk .dkW.rv{animation-direction:reverse}.dkWalk .dkW.rv img{animation-name:dkStepR}.dkWalk .dkP{position:absolute;bottom:14px}
@keyframes dkWalkX{0%{transform:translateX(-100px)}100%{transform:translateX(calc(100vw + 30px))}}
@keyframes dkStep{0%{transform:translateY(0) rotate(-3deg)}100%{transform:translateY(-7px) rotate(3deg)}}@keyframes dkStepR{0%{transform:scaleX(-1) translateY(0) rotate(-3deg)}100%{transform:scaleX(-1) translateY(-7px) rotate(3deg)}}
.dkMob{display:flex;justify-content:center;align-items:flex-end;gap:12px;margin:10px auto 0;height:124px;pointer-events:none}.dkMob>*{flex:0 0 auto}
@media (min-width:1100px){.dkMob{display:none}}@media (max-width:700px){.dkWalk{height:96px}.dkWalk .dkW{width:62px;animation-duration:18s}}
.dk-bub{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0}.dk-bub i{position:absolute;bottom:-30px;border-radius:50%;background:radial-gradient(circle at 32% 30%,rgba(255,255,255,.95),rgba(255,236,190,.45) 45%,rgba(242,207,135,.12) 70%);box-shadow:inset 0 0 0 1px rgba(255,255,255,.4);animation:dkRise linear infinite}
@keyframes dkRise{0%{transform:translate(0,0);opacity:0}10%{opacity:.9}50%{transform:translate(14px,-45vh)}100%{transform:translate(-10px,-95vh);opacity:0}}
.dk-host{position:relative;isolation:isolate}.dk-host>*:not(.dk-bub){position:relative;z-index:1}
.dkI[data-s=r] .dkHa{right:auto;left:-14%;border-radius:14px 14px 3px 14px}.dkI[data-s=r] .dkPw{right:auto;left:-10%}
@media (prefers-reduced-motion:reduce){.dkL *,.dkWalk *,.dkMob *,.dk-bub i{animation:none!important}.dk-bub{display:none}.dkWalk .dkW{left:46%}.dkS i{display:none}}`;
  const DEMO = document.getElementById("dkDemo");
  const st = document.createElement("style"); st.textContent = DEMO ? css.replace(/@media \(prefers-reduced-motion:reduce\)\{[^]*$/, "") : css; document.head.appendChild(st);
  if (DEMO) { // showcase page: every goat scene, walkers and props, always animated
    const L = { sip: "Beve dal calice", pop: "Stappa la bottiglia", play: "Gioca con il grappolo", laugh: "Ride", barrel: "Salta sulla botte", leap: "Salta di gioia", cheers: "Brinda" };
    const used = {}; DEMO.innerHTML = `<div class="dmG">${STORIES.filter(([t]) => (used[t] = (used[t] || 0) + 1) <= 2).map(([t, n]) => `<figure><div style="width:${t === "barrel" ? 200 : 160}px;margin:auto">${SC[t](n)}</div><figcaption>${L[t]}</figcaption></figure>`).join("")}</div>
<h2>Caprette che camminano</h2>${WALKERS.slice(0, 4).map((n, i) => `<div class="dkWalk"><div class="dkP" style="left:${20 + i * 15}%;width:46px">${PROPS[["barrel", "bottleR", "grapesR", "flute"][i]]()}</div><div class="dkW${i % 2 ? " rv" : ""}" style="--t:${14 + i * 3}s;animation-delay:-${i * 4}s">${IMG(n)}</div></div>`).join("")}
<h2>Oggetti</h2><div class="dmP">${Object.keys(PROPS).map(k => `<div style="width:${PSIZE[k]}px" class="dkA ${k.startsWith("grapes") ? "sw" : "fl"}">${PROPS[k]()}</div>`).join("")}</div>`;
    DEMO.querySelectorAll("img").forEach(i => i.loading = "eager");
    return;
  }

  /* seeded random: the same layout on every visit of a page, different from page to page */
  let seed = 7; for (const ch of location.pathname) seed = (Math.imul(seed, 31) + ch.charCodeAt(0)) >>> 0;
  const rnd = () => { seed = (seed + 0x6D2B79F5) >>> 0; let t = seed; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const pick = a => a[Math.floor(rnd() * a.length)];
  const mix = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const stories = mix(STORIES); let si = 0; const nextStory = () => stories[si++ % stories.length];
  const propKeys = Object.keys(PROPS);

  const isHome = !!document.querySelector(".hero3, #levels");
  const blocks = [...document.querySelectorAll(isHome ? "section.sec3, footer" : "main section, main .seosec, article > section, .seo section")]
    .filter((el, i, a) => a.indexOf(el) === i && el.offsetHeight > 160);

  document.querySelectorAll(".hero3, .fin3, .seocta, .seohero").forEach(h => {
    if (h.querySelector(".dk-bub")) return;
    const box = document.createElement("div"); box.className = "dk-bub"; box.setAttribute("aria-hidden", "true");
    const n = h.matches(".hero3") ? 18 : 12;
    for (let i = 0; i < n; i++) { const b = document.createElement("i"), s = 4 + Math.round(rnd() * 16); b.style.cssText = `left:${Math.round(rnd() * 96)}%;width:${s}px;height:${s}px;animation-duration:${(9 + rnd() * 11).toFixed(1)}s;animation-delay:-${(rnd() * 20).toFixed(1)}s`; box.appendChild(b); }
    h.classList.add("dk-host"); h.insertBefore(box, h.firstChild);
  });

  /* between sections: a goat walking past (sometimes past a prop), or a small vignette on phones */
  blocks.forEach((el, i) => {
    if (i === 0) return;
    const r = rnd();
    if (r < (isHome ? .4 : .26)) {
      const w = document.createElement("div"); w.className = "dkWalk"; w.setAttribute("aria-hidden", "true");
      const rv = rnd() < .5, t = 26 + Math.round(rnd() * 14), prop = rnd() < .6 ? pick(["barrel", "bottleR", "grapesR", "glassR", "flute", "bottleS"]) : null;
      w.innerHTML = (prop ? `<div class="dkP" style="left:${18 + Math.round(rnd() * 64)}%;width:${Math.round(PSIZE[prop] * .62)}px">${PROPS[prop]()}</div>` : "") +
        `<div class="dkW${rv ? " rv" : ""}" style="--t:${t}s;animation-delay:-${Math.round(rnd() * t)}s">${IMG(pick(WALKERS))}</div>`;
      el.parentNode.insertBefore(w, el);
    } else if (r < .82) {
      const m = document.createElement("div"); m.className = "dkMob"; m.setAttribute("aria-hidden", "true");
      const [type, n] = nextStory(), a = pick(propKeys), b = pick(propKeys);
      m.innerHTML = `<div style="width:${Math.round(PSIZE[a] * .55)}px;transform:rotate(${Math.round(rnd() * 24 - 12)}deg)">${PROPS[a]()}</div><div style="width:${type === "barrel" ? 120 : 96}px">${SC[type](n)}</div><div style="width:${Math.round(PSIZE[b] * .55)}px;transform:rotate(${Math.round(rnd() * 24 - 12)}deg)">${PROPS[b]()}</div>`;
      el.parentNode.insertBefore(m, el);
    }
  });

  /* wide screens: scattered items in the side margins, with depth and slow parallax */
  const layer = document.createElement("div"); layer.className = "dkL"; layer.setAttribute("aria-hidden", "true"); document.body.appendChild(layer);
  const items = [];
  function add(el, side, y, kind) {
    const o = document.createElement("div"), a = document.createElement("div");
    const depth = kind === "goat" ? (rnd() < .8 ? "near" : "mid") : pick(["far", "mid", "mid", "near", "near"]);
    const sc = depth === "far" ? .7 : depth === "mid" ? .9 : 1.05, rot = Math.round(rnd() * 30 - 15);
    let size;
    if (kind === "goat") { const [type, n] = nextStory(); size = Math.round((type === "barrel" ? 176 : 134) * (.85 + rnd() * .35)); a.className = "dkA"; a.innerHTML = SC[type](n); }
    else if (kind === "group") { const g = pick(GROUPS); size = Math.round(132 * sc); a.className = "dkA bo"; a.style.position = "relative"; a.style.height = Math.round(size * 1.15) + "px"; a.dataset.g = 1;
      a.innerHTML = g.map(([p, x, yy, s]) => `<div style="position:absolute;left:${x}%;top:${yy}%;width:${(PSIZE[p] * s * 1.05 / 132 * 100).toFixed(1)}%">${PROPS[p]()}</div>`).join(""); }
    else { const p = pick(propKeys); size = Math.round(PSIZE[p] * sc * (.95 + rnd() * .5)); a.className = "dkA " + (p.startsWith("grapes") ? "sw" : "fl"); a.innerHTML = PROPS[p](); }
    a.style.setProperty("--r", (kind === "goat" ? 0 : rot) + "deg"); a.style.animationDelay = -(rnd() * 8).toFixed(2) + "s";
    o.className = "dkI " + depth; o.dataset.s = side; o.appendChild(a); layer.appendChild(o);
    items.push({ el, o, a, size, side, y, jx: rnd(), par: depth === "far" ? .10 : depth === "mid" ? .05 : -.03 });
  }
  blocks.forEach(el => {
    const slots = Math.max(1, Math.round(el.offsetHeight / 520));
    ["l", "r"].forEach(side => {
      for (let s = 0; s < slots; s++) {
        if (rnd() < .18) continue;
        let y = (s + .15 + rnd() * .7) / slots; if (rnd() < .2) y += rnd() < .5 ? -.12 : .12;
        const r = rnd(); add(el, side, Math.max(-.08, Math.min(1.04, y)), r < .36 ? "goat" : r < .56 ? "group" : "prop");
      }
    });
  });
  function box(el) {
    const inner = el.querySelector(":scope > .w, :scope > .wrap, :scope > div") || el, r = inner.getBoundingClientRect(), cs = getComputedStyle(inner);
    return { left: r.left + (parseFloat(cs.paddingLeft) || 0), right: r.right - (parseFloat(cs.paddingRight) || 0), top: el.getBoundingClientRect().top + scrollY, h: el.offsetHeight };
  }
  function place() {
    const vw = document.documentElement.clientWidth, wide = vw >= 1100, used = { l: [], r: [] };
    if (wide) document.querySelectorAll("img, svg, picture").forEach(im => { // keep clear of the site's own illustrations
      if (im.closest(".dkL, .dkWalk, .dkMob, header, nav")) return; const r = im.getBoundingClientRect(); if (r.width < 30 || r.height < 30) return;
      const t = r.top + scrollY; if (r.left < vw * .2) used.l.push([t, t + r.height]); if (r.right > vw * .8) used.r.push([t, t + r.height]); });
    items.forEach(it => {
      if (!wide) { it.o.style.display = "none"; return; }
      const b = box(it.el), gap = it.side === "l" ? b.left : vw - b.right, room = gap - 20;
      if (room < 56) { it.o.style.display = "none"; return; }
      const w = Math.min(it.size, room - 6), top = Math.round(b.top + b.h * it.y - w * .5);
      if (used[it.side].some(([a, z]) => top < z + 24 && top + w * 1.25 > a - 24)) { it.o.style.display = "none"; return; }
      used[it.side].push([top, top + w * 1.25]);
      const x = it.side === "l" ? Math.max(6, (gap - w) * (.12 + it.jx * .76)) : b.right + 14 + Math.max(0, gap - w - 20) * (.12 + it.jx * .76);
      if (it.a.dataset.g) it.a.style.height = Math.round(w * 1.15) + "px";
      it.o.style.display = ""; it.o.style.width = w + "px"; it.o.style.left = Math.round(x) + "px"; it.o.style.top = top + "px"; it.top = top;
    });
    para();
  }
  function para() { const y = scrollY, vh = innerHeight; items.forEach(it => { if (it.o.style.display === "none") return; const d = (it.top - y - vh / 2) * it.par; it.o.style.transform = `translate3d(0,${d.toFixed(1)}px,0)`; }); }
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let raf = 0; const req = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(place); };
  addEventListener("resize", req); addEventListener("load", req); setTimeout(req, 700); setTimeout(req, 2500); place();
  if (!still) { let pr = 0; addEventListener("scroll", () => { if (pr) return; pr = requestAnimationFrame(() => { pr = 0; para(); }); }, { passive: true }); }
  if ("ResizeObserver" in window) new ResizeObserver(req).observe(document.body);
})();
