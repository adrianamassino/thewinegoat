import re
R=[
 (r"drink now: not suitable for further ageing","da bere ora: non adatto a ulteriore invecchiamento","à boire maintenant : ne se prête pas à un vieillissement supplémentaire"),
 (r"can drink now, but has potential for ageing","si può bere ora, ma ha potenziale d'invecchiamento","peut se boire maintenant, mais a un potentiel de garde"),
 (r"too young: needs more time in bottle","troppo giovane: ha bisogno di più tempo in bottiglia","trop jeune : a besoin de plus de temps en bouteille"),
 (r"too old: past its best and declining","troppo vecchio: oltre il suo apice e in declino","trop vieux : a dépassé son apogée et décline"),
 (r"too old: past its best","troppo vecchio: oltre l'apice","trop vieux : au-delà de l'apogée"),
 (r"too young: needs time","troppo giovane: serve tempo","trop jeune : a besoin de temps"),
 (r"can drink now, can age","si può bere ora, può invecchiare","peut se boire maintenant, peut vieillir"),
 (r"drink now: no ageing","da bere ora: niente invecchiamento","à boire maintenant : pas de garde"),
 (r"drink now ?:","da bere ora:","à boire maintenant :"),
 (r"can drink now","si può bere ora","peut se boire maintenant"),
 (r"drink now","da bere ora","à boire maintenant"),
 (r"too young","troppo giovane","trop jeune"),
 (r"too old","troppo vecchio","trop vieux"),
 (r"past its best","oltre il suo apice","au-delà de son apogée"),
 (r"not suitable for (?:further )?ageing","non adatto all'invecchiamento","ne se prête pas à la garde"),
 (r"potential for ageing","potenziale d'invecchiamento","potentiel de garde"),
 (r"needs more time","ha bisogno di più tempo","a besoin de plus de temps"),
 (r" or further ageing","",""),
 (r"but has potential","ma ha potenziale","mais a un potentiel"),
 (r"not suitable","non adatto","ne convient pas"),
 (r"very good","molto buono","très bon"),
 (r"outstanding","eccezionale","exceptionnel"),
 (r"faulty","difettoso","défectueux"),
 (r"«\s?poor\s?»","«scarso»","« médiocre »"),
 (r"«\s?good\s?»","«buono»","« bon »"),
 (r"«\s?nose\s?»","«naso»","« nez »"),
 (r"«\s?palate\s?»","«palato»","« bouche »"),
 (r"«\s?legs\s?»","«lacrime»","« larmes »"),
]
RI=[(re.compile((r"\b" if a[0].isalpha() else "")+a+(r"\b" if a[-1].isalpha() else ""),re.I),it,fr) for a,it,fr in R]
RI.append((re.compile(r"\bacceptable\b",re.I),"accettabile",None))
def cap(m,rep):
    s=m.group(0)
    if not rep: return rep
    return rep[0].upper()+rep[1:] if s[:1].isupper() else rep
def fix(s,li):
    for rx,it,fr in RI:
        rep=it if li==0 else fr
        if rep is None: continue
        s=rx.sub(lambda m:cap(m,rep),s)
    return s
def fixbank(bank):
    n=0
    for b in bank:
        for f in ('q','e','d'):
            for li in (0,1):
                x=fix(b[f][li],li)
                if x!=b[f][li]: b[f]=list(b[f]); b[f][li]=x; n+=1
        for oi,o in enumerate(b['o']):
            for li in (0,1):
                x=fix(o[li],li)
                if x!=o[li]: b['o'][oi]=list(b['o'][oi]); b['o'][oi][li]=x; n+=1
    return n
