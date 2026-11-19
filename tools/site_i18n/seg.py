# -*- coding: utf-8 -*-
"""HTML ⇄ translation segments (shared by extract.py and build.py).

process(doc, tr, region) walks a page and calls tr(text, kind) for every translatable string, in document order, and
puts the return value back. Extraction passes a collector (returns the text unchanged), the build passes the lookup.
Translatable strings:
  head   <title>, meta description/keywords/og:title/og:description/og:image:alt/twitter:*  (kind title/desc/meta)
  ld     JSON-LD string values of headline/name/description/text/caption/abstract/keywords/… (kind ld)
  data   script#home-data (home only): tx, says, pill, mcq q/o/e                           (kind data)
  body   every run of text + inline tags inside the region (<main> for guides, <body> for the home) (kind text)
         and the attributes alt/title/aria-label/placeholder/data-tpl                        (kind attr)
Inline tags inside a run become numbered placeholders: an opening or void tag → {1}, its closing tag → {/1}.
The translator must keep every placeholder (order may change when the grammar needs it); the build puts the original
tags back (links remapped by the builder). Text is plain (HTML entities decoded); the build re-escapes it."""
import re, json, html, unicodedata

INLINE = {'a', 'strong', 'b', 'em', 'i', 'span', 'small', 'code', 'abbr', 'sup', 'sub', 'br', 'mark', 'u', 's', 'q', 'cite', 'time', 'kbd', 'wbr', 'bdi', 'bdo', 'dfn', 'var'}
ATTRS = ('alt', 'title', 'aria-label', 'placeholder', 'data-tpl')
META = ('description', 'keywords', 'og:title', 'og:description', 'og:image:alt', 'twitter:title', 'twitter:description', 'twitter:image:alt')
LDKEYS = {'headline', 'alternativeHeadline', 'name', 'description', 'text', 'caption', 'abstract', 'keywords', 'articleSection', 'educationalLevel', 'teaches', 'about', 'disambiguatingDescription'}
LDSKIP_PARENT = {'Organization', 'WebSite'}          # brand names stay
SKIP_VALUES = {'The Wine Goat', 'WSET', 'Wine'}
TOK = re.compile(r'<!--.*?-->|<script\b[^>]*>.*?</script\s*>|<style\b[^>]*>.*?</style\s*>|<svg\b.*?</svg\s*>|<textarea\b[^>]*>.*?</textarea\s*>|<[^>]+>|[^<]+', re.S | re.I)
TAGNAME = re.compile(r'</?\s*([a-zA-Z][a-zA-Z0-9-]*)')
PH = re.compile(r'\{/?\d+\}')


def has_words(t):
    t = PH.sub('', t)
    return any(unicodedata.category(c)[0] in 'LN' for c in t)


def _attr_sub(tok, tr):
    def rep(m):
        name, q, val = m.group(1), m.group(2), m.group(3)
        if name.lower() not in ATTRS: return m.group(0)
        v = html.unescape(val)
        if not has_words(v) or v.strip() in SKIP_VALUES: return m.group(0)
        return f'{name}={q}{html.escape(tr(v, "attr"), quote=True)}{q}'
    return re.sub(r'(?<=\s)([a-zA-Z:-]+)=(["\'])(.*?)\2', rep, tok, flags=re.S)


def _flush(run, tr, out):
    """run: list of ('t', text) / ('g', tag, name, closing). Emits the translated run into out."""
    if not run: return
    nums, stack, parts, tags = {}, [], [], {}
    n = 0
    for it in run:
        if it[0] == 't':
            parts.append(html.unescape(it[1]))
        else:
            _, tag, name, closing = it
            if closing:
                k = next((j for j in range(len(stack) - 1, -1, -1) if stack[j][0] == name), None)
                if k is not None:
                    num = stack.pop(k)[1]; key = '{/%d}' % num
                else:
                    n += 1; key = '{/%d}' % n
            else:
                n += 1; key = '{%d}' % n
                if not (name in ('br', 'wbr') or tag.rstrip().endswith('/>')): stack.append((name, n))
            tags[key] = tag; parts.append(key)
    s = ''.join(parts)
    core = s.strip()
    if not has_words(core):
        out.append(''.join(it[1] for it in run)); return
    lead, trail = s[:len(s) - len(s.lstrip())], s[len(s.rstrip()):]
    t = tr(core, 'text')
    pieces = PH.split(t); keys = PH.findall(t)
    res = html.escape(pieces[0], quote=False)
    for k, p in zip(keys, pieces[1:]):
        res += tags.get(k, '') + html.escape(p, quote=False)
    out.append(html.escape(lead, quote=False) + res + html.escape(trail, quote=False))


def body(region, tr, skip=None):
    """Translate a fragment of HTML. skip(tag_token) → True to copy that element (and its subtree) untouched."""
    out, run = [], []
    toks = TOK.findall(region)
    i = 0
    while i < len(toks):
        tok = toks[i]
        if tok.startswith('<') and not tok.startswith(('<!--', '<!')):
            m = TAGNAME.match(tok); name = m.group(1).lower() if m else ''
            closing = tok.startswith('</')
            if not closing and skip and skip(tok):
                _flush(run, tr, out); run = []
                depth, j = 0, i
                while j < len(toks):  # copy the whole element
                    t2 = toks[j]; m2 = TAGNAME.match(t2) if t2.startswith('<') else None
                    if m2 and m2.group(1).lower() == name:
                        depth += -1 if t2.startswith('</') else (0 if t2.rstrip().endswith('/>') else 1)
                    out.append(t2); j += 1
                    if depth <= 0: break
                i = j; continue
            if name in ('script', 'style', 'svg', 'textarea'):
                _flush(run, tr, out); run = []; out.append(tok); i += 1; continue
            tok2 = _attr_sub(tok, tr) if not closing else tok
            if name in INLINE:
                run.append(('g', tok2, name, closing))
            else:
                _flush(run, tr, out); run = []; out.append(tok2)
        elif tok.startswith('<'):
            _flush(run, tr, out); run = []; out.append(tok)
        else:
            run.append(('t', tok))
        i += 1
    _flush(run, tr, out)
    return ''.join(out)


def _ld_walk(node, tr, parent_type=None):
    if isinstance(node, dict):
        t = node.get('@type')
        for k, v in node.items():
            if k in ('@context', '@type', '@id'): continue
            if isinstance(v, str) and k in LDKEYS and t not in LDSKIP_PARENT and has_words(v) and v.strip() not in SKIP_VALUES and not v.startswith('http'):
                node[k] = tr(v, 'ld')
            elif isinstance(v, list) and k == 'keywords' and all(isinstance(x, str) for x in v):
                node[k] = [tr(x, 'ld') if has_words(x) else x for x in v]
            else:
                _ld_walk(v, tr, t)
    elif isinstance(node, list):
        for x in node: _ld_walk(x, tr, parent_type)
    return node


def ld(doc, tr, post=None):
    """JSON-LD blocks; post(obj) may rewrite URLs/inLanguage after translation."""
    def rep(m):
        try: J = json.loads(m.group(2))
        except Exception: return m.group(0)
        J = _ld_walk(J, tr)
        if post: J = post(J)
        return m.group(1) + json.dumps(J, ensure_ascii=False) + m.group(3)
    return re.sub(r'(<script type="application/ld\+json">)(.*?)(</script>)', rep, doc, flags=re.S)


def home_data(doc, tr, post=None):
    def rep(m):
        D = json.loads(m.group(2))
        if 'pill' not in D: D['pill'] = ['{n} answers saved to your profile', 'Continue']
        D['tx'] = {k: tr(v, 'data') for k, v in D.get('tx', {}).items()}
        D['says'] = [tr(x, 'data') for x in D.get('says', [])]
        D['pill'] = [tr(x, 'data') for x in D['pill']]
        for q in D.get('mcq', []):
            q['q'] = tr(q['q'], 'data'); q['o'] = [tr(x, 'data') for x in q['o']]; q['e'] = tr(q['e'], 'data')
        if post: D = post(D)
        return m.group(1) + json.dumps(D, ensure_ascii=False) + m.group(3)
    return re.sub(r'(<script type="application/json" id="home-data">)(.*?)(</script>)', rep, doc, flags=re.S)


def head(doc, tr):
    i = doc.find('</head>')
    h, rest = doc[:i], doc[i:]
    h = re.sub(r'(<title>)(.*?)(</title>)', lambda m: m.group(1) + html.escape(tr(html.unescape(m.group(2)), 'title'), quote=False) + m.group(3), h, count=1, flags=re.S)
    def meta(m):
        tag = m.group(0)
        nm = re.search(r'\b(?:name|property)="([^"]+)"', tag)
        if not nm or nm.group(1) not in META: return tag
        c = re.search(r'\bcontent="([^"]*)"', tag)
        if not c or not has_words(html.unescape(c.group(1))): return tag
        kind = 'desc' if nm.group(1) in ('description', 'og:description', 'twitter:description') else ('title' if nm.group(1) in ('og:title', 'twitter:title') else 'meta')
        v = tr(html.unescape(c.group(1)), kind)
        return tag[:c.start(1)] + html.escape(v, quote=True) + tag[c.end(1):]
    h = re.sub(r'<meta\b[^>]*>', meta, h)
    return h + rest


def lg3_skip(tok):
    return tok.startswith('<details') and 'class="lg3"' in tok


def process(doc, tr, region='main', ld_post=None, data_post=None):
    """Whole page: head, body region, JSON-LD, home data. Same call order for extraction and build."""
    doc = head(doc, tr)
    if region == 'body':
        a = doc.find('<body'); a = doc.find('>', a) + 1; b = doc.rfind('</body>')
        doc = doc[:a] + body(doc[a:b], tr, skip=lg3_skip) + doc[b:]
    else:
        a = doc.find('<main'); b = doc.rfind('</main>') + len('</main>')
        doc = doc[:a] + body(doc[a:b], tr) + doc[b:]
    doc = ld(doc, tr, ld_post)
    if region == 'body': doc = home_data(doc, tr, data_post)
    return doc


def segments(doc, region='main'):
    """Ordered unique segments [{"t": text, "k": kind}] of a page."""
    seen, out = {}, []
    def col(t, k):
        if t not in seen:
            seen[t] = len(out); out.append({'t': t, 'k': k})
        return t
    process(doc, col, region)
    return out


def visible_text(doc, region='main'):
    if region == 'main':
        a = doc.find('<main'); b = doc.rfind('</main>'); doc = doc[a:b]
    else:
        a = doc.find('<body'); b = doc.rfind('</body>'); doc = doc[a:b]
    doc = re.sub(r'<script\b.*?</script>|<style\b.*?</style>|<svg\b.*?</svg>', ' ', doc, flags=re.S)
    return html.unescape(re.sub(r'<[^>]+>', ' ', doc))


CJK = {'ja', 'zh-hans', 'zh-hant', 'ko', 'th'}


def size(text, lang):
    """words for alphabetic languages; non-space characters for ja/zh/ko/th"""
    if lang in CJK: return len(re.sub(r'\s+', '', text))
    return len(text.split())
