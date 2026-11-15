# -*- coding: utf-8 -*-
"""Level 1 and Level 2 guide pages (en/it/fr/es): 'coming soon' -> available now in the app, with a button that opens
the app on that level; FAQ answers updated in the HTML and in the FAQPage JSON-LD. Also the schools page and the
Italian home FAQ. Run from the repo root: python3 tools/levels_live.py"""
import re, html, json
PAGES = {('en', 1): 'wset-level-1', ('it', 1): 'it/wset-livello-1', ('fr', 1): 'fr/wset-niveau-1', ('es', 1): 'es/wset-nivel-1',
         ('en', 2): 'wset-level-2', ('it', 2): 'it/wset-livello-2', ('fr', 2): 'fr/wset-niveau-2', ('es', 2): 'es/wset-nivel-2'}
TAG = {'en': 'Available now in the app', 'it': "Disponibile ora nell'app", 'fr': "Disponible dans l'appli", 'es': 'Ya disponible en la app'}
H2 = {'en': 'The Wine Goat for WSET Level {n} is here', 'it': 'The Wine Goat per il WSET Livello {n} è qui', 'fr': 'The Wine Goat pour le WSET Niveau {n} est là', 'es': 'The Wine Goat para el WSET Nivel {n} ya está aquí'}
P = {'en': 'Lessons, practice questions with explanations, flashcards, games and a {q}-question mock exam for WSET Level {n}, in the same app as the other levels.{free}',
     'it': "Lezioni, quiz con spiegazioni, flashcard, giochi e un esame simulato da {q} domande per il WSET Livello {n}, nella stessa app degli altri livelli.{free}",
     'fr': "Leçons, QCM expliqués, flashcards, jeux et un examen blanc de {q} questions pour le WSET Niveau {n}, dans la même appli que les autres niveaux.{free}",
     'es': 'Lecciones, preguntas con explicación, tarjetas, juegos y un simulacro de {q} preguntas para el WSET Nivel {n}, en la misma app que los demás niveles.{free}'}
FREE = {'en': ' Level 1 is completely free.', 'it': ' Il Livello 1 è completamente gratuito.', 'fr': ' Le Niveau 1 est entièrement gratuit.', 'es': ' El Nivel 1 es totalmente gratis.'}
BTN = {'en': 'Start Level {n}', 'it': 'Inizia il Livello {n}', 'fr': 'Commencer le Niveau {n}', 'es': 'Empieza el Nivel {n}'}
FAQA = {'en': 'Yes. Lessons, practice questions, flashcards and mock exams for Level {n} are already in the app.{free}', 'it': "Sì. Lezioni, quiz, flashcard e simulazioni d'esame per il Livello {n} sono già nell'app.{free}",
        'fr': "Oui. Leçons, QCM, flashcards et examens blancs pour le Niveau {n} sont déjà dans l'appli.{free}", 'es': 'Sí. Lecciones, preguntas, tarjetas y simulacros para el Nivel {n} ya están en la app.{free}'}
Q = {1: 30, 2: 50}
for (l, n), d in PAGES.items():
    p = d + '/index.html'; s = open(p, encoding='utf8').read(); o = s
    fr = FREE[l] if n == 1 else ''
    s = re.sub(r'<p class="lvk lvtag">[^<]*</p>', f'<p class="lvk lvtag">{html.escape(TAG[l])}</p>', s)
    s = re.sub(r'(<section class="lvsoon" id="soon">(?:<img[^>]*>)?<div>)<p class="lvk">[^<]*</p><h2>[^<]*</h2><p>[^<]*</p><div class="ctas"><a class="btn btn-gold" href="/app/#go=start">[^<]*</a>',
               lambda m: m.group(1) + f'<p class="lvk">{html.escape(TAG[l])}</p><h2>{html.escape(H2[l].format(n=n))}</h2><p>{html.escape(P[l].format(n=n, q=Q[n], free=fr))}</p><div class="ctas"><a class="btn btn-gold" href="/app/#lvl={n}">{html.escape(BTN[l].format(n=n))}</a>', s)
    new = FAQA[l].format(n=n, free=fr)
    for qq, a in re.findall(r'<details class="faqi"><summary>(.*?)</summary><p>(.*?)</p></details>', s):
        if re.search(r'coming soon|in arrivo|arrivent bientôt|muy pronto', html.unescape(a)):
            s = s.replace(f'<p>{a}</p>', f'<p>{html.escape(new)}</p>')
            old = html.unescape(a); s = s.replace(json.dumps(old, ensure_ascii=False)[1:-1], json.dumps(new, ensure_ascii=False)[1:-1])
    if s != o: open(p, 'w', encoding='utf8').write(s)
    print(p, s != o)
# schools pages and the Italian home FAQ
REP = [('schools/index.html', 'Level 3 in full today. Levels 1 and 2 are coming soon and will be included in licences at no extra cost when they launch.', 'Levels 1, 2 and 3 are all in the app today. The Diploma will follow.'),
       ('it/scuole/index.html', 'I Livelli 1 e 2 arrivano presto e saranno inclusi nelle licenze senza costi aggiuntivi', 'I Livelli 1, 2 e 3 sono già tutti nell’app; il Diploma seguirà'),
       ('fr/ecoles/index.html', 'Les Niveaux 1 et 2 arrivent bientôt et seront inclus dans les licences sans surcoût', 'Les Niveaux 1, 2 et 3 sont déjà tous dans l’appli ; le Diploma suivra'),
       ('es/escuelas/index.html', 'Los Niveles 1 y 2 llegan pronto y se incluirán en las licencias sin coste extra', 'Los Niveles 1, 2 y 3 ya están todos en la app; el Diploma llegará después'),
       ('it/index.html', 'Sì, il Livello 2 e il Livello 1 sono in arrivo con lo stesso metodo e la stessa formula a moduli.', 'Sì: il Livello 1 e il Livello 2 sono già nell’app, con lo stesso metodo. Il Livello 1 è completamente gratuito.')]
for p, a, b in REP:
    try: s = open(p, encoding='utf8').read()
    except FileNotFoundError: continue
    t = s.replace(a, b).replace(html.escape(a), html.escape(b))
    if t != s: open(p, 'w', encoding='utf8').write(t)
    print(p, t != s)
