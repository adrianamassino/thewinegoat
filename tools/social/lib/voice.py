#!/usr/bin/env python3
"""Voiceover + mix for The Wine Goat reels (batch 04+).

  python3 voice.py synth <jobs.json> <out.json>
      jobs.json: [{"id": "...", "text": "...", "voice": "bf_emma", "speed": 1.05}, ...]
      Each job is one sentence. Writes <cache>/<hash>.wav (24 kHz mono, leading/trailing silence trimmed) and
      out.json: {"<id>": {"wav": path, "dur": seconds}}. Results are cached by text + voice + speed.

  python3 voice.py mix <mix.json>
      mix.json: {"dur": s, "music": music.wav, "clips": [{"wav": path, "t": start_s}], "out": out.wav,
                 "voice_lufs": -16, "duck_db": 14, "bed_lufs": -22, "target_lufs": -15, "tp": -1.5}
      Builds the voice track, normalises it to voice_lufs (integrated, gated: silences between lines do not count),
      sets the music bed to bed_lufs when nobody speaks and ducks it (smooth volume automation driven by the voice
      envelope, 80 ms attack / 350 ms release, 120 ms look-ahead) so that under the voice it sits duck_db below the
      voice level. Gives the music a gentle presence dip (2-5 kHz) so words stay clear, sums, normalises the mix to
      target_lufs and applies a 4x-oversampled true-peak limiter at tp dBTP. Prints a JSON report.

Voices (Kokoro, kokoro-onnx; model files live OUTSIDE the repo, default /home/claude/tts-models, or $TWG_TTS_DIR):
  bf_emma (British female, en-gb) · af_heart (American female, en-us) · bm_george (British male, en-gb).
  The language is derived from the voice prefix (b* = en-gb, a* = en-us).
Pronunciation: SAY maps on-screen words to respellings for the TTS only (captions keep the real spelling).
"""
import hashlib
import json
import os
import re
import sys
import tempfile

import numpy as np
import soundfile as sf
from scipy.signal import butter, lfilter, resample_poly, bilinear

SR = 44100
TTS_DIR = os.environ.get('TWG_TTS_DIR', '/home/claude/tts-models')
CACHE = os.path.join(tempfile.gettempdir(), 'twg-tts-cache')
VOICES = {'bf_emma': 'en-gb', 'af_heart': 'en-us', 'bm_george': 'en-gb', 'bf_isabella': 'en-gb', 'am_michael': 'en-us'}

# On-screen spelling -> respelling for the TTS (case-insensitive, whole words). Keep the list short and tested.
SAY = {
    'Gevrey-Chambertin': 'Zhev-ray Shom-bair-tan', 'Chambertin': 'Shom-bair-tan', 'Bourgogne': 'Boor-goyn',
    'Premier Cru': 'prem-yay crew', 'Premiers Crus': 'prem-yay crew', 'Grand Cru': 'grahn crew', 'Grands Crus': 'grahn crew',
    'Sauternes': 'So-tairn', 'Eiswein': 'Ice-vine', 'Vendanges Tardives': 'Von-donzh Tar-deev', 'Botrytis': 'Bo-try-tiss',
    'daiginjō': 'dye-ghin-joe', 'daiginjo': 'dye-ghin-joe', 'ginjō': 'ghin-joe', 'ginjo': 'ghin-joe', 'junmai': 'joon-my',
    'honjōzō': 'hon-joe-zoh', 'honjozo': 'hon-joe-zoh', 'futsū-shu': 'foot-sue-shoo', 'nama': 'nah-mah',
    'tokkuri': 'toe-koo-ree', 'sake': 'sah-keh', 'sakes': 'sah-kehs', 'umami': 'oo-mah-mee', 'Alsace': 'Al-zass',
    'thewinegoat.com': 'the wine goat dot com', '°C': ' degrees', 'abv': 'A B V', 'vs': 'versus', '×': 'times',
}


def say(text):
    out = text
    for k in sorted(SAY, key=len, reverse=True):
        out = re.sub(r'(?<![\w-])' + re.escape(k) + r'(?![\w-])', SAY[k], out, flags=re.I) if k[0].isalnum() else out.replace(k, SAY[k])
    out = re.sub(r'(\d+)\s*–\s*(\d+)', r'\1 to \2', out)  # 6–13 -> 6 to 13
    return out


def trim(a, sr, thr_db=-45, pad=0.03):
    if not len(a):
        return a
    env = np.abs(a)
    thr = np.max(env) * 10 ** (thr_db / 20)
    idx = np.where(env > thr)[0]
    if not len(idx):
        return a
    s, e = max(0, idx[0] - int(pad * sr)), min(len(a), idx[-1] + int(pad * 2 * sr))
    out = a[s:e].copy()
    f = int(0.008 * sr)
    out[:f] *= np.linspace(0, 1, f); out[-f:] *= np.linspace(1, 0, f)
    return out


def synth(jobs_path, out_path):
    jobs = json.load(open(jobs_path))
    os.makedirs(CACHE, exist_ok=True)
    res, todo = {}, []
    for j in jobs:
        v = j.get('voice', 'bf_emma')
        if v not in VOICES:
            raise SystemExit(f'unknown voice {v}')
        spoken = say(j['text'])
        h = hashlib.sha1(f"{spoken}|{v}|{j.get('speed', 1.05)}".encode()).hexdigest()[:16]
        wav = os.path.join(CACHE, h + '.wav')
        res[j['id']] = {'wav': wav, 'spoken': spoken}
        if not os.path.exists(wav):
            todo.append((j, spoken, v, wav))
    if todo:
        from kokoro_onnx import Kokoro
        k = Kokoro(os.path.join(TTS_DIR, 'kokoro.onnx'), os.path.join(TTS_DIR, 'voices.bin'))
        for j, spoken, v, wav in todo:
            a, sr = k.create(spoken, voice=v, speed=j.get('speed', 1.05), lang=VOICES[v])
            sf.write(wav, trim(np.asarray(a, dtype=np.float32), sr), sr)
    for r in res.values():
        info = sf.info(r['wav'])
        r['dur'] = info.frames / info.samplerate
    json.dump(res, open(out_path, 'w'), indent=1)


# ---------------- loudness (ITU-R BS.1770-4 / EBU R128), numpy implementation ----------------
def _kfilter(sr):
    # pre-filter (high shelf) and RLB high-pass, designed for any sample rate (same maths as pyloudnorm)
    G, Q, fc = 3.99984385397, 0.7071752369554193, 1681.9744509555319
    A = 10 ** (G / 40); w0 = 2 * np.pi * fc / sr; alpha = np.sin(w0) / (2 * Q)
    b0 = A * ((A + 1) + (A - 1) * np.cos(w0) + 2 * np.sqrt(A) * alpha)
    b1 = -2 * A * ((A - 1) + (A + 1) * np.cos(w0))
    b2 = A * ((A + 1) + (A - 1) * np.cos(w0) - 2 * np.sqrt(A) * alpha)
    a0 = (A + 1) - (A - 1) * np.cos(w0) + 2 * np.sqrt(A) * alpha
    a1 = 2 * ((A - 1) - (A + 1) * np.cos(w0))
    a2 = (A + 1) - (A - 1) * np.cos(w0) - 2 * np.sqrt(A) * alpha
    shelf = (np.array([b0, b1, b2]) / a0, np.array([a0, a1, a2]) / a0)
    Q2, fc2 = 0.5003270373253953, 38.13547087613982
    w0 = 2 * np.pi * fc2 / sr; alpha = np.sin(w0) / (2 * Q2)
    a0 = 1 + alpha
    hp = (np.array([1.0, -2.0, 1.0]) / a0 * 1.0, np.array([a0, -2 * np.cos(w0), 1 - alpha]) / a0)
    # normalise the high-pass numerator to unity passband gain
    hp = (np.array([1.0, -2.0, 1.0]) * (1 + np.cos(w0)) / 2 / a0, hp[1])
    return shelf, hp


def _blocks(x, sr, win=0.4, step=0.1):
    x = np.atleast_2d(x)
    (b1, a1), (b2, a2) = _kfilter(sr)
    y = lfilter(b2, a2, lfilter(b1, a1, x, axis=1), axis=1)
    n, h = int(win * sr), int(step * sr)
    ms = []
    for i in range(0, max(1, y.shape[1] - n + 1), h):
        ms.append((y[:, i:i + n] ** 2).mean(axis=1).sum())
    return np.array(ms)


def lufs(x, sr=SR):
    ms = _blocks(x, sr)
    if not len(ms):
        return -70.0
    L = -0.691 + 10 * np.log10(ms + 1e-12)
    g = ms[L > -70]
    if not len(g):
        return -70.0
    rel = -0.691 + 10 * np.log10(g.mean()) - 10
    g2 = g[(-0.691 + 10 * np.log10(g + 1e-12)) > rel]
    return float(-0.691 + 10 * np.log10(g2.mean()))


def short_term(x, sr=SR):
    return -0.691 + 10 * np.log10(_blocks(x, sr, win=3.0, step=0.5) + 1e-12)


def true_peak_db(x):
    up = resample_poly(x, 4, 1, axis=1)
    return float(20 * np.log10(np.max(np.abs(up)) + 1e-12))


def limiter(x, ceiling_db=-1.5, look=0.005, release=0.08):
    thr = 10 ** (ceiling_db / 20)
    up = np.abs(resample_poly(x, 4, 1, axis=1)).max(axis=0).reshape(-1, 4).max(axis=1)[: x.shape[1]]
    need = np.minimum(1.0, thr / np.maximum(up, 1e-9))
    L = int(look * SR)
    # look-ahead: hold the minimum over the next L samples, then smooth with a fast attack / slow release
    from scipy.ndimage import minimum_filter1d
    g = minimum_filter1d(need, size=2 * L + 1, mode='nearest')
    a_rel = np.exp(-1 / (release * SR))
    out = np.empty_like(g); cur = 1.0
    for i, v in enumerate(g):
        cur = v if v < cur else v + (cur - v) * a_rel
        out[i] = cur
    return x * out


def env_follow(v, attack=0.08, release=0.35, look=0.12):
    a = np.abs(v)
    # 20 ms RMS
    n = int(0.02 * SR)
    r = np.sqrt(np.convolve(a ** 2, np.ones(n) / n, 'same'))
    thr = np.max(r) * 10 ** (-30 / 20)
    act = (r > thr).astype(float)
    sh = int(look * SR)
    act = np.concatenate([act[sh:], np.zeros(sh)])  # look-ahead: start ducking slightly before the word
    ca, cr = np.exp(-1 / (attack * SR)), np.exp(-1 / (release * SR))
    out = np.empty_like(act); cur = 0.0
    for i, v_ in enumerate(act):
        c = ca if v_ > cur else cr
        cur = v_ + (cur - v_) * c
        out[i] = cur
    return out


def mix(cfg_path):
    c = json.load(open(cfg_path))
    dur = float(c['dur']); N = int(round(dur * SR))
    voice = np.zeros(N)
    for cl in c['clips']:
        a, sr = sf.read(cl['wav'], dtype='float64')
        if a.ndim > 1:
            a = a.mean(axis=1)
        if sr != SR:
            g = np.gcd(SR, sr)
            a = resample_poly(a, SR // g, sr // g)
        i = int(round(cl['t'] * SR))
        a = a[: max(0, N - i)]
        voice[i:i + len(a)] += a
    # gentle voice EQ: high-pass 80 Hz
    b, a_ = butter(2, 80 / (SR / 2), 'high'); voice = lfilter(b, a_, voice)
    V = np.stack([voice, voice]) * 0.5
    vl = lufs(V)
    V *= 10 ** ((c.get('voice_lufs', -16) - vl) / 20)

    m, sr = sf.read(c['music'], dtype='float64')
    m = m.T if m.ndim > 1 else np.stack([m, m])
    if sr != SR:
        m = resample_poly(m, SR, sr, axis=1)
    m = m[:, :N] if m.shape[1] >= N else np.pad(m, ((0, 0), (0, N - m.shape[1])))
    # presence dip on the music (-4 dB around 2-5 kHz) so consonants stay clear
    b, a_ = butter(2, [2000 / (SR / 2), 5000 / (SR / 2)], 'band')
    m = m - 0.37 * lfilter(b, a_, m, axis=1)
    m *= 10 ** ((c.get('bed_lufs', -22) - lufs(m)) / 20)
    duck_total = c.get('voice_lufs', -16) - c.get('duck_db', 14)  # music level under the voice
    duck = c.get('bed_lufs', -22) - duck_total                     # dB of reduction while speaking
    e = env_follow(voice)
    gain = 10 ** (-duck * e / 20)
    md = m * gain
    # short fades: in (keeps frame 1 audible) and out (loop-friendly)
    fi, fo = int(0.03 * SR), int(c.get('fade_out', 0.6) * SR)
    md[:, :fi] *= np.linspace(0, 1, fi); md[:, -fo:] *= np.linspace(1, 0, fo)
    x = V + md
    # loudness target, then true-peak limiter, then re-check
    x *= 10 ** ((c.get('target_lufs', -15) - lufs(x)) / 20)
    x = limiter(x, c.get('tp', -1.5) - 0.3)
    x = np.clip(x, -0.999, 0.999)
    sf.write(c['out'], x.T, SR, subtype='PCM_16')
    speaking = e > 0.9
    under = lufs(md[:, speaking]) if speaking.sum() > SR else None
    bed = lufs(md[:, e < 0.05]) if (e < 0.05).sum() > SR else None
    st = short_term(x)
    rep = {'voice_lufs': round(lufs(V), 1), 'music_bed_lufs': round(bed, 1) if bed else None,
           'music_under_voice_lufs': round(under, 1) if under else None,
           'duck_db_measured': round(lufs(V) - under, 1) if under else None,
           'mix_lufs': round(lufs(x), 1), 'mix_true_peak_dbtp': round(true_peak_db(x), 2),
           'short_term_min_lufs': round(float(st.min()), 1), 'speech_ratio': round(float(speaking.mean()), 2)}
    print(json.dumps(rep))


if __name__ == '__main__':
    if sys.argv[1] == 'synth':
        synth(sys.argv[2], sys.argv[3])
    elif sys.argv[1] == 'mix':
        mix(sys.argv[2])
    elif sys.argv[1] == 'lufs':
        x, sr = sf.read(sys.argv[2]); print(round(lufs(x.T if x.ndim > 1 else x, sr), 2))
