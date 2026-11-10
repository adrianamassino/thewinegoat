"""Replace English WSET SAT terms inside Italian / French text with the official local terms."""
import re
# en: (it_m, it_f, fr_m, fr_f)
T = {
 "medium(-)": ("medio(-)", "media(-)", "moyen(-)", "moyenne(-)"), "medium(+)": ("medio(+)", "media(+)", "moyen(+)", "moyenne(+)"),
 "medium-minus": ("medio(-)", "media(-)", "moyen(-)", "moyenne(-)"), "medium-plus": ("medio(+)", "media(+)", "moyen(+)", "moyenne(+)"),
 "medium-dry": ("medio secco",)*2 + ("moyennement sec",)*2, "medium-sweet": ("amabile",)*2 + ("moyennement doux",)*2,
 "off-dry": ("abboccato",)*2 + ("demi-sec",)*2, "medium": ("medio", "media", "moyen", "moyenne"),
 "pale": ("pallido", "pallida", "pâle", "pâle"), "deep": ("intenso", "intensa", "profond", "profonde"),
 "light": ("leggero", "leggera", "léger", "faible"), "pronounced": ("pronunciato", "pronunciata", "prononcé", "prononcée"),
 "low": ("basso", "bassa", "faible", "faible"), "high": ("alto", "alta", "élevé", "élevée"), "full": ("pieno", "piena", "corsé", "corsée"),
 "short": ("corto", "corta", "court", "courte"), "long": ("lungo", "lunga", "long", "longue"),
 "clear": ("limpido", "limpida", "limpide", "limpide"), "hazy": ("velato", "velata", "trouble", "trouble"),
 "clean": ("pulito", "pulita", "net", "nette"), "unclean": ("non pulito", "non pulita", "pas net", "pas nette"),
 "youthful": ("giovane",)*2 + ("jeune",)*2, "developing": ("in evoluzione",)*2 + ("en évolution",)*2,
 "fully developed": ("pienamente evoluto", "pienamente evoluta", "pleinement évolué", "pleinement évoluée"),
 "tired/past its best": ("stanco/in declino", "stanca/in declino", "fatigué/sur le déclin", "fatiguée/sur le déclin"),
 "past its best": ("in declino",)*2 + ("sur le déclin",)*2, "tired": ("stanco", "stanca", "fatigué", "fatiguée"),
 "dry": ("secco", "secca", "sec", "sèche"), "sweet": ("dolce",)*2 + ("doux", "douce"), "luscious": ("molto dolce",)*2 + ("liquoreux", "liquoreuse"),
 "lemon-green": ("giallo verdolino",)*2 + ("jaune-vert",)*2, "lemon": ("giallo limone",)*2 + ("jaune citron",)*2, "gold": ("dorato",)*2 + ("doré",)*2,
 "amber": ("ambrato",)*2 + ("ambré",)*2, "brown": ("marrone",)*2 + ("brun",)*2, "pink": ("rosa",)*2 + ("rose",)*2, "salmon": ("salmone",)*2 + ("saumon",)*2,
 "orange": ("arancione",)*2 + ("orangé",)*2, "purple": ("porpora",)*2 + ("pourpre",)*2, "ruby": ("rubino",)*2 + ("rubis",)*2,
 "garnet": ("granato",)*2 + ("grenat",)*2, "tawny": ("aranciato",)*2 + ("tuilé",)*2,
 "delicate": ("delicata",)*2 + ("délicate",)*2, "creamy": ("cremosa",)*2 + ("crémeuse",)*2, "aggressive": ("aggressiva",)*2 + ("agressive",)*2,
 "faulty": ("difettoso",)*2 + ("défectueux",)*2, "poor": ("scarso",)*2 + ("médiocre",)*2, "acceptable": ("accettabile",)*2 + ("acceptable",)*2,
 "very good": ("molto buono",)*2 + ("très bon",)*2, "good": ("buono",)*2 + ("bon",)*2, "outstanding": ("eccezionale",)*2 + ("exceptionnel",)*2,
 "too young": ("troppo giovane",)*2 + ("trop jeune",)*2, "too old": ("troppo vecchio",)*2 + ("trop vieux",)*2,
 "very low": ("molto basso",)*2 + ("très faible",)*2, "very high": ("molto alto",)*2 + ("très élevé",)*2,
 "out of condition": ("fuori condizione",)*2 + ("hors d'état",)*2,
 "e.g.": ("es.",)*2 + ("ex.",)*2,
}
GLOSS = ["dry", "sweet", "legs", "tears", "balance", "length", "intensity", "complexity", "luscious", "off-dry", "condition", "readiness", "readiness for drinking",
         "youthful, developing, fully developed, tired", "tank", "clear", "hazy", "pale", "deep", "medium", "light", "pronounced"]
KEYS = sorted(T, key=len, reverse=True)
TERM = '(?:' + '|'.join(re.escape(k) for k in KEYS) + ')'
SEPQ = r'(?:\s?[-–—/…]\s?|\s?,\s|\s(?:o|ou|or|e|et)\s)'
SEPL = r'(?:\s?[–—/…]\s?|\s-\s|-(?=(?:low|medium|high)\b))'
def _rx(keys):
    term = '(?:' + '|'.join(re.escape(k) for k in keys) + ')'
    return (term, re.compile(r'(?<![\w-])(' + term + r'(?:' + SEPL + term + r')+)(?![\w-])', re.I),
            re.compile(r'(«\s?|“|")(' + term + r'(?:' + SEPQ + term + r')*)(\s?»|”|")', re.I))
COLOURS = {'ruby', 'tawny', 'garnet', 'purple', 'pink', 'orange', 'lemon', 'gold', 'amber', 'brown', 'salmon'}
RX = {False: _rx(KEYS), True: _rx([k for k in KEYS if k not in COLOURS])}
FEM = {0: re.compile(r'(intensità|acidità|mousse|dolcezza|limpidezza|persistenza|condizione|qualità|fascia)[^.;]{0,60}$', re.I),
       1: re.compile(r'(intensité|acidité|mousse|finale|limpidité|douceur|qualité|plage)[^.;]{0,60}$', re.I)}
_FW = {0: re.compile(r'(intensità|acidità|mousse|dolcezza|limpidezza|persistenza|condizione|qualità|fascia|evoluzione)', re.I),
       1: re.compile(r'(intensité|acidité|mousse|finale|limpidité|douceur|qualité|plage|évolution|couleur)', re.I)}
_MW = {0: re.compile(r'(corpo|alcol|tannin|finale|colore|sviluppo|vino|livello)', re.I),
       1: re.compile(r'(corps|alcool|tanin|vin\b|niveau|nez)', re.I)}
def _isfem(prev, li):
    prev = prev[-220:]
    f = [m.end() for m in _FW[li].finditer(prev)]; m_ = [m.end() for m in _MW[li].finditer(prev)]
    if not f: return False
    return not m_ or max(f) > max(m_)
def _tok(w, li, fem):
    k = w.lower()
    if k not in T: return w
    v = T[k][li * 2 + (1 if fem else 0)]
    return v[0].upper() + v[1:] if w[:1].isupper() and not k.startswith('medium(') else v
def _maplist(seg, li, fem, term):
    return re.sub(term, lambda m: _tok(m.group(0), li, fem), seg, flags=re.I)
def loc(s, li, strict=False):
    """li = 0 for Italian, 1 for French. strict: leave colour words alone (Port styles etc.)."""
    TERM_, LIST, QUOTE = RX[strict]
    if not s: return s
    s = re.sub(r'\s\((?:' + '|'.join(re.escape(g) for g in sorted(GLOSS, key=len, reverse=True)) + r')\)', '', s)
    if not re.search(TERM_, s, re.I): return s
    def q(m):
        fem = _isfem(s[:m.start()], li)
        return m.group(1) + _maplist(m.group(2), li, fem, TERM_) + m.group(3)
    s = QUOTE.sub(q, s)
    def l(m):
        fem = _isfem(s[:m.start()], li)
        return _maplist(m.group(1), li, fem, TERM_)
    s = LIST.sub(l, s)
    # parenthetical English glosses after a local word: "secchi (dry)" -> "secchi"
    s = re.sub(r'(«\s?([^«»]{2,30}?)\s?»)\s\(\2\)', r'\1', s)   # «dorato» (dorato) -> «dorato»
    return s
GLOB = {0: [(r'\boff-dry\b', 'abboccato'), (r'\bmedium-sweet\b', 'amabile'), (r'\bmedium-dry\b', 'medio secco'),
             (r'Bottle age \(red\)', 'Invecchiamento in bottiglia (rossi)'), (r'Bottle age \(white\)', 'Invecchiamento in bottiglia (bianchi)'),
             (r'Deliberate oxidation', 'Ossidazione intenzionale'), (r'Fruit development', 'Evoluzione del frutto'),
             (r'lees, autolysis', 'fecce, autolisi'), (r'\bMLF\b', 'FML'), (r'(?<![\w-])toast(?![\w-])', 'tostato'), (r'Che oak usa', 'Che rovere usa')],
        1: [(r'\boff-dry\b', 'demi-sec'), (r'\bmedium-sweet\b', 'moyennement doux'), (r'\bmedium-dry\b', 'moyennement sec'),
             (r'Bottle age \(red\)', 'Vieillissement en bouteille (rouges)'), (r'Bottle age \(white\)', 'Vieillissement en bouteille (blancs)'),
             (r'Deliberate oxidation', 'Oxydation délibérée'), (r'Fruit development', 'Évolution du fruit'),
             (r'lees, autolysis', 'lies, autolyse'), (r'\bMLF\b', 'FML'), (r'(?<![\w-])toast(?![\w-])', 'pain grillé')]}
def glob(s, li):
    for a, b in GLOB[li]: s = re.sub(a, b, s)
    return s
TRI = re.compile(r'\[("(?:[^"\\]|\\.)*"),("(?:[^"\\]|\\.)*"),("(?:[^"\\]|\\.)*")\]')
def apply_html(h):
    import json
    n = 0
    def f(m):
        nonlocal n
        try: a, b, c = (json.loads(x) for x in m.groups())
        except Exception: return m.group(0)
        a2, b2 = glob(loc(a, 0, True), 0), glob(loc(b, 1, True), 1)
        if a2 == a and b2 == b: return m.group(0)
        n += 1
        d = lambda x: json.dumps(x, ensure_ascii=False).replace('</', '<\\/')
        return '[' + d(a2) + ',' + d(b2) + ',' + m.group(3) + ']'
    return TRI.sub(f, h), n

# ---- aggressive mode for the tasting (SAT) chapter: every stand-alone English SAT term ----
EXTRA = {  # en: (it, fr)
 "deliberate oxidation": ("ossidazione intenzionale", "oxydation délibérée"), "fruit development": ("evoluzione del frutto", "évolution du fruit"),
 "bottle age": ("invecchiamento in bottiglia", "vieillissement en bouteille"), "Level of readiness for drinking": ("Livello di prontezza", "Aptitude à boire"),
 "readiness for drinking": ("prontezza al consumo", "aptitude à boire"), "Quality Level": ("Livello di qualità", "Niveau de qualité"),
 "Citrus fruit": ("Agrumi", "Agrumes"), "Black fruit": ("Frutti neri", "Fruits noirs"), "Red fruit": ("Frutti rossi", "Fruits rouges"),
 "Green fruit": ("Frutta verde", "Fruits verts"), "Stone fruit": ("Frutta a nocciolo", "Fruits à noyau"), "Tropical fruit": ("Frutta tropicale", "Fruits tropicaux"),
 "Dried fruit": ("Frutta secca", "Fruits secs"), "Cooked fruit": ("Frutta cotta", "Fruits cuits"), "Herbaceous": ("Erbaceo", "Herbacé"), "Herbal": ("Erbe aromatiche", "Herbes aromatiques"),
 "Pungent spice": ("Spezie piccanti", "Épices piquantes"), "Floral": ("Floreale", "Floral"), "Yeast": ("Lieviti", "Levures"),
 "Appearance": ("Aspetto", "Aspect"), "Nose": ("Naso", "Nez"), "Palate": ("Palato", "Bouche"), "Conclusions": ("Conclusioni", "Conclusions"),
 "Balance": ("Equilibrio", "Équilibre"), "Length": ("Persistenza", "Longueur"), "Intensity": ("Intensità", "Intensité"), "Complexity": ("Complessità", "Complexité"),
 "balance, length, intensity, complexity": ("equilibrio, persistenza, intensità, complessità", "équilibre, longueur, intensité, complexité"),
 "legs o lacrime": ("lacrime", "larmes"),
}
AGG_EX = {0: {'delicate', 'aggressive', 'lemon', 'balance', 'Balance'}, 1: {'long', 'balance', 'Balance', 'condition', 'acceptable', 'orange', 'lemon', 'Floral', 'Conclusions'}}
_AGG_KEYS = sorted(T, key=len, reverse=True)
_AGG = re.compile(r'(?<![\w\-])(' + '|'.join(re.escape(k) for k in _AGG_KEYS) + r')(?![\w\-])', re.I)
_EXK = sorted(EXTRA, key=len, reverse=True)
_EXR = re.compile(r'(?<![\w])(' + '|'.join(re.escape(k) for k in _EXK) + r')(?![\w])')
_IC = re.compile(r'(?<![\w-])(pale|medium|deep)\s+(lemon-green|lemon|gold|amber|brown|pink|salmon|orange|purple|ruby|garnet|tawny)(?![\w-])', re.I)
def loc_sat(s, li):
    def ic(m):
        a = _tok(m.group(2), li, False); b = _tok(m.group(1).lower(), li, False)
        r = a + ' ' + b
        return r[0].upper() + r[1:] if m.group(1)[:1].isupper() else r
    s = _IC.sub(ic, s)
    s = loc(s, li, False)
    s = _EXR.sub(lambda m: m.group(0) if m.group(1) in AGG_EX[li] else EXTRA[m.group(1)][li], s)
    def f(m):
        w = m.group(1)
        if w in AGG_EX[li] or w.lower() in AGG_EX[li]: return w
        if li == 0 and w.lower() in ('pale',) and not re.search(r'[«»]|SAT|intensit|colore', s): return w
        fem = _isfem(s[:m.start()], li)
        return _tok(w, li, fem)
    return _AGG.sub(f, s)
