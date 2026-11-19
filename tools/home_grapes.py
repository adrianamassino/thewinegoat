"""Adds a few grape bunches on the ground of the walking-goat lanes of a home page (decorative, behind the goats).
Idempotent. Usage from repo root: python3 tools/home_grapes.py es-ar/index.html [more homes...]"""
import re, sys, random
def bunch(col, dark):
    berries = [(20,14),(30,14),(40,14),(15,23),(25,23),(35,23),(45,23),(20,32),(30,32),(40,32),(25,41),(35,41),(30,50)]
    b = ''.join(f'<circle cx="{x}" cy="{y+8}" r="6.2" fill="{col}" stroke="{dark}" stroke-width="1"/><circle cx="{x-2}" cy="{y+6}" r="1.6" fill="#fff" opacity=".45"/>' for x, y in berries)
    return ('<svg viewBox="0 0 60 66" width="30" height="33" aria-hidden="true">'
            '<path d="M30 10 C30 4 34 1 38 0" fill="none" stroke="#6b4128" stroke-width="2.4" stroke-linecap="round"/>'
            '<path d="M33 8 C40 -2 56 0 58 8 C50 8 46 14 38 13 Z" fill="#7da64a" stroke="#4f6f2b" stroke-width="1.2"/>'
            '<path d="M36 10 C44 6 50 6 56 7" fill="none" stroke="#4f6f2b" stroke-width=".9"/>' + b + '</svg>')
CSS = ('<style id="ggrapes">.glane .grp{position:absolute;bottom:2px;width:30px;z-index:0;transform-origin:50% 0;animation:grsw 4s ease-in-out infinite;pointer-events:none}'
       '.glane .grp svg{display:block;width:100%;height:auto;filter:drop-shadow(0 4px 4px rgba(62,15,34,.18))}.glane .gw{z-index:1}'
       '@keyframes grsw{50%{transform:rotate(4deg)}}'
       '@media (prefers-reduced-motion:reduce){.glane .grp{animation:none}}</style>')
COLS = [('#6b2a5c', '#47173d'), ('#8b3a6b', '#5a1f45'), ('#b9c64f', '#7d8a2c')]
for P in sys.argv[1:]:
    s = open(P, encoding='utf8').read()
    s = re.sub(r'<span class="grp"[^>]*>.*?</svg></span>', '', s, flags=re.S)
    s = re.sub(r'<style id="ggrapes">.*?</style>', '', s, flags=re.S)
    random.seed(7); n = 0
    def add(m):
        global n
        out = m.group(0)
        for left in random.sample([6, 22, 40, 58, 74, 90], 3):
            c, d = random.choice(COLS); n += 1
            out += f'<span class="grp" style="left:{left}%;animation-delay:-{random.random()*4:.1f}s">{bunch(c, d)}</span>'
        return out
    s = re.sub(r'<div class="glane(?! gl1)[^"]*"[^>]*>', add, s)  # not the hero lane above the buttons
    s = s.replace('</head>', CSS + '</head>', 1)
    open(P, 'w', encoding='utf8').write(s)
    print(P, n, 'bunches')
