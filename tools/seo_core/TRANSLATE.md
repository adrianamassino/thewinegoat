# Translating the spirits SEO pages

Source: `/home/claude/thewinegoat/tools/seo_core/content/en_a.json` + `en_b.json` (8 page keys). Rules: `/home/claude/thewinegoat/tools/seo_core/SPEC.md` (read the Rules section).

Write `/home/claude/thewinegoat/tools/seo_core/content/<lang>.json` with the same 8 keys and the SAME structure: same number and order of body blocks, same block types, same table shapes, same number of FAQ items; in `qs` blocks keep the correct-option index aligned with the translated options.

- Native, idiomatic, expert writing — a localisation, not a word-for-word translation. Sentences may be restructured.
- SEO: title (≤ 62 characters), desc (140–158 characters in that language; for ja/ko/zh about 70–90 characters), kw and h1 must use what people in that market actually search: keep "WSET" and the level wording used locally and the local seed keywords listed below.
- Keep spirit names, legal terms and label terms as used in that country (e.g. Cognac, VSOP, Bourbon, Single Malt, añejo, London Dry Gin stay as is; add a short local gloss where helpful).
- Units: keep % abv; volumes in ml/cl as in source.
- Neutral wording for the reader: no feminine-only or masculine-only forms (use impersonal or plural forms where the language allows).
- Never add prices or payment. Keep "start free" wording. Never claim affiliation with WSET.
- Validate with python json.load; check every key, block count per page equals the English one. Reply only with "ok <lang>" and total word count.

## Local seed keywords (from the SEO plan; use them naturally in title, h1, desc, kw, headings)
- en (International): WSET exam preparation; WSET mock exam; WSET practice questions; WSET study guide
- fr (France / Francophone): préparation examen WSET; examen blanc WSET; quiz WSET; questions WSET
- it (Italy): preparazione esame WSET; simulazione esame WSET; quiz WSET; domande WSET
- es-es (Spain): preparación examen WSET; simulacro WSET; preguntas WSET; test WSET
- es-ar (Argentina): preparación examen WSET; simulacro de examen WSET; preguntas de práctica WSET; estudiar vinos
- de (Germany / German-speaking): WSET Prüfungsvorbereitung; WSET Übungstest; WSET Prüfungsfragen; Lernkarten WSET
- pt (Portugal): preparação exame WSET; teste WSET; perguntas WSET; exame simulado
- pt-br (Brazil): preparação para prova WSET; simulado WSET; questões WSET; estudar vinhos
- pl (Poland): przygotowanie do egzaminu WSET; test WSET; pytania WSET; fiszki WSET
- ru (Russian-speaking): подготовка к экзамену WSET; тест WSET; вопросы WSET; карточки WSET
- ar (Arabic-speaking): التحضير لامتحان WSET; اختبار WSET; أسئلة WSET; دراسة النبيذ
- ja (Japan): WSET 試験対策; WSET 模擬試験; WSET 問題集; ワイン学習
- ko (South Korea): WSET 시험 준비; WSET 모의고사; WSET 연습문제; 와인 공부
- el (Greece): προετοιμασία εξετάσεων WSET; τεστ WSET; ερωτήσεις WSET
- bg (Bulgaria): подготовка за изпит WSET; тест WSET; въпроси WSET
- nl (Netherlands / Dutch-speaking): WSET examen voorbereiding; WSET oefentoets; WSET oefenvragen; wijn leren
- zh-hans (Mainland China / simplified script): WSET 考试准备; WSET 模拟考试; WSET 练习题; 葡萄酒学习
- zh-hant (Taiwan / Hong Kong / traditional script): WSET 考試準備; WSET 模擬考試; WSET 練習題; 葡萄酒學習
- th (Thailand): เตรียมสอบ WSET; แบบทดสอบ WSET; ข้อสอบฝึกหัด WSET
- tr (Turkey): WSET sınavına hazırlık; WSET deneme sınavı; WSET test soruları
- es-uy (Uruguay): preparación WSET Uruguay; examen WSET Uruguay; simulacros WSET; cursos de vino online
- es-cl (Chile): preparación WSET Chile; examen WSET Chile; simulacro WSET; estudiar vinos online
- es-co (Colombia): preparación WSET Colombia; examen WSET Colombia; simulacro de examen WSET; curso de vinos online
- es-pe (Peru): preparación WSET Perú; examen WSET Perú; preguntas WSET; curso de vinos online
- es-ec (Ecuador): preparación WSET Ecuador; examen WSET Ecuador; preguntas WSET; aprender de vinos
- es-py (Paraguay): preparación WSET Paraguay; examen WSET Paraguay; estudiar vinos online
- es-bo (Bolivia): preparación WSET Bolivia; examen WSET Bolivia; estudiar vinos online
- es-ve (Venezuela): preparación WSET Venezuela; examen WSET Venezuela; simulacro WSET
- Note: our Spain Spanish lives at /es/ (use es-ES keywords there); es-ar is Argentina. In French the drinks are "spiritueux" (never "spirits" as a common noun).
