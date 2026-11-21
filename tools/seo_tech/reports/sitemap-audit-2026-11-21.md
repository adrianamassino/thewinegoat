# Sitemap and indexing audit — thewinegoat.com (2026-11-21)

Scope: the built static site in the repository (origin/main at a2f495e, 2026-11-20), the last live report of the
GitHub Action (tools/seo_tech/reports/2026-11-19_1933.md) and git history. The sandbox cannot reach thewinegoat.com,
and Search Console data was not available to me: everything about Google below is inference, marked as such.
Numbers were produced by scripts (crawl of the HTML from each home, following `<a href>` only, language menu excluded).

## 0. Top finding: 13 of 19 languages could not reach most of their own pages

Crawl from each language home, following links only, staying inside the language (language menu excluded):

| Language | Indexable pages | Reachable from its home | Not reachable | Home links to the English version instead of its own |
|---|---|---|---|---|
| en | 72 | 72 | 0 | – |
| it, fr | 72 | 72 | 0 | 0 |
| es | 72 | 72 | 0 | 0 |
| th, tr | 68 | 68 | 0 | 0 |
| es-ar | 71 | 20 | **51** | 3 (Level 1, 2, 3 guide cards) + Diploma/schools go to /es/ |
| de, nl, pl, pt, pt-br, ru, el, ja, ko, zh-hans, zh-hant, ar | 68 each | 17 each | **51 each** | 6 each (Level 1, Level 2, Level 3, Diploma, Diploma tips, schools) |

- The 51 unreachable pages per language are the whole wine-guide family built by tools/site_i18n (level guides,
  how-to-pass, the 28 Level 3 question pages, Diploma, schools, …). They link to each other, so they form an
  isolated cluster; the home reaches only the 8 core pages, 8 spirits pages and 1 About-type page.
- Cause: those homes were written before the guides existed in their language and never got the guide list the
  en/it/fr/es/th/tr homes have; their level cards ("Read the guide →") and footer point to the English pages.
- 78 links on 13 homes pointed to another language although the page exists in the home's language.
  Inner pages: I found none outside the language menu (the /de/wset-level-2/ → /wset-level-2/ example is the
  "English" entry of the language menu, which is correct).
- This is what the owner experienced as "the guides are missing": the pages exist, but from a German, Japanese…
  home you could only reach them through an English page and the language menu.
- Footer: the translated homes label the schools link "For schools" in English (13 homes, plus th/tr).

## 1. WSET guides per language (complaint "WSET 3 guides missing")

Pages that exist (identical families in all 19 languages, from the slug files):

| Family | Pages per language | Exists in |
|---|---|---|
| Level 1: complete guide, study guide, practice questions | 3 | all 19 |
| Level 2: complete guide, grapes & regions, practice questions, how to pass, L2 vs L3 | 5 | all 19 |
| Level 3: exam format, grapes, flashcards, practice questions, mock exam, short answers, SAT tasting, how to pass, questions by region + 28 region/topic pages | 37 | all 19 |
| **Level 3 complete guide (equivalent of /wset-level-1/, /wset-level-2/)** | **0** | **none** |
| Diploma: Diploma (Level 4) explained, Diploma study tips | 2 | all 19 |
| Spirits: hub, Level 1, 2, 3, practice questions, production, categories, cocktails | 8 | all 19 |

Linked from the home (before the fix), Level 3 pages out of 37: en/it/fr/th/tr 35, es 7, the other 13 languages 0
(their Level 3 card pointed to the English /how-to-pass-wset-level-3/). Confirmed by the owner: the missing page is
the Level 3 complete guide; another agent is creating /wset-level-3/ (en, it, fr, es, es-ar first). The generators
below pick it up automatically when it is published.

## 2. Current sitemap (before)

- One file, /sitemap.xml: 1,311 `<url>` (en 72, it 72, fr 72, es 72, es-ar 71, 14 × 68), 26,444 xhtml:link
  alternates, 204 image entries, changefreq/priority on 1,171 URLs, 3.06 MB. Plus /sitemap-images.xml (1,140 pages,
  285 images).
- Every `<loc>` is an existing, self-canonical, indexable page; no duplicates, no http/www, no redirects
  (live check of 19 Nov: 1,001/1,001 URLs 200 + self-canonical; the file has grown since).
- Not in it, correctly: /en/ (noindex redirect to /), /it/capre/ (noindex), /delete-account/ (noindex), /admin/, /app/.
- Seven different scripts appended blocks to it (site_i18n, seo_core, seo_sp, seo2 ×3, geo, place_photos): fragile,
  each stamps its own date.
- **lastmod is not trustworthy**: it is the date of the last build run, not of a content change (771 URLs dated
  2026-11-20, 304 dated 11-18…). Google ignores lastmod on sites where it is not consistently accurate.
- Size is well within limits (50,000 URLs / 50 MB per file).

## 3. Canonical, hreflang, robots, rendering

- Canonical: 1,311/1,311 indexable pages have exactly one self-referencing https canonical; og:url matches.
- hreflang (in `<head>`): 72 clusters (68 × 19 languages, 3 × 5, 1 × 4), every member lists the identical set,
  includes itself, has x-default (= English) and is reciprocal; all targets exist and are indexable; codes valid
  BCP 47 (es-AR, pt-BR, zh-Hans, zh-Hant). linkcheck: 0 problems. The sitemap alternates were identical to the `<head>`.
- Minor: the Portuguese home uses pt-PT while the 67 Portuguese guides use pt; the homes cluster had no plain `pt`
  (fixed: the home cluster now also lists `pt` → /pt/). The homes add regional codes (it-CH, fr-CA, es-MX, es-419,
  en-GB…) pointing to the same URLs: valid, harmless.
- noindex only where intended (admin, delete-account, /en/, /it/capre/, 404, app). No X-Robots headers possible on Pages.
- robots.txt: no Disallow, all crawlers allowed (owner's choice), Sitemap lines for sitemap.xml and sitemap-images.xml.
  CSS/JS not blocked.
- Rendering: all content is in the static HTML (no JS needed for text or links); 1 h1 per page; viewport set.
  Homes are heavy (≈ 255 KB HTML: 130 KB inline SVG, 66 KB inline CSS); guides ≈ 50 KB. Core Web Vitals could not be
  measured here (no access to the live site or CrUX).
- Titles: 0 duplicates. Meta descriptions: 33 identical pairs, all es vs es-ar.

## 4. Near-duplicates between regional variants (text of the content area)

| Pair | Pages | Word-sequence similarity (median) | Pairs ≥ 95 % similar | Identical descriptions |
|---|---|---|---|---|
| es vs es-ar | 71 | 0.989 | 63 | 33 |
| zh-hans vs zh-hant (after script conversion) | 68 | 0.971 | 61 | 0 |
| pt vs pt-br | 68 | 0.851 | 0 | 0 |
| en vs it (control) | 72 | 0.088 | 0 | 0 |

es-ar is derived from es by voseo rules; zh-hant and zh-hans are largely the same text in two scripts. That is
legitimate (hreflang tells Google they are alternates), but Google typically indexes one of two near-identical
pages and folds the other; expect es-ar and one Chinese variant to index slowly or not at all for a while.

## 5. Thin pages

None among guides (median 3,000–3,600 words; CJK/Thai 6,000–13,000 characters). The translated homes have the least
main text (660–990 words) but are rich pages. No empty or unfinished page found.

## 6. Non-site folders served by GitHub Pages

The whole repository is published (legacy Pages build from the root): /tools/ (≈2,450 files: JSON, TXT, Python,
reports), /mobile/, /supabase/, /social/ (Instagram images) are reachable by URL. Nothing on the site links to them
and they are not in any sitemap, so Google rarely finds them, but it can (the repository is public on GitHub too).
/app/ is noindex; /admin/ is noindex,nofollow; /delete-account/ is noindex,follow (correct: must stay reachable for
the app stores). Options (owner's decision, not implemented): (a) `Disallow: /tools/`, `/mobile/`, `/supabase/`,
`/social/` in robots.txt (no SEO page lives there; simplest; only stops crawling, URLs could still appear without
snippet); (b) publish with a GitHub Actions Pages workflow that uploads only the site folders (cleanest, nothing
else served; changes the deploy method, needs testing).

## 7. Why "Discovered – currently not indexed" (ranked)

1. **The site is days old and grew from 141 to 1,311 URLs in six days** (known). The domain went live on 12 Nov;
   most languages were published 18–20 Nov; HTTPS was only enforced on 19 Nov. "Discovered – not indexed" means Google
   knows the URL but has postponed crawling it; for a new domain with no external links Google crawls slowly and
   prioritises. Telling detail: the sitemap had **exactly 221 URLs on 14–15 Nov** (git history), the number in Search
   Console — the report most likely reflects that version; the Search Console sitemap counts lag by days.
2. **Little site authority / external links** (assumed, not measurable here): nothing tells Google these pages are
   worth crawling soon. This is usually the dominant factor for new sites.
3. **Weak internal linking in 13 languages** (known, section 0): 663 pages reachable only through English pages or
   the sitemap. Fixed in this work.
4. **Many near-identical regional pages** (known, section 4): es/es-ar and zh-hans/zh-hant, plus large-scale
   translated content appearing all at once; Google tends to defer such URLs.
5. **Unreliable lastmod** (known): every rebuild changed all dates. Fixed (dates now move only with real content).
6. **http/www duplicates until 19 Nov** (known from the live reports: 0/36 redirect checks passed before HTTPS was
   enforced). Now 301; harmless going forward, may have slowed early crawling.
7. Not the cause (checked): canonical errors, noindex, robots blocks, broken links, JavaScript rendering, server
   errors (all clean), sitemap format.

What will not help: requesting indexing URL by URL. What helps: time, internal links (done), consistent sitemaps
(done), external mentions/links (owner).

## 8. Planned locales without pages

bg, es-uy, es-cl, es-co, es-pe, es-ec, es-py, es-bo, es-ve: no page exists, so no sitemap file is generated for them
and nothing was created. (es-CL/CO/PE/UY appear as regional hreflang codes on the homes, pointing to /es/.)

## 9. Changes made (details in the final report of this work)

- tools/seo_tech/internal_links.py: links pointed to the page's own language, guaranteed reachability of every page
  from its language home, structured "All WSET guides" section on every home.
- tools/seo_tech/sitemaps.py: /sitemap.xml becomes an index of one sitemap per language with content-based lastmod;
  the only writer (old writers removed from 7 scripts).
- audit.py / linkcheck.py / live_check.sh: checks for the above.
