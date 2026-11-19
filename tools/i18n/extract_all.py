"""Extracts every English display string of the whole app for translation into the map-based languages
(de, nl, el, ja, ko, zh-hant, pt, tr, th — same principle as Spanish: key = English text, Italian as reference).

Output: tools/i18n/src/<scope>/NNN.json, scope = core | l1 | l2 | s1 | s2, chunks of ~25,000 English characters,
each item {"en": …, "it": …} ("it" = "" when no Italian reference is known). In every scope the UI strings come first,
in their own chunks (core/000…), then the content. tools/i18n/src/manifest.json lists the chunks and the counts.

Sources
  core : runtime UI dictionaries of Level 3 (T.en/T.it exported from the browser by export_ui.js), the other UI
         dictionaries written in the code (account window, notes, plan…, l2/l2app.js, l2/media.js, cellar.js,
         winedb.js labels), every [it,fr,en] array / {it,fr,en} object of index.html (questions, lessons, maps,
         films…), podcast titles and app/podtext/en.json. Strings needed by two or more levels also go to core.
  l1, l2, s1, s2 : runtime UI of that level not already in core (l2app texts with that level's numbers…),
         <level>/content.js (chapters, questions, lessons, flashcards), <level>/media.js or l2/media-l2.js (films, podcast titles)
         and <level>/podtext/en.json.

Usage
  python3 tools/i18n/extract_all.py              # starts a local server and runs export_ui.js (Playwright) itself
  python3 tools/i18n/extract_all.py --ui DIR     # reuse ui-<level>.json files already exported into DIR
Needs node (+ playwright from `npm root -g`) and python3."""
import json, os, re, subprocess, sys, socket, time, shutil

D = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(D)); APP = os.path.join(ROOT, 'app')
SCOPES = ['core', 'l1', 'l2', 's1', 's2']
LEVEL = {  # scope: (ui export name, content dir, content global)
    'l1': ('1', 'l1', 'TWG_L1C'), 'l2': ('2', 'l2', 'TWG_L2C'), 's1': ('s1', 'spirits/s1', 'TWG_S1C'), 's2': ('s2', 'spirits/s2', 'TWG_S2C')}
CHUNK = 25000
S = r'"((?:[^"\\\n]|\\.)*)"'
SQ = r"'((?:[^'\\\n]|\\.)*)'"

def rd(p): return open(p, encoding='utf8').read()
def un(x, q='"'):
    if q == "'": x = x.replace("\\'", "'").replace('"', '\\"')
    try: return json.loads('"' + x + '"')
    except Exception: return x

SKIP = re.compile(r'^(https?:|data:|mailto:|#[0-9a-fA-F]{3,8}$|<svg|<path|<g |[\w./-]+\.(js|json|mp3|png|webp|svg|jpg|woff2|css)$)')
def ok(en, it=''):
    if not isinstance(en, str): return False
    e = en.strip()
    if len(e) < 2 or not re.search(r'[^\W\d_]', e): return False
    if SKIP.search(e): return False
    if re.search(r'[{;]\s*[\w-]+\s*:[^;]*;', e) and '<' not in e: return False          # CSS
    if re.fullmatch(r'[a-z0-9_.-]{1,24}', e) and (not it or it == en): return False      # ids, codes
    if it and it == en and ' ' not in e: return False                                     # names identical in it/en
    return True

class Bag:
    def __init__(s): s.d = {}
    def add(s, en, it='', k='content'):
        if not ok(en, it): return
        if en not in s.d: s.d[en] = {'it': it if isinstance(it, str) else '', 'k': k}
        else:
            if not s.d[en]['it'] and isinstance(it, str) and it: s.d[en]['it'] = it
            if k == 'ui': s.d[en]['k'] = 'ui'

# ---------- static parsing helpers ----------
def match_end(src, i, lim=400000):
    """index just after the bracket that closes src[i] ({ or [), skipping strings and template literals."""
    op = src[i]; cl = {'{': '}', '[': ']'}[op]; depth = 0; j = i; n = min(len(src), i + lim)
    while j < n:
        c = src[j]
        if c in '"\'`':
            q = c; j += 1
            while j < n and src[j] != q:
                j += 2 if src[j] == '\\' else 1
        elif c in '{[': depth += 1
        elif c in '}]':
            depth -= 1
            if depth == 0: return j + 1
        j += 1
    return -1

PAIR = re.compile(r'(?:([A-Za-z_$][\w$]*)|"([^"\\]+)")\s*:\s*(?:' + S + '|' + SQ + ')')
def pairs(block):
    o = {}
    for m in PAIR.finditer(block):
        k = m.group(1) or m.group(2); v = un(m.group(3)) if m.group(3) is not None else un(m.group(4), "'")
        o.setdefault(k, v)
    return o
def lits(block):
    return [un(m.group(1)) if m.group(1) is not None else un(m.group(2), "'") for m in re.finditer(S + '|' + SQ, block)]

def lang_blocks(src, bag, k='ui'):
    """unquoted dictionaries  en:{key:"…"}  /  en:["…"]  with the Italian twin it:{…} written just before."""
    for m in re.finditer(r'(?<![\w$."\'])en\s*:\s*([\{\[])', src):
        i = m.end() - 1; e = match_end(src, i)
        if e < 0: continue
        blk = src[i:e]
        itb = None
        for mi in re.finditer(r'(?<![\w$."\'])it\s*:\s*\%s' % src[i], src[max(0, m.start() - 80000):m.start()]):
            itb = mi
        it = {}
        if itb:
            j = max(0, m.start() - 80000) + itb.end() - 1; e2 = match_end(src, j)
            if e2 > 0: it = pairs(src[j:e2]) if src[i] == '{' else dict(enumerate(lits(src[j:e2])))
        # "text "+(flag?"a":"b")+" text": both complete variants (the app looks up the whole sentence)
        for c in re.finditer(S + r'\s*\+\s*\(\s*[\w.!]+\s*\?\s*' + S + r'\s*:\s*' + S + r'\s*\)\s*\+\s*' + S, blk):
            for mid in (c.group(2), c.group(3)): bag.add(un(c.group(1)) + un(mid) + un(c.group(4)), '', k)
        if src[i] == '{':
            for kk, v in pairs(blk).items(): bag.add(v, it.get(kk, ''), k)
        else:
            for n, v in enumerate(lits(blk)): bag.add(v, it.get(n, ''), k)

def tri(src, bag, k='content'):
    """[it,fr,en] arrays, I3(it,fr,en)-style calls and {"it":…,"en":…} / {it:…,fr:…,en:…} objects."""
    for m in re.finditer(r'"it":\s*' + S + r'[^{}]{0,4000}?"en":\s*' + S, src): bag.add(un(m.group(2)), un(m.group(1)), k)
    for m in re.finditer(r'\bit:\s*' + S + r'\s*,\s*fr:\s*' + S + r'\s*,\s*en:\s*' + S, src): bag.add(un(m.group(3)), un(m.group(1)), k)
    for m in re.finditer(r'(?:\[|\b(?:I3|I3_|w3|W3)\()\s*' + S + r'\s*,\s*' + S + r'\s*,\s*' + S + r'\s*(?:\]|\)|,)', src):
        a, b, c = un(m.group(1)), un(m.group(2)), un(m.group(3))
        if a == b == c: continue
        bag.add(c, a, k)

def walk(o, bag, k='content'):
    """level content: arrays [it,fr,en(,es)] and objects {it,fr,en}"""
    if isinstance(o, list):
        if 3 <= len(o) <= 4 and all(isinstance(x, str) for x in o):
            if not (o[0] == o[1] == o[2]): bag.add(o[2], o[0], k)
            return
        for x in o: walk(x, bag, k)
    elif isinstance(o, dict):
        if isinstance(o.get('en'), str) and isinstance(o.get('it'), str):
            bag.add(o['en'], o['it'], k); return
        for v in o.values(): walk(v, bag, k)

def podtext(d, bag):
    p = os.path.join(d, 'podtext', 'en.json')
    if not os.path.exists(p): return
    en = json.load(open(p, encoding='utf8'))
    itp = os.path.join(d, 'podtext', 'it.json'); it = json.load(open(itp, encoding='utf8')) if os.path.exists(itp) else {}
    for pid, x in en.items():
        ip = (it.get(pid) or {}).get('p') or []
        for n, q in enumerate(x.get('p') or []): bag.add(q, ip[n] if n < len(ip) and len(ip) == len(x['p']) else '', 'content')

def ui_dump(f, bag, skip=None):
    u = json.load(open(f, encoding='utf8'))
    for key, en in u['en'].items():
        it = u['it'].get(key, '')
        if isinstance(en, list):
            for n, x in enumerate(en):
                if skip is None or x not in skip: bag.add(x, it[n] if isinstance(it, list) and n < len(it) else '', 'ui')
        elif skip is None or en not in skip: bag.add(en, it if isinstance(it, str) else '', 'ui')

def node_dump(f, *names):
    return json.loads(subprocess.check_output(['node', os.path.join(D, 'dump_js.js'), f, *names]))

# ---------- runtime UI export ----------
def export_ui(out):
    sk = socket.socket(); sk.bind(('127.0.0.1', 0)); port = sk.getsockname()[1]; sk.close()
    srv = subprocess.Popen([sys.executable, '-m', 'http.server', str(port), '--bind', '127.0.0.1'], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        time.sleep(1)
        env = dict(os.environ); np = subprocess.run(['npm', 'root', '-g'], capture_output=True, text=True).stdout.strip()
        if np: env['NODE_PATH'] = np + (os.pathsep + env['NODE_PATH'] if env.get('NODE_PATH') else '')
        subprocess.run(['node', os.path.join(D, 'export_ui.js'), f'http://127.0.0.1:{port}/app/', out], check=True, env=env)
    finally:
        srv.terminate()

def main():
    ui = None
    if '--ui' in sys.argv: ui = sys.argv[sys.argv.index('--ui') + 1]
    else:
        ui = os.path.join(D, 'ui'); export_ui(ui)
    bags = {s: Bag() for s in SCOPES}
    core = bags['core']
    # core UI
    ui_dump(os.path.join(ui, 'ui-3.json'), core)
    idx = rd(os.path.join(APP, 'index.html'))
    lang_blocks(idx, core)
    for f in ['l2/l2app.js', 'l2/media.js', 'cellar.js']: lang_blocks(rd(os.path.join(APP, f)), core)
    try:
        W = node_dump(os.path.join(APP, 'winedb.js'), 'TWG_WINEDB')['TWG_WINEDB'] or {}
        L = W.get('L') or {}
        for grp in ('aroma', 'food'):
            g = L.get(grp) or {}
            for c, en in (g.get('en') or {}).items(): core.add(en, (g.get('it') or {}).get(c, ''), 'ui')
        for c, row in (L.get('country') or {}).items():
            if isinstance(row, list) and len(row) > 3: core.add(row[3], row[1], 'ui')
    except Exception as e: print('winedb.js skipped:', e)
    # core content
    tri(idx, core); podtext(APP, core)
    # levels
    for sc, (uv, d, var) in LEVEL.items():
        b = bags[sc]; f = os.path.join(ui, f'ui-{uv}.json')
        if os.path.exists(f): ui_dump(f, b, skip=core.d)
        C = node_dump(os.path.join(APP, d, 'content.js'), var)[var]
        walk({k: v for k, v in C.items() if k not in ('level', 'track', 'exam')}, b)
        m = os.path.join(APP, d, 'media-l2.js' if d == 'l2' else 'media.js')   # l2/media.js is the shared engine (core)
        if os.path.exists(m): tri(rd(m), b)
        podtext(os.path.join(APP, d), b)
    # strings needed by 2+ levels and strings already in core live in core
    seen = {}
    for sc in SCOPES[1:]:
        for en in bags[sc].d: seen[en] = seen.get(en, 0) + 1
    for sc in SCOPES[1:]:
        for en in list(bags[sc].d):
            v = bags[sc].d[en]
            if en in core.d or seen[en] > 1:
                if en not in core.d: core.d[en] = dict(v)
                elif v['k'] == 'ui': core.d[en]['k'] = 'ui'
                if not core.d[en]['it']: core.d[en]['it'] = v['it']
                del bags[sc].d[en]
    # write chunks
    out = os.path.join(D, 'src'); man = {'chunk_chars': CHUNK, 'scopes': {}}
    for sc in SCOPES:
        dd = os.path.join(out, sc)
        if os.path.isdir(dd): shutil.rmtree(dd)
        os.makedirs(dd)
        items = [(en, v) for en, v in bags[sc].d.items() if v['k'] == 'ui'] + [(en, v) for en, v in bags[sc].d.items() if v['k'] != 'ui']
        chunks, cur, size, kind = [], [], 0, None
        for en, v in items:
            if cur and (size + len(en) > CHUNK or v['k'] != kind and kind == 'ui'):
                chunks.append(cur); cur, size = [], 0
            cur.append({'en': en, 'it': v['it']}); size += len(en); kind = v['k']
        if cur: chunks.append(cur)
        for n, c in enumerate(chunks):
            json.dump(c, open(os.path.join(dd, f'{n:03d}.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=0)
        nui = sum(1 for _, v in items if v['k'] == 'ui')
        uich = 0; acc = 0
        for c in chunks:
            if acc >= nui: break
            acc += len(c); uich += 1
        man['scopes'][sc] = {'strings': len(items), 'en_chars': sum(len(en) for en, _ in items), 'ui_strings': nui,
                             'ui_en_chars': sum(len(en) for en, v in items if v['k'] == 'ui'), 'chunks': len(chunks), 'ui_chunks': uich}
    json.dump(man, open(os.path.join(out, 'manifest.json'), 'w', encoding='utf8'), indent=1)
    tot_s = tot_c = 0
    print(f"{'scope':6} {'strings':>8} {'EN chars':>10} {'chunks':>7}   (UI strings / UI chars / UI chunks)")
    for sc, m in man['scopes'].items():
        tot_s += m['strings']; tot_c += m['en_chars']
        print(f"{sc:6} {m['strings']:8,} {m['en_chars']:10,} {m['chunks']:7}   ({m['ui_strings']:,} / {m['ui_en_chars']:,} / {m['ui_chunks']})")
    print(f"{'total':6} {tot_s:8,} {tot_c:10,}")

if __name__ == '__main__': main()
