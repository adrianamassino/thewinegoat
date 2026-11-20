"""Argentine Spanish guide pages (es-ar/*/index.html): one Argentina-football x wine scene per page, on 5 pages.
These are the 5 scenes that left the es-ar home (tools/ar_football.py keeps 4 there). Only es-ar pages: the
sky-blue/white shirt is for Argentina. A small decorative band between two sections: aria-hidden, height reserved
(aspect-ratio), no horizontal overflow, still under prefers-reduced-motion. deco.js vignettes/walkers that land right
next to the band are hidden, so goats never stack.
Idempotent: removes its own output (<!--arfg--> ... <!--/arfg--> and <style id="arfootg">) and re-inserts it.
es-ar guides are rebuilt from the Spanish pages by tools/site_i18n/build.py, which runs this script at the end.
Run from repo root:  python3 tools/ar_football_guides.py [--quiet]"""
import os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ar_football as F

# page -> (scene, regex of the section the band goes right before (first match inside <main>), band width px, aspect w/h)
PAGES = [
    ('es-ar/wset-nivel-1/index.html', F.s_run, r'<section class="seosec">\s*<h2>Cómo estudiar', 0, 0),
    ('es-ar/niveles-wset/index.html', F.s_jump, r'<section class="seosec more">', 220, 300 / 250),
    ('es-ar/cata-sat-wset/index.html', F.s_juggle, r'<section class="seosec more">', 210, 300 / 270),
    ('es-ar/wset-nivel-2/index.html', F.s_toast, r'<section class="lvsoon"', 320, 400 / 250),
    ('es-ar/mapas-del-vino/index.html', F.s_goal, r'<section class="seocta">', 230, 320 / 270),
]

GUIDE_CSS = '''.arfg{position:relative;display:flex;justify-content:center;margin:30px auto 8px;pointer-events:none;overflow-x:clip;overflow-y:visible;max-width:100%}
.arfg .afs{flex:0 1 auto;max-width:100%}
.arfg + .dkWalk,.arfg + .dkMob{display:none!important}
/* the runner: gallops across its own strip (width = the strip), ground line below */
.arfg-run{height:96px;display:block}
.arfg-run:after{content:"";position:absolute;left:4%;right:4%;bottom:3px;border-bottom:2px dashed #ead9cc}
.arfg-run .afs{position:absolute;bottom:0;left:0;width:150px;animation:afgrun 9s linear infinite}
@keyframes afgrun{0%{left:-160px}70%,100%{left:calc(100% + 20px)}}
@media (max-width:700px){.arfg{margin:22px auto 4px}.arfg-run{height:76px}.arfg-run .afs{width:118px}}
@media (prefers-reduced-motion:reduce){.arfg *{animation:none!important}.arfg-run .afs{left:calc(50% - 75px)}}'''

STYLE = '<style id="arfootg">\n' + F.SCENE_CSS + '\n' + GUIDE_CSS + '\n</style>'


def band(f, w, ar):
    html = f()
    if w:  # reserve the height before anything paints: width + aspect-ratio on the scene box
        html = html.replace('<div class="afs ', f'<div style="width:{w}px;aspect-ratio:{ar:.4f}" class="afs ', 1)
    cls = re.search(r'class="afs (afs-\w+)"', html).group(1).replace('afs-', 'arfg-')
    return f'<!--arfg--><div class="arfg {cls}" aria-hidden="true">{html}</div><!--/arfg-->\n'


def main():
    quiet = '--quiet' in sys.argv
    done = []
    for p, f, anchor, w, ar in PAGES:
        if not os.path.exists(p):
            print('ar_football_guides: missing', p); continue
        s = open(p, encoding='utf8').read(); o = s
        s = re.sub(r'<!--arfg-->.*?<!--/arfg-->\n?', '', s, flags=re.S)
        s = re.sub(r'<style id="arfootg">.*?</style>', '', s, flags=re.S)
        mi = s.find('<main')
        m = re.compile(anchor).search(s, mi if mi >= 0 else 0)
        if not m:
            print('ar_football_guides: anchor not found, skipped', p); continue
        s = s[:m.start()] + band(f, w, ar) + s[m.start():]
        s = s.replace('</head>', STYLE + '</head>', 1)
        if s != o: open(p, 'w', encoding='utf8').write(s)
        done.append((p, s != o))
    if not quiet:
        for p, ch in done: print('ar_football_guides:', p, 'changed' if ch else 'unchanged')


if __name__ == '__main__':
    main()
