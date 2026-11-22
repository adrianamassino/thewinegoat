# -*- coding: utf-8 -*-
"""Local (Brazil) content of the /pt-br/ guides.

The pt-br guides are built from tools/site_i18n/pt-br/<group>.json, a Brazilian rewrite of the same English segments as
the European Portuguese (/pt/) pages, so the two read alike. A page that has a file tools/site_i18n/pt-br-local/<group>.txt
gets on top of that its own title, H1, introduction, sections and FAQ, written for readers in Brazil. build.py applies
the file on every build of the page, so the local text survives rebuilds; meta descriptions stay in
tools/seo_tech/regional_meta.json.

The file format and the mark-up are those of the Argentine layer (es_ar_local.py, same directives: @@title @@h1 @@lead
@@replace @@before @@after @@faq @@faqdrop @@faqreset @@sub); this module only points it at pt-br-local/ and gives the
Portuguese labels. Rules: no prices of The Wine Goat, no school names, no WSET affiliation, exam facts as on the English
level guides; what each programme includes (or not) from Brazil and South America was checked on the WSET specifications."""
import os, re, json
import es_ar_local as _base

D = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'pt-br-local')


def groups():
    return sorted(f[:-4] for f in os.listdir(D) if f.endswith('.txt')) if os.path.isdir(D) else []


def apply(group, doc):
    if not os.path.exists(os.path.join(D, group + '.txt')): return doc
    old = _base.D, _base.SHOW, _base.FAQ_H
    _base.D, _base.SHOW, _base.FAQ_H = D, 'Ver a resposta', 'Perguntas frequentes'
    try: doc = _base.apply(group, doc)
    finally: _base.D, _base.SHOW, _base.FAQ_H = old
    # owner's rule: the grades stay in English (Pass, Merit, Distinction), also in text inherited from the base page
    doc = re.sub(r'(?<![\wÀ-ÿ])Mérito(?![\wÀ-ÿ])', 'Merit', doc)
    doc = re.sub(r'(?<![\wÀ-ÿ])Distinção(?![\wÀ-ÿ])', 'Distinction', doc)
    # the Article headline of the structured data follows the local H1
    h = re.search(r'<h1\b[^>]*>(.*?)</h1>', doc, re.S)
    if h:
        t = json.dumps(_base.plain(h.group(1)).strip(), ensure_ascii=False)
        doc = re.sub(r'("@type": "Article", (?:"@id": "[^"]*", )?"headline": )"(?:[^"\\]|\\.)*"', lambda m: m.group(1) + t, doc, count=1)
    return doc
