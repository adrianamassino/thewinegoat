#!/usr/bin/env python3
"""Build app9.js: one 'map film' per regional chapter (12-45), synced to the podcast narration.
Each paragraph of the podcast becomes a scene; the scene shows the right map, zoomed on the regions,
towns and rivers named in that paragraph, plus grape, climate and figure chips."""
import json, re, os, sys
os.chdir(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, '.'); sys.path.insert(0, 'rip')
import grapes_data
META = json.load(open('/tmp/mapsmeta.json')); M = META['maps']; NAMES = META['names']
PT = {l: json.load(open(f'podtext/{l}.json')) for l in ('it', 'fr', 'en')}
PCH = {12:"bdx",13:"bdx",14:"bdx",15:"bgn",16:"bgn",17:"als",18:"als",19:"rho",20:"rho",21:"sfr",22:"ger",23:"aut",24:"aut",25:"gre",26:"ita",27:"ita",28:"ita",29:"ita",30:"esp",31:"por",32:"usa",33:"usa",34:"usa",35:"usa",36:"chi",37:"chi",38:"rsa",39:"aus",40:"aus",41:"spu",42:"spu",43:"she",44:"prt",45:"prt"}
EXTRA = {"spu": ["fra", "ita", "esp", "ger", "ausz", "rsa"], "she": ["esp"], "prt": ["por", "fra", "ausz", "srh"], "por": ["dou"], "bdx": [], "rho": ["fra"], "sfr": ["fra"], "als": ["fra"], "bgn": ["fra"]}
SEC = {41: "s", 42: "s", 43: "s", 44: "s", 45: "s"}

def norm(s): return re.sub(r'\s+', ' ', s)
def variants(m, x):
    n = x[1]; v = {n}
    if n in NAMES: v |= set(NAMES[n])
    if n.endswith(' town'): v.add(n[:-5])
    if n.endswith(' village'): v.add(n[:-8])
    v.add(re.sub(r'\s*\((Grand Cru|AC|DOCG|DOC)\)$', '', n))
    return [x for x in v if len(x) >= 3]
def count_in(text, names):
    c = 0
    for nm in names:
        if re.search(r'(?<![\wÀ-ÿ])' + re.escape(nm) + r'(?![\wÀ-ÿ])', text, re.I): c += 1
    return c
def first_pos(text, names):
    best = None
    for nm in names:
        mm = re.search(r'(?<![\wÀ-ÿ])' + re.escape(nm) + r'(?![\wÀ-ÿ])', text, re.I)
        if mm and (best is None or mm.start() < best): best = mm.start()
    return best
GR = []
for g in grapes_data.G:
    names = [g['k']] + g['syn']
    GR.append((g['k'], [n for n in names if len(n) >= 4]))
CLIM = {
 "mar": ["maritime", "marittimo", "marittima", "océanique", "oceanic", "atlantique", "atlantic", "atlantico"],
 "con": ["continental", "continentale"],
 "med": ["méditerranéen", "méditerranéenne", "mediterraneo", "mediterranea", "mediterranean"],
 "cool": [" frais", "fraîche", " fresco", " fresca", " cool"],
 "hot": [" chaud", " caldo", " calda", " hot", " warm "],
 "rain": ["pluie", "pioggia", "piogge", " rain"],
 "frost": [" gel", "gelate", "gelata", "frost"],
 "fog": ["brouillard", "brume", "nebbia", "nebbie", " fog", " mist"],
 "alt": ["altitude", "altitudine", "elevation"],
 "wind": [" vent", " vento", " venti", " wind"],
}
NUMRE = re.compile(r'\d[\d\s.,]*\s?(?:%|°C|°|mètres|metri|metres|meters|\bm\b|hectares|ettari|ha\b|mois|mesi|months|ans\b|anni\b|years|g/l|km)')
def heading(p):
    m = re.match(r'^([^.!?:]{3,48})[.:]\s', p)
    if m and len(m.group(1).split()) <= 6: return m.group(1).strip()
    return None

FILMS = []
for n in range(12, 46):
    cid = f'ch{n:02d}'; code = PCH[n]
    cands = [k for k, v in M.items() if v['ch'] == code] + EXTRA.get(code, [])
    if n == 12: cands = ['fra']
    paras = [[norm(PT[l][cid]['p'][i]) for l in ('it', 'fr', 'en')] for i in range(len(PT['it'][cid]['p']))]
    alltext = ' '.join(' '.join(p) for p in paras)
    def score(mid, text):
        return sum(1 for x in M[mid]['it'] if x[0] in ('w', 'c', 'r', 'g') and count_in(text, variants(mid, x)))
    main = max(cands, key=lambda k: (score(k, alltext), M[k]['sc'] == 'macro'))
    macros = [k for k in cands if M[k]['sc'] == 'macro' and M[k]['ch'] == code] or [k for k in cands if M[k]['sc'] == 'macro'] or [main]
    intro = max(macros, key=lambda k: score(k, alltext))
    intro = {12:'fra',13:'bdx',14:'sw',16:'bea',17:'als',19:'nrh',20:'srh',41:'cha',44:'dou'}.get(n, intro)
    scenes = [{"m": intro, "hl": [], "g": [], "k": [], "nb": [[], [], []], "h": None}]
    for p in paras:
        text = ' '.join(p)
        sc = {k: score(k, text) for k in cands}
        best = max(cands, key=lambda k: (sc[k], k == main, M[k]['sc'] == 'micro'))
        if sc[best] == 0: best = intro
        hl = []
        for i, x in enumerate(M[best]['it']):
            if x[0] in ('w', 'c', 'r', 'g'):
                pos = first_pos(text, variants(best, x))
                if pos is not None: hl.append((pos, i))
        hl = [i for _, i in sorted(hl)][:9]
        gl = []
        for k, names in GR:
            pos = first_pos(text, names)
            if pos is not None: gl.append((pos, k))
        gl = [k for _, k in sorted(gl)]
        gl = list(dict.fromkeys(gl))[:4]
        low = ' ' + text.lower() + ' '
        kk = [k for k, ws in CLIM.items() if any(w in low for w in ws)][:3]
        nb = [list(dict.fromkeys(x.strip(' .,') for x in NUMRE.findall(pl)))[:2] for pl in p]
        h = [heading(pl) for pl in p]
        scenes.append({"m": best, "hl": hl, "g": gl, "k": kk, "nb": nb, "h": h if all(h) else None})
    FILMS.append({"n": n, "pod": cid, "ch": code, "sec": SEC.get(n, "r"), "s": scenes})
print(len(FILMS), sum(len(f['s']) for f in FILMS))
JS = open('app9_tpl.js').read().replace('__PFS__', json.dumps(FILMS, ensure_ascii=False, separators=(',', ':')))
open('app9.js', 'w').write(JS)
