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
         'asegúrate': 'asegurate', 'organízate': 'organizate', 'tómate': 'tomate el', 'suspendes': 'suspendés', 'repites': 'repetís', 'apruebas': 'aprobás',
         'trabajas': 'trabajás', 'percibes': 'percibís', 'acabas': 'acabás', 'preparas': 'preparás', 'cometes': 'cometés', 'dedicas': 'dedicás',
         'practicas': 'practicás', 'confundes': 'confundís', 'escribes': 'escribís', 'aciertas': 'acertás', 'hueles': 'olés', 'pruebas': None}
WORDS = {k: v for k, v in WORDS.items() if v and k != 'tómate'}
L = 'A-Za-zÁÉÍÓÚÑáéíóúñü'


def _case(src, dst): return dst[:1].upper() + dst[1:] if src[:1].isupper() else dst


def es_ar(s):
    s = to_ar(s) or s
    s = re.sub(rf'(?<![{L}])({"|".join(map(re.escape, WORDS))})(?![{L}])', lambda m: _case(m.group(1), WORDS[m.group(1).lower()]), s, flags=re.I)
    s = re.sub(rf'(^|[.:;!?¡¿]\s*|\}}\s*|\n)([{L}]+)(?![{L}])', lambda m: m.group(1) + (_case(m.group(2), IMP2[m.group(2).lower()]) if m.group(2).lower() in IMP2 else m.group(2)), s)
    s = re.sub(r'\b([Pp])rueba (gratis|las|los|el|la|\d)', lambda m: m.group(1) + 'robá ' + m.group(2), s)
    return s
