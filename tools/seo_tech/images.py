# -*- coding: utf-8 -*-
"""Image SEO for the static site (idempotent post-processor). Run from the repo root:

    python3 tools/seo_tech/images.py            # everything: files, pages, JSON-LD, image sitemap, robots, photos meta, inventory
    python3 tools/seo_tech/images.py --pages    # files + pages + image sitemap only (what the builders call after a rebuild)

What it does
- Files: descriptive copies of the goat illustrations and app screenshots (img/goats/<descriptive>.webp, originals kept,
  never overwritten), small -sm variants (goats 180 px for the ornaments, infographics 600 px) for srcset.
- Pages (every indexable index.html + 404.html, not app/ tools/ social/): <img> src → descriptive name; alt in the page
  language from tools/seo_tech/image_registry.json (ornament goats alt=""); guide infographic alts without the keyword
  list; width/height = intrinsic ratio; hero image (guide infographic / home app screenshot) eager + fetchpriority=high,
  everything below the header loading=lazy decoding=async; srcset/sizes where an -sm exists; one ImageObject JSON-LD
  (<script id="twg-image-ld">) for the hero with creator/credit/copyright (own images only).
- sitemap-images.xml (+ Sitemap line in robots.txt), img/photos/meta.json (when img/photos/photos.json exists),
  tools/seo_tech/image_inventory.xlsx + .csv (20 fields of the image SEO rules + licensing + flags).
Hooked into tools/site_i18n/build.py (sync step), tools/seo_core/build.py and tools/seo_sp/build.py."""
import os, re, sys, json, glob, html, shutil, csv, datetime
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.chdir(ROOT)
SITE = 'https://thewinegoat.com'
HERE = 'tools/seo_tech'
R = json.load(open(f'{HERE}/image_registry.json', encoding='utf8'))
LANGS = R['langs']
GOATS, SHOTS, COMMON = R['goats'], R['shots'], R['common']
ORN = set(R['ornament_classes'])
CJK = {'ja', 'ko', 'zh-hans', 'zh-hant'}
SKIP = ('app/', 'mobile/', 'tools/', 'node_modules/', '.git/', 'img/', 'assets/', 'social/', 'supabase/')
GOAT_SM_W, INFO_SM_W = 180, 720
ORN_SIZES = '84px'
INFO_SIZES = '(max-width: 940px) calc(100vw - 40px), 860px'
OWN = {'@id': SITE + '/#organization'}   # the site-wide Organization node (tools/geo/sitewide.py)
INFO_SRC_P = f'{HERE}/infographic_alt_src.json'   # original English infographic alts (to restore translations, see restore_alt)
e = lambda s: s.replace('&', '&amp;').replace('"', '&quot;').replace('<', '&lt;').replace('>', '&gt;')


def page_lang(s):
    m = re.search(r'<html[^>]*\blang="([^"]+)"', s[:600])
    l = (m.group(1) if m else 'en').lower()
    if l == 'pt-pt': return 'pt'
    if l in LANGS: return l
    return l.split('-')[0] if l.split('-')[0] in LANGS else 'en'


def goat_meta(base):
    g = GOATS.get(base)
    if g and g.get('dup_of'): g = GOATS[g['dup_of']]
    return g if g and 'alt' in g else None


NEW2OLD = {m['new']: k for k, m in GOATS.items() if m.get('new')}
SHOT_NEW2OLD = {m['new']: k for k, m in SHOTS.items() if isinstance(m, dict) and m.get('new')}
INFO_REN = R.get('infographics', {})          # generic infographic names -> descriptive copies
INFO_NEW2OLD = {v: k for k, v in INFO_REN.items()}
STOP = {'ja': '。', 'zh-hans': '。', 'zh-hant': '。', 'th': ' '}


# ------------------------------------------------------------------ files
_dims = {}
def dims(p):
    if p not in _dims:
        try:
            with Image.open(p) as im: _dims[p] = im.size
        except Exception: _dims[p] = None
    return _dims[p]


def sm_name(p): return p[:-5] + '-sm.webp'


def make_sm(src, width):
    dst = sm_name(src)
    if os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src): return dst
    with Image.open(src) as im:
        if im.size[0] <= width * 1.2: return None
        xmp = im.info.get('xmp')
        x = im.copy(); x.thumbnail((width, width * 4), Image.LANCZOS)
        kw = {'quality': 80, 'method': 6}
        if xmp: kw['xmp'] = xmp
        x.save(dst, 'WEBP', **kw)
    _dims.pop(dst, None)
    return dst


def ensure_files():
    made = 0
    for old, m in GOATS.items():
        if not m.get('new'): continue
        src, dst = f'img/goats/{old}', f'img/goats/{m["new"]}'
        if os.path.exists(src) and not os.path.exists(dst): shutil.copy2(src, dst); made += 1
        if os.path.exists(dst): make_sm(dst, GOAT_SM_W)
    for old, m in SHOTS.items():
        if old.startswith('_') or not m.get('new'): continue
        src, dst = f'img/shots/{old}', f'img/shots/{m["new"]}'
        if os.path.exists(src) and not os.path.exists(dst): shutil.copy2(src, dst); made += 1
    for old, new in INFO_REN.items():
        src, dst = f'img/guides/{old}', f'img/guides/{new}'
        if os.path.exists(src) and not os.path.exists(dst): shutil.copy2(src, dst); made += 1
    for p in glob.glob('img/guides/*.webp'):
        if not p.endswith('-sm.webp'): make_sm(p, INFO_SM_W)
    return made


# ------------------------------------------------------------------ infographic alts
def load_info_src():
    try: return json.load(open(INFO_SRC_P, encoding='utf8'))
    except Exception: return {}


INFO_SRC = load_info_src()
_trans = {}
def translations(lang):
    """English segment -> translation, from every tools/site_i18n/<lang>/*.json (read only)."""
    if lang in _trans: return _trans[lang]
    d = {}
    for f in glob.glob(f'tools/site_i18n/{lang}/*.json'):
        try:
            T = json.load(open(f, encoding='utf8')); g = os.path.basename(f)[:-5]
            sp = f'tools/site_i18n/src/{g}.json'; S = json.load(open(sp, encoding='utf8'))
            if T.get('src_sha') and S.get('sha') != T['src_sha']:
                op = f'tools/site_i18n/src/_old/{g}.{T["src_sha"]}.json'
                if os.path.exists(op): S = json.load(open(op, encoding='utf8'))
            for s, t in zip(S['segments'], T['segments']):
                if isinstance(s, dict) and isinstance(t, str): d[s['t']] = t
        except Exception: pass
    _trans[lang] = d
    return d


def clean_info_alt(alt, lang):
    """'Title – keyword, keyword (infographic)' -> 'Title (infographic with the key points)' in the page language."""
    info = COMMON['infographic'].get(lang, COMMON['infographic']['en'])
    if alt.endswith(info + ')') or alt.endswith(info + '）'): return alt
    m = re.search(r'\s?[–—]\s', alt)
    head = alt[:m.start()] if m else alt
    head = re.sub(r'\s*[(（][^()（）]*[)）]\s*$', '', head).rstrip(' …').strip()
    if not head: return alt
    return f'{head}（{info}）' if lang in CJK else f'{head} ({info})'


# ------------------------------------------------------------------ <img> rewriting
ATTR = re.compile(r'([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*("[^"]*"|\'[^\']*\'|[^\s"\'>]+))?')


def parse(tag):
    inner = tag[4:-1].rstrip('/').strip()
    out = []
    for m in ATTR.finditer(inner):
        v = m.group(2)
        if v is not None and v[:1] in '"\'': v = v[1:-1]
        out.append([m.group(1), v])
    return out


def build(attrs):
    return '<img ' + ' '.join(n if v is None else f'{n}="{v}"' for n, v in attrs) + '>'


def getv(attrs, n):
    for k, v in attrs:
        if k.lower() == n: return v
    return None


def setv(attrs, n, v):
    for a in attrs:
        if a[0].lower() == n: a[1] = v; return
    attrs.append([n, v])


def delv(attrs, n):
    attrs[:] = [a for a in attrs if a[0].lower() != n]


def fs_path(src, page):
    src = html.unescape(src).split('?')[0].split('#')[0]
    if src.startswith(SITE + '/'): return src[len(SITE) + 1:]
    if src.startswith(('http:', 'https:', 'data:', '//')): return None
    if src.startswith('/'): return src[1:]
    return os.path.normpath(os.path.join(os.path.dirname(page), src))


def classify(p):
    """(kind, registry meta) for a file path"""
    base, d = os.path.basename(p), os.path.dirname(p)
    if d == 'img/goats':
        if base in GOATS: return 'goat', goat_meta(base)
        if base in NEW2OLD: return 'goat', goat_meta(NEW2OLD[base])
        if base[:-8] + '.webp' in NEW2OLD and base.endswith('-sm.webp'): return 'goat', goat_meta(NEW2OLD[base[:-8] + '.webp'])
        return 'goat', None
    if d == 'img/goats/x': return 'deco', None
    if d == 'img/shots' and (base in SHOTS or base in SHOT_NEW2OLD): return 'shot', SHOTS['_meta']
    if d == 'img/shots': return 'shot', None
    if d == 'img/guides': return 'info', None
    if d == 'img/photos': return 'photo', None
    if d == 'img/screens': return 'screen', None
    if base in ('logo-emblem.webp', 'wordmark.webp', 'wordmark-light.webp', 'logo.png', 'logo-full.webp'): return 'logo', None
    return 'other', None


USAGE = {}   # (path, lang) -> {'pages': [...], 'alts': set(), 'roles': set(), 'title': str, 'caption': str}
PAGEIMG = {}  # page -> [(abs url, title, caption, kind)]
ALTS_EN_INFO = {}


def note(p, lang, page, alt, role, title='', caption=''):
    u = USAGE.setdefault((p, lang), {'pages': [], 'alts': set(), 'roles': set(), 'title': '', 'caption': ''})
    u['pages'].append(page); u['alts'].add(alt); u['roles'].add(role)
    if title and not u['title']: u['title'] = title
    if caption and not u['caption']: u['caption'] = caption


def page_url(page, s):
    m = re.search(r'<link[^>]+rel="canonical"[^>]+href="([^"]+)"', s)
    if m: return m.group(1)
    d = os.path.dirname(page)
    return SITE + '/' + (d + '/' if d else '')


def process_page(page, text=None):
    """rewrites the page on disk; with text= it processes that HTML instead and returns the result (nothing written)"""
    s0 = text if text is not None else open(page, encoding='utf8').read()
    lang = page_lang(s0)
    noindex = bool(re.search(r'<meta[^>]+name=["\']robots["\'][^>]+content=["\'][^"\']*noindex', s0[:s0.find('</head>')], re.I))
    hdr_end = s0.find('</header>')
    is_home = bool(re.fullmatch(r'(?:[a-z]{2}(?:-[a-z]{2,4})?/)?index\.html', page)) and not noindex
    # split out <script>/<template>/<noscript>: <img> strings in scripts are not touched
    parts = re.split(r'(<script\b.*?</script\s*>|<template\b.*?</template\s*>|<noscript\b.*?</noscript\s*>)', s0, flags=re.S | re.I)
    pos = 0; hero_done = False; hero = None; imgs = []
    for i, part in enumerate(parts):
        if i % 2 == 1: pos += len(part); continue
        def rep(m):
            nonlocal hero_done, hero
            tag = m.group(0); at = parse(tag); start = pos + m.start()
            src = getv(at, 'src')
            if not src: return tag
            p = fs_path(src, page)
            if not p: return tag
            kind, meta = classify(p)
            cls = set((getv(at, 'class') or '').split())
            role = 'content'
            # descriptive file names (originals stay on disk)
            base = os.path.basename(p)
            new = None
            if kind == 'goat' and base in GOATS and meta and meta.get('new'): new = meta['new']
            elif kind == 'shot' and base in SHOTS: new = SHOTS[base]['new']
            elif kind == 'info' and base in INFO_REN: new = INFO_REN[base]
            if new:
                src = src[:len(src) - len(src.split('/')[-1])] + new
                p = os.path.join(os.path.dirname(p), new); setv(at, 'src', src)
            if not os.path.exists(p): return build(at) if new else tag
            # alt
            alt = html.unescape(getv(at, 'alt') or '')
            title = ''
            if kind == 'goat':
                if cls & ORN: role, alt = 'ornament', ''
                elif meta:
                    alt = meta['alt'].get(lang) or meta['alt']['en']; title = meta['title'].get(lang) or meta['title']['en']
            elif kind == 'deco': role, alt = 'ornament', ''
            elif kind == 'shot' and meta:
                alt = meta['alt'].get(lang) or meta['alt']['en']; title = meta['title'].get(lang) or meta['title']['en']
            elif kind == 'info':
                if lang == 'en' and re.search(r'\s[–—]\s', alt): INFO_SRC.setdefault(base, alt)
                if lang not in ('en', 'it', 'fr', 'es', 'es-ar') and base in INFO_SRC:
                    en_clean = clean_info_alt(INFO_SRC[base], 'en')[:-1].rsplit(' (', 1)[0]
                    if alt.startswith(en_clean) or alt == INFO_SRC[base]:   # the build fell back to English: restore the translation
                        t = translations(lang).get(INFO_SRC[base])
                        if t: alt = t
                alt = clean_info_alt(alt, lang)
                title = html.unescape(getv(at, 'title') or '')
            elif kind == 'logo': role = 'logo'
            if getv(at, 'alt') is None or (getv(at, 'alt') != e(alt) and html.unescape(getv(at, 'alt')) != alt) or "&#x27;" in (getv(at, 'alt') or ''):
                setv(at, 'alt', e(alt))
            # width/height from the intrinsic size (keeps the CSS-chosen width, fixes the ratio)
            wh = dims(p)
            if wh:
                w, h = wh
                W, H = getv(at, 'width'), getv(at, 'height')
                if not (W and W.isdigit() and H and H.isdigit()):
                    setv(at, 'width', str(w)); setv(at, 'height', str(h))
                else:
                    W, H = int(W), int(H)
                    if H and abs(W / H - w / h) > 0.02 * (w / h): setv(at, 'height', str(round(W * h / w)))
            # loading: header images eager; first infographic / app screenshot = hero (LCP); everything else lazy
            in_header = hdr_end != -1 and start < hdr_end
            is_hero = not hero_done and kind in ('info', 'shot') and not in_header
            if is_hero:
                hero_done = True; hero = (p, at, kind, alt, title)
                delv(at, 'loading'); setv(at, 'fetchpriority', 'high'); setv(at, 'decoding', 'async')
            elif not in_header:
                if getv(at, 'fetchpriority') == 'high': delv(at, 'fetchpriority')
                setv(at, 'loading', 'lazy'); setv(at, 'decoding', 'async')
            # srcset where a smaller version exists
            sm = sm_name(p)
            if kind == 'goat' and role == 'ornament' and os.path.exists(sm) and wh:
                pre = src[:len(src) - len(src.split('/')[-1])]
                setv(at, 'srcset', f'{pre}{os.path.basename(sm)} {dims(sm)[0]}w, {src} {wh[0]}w'); setv(at, 'sizes', ORN_SIZES)
            elif kind == 'info' and os.path.exists(sm) and wh:
                pre = src[:len(src) - len(src.split('/')[-1])]
                setv(at, 'srcset', f'{pre}{os.path.basename(sm)} {dims(sm)[0]}w, {src} {wh[0]}w'); setv(at, 'sizes', INFO_SIZES)
            # usage record (inventory / image sitemap)
            cap = ''
            if kind == 'info':
                fm = re.search(r'<figcaption>(.*?)</figcaption>', s0[start:start + len(tag) + 2000], re.S)
                if fm: cap = html.unescape(re.sub(r'<[^>]+>', '', fm.group(1))).strip()
            if not noindex:
                note(p, lang, page, alt, role, title, cap)
                imgs.append((p, title, cap or alt, kind, role, alt))
            out = build(at)
            return tag if parse(out) == parse(tag) else out
        parts[i] = re.sub(r'<img\b[^>]*>', rep, part, flags=re.I)
        pos += len(part)
    s = ''.join(parts)
    # one ImageObject for the hero image (own images: creator/credit/copyright are known)
    s = re.sub(r'<script type="application/ld\+json" id="twg-image-ld">.*?</script>', '', s, flags=re.S)
    if hero and not noindex:
        p, at, kind, alt, title = hero
        w, h = dims(p); url = SITE + '/' + p
        cap = next((c for q, t, c, k, r, a in imgs if q == p), '')
        ld = {'@context': 'https://schema.org', '@type': 'ImageObject', 'contentUrl': url, 'url': url,
              'name': title or alt, 'description': alt, 'width': w, 'height': h, 'encodingFormat': 'image/webp', 'inLanguage': lang,
              'representativeOfPage': True, 'creator': OWN, 'creditText': 'The Wine Goat', 'copyrightHolder': OWN,
              'copyrightNotice': '© The Wine Goat'}
        if cap and cap != alt: ld['caption'] = cap
        sm = sm_name(p)
        if os.path.exists(sm): ld['thumbnailUrl'] = SITE + '/' + sm
        blk = '<script type="application/ld+json" id="twg-image-ld">' + json.dumps(ld, ensure_ascii=False) + '</script>'
        s = s.replace('</head>', blk + '</head>', 1)
    if not noindex:
        head = s[:s.find('</head>')]
        refs = set(re.findall(r'(?:content|href)="((?:https://thewinegoat\.com)?/?(?:\.\./)*(?:img/[^"]+|favicon\.ico))"', head))
        refs |= set(re.findall(r'"(https://thewinegoat\.com/img/[^"]+)"', head))
        for r in refs:
            q = fs_path(r, page)
            if q and os.path.exists(q) and ((q, lang) not in USAGE or USAGE[(q, lang)]['roles'] == {'meta (og:image / icon / logo)'}): note(q, lang, page, '', 'meta (og:image / icon / logo)')
        url = page_url(page, s)
        keep = [(q, t, c, k) for q, t, c, k, r, a in imgs if (hero and q == hero[0]) or (is_home and k == 'goat' and r == 'content')]
        seen = set(); PAGEIMG[url] = [x for x in keep if not (x[0] in seen or seen.add(x[0]))]
    if text is not None: return s
    if s != s0:
        open(page, 'w', encoding='utf8').write(s)
        return 1
    return 0


def all_pages():
    ps = sorted(p for p in glob.glob('**/index.html', recursive=True) if not p.startswith(SKIP))
    if os.path.exists('404.html'): ps.append('404.html')
    return ps


# ------------------------------------------------------------------ image sitemap + robots
def write_sitemap():
    out = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">']
    n = 0
    for url in sorted(PAGEIMG):
        ims = PAGEIMG[url]
        if not ims or not url.startswith(SITE + '/'): continue
        out.append(f'<url><loc>{e(url)}</loc>')
        for p, title, cap, kind in ims:
            out.append(f'<image:image><image:loc>{e(SITE + "/" + p)}</image:loc>' + (f'<image:title>{e(title)}</image:title>' if title else '')
                       + (f'<image:caption>{e(cap)}</image:caption>' if cap else '') + '</image:image>')
            n += 1
        out.append('</url>')
    out.append('</urlset>')
    open('sitemap-images.xml', 'w', encoding='utf8').write('\n'.join(out) + '\n')
    rb = open('robots.txt', encoding='utf8').read()
    line = f'Sitemap: {SITE}/sitemap-images.xml'
    if line not in rb:
        rb = rb.replace(f'Sitemap: {SITE}/sitemap.xml', f'Sitemap: {SITE}/sitemap.xml\n{line}', 1) if f'Sitemap: {SITE}/sitemap.xml' in rb else rb.rstrip('\n') + '\n' + line + '\n'
        open('robots.txt', 'w', encoding='utf8').write(rb)
    return sum(1 for u in PAGEIMG.values() if u), n


# ------------------------------------------------------------------ deco.js: width/height for the injected goats
def deco_dims():
    P = 'assets/deco.js'
    if not os.path.exists(P): return 0
    s = open(P, encoding='utf8').read()
    wh = {}
    for f in sorted(glob.glob('img/goats/x/e*.webp')):
        n = int(re.search(r'e(\d+)\.webp', f).group(1)); wh[n] = dims(f)
    table = 'const WH = {' + ','.join(f'{n}:[{w},{h}]' for n, (w, h) in wh.items()) + '};  /* intrinsic sizes (tools/seo_tech/images.py) */'
    new_img = 'const IMG = n => `<img src="${X(n)}" alt=""${WH[n] ? ` width="${WH[n][0]}" height="${WH[n][1]}"` : ""} loading="lazy" decoding="async">`;'
    s2 = re.sub(r'[ \t]*const WH = \{[^\n]*\};[^\n]*\n', '', s)
    s2 = re.sub(r'  const IMG = n => `[^\n]*`;\n', '  ' + table + '\n  ' + new_img + '\n', s2, count=1)
    if s2 != s: open(P, 'w', encoding='utf8').write(s2); return 1
    return 0


# ------------------------------------------------------------------ free photos (Commons + stock): metadata for later use
PHOTO_NOISE = r'\b(photography|photo|landscape photography|aerial photography|close up|golden hour|documentary|high resolution|traditional|modern|detail|stock|image)\b'
STOCK_LIC = {'pixabay': 'Pixabay Content License', 'pexels': 'Pexels License', 'unsplash': 'Unsplash License'}


def _photo(r, commons):
    if commons:
        t = re.sub(r'^File:', '', r.get('title', '')).rsplit('.', 1)[0]
        t = re.sub(r'[_]+', ' ', t); t = re.sub(r'\s*\(\d+\)$|\s+-\s+\d+$|\s+\d{3,}$', '', t).strip()
    else:
        t = ''
    d = re.sub(r'\s+', ' ', r.get('description', '') or '').strip()
    topic = re.sub(r'\s+', ' ', re.sub(PHOTO_NOISE, '', r.get('query', ''), flags=re.I)).strip()
    tags = not commons and r.get('source') == 'pixabay'          # Pixabay "description" is a tag list, not a sentence
    first = '' if tags else (re.split(r'(?<=[.!?])\s', d)[0] if d else '')
    ok = first and sum(c.isascii() for c in first) > .9 * len(first) and 12 <= len(first) <= 160
    if not t: t = (first.rstrip('.') if ok else topic or r.get('category', 'wine')).strip()
    t = t[:1].upper() + t[1:]
    alt = first.rstrip('.') if ok else t
    if len(alt) > 125: alt = alt[:122].rsplit(' ', 1)[0] + '…'
    lic = r.get('licence', '') or STOCK_LIC.get(r.get('source', ''), '')
    pd = bool(re.search(r'cc0|public domain|\bpd\b', lic, re.I)); stock = not commons
    via = 'Wikimedia Commons' if commons else r.get('source', '').capitalize()
    credit = f'Photo: {r.get("author") or "Unknown author"}' + (f', {lic}' if commons else '') + f', via {via}'
    where = f'Wikimedia Commons titled "{t}"' if commons else f'{via}'
    desc = (d if ok else f'Photograph from {where}') + f' (search: "{r.get("query", "")}", category: {r.get("category", "")}).'
    if tags and d: desc += f' Tags: {d}.'
    if len(desc.split()) > 80: desc = ' '.join(desc.split()[:80]) + '…'
    f = r.get('file'); fs = r.get('file_sm')
    return {
        'id': r.get('id'), 'provider': 'wikimedia-commons' if commons else r.get('source'),
        'file': f'img/photos/{f}' if f else None, 'file_sm': f'img/photos/{fs}' if fs else None, 'remote_url': r.get('url') if not f else None,
        'width': r.get('w'), 'height': r.get('h'),
        'alt': alt, 'title': t, 'caption': f'{t}. {credit}.', 'description': desc,
        'keywords': {'primary': topic or r.get('category', ''), 'secondary': [x for x in dict.fromkeys([r.get('category', ''), t.lower()]) if x],
                     'longtail': (f'{topic}: {t}' if topic and topic.lower() not in t.lower() else t), 'semantic': [x for x in ['wine', r.get('category', '')] if x]},
        'source': r.get('source') if commons else r.get('page'), 'author': r.get('author'), 'author_url': r.get('author_url'),
        'licence': lic, 'licence_url': r.get('licence_url'),
        'attribution_required': (not pd) if commons else False, 'commercial_use': True, 'modification': True,
        'share_alike': bool(re.search(r'by-sa', lic, re.I)), 'credit': credit,
        'review': 'alt/title/description derived only from the provider metadata (title/description/search); check the photo visually before placing it on a page'}


def photo_meta():
    out = []
    for pj, commons in (('img/photos/photos.json', True), ('img/photos/stock.json', False)):
        if os.path.exists(pj):
            try: out += [_photo(r, commons) for r in json.load(open(pj, encoding='utf8'))]
            except Exception as x: print('photos:', pj, x)
    if not out and not os.path.exists('img/photos/photos.json'): return None
    json.dump(out, open('img/photos/meta.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    return len(out)


# ------------------------------------------------------------------ inventory (xlsx + csv)
GENERIC = re.compile(r'^(ig-[a-z]\d+|e\d{3}|img[_-]?\d+|photo\d*|image\d*|dsc\d+|[a-z]+|[a-z]+-(en|fr|it|es)|og-[a-z]{2}|favicon.*|apple-touch-icon)$')
BRAND_FILES = {'logo-emblem', 'wordmark', 'wordmark-light', 'logo', 'logo-full', 'email-logo', 'favicon', 'apple-touch-icon', 'favicon-48', 'favicon-96', 'favicon-192'}
FIELDS = ['Original filename', 'Optimized filename', 'Image URL', 'Image source', 'Copyright owner', 'License', 'ALT text', 'Image title', 'Caption',
          'Description', 'Primary keyword', 'Secondary keywords', 'Long-tail keyword', 'Semantic keywords', 'Image format', 'Image dimensions',
          'File size (KB)', 'Associated page URL', 'Language', 'Optimization status',
          'Pages using it (same language)', 'Role', 'Author / creator', 'Attribution required', 'Commercial use', 'Modification allowed', 'Licence URL', 'Flags']


def inventory():
    PH = {}
    if os.path.exists('img/photos/meta.json'):
        for r in json.load(open('img/photos/meta.json', encoding='utf8')):
            if r.get('file'): PH[r['file']] = r
    files = sorted(set(glob.glob('img/**/*.*', recursive=True) + ['favicon.ico']))
    files = [f for f in files if f.lower().endswith(('.webp', '.png', '.jpg', '.jpeg', '.svg', '.gif', '.avif', '.ico'))]
    alt_owner = {}
    for (p, l), u in USAGE.items():
        for a in u['alts']:
            if a: alt_owner.setdefault((l, a), set()).add(os.path.basename(p).replace('-sm.webp', '.webp'))
    rows = []
    sm_set = {f for f in files if f.endswith('-sm.webp')}
    for f in files:
        if f in sm_set and f[:-8] + '.webp' in files: continue      # responsive variant of another file
        base, d = os.path.basename(f), os.path.dirname(f)
        if (d == 'img/goats' and base in NEW2OLD) or (d == 'img/shots' and base in SHOT_NEW2OLD) or (d == 'img/guides' and base in INFO_NEW2OLD): continue   # reported on the original's row
        stem, ext = os.path.splitext(base)
        kind, meta = classify(f)
        size = os.path.getsize(f) // 1024; wh = dims(f) if not f.endswith('.svg') else None
        orig, opt = base, base
        if kind == 'goat':
            if base in GOATS: opt = (GOATS[base].get('new') or base)
            elif base in NEW2OLD: orig = NEW2OLD[base]
        if kind == 'info' and base in INFO_REN: opt = INFO_REN[base]
        if kind == 'shot':
            if base in SHOTS: opt = SHOTS[base]['new']
            elif base in SHOT_NEW2OLD: orig = SHOT_NEW2OLD[base]
        # licensing
        if kind == 'photo':
            r = PH.get(f) or PH.get(f.replace('-sm.webp', '.webp'), {})
            src, owner, lic, author = r.get('source', 'Wikimedia Commons'), r.get('author', ''), r.get('licence', ''), r.get('author', '')
            attr = 'Yes' if r.get('attribution_required', True) else 'No (appreciated)'
            com, mod, licu = 'Yes', ('Yes (share-alike)' if r.get('share_alike') else 'Yes'), r.get('licence_url', '')
        else:
            what = {'goat': 'Original brand illustration (owner)', 'deco': 'Original brand illustration (owner)', 'info': 'Infographic generated by the site (tools/seo2)',
                    'shot': 'Screenshot of The Wine Goat app', 'screen': 'Screenshot of The Wine Goat app', 'logo': 'Brand logo (owner)'}.get(kind, 'Site asset (owner)')
            src, owner, lic, author = what, 'The Wine Goat', 'All rights reserved (owner\'s own work)', 'The Wine Goat'
            attr, com, mod, licu = 'n/a (own work)', 'Yes (owner)', 'Yes (owner)', ''
        used = [(l, u) for (p, l), u in USAGE.items() if p == f or (opt != base and p == os.path.join(d, opt))]
        if kind == 'deco': used = [('all', {'pages': [], 'alts': {''}, 'roles': {'ornament'}, 'title': '', 'caption': ''})]
        if not used: used = [('—', None)]
        for l, u in sorted(used, key=lambda x: (LANGS.index(x[0]) if x[0] in LANGS else 99)):
            role = ', '.join(sorted(u['roles'])) if u else ''
            alt = (sorted(u['alts'], key=len)[-1] if u and u['alts'] else '')
            title, cap = (u['title'], u['caption']) if u else ('', '')
            desc, kw = '', {}
            lg = l if l in LANGS else 'en'
            if kind == 'goat' and meta:
                desc = meta.get('desc', '') + ' ' + COMMON['illus_sentence'][lg] if lg == 'en' else ((meta['alt'].get(lg) or meta['alt']['en']) + STOP.get(lg, '. ') + COMMON['illus_sentence'][lg])
                kw = dict(meta.get('kw', {}))
                if lg != 'en': kw['secondary'] = [kw.get('primary', '')] + list(kw.get('secondary', [])); kw['primary'] = COMMON['kw_goat'][lg]
                if not title: title = meta['title'].get(lg) or meta['title']['en']
                if not u: alt = meta['alt']['en']
            elif kind == 'shot' and meta:
                desc = meta['desc'] if lg == 'en' else meta['alt'].get(lg, meta['alt']['en'])
                kw = dict(meta['kw']);
                if lg != 'en': kw['primary'] = COMMON['kw_app'][lg]
                if not title: title = meta['title'].get(lg) or meta['title']['en']
            elif kind == 'info':
                desc = (cap + ' ' if cap else '') + f'Infographic (1200×630) with the page title, three key points, keyword chips and a goat illustration from The Wine Goat.'
                kw = {'primary': title.split(':')[0] if title else '', 'secondary': [], 'longtail': title, 'semantic': ['WSET', 'wine study']}
            elif kind == 'photo':
                r = PH.get(f, {})
                alt, title, cap, desc, kw = r.get('alt', ''), r.get('title', ''), r.get('caption', ''), r.get('description', ''), r.get('keywords', {})
            elif kind == 'deco':
                desc = 'Small goat illustration from the brand set, placed by assets/deco.js as a page decoration (alt="", aria-hidden).'
            elif kind == 'logo':
                desc = 'The Wine Goat logo / wordmark (brand rule: the dancing goat with cape appears only as the logo).'
            flags = []
            if u and role not in ('ornament', 'logo') and not role.startswith('meta') and not alt: flags.append('missing ALT')
            if u and alt and kind != 'logo' and len(alt_owner.get((l, alt), ())) > 1: flags.append('duplicate ALT (other image, same language)')
            if GENERIC.match(os.path.splitext(opt)[0]) and os.path.splitext(opt)[0] not in BRAND_FILES and kind != 'deco': flags.append('generic filename')
            if kind == 'deco' and GENERIC.match(stem): flags.append('generic filename (decorative, kept: loaded by deco.js)')
            lim = 100 if kind in ('goat', 'deco') or 'favicon' in base or 'icon' in base else 200
            if size > lim: flags.append(f'oversized ({size} KB > {lim} KB)')
            if not owner: flags.append('missing copyright')
            if not lic or (kind == 'photo' and not licu and 'public domain' not in lic.lower()): flags.append('missing/incomplete licence')
            if kind == 'goat' and base in GOATS and GOATS[base].get('dup_of'): flags.append(f'duplicate artwork of {GOATS[base]["dup_of"]}')
            if kind == 'goat' and base == 'hero.webp': flags.append('logo goat (same file as logo-emblem.webp): logo only')
            if kind == 'goat' and u and lg != 'en' and meta and lg not in meta['alt'] and role == 'content': flags.append('ALT not localized')
            if kind == 'photo': flags.append('not placed yet (relevance to be checked per page)')
            if u is None and kind not in ('photo',): flags.append('not used on site pages')
            status = ('Prepared (meta.json, not placed)' if kind == 'photo' else
                      'Not used on pages' if u is None else
                      'Decorative (deco.js): alt="", width/height, lazy' if kind == 'deco' else
                      'Decorative: alt="", width/height, lazy' + (', srcset' if kind == 'goat' else '') if role in ('ornament',) else
                      'Optimized: descriptive URL, localized ALT, width/height, lazy/LCP, srcset' if kind in ('goat', 'shot') and opt != base or kind == 'shot' else
                      'Optimized: ALT cleaned, width/height, LCP priority, srcset, ImageObject' if kind == 'info' else
                      'Checked: ALT, width/height')
            pages = u['pages'] if u else []
            purl = page_url(pages[0], open(pages[0], encoding='utf8').read()) if pages else ('(every page: injected by assets/deco.js)' if kind == 'deco' else '')
            url = SITE + '/' + (os.path.join(d, opt) if opt != base and kind in ('goat', 'shot') else f)
            sec = kw.get('secondary', []); sem = kw.get('semantic', [])
            rows.append([orig, opt, url, src, owner, lic, alt, title, cap, desc.strip(), kw.get('primary', ''),
                         ', '.join(sec) if isinstance(sec, list) else sec, kw.get('longtail', ''), ', '.join(x for x in sem if x) if isinstance(sem, list) else sem,
                         ext.lstrip('.').upper(), f'{wh[0]}×{wh[1]}' if wh else '', size, purl, l, status,
                         len(pages), role or kind, author, attr, com, mod, licu, '; '.join(flags)])
    with open(f'{HERE}/image_inventory.csv', 'w', encoding='utf8', newline='') as fh:
        w = csv.writer(fh); w.writerow(FIELDS); w.writerows(rows)
    try:
        from openpyxl import Workbook
        from openpyxl.styles import Font, PatternFill, Alignment
        from openpyxl.utils import get_column_letter
    except ImportError:
        print('openpyxl not installed: CSV only'); return rows
    wb = Workbook(); ws = wb.active; ws.title = 'Images'
    ws.append(FIELDS)
    for r in rows: ws.append(r)
    hf = PatternFill('solid', fgColor='7A1F3D')
    for c in ws[1]: c.font = Font(bold=True, color='FFFFFF'); c.fill = hf; c.alignment = Alignment(wrap_text=True, vertical='top')
    widths = [22, 30, 40, 26, 16, 22, 50, 32, 40, 60, 26, 30, 36, 30, 8, 12, 9, 40, 8, 34, 9, 12, 20, 14, 12, 14, 30, 50]
    for i, wd in enumerate(widths, 1): ws.column_dimensions[get_column_letter(i)].width = wd
    ws.freeze_panes = 'C2'; ws.auto_filter.ref = ws.dimensions
    fl = PatternFill('solid', fgColor='FBE3E8')
    for row in ws.iter_rows(min_row=2):
        if row[-1].value and any(k in row[-1].value for k in ('missing ALT', 'duplicate ALT', 'oversized', 'missing copyright', 'missing/incomplete')):
            row[-1].fill = fl
    # summary sheet
    s2 = wb.create_sheet('Summary')
    from collections import Counter
    fc = Counter(); kc = Counter()
    for r in rows:
        for x in (r[-1].split('; ') if r[-1] else []): fc[re.sub(r' \(\d+ KB > \d+ KB\)', '', x)] += 1
        kc[r[21]] += 1
    s2.append(['Generated', datetime.date.today().isoformat()]); s2.append(['Rows (image × page language)', len(rows)])
    s2.append(['Distinct image files', len({r[0] for r in rows})]); s2.append([])
    s2.append(['Role', 'Rows']); [s2.append([k, v]) for k, v in kc.most_common()]; s2.append([])
    s2.append(['Flag', 'Rows']); [s2.append([k, v]) for k, v in fc.most_common()]
    s2.column_dimensions['A'].width = 60
    wb.save(f'{HERE}/image_inventory.xlsx')
    return rows


# ------------------------------------------------------------------ main
def main():
    full = '--pages' not in sys.argv
    made = ensure_files()
    n = sum(process_page(p) for p in all_pages())
    json.dump(dict(sorted(INFO_SRC.items())), open(INFO_SRC_P, 'w', encoding='utf8'), ensure_ascii=False, indent=0)
    pg, ni = write_sitemap()
    msg = f'images: {made} new files, {n} pages updated, sitemap-images.xml: {ni} images on {pg} pages'
    if full:
        deco_dims()
        k = photo_meta()
        msg += f'; photos meta: {k if k is not None else "img/photos/photos.json not present yet"}'
        rows = inventory()
        msg += f'; inventory: {len(rows)} rows'
    print(msg)


if __name__ == '__main__':
    main()
