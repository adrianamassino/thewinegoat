"""Build podcast manifest (inlined in app) + transcript JSON per language (served as podtext/{lang}.json)."""
import os, re, json
H = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(H, '..', 'nb', 'pod'); TTS = os.path.join(H, '..', 'tts')
TP = os.path.join(TTS, 'pod_times.json')
times = json.load(open(TP)) if os.path.exists(TP) else {}
MARK = re.compile(r'\{(?:fr|en|de|it|es|pt|la|hu|el|ca):([^}]+)\}')
LANGS = ['it', 'fr', 'en']
man = []; texts = {l: {} for l in LANGS}
for n in range(1, 46):
    cid = 'ch%02d' % n; titles = []; d = {}; T = {}; ok = False
    for l in LANGS:
        f = os.path.join(SRC, cid + '.' + l + '.txt')
        if not os.path.exists(f): titles.append(None); continue
        ok = True
        lines = open(f).read().strip().split('\n')
        title = MARK.sub(r'\1', lines[0].lstrip('# ').strip())
        title = title.split('·', 1)[1].strip() if '·' in title else title
        titles.append(title)
        paras = [MARK.sub(r'\1', p.strip()) for p in '\n'.join(lines[1:]).split('\n\n') if p.strip()]
        texts[l][cid] = {'p': paras}
        mp3 = os.path.join(TTS, 'pod', l, cid + '.mp3')
        tm = times.get(cid, {}).get(l)
        if tm and os.path.exists(mp3) and os.path.getmtime(mp3) >= os.path.getmtime(f) and len(tm) == len(paras) + 1:
            d[l] = round(tm[-1], 1); T[l] = tm[:-1]
    if not ok: continue
    fb = next(x for x in titles if x)
    man.append({'id': cid, 'n': n, 't': [x or fb for x in titles], 'd': d, 'T': T})
json.dump(man, open(os.path.join(H, 'pods_manifest.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
os.makedirs(os.path.join(H, 'podtext'), exist_ok=True)
for l in LANGS:
    json.dump(texts[l], open(os.path.join(H, 'podtext', l + '.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
print('chapters', len(man), 'with audio', {l: sum(1 for m in man if l in m['d']) for l in LANGS})
