# -*- coding: utf-8 -*-
"""Narration voices for the long YouTube videos (local, open-source TTS; nothing is sent anywhere).

Engines
  kokoro  : kokoro-onnx (en, es/es-ar, fr, it, pt-br, ja, zh-hans/zh-hant). ja/zh get their phonemes from misaki
            (pip install "misaki[ja,zh]") because espeak's Japanese/Mandarin phonemes are poor.
  piper   : piper-tts (pip) running the Piper VITS models published in github.com/k2-fsa/sherpa-onnx/releases (tag tts-models)
            (de, nl, pl, ru, el, tr, ar, pt).
  none    : no voice with a commercially usable licence found (ko, th) -> on-screen text + music only.

Model files are NOT in the repo. Default folder /home/claude/tts-models (override with $TWG_TTS_MODELS):
  kokoro.onnx, voices.bin, vits-piper-<name>/ ...
Synthesised clips are cached in $TWG_TTS_CACHE (default /home/claude/tts-cache/yt/<lang>/<sha1>.wav).
"""
import hashlib
import os
import re

import numpy as np
import soundfile as sf

MODELS = os.environ.get('TWG_TTS_MODELS', '/home/claude/tts-models')
CACHE = os.environ.get('TWG_TTS_CACHE', '/home/claude/tts-cache/yt')
SR = 24000  # every clip is resampled to this rate

# lang -> (engine, voice/model, engine language code, speed, human label for the report)
VOICES = {
    'en':      ('kokoro', 'bf_emma', 'en-gb', 1.05, 'Kokoro bf_emma (British English)'),
    'it':      ('kokoro', 'if_sara', 'it', 1.0, 'Kokoro if_sara'),
    'fr':      ('kokoro', 'ff_siwis', 'fr-fr', 1.0, 'Kokoro ff_siwis'),
    'es':      ('kokoro', 'ef_dora', 'es', 1.0, 'Kokoro ef_dora'),
    'es-ar':   ('kokoro', 'em_alex', 'es', 1.0, 'Kokoro em_alex (Spanish voice, Argentine text)'),
    'pt-br':   ('kokoro', 'pf_dora', 'pt-br', 1.0, 'Kokoro pf_dora (Brazilian)'),
    'ja':      ('kokoro', 'jf_alpha', 'ja', 1.0, 'Kokoro jf_alpha + misaki G2P'),
    'zh-hans': ('kokoro', 'zf_xiaoxiao', 'zh', 1.0, 'Kokoro zf_xiaoxiao + misaki G2P'),
    'zh-hant': ('kokoro', 'zf_xiaoxiao', 'zh', 1.0, 'Kokoro zf_xiaoxiao (Mandarin) reading Traditional text'),
    'de':      ('piper', 'vits-piper-de_DE-thorsten-high', None, 1.0, 'Piper de_DE thorsten-high (CC0)'),
    'nl':      ('piper', 'vits-piper-nl_NL-pim-medium', None, 1.0, 'Piper nl_NL pim-medium (CC0)'),
    'pl':      ('piper', 'vits-piper-pl_PL-gosia-medium', None, 1.0, 'Piper pl_PL gosia-medium (CC0)'),
    'ru':      ('piper', 'vits-piper-ru_RU-dmitri-medium', None, 1.0, 'Piper ru_RU dmitri-medium (CC0)'),
    'el':      ('piper', 'vits-piper-el_GR-rapunzelina-low', None, 1.0, 'Piper el_GR rapunzelina-low (CC0)'),
    'tr':      ('piper', 'vits-piper-tr_TR-fahrettin-medium', None, 1.0, 'Piper tr_TR fahrettin-medium (CC0)'),
    'ar':      ('piper', 'vits-piper-ar_JO-kareem-medium', None, 1.0, 'Piper ar_JO kareem-medium'),
    'pt':      ('piper', 'vits-piper-pt_PT-tugao-medium', None, 1.0, 'Piper pt_PT tugao-medium (CC0, European)'),
    'ko':      ('none', None, None, 1.0, 'no voice (text + music)'),
    'th':      ('none', None, None, 1.0, 'no voice (text + music)'),
}

# spoken forms: things the voices mispronounce, replaced only in the audio (never on screen)
SAY = {
    '*': [(r'(?<![A-Za-z])WSET(?![A-Za-z])', 'W S E T'), (r'(?<![A-Za-z])SAT(?![A-Za-z])', 'S A T'),
          (r'\bPass\b', 'Pass'), (r'–|—', ', ')],
    'en': [(r'thewinegoat\.com', 'the wine goat dot com')],
    'it': [(r'W S E T', 'doppia vu, esse, e, ti'), (r'thewinegoat\.com', 'the wine goat punto com')],
    'fr': [(r'thewinegoat\.com', 'the wine goat point com'), (r'W S E T', 'double vé, esse, e, té')],
    'es': [(r'W S E T', 'uve doble, ese, e, te'), (r'thewinegoat\.com', 'the wine goat punto com')],
    'es-ar': [(r'W S E T', 'doble ve, ese, e, te'), (r'thewinegoat\.com', 'the wine goat punto com')],
    'pt': [(r'W S E T', 'dâblio, ésse, é, tê'), (r'thewinegoat\.com', 'the wine goat ponto com')],
    'pt-br': [(r'W S E T', 'dáblio, ésse, ê, tê'), (r'thewinegoat\.com', 'the wine goat ponto com')],
    'de': [(r'W S E T', 'We, Es, E, Te'), (r'thewinegoat\.com', 'the wine goat punkt com')],
    'nl': [(r'W S E T', 'wee, es, ee, tee'), (r'thewinegoat\.com', 'the wine goat punt com')],
    'pl': [(r'W S E T', 'wu, es, e, te'), (r'thewinegoat\.com', 'the wine goat kropka com')],
    'ru': [(r'thewinegoat\.com', 'зе вайн гоут точка ком'), (r'W S E T', 'дабл-ю эс и ти')],
    'el': [(r'thewinegoat\.com', 'δε γουάιν γκόουτ τελεία κομ'), (r'W S E T', 'ντάμπλιου ες ι τι')],
    'tr': [(r'W S E T', 'dabılyu, es, i, ti'), (r'thewinegoat\.com', 'the wine goat nokta com')],
    'ar': [(r'thewinegoat\.com', 'ذا واين غوت دوت كوم'), (r'W S E T', 'دبليو إس إي تي')],
    'ja': [(r'thewinegoat\.com', 'ザ・ワイン・ゴート・ドット・コム'), (r'W S E T', 'ダブリュー・エス・イー・ティー')],
    'zh-hans': [(r'thewinegoat\.com', '我们的网站'), (r'W S E T', '达布溜艾斯伊提')],
    'zh-hant': [(r'thewinegoat\.com', '我們的網站'), (r'W S E T', '達布溜艾斯伊提')],
}

_engines = {}


def spoken(lang, text):
    t = re.sub(r'\*\*|__', '', text)
    for pat, rep in SAY['*']:
        t = re.sub(pat, rep, t)
    for pat, rep in SAY.get(lang, []):
        t = re.sub(pat, rep, t)
    return t.strip()


def has_voice(lang):
    return VOICES[lang][0] != 'none'


def label(lang):
    return VOICES[lang][4]


def _kokoro():
    if 'kokoro' not in _engines:
        from kokoro_onnx import Kokoro
        _engines['kokoro'] = Kokoro(os.path.join(MODELS, 'kokoro.onnx'), os.path.join(MODELS, 'voices.bin'))
    return _engines['kokoro']


def _g2p(kind):
    key = 'g2p-' + kind
    if key not in _engines:
        if kind == 'ja':
            from misaki import ja
            _engines[key] = ja.JAG2P()
        else:
            from misaki import zh
            _engines[key] = zh.ZHG2P()
    return _engines[key]


def _piper(name):
    """piper-tts (pip install piper-tts): espeak-ng phonemes (+ tashkeel diacritics for Arabic)."""
    if name not in _engines:
        from piper import PiperVoice
        d = os.path.join(MODELS, name)
        onnx = [f for f in os.listdir(d) if f.endswith('.onnx')][0]
        _engines[name] = PiperVoice.load(os.path.join(d, onnx))
    return _engines[name]


def _piper_say(name, text, speed):
    from piper import SynthesisConfig
    v = _piper(name)
    cfg = SynthesisConfig(length_scale=1.0 / speed, noise_scale=0.6, noise_w_scale=0.7)
    chunks = [c.audio_float_array for c in v.synthesize(text, syn_config=cfg)]
    return np.concatenate(chunks).astype(np.float32), v.config.sample_rate


def _resample(x, sr):
    if sr == SR:
        return x.astype(np.float32)
    from scipy.signal import resample_poly
    from math import gcd
    g = gcd(SR, sr)
    return resample_poly(x, SR // g, sr // g).astype(np.float32)


def _split_sentences(lang, text):
    if lang in ('ja', 'zh-hans', 'zh-hant'):
        parts = re.split(r'(?<=[。！？])', text)
    elif lang == 'th':
        parts = [text]
    else:
        parts = re.split(r'(?<=[.!?;؟])\s+', text)
    return [p.strip() for p in parts if p.strip()]


def synth(lang, text):
    """-> float32 mono array at SR (sentence pauses included, no leading/trailing silence)."""
    eng, voice, code, speed, _ = VOICES[lang]
    if eng == 'none':
        return None
    t = spoken(lang, text)
    h = hashlib.sha1(f'{eng}|{voice}|{speed}|{t}'.encode()).hexdigest()[:16]
    cp = os.path.join(CACHE, lang, h + '.wav')
    if os.path.exists(cp):
        a, _ = sf.read(cp, dtype='float32')
        return a
    out = []
    for s in _split_sentences(lang, t):
        if eng == 'kokoro':
            K = _kokoro()
            if code in ('ja', 'zh'):
                ph = _g2p(code)(s)
                ph = ph[0] if isinstance(ph, tuple) else ph
                a, sr = K.create(ph, voice=voice, speed=speed, lang=code if code != 'zh' else 'cmn', is_phonemes=True)
            else:
                a, sr = K.create(s, voice=voice, speed=speed, lang=code)
        else:
            a, sr = _piper_say(voice, s, speed)
        a = _resample(a, sr)
        a = _trim(a)
        out.append(a)
        out.append(np.zeros(int(SR * 0.32), np.float32))
    a = np.concatenate(out[:-1]) if out else np.zeros(1, np.float32)
    pk = np.max(np.abs(a)) or 1.0
    a = (a / pk * 0.89).astype(np.float32)
    os.makedirs(os.path.dirname(cp), exist_ok=True)
    sf.write(cp, a, SR)
    return a


def _trim(a, thr=0.01):
    idx = np.where(np.abs(a) > thr * (np.max(np.abs(a)) or 1))[0]
    if not len(idx):
        return a
    s, e = max(0, idx[0] - int(SR * 0.02)), min(len(a), idx[-1] + int(SR * 0.06))
    return a[s:e]
