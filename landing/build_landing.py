"""The Wine Goat — multilingual landing generator.
Add a language: drop lang/<code>.json (same keys as it.json) and add <code> to LANGS. Rebuild.
Output goes to OUT (the Netlify site folder): /<code>/index.html, /index.html (language router),
sitemap.xml, robots.txt, img/, fonts/, and the language redirects in netlify.toml."""
import json, os, shutil, html, sys, datetime

BASE = os.path.dirname(os.path.abspath(__file__))
SD = os.path.dirname(BASE)
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(SD, 'site', 'pkg')
DOMAIN = 'https://thewinegoat.com'
LANGS = ['it', 'fr', 'es', 'en']          # order shown in the language menu
DEFAULT = 'en'                       # x-default fallback language
INSTAGRAM = 'https://www.instagram.com/the.winegoat/'
APP = '../app/'                      # the study app, relative to /<lang>/
TRIAL_IDS = ['b37efc4', 'd0423f0', '4b36bcf', '6a958de', '1e7a2bf', '9d26ecc']
LI = {'it': 0, 'fr': 1, 'en': 2}     # index of each language inside the app's question bank

L = {c: json.load(open(os.path.join(BASE, 'lang', c + '.json'), encoding='utf-8')) for c in LANGS}
bank = json.load(open(os.path.join(SD, 'lp_bank.json'), encoding='utf-8'))
openq = json.load(open(os.path.join(SD, 'lp_open.json'), encoding='utf-8'))
allq = {x['id']: x for c in bank['out'].values() for x in c['s']}
counts = {c: v['n'] for c, v in bank['out'].items()}
OPEN_SAMPLE = next(x for x in openq if 'cork' in x['t'][2])
TODAY = datetime.date.today().isoformat()

e = lambda s: html.escape(str(s), quote=True)

def url(c): return f'{DOMAIN}/{c}/'

def alternates():
    out = []
    for c in LANGS:
        for h in L[c]['hreflang']:
            out.append(f'<link rel="alternate" hreflang="{h}" href="{url(c)}">')
    out.append(f'<link rel="alternate" hreflang="x-default" href="{DOMAIN}/">')
    return '\n'.join(out)

CSS = open(os.path.join(BASE, 'site.css'), encoding='utf-8').read()
JS = open(os.path.join(BASE, 'site.js'), encoding='utf-8').read()

ICONS = {  # simple stroke icons, one per feature
 0: '<path d="M4 6h16M4 12h16M4 18h10"/>',
 1: '<path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M14 6l4 4"/>',
 2: '<rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="12" cy="13.5" r="3.5"/><path d="M8 7l1.5-3h5L16 7"/>',
 3: '<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/>',
 4: '<path d="M8 3h8l-1 7a3 3 0 0 1-6 0z"/><path d="M12 13v7M8 21h8"/>',
 5: '<path d="M12 3a9 9 0 1 0 9 9"/><path d="M12 7v5l3 3"/><path d="M17 3h4v4"/>',
 6: '<path d="M4 12a8 8 0 0 1 14-5.3L20 9"/><path d="M20 4v5h-5"/><path d="M20 12a8 8 0 0 1-14 5.3L4 15"/><path d="M4 20v-5h5"/>',
 7: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>'}

def icon(i):
    return f'<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{ICONS[i]}</svg>'

def jsonld(c, t):
    plans = t['price']['plans']
    num = lambda p: ''.join(ch for ch in p.replace(',', '.') if ch.isdigit() or ch == '.') or '0'
    offers = [{"@type": "Offer", "name": p['name'], "price": num(p['price']), "priceCurrency": "EUR",
               "category": "Free" if num(p['price']) in ('0', '0.') else "Paid", "url": url(c)} for p in plans]
    data = [
     {"@context": "https://schema.org", "@type": "Organization", "@id": DOMAIN + '/#org', "name": "The Wine Goat",
      "url": DOMAIN + '/', "logo": DOMAIN + '/img/logo.png', "sameAs": [INSTAGRAM]},
     {"@context": "https://schema.org", "@type": "WebSite", "@id": DOMAIN + '/#site', "name": "The Wine Goat",
      "url": DOMAIN + '/', "inLanguage": LANGS, "publisher": {"@id": DOMAIN + '/#org'}},
     {"@context": "https://schema.org", "@type": "WebPage", "name": t['title'], "url": url(c), "inLanguage": c,
      "description": t['desc'], "isPartOf": {"@id": DOMAIN + '/#site'}},
     {"@context": "https://schema.org", "@type": "Course", "name": t['hero']['kicker'].replace('®', ''),
      "description": t['desc'], "inLanguage": c, "url": url(c),
      "provider": {"@id": DOMAIN + '/#org'}, "offers": offers,
      "hasCourseInstance": {"@type": "CourseInstance", "courseMode": "Online", "courseWorkload": "P3M"},
      "educationalLevel": "Advanced", "teaches": [g[0] for g in t['prog']['groups']]},
     {"@context": "https://schema.org", "@type": "FAQPage", "inLanguage": c,
      "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in t['faq']['items']]}]
    return '\n'.join(f'<script type="application/ld+json">{json.dumps(d, ensure_ascii=False)}</script>' for d in data)

def page(c):
    t = L[c]; n = t['nav']; h = t['hero']; li = LI[c]
    ids = {'levels': {'it': 'livelli', 'fr': 'niveaux', 'en': 'levels'}[c],
           'trial': {'it': 'prova-gratis', 'fr': 'essai-gratuit', 'en': 'free-trial'}[c],
           'exam': {'it': 'esame', 'fr': 'examen', 'en': 'exam'}[c],
           'program': {'it': 'programma', 'fr': 'programme', 'en': 'syllabus'}[c],
           'pricing': {'it': 'prezzi', 'fr': 'tarifs', 'en': 'pricing'}[c],
           'faq': 'faq'}
    trial = [{'q': allq[i]['q'][li], 'o': [o[li] for o in allq[i]['o']], 'e': allq[i]['e'][li]} for i in TRIAL_IDS]
    op = OPEN_SAMPLE
    langmenu = ''.join(f'<li><a href="../{x}/" hreflang="{x}" lang="{x}" data-lang="{x}"{" aria-current=\"true\"" if x == c else ""}>{e(L[x]["name"])}</a></li>' for x in LANGS)
    nav = ''.join(f'<li><a href="#{ids[k]}">{e(n[k])}</a></li>' for k in ['levels', 'trial', 'exam', 'program', 'pricing', 'faq'])
    stats = ''.join(f'<div class="stat"><strong>{e(a)}</strong><span>{e(b)}</span></div>' for a, b in h['stats'])
    bullets = ''.join(f'<li>{e(b)}</li>' for b in h['bullets'])
    cards = ''
    for i, (tt, st, d, cta) in enumerate(t['levels']['cards']):
        live = i == 0
        cards += (f'<article class="lvl{" live" if live else ""}"><div class="lvl-top"><span class="lvl-n">{3 - i}</span>'
                  f'<span class="tag{" tag-ok" if live else ""}">{e(st)}</span></div><h3>{e(tt)}</h3><p>{e(d)}</p>'
                  + (f'<a class="btn btn-primary" href="{APP}">{e(cta)}</a>' if live else
                     f'<a class="btn btn-ghost" href="{INSTAGRAM}" rel="noopener" title="{e(t["notify"])}">{e(cta)}</a>') + '</article>')
    feats = ''.join(f'<article class="feat"><span class="ico">{icon(i)}</span><h3>{e(a)}</h3><p>{e(b)}</p></article>'
                    for i, (a, b) in enumerate(t['feat']['items']))
    excards = ''.join(f'<article class="ex"><h3>{e(a)}</h3><p>{e(b)}</p></article>' for a, b in t['exam']['cards'])
    groups = ''
    for g, items in t['prog']['groups']:
        tot = sum(counts.get(k, 0) for k, _ in items)
        groups += (f'<div class="grp"><h3>{e(g)} <span>{tot} {e(t["prog"]["qn"])}</span></h3><ul>'
                   + ''.join(f'<li>{e(lbl)}</li>' for _, lbl in items) + '</ul></div>')
    steps = ''.join(f'<li><span class="sn">{i + 1}</span><h3>{e(a)}</h3><p>{e(b)}</p></li>' for i, (a, b) in enumerate(t['method']['steps']))
    wh = t['why']['head']
    why = (f'<table class="cmp"><thead><tr><th scope="col"><span class="sr">{e(n["exam"])}</span></th><th scope="col">{e(wh[1])}</th><th scope="col" class="us">{e(wh[2])}</th></tr></thead><tbody>'
           + ''.join(f'<tr><th scope="row">{e(a)}</th><td>{e(b)}</td><td class="us">{e(cc)}</td></tr>' for a, b, cc in t['why']['rows']) + '</tbody></table>')
    plans = ''
    for i, p in enumerate(t['price']['plans']):
        hot = i == 2
        plans += (f'<article class="plan{" hot" if hot else ""}">' + (f'<span class="badge">{e(p["badge"])}</span>' if p['badge'] else '')
                  + f'<h3>{e(p["name"])}</h3><p class="pd">{e(p["desc"])}</p><p class="pp"><strong>{e(p["price"])}</strong> <span>{e(p["per"])}</span></p><ul>'
                  + ''.join(f'<li>{e(f)}</li>' for f in p['feat'])
                  + f'</ul><a class="btn {"btn-primary" if hot else "btn-ghost"}" href="{APP}">{e(p["cta"])}</a></article>')
    faq = ''.join(f'<details><summary><h3>{e(q)}</h3></summary><p>{e(a)}</p></details>' for q, a in t['faq']['items'])
    tr = t['trial']
    trialdata = json.dumps({'qs': trial, 't': {k: tr[k] for k in ['q', 'check', 'next', 'finish', 'ok', 'ko', 'score', 'restart']}}, ensure_ascii=False).replace('</', '<\\/')
    keypts = ''.join(f'<li>{e(s.strip())}</li>' for s in op['k'][li].split(';') if s.strip())
    year = datetime.date.today().year
    return f'''<!DOCTYPE html>
<html lang="{c}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(t['title'])}</title>
<meta name="description" content="{e(t['desc'])}">
<meta name="keywords" content="{e(t['keywords'])}">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="{url(c)}">
{alternates()}
<meta property="og:type" content="website">
<meta property="og:site_name" content="The Wine Goat">
<meta property="og:locale" content="{t['locale']}">
{''.join(f'<meta property="og:locale:alternate" content="{L[x]["locale"]}">' for x in LANGS if x != c)}
<meta property="og:url" content="{url(c)}">
<meta property="og:title" content="{e(t['ogtitle'])}">
<meta property="og:description" content="{e(t['ogdesc'])}">
<meta property="og:image" content="{DOMAIN}/img/og-{c}.png">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#8c1d40">
<link rel="icon" href="../img/favicon.png" type="image/png">
<link rel="apple-touch-icon" href="../img/apple-touch-icon.png">
<link rel="preload" href="../fonts/fraunces-800.woff2" as="font" type="font/woff2" crossorigin>
<style>{CSS}</style>
{jsonld(c, t)}
</head>
<body>
<a class="skip" href="#main">{e(t['skip'])}</a>
<header class="top">
 <div class="wrap bar">
  <a class="brand" href="./"><img class="emb" src="../img/logo-emblem.webp" alt="" width="360" height="384"><img class="wm" src="../img/wordmark.webp" alt="The Wine Goat" width="640" height="193"></a>
  <nav aria-label="{e(n['menu'])}"><button class="burger" aria-expanded="false" aria-controls="menu">{e(n['menu'])}</button>
   <ul id="menu" class="menu">{nav}</ul></nav>
  <div class="acts">
   <details class="langs"><summary aria-label="{e(n['lang'])}">{c.upper()}</summary><ul>{langmenu}</ul></details>
   <a class="login" href="{APP}">{e(n['login'])}</a>
   <a class="btn btn-primary btn-sm" href="#{ids['trial']}">{e(n['cta'])}</a>
  </div>
 </div>
</header>
<main id="main">
<section class="hero">
 <div class="wrap hero-g">
  <div>
   <p class="kick">{e(h['kicker'])}</p>
   <h1>{e(h['h1'])}</h1>
   <p class="lead">{e(h['lead'])}</p>
   <div class="ctas"><a class="btn btn-primary" href="#{ids['trial']}">{e(h['cta1'])}</a><a class="btn btn-ghost" href="#{ids['pricing']}">{e(h['cta2'])}</a></div>
   <ul class="ticks">{bullets}</ul>
  </div>
  <div class="hero-art"><div class="ring" aria-hidden="true"></div><div class="disc" aria-hidden="true"></div><img class="hg" src="../img/goat-hero.webp" alt="{e(h['img_alt'])}" width="620" height="567" fetchpriority="high"></div>
 </div>
 <div class="wrap stats">{stats}</div>
</section>

<section id="{ids['levels']}" class="sec">
 <div class="wrap"><h2>{e(t['levels']['h2'])}</h2><p class="intro">{e(t['levels']['intro'])}</p><div class="lvls">{cards}</div></div>
</section>

<section class="sec alt">
 <div class="wrap"><h2>{e(t['feat']['h2'])}</h2><p class="intro">{e(t['feat']['intro'])}</p><div class="feats">{feats}</div></div>
</section>

<section id="{ids['trial']}" class="sec trial">
 <div class="wrap trial-g">
  <div>
   <h2>{e(tr['h2'])}</h2><p class="intro">{e(tr['intro'])}</p>
   <div id="quiz" class="quiz" aria-live="polite"></div>
   <noscript><p>JavaScript</p></noscript>
   <div class="after" id="after" hidden><h3>{e(tr['after_h'])}</h3><p>{e(tr['after_p'])}</p><a class="btn btn-primary" href="{APP}">{e(tr['after_cta'])}</a></div>
  </div>
  <aside class="open">
   <img src="../img/goat-think.webp" alt="" width="383" height="371" loading="lazy">
   <h3>{e(tr['open_h'])}</h3><p>{e(tr['open_intro'])}</p>
   <p class="oq"><strong>{e(op['t'][li])}</strong> <span class="mk">({op['m']} {e(tr['open_marks'])})</span></p>
   <details class="reveal"><summary>{e(tr['open_btn'])}</summary><ul>{keypts}</ul></details>
  </aside>
 </div>
</section>

<section id="{ids['exam']}" class="sec alt">
 <div class="wrap"><h2>{e(t['exam']['h2'])}</h2><p class="intro">{e(t['exam']['intro'])}</p><div class="exs">{excards}</div><p class="tip">{e(t['exam']['tip'])}</p></div>
</section>

<section id="{ids['program']}" class="sec">
 <div class="wrap"><h2>{e(t['prog']['h2'])}</h2><p class="intro">{e(t['prog']['intro'])}</p><div class="grps">{groups}</div></div>
</section>

<section class="sec dark">
 <div class="wrap"><h2>{e(t['method']['h2'])}</h2><ol class="steps">{steps}</ol></div>
</section>

<section class="sec">
 <div class="wrap"><h2>{e(t['why']['h2'])}</h2><div class="cmpw">{why}</div></div>
</section>

<section id="{ids['pricing']}" class="sec alt">
 <div class="wrap"><h2>{e(t['price']['h2'])}</h2><p class="intro">{e(t['price']['intro'])}</p><div class="plans">{plans}</div><p class="pnote">{e(t['price']['note'])}</p></div>
</section>

<section id="faq" class="sec">
 <div class="wrap narrow"><h2>{e(t['faq']['h2'])}</h2><div class="faq">{faq}</div></div>
</section>

<section class="sec final">
 <div class="wrap final-g"><img src="../img/goat-cheers.webp" alt="" width="560" height="760" loading="lazy"><div><h2>{e(t['final']['h2'])}</h2><p>{e(t['final']['p'])}</p><a class="btn btn-gold" href="#{ids['trial']}">{e(t['final']['cta'])}</a></div></div>
</section>
</main>
<footer class="foot">
 <div class="wrap foot-g">
  <div><a class="brand" href="./"><img class="emb" src="../img/logo-emblem.webp" alt="" width="360" height="384" loading="lazy"><img class="wm" src="../img/wordmark-light.webp" alt="The Wine Goat" width="640" height="193" loading="lazy"></a><p>{e(t['foot']['tag'])}</p></div>
  <div><h2 class="fh">{e(t['foot']['langs'])}</h2><ul>{langmenu}</ul></div>
  <div><h2 class="fh">{e(t['foot']['follow'])}</h2><ul><li><a href="{INSTAGRAM}" rel="noopener">Instagram @the.winegoat</a></li><li><a href="{APP}">{e(n['login'])}</a></li></ul></div>
 </div>
 <div class="wrap disc-t"><p>{e(t['foot']['disc'])}</p><p>© {year} The Wine Goat · thewinegoat.com · {e(t['foot']['rights'])}</p></div>
</footer>
<script id="trial-data" type="application/json">{trialdata}</script>
<script>{JS}</script>
</body>
</html>'''

# ---- v2 template (interactive home, free Bordeaux, modules) ----
sys.path.insert(0, BASE)
import page_v2, page_v3
_bdx = json.load(open(os.path.join(SD, 'lp_bdx.json'), encoding='utf-8'))
page, jsonld = page_v3.build(dict(DOMAIN=DOMAIN, LANGS=LANGS, L=L, APP=APP, INSTAGRAM=INSTAGRAM, counts=counts, bdx=_bdx,
                                  open=OPEN_SAMPLE, CSS=CSS, JS=JS, alternates=alternates, url=url, icon=icon))

def router():
    links = ''.join(f'<li><a href="{x}/" hreflang="{x}" lang="{x}">{e(L[x]["name"])}</a></li>' for x in LANGS)
    avail = json.dumps(LANGS)
    return f'''<!DOCTYPE html>
<html lang="{DEFAULT}">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>The Wine Goat – WSET exam preparation · Preparazione esame WSET · Préparation examen WSET · Preparación examen WSET</title>
<meta name="description" content="WSET Level 1, 2 and 3 exam preparation in English, Italian, French and Spanish: practice questions, marked short answers and mock exams.">
<link rel="canonical" href="{DOMAIN}/">
{alternates()}
<link rel="icon" href="img/favicon.png" type="image/png">
<script>(function(){{var A={avail},D="{DEFAULT}",p=null;
try{{var m=document.cookie.match(/(?:^|; )nf_lang=([a-z]{{2}})/);if(m)p=m[1];}}catch(e){{}}
try{{if(!p)p=localStorage.getItem("twg-lang");}}catch(e){{}}
if(!p||A.indexOf(p)<0){{p=null;var ls=navigator.languages||[navigator.language||""];for(var i=0;i<ls.length&&!p;i++){{var c=(ls[i]||"").slice(0,2).toLowerCase();if(A.indexOf(c)>=0)p=c;}}}}
location.replace((p||D)+"/"+location.hash);}})();</script>
<style>body{{margin:0;font-family:system-ui,sans-serif;background:#fbf7f1;color:#2a1b20;display:grid;place-items:center;min-height:100vh}}a{{color:#8c1d40;font-weight:700;font-size:1.2rem}}ul{{list-style:none;padding:0;display:flex;gap:24px}}</style>
</head>
<body><main><h1>The Wine Goat</h1><ul>{links}</ul></main></body></html>'''

def sitemap():
    rows = []
    for c in LANGS + ['']:
        loc = url(c) if c else DOMAIN + '/'
        alts = ''.join(f'<xhtml:link rel="alternate" hreflang="{h}" href="{url(x)}"/>' for x in LANGS for h in L[x]['hreflang'])
        alts += f'<xhtml:link rel="alternate" hreflang="x-default" href="{DOMAIN}/"/>'
        rows.append(f'<url><loc>{loc}</loc><lastmod>{TODAY}</lastmod>{alts}</url>')
    return ('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
            'xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + '\n'.join(rows) + '\n</urlset>\n')

def netlify_redirects():
    out = ['# --- language routing (generated by landing/build_landing.py) ---']
    for c in LANGS:
        out.append(f'[[redirects]]\n  from = "/"\n  to = "/{c}/"\n  status = 302\n  force = true\n  conditions = {{Language = ["{c}"]}}')
    out.append(f'[[redirects]]\n  from = "/"\n  to = "/{DEFAULT}/"\n  status = 302\n  force = true')
    out.append('# --- end language routing ---')
    return '\n'.join(out)

def main():
    os.makedirs(OUT, exist_ok=True)
    for c in LANGS:
        os.makedirs(os.path.join(OUT, c), exist_ok=True)
        open(os.path.join(OUT, c, 'index.html'), 'w', encoding='utf-8').write(page(c))
    open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8').write(router())
    open(os.path.join(OUT, 'sitemap.xml'), 'w', encoding='utf-8').write(sitemap())
    open(os.path.join(OUT, 'robots.txt'), 'w').write(f'User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: {DOMAIN}/sitemap.xml\n')
    for d in ('img', 'fonts'):
        src = os.path.join(BASE, d)
        if os.path.isdir(src):
            shutil.rmtree(os.path.join(OUT, d), ignore_errors=True); shutil.copytree(src, os.path.join(OUT, d))
    nt = os.path.join(OUT, 'netlify.toml')
    if os.path.exists(nt):
        s = open(nt).read()
        a, b = '# --- language routing', '# --- end language routing ---'
        if a in s: s = s[:s.index(a)] + s[s.index(b) + len(b):]
        open(nt, 'w').write(s.rstrip() + '\n\n' + netlify_redirects() + '\n')
    print('landing built:', ', '.join(LANGS), '->', OUT)

if __name__ == '__main__':
    main()
