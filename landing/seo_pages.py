# -*- coding: utf-8 -*-
"""SEO + AI-search layer of thewinegoat.com
- topic pages (practice questions, mock exam, short answers, SAT, flashcards, how to pass) in en/it/fr/es
- one page per syllabus chapter (28) in en/it/fr with real questions + answers + explanations, and a hub
- JSON-LD (WebPage, BreadcrumbList, FAQPage, Quiz/Question), hreflang, internal links on every landing page
- sitemap entries, robots.txt that welcomes search and AI crawlers, llms.txt / llms-full.txt, IndexNow key
Usage: python3 seo_pages.py <pkg dir>   (run after build_landing.py; English pages live at the root)"""
import json, os, sys, html, datetime, random, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from seo_text import SLUG, CHSLUG, UI, TOPIC
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
OUT = os.path.abspath(sys.argv[1]); D = 'https://thewinegoat.com'
LANGS = ['en', 'it', 'fr', 'es']; LI = {'it': 0, 'fr': 1, 'en': 2}
TODAY = datetime.date.today().isoformat()
e = lambda s: html.escape(str(s), quote=True)
L = {c: json.load(open(os.path.join(HERE, 'lang', c + '.json'), encoding='utf-8')) for c in LANGS}
BANK = json.load(open(os.path.join(ROOT, 'lp_bank.json'), encoding='utf-8'))
OUTQ = BANK['out']; OPENQ = BANK['open']
CHN = {c: {k: v for g, items in L[c]['prog']['groups'] for k, v in items} for c in LANGS}
COUNTS = {k: v['n'] for k, v in OUTQ.items()}

def base(c): return '' if c == 'en' else '/' + c
def topic_url(c, k): return f"{base(c)}/{SLUG[c][k]}/"
import unicodedata
def slugify(t):
    t = unicodedata.normalize('NFKD', t).encode('ascii', 'ignore').decode().lower()
    t = re.sub(r'[^a-z0-9]+', '-', t).strip('-'); return re.sub(r'-(e|and|et|y|il|la|le|les|the|del|della|di|de|du|des)-', '-', t)
def ch_url(c, ch): return f"{base(c)}/{SLUG[c]['ch']}/{CHSLUG[ch] if c == 'en' else slugify(CHN[c][ch])}/"
def hub_url(c): return f"{base(c)}/{SLUG[c]['hub']}/"
def home_url(c): return base(c) + '/'
def absu(p): return D + p

def mcq(q, c):
    i = LI[c]; return {'id': q['id'], 'q': q['q'][i], 'o': [o[i] for o in q['o']], 'e': q['e'][i]}

def es_qs():
    t = L['es'].get('qes') or {}
    return [dict(v, id=k) for k, v in t.items()]

def head(c, title, desc, kw, url, alts, ld):
    al = ''.join(f'<link rel="alternate" hreflang="{h}" href="{absu(u)}">' for h, u in alts)
    if alts: al += f'<link rel="alternate" hreflang="x-default" href="{absu(dict(alts).get("en", alts[0][1]))}">'
    return f'''<!DOCTYPE html>
<html lang="{c}">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<meta name="keywords" content="{e(kw)}">
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large">
<link rel="canonical" href="{absu(url)}">{al}
<meta property="og:type" content="article"><meta property="og:site_name" content="The Wine Goat"><meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(desc)}"><meta property="og:url" content="{absu(url)}"><meta property="og:image" content="{D}/img/og-{c if c in ('it','fr','es') else 'en'}.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/img/favicon.png" type="image/png"><link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
<link rel="stylesheet" href="/assets/site.css"><link rel="stylesheet" href="/assets/seo.css">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
</head>'''

def topbar(c, alts):
    U = UI[c]; names = {x: L[x]['name'] for x in LANGS}
    langs = ''.join(f'<a href="{u}" hreflang="{h}" lang="{h}">{e(names.get(h, h))}</a>' for h, u in alts) if alts else ''
    return f'''<body class="seo"><header class="top"><div class="wrap nav">
<a class="brand" href="{home_url(c)}"><img class="emb" src="/img/logo-emblem.webp" alt="" width="360" height="384"><img class="wm" src="/img/wordmark.webp" alt="The Wine Goat" width="752" height="294"></a>
<nav class="seolangs" aria-label="Language">{langs}</nav>
<a class="btn btn-primary btn-sm" href="/app/#go=start">{e(U['start'])}</a></div></header><main>'''

def crumbs(c, items):
    h = '<nav class="crumbs" aria-label="Breadcrumb"><ol>' + ''.join(f'<li><a href="{u}">{e(n)}</a></li>' if u else f'<li aria-current="page">{e(n)}</li>' for n, u in items) + '</ol></nav>'
    ld = {"@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": n, **({"item": absu(u)} if u else {})} for i, (n, u) in enumerate(items)]}
    return h, ld

def qblock(c, qs, numbered=True, mock=False):
    U = UI[c]; out = ''
    for n, q in enumerate(qs):
        opts = q['o'][:]; order = list(range(len(opts))); random.Random(q['id']).shuffle(order)
        lis = ''.join(f'<li><button type="button" class="sq-o" data-ok="{1 if k == 0 else 0}">{e(opts[k])}</button></li>' for k in order)
        out += (f'<article class="sq" data-id="{e(q["id"])}"><h3><span class="sqn">{n + 1}</span> {e(q["q"])}</h3><ol class="sq-os" type="A">{lis}</ol>'
                f'<details class="sq-a"><summary>{e(U["show"])}</summary><p><strong>{e(U["ans"])}:</strong> {e(q["o"][0])}</p><p><strong>{e(U["why"])}:</strong> {e(q["e"])}</p></details></article>')
    sc = f'<p class="sq-score" hidden data-tpl="{e(U["score"])}"></p>' if mock else ''
    return f'<div class="sqs{" mock" if mock else ""}">{out}</div>{sc}'

def quiz_ld(c, name, qs):
    return {"@type": "Quiz", "name": name, "inLanguage": c, "educationalLevel": "WSET Level 3 Award in Wines", "about": {"@type": "Thing", "name": "Wine"},
            "hasPart": [{"@type": "Question", "eduQuestionType": "Multiple choice", "text": q['q'],
                         "suggestedAnswer": [{"@type": "Answer", "text": o, "position": i} for i, o in enumerate(q['o']) if i],
                         "acceptedAnswer": {"@type": "Answer", "text": q['o'][0], "position": 0, "answerExplanation": {"@type": "Comment", "text": q['e']}}} for q in qs]}

def faq_html(c, faq):
    return f'<section class="seosec"><h2>{e(UI[c]["faq"])}</h2>' + ''.join(f'<details class="faqi"><summary>{e(q)}</summary><p>{e(a)}</p></details>' for q, a in faq) + '</section>'

def faq_ld(faq): return {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq]}

def cta(c, ch=None):
    U = UI[c]; extra = f'<p class="cta-n">{e(U["q_in_app"].replace("{n}", str(COUNTS[ch])))}</p>' if ch and U.get('q_in_app') else ''
    return (f'<section class="seocta"><img src="/img/goats/final.webp" alt="" width="200" height="200" loading="lazy"><div><h2>{e(U["cta_h"])}</h2><p>{e(U["cta_p"])}</p>{extra}'
            f'<div class="ctas"><a class="btn btn-gold" href="/app/#go=start">{e(U["cta_b"])}</a><a class="btn btn-light" href="/app/">{e(U["cta_b2"])}</a></div></div></section>')

def related(c, skip=None):
    U = UI[c]; T = [(k, TOPIC[k][c]['h1']) for k in TOPIC if k != skip]
    h = f'<section class="seosec rel"><h2>{e(U["more"])}</h2><ul class="rel-l">' + ''.join(f'<li><a href="{topic_url(c, k)}">{e(t)}</a></li>' for k, t in T) + '</ul>'
    if c in ('en', 'it', 'fr'):
        h += f'<h3><a href="{hub_url(c)}">{e(U["regions"])}</a></h3><ul class="rel-ch">' + ''.join(f'<li><a href="{ch_url(c, k)}">{e(CHN[c][k])}</a></li>' for k in CHSLUG) + '</ul>'
    return h + '</section>'

def foot(c):
    U = UI[c]; year = datetime.date.today().year
    return (f'</main><footer class="foot"><div class="wrap"><p class="fdisc">{e(U["disc"])}</p><p>© {year} The Wine Goat · <a href="{home_url(c)}">thewinegoat.com</a> · {e(U["updated"])} {TODAY}</p></div></footer>'
            '<script src="/assets/seo.js" defer></script></body></html>')

def write(path, s):
    p = os.path.join(OUT, path.strip('/'), 'index.html'); os.makedirs(os.path.dirname(p), exist_ok=True); open(p, 'w', encoding='utf-8').write(s)

def pick(chs, k, c):
    r = []
    for ch in chs:
        r += [mcq(q, c) for q in OUTQ[ch]['s'][:k]]
    return r

SAMPLES = {'mcq': (['bdx', 'bgn', 'vin', 'env', 'ita', 'spu', 'aus', 'prt'], 1), 'mock': (['vig', 'vgm', 'wht', 'red', 'rho', 'esp', 'ger', 'usa', 'she', 'chi'], 1),
           'sat': (['deg'], 6), 'flash': (['vig', 'gre', 'aut'], 2), 'pass': (['cib', 'srv', 'prx'], 1)}
ALL_URLS = []   # (url, [(hreflang,url)])

def topic_pages():
    for k in TOPIC:
        alts = [(c, topic_url(c, k)) for c in LANGS]
        for c in LANGS:
            T = TOPIC[k][c]; U = UI[c]; url = topic_url(c, k)
            bc, bld = crumbs(c, [(U['home'], home_url(c)), (T['h1'], None)])
            body = f'<article class="wrap seo-a"><h1>{e(T["h1"])}</h1>' + ''.join(f'<p class="lead">{e(p)}</p>' for p in T['intro'])
            body += '<section class="seosec"><ul class="tips">' + ''.join(f'<li>{e(x)}</li>' for x in T['tips']) + '</ul></section>'
            qs = []
            if k == 'saq':
                if c in LI:
                    i = LI[c]; out = ''
                    for oq in OPENQ[:3]:
                        for p in oq['parts'][:1]:
                            out += (f'<article class="saq"><p class="saq-ctx">{e(oq["q"][i])}</p><h3>{e(p["t"][i])} <span class="mk">({p["m"]} {e(U["marks"])})</span></h3>'
                                    f'<details class="sq-a"><summary>{e(U["kp"])}</summary><p>{e(p["k"][i])}</p></details></article>')
                    body += f'<section class="seosec"><h2>{e(U["sample"])}</h2>{out}</section>'
                else:
                    oe = L['es'].get('open_es')
                    if isinstance(oe, dict) and oe.get('t'):
                        body += f'<section class="seosec"><h2>{e(U["sample"])}</h2><article class="saq"><h3>{e(oe.get("t",""))}</h3><details class="sq-a"><summary>{e(U["kp"])}</summary><p>{e(oe.get("k",""))}</p></details></article></section>'
            elif k == 'flash':
                qs = pick(*SAMPLES[k], c) if c in LI else es_qs()[:6]
                cards = ''.join(f'<button type="button" class="fc"><span class="fc-f">{e(q["q"])}</span><span class="fc-b">{e(q["o"][0])}</span></button>' for q in qs)
                body += f'<section class="seosec"><h2>{e(U["sample"])}</h2><p class="muted">{e(U["card"])}</p><div class="fcs">{cards}</div></section>'
            else:
                if c in LI: qs = pick(*SAMPLES.get(k, SAMPLES['mcq']), c)
                else: qs = es_qs()[:10] if k == 'mock' else es_qs()[:6]
                if k == 'sat' and c == 'es': qs = []
                if qs: body += f'<section class="seosec"><h2>{e(U["sample"])}</h2>{qblock(c, qs, mock=(k == "mock"))}</section>'
            body += cta(c) + faq_html(c, T['faq']) + related(c, k) + '</article>'
            ld = {"@context": "https://schema.org", "@graph": [
                {"@type": "WebPage", "@id": absu(url), "url": absu(url), "name": T['title'], "description": T['desc'], "inLanguage": c, "dateModified": TODAY,
                 "isPartOf": {"@id": D + '/#site'}, "publisher": {"@id": D + '/#org'}, "about": [{"@type": "Thing", "name": "WSET Level 3 Award in Wines"}, {"@type": "Thing", "name": "Wine"}]},
                bld, faq_ld(T['faq'])] + ([quiz_ld(c, T['h1'], qs)] if qs and k != 'flash' else [])}
            write(url, head(c, T['title'], T['desc'], T['kw'], url, alts, ld) + topbar(c, alts) + bc + body + foot(c))
            ALL_URLS.append((url, alts))

def chapter_pages():
    for ch in CHSLUG:
        alts = [(c, ch_url(c, ch)) for c in ('en', 'it', 'fr')]
        for c in ('en', 'it', 'fr'):
            U = UI[c]; nm = CHN[c][ch]; n = COUNTS[ch]; url = ch_url(c, ch)
            title = U['ch_title'].replace('{c}', nm); desc = U['ch_desc'].replace('{c}', nm).replace('{n}', str(n)); h1 = U['ch_h1'].replace('{c}', nm)
            faq = [(q.replace('{c}', nm).replace('{n}', str(n)), a.replace('{c}', nm).replace('{n}', str(n))) for q, a in U['ch_faq']]
            qs = [mcq(q, c) for q in OUTQ[ch]['s']]
            bc, bld = crumbs(c, [(U['home'], home_url(c)), (U['regions'], hub_url(c)), (nm, None)])
            body = (f'<article class="wrap seo-a"><h1>{e(h1)}</h1><p class="lead">{e(U["ch_intro"].replace("{c}", nm).replace("{n}", str(n)))}</p>'
                    f'<section class="seosec"><h2>{e(U["sample"])}</h2>{qblock(c, qs)}</section>' + cta(c, ch) + faq_html(c, faq) + related(c) + '</article>')
            kw = f'WSET 3 {nm}, WSET Level 3 {nm}, {nm} WSET questions, {nm} wine quiz, {nm} wine exam questions'
            ld = {"@context": "https://schema.org", "@graph": [
                {"@type": "WebPage", "@id": absu(url), "url": absu(url), "name": title, "description": desc, "inLanguage": c, "dateModified": TODAY, "isPartOf": {"@id": D + '/#site'}, "publisher": {"@id": D + '/#org'}},
                bld, faq_ld(faq), quiz_ld(c, h1, qs)]}
            write(url, head(c, title, desc, kw, url, alts, ld) + topbar(c, alts) + bc + body + foot(c))
            ALL_URLS.append((url, alts))
    for c in ('en', 'it', 'fr'):
        U = UI[c]; url = hub_url(c); alts = [(x, hub_url(x)) for x in ('en', 'it', 'fr')]
        bc, bld = crumbs(c, [(U['home'], home_url(c)), (U['regions'], None)])
        groups = ''.join(f'<div class="hubg"><h2>{e(g)}</h2><ul>' + ''.join(f'<li><a href="{ch_url(c, k)}"><b>{e(v)}</b><span>{COUNTS[k]} {e(L[c]["prog"]["qn"])}</span></a></li>' for k, v in items) + '</ul></div>' for g, items in L[c]['prog']['groups'])
        body = f'<article class="wrap seo-a"><h1>{e(U["hub_h1"])}</h1><p class="lead">{e(U["hub_intro"])}</p><div class="hub">{groups}</div>' + cta(c) + related(c) + '</article>'
        ld = {"@context": "https://schema.org", "@graph": [{"@type": "CollectionPage", "@id": absu(url), "url": absu(url), "name": U['hub_title'], "description": U['hub_desc'], "inLanguage": c, "isPartOf": {"@id": D + '/#site'}},
              bld, {"@type": "ItemList", "itemListElement": [{"@type": "ListItem", "position": i + 1, "url": absu(ch_url(c, k)), "name": CHN[c][k]} for i, k in enumerate(CHSLUG)]}]}
        write(url, head(c, U['hub_title'], U['hub_desc'], 'WSET 3 questions by region, WSET Level 3 topics, WSET 3 syllabus', url, alts, ld) + topbar(c, alts) + bc + body + foot(c))
        ALL_URLS.append((url, alts))

def assets():
    os.makedirs(os.path.join(OUT, 'assets'), exist_ok=True)
    open(os.path.join(OUT, 'assets', 'site.css'), 'w', encoding='utf-8').write(open(os.path.join(HERE, 'site.css'), encoding='utf-8').read().replace('../fonts/', '/fonts/').replace('../img/', '/img/'))
    fonts = ''.join(f'@font-face{{font-family:"{f}";font-weight:{w};font-display:swap;src:url(/fonts/{n}.woff2) format("woff2")}}' for f, w, n in
                    [('Fraunces', 600, 'fraunces-600'), ('Fraunces', 800, 'fraunces-800'), ('DM Sans', 400, 'dmsans-400'), ('DM Sans', 500, 'dmsans-500'), ('DM Sans', 700, 'dmsans-700')])
    open(os.path.join(OUT, 'assets', 'seo.css'), 'w', encoding='utf-8').write(fonts + '''
body.seo{background:var(--bg);font-family:"DM Sans",system-ui,sans-serif}
.seo header.top{position:sticky;top:0;z-index:20;background:rgba(251,247,241,.95);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
.seo .nav{display:flex;align-items:center;gap:14px;justify-content:space-between;padding:8px 16px}
.seo .brand .emb{height:64px}.seo .brand .wm{height:50px}
.seolangs{display:flex;gap:6px;flex-wrap:wrap}.seolangs a{padding:6px 10px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px}.seolangs a:hover{background:var(--rose)}
.crumbs{max-width:900px;margin:18px auto 0;padding:0 20px}.crumbs ol{list-style:none;display:flex;flex-wrap:wrap;gap:6px;padding:0;margin:0;font-size:14px;color:var(--mut)}
.crumbs li+li:before{content:"›";margin-right:6px}
.seo-a{max-width:900px;padding-bottom:40px}.seo-a h1{font-family:Fraunces,Georgia,serif;font-size:clamp(30px,5vw,48px);color:var(--wine);margin:18px 0 14px;line-height:1.1}
.lead{font-size:18px;line-height:1.6;color:var(--ink)}
.seosec{margin:34px 0}.seosec h2{font-size:clamp(24px,3vw,32px)}
.tips{list-style:none;padding:0;display:grid;gap:10px}.tips li{background:#fff;border:2px solid var(--line);border-bottom-width:5px;border-radius:16px;padding:14px 16px 14px 48px;position:relative;font-weight:500}
.tips li:before{content:"🍇";position:absolute;left:14px;top:12px;font-size:20px}
.sqs{display:grid;gap:16px}.sq,.saq{background:#fff;border:2px solid var(--line);border-bottom-width:5px;border-radius:20px;padding:18px}
.sq h3,.saq h3{font-family:"DM Sans",system-ui,sans-serif;font-size:18px;line-height:1.4;margin:0 0 12px}.sqn{display:inline-grid;place-items:center;width:30px;height:30px;border-radius:50%;background:var(--wine);color:#fff;font-size:14px;margin-right:6px}
.sq-os{list-style:none;padding:0;margin:0 0 10px;display:grid;gap:8px}.sq-o{font:inherit;width:100%;text-align:left;padding:12px 14px;border-radius:14px;border:2px solid var(--line);border-bottom-width:4px;background:#fffdf9;cursor:pointer}
.sq-o:hover{border-color:var(--wine)}.sq-o.ok{border-color:#2e7d32;background:#e8f5e9}.sq-o.ko{border-color:#c62828;background:#fdecea}
.sq-a summary{cursor:pointer;font-weight:700;color:var(--wine)}.sq-a p{margin:8px 0 0}
.saq-ctx{margin:0 0 6px;color:var(--mut);font-weight:600}.mk{color:var(--mut);font-weight:600;font-size:15px}
.sq-score{font:800 26px Fraunces,Georgia,serif;color:var(--wine)}
.fcs{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}
.fc{font:inherit;position:relative;min-height:150px;border:0;border-radius:20px;padding:18px;cursor:pointer;color:#fff;background:linear-gradient(135deg,#8a2366,#5b1446);box-shadow:0 6px 0 #3e0d2f;text-align:left;font-weight:700}
.fc .fc-b{display:none}.fc.on{background:linear-gradient(135deg,#1f6f6b,#134a48);box-shadow:0 6px 0 #0b3331}.fc.on .fc-f{display:none}.fc.on .fc-b{display:block}
.seocta{display:flex;gap:20px;align-items:center;background:var(--wine);color:#fff;border-radius:24px;padding:24px;margin:36px 0}.seocta h2{color:#fff;margin:0 0 6px}.seocta p{color:#fbeef2}
.seocta img{width:150px;height:auto;flex:none}.seocta .ctas{display:flex;gap:10px;flex-wrap:wrap}.cta-n{font-weight:800;color:#ffd98a!important}
.faqi{background:#fff;border:2px solid var(--line);border-radius:16px;padding:14px 16px;margin:10px 0}.faqi summary{cursor:pointer;font-weight:700}
.rel-l,.rel-ch{display:flex;flex-wrap:wrap;gap:8px;padding:0;list-style:none}.rel-l a,.rel-ch a{display:block;padding:8px 12px;border-radius:999px;background:#fff;border:1.5px solid var(--line);text-decoration:none;font-weight:600;font-size:14px}
.hub{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}.hubg ul{list-style:none;padding:0;display:grid;gap:8px}
.hubg a{display:flex;justify-content:space-between;gap:8px;padding:12px 14px;border-radius:14px;background:#fff;border:2px solid var(--line);border-bottom-width:4px;text-decoration:none;color:var(--ink)}.hubg a span{color:var(--mut);font-size:14px}
.foot .fdisc{font-size:13px;opacity:.8}.sq-o:disabled{color:var(--ink);opacity:1;cursor:default}
@media(max-width:760px){.seo .brand .emb{height:46px}.seo .brand .wm{height:34px}.seolangs{display:none}.seocta{flex-direction:column;text-align:center}.seocta .ctas{justify-content:center}}
''')
    open(os.path.join(OUT, 'assets', 'seo.js'), 'w', encoding='utf-8').write('''(function(){var K='wset3-progress-v1';
function rec(id,ok){try{var P=JSON.parse(localStorage.getItem(K)||'null');if(!P||P.v!==1)P={v:1,q:{},e:{},s:[]};var n=Date.now(),q=P.q[id]||[0,0,0];q[0]++;if(ok)q[1]++;q[2]=n;P.q[id]=q;
 if(!ok){var e=P.e[id];if(e){e.n++;e.l=n;e.r=0;}else P.e[id]={n:1,f:n,l:n,r:0};}else if(P.e[id]&&!P.e[id].r){P.e[id].r=1;P.e[id].rt=n;}localStorage.setItem(K,JSON.stringify(P));}catch(e){}}
var good=0,done=0;document.querySelectorAll('.sq').forEach(function(a){a.querySelectorAll('.sq-o').forEach(function(b){b.addEventListener('click',function(){if(a.dataset.done)return;a.dataset.done=1;var ok=b.dataset.ok==='1';
 a.querySelectorAll('.sq-o').forEach(function(x){x.disabled=true;if(x.dataset.ok==='1')x.classList.add('ok');});if(!ok)b.classList.add('ko');var d=a.querySelector('details');if(d)d.open=true;rec(a.dataset.id,ok);done++;if(ok)good++;
 var s=document.querySelector('.sq-score');if(s){var t=document.querySelectorAll('.sq').length;s.hidden=false;s.textContent=s.dataset.tpl.replace('{n}',good).replace('{t}',done+'/'+t).replace(/\\/(\\d+)\\/(\\d+)/,'/$2');}});});});
document.querySelectorAll('.fc').forEach(function(f){f.addEventListener('click',function(){f.classList.toggle('on');});});})();''')

def link_landings():
    """internal links from every landing page to the SEO pages (crawl paths + topical authority)"""
    for c in LANGS:
        p = os.path.join(OUT, c, 'index.html')
        if not os.path.exists(p): continue
        s = open(p, encoding='utf-8').read()
        if 'class="seolinks"' in s: continue
        U = UI[c]
        links = ''.join(f'<li><a href="{topic_url(c, k)}">{e(TOPIC[k][c]["h1"])}</a></li>' for k in TOPIC)
        if c in ('en', 'it', 'fr'):
            links += f'<li><a href="{hub_url(c)}">{e(U["regions"])}</a></li>' + ''.join(f'<li><a href="{ch_url(c, k)}">{e("WSET 3 " + CHN[c][k])}</a></li>' for k in CHSLUG)
        nav = f'<nav class="seolinks wrap" aria-label="{e(U["more"])}"><h2>{e(U["more"])}</h2><ul>{links}</ul></nav>'
        s = s.replace('<footer', nav + '<footer', 1)
        open(p, 'w', encoding='utf-8').write(s)

def sitemap_robots_llms():
    sm = os.path.join(OUT, 'sitemap.xml'); s = open(sm, encoding='utf-8').read()
    add = ''
    for u, alts in ALL_URLS:
        add += f'<url><loc>{absu(u)}</loc><lastmod>{TODAY}</lastmod>' + ''.join(f'<xhtml:link rel="alternate" hreflang="{h}" href="{absu(x)}"/>' for h, x in alts) + '</url>\n'
    s = s.replace('</urlset>', add + '</urlset>'); open(sm, 'w', encoding='utf-8').write(s)
    bots = ['Googlebot', 'Bingbot', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'anthropic-ai', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot', 'Applebot-Extended', 'DuckAssistBot', 'meta-externalagent', 'CCBot', 'YandexBot', 'Amazonbot', 'MistralAI-User']
    rb = 'User-agent: *\nAllow: /\n\n' + ''.join(f'User-agent: {b}\nAllow: /\n\n' for b in bots) + f'Sitemap: {D}/sitemap.xml\n'
    open(os.path.join(OUT, 'robots.txt'), 'w').write(rb)
    en = TOPIC; lines = ['# The Wine Goat', '',
        '> The Wine Goat (thewinegoat.com) is an independent online platform and app to prepare the WSET Level 3 Award in Wines exam (WSET 3), in English, Italian, French and Spanish. It is not affiliated with the Wine & Spirit Education Trust.', '',
        'Key facts:',
        '- 2,000+ WSET Level 3 style multiple-choice practice questions with explanations, organised by the 28 topics of the syllabus (Bordeaux, Burgundy, Champagne, Rhône, Italy, Spain, Germany, New World, sherry, port, viticulture, winemaking, SAT tasting).',
        '- 101 short written answer (open) questions, marked instantly against the key points, each with a model answer.',
        '- Mock exams (multiple choice + written answers + SAT tasting note), 2,500+ flashcards, 11 games, 68 animated wine lessons, 45 podcast episodes, 42 interactive maps, 127 grape variety sheets, a wine dictionary.',
        '- Personalised study plan: the user sets goal (Pass, Merit, Distinction), exam date, minutes per day and course days; the app builds a day-by-day plan, tracks mastery and resurfaces weak points.',
        '- Notes: photograph lecture notes or record and transcribe a lesson.',
        '- Free: the full Bordeaux module, flashcards, games and the study plan. Paid access unlocks the rest (one-off price, no subscription).',
        '- The WSET Level 3 exam: theory = 50 multiple-choice questions + 4 short written answer questions; tasting = blind tasting of 2 wines with the Systematic Approach to Tasting (SAT); 55% needed in each part; results Pass, Merit or Distinction.', '',
        '## Start', f'- [Home (English)]({D}/)', f'- [Free app – build a study plan]({D}/app/#go=start)', f'- [Italiano]({D}/it/)', f'- [Français]({D}/fr/)', f'- [Español]({D}/es/)', '',
        '## WSET Level 1 and Level 2 (app coming soon)',
        '- WSET Level 1 Award in Wines: 30 multiple-choice questions in 45 minutes, 70% to pass, about 6 hours of guided learning, no prerequisites.',
        '- WSET Level 2 Award in Wines: 50 multiple-choice questions in 60 minutes, 55% to pass, about 28 hours of study (16 guided), 8 principal + 22 regional grape varieties, 70+ geographical indications.',
        f'- [WSET Level 1 guide]({D}/wset-level-1/) · [Livello 1]({D}/it/wset-livello-1/) · [Niveau 1]({D}/fr/wset-niveau-1/) · [Nivel 1]({D}/es/wset-nivel-1/)',
        f'- [WSET Level 2 guide]({D}/wset-level-2/) · [Livello 2]({D}/it/wset-livello-2/) · [Niveau 2]({D}/fr/wset-niveau-2/) · [Nivel 2]({D}/es/wset-nivel-2/)', '',
        '## Guides']
    for k in TOPIC:
        for c in LANGS:
            lines.append(f'- [{TOPIC[k][c]["h1"]}]({absu(topic_url(c, k))}): {TOPIC[k][c]["desc"]}')
    lines += ['', '## Practice questions by topic']
    for c in ('en', 'it', 'fr'):
        lines.append(f'- [{UI[c]["hub_h1"]}]({absu(hub_url(c))})')
        for k in CHSLUG: lines.append(f'  - [{CHN[c][k]}]({absu(ch_url(c, k))})')
    open(os.path.join(OUT, 'llms.txt'), 'w', encoding='utf-8').write('\n'.join(lines) + '\n')
    full = lines[:12] + ['', '## Sample questions with answers (English)']
    for ch in CHSLUG:
        full.append(f'\n### {CHN["en"][ch]}')
        for q in OUTQ[ch]['s']:
            m = mcq(q, 'en'); full.append(f'- Q: {m["q"]}\n  - Answer: {m["o"][0]}\n  - Why: {m["e"]}')
    open(os.path.join(OUT, 'llms-full.txt'), 'w', encoding='utf-8').write('\n'.join(full) + '\n')
    key = '7f3c2a9e5b1d4c8fa6e0b2d97c31e5a4'
    open(os.path.join(OUT, key + '.txt'), 'w').write(key)

def clean():
    import shutil
    for c in LANGS:
        for k, v in SLUG[c].items():
            shutil.rmtree(os.path.join(OUT, base(c).strip('/'), v), ignore_errors=True)

if __name__ == '__main__':
    clean(); assets(); topic_pages(); chapter_pages(); link_landings()
    import levels_pages
    levels_pages.build(sys.modules[__name__])
    open(os.path.join(OUT, 'assets', 'seo.css'), 'a', encoding='utf-8').write(levels_pages.CSS)
    sitemap_robots_llms()
    print('seo pages:', len(ALL_URLS))
