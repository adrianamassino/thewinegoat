# -*- coding: utf-8 -*-
"""GEO pages of The Wine Goat: About (/about/) and two feature pages (/wine-maps/, /wine-level-test/) in
en, it, fr, es, es-ar (es-ar = voseo of the es text, via tools/site_i18n/es_ar_extra.py).
Same look as the core pages (tools/seo_core): /assets/site.css + /assets/seo.css, header, breadcrumb, footer.
Content: tools/geo/content/<page>.<lang>.txt (simple line format, see parse()). Slugs: tools/geo/slugs.json.
Writes the pages, then the "About and features" section of llms.txt; the sitemaps are rebuilt by tools/seo_tech/sitemaps.py.
Run from the repo root:  python3 tools/geo/pages.py  (then runs tools/seo_tech/images.py --pages and tools/geo/sitewide.py; --no-post skips them)"""
import json, os, re, html, sys
from PIL import Image
e = html.escape
SITE = 'https://thewinegoat.com'; DATE = '2026-11-19'; D = 'tools/geo'
ORG = SITE + '/#organization'; WEB = SITE + '/#website'
sys.path.insert(0, 'tools/site_i18n')
from es_ar_extra import es_ar  # read-only use of the shared es → es-AR converter
SL = json.load(open(f'{D}/slugs.json', encoding='utf8'))
CORE = json.load(open('tools/seo_core/slugs.json', encoding='utf8'))
LANGS = ['en', 'it', 'fr', 'es', 'es-ar']
HREF = {'es-ar': 'es-AR'}
LNAME = {'en': 'English', 'it': 'Italiano', 'fr': 'Français', 'es': 'Español', 'es-ar': 'Español (AR)'}
HOME = {l: '/' if l == 'en' else f'/{l}/' for l in LANGS}
OG = {'en': 'og-en', 'it': 'og-it', 'fr': 'og-fr', 'es': 'og-es', 'es-ar': 'og-es'}
# home, faq title, start free, open app, updated, in short, show answer, answer, why, more pages
UI = {
 'en': ('Home', 'Frequently asked questions', 'Start free', 'Open the app', 'Updated', 'In short', 'Show the answer', 'Answer:', 'Why:', 'More from The Wine Goat'),
 'it': ('Home', 'Domande frequenti', 'Inizia gratis', "Apri l'app", 'Aggiornato il', 'In breve', 'Mostra la risposta', 'Risposta:', 'Perché:', 'Altro da The Wine Goat'),
 'fr': ('Accueil', 'Questions fréquentes', 'Commencer gratuitement', "Ouvrir l'appli", 'Mis à jour le', 'En bref', 'Voir la réponse', 'Réponse :', 'Pourquoi :', 'Plus de The Wine Goat'),
 'es': ('Inicio', 'Preguntas frecuentes', 'Empieza gratis', 'Abrir la app', 'Actualizado el', 'En resumen', 'Ver la respuesta', 'Respuesta:', 'Por qué:', 'Más de The Wine Goat'),
 'es-ar': ('Inicio', 'Preguntas frecuentes', 'Empezá gratis', 'Abrir la app', 'Actualizado el', 'En resumen', 'Ver la respuesta', 'Respuesta:', 'Por qué:', 'Más de The Wine Goat'),
}
DISC = {
 'en': 'The Wine Goat is an independent exam preparation platform, not affiliated with, endorsed or sponsored by the Wine &amp; Spirit Education Trust. WSET® is a registered trademark of the Wine &amp; Spirit Education Trust, mentioned only to identify the exam being prepared for.',
 'it': "The Wine Goat è una piattaforma indipendente di preparazione agli esami, non affiliata, approvata o sponsorizzata dal Wine &amp; Spirit Education Trust. WSET® è un marchio registrato del Wine &amp; Spirit Education Trust, citato solo per indicare l'esame.",
 'fr': "The Wine Goat est une plateforme indépendante de préparation aux examens, non affiliée au Wine &amp; Spirit Education Trust, ni approuvée ni sponsorisée par lui. WSET® est une marque déposée du Wine &amp; Spirit Education Trust, citée uniquement pour désigner l'examen.",
 'es': 'The Wine Goat es una plataforma independiente de preparación de exámenes, no afiliada, avalada ni patrocinada por el Wine &amp; Spirit Education Trust. WSET® es una marca registrada del Wine &amp; Spirit Education Trust, citada solo para indicar el examen.'}
DISC['es-ar'] = DISC['es']
APPQ = {'en': 'en', 'it': 'it', 'fr': 'fr', 'es': 'es', 'es-ar': 'es-ar'}
DEEP = {'about': '', 'maps': '#go=maps', 'test': '#go=lvquick'}
ORG_NODE = {"@type": "Organization", "@id": ORG, "name": "The Wine Goat", "url": SITE + "/",
            "logo": {"@type": "ImageObject", "@id": SITE + "/#logo", "url": SITE + "/img/logo.png", "width": 1655, "height": 848, "caption": "The Wine Goat"},
            "image": {"@id": SITE + "/#logo"}, "email": "hello@thewinegoat.com", "sameAs": ["https://www.instagram.com/the.winegoat/"],
            "description": "Independent exam-preparation app for the WSET wine and spirits qualifications: lessons, practice questions with explanations, flashcards with spaced repetition, mock exams, interactive wine maps and a study planner. Not affiliated with the Wine & Spirit Education Trust."}
WEB_NODE = {"@type": "WebSite", "@id": WEB, "url": SITE + "/", "name": "The Wine Goat", "publisher": {"@id": ORG},
            "inLanguage": ["en", "it", "fr", "es", "es-AR", "de", "nl", "pl", "pt-PT", "pt-BR", "ru", "el", "ja", "ko", "zh-Hans", "zh-Hant", "ar", "th", "tr"]}


def parse(path):
    """Line format: '@key value' (title, desc, kw, h1, tldr, lead, cta 'H || text', faq 'Q || A'),
    '## h2', '### h3', '- li', '1. li', '| a | b |' table rows (first = header), '! tip', '[shot] file | alt | caption',
    '?? question || A | B | C | D || index-of-correct || why', other lines = paragraphs. Blank lines separate blocks."""
    C = {'lead': [], 'faq': [], 'body': []}
    for raw in open(path, encoding='utf8').read().split('\n'):
        s = raw.strip(); B = C['body']
        if not s: continue
        m = re.match(r'@(\w+)\s+(.*)', s)
        if m:
            k, v = m.groups()
            if k == 'lead': C['lead'].append(v)
            elif k == 'faq': C['faq'].append([x.strip() for x in v.split('||')])
            elif k == 'cta': C['cta'] = [x.strip() for x in v.split('||')]
            else: C[k] = v
        elif s.startswith('### '): B.append(['h3', s[4:]])
        elif s.startswith('## '): B.append(['h2', s[3:]])
        elif s.startswith('- '):
            if B and B[-1][0] == 'ul': B[-1][1].append(s[2:])
            else: B.append(['ul', [s[2:]]])
        elif re.match(r'\d+\. ', s):
            t = re.sub(r'^\d+\. ', '', s)
            if B and B[-1][0] == 'ol': B[-1][1].append(t)
            else: B.append(['ol', [t]])
        elif s.startswith('|'):
            cells = [c.strip() for c in s.strip('|').split('|')]
            if B and B[-1][0] == 'table': B[-1][2].append(cells)
            else: B.append(['table', cells, []])
        elif s.startswith('! '): B.append(['tip', s[2:]])
        elif s.startswith('[shot] '):
            f, alt, cap = [x.strip() for x in s[7:].split('|')]
            if B and B[-1][0] == 'shots' and B[-1][2]: B[-1][1].append([f, alt, cap])
            else: B.append(['shots', [[f, alt, cap]], True])
        elif s.startswith('[/shots]'):
            if B and B[-1][0] == 'shots': B[-1][2] = False
        elif s.startswith('?? '):
            q, opts, ok, why = [x.strip() for x in s[3:].split('||')]
            opts = [o.strip() for o in opts.split(' | ')]
            if B and B[-1][0] == 'qs': B[-1][1].append([q, opts, int(ok), why])
            else: B.append(['qs', [[q, opts, int(ok), why]]])
        else: B.append(['p', s])
    return C


AR_FIX = [(r'\bel computadora', 'la computadora'), (r'\bdel computadora', 'de la computadora'), (r'\bal computadora', 'a la computadora'),
          (r'\bu computadora', 'o computadora'), (r'\bun computadora', 'una computadora'), (r'Anotá con el celular', 'Apuntá con el celular'),
          (r'\b([Ee])scribe a hello', r'\1scribí a hello'), (r'\bhaz\b', 'hacé'), (r'\bHaz\b', 'Hacé'), (r'\blee el resultado', 'leé el resultado'),
          (r'\bluego responde\b', 'luego respondé'), (r'\bavisas\b', 'avisás'), (r'lo que bebes', 'lo que tomás'), (r'\bsolo buscas\b', 'solo buscás'),
          (r'reservas y realizas', 'reservás y realizás'), (r', indica la página', ', indicá la página'), (r'Acepta el reto', 'Aceptá el desafío'), (r'\b([Rr])eto rápido', lambda m: ('D' if m.group(1)=='R' else 'd')+'esafío rápido'),
          (r'Reta a un amigo', 'Desafiá a un amigo'), (r'un reto con', 'un desafío con'), (r'el reto de 20', 'el desafío de 20'), (r'El reto de 20', 'El desafío de 20'), (r'Encuéntralo', 'Encontralo'), (r'Escribe el nombre', 'Escribí el nombre'),
          (r'luego busca cada', 'luego buscá cada'), (r', di en voz alta', ', decí en voz alta'), (r'\bfíate de', 'fiate de'), (r'abre la región', 'abrí la región'),
          (r'luego abre la explicación', 'luego abrí la explicación'), (r'Cuenta tus aciertos', 'Contá tus aciertos'), (r'\bjuega (un|en)\b', r'jugá \1'),
          (r'\bpasa a «', 'pasá a «'), (r'Avanzado: pasa a', 'Avanzado: pasá a'), (r'y toca cada zona', 'y tocá cada zona'), (r'\baspiras\b', 'aspirás'),
          (r'\bcambias de nivel', 'cambiás de nivel'), (r'\bSi dudas\b', 'Si dudás'), (r'\bsi llegas\b', 'si llegás'), (r'\bSi creas\b', 'Si creás'), (r'tómala como', 'tomala como')]


def to_ar(C):
    def ar(s):
        s = es_ar(s)
        for a, b in AR_FIX: s = re.sub(a, b, s)
        return s
    def f(x):
        if isinstance(x, str): return ar(x)
        if isinstance(x, list): return [f(y) for y in x]
        if isinstance(x, dict): return {k: (v if k in ('kw',) else f(v)) for k, v in x.items()}
        return x
    return f(C)


def load(page, l):
    if l == 'es-ar':
        C = parse(f'{D}/content/{page}.es.txt'); p = f'{D}/content/{page}.es-ar.txt'
        A = to_ar(C)
        for b0, b1 in zip(C['body'], A['body']):  # keep image paths untouched
            if b0[0] == 'shots':
                for s0, s1 in zip(b0[1], b1[1]): s1[0] = s0[0]
        if os.path.exists(p):  # overrides for es-AR: '@key value' lines replace the converted ones
            O = parse(p)
            for k in ('title', 'desc', 'h1', 'tldr', 'kw'):
                if k in O: A[k] = O[k]
        return A
    return parse(f'{D}/content/{page}.{l}.txt')


def words(C):
    o = [C.get('tldr', '')] + C['lead'] + [' '.join(C.get('cta', []))]
    for b in C['body']:
        if b[0] in ('p', 'h2', 'h3', 'tip'): o.append(b[1])
        elif b[0] in ('ul', 'ol'): o += b[1]
        elif b[0] == 'table': o += [' '.join(b[1])] + [' '.join(r) for r in b[2]]
        elif b[0] == 'qs': o += [q + ' ' + ' '.join(op) + ' ' + w for q, op, ok, w in b[1]]
        elif b[0] == 'shots': o += [s[2] for s in b[1]]
    o += [q + ' ' + a for q, a in C['faq']]
    return len(' '.join(o).split())


def block(b, U):
    k = b[0]
    if k in ('h2', 'h3'): return f'<{k}>{e(b[1])}</{k}>'
    if k == 'p': return f'<p>{e(b[1])}</p>'
    if k in ('ul', 'ol'): return f'<{k} class="tips">' + ''.join(f'<li>{e(x)}</li>' for x in b[1]) + f'</{k}>'
    if k == 'tip': return f'<p class="tipbox">{e(b[1])}</p>'
    if k == 'table':
        head, rows = b[1], b[2]
        t = '<div class="tblw"><table class="lvtab"><thead><tr>' + ''.join(f'<th>{e(h)}</th>' for h in head) + '</tr></thead><tbody>'
        for r in rows:
            t += '<tr>' + ''.join((f'<th scope="row">{e(c)}</th>' if i == 0 else f'<td data-l="{e(head[i] if i < len(head) else "")}">{e(c)}</td>') for i, c in enumerate(r)) + '</tr>'
        return t + '</tbody></table></div>'
    if k == 'shots':
        o = '<div class="shots">'
        for f, alt, cap in b[1]:
            w, h = Image.open('img/screens/' + f).size
            o += f'<figure class="shot"><img src="/img/screens/{e(f)}" alt="{e(alt)}" width="{w}" height="{h}" loading="lazy" decoding="async"><figcaption>{e(cap)}</figcaption></figure>'
        return o + '</div>'
    if k == 'qs':
        o = '<div class="sqs">'
        for n, (q, opts, ok, why) in enumerate(b[1], 1):
            o += f'<article class="sq"><h3><span class="sqn">{n}</span> {e(q)}</h3><ol class="sq-os" type="A">' + ''.join(f'<li><button type="button" class="sq-o" data-ok="{1 if i == ok else 0}">{e(x)}</button></li>' for i, x in enumerate(opts)) + '</ol>'
            o += f'<details class="sq-a"><summary>{e(U[6])}</summary><p><strong>{e(U[7])}</strong> {e(opts[ok])}</p><p><strong>{e(U[8])}</strong> {e(why)}</p></details></article>'
        return o + '</div>'
    raise ValueError(k)


def h1_of(path):
    try: return html.unescape(re.search(r'<h1[^>]*>(.*?)</h1>', open(path.lstrip('/') + 'index.html', encoding='utf8').read(), re.S).group(1)).strip()
    except Exception: return None


ALL = {p: {l: load(p, l) for l in LANGS} for p in SL}


def page(key, l):
    C = ALL[key][l]; U = UI[l]; slug = SL[key][l]; url = SITE + slug
    title, desc = C['title'], C['desc']
    alts = ''.join(f'<link rel="alternate" hreflang="{HREF.get(x, x)}" href="{SITE}{SL[key][x]}">' for x in LANGS) + f'<link rel="alternate" hreflang="x-default" href="{SITE}{SL[key]["en"]}">'
    app = f'/app/?lang={APPQ[l]}'; go = app + DEEP[key]
    img = f'{SITE}/img/{OG[l]}.png'
    prep = (SL and CORE['prep'][l], h1_of(CORE['prep'][l]))
    crumbs_ld = [{"@type": "ListItem", "position": 1, "name": U[0], "item": SITE + HOME[l]}]
    crumbs = f'<li><a href="{HOME[l]}">{e(U[0])}</a></li>'
    if key != 'about' and prep[1]:
        crumbs_ld.append({"@type": "ListItem", "position": 2, "name": prep[1], "item": SITE + prep[0]}); crumbs += f'<li><a href="{prep[0]}">{e(prep[1])}</a></li>'
    crumbs_ld.append({"@type": "ListItem", "position": len(crumbs_ld) + 1, "name": C['h1'], "item": url}); crumbs += f'<li aria-current="page">{e(C["h1"])}</li>'
    shots = [s for b in C['body'] if b[0] == 'shots' for s in b[1]]
    main = {"@type": "AboutPage" if key == 'about' else "WebPage", "@id": url + "#webpage", "url": url, "name": title, "headline": C['h1'], "description": desc,
            "inLanguage": HREF.get(l, l), "isPartOf": {"@id": WEB}, "datePublished": DATE, "dateModified": DATE, "author": {"@id": ORG}, "publisher": {"@id": ORG},
            "breadcrumb": {"@id": url + "#breadcrumb"}, "primaryImageOfPage": {"@type": "ImageObject", "url": (SITE + '/img/screens/' + shots[0][0]) if shots else img},
            "wordCount": words(C)}
    if key == 'about': main["mainEntity"] = {"@id": ORG}; main["about"] = {"@id": ORG}
    else: main["about"] = {"@id": SITE + "/#app"}
    appnode = {"@type": "WebApplication", "@id": SITE + "/#app", "name": "The Wine Goat", "url": SITE + "/app/", "applicationCategory": "EducationalApplication",
               "operatingSystem": "Any (web browser)", "browserRequirements": "Requires JavaScript", "publisher": {"@id": ORG},
               "inLanguage": ["it", "fr", "en", "es", "es-AR"], "isAccessibleForFree": True,
               "description": "Exam-preparation app for WSET Wine Levels 1–3 and Spirits Levels 1–2: lessons, practice questions with explanations, flashcards with spaced repetition, mock exams, short-answer marking, tasting trainer, interactive wine maps, films, podcasts, study planner and label scanner."}
    graph = [main, ORG_NODE, WEB_NODE, appnode,
             {"@type": "BreadcrumbList", "@id": url + "#breadcrumb", "itemListElement": crumbs_ld}]
    if C['faq']: graph.append({"@type": "FAQPage", "@id": url + "#faq", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in C['faq']]})
    if shots: main["image"] = [{"@type": "ImageObject", "url": SITE + '/img/screens/' + f, "caption": cap} for f, alt, cap in shots]
    ld = {"@context": "https://schema.org", "@graph": graph}
    langs = ''.join(f'<a href="{SL[key][x]}" hreflang="{HREF.get(x, x)}" lang="{HREF.get(x, x)}">{LNAME[x]}</a>' for x in LANGS)
    body = f'<div class="tldr" role="note"><b>{e(U[5])}</b><p>{e(C["tldr"])}</p><small>{e(U[4])} {DATE} · The Wine Goat</small></div>'
    body += ''.join(f'<p class="lead">{e(x)}</p>' for x in C['lead'])
    body += '<section class="seosec">' + ''.join(block(b, U) for b in C['body']) + '</section>'
    body += (f'<section class="seocta"><img src="/img/goats/final.webp" alt="" width="200" height="200" loading="lazy" decoding="async"><div><h2>{e(C["cta"][0])}</h2><p>{e(C["cta"][1])}</p>'
             f'<div class="ctas"><a class="btn btn-gold" href="{go}">{e(U[2])}</a><a class="btn btn-light" href="{app}">{e(U[3])}</a></div></div></section>')
    if C['faq']:
        body += f'<section class="seosec"><h2>{e(U[1])}</h2>' + ''.join(f'<details class="faqi"><summary>{e(q)}</summary><p>{e(a)}</p></details>' for q, a in C['faq']) + '</section>'
    rel = [(SL[k2][l], ALL[k2][l]['h1']) for k2 in SL if k2 != key] + [(CORE[k][l], h1_of(CORE[k][l])) for k in ('prep', 'practice', 'mock', 'flashcards', 'planner', 'how', 'faq')]
    body += f'<section class="seosec rel"><h2>{e(U[9])}</h2><ul class="rel-l">' + ''.join(f'<li><a href="{h}">{e(t)}</a></li>' for h, t in rel if t) + '</ul></section>'
    doc = f'''<!DOCTYPE html>
<html lang="{HREF.get(l, l)}">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<meta name="keywords" content="{e(C.get('kw', ''))}">
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large">
<link rel="canonical" href="{url}">{alts}
<meta property="og:type" content="website"><meta property="og:site_name" content="The Wine Goat"><meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(desc)}"><meta property="og:url" content="{url}"><meta property="og:locale" content="{HREF.get(l, l).replace('-', '_')}"><meta property="og:image" content="{img}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:image" content="{img}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{e(title)}"><meta name="twitter:description" content="{e(desc)}">
<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" href="/img/favicon-48.png" type="image/png" sizes="48x48"><link rel="icon" href="/img/favicon-192.png" type="image/png" sizes="192x192"><link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
<link rel="stylesheet" href="/assets/site.css"><link rel="stylesheet" href="/assets/seo.css">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
</head><body class="seo"><header class="top"><div class="wrap nav">
<a class="brand" href="{HOME[l]}"><img class="emb" src="/img/logo-emblem.webp" alt="" width="360" height="384"><img class="wm" src="/img/wordmark.webp" alt="The Wine Goat" width="752" height="294"></a>
<nav class="seolangs" aria-label="Language">{langs}</nav>
<a class="btn btn-primary btn-sm" href="{go}">{e(U[2])}</a></div></header>
<main><nav class="crumbs" aria-label="Breadcrumb"><ol>{crumbs}</ol></nav><article class="wrap seo-a"><h1>{e(C['h1'])}</h1>{body}</article></main><footer class="foot"><div class="wrap"><p class="fdisc">{DISC[l]}</p><p>© 2026 The Wine Goat · <a href="{HOME[l]}">thewinegoat.com</a> · {e(U[4])} {DATE}</p></div></footer><script src="/assets/seo.js" defer></script><script src="/assets/deco.js?v=8" defer></script></body></html>
'''
    out = slug.lstrip('/') + 'index.html'
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, 'w', encoding='utf8').write(doc)
    return words(C)


if __name__ == '__main__':
    for k in SL:
        print(k, {l: page(k, l) for l in LANGS})
    # llms.txt / llms-full.txt: "About The Wine Goat and feature pages" (English text, other languages listed)
    E_ = {k: ALL[k]['en'] for k in SL}
    lt = re.sub(r'\n## About The Wine Goat and feature pages.*?(?=\n## |\Z)', '', open('llms.txt', encoding='utf8').read(), flags=re.S).rstrip() + '\n'
    lt += '\n## About The Wine Goat and feature pages\n' + ''.join(
        f'- [{E_[k]["h1"]}]({SITE}{SL[k]["en"]}): {E_[k]["desc"]} Also in: ' + ', '.join(f'[{LNAME[l]}]({SITE}{SL[k][l]})' for l in LANGS if l != 'en') + '\n' for k in SL)
    open('llms.txt', 'w', encoding='utf8').write(lt)
    def txt(C):
        o = [C['tldr']] + C['lead']
        for b in C['body']:
            if b[0] == 'h2': o.append('\n### ' + b[1])
            elif b[0] in ('p', 'tip', 'h3'): o.append(b[1])
            elif b[0] in ('ul', 'ol'): o += ['- ' + x for x in b[1]]
            elif b[0] == 'table': o += [' | '.join(b[1])] + [' | '.join(r) for r in b[2]]
            elif b[0] == 'qs': o += [f'Q: {q} A: {op[ok]} ({w})' for q, op, ok, w in b[1]]
            elif b[0] == 'shots': o += [f'[Screenshot: {s[2]}]' for s in b[1]]
        return '\n'.join(o) + ''.join(f'\nQ: {q}\nA: {a}' for q, a in C['faq'])
    lf = re.sub(r'\n# About The Wine Goat and feature pages.*?(?=\n# |\Z)', '', open('llms-full.txt', encoding='utf8').read(), flags=re.S).rstrip() + '\n'
    lf += '\n# About The Wine Goat and feature pages\n\n' + '\n\n'.join(f'## {E_[k]["h1"]}\nURL: {SITE}{SL[k]["en"]}\n{txt(E_[k])}' for k in SL) + '\n'
    open('llms-full.txt', 'w', encoding='utf8').write(lf)
    # same post-processing as the other builders: image SEO (if present), then the GEO site-wide pass
    if '--no-post' not in sys.argv:
        if os.path.exists('tools/seo_tech/place_photos.py'): os.system(f'{sys.executable} tools/seo_tech/place_photos.py --quiet')  # credits pages use the About pages as template
        if os.path.exists('tools/seo_tech/images.py'): os.system(f'{sys.executable} tools/seo_tech/images.py --pages >/dev/null')
        if os.path.exists('tools/geo/sitewide.py'): os.system(f'{sys.executable} tools/geo/sitewide.py --quiet')
    os.system(f'{sys.executable} tools/seo_tech/sitemaps.py --quiet')  # sitemap index + one sitemap per language, from the built pages
