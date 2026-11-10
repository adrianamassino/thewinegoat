/* ---------- v102: AI corrections (feedback, missed points, model answer) always in the app language ---------- */
Object.assign(T.it,{trWait:"Traduzione della correzione in italiano…",trFail:"Traduzione non riuscita: riprova più tardi."});
Object.assign(T.fr,{trWait:"Traduction de la correction en français…",trFail:"La traduction a échoué : réessayez plus tard."});
Object.assign(T.en,{trWait:"Translating the marking into English…",trFail:"Translation failed: please try again later."});
const LGW={it:/\b(il|lo|gli|della|delle|degli|che|non|per|con|una|sono|più|anche|nel|nella|dal|alla)\b/g,
  fr:/\b(le|les|des|du|une|est|pour|avec|dans|sur|pas|plus|qui|aux|ce|cette|sont)\b/g,
  en:/\b(the|and|of|with|which|is|are|this|that|from|for|you|your|not|to|in)\b/g};
function lgDetect(s){ s=" "+String(s||"").toLowerCase()+" "; let best="",bn=0;
  for(const k in LGW){ const n=(s.match(LGW[k])||[]).length; if(n>bn){bn=n;best=k;} } return bn>=3?best:""; }
function gText(g){ return [g.feedback||"",g.model||""].concat((g.parts||[]).map(x=>[x.comment||""].concat(x.hit||[],x.missed||[]).join(" "))).join(" "); }
function gLang(g){ return g.lang||lgDetect(gText(g)); }
/* prompt: put the language rule first AND last, and give the question in the student's language too */
{ const _gp20=gradePrompt; gradePrompt=function(o,ans){ const p=_gp20.apply(this,arguments), Lx=CLN[lang], l=L();
  const head=`LANGUAGE RULE (most important): the student is using the app in ${Lx}. Every string you write in the JSON — "hit", "missed", "comment", "feedback" and "model" — must be written ONLY in ${Lx}, using the natural ${Lx} wine vocabulary (grape and place names stay as they are). The question and key points below are given in English for reference only; do not copy English wording.\n\nQuestion as the student sees it (${Lx}): ${o.q[l]}\n${o.parts.map((pp,i)=>"abcdefgh"[i]+") "+pp.t[l]).join("\n")}\n\n`;
  return head+p+`\n\nReminder: write the whole JSON content in ${Lx} only, including the model answer.`; }; }
{ const _cg20=cleanGrade; cleanGrade=function(o,g){ const r=_cg20.apply(this,arguments); r.lang=lang; return r; }; }
/* old or wrong-language corrections are translated once and cached in the attempt */
const TRP={};
async function trGrade(id,ai,lg){ const k=id+"|"+ai+"|"+lg; if(TRP[k]) return; TRP[k]=1;
  try{
    if(sampleFn===undefined) await sampleReady; if(!sampleFn||typeof sampleFn.json!=="function") throw 0;
    const att=OA[id][ai], g=att.g;
    const src={parts:(g.parts||[]).map(x=>({hit:x.hit||[],missed:x.missed||[],comment:x.comment||""})),feedback:g.feedback||"",model:g.model||""};
    const out=await sampleFn.json(`Translate every string value of this JSON object into ${CLN[lg]} for a wine student. Use natural ${CLN[lg]} wine vocabulary; keep grape varieties, place names, numbers and the a), b)… part labels as they are. Keep exactly the same JSON shape and the same number of items. Reply with ONLY the JSON.\n\n${JSON.stringify(src)}`,{cache:true});
    if(!out||!Array.isArray(out.parts)) throw 0;
    const tr={feedback:String(out.feedback||""),model:String(out.model||""),parts:src.parts.map((x,i)=>{ const y=out.parts[i]||{}; const arr=a=>Array.isArray(a)?a.filter(s=>typeof s==="string").map(s=>s.trim()):[];
      return {hit:arr(y.hit).length?arr(y.hit):x.hit,missed:arr(y.missed).length?arr(y.missed):x.missed,comment:typeof y.comment==="string"?y.comment:x.comment}; })};
    g.tr=g.tr||{}; g.tr[lg]=tr; if(!g.lang) g.lang=lgDetect(gText(g))||"en"; saveOA(id);
  }catch(e){ TRP[k]=2; }
  if(oq===id&&view==="open") render(); }
function gLocal(g,lg){ const t=g.tr&&g.tr[lg]; if(!t) return null;
  return Object.assign({},g,{feedback:t.feedback,model:t.model,parts:(g.parts||[]).map((x,i)=>Object.assign({},x,t.parts[i]||{}))}); }
{ const _gv20=gradeView; gradeView=function(att,o){ try{
    const g=att&&att.g; if(!g) return _gv20.apply(this,arguments);
    const gl=gLang(g);
    if(gl&&gl!==lang){
      const loc=gLocal(g,lang);
      if(loc) return _gv20.call(this,Object.assign({},att,{g:loc}),o);
      const id=o.id, ai=(OA[id]||[]).indexOf(att); const k=id+"|"+ai+"|"+lang;
      if(ai>=0&&!TRP[k]) setTimeout(()=>trGrade(id,ai,lang),0);
      const note=TRP[k]===2?t("trFail"):t("trWait");
      return `<div class="trnote">${TRP[k]===2?"⚠️":"⏳"} ${esc(note)}</div>`+_gv20.apply(this,arguments);
    }
  }catch(e){} return _gv20.apply(this,arguments); }; }
try{ const st20=document.createElement("style"); st20.textContent=`.trnote{padding:10px 14px;border-radius:14px;background:var(--sunk,#f6efe6);font-weight:700;font-size:.88rem;margin-bottom:10px}`; document.head.appendChild(st20); }catch(e){}
/* every AI request (tutor chat, tasting feedback, exam review…) carries the language rule at the start and at the end */
function lgRule(){ return `LANGUAGE: the student uses the app in ${CLN[lang]}. Write your whole answer only in ${CLN[lang]}, with natural ${CLN[lang]} wine vocabulary, never in another language.`; }
function lgWrapInput(input){
  if(typeof input==="string"&&input.includes("Transcribe faithfully")) return input;
  if(typeof input==="string") return lgRule()+"\n\n"+input+"\n\n"+lgRule();
  if(Array.isArray(input)&&input.length){ const a=input.map(m=>Object.assign({},m)); const i=a.length-1;
    if(a[i]&&typeof a[i].content==="string") a[i].content=a[i].content+"\n\n("+lgRule()+")";
    if(a[0]&&typeof a[0].content==="string"&&a.length>1) a[0].content=lgRule()+"\n\n"+a[0].content;
    return a; }
  return input; }
sampleReady.then(()=>{ try{ if(!sampleFn||sampleFn.__lg) return; const base=sampleFn;
  const w=function(input,opts){ return base(lgWrapInput(input),opts); };
  w.json=typeof base.json==="function"?function(input,opts){ return base.json(lgWrapInput(input),opts); }:undefined;
  if(typeof base.limits==="function") w.limits=function(){ return base.limits.apply(base,arguments); };
  w.__lg=1; sampleFn=w; }catch(e){} });
