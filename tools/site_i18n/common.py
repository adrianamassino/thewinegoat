# -*- coding: utf-8 -*-
"""Shared site-language data: the 19 site languages, codes, names, app links, and the map of 'the same page in
every language' (homes, core pages, spirits pages, wine guides) built from the slug files and what exists on disk."""
import os, re, json
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
os.chdir(ROOT)
SITE = 'https://thewinegoat.com'
D = 'tools/site_i18n'
LANGS = ['en', 'it', 'fr', 'es', 'es-ar', 'de', 'nl', 'pl', 'pt', 'pt-br', 'ru', 'el', 'ja', 'ko', 'zh-hans', 'zh-hant', 'ar', 'th', 'tr']
OLD4 = ['en', 'it', 'fr', 'es']                       # languages the guides were written in
NEW = [l for l in LANGS if l not in OLD4]             # the 15 languages this pipeline adds
RTL = {'ar'}
HREF = {'zh-hans': 'zh-Hans', 'zh-hant': 'zh-Hant', 'es-ar': 'es-AR', 'pt-br': 'pt-BR'}   # hreflang / <html lang>
HOME_HREF = dict(HREF, pt='pt-PT')                                                          # the homes already use pt-PT
HOME_ALSO = {'pt': ['pt']}   # …and also the plain language code, so Portuguese speakers outside Portugal and Brazil get /pt/ (the guides use pt)
OGLOC = {'en': 'en_GB', 'it': 'it_IT', 'fr': 'fr_FR', 'es': 'es_ES', 'es-ar': 'es_AR', 'de': 'de_DE', 'nl': 'nl_NL', 'pl': 'pl_PL', 'pt': 'pt_PT', 'pt-br': 'pt_BR',
         'ru': 'ru_RU', 'el': 'el_GR', 'ja': 'ja_JP', 'ko': 'ko_KR', 'zh-hans': 'zh_CN', 'zh-hant': 'zh_TW', 'ar': 'ar_AR', 'th': 'th_TH', 'tr': 'tr_TR'}
LNAME = {'en': 'English', 'it': 'Italiano', 'fr': 'Français', 'es': 'Español', 'es-ar': 'Español (AR)', 'de': 'Deutsch', 'nl': 'Nederlands', 'pl': 'Polski', 'pt': 'Português',
         'pt-br': 'Português (BR)', 'ru': 'Русский', 'el': 'Ελληνικά', 'ja': '日本語', 'ko': '한국어', 'zh-hans': '简体中文', 'zh-hant': '繁體中文', 'ar': 'العربية', 'th': 'ไทย', 'tr': 'Türkçe'}
HOME_LNAME = dict(LNAME, **{'es-ar': 'Español (Argentina)', 'pt': 'Português (Portugal)', 'pt-br': 'Português (Brasil)'})
# header button "Start free" and footer "Updated" (same wording as the core pages)
START = {'en': 'Start free', 'it': 'Inizia gratis', 'fr': 'Commencer gratuitement', 'es': 'Empieza gratis', 'es-ar': 'Empezá gratis', 'de': 'Kostenlos starten', 'nl': 'Gratis beginnen',
         'pl': 'Zacznij za darmo', 'pt': 'Comece grátis', 'pt-br': 'Comece grátis', 'ru': 'Начать бесплатно', 'el': 'Ξεκίνα δωρεάν', 'ja': '無料で始める', 'ko': '무료로 시작',
         'zh-hans': '免费开始', 'zh-hant': '免費開始', 'ar': 'ابدأ مجانًا', 'th': 'เริ่มใช้ฟรี', 'tr': 'Ücretsiz başla'}
UPDATED = {'en': 'Updated', 'it': 'Aggiornato il', 'fr': 'Mis à jour le', 'es': 'Actualizado el', 'es-ar': 'Actualizado el', 'de': 'Aktualisiert am', 'nl': 'Bijgewerkt op', 'pl': 'Aktualizacja',
           'pt': 'Atualizado a', 'pt-br': 'Atualizado em', 'ru': 'Обновлено', 'el': 'Ενημέρωση', 'ja': '更新日', 'ko': '업데이트', 'zh-hans': '更新于', 'zh-hant': '更新於', 'ar': 'آخر تحديث',
           'th': 'อัปเดตเมื่อ', 'tr': 'Güncellendi'}
LANGNAV = {'ar': 'اللغة', 'th': 'ภาษา', 'tr': 'Dil', 'ja': '言語', 'ko': '언어', 'zh-hans': '语言', 'zh-hant': '語言', 'ru': 'Язык', 'el': 'Γλώσσα', 'de': 'Sprache', 'nl': 'Taal',
           'pl': 'Język', 'pt': 'Idioma', 'pt-br': 'Idioma', 'es': 'Idioma', 'es-ar': 'Idioma', 'it': 'Lingua', 'fr': 'Langue', 'en': 'Language'}
DISC_EN = ('The Wine Goat is an independent exam preparation platform, not affiliated with, endorsed or sponsored by the Wine &amp; Spirit Education Trust. '
           'WSET® is a registered trademark of the Wine &amp; Spirit Education Trust, mentioned only to identify the exam being prepared for.')


def home(l): return '/' if l == 'en' else f'/{l}/'
def href(l): return HREF.get(l, l)
def fs(path): return path.lstrip('/') + 'index.html' if path.endswith('/') else path.lstrip('/')
def exists(path): return os.path.exists(fs(path) if path != '/' else 'index.html')


def disclaimer(l):
    """footer disclaimer of that language's home (HTML), English if the home does not exist"""
    p = 'index.html' if l == 'en' else f'{l}/index.html'
    if os.path.exists(p):
        m = re.search(r'<p class="fd3">(.*?)</p>', open(p, encoding='utf8').read(), re.S)
        if m: return m.group(1).strip()
    return DISC_EN


APP_NATIVE = {'en': 'en', 'it': 'it', 'fr': 'fr', 'es': 'es', 'es-ar': 'es-ar'}


def app_lang(l):
    """the ?lang= value for the app, or None while the app does not speak that language (then the app opens in English)"""
    if l in APP_NATIVE: return APP_NATIVE[l]
    return l if os.path.exists(f'app/i18n/{l}.js') else None


def app_link(l, href='/app/'):
    """rewrite any link to the app for language l, keeping its #fragment"""
    frag = href[href.index('#'):] if '#' in href else ''
    a = app_lang(l)
    return f'/app/?lang={a}{frag}' if a else f'/app/{frag}'


def load_slugs():
    return json.load(open(f'{D}/slugs.json', encoding='utf8'))


def clusters():
    """list of {lang: path} for every page family (homes, core, spirits, guides), all languages that have a slug"""
    out = [{l: home(l) for l in LANGS}]
    for f in ('tools/seo_core/slugs.json', 'tools/seo_sp/slugs.json', f'{D}/slugs.json'):
        out += list(json.load(open(f, encoding='utf8')).values())
    return out


class LinkMap:
    """path → same page in another language. `extra` = paths that this run is about to write."""
    def __init__(self, extra=()):
        self.cl = clusters(); self.extra = set(extra)
        self.idx = {}
        for c in self.cl:
            for l, p in c.items(): self.idx.setdefault(p, c)

    def ok(self, p): return p in self.extra or exists(p)

    def same(self, path, l):
        c = self.idx.get(path)
        if c and l in c and self.ok(c[l]): return c[l]
        return None

    def remap(self, url, l, fallback='en'):
        """internal link → that page in language l if it exists; else (fallback='en') the English page / the original,
        or (fallback='home') the language home. Returns the new URL (fragment kept)."""
        if not url or url.startswith(('#', 'mailto:', 'tel:', 'javascript:', 'data:')): return url
        absu = url.startswith(SITE)
        u = url[len(SITE):] or '/' if absu else url
        if not u.startswith('/') or u.startswith('//'): return url
        path, rest = re.match(r'([^?#]*)(.*)', u).groups()
        if path == '/app' or path.startswith('/app/'):
            out = app_link(l, rest)
            return SITE + out if absu else out
        p2 = path if path.endswith('/') or '.' in path.rsplit('/', 1)[-1] else path + '/'
        hit = self.same(p2, l)
        if hit: new = hit
        elif p2 in self.idx:  # a known page that has no version in l (yet)
            if fallback == 'home' and self.ok(home(l)): new = home(l)
            else: new = p2 if self.ok(p2) else self.idx[p2].get('en', p2)
        else: new = path
        return (SITE + new if absu else new) + rest

    def versions(self, path):
        """{lang: path} of the existing versions of the page at `path` (LANGS order)"""
        c = self.idx.get(path, {})
        return {l: c[l] for l in LANGS if l in c and self.ok(c[l])}
