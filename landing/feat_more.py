# -*- coding: utf-8 -*-
"""Second row of animated features: mock exams · maps · games · flashcards (labels language-neutral)."""
import html
e = lambda s: html.escape(str(s), quote=True)

MORE = {
 'en': ('Timed mock exams', 'Interactive wine maps', 'Games that make it stick', 'Smart flashcards'),
 'it': ("Simulazioni d'esame a tempo", 'Mappe del vino interattive', 'Giochi che fanno ricordare', 'Flashcard intelligenti'),
 'fr': ('Examens blancs chronométrés', 'Cartes des vins interactives', 'Des jeux pour mémoriser', 'Flashcards intelligentes'),
 'es': ('Simulacros de examen cronometrados', 'Mapas del vino interactivos', 'Juegos para memorizar', 'Flashcards inteligentes'),
 'de': ('Probeprüfungen mit Zeitlimit', 'Interaktive Weinkarten', 'Spiele, die hängen bleiben', 'Smarte Lernkarten'),
 'nl': ('Proefexamens op tijd', 'Interactieve wijnkaarten', 'Spelletjes die blijven hangen', 'Slimme flashcards'),
 'pt': ('Exames simulados cronometrados', 'Mapas de vinho interativos', 'Jogos para memorizar', 'Flashcards inteligentes'),
 'pt-br': ('Simulados cronometrados', 'Mapas de vinho interativos', 'Jogos para memorizar', 'Flashcards inteligentes'),
 'el': ('Χρονομετρημένες δοκιμαστικές εξετάσεις', 'Διαδραστικοί χάρτες κρασιού', 'Παιχνίδια που μένουν στη μνήμη', 'Έξυπνες κάρτες μελέτης'),
 'ja': ('本番と同じ時間の模擬試験', 'インタラクティブなワインマップ', '記憶に残るゲーム', 'スマートな単語カード'),
 'ko': ('실전처럼 시간을 재는 모의고사', '인터랙티브 와인 지도', '기억에 남는 게임', '스마트 플래시카드'),
 'zh-hans': ('限时全真模拟考试', '互动葡萄酒地图', '让知识记得牢的小游戏', '智能闪卡'),
 'zh-hant': ('限時全真模擬考試', '互動葡萄酒地圖', '讓知識記得牢的小遊戲', '智慧閃卡'),
 'pl': ('Egzaminy próbne na czas', 'Interaktywne mapy win', 'Gry, które pomagają zapamiętać', 'Inteligentne fiszki'),
 'ar': ('امتحانات تجريبية بتوقيت حقيقي', 'خرائط نبيذ تفاعلية', 'ألعاب تثبّت المعلومة', 'بطاقات تعليمية ذكية'),
 'ru': ('Пробные экзамены на время', 'Интерактивные винные карты', 'Игры, которые помогают запомнить', 'Умные карточки'),
}
MORE['es-ar'] = MORE['es']


def render(c, img):
    T = MORE.get(c, MORE['en'])
    cells = ''.join(f'<i class="{"r" if k in (7, 19, 31, 44) else "g"}" style="--i:{k}"></i>' for k in range(50))
    m = (f'<div class="fv fm" aria-hidden="true"><div class="mtop"><b class="clock">⏱ <span class="mt">1:30:00</span></b>'
         f'<b class="xq"><span class="mn">0</span>/50</b></div><div class="mgrid">{cells}</div>'
         f'<div class="mres">🏅 <b>Merit</b> <span>92%</span></div>'
         f'<img class="fgo" src="{img}/goats/ig-n29.webp" alt="" width="323" height="380" loading="lazy"></div>')
    pins = ''.join(f'<div class="pin" style="--x:{x}%;--y:{y}%;--i:{i}"><span>📍</span><em>{n}</em></div>'
                   for i, (x, y, n) in enumerate(((22, 58, 'Bordeaux'), (56, 34, 'Champagne'), (62, 56, 'Bourgogne'), (40, 80, 'Rioja'), (80, 30, 'Mosel'))))
    mp = ('<div class="fv fmap" aria-hidden="true"><svg class="land" viewBox="0 0 400 270" preserveAspectRatio="none">'
          '<path d="M20 40 C90 10 170 30 230 18 S350 10 390 50 L380 150 C350 190 300 200 250 230 S120 262 60 240 C30 200 10 140 20 40Z" fill="#e8dcc0"/>'
          '<path d="M70 70 C120 60 160 90 200 80 S280 60 330 90" fill="none" stroke="#a9c8d8" stroke-width="5" stroke-linecap="round"/>'
          '<path d="M90 180 C140 150 190 170 230 150" fill="none" stroke="#a9c8d8" stroke-width="4" stroke-linecap="round"/>'
          '<g fill="#c7d39c" opacity=".8"><ellipse cx="95" cy="150" rx="40" ry="22"/><ellipse cx="250" cy="150" rx="46" ry="26"/><ellipse cx="225" cy="85" rx="34" ry="18"/><ellipse cx="320" cy="80" rx="30" ry="16"/></g>'
          '<path class="route" d="M88 157 L224 92 L248 151 L160 216 L320 81" fill="none" stroke="#8c1d40" stroke-width="2.5" stroke-dasharray="7 7" vector-effect="non-scaling-stroke"/>'
          f'</svg>{pins}<img class="fgo" src="{img}/goats/ig-n23.webp" alt="" width="267" height="380" loading="lazy"></div>')
    faces = ['🍇', '🍷', '🧀', '🍇', '🍾', '🍷', '🧀', '🍾']
    mem = ''.join(f'<div class="mc"><div class="mci" style="--i:{k}"><span class="mb">?</span><span class="mf">{f}</span></div></div>' for k, f in enumerate(faces))
    g = (f'<div class="fv fg" aria-hidden="true"><div class="gtop"><b class="streak">🔥 <span class="sk">6</span></b><b class="xp">+<span class="xpn">0</span> XP</b></div>'
         f'<div class="mem">{mem}</div><div class="pop">+10</div>'
         f'<img class="fgo" src="{img}/goats/ig-n10.webp" alt="" width="263" height="380" loading="lazy"></div>')
    fl = ('<div class="fv ff" aria-hidden="true"><div class="deck"><div class="fc0"></div><div class="fc1"></div>'
          '<div class="fcard2"><div class="fci"><div class="ffront"><span>🍇</span><b>Nebbiolo</b></div>'
          '<div class="fback"><p></p><p></p><p></p><div class="fchips"><span>🍒</span><span>🌹</span><span>🌿</span><span>⚡</span></div></div></div><b class="fok">✓</b></div></div>'
          f'<img class="fgo" src="{img}/goats/ig-n16.webp" alt="" width="330" height="372" loading="lazy"></div>')
    out = ''.join(f'<article class="fcard">{v}<h3><span>{ic}</span>{e(t)}</h3></article>'
                  for v, t, ic in zip((m, mp, g, fl), T, ('⏱️', '🗺️', '🎮', '🃏')))
    return f'<div class="fgrid4 fmore">{out}</div>'


CSS = r"""
.fmore{margin-top:22px}
.fm{padding:18px}
.fm .mtop{display:flex;gap:10px;align-items:center}
.fm .mtop b{white-space:nowrap;padding:6px 12px;border-radius:12px;background:#3e0f22;color:#fff;font-size:14px;font-variant-numeric:tabular-nums}
.fm .mtop .xq{background:#fff;color:#3e0f22;box-shadow:inset 0 0 0 1.5px #ead8dc}
.fm .mgrid{display:grid;grid-template-columns:repeat(10,20px);gap:6px;margin:18px 0 0}
.fm .mgrid i{width:20px;height:20px;border-radius:5px;background:#fff;box-shadow:inset 0 0 0 1.5px #ead8dc;animation:fxcell 9s calc(.3s + var(--i)*.1s) infinite}
.fm .mgrid i.r{animation-name:fxcellr}
@keyframes fxcell{0%{background:#fff}2%,88%{background:#2f8a4e;box-shadow:none}96%,100%{background:#fff}}
@keyframes fxcellr{0%{background:#fff}2%,88%{background:#c0392b;box-shadow:none}96%,100%{background:#fff}}
.fm .mres{position:absolute;left:18px;bottom:18px;padding:9px 16px;border-radius:16px;background:linear-gradient(180deg,#f3d48a,#d4a23a);color:#3e0f22;font-weight:800;font-size:16px;box-shadow:0 10px 20px -10px rgba(168,123,34,.8);transform:scale(0);animation:fxres 9s infinite}
.fm .mres span{margin-left:6px;opacity:.75}
@keyframes fxres{0%,64%{transform:scale(0)}69%{transform:scale(1.15)}72%,90%{transform:scale(1)}96%,100%{transform:scale(0)}}
.fmap{background:linear-gradient(160deg,#eaf3f6,#dbeaf0)}
.fmap .land{position:absolute;inset:0;width:100%;height:100%}
.fmap .route{opacity:0;animation:fxroute 9s infinite}
@keyframes fxroute{0%,38%{opacity:0}48%,88%{opacity:.9}96%,100%{opacity:0}}
.fmap .pin{position:absolute;left:var(--x);top:var(--y);transform:translate(-50%,-100%)}
.fmap .pin span{display:block;font-size:24px;text-align:center;opacity:0;animation:fxpin 9s calc(var(--i)*.55s) infinite}
.fmap .pin em{position:absolute;left:50%;top:100%;transform:translateX(-50%);margin-top:2px;padding:2px 8px;border-radius:8px;background:#fff;color:#3e0f22;font:700 11.5px/1.3 inherit;font-style:normal;white-space:nowrap;box-shadow:0 6px 12px -8px rgba(0,0,0,.4);opacity:0;animation:fxlab 9s calc(var(--i)*.55s) infinite}
@keyframes fxpin{0%{opacity:0;transform:translateY(-40px)}5%{opacity:1;transform:translateY(0)}7%{transform:translateY(-6px)}9%,88%{opacity:1;transform:none}95%,100%{opacity:0}}
@keyframes fxlab{0%,6%{opacity:0}10%,88%{opacity:1}95%,100%{opacity:0}}
.fmap .fgo{width:78px}
.fg{padding:18px;background:linear-gradient(160deg,#fff4e6,#fbe6d4)}
.fg .gtop{display:flex;gap:10px}
.fg .gtop b{padding:6px 12px;border-radius:12px;background:#fff;color:#3e0f22;box-shadow:inset 0 0 0 1.5px #ead8dc;font-size:14px}
.fg .gtop .xp{background:#2f8a4e;color:#fff;box-shadow:none}
.fg .mem{display:grid;grid-template-columns:repeat(4,58px);gap:10px;margin:18px 0 0;perspective:600px}
.fg .mc{width:58px;height:64px}
.fg .mci{position:relative;width:100%;height:100%;transform-style:preserve-3d;animation:fxflip 9s calc(.4s + var(--i)*.45s) infinite}
.fg .mci span{position:absolute;inset:0;display:grid;place-items:center;border-radius:10px;backface-visibility:hidden;-webkit-backface-visibility:hidden;font-size:22px}
.fg .mb{background:linear-gradient(160deg,#a3264f,#7a1838);color:#f3d48a;font-weight:900}
.fg .mf{background:#fff;transform:rotateY(180deg);box-shadow:inset 0 0 0 2px #2f8a4e}
@keyframes fxflip{0%{transform:none}5%,86%{transform:rotateY(180deg)}94%,100%{transform:none}}
.fg .pop{position:absolute;left:38%;top:44%;font:900 28px/1 inherit;color:#2f8a4e;opacity:0;animation:fxpop 9s infinite}
@keyframes fxpop{0%,22%{opacity:0;transform:translateY(0)}25%{opacity:1}36%{opacity:0;transform:translateY(-40px)}50%{opacity:0;transform:translateY(0)}53%{opacity:1}64%,100%{opacity:0;transform:translateY(-40px)}}
.ff{background:linear-gradient(160deg,#f1edf7,#e6e0f0)}
.ff .deck{position:absolute;left:28px;top:30px;width:56%;height:196px}
.ff .fc0,.ff .fc1{position:absolute;inset:0;border-radius:18px;background:#fff;box-shadow:0 10px 20px -14px rgba(62,15,34,.5)}
.ff .fc0{transform:translate(14px,12px) rotate(4deg);opacity:.6}.ff .fc1{transform:translate(7px,6px) rotate(2deg);opacity:.85}
.ff .fcard2{position:absolute;inset:0;perspective:800px;animation:fxswipe 9s infinite}
.ff .fci{position:relative;width:100%;height:100%;transform-style:preserve-3d;animation:fxcflip 9s infinite}
.ff .ffront,.ff .fback{position:absolute;inset:0;border-radius:18px;backface-visibility:hidden;-webkit-backface-visibility:hidden;background:#fff;box-shadow:0 14px 26px -16px rgba(62,15,34,.55)}
.ff .ffront{display:grid;place-items:center;align-content:center;gap:6px}.ff .ffront span{font-size:40px}.ff .ffront b{font:800 24px/1 Fraunces,Georgia,serif;color:#3e0f22}
.ff .fback{transform:rotateY(180deg);padding:22px 18px}.ff .fback p{height:8px;border-radius:4px;background:#bba9b0;margin:0 0 12px;width:86%}.ff .fback p+p{width:66%}.ff .fback p+p+p{width:76%}
.ff .fchips{display:flex;gap:8px;margin-top:16px}.ff .fchips span{width:36px;height:36px;display:grid;place-items:center;border-radius:12px;background:#f6ecef;font-size:19px}
.ff .fok{position:absolute;right:-14px;top:-14px;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:#2f8a4e;color:#fff;font-size:22px;transform:scale(0);animation:fxok 9s infinite}
@keyframes fxcflip{0%,22%{transform:none}30%,100%{transform:rotateY(180deg)}}
@keyframes fxok{0%,58%{transform:scale(0)}62%{transform:scale(1.2)}65%,100%{transform:scale(1)}}
@keyframes fxswipe{0%,68%{transform:none;opacity:1}80%{transform:translateX(160%) rotate(18deg);opacity:0}81%{transform:translateY(20px);opacity:0}90%,100%{transform:none;opacity:1}}
@media (max-width:420px){.fm .mgrid{grid-template-columns:repeat(10,17px);gap:4px}.fm .mgrid i{width:17px;height:17px}.fg .mem{grid-template-columns:repeat(4,46px);gap:7px}.fg .mc{width:46px;height:52px}.fv .fgo{width:70px}.ff .deck{width:60%;height:180px}.fmap .pin em{font-size:10.5px;padding:2px 6px}}
@media (prefers-reduced-motion:reduce){.fm .mres{transform:none}.fmap .pin span,.fmap .pin em{opacity:1}.fmap .route{opacity:.9}.fg .mci{transform:rotateY(180deg)}.ff .fok{transform:none}}
"""

JS = r"""
(function(){
 var cards=[].slice.call(document.querySelectorAll('.fmore .fcard')); if(!cards.length) return;
 function cycle(card){
  var mt=card.querySelector('.mt'), mn=card.querySelector('.mn'), xp=card.querySelector('.xpn'), sk=card.querySelector('.sk');
  if(!mt&&!mn&&!xp&&!sk) return;
  (function run(){ var t0=Date.now(); var iv=setInterval(function(){ var t=(Date.now()-t0)/1000;
    if(mt){ var r=Math.max(0,5400-Math.floor(t*600)); if(t>8.6) r=5400; mt.textContent=Math.floor(r/3600)+':'+('0'+Math.floor(r%3600/60)).slice(-2)+':'+('0'+r%60).slice(-2); }
    if(mn){ mn.textContent=t>8.6?0:Math.min(50,Math.max(0,Math.floor((t-.3)/.1))); }
    if(xp){ xp.textContent=t>8.6?0:(t>4.8?20:(t>2.3?10:0)); }
    if(sk){ sk.textContent=(t>5&&t<8.6)?7:6; }
    if(t>=9){ clearInterval(iv); run(); } },120); })();
 }
 if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 if(!('IntersectionObserver' in window)){ cards.forEach(cycle); return; }
 var io=new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ io.unobserve(en.target); cycle(en.target); } }); },{threshold:.35});
 cards.forEach(function(c){ io.observe(c); });
})();
"""
