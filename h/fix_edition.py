import re
s=open('wset3.html').read()
def cap(m): return m.group(1).upper()
R=[
 # Wachau facts
 (r"Wachau not a DAC, own classification","Wachau DAC since the 2020 vintage, keeping its own Steinfeder/Federspiel/Smaragd classification"),
 (r"la Wachau n'est pas une DAC, elle a sa propre classification","la Wachau est une DAC depuis le millésime 2020 et garde sa classification Steinfeder, Federspiel, Smaragd"),
 (r"la Wachau non è una DAC, ha una propria classificazione","la Wachau è una DAC dal millesimo 2020 e mantiene la sua classificazione Steinfeder, Federspiel, Smaragd"),
 (r"Ausbruch is now the Wachau DAC","Ausbruch is now Ruster Ausbruch DAC"),
 (r"l'Ausbruch est désormais la DAC de la Wachau","l'Ausbruch est désormais la DAC Ruster Ausbruch"),
 (r"l'Ausbruch è ora la DAC della Wachau","l'Ausbruch è ora la Ruster Ausbruch DAC"),
 (r"La legislazione, nuova in questa edizione","La legislazione del vino"),(r"La législation, nouvelle dans cette édition","La législation du vin"),(r"Wine law, new in this edition","Wine law"),
 # edition references
 (r"(?:New edition|Nuova edizione|Nouvelle édition)\s?[:;]\s*(\\?[\"'«“]?\s?\w)",cap),
 (r" \((?:new edition|nuova edizione|nouvelle édition)\)",""),
 (r"(?:In the new edition|Nella nuova edizione|Dans la nouvelle édition|According to the new edition|Secondo la nuova edizione|Selon la nouvelle édition), (\w)",cap),
 (r"In the new edition (it|the)",lambda m:"Today "+m.group(1)),
 (r"Nella nuova edizione ",r"Oggi "),
 (r"Dans la nouvelle édition, c'est",r"Aujourd'hui, c'est"),
 (r"; in the new edition it is","; today it is"),(r"; nella nuova edizione è","; oggi è"),(r" ; dans la nouvelle édition, c'est"," ; aujourd'hui, c'est"),
 (r" (?:in|according to) the new edition\?"," today?"),(r" (?:nella|secondo la) nuova edizione\?"," oggi?"),(r" (?:dans|selon) la nouvelle édition \?"," aujourd'hui ?"),
 (r"but the new edition says it is","but today it is"),(r"secondo la nuova edizione è","oggi è"),(r"selon la nouvelle édition sa","aujourd'hui sa"),
 (r"The new edition notes that (\w)",cap),(r"La nouvelle édition précise que (\w)",cap),(r"Nella nuova edizione si precisa","Si precisa"),
 (r"The new edition cites","Examples:"),(r"La nouvelle édition cite","Exemples :"),(r"La nuova edizione cita","Esempi:"),
 (r", (?:according to the new edition|secondo la nuova edizione|selon la nouvelle édition),",""),
 (r",? ?(?:does the new edition describe|descrive la nuova edizione|décrit la nouvelle édition) ?\?","?"),
 (r"(?:the new edition|la nuova edizione|la nouvelle édition)","today"),
]
tot=0
for a,b in R:
    s,n=re.subn(a,b,s); tot+=n
open('wset3.html','w').write(s)
left=len(re.findall(r"new edition|nuova edizione|nouvelle édition|edizione|[^p]édition\b",s,re.I))
print("fix_edition",tot,"left",left)
