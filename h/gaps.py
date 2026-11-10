import re,json,unicodedata,sys
from collections import defaultdict
def fold(s): return ''.join(c for c in unicodedata.normalize('NFD',s) if unicodedata.category(c)!='Mn').lower()
s=open('wset3.html').read()
B=json.loads(re.search(r'const BANK = (\[.*?\]);\n',s,re.S).group(1).replace('<\\/','</'))
pages=open('book.txt').read().split('\f')
allt=defaultdict(str)
for b in B:
    allt['ALL']+=' '+fold(b['q'][2]+' '+' '.join(o[2] for o in b['o'])+' '+b['e'][2]+' '+(b.get('d') or ['','',''])[2])
ALL=re.sub(r'[^a-z0-9%]+',' ',allt['ALL'])
stop=set("The This These That There They Their It Its In On At Of For From With Without By As An A And Or But If When Where Which While Most Many Some Other Others Also However Although Both Each All Any Such Here Unlike Like Over Under Into Than Then Thus Therefore Because Due Only Even Often Despite During After Before Between Among Around Within Since Until Very Much More Less Not No Both One Two Three Four Five Six Seven Eight Nine Ten First Second Third Key KEY UNDERSTANDING WINES EXPLAINING STYLE AND QUALITY Figure See Chapter Table Note Notes What Why How Who Is Are Was Were Be Can May Will Would Should Could Has Have Had Do Does Did To So Up Out As Most Wine Wines Grape Grapes Vineyards Vineyard Red White Black Region Regions South North East West Southern Northern Eastern Western Central Great Good Best High Low Large Small New Old These Those Such Above Below Further Together Overall Generally Typically Today Recent Recently".split())
pg0,pg1=int(sys.argv[1]),int(sys.argv[2])
for p in range(pg0,pg1+1):
    t=pages[p+8]
    t=re.sub(r'-\n','',t)
    toks=set()
    for m in re.finditer(r"\b([A-Z][a-zA-Zàâäéèêëïîôöùûüçñ'\-]{2,}(?:\s+(?:de|du|des|la|le|di|del|della|d')?\s*[A-Z][a-zA-Zàâäéèêëïîôöùûüçñ'\-]{2,})*)",t):
        w=m.group(1)
        if w.split()[0] in stop: w=' '.join(w.split()[1:])
        if len(w)<3 or w in stop or w.isupper(): continue
        toks.add(w)
    for m in re.finditer(r"\b(\d+(?:[.,]\d+)?\s?(?:%|per cent|m\b|metres|°C|g/l|years|months|days|km|hl/ha|kilometres))",t):
        toks.add(m.group(1))
    miss=[]
    for w in sorted(toks):
        f=re.sub(r'[^a-z0-9%]+',' ',fold(w)).strip()
        f=f.replace('per cent','%')
        if not f: continue
        if (' '+f+' ') in ' '+ALL+' ' or f.replace(' ','') in ALL.replace(' ',''): continue
        miss.append(w)
    print(p, len(miss), '; '.join(miss))
