import re
VIT={"cita":("cita","citano"),"elenca":("elenca","elencano"),"descrive":("descrive","descrivono"),"distingue":("distingue","distinguono"),"usa":("usa","usano"),
 "suggerisce":("suggerisce","suggeriscono"),"consiglia":("consiglia","consigliano"),"chiede":("chiede","chiedono"),"definisce":("definisce","definiscono"),
 "classifica":("classifica","classificano"),"raggruppa":("raggruppa","raggruppano"),"chiama":("chiama","chiamano"),"contrappone":("contrappone","contrappongono"),
 "nomina":("nomina","nominano"),"menziona":("menziona","menzionano"),"indica":("indica","indicano"),"presenta":("presenta","presentano"),"collega":("collega","collegano"),
 "considera":("considera","considerano"),"associa":("associa","associano"),"precisa":("precisa","precisano"),"segnala":("segnala","segnalano"),"propone":("propone","propongono"),
 "osserva":("osserva","osservano"),"attribuisce":("attribuisce","attribuiscono"),"illustra":("illustra","illustrano"),"tratta":("tratta","trattano"),"mostra":("mostra","mostrano"),
 "colloca":("colloca","collocano"),"privilegia":("privilegia","privilegiano"),"conta":("conta","contano"),"riporta":("riporta","riportano"),"sottolinea":("sottolinea","sottolineano"),"spiega":("spiega","spiegano"),"dice":("dice","dicono")}
def _plural(rest):
    r=rest.lstrip()
    if re.match(r"(che|di|se|come)\b",r): return False
    r=re.sub(r"^(come esempi[oi]?|anche|solo|proprio|qui|inoltre)\s+","",r)
    if re.match(r"(i|gli|le|due|tre|quattro|cinque|sei|sette|otto|dieci|alcuni|alcune|molti|molte|diversi|diverse)\b",r): return True
    seg=re.split(r"[.;:]",r)[0]
    return bool(re.search(r",| e ",seg[:80])) and not re.match(r"(il|lo|la|l'|un|uno|una)\b",r)
def it_fix(t):
    t=re.sub(r"\s*,?\s*\b(?:secondo|per) il programma\b,?","",t)
    t=re.sub(r"\b(?:nel|dal|del) programma\b","",t)
    t=re.sub(r"\b[Ii]l programma (?:però |inoltre |anche )?non (?:parla|cita|dice|menziona|nomina|indica|tratta)(?: né)? (?:di |nulla di )?",lambda m:("N" if m.group(0)[0]=="I" else "n")+"on si tratta di ",t)
    t=re.sub(r"\bciò che il programma (\w+)",lambda m:"ciò che si "+m.group(1),t)
    t=re.sub(r"\bche il programma (\w+)",lambda m:"che si "+VIT.get(m.group(1),(m.group(1),))[0],t)
    t=re.sub(r"\b[Ii]l programma fa l'esempio\b",lambda m:("U" if m.group(0)[0]=="I" else "u")+"n esempio è quello",t)
    def subj(m):
        cap=m.group(1)[0]=="I"; v=m.group(3); rest=t[m.end():]
        if v in VIT: vv=VIT[v][1] if _plural(rest) else VIT[v][0]
        else: vv=v
        adv=(m.group(2) or "").strip()
        return ("Si " if cap else "si ")+vv+((" "+adv) if adv else "")
    t=re.sub(r"\b([Ii]l) programma (però |inoltre |anche |quindi |infatti )?(\w+)",subj,t)
    t=re.sub(r"\b[Ii]l programma\b","",t)
    return t
def fr_fix(t):
    t=t.replace("le programme lexique du vin","le lexique du vin")
    t=re.sub(r"\s*,?\s*\b(?:selon|d'après|pour) le programme\b,?","",t)
    t=re.sub(r"\s+par le programme\b","",t)
    t=re.sub(r"\b(?:du|dans le|au) programme\b(?! (?:volontaire|durable))","",t)
    t=re.sub(r"\b([Qq]u)e le programme\b(?! (?:volontaire|durable))",lambda m:m.group(1)+"'on",t)
    t=re.sub(r"\bLe programme\b(?! (?:volontaire|durable))","On",t)
    t=re.sub(r"\ble programme\b(?! (?:volontaire|durable))","on",t)
    t=re.sub(r"\bon le ","on le ",t)
    return t
def en_fix(t):
    t=re.sub(r"(?i)\s*,?\s*\b(?:according to|per) (?:the )?syllabus\b,?","",t)
    t=re.sub(r"\b(?:in|by|from|of) the syllabus\b","",t)
    t=re.sub(r"\bwhat the syllabus (\w+)",r"what is \1",t)
    t=re.sub(r"\bthe syllabus does not (mention|cite|name|list)\b",r"there is no mention of",t)
    t=re.sub(r"\bThe syllabus does not (mention|cite|name|list)\b",r"There is no mention of",t)
    t=re.sub(r"\bThe syllabus\b","Experts",t); t=re.sub(r"\bthe syllabus\b","experts",t)
    t=re.sub(r"\b(Experts|experts) (also |only |then )?(\w+?)s\b",lambda m:m.group(1)+" "+(m.group(2) or "")+m.group(3),t)
    return t
def clean(t):
    t=re.sub(r"\s+([,.])",r"\1",t); t=re.sub(r"\s{2,}"," ",t).strip()
    t=re.sub(r"^([a-zàèéìòù])",lambda m:m.group(1).upper(),t)
    t=re.sub(r"([.!?:]\s+)(si |on |non si )",lambda m:m.group(1)+m.group(2)[0].upper()+m.group(2)[1:],t)
    return t
F=[it_fix,fr_fix,en_fix]
def bank(B,Q):
    n=0
    for b in B:
        if b['id'] in Q: b['q']=list(Q[b['id']]); n+=1
        for k in ('e','d'):
            if b.get(k): b[k]=[clean(F[i](x)) if re.search(r"programm|syllabus",x) else x for i,x in enumerate(b[k])]
        b['o']=[[clean(F[i](x)) if re.search(r"programm|syllabus",x) else x for i,x in enumerate(o)] for o in b['o']]
    return n
