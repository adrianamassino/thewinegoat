"""Unisce le traduzioni e genera app/i18n/es.js (caricato dall'app solo in spagnolo).
- tools/i18n/es/NNN.txt   : una traduzione per riga, allineata a tools/i18n/source/NNN.json (stesso ordine)
- tools/i18n/es-ar.json   : correzioni per l'argentino (vos), chiave = testo inglese
Le traduzioni allineate vengono salvate in tools/i18n/es-map.json (chiave = testo inglese),
così restano valide anche se in futuro l'estrazione cambia ordine."""
import json, os, glob
D=os.path.dirname(os.path.abspath(__file__)); ROOT=os.path.dirname(os.path.dirname(D))
mp=os.path.join(D,'es-map.json')
M=json.load(open(mp,encoding='utf8')) if os.path.exists(mp) else {}
for f in sorted(glob.glob(os.path.join(D,'es','*.txt'))):
    n=os.path.basename(f)[:-4]+'.json'; src=json.load(open(os.path.join(D,'source',n),encoding='utf8'))
    tr=[l.replace('\\n','\n') for l in open(f,encoding='utf8').read().rstrip('\n').split('\n')]
    assert len(src)==len(tr), f'{n}: {len(src)} frasi ma {len(tr)} traduzioni'
    for a,b in zip(src,tr):
        if b: M[a['en']]=b
json.dump(M,open(mp,'w',encoding='utf8'),ensure_ascii=False,indent=0,sort_keys=True)
import sys; sys.path.insert(0,D); from ar_rules import to_ar
AR={k:v for k,v in ((k,to_ar(v)) for k,v in M.items()) if v}   # voseo automatico
if os.path.exists(os.path.join(D,'es-ar.json')): AR.update(json.load(open(os.path.join(D,'es-ar.json'),encoding='utf8')))  # eccezioni manuali
os.makedirs(os.path.join(ROOT,'app/i18n'),exist_ok=True)
open(os.path.join(ROOT,'app/i18n/es.js'),'w',encoding='utf8').write('window.TWG_ES='+json.dumps({'es':M,'ar':AR},ensure_ascii=False,separators=(',',':'))+';')
tot=sum(len(json.load(open(f,encoding='utf8'))) for f in glob.glob(os.path.join(D,'source','*.json')))
print(f'{len(M)} frasi tradotte su {tot} ({len(M)*100//max(tot,1)}%), {len(AR)} varianti argentine')
