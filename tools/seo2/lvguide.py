# -*- coding: utf-8 -*-
"""Complete level guides in the format of /wset-level-1/ and /wset-level-2/ ("lvpage"): WSET Level 3 (group wset-level-3)
and the Level 4 Diploma (group wset-diploma-level-4), in en/it/fr/es. Content: tools/seo2/lvguide/<key>_<lang>.py (C = {...}).
Header and footer are copied from the Level 2 guide of the same language; slugs from tools/site_i18n/slugs.json.
The other languages come from tools/site_i18n (es-ar derived from es; the 14 others from translation files).

    python3 tools/seo2/lvguide.py              # write the 8 pages + llms.txt / llms-full.txt blocks
    python3 tools/seo2/lvguide.py --images     # also render the infographics (img/guides/<name>.webp, Playwright)
    then: python3 tools/site_i18n/build.py es-ar --group wset-level-3,wset-diploma-level-4   (es-ar + hreflang, hooks)

Never touches other pages. The Diploma page used to be built by tools/seo2/build.py (content3 'diploma') + expand.py:
both now skip it (its earlier text lives in tools/seo2/lvguide/l4_<lang>.py)."""
import os, sys, re, json, html, importlib.util, datetime, subprocess
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
os.chdir(ROOT)
e = html.escape
SITE = 'https://thewinegoat.com'
LANGS = ['en', 'it', 'fr', 'es']
GROUPS = {'wset-level-3': 'l3', 'wset-diploma-level-4': 'l4'}
IMG_SUFFIX = {'wset-level-3': '', 'wset-diploma-level-4': '-guide'}


def img_name(g, l):  # descriptive, localized file name: wset-livello-3-it.webp, wset-diploma-level-4-guide.webp
    return SL[g][l].strip('/').split('/')[-1] + IMG_SUFFIX[g] + ('' if l == 'en' else '-' + l)
CRED = {'wset-level-3': 'WSET Level 3 Award in Wines', 'wset-diploma-level-4': 'WSET Level 4 Diploma in Wines'}
SL = json.load(open('tools/site_i18n/slugs.json', encoding='utf8'))
DATE = datetime.date.today().isoformat()
HOME = {'en': '/', 'it': '/it/', 'fr': '/fr/', 'es': '/es/'}
HOMEL = {'en': 'Home', 'it': 'Home', 'fr': 'Accueil', 'es': 'Inicio'}
FAQH = {'en': 'Frequently asked questions', 'it': 'Domande frequenti', 'fr': 'Questions fréquentes', 'es': 'Preguntas frecuentes'}
MORE = {'en': 'More WSET resources', 'it': 'Altre risorse WSET', 'fr': 'Plus de ressources WSET', 'es': 'Más recursos WSET'}
QA = {'en': ('Show the answer', 'Points that score marks', 'Model answer'), 'it': ('Mostra la risposta', 'I punti che valgono', 'Risposta modello'),
      'fr': ('Voir la réponse', 'Les points qui rapportent', 'Réponse modèle'), 'es': ('Ver la respuesta', 'Los puntos que puntúan', 'Respuesta modelo')}
INF = {'en': 'infographic with the key points', 'it': 'infografica con i punti chiave', 'fr': 'infographie avec les points clés', 'es': 'infografía con los puntos clave'}
REL = ['wset-level-1', 'wset-level-2', 'wset-level-3', 'wset-diploma-level-4', 'wset-levels-explained', 'wset-level-2-vs-level-3', 'wset-diploma-study-tips', 'is-wset-worth-it']
B, E_ = '<!--lvguide-->', '<!--/lvguide-->'


def content(key, l):
    p = f'tools/seo2/lvguide/{key}_{l}.py'
    spec = importlib.util.spec_from_file_location(f'{key}_{l}', p); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    return m.C


def url(g, l): return SL[g][l]


def h1_of(g, l):
    """H1 of an existing page (for link texts)"""
    if g in GROUPS and os.path.exists(f'tools/seo2/lvguide/{GROUPS[g]}_{l}.py'): return content(GROUPS[g], l)['h1']
    p = SL[g][l].strip('/') + '/index.html'
    m = re.search(r'<h1[^>]*>(.*?)</h1>', open(p, encoding='utf8').read(), re.S)
    return html.unescape(re.sub(r'<[^>]+>', '', m.group(1))).strip()


def block(b, l, C):
    k = b[0]
    if k == 'p': return f'<p>{e(b[1])}</p>'
    if k == 'h3': return f'<h3>{e(b[1])}</h3>'
    if k == 'tip': return f'<p class="tipbox">{e(b[1])}</p>'
    if k == 'glance': return '<dl class="lvgl">' + ''.join(f'<div><dt>{e(a)}</dt><dd>{e(c)}</dd></div>' for a, c in b[1]) + '</dl>'
    if k == 'list': return '<ul class="lvlist">' + ''.join(f'<li>{e(x)}</li>' for x in b[1]) + '</ul>'
    if k == 'chips': return '<ul class="lvgr">' + ''.join(f'<li>{e(x)}</li>' for x in b[1]) + '</ul>'
    if k == 'traps': return '<ul class="lvtraps">' + ''.join(f'<li>{e(x)}</li>' for x in b[1]) + '</ul>'
    if k in ('tips', 'ol'):
        t = 'ol' if k == 'ol' else 'ul'
        return f'<{t} class="tips">' + ''.join(f'<li>{e(x)}</li>' for x in b[1]) + f'</{t}>'
    if k == 'how': return '<ol class="lvhow">' + ''.join(f'<li><h3>{e(a)}</h3><p>{e(c)}</p></li>' for a, c in b[1]) + '</ol>'
    if k == 'table':
        head, rows = b[1], b[2]
        t = '<div class="tblw"><table class="lvtab"><thead><tr>' + ''.join(f'<th>{e(h)}</th>' for h in head) + '</tr></thead><tbody>'
        for r in rows:
            t += '<tr>' + ''.join((f'<th scope="row">{e(c)}</th>' if i == 0 else f'<td data-l="{e(head[i])}">{e(c)}</td>') for i, c in enumerate(r)) + '</tr>'
        return t + '</tbody></table></div>'
    if k == 'cmp':
        head, rows, cur = b[1], b[2], b[3]
        cl = lambda i: ' class=cur' if i == cur else ''
        t = '<div class="lvcmpw"><table class="lvcmp"><thead><tr>' + ''.join((f'<th></th>' if i == 0 else f'<th scope="col"{cl(i)}>{e(h)}</th>') for i, h in enumerate(head)) + '</tr></thead><tbody>'
        for r in rows:
            t += '<tr>' + ''.join((f'<th scope="row">{e(c)}</th>' if i == 0 else f'<td{cl(i)}>{e(c)}</td>') for i, c in enumerate(r)) + '</tr>'
        return t + '</tbody></table></div>'
    if k == 'more': return '<p class="lvmore">' + ' · '.join(f'<a href="{url(g, l)}">{e(t)}</a>' for g, t in b[1]) + '</p>'
    if k == 'links': return '<ul class="tips lvlinks">' + ''.join(f'<li><a href="{url(g, l)}"><strong>{e(t)}</strong></a>: {e(d)}</li>' for g, t, d in b[1]) + '</ul>'
    if k == 'qs':
        out = '<div class="sqs">'
        for n, (q, opts, ok, why) in enumerate(b[1], 1):
            order = [(j + n * 3) % len(opts) for j in range(len(opts))]
            out += f'<article class="sq"><h3><span class="sqn">{n}</span> {e(q)}</h3><ol class="sq-os" type="A">' + ''.join(f'<li><button type="button" class="sq-o" data-ok="{1 if i == ok else 0}">{e(opts[i])}</button></li>' for i in order) + '</ol>'
            out += f'<details class="sq-a"><summary>{e(QA[l][0])}</summary><p><strong>{e(opts[ok])}</strong> — {e(why)}</p></details></article>'
        return out + '</div>'
    if k == 'saq':
        s = b[1]
        return (f'<article class="saq"><p class="saq-ctx">{e(s["ctx"])}</p><h3>{e(s["q"])} <span class="mk">({e(s["marks"])})</span></h3>'
                f'<details class="sq-a"><summary>{e(QA[l][2])}</summary><p>{e(s["model"])}</p><p><strong>{e(QA[l][1])}:</strong> {e(s["points"])}</p></details></article>')
    if k == 'soon':
        s = b[1]
        return ('</section><section class="lvsoon" id="soon"><img src="/img/goats/goat-on-wine-barrel-raising-red-wine.webp" alt="" width="216" height="300" loading="lazy" decoding="async">'
                f'<div><p class="lvk">{e(s["tag"])}</p><h2>{e(s["h2"])}</h2><p>{e(s["p"])}</p><div class="ctas">' + ''.join(f'<a class="{c}" href="{h}">{e(t)}</a>' for t, h, c in s['btns']) + '</div></div>')
    if k == 'faq':
        return f'</section><section class="seosec"><h2>{e(FAQH[l])}</h2>' + ''.join(f'<details class="faqi"><summary>{e(q)}</summary><p>{e(a)}</p></details>' for q, a in C['faq'])
    if k == 'sec': return f'</section><section class="seosec"><h2>{e(b[1])}</h2>'
    if k == 'secmore': return f'</section><section class="seosec more"><h2>{e(b[1])}</h2>'
    raise ValueError(k)


def template(l):
    s = open(url('wset-level-2', l).strip('/') + '/index.html', encoding='utf8').read()
    i = s.find('<body'); j = s.find('<main'); k = s.find('</main>')
    return s[i:j], s[k:]


def page(g, l):
    key = GROUPS[g]; C = content(key, l); slug = url(g, l); u = SITE + slug
    img = f'/img/guides/{img_name(g, l)}.webp'
    has_img = os.path.exists(img.lstrip('/'))
    alts = ''.join(f'<link rel="alternate" hreflang="{x}" href="{SITE}{url(g, x)}">' for x in LANGS) + f'<link rel="alternate" hreflang="x-default" href="{SITE}{url(g, "en")}">'
    ogimg = SITE + (img if has_img else f'/img/og-{l}.png')
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "Article", "headline": C['h1'], "description": C['desc'], "inLanguage": l, "url": u, "datePublished": DATE, "dateModified": DATE,
         "author": {"@id": SITE + "/#organization"}, "publisher": {"@id": SITE + "/#organization"},
         "about": {"@type": "EducationalOccupationalCredential", "name": CRED[g], "credentialCategory": "diploma" if key == 'l4' else "certificate"},
         "image": ogimg, "isPartOf": {"@id": SITE + "/#website"}},
        {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in C['faq']]},
        {"@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": HOMEL[l], "item": SITE + HOME[l]}, {"@type": "ListItem", "position": 2, "name": C['crumb']}]}]}
    head = f'''<!DOCTYPE html>
<html lang="{l}">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(C['title'])}</title>
<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" href="/img/favicon-48.png" type="image/png" sizes="48x48"><link rel="icon" href="/img/favicon-192.png" type="image/png" sizes="192x192"><link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
<meta name="description" content="{e(C['desc'])}">
<meta name="keywords" content="{e(C['kw'])}">
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large">
<link rel="canonical" href="{u}">{alts}
<meta property="og:type" content="article"><meta property="og:site_name" content="The Wine Goat"><meta property="og:title" content="{e(C['title'])}"><meta property="og:description" content="{e(C['desc'])}"><meta property="og:url" content="{u}"><meta property="og:image" content="{ogimg}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="{e(C['h1'])} ({e(INF[l])})"><meta name="twitter:image" content="{ogimg}"><meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="/assets/site.css"><link rel="stylesheet" href="/assets/seo.css">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
</head>'''
    top, bottom = template(l)
    bottom = re.sub(r'\d{4}-\d\d-\d\d(</p></div></footer>)', DATE + r'\1', bottom, count=1)
    body = f'<main><article class="wrap seo lvpage"><nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="{HOME[l]}">{e(HOMEL[l])}</a></li><li aria-current="page">{e(C["crumb"])}</li></ol></nav>'
    body += f'<p class="lvk lvtag">{e(C["tag"])}</p><h1>{e(C["h1"])}</h1>'
    body += ''.join(f'<p class="lead">{e(x)}</p>' for x in ([C['lead']] if isinstance(C['lead'], str) else C['lead']))
    if has_img:
        body += f'<figure class="seofig"><img src="{img}" alt="{e(C["h1"])} ({e(INF[l])})" title="{e(C["h1"])}" width="1200" height="630" decoding="async" fetchpriority="high"><figcaption>{e(C["fig"]["cap"])}</figcaption></figure>'
    body += '<div class="ctas">' + ''.join(f'<a class="{c}" href="{h}">{e(t)}</a>' for t, h, c in C['ctas']) + '</div>'
    secs = ''.join(block(b, l, C) for b in C['body'])
    body += (secs[len('</section>'):] if secs.startswith('</section>') else '<section class="seosec">' + secs) + '</section>'
    rel = [x for x in REL if x != g and x in SL and l in SL[x]]
    body += f'<section class="seosec rel"><h2>{e(MORE[l])}</h2><ul class="rel-l">' + ''.join(f'<li><a href="{url(x, l)}">{e(h1_of(x, l))}</a></li>' for x in rel) + '</ul></section></article>'
    doc = head + top + body + bottom
    out = slug.strip('/') + '/index.html'
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, 'w', encoding='utf8').write(doc)
    return out


def words(p):
    s = open(p, encoding='utf8').read(); a = s.find('<main'); b = s.rfind('</main>')
    t = re.sub(r'<script\b.*?</script>', ' ', s[a:b], flags=re.S)
    return len(html.unescape(re.sub(r'<[^>]+>', ' ', t)).split())


def llms():
    """llms.txt: one line per guide (4 languages); llms-full.txt: English full text, placed before the study-notes block."""
    lines = []
    G = {g: k for g, k in GROUPS.items() if os.path.exists(f'tools/seo2/lvguide/{k}_en.py')}
    for g, key in G.items():
        C = content(key, 'en')
        lines.append(f'- [{C["h1"]}]({SITE}{url(g, "en")}): {C["desc"]} · ' + ' · '.join(f'[{x}]({SITE}{url(g, x)})' for x in ('it', 'fr', 'es')))
    blk = '\n## Complete guides by level: WSET Level 3 and Level 4 Diploma\n' + '\n'.join(lines) + '\n'
    lt = open('llms.txt', encoding='utf8').read()
    lt = re.sub(r'\n## Complete guides by level: WSET Level 3 and Level 4 Diploma\n.*?(?=\n## |\Z)', '', lt, flags=re.S)
    m = re.search(r'\n## WSET Level 3 guides\n', lt)
    lt = lt[:m.start()] + blk + lt[m.start():] if m else lt.rstrip() + '\n' + blk
    open('llms.txt', 'w', encoding='utf8').write(lt)
    def txt(C):
        o = [C['lead'] if isinstance(C['lead'], str) else '\n'.join(C['lead'])]
        for b in C['body']:
            k = b[0]
            if k in ('sec', 'secmore'): o.append('\n### ' + b[1])
            elif k in ('p', 'tip', 'h3'): o.append(b[1])
            elif k in ('list', 'tips', 'traps', 'chips', 'ol'): o += ['- ' + x for x in b[1]]
            elif k == 'glance': o += [f'- {a}: {c}' for a, c in b[1]]
            elif k == 'how': o += [f'- {a}: {c}' for a, c in b[1]]
            elif k in ('table', 'cmp'): o += [' | '.join(b[1])] + [' | '.join(r) for r in b[2]]
            elif k == 'qs': o += [f'Q: {q} A: {opts[ok]} ({why})' for q, opts, ok, why in b[1]]
            elif k == 'saq': o.append(f'Q: {b[1]["q"]} ({b[1]["marks"]}) Model answer: {b[1]["model"]}')
            elif k == 'links': o += [f'- {t} ({SITE}{url(g, "en")}): {d}' for g, t, d in b[1]]
        return '\n'.join(o) + ''.join(f'\nQ: {q}\nA: {a}' for q, a in C['faq'])
    full = '# Complete level guides (WSET Level 3 and Level 4 Diploma)\n\n' + '\n\n'.join(
        f'## {content(k, "en")["h1"]}\nURL: {SITE}{url(g, "en")}\nLanguage: en\n\n{txt(content(k, "en"))}' for g, k in G.items()) + '\n\n'
    lf = open('llms-full.txt', encoding='utf8').read()
    lf = re.sub(r'# Complete level guides \(WSET Level 3 and Level 4 Diploma\)\n.*?(?=\n# )\n', '', lf, flags=re.S)
    i = lf.find('# Study notes (all pages)')
    lf = lf[:i] + full + lf[i:] if i >= 0 else lf.rstrip() + '\n\n' + full
    open('llms-full.txt', 'w', encoding='utf8').write(lf)


def sitemap():
    """en/it/fr/es URLs of these guides in sitemap.xml if missing (alternates are filled by tools/site_i18n/build.py sync).
    When tools/seo_tech/sitemaps.py exists it is the only sitemap writer, and this step does nothing."""
    if os.path.exists('tools/seo_tech/sitemaps.py') or not os.path.exists('sitemap.xml'): return
    sm = open('sitemap.xml', encoding='utf8').read(); add = ''
    for g in GROUPS:
        for l in LANGS:
            p = url(g, l)
            if os.path.exists(p.strip('/') + '/index.html') and f'<loc>{SITE}{p}</loc>' not in sm:
                add += f'<url><loc>{SITE}{p}</loc><lastmod>{DATE}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n'
    if add:
        sm = sm.replace('</urlset>', add + '</urlset>'); open('sitemap.xml', 'w', encoding='utf8').write(sm)


# ------------------------------------------------------------------ infographics
def chips(img, kws):
    from PIL import ImageDraw, ImageFont
    font = ImageFont.truetype('tools/seo2/fonts/dmsans-700.ttf', 21)
    d = ImageDraw.Draw(img); x1 = 1160; y = 52
    for k in kws[:3]:
        w = d.textlength(k, font=font) + 34
        if w > 430: continue
        d.rounded_rectangle((x1 - w, y, x1, y + 40), radius=20, fill=(242, 207, 135))
        d.text((x1 - w + 17, y + 8), k, font=font, fill=(92, 21, 48)); y += 52
    return img


def images():
    from PIL import Image
    tmp = '/tmp/twg_lvguide'; os.makedirs(tmp, exist_ok=True)
    F = f'file://{ROOT}/fonts'
    goat = {'wset-level-3': 'goat-in-beret-with-magnifying-glass.webp', 'wset-diploma-level-4': 'trophy.webp'}
    jobs = []
    for g, key in GROUPS.items():
        for l in LANGS:
            if not os.path.exists(f'tools/seo2/lvguide/{key}_{l}.py') or ('--group' in sys.argv and g not in sys.argv[sys.argv.index('--group') + 1].split(',')): continue
            C = content(key, l); f = C['fig']; h1 = C['h1']
            fs = 54 if len(h1) < 55 else 46 if len(h1) < 75 else 40
            lis = ''.join(f'<li>{e(p)}</li>' for p in f['points'])
            doc = f'''<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{{font-family:Fraunces;font-weight:800;src:url({F}/fraunces-800.woff2)}}@font-face{{font-family:"DM Sans";font-weight:400;src:url({F}/dmsans-400.woff2)}}@font-face{{font-family:"DM Sans";font-weight:700;src:url({F}/dmsans-700.woff2)}}
html,body{{margin:0;width:1200px;height:630px;overflow:hidden}}
body{{background:radial-gradient(900px 500px at 100% 0%,#9b2c52 0%,transparent 60%),linear-gradient(135deg,#5c1530,#7a1f3d 55%,#3d1022);font-family:"DM Sans",sans-serif;color:#fff;position:relative}}
.k{{position:absolute;left:64px;top:56px;font-weight:700;letter-spacing:.14em;font-size:22px;color:#f2cf87;text-transform:uppercase}}
h1{{position:absolute;left:64px;top:96px;width:740px;margin:0;font-family:Fraunces,Georgia,serif;font-weight:800;font-size:{fs}px;line-height:1.08}}
ul{{position:absolute;left:64px;bottom:96px;width:740px;margin:0;padding:0;list-style:none;display:grid;gap:12px}}
li{{font-size:23px;line-height:1.3;padding-left:34px;position:relative;color:#fbeef2}}li:before{{content:"";position:absolute;left:0;top:8px;width:16px;height:16px;border-radius:50%;background:#f2cf87}}
img{{position:absolute;right:30px;bottom:40px;width:350px;height:350px;object-fit:contain;filter:drop-shadow(0 18px 30px rgba(0,0,0,.35))}}
.b{{position:absolute;left:64px;bottom:40px;font-size:20px;color:#f2cf87;font-weight:700}}
</style></head><body><div class="k">{e(f['kicker'])}</div><h1>{e(h1)}</h1><ul>{lis}</ul><img src="file://{ROOT}/img/goats/{goat[g]}"><div class="b">thewinegoat.com</div></body></html>'''
            name = img_name(g, l)
            open(f'{tmp}/{name}.html', 'w', encoding='utf8').write(doc)
            kws = [k.strip() for k in C['kw'].split(',') if k.strip() and len(k.strip()) <= 32]
            jobs.append((f'{tmp}/{name}.html', f'{tmp}/{name}.png', f'img/guides/{name}.webp', kws))
    js = ("const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:630}});const J=%s;"
          "for(const [u,o] of J){await p.goto('file://'+u,{waitUntil:'load'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(150);await p.screenshot({path:o});}await b.close();})();") % json.dumps([[h, png] for h, png, _, _ in jobs])
    open(f'{tmp}/render.js', 'w').write(js)
    subprocess.run(f'NODE_PATH=$(npm root -g) node {tmp}/render.js', shell=True, check=True)
    for _, png, webp, kws in jobs:
        chips(Image.open(png).convert('RGB'), kws).save(webp, 'WEBP', quality=82, method=6)
    print(len(jobs), 'infographics')


if __name__ == '__main__':
    if '--images' in sys.argv: images()
    for g in GROUPS:
        for l in LANGS:
            if os.path.exists(f'tools/seo2/lvguide/{GROUPS[g]}_{l}.py'):
                p = page(g, l); print(f'{p:55} {words(p):5} words')
    llms()
    sitemap()
    os.system(f'{sys.executable} tools/lvseries.py --quiet')  # Level 1 → 4 series links (only guides that exist in each language)
    if os.path.exists('tools/seo_tech/cta.py'): os.system(f'{sys.executable} tools/seo_tech/cta.py --quiet')  # conversion buttons
