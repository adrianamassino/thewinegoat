import json, re, glob, hashlib, sys
D = '/tmp/claude-0/-home-claude/3f268032-b4c3-5225-a7f8-c79dc4579a8b/scratchpad/h/'
h = open(D + 'live.html').read()
m = re.search(r'const BANK = (\[.*?\]);\n', h, re.S)
bank = json.loads(m.group(1))
ids = {b['id'] for b in bank}
added = 0
for f in sorted(glob.glob(D + 'hq_*.txt')):
    for blk in re.split(r'\n\s*\n', open(f).read().strip()):
        L = {}
        head = None
        for ln in blk.strip().split('\n'):
            if ln.startswith('#'):
                head = ln[1:].split()
                continue
            k, v = ln.split(':', 1)
            L[k.strip()] = v.strip()
        c, p = head[0], int(head[1][1:])
        def tri(s):
            x = [y.strip() for y in s.split('||')]
            assert len(x) == 3, (f, s)
            return x
        q = tri(L['Q'])
        o = [tri(L[k]) for k in 'ABCD']
        d = [L['DI'], L['DF'], L['DE']]
        e = tri(L['E']) if 'E' in L else d
        d = [L['DI'], L['DF'], L['DE']]
        i = hashlib.sha1((c + q[2]).encode()).hexdigest()[:7]
        assert i not in ids, (f, q[2])
        ids.add(i)
        rec={'id': i, 'c': c, 'p': p, 'q': q, 'o': o, 'e': e, 'd': d}
        if 'b' not in head[2:]: rec['h'] = 1
        if 't' in head[2:]: rec['t'] = 1
        if 's' in head[2:]: rec['s'] = 1
        for hh in head[2:]:
            if hh.startswith('f='): rec['f'] = hh[2:]
        if 'x' in head[2:]: rec['s'] = 2
        bank.append(rec)
        added += 1
# --- option overrides (anti form-bias rewrite) ---
byid = {b['id']: b for b in bank}
nov = 0
for f in sorted(glob.glob(D + 'ovr/*.txt')):
    for blk in re.split(r'\n\s*\n', open(f).read().strip()):
        lines = [l for l in blk.strip().split('\n') if l.strip()]
        i = lines[0].lstrip('@').strip()
        assert i in byid, (f, i)
        L = {}; P = []
        for ln in lines[1:]:
            k, v = ln.split(':', 1)
            if '.' in k:
                kk, lg = k.strip().split('.')
                P.append(('ABCD'.index(kk), ['it','fr','en'].index(lg), v.strip())); continue
            x = [y.strip() for y in v.split('||')]
            assert len(x) == 3, (f, i, ln)
            L[k.strip()] = x
        b = byid[i]
        if all(k in L for k in 'ABCD'):
            b['o'] = [L[k] for k in 'ABCD']
        else:
            for k in 'ABCD':
                if k in L: b['o']['ABCD'.index(k)] = L[k]
        for oi, li, v in P:
            b['o'][oi] = list(b['o'][oi]); b['o'][oi][li] = v
        if 'Q' in L: b['q'] = L['Q']
        if 'E' in L: b['e'] = L['E']
        nov += 1
print('overrides', nov)
sys.path.insert(0, D)
import trfix
print('trfix', trfix.fixbank(bank))
import satloc
_nl = 0
for _b in bank:
    _strict = _b['c'] != 'deg'
    for _f in ('q', 'e', 'd'):
        _v = _b.get(_f)
        if _v and len(_v) == 3:
            for _li in (0, 1):
                _z = satloc.loc_sat(_v[_li], _li) if not _strict else satloc.loc(_v[_li], _li, True)
                if _z != _v[_li]: _v[_li] = _z; _nl += 1
    for _o in _b['o']:
        for _li in (0, 1):
            _z = satloc.loc_sat(_o[_li], _li) if not _strict else satloc.loc(_o[_li], _li, True)
            if _z != _o[_li]: _o[_li] = _z; _nl += 1
print('satloc bank', _nl)
order = [b['c'] for b in bank]
chs = []
for c in order:
    if c not in chs: chs.append(c)
bank.sort(key=lambda b: (chs.index(b['c']), b['p'], b.get('h', 0)))
import debook as _db; _db.bank(bank)
import frnat as _fn; print('frnat',_fn.bank(bank))
import dewset as _dw0
for _b in bank:
    for _k in ('q','e','d'):
        if _b.get(_k): _b[_k]=[_dw0._ap(_x) if 'WSET' in _x else _x for _x in _b[_k]]
    _b['o']=[[_dw0._ap(_x) if 'WSET' in _x else _x for _x in _o] for _o in _b['o']]
import noprog as _np, qfix_prog as _qp; print('noprog',_np.bank(bank,_qp.Q))
for _b in bank:
    if _b['id']=='54f7c60': _b['c']='usa'
s = json.dumps(bank, ensure_ascii=False, separators=(',', ':'))
s = s.replace('</', '<\\/')
out = h[:m.start(1)] + s + h[m.end(1):]
import ed2sub
out, _n = ed2sub.apply(out)
out, _k = satloc.apply_html(out); print('satloc html', _k)
import ed2sub_b
out, _m = ed2sub_b.apply(out); _n += _m
print('ed2sub', _n)
import debook_ui as _du; out,_k=_du.apply(out); print('debook_ui',_k)
import dewset as _dw; out,_k=_dw.apply(out); print('dewset',_k)
open(D + 'wset3.html', 'w').write(out)  # (debook applied to bank above)
print('added', added, 'total', len(bank), 'hard', sum(1 for b in bank if b.get('h')))
