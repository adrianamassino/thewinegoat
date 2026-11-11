# -*- coding: utf-8 -*-
"""Walking goat v2 (side view, facing right), drawn after The Wine Goat mascot:
chubby woolly cream body, big curled horns, floppy pink ear, burgundy cape with a gold grape,
legs with a knee joint so the walk bends naturally."""
import math

FUR = '#fff7ec'; FUR2 = '#f3e2cc'; LINE = '#c39c7c'; HOOF = '#5a382b'

def wool(cx, cy, rx, ry, n=16, puff=5.5):
    """closed scalloped outline around an ellipse — the woolly body"""
    pts = [(cx + rx * math.cos(2 * math.pi * i / n), cy + ry * math.sin(2 * math.pi * i / n)) for i in range(n)]
    d = f'M{pts[0][0]:.1f},{pts[0][1]:.1f}'
    for i in range(n):
        a = pts[i]; b = pts[(i + 1) % n]
        m = ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
        vx, vy = m[0] - cx, m[1] - cy; L = math.hypot(vx, vy) or 1
        c = (m[0] + vx / L * puff, m[1] + vy / L * puff)
        d += f' Q{c[0]:.1f},{c[1]:.1f} {b[0]:.1f},{b[1]:.1f}'
    return d + ' Z'

def leg(cls, x, far=False):
    f = FUR2 if far else FUR
    return (f'<g class="leg {cls}" style="transform-origin:{x}px 126px">'
            f'<g class="shin" style="transform-origin:{x}px 150px">'
            f'<path d="M{x-9},146 C{x-9},158 {x-8},166 {x-7},173 L{x+7},173 C{x+8},166 {x+9},158 {x+9},146 Z" fill="{f}" stroke="{LINE}" stroke-width="1.6"/>'
            f'<path d="M{x-9},171 C{x-4},168 {x+4},168 {x+9},171 L{x+10},181 Q{x},185 {x-10},181 Z" fill="{HOOF}"/>'
            f'<path d="M{x+1},172 L{x+1},183" stroke="#3a2219" stroke-width="1.3"/></g>'
            f'<path d="M{x-14},118 C{x-15},134 {x-12},146 {x-9},154 Q{x},158 {x+9},154 C{x+12},144 {x+15},132 {x+14},118 Z" fill="{f}" stroke="{LINE}" stroke-width="1.6"/></g>')

def goat_svg(cls='tgoat'):
    body = wool(118, 108, 58, 33)
    return f'''<svg class="{cls}" viewBox="0 0 260 195" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<ellipse class="shadow" cx="122" cy="184" rx="66" ry="6.5" fill="rgba(62,15,34,.16)"/>
<g class="bodyall">
 {leg('bl far', 80, True)}{leg('fl far', 146, True)}
 {leg('bl near', 94)}{leg('fl near', 160)}
 <g class="tail" style="transform-origin:64px 96px"><path d="M68,98 C58,94 52,84 54,74 C56,68 62,70 64,76 C66,84 70,90 74,94 Z" fill="{FUR}" stroke="{LINE}" stroke-width="1.5"/></g>
 <path class="body" d="{body}" fill="{FUR}" stroke="{LINE}" stroke-width="1.8" stroke-linejoin="round"/>
 <path d="M84,118 q6,-5 12,0 M104,124 q6,-5 12,0 M126,122 q6,-5 12,0 M146,116 q6,-5 12,0" fill="none" stroke="#ecd7bd" stroke-width="1.6" stroke-linecap="round"/>
 <g class="cape" style="transform-origin:150px 84px">
  <path d="M152,80 C132,74 100,74 76,84 C70,96 68,112 72,128 C84,122 96,128 108,122 C120,128 132,120 142,118 C150,108 154,94 152,80 Z" fill="#8c1d40" stroke="#5a1029" stroke-width="1.4" stroke-linejoin="round"/>
  <path d="M72,128 C84,122 96,128 108,122 C120,128 132,120 142,118" fill="none" stroke="#d4a23a" stroke-width="2"/>
  <path d="M90,84 C88,98 88,112 92,124" fill="none" stroke="#6e1530" stroke-width="1.4" opacity=".7"/><path d="M122,80 C122,94 124,106 128,120" fill="none" stroke="#6e1530" stroke-width="1.4" opacity=".7"/>
  <g fill="#d4a23a"><circle cx="108" cy="98" r="3.2"/><circle cx="115" cy="98" r="3.2"/><circle cx="111.5" cy="104" r="3.2"/><circle cx="104.5" cy="104" r="3.2"/><circle cx="118.5" cy="104" r="3.2"/><circle cx="108" cy="110" r="3.2"/><circle cx="115" cy="110" r="3.2"/><circle cx="111.5" cy="116" r="3.2"/></g>
  <path d="M111,92 q3,-6 8,-6" fill="none" stroke="#d4a23a" stroke-width="1.6" stroke-linecap="round"/>
 </g>
 <g class="neckhead">
  <path d="M146,100 C146,82 156,66 170,58 L192,72 C186,88 176,100 164,110 Z" fill="{FUR}" stroke="{LINE}" stroke-width="1.6"/>
  <path d="M148,84 C160,92 178,88 190,74 L194,82 C182,98 162,104 146,96 Z" fill="#a3264f" stroke="#5a1029" stroke-width="1.2"/>
  <path d="M148,84 C160,92 178,88 190,74" fill="none" stroke="#d4a23a" stroke-width="1.6"/>
  <g class="head" style="transform-origin:180px 70px">
   <g class="horns" fill="none" stroke-linecap="round">
    <path d="M178,46 C170,22 146,16 134,28 C124,38 130,54 144,52 C152,50 152,40 145,39" stroke="#5c3a2e" stroke-width="10"/>
    <path d="M178,46 C170,22 146,16 134,28 C124,38 130,54 144,52 C152,50 152,40 145,39" stroke="#7d5038" stroke-width="7"/>
    <path d="M190,42 C186,18 160,8 146,20 C136,30 140,46 154,45 C162,44 162,34 155,33" stroke="#6b4128" stroke-width="11"/>
    <path d="M190,42 C186,18 160,8 146,20 C136,30 140,46 154,45 C162,44 162,34 155,33" stroke="#a06a45" stroke-width="8"/>
    <path d="M190,42 C186,18 160,8 146,20 C136,30 140,46 154,45" stroke="#6b4128" stroke-width="8" stroke-dasharray="1.5 4.5"/></g>
   <path d="M178,46 C190,32 214,34 222,50 C226,58 236,64 238,72 C240,82 230,88 218,86 C206,88 190,84 182,76 C174,68 172,56 178,46 Z" fill="{FUR}" stroke="{LINE}" stroke-width="1.8" stroke-linejoin="round"/>
   <g class="ear" style="transform-origin:180px 56px"><path d="M182,54 C168,52 152,60 146,74 C150,80 162,76 172,70 C178,66 182,60 182,54 Z" fill="{FUR}" stroke="{LINE}" stroke-width="1.5"/><path d="M178,58 C168,58 158,64 153,72 C162,74 170,68 176,63 Z" fill="#f4b0b6"/>
    <circle cx="151" cy="76" r="3.4" fill="none" stroke="#d4a23a" stroke-width="2"/></g>
   <path d="M180,44 C186,38 194,38 198,42 C192,42 186,44 182,48 Z" fill="#f3e2cc"/>
   <path class="eye" d="M196,58 q7,6 14,0" fill="none" stroke="#3e261d" stroke-width="2.6" stroke-linecap="round"/>
   <path d="M196,58 l-3,-2 M199,61 l-2,-3" stroke="#3e261d" stroke-width="1.4" stroke-linecap="round"/>
   <ellipse cx="206" cy="70" rx="7" ry="4" fill="#f6a8b0" opacity=".65"/>
   <ellipse cx="233" cy="70" rx="3.6" ry="2.6" fill="#d98a94"/>
   <path class="mouth shut" d="M220,80 q6,4 12,-1" fill="none" stroke="#7a4a3a" stroke-width="1.8" stroke-linecap="round"/>
   <path class="mouth open" d="M219,78 q7,10 14,0 q-7,3 -14,0 Z" fill="#8c1d40" stroke="#7a4a3a" stroke-width="1.4"/>
   <path d="M208,86 C206,96 212,104 216,100 C214,96 216,92 214,86 Z" fill="{FUR}" stroke="{LINE}" stroke-width="1.3"/>
  </g>
 </g>
</g>
</svg>'''

GOAT_CSS = '''
/* ===== walking goat v2 ===== */
.gw{position:absolute;bottom:0;left:0;width:150px;transform:translateX(-200px);will-change:transform}
.tgoat{display:block;width:100%;height:auto;overflow:visible}
.tgoat .leg,.tgoat .shin,.tgoat .head,.tgoat .ear,.tgoat .tail,.tgoat .cape,.tgoat .bodyall,.tgoat .shadow{transform-box:view-box}
.tgoat .mouth.open{opacity:0}
.tgoat .bodyall{transform-origin:120px 182px;animation:gbreath 3s ease-in-out infinite}
.tgoat .head{animation:ghead 3.6s ease-in-out infinite}
.tgoat .ear{animation:gear 4.4s ease-in-out infinite}
.tgoat .tail{animation:gtail 1.1s ease-in-out infinite}
.tgoat .cape{animation:gcape 2.4s ease-in-out infinite}
@keyframes gbreath{50%{transform:scale(1.01,.99)}}
@keyframes ghead{0%,100%{transform:rotate(0)}35%{transform:rotate(-5deg)}65%{transform:rotate(3deg)}}
@keyframes gear{0%,70%,100%{transform:rotate(0)}76%{transform:rotate(14deg)}84%{transform:rotate(-5deg)}90%{transform:rotate(8deg)}}
@keyframes gtail{50%{transform:rotate(-18deg)}}
@keyframes gcape{50%{transform:skewX(-3deg) rotate(1deg)}}
/* walk: diagonal pairs, knees bend while the hoof is lifted */
.gw.walk .tgoat .bodyall{animation:gbob .4s ease-in-out infinite}
.gw.walk .tgoat .head{animation:gwhead .8s ease-in-out infinite}
.gw.walk .tgoat .cape{animation:gcapew .8s ease-in-out infinite}
.gw.walk .tgoat .tail{animation:gtail .4s ease-in-out infinite}
.gw.walk .tgoat .leg.near.fl,.gw.walk .tgoat .leg.far.bl{animation:gstep .8s linear infinite}
.gw.walk .tgoat .leg.far.fl,.gw.walk .tgoat .leg.near.bl{animation:gstep .8s linear -.4s infinite}
.gw.walk .tgoat .leg.near.fl .shin,.gw.walk .tgoat .leg.far.bl .shin{animation:gknee .8s ease-in-out infinite}
.gw.walk .tgoat .leg.far.fl .shin,.gw.walk .tgoat .leg.near.bl .shin{animation:gknee .8s ease-in-out -.4s infinite}
.gw.walk .tgoat .shadow{transform-origin:122px 184px;animation:gshadow .4s ease-in-out infinite}
@keyframes gstep{0%{transform:rotate(-18deg)}55%{transform:rotate(16deg)}100%{transform:rotate(-18deg)}}
@keyframes gknee{0%,55%,100%{transform:rotate(0)}78%{transform:rotate(34deg)}}
@keyframes gbob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes gwhead{0%,100%{transform:rotate(0)}50%{transform:rotate(-3deg)}}
@keyframes gcapew{0%,100%{transform:skewX(0)}50%{transform:skewX(-5deg)}}
@keyframes gshadow{50%{transform:scaleX(.94)}}
/* talking */
.gw.talking .tgoat .mouth.open{animation:gtalk .3s steps(1) infinite}
.gw.talking .tgoat .mouth.shut{animation:gtalk2 .3s steps(1) infinite}
.gw.talking .tgoat .head{animation:gnod .6s ease-in-out infinite}
@keyframes gtalk{0%{opacity:1}50%{opacity:0}}
@keyframes gtalk2{0%{opacity:0}50%{opacity:1}}
@keyframes gnod{50%{transform:rotate(-6deg)}}
/* hop */
.gw.jump .tgoat .bodyall{animation:gjump .8s cubic-bezier(.3,.7,.4,1) 1}
.gw.jump .tgoat .leg.fl{animation:gtuckF .8s ease-in-out 1}
.gw.jump .tgoat .leg.bl{animation:gtuckB .8s ease-in-out 1}
.gw.jump .tgoat .leg .shin{animation:gtuckK .8s ease-in-out 1}
.gw.jump .tgoat .shadow{transform-origin:122px 184px;animation:gjs .8s ease-in-out 1}
@keyframes gjump{0%{transform:none}15%{transform:translateY(5px) scale(1.04,.95)}50%{transform:translateY(-46px) rotate(-6deg)}82%{transform:translateY(0) rotate(1deg)}90%{transform:translateY(3px) scale(1.03,.97)}100%{transform:none}}
@keyframes gtuckF{25%,65%{transform:rotate(-34deg)}}
@keyframes gtuckB{25%,65%{transform:rotate(30deg)}}
@keyframes gtuckK{25%,65%{transform:rotate(40deg)}}
@keyframes gjs{50%{transform:scaleX(.55);opacity:.45}}
@media (prefers-reduced-motion:reduce){.tgoat *,.gw{animation:none!important;transition:none!important}}
'''
