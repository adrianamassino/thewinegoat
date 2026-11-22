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

## Languages added later: sv da no fi ro hu is cs sk hr sl (tools/site_i18n/newlangs.py)
Folders `/sv/ /da/ /no/ /fi/ /ro/ /hu/ /is/ /cs/ /sk/ /hr/ /sl/`. Norwegian is Bokmål in `/no/`: `<html lang="nb">`, listed in
every hreflang cluster as both `nb` and `no` (same URL). Register and neutral wording per language: `LANG_NOTES.json`.
Localised slugs of all 68 pages already exist in the three slug files: never edit `slugs.json` for these languages.

**Everything is a group file** `tools/site_i18n/<lang>/<group>.json` (format above), one writer per file, nothing shared:

| group | what | words |
|---|---|---|
| `_home` | the home `/<lang>/` (built from the English home) | ~1,900 |
| `_images` | goat illustration alt/title texts | ~770 |
| `_core` | the 8 core pages (prep hub, wine, mock exams, practice, flashcards, planner, how it works, FAQ): all-or-nothing | ~26,300 |
| `_spirits` | the 8 spirits pages: all-or-nothing | ~28,900 |
| `_photos` | photo alt + caption (a photo appears on a page of the language only once translated) | ~6,200 |
| one per guide | the 52 guides (`src/_counts.json`, `batches.json`) | 2,500–4,100 each |

**Publishing rules (enforced by build.py)**: a page of these languages is written only when every segment of the current
English page has its translation (no mixed pages: `= <lang>/<group>: not published, N segment(s) …`); a file with more than
3% of long segments identical to English, or with "official" wording, is refused (`✗`). The home must exist before any
other page of the language (`_home` first, then `_images`, then the rest in any order). hreflang, language switchers,
sitemaps (`sitemap-<lang>.xml`) and llms.txt only list pages that exist.

**Commands** (repo root; one translator = one language × one or more groups; do not run other languages):
```
python3 tools/site_i18n/build.py sv --check                    # validate every sv file: "N page(s) ready", no ✗ (asset groups: "ok")
python3 tools/site_i18n/build.py sv --check --group wset-level-2
python3 tools/site_i18n/build.py sv                            # publish sv (home + guides + core/spirits when complete) and sync the site
bash tools/seo_tech/check_site.sh                              # must print ALL CHECKS PASSED before any push
```
Optional per-language translation memory (strings repeated across pages translated once): `tools/site_i18n/tm/tm.py`
(`next / add / emit / stat`); `emit` writes the group files above. Romanian has a started memory in `tm/ro.json`.
The home quiz shows English questions for these languages (its interface is translated in `assets/homequiz.js`).
