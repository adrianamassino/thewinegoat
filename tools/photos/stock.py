"""High-quality free stock photos from Pixabay, Pexels and Unsplash for The Wine Goat (runs in GitHub Actions).
API keys come from repository secrets (never from the repo): PIXABAY_API_KEY, PEXELS_API_KEY, UNSPLASH_ACCESS_KEY.
A source whose key is missing is skipped.

Quality bar ("only beautiful, high-quality photos"):
- Pixabay: photo type, editors_choice=true first, min 3000 px wide, landscape; sorted by popularity.
- Pexels: landscape, large size, original width >= 3000 px (Pexels photos are curated).
- Unsplash: landscape, width >= 3000 px, likes >= 30, relevance order.
Licences: Pixabay Content License and Pexels License allow free commercial use without attribution (we still
credit the photographer); Unsplash License the same, but the Unsplash API terms require hotlinking their CDN
and calling the download endpoint, so Unsplash photos are NOT copied: we store their CDN URL + credit.
Pixabay's API terms ask to download (no permanent hotlinking) -> stored as WebP 1200/600 like the Commons photos.
Output: img/photos/*.webp and img/photos/stock.json (one entry per photo: source, id, file/file_sm or url, w, h,
category, query, description, author, author_url, licence, licence_url, page).
Usage: python3 tools/photos/stock.py [--per-query 2] [--limit 600]
"""
import io, json, os, re, sys, time, unicodedata
import requests
from PIL import Image

OUT = 'img/photos'
S = requests.Session(); S.headers['User-Agent'] = 'TheWineGoat/1.0 (https://thewinegoat.com)'
Q = {
 'vineyards': ['vineyard landscape', 'vineyard rows sunset', 'vineyard hills autumn', 'Tuscany vineyard', 'Champagne vineyard', 'Douro valley vineyards', 'Mosel vineyard steep', 'Bordeaux chateau vineyard', 'Napa valley vineyard', 'Mendoza vineyard Andes'],
 'grapes': ['red grapes on vine', 'white grapes vine', 'grape harvest bunch', 'grapes close up dew', 'vine leaves autumn'],
 'harvest': ['grape harvest workers', 'grape picking basket', 'winemaker vineyard'],
 'cellars': ['wine cellar barrels', 'oak barrels winery', 'wine cave bottles', 'winery stainless tanks'],
 'glasses': ['red wine glass', 'white wine glass', 'wine glasses toast', 'champagne coupe', 'champagne flutes celebration', 'rose wine glass', 'wine pouring glass', 'decanter red wine'],
 'sparkling': ['champagne bottle', 'sparkling wine bubbles', 'champagne cellar riddling'],
 'tasting': ['wine tasting', 'sommelier', 'wine and cheese', 'wine bar'],
 'spirits': ['whisky glass', 'whisky distillery', 'copper still distillery', 'cocktail bar', 'gin tonic', 'rum barrel', 'tequila agave', 'cognac glass'],
 'beer': ['craft beer glasses', 'brewery tanks', 'hops field', 'beer pint pub'],
}
def slug(s, n=60):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')[:n].rstrip('-') or 'photo'

def save(url, base):
    r = S.get(url, timeout=90); r.raise_for_status(); im = Image.open(io.BytesIO(r.content)).convert('RGB'); out = {}
    for wd, suf in ((1200, ''), (600, '-sm')):
        x = im.copy(); x.thumbnail((wd, wd * 2), Image.LANCZOS); fn = f'{base}{suf}.webp'
        x.save(f'{OUT}/{fn}', 'WEBP', quality=74, method=6); out[suf] = (fn, x.size)
    return out

def pixabay(key, q, n):
    p = {'key': key, 'q': q, 'image_type': 'photo', 'orientation': 'horizontal', 'min_width': 3000, 'safesearch': 'true', 'order': 'popular', 'per_page': 30}
    hits = []
    for ec in ('true', 'false'):
        r = S.get('https://pixabay.com/api/', params={**p, 'editors_choice': ec}, timeout=40)
        if r.ok: hits += r.json().get('hits', [])
        if len(hits) >= n * 3: break
    for h in hits:
        yield {'source': 'pixabay', 'id': f"pixabay-{h['id']}", 'dl': h.get('largeImageURL'), 'description': h.get('tags', ''),
               'author': h.get('user', ''), 'author_url': f"https://pixabay.com/users/{h.get('user','')}-{h.get('user_id','')}/",
               'licence': 'Pixabay Content License', 'licence_url': 'https://pixabay.com/service/license-summary/', 'page': h.get('pageURL', ''),
               'score': h.get('likes', 0) + h.get('downloads', 0) / 100}

def pexels(key, q, n):
    r = S.get('https://api.pexels.com/v1/search', params={'query': q, 'orientation': 'landscape', 'size': 'large', 'per_page': 30}, headers={'Authorization': key}, timeout=40)
    for h in (r.json().get('photos', []) if r.ok else []):
        if h.get('width', 0) < 3000: continue
        yield {'source': 'pexels', 'id': f"pexels-{h['id']}", 'dl': h['src'].get('large2x') or h['src'].get('original'), 'description': h.get('alt', ''),
               'author': h.get('photographer', ''), 'author_url': h.get('photographer_url', ''), 'licence': 'Pexels License',
               'licence_url': 'https://www.pexels.com/license/', 'page': h.get('url', ''), 'score': 0}

def unsplash(key, q, n):
    r = S.get('https://api.unsplash.com/search/photos', params={'query': q, 'orientation': 'landscape', 'per_page': 30, 'content_filter': 'high'}, headers={'Authorization': f'Client-ID {key}', 'Accept-Version': 'v1'}, timeout=40)
    for h in (r.json().get('results', []) if r.ok else []):
        if h.get('width', 0) < 3000 or h.get('likes', 0) < 30: continue
        u = h.get('user', {})
        yield {'source': 'unsplash', 'id': f"unsplash-{h['id']}", 'url': h['urls']['raw'], 'download_location': h['links'].get('download_location', ''),
               'w': h['width'], 'h': h['height'], 'description': h.get('alt_description') or h.get('description') or '',
               'author': u.get('name', ''), 'author_url': (u.get('links') or {}).get('html', '') + '?utm_source=the_wine_goat&utm_medium=referral',
               'licence': 'Unsplash License', 'licence_url': 'https://unsplash.com/license', 'page': h['links']['html'] + '?utm_source=the_wine_goat&utm_medium=referral',
               'score': h.get('likes', 0)}

def main():
    per_q = int(sys.argv[sys.argv.index('--per-query') + 1]) if '--per-query' in sys.argv else 2
    limit = int(sys.argv[sys.argv.index('--limit') + 1]) if '--limit' in sys.argv else 600
    os.makedirs(OUT, exist_ok=True); man_p = f'{OUT}/stock.json'
    man = json.load(open(man_p)) if os.path.exists(man_p) else []; have = {m['id'] for m in man}
    srcs = [(n, f, os.environ.get(k, '').strip()) for n, f, k in (('pixabay', pixabay, 'PIXABAY_API_KEY'), ('pexels', pexels, 'PEXELS_API_KEY'), ('unsplash', unsplash, 'UNSPLASH_ACCESS_KEY'))]
    for n, _, k in srcs: print(n, 'key present' if k else 'NO KEY -> skipped')
    for cat, qs in Q.items():
        for q in qs:
            for name, fn, key in srcs:
                if not key or len(man) >= limit: continue
                try: cands = sorted(fn(key, q, per_q), key=lambda c: -c['score'])
                except Exception as e: print('error', name, q, e); continue
                got = 0
                for c in cands:
                    if got >= per_q or c['id'] in have: continue
                    c.pop('score', None); c.update(category=cat, query=q)
                    if name == 'unsplash':
                        man.append(c)
                    else:
                        try: f = save(c.pop('dl'), f"{slug(q, 40)}-{slug(c['description'] or cat, 40)}-{c['id']}")
                        except Exception as e: print('download failed', c['id'], e); continue
                        c.update(file=f[''][0], file_sm=f['-sm'][0], w=f[''][1][0], h=f[''][1][1]); man.append(c)
                    have.add(c['id']); got += 1; print(len(man), name, q, c['id'], flush=True)
                time.sleep(1.2 if name == 'unsplash' else 0.4)   # Unsplash demo keys: 50 requests/hour
            json.dump(man, open(man_p, 'w'), ensure_ascii=False, indent=0)
    json.dump(man, open(man_p, 'w'), ensure_ascii=False, indent=0)
    print('done', len(man), {s: sum(m['source'] == s for m in man) for s in ('pixabay', 'pexels', 'unsplash')})

if __name__ == '__main__': main()
