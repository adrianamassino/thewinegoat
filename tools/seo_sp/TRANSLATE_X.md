# Translating the long-form extensions

Source: `/home/claude/thewinegoat/tools/seo_sp/content/en_x.json` (extra body sections + extra FAQ for each of the 8 pages). Follow the rules of `/home/claude/thewinegoat/tools/seo_sp/TRANSLATE.md` (localise, don't translate word for word; local keywords; neutral wording; no prices; keep block structure, table shapes, qs answer indices).
Also read the already translated base file for your language (`<lang>.json` in the same folder) so terminology, app feature names and register (tu/vous/du/voseo…) match.
Write `/home/claude/thewinegoat/tools/seo_sp/content/<lang>_x.json` with the same keys and the same structure as en_x.json. Validate with json.load and check block counts match en_x. Reply "ok <lang>" + word count.
- Status: Spirits Levels 1 and 2 are available in the app; Level 3 in preparation. In French the drinks are 'spiritueux'.
