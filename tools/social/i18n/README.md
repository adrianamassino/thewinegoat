# Localised Instagram batches

One Instagram account per language (it, fr, de, ru, pl, es, es-ar, pt-br, nl). The English batch stays the source of truth:
the localised batch re-uses its layout, art, photos and timings and only swaps the words.

| File | What |
|---|---|
| `ui.js` | template strings per language (Swipe, Myth/Fact, badges "Vino · Livello 2", handle, CTA) + fonts |
| `fonts.css`, `../fonts/i18n/` | Fraunces / DM Sans / Roboto Condensed with full Latin Extended (Polish…), Literata + Manrope for Cyrillic (OFL) |
| `fit.js` | in-page: shrinks a text area's font sizes (to 80% at most) when a translation overflows it |
| `batch-03.js` | layout of batch 03 as a function of the language table (same slides as `../batches/batch-03.js`) |
| `en/batch-03.js` | English table: the schema to copy, and the length reference for the automatic heading fit |
| `<lang>/batch-03.js` | the translation; `names` (ru, es: local grape/place names), `voice` (spoken text where the caption has symbols), `fit` (exact sizes) |
| `<lang>/captions-batch-03.js` | captions, hashtags, alt text, story stickers, photo descriptions for the credit line |
| `<lang>/voice-batch-03.json` | spoken length of every reel scene (written by `voice.py tts`); scenes are stretched to fit |
| `load.js` | builds a language's batch for `build.js --lang=xx` |
| `voice.py` | voiceover: `tts` (Kokoro for it/fr/es/es-ar/pt-br, Piper via sherpa-onnx 1.12 for de/ru/pl/nl) and `mix` |
| `captions.js`, `readme.js` | write `social/instagram/<lang>/batch-03/captions.md` and `social/instagram/<lang>/README.md` |
| `build-lang.sh` | everything for one language: `build-lang.sh it stills`, then `build-lang.sh it reels` |

TTS models are not in the repo: `TTS_MODELS` (default `/home/claude/tts-models`) holds `kokoro.onnx`, `voices.bin` and the
`vits-piper-*` folders from the k2-fsa/sherpa-onnx GitHub release "tts-models" (de_DE-thorsten-high, ru_RU-irina-medium,
pl_PL-gosia-medium, nl_NL-pim-medium). Clips are cached in `TTS_CACHE` (default `/home/claude/tts-cache`).

Rules: facts exactly as in the verified English batch (translate, never add); no prices; never claim WSET affiliation or call
the questions official; no school names; "Pass / Merit / Distinction" stay in English. Check every slide in the contact sheet.
