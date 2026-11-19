# The Wine Goat: GEO / AI search optimization report

Date: 2026-11-19. Scope: the static site in this repository (English at the root plus 18 language folders; `app/` excluded except where stated). The report keeps apart what was **done and tested** from the repository and what **needs external access or manual action**. Nothing here claims that ChatGPT, Gemini, Perplexity, Copilot, Claude or Google AI features will mention or recommend The Wine Goat: the changes make the site easier to crawl, understand and cite; whether AI systems use it is outside the site's control.

Owner decisions applied: robots.txt keeps allowing every crawler, including training crawlers (rules unchanged; classification documented in section 5). No invented founders, credentials, user numbers, reviews, ratings, awards or WSET affiliation. No prices.

---

## 1. Technical audit

Tools: `tools/seo_tech/audit.py`, `tools/site_i18n/linkcheck.py`, `tools/geo/crawl_access.py` (new), `tools/geo/sitewide.py --check` (new).

| Area | State after this work | Evidence |
|---|---|---|
| Indexable pages | 952 HTML pages audited, 950 URLs in sitemap.xml (+ sitemap-images.xml from the image workflow) | audit.py exit 0 |
| Internal links | 87,045 internal links, 0 broken | linkcheck.py |
| hreflang | 0 problems (reciprocity, self-reference, lang match), x-default everywhere | linkcheck.py |
| Canonicals | 1 per page, self-referencing, https apex | audit.py |
| Titles / descriptions / h1 | 1 each per page; 33 duplicate descriptions remain (es vs es-ar pairs of older guides, non-blocking) | audit.py |
| robots.txt | All crawlers allowed, 0 Disallow, Sitemap lines for sitemap.xml and sitemap-images.xml | crawl_access.py |
| Meta robots | noindex only on 404.html, en/index.html (redirect stub), it/capre/ (private); /app/ noindex by design | crawl_access.py |
| Content without JavaScript | Homes, hubs, guides, question pages, spirits pages and the new pages have h1 and main text in the initial HTML (median 900–3,700 words per family) | section 5 |
| Structured data | Every page: valid JSON-LD, exactly one Organization (`https://thewinegoat.com/#organization`) and one WebSite (`https://thewinegoat.com/#website`); all author/publisher/provider/creator references point to them; Article/WebPage nodes have datePublished/dateModified from git | validation over 953 pages, 0 anomalies |
| Semantic HTML / breadcrumbs | header/nav/main/article/footer, visible breadcrumbs + BreadcrumbList on guides and hubs | generators, spot checks |
| Mobile | New pages at 375 px: no horizontal scroll, 0 console errors | Playwright (section 3) |
| HTTPS | Certificate valid for apex and www, but **Enforce HTTPS is off** on GitHub Pages (workflow token gets 403); last live redirect matrix 18 PASS / 18 FAIL | tools/seo_tech/live_report.md |
| Prices | No visible prices. Removed school prices and "paid access / one-off price" from llms.txt. A machine-readable price table (`"cur": {"list": …}`) is still inside the JSON of 17 home pages (section 4) | grep over all pages |

## 2. Files changed

Commits: `d0097c4` (pages, tools, screenshots, llms), `1d92ec6` (`[seo-meta]` site-wide footer + JSON-LD pass), and the commit adding this report and `tools/geo/crawl_access.py`.

New:
- `tools/geo/pages.py`: builds About, wine maps and wine level test pages in en/it/fr/es/es-ar (es-ar = voseo of es via `tools/site_i18n/es_ar_extra.py` plus fixes), the sitemap `<!--geo-->` block and the llms.txt / llms-full.txt sections; then runs `tools/seo_tech/images.py --pages` and `tools/geo/sitewide.py` (`--no-post` skips them).
- `tools/geo/sitewide.py`: idempotent site-wide pass (footer About link, one Organization + WebSite per page, references normalized, git dates, footer date aligned); `--check` mode.
- `tools/geo/crawl_access.py`: robots.txt per crawler, meta robots / X-Robots scan, static-HTML content check.
- `tools/geo/slugs.json`, `tools/geo/content/{about,maps,test}.{en,it,fr,es,es-ar}.txt` (es-ar files = title/description overrides only).
- Pages: `/about/`, `/it/chi-siamo/`, `/fr/a-propos/`, `/es/sobre-nosotros/`, `/es-ar/sobre-nosotros/`; `/wine-maps/`, `/it/mappe-del-vino/`, `/fr/cartes-des-vins/`, `/es/mapas-del-vino/`, `/es-ar/mapas-del-vino/`; `/wine-level-test/`, `/it/test-livello-vino/`, `/fr/test-niveau-vin/`, `/es/test-nivel-vino/`, `/es-ar/test-nivel-vino/`.
- `img/screens/` (6 WebP screenshots of the real app, 600 px wide): `wine-maps-interactive-atlas-france-wine-regions.webp`, `wine-maps-atlas-bordeaux-cotes-de-bourg-detail.webp`, `wine-maps-game-modes-bordeaux.webp`, `wine-maps-game-find-pessac-leognan.webp`, `wine-level-test-quick-challenge-question.webp`, `wine-level-test-result-ready.webp`.
- `tools/geo/REPORT.md` (this file).

Modified:
- All 950 public HTML pages (`[seo-meta]` commit): footer About link (localized label; languages without an About page link to /about/ with hreflang="en"), JSON-LD normalization, git dates.
- `tools/seo_core/build.py`, `tools/seo_sp/build.py`, `tools/site_i18n/build.py`: one hook each running `tools/geo/sitewide.py --quiet` after the existing `images.py` hook.
- `tools/seo_tech/audit.py`: three non-blocking "(check)" rules (missing canonical Organization, old `#org`/`#site` ids, footer without About link).
- `assets/seo.css`: screenshot figure styles. `sitemap.xml` (+15 URLs with alternates), `llms.txt`, `llms-full.txt`.

Images (scope change from the coordinator): no existing image, goat illustration or `<img>` tag was renamed or edited by this work; renames, alt text, srcset and the image sitemap belong to the image-SEO workflow (`tools/seo_tech/images.py`). This work only added the 6 screenshots above, each with descriptive alt text in the page language, width/height, `loading="lazy"`, `decoding="async"`.

## 3. Completed improvements (done and tested)

| # | Improvement | How it was tested |
|---|---|---|
| 1 | AI crawler access report (robots per crawler, meta robots, static content per family, search vs training classification) | `python3 tools/geo/crawl_access.py` (section 5) |
| 2 | About page in en/it/fr/es/es-ar, 3,393–3,652 words each: what it is, who it serves, mission, qualifications + status table, features, daily workflow, multilingual scope, editorial approach (writing, checking, corrections, AI-assisted translation disclosed), independence, limits, contact, key facts; AboutPage + Organization + WebSite + WebApplication + BreadcrumbList + FAQPage JSON-LD; only sameAs = Instagram | word counts from the build; JSON-LD parses; linkcheck; Playwright 375 px |
| 3 | About link in the footer of every public page (both footer templates), label in 19 languages | sitewide check: 0 footers without it |
| 4 | "Interactive wine maps" page (3,069–3,361 words): atlas, 5 game modes, 3 difficulty levels, the 42 maps with place counts (1,053 total, read from the app data), data sources as stated in the app, 6 real geography questions from the app bank, study method, common-mistakes table, 4 real screenshots | facts from `app/index.html` (MAPS array, map tiles, UI strings); screenshots with Playwright from the local app |
| 5 | "Wine knowledge test" page (3,011–3,241 words): quick challenge (20 questions), 50-question level session, 3 written questions, result bands (40% / 70% as coded), forecast, to-do list, challenge a friend, 6 real questions, a real written question with marking points, 2 real screenshots | facts from app code (LVQ_N=20, lvStartMix, lvResHTML, strings) |
| 6 | Existing feature pages audited: wset-exam-preparation, wset-practice-questions, wset-mock-exams, wset-flashcards, wset-study-planner, how-it-works, faq exist in 19 languages with 3,000+ words; no duplicates created for flashcards, planner or preparation; "wine learning platform" is covered by About + how-it-works instead of a thin new page | reading the generated pages |
| 7 | Structured data: one Organization (logo ImageObject, email, Instagram sameAs, factual description) + one WebSite on every page; inline/old org refs unified; Article/WebPage/CollectionPage with author/publisher = Organization, isPartOf, image, datePublished (first git commit) and dateModified (last git commit, ignoring `[seo-meta]` commits) | script over 953 pages: all JSON-LD parses, 1 Organization + 1 WebSite per page, no old ids |
| 8 | llms.txt / llms-full.txt: facts updated (5 levels available, 2 in preparation, tools, 14 interface languages, 4 full-content languages, exam formats, contact); removed "Level 3 only", unverified counts and prices; new generated "About and feature pages" sections. No claim that llms.txt affects AI visibility | review; regenerated by pages.py |
| 9 | Builders hooked so rebuilds keep the footer link and JSON-LD | hooks after images.py |
| 10 | Mobile rendering | Playwright 375 px on /about/, /wine-maps/, /wine-level-test/, /fr/cartes-des-vins/, /es-ar/test-nivel-vino/, /it/chi-siamo/: scrollWidth 375, 0 console errors, tables collapse to cards |
| 11 | Regression | audit.py exit 0; linkcheck.py 0 broken, 0 hreflang problems |

## 4. Remaining issues

| Issue | Why it matters | Suggested fix |
|---|---|---|
| Enforce HTTPS off; half of the redirect matrix fails | http/www variants may be crawled separately | Owner: GitHub → Settings → Pages → Enforce HTTPS |
| Frequent "Page build failed" in the live report | deploys can lag behind main | check Pages logs; consider an Actions-based deploy |
| Price table in the JSON of 17 home pages (`"cur": {"list": …}`) | owner rule: no prices; crawlers read inline JSON | move price data into the app; remove from home HTML |
| dateModified = 2026-11-19 on most pages (the image-SEO commit touched every page today) | weakens freshness signals | tag template-only commits with `[seo-meta]` (ignored by sitewide.py) |
| 33 duplicate meta descriptions (es vs es-ar older guides) | minor | give es-ar pages their own descriptions |
| About / maps / test only in en/it/fr/es/es-ar | other languages link to the English About page | translate following the owner's all-languages rule, keeping facts identical |
| CJK/Thai word counts look low in crawl_access.py | counting artefact (no spaces), not thin content | count characters for ja/zh/ko/th |
| Editorial section mentions AI-assisted translation | accurate, but owner should confirm wording | owner review |
| No author/reviewer person anywhere | expertise signals rely on people; none were invented | optional real profile with verifiable qualifications |

## 5. AI crawler access report

Hosting: GitHub Pages (static files behind Fastly). No bot rules, firewall or rate limits are configurable, and no `X-Robots-Tag` headers can be set; only robots.txt and meta tags control crawlers. Live status codes, CDN behaviour per user agent and HTTPS redirects must be verified from outside (live workflow `tools/seo_tech/live_check.sh`).

### Search/answer crawlers vs training crawlers

| Crawler / token | Operator | Type | Effect of allowing | robots.txt |
|---|---|---|---|---|
| Googlebot | Google | Search (also AI Overviews / AI Mode) | needed for Google Search and its AI features | Allowed |
| Bingbot | Microsoft | Search (also grounds Copilot) | needed for Bing and Copilot | Allowed |
| OAI-SearchBot | OpenAI | Search / answer | pages can appear and be cited in ChatGPT search | Allowed |
| ChatGPT-User | OpenAI | User-triggered fetch | ChatGPT opens a page on request | Allowed |
| Claude-SearchBot | Anthropic | Search / answer | pages can be found for Claude search answers | Allowed |
| Claude-User | Anthropic | User-triggered fetch | Claude opens a page on request | Allowed |
| PerplexityBot | Perplexity | Search / answer index | indexing and citation by Perplexity | Allowed |
| Perplexity-User | Perplexity | User-triggered fetch | fetch on request | Allowed |
| DuckAssistBot | DuckDuckGo | Answer fetch | DuckAssist answers | Allowed |
| Applebot | Apple | Search | Siri / Spotlight | Allowed |
| MistralAI-User | Mistral | User-triggered fetch | Le Chat fetches | Allowed |
| YandexBot | Yandex | Search | Yandex index | Allowed |
| Amazonbot | Amazon | Search/answers and training | Alexa answers, Amazon models | Allowed |
| GPTBot | OpenAI | Training | content may train OpenAI models | Allowed (owner decision) |
| ClaudeBot, anthropic-ai | Anthropic | Training | content may train Anthropic models | Allowed (owner decision) |
| Google-Extended | Google | Control token (Gemini training/grounding) | does not affect Google Search | Allowed (owner decision) |
| Applebot-Extended | Apple | Control token (training) | Apple AI models | Allowed (owner decision) |
| meta-externalagent | Meta | Training / AI features | Meta AI | Allowed (owner decision) |
| CCBot | Common Crawl | Open corpus used for training | enters Common Crawl | Allowed (owner decision) |

To withdraw training permission later without touching search, add `Disallow: /` only to the training groups (GPTBot, ClaudeBot, anthropic-ai, Google-Extended, Applebot-Extended, meta-externalagent, CCBot).

### Repository checks (`python3 tools/geo/crawl_access.py`)

- robots.txt: each crawler above has its own `Allow: /` group; 0 Disallow; `/app/` allowed; Sitemap lines for sitemap.xml and sitemap-images.xml.
- Meta robots: `noindex` on 3 pages only (404.html, en/ redirect stub, it/capre/). No `nosnippet`, `max-snippet:0`, `noarchive`, `noai` or meta X-Robots-Tag anywhere; indexable pages use `index,follow,max-snippet:-1,max-image-preview:large`.
- Content in the initial HTML (no JavaScript executed):

| Page family | Pages | Min words | Median words | h1 in static HTML | Under 300 words |
|---|---|---|---|---|---|
| Home pages | 20 | 3 (redirect stub) | 896 | 19 | 1 (en/ stub, noindex) |
| Core hubs (seo_core) | 152 | 340 | 3,420 | 152 | 0 |
| Spirits pages (seo_sp) | 152 | 295 | 3,690 | 152 | 2 (zh, counting artefact) |
| Guides and other pages | 223 | 3 (404) | 3,501 | 222 | 9 (404, noindex, ja artefact) |
| Question pages | 391 | 277 | 3,611 | 391 | 5 (ja artefact) |
| About + feature pages (new) | 15 | 3,273 | 3,536 | 15 | 0 |

- JavaScript: site pages need no JavaScript for their text, FAQ answers (`<details>`) and sample-question answers. The app at /app/ renders with JavaScript and is `noindex` (correct for the product); its public description lives on the About and feature pages.

## 6. Content roadmap (original content, no thin translated doorways)

Principles: one strong master per topic written from the specifications and checked; translations only with the same depth; no near-duplicate doorway pages; answer first, then depth.

| Priority | Cluster | Original content to create | Languages first |
|---|---|---|---|
| 1 | WSET Level 2 | grape-by-grape guide (principal varieties, styles, regions), label-terms glossary, 4-week plan with real app questions | en, it, fr, es |
| 1 | Wine regions | deep guides per key region with map screenshots and 10 app questions each (Bordeaux, Burgundy, Rhône, Loire, Piemonte, Tuscany, Rioja/Ribera, Douro, Mosel, Napa, Mendoza, Marlborough) | en, it, fr, es |
| 1 | Tasting | SAT walk-through with worked notes for 6 classic wines, common marking errors | en, it, fr, es |
| 2 | Viticulture & winemaking | explainers mirroring the animated films (vineyard year, red/white/rosé, sparkling, Sherry, Port) with film stills | en, it, fr, es |
| 2 | Spirits | Spirits Level 2 category guides with production diagrams | en, then exam languages |
| 2 | Study technique | active recall / spacing / interleaving applied to wine exams; written-answer technique with marked examples | en, it, fr, es |
| 3 | Original research | aggregated, anonymised "most-missed topics" from app data (consent + privacy review) | en + summaries |
| 3 | Glossary | one multilingual wine-term glossary per language, linked from flashcards | all languages |

## 7. AI visibility benchmark

**Baseline NOT recorded.** ChatGPT Search, Gemini, Perplexity and Copilot cannot be queried from this environment, so nothing below is measured. Someone with access must run every question on every platform (clean or logged-out session), fill the recording table, and repeat monthly with the same wording.

Competitors to note when they appear: WSET course providers and the WSET site, Quizlet / Anki decks, other WSET prep apps and sites (e.g. Sommo), wine-school blogs, Reddit communities.

| # | Lang | Question |
|---|---|---|
| 1 | en | What is the best app to prepare for the WSET Level 3 wine exam? |
| 2 | en | How do I study for WSET Level 2 in four weeks? |
| 3 | en | Where can I find WSET Level 3 practice questions with answers? |
| 4 | en | Is there a free WSET Level 1 practice test online? |
| 5 | en | What are good WSET mock exams online? |
| 6 | en | How do I practise the WSET Level 3 short written answers? |
| 7 | en | Best way to learn wine regions for WSET? |
| 8 | en | Are there interactive wine maps to study for WSET? |
| 9 | en | Flashcards for WSET Level 3 grape varieties? |
| 10 | en | How many hours should I study for WSET Level 3? |
| 11 | en | What is The Wine Goat app? |
| 12 | en | Is The Wine Goat affiliated with WSET? |
| 13 | en | Apps to prepare WSET Spirits Level 2? |
| 14 | it | Qual è la migliore app per preparare l'esame WSET livello 3? |
| 15 | it | Dove trovo domande d'esame WSET 3 con risposte in italiano? |
| 16 | it | Come studiare per il WSET livello 2 lavorando a tempo pieno? |
| 17 | it | Esistono simulazioni d'esame WSET online in italiano? |
| 18 | it | Come imparare le regioni del vino per il WSET? |
| 19 | it | Flashcard per il WSET in italiano? |
| 20 | it | Quanto tempo serve per preparare il WSET 3? |
| 21 | it | Che cos'è The Wine Goat? |
| 22 | it | App per studiare il vino in italiano |
| 23 | it | Come si scrivono le risposte aperte del WSET 3? |
| 24 | fr | Quelle application pour préparer le WSET niveau 3 ? |
| 25 | fr | Où trouver des QCM WSET niveau 2 avec corrigés en français ? |
| 26 | fr | Comment réviser le WSET niveau 3 en travaillant ? |
| 27 | fr | Existe-t-il des examens blancs WSET en ligne ? |
| 28 | fr | Comment apprendre les régions viticoles pour le WSET ? |
| 29 | fr | Cartes interactives des vins pour réviser ? |
| 30 | fr | The Wine Goat, c'est quoi ? |
| 31 | fr | Combien d'heures de révision pour le WSET 3 ? |
| 32 | fr | Préparer le WSET Spirits niveau 1 gratuitement |
| 33 | es | ¿Cuál es la mejor app para preparar el WSET nivel 3? |
| 34 | es | ¿Dónde encuentro preguntas de examen WSET 2 con respuestas en español? |
| 35 | es | ¿Cómo estudiar para el WSET nivel 3 trabajando? |
| 36 | es | Simulacro de examen WSET online en español |
| 37 | es | ¿Cómo aprender las regiones del vino para el WSET? |
| 38 | es | ¿Qué es The Wine Goat? |
| 39 | es | App para estudiar vinos en español argentino (WSET) |
| 40 | es | ¿Cuántas horas de estudio necesita el WSET 3? |
| 41 | es | Test de nivel de vino online gratis |
| 42 | es | Flashcards para el WSET en español |

Recording table (one row per question × platform; first run = baseline):

| Date | Platform (ChatGPT Search / Gemini / Perplexity / Copilot) | Q# | Brand mentioned (Y/N) | Recommended (Y/N, position) | Cited thewinegoat.com URL(s) | Competitors mentioned | Description accurate? (Correct / Partly / Wrong + note) | Notes |
|---|---|---|---|---|---|---|---|---|
| _not recorded_ | | | | | | | | |

Metrics per platform and month: mention rate (÷ 42), citation rate (÷ 42), recommendation frequency, most-cited URLs, share of voice vs each competitor, number of inaccurate descriptions (each fixed at the source page).

## 8. 90-day plan

| Weeks | Action | Owner / access |
|---|---|---|
| 1 | Record the benchmark baseline (section 7) | owner (manual) |
| 1 | Enable Enforce HTTPS; recheck the redirect matrix with the live workflow | owner (GitHub) |
| 1 | Verify Google Search Console and Bing Webmaster Tools; submit sitemap.xml and sitemap-images.xml | owner (accounts) |
| 1–2 | IndexNow: key file `7f3c2a9e5b1d4c8fa6e0b2d97c31e5a4.txt` is at the root; submit the new About / maps / test URLs | owner / workflow with network |
| 2 | Remove the inline price table from the home HTML | developer |
| 2–3 | Review the editorial section of About; decide on a real author/reviewer profile | owner |
| 3–6 | Roadmap priority 1 (Level 2 grape guide, 4 region guides with maps, SAT walk-through) | content |
| 4–8 | Digital PR: pitch the free maps, free Level 1 and the level test to wine-education newsletters, schools, student communities, wine-career podcasts, associations in IT/FR/ES/AR; genuine editorial mentions only (no paid reviews, fake testimonials or link schemes) | owner |
| 6 | Second benchmark run; fix inaccurate AI descriptions at the source page | owner |
| 6–10 | About / maps / test in the next languages with demand | content |
| 8–12 | Roadmap priority 2 | content |
| 12 | Third benchmark run; Search Console / Bing data; reprioritize | owner |

## 9. Prioritized backlog

| # | Item | Effort | Expected impact | Status |
|---|---|---|---|---|
| 1 | Enforce HTTPS on GitHub Pages | XS | High | needs owner |
| 2 | Search Console + Bing Webmaster Tools + sitemaps | S | High (indexing data) | needs owner |
| 3 | IndexNow submissions (key file at root) | S | Medium | needs network / owner |
| 4 | AI visibility baseline (42 × 4) | M | required to measure | needs manual action |
| 5 | Remove inline price JSON from homes | S | Medium | to do |
| 6 | Fix Pages build failures / Actions deploy | M | Medium | to do |
| 7 | Region guides with map screenshots | L | High (original, citable) | to do |
| 8 | Level 2 grape guide + SAT walk-through | M | High | to do |
| 9 | About / maps / test in more languages | M per language | Medium | to do |
| 10 | Real author/reviewer profile (only if verifiable) | S | Medium | owner decision |
| 11 | es-ar unique descriptions for older guides | S | Low | to do |
| 12 | `[seo-meta]` tag for template-only commits | XS | Low–medium | process |
| 13 | Digital PR around maps and level test | M, ongoing | High over time, not guaranteed | needs owner |
| 14 | Aggregated research from app data (privacy review) | L | High citation potential | later |

### Done and tested vs needs external access

- **Done and tested:** section 3, items 1–11.
- **Needs external access or manual action:** Search Console, Bing Webmaster Tools, IndexNow submissions, Enforce HTTPS, Pages build logs, the AI visibility baseline and monthly re-runs, digital PR, owner review of the editorial section, any author profile.

## How to rerun

```
python3 tools/geo/pages.py            # About / maps / test pages, sitemap block, llms sections (+ images.py, sitewide.py)
python3 tools/geo/sitewide.py --check # expect 0 pages to change
python3 tools/geo/crawl_access.py     # crawler access report
python3 tools/seo_tech/audit.py && python3 tools/site_i18n/linkcheck.py
```
