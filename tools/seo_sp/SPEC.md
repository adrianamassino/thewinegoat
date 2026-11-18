# Spirits SEO pages (The Wine Goat) — content spec

Site: thewinegoat.com, an exam-prep app for the WSET wine AND spirits courses. Brand mascot: goats. Tone: expert, warm, clear, practical; written for people preparing a spirits exam or working behind a bar / in retail.

## Pages (8 per language; slugs fixed in `/home/claude/thewinegoat/tools/seo_sp/slugs.json`)
| key | topic | main keywords |
|---|---|---|
| hub | WSET Spirits courses explained: Levels 1, 2 and 3 compared, which one to choose, how to prepare | wset spirits, wset spirits course, wset spirits levels |
| l1 | WSET Level 1 Award in Spirits: complete guide (who it's for, syllabus, exam: 30 MCQ / 45 min / pass 70%, how to study, tasting basics) | wset level 1 spirits, wset spirits level 1 exam |
| l2 | WSET Level 2 Award in Spirits: complete guide (syllabus by area, exam 50 MCQ / 60 min / 55% pass, merit 70%, distinction 85%, question split 14/23/7/6, study plan, cocktails) | wset level 2 spirits, wset 2 spirits exam |
| l3 | WSET Level 3 Award in Spirits: complete guide (theory 50 MCQ + 10 short answers in 2 h 10; 2 blind spirits in 30 min, 25 marks each; grading 55/65/80 and distinction rule; what can come up blind; 'explain' questions) | wset level 3 spirits, wset 3 spirits exam, wset spirits tasting |
| qs | WSET Spirits practice questions with answers: 20 multiple-choice questions (8 Level 1, 8 Level 2, 4 Level 3-style) with answer + why | wset spirits practice questions, wset spirits mock exam |
| stills | How spirits are made: raw material → fermentation → distillation → after distillation; pot still vs column still (parts, double distillation, heads/hearts/tails, strength vs aroma); oak vs inert vessels; blending, colour, sugar, dilution | pot still vs column still, how spirits are made |
| cats | Spirits categories cheat sheet: brandy (Cognac, Armagnac, Calvados, Grappa, Pisco), whisky (Scotch, Bourbon, Tennessee, Rye, Irish, Canadian, Japanese), rum & cachaça, Tequila & Mezcal, vodka, gin, other flavoured spirits, liqueurs, vermouth — raw material, key rules, label terms, typical flavours | types of spirits, spirits cheat sheet, cognac vs armagnac, tequila vs mezcal |
| cocktails | Classic cocktail families: balance (strong / weak / sweet / sour-bitter), spirit-forward, short sours, highballs, long sours (Collins, sling, sparkling sour); specs as strong/sour/sweet/bitter tables; tools & glassware basics | classic cocktail families, cocktail specs, sour family |

## Sources for facts (never copy wording)
- Spirits L1 workbook: `/tmp/claude-0/-home-claude/3f268032-b4c3-5225-a7f8-c79dc4579a8b/scratchpad/sp/wb1c.txt`
- Spirits L2 book (OCR): `.../scratchpad/sp/wb2c.txt`
- L1 spec: `.../scratchpad/sp/a9a3f716-level-1-award-in-spirits-specification.txt`; L2 spec: `.../scratchpad/sp/l2.txt`; L3 spec (Feb 2025): `.../scratchpad/sp/l3.txt`
- Programme summaries: `/home/claude/thewinegoat/app/spirits/s1|s2|s3/structure.js`
Exam facts must match the specs exactly. Where the L1 workbook (2021/22) is newer than the L1 spec, prefer the workbook for content (e.g. XO = at least 10 years) and keep exam format as in the spec (30 MCQ, 45 min, 70%).

## Rules
- Own wording only. No copied sentences, tables or lists. Never reproduce the official tasting grid (SAT) as a table: describe the method in prose.
- The keyword "WSET" is fine on these pages (they are SEO pages); do NOT claim to be WSET or affiliated. Don't mention book titles. No brand names of spirits.
- NEVER mention prices, costs, subscriptions or payment. The app is presented as: "start free". Spirits Level 1 is live in the app; Spirits Level 2 is "coming very soon"; Spirits Level 3 "in preparation". Wine Levels 1, 2, 3 are live. App link text will be added by the template; you may refer to "The Wine Goat app" naturally 1–3 times per page (lessons, practice questions with explanations, flashcards, mock exams, games).
- Neutral wording: never feminine-only or masculine-only forms for the reader.
- Each page: 1,400–2,000 words of body text, genuinely useful (examples, comparisons, common mistakes, study tips, mini-tables), with H2 sections. Answer-first style for AI search: short clear definitions near the top of sections.
- Tables: comparison tables are encouraged (your own structure).
- FAQ: 6–8 questions per page, real search questions, answers 40–90 words.

## Output format (one JSON per language: `/home/claude/thewinegoat/tools/seo_sp/content/<lang>.json`)
```json
{ "<key>": {
   "title": "≤ 62 chars incl. ' | The Wine Goat' optional",
   "desc": "meta description 140–158 chars",
   "kw": "comma-separated keywords",
   "h1": "...",
   "tldr": "2–3 sentence answer-first summary",
   "lead": ["intro paragraph", "optional second"],
   "body": [ ["h2","..."], ["p","..."], ["ul",["..",".."]], ["table",["col1","col2"],[["r1c1","r1c2"]]], ["qs",[["question",["A","B","C","D"],0,"why"]]] ],
   "cta": ["CTA heading", "CTA sentence"],
   "faq": [["question","answer"]]
 }, ... all 8 keys ... }
```
`qs` block (only on page qs): list of [question, 4 options, index of correct option (vary it: 0–3), why]. Validate with python json.load.
