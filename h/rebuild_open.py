import re, glob, json, hashlib, sys
D = sys.argv[1] if len(sys.argv)>1 else './'
OPEN=[]; seen=set()
for f in sorted(glob.glob(D+'oqv/*.txt')):
    for blk in re.split(r'\n\s*\n', open(f).read().strip()):
        lines=[l for l in blk.strip().split('\n') if l.strip()]
        hd=lines[0][1:].split(); c=hd[0]; q=None; parts=[]; lab=None
        for ln in lines[1:]:
            k,v=ln.split(':',1); k=k.strip(); v=v.strip()
            if k=='Q': q=[x.strip() for x in v.split('||')]; assert len(q)==3,(f,v)
            elif k.startswith('P'):
                tt=[x.strip() for x in v.split('||')]; assert len(tt)==3,(f,v)
                parts.append({'t':tt,'m':int(k[1:]),'k':''})
            elif k=='K':
                kk=[x.strip() for x in v.split('||')]
                parts[-1]['k']=kk if len(kk)==3 else v
            elif k=='F':
                ff=[[y.strip() for y in x.split('|')] for x in v.split('||')]; assert len(ff)==3 and len(set(map(len,ff)))==1,(f,v)
                parts[-1]['f']=ff
            elif k=='N': parts[-1]['n']=v
            elif k=='L': lab=[[y.strip() for y in x.split('~')] for x in v.split(';;')]
            else: raise Exception((f,ln))
        assert q and parts and all(p['k'] for p in parts),(f,blk[:60])
        i=hashlib.sha1(('open'+c+q[2]+parts[0]['t'][2]).encode()).hexdigest()[:7]
        assert i not in seen,(f,q); seen.add(i)
        rec={'id':i,'c':c,'q':q,'parts':parts}
        if 'x' in hd[1:]: rec['x']=1
        if lab: rec['lab']=lab
        OPEN.append(rec)
print('open',len(OPEN),'parts',sum(len(o['parts']) for o in OPEN),'marks',sum(p['m'] for o in OPEN for p in o['parts']))
ojs=json.dumps(OPEN,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')
h=open(D+'live.html').read()
old=re.search(r'const OPEN = \[.*?\];\n',h,re.S)
assert old and h.count('const OPEN = ')==1
# ids preserved?
oldids=set(re.findall(r'"id":"([0-9a-f]{7})","c"',old.group(0)))
print('kept ids',len(oldids&seen),'of old',len(oldids))
h=h[:old.start()]+'const OPEN = '+ojs+';\n'+h[old.end():]
open(D+'live.html','w').write(h)
from collections import Counter; print(Counter(o['c'] for o in OPEN))
