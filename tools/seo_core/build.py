# -*- coding: utf-8 -*-
"""Core SEO pages (WSET preparation hub, wine hub, mock exams, practice questions, flashcards, study planner, how it works, FAQ)
in every site language. Content: tools/seo_core/content/<lang>.json (en = en_a.json + en_b.json); slugs: tools/seo_core/slugs.json.
Builds the pages with full hreflang (only languages that have content), Article + Breadcrumb + FAQPage (+ Quiz on the
practice page) schema, then updates llms.txt and llms-full.txt and rebuilds the sitemaps (tools/seo_tech/sitemaps.py). Idempotent.
Run from the repo root:  python3 tools/seo_core/build.py"""
import json, os, re, html, glob
e = html.escape
SITE = 'https://thewinegoat.com'; DATE = '2026-11-18'; ROOT = os.getcwd(); D = 'tools/seo_core'
SL = json.load(open(f'{D}/slugs.json', encoding='utf8'))
KEYS = list(SL)
ALL = ['en', 'it', 'fr', 'es', 'es-ar', 'de', 'nl', 'pl', 'pt', 'pt-br', 'ru', 'el', 'ja', 'ko', 'zh-hans', 'zh-hant', 'ar', 'th', 'tr']
HOME = {l: '/' if l == 'en' else f'/{l}/' for l in ALL}
APPL = {'it': 'it', 'fr': 'fr', 'en': 'en', 'es': 'es', 'es-ar': 'es'}
APPL.update({l: l for l in ALL if l not in APPL and os.path.exists(f'app/i18n/{l}.js')})  # app language added later (app/i18n/<lang>.js)
LNAME = {'en': 'English', 'it': 'Italiano', 'fr': 'Français', 'es': 'Español', 'es-ar': 'Español (AR)', 'de': 'Deutsch', 'nl': 'Nederlands', 'pl': 'Polski', 'pt': 'Português',
         'pt-br': 'Português (BR)', 'ru': 'Русский', 'el': 'Ελληνικά', 'ja': '日本語', 'ko': '한국어', 'zh-hans': '简体中文', 'zh-hant': '繁體中文', 'ar': 'العربية', 'th': 'ไทย', 'tr': 'Türkçe'}
HREF = {'zh-hans': 'zh-Hans', 'zh-hant': 'zh-Hant', 'es-ar': 'es-AR', 'pt-br': 'pt-BR'}
# UI: home, faq, more, start (app on Spirits 1), all (app), btn, updated, short, show answer, answer, why, spirits hub label
UI = {
 'en': ('Home', 'Frequently asked questions', 'More spirits guides', 'Start Spirits Level 1 free', 'Open the app', 'Start free', 'Updated', 'In short', 'Show the answer', 'Answer:', 'Why:'),
 'it': ('Home', 'Domande frequenti', 'Altre guide sui distillati', 'Inizia Spirits 1 gratis', "Apri l'app", 'Inizia gratis', 'Aggiornato il', 'In breve', 'Mostra la risposta', 'Risposta:', 'Perché:'),
 'fr': ('Accueil', 'Questions fréquentes', 'Autres guides spiritueux', 'Commencer Spirits 1 gratuitement', "Ouvrir l'appli", 'Commencer gratuitement', 'Mis à jour le', 'En bref', 'Voir la réponse', 'Réponse :', 'Pourquoi :'),
 'es': ('Inicio', 'Preguntas frecuentes', 'Más guías de destilados', 'Empieza Spirits 1 gratis', 'Abrir la app', 'Empieza gratis', 'Actualizado el', 'En resumen', 'Ver la respuesta', 'Respuesta:', 'Por qué:'),
 'es-ar': ('Inicio', 'Preguntas frecuentes', 'Más guías de destilados', 'Empezá Spirits 1 gratis', 'Abrir la app', 'Empezá gratis', 'Actualizado el', 'En resumen', 'Ver la respuesta', 'Respuesta:', 'Por qué:'),
 'de': ('Start', 'Häufige Fragen', 'Weitere Spirituosen-Leitfäden', 'Spirits Level 1 kostenlos starten', 'App öffnen', 'Kostenlos starten', 'Aktualisiert am', 'Kurz gesagt', 'Antwort zeigen', 'Antwort:', 'Warum:'),
 'nl': ('Home', 'Veelgestelde vragen', 'Meer gidsen over sterke drank', 'Gratis beginnen met Spirits 1', 'App openen', 'Gratis beginnen', 'Bijgewerkt op', 'In het kort', 'Antwoord tonen', 'Antwoord:', 'Waarom:'),
 'pl': ('Start', 'Najczęstsze pytania', 'Więcej przewodników o alkoholach', 'Zacznij Spirits 1 za darmo', 'Otwórz aplikację', 'Zacznij za darmo', 'Aktualizacja', 'W skrócie', 'Pokaż odpowiedź', 'Odpowiedź:', 'Dlaczego:'),
 'pt': ('Início', 'Perguntas frequentes', 'Mais guias de bebidas espirituosas', 'Comece o Spirits 1 grátis', 'Abrir a app', 'Comece grátis', 'Atualizado a', 'Em resumo', 'Ver a resposta', 'Resposta:', 'Porquê:'),
 'pt-br': ('Início', 'Perguntas frequentes', 'Mais guias de destilados', 'Comece o Spirits 1 grátis', 'Abrir o app', 'Comece grátis', 'Atualizado em', 'Em resumo', 'Ver a resposta', 'Resposta:', 'Por quê:'),
 'ru': ('Главная', 'Частые вопросы', 'Другие гиды по крепким напиткам', 'Начать Spirits 1 бесплатно', 'Открыть приложение', 'Начать бесплатно', 'Обновлено', 'Коротко', 'Показать ответ', 'Ответ:', 'Почему:'),
 'el': ('Αρχική', 'Συχνές ερωτήσεις', 'Περισσότεροι οδηγοί για αποστάγματα', 'Ξεκίνα το Spirits 1 δωρεάν', 'Άνοιξε την εφαρμογή', 'Ξεκίνα δωρεάν', 'Ενημέρωση', 'Με λίγα λόγια', 'Δείξε την απάντηση', 'Απάντηση:', 'Γιατί:'),
 'ja': ('ホーム', 'よくある質問', 'スピリッツのガイドをもっと見る', 'Spirits 1を無料で始める', 'アプリを開く', '無料で始める', '更新日', '要点', '答えを見る', '答え：', '理由：'),
 'ko': ('홈', '자주 묻는 질문', '스피릿 가이드 더 보기', 'Spirits 1 무료로 시작', '앱 열기', '무료로 시작', '업데이트', '요약', '정답 보기', '정답:', '이유:'),
 'zh-hans': ('首页', '常见问题', '更多烈酒指南', '免费开始 Spirits 1', '打开应用', '免费开始', '更新于', '要点', '查看答案', '答案：', '原因：'),
 'zh-hant': ('首頁', '常見問題', '更多烈酒指南', '免費開始 Spirits 1', '開啟應用程式', '免費開始', '更新於', '重點', '查看答案', '答案：', '原因：'),
 'ar': ('الرئيسية', 'الأسئلة الشائعة', 'المزيد من أدلة المشروبات الروحية', 'ابدأ Spirits 1 مجانًا', 'افتح التطبيق', 'ابدأ مجانًا', 'آخر تحديث', 'باختصار', 'اعرض الإجابة', 'الإجابة:', 'السبب:'),
 'th': ('หน้าแรก', 'คำถามที่พบบ่อย', 'คู่มือสุราเพิ่มเติม', 'เริ่ม Spirits 1 ฟรี', 'เปิดแอป', 'เริ่มใช้ฟรี', 'อัปเดตเมื่อ', 'สรุปสั้น ๆ', 'ดูคำตอบ', 'คำตอบ:', 'เหตุผล:'),
 'tr': ('Ana sayfa', 'Sık sorulan sorular', 'Diğer distile içki rehberleri', 'Spirits 1’e ücretsiz başla', 'Uygulamayı aç', 'Ücretsiz başla', 'Güncellendi', 'Kısaca', 'Cevabı göster', 'Cevap:', 'Neden:'),
}
MORE = {'en': 'More WSET preparation tools', 'it': 'Altri strumenti per preparare il WSET', 'fr': 'Autres outils pour préparer le WSET', 'es': 'Más herramientas para preparar el WSET',
 'es-ar': 'Más herramientas para preparar el WSET', 'de': 'Weitere Hilfen zur WSET-Vorbereitung', 'nl': 'Meer hulpmiddelen voor je WSET-voorbereiding', 'pl': 'Więcej narzędzi do przygotowań do WSET',
 'pt': 'Mais ferramentas para preparar o WSET', 'pt-br': 'Mais ferramentas para se preparar para o WSET', 'ru': 'Другие инструменты подготовки к WSET', 'el': 'Περισσότερα εργαλεία προετοιμασίας για το WSET',
 'ja': 'WSET対策ツールをもっと見る', 'ko': 'WSET 준비 도구 더 보기', 'zh-hans': '更多 WSET 备考工具', 'zh-hant': '更多 WSET 備考工具', 'ar': 'المزيد من أدوات التحضير لامتحانات WSET',
 'th': 'เครื่องมือเตรียมสอบ WSET เพิ่มเติม', 'tr': 'WSET hazırlığı için diğer araçlar'}
UI = {k: v + (MORE[k],) for k, v in UI.items()}
DISC = {
 'en': 'The Wine Goat is an independent exam preparation platform, not affiliated with, endorsed or sponsored by the Wine &amp; Spirit Education Trust. WSET® is a registered trademark of the Wine &amp; Spirit Education Trust, mentioned only to identify the exam being prepared for.',
 'it': "The Wine Goat è una piattaforma indipendente di preparazione agli esami, non affiliata, approvata o sponsorizzata dal Wine &amp; Spirit Education Trust. WSET® è un marchio registrato del Wine &amp; Spirit Education Trust, citato solo per indicare l'esame.",
 'fr': "The Wine Goat est une plateforme indépendante de préparation aux examens, non affiliée au Wine &amp; Spirit Education Trust, ni approuvée ni sponsorisée par lui. WSET® est une marque déposée du Wine &amp; Spirit Education Trust, citée uniquement pour désigner l'examen.",
 'es': 'The Wine Goat es una plataforma independiente de preparación de exámenes, no afiliada, avalada ni patrocinada por el Wine &amp; Spirit Education Trust. WSET® es una marca registrada del Wine &amp; Spirit Education Trust, citada solo para indicar el examen.'}
for l in ALL:
    if l not in DISC and not os.path.exists(f'{l}/index.html'): DISC[l] = DISC['en']  # no home yet: the language is skipped below
    elif l not in DISC:
        m = re.search(r'<p class="fd3">(.*?)</p>', open(f'{l}/index.html', encoding='utf8').read(), re.S); DISC[l] = m.group(1).strip()
OG = {'it': 'og-it', 'fr': 'og-fr', 'es': 'og-es', 'es-ar': 'og-es'}

def load(l):
    if l == 'en':
        C = {}
        for f in ('en_a', 'en_b'):
            p = f'{D}/content/{f}.json'
            if os.path.exists(p): C.update(json.load(open(p, encoding='utf8')))
        return C if all(k in C for k in KEYS) else None
    p = f'{D}/content/{l}.json'
    if not os.path.exists(p): return None
    C = json.load(open(p, encoding='utf8'))
    return C if all(k in C for k in KEYS) else None

def extend(l, C):
    """<lang>_x.json: extra sections (and FAQ) appended to each page — the long-form part of every page"""
    p = f'{D}/content/{l}_x.json'
    if not C or not os.path.exists(p): return C
    X = json.load(open(p, encoding='utf8'))
    for k, v in X.items():
        if k in C:
            C[k]['body'] = C[k]['body'] + v.get('body', [])
            C[k]['faq'] = C[k]['faq'] + [q for q in v.get('faq', []) if q[0] not in {a for a, _ in C[k]['faq']}]
    return C
CONTENT = {l: c for l in ALL if (l == 'en' or os.path.exists(f'{l}/index.html')) and (c := extend(l, load(l)))}  # a language needs its home page
LANGS = [l for l in ALL if l in CONTENT]

def short(t, n):
    if len(t) <= n: return t
    cut = t.rfind('. ', 0, n - 1)
    if cut >= n * .6: return t[:cut + 1]
    cut = t.rfind(' ', 0, n - 4); return (t[:cut] if cut > 0 else t[:n - 1]).rstrip(',;:–- ') + '…'

def block(b, U):
    k = b[0]
    if k in ('h2', 'h3'): return f'<{k}>{e(b[1])}</{k}>'
    if k == 'p': return f'<p>{e(b[1])}</p>'
    if k in ('ul', 'ol'): return f'<{k} class="tips">' + ''.join(f'<li>{e(x)}</li>' for x in b[1]) + f'</{k}>'
    if k == 'table':
        head, rows = b[1], b[2]
        t = '<div class="tblw"><table class="lvtab"><thead><tr>' + ''.join(f'<th>{e(h)}</th>' for h in head) + '</tr></thead><tbody>'
        for r in rows:
            t += '<tr>' + ''.join((f'<th scope="row">{e(c)}</th>' if i == 0 else f'<td data-l="{e(head[i] if i < len(head) else "")}">{e(c)}</td>') for i, c in enumerate(r)) + '</tr>'
        return t + '</tbody></table></div>'
    if k == 'qs':
        out = '<div class="sqs">'
        for n, (q, opts, ok, why) in enumerate(b[1], 1):
            out += f'<article class="sq"><h3><span class="sqn">{n}</span> {e(q)}</h3><ol class="sq-os" type="A">' + ''.join(f'<li><button type="button" class="sq-o" data-ok="{1 if i == ok else 0}">{e(o)}</button></li>' for i, o in enumerate(opts)) + '</ol>'
            out += f'<details class="sq-a"><summary>{e(U[8])}</summary><p><strong>{e(U[9])}</strong> {e(opts[ok])}</p><p><strong>{e(U[10])}</strong> {e(why)}</p></details></article>'
        return out + '</div>'
    if k == 'tip': return f'<p class="tipbox">{e(b[1])}</p>'
    raise ValueError(k)

def text_len(C):
    out = []
    for b in C['body']:
        if b[0] in ('p', 'h2', 'h3', 'tip'): out.append(b[1])
        elif b[0] in ('ul', 'ol'): out += b[1]
        elif b[0] == 'table': out += [' '.join(r) for r in b[2]]
        elif b[0] == 'qs': out += [q[0] + ' ' + q[3] for q in b[1]]
    return len(' '.join(out).split())

def page(key, l):
    C = CONTENT[l][key]; U = UI[l]; slug = SL[key][l]; url = SITE + slug
    title = short(C['title'], 65); desc = short(C['desc'], 160)
    alts = ''.join(f'<link rel="alternate" hreflang="{HREF.get(x, x)}" href="{SITE}{SL[key][x]}">' for x in LANGS) + f'<link rel="alternate" hreflang="x-default" href="{SITE}{SL[key]["en"]}">'
    app = f'/app/?lang={APPL[l]}' if l in APPL else '/app/'
    img = f'{SITE}/img/{OG.get(l, "og-en")}.png'
    graph = [
        {"@type": "Article", "@id": url + "#article", "headline": C['h1'], "description": desc, "inLanguage": HREF.get(l, l), "datePublished": DATE, "dateModified": DATE,
         "mainEntityOfPage": url, "author": {"@id": SITE + "/#org"}, "publisher": {"@id": SITE + "/#org"}, "image": img, "wordCount": text_len(C),
         "about": [{"@type": "Thing", "name": "WSET qualifications"}, {"@type": "Thing", "name": "Wine education"}], "abstract": C.get('tldr') or desc,
         "speakable": {"@type": "SpeakableSpecification", "cssSelector": [".tldr", "h1"]}},
        {"@type": "Organization", "@id": SITE + "/#org", "name": "The Wine Goat", "url": SITE + "/", "logo": SITE + "/img/logo.png"},
        {"@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": U[0], "item": SITE + HOME[l]},
            *([{"@type": "ListItem", "position": 2, "name": CONTENT[l]['prep']['h1'], "item": SITE + SL['prep'][l]}] if key != 'prep' else []),
            {"@type": "ListItem", "position": 2 if key == 'prep' else 3, "name": C['h1']}]},
        {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in C['faq']]}]
    qs = [b for b in C['body'] if b[0] == 'qs']
    if qs:
        graph.append({"@type": "Quiz", "name": C['h1'], "inLanguage": HREF.get(l, l), "about": {"@type": "Thing", "name": "Wine and spirits"}, "educationalLevel": "beginner to intermediate",
                      "hasPart": [{"@type": "Question", "eduQuestionType": "Multiple choice", "text": q, "acceptedAnswer": {"@type": "Answer", "text": o[ok]},
                                   "suggestedAnswer": [{"@type": "Answer", "text": x} for i, x in enumerate(o) if i != ok]} for q, o, ok, why in qs[0][1]]})
    ld = {"@context": "https://schema.org", "@graph": graph}
    langs = ''.join(f'<a href="{SL[key][x]}" hreflang="{HREF.get(x, x)}" lang="{HREF.get(x, x)}">{LNAME[x]}</a>' for x in LANGS)
    body = f'<div class="tldr" role="note"><b>{e(U[7])}</b><p>{e(C.get("tldr") or desc)}</p><small>{e(U[6])} {DATE} · The Wine Goat</small></div>'
    body += ''.join(f'<p class="lead">{e(x)}</p>' for x in C['lead'])
    body += '<section class="seosec">' + ''.join(block(b, U) for b in C['body']) + '</section>'
    body += (f'<section class="seocta"><img src="/img/goats/goat-laughing-in-wine-barrel-with-two-glasses.webp" alt="The Wine Goat" width="200" height="231" loading="lazy"><div><h2>{e(C["cta"][0])}</h2><p>{e(C["cta"][1])}</p>'
             f'<div class="ctas"><a class="btn btn-gold" href="{app}">{e(U[5])}</a><a class="btn btn-light" href="{app}">{e(U[4])}</a></div></div></section>')
    body += f'<section class="seosec"><h2>{e(U[1])}</h2>' + ''.join(f'<details class="faqi"><summary>{e(q)}</summary><p>{e(a)}</p></details>' for q, a in C['faq']) + '</section>'
    rel = [(SL[k2][l], CONTENT[l][k2]['h1']) for k2 in KEYS if k2 != key]
    body += f'<section class="seosec rel"><h2>{e(U[11])}</h2><ul class="rel-l">' + ''.join(f'<li><a href="{h}">{e(t)}</a></li>' for h, t in rel) + '</ul></section>'
    crumbs = f'<li><a href="{HOME[l]}">{e(U[0])}</a></li>' + (f'<li><a href="{SL["prep"][l]}">{e(CONTENT[l]["prep"]["h1"])}</a></li>' if key != 'prep' else '') + f'<li aria-current="page">{e(C["h1"])}</li>'
    dirattr = ' dir="rtl"' if l == 'ar' else ''
    doc = f'''<!DOCTYPE html>
<html lang="{HREF.get(l, l)}"{dirattr}>
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<meta name="keywords" content="{e(C.get('kw', ''))}">
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large">
<link rel="canonical" href="{url}">{alts}
<meta property="og:type" content="article"><meta property="og:site_name" content="The Wine Goat"><meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(desc)}"><meta property="og:url" content="{url}"><meta property="og:locale" content="{HREF.get(l, l).replace('-', '_')}"><meta property="og:image" content="{img}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:image" content="{img}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{e(title)}"><meta name="twitter:description" content="{e(desc)}">
<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" href="/img/favicon-48.png" type="image/png" sizes="48x48"><link rel="icon" href="/img/favicon-192.png" type="image/png" sizes="192x192"><link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
<link rel="stylesheet" href="/assets/site.css"><link rel="stylesheet" href="/assets/seo.css">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
</head><body class="seo"><header class="top"><div class="wrap nav">
<a class="brand" href="{HOME[l]}"><img class="emb" src="/img/logo-emblem.webp" alt="" width="360" height="410"><img class="wm" src="/img/wordmark.webp" alt="The Wine Goat" width="752" height="294"></a>
<nav class="seolangs" aria-label="Language">{langs}</nav>
<a class="btn btn-primary btn-sm" href="{app}">{e(U[5])}</a></div></header>
<main><nav class="crumbs" aria-label="Breadcrumb"><ol>{crumbs}</ol></nav><article class="wrap seo-a"><h1>{e(C['h1'])}</h1>{body}</article></main><footer class="foot"><div class="wrap"><p class="fdisc">{DISC[l]}</p><p>© 2026 The Wine Goat · <a href="{HOME[l]}">thewinegoat.com</a> · {e(U[6])} {DATE}</p></div></footer><script src="/assets/seo.js" defer></script><script src="/assets/deco.js?v=8" defer></script></body></html>
'''
    out = ROOT + slug + 'index.html'
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, 'w', encoding='utf8').write(doc)
    return text_len(C)

words = {l: [page(k, l) for k in KEYS] for l in LANGS}

# llms.txt / llms-full.txt (English + list of languages)
if 'en' in CONTENT:
    E = CONTENT['en']
    lt = re.sub(r'\n## WSET preparation tools and hubs.*?(?=\n## |\Z)', '', open('llms.txt', encoding='utf8').read(), flags=re.S)
    lt = lt.rstrip() + '\n\n## WSET preparation tools and hubs\n' + ''.join(f'- [{E[k]["h1"]}]({SITE}{SL[k]["en"]}): {short(E[k]["desc"], 160)}\n' for k in KEYS) + \
         f'Also available in: {", ".join(LNAME[x] for x in LANGS if x != "en")} (same paths under /<lang>/, see hreflang).\n'
    open('llms.txt', 'w', encoding='utf8').write(lt)
    def txt(C):
        o = [C['tldr']] + C['lead']
        for b in C['body']:
            if b[0] == 'h2': o.append('\n### ' + b[1])
            elif b[0] in ('p', 'tip', 'h3'): o.append(b[1])
            elif b[0] in ('ul', 'ol'): o += ['- ' + x for x in b[1]]
            elif b[0] == 'table': o += [' | '.join(b[1])] + [' | '.join(r) for r in b[2]]
            elif b[0] == 'qs': o += [f'Q: {q} A: {opts[ok]} ({why})' for q, opts, ok, why in b[1]]
        return '\n'.join(o) + ''.join(f'\nQ: {q}\nA: {a}' for q, a in C['faq'])
    lf = re.sub(r'\n# WSET preparation tools and hubs.*?(?=\n# |\Z)', '', open('llms-full.txt', encoding='utf8').read(), flags=re.S)
    lf = lf.rstrip() + '\n\n# WSET preparation tools and hubs\n\n' + '\n\n'.join(f'## {E[k]["h1"]}\nURL: {SITE}{SL[k]["en"]}\n{txt(E[k])}' for k in KEYS) + '\n'
    open('llms-full.txt', 'w', encoding='utf8').write(lf)
for l in LANGS: print(l, words[l])
print(len(LANGS) * len(KEYS), 'pages')

# image SEO post-processing (alt in the page language, descriptive goat file names, width/height, lazy/LCP, sitemap-images.xml)
if os.path.exists('tools/seo_tech/place_photos.py'): os.system('python3 tools/seo_tech/place_photos.py --quiet')  # free photos + credits pages
if os.path.exists('tools/seo_tech/images.py'): os.system('python3 tools/seo_tech/images.py --pages >/dev/null')
if os.path.exists('tools/geo/sitewide.py'): os.system('python3 tools/geo/sitewide.py --quiet')  # GEO: footer About link + consistent JSON-LD
os.system('python3 tools/seo_tech/internal_links.py --quiet'); os.system('python3 tools/seo_tech/sitemaps.py --quiet')  # sitemap index + one sitemap per language, from the built pages (the only writer of the sitemaps)
