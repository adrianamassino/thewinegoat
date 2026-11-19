"""Homes: the WebPage JSON-LD 'name' must match the page <title> (it still had the old Level-3-only title). Idempotent."""
import glob, re, json, html
n = 0
for p in ['index.html'] + glob.glob('*/index.html'):
    s = open(p, encoding='utf8').read()
    if 'class="hero3' not in s: continue
    t = html.unescape(re.search(r'<title>(.*?)</title>', s, re.S).group(1).strip())
    def fix(m):
        global n
        d = json.loads(m.group(1)); g = d.get('@graph', [d]); ch = False
        for x in g:
            if x.get('@type') == 'WebPage' and x.get('name') != t: x['name'] = t; ch = True
        if not ch: return m.group(0)
        n += 1; return '<script type="application/ld+json">' + json.dumps(d, ensure_ascii=False) + '</script>'
    s2 = re.sub(r'<script type="application/ld\+json">(.*?)</script>', fix, s, flags=re.S)
    if s2 != s: open(p, 'w', encoding='utf8').write(s2)
print(n, 'homes fixed')
