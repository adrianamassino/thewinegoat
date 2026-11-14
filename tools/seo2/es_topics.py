# -*- coding: utf-8 -*-
"""Spanish versions of the WSET 3 topic pages (/es/preguntas-wset-3/<slug>/ + hub), built from the English pages
and the app's Spanish translation map (tools/i18n/es-map.json). Also adds hreflang="es" to the en/it/fr versions
and the sitemap. Run from repo root: python3 tools/seo2/es_topics.py"""
import json, re, os, html, glob

SITE = 'https://thewinegoat.com'
M = json.load(open('tools/i18n/es-map.json', encoding='utf8'))
TOP = {  # en slug: (es slug, es name)
 'tasting-sat': ('cata-sat', 'La cata y el SAT'), 'food-and-wine-pairing': ('maridaje', 'Maridaje de comida y vino'), 'storage-and-service': ('conservacion-servicio', 'Conservación y servicio'),
 'wine-business-and-pricing': ('precio-y-comercio', 'Precio del vino y comercio'), 'vine-and-grape-varieties': ('vid-y-variedades', 'La vid y las variedades de uva'),
 'climate-and-environment': ('clima-y-entorno', 'Clima y entorno'), 'vineyard-management': ('viticultura-y-poda', 'Gestión del viñedo y poda'), 'winemaking': ('vinificacion-y-crianza', 'Vinificación y crianza'),
 'white-winemaking': ('vinos-blancos', 'Vinos blancos'), 'red-and-rose-winemaking': ('tintos-y-rosados', 'Vinos tintos y rosados'), 'bordeaux': ('burdeos', 'Burdeos'),
 'burgundy-beaujolais': ('borgona-beaujolais', 'Borgoña y Beaujolais'), 'alsace-loire': ('alsacia-loira', 'Alsacia y el Loira'), 'rhone': ('rodano', 'Valle del Ródano'),
 'southern-france': ('sur-de-francia', 'Sur de Francia'), 'italy': ('italia', 'Italia'), 'spain': ('espana', 'España'), 'portugal': ('portugal', 'Portugal'), 'germany': ('alemania', 'Alemania'),
 'austria-hungary': ('austria-hungria', 'Austria y Hungría'), 'greece': ('grecia', 'Grecia'), 'usa-canada': ('estados-unidos-canada', 'Estados Unidos y Canadá'),
 'chile-argentina': ('chile-argentina', 'Chile y Argentina'), 'south-africa': ('sudafrica', 'Sudáfrica'), 'australia-new-zealand': ('australia-nueva-zelanda', 'Australia y Nueva Zelanda'),
 'sparkling-wines-champagne': ('espumosos-champagne-cava', 'Espumosos: Champagne, Prosecco, Cava'), 'sherry': ('jerez', 'Jerez'), 'port-fortified-wines': ('oporto-generosos', 'Oporto y vinos generosos'),
}
GROUPS = {'Foundations': 'Fundamentos', 'Vineyard': 'Viñedo', 'Winery': 'Bodega', 'France': 'Francia', 'Europe': 'Europa', 'New World': 'Nuevo Mundo', 'Sparkling and fortified': 'Espumosos y generosos'}
HUB_EN, HUB_ES = '/wset-3-questions-by-region/', '/es/preguntas-wset-3-por-region/'
REL = {'/wset-level-3-practice-questions/': ('/es/preguntas-examen-wset-3/', 'Preguntas de examen WSET nivel 3 con respuestas'), '/wset-level-3-mock-exam/': ('/es/simulacro-examen-wset-3/', 'Simulacro de examen WSET nivel 3 gratis'),
       '/wset-level-3-short-answer-questions/': ('/es/preguntas-abiertas-wset-3/', 'Preguntas de respuesta corta WSET nivel 3: ejemplos y respuestas modelo'), '/wset-systematic-approach-to-tasting/': ('/es/cata-sat-wset/', 'El enfoque sistemático de cata (SAT) del WSET 3'),
       '/wset-level-3-flashcards/': ('/es/flashcards-wset-3/', 'Flashcards WSET nivel 3: uvas, regiones, cifras y términos'), '/how-to-pass-wset-level-3/': ('/es/como-aprobar-wset-3/', 'Cómo aprobar el WSET 3 a la primera'), '/': ('/es/', 'Inicio')}
FIX = {'Home': 'Inicio', 'WSET 3 questions by region and topic': 'Preguntas WSET 3 por región y tema', 'Sample questions with answers': 'Preguntas de ejemplo con respuestas', 'Show the answer': 'Ver la respuesta',
       'Answer:': 'Respuesta:', 'Why:': 'Por qué:', 'Practise all of it in the free app': 'Practica todo en la app gratuita',
       'Your answers are saved to your profile, the app builds your day-by-day study plan up to the exam and brings back your weak points until you master them.': 'Tus respuestas quedan guardadas en tu perfil, la app crea tu plan de estudio día a día hasta el examen y te vuelve a proponer tus puntos débiles hasta que los domines.',
       'Start free – build my plan': 'Empieza gratis – crear mi plan', 'Try the free Bordeaux module': 'Prueba el módulo Burdeos gratis', 'Frequently asked questions': 'Preguntas frecuentes', 'More WSET Level 3 resources': 'Más recursos para el WSET 3',
       'WSET Level 3 practice questions by region and topic': 'Preguntas WSET nivel 3 por región y tema',
       'Pick a region or topic of the WSET Level 3 Award in Wines syllabus to see sample questions with answers and explanations. Every page links to the full set in the free app.': 'Elige una región o un tema del temario del WSET Level 3 Award in Wines para ver preguntas de ejemplo con respuestas y explicaciones. Cada página enlaza con la serie completa en la app gratuita.'}
NAME = {v: TOP[k][1] for k, v in []}
EN_NAMES = {}

def tr_text(t, topic):
    u = html.unescape(t); s = u.strip()
    if not s: return t
    lead_ws, trail_ws = u[:len(u) - len(u.lstrip())], u[len(u.rstrip()):]
    out = None
    if s in FIX: out = FIX[s]
    elif s in GROUPS: out = GROUPS[s]
    elif s in EN_NAMES: out = EN_NAMES[s]
    elif s in M: out = M[s]
    else:
        m = re.fullmatch(r'(\d+) questions', s)
        if m: out = f'{m.group(1)} preguntas'
        m = m or None
    if out is None and topic:
        T = topic
        pats = [(rf'WSET Level 3 {re.escape(T[0])}: practice questions with answers', f'WSET nivel 3 {T[1]}: preguntas de examen con respuestas'),
                (rf'These are real questions from The Wine Goat bank on {re.escape(T[0])}, written to the WSET Level 3 Award in Wines syllabus\. Answer them, read the explanation, then practise the full set of (\d+) questions in the free app, where your mistakes come back until you know them\.',
                 f'Son preguntas reales del banco de The Wine Goat sobre {T[1]}, escritas según el temario del WSET Level 3 Award in Wines. Respóndelas, lee la explicación y practica la serie completa de \\1 preguntas en la app gratuita, donde tus errores vuelven hasta que los domines.'),
                (r'(\d+) questions on this topic in the app', r'\1 preguntas sobre este tema en la app'),
                (rf'How many questions on {re.escape(T[0])} are in The Wine Goat\?', f'¿Cuántas preguntas sobre {T[1]} tiene The Wine Goat?'),
                (rf'The app has (\d+) multiple-choice questions on {re.escape(T[0])}, each with an explanation, plus short written answer questions and flashcards on the same topic\.', f'La app tiene \\1 preguntas tipo test sobre {T[1]}, cada una con su explicación, además de preguntas de respuesta corta y flashcards sobre el mismo tema.'),
                (rf'Is {re.escape(T[0])} important for the WSET Level 3 exam\?', f'¿Es importante {T[1]} en el examen WSET nivel 3?'),
                (rf'Yes\. The 50 multiple-choice questions cover the whole syllabus and the 4 short written answers often focus on one region or process, so every topic, including {re.escape(T[0])}, can come up\.', f'Sí. Las 50 preguntas tipo test cubren todo el temario y las 4 preguntas de respuesta corta suelen centrarse en una región o un proceso, así que cualquier tema, también {T[1]}, puede salir.')]
        for a, b in pats:
            if re.fullmatch(a, s): out = re.sub(a, b, s); break
    if out is None:
        return None
    return lead_ws + html.escape(out, quote=False) + trail_ws

def head_parts():
    s = open('es/como-aprobar-wset-3/index.html', encoding='utf8').read()
    header = s[s.find('</head>') + 7:s.find('<main>')]
    footer = s[s.find('<footer'):s.find('</footer>') + 9]
    tail = s[s.find('</footer>') + 9:]
    return header, footer, tail

def alt_links(urls):
    return ''.join(f'<link rel="alternate" hreflang="{l}" href="{SITE}{u}">' for l, u in urls.items()) + f'<link rel="alternate" hreflang="x-default" href="{SITE}{urls["en"]}">'

def build(en_path, es_url, topic, title, desc, kw):
    s = open(en_path, encoding='utf8').read()
    hl = dict(re.findall(r'hreflang="(en|it|fr)" href="https://thewinegoat.com([^"]*)"', s)); hl['es'] = es_url
    main = s[s.find('<main>'):s.find('</main>') + 7]
    missing = []
    def sub(m):
        r = tr_text(m.group(1), topic)
        if r is None: missing.append(m.group(1)); return m.group(0)
        return '>' + r + '<'
    main = re.sub(r'>([^<>]+)<', sub, main)
    def href(m):
        h = m.group(1)
        if h == HUB_EN: return f'href="{HUB_ES}"'
        mm = re.fullmatch(r'/wset-3-questions/([a-z-]+)/', h)
        if mm and mm.group(1) in TOP: return f'href="/es/preguntas-wset-3/{TOP[mm.group(1)][0]}/"'
        if h in REL: return f'href="{REL[h][0]}"'
        if h.startswith('/app/'): return f'href="/app/?lang=es{h[5:] if h[5:].startswith("#") else ""}"'
        return m.group(0)
    main = re.sub(r'href="([^"]+)"', href, main)
    for en_u, (es_u, es_t) in REL.items():
        main = re.sub(rf'(<a href="{re.escape(es_u)}">)[^<]*(</a>)', lambda m: m.group(1) + html.escape(es_t, quote=False) + m.group(2), main)
    ld = re.search(r'<script type="application/ld\+json">(.*?)</script>', s, re.S).group(1)
    try:
        J = json.loads(ld)
        def walk(o):
            if isinstance(o, dict):
                for k, v in list(o.items()):
                    if isinstance(v, str) and k in ('name', 'text', 'description', 'headline'):
                        r = tr_text(html.escape(v, quote=False), topic); o[k] = html.unescape(r).strip() if r else v
                    elif isinstance(v, str) and k in ('@id', 'url', 'item'):
                        o[k] = v.replace(SITE + en_path.replace('index.html', '').rstrip('/') + '/', SITE + es_url) if v.startswith(SITE + '/' + os.path.dirname(en_path)) else v
                    elif k == 'inLanguage': o[k] = 'es'
                    else: walk(v)
            elif isinstance(o, list):
                for x in o: walk(x)
        walk(J); ld = json.dumps(J, ensure_ascii=False)
    except Exception:
        ld = ''
    header, footer, tail = head_parts()
    header = re.sub(r'<nav class="seolangs".*?</nav>', '<nav class="seolangs" aria-label="Language">' + ''.join(f'<a href="{hl[l]}" hreflang="{l}" lang="{l}">{n}</a>' for l, n in [('en', 'English'), ('it', 'Italiano'), ('fr', 'Français'), ('es', 'Español')]) + '</nav>', header, flags=re.S)
    e = lambda x: html.escape(x)
    doc = f'''<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<meta name="keywords" content="{e(kw)}">
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large">
<link rel="canonical" href="{SITE}{es_url}">{alt_links(hl)}
<meta property="og:type" content="article"><meta property="og:site_name" content="The Wine Goat"><meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(desc)}"><meta property="og:url" content="{SITE}{es_url}"><meta property="og:image" content="{SITE}/img/og-es.png"><meta property="og:locale" content="es_ES">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" href="/img/favicon-48.png" type="image/png" sizes="48x48"><link rel="icon" href="/img/favicon-192.png" type="image/png" sizes="192x192"><link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
<link rel="stylesheet" href="/assets/site.css"><link rel="stylesheet" href="/assets/seo.css">
{f'<script type="application/ld+json">{ld}</script>' if ld else ''}
</head>{header}{main}{footer}{tail}'''
    out = es_url.strip('/') + '/index.html'
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, 'w', encoding='utf8').write(doc)
    # add hreflang es to en/it/fr versions
    for l in ('en', 'it', 'fr'):
        p = hl[l].strip('/') + '/index.html'
        t = open(p, encoding='utf8').read()
        if 'hreflang="es"' not in t:
            t = t.replace('<link rel="alternate" hreflang="x-default"', f'<link rel="alternate" hreflang="es" href="{SITE}{es_url}"><link rel="alternate" hreflang="x-default"', 1)
            t = re.sub(r'(<nav class="seolangs"[^>]*>.*?)(</nav>)', lambda m: m.group(1) + f'<a href="{es_url}" hreflang="es" lang="es">Español</a>' + m.group(2) if 'hreflang="es"' not in m.group(1) else m.group(0), t, count=1, flags=re.S)
            open(p, 'w', encoding='utf8').write(t)
    return hl, missing

# English topic names (as written on the EN pages) → Spanish
for en_slug, (es_slug, es_name) in TOP.items():
    s = open(f'wset-3-questions/{en_slug}/index.html', encoding='utf8').read()
    nm = re.search(r'<li aria-current="page">([^<]+)</li>', s).group(1)
    EN_NAMES[html.unescape(nm)] = es_name

urls = {}
allmiss = []
for en_slug, (es_slug, es_name) in TOP.items():
    en_name = [k for k, v in EN_NAMES.items() if v == es_name][0]
    es_url = f'/es/preguntas-wset-3/{es_slug}/'
    hl, miss = build(f'wset-3-questions/{en_slug}/index.html', es_url, (en_name, es_name),
          f'WSET 3 {es_name}: preguntas y respuestas de examen | The Wine Goat'.replace(' | The Wine Goat', '') if len(f'WSET 3 {es_name}: preguntas y respuestas de examen | The Wine Goat') > 66 else f'WSET 3 {es_name}: preguntas y respuestas de examen | The Wine Goat',
          f'Preguntas gratuitas de WSET nivel 3 sobre {es_name} con respuestas y explicaciones, y muchas más en la app: test, respuestas cortas, flashcards y simulacros.',
          f'WSET 3 {es_name}, WSET nivel 3 {es_name}, preguntas WSET {es_name}, examen WSET 3 {es_name}, test {es_name} vino')
    urls[es_url] = hl; allmiss += miss
hl, miss = build('wset-3-questions-by-region/index.html', HUB_ES, None, 'Preguntas WSET 3 por región y tema | The Wine Goat',
      'Preguntas de ejemplo del WSET nivel 3 por región y tema (Burdeos, Rioja, Jerez, Champagne, cata SAT…) con respuestas y explicaciones. Gratis.',
      'preguntas WSET 3 por región, preguntas WSET nivel 3 por tema, examen WSET 3 regiones, test WSET 3 gratis')
urls[HUB_ES] = hl; allmiss += miss

# sitemap
sm = open('sitemap.xml', encoding='utf8').read(); add = ''
for u, hl in urls.items():
    if f'<loc>{SITE}{u}</loc>' in sm: continue
    alts = ''.join(f'<xhtml:link rel="alternate" hreflang="{l}" href="{SITE}{x}"/>' for l, x in hl.items())
    add += f'<url><loc>{SITE}{u}</loc><lastmod>2026-11-15</lastmod><changefreq>monthly</changefreq><priority>0.7</priority>{alts}</url>\n'
sm = sm.replace('</urlset>', add + '</urlset>'); open('sitemap.xml', 'w', encoding='utf8').write(sm)
print(len(urls), 'es pages; untranslated text nodes:', len(allmiss))
for x in sorted(set(allmiss))[:40]: print('  ', repr(x[:100]))
