# -*- coding: utf-8 -*-
"""Home pages (17 languages): add the Spirits courses — a section with Spirits 1/2/3 cards after the wine levels,
a 'Spirits' menu link, one FAQ item (HTML + FAQPage JSON-LD) and a sentence in the hero. Idempotent.
Run from the repo root after tools/seo_sp/build.py:  python3 tools/seo_sp/home_spirits.py"""
import json, re, html
e = html.escape
SL = json.load(open('tools/seo_sp/slugs.json', encoding='utf8'))
DIRS = {'en': '.', 'it': 'it', 'fr': 'fr', 'es': 'es', 'es-ar': 'es-ar', 'de': 'de', 'nl': 'nl', 'pl': 'pl', 'pt': 'pt', 'pt-br': 'pt-br', 'ru': 'ru', 'el': 'el', 'ja': 'ja', 'ko': 'ko', 'zh-hans': 'zh-hans', 'zh-hant': 'zh-hant', 'ar': 'ar'}
# kick, h2, lead, [d1, d2, d3], live, soon, prep, start, guide, nav, faq q, faq a, hero add
T = {
 'en': ("New: spirits", "WSET Spirits courses, Levels 1, 2 and 3", "Whisky, brandy, rum, agave spirits, gin, liqueurs and cocktails: the same goat-powered method, now for spirits.",
        ["Spirit families, how they're made, labels and classic cocktails.", "Production in depth, the principal spirits of the world, liqueurs and cocktail families.", "Theory, 'explain why' written answers and blind tasting of spirits."],
        "Available now", "Coming very soon", "In preparation", "Start Spirits 1", "Read the guide →", "Spirits",
        "Does The Wine Goat cover the WSET spirits courses?", "Yes. Spirits Level 1 is already in the app, with lessons, practice questions with explanations, flashcards and a mock exam; Spirits Level 2 is coming very soon and Level 3 is in preparation. You can start free.",
        "New: Spirits courses, Level 1 already in the app."),
 'it': ("Novità: distillati", "Corsi WSET Spirits, Livelli 1, 2 e 3", "Whisky, brandy, rum, distillati d'agave, gin, liquori e cocktail: lo stesso metodo con le caprette, ora anche per i distillati.",
        ["Le famiglie di distillati, come si fanno, le etichette e i cocktail classici.", "Produzione approfondita, i grandi distillati del mondo, liquori e famiglie di cocktail.", "Teoria, risposte scritte «spiega perché» e degustazione alla cieca dei distillati."],
        "Disponibile ora", "In arrivo a breve", "In preparazione", "Inizia Spirits 1", "Leggi la guida →", "Spirits",
        "The Wine Goat prepara anche ai corsi WSET Spirits?", "Sì. Spirits Livello 1 è già nell'app, con lezioni, quiz con spiegazione, flashcard ed esame simulato; Spirits Livello 2 arriva a breve e il Livello 3 è in preparazione. Si inizia gratis.",
        "Novità: corsi Spirits, Livello 1 già nell'app."),
 'fr': ("Nouveau : spiritueux", "Cours WSET Spirits, Niveaux 1, 2 et 3", "Whisky, brandy, rhum, spiritueux d'agave, gin, liqueurs et cocktails : la même méthode avec les chèvres, désormais pour les spiritueux.",
        ["Les familles de spiritueux, leur fabrication, les étiquettes et les cocktails classiques.", "La production en détail, les grands spiritueux du monde, les liqueurs et les familles de cocktails.", "Théorie, réponses écrites « expliquez pourquoi » et dégustation à l'aveugle de spiritueux."],
        "Disponible", "Très bientôt", "En préparation", "Commencer Spirits 1", "Lire le guide →", "Spiritueux",
        "The Wine Goat prépare-t-il aussi aux cours WSET Spirits ?", "Oui. Spirits Niveau 1 est déjà dans l'appli, avec leçons, QCM expliqués, flashcards et examen blanc ; Spirits Niveau 2 arrive très bientôt et le Niveau 3 est en préparation. On commence gratuitement.",
        "Nouveau : cours Spirits, Niveau 1 déjà dans l'appli."),
 'es': ("Novedad: destilados", "Cursos WSET Spirits, Niveles 1, 2 y 3", "Whisky, brandy, ron, destilados de agave, ginebra, licores y cócteles: el mismo método de las cabras, ahora también para destilados.",
        ["Las familias de destilados, cómo se elaboran, las etiquetas y los cócteles clásicos.", "La producción a fondo, los grandes destilados del mundo, licores y familias de cócteles.", "Teoría, respuestas escritas de «explica por qué» y cata a ciegas de destilados."],
        "Ya disponible", "Muy pronto", "En preparación", "Empieza Spirits 1", "Leer la guía →", "Spirits",
        "¿The Wine Goat prepara también los cursos WSET Spirits?", "Sí. Spirits Nivel 1 ya está en la app, con lecciones, preguntas con explicación, tarjetas y examen de prueba; Spirits Nivel 2 llega muy pronto y el Nivel 3 está en preparación. Se empieza gratis.",
        "Novedad: cursos Spirits, Nivel 1 ya en la app."),
 'es-ar': ("Novedad: destilados", "Cursos WSET Spirits, Niveles 1, 2 y 3", "Whisky, brandy, ron, destilados de agave, gin, licores y cócteles: el mismo método de las cabras, ahora también para destilados.",
        ["Las familias de destilados, cómo se elaboran, las etiquetas y los cócteles clásicos.", "La producción a fondo, los grandes destilados del mundo, licores y familias de cócteles.", "Teoría, respuestas escritas de «explicá por qué» y cata a ciegas de destilados."],
        "Ya disponible", "Muy pronto", "En preparación", "Empezá Spirits 1", "Leer la guía →", "Spirits",
        "¿The Wine Goat prepara también los cursos WSET Spirits?", "Sí. Spirits Nivel 1 ya está en la app, con lecciones, preguntas con explicación, tarjetas y examen de prueba; Spirits Nivel 2 llega muy pronto y el Nivel 3 está en preparación. Se empieza gratis.",
        "Novedad: cursos Spirits, Nivel 1 ya en la app."),
 'de': ("Neu: Spirituosen", "WSET-Spirits-Kurse, Level 1, 2 und 3", "Whisky, Brandy, Rum, Agavenbrände, Gin, Liköre und Cocktails: dieselbe Methode mit den Ziegen, jetzt auch für Spirituosen.",
        ["Spirituosenfamilien, Herstellung, Etiketten und klassische Cocktails.", "Herstellung im Detail, die wichtigsten Spirituosen der Welt, Liköre und Cocktailfamilien.", "Theorie, schriftliche „Erkläre warum“-Antworten und Blindverkostung von Spirituosen."],
        "Jetzt verfügbar", "Sehr bald", "In Vorbereitung", "Spirits 1 starten", "Zum Leitfaden →", "Spirits",
        "Bereitet The Wine Goat auch auf die WSET-Spirits-Kurse vor?", "Ja. Spirits Level 1 ist bereits in der App, mit Lektionen, Übungsfragen mit Erklärung, Lernkarten und Probeprüfung; Spirits Level 2 kommt sehr bald, Level 3 ist in Vorbereitung. Der Start ist kostenlos.",
        "Neu: Spirits-Kurse, Level 1 schon in der App."),
 'nl': ("Nieuw: sterke drank", "WSET Spirits-cursussen, Level 1, 2 en 3", "Whisky, brandy, rum, agavedranken, gin, likeuren en cocktails: dezelfde methode met de geitjes, nu ook voor sterke drank.",
        ["Families van sterke drank, hoe ze gemaakt worden, etiketten en klassieke cocktails.", "Productie in detail, de belangrijkste sterke dranken ter wereld, likeuren en cocktailfamilies.", "Theorie, schriftelijke ‘leg uit waarom’-antwoorden en blindproeven van sterke drank."],
        "Nu beschikbaar", "Zeer binnenkort", "In voorbereiding", "Start Spirits 1", "Lees de gids →", "Spirits",
        "Bereidt The Wine Goat ook voor op de WSET Spirits-cursussen?", "Ja. Spirits Level 1 staat al in de app, met lessen, oefenvragen met uitleg, flashcards en een proefexamen; Spirits Level 2 komt zeer binnenkort en Level 3 is in voorbereiding. Je begint gratis.",
        "Nieuw: Spirits-cursussen, Level 1 al in de app."),
 'pl': ("Nowość: alkohole mocne", "Kursy WSET Spirits, poziomy 1, 2 i 3", "Whisky, brandy, rum, destylaty z agawy, gin, likiery i koktajle: ta sama metoda z kozami, teraz także dla alkoholi mocnych.",
        ["Rodziny alkoholi mocnych, jak powstają, etykiety i klasyczne koktajle.", "Produkcja w szczegółach, najważniejsze alkohole świata, likiery i rodziny koktajli.", "Teoria, pisemne odpowiedzi „wyjaśnij dlaczego” i degustacja w ciemno."],
        "Dostępne teraz", "Już wkrótce", "W przygotowaniu", "Zacznij Spirits 1", "Przeczytaj przewodnik →", "Spirits",
        "Czy The Wine Goat przygotowuje też do kursów WSET Spirits?", "Tak. Spirits poziom 1 jest już w aplikacji: lekcje, pytania z wyjaśnieniem, fiszki i egzamin próbny; Spirits poziom 2 pojawi się już wkrótce, a poziom 3 jest w przygotowaniu. Można zacząć za darmo.",
        "Nowość: kursy Spirits, poziom 1 już w aplikacji."),
 'pt': ("Novidade: bebidas espirituosas", "Cursos WSET Spirits, Níveis 1, 2 e 3", "Whisky, brandy, rum, destilados de agave, gin, licores e cocktails: o mesmo método das cabras, agora também para bebidas espirituosas.",
        ["As famílias de bebidas espirituosas, como se fazem, os rótulos e os cocktails clássicos.", "A produção a fundo, as grandes bebidas espirituosas do mundo, licores e famílias de cocktails.", "Teoria, respostas escritas «explique porquê» e prova cega de bebidas espirituosas."],
        "Disponível", "Muito em breve", "Em preparação", "Começar Spirits 1", "Ler o guia →", "Spirits",
        "O The Wine Goat também prepara para os cursos WSET Spirits?", "Sim. O Spirits Nível 1 já está na app, com lições, perguntas com explicação, flashcards e exame simulado; o Spirits Nível 2 chega muito em breve e o Nível 3 está em preparação. Começa-se grátis.",
        "Novidade: cursos Spirits, Nível 1 já na app."),
 'pt-br': ("Novidade: destilados", "Cursos WSET Spirits, Níveis 1, 2 e 3", "Whisky, brandy, rum, destilados de agave, gin, licores e coquetéis: o mesmo método das cabras, agora também para destilados.",
        ["As famílias de destilados, como são feitos, os rótulos e os coquetéis clássicos.", "A produção a fundo, os grandes destilados do mundo, licores e famílias de coquetéis.", "Teoria, respostas escritas de “explique por quê” e degustação às cegas de destilados."],
        "Disponível", "Muito em breve", "Em preparação", "Começar Spirits 1", "Ler o guia →", "Spirits",
        "O The Wine Goat também prepara para os cursos WSET Spirits?", "Sim. O Spirits Nível 1 já está no app, com aulas, questões com explicação, flashcards e simulado; o Spirits Nível 2 chega muito em breve e o Nível 3 está em preparação. Dá para começar grátis.",
        "Novidade: cursos Spirits, Nível 1 já no app."),
 'ru': ("Новое: крепкие напитки", "Курсы WSET Spirits, уровни 1, 2 и 3", "Виски, бренди, ром, напитки из агавы, джин, ликёры и коктейли: тот же метод с козами, теперь и для крепких напитков.",
        ["Семейства крепких напитков, как их делают, этикетки и классические коктейли.", "Производство подробно, главные крепкие напитки мира, ликёры и семейства коктейлей.", "Теория, письменные ответы «объясните почему» и слепая дегустация."],
        "Уже доступно", "Очень скоро", "В подготовке", "Начать Spirits 1", "Читать гид →", "Spirits",
        "Готовит ли The Wine Goat к курсам WSET Spirits?", "Да. Spirits уровень 1 уже в приложении: уроки, вопросы с объяснениями, карточки и пробный экзамен; Spirits уровень 2 появится очень скоро, уровень 3 в подготовке. Начать можно бесплатно.",
        "Новое: курсы Spirits, уровень 1 уже в приложении."),
 'el': ("Νέο: αποστάγματα", "Μαθήματα WSET Spirits, Επίπεδα 1, 2 και 3", "Ουίσκι, μπράντι, ρούμι, αποστάγματα αγαύης, τζιν, λικέρ και κοκτέιλ: η ίδια μέθοδος με τις κατσίκες, τώρα και για τα αποστάγματα.",
        ["Οι οικογένειες αποσταγμάτων, πώς παράγονται, οι ετικέτες και τα κλασικά κοκτέιλ.", "Η παραγωγή σε βάθος, τα σημαντικότερα αποστάγματα του κόσμου, λικέρ και οικογένειες κοκτέιλ.", "Θεωρία, γραπτές απαντήσεις «εξήγησε γιατί» και τυφλή γευσιγνωσία."],
        "Διαθέσιμο τώρα", "Πολύ σύντομα", "Σε προετοιμασία", "Ξεκίνα το Spirits 1", "Διάβασε τον οδηγό →", "Spirits",
        "Προετοιμάζει το The Wine Goat και για τα μαθήματα WSET Spirits;", "Ναι. Το Spirits Επίπεδο 1 είναι ήδη στην εφαρμογή, με μαθήματα, ερωτήσεις με εξήγηση, κάρτες και δοκιμαστική εξέταση· το Επίπεδο 2 έρχεται πολύ σύντομα και το Επίπεδο 3 είναι σε προετοιμασία. Ξεκινάς δωρεάν.",
        "Νέο: μαθήματα Spirits, το Επίπεδο 1 ήδη στην εφαρμογή."),
 'ja': ("新着：スピリッツ", "WSETスピリッツ講座 レベル1・2・3", "ウイスキー、ブランデー、ラム、アガベ・スピリッツ、ジン、リキュール、カクテル。ヤギと学ぶ同じメソッドが、スピリッツにも。",
        ["スピリッツの種類、造り方、ラベル、クラシックカクテル。", "製造の詳細、世界の主要スピリッツ、リキュール、カクテルの系統。", "理論、「理由を説明」する記述問題、スピリッツのブラインドテイスティング。"],
        "提供中", "まもなく公開", "準備中", "Spirits 1を始める", "ガイドを読む →", "スピリッツ",
        "The Wine GoatはWSETスピリッツ講座にも対応していますか？", "はい。Spirits レベル1はすでにアプリにあり、レッスン、解説付き練習問題、フラッシュカード、模擬試験が使えます。レベル2はまもなく、レベル3は準備中です。無料で始められます。",
        "新着：スピリッツ講座、レベル1はアプリで提供中。"),
 'ko': ("새로운 소식: 스피릿", "WSET 스피릿 과정 레벨 1·2·3", "위스키, 브랜디, 럼, 아가베 스피릿, 진, 리큐어, 칵테일까지. 염소와 함께하는 같은 학습법을 이제 스피릿에도.",
        ["스피릿의 종류, 만드는 법, 라벨, 클래식 칵테일.", "심화 제조 과정, 세계의 주요 스피릿, 리큐어와 칵테일 계열.", "이론, '이유를 설명하라' 서술형 답안, 스피릿 블라인드 테이스팅."],
        "이용 가능", "곧 공개", "준비 중", "Spirits 1 시작", "가이드 읽기 →", "스피릿",
        "The Wine Goat는 WSET 스피릿 과정도 준비할 수 있나요?", "네. Spirits 레벨 1은 이미 앱에 있으며 레슨, 해설이 있는 연습 문제, 플래시카드, 모의고사를 제공합니다. 레벨 2는 곧 공개되고 레벨 3은 준비 중입니다. 무료로 시작할 수 있습니다.",
        "새로운 소식: 스피릿 과정, 레벨 1은 앱에서 이용 가능."),
 'zh-hans': ("新内容：烈酒", "WSET 烈酒课程：一级、二级、三级", "威士忌、白兰地、朗姆酒、龙舌兰类烈酒、金酒、利口酒和鸡尾酒：同样的山羊学习法，现在也用于烈酒。",
        ["烈酒的类别、酿造方式、酒标和经典鸡尾酒。", "深入的生产工艺、世界主要烈酒、利口酒和鸡尾酒家族。", "理论、“解释原因”的书面作答和烈酒盲品。"],
        "现已上线", "即将推出", "准备中", "开始 Spirits 1", "阅读指南 →", "烈酒",
        "The Wine Goat 也能备考 WSET 烈酒课程吗？", "可以。Spirits 一级已在应用中，包括课程、带解析的练习题、记忆卡和模拟考试；Spirits 二级即将推出，三级正在准备中。可以免费开始。",
        "新内容：烈酒课程，一级已在应用中。"),
 'zh-hant': ("新內容：烈酒", "WSET 烈酒課程：一級、二級、三級", "威士忌、白蘭地、蘭姆酒、龍舌蘭類烈酒、琴酒、利口酒和調酒：同樣的山羊學習法，現在也用於烈酒。",
        ["烈酒的類別、釀造方式、酒標和經典調酒。", "深入的生產工藝、世界主要烈酒、利口酒和調酒家族。", "理論、「解釋原因」的書面作答和烈酒盲飲。"],
        "現已上線", "即將推出", "準備中", "開始 Spirits 1", "閱讀指南 →", "烈酒",
        "The Wine Goat 也能備考 WSET 烈酒課程嗎？", "可以。Spirits 一級已在應用程式中，包括課程、附解析的練習題、記憶卡和模擬考試；Spirits 二級即將推出，三級正在準備中。可以免費開始。",
        "新內容：烈酒課程，一級已在應用程式中。"),
 'ar': ("جديد: المشروبات الروحية", "دورات WSET للمشروبات الروحية: المستويات 1 و2 و3", "الويسكي والبراندي والروم ومشروبات الأغاف والجن والليكيور والكوكتيلات: الطريقة نفسها مع الماعز، الآن للمشروبات الروحية أيضًا.",
        ["عائلات المشروبات الروحية وطريقة صنعها والملصقات والكوكتيلات الكلاسيكية.", "الإنتاج بالتفصيل وأهم المشروبات الروحية في العالم والليكيور وعائلات الكوكتيل.", "النظرية وإجابات كتابية «اشرح لماذا» وتذوق أعمى للمشروبات الروحية."],
        "متاح الآن", "قريبًا جدًا", "قيد الإعداد", "ابدأ Spirits 1", "اقرأ الدليل ←", "Spirits",
        "هل يحضّر The Wine Goat أيضًا لدورات WSET للمشروبات الروحية؟", "نعم. المستوى 1 من Spirits متاح الآن في التطبيق مع دروس وأسئلة مشروحة وبطاقات وامتحان تجريبي؛ والمستوى 2 قريبًا جدًا والمستوى 3 قيد الإعداد. يمكنك البدء مجانًا.",
        "جديد: دورات Spirits، والمستوى 1 متاح في التطبيق."),
}
GOATS = ['ig-n21.webp', 'ig-n05.webp', 'ig-n26.webp']
A, Z = '<!--spirits-->', '<!--/spirits-->'
for l, d in DIRS.items():
    p = f'{d}/index.html'; s = open(p, encoding='utf8').read(); t = T[l]
    s = re.sub(re.escape(A) + '.*?' + re.escape(Z), '', s, flags=re.S)
    cards = ''
    for n in (1, 2, 3):
        badge = (f'<span class="lbadge on">{e(t[4])}</span>' if n == 1 else f'<span class="lbadge">{e(t[5] if n == 2 else t[6])}</span>')
        btn = f'<a class="b3 b3p sm" href="/app/#lvl=s1">{e(t[7])}</a>' if n == 1 else ''
        cards += (f'<article class="lcard{" live" if n == 1 else ""}"><img class="lgo sway2" src="/img/goats/{GOATS[n - 1]}" alt="" loading="lazy">{badge}<p class="lnum">Spirits <b>{n}</b></p>'
                  f'<p class="ld">{e(t[3][n - 1])}</p><div class="lacts">{btn}<a class="lbl" href="{SL["l" + str(n)][l]}">{e(t[8])}</a></div></article>')
    sec = (f'{A}<section class="sec3 lvl3 sp3" id="spirits"><div class="w"><p class="kick3">{e(t[0])}</p><h2>{e(t[1])}</h2><p class="lead3">{e(t[2])}</p>'
           f'<div class="lgrid">{cards}</div><p class="lead3"><a class="lbl" href="{SL["hub"][l]}">{e(t[1])} →</a></p></div></section>{Z}')
    i = s.find('id="levels"'); j = s.find('</section>', i) + len('</section>')
    assert i > 0, p
    s = s[:j] + sec + s[j:]
    # menu link
    s = re.sub(r'(<ul class="nav3">)', lambda m: m.group(1) + f'{A}<li><a href="#spirits">{e(t[9])}</a></li>{Z}', s, count=1)
    # hero sentence
    s = re.sub(r'(<p class="sub3">)(.*?)(</p>)', lambda m: m.group(1) + m.group(2) + f'{A} {e(t[12])}{Z}' + m.group(3), s, count=1, flags=re.S)
    # FAQ (visible + JSON-LD)
    k = s.rfind('</details>', 0, s.find('class="sec3 fin3"') if 'class="sec3 fin3"' in s else len(s))
    k = s.rfind('</details>', 0, s.find('</section>', s.find('id="faq"'))) + len('</details>')
    s = s[:k] + f'{A}<details class="fq"><summary>{e(t[10])}</summary><p>{e(t[11])}</p></details>{Z}' + s[k:]
    def ld(m):
        try: J = json.loads(m.group(1))
        except Exception: return m.group(0)
        def walk(n):
            if isinstance(n, list): return [walk(x) for x in n]
            if not isinstance(n, dict): return n
            if n.get('@type') == 'FAQPage':
                me = [q for q in n.get('mainEntity', []) if q.get('name') != t[10]]
                n['mainEntity'] = me + [{"@type": "Question", "name": t[10], "acceptedAnswer": {"@type": "Answer", "text": t[11]}}]
            return {kk: walk(v) for kk, v in n.items()}
        return '<script type="application/ld+json">' + json.dumps(walk(J), ensure_ascii=False) + '</script>'
    s = re.sub(r'<script type="application/ld\+json">(.*?)</script>', ld, s, flags=re.S)
    open(p, 'w', encoding='utf8').write(s); print(p, 'ok')
