# Sitemaps, internal links and checks — final report (2026-11-21)

Follows the audit in sitemap-audit-2026-11-21.md. All numbers below come from the scripts run on the final state of
main (`bash tools/seo_tech/check_site.sh`: ALL CHECKS PASSED). The live verification is in the newest
tools/seo_tech/reports/<date>_<time>.md written by the "Pages HTTPS + live SEO check" workflow.

## 1. Reachability per language (crawl from the language home, `<a>` links only, language menu excluded)

| Language | Indexable pages | Reachable before | Reachable now | 1 click | 2 clicks | 3+ clicks | Orphans now |
|---|---|---|---|---|---|---|---|
| en | 72 | 72 | 72 | 41 | 30 | 0 | 0 |
| it, fr, es | 72 each | 72 | 72 | 41 | 30 | 0 | 0 |
| es-ar | 71 | 20 | 71 | 40 | 30 | 0 | 0 |
| de, nl, pl, pt, pt-br, ru, el, ja, ko, zh-hans, zh-hant, ar | 68 each | 17 | 68 | 39 | 28 | 0 | 0 |
| th, tr | 68 each | 68 | 68 | 39 | 28 | 0 | 0 |

(The home itself is the remaining page of each row.) Before: 663 pages (51 × 13 languages) could not be reached from
their own home; now 0. Every page is within 2 clicks; the 28 Level 3 region pages are 2 clicks away (home → "questions
by region" → region). The audit now fails if a page is unreachable or more than 3 clicks from its home.

Planned locales without pages (nothing created, no sitemap): bg, ro (coming), es-uy, es-cl, es-co, es-pe, es-ec,
es-py, es-bo, es-ve. Owner's decision: no per-country copies; Uruguay → /es-ar/, the other countries → /es/ (hreflang, §4).

## 2. Links corrected

- 78 links on 13 homes pointed to the English (or Spanish) version of a page that exists in the home's language
  (level cards "Read the guide", Diploma card, footer schools link) → now the page in the home's language.
  Inner pages had none outside the language menu.
- "For schools" footer label in English on 15 translated homes → label in the language of the home.
- "All WSET guides" section on all 19 homes (703 links in total, 37–39 per home), grouped: WSET Level 1, Level 2,
  Level 3, Diploma, Practice questions, Mock exams, Study guides, How to pass WSET exams, WSET Spirits, WSET schools and
  providers. Labels and URLs in the language of the home, link text = the page's own heading without its subtitle.
  It replaces the older flat "More WSET resources" list on en/it/fr/es/th/tr (no duplicate block). Checked at 375 px
  (one column, no horizontal scroll, Arabic right-to-left) and 1280 px (four columns).
- Generated from tools/site_i18n/slugs.json, tools/seo_core/slugs.json, tools/seo_sp/slugs.json and the pages that
  exist: the Level 3 complete guide (`wset-level-3`) will appear under "WSET Level 3" in every language as soon as it
  is published; unknown future families (beer, sake…) go to the group matching their key or "More guides".

Not done, by choice:
- A separate "All guides"/blog index page per language: it would be a 19-page copy of the home section, new URLs on a
  9-day-old site that already has 1,311 URLs waiting for Google, and thin by nature (a list of links). The home section
  gives the same structure from the strongest page of each language. Can be added later if wanted.
- Previous/next links inside groups and a new "Home › Guides › group › article" breadcrumb: every guide already has a
  visible breadcrumb to its home (+ BreadcrumbList JSON-LD) and a "related resources" block with 6+ links in its own
  language; adding more link blocks would make pages repetitive without improving reachability (already ≤ 2 clicks).

## 3. Sitemaps

- /sitemap.xml is now a sitemap index: 19 language sitemaps (sitemap-en.xml, sitemap-it.xml, sitemap-fr.xml,
  sitemap-es-es.xml for /es/, sitemap-es-ar.xml, sitemap-de.xml, sitemap-nl.xml, sitemap-pl.xml, sitemap-pt.xml,
  sitemap-pt-br.xml, sitemap-ru.xml, sitemap-el.xml, sitemap-ja.xml, sitemap-ko.xml, sitemap-zh-hans.xml,
  sitemap-zh-hant.xml, sitemap-ar.xml, sitemap-th.xml, sitemap-tr.xml) + sitemap-images.xml.
- Same 1,311 URLs as before (old and new sets compared: identical; left out, correctly: /en/, /it/capre/,
  /delete-account/ = noindex). Only self-canonical, indexable pages with real text; no empty file is ever written.
- No hreflang in the sitemaps any more: every page carries its complete, reciprocal cluster in `<head>` (Google accepts
  either; one source cannot contradict itself). Files went from 3.06 MB to ≈ 140 KB in total.
- lastmod = date of the last change of the page's visible content (title, description, text, links of the content
  area), remembered in tools/seo_tech/sitemap_lastmod.json; template passes no longer move dates.
- One writer: tools/seo_tech/sitemaps.py, run last by the site_i18n sync and by every page builder (the 7 old
  writers were removed). robots.txt already points to /sitemap.xml (and sitemap-images.xml).

## 4. hreflang

- One policy on every page: generic language codes, the real regional versions (es-AR, pt-BR, zh-Hans, zh-Hant), x-default
  = English, and **es-UY → the Argentine page** on every cluster that has one. The 26 extra country codes the homes
  carried (it-CH, fr-CA, es-MX, es-419, en-GB, pt-PT…) pointed to the same URL as their generic code, so they added
  nothing; they were removed (1,801 tags normalised). Chile, Colombia, Peru, Ecuador, Paraguay, Bolivia, Venezuela,
  Mexico… are served /es/ by the generic `es`. Reciprocity: 0 problems (linkcheck); each code's language matches the
  `<html lang>` of its target (new audit check).

## 5. Regional variants

- es vs es-ar: the 33 identical meta descriptions replaced with Argentine ones (voseo "practicá, armá, prepará",
  "multiple choice", "cepas", "sacarle el jugo"), file tools/seo_tech/regional_meta.json, re-applied on every build.
  Duplicate descriptions now: 0. Titles were already distinct. The page bodies remain ~99 % identical (voseo is the
  main difference); a real Argentine adaptation of the text (local examples, Argentine wine regions, vocabulary) is
  content work for the owner to decide.
- pt vs pt-br: genuinely different texts (median similarity 0.85), nothing to change.
- zh-hans vs zh-hant: same text in two scripts (similarity 0.97 after conversion); legitimate with hreflang; expect
  Google to index one first.

## 6. Automated checks

- `bash tools/seo_tech/check_site.sh` (≈ 20 s): fails on broken internal links, links to another language when the
  page exists in this one, pages unreachable from their home or > 3 clicks, invalid/stale sitemaps or sitemaps listing
  a non-canonical/noindex/missing URL, unexpected noindex (documented exceptions: EXPECTED_NOINDEX in audit.py),
  hreflang to a missing/noindex page or to a page in another language, non-reciprocal hreflang.
  Tested by injecting each fault: all detected. `--install-hook` makes it a git pre-push hook (per clone; not
  installed in the shared checkout because it would block other agents' pushes — owner/coordinator to decide).
- `python3 tools/site_i18n/build.py` now exits with an error when sitemaps or links fail; sitemaps.py refuses to write
  invalid sitemaps.
- GitHub Action "Site checks" runs the same script on every push to main. GitHub Pages publishes main by itself, so a
  red Action does not stop a bad deploy: it is the alarm; the blocking gate is the script before pushing.
- GitHub Action "Pages HTTPS + live SEO check" now waits for the deploy, then fetches the index, every child sitemap
  (200 + XML) and every listed URL (200 without redirect, self-canonical, no noindex).

## 7. Remaining issues / decisions for the owner

1. Level 3 complete guide: missing in all languages until the other agent publishes /wset-level-3/ (picked up automatically).
2. The whole repository is served by GitHub Pages (/tools/, /mobile/, /supabase/, /social/): Disallow in robots.txt or
   deploy only the site folders with a Pages workflow (see audit §6).
3. es-ar and zh-hant bodies are near-copies of es and zh-hans (see §5).
4. About, wine maps, level test and photo credits exist only in en/it/fr/es (+ es-ar for some): other languages link
   to the English page in the footer (correct, no equivalent exists) — translating them is content work.
5. Homes are heavy (≈ 255 KB HTML, 130 KB inline SVG); Core Web Vitals not measurable from here.
6. Search Console: submit https://thewinegoat.com/sitemap.xml; indexing cannot be promised (new domain, see audit §7).
