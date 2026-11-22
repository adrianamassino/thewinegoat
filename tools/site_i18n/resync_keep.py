"""Moves stale translation files to the current English source when the changed English segments only
changed in ways the existing translation already covers (descriptions completed, captions, typo fixes).
Overrides for specific English strings can be given per language in OVR. Prints what it kept so it can be reviewed.
Usage: python3 tools/site_i18n/resync_keep.py <lang> [--dry]"""
import json, sys, subprocess, os
OVR = {'Partner programme': {'ko': '파트너 프로그램', 'zh-hant': '合作夥伴計畫', 'pt': 'Programa de parceiros', 'pt-br': 'Programa de parceiros',
                             'tr': 'Partner programı', 'th': 'โปรแกรมพาร์ทเนอร์', 'pl': 'Program partnerski', 'ru': 'Партнёрская программа',
                             'zh-hans': '合作伙伴计划', 'ar': 'برنامج الشركاء'}}
import newlangs as NL; NL.merge(OVR['Partner programme'], NL.PARTNER)
l = sys.argv[1]; tmp = f'/tmp/stale_{l}.json'
subprocess.run([sys.executable, 'tools/site_i18n/stale.py', l, '--json', tmp], capture_output=True)
st = json.load(open(tmp)).get(l, {})
delta = {}
for g, v in st.items():
    if not isinstance(v, dict): print('skip', g, v); continue
    T = json.load(open(f'tools/site_i18n/{l}/{g}.json', encoding='utf8'))['segments']
    for i, e in zip(v['changed'], v['en']):
        t = OVR.get(e, {}).get(l, T[i])
        delta.setdefault(l, {}).setdefault(g, {})[str(i)] = t
        print(f'{g}#{i}: EN «{e[:70]}» → keep «{t[:70]}»')
if '--dry' not in sys.argv and delta:
    json.dump(delta, open(f'/tmp/delta_{l}.json', 'w'), ensure_ascii=False)
    os.system(f'{sys.executable} tools/site_i18n/apply_delta.py /tmp/delta_{l}.json')
