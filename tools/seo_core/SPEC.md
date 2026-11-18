# Core SEO pages (The Wine Goat) — content spec

The Wine Goat (thewinegoat.com) is an independent exam-preparation and learning app for the WSET wine and spirits qualifications. Brand mascot: goats. Tone: expert, warm, clear, practical. Never claim to be WSET, an exam body or an Approved Programme Provider; never promise a pass; never call our questions "official".

## What the app really offers today (describe only this)
- Wine Level 1 (free), Wine Level 2 (about 1,070 practice questions), Wine Level 3 (2,000+ questions, 101 open questions with model answers and marking points, blind-tasting trainer with the systematic approach, maps, films, podcasts), Spirits Level 1 (free, about 210 questions) and Spirits Level 2 (about 1,000 questions). Spirits Level 3 and the Diploma: in preparation.
- For every available level: lessons by chapter, multiple-choice practice questions with a short explanation and a deeper "why the other options are wrong", flashcards with spaced repetition (cards you miss come back sooner), mock exams that mirror the real format and timing (Wine/Spirits L1: 30 questions in 45 min, pass 70%; L2: 50 in 60 min, pass 55%, merit 70%, distinction 85%; Wine L3 theory: 50 multiple-choice + 4 short written answers), a review of your own mistakes, short games (survival, match-it, lightning quiz), a personal study plan built from your exam date and target grade with a daily goal, streaks and progress per chapter, a label and glass scanner with a tasting diary ("My wines" / "My spirits").
- Languages of the app: Italian, French, English, Spanish (Spain and Argentina).
- NEVER mention prices, costs, subscriptions, plans to buy or payment. Use "start free" / "try it free".

## Pages (8 per language; slugs fixed in `/home/claude/thewinegoat/tools/seo_core/slugs.json`)
| key | role | main search intent (EN master) | title idea (EN master) |
|---|---|---|---|
| prep | hub: WSET exam preparation (all qualifications) — which level, how to prepare, study method, tools, links to wine and spirits hubs | WSET exam preparation | The Wine Goat — WSET Exam Preparation & Wine Learning |
| wine | hub: WSET Wine Levels 1, 2, 3 compared (format, content, study hours), which to choose, how the app covers each | WSET wine exam preparation | WSET Wine Exam Preparation: Levels 1, 2 and 3 |
| mock | mock exams: why they matter, how to run one (timing, conditions), how to review it, format of each level, common mistakes, what the app simulates | WSET mock exam | WSET Mock Exams and Practice Tests |
| practice | practice questions: how to use them, MCQ technique, include 12 sample questions with answers across wine L1/L2/L3 and spirits | WSET practice questions | WSET Practice Questions Online (with answers) |
| flashcards | flashcards & spaced repetition: why they work, what to put on cards (grapes, regions, label terms, numbers), sample cards table, routine | WSET flashcards | WSET Flashcards: Learn Wine & Spirits |
| planner | study planner: building a plan from the exam date, weekly templates for L1/L2/L3 (tables), daily goal, revision phases, last 2 weeks | WSET study plan | Plan Your WSET Exam Preparation |
| how | how The Wine Goat works: step by step (choose level/date/goal → daily plan → lessons/questions → mistakes come back → mock exams → scanner diary), who it's for, independence statement | how The Wine Goat works | How The Wine Goat Helps You Study |
| faq | FAQ page: 18–22 real questions about WSET preparation and the app (levels, exam format, study time, languages, free start, offline/devices, data/privacy basics, independence from WSET, tasting practice, spirits) | WSET preparation FAQ | WSET Preparation FAQs |

## Sources for exam facts
- Wine: structures in `/home/claude/thewinegoat/app/l1/structure.js`, `app/l2/structure.js`, existing guide pages `/home/claude/thewinegoat/wset-level-1/index.html`, `wset-level-2/index.html`, `wset-level-3-exam-format/index.html`, `wset-levels-explained/index.html` (read their text; do not copy).
- Spirits: `/home/claude/thewinegoat/tools/seo_sp/content/en_a.json`.
Facts must be consistent with those. Avoid claims you can't support (no pass rates, no prices of courses).

## Rules
- Own wording; answer-first sections (a 1–2 sentence direct answer under each H2), concrete examples, comparison tables, common mistakes, study tips.
- Body 1,300–2,000 words per page (faq page: the FAQ itself is the body — put 18–22 Q&As as `["h3",q],["p",a]` pairs grouped under 4–5 H2 topics, and keep the `faq` field to the 8 most important ones).
- Neutral wording for the reader (no feminine-only/masculine-only forms).
- Internal links are added by the template; you may mention other pages by name.

## Output format — `/home/claude/thewinegoat/tools/seo_core/content/<file>.json`
```json
{ "<key>": {
   "title": "≤ 62 chars", "desc": "140–158 chars", "kw": "comma-separated", "h1": "...",
   "tldr": "2–3 sentence answer-first summary", "lead": ["intro paragraph"],
   "body": [ ["h2","..."], ["p","..."], ["h3","..."], ["ul",[".."]], ["table",["col1","col2"],[["a","b"]]], ["tip","..."], ["qs",[["question",["A","B","C","D"],0,"why"]]] ],
   "cta": ["CTA heading", "CTA sentence"],
   "faq": [["question","answer"]]   // 5–8 items, 40–90 words each
 } }
```
`qs` blocks only on the practice page (correct index varies 0–3). Validate with python json.load.
