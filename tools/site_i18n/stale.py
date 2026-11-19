"""Lists translation files pinned to an older English version and the segments whose English changed since.
Usage: python3 tools/site_i18n/stale.py [lang ...] [--json out.json]"""
import json, os, sys, glob
S = 'tools/site_i18n/src'
f = lambda x: x['t'] if isinstance(x, dict) else x
langs = [a for a in sys.argv[1:] if not a.startswith('--') and not a.endswith('.json')] or sorted(d for d in os.listdir('tools/site_i18n') if os.path.isdir(f'tools/site_i18n/{d}') and d not in ('src',) and glob.glob(f'tools/site_i18n/{d}/*.json'))
out = {}
for l in langs:
    for p in sorted(glob.glob(f'tools/site_i18n/{l}/*.json')):
        g = os.path.basename(p)[:-5]
        if not os.path.exists(f'{S}/{g}.json'): continue
        cur = json.load(open(f'{S}/{g}.json')); T = json.load(open(p, encoding='utf8'))
        if T.get('src_sha') == cur['sha']: continue
        oldp = f'{S}/_old/{g}.{T.get("src_sha")}.json'
        if not os.path.exists(oldp): out.setdefault(l, {})[g] = 'old source missing'; continue
        old = json.load(open(oldp)); a = [f(x) for x in old['segments']]; b = [f(x) for x in cur['segments']]
        if len(a) != len(b): out.setdefault(l, {})[g] = f'segment count {len(a)}→{len(b)}'; continue
        ch = [i for i in range(len(b)) if a[i] != b[i]]
        out.setdefault(l, {})[g] = {'changed': ch, 'en': [b[i] for i in ch], 'sha': cur['sha']}
for l, gs in out.items():
    n = sum(len(v['changed']) for v in gs.values() if isinstance(v, dict))
    print(f'{l}: {len(gs)} stale files, {n} changed segments' + ''.join(f'\n   {g}: {v}' for g, v in gs.items() if not isinstance(v, dict)))
if '--json' in sys.argv: json.dump(out, open(sys.argv[sys.argv.index('--json') + 1], 'w'), ensure_ascii=False, indent=1)
