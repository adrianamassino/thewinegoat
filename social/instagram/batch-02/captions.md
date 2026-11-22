# @the.winegoat · Instagram batch 02 (English)

Files: `posts/<post>/` (carousels, 1080×1350, upload slides in numeric order), `reels/` (MP4 1080×1920 + cover PNG), `stories/` (1080×1920 question + answer pairs).
`preview.png` = the profile grid (4 columns, newest first) once batch 02 and the corrected batch-01 items (`../batch-01-fixed/`) are posted. `contact-sheet.png` = every slide, story and reel scene.
Rebuild: `NODE_PATH=$(npm root -g) node tools/social/build.js batch-02` (content in `tools/social/batches/batch-02.js`).

Look: three background families (cream site look, deep burgundy, course colour), same layouts. The course and level show in the badge, and the course colour in the thin top line: Wine burgundy, Spirits amber, Sake indigo, Beer golden. Spirits, Sake and Beer posts carry no wine imagery.

Imagery (rebuilt Nov 2026 for better graphic quality): a mix of **real photos** from the site's photo library (Wikimedia Commons, CC BY-SA: each post that uses one carries a `Photo:` credit line at the end of its caption, required by the licence), the **painted goats** (red-wine posts only; the traveller goat is neutral) and **painterly drawings** (gradients, highlights, shadows) instead of the old flat line icons. Photos appear only where they show exactly the topic; sake, sherry and the traditional-method steps use drawings because the library has no matching photo (the stock-photo workflow has no API keys set).

Grid style (owner's direction, Nov 2026): an **editorial cut-out** layout (white page, large burgundy serif headline, thin rule with a diamond, short serif sub-headline, cut-out objects with serif labels, goat logo and wordmark at the bottom, page counter: Sherry, Same grape, quiz answer 1), mostly **photo-led tiles** (full-bleed photo with one bold solid shape: an arch panel or a thin cream frame, holding a short condensed uppercase headline and our round goat logo badge) alternating with calm **solid-colour tiles** (headline set on an arc, one drawing or goat) and **minimal photo tiles** (one serif line and a small label tag). Inner slides stay clean and editorial in the same colours and type; kickers use the same condensed face as the cover headlines (Roboto Condensed, OFL, bundled in `tools/social/fonts`).

Music: every reel now has its own original background track, composed and synthesised in code for these reels (`tools/social/lib/music.py`, no samples or third-party recordings), one mood per course (wine warm piano, beer upbeat plucked guitar, sake calm koto-like plucks, spirits jazzy electric piano), soft accents on scene changes, mastered to −16 LUFS with fade-in/out. No need to add a track in the Instagram app.

---

## Suggested schedule (Europe/Rome)

Before starting: archive or delete the old carousel A ("Same grape. Two wines."), the old Sancerre quiz and reel 1 ("3 grapes in 15 seconds"); their corrected versions are in the plan below.

Backgrounds come in three families, about a third each: **cream** (the website look), **burgundy** (deep burgundy, light text) and **course colour** (Wine deep green, Spirits whisky brown, Sake indigo, Beer amber). In this order no two neighbouring tiles of the 4-column grid share a background family, including the four older dark-burgundy posts underneath (see `preview.png`).

| Date | Time | What | Course · level | Background |
|---|---|---|---|---|
| Tue 24 Nov | 18:30 | Carousel: Sancerre quiz (corrected, `batch-01-fixed`) | Wine · Level 1 | course: deep green |
| Wed 25 Nov | 13:00 | Reel: Sake polishing ratio in 20 seconds | Sake · Level 1 | cream |
| Thu 26 Nov | 18:30 | Carousel: Same grape. Two wines. (corrected, `batch-01-fixed`) | Wine · Level 2 | cream |
| Fri 27 Nov | 12:30 / 19:00 | Story pair 1: red wine colour | Wine · Level 1 | (story, cream) |
| Sat 28 Nov | 11:00 | Carousel: Dark beer is always strong… myth | Beer · Level 1 | course: amber |
| Sun 29 Nov | 13:00 | Reel: 3 grapes in 15 seconds (corrected, `batch-01-fixed`) | Wine · Level 1 | cream |
| Mon 30 Nov | 13:00 | Reel: Ale or lager? | Beer · Level 1 | burgundy |
| Tue 1 Dec | 18:30 | Carousel: Sherry styles, card by card | Wine · Level 4 (Diploma) | course: deep green |
| Wed 2 Dec | 12:30 / 19:00 | Story pair 2: XO Cognac | Spirits · Level 1 | (story, cream) |
| Thu 3 Dec | 13:00 | Reel: Single Malt Scotch, 3 words | Spirits · Level 1 | burgundy |
| Fri 4 Dec | 18:30 | Carousel: Tequila vs Mezcal | Spirits · Level 2 | course: whisky brown (photo cover) |
| Sat 5 Dec | 11:00 | Carousel: The traditional method in six steps | Wine · Level 3 | cream |
| Sun 6 Dec | 13:00 | Reel: Crianza, Reserva, Gran Reserva | Wine · Level 2 | burgundy |
| Mon 7 Dec | 18:30 | Carousel: How sake is brewed | Sake · Level 1 | course: indigo |
| Tue 8 Dec | 12:30 / 19:00 | Story pair 3: sake is fermented | Sake · Level 1 | (story, cream) |
| Wed 9 Dec | 18:30 | Carousel: Bordeaux Left Bank vs Right Bank | Wine · Level 2 | cream |
| Fri 11 Dec | 18:30 | Carousel: Level 3 short written answers | Wine · Level 3 | burgundy |
| Sat 12 Dec | 13:00 | Reel: How much do you know about wine? (quiz) | Wine · Levels 1–4 | burgundy (minimal photo cover) |
| Sun 13 Dec | 18:30 | Carousel: How much do you know about wine? **then pin it to the profile** | Wine · Levels 1–4 | burgundy (photo cover) |

Stories: on each question frame, add Instagram's **poll or quiz sticker** (A / B) in the empty space under the options, then post the answer frame a few hours later. Reels: the files already carry original background music (see above); keep it, or lower it in the app if you add a voice-over.

---

## 0 · PIN TO PROFILE · How much do you know about wine?
Files: `posts/pinned-how-much-do-you-know/` (10 slides) · quiz, Level 1 to Diploma. **Pin this post to the profile** after publishing (it shows first in `preview.png`).

**Caption**
WINE · LEVELS 1–4
How much do you really know about wine? 🍷 Four questions, from Level 1 to Diploma.
Q1 (Level 1): black grape skins give red wine its colour and… ?
Q2 (Level 2): Barolo DOCG is made exclusively from… ?
Q3 (Level 3): where do Champagne's brioche and biscuit aromas come from?
Q4 (Diploma): which Sherry ages under a film of flor?
Answers on the slide after each question. No peeking!

Comment your score from 0 to 4 👇 Then find your level with the free quizzes (link in bio).
Practise free on thewinegoat.com

Photos: Itu, CC BY-SA 4.0; eflon (Alex from Ithaca, NY), CC BY 2.0; Franz van Duns, CC BY-SA 4.0 (grape cut-out); Phyrexian, CC BY-SA 4.0; Pline, CC BY-SA 3.0 (via Wikimedia Commons)

#wset #wset1 #wset2 #wset3 #wsetdiploma #winequiz #winestudent #winelover #sommelier #barolo #champagne #sherry #wineeducation #learnwine

**Alt text**
Ten-slide quiz carousel on a deep burgundy background with a "Wine · Levels 1–4" badge. 1: Photo of an empty tulip-shaped wine glass on a vineyard post among vine leaves, with a burgundy arch-shaped panel and the goat logo reading "How much do you know about wine? 4 questions, from Level 1 to Diploma. Keep score!". 2: Level 1 question over a photo of a black grape bunch on an autumn vine: black grape skins give red wine its colour and… A) Sweetness B) Tannin C) Acidity. 3: Editorial white page: "B · Tannin", "Black grape skins hold both the colour and the tannins.", a cut-out photo of a bunch of black grapes, an arrow and a glass of red wine labelled "Colour + tannin". 4: Level 2 question over a photo of Serralunga d'Alba and its castle above the Langhe vineyards: Barolo DOCG is made exclusively from… A) Sangiovese B) Nebbiolo C) Barbera. 5: Answer B, Nebbiolo, with a glass of red wine. 6: Level 3 question over a photo of green vineyards near Aÿ in Champagne: brioche and biscuit aromas come from… A) Oak barrels B) Ageing on the dead yeast C) The dosage. 7: Answer B, autolysis; at least 12 months on lees for non-vintage Champagne; a flute of sparkling wine. 8: Diploma question with three drawn sherry glasses: which Sherry ages under a film of flor? A) Oloroso B) Fino C) Cream. 9: Answer B, Fino (fortified to 15–15.5%; Oloroso to 17%, no flor). 10: "Find your level in minutes": comment your score, free quizzes on thewinegoat.com, with a goat raising a golden trophy.

---

## 1 · How sake is brewed
Files: `posts/sake-how-sake-is-brewed/` (6 slides) · flow diagram

**Caption**
SAKE · LEVEL 1
How is sake made? It's not distilled, and it's not quite brewed like beer either. 🍶
Four ingredients: steamed white rice, kōji, water and yeast.
Rice holds starch, not sugar, so kōji enzymes turn the starch into sugar.
At the same time, in the same tank, yeast turns that sugar into alcohol: parallel fermentation.
The liquid reaches about 20% abv; water can bring it down to the usual 15–17%.
Three optional choices: added distilled alcohol, dilution and pasteurisation.

Which step surprised you most? 👇
Practise free on thewinegoat.com

#sake #sakestudent #nihonshu #wsetsake #wset #koji #junmai #namazake #sakelover #japanesesake #drinkseducation #learnsake

**Alt text**
Six-slide carousel on a deep indigo background with an indigo "Sake · Level 1" badge and a painted-style drawing of a white ceramic sake flask with a blue band and a small cup. 1: Solid indigo tile with the headline "How sake is brewed" set on an arc above a drawn white sake flask and cup. 2: Four ingredients (steamed white rice, kōji, water, yeast) plus optional high-strength distilled alcohol. 3: "No kōji, no sugar": kōji enzymes turn starch into sugar while yeast turns sugar into alcohol, in parallel, to about 20% abv. 4: Flow diagram: prepare the rice, make kōji, starter, main fermentation, filtration, bottling. 5: Optional steps: distilled alcohol (without it the sake can be junmai), water, pasteurisation (skipped: nama). 6: Question to followers.

---

## 2 · The traditional method in six steps
Files: `posts/wine-traditional-method/` (6 slides) · editorial

**Caption**
WINE · LEVEL 3
Six steps from still wine to bubbles in the bottle. 🥂
01 Base wine: high-acid, delicate, blended, about 9–11% abv.
02 Tirage: wine, sugar, yeast and nutrients, then a crown cap.
03 Second fermentation in the bottle you buy: about 6 atmospheres of pressure.
04 Lees ageing: autolysis gives brioche, biscuit and toast (at least 12 months for non-vintage Champagne).
05–06 Riddling and disgorgement, then dosage sets the sweetness.

True or false: Extra Dry is sweeter than Brut? 👇
Practise free on thewinegoat.com

Photo: Pline, CC BY-SA 3.0, via Wikimedia Commons

#wset #wset3 #winestudent #sparklingwine #champagne #traditionalmethod #methodetraditionnelle #cava #autolysis #sommelier #winelover #wineeducation

**Alt text**
Six-slide editorial carousel with large burgundy step numbers on a cream background. 1: Photo of green Champagne vineyards near Verzenay with a windmill on the hilltop, inside a thin cream frame, with a burgundy panel reading "The traditional method in six steps". 2: Base wine, with a drawing of green-gold grapes and a glass of pale wine: high acidity, low sugar, blended, 9–11% abv, cool climates. 3: Tirage and second fermentation in the bottle (drawing of a green bottle with a crown cap), about 6 atm, plus 1–2% abv. 4: Lees ageing (drawing of a bottle lying on its side with the lees settled along it), autolysis, 12 months minimum for non-vintage Champagne. 5: Riddling (drawing of a wooden riddling rack with bottles), pupitres up to 8 weeks, gyropalettes 3–4 days, disgorgement, dosage; Brut 0–12 g/L. 6: True or false: Extra Dry (12–17 g/L) is sweeter than Brut, with a sparkling-wine bottle and a flute.

---

## 3 · Tequila vs Mezcal
Files: `posts/spirits-tequila-vs-mezcal/` (6 slides) · photo cover + comparison

**Caption**
SPIRITS · LEVEL 2
Tequila and Mezcal both start with agave. That's where the similarities thin out. 🌵
Agave stores inulin, so the piña is always cooked before it can ferment.
Tequila: only blue agave, mainly Jalisco, steamed in brick or pressurised ovens.
Mezcal: several agave species, mainly espadín and Oaxaca, often roasted in stone-lined pits for smoke.
"Tequila" alone needs only 51% agave sugars; "100% agave" means all of them.
Mezcal has three categories: Mezcal, Artisanal Mezcal, Ancestral Mezcal.

Team Tequila or team Mezcal? 👇
Practise free on thewinegoat.com

Photo: Tomascastelazo, CC BY-SA 4.0, via Wikimedia Commons

#tequila #mezcal #agave #wsetspirits #wset #spirits #spiritsstudent #bartender #mixology #spiritseducation #agavespirits #learnspirits

**Alt text**
Six-slide carousel on a deep whisky-brown background with an amber "Spirits · Level 2" badge. 1: Aerial photo of an agave field in Jalisco, Mexico, with a brown arch-shaped panel reading "Tequila vs Mezcal". 2: From agave to piña: inulin, harvest before flowering, the piña is always cooked; drawing of a blue-green agave plant with spined leaves. 3: Side-by-side table: agave, where, cooking, producers. 4: Tequila label terms: Blanco, Gold, Reposado (2 months in oak), Añejo (1 year), Extra Añejo (3 years). 5: Mezcal, Artisanal Mezcal, Ancestral Mezcal. 6: "Team Tequila or team Mezcal?" with a large agave drawing.

---

## 4 · Dark beer is always strong… myth
Files: `posts/beer-colour-strength-myths/` (7 slides) · myth vs fact

**Caption**
BEER · LEVEL 1
"Dark beer is always strong." Myth. 🍺
Colour comes from the malt. Strength comes from how much sugar the yeast ferments.
Tripel is gold and high to very high in alcohol.
Porter and stout run from low to very high alcohol.
Munich dunkel is a copper to brown lager.
In sour styles like Berliner weisse, the sourness is on purpose.
Judge strength by the label, not the colour.

Which myth did you believe? 👇
Practise free on thewinegoat.com

#beer #beerstudent #wsetbeer #wset #craftbeer #beereducation #stout #tripel #lager #sourbeer #beergeek #learnbeer

**Alt text**
Seven-slide myth-versus-fact carousel on a deep amber background with a golden "Beer · Level 1" badge. 1: Solid amber tile: "Dark beer = strong beer?" set on an arc above drawn pints of straw, amber and black beer, then "Myth or fact?". 2–6: Each myth crossed out above a dark fact panel, with drawn beer glasses in the colours of the styles: colour comes from malt, strength from sugar (straw, amber and black pints); tripel is gold and strong (gold and copper beer chalices); porter and stout range from low to very high alcohol (black and brown pints); Munich dunkel is a copper to brown lager (copper and straw pints); sourness in sour styles is intentional, Berliner weisse is straw and hazy (hazy pint). 7: Strength scale: up to 4% low, 4.1–5.9% medium, 6–9% high, over 9% very high, above a row of five beers from straw to black.

---

## 5 · Bordeaux: Left Bank vs Right Bank
Files: `posts/wine-bordeaux-left-right-bank/` (6 slides) · map

**Caption**
WINE · LEVEL 2
Two rivers, one estuary, two styles. 🗺️
The Garonne and the Dordogne meet to form the Gironde.
Left Bank: warm gravel, Cabernet Sauvignon leads (Haut-Médoc, Graves).
Right Bank: cool clay, Merlot leads, with Cabernet Franc too in Saint-Émilion (Pomerol, Saint-Émilion).
Why? Gravel drains fast and holds heat, which helps late-ripening Cabernet in a rainy maritime climate.
Quick quiz on slide 5: which one is Merlot-led?

Team Left Bank or team Right Bank? 👇
Practise free on thewinegoat.com

Photo: JLPC, CC BY-SA 3.0, via Wikimedia Commons

#wset #wset2 #winestudent #bordeaux #leftbank #rightbank #pomerol #pauillac #saintemilion #merlot #cabernetsauvignon #winemap #wineeducation

**Alt text**
Six-slide carousel on white paper with a fine dot grid. 1: Photo of vines beside La Grande Muraille, the ruined wall of a medieval convent in Saint-Émilion, with a cream arch-shaped panel reading "Left Bank vs Right Bank". 2: Stylised map (not to scale) of the Gironde estuary, Garonne and Dordogne, with the Left Bank (Haut-Médoc: Pauillac, Margaux; Graves: Pessac-Léognan) and the Right Bank (Pomerol, Saint-Émilion). 3: Cards comparing soil, leading grape and names on each bank, with a drawn bunch of black grapes. 4: Why gravel suits Cabernet Sauvignon and clay suits Merlot. 5: Quiz: Pomerol is Merlot-led; a goat traveller with a map. 6: "Team Left Bank or team Right Bank?" with a goat by a barrel holding red wine.

---

## 6 · Level 3: how to answer short written questions
Files: `posts/wine-level3-short-answers/` (7 slides) · typographic fact cards

**Caption**
WINE · LEVEL 3
Facts don't score. Linked facts do. ✍️
The theory paper has 50 multiple-choice questions and 4 short written-answer questions; you need 55% in each part.
Answers are marked point by point: a 4-mark sub-part needs at least 4 distinct, correct points.
Plan in keywords, one per mark plus one or two spare.
Link every fact with cause and effect: climate → site → grape → vineyard → winery → maturation → style.
Slide 6 shows the same facts written two ways, with our own practice question.

What scares you most: MCQs, written answers or tasting? 👇
Practise free on thewinegoat.com

Photo: Peulle, CC BY-SA 4.0, via Wikimedia Commons

#wset #wset3 #wsetlevel3 #winestudent #winestudy #examprep #studytips #sommelier #winelover #wineeducation #mosel #riesling

**Alt text**
Seven-slide typographic carousel, white and gold text on a deep burgundy background. 1: Solid burgundy tile: "Facts don't score." set on an arc, the goat traveller with a map and suitcase, and "Linked facts do." in gold. 2: Big "4": four short written answers beside 50 multiple-choice questions; 55% needed. 3: Big "1": one mark equals one precise point, with an example of a precise answer. 4: Five-step method: read every sub-part, plan in keywords, assign keywords, write linked sentences, reread. 5: The chain climate → site → grape → vineyard → winery → maturation → style. 6: Photo of a steep vineyard above a stone wall at Ürzig on the Mosel, then a weak and a strong answer to "Why does the Mosel make light, high-acid Riesling?". 7: Question to followers, with the goat traveller holding a map and a suitcase.

---

## 7 · Sherry styles, card by card
Files: `posts/wine-sherry-styles/` (7 slides) · flashcards

**Caption**
WINE · LEVEL 4 (Diploma)
Flor or oxygen? That one choice shapes almost every Sherry style. 🃏
Biological ageing under flor (fortified to 15–15.5%): Fino and Manzanilla, pale and almond-scented.
Oxidative ageing without flor (fortified to 17%): Oloroso, brown, walnut and toffee.
Amontillado starts under flor and finishes oxidatively; Palo Cortado sits in between.
Sweet: Pedro Ximénez from sun-dried grapes (at least 212 g/L) and Cream (Oloroso blended with PX).
Bonus: VOS = average age 20+ years, VORS = 30+.

Fino or Oloroso: which do you reach for? 👇
Practise free on thewinegoat.com

#wsetdiploma #wset #winestudent #sherry #jerez #fino #manzanilla #amontillado #oloroso #pedroximenez #fortifiedwine #wineeducation

**Alt text**
Seven-slide flashcard carousel on a deep green background; each card has a burgundy header band on a white card. 1: Editorial white page: "Sherry styles" in large burgundy serif, a thin rule with a diamond, "Flor or oxygen: one choice shapes almost every style.", then four glasses labelled Fino (pale lemon), Amontillado (amber), Oloroso (brown) and PX (almost black). 2: Biological vs oxidative ageing, flor and the solera, with a drawing of stacked oak butts. 3: Fino and Manzanilla: pale lemon, 15–15.5%, almond, herbs, bread dough; Manzanilla from Sanlúcar de Barrameda; a pale copita. 4: Amontillado and Palo Cortado; an amber copita. 5: Oloroso: brown, 18–22%, full body, walnut, toffee, spice, leather; a brown copita. 6: Pedro Ximénez and Cream, with an almost black and a brown copita; dry styles have no more than 4 g/L. 7: VOS (20 years) and VORS (30 years), with a pale and a brown glass.

---

## Reel 1 · Crianza, Reserva, Gran Reserva
Files: `reels/reel-wine-spanish-ageing-terms.mp4` (24.2 s, original music: warm piano) + `_cover.png`

**Caption**
WINE · LEVEL 2
Three words on Spanish red labels, decoded in 20 seconds. 🇪🇸
Joven: no minimum ageing (in Rioja: Genérico).
Crianza: at least 24 months in total, 6 in oak.
Reserva: at least 36 months, 12 in oak.
Gran Reserva: at least 60 months, 18 in oak.
Memory trick: 24 · 36 · 60, and 6 · 12 · 18. Some regions, such as Rioja, ask for more.

Which one is in your glass tonight? 👇
Practise free on thewinegoat.com

Photos: Basotxerri, CC BY-SA 4.0, via Wikimedia Commons

#wset #wset2 #winestudent #spanishwine #rioja #crianza #reserva #granreserva #tempranillo #winelabel #winelover #wineeducation

**Alt text**
Animated reel on a deep burgundy background with a "Wine · Level 2" badge. Opens on a photo of a vineyard in red and gold autumn colours near Laguardia, Rioja Alavesa. Cards explain Joven (no minimum; Genérico in Rioja, with a drawn glass of red wine), then Crianza (24 months, 6 in oak), Reserva (36 months, 12 in oak) and Gran Reserva (60 months, 18 in oak), each with a bar showing total months and the oak part. The memory trick sits over a photo of autumn vines near Elvillar, Rioja Alavesa. Ends with a goat on a barrel raising a glass of red wine. Captions are burned in; original background music.

---

## Reel 2 · Sake polishing ratio in 20 seconds
Files: `reels/reel-sake-polishing-ratio.mp4` (22 s, original music: calm plucked strings) + `_cover.png`

**Caption**
SAKE · LEVEL 1
That percentage on a sake label? It's what's left of the rice grain. 🍚
"60%" means 60% of the grain remains and 40% was polished away.
The outer layers bring more acidity, umami, cereal and lactic notes; the core is mostly starch.
Premium limits: honjōzō 70% or less, ginjō 60% or less, daiginjō 50% or less.
Highly polished rice, special yeasts and a cool fermentation give the fruity, floral ginjō style.

Did you think the number was what was removed? 👇
Practise free on thewinegoat.com

#sake #sakestudent #wsetsake #wset #ginjo #daiginjo #junmai #nihonshu #japanesesake #sakelover #drinkseducation #learnsake

**Alt text**
Animated reel on a cream background with an indigo "Sake · Level 1" badge. A drawing of a white ceramic sake flask and cup, then shaded rice grains drawn at 100% and 60% to show polishing, the layers that are removed, the limits for honjōzō (70%), ginjō (60%) and daiginjō (50%), and the fruity, floral ginjō style. Captions are burned in; original background music.

---

## Reel 3 · Single Malt Scotch: 3 words
Files: `reels/reel-spirits-single-malt-scotch.mp4` (24 s, original music: jazzy electric piano and brushes) + `_cover.png`

**Caption**
SPIRITS · LEVEL 1
Single Malt Scotch: three words, three rules. 🥃
Scotch: distilled and aged in Scotland, at least 3 years in oak.
Malt: only malted barley, distilled in pot stills.
Single: from one distillery. Not one barrel!
Blended Scotch: malt and grain whiskies from different distilleries.
Smoky? That's peat, and only a few Single Malts are peaty.

Did "single" mean one barrel to you? 👇
Practise free on thewinegoat.com

Photos: Dietmar Rabich; DeFacto; Michal Klajban (CC BY-SA 4.0, via Wikimedia Commons)

#whisky #scotch #singlemalt #scotchwhisky #wsetspirits #wset #spirits #spiritsstudent #potstill #bartender #whiskylover #spiritseducation

**Alt text**
Animated reel on a deep burgundy background with an amber "Spirits · Level 1" badge. Opens on a photo of a barley field at golden hour near Nottuln, Germany. "Scotch" over a photo of the white buildings of Tobermory Distillery on the Isle of Mull, Scotland; "Malt" over a photo of ears of barley in a field near Dülmen, Germany; "Single" with a drawing of a copper pot still; Blended Scotch; peat smoke over a photo of a peat bog below Doune Hill in the Luss Hills, Scotland. Ends with drawings of a whisky bottle and a nosing glass. Captions are burned in; original background music.

---

## Reel 4 · Ale or lager?
Files: `reels/reel-beer-ale-vs-lager.mp4` (20.8 s, original music: upbeat plucked guitar) + `_cover.png`

**Caption**
BEER · LEVEL 1
Ale or lager? The answer isn't the colour. It's the yeast. 🍻
Ale yeast works fast and fairly warm, with lots of fruity and spicy aromas: weissbier, tripel, saison.
Lager yeast is slower and cooler, with less aroma: pilsner, Munich helles.
Careful: Munich dunkel is a copper to brown lager, and blonde ale is straw to gold.

Ale or lager: what's in your glass? 👇
Practise free on thewinegoat.com

Photo: Benreis, CC BY-SA 3.0, via Wikimedia Commons

#beer #beerstudent #wsetbeer #wset #ale #lager #pilsner #craftbeer #beereducation #brewing #beergeek #learnbeer

**Alt text**
Animated reel on a deep burgundy background with a golden "Beer · Level 1" badge. Opens on a photo of a tray of golden and amber beers at a brewery inn in Aufseß, Germany. Cards explain ale yeast (drawings of a hazy wheat beer and a gold beer chalice) and lager yeast (a straw-coloured pint), and show with a copper and a straw pint that colour does not tell them apart. Ends with two ears of barley and a pint. Captions are burned in; original background music.

---

## Reel 5 · How much do you know about wine? (quiz)
Files: `reels/reel-pinned-how-much-do-you-know.mp4` (23 s, original music: warm piano) + `_cover.png`

**Caption**
WINE · LEVELS 1–4
Four questions, 20 seconds. How many can you get? 🍷
Level 1: red wine's colour comes from the skins… and so does its tannin.
Level 2: Barolo DOCG is 100% Nebbiolo.
Level 3: Champagne's brioche notes come from autolysis on the lees.
Diploma: Fino ages under flor; Oloroso doesn't.

Comment your score from 0 to 4 👇 Link in bio to find your level.
Practise free on thewinegoat.com

Photos: Itu, CC BY-SA 4.0; eflon (Alex from Ithaca, NY), CC BY 2.0; Phyrexian, CC BY-SA 4.0; Pline, CC BY-SA 3.0 (via Wikimedia Commons)

#wset #wset2 #wset3 #wsetdiploma #winequiz #winereels #winestudent #barolo #champagne #sherry #sommelier #wineeducation

**Alt text**
Animated quiz reel on a deep burgundy background with a "Wine · Levels 1–4" badge. Cover: close-up photo of a black grape bunch with the line "How much do you know about wine?". Opens on a photo of a wine glass on a vineyard post; then four questions, each with three options and the answer revealed: tannin (over a photo of black grapes), Nebbiolo (over a photo of Serralunga d'Alba in the Langhe), autolysis (over a photo of vineyards near Aÿ, Champagne) and Fino (with drawn sherry glasses). Ends with a goat raising a golden trophy and "Find your level". Captions are burned in; original background music.

---

## Stories (3 pairs · 1080×1920)
Files: `stories/story-N-..._1-question.png` then `..._2-answer.png`. Text stays out of the top 250 px and bottom 300 px. Add a poll or quiz sticker (A / B) in the empty area of each question frame; optional link sticker to thewinegoat.com on the answer frame.

| Pair | Course · level | Question frame | Answer frame | Alt text |
|---|---|---|---|---|
| 1 | Wine · Level 1 | "Red wine gets its colour from… A) The grape juice B) The grape skins" | B, the skins: black grape skins hold colour and tannins; for white wine the juice is pressed off the skins first | Quiz story with black grapes, a red and a white glass: red wine's colour comes from the skins |
| 2 | Spirits · Level 1 | "'XO' Cognac: the youngest spirit is at least… A) 4 years old B) 10 years old" | B, 10 years: VS 2, VSOP 4, XO 10; the age refers to the youngest spirit in the blend | Quiz story with a pot still and a brandy bottle: XO Cognac's youngest spirit is at least 10 years old |
| 3 | Sake · Level 1 | "Sake is… A) A spirit, like vodka B) Fermented, like wine and beer" | B, fermented: not distilled, typically 15–17% abv | Quiz story with a sake flask: sake is fermented, not distilled |
