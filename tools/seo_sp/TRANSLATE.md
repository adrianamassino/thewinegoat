# Translating the spirits SEO pages

Source: `/home/claude/thewinegoat/tools/seo_sp/content/en_a.json` + `en_b.json` (8 page keys). Rules: `/home/claude/thewinegoat/tools/seo_sp/SPEC.md` (read the Rules section).

Write `/home/claude/thewinegoat/tools/seo_sp/content/<lang>.json` with the same 8 keys and the SAME structure: same number and order of body blocks, same block types, same table shapes, same number of FAQ items; in `qs` blocks keep the correct-option index aligned with the translated options.

- Native, idiomatic, expert writing — a localisation, not a word-for-word translation. Sentences may be restructured.
- SEO: title (≤ 62 characters), desc (140–158 characters in that language; for ja/ko/zh about 70–90 characters), kw and h1 must use what people in that market actually search: keep "WSET" and the level wording used locally (e.g. it "WSET Spirits Livello 1", fr "WSET Spirits Niveau 1", de "WSET Level 1 Spirits", es "WSET Spirits Nivel 1"), plus local words for spirits/distillates, cocktail, pot still/column still, etc.
- Keep spirit names, legal terms and label terms as used in that country (e.g. Cognac, VSOP, Bourbon, Single Malt, añejo, London Dry Gin stay as is; add a short local gloss where helpful).
- Units: keep % abv; volumes in ml/cl as in source.
- Neutral wording for the reader: no feminine-only or masculine-only forms (use impersonal or plural forms where the language allows).
- Never add prices or payment. Keep "start free" wording. Never claim affiliation with WSET.
- Validate with python json.load; check every key, block count per page equals the English one. Reply only with "ok <lang>" and total word count.
