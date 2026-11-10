import re, json, glob, hashlib, shutil
D = '/tmp/claude-0/-home-claude/3f268032-b4c3-5225-a7f8-c79dc4579a8b/scratchpad/h/'
src = D + 'live.html'
h = open(src).read()
assert 'const OPEN' not in h, 'already patched'
shutil.copy(src, D + 'live_bak2.html')

def rep(old, new, count=1):
    global h
    assert h.count(old) == count, (old[:80], h.count(old))
    h = h.replace(old, new)

# ---------- parse open questions ----------
OPEN = []
seen = set()
for f in sorted(glob.glob(D + 'oq_*.txt')):
    for blk in re.split(r'\n\s*\n', open(f).read().strip()):
        lines = [l for l in blk.strip().split('\n') if l.strip()]
        head = lines[0][1:].split()
        c = head[0]
        q = None; parts = []
        for ln in lines[1:]:
            k, v = ln.split(':', 1)
            k = k.strip(); v = v.strip()
            if k == 'Q':
                q = [x.strip() for x in v.split('||')]; assert len(q) == 3, (f, v)
            elif k.startswith('P'):
                tt = [x.strip() for x in v.split('||')]; assert len(tt) == 3, (f, v)
                parts.append({'t': tt, 'm': int(k[1:]), 'k': ''})
            elif k == 'K':
                parts[-1]['k'] = v
        assert q and parts and all(p['k'] for p in parts), (f, blk[:60])
        i = hashlib.sha1(('open' + c + q[2] + parts[0]['t'][2]).encode()).hexdigest()[:7]
        assert i not in seen; seen.add(i)
        OPEN.append({'id': i, 'c': c, 'q': q, 'parts': parts})
print('open questions', len(OPEN), 'parts', sum(len(o['parts']) for o in OPEN), 'marks', sum(p['m'] for o in OPEN for p in o['parts']))
ojs = json.dumps(OPEN, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')

# ---------- CSS ----------
CSS = r"""
.olist{display:flex;flex-direction:column;gap:8px}
.oqi{display:flex;flex-direction:column;gap:6px;text-align:left;border:1px solid var(--line);background:var(--surface);border-radius:9px;padding:12px 14px;width:100%}
.oqi:hover{border-color:var(--accent)}
.oqi .ot{font-weight:500}
.opart{display:flex;flex-direction:column;gap:8px}
.opart .ph{display:flex;gap:10px;align-items:baseline;justify-content:space-between;flex-wrap:wrap}
.opart .ph b{font-weight:600}
.opart textarea{width:100%;min-height:150px;resize:vertical;font:inherit;font-size:.95rem;line-height:1.5;border:1px solid var(--line);border-radius:8px;padding:10px 12px;background:var(--surface);color:var(--fg)}
.opart textarea:focus{outline:2px solid var(--accent);outline-offset:0;border-color:var(--accent)}
.wc{font-size:.75rem;color:var(--muted);font-family:var(--f-mono)}
.ograde{display:flex;flex-direction:column;gap:14px}
.gpart{border:1px solid var(--line);border-radius:9px;padding:12px 14px;display:flex;flex-direction:column;gap:8px;background:var(--surface)}
.gbar{height:8px;border-radius:4px;background:var(--sunk);overflow:hidden}
.gbar i{display:block;height:100%}
.glist{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:3px;font-size:.92rem}
.glist.hit li::marker{color:var(--good)} .glist.miss li::marker{color:var(--bad)}
.ghd{font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;font-weight:700}
.ghd.ok{color:var(--good)} .ghd.no{color:var(--bad)}
details.model{border:1px solid var(--line);border-radius:9px;background:var(--surface)}
details.model summary{padding:10px 14px;cursor:pointer;font-weight:600}
details.model .mb{padding:0 14px 14px;font-size:.93rem;line-height:1.55}
details.model .mb p{margin:0 0 8px}
.prev{display:flex;gap:6px;flex-wrap:wrap;align-items:center;font-size:.82rem}
.prev button{border:1px solid var(--line);background:var(--surface);border-radius:999px;padding:3px 10px;font-size:.8rem}
.prev button[aria-pressed="true"]{background:var(--fg);color:var(--bg);border-color:var(--fg)}
"""
rep('@media (prefers-reduced-motion:reduce)', CSS + '@media (prefers-reduced-motion:reduce)')

# ---------- tab ----------
rep('<button role="tab" id="tab-exam" data-v="exam"></button>',
    '<button role="tab" id="tab-exam" data-v="exam"></button>\n      <button role="tab" id="tab-open" data-v="open"></button>')
rep('["home","practice","exam","history"].forEach(v=>$("#tab-"+v).textContent=t(v));',
    '["home","practice","exam","open","history"].forEach(v=>$("#tab-"+v).textContent=t(v));')

# ---------- strings ----------
S = {
'it': dict(open="Risposte scritte", oIntro="Domande aperte come nella parte scritta dell'esame WSET 3, su tutto il programma. Scrivi la risposta per ogni punto: l'IA la corregge come un esaminatore, ti dà un punteggio per punto, ti dice cosa hai centrato e cosa manca e ti propone una risposta modello. Ogni correzione resta salvata nel tuo account.",
  oAll="Tutti gli argomenti", oRandom="Domanda a caso (prima le nuove)", oDone="Risposte", oAvg="Media", oBest="migliore", oMarks="punti", oParts="punti di domanda", oNone="Nessuna domanda in questo filtro.",
  oGrade="Correggi con l'IA", oGrading="Correzione in corso… (può richiedere fino a un minuto)", oNew="Nuovo tentativo", oBack="Tutte le domande", oEmpty="Scrivi almeno una risposta prima di chiedere la correzione.",
  oScore="Punteggio", oHit="Punti centrati", oMiss="Punti mancanti o da correggere", oFeedback="Commento generale", oModel="Risposta modello", oKeys="Traccia di correzione (punti chiave del manuale, in inglese)",
  oAttempts="Tentativi", oOff="La correzione con l'IA non è disponibile qui: apri la pagina su claude.ai e consenti l'uso di Claude. Puoi comunque scrivere le risposte e confrontarle con la traccia di correzione.",
  oErr="La correzione non è riuscita. Riprova tra poco.", oRate="Troppe richieste o limite di utilizzo raggiunto: riprova più tardi.", oBadJson="La risposta dell'IA non era leggibile. Riprova.",
  oDraft="Bozza salvata automaticamente", oWords="parole", mOpen="Risposta scritta", oTip="Consiglio d'esame: un punto = un'idea corretta e spiegata (il perché). Scrivi frasi brevi, una idea per frase, e usa la terminologia del manuale.",
  cmp="Confronti trasversali", osug1="Come avrei potuto prendere il punteggio pieno?", osug2="Spiegami meglio il punto che mi manca", osug3="Fammi una domanda simile per allenarmi"),
'fr': dict(open="Réponses rédigées", oIntro="Questions ouvertes comme dans l'épreuve écrite du WSET 3, sur tout le programme. Rédigez la réponse à chaque partie : l'IA la corrige comme un examinateur, donne une note par partie, indique ce que vous avez trouvé et ce qui manque, et propose une réponse modèle. Chaque correction reste enregistrée dans votre compte.",
  oAll="Tous les thèmes", oRandom="Question au hasard (nouvelles d'abord)", oDone="Réponses", oAvg="Moyenne", oBest="meilleure", oMarks="points", oParts="parties", oNone="Aucune question dans ce filtre.",
  oGrade="Corriger avec l'IA", oGrading="Correction en cours… (jusqu'à une minute)", oNew="Nouvelle tentative", oBack="Toutes les questions", oEmpty="Écrivez au moins une réponse avant de demander la correction.",
  oScore="Note", oHit="Points obtenus", oMiss="Points manquants ou à corriger", oFeedback="Commentaire général", oModel="Réponse modèle", oKeys="Barème (points clés du manuel, en anglais)",
  oAttempts="Tentatives", oOff="La correction par l'IA n'est pas disponible ici : ouvrez la page sur claude.ai et autorisez Claude. Vous pouvez quand même rédiger et comparer avec le barème.",
  oErr="La correction a échoué. Réessayez dans un instant.", oRate="Trop de demandes ou limite d'utilisation atteinte : réessayez plus tard.", oBadJson="La réponse de l'IA était illisible. Réessayez.",
  oDraft="Brouillon enregistré automatiquement", oWords="mots", mOpen="Réponse rédigée", oTip="Conseil d'examen : un point = une idée juste et expliquée (le pourquoi). Faites des phrases courtes, une idée par phrase, avec le vocabulaire du manuel.",
  cmp="Comparaisons transversales", osug1="Comment aurais-je pu avoir la note maximale ?", osug2="Explique-moi mieux le point qui me manque", osug3="Pose-moi une question similaire pour m'entraîner"),
'en': dict(open="Written answers", oIntro="Open questions like the WSET 3 written paper, across the whole syllabus. Write your answer to each part: the AI marks it like an examiner, gives a score per part, tells you what you got and what is missing, and suggests a model answer. Every marking is saved to your account.",
  oAll="All topics", oRandom="Random question (new first)", oDone="Answered", oAvg="Average", oBest="best", oMarks="marks", oParts="parts", oNone="No questions in this filter.",
  oGrade="Mark with AI", oGrading="Marking… (can take up to a minute)", oNew="New attempt", oBack="All questions", oEmpty="Write at least one answer before asking for marking.",
  oScore="Score", oHit="Points credited", oMiss="Missing or incorrect points", oFeedback="Overall comment", oModel="Model answer", oKeys="Marking guide (textbook key points, in English)",
  oAttempts="Attempts", oOff="AI marking isn't available here: open the page on claude.ai and allow Claude. You can still write answers and compare with the marking guide.",
  oErr="Marking failed. Try again in a moment.", oRate="Too many requests or usage limit reached: try again later.", oBadJson="The AI's reply couldn't be read. Try again.",
  oDraft="Draft saved automatically", oWords="words", mOpen="Written answer", oTip="Exam tip: one mark = one correct idea, explained (the why). Write short sentences, one idea each, using textbook terms.",
  cmp="Cross-topic comparisons", osug1="How could I have scored full marks?", osug2="Explain the point I missed more clearly", osug3="Give me a similar question to practise"),
}
srows = '\n'.join('Object.assign(T.%s,%s);' % (l, json.dumps(S[l], ensure_ascii=False)) for l in ('it', 'fr', 'en'))
rep('\n/* ---------- state ---------- */', '\n' + srows + '\n\n/* ---------- state ---------- */')

# chName fallback for cmp
rep('const chName=c=>CH[c]?CH[c][lang]:c;', 'const chName=c=>CH[c]?CH[c][lang]:(c==="cmp"?t("cmp"):c);')

# history mode name
rep('function modeName(s){return s.m==="exam"?t("mExam"):s.m==="errors"?t("mErrors"):t("mPractice")}',
    'function modeName(s){return s.m==="exam"?t("mExam"):s.m==="errors"?t("mErrors"):s.m==="open"?t("mOpen"):t("mPractice")}')

# render(): open question detail view + open list view
rep('  if(quiz){ m.innerHTML=quiz.done?renderResult():renderQ(); bindQuiz(); return }',
    '  if(quiz){ m.innerHTML=quiz.done?renderResult():renderQ(); bindQuiz(); return }\n  if(oq&&view==="open"){ m.innerHTML=renderOQ(); bindOQ(); return }')
rep('m.innerHTML={home:renderHome,practice:renderPractice,exam:renderExam,errors:renderErrors,history:renderHistory}[view]();',
    'm.innerHTML={home:renderHome,practice:renderPractice,exam:renderExam,open:renderOpen,errors:renderErrors,history:renderHistory}[view]();')

# tabs reset oq
rep('  quiz=null; view=b.dataset.v; render(); });', '  quiz=null; oq=null; view=b.dataset.v; render(); });')

# chat suggestions: different set for open questions
rep('["sug1","sug2","sug3"].map(k=>', '(String(id).startsWith("o_")?["osug1","osug2","osug3"]:["sug1","sug2","sug3"]).map(k=>')

# ctxPrompt branch
rep('function ctxPrompt(id){\n', 'function ctxPrompt(id){\n  if(String(id).startsWith("o_")) return octxPrompt(id.slice(2));\n')

# loadChats: also load open attempts from the same collection snapshot
rep('    snap.docs.forEach(d=>{const x=d.data(); if(d.id.startsWith("chat-")&&x&&Array.isArray(x.m)) remote[d.id.slice(5)]=x.m;});',
    '    snap.docs.forEach(d=>{const x=d.data(); if(d.id.startsWith("chat-")&&x&&Array.isArray(x.m)) remote[d.id.slice(5)]=x.m; if(d.id.startsWith("open-")&&x&&Array.isArray(x.a)) mergeOA(d.id.slice(5),x.a);});\n    afterOALoad();')

JS = r"""
/* ---------- open (written) questions ---------- */
const OPEN = __OPEN__;
const OBY = {}; OPEN.forEach(o=>OBY[o.id]=o);
const OPR = {}; BANK.forEach(b=>{const r=OPR[b.c]||(OPR[b.c]=[b.p,b.p]); if(b.p<r[0]) r[0]=b.p; if(b.p>r[1]) r[1]=b.p;});
const LSO="wset3-open-v1", LSOD="wset3-odraft-v1";
let OA=(()=>{try{const x=JSON.parse(lsGet(LSO)||"{}");return x&&typeof x==="object"?x:{}}catch(e){return {}}})();
let ODR=(()=>{try{const x=JSON.parse(lsGet(LSOD)||"{}");return x&&typeof x==="object"?x:{}}catch(e){return {}}})();
let oq=null, oCh="", OPEND=null, oSel={}, oMsg="";
const omax=o=>o.parts.reduce((s,p)=>s+p.m,0);
const oBest=id=>{const a=OA[id]; if(!a||!a.length) return null; return a.reduce((b,x)=>x.s/x.m>b.s/b.m?x:b,a[0]);};
const oPct=x=>Math.round(x.s/x.m*100);
function oPages(o){const r=OPR[o.c]; return r?(r[0]===r[1]?r[0]:r[0]+"–"+r[1]):"";}
function mergeOA(id,remote){const a=OA[id]||[],seen=new Set(); OA[id]=[...a,...remote].filter(x=>x&&x.ts&&!seen.has(x.ts)&&seen.add(x.ts)).sort((x,y)=>x.ts-y.ts).slice(-8);}
function afterOALoad(){lsSet(LSO,JSON.stringify(OA)); if(view==="open"&&!OPEND) render();}
function saveOA(id){lsSet(LSO,JSON.stringify(OA)); if(chatCol&&OA[id]) chatCol.doc("open-"+id).set({q:id,a:OA[id]}).catch(()=>{});}
function saveDraft(){lsSet(LSOD,JSON.stringify(ODR));}
const wcount=s=>(String(s||"").trim().match(/\S+/g)||[]).length;

function renderOpen(){
  const chs=[...Object.keys(CH).filter(c=>OPEN.some(o=>o.c===c)),"cmp"].filter(c=>OPEN.some(o=>o.c===c));
  const list=OPEN.filter(o=>!oCh||o.c===oCh);
  const done=OPEN.filter(o=>OA[o.id]&&OA[o.id].length);
  const avg=done.length?Math.round(done.reduce((s,o)=>s+oPct(oBest(o.id)),0)/done.length):null;
  const items=list.map(o=>{const b=oBest(o.id);const p=b?oPct(b):null;
    return `<button class="oqi" data-oq="${o.id}"><span class="emeta"><span class="tag">${esc(chName(o.c))}</span><span class="mono">${o.parts.length} ${t("oParts")} · ${omax(o)} ${t("oMarks")}</span>${b?`<span class="tag ${p>=55?"fixed":"active"}">${t("oBest")} ${b.s}/${b.m} · ${p} %</span>`:""}</span><span class="ot">${esc(o.q[L()])}</span><span class="muted" style="font-size:.88rem">${o.parts.map((p,i)=>"abcdefgh"[i]+") "+esc(p.t[L()])).join("<br>")}</span></button>`}).join("");
  return `<section class="view"><div class="card"><h2>${t("open")}</h2><p class="muted" style="max-width:68ch;font-size:.9rem">${t("oIntro")}</p><p class="muted" style="max-width:68ch;font-size:.85rem;margin-top:0">${t("oTip")}</p>
  <div class="stats" style="margin:12px 0"><div class="stat"><span class="label">${t("oDone")}</span><b>${done.length}<span class="muted" style="font-size:1rem"> / ${OPEN.length}</span></b></div><div class="stat"><span class="label">${t("oAvg")}</span><b>${avg===null?"–":avg+" %"}</b></div></div>
  <div class="row"><button class="btn primary" id="o-rand">${t("oRandom")}</button><select id="o-ch"><option value="">${t("oAll")} (${OPEN.length})</option>${chs.map(c=>`<option value="${c}" ${c===oCh?"selected":""}>${esc(chName(c))} (${OPEN.filter(o=>o.c===c).length})</option>`).join("")}</select></div></div>
  <div class="olist">${items||`<div class="empty">${t("oNone")}</div>`}</div></section>`;
}

function gradeView(att,o){
  const g=att.g, l=L(), p=oPct(att);
  const parts=(g.parts||[]).map((x,i)=>{const pp=o.parts[i]; if(!pp) return ""; const r=x.max?x.score/x.max:0;
    return `<div class="gpart"><div class="ph row" style="justify-content:space-between"><b>${"abcdefgh"[i]})</b><span class="mono">${x.score}/${x.max}</span></div>
    <div class="gbar"><i style="width:${Math.round(r*100)}%;background:${r>=.55?"var(--good)":"var(--bad)"}"></i></div>
    ${x.hit&&x.hit.length?`<span class="ghd ok">${t("oHit")}</span><ul class="glist hit">${x.hit.map(s=>`<li>${esc(s)}</li>`).join("")}</ul>`:""}
    ${x.missed&&x.missed.length?`<span class="ghd no">${t("oMiss")}</span><ul class="glist miss">${x.missed.map(s=>`<li>${esc(s)}</li>`).join("")}</ul>`:""}
    ${x.comment?`<span style="font-size:.92rem">${esc(x.comment)}</span>`:""}</div>`}).join("");
  return `<div class="ograde"><div class="row" style="align-items:baseline;gap:16px"><span class="label">${t("oScore")}</span><span class="result-score ${p>=55?"pass":"fail"}" style="font-size:2.4rem">${p} %</span><span class="mono muted">${att.s}/${att.m}</span><span class="muted" style="font-size:.8rem">${fmtDT(att.ts)}</span></div>
  ${parts}
  ${g.feedback?`<div class="expl fb ${p>=55?"ok":"no"}"><span class="verdict ${p>=55?"ok":"no"}">${t("oFeedback")}</span><span>${esc(g.feedback)}</span></div>`:""}
  ${g.model?`<details class="model"><summary>${t("oModel")}</summary><div class="mb">${md(g.model)}</div></details>`:""}
  ${keysBox(o)}</div>`;
}
function keysBox(o){return `<details class="model"><summary>${t("oKeys")}</summary><div class="mb">${o.parts.map((p,i)=>`<p><b>${"abcdefgh"[i]}) [${p.m}]</b> ${esc(p.k)}</p>`).join("")}</div></details>`}

function renderOQ(){
  const o=OBY[oq], l=L(), atts=OA[oq]||[], pend=OPEND&&OPEND.id===oq;
  let sel=oSel[oq]; if(sel===undefined) sel=atts.length&&!ODR[oq]?atts.length-1:-1;
  const att=sel>=0?atts[sel]:null;
  const ans=att?att.a:(ODR[oq]||[]);
  const ro=!!att||pend;
  const parts=o.parts.map((p,i)=>`<div class="opart"><div class="ph"><b>${"abcdefgh"[i]}) ${esc(p.t[l])}</b><span class="mono muted">${p.m} ${t("oMarks")}</span></div>
    <textarea data-pi="${i}" ${ro?"readonly":""} aria-label="${"abcdefgh"[i]})">${esc(ans[i]||"")}</textarea><span class="wc" data-wc="${i}">${wcount(ans[i])} ${t("oWords")}</span></div>`).join("");
  const prev=atts.length?`<div class="prev"><span class="label">${t("oAttempts")}</span>${atts.map((x,i)=>`<button data-att="${i}" aria-pressed="${i===sel}">${fmtD(x.ts)} · ${oPct(x)} %</button>`).join("")}<button data-att="-1" aria-pressed="${sel===-1}">+ ${t("oNew")}</button></div>`:"";
  const off=chatOff||sampleFn===null;
  const actions=att?"":(pend?`<div class="row"><span class="muted">${t("oGrading")}</span><button class="btn" id="o-stop">${t("stop")}</button></div>`
    :`<div class="row"><button class="btn primary" id="o-grade" ${off?"disabled":""}>${t("oGrade")}</button><span class="muted" style="font-size:.8rem">${t("oDraft")}</span></div>${off?`<p class="muted" style="font-size:.85rem;margin:0">${t("oOff")}</p>${keysBox(o)}`:""}`);
  return `<section class="view"><div class="qhead"><span class="label">${t("mOpen")}</span><button class="btn ghost" id="o-back">${t("oBack")}</button></div>
  <div class="card" style="display:flex;flex-direction:column;gap:16px"><div class="row" style="gap:6px"><span class="tag">${esc(chName(o.c))}</span><span class="tag mono">${omax(o)} ${t("oMarks")}</span>${oPages(o)?`<span class="pref">${t("page")} ${oPages(o)}</span>`:""}</div>
  <p class="qtext" style="margin:0">${esc(o.q[l])}</p>${prev}${parts}
  <p class="chat-err small" id="o-err" aria-live="polite">${esc(oMsg)}</p>${actions}
  ${att?gradeView(att,o):""}
  ${atts.length?chatBox("o_"+oq):""}</div></section>`;
}
function bindOQ(){
  $("#o-back").onclick=()=>{oq=null;oMsg="";render()};
  document.querySelectorAll(".opart textarea").forEach(ta=>{ if(ta.readOnly) return; ta.oninput=()=>{const i=+ta.dataset.pi; const d=ODR[oq]||(ODR[oq]=[]); d[i]=ta.value; saveDraft(); const w=document.querySelector(`[data-wc="${i}"]`); if(w) w.textContent=wcount(ta.value)+" "+t("oWords");}; });
  document.querySelectorAll("[data-att]").forEach(b=>b.onclick=()=>{oSel[oq]=+b.dataset.att; oMsg=""; render()});
  const g=$("#o-grade"); if(g) g.onclick=()=>gradeOpen(oq);
  const s=$("#o-stop"); if(s) s.onclick=()=>OPEND&&OPEND.ctl.abort();
  window.scrollTo(0,0);
}
function openQ(id){oq=id; oMsg=""; if(OA[id]&&OA[id].length&&!ODR[id]) oSel[id]=OA[id].length-1; else oSel[id]=-1; render();}

function gradePrompt(o,ans){
  const lt="abcdefgh";
  const parts=o.parts.map((p,i)=>`PART ${lt[i]}) [${p.m} marks] ${p.t[2]}
Textbook key points (guide, not exhaustive): ${p.k}
STUDENT ANSWER ${lt[i]}):
"""+'"""'+r"""
${(ans[i]||"").trim()||"(blank)"}
"""+'"""'+r"""`).join("\n\n");
  return `You are a strict but fair examiner for the WSET Level 3 Award in Wines, marking a short written answer. The syllabus is the WSET Level 3 textbook "Understanding Wines: Explaining Style and Quality".

QUESTION (chapter: ${o.c==="cmp"?"cross-topic":CH[o.c].en}): ${o.q[2]}

${parts}

Marking rules, in the WSET style:
- For each part award marks up to that part's maximum. Give 1 mark for each distinct, correct and relevant point the student actually wrote. Where the question asks to explain, a point earns its mark only when the reason or effect (the "why") is given; a bare fact with no link can earn at most half a mark. Use whole or half marks only.
- The key points come from the textbook and guide the marking; also credit other correct, relevant points consistent with the textbook. Do not credit statements that are wrong, vague, contradictory or irrelevant, and do not infer what the student did not write. Repeating the question earns nothing. A blank part scores 0.
- The student may write in Italian, French or English; ignore spelling and grammar.
- Be consistent: the same answer should always get the same score.

Write all feedback text in ${CLN[lang]}, addressed to the student ("you"), concise and specific.
Reply with ONLY a JSON object in exactly this shape (no other text):
{"parts":[{"score":number,"max":number,"hit":["each point credited, max 15 words"],"missed":["the most important missing or incorrect points, max 15 words each"],"comment":"one or two sentences on this part"}],"feedback":"2 to 4 sentences: overall level against the WSET Level 3 standard and the single most useful way to improve","model":"a model answer that would score full marks, organised by part labels a), b)…, using short sentences each making one creditable point with its reason, at most 300 words"}
There must be exactly ${o.parts.length} objects in "parts", in order. "hit" at most 8 items, "missed" at most 6 items.`;
}
function cleanGrade(o,g){
  if(!g||typeof g!=="object"||!Array.isArray(g.parts)) throw {code:"invalid_json"};
  const parts=o.parts.map((p,i)=>{const x=g.parts[i]||{}; let sc=Number(x.score); if(!isFinite(sc)) sc=0; sc=Math.max(0,Math.min(p.m,Math.round(sc*2)/2));
    const arr=a=>Array.isArray(a)?a.filter(s=>typeof s==="string"&&s.trim()).slice(0,8).map(s=>s.trim()):[];
    return {score:sc,max:p.m,hit:arr(x.hit),missed:arr(x.missed).slice(0,6),comment:typeof x.comment==="string"?x.comment.trim():""}});
  return {parts,feedback:typeof g.feedback==="string"?g.feedback.trim():"",model:typeof g.model==="string"?g.model.trim():""};
}
async function gradeOpen(id){
  const o=OBY[id]; const ans=o.parts.map((p,i)=>((ODR[id]||[])[i]||"").trim());
  if(!ans.some(a=>a)){oMsg=t("oEmpty"); render(); return}
  if(OPEND) return;
  if(sampleFn===undefined) await sampleReady;
  if(!sampleFn){chatOff=true; render(); return}
  OPEND={id,ctl:new AbortController()}; oMsg=""; render();
  const prompt=gradePrompt(o,ans);
  let g;
  try{
    try{
      if(typeof sampleFn.json!=="function") throw {code:"capability_removed"};
      g=await sampleFn.json(prompt,{cache:false,signal:OPEND.ctl.signal});
    }catch(e){
      if(e&&e.code==="capability_removed"){ const r=await sampleFn(prompt,{cache:false,signal:OPEND.ctl.signal}); const m=String(r.text).match(/\{[\s\S]*\}/); g=m?JSON.parse(m[0]):null; }
      else throw e;
    }
    g=cleanGrade(o,g);
    const s=g.parts.reduce((a,x)=>a+x.score,0), m=omax(o), now=Date.now();
    const att={ts:now,a:ans,g,s,m};
    (OA[id]=OA[id]||[]).push(att); if(OA[id].length>8) OA[id]=OA[id].slice(-8);
    saveOA(id); delete ODR[id]; saveDraft(); oSel[id]=OA[id].length-1;
    P.s.push({t:now,m:"open",n:m,c:s,ch:[o.c]}); save();
  }catch(e){
    const c=e&&e.code;
    if(["not_granted","sampling_disabled","not_declared","capability_disabled","capability_removed"].includes(c)) chatOff=true;
    oMsg=c==="cancelled"?"":c==="rate_limited"?t("oRate"):(c==="invalid_json"||e instanceof SyntaxError)?t("oBadJson"):t("oErr");
  }
  OPEND=null; if(oq===id&&view==="open") render();
}
function octxPrompt(id){
  const o=OBY[id], atts=OA[id]||[], a=atts[atts.length-1], lt="abcdefgh";
  const parts=o.parts.map((p,i)=>`${lt[i]}) [${p.m} marks] ${p.t[L()]}\n   Textbook key points: ${p.k}${a?`\n   Student's answer: ${(a.a[i]||"(blank)")}\n   Score: ${a.g.parts[i]?a.g.parts[i].score:0}/${p.m}`:""}`).join("\n");
  return `You are a patient, expert tutor for the WSET Level 3 Award in Wines. The student is revising from the official WSET Level 3 textbook "Understanding Wines: Explaining Style and Quality". They have just written an answer to the exam-style open question below, which was marked by an examiner, and now want to discuss it with you.

How to answer:
- Always reply in ${CLN[lang]}.
- Stay within what the WSET Level 3 course teaches, using its terminology. If you add something beyond the textbook, say so briefly. If unsure what the textbook says, say so rather than guessing.
- Help the student write better exam answers: one creditable point per sentence, with the reason (the "why"). Use concrete examples.
- Be concise: usually 80–200 words, short paragraphs or a short list, **bold** sparingly, no headings or tables, unless asked for more.
- If the student asks something unrelated to wine, gently bring them back to their revision.

The question (topic: ${o.c==="cmp"?"cross-topic comparison":CH[o.c].en}): ${o.q[L()]}
${parts}
${a&&a.g.feedback?`\nExaminer's overall feedback: ${a.g.feedback}`:""}

The conversation with the student follows.`;
}
document.getElementById("main").addEventListener("click",e=>{
  if(view!=="open"||quiz) return;
  const b=e.target.closest("[data-oq]"); if(b){openQ(b.dataset.oq);return}
  if(e.target.closest("#o-rand")){const pool=OPEN.filter(o=>!oCh||o.c===oCh); const fresh=pool.filter(o=>!(OA[o.id]&&OA[o.id].length)); const src=fresh.length?fresh:pool; if(src.length) openQ(src[Math.floor(Math.random()*src.length)].id);}
});
document.getElementById("main").addEventListener("change",e=>{ if(e.target.id==="o-ch"){oCh=e.target.value;render();} });
"""
JS = JS.replace('__OPEN__', ojs)
rep('\n/* ---------- quiz ---------- */', JS + '\n/* ---------- quiz ---------- */')

open(src, 'w').write(h)
print('patched OK')
