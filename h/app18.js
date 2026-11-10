/* ---------- v100: corrected mistakes are deducted everywhere + live "mistakes left" counter while redoing mistakes ---------- */
Object.assign(T.it,{erLeft:"Errori da correggere",erFixedNow:"Errore corretto! Tolto dalla lista",erStill:"Ancora sbagliata: resta tra gli errori",erSum:"Errori corretti in questo ripasso",erRemain:"Restano da correggere",erNone:"Nessun errore da correggere 🎉"});
Object.assign(T.fr,{erLeft:"Erreurs à corriger",erFixedNow:"Erreur corrigée ! Retirée de la liste",erStill:"Encore fausse : elle reste dans les erreurs",erSum:"Erreurs corrigées pendant cette révision",erRemain:"Encore à corriger",erNone:"Aucune erreur à corriger 🎉"});
Object.assign(T.en,{erLeft:"Mistakes to fix",erFixedNow:"Mistake fixed! Removed from the list",erStill:"Still wrong: it stays in your mistakes",erSum:"Mistakes fixed in this review",erRemain:"Still to fix",erNone:"No mistakes left to fix 🎉"});
/* the "✗ Wrong" tab now counts only mistakes still to fix (fixed ones move to "✓ Right") */
revSwitch=function(){ const ne=activeErrs().length, no=okIds().length;
  return `<div class="seg revsw" role="tablist"><button data-rt="err" aria-pressed="${revTab==="err"}">✗ ${t("revWrong")} · ${ne}</button><button data-rt="ok" aria-pressed="${revTab==="ok"}">✓ ${t("revRight")} · ${no}</button></div>`; };
/* remember which mistakes were still open when a quiz started, so a right answer can be shown as "fixed" */
const _startQuiz18=startQuiz;
startQuiz=function(ids,mode){ const r=_startQuiz18.apply(this,arguments); try{ if(quiz&&!quiz._er0){ quiz._er0=quiz.items.filter(x=>P.e[x.id]&&!P.e[x.id].r).map(x=>x.id); } }catch(e){} return r; };
const _answer18=answer;
answer=function(oi){ try{ if(quiz&&!quiz._er0) quiz._er0=[]; const it=quiz&&quiz.items[quiz.i]; if(it&&it.pick===null&&P.e[it.id]&&!P.e[it.id].r&&!quiz._er0.includes(it.id)) quiz._er0.push(it.id); }catch(e){} return _answer18.apply(this,arguments); };
const _renderQ18=renderQ;
renderQ=function(){ let h=_renderQ18(); try{
  const it=quiz.items[quiz.i], was=(quiz._er0||[]).includes(it.id), answered=it.pick!==null, left=activeErrs().length;
  if(quiz.mode==="errors"||was){
    h=h.replace('<div class="prog">',`<div class="erleft"><span>✗ ${esc(t("erLeft"))}</span><b class="mono">${left}</b></div><div class="prog">`);
    if(answered&&was){ const ok=it.pick===0;
      h=h.replace(/(<div class="expl fb [^"]*">)/,`<div class="erfix ${ok?"ok":"no"}">${ok?"✓ "+esc(t("erFixedNow"))+" · "+left:"✗ "+esc(t("erStill"))}</div>$1`); }
  } }catch(e){} return h; };
const _renderResult18=renderResult;
renderResult=function(){ let h=_renderResult18(); try{
  const ids=quiz._er0||[]; if(quiz.mode!=="errors"&&!ids.length) return h;
  const fixed=quiz.items.filter(x=>ids.includes(x.id)&&x.pick===0).length, left=activeErrs().length;
  const box=`<div class="ersum"><div><b class="mono ok">−${fixed}</b><span>${esc(t("erSum"))}</span></div><div><b class="mono">${left}</b><span>${left?esc(t("erRemain")):esc(t("erNone"))}</span></div></div>`;
  h=h.replace('<div class="row"><button class="btn primary" id="r-again">',box+'<div class="row"><button class="btn primary" id="r-again">');
  }catch(e){} return h; };
try{ const st18=document.createElement("style"); st18.textContent=`
.erleft{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 14px;margin-bottom:8px;border-radius:14px;background:color-mix(in srgb,var(--bad,#c0392b) 9%,var(--surface,#fff));border:1px solid color-mix(in srgb,var(--bad,#c0392b) 25%,transparent);font-weight:800;font-size:.85rem;color:var(--bad,#b0303a)}
.erleft b{font-size:1.15rem;min-width:2ch;text-align:right}
.erfix{padding:10px 14px;border-radius:14px;font-weight:800;font-size:.9rem;animation:gqin .35s ease-out}
.erfix.ok{background:var(--good-soft,#e3f3e6);color:var(--good,#2e7d32)}
.erfix.no{background:color-mix(in srgb,var(--bad,#c0392b) 10%,var(--surface,#fff));color:var(--bad,#b0303a)}
.ersum{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.ersum>div{display:flex;flex-direction:column;gap:2px;padding:10px 14px;border-radius:14px;background:var(--sunk,#f6efe6)}
.ersum b{font-size:1.5rem}.ersum b.ok{color:var(--good,#2e7d32)}.ersum span{font-size:.8rem;color:var(--muted,#7b6a5c);font-weight:700}
`; document.head.appendChild(st18); }catch(e){}
