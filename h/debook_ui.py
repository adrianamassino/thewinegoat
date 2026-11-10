import re
R=[
('${n} questions · ${pSel.size} ${t("exItems")}','${n} ${t("qzQ")} · ${pSel.size} ${t("exItems")}'),
('"{N} questions tirées uniquement du manuel « Understanding Wines »"','"{N} questions pour préparer le WSET niveau 3"'),
('"{N} domande tratte solo dal manuale «Understanding Wines»"','"{N} domande per preparare il WSET Livello 3"'),
('"{N} questions drawn only from the \'Understanding Wines\' textbook"','"{N} questions to prepare for WSET Level 3"'),
('(punti chiave del manuale, in inglese)','(punti chiave, in inglese)'),('(points clés du manuel, en anglais)','(points clés, en anglais)'),('(textbook key points, in English)','(key points, in English)'),
('e usa la terminologia del manuale.','e usa la terminologia WSET.'),('avec le vocabulaire du manuel.','avec le vocabulaire du WSET.'),('using textbook terms.','using WSET terms.'),
('con i termini ufficiali del manuale.','con i termini ufficiali.'),('avec les termes officiels du manuel.','avec les termes officiels.'),('with the textbook\'s official terms.','with the official terms.'),
('di un vino classico descritto nel libro','di un vino classico'),('d\'un vin classique décrit dans le livre','d\'un vin classique'),('for a classic wine described in the book','for a classic wine'),
('"Esercizio: vino classico del manuale"','"Esercizio: un vino classico"'),('"Exercice : vin classique du manuel"','"Exercice : un vin classique"'),('"Exercise: classic wine from the textbook"','"Exercise: a classic wine"'),
('della scheda SAT, come nel manuale.','della scheda SAT.'),(', de la grille SAT officielle, comme dans le manuel.',', de la grille SAT officielle.'),('official English SAT terms, as in the textbook.','official English SAT terms.'),('official WSET SAT terms, as in the textbook.','official WSET SAT terms.'),
('"Completa le mappe del manuale"','"Completa le mappe del vino"'),('"Complétez les cartes du manuel"','"Complétez les cartes du vin"'),('"Complete the textbook maps"','"Complete the wine maps"'),
('Tutte le mappe del manuale, dai paesi','Tutte le mappe del vino, dai paesi'),('Toutes les cartes du manuel, des pays','Toutes les cartes du vin, des pays'),('Every map in the textbook, from countries','Every wine map, from countries'),
('i nomi sono quelli delle mappe del libro.','i nomi sono quelli delle denominazioni.'),('les noms sont ceux des cartes du livre.','les noms sont ceux des appellations.'),('names are those on the textbook maps.','names are those of the appellations.'),
('"Nota SAT tipica di un vino classico del manuale."','"Nota SAT tipica di un vino classico."'),('"Note SAT typique d\'un vin classique du manuel."','"Note SAT typique d\'un vin classique."'),('"Typical SAT note for a classic wine from the textbook."','"Typical SAT note for a classic wine."'),
('su una mappa del manuale.','su una mappa.'),('sur une carte du manuel.','sur une carte.'),('on a textbook map.','on a map.'),
('e caratteristiche dal manuale.','e caratteristiche.'),('et caractéristiques du manuel.','et caractéristiques.'),('and key features from the textbook.','and key features.'),
('dove compare nel manuale.','dove compare.'),('où il apparaît dans le manuel.','où il apparaît.'),('where it appears in the textbook.','where it appears.'),
('Le uve chiave del manuale,','Le uve chiave,'),('Les cépages clés du manuel,','Les cépages clés,'),('The key grapes from the textbook,','The key grapes,'),
('nome e cosa dice il manuale.','nome e cosa sapere.'),('ce qu\'en dit le manuel.','ce qu\'il faut savoir.'),('and what the textbook says.','and what to know.'),
('Base (luoghi del manuale)','Base (luoghi principali)'),('"Luoghi del manuale, confini visibili"','"Luoghi principali, confini visibili"'),('Base (lieux du manuel)','Base (lieux principaux)'),('"Lieux du manuel, limites visibles"','"Lieux principaux, limites visibles"'),('Basic (textbook places)','Basic (main places)'),('"Textbook places, borders shown"','"Main places, borders shown"'),
('con risposta e spiegazione del manuale,','con risposta e spiegazione,'),('avec la réponse et l\'explication du manuel,','avec la réponse et l\'explication,'),('with the textbook answer and explanation,','with the answer and explanation,'),
(' · WSET Level 3 · «Understanding Wines»</span>',' · WSET Level 3</span>'),
('"Abbinamento cibo-vino secondo il manuale."','"Abbinamento cibo-vino."'),('"Accords mets-vins selon le manuel."','"Accords mets-vins."'),('"Food and wine pairing according to the textbook."','"Food and wine pairing."'),
('che cosa dice il manuale della regola','che cosa sapere della regola'),('ce que dit le manuel de la règle','ce qu\'il faut savoir de la règle'),('what the textbook says about \'red with meat','what to know about \'red with meat'),
('principali difetti che il manuale chiede di riconoscere.','principali difetti da riconoscere.'),('principaux défauts que le manuel demande de reconnaître.','principaux défauts à reconnaître.'),('the main faults (condition) the textbook asks you to recognise.','the main faults (condition) you must recognise.'),
('raccomanda il libro e perché?','si raccomandano e perché?'),('recommande le livre et pourquoi ?','recommande-t-on et pourquoi ?'),('does the book recommend and why?','are recommended and why?'),
('Che cosa dice il manuale sulle «vecchie vigne»','Che cosa sapere sulle «vecchie vigne»'),('Que dit le manuel des « vieilles vignes »','Que faut-il savoir des « vieilles vignes »'),('What does the textbook say about \'old vines\'','What should you know about \'old vines\''),
('Tutti i processi del libro, capitolo per capitolo:','Tutti i processi del vino:'),('Tous les processus du livre, chapitre par chapitre :','Tous les processus du vin :'),('Every process in the book, chapter by chapter:','Every wine process:'),
('"Le lezioni del libro da ascoltare, capitolo per capitolo, con la IA per le tue domande"','"Lezioni da ascoltare, tema per tema, con la IA per le tue domande"'),
('Ogni capitolo del libro raccontato come una lezione:','Ogni tema raccontato come una lezione:'),
('"Les leçons du livre à écouter, chapitre par chapitre, avec l\'IA pour vos questions"','"Des leçons à écouter, thème par thème, avec l\'IA pour vos questions"'),
('Chaque chapitre du livre raconté comme une leçon :','Chaque thème raconté comme une leçon :'),
('"The book\'s lessons to listen to, chapter by chapter, with the AI for your questions"','"Lessons to listen to, topic by topic, with the AI for your questions"'),
('Every chapter of the book told as a lesson:','Every topic told as a lesson:'),
('il materiale del libro da leggere e ascoltare,','tutto il materiale da leggere e ascoltare,'),('le contenu du livre à lire et écouter,','tout le contenu à lire et écouter,'),('the book\'s content to read and listen to,','all the content to read and listen to,'),
('"Tutti i termini del libro, dal francese all\'italiano"','"Tutti i termini del vino, dal francese all\'italiano"'),('"Tous les termes du livre, avec définitions"','"Tous les termes du vin, avec définitions"'),('"All the book\'s terms, French to English"','"All the wine terms, French to English"'),
('"Tutte le uve del libro a confronto, in una tabella"','"Tutte le uve a confronto, in una tabella"'),('"Tous les cépages du livre comparés dans un tableau"','"Tous les cépages comparés dans un tableau"'),('"Every grape in the book side by side, in one table"','"Every grape side by side, in one table"'),
('"Cifre del libro"','"Le cifre da sapere"'),('"Les chiffres du livre"','"Les chiffres à connaître"'),
('tutto il libro da leggere, ascoltare e guardare, con calma.','tutto da leggere, ascoltare e guardare, con calma.'),('tout le livre à lire, écouter et regarder,','tout à lire, écouter et regarder,'),('the whole book to read, listen to and watch,','everything to read, listen to and watch,'),
('«Understanding Wines»',''),('the book says it is very hard','it is very hard'),('"Manuale, p."','""'),('"Manuel, p."','""'),('"Textbook, p."','""'),('« Understanding Wines »',''),
]
R+=[
(', su tutto il programma.',', su tutti gli argomenti.'),(', sur tout le programme.',', sur tous les thèmes.'),('across the whole syllabus.','across every topic.'),
('"10 domande da tutto il programma"','"10 domande su tutti gli argomenti"'),('"10 questions sur tout le programme"','"10 questions sur tous les thèmes"'),('"10 questions across the syllabus"','"10 questions across every topic"'),
('"Tutto il programma, una cosa alla volta."','"Tutti gli argomenti, una cosa alla volta."'),('"Tout le programme, une chose à la fois."','"Tous les thèmes, une chose à la fois."'),('"The whole syllabus, one thing at a time."','"Every topic, one thing at a time."'),
('Le domande coprono tutto il programma,','Le domande coprono tutti gli argomenti,'),('Les questions couvrent tout le programme,','Les questions couvrent tous les thèmes,'),('The questions cover the whole syllabus,','The questions cover every topic,'),
('"Facoltativo: di base c\'è tutto il programma."','"Facoltativo: di base ci sono tutti gli argomenti."'),('"Facultatif : par défaut, tout le programme."','"Facultatif : par défaut, tous les thèmes."'),('"Optional: by default, the whole syllabus."','"Optional: by default, every topic."'),
]
def apply(out):
    n=0
    for a,b in R:
        c=out.count(a)
        if c: n+=c; out=out.replace(a,b)
    out,k=re.subn(r'(?: · )?\$\{t\("m?[pP]age"\)\} \$\{[a-z]\.p\}','',out); n+=k
    out=out.replace('${oPages(o)?`<span class="pref">${t("page")} ${oPages(o)}</span>`:""}','')
    out=out.replace('<p class="pref"></p>','').replace('<span class="pref"></span>','')
    return out,n
