import re,json,unicodedata,sys
def fold(s): return ''.join(c for c in unicodedata.normalize('NFD',s) if unicodedata.category(c)!='Mn').lower()
s=open('wset3.html').read()
B=json.loads(re.search(r'const BANK = (\[.*?\]);\n',s,re.S).group(1).replace('<\\/','</'))
txt=fold(' '.join(b['q'][2]+' '+' '.join(o[2] for o in b['o'])+' '+b['e'][2]+' '+(b.get('d') or ['','',''])[2] for b in B))
txt=re.sub(r'[^a-z0-9 ]',' ',txt); txt=' '+re.sub(r'\s+',' ',txt)+' '
lines=[l.strip() for l in open('index.txt') if l.strip()]
skip=re.compile(r'^(INDEX|Index|Numbers in|UNDERSTANDING|\d+$)')
ents=[]; parent=None
for l in lines:
    if skip.match(l): continue
    m=re.match(r'^(.*?)[\s]*([0-9SOBl][0-9SOBl ,\-–]*)?(\(see.*)?$',l)
    term=m.group(1).strip().rstrip(',')
    pg=m.group(2) or ''
    if not term: continue
    if term[0].islower() and parent and not re.match(r'^[a-z]',parent[0].lower()) is None and False: pass
    ents.append((term,pg.strip()))
unc=[]
for term,pg in ents:
    t=fold(term); t=re.sub(r'\(.*?\)','',t); t=re.sub(r'[^a-z0-9 ]',' ',t); t=re.sub(r'\s+',' ',t).strip()
    t=t.replace('/','')
    if len(t)<3: continue
    if (' '+t+' ') in txt or (' '+t) in txt: continue
    # try fixing OCR: remove spaces
    if t.replace(' ','') in txt.replace(' ',''): continue
    unc.append((term,pg))
print(len(ents),'entries;',len(unc),'uncovered')
for u in unc: print(u[0],'|',u[1])
