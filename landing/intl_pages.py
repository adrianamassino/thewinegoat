# -*- coding: utf-8 -*-
"""Home pages for the languages whose app is not translated yet (de, nl, pt-br, pt, el, ja, ko, zh-hans, zh-hant, pl, ar, es-ar).
They link to the English app. Also: hreflang links on every home page, sitemap entries, language links.
Usage: python3 intl_pages.py <pkg dir>   (after build_landing.py and seo_pages.py, before the English page moves to the root)"""
import os, sys, json, html, datetime
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from intl_text import I
OUT = os.path.abspath(sys.argv[1]); D = 'https://thewinegoat.com'; TODAY = datetime.date.today().isoformat()
e = lambda s: html.escape(str(s), quote=True)
MAIN = [('en', 'en', '/', 'English'), ('it', 'it', '/it/', 'Italiano'), ('fr', 'fr', '/fr/', 'Français'), ('es', 'es', '/es/', 'Español')]
ALL = MAIN + [(c, v['hl'], f'/{c}/', v['name']) for c, v in I.items()]

def alts_html():
    return ''.join(f'<link rel="alternate" hreflang="{hl}" href="{D}{u}">' for c, hl, u, n in ALL) + f'<link rel="alternate" hreflang="x-default" href="{D}/">'

def page(c, T):
    import page_v3, page_v2
    from intl_home_text import HI, HI_FAQ
    from home_text import H as HMAIN
    HERE = os.path.dirname(os.path.abspath(__file__)); SD = os.path.dirname(HERE)
    import levels_text
    if c in levels_text.G: T = dict(T, title=levels_text.G[c]['title'], desc=levels_text.G[c]['desc'])
    rtl = c == 'ar'
    h = HI.get('pt' if c == 'pt-br' else c) or HMAIN['es']
    faq = HI_FAQ.get(c) or T.get('faq') or []
    notice = ''  # no box on the page: the language note appears as a small disclaimer when the visitor goes to the app
    PILL = {'de': ('{n} Antworten in deinem Profil gespeichert', 'Weiter'), 'nl': ('{n} antwoorden opgeslagen in je profiel', 'Verder'),
            'pt': ('{n} respostas guardadas no seu perfil', 'Continuar'), 'pt-br': ('{n} respostas salvas no seu perfil', 'Continuar'),
            'el': ('{n} απαντήσεις αποθηκεύτηκαν στο προφίλ σας', 'Συνέχεια'), 'ja': ('{n}件の回答をプロフィールに保存しました', '続ける'),
            'ko': ('답변 {n}개가 프로필에 저장됨', '계속'), 'zh-hans': ('已有 {n} 个答案保存在你的档案中', '继续'), 'zh-hant': ('已有 {n} 個答案儲存在你的檔案中', '繼續'),
            'pl': ('Zapisane odpowiedzi w profilu: {n}', 'Dalej'), 'ar': ('تم حفظ {n} إجابة في ملفك', 'متابعة'), 'ru': ('Ответов сохранено в профиле: {n}', 'Продолжить'),
            'es-ar': ('{n} respuestas guardadas en tu perfil', 'Continuar')}
    pill = PILL.get(c, ('{n} answers saved to your profile', 'Continue'))
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "WebPage", "@id": f"{D}/{c}/", "url": f"{D}/{c}/", "name": T['title'], "description": T['desc'], "inLanguage": T['hl'], "dateModified": TODAY, "isPartOf": {"@id": D + '/#site'}, "publisher": {"@id": D + '/#org'}},
        {"@type": "Course", "name": T['h1'], "description": T['desc'], "inLanguage": ["en", "it", "fr"], "provider": {"@type": "Organization", "name": "The Wine Goat", "url": D + '/'},
         "offers": {"@type": "Offer", "price": "0", "priceCurrency": "EUR", "category": "Free"}, "hasCourseInstance": {"@type": "CourseInstance", "courseMode": "online", "courseWorkload": "PT30M"}}]
        + ([{"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq]}] if faq else [])}
    head = f"""<!DOCTYPE html>
<html lang="{T['hl']}"{' dir="rtl"' if rtl else ''}>
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(T['title'])}</title>
<meta name="description" content="{e(T['desc'])}"><meta name="keywords" content="{e(T['kw'])}">
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large">
<link rel="canonical" href="{D}/{c}/">{alts_html()}
<meta property="og:type" content="website"><meta property="og:site_name" content="The Wine Goat"><meta property="og:title" content="{e(T['title'])}"><meta property="og:description" content="{e(T['desc'])}"><meta property="og:url" content="{D}/{c}/"><meta property="og:image" content="{D}/img/og-en.png"><meta property="og:locale" content="{T['hl'].replace('-', '_')}">
<meta name="theme-color" content="#8c1d40">
<link rel="icon" href="/img/favicon.png" type="image/png"><link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
<link rel="stylesheet" href="/assets/intl.css">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
"""
    # English sample questions (the app language for these visitors)
    bdx = {x['id']: x for x in json.load(open(os.path.join(SD, 'lp_bdx.json'), encoding='utf-8'))}
    openq = json.load(open(os.path.join(SD, 'lp_open.json'), encoding='utf-8'))
    ox = next(x for x in openq if 'cork' in x['t'][2])
    oq = {'t': ox['t'][2], 'k': ox['k'][2], 'm': ox['m']}
    mcq = [{'id': i, 'q': bdx[i]['q'][2], 'o': [o[2] for o in bdx[i]['o']], 'e': bdx[i]['e'][2]} for i in page_v2.TRIAL_BDX if i in bdx]
    data = {'mcq': mcq, 'open': oq, 'tx': {k: h[k] for k in ('o_res', 'o_hit', 'o_miss', 'o_again', 'o_short', 'm_ok', 'm_ko', 'm_next', 'm_score', 'm_after')},
            'says': h.get('says', []), 'pill': list(pill), 'cur': {'list': page_v2.CUR, 'def': page_v2.DEFCUR.get(c, 'EUR'), 'lang': c}, 'app': '/app/'}
    langs = ''.join(f'<li><a href="{u}" hreflang="{hl}" lang="{hl}"{" aria-current=true" if cc == c else ""}>{e(n)}</a></li>' for cc, hl, u, n in ALL)
    ids = tuple(u.lstrip('#') for u, n in h['nav'][:3])
    CSS = open(os.path.join(HERE, 'home.css'), encoding='utf-8').read().replace('../fonts/', '/fonts/')
    JS = open(os.path.join(HERE, 'home.js'), encoding='utf-8').read()
    t = {'skip': '↓', 'faq': {'items': faq}, 'foot': {'disc': T['disc']}}
    price = page_v2.money(c, 59)
    body = page_v3.render_body(c, t, h, oq, data, '/app/', langs, ids, 'en', price, CSS, JS, '', notice=notice, home=f'/{c}/', img='/img', lang_label='🌍')
    body = body.replace('<body class="h3">', f'<body class="h3{" rtl" if rtl else ""}">', 1)
    nt = json.dumps({'t': h.get('notice_t', ''), 'p': h.get('notice', ''), 'b': pill[1], 'k': c}, ensure_ascii=False).replace('</', '<\\/')
    body = body.replace("</body>", """<script>(function(){var N=""" + nt + """;
function setL(){try{if(!localStorage.getItem('wset3-lang'))localStorage.setItem('wset3-lang','en');}catch(e){}}
function seen(){try{return localStorage.getItem('twg-lnote')==='1';}catch(e){return true;}}
function show(href){var bg=document.createElement('div');bg.className='lnm-bg';bg.innerHTML='<div class="lnm" role="dialog" aria-modal="true"><span class="lnm-ic">🌍</span><h2></h2><p></p><button type="button" class="b3 b3p"></button></div>';
 bg.querySelector('h2').textContent=N.t;bg.querySelector('p').textContent=N.p;var b=bg.querySelector('button');b.textContent=N.b+' →';
 function go(){try{localStorage.setItem('twg-lnote','1');}catch(e){}location.href=href;}
 b.addEventListener('click',go);bg.addEventListener('click',function(e){if(e.target===bg)bg.remove();});document.body.appendChild(bg);b.focus();}
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href^="/app/"]');if(!a)return;setL();if(!N.p||seen())return;e.preventDefault();show(a.getAttribute('href'));},true);})();</script></body>""", 1)
    return head + body

def css():
    src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'home.css'), encoding='utf-8').read().replace('../fonts/', '/fonts/')
    open(os.path.join(OUT, 'assets', 'home.css'), 'w', encoding='utf-8').write(src)
    open(os.path.join(OUT, 'assets', 'intl.css'), 'w', encoding='utf-8').write('''
.lnote{margin-top:28px}.lnbox{display:flex;gap:16px;align-items:flex-start;padding:20px 22px;border-radius:22px;background:#fff;box-shadow:inset 0 0 0 1.5px #ecd6dc,0 18px 40px -28px rgba(62,15,34,.5)}.lnic{font-size:28px}.lnbox h2{font-size:22px;text-align:left;margin:0 0 6px}.lnbox p{margin:0;color:#6b5a5f}
.lnm-bg{position:fixed;inset:0;z-index:200;background:rgba(43,26,32,.45);display:flex;align-items:flex-end;justify-content:center;padding:16px}
.lnm{max-width:440px;width:100%;background:#fff;border-radius:22px;padding:20px 20px 18px;box-shadow:0 30px 60px -20px rgba(43,26,32,.6);animation:lnmIn .3s ease-out}
.lnm-ic{font-size:22px}.lnm h2{font-size:19px;text-align:left;margin:6px 0 6px}.lnm p{margin:0 0 14px;color:#6b5a5f;font-size:14.5px;line-height:1.45}.lnm .b3{width:100%;justify-content:center}
@keyframes lnmIn{from{transform:translateY(30px);opacity:0}}@media (min-width:700px){.lnm-bg{align-items:center}}
.ex4{grid-template-columns:repeat(4,1fr)}.ex3 h3{font-size:19px}
.rtl{direction:rtl}.rtl .hero3 h1:after{margin-left:auto}.rtl .s3grid h2,.rtl .fin3 h2{text-align:right}
:lang(ja) h1,:lang(ja) h2,:lang(ja) h3,:lang(ko) h1,:lang(ko) h2,:lang(ko) h3,:lang(zh-Hans) h1,:lang(zh-Hans) h2,:lang(zh-Hans) h3,:lang(zh-Hant) h1,:lang(zh-Hant) h2,:lang(zh-Hant) h3,:lang(ar) h1,:lang(ar) h2,:lang(ar) h3,:lang(el) h1,:lang(el) h2,:lang(el) h3{font-family:system-ui,-apple-system,"Noto Sans",sans-serif;font-weight:800}
@media (max-width:1020px){.ex4{grid-template-columns:1fr 1fr}}@media (max-width:640px){.ex4{grid-template-columns:1fr}}
''')

def patch_main():
    """hreflang for the new languages on the main home pages + language links in their footer nav"""
    extra = ''.join(f'<link rel="alternate" hreflang="{v["hl"]}" href="{D}/{c}/">' for c, v in I.items())
    links = ''.join(f'<li><a href="/{c}/" hreflang="{v["hl"]}" lang="{v["hl"]}">{e(v["name"])}</a></li>' for c, v in I.items())
    for c in ('en', 'it', 'fr', 'es'):
        p = os.path.join(OUT, c, 'index.html')
        if not os.path.exists(p): continue
        s = open(p, encoding='utf-8').read()
        if 'hreflang="de"' not in s: s = s.replace('<link rel="alternate" hreflang="x-default"', extra + '<link rel="alternate" hreflang="x-default"', 1)
        if 'class="intl-links"' not in s: s = s.replace('<footer', f'<nav class="seolinks wrap intl-links" aria-label="Languages"><h2>🌍</h2><ul>{links}</ul></nav><footer', 1)
        open(p, 'w', encoding='utf-8').write(s)
    sm = os.path.join(OUT, 'sitemap.xml'); s = open(sm, encoding='utf-8').read()
    add = ''.join(f'<url><loc>{D}/{c}/</loc><lastmod>{TODAY}</lastmod>' + ''.join(f'<xhtml:link rel="alternate" hreflang="{hl}" href="{D}{u}"/>' for cc, hl, u, n in ALL) + '</url>\n' for c in I)
    if f'{D}/de/' not in s: s = s.replace('</urlset>', add + '</urlset>')
    open(sm, 'w', encoding='utf-8').write(s)
    lt = os.path.join(OUT, 'llms.txt')
    if os.path.exists(lt):
        t = open(lt, encoding='utf-8').read()
        if '/de/' not in t: t = t.replace('## Guides', '## Other languages (app in English for now)\n' + ''.join(f'- [{v["name"]}]({D}/{c}/)\n' for c, v in I.items()) + '\n## Guides', 1)
        open(lt, 'w', encoding='utf-8').write(t)

if __name__ == '__main__':
    css()
    for c, T in I.items():
        os.makedirs(os.path.join(OUT, c), exist_ok=True)
        open(os.path.join(OUT, c, 'index.html'), 'w', encoding='utf-8').write(page(c, T))
    patch_main(); print('intl pages:', len(I))
