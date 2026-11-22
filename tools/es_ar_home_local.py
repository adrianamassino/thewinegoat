# -*- coding: utf-8 -*-
"""es-ar home: the part written for Argentina and Uruguay (idempotent; run by tools/site_i18n/build.py in the sync step).

 - own <title> / meta description (also og: and twitter:);
 - a section "El WSET desde Argentina y Uruguay" before the list of preparation pages: what each level's programme
   includes from the region (verified on the WSET specifications), what is usually new for a local student, links to the
   four level guides;
 - three local questions at the top of the FAQ (+ FAQPage structured data);
 - rioplatense wording of the FAQ ("multiple choice").
Everything inserted sits between <!--arlocal--> … <!--/arlocal--> (or is replaced in place), so a second run changes nothing.
Rules: no prices, no school names, no WSET affiliation, exam facts as on the level guides."""
import json, re, sys, html, os

os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
P = 'es-ar/index.html'
TITLE = 'Preparar el WSET desde Argentina y Uruguay: app y simulacros | The Wine Goat'
DESC = ('Prepará el WSET 1, 2 y 3 desde Argentina o Uruguay: más de 2.800 preguntas con explicación, simulacros y un plan de estudio. '
        'Qué entra de Malbec y Mendoza en cada nivel.')
CSS = '''<style id="arlocal-css">
.arloc p{line-height:1.7;margin:0 0 14px}
.arloc-g{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin:22px 0;padding:0;list-style:none}
.arloc-g li{background:#fff;border:2px solid #ead9cc;border-bottom-width:5px;border-radius:16px;padding:16px}
.arloc-g h3{margin:0 0 8px;font-size:19px;color:#5c1530}
.arloc-g p{margin:0 0 10px;font-size:15.5px;line-height:1.55}
.arloc-g a{font-weight:700}
.arloc h3{margin:26px 0 8px}.arloc-g h3{margin:0 0 8px}
@media (max-width:980px){.arloc-g{grid-template-columns:repeat(2,1fr)}}
@media (max-width:560px){.arloc-g{grid-template-columns:1fr}}
</style>'''
SECTION = '''<section class="sec3 lvl3 arloc" id="wset-argentina-uruguay"><div class="w"><h2>El WSET desde Argentina y Uruguay</h2>
<p>Si venís del Río de la Plata, llegás al WSET sabiendo mucho de tintos con cuerpo, de altura y de riego, y muy poco de Chablis, de Jerez o de las categorías alemanas. Los programas están armados al revés de tu experiencia: el vino de acá ocupa un lugar chico y casi todo lo demás es Europa. Por eso conviene saber, nivel por nivel, qué entra de la región y dónde vas a tener que poner las horas.</p>
<ul class="arloc-g">
<li><h3>Nivel 1</h3><p>No nombra cepas ni regiones de Argentina o de Uruguay. Trabaja con ocho cepas internacionales y vinos europeos de ejemplo. Lo nuevo: los vinos con nombre de lugar y los fortificados.</p><a href="/es-ar/wset-nivel-1/">Guía del Nivel 1 →</a></li>
<li><h3>Nivel 2</h3><p>Una sola indicación geográfica argentina: Mendoza, por el Malbec. De Chile entran el Valle Central, Maipo, Colchagua y Casablanca. Uruguay no figura.</p><a href="/es-ar/wset-nivel-2/">Guía del Nivel 2 →</a></li>
<li><h3>Nivel 3</h3><p>Argentina completa: Salta con Cafayate, San Juan, Mendoza con Luján de Cuyo, Maipú y el Valle de Uco, y la Patagonia. Malbec y Torrontés entre los vinos recomendados para la cata.</p><a href="/es-ar/wset-nivel-3/">Guía del Nivel 3 →</a></li>
<li><h3>Diploma</h3><p>Las mismas zonas, con otra profundidad: el zonda, las criollas, las indicaciones geográficas y el negocio. Torrontés, Bonarda y Malbec de distintos niveles de calidad en la lista de cata.</p><a href="/es-ar/wset-diploma-nivel-4/">Guía del Diploma →</a></li>
</ul>
<p>El Tannat uruguayo, Canelones y Maldonado no aparecen en ninguno de estos programas; la cepa se estudia en el suroeste de Francia, a partir del Nivel 3. Igual es una gran herramienta de estudio: pocos vinos enseñan tan bien qué es un tanino alto.</p>
<h3>Lo que ya traés y lo que suele ser nuevo</h3>
<p>Quien creció con vino argentino o uruguayo tiene el paladar entrenado para tintos de clima cálido y seco, conoce las cepas internacionales por la etiqueta y entiende de primera mano qué hacen la altura, el sol y el riego. Eso es media materia de viticultura. Lo que casi siempre falta es lo que acá no llega a la góndola: un Riesling del Mosela, un Chablis, un Barolo, un Fino de Jerez. Y una costumbre distinta de leer etiquetas, porque en buena parte de Europa la botella nombra el lugar y calla la cepa.</p>
<p>Nuestro consejo es simple: estudiá primero lo ajeno y dejá lo conocido para el final. Mendoza la vas a fijar en una tarde; Borgoña y Alemania necesitan semanas de repaso corto. Y cuando llegues al capítulo de Argentina, contestá con lo que pide el programa y no con todo lo que sabés: el examen premia la respuesta precisa, no la más larga.</p>
<h3>Estudiar con trabajo, familia y poco tiempo</h3>
<p>Las horas que indica el WSET van de unas 6 en el Nivel 1 a unas 28 en el Nivel 2 y unas 84 en el Nivel 3. Repartidas en tandas de quince a treinta minutos por día entran en cualquier rutina. Si trabajás en una bodega, armá el calendario alrededor de la vendimia: de febrero a abril casi no vas a poder estudiar, y conviene llegar a esos meses con el grueso del programa ya visto.</p>
<p>La app está en español rioplatense, con voseo, y sirve para estudiar en ratos cortos desde el celular: en el colectivo, en el subte o después del trabajo. Cada pregunta trae su explicación, así que también aprendés de los errores.</p>
</div></section>'''
FAQ = [
    ('¿Qué vinos de Argentina y Uruguay entran en los exámenes WSET?',
     'En el Nivel 1, ninguno. En el Nivel 2, el Malbec de Mendoza. En el Nivel 3 y en el Diploma, Salta, San Juan, Mendoza y la Patagonia, con Malbec, Torrontés, Bonarda y cepas internacionales. Uruguay no figura en los programas de vinos; el Tannat se estudia en el suroeste de Francia.'),
    ('¿Qué es lo que más le cuesta a un estudiante argentino o uruguayo?',
     'Lo que menos se ve acá: las denominaciones europeas y sus términos de etiqueta, los vinos de clima fresco, los métodos de los espumantes y los fortificados como el Jerez y el Oporto. En el Nivel 3 se suman las respuestas escritas.'),
    ('¿Puedo preparar el WSET en español rioplatense?',
     'Sí. La app y esta web están en español de Argentina, con voseo. El idioma en que rendís el examen lo define quien lo organiza: confirmalo al inscribirte.'),
]
A, Z = '<!--arlocal-->', '<!--/arlocal-->'
e = html.escape


def run():
    s = o = open(P, encoding='utf8').read()
    s = re.sub(r'<title>.*?</title>', f'<title>{TITLE}</title>', s, count=1, flags=re.S)
    for k in ('og:title', 'twitter:title'):
        s = re.sub(r'(<meta (?:property|name)="%s" content=")[^"]*(")' % k, lambda m: m.group(1) + e(TITLE, quote=True) + m.group(2), s)
    for k in ('description', 'og:description', 'twitter:description'):
        s = re.sub(r'(<meta (?:property|name)="%s" content=")[^"]*(")' % k, lambda m: m.group(1) + e(DESC, quote=True) + m.group(2), s)
    s = re.sub(r'<style id="arlocal-css">.*?</style>\n?', '', s, flags=re.S)
    s = re.sub(re.escape(A) + '.*?' + re.escape(Z), '', s, flags=re.S)
    s = re.sub(r'<details class="fq" data-arlocal>.*?</details>', '', s, flags=re.S)
    if '<!--corelinks--><section' not in s or '<details class="fq">' not in s: sys.exit('es_ar_home_local: anchors not found on the es-ar home')
    s = s.replace('</head>', CSS + '\n</head>', 1)
    s = s.replace('<!--corelinks--><section', A + SECTION + Z + '<!--corelinks--><section', 1)
    s = s.replace('<details class="fq">', ''.join(f'<details class="fq" data-arlocal><summary>{e(q, quote=False)}</summary><p>{e(a, quote=False)}</p></details>' for q, a in FAQ) + '<details class="fq">', 1)
    a, b = s.find('<section id="faq"'), s.find('</section>', s.find('<section id="faq"'))
    s = s[:a] + s[a:b].replace('preguntas tipo test', 'preguntas multiple choice') + s[b:]

    def ld(m):
        try: J = json.loads(m.group(2))
        except Exception: return m.group(0)
        for n in (J.get('@graph', [J]) if isinstance(J, dict) else J):
            if isinstance(n, dict) and n.get('@type') == 'FAQPage':
                mine = {q for q, _ in FAQ}
                rest = [x for x in n.get('mainEntity', []) if x.get('name') not in mine]
                for x in rest:
                    t = x.get('acceptedAnswer', {})
                    if isinstance(t.get('text'), str): t['text'] = t['text'].replace('preguntas tipo test', 'preguntas multiple choice')
                n['mainEntity'] = [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in FAQ] + rest
            if isinstance(n, dict) and n.get('@type') == 'WebPage':
                if 'name' in n: n['name'] = TITLE
                if 'description' in n: n['description'] = DESC
        return m.group(1) + json.dumps(J, ensure_ascii=False) + m.group(3)
    s = re.sub(r'(<script type="application/ld\+json">)(.*?)(</script>)', ld, s, flags=re.S)
    if s != o: open(P, 'w', encoding='utf8').write(s)
    return s != o


if __name__ == '__main__':
    ch = run()
    if '--quiet' not in sys.argv: print('es-ar home: local section', 'updated' if ch else 'unchanged')
