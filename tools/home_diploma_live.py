# -*- coding: utf-8 -*-
"""Home pages, 19 languages: the Diploma (Level 4) card no longer says "coming soon". Units D1 and D2 are in the app,
the other units are in preparation. Sets the badge and the last sentence of the Level 4 card, and the same fact in the
hero sentence of the homes that mention the Diploma there. Structural and idempotent; also run by
tools/site_i18n/build.py (sync step), so the Thai/Turkish homes rebuilt from the English home keep their own wording.

Usage from repo root:  python3 tools/home_diploma_live.py [--quiet] [lang ...]   (default: all 19 homes; English = "en")"""
import os, re, sys, html
# lang: (badge, sentence added to the card text, [(old, new) in the hero sentence])
T = {
 'en': ('D1 and D2 available', 'D1 and D2 are in the app; the other units are in preparation.',
        [('the Diploma (Level 4) coming soon.', 'Diploma (Level 4): units D1 and D2 available, the other units in preparation.')]),
 'it': ('D1 e D2 disponibili', "D1 e D2 sono nell'app; le altre unità sono in preparazione.",
        [('Diploma (Livello 4) in arrivo.', 'Diploma (Livello 4): unità D1 e D2 disponibili, le altre in preparazione.')]),
 'fr': ('D1 et D2 disponibles', "D1 et D2 sont dans l'appli ; les autres unités sont en préparation.",
        [('Diploma (niveau 4) bientôt.', 'Diploma (niveau 4) : unités D1 et D2 disponibles, les autres en préparation.')]),
 'es': ('D1 y D2 disponibles', 'D1 y D2 ya están en la app; las demás unidades están en preparación.',
        [('Diploma (nivel 4) muy pronto.', 'Diploma (nivel 4): unidades D1 y D2 disponibles, las demás en preparación.')]),
 'es-ar': ('D1 y D2 disponibles', 'D1 y D2 ya están en la app; las demás unidades están en preparación.',
        [('Diploma (nivel 4) muy pronto.', 'Diploma (nivel 4): unidades D1 y D2 disponibles, las demás en preparación.')]),
 'de': ('D1 und D2 verfügbar', 'D1 und D2 sind in der App; die anderen Units sind in Vorbereitung.', []),
 'nl': ('D1 en D2 beschikbaar', 'D1 en D2 staan in de app; de andere units zijn in voorbereiding.', []),
 'pl': ('D1 i D2 dostępne', 'D1 i D2 są już w aplikacji; pozostałe moduły są w przygotowaniu.', []),
 'pt': ('D1 e D2 disponíveis', 'D1 e D2 já estão na app; as outras unidades estão em preparação.', []),
 'pt-br': ('D1 e D2 disponíveis', 'D1 e D2 já estão no app; as outras unidades estão em preparação.', []),
 'ru': ('D1 и D2 доступны', 'D1 и D2 уже в приложении; остальные модули в подготовке.', []),
 'el': ('D1 και D2 διαθέσιμες', 'Οι D1 και D2 είναι στην εφαρμογή· οι υπόλοιπες ενότητες είναι σε προετοιμασία.', []),
 'ja': ('D1・D2 提供中', 'D1とD2はアプリで提供中、その他のユニットは準備中です。', []),
 'ko': ('D1·D2 이용 가능', 'D1과 D2는 앱에서 이용할 수 있고, 나머지 유닛은 준비 중이에요.', []),
 'zh-hans': ('D1、D2 已上线', 'D1 和 D2 已在应用中上线，其余单元准备中。', []),
 'zh-hant': ('D1、D2 已上線', 'D1 和 D2 已在應用程式中上線，其餘單元準備中。', []),
 'ar': ('D1 و D2 متاحتان', 'الوحدتان D1 و D2 متاحتان في التطبيق؛ والوحدات الأخرى قيد الإعداد.', []),
 'th': ('D1 และ D2 เปิดให้ใช้แล้ว', 'D1 และ D2 อยู่ในแอปแล้ว ส่วนยูนิตอื่นอยู่ระหว่างจัดทำ',
        [('ส่วน Diploma (ระดับ 4) จะมาเร็วๆ นี้', 'ส่วน Diploma (ระดับ 4) เปิดให้ใช้ยูนิต D1 และ D2 แล้ว ยูนิตอื่นอยู่ระหว่างจัดทำ')]),
 'tr': ('D1 ve D2 kullanımda', 'D1 ve D2 uygulamada; diğer üniteler hazırlanıyor.',
        [('Diploma (Seviye 4) çok yakında.', 'Diploma (Seviye 4): D1 ve D2 üniteleri kullanımda, diğer üniteler hazırlanıyor.')]),
}
EN_SENT = T['en'][1]; EN_HERO = T['en'][2][0][1]


def fix(l):
    p = 'index.html' if l == 'en' else f'{l}/index.html'
    if not os.path.exists(p): return None
    s = open(p, encoding='utf8').read(); o = s
    badge, sent, hero = T[l]
    def card(m):
        c = m.group(0)
        c = re.sub(r'<span class="lbadge[^"]*">[^<]*</span>', lambda _: f'<span class="lbadge on">{html.escape(badge)}</span>', c, count=1)
        def ld(x):
            t = html.unescape(x.group(1))
            for old in {sent, EN_SENT}:      # a home rebuilt from the English one carries the English sentence
                t = t.replace(' ' + old, '').replace(old, '')
            return '<p class="ld">' + html.escape(t.rstrip() + ('' if l in ('ja', 'zh-hans', 'zh-hant') else ' ') + sent) + '</p>'
        return re.sub(r'<p class="ld">(.*?)</p>', ld, c, count=1, flags=re.S)
    s = re.sub(r'<article class="lcard l4[^"]*">.*?</article>', card, s, count=1, flags=re.S)
    for old, new in hero + ([(EN_HERO, hero[0][1])] if hero and l != 'en' else []):
        for f in (lambda x: x, html.escape, lambda x: html.escape(x, quote=False), lambda x: x.replace("'", '&#x27;')):
            s = s.replace(f(old), f(new))
    if s != o: open(p, 'w', encoding='utf8').write(s)
    return s != o


if __name__ == '__main__':
    langs = [a for a in sys.argv[1:] if not a.startswith('--')] or list(T)
    for l in langs:
        r = fix(l)
        if '--quiet' not in sys.argv: print(l, {None: 'no home', True: 'changed', False: 'same'}[r])
