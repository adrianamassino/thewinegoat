"""Argentine home (es-ar/index.html): the walking goats wear a sky-blue and white striped football shirt
instead of the burgundy cape. Idempotent: re-run after any regeneration of the es-ar home.
Run from repo root: python3 tools/ar_goats.py"""
import re
P = 'es-ar/index.html'
s = open(P, encoding='utf8').read()
# only the ORIGINAL burgundy cape (contains #a3264f / gold trim and no pattern yet); never a shirt already made
CAPE = re.compile(r'<g class="cape" style="transform-origin:150px 84px">(?:(?!<defs><pattern id="arg)(?!<g class="neckhead").)*?\n </g>', re.S)
n = [0]
def shirt(m):
    n[0] += 1; i = f'arg{n[0]}'
    body = 'M152,80 C132,74 100,74 76,84 C70,96 68,112 72,128 C84,122 96,128 108,122 C120,128 132,120 142,118 C150,108 154,94 152,80 Z'
    return (f'<g class="cape" style="transform-origin:150px 84px">'
            f'<defs><pattern id="{i}" width="16" height="12" patternUnits="userSpaceOnUse"><rect width="16" height="12" fill="#ffffff"/><rect x="2" width="7" height="12" fill="#75aadb"/></pattern></defs>'
            f'<path d="{body}" fill="url(#{i})" stroke="#3d6f9e" stroke-width="1.4" stroke-linejoin="round"/>'
            '<path d="M72,128 C84,122 96,128 108,122 C120,128 132,120 142,118" fill="none" stroke="#1f3f66" stroke-width="2.2"/>'
            '<path d="M148,80 C150,90 150,100 146,110" fill="none" stroke="#1f3f66" stroke-width="2"/>'
            '<path d="M76,84 C72,92 70,100 70,108" fill="none" stroke="#1f3f66" stroke-width="2"/>'
            '<path d="M101,96 l2.2,4.5 5,.7 -3.6,3.5 .9,5 -4.5,-2.4 -4.5,2.4 .9,-5 -3.6,-3.5 5,-.7 Z" fill="#e8b631" stroke="#a87a12" stroke-width=".8"/>'
            '<path d="M114,96 l2.2,4.5 5,.7 -3.6,3.5 .9,5 -4.5,-2.4 -4.5,2.4 .9,-5 -3.6,-3.5 5,-.7 Z" fill="#e8b631" stroke="#a87a12" stroke-width=".8"/>'
            '<path d="M127,96 l2.2,4.5 5,.7 -3.6,3.5 .9,5 -4.5,-2.4 -4.5,2.4 .9,-5 -3.6,-3.5 5,-.7 Z" fill="#e8b631" stroke="#a87a12" stroke-width=".8"/>'
            '</g>')
s = CAPE.sub(shirt, s)
# collar: burgundy neck band -> sky blue with white trim
s = s.replace('fill="#a3264f" stroke="#5a1029" stroke-width="1.2"/>\n  <path d="M148,84 C160,92 178,88 190,74" fill="none" stroke="#d4a23a"',
              'fill="#75aadb" stroke="#1f3f66" stroke-width="1.2"/>\n  <path d="M148,84 C160,92 178,88 190,74" fill="none" stroke="#ffffff"')
open(P, 'w', encoding='utf8').write(s)
print('shirts:', n[0], '| collars:', s.count('fill="#75aadb" stroke="#1f3f66" stroke-width="1.2"'))
