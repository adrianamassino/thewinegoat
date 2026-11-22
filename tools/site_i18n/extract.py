# -*- coding: utf-8 -*-
"""Extract the translatable segments of every English wine guide page (and of the English home, group `_home`, used
for the Thai and Turkish homes) into tools/site_i18n/src/<group>.json, and print the per-group counts.
Run from anywhere:   python3 tools/site_i18n/extract.py            (all groups)
                     python3 tools/site_i18n/extract.py wset-level-2 _home
src/<group>.json = {"group", "source", "url", "region", "sha", "words", "segments": [{"t": text, "k": kind, "n": note}]}
`sha` identifies this exact list: translators copy it into their file as "src_sha". When the English page changes and
the list changes, the previous version is kept in src/_old/<group>.<sha>.json so older translations still build."""
import os, re, sys, json, hashlib
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import common as C, seg, assets

SRC = f'{C.D}/src'
NOTE = {'title': 'SEO title: ≤ 62 characters', 'desc': 'meta description: 140–158 characters (ja/ko/zh: 70–90)', 'meta': 'keywords / image alt text: local search wording',
        'ld': 'structured data (FAQ, headline, breadcrumb): same wording as the visible text', 'attr': 'alt/title/aria text', 'data': 'home widget text: keep {s} {m} {n} {t} and emoji'}


def groups():
    G = {g: s['en'] for g, s in C.load_slugs().items()}
    G['_home'] = '/'
    return G


def sha_of(segs):
    return hashlib.sha1(json.dumps([s['t'] for s in segs], ensure_ascii=False).encode()).hexdigest()[:12]


def extract(g, url):
    region = 'body' if g == '_home' else 'main'
    src = 'index.html' if url == '/' else C.fs(url)
    doc = open(src, encoding='utf8').read()
    doc = re.sub(r'<!--lvseries-->.*?<!--/lvseries-->', '', doc, flags=re.S)   # added per language by tools/lvseries.py, never translated
    doc = re.sub(r'<!--gcta-->.*?<!--/gcta-->', '', doc, flags=re.S)   # conversion blocks: language-specific, re-added by tools/seo_tech/cta.py
    segs = seg.segments(doc, region)
    for s in segs:
        n = NOTE.get(s['k'])
        if n and s['k'] != 'text': s['n'] = n
    sh = sha_of(segs)
    out = {'group': g, 'source': src, 'url': url, 'region': region, 'sha': sh, 'words': seg.size(seg.visible_text(doc, region), 'en'),
           'segment_words': sum(len(seg.PH.sub('', s['t']).split()) for s in segs), 'segments': segs}
    p = f'{SRC}/{g}.json'
    if os.path.exists(p):
        old = json.load(open(p, encoding='utf8'))
        if old.get('sha') != sh:
            os.makedirs(f'{SRC}/_old', exist_ok=True)
            json.dump(old, open(f'{SRC}/_old/{g}.{old["sha"]}.json', 'w', encoding='utf8'), ensure_ascii=False, indent=0)
    json.dump(out, open(p, 'w', encoding='utf8'), ensure_ascii=False, indent=0)
    return out


def main(args):
    os.makedirs(SRC, exist_ok=True)
    G = groups()
    todo = [g for g in G if not args or g in args]
    rows = []
    for g in todo:
        o = extract(g, G[g])
        rows.append((g, len(o['segments']), o['segment_words'], o['words'], sum(len(s['t']) for s in o['segments'])))
    for g in assets.GROUPS:   # core/spirits pages, illustration and photo texts of the languages added later (assets.py)
        if args and g not in args: continue
        o = assets.extract(g)
        rows.append((g, len(o['segments']), o['segment_words'], o['words'], sum(len(s['t']) for s in o['segments'])))
    rows.sort(key=lambda r: (r[0].startswith('_'), r[0]))
    print(f'{"group":45} {"segments":>8} {"seg.words":>9} {"page words":>10} {"chars":>8}')
    for r in rows: print(f'{r[0]:45} {r[1]:8} {r[2]:9} {r[3]:10} {r[4]:8}')
    tot = [sum(r[i] for r in rows if not r[0].startswith('_')) for i in (1, 2, 3, 4)]
    print(f'{"TOTAL guides (" + str(len([r for r in rows if not r[0].startswith("_")])) + ")":45} {tot[0]:8} {tot[1]:9} {tot[2]:10} {tot[3]:8}')
    if args and os.path.exists(f'{SRC}/_counts.json'):   # partial run: keep the counts of the other groups
        cnt = json.load(open(f'{SRC}/_counts.json', encoding='utf8')); cnt.update({r[0]: {'segments': r[1], 'segment_words': r[2], 'page_words': r[3], 'chars': r[4]} for r in rows})
        json.dump(cnt, open(f'{SRC}/_counts.json', 'w', encoding='utf8'), indent=0); return
    json.dump({r[0]: {'segments': r[1], 'segment_words': r[2], 'page_words': r[3], 'chars': r[4]} for r in rows},
              open(f'{SRC}/_counts.json', 'w', encoding='utf8'), indent=0)


if __name__ == '__main__':
    main(sys.argv[1:])
