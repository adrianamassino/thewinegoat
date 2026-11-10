import re
V_IT=r"(?:precisa|nota|spiega|ricorda|sottolinea|avverte|aggiunge|osserva|indica|dice|afferma|segnala|chiarisce|insiste|scrive|conclude|ammette|riconosce|specifica|evidenzia|descrive come|considera)"
V_FR=r"(?:précise|note|explique|rappelle|souligne|avertit|ajoute|observe|indique|dit|affirme|signale|insiste sur le fait|écrit|conclut|admet|reconnaît|spécifie|relève|considère)"
V_EN=r"(?:states|notes|explains|reminds us|stresses|warns|adds|observes|indicates|says|points out|makes clear|insists|writes|concludes|admits|acknowledges|specifies|highlights|emphasises|emphasizes|mentions|considers)"
def cap(m): return m.group(1)+m.group(2).upper()
def fix(t,l):
    if not t: return t
    s=t.replace("each book chapter","each chapter").replace("l'exemple du livre","l'exemple type").replace("Book examples:","Examples:")
    if l=='it':
        s=re.sub(r"\b[Ii]l (?:libro|manuale)(?: WSET)? "+V_IT+r" che ","§",s)
        s=re.sub(r"\b[Ii]l (?:libro|manuale)(?: WSET)? "+V_IT+r":? ","§",s)
        s=re.sub(r",? ?(?:secondo|stando al|come (?:dice|indica|precisa|spiega|nota|ricorda) il|nel|dal|per il) (?:libro|manuale)(?: WSET)?,?","",s)
        s=re.sub(r"\b(?:del|nel|dal|al) (?:libro|manuale)\b","del WSET",s)
        s=re.sub(r"\b[Ii]l (?:libro|manuale)(?: WSET)?\b",lambda m:"Il WSET" if m.group(0)[0]=="I" else "il WSET",s)
        s=re.sub(r"\blibro\b","WSET",s)
    elif l=='fr':
        s=re.sub(r"\b[Ll]e (?:livre|manuel)(?: WSET)? "+V_FR+r" qu(?:e |')","§",s)
        s=re.sub(r"\b[Ll]e (?:livre|manuel)(?: WSET)? "+V_FR+r" ?:? ","§",s)
        s=re.sub(r",? ?(?:selon|d'après|comme le (?:dit|précise|note|rappelle|explique)|dans) le (?:livre|manuel)(?: WSET)?,?","",s)
        s=re.sub(r",? ?(?:selon|d'après) (?:le )?(?:livre|manuel)(?: WSET)?,?","",s)
        s=re.sub(r"\b(?:du|au) (?:livre|manuel)\b(?! (?:manuel|de))",lambda m:"du WSET" if m.group(0).startswith("du") else "au WSET",s)
        s=re.sub(r"\b[Ll]e (?:livre|manuel)(?: WSET)?\b(?! (?:de|des) )",lambda m:"Le WSET" if m.group(0)[0]=="L" else "le WSET",s)
        s=re.sub(r"\ble livre\b","le WSET",s)
    else:
        s=re.sub(r"\b[Tt]he (?:WSET )?(?:book|textbook)(?: also)? "+V_EN+r" that ","§",s)
        s=re.sub(r"\b[Tt]he (?:WSET )?(?:book|textbook)(?: also)? "+V_EN+r":? ","§",s)
        s=re.sub(r",? ?(?:according to|as (?:stated|noted|explained) (?:in|by)|in|by) the (?:WSET )?(?:book|textbook),?","",s)
        s=re.sub(r"\b(?:of|from) the (?:WSET )?(?:book|textbook)\b","from WSET",s)
        s=re.sub(r"\b[Tt]he (?:WSET )?(?:book|textbook)\b","WSET",s)
        s=re.sub(r"\bbook\b(?! chapter)","WSET",s)
    s=s.replace("Understanding Wines","").replace("«»","").replace("« »","")
    # capitalise after removed lead-in
    s=re.sub(r"(^|[.!?:]\s+)§\s*(\w)",lambda m:m.group(1)+m.group(2).upper(),s)
    s=s.replace("§","")
    s=re.sub(r"\s+,",",",s); s=re.sub(r"\s{2,}"," ",s); s=re.sub(r"^,\s*","",s)
    s=re.sub(r"^([a-zàèéìòù])",lambda m:m.group(1).upper(),s)
    return s
LG=['it','fr','en']
def bank(B):
    for b in B:
        for k in ('q','e','d'):
            if b.get(k): b[k]=[fix(x,LG[i]) for i,x in enumerate(b[k])]
        b['o']=[[fix(x,LG[i]) for i,x in enumerate(o)] for o in b['o']]
    return B
