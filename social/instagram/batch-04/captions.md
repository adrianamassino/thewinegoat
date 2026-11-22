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
| Mon 4 Jan | 13:00 | Food & wine: myth or fact? | Wine · Level 1 | myth vs fact, 4 rounds, score comment, loop | bossa nova | bf_emma |
| Wed 6 Jan | 19:30 | 3 sweet whites, 3 tricks (guess it) | Wine · Level 2 | guess it: match 3 wines to 3 methods, countdown, reveals | lo-fi hip hop | af_heart |
| Fri 8 Jan | 13:00 | Rank the Burgundy pyramid | Wine · Level 3 | rank it, countdown, bottom-to-top reveal, twist, loop | cinematic strings | bm_george |
| Sun 10 Jan | 11:00 | 3 mistakes reading a spirits label | Spirits · Level 1 | 3 mistakes, recap, comment the number | jazz swing | bf_emma |
| Tue 12 Jan | 19:30 | Malt or hops? | Beer · Level 1 | this or that, 5 quick questions, pop reveals, score | funk | af_heart |
| Thu 14 Jan | 13:00 | POV: your friend wants to heat the daiginjō | Sake · Level 1 | POV, quick rules, comment your favourite | upbeat pop pluck | bm_george |

**Engagement routine:** reply to every comment in the first hour, ideally with a question back. On the quiz reels (sweet whites, Burgundy, beer), wait a few hours before you post the answer as your own comment, so people keep guessing.

---

## Reel 1 · Food & wine: myth or fact?
Files: `reels/reel-wine-food-myths.mp4` (36.8 s, 9.01 MB) + `_cover.png` · Wine · Level 1 · format: myth vs fact, 4 rounds, score comment, loop
**Music:** bossa nova (`bossa`) · **Voice:** bf_emma (British female) · measured -15.1 LUFS, true peak -1.7 dBTP

**Caption**
WINE · LEVEL 1
4 food & wine "rules" most people believe. All 4 are myths 👇
1. Sweet food makes wine taste sweeter → no: less sweet, more acidic. Pick a wine at least as sweet as the dish.
2. Salty food is hard to pair → no: salt makes wine seem less bitter, less acidic, fruitier.
3. Lemon makes a crisp wine too sharp → no: acidity in food makes wine seem less acidic and fruitier.
4. A strong wine cools the chilli → no: the burn gets stronger and the alcohol stands out more.

How many did you believe? Comment 0 to 4.
Practise free on thewinegoat.com

Photo: Petar Milošević, CC BY-SA 4.0, via Wikimedia Commons

#wset #wset1 #winestudent #foodandwine #winepairing #foodpairing #learnwine #winetasting #wineeducation #mythorfact #sommelier

**Alt text**
Animated reel on a cream background with a "Wine · Level 1" badge and a voiceover. Opens on "Food & wine: 4 myths" with drawings of a slice of strawberry cream cake, a dish of sea salt, a lemon wedge and a red chilli. Each myth is shown as a quote with a red "Myth!" stamp, then the fact: sweet food makes wine seem less sweet and more acidic, so pick a wine at least as sweet as the dish; salt makes wine seem less bitter, less acidic and fruitier; over a photo of grilled salmon with potatoes and lemon wedges, acidity in food makes wine seem less acidic and fruitier; chilli makes the burn stronger and the alcohol stand out more. Ends asking "How many did you believe? Comment 0 to 4". Captions match the voice; original bossa nova music.

**Voiceover script** (one line per scene; each sentence is also the burned-in caption while it is spoken)
1. Four food and wine myths. How many do you believe?
2. Sweet food makes wine taste sweeter? Myth! It makes wine seem less sweet, and more acidic. Pick a wine at least as sweet as the dish.
3. Salty food is hard to pair? Myth! Salt makes wine seem less bitter, less acidic, and fruitier.
4. Lemon on the fish makes a crisp wine too sharp? Myth! Acidity in food makes wine seem less acidic, and fruitier.
5. A strong wine cools down the chilli? Myth! The burn gets stronger, and the alcohol stands out more.
6. How many did you believe? Comment zero to four. Practise free on thewinegoat.com.

---

## Reel 2 · 3 sweet whites, 3 tricks (guess it)
Files: `reels/reel-wine-sweet-whites-guess.mp4` (35.5 s, 8.98 MB) + `_cover.png` · Wine · Level 2 · format: guess it: match 3 wines to 3 methods, countdown, reveals
**Music:** lo-fi hip hop (`lofi`) · **Voice:** af_heart (American female) · measured -15.3 LUFS, true peak -1.6 dBTP

**Caption**
WINE · LEVEL 2
3 sweet white wines. 3 ways to get the sugar. Can you match them? 🍯
Tricks: 1 a fungus · 2 frozen grapes · 3 a late harvest
Wines: A Sauternes · B Icewine (Eiswein) · C Alsace Vendanges Tardives

Lock in your answer before the countdown ends. The reveal is at the end.

How many did you match? Comment 0 to 3.
Practise free on thewinegoat.com

Photo (cover cut-out): Franz van Duns, CC BY-SA 4.0, via Wikimedia Commons (adapted)

#wset #wset2 #winestudent #sweetwine #sauternes #icewine #eiswein #noblerot #alsace #learnwine #winequiz #dessertwine

**Alt text**
Animated reel on a deep green background with a "Wine · Level 2" badge and a voiceover. Opens on "3 sweet whites. 3 tricks." with three drawn glasses of gold, pale and light white wine labelled A, B and C. It lists three tricks (a fungus pierces the skins, the grapes freeze on the vine, picked late and extra ripe) and three wines (Sauternes, Icewine, Alsace Vendanges Tardives), then a 3-second countdown. Reveals: Sauternes is noble rot; icewine is frozen on the vine and pressed while still frozen, with a drawn snowflake; Vendanges Tardives is late harvest. Ends asking how many you matched. The cover shows a cut-out bunch of green-white grapes next to the three glasses. Captions match the voice; original lo-fi hip hop music.

**Voiceover script** (one line per scene; each sentence is also the burned-in caption while it is spoken)
1. Three sweet whites. Three tricks. Can you match them?
2. One: a fungus. Two: frozen grapes. Three: a late harvest.
3. Sauternes, icewine, or Vendanges Tardives? Match them!
4. Sauternes: noble rot. The fungus pierces the skins, and water evaporates. Sugar, acid and flavour concentrate.
5. Icewine: grapes frozen on the vine. They are pressed while still frozen, so the ice stays behind.
6. Vendanges Tardives: late harvest. Riper grapes, sweeter wine.
7. How many did you match? Comment zero to three.

---

## Reel 3 · Rank the Burgundy pyramid
Files: `reels/reel-wine-burgundy-rank.mp4` (45.6 s, 9 MB) + `_cover.png` · Wine · Level 3 · format: rank it, countdown, bottom-to-top reveal, twist, loop
**Music:** cinematic strings (`cinematic`) · **Voice:** bm_george (British male) · measured -15 LUFS, true peak -1.6 dBTP

**Caption**
WINE · LEVEL 3
Rank these 4 red Burgundies from lowest to highest 👇
A · Chambertin
B · Bourgogne
C · Gevrey-Chambertin
D · Gevrey-Chambertin Premier Cru

Hint: the trap is in the names 👀 Write your order before the reveal.

Comment your score out of 4.
Practise free on thewinegoat.com

Photo: © Pierre André, CC BY-SA 4.0, via Wikimedia Commons

#wset #wset3 #winestudent #burgundy #bourgogne #pinotnoir #grandcru #premiercru #gevreychambertin #winequiz #sommelier #learnwine

**Alt text**
Animated reel on a deep burgundy background with a "Wine · Level 3" badge and a voiceover. Opens over a photo of vine rows leading to the Château de la Tour in the Clos de Vougeot with "Burgundy: lowest → highest". Lists A Chambertin, B Bourgogne, C Gevrey-Chambertin, D Gevrey-Chambertin Premier Cru, then a countdown. Drawn red-wine bottles with generic labels reveal the order with pop-ups: Bourgogne, regional; Gevrey-Chambertin, village; Premier Cru, village plus vineyard; Chambertin, grand cru with its own appellation. Then the trap: Gevrey-Chambertin is the village, Chambertin the grand cru. Ends on "B · C · D · A" with a painted goat on a barrel raising a glass of red wine. Captions match the voice; original cinematic strings music.

**Voiceover script** (one line per scene; each sentence is also the burned-in caption while it is spoken)
1. Four red Burgundies. Rank them, lowest to highest.
2. Chambertin. Bourgogne. Gevrey-Chambertin. Gevrey-Chambertin Premier Cru. Lock it in!
3. Bottom: Bourgogne. The regional level.
4. Next: Gevrey-Chambertin. A village.
5. Then Premier Cru: the village name, plus the vineyard.
6. Top: Chambertin, a grand cru. Its own appellation, so only the vineyard is on the label.
7. The trap? Many villages added the name of their famous grand cru. Gevrey-Chambertin is the village. Chambertin is the grand cru.
8. B, C, D, A. Comment your score!

---

## Reel 4 · 3 mistakes reading a spirits label
Files: `reels/reel-spirits-label-mistakes.mp4` (32.2 s, 9.01 MB) + `_cover.png` · Spirits · Level 1 · format: 3 mistakes, recap, comment the number
**Music:** jazz swing (`swing`) · **Voice:** bf_emma (British female) · measured -15.1 LUFS, true peak -1.7 dBTP

**Caption**
SPIRITS · LEVEL 1
3 mistakes people make reading a spirits label (no. 3 is sneaky) 🥃
1. "Darker means older." Not always: many blenders add a little caramel to keep the same colour batch after batch.
2. "12 years is the average age." No: an age statement is the age of the youngest spirit in the blend.
3. "Ten years in my cupboard makes it 22." Sorry: ageing happens in the barrel. Time in the bottle doesn't count.

Which one got you? Comment 1, 2 or 3.
Practise free on thewinegoat.com

Photo: Vyacheslav Argenberg, CC BY 4.0, via Wikimedia Commons

#wsetspirits #wset #spirits #whisky #brandy #spiritseducation #learnspirits #spiritsstudent #bartender #whiskylover #mixology

**Alt text**
Animated reel on a whisky-brown background with a "Spirits · Level 1" badge and a voiceover. Opens on "3 mistakes reading a spirits label" with a drawn amber spirits bottle with a plain label and a tasting glass. Mistake 1, "Darker means older", gets a "Not always!" stamp: many blenders add a little caramel for the same colour batch after batch. Mistake 2, "12 years is the average age": the age shown is the youngest spirit in the blend. Mistake 3, over a photo of numbered oak brandy casks in a cellar in Yerevan: "It kept ageing in the bottle"; ageing happens in the barrel, time in bottle does not count. A recap, then "Which one got you? Comment 1, 2 or 3" with a drawn barrel. Captions match the voice; original jazz swing music.

**Voiceover script** (one line per scene; each sentence is also the burned-in caption while it is spoken)
1. Three mistakes people make reading a spirits label. Number three is sneaky.
2. Darker means older? Not always! Many blenders add a little caramel, to keep the same colour batch after batch.
3. Twelve years is the average age? No. It is the age of the youngest spirit in the blend.
4. Ten years in my cupboard, so it is twenty-two now? Sorry! Ageing happens in the barrel, not the bottle.
5. Colour is not age. Age means the youngest. Bottle years do not count.
6. Which one got you? Comment one, two or three.

---

## Reel 5 · Malt or hops?
Files: `reels/reel-beer-malt-or-hops.mp4` (27.9 s, 8.99 MB) + `_cover.png` · Beer · Level 1 · format: this or that, 5 quick questions, pop reveals, score
**Music:** funk (`funk`) · **Voice:** af_heart (American female) · measured -15.2 LUFS, true peak -1.7 dBTP

**Caption**
BEER · LEVEL 1
Malt or hops? Answer fast 🍺
1. The bitterness
2. The colour
3. Coffee and roast notes
4. Banana and clove
Bonus: the biggest ingredient in beer

Say your answers out loud before each pop-up. Question 4 is a trap.

Your score out of 5? Comment it 👇
Practise free on thewinegoat.com

Photo: Dietmar Rabich, CC BY-SA 4.0, via Wikimedia Commons

#wsetbeer #wset #beer #beereducation #learnbeer #craftbeer #malt #hops #brewing #beerquiz #beerlover

**Alt text**
Animated reel on an amber background with a "Beer · Level 1" badge and a voiceover. Opens over a photo of a barley field at golden hour with "Malt or hops?". Each question shows two buttons, Malt and Hops, then a pop-up answer: bitterness, hops (added early in the boil = more bitter); colour, malt (kilned longer and hotter, or roasted); coffee and roast notes, malt, with a drawn glass of dark beer and an ear of barley; banana and clove, "Neither! It's the yeast", with a drawn hazy wheat beer; the biggest ingredient, water. Ends asking for your score out of 5 with three drawn beers. Captions match the voice; original funk music.

**Voiceover script** (one line per scene; each sentence is also the burned-in caption while it is spoken)
1. Malt or hops? Five beer questions. Answer fast!
2. The bitterness? Hops! The earlier they go into the boil, the more bitter the beer.
3. The colour? Malt! Speciality malts are kilned longer and hotter, or roasted.
4. Coffee and roast notes? Malt again, from heavily roasted malts.
5. Banana and clove? Neither! That is the yeast.
6. Bonus: the biggest ingredient in beer? Water, by far.
7. How many out of five? Comment your score.

---

## Reel 6 · POV: your friend wants to heat the daiginjō
Files: `reels/reel-sake-pov-warm-or-chilled.mp4` (38 s, 8.99 MB) + `_cover.png` · Sake · Level 1 · format: POV, quick rules, comment your favourite
**Music:** upbeat pop pluck (`pop`) · **Voice:** bm_george (British male) · measured -15 LUFS, true peak -1.8 dBTP

**Caption**
SAKE · LEVEL 1
POV: your friend wants to heat the junmai daiginjō 🔥❄️
Stop! Daiginjō is a ginjō style: heat kills its fruity, floral aromas. Serve it chilled (6–13 °C).
What can you warm? Junmai, honjōzō and futsū-shu: chilled, room temperature (15–18 °C) or warm all work.
Warm = 40–50 °C: put the flask in water at about 80 °C and use a thermometer.
Warm sake seems more intense, fuller and more acidic. Great with food.
Sparkling sake? Chilled only.

Chilled, room temperature or warm: which is your favourite? Comment below.
Practise free on thewinegoat.com

#wsetsake #wset #sake #nihonshu #japanesesake #daiginjo #junmai #sakelover #sakeeducation #learnsake #warmsake

**Alt text**
Animated reel on an indigo background with a "Sake · Level 1" badge and a voiceover. Opens on "POV: your friend wants to heat the daiginjō" with a drawn white sake flask with a blue band, a small cup and a red thermometer. "Stop! Ginjō styles: serve chilled", with a blue thermometer: heat kills the fruity, floral aromas; chilled is 6–13 °C. Junmai, honjōzō and futsū-shu can be chilled, room temperature or warm, with three thermometers. Warm is 40–50 °C, the flask in water at about 80 °C, always with a thermometer. Warm sake seems more intense, fuller and more acidic. Sparkling sake: chilled only. Ends with a drawn cedar box and cup asking for your favourite. Captions match the voice; original upbeat pop music.

**Voiceover script** (one line per scene; each sentence is also the burned-in caption while it is spoken)
1. POV: your friend wants to heat the junmai daiginjō.
2. Stop! Daiginjō is a ginjō style. Heat kills its fruity, floral aromas. Serve it chilled.
3. So what can you warm? Junmai, honjōzō and futsū-shu. Chilled, room temperature or warm: all fine.
4. Warm means forty to fifty degrees. Use a water bath, and a thermometer.
5. Warm sake seems more intense, fuller and more acidic. Great with food.
6. Sparkling sake? Chilled only.
7. Chilled, room temperature or warm? Comment your favourite.

---


## Sources and checks
Every fact comes from the app content: Wine Level 1 (food and wine), Wine Level 2 (noble rot, icewine, Vendanges Tardives), Wine Level 3 (Burgundy hierarchy and labels), Spirits Levels 1–2 (caramel, age statements, ageing in barrel), Beer Level 1 (malt, hops, yeast, water) and Sake Level 1 (serving temperatures, ginjō styles, warming). It was cross-checked against the course books kept privately for the team, and nothing is quoted from them. Simplifications made on purpose: "Myth!" stamps refer to the popular belief as worded on screen. "Late harvest" is shown as the Alsace Vendanges Tardives term (riper grapes, sweeter wine). Sake temperatures are the three ranges taught at Level 1: chilled 6–13 °C, room temperature 15–18 °C, warm 40–50 °C.
