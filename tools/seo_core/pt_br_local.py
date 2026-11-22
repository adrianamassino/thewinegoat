# -*- coding: utf-8 -*-
"""Local (Brazil) content of the pt-br core pages (tools/seo_core/build.py applies it to the pt-br content on every
build, after content/pt-br.json + pt-br_x.json are loaded). Same format as tools/seo_core/es_ar_local.py (LOCAL[key]:
title, desc, h1, tldr, lead, replace_first, replace, before, faq_drop, faq_first), applied by its apply() function.
Rules: no prices, no school names, no WSET affiliation; exam facts as on the level guides; what each programme includes
(or not) from Brazil and South America was checked on the WSET specifications."""
import es_ar_local

LOCAL = {}


def apply(C):
    return es_ar_local.apply(C, LOCAL, 'pt-br')
