#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""The Wine Goat — long-form YouTube study videos (1920x1080, 30 fps, H.264 + AAC).

One video = videos/<id>/video.json (language-neutral structure: scene kinds, photos, maps, goats, music mood)
          + videos/<id>/<lang>.json (everything that is read or seen in that language: on-screen text, narration
            beats, YouTube title/description/tags, map labels).
UI words shared by every video are in i18n/<lang>.json.

Render one video in one language (narration -> slides -> per-scene clips -> concat -> music + loudness):
    python3 tools/video-long/build.py <id> <lang>            # e.g. wset-level-2-grapes-and-regions en
    python3 tools/video-long/build.py <id> all               # every language that has a script
    python3 tools/video-long/build.py <id> en --frames 3,9   # only draw some beats to check the layout
Outputs: /home/claude/yt-out/<lang>/<id>.mp4 (+ .srt and thumbnail copy; MP4s are never committed)
         tools/video-long/meta/<lang>/<id>.json (YouTube title, description with chapters, tags; + .srt)
         tools/video-long/thumbs/<lang>/<id>.jpg (1280x720)
Needs: ffmpeg, node + playwright, kokoro-onnx, piper-tts, misaki[ja,zh] (see lib/tts.py), fonts in $TWG_FONTS
(default /home/claude/yt-fonts: Fraunces, DM Sans, Noto Serif/Sans, Noto Naskh/Sans Arabic, Noto Sans Thai — OFL,
downloaded from github.com/google/fonts).
"""
import argparse
import json
import math
import os
import re
import shutil
import subprocess
import sys
import time

import numpy as np
import soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(HERE, 'lib'))
import tts  # noqa: E402

OUT = os.environ.get('TWG_YT_OUT', '/home/claude/yt-out')
WORK = os.environ.get('TWG_YT_WORK', '/home/claude/yt-work')
FONTS = os.environ.get('TWG_FONTS', '/home/claude/yt-fonts')
MUSIC_PY = os.path.join(REPO, 'tools', 'social', 'lib', 'music.py')  # used as is (not modified)
LANGS = ['en', 'it', 'fr', 'es', 'es-ar', 'pt', 'pt-br', 'de', 'nl', 'pl', 'ru', 'el', 'tr', 'ar', 'ja', 'ko',
         'zh-hans', 'zh-hant', 'th']
FPS = 30
XF_BEAT, XF_SCENE = 0.35, 0.5
NODE_PATH = subprocess.run(['npm', 'root', '-g'], capture_output=True, text=True).stdout.strip()


def jload(p):
    with open(p, encoding='utf8') as f:
        return json.load(f)


def jsave(p, d):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w', encoding='utf8') as f:
        json.dump(d, f, ensure_ascii=False, indent=1)
        f.write('\n')


def fr(x):  # round a duration up to whole frames
    return math.ceil(x * FPS - 1e-6) / FPS


def ts(t, srt=False):
    t = max(0, t)
    h, m, s = int(t // 3600), int(t % 3600 // 60), t % 60
    if srt:
        return f'{h:02d}:{m:02d}:{int(s):02d},{int(round((s - int(s)) * 1000)) % 1000:03d}'
    return f'{h}:{m:02d}:{int(s):02d}' if h else f'{m}:{int(s):02d}'


def plain(s):
    return re.sub(r'\*\*|\*|__', '', s or '').replace('\n', ' ')


def run(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True, **kw)
    if r.returncode:
        sys.stderr.write(r.stderr[-3000:])
        raise SystemExit(f'command failed: {cmd[:6]}')
    return r


# ---------------------------------------------------------------- data helpers
def photo_meta():
    meta = {p['file'].split('/')[-1][:-5]: p for p in jload(os.path.join(REPO, 'img/photos/meta.json'))}
    i18n = jload(os.path.join(REPO, 'img/photos/meta_i18n.json'))
    return meta, i18n


def maps_js():
    """The app's own vector maps (MAPS, MGEO in app/index.html) extracted to a work file for the slide page."""
    out = os.path.join(WORK, 'maps.js')
    src = os.path.join(REPO, 'app/index.html')
    if os.path.exists(out) and os.path.getmtime(out) > os.path.getmtime(src):
        return out
    os.makedirs(WORK, exist_ok=True)
    with open(src, encoding='utf8') as f:
        lines = [l for l in f if l.startswith('const MAPS=') or l.startswith('const MGEO=')]
    with open(out, 'w', encoding='utf8') as f:
        for l in lines:
            f.write(l.replace('const MAPS=', 'window.MAPS=', 1).replace('const MGEO=', 'window.MGEO=', 1))
    return out


def page_html():
    p = os.path.join(WORK, 'slide.html')
    with open(os.path.join(HERE, 'templates/slide.html'), encoding='utf8') as f:
        s = f.read()
    s = s.replace('FONTDIR', 'file://' + FONTS).replace('MAPSJS', 'file://' + maps_js()).replace('ROOTDIR', 'file://' + REPO)
    with open(p, 'w', encoding='utf8') as f:
        f.write(s)
    return p


def lang_path(lang):
    return '/' if lang == 'en' else f'/{lang}/'


def guide_path(video, lang):
    m = jload(os.path.join(HERE, 'embed_map.json'))
    e = m['videos'].get(video, {}).get(lang)
    return e['page'] if e else None


# ---------------------------------------------------------------- build
class Build:
    def __init__(self, vid, lang, frames_only=None):
        self.vid, self.lang = vid, lang
        self.V = jload(os.path.join(HERE, 'videos', vid, 'video.json'))
        self.L = jload(os.path.join(HERE, 'videos', vid, f'{lang}.json'))
        self.U = jload(os.path.join(HERE, 'i18n', f'{lang}.json'))
        self.voice = tts.has_voice(lang)
        self.frames_only = frames_only
        self.wd = os.path.join(WORK, vid, lang)
        os.makedirs(self.wd, exist_ok=True)
        self.pm, self.pi = photo_meta()

    # credits ----------------------------------------------------
    def credit(self, stem):
        p = self.pm[stem]
        return f"{self.U['photo']}: {p['author']} · {p['licence']} · Wikimedia Commons"

    def photos_used(self):
        seen = []
        for s in self.V['scenes']:
            for st in [s.get('photo')]:
                if st and st not in seen:
                    seen.append(st)
        th = self.V.get('thumb', {}).get('photo')
        if th and th not in seen:
            seen.append(th)
        return seen

    # scenes -----------------------------------------------------
    def scenes(self):
        out = []
        for S in self.V['scenes']:
            T = self.L['scenes'].get(S['id'])
            if T is None:
                raise SystemExit(f'{self.lang}: scene {S["id"]} missing')
            spec = {k: v for k, v in S.items()}
            spec.update({k: v for k, v in T.items() if k not in ('say', 'map_title')})
            if 'map' in S:
                spec['map'] = dict(S['map'])
                if T.get('map_title'):
                    spec['map']['title'] = T['map_title']
            if S['kind'] == 'grape':
                spec['chip'] = self.U[S.get('colour', 'white')]
            if S['kind'] == 'chapter':
                spec.setdefault('theme', 'dark')
            if S['kind'] == 'end':
                spec.setdefault('theme', 'dark')
                spec['url'] = 'thewinegoat.com' + lang_path(self.lang)
                spec.setdefault('cta', self.U['cta_button'])
                spec['note'] = self.U['disclaimer']
            if S['kind'] != 'chapter' and S['kind'] != 'end' and S['kind'] != 'title':
                spec['tag'] = self.L.get('tag', '')
            say = T.get('say') or ['']
            out.append((spec, say))
        return out

    def beat_audio(self, text):
        if not self.voice or not text.strip() or self.frames_only is not None:
            return None  # frames-only previews skip the narration
        return tts.synth(self.lang, text)

    def reading_time(self, text):
        n = len(plain(text))
        cps = {'ko': 7.5, 'ja': 7.5, 'zh-hans': 6.0, 'zh-hant': 6.0, 'th': 13.0}.get(self.lang, 15.0)
        return max(3.2, n / cps + 1.2)

    def plan(self):
        """-> list of scenes, each with beats [{spec, audio, len, lead, speech}] and the timeline."""
        sc = self.scenes()
        plan, t = [], 0.0
        for si, (spec, say) in enumerate(sc):
            beats = []
            for bi, text in enumerate(say):
                lead = 0.4 if bi == 0 else 0.12
                a = self.beat_audio(text)
                if a is not None:
                    speech = len(a) / tts.SR
                elif text.strip():
                    speech = self.reading_time(text)
                else:
                    speech = 1.6
                tail = 0.4 if bi < len(say) - 1 else 0.7
                if spec['kind'] in ('chapter', 'title', 'end') and bi == len(say) - 1:
                    tail += 0.5
                if spec['kind'] == 'quiz' and bi == 0:
                    tail += 1.6  # thinking pause before the answer
                L = fr(lead + speech + tail)
                beats.append({'text': text, 'audio': a, 'lead': lead, 'speech': speech, 'len': L, 'start': t})
                t += L
            plan.append({'spec': spec, 'beats': beats, 'start': plan[-1]['end'] if plan else 0.0, 'end': t})
        self.total = t
        return plan

    # frames -----------------------------------------------------
    def frame_jobs(self, plan):
        jobs = []
        photos = {st: {'credit': self.credit(st)} for st in self.photos_used()}
        for si, sc in enumerate(plan):
            for bi, b in enumerate(sc['beats']):
                spec = dict(sc['spec'])
                spec.update({'lang': self.lang, 'accent': self.V.get('accent', '#a3264f'), 'step': bi,
                             'photos': photos, 'labels': {**self.L.get('labels', {}), **sc['spec'].get('labels', {})},
                             'progress': b['start'] / self.total})
                if not self.voice and b['text'].strip():
                    spec['caption'] = plain(b['text'])
                    spec['cap'] = True
                jobs.append({'spec': spec, 'out': os.path.join(self.wd, f's{si:03d}_{bi:02d}.jpg')})
        return jobs

    def draw(self, jobs):
        jp = os.path.join(self.wd, 'jobs.json')
        jsave(jp, {'page': page_html(), 'jobs': jobs})
        r = run(['node', os.path.join(HERE, 'lib/frames.js'), jp], env={**os.environ, 'NODE_PATH': NODE_PATH})
        if 'OVERFLOW' in r.stdout:
            print(r.stdout.strip())
        return r.stdout

    # video ------------------------------------------------------
    def encode_scene(self, si, sc, prev_img):
        out = os.path.join(self.wd, f'v{si:03d}.mp4')
        tmp = out[:-4] + '.part.mp4'
        imgs = []
        if prev_img:
            imgs.append((prev_img, XF_SCENE))
        n = len(sc['beats'])
        for bi, b in enumerate(sc['beats']):
            d = b['len']
            if prev_img and bi == 0:
                d = b['len'] + (XF_BEAT if n > 1 else 0)
            elif bi < n - 1:
                d = b['len'] + XF_BEAT
            imgs.append((os.path.join(self.wd, f's{si:03d}_{bi:02d}.jpg'), d))
        cmd = ['ffmpeg', '-y', '-loglevel', 'error']
        for p, _ in imgs:
            cmd += ['-framerate', str(FPS), '-i', p]
        fc, last = [], None
        for k, (p, d) in enumerate(imgs):
            fc.append(f'[{k}:v]format=yuv420p,loop=-1:1:0,trim=duration={d:.4f},setpts=N/{FPS}/TB,fps={FPS}[i{k}]')
        acc = 'i0'
        L = imgs[0][1]
        for k in range(1, len(imgs)):
            X = XF_SCENE if (prev_img and k == 1) else XF_BEAT
            off = max(0.0, L - X)
            fc.append(f'[{acc}][i{k}]xfade=transition=fade:duration={X}:offset={off:.4f}[x{k}]')
            acc = f'x{k}'
            L = off + imgs[k][1]
        cmd += ['-filter_complex', ';'.join(fc), '-map', f'[{acc}]', '-t', f'{sc["end"] - sc["start"]:.4f}',
                '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-tune', 'stillimage', '-pix_fmt', 'yuv420p',
                '-r', str(FPS), '-g', '150', '-an', tmp]
        run(cmd)
        os.replace(tmp, out)
        return out

    def audio(self, plan):
        sr = tts.SR
        n = int(round(self.total * sr)) + sr
        voice = np.zeros(n, np.float32)
        for sc in plan:
            for b in sc['beats']:
                if b['audio'] is not None:
                    i = int(round((b['start'] + b['lead']) * sr))
                    voice[i:i + len(b['audio'])] += b['audio']
        voice = voice[:int(round(self.total * sr))]
        vp = os.path.join(self.wd, 'voice.wav')
        sf.write(vp, voice, sr)
        mp = os.path.join(self.wd, 'music.wav')
        marks = ','.join(f'{sc["start"]:.2f}' for sc in plan if sc['spec']['kind'] in ('chapter', 'end'))
        run([sys.executable, MUSIC_PY, self.V.get('music', 'wine'), f'{self.total + 1:.2f}', mp, marks])
        mix = os.path.join(self.wd, 'mix.wav')
        fade_out = max(0, self.total - 3)
        if self.voice:
            # music quiet, ducked further under the voice (sidechain), then two-pass loudness to -16 LUFS
            fc = (f'[1:a]aresample=48000,volume=0.16,afade=t=in:d=2,afade=t=out:st={fade_out:.2f}:d=3[m];'
                  f'[0:a]aresample=48000,asplit=2[v][sc];[m][sc]sidechaincompress=threshold=0.015:ratio=6:attack=30:release=450[md];'
                  f'[v][md]amix=inputs=2:normalize=0:duration=first[a]')
            target = -16
        else:
            fc = (f'[1:a]aresample=48000,volume=0.5,afade=t=in:d=2,afade=t=out:st={fade_out:.2f}:d=3[m];'
                  f'[0:a]aresample=48000[v];[v][m]amix=inputs=2:normalize=0:duration=first[a]')
            target = -18
        run(['ffmpeg', '-y', '-loglevel', 'error', '-i', vp, '-i', mp, '-filter_complex', fc, '-map', '[a]', '-ac', '2', mix])
        r = run(['ffmpeg', '-hide_banner', '-i', mix, '-af', f'loudnorm=I={target}:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'])
        m = json.loads(r.stderr[r.stderr.rindex('{'):r.stderr.rindex('}') + 1])
        fin = os.path.join(self.wd, 'final.wav')
        run(['ffmpeg', '-y', '-loglevel', 'error', '-i', mix, '-af',
             f"loudnorm=I={target}:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
             f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true",
             '-ar', '48000', fin])
        return fin

    # subtitles / meta -------------------------------------------
    def srt(self, plan):
        cues = []
        for sc in plan:
            for b in sc['beats']:
                text = plain(b['text']).strip()
                if not text:
                    continue
                parts = [p for p in re.split(r'(?<=[.!?。！？؟])\s*', text) if p.strip()]
                t0, dur = b['start'] + b['lead'], b['speech']
                tot = sum(len(p) for p in parts) or 1
                for p in parts:
                    d = dur * len(p) / tot
                    cues.append((t0, t0 + d, p.strip()))
                    t0 += d
        lines = []
        for i, (a, b, t) in enumerate(cues, 1):
            lines += [str(i), f'{ts(a, True)} --> {ts(b, True)}', t, '']
        return '\n'.join(lines)

    def meta(self, plan, mp4, thumb):
        chapters = [(0.0, self.U['intro'])]
        for sc in plan:
            if sc['spec']['kind'] == 'chapter':
                chapters.append((sc['start'], plain(sc['spec']['title'])))
            if sc['spec']['kind'] == 'end':
                chapters.append((sc['start'], self.U['outro']))
        site = 'https://thewinegoat.com' + lang_path(self.lang)
        gp = guide_path(self.vid, self.lang)
        d = [self.L['yt_desc'].strip(), '',
             f"{self.U['cta_line']} {site}"]
        if gp:
            d.append(f"{self.U['guide_line']} https://thewinegoat.com{gp}")
        d += ['', self.U['chapters'] + ':'] + [f'{ts(t)} {c}' for t, c in chapters]
        ph = self.photos_used()
        if ph:
            d += ['', self.U['photo_credits'] + ':']
            for st in ph:
                p = self.pm[st]
                alt = self.pi.get(st, {}).get(self.lang, {}).get('alt') or p['alt']
                d.append(f"- {alt}. {self.U['photo']}: {p['author']}, {p['licence']} ({p['licence_url']}), Wikimedia Commons: {p['source']}")
        d += ['', self.U['music_line'], '', self.U['disclaimer'], '', ' '.join(self.L.get('hashtags', []))]
        desc = '\n'.join(d).strip() + '\n'
        title = self.L['yt_title']
        assert len(title) <= 70, f'title too long ({len(title)}): {title}'
        assert len(desc) <= 5000, 'description too long'
        return {
            'video': self.vid, 'lang': self.lang, 'title': title, 'description': desc,
            'tags': self.L['tags'], 'chapters': [{'t': round(t, 2), 'title': c} for t, c in chapters],
            'duration_s': round(self.total, 2), 'voice': tts.label(self.lang) if self.voice else None,
            'default_language': self.lang, 'cta_url': site, 'guide_url': f'https://thewinegoat.com{gp}' if gp else None,
            'file': mp4, 'size_bytes': os.path.getsize(mp4) if os.path.exists(mp4) else None,
            'thumbnail': os.path.relpath(thumb, REPO), 'srt': f'tools/video-long/meta/{self.lang}/{self.vid}.srt',
            'category': 'Education', 'made_for_kids': False,
        }

    def thumbnail(self):
        T = self.V.get('thumb', {})
        spec = {'kind': 'thumb', 'lang': self.lang, 'theme': 'dark', 'accent': self.V.get('accent'),
                'photo': T.get('photo'), 'goat': T.get('goat'), 'goatCss': T.get('goatCss'), **self.L['thumb']}
        out = os.path.join(HERE, 'thumbs', self.lang, f'{self.vid}.jpg')
        os.makedirs(os.path.dirname(out), exist_ok=True)
        self.draw([{'spec': spec, 'out': out, 'w': 1280, 'h': 720}])
        assert os.path.getsize(out) < 2 * 1024 * 1024
        return out

    # main -------------------------------------------------------
    def run(self):
        t0 = time.time()
        plan = self.plan()
        jobs = self.frame_jobs(plan)
        if self.frames_only is not None:
            sel = [jobs[i] for i in self.frames_only if i < len(jobs)]
            self.draw(sel)
            print('frames:', ' '.join(j['out'] for j in sel), f'| total {self.total:.1f}s')
            return
        self.draw(jobs)
        clips, prev = [], None
        for si, sc in enumerate(plan):
            clips.append(self.encode_scene(si, sc, prev))
            prev = os.path.join(self.wd, f's{si:03d}_{len(sc["beats"]) - 1:02d}.jpg')
        lst = os.path.join(self.wd, 'list.txt')
        with open(lst, 'w') as f:
            f.writelines(f"file '{c}'\n" for c in clips)
        vonly = os.path.join(self.wd, 'video.mp4')
        run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', vonly])
        aud = self.audio(plan)
        od = os.path.join(OUT, self.lang)
        os.makedirs(od, exist_ok=True)
        mp4 = os.path.join(od, f'{self.vid}.mp4')
        tmp = mp4[:-4] + '.part.mp4'
        run(['ffmpeg', '-y', '-loglevel', 'error', '-i', vonly, '-i', aud, '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
             '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', '-shortest', tmp])
        os.replace(tmp, mp4)
        thumb = self.thumbnail()
        shutil.copy(thumb, os.path.join(od, f'{self.vid}.jpg'))
        srt = self.srt(plan)
        if srt.strip():
            for p in (os.path.join(od, f'{self.vid}.srt'), os.path.join(HERE, 'meta', self.lang, f'{self.vid}.srt')):
                os.makedirs(os.path.dirname(p), exist_ok=True)
                with open(p, 'w', encoding='utf8') as f:
                    f.write(srt)
        M = self.meta(plan, mp4, thumb)
        jsave(os.path.join(HERE, 'meta', self.lang, f'{self.vid}.json'), M)
        shutil.rmtree(self.wd, ignore_errors=True)
        print(f'{self.vid} {self.lang}: {self.total / 60:.2f} min, {M["size_bytes"] / 1e6:.1f} MB, '
              f'voice={M["voice"]}, built in {time.time() - t0:.0f}s -> {mp4}', flush=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('video')
    ap.add_argument('lang')
    ap.add_argument('--frames', help='comma-separated beat indexes to draw (no video)')
    ap.add_argument('--skip-done', action='store_true', help='skip languages whose MP4 already exists')
    a = ap.parse_args()
    langs = LANGS if a.lang == 'all' else a.lang.split(',')
    langs = [l for l in langs if os.path.exists(os.path.join(HERE, 'videos', a.video, f'{l}.json'))]
    fo = [int(x) for x in a.frames.split(',')] if a.frames else None
    for l in langs:
        if a.skip_done and os.path.exists(os.path.join(OUT, l, f'{a.video}.mp4')):
            continue
        Build(a.video, l, fo).run()


if __name__ == '__main__':
    main()
