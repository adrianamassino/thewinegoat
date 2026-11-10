import json, sys
sys.path.insert(0, '../maps')
from names import N
h = open('live.html').read()
dj = lambda o: json.dumps(o, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
def grab(name):
    i = h.index('const %s=' % name) + len('const %s=' % name); return json.JSONDecoder().raw_decode(h[i:])[0]
def setc(name, obj):
    global h
    i = h.index('const %s=' % name) + len('const %s=' % name); o, e = json.JSONDecoder().raw_decode(h[i:]); h = h[:i] + dj(obj) + h[i + e:]
D = json.load(open('../maps/maps3.json')); r = D['hun']
M = grab('MAPS'); M = [m for m in M if m['id'] != 'hun']
k = [m['id'] for m in M].index('aut') + 1
M.insert(k, dict(id='hun', ch=r['ch'], sc=r['sc'], t=r['t'], p=r['p'], it=r['it'])); setc('MAPS', M)
G = grab('MGEO'); G['hun'] = {kk: r[kk] for kk in ('w', 'h', 'land', 'lake', 'riv', 'b0', 'b1', 'grat')}; setc('MGEO', G)
NM = grab('MNAMES'); keys = set(x[1] for m in M for x in m['it'])
for a, v in N.items():
    if a in keys: NM[a] = list(v)
setc('MNAMES', NM); setc('GX', json.load(open('../maps/gx.json')))
if '"hun"' not in h[h.index('const MROOTS='):h.index('const MROOTS=')+200]:
    h = h.replace('"aut","gre",', '"aut","hun","gre",', 1)
    h = h.replace('aut:"de-AT"};', 'aut:"de-AT",hun:"hu-HU"};', 1)
open('live.html', 'w').write(h); print('ok')
