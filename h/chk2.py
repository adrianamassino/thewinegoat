import re,json,unicodedata,sys
def norm(s): return ''.join(c for c in unicodedata.normalize('NFD',s.lower()) if unicodedata.category(c)!='Mn')
s=open('wset3.html').read()
B=json.loads(re.search(r'const BANK = (\[.*?\]);\n',s,re.S).group(1).replace('<\\/','</'))
docs=[norm(' '.join(b['q']+sum(b['o'],[])+b['e']+(b.get('d') or []))) for b in B]
for k in sys.argv[1].split(';'):
    k2=norm(k); n=sum(1 for d in docs if k2 in d); print(f'{n:3d}  {k}')
