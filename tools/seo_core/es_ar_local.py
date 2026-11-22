# -*- coding: utf-8 -*-
"""Local (Argentina / Uruguay) content of the es-ar core pages (tools/seo_core/build.py applies it to the es-ar content
on every build, after content/es-ar.json + es-ar_x.json are loaded).

LOCAL[key] may hold: title, desc, h1, tldr, lead (list of paragraphs);
  replace {h2 text: [blocks]}   the section under that h2 (heading included) is replaced by the blocks
  before  {h2 text: [blocks]}   blocks inserted before that section
  faq_drop [question, ...]      questions removed;   faq_first [[q, a], ...]   questions put first
Blocks are the builder's own: ['h2', t] ['h3', t] ['p', t] ['ul', [..]] ['ol', [..]] ['tip', t]
['table', head, rows] ['qs', [[question, [4 options], index of the right one, why], ...]].
A heading that no longer exists stops the build (the es-ar content changed: update this file).
Rules: no prices, no school names, no WSET affiliation; exam facts as on the level guides; what each programme
includes from Argentina/Chile was checked on the WSET specifications."""

MOCK = {
 'title': 'Simulacro de examen WSET desde Argentina y Uruguay',
 'desc': 'Simulacros WSET para Argentina y Uruguay: formato de cada nivel, cómo ensayar en casa, mini simulacro con vinos sudamericanos y cata con vinos de acá.',
 'h1': 'Simulacro de examen WSET: cómo ensayar el examen real desde Argentina y Uruguay',
 'tldr': 'Un simulacro es un examen de práctica completo, con la cantidad real de preguntas y el tiempo real. Dos o tres en las últimas semanas, corregidos a fondo, muestran dónde están tus huecos. Para un candidato de Argentina o Uruguay casi siempre están en Europa, en los espumantes y en los fortificados, no en el vino de acá.',
 'lead': ['Leer y subrayar da sensación de avance; un simulacro te dice la verdad. Sentarte con el reloj, la cantidad real de preguntas y sin apuntes es la única forma de saber cómo vas a rendir.',
          'En esta página vas a ver el formato de cada examen WSET, cómo armar un simulacro en tu casa y cómo corregirlo. Y, como está escrita para Argentina y Uruguay, un mini simulacro sobre los vinos sudamericanos de los programas y una práctica de cata con botellas que se consiguen acá.'],
 'before': {
  'Cómo hacer un simulacro en condiciones reales': [
   ['h2', 'Simulacros desde Argentina y Uruguay: qué cambia'],
   ['p', 'El examen es el mismo en todo el mundo, pero los huecos de cada candidato dependen de dónde aprendió a tomar vino. Para quien aprendió con vinos de la región, el patrón esperable es este: mucha soltura en viticultura de clima cálido, en cepas internacionales y en Sudamérica, y más dificultad en cuatro lugares.'],
   ['table', ['Dónde se pierden puntos', 'Por qué pasa acá', 'Qué hacer en el simulacro'],
    [['Denominaciones europeas y términos de etiqueta', 'Llegan pocas botellas y se etiqueta por lugar, no por cepa', 'Que al menos dos tercios de las preguntas sean de Europa'],
     ['Espumantes', 'Se toman mucho, pero sin mirar el método', 'Incluir siempre preguntas de método tradicional y de tanque'],
     ['Fortificados', 'Jerez y Oporto casi no se consumen', 'No saltearlos: son pocas reglas y muy preguntadas'],
     ['Cata de estilos de clima fresco (Nivel 3)', 'El paladar está calibrado para tintos con cuerpo', 'Meter en la práctica blancos de acidez alta y tintos livianos']]],
   ['p', 'Hay un segundo efecto, menos evidente: el exceso de confianza con lo propio. En los simulacros del Nivel 3 es común ver respuestas escritas sobre Mendoza que ocupan una página para un apartado de cuatro puntos. El tiempo que sobra ahí falta después en la pregunta de Borgoña.'],
   ['h3', 'Qué entra de la región en cada examen'],
   ['ul', ['Nivel 1: nada de Argentina ni de Uruguay; ocho cepas internacionales y vinos europeos de ejemplo.',
           'Nivel 2: Mendoza, por el Malbec; de Chile, Valle Central, Maipo, Colchagua y Casablanca.',
           'Nivel 3: Salta con Cafayate, San Juan, Mendoza con Luján de Cuyo, Maipú y Valle de Uco, y la Patagonia; Chile completo.',
           'Uruguay no figura en los programas de vinos; el Tannat se estudia en el suroeste de Francia desde el Nivel 3.']],
   ['h2', 'Mini simulacro: los vinos sudamericanos de los programas'],
   ['p', 'Ocho preguntas originales nuestras, de Nivel 2 y de Nivel 3, sobre Argentina y Chile. Hacelas de corrido, en diez minutos, y recién después mirá las explicaciones. Si sos de la región, acá el objetivo es no fallar ninguna.'],
   ['qs', [
    ['Nivel 2. ¿Qué fruta es típica en la descripción de un Malbec de Mendoza?', ['Limón y manzana verde', 'Frutilla y frambuesa', 'Ciruela negra y mora', 'Lichi y rosas'], 2, 'El Malbec da tintos de color profundo y cuerpo pleno, con fruta negra madura. La fruta roja liviana corresponde a un Pinot Noir; el lichi, al Gewurztraminer.'],
    ['Nivel 2. ¿Qué cepa tinta, llegada desde Burdeos, se asocia hoy con Chile en el programa?', ['Carmenère', 'Pinotage', 'Zinfandel', 'Nebbiolo'], 0, 'Carmenère, con el Valle Central como indicación geográfica. Pinotage es de Sudáfrica, Zinfandel de California y Nebbiolo del Piamonte.'],
    ['Nivel 3. ¿A qué altitud aproximada están muchos viñedos de Cafayate, en Salta?', ['Unos 200 metros', 'Unos 600 metros', 'Unos 1.000 metros', 'Alrededor de 2.000 metros o más'], 3, 'En Cafayate los viñedos llegan a los 2.000 metros y más; la altura permite encontrar sitios frescos a una latitud muy baja. Los 200 metros corresponden a la Patagonia.'],
    ['Nivel 3. ¿Qué describe mejor al departamento de Maipú, en Mendoza?', ['Está a más altura que el Valle de Uco', 'Está al este de Luján de Cuyo, a menor altura, con buen Syrah y Cabernet Sauvignon', 'Es la zona más austral de la provincia', 'Solo produce blancos'], 1, 'Maipú queda al este de Luján de Cuyo y más abajo. Además de Syrah y Cabernet Sauvignon, conserva viñas viejas de Bonarda y Tempranillo.'],
    ['Nivel 3. San Rafael tiene poca altitud para Mendoza y, sin embargo, es de las zonas más frescas de la provincia. ¿Por qué?', ['Por la influencia del océano', 'Por sus suelos de arcilla', 'Por su ubicación más al sur', 'Por el riego por inundación'], 2, 'Está en el sur de Mendoza: la latitud compensa la menor altura. Tiene las plantaciones de Chenin Blanc más importantes del país.'],
    ['Nivel 3. ¿Con qué nombre suelen exportarse los vinos de la provincia argentina de La Rioja, para no confundirlos con la Rioja española?', ['Cuyo', 'Famatina', 'Cafayate', 'Tupungato'], 1, 'Se etiquetan como Famatina, por el valle donde está la mayor parte de los viñedos. El Torrontés es una especialidad de la provincia.'],
    ['Nivel 3. ¿Qué zona chilena se destaca por un Chardonnay con estructura, elegancia y contención?', ['Valle del Limarí', 'Valle de Colchagua', 'Valle del Maule', 'Valle de Curicó'], 0, 'Limarí, en la región de Coquimbo, al norte, con mucha luz y marcada influencia fresca. Colchagua, Curicó y Maule están en el Valle Central, más cálido.'],
    ['Nivel 3. ¿Dónde se concentra la mayor parte del viñedo chileno?', ['En Coquimbo', 'En la región de Aconcagua', 'En el Valle Central', 'En la región Sur'], 2, 'El Valle Central es una zona extensa, cálida y plana donde la uva madura con facilidad. Ahí están Maipo, Cachapoal, Colchagua, Curicó y Maule.']]],
   ['tip', 'Si fallaste dos o más, repasá el capítulo: son los puntos que un candidato de la región no debería regalar. Si acertaste todas, no les dediques más tiempo y pasá a Europa.'],
  ]},
 'replace': {
  'Cómo hacer un simulacro en condiciones reales': [
   ['h2', 'Cómo hacer un simulacro en condiciones reales'],
   ['p', 'Un simulacro vale por lo que se parece al examen. Cuanto más cómodo lo hagas, menos te dice.'],
   ['ul', ['Usá la cantidad exacta de preguntas y el tiempo exacto de tu nivel: 30 en 45 minutos, 50 en 60, o las dos horas del Nivel 3.',
           'Sin apuntes, sin celular y sin pausas. Si te interrumpen, ese simulacro no cuenta.',
           'Hacelo en el idioma en que vas a rendir. Si es inglés y no es tu lengua, la velocidad de lectura cambia mucho.',
           'En el Nivel 3, escribí las respuestas a mano: la mano se cansa y eso también se entrena.',
           'Elegí un horario en que estés despierto. Después de diez horas de trabajo, el resultado mide tu cansancio.',
           'Anotá la nota y guardá la hoja de errores: sirve más que el número.']],
   ['tip', 'Un truco para quien no encuentra tiempo: la primera hora del sábado, antes de que arranque la casa. Tres sábados alcanzan para un Nivel 2.']],
  '¿Cuándo conviene hacer simulacros?': [
   ['h2', '¿Cuándo conviene hacer simulacros?'],
   ['p', 'Ni demasiado pronto, porque todavía no viste el programa, ni todos juntos la última semana, porque no queda tiempo para corregir lo que muestran.'],
   ['table', ['Momento', 'Qué simulacro', 'Para qué'],
    [['Mitad del curso', 'Medio simulacro', 'Conocer el formato y el ritmo'],
     ['Tres semanas antes', 'Primero completo', 'Ver qué bloques fallan'],
     ['Diez días antes', 'Segundo completo', 'Comprobar si el repaso funcionó'],
     ['Tres o cuatro días antes', 'Último', 'Ajustar el reloj y ganar confianza']]],
   ['p', 'Si trabajás en una bodega o en gastronomía, cruzá estas fechas con tu calendario real. La vendimia, de febrero a abril, y las fiestas de fin de año son épocas en las que tres semanas de preparación ordenada son casi imposibles: mejor elegir otra fecha de examen que llegar sin simulacros.']],
  'Errores comunes con los simulacros': [
   ['h2', 'Errores comunes con los simulacros'],
   ['p', 'Los más habituales:'],
   ['ul', ['Hacerlos con el apunte al lado «solo para confirmar».',
           'Repetir el mismo simulacro hasta sacarse un diez: mide memoria, no preparación.',
           'Mirar la nota y no los errores.',
           'Armar simulacros con muchas preguntas de Sudamérica porque dan gusto.',
           'En el Nivel 3, practicar solo el multiple choice y dejar de lado las escritas y la cata.',
           'Hacer el último la noche anterior y dormir mal.']]],
  'Minicaso: una semana para el examen de Nivel 1': [
   ['h2', 'Minicaso: una semana para el examen de Nivel 1'],
   ['p', 'Paula atiende la sala de degustación de una bodega boutique y rinde el Nivel 1 en siete días. En su primer simulacro saca 19 de 30: desaprobada por dos. Revisa los errores y casi todos son de dos tipos: vinos con nombre de lugar, como Chablis o Chianti, y reglas de maridaje invertidas. De cepas tintas y de elaboración no falló ninguna. En vez de releer todo el manual, arma una lista de dos columnas con los vinos de ejemplo y pega la tabla de maridaje en la heladera. Diez preguntas por día en el celular. El segundo simulacro, a los cuatro días: 25 de 30. El tercero: 27. El personaje es inventado, pero la moraleja sirve: un simulacro bien corregido te ahorra estudiar lo que ya sabés.']],
 },
 'faq_first': [
  ['¿Qué deberían incluir los simulacros de un candidato de Argentina o Uruguay?', 'Sobre todo lo que menos se conoce acá: denominaciones europeas, términos de etiqueta, espumantes y fortificados. Las preguntas sobre Argentina y Chile son pocas en el examen real; en el simulacro tienen que ser pocas también.'],
  ['¿Con qué vinos ensayo la cata del Nivel 3 si no consigo europeos?', 'Usá pares que contrasten con lo que hay: Torrontés y Chardonnay con roble, Malbec y Pinot Noir, dos Malbec de distinta calidad. Y compartí con un grupo el costo de algunos importados de clima fresco, que es donde más se desajusta el paladar local.'],
  ['¿Hago el simulacro en español o en el idioma del examen?', 'En el idioma en que vas a rendir, siempre. Leer y escribir contra reloj en otro idioma es una habilidad aparte, y el simulacro es el lugar para entrenarla.'],
 ],
 'faq_drop': ['¿Cómo reproduzco en casa las condiciones del examen WSET?', '¿Sirven los simulacros para el WSET Nivel 1?', '¿Debo repetir el mismo simulacro?'],
}

PRACTICE = {
 'title': 'Preguntas de práctica WSET con respuestas: Argentina y Uruguay',
 'desc': 'Preguntas de práctica WSET con respuestas, para Argentina y Uruguay: Vinos 1, 2 y 3 y Spirits, técnica de multiple choice y preguntas sobre Malbec, Mendoza y Chile.',
 'h1': 'Preguntas de práctica WSET online, con respuestas, para Argentina y Uruguay',
 'tldr': 'Practicar con preguntas es la forma más rápida de convertir lo que leés en algo que te acordás en el examen. Hacé una tanda corta después de cada tema, leé por qué está mal cada opción incorrecta y guardá tus errores. Más abajo hay preguntas de ejemplo de Vinos 1, 2 y 3 y de destilados, y un bloque sobre Sudamérica en los programas.',
 'lead': ['Un examen WSET no pregunta qué leíste: pregunta qué podés recuperar, rápido y sin ayuda. Eso se entrena contestando preguntas, no releyendo. Y cada explicación bien leída vale por una página de apunte.',
          'Esta página está pensada para quien estudia desde Argentina o Uruguay. Además de la técnica y de los ejemplos por nivel, vas a encontrar preguntas sobre los vinos sudamericanos que nombran los programas y consejos para practicar cuando la mayor parte del examen trata de vinos que acá casi no se ven.'],
 'replace_first': {
  'Ocho preguntas de ejemplo más': [
   ['h2', 'Preguntas de ejemplo: Sudamérica en los programas'],
   ['p', 'Preguntas originales nuestras sobre lo que los programas del Nivel 2 y del Nivel 3 incluyen de Argentina y de Chile. En el examen son una porción chica, pero para un candidato de la región son puntos obligados.'],
   ['qs', [
    ['Nivel 2. ¿Qué par de país y cepa regional del programa es correcto?', ['Argentina — Carmenère', 'Chile — Malbec', 'Sudáfrica — Pinotage', 'Australia — Zinfandel'], 2, 'Pinotage es la cepa regional de Sudáfrica. En el programa, Carmenère corresponde a Chile, Malbec a Argentina (Mendoza) y Zinfandel a California.'],
    ['Nivel 2. Un Pinot Noir chileno del programa viene con más probabilidad de…', ['Valle de Casablanca', 'Valle de Colchagua', 'Valle del Maipo', 'Mendoza'], 0, 'Casablanca, por la influencia fresca del Pacífico. Maipo y Colchagua se asocian con Cabernet Sauvignon, y Mendoza es argentina.'],
    ['Nivel 2. ¿Cuál de estas zonas argentinas nombra el programa del Nivel 2?', ['Cafayate', 'Mendoza', 'Río Negro', 'Valle de Uco'], 1, 'Solo Mendoza, asociada al Malbec. Las demás aparecen recién en el Nivel 3.'],
    ['Nivel 3. ¿Qué subzona de Mendoza incluye a Tupungato, un área alta y cada vez más reconocida?', ['Maipú', 'Luján de Cuyo', 'Valle de Uco', 'San Rafael'], 2, 'Tupungato es un departamento del Valle de Uco, donde están los viñedos más altos de Mendoza.'],
    ['Nivel 3. ¿Cuál es la cepa blanca dominante en Salta?', ['Chardonnay', 'Pedro Giménez', 'Sauvignon Blanc', 'Torrontés'], 3, 'El Torrontés domina en Salta y da sus vinos más aromáticos en Cafayate. Pedro Giménez es una cepa tradicional de vinos sencillos para el mercado interno.'],
    ['Nivel 3. En San Antonio, Chile, ¿qué zona especialmente fresca se destaca por su Sauvignon Blanc?', ['Maipo', 'Leyda', 'Elqui', 'Curicó'], 1, 'Leyda es una zona muy fresca del Valle de San Antonio, entre la cordillera de la Costa y el Pacífico. Elqui está en Coquimbo; Maipo y Curicó, en el Valle Central.'],
    ['Nivel 3. ¿Cómo es un Malbec de viñedos de mayor altura, comparado con uno de zonas más bajas?', ['Más corpulento y con fruta más madura', 'Más elegante, con aromas más frescos y florales', 'Más dulce', 'Con menos color y sin taninos'], 1, 'A más altura, temperaturas más bajas: más frescura y notas florales. Los de zonas bajas son más corpulentos, con fruta negra más madura.'],
    ['Nivel 3. ¿Con qué cepas suele combinarse el Malbec en los cortes de alta gama de Argentina?', ['Torrontés y Chardonnay', 'Pinot Noir y Gamay', 'Cabernet Sauvignon, Merlot, Cabernet Franc o Petit Verdot', 'Tempranillo y Garnacha'], 2, 'El Malbec se hace sobre todo como varietal, pero en cortes de alta gama se acompaña de las cepas bordelesas.']]],
   ['h2', 'Practicar desde Argentina y Uruguay'],
   ['p', 'La mayor parte de cualquier banco de preguntas WSET trata de vinos europeos. Para un estudiante rioplatense eso es una ventaja disfrazada: las preguntas son la manera más barata de «probar» lo que no se consigue. No reemplazan a la copa, pero cada explicación te dice qué estilo esperar de un Chablis, de un Barolo o de un Fino sin tener que importar la botella.'],
   ['ul', ['Ordená la práctica al revés de tu comodidad: primero Europa, espumantes y fortificados; al final, Sudamérica.',
           'Cuando una pregunta nombre un lugar, decí en voz alta la cepa y el clima antes de mirar las opciones.',
           'Usá tus vinos como coordenadas: ¿este tinto tiene más o menos cuerpo que un Malbec?, ¿este blanco es más o menos aromático que un Torrontés?',
           'Si el material habla de melocotón, fresa o pimiento, traducí: durazno, frutilla, morrón. Si rendís en inglés, practicá en inglés.',
           'En las preguntas sobre Argentina, contestá con el programa. Para el Nivel 2, Argentina es Mendoza y Malbec, por más que sepas mucho más.']],
   ['tip', 'El Tannat uruguayo no entra en los programas de vinos, pero es un gran maestro de taninos. Si podés describir por qué se siente distinto de un Merlot, ya entendiste media escala de estructura.'],
  ]},
 'replace': {
  '¿Por qué funcionan las preguntas de práctica?': [
   ['h2', '¿Por qué funcionan las preguntas de práctica?'],
   ['p', 'Porque obligan a recordar, y recordar es lo que fija. Releer un capítulo da una sensación engañosa de dominio: todo suena conocido. Una pregunta te saca de esa comodidad en diez segundos.'],
   ['p', 'Además, las preguntas muestran cómo piensa el examen. En el WSET casi nunca se pregunta un dato suelto: se pregunta una relación, por ejemplo entre un clima y un estilo, entre una técnica y un aroma o entre un término de etiqueta y lo que garantiza. Después de unas cuantas tandas empezás a leer el manual buscando esas relaciones.'],
   ['p', 'Y hay un tercer beneficio para quien estudia lejos de Europa: cada explicación describe un vino. Cien preguntas bien leídas sobre Borgoña, el Mosela o Jerez arman en la cabeza un mapa de estilos que acá es difícil construir con la copa.']],
  'Técnica de opción múltiple para el examen WSET': [
   ['h2', 'Técnica de multiple choice para el examen WSET'],
   ['p', 'Las preguntas de los exámenes WSET tienen cuatro opciones y una sola correcta, y no se descuenta por error. Con esas reglas, la técnica importa.'],
   ['h3', 'Leé la pregunta entera, dos veces si hace falta'],
   ['p', 'Buscá la palabra que cambia todo: «no», «principal», «más probable», «típico». Buena parte de los errores de candidatos bien preparados son de lectura.'],
   ['h3', 'Contestá antes de mirar las opciones'],
   ['p', 'Si ya tenés una respuesta propia, los distractores pierden fuerza. Si no la tenés, al menos sabés que es un tema para repasar.'],
   ['h3', 'Descartá por categoría'],
   ['p', 'Casi siempre hay opciones de otro país, de otro tipo de vino o de otra etapa de la elaboración. Un término alemán no puede ser la respuesta de una pregunta sobre Italia.'],
   ['h3', 'Nunca dejes una en blanco'],
   ['p', 'Entre dos opciones tenés la mitad de las chances; en blanco, ninguna. Marcá, seguí y volvé al final si sobra tiempo.'],
   ['tip', 'Cuidado con la opción que «es verdad» pero no contesta lo que se preguntó: es el distractor más eficaz, sobre todo en el Nivel 3.']],
  'Cómo usar las preguntas de práctica en tu repaso': [
   ['h2', 'Cómo usar las preguntas de práctica en tu repaso'],
   ['p', 'Las preguntas no van al final del estudio: van en el medio, todos los días. Una rutina que entra en una jornada de trabajo:'],
   ['table', ['Momento', 'Qué hacer', 'Cuánto'],
    [['Después de cada tema', 'Una tanda corta sobre lo que acabás de ver', '10 preguntas'],
     ['En el viaje o en una pausa', 'Preguntas mezcladas de temas anteriores', '10 a 15 preguntas'],
     ['Al final del día', 'Releer solo las que erraste', '5 minutos'],
     ['Fin de semana', 'Un bloque con reloj, como en el examen', '25 a 50 preguntas']]],
   ['ul', ['Leé la explicación también cuando acertás: a veces acertaste por descarte.',
           'Mezclá temas viejos con nuevos; el repaso espaciado es lo que fija.',
           'No repitas una misma tanda hasta saberla de memoria.']]],
  'Cómo aprender de una respuesta incorrecta': [
   ['h2', 'Cómo aprender de una respuesta incorrecta'],
   ['p', 'Un error sirve si sabés de qué tipo es. Antes de pasar a la siguiente, clasificalo:'],
   ['ul', ['No lo sabía: va a la lista de temas para estudiar, con una ficha nueva.',
           'Lo sabía y lo confundí con otra cosa: escribí las dos cosas lado a lado, por ejemplo Chablis y Sancerre, o Fino y Oloroso.',
           'Leí mal: marcá qué palabra se te pasó. Si te ocurre seguido, bajá la velocidad.',
           'Contesté con la realidad y no con el programa: típico en las preguntas sobre Argentina. Anotá qué dice exactamente el programa.']],
   ['p', 'Volvé a las preguntas erradas al día siguiente y a la semana. Cuando una deja de fallar tres veces seguidas, sacala de la lista.']],
  'Errores comunes al practicar': [
   ['h2', 'Errores comunes al practicar'],
   ['p', 'Los que más frenan el avance:'],
   ['ul', ['Hacer cientos de preguntas sin leer una sola explicación.',
           'Practicar siempre los temas que salen bien.',
           'No usar nunca el reloj.',
           'Abandonar un tema europeo porque los nombres son difíciles.',
           'En el Nivel 3, creer que el multiple choice alcanza y no escribir.']]],
  'Minicaso: atascarse en el 60%': [
   ['h2', 'Minicaso: atascarse en el 60 %'],
   ['p', 'Diego trabaja en una vinoteca de Córdoba y prepara el Nivel 2. Hace cuarenta preguntas por día y no pasa del 60 %. Cuando por fin separa los errores por tema, descubre que acierta casi todo lo de cepas principales y Nuevo Mundo y falla más de la mitad de Italia, Alemania y fortificados. Estaba practicando al azar, y el azar le daba muchas preguntas que ya sabía. Cambia el método: durante una semana, solo tandas de sus tres temas flojos, con una ficha nueva por cada error. A los diez días está en 74 %. El personaje es inventado; el mecanismo es el más común entre los candidatos de la región.']],
 },
 'faq_first': [
  ['¿Hay preguntas sobre vinos argentinos o uruguayos en los exámenes WSET?', 'En el Nivel 1, no. En el Nivel 2, sobre el Malbec de Mendoza. En el Nivel 3, sobre Salta, San Juan, Mendoza y la Patagonia. Uruguay no figura en los programas de vinos; el Tannat se estudia en el suroeste de Francia.'],
  ['¿Cómo practico preguntas sobre vinos europeos que nunca probé?', 'Razonando: traducí el lugar a su cepa, pensá en el clima y en lo que se hizo en la bodega, y deducí el estilo. Las explicaciones de cada pregunta te van armando el mapa de estilos aunque no tengas la botella.'],
  ['¿Las preguntas están en español de Argentina?', 'Sí. La app y esta web usan español rioplatense, con voseo y con el vocabulario de acá: cepa, espumante, durazno, frutilla, morrón.'],
 ],
 'faq_drop': ['¿Puedo practicar preguntas WSET en mi idioma?', '¿Dónde puedo encontrar preguntas WSET con respuestas?'],
}

LOCAL = {'mock': MOCK, 'practice': PRACTICE}


def _find(body, h, lang='es-ar'):
    for i, b in enumerate(body):
        if b[0] == 'h2' and b[1] == h:
            j = next((k for k in range(i + 1, len(body)) if body[k][0] == 'h2'), len(body))
            return i, j
    raise KeyError(f'{lang} core page: heading not found: «{h}»')


def apply(C, local=None, lang='es-ar'):
    """C = the content {key: page} of one language; changed in place. local: the LOCAL dict of another regional
    variant (tools/seo_core/pt_br_local.py uses this function with its own)"""
    for key, L in (LOCAL if local is None else local).items():
        P = C[key]
        for k in ('title', 'desc', 'h1', 'tldr', 'lead'):
            if k in L: P[k] = L[k]
        body = P['body']
        for h, blocks in list(L.get('replace_first', {}).items()) + list(L.get('replace', {}).items()):
            i, j = _find(body, h, lang); body[i:j] = blocks
        for h, blocks in L.get('before', {}).items():
            i, _ = _find(body, h, lang); body[i:i] = blocks
        drop = set(L.get('faq_drop', []))
        missing = drop - {q for q, _ in P['faq']}
        if missing: raise KeyError(f'{lang} core page: FAQ not found: {sorted(missing)}')
        first = L.get('faq_first', [])
        P['faq'] = [list(x) for x in first] + [x for x in P['faq'] if x[0] not in drop and x[0] not in {q for q, _ in first}]
    return C
