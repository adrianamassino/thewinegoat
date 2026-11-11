# -*- coding: utf-8 -*-
"""Home: 'level session' block — 50 mixed questions or 50 written questions, straight into the app; the result is unlocked with a free account."""
import html
from icons import ICON
e = lambda s: html.escape(str(s), quote=True)
# kicker, title, sub, mixed title, mixed desc, open title, open desc, button, lock note, minutes
L = {
 'en': ('Level session', 'How ready are you? Find out now', 'Take a full session in exam conditions, then create your free account to see your score and weak points.', '50 mixed questions', 'Every topic of the syllabus, multiple choice, like the theory paper.', '50 written questions', 'Short written answers marked like the exam, key point by key point.', 'Start', 'Result unlocked with a free account', 'min'),
 'it': ('Sessione di livello', 'Quanto sei pronto? Scoprilo adesso', "Fai una sessione completa in condizioni d'esame, poi crea l'account gratuito per vedere punteggio e punti deboli.", '50 domande miste', "Tutti gli argomenti del programma, a scelta multipla, come la prova teorica.", '50 domande aperte', "Risposte scritte corrette come all'esame, punto chiave per punto chiave.", 'Inizia', "Risultato visibile con l'account gratuito", 'min'),
 'fr': ('Session de niveau', 'Êtes-vous prêt ? Découvrez-le maintenant', "Faites une session complète en conditions d'examen, puis créez votre compte gratuit pour voir votre score et vos points faibles.", '50 questions mixtes', "Tous les thèmes du programme, en QCM, comme l'épreuve théorique.", '50 questions ouvertes', "Réponses rédigées corrigées comme à l'examen, point clé par point clé.", 'Commencer', 'Résultat visible avec le compte gratuit', 'min'),
 'es': ('Sesión de nivel', '¿Qué tan preparado estás? Descúbrelo ahora', 'Haz una sesión completa en condiciones de examen y crea tu cuenta gratuita para ver tu puntuación y tus puntos débiles.', '50 preguntas mixtas', 'Todos los temas del programa, tipo test, como la prueba teórica.', '50 preguntas abiertas', 'Respuestas escritas corregidas como en el examen, punto clave por punto clave.', 'Empezar', 'Resultado visible con la cuenta gratuita', 'min'),
 'de': ('Level-Session', 'Wie bereit bist du? Finde es jetzt heraus', 'Mach eine komplette Session unter Prüfungsbedingungen und erstelle dann dein kostenloses Konto, um Ergebnis und Schwächen zu sehen.', '50 gemischte Fragen', 'Alle Themen des Lehrplans, Multiple Choice wie im Theorieteil.', '50 offene Fragen', 'Kurze schriftliche Antworten, bewertet wie in der Prüfung.', 'Starten', 'Ergebnis mit kostenlosem Konto', 'Min.'),
 'nl': ('Niveausessie', 'Hoe klaar ben je? Ontdek het nu', 'Doe een volledige sessie in examenomstandigheden en maak daarna je gratis account om je score en zwakke punten te zien.', '50 gemengde vragen', 'Alle onderwerpen van het programma, meerkeuze zoals het theorie-examen.', '50 open vragen', 'Korte geschreven antwoorden, beoordeeld zoals op het examen.', 'Starten', 'Resultaat met gratis account', 'min'),
 'pt': ('Sessão de nível', 'Quão preparado está? Descubra já', 'Faça uma sessão completa em condições de exame e crie a sua conta gratuita para ver a pontuação e os pontos fracos.', '50 perguntas mistas', 'Todos os temas do programa, escolha múltipla, como a prova teórica.', '50 perguntas abertas', 'Respostas escritas corrigidas como no exame, ponto-chave a ponto-chave.', 'Começar', 'Resultado visível com a conta gratuita', 'min'),
 'pt-br': ('Sessão de nível', 'Você está pronto? Descubra agora', 'Faça uma sessão completa em condições de prova e crie sua conta gratuita para ver sua nota e seus pontos fracos.', '50 perguntas mistas', 'Todos os temas do programa, múltipla escolha, como a prova teórica.', '50 perguntas abertas', 'Respostas escritas corrigidas como na prova, ponto-chave por ponto-chave.', 'Começar', 'Resultado visível com a conta gratuita', 'min'),
 'el': ('Συνεδρία επιπέδου', 'Πόσο έτοιμος είσαι; Μάθε το τώρα', 'Κάνε μια πλήρη συνεδρία σε συνθήκες εξέτασης και δημιούργησε δωρεάν λογαριασμό για να δεις βαθμό και αδύναμα σημεία.', '50 μικτές ερωτήσεις', 'Όλα τα θέματα της ύλης, πολλαπλής επιλογής.', '50 ανοιχτές ερωτήσεις', 'Γραπτές απαντήσεις με διόρθωση όπως στην εξέταση.', 'Έναρξη', 'Αποτέλεσμα με δωρεάν λογαριασμό', "λεπτά"),
 'ja': ('レベル診断セッション', 'どれくらい準備できている？今すぐチェック', '本番と同じ条件でセッションを受け、無料アカウントを作成するとスコアと弱点が見られます。', '総合問題 50問', 'シラバス全範囲の選択式問題。', '記述問題 50問', '本番と同じ採点の短い記述問題。', 'スタート', '無料アカウントで結果を表示', '分'),
 'ko': ('레벨 세션', '얼마나 준비됐나요? 지금 확인하세요', '실전과 같은 조건으로 세션을 풀고 무료 계정을 만들면 점수와 약점을 볼 수 있어요.', '종합 문제 50개', '전 범위 객관식 문제.', '서술형 문제 50개', '시험처럼 채점되는 짧은 서술형 답안.', '시작', '무료 계정으로 결과 확인', '분'),
 'zh-hans': ('水平测试', '你准备好了吗？现在就测一测', '在考试条件下完成一整套测试，创建免费账户即可查看分数和薄弱环节。', '50道综合题', '覆盖全部考纲的选择题。', '50道简答题', '像考试一样逐个要点批改。', '开始', '创建免费账户查看结果', '分钟'),
 'zh-hant': ('程度測驗', '你準備好了嗎？現在就測一測', '在考試條件下完成整套測驗，建立免費帳戶即可查看分數和弱點。', '50題綜合題', '涵蓋全部考綱的選擇題。', '50題簡答題', '像考試一樣逐個重點批改。', '開始', '建立免費帳戶查看結果', '分鐘'),
 'pl': ('Sesja poziomu', 'Na ile jesteś gotowy? Sprawdź teraz', 'Zrób pełną sesję w warunkach egzaminu, a potem załóż darmowe konto, aby zobaczyć wynik i słabe punkty.', '50 pytań mieszanych', 'Wszystkie tematy programu, test wyboru jak w części teoretycznej.', '50 pytań otwartych', 'Krótkie odpowiedzi pisemne oceniane jak na egzaminie.', 'Zacznij', 'Wynik po założeniu darmowego konta', 'min'),
 'ar': ('جلسة تحديد المستوى', 'ما مدى استعدادك؟ اكتشف الآن', 'أكمل جلسة كاملة في ظروف الامتحان، ثم أنشئ حسابك المجاني لرؤية نتيجتك ونقاط ضعفك.', '50 سؤالًا متنوعًا', 'جميع مواضيع المنهج، اختيار من متعدد.', '50 سؤالًا مقاليًا', 'إجابات مكتوبة تُصحَّح كما في الامتحان.', 'ابدأ', 'النتيجة متاحة بحساب مجاني', 'دقيقة'),
 'ru': ('Сессия уровня', 'Насколько вы готовы? Узнайте сейчас', 'Пройдите полную сессию в условиях экзамена, затем создайте бесплатный аккаунт, чтобы увидеть результат и слабые места.', '50 смешанных вопросов', 'Все темы программы, вопросы с выбором ответа.', '50 открытых вопросов', 'Короткие письменные ответы с проверкой как на экзамене.', 'Начать', 'Результат — с бесплатным аккаунтом', 'мин'),
}
L['es-ar'] = L['es']

def render(c, img, app):
    k, t, s, mt, md, ot, od, go, lock, mn = L.get(c, L['en'])
    card = lambda ic, ti, ds, mins, href, goat: (
        f'<a class="lvc" href="{app}#go={href}"><img class="lvg sway2" src="{img}/goats/{goat}" alt="" loading="lazy">'
        f'<span class="fic">{ICON[ic]}</span><h3>{e(ti)}</h3><p>{e(ds)}</p>'
        f'<span class="lvmeta"><b>50</b> · ~{mins} {e(mn)}</span><span class="b3 b3p lvgo">{e(go)} →</span></a>')
    return (f'<section class="sec3 lv3" id="level"><div class="w"><p class="kick3">{e(k)}</p><h2>{e(t)}</h2><p class="lead3">{e(s)}</p>'
            f'<div class="lvgrid">{card("game", mt, md, 75, "lvmix", "ig-n13.webp")}{card("pen", ot, od, 120, "lvopen", "exam.webp")}</div>'
            f'<p class="lvlock"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg> {e(lock)}</p></div></section>')

CSS = r"""
.lv3{text-align:center}.lv3 .lead3{max-width:640px;margin-left:auto;margin-right:auto}
.lvgrid{display:grid;grid-template-columns:1fr 1fr;gap:22px;max-width:900px;margin:28px auto 0;text-align:left}
.lvc{position:relative;display:flex;flex-direction:column;gap:6px;padding:22px 22px 20px;border-radius:20px;background:#fff;color:inherit;text-decoration:none;box-shadow:inset 0 0 0 1px #eadfd3,0 18px 40px -30px rgba(62,15,34,.5);transition:transform .2s,box-shadow .2s}
.lvc:hover{transform:translateY(-3px);box-shadow:inset 0 0 0 1.5px #b8892e,0 24px 44px -28px rgba(62,15,34,.55)}
.lvc h3{margin:8px 0 0;font-size:22px}.lvc p{margin:0;color:#6b5a5f;max-width:80%}
.lvmeta{margin-top:8px;font-weight:700;color:#8a7a80}.lvmeta b{font:800 24px/1 Fraunces,Georgia,serif;color:#5c1630}
.lvgo{align-self:flex-start;margin-top:12px}
.lvg{position:absolute;right:12px;top:12px;width:78px;height:auto}
.lvlock{display:flex;align-items:center;justify-content:center;gap:8px;margin:18px 0 0;color:#8a7a80;font-weight:600}
@media (max-width:760px){.lvgrid{grid-template-columns:1fr}.lvc p{max-width:72%}}
"""
