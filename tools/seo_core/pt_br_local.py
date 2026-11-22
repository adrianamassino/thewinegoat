# -*- coding: utf-8 -*-
"""Local (Brazil) content of the pt-br core pages (tools/seo_core/build.py applies it to the pt-br content on every
build, after content/pt-br.json + pt-br_x.json are loaded). Same format as tools/seo_core/es_ar_local.py (LOCAL[key]:
title, desc, h1, tldr, lead, replace_first, replace, before, faq_drop, faq_first), applied by its apply() function.
Rules: no prices, no school names, no WSET affiliation; exam facts as on the level guides; what each programme includes
(or not) from Brazil and South America was checked on the WSET specifications (Brazil is in none of them). Invented
examples are declared as such. Grades stay in English (Pass, Merit, Distinction)."""
import re
import es_ar_local

MOCK = {
 'title': 'Simulado WSET para quem estuda no Brasil: vinhos e destilados',
 'desc': 'Simulado WSET estudando no Brasil: formato de cada nível, como ensaiar em casa, mini simulado sobre Chile, Argentina e Portugal e degustação.',
 'h1': 'Simulado WSET: como ensaiar a prova real estudando no Brasil',
 'tldr': 'Um simulado é uma prova de treino completa, com o número real de questões e o tempo real. Dois ou três nas últimas semanas, corrigidos com calma, mostram onde estão as suas lacunas. Para quem estuda no Brasil, elas quase nunca estão no Chile, na Argentina ou em Portugal: estão na Alemanha, na Borgonha, no Jerez e nos termos de rótulo europeus.',
 'lead': ['Ler e sublinhar dá sensação de avanço; o simulado conta a verdade. Sentar com o relógio, o número real de questões e nenhuma consulta é a única forma de saber como você vai se sair no dia.',
          'Nesta página você vê o formato de cada prova WSET, como montar um simulado em casa e como corrigi-lo. E, como ela foi escrita para quem estuda no Brasil, há um mini simulado sobre os vinhos sul-americanos e portugueses do programa e ideias para treinar a degustação com garrafas fáceis de encontrar aqui.'],
 'before': {
  'Como fazer um simulado em condições reais': [
   ['h2', 'Simulados estudando no Brasil: o que muda'],
   ['p', 'A prova é a mesma em qualquer país, mas as lacunas de cada candidato dependem de onde ele aprendeu a beber vinho. Quem aprendeu no Brasil costuma ter facilidade com tintos de fruta madura, com os rótulos chilenos, argentinos e portugueses e com espumante. As dificuldades costumam se concentrar em quatro lugares.'],
   ['table', ['Onde se perdem pontos', 'Por que acontece', 'O que fazer no simulado'],
    [['Denominações europeias e termos de rótulo', 'Poucas garrafas chegam aqui, e o rótulo europeu nomeia o lugar, não a uva', 'Garantir que a maior parte das questões seja de Europa'],
     ['Vinhos de clima frio', 'O paladar está calibrado para fruta madura', 'Incluir Riesling, Chablis e Pinot Noir na degustação do Nível 3'],
     ['Jerez', 'Quase ninguém tem em casa', 'Nunca pular: são poucas regras e caem sempre'],
     ['Métodos de espumante', 'Conhece os estilos, não os processos', 'Questões sobre cada método, não só sobre os exemplos famosos']]],
   ['p', 'O Brasil não aparece em nenhum programa de vinhos do WSET, do Nível 1 ao Diploma. Saber muito sobre a Serra Gaúcha ou o Vale do São Francisco é ótimo, mas não vale ponto na prova; o tempo de simulado deve ir para o que vale.'],
   ['h3', 'O que entra da América do Sul em cada prova'],
   ['ul', ['Nível 1: nada; oito uvas internacionais e vinhos europeus de exemplo.',
           'Nível 2: Chile (Central Valley, Maipo, Colchagua, Casablanca) e Mendoza, pelo Malbec.',
           'Nível 3: Chile de Coquimbo à região Sul; Argentina com Salta, San Juan, Mendoza e Patagônia.',
           'Diploma: as mesmas regiões, mais espumantes chilenos e argentinos na D4.']],
   ['h2', 'Mini simulado: Chile, Argentina e Portugal no programa'],
   ['p', 'Oito questões nossas, dos Níveis 2 e 3, no formato da prova. Não são oficiais. Faça de uma vez, em dez minutos, e só depois leia as explicações. Para quem estuda no Brasil, a meta aqui é não errar nenhuma.'],
   ['qs', [
    ['Nível 2. Qual destas regiões chilenas o programa associa ao Pinot Noir?', ['Maipo Valley', 'Colchagua Valley', 'Casablanca Valley', 'Central Valley'], 2, 'Casablanca, pela influência fria do Pacífico. Maipo e Colchagua aparecem com Cabernet Sauvignon; o Central Valley, com várias uvas de clima mais quente.'],
    ['Nível 2. Qual estilo de Porto passa mais tempo em madeira e ganha notas de frutas secas e caramelo?', ['Ruby', 'Reserve Ruby', 'Tawny', 'Vintage'], 2, 'Os Tawny envelhecem longamente em madeira, com oxidação lenta. Ruby e Reserve Ruby preservam a fruta; o Vintage é engarrafado jovem e evolui na garrafa.'],
    ['Nível 3. Onde se concentra a maior parte dos vinhedos do Chile?', ['Coquimbo', 'Aconcagua', 'Central Valley', 'Região Sul'], 2, 'O Central Valley, ao sul de Santiago, é amplo, plano e quente, e concentra a maior parte do vinhedo chileno.'],
    ['Nível 3. Qual zona de Salta é a mais conhecida pelo Torrontés de altitude?', ['Cafayate', 'Luján de Cuyo', 'Tupungato', 'Maipú'], 0, 'Cafayate, em Salta. Luján de Cuyo, Tupungato (Valle de Uco) e Maipú ficam em Mendoza.'],
    ['Nível 3. Que característica mais marca a uva Arinto?', ['Taninos muito altos', 'Acidez alta', 'Doçura natural', 'Aromas de lichia'], 1, 'A Arinto conserva acidez alta mesmo em climas quentes, por isso é muito usada em cortes no Alentejo e em Lisboa. No Vinho Verde é conhecida como Pedernã.'],
    ['Nível 3. Por que a Patagônia argentina é mais fresca que Mendoza, apesar da altitude menor?', ['Por estar mais ao sul, em latitude mais alta', 'Pela influência direta do Atlântico', 'Pelas chuvas de verão', 'Pelos solos escuros'], 0, 'A latitude mais alta compensa a altitude menor. A Patagônia é conhecida por estilos mais frescos, como Pinot Noir e Malbec de perfil mais leve.'],
    ['Nível 3. Na Bairrada, a Baga dá tintos com...', ['Taninos e acidez altos', 'Taninos baixos e acidez baixa', 'Doçura residual alta', 'Cor muito pálida e álcool baixo'], 0, 'A Baga é uma uva de casca grossa, que dá tintos de acidez e taninos altos, capazes de envelhecer.'],
    ['Nível 3. Em que menção de rótulo chilena os vinhedos ficam junto à cordilheira dos Andes?', ['Costa', 'Entre Cordilleras', 'Andes', 'Valle Central'], 2, 'Costa, Entre Cordilleras e Andes descrevem a posição leste-oeste dos vinhedos. Andes indica os vinhedos no sopé da cordilheira, a leste.']]],
   ['tip', 'Se errou duas ou mais, revise o capítulo: são pontos que quem estuda no Brasil não deveria entregar. Se acertou todas, não gaste mais tempo aqui e vá para a Europa.'],
  ]},
 'replace': {
  'Quando fazer os simulados?': [
   ['h2', 'Quando fazer os simulados?'],
   ['p', 'Nem cedo demais, quando você ainda não viu o programa todo, nem todos na última semana, quando não sobra tempo para corrigir o que eles mostram.'],
   ['table', ['Momento', 'Que simulado', 'Para quê'],
    [['Metade do curso', 'Meio simulado', 'Conhecer o formato e o ritmo'],
     ['Três semanas antes', 'Primeiro completo', 'Ver quais capítulos falham'],
     ['Dez dias antes', 'Segundo completo', 'Conferir se a revisão funcionou'],
     ['Três ou quatro dias antes', 'O último', 'Ajustar o relógio e ganhar confiança']]],
   ['p', 'Cruze essas datas com o seu calendário real. Carnaval, festas de fim de ano e, para quem trabalha em vinícola, a vindima de janeiro a março são épocas em que três semanas de preparação organizada ficam quase impossíveis. Vale mais escolher outra data de prova do que chegar sem simulados.']],
  'Simulados para as respostas dissertativas e a degustação do Nível 3': [
   ['h2', 'Simulados para as dissertativas e a degustação do Nível 3'],
   ['p', 'No Nível 3 de Vinhos, o simulado de múltipla escolha é só metade do ensaio. Treine também as dissertativas e a degustação com o relógio, porque é ali que muitos pontos se ganham ou se perdem.'],
   ['h3', 'Dissertativas'],
   ['p', 'Cada dissertativa curta é dividida em partes, e os pontos de cada parte indicam quantas ideias diferentes a banca espera. Leia a questão duas vezes, sublinhe o verbo de comando (descreva, explique, compare) e planeje em palavras-chave antes de escrever. Corrija com honestidade: um ponto por ideia certa e explicada, nada por um nome solto. E escreva à mão, como no dia da prova.'],
   ['table', ['Resposta fraca', 'Resposta mais forte'],
    [['Casablanca é fria.', 'A neblina da manhã e o vento do Pacífico resfriam Casablanca; a maturação é lenta e a uva conserva acidez alta.'],
     ['Porto doce.', 'A aguardente é adicionada durante a fermentação, que para e deixa açúcar natural; por isso o Porto é doce e encorpado.']]],
   ['h3', 'Degustação às cegas'],
   ['p', 'Peça a alguém para servir dois vinhos cobertos e escreva uma nota completa de cada um no tempo da prova: aspecto, nariz, boca e conclusões sobre qualidade e potencial. No Brasil, os sul-americanos da lista do curso são fáceis de achar; os europeus de clima frio, nem tanto. Um grupo de estudo em que cada pessoa traz uma garrafa coberta resolve o custo e ainda garante a surpresa.']],
  'Um exemplo prático: analisando um simulado do Nível 2': [
   ['h2', 'Um exemplo prático: lendo um simulado do Nível 2'],
   ['p', 'Exemplo inventado, para mostrar o método. Imagine alguém que tira 31 de 50 (62%) no primeiro simulado do Nível 2, três semanas antes da prova. É Pass, mas quase sem margem. A divisão por tema mostra para onde devem ir as próximas duas semanas.'],
   ['table', ['Tema', 'Resultado', 'Diagnóstico', 'Ação'],
    [['Fatores de estilo (clima, vinificação)', '7 / 8', 'Seguro', 'Manter só nos flashcards'],
     ['França', '6 / 10', 'Confusão entre regiões', 'Cartões de contraste: Loire e Borgonha, Rhône Norte e Sul'],
     ['Alemanha, Itália e Espanha', '5 / 10', 'Termos de rótulo', 'Tabela de termos e 15 questões por dia'],
     ['Novo Mundo, Chile e Mendoza', '8 / 8', 'Seguro, como esperado', 'Nenhuma: tempo vai para a Europa'],
     ['Espumantes e fortificados', '3 / 8', 'Métodos e Jerez', 'Uma ficha por método e por estilo de Jerez'],
     ['Harmonização e serviço', '2 / 6', 'Direção dos efeitos', 'Tabela de interações aplicada às refeições do dia']]],
   ['p', 'O total esconde a história: mais da metade dos pontos perdidos vem de dois ou três blocos. Depois de uma semana de trabalho dirigido, um segundo simulado na casa de 37 de 50 (74%) já estaria no nível de Merit, com margem de verdade. O primeiro simulado não serve para julgar; serve para apontar o caminho.']],
  'Minicaso: uma semana até a prova do Nível 1': [
   ['h2', 'Caso ilustrativo: uma semana até a prova do Nível 1'],
   ['p', 'Caso inventado. Paula atende o salão de degustação de uma vinícola em Bento Gonçalves e faz a prova do Nível 1 em sete dias. No primeiro simulado tira 19 de 30: reprovada por dois acertos. Os erros são quase todos de dois tipos: vinhos com nome de lugar, como Chablis e Chianti, e regras de harmonização invertidas. De uvas tintas e de vinificação, não errou nenhuma. Em vez de reler tudo, ela faz uma lista de duas colunas com os vinhos de exemplo e cola a tabela de harmonização na geladeira; dez questões por dia no celular. Segundo simulado, quatro dias depois: 25 de 30. Terceiro: 27. A moral serve para qualquer um: um simulado bem corrigido evita estudar o que você já sabe.']],
 },
 'faq_first': [
  ['O que um simulado deve incluir para quem estuda no Brasil?', 'Sobretudo o que menos se vê aqui: denominações europeias, termos de rótulo, vinhos de clima frio, métodos de espumante e Jerez. Chile, Argentina e Portugal são uma parte do programa; no simulado, devem ser uma parte também.'],
  ['Com que vinhos treino a degustação do Nível 3 no Brasil?', 'Comece pelos essenciais da lista do curso fáceis de achar aqui, como Carmenère, Malbec e Torrontés, e por pares que contrastem: Malbec e Pinot Noir, Chardonnay com e sem madeira. Divida em grupo o custo de alguns europeus de clima frio, que é onde o paladar mais precisa de calibragem.'],
  ['Faço o simulado em português ou no idioma da prova?', 'Os últimos simulados, sempre no idioma em que você vai fazer a prova. Ler e escrever contra o relógio em outro idioma é uma habilidade à parte, e o simulado é o lugar para treiná-la.'],
 ],
 'faq_drop': ['Como simular em casa as condições da prova WSET?', 'Simulados são úteis para o Nível 1 do WSET?', 'Vale a pena repetir o mesmo simulado?'],
}

PRACTICE = {
 'title': 'Questões WSET com gabarito para quem estuda no Brasil',
 'desc': 'Questões WSET com gabarito, para quem estuda no Brasil: Vinhos 1, 2 e 3 e Destilados, técnica de múltipla escolha, Chile, Argentina e Portugal.',
 'h1': 'Questões WSET online com gabarito, para quem estuda no Brasil',
 'tldr': 'Resolver questões é o jeito mais rápido de transformar o que você lê em algo que lembra na prova. Faça uma série curta depois de cada tema, leia por que cada alternativa errada está errada e guarde os seus erros. Abaixo há questões de exemplo de Vinhos 1, 2 e 3 e de Destilados, e um bloco sobre o que os programas cobram da América do Sul e de Portugal.',
 'lead': ['Uma prova WSET não pergunta o que você leu: pergunta o que você consegue lembrar, rápido e sem ajuda. Isso se treina respondendo, não relendo. E cada explicação bem lida vale por uma página de apostila.',
          'Esta página foi pensada para quem estuda no Brasil. Além da técnica e das questões por nível, você encontra questões sobre os vinhos sul-americanos e portugueses que os programas citam e dicas para treinar quando a maior parte da prova fala de vinhos que pouco chegam às nossas prateleiras.'],
 'replace_first': {
  'Mais oito questões de exemplo': [
   ['h2', 'Questões de exemplo: América do Sul e Portugal nos programas'],
   ['p', 'Questões nossas, no formato da prova, sobre o que os Níveis 1, 2 e 3 cobram do Chile, da Argentina e de Portugal. Não são oficiais. O Brasil não aparece em nenhum programa de vinhos do WSET; estes são os vizinhos que aparecem.'],
   ['qs', [
    ['Nível 1. Qual destes vinhos do programa é fortificado?', ['Prosecco', 'Porto', 'Chablis', 'Beaujolais'], 1, 'O Porto é um dos dois fortificados do Nível 1, ao lado do Jerez. Prosecco é espumante, Chablis é branco seco e Beaujolais é tinto leve.'],
    ['Nível 2. Qual uva o programa associa a Colchagua Valley, no Chile?', ['Pinot Noir', 'Cabernet Sauvignon', 'Riesling', 'Malbec'], 1, 'Colchagua aparece com Cabernet Sauvignon, ao lado de Maipo e do Central Valley. Pinot Noir chileno vai com Casablanca; Malbec, com Mendoza.'],
    ['Nível 2. O que "Brut" indica no rótulo de um espumante?', ['Doce', 'Meio-doce', 'Seco', 'Envelhecido'], 2, 'Brut é seco. Demi-Sec é meio-doce. São os dois termos de doçura que o programa do Nível 2 cobra.'],
    ['Nível 2. Qual Jerez envelhece sob o véu de leveduras chamado flor?', ['Oloroso', 'Fino', 'Cream', 'Pedro Ximénez'], 1, 'O Fino envelhece sob a flor e fica pálido, seco e leve. O Oloroso envelhece em contato com o oxigênio; Cream é adoçado e PX é doce por natureza.'],
    ['Nível 3. Em Mendoza, qual destas sub-regiões o programa cita junto com Luján de Cuyo e Maipú?', ['Cafayate', 'Valle de Uco', 'Leyda', 'Limarí'], 1, 'O programa cita para Mendoza o Valle de Uco, Luján de Cuyo e Maipú. Cafayate fica em Salta; Leyda e Limarí, no Chile.'],
    ['Nível 3. Qual região chilena fica no extremo norte e tem a escassez de água como maior desafio?', ['Coquimbo', 'Aconcagua', 'Central Valley', 'Região Sul'], 0, 'Coquimbo, com Elqui e Limarí, faz divisa com o deserto do Atacama: muito sol, influências frescas e irrigação essencial e cara.'],
    ['Nível 3. Qual destas uvas o programa cita para Portugal?', ['Touriga Nacional', 'Nebbiolo', 'Garnacha', 'Xarel·lo'], 0, 'O programa cita Touriga Nacional, além de Tinta Roriz (Aragonez), Baga, Alvarinho, Loureiro, Arinto e outras. Nebbiolo é italiana; Garnacha e Xarel·lo são espanholas.'],
    ['Nível 3. Que uva tinta argentina, além do Malbec, o programa cita?', ['Carmenère', 'Bonarda', 'Pinotage', 'Tannat'], 1, 'A Bonarda é citada para a Argentina. Carmenère é chilena, Pinotage sul-africana e o Tannat aparece no Sudoeste da França.']]],
   ['h2', 'Treinar estudando no Brasil'],
   ['p', 'A maior parte de qualquer banco de questões WSET trata de vinhos europeus. Para quem estuda no Brasil, isso é uma vantagem disfarçada: as questões são a forma mais barata de "provar" o que não se encontra fácil. Não substituem a taça, mas cada explicação diz que estilo esperar de um Chablis, de um Barolo ou de um Fino sem precisar importar a garrafa.'],
   ['ul', ['Inverta a ordem do conforto: primeiro Europa, espumantes e Jerez; no fim, Chile, Argentina e Portugal.',
           'Quando uma questão citar um lugar, diga em voz alta a uva e o clima antes de olhar as alternativas.',
           'Use os seus vinhos como coordenadas: este tinto tem mais ou menos corpo que um Malbec? Este branco é mais ou menos aromático que um Torrontés?',
           'Se estudar com material de Portugal, traduza: casta é uva, prova é degustação, exame é a nossa prova.',
           'Nas questões sobre Chile e Argentina, responda com o programa, não com a prateleira.']],
   ['tip', 'O espumante brasileiro não está nos programas, mas é um ótimo professor: um de método tradicional e um moscatel lado a lado ensinam mais sobre métodos do que qualquer tabela.'],
  ]},
 'replace': {
  'Como aprender com uma resposta errada': [
   ['h2', 'Como aprender com uma resposta errada'],
   ['p', 'Um erro só ajuda se você souber de que tipo ele é. Antes de passar para a próxima, classifique:'],
   ['ul', ['Não sabia: o tema vai para a lista de estudo, com um flashcard novo.',
           'Sabia e confundi: escreva as duas coisas lado a lado, como Chablis e Sancerre, ou Fino e Oloroso.',
           'Li errado: marque a palavra que passou batido. Se acontece sempre, desacelere.',
           'Respondi com a prateleira, não com o programa: comum nas questões sobre Chile e Argentina. Anote o que o programa diz exatamente.']],
   ['p', 'Volte às questões erradas no dia seguinte e uma semana depois. Quando uma delas sair certa três vezes seguidas, tire da lista.']],
  'Erros comuns na hora de treinar': [
   ['h2', 'Erros comuns na hora de treinar'],
   ['p', 'Os que mais travam o progresso:'],
   ['ul', ['Fazer centenas de questões sem ler nenhuma explicação.',
           'Treinar só os temas que dão certo, como Chile e Portugal.',
           'Nunca usar o cronômetro.',
           'Abandonar um tema europeu porque os nomes são difíceis.',
           'No Nível 3, achar que a múltipla escolha basta e não escrever dissertativas.']]],
  'Minicaso: estagnado nos 60%': [
   ['h2', 'Caso ilustrativo: estagnado nos 60%'],
   ['p', 'Caso inventado. Rafael trabalha numa loja de vinhos em Curitiba e se prepara para o Nível 2. Faz quarenta questões por dia e não passa de 60%. Quando finalmente separa os erros por tema, descobre que acerta quase tudo de uvas principais e de Novo Mundo e erra muito em Alemanha, Jerez e termos de rótulo italianos e espanhóis. Muda o plano: vinte questões por dia só desses blocos, dez cartões de contraste para os pares que confunde e uma releitura de cada explicação errada no dia seguinte. Duas semanas depois, os blocos mistos estão em 74%. Mais questões não resolviam; questões no lugar certo, sim.']],
 },
 'faq_first': [
  ['Cai vinho brasileiro nas questões WSET?', 'Não. Nenhum programa de vinhos do WSET inclui o Brasil. Da América do Sul, o Nível 2 cita o Chile e Mendoza, e o Nível 3 e o Diploma cobrem o Chile e a Argentina inteiros. Portugal aparece com o Porto no Nível 2 e com várias regiões no Nível 3.'],
  ['Como treino questões sobre vinhos europeus que nunca provei?', 'Raciocinando: traduza o lugar em uva, pense no clima e no que foi feito na vinícola, e deduza o estilo. As explicações de cada questão vão montando o mapa de estilos que a taça ainda não deu.'],
  ['Posso treinar questões WSET em português do Brasil?', 'Sim: este site e as questões de exemplo estão em português do Brasil. No app, a interface tem português, mas as lições e as questões completas estão, por enquanto, em italiano, francês, inglês e espanhol.'],
 ],
 'faq_drop': ['Posso treinar questões WSET em português?', 'Onde encontrar questões WSET com gabarito?'],
}

LOCAL = {'mock': MOCK, 'practice': PRACTICE}


def _grades(x):
    """owner's rule: the grades stay in English (Merit, Distinction), also in text inherited from the base content"""
    if isinstance(x, str):
        x = re.sub(r'(?<![\wÀ-ÿ])Mérito(?![\wÀ-ÿ])', 'Merit', x)
        x = re.sub(r'(?<![\wÀ-ÿ])Distinção(?![\wÀ-ÿ])', 'Distinction', x)
        return re.sub(r'(?<![\wÀ-ÿ])patamar do mérito(?![\wÀ-ÿ])', 'nível de Merit', x)
    if isinstance(x, list): return [_grades(y) for y in x]
    if isinstance(x, dict): return {k: _grades(v) for k, v in x.items()}
    return x


def apply(C):
    es_ar_local.apply(C, LOCAL, 'pt-br')
    for k in LOCAL:
        C[k] = _grades(C[k])
    return C
