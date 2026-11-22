#!/usr/bin/env python3
"""Voiceover for the localised Instagram reels (build.js --lang=xx).

  python3 tools/social/i18n/voice.py tts <lang> [batch-03]   # speak every scene line, write i18n/<lang>/voice-<batch>.json
  NODE_PATH=$(npm root -g) node tools/social/build.js batch-03 --lang=<lang> --only=reels   # x264 veryfast (batch.preset)
  python3 tools/social/i18n/voice.py mix <lang> [batch-03]   # lay the voice over each reel's music, ducked

Order matters: `tts` first (scene lengths are stretched to fit the spoken lines, see load.js), then render, then `mix`.
The spoken line of a scene is its burned-in caption (or T.voice[...] in the language table).

Voices (neural, no plain espeak): Kokoro-82M (kokoro-onnx) for it / fr / es / es-ar / pt-br; Piper VITS voices run with
sherpa-onnx 1.12.x for de / ru / pl / nl (k2-fsa/sherpa-onnx GitHub release "tts-models"; sherpa-onnx 2.x has
no espeak-ng frontend for Piper models: pip install "sherpa-onnx==1.12.40"). Models are NOT in the repo:
TTS_MODELS (default /home/claude/tts-models) must hold kokoro.onnx + voices.bin and the vits-piper-* folders.
Clips are cached in TTS_CACHE (default /home/claude/tts-cache), keyed by voice + text.

Mix: voice normalised to -16 LUFS, music (a different style per reel from lib/music.py) under it at about -27 LUFS, side-chain ducked while the voice speaks,
final master -16 LUFS integrated / -1.5 dBTP; the video stream is copied, only the audio track is replaced.
"""
import hashlib, json, os, subprocess, sys, tempfile
import numpy as np
import soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
MODELS = os.environ.get('TTS_MODELS', '/home/claude/tts-models')
CACHE = os.environ.get('TTS_CACHE', '/home/claude/tts-cache')
FFMPEG = '/usr/local/bin/ffmpeg' if os.path.exists('/usr/local/bin/ffmpeg') else 'ffmpeg'

# engine, voice/model, espeak language (Kokoro), speed
VOICES = {
    'it': ('kokoro', 'if_sara', 'it', 1.05),
    'fr': ('kokoro', 'ff_siwis', 'fr-fr', 1.05),
    'es': ('kokoro', 'ef_dora', 'es', 1.05),
    'es-ar': ('kokoro', 'em_alex', 'es', 1.05),
    'pt-br': ('kokoro', 'pf_dora', 'pt-br', 1.05),
    'de': ('piper', 'de_DE-thorsten-high', None, 1.0),
    'ru': ('piper', 'ru_RU-irina-medium', None, 1.0),
    'pl': ('piper', 'pl_PL-gosia-medium', None, 1.0),
    'nl': ('piper', 'nl_NL-pim-medium', None, 1.0),
}
LEAD = 0.25  # voice starts this long after the scene starts (the title punches in first)

_eng = {}

def engine(lang):
    kind, voice, elang, speed = VOICES[lang]
    if lang in _eng:
        return _eng[lang]
    if kind == 'kokoro':
        from kokoro_onnx import Kokoro
        k = Kokoro(os.path.join(MODELS, 'kokoro.onnx'), os.path.join(MODELS, 'voices.bin'))
        def say(text):
            a, sr = k.create(text, voice=voice, speed=speed, lang=elang)
            return np.asarray(a, dtype=np.float32), sr
    else:
        import sherpa_onnx
        d = os.path.join(MODELS, f'vits-piper-{voice}')
        cfg = sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(
            vits=sherpa_onnx.OfflineTtsVitsModelConfig(model=os.path.join(d, f'{voice}.onnx'), tokens=os.path.join(d, 'tokens.txt'),
                                                       data_dir=os.path.join(d, 'espeak-ng-data'), length_scale=1.0 / speed),
            num_threads=4), max_num_sentences=1)
        t = sherpa_onnx.OfflineTts(cfg)
        def say(text):
            g = t.generate(text, sid=0, speed=1.0)
            return np.asarray(g.samples, dtype=np.float32), g.sample_rate
    _eng[lang] = say
    return say

def trim(a, sr, thr=0.01):
    idx = np.where(np.abs(a) > thr)[0]
    if not len(idx):
        return a
    s, e = max(0, idx[0] - int(0.02 * sr)), min(len(a), idx[-1] + int(0.08 * sr))
    return a[s:e]

def clip_path(lang, text):
    kind, voice, _, speed = VOICES[lang]
    h = hashlib.sha1(f'{voice}|{speed}|{text}'.encode()).hexdigest()[:16]
    return os.path.join(CACHE, lang, f'{h}.wav')

def dump(lang, batch, no_voice):
    env = dict(os.environ, NODE_PATH=subprocess.check_output(['npm', 'root', '-g'], text=True).strip())
    if no_voice:
        env['SOCIAL_NO_VOICE'] = '1'
    out = subprocess.check_output(['node', os.path.join(HERE, 'dump-voice.js'), lang, batch], env=env, cwd=ROOT, text=True)
    return json.loads(out)

def tts(lang, batch):
    data = dump(lang, batch, True)
    os.makedirs(os.path.join(CACHE, lang), exist_ok=True)
    res = {'voice': ' '.join(str(x) for x in VOICES[lang][:2]), 'lead': LEAD, 'reels': {}}
    for r in data['reels']:
        durs, texts = [], []
        for s in r['scenes']:
            p = clip_path(lang, s['text'])
            if not os.path.exists(p):
                a, sr = engine(lang)(s['text'])
                a = trim(a, sr)
                sf.write(p, a, sr)
            info = sf.info(p)
            durs.append(round(LEAD + info.frames / info.samplerate, 2))
            texts.append(s['text'])
        res['reels'][r['id']] = {'durations': durs, 'texts': texts}
        print(lang, r['id'], ' '.join(f'{d:.1f}' for d in durs))
    with open(os.path.join(HERE, lang, f'voice-{batch}.json'), 'w') as f:
        json.dump(res, f, ensure_ascii=False, indent=1)

def lufs_gain_filter(path, target):
    err = subprocess.run([FFMPEG, '-hide_banner', '-i', path, '-af', f'loudnorm=I={target}:TP=-2:LRA=11:print_format=json', '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    j = json.loads(err[err.rfind('{'):err.rfind('}') + 1])
    return (f"loudnorm=I={target}:TP=-2:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}"
            f":measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true")

def mix(lang, batch):
    data = dump(lang, batch, False)
    for r in data['reels']:
        mp4 = os.path.join(ROOT, data['out'], 'reels', f"{r['id']}.mp4")
        dur = r['dur']
        with tempfile.TemporaryDirectory() as td:
            sr = 44100
            track = np.zeros(int((dur + 0.5) * sr), dtype=np.float32)
            for s in r['scenes']:
                a, csr = sf.read(clip_path(lang, s['text']), dtype='float32')
                if csr != sr:  # resample with ffmpeg-free linear interpolation (speech, upsampling only)
                    x = np.linspace(0, len(a) - 1, int(len(a) * sr / csr))
                    a = np.interp(x, np.arange(len(a)), a).astype(np.float32)
                o = int((s['start'] + LEAD) * sr)
                n = min(len(a), len(track) - o)
                track[o:o + n] += a[:n]
            vraw = os.path.join(td, 'voice-raw.wav')
            sf.write(vraw, track[:int(dur * sr)], sr)
            voice = os.path.join(td, 'voice.wav')
            subprocess.check_call([FFMPEG, '-y', '-loglevel', 'error', '-i', vraw, '-af', f"highpass=f=80,{lufs_gain_filter(vraw, -16)}", '-ar', str(sr), '-ac', '2', voice])
            # the music-only track of the freshly rendered reel is kept in the cache, so `mix` can be re-run safely
            music = os.path.join(CACHE, lang, 'music', f"{r['id']}.wav")
            os.makedirs(os.path.dirname(music), exist_ok=True)
            tag = subprocess.run([FFMPEG, '-hide_banner', '-i', mp4], capture_output=True, text=True).stderr
            if 'twg-voice' not in tag:
                subprocess.check_call([FFMPEG, '-y', '-loglevel', 'error', '-i', mp4, '-vn', '-ar', str(sr), '-ac', '2', music])
            fc = (f"[1:a]{lufs_gain_filter(music, -27)}[m];[0:a]asplit=2[v][sc];"
                  "[m][sc]sidechaincompress=threshold=0.02:ratio=6:attack=30:release=450:makeup=1[md];"
                  "[v][md]amix=inputs=2:duration=first:normalize=0[mx]")
            pre = os.path.join(td, 'premix.wav')
            subprocess.check_call([FFMPEG, '-y', '-loglevel', 'error', '-i', voice, '-i', music, '-filter_complex', fc, '-map', '[mx]', '-ar', str(sr), pre])
            final = os.path.join(td, 'final.wav')
            subprocess.check_call([FFMPEG, '-y', '-loglevel', 'error', '-i', pre, '-af', lufs_gain_filter(pre, -16).replace('TP=-2', 'TP=-1.5'), '-ar', str(sr), final])
            tmp = os.path.join(td, 'out.mp4')
            subprocess.check_call([FFMPEG, '-y', '-loglevel', 'error', '-i', mp4, '-i', final, '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
                                   '-c:a', 'aac', '-b:a', '128k', '-ar', str(sr), '-ac', '2', '-t', str(dur), '-metadata', 'comment=twg-voice', '-movflags', '+faststart', tmp])
            os.replace(tmp, mp4)
        mb = os.path.getsize(mp4) / 1048576
        print(lang, r['id'], f'{dur:.1f}s', f'{mb:.1f} MB', 'OVER 9.5 MB' if mb > 9.5 else '')

if __name__ == '__main__':
    cmd, lang = sys.argv[1], sys.argv[2]
    batch = sys.argv[3] if len(sys.argv) > 3 else 'batch-03'
    {'tts': tts, 'mix': mix}[cmd](lang, batch)
