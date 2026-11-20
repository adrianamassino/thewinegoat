"""Checks the WAVs made by render_sfx.js (we cannot listen, so we measure) and draws waveform + spectrogram PNGs.
   python3 tools/sfx/analyze_sfx.py <dir>
   Per sound: not silent, sounding length within limits, peak below clipping. Bleats: the loudness envelope must pulse
   at 11-20 Hz (the goat's "eh-eh-eh"), pitch must fall, energy must sit in the "eh" formant bands."""
import sys, json, wave, os
import numpy as np
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
D = sys.argv[1]
LIM = {"tap": (0.01, 0.06), "flip": (0.08, 0.2), "wrong": (0.2, 0.42), "done": (0.3, 0.75), "bleat": (0.33, 0.7), "correct": (0.4, 0.8),
       "streak": (0.6, 1.2), "complete": (0.7, 1.3), "fanfare": (1.3, 2.2)}
PEAK = {"tap": (0.01, 0.12), "flip": (0.02, 0.2), "wrong": (0.04, 0.25)}   # quiet ones; the rest 0.1 - 0.7
peaks = json.load(open(os.path.join(D, "peaks.json"))); fails = 0
def bad(*a):
    global fails; fails += 1; print("FAIL", *a)
def env(x, sr, win=0.004):
    n = int(sr * win); k = len(x) // n; return np.sqrt((x[:k * n].reshape(k, n) ** 2).mean(1)), 1 / win
def pitch(seg, sr):
    seg = seg - seg.mean(); ac = np.correlate(seg, seg, "full")[len(seg) - 1:]; lo, hi = int(sr / 800), int(sr / 250)
    return sr / (lo + int(np.argmax(ac[lo:hi])))
for name in sorted(peaks):
    w = wave.open(os.path.join(D, name + ".wav")); sr = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), "<i2") / 32767.0
    kind = name.split("-")[0]; pk = peaks[name]; rms = float(np.sqrt((x ** 2).mean()))
    e, er = env(x, sr); act = np.where(e > max(e.max() * 0.03, 1e-4))[0]
    dur = (act[-1] - act[0] + 1) / er if len(act) else 0
    lo, hi = PEAK.get(kind, (0.1, 0.7)); info = f"{name:12s} peak {pk:.3f} rms {rms:.4f} sounding {dur*1000:5.0f} ms"
    if pk < lo: bad(name, "too quiet / silent", pk)
    if pk > hi: bad(name, "too loud", pk)
    if pk >= 0.98: bad(name, "clipping", pk)
    if not (LIM[kind][0] <= dur <= LIM[kind][1]): bad(name, "length", round(dur, 3), LIM[kind])
    if abs(x[-200:]).max() > 0.004: bad(name, "does not end in silence (click risk)", abs(x[-200:]).max())
    if kind == "bleat":
        a, b = act[0], act[-1]; mid = e[a + int(0.12 * er): b - int(0.05 * er)]            # after the tremolo has grown
        m = mid - np.convolve(mid, np.ones(15) / 15, "same"); m = m[8:-8]                # remove the slow envelope
        sp = np.abs(np.fft.rfft(m * np.hanning(len(m)), 4096)); fr = np.fft.rfftfreq(4096, 1 / er)
        band = (fr >= 9) & (fr <= 30); f = fr[band][np.argmax(sp[band])]
        depth = (np.percentile(mid, 92) - np.percentile(mid, 8)) / (np.percentile(mid, 92) + np.percentile(mid, 8))
        t0 = act[0] / er; p1 = pitch(x[int((t0 + 0.07) * sr): int((t0 + 0.13) * sr)], sr); p2 = pitch(x[int((t0 + dur - 0.09) * sr): int((t0 + dur - 0.03) * sr)], sr)
        S = np.abs(np.fft.rfft(x * np.hanning(len(x)))) ** 2; F = np.fft.rfftfreq(len(x), 1 / sr)
        bandE = lambda u, v: S[(F >= u) & (F < v)].sum() / S.sum()
        info += f" | tremolo {f:.1f} Hz depth {depth:.2f} | pitch {p1:.0f}->{p2:.0f} Hz | 500-1000 Hz {bandE(500,1000):.2f}, 1.5-3.2 kHz {bandE(1500,3200):.2f}, >5 kHz {bandE(5000,22050):.3f}"
        if not 11 <= f <= 20: bad(name, "tremolo rate", f)
        if not 0.3 <= depth <= 0.95: bad(name, "tremolo depth", depth)
        if not p2 < p1 * 0.95: bad(name, "pitch does not fall", p1, p2)
        if not 380 <= p1 <= 650: bad(name, "pitch out of kid-goat range", p1)
        if bandE(1500, 3200) < 0.12: bad(name, "second formant too weak: would sound like a buzzer / hum")
        if bandE(5000, 22050) > 0.08: bad(name, "too harsh")
    if kind == "wrong":
        S = np.abs(np.fft.rfft(x)) ** 2; F = np.fft.rfftfreq(len(x), 1 / sr)
        if S[F > 700].sum() / S.sum() > 0.05: bad(name, "not soft: energy above 700 Hz")
    print(info)
    fig, ax = plt.subplots(2, 1, figsize=(8, 5), constrained_layout=True); t = np.arange(len(x)) / sr
    ax[0].plot(t, x, lw=0.4, color="#7a1f3d"); ax[0].plot(np.arange(len(e)) / er, e * 1.414, lw=1, color="#c9a457"); ax[0].set_ylim(-1, 1); ax[0].set_xlim(0, t[-1]); ax[0].set_title(f"{name}  peak {pk:.2f}  {dur*1000:.0f} ms")
    ax[1].specgram(x + 1e-6 * np.random.default_rng(1).standard_normal(len(x)), NFFT=1024, Fs=sr, noverlap=896, cmap="magma", vmin=-110, vmax=-30); ax[1].set_ylim(0, 6000); ax[1].set_xlabel("s"); ax[1].set_ylabel("Hz")
    fig.savefig(os.path.join(D, name + ".png"), dpi=80); plt.close(fig)
print("FAILS", fails); sys.exit(1 if fails else 0)
