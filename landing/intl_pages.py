# -*- coding: utf-8 -*-
"""Home pages for the languages whose app is not translated yet (de, nl, pt-br, pt, el, ja, ko, zh-hans, zh-hant, pl, ar, es-ar).
They link to the English app. Also: hreflang links on every home page, sitemap entries, language links.
Usage: python3 intl_pages.py <pkg dir>   (after build_landing.py and seo_pages.py, before the English page moves to the root)"""
import os, sys, json, html, datetime
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from intl_text import I
OUT = os.path.abspath(sys.argv[1]); D = 'https://thewinegoat.com'; TODAY = datetime.date.today().isoformat()
e = lambda s: html.escape(str(s), quote=True)
MAIN = [('en', 'en', '/', 'English'), ('it', 'it', '/it/', 'Italiano'), ('fr', 'fr', '/fr/', 'Français'), ('es', 'es', '/es/', 'Español')]
ALL = MAIN + [(c, v['hl'], f'/{c}/', v['name']) for c, v in I.items()]

def alts_html():
    return ''.join(f'<link rel="alternate" hreflang="{hl}" href="{D}{u}">' for c, hl, u, n in ALL) + f'<link rel="alternate" hreflang="x-default" href="{D}/">'

def page(c, T):
    import re as _re
    rtl = c == 'ar'
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "WebPage", "@id": f"{D}/{c}/", "url": f"{D}/{c}/", "name": T['title'], "description": T['desc'], "inLanguage": T['hl'], "dateModified": TODAY, "isPartOf": {"@id": D + '/#site'}, "publisher": {"@id": D + '/#org'}},
        {"@type": "Course", "name": T['h1'], "description": T['desc'], "inLanguage": ["en", "it", "fr"], "provider": {"@type": "Organization", "name": "The Wine Goat", "url": D + '/'},
         "offers": {"@type": "Offer", "price": "0", "priceCurrency": "EUR", "category": "Free"}, "hasCourseInstance": {"@type": "CourseInstance", "courseMode": "online", "courseWorkload": "PT30M"}},
        {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in T['faq']]}]}
    langs = ''.join(f'<li><a href="{u}" hreflang="{hl}" lang="{hl}"{" aria-current=true" if cc == c else ""}>{e(n)}</a></li>' for cc, hl, u, n in ALL)
    def stat(t):
        m = _re.match(r'^([0-9][0-9.,\s]*\+?)\s*(.*)$', t)
        return (m.group(1).strip(), m.group(2)) if m else ('★', t)
    stats = ''.join('<div class="st"><b>{}</b><span>{}</span></div>'.format(*map(e, stat(T['feats'][k][0]))) for k in (0, 1, 5, 6))
    why = ''.join(f'<article class="why"><span class="wi">{ic}</span><h3>{e(T["feats"][k][0])}</h3><p>{e(T["feats"][k][1])}</p></article>' for ic, k in (('✍️', 1), ('📅', 3), ('🎬', 6)))
    exam = ''.join(f'<article class="why ex3"><h3>{e(a)}</h3><p>{e(b)}</p></article>' for a, b in T['exam'])
    steps = ''.join(f'<li><span class="sn3">{i + 1}</span><div><h3>{e(x)}</h3></div></li>' for i, x in enumerate(T['how']))
    faq = ''.join(f'<details class="fq"><summary>{e(q)}</summary><p>{e(a)}</p></details>' for q, a in T['faq'])
    year = datetime.date.today().year
    return f'''<!DOCTYPE html>
<html lang="{T['hl']}"{' dir="rtl"' if rtl else ''}>
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(T['title'])}</title>
<meta name="description" content="{e(T['desc'])}"><meta name="keywords" content="{e(T['kw'])}">
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large">
<link rel="canonical" href="{D}/{c}/">{alts_html()}
<meta property="og:type" content="website"><meta property="og:site_name" content="The Wine Goat"><meta property="og:title" content="{e(T['title'])}"><meta property="og:description" content="{e(T['desc'])}"><meta property="og:url" content="{D}/{c}/"><meta property="og:image" content="{D}/img/og-en.png"><meta property="og:locale" content="{T['hl'].replace('-', '_')}">
<meta name="theme-color" content="#8c1d40">
<link rel="icon" href="/img/favicon.png" type="image/png"><link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
<link rel="stylesheet" href="/assets/home.css"><link rel="stylesheet" href="/assets/intl.css">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
</head>
<body class="h3{' rtl' if rtl else ''}">
<header class="top3"><div class="w bar3">
 <a class="brand3" href="/{c}/"><img class="emb" src="/img/logo-emblem.webp" alt="" width="360" height="384"><img class="wm" src="/img/wordmark.webp" alt="The Wine Goat" width="752" height="294"></a>
 <ul class="nav3"></ul>
 <div class="acts3"><details class="lg3"><summary>🌍</summary><ul>{langs}</ul></details><a class="b3 b3p sm" href="/app/#go=start" data-en>{e(T['cta'])}</a></div>
</div></header>
<main>
<section class="hero3"><div class="w hgrid">
 <div class="htx"><p class="kick3">WSET® Level 3 · Award in Wines</p><h1>{e(T['h1'])}</h1><p class="sub3">{e(T['lead'])}</p>
  <div class="ctas3"><a class="b3 b3p" href="/app/#go=start" data-en>{e(T['cta'])}</a><a class="b3 b3g" href="/wset-level-3-practice-questions/">{e(T['cta2'])}</a></div>
  <p class="inote3">🌍 {e(T['appnote'])}</p></div>
 <div class="hvis" aria-hidden="true"><div class="glow"></div><div class="phone3"><img src="/img/shots/home-en.webp" alt="" width="540" height="1080"></div>
  <img class="g3 ga" src="/img/goats/hero.webp" alt="" width="745" height="848"><img class="g3 gb" src="/img/goats/quick.webp" alt="" width="300" height="300"></div>
</div><div class="w stats3">{stats}</div></section>
<section class="sec3 why3"><div class="w"><h2>{e(T['feat_h'])}</h2><div class="whys">{why}</div></div></section>
<section class="sec3"><div class="w"><h2>{e(T['exam_h'])}</h2><div class="whys ex4">{exam}</div></div></section>
<section class="sec3 steps3"><div class="w s3grid"><img class="g3 gst" src="/img/goats/method.webp" alt="" width="300" height="300" loading="lazy"><div><h2>{e(T['how_h'])}</h2><ol class="stl">{steps}</ol></div></div></section>
<section class="sec3 faq3"><div class="w nar"><h2>FAQ</h2>{faq}</div></section>
<section class="sec3 fin3"><div class="w fgrid"><div><h2>{e(T['free_h'])}</h2><p>{e(T['free_p'])}</p><a class="b3 b3gold" href="/app/#go=start" data-en>{e(T['cta'])}</a></div><img class="g3 gfin" src="/img/goats/final.webp" alt="" width="300" height="300" loading="lazy"></div></section>
</main>
<footer class="foot3"><div class="w"><a class="brand3" href="/{c}/"><img class="emb" src="/img/logo-emblem.webp" alt="" width="360" height="384" loading="lazy"><img class="wm" src="/img/wordmark-light.webp" alt="The Wine Goat" width="752" height="294" loading="lazy"></a>
<p class="fd3">{e(T['disc'])}</p><p class="fc3">© {year} The Wine Goat · <a href="/">thewinegoat.com</a></p></div></footer>
<script>document.querySelectorAll('[data-en]').forEach(function(a){{a.addEventListener('click',function(){{try{{if(!localStorage.getItem('wset3-lang'))localStorage.setItem('wset3-lang','en');}}catch(e){{}}}});}});</script>
</body></html>'''

def css():
    src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'home.css'), encoding='utf-8').read().replace('../fonts/', '/fonts/')
    open(os.path.join(OUT, 'assets', 'home.css'), 'w', encoding='utf-8').write(src)
    open(os.path.join(OUT, 'assets', 'intl.css'), 'w', encoding='utf-8').write('''
.inote3{margin:16px 0 0;font-weight:600;color:var(--mut);font-size:15px}
.ex4{grid-template-columns:repeat(4,1fr)}.ex3 h3{font-size:19px}
.rtl{direction:rtl}.rtl .hero3 h1:after{margin-left:auto}.rtl .s3grid h2,.rtl .fin3 h2{text-align:right}
:lang(ja) h1,:lang(ja) h2,:lang(ja) h3,:lang(ko) h1,:lang(ko) h2,:lang(ko) h3,:lang(zh-Hans) h1,:lang(zh-Hans) h2,:lang(zh-Hans) h3,:lang(zh-Hant) h1,:lang(zh-Hant) h2,:lang(zh-Hant) h3,:lang(ar) h1,:lang(ar) h2,:lang(ar) h3,:lang(el) h1,:lang(el) h2,:lang(el) h3{font-family:system-ui,-apple-system,"Noto Sans",sans-serif;font-weight:800}
@media (max-width:1020px){.ex4{grid-template-columns:1fr 1fr}}@media (max-width:640px){.ex4{grid-template-columns:1fr}}
''')

def patch_main():
    """hreflang for the new languages on the main home pages + language links in their footer nav"""
    extra = ''.join(f'<link rel="alternate" hreflang="{v["hl"]}" href="{D}/{c}/">' for c, v in I.items())
    links = ''.join(f'<li><a href="/{c}/" hreflang="{v["hl"]}" lang="{v["hl"]}">{e(v["name"])}</a></li>' for c, v in I.items())
    for c in ('en', 'it', 'fr', 'es'):
        p = os.path.join(OUT, c, 'index.html')
        if not os.path.exists(p): continue
        s = open(p, encoding='utf-8').read()
        if 'hreflang="de"' not in s: s = s.replace('<link rel="alternate" hreflang="x-default"', extra + '<link rel="alternate" hreflang="x-default"', 1)
        if 'class="intl-links"' not in s: s = s.replace('<footer', f'<nav class="seolinks wrap intl-links" aria-label="Languages"><h2>🌍</h2><ul>{links}</ul></nav><footer', 1)
        open(p, 'w', encoding='utf-8').write(s)
    sm = os.path.join(OUT, 'sitemap.xml'); s = open(sm, encoding='utf-8').read()
    add = ''.join(f'<url><loc>{D}/{c}/</loc><lastmod>{TODAY}</lastmod>' + ''.join(f'<xhtml:link rel="alternate" hreflang="{hl}" href="{D}{u}"/>' for cc, hl, u, n in ALL) + '</url>\n' for c in I)
    if f'{D}/de/' not in s: s = s.replace('</urlset>', add + '</urlset>')
    open(sm, 'w', encoding='utf-8').write(s)
    lt = os.path.join(OUT, 'llms.txt')
    if os.path.exists(lt):
        t = open(lt, encoding='utf-8').read()
        if '/de/' not in t: t = t.replace('## Guides', '## Other languages (app in English for now)\n' + ''.join(f'- [{v["name"]}]({D}/{c}/)\n' for c, v in I.items()) + '\n## Guides', 1)
        open(lt, 'w', encoding='utf-8').write(t)

if __name__ == '__main__':
    css()
    for c, T in I.items():
        os.makedirs(os.path.join(OUT, c), exist_ok=True)
        open(os.path.join(OUT, c, 'index.html'), 'w', encoding='utf-8').write(page(c, T))
    patch_main(); print('intl pages:', len(I))
