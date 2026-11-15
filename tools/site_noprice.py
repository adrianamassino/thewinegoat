# -*- coding: utf-8 -*-
"""Home pages in 17 languages: no talk about prices or payment.
- trust line: 'Level 1 completely free' + 'no credit card' (instead of 'Bordeaux free' + 'no subscription')
- comparison table: the 'no subscription' row is removed
- FAQ: the 'how do modules work / one-off payment' question is removed, the 'what is free' answer and the
  '12 months' sentence are rewritten (HTML and FAQPage JSON-LD)
- Level 1 card: available, with a button that opens the app on Level 1
Run from the repo root: python3 tools/site_noprice.py"""
import re, json, html
L = {'.': 'en', 'it': 'it', 'fr': 'fr', 'es': 'es', 'es-ar': 'es-ar', 'de': 'de', 'nl': 'nl', 'pl': 'pl', 'pt': 'pt', 'pt-br': 'pt-br', 'ru': 'ru', 'el': 'el', 'ja': 'ja', 'ko': 'ko', 'zh-hans': 'zh-hans', 'zh-hant': 'zh-hant', 'ar': 'ar'}
TRUST = {'en': ('Level 1 completely free', 'No credit card'), 'it': ('Livello 1 completamente gratuito', 'Senza carta di credito'), 'fr': ('Niveau 1 entièrement gratuit', 'Sans carte bancaire'),
         'es': ('Nivel 1 totalmente gratis', 'Sin tarjeta'), 'es-ar': ('Nivel 1 totalmente gratis', 'Sin tarjeta'), 'de': ('Level 1 komplett kostenlos', 'Ohne Kreditkarte'), 'nl': ('Level 1 helemaal gratis', 'Zonder creditcard'),
         'pl': ('Poziom 1 całkowicie za darmo', 'Bez karty'), 'pt': ('Nível 1 totalmente grátis', 'Sem cartão'), 'pt-br': ('Nível 1 totalmente grátis', 'Sem cartão'), 'ru': ('Уровень 1 полностью бесплатно', 'Без банковской карты'),
         'el': ('Επίπεδο 1 εντελώς δωρεάν', 'Χωρίς κάρτα'), 'ja': ('レベル1は完全無料', 'クレジットカード不要'), 'ko': ('레벨 1 완전 무료', '카드 등록 불필요'), 'zh-hans': ('一级完全免费', '无需信用卡'), 'zh-hant': ('一級完全免費', '無需信用卡'), 'ar': ('المستوى 1 مجاني بالكامل', 'بدون بطاقة ائتمان')}
FREE_A = {'en': 'All of Level 1, with no limits. You can also start Levels 2 and 3 straight away, without a credit card.',
          'it': 'Tutto il Livello 1, senza limiti. E puoi iniziare subito anche i Livelli 2 e 3, senza carta di credito.',
          'fr': 'Tout le niveau 1, sans limite. Et vous pouvez commencer tout de suite les niveaux 2 et 3, sans carte bancaire.',
          'es': 'Todo el nivel 1, sin límites. Y puedes empezar ya los niveles 2 y 3, sin tarjeta.'}
YES_A = {'es-ar': 'Sí: podés empezar a practicar ya, sin tarjeta. Y el Nivel 1 es totalmente gratis.', 'de': 'Ja: Du kannst sofort üben, ohne Kreditkarte. Und Level 1 ist komplett kostenlos.',
         'nl': 'Ja: je kunt meteen oefenen, zonder creditcard. En Level 1 is helemaal gratis.', 'pl': 'Tak: możesz od razu ćwiczyć, bez karty. A Poziom 1 jest całkowicie darmowy.',
         'pt': 'Sim: pode começar a praticar já, sem cartão. E o Nível 1 é totalmente gratuito.', 'pt-br': 'Sim: você pode começar a praticar agora, sem cartão. E o Nível 1 é totalmente gratuito.',
         'ru': 'Да: можно сразу начать тренироваться, без банковской карты. А Уровень 1 полностью бесплатный.', 'el': 'Ναι: μπορείτε να ξεκινήσετε αμέσως, χωρίς κάρτα. Και το Επίπεδο 1 είναι εντελώς δωρεάν.',
         'ja': 'はい。クレジットカード不要ですぐに練習を始められます。レベル1は完全無料です。', 'ko': '네. 카드 없이 바로 연습을 시작할 수 있습니다. 레벨 1은 완전 무료입니다.',
         'zh-hans': '有。无需信用卡即可立即开始练习，一级完全免费。', 'zh-hant': '有。無需信用卡即可立即開始練習，一級完全免費。', 'ar': 'نعم: يمكنك البدء بالتدريب فورًا من دون بطاقة ائتمان. والمستوى 1 مجاني بالكامل.'}
BDX = r'Bordeaux|Burdeos|Bordéus|Бордо|Μπορντό|ボルドー|보르도|波尔多|波爾多|بوردو'
PAY = r'pagamento unico|one-off payment|un seul paiement|pago único|einmalige|eenmalige|jednorazow|pagamento único|разов|εφάπαξ|一回|한 번|一次性|دفعة واحدة'
MONTHS = r'\s*[^.。]*(12 mesi|12 months|12 mois|12 meses|12 Monate|12 maanden|12 miesięcy|12 месяцев|12 μήνες|12か月|12개월|12 个月|12 個月|12 شهرًا)[^.。]*[.。]'
SUBS = r'abbonament|abonnement|subscription|suscripci|Abo\b|subskrypc|assinatura|подписк|συνδρομ|サブスク|구독|订阅|訂閱|اشتراك'

SAY = {'en': 'Level 1 is free, try it! 🍇', 'it': 'Il Livello 1 è gratis, prova! 🍇', 'fr': 'Le niveau 1 est gratuit, essaie ! 🍇', 'es': 'El nivel 1 es gratis, ¡pruébalo! 🍇', 'es-ar': 'El nivel 1 es gratis, ¡probalo! 🍇',
       'de': 'Level 1 ist gratis, probier es! 🍇', 'nl': 'Level 1 is gratis, probeer het! 🍇', 'pl': 'Poziom 1 jest darmowy, spróbuj! 🍇', 'pt': 'O Nível 1 é grátis, experimenta! 🍇', 'pt-br': 'O Nível 1 é grátis, experimente! 🍇',
       'ru': 'Уровень 1 бесплатный, попробуй! 🍇', 'el': 'Το Επίπεδο 1 είναι δωρεάν, δοκίμασε! 🍇', 'ja': 'レベル1は無料！🍇', 'ko': '레벨 1은 무료! 🍇', 'zh-hans': '一级免费，来试试！🍇', 'zh-hant': '一級免費，來試試！🍇', 'ar': 'المستوى 1 مجاني، جرّبه! 🍇'}
SUB3 = {'en': 'Levels 1, 2 and 3 available now; the Diploma (Level 4) coming soon.', 'it': 'Livelli 1, 2 e 3 disponibili ora; Diploma (Livello 4) in arrivo.', 'fr': 'Niveaux 1, 2 et 3 disponibles ; Diploma (niveau 4) bientôt.',
        'es': 'Niveles 1, 2 y 3 disponibles; Diploma (nivel 4) muy pronto.', 'es-ar': 'Niveles 1, 2 y 3 disponibles; Diploma (nivel 4) muy pronto.', 'de': 'Level 1, 2 und 3 verfügbar.', 'nl': 'Level 1, 2 en 3 nu beschikbaar.',
        'pl': 'Poziomy 1, 2 i 3 dostępne.', 'pt': 'Níveis 1, 2 e 3 disponíveis.', 'pt-br': 'Níveis 1, 2 e 3 disponíveis.', 'ru': 'Уровни 1, 2 и 3 доступны.', 'el': 'Επίπεδα 1, 2 και 3 διαθέσιμα.',
        'ja': 'レベル1・2・3提供中。', 'ko': '레벨 1·2·3 이용 가능.', 'zh-hans': '一级、二级和三级现已上线。', 'zh-hant': '一級、二級與三級現已上線。', 'ar': 'المستويات 1 و2 و3 متاحة الآن.'}
OLD3 = {'en': 'Levels 2 and 3 available now; Level 1 and the Diploma (Level 4) coming soon.', 'it': 'Livelli 2 e 3 disponibili ora; Livello 1 e Diploma (Livello 4) in arrivo.', 'fr': 'Niveaux 2 et 3 disponibles ; niveau 1 et Diploma (niveau 4) bientôt.',
        'es': 'Niveles 2 y 3 disponibles; nivel 1 y Diploma (nivel 4) muy pronto.', 'es-ar': 'Niveles 2 y 3 disponibles; nivel 1 y Diploma (nivel 4) muy pronto.', 'de': 'Level 2 und 3 verfügbar, Level 1 folgt bald.', 'nl': 'Level 2 en 3 nu beschikbaar, Level 1 binnenkort.',
        'pl': 'Poziomy 2 i 3 dostępne, Poziom 1 wkrótce.', 'pt': 'Níveis 2 e 3 disponíveis, Nível 1 em breve.', 'pt-br': 'Níveis 2 e 3 disponíveis, Nível 1 em breve.', 'ru': 'Уровни 2 и 3 доступны, Уровень 1 скоро.', 'el': 'Επίπεδα 2 και 3 διαθέσιμα, Επίπεδο 1 σύντομα.',
        'ja': 'レベル2・3提供中、レベル1は近日公開。', 'ko': '레벨 2·3 이용 가능, 레벨 1 곧 출시.', 'zh-hans': '二级和三级现已上线，一级即将推出。', 'zh-hant': '二級與三級現已上線，一級即將推出。', 'ar': 'المستويان 2 و3 متاحان الآن، والمستوى 1 قريبًا.'}
for d, l in L.items():
    p = f'{d}/index.html'; s = open(p, encoding='utf8').read(); o = s
    a, b = TRUST[l]
    s = re.sub(r'(<ul class="trust3"><li>)✓ [^<]*(</li><li>)✓ [^<]*(</li>)', lambda m: f'{m.group(1)}✓ {a}{m.group(2)}✓ {b}{m.group(3)}', s, count=1)
    s = re.sub(r'<tr><th scope="row">[^<]*</th><td class="us">✓</td><td>[^<]*(' + SUBS + r')[^<]*</td></tr>', '', s)
    s = re.sub(r'<tr><th scope="row">[^<]*(' + SUBS + r')[^<]*</th><td class="us">✓</td><td>[^<]*</td></tr>', '', s)
    newfree = FREE_A.get(l) or YES_A.get(l)
    def fq(m):
        q, ans = m.group(1), m.group(2)
        txt = html.unescape(re.sub('<[^>]+>', '', ans))
        if re.search(PAY, txt): return ''
        if re.search(BDX, txt) and newfree: return f'<details class="fq"><summary>{q}</summary><p>{html.escape(newfree)}</p></details>'
        if re.search(MONTHS, txt): return m.group(0).replace(ans, re.sub(MONTHS, '', ans))
        return m.group(0)
    s = re.sub(r'<details class="fq"><summary>(.*?)</summary>(.*?)</details>', fq, s, flags=re.S)
    def ld(m):
        try: J = json.loads(m.group(1))
        except Exception: return m.group(0)
        def walk(n):
            if isinstance(n, list): return [walk(x) for x in n]
            if not isinstance(n, dict): return n
            if n.get('@type') == 'FAQPage':
                me = []
                for q in n.get('mainEntity', []):
                    t = q.get('acceptedAnswer', {}).get('text', '')
                    if re.search(PAY, t): continue
                    if re.search(BDX, t) and newfree: q['acceptedAnswer']['text'] = newfree
                    elif re.search(MONTHS, t): q['acceptedAnswer']['text'] = re.sub(MONTHS, '', t)
                    me.append(q)
                n['mainEntity'] = me
            if n.get('@type') == 'Offer' and re.search(BDX, str(n.get('name', ''))): n['name'] = {'en': 'Level 1'}.get(l, 'Level 1')
            return {k: walk(v) for k, v in n.items()}
        return '<script type="application/ld+json">' + json.dumps(walk(J), ensure_ascii=False) + '</script>'
    s = re.sub(r'<script type="application/ld\+json">(.*?)</script>', ld, s, flags=re.S)
    s = re.sub(r'"[^"<>]{0,40}(' + BDX + r')[^"<>]{0,40}🍇"', '"' + SAY[l] + '"', s)
    s = s.replace(OLD3[l], SUB3[l])
    # Level 1 card: available, button straight into the app on Level 1
    badge = re.search(r'<span class="lbadge on">(.*?)</span>', s).group(1)
    btn = re.search(r'<a class="b3 b3p sm" href="/app/#go=start&lvl=3">(.*?)</a>', s).group(1)
    for c in re.finditer(r'<article class="lcard">(.*?)</article>', s, re.S):
        if re.search(r'<p class="lnum">[^<]*<b>1</b>', c.group(1)):
            body = re.sub(r'<span class="lbadge">.*?</span>', f'<span class="lbadge on">{badge}</span>', c.group(1), 1)
            b1 = btn.replace('3', '1').replace('三', '一').replace('٣', '١')
            body = body.replace('<div class="lacts">', f'<div class="lacts"><a class="b3 b3p sm" href="/app/#lvl=1">{b1}</a>', 1)
            s = s[:c.start()] + '<article class="lcard live">' + body + '</article>' + s[c.end():]; break
    if s != o: open(p, 'w', encoding='utf8').write(s)
    print(d, 'changed' if s != o else 'same')
