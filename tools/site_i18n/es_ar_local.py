# -*- coding: utf-8 -*-
"""Local (Argentina / Uruguay) content of the /es-ar/ guides.

The es-ar guides are derived from the Spanish (/es/) pages (voseo rules, es_ar_extra.py). On top of that, a page that has
a file tools/site_i18n/es-ar-local/<group>.txt gets its own title, H1, introduction, sections and FAQ, written for
readers in Argentina and Uruguay. tools/site_i18n/build.py applies the file on every build of the page, so the local
text survives rebuilds; meta descriptions stay in tools/seo_tech/regional_meta.json.

File format: directives start with "@@" at the beginning of a line; the lines that follow are the directive's body.
  @@title New <title> (also og:title / twitter:title)
  @@h1 New H1
  @@lead                 body = new text of the introduction paragraph (<p class="lead">)
  @@replace Heading      body replaces the section whose <h2> (or sub-section whose <h3>) is "Heading" (heading included,
                         as on the es-ar page)
  @@before Heading       body is inserted before the section "Heading" (new sections)
  @@after Heading        body is inserted after the section "Heading"
  @@faq Question         body = answer; local questions come first in the FAQ (and in the FAQPage structured data)
  @@faqdrop Question     removes a question of the Spanish page
  @@sub                  body = "old text" / line "==>" / "new text": literal replacement inside <main>
Body mark-up (one block per paragraph, blocks separated by an empty line):
  ## Heading (h2)   ### Heading (h3)   - bullet   1. numbered   > tip box   | table | row |  (first row = header)
  ? question / ( ) wrong option / (x) right option / ! explanation      → interactive practice question
  **bold**, [text](/es-ar/url/); a block that starts with "<" is raw HTML.
A heading that is not found stops the build of that page with an error (the Spanish page changed: update the file).
New <h2> get data-arlocal so that tools/seo_tech/place_photos.py keeps counting the headings of the base page."""
import os, re, json, html

D = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'es-ar-local')
e = html.escape
SHOW = 'Ver la respuesta'


def groups():
    return sorted(f[:-4] for f in os.listdir(D) if f.endswith('.txt')) if os.path.isdir(D) else []


def parse(text):
    ops, cur = [], None
    for line in text.split('\n'):
        if line.startswith('@@'):
            name, _, arg = line[2:].partition(' ')
            cur = [name.strip(), arg.strip(), []]; ops.append(cur)
        elif cur is not None:
            cur[2].append(line)
    return [(n, a, '\n'.join(b).strip()) for n, a, b in ops]


def inline(t):
    t = e(t, quote=False)
    t = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', t)
    return re.sub(r'\[([^\]]+)\]\(([^)\s]+)\)', r'<a href="\2">\1</a>', t)


def render(body, mark_first=True):
    """mini mark-up → HTML. Every h2 is flagged data-arlocal, except the first one when mark_first is False."""
    out, qs, first = [], [], [not mark_first]

    def flush_q():
        if not qs: return
        s = '<div class="sqs">'
        for n, (q, opts, why) in enumerate(qs, 1):
            ok = next(o for o, good in opts if good)
            s += (f'<article class="sq"><h3><span class="sqn">{n}</span> {inline(q)}</h3><ol class="sq-os" type="A">'
                  + ''.join(f'<li><button type="button" class="sq-o" data-ok="{1 if good else 0}">{inline(o)}</button></li>' for o, good in opts)
                  + f'</ol><details class="sq-a"><summary>{SHOW}</summary><p><strong>{inline(ok)}</strong> — {inline(why)}</p></details></article>')
        out.append(s + '</div>'); qs.clear()

    for blk in re.split(r'\n\s*\n', body.strip()):
        blk = blk.strip()
        if not blk: continue
        L = blk.split('\n')
        if blk.startswith('? '):
            q = L[0][2:].strip(); opts = []; why = ''
            for x in L[1:]:
                x = x.strip()
                if x.startswith('(x)'): opts.append((x[3:].strip(), True))
                elif x.startswith('( )'): opts.append((x[3:].strip(), False))
                elif x.startswith('!'): why = x[1:].strip()
                else: raise ValueError('question line: ' + x)
            if sum(g for _, g in opts) != 1 or len(opts) != 4 or not why: raise ValueError('question needs 4 options, 1 right, 1 explanation: ' + q)
            qs.append((q, opts, why)); continue
        flush_q()
        if blk.startswith('<'): out.append(blk)
        elif blk.startswith('## '):
            if first[0]: out.append(f'<h2>{inline(blk[3:])}</h2>'); first[0] = False
            else: out.append(f'<h2 data-arlocal>{inline(blk[3:])}</h2>')
        elif blk.startswith('### '): out.append(f'<h3>{inline(blk[4:])}</h3>')
        elif all(x.startswith('- ') for x in L): out.append('<ul class="tips">' + ''.join(f'<li>{inline(x[2:])}</li>' for x in L) + '</ul>')
        elif all(re.match(r'\d+\. ', x) for x in L): out.append('<ol class="tips">' + ''.join(f'<li>{inline(x.split(". ", 1)[1])}</li>' for x in L) + '</ol>')
        elif blk.startswith('> '): out.append(f'<p class="tipbox">{inline(" ".join(x.lstrip("> ") for x in L))}</p>')
        elif blk.startswith('|'):
            rows = [[c.strip() for c in x.strip().strip('|').split('|')] for x in L]
            head = rows[0]
            t = '<div class="tblw"><table class="lvtab"><thead><tr>' + ''.join(f'<th>{inline(h)}</th>' for h in head) + '</tr></thead><tbody>'
            for r in rows[1:]:
                t += '<tr>' + ''.join(f'<th scope="row">{inline(c)}</th>' if i == 0 else f'<td data-l="{e(head[i] if i < len(head) else "", quote=True)}">{inline(c)}</td>' for i, c in enumerate(r)) + '</tr>'
            out.append(t + '</tbody></table></div>')
        else: out.append(f'<p>{inline(" ".join(L))}</p>')
    flush_q()
    return ''.join(out)


def sections(htm):
    """split rendered HTML at each h2 and wrap every part in a section"""
    parts = re.split(r'(?=<h2\b)', htm)
    return ''.join(f'<section class="seosec more arlocal">{p}</section>' for p in parts if p.strip())


def _h2(doc, heading):
    want = re.sub(r'\s+', ' ', heading).strip()
    for m in re.finditer(r'<h([23])\b[^>]*>(.*?)</h\1>', doc, re.S):
        if re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', '', m.group(2)))).strip() == want: return m
    raise KeyError(f'heading not found: «{heading}»')


OPEN = re.compile(r'(?:<!--more-->)?<section\b[^>]*>\s*$')


def _bounds(doc, m):
    """(start, end, own): start of the block of this h2 (its <section> when the h2 opens one), end of its content,
    own = the h2 has a <section> of its own"""
    if m.group(1) == '3':   # a sub-section: from its h3 to the next heading or the end of the section
        nx = re.search(r'<h[23]\b|</section>|<!--', doc[m.end():])
        return m.start(), m.end() + nx.start() if nx else len(doc), False
    mo = OPEN.search(doc[:m.start()])
    start = mo.start() if mo else m.start()
    nx = re.search(r'<h2\b', doc[m.end():])
    stop = doc.find('</article>', m.end())
    j = m.end() + nx.start() if nx else (stop if stop >= 0 else len(doc))
    mo2 = OPEN.search(doc[:j]) if nx else None
    e2 = mo2.start() if mo2 else j
    k = doc.find('</section>', m.end())
    if mo and 0 <= k < e2: return start, k + len('</section>'), True
    return m.start(), e2, False


def _set_faq_ld(doc, add, drop):
    def rep(mm):
        try: J = json.loads(mm.group(2))
        except Exception: return mm.group(0)
        for n in (J.get('@graph') if isinstance(J, dict) and '@graph' in J else [J]):
            if isinstance(n, dict) and n.get('@type') == 'FAQPage':
                old = [q for q in n.get('mainEntity', []) if not any(q.get('name', '').startswith(d) for d in drop)]
                n['mainEntity'] = [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in add] + old
        return mm.group(1) + json.dumps(J, ensure_ascii=False) + mm.group(3)
    return re.sub(r'(<script type="application/ld\+json">)(.*?)(</script>)', rep, doc, flags=re.S)


def plain(t):
    return html.unescape(re.sub(r'<[^>]+>', '', t))


def apply(group, doc):
    p = os.path.join(D, group + '.txt')
    if not os.path.exists(p): return doc
    faq_add, faq_drop = [], []
    for name, arg, body in parse(open(p, encoding='utf8').read()):
        if name == 'title':
            doc = re.sub(r'<title>.*?</title>', lambda m: f'<title>{e(arg, quote=False)}</title>', doc, count=1, flags=re.S)
            for prop in ('og:title', 'twitter:title'):
                doc = re.sub(r'(<meta (?:property|name)="%s" content=")[^"]*(")' % prop, lambda m: m.group(1) + e(arg, quote=True) + m.group(2), doc)
        elif name == 'h1':
            doc = re.sub(r'(<h1\b[^>]*>).*?(</h1>)', lambda m: m.group(1) + inline(arg) + m.group(2), doc, count=1, flags=re.S)
        elif name == 'lead':
            doc, n = re.subn(r'(<p class="lead">).*?(</p>)', lambda m: m.group(1) + inline(' '.join(body.split('\n'))) + m.group(2), doc, count=1, flags=re.S)
            if not n: raise KeyError('no <p class="lead">')
        elif name == 'replace':
            m = _h2(doc, arg); s, x, own = _bounds(doc, m)
            new = render(body, mark_first=False)
            if own: doc = doc[:m.start()] + new + doc[x - len('</section>'):]
            else: doc = doc[:m.start()] + new + doc[x:]
        elif name in ('before', 'after'):
            m = _h2(doc, arg); s, x, own = _bounds(doc, m)
            new = render(body)
            at = s if name == 'before' else x
            # inside a long section the new part stays in that section; next to a section of its own it gets its own
            inside = not own and doc.rfind('<section', 0, at) > doc.rfind('</section>', 0, at)
            doc = doc[:at] + (new if inside else sections(new)) + doc[at:]
        elif name == 'faq':
            faq_add.append((arg, ' '.join(body.split('\n'))))
        elif name == 'faqdrop':
            doc, n = re.subn(r'<details class="faqi"><summary>' + re.escape(e(arg, quote=False)) + r'.*?</details>', '', doc, count=1, flags=re.S)
            if not n: raise KeyError(f'FAQ not found: «{arg}»')
            faq_drop.append(arg)
        elif name == 'sub':
            old, sep, new = body.partition('\n==>\n')
            if not sep or old.strip() not in doc: raise KeyError(f'text not found: «{old.strip()[:70]}»')
            doc = doc.replace(old.strip(), new.strip())
        else:
            raise ValueError(f'unknown directive @@{name}')
    if faq_add or faq_drop:
        items = ''.join(f'<details class="faqi"><summary>{inline(q)}</summary><p>{inline(a)}</p></details>' for q, a in faq_add)
        doc, n = re.subn(r'(<details class="faqi">)', lambda m: items + m.group(1), doc, count=1)
        if not n: raise KeyError('no FAQ on the page')
        doc = _set_faq_ld(doc, [(plain(inline(q)), plain(inline(a))) for q, a in faq_add], faq_drop)
    return doc
