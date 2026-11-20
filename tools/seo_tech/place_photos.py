# -*- coding: utf-8 -*-
"""Places the free photos of img/photos/ on the site and in the app (idempotent post-processor). Run from the repo root:

    python3 tools/seo_tech/place_photos.py            # pages + credits pages + sitemap block + app/photos.js data
    python3 tools/seo_tech/place_photos.py --check    # change nothing, exit 1 if something would change

Inputs
- tools/photos/placement.json: page group -> [[photo stem, h2 index]] (site) and the app mapping (see its _doc).
- img/photos/meta.json (author, licence, source, size, English title/alt/caption) and img/photos/meta_i18n.json
  ({stem: {lang: {"alt", "caption"[, "title"]}}} for the 18 other site languages; es-ar is derived from es).
What it does
1. Every language version of each group in placement.json (wine guides: tools/site_i18n/slugs.json, core pages:
   tools/seo_core/slugs.json, spirits pages: tools/seo_sp/slugs.json): removes the previous <figure class="seophoto">
   and inserts 1-3 figures after the first paragraph that follows the n-th <h2> of the article: <picture> with the
   600 px file on phones, srcset/sizes, width/height, loading=lazy, alt + figcaption (caption only) in the page language.
   No visible credit line (owner's rule): the credit lives in structured data, one <script id="twg-photo-ld"> per page
   with an ImageObject for every placed photo (contentUrl, creator, creditText, copyrightNotice, license = licence URL,
   acquireLicensePage = the photo's entry on the photo-credits page of the language), and on the credits pages, which
   list every placed photo with author, licence and source link (that page is the CC BY / BY-SA attribution) and are
   linked from the footer of every page.
2. Credits pages /photo-credits/ (+ it, fr, es) listing every photo used on the site or in the app, and the
   <!--photo-credits--> block of sitemap.xml.
3. The data block of app/photos.js (photos, localized alt/caption, Level 3 country summaries and lesson rules).
Hooked into tools/site_i18n/build.py (sync step), tools/seo_core/build.py, tools/seo_sp/build.py and tools/geo/pages.py,
before tools/seo_tech/images.py (which then lists the placed photos in sitemap-images.xml and the inventory)."""
import os, re, sys, json, html

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.chdir(ROOT)
sys.path.insert(0, 'tools/site_i18n'); sys.path.insert(0, 'tools/geo')
SITE = 'https://thewinegoat.com'
DATE = '2026-11-20'
LANGS = ['en', 'it', 'fr', 'es', 'es-ar', 'de', 'nl', 'pl', 'pt', 'pt-br', 'ru', 'el', 'ja', 'ko', 'zh-hans', 'zh-hant', 'ar', 'th', 'tr']
HREF = {'zh-hans': 'zh-Hans', 'zh-hant': 'zh-Hant', 'es-ar': 'es-AR', 'pt-br': 'pt-BR'}
CJK = {'ja', 'ko', 'zh-hans', 'zh-hant'}
PL = json.load(open('tools/photos/placement.json', encoding='utf8'))
META = {m['file'].split('/')[-1][:-5]: m for m in json.load(open('img/photos/meta.json', encoding='utf8')) if m.get('file')}
I18N_P = 'img/photos/meta_i18n.json'
I18N = json.load(open(I18N_P, encoding='utf8')) if os.path.exists(I18N_P) else {}
SLUGS = {'guide': json.load(open('tools/site_i18n/slugs.json', encoding='utf8')),
         'core': json.load(open('tools/seo_core/slugs.json', encoding='utf8')),
         'sp': json.load(open('tools/seo_sp/slugs.json', encoding='utf8'))}
MAX_PER_PAGE, MIN_H2 = 3, 1
SIZES = '(max-width: 940px) calc(100vw - 40px), 860px'
e = lambda s: s.replace('&', '&amp;').replace('"', '&quot;').replace('<', '&lt;').replace('>', '&gt;')   # same escaping as images.py
CHECK = '--check' in sys.argv
CHANGED = []

# ------------------------------------------------------------------ localized strings
PHOTO = {'en': 'Photo', 'it': 'Foto', 'fr': 'Photo', 'es': 'Foto', 'es-ar': 'Foto', 'de': 'Foto', 'nl': 'Foto', 'pl': 'Fot.', 'pt': 'Foto', 'pt-br': 'Foto',
         'ru': 'Фото', 'el': 'Φωτογραφία', 'ja': '写真', 'ko': '사진', 'zh-hans': '图片', 'zh-hant': '圖片', 'ar': 'صورة', 'th': 'ภาพ', 'tr': 'Fotoğraf'}
CREDITS = {'en': '/photo-credits/', 'it': '/it/crediti-fotografici/', 'fr': '/fr/credits-photos/', 'es': '/es/creditos-fotograficos/'}
CREDITS_LABEL = {'en': 'Photo credits', 'it': 'Crediti fotografici', 'fr': 'Crédits photos', 'es': 'Créditos fotográficos', 'es-ar': 'Créditos fotográficos',
                 'de': 'Bildnachweise', 'nl': 'Fotoverantwoording', 'pl': 'Źródła zdjęć', 'pt': 'Créditos fotográficos', 'pt-br': 'Créditos das fotos',
                 'ru': 'Авторы фотографий', 'el': 'Πηγές φωτογραφιών', 'ja': '写真のクレジット', 'ko': '사진 출처', 'zh-hans': '图片来源', 'zh-hant': '圖片來源',
                 'ar': 'حقوق الصور', 'th': 'เครดิตภาพ', 'tr': 'Fotoğraf künyesi'}
LN = {'en': 'English', 'it': 'Italiano', 'fr': 'Français', 'es': 'Español'}
ABOUT = {'en': 'about/index.html', 'it': 'it/chi-siamo/index.html', 'fr': 'fr/a-propos/index.html', 'es': 'es/sobre-nosotros/index.html'}
CP = {  # credits page texts
 'en': {'title': 'Photo credits: vineyard and winery photos | The Wine Goat', 'home': 'Home', 'h1': 'Photo credits',
        'desc': 'Authors, licences and sources of the vineyard, grape, cellar and spirits photos used on The Wine Goat guides and in the app, all under free licences.',
        'intro': ['The illustrations of goats are our own. The vineyard, grape, cellar and spirits photos that illustrate our guides and some app lessons are free photographs from Wikimedia Commons, used under the licences chosen by their authors. Thank you to every photographer listed here.',
                  'Each photo is credited next to the place where it appears. Our copies have been resized and converted to the WebP format; nothing else has been changed. You may reuse a photo under its own licence: follow the source link for the original file and the full licence terms.'],
        'n': '{n} photos', 'by': 'Author', 'lic': 'Licence', 'src': 'Source', 'orig': 'original file on Wikimedia Commons', 'used': 'Used on', 'app': 'The Wine Goat app (lessons)'},
 'it': {'title': 'Crediti fotografici: foto di vigneti e cantine | The Wine Goat', 'home': 'Home', 'h1': 'Crediti fotografici',
        'desc': 'Autori, licenze e fonti delle foto di vigneti, uve, cantine e distillati usate nelle guide e nell’app di The Wine Goat, tutte con licenze libere.',
        'intro': ['Le illustrazioni delle capre sono nostre. Le foto di vigneti, uve, cantine e distillati che illustrano le guide e alcune lezioni dell’app sono fotografie libere di Wikimedia Commons, usate secondo le licenze scelte dai loro autori. Grazie a ogni fotografo elencato qui.',
                  'Ogni foto è accreditata accanto al punto in cui compare. Le nostre copie sono state ridimensionate e convertite nel formato WebP, senza altre modifiche. Puoi riutilizzare una foto alle condizioni della sua licenza: il link alla fonte porta al file originale e al testo completo della licenza.'],
        'n': '{n} foto', 'by': 'Autore', 'lic': 'Licenza', 'src': 'Fonte', 'orig': 'file originale su Wikimedia Commons', 'used': 'Usata in', 'app': 'App The Wine Goat (lezioni)'},
 'fr': {'title': 'Crédits photos : vignobles et chais | The Wine Goat', 'home': 'Accueil', 'h1': 'Crédits photos',
        'desc': 'Auteurs, licences et sources des photos de vignobles, raisins, chais et spiritueux utilisées dans les guides et l’appli The Wine Goat, toutes sous licence libre.',
        'intro': ['Les illustrations de chèvres sont les nôtres. Les photos de vignobles, de raisins, de chais et de spiritueux qui illustrent nos guides et certaines leçons de l’appli sont des photographies libres de Wikimedia Commons, utilisées selon les licences choisies par leurs auteurs. Merci à chaque photographe cité ici.',
                  'Chaque photo est créditée à l’endroit où elle apparaît. Nos copies ont été redimensionnées et converties au format WebP, sans autre modification. Vous pouvez réutiliser une photo selon sa propre licence : le lien vers la source mène au fichier original et au texte complet de la licence.'],
        'n': '{n} photos', 'by': 'Auteur', 'lic': 'Licence', 'src': 'Source', 'orig': 'fichier original sur Wikimedia Commons', 'used': 'Utilisée sur', 'app': 'Appli The Wine Goat (leçons)'},
 'es': {'title': 'Créditos fotográficos: viñedos y bodegas | The Wine Goat', 'home': 'Inicio', 'h1': 'Créditos fotográficos',
        'desc': 'Autores, licencias y fuentes de las fotos de viñedos, uvas, bodegas y destilados usadas en las guías y la app de The Wine Goat, todas con licencias libres.',
        'intro': ['Las ilustraciones de cabras son nuestras. Las fotos de viñedos, uvas, bodegas y destilados que ilustran nuestras guías y algunas lecciones de la app son fotografías libres de Wikimedia Commons, usadas según las licencias elegidas por sus autores. Gracias a cada fotógrafo de esta lista.',
                  'Cada foto lleva su crédito junto al lugar donde aparece. Nuestras copias se han redimensionado y convertido al formato WebP, sin ningún otro cambio. Puedes reutilizar una foto según su propia licencia: el enlace a la fuente lleva al archivo original y al texto completo de la licencia.'],
        'n': '{n} fotos', 'by': 'Autor', 'lic': 'Licencia', 'src': 'Fuente', 'orig': 'archivo original en Wikimedia Commons', 'used': 'Usada en', 'app': 'App The Wine Goat (lecciones)'},
}


def loc(stem, lang, key):
    """alt / caption / title of a photo in a language (English from meta.json as the fallback)"""
    d = I18N.get(stem, {})
    for l in ([lang, 'es'] if lang == 'es-ar' else [lang, 'pt'] if lang == 'pt-br' else [lang]):
        v = d.get(l, {}).get(key)
        if v: return v
    return META[stem][key]


def wrote(path, s):
    old = open(path, encoding='utf8').read() if os.path.exists(path) else None
    if old == s: return 0
    CHANGED.append(path)
    if not CHECK:
        os.makedirs(os.path.dirname(path) or '.', exist_ok=True)
        open(path, 'w', encoding='utf8').write(s)
    return 1


def fs(url): return url.lstrip('/') + 'index.html'


# ------------------------------------------------------------------ figures on the pages
def credits_url(lang):
    return SITE + CREDITS.get(lang, CREDITS['es'] if lang.startswith('es') else CREDITS['en'])


def figure(stem, lang):
    m = META[stem]; f = f'/img/photos/{stem}'
    return (f'<figure class="seophoto" data-photo="{stem}"><picture><source media="(max-width: 640px)" srcset="{f}-sm.webp" width="{m["width_sm"]}" height="{m["height_sm"]}">'
            f'<img src="{f}.webp" alt="{e(loc(stem, lang, "alt"))}" width="{m["width"]}" height="{m["height"]}" loading="lazy" decoding="async" '
            f'srcset="{f}-sm.webp {m["width_sm"]}w, {f}.webp {m["width"]}w" sizes="{SIZES}"></picture>'
            f'<figcaption><span class="ph-cap">{e(loc(stem, lang, "caption"))}</span></figcaption></figure>')


def image_obj(stem, lang):
    m = META[stem]; u = f'{SITE}/img/photos/{stem}.webp'; a = m.get('author') or 'Unknown'
    return {'@type': 'ImageObject', 'contentUrl': u, 'url': u, 'name': loc(stem, lang, 'title') if lang in ('en', 'it', 'fr', 'es', 'es-ar') or I18N.get(stem, {}).get(lang, {}).get('title') else loc(stem, lang, 'alt'),
            'caption': loc(stem, lang, 'caption'), 'description': loc(stem, lang, 'alt'), 'width': m['width'], 'height': m['height'],
            'encodingFormat': 'image/webp', 'inLanguage': HREF.get(lang, lang), 'thumbnailUrl': f'{SITE}/img/photos/{stem}-sm.webp',
            'creator': {'@type': 'Person', 'name': a}, 'creditText': f'{a} / {m.get("licence")} / Wikimedia Commons',
            'copyrightNotice': f'{a}, {m.get("licence")}', 'license': m.get('licence_url') or m.get('source'), 'acquireLicensePage': f'{credits_url(lang)}#{stem}',
            'isBasedOn': m.get('source')}


def image_ld(stems, lang):
    """one script per page: an ImageObject for every placed photo (credit, licence and credits page as structured data)"""
    objs = [image_obj(s, lang) for s in stems]
    ld = dict({'@context': 'https://schema.org'}, **objs[0]) if len(objs) == 1 else {'@context': 'https://schema.org', '@graph': objs}
    return '<script type="application/ld+json" id="twg-photo-ld">' + json.dumps(ld, ensure_ascii=False) + '</script>'


FIG_RE = re.compile(r'<figure class="seophoto"[^>]*>.*?</figure>', re.S)
LD_RE = re.compile(r'<script type="application/ld\+json" id="twg-photo-ld">.*?</script>', re.S)


def place(path, lang, items, page_url):
    s0 = open(path, encoding='utf8').read()
    s = LD_RE.sub('', FIG_RE.sub('', s0))
    a = s.find('<article'); b = s.find('</main>')
    if a < 0 or b < 0: return 0, [f'{path}: no <article>/<main>']
    h2 = [m.end() for m in re.finditer(r'<h2\b[^>]*>.*?</h2>', s[a:b], re.S)]
    ins, warn = [], []
    for stem, k in items[:MAX_PER_PAGE]:
        if stem not in META: warn.append(f'{path}: unknown photo {stem}'); continue
        if k < MIN_H2: warn.append(f'{path}: h2 {k} is above the fold'); continue
        if k >= len(h2): warn.append(f'{path}: only {len(h2)} h2, {stem} skipped'); continue
        pos = a + h2[k]
        mp = re.match(r'\s*<p\b', s[pos:])
        if mp:
            end = s.find('</p>', pos)
            if end > 0: pos = end + 4
        ins.append((pos, figure(stem, lang)))
    for pos, f in sorted(ins, reverse=True): s = s[:pos] + f + s[pos:]
    if ins:
        stems = [re.search(r'data-photo="([^"]+)"', f).group(1) for _, f in sorted(ins)]
        own = '<script type="application/ld+json" id="twg-image-ld">'   # images.py keeps its hero ImageObject last in <head>
        at = own if own in s else '</head>'
        s = s.replace(at, image_ld(stems, lang) + at, 1)
    return wrote(path, s), warn


def site():
    used, n, warn = {}, 0, []
    for key, items in PL['site'].items():
        pipe, g = key.split(':', 1)
        for lang, url in SLUGS[pipe][g].items():
            p = fs(url)
            if not os.path.exists(p): continue
            c, w = place(p, lang, items, SITE + url); n += c; warn += w
            for stem, _ in items[:MAX_PER_PAGE]:
                used.setdefault(stem, {}).setdefault(lang, []).append(url)
    return used, n, warn


# ------------------------------------------------------------------ credits pages
def credits_pages(used):
    app = {s for s in PL['app']['l3_schemi'].values()} | {r[2] for rules in PL['app']['lessons'].values() for r in rules}
    stems = sorted(set(used) | app, key=lambda s: (META[s].get('country') or '', loc(s, 'en', 'title')))
    sw = None
    try:
        import sitewide as sw   # same footer / JSON-LD post-processing as every page (keeps this script idempotent)
        G = sw.git_dates()
    except Exception as x:
        print('place_photos: sitewide not applied:', x)
    alts = ''.join(f'<link rel="alternate" hreflang="{l}" href="{SITE}{u}">' for l, u in CREDITS.items()) + f'<link rel="alternate" hreflang="x-default" href="{SITE}{CREDITS["en"]}">'
    n = 0
    for lang, url in CREDITS.items():
        T = CP[lang]; tpl = open(ABOUT[lang], encoding='utf8').read()
        head_tail = tpl[tpl.find('<link rel="icon"'):tpl.find('<script type="application/ld+json">')]
        hdr = tpl[tpl.find('<body'):tpl.find('<main')]
        nav = ''.join(f'<a href="{u}" hreflang="{l}" lang="{l}"' + (' aria-current="true"' if l == lang else '') + f'>{LN[l]}</a>' for l, u in CREDITS.items())
        hdr = re.sub(r'(<nav class="seolangs"[^>]*>).*?(</nav>)', lambda m: m.group(1) + nav + m.group(2), hdr, count=1, flags=re.S)
        foot = tpl[tpl.find('</main>') + 7:]
        home = '/' if lang == 'en' else f'/{lang}/'
        cards = []
        for s in stems:
            m = META[s]
            pages = used.get(s, {}).get(lang) or used.get(s, {}).get('en') or []
            links = []
            for u in sorted(set(pages)):
                p = fs(u); t = u
                if os.path.exists(p):
                    h = re.search(r'<h1[^>]*>(.*?)</h1>', open(p, encoding='utf8').read(), re.S)
                    if h: t = html.unescape(re.sub(r'<[^>]+>', '', h.group(1))).strip()
                links.append(f'<a href="{u}">{e(t)}</a>')
            if s in app: links.append(e(T['app']))
            lic = f'<a href="{e(m["licence_url"])}" rel="noopener license">{e(m["licence"])}</a>' if m.get('licence_url') else e(m['licence'])
            who = f'<a href="{e(m["author_url"])}" rel="noopener">{e(m["author"])}</a>' if m.get('author_url') else e(m['author'])
            cards.append(f'<li class="pc-i" id="{s}"><img class="pc-th" src="/img/photos/{s}-sm.webp" alt="{e(loc(s, lang, "alt"))}" width="{m["width_sm"]}" height="{m["height_sm"]}" loading="lazy" decoding="async">'
                         f'<div class="pc-tx"><h2>{e(loc(s, lang, "title"))}</h2><dl><dt>{T["by"]}</dt><dd>{who}</dd><dt>{T["lic"]}</dt><dd>{lic}</dd>'
                         f'<dt>{T["src"]}</dt><dd><a href="{e(m["source"])}" rel="noopener">{T["orig"]}</a></dd><dt>{T["used"]}</dt><dd>{" · ".join(links)}</dd></dl></div></li>')
        ld = {'@context': 'https://schema.org', '@graph': [
            {'@type': 'WebPage', '@id': f'{SITE}{url}#webpage', 'url': SITE + url, 'name': T['title'], 'headline': T['h1'], 'description': T['desc'], 'inLanguage': lang,
             'datePublished': DATE, 'dateModified': DATE, 'breadcrumb': {'@id': f'{SITE}{url}#breadcrumb'}},
            {'@type': 'BreadcrumbList', '@id': f'{SITE}{url}#breadcrumb', 'itemListElement': [
                {'@type': 'ListItem', 'position': 1, 'name': T['home'], 'item': SITE + home}, {'@type': 'ListItem', 'position': 2, 'name': T['h1'], 'item': SITE + url}]}]}
        doc = (f'<!DOCTYPE html>\n<html lang="{lang}">\n<head>\n<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">\n'
               f'<title>{e(T["title"])}</title>\n<meta name="description" content="{e(T["desc"])}">\n<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large">\n'
               f'<link rel="canonical" href="{SITE}{url}">{alts}\n'
               f'<meta property="og:type" content="website"><meta property="og:site_name" content="The Wine Goat"><meta property="og:title" content="{e(T["title"])}"><meta property="og:description" content="{e(T["desc"])}">'
               f'<meta property="og:url" content="{SITE}{url}"><meta property="og:locale" content="{lang}"><meta property="og:image" content="{SITE}/img/og-{lang}.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">\n'
               f'{head_tail}<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>\n</head>\n'
               f'{hdr}<main><nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="{home}">{e(T["home"])}</a></li><li aria-current="page">{e(T["h1"])}</li></ol></nav>'
               f'<article class="wrap seo-a pcred"><h1>{e(T["h1"])}</h1>' + ''.join(('<p class="lead">' if i == 0 else '<p>') + e(p) + '</p>' for i, p in enumerate(T['intro']))
               + f'<p class="pc-n">{T["n"].format(n=len(stems))}</p><ul class="pc-list">{"".join(cards)}</ul></article></main>{foot}')
        if not os.path.exists(f'img/og-{lang}.png'): doc = doc.replace(f'/img/og-{lang}.png', '/img/og-en.png')
        p = fs(url)
        if sw:
            doc = sw.footer(doc, lang); doc, mod = sw.jsonld(doc, p, G); doc = sw.visible_date(doc, mod)
        n += wrote(p, doc)
    # sitemap block
    sm = open('sitemap.xml', encoding='utf8').read()
    sm2 = re.sub(r'<!--photo-credits-->.*?<!--/photo-credits-->\n?', '', sm, flags=re.S)
    xl = ''.join(f'<xhtml:link rel="alternate" hreflang="{l}" href="{SITE}{u}"/>' for l, u in CREDITS.items()) + f'<xhtml:link rel="alternate" hreflang="x-default" href="{SITE}{CREDITS["en"]}"/>'
    blk = ''.join(f'<url><loc>{SITE}{u}</loc><lastmod>{DATE}</lastmod><changefreq>monthly</changefreq><priority>0.3</priority>{xl}</url>\n' for u in CREDITS.values())
    sm2 = sm2.replace('</urlset>', '<!--photo-credits-->\n' + blk + '<!--/photo-credits-->\n</urlset>')
    n += wrote('sitemap.xml', sm2)
    return stems, n


# ------------------------------------------------------------------ app data
APP_LANGS = ['it', 'fr', 'en', 'es', 'es-ar', 'de', 'nl', 'el', 'ja', 'ko', 'zh-hant', 'pt', 'tr', 'th', 'ru', 'pl', 'zh-hans', 'ar', 'pt-br']


def app_data():
    A = PL['app']
    stems = sorted({s for s in A['l3_schemi'].values()} | {r[2] for rules in A['lessons'].values() for r in rules})
    P = {}
    for s in stems:
        m = META[s]
        P[s] = {'w': m['width'], 'h': m['height'], 'ws': m['width_sm'], 'hs': m['height_sm'], 'a': m.get('author'), 'au': m.get('author_url') or '',
                'l': m.get('licence'), 'lu': m.get('licence_url') or '', 's': m.get('source'),
                'alt': {l: loc(s, l, 'alt') for l in APP_LANGS}, 'cap': {l: loc(s, l, 'caption') for l in APP_LANGS}}
    data = {'P': P, 'S': A['l3_schemi'], 'R': A['lessons'], 'CR': {l: CREDITS.get(l, CREDITS['es'] if l.startswith('es') else CREDITS['en']) for l in APP_LANGS},
            'CL': {l: CREDITS_LABEL[l] for l in APP_LANGS}, 'PH': {l: PHOTO[l] for l in APP_LANGS}}
    p = 'app/photos.js'
    s = open(p, encoding='utf8').read()
    s2 = re.sub(r'/\*DATA\*/.*?/\*END\*/', lambda m: '/*DATA*/' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + '/*END*/', s, count=1, flags=re.S)
    return len(stems), wrote(p, s2)


def main():
    used, n, warn = site()
    stems, nc = credits_pages(used)
    na, ca = app_data()
    for w in warn: print('  !', w)
    miss = sorted({(s, l) for s in stems for l in LANGS if l not in ('en', 'es-ar') and not (I18N.get(s, {}).get(l, {}).get('alt') and I18N.get(s, {}).get(l, {}).get('caption'))})
    if miss: print(f'  ! {len(miss)} photo/language pairs without a translated alt/caption (English used), e.g. {miss[:4]}')
    if '--quiet' not in sys.argv or CHECK:
        print(f'place_photos: {len(used)} photos, {sum(len(v) for v in PL["site"].values())} placements in {len(PL["site"])} page groups, {n} pages {"would change" if CHECK else "updated"}; '
              f'credits: {len(stems)} photos, {nc} files; app: {na} photos{" (photos.js updated)" if ca else ""}')
    return 1 if CHECK and CHANGED else 0


if __name__ == '__main__':
    sys.exit(main())
