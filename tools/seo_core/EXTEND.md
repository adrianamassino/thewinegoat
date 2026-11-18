# Long-form extension: every SEO page ≥ 3,000 words (The Wine Goat)

Goal: each page must reach AT LEAST 3,200 words of visible text (tldr + lead + body + CTA + FAQ) in English, by ADDING genuinely useful sections — not padding, not repetition. Think: what would a serious candidate still want to know after reading the page? Add new subtopics, worked examples, step-by-step walk-throughs, comparison tables, "common mistakes and how to fix them", mini case studies ("a candidate with 6 weeks and a full-time job…"), glossaries of key terms with one-line definitions, checklists, regional/category deep dives, sample questions with explanations (as `["qs", …]` only on question-type pages), and 4–6 extra FAQ items (real search questions, 50–90 words each answer).

Rules: same as the page's SPEC (read it): own wording, facts consistent with the sources, no prices/payment, no affiliation claims, no exam-body/book names beyond the keyword "WSET", neutral wording for the reader, answer-first H2 sections. Do not repeat what the page already says (read the existing page content first).

Output format — `<content dir>/en_x.json`:
```json
{ "<page key>": { "body": [ ["h2","…"], ["p","…"], ["table",[…],[[…]]], ["ul",[…]], ["tip","…"], ["h3","…"] ], "faq": [["q","a"]] } }
```
The build appends `body` after the existing body and adds the FAQ items. To measure, run the build for English and count the words of the generated page (strip tags). Report per page: words before → after.
