import re
R=[(r"«\s*Aroma characteristics\s*»","« Caractéristiques des arômes »"),(r"«\s*Flavour characteristics\s*»","« Caractéristiques des saveurs »"),
 (r"\b[Ll]e Wine-Lexicon\b",lambda m:("Le" if m.group(0)[0]=="L" else "le")+" lexique du vin"),(r"\bdu Wine-Lexicon\b","du lexique du vin"),(r"\bau Wine-Lexicon\b","au lexique du vin"),(r"\bdans le Wine-Lexicon\b","dans le lexique du vin"),(r"\bWine-Lexicon\b","lexique du vin"),
 (r"\b([Ll]e|du|au) Lexicon\b",lambda m:m.group(1)+" lexique"),(r"\bLexicon\b","lexique"),
 (r"«\s*Other\s*»","« Autres »"),(r"\bOther \(","Autres ("),(r"\bgroupe Oak\b","groupe Chêne"),(r"\bOak \(","Chêne ("),(r"\bOak =","Chêne ="),(r"\bOak\b(?= des arômes| du bois)","Chêne"),
 (r"\bBottle age\b","Vieillissement en bouteille"),(r"\bDried/cooked fruit\b","Fruits secs/cuits"),
 (r"\(tert\.\)","(tertiaires)"),(r"\(sec\.\)","(secondaires)"),(r"\(prim\.\)","(primaires)"),(r"\s*\(clusters\)",""),(r"\s*\(blossom\)",""),
 (r"Primaires « Autres »","Primaires, groupe « Autres »")]
RC=[(re.compile(p),r) for p,r in R]
def fix(t):
    for p,r in RC: t=p.sub(r,t)
    return t
def bank(B):
    n=0
    for b in B:
        for k in ('q','e','d'):
            if b.get(k):
                x=fix(b[k][1]); n+=x!=b[k][1]; b[k][1]=x
        for o in b['o']:
            x=fix(o[1]); n+=x!=o[1]; o[1]=x
    return n
