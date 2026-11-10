import json, sys
sys.path.insert(0, '../maps')
from names import N
h = open('live.html').read()
dj = lambda o: json.dumps(o, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
def setc(name, obj):
    global h
    i = h.index('const %s=' % name) + len('const %s=' % name)
    o, e = json.JSONDecoder().raw_decode(h[i:])
    h = h[:i] + dj(obj) + h[i + e:]
def grab(name):
    i = h.index('const %s=' % name) + len('const %s=' % name)
    return json.JSONDecoder().raw_decode(h[i:])[0]
D = json.load(open('../maps/maps3.json'))
CH = ['cal', 'pnw', 'chi', 'arg', 'rsa', 'rsaz', 'ause', 'nzl']
M = grab('MAPS'); G = grab('MGEO'); NM = grab('MNAMES')
L = {m['id']: m for m in M}
out = []
for m in M:
    if m['id'] == 'rsa':
        r = D['rsaz']; out.append(dict(id='rsaz', ch=r['ch'], sc=r['sc'], t=r['t'], p=r['p'], it=r['it']))
    if m['id'] in CH:
        r = D[m['id']]; m = dict(id=r['id'], ch=r['ch'], sc=r['sc'], t=r['t'], p=r['p'], it=r['it'])
    out.append(m)
setc('MAPS', out)
for k in CH:
    G[k] = {kk: D[k][kk] for kk in ('w', 'h', 'land', 'lake', 'riv', 'b0', 'b1', 'grat')}
setc('MGEO', G)
keys = set(x[1] for m in out for x in m['it'])
for k, v in N.items():
    if k in keys: NM[k] = list(v)
setc('MNAMES', NM)
setc('GX', json.load(open('../maps/gx.json')))
a = 'const MTREE={'; assert h.count(a) == 1
h = h.replace('ausz:["ause","ausw"]};', 'ausz:["ause","ausw"],rsaz:["rsa"]};')
h = h.replace('const MROOTS=["fra","ita","esp","por","ger","aut","gre","nam","chi","arg","rsa","ausz","nzl"];', 'const MROOTS=["fra","ita","esp","por","ger","aut","gre","nam","chi","arg","rsaz","ausz","nzl"];')
assert 'rsaz:["rsa"]' in h and '"rsaz","ausz"' in h
open('live.html', 'w').write(h)
print('ok', len(out))
