# Translating the wine guide pages (and the Thai/Turkish homes)

One job = **one group × one language** = one file. Repo: `/home/claude/thewinegoat`.

- Source: `tools/site_i18n/src/<group>.json` → `{"group", "sha", "words", "segments": [{"t": English text, "k": kind, "n": note}]}`.
  Read the published English page too (`source` field, e.g. `wset-level-2/index.html`) for context.
- Write: `tools/site_i18n/<lang>/<group>.json`
  ```json
  {"group": "wset-level-2", "lang": "de", "src_sha": "<the sha of src/<group>.json>", "segments": ["…", "…"]}
  ```
  `segments` = the translations, **same order and same count** as the source (one string per source segment, never merge or skip).
- Languages: `de nl pl pt pt-br ru el ja ko zh-hans zh-hant ar th tr` (es-ar is generated from the Spanish pages, don't translate it).
  Group `_home` (the English home) is translated **only for `th` and `tr`**.
- Groups and sizes: `tools/site_i18n/src/_counts.json` (or run `python3 tools/site_i18n/extract.py`).

## Format rules (the build refuses the file otherwise)
- Valid JSON (check with `python3 -c "import json;json.load(open('tools/site_i18n/de/wset-level-2.json'))"`).
- Keep **every placeholder** `{1}` … `{/1}` exactly once: they are the links and bold/italic tags of the sentence. Translate the text
  *inside* them (`{1}Home{/1}` → `{1}Startseite{/1}`); you may move a pair when the word order needs it, but never put
  text that belongs in a link outside it. Keep `{s} {m} {n} {t}` variables (home widget) and emoji.
- Plain text only: no HTML, no Markdown; `&` and `<` are written as is (the build escapes them).
- No empty strings. Numbers that are only numbers (question numbers) stay as they are.
- Then run the check: `python3 tools/site_i18n/build.py <lang> --check --group <group>` → must say `1 page(s) ready` with no `✗`.

## Writing rules
- **Localisation, not literal translation**: native, idiomatic, expert writing for a wine student in that market; restructure sentences freely.
- **SEO**: segment kind `title` ≤ 62 characters; kind `desc` (the first one is the meta description) 140–158 characters
  (ja/ko/zh: about 70–90). Title, H1, description, keywords (`meta`) and headings use what people in that market search:
  keep "WSET" and the level naming used locally (e.g. de "WSET Level 3", pt-br "WSET Nível 3", tr "WSET Seviye 3", ja "WSETレベル3").
  Local seed keywords: see `tools/seo_core/TRANSLATE.md` (section *Local seed keywords*).
- **Wine terms**: appellation and region names as used in that market's wine trade (never translate an appellation: Châteauneuf-du-Pape,
  Rioja, Barolo, Mosel…); grape names as used locally (Spätburgunder in a German sentence only when that is the usual term; otherwise the
  international name). Keep official qualification names (Award in Wines, Diploma) as the local trade uses them.
- **Neutral wording** for the reader: no feminine-only or masculine-only forms (use impersonal/plural forms where possible). Informal
  "you" where the language uses it for learning apps (de du, nl je, el informal, tr sen, pt-br você, pt tu/você neutral; ja です/ます;
  ko 해요체; th polite neutral without ครับ/ค่ะ; ar Modern Standard Arabic).
- **Never** add The Wine Goat's own prices or payment (wine prices and costs in the source are translated faithfully, never softened); never claim any affiliation with or endorsement by WSET; never call our questions
  "official" or "real exam questions" (say practice / sample questions). Keep "start free" wording.
- Facts stay exactly as in English (exam formats, numbers, percentages, marks); units as in the source.
- **Length**: the published page must keep ≥ 3,000 words for alphabetic languages; ja/zh/ko/th are counted in characters
  (≥ about 4,800 ja, 4,200 zh, 5,400 ko, 12,000 th). Don't summarise. The build prints the size of every page.
- Structured-data segments (kind `ld`) are mostly the FAQ and the headline: use the same wording as the visible text.

## Building and publishing (builder / coordinator)
```
python3 tools/site_i18n/extract.py                 # (re)extract the English source segments, prints the per-group counts
python3 tools/site_i18n/build.py de --check        # validate all German files, write nothing
python3 tools/site_i18n/build.py de                # publish German pages (+ hreflang/switchers/sitemap/llms.txt sync)
python3 tools/site_i18n/build.py                   # every language that has files, plus es-ar from the Spanish pages
python3 tools/site_i18n/linkcheck.py               # whole site: no 404, hreflang reciprocal (exit code 1 on problems)
```
Re-run `build.py` (no arguments) after `tools/seo2/build.py` / `expand.py`, which rewrite the en/it/fr/es guides with 4 languages only.
If an English page changes, re-run `extract.py`: older translations keep building (the previous source is kept in `src/_old/`),
but new English text stays in English until the file is updated against the new `src/<group>.json` (the build reports it).
