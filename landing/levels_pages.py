# -*- coding: utf-8 -*-
"""SEO guides for WSET Level 1 and Level 2 Award in Wines (en, it, fr, es). The app for these levels is 'coming soon'."""
import html, json
e = lambda s: html.escape(str(s), quote=True)

URL = {'l1': {'en': '/wset-level-1/', 'it': '/it/wset-livello-1/', 'fr': '/fr/wset-niveau-1/', 'es': '/es/wset-nivel-1/'},
       'l2': {'en': '/wset-level-2/', 'it': '/it/wset-livello-2/', 'fr': '/fr/wset-niveau-2/', 'es': '/es/wset-nivel-2/'}}
L3 = {'en': '/how-to-pass-wset-level-3/', 'it': '/it/come-superare-wset-3/', 'fr': '/fr/reussir-wset-niveau-3/', 'es': '/es/como-aprobar-wset-3/'}
HOME = {'en': '/', 'it': '/it/', 'fr': '/fr/', 'es': '/es/'}

UI = {
 'en': dict(glance='The exam at a glance', q='Questions', dur='Duration', pass_='Pass mark', hours='Study time', pre='Prerequisites', none='None', covers='What the syllabus covers',
   grapes='Grape varieties to know', how='How to study, step by step', traps='Common mistakes', sample='Try 3 sample questions', show='Show the answer', cmp='Level 1, 2 or 3: which one is for you?',
   lvl='Level', fmt='Exam', soon_k='Coming soon in the app', soon_h='The Wine Goat for {L} is on its way', soon_p='Practice questions, mock exams and a study plan for {L}, in the same app as Level 3. Leave your email in the app and we will tell you as soon as it opens.',
   soon_b='Notify me', soon_b2='Try Level 3 free', faq='Frequently asked questions', disc='The Wine Goat is independent and is not affiliated with or endorsed by the Wine & Spirit Education Trust (WSET®). WSET® is a registered trademark of its owner.', crumbs='Home'),
 'it': dict(glance="L'esame in breve", q='Domande', dur='Durata', pass_='Soglia per passare', hours='Ore di studio', pre='Requisiti', none='Nessuno', covers='Cosa copre il programma',
   grapes='Vitigni da conoscere', how='Come studiare, passo dopo passo', traps='Errori frequenti', sample='Prova 3 domande di esempio', show='Mostra la risposta', cmp='Livello 1, 2 o 3: quale fa per te?',
   lvl='Livello', fmt='Esame', soon_k="In arrivo nell'app", soon_h='The Wine Goat per il {L} sta arrivando', soon_p="Quiz, simulazioni d'esame e piano di studio per il {L}, nella stessa app del Livello 3. Lascia la tua email nell'app e ti avvisiamo appena apre.",
   soon_b='Avvisami', soon_b2='Prova gratis il Livello 3', faq='Domande frequenti', disc='The Wine Goat è indipendente e non è affiliato né approvato dal Wine & Spirit Education Trust (WSET®). WSET® è un marchio registrato del rispettivo titolare.', crumbs='Home'),
 'fr': dict(glance="L'examen en bref", q='Questions', dur='Durée', pass_='Note de réussite', hours="Temps d'étude", pre='Prérequis', none='Aucun', covers='Ce que couvre le programme',
   grapes='Cépages à connaître', how='Comment réviser, étape par étape', traps='Erreurs fréquentes', sample='Essayez 3 questions', show='Voir la réponse', cmp='Niveau 1, 2 ou 3 : lequel est fait pour vous ?',
   lvl='Niveau', fmt='Examen', soon_k="Bientôt dans l'appli", soon_h='The Wine Goat pour le {L} arrive', soon_p="QCM, examens blancs et plan de révision pour le {L}, dans la même appli que le Niveau 3. Laissez votre e-mail dans l'appli et nous vous préviendrons dès l'ouverture.",
   soon_b='Me prévenir', soon_b2='Essayer le Niveau 3 gratuitement', faq='Questions fréquentes', disc="The Wine Goat est indépendant et n'est ni affilié ni approuvé par le Wine & Spirit Education Trust (WSET®). WSET® est une marque déposée de son titulaire.", crumbs='Accueil'),
 'es': dict(glance='El examen en breve', q='Preguntas', dur='Duración', pass_='Nota para aprobar', hours='Horas de estudio', pre='Requisitos', none='Ninguno', covers='Qué cubre el programa',
   grapes='Variedades que debes conocer', how='Cómo estudiar, paso a paso', traps='Errores frecuentes', sample='Prueba 3 preguntas de ejemplo', show='Ver la respuesta', cmp='Nivel 1, 2 o 3: ¿cuál es para ti?',
   lvl='Nivel', fmt='Examen', soon_k='Muy pronto en la app', soon_h='The Wine Goat para el {L} está en camino', soon_p='Preguntas tipo test, simulacros y plan de estudio para el {L}, en la misma app del Nivel 3. Deja tu email en la app y te avisamos en cuanto abra.',
   soon_b='Avísame', soon_b2='Prueba gratis el Nivel 3', faq='Preguntas frecuentes', disc='The Wine Goat es independiente y no está afiliado ni respaldado por el Wine & Spirit Education Trust (WSET®). WSET® es una marca registrada de su titular.', crumbs='Inicio'),
}

GR8 = ['Chardonnay', 'Sauvignon Blanc', 'Pinot Grigio / Pinot Gris', 'Riesling', 'Cabernet Sauvignon', 'Merlot', 'Pinot Noir', 'Syrah / Shiraz']

# comparison table rows: (questions, duration, pass, hours, written, tasting)
CMP = {
 'en': [('30 multiple choice', '45 min', '70%', '≈ 6 h', 'no', 'no'), ('50 multiple choice', '60 min', '55%', '≈ 28 h', 'no', 'no'), ('50 multiple choice + 4 written questions', '2 h + 30 min tasting', '55%', '≈ 84 h', 'yes', 'yes (2 wines)')],
 'it': [('30 a scelta multipla', '45 min', '70%', '≈ 6 h', 'no', 'no'), ('50 a scelta multipla', '60 min', '55%', '≈ 28 h', 'no', 'no'), ('50 a scelta multipla + 4 domande aperte', '2 h + 30 min degustazione', '55%', '≈ 84 h', 'sì', 'sì (2 vini)')],
 'fr': [('30 QCM', '45 min', '70 %', '≈ 6 h', 'non', 'non'), ('50 QCM', '60 min', '55 %', '≈ 28 h', 'non', 'non'), ('50 QCM + 4 questions rédigées', '2 h + 30 min de dégustation', '55 %', '≈ 84 h', 'oui', 'oui (2 vins)')],
 'es': [('30 tipo test', '45 min', '70 %', '≈ 6 h', 'no', 'no'), ('50 tipo test', '60 min', '55 %', '≈ 28 h', 'no', 'no'), ('50 tipo test + 4 preguntas escritas', '2 h + 30 min de cata', '55 %', '≈ 84 h', 'sí', 'sí (2 vinos)')],
}
CMPH = {'en': ('Format', 'Duration', 'Pass mark', 'Study time', 'Written answers', 'Tasting exam'), 'it': ('Formato', 'Durata', 'Soglia', 'Ore di studio', 'Domande aperte', 'Esame di degustazione'),
        'fr': ('Format', 'Durée', 'Note de réussite', "Temps d'étude", 'Réponses rédigées', 'Dégustation notée'), 'es': ('Formato', 'Duración', 'Nota para aprobar', 'Horas de estudio', 'Respuestas escritas', 'Examen de cata')}

P = {}
P['l1'] = {
 'en': dict(name='WSET Level 1', title='WSET Level 1 Award in Wines: exam format, syllabus, study tips & practice questions',
  desc='Everything about the WSET Level 1 Award in Wines: 30 multiple-choice questions in 45 minutes, 70% pass mark, what the syllabus covers, how to study, sample questions and FAQ.',
  kw='WSET Level 1, WSET Level 1 Award in Wines, WSET 1 exam, WSET Level 1 questions, WSET Level 1 practice test, WSET level 1 pass mark, wine course beginners',
  h1='WSET Level 1 Award in Wines: the complete guide', lead='The perfect first step into wine. A short, friendly course that teaches you the main styles of wine, the key grapes, how to store and serve wine and how to pair it with food — and an exam you can pass with a few hours of focused practice.',
  glance=dict(q='30 multiple-choice questions', dur='45 minutes', pass_='70% (21 correct answers out of 30)', hours='About 6 hours of guided learning', pre='None — ideal for beginners'),
  covers=['The main types and styles of wine: still, sparkling and fortified; white, rosé and red', 'How wine is made, in simple terms, and how grape variety and climate shape its style',
          'The principal grape varieties and the styles of wine they make', 'How to describe a wine using the WSET Level 1 Systematic Approach to Tasting',
          'Storing and serving wine: temperatures, glasses, opening a bottle of still and sparkling wine', 'Food and wine pairing: how sweetness, acidity, salt and umami change the taste of a wine'],
  how=[('Learn the eight principal grapes first', 'Most questions come back to them. For each one, know whether it is white or red, its typical aromas and the style it gives in a cool or warm climate.'),
       ('Master service temperatures', 'Sparkling and sweet wines well chilled, light whites chilled, light reds lightly chilled, full-bodied reds at room temperature: these are easy points.'),
       ('Learn the food and wine rules', 'Sweetness and umami in food make wine taste more bitter and acidic; salt and acidity in food make it taste softer. Memorise the direction of each effect.'),
       ('Practise with timed questions', '30 questions in 45 minutes leaves 90 seconds each: train with short daily quizzes and review every mistake.')],
  traps=['Confusing grape varieties with regions (Chablis is a place, Chardonnay is the grape)', 'Mixing up the effect of food on wine — learn it as a table', 'Rushing: with a 70% pass mark, every careless mistake counts'],
  sample=[('Which grape variety is used for red Burgundy?', ['Pinot Noir', 'Merlot', 'Syrah', 'Cabernet Sauvignon'], 'Red Burgundy is made from Pinot Noir.'),
          ('At what temperature should a light-bodied red wine be served?', ['Lightly chilled, around 13 °C', 'Well chilled, 6–8 °C', 'At 20–25 °C', 'Just above freezing'], 'Light-bodied reds show best lightly chilled, around 13 °C.'),
          ('How does sweetness in food affect a wine?', ['It makes the wine taste more bitter and acidic, and less fruity', 'It makes the wine taste sweeter', 'It has no effect', 'It makes the wine taste less acidic'], 'Sweet food makes a wine taste drier, more bitter and more acidic.')],
  faq=[('How hard is the WSET Level 1 exam?', 'It is the most accessible WSET wine qualification: 30 multiple-choice questions on the basics, with a pass mark of 70%. With the course and some practice questions most candidates pass.'),
       ('How long does it take to prepare?', 'The course is about 6 hours of guided learning, often in one day. A few short practice sessions before the exam are usually enough.'),
       ('Do I need any experience?', 'No. Level 1 has no prerequisites and is designed for complete beginners and people starting to work in hospitality.'),
       ('Is there a tasting exam?', 'No. You taste wines during the course to learn the tasting method, but the exam is only multiple choice.'),
       ('Should I take Level 1 or go straight to Level 2?', 'If you already enjoy wine and want a recognised qualification, many people start directly at Level 2. Level 1 is ideal if you are new to wine or work in service.'),
       ('Will The Wine Goat have Level 1?', 'Yes. Practice questions, mock exams and a study plan for Level 1 are coming soon. Level 3 is already available.')]),
 'it': dict(name='WSET Livello 1', title="WSET Livello 1 (Award in Wines): esame, programma, consigli e domande d'esempio",
  desc="Tutto sul WSET Livello 1 Award in Wines: 30 domande a scelta multipla in 45 minuti, soglia del 70%, cosa copre il programma, come studiare, domande d'esempio e FAQ.",
  kw='WSET Livello 1, WSET 1, esame WSET livello 1, domande WSET livello 1, quiz WSET 1, corso vino principianti, WSET Level 1 italiano',
  h1='WSET Livello 1 Award in Wines: la guida completa', lead="Il primo passo perfetto nel mondo del vino. Un corso breve che ti insegna gli stili principali, i vitigni chiave, come conservare e servire il vino e come abbinarlo al cibo — con un esame che si supera con poche ore di pratica mirata.",
  glance=dict(q='30 domande a scelta multipla', dur='45 minuti', pass_='70% (21 risposte giuste su 30)', hours='Circa 6 ore di formazione guidata', pre='Nessuno — ideale per principianti'),
  covers=['I tipi e gli stili principali di vino: fermo, spumante e fortificato; bianco, rosato e rosso', "Come si fa il vino, in modo semplice, e come vitigno e clima ne influenzano lo stile",
          'I vitigni principali e gli stili di vino che producono', 'Come descrivere un vino con il metodo di degustazione sistematico (SAT) del Livello 1',
          'Conservazione e servizio: temperature, bicchieri, apertura di vini fermi e spumanti', "Abbinamento cibo-vino: come dolcezza, acidità, sale e umami cambiano il gusto del vino"],
  how=[('Impara prima gli otto vitigni principali', 'Molte domande tornano lì. Per ognuno sappi se è bianco o rosso, gli aromi tipici e lo stile che dà in clima fresco o caldo.'),
       ('Padroneggia le temperature di servizio', 'Spumanti e vini dolci ben freddi, bianchi leggeri freschi, rossi leggeri leggermente freschi, rossi strutturati a temperatura ambiente: punti facili.'),
       ('Impara le regole degli abbinamenti', 'Dolcezza e umami nel cibo rendono il vino più amaro e acido; sale e acidità nel cibo lo rendono più morbido. Memorizza la direzione di ogni effetto.'),
       ('Allenati con domande a tempo', '30 domande in 45 minuti sono 90 secondi ciascuna: fai brevi quiz ogni giorno e ripassa ogni errore.')],
  traps=['Confondere vitigni e zone (Chablis è un luogo, lo Chardonnay è il vitigno)', "Invertire l'effetto del cibo sul vino: imparalo come una tabella", 'Avere fretta: con la soglia al 70% ogni distrazione conta'],
  sample=[('Con quale vitigno si fa il Borgogna rosso?', ['Pinot Noir', 'Merlot', 'Syrah', 'Cabernet Sauvignon'], 'Il Borgogna rosso è fatto con il Pinot Noir.'),
          ('A che temperatura si serve un rosso leggero?', ['Leggermente fresco, circa 13 °C', 'Ben freddo, 6–8 °C', 'A 20–25 °C', 'Appena sopra lo zero'], 'I rossi leggeri danno il meglio leggermente freschi, intorno ai 13 °C.'),
          ('Che effetto ha la dolcezza del cibo sul vino?', ['Il vino sembra più amaro e acido, e meno fruttato', 'Il vino sembra più dolce', 'Nessun effetto', 'Il vino sembra meno acido'], 'Il cibo dolce fa sembrare il vino più secco, più amaro e più acido.')],
  faq=[("L'esame WSET Livello 1 è difficile?", 'È la qualifica WSET sul vino più accessibile: 30 domande a scelta multipla sulle basi, con soglia al 70%. Con il corso e un po’ di quiz la maggior parte dei candidati passa.'),
       ('Quanto tempo serve per prepararsi?', 'Il corso dura circa 6 ore di formazione guidata, spesso in un giorno. Qualche breve sessione di quiz prima dell’esame di solito basta.'),
       ('Serve esperienza?', 'No. Il Livello 1 non ha requisiti ed è pensato per principianti e per chi inizia a lavorare nella ristorazione.'),
       ("C'è un esame di degustazione?", "No. Durante il corso si degusta per imparare il metodo, ma l'esame è solo a scelta multipla."),
       ('Meglio il Livello 1 o direttamente il Livello 2?', 'Se il vino ti appassiona già e vuoi una qualifica riconosciuta, molti partono direttamente dal Livello 2. Il Livello 1 è ideale se sei all’inizio o lavori in sala.'),
       ('The Wine Goat avrà il Livello 1?', "Sì. Quiz, simulazioni d'esame e piano di studio per il Livello 1 sono in arrivo. Il Livello 3 è già disponibile.")]),
 'fr': dict(name='WSET Niveau 1', title="WSET Niveau 1 (Award in Wines) : examen, programme, conseils et questions d'entraînement",
  desc="Tout sur le WSET Niveau 1 Award in Wines : 30 QCM en 45 minutes, 70 % pour réussir, contenu du programme, méthode de révision, questions d'exemple et FAQ.",
  kw='WSET Niveau 1, WSET 1, examen WSET niveau 1, QCM WSET niveau 1, questions WSET 1, formation vin débutant, WSET Level 1 français',
  h1='WSET Niveau 1 Award in Wines : le guide complet', lead="Le premier pas idéal dans le monde du vin. Une formation courte qui vous apprend les grands styles de vin, les cépages clés, la conservation, le service et les accords mets-vins — avec un examen que l'on réussit avec quelques heures d'entraînement ciblé.",
  glance=dict(q='30 questions à choix multiples', dur='45 minutes', pass_='70 % (21 bonnes réponses sur 30)', hours='Environ 6 heures de formation guidée', pre='Aucun — idéal pour débuter'),
  covers=['Les grands types et styles de vin : tranquille, effervescent et muté ; blanc, rosé et rouge', "L'élaboration du vin, simplement, et l'influence du cépage et du climat sur le style",
          'Les principaux cépages et les styles de vins qu’ils donnent', 'Décrire un vin avec la méthode de dégustation systématique (SAT) du Niveau 1',
          'Conservation et service : températures, verres, ouverture des vins tranquilles et effervescents', 'Accords mets-vins : comment le sucre, l’acidité, le sel et l’umami modifient le goût du vin'],
  how=[('Apprenez d’abord les huit cépages principaux', 'Beaucoup de questions y reviennent. Pour chacun : blanc ou rouge, arômes typiques, style en climat frais ou chaud.'),
       ('Maîtrisez les températures de service', 'Effervescents et vins doux bien frais, blancs légers frais, rouges légers légèrement rafraîchis, rouges corsés à température ambiante : des points faciles.'),
       ('Apprenez les règles des accords', 'Le sucre et l’umami dans le plat rendent le vin plus amer et plus acide ; le sel et l’acidité le rendent plus souple. Retenez le sens de chaque effet.'),
       ('Entraînez-vous en temps limité', '30 questions en 45 minutes, soit 90 secondes chacune : faites de courts QCM chaque jour et revoyez chaque erreur.')],
  traps=['Confondre cépages et régions (Chablis est un lieu, le Chardonnay est le cépage)', 'Inverser l’effet des plats sur le vin : apprenez-le sous forme de tableau', 'Aller trop vite : avec 70 % requis, chaque inattention compte'],
  sample=[('Quel cépage donne le Bourgogne rouge ?', ['Pinot Noir', 'Merlot', 'Syrah', 'Cabernet Sauvignon'], 'Le Bourgogne rouge est élaboré à partir de Pinot Noir.'),
          ('À quelle température servir un rouge léger ?', ['Légèrement rafraîchi, vers 13 °C', 'Bien frais, 6–8 °C', 'À 20–25 °C', 'Juste au-dessus de zéro'], 'Les rouges légers s’expriment mieux légèrement rafraîchis, vers 13 °C.'),
          ('Quel est l’effet du sucre dans un plat sur le vin ?', ['Le vin paraît plus amer et plus acide, moins fruité', 'Le vin paraît plus sucré', 'Aucun effet', 'Le vin paraît moins acide'], 'Un plat sucré rend le vin plus sec, plus amer et plus acide.')],
  faq=[("L'examen WSET Niveau 1 est-il difficile ?", 'C’est la qualification vins WSET la plus accessible : 30 QCM sur les bases, avec 70 % pour réussir. Avec la formation et quelques QCM, la plupart des candidats réussissent.'),
       ('Combien de temps faut-il pour se préparer ?', 'La formation représente environ 6 heures, souvent en une journée. Quelques courtes séances de QCM avant l’examen suffisent généralement.'),
       ('Faut-il de l’expérience ?', 'Non. Le Niveau 1 n’a aucun prérequis et s’adresse aux débutants et aux personnes qui commencent en restauration.'),
       ('Y a-t-il une dégustation notée ?', 'Non. On déguste pendant la formation pour apprendre la méthode, mais l’examen ne comporte que des QCM.'),
       ('Niveau 1 ou directement Niveau 2 ?', 'Si vous aimez déjà le vin et voulez une qualification reconnue, beaucoup commencent directement au Niveau 2. Le Niveau 1 est idéal pour débuter ou pour le service.'),
       ('The Wine Goat proposera-t-il le Niveau 1 ?', 'Oui. QCM, examens blancs et plan de révision pour le Niveau 1 arrivent bientôt. Le Niveau 3 est déjà disponible.')]),
 'es': dict(name='WSET Nivel 1', title='WSET Nivel 1 (Award in Wines): examen, temario, consejos y preguntas de práctica',
  desc='Todo sobre el WSET Nivel 1 Award in Wines: 30 preguntas tipo test en 45 minutos, 70 % para aprobar, qué cubre el temario, cómo estudiar, preguntas de ejemplo y FAQ.',
  kw='WSET Nivel 1, WSET 1, examen WSET nivel 1, preguntas WSET nivel 1, test WSET 1, curso de vino principiantes, WSET Level 1 español',
  h1='WSET Nivel 1 Award in Wines: la guía completa', lead='El primer paso perfecto en el mundo del vino. Un curso corto que te enseña los estilos principales, las uvas clave, cómo conservar y servir el vino y cómo maridarlo — con un examen que se aprueba con unas pocas horas de práctica.',
  glance=dict(q='30 preguntas tipo test', dur='45 minutos', pass_='70 % (21 respuestas correctas de 30)', hours='Unas 6 horas de formación guiada', pre='Ninguno — ideal para principiantes'),
  covers=['Los principales tipos y estilos de vino: tranquilo, espumoso y generoso; blanco, rosado y tinto', 'Cómo se elabora el vino, de forma sencilla, y cómo la uva y el clima influyen en su estilo',
          'Las principales variedades y los estilos de vino que dan', 'Cómo describir un vino con el método de cata sistemática (SAT) del Nivel 1',
          'Conservación y servicio: temperaturas, copas, abrir vinos tranquilos y espumosos', 'Maridaje: cómo el dulzor, la acidez, la sal y el umami cambian el sabor del vino'],
  how=[('Aprende primero las ocho uvas principales', 'Muchas preguntas vuelven a ellas. De cada una: blanca o tinta, aromas típicos y estilo en clima fresco o cálido.'),
       ('Domina las temperaturas de servicio', 'Espumosos y dulces bien fríos, blancos ligeros frescos, tintos ligeros algo frescos, tintos con cuerpo a temperatura ambiente: puntos fáciles.'),
       ('Aprende las reglas del maridaje', 'El dulzor y el umami de la comida hacen el vino más amargo y ácido; la sal y la acidez lo suavizan. Memoriza la dirección de cada efecto.'),
       ('Practica con preguntas cronometradas', '30 preguntas en 45 minutos son 90 segundos cada una: haz tests cortos cada día y repasa cada error.')],
  traps=['Confundir uvas y regiones (Chablis es un lugar, la Chardonnay es la uva)', 'Invertir el efecto de la comida en el vino: apréndelo como una tabla', 'Ir con prisa: con el 70 % para aprobar, cada despiste cuenta'],
  sample=[('¿Con qué uva se elabora el Borgoña tinto?', ['Pinot Noir', 'Merlot', 'Syrah', 'Cabernet Sauvignon'], 'El Borgoña tinto se elabora con Pinot Noir.'),
          ('¿A qué temperatura se sirve un tinto ligero?', ['Ligeramente fresco, unos 13 °C', 'Bien frío, 6–8 °C', 'A 20–25 °C', 'Justo por encima de cero'], 'Los tintos ligeros se disfrutan más ligeramente frescos, hacia 13 °C.'),
          ('¿Qué efecto tiene el dulzor de la comida en el vino?', ['El vino parece más amargo y ácido, y menos afrutado', 'El vino parece más dulce', 'Ningún efecto', 'El vino parece menos ácido'], 'La comida dulce hace que el vino parezca más seco, amargo y ácido.')],
  faq=[('¿Es difícil el examen WSET Nivel 1?', 'Es la certificación WSET de vinos más accesible: 30 preguntas tipo test sobre lo básico, con un 70 % para aprobar. Con el curso y algo de práctica la mayoría aprueba.'),
       ('¿Cuánto tiempo hace falta para prepararse?', 'El curso son unas 6 horas de formación guiada, a menudo en un día. Unas pocas sesiones cortas de preguntas antes del examen suelen bastar.'),
       ('¿Necesito experiencia?', 'No. El Nivel 1 no tiene requisitos y está pensado para principiantes y para quien empieza en hostelería.'),
       ('¿Hay examen de cata?', 'No. En el curso se cata para aprender el método, pero el examen es solo tipo test.'),
       ('¿Nivel 1 o directamente Nivel 2?', 'Si ya te gusta el vino y quieres una certificación reconocida, mucha gente empieza directamente por el Nivel 2. El Nivel 1 es ideal si empiezas de cero o trabajas en sala.'),
       ('¿Tendrá The Wine Goat el Nivel 1?', 'Sí. Preguntas, simulacros y plan de estudio para el Nivel 1 llegan muy pronto. El Nivel 3 ya está disponible.')]),
}
P['l2'] = {
 'en': dict(name='WSET Level 2', title='WSET Level 2 Award in Wines: exam format, syllabus, grapes, study plan & practice questions',
  desc='The complete guide to the WSET Level 2 Award in Wines: 50 multiple-choice questions in 60 minutes, 55% pass mark, 30 grape varieties and 70+ regions, how to study, sample questions and FAQ.',
  kw='WSET Level 2, WSET Level 2 Award in Wines, WSET 2 exam, WSET Level 2 questions, WSET Level 2 practice test, WSET level 2 mock exam, WSET 2 grape varieties, WSET level 2 pass mark',
  h1='WSET Level 2 Award in Wines: the complete guide', lead='The most popular wine qualification in the world. Level 2 takes you through the grape varieties and regions behind the wines you see on shelves and wine lists, how labels work and how to pair wine with food. The exam is 50 multiple-choice questions: very passable with a structured plan.',
  glance=dict(q='50 multiple-choice questions', dur='60 minutes', pass_='55% (28 correct answers out of 50)', hours='About 28 hours: 16 of guided learning + 11 of private study + the exam', pre='None — Level 1 is not required'),
  covers=['The eight principal grape varieties and 22 regionally important ones', 'Wines from over 70 geographical indications around the world',
          'How the environment and winemaking (oak, malolactic conversion, residual sugar) shape a wine’s style', 'Sparkling wines and their methods, and fortified wines such as Port and Sherry',
          'Reading wine labels: quality categories and labelling terms in the main countries', 'Storage, service and food and wine pairing', 'Describing wines with the WSET Level 2 Systematic Approach to Tasting'],
  how=[('Build a grid for the 8 principal grapes', 'For each one write the climate, the key regions, the typical aromas and how it changes in a cool or warm area. Most questions use this logic.'),
       ('Attach each region to its grape', 'Learn the regions as pairs: Sancerre — Sauvignon Blanc, Barossa — Shiraz, Rioja — Tempranillo, Chianti — Sangiovese. Then add the regionally important grapes.'),
       ('Learn labelling terms', 'Questions often test terms like Riserva, Crianza, Kabinett, Brut or AOC/DOP. Turn them into flashcards.'),
       ('Do full mock exams', 'Train with 50 questions in 60 minutes and review every mistake: the pass mark is 55%, but aiming for 70% gives you a safety margin.')],
  traps=['Mixing up regions in the same country (Bordeaux Left Bank vs Right Bank, Northern vs Southern Rhône)', 'Forgetting the effect of climate on the same grape', 'Confusing sparkling methods (traditional vs tank)', 'Underestimating fortified wines and labelling terms'],
  sample=[('Which method is used to make Champagne?', ['The traditional method, second fermentation in the bottle', 'The tank method', 'Carbonation', 'The ancestral method'], 'Champagne is made by the traditional method, with the second fermentation in the bottle.'),
          ('Which grape variety is used for Barolo?', ['Nebbiolo', 'Sangiovese', 'Barbera', 'Montepulciano'], 'Barolo is made from 100% Nebbiolo.'),
          ('Which grape is the signature white variety of Marlborough, New Zealand?', ['Sauvignon Blanc', 'Chardonnay', 'Riesling', 'Chenin Blanc'], 'Marlborough is famous for intensely aromatic Sauvignon Blanc.')],
  faq=[('How hard is the WSET Level 2 exam?', 'It requires real study but it is very passable: 50 multiple-choice questions in an hour with a 55% pass mark. Most candidates who follow the course and practise with questions pass.'),
       ('How long should I study for WSET Level 2?', 'WSET indicates about 28 hours in total, including 16 hours of guided learning. In practice 3–5 weeks of regular revision works well.'),
       ('Do I need Level 1 before Level 2?', 'No. You can start directly at Level 2 — many people do.'),
       ('Is there a tasting exam at Level 2?', 'No. You taste during the course, but the exam is only multiple choice. Blind tasting is assessed from Level 3.'),
       ('What happens after Level 2?', 'Level 3 goes much deeper, with written answers and a blind tasting of two wines. The Wine Goat already covers Level 3 in full.'),
       ('Will The Wine Goat have Level 2?', 'Yes. Practice questions, mock exams and a personal study plan for Level 2 are coming soon.')]),
 'it': dict(name='WSET Livello 2', title="WSET Livello 2 (Award in Wines): esame, programma, vitigni, piano di studio e domande d'esempio",
  desc="La guida completa al WSET Livello 2 Award in Wines: 50 domande a scelta multipla in 60 minuti, soglia del 55%, 30 vitigni e oltre 70 zone, come studiare, domande d'esempio e FAQ.",
  kw="WSET Livello 2, WSET 2, esame WSET livello 2, domande WSET livello 2, quiz WSET 2, simulazione esame WSET 2, vitigni WSET 2, WSET Level 2 italiano",
  h1='WSET Livello 2 Award in Wines: la guida completa', lead="La qualifica sul vino più diffusa al mondo. Il Livello 2 ti porta tra i vitigni e le zone dei vini che vedi sugli scaffali e nelle carte dei vini, come leggere un'etichetta e come abbinare vino e cibo. L'esame è di 50 domande a scelta multipla: si supera bene con un piano strutturato.",
  glance=dict(q='50 domande a scelta multipla', dur='60 minuti', pass_='55% (28 risposte giuste su 50)', hours='Circa 28 ore: 16 di formazione guidata + 11 di studio individuale + l’esame', pre='Nessuno — il Livello 1 non è obbligatorio'),
  covers=['Gli otto vitigni principali e 22 vitigni di importanza regionale', 'Vini di oltre 70 indicazioni geografiche nel mondo',
          "Come ambiente e vinificazione (legno, fermentazione malolattica, zucchero residuo) influenzano lo stile", 'Spumanti e i loro metodi, e vini fortificati come Porto e Sherry',
          'Leggere le etichette: categorie di qualità e termini nei principali paesi', 'Conservazione, servizio e abbinamento cibo-vino', 'Descrivere i vini con il metodo SAT del Livello 2'],
  how=[('Costruisci una griglia degli 8 vitigni principali', 'Per ognuno scrivi clima, zone chiave, aromi tipici e come cambia in zona fresca o calda. Molte domande seguono questa logica.'),
       ('Associa ogni zona al suo vitigno', 'Impara le zone a coppie: Sancerre — Sauvignon Blanc, Barossa — Shiraz, Rioja — Tempranillo, Chianti — Sangiovese. Poi aggiungi i vitigni regionali.'),
       ('Impara i termini delle etichette', 'Le domande chiedono spesso termini come Riserva, Crianza, Kabinett, Brut o AOC/DOP. Trasformali in flashcard.'),
       ("Fai simulazioni d'esame complete", 'Allenati con 50 domande in 60 minuti e ripassa ogni errore: la soglia è il 55%, ma puntare al 70% ti dà margine.')],
  traps=['Confondere zone dello stesso paese (rive sinistra e destra di Bordeaux, Rodano settentrionale e meridionale)', "Dimenticare l'effetto del clima sullo stesso vitigno", 'Confondere i metodi degli spumanti (classico e Martinotti/Charmat)', 'Sottovalutare vini fortificati e termini in etichetta'],
  sample=[('Con quale metodo si produce lo Champagne?', ['Metodo classico, rifermentazione in bottiglia', 'Metodo Martinotti/Charmat in autoclave', 'Gassificazione', 'Metodo ancestrale'], 'Lo Champagne si fa con il metodo classico, con la seconda fermentazione in bottiglia.'),
          ('Con quale vitigno si produce il Barolo?', ['Nebbiolo', 'Sangiovese', 'Barbera', 'Montepulciano'], 'Il Barolo è prodotto al 100% con Nebbiolo.'),
          ('Qual è il bianco simbolo di Marlborough, in Nuova Zelanda?', ['Sauvignon Blanc', 'Chardonnay', 'Riesling', 'Chenin Blanc'], 'Marlborough è famosa per il Sauvignon Blanc molto aromatico.')],
  faq=[("L'esame WSET Livello 2 è difficile?", 'Richiede studio vero ma si supera bene: 50 domande a scelta multipla in un’ora con soglia al 55%. La maggior parte di chi segue il corso e si allena con i quiz passa.'),
       ('Quanto bisogna studiare per il WSET Livello 2?', 'WSET indica circa 28 ore in tutto, di cui 16 di formazione guidata. In pratica 3–5 settimane di ripasso regolare funzionano bene.'),
       ('Serve il Livello 1 prima del Livello 2?', 'No. Si può partire direttamente dal Livello 2, e in molti lo fanno.'),
       ("C'è un esame di degustazione al Livello 2?", "No. Si degusta durante il corso, ma l'esame è solo a scelta multipla. La degustazione alla cieca si valuta dal Livello 3."),
       ('Cosa viene dopo il Livello 2?', 'Il Livello 3 va molto più a fondo, con domande aperte e degustazione alla cieca di due vini. The Wine Goat copre già interamente il Livello 3.'),
       ('The Wine Goat avrà il Livello 2?', "Sì. Quiz, simulazioni d'esame e piano di studio personale per il Livello 2 sono in arrivo.")]),
 'fr': dict(name='WSET Niveau 2', title="WSET Niveau 2 (Award in Wines) : examen, programme, cépages, plan de révision et QCM",
  desc="Le guide complet du WSET Niveau 2 Award in Wines : 50 QCM en 60 minutes, 55 % pour réussir, 30 cépages et plus de 70 régions, méthode de révision, questions d'exemple et FAQ.",
  kw='WSET Niveau 2, WSET 2, examen WSET niveau 2, QCM WSET niveau 2, questions WSET 2, examen blanc WSET 2, cépages WSET 2, WSET Level 2 français',
  h1='WSET Niveau 2 Award in Wines : le guide complet', lead="La qualification vins la plus suivie au monde. Le Niveau 2 vous fait découvrir les cépages et les régions des vins que vous voyez en rayon et sur les cartes, la lecture des étiquettes et les accords mets-vins. L'examen compte 50 QCM : très accessible avec un plan structuré.",
  glance=dict(q='50 questions à choix multiples', dur='60 minutes', pass_='55 % (28 bonnes réponses sur 50)', hours='Environ 28 heures : 16 de formation guidée + 11 de travail personnel + l’examen', pre='Aucun — le Niveau 1 n’est pas obligatoire'),
  covers=['Les huit cépages principaux et 22 cépages d’importance régionale', 'Des vins de plus de 70 indications géographiques dans le monde',
          'L’influence de l’environnement et de la vinification (bois, fermentation malolactique, sucre résiduel) sur le style', 'Les vins effervescents et leurs méthodes, et les vins mutés comme le Porto et le Xérès',
          'Lire les étiquettes : catégories de qualité et mentions des principaux pays', 'Conservation, service et accords mets-vins', 'Décrire les vins avec la méthode SAT du Niveau 2'],
  how=[('Construisez une grille des 8 cépages principaux', 'Pour chacun : climat, régions clés, arômes typiques et évolution en zone fraîche ou chaude. Beaucoup de questions suivent cette logique.'),
       ('Associez chaque région à son cépage', 'Apprenez les régions par paires : Sancerre — Sauvignon Blanc, Barossa — Shiraz, Rioja — Tempranillo, Chianti — Sangiovese. Ajoutez ensuite les cépages régionaux.'),
       ('Apprenez les mentions d’étiquette', 'Les questions portent souvent sur Riserva, Crianza, Kabinett, Brut ou AOC/AOP. Faites-en des flashcards.'),
       ('Faites des examens blancs complets', 'Entraînez-vous avec 50 questions en 60 minutes et revoyez chaque erreur : il faut 55 %, mais viser 70 % vous donne de la marge.')],
  traps=['Confondre les régions d’un même pays (rive gauche et rive droite à Bordeaux, Rhône nord et sud)', 'Oublier l’effet du climat sur un même cépage', 'Confondre les méthodes des effervescents (traditionnelle et en cuve close)', 'Sous-estimer les vins mutés et les mentions d’étiquette'],
  sample=[('Quelle méthode est utilisée pour le Champagne ?', ['La méthode traditionnelle, seconde fermentation en bouteille', 'La cuve close', 'La gazéification', 'La méthode ancestrale'], 'Le Champagne est élaboré selon la méthode traditionnelle, avec seconde fermentation en bouteille.'),
          ('Quel cépage donne le Barolo ?', ['Nebbiolo', 'Sangiovese', 'Barbera', 'Montepulciano'], 'Le Barolo est élaboré à 100 % avec du Nebbiolo.'),
          ('Quel est le cépage blanc emblématique de Marlborough, en Nouvelle-Zélande ?', ['Sauvignon Blanc', 'Chardonnay', 'Riesling', 'Chenin Blanc'], 'Marlborough est célèbre pour ses Sauvignon Blanc très aromatiques.')],
  faq=[("L'examen WSET Niveau 2 est-il difficile ?", 'Il demande un vrai travail mais reste très accessible : 50 QCM en une heure avec 55 % pour réussir. La plupart des candidats qui suivent la formation et s’entraînent réussissent.'),
       ('Combien de temps réviser pour le WSET Niveau 2 ?', 'Le WSET indique environ 28 heures au total, dont 16 de formation guidée. En pratique, 3 à 5 semaines de révision régulière fonctionnent bien.'),
       ('Faut-il le Niveau 1 avant le Niveau 2 ?', 'Non. On peut commencer directement au Niveau 2, comme beaucoup de candidats.'),
       ('Y a-t-il une dégustation notée au Niveau 2 ?', 'Non. On déguste pendant la formation, mais l’examen ne comporte que des QCM. La dégustation à l’aveugle est évaluée à partir du Niveau 3.'),
       ('Et après le Niveau 2 ?', 'Le Niveau 3 va beaucoup plus loin, avec des réponses rédigées et une dégustation à l’aveugle de deux vins. The Wine Goat couvre déjà entièrement le Niveau 3.'),
       ('The Wine Goat proposera-t-il le Niveau 2 ?', 'Oui. QCM, examens blancs et plan de révision personnel pour le Niveau 2 arrivent bientôt.')]),
 'es': dict(name='WSET Nivel 2', title='WSET Nivel 2 (Award in Wines): examen, temario, uvas, plan de estudio y preguntas de práctica',
  desc='La guía completa del WSET Nivel 2 Award in Wines: 50 preguntas tipo test en 60 minutos, 55 % para aprobar, 30 variedades y más de 70 regiones, cómo estudiar, preguntas de ejemplo y FAQ.',
  kw='WSET Nivel 2, WSET 2, examen WSET nivel 2, preguntas WSET nivel 2, test WSET 2, simulacro WSET 2, uvas WSET 2, WSET Level 2 español',
  h1='WSET Nivel 2 Award in Wines: la guía completa', lead='La certificación de vinos más popular del mundo. El Nivel 2 te lleva por las uvas y regiones de los vinos que ves en tiendas y cartas, cómo leer una etiqueta y cómo maridar vino y comida. El examen son 50 preguntas tipo test: muy asequible con un plan estructurado.',
  glance=dict(q='50 preguntas tipo test', dur='60 minutos', pass_='55 % (28 respuestas correctas de 50)', hours='Unas 28 horas: 16 de formación guiada + 11 de estudio personal + el examen', pre='Ninguno — el Nivel 1 no es obligatorio'),
  covers=['Las ocho variedades principales y 22 de importancia regional', 'Vinos de más de 70 indicaciones geográficas del mundo',
          'Cómo el entorno y la elaboración (madera, fermentación maloláctica, azúcar residual) definen el estilo', 'Espumosos y sus métodos, y vinos generosos como Oporto y Jerez',
          'Leer etiquetas: categorías de calidad y términos de los principales países', 'Conservación, servicio y maridaje', 'Describir vinos con el método SAT del Nivel 2'],
  how=[('Haz una tabla de las 8 uvas principales', 'Para cada una: clima, regiones clave, aromas típicos y cómo cambia en zona fresca o cálida. Muchas preguntas siguen esta lógica.'),
       ('Asocia cada región con su uva', 'Aprende las regiones por parejas: Sancerre — Sauvignon Blanc, Barossa — Shiraz, Rioja — Tempranillo, Chianti — Sangiovese. Luego añade las uvas regionales.'),
       ('Aprende los términos de etiqueta', 'Las preguntas suelen tratar Riserva, Crianza, Kabinett, Brut o DOP/AOC. Conviértelos en flashcards.'),
       ('Haz simulacros completos', 'Practica con 50 preguntas en 60 minutos y repasa cada error: se aprueba con 55 %, pero apuntar al 70 % te da margen.')],
  traps=['Confundir regiones del mismo país (orilla izquierda y derecha de Burdeos, Ródano norte y sur)', 'Olvidar el efecto del clima en una misma uva', 'Confundir los métodos de espumosos (tradicional y en tanque)', 'Subestimar los vinos generosos y los términos de etiqueta'],
  sample=[('¿Con qué método se elabora el Champagne?', ['Método tradicional, segunda fermentación en botella', 'Método en tanque (Charmat)', 'Gasificación', 'Método ancestral'], 'El Champagne se elabora con el método tradicional, con la segunda fermentación en botella.'),
          ('¿Con qué uva se elabora el Barolo?', ['Nebbiolo', 'Sangiovese', 'Barbera', 'Montepulciano'], 'El Barolo se elabora al 100 % con Nebbiolo.'),
          ('¿Cuál es la uva blanca emblemática de Marlborough, en Nueva Zelanda?', ['Sauvignon Blanc', 'Chardonnay', 'Riesling', 'Chenin Blanc'], 'Marlborough es famosa por su Sauvignon Blanc muy aromático.')],
  faq=[('¿Es difícil el examen WSET Nivel 2?', 'Requiere estudio, pero es muy asequible: 50 preguntas tipo test en una hora con un 55 % para aprobar. La mayoría de quienes siguen el curso y practican aprueban.'),
       ('¿Cuánto hay que estudiar para el WSET Nivel 2?', 'WSET indica unas 28 horas en total, 16 de ellas de formación guiada. En la práctica, 3–5 semanas de repaso regular funcionan bien.'),
       ('¿Necesito el Nivel 1 antes del Nivel 2?', 'No. Puedes empezar directamente por el Nivel 2, como hace mucha gente.'),
       ('¿Hay examen de cata en el Nivel 2?', 'No. Se cata durante el curso, pero el examen es solo tipo test. La cata a ciegas se evalúa a partir del Nivel 3.'),
       ('¿Qué viene después del Nivel 2?', 'El Nivel 3 va mucho más a fondo, con respuestas escritas y cata a ciegas de dos vinos. The Wine Goat ya cubre el Nivel 3 por completo.'),
       ('¿Tendrá The Wine Goat el Nivel 2?', 'Sí. Preguntas, simulacros y plan de estudio personal para el Nivel 2 llegan muy pronto.')]),
}


def build(S):
    """S = the seo_pages module (head, topbar, crumbs, faq_html, faq_ld, foot, write, ALL_URLS, absu)"""
    for lv in ('l1', 'l2'):
        alts = [(c, URL[lv][c]) for c in ('en', 'it', 'fr', 'es')]
        for c in ('en', 'it', 'fr', 'es'):
            T = P[lv][c]; U = UI[c]; url = URL[lv][c]; nm = T['name']
            cr, cr_ld = S.crumbs(c, [(U['crumbs'], HOME[c]), (nm, None)])
            G = T['glance']
            glance = ('<dl class="lvgl">' + ''.join(f'<div><dt>{e(U[k])}</dt><dd>{e(G[k])}</dd></div>' for k in ('q', 'dur', 'pass_', 'hours', 'pre')) + '</dl>')
            covers = '<ul class="lvlist">' + ''.join(f'<li>{e(x)}</li>' for x in T['covers']) + '</ul>'
            grapes = '<ul class="lvgr">' + ''.join(f'<li>{e(g)}</li>' for g in GR8) + '</ul>'
            how = '<ol class="lvhow">' + ''.join(f'<li><h3>{e(a)}</h3><p>{e(b)}</p></li>' for a, b in T['how']) + '</ol>'
            traps = '<ul class="lvtraps">' + ''.join(f'<li>{e(x)}</li>' for x in T['traps']) + '</ul>'
            sq = ''
            for n, (q, opts, why) in enumerate(T['sample']):
                order = [1, 0, 3, 2] if n % 2 else [2, 3, 0, 1]
                lis = ''.join(f'<li><button type="button" class="sq-o" data-ok="{1 if k == 0 else 0}">{e(opts[k])}</button></li>' for k in order)
                sq += (f'<article class="sq"><h3><span class="sqn">{n + 1}</span> {e(q)}</h3><ol class="sq-os" type="A">{lis}</ol>'
                       f'<details class="sq-a"><summary>{e(U["show"])}</summary><p><strong>{e(opts[0])}</strong> — {e(why)}</p></details></article>')
            H = CMPH[c]; rows = CMP[c]
            cmpt = ('<div class="lvcmpw"><table class="lvcmp"><thead><tr><th></th>' + ''.join(f'<th scope="col"{" class=cur" if i == int(lv[1]) - 1 else ""}>{e(U["lvl"])} {i + 1}</th>' for i in range(3)) + '</tr></thead><tbody>'
                    + ''.join(f'<tr><th scope="row">{e(H[j])}</th>' + ''.join(f'<td{" class=cur" if i == int(lv[1]) - 1 else ""}>{e(rows[i][j])}</td>' for i in range(3)) + '</tr>' for j in range(6)) + '</tbody></table></div>')
            other = URL['l2' if lv == 'l1' else 'l1'][c]; oname = P['l2' if lv == 'l1' else 'l1'][c]['name']
            soon = (f'<section class="lvsoon" id="soon"><img src="/img/goats/ig-n33.webp" alt="" width="216" height="300" loading="lazy"><div><p class="lvk">{e(U["soon_k"])}</p><h2>{e(U["soon_h"].replace("{L}", nm))}</h2><p>{e(U["soon_p"].replace("{L}", nm))}</p>'
                    f'<div class="ctas"><a class="btn btn-gold" href="/app/#go=start">{e(U["soon_b"])}</a><a class="btn btn-light" href="{L3[c]}">{e(U["soon_b2"])}</a></div></div></section>')
            ld = {"@context": "https://schema.org", "@graph": [
                {"@type": "Article", "headline": T['h1'], "description": T['desc'], "inLanguage": c, "url": S.absu(url), "dateModified": S.TODAY,
                 "author": {"@type": "Organization", "name": "The Wine Goat"}, "publisher": {"@type": "Organization", "name": "The Wine Goat", "url": "https://thewinegoat.com/"},
                 "about": {"@type": "EducationalOccupationalCredential", "name": f"WSET Level {lv[1]} Award in Wines", "credentialCategory": "certificate"}},
                S.faq_ld(T['faq']), cr_ld]}
            body = (f'<article class="wrap seo lvpage">{cr}<p class="lvk lvtag">{e(U["soon_k"])}</p><h1>{e(T["h1"])}</h1><p class="lead">{e(T["lead"])}</p>'
                    f'<div class="ctas"><a class="btn btn-primary" href="#soon">{e(U["soon_b"])}</a><a class="btn lvghost" href="{L3[c]}">{e(U["soon_b2"])}</a></div>'
                    f'<section class="seosec"><h2>{e(U["glance"])}</h2>{glance}</section>'
                    f'<section class="seosec"><h2>{e(U["covers"])}</h2>{covers}</section>'
                    f'<section class="seosec"><h2>{e(U["grapes"])}</h2>{grapes}</section>'
                    f'<section class="seosec"><h2>{e(U["how"])}</h2>{how}</section>'
                    f'<section class="seosec"><h2>{e(U["traps"])}</h2>{traps}</section>'
                    f'<section class="seosec"><h2>{e(U["sample"])}</h2><div class="sqs">{sq}</div></section>'
                    f'<section class="seosec"><h2>{e(U["cmp"])}</h2>{cmpt}<p class="lvmore"><a href="{other}">{e(oname)} →</a> · <a href="{L3[c]}">WSET {e(U["lvl"])} 3 →</a></p></section>'
                    f'{soon}{S.faq_html(c, T["faq"])}</article>')
            S.write(url, S.head(c, T['title'], T['desc'], T['kw'], url, alts, ld) + S.topbar(c, alts) + body + S.foot(c))
            S.ALL_URLS.append((url, alts))
    return len(S.ALL_URLS)


CSS = r"""
.lvtag{display:inline-block;margin:6px 0 0;padding:5px 12px;border-radius:999px;background:#fbf1dc;color:#8a6420;font-weight:800;font-size:13px;letter-spacing:.04em;text-transform:uppercase}
.lvk{font-weight:800;letter-spacing:.06em;text-transform:uppercase;font-size:12.5px;color:#b8892e;margin:0}
.lvgl{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin:0}
.lvgl div{padding:14px 16px;border-radius:14px;background:#fff;box-shadow:inset 0 0 0 1px #eadfd3}
.lvgl dt{font-size:12.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:#8a7a80}.lvgl dd{margin:6px 0 0;font-weight:700;color:#3e0f22}
.lvlist li,.lvtraps li{margin:0 0 8px}
.lvgr{display:flex;flex-wrap:wrap;gap:8px;list-style:none;padding:0}.lvgr li{padding:7px 12px;border-radius:999px;background:#f6ecee;color:#5c1630;font-weight:700}
.lvhow{list-style:none;padding:0;counter-reset:s;display:grid;gap:12px}
.lvhow li{position:relative;padding:14px 16px 14px 58px;border-radius:14px;background:#fff;box-shadow:inset 0 0 0 1px #eadfd3;counter-increment:s}
.lvhow li:before{content:counter(s);position:absolute;left:16px;top:14px;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:#8c1d40;color:#fff;font-weight:800}
.lvhow h3{margin:0 0 4px;font-size:17px}.lvhow p{margin:0}
.lvtraps li::marker{content:"⚠  "}
.lvcmpw{overflow-x:auto}.lvcmp{width:100%;border-collapse:separate;border-spacing:0;min-width:520px;background:#fff;border-radius:14px;box-shadow:inset 0 0 0 1px #eadfd3}
.lvcmp th,.lvcmp td{padding:11px 12px;text-align:left;border-bottom:1px solid #f1e7df;font-size:14.5px}.lvcmp thead th{font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:#8a7a80}
.lvcmp .cur{background:#fbf1f3;color:#5c1630;font-weight:700}
.lvmore{margin-top:12px;font-weight:700}
.lvghost{background:#fff;color:#8c1d40;box-shadow:inset 0 0 0 1.5px #e8cdd5}
.lvsoon{display:flex;gap:20px;align-items:center;margin:34px 0;padding:24px;border-radius:20px;background:linear-gradient(135deg,#3e0f22,#6e1a3c);color:#fff}
.lvsoon img{width:110px;height:auto;flex:none}.lvsoon h2{color:#fff;margin:6px 0 8px}.lvsoon p{color:#f2dfe5}.lvsoon .lvk{color:#e8c46a}
@media (max-width:640px){.lvsoon{flex-direction:column;text-align:center}.lvsoon .ctas{justify-content:center}}
"""
