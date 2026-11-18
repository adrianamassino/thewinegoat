# Wave 2: more WINE Level 2 questions (target: about 1,000 in total)

First read and follow every rule in `/home/claude/thewinegoat/tools/spirits/s2/BRIEF.md` (wording rules, 4 languages, format, option rules), with these replacements because this batch is the WINE Level 2 course (exam: 50 multiple-choice questions in 60 minutes; pass 55%):
- Facts: `/tmp/claude-0/-home-claude/3f268032-b4c3-5225-a7f8-c79dc4579a8b/scratchpad/sp/w2c.txt` (the Level 2 wine book as OCR text; about 34,000 words; OCR has typos).
- Programme and chapter ids: `/home/claude/thewinegoat/app/l2/structure.js` (`window.TWG_L2.chapters`).
- Existing content: `/home/claude/thewinegoat/tools/l2/out/*.json` (same format). Read the existing questions of your chapters first.
- Stay at Level 2 depth: only what the book covers. No WSET or book names in the content.

Your job now is to ADD questions (plus a few flashcards) for the chapters in your task, going deeper so that the whole book content for those chapters is covered.

1. Read the existing content for your chapters in `/home/claude/thewinegoat/tools/l2/out/*.json` (all files; questions with `"c"` = your chapters) so you never repeat a fact in the same way. A new question may test the same fact only from a clearly different angle (e.g. reverse direction, scenario, comparison).
2. Re-read the relevant book chapters in `w2c.txt` line by line and make a checklist of EVERY examinable fact: each grape and its key regions, climate influence, vineyard and winery choice, style, label term, appellation rule, region, sub-region, food and service fact. Make sure each item gets at least one question across old + new content.
3. Mix types: direct facts, "which is NOT…", cause → effect, compare two spirits, label decoding ("a bottle says X: what does it tell you?"), customer/bar scenarios, odd-one-out. About 35% easy, 45% medium, 20% hard.
4. A wrong option is the longest in at least half the questions. Correct option always first.
5. Output: `/home/claude/thewinegoat/tools/l2/out/<LETTER>.json` with keys `"lessons": []` (or new lessons only if your task asks), `"questions": [...]`, `"flash": [...]` (new flashcards only, none repeating existing ones).
6. Validate as in the brief. Also check that no new English question text equals an existing one. Reply with counts per chapter only.
