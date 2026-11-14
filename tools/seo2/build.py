# -*- coding: utf-8 -*-
"""Build the second wave of SEO guide pages + update sitemap.xml and llms.txt.
Run from repo root:  python3 tools/seo2/build.py"""
import json, os, re, sys, html
sys.path.insert(0, os.path.dirname(__file__))
from content import PAGES, UI, HOME, REL, LANGS

ROOT = os.getcwd()
SITE = 'https://thewinegoat.com'
DATE = '2026-11-14'
e = html.escape
LNAME = {'en': 'English', 'it': 'Italiano', 'fr': 'Français', 'es': 'Español'}
OG = {'en': 'og-en', 'it': 'og-it', 'fr': 'og-fr', 'es': 'og-es'}

def footer(lang):
    src = {'en': 'how-to-pass-wset-level-3', 'it': 'it/come-superare-wset-3', 'fr': 'fr/reussir-wset-niveau-3', 'es': 'es/como-aprobar-wset-3'}[lang]
    s = open(f'{ROOT}/{src}/index.html', encoding='utf8').read()
    f = s[s.find('<footer'):s.find('</footer>') + 9]
    return re.sub(r'Updated \d{4}-\d\d-\d\d|Aggiornato il \d{4}-\d\d-\d\d|Mis à jour le \d{4}-\d\d-\d\d|Actualizado el \d{4}-\d\d-\d\d', lambda m: m.group(0)[:-10] + DATE, f)

def block(b):
    k = b[0]
    if k == 'h2': return f'<h2>{e(b[1])}</h2>'
    if k == 'p': return f'<p>{e(b[1])}</p>'
    if k == 'ul': return '<ul class="tips">' + ''.join(f'<li>{e(x)}</li>' for x in b[1]) + '</ul>'
    if k == 'table':
        head, rows = b[1], b[2]
        t = '<div class="tblw"><table class="lvtab"><thead><tr>' + ''.join(f'<th>{e(h)}</th>' for h in head) + '</tr></thead><tbody>'
        for r in rows:
            t += '<tr>' + ''.join((f'<th scope="row">{e(c)}</th>' if i == 0 else f'<td data-l="{e(head[i])}">{e(c)}</td>') for i, c in enumerate(r)) + '</tr>'
        return t + '</tbody></table></div>'
    raise ValueError(k)

def page(key, lang):
    P = PAGES[key]; C = P[lang]; U = UI[lang]; slug = P['slug'][lang]; url = SITE + slug
    alts = ''.join(f'<link rel="alternate" hreflang="{l}" href="{SITE}{P["slug"][l]}">' for l in LANGS) + f'<link rel="alternate" hreflang="x-default" href="{SITE}{P["slug"]["en"]}">'
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "Article", "@id": url + "#article", "headline": C['h1'], "description": C['desc'], "inLanguage": lang, "datePublished": DATE, "dateModified": DATE,
         "mainEntityOfPage": url, "author": {"@id": SITE + "/#org"}, "publisher": {"@id": SITE + "/#org"}, "image": f"{SITE}/img/{OG[lang]}.png",
         "about": [{"@type": "Thing", "name": "WSET Level 3 Award in Wines"}, {"@type": "Thing", "name": "Wine"}]},
        {"@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": U['home'], "item": SITE + HOME[lang]}, {"@type": "ListItem", "position": 2, "name": C['h1']}]},
        {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in C['faq']]}]}
    langs = ''.join(f'<a href="{PAGES[key]["slug"][l]}" hreflang="{l}" lang="{l}">{LNAME[l]}</a>' for l in LANGS)
    body = ''.join(f'<p class="lead">{e(x)}</p>' for x in C['lead'])
    body += '<section class="seosec">' + ''.join(block(b) for b in C['body']) + '</section>'
    body += (f'<section class="seocta"><img src="/img/goats/final.webp" alt="" width="200" height="200" loading="lazy"><div><h2>{e(C["cta"][0])}</h2><p>{e(C["cta"][1])}</p>'
             f'<div class="ctas"><a class="btn btn-gold" href="{U["app"]}#go=start">{e(U["start"])}</a><a class="btn btn-light" href="{U["app"]}#go=lvquick">{e(U["test"])}</a></div></div></section>')
    body += f'<section class="seosec"><h2>{e(U["faq"])}</h2>' + ''.join(f'<details class="faqi"><summary>{e(q)}</summary><p>{e(a)}</p></details>' for q, a in C['faq']) + '</section>'
    rel = [(P2['slug'][lang], P2[lang]['h1']) for k2, P2 in PAGES.items() if k2 != key] + REL[lang]
    body += f'<section class="seosec rel"><h2>{e(U["more"])}</h2><ul class="rel-l">' + ''.join(f'<li><a href="{h}">{e(t)}</a></li>' for h, t in rel) + '</ul></section>'
    doc = f'''<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(C['title'])}</title>
<meta name="description" content="{e(C['desc'])}">
<meta name="keywords" content="{e(C['kw'])}">
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large">
<link rel="canonical" href="{url}">{alts}
<meta property="og:type" content="article"><meta property="og:site_name" content="The Wine Goat"><meta property="og:title" content="{e(C['title'])}"><meta property="og:description" content="{e(C['desc'])}"><meta property="og:url" content="{url}"><meta property="og:image" content="{SITE}/img/{OG[lang]}.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/img/favicon.png" type="image/png"><link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
<link rel="stylesheet" href="/assets/site.css"><link rel="stylesheet" href="/assets/seo.css">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
</head><body class="seo"><header class="top"><div class="wrap nav">
<a class="brand" href="{HOME[lang]}"><img class="emb" src="/img/logo-emblem.webp" alt="" width="360" height="384"><img class="wm" src="/img/wordmark.webp" alt="The Wine Goat" width="752" height="294"></a>
<nav class="seolangs" aria-label="Language">{langs}</nav>
<a class="btn btn-primary btn-sm" href="{U['app']}#go=start">{e(U['btn'])}</a></div></header>
<main><nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="{HOME[lang]}">{e(U['home'])}</a></li><li aria-current="page">{e(C['h1'])}</li></ol></nav><article class="wrap seo-a"><h1>{e(C['h1'])}</h1>{body}</article></main>{footer(lang)}<script src="/assets/seo.js" defer></script></body></html>
'''
    out = ROOT + slug + 'index.html'
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, 'w', encoding='utf8').write(doc)
    return slug

slugs = [page(k, l) for k in PAGES for l in LANGS]

# sitemap
sm = open(f'{ROOT}/sitemap.xml', encoding='utf8').read()
add = ''
for k, P in PAGES.items():
    for l in LANGS:
        if f'<loc>{SITE}{P["slug"][l]}</loc>' in sm: continue
        alts = ''.join(f'<xhtml:link rel="alternate" hreflang="{x}" href="{SITE}{P["slug"][x]}"/>' for x in LANGS)
        add += f'<url><loc>{SITE}{P["slug"][l]}</loc><lastmod>{DATE}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority>{alts}</url>\n'
if add:
    if 'xmlns:xhtml' not in sm:
        sm = sm.replace('<urlset ', '<urlset xmlns:xhtml="http://www.w3.org/1999/xhtml" ', 1)
    sm = sm.replace('</urlset>', add + '</urlset>')
    open(f'{ROOT}/sitemap.xml', 'w', encoding='utf8').write(sm)

# llms.txt
lt = open(f'{ROOT}/llms.txt', encoding='utf8').read()
if 'wset-level-3-exam-format' not in lt:
    lt += '\n## WSET Level 3 guides\n' + ''.join(f'- [{PAGES[k]["en"]["h1"]}]({SITE}{PAGES[k]["slug"]["en"]}): {PAGES[k]["en"]["desc"]}\n' for k in PAGES)
    open(f'{ROOT}/llms.txt', 'w', encoding='utf8').write(lt)
print(len(slugs), 'pages')
