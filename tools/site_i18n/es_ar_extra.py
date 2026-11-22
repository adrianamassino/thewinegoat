# -*- coding: utf-8 -*-
"""Spanish (Spain) → Argentine Spanish for the guide pages: tools/i18n/ar_rules.py (read-only, shared with the app)
plus the extra forms that appear in the guides. Also applies the imperatives after a placeholder ({1}Empieza…)."""
import re, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'i18n'))
from ar_rules import to_ar, IMP

# imperatives (tú → vos), only at the start of a sentence / segment / after a placeholder
IMP2 = dict(IMP, **{'aprende': 'aprendé', 'usa': 'usá', 'comprueba': 'comprobá', 'dedica': 'dedicá', 'intenta': 'intentá', 'organiza': 'organizá',
                    'planifica': 'planificá', 'anota': 'anotá', 'revisa': 'revisá', 'toma': 'tomá', 'pon': 'poné', 'ten': 'tené', 'repite': 'repetí',
                    'señala': 'señalá', 'prepara': 'prepará', 'vigila': 'vigilá', 'evita': 'evitá', 'distingue': 'distinguí',
                    'aprovecha': 'aprovechá', 'reserva': 'reservá', 'cronometra': 'cronometrá', 'trabaja': 'trabajá', 'divide': 'dividí', 'tacha': 'tachá', 'resuelve': 'resolvé', 'piensa': 'pensá', 'cierra': 'cerrá', 'vuelve': 'volvé'})
# anywhere (whole word)
WORDS = {'céntrate': 'centrate', 'concéntrate': 'concentrate', 'pregúntate': 'preguntate', 'apréndete': 'aprendete', 'apréndelas': 'aprendelas',
         'apréndelos': 'aprendelos', 'respóndelas': 'respondelas', 'respóndela': 'respondela', 'léela': 'leela', 'léelas': 'leelas', 'repásalos': 'repasalos',
         'repásalas': 'repasalas', 'repásala': 'repasala', 'repásalo': 'repasalo', 'escríbela': 'escribila', 'escríbelas': 'escribilas', 'apúntate': 'anotate',
         'asegúrate': 'asegurate', 'organízate': 'organizate', 'tómate': 'tomate el', 'suspendes': 'desaprobás', 'repites': 'repetís', 'apruebas': 'aprobás',
         'trabajas': 'trabajás', 'percibes': 'percibís', 'acabas': 'acabás', 'preparas': 'preparás', 'cometes': 'cometés', 'dedicas': 'dedicás',
         'practicas': 'practicás', 'confundes': 'confundís', 'escribes': 'escribís', 'aciertas': 'acertás', 'hueles': 'olés', 'pruebas': None,
         'describes': 'describís', 'llegas': 'llegás', 'buscas': 'buscás', 'corrígelos': 'corregilos', 'corrígela': 'corregila', 'consulta': None}
WORDS = {k: v for k, v in WORDS.items() if v and k != 'tómate'}
WORDS.update({'relaciónalo': 'relacionalo', 'calíbrate': 'calibrate', 'relaciónala': 'relacionala', 'úsala': 'usala', 'descríbelo': 'describilo', 'compruébala': 'comprobala', 'trátalos': 'tratalos', 'justifícalo': 'justificalo', 'ábrela': 'abrila', 'compruébalos': 'comprobalos', 'divídela': 'dividila', 'guárdalas': 'guardalas', 'úsalo': 'usalo', 'guárdala': 'guardala', 'compáralos': 'comparalos', 'compáralas': 'comparalas', 'aplícalo': 'aplicalo', 'repítela': 'repetila', 'prepárate': 'preparate', 'compruébalo': 'comprobalo', 'nómbrala': 'nombrala', 'valórala': 'valorala', 'apúntala': 'anotala', 'discúlpate': 'disculpate', 'enfríalo': 'enfrialo', 'léelos': 'leelos', 'trátala': 'tratala', 'escanéalo': 'escanealo', 'apréndelo': 'aprendelo', 'recuérdala': 'recordala', 'practícalo': 'practicalo', 'cíñete': 'ceñite', 'infórmate': 'informate', 'háblame': 'hablame', 'únela': 'unila', 'reescríbelas': 'reescribilas', 'divídelas': 'dividilas', 'combínalas': 'combinalas', 'mézclalo': 'mezclalo', 'agrúpalos': 'agrupalos', 'acostúmbrate': 'acostumbrate', 'corrígelo': 'corregilo', 'márcala': 'marcala', 'agrúpalas': 'agrupalas', 'inclúyela': 'incluila', 'revísalo': 'revisalo', 'preséntala': 'presentala', 'menciónala': 'mencionala', 'confírmalos': 'confirmalos', 'conviértelos': 'convertilos', 'consúltalo': 'consultalo', 'combínalo': 'combinalo', 'escríbelos': 'escribilos', 'quítala': 'quitala', 'sepáralos': 'separalos', 'corrígete': 'corregite', 'apúntalas': 'anotalas', 'alárgalas': 'alargalas', 'cronométrate': 'cronometrate', 'conviértelas': 'convertilas', 'analízalo': 'analizalo', 'trabájalas': 'trabajalas', 'muévelo': 'movelo', 'reléela': 'releela', 'quédate': 'quedate', 'ordénalos': 'ordenalos', 'hazte': 'hacete', 'acuérdate': 'acordate', 'olvídate': 'olvidate', 'sacas': 'sacás', 'superas': 'superás', 'sientes': 'sentís', 'dispones': 'disponés', 'reconoces': 'reconocés', 'bebes': 'tomás', 'sirves': 'servís', 'contestas': 'contestás'})
WORDS.update({'si dudas': 'si dudás', 'si esperas': 'si esperás'})
IMP2.update({'espera': 'esperá', 'contesta': 'contestá', 'deja': 'dejá', 'mantén': 'mantené', 'duerme': 'dormí', 'bebe': 'tomá', 'añade': 'agregá', 'domina': 'dominá', 'adapta': 'adaptá', 'localiza': 'localizá'})
L = 'A-Za-zÁÉÍÓÚÑáéíóúñü'

# Rioplatense vocabulary of the guides (whole words, in this order; the capital of the first letter is kept).
# Exam words (rendir, desaprobar, multiple choice, programa), wine words as used in Argentina and Uruguay (cepa, espumante,
# tanque, tapa a rosca) and the tasting descriptors a local student actually says (durazno, damasco, frutilla, ananá…).
VOCAB = [
    (r'variedades de uva', 'cepas'), (r'variedad de uva', 'cepa'), (r'variedades(?! de\b)', 'cepas'), (r'variedad(?! de\b)', 'cepa'),
    (r'uvas principales', 'cepas principales'), (r'con qué uva', 'con qué cepa'), (r'uva emblemática', 'cepa emblemática'),
    (r'tipo test', 'multiple choice'), (r'temario', 'programa'), (r'suspenso', 'desaprobado'), (r'suspendid([oa]s?)', r'desaprobad\1'), (r'suspender', 'desaprobar'),
    (r'fallos', 'errores'), (r'fallo', 'error'), (r'matrícula', 'inscripción'), (r'matricularte', 'inscribirte'), (r'matricularse', 'inscribirse'),
    (r'volver a presentar(?:te|se)(?: al examen)?', 'volver a rendir'), (r'presentar(?:te|se) al examen', 'rendir el examen'), (r'presentar(?:te|se) a (?=(?:la|las|los|un|una)\b)', 'rendir '),
    (r'merece la pena', 'vale la pena'), (r'ahora mismo', 'ya mismo'), (r'de un vistazo', 'de un pantallazo'), (r'echar un vistazo', 'pegar una mirada'),
    (r'a la primera(?! (?:pregunta|vez|parte|unidad|clase|sesión|semana|lectura|copa|fermentación|opción|respuesta|impresión|etapa|fase|línea|señal|prueba|botella|mitad|página|vista|nariz|cata|hora)\b)', 'al primer intento'),
    (r'chuleta completa', 'resumen completo'), (r'la chuleta', 'el resumen'), (r'esta chuleta', 'este resumen'), (r'una chuleta', 'un resumen'), (r'chuleta', 'resumen'),
    (r'espumosos', 'espumantes'), (r'espumos[oa]', 'espumante'), (r'depósitos', 'tanques'), (r'depósito', 'tanque'),
    (r'el tapón de rosca', 'la tapa a rosca'), (r'un tapón de rosca', 'una tapa a rosca'), (r'tapones de rosca', 'tapas a rosca'), (r'tapón de rosca', 'tapa a rosca'),
    (r'sumilleres', 'sommeliers'), (r'sumiller', 'sommelier'), (r'camareros', 'mozos'), (r'camarero', 'mozo'), (r'gama alta', 'alta gama'),
    (r'melocotones', 'duraznos'), (r'melocotón', 'durazno'), (r'albaricoques', 'damascos'), (r'albaricoque', 'damasco'), (r'fresas', 'frutillas'), (r'fresa', 'frutilla'),
    (r'(?<!agave )(?<!agave: )piña', 'ananá'), (r'plátano', 'banana'), (r'pimiento', 'morrón'), (r'la grosella negra', 'el cassis'), (r'grosella negra', 'cassis'),
    (r'fruta de hueso', 'fruta de carozo'), (r'zarzamora', 'mora'), (r'las setas', 'los hongos'), (r'setas', 'hongos'), (r'mantequilla', 'manteca'), (r'nata', 'crema'),
    (r'patatas', 'papas'), (r'tarta', 'torta'), (r'nevera', 'heladera'), (r'un frigorífico', 'una heladera'), (r'cubitera', 'frapera'), (r'vídeo', 'video'), (r'vídeos', 'videos'),
    (r'un bolígrafo rojo', 'una birome roja'), (r'bolígrafo', 'birome'), (r'en el metro', 'en el subte'),
]
VOCAB = [(re.compile(rf'(?<![{L}])(?:{a})(?![{L}])', re.I), b) for a, b in VOCAB]


def _case(src, dst): return dst[:1].upper() + dst[1:] if src[:1].isupper() else dst


def es_ar(s):
    s = to_ar(s) or s
    s = re.sub(rf'(?<![{L}])({"|".join(map(re.escape, WORDS))})(?![{L}])', lambda m: _case(m.group(1), WORDS[m.group(1).lower()]), s, flags=re.I)
    s = re.sub(rf'(^|[.:;!?¡¿]\s*|\}}\s*|\n)([{L}]+)(?![{L}])', lambda m: m.group(1) + (_case(m.group(2), IMP2[m.group(2).lower()]) if m.group(2).lower() in IMP2 else m.group(2)), s)
    s = re.sub(r'\b([Pp])rueba (gratis|las|los|el|la|\d)', lambda m: m.group(1) + 'robá ' + m.group(2), s)
    s = re.sub(rf'\b((?:Luego|Después|Entonces|Primero|Por último|Al final|A continuación|Así que|Mientras tanto|así que|luego|después|y luego|y después),? )([{L}]+)(?![{L}])', lambda m: m.group(1) + (IMP2[m.group(2)] if m.group(2) in IMP2 else m.group(2)), s)
    for rx, b in VOCAB: s = rx.sub(lambda m, b=b: _case(m.group(0), m.expand(b)), s)
    return s
