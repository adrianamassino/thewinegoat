"""v3: keyword-rich headings back + a visible SEO guide section."""
import json, os
B = os.path.dirname(os.path.abspath(__file__))
X = {
'it': {
 'h': {'free': "Bordeaux gratis: inizia la preparazione WSET 3 senza pagare",
       'explore': "Prova gratis: quiz e giochi WSET 3, qui e subito",
       'mods': "Preparazione WSET 3 a moduli: paghi solo quello che ti serve",
       'feat': "Tutto quello che serve per passare l'esame WSET 3, in ogni modulo"},
 'guide': {'h2': "Come prepararsi all'esame WSET Livello 3",
  'intro': "La guida per superare il WSET Level 3 Award in Wines al primo tentativo: cosa studiare, come allenarsi e quali errori evitare.",
  'blocks': [
   ["Quiz WSET 3: le domande a scelta multipla", "La prima sezione della teoria comprende 50 domande a scelta multipla. Il modo più efficace per prepararle è rispondere a tante domande in stile esame e capire ogni errore: per questo The Wine Goat raccoglie oltre 2.000 quiz WSET 3 con spiegazione, organizzati per argomento e per regione, dal vigneto alla cantina, da Bordeaux alla Nuova Zelanda."],
   ["Domande a risposta breve WSET 3", "Le 4 domande a risposta breve valgono metà della teoria e sono la parte in cui si perdono più punti. Non basta conoscere i fatti: bisogna spiegare il perché, collegando causa ed effetto (clima → maturazione → stile del vino). Con The Wine Goat scrivi o fotografi la tua risposta, ricevi la correzione punto per punto e vedi la risposta perfetta."],
   ["Simulazione d'esame WSET 3", "Fare almeno qualche simulazione completa a tempo è il modo migliore per arrivare sereni: abitua al ritmo dell'esame e mostra quali capitoli ripassare. Il modulo «Esame e strategia» comprende simulazioni d'esame WSET 3, la logica d'esame e i trabocchetti più frequenti."],
   ["Degustazione WSET 3 con il metodo SAT", "La prova di degustazione alla cieca di due vini si prepara con l'approccio sistematico (SAT): aspetto, naso, palato e conclusioni su qualità e potenziale d'invecchiamento. Nell'app trovi il lessico di ogni voce e le domande per allenare le conclusioni; il bicchiere resta il miglior allenamento."],
   ["Studiare il WSET 3 in italiano", "Molti materiali di ripasso esistono solo in inglese. The Wine Goat è in italiano, francese e inglese: puoi studiare nella tua lingua e passare all'inglese con un tocco se sosterrai l'esame in inglese."],
   ["Un piano di studio per il WSET 3", "Dieci minuti di quiz al giorno, una domanda aperta scritta a settimana, il ripasso degli errori e una simulazione nelle ultime settimane: è il ritmo che proponiamo. Con i moduli scegli da quale parte del programma WSET 3 partire, e Bordeaux è gratis per provare."]],
  'searches_h': "Le ricerche a cui rispondiamo",
  'searches': ["preparazione WSET 3", "quiz WSET 3", "domande esame WSET livello 3", "simulazione esame WSET 3", "domande a risposta breve WSET 3", "degustazione WSET 3 SAT", "come passare il WSET 3", "WSET 3 in italiano", "WSET Level 3 Award in Wines", "ripasso WSET 3", "WSET 2 e WSET 1 in arrivo"]}},
'fr': {
 'h': {'free': "Bordeaux gratuit : commencez la préparation au WSET 3 sans payer",
       'explore': "Essai gratuit : QCM et jeux WSET 3, ici et tout de suite",
       'mods': "Préparation au WSET 3 par modules : ne payez que ce qui vous sert",
       'feat': "Tout ce qu'il faut pour réussir l'examen WSET 3, dans chaque module"},
 'guide': {'h2': "Comment préparer l'examen WSET niveau 3",
  'intro': "Le guide pour réussir le WSET Level 3 Award in Wines du premier coup : quoi réviser, comment s'entraîner et quelles erreurs éviter.",
  'blocks': [
   ["QCM WSET 3 : les questions à choix multiple", "La première partie de la théorie comprend 50 questions à choix multiple. La meilleure préparation consiste à répondre à beaucoup de questions au format de l'examen et à comprendre chaque erreur : The Wine Goat réunit plus de 2 000 QCM WSET 3 expliqués, classés par thème et par région, du vignoble au chai, de Bordeaux à la Nouvelle-Zélande."],
   ["Questions à réponse courte WSET 3", "Les 4 questions à réponse courte représentent la moitié de la théorie, et c'est là que l'on perd le plus de points. Connaître les faits ne suffit pas : il faut expliquer le pourquoi, en reliant la cause et l'effet (climat → maturité → style du vin). Avec The Wine Goat, vous rédigez ou photographiez votre réponse, recevez une correction point par point et voyez la réponse parfaite."],
   ["Examen blanc WSET 3", "Faire au moins quelques examens blancs complets et chronométrés est le meilleur moyen d'arriver serein : on prend le rythme de l'examen et on voit quels chapitres réviser. Le module « Examen et stratégie » comprend des examens blancs WSET 3, la logique d'examen et les pièges les plus fréquents."],
   ["Dégustation WSET 3 selon le SAT", "L'épreuve de dégustation à l'aveugle de deux vins se prépare avec l'approche systématique (SAT) : aspect, nez, bouche et conclusions sur la qualité et le potentiel de garde. Dans l'application, vous trouvez le vocabulaire de chaque rubrique et des questions pour entraîner vos conclusions ; le verre reste le meilleur entraînement."],
   ["Réviser le WSET 3 en français", "Beaucoup de supports de révision n'existent qu'en anglais. The Wine Goat est en français, en italien et en anglais : vous révisez dans votre langue et passez à l'anglais d'un geste si vous présentez l'examen en anglais."],
   ["Un planning de révision pour le WSET 3", "Dix minutes de QCM par jour, une question ouverte rédigée par semaine, la révision des erreurs et un examen blanc dans les dernières semaines : c'est le rythme que nous proposons. Avec les modules, vous choisissez par quelle partie du programme WSET 3 commencer, et Bordeaux est gratuit pour essayer."]],
  'searches_h': "Les recherches auxquelles nous répondons",
  'searches': ["préparation WSET 3", "QCM WSET 3", "annales WSET 3", "examen blanc WSET 3", "questions ouvertes WSET 3", "dégustation WSET 3 SAT", "réussir le WSET 3", "WSET 3 en français", "WSET Level 3 Award in Wines", "révisions WSET 3", "WSET 2 et WSET 1 bientôt"]}},
'en': {
 'h': {'free': "Bordeaux free: start your WSET 3 prep without paying",
       'explore': "Free WSET 3 practice questions and games, right here",
       'mods': "WSET Level 3 prep by module: pay only for what you need",
       'feat': "Everything you need to pass WSET Level 3, in every module"},
 'guide': {'h2': "How to prepare for the WSET Level 3 exam",
  'intro': "The guide to passing the WSET Level 3 Award in Wines first time: what to study, how to practise and which mistakes to avoid.",
  'blocks': [
   ["WSET 3 multiple-choice practice questions", "The first theory section has 50 multiple-choice questions. The most effective preparation is answering lots of exam-style questions and understanding every mistake: The Wine Goat has 2,000+ WSET Level 3 practice questions with explanations, organised by topic and region, from vineyard to winery, from Bordeaux to New Zealand."],
   ["WSET 3 short written answers", "The 4 short written answer questions are worth half of the theory marks, and they are where most marks are lost. Knowing facts is not enough: you have to explain why, linking cause and effect (climate → ripeness → wine style). With The Wine Goat you type or photograph your answer, get point-by-point marking and see the perfect answer."],
   ["WSET 3 mock exams", "Sitting a few full timed mock exams is the best way to walk in with confidence: you get used to the pace and see which chapters need revision. The Exam and strategy module includes WSET Level 3 mock exams, exam logic and the most common traps."],
   ["WSET 3 tasting with the SAT", "The blind tasting of two wines is prepared with the Systematic Approach to Tasting (SAT): appearance, nose, palate and conclusions on quality and readiness for drinking. The app gives you the vocabulary for every heading and questions to train your conclusions; the glass remains the best practice."],
   ["Study WSET 3 in your language", "Most revision material exists only in English. The Wine Goat is in English, Italian and French: study in the language you think in and switch to English in one tap before the exam."],
   ["A WSET Level 3 study plan", "Ten minutes of questions a day, one written open question a week, mistake review and a mock exam in the final weeks: that is the rhythm we suggest. With modules you choose which part of the WSET 3 syllabus to start with, and Bordeaux is free to try."]],
  'searches_h': "Searches we answer",
  'searches': ["WSET Level 3 exam prep", "WSET 3 practice questions", "WSET Level 3 mock exam", "WSET 3 short written answers", "WSET 3 tasting SAT", "how to pass WSET Level 3", "WSET 3 revision", "WSET Level 3 Award in Wines", "WSET 3 study guide", "WSET 2 and WSET 1 coming soon"]}}}
for c, x in X.items():
    p = os.path.join(B, 'lang', c + '.json'); d = json.load(open(p, encoding='utf-8'))
    d['free']['h'] = x['h']['free']; d['explore']['h2'] = x['h']['explore']; d['mods']['h2'] = x['h']['mods']; d['feat']['h2'] = x['h']['feat']
    d['guide'] = x['guide']
    json.dump(d, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('ok')
