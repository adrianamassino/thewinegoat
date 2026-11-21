# -*- coding: utf-8 -*-
"""The earlier Diploma page text (tools/seo2/extra/wset-diploma-level-4.json study notes + tools/seo2/content3.py FAQ),
kept and reorganised under the common level-guide structure by l4_<lang>.py. Blocks can be replaced or dropped by index
(corrections against the 2025 specification are made there, in each language)."""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
X = json.load(open(os.path.join(os.path.dirname(HERE), 'extra', 'wset-diploma-level-4.json'), encoding='utf8'))
# blocks of the old study notes that the new structure replaces: old heading, the 'assessment logic' section
# (superseded by the unit-by-unit exam table and the grading section) and the 'not available yet' section (D1 and D2 are in the app)
DROP = {0, 45, 46, 47, 50, 51}


def notes(l, over):
    out = []
    for i, b in enumerate(X[l]['sections']):
        if i in DROP: continue
        b = over.get(i, b)
        if b is None: continue
        k, v = next(iter(b.items()))
        if k == 'h2': out.append(['secmore', v])
        elif k in ('h3', 'p', 'tip'): out.append([k, v])
        elif k == 'ul': out.append(['tips', v])
        elif k == 'ol': out.append(['ol', v])
        elif k == 'table': out.append(['table', v['head'], v['rows']])
    return out


def faq(l, over, drop=()):
    import content3
    old = list(content3.PAGES['diploma'][l]['faq']) + [list(x) for x in X[l]['faq']]
    return [over.get(i, qa) for i, qa in enumerate(old) if i not in drop]
