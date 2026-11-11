# -*- coding: utf-8 -*-
"""Home page v3 — fewer sections, the key value, an open question marked on the spot, warm and trustworthy look.
Keeps the <head> of v2 (meta, hreflang, JSON-LD) and replaces the body."""
import json, html, os, datetime, re
import page_v2
from page_v2 import money, CUR, DEFCUR, TRIAL_BDX
from home_text import H
from goat_svg import goat_svg, GOAT_CSS, GOAT_JS
HERE = os.path.dirname(os.path.abspath(__file__))
e = lambda s: html.escape(str(s), quote=True)

def render_body(c, t, h, oq, data, APP, langs, ids, SH, price, CSS, JS, GOAT, notice='', home='./', img='../img', lang_label=None):
    nav = ''.join(f'<li><a href="{u}">{e(n)}</a></li>' for u, n in h['nav'])
    stats = ''.join(f'<div class="st"><b>{e(a)}</b><span>{e(b)}</span></div>' for a, b in h['stats'])
    trust = ''.join(f'<li>{e(x)}</li>' for x in h['trust'])
    why = ''.join(f'<article class="why"><span class="wi">{ic}</span><h3>{e(a)}</h3><p>{e(b)}</p></article>' for ic, a, b in h['why'])
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
 </div>
 <div class="hvis" aria-hidden="true">
  <div class="glow"></div>
  <div class="phone3"><img src="{img}/shots/home-{SH}.webp" alt="" width="540" height="1080"></div>
  <img class="g3 gpeek sway2" src="{img}/goats/peek.webp" alt="" width="248" height="320">
  <div class="gaw"><img class="g3 ga sway" src="{img}/goats/hero.webp" alt="" width="745" height="848"><p class="say" id="say"></p></div>
 </div>
</div>
<div class="w stats3">{stats}</div></section>

<section id="{ids[0]}" class="sec3 try3"><div class="w">
 <h2>{e(h['try_h'])}</h2><p class="lead3">{e(h['try_p'])}</p>
 <div class="tabs3" role="tablist"><button role="tab" aria-selected="true" data-t3="open">{e(h['tab_open'])}</button><button role="tab" aria-selected="false" data-t3="mcq">{e(h['tab_mcq'])}</button></div>
 <div class="panel3" id="p-open">
  <p class="octx">{e(h['o_ctx'].replace('{m}', str(oq['m'])))}</p>
  <h3 class="oq3">{e(oq['t'])}</h3>
  <textarea id="oans" rows="6" placeholder="{e(h['o_ph'])}"></textarea>
  <button type="button" class="b3 b3p" id="ogo">{e(h['o_btn'])}</button>
  <div id="ores" aria-live="polite"></div>
  <p class="onote">{e(h['o_model'])}</p>
 </div>
 <div class="panel3" id="p-mcq" hidden><div id="mcq3" aria-live="polite"></div></div>
 <img class="g3 gtry sway" src="{img}/goats/explore.webp" alt="" width="300" height="300" loading="lazy">
</div></section>

<section id="{ids[1]}" class="sec3 why3"><div class="w">
 <img class="g3 gdeco gwhy sway2" src="{img}/goats/books.webp" alt="" width="300" height="300" loading="lazy">
 <h2>{e(h['why_h'])}</h2>
 <div class="whys">{why}</div>
 <h3 class="cmph">{e(h['cmp_h'])}</h3>{cmp}
</div></section>

<section class="sec3 steps3"><div class="w s3grid">
 <img class="g3 gst sway2" src="{img}/goats/method.webp" alt="" width="300" height="300" loading="lazy">
 <div><h2>{e(h['steps_h'])}</h2><ol class="stl">{steps}</ol></div>
</div></section>

<section id="{ids[2]}" class="sec3 price3"><div class="w">
 <img class="g3 gdeco gprice sway" src="{img}/goats/trophy.webp" alt="" width="300" height="300" loading="lazy">
 <h2>{e(h['price_h'])}</h2>
 <div class="pgrid">
  <article class="pc"><h3>{e(h['free_t'])}</h3><p class="pp">0 €</p><ul>{free}</ul><a class="b3 b3g" href="{APP}#go=start">{e(h['free_b'])}</a></article>
  <article class="pc pro"><span class="rib">★</span><h3>{e(h['full_t'])}</h3><p class="pp">{price} <small>{e(h['full_note'])}</small></p><ul>{full}</ul><a class="b3 b3gold" href="{APP}#go=start">{e(h['full_b'])}</a></article>
 </div>
</div></section>

<section id="faq" class="sec3 faq3"><div class="w nar"><img class="g3 gdeco gfaq sway2" src="{img}/goats/study.webp" alt="" width="300" height="300" loading="lazy"><h2>{e(h['faq_h'])}</h2>{faq}</div></section>

<section class="sec3 fin3"><div class="w fgrid">
 <div><h2>{e(h['final_h'])}</h2><p>{e(h['final_p'])}</p><a class="b3 b3gold" href="{APP}#go=start">{e(h['final_b'])}</a></div>
 <img class="g3 gfin sway" src="{img}/goats/final.webp" alt="" width="300" height="300" loading="lazy">
</div></section>
</main>
<footer class="foot3"><div class="w">
 <a class="brand3" href="{home}"><img class="emb" src="{img}/logo-emblem.webp" alt="" width="360" height="384" loading="lazy"><img class="wm" src="{img}/wordmark-light.webp" alt="The Wine Goat" width="752" height="294" loading="lazy"></a>
 <p class="fd3">{e(t['foot']['disc'])}</p>
 <p class="fc3">© {year} The Wine Goat · <a href="https://www.instagram.com/the.winegoat/" rel="noopener">Instagram</a></p>
</div></footer>
<script type="application/json" id="home-data">{json.dumps(data, ensure_ascii=False).replace("</", "<\\/")}</script>
<script>{JS}</script>
</body>
</html>'''

def build(ctx):
    v2page, jsonld = page_v2.build(ctx)
    L, APP = ctx['L'], ctx['APP']; LI = {'it': 0, 'fr': 1, 'en': 2, 'es': 2}
    byid = {x['id']: x for x in ctx['bdx']}
    CSS = open(os.path.join(HERE, 'home.css'), encoding='utf-8').read() 
    JS = open(os.path.join(HERE, 'home.js'), encoding='utf-8').read() 
    GOAT = goat_svg()
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
