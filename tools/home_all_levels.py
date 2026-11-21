# -*- coding: utf-8 -*-
"""Home pages in 17 languages: present all levels (1, 2, 3), not Level 3 only, and make everything look free.
- hero text, stats, trust line, feature title, final call to action, steps, comparison table, meta descriptions
- removes the Level 3-only blocks: the 'try an open question' section, the '3 open questions' challenge card,
  the 'open questions marked like the exam' feature card and the short-answer marking FAQ
- FAQ rewritten for all levels; FAQPage JSON-LD rebuilt from the visible FAQ
Run from the repo root: python3 tools/home_all_levels.py"""
import re, json, html
e = html.escape
LANGS = {'.': 'en', 'it': 'it', 'fr': 'fr', 'es': 'es', 'es-ar': 'es-ar', 'de': 'de', 'nl': 'nl', 'pl': 'pl', 'pt': 'pt', 'pt-br': 'pt-br', 'ru': 'ru', 'el': 'el', 'ja': 'ja', 'ko': 'ko', 'zh-hans': 'zh-hans', 'zh-hant': 'zh-hant', 'ar': 'ar'}
NUM = {'en': ('2,800+', '1,200+'), 'ja': ('2,800+', '1,200+'), 'ko': ('2,800+', '1,200+'), 'zh-hans': ('2,800+', '1,200+'), 'zh-hant': ('2,800+', '1,200+'), 'fr': ('2 800+', '1 200+'),
       'pl': ('2800+', '1200+'), 'ru': ('2800+', '1200+'), 'ar': ('2800+', '1200+')}
T = {
 'en': dict(SUB="The app that trains you like the real exam, for WSET Levels 1, 2 and 3: lessons, practice questions with explanations, flashcards, games and a study plan built around your exam date. Levels 1, 2 and 3 available now; Diploma (Level 4): units D1, D2, D4 and D5 available, D3 and D6 in preparation.",
   FEAT="The most complete app to pass WSET Levels 1, 2 and 3", FILM="Animated films, podcasts, games, interactive maps and flashcards: revise on the train, on a break, anywhere.", FIN="Ready to pass your WSET exam first time?",
   STEP="Quizzes, lessons and revision: 20–30 minutes is enough.", LV="levels available", FL="flashcards", CMP=("Levels 1, 2 and 3 in one app", "rarely"), FREE="Free",
   FREEA="You can start every level straight away, free and without a credit card.", COURSE="Can The Wine Goat replace the WSET course?",
   LONGQ="How long does it take to prepare for a WSET exam?", LONGA="It depends on the level and your starting point: a few weeks of short daily sessions are usually enough for Level 1, while Levels 2 and 3 need regular study over a few months on top of course hours.",
   DESC="Prepare for WSET Levels 1, 2 and 3 in one app: 2,800+ practice questions with explanations, lessons, flashcards, mock exams, games and a personal study plan. Start free.", SAY="Start free, try it! 🍇"),
 'it': dict(SUB="L'app che ti allena come all'esame vero, per i Livelli WSET 1, 2 e 3: lezioni, quiz con spiegazione, flashcard, giochi e un piano di studio costruito sulla tua data d'esame. Livelli 1, 2 e 3 disponibili ora; Diploma (Livello 4): unità D1, D2, D4 e D5 disponibili, D3 e D6 in preparazione.",
   FEAT="L'app più completa per passare il WSET, dal Livello 1 al 3", FILM="Film animati, podcast, giochi, mappe interattive e flashcard: per ripassare in metro, in pausa, ovunque.", FIN="Vuoi passare il tuo esame WSET al primo colpo?",
   STEP="Quiz, lezioni e ripasso: 20-30 minuti bastano.", LV="livelli disponibili", FL="flashcard", CMP=("Livelli 1, 2 e 3 in un'unica app", "raramente"), FREE="Gratis",
   FREEA="Puoi iniziare subito con tutti i livelli, gratis e senza carta di credito.", COURSE="Posso usare The Wine Goat al posto del corso WSET?",
   LONGQ="Quanto tempo serve per preparare un esame WSET?", LONGA="Dipende dal livello e dal tuo punto di partenza: per il Livello 1 bastano di solito poche settimane di brevi sessioni quotidiane, mentre i Livelli 2 e 3 richiedono qualche mese di studio regolare oltre alle ore di corso.",
   DESC="Prepara i Livelli WSET 1, 2 e 3 in un'unica app: oltre 2.800 quiz con spiegazione, lezioni, flashcard, simulazioni d'esame, giochi e un piano di studio personale. Inizia gratis.", SAY="Si inizia gratis, prova! 🍇"),
 'fr': dict(SUB="L'appli qui vous entraîne comme à l'examen, pour les Niveaux WSET 1, 2 et 3 : leçons, QCM expliqués, flashcards, jeux et un plan de révision construit autour de votre date d'examen. Niveaux 1, 2 et 3 disponibles ; Diploma (niveau 4) : unités D1, D2, D4 et D5 disponibles, D3 et D6 en préparation.",
   FEAT="L'appli la plus complète pour réussir le WSET, du Niveau 1 au 3", FILM="Films animés, podcasts, jeux, cartes interactives et flashcards : pour réviser dans le métro, en pause, partout.", FIN="Envie de réussir votre examen WSET du premier coup ?",
   STEP="QCM, leçons et révision : 20 à 30 minutes suffisent.", LV="niveaux disponibles", FL="flashcards", CMP=("Niveaux 1, 2 et 3 dans une seule appli", "rarement"), FREE="Gratuit",
   FREEA="Vous pouvez commencer tout de suite tous les niveaux, gratuitement et sans carte bancaire.", COURSE="Puis-je remplacer le cours WSET par The Wine Goat ?",
   LONGQ="Combien de temps faut-il pour préparer un examen WSET ?", LONGA="Cela dépend du niveau et de votre point de départ : pour le Niveau 1, quelques semaines de courtes séances quotidiennes suffisent en général ; les Niveaux 2 et 3 demandent quelques mois de travail régulier en plus des heures de cours.",
   DESC="Préparez les Niveaux WSET 1, 2 et 3 dans une seule appli : plus de 2 800 QCM expliqués, leçons, flashcards, examens blancs, jeux et plan de révision personnel. Commencez gratuitement.", SAY="C'est gratuit, essaie ! 🍇"),
 'es': dict(SUB="La app que te entrena como en el examen real, para los Niveles WSET 1, 2 y 3: lecciones, preguntas con explicación, flashcards, juegos y un plan de estudio según tu fecha de examen. Niveles 1, 2 y 3 disponibles; Diploma (nivel 4): unidades D1, D2, D4 y D5 disponibles, D3 y D6 en preparación.",
   FEAT="La app más completa para aprobar el WSET, del Nivel 1 al 3", FILM="Películas animadas, podcasts, juegos, mapas interactivos y flashcards: para repasar en el metro, en un descanso, donde sea.", FIN="¿Quieres aprobar tu examen WSET a la primera?",
   STEP="Test, lecciones y repaso: bastan 20-30 minutos.", LV="niveles disponibles", FL="flashcards", CMP=("Niveles 1, 2 y 3 en una sola app", "rara vez"), FREE="Gratis",
   FREEA="Puedes empezar ya con todos los niveles, gratis y sin tarjeta.", COURSE="¿Puedo usar The Wine Goat en lugar del curso WSET?",
   LONGQ="¿Cuánto tiempo hace falta para preparar un examen WSET?", LONGA="Depende del nivel y de tu punto de partida: para el Nivel 1 suelen bastar unas semanas de sesiones cortas diarias; los Niveles 2 y 3 requieren unos meses de estudio regular además de las horas de curso.",
   DESC="Prepara los Niveles WSET 1, 2 y 3 en una sola app: más de 2.800 preguntas con explicación, lecciones, flashcards, simulacros, juegos y un plan de estudio personal. Empieza gratis.", SAY="¡Empieza gratis, pruébalo! 🍇"),
 'es-ar': dict(SUB="La app que te entrena como en el examen real, para los Niveles WSET 1, 2 y 3: lecciones, preguntas con explicación, flashcards, juegos y un plan de estudio según tu fecha de examen. Niveles 1, 2 y 3 disponibles; Diploma (nivel 4): unidades D1, D2, D4 y D5 disponibles, D3 y D6 en preparación.",
   FEAT="La app más completa para aprobar el WSET, del Nivel 1 al 3", FILM="Películas animadas, podcasts, juegos, mapas interactivos y flashcards: para repasar en el subte, en un recreo, donde sea.", FIN="¿Querés aprobar tu examen WSET a la primera?",
   STEP="Test, lecciones y repaso: bastan 20-30 minutos.", LV="niveles disponibles", FL="flashcards", CMP=("Niveles 1, 2 y 3 en una sola app", "rara vez"), FREE="Gratis",
   QF="¿Hay preguntas del WSET gratis?", QFA="Sí: podés empezar ya con todos los niveles, gratis y sin tarjeta.", QC="¿Cuántas preguntas tienen los exámenes WSET?",
   QCA="Nivel 1: 30 preguntas tipo test en 45 minutos (se aprueba con 70 %). Nivel 2: 50 preguntas tipo test en 60 minutos (55 %). Nivel 3: 50 preguntas tipo test y 4 respuestas escritas cortas, más una cata a ciegas de dos vinos.",
   DESC="Prepará los Niveles WSET 1, 2 y 3 en una sola app: más de 2.800 preguntas con explicación, lecciones, flashcards, simulacros, juegos y un plan de estudio personal. Empezá gratis.", SAY="¡Empezá gratis, probalo! 🍇"),
 'de': dict(SUB="Die App, die dich wie in der echten Prüfung trainiert, für WSET Level 1, 2 und 3: Lektionen, Übungsfragen mit Erklärung, Lernkarten, Spiele und ein Lernplan nach deinem Prüfungstermin. Level 1, 2 und 3 verfügbar.",
   FEAT="Die umfassendste App für WSET Level 1, 2 und 3", FILM="Animierte Filme, Podcasts, Spiele, Karten und Lernkarten: lernen in der Bahn, in der Pause, überall.", FIN="Bereit für deine WSET-Prüfung?",
   STEP="Fragen, Lektionen, Wiederholung: 20–30 Minuten reichen.", LV="verfügbare Levels", FL="Lernkarten", CMP=("Level 1, 2 und 3 in einer App", "selten"), FREE="Kostenlos",
   QF="Gibt es kostenlose WSET-Übungsfragen?", QFA="Ja: Du kannst sofort mit allen Levels starten, kostenlos und ohne Kreditkarte.", QC="Wie viele Fragen haben die WSET-Prüfungen?",
   QCA="Level 1: 30 Multiple-Choice-Fragen in 45 Minuten (bestanden ab 70 %). Level 2: 50 Multiple-Choice-Fragen in 60 Minuten (55 %). Level 3: 50 Multiple-Choice-Fragen und 4 kurze schriftliche Antworten, dazu eine Blindverkostung von zwei Weinen.",
   DESC="Bereite dich in einer App auf WSET Level 1, 2 und 3 vor: über 2.800 Übungsfragen mit Erklärung, Lektionen, Lernkarten, Probeprüfungen, Spiele und ein persönlicher Lernplan. Kostenlos starten.", SAY="Kostenlos starten, probier es! 🍇"),
 'nl': dict(SUB="De app die je traint zoals het echte examen, voor WSET Level 1, 2 en 3: lessen, oefenvragen met uitleg, flashcards, spellen en een studieplan rond je examendatum. Level 1, 2 en 3 nu beschikbaar.",
   FEAT="De meest complete app voor WSET Level 1, 2 en 3", FILM="Animatiefilms, podcasts, spellen, kaarten en flashcards: leren in de trein, in de pauze, overal.", FIN="Klaar voor je WSET-examen?",
   STEP="Vragen, lessen, herhaling: 20–30 minuten is genoeg.", LV="beschikbare levels", FL="flashcards", CMP=("Level 1, 2 en 3 in één app", "zelden"), FREE="Gratis",
   QF="Zijn er gratis WSET-oefenvragen?", QFA="Ja: je kunt meteen met alle levels beginnen, gratis en zonder creditcard.", QC="Hoeveel vragen hebben de WSET-examens?",
   QCA="Level 1: 30 meerkeuzevragen in 45 minuten (geslaagd vanaf 70%). Level 2: 50 meerkeuzevragen in 60 minuten (55%). Level 3: 50 meerkeuzevragen en 4 korte schriftelijke antwoorden, plus een blindproeverij van twee wijnen.",
   DESC="Bereid je in één app voor op WSET Level 1, 2 en 3: 2.800+ oefenvragen met uitleg, lessen, flashcards, proefexamens, spellen en een persoonlijk studieplan. Gratis beginnen.", SAY="Gratis beginnen, probeer het! 🍇"),
 'pl': dict(SUB="Aplikacja, która trenuje jak prawdziwy egzamin, dla poziomów WSET 1, 2 i 3: lekcje, pytania z wyjaśnieniem, fiszki, gry i plan nauki dopasowany do daty egzaminu. Poziomy 1, 2 i 3 dostępne.",
   FEAT="Najbardziej kompletna aplikacja do WSET, od poziomu 1 do 3", FILM="Animowane filmy, podcasty, gry, mapy i fiszki.", FIN="Gotowi na egzamin WSET?",
   STEP="Pytania, lekcje, powtórki: wystarczy 20–30 minut.", LV="dostępne poziomy", FL="fiszek", CMP=("Poziomy 1, 2 i 3 w jednej aplikacji", "rzadko"), FREE="Za darmo",
   QF="Czy są darmowe pytania WSET?", QFA="Tak: możesz od razu zacząć każdy poziom, za darmo i bez karty.", QC="Ile pytań mają egzaminy WSET?",
   QCA="Poziom 1: 30 pytań testowych w 45 minut (zaliczenie od 70%). Poziom 2: 50 pytań testowych w 60 minut (55%). Poziom 3: 50 pytań testowych i 4 krótkie odpowiedzi pisemne oraz degustacja w ciemno dwóch win.",
   DESC="Przygotuj się do poziomów WSET 1, 2 i 3 w jednej aplikacji: ponad 2800 pytań z wyjaśnieniem, lekcje, fiszki, egzaminy próbne, gry i osobisty plan nauki. Zacznij za darmo.", SAY="Zacznij za darmo! 🍇"),
 'pt': dict(SUB="A app que o treina como no exame real, para os Níveis WSET 1, 2 e 3: lições, perguntas com explicação, flashcards, jogos e um plano de estudo à volta da data do exame. Níveis 1, 2 e 3 disponíveis.",
   FEAT="A app mais completa para o WSET, do Nível 1 ao 3", FILM="Filmes animados, podcasts, jogos, mapas e flashcards: estude no metro, numa pausa, em qualquer lado.", FIN="Pronto(a) para o seu exame WSET?",
   STEP="Perguntas, lições e revisão: 20–30 minutos chegam.", LV="níveis disponíveis", FL="flashcards", CMP=("Níveis 1, 2 e 3 numa só app", "raramente"), FREE="Grátis",
   QF="Há perguntas grátis do WSET?", QFA="Sim: pode começar já todos os níveis, grátis e sem cartão.", QC="Quantas perguntas têm os exames WSET?",
   QCA="Nível 1: 30 perguntas de escolha múltipla em 45 minutos (aprovação com 70%). Nível 2: 50 perguntas em 60 minutos (55%). Nível 3: 50 perguntas de escolha múltipla e 4 respostas escritas curtas, mais uma prova cega de dois vinhos.",
   DESC="Prepare os Níveis WSET 1, 2 e 3 numa só app: mais de 2.800 perguntas com explicação, lições, flashcards, exames simulados, jogos e plano de estudo pessoal. Comece grátis.", SAY="Comece grátis, experimenta! 🍇"),
 'pt-br': dict(SUB="O app que treina você como na prova real, para os Níveis WSET 1, 2 e 3: aulas, questões com explicação, flashcards, jogos e um plano de estudo pela data da sua prova. Níveis 1, 2 e 3 disponíveis.",
   FEAT="O app mais completo para o WSET, do Nível 1 ao 3", FILM="Filmes animados, podcasts, jogos, mapas e flashcards: estude no metrô, numa pausa, em qualquer lugar.", FIN="Pronto(a) para a sua prova WSET?",
   STEP="Questões, aulas e revisão: 20–30 minutos bastam.", LV="níveis disponíveis", FL="flashcards", CMP=("Níveis 1, 2 e 3 em um só app", "raramente"), FREE="Grátis",
   QF="Existem questões grátis do WSET?", QFA="Sim: você pode começar agora todos os níveis, grátis e sem cartão.", QC="Quantas questões têm as provas WSET?",
   QCA="Nível 1: 30 questões de múltipla escolha em 45 minutos (aprovação com 70%). Nível 2: 50 questões em 60 minutos (55%). Nível 3: 50 questões de múltipla escolha e 4 respostas escritas curtas, além de uma degustação às cegas de dois vinhos.",
   DESC="Prepare-se para os Níveis WSET 1, 2 e 3 em um só app: mais de 2.800 questões com explicação, aulas, flashcards, simulados, jogos e plano de estudo pessoal. Comece grátis.", SAY="Comece grátis, experimente! 🍇"),
 'ru': dict(SUB="Приложение, которое тренирует как на настоящем экзамене, для уровней WSET 1, 2 и 3: уроки, вопросы с объяснениями, карточки, игры и план по дате экзамена. Уровни 1, 2 и 3 доступны.",
   FEAT="Самое полное приложение для WSET, от уровня 1 до 3", FILM="Анимационные фильмы, подкасты, игры, карты и карточки.", FIN="Готовы к экзамену WSET?",
   STEP="Вопросы, уроки, повторение: хватит 20–30 минут.", LV="доступных уровня", FL="карточек", CMP=("Уровни 1, 2 и 3 в одном приложении", "редко"), FREE="Бесплатно",
   QF="Есть ли бесплатные вопросы WSET?", QFA="Да: можно сразу начать любой уровень, бесплатно и без банковской карты.", QC="Сколько вопросов на экзаменах WSET?",
   QCA="Уровень 1: 30 тестовых вопросов за 45 минут (проходной балл 70%). Уровень 2: 50 тестовых вопросов за 60 минут (55%). Уровень 3: 50 тестовых вопросов и 4 коротких письменных ответа, а также слепая дегустация двух вин.",
   DESC="Подготовка к WSET уровней 1, 2 и 3 в одном приложении: более 2800 вопросов с объяснениями, уроки, карточки, пробные экзамены, игры и личный план. Начните бесплатно.", SAY="Начни бесплатно! 🍇"),
 'el': dict(SUB="Η εφαρμογή που σε εκπαιδεύει όπως η πραγματική εξέταση, για τα Επίπεδα WSET 1, 2 και 3: μαθήματα, ερωτήσεις με εξήγηση, κάρτες, παιχνίδια και πλάνο μελέτης. Επίπεδα 1, 2 και 3 διαθέσιμα.",
   FEAT="Η πιο ολοκληρωμένη εφαρμογή για το WSET, από το Επίπεδο 1 έως το 3", FILM="Κινούμενες ταινίες, podcast, παιχνίδια, χάρτες και κάρτες.", FIN="Έτοιμοι για την εξέταση WSET;",
   STEP="Ερωτήσεις, μαθήματα, επανάληψη: αρκούν 20–30 λεπτά.", LV="διαθέσιμα επίπεδα", FL="κάρτες", CMP=("Επίπεδα 1, 2 και 3 σε μία εφαρμογή", "σπάνια"), FREE="Δωρεάν",
   QF="Υπάρχουν δωρεάν ερωτήσεις WSET;", QFA="Ναι: μπορείτε να ξεκινήσετε αμέσως οποιοδήποτε επίπεδο, δωρεάν και χωρίς κάρτα.", QC="Πόσες ερωτήσεις έχουν οι εξετάσεις WSET;",
   QCA="Επίπεδο 1: 30 ερωτήσεις πολλαπλής επιλογής σε 45 λεπτά (βάση 70%). Επίπεδο 2: 50 ερωτήσεις σε 60 λεπτά (55%). Επίπεδο 3: 50 ερωτήσεις πολλαπλής επιλογής και 4 σύντομες γραπτές απαντήσεις, καθώς και τυφλή γευσιγνωσία δύο κρασιών.",
   DESC="Προετοιμάσου για τα Επίπεδα WSET 1, 2 και 3 σε μία εφαρμογή: πάνω από 2.800 ερωτήσεις με εξήγηση, μαθήματα, κάρτες, δοκιμαστικές εξετάσεις, παιχνίδια και προσωπικό πλάνο. Ξεκίνα δωρεάν.", SAY="Ξεκίνα δωρεάν! 🍇"),
 'ja': dict(SUB="WSETレベル1・2・3を本番と同じ形式で鍛えるアプリ：レッスン、解説付き練習問題、フラッシュカード、ゲーム、試験日に合わせた学習プラン。レベル1・2・3提供中。",
   FEAT="WSETレベル1〜3合格のための、最も充実したアプリ", FILM="アニメ授業、ポッドキャスト、ゲーム、地図、フラッシュカード。", FIN="WSETの試験、準備はいい？",
   STEP="問題、レッスン、復習：20〜30分で十分。", LV="レベル提供中", FL="フラッシュカード", CMP=("レベル1・2・3を1つのアプリで", "まれ"), FREE="無料",
   QF="WSETの無料練習問題はありますか？", QFA="はい。すべてのレベルをすぐに無料で始められます。クレジットカードは不要です。", QC="WSETの試験の問題数は？",
   QCA="レベル1：45分で選択式30問（合格70%）。レベル2：60分で選択式50問（55%）。レベル3：選択式50問と短い記述4問、さらにワイン2種のブラインドテイスティング。",
   DESC="WSETレベル1・2・3の対策を1つのアプリで：解説付き練習問題2,800問以上、レッスン、フラッシュカード、模擬試験、ゲーム、個人の学習プラン。無料で始めよう。", SAY="無料で始めよう！🍇"),
 'ko': dict(SUB="WSET 레벨 1·2·3을 실전처럼 훈련하는 앱: 레슨, 해설이 있는 연습 문제, 플래시카드, 게임, 시험일에 맞춘 학습 계획. 레벨 1·2·3 이용 가능.",
   FEAT="WSET 레벨 1~3 합격을 위한 가장 완벽한 앱", FILM="애니메이션 강의, 팟캐스트, 게임, 지도, 플래시카드.", FIN="WSET 시험, 준비되셨나요?",
   STEP="문제, 레슨, 복습: 20~30분이면 충분.", LV="개 레벨", FL="플래시카드", CMP=("레벨 1·2·3을 하나의 앱에서", "드묾"), FREE="무료",
   QF="무료 WSET 문제가 있나요?", QFA="네. 모든 레벨을 카드 없이 무료로 바로 시작할 수 있습니다.", QC="WSET 시험은 몇 문항인가요?",
   QCA="레벨 1: 45분 동안 객관식 30문항(합격 70%). 레벨 2: 60분 동안 객관식 50문항(55%). 레벨 3: 객관식 50문항과 짧은 서술형 4문항, 그리고 와인 2종 블라인드 테이스팅.",
   DESC="WSET 레벨 1·2·3을 하나의 앱으로: 해설이 있는 연습 문제 2,800개 이상, 레슨, 플래시카드, 모의고사, 게임, 개인 학습 계획. 무료로 시작하세요.", SAY="무료로 시작해요! 🍇"),
 'zh-hans': dict(SUB="像真实考试一样训练的应用，覆盖 WSET 一级、二级和三级：课程、带解析的练习题、记忆卡、游戏和按考试日期制定的学习计划。一级、二级和三级现已上线。",
   FEAT="备考 WSET 一级到三级最全面的应用", FILM="动画课、播客、游戏、地图和记忆卡。", FIN="准备好你的 WSET 考试了吗？",
   STEP="练习题、课程、复习：20–30 分钟就够。", LV="个级别", FL="张记忆卡", CMP=("一个应用涵盖一级、二级和三级", "很少"), FREE="免费",
   QF="有免费的WSET练习题吗？", QFA="有。所有级别都可以立即免费开始，无需信用卡。", QC="WSET考试有多少题？",
   QCA="一级：45分钟30道选择题（70%及格）。二级：60分钟50道选择题（55%）。三级：50道选择题和4道简答题，另加两款酒的盲品。",
   DESC="一个应用备考 WSET 一级、二级和三级：2,800 多道带解析的练习题、课程、记忆卡、模拟考试、游戏和个人学习计划。免费开始。", SAY="免费开始，来试试！🍇"),
 'zh-hant': dict(SUB="像真實考試一樣訓練的應用程式，涵蓋 WSET 一級、二級與三級：課程、附解析的練習題、記憶卡、遊戲和依考試日期制定的學習計畫。一級、二級與三級現已上線。",
   FEAT="備考 WSET 一級到三級最全面的應用程式", FILM="動畫課、Podcast、遊戲、地圖和記憶卡。", FIN="準備好你的 WSET 考試了嗎？",
   STEP="練習題、課程、複習：20–30 分鐘就夠。", LV="個級別", FL="張記憶卡", CMP=("一個應用程式涵蓋一級、二級與三級", "很少"), FREE="免費",
   QF="有免費的WSET練習題嗎？", QFA="有。所有級別都可以立即免費開始，無需信用卡。", QC="WSET考試有多少題？",
   QCA="一級：45分鐘30道選擇題（70%及格）。二級：60分鐘50道選擇題（55%）。三級：50道選擇題和4道簡答題，另加兩款酒的盲品。",
   DESC="一個應用程式備考 WSET 一級、二級與三級：2,800 多道附解析的練習題、課程、記憶卡、模擬考試、遊戲與個人學習計畫。免費開始。", SAY="免費開始，來試試！🍇"),
 'ar': dict(SUB="التطبيق الذي يدرّبك كما في الامتحان الحقيقي للمستويات 1 و2 و3 من WSET: دروس، أسئلة تدريبية مع الشرح، بطاقات، ألعاب وخطة دراسة حسب موعد امتحانك. المستويات 1 و2 و3 متاحة الآن.",
   FEAT="التطبيق الأكثر اكتمالًا لاجتياز WSET من المستوى 1 إلى 3", FILM="أفلام متحركة، بودكاست، ألعاب، خرائط وبطاقات.", FIN="هل أنت مستعد لامتحان WSET؟",
   STEP="أسئلة، دروس، مراجعة: تكفي 20–30 دقيقة.", LV="مستويات متاحة", FL="بطاقة", CMP=("المستويات 1 و2 و3 في تطبيق واحد", "نادرًا"), FREE="مجاني",
   QF="هل توجد أسئلة WSET مجانية؟", QFA="نعم: يمكنك البدء فورًا بأي مستوى، مجانًا ومن دون بطاقة ائتمان.", QC="كم عدد أسئلة امتحانات WSET؟",
   QCA="المستوى 1: 30 سؤال اختيار من متعدد في 45 دقيقة (النجاح بـ70%). المستوى 2: 50 سؤالًا في 60 دقيقة (55%). المستوى 3: 50 سؤال اختيار من متعدد و4 إجابات كتابية قصيرة، إضافة إلى تذوق أعمى لنبيذين.",
   DESC="استعد للمستويات 1 و2 و3 من WSET في تطبيق واحد: أكثر من 2800 سؤال مع الشرح، دروس، بطاقات، امتحانات تجريبية، ألعاب وخطة دراسة شخصية. ابدأ مجانًا.", SAY="ابدأ مجانًا! 🍇"),
}

def one(m, new, count=1):
    return new

for d, l in LANGS.items():
    p = f'{d}/index.html'; s = open(p, encoding='utf8').read(); o = s; t = T[l]
    n1, n2 = NUM.get(l, ('2.800+', '1.200+'))
    s = re.sub(r'<p class="sub3">.*?</p>', lambda m: f'<p class="sub3">{e(t["SUB"])}</p>', s, count=1, flags=re.S)
    s = re.sub(r'(<ul class="trust3"><li>)✓ [^<]*(</li>)', lambda m: f'{m.group(1)}✓ {t["FREE"]}{m.group(2)}', s, count=1)
    # stats: questions, levels, flashcards, languages
    st = re.findall(r'<div class="st"><b>[^<]*</b><span>([^<]*)</span></div>', s)
    if len(st) >= 4:
        new = f'<div class="st"><b>{n1}</b><span>{st[0]}</span></div><div class="st"><b>3</b><span>{e(t["LV"])}</span></div><div class="st"><b>{n2}</b><span>{e(t["FL"])}</span></div><div class="st"><b>4</b><span>{st[3]}</span></div>'
        s = re.sub(r'(<div class="st"><b>[^<]*</b><span>[^<]*</span></div>){4}', lambda m: new, s, count=1)
    # Level 3-only blocks out
    try_id = re.search(r'<section id="([^"]*)" class="sec3 try3"', s)
    s = re.sub(r'<section id="[^"]*" class="sec3 try3".*?</section>', '', s, count=1, flags=re.S)
    if try_id: s = s.replace(f'href="#{try_id.group(1)}"', 'href="#level"')
    s = re.sub(r'<a class="lvc" href="[^"]*#go=lvopen">.*?</a>', '', s, count=1, flags=re.S)
    i = s.find('class="sec3 feat3"')
    if i > 0:
        a = s.find('<article class="fcard">', i); b = s.find('</article>', a) + len('</article>')
        if a > 0 and ('xsheet' in s[a:b] or 'xq' in s[a:b]): s = s[:a] + s[b:]
        s = s[:i] + re.sub(r'<h2>.*?</h2>', lambda m: f'<h2>{e(t["FEAT"])}</h2>', s[i:], count=1, flags=re.S)
        j = s.find('class="film"', i)
        if j > 0: k = s.find('<p class="fsr">', j); s = s[:k] + re.sub(r'<p class="fsr">.*?</p>', lambda m: f'<p class="fsr">{e(t["FILM"])}</p>', s[k:], count=1, flags=re.S)
    i = s.find('class="sec3 fin3"')
    if i > 0: s = s[:i] + re.sub(r'<h2>.*?</h2>', lambda m: f'<h2>{e(t["FIN"])}</h2>', s[i:], count=1, flags=re.S)
    i = s.find('<ol class="stl">')
    if i > 0:
        ps = [m for m in re.finditer(r'<p>.*?</p>', s[i:], re.S)][:2]
        if len(ps) == 2: a, b = i + ps[1].start(), i + ps[1].end(); s = s[:a] + f'<p>{e(t["STEP"])}</p>' + s[b:]
    # comparison: drop open-questions and films rows, add the all-levels row first
    rows = re.findall(r'<tr><th scope="row">[^<]*</th><td class="us">[^<]*</td><td>[^<]*</td></tr>', s)
    if len(rows) == 4:
        keep = rows[1] + rows[2]
        newrow = f'<tr><th scope="row">{e(t["CMP"][0])}</th><td class="us">✓</td><td>{e(t["CMP"][1])}</td></tr>'
        s = s.replace(''.join(rows), newrow + keep, 1)
    # FAQ
    fq = re.findall(r'<details class="fq"><summary>(.*?)</summary>(.*?)</details>', s, re.S)
    out = []
    if 'COURSE' in t:   # 6-question pages (en/it/fr/es)
        for k, (q, a) in enumerate(fq):
            if k == 1: out.append((q, f'<p>{e(t["FREEA"])}</p>'))
            elif k == 2: out.append((e(t["COURSE"]), a))
            elif k == 4: continue
            elif k == 5: out.append((e(t["LONGQ"]), f'<p>{e(t["LONGA"])}</p>'))
            else: out.append((q, a))
    else:                 # 4-question pages
        for k, (q, a) in enumerate(fq):
            if k == 0: out.append((e(t["QF"]), f'<p>{e(t["QFA"])}</p>'))
            elif k == 1: out.append((e(t["QC"]), f'<p>{e(t["QCA"])}</p>'))
            else: out.append((q, a))
    if fq:
        a = s.find('<details class="fq">'); b = s.rfind('</details>') + len('</details>')
        s = s[:a] + ''.join(f'<details class="fq"><summary>{q}</summary>{a_}</details>' for q, a_ in out) + s[b:]
        ents = [{"@type": "Question", "name": html.unescape(re.sub('<[^>]+>', '', q)).strip(), "acceptedAnswer": {"@type": "Answer", "text": html.unescape(re.sub('<[^>]+>', '', a_)).strip()}} for q, a_ in out]
        def ld(m):
            try: J = json.loads(m.group(1))
            except Exception: return m.group(0)
            def walk(n):
                if isinstance(n, list): return [walk(x) for x in n]
                if not isinstance(n, dict): return n
                if n.get('@type') == 'FAQPage': n['mainEntity'] = ents
                return {k: walk(v) for k, v in n.items()}
            return '<script type="application/ld+json">' + json.dumps(walk(J), ensure_ascii=False) + '</script>'
        s = re.sub(r'<script type="application/ld\+json">(.*?)</script>', ld, s, flags=re.S)
    for attr in ('name="description"', 'property="og:description"', 'name="twitter:description"'):
        s = re.sub(r'(<meta ' + re.escape(attr) + r' content=")[^"]*(")', lambda m: m.group(1) + e(t["DESC"]) + m.group(2), s)
    s = re.sub(r'"[^"<>]{0,60}🍇"', '"' + t['SAY'] + '"', s)
    if s != o: open(p, 'w', encoding='utf8').write(s)
    print(d, s != o, len(out), 'faq')
