# -*- coding: utf-8 -*-
"""Conversion buttons in every SEO guide, in every language (idempotent post-processor).

    python3 tools/seo_tech/cta.py            # insert / refresh the blocks
    python3 tools/seo_tech/cta.py --check    # change nothing, exit 1 if a page would change (tools/seo_tech/check_site.sh)
    python3 tools/seo_tech/cta.py --report   # pages and blocks per language (after a run)
    options: --quiet

What it does, on each guide page (wine guides, level guides, core pages, spirits pages, wine maps, level-test page;
never the homes, the schools pages, About, photo credits):
 1. a block near the top, after the introduction (before the first content section): "Take the test" + "Start free";
 2. a block in the middle of long pages, before the heading closest to the middle: "Sign up now";
 3. a block at the end (before the related links): "Sign up now" + "Take the test".
A position that already has an equivalent button to the app is left alone: the buttons under the introduction of the
level guides (top), their "available in the app" banner (middle) and the closing call-to-action box of the other guides
(end, <section class="seocta">). So a page gets at most three calls to action in its text, old and new together.
 4. In the existing closing box, the "start" button is pointed at the level the guide is about (same rule as below).
 5. Diploma pages (wset-diploma-*): the quick level test has nothing to do with the Diploma, so every "test" button there —
    in the blocks above and the builders' own buttons (lvguide under the introduction, app banner, closing box) — opens the
    app's Diploma hub instead (#go=study&lvl=4, where the reader picks the unit), with the label T[l]['unit'] and, in the top
    block, the prompt T[l]['d']. All languages: where the Diploma units are not translated the app shows its default language.

Links: tools/site_i18n/common.app_link → /app/?lang=<page language> when the app speaks it, /app/ otherwise (then the
app opens in its default language), with #go=start (sign-up) or #go=lvquick (quick level test) and the level of the
guide as &lvl= (1, 2, 3; 4 for the Diploma where the Diploma units are in the app; s1 for the spirits pages, as their
builder does). The quick level test (go=lvquick) runs on the same level; general pages give no level.

Wording: T below, one entry per language. Rules of the owner: never a price, a discount or a plan; never any
affiliation with WSET; never "official" questions.

Everything inserted sits between <!--gcta--> … <!--/gcta--> markers, which tools/site_i18n/extract.py and build.py strip
(the blocks are language-specific and are never translated from the English page). Run after any page builder: the
builders and the sync step of tools/site_i18n/build.py call it. CSS: .gcta in assets/seo.css."""
import os, re, sys, json, html

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
os.chdir(ROOT)
sys.path.insert(0, os.path.join(ROOT, 'tools', 'site_i18n'))
import common as C

e = html.escape
A, Z = '<!--gcta-->', '<!--/gcta-->'
CHECK = '--check' in sys.argv
QUIET = '--quiet' in sys.argv
LONG = 15000          # characters of article HTML from which a page counts as long (≈ 1,500 English words)
LONG_L = {'ja': 9000, 'ko': 10000, 'zh-hans': 8000, 'zh-hant': 8000}   # denser scripts
DIPLOMA_APP = {'en', 'it', 'fr', 'es', 'es-ar'}   # languages in which the Diploma units of the app exist (app/l4)

# test = "Take the test", start = "Start free", signup = "Sign up now"; a = level-test prompt, b = practice prompt, c = sign-up prompt
T = {
 'en': {'test': 'Take the test', 'start': 'Start free', 'signup': 'Sign up now',
        'a': 'How ready are you? Check your level with a quick test.',
        'b': 'Turn what you have just read into practice: questions with explanations, at your own pace.',
        'c': 'Ready to begin? Create your account and follow a study plan built around your exam date.'},
 'it': {'test': 'Fai il test', 'start': 'Inizia gratis', 'signup': 'Iscriviti ora',
        'a': 'A che punto sei? Scoprilo con un test rapido di livello.',
        'b': 'Metti in pratica quello che hai appena letto: domande con spiegazioni, al tuo ritmo.',
        'c': 'Si parte? Crea il tuo account e segui un piano di studio costruito sulla data del tuo esame.'},
 'fr': {'test': 'Faire le test', 'start': 'Commencer gratuitement', 'signup': "S'inscrire maintenant",
        'a': 'Où en êtes-vous ? Faites le point avec un test de niveau rapide.',
        'b': 'Passez à la pratique : des questions expliquées, à votre rythme.',
        'c': 'Envie de vous lancer ? Créez votre compte et suivez un plan de révision calé sur la date de votre examen.'},
 'es': {'test': 'Haz el test', 'start': 'Empieza gratis', 'signup': 'Regístrate ahora',
        'a': '¿Cómo vas de nivel? Compruébalo con un test rápido.',
        'b': 'Pon en práctica lo que acabas de leer: preguntas con explicación, a tu ritmo.',
        'c': '¿Empezamos? Crea tu cuenta y sigue un plan de estudio hecho a la medida de tu fecha de examen.'},
 'es-ar': {'test': 'Hacé el test', 'start': 'Empezá gratis', 'signup': 'Registrate ahora',
           'a': '¿Cómo venís de nivel? Comprobalo con un test rápido.',
           'b': 'Poné en práctica lo que acabás de leer: preguntas con explicación, a tu ritmo.',
           'c': '¿Arrancamos? Creá tu cuenta y seguí un plan de estudio armado según tu fecha de examen.'},
 'de': {'test': 'Test machen', 'start': 'Kostenlos starten', 'signup': 'Jetzt registrieren',
        'a': 'Wie gut bist du vorbereitet? Finde es mit einem kurzen Einstufungstest heraus.',
        'b': 'Übe gleich, was du gerade gelesen hast: Fragen mit Erklärungen, in deinem Tempo.',
        'c': 'Bereit loszulegen? Erstelle dein Konto und lerne mit einem Plan, der auf deinen Prüfungstermin abgestimmt ist.'},
 'nl': {'test': 'Doe de test', 'start': 'Gratis beginnen', 'signup': 'Meld je nu aan',
        'a': 'Hoe ver ben je? Ontdek het met een korte niveautest.',
        'b': 'Oefen meteen wat je net hebt gelezen: vragen met uitleg, in je eigen tempo.',
        'c': 'Klaar om te beginnen? Maak je account aan en volg een studieplan dat op je examendatum is afgestemd.'},
 'pl': {'test': 'Zrób test', 'start': 'Zacznij za darmo', 'signup': 'Zarejestruj się teraz',
        'a': 'Na jakim etapie jesteś? Sprawdź to w krótkim teście poziomu.',
        'b': 'Przećwicz ten materiał: pytania z wyjaśnieniami, we własnym tempie.',
        'c': 'Czas zacząć? Załóż konto i ucz się według planu dopasowanego do terminu egzaminu.'},
 'pt': {'test': 'Faz o teste', 'start': 'Começa grátis', 'signup': 'Regista-te agora',
        'a': 'Em que ponto estás? Descobre com um teste de nível rápido.',
        'b': 'Põe em prática o que acabaste de ler: perguntas com explicação, ao teu ritmo.',
        'c': 'Vamos começar? Cria a tua conta e segue um plano de estudo feito à medida da data do teu exame.'},
 'pt-br': {'test': 'Faça o teste', 'start': 'Comece grátis', 'signup': 'Cadastre-se agora',
           'a': 'Como está o seu nível? Descubra com um teste rápido.',
           'b': 'Coloque em prática o que você acabou de ler: questões com explicação, no seu ritmo.',
           'c': 'Vamos começar? Crie sua conta e siga um plano de estudos montado para a data da sua prova.'},
 'ru': {'test': 'Пройти тест', 'start': 'Начать бесплатно', 'signup': 'Зарегистрироваться',
        'a': 'Насколько вы готовы? Узнайте это с помощью короткого теста на уровень.',
        'b': 'Закрепите прочитанное на практике: вопросы с объяснениями, в удобном темпе.',
        'c': 'Пора начинать? Создайте аккаунт и занимайтесь по плану, составленному под дату вашего экзамена.'},
 'el': {'test': 'Κάνε το τεστ', 'start': 'Ξεκίνα δωρεάν', 'signup': 'Κάνε εγγραφή τώρα',
        'a': 'Σε ποιο επίπεδο βρίσκεσαι; Μάθε το με ένα σύντομο τεστ.',
        'b': 'Κάνε πράξη όσα μόλις διάβασες: ερωτήσεις με εξηγήσεις, στον δικό σου ρυθμό.',
        'c': 'Ξεκινάμε; Φτιάξε τον λογαριασμό σου και ακολούθησε ένα πλάνο μελέτης προσαρμοσμένο στην ημερομηνία της εξέτασής σου.'},
 'ja': {'test': 'テストを受ける', 'start': '無料で始める', 'signup': '今すぐ登録',
        'a': '今の実力はどのくらい？短いレベルテストで確認しましょう。',
        'b': '読んだ内容を解説付きの問題で練習しましょう。自分のペースで進められます。',
        'c': '準備はできましたか？アカウントを作成して、試験日に合わせた学習プランで進めましょう。'},
 'ko': {'test': '테스트 하기', 'start': '무료로 시작하기', 'signup': '지금 가입하기',
        'a': '지금 실력은 어느 정도일까요? 짧은 레벨 테스트로 확인해 보세요.',
        'b': '방금 읽은 내용을 해설이 있는 문제로 연습해 보세요. 내 속도에 맞춰 진행할 수 있어요.',
        'c': '시작할 준비가 되셨나요? 계정을 만들고 시험일에 맞춘 학습 계획을 따라가 보세요.'},
 'zh-hans': {'test': '参加测试', 'start': '免费开始', 'signup': '立即注册',
             'a': '你现在的水平如何？做个快速水平测试就知道。',
             'b': '把刚读到的内容练起来：带解析的练习题，按自己的节奏学习。',
             'c': '准备好开始了吗？创建账号，按照根据考试日期制定的学习计划备考。'},
 'zh-hant': {'test': '參加測驗', 'start': '免費開始', 'signup': '立即註冊',
             'a': '你現在的程度如何？做個快速程度測驗就知道。',
             'b': '把剛讀到的內容練起來：附解析的練習題，按自己的節奏學習。',
             'c': '準備好開始了嗎？建立帳號，依照根據考試日期制定的學習計畫備考。'},
 'ar': {'test': 'ابدأ الاختبار', 'start': 'ابدأ مجانًا', 'signup': 'سجّل الآن',
        'a': 'ما مستواك الآن؟ اكتشفه باختبار سريع لتحديد المستوى.',
        'b': 'طبّق ما قرأته للتو: أسئلة مع شروح، بالوتيرة التي تناسبك.',
        'c': 'هل حان وقت البدء؟ أنشئ حسابك واتبع خطة دراسة مبنية على موعد امتحانك.'},
 'th': {'test': 'ทำแบบทดสอบ', 'start': 'เริ่มใช้ฟรี', 'signup': 'สมัครเลย',
        'a': 'ตอนนี้คุณพร้อมแค่ไหน ลองวัดระดับด้วยแบบทดสอบสั้น ๆ',
        'b': 'ฝึกสิ่งที่เพิ่งอ่านด้วยข้อสอบพร้อมคำอธิบาย ตามจังหวะของคุณเอง',
        'c': 'พร้อมเริ่มหรือยัง สร้างบัญชีแล้วเรียนตามแผนที่จัดให้ตรงกับวันสอบของคุณ'},
 'tr': {'test': 'Testi çöz', 'start': 'Ücretsiz başla', 'signup': 'Hemen kaydol',
        'a': 'Ne kadar hazırsın? Kısa bir seviye testiyle öğren.',
        'b': 'Az önce okuduklarını pratiğe dök: açıklamalı sorular, kendi hızında.',
        'c': 'Başlamaya hazır mısın? Hesabını oluştur ve sınav tarihine göre hazırlanan çalışma planını takip et.'},
}
# Diploma pages: the app button opens the Diploma hub, where the reader picks the unit (D1, D2…), instead of the quick level test.
# unit = button label, d = prompt line above it
for _l, (_u, _d) in {
 'en': ('Choose your unit', 'Pick the Diploma unit you are preparing and study it with lessons, questions and written answers.'),
 'it': ('Scegli il modulo', 'Scegli il modulo del Diploma che stai preparando e studialo con lezioni, domande e risposte scritte.'),
 'fr': ('Choisir votre module', 'Choisissez le module du Diploma que vous préparez et travaillez-le avec des leçons, des questions et des réponses rédigées.'),
 'es': ('Elige tu módulo', 'Elige el módulo del Diploma que estás preparando y estúdialo con lecciones, preguntas y respuestas escritas.'),
 'es-ar': ('Elegí tu módulo', 'Elegí el módulo del Diploma que estás preparando y estudialo con lecciones, preguntas y respuestas escritas.'),
 'de': ('Modul wählen', 'Wähle das Diploma-Modul, auf das du dich vorbereitest, und lerne es mit Lektionen, Fragen und schriftlichen Antworten.'),
 'nl': ('Kies je module', 'Kies de Diploma-module waarvoor je studeert en oefen die met lessen, vragen en schriftelijke antwoorden.'),
 'pl': ('Wybierz moduł', 'Wybierz moduł Diploma, do którego się przygotowujesz, i ucz się go z lekcjami, pytaniami i odpowiedziami pisemnymi.'),
 'pt': ('Escolhe o teu módulo', 'Escolhe o módulo do Diploma que estás a preparar e estuda-o com lições, perguntas e respostas escritas.'),
 'pt-br': ('Escolha seu módulo', 'Escolha o módulo do Diploma que você está preparando e estude com aulas, questões e respostas escritas.'),
 'ru': ('Выбрать модуль', 'Выберите модуль Diploma, к которому готовитесь, и изучайте его по урокам, вопросам и письменным ответам.'),
 'el': ('Διάλεξε ενότητα', 'Διάλεξε την ενότητα του Diploma που προετοιμάζεις και μελέτησέ τη με μαθήματα, ερωτήσεις και γραπτές απαντήσεις.'),
 'ja': ('ユニットを選ぶ', '準備中のDiplomaのユニットを選び、レッスン、問題、記述式の解答で学習しましょう。'),
 'ko': ('유닛 선택하기', '준비 중인 Diploma 유닛을 골라 레슨, 문제, 서술형 답안으로 공부해 보세요.'),
 'zh-hans': ('选择单元', '选择你正在备考的 Diploma 单元，通过课程、练习题和书面作答来学习。'),
 'zh-hant': ('選擇單元', '選擇你正在準備的 Diploma 單元，透過課程、練習題和書面作答來學習。'),
 'ar': ('اختر الوحدة', 'اختر وحدة الدبلوم التي تستعد لها وادرسها بالدروس والأسئلة والإجابات المكتوبة.'),
 'th': ('เลือกหน่วยการเรียน', 'เลือกหน่วยของ Diploma ที่คุณกำลังเตรียมสอบ แล้วเรียนด้วยบทเรียน คำถาม และการตอบแบบเขียน'),
 'tr': ('Üniteni seç', 'Hazırlandığın Diploma ünitesini seç; dersler, sorular ve yazılı cevaplarla çalış.'),
}.items():
    T[_l].update(unit=_u, d=_d)
BANNED = re.compile(r'[€$£]|\bofficial|\bufficial|\bofficiel|\boficial|offiziell|officieel|oficjaln|официальн|επίσημ|公式|공식|官方|رسمي|ทางการ|resmi\b', re.I)


def level_of(family, key, lang):
    """app level of a guide: '1' '2' '3' '4' 's1' or None (general pages)"""
    if family == 'sp': return 's1'                      # as tools/seo_sp/build.py (the spirits level every app language has)
    if family != 'guide': return None
    if key.startswith('wset-diploma'): return '4' if lang in DIPLOMA_APP else None
    if key == 'wset-level-2-vs-level-3': return None
    if key.startswith('wset-level-1'): return '1'
    if key.startswith('wset-level-2') or key == 'how-to-pass-wset-level-2': return '2'
    if key.startswith(('wset-level-3', 'wset-3-questions')) or key in ('how-to-pass-wset-level-3', 'wset-systematic-approach-to-tasting'): return '3'
    return None


def pages():
    """[(file, lang, family, key)] of every guide page that exists"""
    out = []
    fams = [('guide', 'tools/site_i18n/slugs.json', {'schools'}), ('core', 'tools/seo_core/slugs.json', set()),
            ('sp', 'tools/seo_sp/slugs.json', set()), ('geo', 'tools/geo/slugs.json', {'about'})]
    for fam, f, skip in fams:
        if not os.path.exists(f): continue
        for key, c in json.load(open(f, encoding='utf8')).items():
            if key in skip: continue
            for l, u in c.items():
                p = u.strip('/') + '/index.html'
                if l in T and os.path.exists(p): out.append((p, l, fam, key))
    return out


def is_diploma(family, key):
    return family == 'guide' and key.startswith('wset-diploma')


DIPLOMA_HUB = '#go=study&lvl=4'   # the app's Diploma hub (unit tabs D1, D2…): every language, the app falls back to its default language


def links(l, lvl, dipl=False):
    start = C.app_link(l, '#go=start' + (f'&lvl={lvl}' if lvl else ''))
    if dipl: return start, C.app_link(l, DIPLOMA_HUB)
    test = C.app_link(l, '#go=lvquick' + (f'&lvl={lvl}' if lvl else ''))   # the app's 20-question test runs on the level given (checked: 1, 2, 3, 4, s1)
    return start, test


def block(pos, l, lvl, dipl=False):
    t = dict(T[l]); start, test = links(l, lvl, dipl)
    if dipl: t['test'], t['a'] = t['unit'], t['d']
    b = lambda cls, href, txt, k: f'<a class="btn {cls}" href="{e(href)}" data-cta="{pos}-{k}">{e(txt)}</a>'
    if pos == 'top':
        if test: p, btns = t['a'], b('btn-primary', test, t['test'], 'test') + b('btn-ghost', start, t['start'], 'start')
        else: p, btns = t['b'], b('btn-primary', start, t['start'], 'start')
    elif pos == 'mid':
        p, btns = (t['b'] if test else t['c']), b('btn-primary', start, t['signup'], 'signup')
    else:
        p, btns = t['c'], b('btn-gold', start, t['signup'], 'signup') + (b('btn-light', test, t['test'], 'test') if test else '')
    return f'{A}<div class="gcta gcta-{pos}"><p>{e(p)}</p><div class="ctas">{btns}</div></div>{Z}'


APPBTN = re.compile(r'<a class="btn[^"]*" href="/app/')
DIPBTN = re.compile(r'(<a class="btn[^"]*" href=")/app/[^"#]*#go=(?:lvquick|study)\b[^"]*("[^>]*)>[^<]*</a>')


def spans(s, pat):
    return [(m.start(), m.end()) for m in re.finditer(pat, s, re.S)]


def process(doc, l, fam, key):
    """(new document, positions added)"""
    doc = re.sub(re.escape(A) + '.*?' + re.escape(Z), '', doc, flags=re.S)
    lvl = level_of(fam, key, l); dipl = is_diploma(fam, key)
    start, hub = links(l, lvl, dipl)
    # 5. Diploma pages: every other app button to the quick level test (builder buttons, app banner, closing box) opens the Diploma hub
    if dipl:
        doc = DIPBTN.sub(lambda m: f'{m.group(1)}{e(hub)}{m.group(2)}>{e(T[l]["unit"])}</a>', doc)
    # 4. the existing closing box: its start button opens the app in the page's language, on the guide's level
    if lvl and fam != 'sp':
        def box(m):
            return re.sub(r'href="/app/(?:\?lang=[a-z-]+)?#go=start(?:&(?:amp;)?lvl=[1-4])?"', f'href="{e(start)}"', m.group(0))
        doc = re.sub(r'<section class="seocta".*?</section>', box, doc, flags=re.S)
    a = doc.find('<article'); m_ = doc.find('</main>', a); z = doc.rfind('</article>', a, m_ if m_ > 0 else len(doc))   # the outer article (question cards are articles too)
    if a < 0 or z < 0: return doc, []
    art = doc[a:z]; n = len(art)
    first = art.find('<section class="seosec')
    if first < 0: return doc, []
    rel = art.find('<section class="seosec rel"')
    endpos = rel if rel > 0 else n
    if art.rfind('<!--lvseries-->', 0, endpos) >= 0 and art[art.rfind('<!--lvseries-->', 0, endpos):endpos].endswith('<!--/lvseries-->'):
        endpos = art.rfind('<!--lvseries-->', 0, endpos)   # stay above the "guides by level" block that precedes the related links
    btns = [m.start() for m in APPBTN.finditer(art)]
    ins = {}
    if not any(x < first for x in btns): ins['top'] = first
    if not any(x > 0.6 * n for x in btns): ins['end'] = endpos
    if n >= LONG_L.get(l, LONG) and not any(0.2 * n <= x <= 0.6 * n for x in btns):
        lo = first; hi = min([x for x in btns if x > first] + [ins.get('end', n)])
        closed = spans(art, r'<nav\b.*?</nav>|<section class="(?:seocta|lvsoon)".*?</section>|<!--lvseries-->.*?<!--/lvseries-->|<details\b.*?</details>')
        best = None
        for m in re.finditer(r'(?:<!--more-->)?(?:<section class="seosec[^"]*">)?<h2>', art):
            x = m.start()
            if not (lo + 0.12 * n < x < hi - 0.12 * n) or any(s < x < t for s, t in closed): continue
            d = abs(x - (lo + 0.45 * (hi - lo)))
            if best is None or d < best[0]: best = (d, x)
        if best: ins['mid'] = best[1]
    for pos, x in sorted(ins.items(), key=lambda kv: -kv[1]):
        art = art[:x] + block(pos, l, lvl, dipl) + art[x:]
    return doc[:a] + art + doc[z:], sorted(ins)


def main():
    for l, t in T.items():
        for k, v in t.items():
            assert not BANNED.search(v), (l, k, v)
        assert {'unit', 'd'} <= set(t), l
    changed, rep = [], {}
    for p, l, fam, key in pages():
        s = open(p, encoding='utf8').read()
        new, added = process(s, l, fam, key)
        r = rep.setdefault(l, {'pages': 0, 'top': 0, 'mid': 0, 'end': 0})
        if added: r['pages'] += 1
        for k in added: r[k] += 1
        if new != s:
            changed.append(p)
            if not CHECK: open(p, 'w', encoding='utf8').write(new)
    if '--report' in sys.argv:
        print(f'{"lang":8} {"pages":>5} {"top":>5} {"mid":>5} {"end":>5} {"blocks":>6}')
        for l, r in rep.items(): print(f'{l:8} {r["pages"]:5} {r["top"]:5} {r["mid"]:5} {r["end"]:5} {r["top"] + r["mid"] + r["end"]:6}')
        tot = {k: sum(r[k] for r in rep.values()) for k in ('pages', 'top', 'mid', 'end')}
        print(f'{"TOTAL":8} {tot["pages"]:5} {tot["top"]:5} {tot["mid"]:5} {tot["end"]:5} {tot["top"] + tot["mid"] + tot["end"]:6}')
    if not QUIET or (CHECK and changed):
        print(f'cta: {len(changed)} page(s) {"would change" if CHECK else "updated"}' + (': ' + ', '.join(changed[:8]) if CHECK and changed else ''))
    if CHECK and changed: sys.exit(1)


if __name__ == '__main__':
    main()
