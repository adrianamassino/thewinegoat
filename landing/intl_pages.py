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
    rtl = c == 'ar'
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "WebPage", "@id": f"{D}/{c}/", "url": f"{D}/{c}/", "name": T['title'], "description": T['desc'], "inLanguage": T['hl'], "dateModified": TODAY, "isPartOf": {"@id": D + '/#site'}, "publisher": {"@id": D + '/#org'}},
        {"@type": "Course", "name": T['h1'], "description": T['desc'], "inLanguage": ["en", "it", "fr"], "provider": {"@type": "Organization", "name": "The Wine Goat", "url": D + '/'},
         "offers": {"@type": "Offer", "price": "0", "priceCurrency": "EUR", "category": "Free"}, "hasCourseInstance": {"@type": "CourseInstance", "courseMode": "online", "courseWorkload": "PT30M"}},
        {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in T['faq']]}]}
    langs = ''.join(f'<a href="{u}" hreflang="{hl}" lang="{hl}">{e(n)}</a>' for cc, hl, u, n in ALL if cc != c)
    feats = ''.join(f'<article class="ifeat"><h3>{e(a)}</h3><p>{e(b)}</p></article>' for a, b in T['feats'])
    exam = ''.join(f'<article class="iexam"><h3>{e(a)}</h3><p>{e(b)}</p></article>' for a, b in T['exam'])
    how = ''.join(f'<li><span>{i + 1}</span>{e(x)}</li>' for i, x in enumerate(T['how']))
    faq = ''.join(f'<details class="faqi"><summary>{e(q)}</summary><p>{e(a)}</p></details>' for q, a in T['faq'])
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
<link rel="icon" href="/img/favicon.png" type="image/png"><link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
<link rel="stylesheet" href="/assets/site.css"><link rel="stylesheet" href="/assets/seo.css"><link rel="stylesheet" href="/assets/intl.css">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
</head>
<body class="seo intl{' rtl' if rtl else ''}"><header class="top"><div class="wrap nav">
<a class="brand" href="/{c}/"><img class="emb" src="/img/logo-emblem.webp" alt="" width="360" height="384"><img class="wm" src="/img/wordmark.webp" alt="The Wine Goat" width="752" height="294"></a>
<a class="btn btn-primary btn-sm" href="/app/#go=start" data-en>{e(T['cta'])}</a></div></header>
<main>
<section class="ihero"><div class="wrap ihero-in"><div><p class="kick">WSET® Level 3 · Award in Wines</p><h1>{e(T['h1'])}</h1><p class="lead">{e(T['lead'])}</p>
<div class="ctas"><a class="btn btn-primary" href="/app/#go=start" data-en>{e(T['cta'])}</a><a class="btn btn-ghost" href="/wset-level-3-practice-questions/">{e(T['cta2'])}</a></div>
<p class="inote">🌍 {e(T['appnote'])}</p></div><img class="ihg" src="/img/goats/hero.webp" alt="The Wine Goat" width="745" height="848"></div></section>
<section class="wrap seosec"><h2>{e(T['feat_h'])}</h2><div class="ifeats">{feats}</div></section>
<section class="wrap seosec"><h2>{e(T['exam_h'])}</h2><div class="iexams">{exam}</div></section>
<section class="wrap seosec"><h2>{e(T['how_h'])}</h2><ol class="ihow">{how}</ol></section>
<section class="wrap"><div class="seocta"><img src="/img/goats/final.webp" alt="" width="200" height="200" loading="lazy"><div><h2>{e(T['free_h'])}</h2><p>{e(T['free_p'])}</p><div class="ctas"><a class="btn btn-gold" href="/app/#go=start" data-en>{e(T['cta'])}</a></div></div></div></section>
<section class="wrap seosec"><h2>FAQ</h2>{faq}</section>
<nav class="wrap seosec ilangs" aria-label="{e(T['more'])}"><h2>{e(T['more'])}</h2><div>{langs}</div></nav>
</main><footer class="foot"><div class="wrap"><p class="fdisc">{e(T['disc'])}</p><p>© {year} The Wine Goat · <a href="/">thewinegoat.com</a></p></div></footer>
<script>document.querySelectorAll('[data-en]').forEach(function(a){{a.addEventListener('click',function(){{try{{if(!localStorage.getItem('wset3-lang'))localStorage.setItem('wset3-lang','en');}}catch(e){{}}}});}});</script>
</body></html>'''

def css():
    open(os.path.join(OUT, 'assets', 'intl.css'), 'w', encoding='utf-8').write('''
.intl .ihero{position:relative;overflow:hidden;padding:30px 0 10px}
.ihero-in{display:grid;grid-template-columns:1.2fr 1fr;gap:24px;align-items:center}
.ihero h1{font-family:Fraunces,Georgia,"Noto Serif CJK SC","Noto Serif",serif;font-size:clamp(34px,5.5vw,60px);color:var(--wine);line-height:1.1;margin:0 0 14px}
.ihg{width:100%;max-width:420px;height:auto;justify-self:center;animation:hop 4.6s ease-in-out 1s infinite;transform-origin:50% 100%}
.inote{margin-top:14px;font-weight:600;color:var(--mut)}
.ifeats,.iexams{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px}
.ifeat,.iexam{background:#fff;border:2px solid var(--line);border-bottom-width:5px;border-radius:20px;padding:18px}
.ifeat h3,.iexam h3{font-size:18px;color:var(--wine);margin:0 0 6px}
.ihow{list-style:none;padding:0;display:grid;gap:10px}.ihow li{display:flex;gap:12px;align-items:center;background:#fff;border:2px solid var(--line);border-radius:16px;padding:14px;font-weight:600}
.ihow span{display:grid;place-items:center;flex:none;width:36px;height:36px;border-radius:50%;background:var(--gold);color:var(--ink);font-weight:800}
.ilangs div{display:flex;flex-wrap:wrap;gap:8px}.ilangs a{padding:8px 12px;border-radius:999px;background:#fff;border:1.5px solid var(--line);text-decoration:none;font-weight:600;font-size:14px}
.rtl{direction:rtl}.rtl .tips li{padding:14px 48px 14px 16px}
@media(max-width:760px){.ihero-in{grid-template-columns:1fr}.ihg{max-width:240px;order:-1}}
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
