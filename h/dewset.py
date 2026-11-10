import re
RX=[
 (r'(^|")(?:Secondo|Selon|According to|D\'après) (?:il |le |the )?WSET,?\s*(\w)', lambda m: m.group(1)+m.group(2).upper()),
 (r"\busing WSET terms\b", "using exam terms"), (r"\bterminologia WSET\b", "terminologia d'esame"), (r"\bvocabulaire du WSET\b", "vocabulaire de l'examen"),
 (r"(?i)\s*,?\s*\b(?:secondo|stando al|selon|d'après|according to|per) (?:il |le |the )?WSET\b,?", ""),
 (r"(\.\s+|^|\"|\(|:\s)WSET(?= (?:also |only |then |now )?[a-z]+s\b)", r"\1The syllabus"),
 (r"\b(does|did|do|would|can|that|which|what) WSET\b", r"\1 the syllabus"),
 (r"\bWSET[- ]Wine[- ]Lexicon\b", "Wine-Lexicon"),
 (r"\b(?:del|dal|nel|il|le|du|au|the|of the) WSET (Wine-Lexicon)", r"\1"),
 (r"\bWSET®?\s*(?:Level|Livello|livello|niveau|Niveau)\s*3(?:\s*Award in Wines)?", "Level 3"),
 (r"\b(?:Level|Livello|livello|niveau|Niveau) 3 (?:del|du|of the) WSET\b", "Level 3"),
 (r"\b(?:dell'esame|de l'examen|the exam) WSET 3\b", lambda m: m.group(0)[:-7]),
 (r"\b(?:du|del|of the) WSET 3\b", ""),
 (r"\bWSET 3\b", "Level 3"),
 (r"\b(ideato|creato|pensato) dal WSET\b", r"\1 per l'esame"),
 (r"\b(conçue?|créée?|pensée?) par le WSET\b", r"\1 pour l'examen"),
 (r"\b(designed|created|devised) by (?:the )?WSET\b", r"\1 for the exam"),
 (r"\s(?:del|dal|nel|al) WSET\b", ""),
 (r"\s(?:du|au) WSET\b", ""),
 (r"\s(?:of|from|by) (?:the )?WSET\b", ""),
 (r"\bIl WSET\b", "Il programma"), (r"\bil WSET\b", "il programma"),
 (r"\bLe WSET\b", "Le programme"), (r"\ble WSET\b", "le programme"),
 (r"\bl'approche WSET\b", "l'approche"),
 (r"(^|[.!?]\s+|\")WSET (classifies|uses|suggests|recommends|cites|notes|describes|links|requires|asks|says|states|lists)\b", r"\1The syllabus \2"),
 (r"\b(?:A|a|an|An) WSET\b", lambda m: m.group(0)[:-5] if m.group(0)[0] in "Aa" and len(m.group(0))==6 else m.group(0)[:-5]),
 (r"\s?\bWSET\b\s?", " "),
]
RXC=[(re.compile(p),r) for p,r in RX]
B64=re.compile(r"base64,[A-Za-z0-9+/=]+")
def _ap(s):
    for p,r in RXC: s=p.sub(r,s)
    return re.sub(r"(?<=\S)  +(?=\S)"," ",s)
def apply(s):
    n=s.count("WSET"); out=[]; last=0
    for m in B64.finditer(s):
        out.append(_ap(s[last:m.start()])); out.append(m.group(0)); last=m.end()
    out.append(_ap(s[last:])); s="".join(out)
    return s,n-s.count("WSET")
