import json, sys
sys.path.insert(0, '.')
import importlib, grapes_data
importlib.reload(grapes_data)
h = open('live.html').read()
def rep(a, b, c=1):
    global h
    assert h.count(a) == c, (a[:90], h.count(a)); h = h.replace(a, b)
dj = lambda o: json.dumps(o, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
G = [{k: v for k, v in g.items()} for g in grapes_data.G]
js = open('grapes.js').read().replace('__GRAPES__', dj(G)).replace('__UNITS__', dj([[u, n] for u, n in grapes_data.UNITS]))
MARK = '/* ---------- grape profiles + matching game ---------- */'
if MARK in h:
    a = h.index(MARK); b = h.index('/* ---------- mock exam ---------- */')
    h = h[:a] + js + '\n' + h[b:]
else:
    rep('/* ---------- mock exam ---------- */', js + '\n/* ---------- mock exam ---------- */')
    # nav + routing
    rep('const TRAIN=["practice","open","sat","maps"];', 'const TRAIN=["practice","open","sat","maps","grapes","match"];')
    rep('{practice:"g07",open:"g13",sat:"g12",maps:"g09"}[v]', '{practice:"g07",open:"g13",sat:"g12",maps:"g09",grapes:"n11",match:"n26"}[v]')
    rep('view=trainV=b.dataset.tv; lsSet("wset3-trainv",trainV); oq=null; satShow=null; satEdit=false; mg=null; render();',
        'view=trainV=b.dataset.tv; lsSet("wset3-trainv",trainV); oq=null; satShow=null; satEdit=false; mg=null; ML=null; render();')
    rep('  if(view==="exam"&&MK&&MK.go){', '  if(view==="match"&&ML){ m.innerHTML=renderLesson(); window.scrollTo(0,0); return }\n  if(view==="exam"&&MK&&MK.go){')
    rep('maps:renderMaps,errors:renderErrors,history:renderHistory}[view]();\n  bindView(); window.scrollTo(0,0);',
        'maps:renderMaps,grapes:renderGrapes,match:renderMatch,errors:renderErrors,history:renderHistory}[view]();\n  bindView(); window.scrollTo(0,0); if(view==="grapes"&&gvQ) gvFilter();')
    rep('if(d.id==="maps2"&&x&&x.m) mergeMaps(x.m);});\n    afterOALoad(); afterSJLoad(); afterMapsLoad();',
        'if(d.id==="maps2"&&x&&x.m) mergeMaps(x.m); if(d.id==="match"&&x&&x.m) mergeMT(x.m);});\n    afterOALoad(); afterSJLoad(); afterMapsLoad(); afterMTLoad();')
    rep('.tnav{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}', '.tnav{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}')
    CSS = '''
/* grapes + match */
.gfilt{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:14px 0 10px}
.gq{flex:1;min-width:200px;border:1px solid var(--line);border-radius:8px;padding:9px 12px;background:var(--surface);color:var(--fg);font:inherit}
.chip[aria-pressed="true"]{background:var(--accent);border-color:var(--accent);color:var(--surface)}
.gunit{margin-top:18px}.gunit h3{font-size:1rem;margin:0 0 8px}
.gcard{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);margin-bottom:8px;overflow:hidden}
.gcard summary{display:flex;align-items:center;gap:10px;padding:12px 14px;cursor:pointer;list-style:none}
.gcard summary::-webkit-details-marker{display:none}
.gcard summary::after{content:"";width:8px;height:8px;border-right:2px solid var(--muted);border-bottom:2px solid var(--muted);transform:rotate(45deg);margin-left:6px;transition:transform .2s}
.gcard[open] summary::after{transform:rotate(225deg)}
.gnm{font-weight:700}.gsy{font-size:.82rem;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.gdot{width:12px;height:12px;border-radius:50%;flex:none;border:1px solid var(--line)}
.gdot.gw,.gpill.gw{background:#e9d98a}.gdot.gb,.gpill.gb{background:#7a1f3d;color:#fff}
.gdots{display:inline-flex;gap:3px;margin-left:auto}.gdots i{width:7px;height:7px;border-radius:50%;background:var(--sunk);border:1px solid var(--line)}.gdots i.on{background:var(--good);border-color:var(--good)}
.gsheet{padding:2px 16px 16px;display:flex;flex-direction:column;gap:12px;border-top:1px solid var(--line)}
.gfacts{display:flex;flex-direction:column;gap:6px;padding-top:12px}
.gpills{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:4px}.gpill{font-size:.78rem;padding:3px 10px;border-radius:999px;background:var(--sunk)}.gpill.gw{color:#3a3000}
.gsc{display:grid;grid-template-columns:110px auto 1fr;gap:10px;align-items:center;font-size:.85rem}
.gsl{color:var(--muted)}.gsv{font-weight:600}
.gbar{display:inline-flex;gap:3px}.gbar i{width:22px;height:8px;border-radius:2px;background:var(--sunk)}.gbar i.on{background:var(--accent)}
.gsec h4{margin:0 0 4px;font-size:.78rem;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}
.gsec p{margin:0;line-height:1.5;max-width:75ch}
.gtip{background:color-mix(in srgb,var(--warn) 14%,var(--surface));border-left:3px solid var(--warn);padding:10px 12px;border-radius:6px;line-height:1.5}
.greg{display:flex;flex-wrap:wrap;gap:6px}.gchip::before{content:"⌖ ";color:var(--accent)}
.gsyn{margin:0;font-size:.88rem}
.mtbar{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:14px 0}
.mtbar>div,.mtstats>div{background:var(--sunk);border-radius:10px;padding:10px;text-align:center;display:flex;flex-direction:column}
.mtbar b,.mtstats b{font-size:1.35rem}.mtbar span,.mtstats span{font-size:.75rem;color:var(--muted)}
.mtlab{margin:6px 0;font-size:.8rem;color:var(--muted);text-transform:uppercase;letter-spacing:.06em}
.mtsnd{display:inline-flex;gap:6px;align-items:center;font-size:.85rem;margin-left:auto}
.mtpath{display:flex;flex-direction:column;gap:14px;margin-top:18px;padding:0 4px}
.mtnode{display:flex;align-items:center;gap:16px}.mtnode.alt{padding-left:min(18vw,90px)}
.mtbub{position:relative;width:96px;height:96px;flex:none;border-radius:50%;border:3px solid var(--line);background:var(--surface);display:grid;place-items:center;box-shadow:0 5px 0 var(--line);transition:transform .12s,box-shadow .12s;overflow:visible;padding:0}
.mtbub:hover{transform:translateY(-2px)}.mtbub:active{transform:translateY(4px);box-shadow:0 1px 0 var(--line)}
.mtbub.gold{border-color:var(--warn);box-shadow:0 5px 0 var(--warn)}
.mtbub .gfree{height:78px!important;pointer-events:none}
.mtring{position:absolute;inset:-8px;border-radius:50%;background:conic-gradient(var(--good) calc(var(--p)*1%),transparent 0);-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 5px),#000 calc(100% - 4px));mask:radial-gradient(farthest-side,transparent calc(100% - 5px),#000 calc(100% - 4px));pointer-events:none}
.mtinfo{display:flex;flex-direction:column;gap:4px;min-width:0}.mtinfo .muted{font-size:.8rem}
.mtcr{display:inline-flex;gap:3px}.mtcr i{width:14px;height:10px;background:var(--line);clip-path:polygon(0 100%,0 20%,25% 55%,50% 0,75% 55%,100% 20%,100% 100%)}.mtcr i.on{background:var(--warn)}
.mtl-wrap{max-width:760px;margin:0 auto}
.mthead{display:flex;align-items:center;gap:12px;margin-bottom:18px}
.mtq{font-size:1.1rem;padding:6px 10px}
.mtprog{flex:1;height:14px;border-radius:7px;background:var(--sunk);overflow:hidden}.mtprog i{display:block;height:100%;background:var(--good);border-radius:7px;transition:width .35s}
.mthearts{display:flex;gap:2px}.mth{fill:var(--sunk);stroke:var(--line)}.mth.on{fill:var(--bad);stroke:var(--bad)}.mth.lost{animation:mthl .5s}
@keyframes mthl{30%{transform:scale(1.4)}100%{transform:scale(1)}}
.mtkind{margin:0;color:var(--muted);font-size:.85rem}.mtprompt{margin:4px 0 16px;font-size:1.35rem}
.mtgrid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.mtcol{display:flex;flex-direction:column;gap:10px}
.mtt{position:relative;display:flex;align-items:center;gap:10px;min-height:58px;padding:10px 12px;border:2px solid var(--line);border-bottom-width:4px;border-radius:12px;background:var(--surface);color:var(--fg);font:inherit;font-size:.92rem;text-align:left;line-height:1.3;transition:background .15s,border-color .15s,opacity .3s,transform .1s}
.mtt:active{transform:translateY(2px)}
.mtk{flex:none;width:22px;height:22px;border-radius:6px;border:1px solid var(--line);display:grid;place-items:center;font-size:.72rem;color:var(--muted)}
.mtt.sel{border-color:var(--accent);background:color-mix(in srgb,var(--accent) 12%,var(--surface))}
.mtt.ok{border-color:var(--good);background:color-mix(in srgb,var(--good) 14%,var(--surface));opacity:.45}
.mtt.pop{animation:mtpop .35s}
.mtt.bad{border-color:var(--bad);background:color-mix(in srgb,var(--bad) 14%,var(--surface));animation:mtshake .45s}
@keyframes mtpop{40%{transform:scale(1.05)}}
@keyframes mtshake{20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}
.mtkeys{font-size:.75rem;margin-top:14px;text-align:center}
.mtfb{position:sticky;bottom:12px;margin:14px auto 0;max-width:520px;padding:12px 16px;border-radius:12px;font-weight:700;text-align:center;opacity:0;transform:translateY(8px);transition:opacity .2s,transform .2s;pointer-events:none}
.mtfb.show{opacity:1;transform:none}.mtfb.good{background:color-mix(in srgb,var(--good) 20%,var(--surface));color:var(--good)}.mtfb.bad{background:color-mix(in srgb,var(--bad) 16%,var(--surface));color:var(--bad)}
.mtend{display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center}
.mtend h2{margin:0}.mtperf{color:var(--good);font-weight:700;margin:0}
.mtstats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;width:100%;max-width:440px}
@media (max-width:600px){.mtt{font-size:.84rem;min-height:54px;padding:8px}.mtk{display:none}.mtkeys{display:none}.gsc{grid-template-columns:86px auto 1fr}.gbar i{width:16px}.mtnode.alt{padding-left:28px}.mtbub{width:80px;height:80px}.mtbub .gfree{height:64px!important}}
'''
    i = h.index('</style>', h.index('.tnav{display:grid'))
    h = h[:i] + CSS + h[i:]
    S = {
     'it': {"tr_grapes": "Schede vitigni", "trd_grapes": "Clima, aromi, stili e regioni di ogni uva", "tr_match": "Abbina!", "trd_match": "Gioco a coppie in stile Duolingo",
            "gvIntro": "Le uve chiave del manuale, ognuna con la sua scheda: struttura, clima, aromi, stili e regioni. Tocca una regione per vederla sulla mappa.",
            "gvAll": "Tutti", "gvW": "Bianchi", "gvB": "Neri", "gvSearch": "Cerca un vitigno o un sinonimo…", "gvWhite1": "Uva bianca", "gvBlack1": "Uva nera",
            "gvBud": "Germogliamento", "gvRip": "Maturazione", "gvE": "precoce", "gvM": "media", "gvL": "tardiva", "gvA": "Acidità", "gvT": "Tannino", "gvBo": "Corpo",
            "gvClim": "Vigneto e clima", "gvAr": "Aromi", "gvWm": "Stili e cantina", "gvTip": "Da ricordare:", "gvReg": "Regioni chiave", "gvSyn": "Sinonimi", "gvMap": "Vedi sulla mappa",
            "gvPlay": "Allenati su questa famiglia", "gvNone": "Nessun vitigno trovato.", "gvMast": "Padronanza nel gioco Abbina",
            "mtIntro": "Abbina ogni vitigno alla sua regione, ai suoi aromi, al suo tratto tipico o al suo sinonimo. Ogni lezione ha 4 round e 3 cuori: ogni errore ne costa uno.",
            "mtStreak": "giorni di fila", "mtMastered": "vitigni padroneggiati", "mtType": "Tipo di coppie", "mtMix": "Misto", "mtReg": "Vitigno ↔ Regione", "mtSig": "Vitigno ↔ Aromi", "mtTr": "Vitigno ↔ Tratto tipico", "mtSyn": "Vitigno ↔ Sinonimo",
            "mtAll": "Tutti i vitigni", "mtAllGo": "Lezione con tutti i vitigni", "mtReview": "Ripassa gli errori", "mtSound": "Suoni", "mtLevel": "Livello", "mtPrompt": "Tocca le coppie che vanno insieme",
            "mtKeys": "Tastiera: 1–5 colonna sinistra, 6–0 colonna destra, Esc per uscire", "mtQuit": "Esci dalla lezione", "mtOk1": "Ottimo!", "mtOk2": "Perfetto!", "mtOk3": "Bravissima!",
            "mtDone": "Lezione completata!", "mtFail": "Cuori finiti!", "mtFailD": "Nessun problema: riprova, le coppie cambiano ogni volta.", "mtPerfect": "Zero errori: +5 XP bonus", "mtGain": "XP guadagnati", "mtAcc": "Precisione", "mtTime": "Tempo",
            "mtMistakes": "Da ripassare (tocca per aprire la scheda)", "mtAgain": "Un'altra lezione", "mtRetry": "Riprova", "mtBack": "Torna al percorso"},
     'fr': {"tr_grapes": "Fiches cépages", "trd_grapes": "Climat, arômes, styles et régions de chaque cépage", "tr_match": "Associe !", "trd_match": "Jeu d'association façon Duolingo",
            "gvIntro": "Les cépages clés du manuel, chacun avec sa fiche : structure, climat, arômes, styles et régions. Touchez une région pour la voir sur la carte.",
            "gvAll": "Tous", "gvW": "Blancs", "gvB": "Noirs", "gvSearch": "Chercher un cépage ou un synonyme…", "gvWhite1": "Raisin blanc", "gvBlack1": "Raisin noir",
            "gvBud": "Débourrement", "gvRip": "Maturité", "gvE": "précoce", "gvM": "moyenne", "gvL": "tardive", "gvA": "Acidité", "gvT": "Tanin", "gvBo": "Corps",
            "gvClim": "Vigne et climat", "gvAr": "Arômes", "gvWm": "Styles et vinification", "gvTip": "À retenir :", "gvReg": "Régions clés", "gvSyn": "Synonymes", "gvMap": "Voir sur la carte",
            "gvPlay": "S'entraîner sur cette famille", "gvNone": "Aucun cépage trouvé.", "gvMast": "Maîtrise dans le jeu Associe",
            "mtIntro": "Associez chaque cépage à sa région, à ses arômes, à son trait typique ou à son synonyme. Chaque leçon a 4 manches et 3 cœurs : chaque erreur en coûte un.",
            "mtStreak": "jours d'affilée", "mtMastered": "cépages maîtrisés", "mtType": "Type de paires", "mtMix": "Mélange", "mtReg": "Cépage ↔ Région", "mtSig": "Cépage ↔ Arômes", "mtTr": "Cépage ↔ Trait typique", "mtSyn": "Cépage ↔ Synonyme",
            "mtAll": "Tous les cépages", "mtAllGo": "Leçon avec tous les cépages", "mtReview": "Réviser les erreurs", "mtSound": "Sons", "mtLevel": "Niveau", "mtPrompt": "Touchez les paires qui vont ensemble",
            "mtKeys": "Clavier : 1–5 colonne gauche, 6–0 colonne droite, Échap pour quitter", "mtQuit": "Quitter la leçon", "mtOk1": "Excellent !", "mtOk2": "Parfait !", "mtOk3": "Bravo !",
            "mtDone": "Leçon terminée !", "mtFail": "Plus de cœurs !", "mtFailD": "Pas de souci : réessayez, les paires changent à chaque fois.", "mtPerfect": "Zéro erreur : +5 XP bonus", "mtGain": "XP gagnés", "mtAcc": "Précision", "mtTime": "Temps",
            "mtMistakes": "À revoir (touchez pour ouvrir la fiche)", "mtAgain": "Une autre leçon", "mtRetry": "Réessayer", "mtBack": "Retour au parcours"},
     'en': {"tr_grapes": "Grape profiles", "trd_grapes": "Climate, aromas, styles and regions for each grape", "tr_match": "Match it!", "trd_match": "Duolingo-style pairing game",
            "gvIntro": "The key grapes from the textbook, each with its own profile: structure, climate, aromas, styles and regions. Tap a region to see it on the map.",
            "gvAll": "All", "gvW": "White", "gvB": "Black", "gvSearch": "Search a grape or synonym…", "gvWhite1": "White grape", "gvBlack1": "Black grape",
            "gvBud": "Budburst", "gvRip": "Ripening", "gvE": "early", "gvM": "mid", "gvL": "late", "gvA": "Acidity", "gvT": "Tannin", "gvBo": "Body",
            "gvClim": "Vineyard & climate", "gvAr": "Aromas", "gvWm": "Styles & winemaking", "gvTip": "Remember:", "gvReg": "Key regions", "gvSyn": "Synonyms", "gvMap": "See it on the map",
            "gvPlay": "Practise this family", "gvNone": "No grape found.", "gvMast": "Mastery in the Match game",
            "mtIntro": "Match each grape to its region, aromas, typical trait or synonym. Each lesson has 4 rounds and 3 hearts: every mistake costs one.",
            "mtStreak": "day streak", "mtMastered": "grapes mastered", "mtType": "Pair type", "mtMix": "Mixed", "mtReg": "Grape ↔ Region", "mtSig": "Grape ↔ Aromas", "mtTr": "Grape ↔ Typical trait", "mtSyn": "Grape ↔ Synonym",
            "mtAll": "All grapes", "mtAllGo": "Lesson with all grapes", "mtReview": "Review mistakes", "mtSound": "Sounds", "mtLevel": "Level", "mtPrompt": "Tap the pairs that go together",
            "mtKeys": "Keyboard: 1–5 left column, 6–0 right column, Esc to quit", "mtQuit": "Quit lesson", "mtOk1": "Great!", "mtOk2": "Perfect!", "mtOk3": "Well done!",
            "mtDone": "Lesson complete!", "mtFail": "Out of hearts!", "mtFailD": "No problem: try again, the pairs change every time.", "mtPerfect": "No mistakes: +5 bonus XP", "mtGain": "XP earned", "mtAcc": "Accuracy", "mtTime": "Time",
            "mtMistakes": "To review (tap to open the profile)", "mtAgain": "Another lesson", "mtRetry": "Try again", "mtBack": "Back to the path"},
    }
    i = h.index('Object.assign(T.en,{"train"'); j = h.index('\n', i) + 1
    h = h[:j] + ''.join('Object.assign(T.%s,%s);\n' % (k, json.dumps(v, ensure_ascii=False)) for k, v in S.items()) + h[j:]
open('live.html', 'w').write(h)
print('ok')
