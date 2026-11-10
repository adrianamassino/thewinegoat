import json, sys, os
D = os.path.dirname(os.path.abspath(__file__)) + '/'
MD = D + '../maps/'
sys.path.insert(0, MD)
from mapdata import MAPS as RAW
GEO = json.load(open(MD + 'geo_out.json'))
h = open(D + 'live.html').read()
assert 'const MAPS=' not in h, 'already patched'

def rep(old, new, count=1):
    global h
    assert h.count(old) == count, (old[:90], h.count(old))
    h = h.replace(old, new)

# ---------- data ----------
maps = []
for m in RAW:
    g = GEO[m['id']]
    W, N, k, s = g['W'], g['N'], g['k'], g['s']
    its = [[t, n, round((lon - W) * k * s, 1), round((N - lat) * s, 1)] for t, n, lon, lat in m['items']]
    maps.append(dict(id=m['id'], ch=m['ch'], sc=m['sc'], t=m['title'], p=m['page'], it=its))
geo = {k: {kk: v[kk] for kk in ('w', 'h', 'land', 'lake', 'riv', 'b0', 'b1', 'band', 'grat')} for k, v in GEO.items()}
mjs = json.dumps(maps, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
gjs = json.dumps(geo, separators=(',', ':'))

# ---------- CSS ----------
CSS = r"""
.tnav{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
.tnav button{display:flex;flex-direction:column;gap:2px;text-align:left;border:1px solid var(--line);background:var(--surface);border-radius:10px;padding:10px 12px;min-width:0}
.tnav button b{font-size:.92rem}.tnav button span{font-size:.75rem;color:var(--muted);line-height:1.3}
.tnav button:hover{border-color:var(--accent)}
.tnav button[aria-pressed="true"]{border-color:var(--accent);background:var(--accent-soft)}
@media (max-width:620px){.tnav{grid-template-columns:repeat(2,minmax(0,1fr))}.tnav button span{display:none}}
.mlist{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px}
.mcard{display:flex;flex-direction:column;gap:6px;text-align:left;border:1px solid var(--line);background:var(--surface);border-radius:10px;padding:12px 14px}
.mcard:hover{border-color:var(--accent)}.mcard b{font-size:.98rem}
.stars{font-size:.9rem;letter-spacing:2px;color:var(--warn)}.stars i{font-style:normal;color:var(--line)}
.mwrap{position:relative;overflow:auto;border:1px solid var(--line);border-radius:10px;background:var(--mwater);max-height:62vh;touch-action:pan-x pan-y}
.mp{display:block;width:100%;height:auto;user-select:none;-webkit-user-select:none}
.mp .land{fill:var(--mland);stroke:var(--mcoast);stroke-width:calc(var(--u,1)*.8px)}
.mp .lake{fill:var(--mwater);stroke:var(--mcoast);stroke-width:calc(var(--u,1)*.6px)}
.mp .riv{fill:none;stroke:var(--mriver);stroke-width:calc(var(--u,1)*1.4px);stroke-linejoin:round}
.mp .b0{fill:none;stroke:var(--mborder);stroke-width:calc(var(--u,1)*1.1px);stroke-dasharray:calc(var(--u,1)*6px) calc(var(--u,1)*3px)}
.mp .b1{fill:none;stroke:var(--mborder);stroke-opacity:.55;stroke-width:calc(var(--u,1)*.7px);stroke-dasharray:calc(var(--u,1)*2px) calc(var(--u,1)*3px)}
.mp .band{fill:none;stroke:var(--accent);stroke-opacity:.18;stroke-width:calc(var(--u,1)*16px);stroke-linecap:round;stroke-linejoin:round}
.mp .grat{fill:none;stroke:var(--mborder);stroke-opacity:.18;stroke-width:calc(var(--u,1)*.6px)}
.mp text{font-family:var(--f-body);font-size:calc(var(--u,1)*12.5px);paint-order:stroke;stroke:var(--mland);stroke-width:calc(var(--u,1)*3px);stroke-linejoin:round;pointer-events:none}
.mp .pin{cursor:pointer}
.mp .pin .hit{fill:transparent}
.mp .pin .dot{stroke:var(--surface);stroke-width:calc(var(--u,1)*1.6px)}
.mp .t-w .dot{fill:var(--accent)}.mp .t-c .dot{fill:var(--fg)}.mp .t-r .dot{fill:var(--mriverd)}.mp .t-g .dot{fill:var(--warn)}.mp .t-x .dot{fill:var(--muted)}
.mp .t-w text{fill:var(--accent);font-weight:700}.mp .t-c text{fill:var(--fg)}.mp .t-r text{fill:var(--mriverd);font-style:italic}.mp .t-g text{fill:var(--warn);font-style:italic;letter-spacing:.04em}.mp .t-x text{fill:var(--muted);text-transform:uppercase;letter-spacing:.06em}
.mp .pin.todo .dot{fill:var(--surface);stroke:var(--fg);stroke-width:calc(var(--u,1)*2px)}
.mp .pin.todo.t-w .dot{stroke:var(--accent)}.mp .pin.todo.t-r .dot{stroke:var(--mriverd)}.mp .pin.todo.t-g .dot{stroke:var(--warn)}.mp .pin.todo.t-x .dot{stroke:var(--muted)}
.mp .pin.todo text{display:none}
.mp .pin.ok .dot{fill:var(--good)}
.mp .pin.sel .dot{fill:var(--accent);stroke:var(--fg);stroke-width:calc(var(--u,1)*3px)}
.mp .pin.bad .dot{fill:var(--bad)}
.mp .pin.hl .dot{stroke:var(--fg);stroke-width:calc(var(--u,1)*3px)}
.mp .pin.reveal .dot{fill:var(--warn);animation:pulse 1s ease-in-out 2}
.mp .ctx{pointer-events:none;opacity:.55}.mp .ctx .dot{fill:var(--muted);stroke:none}.mp .ctx text{fill:var(--muted);font-weight:400;font-style:normal;text-transform:none;letter-spacing:0}
@keyframes pulse{50%{opacity:.25}}
.mtray{display:flex;flex-wrap:wrap;gap:6px;max-height:24vh;overflow:auto;padding:8px 2px 4px;position:sticky;bottom:0;background:var(--surface);border-top:1px solid var(--line);z-index:2}
.mtray:empty{display:none}
.mfil summary{cursor:pointer;font-size:.85rem;font-weight:600;color:var(--muted)}
.mtray .chip{font-size:.83rem}
.mtray .chip[aria-pressed="true"]{background:var(--fg);color:var(--bg);border-color:var(--fg)}
.chip.t-w{border-left:4px solid var(--accent)}.chip.t-c{border-left:4px solid var(--fg)}.chip.t-r{border-left:4px solid var(--mriverd)}.chip.t-g{border-left:4px solid var(--warn)}.chip.t-x{border-left:4px solid var(--muted)}
.chip.shake{animation:shake .35s}
@keyframes shake{25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
.mbar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:space-between}
.mzoom{display:flex;gap:4px}.mzoom button{width:36px;height:34px;border:1px solid var(--line);background:var(--surface);border-radius:8px;font-weight:700}
.mprompt{font-size:1.15rem;font-weight:600}
.mcats{display:flex;flex-wrap:wrap;gap:6px}
.mcats label{display:flex;gap:5px;align-items:center;font-size:.82rem;border:1px solid var(--line);border-radius:999px;padding:3px 10px;background:var(--surface)}
.mcats input{accent-color:var(--accent);margin:0}
.mkopt{display:flex;flex-direction:column;gap:10px}
.mkopt label{display:flex;gap:10px;align-items:flex-start;border:1px solid var(--line);border-radius:10px;padding:10px 12px;background:var(--surface)}
.mkopt input{accent-color:var(--accent);margin-top:4px}
.mkopt b{display:block}.mkopt small{color:var(--muted)}
.mksec{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:6px 14px;align-items:center;font-size:.92rem}
.mksec .num{font-family:var(--f-mono)}
"""
rep('@media (prefers-reduced-motion:reduce)', CSS.strip() + '\n@media (prefers-reduced-motion:reduce)')
# map colour tokens (light + dark)
rep('  --good:#2f6b3f; --good-soft:#e1efe3; --bad:#b0352b; --bad-soft:#f8e2df; --warn:#9a6a12;',
    '  --good:#2f6b3f; --good-soft:#e1efe3; --bad:#b0352b; --bad-soft:#f8e2df; --warn:#9a6a12;\n  --mwater:#d6e6f1; --mland:#f7f4ec; --mcoast:#9fb6c6; --mriver:#7fb0d8; --mriverd:#2d6fa6; --mborder:#7d7d7d;')
rep('  --good:#7fc28f; --good-soft:#1f3326; --bad:#f08b80; --bad-soft:#3b211e; --warn:#e2b55c;',
    '  --good:#7fc28f; --good-soft:#1f3326; --bad:#f08b80; --bad-soft:#3b211e; --warn:#e2b55c;\n  --mwater:#17262f; --mland:#232a27; --mcoast:#3d5563; --mriver:#3f6f94; --mriverd:#8cc0ea; --mborder:#8a948f;', 2)

# ---------- tabs ----------
rep('      <button role="tab" id="tab-practice" data-v="practice"></button>\n', '      <button role="tab" id="tab-train" data-v="train"></button>\n')
rep('      <button role="tab" id="tab-open" data-v="open"></button>\n      <button role="tab" id="tab-sat" data-v="sat"></button>\n', '')
rep('["home","practice","exam","open","sat","history"].forEach(v=>$("#tab-"+v).textContent=t(v));',
    '["home","train","exam","history"].forEach(v=>$("#tab-"+v).textContent=t(v));')
rep('document.querySelectorAll("nav.tabs button").forEach(b=>b.setAttribute("aria-selected",!quiz&&b.dataset.v===view));',
    'document.querySelectorAll("nav.tabs button").forEach(b=>b.setAttribute("aria-selected",!quiz&&(b.dataset.v===view||(b.dataset.v==="train"&&TRAIN.includes(view)))));')
rep('quiz=null; oq=null; satShow=null; satEdit=false; view=b.dataset.v; render(); });',
    'quiz=null; oq=null; satShow=null; satEdit=false; mg=null; view=b.dataset.v==="train"?trainV:b.dataset.v; render(); });')
rep('''  m.innerHTML={home:renderHome,practice:renderPractice,exam:renderExam,open:renderOpen,sat:renderSat,errors:renderErrors,history:renderHistory}[view]();''',
    '''  if(view==="maps"&&mg){ m.innerHTML=renderMapPlay(); bindMapPlay(); window.scrollTo(0,0); return }
  if(view==="exam"&&MK&&MK.go){ m.innerHTML=MK.fin?renderMockRes():renderMock(); if(MK.fin) window.scrollTo(0,0); else bindMock(); return }
  m.innerHTML=(TRAIN.includes(view)?trainNav():"")+{home:renderHome,practice:renderPractice,exam:renderExam,open:renderOpen,sat:renderSat,maps:renderMaps,errors:renderErrors,history:renderHistory}[view]();''')
rep('''view=m==="exam"?"exam":m==="errors"?"errors":"home";render()};''', '''view=m==="exam"?"exam":m==="errors"?"errors":"practice";render()};''')
rep('''s.m==="sat"?t("mSat"):t("mPractice")}''', '''s.m==="sat"?t("mSat"):s.m==="map"?t("mMap"):s.m==="mock"?t("mMock"):t("mPractice")}''')
rep('''function scopeName(s){if(s.m==="sat") return s.w||"–";''', '''function scopeName(s){if(s.m==="sat"||s.m==="map"||s.m==="mock") return s.w||"–";''')
rep('''if(d.id.startsWith("sat-")&&x&&x.ts&&!SJ[x.ts]) SJ[x.ts]=x;''', '''if(d.id.startsWith("sat-")&&x&&x.ts&&!SJ[x.ts]) SJ[x.ts]=x; if(d.id==="maps"&&x&&x.m) mergeMaps(x.m);''')
rep('''    afterOALoad(); afterSJLoad();\n''', '''    afterOALoad(); afterSJLoad(); afterMapsLoad();\n''')
rep('''  if(String(id).startsWith("s_")) return sctxPrompt(id.slice(2));''',
    '''  if(String(id).startsWith("s_")) return sctxPrompt(id.slice(2));\n  if(String(id).startsWith("k_")) return mkCtxPrompt(id.slice(2));''')
# SAT editor handlers: generic target (training note or mock-exam note)
rep('''document.getElementById("main").addEventListener("click",e=>{
  if(view!=="sat"||quiz) return;
  const x=e.target;''', '''document.getElementById("main").addEventListener("click",e=>{
  if((view!=="sat"&&view!=="exam")||quiz) return;
  const x=e.target;''')
rep('''  const sf=x.closest("[data-sf]"); if(sf&&satCur&&satEdit&&!satShow){ const k=sf.dataset.sf,i=+sf.dataset.si; satCur.f[k]=satCur.f[k]===i?undefined:i; if(satCur.f[k]===undefined) delete satCur.f[k]; satSaveDraft(); sf.parentElement.querySelectorAll("button").forEach(bb=>bb.setAttribute("aria-pressed",String(satCur.f[k]===+bb.dataset.si))); return; }''',
    '''  const sf=x.closest("[data-sf]"); const tg=sTarget(); if(sf&&tg){ const k=sf.dataset.sf,i=+sf.dataset.si; tg.f[k]=tg.f[k]===i?undefined:i; if(tg.f[k]===undefined) delete tg.f[k]; sTargetSave(); sf.parentElement.querySelectorAll("button").forEach(bb=>bb.setAttribute("aria-pressed",String(tg.f[k]===+bb.dataset.si))); return; }
  if(view!=="sat") return;''')
rep('''  if(view!=="sat"||!satCur||!satEdit||satShow) return;
  const x=e.target;
  if(x.dataset.st){ satCur.tx[x.dataset.st]=x.value; satSaveDraft(); }
  else if(x.dataset.sw){ satCur.wine[x.dataset.sw]=x.value; satSaveDraft(); }''', '''  const tg=sTarget(); if(!tg) return;
  const x=e.target;
  if(x.dataset.st){ tg.tx[x.dataset.st]=x.value; sTargetSave(); }
  else if(x.dataset.sw&&tg.wine){ tg.wine[x.dataset.sw]=x.value; sTargetSave(); }''')

rep('function renderExam(){', 'function renderExamOld(){')
rep('  if(view==="exam") $("#exam-start").onclick=pickExam;', '  if(view==="exam") bindExamSetup();')
rep('''if(m==="exam"){quiz=null;pickExam()}''', '''if(m==="exam"){quiz=null;view="exam";render()}''')
# ---------- strings ----------
S = {
 "it": {
  "train": "Allenamento", "exam": "Esame simulato", "mMap": "Mappe", "mMock": "Esame simulato",
  "tr_practice": "Quiz a crocette", "trd_practice": "Domande a scelta multipla per capitolo",
  "tr_open": "Domande aperte", "trd_open": "Risposte scritte corrette dall'IA",
  "tr_sat": "Degustazione SAT", "trd_sat": "Note di degustazione con la scheda SAT",
  "tr_maps": "Mappe", "trd_maps": "Completa le mappe del manuale",
  "mIntro": "Tutte le mappe del manuale, dai paesi alle singole zone, ridisegnate su dati geografici reali. Per ogni mappa puoi esplorare, completare il puzzle mettendo ogni nome al suo posto, oppure trovare i luoghi uno alla volta. Il miglior punteggio resta salvato.",
  "mAll": "Tutte", "mMacro": "Paesi e grandi regioni", "mMicro": "Zone e denominazioni", "mItems": "luoghi", "mFilters": "Filtri e categorie", "mBest": "Record",
  "mExplore": "Esplora", "mPuzzle": "Puzzle", "mFind": "Trova",
  "mExploreH": "Tutti i nomi sono visibili: studia la mappa, poi passa al puzzle.",
  "mPuzzleH": "Tocca un nome qui sotto e poi il punto giusto sulla mappa (o prima il punto, poi il nome).",
  "mFindH": "Tocca sulla mappa il punto indicato. Dopo 3 errori il punto viene mostrato.",
  "mFindQ": "Dov'è", "mPickFirst": "Scegli prima un nome (o tocca di nuovo il punto)", "mWrong": "No, riprova",
  "mRight": "Giusto!", "mDone": "Mappa completata", "mScoreTxt": "{C} su {N} al primo colpo · {E} errori",
  "mAgain": "Rigioca", "mOther": "Cambia modalità", "mBack": "← Mappe", "mZoomIn": "Ingrandisci", "mZoomOut": "Riduci",
  "mc_w": "Vini e denominazioni", "mc_c": "Città e paesi", "mc_r": "Fiumi e laghi", "mc_g": "Monti e mari", "mc_x": "Stati e regioni",
  "mPage": "Mappa del manuale, pag.", "mNoCat": "Seleziona almeno una categoria.", "mDrawn": "Mappe ridisegnate da dati geografici aperti (Natural Earth): i punti indicano la posizione approssimativa delle zone, i nomi sono quelli delle mappe del libro.",
  "mkIntro": "Una prova completa che mescola tutto, come l'esame vero: domande a crocette senza correzione immediata, domande aperte, una nota di degustazione teorica e una prova di geografia. Scegli le parti, rispondi a tutto e alla fine ricevi il punteggio di ogni sezione (soglia 55%).",
  "mkS_mcq": "Domande a crocette", "mkS_mcqD": "Distribuite come all'esame (fattori di produzione, vini fermi, spumanti, fortificati, degustazione e servizio). La correzione arriva alla fine.",
  "mkS_open": "Domande aperte", "mkS_openD": "4 domande da capitoli diversi, corrette dall'IA alla fine.",
  "mkS_sat": "Degustazione teorica", "mkS_satD": "Nota SAT tipica di un vino classico del manuale.",
  "mkS_map": "Geografia", "mkS_mapD": "Trova 10 denominazioni su una mappa del manuale.",
  "mkStart": "Inizia l'esame", "mkResume": "Riprendi l'esame in corso", "mkAbandon": "Abbandona", "mkSection": "Sezione",
  "mkPrev": "← Precedente", "mkNext": "Avanti →", "mkEndSec": "Concludi la sezione", "mkEndAll": "Consegna e correggi",
  "mkGrading": "Correzione in corso…", "mkResult": "Risultato dell'esame simulato", "mkOverall": "Punteggio complessivo",
  "mkPassAll": "Superato: tutte le sezioni sopra il 55%", "mkFailSome": "Non superato: almeno una sezione sotto il 55%",
  "mkNoAI": "non corretta (IA non disponibile)", "mkNew": "Nuovo esame", "mkReview": "Rivedi le risposte", "mkPick": "Scegli una risposta",
  "mkUnanswered": "Domande senza risposta: {N}. Vuoi consegnare comunque? Premi di nuovo.", "mkOpenAns": "La tua risposta", "mkNone": "Seleziona almeno una sezione.",
  "mkExit": "Esci (salva)", "mkWine": "Vino da descrivere", "mkMapT": "Mappa",
  "ksug1": "Spiegami gli errori principali di questo esame", "ksug2": "Su quali capitoli devo ripassare?", "ksug3": "Come miglioro le risposte scritte?",
 },
 "fr": {
  "train": "Entraînement", "exam": "Examen blanc", "mMap": "Cartes", "mMock": "Examen blanc",
  "tr_practice": "Quiz QCM", "trd_practice": "Questions à choix multiple par chapitre",
  "tr_open": "Questions ouvertes", "trd_open": "Réponses rédigées corrigées par l'IA",
  "tr_sat": "Dégustation SAT", "trd_sat": "Notes de dégustation avec la grille SAT",
  "tr_maps": "Cartes", "trd_maps": "Complétez les cartes du manuel",
  "mIntro": "Toutes les cartes du manuel, des pays aux zones, redessinées à partir de données géographiques réelles. Pour chaque carte : explorez, faites le puzzle en plaçant chaque nom, ou trouvez les lieux un par un. Le meilleur score est enregistré.",
  "mAll": "Toutes", "mMacro": "Pays et grandes régions", "mMicro": "Zones et appellations", "mItems": "lieux", "mFilters": "Filtres et catégories", "mBest": "Record",
  "mExplore": "Explorer", "mPuzzle": "Puzzle", "mFind": "Trouver",
  "mExploreH": "Tous les noms sont visibles : étudiez la carte, puis passez au puzzle.",
  "mPuzzleH": "Touchez un nom ci-dessous puis le bon point sur la carte (ou d'abord le point, puis le nom).",
  "mFindH": "Touchez sur la carte le point demandé. Après 3 erreurs, le point est montré.",
  "mFindQ": "Où est", "mPickFirst": "Choisissez d'abord un nom (ou touchez à nouveau le point)", "mWrong": "Non, réessayez",
  "mRight": "Exact !", "mDone": "Carte terminée", "mScoreTxt": "{C} sur {N} du premier coup · {E} erreurs",
  "mAgain": "Rejouer", "mOther": "Changer de mode", "mBack": "← Cartes", "mZoomIn": "Agrandir", "mZoomOut": "Réduire",
  "mc_w": "Vins et appellations", "mc_c": "Villes et villages", "mc_r": "Fleuves et lacs", "mc_g": "Montagnes et mers", "mc_x": "États et régions",
  "mPage": "Carte du manuel, p.", "mNoCat": "Sélectionnez au moins une catégorie.", "mDrawn": "Cartes redessinées à partir de données géographiques ouvertes (Natural Earth) : les points indiquent la position approximative des zones, les noms sont ceux des cartes du livre.",
  "mkIntro": "Une épreuve complète qui mélange tout, comme le vrai examen : QCM sans correction immédiate, questions ouvertes, une note de dégustation théorique et une épreuve de géographie. Choisissez les parties, répondez à tout et recevez à la fin le score de chaque section (seuil 55 %).",
  "mkS_mcq": "QCM", "mkS_mcqD": "Répartis comme à l'examen (facteurs de production, vins tranquilles, effervescents, mutés, dégustation et service). Correction à la fin.",
  "mkS_open": "Questions ouvertes", "mkS_openD": "4 questions de chapitres différents, corrigées par l'IA à la fin.",
  "mkS_sat": "Dégustation théorique", "mkS_satD": "Note SAT typique d'un vin classique du manuel.",
  "mkS_map": "Géographie", "mkS_mapD": "Trouvez 10 appellations sur une carte du manuel.",
  "mkStart": "Commencer l'examen", "mkResume": "Reprendre l'examen en cours", "mkAbandon": "Abandonner", "mkSection": "Section",
  "mkPrev": "← Précédente", "mkNext": "Suivante →", "mkEndSec": "Terminer la section", "mkEndAll": "Rendre et corriger",
  "mkGrading": "Correction en cours…", "mkResult": "Résultat de l'examen blanc", "mkOverall": "Score global",
  "mkPassAll": "Réussi : toutes les sections au-dessus de 55 %", "mkFailSome": "Non réussi : au moins une section sous 55 %",
  "mkNoAI": "non corrigée (IA indisponible)", "mkNew": "Nouvel examen", "mkReview": "Revoir les réponses", "mkPick": "Choisissez une réponse",
  "mkUnanswered": "Questions sans réponse : {N}. Rendre quand même ? Appuyez à nouveau.", "mkOpenAns": "Votre réponse", "mkNone": "Sélectionnez au moins une section.",
  "mkExit": "Quitter (enregistrer)", "mkWine": "Vin à décrire", "mkMapT": "Carte",
  "ksug1": "Explique-moi les principales erreurs de cet examen", "ksug2": "Quels chapitres dois-je réviser ?", "ksug3": "Comment améliorer mes réponses rédigées ?",
 },
 "en": {
  "train": "Training", "exam": "Mock exam", "mMap": "Maps", "mMock": "Mock exam",
  "tr_practice": "Multiple-choice quiz", "trd_practice": "Multiple-choice questions by chapter",
  "tr_open": "Open questions", "trd_open": "Written answers marked by AI",
  "tr_sat": "SAT tasting", "trd_sat": "Tasting notes with the SAT grid",
  "tr_maps": "Maps", "trd_maps": "Complete the textbook maps",
  "mIntro": "Every map in the textbook, from countries down to single districts, redrawn on real geographic data. For each map you can explore, complete the puzzle by putting every name in place, or find places one at a time. Your best score is saved.",
  "mAll": "All", "mMacro": "Countries and large regions", "mMicro": "Districts and appellations", "mItems": "places", "mFilters": "Filters and categories", "mBest": "Best",
  "mExplore": "Explore", "mPuzzle": "Puzzle", "mFind": "Find",
  "mExploreH": "All names are shown: study the map, then try the puzzle.",
  "mPuzzleH": "Tap a name below, then the right point on the map (or the point first, then the name).",
  "mFindH": "Tap the requested point on the map. After 3 misses the point is shown.",
  "mFindQ": "Where is", "mPickFirst": "Pick a name first (or tap the point again)", "mWrong": "No, try again",
  "mRight": "Correct!", "mDone": "Map complete", "mScoreTxt": "{C} of {N} first time · {E} mistakes",
  "mAgain": "Play again", "mOther": "Change mode", "mBack": "← Maps", "mZoomIn": "Zoom in", "mZoomOut": "Zoom out",
  "mc_w": "Wines and appellations", "mc_c": "Cities and towns", "mc_r": "Rivers and lakes", "mc_g": "Mountains and seas", "mc_x": "States and regions",
  "mPage": "Textbook map, p.", "mNoCat": "Select at least one category.", "mDrawn": "Maps redrawn from open geographic data (Natural Earth): points show the approximate position of each area; names are those on the textbook maps.",
  "mkIntro": "A full paper that mixes everything, like the real exam: multiple-choice questions without instant feedback, open questions, a theory tasting note and a geography test. Choose the parts, answer everything, and get each section's score at the end (pass mark 55%).",
  "mkS_mcq": "Multiple choice", "mkS_mcqD": "Split like the exam (production factors, still wines, sparkling, fortified, tasting and service). Marked at the end.",
  "mkS_open": "Open questions", "mkS_openD": "4 questions from different chapters, marked by AI at the end.",
  "mkS_sat": "Theory tasting", "mkS_satD": "Typical SAT note for a classic wine from the textbook.",
  "mkS_map": "Geography", "mkS_mapD": "Find 10 appellations on a textbook map.",
  "mkStart": "Start the exam", "mkResume": "Resume the exam in progress", "mkAbandon": "Abandon", "mkSection": "Section",
  "mkPrev": "← Previous", "mkNext": "Next →", "mkEndSec": "Finish section", "mkEndAll": "Submit and mark",
  "mkGrading": "Marking…", "mkResult": "Mock exam result", "mkOverall": "Overall score",
  "mkPassAll": "Passed: every section at 55% or more", "mkFailSome": "Not passed: at least one section below 55%",
  "mkNoAI": "not marked (AI unavailable)", "mkNew": "New exam", "mkReview": "Review answers", "mkPick": "Pick an answer",
  "mkUnanswered": "Unanswered questions: {N}. Submit anyway? Press again.", "mkOpenAns": "Your answer", "mkNone": "Select at least one section.",
  "mkExit": "Exit (saved)", "mkWine": "Wine to describe", "mkMapT": "Map",
  "ksug1": "Explain the main mistakes in this exam", "ksug2": "Which chapters should I revise?", "ksug3": "How can I improve my written answers?",
 },
}
srows = '\n'.join('Object.assign(T.%s,%s);' % (l, json.dumps(S[l], ensure_ascii=False)) for l in ('it', 'fr', 'en'))
rep('/* ---------- state ---------- */', srows + '\n/* ---------- state ---------- */')
rep('''(String(id).startsWith("o_")?["osug1","osug2","osug3"]:String(id).startsWith("s_")?["ssug1","ssug2","ssug3"]:["sug1","sug2","sug3"])''',
    '''(String(id).startsWith("o_")?["osug1","osug2","osug3"]:String(id).startsWith("s_")?["ssug1","ssug2","ssug3"]:String(id).startsWith("k_")?["ksug1","ksug2","ksug3"]:["sug1","sug2","sug3"])''')

JS = open(D + 'v13.js').read().replace('__MAPS__', mjs).replace('__MGEO__', gjs)
rep('/* ---------- quiz ---------- */', JS + '\n/* ---------- quiz ---------- */')
open(D + 'live.html', 'w').write(h)
print('ok', len(h))
