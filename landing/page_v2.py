"""Page template v2: interactive home, free Bordeaux module, pay-per-module pricing.
Imported by build_landing.py (it replaces page() and jsonld())."""
import json, html, datetime

e = lambda s: html.escape(str(s), quote=True)

# module -> app question categories, price in EUR (0 = free)
MODULES = [('bdx', ['bdx'], 0), ('tas', ['deg', 'cib', 'srv'], 9), ('vin', ['vig', 'env', 'vgm'], 9),
           ('cel', ['vin', 'wht', 'red', 'prx'], 9), ('fra', ['bgn', 'als', 'rho', 'sfr'], 9),
           ('eur', ['ita', 'esp', 'por', 'ger', 'aut', 'gre'], 12), ('nw', ['usa', 'chi', 'rsa', 'aus'], 9),
           ('spe', ['spu', 'she', 'prt'], 9), ('exam', [], 12)]
BUNDLE = 59
TRIAL_BDX = ['b37efc4', '14bc7e6', 'df5181d', '4f82326', '41f40a7', '7adbac1']
QUICK_FIRST = 'e30dff4'

# price list per currency: a = standard module, b = large module, bundle = all modules
# fixed price list per currency (checked against ECB rates of 6 Nov 2026: every price is worth at least 9 € / 12 € / 59 €)
CUR = {'EUR': (9, 12, 59), 'USD': (11, 14, 69), 'GBP': (8, 11, 52), 'CHF': (9, 12, 59), 'CAD': (15, 19, 95), 'AUD': (15, 20, 99),
       'NZD': (19, 25, 125), 'JPY': (1700, 2200, 10800), 'KRW': (14500, 19000, 94000), 'CNY': (69, 95, 459), 'TWD': (339, 449, 2190),
       'HKD': (85, 109, 539), 'PLN': (42, 55, 269), 'BRL': (59, 79, 379), 'MXN': (199, 259, 1290), 'CLP': (9900, 13900, 65900),
       'COP': (42000, 56000, 279000), 'SAR': (39, 52, 259), 'AED': (39, 52, 259), 'DKK': (69, 95, 449), 'SEK': (105, 139, 679), 'NOK': (99, 135, 649)}
DEFCUR = {'it': 'EUR', 'fr': 'EUR', 'es': 'EUR', 'es-ar': 'USD', 'en': 'USD', 'de': 'EUR', 'nl': 'EUR', 'pt-br': 'BRL', 'pt': 'EUR',
          'el': 'EUR', 'ja': 'JPY', 'ko': 'KRW', 'zh-hans': 'CNY', 'zh-hant': 'TWD', 'pl': 'PLN', 'ar': 'USD'}
SYM = {'EUR': '€', 'USD': '$', 'GBP': '£', 'JPY': '¥', 'KRW': '₩', 'CNY': '¥', 'BRL': 'R$', 'PLN': 'zł', 'TWD': 'NT$'}
def tier(eur):
    return {9: 'a', 12: 'b', 59: 'bundle'}.get(eur)
def cur_val(cur, key):
    a, b, bu = CUR[cur]
    full = 6 * a + 2 * b
    return {'a': a, 'b': b, 'bundle': bu, 'full': full, 'save': full - bu}[key]
def money(c, v, key=None):
    """v is the EUR base price; rendered in the page's default currency and re-rendered client-side for the visitor's country."""
    key = key or tier(v) or ('full' if v == 78 else 'save' if v == 19 else 'a')
    cur = DEFCUR.get(c, 'EUR'); val = cur_val(cur, key); sym = SYM.get(cur, cur + ' ')
    txt = f'{val:,}'.replace(',', '.' if c in ('it', 'es', 'de', 'nl', 'pt', 'pt-br', 'el', 'es-ar') else ' ' if c in ('fr', 'pl') else ',')
    txt = f'{txt} {sym}' if c in ('it', 'fr', 'es', 'de', 'nl', 'pt', 'pt-br', 'el', 'pl', 'es-ar') and cur in ('EUR', 'PLN') else f'{sym}{txt}' if sym in ('$', '£', '¥', '₩', 'R$', 'NT$', '€') else f'{txt} {sym}'
    return f'<span class="pr" data-p="{key}">{txt}</span>'

def build(ctx):
    DOMAIN, LANGS, L, APP, INSTAGRAM = ctx['DOMAIN'], ctx['LANGS'], ctx['L'], ctx['APP'], ctx['INSTAGRAM']
    counts, bdx, openq, CSS, JS, alternates, url, icon = ctx['counts'], ctx['bdx'], ctx['open'], ctx['CSS'], ctx['JS'], ctx['alternates'], ctx['url'], ctx['icon']
    LI = {'it': 0, 'fr': 1, 'en': 2, 'es': 2}
    byid = {x['id']: x for x in bdx}

    def jsonld(c, t):
        m = t['mods']
        cc = DEFCUR.get(c, 'EUR'); pv = lambda eur: str(cur_val(cc, tier(eur))) if eur else '0'
        offers = [{"@type": "Offer", "name": m['items'][k][0], "price": pv(p), "priceCurrency": cc,
                   "category": "Free" if p == 0 else "Paid", "url": url(c)} for k, _, p in MODULES]
        offers.append({"@type": "Offer", "name": m['bundle']['name'], "price": pv(BUNDLE), "priceCurrency": cc, "category": "Paid", "url": url(c)})
        data = [
         {"@context": "https://schema.org", "@type": "Organization", "@id": DOMAIN + '/#org', "name": "The Wine Goat",
          "url": DOMAIN + '/', "logo": DOMAIN + '/img/logo.png', "sameAs": [INSTAGRAM]},
         {"@context": "https://schema.org", "@type": "WebSite", "@id": DOMAIN + '/#site', "name": "The Wine Goat",
          "url": DOMAIN + '/', "inLanguage": LANGS, "publisher": {"@id": DOMAIN + '/#org'}},
         {"@context": "https://schema.org", "@type": "WebPage", "name": t['title'], "url": url(c), "inLanguage": c,
          "description": t['desc'], "isPartOf": {"@id": DOMAIN + '/#site'}},
         {"@context": "https://schema.org", "@type": "Course", "name": t['hero']['kicker'].replace('®', ''),
          "description": t['desc'], "inLanguage": c, "url": url(c), "provider": {"@id": DOMAIN + '/#org'},
          "offers": offers, "isAccessibleForFree": False,
          "hasCourseInstance": {"@type": "CourseInstance", "courseMode": "Online", "courseWorkload": "P3M"},
          "educationalLevel": "Advanced", "teaches": [m['items'][k][0] for k, _, _ in MODULES]},
         {"@context": "https://schema.org", "@type": "FAQPage", "inLanguage": c,
          "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in t['faq']['items']]}]
        return '\n'.join(f'<script type="application/ld+json">{json.dumps(d, ensure_ascii=False)}</script>' for d in data)

    def page(c):
        t = L[c]; n = t['nav']; h = t['hero']; li = LI[c]; X = t['explore']; M = t['mods']
        ids = {'levels': {'it': 'livelli', 'fr': 'niveaux', 'en': 'levels', 'es': 'niveles'}[c],
               'trial': {'it': 'prova-gratis', 'fr': 'essai-gratuit', 'en': 'free-trial', 'es': 'prueba-gratis'}[c],
               'exam': {'it': 'esame', 'fr': 'examen', 'en': 'exam', 'es': 'examen'}[c],
               'program': {'it': 'programma', 'fr': 'programme', 'en': 'syllabus', 'es': 'temario'}[c],
               'pricing': {'it': 'moduli', 'fr': 'modules', 'en': 'modules', 'es': 'modulos'}[c], 'faq': 'faq'}
        QX = t.get('qes')
        if QX:
            q = lambda x: dict(QX[x['id']])
            trial = [dict(q(byid[i]), id=i) for i in TRIAL_BDX]
            pool = [dict(q(byid[QUICK_FIRST]), id=QUICK_FIRST)] + [dict(q(x), id=x['id']) for x in bdx if x['id'] in QX and x['id'] not in TRIAL_BDX and x['id'] != QUICK_FIRST]
        else:
            q = lambda x: {'q': x['q'][li], 'o': [o[li] for o in x['o']], 'e': x['e'][li]}
            trial = [dict(q(byid[i]), id=i) for i in TRIAL_BDX]
            pool = [dict(q(byid[QUICK_FIRST]), id=QUICK_FIRST)] + [dict(q(x), id=x['id']) for x in bdx if x['id'] not in TRIAL_BDX and x['id'] != QUICK_FIRST]
        mname = lambda k: M['items'][k][0] if k in M['items'] else ''
        data = {'cur': {'list': CUR, 'def': DEFCUR.get(c, 'EUR'), 'lang': c},
                'trial': trial, 'pool': pool,
                't': {k: t['trial'][k] for k in ['q', 'check', 'next', 'finish', 'ok', 'ko', 'score', 'restart']},
                'quick': t['quick'], 'match': X['match'], 'tf': X['tf'], 'flash': X['flash'], 'demo': X['notes']['demo']}
        data = json.dumps(data, ensure_ascii=False).replace('</', '<\\/')
        langmenu = ''.join(f'<li><a href="../{x}/" hreflang="{x}" lang="{x}" data-lang="{x}"{" aria-current=\"true\"" if x == c else ""}>{e(L[x]["name"])}</a></li>' for x in LANGS)
        nav = ''.join(f'<li><a href="#{ids[k]}">{e(n[k])}</a></li>' for k in ['trial', 'pricing', 'exam', 'program', 'faq'])
        bullets = ''.join(f'<li>{e(b)}</li>' for b in h['bullets'])
        stats = ''.join(f'<div class="stat"><strong>{e(a)}</strong><span>{e(b)}</span></div>' for a, b in h['stats'])
        # explore tabs
        tabs = [('quiz', 'bdx'), ('match', X['match']['mod']), ('tf', X['tf']['mod']), ('flash', X['flash']['mod']), ('open', 'tas'), ('film', 'all'), ('pod', 'bdx'), ('notes', 'all')]
        tabbar = ''.join(f'<button type="button" role="tab" id="tab-{k}" aria-controls="pan-{k}" aria-selected="{"true" if i == 0 else "false"}" tabindex="{0 if i == 0 else -1}" class="tab">{e(X["tabs"][k])}</button>' for i, (k, _) in enumerate(tabs))
        def foot(mod):
            if mod == 'bdx':
                return f'<div class="pfoot free"><span><span class="lockic" aria-hidden="true">🔓</span> {e(X["from"])} <b>{e(mname("bdx"))}</b> · <span class="tagfree">{e(M["free"])}</span></span><a class="btn btn-primary btn-sm" href="{APP}">{e(M["openfree"])}</a></div>'
            if mod == 'all':
                return f'<div class="pfoot"><span>✨ {e(M["bundle"]["name"])}</span><a class="btn btn-primary btn-sm" href="#{ids["pricing"]}">{e(n["pricing"])}</a></div>'
            price = dict((k, p) for k, _, p in MODULES)[mod]
            return f'<div class="pfoot"><span><span class="lockic" aria-hidden="true">🔒</span> {e(X["from"])} <b>{e(mname(mod))}</b> · {money(c, price)}</span><a class="btn btn-primary btn-sm" href="#{ids["pricing"]}">{e(X["unlock"])}</a></div>'
        SH = c if c in ('it', 'fr', 'en') else 'en'; PL = SH
        tr = t['trial']; op = openq
        OES = t.get('open_es')
        op_t = OES['t'] if OES else op['t'][li]; op_k = OES['k'] if OES else op['k'][li]
        keypts = ''.join(f'<li>{e(s.strip())}</li>' for s in op_k.split(';') if s.strip())
        nt = X['notes']
        panels = {
         'quiz': f'<div class="pin"><div id="quiz" class="quiz" aria-live="polite"></div><div class="after" id="after" hidden><h3>{e(tr["after_h"])}</h3><p>{e(tr["after_p"])}</p><a class="btn btn-gold" href="{APP}#go=start">{e(tr["after_cta2"])}</a></div></div>',
         'match': f'<div class="pin"><h3>{e(X["match"]["h"])}</h3><p class="ph">{e(X["match"]["p"])}</p><div id="match" class="match"></div></div>',
         'tf': f'<div class="pin"><h3>{e(X["tf"]["h"])}</h3><p class="ph">{e(X["tf"]["p"])}</p><div id="tf" class="tf" aria-live="polite"></div></div>',
         'flash': f'<div class="pin"><h3>{e(X["flash"]["h"])}</h3><p class="ph">{e(X["flash"]["p"])}</p><div id="flash" class="flash"></div></div>',
         'open': f'<div class="pin openq"><img src="../img/goat-think.webp" alt="" width="383" height="371" loading="lazy"><h3>{e(tr["open_h"])}</h3><p class="ph">{e(tr["open_intro"])}</p><p class="oq"><strong>{e(op_t)}</strong> <span class="mk">({op["m"]} {e(tr["open_marks"])})</span></p><details class="reveal"><summary>{e(tr["open_btn"])}</summary><ul>{keypts}</ul></details></div>',
         'film': f'<div class="pin media"><div><h3>{e(X["film"]["h"])}</h3><p class="ph">{e(X["film"]["p"])}</p><a class="btn btn-primary" href="{APP}#go=films">▶ {e(X["film"]["cta"])}</a></div><img class="phone" src="../img/shots/films-{SH}.webp" alt="" width="540" height="1080" loading="lazy"></div>',
         'pod': f'<div class="pin media"><div><h3>🎧 {e(X["pod"]["h"])}</h3><p class="ph">{e(X["pod"]["p"])}</p><audio controls preload="none" src="../app/pods/{PL}/ch13.mp3"></audio><p><a class="btn btn-ghost" href="{APP}#go=pods">{e(X["pod"]["cta"])} →</a></p></div><img class="phone" src="../img/shots/pods-{SH}.webp" alt="" width="540" height="1080" loading="lazy"></div>',
         'notes': f'''<div class="pin"><h3>{e(nt["h"])}</h3><p class="ph">{e(nt["p"])}</p><div class="ntg">
           <div class="ntc"><span class="ntico" aria-hidden="true">📷</span><h4>{e(nt["photo_t"])}</h4><p>{e(nt["photo_d"])}</p>
             <div class="ocr" aria-hidden="true"><div class="paper"><i></i><i></i><i></i><i></i></div><span class="arr">→</span><div class="typed"><b></b><b></b><b></b></div></div></div>
           <div class="ntc"><span class="ntico" aria-hidden="true">🎙️</span><h4>{e(nt["lesson_t"])}</h4><p>{e(nt["lesson_d"])}</p>
             <div class="mic"><span class="recd"></span><b>{e(nt["rec"])}</b><div id="demo" class="demo" aria-hidden="true"></div></div></div></div></div>'''}
        pans = ''.join(f'<div role="tabpanel" id="pan-{k}" aria-labelledby="tab-{k}" class="pan"{"" if i == 0 else " hidden"}>{panels[k]}{foot(mod)}</div>' for i, (k, mod) in enumerate(tabs))
        # modules
        full = sum(p for _, _, p in MODULES)
        mcards = ''
        for k, cats, p in MODULES:
            nq = sum(counts.get(x, 0) for x in cats)
            meta = f'{nq} {e(M["q"])}' if nq else e(M['examq'])
            if p == 0:
                mcards += (f'<article class="mod free"><span class="badge">{e(M["free"])}</span><h3>{e(M["items"][k][0])}</h3><p>{e(M["items"][k][1])}</p>'
                           f'<p class="mmeta">{meta}</p><p class="mp"><strong>{e(M["free"])}</strong></p><a class="btn btn-gold" href="{APP}">{e(M["openfree"])}</a></article>')
            else:
                mcards += (f'<article class="mod"><h3><span class="lockic" aria-hidden="true">🔒</span> {e(M["items"][k][0])}</h3><p>{e(M["items"][k][1])}</p>'
                           f'<p class="mmeta">{meta}</p><p class="mp"><strong>{money(c, p)}</strong> <span>{e(M["once"])}</span></p><a class="btn btn-ghost" href="{APP}">{e(M["buy"])}</a></article>')
        bd = M['bundle']
        bundle = (f'<article class="mod bundle"><span class="badge">{e(bd["badge"])}</span><div><h3>{e(bd["name"])}</h3><p>{e(bd["desc"])}</p></div>'
                  f'<p class="mp"><s>{money(c, 0, "full")}</s> <strong>{money(c, BUNDLE)}</strong> <span class="save">{e(bd["save"]).replace("{s}", money(c, 0, "save"))}</span></p>'
                  f'<a class="btn btn-primary" href="{APP}">{e(bd["cta"])}</a></article>')
        CAL = '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M8 15l2 2 4-4"/></svg>'
        feats = ''.join(f'<article class="feat"><span class="ico">{CAL if i == 0 else icon(i - 1)}</span><h3>{e(a)}</h3><p>{e(b)}</p></article>' for i, (a, b) in enumerate(t['feat']['items']))
        cards = ''
        for i, (tt, st, d, cta) in enumerate(t['levels']['cards']):
            live = i == 0
            cards += (f'<article class="lvl{" live" if live else ""}"><div class="lvl-top"><span class="lvl-n">{3 - i}</span><span class="tag{" tag-ok" if live else ""}">{e(st)}</span></div><h3>{e(tt)}</h3><p>{e(d)}</p>'
                      + (f'<a class="btn btn-primary" href="{APP}">{e(cta)}</a>' if live else f'<a class="btn btn-ghost" href="{INSTAGRAM}" rel="noopener" title="{e(t["notify"])}">{e(cta)}</a>') + '</article>')
        excards = ''.join(f'<article class="ex"><h3>{e(a)}</h3><p>{e(b)}</p></article>' for a, b in t['exam']['cards'])
        groups = ''
        for g, items in t['prog']['groups']:
            tot = sum(counts.get(k, 0) for k, _ in items)
            groups += f'<div class="grp"><h3>{e(g)} <span>{tot} {e(t["prog"]["qn"])}</span></h3><ul>' + ''.join(f'<li>{e(lbl)}</li>' for _, lbl in items) + '</ul></div>'
        steps = ''.join(f'<li><span class="sn">{i + 1}</span><h3>{e(a)}</h3><p>{e(b)}</p></li>' for i, (a, b) in enumerate(t['method']['steps']))
        wh = t['why']['head']
        why = (f'<table class="cmp"><thead><tr><th scope="col"><span class="sr">{e(n["exam"])}</span></th><th scope="col">{e(wh[1])}</th><th scope="col" class="us">{e(wh[2])}</th></tr></thead><tbody>'
               + ''.join(f'<tr><th scope="row">{e(a)}</th><td>{e(b)}</td><td class="us">{e(cc)}</td></tr>' for a, b, cc in t['why']['rows']) + '</tbody></table>')
        faq = ''.join(f'<details><summary><h3>{e(qq)}</h3></summary><p>{e(a)}</p></details>' for qq, a in t['faq']['items'])
        fr = t['free']; qk = t['quick']
        A = t['all']; U = A['units']
        def num(v):
            s_ = f'{v:,}'
            return s_.replace(',', '.') if c in ('it', 'es') else s_.replace(',', ' ') if c == 'fr' else s_
        TILES = [('plan', '📅', 0, ('app', 'plan')), ('quiz', '❓', 2078, ('tab', 'quiz')), ('open', '✍️', 101, ('tab', 'open')), ('exam', '⏱️', 0, ('app', 'exam')), ('sat', '🍷', 0, ('app', 'sat')),
                 ('games', '🎮', 11, ('tab', 'match')), ('films', '🎬', 68, ('tab', 'film')), ('pods', '🎧', 45, ('tab', 'pod')), ('flash', '🃏', 2528, ('tab', 'flash')),
                 ('maps', '🗺️', 42, ('app', 'atlas')), ('grapes', '🍇', 127, ('app', 'uve')), ('dict', '📖', 323, ('app', 'dict')), ('logic', '🧠', 69, ('tab', 'tf')),
                 ('notes', '🎙️', 0, ('tab', 'notes'))]
        mosaic = ''
        for k, ic, cnt, (kind, tg) in TILES:
            nm, ds = A['tiles'][k]
            cn = f'<span class="mcnt"><b>{num(cnt)}</b> {e(U.get(k, ""))}</span>' if cnt else ''
            act = f'<span class="mgo">{e(A["try"])} →</span>' if kind == 'tab' else f'<span class="mgo">{e(A["open"])} ↗</span>'
            attr = f'href="#{ids["trial"]}" data-tabgo="{tg}"' if kind == 'tab' else f'href="{APP}#go={tg}"'
            mosaic += f'<a class="mt mt-{k}" {attr}><span class="mic" aria-hidden="true">{ic}</span><span class="mtx"><b>{e(nm)}</b><small>{e(ds)}</small></span>{cn}{act}</a>'
        I = t['inside']
        inside = ''.join(f'<figure class="shot"><img src="../img/shots/{v}-{SH}.webp" alt="{e(I["caps"][v])}" width="540" height="1080" loading="lazy"><figcaption>{e(I["caps"][v])}</figcaption></figure>' for v in ['home', 'films', 'pods', 'play', 'atlas', 'study', 'notes'])
        V = t['vs']
        vs = ('<table class="cmp vs"><thead><tr>' + ''.join(f'<th scope="col"{" class=\"us\"" if i == 1 else ""}>{e(x)}</th>' for i, x in enumerate(V['cols'])) + '</tr></thead><tbody>'
              + ''.join('<tr><th scope="row">' + e(r[0]) + '</th>' + ''.join(f'<td{" class=\"us\"" if j == 0 else ""}>{e(x)}</td>' for j, x in enumerate(r[1:])) + '</tr>' for r in V['rows']) + '</tbody></table>')
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
  <a class="brand" href="./"><img class="emb" src="../img/logo-emblem.webp" alt="" width="360" height="384"><img class="wm" src="../img/wordmark.webp" alt="The Wine Goat" width="752" height="294"></a>
  <nav aria-label="{e(n['menu'])}"><button class="burger" aria-expanded="false" aria-controls="menu">{e(n['menu'])}</button><ul id="menu" class="menu">{nav}</ul></nav>
  <div class="acts">
   <details class="langs"><summary aria-label="{e(n['lang'])}">{c.upper()}</summary><ul>{langmenu}</ul></details>
   <a class="login" href="{APP}">{e(n['login'])}</a>
   <a class="btn btn-primary btn-sm" href="{APP}#go=start">{e(n['cta'])}</a>
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
   <div class="ctas"><a class="btn btn-primary" href="#{ids['trial']}">{e(h['cta1'])}</a><a class="btn btn-ghost" href="{APP}#go=start">{e(h['cta_plan'])}</a></div>
   <ul class="ticks">{bullets}</ul>
  </div>
  <div class="hero-art">
   <div class="ring" aria-hidden="true"></div><div class="disc" aria-hidden="true"></div>
   <img class="hg" src="../img/goats/hero.webp" alt="{e(h['img_alt'])}" width="745" height="848" fetchpriority="high">
   <div class="qcard" id="qcard" aria-live="polite"><p class="qk"><span class="pulse" aria-hidden="true"></span>{e(qk['kick'])}</p><div id="qbody"></div><a class="qmore" href="#{ids['trial']}">{e(qk['more'])} ↓</a></div>
  </div>
 </div>
 <div class="wrap stats">{stats}</div>
</section>

<section class="sec mosaic">
 <div class="wrap"><img class="sg sg-mosaic" src="../img/goats/mosaic.webp" alt="" aria-hidden="true" loading="lazy"><h2>{e(A['h2'])}</h2><p class="intro">{e(A['intro'])}</p><div class="mts">{mosaic}</div></div>
</section>

<section class="freeband">
 <div class="wrap freeg"><img class="freegoat" src="../img/goats/free.webp" alt="" width="362" height="469" loading="lazy"><div><span class="tagfree big">{e(fr['tag'])}</span><h2>{e(fr['h'])}</h2><p>{e(fr['p'])}</p></div><div class="freecta"><strong>{counts.get('bdx', 0)}</strong><span>{e(fr['n'])}</span><a class="btn btn-gold" href="{APP}">{e(fr['cta'])}</a></div></div>
</section>

<section id="{ids['trial']}" class="sec explore">
 <div class="wrap"><img class="sg sg-explore" src="../img/goats/explore.webp" alt="" aria-hidden="true" loading="lazy"><h2>{e(X['h2'])}</h2><p class="intro">{e(X['intro'])}</p>
  <div class="tabs" role="tablist" aria-label="{e(X['h2'])}">{tabbar}</div>
  <div class="pans">{pans}</div>
 </div>
</section>

<section class="sec inside">
 <div class="wrap"><img class="sg sg-inside" src="../img/goats/inside.webp" alt="" aria-hidden="true" loading="lazy"><h2>{e(I['h2'])}</h2><p class="intro">{e(I['intro'])}</p></div>
 <div class="shots" tabindex="0" aria-label="{e(I['h2'])}">{inside}</div>
</section>

<section class="sec alt">
 <div class="wrap"><img class="sg sg-vs" src="../img/goats/vs.webp" alt="" aria-hidden="true" loading="lazy"><h2>{e(V['h2'])}</h2><p class="intro">{e(V['intro'])}</p><div class="cmpw">{vs}</div></div>
</section>

<section id="{ids['pricing']}" class="sec">
 <div class="wrap"><img class="sg sg-mods" src="../img/goats/mods.webp" alt="" aria-hidden="true" loading="lazy"><h2>{e(M['h2'])}</h2><p class="intro">{e(M['intro'])}</p><div class="mods">{mcards}{bundle}</div><p class="pnote">{e(M['note'])}</p></div>
</section>

<section class="sec">
 <div class="wrap"><img class="sg sg-feat" src="../img/goats/feat.webp" alt="" aria-hidden="true" loading="lazy"><h2>{e(t['feat']['h2'])}</h2><p class="intro">{e(t['feat']['intro'])}</p><div class="feats">{feats}</div></div>
</section>

<section id="{ids['exam']}" class="sec alt">
 <div class="wrap"><img class="sg sg-exam" src="../img/goats/exam.webp" alt="" aria-hidden="true" loading="lazy"><h2>{e(t['exam']['h2'])}</h2><p class="intro">{e(t['exam']['intro'])}</p><div class="exs">{excards}</div><p class="tip">{e(t['exam']['tip'])}</p></div>
</section>

<section id="guida" class="sec guide">
 <div class="wrap"><img class="sg sg-guide" src="../img/goats/guide.webp" alt="" aria-hidden="true" loading="lazy"><h2>{e(t['guide']['h2'])}</h2><p class="intro">{e(t['guide']['intro'])}</p>
  <div class="gblocks">{''.join(f'<article><h3>{e(a)}</h3><p>{e(b)}</p></article>' for a, b in t['guide']['blocks'])}</div>
  <h3 class="sh">{e(t['guide']['searches_h'])}</h3><ul class="searches">{''.join(f'<li>{e(x)}</li>' for x in t['guide']['searches'])}</ul>
 </div>
</section>

<section id="{ids['program']}" class="sec">
 <div class="wrap"><h2>{e(t['prog']['h2'])}</h2><p class="intro">{e(t['prog']['intro'])}</p><div class="grps">{groups}</div></div>
</section>

<section class="sec dark">
 <div class="wrap"><img class="sg sg-method" src="../img/goats/method.webp" alt="" aria-hidden="true" loading="lazy"><h2>{e(t['method']['h2'])}</h2><ol class="steps">{steps}</ol></div>
</section>

<section id="{ids['levels']}" class="sec">
 <div class="wrap"><img class="sg sg-levels" src="../img/goats/levels.webp" alt="" aria-hidden="true" loading="lazy"><h2>{e(t['levels']['h2'])}</h2><p class="intro">{e(t['levels']['intro'])}</p><div class="lvls">{cards}</div></div>
</section>

<section id="faq" class="sec">
 <div class="wrap narrow"><img class="sg sg-faq" src="../img/goats/faq.webp" alt="" aria-hidden="true" loading="lazy"><h2>{e(t['faq']['h2'])}</h2><div class="faq">{faq}</div></div>
</section>

<section class="sec final">
 <div class="wrap final-g"><img src="../img/goats/final.webp" alt="" width="411" height="474" loading="lazy"><div><h2>{e(t['final']['h2'])}</h2><p>{e(t['final']['p'])}</p><a class="btn btn-gold" href="#{ids['trial']}">{e(t['final']['cta'])}</a></div></div>
</section>
</main>
<footer class="foot">
 <div class="wrap foot-g">
  <div><a class="brand" href="./"><img class="emb" src="../img/logo-emblem.webp" alt="" width="360" height="384" loading="lazy"><img class="wm" src="../img/wordmark-light.webp" alt="The Wine Goat" width="752" height="294" loading="lazy"></a><p>{e(t['foot']['tag'])}</p></div>
  <div><h2 class="fh">{e(t['foot']['langs'])}</h2><ul>{langmenu}</ul></div>
  <div><h2 class="fh">{e(t['foot']['follow'])}</h2><ul><li><a href="{INSTAGRAM}" rel="noopener">Instagram @the.winegoat</a></li><li><a href="{APP}">{e(n['login'])}</a></li></ul></div>
 </div>
 <div class="wrap disc-t"><p>{e(t['foot']['disc'])}</p><p>© {year} The Wine Goat · thewinegoat.com · {e(t['foot']['rights'])}</p></div>
</footer>
<script id="trial-data" type="application/json">{data}</script>
<script>{JS}</script>
</body>
</html>'''
    return page, jsonld
