# -*- coding: utf-8 -*-
"""Build the second wave of SEO guide pages + update llms.txt, then rebuild the sitemaps (tools/seo_tech/sitemaps.py).
Run from repo root:  python3 tools/seo2/build.py"""
import json, os, re, sys, html
sys.path.insert(0, os.path.dirname(__file__))
import importlib
MOD = sys.argv[1] if len(sys.argv) > 1 else 'content'
C_ = importlib.import_module(MOD)
from content import UI, HOME, REL, LANGS, PAGES as P1
from content3 import PAGES as P3
from content4 import PAGES as P4
PAGES = C_.PAGES
ALLP = {**P1, **P3, **P4}
try:
    IMG = json.load(open(os.path.join(os.path.dirname(__file__), 'images.json'), encoding='utf8'))
except Exception:
    IMG = {}
try:  # hand-written meta descriptions (140-158 chars) that replace the automatic cut of over-long descs
    DESC_FIX = json.load(open(os.path.join(os.path.dirname(__file__), 'desc_fix.json'), encoding='utf8'))
except Exception:
    DESC_FIX = {}

ROOT = os.getcwd()
SITE = 'https://thewinegoat.com'
DATE = '2026-11-15'
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
    if k == 'qs':
        out = '<div class="sqs">'
        for n, (q, opts, ok, why) in enumerate(b[1], 1):
            out += f'<article class="sq"><h3><span class="sqn">{n}</span> {e(q)}</h3><ol class="sq-os" type="A">' + ''.join(f'<li><button type="button" class="sq-o" data-ok="{1 if i == ok else 0}">{e(opts[i])}</button></li>' for i in [(j + n * 3) % len(opts) for j in range(len(opts))]) + '</ol>'
            out += f'<details class="sq-a"><summary>{e(QA[CUR_L][0])}</summary><p><strong>{e(QA[CUR_L][1])}</strong> {e(opts[ok])}</p><p><strong>{e(QA[CUR_L][2])}</strong> {e(why)}</p></details></article>'
        return out + '</div>'
    raise ValueError(k)
GALT = {'en': 'The Wine Goat mascot, the goat of the WSET exam-prep app', 'it': "La capra di The Wine Goat, mascotte dell'app per preparare il WSET", 'fr': "La chèvre de The Wine Goat, mascotte de l'appli de préparation au WSET", 'es': 'La cabra de The Wine Goat, mascota de la app para preparar el WSET'}
QA = {'en': ('Show the answer', 'Answer:', 'Why:'), 'it': ('Mostra la risposta', 'Risposta:', 'Perché:'), 'fr': ('Voir la réponse', 'Réponse :', 'Pourquoi :'), 'es': ('Ver la respuesta', 'Respuesta:', 'Por qué:')}
CUR_L = 'en'

def short_title(t):
    if len(t) <= 65: return t
    if t.endswith(' | The Wine Goat'): t = t[:-16]
    return t
def short_desc(d):
    if len(d) <= 160: return d
    cut = d.rfind('. ', 0, 159)
    if cut >= 100: return d[:cut + 1]
    cut = d.rfind(' ', 0, 155); return d[:cut].rstrip(',;:–- ') + '…'
def page(key, lang):
    global CUR_L; CUR_L = lang
    P = PAGES[key]; C = dict(P[lang]); C['title'] = short_title(C['title']); U = UI[lang]; slug = P['slug'][lang]; C['desc'] = DESC_FIX.get(slug) or short_desc(C['desc']); url = SITE + slug
    alts = ''.join(f'<link rel="alternate" hreflang="{l}" href="{SITE}{P["slug"][l]}">' for l in LANGS) + f'<link rel="alternate" hreflang="x-default" href="{SITE}{P["slug"]["en"]}">'
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "Article", "@id": url + "#article", "headline": C['h1'], "description": C['desc'], "inLanguage": lang, "datePublished": DATE, "dateModified": DATE,
         "mainEntityOfPage": url, "author": {"@id": SITE + "/#org"}, "publisher": {"@id": SITE + "/#org"}, "image": ({"@type": "ImageObject", "url": SITE + IMG[slug]['file'], "contentUrl": SITE + IMG[slug]['file'], "width": 1200, "height": 630, "caption": IMG[slug]['cap'], "description": IMG[slug]['alt'], "inLanguage": lang} if slug in IMG else f"{SITE}/img/{OG[lang]}.png"),
         "about": [{"@type": "Thing", "name": "WSET"}, {"@type": "Thing", "name": "Wine"}], "abstract": C.get('tldr') or C['desc'],
         "speakable": {"@type": "SpeakableSpecification", "cssSelector": [".tldr", "h1"]}},
        {"@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": U['home'], "item": SITE + HOME[lang]}, {"@type": "ListItem", "position": 2, "name": C['h1']}]},
        {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in C['faq']]}]}
    langs = ''.join(f'<a href="{PAGES[key]["slug"][l]}" hreflang="{l}" lang="{l}">{LNAME[l]}</a>' for l in LANGS)
    TL = {'en': 'In short', 'it': 'In breve', 'fr': 'En bref', 'es': 'En resumen'}
    body = f'<div class="tldr" role="note"><b>{TL[lang]}</b><p>{e(C.get("tldr") or C["desc"])}</p><small>{e({"en": "Updated", "it": "Aggiornato il", "fr": "Mis à jour le", "es": "Actualizado el"}[lang])} {DATE} · The Wine Goat</small></div>'
    if slug in IMG:
        I = IMG[slug]
        body += f'<figure class="seofig"><img src="{I["file"]}" alt="{e(I["alt"])}" title="{e(C["h1"])}" width="1200" height="630" fetchpriority="high" decoding="async"><figcaption>{e(I["cap"])}</figcaption></figure>'
    body += ''.join(f'<p class="lead">{e(x)}</p>' for x in C['lead'])
    body += '<section class="seosec">' + ''.join(block(b) for b in C['body']) + '</section>'
    body += (f'<section class="seocta"><img src="/img/goats/goat-laughing-in-wine-barrel-with-two-glasses.webp" alt="{e(GALT[lang])}" width="200" height="231" loading="lazy"><div><h2>{e(C["cta"][0])}</h2><p>{e(C["cta"][1])}</p>'
             f'<div class="ctas"><a class="btn btn-gold" href="{U["app"]}#go=start">{e(U["start"])}</a><a class="btn btn-light" href="{U["app"]}#go=lvquick">{e(U["test"])}</a></div></div></section>')
    body += f'<section class="seosec"><h2>{e(U["faq"])}</h2>' + ''.join(f'<details class="faqi"><summary>{e(q)}</summary><p>{e(a)}</p></details>' for q, a in C['faq']) + '</section>'
    rel = [(P2['slug'][lang], P2[lang]['h1']) for k2, P2 in ALLP.items() if k2 != key] + REL[lang]
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
<meta property="og:type" content="article"><meta property="og:site_name" content="The Wine Goat"><meta property="og:title" content="{e(C['title'])}"><meta property="og:description" content="{e(C['desc'])}"><meta property="og:url" content="{url}"><meta property="og:image" content="{SITE + IMG[slug]['file'] if slug in IMG else SITE + '/img/' + OG[lang] + '.png'}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="{e(IMG[slug]['alt']) if slug in IMG else 'The Wine Goat'}"><meta name="twitter:image" content="{SITE + IMG[slug]['file'] if slug in IMG else SITE + '/img/' + OG[lang] + '.png'}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" href="/img/favicon-48.png" type="image/png" sizes="48x48"><link rel="icon" href="/img/favicon-192.png" type="image/png" sizes="192x192"><link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
<link rel="stylesheet" href="/assets/site.css"><link rel="stylesheet" href="/assets/seo.css">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
</head><body class="seo"><header class="top"><div class="wrap nav">
<a class="brand" href="{HOME[lang]}"><img class="emb" src="/img/logo-emblem.webp" alt="" width="360" height="410"><img class="wm" src="/img/wordmark.webp" alt="The Wine Goat" width="752" height="294"></a>
<nav class="seolangs" aria-label="Language">{langs}</nav>
<a class="btn btn-primary btn-sm" href="{U['app']}#go=start">{e(U['btn'])}</a></div></header>
<main><nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="{HOME[lang]}">{e(U['home'])}</a></li><li aria-current="page">{e(C['h1'])}</li></ol></nav><article class="wrap seo-a"><h1>{e(C['h1'])}</h1>{body}</article></main>{footer(lang)}<script src="/assets/seo.js" defer></script></body></html>
'''
    out = ROOT + slug + 'index.html'
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, 'w', encoding='utf8').write(doc)
    return slug

slugs = [page(k, l) for k in PAGES for l in LANGS]

# sitemaps: rebuilt from the built pages, at the end of this script (tools/seo_tech/sitemaps.py is their only writer)

# llms.txt
lt = open(f'{ROOT}/llms.txt', encoding='utf8').read()
if PAGES[next(iter(PAGES))]['slug']['en'] not in lt:
    lt += '\n## WSET guides (' + MOD + ')\n' + ''.join(f'- [{PAGES[k]["en"]["h1"]}]({SITE}{PAGES[k]["slug"]["en"]}): {PAGES[k]["en"]["desc"]}\n' for k in PAGES)
    open(f'{ROOT}/llms.txt', 'w', encoding='utf8').write(lt)
print(len(slugs), 'pages')
os.chdir(ROOT); os.system(f'{sys.executable} tools/seo_tech/sitemaps.py --quiet')  # sitemap index + one sitemap per language, from the built pages (their only writer)
