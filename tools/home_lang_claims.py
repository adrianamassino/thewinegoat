"""Truthful language claims on the 19 home pages (they used to say "4 languages").

Current state: the SITE is in 19 languages; the APP interface is in 14 (it, fr, en, es, es-AR, de, nl, el, ja, ko, zh-Hant, pt,
tr, th); the full lessons/questions are in Italian, French, English and Spanish, more languages being added.

Touches, in each home's language: the hero trust badge (3rd item of ul.trust3), the 4th stat of .stats3, the last row of the
comparison table (table.cmp3), the "which languages?" FAQ (visible <details> + FAQPage JSON-LD), and the sentence about the
app language in the language note shown before opening the app (var N={...} on some homes). Structural and idempotent:
re-reads each file just before editing. Also run by tools/site_i18n/build.py (sync step), so the Thai/Turkish homes rebuilt
from the English home get their own language back even when their translated segments still hold the old English text.

Usage from repo root:  python3 tools/home_lang_claims.py [--quiet] [lang ...]   (default: all 19 homes; English = "en")"""
import json, os, re, sys, html

EN_Q = 'Which languages is it available in?'
# lang: trust badge, (stat number, stat label), comparison row, (FAQ question(s), new answer), [(old, new) in the language note]
C = {
 'en': ('✓ App in 14 languages', ('14', 'app languages'), 'App in 14 languages, full lessons in 4',
        ([EN_Q], 'The site is in 19 languages and the app interface in 14: Italian, French, English, Spanish, Argentine Spanish, German, Dutch, Greek, Japanese, Korean, Traditional Chinese, Portuguese, Turkish and Thai. The full lessons and questions are in Italian, French, English and Spanish, with more languages being added. You can switch at any time: useful if you study in your own language but sit the exam in English.'), []),
 'it': (None, ('14', 'lingue nell\'app'), 'App in 14 lingue, lezioni complete in 4', None, []),
 'fr': (None, ('14', 'langues dans l\'appli'), 'Appli en 14 langues, cours complets en 4', None, []),
 'es': ('✓ App en 14 idiomas', ('14', 'idiomas en la app'), 'App en 14 idiomas, lecciones completas en 4',
        (['¿En qué idiomas está?'], 'La web está en 19 idiomas y la interfaz de la app en 14: italiano, francés, inglés, español, español de Argentina, alemán, neerlandés, griego, japonés, coreano, chino tradicional, portugués, turco y tailandés. Las lecciones y preguntas completas están en español, italiano, francés e inglés, y vamos sumando más idiomas. Puedes cambiar de idioma cuando quieras: útil si vas a hacer el examen en inglés.'), []),
 'es-ar': ('✓ App en 14 idiomas', ('14', 'idiomas en la app'), 'App en 14 idiomas, lecciones completas en 4',
        (['¿En qué idioma está la app?'], 'La interfaz de la app está en 14 idiomas, entre ellos español de Argentina, español, inglés, italiano y francés. Las lecciones y preguntas completas están en español, inglés, italiano y francés, y se van sumando más idiomas. El sitio está en 19 idiomas.'), []),
 'de': ('✓ App in 14 Sprachen', ('14', 'App-Sprachen'), 'App in 14 Sprachen',
        (['In welcher Sprache ist die App?'], 'Die App-Oberfläche gibt es in 14 Sprachen, darunter Deutsch. Die vollständigen Lektionen und Fragen sind auf Italienisch, Französisch, Englisch und Spanisch; weitere Sprachen kommen nach und nach dazu. Die Website ist in 19 Sprachen verfügbar.'),
        [('Die App ist derzeit auf Englisch (und Italienisch, Französisch, Spanisch); die deutsche Version kommt bald.', 'Die App-Oberfläche gibt es schon auf Deutsch; die vollständigen Lektionen und Fragen sind derzeit auf Englisch, Italienisch, Französisch und Spanisch, weitere Sprachen folgen.')]),
 'nl': ('✓ App in 14 talen', ('14', 'app-talen'), 'App in 14 talen',
        (['In welke taal is de app?'], 'De interface van de app is er in 14 talen, waaronder het Nederlands. De volledige lessen en vragen zijn in het Italiaans, Frans, Engels en Spaans; er komen geleidelijk meer talen bij. De website is beschikbaar in 19 talen.'),
        [('De app is nu in het Engels (en Italiaans, Frans, Spaans); de Nederlandse versie volgt.', 'De interface van de app is al in het Nederlands; de volledige lessen en vragen zijn nu in het Engels, Italiaans, Frans en Spaans, en er komen meer talen bij.')]),
 'pl': ('✓ Aplikacja w 14 językach', ('14', 'języków w aplikacji'), 'Aplikacja w 14 językach',
        (['W jakim języku jest aplikacja?'], 'Interfejs aplikacji jest dostępny w 14 językach (m.in. angielskim, włoskim, francuskim, hiszpańskim, niemieckim i japońskim); polskiego jeszcze nie ma. Pełne lekcje i pytania są po angielsku, włosku, francusku i hiszpańsku, a kolejne języki są w przygotowaniu. Strona jest dostępna w 19 językach.'), []),
 'pt': ('✓ App em 14 línguas', ('14', 'línguas na app'), 'App em 14 línguas',
        (['Em que língua está a aplicação?'], 'A interface da app está disponível em 14 línguas, incluindo o português. As lições e perguntas completas estão em italiano, francês, inglês e espanhol, e vamos juntando mais línguas. O site está disponível em 19 línguas.'),
        [('A app está para já em inglês (e italiano, francês, espanhol); a versão portuguesa chega em breve.', 'A interface da app já está em português; as lições e perguntas completas estão para já em inglês, italiano, francês e espanhol, e chegarão mais línguas.')]),
 'pt-br': ('✓ App em 14 idiomas', ('14', 'idiomas no app'), 'App em 14 idiomas',
        (['Em que idioma está o app?'], 'A interface do app está disponível em 14 idiomas, incluindo o português. As lições e perguntas completas estão em italiano, francês, inglês e espanhol, e mais idiomas estão chegando. O site está disponível em 19 idiomas.'),
        [('O exame WSET pode ser oferecido em português, consoante a escola. A app está para já em inglês (e italiano, francês, espanhol); a versão portuguesa chega em breve. Confirme com a sua escola a língua do exame.',
          'A prova da WSET pode ser oferecida em português, dependendo da escola. A interface do app já está em português; as lições e perguntas completas estão por enquanto em inglês, italiano, francês e espanhol, e mais idiomas estão chegando. Confirme com a sua escola o idioma da prova.')]),
 'ru': ('✓ Приложение на 14 языках', ('14', 'языков в приложении'), 'Приложение на 14 языках',
        (['На каком языке приложение?'], 'Интерфейс приложения доступен на 14 языках (среди них английский, итальянский, французский, испанский, немецкий и японский); русского пока нет. Полные уроки и вопросы — на английском, итальянском, французском и испанском, другие языки добавляются. Сайт доступен на 19 языках.'),
        [('Приложение сейчас на английском (а также итальянском, французском, испанском); русская версия в планах.', 'Интерфейс приложения доступен на 14 языках, а полные уроки и вопросы — на английском, итальянском, французском и испанском; русская версия в планах.')]),
 'el': ('✓ Εφαρμογή σε 14 γλώσσες', ('14', 'γλώσσες εφαρμογής'), 'Εφαρμογή σε 14 γλώσσες',
        (['Σε ποια γλώσσα είναι η εφαρμογή;'], 'Το περιβάλλον της εφαρμογής είναι διαθέσιμο σε 14 γλώσσες, μεταξύ των οποίων και τα ελληνικά. Τα πλήρη μαθήματα και οι ερωτήσεις είναι στα ιταλικά, γαλλικά, αγγλικά και ισπανικά, και προστίθενται κι άλλες γλώσσες. Ο ιστότοπος είναι διαθέσιμος σε 19 γλώσσες.'),
        [('Η εφαρμογή είναι προς το παρόν στα αγγλικά (και ιταλικά, γαλλικά, ισπανικά)· η ελληνική έκδοση έρχεται σύντομα.', 'Το περιβάλλον της εφαρμογής είναι ήδη στα ελληνικά· τα πλήρη μαθήματα και οι ερωτήσεις είναι προς το παρόν στα αγγλικά, ιταλικά, γαλλικά και ισπανικά, και έρχονται κι άλλες γλώσσες.')]),
 'ja': ('✓ アプリは14言語対応', ('14', 'アプリ対応言語'), 'アプリは14言語対応',
        (['アプリの言語は？'], 'アプリの画面表示は日本語を含む14言語に対応しています。レッスンと問題の全コンテンツはイタリア語・フランス語・英語・スペイン語で、対応言語を順次追加中です。サイトは19言語でご覧いただけます。'),
        [('アプリは現在英語（およびイタリア語・フランス語・スペイン語）で、日本語版は準備中です。', 'アプリの画面表示は日本語に対応しています。レッスンと問題の全コンテンツは現在英語・イタリア語・フランス語・スペイン語で、日本語は準備中です。')]),
 'ko': ('✓ 앱 14개 언어 지원', ('14', '앱 지원 언어'), '앱 14개 언어 지원',
        (['앱은 어떤 언어인가요?'], '앱 화면은 한국어를 포함해 14개 언어로 제공됩니다. 전체 레슨과 문제는 이탈리아어, 프랑스어, 영어, 스페인어로 제공되며 언어를 계속 추가하고 있습니다. 사이트는 19개 언어로 볼 수 있습니다.'),
        [('앱은 현재 영어(및 이탈리아어·프랑스어·스페인어)이며 한국어 버전을 준비 중입니다.', '앱 화면은 한국어로 제공되며, 전체 레슨과 문제는 현재 영어·이탈리아어·프랑스어·스페인어이고 한국어를 준비 중입니다.')]),
 'zh-hans': ('✓ 应用支持 14 种语言', ('14', '种应用语言'), '应用支持 14 种语言',
        (['应用是什么语言？'], '应用界面支持 14 种语言（包括繁体中文，暂不含简体中文）。完整的课程和题目目前提供意大利语、法语、英语和西班牙语版本，更多语言正在陆续加入。网站提供 19 种语言。'),
        [('应用目前为英文（以及意大利文、法文、西班牙文），中文版正在准备中。', '应用界面支持 14 种语言（含繁体中文），完整课程和题目目前为英文、意大利文、法文和西班牙文，简体中文版正在准备中。')]),
 'zh-hant': ('✓ 應用程式支援 14 種語言', ('14', '種應用程式語言'), '應用程式支援 14 種語言',
        (['應用程式是什麼語言？'], '應用程式介面支援 14 種語言，包括繁體中文。完整的課程和題目目前提供義大利文、法文、英文和西班牙文版本，更多語言正陸續加入。網站提供 19 種語言。'),
        [('應用程式目前為英文（以及義大利文、法文、西班牙文），中文版正在準備中。', '應用程式介面已提供繁體中文；完整課程和題目目前為英文、義大利文、法文和西班牙文，更多語言陸續加入。')]),
 'ar': ('✓ التطبيق بـ14 لغة', ('14', 'لغة في التطبيق'), 'التطبيق بـ14 لغة',
        (['بأي لغة التطبيق؟'], 'واجهة التطبيق متوفرة بـ14 لغة (منها الإنجليزية والإيطالية والفرنسية والإسبانية والألمانية واليابانية)، والعربية ليست منها بعد. الدروس والأسئلة الكاملة متوفرة بالإيطالية والفرنسية والإنجليزية والإسبانية، ونضيف لغات أخرى تدريجيًا. الموقع متوفر بـ19 لغة.'), []),
 'th': ('✓ แอปรองรับ 14 ภาษา', ('14', 'ภาษาในแอป'), 'แอปรองรับ 14 ภาษา',
        (['มีให้ใช้ในภาษาอะไรบ้าง?', EN_Q], 'เว็บไซต์มีให้อ่าน 19 ภาษา และหน้าจอแอปรองรับ 14 ภาษา รวมถึงภาษาไทย ส่วนบทเรียนและข้อสอบฉบับเต็มมีเป็นภาษาอิตาลี ฝรั่งเศส อังกฤษ และสเปน และกำลังเพิ่มภาษาอื่นๆ สลับภาษาได้ตลอดเวลา เหมาะสำหรับคนที่อ่านหนังสือด้วยภาษาของตัวเองแต่สอบเป็นภาษาอังกฤษ'), []),
 'tr': ('✓ Uygulama 14 dilde', ('14', 'uygulama dili'), 'Uygulama 14 dilde',
        (['Hangi dillerde kullanılabiliyor?', EN_Q], 'Site 19 dilde, uygulama arayüzü ise Türkçe dahil 14 dilde. Tam dersler ve sorular İtalyanca, Fransızca, İngilizce ve İspanyolca; yeni diller ekleniyor. Dili istediğin zaman değiştirebilirsin: kendi dilinde çalışıp sınava İngilizce giriyorsan işine yarar.'), []),
}
PATH = lambda l: 'index.html' if l == 'en' else f'{l}/index.html'
e = lambda t: html.escape(t, quote=False)


def transform(s, l):
    trust, (sn, sl), cmp, faq, notes = C[l]
    if 'class="stats3"' not in s and 'stats3' not in s: return s
    if trust:
        s = re.sub(r'(<ul class="trust3">(?:<li>[^<]*</li>){2})<li>[^<]*</li>', lambda m: m.group(1) + f'<li>{e(trust)}</li>', s, count=1)
    s = re.sub(r'(<div class="w stats3">(?:<div class="st"><b>[^<]*</b><span>[^<]*</span></div>){3})<div class="st"><b>[^<]*</b><span>[^<]*</span></div>',
               lambda m: m.group(1) + f'<div class="st"><b>{e(sn)}</b><span>{e(sl)}</span></div>', s, count=1)
    s = re.sub(r'(<table class="cmp3">.*?)<tr><th scope="row">[^<]*</th>(<td class="us">✓</td><td>[^<]*</td></tr></tbody></table>)',
               lambda m: m.group(1) + f'<tr><th scope="row">{e(cmp)}</th>' + m.group(2), s, count=1, flags=re.S)
    if faq:
        qs, a = faq
        for q in qs:
            s = re.sub(r'<summary>' + re.escape(e(q)) + r'</summary><p>[^<]*</p>', lambda m: f'<summary>{e(qs[0])}</summary><p>{e(a)}</p>', s)
            jq = json.dumps(q, ensure_ascii=False)
            s = re.sub(r'"name": ' + re.escape(jq) + r', "acceptedAnswer": \{"@type": "Answer", "text": "(?:[^"\\]|\\.)*"\}',
                       lambda m: f'"name": {json.dumps(qs[0], ensure_ascii=False)}, "acceptedAnswer": {{"@type": "Answer", "text": {json.dumps(a, ensure_ascii=False)}}}', s)
    for old, new in notes:
        s = s.replace(old, new)
    return s


def fix(l):
    p = PATH(l)
    if not os.path.exists(p): return None
    s = open(p, encoding='utf8').read()
    t = transform(s, l)
    if t == s: return False
    open(p, 'w', encoding='utf8').write(t)
    return True


if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    langs = [a for a in sys.argv[1:] if not a.startswith('--')] or list(C)
    res = {l: fix(l) for l in langs}
    if '--quiet' not in sys.argv:
        print(f"language claims: {sum(1 for v in res.values() if v)} homes updated, {sum(1 for v in res.values() if v is False)} already ok"
              + (f", missing: {[l for l, v in res.items() if v is None]}" if None in res.values() else ''))
