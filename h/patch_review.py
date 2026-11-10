import json
h = open('live.html').read()
def rep(a, b, c=1):
    global h
    assert h.count(a) == c, (a[:90], h.count(a)); h = h.replace(a, b)
rep('let view="home", quiz=null, errFilter="active", errCh="",', 'let view="home", quiz=null, errFilter="active", errCh="", revTab="err", okFilter="all", okCh="",')
rep('function renderErrors(){\n', '''function okIds(){ return Object.keys(P.q).filter(id=>BY[id]&&P.q[id][1]>0); }
function okKind(id){ const e=P.e[id]; return !e?"always":e.r?"fixed":"shaky"; }
function revSwitch(){ const ne=Object.keys(P.e).filter(id=>BY[id]).length, no=okIds().length;
  return `<div class="seg revsw" role="tablist"><button data-rt="err" aria-pressed="${revTab==="err"}">✗ ${t("revWrong")} · ${ne}</button><button data-rt="ok" aria-pressed="${revTab==="ok"}">✓ ${t("revRight")} · ${no}</button></div>`; }
function renderCorrect(){
  const ids=okIds(), cnt=k=>ids.filter(id=>okKind(id)===k).length;
  let list=ids.filter(id=>okFilter==="all"||okKind(id)===okFilter).filter(id=>!okCh||BY[id].c===okCh);
  list.sort((a,b)=>(P.q[b][2]||0)-(P.q[a][2]||0));
  const chOpts=Object.keys(CH).filter(c=>ids.some(id=>BY[id].c===c)).map(c=>`<option value="${c}" ${c===okCh?"selected":""}>${esc(chName(c))}</option>`).join("");
  const tagOf=k=>`<span class="tag ${k==="always"?"okall":k==="fixed"?"fixed":"active"}">${t(k==="always"?"okAlways":k==="fixed"?"okFixed":"okShaky")}</span>`;
  const items=list.map(id=>{const b=BY[id],q=P.q[id],k=okKind(id);
    return `<details class="err okq"><summary><span class="emeta">${tagOf(k)}<span>${esc(chName(b.c))}</span><span class="mono">✓ ${q[1]}/${q[0]}</span><span>${t("last")} ${fmtD(q[2])}</span>${CHATS[id]&&CHATS[id].length?`<span class="tag chat-t">${t("chatTag")}</span>`:""}</span><span style="font-weight:500">${esc(b.q[L()])}</span></summary>
    <div class="ebody"><dl class="ans"><dt>${t("goodAns")}</dt><dd class="g">${esc(optText(b,0))}</dd>${k!=="always"&&P.e[id].w>0?`<dt>${t("okOnceWrong")}</dt><dd class="b">${esc(optText(b,P.e[id].w))}</dd>`:""}</dl>
    <div class="expl"><span>${esc(ex(b))}</span><span class="pref">${t("page")} ${b.p}</span></div>${chatBox(id)}</div></details>`}).join("");
  return `<section class="view">${revSwitch()}<div class="card"><h2>${t("revRightT")}</h2><p class="muted" style="max-width:68ch;font-size:.9rem">${t("okIntro")}</p>
   <div class="row"><button class="btn primary" id="ok-quiz" ${list.length?"":"disabled"}>${t("okRedo")} (${list.length})</button></div></div>
   <div class="filters"><div class="seg" role="group"><button data-of="all" aria-pressed="${okFilter==="all"}">${t("fAll")} · ${ids.length}</button><button data-of="always" aria-pressed="${okFilter==="always"}">${t("okAlways")} · ${cnt("always")}</button><button data-of="fixed" aria-pressed="${okFilter==="fixed"}">${t("okFixed")} · ${cnt("fixed")}</button><button data-of="shaky" aria-pressed="${okFilter==="shaky"}">${t("okShaky")} · ${cnt("shaky")}</button></div>
   <select id="ok-ch"><option value="">${t("allCh")}</option>${chOpts}</select></div>
   <div class="elist">${items||`<div class="empty">${goat("g08")}${t("okNone")}</div>`}</div></section>`;
}
function renderErrors(){
  if(revTab==="ok") return renderCorrect();
''')
rep('  return `<section class="view"><div class="card"><h2>${t("errors")}</h2>', '  return `<section class="view">${revSwitch()}<div class="card"><h2>${t("errors")}</h2>')
rep('''  if(view==="errors"){
''', '''  if(view==="errors"){
    document.querySelectorAll("[data-rt]").forEach(b=>b.onclick=()=>{revTab=b.dataset.rt;render()});
    if(revTab==="ok"){
      document.querySelectorAll("[data-of]").forEach(b=>b.onclick=()=>{okFilter=b.dataset.of;render()});
      $("#ok-ch").onchange=e=>{okCh=e.target.value;render()};
      $("#ok-quiz").onclick=()=>{let a=okIds().filter(id=>okFilter==="all"||okKind(id)===okFilter).filter(id=>!okCh||BY[id].c===okCh); if(a.length) startQuiz(shuffle(a).slice(0,40),"practice",okCh?[okCh]:[])};
      return;
    }
''')
css = '''.revsw{margin:0 0 12px;display:flex;width:100%}.revsw button{flex:1;padding:10px 8px;font-weight:600}
.tag.okall{background:var(--good);color:#fff;border-color:transparent}
details.okq{border-left:4px solid var(--good)}
'''
rep('@media (prefers-reduced-motion:reduce)', css + '@media (prefers-reduced-motion:reduce)')
S = {
 "it": {"revWrong": "Sbagliate", "revRight": "Giuste", "revRightT": "Le mie risposte giuste", "okIntro": "Tutte le domande a cui hai già risposto bene, con risposta e spiegazione del manuale, per ripassarle. «Sempre giusta» = mai sbagliata; «Corretta dopo un errore» = prima sbagliata, poi giusta; «Da consolidare» = l'hai indovinata ma l'ultimo tentativo era sbagliato.", "okAlways": "Sempre giusta", "okFixed": "Corretta dopo un errore", "okShaky": "Da consolidare", "okOnceWrong": "Una volta avevi risposto", "okRedo": "Rifai queste domande", "okNone": "Ancora nessuna risposta giusta qui. Fai un quiz e le ritroverai in questa sezione."},
 "fr": {"revWrong": "Ratées", "revRight": "Réussies", "revRightT": "Mes bonnes réponses", "okIntro": "Toutes les questions auxquelles vous avez déjà bien répondu, avec la réponse et l'explication du manuel, pour les revoir. « Toujours juste » = jamais ratée ; « Corrigée après une erreur » = ratée puis réussie ; « À consolider » = réussie, mais la dernière tentative était fausse.", "okAlways": "Toujours juste", "okFixed": "Corrigée après une erreur", "okShaky": "À consolider", "okOnceWrong": "Vous aviez répondu une fois", "okRedo": "Refaire ces questions", "okNone": "Aucune bonne réponse ici pour l'instant. Faites un quiz et vous les retrouverez dans cette section."},
 "en": {"revWrong": "Wrong", "revRight": "Right", "revRightT": "My correct answers", "okIntro": "Every question you have already answered correctly, with the textbook answer and explanation, so you can review them. “Always right” = never missed; “Fixed after a mistake” = missed, then right; “Needs work” = you got it right once but your last try was wrong.", "okAlways": "Always right", "okFixed": "Fixed after a mistake", "okShaky": "Needs work", "okOnceWrong": "You once answered", "okRedo": "Redo these questions", "okNone": "No correct answers here yet. Take a quiz and you'll find them in this section."}}
rep('/* ---------- state ---------- */', '\n'.join('Object.assign(T.%s,%s);' % (l, json.dumps(S[l], ensure_ascii=False)) for l in S) + '\n/* ---------- state ---------- */')
# tab label: "Ripasso"
for a, b in [('errors:"Mes erreurs"', 'errors:"Mes erreurs"')]: pass
rep('$("#tab-errors span").textContent=t("errors");', '$("#tab-errors span").textContent=t("revTab");')
R = {"it": "Ripasso", "fr": "Révisions", "en": "Review"}
rep('Object.assign(T.it,{"revWrong"', 'Object.assign(T.it,{"revTab":"%s","revWrong"' % R["it"])
rep('Object.assign(T.fr,{"revWrong"', 'Object.assign(T.fr,{"revTab":"%s","revWrong"' % R["fr"])
rep('Object.assign(T.en,{"revWrong"', 'Object.assign(T.en,{"revTab":"%s","revWrong"' % R["en"])
open('live.html', 'w').write(h); print('ok')
