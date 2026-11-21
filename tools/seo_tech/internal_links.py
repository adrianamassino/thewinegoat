# -*- coding: utf-8 -*-
"""Internal links: every language version is reachable from its own home, in its own language. Idempotent.
Run from the repo root (the tools/site_i18n/build.py sync runs it on every build, before the sitemaps):

    python3 tools/seo_tech/internal_links.py            # fix what needs fixing
    python3 tools/seo_tech/internal_links.py --check    # change nothing, exit 1 if a page would change
    python3 tools/seo_tech/internal_links.py --report   # change nothing, print the crawl of every language from its home
    options: --quiet

Nothing here is a list kept by hand: "the same page in another language" comes from the hreflang alternates that the
pages themselves carry, and the pages come from the built site (same inventory as tools/seo_tech/sitemaps.py).

1. Links to another language (everywhere except the language menus): when a page of /de/ links to the English, Spanish…
   version of a page that also exists in German, the link is pointed to the German page (and its hreflang="…" hint is
   dropped). Links to a page that has no version in that language are left alone.
2. Every home gets a structured "All WSET guides" section (<!--guidedir--> … <!--/guidedir-->, rebuilt on every run,
   styles in <!--guidedir-css-->): the page families of tools/site_i18n/slugs.json, tools/seo_core/slugs.json and
   tools/seo_sp/slugs.json that exist in that language, grouped (Level 1, 2, 3, Diploma, practice questions, mock
   exams, study guides, how to pass, spirits, schools; a new family is placed by its key, e.g. wset-level-3 → Level 3,
   unknown ones under "More guides"). Link text = the page's own <h1> without its subtitle; group labels in the
   language of the home. The 28 Level 3 region pages are not listed (one click below "questions by region").
   It replaces the older flat "More WSET resources" list of the en/it/fr/es/th/tr homes, so a home never has two
   link blocks. Any page of the language that the home still would not reach is added under "More guides", so
   every indexable page is reachable from its home (tools/seo_tech/audit.py fails otherwise).
3. The footer "For schools" link gets its label in the language of the home."""
import html, json, os, re, sys
from collections import Counter, OrderedDict
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sitemaps as SM

SITE = SM.SITE
A, Z = '<!--guidelinks-->', '<!--/guidelinks-->'
MENUS = re.compile(r'<nav class="seolangs".*?</nav>|<details class="lg3">.*?</details>|<nav class="seolinks wrap intl-links".*?</nav>', re.S)
KEEP = re.compile(r'<head\b.*?</head>|<script\b.*?</script>|<style\b.*?</style>|<template\b.*?</template>|<!--(?!/?guidelinks-->).*?-->|' + MENUS.pattern, re.S | re.I)
ATAG = re.compile(r'<a\b[^>]*>', re.I)
HREF = re.compile(r'\bhref="([^"]*)"')
OWNLIST = re.compile(r'<nav class="seolinks wrap"(?! intl-links)[^>]*>.*?</nav>', re.S)


def home_of(locale): return '/' if locale == 'en' else f'/{locale}/'


def split_href(h):
    """internal href → (path, rest) with rest = ?query#fragment; None for external / non-page links"""
    h = html.unescape(h)
    if h.startswith(SITE): h = h[len(SITE):] or '/'
    if not h.startswith('/') or h.startswith('//'): return None
    m = re.match(r'([^?#]*)(.*)$', h)
    return m.group(1), m.group(2)


class Site:
    def __init__(self):
        self.pages = OrderedDict((d['url'][len(SITE):], d) for d in SM.scan())
        self.html = {}
        self.ver = {}    # path → {locale: path} of the indexable versions of the same page (from the page's own hreflang)
        for p, d in self.pages.items():
            if d['reason'] is not None: continue
            v = {}
            for code, h in d['alts']:
                t = h[len(SITE):] if h.startswith(SITE) else h
                q = self.pages.get(t)
                if code != 'x-default' and q and q['reason'] is None: v.setdefault(q['locale'], t)
            self.ver[p] = v

    def read(self, p):
        if p not in self.html: self.html[p] = open(self.pages[p]['path'], encoding='utf8').read()
        return self.html[p]

    def ok(self, p): return p in self.pages and self.pages[p]['reason'] is None

    def links(self, p):
        """internal page links of the content of p, language menus excluded"""
        s = self.read(p); b = s[s.find('<body'):] if '<body' in s else s
        b = KEEP.sub(' ', b)
        out = []
        for m in ATAG.finditer(b):
            h = HREF.search(m.group(0)); t = split_href(h.group(1)) if h else None
            if t and t[0] in self.pages: out.append(t[0])
        return out

    def crawl(self, locale):
        """{path: clicks from the home} for the pages of one language, following only links that stay in that language"""
        home = home_of(locale)
        if home not in self.pages: return {}
        dist = {home: 0}; q = [home]
        while q:
            x = q.pop(0)
            for y in self.links(x):
                if y not in dist and self.pages[y]['locale'] == locale: dist[y] = dist[x] + 1; q.append(y)
        return dist

    def locales(self):
        return sorted({d['locale'] for d in self.pages.values() if d['reason'] is None}, key=lambda l: (l != 'en', l))

    def members(self, locale):
        return [p for p, d in self.pages.items() if d['locale'] == locale and d['reason'] is None]


def remap(S, p):
    """links of page p to another language → the page's own language when that version exists; returns (html, n)"""
    s = S.read(p); loc = S.pages[p]['locale']; n = 0
    def tag(m):
        nonlocal n
        t = m.group(0)
        if re.search(r'\s(lang|data-lang)=', t): return t      # a deliberate link to another language
        h = HREF.search(t); x = split_href(h.group(1)) if h else None
        if not x or x[0] not in S.pages or S.pages[x[0]]['locale'] == loc: return t
        own = S.ver.get(x[0], {}).get(loc)
        if not own: return t
        n += 1
        t = t[:h.start(1)] + html.escape(own + x[1], quote=True) + t[h.end(1):]
        return re.sub(r'\s+hreflang="[^"]*"', '', t)
    out = []; last = 0
    for m in KEEP.finditer(s):
        out.append(ATAG.sub(tag, s[last:m.start()])); out.append(m.group(0)); last = m.end()
    out.append(ATAG.sub(tag, s[last:]))
    return ''.join(out), n


def h1_of(S, p):
    m = re.search(r'<h1[^>]*>(.*?)</h1>', S.read(p), re.S)
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', m.group(1)))).strip() if m else ''


def short(t):
    """the part of an <h1> before its subtitle ('WSET Level 3 mock exam: free practice test' → 'WSET Level 3 mock exam')"""
    for sep in (': ', '：', ' — ', ' – '):
        if sep in t and len(t.split(sep)[0]) >= 8: return t.split(sep)[0].strip()
    return t


# ---------------------------------------------------------------- "All WSET guides" directory on every home
# category → page groups (keys of tools/site_i18n/slugs.json, tools/seo_core/slugs.json as core:<key>, tools/seo_sp/slugs.json as sp:<key>)
CATS = [
    ('l1', ['wset-level-1', 'wset-level-1-study-guide']),
    ('l2', ['wset-level-2', 'wset-level-2-grapes-and-regions', 'wset-level-2-vs-level-3']),
    ('l3', ['wset-level-3', 'wset-level-3-exam-format', 'wset-level-3-grape-varieties', 'wset-level-3-flashcards', 'wset-systematic-approach-to-tasting']),
    ('dip', ['wset-diploma-level-4', 'wset-diploma-study-tips']),
    ('qs', ['core:practice', 'wset-level-1-practice-questions', 'wset-level-2-practice-questions', 'wset-level-3-practice-questions',
            'wset-level-3-short-answer-questions', 'wset-3-questions-by-region']),
    ('mock', ['core:mock', 'wset-level-3-mock-exam']),
    ('study', ['core:prep', 'core:wine', 'wset-levels-explained', 'core:flashcards', 'core:planner', 'is-wset-worth-it', 'wset-vs-court-of-master-sommeliers']),
    ('pass', ['how-to-pass-wset-level-2', 'how-to-pass-wset-level-3']),
    ('sp', ['sp:hub', 'sp:l1', 'sp:l2', 'sp:l3', 'sp:qs', 'sp:stills', 'sp:cats', 'sp:cocktails']),
    ('school', ['schools']),
    ('more', []),
]
SKIPKEYS = re.compile(r'^wset-3-questions__|^core:(how|faq)$')   # region pages: one click below "questions by region"; app pages: own home block


def cat_of(k):
    for c, ks in CATS:
        if k in ks: return c
    if SKIPKEYS.search(k): return None
    for rx, c in ((r'level-1|level1', 'l1'), (r'level-2', 'l2'), (r'level-3', 'l3'), (r'diploma|level-4', 'dip'), (r'how-to-pass', 'pass'),
                  (r'mock', 'mock'), (r'question|practice', 'qs'), (r'^sp:|spirit', 'sp'), (r'school', 'school')):
        if re.search(rx, k): return c
    return 'more'


T = {  # heading, then the categories in CATS order
 'en': ['All WSET guides', 'WSET Level 1', 'WSET Level 2', 'WSET Level 3', 'WSET Diploma', 'Practice questions', 'Mock exams', 'Study guides', 'How to pass WSET exams', 'WSET Spirits', 'WSET schools and providers', 'More guides'],
 'it': ['Tutte le guide WSET', 'WSET Livello 1', 'WSET Livello 2', 'WSET Livello 3', 'WSET Diploma', 'Domande di esercitazione', "Simulazioni d'esame", 'Guide di studio', 'Come superare gli esami WSET', 'WSET Spirits', 'Scuole e corsi WSET', 'Altre guide'],
 'fr': ['Tous les guides WSET', 'WSET Niveau 1', 'WSET Niveau 2', 'WSET Niveau 3', 'WSET Diploma', "Questions d'entraînement", "Examens blancs", 'Guides de révision', 'Réussir les examens WSET', 'WSET Spirits', 'Écoles et organismes WSET', 'Autres guides'],
 'es': ['Todas las guías WSET', 'WSET Nivel 1', 'WSET Nivel 2', 'WSET Nivel 3', 'WSET Diploma', 'Preguntas de práctica', 'Simulacros de examen', 'Guías de estudio', 'Cómo aprobar los exámenes WSET', 'WSET Spirits', 'Escuelas y centros WSET', 'Más guías'],
 'es-ar': ['Todas las guías WSET', 'WSET Nivel 1', 'WSET Nivel 2', 'WSET Nivel 3', 'WSET Diploma', 'Preguntas de práctica', 'Simulacros de examen', 'Guías de estudio', 'Cómo aprobar los exámenes WSET', 'WSET Spirits', 'Escuelas e institutos WSET', 'Más guías'],
 'de': ['Alle WSET-Leitfäden', 'WSET Level 1', 'WSET Level 2', 'WSET Level 3', 'WSET Diploma', 'Übungsfragen', 'Probeprüfungen', 'Lernleitfäden', 'WSET-Prüfungen bestehen', 'WSET Spirits', 'WSET-Schulen und Anbieter', 'Weitere Leitfäden'],
 'nl': ['Alle WSET-gidsen', 'WSET Level 1', 'WSET Level 2', 'WSET Level 3', 'WSET Diploma', 'Oefenvragen', 'Proefexamens', 'Studiegidsen', 'WSET-examens halen', 'WSET Spirits', 'WSET-scholen en aanbieders', 'Meer gidsen'],
 'pl': ['Wszystkie przewodniki WSET', 'WSET Level 1', 'WSET Level 2', 'WSET Level 3', 'WSET Diploma', 'Pytania ćwiczeniowe', 'Egzaminy próbne', 'Materiały do nauki', 'Jak zdać egzaminy WSET', 'WSET Spirits', 'Szkoły i ośrodki WSET', 'Więcej przewodników'],
 'pt': ['Todos os guias WSET', 'WSET Nível 1', 'WSET Nível 2', 'WSET Nível 3', 'WSET Diploma', 'Perguntas de treino', 'Exames simulados', 'Guias de estudo', 'Como passar nos exames WSET', 'WSET Spirits', 'Escolas e formadores WSET', 'Mais guias'],
 'pt-br': ['Todos os guias WSET', 'WSET Nível 1', 'WSET Nível 2', 'WSET Nível 3', 'WSET Diploma', 'Questões de treino', 'Simulados', 'Guias de estudo', 'Como passar nas provas WSET', 'WSET Spirits', 'Escolas e cursos WSET', 'Mais guias'],
 'ru': ['Все руководства WSET', 'WSET Level 1', 'WSET Level 2', 'WSET Level 3', 'WSET Diploma', 'Тренировочные вопросы', 'Пробные экзамены', 'Учебные материалы', 'Как сдать экзамены WSET', 'WSET Spirits', 'Школы и провайдеры WSET', 'Другие руководства'],
 'el': ['Όλοι οι οδηγοί WSET', 'WSET Level 1', 'WSET Level 2', 'WSET Level 3', 'WSET Diploma', 'Ερωτήσεις εξάσκησης', 'Δοκιμαστικές εξετάσεις', 'Οδηγοί μελέτης', 'Πώς να περάσεις τις εξετάσεις WSET', 'WSET Spirits', 'Σχολές και φορείς WSET', 'Περισσότεροι οδηγοί'],
 'ja': ['WSETガイド一覧', 'WSETレベル1', 'WSETレベル2', 'WSETレベル3', 'WSET Diploma', '練習問題', '模擬試験', '学習ガイド', 'WSET試験の合格法', 'WSET Spirits', 'WSETスクール・認定校', 'その他のガイド'],
 'ko': ['WSET 가이드 전체', 'WSET 레벨 1', 'WSET 레벨 2', 'WSET 레벨 3', 'WSET Diploma', '연습문제', '모의고사', '학습 가이드', 'WSET 시험 합격 전략', 'WSET Spirits', 'WSET 교육기관', '기타 가이드'],
 'zh-hans': ['全部 WSET 指南', 'WSET Level 1', 'WSET Level 2', 'WSET Level 3', 'WSET Diploma', '练习题', '模拟考试', '学习指南', '如何通过 WSET 考试', 'WSET Spirits', 'WSET 学校与课程机构', '更多指南'],
 'zh-hant': ['全部 WSET 指南', 'WSET Level 1', 'WSET Level 2', 'WSET Level 3', 'WSET Diploma', '練習題', '模擬考試', '學習指南', '如何通過 WSET 考試', 'WSET Spirits', 'WSET 學校與課程機構', '更多指南'],
 'ar': ['جميع أدلة WSET', 'WSET المستوى 1', 'WSET المستوى 2', 'WSET المستوى 3', 'WSET Diploma', 'أسئلة تدريبية', 'امتحانات تجريبية', 'أدلة دراسية', 'كيف تجتاز امتحانات WSET', 'WSET Spirits', 'مدارس ومراكز WSET', 'أدلة أخرى'],
 'th': ['คู่มือ WSET ทั้งหมด', 'WSET ระดับ 1', 'WSET ระดับ 2', 'WSET ระดับ 3', 'WSET Diploma', 'ข้อสอบฝึกหัด', 'ข้อสอบจำลอง', 'คู่มือการเรียน', 'วิธีสอบ WSET ให้ผ่าน', 'WSET Spirits', 'โรงเรียนและสถาบัน WSET', 'คู่มืออื่นๆ'],
 'tr': ['Tüm WSET rehberleri', 'WSET Seviye 1', 'WSET Seviye 2', 'WSET Seviye 3', 'WSET Diploma', 'Alıştırma soruları', 'Deneme sınavları', 'Çalışma rehberleri', 'WSET sınavlarını geçmek', 'WSET Spirits', 'WSET okulları ve kurumları', 'Diğer rehberler'],
}
SCHOOL_LABEL = {'en': 'For schools', 'it': 'Per le scuole', 'fr': 'Pour les écoles', 'es': 'Para escuelas', 'es-ar': 'Para escuelas', 'de': 'Für Weinschulen',
                'nl': 'Voor wijnscholen', 'pl': 'Dla szkół', 'pt': 'Para escolas', 'pt-br': 'Para escolas', 'ru': 'Для школ', 'el': 'Για σχολές', 'ja': 'スクール向け',
                'ko': '교육기관용', 'zh-hans': '面向学校', 'zh-hant': '學校專區', 'ar': 'للمدارس', 'th': 'สำหรับโรงเรียน', 'tr': 'Okullar için'}
D0, D1 = '<!--guidedir-->', '<!--/guidedir-->'
C0, C1 = '<!--guidedir-css-->', '<!--/guidedir-css-->'
CSS = (C0 + '<style>.gdir{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(250px,100%),1fr));gap:14px;margin:16px 0 0}'
       '.gdir>div{background:#fff;border:1px solid rgba(94,16,40,.12);border-radius:14px;padding:14px 16px}'
       '.gdir h3{font-size:15px;line-height:1.3;margin:0 0 8px;color:#5e1028}.gdir ul{list-style:none;margin:0;padding:0}'
       '.gdir li{margin:0 0 7px;line-height:1.35}.gdir a{font-size:14.5px;color:inherit;text-decoration:none;border-bottom:1px solid rgba(94,16,40,.2)}'
       '.gdir a:hover{color:#5e1028;border-bottom-color:#5e1028}</style>' + C1)


def families():
    """[(key, {locale: path})] from the slug files, in file order"""
    out = []
    for f, pre in (('tools/site_i18n/slugs.json', ''), ('tools/seo_core/slugs.json', 'core:'), ('tools/seo_sp/slugs.json', 'sp:')):
        if os.path.exists(f):
            out += [(pre + k, v) for k, v in json.load(open(f, encoding='utf8')).items()]
    return out


def directory(S, locale, extra=()):
    """the html of the 'All WSET guides' section of one home (None when the language has no labels yet)"""
    lab = T.get(locale)
    if not lab: return None
    cats = OrderedDict((c, []) for c, _ in CATS)
    order = {k: i for c, ks in CATS for i, k in enumerate(ks)}
    for k, v in families():
        c = cat_of(k); p = v.get(locale)
        if c and p and S.ok(p) and p != home_of(locale): cats[c].append((order.get(k, 99), p))
    for p in extra: cats['more'].append((99, p))
    blocks = []
    for i, (c, items) in enumerate(cats.items()):
        if not items: continue
        ps = [p for _, p in sorted(items, key=lambda x: x[0])]
        labels = [short(h1_of(S, p)) for p in ps]
        li = ''.join(f'<li><a href="{html.escape(p, quote=True)}">{html.escape(t if labels.count(t) == 1 else h1_of(S, p))}</a></li>' for p, t in zip(ps, labels))
        blocks.append(f'<div><h3>{html.escape(lab[i + 1])}</h3><ul>{li}</ul></div>')
    return (f'{D0}<section class="sec3 lvl3" id="wset-guides"><div class="w"><h2>{html.escape(lab[0])}</h2>'
            f'<div class="gdir">{"".join(blocks)}</div></div></section>{D1}')


def strip_generated(s):
    for a, z in ((A, Z), (D0, D1), (C0, C1)): s = re.sub(re.escape(a) + '.*?' + re.escape(z), '', s, flags=re.S)
    return s


def guide_list(S, locale):
    """the home of `locale` with its 'All WSET guides' section, every indexable page of the language reachable from it"""
    home = home_of(locale)
    s = strip_generated(S.read(home))
    s = OWNLIST.sub('', s)   # the older flat 'More WSET resources' list: the directory replaces it (no duplicate block)
    s = re.sub(r'(<a class="fschool"[^>]*>)[^<]*(</a>)', lambda m: m.group(1) + html.escape(SCHOOL_LABEL.get(locale, m.group(0))) + m.group(2), s, count=1) \
        if locale in SCHOOL_LABEL else s
    if '</main>' not in s or locale not in T: S.html[home] = s; return s
    extra = []
    for _ in range(8):
        sec = directory(S, locale, extra)
        i = s.find('<!--/corelinks-->', s.find('id="wset-prep"')) if 'id="wset-prep"' in s else -1   # after the 'prepare for WSET' block
        new = s[:i + 17] + sec + s[i + 17:] if i >= 0 and i < s.find('</main>') else s.replace('</main>', sec + '</main>', 1)
        new = new.replace('</head>', CSS + '</head>', 1)
        S.html[home] = new
        dist = S.crawl(locale)
        miss = sorted(p for p in S.members(locale) if p not in dist and p not in extra)
        if not miss: break
        extra += miss
    return S.html[home]


def report(S):
    rows = []
    for l in S.locales():
        dist = S.crawl(l); mem = S.members(l)
        orph = sorted(p for p in mem if p not in dist)
        c = Counter(dist[p] for p in mem if p in dist)
        rows.append((l, len(mem), len(mem) - len(orph), c, orph))
    return rows


def main():
    os.chdir(SM.ROOT)
    check = '--check' in sys.argv; quiet = '--quiet' in sys.argv
    S = Site()
    if '--report' in sys.argv:
        print('language | indexable pages | reached from its home | 1 click | 2 clicks | 3+ clicks | not reached')
        for l, n, r, c, orph in report(S):
            print(f'{l:8} | {n:3} | {r:3} | {c[1]:3} | {c[2]:3} | {sum(v for k, v in c.items() if k > 2):3} | {len(orph)} {orph[:5]}')
        return 0
    before = {p: S.read(p) for p in S.pages}
    nl = 0
    for p in S.pages:
        if S.pages[p]['reason'] is not None: continue
        s, n = remap(S, p)
        if n: S.html[p] = s; nl += n
    homes = []
    for l in S.locales():
        if home_of(l) not in S.pages: continue
        if D0 in guide_list(S, l): homes.append(l)
    changed = [p for p in S.pages if S.html.get(p, before[p]) != before[p]]
    if not check:
        for p in changed: open(S.pages[p]['path'], 'w', encoding='utf8').write(S.html[p])
    if not quiet or check:
        print(f'internal links: {len(changed)} page(s) {"would change" if check else "updated"} ({nl} link(s) pointed to the page\'s own language; '
              f'"All WSET guides" section on {len(homes)} home(s): {", ".join(homes) or "none"})')
    return 1 if check and changed else 0


if __name__ == '__main__':
    sys.exit(main())
