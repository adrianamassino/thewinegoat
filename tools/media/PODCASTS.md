# Podcast lessons for Wine L1/L2 and Spirits L1/L2 (The Wine Goat)

Each chapter of a level gets one spoken lesson, like the 45 podcast lessons of wine Level 3 (see the style in `/home/claude/thewinegoat/app/podtext/en.json`: read 2–3 of them first). The text is read aloud (recorded voice or the device's voice) and shown under the player.

## Style
- Spoken, warm, clear: "In this lesson we…", short sentences, signposting ("First…", "Now…", "To sum up…"), concrete images and examples, one memorable tip per lesson, a 3–4 sentence recap at the end ("Before the quiz, remember three things: …").
- Paragraphs of 50–110 words, 8–14 paragraphs, 700–1,200 words per lesson in English (other languages similar).
- Cover ALL the chapter's topics (see the structure file's `lessons` list for the chapter) at the right depth for the level; facts must match the level's content files and the book text. Never copy the book's sentences.
- No exam-body or book names (never "WSET", "the workbook", "the specification"); say "the exam" generically. No prices, no brands of drinks.
- Neutral wording for the listener (no feminine-only or masculine-only forms).
- Write naturally for the ear: no tables, no bullet lists, no parentheses-heavy text, no abbreviations that sound odd (write "percent" style numbers as words where natural in each language: "forty percent", "quaranta per cento"…); "abv" → "alcohol by volume".

## Output (one file per batch): `/home/claude/thewinegoat/tools/media/out/<track>_<letter>.json`
```json
{ "pods": [ { "c": "<chapter id>", "t": ["title it","title fr","title en"], "p": { "it": ["para", ...], "fr": [...], "en": [...] } } ] }
```
Languages: it, fr, en (same content, idiomatic in each; adapt, don't translate word for word). Validate with json.load and report word counts per lesson (en).
