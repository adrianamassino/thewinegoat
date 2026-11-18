# Brief: Spirits Level 1 content (The Wine Goat)

You write study content for The Wine Goat, an exam-prep app. This batch: **Spirits Level 1** (beginner course, final exam = 30 multiple-choice questions in 45 min, pass 70%).

## Sources
- Facts: `/tmp/claude-0/-home-claude/3f268032-b4c3-5225-a7f8-c79dc4579a8b/scratchpad/sp/wb1c.txt` (the course workbook as text, 2021/22 edition). Read it fully first.
- Programme and chapter ids: `/home/claude/thewinegoat/app/spirits/s1/structure.js` (`window.TWG_S1.chapters`): each chapter has `lessons` = topics to cover.
- Style example (wine Level 1, same format): `/home/claude/thewinegoat/tools/l1/out/A.json` — look at 3–4 items only, to copy the format and tone.

## Hard rules
- **Never copy sentences, tables or lists from the workbook.** Use it only for facts; write everything in your own words, with your own examples and structure.
- **Never mention WSET, the workbook, "the course", "the specification", "the exam body" or any book** inside the content. Talk about "the exam" only in a generic way.
- Stick to the facts in the workbook and the structure file. Don't add facts beyond Level 1 depth, and don't contradict the workbook (e.g. XO = at least 10 years; Reposado 2–12 months; Añejo 12+ months; neutral spirit 95% or 96% abv).
- Neutral, inclusive wording: never feminine-only or masculine-only phrasing addressed to the learner (in it/fr/es prefer impersonal forms, "si", infinitives, "on", "tú/te" is fine in es; avoid "pronto/pronta", "sei sicura").
- No prices, no brands.
- Four languages for every text, always in this order: **[Italian, French, English, Spanish (Spain)]**. Natural, idiomatic, not literal. Same meaning in all four.

## Output
Write ONE JSON file: `/home/claude/thewinegoat/tools/spirits/s1/out/<LETTER>.json` (your letter is given in your task), UTF-8, valid JSON:

```json
{
  "lessons":   [ {"c": "<chapter id>", "t": [it,fr,en,es], "p": [[it,fr,en,es], ...3–5 paragraphs], "keys": [[it,fr,en,es], ...3–5 key points]} ],
  "questions": [ {"c": "<chapter id>", "q": [it,fr,en,es], "o": [[it,fr,en,es] x4 — the FIRST option is the correct one], "e": [it,fr,en,es], "d": [it,fr,en,es]} ],
  "flash":     [ {"c": "<chapter id>", "f": [it,fr,en,es], "b": [it,fr,en,es]} ]
}
```
- `e` = one short sentence: why the right answer is right. `d` = 2–4 sentences going deeper and saying why the tempting wrong options are wrong.
- Exactly 4 options per question, all plausible, similar length, only one correct, no "all of the above / none of the above". The correct one is ALWAYS first (the app shuffles).
- Mix question types: definitions, "which is true", "which spirit…", cause → effect, label terms, small scenarios ("a bartender wants…", "a customer asks…"). Vary difficulty: about 40% easy, 40% medium, 20% harder. No two questions testing the identical fact in the same way.
- Lessons: one per topic group in the chapter's `lessons` list (3–4 lessons per chapter), paragraphs of 50–90 words, friendly and clear, a small concrete image or example where useful.
- Flashcards: short front (a term or a question), back ≤ 20 words.

## When done
Validate with `python3 -c "import json;json.load(open('<file>'))"`, check every chapter id exists in the structure, every array has exactly 4 non-empty strings, every question has exactly 4 options. Reply with only the counts per chapter.
