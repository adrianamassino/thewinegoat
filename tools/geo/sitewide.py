# -*- coding: utf-8 -*-
"""Site-wide GEO post-processing of every public HTML page (not app/, tools/, mobile/, supabase/). Idempotent.
Run from the repo root after any page generator:   python3 tools/geo/sitewide.py [--check] [--quiet]
1. Footer: adds a link to the About page (localized label; the page's own language when an About page exists in it,
   otherwise /about/ with hreflang="en"), in both footer templates (class="foot" and the homes' class="foot3"), and
   right after it a link to the photo credits page (/photo-credits/, it, fr, es; written by tools/seo_tech/place_photos.py).
2. JSON-LD: one Organization (@id https://thewinegoat.com/#organization) and one WebSite (@id …/#website) node per
   page, identical everywhere; every author/publisher/provider reference to The Wine Goat (inline objects, old
   …/#org, …/<lang>/#org, …/#site ids) points to them; Article / WebPage / CollectionPage nodes get isPartOf, author,
   publisher, image (og:image) and datePublished / dateModified taken from git history (first and last commit that
   touched the file, ignoring commits whose subject contains "[seo-meta]" = pure metadata/template passes like this one,
   and the commits listed in tools/geo/seo_meta_commits.txt).
   The visible "Updated YYYY-MM-DD" in the footer is aligned with dateModified.
--check: change nothing, exit 1 if a page would change (used by tools/seo_tech/audit.py-style checks)."""
import glob, json, os, re, subprocess, sys
SITE = 'https://thewinegoat.com'; ORG = SITE + '/#organization'; WEB = SITE + '/#website'
SKIP = ('app/', 'tools/', 'mobile/', 'supabase/', 'node_modules/', '.git/')
LANGS = ['it', 'fr', 'es', 'es-ar', 'de', 'nl', 'pl', 'pt', 'pt-br', 'ru', 'el', 'ja', 'ko', 'zh-hans', 'zh-hant', 'ar', 'th', 'tr']
SL = json.load(open('tools/geo/slugs.json', encoding='utf8'))['about']
LABEL = {'en': 'About', 'it': 'Chi siamo', 'fr': 'À propos', 'es': 'Sobre nosotros', 'es-ar': 'Sobre nosotros', 'de': 'Über uns', 'nl': 'Over ons',
         'pl': 'O nas', 'pt': 'Sobre nós', 'pt-br': 'Sobre nós', 'ru': 'О нас', 'el': 'Σχετικά με εμάς', 'ja': '私たちについて', 'ko': '소개',
         'zh-hans': '关于我们', 'zh-hant': '關於我們', 'ar': 'من نحن', 'th': 'เกี่ยวกับเรา', 'tr': 'Hakkımızda'}
PHOTOS = {'en': '/photo-credits/', 'it': '/it/crediti-fotografici/', 'fr': '/fr/credits-photos/', 'es': '/es/creditos-fotograficos/', 'es-ar': '/es/creditos-fotograficos/'}
PH_LABEL = {'en': 'Photo credits', 'it': 'Crediti fotografici', 'fr': 'Crédits photos', 'es': 'Créditos fotográficos', 'es-ar': 'Créditos fotográficos',
            'de': 'Bildnachweise', 'nl': 'Fotoverantwoording', 'pl': 'Źródła zdjęć', 'pt': 'Créditos fotográficos', 'pt-br': 'Créditos das fotos',
            'ru': 'Авторы фотографий', 'el': 'Πηγές φωτογραφιών', 'ja': '写真のクレジット', 'ko': '사진 출처', 'zh-hans': '图片来源', 'zh-hant': '圖片來源',
            'ar': 'حقوق الصور', 'th': 'เครดิตภาพ', 'tr': 'Fotoğraf künyesi'}
ORG_NODE = {"@type": "Organization", "@id": ORG, "name": "The Wine Goat", "url": SITE + "/",
            "logo": {"@type": "ImageObject", "@id": SITE + "/#logo", "url": SITE + "/img/logo.png", "width": 1655, "height": 848, "caption": "The Wine Goat"},
            "image": {"@id": SITE + "/#logo"}, "email": "hello@thewinegoat.com", "sameAs": ["https://www.instagram.com/the.winegoat/"],
            "description": "Independent exam-preparation app for the WSET wine and spirits qualifications: lessons, practice questions with explanations, flashcards with spaced repetition, mock exams, interactive wine maps and a study planner. Not affiliated with the Wine & Spirit Education Trust."}
WEB_NODE = {"@type": "WebSite", "@id": WEB, "url": SITE + "/", "name": "The Wine Goat", "publisher": {"@id": ORG},
            "inLanguage": ["en", "it", "fr", "es", "es-AR", "de", "nl", "pl", "pt-PT", "pt-BR", "ru", "el", "ja", "ko", "zh-Hans", "zh-Hant", "ar", "th", "tr"]}
ORG_ID_RE = re.compile(r'^https://thewinegoat\.com(/[a-z-]+)?/#org(anization)?$')
SITE_ID_RE = re.compile(r'^https://thewinegoat\.com(/[a-z-]+)?/#(site|website)$')
PAGE_TYPES = {'Article', 'WebPage', 'CollectionPage', 'AboutPage', 'FAQPage'}
DATED = {'Article', 'WebPage', 'CollectionPage', 'AboutPage'}
# commits that only changed metadata/templates but were pushed without "[seo-meta]" in the subject (one hash per line, # comments ok)
META_COMMITS = 'tools/geo/seo_meta_commits.txt'


def git_dates():
    """{path: (first, last)} from git history, ignoring [seo-meta] commits."""
    out = subprocess.run(['git', 'log', '--format=@@%H%x09%cs%x09%s', '--name-only', '--no-renames'], capture_output=True, text=True).stdout
    meta = set(open(META_COMMITS).read().split()) if os.path.exists(META_COMMITS) else set()
    D = {}; date = None; skip = False
    for line in out.split('\n'):
        if line.startswith('@@'):
            h, date, subj = line[2:].split('\t', 2); skip = '[seo-meta]' in subj or h in meta or h[:7] in meta
        elif line.strip() and not skip:
            f, l = D.get(line, (date, date)); D[line] = (min(f, date), max(l, date))
    return D


def lang_of(p):
    seg = p.split('/')[0]
    return seg if seg in LANGS else 'en'


def footer(s, lang):
    href = SL.get(lang, SL['en']); hl = '' if lang in SL else ' hreflang="en"'
    a = f'<a class="fabout" href="{href}"{hl}>{LABEL[lang]}</a>'
    m = re.search(r'<footer class="foot">.*?</footer>', s, re.S)
    if m and 'class="fabout"' not in m.group(0):
        f = m.group(0)
        f2 = re.sub(r'(thewinegoat\.com</a>)', r'\1 · ' + a.replace('\\', '\\\\'), f, count=1)
        if f2 != f: s = s[:m.start()] + f2 + s[m.end():]
    m = re.search(r'<footer class="foot3">.*?</footer>', s, re.S)
    if m and 'class="fabout"' not in m.group(0):
        f = m.group(0)
        f2 = f.replace('<a class="fschool"', a + ' · <a class="fschool"', 1)
        if f2 != f: s = s[:m.start()] + f2 + s[m.end():]
    # photo credits link, right after the About link (only once the credits page exists)
    if os.path.exists('photo-credits/index.html'):
        ph = PHOTOS.get(lang, PHOTOS['en']); hl = '' if lang in ('en', 'it', 'fr', 'es') else (' hreflang="es"' if lang == 'es-ar' else ' hreflang="en"')
        b = f'<a class="fphotos" href="{ph}"{hl}>{PH_LABEL[lang]}</a>'
        for cls in ('foot', 'foot3'):
            m = re.search(rf'<footer class="{cls}">.*?</footer>', s, re.S)
            if m and 'class="fphotos"' not in m.group(0):
                f = m.group(0)
                f2 = re.sub(r'(<a class="fabout"[^>]*>[^<]*</a>)', lambda x: x.group(1) + ' · ' + b, f, count=1)
                if f2 != f: s = s[:m.start()] + f2 + s[m.end():]
    return s


def is_org(d):
    t = d.get('@type'); t = t if isinstance(t, list) else [t]
    return 'Organization' in t and (d.get('name') == 'The Wine Goat' or ORG_ID_RE.match(str(d.get('@id', ''))))


def refs(x, top=False):
    """rewrite references to the org / website inside a node"""
    if isinstance(x, list): return [refs(y) for y in x]
    if not isinstance(x, dict): return x
    if not top:
        if is_org(x) or ORG_ID_RE.match(str(x.get('@id', ''))) and len(x) == 1: return {"@id": ORG}
        if SITE_ID_RE.match(str(x.get('@id', ''))) and (len(x) == 1 or x.get('@type') == 'WebSite'): return {"@id": WEB}
    return {k: (refs(v) if k != '@context' else v) for k, v in x.items()}


def jsonld(s, path, G):
    blocks = list(re.finditer(r'<script type="application/ld\+json">(.*?)</script>', s, re.S))
    if not blocks: return s, None
    og = re.search(r'<meta property="og:image" content="([^"]+)"', s)
    dates = G.get(path)
    new = []; modified = None
    for i, m in enumerate(blocks):
        d = json.loads(m.group(1))
        ctx = d.get('@context', 'https://schema.org') if isinstance(d, dict) else 'https://schema.org'
        nodes = d.get('@graph', [d]) if isinstance(d, dict) else d
        out = []
        for n in nodes:
            if not isinstance(n, dict): out.append(n); continue
            n = {k: v for k, v in n.items() if k != '@context'}
            if is_org(n) or n.get('@type') == 'WebSite' and str(n.get('url', '')).rstrip('/') == SITE: continue  # replaced by the canonical nodes
            n = refs(n, top=True)
            t = n.get('@type'); ts = set(t if isinstance(t, list) else [t])
            if ts & DATED:
                if 'Article' in ts or ts & {'WebPage', 'AboutPage', 'CollectionPage'}:
                    n.setdefault('isPartOf', {"@id": WEB})
                    n.setdefault('author', {"@id": ORG}); n.setdefault('publisher', {"@id": ORG})
                    if og and 'image' not in n and 'primaryImageOfPage' not in n: n['image'] = og.group(1)
                if dates:
                    dp, dm = dates
                    old_p, old_m = n.get('datePublished'), n.get('dateModified')
                    n['datePublished'] = min(x for x in (dp, old_p) if x)[:10]
                    n['dateModified'] = max(x for x in (dm, old_m) if x)[:10]
                    if n['dateModified'] < n['datePublished']: n['dateModified'] = n['datePublished']
                if n.get('dateModified'): modified = max(modified or '', n['dateModified'])
            out.append(n)
        if i == 0: out += [ORG_NODE, WEB_NODE]
        new.append({"@context": ctx, "@graph": out} if len(out) != 1 else {"@context": ctx, **out[0]})
    res = []; last = 0
    for m, d in zip(blocks, new):
        res.append(s[last:m.start(1)]); res.append(json.dumps(d, ensure_ascii=False)); last = m.end(1)
    res.append(s[last:])
    return ''.join(res), modified


def visible_date(s, modified):
    if not modified: return s
    m = re.search(r'<footer class="foot">.*?</footer>', s, re.S)
    if not m: return s
    f = re.sub(r'(· [^·<]{1,40}? )(\d{4}-\d\d-\d\d)(</p>)', lambda x: x.group(1) + max(x.group(2), modified) + x.group(3), m.group(0))
    return s[:m.start()] + f + s[m.end():]


def pages():
    for p in sorted(glob.glob('**/*.html', recursive=True)):
        if not p.startswith(SKIP): yield p


def main():
    check = '--check' in sys.argv; quiet = '--quiet' in sys.argv
    G = git_dates(); changed = []
    for p in pages():
        s0 = open(p, encoding='utf8').read()
        s = footer(s0, lang_of(p))
        s, mod = jsonld(s, p, G)
        s = visible_date(s, mod)
        if s != s0:
            changed.append(p)
            if not check: open(p, 'w', encoding='utf8').write(s)
    if not quiet or check: print(f'sitewide: {len(changed)} page(s) {"would change" if check else "updated"}' + (': ' + ', '.join(changed[:8]) if check and changed else ''))
    return 1 if check and changed else 0


if __name__ == '__main__':
    sys.exit(main())
