#!/usr/bin/env python3
"""Original background music for The Wine Goat reels, synthesised from scratch (numpy/scipy, no samples,
no third-party recordings: every note is generated here, so we own it outright).

Usage: python3 music.py <style|mood> <duration_s> <out.wav> [scene_start_times_comma_separated]
       python3 music.py --list   (prints the style library)
Styles (batch 04+, see STYLES below): lofi, bossa, pop, folk, synthwave, swing, house, cinematic, ukulele, funk.
Legacy moods (batches 01-03):
Moods (one per course):
  wine    warm/elegant  - soft felt piano + string pad, 80 BPM, D major (I-vi-IV-V)
  beer    upbeat        - plucked acoustic guitar (Karplus-Strong) + light kick/shaker, 104 BPM, G major (I-V-vi-IV)
  sake    calm          - koto-like plucks on a pentatonic scale over a soft drone, 68 BPM, no drums
  spirits smoky/jazzy   - electric-piano 7th chords (ii-V-I-vi), walking upright bass, brushed swing ride, 88 BPM, F major
Scene accents: a very soft bell (sake/wine) or muted pluck (beer/spirits) on each scene change.
Output: 44.1 kHz stereo 16-bit WAV, peak-limited; loudness (-16 LUFS) and fades are applied by ffmpeg in build.js.
"""
import sys
import numpy as np
from scipy.signal import fftconvolve, butter, lfilter

SR = 44100
rng = np.random.default_rng(7)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def env_adsr(n, a=0.01, d=0.3, s=0.0, r=0.3, hold=None):
    t = np.arange(n) / SR
    e = np.ones(n)
    ai = max(1, int(a * SR))
    e[:ai] = np.linspace(0, 1, ai)
    if s == 0.0:  # percussive: exponential decay after attack
        e[ai:] = np.exp(-(t[ai:] - a) / max(d, 1e-3))
    else:
        di = int(d * SR)
        e[ai:ai + di] = np.linspace(1, s, len(e[ai:ai + di]))
        e[ai + di:] = s
        if hold is not None:
            hi = int(hold * SR)
            if hi < n:
                e[hi:] *= np.exp(-(t[hi:] - hold) / max(r, 1e-3))
    return e


def piano(f, dur, vel=0.5):
    n = int(dur * SR)
    t = np.arange(n) / SR
    sig = np.zeros(n)
    for k, amp in enumerate([1.0, 0.45, 0.22, 0.12, 0.06, 0.03], start=1):
        inh = 1 + 0.0004 * k * k  # slight inharmonicity
        sig += amp * np.sin(2 * np.pi * f * k * inh * t) * np.exp(-t * (0.9 + 0.7 * k))
    sig *= env_adsr(n, a=0.004, d=dur)
    hammer = rng.normal(0, 1, n) * np.exp(-t * 120) * 0.02
    return (sig + hammer) * vel


def epiano(f, dur, vel=0.5):
    # simple 2-operator FM, Rhodes-like bell attack and warm body
    n = int(dur * SR)
    t = np.arange(n) / SR
    mod = np.sin(2 * np.pi * f * 14 * t) * 1.2 * np.exp(-t * 9)
    body = np.sin(2 * np.pi * f * t + mod) + 0.25 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 3)
    trem = 1 + 0.08 * np.sin(2 * np.pi * 4.2 * t)
    return body * env_adsr(n, a=0.006, d=dur * 0.9) * trem * vel


def pad(f, dur, vel=0.2):
    n = int(dur * SR)
    t = np.arange(n) / SR
    sig = np.zeros(n)
    for det in (-0.12, 0.0, 0.13):
        ff = f * 2 ** (det / 12)
        sig += np.sin(2 * np.pi * ff * t) + 0.3 * np.sin(2 * np.pi * 2 * ff * t)
    a = min(0.6, dur / 3)
    e = np.minimum(1, t / a) * np.minimum(1, (dur - t) / a)
    return sig * e * vel / 3


def ks_pluck(f, dur, vel=0.5, bright=0.5, decay=0.996):
    # Karplus-Strong plucked string
    n = int(dur * SR)
    p = max(2, int(SR / f))
    buf = rng.uniform(-1, 1, p)
    # soften the excitation
    buf = lfilter([bright, 1 - bright], [1], buf)
    blocks = [buf]
    prev_last = 0.0
    total = p
    while total < n:
        y = blocks[-1]
        shifted = np.concatenate([[prev_last], y[:-1]])
        prev_last = y[-1]
        blocks.append(decay * 0.5 * (y + shifted))
        total += p
    out = np.concatenate(blocks)[:n]
    out *= np.minimum(1, np.arange(n) / (0.002 * SR))
    tail = int(0.05 * SR)
    if n > tail:
        out[-tail:] *= np.linspace(1, 0, tail)
    return out * vel


def bass(f, dur, vel=0.5):
    n = int(dur * SR)
    t = np.arange(n) / SR
    sig = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) + 0.1 * np.sin(2 * np.pi * 3 * f * t)
    return sig * env_adsr(n, a=0.008, d=dur * 0.7) * vel


def kick(vel=0.5):
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    f = 50 + 70 * np.exp(-t * 30)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 9) * vel


def noise_hit(dur, hp=4000, decay=30, vel=0.2):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = rng.normal(0, 1, n)
    b, a = butter(2, hp / (SR / 2), 'high')
    return lfilter(b, a, x) * np.exp(-t * decay) * vel


def bell(f, dur=2.5, vel=0.15):
    n = int(dur * SR)
    t = np.arange(n) / SR
    sig = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t * d) for r, a, d in [(1, 1, 1.6), (2.76, 0.4, 3), (5.4, 0.2, 5)])
    return sig * np.minimum(1, t / 0.003) * vel


def reverb(x, secs=2.2, wet=0.25):
    n = int(secs * SR)
    t = np.arange(n) / SR
    ir_l = rng.normal(0, 1, n) * np.exp(-t * 6.9 / secs)
    ir_r = rng.normal(0, 1, n) * np.exp(-t * 6.9 / secs)
    b, a = butter(1, 5000 / (SR / 2))
    ir_l, ir_r = lfilter(b, a, ir_l), lfilter(b, a, ir_r)
    ir_l /= np.sqrt(np.sum(ir_l ** 2)); ir_r /= np.sqrt(np.sum(ir_r ** 2))
    L = fftconvolve(x[0], ir_l)[: x.shape[1]]
    R = fftconvolve(x[1], ir_r)[: x.shape[1]]
    return np.stack([x[0] * (1 - wet) + L * wet, x[1] * (1 - wet) + R * wet])


class Mix:
    def __init__(self, dur):
        self.n = int((dur + 3) * SR)
        self.buf = np.zeros((2, self.n))

    def add(self, sig, t, pan=0.0, gain=1.0):
        i = int(t * SR)
        if i >= self.n:
            return
        sig = sig[: self.n - i] * gain
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        self.buf[0, i:i + len(sig)] += sig * l
        self.buf[1, i:i + len(sig)] += sig * r


def chord_notes(root, kind):
    iv = {'maj': [0, 4, 7], 'min': [0, 3, 7], 'maj7': [0, 4, 7, 11], 'm7': [0, 3, 7, 10], '7': [0, 4, 7, 10], 'sus2': [0, 2, 7]}[kind]
    return [root + i for i in iv]


def wine(m, dur):
    bpm = 80; beat = 60 / bpm; bar = 4 * beat
    prog = [(62, 'maj'), (59, 'min'), (55, 'maj'), (57, 'maj')]  # D Bm G A
    melody = [74, 73, 71, 69, 71, 74, 76, 74, 78, 76, 74, 71, 73, 71, 69, 0]
    t = 0.0; k = 0
    while t < dur + 1:
        root, kind = prog[k % 4]
        notes = chord_notes(root, kind)
        m.add(pad(midi(root - 12), bar + 0.5, 0.25), t, 0, 1)
        for nn in notes:
            m.add(pad(midi(nn), bar + 0.5, 0.10), t, 0.2, 1)
        # broken-chord piano: root, fifth, third, fifth (8ths)
        arp = [notes[0], notes[2], notes[1] + 12, notes[2]] * 2
        for j, nn in enumerate(arp):
            m.add(piano(midi(nn), 1.6, 0.20 if j % 4 else 0.26), t + j * beat / 2, -0.3 + 0.15 * (j % 3), 1)
        m.add(piano(midi(root - 24), 2.5, 0.28), t, 0, 1)
        # simple melody, two notes per bar
        for j in range(2):
            nn = melody[(k * 2 + j) % len(melody)]
            if nn and k >= 1:
                m.add(piano(midi(nn), 2.0, 0.17), t + j * 2 * beat + beat * 0.02, 0.35, 1)
        t += bar; k += 1


def beer(m, dur):
    bpm = 104; beat = 60 / bpm; bar = 4 * beat
    prog = [(55, 'maj'), (62, 'maj'), (64, 'min'), (60, 'maj')]  # G D Em C
    t = 0.0; k = 0
    strum = [0, 1, 0.75, 0.5, 0.75, 1, 0.5, 0.75]
    while t < dur + 1:
        root, kind = prog[k % 4]
        notes = chord_notes(root, kind) + [root + 12]
        for j, acc in enumerate(strum):
            tt = t + j * beat / 2
            for q, nn in enumerate(notes if j % 2 == 0 else notes[::-1]):
                m.add(ks_pluck(midi(nn), 1.4, 0.13 * acc, bright=0.55, decay=0.995), tt + q * 0.012, -0.25 + q * 0.15, 1)
        for b in range(4):
            tt = t + b * beat
            m.add(bass(midi(root - 24 + (7 if b == 2 else 0)), beat * 0.9, 0.35), tt, 0, 1)
            if b in (0, 2):
                m.add(kick(0.5), tt, 0, 1)
            if b in (1, 3):
                m.add(noise_hit(0.18, hp=1800, decay=22, vel=0.16), tt, 0.1, 1)  # soft snare/clap
            for h in (0, 0.5):
                m.add(noise_hit(0.06, hp=7000, decay=60, vel=0.07 if h else 0.1), tt + h * beat, 0.35, 1)  # shaker
        t += bar; k += 1


def sake(m, dur):
    bpm = 68; beat = 60 / bpm; bar = 4 * beat
    scale = [62, 64, 67, 69, 71, 74, 76, 79]  # D major pentatonic (D E G A B), calm and consonant
    pattern = [0, 2, 4, 3, 5, 4, 2, 1, 3, 2, 0, 1, 2, 4, 5, 7]
    m.add(pad(midi(50), dur + 1.5, 0.22), 0, 0, 1)
    m.add(pad(midi(57), dur + 1.5, 0.12), 0, 0, 1)
    t = 0.0; k = 0
    while t < dur + 1:
        for j in range(4):
            nn = scale[pattern[(k * 4 + j) % len(pattern)]]
            m.add(ks_pluck(midi(nn), 2.4, 0.22, bright=0.35, decay=0.9975), t + j * beat, -0.4 + 0.25 * j, 1)
        if k % 2 == 1:
            m.add(ks_pluck(midi(scale[0] - 12), 3.0, 0.18, bright=0.3, decay=0.998), t, 0, 1)
        t += bar; k += 1


def spirits(m, dur):
    bpm = 88; beat = 60 / bpm; bar = 4 * beat
    prog = [(55, 'm7'), (60, '7'), (53, 'maj7'), (50, 'm7')]  # Gm7 C7 Fmaj7 Dm7
    walk = {55: [43, 46, 48, 49], 60: [48, 52, 53, 54], 53: [41, 45, 48, 47], 50: [38, 41, 43, 42]}
    t = 0.0; k = 0
    sw = beat * 2 / 3  # swing
    while t < dur + 1:
        root, kind = prog[k % 4]
        notes = chord_notes(root, kind)
        for tt in (t, t + 1.5 * beat + (sw - beat / 2), t + 3 * beat):
            for q, nn in enumerate(notes):
                m.add(epiano(midi(nn), 1.8, 0.11), tt + q * 0.008, -0.2 + 0.12 * q, 1)
        for b, nn in enumerate(walk[root]):
            m.add(bass(midi(nn), beat * 0.95, 0.42), t + b * beat, 0.05, 1)
        for b in range(4):
            tt = t + b * beat
            m.add(noise_hit(0.5, hp=5000, decay=7, vel=0.05), tt, 0.4, 1)  # ride
            m.add(noise_hit(0.25, hp=6000, decay=14, vel=0.035), tt + sw, 0.4, 1)  # swung skip note
            if b in (1, 3):
                m.add(noise_hit(0.3, hp=900, decay=10, vel=0.06), tt, -0.1, 1)  # brush
        t += bar; k += 1



# =====================================================================================================================
# Style library (batch 04+): ten clearly different styles. Each differs in genre, tempo, key, instruments and rhythm,
# not just in transposition. build.js refuses a batch where two reels share a style.
# =====================================================================================================================

def saw(f, dur, vel=0.5, cutoff=3000, a=0.005, d=None, s=0.0, r=0.1, detune=0.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    sig = np.zeros(n)
    for det in ((-detune, detune) if detune else (0.0,)):
        ff = f * 2 ** (det / 1200)
        sig += 2 * ((ff * t + rng.uniform()) % 1.0) - 1
    sig /= (2 if detune else 1)
    b, aa = butter(2, min(cutoff, SR / 2 - 100) / (SR / 2))
    sig = lfilter(b, aa, sig)
    if s == 0.0:
        e = env_adsr(n, a=a, d=d if d is not None else dur * 0.5)
    else:
        e = env_adsr(n, a=a, d=d or 0.1, s=s, r=r, hold=max(a, dur - r))
    return sig * e * vel


def square(f, dur, vel=0.5, cutoff=2500, decay=None):
    n = int(dur * SR)
    t = np.arange(n) / SR
    sig = np.sign(np.sin(2 * np.pi * f * t))
    b, a = butter(2, cutoff / (SR / 2))
    sig = lfilter(b, a, sig)
    e = env_adsr(n, a=0.003, d=decay or dur * 0.4)
    return sig * e * vel


def snare(vel=0.4, tone=190, decay=16, bright=1500):
    n = int(0.3 * SR)
    t = np.arange(n) / SR
    body = np.sin(2 * np.pi * tone * t) * np.exp(-t * 30)
    b, a = butter(2, bright / (SR / 2), 'high')
    nz = lfilter(b, a, rng.normal(0, 1, n)) * np.exp(-t * decay)
    return (0.6 * body + 0.7 * nz) * vel


def clap(vel=0.3):
    n = int(0.25 * SR)
    t = np.arange(n) / SR
    b, a = butter(2, [900 / (SR / 2), 4000 / (SR / 2)], 'band')
    nz = lfilter(b, a, rng.normal(0, 1, n))
    e = np.zeros(n)
    for off in (0, 0.011, 0.022):
        i = int(off * SR)
        e[i:] += np.exp(-(t[: n - i]) * (60 if off < 0.02 else 18))
    return nz * e * vel * 0.6


def hat(vel=0.1, open_=False):
    return noise_hit(0.35 if open_ else 0.05, hp=8000, decay=9 if open_ else 70, vel=vel)


def rim(vel=0.2):
    n = int(0.08 * SR)
    t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 1700 * t) * 0.6 + np.sin(2 * np.pi * 820 * t)) * np.exp(-t * 90) * vel


def tom(f=90, vel=0.5, decay=6):
    n = int(1.2 * SR)
    t = np.arange(n) / SR
    ff = f * (1 + 0.5 * np.exp(-t * 20))
    ph = 2 * np.pi * np.cumsum(ff) / SR
    nz = lfilter(*butter(2, 300 / (SR / 2)), rng.normal(0, 1, n)) * np.exp(-t * 25) * 0.4
    return (np.sin(ph) + nz) * np.exp(-t * decay) * vel


def subbass(f, dur, vel=0.5):
    n = int(dur * SR)
    t = np.arange(n) / SR
    e = np.minimum(1, t / 0.01) * np.minimum(1, (dur - t) / 0.03).clip(0, 1)
    return np.sin(2 * np.pi * f * t) * e * vel


def slap(f, dur, vel=0.5):
    n = int(dur * SR)
    t = np.arange(n) / SR
    sig = np.sin(2 * np.pi * f * t) + 0.6 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 12) + 0.3 * np.sin(2 * np.pi * 3 * f * t) * np.exp(-t * 20)
    click = rng.normal(0, 1, n) * np.exp(-t * 400) * 0.5
    return (sig * env_adsr(n, a=0.002, d=dur * 0.35) + click) * vel


def strings(f, dur, vel=0.3, attack=0.5):
    n = int(dur * SR)
    t = np.arange(n) / SR
    sig = np.zeros(n)
    for det in (-9, -3, 4, 10):
        ff = f * 2 ** (det / 1200)
        vib = 1 + 0.003 * np.sin(2 * np.pi * 5.2 * t + det)
        sig += 2 * ((np.cumsum(ff * vib) / SR + rng.uniform()) % 1.0) - 1
    b, a = butter(2, min(f * 6, 5000) / (SR / 2))
    sig = lfilter(b, a, sig / 4)
    a_ = min(attack, dur / 3)
    e = np.minimum(1, t / a_) * np.minimum(1, (dur - t) / min(0.4, dur / 3)).clip(0, 1)
    return sig * e * vel


def organ(f, dur, vel=0.3):
    n = int(dur * SR)
    t = np.arange(n) / SR
    sig = sum(a * np.sin(2 * np.pi * f * k * t) for k, a in [(0.5, 0.5), (1, 1), (2, 0.6), (3, 0.3), (4, 0.2)])
    e = np.minimum(1, t / 0.004) * np.exp(-t * 7)
    return sig * e * vel / 2


def crackle(dur, vel=0.03):
    n = int(dur * SR)
    x = np.zeros(n)
    idx = rng.integers(0, n, int(dur * 12))
    x[idx] = rng.uniform(-1, 1, len(idx))
    hiss = lfilter(*butter(1, 3000 / (SR / 2), 'high'), rng.normal(0, 0.08, n))
    return (x + hiss) * vel


def lowpass(sig, cut):
    b, a = butter(2, cut / (SR / 2))
    return lfilter(b, a, sig)


def loop(dur, bar):
    t = 0.0; k = 0
    while t < dur + 1:
        yield t, k
        t += bar; k += 1


def st_lofi(m, dur):
    """Lo-fi hip hop: 76 BPM, F minor, dusty Rhodes 9th chords, lazy swung boom-bap, sub bass, vinyl crackle."""
    beat = 60 / 76; bar = 4 * beat
    prog = [(53, [0, 3, 7, 10, 14]), (58, [0, 4, 7, 10, 14]), (51, [0, 4, 7, 11, 14]), (48, [0, 3, 7, 10, 14])]  # Fm9 Bb9 Ebmaj9 Cm9
    sw = beat * 0.58
    m.add(crackle(dur + 1, 0.04), 0, 0, 1)
    for t, k in loop(dur, bar):
        root, iv = prog[k % 4]
        for q, i in enumerate(iv):
            sig = lowpass(epiano(midi(root + i), bar * 0.95, 0.09), 2200)
            m.add(sig, t + q * 0.018, -0.3 + 0.15 * q, 1)
        m.add(subbass(midi(root - 24), beat * 1.6, 0.5), t, 0, 1)
        m.add(subbass(midi(root - 24 + 7), beat * 0.8, 0.4), t + 2 * beat + sw - beat / 2, 0, 1)
        for b in range(4):
            tt = t + b * beat
            if b == 0 or (b == 2 and k % 2 == 0):
                m.add(kick(0.55), tt, 0, 1)
            if b == 2:
                m.add(kick(0.4), tt + sw, 0, 1)
            if b in (1, 3):
                m.add(lowpass(snare(0.32, tone=170, decay=14), 5000), tt + 0.02, 0.05, 1)
            m.add(hat(0.030), tt, 0.3, 1)
            m.add(hat(0.018), tt + sw, 0.3, 1)
        mel = [77, 75, 72, 70][k % 4]
        if k % 2 == 1:
            m.add(lowpass(epiano(midi(mel + 12), 1.2, 0.05), 3000), t + 3 * beat, 0.4, 1)


def st_bossa(m, dur):
    """Bossa nova: 132 BPM (cut-time feel), D minor, nylon-string guitar comping, root-fifth bass, rimshot clave, shaker."""
    beat = 60 / 132; bar = 4 * beat
    prog = [(50, [0, 3, 7, 10, 14]), (55, [0, 4, 7, 10, 16]), (48, [0, 4, 7, 11, 14]), (57, [0, 4, 7, 10, 13])]  # Dm9 G13 Cmaj9 A7b9
    comp = [0, 1.5, 3, 4.5, 6, 7.5]  # eighth-note positions of the chord hits (2 bars of 4/4 at 8ths -> one bar here)
    clave = [0, 1.5, 3, 5, 6]
    for t, k in loop(dur, bar):
        root, iv = prog[k % 4]
        for c in comp:
            tt = t + c * beat / 2
            for q, i in enumerate(iv[1:]):
                m.add(ks_pluck(midi(root + i), 0.9, 0.11, bright=0.25, decay=0.993), tt + q * 0.006, -0.35 + 0.12 * q, 1)
        m.add(bass(midi(root - 24), beat * 1.4, 0.45), t, 0.05, 1)
        m.add(bass(midi(root - 24 + 7), beat * 0.6, 0.38), t + 1.5 * beat, 0.05, 1)
        m.add(bass(midi(root - 24 + 7), beat * 1.4, 0.40), t + 2 * beat, 0.05, 1)
        m.add(bass(midi(root - 24), beat * 0.6, 0.36), t + 3.5 * beat, 0.05, 1)
        for c in clave:
            m.add(rim(0.16), t + c * beat / 2, 0.25, 1)
        for e in range(8):
            m.add(noise_hit(0.07, hp=6000, decay=45, vel=0.05 if e % 2 else 0.08), t + e * beat / 2, -0.3, 1)
        if k % 2 == 0:
            m.add(kick(0.28), t, 0, 1); m.add(kick(0.22), t + 2 * beat, 0, 1)
        mel = [69, 72, 76, 74, 72, 69, 67, 69][(k * 2) % 8: (k * 2) % 8 + 2]
        for j, nn in enumerate(mel):
            m.add(pad(midi(nn + 12), beat * 1.6, 0.05), t + j * 2 * beat + beat, 0.3, 1)


def st_pop(m, dur):
    """Upbeat pop pluck: 120 BPM, A major, bright synth-pluck 16th arpeggios, four-on-the-floor kick, claps, offbeat bass."""
    beat = 60 / 120; bar = 4 * beat
    prog = [(57, 'maj'), (64, 'maj'), (66, 'min'), (62, 'maj')]  # A E F#m D
    for t, k in loop(dur, bar):
        root, kind = prog[k % 4]
        notes = chord_notes(root, kind)
        arp = [notes[0], notes[1], notes[2], notes[0] + 12]
        for j in range(16):
            nn = arp[(j * 3) % 4] + (12 if j % 8 == 7 else 0)
            m.add(saw(midi(nn), 0.22, 0.10 if j % 4 else 0.13, cutoff=4200, d=0.08), t + j * beat / 4, 0.4 if j % 2 else -0.4, 1)
        for q, nn in enumerate(notes):
            m.add(pad(midi(nn), bar, 0.07), t, 0, 1)
        for b in range(4):
            tt = t + b * beat
            m.add(kick(0.6), tt, 0, 1)
            m.add(saw(midi(root - 24), beat * 0.45, 0.30, cutoff=900, d=0.2), tt + beat / 2, 0, 1)
            if b in (1, 3):
                m.add(clap(0.45), tt, 0, 1)
            m.add(hat(0.045, open_=True), tt + beat / 2, 0.2, 1)


def st_folk(m, dur):
    """Acoustic folk: 92 BPM, E major, fingerpicked steel-string guitar (Travis picking), foot stomp and hand claps, whistle line."""
    beat = 60 / 92; bar = 4 * beat
    prog = [(52, [0, 7, 12, 16, 19]), (57, [0, 7, 12, 16, 19]), (52, [0, 7, 12, 16, 19]), (59, [0, 7, 12, 16, 17])]  # E A E B7sus
    pick = [0, 3, 1, 4, 0, 3, 1, 2]
    whistle = [80, 83, 85, 83, 80, 78, 76, 78]
    for t, k in loop(dur, bar):
        root, iv = prog[k % 4]
        for j, p in enumerate(pick):
            nn = root + iv[p] - (12 if p == 0 else 0)
            m.add(ks_pluck(midi(nn), 1.6, 0.20 if p in (0, 1) else 0.14, bright=0.7, decay=0.9965), t + j * beat / 2, -0.2 + 0.1 * p, 1)
        m.add(tom(70, 0.35, 9), t, 0, 1); m.add(tom(70, 0.30, 9), t + 2 * beat, 0, 1)
        m.add(clap(0.25), t + beat, 0.15, 1); m.add(clap(0.25), t + 3 * beat, -0.15, 1)
        if k >= 2:
            for j in range(2):
                f = midi(whistle[(k * 2 + j) % 8])
                n = int(beat * 1.8 * SR); tt = np.arange(n) / SR
                sig = np.sin(2 * np.pi * f * tt + 0.15 * np.sin(2 * np.pi * 5.5 * tt)) * np.minimum(1, tt / 0.05) * np.minimum(1, (beat * 1.8 - tt) / 0.2)
                m.add(sig * 0.05, t + j * 2 * beat, 0.35, 1)


def st_synthwave(m, dur):
    """Synthwave: 100 BPM, A minor, detuned saw pads, gated 16th arpeggio, driving 8th-note saw bass, big reverb snare."""
    beat = 60 / 100; bar = 4 * beat
    prog = [(57, 'min'), (53, 'maj'), (48, 'maj'), (55, 'maj')]  # Am F C G
    for t, k in loop(dur, bar):
        root, kind = prog[k % 4]
        notes = chord_notes(root, kind)
        for nn in notes:
            m.add(saw(midi(nn), bar + 0.1, 0.07, cutoff=1300, a=0.25, s=0.8, r=0.3, detune=14), t, 0, 1)
        seq = [0, 2, 1, 2, 0, 2, 1, 3]
        for j in range(16):
            nn = (notes + [notes[0] + 12])[seq[j % 8]] + 12
            m.add(square(midi(nn), 0.12, 0.06, cutoff=2000, decay=0.06), t + j * beat / 4, 0.5 if (j // 2) % 2 else -0.5, 1)
        for e in range(8):
            m.add(saw(midi(root - 24), beat / 2 * 0.9, 0.22, cutoff=700, d=0.15, detune=6), t + e * beat / 2, 0, 1)
        for b in range(4):
            tt = t + b * beat
            if b in (0, 2):
                m.add(kick(0.6), tt, 0, 1)
            if b in (1, 3):
                m.add(snare(0.5, tone=180, decay=7, bright=1200), tt, 0, 1)
            m.add(hat(0.025), tt + beat / 2, 0.2, 1)


def st_swing(m, dur):
    """Jazz swing: 168 BPM, B-flat major, acoustic piano Charleston comping, fast walking bass, swung ride, brushes."""
    beat = 60 / 168; bar = 4 * beat
    prog = [(60, 'm7'), (65, '7'), (58, 'maj7'), (55, '7')]  # Cm7 F7 Bbmaj7 G7
    walks = {60: [36, 39, 43, 44], 65: [41, 45, 48, 47], 58: [46, 50, 53, 54], 55: [43, 47, 50, 49]}
    sw = beat * 2 / 3
    for t, k in loop(dur, bar):
        root, kind = prog[k % 4]
        notes = chord_notes(root, kind)
        for tt in (t, t + beat + sw):  # Charleston: beat 1 and the "and" of 2
            for q, nn in enumerate(notes):
                m.add(piano(midi(nn), 0.8, 0.12), tt + q * 0.005, -0.25 + 0.1 * q, 1)
        for b, nn in enumerate(walks[root]):
            m.add(bass(midi(nn), beat * 0.95, 0.5), t + b * beat, 0.1, 1)
        for b in range(4):
            tt = t + b * beat
            m.add(noise_hit(0.6, hp=5500, decay=5, vel=0.030), tt, 0.4, 1)
            if b in (1, 3):
                m.add(noise_hit(0.2, hp=6000, decay=16, vel=0.025), tt + sw, 0.4, 1)
                m.add(noise_hit(0.12, hp=7000, decay=40, vel=0.025), tt, -0.4, 1)  # hi-hat foot
            m.add(noise_hit(0.25, hp=700, decay=12, vel=0.015), tt, -0.1, 1)  # brush swish
        if k % 2 == 1:
            lick = [70, 72, 74, 77, 74]
            for j, nn in enumerate(lick):
                m.add(piano(midi(nn + 12), 0.5, 0.08), t + 2 * beat + j * (sw if j % 2 == 0 else beat - sw), 0.3, 1)


def st_house(m, dur):
    """Minimal house: 124 BPM, F minor, four-on-the-floor, offbeat open hats, organ chord stabs, offbeat sub bass."""
    beat = 60 / 124; bar = 4 * beat
    prog = [(53, [0, 3, 7, 10]), (53, [0, 3, 7, 10]), (49, [0, 4, 7, 11]), (51, [0, 4, 7, 10])]  # Fm7 Fm7 Dbmaj7 Eb7
    stab = [0.75, 2.5, 3.25]
    for t, k in loop(dur, bar):
        root, iv = prog[k % 4]
        for s_ in stab:
            for q, i in enumerate(iv):
                m.add(organ(midi(root + i), 0.3, 0.12), t + s_ * beat, -0.2 + 0.13 * q, 1)
        for b in range(4):
            tt = t + b * beat
            m.add(kick(0.7), tt, 0, 1)
            m.add(subbass(midi(root - 24), beat * 0.4, 0.42), tt + beat / 2, 0, 1)
            m.add(hat(0.050, open_=True), tt + beat / 2, 0.25, 1)
            for x in (0.25, 0.75):
                m.add(hat(0.018), tt + x * beat, -0.25, 1)
            if b in (1, 3):
                m.add(clap(0.3), tt, 0.05, 1)
        if k % 4 == 3:
            m.add(noise_hit(bar, hp=3000, decay=0.5, vel=0.007) * np.linspace(0, 1, int(bar * SR)), t, 0, 1)


def st_cinematic(m, dur):
    """Cinematic strings: 70 BPM, C minor, slow string-ensemble chords, spiccato 8th-note ostinato, low taiko-style drums."""
    beat = 60 / 70; bar = 4 * beat
    prog = [(48, 'min'), (44, 'maj'), (51, 'maj'), (46, 'maj')]  # Cm Ab Eb Bb
    for t, k in loop(dur, bar):
        root, kind = prog[k % 4]
        notes = chord_notes(root, kind)
        m.add(strings(midi(root - 12), bar + 0.4, 0.22, attack=0.8), t, 0, 1)
        for q, nn in enumerate(notes):
            m.add(strings(midi(nn + 12), bar + 0.4, 0.13, attack=0.9), t, -0.5 + 0.5 * q, 1)
        ost = [notes[0] + 12, notes[2] + 12, notes[1] + 12, notes[2] + 12]
        for e in range(8):
            m.add(saw(midi(ost[e % 4]), beat * 0.35, 0.09, cutoff=2400, d=0.07, detune=8), t + e * beat / 2, 0.35 if e % 2 else -0.35, 1)
        m.add(tom(55, 0.75, 3.5), t, 0, 1)
        m.add(tom(55, 0.45, 4), t + 2.5 * beat, 0, 1)
        if k % 2 == 1:
            m.add(tom(80, 0.4, 5), t + 3 * beat, 0.2, 1); m.add(tom(80, 0.35, 5), t + 3.5 * beat, -0.2, 1)
        if k >= 2:
            m.add(strings(midi([67, 68, 70, 70][k % 4] + 12), bar, 0.07, attack=0.6), t, 0.2, 1)


def st_ukulele(m, dur):
    """Ukulele: 112 BPM, C major, re-entrant uke strums (down-down-up-up-down-up), glockenspiel tune, finger snaps, bouncy bass."""
    beat = 60 / 112; bar = 4 * beat
    voic = {'C': [67, 60, 64, 72], 'Am': [69, 60, 64, 69], 'F': [69, 60, 65, 69], 'G': [67, 62, 71, 74]}  # G-C-E-A re-entrant shapes
    roots = {'C': 48, 'Am': 45, 'F': 41, 'G': 43}
    order = ['C', 'Am', 'F', 'G']
    strum = [(0, 1, 1.0), (1, 1, 0.8), (1.5, -1, 0.6), (2.5, -1, 0.6), (3, 1, 0.85), (3.5, -1, 0.6)]
    tune = [76, 79, 81, 79, 77, 76, 74, 72, 74, 76, 79, 76, 72, 74, 72, 0]
    for t, k in loop(dur, bar):
        ch = order[k % 4]; vv = voic[ch]
        for pos, d, acc in strum:
            seq = vv if d > 0 else vv[::-1]
            for q, nn in enumerate(seq):
                m.add(ks_pluck(midi(nn), 0.7, 0.12 * acc, bright=0.6, decay=0.990), t + pos * beat + q * 0.009, -0.15 + 0.1 * q, 1)
        r = roots[ch]
        for b, nn in enumerate([r, r + 7, r + 12, r + 7]):
            m.add(bass(midi(nn - 12), beat * 0.5, 0.35), t + b * beat, 0, 1)
        for b in (1, 3):
            m.add(noise_hit(0.08, hp=2500, decay=55, vel=0.110), t + b * beat, 0.3, 1)  # finger snap
        for j in range(4):
            nn = tune[(k * 4 + j) % len(tune)]
            if nn:
                m.add(bell(midi(nn + 12), 1.2, 0.07), t + j * beat, 0.35, 1)


def st_funk(m, dur):
    """Funk: 104 BPM, E minor (E9), syncopated slap bass in 16ths, muted 'chicken-scratch' guitar, tight 16th hats, brass stabs."""
    beat = 60 / 104; bar = 4 * beat
    bassline = [(0, 40), (0.75, 52), (1.5, 40), (2.25, 43), (2.5, 45), (3, 40), (3.5, 50), (3.75, 52)]
    for t, k in loop(dur, bar):
        shift = 5 if k % 4 == 2 else 0  # A9 bar for variety
        for pos, nn in bassline:
            m.add(slap(midi(nn + shift), beat * 0.3, 0.42), t + pos * beat, 0, 1)
        for j in range(16):
            if j % 4 in (1, 3) or j in (6, 14):
                for q, nn in enumerate([56, 62, 66]):
                    m.add(ks_pluck(midi(nn + shift), 0.09, 0.10, bright=0.55, decay=0.97), t + j * beat / 4 + q * 0.004, 0.45, 1)
            m.add(hat(0.030 if j % 2 else 0.09), t + j * beat / 4, -0.3, 1)
        m.add(kick(0.6), t, 0, 1); m.add(kick(0.5), t + 1.75 * beat, 0, 1); m.add(kick(0.55), t + 2.5 * beat, 0, 1)
        m.add(snare(0.45, tone=210, decay=20, bright=1800), t + beat, 0, 1); m.add(snare(0.45, tone=210, decay=20, bright=1800), t + 3 * beat, 0, 1)
        if k % 2 == 1:
            for q, nn in enumerate([64, 68, 71, 74]):
                m.add(saw(midi(nn + shift), 0.25, 0.08, cutoff=2600, d=0.12, detune=10), t + 3.5 * beat, -0.2 + 0.13 * q, 1)


STYLES = {
    'lofi':      (st_lofi,      'lo-fi hip hop · 76 BPM · F minor · dusty Rhodes, swung boom-bap, vinyl crackle', 1.6, 0.18),
    'bossa':     (st_bossa,     'bossa nova · 132 BPM · D minor · nylon guitar, rimshot clave, shaker', 1.6, 0.16),
    'pop':       (st_pop,       'upbeat pop pluck · 120 BPM · A major · synth-pluck arps, four-on-the-floor, claps', 1.2, 0.12),
    'folk':      (st_folk,      'acoustic folk · 92 BPM · E major · fingerpicked guitar, stomp and clap, whistle', 1.6, 0.16),
    'synthwave': (st_synthwave, 'synthwave · 100 BPM · A minor · detuned saw pads, gated arps, driving bass', 2.4, 0.22),
    'swing':     (st_swing,     'jazz swing · 168 BPM · B-flat major · piano comping, walking bass, swung ride', 1.4, 0.14),
    'house':     (st_house,     'minimal house · 124 BPM · F minor · organ stabs, offbeat hats, sub bass', 1.2, 0.12),
    'cinematic': (st_cinematic, 'cinematic strings · 70 BPM · C minor · string ensemble, spiccato ostinato, low drums', 3.0, 0.30),
    'ukulele':   (st_ukulele,   'ukulele · 112 BPM · C major · uke strums, glockenspiel, finger snaps', 1.2, 0.12),
    'funk':      (st_funk,      'funk · 104 BPM · E minor · slap bass, muted guitar scratch, brass stabs', 1.0, 0.10),
}

def accents(m, mood, times):
    for t in times:
        if t <= 0.05:
            continue
        if mood in ('wine', 'sake'):
            m.add(bell(midi(86 if mood == 'wine' else 81), 2.5, 0.09), t - 0.02, 0.3, 1)
        else:
            m.add(ks_pluck(midi(79 if mood == 'beer' else 77), 1.0, 0.12, bright=0.4, decay=0.99), t - 0.02, 0.3, 1)
        # soft air swell into the change
        sw = noise_hit(0.5, hp=2500, decay=1, vel=0.013)
        sw *= np.linspace(0, 1, len(sw)) ** 2
        m.add(sw, max(0, t - 0.5), -0.2, 1)


def main():
    mood, dur, out = sys.argv[1], float(sys.argv[2]), sys.argv[3]
    times = [float(x) for x in sys.argv[4].split(',')] if len(sys.argv) > 4 and sys.argv[4] else []
    if mood == '--list':
        for k, v in STYLES.items():
            print(f'{k}\t{v[1]}')
        return
    m = Mix(dur)
    if mood in STYLES:
        fn, _, rv_secs, rv_wet = STYLES[mood]
        fn(m, dur)  # no scene accents: the voiceover carries the scene changes
    else:
        {'wine': wine, 'beer': beer, 'sake': sake, 'spirits': spirits}[mood](m, dur)
        accents(m, mood, times)
        rv_secs = {'sake': 3.2, 'wine': 2.4, 'spirits': 1.8, 'beer': 1.4}[mood]
        rv_wet = {'sake': 0.35, 'wine': 0.25, 'spirits': 0.2, 'beer': 0.14}[mood]
    x = reverb(m.buf, secs=rv_secs, wet=rv_wet)
    x = x[:, : int(dur * SR)]
    b, a = butter(2, 40 / (SR / 2), 'high')  # remove rumble
    x = lfilter(b, a, x)
    x = np.tanh(x / (np.max(np.abs(x)) + 1e-9) * 1.2) * 0.7  # gentle saturation, peak headroom
    pcm = (x.T * 32767).astype(np.int16)
    import wave
    with wave.open(out, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())


if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == '--list':
        for k, v in STYLES.items():
            print(f'{k}\t{v[1]}')
    else:
        main()
