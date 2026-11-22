# -*- coding: utf-8 -*-
"""Non-guide text of a site language as translation groups, in the same file format as the guides, so that a language
(tools/site_i18n/newlangs.py) is translated with one workflow and never by editing a file shared with other languages:

    _core     the 8 core pages        tools/seo_core/content/en_a.json + en_b.json + en_x.json
    _spirits  the 8 spirits pages     tools/seo_sp/content/en_a.json + en_b.json + en_x.json
    _images   goat illustrations and app screenshots: alt and title texts (tools/seo_tech/image_registry.json)
    _photos   free photos: alt and caption (img/photos/meta.json)

src/<group>.json is written by extract.py (same format as the guides: sha, segments [{t, k}]); a translation is
tools/site_i18n/<lang>/<group>.json = {"group", "lang", "src_sha", "segments": [...]}, same order and count.

emit(lang) (run by build.py for those languages) turns complete _core / _spirits translations into
tools/seo_core/content/<lang>.json + <lang>_x.json and tools/seo_sp/content/<lang>.json + <lang>_x.json (per-language
files, published by tools/seo_core/build.py and tools/seo_sp/build.py once the language's home exists). _images and
_photos are read at build time by tools/seo_tech/images.py and place_photos.py through text_map(); nothing shared is
written. An incomplete or invalid file is ignored as a whole (its pages are not published, nothing falls back to
English inside a page)."""
import os, re, json, hashlib

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
D = 'tools/site_i18n'
GROUPS = ['_core', '_spirits', '_images', '_photos']
PH = re.compile(r'\{/?\d+\}')


def _jl(p): return json.load(open(os.path.join(ROOT, p), encoding='utf8'))


def walk(o, fn, key=None, inbody=False):
    """apply fn(text, kind) to every translatable string of a core/spirits content object (same walk as tm.py)"""
    if isinstance(o, str): return fn(o, key if key in ('title', 'desc') else 'meta' if key == 'kw' else 'text')
    if isinstance(o, dict): return {k: walk(v, fn, k, k == 'body') for k, v in o.items()}
    if isinstance(o, list):
        if inbody: return [[b[0]] + [walk(x, fn) for x in b[1:]] for b in o]
        return [walk(x, fn) for x in o]
    return o


def core_en(d):
    C = {}
    for f in ('en_a', 'en_b'): C.update(_jl(f'tools/{d}/content/{f}.json'))
    return C, _jl(f'tools/{d}/content/en_x.json')


def source(g):
    """[(text, kind)] of an asset group, in order, without duplicates"""
    out = []
    if g in ('_core', '_spirits'):
        C, X = core_en('seo_core' if g == '_core' else 'seo_sp')
        walk(C, lambda t, k: out.append((t, k)) or t); walk(X, lambda t, k: out.append((t, k)) or t)
    elif g == '_images':
        R = _jl('tools/seo_tech/image_registry.json')
        for v in R['goats'].values():
            for f in ('alt', 'title'):
                if isinstance(v.get(f), dict) and v[f].get('en'): out.append((v[f]['en'], 'attr'))
        for v in R['common'].values():
            if isinstance(v, dict) and v.get('en'): out.append((v['en'], 'attr'))
        for f in ('alt', 'title'):   # app screenshots (the phone on the home)
            v = R['shots'].get('_meta', {}).get(f)
            if isinstance(v, dict) and v.get('en'): out.append((v['en'], 'attr'))
    elif g == '_photos':
        for m in _jl('img/photos/meta.json'):
            if m.get('file'): out += [(m['alt'], 'attr'), (m['caption'], 'text')]
    seen, res = set(), []
    for t, k in out:
        if t in seen or not re.search(r'[A-Za-z]', PH.sub('', t)): continue
        seen.add(t); res.append((t, k))
    return res


NOTE = {'title': 'SEO title: ≤ 62 characters', 'desc': 'meta description: 140–158 characters', 'meta': 'keywords: local search wording',
        'attr': 'image alt/title text: describe the image in the language, no keyword stuffing'}


def extract(g):
    segs = [dict(t=t, k=k, **({'n': NOTE[k]} if k in NOTE else {})) for t, k in source(g)]
    sh = hashlib.sha1(json.dumps([s['t'] for s in segs], ensure_ascii=False).encode()).hexdigest()[:12]
    words = sum(len(PH.sub('', s['t']).split()) for s in segs)
    out = {'group': g, 'source': {'_core': 'tools/seo_core/content', '_spirits': 'tools/seo_sp/content', '_images': 'tools/seo_tech/image_registry.json',
                                  '_photos': 'img/photos/meta.json'}[g], 'url': None, 'region': None, 'sha': sh, 'words': words, 'segment_words': words, 'segments': segs}
    p = os.path.join(ROOT, f'{D}/src/{g}.json')
    if os.path.exists(p):
        old = json.load(open(p, encoding='utf8'))
        if old.get('sha') != sh:
            os.makedirs(os.path.join(ROOT, f'{D}/src/_old'), exist_ok=True)
            json.dump(old, open(os.path.join(ROOT, f'{D}/src/_old/{g}.{old["sha"]}.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=0)
    json.dump(out, open(p, 'w', encoding='utf8'), ensure_ascii=False, indent=0)
    return out


def text_map(l, g, validate=None):
    """{english: translation} of a complete, valid translation file of an asset group, else {} (with the reason)"""
    p = os.path.join(ROOT, f'{D}/{l}/{g}.json')
    if not os.path.exists(p): return {}
    try:
        T = json.load(open(p, encoding='utf8'))
        S = json.load(open(os.path.join(ROOT, f'{D}/src/{g}.json'), encoding='utf8'))
    except Exception as x:
        print(f'  ✗ {l}/{g}: {x}'); return {}
    if T.get('src_sha') != S['sha']:
        old = os.path.join(ROOT, f'{D}/src/_old/{g}.{T.get("src_sha")}.json')
        if not os.path.exists(old): print(f'  ✗ {l}/{g}: src_sha {T.get("src_sha")} unknown'); return {}
        S = json.load(open(old, encoding='utf8'))
    if validate:
        err, warn = validate(l, g, S, T)
        if err:
            for x in err[:12]: print(f'  ✗ {l}/{g}: {x}')
            return {}
    elif len(T.get('segments', [])) != len(S['segments']): return {}
    return {s['t']: t for s, t in zip(S['segments'], T['segments'])}


def emit(l, validate=None):
    """write the core/spirits content files of language l when their translation is complete; returns the groups written"""
    done = []
    for g, d in (('_core', 'seo_core'), ('_spirits', 'seo_sp')):
        M = text_map(l, g, validate)
        if not M: continue
        C, X = core_en(d)
        miss = []
        def tr(t, k):
            if not re.search(r'[A-Za-z]', PH.sub('', t)): return t
            if t in M: return M[t]
            miss.append(t); return t
        c2, x2 = walk(C, tr), walk(X, tr)
        if miss:
            print(f'  = {l}/{g}: not published, {len(miss)} string(s) of the current English pages are not translated, e.g. {miss[0][:70]!r}'); continue
        for name, obj in ((f'tools/{d}/content/{l}.json', c2), (f'tools/{d}/content/{l}_x.json', x2)):
            p = os.path.join(ROOT, name); s = json.dumps(obj, ensure_ascii=False, indent=0)
            if not os.path.exists(p) or open(p, encoding='utf8').read() != s: open(p, 'w', encoding='utf8').write(s)
        done.append(g)
    return done
