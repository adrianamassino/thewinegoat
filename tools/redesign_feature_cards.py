"""Redesign of the landing-page feature visuals: rich, static-first mockups (beautiful even with reduced motion),
language-neutral (names, numbers, icons), wine & gold palette. Applied to every landing page."""
import re, glob, sys

GOAT = lambda src: f'<img class="xg" src="{src}" alt="" loading="lazy">'

def fa(old, pre):
    q = re.search(r'<div class="pq">(.*?)</div>', old, flags=re.S)
    q = q.group(1) if q else ''
    lines = ''.join(f'<p class="xl{" xk" if k in (0,2,4) else ""}" style="--w:{w}%"><span></span>{"<b>+1</b>" if k in (0,2,4) else ""}</p>' for k, w in enumerate([94, 82, 90, 70, 86, 58]))
    return f'''<div class="xa">
 <div class="xsheet"><div class="xq">{q}</div>{lines}<i class="xpen"></i></div>
 <div class="xscore"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="27"/><circle class="xf" cx="32" cy="32" r="27" pathLength="100"/></svg><b>4<small>/5</small></b></div>
 {GOAT(pre+'img/goats/exam.webp')}</div>'''

def fb(old, pre):
    g = re.findall(r'<div class="goals"><span>(.*?)</span><span class="g2">(.*?)</span><span>(.*?)</span>', old)
    p_, m_, d_ = g[0] if g else ('Pass', 'Merit', 'Distinction')
    cells = []
    for d in range(28):
        cls = 'off' if d < 2 else ('done' if d < 16 and d % 7 != 6 else ('rest' if d % 7 == 6 and d < 16 else ('today' if d == 16 else ('exam' if d == 26 else ''))))
        inner = '🏆' if d == 26 else (str(d - 1) if d >= 2 else '')
        cells.append(f'<i class="{cls}">{inner}</i>')
    return f'''<div class="xb">
 <div class="xgoals"><span>{p_}</span><span class="on">{m_}</span><span>{d_}</span></div>
 <div class="xcal">{''.join(cells)}</div>
 <div class="xcount"><b>17</b><small>⏳</small></div>
 {GOAT(pre+'img/goats/free.webp')}</div>'''

def fc(old, pre):
    wave = ''.join(f'<i style="--h:{h}%"></i>' for h in [28,52,80,64,40,90,72,46,60,84,38,66,92,54,34,70,86,48,62,30,76,58,42,68])
    return f'''<div class="xc">
 <div class="xphone"><div class="xrec"><span></span>REC <b>12:48</b></div><div class="xwave">{wave}</div>
  <div class="xtr"><p style="--w:92%"></p><p style="--w:76%"></p><p style="--w:88%"></p><p style="--w:54%"></p></div></div>
 <div class="xpol"><div class="xpimg"><p></p><p></p><p></p><span class="xhl"></span></div></div>
 {GOAT(pre+'img/goats/guide.webp')}</div>'''

def fe(old, pre):
    rows = ''
    for k, (st, n) in enumerate([('ok', 3), ('mid', 2), ('ko', 1)]):
        dots = ''.join(f'<i class="{"on" if j < n else ""}"></i>' for j in range(3))
        icon = '✓' if st == 'ok' else ('↻' if st == 'mid' else '✗')
        rows += f'<div class="xr {st}"><span class="xi">{icon}</span><p style="--w:{[78,64,86][k]}%"></p><b>{dots}</b></div>'
    return f'''<div class="xe"><div class="xetop"><b>✓ 1/3</b><span>↻</span></div><div class="xrows">{rows}</div>{GOAT(pre+'img/goats/ig-n05.webp')}</div>'''

def fm(old, pre):
    res = re.search(r'<div class="mres"><b>(.*?)</b> <span>(.*?)</span></div>', old)
    rb, rp = res.groups() if res else ('Merit', '92%')
    red = {7, 19, 31, 44}
    cells = ''.join(f'<i class="{"r" if k in red else "g"}"></i>' for k in range(50))
    return f'''<div class="xm">
 <div class="xtimer"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="27"/><circle class="xf" cx="32" cy="32" r="27" pathLength="100"/></svg><b>38<small>min</small></b></div>
 <div class="xgrid">{cells}</div>
 <div class="xres"><span>🏅 {rb}</span><b>{rp}</b></div>
 {GOAT(pre+'img/goats/ig-n29.webp')}</div>'''

def fg(old, pre):
    names = re.findall(r'<span class="mf">(.*?)</span>', old) or ['Riesling','Rioja','Mosel','Nebbiolo','Tempranillo','Barolo','Pinot Noir','Bourgogne']
    # pairs: Riesling-Mosel, Nebbiolo-Barolo matched; Tempranillo-Rioja face up; others hidden
    state = {0: 'm a', 2: 'm a', 3: 'm b', 5: 'm b', 4: 'up', 1: 'up'}
    tiles = ''
    for k, n in enumerate(names[:8]):
        s = state.get(k, 'down')
        tiles += f'<div class="xt {s}">' + (f'<span>{n}</span>' if s != 'down' else '<span class="xback">🍇</span>') + ('<em>✓</em>' if s.startswith('m') else '') + '</div>'
    return f'''<div class="xgm"><div class="xgtop"><b>🔥 7</b><b class="xp">+20 XP</b></div><div class="xtiles">{tiles}</div>{GOAT(pre+'img/goats/ig-n10.webp')}</div>'''

def ff(old, pre):
    grape = '<svg viewBox="0 0 40 46" class="xgr"><g>' + ''.join(f'<circle cx="{x}" cy="{y}" r="4.4"/>' for x, y in [(12,12),(20,12),(28,12),(16,19),(24,19),(8,19),(32,19),(12,26),(20,26),(28,26),(16,33),(24,33),(20,40)]) + '</g><path d="M20 8V2M20 5c4-4 9-3 11 0" fill="none" stroke="#6b5a3e" stroke-width="1.6" stroke-linecap="round"/></svg>'
    meters = ''.join(f'<span><i style="--v:{v}%"></i></span>' for v in [92, 95, 70, 80])
    return f'''<div class="xf">
 <div class="xdeck"><div class="xcd c3"></div><div class="xcd c2"></div>
  <div class="xcd c1"><div class="xch">{grape}<div><b>Nebbiolo</b><small>Barolo · Barbaresco</small></div></div>
   <div class="xchips"><i style="--c:#c9a27a"></i><i style="--c:#b86b4b"></i><i style="--c:#8c3b2e"></i></div>
   <div class="xmeters">{meters}</div>
   <div class="xbtns"><span class="no">↻</span><span class="yes">✓</span></div></div></div>
 <div class="xstreak"><b>12</b><small>/20</small></div>
 {GOAT(pre+'img/goats/ig-n16.webp')}</div>'''

FNS = {'fa': fa, 'fb': fb, 'fc': fc, 'fe': fe, 'fm': fm, 'fg': fg, 'ff': ff}

CSS = r'''
/* ===== v3 feature visuals: rich static mockups ===== */
.fgrid4>*{min-width:0}.fv.x{min-width:0}.fv.x *{min-width:0;box-sizing:border-box}
.fv.x{background:radial-gradient(120% 90% at 100% 0%,#f9e9ec 0%,rgba(249,233,236,0) 55%),radial-gradient(90% 80% at 0% 100%,#f6ead6 0%,rgba(246,234,214,0) 60%),linear-gradient(180deg,#fffaf5,#f7efe6)!important;border-radius:18px;box-shadow:inset 0 0 0 1px #efe3d8}
.fv.x .xg{position:absolute;right:4px;bottom:-6px;width:76px;height:auto;filter:drop-shadow(0 8px 10px rgba(62,15,34,.22));z-index:3}
.fv.x b,.fv.x small{font-variant-numeric:tabular-nums}
/* open questions */
.xa .xsheet{position:absolute;left:16px;right:104px;top:16px;bottom:16px;padding:14px 14px 10px;border-radius:12px;background:#fff;box-shadow:0 18px 30px -18px rgba(62,15,34,.45),inset 0 0 0 1px #efe3dc;background-image:repeating-linear-gradient(180deg,transparent 0 23px,#f3e9e2 23px 24px);background-position:0 62px;overflow:hidden}
.xa .xq{font:700 12.5px/1.35 Fraunces,Georgia,serif;color:#3e0f22;margin-bottom:8px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.xa .xl{position:relative;display:flex;align-items:center;gap:6px;height:24px;margin:0}
.xa .xl span{height:6px;width:var(--w);border-radius:4px;background:#cfc2c6}
.xa .xl.xk span{background:linear-gradient(90deg,#d8ecd9,#b9dcbc);height:9px}
.xa .xl b{font:800 10px/1 inherit;color:#fff;background:#4f7a46;border-radius:6px;padding:3px 5px;flex:none}
.xa .xpen{position:absolute;left:30%;top:150px;width:64px;height:26px;border:2.5px solid #b3263f;border-radius:50%;transform:rotate(-12deg);opacity:.85}
.xscore{position:absolute;right:16px;top:20px;width:80px;height:80px;display:grid;place-items:center;border-radius:50%;background:#fff;box-shadow:0 14px 26px -16px rgba(62,15,34,.55)}
.xscore svg,.xtimer svg{position:absolute;inset:6px;transform:rotate(-90deg)}
.xscore circle,.xtimer circle{fill:none;stroke:#f1e4e6;stroke-width:6}
.xscore .xf{stroke:url(#none);stroke:#8c1d40;stroke-linecap:round;stroke-dasharray:80 100}
.xscore b{position:relative;font:800 24px/1 Fraunces,Georgia,serif;color:#3e0f22}.xscore small{font-size:12px;color:#8a7b80}
/* plan */
.xb{padding:16px}
.xb .xgoals{display:flex;gap:5px;margin-right:78px}.xb .xgoals span{flex:none;padding:5px 8px;border-radius:99px;font:700 11px/1 inherit;background:#fff;color:#6b5a60;box-shadow:inset 0 0 0 1px #eadfd3}
.xb .xgoals .on{background:linear-gradient(135deg,#a3264f,#6e1734);color:#fff;box-shadow:0 6px 12px -6px rgba(122,24,56,.7)}
.xb .xcal{display:grid;grid-template-columns:repeat(7,1fr);gap:5px;margin:16px 84px 0 0}
.xb .xcal i{aspect-ratio:1;border-radius:7px;display:grid;place-items:center;font:700 9.5px/1 inherit;font-style:normal;color:#9a8b90;background:#fff;box-shadow:inset 0 0 0 1px #efe4da}
.xb .xcal i.off{background:none;box-shadow:none}
.xb .xcal i.done{background:linear-gradient(160deg,#a3264f,#7a1838);color:#ffd9e2;box-shadow:none}
.xb .xcal i.rest{background:#f3ebe1;color:#bfb1a6}
.xb .xcal i.today{background:#fff;color:#7a1838;box-shadow:inset 0 0 0 2px #d4a23a;font-weight:900}
.xb .xcal i.exam{background:linear-gradient(160deg,#f3d48a,#d4a23a);font-size:12px;box-shadow:0 4px 10px -4px rgba(168,123,34,.8)}
.xb .xcount{position:absolute;right:12px;top:12px;width:62px;padding:8px 0;border-radius:16px;text-align:center;background:#3e0f22;color:#fff;box-shadow:0 12px 22px -12px rgba(62,15,34,.8)}
.xb .xcount b{display:block;font:800 28px/1 Fraunces,Georgia,serif;color:#f3d48a}.xb .xcount small{font-size:14px}
/* class recording */
.xc .xphone{position:absolute;left:16px;top:14px;bottom:14px;width:58%;padding:12px;border-radius:18px;background:linear-gradient(170deg,#4a1428,#2a0b18);box-shadow:0 18px 30px -16px rgba(42,11,24,.8),inset 0 0 0 1px rgba(255,255,255,.06)}
.xc .xrec{display:flex;align-items:center;gap:6px;font:800 11px/1 inherit;letter-spacing:.08em;color:#ffd0da}.xc .xrec span{width:9px;height:9px;border-radius:50%;background:#ff4d6a;box-shadow:0 0 0 4px rgba(255,77,106,.2)}.xc .xrec b{margin-left:auto;color:#fff;font-size:12px}
.xc .xwave{display:flex;align-items:center;gap:3px;height:54px;margin:10px 0}
.xc .xwave i{flex:1;height:var(--h);border-radius:3px;background:linear-gradient(180deg,#f3d48a,#d4a23a)}
.xc .xtr p{height:6px;width:var(--w);margin:0 0 9px;border-radius:4px;background:rgba(255,255,255,.28)}
.xc .xtr p:first-child{background:rgba(255,255,255,.55)}
.xc .xpol{position:absolute;right:30px;top:30px;width:31%;padding:8px 8px 24px;background:#fff;border-radius:4px;transform:rotate(6deg);box-shadow:0 16px 24px -14px rgba(62,15,34,.55)}
.xc .xpimg{position:relative;height:96px;border-radius:2px;padding:10px;background:linear-gradient(160deg,#fbf6e9,#f1e6cf)}
.xc .xpimg p{height:4px;margin:0 0 9px;border-radius:2px;background:#5a5a8c;opacity:.55;width:86%}.xc .xpimg p:nth-child(2){width:64%}
.xc .xhl{position:absolute;left:8px;top:28px;width:62%;height:9px;background:rgba(240,210,90,.6);border-radius:2px}
/* mistakes */
.xe{padding:16px}
.xe .xetop{display:flex;justify-content:space-between;margin-right:72px}.xe .xetop b{padding:6px 12px;border-radius:99px;background:#4f7a46;color:#fff;font-size:13px}.xe .xetop span{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:#fff;color:#8c1d40;font-weight:900;box-shadow:inset 0 0 0 1px #eadfd3}
.xe .xrows{display:grid;gap:8px;margin:12px 86px 0 0}
.xe .xr{display:grid;grid-template-columns:28px 1fr auto;gap:10px;align-items:center;padding:9px 12px;border-radius:12px;background:#fff;box-shadow:0 10px 18px -14px rgba(62,15,34,.5),inset 0 0 0 1px #efe3dc}
.xe .xi{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:900;font-size:14px}
.xe .ok .xi{background:#4f7a46}.xe .mid .xi{background:#d4a23a}.xe .ko .xi{background:#a3283f}
.xe .xr p{height:7px;width:var(--w);margin:0;border-radius:4px;background:#d8cbcf}
.xe .ok{box-shadow:0 10px 18px -14px rgba(62,15,34,.5),inset 0 0 0 1.5px #b9dcbc}.xe .ok p{background:#b9dcbc}
.xe .xr b{display:flex;gap:4px}.xe .xr b i{width:8px;height:8px;border-radius:50%;background:#eadfd3}
.xe .ok b i.on{background:#4f7a46}.xe .mid b i.on{background:#d4a23a}.xe .ko b i.on{background:#a3283f}
/* mock exams */
.xm{padding:16px}
.xm .xtimer{position:absolute;left:16px;top:16px;width:74px;height:74px;display:grid;place-items:center;border-radius:50%;background:#fff;box-shadow:0 14px 24px -16px rgba(62,15,34,.55)}
.xm .xtimer .xf{stroke:#d4a23a;stroke-linecap:round;stroke-dasharray:42 100}
.xm .xtimer b{position:relative;font:800 20px/1 Fraunces,Georgia,serif;color:#3e0f22;text-align:center}.xm .xtimer small{display:block;font:700 10px/1 inherit;color:#8a7b80;margin-top:2px}
.xm .xgrid{position:absolute;left:104px;right:18px;top:20px;display:grid;grid-template-columns:repeat(10,1fr);gap:5px}
.xm .xgrid i{aspect-ratio:1;border-radius:4px;background:linear-gradient(160deg,#7fa86f,#4f7a46)}.xm .xgrid i.r{background:linear-gradient(160deg,#d0566d,#a3283f)}
.xm .xres{position:absolute;left:16px;right:96px;bottom:18px;display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-radius:14px;background:linear-gradient(135deg,#3e0f22,#7a1838);color:#fff;box-shadow:0 14px 24px -14px rgba(62,15,34,.8)}
.xm .xres span{font-weight:800}.xm .xres b{font:800 26px/1 Fraunces,Georgia,serif;color:#f3d48a}
/* games */
.xgm{padding:16px}
.xgm .xgtop{display:flex;gap:8px;margin-right:72px}.xgm .xgtop b{padding:6px 11px;border-radius:99px;background:#fff;font-size:13px;color:#3e0f22;box-shadow:inset 0 0 0 1px #eadfd3}
.xgm .xgtop .xp{background:linear-gradient(180deg,#f3d48a,#d4a23a);color:#3e0f22;box-shadow:0 4px 0 #a87b22}
.xgm .xtiles{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:14px 0 0 0}
.xgm .xt{position:relative;height:62px;border-radius:12px;display:grid;place-items:center;padding:4px;text-align:center;font:800 11.5px/1.15 inherit;color:#3e0f22;background:#fff;overflow-wrap:break-word;box-shadow:0 4px 0 #e2d3c6,inset 0 0 0 1px #eadfd3}
.xgm .xt.down{background:linear-gradient(160deg,#a3264f,#6e1734);box-shadow:0 4px 0 #4a0f24}
.xgm .xt .xback{font-size:22px;filter:saturate(.6) brightness(1.4)}
.xgm .xt.up{box-shadow:0 4px 0 #d4a23a,inset 0 0 0 2px #d4a23a}
.xgm .xt.m{background:#eef6ec;box-shadow:0 4px 0 #b9dcbc,inset 0 0 0 2px #7fb07a;color:#2f5a2a}
.xgm .xt em{position:absolute;top:-6px;right:-6px;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;font:900 11px/1 inherit;font-style:normal;color:#fff;background:#4f7a46}
/* keep mockups compact on wide cards */
.xb .xcal{max-width:290px}.xe .xrows{max-width:420px}.xgm .xtiles{max-width:430px}.xm .xgrid{max-width:340px}.xa .xsheet{max-width:440px}.xc .xphone{max-width:330px}.xf .xdeck{max-width:300px}
/* goat of the games card sits by the score */
.xgm .xg{top:6px;bottom:auto;right:10px;width:54px!important}
/* flashcards */
.xf .xdeck{position:absolute;left:22px;top:18px;bottom:20px;width:58%}
.xf .xcd{position:absolute;inset:0;border-radius:18px;box-shadow:0 18px 30px -18px rgba(62,15,34,.6)}
.xf .c3{background:linear-gradient(160deg,#7fa86f,#4f7a46);transform:rotate(-9deg) translate(-6px,6px)}
.xf .c2{background:linear-gradient(160deg,#f3d48a,#d4a23a);transform:rotate(-4deg) translate(-2px,2px)}
.xf .c1{background:#fff;padding:14px;display:flex;flex-direction:column;gap:10px;transform:rotate(2deg);box-shadow:0 22px 34px -18px rgba(62,15,34,.6),inset 0 0 0 1px #efe3dc}
.xf .xch{display:flex;gap:10px;align-items:center}.xf .xgr{width:34px;height:40px;flex:none}.xf .xgr g{fill:#5b2a6e}
.xf .xch b{display:block;font:800 19px/1.1 Fraunces,Georgia,serif;color:#3e0f22}.xf .xch small{font-size:11px;color:#8a7b80;font-weight:600}
.xf .xchips{display:flex;gap:5px}.xf .xchips i{width:22px;height:10px;border-radius:5px;background:var(--c)}
.xf .xmeters{display:grid;gap:6px}.xf .xmeters span{height:6px;border-radius:4px;background:#f1e7e9;overflow:hidden}.xf .xmeters i{display:block;height:100%;width:var(--v);border-radius:4px;background:linear-gradient(90deg,#a3264f,#d04a71)}
.xf .xbtns{display:flex;gap:8px;margin-top:auto}.xf .xbtns span{flex:1;height:28px;border-radius:10px;display:grid;place-items:center;font-weight:900;color:#fff}
.xf .xbtns .no{background:#e8dfd6;color:#7a6a70}.xf .xbtns .yes{background:#4f7a46}
.xf .xstreak{position:absolute;right:14px;top:18px;padding:10px 12px;border-radius:14px;text-align:center;background:#3e0f22;color:#fff}.xf .xstreak b{font:800 22px/1 Fraunces,Georgia,serif;color:#f3d48a}.xf .xstreak small{font-size:11px;color:#f0cfd9}
@media (max-width:420px){.fv.x .xg{width:64px}.xa .xsheet{right:92px}.xscore{width:68px;height:68px}.xb .xcal{margin-right:74px;gap:4px}.xb .xgoals span{font-size:10px;padding:5px 7px}.xgm .xtiles{gap:6px}.xgm .xt{height:54px;font-size:10px}.xm .xgrid{left:98px;right:14px}.xe .xrows{margin-right:74px}.xf .xdeck{width:62%}}
@media (prefers-reduced-motion:no-preference){
 .fv.x .xg{animation:xsway 4.5s ease-in-out infinite;transform-origin:50% 100%}
 .xc .xwave i{animation:xwv 1.3s ease-in-out infinite;animation-delay:calc(var(--h)*-.02s)}
 .xc .xrec span{animation:xblink 1.2s steps(2) infinite}
 .xf .c1{animation:xfloat 5s ease-in-out infinite}
 .xb .xcal i.today{animation:xpulse 1.8s ease-in-out infinite}
 .xgm .xt.up{animation:xflip 3.6s ease-in-out infinite}
}
@keyframes xsway{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}
@keyframes xwv{0%,100%{transform:scaleY(.55)}50%{transform:scaleY(1)}}
@keyframes xblink{50%{opacity:.3}}
@keyframes xfloat{0%,100%{transform:rotate(2deg) translateY(0)}50%{transform:rotate(1deg) translateY(-5px)}}
@keyframes xpulse{0%,100%{box-shadow:inset 0 0 0 2px #d4a23a}50%{box-shadow:inset 0 0 0 2px #d4a23a,0 0 0 5px rgba(212,162,58,.25)}}
@keyframes xflip{0%,40%,100%{transform:none}50%{transform:rotateY(180deg) scale(.96)}60%{transform:none}}
'''

def process(path):
    s = open(path, encoding='utf8').read()
    i = s.find('class="fgrid4')
    if i < 0: return False
    pre = re.search(r'src="([^"]*)img/goats/', s[i:]).group(1)
    n = 0
    def rep(m):
        nonlocal n
        cls, inner = m.group(1), m.group(2)
        key = cls.split()[0]
        if key not in FNS: return m.group(0)
        n += 1
        return f'<div class="fv {cls} x" aria-hidden="true">' + FNS[key](inner, pre) + '</div><h3>'
    s2 = re.sub(r'<div class="fv ((?:fa|fb|fc|fe|fm|fg|ff))" aria-hidden="true">(.*?)</div>\s*<h3>', rep, s, flags=re.S)
    # css once, at the end of the last style block in <head>
    if '/* ===== v3 feature visuals' not in s2:
        j = s2.find('</style>', s2.find('.fgrid4{'))
        s2 = s2[:j] + CSS + s2[j:]
    open(path, 'w', encoding='utf8').write(s2)
    return n

if __name__ == '__main__':
    for f in sys.argv[1:]:
        print(f, process(f))
