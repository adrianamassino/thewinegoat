# -*- coding: utf-8 -*-
"""Home pages (17 languages): a 'prepare for WSET' block linking the 8 core pages (hub, wine, mock exams, practice questions,
flashcards, study planner, how it works, FAQ), placed after the Spirits section. Idempotent. Run after tools/seo_core/build.py."""
import json, re, html, os, sys
sys.path.insert(0, 'tools/seo_core')
e = html.escape
SL = json.load(open('tools/seo_core/slugs.json', encoding='utf8'))
DIRS = {'en': '.', 'it': 'it', 'fr': 'fr', 'es': 'es', 'es-ar': 'es-ar', 'de': 'de', 'nl': 'nl', 'pl': 'pl', 'pt': 'pt', 'pt-br': 'pt-br', 'ru': 'ru', 'el': 'el', 'ja': 'ja', 'ko': 'ko', 'zh-hans': 'zh-hans', 'zh-hant': 'zh-hant', 'ar': 'ar', 'th': 'th', 'tr': 'tr'}
H = {'en': 'Prepare for your WSET exam', 'it': "Prepara il tuo esame WSET", 'fr': 'Préparez votre examen WSET', 'es': 'Prepara tu examen WSET', 'es-ar': 'Prepará tu examen WSET',
     'de': 'Bereite dich auf deine WSET-Prüfung vor', 'nl': 'Bereid je WSET-examen voor', 'pl': 'Przygotuj się do egzaminu WSET', 'pt': 'Prepare o seu exame WSET', 'pt-br': 'Prepare-se para a prova WSET',
     'ru': 'Подготовка к экзамену WSET', 'el': 'Προετοιμασία για την εξέταση WSET', 'ja': 'WSET試験対策', 'ko': 'WSET 시험 준비', 'zh-hans': 'WSET 考试准备', 'zh-hant': 'WSET 考試準備', 'ar': 'التحضير لامتحان WSET', 'th': 'เตรียมสอบ WSET', 'tr': 'WSET sınavına hazırlan'}
A, Z = '<!--corelinks-->', '<!--/corelinks-->'
for l, d in DIRS.items():
    cp = f'tools/seo_core/content/{l}.json' if l != 'en' else None
    C = json.load(open(cp, encoding='utf8')) if cp and os.path.exists(cp) else None
    if l == 'en':
        C = {}; [C.update(json.load(open(f'tools/seo_core/content/{f}.json', encoding='utf8'))) for f in ('en_a', 'en_b')]
    if not C or not os.path.exists('.' + SL['prep'][l] + 'index.html') or not os.path.exists(f'{d}/index.html'): continue
    p = f'{d}/index.html'; s = open(p, encoding='utf8').read()
    s = re.sub(re.escape(A) + '.*?' + re.escape(Z), '', s, flags=re.S)
    li = ''.join(f'<li><a href="{SL[k][l]}">{e(C[k]["h1"])}</a></li>' for k in SL)
    sec = f'{A}<section class="sec3 lvl3" id="wset-prep"><div class="w"><h2>{e(H[l])}</h2><ul class="rel-l corel">{li}</ul></div></section>{Z}'
    if '<!--/spirits-->' in s and 'id="spirits"' in s:
        i = s.find('id="spirits"'); j = s.find('<!--/spirits-->', i) + len('<!--/spirits-->')
    else:
        i = s.find('id="levels"'); j = s.find('</section>', i) + len('</section>')
    s = s[:j] + sec + s[j:]
    s = s.replace('</head>', A + '<style>.corel{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px 18px;list-style:none;padding:0;margin:14px 0 0}.corel a{display:block;padding:12px 14px;border-radius:12px;background:#fff;border:1px solid rgba(94,16,40,.12);color:#5e1028;font-weight:600;text-decoration:none}.corel a:hover{border-color:#8a1c3f}</style>' + Z + '</head>', 1)
    open(p, 'w', encoding='utf8').write(s); print(l, 'ok')
