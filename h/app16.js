/* ---------- v79: browse back through the questions already answered in a quiz ---------- */
Object.assign(T.it,{qvPrev:"Precedente",qvNext:"Successiva",qvBackTo:"Torna alla domanda in corso"});
Object.assign(T.fr,{qvPrev:"Précédente",qvNext:"Suivante",qvBackTo:"Revenir à la question en cours"});
Object.assign(T.en,{qvPrev:"Previous",qvNext:"Next",qvBackTo:"Back to the current question"});
const _renderQ16=renderQ;
renderQ=function(){ let h=_renderQ16(); try{ if(!quiz||quiz.done) return h; const i=quiz.i, it=quiz.items[i]; const cur=quiz.items.findIndex(x=>x.pick===null); const front=cur<0?quiz.items.length-1:cur;
  const nav=`<div class="qvnav">${i>0?`<button type="button" class="qvb" data-qv="-1">◀ ${esc(t("qvPrev"))}</button>`:"<span></span>"}${(cur<0?i<front:i<front-1)?`<button type="button" class="qvb cur" data-qv="cur">${esc(t("qvBackTo"))} ▶▶</button>`:""}</div>`;
  h=h.replace('<div class="prog">',nav+'<div class="prog">'); }catch(e){} return h; };
document.addEventListener("click",e=>{ const b=e.target.closest&&e.target.closest("[data-qv]"); if(!b||!quiz) return; e.preventDefault(); e.stopPropagation();
  if(b.dataset.qv==="-1"&&quiz.i>0){ quiz.i--; }
  else if(b.dataset.qv==="cur"){ const cur=quiz.items.findIndex(x=>x.pick===null); quiz.i=cur<0?quiz.items.length-1:cur; }
  render(); window.scrollTo(0,0); },true);
try{ const st20=document.createElement("style"); st20.textContent=`
.qvnav{display:flex;justify-content:space-between;gap:8px;margin:6px 0 8px}
.qvb{border:1px solid var(--line,#eadfce);background:var(--surface,#fff);color:#7a1d3a;border-radius:999px;padding:7px 14px;font:800 .82rem var(--f-body,system-ui);cursor:pointer}
.qvb.cur{background:#7a1d3a;color:#fff;border-color:#7a1d3a;margin-left:auto}
`; document.head.appendChild(st20); }catch(e){}
