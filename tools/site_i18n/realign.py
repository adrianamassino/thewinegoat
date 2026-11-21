# -*- coding: utf-8 -*-
"""Move translation files to the current English source when the English page changed, even if segments were added or
removed (stale.py / apply_delta.py only handle same-count changes). Unchanged English segments keep their translation;
only new or changed segments need translating.

    python3 tools/site_i18n/realign.py todo <group> [lang ...] [--json out.json]
        lists, per language, the segments to translate: {lang: {group: {"<index in src/<group>.json>": "English"}}}
    python3 tools/site_i18n/realign.py apply delta.json
        delta.json = the same shape with the translations; writes tools/site_i18n/<lang>/<group>.json against the
        current source (src_sha updated). Refuses a file if a needed segment is missing.
Then: python3 tools/site_i18n/build.py <lang> --group <group>"""
import json, os, sys, glob
D = 'tools/site_i18n'
f = lambda x: x['t'] if isinstance(x, dict) else x


def langs_with(g):
    return sorted(os.path.basename(os.path.dirname(p)) for p in glob.glob(f'{D}/*/{g}.json') if '/src/' not in p)


def plan(g, l):
    """(new src, old translation map {english: translation}, indices to translate)"""
    cur = json.load(open(f'{D}/src/{g}.json', encoding='utf8'))
    p = f'{D}/{l}/{g}.json'
    if not os.path.exists(p): return cur, {}, list(range(len(cur['segments'])))
    T = json.load(open(p, encoding='utf8'))
    if T.get('src_sha') == cur['sha']: return cur, {f(s): t for s, t in zip(cur['segments'], T['segments'])}, []
    old = json.load(open(f'{D}/src/_old/{g}.{T["src_sha"]}.json', encoding='utf8'))
    M = {f(s): t for s, t in zip(old['segments'], T['segments'])}
    need = [i for i, s in enumerate(cur['segments']) if f(s) not in M]
    return cur, M, need


def todo(g, langs, out=None):
    res = {}
    for l in langs or langs_with(g):
        cur, M, need = plan(g, l)
        if need: res.setdefault(l, {})[g] = {str(i): f(cur['segments'][i]) for i in need}
        print(f'{l}/{g}: {len(need)} segment(s) to translate, {len(cur["segments"]) - len(need)} kept')
    if out: json.dump(res, open(out, 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    return res


def apply(path):
    d = json.load(open(path, encoding='utf8'))
    for l, gs in d.items():
        for g, segs in gs.items():
            cur, M, need = plan(g, l)
            miss = [i for i in need if str(i) not in segs]
            if miss: print(f'✗ {l}/{g}: missing {miss}'); continue
            out = [segs.get(str(i)) or M[f(s)] for i, s in enumerate(cur['segments'])]
            os.makedirs(f'{D}/{l}', exist_ok=True)
            json.dump({'group': g, 'lang': l, 'src_sha': cur['sha'], 'segments': out}, open(f'{D}/{l}/{g}.json', 'w', encoding='utf8'), ensure_ascii=False, indent=0)
            print(f'✓ {l}/{g}: {len(segs)} new, {len(out) - len(segs)} kept')


if __name__ == '__main__':
    a = sys.argv[1:]
    if a[:1] == ['todo']:
        out = a[a.index('--json') + 1] if '--json' in a else None
        rest = [x for x in a[2:] if x != '--json' and x != out]
        todo(a[1], rest, out)
    elif a[:1] == ['apply']: apply(a[1])
    else: print(__doc__)
