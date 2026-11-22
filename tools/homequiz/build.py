"""LEGACY (home quiz v1, 20 questions per theme): the page now uses tools/homequiz/build_levels.js (25 per theme and level).
These files stay published only so that a v1 result saved earlier can still be reviewed in the app (app/hqresult.js).

Home quiz question bank: tools/homequiz/src/<lang>.txt + tools/homequiz/set.txt  ->  assets/homequiz/<lang>.json

The home assessment is FIXED: set.txt lists, per theme, the 20 questions asked (always the same, in that order) and the
fixed 20 of the mix. Every other question in src/ is a reserve (en, it, fr, es, es-ar hold 50 per theme) and is not published.
Source: one question per line, fields separated by "|":
  en.txt      id|topic|question|correct answer|wrong 1|wrong 2|wrong 3|explanation
  <lang>.txt  id|question|correct answer|wrong 1|wrong 2|wrong 3|explanation      ("=" in a field = same text as English)
ids: w… wine, s… spirits, b… beer, k… sake. The first option is the correct one (the page shuffles the options only).
Topics (w_grapes, s_whisky, b_styles…) feed the per-topic result and recommendations in the app (app/hqresult.js).
A language missing a question of the set falls back to English for it (reported; --strict makes that an error).
Idempotent: a file is only written when its content changes.

Usage from repo root:  python3 tools/homequiz/build.py [--check] [--strict]"""
import json, os, sys, glob

D = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(D))
THEMES = {'w': 'wine', 's': 'spirits', 'b': 'beer', 'k': 'sake'}
V = 3

def rows(p):
    return [l.split('|') for l in open(p, encoding='utf8').read().split('\n') if l.strip() and not l.startswith('#')]

def read_set():
    S = {}
    for l in open(os.path.join(D, 'set.txt'), encoding='utf8'):
        if l.startswith('#') or ':' not in l: continue
        k, v = l.split(':', 1); S[k.strip()] = v.split()
    return S

def main():
    en = {}
    for r in rows(os.path.join(D, 'src', 'en.txt')):
        assert len(r) == 8, f'en: {r[0]} has {len(r)} fields'
        assert r[0] not in en, f'en: duplicate {r[0]}'
        assert r[0][0] in THEMES and r[1].startswith(r[0][0] + '_'), f'en: {r[0]} id/topic'
        assert len(set(r[3:7])) == 4 and all(x.strip() for x in r[2:]), f'en: {r[0]} options'
        en[r[0]] = r
    S = read_set()
    for t in THEMES.values():
        ids = S[t]; assert len(ids) == len(set(ids)) and all(i in en and THEMES[i[0]] == t for i in ids), f'set.txt: {t}'
        assert len({en[i][1] for i in ids}) >= 4, f'set.txt: {t} covers too few topics'
    allset = [i for t in THEMES.values() for i in S[t]]
    assert len(S['mix']) == len(set(S['mix'])) and set(S['mix']) <= set(allset), 'set.txt: mix must come from the theme sets'
    bad = 0
    for p in sorted(glob.glob(os.path.join(D, 'src', '*.txt'))):
        lg = os.path.basename(p)[:-4]; tr = {}
        if lg != 'en':
            for r in rows(p):
                assert len(r) == 7, f'{lg}: {r[0]} has {len(r)} fields'
                assert r[0] in en and r[0] not in tr, f'{lg}: unknown or duplicate id {r[0]}'
                e = en[r[0]]; f = [e[2 + k] if x.strip() == '=' else x.strip() for k, x in enumerate(r[1:])]
                assert all(f) and len(set(f[1:5])) == 4, f'{lg}: {r[0]} empty field or duplicate options'
                tr[r[0]] = f
        out = {'v': V, 'lang': lg}; miss = []
        for t in THEMES.values():
            out[t] = []
            for i in S[t]:
                e = en[i]; f = e[2:] if lg == 'en' else tr.get(i)
                q = {'id': i, 't': e[1]}
                if f is None: miss.append(i); f = e[2:]; q['x'] = 1      # still in English: the page marks it lang="en"
                q.update({'q': f[0], 'o': f[1:5], 'e': f[5]}); out[t].append(q)
        out['mix'] = S['mix']
        if miss: bad += 1; print(f'  ! {lg}: {len(miss)} questions of the set still in English: {" ".join(miss[:14])}{" …" if len(miss) > 14 else ""}')
        js = json.dumps(out, ensure_ascii=False, separators=(',', ':')) + '\n'
        dst = os.path.join(ROOT, 'assets', 'homequiz', lg + '.json')
        if '--check' not in sys.argv and (not os.path.exists(dst) or open(dst, encoding='utf8').read() != js):
            open(dst, 'w', encoding='utf8').write(js)
        print(f'{lg}: ' + ' · '.join(f'{t} {len(S[t]) - sum(1 for i in miss if THEMES[i[0]] == t)}/{len(S[t])}' for t in THEMES.values()) + f' · mix {len(S["mix"])}')
    return 1 if bad and '--strict' in sys.argv else 0

if __name__ == '__main__': sys.exit(main())
