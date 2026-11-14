# -*- coding: utf-8 -*-
"""Render one branded infographic per guide page and language (1200x630 WebP, descriptive file names)
and write tools/seo2/images.json (file, alt text, caption) used by build.py.
Needs a local server on the repo root:  python3 -m http.server 8810
Run from repo root:  python3 tools/seo2/images.py"""
import json, os, sys, html, subprocess, re, shutil
sys.path.insert(0, os.path.dirname(__file__))
from content import PAGES as P1
from content3 import PAGES as P3
from content4 import PAGES as P4

OUT = 'img/guides'; os.makedirs(OUT, exist_ok=True)
TMP = '/tmp/twg_info'; os.makedirs(TMP, exist_ok=True)
GOAT = {'format': 'exam', 'grapes': 'study', 'l2vsl3': 'vs', 'q1': 'quick', 'q2': 'quick', 'levels': 'levels', 'diploma': 'trophy',
        'vscms': 'explore', 'l1guide': 'books', 'l2grapes': 'peek', 'l2plan': 'scoot', 'dipstudy': 'guide', 'worth': 'final'}
KICK = {'format': 'WSET 3', 'grapes': 'WSET 3', 'l2vsl3': 'WSET 2 · 3', 'q1': 'WSET 1', 'q2': 'WSET 2', 'levels': 'WSET 1 · 2 · 3 · 4',
        'diploma': 'WSET 4 · Diploma', 'vscms': 'WSET · CMS', 'l1guide': 'WSET 1', 'l2grapes': 'WSET 2', 'l2plan': 'WSET 2', 'dipstudy': 'WSET 4 · Diploma', 'worth': 'WSET 1 · 2 · 3 · 4'}
INF = {'en': 'Infographic', 'it': 'Infografica', 'fr': 'Infographie', 'es': 'Infografía'}

def points(C):
    for b in C['body']:
        if b[0] == 'ul': return b[1][:4]
    for b in C['body']:
        if b[0] == 'table':
            return [' — '.join([r[0], r[-1]]) for r in b[2][:4]]
    for b in C['body']:
        if b[0] == 'qs': return [q[0] for q in b[1][:4]]
    return [C.get('tldr') or C['desc']]

def page_html(C, key):
    e = html.escape
    pts = ''.join(f'<li>{e(p)}</li>' for p in points(C))
    return f'''<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="/assets/site.css"><style>
html,body{{margin:0;width:1200px;height:630px;overflow:hidden}}
body{{background:radial-gradient(900px 500px at 100% 0%,#9b2c52 0%,transparent 60%),linear-gradient(135deg,#5c1530,#7a1f3d 55%,#3d1022);font-family:"DM Sans",sans-serif;color:#fff;position:relative}}
.k{{position:absolute;left:64px;top:56px;font-weight:800;letter-spacing:.14em;font-size:22px;color:#f2cf87}}
h1{{position:absolute;left:64px;top:96px;width:720px;margin:0;font-family:Fraunces,Georgia,serif;font-weight:800;font-size:{54 if len(C['h1'])<60 else 44}px;line-height:1.08}}
ul{{position:absolute;left:64px;bottom:96px;width:720px;margin:0;padding:0;list-style:none;display:grid;gap:12px}}
li{{font-size:23px;line-height:1.3;padding-left:34px;position:relative;color:#fbeef2}}li:before{{content:"";position:absolute;left:0;top:9px;width:16px;height:16px;border-radius:50%;background:#f2cf87}}
img{{position:absolute;right:30px;bottom:40px;width:360px;height:360px;object-fit:contain;filter:drop-shadow(0 18px 30px rgba(0,0,0,.35))}}
.b{{position:absolute;left:64px;bottom:40px;font-size:20px;color:#f2cf87;font-weight:700}}
</style></head><body><div class="k">{e(KICK[key])}</div><h1>{e(C['h1'])}</h1><ul>{pts}</ul><img src="/img/goats/{GOAT[key]}.webp"><div class="b">thewinegoat.com</div></body></html>'''

jobs, man = [], {}
for PP in (P1, P3, P4):
    for key, P in PP.items():
        for l in ('en', 'it', 'fr', 'es'):
            C = P[l]; slug = P['slug'][l]; name = slug.strip('/').split('/')[-1] + ('' if l == 'en' else '-' + l)
            f = f'{TMP}/{name}.html'; open(f, 'w', encoding='utf8').write(page_html(C, key))
            jobs.append((f'/tmp/twg_info/{name}.html', f'{TMP}/{name}.png', f'{OUT}/{name}.webp'))
            pts = points(C)
            alt = f'{INF[l]}: {C["h1"]} – ' + '; '.join(p.rstrip('.') for p in pts[:2])
            if len(alt) > 140: alt = alt[:137].rsplit(' ', 1)[0] + '…'
            man[slug] = {'file': f'/{OUT}/{name}.webp', 'alt': alt, 'cap': (C.get('tldr') or C['desc']).split('. ')[0].rstrip('.') + '.'}
# copy html files into the served tree temporarily
os.makedirs('_info_tmp', exist_ok=True)
for src, _, _ in jobs:
    shutil.move(src, '_info_tmp/' + os.path.basename(src))
js = "const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:630}});const J=%s;for(const [u,o] of J){await p.goto('http://localhost:8810/_info_tmp/'+u,{waitUntil:'networkidle'});await p.waitForTimeout(150);await p.screenshot({path:o});}await b.close();})();" % json.dumps([[os.path.basename(s), png] for s, png, _ in jobs])
open('/tmp/twg_render.js', 'w').write(js)
subprocess.run('NODE_PATH=$(npm root -g) node /tmp/twg_render.js', shell=True, check=True)
from PIL import Image
for _, png, webp in jobs:
    Image.open(png).convert('RGB').save(webp, 'WEBP', quality=82, method=6)
for f in os.listdir('_info_tmp'): os.remove('_info_tmp/' + f)
os.rmdir('_info_tmp')
json.dump(man, open('tools/seo2/images.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print(len(jobs), 'images')
