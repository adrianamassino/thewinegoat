# -*- coding: utf-8 -*-
"""AI / search crawler access check from the repository (static analysis; no network).
Run from the repo root:  python3 tools/geo/crawl_access.py  → prints a Markdown report (used in tools/geo/REPORT.md).
Checks: robots.txt group that applies to each crawler and whether "/" (and key paths) are allowed; meta robots,
meta googlebot/bingbot and http-equiv X-Robots-Tag in every public page; visible text present in the initial HTML
(without running JavaScript) per page family; JS-only pages."""
import glob, html, json, re, statistics, collections
SKIP = ('app/', 'tools/', 'mobile/', 'supabase/', 'node_modules/', '.git/')
BOTS = [  # (user-agent token, operator, purpose)
    ('Googlebot', 'Google', 'Search index (also used for AI Overviews / AI Mode)'),
    ('Bingbot', 'Microsoft', 'Search index (also grounds Copilot answers)'),
    ('OAI-SearchBot', 'OpenAI', 'Search / answer: ChatGPT search results'),
    ('ChatGPT-User', 'OpenAI', 'User-triggered fetch from ChatGPT'),
    ('GPTBot', 'OpenAI', 'Model training'),
    ('Claude-SearchBot', 'Anthropic', 'Search / answer: Claude search results'),
    ('Claude-User', 'Anthropic', 'User-triggered fetch from Claude'),
    ('ClaudeBot', 'Anthropic', 'Model training'),
    ('anthropic-ai', 'Anthropic', 'Legacy token (training)'),
    ('PerplexityBot', 'Perplexity', 'Search / answer index'),
    ('Perplexity-User', 'Perplexity', 'User-triggered fetch'),
    ('Google-Extended', 'Google', 'Control token: use of content for Gemini training/grounding (not a crawler; does not affect Search)'),
    ('Applebot', 'Apple', 'Search (Siri / Spotlight)'),
    ('Applebot-Extended', 'Apple', 'Control token: use for Apple AI training'),
    ('DuckAssistBot', 'DuckDuckGo', 'Answer (DuckAssist) fetch'),
    ('meta-externalagent', 'Meta', 'Model training / AI features'),
    ('CCBot', 'Common Crawl', 'Open web corpus widely used for training'),
    ('Amazonbot', 'Amazon', 'Search / Alexa answers and training'),
    ('MistralAI-User', 'Mistral', 'User-triggered fetch from Le Chat'),
    ('YandexBot', 'Yandex', 'Search index'),
]


def robots_groups(txt):
    groups, cur, last_ua = [], None, False
    for line in txt.splitlines():
        line = line.split('#')[0].strip()
        if not line or ':' not in line: continue
        k, v = [x.strip() for x in line.split(':', 1)]; k = k.lower()
        if k == 'user-agent':
            if not last_ua: cur = {'ua': [], 'rules': []}; groups.append(cur)
            cur['ua'].append(v.lower()); last_ua = True
        else:
            last_ua = False
            if cur and k in ('allow', 'disallow'): cur['rules'].append((k, v))
    return groups


def allowed(groups, bot, path='/'):
    g = [x for x in groups if bot.lower() in x['ua']] or [x for x in groups if '*' in x['ua']]
    if not g: return True, '(no group)'
    best = ('allow', '')
    for k, v in g[0]['rules']:
        if v and path.startswith(v) and len(v) >= len(best[1]): best = (k, v)
    return best[0] == 'allow' or best[1] == '', ('own group' if bot.lower() in g[0]['ua'] else 'User-agent: *')


def family(p):
    if p == 'index.html' or re.fullmatch(r'[a-z-]+/index\.html', p) and p.split('/')[0] in LANGS: return 'Home pages'
    if any(p.startswith(x) for x in ABOUT): return 'About + feature pages (new)'
    if p in CORE: return 'Core hubs (seo_core)'
    if p in SPIRITS: return 'Spirits pages (seo_sp)'
    if '/' in p.rstrip('/index.html') and re.search(r'(questions|domande|questions-wset|preguntas|qcm|fragen|vragen|pytania|perguntas|questoes|sorulari)', p): return 'Question pages'
    return 'Guides and other pages'


LANGS = {'it', 'fr', 'es', 'es-ar', 'de', 'nl', 'pl', 'pt', 'pt-br', 'ru', 'el', 'ja', 'ko', 'zh-hans', 'zh-hant', 'ar', 'th', 'tr', 'en'}
CORE = {u.lstrip('/') + 'index.html' for k in json.load(open('tools/seo_core/slugs.json')).values() for u in k.values()}
SPIRITS = {u.lstrip('/') + 'index.html' for k in json.load(open('tools/seo_sp/slugs.json')).values() for u in (k.values() if isinstance(k, dict) else [])}
ABOUT = [u.lstrip('/') for k in json.load(open('tools/geo/slugs.json')).values() for u in k.values()]


def main():
    rb = open('robots.txt').read(); G = robots_groups(rb)
    print('### robots.txt (repository version)\n')
    print('| Crawler / token | Operator | Purpose | Applies | "/" allowed | /app/ allowed |')
    print('|---|---|---|---|---|---|')
    for b, op, purpose in BOTS:
        a, how = allowed(G, b); a2, _ = allowed(G, b, '/app/')
        print(f'| {b} | {op} | {purpose} | {how} | {"yes" if a else "NO"} | {"yes" if a2 else "NO"} |')
    sm = re.findall(r'(?im)^sitemap:\s*(\S+)', rb)
    print(f'\nSitemap lines: {", ".join(sm) or "none"}. Disallow rules: {len(re.findall(r"(?im)^disallow:\s*/", rb))}.\n')
    fam = collections.defaultdict(list); flags = collections.Counter(); ex = {}
    for p in sorted(glob.glob('**/*.html', recursive=True)):
        if p.startswith(SKIP): continue
        s = open(p, encoding='utf8').read(); head = s[:s.find('</head>')]
        for m in re.findall(r'<meta[^>]+name=["\'](robots|googlebot|bingbot|gptbot|claudebot)["\'][^>]+content=["\']([^"\']+)', head, re.I):
            for d in ('noindex', 'nofollow', 'none', 'noarchive', 'nosnippet', 'noimageindex', 'max-snippet:0', 'noai', 'noimageai'):
                if d in m[1].lower(): flags[f'{m[0]}: {d}'] += 1; ex.setdefault(f'{m[0]}: {d}', p)
        if re.search(r'http-equiv=["\']x-robots-tag', head, re.I): flags['meta http-equiv X-Robots-Tag'] += 1
        body = s[s.find('<body'):]
        txt = re.sub(r'<script.*?</script>|<style.*?</style>|<template.*?</template>|<noscript.*?</noscript>', ' ', body, flags=re.S)
        words = len(html.unescape(re.sub(r'<[^>]+>', ' ', txt)).split())
        h1 = bool(re.search(r'<h1[\s>]', txt))
        fam[family(p)].append((p, words, h1))
    print('### Meta robots / X-Robots in the HTML\n')
    if flags:
        for k, v in flags.most_common(): print(f'- {k}: {v} page(s), e.g. {ex.get(k, "")}')
    else: print('- none')
    print('\n### Content in the initial HTML (no JavaScript executed)\n')
    print('| Page family | Pages | Min words | Median words | Pages with h1 in static HTML | Pages under 300 words |')
    print('|---|---|---|---|---|---|')
    for f in ('Home pages', 'Core hubs (seo_core)', 'Spirits pages (seo_sp)', 'Guides and other pages', 'Question pages', 'About + feature pages (new)'):
        L = fam.get(f, [])
        if not L: continue
        w = [x[1] for x in L]; low = [x[0] for x in L if x[1] < 300]
        print(f'| {f} | {len(L)} | {min(w)} | {int(statistics.median(w))} | {sum(x[2] for x in L)} | {len(low)}{" (" + ", ".join(low[:4]) + ")" if low else ""} |')
    a = open('app/index.html', encoding='utf8').read(2000000)
    print(f'\nApp shell /app/: meta robots = {re.search(r"<meta name=.robots. content=.([^\"]+)", a).group(1) if re.search(r"<meta name=.robots. content=", a) else "none"}; its content is rendered by JavaScript (by design: it is the product, not a landing page).')


if __name__ == '__main__':
    main()
