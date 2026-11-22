# -*- coding: utf-8 -*-
"""Makes videos/<id>/zh-hant.json from zh-hans.json: OpenCC s2twp (Taiwan vocabulary and phrases), then the wine
names used on the site's zh-hant pages (Taiwan usage: 夏多內, 白蘇維濃, 勃根地, 隆河 ...).
    pip install opencc-python-reimplemented
    python3 tools/video-long/lib/zh_hant.py <video-id>
Review the result: it is a starting point, not a substitute for reading it."""
import json
import os
import sys

from opencc import OpenCC

TERMS = [
    ('霞多麗', '夏多內'), ('長相思', '白蘇維濃'), ('雷司令', '麗絲玲'), ('白詩南', '白梢楠'), ('赤霞珠', '卡本內蘇維濃'),
    ('設拉子', 'Shiraz'), ('西拉', '希哈'), ('歌海娜', '格那希'), ('丹魄', '田帕尼優'), ('桑嬌維塞', '山吉歐維榭'),
    ('內比奧羅', '內比歐露'), ('勃艮第', '勃根地'), ('北羅訥', '北隆河'), ('南羅訥', '南隆河'), ('羅訥', '隆河'),
    ('盧瓦爾河谷', '羅亞爾河谷'), ('盧瓦爾', '羅亞爾河'), ('澳大利亞', '澳洲'), ('新西蘭', '紐西蘭'), ('摩澤爾', '摩塞爾'),
    ('聖埃美隆', '聖愛美濃'), ('托斯卡納', '托斯卡尼'), ('皮埃蒙特', '皮蒙'), ('巴巴萊斯科', '巴巴瑞斯科'),
    ('經典基安蒂', '經典奇揚地'), ('基安蒂', '奇揚地'), ('佳美娜', '卡門內爾'), ('佳美', '加美'), ('仙粉黛', '金芬黛'),
    ('蒙特布查諾', '蒙鐵布奇亞諾'), ('富爾民特', '福明'), ('特濃情', '多隆帝斯'), ('瓊瑤漿', '格烏茲塔明那'),
    ('維歐尼', '維歐尼耶'), ('孔得里約', '恭德里奧'), ('桑塞爾', '松塞爾'), ('普伊芙美', '普依芙美'), ('普伊富賽', '普依富塞'),
    ('武弗雷', '梧雷'), ('賽美蓉', '榭密雍'), ('慕合懷特', '慕維得爾'), ('里奧哈', '利奧哈'), ('杜埃羅河岸', '斗羅河岸'),
    ('普里奧拉托', '普里奧拉'), ('俄勒岡', '奧勒岡'), ('博若萊', '薄酒萊'), ('蘋果酸乳酸發酵', '乳酸轉換'),
    ('視頻', '影片'),
]


def convert(obj, cc):
    if isinstance(obj, str):
        s = cc.convert(obj)
        for a, b in TERMS:
            s = s.replace(a, b)
        return s
    if isinstance(obj, list):
        return [convert(x, cc) for x in obj]
    if isinstance(obj, dict):
        return {k: (convert(v, cc) if k not in ('labels',) else {kk: convert(vv, cc) for kk, vv in v.items()}) for k, v in obj.items()}
    return obj


def main(vid):
    d = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'videos', vid)
    src = json.load(open(os.path.join(d, 'zh-hans.json'), encoding='utf8'))
    out = convert(src, OpenCC('s2twp'))
    for sc in out['scenes'].values():  # narration must stay free of Latin letters for the Mandarin voice
        sc['say'] = [t.replace('Shiraz', '設拉子') for t in sc.get('say', [])]
    with open(os.path.join(d, 'zh-hant.json'), 'w', encoding='utf8') as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
        f.write('\n')


if __name__ == '__main__':
    main(sys.argv[1])
