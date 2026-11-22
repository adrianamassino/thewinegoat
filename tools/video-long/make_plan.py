#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Builds plan.json (one video per guide page, in priority order) and embed_map.json (video + lang -> guide page)
from the hreflang alternates of the English guide pages. Re-run after new guide pages are added:
    python3 tools/video-long/make_plan.py
Pages that are not guides (about, faq, legal, tools, account pages) are skipped."""
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
LANGS = ['en', 'it', 'fr', 'es', 'es-ar', 'pt', 'pt-br', 'de', 'nl', 'pl', 'ru', 'el', 'tr', 'ar', 'ja', 'ko',
         'zh-hans', 'zh-hant', 'th']
HL = {'es-AR': 'es-ar', 'pt-BR': 'pt-br', 'zh-Hans': 'zh-hans', 'zh-Hant': 'zh-hant'}
SKIP = {'about', 'admin', 'app', 'delete-account', 'faq', 'how-it-works', 'photo-credits', 'schools', 'en',
        'scratchpad', 'social', 'supabase', 'tools', 'mobile', 'img', 'fonts', 'assets'}

# (priority 1 = make first, proposed English title, music mood). Search value for exam students first.
P = {
    'wset-level-2-grapes-and-regions': (1, 'WSET Level 2: the key grapes and where they grow', 'wine'),
    'wset-systematic-approach-to-tasting': (1, 'How to pass the WSET Level 3 blind tasting (SAT)', 'sake'),
    'wset-diploma-level-4': (1, 'WSET Diploma: how the units work and how to plan your study', 'spirits'),
    'wset-level-3-practice-questions': (2, 'WSET Level 3 practice questions, explained', 'wine'),
    'wset-level-2-practice-questions': (2, 'WSET Level 2 practice questions, explained', 'beer'),
    'wset-level-3-mock-exam': (2, 'WSET Level 3 mock exam: 10 questions with answers', 'spirits'),
    'wset-level-3': (2, 'WSET Level 3 in Wines: exam, syllabus and grapes', 'wine'),
    'wset-level-2': (2, 'WSET Level 2 in Wines: exam format and what to learn', 'beer'),
    'how-to-pass-wset-level-3': (2, 'How to pass WSET Level 3 first time: study plan', 'sake'),
    'how-to-pass-wset-level-2': (2, 'How to pass WSET Level 2: a 3-week study plan', 'wine'),
    'wset-level-3-short-answer-questions': (2, 'WSET Level 3 short answer questions: how to score', 'spirits'),
    'wset-level-3-grape-varieties': (2, 'WSET Level 3 grape varieties: key grapes and styles', 'wine'),
    'wset-level-3-exam-format': (2, 'WSET Level 3 exam format explained', 'sake'),
    'wset-level-1': (3, 'WSET Level 1 in Wines: what the exam covers', 'beer'),
    'wset-level-1-study-guide': (3, 'WSET Level 1 study guide in one video', 'wine'),
    'wset-level-1-practice-questions': (3, 'WSET Level 1 practice questions with answers', 'beer'),
    'wset-mock-exams': (3, 'WSET mock exams: how to use practice tests', 'spirits'),
    'wset-practice-questions': (3, 'WSET practice questions: how to practise well', 'wine'),
    'wset-diploma-study-tips': (3, 'WSET Diploma study tips: theory, D3 and tasting', 'sake'),
    'wset-level-2-vs-level-3': (3, 'WSET Level 2 vs Level 3: which one should you take?', 'beer'),
    'wset-level-3-flashcards': (3, 'WSET Level 3 flashcards: grapes, regions, key terms', 'wine'),
    'wset-3-questions-by-region': (3, 'WSET Level 3 questions by region', 'spirits'),
    'wset-levels-explained': (3, 'WSET levels explained: Level 1 to Diploma', 'wine'),
    'wset-spirits-level-1': (4, 'WSET Spirits Level 1: exam and syllabus', 'spirits'),
    'wset-spirits-level-2': (4, 'WSET Spirits Level 2: exam and study plan', 'spirits'),
    'wset-spirits-level-3': (4, 'WSET Spirits Level 3: exam and blind tasting', 'spirits'),
    'wset-spirits-practice-questions': (4, 'WSET Spirits practice questions, explained', 'spirits'),
    'how-spirits-are-made-pot-still-column-still': (4, 'How spirits are made: pot still vs column still', 'spirits'),
    'spirits-categories-cheat-sheet': (4, 'Types of spirits: the exam cheat sheet', 'spirits'),
    'wset-spirits': (4, 'WSET Spirits courses compared', 'spirits'),
    'wset-flashcards': (4, 'WSET flashcards: how to use them', 'wine'),
    'wset-study-planner': (4, 'Plan your WSET exam preparation', 'sake'),
    'wset-exam-preparation': (4, 'WSET exam preparation: how to get ready', 'wine'),
    'wset-wine': (4, 'WSET wine exams: Levels 1, 2 and 3', 'wine'),
    'is-wset-worth-it': (5, 'Is WSET worth it? Levels 1 to 4', 'beer'),
    'wset-vs-court-of-master-sommeliers': (5, 'WSET vs Court of Master Sommeliers', 'spirits'),
    'classic-cocktail-families': (5, 'Classic cocktail families: sours, highballs and more', 'spirits'),
    'wine-maps': (5, 'Learn the wine regions with maps', 'wine'),
    'wine-level-test': (5, 'What is your wine level? A 10-minute test', 'beer'),
}
REGION_T = {  # wset-3-questions/<topic>: priority 3 (region revision has high exam value)
    'alsace-loire': 'Alsace and Loire', 'australia-new-zealand': 'Australia and New Zealand',
    'austria-hungary': 'Austria and Hungary', 'bordeaux': 'Bordeaux', 'burgundy-beaujolais': 'Burgundy and Beaujolais',
    'chile-argentina': 'Chile and Argentina', 'climate-and-environment': 'Climate and environment',
    'food-and-wine-pairing': 'Food and wine pairing', 'germany': 'Germany', 'greece': 'Greece', 'italy': 'Italy',
    'port-fortified-wines': 'Port and fortified wines', 'portugal': 'Portugal',
    'red-and-rose-winemaking': 'Red and rosé winemaking', 'rhone': 'Rhône', 'sherry': 'Sherry',
    'south-africa': 'South Africa', 'southern-france': 'Southern France', 'spain': 'Spain',
    'sparkling-wines-champagne': 'Sparkling wines and Champagne', 'storage-and-service': 'Storage and service',
    'tasting-sat': 'Tasting (SAT)', 'usa-canada': 'USA and Canada', 'vine-and-grape-varieties': 'The vine and grape varieties',
    'vineyard-management': 'Vineyard management', 'white-winemaking': 'White winemaking',
    'wine-business-and-pricing': 'The wine business', 'winemaking': 'Winemaking'}
REGION_PRI = {'bordeaux': 3, 'burgundy-beaujolais': 3, 'italy': 3, 'spain': 3, 'germany': 3, 'rhone': 3,
              'sparkling-wines-champagne': 3, 'port-fortified-wines': 3, 'sherry': 3, 'tasting-sat': 3}

# Videos that cover more than one guide page: the extra pages get the same embed.
EXTRA = {'wset-systematic-approach-to-tasting': ['how-to-pass-wset-level-3'],
         'wset-diploma-level-4': ['wset-diploma-study-tips']}


def alternates(slug):
    p = os.path.join(REPO, slug, 'index.html')
    with open(p, encoding='utf8') as f:
        s = f.read()
    out = {}
    for hl, href in re.findall(r'<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"', s):
        lg = HL.get(hl, hl)
        if lg in LANGS:
            path = re.sub(r'^https://thewinegoat\.com', '', href)
            if os.path.exists(os.path.join(REPO, path.strip('/'), 'index.html')):
                out.setdefault(lg, path)
    out.setdefault('en', f'/{slug}/')
    return out


def main():
    slugs = []
    for d in sorted(os.listdir(REPO)):
        if d in SKIP or d in LANGS or d.startswith('.') or not os.path.isdir(os.path.join(REPO, d)):
            continue
        if os.path.exists(os.path.join(REPO, d, 'index.html')):
            slugs.append(d)
    for d in sorted(os.listdir(os.path.join(REPO, 'wset-3-questions'))):
        if os.path.exists(os.path.join(REPO, 'wset-3-questions', d, 'index.html')):
            slugs.append(f'wset-3-questions/{d}')
    plan = []
    for s in slugs:
        if s in P:
            pri, title, mood = P[s]
        elif s.startswith('wset-3-questions/'):
            k = s.split('/')[1]
            pri, title, mood = REGION_PRI.get(k, 4), f'WSET Level 3 questions: {REGION_T.get(k, k)}', 'wine'
        else:
            print('not planned (not a guide?):', s)
            continue
        alt = alternates(s)
        plan.append({'video': s.replace('/', '--'), 'guide': s, 'priority': pri, 'title_en': title, 'music': mood,
                     'pages': alt, 'missing_langs': [l for l in LANGS if l not in alt],
                     'status': 'scripted' if os.path.exists(os.path.join(HERE, 'videos', s.replace('/', '--'), 'video.json')) else 'todo'})
    order = list(P)
    plan.sort(key=lambda x: (x['priority'], order.index(x['guide']) if x['guide'] in order else 999, x['guide']))
    with open(os.path.join(HERE, 'plan.json'), 'w', encoding='utf8') as f:
        json.dump({'_doc': 'One long video per guide page, in priority order (1 = first). pages = per-language guide page '
                           'paths (from hreflang). Build with build.py <video> all. Generated by make_plan.py.',
                   'videos': plan}, f, ensure_ascii=False, indent=1)
    em = {'_doc': 'video + lang -> guide page(s) where the YouTube embed goes (embed.py). Generated by make_plan.py.',
          'videos': {}}
    for v in plan:
        e = {}
        for lg in LANGS:
            pages = [v['pages'][lg]] if lg in v['pages'] else []
            for x in EXTRA.get(v['guide'], []):
                a = alternates(x)
                if lg in a:
                    pages.append(a[lg])
            if pages:
                e[lg] = {'page': pages[0], 'pages': pages}
        em['videos'][v['video']] = e
    with open(os.path.join(HERE, 'embed_map.json'), 'w', encoding='utf8') as f:
        json.dump(em, f, ensure_ascii=False, indent=1)
    print(len(plan), 'videos planned;', sum(1 for v in plan if v['priority'] <= 2), 'priority 1-2')


if __name__ == '__main__':
    main()
