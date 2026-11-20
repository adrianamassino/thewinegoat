"""Argentine home (es-ar/index.html): Argentina-football x wine scenes between some sections.
Goats in the sky-blue/white striped shirt with a big 10 on the back (same drawing as the walking .tgoat goats),
a generic two-handled gold cup full of red wine, sky-blue/white confetti, three stars, a ball that turns into
grapes, a goal made of vine poles, a ball that pops the cork of a bottle.
No real trophy shape, no crest, no logos, no player names.
Idempotent: removes its own previous output (<!--arf:N--> ... <!--/arf:N--> and <style id="arfoot">) and re-inserts it.
Run from repo root after tools/ar_goats.py and tools/home_grapes.py:  python3 tools/ar_football.py"""
import re

P = 'es-ar/index.html'

# ---------------------------------------------------------------- the goat (copied from the .tgoat walking goat)
LEGS = '''<g class="leg bl far" style="transform-origin:80px 126px"><g class="shin" style="transform-origin:80px 150px"><path d="M71,146 C71,158 72,166 73,173 L87,173 C88,166 89,158 89,146 Z" fill="#f3e2cc" stroke="#c39c7c" stroke-width="1.6"/><path d="M71,171 C76,168 84,168 89,171 L90,181 Q80,185 70,181 Z" fill="#5a382b"/><path d="M81,172 L81,183" stroke="#3a2219" stroke-width="1.3"/></g><path d="M66,118 C65,134 68,146 71,154 Q80,158 89,154 C92,144 95,132 94,118 Z" fill="#f3e2cc" stroke="#c39c7c" stroke-width="1.6"/></g><g class="leg fl far" style="transform-origin:146px 126px"><g class="shin" style="transform-origin:146px 150px"><path d="M137,146 C137,158 138,166 139,173 L153,173 C154,166 155,158 155,146 Z" fill="#f3e2cc" stroke="#c39c7c" stroke-width="1.6"/><path d="M137,171 C142,168 150,168 155,171 L156,181 Q146,185 136,181 Z" fill="#5a382b"/><path d="M147,172 L147,183" stroke="#3a2219" stroke-width="1.3"/></g><path d="M132,118 C131,134 134,146 137,154 Q146,158 155,154 C158,144 161,132 160,118 Z" fill="#f3e2cc" stroke="#c39c7c" stroke-width="1.6"/></g>
 <g class="leg bl near" style="transform-origin:94px 126px"><g class="shin" style="transform-origin:94px 150px"><path d="M85,146 C85,158 86,166 87,173 L101,173 C102,166 103,158 103,146 Z" fill="#fff7ec" stroke="#c39c7c" stroke-width="1.6"/><path d="M85,171 C90,168 98,168 103,171 L104,181 Q94,185 84,181 Z" fill="#5a382b"/><path d="M95,172 L95,183" stroke="#3a2219" stroke-width="1.3"/></g><path d="M80,118 C79,134 82,146 85,154 Q94,158 103,154 C106,144 109,132 108,118 Z" fill="#fff7ec" stroke="#c39c7c" stroke-width="1.6"/></g><g class="leg fl near" style="transform-origin:160px 126px"><g class="shin" style="transform-origin:160px 150px"><path d="M151,146 C151,158 152,166 153,173 L167,173 C168,166 169,158 169,146 Z" fill="#fff7ec" stroke="#c39c7c" stroke-width="1.6"/><path d="M151,171 C156,168 164,168 169,171 L170,181 Q160,185 150,181 Z" fill="#5a382b"/><path d="M161,172 L161,183" stroke="#3a2219" stroke-width="1.3"/></g><path d="M146,118 C145,134 148,146 151,154 Q160,158 169,154 C172,144 175,132 174,118 Z" fill="#fff7ec" stroke="#c39c7c" stroke-width="1.6"/></g>
 <g class="tail" style="transform-origin:64px 96px"><path d="M68,98 C58,94 52,84 54,74 C56,68 62,70 64,76 C66,84 70,90 74,94 Z" fill="#fff7ec" stroke="#c39c7c" stroke-width="1.5"/></g>
 <path class="body" d="M176.0,108.0 Q179.3,114.9 171.6,120.6 Q170.4,127.9 159.0,131.3 Q153.8,138.5 140.2,138.5 Q130.9,144.9 118.0,141.0 Q105.1,144.9 95.8,138.5 Q82.2,138.5 77.0,131.3 Q65.6,127.9 64.4,120.6 Q56.7,114.9 60.0,108.0 Q56.7,101.1 64.4,95.4 Q65.6,88.1 77.0,84.7 Q82.2,77.5 95.8,77.5 Q105.1,71.1 118.0,75.0 Q130.9,71.1 140.2,77.5 Q153.8,77.5 159.0,84.7 Q170.4,88.1 171.6,95.4 Q179.3,101.1 176.0,108.0 Z" fill="#fff7ec" stroke="#c39c7c" stroke-width="1.8" stroke-linejoin="round"/>
 <path d="M84,118 q6,-5 12,0 M104,124 q6,-5 12,0 M126,122 q6,-5 12,0 M146,116 q6,-5 12,0" fill="none" stroke="#ecd7bd" stroke-width="1.6" stroke-linecap="round"/>'''

NECKHEAD = '''<g class="neckhead">
  <path d="M146,100 C146,82 156,66 170,58 L192,72 C186,88 176,100 164,110 Z" fill="#fff7ec" stroke="#c39c7c" stroke-width="1.6"/>
  <path d="M148,84 C160,92 178,88 190,74 L194,82 C182,98 162,104 146,96 Z" fill="#75aadb" stroke="#1f3f66" stroke-width="1.2"/>
  <path d="M148,84 C160,92 178,88 190,74" fill="none" stroke="#ffffff" stroke-width="1.6"/>
  <g class="head" style="transform-origin:180px 70px">
   <g class="horns" fill="none" stroke-linecap="round">
    <path d="M178,46 C170,22 146,16 134,28 C124,38 130,54 144,52 C152,50 152,40 145,39" stroke="#5c3a2e" stroke-width="10"/>
    <path d="M178,46 C170,22 146,16 134,28 C124,38 130,54 144,52 C152,50 152,40 145,39" stroke="#7d5038" stroke-width="7"/>
    <path d="M190,42 C186,18 160,8 146,20 C136,30 140,46 154,45 C162,44 162,34 155,33" stroke="#6b4128" stroke-width="11"/>
    <path d="M190,42 C186,18 160,8 146,20 C136,30 140,46 154,45 C162,44 162,34 155,33" stroke="#a06a45" stroke-width="8"/>
    <path d="M190,42 C186,18 160,8 146,20 C136,30 140,46 154,45" stroke="#6b4128" stroke-width="8" stroke-dasharray="1.5 4.5"/></g>
   <path d="M178,46 C190,32 214,34 222,50 C226,58 236,64 238,72 C240,82 230,88 218,86 C206,88 190,84 182,76 C174,68 172,56 178,46 Z" fill="#fff7ec" stroke="#c39c7c" stroke-width="1.8" stroke-linejoin="round"/>
   <g class="ear" style="transform-origin:180px 56px"><path d="M182,54 C168,52 152,60 146,74 C150,80 162,76 172,70 C178,66 182,60 182,54 Z" fill="#fff7ec" stroke="#c39c7c" stroke-width="1.5"/><path d="M178,58 C168,58 158,64 153,72 C162,74 170,68 176,63 Z" fill="#f4b0b6"/>
    <circle cx="151" cy="76" r="3.4" fill="none" stroke="#d4a23a" stroke-width="2"/></g>
   <path d="M180,44 C186,38 194,38 198,42 C192,42 186,44 182,48 Z" fill="#f3e2cc"/>
   {EYE}
   <ellipse cx="206" cy="70" rx="7" ry="4" fill="#f6a8b0" opacity=".65"/>
   <ellipse cx="233" cy="70" rx="3.6" ry="2.6" fill="#d98a94"/>
   {MOUTH}
   <path d="M208,86 C206,96 212,104 216,100 C214,96 216,92 214,86 Z" fill="#fff7ec" stroke="#c39c7c" stroke-width="1.3"/>
  </g>
 </g>'''
EYE_HAPPY = ('<path class="eye" d="M196,58 q7,6 14,0" fill="none" stroke="#3e261d" stroke-width="2.6" stroke-linecap="round"/>\n'
             '   <path d="M196,58 l-3,-2 M199,61 l-2,-3" stroke="#3e261d" stroke-width="1.4" stroke-linecap="round"/>')
EYE_OPEN = ('<circle class="eye" cx="203" cy="58" r="4.2" fill="#3e261d"/><circle cx="204.6" cy="56.4" r="1.4" fill="#fff"/>\n'
            '   <path d="M196,50 q7,-4 14,0" fill="none" stroke="#c39c7c" stroke-width="1.6" stroke-linecap="round"/>')
MOUTH_SHUT = '<path class="mouth shut" d="M220,80 q6,4 12,-1" fill="none" stroke="#7a4a3a" stroke-width="1.8" stroke-linecap="round"/>'
MOUTH_OPEN = '<path class="mouth open" d="M219,78 q7,10 14,0 q-7,3 -14,0 Z" fill="#8c1d40" stroke="#7a4a3a" stroke-width="1.4"/>'

STAR = 'l2.2,4.5 5,.7 -3.6,3.5 .9,5 -4.5,-2.4 -4.5,2.4 .9,-5 -3.6,-3.5 5,-.7 Z'


def shirt(pid, flip=False):
    """sky-blue/white stripes, three small gold stars, a big 10 on the back"""
    body = 'M152,80 C132,74 100,74 76,84 C70,96 68,112 72,128 C84,122 96,128 108,122 C120,128 132,120 142,118 C150,108 154,94 152,80 Z'
    stars = ''.join(f'<path d="M{x},81 {STAR}" fill="#e8b631" stroke="#a87a12" stroke-width=".8" transform="translate({x*.25:.1f},20.25) scale(.75)"/>' for x in (100, 112, 124))
    return (f'<g class="cape"><defs><pattern id="{pid}" width="16" height="12" patternUnits="userSpaceOnUse"><rect width="16" height="12" fill="#ffffff"/><rect x="2" width="7" height="12" fill="#75aadb"/></pattern></defs>'
            f'<path d="{body}" fill="url(#{pid})" stroke="#3d6f9e" stroke-width="1.4" stroke-linejoin="round"/>'
            '<path d="M72,128 C84,122 96,128 108,122 C120,128 132,120 142,118" fill="none" stroke="#1f3f66" stroke-width="2.2"/>'
            '<path d="M148,80 C150,90 150,100 146,110" fill="none" stroke="#1f3f66" stroke-width="2"/>'
            '<path d="M76,84 C72,92 70,100 70,108" fill="none" stroke="#1f3f66" stroke-width="2"/>'
            + stars +
            '<text x="111" y="119" text-anchor="middle" font-family="Arial Black,Arial,Helvetica,sans-serif" font-weight="900" font-size="27" letter-spacing="-1" '
            'fill="#1f3f66" stroke="#ffffff" stroke-width="3.2" paint-order="stroke" stroke-linejoin="round"' + (' transform="translate(222,0) scale(-1,1)"' if flip else '') + '>10</text></g>')


def goat(pid, x, y, w=260, cls='', happy=True, talk=False, flip=False, onhead=''):
    """a nested <svg> so the goat's own transform-origins (view-box) keep working inside a bigger scene"""
    h = w * 195 / 260
    inner = NECKHEAD.replace('{EYE}', EYE_HAPPY if happy else EYE_OPEN).replace('{MOUTH}', MOUTH_OPEN if talk else MOUTH_SHUT)
    if onhead:  # a prop riding on the head (moves with it), in the goat's own coordinates
        inner = inner.replace('\n  </g>\n </g>', '\n   ' + onhead + '\n  </g>\n </g>')
    return (f'<svg class="afg{(" " + cls) if cls else ""}" x="{x}" y="{y}" width="{w:g}" height="{h:g}" viewBox="0 0 260 195" overflow="visible">'
            '<ellipse class="shadow" cx="122" cy="184" rx="66" ry="6.5" fill="rgba(62,15,34,.16)"/>'
            f'<g class="bodyall">\n {LEGS}\n {shirt(pid, flip)}\n {inner}\n</g></svg>')


# ---------------------------------------------------------------- props
def ball(cx, cy, r=14, cls='afball'):
    k = r / 14
    return (f'<g class="{cls}"><circle cx="{cx}" cy="{cy}" r="{r}" fill="#ffffff" stroke="#2b2b2b" stroke-width="{1.6*k:.2f}"/>'
            f'<g transform="translate({cx},{cy}) scale({k:.3f})" fill="#2b2b2b">'
            '<path d="M0,-5 L4.8,-1.5 3,4 -3,4 -4.8,-1.5 Z"/>'
            '<path d="M0,-13.8 L4,-11.2 0,-8.6 -4,-11.2 Z M12.6,-5.6 L13.4,-1 10,1.2 8.4,-3.4 Z M-12.6,-5.6 L-13.4,-1 -10,1.2 -8.4,-3.4 Z M8.6,10.6 L4.4,13 3.4,9.4 7,7.6 Z M-8.6,10.6 L-4.4,13 -3.4,9.4 -7,7.6 Z"/>'
            '<path d="M0,-5 L0,-8.6 M4.8,-1.5 L8.4,-3 M3,4 L5.6,7.4 M-3,4 L-5.6,7.4 M-4.8,-1.5 L-8.4,-3" stroke="#2b2b2b" stroke-width="1" fill="none"/></g>'
            f'<circle cx="{cx - r*.35:.1f}" cy="{cy - r*.4:.1f}" r="{r*.22:.1f}" fill="#fff" opacity=".7"/></g>')


def glass(x, y, s=1, cls='afglass'):
    """wine glass, base centred at (x, y)"""
    return (f'<g class="{cls}"><g transform="translate({x},{y}) scale({s})">'
            '<ellipse cx="0" cy="-1.5" rx="13" ry="3" fill="#f7eef2" stroke="#b9a2ad" stroke-width="1.2"/>'
            '<path d="M0,-2 L0,-30" stroke="#b9a2ad" stroke-width="2.4"/>'
            '<path d="M-15,-66 C-17,-48 -10,-34 0,-31 C10,-34 17,-48 15,-66 Z" fill="#ffffff" fill-opacity=".55" stroke="#b9a2ad" stroke-width="1.4"/>'
            '<path d="M-14.6,-52 C-13,-40 -8,-34 0,-32 C8,-34 13,-40 14.6,-52 Z" fill="#8c1d40"/>'
            '<ellipse cx="0" cy="-52" rx="14.6" ry="2.6" fill="#b0294f"/>'
            '<path d="M-9,-62 C-11,-54 -9,-46 -6,-42" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".8"/></g></g>')


def stars3(x, y, s=1, cls='afstars'):
    return (f'<g class="{cls}"><g transform="translate({x},{y}) scale({s})">' +
            ''.join(f'<path d="M{dx},{dy} {STAR}" fill="#e8b631" stroke="#a87a12" stroke-width=".9" transform="translate({dx},{dy}) scale(1.5) translate({-dx},{-dy})"/>'
                    for dx, dy in ((-20, 4), (0, 0), (20, 4))) + '</g></g>')


def cup(x, y, s=1, cls='afcup'):
    """generic classic two-handled gold cup full of red wine; base centred at (x, y)"""
    return (f'<g class="{cls}"><g transform="translate({x},{y}) scale({s})">'
            '<path d="M-24,0 L24,0 L21,-12 L-21,-12 Z" fill="#7a4f2e" stroke="#4e2f19" stroke-width="1.4"/>'
            '<path d="M-17,-12 L17,-12 L13,-20 L-13,-20 Z" fill="#c9971f" stroke="#8a6410" stroke-width="1.3"/>'
            '<path d="M-5,-20 C-5,-30 -3,-36 -8,-42 L8,-42 C3,-36 5,-30 5,-20 Z" fill="#e8b631" stroke="#8a6410" stroke-width="1.3"/>'
            '<path d="M-26,-92 C-38,-92 -44,-84 -42,-74 C-40,-64 -30,-58 -20,-56" fill="none" stroke="#8a6410" stroke-width="6.5" stroke-linecap="round"/>'
            '<path d="M-26,-92 C-38,-92 -44,-84 -42,-74 C-40,-64 -30,-58 -20,-56" fill="none" stroke="#f0c548" stroke-width="3.5" stroke-linecap="round"/>'
            '<path d="M26,-92 C38,-92 44,-84 42,-74 C40,-64 30,-58 20,-56" fill="none" stroke="#8a6410" stroke-width="6.5" stroke-linecap="round"/>'
            '<path d="M26,-92 C38,-92 44,-84 42,-74 C40,-64 30,-58 20,-56" fill="none" stroke="#f0c548" stroke-width="3.5" stroke-linecap="round"/>'
            '<path d="M-30,-96 L30,-96 C30,-70 20,-48 0,-42 C-20,-48 -30,-70 -30,-96 Z" fill="#e8b631" stroke="#8a6410" stroke-width="1.6"/>'
            '<ellipse cx="0" cy="-96" rx="30" ry="6" fill="#8c1d40" stroke="#8a6410" stroke-width="1.6"/>'
            '<ellipse cx="-4" cy="-97" rx="16" ry="2.2" fill="#c0365e" opacity=".8"/>'
            '<path d="M-21,-88 C-21,-72 -15,-58 -6,-50" fill="none" stroke="#fff3c4" stroke-width="3" stroke-linecap="round" opacity=".75"/>'
            '<path d="M-28,-80 L28,-80" stroke="#c9971f" stroke-width="1.4"/>'
            f'<path d="M0,-74 {STAR}" fill="#fff3c4" stroke="#a87a12" stroke-width=".8" transform="translate(0,-74) scale(1.2) translate(0,74)"/>'
            '<path class="afslosh" d="M18,-99 C22,-104 24,-108 22,-112 C26,-108 26,-102 22,-98 Z" fill="#8c1d40"/>'
            '</g></g>')


def bunch(x, y, s=1, cls='afgrape'):
    """grape bunch centred near (x, y)"""
    berries = [(-10, -12), (0, -12), (10, -12), (-15, -3), (-5, -3), (5, -3), (15, -3), (-10, 6), (0, 6), (10, 6), (-5, 15), (5, 15), (0, 23)]
    b = ''.join(f'<circle cx="{bx}" cy="{by}" r="6.2" fill="#6b2a5c" stroke="#47173d" stroke-width="1"/><circle cx="{bx-2}" cy="{by-2}" r="1.6" fill="#fff" opacity=".45"/>' for bx, by in berries)
    return (f'<g class="{cls}"><g transform="translate({x},{y}) scale({s})">'
            '<path d="M0,-18 C0,-24 4,-27 8,-28" fill="none" stroke="#6b4128" stroke-width="2.4" stroke-linecap="round"/>'
            '<path d="M3,-20 C10,-30 26,-28 28,-20 C20,-20 16,-14 8,-15 Z" fill="#7da64a" stroke="#4f6f2b" stroke-width="1.2"/>' + b + '</g></g>')


def leaf(x, y, r=0, s=1):
    return (f'<path transform="translate({x},{y}) rotate({r}) scale({s})" d="M0,0 C-6,-4 -14,-2 -14,6 C-18,10 -12,16 -6,14 C-4,20 4,20 6,14 C12,16 18,10 14,6 C14,-2 6,-4 0,0 Z" '
            'fill="#7da64a" stroke="#4f6f2b" stroke-width="1.1"/>')


def confetti(x0, x1, y, n, seed):
    import random
    rnd = random.Random(seed); out = ''
    for i in range(n):
        x = rnd.uniform(x0, x1); c = '#75aadb' if i % 2 else '#ffffff'; d = rnd.uniform(0, 3.2); r = rnd.randint(-40, 40)
        out += (f'<g class="afconf" style="animation-delay:-{d:.1f}s;animation-duration:{2.6 + rnd.random()*1.4:.1f}s">'
                f'<rect x="{x:.0f}" y="{y + rnd.uniform(-8, 8):.0f}" width="5" height="9" rx="1" fill="{c}" stroke="#3d6f9e" stroke-width=".7" transform="rotate({r} {x:.0f} {y:.0f})"/></g>')
    return out


def bubble(x, y, text, w, tail='left', cls='afbub'):
    """speech bubble, top-left at (x, y)"""
    tx = x + 18 if tail == 'left' else x + w - 18
    td = f'M{tx-6},{y+30} L{tx + (-8 if tail == "left" else 8)},{y+42} L{tx+6},{y+30} Z'
    return (f'<g class="{cls}"><rect x="{x}" y="{y}" width="{w}" height="32" rx="16" fill="#ffffff" stroke="#3d6f9e" stroke-width="1.6"/>'
            f'<path d="{td}" fill="#ffffff" stroke="#3d6f9e" stroke-width="1.6" stroke-linejoin="round"/>'
            f'<rect x="{tx-7}" y="{y+27}" width="14" height="4" fill="#ffffff"/>'
            f'<text x="{x + w/2:g}" y="{y+21}" text-anchor="middle" font-family="DM Sans,Arial,Helvetica,sans-serif" font-weight="800" font-size="15" fill="#3e0f22">{text}</text></g>')


def scene(cls, vb, body, label):
    return f'<div class="afs {cls}"><svg viewBox="{vb}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><title>{label}</title>{body}</svg></div>'


# ---------------------------------------------------------------- the scenes (no two alike)
def s_juggle():
    # goat heading a ball up and down, a glass of red next to it
    return scene('afs-juggle', '0 0 300 270',
                 bubble(6, 6, '¡Vamos!', 86) +
                 goat('arf1', 0, 72, cls='afg-head') +
                 '<g class="afbounce">' + ball(206, 88, 15) + '</g>' +
                 glass(272, 260, 1),
                 'Cabra con la camiseta 10 haciendo jueguitos con la cabeza al lado de una copa de vino')


def s_chilena():
    # bicycle kick: the goat flips back, the ball flies off and turns into a bunch of grapes
    return scene('afs-kick', '0 0 320 270',
                 '<g class="afflip">' + goat('arf3', 46, 74, cls='afg-kick', happy=False) + '</g>' +
                 '<g class="afshot"><g class="afshotb">' + ball(176, 34, 14) + '</g><g class="afshotg">' + bunch(176, 34, .8) + '</g></g>' +
                 bubble(196, 8, '¡Qué chilena!', 116, tail='right'),
                 'Cabra con la camiseta 10 haciendo una chilena: la pelota se convierte en un racimo de uvas')


def s_goal():
    # a goal made of vine poles, the ball in the net, the goat celebrating
    net = ''.join(f'<path d="M{x},62 L{x+16},212" stroke="#d9cfd3" stroke-width="1.1"/>' for x in range(160, 300, 14)) + \
          ''.join(f'<path d="M160,{y} L300,{y + 6}" stroke="#d9cfd3" stroke-width="1.1"/>' for y in range(76, 212, 14))
    vine = ('<path d="M160,210 C150,180 170,160 158,130 C148,104 168,88 160,62 M300,210 C310,184 292,160 304,132 C314,104 294,86 300,62 '
            'M160,58 C190,48 210,70 232,56 C256,42 278,66 300,58" fill="none" stroke="#5f7d36" stroke-width="2.4" stroke-linecap="round"/>' +
            leaf(160, 104, -30, .9) + leaf(304, 150, 20, .9) + leaf(196, 54, 0, .8) + leaf(266, 56, 10, .8) + leaf(158, 168, 30, .8) + leaf(300, 96, -10, .8))
    posts = ('<path d="M156,214 L156,58 L304,58 L304,214" fill="none" stroke="#6b4128" stroke-width="9" stroke-linejoin="round"/>'
             '<path d="M156,214 L156,58 L304,58 L304,214" fill="none" stroke="#a06a45" stroke-width="5" stroke-linejoin="round"/>'
             '<path d="M156,70 l0,12 M156,110 l0,10 M156,150 l0,12 M304,90 l0,12 M304,140 l0,10 M190,58 l14,0 M250,58 l12,0" stroke="#6b4128" stroke-width="2"/>')
    return scene('afs-goal', '0 0 320 270',
                 '<path d="M0,262 L320,262" stroke="#cfe0bf" stroke-width="3"/>' + '<g opacity=".9">' + net + '</g>' + posts + vine +
                 bunch(224, 86, .6, 'afgrape afgr1') + bunch(282, 84, .55, 'afgrape afgr2') +
                 '<g class="afinnet">' + ball(258, 190, 13) + '</g>' +
                 confetti(150, 310, 30, 12, 9) +
                 '<g class="afjump">' + goat('arf4', -24, 122, w=190, cls='afg-cheer', talk=True) + '</g>' +
                 bubble(8, 40, '¡Golazo!', 92),
                 'Cabra festejando un gol delante de un arco hecho con postes y hojas de parra')


def s_cork():
    # a ball bounces across the lane and knocks the cork out of a bottle; the goat toasts
    bottle = ('<g class="afbottle">'
              '<path d="M512,192 L512,104 C512,90 520,84 526,78 L526,40 L546,40 L546,78 C552,84 560,90 560,104 L560,192 Q536,198 512,192 Z" fill="#2f4a2a" stroke="#1d2e1a" stroke-width="1.8"/>'
              '<path d="M518,108 C518,98 522,92 528,86" fill="none" stroke="#6f8f5f" stroke-width="3" stroke-linecap="round" opacity=".7"/>'
              '<rect x="514" y="122" width="44" height="44" rx="3" fill="#f6ecd9" stroke="#c9b48c" stroke-width="1.2"/>'
              '<path d="M520,132 L552,132 M524,154 L548,154" stroke="#8c1d40" stroke-width="2.4"/>'
              '<path d="M528,148 l2.2,-4.5 5,-.7 -3.6,-3.5 .9,-5 -4.5,2.4" fill="none"/>'
              '<rect x="524" y="42" width="24" height="12" fill="#8c1d40"/>'
              f'<path d="M536,138 {STAR}" fill="#e8b631" stroke="#a87a12" stroke-width=".8"/>'
              '</g>')
    cork = ('<g class="afcork"><rect x="528" y="22" width="16" height="22" rx="3" fill="#c8995c" stroke="#8a6438" stroke-width="1.4"/>'
            '<path d="M531,28 l3,0 M537,34 l3,0 M532,38 l2,0" stroke="#8a6438" stroke-width="1.2"/></g>')
    pop = ('<g class="afpop">' + ''.join(f'<path d="M536,30 L{536 + dx},{30 + dy}" stroke="{c}" stroke-width="3" stroke-linecap="round"/>'
                                          for dx, dy, c in ((-22, -16, '#75aadb'), (0, -26, '#e8b631'), (22, -16, '#75aadb'), (-26, 2, '#e8b631'), (26, 2, '#e8b631'))) + '</g>')
    return scene('afs-cork', '0 0 640 210',
                 '<path d="M0,196 L640,196" stroke="#ead9cc" stroke-width="2" stroke-dasharray="2 8" stroke-linecap="round"/>' +
                 stars3(320, 20, .9) +
                 '<g class="afrollx"><g class="afrolly">' + ball(210, 180, 14, 'afball afspin') + '</g></g>' +
                 bottle + pop + cork +
                 glass(600, 196, .9) +
                 goat('arf5', 4, 66, w=176, cls='afg-watch', talk=True) +
                 bubble(150, 34, '¡Vamos, vamos!', 130),
                 'Una pelota rebota por el piso y le hace saltar el corcho a una botella de vino; una cabra con la 10 brinda')


def s_podium():
    # on the top step of a podium the goat rears up and lifts the gold cup; confetti and three twinkling stars
    pod = ('<path d="M40,262 L40,226 L104,226 L104,206 L196,206 L196,236 L260,236 L260,262 Z" fill="#f6ecd9" stroke="#c9b48c" stroke-width="2" stroke-linejoin="round"/>'
           '<path d="M104,206 L196,206 L196,214 L104,214 Z" fill="#75aadb"/><path d="M40,226 L104,226 L104,232 L40,232 Z M196,236 L260,236 L260,242 L196,242 Z" fill="#ead9cc"/>'
           f'<path d="M150,224 {STAR}" fill="#e8b631" stroke="#a87a12" stroke-width=".9" transform="translate(150,224) scale(2) translate(-150,-224)"/>')
    return scene('afs-cup', '0 0 300 270',
                 confetti(10, 290, -30, 22, 3) +
                 stars3(232, 14, .9, 'afstars afst1') + stars3(52, 34, .6, 'afstars afst2') + pod +
                 goat('arf2', 58, 72, w=190, cls='afg-lift', onhead='<g class="afcupup">' + cup(200, 40, .8) + '</g>'),
                 'Cabra campeona en lo alto del podio con una copa dorada en alto llena de vino tinto entre papelitos celestes y blancos')


def s_toast():
    # two goats in the shirt toasting after the goal, a ball resting at their hooves
    return scene('afs-toast', '0 0 400 250',
                 '<g class="aftl">' + goat('arf6', -8, 92, w=210, cls='afg-tl') + '</g>' +
                 '<g transform="translate(388,0) scale(-1,1)"><g class="aftr">' + goat('arf7', -8, 92, w=210, cls='afg-tr', talk=True, flip=True) + '</g></g>' +
                 '<g class="afclinkl">' + glass(168, 192, .8) + '</g><g class="afclinkr">' + glass(220, 192, .8) + '</g>' +
                 '<g class="afspark">' + ''.join(f'<path d="M194,118 L{194+dx},{118+dy}" stroke="#e8b631" stroke-width="2.4" stroke-linecap="round"/>' for dx, dy in ((-12, -10), (0, -16), (12, -10))) + '</g>' +
                 bubble(8, 30, '¡Salud, campeones!', 158),
                 'Dos cabras con la camiseta celeste y blanca brindando con copas de vino tinto después del gol')


def s_keeper():
    # goalkeeper goat dives in front of a wine barrel and stops the ball
    hoops = ''.join(f'<path d="M{x0},{y} C40,{y+d} 100,{y+d} {x1},{y}" fill="none" stroke="#3a2a22" stroke-width="5"/>'
                    for x0, x1, y, d in ((22, 118, 178, 8), (16, 124, 214, 8), (22, 118, 250, 8)))
    barrel = ('<g class="afbarrel"><path d="M24,160 C12,190 12,236 24,262 L116,262 C128,236 128,190 116,160 Z" fill="#a06a45" stroke="#5c3a2e" stroke-width="2"/>'
              '<path d="M46,162 C40,190 40,236 46,262 M70,160 L70,262 M94,162 C100,190 100,236 94,262" stroke="#7d5038" stroke-width="1.6" fill="none"/>' + hoops +
              '<ellipse cx="70" cy="160" rx="46" ry="9" fill="#c08a5c" stroke="#5c3a2e" stroke-width="2"/><ellipse cx="70" cy="160" rx="30" ry="5" fill="#8c1d40" opacity=".85"/></g>')
    return scene('afs-keep', '0 0 320 270',
                 barrel + '<g class="afdive">' + goat('arf8', 50, 92, w=210, cls='afg-keep', happy=False) + '</g>' +
                 '<g class="afsave">' + ball(200, 98, 13) + '</g>' +
                 bubble(196, 196, '¡Atajada!', 100, tail='right'),
                 'Cabra arquera con la camiseta 10 atajando una pelota delante de un barril de vino')


def s_run():
    # a goat running flat out, dribbling the ball (crosses the hero lane)
    return scene('afs-run', '0 0 330 200',
                 goat('arf9', 0, 4, cls='afg-run', happy=False) + '<g class="afdrib">' + ball(296, 176, 16, 'afball afspin2') + '</g>',
                 'Cabra con la camiseta 10 corriendo con la pelota')


def s_jump():
    # celebration jumps under three twinkling stars and sky-blue/white confetti
    return scene('afs-jump', '0 0 300 250',
                 confetti(20, 280, -20, 16, 21) + stars3(250, 18, 1, 'afstars afst1') +
                 '<g class="afhop">' + goat('arf10', 50, 76, w=230, cls='afg-hop', talk=True) + '</g>' +
                 glass(268, 244, .8) + bubble(0, 14, '¡Dale, campeón!', 132),
                 'Cabra con la camiseta 10 saltando de alegría entre papelitos celestes y blancos y tres estrellas')


def lane_touch(i, what):
    """recurring touches on a lane: a ball bouncing across and/or three tiny twinkling stars"""
    out = ''
    if 'ball' in what:
        bl = '<svg viewBox="-16 -16 32 32" width="22" height="22">' + ball(0, 0, 14) + '</svg>'
        out += f'<span class="afl-ball" style="animation-delay:-{i*2.3:.1f}s"><span>{bl}</span></span>'
    if 'stars' in what:
        st = ('<svg viewBox="-30 -8 60 20" width="42" height="14">' + ''.join(
            f'<path d="M{dx},{dy} {STAR}" fill="#e8b631" stroke="#a87a12" stroke-width=".9" transform="translate({dx},{dy}) scale(1.2) translate({-dx},{-dy})"/>'
            for dx, dy in ((-20, 2), (0, -2), (20, 2))) + '</svg>')
        out += f'<span class="afl-st" style="{"left:4%" if i % 2 else "right:4%"};animation-delay:-{i*.7:.1f}s">{st}</span>'
    return out


# the runner needs the lane width for its keyframes
LWJS = """<script id="arflw">document.addEventListener('DOMContentLoaded',function(){function f(){[].forEach.call(document.querySelectorAll('.glane'),function(l){l.style.setProperty('--lw',l.clientWidth+'px')})}f();addEventListener('resize',f)});</script>"""


CSS = '''<style id="arfoot">
.arfb{display:flex;justify-content:center;max-width:980px;margin:26px auto 6px;padding:0 16px;pointer-events:none;position:relative;z-index:1}
.arfb .afs{flex:0 1 auto;width:250px}.arfb .afs-cork{width:min(520px,100%)}.arfb .afs-toast{width:330px}
.afs svg{display:block;width:100%;height:auto;overflow:visible}
.afs *{transform-box:view-box}
.afs .afg .bodyall{transform-origin:120px 182px;animation:afbreath 3s ease-in-out infinite}
.afs .afg .ear{animation:afear 4.4s ease-in-out infinite}.afs .afg .tail{animation:aftail 1s ease-in-out infinite}
@keyframes afbreath{50%{transform:scale(1.012,.988)}}@keyframes afear{50%{transform:rotate(8deg)}}@keyframes aftail{50%{transform:rotate(-14deg)}}
/* 1 jueguitos: head nods as the ball lands */
.afs-juggle .afg-head .head{animation:afnod 1.1s ease-in-out infinite}
@keyframes afnod{0%,100%{transform:rotate(-12deg)}8%{transform:rotate(-20deg)}30%,85%{transform:rotate(-8deg)}}
.afs-juggle .afbounce{animation:afup 1.1s infinite}
@keyframes afup{0%,100%{transform:translateY(0);animation-timing-function:cubic-bezier(.2,.7,.4,1)}50%{transform:translateY(-72px);animation-timing-function:cubic-bezier(.6,0,.8,.3)}}
.afs-juggle .afball{transform-origin:206px 88px;animation:afrot 2.2s linear infinite}
.afs-juggle .afglass{animation:none}
@keyframes afrot{to{transform:rotate(360deg)}}
/* 2 la copa: the goat rears up and lifts the cup */
.afs-cup .afg-lift .head{animation:afproud 2.6s ease-in-out infinite}
@keyframes afproud{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(-14deg)}}
.afs-cup .afg-lift .leg.fl.near{transform-origin:160px 126px;animation:afwave 1.3s ease-in-out infinite}
@keyframes afwave{0%,100%{transform:rotate(-70deg)}50%{transform:rotate(-95deg)}}
.afs-cup .afcupup{transform-origin:200px 40px;animation:afcupw 2.6s ease-in-out infinite}
@keyframes afcupw{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(4deg) translateY(-5px)}}
.afstars{animation:afstar 2.4s ease-in-out infinite}@keyframes afstar{50%{opacity:.55}}
.afconf{animation:afconf 3s linear infinite}@keyframes afconf{0%{transform:translateY(-10px);opacity:0}10%{opacity:1}100%{transform:translateY(240px);opacity:0}}
/* 3 la chilena: flip back, kick, the ball becomes grapes */
.afs-kick .afflip{transform-origin:168px 190px;animation:afflip 3.6s ease-in-out infinite}
@keyframes afflip{0%,12%,72%,100%{transform:none}22%{transform:translateY(-30px) rotate(-60deg)}34%,42%{transform:translate(4px,-62px) rotate(-150deg)}56%{transform:translateY(-18px) rotate(-330deg)}64%{transform:rotate(-360deg)}}
.afs-kick .afg-kick .leg.bl{animation:afkick 3.6s ease-in-out infinite}
@keyframes afkick{0%,26%,50%,100%{transform:none}36%{transform:rotate(55deg)}}
.afs-kick .afshot{animation:afshot 3.6s infinite}
@keyframes afshot{0%,12%{transform:translate(0,-40px);opacity:0}20%{opacity:1;transform:translate(0,-8px)}36%{transform:translate(0,4px);animation-timing-function:cubic-bezier(.2,.6,.5,1)}62%{transform:translate(-128px,-26px);animation-timing-function:cubic-bezier(.5,0,.9,.5)}86%{transform:translate(-150px,178px);opacity:1}100%{transform:translate(-150px,178px);opacity:0}}
.afs-kick .afshotb{animation:afshb 3.6s infinite}.afs-kick .afshotg{opacity:0;animation:afshg 3.6s infinite}
@keyframes afshb{0%,48%{opacity:1}58%,100%{opacity:0}}@keyframes afshg{0%,48%{opacity:0}58%,100%{opacity:1}}
/* 4 el gol: the goat jumps, the ball shakes the vine net */
.afs-goal .afjump{animation:afjump 1.4s ease-in-out infinite}
@keyframes afjump{0%,100%{transform:translateY(0)}45%{transform:translateY(-26px)}}
.afs-goal .afg-cheer .leg{animation:aftuck 1.4s ease-in-out infinite}.afs-goal .afg-cheer .head{animation:afcheer 1.4s ease-in-out infinite}
@keyframes aftuck{0%,100%{transform:none}45%{transform:rotate(-16deg)}}@keyframes afcheer{0%,100%{transform:rotate(0)}45%{transform:rotate(-12deg)}}
.afs-goal .afinnet{animation:afnet 1.4s ease-in-out infinite}@keyframes afnet{50%{transform:translate(5px,-3px)}}
.afs-goal .afgrape{transform-origin:224px 70px;animation:afsw 3s ease-in-out infinite}.afs-goal .afgr2{transform-origin:282px 70px;animation-delay:-1.4s}
@keyframes afsw{50%{transform:rotate(6deg)}}
/* 5 el corcho: bounce, bounce, bounce... pop! */
.afs-cork .afrollx{animation:afrx 4.4s linear infinite}
@keyframes afrx{0%{transform:translateX(0);opacity:0}4%{opacity:1}52%{transform:translateX(284px)}64%{transform:translateX(240px);opacity:1}72%,100%{transform:translateX(240px);opacity:0}}
.afs-cork .afrolly{animation:afry 4.4s infinite}
@keyframes afry{0%{transform:translateY(-120px);animation-timing-function:cubic-bezier(.5,0,1,.6)}14%{transform:translateY(0);animation-timing-function:cubic-bezier(0,.4,.5,1)}24%{transform:translateY(-90px);animation-timing-function:cubic-bezier(.5,0,1,.6)}34%{transform:translateY(0);animation-timing-function:cubic-bezier(0,.4,.5,1)}43%{transform:translateY(-140px);animation-timing-function:cubic-bezier(.5,0,1,.6)}52%{transform:translateY(-130px);animation-timing-function:cubic-bezier(.5,0,1,.6)}64%,100%{transform:translateY(0)}}
.afs-cork .afspin{transform-origin:210px 180px;animation:afrot 1s linear infinite}
.afs-cork .afcork{transform-origin:536px 34px;animation:afcork 4.4s infinite}
@keyframes afcork{0%,51%{transform:none;opacity:1}62%{transform:translate(18px,-58px) rotate(200deg);opacity:1}76%{transform:translate(30px,-10px) rotate(420deg);opacity:0}77%,92%{transform:none;opacity:0}100%{transform:none;opacity:1}}
.afs-cork .afpop{opacity:0;transform-origin:536px 30px;animation:afpop 4.4s infinite}
@keyframes afpop{0%,51%{opacity:0;transform:scale(.4)}56%{opacity:1;transform:scale(1)}66%,100%{opacity:0;transform:scale(1.3)}}
.afs-cork .afbottle{transform-origin:536px 194px;animation:afwob 4.4s infinite}
@keyframes afwob{0%,51%,72%,100%{transform:none}55%{transform:rotate(5deg)}60%{transform:rotate(-4deg)}66%{transform:rotate(2deg)}}
.afs-cork .afg-watch .head{animation:afcheer 2.2s ease-in-out infinite}
.afs-cork .afglass{transform-origin:600px 196px;animation:afglass 4.4s ease-in-out infinite}@keyframes afglass{50%{transform:rotate(-5deg)}}
.afbub{animation:afbub 2.8s ease-in-out infinite}@keyframes afbub{50%{transform:translateY(-3px)}}
/* 6 el brindis */
.afs-toast .afg .leg.fl.near{transform:rotate(-100deg)}.afs-toast .afg .leg.fl.near .shin{transform:rotate(25deg)}
.afs-toast .afclinkl{transform-origin:168px 192px;animation:afclkl 2.4s ease-in-out infinite}.afs-toast .afclinkr{transform-origin:220px 192px;animation:afclkr 2.4s ease-in-out infinite}
@keyframes afclkl{0%,100%{transform:translateX(0) rotate(-4deg)}40%,55%{transform:translateX(12px) rotate(8deg)}}
@keyframes afclkr{0%,100%{transform:translateX(0) rotate(4deg)}40%,55%{transform:translateX(-12px) rotate(-8deg)}}
.afs-toast .afspark{opacity:0;transform-origin:194px 120px;animation:afspk 2.4s ease-out infinite}@keyframes afspk{0%,40%{opacity:0;transform:scale(.5)}46%{opacity:1;transform:scale(1)}62%,100%{opacity:0;transform:scale(1.2)}}
.afs-toast .afg .head{animation:afcheer 2.4s ease-in-out infinite}
/* 7 el arquero */
.afs-keep .afdive{transform-origin:150px 260px;animation:afdive 3s ease-in-out infinite}
@keyframes afdive{0%,18%,82%,100%{transform:none}38%,58%{transform:translate(8px,-40px) rotate(-22deg)}}
.afs-keep .afsave{animation:afsave 3s infinite}
@keyframes afsave{0%{transform:translate(90px,40px);opacity:0;animation-timing-function:linear}8%{opacity:1}38%{transform:translate(0,0);animation-timing-function:cubic-bezier(.2,.6,.5,1)}62%{transform:translate(40px,-70px);opacity:1}78%,100%{transform:translate(60px,-90px);opacity:0}}
@keyframes afreach{0%,18%,82%,100%{transform:none}38%,58%{transform:rotate(-125deg)}}
.afs-keep .afg-keep .leg.fl{animation:afreach 3s ease-in-out infinite}
/* 8 la corrida (hero lane): gallop across, ball ahead */
.glane .afs{position:absolute;bottom:0;z-index:1;pointer-events:none}
.glane .afs-run{left:0;width:112px;animation:afrun 10s linear infinite}
@keyframes afrun{0%{transform:translateX(-130px)}62%,100%{transform:translateX(calc(var(--lw,1200px) + 20px))}}
.afs-run .afg .bodyall{animation:afgal .36s ease-in-out infinite}@keyframes afgal{50%{transform:translateY(-10px) rotate(-3deg)}}
.afs-run .afg .leg.fl{animation:afgf .36s ease-in-out infinite}.afs-run .afg .leg.bl{animation:afgb .36s ease-in-out infinite}
@keyframes afgf{0%,100%{transform:rotate(-38deg)}50%{transform:rotate(26deg)}}@keyframes afgb{0%,100%{transform:rotate(30deg)}50%{transform:rotate(-30deg)}}
.afs-run .afg .head{transform:rotate(8deg)}
.afs-run .afspin2{transform-origin:296px 176px;animation:afrot .7s linear infinite}
.afs-run .afdrib{animation:afdrib .72s ease-in-out infinite}@keyframes afdrib{50%{transform:translateX(12px)}}
/* 9 saltos (final lane) */
.afs-jump .afhop{animation:afhop 1.6s cubic-bezier(.3,.7,.4,1) infinite}
@keyframes afhop{0%,100%{transform:translateY(0) scale(1,1)}12%{transform:translateY(6px) scale(1.04,.94)}45%{transform:translateY(-44px) rotate(-6deg)}75%{transform:translateY(0)}}
.afs-jump .afg .leg{animation:aftuck 1.6s ease-in-out infinite}.afs-jump .afg .head{animation:afcheer 1.6s ease-in-out infinite}
/* lanes on this page host scenes instead of walking goats */
main .glane.gl2{height:200px}main .glane.gl3{height:210px}main .glane.gl4{height:176px}
.glane .afs-toast{left:calc(50% - 160px);width:320px}.glane .afs-keep{left:calc(56% - 115px);width:230px}.glane .afs-jump{left:calc(50% - 100px);width:200px}
/* deco.js goats (capes, walking past) are not drawn on this page: the football goats take their place */
.dkWalk,.dkMob,.dkA:has(svg.vg){display:none!important}
/* recurring touches on the walking lanes */
.glane .afl-ball{position:absolute;left:0;bottom:2px;width:22px;z-index:0;pointer-events:none;animation:aflx 11s linear infinite}
.glane .afl-ball>span{display:block;animation:afly .9s infinite}
.glane .afl-ball svg,.glane .afl-st svg{display:block;width:100%;height:auto;overflow:visible}
@keyframes aflx{0%{left:-30px}100%{left:calc(100% + 10px)}}
@keyframes afly{0%,100%{transform:translateY(0) rotate(0);animation-timing-function:cubic-bezier(.2,.7,.4,1)}50%{transform:translateY(-34px) rotate(180deg);animation-timing-function:cubic-bezier(.6,0,.8,.3)}}
.glane .afl-st{position:absolute;top:0;width:42px;z-index:0;pointer-events:none;animation:afstar 2.2s ease-in-out infinite}
@media (max-width:700px){.arfb{margin:18px auto 2px;padding:0 12px}.arfb .afs{width:250px}.arfb .afs-cork{width:100%;max-width:420px}main .glane.gl2{height:190px}main .glane.gl3{height:200px}main .glane.gl4{height:170px}.glane .afs-toast{left:calc(50% - 150px);width:300px}.glane .afs-keep{left:calc(50% - 110px);width:220px}.glane .afs-jump{left:calc(50% - 98px);width:196px}.glane .afs-run{width:92px}}
@media (prefers-reduced-motion:reduce){.glane .afs-run{animation:none!important;transform:translateX(calc(var(--lw,1200px) * .1))}.arfb *,.glane .afs *,.glane .afl-ball,.glane .afl-ball *,.glane .afl-st{animation:none!important}.glane .afl-ball{display:none}.afs-toast .afspark{opacity:0}.afs-kick .afshotg,.afs-kick .afshot{opacity:0}.afs-cork .afpop{opacity:0}}
</style>'''

# bands: one scene per section gap (anchor = the section the band goes right before)
BANDS = [
    ('<section class="sec3 lvl3 sp3" id="spirits">', s_chilena),
    ('<section class="sec3 lvl3" id="wset-prep">', s_cork),
    ('<section class="sec3 lv3" id="level">', s_podium),
    ('<section id="por-que" class="sec3 feat3">', s_juggle),
    ('<section id="faq" class="sec3 faq3">', s_goal),
]
# walking lanes: the walking goats are replaced by a scene (grapes and lane stay as the stage)
LANESC = {'gl1': (s_run, ()), 'gl2': (s_toast, ('ball', 'stars')), 'gl3': (s_keeper, ('stars',)), 'gl4': (s_jump, ('ball',))}
GW = re.compile(r'<div class="gw[^"]*"[^>]*>\s*<svg class="tgoat".*?</svg>\s*</div>', re.S)
MARK = re.compile(r'<!--arfl(?::(gl\d))?-->.*?<!--/arfl(?::gl\d)?-->', re.S)
LANE_OPEN = re.compile(r'<div class="glane (gl\d)')


def lane_of(s, pos):
    m = None
    for m in LANE_OPEN.finditer(s, 0, pos): pass
    return m.group(1) if m else None


def lane_html(gl):
    f, touches = LANESC[gl]
    i = int(gl[2:])
    t = lane_touch(i, touches)
    return f'<!--arfl:{gl}-->{t}{f()}<!--/arfl:{gl}-->'


def main():
    s = open(P, encoding='utf8').read()
    o = s
    s = re.sub(r'<!--arf:\d+-->.*?<!--/arf:\d+-->\n?', '', s, flags=re.S)
    s = re.sub(r'<style id="arfoot">.*?</style>', '', s, flags=re.S)
    s = re.sub(r'<script id="arf(?:shirtjs|lw)">.*?</script>', '', s, flags=re.S)
    # lanes: old marks -> placeholders, walking goats -> placeholder (first per lane) or nothing
    done = set()
    def ph(gl):
        if not gl or gl not in LANESC or gl in done: return ''
        done.add(gl); return f'\x00{gl}\x00'
    s = MARK.sub(lambda m: ph(lane_of(s, m.start())), s)
    s = GW.sub(lambda m: ph(lane_of(s, m.start())), s)
    s = re.sub('\x00(gl\\d)\x00', lambda m: lane_html(m.group(1)), s)
    n = 0
    for i, (anchor, f) in enumerate(BANDS, 1):
        if s.count(anchor) != 1:
            print('ar_football: anchor not found, skipped band', i); continue
        s = s.replace(anchor, f'<!--arf:{i}--><div class="arfb" aria-hidden="true">{f()}</div><!--/arf:{i}-->\n' + anchor, 1); n += 1
    # right after <head>: a fixed spot, so other tools that re-append their styles before </head> never swap the order
    s = re.sub(r'<head(?:\s[^>]*)?>', lambda m: m.group(0) + CSS + LWJS, s, count=1)
    if s != o:
        open(P, 'w', encoding='utf8').write(s)
    print('ar_football: band scenes', n, '| lane scenes', len(done), '| changed' if s != o else '| unchanged')


if __name__ == '__main__':
    main()
