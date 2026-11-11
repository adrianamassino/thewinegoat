# -*- coding: utf-8 -*-
"""Home page v3 — fewer sections, the key value, an open question marked on the spot, warm and trustworthy look.
Keeps the <head> of v2 (meta, hreflang, JSON-LD) and replaces the body."""
import json, html, os, datetime, re
import page_v2
from page_v2 import money, CUR, DEFCUR, TRIAL_BDX
from home_text import H
from goat_walk import goat_svg, GOAT_CSS
import feat_anim, feat_more
HERE = os.path.dirname(os.path.abspath(__file__))
LANE_CSS = """
/* hero: one small goat beside the phone */
.gside{position:absolute;right:-30px;bottom:2%;width:140px;height:auto;z-index:3;filter:drop-shadow(0 12px 14px rgba(62,15,34,.22))}
/* hero: the walking goat has its own strip at the foot of the text column */
.glane{position:relative;height:104px;margin:30px 0 0;overflow-x:clip;overflow-y:visible;pointer-events:none}
.glane .gw{width:136px}
.hero3 .trust3{margin-top:14px;row-gap:4px}.hero3 .sub3{margin-bottom:62px}.ctas3{position:relative}.glane.gl1{position:absolute;left:0;right:0;bottom:100%;height:66px;margin:0 0 -3px;z-index:3;overflow:visible;overflow-x:clip}.glane.gl1 .gw{width:92px}
.gw .gbub{position:absolute;left:88%;bottom:64%;margin:0;width:max-content;max-width:220px;padding:9px 14px;border-radius:18px 18px 18px 4px;background:#fff;color:var(--plum,#3e0f22);font-weight:700;font-size:14px;line-height:1.3;
 box-shadow:0 12px 26px -12px rgba(62,15,34,.45),inset 0 0 0 1.5px #f0d9df;transform-origin:0 100%;opacity:0;transform:scale(.5) translateY(8px);transition:opacity .25s,transform .35s cubic-bezier(.2,.9,.3,1.3)}
.gw.talking .gbub{opacity:1;transform:none}
/* static goats: each one sits on something */
.g3.gtry{width:172px;right:auto;left:calc(50% + 400px);top:auto;bottom:60px}
.panel3wrap{position:relative;max-width:780px;margin:0 auto}
.cmpwrap{position:relative;max-width:820px;margin:0 auto}
.g3.gcmp{width:136px;right:0;top:-122px;z-index:2}
.pwrap{position:relative}.pwrap>.pc{height:100%}
.rtl .g3.gprize{right:auto;left:18px}
.g3.gprize{width:122px;right:14px;top:-140px;z-index:2}
.g3.gfaq2{width:178px;left:calc(100% + 22px);top:110px}
.why{position:relative}.why h3{padding-right:92px}.why .wi{margin-right:96px}.g3.gwc{width:96px;right:12px;top:6px}
.whys .why:nth-child(odd) .gwc{transform-origin:50% 100%}
.g3.gfree{width:148px;left:10px;top:-118px;z-index:2}
.g3.gtry2{width:152px;left:auto;right:calc(50% + 400px);bottom:40px}
.g3.gfaq3{width:146px;right:calc(100% + 30px);top:330px}
.fin3{position:relative}.g3.gquick{width:150px;left:58%;top:auto;bottom:34px}
.s3one{max-width:820px}.s3head{display:flex;align-items:flex-end;gap:14px}.s3head h2{margin:0}
.g3.gsmall{position:relative;inset:auto;flex:none}
.gs1{width:70px;margin-bottom:-6px}
.stats3{position:relative}.g3.gs2{position:absolute;width:62px;right:14px;top:-58px;z-index:1}
.foot3 .w{position:relative}.gs3{position:absolute;right:16px;top:-30px;width:96px;opacity:.95}
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
@media (max-width:640px){.gside{width:76px;right:-8px;bottom:0}.glane{height:86px;margin-top:22px}.hero3 .sub3{margin-bottom:58px}.glane.gl1{height:62px}.glane.gl1 .gw{width:86px}.glane .gw{width:112px}.gw .gbub{max-width:170px;font-size:13px;left:84%}
 .g3.gcmp{display:none}.pgrid{gap:110px;margin-top:104px}.g3.gprize{width:86px;top:-106px}.g3.gfree{width:100px;top:-84px}.g3.gwc{width:74px;right:10px;top:8px}.why h3{padding-right:72px}
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
    var aft=st.getAttribute('data-after');
    if(aft){ var bs=[].slice.call(document.querySelectorAll(aft)), L=st.getBoundingClientRect().left, t0b=bs.length?bs[0].getBoundingClientRect().top:0, mx=0;
      var b0=bs[0]?bs[0].getBoundingClientRect():null;
      if(b0) stop=Math.max(0,Math.min(Math.round(b0.left-L+b0.width/2-g/2), w-g-2)); }
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

def _grape(cls, uid):
    # cluster of grapes with stem, curl and leaf
    pts = [(50,30),(36,34),(64,34),(29,48),(43,48),(57,48),(71,48),(36,62),(50,62),(64,62),(43,76),(57,76),(50,89)]
    berries = ''.join(f'<circle cx="{x}" cy="{y}" r="8.6" fill="url(#gb{uid})"/><circle cx="{x-3}" cy="{y-3}" r="2.2" fill="#fff" opacity=".45"/>' for x, y in pts)
    return (f'<svg class="hgr {cls}" viewBox="0 0 110 110"><defs><radialGradient id="gb{uid}" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#c25a86"/><stop offset=".55" stop-color="#8c1d40"/><stop offset="1" stop-color="#4e0d26"/></radialGradient></defs>'
            f'<path d="M50 24 C50 14 54 8 60 4" fill="none" stroke="#7a5236" stroke-width="3" stroke-linecap="round"/>'
            f'<path d="M58 8 C70 -2 92 4 96 18 C84 16 76 22 70 30 C66 20 62 14 58 8Z" fill="#7d9a45"/><path d="M60 9 C70 10 80 16 88 18" fill="none" stroke="#5f7a30" stroke-width="1.4"/>'
            f'<path d="M46 20 C38 16 34 8 40 4 C44 2 46 8 42 10" fill="none" stroke="#7d9a45" stroke-width="1.6" stroke-linecap="round"/>{berries}</svg>')

def _hero_deco():
    bub = ''.join(f'<i style="--x:{x}%;--s:{sz}px;--d:{d}s;--t:{t}s"></i>' for x, sz, d, t in
                  ((4,14,0,9),(10,8,2.5,11),(17,20,5,10),(25,10,1.2,12),(33,7,6.5,9),(41,16,3.4,13),(48,9,8,10),(56,12,.6,11),(64,18,4.4,12),(72,8,7.1,9),(80,14,2,10),(88,10,5.7,12),(95,16,3,11),(21,12,9,11),(52,7,10,10),(76,22,6,13),(37,11,11,10),(90,8,8.5,9)))
    rows = ''.join(f'<path d="M{-40 + i * 4},{300 - i * 3} C{240 + i * 6},{232 - i * 9} {520 - i * 5},{258 - i * 7} {820 + i * 8},{214 - i * 6} S{1240},{196 - i * 5} {1480},{226 - i * 4}" />' for i in range(5))
    hills = (f'<svg class="hhills" viewBox="0 0 1440 320" preserveAspectRatio="none"><g fill="none" stroke="#b8892e" stroke-width="1" opacity=".55">{rows}</g>'
             '<g fill="none" stroke="#8c1d40" stroke-width="1" stroke-dasharray="1 7" stroke-linecap="round" opacity=".35">'
             + ''.join(f'<path d="M{-20 + i * 2},{310 - i * 3} C{240 + i * 6},{246 - i * 9} {520 - i * 5},{270 - i * 7} {820 + i * 8},{226 - i * 6} S1240,{208 - i * 5} 1480,{238 - i * 4}"/>' for i in range(0, 5, 2))
             + '</g></svg>')
    return ('<div class="hdeco" aria-hidden="true"><div class="hbub">' + bub + '</div>' + hills
            + _grape('hg1', 1) + _grape('hg2', 2) + _grape('hg3', 3)
            + '<span class="hsp s1">✦</span><span class="hsp s2">✦</span><span class="hsp s3">✦</span></div>')

HERO_CSS = """
.hdeco{position:absolute;inset:0;pointer-events:none;z-index:0;overflow:hidden}
.hero3>.w,.hero3 .hgrid,.hero3 .stats3{position:relative;z-index:2}
.hero3{background:radial-gradient(55% 60% at 20% 30%,#fbefe4 0%,rgba(251,239,228,0) 70%),radial-gradient(60% 70% at 85% 20%,#f5e6e3 0%,rgba(245,230,227,0) 70%),#fcf8f3}
.hbub i{position:absolute;bottom:-20px;left:var(--x);width:var(--s);height:var(--s);border-radius:50%;
 background:radial-gradient(circle at 32% 30%,rgba(255,255,255,.95) 0 18%,rgba(255,255,255,0) 30%),radial-gradient(circle,rgba(212,162,58,.16) 50%,rgba(196,120,60,.6) 100%);
 box-shadow:inset 0 0 0 1.5px rgba(196,140,50,.6),0 2px 6px rgba(212,162,58,.25);animation:hbubup var(--t) linear calc(var(--d) * -1) infinite;opacity:0}
@keyframes hbubup{0%{transform:translate(0,0);opacity:0}10%{opacity:1}50%{transform:translate(10px,-320px)}90%{opacity:.7}100%{transform:translate(-6px,-680px);opacity:0}}
.hgr{position:absolute;filter:drop-shadow(0 10px 14px rgba(62,15,34,.25));transform-origin:50% 0;animation:hgsw 6s ease-in-out infinite}
.hg1{width:96px;left:-14px;top:30px;transform:rotate(-18deg);animation-delay:-1s}
.hg2{width:70px;left:calc(50% - 60px);top:20px;transform:rotate(12deg);animation-delay:-3s}
.hg3{width:58px;left:2%;bottom:130px;transform:rotate(-8deg);opacity:.9;animation-delay:-4.5s}
@keyframes hgsw{0%,100%{rotate:-4deg}50%{rotate:5deg}}
.hsp{position:absolute;color:#d4a23a;font-size:16px;animation:hspk 3.2s ease-in-out infinite}
.hsp.s1{left:41%;top:24%}.hsp.s2{left:8%;top:52%;font-size:12px;animation-delay:-1.2s}.hsp.s3{left:47%;top:62%;font-size:13px;animation-delay:-2.2s}
@keyframes hspk{0%,100%{opacity:.2;transform:scale(.7) rotate(0)}50%{opacity:1;transform:scale(1.15) rotate(20deg)}}
@media (max-width:1020px){.hg1{width:70px;top:auto;bottom:42%;left:-24px}.hg2{left:auto;right:10px;top:14px}.rtl .hg2{right:auto;left:10px}.rtl .hg1{left:auto;right:-24px}.hg3{display:none}.hsp.s1{left:auto;right:28%}}
@media (max-width:640px){.hg1{width:62px;left:-22px;top:auto;bottom:46%}.hg2{width:50px;top:8px;right:-8px}.rtl .hg2{left:-8px}.hsp.s3{display:none}}
.hhills{position:absolute;left:0;right:0;bottom:0;width:100%;height:46%}
@media (prefers-reduced-motion:reduce){.hbub{display:none}.hgr,.hsp{animation:none}}
"""

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
<section class="hero3">{_hero_deco()}<div class="w hgrid">
 <div class="htx">
  <p class="kick3">{e(h['kick'])}</p>
  <h1>{e(h['h1'])}</h1>
  <p class="sub3">{e(h['sub'])}</p>
  <div class="ctas3"><a class="b3 b3p" href="{APP}#go=start">{e(h['cta1'])}</a><a class="b3 b3g" href="#{ids[0]}">{e(h['cta2'])}</a><div class="glane gl1" aria-hidden="true" data-after=".ctas3 > a"><div class="gw" id="gw">{goat_svg()}</div></div></div>
  <ul class="trust3">{trust}</ul>
 </div>
 <div class="hvis" aria-hidden="true">
  <div class="glow"></div>
  <div class="phone3"><img src="{img}/shots/home-{SH}.webp" alt="" width="540" height="1080"></div>
 </div>
</div>
<div class="w stats3">{stats}<img class="g3 gsmall gs2 sway" src="{img}/goats/ig-n04.webp" alt="" width="221" height="300" loading="lazy"></div></section>

<section id="{ids[1]}" class="sec3 feat3"><div class="w">
 {feat_anim.head(c, h)}
 {feat_anim.render(h, oq, img)}
 {feat_more.render(c, img)}
</div></section>

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

<section class="sec3 why3"><div class="w">
 <h3 class="cmph">{e(h['cmp_h'])}</h3><div class="cmpwrap"><img class="g3 gcmp sway2" src="{img}/goats/books.webp" alt="" width="326" height="300" loading="lazy">{cmp}</div>
 <div class="glane gl2" aria-hidden="true" data-dir="rtl" data-stop=".35" data-speed="70"><div class="gw">{goat_svg()}</div></div>
</div></section>

<section class="sec3 steps3"><div class="w s3one">
 <div class="s3head"><h2>{e(h['steps_h'])}</h2><img class="g3 gsmall gs1 sway2" src="{img}/goats/ig-n33.webp" alt="" width="216" height="300" loading="lazy"></div><ol class="stl">{steps}</ol>
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
 <img class="gsmall gs3" src="{img}/goats/ig-n15.webp" alt="" width="300" height="203" loading="lazy">
 <p class="fc3">© {year} The Wine Goat · <a href="https://www.instagram.com/the.winegoat/" rel="noopener">Instagram</a></p>
</div></footer>
<script type="application/json" id="home-data">{json.dumps(data, ensure_ascii=False).replace("</", "<\\/")}</script>
<style>{GOAT_CSS}{LANE_CSS}{feat_anim.CSS}{feat_more.CSS}{HERO_CSS}</style>
<script>{JS}</script>
<script>{LANE_JS}</script>
<script>{feat_anim.JS}</script>
<script>{feat_more.JS}</script>
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
