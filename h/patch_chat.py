import re,sys
F=sys.argv[1]
s=open(F,encoding="utf8").read()
def rep(old,new,count=1):
    global s
    assert s.count(old)==count, (old[:80], s.count(old))
    s=s.replace(old,new)

# CSS
rep(".expl.fb.no{border-left-color:var(--bad);background:var(--bad-soft)}\n",
""".expl.fb.no{border-left-color:var(--bad);background:var(--bad-soft)}
.chat{border:1px solid var(--line);border-radius:var(--r);background:var(--sunk);padding:14px;display:flex;flex-direction:column;gap:10px;max-width:68ch}
.chat-h{display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap}
.chat .small{font-size:.8rem;margin:0}
.msgs{display:flex;flex-direction:column;gap:8px}
.msgs:empty{display:none}
.msg{display:flex;flex-direction:column;gap:3px;border-radius:9px;padding:9px 12px;max-width:100%}
.msg.u{background:var(--accent-soft);align-self:flex-end;max-width:88%}
.msg.a{background:var(--surface);border:1px solid var(--line)}
.msg .who{font-size:.7rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--muted)}
.msg .mt{font-size:.92rem;line-height:1.5;overflow-wrap:anywhere}
.msg .mt p{margin:0 0 6px}.msg .mt p:last-child{margin:0}
.msg .mt ul{margin:2px 0 6px;padding-left:20px}
.sugg{display:flex;flex-wrap:wrap;gap:6px}
.chip{border:1px solid var(--line);background:var(--surface);border-radius:999px;padding:6px 11px;font-size:.82rem;text-align:left}
.chip:hover{border-color:var(--accent)}
.chat-in{display:flex;gap:8px;align-items:flex-end}
.chat-in textarea{flex:1;min-width:0;resize:vertical;font:inherit;font-size:.92rem;border:1px solid var(--line);border-radius:8px;padding:9px 11px;background:var(--surface);color:var(--fg)}
.chat-in textarea:focus{outline:2px solid var(--accent);outline-offset:0;border-color:var(--accent)}
.chat-err{color:var(--bad)}.chat-err:empty{display:none}
.tag.chat-t{background:var(--accent-soft);color:var(--accent);border-color:transparent}
""")

# strings
rep("/* ---------- state ---------- */",
"""Object.assign(T.it,{chatTitle:"Approfondisci con l'IA",chatHint:"Chiedi quello che vuoi su questo argomento, che tu abbia risposto bene o male. La conversazione resta salvata insieme alla domanda.",chatPh:"Scrivi la tua domanda… (Invio per inviare, Maiusc+Invio per andare a capo)",send:"Invia",stop:"Ferma",thinking:"Sto pensando…",chatOff:"La chat con l'IA non è disponibile qui: apri la pagina su claude.ai e consenti l'uso di Claude quando te lo chiede.",chatErr:"La risposta si è interrotta. Riprova tra poco.",chatRate:"Troppe richieste o limite di utilizzo raggiunto: riprova più tardi.",chatSaved:"Conversazione salvata",chatYou:"Tu",chatAI:"IA",chatTag:"Chat IA",sug1:"Spiegamelo meglio, con il perché",sug2:"Perché le altre risposte sono sbagliate?",sug3:"Collegalo ad altri argomenti che possono uscire all'esame"});
Object.assign(T.fr,{chatTitle:"Approfondir avec l'IA",chatHint:"Posez toutes vos questions sur ce sujet, que vous ayez répondu juste ou non. La conversation reste enregistrée avec la question.",chatPh:"Écrivez votre question… (Entrée pour envoyer, Maj+Entrée pour aller à la ligne)",send:"Envoyer",stop:"Arrêter",thinking:"Réflexion…",chatOff:"Le chat avec l'IA n'est pas disponible ici : ouvrez la page sur claude.ai et autorisez Claude quand on vous le demande.",chatErr:"La réponse s'est interrompue. Réessayez dans un instant.",chatRate:"Trop de demandes ou limite d'utilisation atteinte : réessayez plus tard.",chatSaved:"Conversation enregistrée",chatYou:"Vous",chatAI:"IA",chatTag:"Chat IA",sug1:"Explique-moi mieux, avec le pourquoi",sug2:"Pourquoi les autres réponses sont-elles fausses ?",sug3:"Relie ce point à d'autres sujets qui peuvent tomber à l'examen"});
Object.assign(T.en,{chatTitle:"Dig deeper with AI",chatHint:"Ask anything about this topic, whether you got it right or wrong. The conversation stays saved with the question.",chatPh:"Type your question… (Enter to send, Shift+Enter for a new line)",send:"Send",stop:"Stop",thinking:"Thinking…",chatOff:"The AI chat isn't available here: open the page on claude.ai and allow Claude when asked.",chatErr:"The answer was cut off. Try again in a moment.",chatRate:"Too many requests or usage limit reached: try again later.",chatSaved:"Conversation saved",chatYou:"You",chatAI:"AI",chatTag:"AI chat",sug1:"Explain it better, with the why",sug2:"Why are the other answers wrong?",sug3:"Link it to other topics that could come up in the exam"});

/* ---------- state ---------- */""")

# connect: chats collection
rep("""    docRef=db.doc("data/users/"+uid+"/progress");""",
"""    docRef=db.doc("data/users/"+uid+"/progress");
    chatCol=db.collection("data/users/"+uid); loadChats();""")

# chat module before quiz section
rep("/* ---------- quiz ---------- */",
r"""/* ---------- AI chat ---------- */
const LSC="wset3-chats-v1";
let CHATS=(()=>{try{const x=JSON.parse(lsGet(LSC)||"{}");return x&&typeof x==="object"?x:{}}catch(e){return {}}})();
let chatCol=null, sampleFn, chatOff=false;
const CPEND={};
const CLN={it:"Italian",fr:"French",en:"English"};
const sampleReady=(async()=>{try{if(!window.claude||!window.claude.use){sampleFn=null}else{sampleFn=await window.claude.use("sample")}}catch(e){sampleFn=null}
  if(!sampleFn){chatOff=true;document.querySelectorAll(".chat[data-q]").forEach(el=>rerenderChat(el.dataset.q))}})();
const chatDocId=id=>"chat-"+id;
function saveChat(id){ lsSet(LSC,JSON.stringify(CHATS)); if(chatCol&&CHATS[id]){ chatCol.doc(chatDocId(id)).set({q:id,m:CHATS[id]}).catch(()=>{}); } }
async function loadChats(){
  try{
    const snap=await chatCol.limit(1000).get(); const remote={};
    snap.docs.forEach(d=>{const x=d.data(); if(d.id.startsWith("chat-")&&x&&Array.isArray(x.m)) remote[d.id.slice(5)]=x.m;});
    const ids=new Set([...Object.keys(CHATS),...Object.keys(remote)]);
    ids.forEach(id=>{const a=CHATS[id]||[],b=remote[id]||[],seen=new Set();
      CHATS[id]=[...a,...b].filter(x=>{const k=x.r+x.ts;if(seen.has(k))return false;seen.add(k);return true}).sort((x,y)=>x.ts-y.ts);
      if(CHATS[id].length!==b.length&&!CPEND[id]) chatCol.doc(chatDocId(id)).set({q:id,m:CHATS[id]}).catch(()=>{});});
    lsSet(LSC,JSON.stringify(CHATS));
    document.querySelectorAll(".chat[data-q]").forEach(el=>{if(!CPEND[el.dataset.q]) rerenderChat(el.dataset.q)});
  }catch(e){}
}
function md(s){
  const h=esc(String(s).replace(/^#{1,4}\s*/gm,"")).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>");
  return h.split(/\n{2,}/).map(p=>{const ls=p.split("\n").filter(l=>l.trim());
    if(ls.length&&ls.every(l=>/^\s*([-*•]|\d+[.)])\s/.test(l))) return "<ul>"+ls.map(l=>"<li>"+l.replace(/^\s*([-*•]|\d+[.)])\s/,"")+"</li>").join("")+"</ul>";
    return "<p>"+p.trim().replace(/\n/g,"<br>")+"</p>"}).join("");
}
function bubble(r,txt,pending){return `<div class="msg ${r==="u"?"u":"a"}${pending?" pending":""}"><span class="who">${r==="u"?t("chatYou"):t("chatAI")}</span><div class="mt">${pending&&!txt?`<span class="muted">${t("thinking")}</span>`:md(txt)}</div></div>`}
function chatBox(id){
  const h=CHATS[id]||[], pd=CPEND[id];
  const msgs=h.map(m=>bubble(m.r,m.t)).join("")+(pd?bubble("a",pd.text,true):"");
  const sugg=!h.length&&!pd&&!chatOff?`<div class="sugg">${["sug1","sug2","sug3"].map(k=>`<button class="chip" data-sug="${k}">${esc(t(k))}</button>`).join("")}</div>`:"";
  const input=chatOff?`<p class="muted small">${t("chatOff")}</p>`:`<div class="chat-in"><textarea rows="2" aria-label="${esc(t("chatTitle"))}" placeholder="${esc(t("chatPh"))}" ${pd?"disabled":""}></textarea><button class="btn primary" data-send ${pd?"hidden":""}>${t("send")}</button><button class="btn" data-stop ${pd?"":"hidden"}>${t("stop")}</button></div><p class="chat-err small" aria-live="polite"></p>`;
  if(chatOff&&!h.length) return `<div class="chat" data-q="${id}"><span class="label">${t("chatTitle")}</span>${input}</div>`;
  return `<div class="chat" data-q="${id}"><div class="chat-h"><span class="label">${t("chatTitle")}</span>${h.length?`<span class="muted small">${t("chatSaved")}</span>`:""}</div>${h.length||pd?"":`<p class="muted small">${t("chatHint")}</p>`}<div class="msgs">${msgs}</div>${sugg}${input}</div>`;
}
function rerenderChat(id,focus){
  document.querySelectorAll(`.chat[data-q="${id}"]`).forEach(el=>{const ta=el.querySelector("textarea"),v=ta?ta.value:"";
    const w=document.createElement("div"); w.innerHTML=chatBox(id); const n=w.firstElementChild; el.replaceWith(n);
    const nt=n.querySelector("textarea"); if(nt){nt.value=v; if(focus) nt.focus({preventScroll:true});}});
}
function lastPick(id){
  if(quiz&&!quiz.done){const x=quiz.items.find(x=>x.id===id&&x.pick!==null); if(x) return x.pick;}
  if(quiz&&quiz.done){const x=quiz.items.find(x=>x.id===id&&x.pick!==null); if(x) return x.pick;}
  const e=P.e[id]; if(e) return e.r?0:e.w; const q=P.q[id]; return q&&q[1]?0:null;
}
function ctxPrompt(id){
  const b=BY[id], l=L(), pk=lastPick(id), lt="ABCD";
  const opts=b.o.map((o,i)=>`${lt[i]}) ${o[l]}${i===0?"   <- correct answer":""}`).join("\n");
  const stu=pk===null?"(not recorded)":`${lt[pk]}) ${b.o[pk][l]} — ${pk===0?"CORRECT":"WRONG"}`;
  return `You are a patient, expert tutor for the WSET Level 3 Award in Wines. The student is revising from the official WSET Level 3 textbook "Understanding Wines: Explaining Style and Quality". They have just answered the multiple-choice practice question below and now want to explore the topic in a free conversation with you.

How to answer:
- Always reply in ${CLN[lang]}.
- Stay within what the WSET Level 3 course teaches, using its terminology (including the Systematic Approach to Tasting where relevant). If you add something that goes beyond the textbook, say so briefly, so the student knows it is not core exam material. If you are not sure the textbook says something, say so rather than guessing.
- Explain causes and effects (the "why"): this is what the WSET Level 3 written answers reward. Use concrete examples: regions, grape varieties, wine styles, winemaking choices.
- Be concise: usually 80–200 words, in short paragraphs or a short list. Use **bold** sparingly. No headings and no tables. Go longer only if the student asks for more detail.
- If the student asks something unrelated to wine, gently bring them back to their revision.

The question (chapter: ${CH[b.c].en}; textbook page ${b.p}${b.h?"; advanced question":""}):
${b.q[l]}

Options:
${opts}

The student's answer: ${stu}

Explanation already shown to the student:
${ex(b)}

The conversation with the student follows.`;
}
async function chatSend(id,text){
  text=(text||"").trim(); if(!text||CPEND[id]) return;
  const box=()=>document.querySelector(`.chat[data-q="${id}"]`);
  CPEND[id]={text:"",ctl:new AbortController()};
  const h=CHATS[id]=CHATS[id]||[]; const um={r:"u",t:text,ts:Date.now()}; h.push(um);
  rerenderChat(id);
  if(sampleFn===undefined) await sampleReady;
  if(!sampleFn){delete CPEND[id]; h.splice(h.indexOf(um),1); if(!h.length) delete CHATS[id]; chatOff=true; rerenderChat(id); return}
  saveChat(id);
  const turns=[{role:"user",content:ctxPrompt(id)},...h.slice(-24).map(m=>({role:m.r==="u"?"user":"assistant",content:m.t}))];
  while(turns.length>1&&turns[1].role==="assistant") turns.splice(1,1);
  const pd=CPEND[id];
  try{
    const r=await sampleFn(turns,{cache:false,signal:pd.ctl.signal,onText:({text})=>{pd.text=text;const mt=box()?.querySelector(".msg.pending .mt");if(mt) mt.innerHTML=md(text);}});
    delete CPEND[id]; h.push({r:"a",t:r.text+(r.truncated?" …":""),ts:Date.now()}); saveChat(id); rerenderChat(id,true);
  }catch(e){
    const c=e&&e.code, part=e&&e.text; delete CPEND[id];
    if(part&&c!=="refused"){h.push({r:"a",t:part+" …",ts:Date.now()}); saveChat(id);}
    else {h.splice(h.indexOf(um),1); if(!h.length) delete CHATS[id]; saveChat(id);}
    if(["not_granted","sampling_disabled","not_declared","capability_disabled","capability_removed"].includes(c)) chatOff=true;
    rerenderChat(id);
    const el=box(); if(el){ if(!part&&c!=="refused"){const ta=el.querySelector("textarea"); if(ta) ta.value=text;}
      const er=el.querySelector(".chat-err"); if(er&&c!=="cancelled") er.textContent=t(c==="rate_limited"?"chatRate":"chatErr"); }
  }
}
document.getElementById("main").addEventListener("click",e=>{
  const ch=e.target.closest(".chat"); if(!ch) return; const id=ch.dataset.q;
  if(e.target.closest("[data-send]")){const ta=ch.querySelector("textarea"); const v=ta.value; ta.value=""; chatSend(id,v);}
  else if(e.target.closest("[data-stop]")){CPEND[id]?.ctl.abort();}
  else { const s=e.target.closest("[data-sug]"); if(s) chatSend(id,t(s.dataset.sug)); }
});
document.getElementById("main").addEventListener("keydown",e=>{
  if(e.target.tagName==="TEXTAREA"&&e.key==="Enter"&&!e.shiftKey&&!e.isComposing){const ch=e.target.closest(".chat"); if(ch){e.preventDefault(); const v=e.target.value; e.target.value=""; chatSend(ch.dataset.q,v);}}
});

/* ---------- quiz ---------- */""")

# renderQ: add chat after feedback
rep("""  <div class="choices">${choices}</div>${fb}
""","""  <div class="choices">${choices}</div>${fb}${answered?chatBox(b.id):""}
""")
# errors list
rep("""<span class="pref">${t("page")} ${b.p} · ${t("first")} ${fmtD(e.f)}</span></div></div></details>`}).join("");""",
"""<span class="pref">${t("page")} ${b.p} · ${t("first")} ${fmtD(e.f)}</span></div>${chatBox(id)}</div></details>`}).join("");""")
rep("""<span>${t("last")} ${fmtD(e.l)}</span>${e.r&&e.rt?`<span>${t("fixedOn")} ${fmtD(e.rt)}</span>`:""}</span>""",
"""<span>${t("last")} ${fmtD(e.l)}</span>${e.r&&e.rt?`<span>${t("fixedOn")} ${fmtD(e.rt)}</span>`:""}${CHATS[id]&&CHATS[id].length?`<span class="tag chat-t">${t("chatTag")}</span>`:""}</span>""")
# results list
rep("""<div class="expl"><span>${esc(ex(b))}</span><span class="pref">${t("page")} ${b.p}</span></div></div></details>`}).join("");""",
"""<div class="expl"><span>${esc(ex(b))}</span><span class="pref">${t("page")} ${b.p}</span></div>${chatBox(b.id)}</div></details>`}).join("");""")
# keyboard: ignore typing in textarea
rep("""  if(!quiz||quiz.done||e.target.tagName==="SELECT"||e.metaKey""","""  if(!quiz||quiz.done||e.target.tagName==="SELECT"||e.target.tagName==="TEXTAREA"||e.target.tagName==="INPUT"||e.metaKey""")
open(F,"w",encoding="utf8").write(s)
print("ok")
