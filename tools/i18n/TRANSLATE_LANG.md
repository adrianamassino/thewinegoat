# Translating the app into a new language (brief for translator agents)

Languages: `de` Deutsch · `nl` Nederlands · `el` Ελληνικά · `ja` 日本語 · `ko` 한국어 · `zh-hant` 繁體中文 (Taiwan) · `pt` Português (Brazil) · `tr` Türkçe · `th` ภาษาไทย.
The app shows English text and replaces it on screen with your translation (same principle as Spanish). Anything not translated stays in English, so partial work is safe to ship.

## Files

- Source (do not edit): `tools/i18n/src/<scope>/NNN.json`, an array of `{"en": …, "it": …}`. `en` is the text to translate; `it` is the Italian version, for reference only (often clearer on meaning; empty when unknown).
- Scopes: `core` (the app and Level 3 wine; `core/000` and `core/001` are the interface: do them first), `l1`, `l2` (wine levels 1 and 2), `s1`, `s2` (spirits levels 1 and 2). `src/manifest.json` gives the counts.
- Your output: `tools/i18n/<lang>/<scope>/NNN.txt`, one file per source chunk, with **exactly one line per item, in the same order**. Line *n* is the translation of item *n*.
  - A line break inside a text is written as `\n` (backslash + n). Never put a real line break inside a translation.
  - An empty line means "not translated yet" (English is shown). Never delete or merge lines.
- Build: `python3 tools/i18n/build_lang.py <lang>`. It checks the line counts (it stops if a file has the wrong number of lines), warns when placeholders or tags differ, merges into `tools/i18n/<lang>-map.json` (key = English text) and writes `app/i18n/<lang>.js` + `app/i18n/<lang>/<level>.js`. It prints coverage per scope.
- Do not edit `app/index.html` or the generated `app/i18n/*.js` files by hand.

## Must be preserved exactly

- Placeholders: `{N}`, `{n}`, `{d}`, `{m}`, `{g}`, `{p}`, `{x}`, `{X}`, `{s}`, `{P}`, `{M}`, `{T}`, `{S}`… and `${…}`: keep them, unchanged, as many times as in the English. You may move them within the sentence.
- HTML tags and entities (`<b>…</b>`, `<br>`, `<i>`, `&nbsp;`…): same tags, same attributes, same nesting; translate only the text between them.
- Emoji, symbols and arrows (🥂 ✓ → ← · ★ …), numbers, percentages, units (`%`, `g/L`, `°C`, `abv`), years, chemical formulas, and the letter labels a), b), c).
- Leading/trailing spaces and punctuation that glues to a placeholder (e.g. `"of"`, `" · "`): keep the shape.
- Brand and product names: The Wine Goat, Google, Apple, iPhone, Edge, Chrome stay as they are.
- Short codes in the source (e.g. `SAT`, `MCQ` labels, `Pass`, `Merit`, `Distinction` grade names) stay in English when they are grade names of the exam.

## Wine and spirits terminology

- Grape varieties and place names: as the wine trade of that country writes them (de: Burgund, Bordeaux, Rhône, Spätburgunder only when the German wine is meant; ja/ko/zh-hant/th: the established local transliteration, e.g. ja シャルドネ, ko 샤르도네, zh-hant 夏多內; el/tr: the usual trade spelling, often the original Latin form).
- Appellation names and legal terms are **never translated**: Barolo DOCG, Rioja Gran Reserva, Chablis Premier Cru, Prädikatswein, Vin de Pays, Bourbon, Cognac VSOP, Tequila reposado… keep the original spelling. Translate only the explanation around them.
- Tasting terms: use the standard terms of the systematic tasting approach in that language if they exist (acidity, tannin, body, finish, medium(-)/medium(+) keep the `(-)`/`(+)` marks); otherwise the usual professional terms.
- Do not mention any exam body, course provider, book or publisher (no "WSET", no book titles), even if a source string seems to; write "the exam", "the course", "the syllabus". Never mention The Wine Goat's own prices (subscription, plans, discounts, payment). Wine prices, costs, cheap/expensive and value in the source are translated FAITHFULLY: never soften, reword or drop them. Never imply an affiliation with any organisation.

## Register and wording

- Speak to the learner informally and warmly, the way the English does ("you"):
  - de: **du** (lowercase), nl: **je/jij**, el: informal singular (εσύ), tr: **sen**
  - ja: **です／ます** style, no overly honorific keigo
  - ko: **해요체**
  - zh-hant: **Taiwan usage** and vocabulary (你, 葡萄酒, 軟體 not 软件; full-width punctuation ，。：？！「」)
  - pt: **Brazilian Portuguese** with neutral vocabulary (você), avoiding regional slang
  - th: polite and neutral; **no gendered particles** (no ครับ / ค่ะ); use คุณ when a pronoun is needed
- Neutral, inclusive wording: never only masculine or only feminine forms for the learner. Rephrase (de "Du bist bereit" → prefer structures without gendered nouns; pt "Pronto/a" → "Tudo pronto"; el avoid gendered adjectives about the learner).
- Interface strings (buttons, tabs, menus) must stay short: a button label should not be much longer than the English. German compounds are fine but avoid very long ones in buttons.
- Keep the meaning, not the words: idioms and wine jokes (e.g. "What a vintage!") should become a natural equivalent.
- Questions and answer options: translate so that exactly one option stays correct; do not add hints that give the answer away, and keep options parallel in length and form.

## Workflow

1. Take a chunk, e.g. `src/core/000.json`, translate item by item, write `tools/i18n/<lang>/core/000.txt` (UTF-8, `\n` line endings).
2. Run `python3 tools/i18n/build_lang.py <lang>`; fix any line-count error or placeholder warning.
3. Check in the app: `app/?lang=<lang>` (Level 3), then `#lvl=1`, `#lvl=2`, `#lvl=s1`, `#lvl=s2`.
4. Commit only your `tools/i18n/<lang>/…` files, `tools/i18n/<lang>-map.json`, `app/i18n/<lang>.js`, `app/i18n/<lang>/*.js` and the version line in `app/index.html` written by the build.

If the extraction changes later (always run `build_lang.py <lang>` first, then `python3 tools/i18n/extract_all.py`), your work is kept in `<lang>-map.json`: run `python3 tools/i18n/build_lang.py <lang> --resync` to rewrite the `.txt` files aligned with the new chunks (known translations filled in, new items empty), then translate only the empty lines.
