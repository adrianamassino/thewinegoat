"""Home quiz with a theme picker (wine, beer, spirits, sake, mix) on every home page: a fixed 20-question level check per theme.

Adds one tag before </body> of each home:  <script src="/assets/homequiz.js?v=N" defer></script>
The script takes over the hero "quick quiz" button (.ctas3 a[href*="go=lvquick"]): theme picker → the fixed 20 questions of that
theme (progress saved, resumable) → free-account gate; the score and the plan are shown in the app (app/hqresult.js).
Questions: assets/homequiz/<lang>.json, one per home language, built from tools/homequiz/src + set.txt by tools/homequiz/build.py.
Idempotent: re-reads every file just before editing and only touches that one tag.
Also run by tools/site_i18n/build.py (sync step), so the Thai/Turkish homes rebuilt from the English home keep it.

Usage from repo root:  python3 tools/home_quiz_themes.py [--quiet] [home.html ...]   (default: the 19 homes)"""
import os, re, sys

V = 6
TAG = f'<script src="/assets/homequiz.js?v={V}" defer></script>'
HOMES = ['index.html'] + [f'{l}/index.html' for l in
         'it fr es es-ar de nl pl pt pt-br ru el ja ko zh-hans zh-hant ar th tr'.split()]
OLD = re.compile(r'<script src="/assets/homequiz\.js(?:\?v=\d+)?" defer></script>\n?')


def transform(s):
    """the page with exactly one quiz tag before </body> (unchanged if it is not a home with the hero button)"""
    if 'class="ctas3"' not in s or '</body>' not in s: return s
    t = OLD.sub('', s)
    i = t.rfind('</body>')
    return t[:i] + TAG + '\n' + t[i:]


def fix(path):
    if not os.path.exists(path): return None
    s = open(path, encoding='utf8').read()
    if 'class="ctas3"' not in s or '</body>' not in s: return None
    t = transform(s)
    if t == s: return False
    open(path, 'w', encoding='utf8').write(t)
    return True


if __name__ == '__main__':
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(root)
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    res = {p: fix(p) for p in (args or HOMES)}
    if '--quiet' not in sys.argv:
        print(f"home quiz: {sum(1 for v in res.values() if v)} updated, {sum(1 for v in res.values() if v is False)} already ok, "
              f"skipped: {[p for p, v in res.items() if v is None] or 'none'}")
