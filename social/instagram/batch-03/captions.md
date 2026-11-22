# @the.winegoat · Instagram batch 03 (English)

Files: `posts/<post>/` (carousels, 1080×1350, upload slides in numeric order), `reels/` (MP4 1080×1920, 30 fps, H.264 + AAC, each under 10 MB so it uploads from the browser, plus a `_cover.png` to set as the cover), `stories/` (4 single interactive frames, 1080×1920).
`preview.png` = the profile grid (4 columns) with batch 03 on top of the 20 published posts, the pinned quiz first. `contact-sheet.png` = every slide, story and reel scene.
Rebuild: `NODE_PATH=$(npm root -g) node tools/social/build.js batch-03` (content in `tools/social/batches/batch-03.js`, reel animation in `tools/social/templates/reel-viral.html`).

**What is new in this batch: built for reach.**
- Reels open on the hook itself (big text visible in the very first frame, no fade-in), change beat every 1–2 seconds (punch-in titles, timed lines, a 3-second countdown, pop-up reveals), keep the answer for the end, and finish on a frame that leads back into the start, so they loop and get rewatched. Every reel asks for a comment with a one-word answer (a letter, a number, a name), which is the easiest comment to leave.
- Carousels are high-save formats: two cheat sheets, an X vs Y table, two myth-or-fact decks, a mistakes deck and a decision flow, with "test yourself" questions and the answer on the next slide (swipes count as engagement). Every last slide says **Save this · Share with your study buddy · Practise free on thewinegoat.com**.
- Music: original tracks synthesised in code (`tools/social/lib/music.py`), one mood per course, with a short fade-out so the loop feels natural. Keep it, or swap in a trending sound in the app (lower the original track if you do).

Grid: no two neighbouring tiles share a background family (cream / burgundy / course colour), photo tiles (arch or frame panel) alternate with solid-colour tiles and white editorial cut-out tiles. Imagery rules kept: no wine imagery on Spirits, Sake or Beer; white-wine topics with white grapes or pale wine; painted goats only on red-wine topics (POV reel, black-grapes cheat sheet, Port, rank reel) and the neutral traveller goat on the level guide; real photos only where they show exactly the subject. Photos that carry a CC BY / BY-SA licence need the **Photo:** line at the end of the caption (already written below).

---

## Suggested schedule (Europe/Rome), after batch 02 (last post Sun 13 Dec)

Best times for this audience (students and wine professionals in Europe): **Reels 12:30–13:30 or 19:00–21:00** on weekdays, **carousels 18:00–19:00** on weekdays and **10:30–11:30** at weekends; stories at lunch and in the evening. After two weeks, check Insights → "Most active times" and move the slots to your real peaks.

| Date | Time | What | Course · level | Tile |
|---|---|---|---|---|
| Mon 14 Dec | 13:00 | Reel: Lightest to fullest? (rank by body) | Wine · Level 1 | cream editorial |
| Tue 15 Dec | 18:30 | Carousel: 5 beer mistakes you can taste | Beer · Level 1 | amber, photo arch |
| Wed 16 Dec | 13:00 | Reel: Guess the grape in 3 clues | Wine · Level 2 | cream, photo arch |
| Thu 17 Dec | 12:30 | Story 1: poll, screwcap or cork | Wine · Level 3 | — |
| Thu 17 Dec | 18:30 | Carousel: 5 wine "facts" that are wrong | Wine · Level 3 | green, photo frame |
| Fri 18 Dec | 13:00 | Reel: Guess the spirit in 3 clues | Spirits · Level 1 | brown, photo frame |
| Sat 19 Dec | 11:00 | Carousel: 6 black grapes, 1 cheat sheet | Wine · Level 2 | burgundy, photo arch |
| Sun 20 Dec | 13:00 | Reel: Can you spot the faulty wine? | Wine · Level 3 | green, solid |
| Sun 20 Dec | 19:00 | Story 2: quiz, which one is NOT a fault | Wine · Level 3 | — |
| Mon 21 Dec | 18:30 | Carousel: Sake myths | Sake · Level 1 | white editorial |
| Tue 22 Dec | 13:00 | Reel: POV, your first blind tasting | Wine · Level 3 | burgundy, solid |
| Wed 23 Dec | 12:30 | Story 3: slider, ready for blind tasting? | Wine · Level 3 | — |
| Wed 23 Dec | 18:30 | Carousel: Cognac vs Armagnac | Spirits · Level 2 | brown, solid |
| Sat 26 Dec | 11:00 | Reel: Place or grape? Old World vs New World | Wine · Level 2 | white editorial |
| Sun 27 Dec | 18:30 | Carousel: Ruby or Tawny? Port, decoded | Wine · Level 4 (Diploma) | burgundy, photo arch |
| Mon 28 Dec | 19:00 | Story 4: quiz, bubbles on the beer glass | Beer · Level 1 | — |
| Tue 29 Dec | 13:00 | Reel: Red flags at a wine tasting | Wine · Level 1 | green, solid |
| Sat 2 Jan | 11:00 | Carousel: Which level is right for you? (new-year plans) | Wine · Levels 1–4 | cream, solid |

Keep the batch-02 quiz pinned. Optional: pin the "Which level is right for you?" carousel as a second pin in January.

**Engagement routine (it matters as much as the post):** reply to every comment in the first hour, ideally with a question back; on quiz reels and carousels, wait a few hours before you reveal the answer in your own comment, so people keep guessing; share each new reel and carousel to your story with a poll or "Answer in the post" sticker the same day.

**Stories:** each frame leaves empty space under the text for Instagram's sticker. Add it in the app:
1. Poll sticker: "Screwcap" / "Cork". Next frame (optional): repost the myth-or-fact carousel.
2. Quiz sticker with the three options, correct answer **B, Tartrate crystals** (harmless, flavourless; cold speeds them up). Then link to the faulty-wine reel.
3. Emoji slider (🍷), "How ready are you for blind tasting?". Then share the POV reel.
4. Quiz sticker, correct answer **B, The glass is not clean**. Then link to the beer carousel.

---

## 3 talking-head reel ideas to record on your phone (15–30 s, trending-audio friendly)

Film vertically, face to camera, text on screen for every line (Instagram's auto-captions are fine), a trending sound at low volume underneath. Keep the first sentence on screen from frame one.

**1 · "The tasting note mistake that costs marks" (about 20 s)**
On-screen hook: *Stop writing "ruby to garnet".*
"If you're sitting Level 3, stop writing ranges. 'Ruby to garnet' is not specific enough, so it doesn't score. Pick one. Same for intensity: pale, medium or deep, one word. Decide low, medium or high first, then add a plus or a minus. Save this for your mock tasting, and comment 'tasting' if you want more of these."
(Facts: Level 3 tasting guidance on using one SAT term per line.)

**2 · "Three wines, one question: which is the fullest?" (about 25 s)**
Props: three glasses or bottles (Beaujolais, Côtes du Rhône, a Californian Cabernet Sauvignon), or just hold up three cards.
"Lightest to fullest: Beaujolais, Côtes du Rhône, Californian Cabernet. Pause, rank them, comment your order. … Beaujolais is light, Côtes du Rhône medium, Californian Cabernet full. And the plot twist: Sauternes, a sweet white, is full-bodied too. Body is how mouth-filling the wine feels, not its colour."

**3 · "Things you only hear at a wine course" (about 15–20 s, quick cuts)**
Lines, one per cut, delivered deadpan, each with the real meaning on screen (no real people or brands):
"'Is it medium-plus or just medium?' … 'It smells of… wine.' … 'I'm not drinking, I'm revising.' (spitting) … 'Can I have a white surface?' (to judge colour)."
End: "Which one have you said? Comment the number. Practise free on thewinegoat.com."

---

## Reel 1 · Lightest to fullest? (rank by body)
Files: `reels/reel-wine-rank-by-body.mp4` (17 s, original music: warm piano) + `_cover.png` · format: rank it, countdown, reveal, twist, loop

**Caption**
WINE · LEVEL 1
Rank these 3 reds from lightest to fullest body 👇
A · Californian Cabernet Sauvignon
B · Beaujolais
C · Côtes du Rhône
Comment your order before you watch the reveal.
Body is how mouth-filling a wine feels, judged on the palate, not by the colour.
Bonus: Sauternes, a sweet white, is full-bodied too.

Got 3/3? Send this to the friend you taste with.
Practise free on thewinegoat.com

#wset #wset1 #wset2 #winestudent #winetasting #learnwine #winequiz #beaujolais #cotesdurhone #cabernetsauvignon #sommelier #wineeducation

**Alt text**
Animated reel on a cream background with a "Wine · Level 1" badge. Opens on the question "Rank these lightest → fullest" with three options: A, Californian Cabernet Sauvignon; B, Beaujolais; C, Côtes du Rhône, then a 3-second countdown. Body is explained as how mouth-filling a wine feels. Drawn glasses of red wine of increasing depth reveal Beaujolais as light, Côtes du Rhône as medium and Californian Cabernet as full, then a gold glass: Sauternes is full-bodied too. Ends on "B · C · A" with a painted goat leaping with a glass of red wine. Captions are burned in; original background music.

---

## Reel 2 · Guess the grape in 3 clues
Files: `reels/reel-wine-guess-the-grape.mp4` (17 s, original music: warm piano) + `_cover.png` · format: 3 clues, countdown, reveal, loop

**Caption**
WINE · LEVEL 2
3 clues. 1 white grape. Can you name it at clue 1? 🍋
Clue 1: aromatic, high acidity, usually no new oak.
Clue 2: from dry to sweet; often light-bodied on the Mosel.
Clue 3: with age, honey and petrol.
Type your answer before the reveal, then tell us which clue gave it away: 1, 2 or 3?

Practise free on thewinegoat.com

Photos: Julian Herzog, CC BY 4.0; Dietmar Rabich, CC BY-SA 4.0 (via Wikimedia Commons)

#wset #wset2 #wset3 #winestudent #blindtasting #guessthegrape #winequiz #whitewine #mosel #learnwine #sommelier #winetasting

**Alt text**
Animated reel on a cream background with a "Wine · Level 2" badge. Opens over a close-up photo of ripe pale-green grapes on the vine with the text "3 clues. 1 white grape." Clue 1: aromatic, with high acidity (lemon, lime, green apple; usually made without new oak). Clue 2 over a photo of the Mosel river between vine-covered slopes at Neumagen-Dhron: from dry to sweet, often light-bodied on the Mosel. Clue 3: honey and petrol with age. A 3-second countdown, then the answer, "It's Riesling", with a drawn glass of pale white wine and "Mosel · Alsace · Clare & Eden Valley". Ends asking which clue gave it away. Captions are burned in; original background music.

---

## Reel 3 · Guess the spirit in 3 clues
Files: `reels/reel-spirits-guess-the-spirit.mp4` (18.6 s, original music: jazzy electric piano) + `_cover.png`

**Caption**
SPIRITS · LEVEL 1
Guess the spirit in 3 clues 🌿 No, it's not vodka.
Clue 1: usually colourless and unaged.
Clue 2: a neutral spirit, flavoured with plants: coriander seed, angelica, orris root, citrus peel.
Clue 3: one plant must lead. Resinous, piney.
Bonus: "London Dry" can be made anywhere. It tells you the flavours went in during redistillation.

At which clue did you get it? Comment 1, 2 or 3 👇
Practise free on thewinegoat.com

Photos: Sanjay Acharya, CC BY-SA 4.0; Scott Bauer, USDA, public domain (via Wikimedia Commons)

#wsetspirits #wset #spirits #gin #londondrygin #juniper #botanicals #spiritsstudent #bartender #mixology #spiritseducation #learnspirits

**Alt text**
Animated reel on a deep whisky-brown background with an amber "Spirits · Level 1" badge. Opens over a close-up photo of dried coriander seeds: "3 clues. 1 spirit." Clue 1: usually colourless and unaged, with a drawn clear bottle with a question mark on the label. Clue 2 over a photo of backlit slices of orange, lemon and lime: neutral spirit flavoured with plants. Clue 3: one plant must lead, resinous and piney, with a drawing of a juniper sprig with blue-black berries. A countdown, then "It's gin" with a drawn gin bottle and the rule "Juniper leads". Bonus: "London Dry" can be made anywhere. Captions are burned in; original background music.

---

## Reel 4 · Can you spot the faulty wine?
Files: `reels/reel-wine-spot-the-fault.mp4` (17 s, original music: warm piano) + `_cover.png`

**Caption**
WINE · LEVEL 3
Only one of these white wines is fine. Which would you drink? 🔍
A: crystals at the bottom → tartrates. Harmless and flavourless (cold speeds them up). Not a fault.
B: looks perfect, smells of damp cardboard, fruit muted → cork taint (TCA).
C: browner than it should be, toffee, honey, caramel or coffee, no freshness → oxidised.
Twist: in wines made in an oxidative style, those notes are the style, not a fault.

Did you pick A? Comment your letter 👇 Save this for your theory revision.
Practise free on thewinegoat.com

#wset #wset2 #wset3 #winestudent #winefaults #corked #tca #winetasting #sommelier #learnwine #wineeducation #whitewine

**Alt text**
Animated reel on a deep green background with a "Wine · Level 3" badge. Three drawn glasses of white wine labelled A, B and C: A has small white crystals at the bottom, B looks normal, C is amber-brown. A countdown asks viewers to pick. A is revealed as harmless tartrate crystals, "Not a fault"; B as cork taint (TCA), damp cardboard and muted fruit, with a drawing of a stained cork; C as oxidised, with toffee, honey, caramel or coffee notes and no freshness. A twist explains that oxidative notes are not a fault in wines made in that style. Ends on "Did you pick A?". Captions are burned in; original background music.

---

## Reel 5 · POV: your first blind tasting
Files: `reels/reel-wine-pov-blind-tasting.mp4` (16 s, original music: warm piano) + `_cover.png`

**Caption**
WINE · LEVEL 3
POV: your first blind tasting. Two wines, 30 minutes, no labels 🕵️
"It's… red." Good start: ruby is the most common red colour.
"It smells of… wine." Short sniffs: condition, intensity, development, then the aroma clusters one by one.
Medium(+)? Medium? Pick low, medium or high first, then refine.
"Ruby to garnet"? A range doesn't score. Pick one.
Quality? Count to four: balance, length, intensity, complexity.

Which step makes you panic? Tag your tasting buddy 👇
Practise free on thewinegoat.com

#wset #wset3 #wsetlevel3 #blindtasting #winestudent #winetasting #sommelier #tastingnotes #wineexam #learnwine #winelover #wineeducation

**Alt text**
Animated reel on a deep burgundy background with a "Wine · Level 3" badge. A painted goat detective with a magnifying glass and a glass of red wine opens with "POV: your first blind tasting. Two wines. 30 minutes. No labels." Beats: "It's… red." (ruby is the most common red), "Swirl. Sniff. It smells of… wine." (condition, intensity, development), "Medium(+)? Medium? Medium(−)?" with a goat peering over an open wine book, "You write 'ruby to garnet'" with a red "No mark" stamp, "Count to four" (balance, length, intensity, complexity; all four positive is outstanding). Ends with a winking goat holding red wine: "Glass 2 is already poured…". Captions are burned in; original background music.

---

## Reel 6 · Place or grape? Old World vs New World
Files: `reels/reel-wine-place-or-grape.mp4` (17.6 s, original music: warm piano) + `_cover.png` · format: this or that

**Caption**
WINE · LEVEL 2
Old World or New World? Read the label in 1 second 🏷️
Chablis → place. Inside: Chardonnay.
Cabernet Sauvignon, Maipo Valley → grape. Chile's most planted.
Rioja → place. A blend led by Tempranillo.
Bordeaux → place. Usually Cabernet Sauvignon + Merlot.
Plot twist: Alsace is in Europe, but its labels normally show the grape.
Rule of thumb: in Europe, often the place; elsewhere, often the grape.

Which label fooled you? Comment 1 to 5 👇 Send this to someone who orders "a Chablis and a Chardonnay".
Practise free on thewinegoat.com

#wset #wset1 #wset2 #winestudent #winelabels #oldworldwine #newworldwine #chablis #rioja #bordeaux #learnwine #sommelier #winetasting

**Alt text**
Animated reel on a cream background with a "Wine · Level 2" badge. Drawn wine bottles with generic labels appear one by one, each with a pop-up answer: Chablis (place; inside, Chardonnay), Cabernet Sauvignon from Maipo Valley, Chile (grape; Chile's most planted grape), Rioja (place; a blend led by Tempranillo), Bordeaux (place; a blend of Cabernet Sauvignon and Merlot). Plot twist: an Alsace Pinot Gris bottle, Europe but the grape is on the label. Rule of thumb: Europe often names the place, elsewhere often the grape. Captions are burned in; original background music.

---

## Reel 7 · Red flags at a wine tasting
Files: `reels/reel-wine-red-flags-tasting.mp4` (16.4 s, original music: warm piano) + `_cover.png`

**Caption**
WINE · LEVEL 1
6 red flags at a wine tasting 🚩 How many have you seen?
1 Heavy perfume (the room should be free of strong smells)
2 Brushing your teeth just before (toothpaste and coffee distort the wine)
3 A glass full to the brim (about 5 cl is enough, with room to swirl)
4 Glasses that smell of detergent
5 Nowhere to spit (and no water: dehydration dulls your sense of smell)
6 Dim lighting (you need good light and a white surface for colour)

Comment the number you've seen most 👇 Send this to your tasting group.
Practise free on thewinegoat.com

#wset #wset1 #wset2 #winetasting #winestudent #tastingroom #learnwine #wineclub #sommelier #winelover #wineeducation

**Alt text**
Animated reel on a deep green background with a "Wine · Level 1" badge and a drawn red flag on a wooden pole. "6 red flags at a tasting", then one per beat, each with the fix: heavy perfume (the room should be free of strong smells), brushing your teeth just before (toothpaste and coffee distort the wine), a glass full to the brim (about 5 cl leaves room to swirl), glasses that smell of detergent (odourless, no residue), nowhere to spit (spittoons nearby, drink water), dim lighting (good light and a white surface). Ends asking which one viewers have seen. Captions are burned in; original background music.

---

## Carousel 1 · 6 black grapes, 1 cheat sheet
Files: `posts/wine-black-grapes-cheat-sheet/` (8 slides) · cheat sheet + test yourself

**Caption**
WINE · LEVEL 2
6 black grapes. 1 cheat sheet. Save this before your exam 📌
Cabernet Sauvignon · Syrah/Shiraz · Tempranillo · Merlot · Pinot Noir · Grenache/Garnacha
Structure, key aromas and where to find them, on two slides.
Then test yourself: two questions, answers on the next slide.

Which two grapes do you always mix up? 👇
Save this · Share with your study buddy
Practise free on thewinegoat.com

Photo: Dietmar Rabich, CC BY-SA 4.0, via Wikimedia Commons

#wset #wset2 #wset3 #winestudent #grapevarieties #cabernetsauvignon #pinotnoir #syrah #tempranillo #merlot #grenache #learnwine #sommelier

**Alt text**
Eight-slide carousel on a deep burgundy background with a "Wine · Level 2" badge. 1: Photo of bunches of black grapes hanging from a vine pergola in Crete, with a burgundy arch-shaped panel reading "6 black grapes. 1 cheat sheet. Save this before your exam". 2: Cards for Cabernet Sauvignon (high tannin and acidity; blackcurrant, black cherry, green bell pepper, mint; Bordeaux Left Bank, Chile's most planted grape), Syrah/Shiraz (medium to high tannin and acidity; black fruit and black pepper; Northern Rhône, Barossa) and Tempranillo (medium acidity and tannin, medium to full body; strawberry, red cherry, blackberry, black plum; Rioja). 3: Merlot (medium tannin and acidity; softness; Saint-Émilion, Pomerol), Pinot Noir (high acidity, low to medium tannin, pale to medium colour; strawberry, raspberry, red cherry; Burgundy, Central Otago) and Grenache (high sugar, low acidity; strawberry, red plum, white pepper; Southern Rhône, Priorat, Barossa). 4–5: Question and answer: pale, high acidity, strawberry and raspberry is Pinot Noir. 6–7: Black fruit, black pepper, Northern Rhône is Syrah, the same grape as Shiraz. 8: "Which two grapes do you mix up?" with Save, Share and Practise free, and a painted goat with glasses and a pencil on wine books.

---

## Carousel 2 · 5 beer mistakes you can taste
Files: `posts/beer-five-serving-mistakes/` (7 slides) · mistakes to avoid

**Caption**
BEER · LEVEL 1
5 beer mistakes you can taste 🍺 (number 1 is everywhere)
1 Keeping it in the light: light strike gives a skunky, scorched-hair aroma. Brown glass blocks almost all of it.
2 Saving it "for later": most beers are best fresh.
3 Bubbles stuck to the glass: the glass isn't completely clean.
4 Pouring straight down: 45°, then upright to build the foam.
5 Serving every beer ice-cold: 3–7°C for pilsner, 7–12°C for porter or IPA, 12–15°C for barley wine or dubbel.

Which one are you guilty of? 👇 Send this to your beer buddy.
Practise free on thewinegoat.com

Photo: George Chernilevsky, public domain, via Wikimedia Commons

#wsetbeer #beer #beerstudent #craftbeer #beereducation #cicerone #beerserving #lightstruck #pilsner #ipa #beergeek #learnbeer

**Alt text**
Seven-slide carousel on a deep amber background with a golden "Beer · Level 1" badge. 1: Photo of empty bottles in brown, olive, green and blue glass casting coloured shadows, with an amber arch-shaped panel reading "5 beer mistakes you can taste". 2: Keeping it in the light: light strike; brown glass blocks almost all damaging light, green or clear glass little or none; drawings of brown, green and clear beer bottles. 3: Saving it for later: most beers are best fresh; check the date, keep it cool. 4: Bubbles stuck to the glass mean it is not completely clean. 5: Pouring straight down: tilt to 45°, then upright to build the foam; how to pour bottle-conditioned beer, weissbier and witbier. 6: Serving every beer ice-cold: well chilled 3–7°C, chilled 7–12°C, lightly chilled 12–15°C, with example styles and three drawn beers. 7: "Which one are you guilty of?" with Save, Send and Practise free.

---

## Carousel 3 · 5 wine "facts" that are wrong
Files: `posts/wine-myth-or-fact/` (7 slides) · myth or fact

**Caption**
WINE · LEVEL 3
5 wine "facts" that are wrong. Keep score 🧐
1 Thick legs = a better wine? Legs show alcohol and sugar.
2 All wine improves with age? Most wines are best within a year of bottling.
3 Screwcap = cheap? The closure is a winemaking choice; screwcaps keep fresh fruit longer than cork.
4 White wine needs white grapes? Black grapes can make white wine: the colour is in the skins.
5 More bubbles = better fizz? Bubbles depend a lot on how clean the glass is.

How many did you believe? Comment your score from 0 to 5 👇
Save this · Share with your study buddy
Practise free on thewinegoat.com

Photo: Alvesgaspar, CC BY-SA 4.0, via Wikimedia Commons

#wset #wset2 #wset3 #winestudent #winemyths #mythorfact #winefacts #winetasting #learnwine #sommelier #winelover #wineeducation

**Alt text**
Seven-slide carousel on a deep green background with a "Wine · Level 3" badge. 1: Photo of three corkscrews on a wooden table inside a thin cream frame, with a green panel reading "5 wine 'facts' that are wrong. Myth or fact? Keep score." 2–6: Myth (struck through) and fact cards: legs show alcohol and sugar, quality is judged on balance, length, intensity and complexity (drawn glass of red wine); most wines are best within a year of bottling, some such as Vintage Port need years (drawn bottle); the closure is a winemaking choice, screwcaps keep fresh fruit longer than cork (drawn bottle and cork); black grapes can make white wine because the colour is in the skins (drawn black grapes and a glass of pale white wine); bubbles cannot reliably show quality because the cleanliness of the glass changes them (drawn flute). 7: "Which one fooled you?" with Save, Share and Practise free.

---

## Carousel 4 · Sake myths
Files: `posts/sake-myth-or-fact/` (7 slides) · myth or fact, white editorial cover

**Caption**
SAKE · LEVEL 1
5 things people get wrong about sake 🍶
1 "Always served hot." Fruity ginjō styles are best chilled; others can be warmed to 40–50°C.
2 "Better with age, like wine." Most sake is best within a year of release (aged koshu is a speciality).
3 "Always clear." Nigori is cloudy on purpose.
4 "Drink it from the wooden masu." The cedar adds flavour; small tulip-shaped glasses suit premium sake.
5 "Store it on its side." Keep it upright, cool and dark; once open, in the fridge.

How many did you believe? 👇 Save this for your sake exam.
Practise free on thewinegoat.com

#sake #wsetsake #sakestudent #nihonshu #japanesesake #ginjo #nigori #sakelover #sakeeducation #learnsake #drinkseducation

**Alt text**
Seven-slide carousel. 1: White editorial page with a large burgundy serif headline "Sake myths", a thin rule with a diamond, "5 things people get wrong about sake." and drawings of a white sake flask with a blue band (tokkuri), a small sake cup (o-choko) and a cedar box (masu), each labelled. 2–6 on a deep indigo background with an indigo "Sake · Level 1" badge: myth and fact cards on serving temperature, ageing (koshu), nigori, the masu and storage, each with a drawing of a flask, a cup or the masu. 7: "How many did you believe?" with Save, Share and Practise free.

---

## Carousel 5 · Cognac vs Armagnac
Files: `posts/spirits-cognac-vs-armagnac/` (7 slides) · X vs Y + test yourself

**Caption**
SPIRITS · LEVEL 2
Cognac vs Armagnac: two French grape brandies. Spot the difference 🥃
Same: distilled from wine, Ugni Blanc most planted, aged in oak, VS / VSOP / XO.
Cognac: just north of Bordeaux, copper pot stills, twice, over a direct flame; four big companies dominate.
Armagnac: south of Bordeaux, almost always a short column; small producers; more Baco and Folle Blanche.
Only in Armagnac (mostly): Vintage (one harvest) and Blanche (never sees oak).
Test yourself: a brandy smells of prunes. Which grape is the clue?

Team Cognac or team Armagnac? 👇
Save this · Share with your study buddy
Practise free on thewinegoat.com

#wsetspirits #wset #spirits #cognac #armagnac #brandy #spiritsstudent #potstill #bartender #spiritseducation #learnspirits

**Alt text**
Seven-slide carousel on a deep whisky-brown background with an amber "Spirits · Level 2" badge. 1: Solid brown tile with "Cognac vs Armagnac" set on an arc above drawings of a copper pot still and a short copper column still with portholes. 2: What they share (grape brandies, Ugni Blanc, oak, age terms), with a drawn brandy bottle and nosing glass. 3: Side-by-side table: where, still, grapes, producers. 4: Two Armagnac styles, Vintage and Blanche, with a column still. 5–6: Question and answer: the prune note points to Baco; Folle Blanche is floral and fruity; Ugni Blanc gives raisin and violet once distilled. 7: "Team Cognac or team Armagnac?" with both stills.

---

## Carousel 6 · Ruby or Tawny? Port, decoded
Files: `posts/wine-port-styles/` (7 slides) · Diploma cheat sheet

**Caption**
WINE · LEVEL 4 · DIPLOMA
Ruby or Tawny? Port, decoded. The D5 cheat sheet 📌
Ruby styles keep deep colour and primary fruit: Ruby, Reserve, LBV, Crusted, Vintage.
Aged Tawny spends years in small old casks: the colour fades, dried fruit, coffee, caramel and walnut appear.
LBV: one vintage, bottled 4–6 years after harvest. Colheita: one vintage, at least 7 years in wood.
Trap: "20 Year Old Tawny" is not a 20-year minimum. Swipe to see why.

Ruby or Tawny: which is yours? 👇
Save this · Share with your study buddy
Practise free on thewinegoat.com

Photo: Krzysztof Golik, CC BY-SA 4.0, via Wikimedia Commons

#wsetdiploma #wset #wset4 #diploma #portwine #tawnyport #lbv #vintageport #fortifiedwine #douro #winestudent #sommelier

**Alt text**
Seven-slide carousel on a deep burgundy background with a "Wine · Level 4 · Diploma" badge. 1: Photo of a rabelo boat loaded with barrels on the Douro in front of Porto, with a burgundy arch-shaped panel reading "Ruby or Tawny? Port, decoded". 2: Two families, Ruby styles (protective, deep colour, primary fruit) or aged Tawny (years in small old casks, colour fades), with drawn ruby and tawny glasses. 3: Ruby family card: Ruby, Reserve, LBV, Crusted, Vintage. 4: Tawny family card: Basic, Reserve (at least 6 years in wood), indications of age 10 to 50 years, Colheita (at least 7 years). 5–6: Trap question: a 20 Year Old Tawny is closer to an average age, a blend of batches younger and older. 7: "Ruby or Tawny: which is yours?" with a painted goat winking with a glass of red wine.

---

## Carousel 7 · Which level is right for you?
Files: `posts/wine-which-level-is-right/` (7 slides) · decision flow

**Caption**
WINE · LEVELS 1–4
Which wine level is right for you? A 30-second decision flow 🧭
New to wine? → Level 1 (no entry requirements, 30 multiple-choice questions in 45 minutes).
Want labels, grapes and regions? → Level 2 (28 hours, 50 questions in 60 minutes).
Want to explain why a wine tastes as it does, and blind taste? → Level 3 (theory plus a blind tasting of 2 wines).
Hold Level 3 and want the deep dive? → Diploma (six units, D1 to D6).

Where are you right now? Comment L1, L2, L3 or D and your exam date 👇
Send this to a friend who keeps asking where to start.
Practise free on thewinegoat.com

#wset #wset1 #wset2 #wset3 #wsetdiploma #winestudent #winecourse #learnwine #wineeducation #sommelier #winecareer #studywine

**Alt text**
Seven-slide carousel on a cream background with a "Wine · Levels 1–4" badge. 1: Solid cream tile with "Which level is right for you?" set on an arc above the painted traveller goat with a map and a suitcase. 2: Decision flow with four yes/no questions leading to Level 1, Level 2, Level 3 or Diploma. 3: Level 1 facts (no entry requirements, 6 hours, 30 multiple-choice questions in 45 minutes) with drawn glasses. 4: Level 2 (no entry requirements, 28 hours, 50 questions in 60 minutes; Pass from 55%, Pass with Merit from 70%, Pass with Distinction from 85%) with drawn Chablis and Rioja bottles. 5: Level 3 (Level 2 or equivalent recommended, 84 hours, theory and a blind tasting of 2 wines in 30 minutes) with two glasses numbered 1 and 2. 6: Diploma (Level 3 required, 6 units, 500 hours) with drawn glasses. 7: "Where are you right now?" with the traveller goat.

---

## Stories (4 single frames · 1080×1920)

| # | File | Course · level | Text on the frame | Sticker to add | Alt text |
|---|---|---|---|---|---|
| 1 | `stories/story-1-poll-screwcap-or-cork.png` | Wine · Level 3 | "Screwcap or cork: which do you trust?" | Poll: Screwcap / Cork | Cream story frame with a burgundy serif question and drawings of a wine bottle and a cork |
| 2 | `stories/story-2-quiz-not-a-fault.png` | Wine · Level 3 | "Which one is NOT a wine fault?" A Cork taint (TCA) B Tartrate crystals C Oxidation | Quiz, correct answer B | Cream quiz frame with three answer options |
| 3 | `stories/story-3-slider-blind-tasting.png` | Wine · Level 3 | "How ready are you for blind tasting?" | Emoji slider 🍷 | Cream story frame with a burgundy question and a drawn glass of red wine |
| 4 | `stories/story-4-quiz-beer-glass.png` | Beer · Level 1 | "Bubbles clinging to the side of your beer glass mean…" A Very fresh B Glass not clean C Strong beer | Quiz, correct answer B | Cream quiz frame with a golden "Beer · Level 1" badge and three answer options |

---

## Sources and checks
Every fact comes from the app content (Wine Levels 1–2, Spirits Levels 1–2, Diploma D5) or the course specifications and books kept privately for the team; nothing is quoted at length. No prices of The Wine Goat, no claim of affiliation, no school named, no observations presented as our own data. Unverified items were left out (for example: exact Armagnac minimum ages, which are only described as "slightly different" from Cognac's).
