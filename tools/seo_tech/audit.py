"""Technical SEO audit of the static site (all indexable pages, sitemap index + language sitemaps, internal links, robots, icons,
structured data).
Run from repo root: python3 tools/seo_tech/audit.py [--json out.json]. Exit 1 when a blocking problem is found."""
import glob, json, os, re, sys, html
from collections import Counter, defaultdict
D = 'https://thewinegoat.com'
SKIP = ('app/', 'mobile/', 'tools/', 'node_modules/', '.git/', 'img/', 'assets/')
# Documented exceptions: the only public pages that may carry noindex (anything else with noindex fails the audit)
EXPECTED_NOINDEX = {'admin/index.html',          # admin console
                    'delete-account/index.html', # account deletion page required by the app stores, not a search landing page
                    'en/index.html',             # redirect stub to / (English lives at the root)
                    'it/capre/index.html'}       # internal goat gallery
pages = sorted(p for p in glob.glob('**/index.html', recursive=True) if not p.startswith(SKIP))
P = defaultdict(list); titles = defaultdict(list); descs = defaultdict(list); noindex = set()
def url_of(p): d = os.path.dirname(p); return D + '/' + (d + '/' if d else '')
for p in pages:
    s = open(p, encoding='utf8').read(); head = s[:s.find('</head>')] if '</head>' in s else s
    u = url_of(p)
    if re.search(r'<meta[^>]+name=["\']robots["\'][^>]+content=["\'][^"\']*noindex', head, re.I):
        noindex.add(u); P['noindex (info)'].append(p); continue   # redirect stubs / private pages: not indexable, no further checks
    can = re.findall(r'<link[^>]+rel=["\']canonical["\'][^>]*>', s)
    hrefs = [re.search(r'href=["\']([^"\']+)', c).group(1) for c in can if re.search(r'href=', c)]
    if len(can) != 1: P['canonical count != 1'].append(f'{p} ({len(can)})')
    for h in hrefs:
        if not h.startswith(D + '/'): P['canonical not https apex'].append(f'{p} → {h}')
        elif h != u: P['canonical not self'].append(f'{p} → {h}')
    rob = re.findall(r'<meta[^>]+name=["\']robots["\'][^>]+content=["\']([^"\']+)', head, re.I)
    if any('noindex' in r.lower() for r in rob): noindex.add(u); P['noindex (info)'].append(p)
    og = re.findall(r'<meta[^>]+property=["\']og:url["\'][^>]+content=["\']([^"\']+)', head)
    if og and og[0] != u: P['og:url != canonical'].append(f'{p} → {og[0]}')
    if not og: P['og:url missing'].append(p)
    for h in re.findall(r'(?:href|src|content)=["\'](http://(?:www\.)?thewinegoat\.com[^"\']*|https://www\.thewinegoat\.com[^"\']*)', s):
        P['link to http/www variant'].append(f'{p} → {h}')
    for h in re.findall(r'<link[^>]+hreflang=["\'][^"\']+["\'][^>]+href=["\']([^"\']+)', head):
        if not h.startswith(D + '/'): P['hreflang not https apex'].append(f'{p} → {h}')
    t = re.findall(r'<title>(.*?)</title>', head, re.S)
    if len(t) != 1: P['title count != 1'].append(f'{p} ({len(t)})')
    else: titles[html.unescape(t[0].strip())].append(p)
    ds = re.findall(r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']*)', head)
    if len(ds) != 1: P['description count != 1'].append(f'{p} ({len(ds)})')
    else: descs[ds[0]].append(p)
    body = s[s.find('<body'):]
    body_nojs = re.sub(r'<script.*?</script>|<template.*?</template>', '', body, flags=re.S)
    h1 = re.findall(r'<h1[\s>]', body_nojs)
    if len(h1) != 1: P['h1 count != 1'].append(f'{p} ({len(h1)})')
    icons = re.findall(r'<link[^>]+rel=["\'](?:shortcut )?icon["\'][^>]*>', head)
    if not icons: P['no favicon link'].append(p)
    for blk in re.findall(r'<script type="application/ld\+json">(.*?)</script>', s, re.S):
        try: json.loads(blk)
        except Exception as e: P['invalid JSON-LD'].append(f'{p}: {e}')
    if '"@id": "https://thewinegoat.com/#organization", "name": "The Wine Goat"' not in s: P['no canonical Organization JSON-LD, run tools/geo/sitewide.py (check)'].append(p)
    if re.search(r'"@id": "https://thewinegoat\.com(/[a-z-]+)?/#(org|site)"', s): P['old #org/#site JSON-LD id, run tools/geo/sitewide.py (check)'].append(p)
    if 'class="fabout"' not in body: P['footer without About link, run tools/geo/sitewide.py (check)'].append(p)
    if not re.search(r'<meta[^>]+name=["\']viewport', head): P['no viewport'].append(p)
    if not re.search(r'<html[^>]+lang=', s[:400]): P['no html lang'].append(p)
for p_ in sorted(P.get('noindex (info)', [])):
    if p_ not in EXPECTED_NOINDEX: P['unexpected noindex (add to EXPECTED_NOINDEX in audit.py only if intended)'].append(p_)
# hreflang: every code's language must be the language of the page it points to (<html lang>)
LANG = {}
for p_ in pages:
    m_ = re.search(r'<html[^>]+lang=["\']([^"\']+)', open(p_, encoding='utf8').read(600)); LANG[url_of(p_)] = (m_.group(1) if m_ else '').lower()
for p_ in pages:
    if url_of(p_) in noindex: continue
    head_ = open(p_, encoding='utf8').read(); head_ = head_[:head_.find('</head>')]
    for code, h in re.findall(r'<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"', head_):
        if code == 'x-default': continue
        if h not in LANG: P['hreflang points to a page that does not exist or is not indexable'].append(f'{p_} → {code} {h}')
        elif {'no': 'nb'}.get(LANG[h].split('-')[0], LANG[h].split('-')[0]) != {'no': 'nb'}.get(code.lower().split('-')[0], code.lower().split('-')[0]):   # no = nb (Norwegian Bokmål)
            P['hreflang language differs from the target page language'].append(f'{p_} → {code} {h} (lang={LANG[h]})')
        elif h in noindex: P['hreflang points to a page that does not exist or is not indexable'].append(f'{p_} → {code} {h}')
for t, ps in titles.items():
    if len(ps) > 1: P['duplicate title'].append(f'{t!r}: {ps}')
for t, ps in descs.items():
    if len(ps) > 1: P['duplicate description'].append(f'{t[:60]!r}…: {ps}')
# sitemaps: /sitemap.xml is an index, one sitemap per language next to it; all written by tools/seo_tech/sitemaps.py from the built pages
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sitemaps as SMX, internal_links as IL
disk = SMX.on_disk(); inv = SMX.scan(); state = SMX.date_pages(inv, SMX.load_state())
if 'sitemap.xml' not in disk: P['sitemap'].append('sitemap.xml is missing')
else:
    for b in SMX.validate(disk, inv): P['sitemap'].append(b)   # well-formed, namespaces, limits, index → existing files, every URL an indexable self-canonical page, none missing, none twice
fresh = SMX.build(inv, 'xmlns:xhtml' in ''.join(disk.values()))
for n in sorted(set(fresh) | set(disk)):
    if fresh.get(n) != disk.get(n): P['sitemap out of date, run tools/seo_tech/sitemaps.py'].append(n)
if state != SMX.load_state(): P['sitemap out of date, run tools/seo_tech/sitemaps.py'].append(SMX.STATE)
listed = SMX.listed_urls(); locs = list(listed)
allurls = {url_of(p) for p in pages}
for l in locs:
    if not l.startswith(D + '/'): P['sitemap not https apex'].append(l)
    elif l not in allurls and not os.path.exists(l[len(D) + 1:] or 'index.html'): P['sitemap URL without page'].append(l)
    if l in noindex: P['sitemap contains noindex'].append(l)
for n, x in disk.items():
    for l in re.findall(r'<xhtml:link[^>]+href="([^"]+)"', x):
        if not l.startswith(D + '/'): P['sitemap hreflang not https apex'].append(l)
missing = sorted(allurls - set(locs) - noindex - {D + '/404/'})
for m in missing: P['indexable page missing from sitemap'].append(m)
if os.path.exists(SMX.IMAGES):   # image sitemap (tools/seo_tech/images.py): only indexable pages, only files that exist
    im = open(SMX.IMAGES, encoding='utf8').read(); okurls = {d['url'] for d in inv if d['reason'] is None}
    for l in re.findall(r'<url><loc>([^<]+)</loc>', im):
        if html.unescape(l) not in okurls: P['image sitemap lists a page that is not indexable'].append(l)
    for l in set(re.findall(r'<image:loc>([^<]+)</image:loc>', im)):
        if not os.path.isfile(html.unescape(l)[len(D) + 1:]): P['image sitemap lists a missing file'].append(l)
# internal links: every indexable page reachable from the home of its language without leaving that language; links stay in the page's language
SI = IL.Site()
for l_ in SI.locales():
    dist = SI.crawl(l_)
    for o in SI.members(l_):
        if o not in dist: P['page not reachable from the home of its language (run tools/seo_tech/internal_links.py)'].append(o)
        elif dist[o] > 3: P['page more than 3 clicks from the home of its language (run tools/seo_tech/internal_links.py)'].append(f'{o} ({dist[o]} clicks)')
for p_ in SI.pages:
    if SI.pages[p_]['reason'] is None and IL.remap(SI, p_)[1]: P['link to another language although the page exists in this one (run tools/seo_tech/internal_links.py)'].append(p_)
rb = open('robots.txt').read()
if re.search(r'(?im)^disallow:\s*/\S*', rb): P['robots Disallow (check)'].append(re.findall(r'(?im)^disallow:.*', rb))
if f'Sitemap: {D}/sitemap.xml' not in rb: P['robots sitemap line'].append('missing')
BLOCK = {k for k in P if not k.endswith('(info)') and not k.endswith('(check)') and k not in ('duplicate title', 'duplicate description', 'h1 count != 1', 'og:url missing')}
print(f'{len(pages)} pages; sitemap index → {len(set(listed.values()))} language sitemaps, {len(locs)} URLs')
for k, v in sorted(P.items()):
    print(f'\n## {k}: {len(v)}' + ('  ✗' if k in BLOCK else ''))
    for x in v[:12]: print('  -', x)
if '--json' in sys.argv: json.dump(P, open(sys.argv[sys.argv.index('--json') + 1], 'w'), indent=1, ensure_ascii=False)
sys.exit(1 if any(P[k] for k in BLOCK) else 0)
