"""Estrae dall'app tutte le frasi da tradurre in spagnolo (chiave = testo inglese, con l'italiano come riferimento).
Uscita: tools/i18n/source/NNN.json — blocchi di circa 40.000 caratteri, nell'ordine in cui compaiono.
Uso: python3 tools/i18n/extract.py ui.json   (ui.json = dizionari T.it/T.en esportati dal browser)"""
import re, json, sys, os
ROOT=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
s=open(os.path.join(ROOT,'app/index.html'),encoding='utf8').read()
S=r'"((?:[^"\\]|\\.)*)"'
def un(x):
    try: return json.loads('"'+x+'"')
    except Exception: return x
units={}  # en -> it
def add(it,en,tag):
    it,en=un(it),un(en)
    if not en or not re.search(r'[A-Za-z]',en) or en==it: 
        if not en or en==it and not re.search(r'[a-z]{3}',en.lower()): return
    if en not in units: units[en]={'it':it,'k':tag}
# 1) UI dictionaries
if len(sys.argv)>1:
    ui=json.load(open(sys.argv[1],encoding='utf8'))
    for k,en in ui['en'].items():
        if isinstance(en,str): add(json.dumps(ui['it'].get(k,''))[1:-1], json.dumps(en)[1:-1], 'ui')
# 2) chapter names, groups, objects with it/fr/en keys
for m in re.finditer(r'"it":\s*'+S+r'[^{}]{0,4000}?"en":\s*'+S,s): add(m.group(1),m.group(2),'obj')
for m in re.finditer(r'\bit:\s*'+S+r'\s*,\s*fr:\s*'+S+r'\s*,\s*en:\s*'+S,s): add(m.group(1),m.group(3),'obj')
# 3) trilingual arrays and helper calls [it,fr,en] / I3(it,fr,en) / w3(...) / W3(...)
for m in re.finditer(r'(?:\[|\b(?:I3|w3|W3)\()\s*'+S+r'\s*,\s*'+S+r'\s*,\s*'+S+r'\s*(?:\]|\))',s):
    a,b,c=m.group(1),m.group(2),m.group(3)
    if a==b==c: continue
    add(a,c,'tri')
out=os.path.join(ROOT,'tools/i18n/source'); os.makedirs(out,exist_ok=True)
for f in os.listdir(out): os.remove(os.path.join(out,f))
items=[{'en':en,'it':v['it']} for en,v in units.items()]
# UI first, then content
items.sort(key=lambda x:0 if units[x['en']]['k']=='ui' else 1)
chunk=[];size=0;n=0
for it in items:
    chunk.append(it); size+=len(it['en'])+len(it['it'])
    if size>40000:
        json.dump(chunk,open(f'{out}/{n:03d}.json','w',encoding='utf8'),ensure_ascii=False,indent=0); n+=1; chunk=[]; size=0
if chunk: json.dump(chunk,open(f'{out}/{n:03d}.json','w',encoding='utf8'),ensure_ascii=False,indent=0); n+=1
print(len(items),'frasi,',sum(len(x['en']) for x in items),'caratteri inglesi,',n,'blocchi;', sum(1 for x in items if units[x['en']]['k']=='ui'),'di interfaccia')
