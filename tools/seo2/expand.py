# -*- coding: utf-8 -*-
"""Long-form study notes for every SEO page (204 pages, 51 groups x en/it/fr/es).
Reads tools/seo2/extra/<group>.json  ->  {"en": {"sections": [...], "faq": [[q, a], ...]}, "it": {...}, ...}
blocks: {"h2": t} {"h3": t} {"p": t} {"ul": [..]} {"ol": [..]} {"tip": t} {"table": {"head": [..], "rows": [[..]]}}
Injects (idempotent) a <section class="seosec more"> before the call-to-action, extra FAQ items (HTML + FAQPage
schema), bumps dateModified/wordCount and rewrites the study-notes part of llms-full.txt.
Run from the repo root after any page build:  python3 tools/seo2/expand.py"""
import json, re, os, glob, html
SITE = 'https://thewinegoat.com'; DATE = '2026-11-15'
INV = json.load(open('tools/seo2/extra/_inventory.json', encoding='utf8'))
e = html.escape
FAQH = {'en': 'Frequently asked questions', 'it': 'Domande frequenti', 'fr': 'Questions fréquentes', 'es': 'Preguntas frecuentes'}
B, E_ = '<!--more-->', '<!--/more-->'

def gkey(url):  # group file name from the English URL
    return url.strip('/').replace('/', '__') or 'home'

def blk(b):
    k, v = next(iter(b.items()))
    if k in ('h2', 'h3'): return f'<{k}>{e(v)}</{k}>'
    if k == 'p': return f'<p>{e(v)}</p>'
    if k == 'tip': return f'<p class="tipbox">{e(v)}</p>'
    if k in ('ul', 'ol'): return f'<{k} class="tips">' + ''.join(f'<li>{e(x)}</li>' for x in v) + f'</{k}>'
    if k == 'table':
        h, rows = v['head'], v['rows']
        t = '<div class="tblw"><table class="lvtab"><thead><tr>' + ''.join(f'<th>{e(x)}</th>' for x in h) + '</tr></thead><tbody>'
        for r in rows:
            t += '<tr>' + ''.join((f'<th scope="row">{e(c)}</th>' if i == 0 else f'<td data-l="{e(h[i] if i < len(h) else "")}">{e(c)}</td>') for i, c in enumerate(r)) + '</tr>'
        return t + '</tbody></table></div>'
    raise ValueError(k)

def text_of(sections):
    out = []
    for b in sections:
        k, v = next(iter(b.items()))
        if k == 'h2': out.append('\n### ' + v)
        elif k == 'h3': out.append('#### ' + v)
        elif k in ('p', 'tip'): out.append(v)
        elif k in ('ul', 'ol'): out += ['- ' + x for x in v]
        elif k == 'table': out += [' | '.join(v['head'])] + [' | '.join(r) for r in v['rows']]
    return '\n'.join(out)

done, llm = 0, []
for f in sorted(glob.glob('tools/seo2/extra/*.json')):
    if f.endswith('_inventory.json'): continue
    D = json.load(open(f, encoding='utf8'))
    grp = os.path.basename(f)[:-5]
    for p, d in INV.items():
        if gkey(d['en'] or d['url']) != grp or d['lang'] not in D: continue
        X = D[d['lang']]; s = open(p, encoding='utf8').read()
        s = re.sub(re.escape(B) + '.*?' + re.escape(E_), '', s, flags=re.S)  # remove an earlier run
        sec = B + '<section class="seosec more">' + ''.join(blk(b) for b in X['sections']) + '</section>' + E_
        for anchor in ('<section class="seocta"', '<section class="seosec rel"', '</article>'):
            if anchor in s: s = s.replace(anchor, sec + anchor, 1); break
        faq = X.get('faq', [])
        if faq:
            items = B + ''.join(f'<details class="faqi"><summary>{e(q)}</summary><p>{e(a)}</p></details>' for q, a in faq) + E_
            m = list(re.finditer(r'<details class="faqi">', s))
            if m:
                end = s.find('</section>', m[-1].start()); s = s[:end] + items + s[end:]
            else:
                box = B + f'<section class="seosec"><h2>{e(FAQH[d["lang"]])}</h2>' + items[len(B):-len(E_)] + '</section>' + E_
                anchor = '<section class="seosec rel"' if '<section class="seosec rel"' in s else '</article>'
                s = s.replace(anchor, box + anchor, 1)
        names = {q for q, _ in faq}
        def ld(m):
            try: J = json.loads(m.group(1))
            except Exception: return m.group(0)
            nodes = J.get('@graph', [J]) if isinstance(J, dict) else (J if isinstance(J, list) else [])
            for n in nodes:
                if not isinstance(n, dict): continue
                if n.get('@type') == 'FAQPage' and faq:
                    me = [q for q in n.get('mainEntity', []) if q.get('name') not in names]
                    n['mainEntity'] = me + [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq]
                    ld.faq_done = True
                if 'dateModified' in n: n['dateModified'] = DATE
            return '<script type="application/ld+json">' + json.dumps(J, ensure_ascii=False) + '</script>'
        ld.faq_done = False
        s = re.sub(r'<script type="application/ld\+json">(.*?)</script>', ld, s, flags=re.S)
        if faq and not ld.faq_done:
            J = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq]}
            s = s.replace('</head>', B + '<script type="application/ld+json">' + json.dumps(J, ensure_ascii=False) + '</script>' + E_ + '</head>', 1)
        if 'assets/deco.js' not in s: s = s.replace('</body>', '<script src="/assets/deco.js?v=3" defer></script></body>', 1)
        open(p, 'w', encoding='utf8').write(s); done += 1
        llm.append(f'## {d["h1"]}\nURL: {SITE}{d["url"]}\n{text_of(X["sections"])}\n' + ''.join(f'\nQ: {q}\nA: {a}\n' for q, a in faq))

L = open('llms-full.txt', encoding='utf8').read()
L = re.sub(r'\n# Study notes \(all pages\).*', '', L, flags=re.S)
open('llms-full.txt', 'w', encoding='utf8').write(L.rstrip() + '\n\n# Study notes (all pages)\n\n' + '\n'.join(llm))
print(done, 'pages expanded')
