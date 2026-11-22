# -*- coding: utf-8 -*-
"""Translation memory helper for adding a whole site language in one pass (used for ro and bg).

Every English string of the translation groups in tools/site_i18n/src (home, guides, and the asset groups _core,
_spirits, _images, _photos of tools/site_i18n/assets.py) is translated once into tools/site_i18n/tm/<lang>.json
({english: translation}), so a string repeated across pages is translated once; `emit` then writes the regular
per-group files tools/site_i18n/<lang>/<group>.json for every complete group, which build.py validates and publishes.
Optional: a translator may also write the group files directly (TRANSLATE.md). One agent per language uses tm.py
(<lang>.pending.json is per language).

    python3 tools/site_i18n/tm/tm.py next ro [words]     # print the next untranslated strings (numbered), remember them
    python3 tools/site_i18n/tm/tm.py add ro FILE         # FILE: one "N<TAB>translation" line per printed string
    python3 tools/site_i18n/tm/tm.py emit ro [--force]   # write tools/site_i18n/ro/<group>.json for every complete group
    python3 tools/site_i18n/tm/tm.py stat ro
"""
import os, sys, re, json
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
os.chdir(ROOT)
TM = 'tools/site_i18n/tm'
PH = re.compile(r'\{/?\d+\}'); VARS = re.compile(r'\{[a-z]\}')


def jl(p): return json.load(open(p, encoding='utf8'))


def groups():
    """translation groups in working order: the home, the asset groups, then the guides (batches.json order)"""
    order = ['_home', '_images', '_core', '_spirits', '_photos'] + [g for b in jl('tools/site_i18n/batches.json') for g in b]
    order += [g for g in jl('tools/site_i18n/slugs.json') if g not in order]
    return [g for g in order if os.path.exists(f'tools/site_i18n/src/{g}.json')]


def sources():
    """ordered [(group, text, kind)] of every group (tools/site_i18n/src, written by extract.py)"""
    out = []
    for g in groups(): out += [(g, s['t'], s['k']) for s in jl(f'tools/site_i18n/src/{g}.json')['segments']]
    return out


def load(l):
    p = f'{TM}/{l}.json'
    return jl(p) if os.path.exists(p) else {}


def auto(t):
    """strings that need no translation: no letters at all"""
    return not re.search(r'[A-Za-zÀ-ÿ]', PH.sub('', t))


def pending(l):
    M = load(l); seen = set(); out = []
    for b, t, k in sources():
        if t in M or t in seen or auto(t): continue
        seen.add(t); out.append((b, t, k))
    return out


def cmd_next(l, words=2800):
    P = pending(l); take = []; w = 0
    for b, t, k in P:
        take.append((b, t, k)); w += len(t.split())
        if w >= words: break
    json.dump([t for _, t, _ in take], open(f'{TM}/{l}.pending.json', 'w', encoding='utf8'), ensure_ascii=False)
    cur = None
    for i, (b, t, k) in enumerate(take, 1):
        if b != cur: print(f'## {b}'); cur = b
        tag = {'title': '[T≤62] ', 'desc': '[D140-158] ', 'meta': '[kw] '}.get(k, '')
        print(f'{i}\t{tag}{t}')
    print(f'-- {len(take)} strings, {w} words; remaining after this: {len(P) - len(take)} strings, {sum(len(t.split()) for _, t, _ in P) - w} words')


def nums(t): return sorted(re.findall(r'\d+(?:[.,]\d+)?', PH.sub('', t).replace(',', '')))


def cmd_add(l, f):
    S = jl(f'{TM}/{l}.pending.json'); M = load(l)
    kinds = {t: k for _, t, k in sources()}
    lines = [x for x in open(f, encoding='utf8').read().split('\n') if x.strip()]
    err = []; warn = []; new = {}
    if len(lines) != len(S): err.append(f'{len(lines)} lines, expected {len(S)}')
    for i, x in enumerate(lines, 1):
        m = re.match(r'(\d+)\t(.*)$', x)
        if not m: err.append(f'line {i}: no "N<TAB>text": {x[:60]}'); continue
        if int(m.group(1)) != i: err.append(f'line {i}: numbered {m.group(1)}'); break
        if i > len(S): break
        s, t = S[i - 1], m.group(2).strip()
        if not t: err.append(f'{i} empty'); continue
        if sorted(PH.findall(s)) != sorted(PH.findall(t)): err.append(f'{i} placeholders {PH.findall(s)} != {PH.findall(t)}')
        if sorted(VARS.findall(s)) != sorted(VARS.findall(t)): err.append(f'{i} variables')
        if '|' in t and '|' not in s: err.append(f'{i} has |')
        if 'WSET' in s and 'WSET' not in t: warn.append(f'{i} WSET missing')
        k = kinds.get(s)
        if k == 'title' and len(t) > 62: warn.append(f'{i} title {len(t)} chars')
        if k == 'desc' and not 120 <= len(t) <= 160: warn.append(f'{i} desc {len(t)} chars')
        if nums(s) != nums(t): warn.append(f'{i} numbers {nums(s)} vs {nums(t)}')
        if len(s) > 40 and not 0.5 < len(t) / len(s) < 2.2: warn.append(f'{i} length ratio {len(t) / len(s):.2f}')
        new[s] = t
    for w in warn: print('  !', w)
    if err:
        for x in err[:30]: print('  ✗', x)
        sys.exit(1)
    M.update(new)
    json.dump(M, open(f'{TM}/{l}.json', 'w', encoding='utf8'), ensure_ascii=False, indent=0, sort_keys=True)
    print(f'added {len(new)}; TM {len(M)}; pending {len(pending(l))}')


def cmd_emit(l):
    """write tools/site_i18n/<lang>/<group>.json for every group whose segments are all in the memory (never overwrites a
    group file that already exists unless --force); build.py then validates and publishes them"""
    M = load(l); done = []; part = []
    os.makedirs(f'tools/site_i18n/{l}', exist_ok=True)
    for g in groups():
        S = jl(f'tools/site_i18n/src/{g}.json'); segs = []
        for x in S['segments']:
            t = x['t']
            if auto(t): segs.append(t)
            elif t in M: segs.append(M[t])
            else: segs = None; break
        p = f'tools/site_i18n/{l}/{g}.json'
        if segs is None:
            n = sum(1 for x in S['segments'] if not auto(x['t']) and x['t'] in M)
            if n: part.append(f'{g} {n}/{len(S["segments"])}')
            continue
        if os.path.exists(p) and '--force' not in sys.argv: continue
        json.dump({'group': g, 'lang': l, 'src_sha': S['sha'], 'segments': segs}, open(p, 'w', encoding='utf8'), ensure_ascii=False, indent=0)
        done.append(g)
    print('written:', done or 'none', '| partly in memory:', part or 'none')


if __name__ == '__main__':
    c, l = sys.argv[1], sys.argv[2]
    if c == 'next': cmd_next(l, int(sys.argv[3]) if len(sys.argv) > 3 else 2800)
    elif c == 'add': cmd_add(l, sys.argv[3])
    elif c == 'emit': cmd_emit(l)
    elif c == 'stat':
        P = pending(l); print(len(load(l)), 'translated;', len(P), 'pending strings,', sum(len(t.split()) for _, t, _ in P), 'words')
