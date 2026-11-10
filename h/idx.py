import re,json,unicodedata
def norm(s): return ''.join(c for c in unicodedata.normalize('NFD',s.lower()) if unicodedata.category(c)!='Mn')
s=open('wset3.html').read()
B=json.loads(re.search(r'const BANK = (\[.*?\]);\n',s,re.S).group(1).replace('<\\/','</'))
corpus=norm(' '.join(' '.join(b['q']+sum(b['o'],[])+b['e']+(b.get('d') or [])) for b in B))
lines=open('index.txt').read().split('\n')
terms=[]
for ln in lines:
    ln=ln.strip()
    m=re.match(r'^(.*?[A-Za-z\)\'])\s*(\d[\d ,\-–BOSI]*)$',ln)
    if not m: continue
    t=m.group(1).strip(); pg=m.group(2)
    t=re.sub(r'\(see .*?\)','',t).strip()
    terms.append((t,pg))
unc=[]
for t,pg in terms:
    k=norm(re.sub(r'\(.*?\)','',t)).strip()
    k=k.replace('/','l')
    if len(k)<3: continue
    if k not in corpus and k.rstrip('s') not in corpus:
        unc.append((t,pg))
print(len(terms),'terms;',len(unc),'uncovered')
for t,pg in unc: print(f'{t} | {pg}')
