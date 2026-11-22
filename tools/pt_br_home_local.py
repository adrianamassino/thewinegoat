# -*- coding: utf-8 -*-
"""pt-br home: the part written for Brazil (idempotent; run by tools/site_i18n/build.py in the sync step).

 - own <title> / meta description (also og:, twitter: and the WebPage structured data);
 - a section "O WSET para quem estuda no Brasil" before the list of preparation pages: what each level's programme
   includes from South America and that Brazil is in none of them (checked on the WSET specifications: Level 1 2018,
   Level 2 issue 21 2026, Level 3 2022, Diploma 2019 and current), what is usually new for a Brazilian student,
   links to the four level guides;
 - three local questions at the top of the FAQ (+ FAQPage structured data).
Everything inserted sits between <!--brlocal--> … <!--/brlocal--> (or is replaced in place), so a second run changes nothing.
Rules: no prices, no school names, no WSET affiliation, exam facts as on the level guides; the app's full lessons are
not in Portuguese yet (tools/home_lang_claims.py), so nothing here says they are."""
import json, re, sys, html, os

os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
P = 'pt-br/index.html'
TITLE = 'Estude para o WSET no Brasil: questões, simulados e plano | The Wine Goat'
DESC = ('Prepare os WSET 1, 2 e 3 estudando no Brasil: mais de 2.800 questões com explicação, simulados e um plano. '
        'Veja o que cada nível cobra da América do Sul.')
CSS = '''<style id="brlocal-css">
.brloc p{line-height:1.7;margin:0 0 14px}
.brloc-g{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin:22px 0;padding:0;list-style:none}
.brloc-g li{background:#fff;border:2px solid #ead9cc;border-bottom-width:5px;border-radius:16px;padding:16px}
.brloc-g h3{margin:0 0 8px;font-size:19px;color:#5c1530}
.brloc-g p{margin:0 0 10px;font-size:15.5px;line-height:1.55}
.brloc-g a{font-weight:700}
.brloc h3{margin:26px 0 8px}.brloc-g h3{margin:0 0 8px}
@media (max-width:980px){.brloc-g{grid-template-columns:repeat(2,1fr)}}
@media (max-width:560px){.brloc-g{grid-template-columns:1fr}}
</style>'''
SECTION = '''<section class="sec3 lvl3 brloc" id="wset-brasil"><div class="w"><h2>O WSET para quem estuda no Brasil</h2>
<p>Comecemos pelo que pouca gente conta: o vinho brasileiro não aparece em nenhum programa de vinhos do WSET. Nem a Serra Gaúcha, nem o Vale dos Vinhedos, nem o Vale do São Francisco, nem o nosso espumante, que fica de fora até da unidade de espumantes do Diploma (lá, a América do Sul é representada por Chile e Argentina). Isso não é motivo para desistir. É só um dado para planejar: os programas foram escritos a partir da Europa, e o que você vai estudar de mais novo está do outro lado do Atlântico.</p>
<ul class="brloc-g">
<li><h3>Nível 1</h3><p>Oito uvas internacionais e alguns clássicos europeus como exemplo. Nada de Brasil nem de América do Sul. O que costuma ser novo: vinhos com nome de lugar, como Chablis e Rioja, e os fortificados.</p><a href="/pt-br/wset-nivel-1/">Guia do Nível 1 →</a></li>
<li><h3>Nível 2</h3><p>Da América do Sul, só Chile (Central Valley, Maipo, Colchagua, Casablanca) e Mendoza, pelo Malbec. Nos espumantes, método tradicional, método de tanque e o Moscato do Asti.</p><a href="/pt-br/wset-nivel-2/">Guia do Nível 2 →</a></li>
<li><h3>Nível 3</h3><p>Chile de Coquimbo ao Sul e Argentina de Salta à Patagônia; Portugal do Vinho Verde ao Alentejo. Nos espumantes entram também os métodos por transferência e Asti, úteis para entender o que se faz por aqui.</p><a href="/pt-br/wset-nivel-3/">Guia do Nível 3 →</a></li>
<li><h3>Diploma</h3><p>As mesmas regiões chilenas e argentinas, com muito mais profundidade, e espumantes de Chile e Argentina na D4. Carmenère, Torrontés, Bonarda e Malbec na lista de degustação.</p><a href="/pt-br/wset-diploma-nivel-4/">Guia do Diploma →</a></li>
</ul>
<h3>O que você já traz de casa e o que vai ser novidade</h3>
<p>Quem bebe vinho no Brasil costuma conhecer bem os tintos chilenos e argentinos, que estão em qualquer supermercado, e muitos rótulos portugueses: Douro, Alentejo, Vinho Verde, Porto. Isso ajuda de verdade no Nível 3, que dá bastante espaço a Portugal e à América do Sul. Também ajuda a cultura de espumante: entender por que um brut de método tradicional tem notas de pão e brioche e um moscatel é doce e perfumado já é meio caminho para o capítulo de espumantes.</p>
<p>A novidade quase sempre está em outro lugar: Riesling alemão e a escala Prädikat, a Borgonha e seus níveis de denominação, o Jerez com seus estilos de flor e de oxidação, e os vinhos de clima frio em geral. Nossa sugestão é estudar primeiro o que é estranho para você e deixar o conhecido para o fim. Chile e Argentina entram em uma tarde; Alemanha e Borgonha pedem semanas de revisão curta.</p>
<h3>Estudar com trabalho, trânsito e pouco tempo</h3>
<p>As horas que o WSET indica vão de cerca de 6 no Nível 1 a 28 no Nível 2 e 84 no Nível 3. Em blocos de 15 a 30 minutos por dia, elas cabem no ônibus, no metrô ou no intervalo do almoço. Se você trabalha em vinícola na Serra Gaúcha, conte com a vindima, de janeiro a março, e tente chegar a esse período com a maior parte do conteúdo já visto.</p>
<p>Sobre o idioma: este site está em português do Brasil, e a interface do app também tem português. As lições e as questões completas do app estão, por enquanto, em italiano, francês, inglês e espanhol. Em que idioma você faz a prova é algo que quem organiza o seu curso informa; confirme na inscrição.</p>
</div></section>'''
FAQ = [
    ('O vinho brasileiro cai na prova do WSET?',
     'Não. Nenhum programa de vinhos do WSET, do Nível 1 ao Diploma, inclui regiões, uvas ou espumantes do Brasil. Da América do Sul entram Chile e Argentina: Mendoza e alguns vales chilenos no Nível 2; os dois países completos no Nível 3 e no Diploma.'),
    ('O que costuma ser mais difícil para quem estuda no Brasil?',
     'O que menos se vê por aqui: as denominações europeias e seus termos de rótulo, os vinhos de clima frio, como Riesling alemão e Borgonha, e o Jerez. No Nível 3 entram também as questões dissertativas, que pedem prática de escrita com relógio.'),
    ('Dá para se preparar para o WSET em português do Brasil?',
     'Este site e a interface do app estão em português do Brasil. As lições e as questões completas do app estão, por enquanto, em italiano, francês, inglês e espanhol. O idioma da prova depende de quem organiza o curso: confirme na inscrição.'),
]
A, Z = '<!--brlocal-->', '<!--/brlocal-->'
e = html.escape


def run():
    s = o = open(P, encoding='utf8').read()
    s = re.sub(r'<title>.*?</title>', f'<title>{e(TITLE, quote=False)}</title>', s, count=1, flags=re.S)
    for k in ('og:title', 'twitter:title'):
        s = re.sub(r'(<meta (?:property|name)="%s" content=")[^"]*(")' % k, lambda m: m.group(1) + e(TITLE, quote=True) + m.group(2), s)
    for k in ('description', 'og:description', 'twitter:description'):
        s = re.sub(r'(<meta (?:property|name)="%s" content=")[^"]*(")' % k, lambda m: m.group(1) + e(DESC, quote=True) + m.group(2), s)
    s = re.sub(r'<style id="brlocal-css">.*?</style>\n?', '', s, flags=re.S)
    s = re.sub(re.escape(A) + '.*?' + re.escape(Z), '', s, flags=re.S)
    s = re.sub(r'<details class="fq" data-brlocal>.*?</details>', '', s, flags=re.S)
    if '<!--corelinks--><section' not in s or '<details class="fq">' not in s: sys.exit('pt_br_home_local: anchors not found on the pt-br home')
    s = s.replace('</head>', CSS + '\n</head>', 1)
    s = s.replace('<!--corelinks--><section', A + SECTION + Z + '<!--corelinks--><section', 1)
    s = s.replace('<details class="fq">', ''.join(f'<details class="fq" data-brlocal><summary>{e(q, quote=False)}</summary><p>{e(a, quote=False)}</p></details>' for q, a in FAQ) + '<details class="fq">', 1)

    def ld(m):
        try: J = json.loads(m.group(2))
        except Exception: return m.group(0)
        for n in (J.get('@graph', [J]) if isinstance(J, dict) else J):
            if isinstance(n, dict) and n.get('@type') == 'FAQPage':
                mine = {q for q, _ in FAQ}
                rest = [x for x in n.get('mainEntity', []) if x.get('name') not in mine]
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
    if '--quiet' not in sys.argv: print('pt-br home: local section', 'updated' if ch else 'unchanged')
