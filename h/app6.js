/* ---------- v51: open questions laid out like the WSET Level 3 exam paper (headings, rubrics, points column, wine labels) ---------- */
Object.assign(T.it,{oxTag:"Formato esame",oxQ:"Domanda",oxPts:"punti",oxTot:"Totale",oxWine:"Vino",oxFilter:"Domande in formato esame (25 punti)"});
Object.assign(T.fr,{oxTag:"Format examen",oxQ:"Question",oxPts:"points",oxTot:"Total",oxWine:"Vin",oxFilter:"Questions au format examen (25 points)"});
Object.assign(T.en,{oxTag:"Exam format",oxQ:"Question",oxPts:"points",oxTot:"Total",oxWine:"Wine",oxFilter:"Exam-format questions (25 points)"});
const OFS="\u001F";
function oSplit(v,n){ const a=String(v||"").split(OFS); while(a.length<n) a.push(""); return a.slice(0,n); }
function oKey(p,l){ return Array.isArray(p.k)?p.k[l]:p.k; }
function oAnsText(p,v,l){ if(!p.f) return String(v||""); const a=oSplit(v,p.f[l].length); return p.f[l].map((f,j)=>a[j].trim()?f+": "+a[j].trim():"").filter(Boolean).join("\n"); }
function oLetter(p,i){ return p.n||"abcdefgh"[i]; }
function oLabels(o){ if(!o.lab) return ""; return `<div class="olabs">${o.lab.map((L_,j)=>`<figure class="olab"><figcaption>${esc(t("oxWine"))} ${"AB"[j]||j+1}</figcaption><div class="olabc">${L_.map((x,k)=>`<span class="${k===0?"l0":/^[A-Z ÀÉÈ']+$/.test(x)&&x.length>3?"lc":"ls"}">${esc(x)}</span>`).join("")}</div></figure>`).join("")}</div>`; }
function oPartHTML(p,i,val,ro,da){ const l=L(); const head=`<div class="ph"><b>${oLetter(p,i)}. ${esc(p.t[l])}</b></div>`;
  let body;
  if(p.f){ const a=oSplit(val,p.f[l].length); body=`<div class="ofl">${p.f[l].map((f,j)=>`<label class="ofld"><span>${esc(f)}</span><textarea ${da}="${i}" data-fi="${j}" rows="${/description|descrizione|raisons|ragioni|reasons|arômes|aromi|aromas/i.test(f)?3:2}" ${ro?"readonly":""}>${esc(a[j])}</textarea></label>`).join("")}</div>`; }
  else body=`<textarea ${da}="${i}" ${ro?"readonly":""} aria-label="${oLetter(p,i)}">${esc(val||"")}</textarea>`;
  return `<div class="opart oxp"><div class="oxm">${head}${body}<span class="wc" data-wc="${i}">${wcount(String(val||"").split(OFS).join(" "))} ${t("oWords")}</span></div><div class="oxpts"><span>${p.m}</span><small>${t("oxPts")}</small></div></div>`; }
function oCollect(container,da,i,p){ if(!p.f) return container.querySelector(`[${da}="${i}"]`).value; return [...container.querySelectorAll(`[${da}="${i}"]`)].sort((a,b)=>a.dataset.fi-b.dataset.fi).map(x=>x.value).join(OFS); }
function keysBox(o){ const l=L(); return `<details class="model"><summary>${t("oKeys")}</summary><div class="mb">${o.parts.map((p,i)=>`<p><b>${oLetter(p,i)}) [${p.m}]</b> ${esc(oKey(p,l))}</p>`).join("")}</div></details>`; }
function gradePrompt(o,ans){
  const lt="abcdefgh";
  ans=ans.map((v,i)=>o.parts[i]?oAnsText(o.parts[i],v,L()):v);
  const parts=o.parts.map((p,i)=>`PART ${lt[i]})${p.n?" (exam sub-question "+p.n+")":""} [${p.m} marks] ${p.t[2]}${p.f?"\nThe answer is written under these headings: "+p.f[2].join(" / "):""}
Textbook key points (guide, not exhaustive): ${oKey(p,2)}
STUDENT ANSWER ${lt[i]}):
"""
${(ans[i]||"").trim()||"(blank)"}
"""`).join("\n\n");
  return `You are a strict but fair examiner for the WSET Level 3 Award in Wines, marking a short written answer. The syllabus is the WSET Level 3 textbook "Understanding Wines: Explaining Style and Quality".

QUESTION (chapter: ${o.c==="cmp"?"cross-topic":CH[o.c].en}): ${o.q[2]}${o.lab?"\nWine labels shown to the student: "+o.lab.map((x,j)=>"Wine "+"AB"[j]+" = "+x.join(" / ")).join("; "):""}

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
function renderOQ(){
  const o=OBY[oq], l=L(), atts=OA[oq]||[], pend=OPEND&&OPEND.id===oq;
  let sel=oSel[oq]; if(sel===undefined) sel=atts.length&&!ODR[oq]?atts.length-1:-1;
  const att=sel>=0?atts[sel]:null, ans=att?att.a:(ODR[oq]||[]), ro=!!att||pend;
  const parts=o.parts.map((p,i)=>oPartHTML(p,i,ans[i],ro,"data-pi")).join("");
  const prev=atts.length?`<div class="prev"><span class="label">${t("oAttempts")}</span>${atts.map((x,i)=>`<button data-att="${i}" aria-pressed="${i===sel}">${fmtD(x.ts)} · ${oPct(x)} %</button>`).join("")}<button data-att="-1" aria-pressed="${sel===-1}">+ ${t("oNew")}</button></div>`:"";
  const off=chatOff||sampleFn===null;
  const actions=att?"":(pend?`<div class="row"><span class="muted">${t("oGrading")}</span><button class="btn" id="o-stop">${t("stop")}</button></div>`
    :`<div class="row"><button class="btn primary" id="o-grade" ${off?"disabled":""}>${t("oGrade")}</button><span class="muted" style="font-size:.8rem">${t("oDraft")}</span></div>${off?`<p class="muted" style="font-size:.85rem;margin:0">${t("oOff")}</p>${keysBox(o)}`:""}`);
  return `<section class="view"><div class="qhead"><span class="label">${t("mOpen")}</span><button class="btn ghost" id="o-back">${t("oBack")}</button></div>
  <div class="card oxpaper" style="display:flex;flex-direction:column;gap:14px"><div class="row" style="gap:6px"><span class="tag">${esc(chName(o.c))}</span>${o.x?`<span class="tag">${t("oxTag")}</span>`:""}${oPages(o)?`<span class="pref">${t("page")} ${oPages(o)}</span>`:""}</div>
  <p class="oxh">${t("oxQ").toUpperCase()} (${omax(o)} ${t("oxPts").toUpperCase()})</p>
  <p class="oxstem">${esc(o.q[l])}</p>${oLabels(o)}${prev}${parts}
  <div class="oxtot"><span>${t("oxTot")} ${omax(o)} ${t("oxPts")}</span></div>
  <p class="chat-err small" id="o-err" aria-live="polite">${esc(oMsg)}</p>${actions}
  ${att?gradeView(att,o):""}
  ${atts.length?chatBox("o_"+oq):""}</div></section>`;
}
function bindOQ(){
  $("#o-back").onclick=()=>{oq=null;oMsg="";render()};
  const o=OBY[oq];
  document.querySelectorAll(".opart textarea[data-pi]").forEach(ta=>{ if(ta.readOnly) return; ta.oninput=()=>{const i=+ta.dataset.pi; const d=ODR[oq]||(ODR[oq]=[]); d[i]=oCollect(document,"data-pi",i,o.parts[i]); saveDraft(); const w=document.querySelector(`[data-wc="${i}"]`); if(w) w.textContent=wcount(d[i].split(OFS).join(" "))+" "+t("oWords");}; });
  document.querySelectorAll("[data-att]").forEach(b=>b.onclick=()=>{oSel[oq]=+b.dataset.att; oMsg=""; render()});
  const g=$("#o-grade"); if(g) g.onclick=()=>gradeOpen(oq);
  const s=$("#o-stop"); if(s) s.onclick=()=>OPEND&&OPEND.ctl.abort();
  window.scrollTo(0,0);
}
try{ const st=document.createElement("style"); st.textContent=`
.oxh{margin:0;font-weight:700;letter-spacing:.04em;font-size:.95rem}
.oxstem{margin:0;font-weight:700}
.opart.oxp{display:grid;grid-template-columns:minmax(0,1fr) 62px;border:1px solid var(--line);border-radius:8px;overflow:hidden;padding:0;gap:0}
.opart.oxp .oxm{padding:12px 14px;display:flex;flex-direction:column;gap:8px;min-width:0}
.opart.oxp .ph b{font-weight:600}
.oxpts{background:color-mix(in srgb,var(--fg) 9%,transparent);display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding-top:12px;font-family:var(--f-mono)}
.oxpts span{font-size:1.15rem;font-weight:700}.oxpts small{font-size:.68rem;opacity:.75}
.ofl{display:flex;flex-direction:column;gap:10px}.ofld{display:flex;flex-direction:column;gap:4px}.ofld>span{font-size:.85rem;font-weight:600}
.ofld textarea{min-height:0}
.oxtot{display:flex;justify-content:flex-end;font-weight:700;font-family:var(--f-mono)}
.olabs{display:flex;flex-wrap:wrap;gap:16px;justify-content:center}
.olab{margin:0;display:flex;flex-direction:column;align-items:center;gap:6px;flex:1 1 200px;max-width:260px}
.olab figcaption{font-weight:700;font-size:.9rem}
.olabc{width:100%;border:3px double var(--fg);border-radius:6px;padding:14px 12px;text-align:center;display:flex;flex-direction:column;gap:6px;background:var(--surface);font-family:Georgia,"Times New Roman",serif}
.olabc .l0{font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;opacity:.8}.olabc .lc{font-size:1.05rem;font-weight:700;letter-spacing:.04em}.olabc .ls{font-style:italic;font-size:.85rem}
@media (max-width:520px){.opart.oxp{grid-template-columns:minmax(0,1fr) 46px}}
`; document.head.appendChild(st); }catch(e){}
