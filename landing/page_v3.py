# -*- coding: utf-8 -*-
"""Home page v3 — fewer sections, the key value, an open question marked on the spot, warm and trustworthy look.
Keeps the <head> of v2 (meta, hreflang, JSON-LD) and replaces the body."""
import json, html, os, datetime, re
import page_v2
from page_v2 import money, CUR, DEFCUR, TRIAL_BDX
from home_text import H
from goat_walk import goat_svg, GOAT_CSS
HERE = os.path.dirname(os.path.abspath(__file__))
LANE_CSS = """
/* hero: one small goat beside the phone */
.gside{position:absolute;right:-12px;bottom:4%;width:108px;height:auto;z-index:3;filter:drop-shadow(0 12px 14px rgba(62,15,34,.22))}
/* hero: the walking goat has its own strip at the foot of the text column */
.glane{position:relative;height:104px;margin:30px 0 0;overflow-x:clip;overflow-y:visible;pointer-events:none}
.glane .gw{width:136px}
.gw .gbub{position:absolute;left:88%;bottom:64%;margin:0;width:max-content;max-width:220px;padding:9px 14px;border-radius:18px 18px 18px 4px;background:#fff;color:var(--plum,#3e0f22);font-weight:700;font-size:14px;line-height:1.3;
 box-shadow:0 12px 26px -12px rgba(62,15,34,.45),inset 0 0 0 1.5px #f0d9df;transform-origin:0 100%;opacity:0;transform:scale(.5) translateY(8px);transition:opacity .25s,transform .35s cubic-bezier(.2,.9,.3,1.3)}
.gw.talking .gbub{opacity:1;transform:none}
/* static goats: each one sits on something */
.g3.gtry{width:132px;right:auto;left:calc(50% + 400px);top:auto;bottom:60px}
.panel3wrap{position:relative;max-width:780px;margin:0 auto}
.cmpwrap{position:relative;max-width:820px;margin:0 auto}
.g3.gcmp{width:104px;right:6px;top:-92px;z-index:2}
.pwrap{position:relative}.pwrap>.pc{height:100%}
.rtl .g3.gprize{right:auto;left:18px}
.g3.gprize{width:92px;right:18px;top:-104px;z-index:2}
.g3.gfaq2{width:140px;left:calc(100% + 22px);top:110px}
.why{position:relative}.g3.gwc{width:74px;right:16px;top:12px}
.whys .why:nth-child(odd) .gwc{transform-origin:50% 100%}
.g3.gfree{width:112px;left:18px;top:-90px;z-index:2}
.g3.gtry2{width:118px;left:auto;right:calc(50% + 400px);bottom:40px}
.g3.gfaq3{width:110px;right:calc(100% + 30px);top:330px}
.fin3{position:relative}.g3.gquick{width:116px;left:58%;top:auto;bottom:34px}
.glane.gl2{margin:44px auto 0;max-width:820px}.glane.gl3{margin:40px 0 0}.glane.gl4{margin:18px 0 -40px;height:96px}
.glane .gw.kid{width:96px}.glane .gw.back .tgoat{transform:scaleX(-1)}
.tgoat .head{transform-box:view-box}
.gw.graze .tgoat .head{animation:ggraze 2.2s ease-in-out 1}
.gw.graze .tgoat .mouth.open{animation:gtalk .35s steps(1) 3 .5s}
@keyframes ggraze{0%,100%{transform:rotate(0)}25%,80%{transform:rotate(24deg) translateY(6px)}}
.gw.nod .tgoat .head{animation:gnod .6s ease-in-out 3}
@media (max-width:1300px){.g3.gtry,.g3.gtry2{display:none}}
@media (max-width:1140px){.g3.gfaq3{display:none}}
@media (max-width:1020px){.g3.gquick{display:none}}
@media (max-width:1140px){.g3.gfaq2{display:none}}
@media (max-width:640px){.gside{width:66px;right:-10px;bottom:2%}.glane{height:86px;margin-top:22px}.glane .gw{width:112px}.gw .gbub{max-width:170px;font-size:13px;left:84%}
 .g3.gcmp{display:none}.pgrid{gap:84px;margin-top:80px}.g3.gprize{width:66px;top:-80px}.g3.gfree{width:76px;top:-64px}.g3.gwc{width:56px;right:12px;top:10px}
 .glane.gl4{height:80px}.glane .gw.kid{width:80px}}
"""
LANE_JS = """
(function(){
 var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 var says=[]; try{ says=JSON.parse(document.getElementById('home-data').textContent).says||[]; }catch(e){}
 function wait(ms){ return new Promise(function(r){ setTimeout(r,ms); }); }
 function at(gw,x,ms){ gw.style.transition='transform '+ms+'ms linear'; gw.style.transform='translateX('+x+'px)'; }
 var si=0;
 function lane(st){
  var gws=[].slice.call(st.querySelectorAll('.gw')), rtl=st.getAttribute('data-dir')==='rtl', stopF=+(st.getAttribute('data-stop')||.25), SP=+(st.getAttribute('data-speed')||85);
  var bub=st.querySelector('.gbub');
  gws.forEach(function(gw){ if(rtl) gw.classList.add('back'); });
  if(RM){ gws.forEach(function(gw,k){ var w=st.clientWidth; gw.style.transform='translateX('+Math.round(w*stopF-gw.offsetWidth*(k+.5))+'px)'; }); if(bub&&says[0]){ bub.textContent=says[0]; gws[0].classList.add('talking'); } return; }
  async function one(gw,k){
   if(k) await wait(1100*k);
   for(;;){
    var w=st.clientWidth, g=gw.offsetWidth, lead=gws[0].offsetWidth;
    var stop=Math.round(w*stopF - g/2 - (k? (rtl?-1:1)*(lead*.9):0));
    if(bub){ stop=Math.max(0,Math.min(Math.round(w*stopF),w-g-bub.offsetWidth-4)); }
    var x0=rtl? w+10 : -g-10, x2=rtl? -g-20 : w+20;
    gw.style.transition='none'; gw.style.transform='translateX('+x0+'px)'; await wait(60);
    gw.classList.add('walk'); var t=Math.round(Math.abs(stop-x0)/SP*1000); at(gw,stop,t); await wait(t); gw.classList.remove('walk');
    await wait(300);
    if(bub&&!k&&says.length){ bub.textContent=says[si++%says.length]; gw.classList.add('talking'); await wait(2800); gw.classList.remove('talking'); await wait(300); gw.classList.add('jump'); await wait(800); gw.classList.remove('jump'); }
    else { var act=k?'nod':(Math.random()<.5?'graze':'jump'); gw.classList.add(act); await wait(act==='graze'?2200:act==='nod'?1800:800); gw.classList.remove(act); await wait(500); if(!k&&act==='graze'){ gw.classList.add('jump'); await wait(800); gw.classList.remove('jump'); } }
    await wait(k?600:400);
    gw.classList.add('walk'); t=Math.round(Math.abs(x2-stop)/SP*1000); at(gw,x2,t); await wait(t); gw.classList.remove('walk');
    await wait(k?3000+1100:4000+Math.random()*3000);
   }
  }
  gws.forEach(function(gw,k){ gw.style.transform='translateX('+(rtl? st.clientWidth+10 : -gw.offsetWidth-10)+'px)'; one(gw,k); });
 }
 var L=[].slice.call(document.querySelectorAll('.glane'));
 if('IntersectionObserver' in window){ var io=new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ io.unobserve(en.target); lane(en.target); } }); },{rootMargin:'0px 0px -10% 0px'}); L.forEach(function(x){ io.observe(x); }); }
 else L.forEach(lane);
})();
"""

e = lambda s: html.escape(str(s), quote=True)

def render_body(c, t, h, oq, data, APP, langs, ids, SH, price, CSS, JS, GOAT, notice='', home='./', img='../img', lang_label=None):
    nav = ''.join(f'<li><a href="{u}">{e(n)}</a></li>' for u, n in h['nav'])
    stats = ''.join(f'<div class="st"><b>{e(a)}</b><span>{e(b)}</span></div>' for a, b in h['stats'])
    trust = ''.join(f'<li>{e(x)}</li>' for x in h['trust'])
    WG = ['exam', 'free', 'mosaic', 'guide']
    why = ''.join(f'<article class="why"><img class="g3 gwc {"sway" if i % 2 else "sway2"}" src="{img}/goats/{WG[i % 4]}.webp" alt="" width="200" height="220" loading="lazy"><span class="wi">{ic}</span><h3>{e(a)}</h3><p>{e(b)}</p></article>' for i, (ic, a, b) in enumerate(h['why']))
    cmp = ('<table class="cmp3"><thead><tr>' + ''.join(f'<th scope="col"{" class=us" if i == 1 else ""}>{e(x)}</th>' for i, x in enumerate(h['cmp_cols'])) + '</tr></thead><tbody>'
           + ''.join(f'<tr><th scope="row">{e(a)}</th><td class="us">{e(b)}</td><td>{e(d)}</td></tr>' for a, b, d in h['cmp']) + '</tbody></table>')
    steps = ''.join(f'<li><span class="sn3">{i + 1}</span><div><h3>{e(a)}</h3><p>{e(b)}</p></div></li>' for i, (a, b) in enumerate(h['steps']))
    free = ''.join(f'<li>{e(x)}</li>' for x in h['free_l']); full = ''.join(f'<li>{e(x)}</li>' for x in h['full_l'])
    faq = ''.join(f'<details class="fq"><summary>{e(q)}</summary><p>{e(a)}</p></details>' for q, a in t['faq']['items'][:7])
    year = datetime.date.today().year
    c_label = lang_label or c.upper()
    return f'''<style>{CSS}</style>
</head>
<body class="h3">
<a class="skip" href="#main">{e(t['skip'])}</a>
<header class="top3"><div class="w bar3">
 <a class="brand3" href="{home}"><img class="emb" src="{img}/logo-emblem.webp" alt="" width="360" height="384"><img class="wm" src="{img}/wordmark.webp" alt="The Wine Goat" width="752" height="294"></a>
 <ul class="nav3">{nav}</ul>
 <div class="acts3"><details class="lg3"><summary>{c_label}</summary><ul>{langs}</ul></details><a class="lnk3" href="{APP}">{e(h['login'])}</a><a class="b3 b3p sm" href="{APP}#go=start">{e(h['start'])}</a></div>
</div></header>
<main id="main">{notice}
<section class="hero3"><div class="w hgrid">
 <div class="htx">
  <p class="kick3">{e(h['kick'])}</p>
  <h1>{e(h['h1'])}</h1>
  <p class="sub3">{e(h['sub'])}</p>
  <div class="ctas3"><a class="b3 b3p" href="{APP}#go=start">{e(h['cta1'])}</a><a class="b3 b3g" href="#{ids[0]}">{e(h['cta2'])}</a></div>
  <ul class="trust3">{trust}</ul>
  <div class="glane" aria-hidden="true"><div class="gw" id="gw"><p class="gbub"></p>{goat_svg()}</div></div>
 </div>
 <div class="hvis" aria-hidden="true">
  <div class="glow"></div>
  <div class="phone3"><img src="{img}/shots/home-{SH}.webp" alt="" width="540" height="1080"></div>
  <img class="gside sway2" src="{img}/goats/hero.webp" alt="" width="745" height="848">
 </div>
</div>
<div class="w stats3">{stats}</div></section>

<section id="{ids[0]}" class="sec3 try3"><div class="w">
 <h2>{e(h['try_h'])}</h2><p class="lead3">{e(h['try_p'])}</p>
 <div class="tabs3" role="tablist"><button role="tab" aria-selected="true" data-t3="open">{e(h['tab_open'])}</button><button role="tab" aria-selected="false" data-t3="mcq">{e(h['tab_mcq'])}</button></div>
 <div class="panel3wrap"><img class="g3 gtry2 sway" src="{img}/goats/mods.webp" alt="" width="351" height="452" loading="lazy"><img class="g3 gtry sway2" src="{img}/goats/explore.webp" alt="" width="421" height="478" loading="lazy">
 <div class="panel3" id="p-open">
  <p class="octx">{e(h['o_ctx'].replace('{m}', str(oq['m'])))}</p>
  <h3 class="oq3">{e(oq['t'])}</h3>
  <textarea id="oans" rows="6" placeholder="{e(h['o_ph'])}"></textarea>
  <button type="button" class="b3 b3p" id="ogo">{e(h['o_btn'])}</button>
  <div id="ores" aria-live="polite"></div>
  <p class="onote">{e(h['o_model'])}</p>
 </div>
 <div class="panel3" id="p-mcq" hidden><div id="mcq3" aria-live="polite"></div></div></div>
</div></section>

<section id="{ids[1]}" class="sec3 why3"><div class="w">
 <h2>{e(h['why_h'])}</h2>
 <div class="whys">{why}</div>
 <h3 class="cmph">{e(h['cmp_h'])}</h3><div class="cmpwrap"><img class="g3 gcmp sway2" src="{img}/goats/books.webp" alt="" width="326" height="300" loading="lazy">{cmp}</div>
 <div class="glane gl2" aria-hidden="true" data-dir="rtl" data-stop=".35" data-speed="70"><div class="gw">{goat_svg()}</div></div>
</div></section>

<section class="sec3 steps3"><div class="w s3grid">
 <img class="g3 gst sway2" src="{img}/goats/method.webp" alt="" width="300" height="300" loading="lazy">
 <div><h2>{e(h['steps_h'])}</h2><ol class="stl">{steps}</ol></div>
</div></section>

<section id="{ids[2]}" class="sec3 price3"><div class="w">
 <h2>{e(h['price_h'])}</h2>
 <div class="pgrid">
  <div class="pwrap"><img class="g3 gfree sway2" src="{img}/goats/feat.webp" alt="" width="429" height="401" loading="lazy"><article class="pc"><h3>{e(h['free_t'])}</h3><p class="pp">0 €</p><ul>{free}</ul><a class="b3 b3g" href="{APP}#go=start">{e(h['free_b'])}</a></article></div>
  <div class="pwrap"><img class="g3 gprize sway" src="{img}/goats/trophy.webp" alt="" width="236" height="300" loading="lazy"><article class="pc pro"><span class="rib">★</span><h3>{e(h['full_t'])}</h3><p class="pp">{price} <small>{e(h['full_note'])}</small></p><ul>{full}</ul><a class="b3 b3gold" href="{APP}#go=buy">{e(h["full_b"])}</a></article></div>
 </div>
</div></section>

<section id="faq" class="sec3 faq3"><div class="w nar"><h2>{e(h['faq_h'])}</h2><div class="cmpwrap" style="max-width:none"><img class="g3 gfaq3 sway" src="{img}/goats/levels.webp" alt="" width="372" height="501" loading="lazy"><img class="g3 gfaq2 sway2" src="{img}/goats/scoot.webp" alt="" width="262" height="320" loading="lazy">{faq}</div><div class="glane gl3" aria-hidden="true" data-stop=".55" data-speed="60"><div class="gw">{goat_svg()}</div><div class="gw kid">{goat_svg()}</div></div></div></section>

<section class="sec3 fin3"><img class="g3 gquick sway" src="{img}/goats/quick.webp" alt="" width="385" height="489" loading="lazy"><div class="w fgrid">
 <div><h2>{e(h['final_h'])}</h2><p>{e(h['final_p'])}</p><a class="b3 b3gold" href="{APP}#go=start">{e(h['final_b'])}</a></div>
 <img class="g3 gfin sway" src="{img}/goats/final.webp" alt="" width="300" height="300" loading="lazy">
</div><div class="w"><div class="glane gl4" aria-hidden="true" data-dir="rtl" data-stop=".6" data-speed="90"><div class="gw">{goat_svg()}</div></div></div></section>
</main>
<footer class="foot3"><div class="w">
 <a class="brand3" href="{home}"><img class="emb" src="{img}/logo-emblem.webp" alt="" width="360" height="384" loading="lazy"><img class="wm" src="{img}/wordmark-light.webp" alt="The Wine Goat" width="752" height="294" loading="lazy"></a>
 <p class="fd3">{e(t['foot']['disc'])}</p>
 <p class="fc3">© {year} The Wine Goat · <a href="https://www.instagram.com/the.winegoat/" rel="noopener">Instagram</a></p>
</div></footer>
<script type="application/json" id="home-data">{json.dumps(data, ensure_ascii=False).replace("</", "<\\/")}</script>
<style>{GOAT_CSS}{LANE_CSS}</style>
<script>{JS}</script>
<script>{LANE_JS}</script>
</body>
</html>'''

def build(ctx):
    v2page, jsonld = page_v2.build(ctx)
    L, APP = ctx['L'], ctx['APP']; LI = {'it': 0, 'fr': 1, 'en': 2, 'es': 2}
    byid = {x['id']: x for x in ctx['bdx']}
    CSS = open(os.path.join(HERE, 'home.css'), encoding='utf-8').read() 
    JS = open(os.path.join(HERE, 'home.js'), encoding='utf-8').read() 
    GOAT = ''
    OPENX = ctx['open']

    def page(c):
        t = L[c]; h = H[c]; li = LI[c]
        v2 = v2page(c)
        head = v2[:v2.index('</head>')]
        head = re.sub(r'<style>.*?</style>', '', head, count=1, flags=re.S)
        head = head.replace('<link rel="preload" href="../fonts/fraunces-800.woff2"', '<link rel="preload" href="../fonts/fraunces-800.woff2"')
        # data for the page script
        QX = t.get('qes')
        if QX: mcq = [dict(QX[i], id=i) for i in TRIAL_BDX]
        else: mcq = [{'id': i, 'q': byid[i]['q'][li], 'o': [o[li] for o in byid[i]['o']], 'e': byid[i]['e'][li]} for i in TRIAL_BDX]
        if c == 'es' and t.get('open_es'): oq = {'t': t['open_es']['t'], 'k': t['open_es']['k'], 'm': 5}
        else:
            x = OPENX; oq = {'t': x['t'][li], 'k': x['k'][li], 'm': x['m']}
        data = {'mcq': mcq, 'open': oq, 'tx': {k: h[k] for k in ('o_res', 'o_hit', 'o_miss', 'o_again', 'o_short', 'm_ok', 'm_ko', 'm_next', 'm_score', 'm_after')},
                'says': h['says'], 'cur': {'list': CUR, 'def': DEFCUR.get(c, 'EUR'), 'lang': c}, 'app': APP}
        langs = ''.join(f'<li><a href="../{x}/" hreflang="{x}" lang="{x}" data-lang="{x}"{" aria-current=\"true\"" if x == c else ""}>{e(L[x]["name"])}</a></li>' for x in ('en', 'it', 'fr', 'es'))
        stats = ''.join(f'<div class="st"><b>{e(a)}</b><span>{e(b)}</span></div>' for a, b in h['stats'])
        trust = ''.join(f'<li>{e(x)}</li>' for x in h['trust'])
        why = ''.join(f'<article class="why"><span class="wi">{ic}</span><h3>{e(a)}</h3><p>{e(b)}</p></article>' for ic, a, b in h['why'])
        cmp = ('<table class="cmp3"><thead><tr>' + ''.join(f'<th scope="col"{" class=us" if i == 1 else ""}>{e(x)}</th>' for i, x in enumerate(h['cmp_cols'])) + '</tr></thead><tbody>'
               + ''.join(f'<tr><th scope="row">{e(a)}</th><td class="us">{e(b)}</td><td>{e(d)}</td></tr>' for a, b, d in h['cmp']) + '</tbody></table>')
        steps = ''.join(f'<li><span class="sn3">{i + 1}</span><div><h3>{e(a)}</h3><p>{e(b)}</p></div></li>' for i, (a, b) in enumerate(h['steps']))
        free = ''.join(f'<li>{e(x)}</li>' for x in h['free_l']); full = ''.join(f'<li>{e(x)}</li>' for x in h['full_l'])
        faq = ''.join(f'<details class="fq"><summary>{e(q)}</summary><p>{e(a)}</p></details>' for q, a in t['faq']['items'][:6])
        ids = {'it': ('prova', 'perche', 'prezzi'), 'fr': ('essai', 'pourquoi', 'prix'), 'en': ('free-trial', 'why', 'pricing'), 'es': ('prueba', 'por-que', 'precios')}[c]
        SH = c if c in ('it', 'fr', 'en') else 'en'
        year = datetime.date.today().year
        price = money(c, 59)
        return head + render_body(c, t, h, oq, data, APP, langs, ids, SH, price, CSS, JS, GOAT)
    return page, jsonld
