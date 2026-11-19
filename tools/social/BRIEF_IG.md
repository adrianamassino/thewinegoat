# Brief: Instagram content for @the.winegoat — ENGLISH ONLY

The Wine Goat (thewinegoat.com) is an independent exam-prep app for wine and spirits students (Wine Levels 1–3, Spirits Levels 1–2; quizzes with explanations, flashcards, mock exams, podcasts, animated films, label scanner, study plan). Instagram account: @the.winegoat.

## Rules (owner's)
- **English only.**
- Educational content: real wine/spirits knowledge, quizzes, myths, memory tricks, tasting tips. Not salesy. At most a soft last line "Practise free on thewinegoat.com" / "Link in bio".
- **Never mention prices, discounts or payment.** Never claim to be WSET or affiliated; never call our questions official; don't copy textbook wording. "WSET" may appear as a hashtag/keyword only.
- Brand look: professional, wine colours (burgundy #6b1f3a / plum #3e0f22, cream #fbf7f1, gold #d4a23a), elegant serif headings (e.g. Fraunces/Playfair from Google Fonts), clean sans body; not childish.
- Goats are the brand: use the painted goats in `/home/claude/thewinegoat/img/goats/*.webp` (varied ones). The logo goat (dancing goat with cape and glass, `img/logo*.png/webp`) appears ONLY as the small logo, never as an illustration. Wordmark "the wine goat" is all lowercase (`img/wordmark.webp` / `img/logo-full.webp`).
- Facts must be correct (use the app content for facts: `app/l2/content.js`, `app/l1/content.js`, `app/spirits/s1/content.js`, `app/spirits/s2/content.js` — English is index 2 of each [it,fr,en,es] array). Neutral wording.

## Deliverables (batch 1) → `/home/claude/thewinegoat/social/instagram/batch-01/`
1. **6 feed posts** as carousels, 1080×1350 PNG, 3–6 slides each (hook slide → content → recap/quiz answer → soft CTA slide). Topics, one each:
   a. "Cool vs warm climate: same grape, two wines" (Chardonnay/Sauvignon examples)
   b. Quiz carousel "Which grape is it?" (3 questions, answer on next slide)
   c. "Pot still vs column still in 5 slides" (spirits)
   d. "How to read a German wine label" (Prädikat levels)
   e. "Serving temperatures cheat sheet" (styles → °C/°F)
   f. "5 tasting mistakes students make" (systematic tasting)
2. **6 stories**, 1080×1920 PNG: quiz-style ("A or B?" with the answer revealed in a 2nd frame — make them as pairs: question frame + answer frame, 3 pairs) — leave the space Instagram uses for stickers/UI (top 250 px, bottom 300 px) clear of text.
3. **2 Reels**, 1080×1920 MP4 (H.264, AAC silent track ok, 15–30 s, 30 fps): animated text + goat illustrations with gentle motion (render HTML frames with Playwright, assemble with ffmpeg at /usr/local/bin/ffmpeg). Topics: "3 grapes in 15 seconds" and "Neutral spirit: 96% in 20 seconds" (only facts from the app content). Burned-in captions (no voice needed). Also export a 1080×1920 cover PNG for each.
4. `captions.md`: for every post/reel the caption (hook line, 3–8 short lines, question to drive comments, soft CTA, 10–15 hashtags mixing #wset #wset2 #wset3 #winestudent #sommelier #winelover #spirits etc.), alt text, and a suggested posting order and times (Europe/Rome) over 2 weeks.
5. A contact sheet `preview.png` (all thumbnails) for quick review.

Build with HTML/CSS rendered by Playwright (Chromium pre-installed; `NODE_PATH=$(npm root -g) node …`; screenshots at the exact pixel size, deviceScaleFactor 1). Keep the source (HTML templates + a build script) in `tools/social/` so later batches can be generated the same way. Check every image visually (Read the PNGs) before finishing: no text overflow, readable at phone size, no typos.
Do not commit. Reply with the list of files and anything to check.
