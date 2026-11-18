# -*- coding: utf-8 -*-
"""Records podcast lessons with Kokoro (local, open-source TTS) — one mp3 per lesson and language, plus <id>.json with the
duration and the start time of each paragraph (the app highlights the text as it plays).
Model files (kokoro-v1.0.onnx, voices-v1.0.bin from github.com/thewh1teagle/kokoro-onnx releases) are NOT in the repo:
pass their folder with --models. Skips lessons already recorded. Usage:
  python3 tools/media/tts.py s1 --models /path/to/models [--langs it,fr,en]"""
import json, os, sys, subprocess, tempfile, argparse
import numpy as np, soundfile as sf
ap = argparse.ArgumentParser(); ap.add_argument('lv'); ap.add_argument('--models', required=True); ap.add_argument('--langs', default='it,fr,en'); a = ap.parse_args()
from kokoro_onnx import Kokoro
K = Kokoro(os.path.join(a.models, 'kokoro.onnx'), os.path.join(a.models, 'voices.bin'))
VO = {'it': ('if_sara', 'it'), 'fr': ('ff_siwis', 'fr-fr'), 'en': ('bf_emma', 'en-gb')}
DIR = {'l1': 'app/l1/', 'l2': 'app/l2/'}.get(a.lv, f'app/spirits/{a.lv}/')
for lg in a.langs.split(','):
    T = json.load(open(f'{DIR}podtext/{lg}.json', encoding='utf8')); os.makedirs(f'{DIR}pods/{lg}', exist_ok=True)
    v, code = VO[lg]
    for pid, X in T.items():
        out = f'{DIR}pods/{lg}/{pid}'
        if os.path.exists(out + '.mp3') and os.path.exists(out + '.json'): continue
        parts, starts, t, sr = [], [], 0.0, 24000
        for para in X['p']:
            audio, sr = K.create(para, voice=v, speed=1.0, lang=code)
            starts.append(round(t + 0.35, 3)); pad = np.zeros(int(sr * 0.35), dtype=audio.dtype)
            parts += [pad, audio]; t += 0.35 + len(audio) / sr
        parts.append(np.zeros(int(sr * 0.8), dtype=parts[-1].dtype)); wav = np.concatenate(parts)
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as f: sf.write(f.name, wav, sr); tmp = f.name
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', tmp, '-codec:a', 'libmp3lame', '-b:a', '56k', '-ac', '1', out + '.mp3'], check=True); os.unlink(tmp)
        json.dump({'d': round(len(wav) / sr, 2), 'T': starts}, open(out + '.json', 'w'))
        print(lg, pid, round(len(wav) / sr), 's', flush=True)
