# -*- coding: utf-8 -*-
"""Sitemap index + one sitemap per locale, generated from the pages that really exist. Run from the repo root:

    python3 tools/seo_tech/sitemaps.py            # write /sitemap.xml (index) and /sitemap-<locale>.xml
    python3 tools/seo_tech/sitemaps.py --check    # write nothing, exit 1 if the files on disk are stale or invalid
    python3 tools/seo_tech/sitemaps.py --list     # print every URL with its locale, lastmod and (if excluded) the reason
    python3 tools/seo_tech/sitemaps.py --seed     # rebuild the lastmod memory from git history, then write (slow, rarely needed)
    options: --quiet      one line of output only
             --hreflang   also write the xhtml:link alternates of each page (copied from the page's own <head>)

This is the ONLY writer of the page sitemaps. Every page builder calls it at the end (tools/site_i18n/build.py sync,
tools/seo_core, tools/seo_sp, tools/seo2, tools/geo/pages.py, tools/seo_tech/place_photos.py); nothing is listed by hand.

What goes in: every public **/index.html (not app/, admin/, mobile/, tools/, supabase/, social/ or asset folders) that
  - has no noindex in <meta name="robots"> / <meta name="googlebot">,
  - is not a redirect stub (<meta http-equiv="refresh">),
  - has exactly one <link rel="canonical"> and it is the page's own https://thewinegoat.com/… URL,
  - has a <title> and real text (at least MIN_TEXT characters of visible text).
Everything else is left out and printed with the reason (--list).

Locale of a page = its first folder when that folder is a language folder (it has an index.html whose <html lang>
starts with the folder's language code: /it/, /es-ar/, /zh-hans/ …); every other page is English (root).
One file per locale that has at least one page: sitemap-en.xml, sitemap-it.xml, sitemap-es-ar.xml …; /es/ (Spain,
generic Spanish) is published as sitemap-es-es.xml. A locale with no indexable page gets NO file and no index entry,
and a sitemap-<x>.xml left over from a locale that no longer has pages is deleted.

lastmod = the day the page's own content last changed: title, meta description, the text of the page and the links
in it (header, footer, language menus, scripts, styles and structured data are ignored, so a template pass, a new
language in the menu or a new footer link does not move the date). The generator remembers a fingerprint of that
content and its date for every URL in tools/seo_tech/sitemap_lastmod.json (commit it together with the sitemaps):
same fingerprint → same date; new page or changed content → today (UTC). --seed rebuilds that file from git history
(for each page, the date of the oldest commit since which the content has not changed). Google only trusts lastmod
when it is consistently accurate, which is why the date must not move when nothing a reader sees has changed.

hreflang: by default NOT repeated in the sitemaps. Every page already carries its full, reciprocal hreflang cluster in
its <head> (checked by tools/site_i18n/linkcheck.py); Google reads either place, and one source cannot contradict
itself. It also takes the files from about 3 MB to about 150 KB in total. --hreflang puts them back, copied from the pages.

The image sitemap (sitemap-images.xml, written by tools/seo_tech/images.py) is referenced from the index when it exists."""
import datetime, glob, hashlib, html, json, os, re, subprocess, sys
from collections import Counter, OrderedDict
from xml.dom import minidom
from xml.sax.saxutils import escape

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
SITE = 'https://thewinegoat.com'
SKIP = ('app/', 'admin/', 'mobile/', 'tools/', 'supabase/', 'social/', 'img/', 'assets/', 'fonts/', 'node_modules/', '.git/', '.github/')
FILE_CODE = {'es': 'es-es'}          # folder → name used in sitemap-<name>.xml (all the others: the folder name)
IMAGES = 'sitemap-images.xml'
STATE = 'tools/seo_tech/sitemap_lastmod.json'   # {path: [content fingerprint, date of the last content change]}
MIN_TEXT = 400                        # characters of visible text below which a page counts as empty/unfinished
MAX_URLS, MAX_BYTES = 50000, 50 * 1024 * 1024   # sitemap protocol limits per file
NS = 'http://www.sitemaps.org/schemas/sitemap/0.9'
LOCALE_DIR = re.compile(r'^[a-z]{2,3}(-[a-z0-9]{2,4})?$')


def url_of(p):
    d = os.path.dirname(p)
    return SITE + '/' + (d + '/' if d else '')


def html_lang(s):
    m = re.search(r'<html[^>]*\blang=["\']([^"\']+)', s[:600])
    return m.group(1) if m else ''


def visible_text(s):
    b = s[s.find('<body'):] if '<body' in s else s
    b = re.sub(r'<(script|style|template|noscript|svg)\b.*?</\1>', ' ', b, flags=re.S | re.I)
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', b))).strip()


def locale_dirs():
    """top-level folders that are language versions of the site (folder code matches the <html lang> of its home)"""
    out = []
    for d in sorted(os.listdir('.')):
        f = os.path.join(d, 'index.html')
        if not LOCALE_DIR.match(d) or not os.path.isfile(f): continue
        lang = html_lang(open(f, encoding='utf8', errors='replace').read(800)).lower()
        if lang and {'nb': 'no'}.get(lang.split('-')[0], lang.split('-')[0]) == d.split('-')[0]: out.append(d)   # /no/ is Norwegian Bokmål (lang nb)
    return out


CHROME = re.compile(r'<header\b.*?</header>|<footer\b.*?</footer>|<nav class="seolangs".*?</nav>|<details class="lg3">.*?</details>|<nav class="seolinks wrap intl-links".*?</nav>', re.S)


def fingerprint(s):
    """what a reader (and Google) gets from the page: title, description, text and links of the content area"""
    head = s[:s.find('</head>')] if '</head>' in s else ''
    t = re.search(r'<title>(.*?)</title>', head, re.S)
    d = re.search(r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']*)', head)
    b = s[s.find('<body'):] if '<body' in s else s
    b = re.sub(r'<(script|style|template|noscript|svg)\b.*?</\1>|<!--.*?-->', ' ', b, flags=re.S | re.I)
    b = CHROME.sub(' ', b)
    links = sorted(set(re.findall(r'<a\b[^>]*?\bhref="([^"#]+)', b)))
    text = re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', b))).strip()
    raw = '\x1f'.join([t.group(1).strip() if t else '', d.group(1) if d else '', text, ' '.join(links)])
    return hashlib.sha1(raw.encode('utf8')).hexdigest()[:16]


def today():
    return datetime.datetime.now(datetime.timezone.utc).date().isoformat()


def load_state():
    try: return json.load(open(STATE, encoding='utf8'))
    except Exception: return {}


def save_state(st):
    body = ',\n'.join(f' {json.dumps(k)}: {json.dumps(v)}' for k, v in sorted(st.items()))
    open(STATE, 'w', encoding='utf8').write('{\n' + body + '\n}\n')


def date_pages(pages, state, day=None):
    """sets d['lastmod'] on every indexable page from the remembered fingerprints; returns the new state"""
    day = day or today(); new = {}
    for d in pages:
        if d['reason'] is not None: continue
        k = d['url'][len(SITE):]; e = state.get(k)
        d['lastmod'] = e[1] if e and e[0] == d['hash'] else day
        new[k] = [d['hash'], d['lastmod']]
    return new


def seed(pages):
    """state from git history: for each page, the date of the oldest commit since which its fingerprint has not changed"""
    out = subprocess.run(['git', 'log', '--format=@@%H %cs', '--name-only', '--no-renames', '--', '*.html'], capture_output=True, text=True).stdout
    hist = {}; cur = None
    for line in out.split('\n'):
        if line.startswith('@@'): cur = line[2:].split(' ')
        elif line.strip() and cur: hist.setdefault(line, []).append(cur)   # newest first
    cat = subprocess.Popen(['git', 'cat-file', '--batch'], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
    def blob(sha, path):
        cat.stdin.write(f'{sha}:{path}\n'.encode('utf8')); cat.stdin.flush()
        h = cat.stdout.readline().split()
        if len(h) < 3 or h[1] != b'blob': return None
        data = cat.stdout.read(int(h[2])); cat.stdout.read(1)
        return data.decode('utf8', 'replace')
    st = {}; day = today()
    for d in pages:
        if d['reason'] is not None: continue
        best = None
        for sha, date in hist.get(d['path'], []):
            b = blob(sha, d['path'])
            if b is None or fingerprint(b) != d['hash']: break
            best = date
        st[d['url'][len(SITE):]] = [d['hash'], best or day]   # no commit with this content yet → changed today
    cat.stdin.close(); cat.wait()
    return st


def scan():
    """every public page → dict(path, url, locale, lang, hash, lastmod, canon, alts, reason); reason None = goes in a sitemap.
    lastmod is filled by date_pages()."""
    locs = set(locale_dirs())
    out = []
    for p in sorted(glob.glob('**/index.html', recursive=True)):
        if p.startswith(SKIP): continue
        s = open(p, encoding='utf8', errors='replace').read()
        head = s[:s.find('</head>')] if '</head>' in s else s
        u = url_of(p)
        seg = p.split('/')[0]
        locale = seg if seg in locs else 'en'
        canon = [html.unescape(x) for x in re.findall(r'<link[^>]+rel=["\']canonical["\'][^>]*href=["\']([^"\']+)', head)]
        robots = ' '.join(re.findall(r'<meta[^>]+name=["\'](?:robots|googlebot)["\'][^>]+content=["\']([^"\']*)', head, re.I)).lower()
        reason = None
        if 'noindex' in robots: reason = 'noindex'
        elif re.search(r'<meta[^>]+http-equiv=["\']refresh', head, re.I): reason = 'redirect stub (meta refresh)'
        elif len(canon) != 1: reason = f'{len(canon)} canonical tags'
        elif canon[0] != u: reason = f'canonical points elsewhere ({canon[0]})'
        elif not re.search(r'<title>\s*\S', head): reason = 'no <title>'
        elif len(visible_text(s)) < MIN_TEXT: reason = f'almost empty (under {MIN_TEXT} characters of text)'
        alts = re.findall(r'<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"', head)
        out.append(dict(path=p, url=u, locale=locale, lang=html_lang(s), hash=fingerprint(s), lastmod=None, canon=canon, alts=alts, reason=reason))
    return out


def file_of(locale):
    return f'sitemap-{FILE_CODE.get(locale, locale)}.xml'


def order(d):
    depth = d['url'][len(SITE):].strip('/').count('/') + (1 if d['url'][len(SITE):].strip('/') else 0)
    return (0 if d['url'] in (SITE + '/', f"{SITE}/{d['locale']}/") else 1, depth, d['url'])


def build(pages, with_hreflang=False):
    """{file name: xml text}, the index included; only locales with at least one indexable page"""
    by = OrderedDict()
    for d in pages:
        if d['reason'] is None: by.setdefault(d['locale'], []).append(d)
    files = OrderedDict(); index = []
    locales = sorted(by, key=lambda l: (l != 'en', l))
    for l in locales:
        ps = sorted(by[l], key=order)
        chunks = [ps[i:i + MAX_URLS] for i in range(0, len(ps), MAX_URLS)]
        for i, ch in enumerate(chunks):
            name = file_of(l) if len(chunks) == 1 else file_of(l).replace('.xml', f'-{i + 1}.xml')
            x = ['<?xml version="1.0" encoding="UTF-8"?>',
                 f'<urlset xmlns="{NS}"' + (' xmlns:xhtml="http://www.w3.org/1999/xhtml"' if with_hreflang else '') + '>']
            for d in ch:
                alt = ''.join(f'<xhtml:link rel="alternate" hreflang="{escape(c)}" href="{escape(html.unescape(h))}"/>' for c, h in d['alts']) if with_hreflang else ''
                lm = f"<lastmod>{d['lastmod']}</lastmod>" if d['lastmod'] else ''
                x.append(f"<url><loc>{escape(d['url'])}</loc>{lm}{alt}</url>")
            x.append('</urlset>')
            files[name] = '\n'.join(x) + '\n'
            index.append((name, max((d['lastmod'] for d in ch if d['lastmod']), default=None)))
    x = ['<?xml version="1.0" encoding="UTF-8"?>', f'<sitemapindex xmlns="{NS}">']
    for name, lm in index:
        x.append(f'<sitemap><loc>{SITE}/{name}</loc>' + (f'<lastmod>{lm}</lastmod>' if lm else '') + '</sitemap>')
    if os.path.exists(IMAGES): x.append(f'<sitemap><loc>{SITE}/{IMAGES}</loc></sitemap>')
    x.append('</sitemapindex>')
    out = OrderedDict([('sitemap.xml', '\n'.join(x) + '\n')]); out.update(files)
    return out


def validate(files, pages):
    """problems (list of strings) of a set of generated files against the pages on disk"""
    bad = []; ok = {d['url'] for d in pages if d['reason'] is None}; seen = Counter()
    for name, x in files.items():
        try: dom = minidom.parseString(x.encode('utf8'))
        except Exception as e: bad.append(f'{name}: not well-formed XML ({e})'); continue
        root = dom.documentElement
        if root.namespaceURI != NS: bad.append(f'{name}: wrong namespace {root.namespaceURI}')
        if len(x.encode('utf8')) > MAX_BYTES: bad.append(f'{name}: over 50 MB')
        locs = [n.firstChild.data for n in dom.getElementsByTagNameNS(NS, 'loc')]
        if len(locs) > MAX_URLS: bad.append(f'{name}: over 50,000 entries')
        if not locs: bad.append(f'{name}: empty')
        if name == 'sitemap.xml':
            if root.localName != 'sitemapindex': bad.append('sitemap.xml: is not a <sitemapindex>')
            for l in locs:
                f = l[len(SITE) + 1:]
                if not l.startswith(SITE + '/') or (f not in files and not os.path.isfile(f)): bad.append(f'sitemap.xml: references a file that does not exist: {l}')
        else:
            if root.localName != 'urlset': bad.append(f'{name}: is not a <urlset>')
            for l in locs:
                seen[l] += 1
                if l not in ok: bad.append(f'{name}: {l} is not an indexable, self-canonical page')
    bad += [f'{l}: listed {n} times' for l, n in seen.items() if n > 1]
    bad += [f'{u}: indexable page missing from the sitemaps' for u in sorted(ok - set(seen))]
    return bad


def on_disk():
    """the page sitemaps currently on disk: {name: text} (index + every sitemap-*.xml except the image sitemap)"""
    names = ['sitemap.xml'] + sorted(f for f in glob.glob('sitemap-*.xml') if f != IMAGES)
    return {n: open(n, encoding='utf8').read() for n in names if os.path.exists(n)}


def listed_urls():
    """{url: file name} for every page URL listed by the sitemaps on disk (follows the index; also reads a plain urlset)"""
    out = {}
    if not os.path.exists('sitemap.xml'): return out
    top = open('sitemap.xml', encoding='utf8').read()
    names = ['sitemap.xml']
    if '<sitemapindex' in top:
        names = [l[len(SITE) + 1:] for l in re.findall(r'<loc>([^<]+)</loc>', top) if l[len(SITE) + 1:] != IMAGES]
    for n in names:
        if not os.path.exists(n): continue
        for l in re.findall(r'<loc>([^<]+)</loc>', open(n, encoding='utf8').read()): out.setdefault(html.unescape(l), n)
    return out


def main():
    os.chdir(ROOT)
    quiet = '--quiet' in sys.argv
    pages = scan()
    if '--seed' in sys.argv:
        state = seed(pages); save_state(state)
    state = date_pages(pages, load_state())
    if '--list' in sys.argv:
        for d in pages: print(f"{d['locale']:8} {d['lastmod'] or '-':10} {d['url']}" + (f"   EXCLUDED: {d['reason']}" if d['reason'] else ''))
        return 0
    files = build(pages, '--hreflang' in sys.argv)
    bad = validate(files, pages)
    if '--check' in sys.argv:
        disk = on_disk()
        for n in sorted(set(files) | set(disk)):
            if files.get(n) != disk.get(n): bad.append(f'{n}: ' + ('missing on disk' if n not in disk else 'left over, no longer generated' if n not in files else 'stale') + ' (run tools/seo_tech/sitemaps.py)')
        if state != load_state(): bad.append(f'{STATE}: stale (run tools/seo_tech/sitemaps.py)')
        for b in bad[:40]: print('  ✗', b)
        print(f'sitemaps check: {len(bad)} problem(s), {len(files) - 1} locale sitemaps, {sum(d["reason"] is None for d in pages)} URLs')
        return 1 if bad else 0
    if bad:
        for b in bad[:40]: print('  ✗', b)
        print('sitemaps: NOT written, fix the problems above'); return 1
    changed = 0
    for n, x in files.items():
        if not os.path.exists(n) or open(n, encoding='utf8').read() != x:
            open(n, 'w', encoding='utf8').write(x); changed += 1
    for n in glob.glob('sitemap-*.xml'):
        if n != IMAGES and n not in files: os.remove(n); changed += 1
    if state != load_state(): save_state(state)
    rb = open('robots.txt', encoding='utf8').read() if os.path.exists('robots.txt') else ''
    if f'Sitemap: {SITE}/sitemap.xml' not in rb:
        open('robots.txt', 'w', encoding='utf8').write(rb.rstrip('\n') + f'\n\nSitemap: {SITE}/sitemap.xml\n'); changed += 1
    inc = [d for d in pages if d['reason'] is None]; exc = [d for d in pages if d['reason']]
    cnt = Counter(d['locale'] for d in inc)
    if quiet:
        print(f'sitemaps: index + {len(files) - 1} locale files, {len(inc)} URLs, {len(exc)} page(s) left out, {changed} file(s) changed')
        return 0
    print(f'sitemap.xml (index) → {len(files) - 1} locale sitemaps' + (f' + {IMAGES}' if os.path.exists(IMAGES) else '') + f'; {len(inc)} URLs; {changed} file(s) changed')
    for l in sorted(cnt, key=lambda l: (l != 'en', l)): print(f'  {file_of(l):24} {cnt[l]:4} URLs')
    if exc:
        print(f'left out ({len(exc)}):')
        for d in exc: print(f"  {d['url']}  ← {d['reason']}")
    return 0


if __name__ == '__main__':
    sys.exit(main())
