# -*- coding: utf-8 -*-
"""'How we compare' as cards: each advantage with the detail and a clear us-vs-them strip (texts come from home_text / intl_home_text)."""
import html
from icons import ICON
e = lambda s: html.escape(str(s), quote=True)

def render(h, img, price=''):
    cols = h['cmp_cols']; us, them = cols[1], cols[2]
    W = h['why']; rows = list(h['cmp'])
    det = {0: W[0][2], 1: W[1][2], 3: W[2][2]}
    ic = ['pen', 'plan', 'globe', 'play', 'wallet']
    items = [(ic[i], a, b, d, det.get(i, '')) for i, (a, b, d) in enumerate(rows)]
    items.insert(2, ('mic', W[3][1], '✓', '—', W[3][2]))
    out = ''
    for k, (i, a, b, d, p) in enumerate(items):
        out += (f'<article class="vs" style="--k:{k}"><div class="vsh"><span class="fic">{ICON[i]}</span><h3>{e(a)}</h3></div>'
                + (f'<p class="vsp">{e(p)}</p>' if p else (VIS_LANG if i == 'globe' else (f'<div class="vsx"><b>{price}</b><span>× 1</span><em>12 ↻ 0</em></div>' if i == 'wallet' else '')))
                + f'<div class="vrow vus"><span>{e(us)}</span><b>{e(b if b.startswith("✓") else "✓ " + b)}</b></div>'
                  f'<div class="vrow vthem"><span>{e(them)}</span><b>{e(d)}</b></div></article>')
    return f'<div class="vsgrid">{out}</div>'

VIS_LANG = '<div class="vsx vlang">' + ''.join(f'<span>{x}</span>' for x in ('EN', 'IT', 'FR', 'ES', 'DE', 'PT', 'NL', 'EL', 'PL', 'RU', 'AR', 'JA', 'KO', '中文')) + '</div>'
CSS = r"""
.vsx{flex:1;display:flex;align-items:center;gap:10px;margin:12px 0 14px}
.vlang{flex-wrap:wrap;gap:6px;align-content:center}.vlang span{padding:4px 9px;border-radius:7px;background:#f6ecee;color:#5c1630;font-weight:800;font-size:12.5px}
.vlang span:nth-child(-n+4){background:#5c1630;color:#fff}
.vsx b{font:800 30px/1 Fraunces,Georgia,serif;color:#5c1630}.vsx span{font-weight:800;color:#b8892e}.vsx em{display:none}
.vsgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:26px}
.vs{display:flex;flex-direction:column;background:#fff;border-radius:18px;padding:18px 18px 16px;box-shadow:inset 0 0 0 1px #eadfd3,0 16px 34px -30px rgba(62,15,34,.5);opacity:0;transform:translateY(14px);transition:opacity .5s ease calc(var(--k)*.08s),transform .5s ease calc(var(--k)*.08s)}
.vsgrid.in .vs{opacity:1;transform:none}
.vsh{display:flex;gap:10px;align-items:center}.vsh h3{margin:0;font-size:18px;line-height:1.25}
.vsp{margin:10px 0 14px;color:#6b5a5f;font-size:14.5px;line-height:1.5;flex:1}
.vs:not(:has(.vsp)) .vsh{margin-bottom:14px;flex:1;align-items:flex-start}
.vrow{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:9px 12px;border-radius:10px;font-size:14px}
.vrow span{font-weight:700}
.vus{background:linear-gradient(90deg,#f7ecee,#fbf3ea);color:#5c1630;box-shadow:inset 3px 0 0 #8c1d40}
.vus b{color:#5f7a3c;font-weight:800;white-space:nowrap}
.vthem{margin-top:6px;color:#9a8a8f}.vthem b{font-weight:600}
@media (max-width:1020px){.vsgrid{grid-template-columns:1fr 1fr}}
@media (max-width:640px){.vsgrid{grid-template-columns:1fr}}
@media (prefers-reduced-motion:reduce){.vs{opacity:1;transform:none;transition:none}}
"""
JS = r"""
(function(){ var g=document.querySelector('.vsgrid'); if(!g) return;
 if(!('IntersectionObserver' in window)){ g.classList.add('in'); return; }
 var io=new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ g.classList.add('in'); io.disconnect(); } }); },{threshold:.15}); io.observe(g); })();
"""
