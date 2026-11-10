import json,sys
sys.path.insert(0,'../maps')
import importlib, names; importlib.reload(names); N=names.N
D=json.load(open('../maps/maps3.json'))
h=open('live.html').read()
maps=[dict(id=m['id'],ch=m['ch'],sc=m['sc'],t=m['t'],p=m['p'],it=m['it']) for m in D.values()]
geo={k:{kk:v[kk] for kk in ('w','h','land','lake','riv','b0','b1','grat')} for k,v in D.items()}
keys=set(x[1] for m in D.values() for x in m['it'])
nm={k:list(v) for k,v in N.items() if k in keys}
dj=lambda o: json.dumps(o,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')
js=open('maps3.js').read().replace('__MAPS__',dj(maps)).replace('__MGEO__',dj(geo)).replace('__MNAMES__',dj(nm)).replace('__GX__',open('../maps/gx.json').read().replace('</','<\\/'))
a=h.index('/* ---------- maps game (Seterra-style) ---------- */'); b=h.index('/* ---------- mock exam ---------- */')
h=h[:a]+js+'\n'+h[b:]
open('live.html','w').write(h); print('ok',len(h))
