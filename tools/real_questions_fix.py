"""'real questions from The Wine Goat bank' could be read as real exam questions: reword (en/it/fr/es/es-ar). Idempotent."""
import glob
R=[('These are real questions from The Wine Goat bank on','These questions come from The Wine Goat question bank on'),
   ('Ce sont de vraies questions de la banque The Wine Goat sur','Ces questions viennent de la banque de questions The Wine Goat sur'),
   ('Son preguntas reales del banco de The Wine Goat sobre','Son preguntas del banco de preguntas de The Wine Goat sobre'),
   ('Sono domande reali della banca dati The Wine Goat su','Sono domande della banca dati di The Wine Goat su'),
   ('Sono domande reali della banca di The Wine Goat su','Sono domande della banca dati di The Wine Goat su')]
n=0
for f in glob.glob('**/index.html',recursive=True):
    if f.startswith('app/'): continue
    s=open(f,encoding='utf8').read(); o=s
    for a,b in R: s=s.replace(a,b)
    if s!=o: open(f,'w',encoding='utf8').write(s); n+=1
print(n,'pages')
