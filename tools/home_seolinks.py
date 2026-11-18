# -*- coding: utf-8 -*-
"""Home pages en/it/fr/es: the 'more resources' link list covered Level 3 only. Rename it to all levels and put the
Level 1 and Level 2 guides first. Idempotent. Run from the repo root."""
import json, re, html
I = json.load(open('tools/seo2/extra/_inventory.json', encoding='utf8'))
H = {'en': 'More WSET resources: Levels 1, 2 and 3', 'it': 'Altre risorse per il WSET: Livelli 1, 2 e 3',
     'fr': 'Autres ressources WSET : Niveaux 1, 2 et 3', 'es': 'Más recursos WSET: Niveles 1, 2 y 3'}
P = {'en': 'index.html', 'it': 'it/index.html', 'fr': 'fr/index.html', 'es': 'es/index.html'}
for l, p in P.items():
    s = open(p, encoding='utf8').read()
    m = re.search(r'<nav class="seolinks wrap" aria-label="[^"]*"><h2>[^<]*</h2><ul>', s)
    if not m: print(p, 'no nav'); continue
    pages = [d for d in I.values() if d['lang'] == l and re.search(r'(level|livello|niveau|nivel)-?[12]\b|wset-[12][-/]|-[12]/$', d['url'])]
    pages.sort(key=lambda d: (0 if re.search(r'1', d['url']) else 1, len(d['url'])))
    pages = [d for d in pages if f'href="{d["url"]}"' not in s[m.end():s.find('</nav>', m.end())]]
    li = ''.join(f'<li><a href="{d["url"]}">{html.escape(d["h1"])}</a></li>' for d in pages)
    s = s[:m.start()] + f'<nav class="seolinks wrap" aria-label="{html.escape(H[l])}"><h2>{html.escape(H[l])}</h2><ul>' + li + s[m.end():]
    open(p, 'w', encoding='utf8').write(s); print(p, len(pages))
