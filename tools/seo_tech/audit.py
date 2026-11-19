"""Technical SEO audit of the static site (all indexable pages, sitemap, robots, icons, structured data).
Run from repo root: python3 tools/seo_tech/audit.py [--json out.json]. Exit 1 when a blocking problem is found."""
import glob, json, os, re, sys, html
from collections import Counter, defaultdict
D = 'https://thewinegoat.com'
SKIP = ('app/', 'mobile/', 'tools/', 'node_modules/', '.git/', 'img/', 'assets/')
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
for t, ps in titles.items():
    if len(ps) > 1: P['duplicate title'].append(f'{t!r}: {ps}')
for t, ps in descs.items():
    if len(ps) > 1: P['duplicate description'].append(f'{t[:60]!r}…: {ps}')
# sitemap
sm = open('sitemap.xml', encoding='utf8').read(); locs = re.findall(r'<loc>([^<]+)</loc>', sm)
for l, n in Counter(locs).items():
    if n > 1: P['sitemap duplicate'].append(l)
allurls = {url_of(p) for p in pages}
for l in locs:
    if not l.startswith(D + '/'): P['sitemap not https apex'].append(l)
    elif l not in allurls and not os.path.exists(l[len(D) + 1:] or 'index.html'): P['sitemap URL without page'].append(l)
    if l in noindex: P['sitemap contains noindex'].append(l)
for l in re.findall(r'<xhtml:link[^>]+href="([^"]+)"', sm):
    if not l.startswith(D + '/'): P['sitemap hreflang not https apex'].append(l)
missing = sorted(allurls - set(locs) - noindex - {D + '/404/'})
for m in missing: P['indexable page missing from sitemap'].append(m)
rb = open('robots.txt').read()
if re.search(r'(?im)^disallow:\s*/\S*', rb): P['robots Disallow (check)'].append(re.findall(r'(?im)^disallow:.*', rb))
if f'Sitemap: {D}/sitemap.xml' not in rb: P['robots sitemap line'].append('missing')
BLOCK = {k for k in P if not k.endswith('(info)') and not k.endswith('(check)') and k not in ('duplicate title', 'duplicate description', 'h1 count != 1', 'og:url missing')}
print(f'{len(pages)} pages, sitemap {len(locs)} URLs')
for k, v in sorted(P.items()):
    print(f'\n## {k}: {len(v)}' + ('  ✗' if k in BLOCK else ''))
    for x in v[:12]: print('  -', x)
if '--json' in sys.argv: json.dump(P, open(sys.argv[sys.argv.index('--json') + 1], 'w'), indent=1, ensure_ascii=False)
sys.exit(1 if any(P[k] for k in BLOCK) else 0)
