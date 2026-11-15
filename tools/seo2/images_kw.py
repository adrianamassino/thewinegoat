# -*- coding: utf-8 -*-
"""Add keywords to every guide infographic: visible keyword chips on the image, XMP metadata
(title, description, keywords, creator, rights) embedded in the WebP, keyword-rich alt/title,
'keywords' on the ImageObject and keyword image titles in sitemap.xml.
Idempotent: chips are drawn on a clean copy kept in img/guides/_src/.  Run from repo root."""
import re, glob, os, json, html, shutil
from PIL import Image, ImageDraw, ImageFont
SITE = 'https://thewinegoat.com'; SRC = 'tools/seo2/img_src'; os.makedirs(SRC, exist_ok=True)
FONT = ImageFont.truetype(os.path.join(os.path.dirname(__file__), 'fonts/dmsans-700.ttf'), 21)
INF = {'en': 'infographic', 'it': 'infografica', 'fr': 'infographie', 'es': 'infografía'}
e = html.escape
def lang_of(p):
    for l in ('it', 'fr', 'es'):
        if p.startswith(l + '/'): return l
    return 'en'
def chips(img, kws):
    d = ImageDraw.Draw(img); x1 = 1160; y = 52
    for k in kws[:4]:
        w = d.textlength(k, font=FONT) + 34
        if w > 430: continue
        d.rounded_rectangle((x1 - w, y, x1, y + 40), radius=20, fill=(242, 207, 135), outline=None)
        d.text((x1 - w + 17, y + 8), k, font=FONT, fill=(92, 21, 48))
        y += 52
    return img
def xmp(title, desc, kws, lang):
    li = ''.join(f'<rdf:li>{e(k)}</rdf:li>' for k in kws)
    return (f'<?xpacket begin="" id="W5M0MpCehiHzreSzNTczkc9d"?><x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">'
            f'<rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/" xmlns:xmpRights="http://ns.adobe.com/xap/1.0/rights/" xmlns:Iptc4xmpCore="http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/">'
            f'<dc:title><rdf:Alt><rdf:li xml:lang="{lang}">{e(title)}</rdf:li></rdf:Alt></dc:title><dc:description><rdf:Alt><rdf:li xml:lang="{lang}">{e(desc)}</rdf:li></rdf:Alt></dc:description>'
            f'<dc:subject><rdf:Bag>{li}</rdf:Bag></dc:subject><dc:creator><rdf:Seq><rdf:li>The Wine Goat</rdf:li></rdf:Seq></dc:creator>'
            f'<dc:rights><rdf:Alt><rdf:li xml:lang="x-default">© The Wine Goat – thewinegoat.com</rdf:li></rdf:Alt></dc:rights><photoshop:Credit>The Wine Goat</photoshop:Credit>'
            f'<xmpRights:WebStatement>{SITE}/</xmpRights:WebStatement></rdf:Description></rdf:RDF></x:xmpmeta><?xpacket end="w"?>').encode('utf8')

sm = open('sitemap.xml', encoding='utf8').read(); n = 0
for p in sorted(glob.glob('**/index.html', recursive=True)):
    if p.startswith(('app/', 'tools/')): continue
    s = open(p, encoding='utf8').read()
    m = re.search(r'<figure class="seofig"><img src="(/img/guides/[^"]+)" alt="([^"]*)" title="([^"]*)"', s)
    if not m: continue
    src, l = m.group(1), lang_of(p)
    h1 = html.unescape(m.group(3))
    kw = re.search(r'<meta name="keywords" content="([^"]*)"', s)
    kws = [k.strip() for k in html.unescape(kw.group(1)).split(',') if k.strip()] if kw else []
    if not kws: kws = [h1]
    kws = list(dict.fromkeys(kws))[:8]
    d = re.search(r'<meta name="description" content="([^"]*)"', s); desc = html.unescape(d.group(1)) if d else h1
    # image: chips + XMP
    f = src.lstrip('/'); keep = os.path.join(SRC, os.path.basename(f))
    if not os.path.exists(keep): shutil.copy(f, keep)
    im = chips(Image.open(keep).convert('RGB'), [k for k in kws if len(k) <= 32][:3])
    im.save(f, 'WEBP', quality=80, method=6, xmp=xmp(f'{h1} – {INF[l]}', desc, kws + ['The Wine Goat', 'WSET'], l))
    # alt / title
    alt = f'{h1} – {", ".join(kws[:3])} ({INF[l]} The Wine Goat)'
    if len(alt) > 150: alt = f'{h1} – {", ".join(kws[:2])} ({INF[l]})'
    if len(alt) > 160: alt = alt[:157].rsplit(' ', 1)[0] + '…'
    title = f'{h1} | {kws[0]}' if kws[0].lower() not in h1.lower() else h1
    s = s.replace(m.group(0), f'<figure class="seofig"><img src="{src}" alt="{e(alt)}" title="{e(title)}"', 1)
    s = re.sub(r'(<meta property="og:image:alt" content=")[^"]*(")', lambda mm: mm.group(1) + e(alt) + mm.group(2), s)
    def ld(mm):
        try: J = json.loads(mm.group(1))
        except Exception: return mm.group(0)
        def walk(o):
            if isinstance(o, dict):
                if o.get('@type') == 'ImageObject' and src in str(o.get('url', '')):
                    o['keywords'] = ', '.join(kws); o['description'] = alt; o['name'] = title
                    o['creditText'] = 'The Wine Goat'; o['copyrightNotice'] = '© The Wine Goat'; o['creator'] = {'@type': 'Organization', 'name': 'The Wine Goat', 'url': SITE + '/'}
                    o['acquireLicensePage'] = SITE + '/'
                for v in o.values(): walk(v)
            elif isinstance(o, list):
                for v in o: walk(v)
        walk(J); return '<script type="application/ld+json">' + json.dumps(J, ensure_ascii=False) + '</script>'
    s = re.sub(r'<script type="application/ld\+json">(.*?)</script>', ld, s, flags=re.S)
    open(p, 'w', encoding='utf8').write(s)
    full = SITE + src
    sm = re.sub(rf'(<image:image><image:loc>{re.escape(full)}</image:loc>)(?:<image:(?:title|caption)>.*?</image:(?:title|caption)>)*',
                lambda mm: mm.group(1) + f'<image:caption>{e(alt)}</image:caption><image:title>{e(title)}</image:title>', sm)
    n += 1
open('sitemap.xml', 'w', encoding='utf8').write(sm)
print(n, 'images updated')
