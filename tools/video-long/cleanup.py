#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Disk housekeeping for the long videos (MP4s live outside the repo, in /home/claude/yt-out/<lang>/).

    python3 tools/video-long/cleanup.py --report                 # sizes per video and language + free disk
    python3 tools/video-long/cleanup.py --work                   # delete render work folders (frames, clips, wavs)
    python3 tools/video-long/cleanup.py --uploaded <video> [...]  # delete the MP4s of videos already uploaded
    python3 tools/video-long/cleanup.py --tts-cache              # delete cached narration clips (re-made on demand)
Thumbnails, .srt and meta stay in the repo; nothing under tools/ is ever deleted."""
import argparse
import glob
import os
import shutil

OUT = os.environ.get('TWG_YT_OUT', '/home/claude/yt-out')
WORK = os.environ.get('TWG_YT_WORK', '/home/claude/yt-work')
CACHE = os.environ.get('TWG_TTS_CACHE', '/home/claude/tts-cache/yt')


def free_gb():
    st = os.statvfs(OUT if os.path.exists(OUT) else '/')
    return st.f_bavail * st.f_frsize / 1e9


def report():
    rows = {}
    for p in glob.glob(os.path.join(OUT, '*', '*.mp4')):
        lang, vid = p.split('/')[-2], os.path.basename(p)[:-4]
        rows.setdefault(vid, {})[lang] = os.path.getsize(p)
    tot = 0
    for vid, d in sorted(rows.items()):
        s = sum(d.values())
        tot += s
        print(f'{vid}: {len(d)} languages, {s / 1e6:.0f} MB  (' + ', '.join(f'{l} {b / 1e6:.0f}' for l, b in sorted(d.items())) + ')')
    print(f'total MP4: {tot / 1e9:.2f} GB; free disk: {free_gb():.2f} GB')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--report', action='store_true')
    ap.add_argument('--work', action='store_true')
    ap.add_argument('--tts-cache', action='store_true')
    ap.add_argument('--uploaded', nargs='*', default=[])
    a = ap.parse_args()
    if a.work:
        for d in glob.glob(os.path.join(WORK, '*')):
            if os.path.isdir(d):
                shutil.rmtree(d, ignore_errors=True)
        print('work folders removed')
    if a.tts_cache:
        shutil.rmtree(CACHE, ignore_errors=True)
        print('TTS cache removed')
    for vid in a.uploaded:
        for p in glob.glob(os.path.join(OUT, '*', f'{vid}.mp4')):
            os.remove(p)
            print('removed', p)
    if a.report or not (a.work or a.tts_cache or a.uploaded):
        report()


if __name__ == '__main__':
    main()
