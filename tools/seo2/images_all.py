# -*- coding: utf-8 -*-
"""Infographic + image SEO for every remaining sub-page that still uses the generic og image
(topic question pages, older guides, hubs, school pages). Reads each page, renders a 1200x630 WebP
with its title and three key points, then injects: <figure> under the H1, og:image/twitter:image,
ImageObject in the JSON-LD and an <image:image> entry in sitemap.xml.
Needs: python3 -m http.server 8810 on the repo root.  Run: python3 tools/seo2/images_all.py"""
import re, os, glob, json, html, shutil, subprocess
from PIL import Image
SITE = 'https://thewinegoat.com'; OUT = 'img/guides'; TMPD = '_info_tmp'
INF = {'en': 'Infographic', 'it': 'Infografica', 'fr': 'Infographie', 'es': 'Infografía'}
GOATS = ['exam', 'study', 'quick', 'peek', 'books', 'guide', 'explore', 'scoot', 'trophy', 'levels', 'final', 'leap', 'method', 'inside']
TOPIC_GOAT = {'bordeaux': 'explore', 'burdeos': 'explore', 'sherry': 'peek', 'xeres': 'peek', 'jerez': 'peek', 'champagne': 'leap', 'sparkling': 'leap', 'spumanti': 'leap', 'effervescents': 'leap', 'espumosos': 'leap',
              'tasting': 'study', 'sat': 'study', 'cata': 'study', 'degustazione': 'study', 'degustation': 'study', 'food': 'final', 'abbinamento': 'final', 'maridaje': 'final', 'accords': 'final'}
e = html.escape

def lang_of(p):
    for l in ('it', 'fr', 'es'):
        if p.startswith(l + '/'): return l
    return 'en'

def kicker(url, l):
    if 'wset-1' in url or 'level-1' in url or 'livello-1' in url or 'niveau-1' in url or 'nivel-1' in url: return 'WSET 1'
    if 'wset-2' in url or 'level-2' in url or 'livello-2' in url or 'niveau-2' in url or 'nivel-2' in url: return 'WSET 2'
    if any(k in url for k in ('schools', 'scuole', 'ecoles', 'escuelas')): return {'en': 'For wine schools', 'it': 'Per le scuole', 'fr': 'Pour les écoles', 'es': 'Para escuelas'}[l]
    return 'WSET 3'

def points(s):
    main = s[s.find('<main'):s.find('</main>')]
    pts = [re.sub(r'<[^>]+>', '', x) for x in re.findall(r'<h3><span class="sqn">\d+</span>(.*?)</h3>', main)]
    if len(pts) < 3: pts += [re.sub(r'<[^>]+>', '', x) for x in re.findall(r'<li>(?!<a)(.*?)</li>', main) if len(re.sub(r'<[^>]+>', '', x)) > 20]
    if len(pts) < 3: pts += [re.sub(r'<[^>]+>', '', x) for x in re.findall(r'<h2>(.*?)</h2>', main)]
    pts = [html.unescape(p).strip() for p in pts if p.strip()]
    return [p if len(p) <= 90 else p[:87].rsplit(' ', 1)[0] + '…' for p in pts[:3]]

def card(h1, kick, pts, goat):
    lis = ''.join(f'<li>{e(p)}</li>' for p in pts)
    fs = 54 if len(h1) < 55 else 46 if len(h1) < 75 else 40
    return f'''<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="/assets/site.css"><style>
html,body{{margin:0;width:1200px;height:630px;overflow:hidden}}
body{{background:radial-gradient(900px 500px at 100% 0%,#9b2c52 0%,transparent 60%),linear-gradient(135deg,#5c1530,#7a1f3d 55%,#3d1022);font-family:"DM Sans",sans-serif;color:#fff;position:relative}}
.k{{position:absolute;left:64px;top:56px;font-weight:800;letter-spacing:.14em;font-size:22px;color:#f2cf87;text-transform:uppercase}}
h1{{position:absolute;left:64px;top:96px;width:740px;margin:0;font-family:Fraunces,Georgia,serif;font-weight:800;font-size:{fs}px;line-height:1.08}}
ul{{position:absolute;left:64px;bottom:96px;width:740px;margin:0;padding:0;list-style:none;display:grid;gap:12px}}
li{{font-size:22px;line-height:1.3;padding-left:34px;position:relative;color:#fbeef2}}li:before{{content:"";position:absolute;left:0;top:8px;width:16px;height:16px;border-radius:50%;background:#f2cf87}}
img{{position:absolute;right:30px;bottom:40px;width:350px;height:350px;object-fit:contain;filter:drop-shadow(0 18px 30px rgba(0,0,0,.35))}}
.b{{position:absolute;left:64px;bottom:40px;font-size:20px;color:#f2cf87;font-weight:700}}
</style></head><body><div class="k">{e(kick)}</div><h1>{e(h1)}</h1><ul>{lis}</ul><img src="/img/goats/{goat}.webp"><div class="b">thewinegoat.com</div></body></html>'''

pages = []
for p in sorted(glob.glob('**/index.html', recursive=True)):
    if p.startswith(('app/', 'tools/', TMPD)) or p.count('/') < 1: continue
    s = open(p, encoding='utf8').read()
    if 'seofig' in s or 'class="seo"' not in s: continue
    m = re.search(r'og:image" content="([^"]*)"', s)
    if m and '/img/guides/' in m.group(1): continue
    pages.append(p)

os.makedirs(OUT, exist_ok=True); os.makedirs(TMPD, exist_ok=True)
jobs, meta = [], {}
for i, p in enumerate(pages):
    s = open(p, encoding='utf8').read(); l = lang_of(p); url = '/' + p[:-10]
    h1 = html.unescape(re.sub(r'<[^>]+>', '', re.search(r'<h1[^>]*>(.*?)</h1>', s, re.S).group(1))).strip()
    pts = points(s); name = re.sub(r'[^a-z0-9-]+', '-', p[:-11].lower()).strip('-').replace('/', '-')
    goat = next((g for k, g in TOPIC_GOAT.items() if k in url), GOATS[i % len(GOATS)])
    open(f'{TMPD}/{name}.html', 'w', encoding='utf8').write(card(h1, kicker(url, l), pts, goat))
    alt = f'{INF[l]}: {h1} – ' + '; '.join(x.rstrip('.…') for x in pts[:2])
    if len(alt) > 140: alt = alt[:137].rsplit(' ', 1)[0] + '…'
    d = re.search(r'<meta name="description" content="([^"]*)"', s)
    cap = html.unescape(d.group(1)).split('. ')[0].rstrip('.') + '.' if d else h1
    jobs.append((name, f'/tmp/{name}.png', f'{OUT}/{name}.webp')); meta[p] = (f'/{OUT}/{name}.webp', alt, cap, l, h1)

js = "const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:630}});const J=%s;for(const [u,o] of J){await p.goto('http://localhost:8810/%s/'+u+'.html',{waitUntil:'networkidle'});await p.waitForTimeout(120);await p.screenshot({path:o});}await b.close();})();" % (json.dumps([[n, png] for n, png, _ in jobs]), TMPD)
open('/tmp/twg_render_all.js', 'w').write(js)
subprocess.run('NODE_PATH=$(npm root -g) node /tmp/twg_render_all.js', shell=True, check=True)
for _, png, webp in jobs:
    Image.open(png).convert('RGB').save(webp, 'WEBP', quality=80, method=6)
shutil.rmtree(TMPD)

sm = open('sitemap.xml', encoding='utf8').read()
if 'xmlns:image' not in sm: sm = sm.replace('<urlset ', '<urlset xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" ', 1)
for p, (f, alt, cap, l, h1) in meta.items():
    s = open(p, encoding='utf8').read(); url = SITE + '/' + p[:-10]
    fig = f'<figure class="seofig"><img src="{f}" alt="{e(alt)}" title="{e(h1)}" width="1200" height="630" loading="lazy" decoding="async"><figcaption>{e(cap)}</figcaption></figure>'
    if re.search(r'<p class="lead">', s): s = re.sub(r'(<p class="lead">.*?</p>)', lambda m: m.group(1) + fig, s, count=1, flags=re.S)
    else: s = re.sub(r'(</h1>)', lambda m: m.group(1) + fig, s, count=1)
    full = SITE + f
    s = re.sub(r'(<meta property="og:image" content=")[^"]*(")', lambda m: m.group(1) + full + m.group(2), s)
    if 'og:image:alt' not in s: s = s.replace('<meta name="twitter:card"', f'<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="{e(alt)}"><meta name="twitter:image" content="{full}"><meta name="twitter:card"', 1)
    def ld(m):
        try: J = json.loads(m.group(1))
        except Exception: return m.group(0)
        img = {"@type": "ImageObject", "url": full, "contentUrl": full, "width": 1200, "height": 630, "caption": cap, "description": alt, "inLanguage": l}
        nodes = J.get('@graph', [J]) if isinstance(J, dict) else []
        for n in nodes:
            if isinstance(n, dict) and n.get('@type') in ('WebPage', 'Article', 'CollectionPage', 'Quiz'): n['image'] = img; break
        return '<script type="application/ld+json">' + json.dumps(J, ensure_ascii=False) + '</script>'
    s = re.sub(r'<script type="application/ld\+json">(.*?)</script>', ld, s, count=1, flags=re.S)
    open(p, 'w', encoding='utf8').write(s)
    loc = f'<loc>{url}</loc>'
    if loc in sm:
        i = sm.find(loc); j = sm.find('</url>', i)
        if 'image:image' not in sm[i:j]:
            sm = sm[:j] + f'<image:image><image:loc>{full}</image:loc><image:title>{e(h1)}</image:title><image:caption>{e(cap)}</image:caption></image:image>' + sm[j:]
open('sitemap.xml', 'w', encoding='utf8').write(sm)
print(len(meta), 'pages illustrated')
