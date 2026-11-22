# batch-04 · voice check

Measured on the final MP4s (AAC) with ffmpeg `ebur128=peak=true` and `silencedetect=n=-45dB:d=0.3`; voice and music levels from the mix stage (lib/voice.py, BS.1770 gating).
Targets: voice about −16 LUFS, music about 14 dB under the voice while it speaks, final −14 to −16 LUFS integrated, true peak ≤ −1.5 dBTP, no silent gaps.

| # | Reel | Course | Music style | Voice | Duration | Size | Final I (LUFS) | True peak (dBTP) | LRA (LU) | Voice (LUFS) | Music under voice (LUFS) | Music bed, no voice (LUFS) | Min short-term (LUFS) | Silent gaps |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | reel-wine-food-myths | Wine · Level 1 | bossa | bf_emma | 36.8 s | 9.01 MB | -15.1 | -1.7 | 1.4 | -16 | -30 (−14 dB) | – | -16.4 | 0 |
| 2 | reel-wine-sweet-whites-guess | Wine · Level 2 | lofi | af_heart | 35.5 s | 8.98 MB | -15.3 | -1.6 | 2.5 | -16 | -29.9 (−13.9 dB) | -21.5 | -21.5 | 0 |
| 3 | reel-wine-burgundy-rank | Wine · Level 3 | cinematic | bm_george | 45.6 s | 9 MB | -15 | -1.6 | 1.9 | -16 | -29.6 (−13.6 dB) | -21.2 | -20.5 | 0 |
| 4 | reel-spirits-label-mistakes | Spirits · Level 1 | swing | bf_emma | 32.2 s | 9.01 MB | -15.1 | -1.7 | 1.3 | -16 | -29.8 (−13.8 dB) | – | -17.2 | 0 |
| 5 | reel-beer-malt-or-hops | Beer · Level 1 | funk | af_heart | 27.9 s | 8.99 MB | -15.2 | -1.7 | 1.7 | -16 | -29.8 (−13.8 dB) | – | -16.6 | 0 |
| 6 | reel-sake-pov-warm-or-chilled | Sake · Level 1 | pop | bm_george | 38 s | 8.99 MB | -15 | -1.8 | 1.4 | -16 | -29.9 (−13.9 dB) | – | -16.2 | 0 |

Voices: bf_emma = British female (en-gb), af_heart = American female (en-us), bm_george = British male (en-gb). One voice per reel, rotated so neighbouring reels never share one.
Change a voice: set `voice` on the reel (or `voice` on the batch / `TWG_VOICE` for all) in tools/social/batches/batch-04.js and rebuild that reel with `--reels=<id>`.

Music library (tools/social/lib/music.py, original, synthesised in code). ✔ = used in this batch (each style at most once):
- ✔ **lofi**: lo-fi hip hop · 76 BPM · F minor · dusty Rhodes, swung boom-bap, vinyl crackle
- ✔ **bossa**: bossa nova · 132 BPM · D minor · nylon guitar, rimshot clave, shaker
- ✔ **pop**: upbeat pop pluck · 120 BPM · A major · synth-pluck arps, four-on-the-floor, claps
- · **folk**: acoustic folk · 92 BPM · E major · fingerpicked guitar, stomp and clap, whistle
- · **synthwave**: synthwave · 100 BPM · A minor · detuned saw pads, gated arps, driving bass
- ✔ **swing**: jazz swing · 168 BPM · B-flat major · piano comping, walking bass, swung ride
- · **house**: minimal house · 124 BPM · F minor · organ stabs, offbeat hats, sub bass
- ✔ **cinematic**: cinematic strings · 70 BPM · C minor · string ensemble, spiccato ostinato, low drums
- · **ukulele**: ukulele · 112 BPM · C major · uke strums, glockenspiel, finger snaps
- ✔ **funk**: funk · 104 BPM · E minor · slap bass, muted guitar scratch, brass stabs

Listen-check by analysis (30 s render of each used style; tempo from onset autocorrelation, key from a pitch-class profile, so half-time/relative-key readings are expected):

| Style | Measured tempo | Key reading | Spectral centroid | Energy < 200 Hz | Energy > 4 kHz |
|---|---|---|---|---|---|
| bossa | 66 (= 132 half-time) | E min (relative/close to D minor ii–V) | 2.3 kHz | 0.33 | 0.31 |
| lofi | 76 | F min | 1.8 kHz | 0.50 | 0.17 |
| cinematic | 70 | E-flat maj (relative of C minor) | 0.9 kHz | 0.40 | 0.04 |
| swing | 84 (= 168 half-time) | F maj (dominant of B-flat) | 3.9 kHz | 0.30 | 0.27 |
| funk | 104 | E min | 4.5 kHz | 0.21 | 0.57 |
| pop | 60 (= 120 half-time) | A maj | 3.5 kHz | 0.30 | 0.28 |

The six reels use six different tempos (70–168 BPM), keys, instrument sets and rhythms (cut-time bossa clave, swung boom-bap, rubato strings with taiko-style hits, swing ride with walking bass, 16th-note slap funk, four-on-the-floor pop). The music has a 2–5 kHz presence dip under the voice.
