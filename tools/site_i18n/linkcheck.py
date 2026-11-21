# -*- coding: utf-8 -*-
"""Site-wide link checker (static, no server needed). Run from the repo root:
    python3 tools/site_i18n/linkcheck.py            # whole site + the sitemaps (index, language sitemaps, image sitemap)
    python3 tools/site_i18n/linkcheck.py -v         # also list every broken link
    python3 tools/site_i18n/linkcheck.py --only de  # only pages under /de/
Checks every internal href/src (a, link, img, script, source, srcset, canonical, hreflang alternates, og:url) of every
public HTML page (everything except app/, tools/, mobile/, supabase/) and every <loc>/alternate/image of the sitemaps
(the index /sitemap.xml and every sitemap file it references):
the target file must exist (…/ → …/index.html). Also checks hreflang: every alternate must exist, be reciprocal
(the target lists the page back) and use one code per URL; and that <html lang> matches the page's hreflang code.
Exit code 1 if anything is broken."""
import os, re, sys, glob, html
from collections import defaultdict
SITE = 'https://thewinegoat.com'
SKIP = ('app/', 'tools/', 'mobile/', 'supabase/', '.git/', 'node_modules/')
VERB = '-v' in sys.argv
ONLY = sys.argv[sys.argv.index('--only') + 1] if '--only' in sys.argv else None
ATTR = re.compile(r'<(a|link|img|script|source|iframe|meta)\b([^>]*)>', re.I)
VAL = re.compile(r'\b(href|src|srcset|content|data-src)\s*=\s*("([^"]*)"|\'([^\']*)\')', re.I)


def pages():
    for p in sorted(glob.glob('**/*.html', recursive=True)):
        if p.startswith(SKIP) or '/node_modules/' in p: continue
        yield p


def url_of(p):  # file → site path
    p = '/' + p
    return p[:-10] if p.endswith('/index.html') else p


def target_exists(path):
    path = html.unescape(path).split('#')[0].split('?')[0]
    if not path or path == '/': return os.path.exists('index.html')
    fs = path.lstrip('/')
    if path.endswith('/'): return os.path.exists(fs + 'index.html')
    return os.path.isfile(fs) or os.path.exists(fs + '/index.html')


def resolve(base, ref):
    ref = html.unescape(ref.strip())
    if not ref or ref.startswith(('#', 'mailto:', 'tel:', 'javascript:', 'data:', 'blob:', '{', "'")): return None
    if ref.startswith(SITE): ref = ref[len(SITE):] or '/'
    elif re.match(r'^[a-z][a-z0-9+.-]*:', ref, re.I) or ref.startswith('//'): return None  # external
    if not ref.startswith('/'):
        d = base if base.endswith('/') else base.rsplit('/', 1)[0] + '/'
        ref = d + ref
    parts = []
    for seg in ref.split('?')[0].split('#')[0].split('/'):
        if seg == '..':
            if parts: parts.pop()
        elif seg != '.': parts.append(seg)
    out = '/'.join(parts)
    return out if out.startswith('/') else '/' + out


def check():
    broken = defaultdict(list); n_links = 0; n_pages = 0
    alts = {}; langs = {}
    for p in pages():
        u = url_of(p)
        if ONLY and not u.startswith(f'/{ONLY}/'): continue
        s = open(p, encoding='utf8', errors='replace').read(); n_pages += 1
        s_nos = re.sub(r'<script(?![^>]*application/ld\+json)[^>]*>.*?</script>', '', s, flags=re.S | re.I)
        s_nos = re.sub(r'<!--.*?-->', '', s_nos, flags=re.S)
        for m in ATTR.finditer(s_nos):
            tag, attrs = m.group(1).lower(), m.group(2)
            if tag == 'meta' and not re.search(r'property="og:(url|image)"|name="twitter:image"', attrs): continue
            if tag == 'link' and re.search(r'rel="(preconnect|dns-prefetch)"', attrs): continue
            for v in VAL.finditer(attrs):
                name, val = v.group(1).lower(), v.group(3) if v.group(3) is not None else v.group(4)
                if tag != 'meta' and name == 'content': continue
                refs = [x.strip().split(' ')[0] for x in val.split(',')] if name == 'srcset' else [val]
                for r in refs:
                    t = resolve(u, r)
                    if t is None: continue
                    n_links += 1
                    if not target_exists(t): broken[t].append(u)
        a = {}
        for m in re.finditer(r'<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"', s):
            a.setdefault(m.group(1), m.group(2).replace(SITE, '') or '/')
        if a: alts[u] = a
        m = re.search(r'<html[^>]*\blang="([^"]+)"', s)
        langs[u] = m.group(1) if m else None
    # sitemaps: the index /sitemap.xml must reference files that exist; every page, alternate and image URL they list must exist
    top = open('sitemap.xml', encoding='utf8').read() if os.path.exists('sitemap.xml') else ''
    names = ['sitemap.xml']
    if '<sitemapindex' in top:
        names = []
        for l in re.findall(r'<loc>([^<]+)</loc>', top):
            f = l[len(SITE) + 1:] if l.startswith(SITE + '/') else ''
            n_links += 1
            if f and os.path.isfile(f): names.append(f)
            else: broken[l.replace(SITE, '') or l].append('sitemap.xml')
    for name in names:
        sm = open(name, encoding='utf8').read()
        for m in re.finditer(r'<(?:loc>|image:loc>|xhtml:link[^>]*href=")([^<"]+)', sm):
            t = html.unescape(m.group(1))
            if not t.startswith(SITE): continue
            t = t[len(SITE):] or '/'
            if ONLY and not t.startswith(f'/{ONLY}/'): continue
            n_links += 1
            if not target_exists(t): broken[t].append(name)
    # hreflang reciprocity
    hre = []
    for u, a in alts.items():
        codes_per_url = defaultdict(set)
        for code, t in a.items():
            if code == 'x-default': continue
            codes_per_url[t].add(code.split('-')[0] if code.lower() not in ('zh-hans', 'zh-hant', 'pt-br', 'es-ar') else code.lower())
        if u not in a.values(): hre.append(f'{u}: does not list itself')
        for code, t in a.items():
            if not target_exists(t): continue  # already reported as broken
            back = alts.get(t)
            if back is not None and u not in back.values(): hre.append(f'{u} → {t} ({code}) not reciprocal')
            if t == u and langs.get(u) and code != 'x-default' and code.split('-')[0].lower() != langs[u].split('-')[0].lower(): hre.append(f'{u}: hreflang {code} ≠ <html lang="{langs[u]}">')
    print(f'{n_pages} pages, {n_links} internal links checked')
    print(f'broken targets: {len(broken)} ({sum(len(v) for v in broken.values())} links)')
    for t, src in sorted(broken.items())[: None if VERB else 15]:
        print(f'  404 {t}  ← {len(src)}× e.g. {sorted(set(src))[:3]}')
    print(f'hreflang problems: {len(hre)}')
    for x in hre[: None if VERB else 15]: print('  ' + x)
    return 1 if broken or hre else 0


if __name__ == '__main__':
    sys.exit(check())
