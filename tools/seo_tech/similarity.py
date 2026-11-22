# -*- coding: utf-8 -*-
"""How close is each /es-ar/ page to its /es/ twin?

    python3 tools/seo_tech/similarity.py                 # table of every es-ar page + summary
    python3 tools/seo_tech/similarity.py --json out.json # also save {path: share}
    python3 tools/seo_tech/similarity.py --min 80        # only pages at or above 80 %
    python3 tools/seo_tech/similarity.py --base pt --variant pt-br

Measure: share of the 5-word shingles of the page's main text that also occur in the main text of the corresponding
base-language page (found through the page's own hreflang link). Main text = <main> (guides) or <body> without
header/footer/nav (homes), without scripts, styles, SVG and the automatic conversion blocks; lower-cased words.
100 % = every 5-word sequence of the regional page exists in the base page; below 50 % = mostly its own text."""
import glob, html, json, re, sys

N = 5


def arg(name, default=None):
    return sys.argv[sys.argv.index(name) + 1] if name in sys.argv else default


def main_text(doc):
    m = re.search(r'<main\b.*?</main>', doc, re.S)
    t = m.group(0) if m else re.sub(r'<(header|footer|nav)\b.*?</\1>', ' ', doc[doc.find('<body'):], flags=re.S)
    t = re.sub(r'<!--.*?-->', ' ', t, flags=re.S)
    t = re.sub(r'<(script|style|svg|noscript|template)\b.*?</\1>', ' ', t, flags=re.S)
    t = html.unescape(re.sub(r'<[^>]+>', ' ', t)).lower()
    return re.findall(r"[0-9a-záéíóúüñàâêôãõç]+(?:[.,][0-9]+)?", t)


def shingles(words):
    return {' '.join(words[i:i + N]) for i in range(len(words) - N + 1)}


def measure(variant='es-ar', base='es'):
    out = {}
    for p in sorted(glob.glob(f'{variant}/**/index.html', recursive=True)):
        doc = open(p, encoding='utf8').read()
        m = re.search(r'<link rel="alternate" hreflang="%s" href="https?://[^/"]+(/[^"]*)"' % re.escape(base), doc)
        if not m: continue
        bp = m.group(1).strip('/') + '/index.html'
        try: bdoc = open(bp, encoding='utf8').read()
        except OSError: continue
        w = main_text(doc); a = shingles(w); b = shingles(main_text(bdoc))
        if a: out['/' + p[:-len('index.html')]] = (round(100 * len(a & b) / len(a), 1), len(w))
    return out


if __name__ == '__main__':
    R = measure(arg('--variant', 'es-ar'), arg('--base', 'es'))
    lo = float(arg('--min', 0))
    for p, (s, w) in sorted(R.items(), key=lambda x: -x[1][0]):
        if s >= lo: print(f'{s:6.1f} %  {w:6} words  {p}')
    v = [s for s, _ in R.values()]
    if v:
        print(f'\n{len(v)} pages · median {sorted(v)[len(v) // 2]} % · above 80 %: {sum(s > 80 for s in v)} · 50–80 %: {sum(50 <= s <= 80 for s in v)} · below 50 %: {sum(s < 50 for s in v)}')
    if arg('--json'):
        json.dump({p: s for p, (s, _) in R.items()}, open(arg('--json'), 'w'), indent=1, sort_keys=True)
