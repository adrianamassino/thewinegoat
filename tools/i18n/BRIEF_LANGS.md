# Brief: open the app to 9 new languages (infrastructure + exam-language notice)

Repo: /home/claude/thewinegoat (GitHub Pages, branch main). App: `app/index.html` (~14 MB, edit with care: small targeted Python replacements, never rewrite the file), `app/l2/l2app.js` (level shell for L1/L2/spirits), `app/l2/media.js`, `app/cellar.js`, level content `app/l1/content.js`, `app/l2/content.js`, `app/spirits/s1|s2/content.js`, podcasts/films per level (`<dir>/media.js`, `podtext/<lang>.json`).

## Today
Native languages it/fr/en (arrays `[it,fr,en]`). Spanish (`es`, `es-ar`) works as a display-time map English→Spanish: `app/i18n/es.js` (`window.TWG_ES`), object `TES` in index.html (`sync()`, `tr()`, …), loaded by the head script with regex `/[?&#]lang=(es-ar|es|it|fr|en)\b/` + localStorage `wset3-lang` + navigator detection. Level content carries Spanish as a 4th array item and `window.TWG_ESX`. Tools: `tools/i18n/extract.py`, `build.py`, `es-map.json`, `source/NNN.json` (19,560 strings, 1.95 M English chars, UI first).

## Goal
Add these app languages, with English as the base text (same principle as Spanish):
`de` Deutsch, `nl` Nederlands, `el` Ελληνικά, `ja` 日本語, `ko` 한국어, `zh-hant` 繁體中文, `pt` Português, `tr` Türkçe, `th` ภาษาไทย.

### 1. Runtime (generalise the Spanish mechanism, keep Spanish working exactly as now)
- One file per language `app/i18n/<lang>.js` → `window.TWG_I18N=window.TWG_I18N||{}; TWG_I18N["<lang>"]={...en→translation...}` (core app strings), plus per-level files `app/i18n/<lang>/<level>.js` (`l1`, `l2`, `s1`, `s2`) merged into the same map, loaded by the level loader in the head only for that language. Missing translation → English (never blank, never crash). Files may not exist yet: the app must work with an empty/missing file (show English).
- Head script: regex/localStorage/navigator detection for the new codes (`de*`→de, `nl*`→nl, `el*`→el, `ja*`→ja, `ko*`→ko, `zh-TW|zh-HK|zh-MO|zh-Hant*`→zh-hant, `pt*`→pt, `tr*`→tr, `th*`→th; simplified Chinese → en).
- `TES` (or a generalised twin) on for es/es-ar AND the 9 new languages; every place that already calls TES for Spanish must work for them. Review all `lang==="es"` / `es-ar` special cases (date locales, `<html lang>`, AI-marking language name sent to the model, speech-synthesis voice language, number formats, onboarding, cellar.js, l2app.js, media.js, films, flashcards, games, study plan, account/auth screens, PWA prompts, the `{...es-ar...}` dictionaries). Right-to-left not needed.
- Language picker: add buttons for the 9 languages in the same place as `#lang-es`/`#lang-es-ar` (native names as titles, short codes DE NL EL JA KO 繁 PT TR TH or similar), switching works without reload issues; check it fits on a 375 px phone (wrap or a compact menu).
- CJK and Thai: fonts fall back fine (system fonts), no layout break with long German words (`overflow-wrap:anywhere` where needed).
- Podcasts: audio exists only in it/fr/en(/es?). For a new language: show the transcript/text in English (or translated if present in the map) and use the existing device-voice fallback in that language only when a translated text exists; otherwise English audio. Films: their strings go through the map like the rest.

### 2. Exam-language notice (user's explicit request)
When the selected app language is not one in which the exam of the CURRENT level is offered, show a clear, friendly notice on the level home (and once when the level is opened), in the app language, e.g.:
> "The exam for this level is not yet available in Deutsch. You can study here in Deutsch, but we suggest preparing it in one of the languages in which the exam is offered: English, Français, Español, …" + chips to switch the app to each of those languages that the app supports.
Dismissible (remember per level+language in localStorage, wrapped in try/catch), but always visible in a compact form in Settings/level info. Don't name the exam body; "the exam" is enough. Availability table (source: official languages page, Nov 2026):
- Wine L1: en, zh-hant, nl, fr, de, el, it, ja, ko, pt, es, tr (+ru)
- Wine L2: en, zh-hant, nl, fr, de, el, it, ja, ko, pt, es, tr
- Wine L3: en, nl, fr, de, el, ja, ko, pt, es   ← NOT Italian, NOT zh-hant, NOT tr
- Spirits L1: en, zh-hant, fr, de, ko, pt, es, th, tr
- Spirits L2: en, zh-hant, fr, de, pt, es
- Spirits L3, Diploma: en only
`es-ar` counts as `es`. The rule applies to ALL app languages, Italian included (e.g. Italian on Wine L3 or Spirits shows the notice). Put the table in one JS object so it is easy to update. Write the notice texts yourself in all 14 app languages (it, fr, en, es, es-ar, de, nl, el, ja, ko, zh-hant, pt, tr, th), neutral wording (no feminine/masculine-only forms).

### 3. Translation tooling
- `tools/i18n/extract_all.py`: extracts every English display string of the WHOLE app (index.html incl. UI dictionaries — export them from the browser with Playwright as extract.py expects —, l2app.js, media.js + films, cellar.js, and every level content file l1/l2/s1/s2 incl. podtext English) into `tools/i18n/src/<scope>/NNN.json` where scope = `core`, `l1`, `l2`, `s1`, `s2`; chunks of ~25,000 English chars, UI strings first in core (put them in their own first chunks `core/000…`). Each item `{"en":…, "it":…}` (Italian as reference when known).
- `tools/i18n/build_lang.py <lang>`: reads `tools/i18n/<lang>/<scope>/NNN.txt` (one translation per line, aligned with the source chunk, `\n` escaped), merges into `tools/i18n/<lang>-map.json` (key = English, so it survives re-extraction), writes `app/i18n/<lang>.js` and `app/i18n/<lang>/<level>.js`, prints coverage % per scope. Asserts line counts.
- `tools/i18n/TRANSLATE_LANG.md`: brief for translator agents (format, placeholders/HTML tags/`{x}`/emoji/numbers must be preserved, wine terminology conventions: grape and place names stay as used in that country's wine trade, appellation names never translated, neutral/inclusive wording, informal "you" register that fits each language — de "du", nl "je", el informal, ja です/ます, ko 해요체, zh-hant Taiwan usage, pt — choose European or Brazilian? use Brazilian Portuguese with neutral vocabulary, tr "sen", th polite neutral (no gendered particles ครับ/ค่ะ); no mention of WSET/books; never mention prices).
- Report counts: strings and English chars per scope.

### 4. Test & ship
Playwright (Chromium preinstalled; `NODE_PATH=$(npm root -g) node x.js`; local server `cd /home/claude/thewinegoat && (setsid timeout 14000 python3 -m http.server 8810 >/dev/null 2>&1 &)`): for each new language with a tiny fake map, open `app/#lvl=1`, `#lvl=2`, default L3, `#lvl=s1`, `#lvl=s2`: no console errors, translated strings appear, notice appears exactly where the table says (e.g. de on L3 → no notice; it on L3 → notice; tr on s2 → notice), Spanish/Italian/French/English unchanged, phone width 375 px OK, screenshots checked. Then commit (end message with the two attribution lines below) and push to main; other agents push too, so `git pull --rebase` with a retry loop.
Attribution lines for the commit message:
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_016piz4VJiUdX3kRskQurYGT

Rules: never mention prices; never claim affiliation; don't touch other agents' podcast files (`tools/media/out/*`, `app/*/podtext`, pods). Reply at the end with: what changed, the extraction counts per scope, and anything left undone.
