"""Schools pages: no prices, no discount/commission percentages (owner's rule: never talk about prices on the site).
Idempotent. Run from repo root: python3 tools/schools_noprice.py"""
import re, html
R = {
 'schools/index.html': [
  ('Start small, grow when it works. Prices are indicative and excl. VAT — we adapt them to your volumes.', 'Start small, grow when it works. We tailor every offer to your school and your volumes.'),
  ('Your students get 20% off with your school code. You earn 15% on every purchase.', 'Your students get a dedicated offer with your school code, and your school is rewarded for every activation.'),
  ('from 29 € / student', 'Tailored to your classes'), ('from 2,900 € / year', 'Your own branded app'),
  ('Include full access in your course price.', 'Include full access in your course.'),
  ('<li>10–49 students: 35 € each</li><li>50–199 students: 29 € each</li><li>200+ students: on quote</li>', '<li>From one class to the whole school</li>'),
  ('Up to 150 active students per year', 'Sized to your number of students'), ('Priority support · set-up fee and more students on quote', 'Priority support and set-up with our team')],
 'it/scuole/index.html': [
  ('Si parte in piccolo e si cresce se funziona. Prezzi indicativi IVA esclusa, adattati ai tuoi volumi.', 'Si parte in piccolo e si cresce se funziona. Ogni proposta è costruita su misura per la tua scuola e i tuoi volumi.'),
  ('I tuoi studenti hanno il 20% di sconto con il codice della scuola. Tu ricevi il 15% su ogni acquisto.', 'I tuoi studenti ricevono un’offerta dedicata con il codice della scuola, e la scuola viene premiata per ogni attivazione.'),
  ('da 29 € / studente', 'Su misura per le tue classi'), ('da 2.900 € / anno', 'La tua app, con il tuo marchio'),
  ('Includi l&#x27;accesso completo nel prezzo del corso.', 'Includi l&#x27;accesso completo nel tuo corso.'), ("Includi l'accesso completo nel prezzo del corso.", "Includi l'accesso completo nel tuo corso."),
  ('<li>10–49 studenti: 35 € ciascuno</li><li>50–199 studenti: 29 € ciascuno</li><li>200+ studenti: su preventivo</li>', '<li>Da una sola classe a tutta la scuola</li>'),
  ('Fino a 150 studenti attivi all’anno', 'Dimensionata sul numero dei tuoi studenti'), ('Supporto prioritario · attivazione e più studenti su preventivo', 'Supporto prioritario e attivazione con il nostro team')],
 'fr/ecoles/index.html': [
  ('Vos élèves ont 20 % de remise avec le code de l&#x27;école. Vous touchez 15 % sur chaque achat.', 'Vos élèves bénéficient d’une offre dédiée avec le code de l&#x27;école, et l’école est récompensée pour chaque activation.'),
  ("Vos élèves ont 20 % de remise avec le code de l'école. Vous touchez 15 % sur chaque achat.", "Vos élèves bénéficient d’une offre dédiée avec le code de l'école, et l’école est récompensée pour chaque activation."),
  ('dès 29 € / élève', 'Adapté à vos classes'), ('dès 2 900 € / an', 'Votre app, à votre marque'),
  ('Incluez l&#x27;accès complet dans le prix de votre formation.', 'Incluez l&#x27;accès complet dans votre formation.'), ("Incluez l'accès complet dans le prix de votre formation.", "Incluez l'accès complet dans votre formation."),
  ('<li>10 à 49 élèves : 35 € chacun</li><li>50 à 199 élèves : 29 € chacun</li><li>200+ élèves : sur devis</li>', '<li>D’une seule classe à toute l’école</li>'),
  ('Jusqu’à 150 élèves actifs par an', 'Dimensionnée selon votre nombre d’élèves'), ('Support prioritaire · mise en place et élèves supplémentaires sur devis', 'Support prioritaire et mise en place avec notre équipe')],
}
ES = [
  ('Tus alumnos tienen un 20 % de descuento con el código de la escuela. Tú recibes el 15 % de cada compra.', 'Tus alumnos reciben una oferta dedicada con el código de la escuela, y la escuela recibe una recompensa por cada activación.'),
  ('Tus alumnos tienen un 20 % de descuento con el código de la escuela. Vos recibís el 15 % de cada compra.', 'Tus alumnos reciben una oferta dedicada con el código de la escuela, y la escuela recibe una recompensa por cada activación.'),
  ('desde 29 € / alumno', 'A la medida de tus clases'), ('desde 2.900 € / año', 'Tu app, con tu marca'),
  ('Incluye el acceso completo en el precio del curso.', 'Incluye el acceso completo en tu curso.'),
  ('<li>10–49 alumnos: 35 € cada uno</li><li>50–199 alumnos: 29 € cada uno</li><li>200+ alumnos: bajo presupuesto</li>', '<li>De una sola clase a toda la escuela</li>'),
  ('Hasta 150 alumnos activos al año', 'Dimensionada según tu número de alumnos'), ('Soporte prioritario · activación y más alumnos bajo presupuesto', 'Soporte prioritario y activación con nuestro equipo')]
R['es/escuelas/index.html'] = ES + [('Empieza en pequeño y crece si funciona. Precios orientativos sin IVA, adaptados a tus volúmenes.', 'Empieza en pequeño y crece si funciona. Cada propuesta se adapta a tu escuela y a tus volúmenes.')]
R['es-ar/escuelas/index.html'] = ES + [('Empezá en pequeño y crece si funciona. Precios orientativos sin IVA, adaptados a tus volúmenes.', 'Empezá en pequeño y crecé si funciona. Cada propuesta se adapta a tu escuela y a tus volúmenes.')]
for p, reps in R.items():
    s = open(p, encoding='utf8').read()
    for a, b in reps:
        s = s.replace(a, b).replace(json_a, json_b) if False else s.replace(a, b)
    left = re.findall(r'[^<>"]{0,40}(?:\d ?€|€ ?\d|\d+ ?% (?:off|di sconto|de remise|de descuento))[^<>"]{0,40}', s)
    open(p, 'w', encoding='utf8').write(s)
    print(p, 'left:', left)
