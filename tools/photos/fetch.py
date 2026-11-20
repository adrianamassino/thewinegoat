"""Fetches up to 1,300 free, HIGH-QUALITY photos from Wikimedia Commons for The Wine Goat (runs in GitHub Actions: the runner
has network access). One photo per search query of tools/photos/queries.csv (the owner's catalogue).

Rules
- Only licences that allow commercial use with attribution: CC0, Public domain, CC BY x.x, CC BY-SA x.x
  (anything else — NC, ND, GFDL-only, "fair use", unknown — is skipped).
- Only photos rated by the Commons community as Featured pictures or Quality images (sharp, well exposed,
  well composed); at least 2000 px wide, landscape or square, no SVG/maps/scans of documents.
- Each photo is saved twice as optimised WebP: 1200 px and 600 px wide, quality 72, metadata stripped,
  with an SEO file name built from the query + Commons title (lowercase ascii-hyphen).
- Everything we need for alt text and credits goes to img/photos/photos.json:
  id, file, file_sm, w, h, category, query, title, description (EN), author, licence, licence_url, source page.
Usage: python3 tools/photos/fetch.py [--limit N]
"""
import csv, html, io, json, os, re, sys, time, unicodedata
import requests
from PIL import Image

API = 'https://commons.wikimedia.org/w/api.php'
OUT = 'img/photos'
PER_Q = 3  # up to 3 rated photos per search
MAX_NEW = 650  # new photos per run: each batch is curated by eye before the next one
S = requests.Session()
S.headers['User-Agent'] = 'TheWineGoatPhotoFetcher/1.0 (https://thewinegoat.com; hello@thewinegoat.com)'
OK_LIC = re.compile(r'^(cc0|public domain|pd\b|pd-|cc by(-sa)? \d)', re.I)
CAT_EN = {'Spirits e distillerie': 'spirits', 'Birra': 'beer', 'Calici e coppe': 'glasses', 'Produttori e vignaioli': 'producers', 'Vigneti e paesaggi': 'vineyards', 'Uva e vitigni': 'grapes', 'Vendemmia e viticoltura': 'harvest',
          'Tenute e château': 'estates', 'Barriques e cantine': 'cellars', 'Champagne e spumanti': 'sparkling',
          'Degustazione e sommelier': 'tasting', 'Bottiglie e servizio': 'service', 'Regioni e terroir': 'regions', 'Sake': 'sake', 'Cocktail e bar': 'cocktails', 'Abbinamenti': 'food'}
BAD = re.compile(r'\b(map|logo|diagram|chart|plan|coat of arms|flag|scan|document|label of|stamp|poster|svg|drawing|engraving|painting|nude)\b', re.I)

def slug(s, n=70):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    return s[:n].rstrip('-') or 'photo'

def strip(v): return html.unescape(re.sub(r'<[^>]+>', '', v or '')).strip()

QUALITY = ['incategory:"Featured pictures on Wikimedia Commons"', 'incategory:"Quality images"']

GENERIC = set('photography photograph photo close up closeup detail details view landscape aerial shot image images picture high quality beautiful scenic'.split())

def core(q):
    w = [x for x in q.split() if x.lower() not in GENERIC]
    return ' '.join(w[:3]) or q

def api(p):
    for attempt in range(4):
        try:
            r = S.get(API, params=p, timeout=60)
            if r.status_code == 429: time.sleep(10 * (attempt + 1)); continue
            pages = r.json().get('query', {}).get('pages', {})
            return sorted(pages.values(), key=lambda x: x.get('index', 99))
        except Exception: time.sleep(5)
    return []

def search(q, cat):
    """Only photos the Commons community rated Featured or Quality images (sharp, well exposed, good composition).
    Three kinds of query: 'cat:Name' = every rated photo of a Commons category and its subcategories (falls back to the
    category alone, then to a text search of its name); '=words' = text search of exactly these words; anything else =
    text search of the first three meaningful words (the owner's original catalogue)."""
    p = {'action': 'query', 'format': 'json', 'generator': 'search', 'gsrnamespace': 6,
         'gsrlimit': 30, 'prop': 'imageinfo', 'iiprop': 'url|size|mime|extmetadata', 'iiurlwidth': 1600, 'iiextmetadatalanguage': 'en'}
    if q.startswith('cat:'):
        name = q[4:].strip(); p['gsrlimit'] = 50
        for expr in (f'deepcategory:"{name}"', f'incategory:"{name}"'):   # no bare-name fallback: it returned birds for "Merlot" and Iran for "Syrah"
            pages = api(dict(p, gsrsearch=f'{expr} filetype:bitmap {cat}'))
            if pages: return pages
        return []
    return api(dict(p, gsrsearch=f'{q[1:].strip() if q.startswith("=") else core(q)} filetype:bitmap {cat}'))

def series(t):
    """same photo series (titles that differ only by a number or a short suffix) -> one key"""
    return re.sub(r'[\d\W_]+', ' ', t.rsplit('.', 1)[0].lower()).strip()[:60]

def download(url):
    for attempt in range(3):
        r = S.get(url, timeout=60)
        if r.status_code == 429: time.sleep(15 * (attempt + 1)); continue
        r.raise_for_status()
        return Image.open(io.BytesIO(r.content)).convert('RGB')
    raise IOError('429')

def main():
    limit = int(sys.argv[sys.argv.index('--limit') + 1]) if '--limit' in sys.argv else 1300
    os.makedirs(OUT, exist_ok=True)
    man_p = f'{OUT}/photos.json'
    man = json.load(open(man_p)) if os.path.exists(man_p) else []
    keep = [m for m in man if m.get('quality')]
    for m in man:
        if not m.get('quality'):
            for k in ('file', 'file_sm'):
                try: os.remove(f"{OUT}/{m[k]}")
                except OSError: pass
    if len(keep) != len(man): print(f'purged {len(man) - len(keep)} photos without a Commons quality rating')
    man = keep
    seen_titles = {m['title'] for m in man}; done_q = {m['query'] for m in man}
    # photos removed during the visual curation (tools/photos/rejected.json) are never fetched again, their searches count as done
    rej_p = 'tools/photos/rejected.json'
    rej = json.load(open(rej_p, encoding='utf-8')).get('rejected', []) if os.path.exists(rej_p) else []
    seen_titles |= {x['title'] for x in rej}; done_q |= {x['query'] for x in rej}
    seen_series = {series(t) for t in seen_titles}
    next_id = max([m['id'] for m in man] + [x['id'] for x in rej] + [0]) + 1
    rows = list(csv.DictReader(open('tools/photos/queries.csv', encoding='utf-8-sig')))
    if os.path.exists('tools/photos/queries_extra.csv'):  # spirits, beer, glasses, producers
        extra = list(csv.DictReader(open('tools/photos/queries_extra.csv', encoding='utf-8-sig')))
        # interleave: every 4th search is an extra theme so the mix stays varied
        mixed, ei = [], 0
        for i, r in enumerate(rows):
            mixed.append(r)
            if i % 4 == 3 and ei < len(extra): mixed.append(extra[ei]); ei += 1
        rows = mixed + extra[ei:]
        # the specific searches (Commons categories 'cat:' and exact phrases '=') first: they match the course topics
        rows = sorted(rows, key=lambda r: 0 if r['Ricerca immagine'].strip()[:4] == 'cat:' or r['Ricerca immagine'].strip()[:1] == '=' else 1)
    skipped = 0
    start = len(man)
    for row in rows:
        if len(man) >= limit or len(man) - start >= MAX_NEW: break   # the rest comes with the next run, after the visual curation
        q = row['Ricerca immagine'].strip()
        if q in done_q: continue
        got = 0; per_q = int(row.get('Max') or 0) or (10 if q.startswith('cat:') else PER_Q); ser = set()
        cands = [(c, pg) for c in QUALITY for pg in search(q, c)]
        for qcat, page in cands:
            t = page.get('title', ''); ii = (page.get('imageinfo') or [{}])[0]; md = ii.get('extmetadata', {})
            if t in seen_titles or ii.get('mime') not in ('image/jpeg', 'image/png', 'image/webp'): continue
            w, h = ii.get('width', 0), ii.get('height', 0)
            if w < 2000 or h > w * 1.05 or w > h * 2.6: continue
            lic = strip(md.get('LicenseShortName', {}).get('value'))
            if not OK_LIC.match(lic) or re.search(r'\bnc\b|\bnd\b|non-?commercial|no deriv', lic, re.I): continue
            desc = strip(md.get('ImageDescription', {}).get('value'))
            if BAD.search(t) or BAD.search(desc[:200]): continue
            if series(t) in ser or series(t) in seen_series: continue
            try: im = download(ii.get('thumburl') or ii['url'])
            except Exception: continue
            ser.add(series(t)); seen_series.add(series(t))
            n = next_id; next_id += 1; base = f"{n:04d}-{slug(q.replace('cat:', ''), 40)}-{slug(t.replace('File:', '').rsplit('.', 1)[0], 40)}"
            files = {}
            for wd, suf in ((1200, ''), (600, '-sm')):
                x = im.copy(); x.thumbnail((wd, wd * 2), Image.LANCZOS)
                fn = f'{base}{suf}.webp'; x.save(f'{OUT}/{fn}', 'WEBP', quality=72, method=6); files[suf] = (fn, x.size)
            man.append({'id': n, 'file': files[''][0], 'file_sm': files['-sm'][0], 'w': files[''][1][0], 'h': files[''][1][1],
                        'category': CAT_EN.get(row['Categoria'], 'wine'), 'query': q, 'title': t,
                        'description': desc[:400], 'author': strip(md.get('Artist', {}).get('value'))[:160] or 'Unknown author',
                        'licence': lic, 'licence_url': strip(md.get('LicenseUrl', {}).get('value')),
                        'source': ii.get('descriptionurl', ''), 'quality': 'featured' if 'Featured' in qcat else 'quality'})
            seen_titles.add(t); done_q.add(q); got += 1
            print(f'{n} {q} -> {t} [{lic}]', flush=True)
            if got >= per_q: break
        if not got: skipped += 1
        time.sleep(0.3)
        if len(man) % 50 == 0: json.dump(man, open(man_p, 'w'), ensure_ascii=False, indent=0)
    json.dump(man, open(man_p, 'w'), ensure_ascii=False, indent=0)
    print(f'done: {len(man)} photos, {skipped} queries without a usable free photo')

if __name__ == '__main__': main()
