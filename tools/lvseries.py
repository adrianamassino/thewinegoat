# -*- coding: utf-8 -*-
"""The four complete level guides as a series: Level 1 → Level 2 → Level 3 → Level 4 (Diploma). Idempotent, language-aware hook.

For every site language it links only the guides that exist in THAT language (tools/site_i18n/slugs.json), so a guide
translated later gets its links automatically the next time this runs (it is called by tools/site_i18n/build.py sync,
tools/seo_core/build.py, tools/seo2/lvguide.py, tools/seo2/build.py and tools/seo2/expand.py).

1. A series block <!--lvseries--><nav class="lvseries">…</nav><!--/lvseries--> before the related-links section of:
   the four level guides, /wset-levels-explained/, the wine hub (/wset-wine/ …) and every existing Level 3 page
   (exam format, how to pass, practice questions…), where it is the link up to the complete Level 3 guide.
   Shown only in languages that have the Level 3 guide.
2. Home pages: the Level 3 card's "Read the guide" goes to that language's Level 3 guide (the homes' "All WSET guides"
   section is tools/seo_tech/internal_links.py, which lists the Level 3 guide by itself).
3. Level 1 / Level 2 guides: the "WSET Level 3 →" link under the comparison table goes to the Level 3 guide.
Everything this script inserts sits between <!--lvseries--> markers, which tools/site_i18n/extract.py and build.py strip
before extracting/translating, so the translators' source segments never change because of it.
Run from the repo root:  python3 tools/lvseries.py [--quiet] [--check]"""
import os, re, sys, json, html
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
e = html.escape
SL = json.load(open('tools/site_i18n/slugs.json', encoding='utf8'))
CORE = json.load(open('tools/seo_core/slugs.json', encoding='utf8'))
LANGS = ['en', 'it', 'fr', 'es', 'es-ar', 'de', 'nl', 'pl', 'pt', 'pt-br', 'ru', 'el', 'ja', 'ko', 'zh-hans', 'zh-hant', 'ar', 'th', 'tr']
SERIES = ['wset-level-1', 'wset-level-2', 'wset-level-3', 'wset-diploma-level-4']
L3PAGES = ['wset-level-3-exam-format', 'how-to-pass-wset-level-3', 'wset-level-3-practice-questions', 'wset-level-3-short-answer-questions',
           'wset-level-3-mock-exam', 'wset-level-3-flashcards', 'wset-level-3-grape-varieties', 'wset-3-questions-by-region',
           'wset-systematic-approach-to-tasting', 'wset-level-2-vs-level-3']
A, Z = '<!--lvseries-->', '<!--/lvseries-->'
STRIP = re.compile(re.escape(A) + '.*?' + re.escape(Z), re.S)
HEAD = {'en': 'The complete guides, level by level', 'it': 'Le guide complete, livello per livello', 'fr': 'Les guides complets, niveau par niveau',
        'es': 'Las guías completas, nivel a nivel', 'es-ar': 'Las guías completas, nivel por nivel', 'de': 'Die kompletten Leitfäden, Level für Level',
        'nl': 'De complete gidsen, level per level', 'pl': 'Kompletne przewodniki, poziom po poziomie', 'pt': 'Os guias completos, nível a nível',
        'pt-br': 'Os guias completos, nível por nível', 'ru': 'Полные гиды по уровням', 'el': 'Οι πλήρεις οδηγοί, επίπεδο προς επίπεδο',
        'ja': 'レベル別・完全ガイド', 'ko': '레벨별 완벽 가이드', 'zh-hans': '分级完整指南', 'zh-hant': '分級完整指南',
        'ar': 'الأدلة الكاملة مستوى بمستوى', 'th': 'คู่มือฉบับสมบูรณ์ ทีละระดับ', 'tr': 'Seviye seviye eksiksiz rehberler'}
LVL = {'en': 'Level {n}', 'it': 'Livello {n}', 'fr': 'Niveau {n}', 'es': 'Nivel {n}', 'es-ar': 'Nivel {n}', 'de': 'Level {n}', 'nl': 'Level {n}',
       'pl': 'Poziom {n}', 'pt': 'Nível {n}', 'pt-br': 'Nível {n}', 'ru': 'Уровень {n}', 'el': 'Επίπεδο {n}', 'ja': 'レベル{n}', 'ko': '레벨 {n}',
       'zh-hans': '{n}级', 'zh-hant': '{n}級', 'ar': 'المستوى {n}', 'th': 'ระดับ {n}', 'tr': 'Seviye {n}'}

# the 11 languages added later (tools/site_i18n/newlangs.py)
import sys as _sys, os as _os; _sys.path.insert(0, _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), 'site_i18n')); import newlangs as NL
LANGS += [l for l in NL.LANGS if l not in LANGS]; NL.merge(HEAD, NL.LV_HEAD); NL.merge(LVL, NL.LV_N)
CHANGED, CHECK = [], '--check' in sys.argv


def fs(p): return 'index.html' if p == '/' else p.strip('/') + '/index.html'
def ok(p): return os.path.exists(fs(p))
def home(l): return '/' if l == 'en' else f'/{l}/'
def guide(g, l): return SL.get(g, {}).get(l) if SL.get(g, {}).get(l) and ok(SL[g][l]) else None


def h1(p):
    m = re.search(r'<h1[^>]*>(.*?)</h1>', open(fs(p), encoding='utf8').read(), re.S)
    return html.unescape(re.sub(r'<[^>]+>', '', m.group(1))).strip() if m else ''


def nav(l, cur):
    if not guide('wset-level-3', l): return ''   # the series is shown once the language has its Level 3 guide
    items = []
    for n, g in enumerate(SERIES, 1):
        p = guide(g, l)
        if not p: continue
        lab = LVL[l].format(n=n) + (' · Diploma' if n == 4 else '')
        items.append(f'<li><a href="{p}"' + (' aria-current="page"' if g == cur else '') + f'><span>{e(lab)}</span>{e(h1(p))}</a></li>')
    if len(items) < 2: return ''
    return f'{A}<nav class="lvseries" aria-label="{e(HEAD[l])}"><h2>{e(HEAD[l])}</h2><ol>{"".join(items)}</ol></nav>{Z}'


def write(p, s, o):
    if s != o:
        CHANGED.append(p)
        if not CHECK: open(p, 'w', encoding='utf8').write(s)


def series_block(path, l, cur):
    f = fs(path); s = open(f, encoding='utf8').read(); o = s
    s = STRIP.sub('', s)
    blk = nav(l, cur)
    if blk:
        for anchor in ('<section class="seosec rel"', '</article>'):
            if anchor in s: s = s.replace(anchor, blk + anchor, 1); break
    write(f, s, o)


def homes(l):
    p = home(l)
    if not ok(p): return
    f = fs(p); s = open(f, encoding='utf8').read(); o = s
    s = STRIP.sub('', s)
    g3 = guide('wset-level-3', l); fallback = guide('how-to-pass-wset-level-3', l)
    def card(m):
        c = m.group(0)
        if 'lvl=3' not in c or 'Spirits' in c: return c
        def lbl(mm):
            href = mm.group(2)
            if g3: return mm.group(1) + g3 + mm.group(3)
            if href == SL['wset-level-3']['en'] and fallback: return mm.group(1) + fallback + mm.group(3)   # rebuilt from the English home
            return mm.group(0)
        return re.sub(r'(<a class="lbl" href=")([^"]*)(")', lbl, c, count=1)
    s = re.sub(r'<article class="lcard[^"]*">.*?</article>', card, s, flags=re.S)
    write(f, s, o)


def next_level(l):
    g3 = guide('wset-level-3', l)
    if not g3: return
    old = SL['how-to-pass-wset-level-3'][l]
    for g in ('wset-level-1', 'wset-level-2'):
        p = guide(g, l)
        if not p: continue
        f = fs(p); s = open(f, encoding='utf8').read(); o = s
        s = re.sub(r'(<p class="lvmore">.*?</p>)', lambda m: m.group(1).replace(f'href="{old}"', f'href="{g3}"'), s, count=1, flags=re.S)
        write(f, s, o)


def run():
    for l in LANGS:
        for g in SERIES + ['wset-levels-explained'] + L3PAGES:
            p = guide(g, l)
            if p: series_block(p, l, g)
        w = CORE['wine'].get(l)
        if w and ok(w): series_block(w, l, None)
        homes(l); next_level(l)
    if '--quiet' not in sys.argv or CHECK:
        print(f'lvseries: {len(CHANGED)} page(s) {"would change" if CHECK else "updated"}')
    return 1 if CHECK and CHANGED else 0


if __name__ == '__main__':
    sys.exit(run())
