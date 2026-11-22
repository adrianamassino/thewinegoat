# @the.winegoat · Instagram batch 04 (English) · voiceover reels

Files: `reels/` (6 MP4s, 1080×1920, 30 fps, H.264 + AAC, each under 9.5 MB so it uploads from the browser, plus a `_cover.png` to set as the cover). `preview.png` = the six covers side by side (the dashed band is the 4:5 crop shown on the profile grid). `contact-sheet.png` = cover + one frame per scene for every reel. `voice-check.md` = music style, voice, duration, size and measured loudness of every reel.
Rebuild: `NODE_PATH=$(npm root -g) node tools/social/build.js batch-04` (content and voiceover scripts in `tools/social/batches/batch-04.js`; one reel: add `--reels=<id>`). The TTS model files are not in the repo: they live in `/home/claude/tts-models` (or set `TWG_TTS_DIR`).

**What is new in this batch (owner feedback on batch 03)**
- **Every reel has a voice** reading the on-screen text: short, energetic sentences. Each scene lasts as long as its voice line (plus a short pause), and the burned-in caption shows exactly the sentence being spoken, so the reel works with the sound on and off.
- **Three voices, rotated:** bf_emma (British female), af_heart (American female), bm_george (British male). One voice per reel, each voice twice, never the same voice on two reels in a row. To swap a voice, change `voice` on the reel in the batch file and rebuild that reel.
- **Every reel has its own music.** The music library now has ten clearly different styles (lo-fi hip hop, bossa nova, upbeat pop, acoustic folk, synthwave, jazz swing, minimal house, cinematic strings, ukulele, funk), each with its own tempo, key, instruments and rhythm. A batch can't use the same style twice. All of it is original, composed in code.
- **Mix:** voice at about −16 LUFS, music turned down about 14 dB while the voice speaks and back up in the pauses. Final loudness about −15 LUFS with a true peak of −1.5 dBTP or lower, AAC 128 kbps. The measured numbers are in `voice-check.md`.
- Same reach rules as batch 03: the hook is readable in the very first frame, there's a new beat every 2–5 seconds, there's a countdown or pop-up reveal, and every reel ends asking for a one-word or one-number comment.

Imagery rules kept: no wine imagery on the Spirits, Beer and Sake reels (spirits bottle, tasting glass, barrel and brandy casks; barley, beer glasses; sake flask, cups, cedar box, thermometers). The white-wine reel shows only pale and gold wine and green-white grapes. There's one painted goat, at the end of the red Burgundy reel. Real photos are used only where they show exactly what the caption says. Course and level badge on every frame and cover. No prices, no affiliation claim, no school named, Pass/Merit/Distinction not mentioned.

---

## Suggested schedule (Europe/Rome), after batch 03 (last post Sat 2 Jan)

Reels do best **12:30–13:30 or 19:00–21:00** on weekdays and **11:00** at weekends. Share each reel to your story the same day with a poll or quiz sticker.

| Date | Time | Reel | Course · level | Format | Music | Voice |
|---|---|---|---|---|---|---|
{{SCHEDULE}}

**Engagement routine:** reply to every comment in the first hour, ideally with a question back. On the quiz reels (sweet whites, Burgundy, beer), wait a few hours before you post the answer as your own comment, so people keep guessing.

---

{{REELS}}

## Sources and checks
Every fact comes from the app content: Wine Level 1 (food and wine), Wine Level 2 (noble rot, icewine, Vendanges Tardives), Wine Level 3 (Burgundy hierarchy and labels), Spirits Levels 1–2 (caramel, age statements, ageing in barrel), Beer Level 1 (malt, hops, yeast, water) and Sake Level 1 (serving temperatures, ginjō styles, warming). It was cross-checked against the course books kept privately for the team, and nothing is quoted from them. Simplifications made on purpose: "Myth!" stamps refer to the popular belief as worded on screen. "Late harvest" is shown as the Alsace Vendanges Tardives term (riper grapes, sweeter wine). Sake temperatures are the three ranges taught at Level 1: chilled 6–13 °C, room temperature 15–18 °C, warm 40–50 °C.
