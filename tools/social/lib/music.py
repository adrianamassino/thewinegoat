#!/usr/bin/env python3
"""Original background music for The Wine Goat reels, synthesised from scratch (numpy/scipy, no samples,
no third-party recordings: every note is generated here, so we own it outright).

Usage: python3 music.py <mood> <duration_s> <out.wav> [scene_start_times_comma_separated]
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


def accents(m, mood, times):
    for t in times:
        if t <= 0.05:
            continue
        if mood in ('wine', 'sake'):
            m.add(bell(midi(86 if mood == 'wine' else 81), 2.5, 0.09), t - 0.02, 0.3, 1)
        else:
            m.add(ks_pluck(midi(79 if mood == 'beer' else 77), 1.0, 0.12, bright=0.4, decay=0.99), t - 0.02, 0.3, 1)
        # soft air swell into the change
        sw = noise_hit(0.5, hp=2500, decay=1, vel=0.025)
        sw *= np.linspace(0, 1, len(sw)) ** 2
        m.add(sw, max(0, t - 0.5), -0.2, 1)


def main():
    mood, dur, out = sys.argv[1], float(sys.argv[2]), sys.argv[3]
    times = [float(x) for x in sys.argv[4].split(',')] if len(sys.argv) > 4 and sys.argv[4] else []
    m = Mix(dur)
    {'wine': wine, 'beer': beer, 'sake': sake, 'spirits': spirits}[mood](m, dur)
    accents(m, mood, times)
    x = reverb(m.buf, secs={'sake': 3.2, 'wine': 2.4, 'spirits': 1.8, 'beer': 1.4}[mood], wet={'sake': 0.35, 'wine': 0.25, 'spirits': 0.2, 'beer': 0.14}[mood])
    x = x[:, : int(dur * SR)]
    b, a = butter(2, 40 / (SR / 2), 'high')  # remove rumble
    x = lfilter(b, a, x)
    x = np.tanh(x / (np.max(np.abs(x)) + 1e-9) * 1.2) * 0.7  # gentle saturation, peak headroom
    pcm = (x.T * 32767).astype(np.int16)
    import wave
    with wave.open(out, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())


if __name__ == '__main__':
    main()
