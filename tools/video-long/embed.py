#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Inserts the YouTube video of each language into its guide page(s): a lazy-loaded, responsive, privacy-enhanced
embed (youtube-nocookie, click-free iframe with loading="lazy") plus VideoObject JSON-LD. Idempotent: the block sits
between <!--twg-video:<video>--> markers and is replaced on every run.

    python3 tools/video-long/embed.py ids.json [--root /path/to/site-copy] [--upload-date 2027-01-15] [--dry-run]

ids.json = {"<video id>": {"<lang>": "<11-char YouTube id>", ...}, ...}
Pages come from embed_map.json (make_plan.py); titles, descriptions and durations from meta/<lang>/<video>.json.
Insertion point: before the first <section class="seosec"> of the article, else before its first <h2>."""
import argparse
import datetime
import html
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
YTID = re.compile(r'^[A-Za-z0-9_-]{11}$')
CSS = ('<style>.twg-video{margin:1.6em 0}.twg-video .tv-box{position:relative;aspect-ratio:16/9;border-radius:14px;'
       'overflow:hidden;background:#2c0917}.twg-video iframe{position:absolute;inset:0;width:100%;height:100%;border:0}'
       '.twg-video figcaption{font-size:.9em;opacity:.8;margin-top:.5em}</style>')


def iso_dur(s):
    s = int(round(s))
    return f'PT{s // 60}M{s % 60}S'


def block(video, lang, yid, meta, upload):
    t = html.escape(meta['title'], quote=True)
    first = meta['description'].split('\n\n')[0].strip()
    ld = {
        '@context': 'https://schema.org', '@type': 'VideoObject', 'name': meta['title'], 'description': first,
        'thumbnailUrl': [f'https://i.ytimg.com/vi/{yid}/maxresdefault.jpg', f'https://i.ytimg.com/vi/{yid}/hqdefault.jpg'],
        'uploadDate': upload, 'duration': iso_dur(meta['duration_s']), 'inLanguage': lang,
        'contentUrl': f'https://www.youtube.com/watch?v={yid}', 'embedUrl': f'https://www.youtube-nocookie.com/embed/{yid}',
        'publisher': {'@type': 'Organization', 'name': 'The Wine Goat', 'url': 'https://thewinegoat.com/'},
    }
    if meta.get('chapters'):
        ld['hasPart'] = [{'@type': 'Clip', 'name': c['title'], 'startOffset': int(c['t']),
                          'url': f'https://www.youtube.com/watch?v={yid}&t={int(c["t"])}'} for c in meta['chapters']]
    j = json.dumps(ld, ensure_ascii=False).replace('</', '<\\/')
    return (f'<!--twg-video:{video}-->{CSS}<figure class="twg-video"><div class="tv-box"><iframe loading="lazy" '
            f'src="https://www.youtube-nocookie.com/embed/{yid}?rel=0" title="{t}" '
            f'allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" '
            f'referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>'
            f'<figcaption>{t}</figcaption></figure>'
            f'<script type="application/ld+json">{j}</script><!--/twg-video:{video}-->')


def insert(page_html, video, blk):
    start, end = f'<!--twg-video:{video}-->', f'<!--/twg-video:{video}-->'
    if start in page_html:
        a = page_html.index(start)
        b = page_html.index(end, a) + len(end)
        return page_html[:a] + blk + page_html[b:]
    art = page_html.find('<article')
    if art < 0:
        art = page_html.find('<main')
    for pat in ('<section class="seosec"', '<h2'):
        i = page_html.find(pat, max(art, 0))
        if i >= 0:
            return page_html[:i] + blk + page_html[i:]
    raise ValueError('no insertion point')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('ids')
    ap.add_argument('--root', default=REPO, help='site root to modify (default: this repo)')
    ap.add_argument('--upload-date', default=datetime.date.today().isoformat())
    ap.add_argument('--dry-run', action='store_true')
    a = ap.parse_args()
    ids = json.load(open(a.ids, encoding='utf8'))
    emap = json.load(open(os.path.join(HERE, 'embed_map.json'), encoding='utf8'))['videos']
    n = 0
    for video, langs in ids.items():
        for lang, yid in langs.items():
            if not YTID.match(yid):
                sys.exit(f'bad YouTube id for {video}/{lang}: {yid}')
            meta = json.load(open(os.path.join(HERE, 'meta', lang, f'{video}.json'), encoding='utf8'))
            for page in emap[video][lang]['pages']:
                p = os.path.join(a.root, page.strip('/'), 'index.html')
                s = open(p, encoding='utf8').read()
                out = insert(s, video, block(video, lang, yid, meta, a.upload_date))
                if not a.dry_run:
                    with open(p, 'w', encoding='utf8') as f:
                        f.write(out)
                n += 1
                print(('would update ' if a.dry_run else 'updated ') + page)
    print(n, 'pages')


if __name__ == '__main__':
    main()
