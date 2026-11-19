"""Regional variants (es-ar vs es, pt-br vs pt) had identical <title>s: give the regional page its own title
(+ og:title / twitter:title). Idempotent; called at the end of tools/site_i18n/build.py and runnable alone."""
import glob, re, html
PAIRS = {'es-ar': ('es', 'Argentina'), 'pt-br': ('pt', 'Brasil')}
def run():
    n = 0
    base_titles = {}
    for v, (b, _) in PAIRS.items():
        for p in glob.glob(f'{b}/**/index.html', recursive=True):
            t = re.search(r'<title>(.*?)</title>', open(p, encoding='utf8').read(), re.S)
            if t: base_titles.setdefault(v, set()).add(t.group(1).strip())
    for v, (b, region) in PAIRS.items():
        for p in glob.glob(f'{v}/**/index.html', recursive=True):
            s = open(p, encoding='utf8').read(); m = re.search(r'<title>(.*?)</title>', s, re.S)
            if not m or m.group(1).strip() not in base_titles.get(v, ()): continue
            old = m.group(1).strip()
            new = old.replace(' | The Wine Goat', f' | The Wine Goat {region}') if old.endswith(' | The Wine Goat') else f'{old} · {region}'
            s = s.replace(f'<title>{old}</title>', f'<title>{new}</title>', 1)
            for prop in ('og:title', 'twitter:title'):
                s = re.sub(r'(<meta (?:property|name)="%s" content=")%s(")' % (prop, re.escape(old)), lambda mm: mm.group(1) + new + mm.group(2), s)
            open(p, 'w', encoding='utf8').write(s); n += 1
    return n
if __name__ == '__main__': print(run(), 'regional titles made unique')
