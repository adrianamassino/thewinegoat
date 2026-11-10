import json, sys, os
D = os.path.dirname(os.path.abspath(__file__)) + '/'
sys.path.insert(0, D)
from sat_profiles import P as PROFILES
h = open(D + 'live.html').read()
assert 'const SATP' not in h, 'already patched'

def rep(old, new, count=1):
    global h
    assert h.count(old) == count, (old[:80], h.count(old))
    h = h.replace(old, new)

SCL = {
 "clar": ["clear", "hazy"], "aint": ["pale", "medium", "deep"],
 "colw": ["lemon-green", "lemon", "gold", "amber", "brown"], "colp": ["pink", "salmon", "orange"],
 "colr": ["purple", "ruby", "garnet", "tawny", "brown"], "cond": ["clean", "unclean"],
 "nint": ["light", "medium(-)", "medium", "medium(+)", "pronounced"],
 "dev": ["youthful", "developing", "fully developed", "tired/past its best"],
 "sw": ["dry", "off-dry", "medium-dry", "medium-sweet", "sweet", "luscious"],
 "ac": ["low", "medium(-)", "medium", "medium(+)", "high"], "tan": ["low", "medium(-)", "medium", "medium(+)", "high"],
 "alc": ["low", "medium", "high"], "body": ["light", "medium(-)", "medium", "medium(+)", "full"],
 "mou": ["delicate", "creamy", "aggressive"], "fint": ["light", "medium(-)", "medium", "medium(+)", "pronounced"],
 "fin": ["short", "medium(-)", "medium", "medium(+)", "long"],
 "q": ["faulty", "poor", "acceptable", "good", "very good", "outstanding"],
 "rd": ["too young", "can drink now, but has potential for ageing", "drink now: not suitable for ageing or further ageing", "too old"],
}
FIELDS = ["aint", "col", "nint", "dev", "sw", "ac", "tan", "alc", "body", "mou", "fint", "fin", "q", "rd"]
out = []
for p in PROFILES:
    o = {"id": p["id"], "n": p["n"], "t": p["t"], "why": p["why"], "ar": p["ar"]}
    if p.get("sp"): o["sp"] = 1
    if p.get("fo"): o["fo"] = 1
    for k in FIELDS:
        if k in p:
            sc = SCL["col" + p["t"]] if k == "col" else SCL[k]
            for v in p[k]:
                assert v in sc, (p["id"], k, v)
            o[k] = sorted(sc.index(v) for v in p[k])
    assert ("tan" in o) == (p["t"] == "r"), p["id"]
    assert ("mou" in o) == bool(p.get("sp")), p["id"]
    out.append(o)
print('profiles', len(out))
satp = json.dumps(out, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
scl = json.dumps(SCL, ensure_ascii=False, separators=(',', ':'))

# ---- CSS ----
CSS = r"""
.sat-sec{display:flex;flex-direction:column;gap:12px}
.sat-sec>h3{margin:0;font-size:.8rem;letter-spacing:.08em;text-transform:uppercase;color:var(--accent)}
.sfield{display:grid;grid-template-columns:150px minmax(0,1fr);gap:6px 14px;align-items:start}
.sfield>.sl{font-weight:600;font-size:.88rem;padding-top:5px}
@media (max-width:620px){.sfield{grid-template-columns:minmax(0,1fr)}.sfield>.sl{padding-top:0}}
.sseg{display:flex;flex-wrap:wrap;gap:6px}
.sseg button{border:1px solid var(--line);background:var(--surface);border-radius:999px;padding:5px 11px;font-size:.82rem;font-family:var(--f-mono)}
.sseg button:hover{border-color:var(--accent)}
.sseg button[aria-pressed="true"]{background:var(--fg);color:var(--bg);border-color:var(--fg)}
.sat-ta{width:100%;min-height:74px;resize:vertical;font:inherit;font-size:.93rem;line-height:1.5;border:1px solid var(--line);border-radius:8px;padding:9px 11px;background:var(--surface);color:var(--fg)}
.sat-ta:focus,.sat-in:focus{outline:2px solid var(--accent);outline-offset:0;border-color:var(--accent)}
.sat-in{font:inherit;font-size:.93rem;border:1px solid var(--line);border-radius:8px;padding:8px 10px;background:var(--surface);color:var(--fg);min-width:0}
.sat-wine{font-family:var(--f-display);font-size:1.5rem;font-weight:600;line-height:1.2;margin:0}
.sat-chk{display:flex;gap:6px;align-items:center;font-size:.88rem}
.sat-chk input{accent-color:var(--accent);margin:0}
.srow td{white-space:normal;vertical-align:top}
.srow .mk{font-family:var(--f-mono);font-weight:700;text-align:center;width:2.5em}
.mk.ok{color:var(--good)} .mk.half{color:var(--warn)} .mk.no{color:var(--bad)}
.sref{display:grid;grid-template-columns:auto minmax(0,1fr);gap:6px 14px;font-size:.88rem;margin:0}
.sref dt{font-weight:600} .sref dd{margin:0;font-family:var(--f-mono);font-size:.8rem;color:var(--muted)}
.sref h4{grid-column:1/-1;margin:10px 0 0;font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;color:var(--accent)}
.sjl{display:flex;flex-direction:column;gap:8px}
"""
rep('@media (prefers-reduced-motion:reduce)', CSS.strip() + '\n@media (prefers-reduced-motion:reduce)')

# ---- tab ----
rep('<button role="tab" id="tab-open" data-v="open"></button>',
    '<button role="tab" id="tab-open" data-v="open"></button>\n      <button role="tab" id="tab-sat" data-v="sat"></button>')
rep('["home","practice","exam","open","history"].forEach(v=>$("#tab-"+v).textContent=t(v));',
    '["home","practice","exam","open","sat","history"].forEach(v=>$("#tab-"+v).textContent=t(v));')
rep('  if(oq&&view==="open"){ m.innerHTML=renderOQ(); bindOQ(); return }\n',
    '  if(oq&&view==="open"){ m.innerHTML=renderOQ(); bindOQ(); return }\n  if(view==="sat"&&(satShow||(satEdit&&satCur))){ m.innerHTML=satShow?renderSatRes():renderSatEd(); bindSat(); return }\n')
rep('open:renderOpen,errors:renderErrors', 'open:renderOpen,sat:renderSat,errors:renderErrors')
rep('quiz=null; oq=null; view=b.dataset.v; render(); });', 'quiz=null; oq=null; satShow=null; satEdit=false; view=b.dataset.v; render(); });')
rep('s.m==="open"?t("mOpen"):t("mPractice")}', 's.m==="open"?t("mOpen"):s.m==="sat"?t("mSat"):t("mPractice")}')
rep('function scopeName(s){if(!s.ch', 'function scopeName(s){if(s.m==="sat") return s.w||"–"; if(!s.ch')
rep('if(d.id.startsWith("open-")&&x&&Array.isArray(x.a)) mergeOA(d.id.slice(5),x.a);',
    'if(d.id.startsWith("open-")&&x&&Array.isArray(x.a)) mergeOA(d.id.slice(5),x.a); if(d.id.startsWith("sat-")&&x&&x.ts&&!SJ[x.ts]) SJ[x.ts]=x;')
rep('    afterOALoad();\n', '    afterOALoad(); afterSJLoad();\n')
rep('  if(String(id).startsWith("o_")) return octxPrompt(id.slice(2));',
    '  if(String(id).startsWith("o_")) return octxPrompt(id.slice(2));\n  if(String(id).startsWith("s_")) return sctxPrompt(id.slice(2));')
rep('(String(id).startsWith("o_")?["osug1","osug2","osug3"]:["sug1","sug2","sug3"])',
    '(String(id).startsWith("o_")?["osug1","osug2","osug3"]:String(id).startsWith("s_")?["ssug1","ssug2","ssug3"]:["sug1","sug2","sug3"])')

# ---- strings ----
S = {
 "it": {
  "sat": "Degustazione SAT", "mSat": "Degustazione SAT",
  "sIntro": "Allena l'approccio sistematico alla degustazione (SAT) del WSET Livello 3 con i termini ufficiali del manuale. Due modi: scrivi la nota tipica di un vino classico descritto nel libro (l'app corregge struttura e conclusioni, l'IA valuta aromi e motivazioni), oppure registra la nota di un vino che stai assaggiando e ricevi un commento dall'IA. Le note restano salvate nel tuo diario.",
  "sModeA": "Esercizio: vino classico del manuale", "sModeAd": "Scrivi la nota SAT tipica dello stile indicato e confrontala con il profilo atteso.",
  "sModeB": "Nota di un vino che sto degustando", "sModeBd": "Compila la SAT mentre assaggi; l'IA controlla termini, coerenza e plausibilità.",
  "sRandom": "Vino a caso", "sStart": "Inizia", "sResume": "Riprendi la nota in corso", "sDiscard": "Scarta la bozza",
  "sJournal": "Diario di degustazione", "sNoJournal": "Nessuna nota salvata per ora.", "sRefT": "Scheda SAT (WSET Livello 3)",
  "sTermsNote": "I termini sono quelli ufficiali in inglese della scheda SAT, come nel manuale.",
  "sBack": "← Degustazione", "sTaskA": "Scrivi la nota di degustazione tipica di un buon esempio di questo vino.",
  "sTaskB": "Descrivi il vino che hai nel bicchiere. Il nome è facoltativo: puoi aggiungerlo dopo per una degustazione alla cieca.",
  "sWineName": "Vino (produttore, denominazione)", "sVintage": "Annata", "sWineNotes": "Note (prezzo, occasione…)",
  "sType": "Tipo", "tw": "Bianco", "tp": "Rosato", "tr": "Rosso", "sSpark": "Spumante", "sFort": "Fortificato",
  "sApp": "Aspetto", "sNose": "Naso", "sPal": "Palato", "sCon": "Conclusioni",
  "f_clar": "Limpidezza", "f_aint": "Intensità", "f_col": "Colore", "f_oth": "Altre osservazioni", "f_cond": "Condizione",
  "f_nint": "Intensità", "f_nar": "Caratteristiche aromatiche", "f_dev": "Sviluppo", "f_sw": "Dolcezza", "f_ac": "Acidità",
  "f_tan": "Tannino", "f_alc": "Alcol", "f_body": "Corpo", "f_mou": "Mousse", "f_fint": "Intensità del sapore",
  "f_par": "Caratteristiche del sapore", "f_fin": "Finale", "f_q": "Livello di qualità", "f_rd": "Prontezza / potenziale d'invecchiamento",
  "f_qj": "Motivazione (BLIC: equilibrio, lunghezza, intensità, complessità)",
  "ph_oth": "es. lacrime, deposito, bollicine", "ph_nar": "es. primari: limone, mela verde, fiori bianchi; secondari: vaniglia, burro; terziari: miele, noce",
  "ph_par": "es. come al naso, più…", "ph_qj": "es. Molto buono: equilibrato (frutto e acidità), finale lungo, intenso, ma poco complesso. Può bere ora, ma ha potenziale perché…",
  "sCheck": "Correggi", "sAnalyse": "Analizza con l'IA", "sSaveOnly": "Salva senza analisi", "sWorking": "Valutazione in corso…",
  "sMissing": "Mancano {N} voci: verranno contate come errori.", "sEmptyB": "Compila almeno qualche voce prima di salvare.",
  "sScore": "Punteggio", "sStruct": "Struttura e conclusioni", "sYour": "La tua scelta", "sExp": "Atteso", "sAI": "Aromi, sapori e motivazione (IA)",
  "sAIoff": "Correzione IA non disponibile: confronta da solo i tuoi aromi con il profilo atteso qui sotto.",
  "sProfile": "Profilo atteso e perché", "sPrim": "Primari", "sSec": "Secondari", "sTer": "Terziari",
  "sFound": "Aromi corretti", "sMissed": "Mancanti", "sWrong": "Fuori stile", "sConclAI": "Conclusioni",
  "sFeedback": "Commento", "sIssues": "Da correggere", "sTips": "Consigli", "sIdentity": "Stile e identità",
  "sNew": "Nuova nota", "sDelete": "Elimina", "sDelConf": "Eliminare questa nota?", "sNoteSaved": "Nota salvata nel diario.",
  "sNoAIb": "Nota salvata senza commento dell'IA.", "ssug1": "Quali errori di struttura devo correggere?", "ssug2": "Come scrivo una motivazione BLIC da esame per questo vino?", "ssug3": "Quali descrittori aromatici avrei potuto usare?",
  "sAlcNote": "Alcol: vini fermi low < 11%, medium 11–13,9%, high ≥ 14%; fortificati low 15–16,4%, medium 16,5–18,4%, high ≥ 18,5%.",
  "sQNote": "Qualità: positivo su tutti e 4 i criteri BLIC = outstanding, 3 = very good, 2 = good, 1 = acceptable.",
  "sEg": "es. primari, secondari, terziari (testo libero)",
 },
 "fr": {
  "sat": "Dégustation SAT", "mSat": "Dégustation SAT",
  "sIntro": "Entraînez-vous à l'approche systématique de la dégustation (SAT) du WSET niveau 3 avec les termes officiels du manuel. Deux modes : rédigez la note typique d'un vin classique décrit dans le livre (l'appli corrige la structure et les conclusions, l'IA évalue arômes et justifications), ou enregistrez la note d'un vin que vous goûtez et recevez un commentaire de l'IA. Les notes restent dans votre carnet.",
  "sModeA": "Exercice : vin classique du manuel", "sModeAd": "Rédigez la note SAT typique du style indiqué et comparez-la au profil attendu.",
  "sModeB": "Note d'un vin que je déguste", "sModeBd": "Remplissez la SAT en goûtant ; l'IA vérifie termes, cohérence et plausibilité.",
  "sRandom": "Vin au hasard", "sStart": "Commencer", "sResume": "Reprendre la note en cours", "sDiscard": "Supprimer le brouillon",
  "sJournal": "Carnet de dégustation", "sNoJournal": "Aucune note enregistrée pour l'instant.", "sRefT": "Grille SAT (WSET niveau 3)",
  "sTermsNote": "Les termes sont ceux, en anglais, de la grille SAT officielle, comme dans le manuel.",
  "sBack": "← Dégustation", "sTaskA": "Rédigez la note de dégustation typique d'un bon exemple de ce vin.",
  "sTaskB": "Décrivez le vin dans votre verre. Le nom est facultatif : vous pouvez l'ajouter après pour une dégustation à l'aveugle.",
  "sWineName": "Vin (producteur, appellation)", "sVintage": "Millésime", "sWineNotes": "Notes (prix, occasion…)",
  "sType": "Type", "tw": "Blanc", "tp": "Rosé", "tr": "Rouge", "sSpark": "Effervescent", "sFort": "Muté",
  "sApp": "Aspect", "sNose": "Nez", "sPal": "Bouche", "sCon": "Conclusions",
  "f_clar": "Limpidité", "f_aint": "Intensité", "f_col": "Couleur", "f_oth": "Autres observations", "f_cond": "État",
  "f_nint": "Intensité", "f_nar": "Caractéristiques aromatiques", "f_dev": "Évolution", "f_sw": "Sucre", "f_ac": "Acidité",
  "f_tan": "Tanin", "f_alc": "Alcool", "f_body": "Corps", "f_mou": "Mousse", "f_fint": "Intensité des saveurs",
  "f_par": "Caractéristiques des saveurs", "f_fin": "Finale", "f_q": "Niveau de qualité", "f_rd": "Aptitude à boire / potentiel de garde",
  "f_qj": "Justification (BLIC : équilibre, longueur, intensité, complexité)",
  "ph_oth": "ex. larmes, dépôt, bulles", "ph_nar": "ex. primaires : citron, pomme verte, fleurs blanches ; secondaires : vanille, beurre ; tertiaires : miel, noix",
  "ph_par": "ex. comme au nez, plus…", "ph_qj": "ex. Très bon : équilibré (fruit et acidité), finale longue, intense, mais peu complexe. Peut se boire maintenant mais a du potentiel car…",
  "sCheck": "Corriger", "sAnalyse": "Analyser avec l'IA", "sSaveOnly": "Enregistrer sans analyse", "sWorking": "Évaluation en cours…",
  "sMissing": "{N} rubriques manquent : elles compteront comme des erreurs.", "sEmptyB": "Remplissez au moins quelques rubriques avant d'enregistrer.",
  "sScore": "Score", "sStruct": "Structure et conclusions", "sYour": "Votre choix", "sExp": "Attendu", "sAI": "Arômes, saveurs et justification (IA)",
  "sAIoff": "Correction par l'IA indisponible : comparez vous-même vos arômes au profil attendu ci-dessous.",
  "sProfile": "Profil attendu et pourquoi", "sPrim": "Primaires", "sSec": "Secondaires", "sTer": "Tertiaires",
  "sFound": "Arômes corrects", "sMissed": "Manquants", "sWrong": "Hors style", "sConclAI": "Conclusions",
  "sFeedback": "Commentaire", "sIssues": "À corriger", "sTips": "Conseils", "sIdentity": "Style et identité",
  "sNew": "Nouvelle note", "sDelete": "Supprimer", "sDelConf": "Supprimer cette note ?", "sNoteSaved": "Note enregistrée dans le carnet.",
  "sNoAIb": "Note enregistrée sans commentaire de l'IA.", "ssug1": "Quelles erreurs de structure dois-je corriger ?", "ssug2": "Comment rédiger une justification BLIC d'examen pour ce vin ?", "ssug3": "Quels descripteurs aromatiques aurais-je pu utiliser ?",
  "sAlcNote": "Alcool : vins tranquilles low < 11 %, medium 11–13,9 %, high ≥ 14 % ; mutés low 15–16,4 %, medium 16,5–18,4 %, high ≥ 18,5 %.",
  "sQNote": "Qualité : positif sur les 4 critères BLIC = outstanding, 3 = very good, 2 = good, 1 = acceptable.",
  "sEg": "ex. primaires, secondaires, tertiaires (texte libre)",
 },
 "en": {
  "sat": "SAT tasting", "mSat": "SAT tasting",
  "sIntro": "Practise the WSET Level 3 Systematic Approach to Tasting (SAT) with the textbook's official terms. Two modes: write the typical note for a classic wine described in the book (the app marks structure and conclusions, the AI assesses aromas and reasoning), or record a note for a wine you are tasting and get AI feedback. Notes stay saved in your journal.",
  "sModeA": "Exercise: classic wine from the textbook", "sModeAd": "Write the typical SAT note for the style shown and compare it with the expected profile.",
  "sModeB": "Note for a wine I'm tasting", "sModeBd": "Fill in the SAT as you taste; the AI checks terms, consistency and plausibility.",
  "sRandom": "Random wine", "sStart": "Start", "sResume": "Resume the note in progress", "sDiscard": "Discard draft",
  "sJournal": "Tasting journal", "sNoJournal": "No notes saved yet.", "sRefT": "SAT grid (WSET Level 3)",
  "sTermsNote": "Terms are the official English SAT terms, as in the textbook.",
  "sBack": "← Tasting", "sTaskA": "Write the typical tasting note for a good example of this wine.",
  "sTaskB": "Describe the wine in your glass. The name is optional: you can add it afterwards for a blind tasting.",
  "sWineName": "Wine (producer, appellation)", "sVintage": "Vintage", "sWineNotes": "Notes (price, occasion…)",
  "sType": "Type", "tw": "White", "tp": "Rosé", "tr": "Red", "sSpark": "Sparkling", "sFort": "Fortified",
  "sApp": "Appearance", "sNose": "Nose", "sPal": "Palate", "sCon": "Conclusions",
  "f_clar": "Clarity", "f_aint": "Intensity", "f_col": "Colour", "f_oth": "Other observations", "f_cond": "Condition",
  "f_nint": "Intensity", "f_nar": "Aroma characteristics", "f_dev": "Development", "f_sw": "Sweetness", "f_ac": "Acidity",
  "f_tan": "Tannin", "f_alc": "Alcohol", "f_body": "Body", "f_mou": "Mousse", "f_fint": "Flavour intensity",
  "f_par": "Flavour characteristics", "f_fin": "Finish", "f_q": "Quality level", "f_rd": "Readiness for drinking / potential for ageing",
  "f_qj": "Reasoning (BLIC: balance, length, intensity, complexity)",
  "ph_oth": "e.g. legs/tears, deposit, bubbles", "ph_nar": "e.g. primary: lemon, green apple, white flowers; secondary: vanilla, butter; tertiary: honey, nuts",
  "ph_par": "e.g. as on the nose, plus…", "ph_qj": "e.g. Very good: balanced (fruit and acidity), long finish, intense, but limited complexity. Can drink now but has potential because…",
  "sCheck": "Mark it", "sAnalyse": "Analyse with AI", "sSaveOnly": "Save without analysis", "sWorking": "Assessing…",
  "sMissing": "{N} entries are missing: they will count as wrong.", "sEmptyB": "Fill in at least a few entries before saving.",
  "sScore": "Score", "sStruct": "Structure and conclusions", "sYour": "Your choice", "sExp": "Expected", "sAI": "Aromas, flavours and reasoning (AI)",
  "sAIoff": "AI marking unavailable: compare your aromas with the expected profile below yourself.",
  "sProfile": "Expected profile and why", "sPrim": "Primary", "sSec": "Secondary", "sTer": "Tertiary",
  "sFound": "Correct aromas", "sMissed": "Missing", "sWrong": "Out of style", "sConclAI": "Conclusions",
  "sFeedback": "Feedback", "sIssues": "To fix", "sTips": "Tips", "sIdentity": "Style and identity",
  "sNew": "New note", "sDelete": "Delete", "sDelConf": "Delete this note?", "sNoteSaved": "Note saved to the journal.",
  "sNoAIb": "Note saved without AI feedback.", "ssug1": "Which structural mistakes should I fix?", "ssug2": "How do I write an exam-style BLIC justification for this wine?", "ssug3": "Which aroma descriptors could I have used?",
  "sAlcNote": "Alcohol: still wines low < 11%, medium 11–13.9%, high ≥ 14%; fortified low 15–16.4%, medium 16.5–18.4%, high ≥ 18.5%.",
  "sQNote": "Quality: positive on all 4 BLIC criteria = outstanding, 3 = very good, 2 = good, 1 = acceptable.",
  "sEg": "e.g. primary, secondary, tertiary (free text)",
 },
}
srows = '\n'.join('Object.assign(T.%s,%s);' % (l, json.dumps(S[l], ensure_ascii=False)) for l in ('it', 'fr', 'en'))
rep('/* ---------- state ---------- */', srows + '\n/* ---------- state ---------- */')

JS = r"""/* ---------- SAT tasting ---------- */
const SCL=__SCL__;
const SATP=__SATP__;
const SBY={}; SATP.forEach(p=>SBY[p.id]=p);
const SSEC=[["sApp",["clar","aint","col","oth"]],["sNose",["cond","nint","nar","dev"]],["sPal",["sw","ac","tan","alc","body","mou","fint","par","fin"]],["sCon",["q","rd","qj"]]];
const STXT={oth:1,nar:1,par:1,qj:1};
const SSCORED=["aint","col","nint","dev","sw","ac","tan","alc","body","mou","fint","fin","q","rd"];
const LSS="wset3-sat-v1", LSSD="wset3-sat-draft-v1";
let SJ=(()=>{try{const x=JSON.parse(lsGet(LSS)||"{}");return x&&typeof x==="object"?x:{}}catch(e){return {}}})();
let satCur=(()=>{try{const x=JSON.parse(lsGet(LSSD)||"null");return x&&x.k?x:null}catch(e){return null}})();
let satShow=null, satEdit=false, SPEND=null, sMsg="", sPick="";
const sScale=(k,c)=>k==="col"?SCL["col"+c.t]:SCL[k];
const sShown=(k,c)=>k==="tan"?c.t!=="w":k==="mou"?!!c.sp:true;
function satSaveDraft(){ if(satCur) lsSet(LSSD,JSON.stringify(satCur)); else { try{localStorage.removeItem(LSSD)}catch(e){} } }
function saveSJ(ts){ lsSet(LSS,JSON.stringify(SJ)); if(chatCol&&SJ[ts]) chatCol.doc("sat-"+ts).set(SJ[ts]).catch(()=>{}); }
function afterSJLoad(){ lsSet(LSS,JSON.stringify(SJ)); if(view==="sat"&&!SPEND&&!satCur) render(); }
function satName(e){ if(e.k==="A"){const p=SBY[e.pid]; return p?p.n:"?"} const w=e.wine||{}; return [w.n,w.v].filter(Boolean).join(" ")||t("t"+e.t); }
function satStart(k,pid){
  if(k==="A"){ const p=SBY[pid]||SATP[Math.floor(Math.random()*SATP.length)]; satCur={k:"A",pid:p.id,t:p.t,sp:!!p.sp,fo:!!p.fo,f:{},tx:{}}; }
  else satCur={k:"B",t:"w",sp:false,fo:false,wine:{n:"",v:"",x:""},f:{},tx:{}};
  satShow=null; satEdit=true; sMsg=""; satSaveDraft(); render();
}
function satRef(){
  const row=(k,c)=>`<dt>${t("f_"+k)}</dt><dd>${(k==="col"?["w","p","r"].map(x=>t("t"+x)+": "+SCL["col"+x].join(" – ")).join("<br>"):SCL[k].join(" – "))}</dd>`;
  const c={t:"w",sp:1};
  return `<details class="model"><summary>${t("sRefT")}</summary><div class="mb"><p class="muted small">${t("sTermsNote")}</p><dl class="sref">${SSEC.map(([s,ks])=>`<h4>${t(s)}</h4>`+ks.map(k=>STXT[k]?`<dt>${t("f_"+k)}</dt><dd>${k==="qj"?"Balance · Length · Intensity · Complexity":k==="oth"?"e.g. legs/tears, deposit, pétillance, bubbles":t("sEg")}</dd>`:row(k,c)).join("")).join("")}</dl><p class="small" style="margin-top:10px">${t("sAlcNote")}</p><p class="small">${t("sQNote")}</p></div></details>`;
}
function renderSat(){
  const ents=Object.values(SJ).sort((a,b)=>b.ts-a.ts);
  const opts=SATP.map(p=>`<option value="${p.id}" ${p.id===sPick?"selected":""}>${esc(p.n)}</option>`).join("");
  const list=ents.map(e=>`<button class="oqi" data-sj="${e.ts}"><span class="row" style="gap:6px"><span class="tag">${e.k==="A"?t("sModeA").split(":")[0]:t("t"+e.t)}</span><span class="pref">${fmtDT(e.ts)}</span>${e.sc?`<span class="tag mono">${Math.round(e.sc.s/e.sc.m*100)} %</span>`:""}</span><span class="ot">${esc(satName(e))}</span></button>`).join("");
  return `<section class="view"><div class="card"><h2>${t("sat")}</h2><p class="muted" style="max-width:68ch;font-size:.9rem">${t("sIntro")}</p>
  ${satCur?`<div class="row" style="margin-bottom:12px"><button class="btn primary" id="s-resume">${t("sResume")} · ${esc(satCur.k==="A"?(SBY[satCur.pid]||{}).n||"":satName(satCur))}</button><button class="btn ghost" id="s-discard">${t("sDiscard")}</button></div>`:""}
  <div class="olist"><div class="gpart"><b>${t("sModeA")}</b><span class="muted small">${t("sModeAd")}</span><div class="row"><select id="s-pick"><option value="">${t("sRandom")}</option>${opts}</select><button class="btn ${satCur?"":"primary"}" id="s-startA">${t("sStart")}</button></div></div>
  <div class="gpart"><b>${t("sModeB")}</b><span class="muted small">${t("sModeBd")}</span><div class="row"><button class="btn" id="s-startB">${t("sStart")}</button></div></div></div></div>
  ${satRef()}
  <div class="card"><h2>${t("sJournal")}</h2>${list?`<div class="sjl">${list}</div>`:`<div class="empty">${t("sNoJournal")}</div>`}</div></section>`;
}
function sSeg(k,c,val){ const sc=sScale(k,c); return `<div class="sseg" role="group" aria-label="${esc(t("f_"+k))}">${sc.map((v,i)=>`<button type="button" data-sf="${k}" data-si="${i}" aria-pressed="${val===i}">${esc(v)}</button>`).join("")}</div>`; }
function sField(k,c,ro){
  if(STXT[k]){ const v=(c.tx||{})[k]||""; return `<div class="sfield"><span class="sl">${t("f_"+k)}</span><textarea class="sat-ta" data-st="${k}" placeholder="${esc(t("ph_"+k))}" ${ro?"readonly":""}>${esc(v)}</textarea></div>`; }
  if(!sShown(k,c)) return "";
  return `<div class="sfield"><span class="sl">${t("f_"+k)}</span>${sSeg(k,c,(c.f||{})[k])}</div>`;
}
function renderSatEd(){
  const c=satCur, p=c.k==="A"?SBY[c.pid]:null, pend=!!SPEND, off=chatOff||sampleFn===null;
  const head=c.k==="A"?`<p class="label" style="margin:0">${t("sModeA")}</p><p class="sat-wine">${esc(p.n)}</p><div class="row" style="gap:6px"><span class="tag">${t("t"+c.t)}</span>${c.sp?`<span class="tag">${t("sSpark")}</span>`:""}${c.fo?`<span class="tag">${t("sFort")}</span>`:""}</div><p class="muted" style="margin:0">${t("sTaskA")}</p>`
   :`<p class="label" style="margin:0">${t("sModeB")}</p><p class="muted" style="margin:0">${t("sTaskB")}</p>
     <div class="row"><input class="sat-in" style="flex:2 1 220px" data-sw="n" placeholder="${esc(t("sWineName"))}" value="${esc(c.wine.n)}"><input class="sat-in" style="flex:0 1 110px" data-sw="v" placeholder="${esc(t("sVintage"))}" value="${esc(c.wine.v)}"><input class="sat-in" style="flex:1 1 200px" data-sw="x" placeholder="${esc(t("sWineNotes"))}" value="${esc(c.wine.x)}"></div>
     <div class="row"><span class="sl" style="font-weight:600;font-size:.88rem">${t("sType")}</span><div class="seg" role="group">${["w","p","r"].map(x=>`<button type="button" data-stype="${x}" aria-pressed="${c.t===x}">${t("t"+x)}</button>`).join("")}</div><label class="sat-chk"><input type="checkbox" id="s-sp" ${c.sp?"checked":""}>${t("sSpark")}</label><label class="sat-chk"><input type="checkbox" id="s-fo" ${c.fo?"checked":""}>${t("sFort")}</label></div>`;
  const secs=SSEC.map(([s,ks])=>`<div class="sat-sec"><h3>${t(s)}</h3>${ks.map(k=>sField(k,c)).join("")}</div>`).join("");
  const btns=pend?`<div class="row"><span class="muted">${t("sWorking")}</span><button class="btn" id="s-stop">${t("stop")}</button></div>`
   :c.k==="A"?`<div class="row"><button class="btn primary" id="s-check">${t("sCheck")}</button></div>${off?`<p class="muted small" style="margin:0">${t("sAIoff")}</p>`:""}`
   :`<div class="row"><button class="btn primary" id="s-analyse" ${off?"disabled":""}>${t("sAnalyse")}</button><button class="btn" id="s-saveonly">${t("sSaveOnly")}</button></div>${off?`<p class="muted small" style="margin:0">${t("oOff")}</p>`:""}`;
  return `<section class="view"><div class="qhead"><span class="label">${t("sat")}</span><button class="btn ghost" id="s-back">${t("sBack")}</button></div>
  <div class="card" style="display:flex;flex-direction:column;gap:18px">${head}<p class="muted small" style="margin:0">${t("sTermsNote")}</p>${secs}
  <p class="chat-err small" id="s-err" aria-live="polite">${esc(sMsg)}</p>${btns}</div></section>`;
}
function sMark(k,p,v){ const a=p[k]; if(!a) return null; if(v===undefined||v===null) return 0; if(a.includes(v)) return 1; return a.some(x=>Math.abs(x-v)===1)?0.5:0; }
function satStruct(c,p){ const rows=[]; let s=0,m=0; SSCORED.forEach(k=>{ if(!sShown(k,c)||!p[k]) return; const mk=sMark(k,p,c.f[k]); rows.push([k,c.f[k],mk]); s+=mk; m++; }); return {s,m,rows}; }
const sv=(k,c,i)=>i===undefined||i===null?"–":sScale(k,c)[i];
function satNoteText(e){
  const c=e, lines=[];
  SSEC.forEach(([s,ks])=>{ lines.push(T.en[s].toUpperCase()+":"); ks.forEach(k=>{ if(STXT[k]){ const v=(c.tx||{})[k]; if(v&&v.trim()) lines.push("  "+T.en["f_"+k]+": "+v.trim()); } else if(sShown(k,c)) lines.push("  "+T.en["f_"+k]+": "+sv(k,c,(c.f||{})[k])); }); });
  return lines.join("\n");
}
function satExpText(p){ const c={t:p.t,sp:p.sp}; return SSCORED.filter(k=>p[k]).map(k=>"  "+T.en["f_"+k]+": "+p[k].map(i=>sScale(k,c)[i]).join(" / ")).join("\n")+`\n  Aromas/flavours — primary: ${p.ar.p}; secondary: ${p.ar.s}; tertiary: ${p.ar.t}\n  Why (textbook): ${p.why[2]}`; }
function satPromptA(e,p){
  return `You are a WSET Level 3 tasting examiner. The student is practising the Systematic Approach to Tasting (SAT) by writing the typical tasting note for a classic wine style described in the textbook "Understanding Wines: Explaining Style and Quality". Structural choices are marked automatically; you assess only the free-text parts.

WINE STYLE: ${p.n} (${{w:"white",p:"rosé",r:"red"}[p.t]}${p.sp?", sparkling":""}${p.fo?", fortified":""})
EXPECTED PROFILE (acceptable values for a good typical example):
${satExpText(p)}

STUDENT'S NOTE:
${satNoteText(e)}

Assess:
1. "aromas": the student's aroma and flavour characteristics (nose and palate text together) for this style. Score 0–4: 4 = several accurate descriptors covering the relevant clusters (primary and, where expected, secondary/tertiary), precise and in style; 2 = some correct but vague or incomplete; 0 = missing or wrong for the style. Descriptors not in the list but plausible for the style also earn credit.
2. "conclusion": the quality reasoning. Score 0–2: 2 = quality justified with the BLIC criteria (balance, length, intensity, complexity) consistent with the student's own structure, and readiness justified; 1 = partial; 0 = missing or inconsistent.
Write all text in ${CLN[lang]}, addressed to the student ("you"), concise. Keep SAT terms and aroma descriptors in English.
Reply with ONLY this JSON (no other text):
{"aromas":{"score":number,"hit":["correct descriptors"],"missed":["important expected descriptors not given"],"wrong":["descriptors out of style"]},"conclusion":{"score":number,"comment":"one or two sentences"},"structure":"one or two sentences on the most important structural differences from the expected profile and why the style shows them","feedback":"two or three sentences of overall advice"}`;
}
function satPromptB(e){
  const w=e.wine||{};
  return `You are a WSET Level 3 tasting examiner and tutor. The student has written a tasting note with the Systematic Approach to Tasting (SAT) for a wine they are actually tasting. The textbook is "Understanding Wines: Explaining Style and Quality".

WINE (as given by the student, may be empty for a blind tasting): ${[w.n,w.v].filter(Boolean).join(" ")||"(not given)"}${w.x?" — notes: "+w.x:""}
TYPE: ${{w:"white",p:"rosé",r:"red"}[e.t]}${e.sp?", sparkling":""}${e.fo?", fortified":""}

STUDENT'S NOTE:
${satNoteText(e)}

You cannot taste the wine. Assess the note as a WSET Level 3 examiner would assess its form and logic:
- completeness and correct use of the SAT terms (one term per hyphenated line, aroma clusters primary/secondary/tertiary);
- internal consistency (e.g. development vs tertiary aromas, sweetness vs body, flavour intensity vs nose, quality level vs the BLIC reasoning, readiness vs structure and development);
- precision of descriptors (specific rather than generic);
- if a wine is named, plausibility against the typical style described in the textbook (say what is unusual, without claiming the student is wrong about the glass in front of them); if not named, say which style/region/grapes the note suggests.
Score 0–10 for the quality of the note as an exam answer.
Write all text in ${CLN[lang]}, addressed to the student ("you"), concise. Keep SAT terms and descriptors in English.
Reply with ONLY this JSON (no other text):
{"score":number,"sections":{"appearance":"one sentence","nose":"one or two sentences","palate":"one or two sentences","conclusions":"one or two sentences"},"issues":["specific inconsistencies or errors, max 6"],"tips":["practical tips, max 4"],"identity":"one or two sentences","feedback":"two or three sentences"}`;
}
const sArr=(a,n)=>Array.isArray(a)?a.filter(s=>typeof s==="string"&&s.trim()).slice(0,n).map(s=>s.trim()):[];
const sStr=s=>typeof s==="string"?s.trim():"";
async function satAsk(prompt){
  if(sampleFn===undefined) await sampleReady;
  if(!sampleFn){ chatOff=true; throw {code:"not_granted"}; }
  SPEND={ctl:new AbortController()}; render();
  try{
    try{ if(typeof sampleFn.json!=="function") throw {code:"capability_removed"}; return await sampleFn.json(prompt,{cache:false,signal:SPEND.ctl.signal}); }
    catch(e){ if(e&&e.code==="capability_removed"){ const r=await sampleFn(prompt,{cache:false,signal:SPEND.ctl.signal}); const m=String(r.text).match(/\{[\s\S]*\}/); return m?JSON.parse(m[0]):null; } throw e; }
  } finally { SPEND=null; }
}
function satErr(e){ const c=e&&e.code; if(["not_granted","sampling_disabled","not_declared","capability_disabled","capability_removed"].includes(c)) chatOff=true; return c==="cancelled"?"":c==="rate_limited"?t("oRate"):(e instanceof SyntaxError)?t("oBadJson"):t("oErr"); }
function satFinish(e,msg){
  SJ[e.ts]=e; saveSJ(e.ts);
  if(e.sc) { P.s.push({t:e.ts,m:"sat",n:e.sc.m,c:e.sc.s,ch:[],w:satName(e)}); save(); }
  satCur=null; satEdit=false; satSaveDraft(); satShow=e.ts; sMsg=msg||""; render();
}
async function satCheck(){
  const c=satCur, p=SBY[c.pid]; if(!p||SPEND) return;
  const st=satStruct(c,p); const ts=Date.now();
  const e={ts,k:"A",pid:c.pid,t:c.t,sp:c.sp,fo:c.fo,f:Object.assign({},c.f),tx:Object.assign({},c.tx),sc:{s:st.s,m:st.m},g:null};
  if(!chatOff&&sampleFn!==null){
    try{ const g=await satAsk(satPromptA(e,p));
      if(!g||typeof g!=="object") throw {code:"bad"};
      const a=g.aromas||{}, q=g.conclusion||{};
      const as=Math.max(0,Math.min(4,Math.round((Number(a.score)||0)*2)/2)), qs=Math.max(0,Math.min(2,Math.round((Number(q.score)||0)*2)/2));
      e.g={as,qs,hit:sArr(a.hit,10),missed:sArr(a.missed,8),wrong:sArr(a.wrong,6),qc:sStr(q.comment),st:sStr(g.structure),fb:sStr(g.feedback)};
      e.sc={s:st.s+as+qs,m:st.m+6};
    }catch(err){ const m=satErr(err); if(err&&err.code==="cancelled"){ render(); return; } satFinish(e,m); return; }
  }
  satFinish(e);
}
async function satAnalyse(aiOn){
  const c=satCur; if(SPEND) return;
  const filled=Object.keys(c.f).length+Object.values(c.tx).filter(v=>v&&v.trim()).length;
  if(filled<3){ sMsg=t("sEmptyB"); render(); return; }
  const e={ts:Date.now(),k:"B",t:c.t,sp:c.sp,fo:c.fo,wine:Object.assign({},c.wine),f:Object.assign({},c.f),tx:Object.assign({},c.tx),g:null};
  if(aiOn){
    try{ const g=await satAsk(satPromptB(e));
      if(!g||typeof g!=="object") throw {code:"bad"};
      const sc=Math.max(0,Math.min(10,Math.round((Number(g.score)||0)*2)/2)); const se=g.sections||{};
      e.g={sec:{appearance:sStr(se.appearance),nose:sStr(se.nose),palate:sStr(se.palate),conclusions:sStr(se.conclusions)},issues:sArr(g.issues,6),tips:sArr(g.tips,4),id:sStr(g.identity),fb:sStr(g.feedback)};
      e.sc={s:sc,m:10};
    }catch(err){ if(err&&err.code==="cancelled"){ render(); return; } sMsg=satErr(err); render(); return; }
  }
  satFinish(e);
}
function renderSatRes(){
  const e=SJ[satShow]; if(!e){ satShow=null; return renderSat(); }
  const p=e.k==="A"?SBY[e.pid]:null, g=e.g, l=L();
  const pct=e.sc?Math.round(e.sc.s/e.sc.m*100):null;
  const scoreB=e.sc?`<div class="row" style="align-items:baseline;gap:14px"><span class="result-score ${pct>=55?"pass":"fail"}">${pct} %</span><span class="mono muted">${e.sc.s} / ${e.sc.m}</span></div>`:"";
  const li=(a,cls)=>a&&a.length?`<ul class="glist ${cls}">${a.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:"";
  let body="";
  if(e.k==="A"&&p){
    const st=satStruct(e,p);
    const rows=st.rows.map(([k,v,mk])=>`<tr class="srow"><td>${t("f_"+k)}</td><td class="mono">${esc(sv(k,e,v))}</td><td class="mono">${esc(p[k].map(i=>sScale(k,e)[i]).join(" / "))}</td><td class="mk ${mk===1?"ok":mk?"half":"no"}">${mk===1?"✓":mk?"½":"✗"}</td></tr>`).join("");
    body+=`<div class="gpart"><div class="row" style="justify-content:space-between"><b>${t("sStruct")}</b><span class="mono">${st.s} / ${st.m}</span></div><div class="tbl"><table><tr><th></th><th>${t("sYour")}</th><th>${t("sExp")}</th><th></th></tr>${rows}</table></div>${g&&g.st?`<p style="margin:0">${esc(g.st)}</p>`:""}</div>`;
    body+=g?`<div class="gpart"><div class="row" style="justify-content:space-between"><b>${t("sAI")}</b><span class="mono">${g.as+g.qs} / 6</span></div>
      ${g.hit.length?`<span class="ghd ok">${t("sFound")}</span>${li(g.hit,"hit")}`:""}${g.missed.length?`<span class="ghd no">${t("sMissed")}</span>${li(g.missed,"miss")}`:""}${g.wrong.length?`<span class="ghd no">${t("sWrong")}</span>${li(g.wrong,"miss")}`:""}
      ${g.qc?`<span class="ghd">${t("sConclAI")} · ${g.qs}/2</span><p style="margin:0">${esc(g.qc)}</p>`:""}${g.fb?`<div class="expl"><span>${esc(g.fb)}</span></div>`:""}</div>`
      :`<p class="muted small" style="margin:0">${t("sAIoff")}</p>`;
    body+=`<details class="model" ${g?"":"open"}><summary>${t("sProfile")}</summary><div class="mb"><p>${esc(p.why[l])}</p><p><b>${t("sPrim")}:</b> ${esc(p.ar.p)}<br><b>${t("sSec")}:</b> ${esc(p.ar.s)}<br><b>${t("sTer")}:</b> ${esc(p.ar.t)}</p><p class="small muted">${t("f_nar")}: ${esc((e.tx||{}).nar||"–")}<br>${t("f_par")}: ${esc((e.tx||{}).par||"–")}<br>${t("f_qj")}: ${esc((e.tx||{}).qj||"–")}</p></div></details>`;
  } else {
    const w=e.wine||{};
    body+=`<div class="gpart"><b>${t("sModeB")}</b><pre class="small" style="white-space:pre-wrap;margin:0;font-family:var(--f-mono)">${esc(satNoteText(e))}</pre>${w.x?`<p class="muted small" style="margin:0">${esc(w.x)}</p>`:""}</div>`;
    body+=g?`<div class="gpart">${["appearance","nose","palate","conclusions"].map((k,i)=>g.sec[k]?`<span class="ghd">${t(["sApp","sNose","sPal","sCon"][i])}</span><p style="margin:0">${esc(g.sec[k])}</p>`:"").join("")}
      ${g.issues.length?`<span class="ghd no">${t("sIssues")}</span>${li(g.issues,"miss")}`:""}${g.tips.length?`<span class="ghd ok">${t("sTips")}</span>${li(g.tips,"hit")}`:""}
      ${g.id?`<span class="ghd">${t("sIdentity")}</span><p style="margin:0">${esc(g.id)}</p>`:""}${g.fb?`<div class="expl"><span>${esc(g.fb)}</span></div>`:""}</div>`
      :`<p class="muted small" style="margin:0">${t("sNoAIb")}</p>`;
  }
  return `<section class="view"><div class="qhead"><span class="label">${t("sat")} · ${fmtDT(e.ts)}</span><button class="btn ghost" id="s-back">${t("sBack")}</button></div>
  <div class="card ograde"><p class="label" style="margin:0">${e.k==="A"?t("sModeA"):t("sModeB")}</p><p class="sat-wine">${esc(satName(e))}</p>${scoreB}
  <p class="chat-err small" aria-live="polite">${esc(sMsg)}</p>${body}
  <div class="row"><button class="btn primary" id="s-new">${t("sNew")}</button><span id="s-delw"><button class="btn ghost" id="s-del">${t("sDelete")}</button></span></div>
  ${chatBox("s_"+e.ts)}</div></section>`;
}
function sctxPrompt(ts){
  const e=SJ[ts]; if(!e) return "You are a WSET Level 3 tasting tutor. Reply in "+CLN[lang]+".";
  const p=e.k==="A"?SBY[e.pid]:null, g=e.g;
  return `You are a patient, expert tutor for the WSET Level 3 Award in Wines, specialised in the Systematic Approach to Tasting (SAT) as taught in the textbook "Understanding Wines: Explaining Style and Quality". The student has just written a SAT tasting note and wants to discuss it.

How to answer:
- Always reply in ${CLN[lang]}; keep SAT terms and aroma descriptors in English as in the textbook.
- Explain the link between grape, climate, winemaking and what appears in the glass (the "why").
- Stay within the WSET Level 3 course; if you go beyond the textbook, say so. If unsure, say so rather than guessing.
- Be concise: usually 80–200 words, short paragraphs or a short list, **bold** sparingly, no headings or tables.

${p?`Exercise: typical note for "${p.n}". Expected profile:\n${satExpText(p)}`:`Real wine tasted: ${satName(e)} (${{w:"white",p:"rosé",r:"red"}[e.t]}${e.sp?", sparkling":""}${e.fo?", fortified":""})`}

Student's note:
${satNoteText(e)}
${e.sc?`\nScore: ${e.sc.s}/${e.sc.m}`:""}${g&&g.fb?`\nExaminer feedback: ${g.fb}`:""}

The conversation with the student follows.`;
}
function bindSat(){
  const b=$("#s-back"); if(b) b.onclick=()=>{ if(SPEND) SPEND.ctl.abort(); satShow=null; satEdit=false; satSaveDraft(); sMsg=""; render(); };
  window.scrollTo(0,0);
}
document.getElementById("main").addEventListener("click",e=>{
  if(view!=="sat"||quiz) return;
  const x=e.target;
  const sj=x.closest("[data-sj]"); if(sj){ satShow=+sj.dataset.sj; sMsg=""; render(); return; }
  const sf=x.closest("[data-sf]"); if(sf&&satCur&&satEdit&&!satShow){ const k=sf.dataset.sf,i=+sf.dataset.si; satCur.f[k]=satCur.f[k]===i?undefined:i; if(satCur.f[k]===undefined) delete satCur.f[k]; satSaveDraft(); sf.parentElement.querySelectorAll("button").forEach(bb=>bb.setAttribute("aria-pressed",String(satCur.f[k]===+bb.dataset.si))); return; }
  const ty=x.closest("[data-stype]"); if(ty&&satCur){ satCur.t=ty.dataset.stype; delete satCur.f.col; if(satCur.t==="w") delete satCur.f.tan; satSaveDraft(); const y=window.scrollY; render(); window.scrollTo(0,y); return; }
  if(x.closest("#s-startA")){ satStart("A",$("#s-pick").value); return; }
  if(x.closest("#s-startB")){ satStart("B"); return; }
  if(x.closest("#s-resume")){ satShow=null; satEdit=true; sMsg=""; render(); return; }
  if(x.closest("#s-discard")){ satCur=null; satSaveDraft(); render(); return; }
  if(x.closest("#s-new")){ satShow=null; sMsg=""; render(); return; }
  if(x.closest("#s-del")){ const w=$("#s-delw"); w.innerHTML=`<span class="confirm">${t("sDelConf")} <button class="btn" id="s-dely">${t("sDelete")}</button></span>`; return; }
  if(x.closest("#s-dely")){ const ts=satShow; delete SJ[ts]; lsSet(LSS,JSON.stringify(SJ)); if(chatCol) chatCol.doc("sat-"+ts).delete().catch(()=>{}); satShow=null; render(); return; }
  if(x.closest("#s-stop")){ SPEND&&SPEND.ctl.abort(); return; }
  if(x.closest("#s-check")){ const c=satCur,p=SBY[c.pid]; const miss=SSCORED.filter(k=>sShown(k,c)&&p[k]&&c.f[k]===undefined).length;
    if(miss&&sMsg!==t("sMissing").replace("{N}",miss)){ sMsg=t("sMissing").replace("{N}",miss); const er=$("#s-err"); if(er) er.textContent=sMsg; return; }
    satCheck(); return; }
  if(x.closest("#s-analyse")){ satAnalyse(true); return; }
  if(x.closest("#s-saveonly")){ satAnalyse(false); return; }
});
document.getElementById("main").addEventListener("input",e=>{
  if(view!=="sat"||!satCur||!satEdit||satShow) return;
  const x=e.target;
  if(x.dataset.st){ satCur.tx[x.dataset.st]=x.value; satSaveDraft(); }
  else if(x.dataset.sw){ satCur.wine[x.dataset.sw]=x.value; satSaveDraft(); }
});
document.getElementById("main").addEventListener("change",e=>{
  if(view!=="sat") return;
  if(e.target.id==="s-pick"){ sPick=e.target.value; return; }
  if(!satCur) return;
  if(e.target.id==="s-sp"){ satCur.sp=e.target.checked; if(!satCur.sp) delete satCur.f.mou; satSaveDraft(); const y=window.scrollY; render(); window.scrollTo(0,y); }
  if(e.target.id==="s-fo"){ satCur.fo=e.target.checked; satSaveDraft(); }
});

"""
JS = JS.replace('__SCL__', scl).replace('__SATP__', satp)
rep('/* ---------- quiz ---------- */', JS + '/* ---------- quiz ---------- */')
open(D + 'live.html', 'w').write(h)
print('ok')
