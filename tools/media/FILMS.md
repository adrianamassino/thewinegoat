# Animated films for Spirits (The Wine Goat)

Wine Level 3 has animated "films": each film is a list of scenes; each scene = a heading, a 2–4 sentence caption that is read aloud, and an animated SVG drawing (320×200 viewBox) built from helper functions. Study:
- an example film: `/tmp/claude-0/-home-claude/3f268032-b4c3-5225-a7f8-c79dc4579a8b/scratchpad/film_example.js` (look at how scenes, `I3(it,fr,en)`, `w3(it,fr,en)` labels, `fSvg`, `fD(delay, …)`, `fCall`, `fChip`, `fBox`, `fArrow` are used);
- the helper library: `/tmp/claude-0/-home-claude/3f268032-b4c3-5225-a7f8-c79dc4579a8b/scratchpad/film_helpers.js` (read the signatures of the helpers you use: fSvg, fGround, fSky?, fChip, fCall, fD, fPop, fTxt, fT, fBox, fArrow, fBarrel, fBottle, fGlass, fStemGlass, fTank, fFire, fHeater, fThermo, fDrops, fYeast, fClock, fGauge, fConveyor, fBucket, fCrate, fCrystals…).

## What to write
A JavaScript file that ADDS spirit-specific drawing helpers (prefix `sp`, e.g. `spPotStill(x,y,s)`, `spColumn(x,y,s,plates)`, `spCondenser`, `spCask`, `spAgavePina`, `spAgavePlant`, `spCane`, `spBarley`, `spCorn`, `spJuniper`, `spBotanicalBasket`, `spCocktailGlass(type)` for coupe/martini/highball/rocks/margarita, `spShaker`, `spJigger`, `spIce`, `spCitrus`, `spVapour` animated, `spDripLiquid` …) as `const` arrow functions returning SVG strings (animated with SVG `<animate>`/`<animateTransform>` where it helps: rising vapour, bubbling pot, dripping condenser, flowing liquid), then defines the films:

```js
/* generated for The Wine Goat — <level> films */
const spPotStill=(x,y,s)=>`…`;  // etc.
window.TWG_MEDIA = window.TWG_MEDIA || {};
TWG_MEDIA.fsec = { v: I3("…","…","…"), c: I3(…), s: I3(…), t: I3(…) };   // up to 4 section labels you choose (keys v,c,s,t)
TWG_MEDIA.films = [
 {id:"s1_stills", sec:"v", ch:"p1", ic:"grapes", t:I3("titolo","titre","title"), s:[
   {h:I3("…","…","…"), c:I3("caption it","caption fr","caption en"), v:()=>fSvg(spPotStill(110,150,1)+fD(1,fCall(…)))},
   …
 ]},
 …
];
```
IMPORTANT: `I3`, `w3`, `fSvg` and all `f…` helpers are defined LATER by the app. Your file runs first, so only reference them inside arrow-function bodies (helpers and `v:()=>…`), never at top level — EXCEPT `I3`, which you must replace at top level by a local copy: start the file with `const I3_=(a,b,c)=>[a,b,c];` and use `I3_` for every `t:`, `h:`, `c:` and `fsec` value. `w3(it,fr,en)` (labels inside drawings) is fine inside `v:()=>`.

## Content rules
- One film per chapter of the level (chapter ids in the structure file), 6–10 scenes each, covering the chapter's key processes and facts; captions 30–70 words, spoken style, accurate to the level's content files. Labels in drawings short (≤ 22 characters).
- Visual quality like wine Level 3: clear composition, labelled parts, things appear in sequence with `fD(delay,…)` (0.4–3 s), gentle animations. Keep each scene's SVG reasonably small.
- No exam-body/book names, no brands, no prices. Neutral wording.
- Languages: it, fr, en.

## Testing (mandatory)
Run `node -e` with a tiny stub (define I3/w3/esc/fSvg etc. by loading the helper library file into a sandbox) OR simply check syntax with `node --check`. Then the main session tests in the browser.
