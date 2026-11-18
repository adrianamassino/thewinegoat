# Wave 2: more Spirits Level 2 questions (target: about 1,000 in total)

First read and follow every rule in `/home/claude/thewinegoat/tools/spirits/s2/BRIEF.md` (sources, wording rules, 4 languages, format, option rules).

Your job now is to ADD questions (plus a few flashcards) for the chapters in your task, going deeper so that the whole book content for those chapters is covered.

1. Read the existing content for your chapters in `/home/claude/thewinegoat/tools/spirits/s2/out/*.json` (all files; questions with `"c"` = your chapters) so you never repeat a fact in the same way. A new question may test the same fact only from a clearly different angle (e.g. reverse direction, scenario, comparison).
2. Re-read the relevant book chapters in `wb2c.txt` line by line and make a checklist of EVERY examinable fact: each raw material, process step, still part, label term, legal rule, region, style, country, botanical, cocktail and its ingredients. Make sure each item gets at least one question across old + new content.
3. Mix types: direct facts, "which is NOT…", cause → effect, compare two spirits, label decoding ("a bottle says X: what does it tell you?"), customer/bar scenarios, odd-one-out. About 35% easy, 45% medium, 20% hard.
4. A wrong option is the longest in at least half the questions. Correct option always first.
5. Output: `/home/claude/thewinegoat/tools/spirits/s2/out/<LETTER>2.json` with keys `"lessons": []` (or new lessons only if your task asks), `"questions": [...]`, `"flash": [...]` (new flashcards only, none repeating existing ones).
6. Validate as in the brief. Also check that no new English question text equals an existing one. Reply with counts per chapter only.
