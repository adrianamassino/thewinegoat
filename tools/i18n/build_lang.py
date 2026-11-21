"""Merges the translations of one map-based app language and writes the files the app loads.

Usage: python3 tools/i18n/build_lang.py <lang>        lang = de | nl | el | ja | ko | zh-hant | pt | tr | th
       python3 tools/i18n/build_lang.py all           (every language; also creates the empty files the app expects)
       python3 tools/i18n/build_lang.py <lang> --resync   (after a new extraction: realign the .txt files with the new chunks)

Input : tools/i18n/<lang>/<scope>/NNN.txt  — one translation per line, aligned with tools/i18n/src/<scope>/NNN.json
        (same order, same number of lines; a newline inside a text is written as \\n; an empty line = not translated yet)
Map   : tools/i18n/<lang>-map.json         — key = English text, so translations survive a new extraction
Extra : tools/i18n/core-extra.json        — {English: {lang: translation}} for strings a level shows that the extraction put in
        another level's scope (or skipped, it == en), e.g. "Vodka" (s2) shown in Spirits 1: served with the core file
        (so every level gets it) unless the map already has a translation of that key from its own scope
Output: app/i18n/<lang>.js                 — core strings      → TWG_I18N["<lang>"]
        app/i18n/<lang>/<level>.js         — l1, l2, s1, s2, k1, b1 → merged into the same map, loaded only for that level
        and the version of each file in the TWG_I18NV marker of app/index.html (the service worker caches scripts).
Prints the coverage per scope (strings and English characters)."""
import json, os, glob, sys, re, hashlib

D = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(D))
LANGS = ['de', 'nl', 'el', 'ja', 'ko', 'zh-hant', 'pt', 'tr', 'th']
SCOPES = ['core', 'l1', 'l2', 's1', 's2', 'k1', 'b1']
PH = re.compile(r'\{[A-Za-z0-9_]+\}|<[^>]+>|\$\{[^}]+\}')

def src(scope):
    out = []
    for f in sorted(glob.glob(os.path.join(D, 'src', scope, '*.json'))): out.append((os.path.basename(f)[:-5], json.load(open(f, encoding='utf8'))))
    return out

def build(lg):
    mp = os.path.join(D, f'{lg}-map.json')
    M = json.load(open(mp, encoding='utf8')) if os.path.exists(mp) else {}
    xp = os.path.join(D, 'core-extra.json'); X = json.load(open(xp, encoding='utf8')) if os.path.exists(xp) else {}
    warn = 0
    for sc in SCOPES:
        chunks = dict(src(sc))
        for f in sorted(glob.glob(os.path.join(D, lg, sc, '*.txt'))):
            n = os.path.basename(f)[:-4]
            assert n in chunks, f'{f}: no source chunk src/{sc}/{n}.json'
            items = chunks[n]
            lines = open(f, encoding='utf8').read().split('\n')
            if lines and lines[-1] == '': lines.pop()
            assert len(lines) == len(items), f'{lg}/{sc}/{n}.txt: {len(lines)} lines but {len(items)} strings in src/{sc}/{n}.json'
            for it, tr in zip(items, lines):
                tr = tr.replace('\\n', '\n')
                if not tr.strip(): continue
                if sorted(PH.findall(it['en'])) != sorted(PH.findall(tr)):
                    warn += 1
                    if warn <= 15: print(f'  ! {lg}/{sc}/{n}: placeholders/tags differ: {it["en"][:70]!r}')
                M[it['en']] = tr
    json.dump(M, open(mp, 'w', encoding='utf8'), ensure_ascii=False, indent=0, sort_keys=True)
    os.makedirs(os.path.join(ROOT, 'app/i18n', lg), exist_ok=True)
    vers = {}; rows = []
    for sc in SCOPES:
        keys = [it['en'] for _, c in src(sc) for it in c]
        sub = {k: M[k] for k in keys if k in M}
        if sc == 'core': sub.update({k: X[k][lg] for k in X if k not in sub and X[k].get(lg)})
        name = lg if sc == 'core' else f'{lg}/{sc}'
        js = ('window.TWG_I18N=window.TWG_I18N||{};TWG_I18N[%s]=Object.assign(TWG_I18N[%s]||{},%s);'
              '(window.TWG_I18N_F=window.TWG_I18N_F||{})[%s]=1;\n') % (json.dumps(lg), json.dumps(lg), json.dumps(sub, ensure_ascii=False, separators=(',', ':')), json.dumps(name))
        open(os.path.join(ROOT, 'app/i18n', name + '.js'), 'w', encoding='utf8').write(js)
        vers[name] = hashlib.md5(js.encode()).hexdigest()[:8]
        ch = sum(len(k) for k in keys); chd = sum(len(k) for k in sub)
        rows.append((sc, len(sub), len(keys), chd, ch))
    print(f'{lg}: ' + ' · '.join(f'{sc} {a}/{b} strings ({(100*a//b) if b else 0}%), {(100*c//d) if d else 0}% chars' for sc, a, b, c, d in rows)
          + (f'  [{warn} placeholder warnings]' if warn else ''))
    return vers

def stamp(vers):
    p = os.path.join(ROOT, 'app/index.html'); s = open(p, encoding='utf8').read()
    m = re.search(r'/\*i18nv\*/(\{.*?\})/\*/i18nv\*/', s)
    assert m, 'TWG_I18NV marker not found in app/index.html'
    cur = json.loads(m.group(1)); new = dict(cur, **vers)
    if new != cur:
        s = s[:m.start(1)] + json.dumps(new, separators=(',', ':'), sort_keys=True) + s[m.end(1):]
        open(p, 'w', encoding='utf8').write(s)

def resync(lg):
    """after a new extraction: rewrite <lang>/<scope>/NNN.txt aligned with the new chunks, from the map"""
    mp = os.path.join(D, f'{lg}-map.json'); M = json.load(open(mp, encoding='utf8')) if os.path.exists(mp) else {}
    for sc in SCOPES:
        d = os.path.join(D, lg, sc)
        for f in glob.glob(os.path.join(d, '*.txt')): os.remove(f)
        for n, items in src(sc):
            if not any(it['en'] in M for it in items): continue
            os.makedirs(d, exist_ok=True)
            open(os.path.join(d, n + '.txt'), 'w', encoding='utf8').write(''.join(M.get(it['en'], '').replace('\n', '\\n') + '\n' for it in items))

if __name__ == '__main__':
    a = sys.argv[1] if len(sys.argv) > 1 else ''
    if '--resync' in sys.argv:   # run build_lang.py <lang> BEFORE re-extracting, so the map holds everything
        for lg in (LANGS if a == 'all' else [a]): resync(lg)
    todo = LANGS if a == 'all' else [a]
    assert all(x in LANGS for x in todo) and todo, f'usage: build_lang.py <{"|".join(LANGS)}|all>'
    v = {}
    for lg in todo: v.update(build(lg))
    stamp(v)
