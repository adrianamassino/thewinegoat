"""Applies translated deltas to stale translation files and moves them to the current English source.
Input JSON: {"<lang>": {"<group>": {"<segment index>": "<translation>", ...}}}. Every changed segment listed by
stale.py for that file must be present; then src_sha is set to the current sha.
Usage: python3 tools/site_i18n/apply_delta.py delta.json"""
import json, sys, subprocess
d = json.load(open(sys.argv[1], encoding='utf8'))
st = json.loads(subprocess.run([sys.executable, 'tools/site_i18n/stale.py', *d.keys(), '--json', '/dev/stdout'], capture_output=True, text=True).stdout.split('\n', len(d))[-1] or '{}') if False else None
import importlib.util, os
S = 'tools/site_i18n/src'; f = lambda x: x['t'] if isinstance(x, dict) else x
for l, gs in d.items():
    for g, segs in gs.items():
        p = f'tools/site_i18n/{l}/{g}.json'; T = json.load(open(p, encoding='utf8')); cur = json.load(open(f'{S}/{g}.json'))
        old = json.load(open(f'{S}/_old/{g}.{T["src_sha"]}.json')) if T.get('src_sha') != cur['sha'] else cur
        a = [f(x) for x in old['segments']]; b = [f(x) for x in cur['segments']]
        need = {i for i in range(len(b)) if a[i] != b[i]}
        miss = need - {int(k) for k in segs}
        if miss: print(f'✗ {l}/{g}: missing {sorted(miss)}'); continue
        for k, v in segs.items(): T['segments'][int(k)] = v
        T['src_sha'] = cur['sha']; json.dump(T, open(p, 'w', encoding='utf8'), ensure_ascii=False, indent=0); print(f'✓ {l}/{g}: {len(segs)} segments')
