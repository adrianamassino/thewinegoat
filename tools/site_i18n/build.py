# -*- coding: utf-8 -*-
"""Publish the wine guides (and the Thai/Turkish homes) in the other site languages from translated segments.

    python3 tools/site_i18n/build.py                 # every language that has translation files (+ es-ar)
    python3 tools/site_i18n/build.py de tr           # only these languages (the sync step below always runs)
    python3 tools/site_i18n/build.py de --group wset-level-2
    python3 tools/site_i18n/build.py de --check      # validate the translation files only, write nothing
    python3 tools/site_i18n/build.py --sync          # only the sync step
    options: --fallback home   links to a page not yet in that language go to the language home (default: the English page)
             --date YYYY-MM-DD footer/schema date of the new pages (default: today)

Input: tools/site_i18n/<lang>/<group>.json = {"group", "lang", "src_sha", "segments": [translations, same order/length as
src/<group>.json]}. es-ar needs no file: it is derived from the Spanish page with tools/i18n/ar_rules.py (voseo).
`_home` (Thai/Turkish only) builds /th/ and /tr/ from the English home.

Output: /<lang>/<localised slug>/index.html (slugs: tools/site_i18n/slugs.json) with <html lang/dir>, canonical,
hreflang and language switcher from the versions that exist, header/footer of that language, internal links remapped
to the same page in that language (when it exists), app links with ?lang= when the app speaks the language.
Sync step (every run): hreflang + language switchers of every guide version (en/it/fr/es included) and of every home,
sitemap.xml (blocks <!--guides-i18n--> and <!--homes-i18n-->, alternates of the existing guide/home entries), llms.txt.
Re-run it after tools/seo2/build.py or expand.py (they rewrite the en/it/fr/es guides with 4 languages only)."""
import os, sys, re, json, html, glob, datetime
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import common as C, seg
from es_ar_extra import es_ar  # tools/i18n/ar_rules.py (read-only) + extra guide forms

e = html.escape
SITE = C.SITE
SRC = f'{C.D}/src'
HOME_LANGS = ['th', 'tr']   # homes built by this pipeline (the other homes have their own builders)
MIN_SIZE = {'ja': 4800, 'zh-hans': 4200, 'zh-hant': 4200, 'ko': 5400, 'th': 12000}  # ≈ 3,000 English words, in characters


def arg(name, default=None):
    return sys.argv[sys.argv.index(name) + 1] if name in sys.argv else default


FALLBACK = arg('--fallback', 'en')
DATE = arg('--date', datetime.date.today().isoformat())
SL = C.load_slugs()


# ---------------------------------------------------------------- translation files
def load_src(g, sha=None):
    p = f'{SRC}/{g}.json'
    S = json.load(open(p, encoding='utf8'))
    if sha and S['sha'] != sha:
        old = f'{SRC}/_old/{g}.{sha}.json'
        if os.path.exists(old): return json.load(open(old, encoding='utf8')), True
        return S, False
    return S, True


PHT = re.compile(r'\{/?\d+\}')
VARS = re.compile(r'\{[a-z]\}')


def validate(l, g, S, T):
    """errors (block the page) and warnings for one translation file"""
    err, warn = [], []
    src = S['segments']; tr = T.get('segments')
    if not isinstance(tr, list): return ['"segments" must be a list'], warn
    if len(tr) != len(src): return [f'{len(tr)} segments, the source has {len(src)}'], warn
    same = 0
    for i, (s, t) in enumerate(zip(src, tr)):
        if not isinstance(t, str) or not t.strip(): err.append(f'#{i} empty'); continue
        if sorted(PHT.findall(s['t'])) != sorted(PHT.findall(t)): err.append(f'#{i} placeholders {PHT.findall(s["t"])} ≠ {PHT.findall(t)}')
        if sorted(VARS.findall(s['t'])) != sorted(VARS.findall(t)): err.append(f'#{i} variables {VARS.findall(s["t"])} ≠ {VARS.findall(t)}')
        if '<' in PHT.sub('', t) and re.search(r'<[a-z/]', t): warn.append(f'#{i} contains raw HTML (use the placeholders)')
        if 'WSET' in s['t'] and 'WSET' not in t: warn.append(f'#{i} "WSET" missing')
        if re.search(r'[€$£¥₺฿]', t) and not re.search(r'[€$£¥₺฿]', s['t']): warn.append(f'#{i} currency sign (no prices)')
        if len(s['t']) > 40 and t == s['t']: same += 1
        cjk = l in ('ja', 'ko', 'zh-hans', 'zh-hant')
        if s['k'] == 'title' and len(t) > 62: warn.append(f'#{i} title {len(t)} chars > 62')
        if s['k'] == 'desc' and i < 3:
            lo, hi = (70, 90) if cjk else (140, 158)
            if not lo - 20 <= len(t) <= hi + 2: warn.append(f'#{i} description {len(t)} chars (aim {lo}–{hi})')
    if same > len(src) * .1: warn.append(f'{same} long segments identical to English (untranslated?)')
    return err, warn


def jobs_for(l, only=None):
    """[(group, base page path, region, translate-function)]"""
    out = []
    for g, slugs in list(SL.items()) + [('_home', None)]:
        if only and g not in only: continue
        if g == '_home':
            if l not in HOME_LANGS: continue
            base, region = 'index.html', 'body'
        else:
            base, region = C.fs(slugs['es' if l == 'es-ar' else 'en']), 'main'
        if l == 'es-ar':
            if g == '_home': continue
            out.append((g, base, region, lambda t, k: es_ar(t), None)); continue
        p = f'{C.D}/{l}/{g}.json'
        if not os.path.exists(p): continue
        try: T = json.load(open(p, encoding='utf8'))
        except Exception as x: print(f'  ✗ {p}: invalid JSON ({x})'); continue
        if T.get('group', g) != g or T.get('lang', l) != l: print(f'  ✗ {p}: "group"/"lang" say {T.get("group")}/{T.get("lang")}'); continue
        S, ok = load_src(g, T.get('src_sha'))
        if not ok: print(f'  ✗ {p}: src_sha {T.get("src_sha")} unknown (the English page changed: re-translate against src/{g}.json)'); continue
        err, warn = validate(l, g, S, T)
        for w in warn[:8]: print(f'  ! {l}/{g}: {w}')
        if err:
            for x in err[:12]: print(f'  ✗ {l}/{g}: {x}')
            continue
        M = {s['t']: t for s, t in zip(S['segments'], T['segments'])}
        miss = []
        def tr(t, k, M=M, miss=miss):
            if t in M: return M[t]
            miss.append(t); return t
        out.append((g, base, region, tr, miss))
    return out


# ---------------------------------------------------------------- page pieces
def alternates(versions, xdef, sep=''):
    return sep.join(f'<link rel="alternate" hreflang="{code}" href="{SITE}{p}">' for code, p in versions) + sep + f'<link rel="alternate" hreflang="x-default" href="{SITE}{xdef}">'


def set_alternates(doc, block, sep=''):
    doc = re.sub(r'\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*">', '', doc)
    return re.sub(r'(<link rel="canonical" href="[^"]*">)', lambda m: m.group(1) + sep + block, doc, count=1)


def guide_versions(lm, path):
    v = lm.versions(path)
    return [(C.href(l), p) for l, p in v.items()], v


def seolangs(v, cur):
    return ''.join(f'<a href="{p}" hreflang="{C.href(l)}" lang="{C.href(l)}"' + (' aria-current="page"' if l == cur else '') + f'>{C.LNAME[l]}</a>' for l, p in v.items())


def set_seolangs(doc, v, cur):
    return re.sub(r'(<nav class="seolangs" aria-label="[^"]*">).*?(</nav>)', lambda m: m.group(1) + seolangs(v, cur) + m.group(2), doc, count=1, flags=re.S)


def absolutize(doc):
    """the English home uses relative URLs; pages in a sub-folder need them absolute"""
    def fix(u):
        u2 = u.strip()
        if not u2 or re.match(r'^([a-z][a-z0-9+.-]*:|/|#|\{|\')', u2, re.I): return u
        return '/' + u2
    doc = re.sub(r'\b(href|src|poster)="([^"]*)"', lambda m: f'{m.group(1)}="{fix(m.group(2))}"', doc)
    doc = re.sub(r'\bsrcset="([^"]*)"', lambda m: 'srcset="' + ', '.join(fix(x.strip()) for x in m.group(1).split(',')) + '"', doc)
    return re.sub(r'url\((?![\'"]?(?:/|#|data:|https?:))([\'"]?)', r'url(\1/', doc)


def remap_links(doc, l, lm):
    a = doc.find('<body')
    parts = re.split(r'(<script\b.*?</script>)', doc[a:], flags=re.S)  # never touch code
    for i in range(0, len(parts), 2):
        parts[i] = re.sub(r'\bhref="([^"]*)"', lambda m: f'href="{e(lm.remap(html.unescape(m.group(1)), l, FALLBACK), quote=True)}"', parts[i])
    return doc[:a] + ''.join(parts)


def ld_post(l, lm):
    def post(J):
        def walk(n):
            if isinstance(n, list): return [walk(x) for x in n]
            if not isinstance(n, dict): return n
            if n.get('@type') in ('Organization', 'WebSite'): return n  # site-wide entities keep their URLs
            for k, v in list(n.items()):
                if k in ('url', '@id', 'mainEntityOfPage', 'item') and isinstance(v, str) and v.startswith(SITE): n[k] = lm.remap(v, l, FALLBACK)
                elif k == 'inLanguage' and isinstance(v, str): n[k] = C.href(l)
                else: n[k] = walk(v)
            return n
        return walk(J)
    return post


def data_post(l):
    def post(D):
        D['app'] = C.app_link(l)
        D.pop('cur', None)  # never prices
        return D
    return post


def build_page(l, g, base, region, tr, lm):
    url = C.home(l) if g == '_home' else SL[g][l]
    doc = open(base, encoding='utf8').read()
    if g == '_home': doc = absolutize(doc)
    doc = seg.process(doc, tr, region, ld_post=ld_post(l, lm), data_post=data_post(l))
    code = C.HOME_HREF.get(l, l) if g == '_home' else C.href(l)
    doc = re.sub(r'<html\b[^>]*>', f'<html lang="{code}"' + (' dir="rtl"' if l in C.RTL else '') + '>', doc, count=1)
    doc = re.sub(r'(<link rel="canonical" href=")[^"]*(">)', lambda m: m.group(1) + SITE + url + m.group(2), doc, count=1)
    doc = re.sub(r'(<meta property="og:url" content=")[^"]*(">)', lambda m: m.group(1) + SITE + url + m.group(2), doc, count=1)
    doc = re.sub(r'<meta property="og:locale:alternate" content="[^"]*">\s*', '', doc)
    if '<meta property="og:locale"' in doc:
        doc = re.sub(r'(<meta property="og:locale" content=")[^"]*(">)', lambda m: m.group(1) + C.OGLOC[l] + m.group(2), doc, count=1)
    else:
        doc = doc.replace('<meta property="og:url"', f'<meta property="og:locale" content="{C.OGLOC[l]}"><meta property="og:url"', 1)
    if g == '_home':
        doc = re.sub(r'(<details class="lg3"><summary>)[^<]*(</summary>)', r'\1🌍\2', doc, count=1)
    if g != '_home':
        # header: brand → language home, switcher, button; footer of that language
        hm = C.home(l) if lm.ok(C.home(l)) else '/'
        doc = re.sub(r'(<header class="top">.*?<a class="brand" href=")[^"]*(")', lambda m: m.group(1) + hm + m.group(2), doc, count=1, flags=re.S)
        doc = re.sub(r'(<nav class="seolangs" aria-label=")[^"]*(")', lambda m: m.group(1) + C.LANGNAV[l] + m.group(2), doc, count=1)
        doc = re.sub(r'(<a class="btn btn-primary btn-sm" href="[^"]*">)[^<]*(</a></div></header>)', lambda m: m.group(1) + e(C.START[l]) + m.group(2), doc, count=1)
        foot = (f'<footer class="foot"><div class="wrap"><p class="fdisc">{C.disclaimer(l)}</p><p>© 2026 The Wine Goat · <a href="{hm}">thewinegoat.com</a> · '
                f'{e(C.UPDATED[l])} {DATE}</p></div></footer>')
        doc = re.sub(r'<footer class="foot">.*?</footer>', lambda m: foot, doc, count=1, flags=re.S)
        doc = re.sub(r'("date(?:Modified|Published)": ")\d{4}-\d\d-\d\d', lambda m: m.group(1) + DATE, doc)
    doc = remap_links(doc, l, lm)
    out = 'index.html' if url == '/' else C.fs(url)
    os.makedirs(os.path.dirname(out) or '.', exist_ok=True)
    # the home's goat lane has a raw '>' inside an attribute (data-after=".ctas3 > a"): the extractor sees 'a">' as text; restore it
    doc = doc.replace('data-after=".ctas3 > a"&gt;', 'data-after=".ctas3 > a">')
    open(out, 'w', encoding='utf8').write(doc)
    size = seg.size(seg.visible_text(doc, region), l)
    return url, size


# ---------------------------------------------------------------- sync: hreflang, switchers, sitemap, llms.txt
def home_regional():
    """regional hreflang variants of the English home (it-IT, fr-CA, en-GB…), minus codes that have their own home"""
    s = open('index.html', encoding='utf8').read()
    own = {C.HOME_HREF.get(l, l).lower() for l in C.LANGS if C.exists(C.home(l))}
    out, seen = [], set()
    for code, h in re.findall(r'<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">', s):
        p = h.replace(SITE, '') or '/'
        if code == 'x-default' or code.lower() in own or code.lower() in seen or '-' not in code or not C.exists(p): continue
        seen.add(code.lower()); out.append((code, p))
    return out


def homes_sync():
    homes = {l: C.home(l) for l in C.LANGS if C.exists(C.home(l))}
    reg = home_regional()
    alts = [(C.HOME_HREF.get(l, l), p) for l, p in homes.items()]
    for l, p in homes.items():
        f = C.fs(p) if p != '/' else 'index.html'
        s = open(f, encoding='utf8').read(); o = s
        s = set_alternates(s, alternates(alts + reg, '/', '\n'), '\n')
        li = ''.join(f'<li><a href="{q}" hreflang="{C.HOME_HREF.get(x, x)}" lang="{C.HOME_HREF.get(x, x)}" data-lang="{x}"' + (' aria-current="true"' if x == l else '') + f'>{C.HOME_LNAME[x]}</a></li>'
                     for x, q in homes.items())
        s = re.sub(r'(<details class="lg3"><summary>[^<]*</summary><ul>).*?(</ul></details>)', lambda m: m.group(1) + li + m.group(2), s, count=1, flags=re.S)
        if s != o:
            open(f, 'w', encoding='utf8').write(s)
            if l == 'es-ar' and os.path.exists('tools/ar_goats.py'):  # keep the Argentine shirts on the walking goats
                os.system(f'{sys.executable} tools/ar_goats.py >/dev/null')
    return homes, alts + reg


def guides_sync(lm):
    n = 0
    for g, slugs in SL.items():
        alts, v = guide_versions(lm, slugs['en'])
        block = alternates(alts, slugs['en'])
        for l, p in v.items():
            f = C.fs(p); s = open(f, encoding='utf8').read(); o = s
            s = set_alternates(s, block)
            s = set_seolangs(s, v, l)
            if s != o: open(f, 'w', encoding='utf8').write(s); n += 1
    return n


def sm_links(alts, xdef):
    return ''.join(f'<xhtml:link rel="alternate" hreflang="{c}" href="{SITE}{p}"/>' for c, p in alts) + f'<xhtml:link rel="alternate" hreflang="x-default" href="{SITE}{xdef}"/>'


def sitemap_sync(lm, homes, home_alts):
    sm = open('sitemap.xml', encoding='utf8').read()
    for mk in ('guides-i18n', 'homes-i18n'): sm = re.sub(rf'<!--{mk}-->.*?<!--/{mk}-->\n?', '', sm, flags=re.S)
    want = {}   # loc path → alternates xml
    gblock = ''
    for g, slugs in SL.items():
        alts, v = guide_versions(lm, slugs['en'])
        x = sm_links(alts, slugs['en'])
        for l, p in v.items():
            if l in C.OLD4: want[p] = x
            else: gblock += f'<url><loc>{SITE}{p}</loc><lastmod>{DATE}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority>{x}</url>\n'
    hx = sm_links(home_alts, '/')
    hblock = ''
    for l, p in homes.items():
        if f'<loc>{SITE}{p}</loc>' in sm: want[p] = hx
        else: hblock += f'<url><loc>{SITE}{p}</loc><lastmod>{DATE}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority>{hx}</url>\n'
    def fix(m):
        u = m.group(0); loc = re.search(r'<loc>([^<]*)</loc>', u).group(1).replace(SITE, '') or '/'
        if loc not in want: return u
        rest = re.sub(r'<xhtml:link rel="alternate"[^>]*/>', '', u)
        i = rest.find('</loc>') + 6
        lm_ = re.match(r'<lastmod>[^<]*</lastmod>', rest[i:])
        if lm_: i += lm_.end()
        return rest[:i] + want[loc] + rest[i:]
    sm = re.sub(r'<url>.*?</url>', fix, sm, flags=re.S)
    add = ('<!--homes-i18n-->\n' + hblock + '<!--/homes-i18n-->\n' if hblock else '') + ('<!--guides-i18n-->\n' + gblock + '<!--/guides-i18n-->\n' if gblock else '')
    sm = sm.replace('</urlset>', add + '</urlset>')
    open('sitemap.xml', 'w', encoding='utf8').write(sm)
    return gblock.count('<url>'), hblock.count('<url>')


def llms_sync(lm):
    lt = open('llms.txt', encoding='utf8').read()
    lt = re.sub(r'\n## WSET guides in other languages.*?(?=\n## |\Z)', '', lt, flags=re.S).rstrip() + '\n'
    per = {}
    for g, slugs in SL.items():
        for l, p in lm.versions(slugs['en']).items():
            if l in C.OLD4: continue
            h1 = re.search(r'<h1[^>]*>(.*?)</h1>', open(C.fs(p), encoding='utf8').read(), re.S)
            per.setdefault(l, []).append((html.unescape(re.sub(r'<[^>]+>', '', h1.group(1))).strip() if h1 else g, p))
    if per:
        lt += '\n## WSET guides in other languages\nThe wine study guides above, published in more languages (each page lists its versions with hreflang).\n'
        for l in C.LANGS:
            if l in per:
                lt += f'\n### {C.LNAME[l]} ({len(per[l])})\n' + ''.join(f'- [{t}]({SITE}{p})\n' for t, p in per[l])
    open('llms.txt', 'w', encoding='utf8').write(lt)
    return sum(len(v) for v in per.values())


# ---------------------------------------------------------------- main
def main():
    flags = {'--check', '--sync'}
    vals = {arg('--group'), arg('--fallback'), arg('--date')}
    args = [a for a in sys.argv[1:] if a not in flags and not a.startswith('--') and a not in vals]
    only = set(arg('--group').split(',')) if arg('--group') else None
    if '--sync' in sys.argv: langs = []
    elif args: langs = args
    else: langs = ['es-ar'] + [l for l in C.NEW if l != 'es-ar' and glob.glob(f'{C.D}/{l}/*.json')]
    bad = [l for l in langs if l not in C.NEW]
    if bad: sys.exit(f'not a language this pipeline builds: {bad} (choose from {C.NEW})')
    J = {}
    for l in langs:
        J[l] = jobs_for(l, only)
        print(f'{l}: {len(J[l])} page(s) ready')
    if '--check' in sys.argv: return
    extra = {(C.home(l) if g == '_home' else SL[g][l]) for l, js in J.items() for g, *_ in js}
    lm = C.LinkMap(extra)
    report = []
    for l, js in J.items():
        for g, base, region, tr, miss in js:
            url, size = build_page(l, g, base, region, tr, lm)
            need = MIN_SIZE.get(l, 3000) if g != '_home' else 0
            flag = '' if size >= need else f'  ← below {need}'
            if miss: flag += f'  ({len(miss)} segment(s) left in English)'
            report.append(f'  {l:7} {url:62} {size:6}{" chars" if l in seg.CJK else " words"}{flag}')
    print('\n'.join(report))
    lm = C.LinkMap()
    homes, home_alts = homes_sync()
    n = guides_sync(lm)
    gs, hs = sitemap_sync(lm, homes, home_alts)
    nl = llms_sync(lm)
    if os.path.exists('tools/seo_tech/variant_titles.py'):  # es-ar / pt-br pages get their own <title> (not identical to es / pt)
        os.system(f'{sys.executable} tools/seo_tech/variant_titles.py >/dev/null')
    if os.path.exists('tools/seo_tech/images.py'):  # image SEO: descriptive file names, localized alt, width/height, lazy/LCP, ImageObject, sitemap-images.xml
        os.system(f'{sys.executable} tools/seo_tech/images.py --pages >/dev/null')
    if os.path.exists('tools/geo/sitewide.py'):  # GEO: About link in every footer, one Organization/WebSite JSON-LD, git dates
        os.system(f'{sys.executable} tools/geo/sitewide.py --quiet')
    print(f'sync: {len(homes)} homes, {n} guide pages updated (hreflang/switcher); sitemap: {gs} guide + {hs} home URLs in the i18n blocks; llms.txt: {nl} links')


if __name__ == '__main__':
    main()
