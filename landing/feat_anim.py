# -*- coding: utf-8 -*-
"""Home: four animated feature cards (visual first, almost no text).
1 open questions marked like the exam · 2 personal plan that adapts and fills the gaps
3 class recording + photos of notes · 4 films & podcasts.  Labels inside the animations are language-neutral."""
import html
e = lambda s: html.escape(str(s), quote=True)


def render(h, oq, img):
    W = h['why']
    q = oq['t'] if len(oq['t']) < 120 else oq['t'][:117].rsplit(' ', 1)[0] + '…'
    # 1 — exam paper marked live
    lines = ''.join(f'<div class="pl" style="--i:{i};--w:{w}%"><i></i><b class="{"ko" if i == 3 else "ok"}">{"✗" if i == 3 else "✓"}</b></div>'
                    for i, w in enumerate((92, 78, 86, 64, 74)))
    a = f'''<div class="fv fa" aria-hidden="true">
 <div class="paper"><div class="pq">{e(q)}</div>{lines}</div>
 <div class="ring"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" pathLength="100"/><circle class="rf" cx="22" cy="22" r="18" pathLength="100"/></svg><span><b class="sc">0</b><small>/5</small></span></div>
 <img class="fgo" src="{img}/goats/exam.webp" alt="" width="200" height="220" loading="lazy">
</div>'''
    # 2 — personal plan: goal, days ticked, weak topics filled over time, countdown
    days = ''.join(f'<span class="dy" style="--i:{i}"><i>✓</i></span>' for i in range(7))
    bars = ''.join(f'<div class="tb{" weak" if k == 1 else ""}" style="--a:{a0}%;--b:{b0}%"><span>{ic}</span><div><i></i></div><em>{"⚠️" if k == 1 else ""}</em></div>'
                   for k, (ic, a0, b0) in enumerate((('🍇', 58, 84), ('🌍', 22, 88), ('🍾', 66, 82), ('🥃', 44, 76))))
    b = f'''<div class="fv fb" aria-hidden="true">
 <div class="goals"><span>Pass</span><span class="g2">Merit</span><span>Distinction</span><b class="cd">📅 <i class="cdn">60</i></b></div>
 <div class="week">{days}</div>
 <div class="bars">{bars}</div>
 <img class="fgo" src="{img}/goats/free.webp" alt="" width="200" height="220" loading="lazy">
</div>'''
    # 3 — record the class: REC, waveform, transcript, photo of notes
    wave = ''.join(f'<i style="--d:{(i * 37) % 11 / 10:.1f}s;--h:{30 + (i * 53) % 60}%"></i>' for i in range(26))
    tr = ''.join(f'<p style="--i:{i};--w:{w}%"></p>' for i, w in enumerate((88, 72, 94, 60)))
    c = f'''<div class="fv fc" aria-hidden="true">
 <div class="rec"><span class="dot"></span>REC <b class="tm">00:00</b></div>
 <div class="wave">{wave}</div>
 <div class="trans">{tr}</div>
 <div class="polar"><div class="note"><span></span><span></span><span></span><em>🍇</em></div></div>
 <div class="flash"></div>
 <img class="fgo" src="{img}/goats/guide.webp" alt="" width="200" height="220" loading="lazy">
</div>'''
    # 4 — films & podcasts
    eq = ''.join(f'<i style="--d:{d}s"></i>' for d in (0, .25, .5, .15, .4))
    d = f'''<div class="fv fd" aria-hidden="true">
 <div class="film"><svg viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
   <defs><linearGradient id="fsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7c99b"/><stop offset="1" stop-color="#fbe9d6"/></linearGradient></defs>
   <rect width="320" height="150" fill="url(#fsky)"/><circle class="sun" cx="250" cy="70" r="20" fill="#f4b24a"/>
   <path class="hb" d="M-20 110 C40 80 110 86 170 100 S280 84 360 96 V160 H-20Z" fill="#c9a77d"/>
   <g class="rows"><path d="M-40 150 C20 112 80 108 140 116 S260 104 400 112" fill="none" stroke="#6f8a3f" stroke-width="5" stroke-dasharray="2 10" stroke-linecap="round"/>
   <path d="M-40 160 C20 124 80 122 140 128 S260 118 400 124" fill="none" stroke="#5c7633" stroke-width="6" stroke-dasharray="2 11" stroke-linecap="round"/></g>
   <path d="M-20 126 C60 110 140 118 200 124 S300 112 360 118 V160 H-20Z" fill="#8aa04f"/>
 </svg><img class="fgoat" src="{img}/goats/hero.webp" alt="" width="120" height="137" loading="lazy">
 <span class="play">▶</span><div class="fbar"><i></i></div><span class="chip">🎬 68</span></div>
 <div class="pod"><img src="{img}/goats/mosaic.webp" alt="" width="200" height="220" loading="lazy"><div class="pt"><p></p><p></p><div class="pbar"><i></i></div></div><div class="eq">{eq}</div><span class="chip">🎧 45</span></div>
</div>'''
    vis = (a, b, d, c)
    order = (0, 1, 3, 2)  # open questions, plan, class recording, films & podcasts
    cards = ''
    for n, k in enumerate(order):
        ic, t, p = W[k]
        v = (a, b, d, c)[k]
        cards += f'<article class="fcard">{v}<h3><span>{ic}</span>{e(t)}</h3><p class="fsr">{e(p)}</p></article>'
    return f'<div class="fgrid4">{cards}</div>'


CSS = r'''
/* ===== animated feature cards ===== */
.feat3{padding-top:36px}
.fgrid4{display:grid;grid-template-columns:repeat(2,1fr);gap:22px;margin-top:30px}
.fcard{position:relative;background:#fff;border-radius:28px;padding:14px 14px 20px;box-shadow:inset 0 0 0 1.5px #f0e2d8,0 22px 44px -30px rgba(62,15,34,.45)}
.fcard h3{display:flex;gap:10px;align-items:center;margin:16px 8px 0;font-size:21px;line-height:1.2}
.fcard h3 span{font-size:24px}
.fsr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;margin:0}
.fv{direction:ltr;position:relative;height:270px;border-radius:20px;overflow:hidden;background:linear-gradient(160deg,#fdf3ea,#f6e6da)}
.fgo{position:absolute;right:6px;bottom:-4px;width:84px;height:auto;filter:drop-shadow(0 8px 10px rgba(62,15,34,.18));animation:fxfsway 4s ease-in-out infinite;transform-origin:50% 100%}
@keyframes fxfsway{50%{transform:rotate(-4deg)}}
.fcard .fv *{animation-play-state:paused}.fcard.play .fv *{animation-play-state:running}

/* 1 — exam paper */
.fa .paper{position:absolute;left:18px;top:18px;right:104px;bottom:18px;background:#fffdf8;border-radius:12px;padding:14px 16px;box-shadow:0 10px 24px -14px rgba(62,15,34,.35);
 }
.fa .pq{font:700 12.5px/1.35 inherit;color:#3e0f22;margin-bottom:12px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:34px}
.fa .pl{position:relative;height:31px;border-bottom:1px solid #f1e6da;display:flex;align-items:center;gap:10px}
.fa .pl i{display:block;height:7px;border-radius:4px;background:#8a7a80;width:0;animation:fxftype 9s calc(var(--i)*.55s) infinite}
@keyframes fxftype{0%{width:0}6%{width:var(--w)}88%{width:var(--w);opacity:1}96%,100%{width:var(--w);opacity:0}}
.fa .pl b{position:absolute;right:-6px;font:900 20px/1 inherit;transform:scale(0);animation:fxftick 9s calc(4s + var(--i)*.35s) infinite}
.fa .pl b.ok{color:#2f8a4e}.fa .pl b.ko{color:#c0392b}
@keyframes fxftick{0%{transform:scale(0)}4%{transform:scale(1.4)}7%{transform:scale(1)}48%{transform:scale(1);opacity:1}56%,100%{transform:scale(0);opacity:0}}
.fa .ring{position:absolute;right:16px;top:24px;width:78px;height:78px}
.fa .ring svg{width:100%;height:100%;transform:rotate(-90deg)}
.fa .ring circle{fill:none;stroke:#f0dfe3;stroke-width:5}
.fa .ring .rf{stroke:#2f8a4e;stroke-linecap:round;stroke-dasharray:100;stroke-dashoffset:100;opacity:0;animation:fxfring 9s infinite}
@keyframes fxfring{0%,44%{stroke-dashoffset:100;opacity:0}46%{opacity:1}66%,90%{stroke-dashoffset:20;opacity:1}97%,100%{stroke-dashoffset:100;opacity:0}}
.fa .ring span{position:absolute;inset:0;display:flex;align-items:baseline;justify-content:center;padding-top:22px;color:#3e0f22}
.fa .ring b{font:800 26px/1 Fraunces,Georgia,serif}.fa .ring small{font-weight:700;color:#8a7a80}

/* 2 — plan */
.fb{padding:18px}
.fb .goals{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.fb .goals span{padding:6px 12px;border-radius:999px;background:#fff;box-shadow:inset 0 0 0 1.5px #ead8dc;font-weight:700;font-size:13px;color:#6b5a5f}
.fb .goals .g2{animation:fxfgoal 9s infinite}
@keyframes fxfgoal{0%,6%{background:#fff;color:#6b5a5f;transform:none}10%,92%{background:#8c1d40;color:#fff;transform:scale(1.08)}100%{background:#fff;color:#6b5a5f}}
.fb .cd{margin-left:auto;padding:6px 12px;border-radius:12px;background:#3e0f22;color:#fff;font-size:14px}
.fb .week{display:flex;gap:8px;margin:18px 0 16px}
.fb .dy{flex:1;height:30px;border-radius:10px;background:#fff;box-shadow:inset 0 0 0 1.5px #ead8dc;display:grid;place-items:center;animation:fxfday 9s calc(1s + var(--i)*.5s) infinite}
.fb .dy i{font-style:normal;color:#fff;font-weight:900;opacity:0;animation:fxfdayi 9s calc(1s + var(--i)*.5s) infinite}
@keyframes fxfday{0%{background:#fff}4%,88%{background:#2f8a4e;box-shadow:none}96%,100%{background:#fff}}
@keyframes fxfdayi{0%{opacity:0}4%,88%{opacity:1}96%,100%{opacity:0}}
.fb .bars{display:grid;gap:10px;margin-right:84px}
.fb .tb{display:grid;grid-template-columns:24px 1fr 22px;align-items:center;gap:8px}
.fb .tb>div{height:12px;border-radius:8px;background:#fff;box-shadow:inset 0 0 0 1.5px #ead8dc;overflow:hidden}
.fb .tb i{display:block;height:100%;border-radius:8px;background:#d4a23a;width:var(--a);animation:fxfbar 9s infinite}
.fb .tb.weak i{background:#c0392b;animation-name:fxfbarw}
@keyframes fxfbar{0%,20%{width:var(--a)}70%,90%{width:var(--b)}100%{width:var(--a)}}
@keyframes fxfbarw{0%,20%{width:var(--a);background:#c0392b}55%{background:#d4a23a}70%,90%{width:var(--b);background:#2f8a4e}100%{width:var(--a);background:#c0392b}}
.fb .tb em{font-style:normal;font-size:16px;animation:fxfwarn 9s infinite}
@keyframes fxfwarn{0%,10%{transform:scale(1)}14%{transform:scale(1.35)}18%,60%{transform:scale(1)}66%,94%{opacity:0}100%{opacity:1}}

/* 3 — record */
.fc{padding:18px;background:linear-gradient(160deg,#fbeef0,#f3e3e8)}
.fc .rec{display:inline-flex;align-items:center;gap:8px;padding:6px 12px;border-radius:999px;background:#3e0f22;color:#fff;font-weight:800;font-size:13px;letter-spacing:.06em}
.fc .rec b{font-variant-numeric:tabular-nums;font-weight:700;letter-spacing:0;opacity:.9}
.fc .dot{width:10px;height:10px;border-radius:50%;background:#ff4d5e;animation:fxfdot 1.2s ease-in-out infinite}
@keyframes fxfdot{50%{opacity:.3;transform:scale(.8)}}
.fc .wave{display:flex;align-items:center;gap:4px;height:56px;margin:14px 0 10px}
.fc .wave i{flex:1;height:var(--h);border-radius:3px;background:linear-gradient(#a3264f,#d46a8a);animation:fxfwave 1.1s ease-in-out var(--d) infinite alternate}
@keyframes fxfwave{from{transform:scaleY(.25)}to{transform:scaleY(1)}}
.fc .trans{margin-right:130px}
.fc .trans p{height:8px;border-radius:4px;background:#bba9b0;margin:0 0 12px;width:0;animation:fxftr 9s calc(.6s + var(--i)*1.1s) infinite}
@keyframes fxftr{0%{width:0}8%,86%{width:var(--w);opacity:1}94%,100%{width:var(--w);opacity:0}}
.fc .polar{position:absolute;right:76px;top:86px;width:112px;padding:8px 8px 22px;background:#fff;border-radius:6px;box-shadow:0 16px 26px -14px rgba(62,15,34,.55);transform:translate(280px,0) rotate(12deg);animation:fxfpol 9s infinite}
@keyframes fxfpol{0%,48%{transform:translate(280px,0) rotate(14deg)}56%{transform:translate(0,0) rotate(-8deg)}60%,90%{transform:translate(0,0) rotate(-6deg)}98%,100%{transform:translate(280px,0) rotate(14deg)}}
.fc .note{height:84px;border-radius:3px;background:#fdf6e3;background-image:repeating-linear-gradient(transparent 0 13px,#e6d9bd 13px 14px);position:relative;padding:12px 8px}
.fc .note span{display:block;height:4px;border-radius:2px;background:#3e5aa8;margin:0 0 10px;width:70%}.fc .note span+span{width:50%}.fc .note span+span+span{width:62%}
.fc .note em{position:absolute;right:6px;bottom:4px;font-style:normal;font-size:20px}
.fc .flash{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none;animation:fxfflash 9s infinite}
@keyframes fxfflash{0%,50%{opacity:0}52%{opacity:.85}56%,100%{opacity:0}}
.fc .fgo{right:auto;left:auto;right:4px}

/* 4 — films & podcasts */
.fd{padding:14px;display:grid;grid-template-rows:1fr auto;gap:12px;background:linear-gradient(160deg,#f2efe6,#e9e4d6)}
.fd .film{position:relative;border-radius:14px;overflow:hidden;background:#3e0f22;min-height:0}
.fd .film svg{display:block;width:100%;height:100%}
.fd .sun{animation:fxfsun 9s ease-in-out infinite}
@keyframes fxfsun{0%{transform:translateY(40px)}50%{transform:translateY(-18px)}100%{transform:translateY(40px)}}
.fd .rows{animation:fxfrows 9s linear infinite}
@keyframes fxfrows{to{transform:translateX(-60px)}}
.fd .fgoat{position:absolute;left:18%;bottom:12%;width:58px;height:auto;animation:fxfhop 1.6s ease-in-out infinite}
@keyframes fxfhop{0%,100%{transform:translateY(0)}40%{transform:translateY(-14px) rotate(-6deg)}60%{transform:translateY(-14px) rotate(4deg)}}
.fd .play{position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);width:46px;height:46px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.9);color:#8c1d40;font-size:18px;padding-left:3px;box-shadow:0 8px 20px -8px rgba(0,0,0,.4);animation:fxfplay 9s infinite}
@keyframes fxfplay{0%,8%{opacity:1;transform:translate(-50%,-50%) scale(1)}12%{transform:translate(-50%,-50%) scale(.85)}16%,100%{opacity:0;transform:translate(-50%,-50%) scale(1.4)}}
.fd .fbar{position:absolute;left:12px;right:12px;bottom:10px;height:5px;border-radius:3px;background:rgba(255,255,255,.45)}
.fd .fbar i,.fd .pbar i{display:block;height:100%;border-radius:3px;background:#fff;width:0;animation:fxfprog 9s linear infinite}
@keyframes fxfprog{to{width:100%}}
.fd .chip{position:absolute;right:10px;top:10px;padding:4px 10px;border-radius:999px;background:rgba(62,15,34,.82);color:#fff;font-weight:800;font-size:13px}
.fd .pod{position:relative;display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:14px;background:#fff;box-shadow:0 10px 20px -16px rgba(62,15,34,.5)}
.fd .pod img{width:46px;height:46px;object-fit:cover;object-position:50% 20%;border-radius:12px;background:#f6e6da}
.fd .pt{flex:1}.fd .pt p{height:7px;border-radius:4px;background:#bba9b0;margin:0 0 7px;width:70%}.fd .pt p+p{width:45%}
.fd .pbar{height:4px;border-radius:2px;background:#eadbd3}.fd .pbar i{background:#8c1d40;animation-duration:14s}
.fd .eq{display:flex;align-items:flex-end;gap:3px;height:26px;margin-right:64px}
.fd .eq i{width:5px;height:100%;border-radius:2px;background:#8c1d40;animation:fxfeq .8s ease-in-out var(--d) infinite alternate;transform-origin:50% 100%}
@keyframes fxfeq{from{transform:scaleY(.2)}to{transform:scaleY(1)}}
.fd .pod .chip{top:50%;transform:translateY(-50%);background:#3e0f22}

@media (max-width:860px){.fgrid4{grid-template-columns:1fr}}
@media (max-width:420px){.fv{height:250px}.fa .paper{right:96px;padding:12px 14px}.fa .pq{font-size:12px;margin-bottom:6px}.fa .pl{height:26px}.fcard h3{font-size:19px}.fb .goals span{padding:5px 9px;font-size:12px}.fc .trans{margin-right:112px}.fc .polar{right:62px;width:96px}}
@media (prefers-reduced-motion:reduce){.fcard .fv *{animation:none!important}.fa .pl i{width:var(--w)}.fa .pl b{transform:none}.fa .ring .rf{stroke-dashoffset:20}.fb .tb i{width:var(--b)}.fc .trans p{width:var(--w)}.fc .polar{transform:rotate(-6deg)}}
'''

JS = r'''
(function(){
 var cards=[].slice.call(document.querySelectorAll('.fcard')); if(!cards.length) return;
 var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 function cycle(card){
  var sc=card.querySelector('.sc'), cd=card.querySelector('.cdn'), tm=card.querySelector('.tm');
  function run(){
   var t0=Date.now();
   var iv=setInterval(function(){ var t=(Date.now()-t0)/1000;
     if(sc){ var n=t<4.2?0:Math.min(4,Math.floor((t-4.2)/.45)+1); if(t>8.6) n=0; sc.textContent=n; }
     if(cd){ var d=Math.max(0,Math.round(60-t*6)); if(t>8.6) d=60; cd.textContent='D-'+d; }
     if(tm){ var s=Math.floor(t*140); tm.textContent=('0'+Math.floor(s/60)).slice(-2)+':'+('0'+(s%60)).slice(-2); }
     if(t>=9){ clearInterval(iv); if(card.classList.contains('play')) run(); }
   },120);
  }
  run();
 }
 if(RM){ cards.forEach(function(c){ var sc=c.querySelector('.sc'); if(sc) sc.textContent='4'; var cd=c.querySelector('.cdn'); if(cd) cd.textContent='D-42'; var tm=c.querySelector('.tm'); if(tm) tm.textContent='12:34'; }); return; }
 cards.forEach(function(c){ var cd=c.querySelector('.cdn'); if(cd) cd.textContent='D-60'; });
 if(!('IntersectionObserver' in window)){ cards.forEach(function(c){ c.classList.add('play'); cycle(c); }); return; }
 var io=new IntersectionObserver(function(es){ es.forEach(function(en){ var c=en.target;
   if(en.isIntersecting&&!c.classList.contains('play')){ c.classList.add('play'); cycle(c); } }); },{threshold:.35});
 cards.forEach(function(c){ io.observe(c); });
})();
'''
