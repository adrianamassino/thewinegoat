# -*- coding: utf-8 -*-
"""B2B page for wine schools: partner discount, class licences, white label (en/it/fr/es).
Usage: python3 b2b_pages.py <out dir>   (imports seo_pages helpers)"""
import sys, os, html
e = lambda s: html.escape(str(s), quote=True)
OUT = os.path.abspath(sys.argv[1])
sys.argv = [sys.argv[0], OUT]
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import seo_pages as S

URL = {'en': '/schools/', 'it': '/it/scuole/', 'fr': '/fr/ecoles/', 'es': '/es/escuelas/'}
MAIL = 'contact@thewinegoat.com'

T = {
 'en': dict(title='The Wine Goat for wine schools | Exam-prep app for WSET course providers – partner discount, class licences, white label',
  desc='Give your students the app that trains them like the real WSET exam: practice questions, marked written answers, mock exams and a study plan. Partner discount, class licences or a white-label app with your brand.',
  kw='wine school app, WSET course provider tool, WSET exam prep for schools, white label wine app, wine education platform, class licences wine course',
  k='For wine schools', h1='Help more of your students pass, with less marking', lead='The Wine Goat trains students like the real exam — multiple choice, short written answers marked point by point, mock exams and a daily plan built around their exam date. Your teaching stays the same; their revision gets structured.',
  cta='Book a 20-minute demo', cta2='See the offers',
  why_h='What changes for your school', why=[('pen', 'Written answers marked for them', 'Students practise the hardest part of the theory paper every day and see which key points they missed — without you marking hundreds of scripts.'),
    ('plan', 'Revision that follows your course', 'A plan built around the exam date and the course days, so students revise what you have just taught and come back to their weak points.'),
    ('timer', 'Mock exams in exam conditions', '50 multiple-choice questions and written questions against the clock, with a result by topic.'),
    ('globe', 'In your students’ language', 'Italian, French, English and Spanish today, with more languages coming — ideal for international classes.')],
  off_h='Three ways to work together', off_p='Start small, grow when it works. Prices are indicative and excl. VAT — we adapt them to your volumes.',
  offers=[('Partner discount', 'Free for the school', 'Your students get 20% off with your school code. You earn 15% on every purchase.', ['Your personal code and link', 'Ready-to-share email and slide for your classes', 'Monthly report of activations', 'No commitment'], 'Become a partner'),
          ('Class licences', 'from 29 € / student', 'Include full access in your course price. One account per student for 12 months, activated with a class code.', ['10–49 students: 35 € each', '50–199 students: 29 € each', '200+ students: on quote', 'Class progress overview on request'], 'Get a quote'),
          ('White label', 'from 2,900 € / year', 'Your app, your brand: logo, colours, domain and your own questions next to ours.', ['Your logo, colours and domain', 'Your content and course calendar', 'Priority support and onboarding', 'Set-up fee on quote'], 'Talk to us')],
  hw_h='How it works', hw=[('Demo', 'We show you the app with your course calendar.'), ('Choose the offer', 'Partner, licences or white label — or a pilot with one class.'), ('Launch', 'You share the code or the link; students start the same day.'), ('Follow up', 'Activations and results each month, adjustments for the next session.')],
  faq=[('Is The Wine Goat affiliated with WSET?', 'No. The Wine Goat is independent and not endorsed by WSET®. Course providers should check that recommending a third-party revision tool fits their own agreement.'),
       ('Does it replace our course?', 'No. It is a revision and practice tool between lessons and before the exam. Your teaching, tastings and materials stay at the centre.'),
       ('Can we try it with one class?', 'Yes. We offer a free pilot for one class so you can see engagement and results before deciding.'),
       ('Which levels are covered?', 'Level 3 in full today. Levels 1 and 2 are coming soon and will be included in licences at no extra cost when they launch.'),
       ('How are students’ data handled?', 'Accounts are personal and data are stored in the EU-compliant infrastructure we use; we only share aggregated results with the school, with the students’ consent.')],
  mail_s='The Wine Goat for our school', fin_h='Let’s talk about your next course', fin_p='Tell us about your school, your levels and your calendar: we reply within 48 hours.'),
 'it': dict(title='The Wine Goat per le scuole di vino | App di preparazione per corsi WSET – sconto partner, licenze di classe, marca bianca',
  desc="Dai ai tuoi studenti l'app che li allena come all'esame WSET: quiz, domande aperte corrette, simulazioni e piano di studio. Sconto partner, licenze di classe o un'app in marca bianca con il tuo marchio.",
  kw='app scuola vino, strumento corsi WSET, preparazione esame WSET scuole, app vino marca bianca, piattaforma formazione vino, licenze corso vino',
  k='Per le scuole di vino', h1='Più studenti promossi, meno correzioni per te', lead="The Wine Goat allena gli studenti come all'esame vero: scelta multipla, domande aperte corrette punto per punto, simulazioni e un piano giornaliero costruito sulla data d'esame. Le tue lezioni restano le stesse; il loro ripasso diventa strutturato.",
  cta='Prenota una demo di 20 minuti', cta2='Vedi le offerte',
  why_h='Cosa cambia per la tua scuola', why=[('pen', 'Domande aperte corrette al posto tuo', "Gli studenti si allenano ogni giorno sulla parte più difficile della prova teorica e vedono quali punti chiave mancano, senza che tu debba correggere centinaia di compiti."),
    ('plan', 'Un ripasso che segue il tuo corso', "Un piano costruito sulla data d'esame e sui giorni di lezione: gli studenti ripassano ciò che hai appena spiegato e tornano sui punti deboli."),
    ('timer', "Simulazioni in condizioni d'esame", '50 domande a scelta multipla e domande aperte a tempo, con risultato per argomento.'),
    ('globe', 'Nella lingua dei tuoi studenti', 'Italiano, francese, inglese e spagnolo oggi, altre lingue in arrivo: ideale per classi internazionali.')],
  off_h='Tre modi per collaborare', off_p="Si parte in piccolo e si cresce se funziona. Prezzi indicativi IVA esclusa, adattati ai tuoi volumi.",
  offers=[('Sconto partner', 'Gratis per la scuola', 'I tuoi studenti hanno il 20% di sconto con il codice della scuola. Tu ricevi il 15% su ogni acquisto.', ['Codice e link personali', 'Email e slide pronte per le tue classi', 'Report mensile delle attivazioni', 'Nessun vincolo'], 'Diventa partner'),
          ('Licenze di classe', 'da 29 € / studente', "Includi l'accesso completo nel prezzo del corso. Un account per studente per 12 mesi, attivato con un codice di classe.", ['10–49 studenti: 35 € ciascuno', '50–199 studenti: 29 € ciascuno', '200+ studenti: su preventivo', 'Panoramica dei progressi della classe su richiesta'], 'Chiedi un preventivo'),
          ('Marca bianca', 'da 2.900 € / anno', 'La tua app, il tuo marchio: logo, colori, dominio e le tue domande accanto alle nostre.', ['Logo, colori e dominio della scuola', 'I tuoi contenuti e il calendario dei corsi', 'Supporto prioritario e avvio guidato', 'Costo di attivazione su preventivo'], 'Parliamone')],
  hw_h='Come funziona', hw=[('Demo', "Ti mostriamo l'app con il calendario del tuo corso."), ("Scegli l'offerta", 'Partner, licenze o marca bianca, oppure un pilota con una classe.'), ('Avvio', 'Condividi il codice o il link: gli studenti iniziano lo stesso giorno.'), ('Monitoraggio', 'Attivazioni e risultati ogni mese, aggiustamenti per la sessione successiva.')],
  faq=[('The Wine Goat è affiliato al WSET?', 'No. The Wine Goat è indipendente e non è approvato dal WSET®. Le scuole autorizzate dovrebbero verificare che consigliare uno strumento di ripasso esterno sia compatibile con il proprio accordo.'),
       ('Sostituisce il nostro corso?', "No. È uno strumento di ripasso e pratica tra una lezione e l'altra e prima dell'esame. Le tue lezioni, degustazioni e materiali restano al centro."),
       ('Possiamo provarlo con una classe?', 'Sì. Offriamo un pilota gratuito per una classe, così vedi coinvolgimento e risultati prima di decidere.'),
       ('Quali livelli sono coperti?', 'Oggi il Livello 3 completo. I Livelli 1 e 2 arrivano presto e saranno inclusi nelle licenze senza costi aggiuntivi.'),
       ('Come vengono gestiti i dati degli studenti?', 'Gli account sono personali e i dati sono conservati su infrastrutture conformi al GDPR; condividiamo con la scuola solo risultati aggregati, con il consenso degli studenti.')],
  mail_s='The Wine Goat per la nostra scuola', fin_h='Parliamo del tuo prossimo corso', fin_p='Raccontaci la tua scuola, i livelli e il calendario: rispondiamo entro 48 ore.'),
 'fr': dict(title="The Wine Goat pour les écoles du vin | Appli de préparation pour centres WSET – remise partenaire, licences de classe, marque blanche",
  desc="Offrez à vos élèves l'appli qui les entraîne comme à l'examen WSET : QCM, questions ouvertes corrigées, examens blancs et plan de révision. Remise partenaire, licences de classe ou appli en marque blanche.",
  kw="appli école du vin, outil centre WSET, préparation examen WSET écoles, appli vin marque blanche, plateforme formation vin, licences formation vin",
  k='Pour les écoles du vin', h1='Plus d’élèves reçus, moins de copies à corriger', lead="The Wine Goat entraîne les élèves comme à l'examen : QCM, réponses rédigées corrigées point par point, examens blancs et un plan quotidien construit autour de la date d'examen. Vos cours restent les mêmes ; leurs révisions deviennent structurées.",
  cta='Réserver une démo de 20 minutes', cta2='Voir les offres',
  why_h='Ce qui change pour votre école', why=[('pen', 'Des réponses rédigées corrigées pour vous', "Les élèves s'entraînent chaque jour sur la partie la plus difficile de l'épreuve théorique et voient les points clés manquants, sans que vous corrigiez des centaines de copies."),
    ('plan', 'Des révisions qui suivent votre cours', "Un plan construit autour de la date d'examen et des jours de cours : les élèves révisent ce que vous venez d'enseigner et reviennent sur leurs points faibles."),
    ('timer', "Des examens blancs en conditions réelles", '50 QCM et questions rédigées chronométrés, avec un résultat par thème.'),
    ('globe', 'Dans la langue de vos élèves', 'Français, italien, anglais et espagnol aujourd’hui, d’autres langues à venir : idéal pour les classes internationales.')],
  off_h='Trois façons de travailler ensemble', off_p='On commence petit, on grandit si ça marche. Prix indicatifs HT, adaptés à vos volumes.',
  offers=[('Remise partenaire', "Gratuit pour l'école", "Vos élèves ont 20 % de remise avec le code de l'école. Vous touchez 15 % sur chaque achat.", ['Code et lien personnels', 'E-mail et slide prêts pour vos classes', 'Rapport mensuel des activations', 'Sans engagement'], 'Devenir partenaire'),
          ('Licences de classe', 'dès 29 € / élève', "Incluez l'accès complet dans le prix de votre formation. Un compte par élève pendant 12 mois, activé avec un code de classe.", ['10 à 49 élèves : 35 € chacun', '50 à 199 élèves : 29 € chacun', '200+ élèves : sur devis', 'Vue de la progression de la classe sur demande'], 'Demander un devis'),
          ('Marque blanche', 'dès 2 900 € / an', 'Votre appli, votre marque : logo, couleurs, domaine et vos propres questions à côté des nôtres.', ["Logo, couleurs et domaine de l'école", 'Vos contenus et votre calendrier', 'Support prioritaire et accompagnement', 'Frais de mise en place sur devis'], 'En parler')],
  hw_h='Comment ça marche', hw=[('Démo', "Nous vous montrons l'appli avec le calendrier de votre formation."), ("Choix de l'offre", 'Partenaire, licences ou marque blanche, ou un pilote avec une classe.'), ('Lancement', 'Vous partagez le code ou le lien : les élèves commencent le jour même.'), ('Suivi', 'Activations et résultats chaque mois, ajustements pour la session suivante.')],
  faq=[('The Wine Goat est-il affilié au WSET ?', "Non. The Wine Goat est indépendant et n'est pas approuvé par le WSET®. Les centres agréés doivent vérifier que recommander un outil de révision externe est compatible avec leur accord."),
       ('Cela remplace-t-il notre formation ?', "Non. C'est un outil de révision et d'entraînement entre les cours et avant l'examen. Vos cours, dégustations et supports restent au centre."),
       ('Peut-on tester avec une classe ?', 'Oui. Nous proposons un pilote gratuit pour une classe afin de voir l’engagement et les résultats avant de décider.'),
       ('Quels niveaux sont couverts ?', 'Le Niveau 3 complet aujourd’hui. Les Niveaux 1 et 2 arrivent bientôt et seront inclus dans les licences sans surcoût.'),
       ('Comment sont gérées les données des élèves ?', 'Les comptes sont personnels et les données sont hébergées sur une infrastructure conforme au RGPD ; nous ne partageons avec l’école que des résultats agrégés, avec le consentement des élèves.')],
  mail_s='The Wine Goat pour notre école', fin_h='Parlons de votre prochaine formation', fin_p='Présentez-nous votre école, vos niveaux et votre calendrier : nous répondons sous 48 heures.'),
 'es': dict(title='The Wine Goat para escuelas de vino | App de preparación para centros WSET – descuento partner, licencias de clase, marca blanca',
  desc='Da a tus alumnos la app que les entrena como en el examen WSET: preguntas tipo test, respuestas escritas corregidas, simulacros y plan de estudio. Descuento partner, licencias de clase o una app en marca blanca.',
  kw='app escuela de vino, herramienta centros WSET, preparación examen WSET escuelas, app vino marca blanca, plataforma formación vino, licencias curso vino',
  k='Para escuelas de vino', h1='Más alumnos aprobados, menos correcciones para ti', lead='The Wine Goat entrena a los alumnos como en el examen real: tipo test, respuestas escritas corregidas punto por punto, simulacros y un plan diario según la fecha del examen. Tus clases siguen igual; su repaso se vuelve estructurado.',
  cta='Reserva una demo de 20 minutos', cta2='Ver las ofertas',
  why_h='Qué cambia para tu escuela', why=[('pen', 'Respuestas escritas corregidas por ti', 'Los alumnos practican cada día la parte más difícil de la prueba teórica y ven qué puntos clave les faltan, sin que tengas que corregir cientos de exámenes.'),
    ('plan', 'Un repaso que sigue tu curso', 'Un plan según la fecha del examen y los días de clase: los alumnos repasan lo que acabas de explicar y vuelven a sus puntos débiles.'),
    ('timer', 'Simulacros en condiciones de examen', '50 preguntas tipo test y preguntas escritas cronometradas, con resultado por tema.'),
    ('globe', 'En el idioma de tus alumnos', 'Español, italiano, francés e inglés hoy, más idiomas en camino: ideal para clases internacionales.')],
  off_h='Tres formas de colaborar', off_p='Empieza en pequeño y crece si funciona. Precios orientativos sin IVA, adaptados a tus volúmenes.',
  offers=[('Descuento partner', 'Gratis para la escuela', 'Tus alumnos tienen un 20 % de descuento con el código de la escuela. Tú recibes el 15 % de cada compra.', ['Código y enlace personales', 'Email y diapositiva listos para tus clases', 'Informe mensual de activaciones', 'Sin compromiso'], 'Hazte partner'),
          ('Licencias de clase', 'desde 29 € / alumno', 'Incluye el acceso completo en el precio del curso. Una cuenta por alumno durante 12 meses, activada con un código de clase.', ['10–49 alumnos: 35 € cada uno', '50–199 alumnos: 29 € cada uno', '200+ alumnos: bajo presupuesto', 'Vista del progreso de la clase bajo petición'], 'Pide presupuesto'),
          ('Marca blanca', 'desde 2.900 € / año', 'Tu app, tu marca: logo, colores, dominio y tus propias preguntas junto a las nuestras.', ['Logo, colores y dominio de la escuela', 'Tus contenidos y tu calendario', 'Soporte prioritario y puesta en marcha', 'Coste de activación bajo presupuesto'], 'Hablemos')],
  hw_h='Cómo funciona', hw=[('Demo', 'Te mostramos la app con el calendario de tu curso.'), ('Elige la oferta', 'Partner, licencias o marca blanca, o un piloto con una clase.'), ('Lanzamiento', 'Compartes el código o el enlace: los alumnos empiezan el mismo día.'), ('Seguimiento', 'Activaciones y resultados cada mes, ajustes para la siguiente convocatoria.')],
  faq=[('¿The Wine Goat está afiliado al WSET?', 'No. The Wine Goat es independiente y no está respaldado por el WSET®. Los centros autorizados deben comprobar que recomendar una herramienta de repaso externa es compatible con su acuerdo.'),
       ('¿Sustituye nuestro curso?', 'No. Es una herramienta de repaso y práctica entre clases y antes del examen. Tus clases, catas y materiales siguen en el centro.'),
       ('¿Podemos probarlo con una clase?', 'Sí. Ofrecemos un piloto gratuito para una clase para que veas la participación y los resultados antes de decidir.'),
       ('¿Qué niveles cubre?', 'Hoy el Nivel 3 completo. Los Niveles 1 y 2 llegan pronto y se incluirán en las licencias sin coste extra.'),
       ('¿Cómo se gestionan los datos de los alumnos?', 'Las cuentas son personales y los datos se guardan en infraestructura conforme al RGPD; solo compartimos con la escuela resultados agregados, con el consentimiento de los alumnos.')],
  mail_s='The Wine Goat para nuestra escuela', fin_h='Hablemos de tu próximo curso', fin_p='Cuéntanos sobre tu escuela, tus niveles y tu calendario: respondemos en 48 horas.'),
}

CSS = r"""
.b2b .bhero{display:grid;grid-template-columns:1.3fr .7fr;gap:28px;align-items:center;margin:10px 0 30px}
.b2b .bhero img{width:100%;max-width:260px;justify-self:center}
.bk{font-weight:800;letter-spacing:.06em;text-transform:uppercase;font-size:12.5px;color:#b8892e;margin:0}
.bwhy{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.bwhy article{padding:18px;border-radius:16px;background:#fff;box-shadow:inset 0 0 0 1px #eadfd3}
.bwhy h3{display:flex;gap:10px;align-items:center;margin:0 0 6px;font-size:18px}.bwhy p{margin:0;color:#6b5a5f}
.bic{display:inline-grid;place-items:center;width:36px;height:36px;border-radius:10px;background:#f6ecee;color:#8c1d40;flex:none}.bic svg{width:20px;height:20px}
.boff{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:18px}
.boff article{display:flex;flex-direction:column;padding:22px;border-radius:18px;background:#fff;box-shadow:inset 0 0 0 1px #eadfd3,0 16px 34px -30px rgba(62,15,34,.5)}
.boff article:nth-child(2){box-shadow:inset 0 0 0 1.5px #b8892e,0 22px 40px -28px rgba(62,15,34,.55)}
.boff h3{margin:0;font-size:21px}.boff .bp{margin:8px 0 10px;font:800 22px/1.1 Fraunces,Georgia,serif;color:#8c1d40}
.boff p{margin:0 0 12px;color:#6b5a5f}.boff ul{margin:0 0 16px;padding-left:18px;flex:1}.boff li{margin:0 0 6px}
.bsteps{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;list-style:none;padding:0;counter-reset:b}
.bsteps li{padding:16px;border-radius:14px;background:#fff;box-shadow:inset 0 0 0 1px #eadfd3;counter-increment:b}
.bsteps li:before{content:counter(b);display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:#8c1d40;color:#fff;font-weight:800;margin-bottom:8px}
.bsteps b{display:block;margin-bottom:4px}
.bfin{margin:34px 0;padding:26px;border-radius:20px;background:linear-gradient(135deg,#3e0f22,#6e1a3c);color:#fff;text-align:center}.bfin h2{color:#fff}.bfin p{color:#f2dfe5}
@media (max-width:900px){.b2b .bhero,.bwhy,.boff,.bsteps{grid-template-columns:1fr}.b2b .bhero img{max-width:180px}}
"""

if __name__ == '__main__':
    from icons import ICON
    alts = [(c, URL[c]) for c in URL]
    for c, X in T.items():
        url = URL[c]; mail = f'mailto:{MAIL}?subject={html.escape(X["mail_s"])}'
        cr, cr_ld = S.crumbs(c, [('The Wine Goat', S.home_url(c)), (X['k'], None)])
        why = ''.join(f'<article><h3><span class="bic">{ICON[i]}</span>{e(a)}</h3><p>{e(b)}</p></article>' for i, a, b in X['why'])
        offs = ''.join(f'<article><h3>{e(a)}</h3><p class="bp">{e(p)}</p><p>{e(d)}</p><ul>{"".join(f"<li>{e(x)}</li>" for x in L)}</ul><a class="btn btn-primary" href="{mail}">{e(b)}</a></article>' for a, p, d, L, b in X['offers'])
        steps = ''.join(f'<li><b>{e(a)}</b>{e(b)}</li>' for a, b in X['hw'])
        ld = {"@context": "https://schema.org", "@graph": [
            {"@type": "Service", "name": X['h1'], "description": X['desc'], "provider": {"@type": "Organization", "name": "The Wine Goat", "url": "https://thewinegoat.com/"}, "audience": {"@type": "EducationalAudience", "educationalRole": "school"},
             "offers": [{"@type": "Offer", "name": o[0], "description": o[2]} for o in X['offers']]}, S.faq_ld(X['faq']), cr_ld]}
        body = (f'<article class="wrap seo b2b">{cr}<div class="bhero"><div><p class="bk">{e(X["k"])}</p><h1>{e(X["h1"])}</h1><p class="lead">{e(X["lead"])}</p>'
                f'<div class="ctas"><a class="btn btn-primary" href="{mail}">{e(X["cta"])}</a><a class="btn btn-light" href="#offers" style="background:#fff;color:#8c1d40;box-shadow:inset 0 0 0 1.5px #e8cdd5">{e(X["cta2"])}</a></div></div>'
                f'<img src="/img/goats/ig-n13.webp" alt="" width="300" height="300"></div>'
                f'<section class="seosec"><h2>{e(X["why_h"])}</h2><div class="bwhy">{why}</div></section>'
                f'<section class="seosec" id="offers"><h2>{e(X["off_h"])}</h2><p>{e(X["off_p"])}</p><div class="boff">{offs}</div></section>'
                f'<section class="seosec"><h2>{e(X["hw_h"])}</h2><ol class="bsteps">{steps}</ol></section>'
                f'{S.faq_html(c, X["faq"])}'
                f'<section class="bfin"><h2>{e(X["fin_h"])}</h2><p>{e(X["fin_p"])}</p><a class="btn btn-gold" href="{mail}">{e(X["cta"])}</a></section></article>')
        S.write(url, S.head(c, X['title'], X['desc'], X['kw'], url, alts, ld) + S.topbar(c, alts) + body + S.foot(c))
    print('b2b pages', len(T))
