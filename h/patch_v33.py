import json
h = open('live.html').read()
def rep(a, b, c=1):
    global h
    assert h.count(a) == c, (a[:100], h.count(a)); h = h.replace(a, b)
I = lambda it, fr, en: [it, fr, en]
ORD = [
 dict(q=I("Prädikat tedeschi: dal meno al più zuccherino", "Prädikats allemands : du moins au plus sucré", "German Prädikats: least to most sugar"), it=["Kabinett", "Spätlese", "Auslese", "Beerenauslese", "Trockenbeerenauslese"]),
 dict(q=I("Gerarchia della Borgogna: dal basso all'alto", "Hiérarchie bourguignonne : du bas vers le haut", "Burgundy hierarchy: bottom to top"), it=[I("Regionale (Bourgogne)", "Régionale (Bourgogne)", "Regional (Bourgogne)"), "Village", "Premier Cru", "Grand Cru"]),
 dict(q=I("Champagne: dal più secco al più dolce", "Champagne : du plus sec au plus doux", "Champagne: driest to sweetest"), it=["Brut Nature", "Extra Brut", "Brut", "Extra Dry", "Demi-Sec", "Doux"]),
 dict(q=I("Spagna (rossi): dal meno al più invecchiato", "Espagne (rouges) : du moins au plus vieilli", "Spain (reds): least to most aged"), it=["Joven", "Crianza", "Reserva", "Gran Reserva"]),
 dict(q=I("Wachau: dal più leggero al più pieno", "Wachau : du plus léger au plus ample", "Wachau: lightest to fullest"), it=["Steinfeder", "Federspiel", "Smaragd"]),
 dict(q=I("Ciclo annuale della vite", "Cycle annuel de la vigne", "The vine's annual cycle"), it=[I("Germogliamento", "Débourrement", "Budburst"), I("Fioritura", "Floraison", "Flowering"), I("Allegagione", "Nouaison", "Fruit set"), I("Invaiatura", "Véraison", "Veraison"), I("Vendemmia", "Vendanges", "Harvest")]),
 dict(q=I("Metodo tradizionale: le tappe in ordine", "Méthode traditionnelle : les étapes dans l'ordre", "Traditional method: steps in order"), it=[I("Vino base e assemblaggio", "Vin de base et assemblage", "Base wine and blending"), I("Liqueur de tirage", "Liqueur de tirage", "Liqueur de tirage"), I("Presa di spuma in bottiglia", "Prise de mousse en bouteille", "Second fermentation in bottle"), I("Affinamento sui lieviti", "Élevage sur lies", "Ageing on lees"), "Remuage", I("Sboccatura e dosaggio", "Dégorgement et dosage", "Disgorgement and dosage")]),
 dict(q=I("Vinificazione in rosso: le tappe in ordine", "Vinification en rouge : les étapes dans l'ordre", "Red winemaking: steps in order"), it=[I("Diraspatura e pigiatura", "Éraflage et foulage", "Destemming and crushing"), I("Fermentazione con macerazione", "Fermentation avec macération", "Fermentation on the skins"), I("Svinatura", "Écoulage", "Draining"), I("Pressatura", "Pressurage", "Pressing"), I("Malolattica", "Malolactique", "Malolactic conversion"), I("Affinamento", "Élevage", "Maturation")]),
 dict(q=I("Wine of Origin (Sudafrica): dal più grande al più piccolo", "Wine of Origin (Afrique du Sud) : du plus grand au plus petit", "Wine of Origin (South Africa): largest to smallest"), it=["Geographical Unit", "Region", "District", "Ward"]),
 dict(q=I("Italia: dal livello più basso al più alto", "Italie : du niveau le plus bas au plus haut", "Italy: lowest to highest tier"), it=[I("Vino (senza IG)", "Vino (sans IG)", "Vino (no GI)"), "IGT", "DOC", "DOCG"]),
 dict(q=I("Médoc: comuni da nord a sud", "Médoc : communes du nord au sud", "Médoc: communes north to south"), it=["Saint-Estèphe", "Pauillac", "Saint-Julien", "Margaux"]),
 dict(q=I("Rodano settentrionale: da nord a sud", "Rhône septentrional : du nord au sud", "Northern Rhône: north to south"), it=["Côte-Rôtie", "Condrieu", "Hermitage", "Cornas"]),
 dict(q=I("Cile: regioni da nord a sud", "Chili : régions du nord au sud", "Chile: regions north to south"), it=["Coquimbo", "Aconcagua", I("Valle Centrale", "Vallée Centrale", "Central Valley"), I("Regione Sud", "Région Sud", "Southern")]),
 dict(q=I("Nuova Zelanda: da nord a sud", "Nouvelle-Zélande : du nord au sud", "New Zealand: north to south"), it=["Auckland", "Hawke's Bay", "Martinborough", "Marlborough", "Central Otago"]),
 dict(q=I("Côte d'Or: villaggi da nord a sud", "Côte d'Or : villages du nord au sud", "Côte d'Or: villages north to south"), it=["Gevrey-Chambertin", "Vosne-Romanée", "Beaune", "Meursault", "Puligny-Montrachet"]),
 dict(q=I("Sherry: dal colore più chiaro al più scuro", "Xérès : de la couleur la plus pâle à la plus sombre", "Sherry: palest to darkest colour"), it=["Fino", "Amontillado", "Oloroso", "Pedro Ximénez"]),
]
import os
_t0 = json.load(open('../tts/times.json')) if os.path.exists('../tts/times.json') else {}
_t3 = json.load(open('../tts/times3.json')) if os.path.exists('../tts/times3.json') and os.environ.get('FILM_V3') else {}
for _k, _v in _t3.items(): _t0.setdefault(_k, {}).update(_v)
_flt = json.dumps(_t0)
js = '\n'.join(open(f).read() for f in ['app2.js','app3.js','films_lib.js','films_1.js','films_2.js','films_3.js','films_4.js','films_5.js','films_6.js','films_7.js','films_8.js','films_9.js','films_10.js','films_11.js','films_12.js','films_13.js','app4.js','app5.js','app6.js','app7.js','app8.js','app9.js','app10.js','geox.js','app11.js','app12.js','app13.js','app14.js','app15.js','app16.js','app17.js','app18.js','app19.js','kt.js','app20.js','app21.js','app22.js','app23.js','app24.js','app25.js','app26.js','app27.js','app28.js','app29.js','app30.js','app31.js','app32.js']).replace('__ORDERS__', json.dumps(ORD, ensure_ascii=False)).replace('__FLT__', _flt).replace('__PODS__', open('pods_manifest.json').read() if os.path.exists('pods_manifest.json') else '[]')
MK = '/* ---------- v33: app shell'
if MK in h:
    a = h.index(MK); b = h.index('function bindView(){'); h = h[:a] + js + '\n' + h[b:]
else:
    rep('function bindView(){', js + '\nfunction bindView(){')
    rep('const DGOAL=3;', 'let DGOAL=+(lsGet("wset3-goal")||3);')
    rep('  if(view==="home"){\n    $("#w-train")', '  if(view==="home_x"){\n    $("#w-train")')
    rep('  if(view==="exam"&&MK&&MK.go){', '  if(GNAME[view]){ m.innerHTML=renderGame(view); window.scrollTo(0,0); return }\n  if(view==="exam"&&MK&&MK.go){')
    rep('m.innerHTML=(TRAIN.includes(view)?trainNav():"")+{home:renderHome,', 'm.innerHTML=(SUBV[view]?trainNav():"")+{home:renderHome,study:renderStudy,play:renderPlay,me:renderMe,settings:renderSettings,')
    rep('  ["home","train","exam","history"].forEach(v=>$("#tab-"+v+" .tl").textContent=t(v));\n  $("#tab-errors .tl").textContent=t("revTab");',
        '  TABS.forEach(v=>{ const e=$("#tab-"+v+" .tl"); if(e) e.textContent=t("tab_"+v); });')
    rep('b.setAttribute("aria-selected",!quiz&&(b.dataset.v===view||(b.dataset.v==="train"&&TRAIN.includes(view)))));',
        'b.setAttribute("aria-selected",!quiz&&b.dataset.v===TABG[view]));')
    rep('setSync(syncState); try{ paintRail(); }catch(e){}', 'setSync(syncState); try{ paintRail(); paintBell(); }catch(e){}')
    rep('quiz=null; oq=null; satShow=null; satEdit=false; mg=null; view=b.dataset.v==="train"?trainV:b.dataset.v; render(); });',
        'go(b.dataset.v); });')
    rep('<div class="pills" id="pills"></div>', '<div class="pills" id="pills"></div><button type="button" class="bellb" aria-label="Notifiche">' + '<svg viewBox="0 0 24 24"><path d="M12 2.5a6 6 0 0 0-6 6v4.2l-1.8 3.1c-.4.7.1 1.5.9 1.5h13.8c.8 0 1.3-.8.9-1.5L18 12.7V8.5a6 6 0 0 0-6-6z" fill="#d4a23a" stroke="#a87b1e" stroke-width="1.2"/><path d="M9.5 19.5a2.5 2.5 0 0 0 5 0" fill="#a87b1e"/></svg><i></i></button>')
    # simpler rail: drop tip card
    rep('''   <div class="rcard rgoal">${gfree("n12",64)}<p>${t("duoTip")}</p></div>`; }''', '''`; }''')
    S = {
     'it': {"tab_home": "Oggi", "tab_study": "Studia", "tab_play": "Gioca", "tab_exam": "Esame", "tab_me": "Io",
      "hiM": "Buongiorno!", "hiA": "Buon pomeriggio!", "hiE": "Buonasera!", "hTitle": "Il tuo piano di oggi", "hNext": "Prossimo passo", "hStart": "Inizia",
      "hReady": "Pronta per l'esame", "hLeft": "Ti mancano {N} domande da padroneggiare: circa {S} sessioni da 10.", "hDone": "Hai padroneggiato tutte le domande. Fai esami simulati per mantenerti in forma!", "hForYou": "Consigliati per te",
      "rcErr": "Ripassa {N} errori", "rcErrD": "Ogni errore corretto conta subito per l'esame", "rcEvs": "Domande della scuola: {N} da fare", "rcEvsD": "Le domande inviate dalla tua scuola EVS",
      "rcWeak": "Rinforza: {C}", "rcWeakD": "Sei al {P}% di risposte giuste: 10 domande mirate", "rcNew": "Inizia: {C}", "rcNewD": "Capitolo non ancora affrontato", "rcHalf": "Continua: {C}", "rcHalfD": "Padroneggiato al {P}%",
      "rcGrapes": "Gioca ad Abbina!", "rcGrapesD": "{N} vitigni da imparare", "rcMaps": "Esplora le mappe", "rcMapsD": "La geografia vale punti all'esame", "rcMock": "Fai un esame simulato", "rcMockD": "Mettiti alla prova in condizioni d'esame", "rcMockD2": "Ultimo risultato: {P}%. Riprova!",
      "rcMix": "Sessione mista", "rcMixD": "10 domande da tutto il programma",
      "stIntro": "Tutto il programma, una cosa alla volta.", "stQuiz": "10 domande per capitolo", "stSchemi": "Paesi, regioni e vitigni in un colpo d'occhio",
      "plIntro": "Ripassa giocando: brevi, veloci, e contano per i tuoi progressi.",
      "gTf": "Vero o falso lampo", "gTfD": "60 secondi, più risposte possibile", "gTfD2": "Vedrai un abbinamento (zona e vitigno, vitigno e tratto tipico, zona e paese): è giusto o no? Hai 60 secondi; ogni errore toglie 3 secondi, 5 risposte di fila valgono doppio.",
      "gGuess": "Chi sono?", "gGuessD": "Indovina il vitigno dagli indizi", "gGuessD2": "Arrivano indizi uno alla volta: struttura, aromi, clima, stili, regioni. Indovina il vitigno il prima possibile: meno indizi usi, più punti prendi. 8 vitigni per partita.",
      "gSurv": "Sopravvivenza", "gSurvD": "3 cuori, 20 secondi a domanda", "gSurvD2": "Domande d'esame sempre più difficili, 20 secondi l'una. Hai 3 cuori: quanto resisti? Le risposte contano per i tuoi progressi.",
      "gOrder": "In ordine!", "gOrderD": "Gerarchie, tappe e geografia", "gOrderD2": "Tocca gli elementi nell'ordine giusto: Prädikat, gerarchie, tappe di vinificazione, geografia da nord a sud. 6 sfide per partita.",
      "gMap": "Caccia sulla mappa", "gMapD": "Trova regioni e denominazioni",
      "gPlay": "Gioca", "gBest": "Record", "gOver": "Partita finita!", "gNewBest": "Nuovo record!", "gAgain": "Gioca ancora", "gBack": "Altri giochi", "gPts": "punti", "gNext": "Continua", "gSee": "Vedi il risultato", "gReview": "Da ricordare",
      "tfQ1": "Questo vitigno è tipico di questa zona?", "tfQ2": "Questo è il tratto tipico del vitigno?", "tfQ3": "Questa zona è in questo paese?", "tfTrue": "Vero", "tfFalse": "Falso", "tfKeys": "Tastiera: ← falso, → vero",
      "guQ": "Indovina il vitigno", "guWorth": "vale {N} punti", "guMore": "Un altro indizio", "guWas": "Era:",
      "svTime": "Tempo scaduto!", "svNo": "Risposta sbagliata", "svUnit": "risposte giuste",
      "orQ": "Metti in ordine", "orCheck": "Verifica", "orFix": "Ordine giusto:", "orUnit": "sfide riuscite",
      "meTitle": "Il tuo spazio", "meLevel": "Livello", "meMast": "padroneggiate", "meRoad": "Verso l'esame", "meRoadA": "{M} domande padroneggiate su {T}", "meMock": "Ultimo esame simulato: {P}%",
      "meErrD": "Le domande che hai sbagliato", "meHistD": "Tutte le tue sessioni", "meSet": "Impostazioni", "meSetD": "Obiettivo, lingua, tema, notifiche",
      "setGoal": "Obiettivo giornaliero", "setGoalD": "Sessioni al giorno (quiz, giochi, mappe)", "setLang": "Lingua", "setTheme": "Tema", "setAuto": "Automatico", "setLight": "Chiaro", "setDark": "Scuro",
      "setNotif": "Promemoria", "setNotifD": "Ti avvisiamo quando la serie è a rischio (sul telefono serve l'app aperta o installata).", "setNotifNA": "Il tuo browser non supporta le notifiche qui.", "setNotifOn": "Attivi", "setNotifBtn": "Attiva promemoria",
      "nTitle": "Notifiche", "nEvs": "100 nuove domande stile esame", "nEvsD": "Mescolate con tutte le altre in ogni capitolo", "nGames": "Nuova sezione Gioca", "nGamesD": "4 giochi nuovi per ripassare divertendoti", "nHun": "Ungheria e Tokaj", "nHunD": "Nuova mappa e schede",
      "nStreak": "La tua serie di {N} giorni è a rischio!", "nStreakD": "Bastano 10 domande per salvarla", "nErr": "{N} errori aspettano un ripasso", "nGoal": "Obiettivo del giorno raggiunto! 🎉", "nGoalD": "Vuoi fare un gioco bonus?",
      "nWeek": "Questa settimana: {N} sessioni", "nWeekD": "Totale XP: {X}. Continua così!", "prIntro": "Tocca un capitolo per 10 domande. Il cerchio mostra quanto lo padroneggi.", "prCustom": "Quiz su misura (più capitoli, livello, numero di domande)"},
     'fr': {"tab_home": "Aujourd'hui", "tab_study": "Réviser", "tab_play": "Jouer", "tab_exam": "Examen", "tab_me": "Moi",
      "hiM": "Bonjour !", "hiA": "Bon après-midi !", "hiE": "Bonsoir !", "hTitle": "Ton programme du jour", "hNext": "Prochaine étape", "hStart": "Commencer",
      "hReady": "Prête pour l'examen", "hLeft": "Il te reste {N} questions à maîtriser : environ {S} séances de 10.", "hDone": "Tu maîtrises toutes les questions. Fais des examens blancs pour rester en forme !", "hForYou": "Recommandé pour toi",
      "rcErr": "Revois {N} erreurs", "rcErrD": "Chaque erreur corrigée compte tout de suite pour l'examen", "rcEvs": "Questions de l'école : {N} à faire", "rcEvsD": "Les questions envoyées par ton école EVS",
      "rcWeak": "Renforce : {C}", "rcWeakD": "Tu es à {P} % de bonnes réponses : 10 questions ciblées", "rcNew": "Commence : {C}", "rcNewD": "Chapitre pas encore abordé", "rcHalf": "Continue : {C}", "rcHalfD": "Maîtrisé à {P} %",
      "rcGrapes": "Joue à Associe !", "rcGrapesD": "{N} cépages à apprendre", "rcMaps": "Explore les cartes", "rcMapsD": "La géographie rapporte des points à l'examen", "rcMock": "Fais un examen blanc", "rcMockD": "Mets-toi en conditions d'examen", "rcMockD2": "Dernier résultat : {P} %. Retente !",
      "rcMix": "Séance mixte", "rcMixD": "10 questions sur tout le programme",
      "stIntro": "Tout le programme, une chose à la fois.", "stQuiz": "10 questions par chapitre", "stSchemi": "Pays, régions et cépages en un coup d'œil",
      "plIntro": "Révise en jouant : court, rapide, et ça compte pour ta progression.",
      "gTf": "Vrai ou faux éclair", "gTfD": "60 secondes, un max de réponses", "gTfD2": "Tu verras une association (zone et cépage, cépage et trait typique, zone et pays) : juste ou pas ? 60 secondes ; chaque erreur enlève 3 secondes, 5 bonnes réponses d'affilée comptent double.",
      "gGuess": "Qui suis-je ?", "gGuessD": "Devine le cépage grâce aux indices", "gGuessD2": "Les indices arrivent un par un : structure, arômes, climat, styles, régions. Devine le cépage au plus vite : moins d'indices, plus de points. 8 cépages par partie.",
      "gSurv": "Survie", "gSurvD": "3 cœurs, 20 secondes par question", "gSurvD2": "Des questions d'examen de plus en plus dures, 20 secondes chacune. Tu as 3 cœurs : combien de temps tiens-tu ? Les réponses comptent pour ta progression.",
      "gOrder": "Dans l'ordre !", "gOrderD": "Hiérarchies, étapes et géographie", "gOrderD2": "Touche les éléments dans le bon ordre : Prädikats, hiérarchies, étapes de vinification, géographie du nord au sud. 6 défis par partie.",
      "gMap": "Chasse sur la carte", "gMapD": "Trouve régions et appellations",
      "gPlay": "Jouer", "gBest": "Record", "gOver": "Partie terminée !", "gNewBest": "Nouveau record !", "gAgain": "Rejouer", "gBack": "Autres jeux", "gPts": "points", "gNext": "Continuer", "gSee": "Voir le résultat", "gReview": "À retenir",
      "tfQ1": "Ce cépage est-il typique de cette zone ?", "tfQ2": "Est-ce le trait typique du cépage ?", "tfQ3": "Cette zone est-elle dans ce pays ?", "tfTrue": "Vrai", "tfFalse": "Faux", "tfKeys": "Clavier : ← faux, → vrai",
      "guQ": "Devine le cépage", "guWorth": "vaut {N} points", "guMore": "Un autre indice", "guWas": "C'était :",
      "svTime": "Temps écoulé !", "svNo": "Mauvaise réponse", "svUnit": "bonnes réponses",
      "orQ": "Mets dans l'ordre", "orCheck": "Vérifier", "orFix": "Bon ordre :", "orUnit": "défis réussis",
      "meTitle": "Ton espace", "meLevel": "Niveau", "meMast": "maîtrisées", "meRoad": "Vers l'examen", "meRoadA": "{M} questions maîtrisées sur {T}", "meMock": "Dernier examen blanc : {P} %",
      "meErrD": "Les questions où tu t'es trompée", "meHistD": "Toutes tes séances", "meSet": "Réglages", "meSetD": "Objectif, langue, thème, notifications",
      "setGoal": "Objectif quotidien", "setGoalD": "Séances par jour (quiz, jeux, cartes)", "setLang": "Langue", "setTheme": "Thème", "setAuto": "Automatique", "setLight": "Clair", "setDark": "Sombre",
      "setNotif": "Rappels", "setNotifD": "On te prévient quand ta série est en danger (sur téléphone, l'app doit être ouverte ou installée).", "setNotifNA": "Ton navigateur ne gère pas les notifications ici.", "setNotifOn": "Activés", "setNotifBtn": "Activer les rappels",
      "nTitle": "Notifications", "nEvs": "100 nouvelles questions style examen", "nEvsD": "Mélangées avec toutes les autres dans chaque chapitre", "nGames": "Nouvelle section Jouer", "nGamesD": "4 nouveaux jeux pour réviser en s'amusant", "nHun": "Hongrie et Tokaj", "nHunD": "Nouvelle carte et fiches",
      "nStreak": "Ta série de {N} jours est en danger !", "nStreakD": "10 questions suffisent pour la sauver", "nErr": "{N} erreurs attendent une révision", "nGoal": "Objectif du jour atteint ! 🎉", "nGoalD": "Un jeu bonus ?",
      "nWeek": "Cette semaine : {N} séances", "nWeekD": "Total XP : {X}. Continue !", "prIntro": "Touche un chapitre pour 10 questions. Le cercle montre ton niveau de maîtrise.", "prCustom": "Quiz sur mesure (plusieurs chapitres, niveau, nombre de questions)"},
     'en': {"tab_home": "Today", "tab_study": "Study", "tab_play": "Play", "tab_exam": "Exam", "tab_me": "Me",
      "hiM": "Good morning!", "hiA": "Good afternoon!", "hiE": "Good evening!", "hTitle": "Your plan for today", "hNext": "Next step", "hStart": "Start",
      "hReady": "Exam ready", "hLeft": "{N} questions left to master: about {S} sessions of 10.", "hDone": "You've mastered every question. Keep sharp with mock exams!", "hForYou": "Recommended for you",
      "rcErr": "Review {N} mistakes", "rcErrD": "Every corrected mistake counts straight away", "rcEvs": "School questions: {N} to do", "rcEvsD": "The questions sent by your EVS school",
      "rcWeak": "Strengthen: {C}", "rcWeakD": "You're at {P}% correct: 10 targeted questions", "rcNew": "Start: {C}", "rcNewD": "A chapter you haven't tried yet", "rcHalf": "Keep going: {C}", "rcHalfD": "{P}% mastered",
      "rcGrapes": "Play Match it!", "rcGrapesD": "{N} grapes to learn", "rcMaps": "Explore the maps", "rcMapsD": "Geography earns marks in the exam", "rcMock": "Take a mock exam", "rcMockD": "Test yourself in exam conditions", "rcMockD2": "Last result: {P}%. Try again!",
      "rcMix": "Mixed session", "rcMixD": "10 questions across the syllabus",
      "stIntro": "The whole syllabus, one thing at a time.", "stQuiz": "10 questions per chapter", "stSchemi": "Countries, regions and grapes at a glance",
      "plIntro": "Revise by playing: short, fast, and it counts towards your progress.",
      "gTf": "Lightning true or false", "gTfD": "60 seconds, as many answers as you can", "gTfD2": "You'll see a pairing (area and grape, grape and typical trait, area and country): right or wrong? 60 seconds; each mistake costs 3 seconds, 5 in a row score double.",
      "gGuess": "Who am I?", "gGuessD": "Guess the grape from clues", "gGuessD2": "Clues arrive one at a time: structure, aromas, climate, styles, regions. Guess the grape as early as you can: fewer clues, more points. 8 grapes per game.",
      "gSurv": "Survival", "gSurvD": "3 hearts, 20 seconds per question", "gSurvD2": "Exam questions getting harder, 20 seconds each. You have 3 hearts: how long can you last? Answers count towards your progress.",
      "gOrder": "In order!", "gOrderD": "Hierarchies, steps and geography", "gOrderD2": "Tap the items in the right order: Prädikats, hierarchies, winemaking steps, geography north to south. 6 challenges per game.",
      "gMap": "Map hunt", "gMapD": "Find regions and appellations",
      "gPlay": "Play", "gBest": "Best", "gOver": "Game over!", "gNewBest": "New record!", "gAgain": "Play again", "gBack": "More games", "gPts": "points", "gNext": "Continue", "gSee": "See result", "gReview": "Remember",
      "tfQ1": "Is this grape typical of this area?", "tfQ2": "Is this the grape's typical trait?", "tfQ3": "Is this area in this country?", "tfTrue": "True", "tfFalse": "False", "tfKeys": "Keyboard: ← false, → true",
      "guQ": "Guess the grape", "guWorth": "worth {N} points", "guMore": "Another clue", "guWas": "It was:",
      "svTime": "Time's up!", "svNo": "Wrong answer", "svUnit": "correct answers",
      "orQ": "Put in order", "orCheck": "Check", "orFix": "Right order:", "orUnit": "challenges solved",
      "meTitle": "Your space", "meLevel": "Level", "meMast": "mastered", "meRoad": "Road to the exam", "meRoadA": "{M} of {T} questions mastered", "meMock": "Last mock exam: {P}%",
      "meErrD": "The questions you got wrong", "meHistD": "All your sessions", "meSet": "Settings", "meSetD": "Goal, language, theme, notifications",
      "setGoal": "Daily goal", "setGoalD": "Sessions per day (quizzes, games, maps)", "setLang": "Language", "setTheme": "Theme", "setAuto": "Automatic", "setLight": "Light", "setDark": "Dark",
      "setNotif": "Reminders", "setNotifD": "We'll warn you when your streak is at risk (on a phone the app must be open or installed).", "setNotifNA": "Your browser doesn't support notifications here.", "setNotifOn": "On", "setNotifBtn": "Turn on reminders",
      "nTitle": "Notifications", "nEvs": "100 new exam-style questions", "nEvsD": "Mixed in with all the others in every chapter", "nGames": "New Play section", "nGamesD": "4 new games to revise while having fun", "nHun": "Hungary and Tokaj", "nHunD": "New map and profiles",
      "nStreak": "Your {N}-day streak is at risk!", "nStreakD": "10 questions are enough to save it", "nErr": "{N} mistakes are waiting for review", "nGoal": "Daily goal reached! 🎉", "nGoalD": "Fancy a bonus game?",
      "nWeek": "This week: {N} sessions", "nWeekD": "Total XP: {X}. Keep it up!", "prIntro": "Tap a chapter for 10 questions. The ring shows how well you know it.", "prCustom": "Custom quiz (several chapters, level, number of questions)"},
    }
    i = h.index('Object.assign(T.en,{"train"'); j = h.index('\n', i) + 1
    h = h[:j] + ''.join('Object.assign(T.%s,%s);\n' % (k, json.dumps(v, ensure_ascii=False)) for k, v in S.items()) + h[j:]
open('live.html', 'w').write(h); print('ok')
