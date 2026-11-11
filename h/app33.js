/* ---------- v121: Duolingo-style profile — avatar goat, nickname, nationality, country, exam date, school,
   stats (streak, XP, crowns, accuracy), badges; synced to the account and to the public community profile. ---------- */
Object.assign(T.it,{prTitle:"Il mio profilo",prEdit:"Modifica il profilo",prSave:"Salva",prCancel:"Annulla",prNick:"Nome o soprannome",prAvatar:"La tua capretta",prNat:"Nazionalità",prCountry:"Paese in cui vivi",prExam:"Data dell'esame",prSchool:"Scuola o corso",prSchoolPh:"Es. il nome della tua scuola di vino",prNone:"—",
 prJoined:"Iscritta/o da {d}",prExamIn:"Esame tra {n} giorni",prExamToday:"Esame oggi! In bocca al lupo 🍀",prStats:"Statistiche",prStreak:"Giorni di fila",prXp:"XP totali",prCrowns:"Corone",prAcc:"Precisione",prBadges:"Traguardi",prLocked:"Da sbloccare",
 prAcc0:"Crea il profilo per ritrovare tutto su ogni dispositivo e comparire nelle classifiche.",prAccGo:"Crea il profilo o accedi",prSigned:"Collegato come {e}",prOut:"Esci",prSaved:"Profilo salvato ✓",prSee:"Vedi il profilo",
 bd_first:"Prima lezione",bd_s3:"3 giorni di fila",bd_s7:"7 giorni di fila",bd_s30:"30 giorni di fila",bd_q100:"100 risposte",bd_q500:"500 risposte",bd_q1000:"1.000 risposte",bd_c1:"Prima corona",bd_c5:"5 corone",bd_c28:"Tutto il percorso",bd_open:"Prima domanda scritta",bd_mock:"Prima simulazione",bd_chal:"Prima sfida"});
Object.assign(T.fr,{prTitle:"Mon profil",prEdit:"Modifier le profil",prSave:"Enregistrer",prCancel:"Annuler",prNick:"Nom ou pseudo",prAvatar:"Votre chèvre",prNat:"Nationalité",prCountry:"Pays où vous vivez",prExam:"Date de l'examen",prSchool:"École ou cours",prSchoolPh:"Ex. le nom de votre école de vin",prNone:"—",
 prJoined:"Membre depuis {d}",prExamIn:"Examen dans {n} jours",prExamToday:"Examen aujourd'hui ! Bonne chance 🍀",prStats:"Statistiques",prStreak:"Jours d'affilée",prXp:"XP au total",prCrowns:"Couronnes",prAcc:"Précision",prBadges:"Trophées",prLocked:"À débloquer",
 prAcc0:"Créez votre profil pour tout retrouver sur chaque appareil et apparaître dans les classements.",prAccGo:"Créer le profil ou se connecter",prSigned:"Connecté·e : {e}",prOut:"Se déconnecter",prSaved:"Profil enregistré ✓",prSee:"Voir le profil",
 bd_first:"Première leçon",bd_s3:"3 jours d'affilée",bd_s7:"7 jours d'affilée",bd_s30:"30 jours d'affilée",bd_q100:"100 réponses",bd_q500:"500 réponses",bd_q1000:"1 000 réponses",bd_c1:"Première couronne",bd_c5:"5 couronnes",bd_c28:"Tout le parcours",bd_open:"Première question rédigée",bd_mock:"Premier examen blanc",bd_chal:"Premier défi"});
Object.assign(T.en,{prTitle:"My profile",prEdit:"Edit profile",prSave:"Save",prCancel:"Cancel",prNick:"Name or nickname",prAvatar:"Your goat",prNat:"Nationality",prCountry:"Country you live in",prExam:"Exam date",prSchool:"School or course",prSchoolPh:"E.g. the name of your wine school",prNone:"—",
 prJoined:"Joined {d}",prExamIn:"Exam in {n} days",prExamToday:"Exam today! Good luck 🍀",prStats:"Statistics",prStreak:"Day streak",prXp:"Total XP",prCrowns:"Crowns",prAcc:"Accuracy",prBadges:"Achievements",prLocked:"Locked",
 prAcc0:"Create your profile to find everything on every device and appear in the leaderboards.",prAccGo:"Create profile or sign in",prSigned:"Signed in as {e}",prOut:"Sign out",prSaved:"Profile saved ✓",prSee:"See profile",
 bd_first:"First lesson",bd_s3:"3-day streak",bd_s7:"7-day streak",bd_s30:"30-day streak",bd_q100:"100 answers",bd_q500:"500 answers",bd_q1000:"1,000 answers",bd_c1:"First crown",bd_c5:"5 crowns",bd_c28:"Whole path",bd_open:"First written question",bd_mock:"First mock exam",bd_chal:"First challenge"});
const PRK="wset3-profile", PRAV=["n05","n09","n13","g07","n04","dance","g01","n11","n01","n17"];
const PRC="IT FR ES DE GB IE PT NL BE LU CH AT GR PL CZ SK HU RO BG HR SI DK SE NO FI EE LV LT IS MT CY US CA MX BR AR CL CO PE UY VE AU NZ ZA JP KR CN TW HK SG IN TH VN PH MY ID IL TR AE SA QA EG MA TN NG KE RU UA GE AM".split(" ");
let PR=(()=>{ try{ const x=JSON.parse(lsGet(PRK)||"null"); if(x&&typeof x==="object") return x; }catch(e){} return {}; })();
if(!PR.since){ PR.since=Date.now(); try{ lsSet(PRK,JSON.stringify(PR)); }catch(e){} }
let PRED=null, PRMSG="";
const prFlag=c=>c&&c.length===2?String.fromCodePoint(...[...c.toUpperCase()].map(x=>127397+x.charCodeAt(0))):"";
const prCName=c=>{ try{ return new Intl.DisplayNames([lang],{type:"region"}).of(c); }catch(e){ return c; } };
function prNick(){ if(PR.nick) return PR.nick; const e=(window.twgAccount&&twgAccount.email())||""; return e?e.split("@")[0]:"Goat"; }
function prExamISO(){ return PR.exam||(PL&&PL.exam)||""; }
function prStats(){ const C=coach(); let crowns=0; try{ crowns=PWU.filter(paUnitDone).length; }catch(e){}
  return {st:duoStreak(),xp:duoXP(),cr:crowns,acc:C.acc==null?null:C.acc,ans:Object.keys(P.q||{}).length}; }
function prWeekXP(){ const d=new Date(), day=(d.getDay()+6)%7; d.setHours(0,0,0,0); d.setDate(d.getDate()-day); const t0=d.getTime();
  let x=0; (P.s||[]).forEach(s=>{ if(s&&s.t>=t0) x+=5+(+s.c||0)*2; }); try{ Object.values(PW.n||{}).forEach(v=>{ if(v&&v.t>=t0) x+=10; }); }catch(e){} return x; }
function prISOWeek(){ const d=new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate()+3-(d.getDay()+6)%7); const w1=new Date(d.getFullYear(),0,4); return d.getFullYear()+"-W"+String(1+Math.round(((d-w1)/864e5-3+(w1.getDay()+6)%7)/7)).padStart(2,"0"); }
function prBadges(){ const S=prStats(), ss=P.s||[];
  return [["first","🍇",ss.length>0],["s3","🔥",S.st>=3],["s7","🔥",S.st>=7],["s30","🏅",S.st>=30],["q100","💯",S.ans>=100],["q500","🎯",S.ans>=500],["q1000","🧠",S.ans>=1000],
    ["c1","👑",S.cr>=1],["c5","👑",S.cr>=5],["c28","🏆",S.cr>=28],["open","✍️",ss.some(s=>s.m==="open")],["mock","⏱️",ss.some(s=>s.m==="mock")],["chal","🥊",!!PR.chal]]; }
function prSave(){ try{ lsSet(PRK,JSON.stringify(PR)); }catch(e){} prSync(); }
let prSyncT=null;
function prSync(){ clearTimeout(prSyncT); prSyncT=setTimeout(async()=>{ try{ const A=window.twgAccount; if(!A||!A.signedIn()) return; const sb=A.client(), uid=A.uid(); if(!sb||!uid) return;
  const S=prStats();
  await sb.from("user_docs").upsert({user_id:uid,doc_id:"profile",data:PR,updated_at:new Date().toISOString()},{onConflict:"user_id,doc_id"});
  await sb.from("profiles").upsert({user_id:uid,nickname:prNick().slice(0,40),avatar:PR.av||"n05",nationality:PR.nat||null,country:PR.ctry||null,school:(PR.school||"").slice(0,80)||null,
    exam_date:prExamISO()||null,lang,xp_total:S.xp,xp_week:prWeekXP(),week:prISOWeek(),streak:S.st,crowns:S.cr,updated_at:new Date().toISOString()},{onConflict:"user_id"});
}catch(e){} },1500); }
async function prLoad(){ try{ const A=window.twgAccount; if(!A) return; await A.ready; if(!A.signedIn()) return; const sb=A.client(), uid=A.uid();
  const {data}=await sb.from("user_docs").select("data").eq("user_id",uid).eq("doc_id","profile").maybeSingle();
  if(data&&data.data){ PR=Object.assign({},data.data,PR.nick?PR:{}); PR.since=Math.min(PR.since||Date.now(),(data.data.since||Date.now())); try{ lsSet(PRK,JSON.stringify(PR)); }catch(e){} if(view==="profile"||view==="me") render(); }
  prSync(); }catch(e){} }
setTimeout(prLoad,1200); window.addEventListener("twg-account",()=>setTimeout(prLoad,400));
function prHead(compact){ const S=prStats(), ex=prExamISO(); const dl=ex?Math.round((new Date(ex+"T12:00")-new Date(dayKey(Date.now())+"T12:00"))/864e5):null;
  const chips=[PR.nat?`${prFlag(PR.nat)} ${esc(prCName(PR.nat))}`:"",PR.ctry&&PR.ctry!==PR.nat?`📍 ${esc(prCName(PR.ctry))}`:"",PR.school?`🎓 ${esc(PR.school)}`:"",dl!=null&&dl>=0?`📅 ${esc(dl===0?t("prExamToday"):t("prExamIn").replace("{n}",dl))}`:""].filter(Boolean);
  return `<div class="prhead${compact?" sm":""}"><div class="prav">${gfree(PR.av||"n05",compact?84:120)}</div><div class="prtx"><h2>${esc(prNick())} ${prFlag(PR.nat)}</h2><p class="prsince">${esc(t("prJoined").replace("{d}",fmtD(PR.since||Date.now())))}</p>
    <div class="prchips">${chips.map(c=>`<span>${c}</span>`).join("")}</div>${compact?`<button type="button" class="prsee" data-go="profile">${esc(t("prSee"))} ▸</button>`:""}</div></div>`; }
function renderProfile(){ const S=prStats(), A=window.twgAccount;
  if(PRED){ const sel=(k,v)=>`<select id="pr-${k}" class="prin"><option value="">${esc(t("prNone"))}</option>${PRC.map(c=>[c,prCName(c)]).sort((a,b)=>a[1].localeCompare(b[1])).map(([c,n])=>`<option value="${c}"${v===c?" selected":""}>${prFlag(c)} ${esc(n)}</option>`).join("")}</select>`;
    return `<section class="view prv"><h1>${esc(t("prEdit"))}</h1>
     <label class="prl">${esc(t("prNick"))}<input id="pr-nick" class="prin" maxlength="40" value="${esc(PRED.nick||"")}" placeholder="${esc(prNick())}"></label>
     <div class="prl">${esc(t("prAvatar"))}<div class="pravs">${PRAV.map(k=>`<button type="button" class="prao${(PRED.av||"n05")===k?" on":""}" data-prav="${k}"><img src="${gsrc(k)}" alt=""></button>`).join("")}</div></div>
     <label class="prl">${esc(t("prNat"))}${sel("nat",PRED.nat)}</label>
     <label class="prl">${esc(t("prCountry"))}${sel("ctry",PRED.ctry)}</label>
     <label class="prl">${esc(t("prExam"))}<input type="date" id="pr-exam" class="prin" value="${esc(PRED.exam||prExamISO())}"></label>
     <label class="prl">${esc(t("prSchool"))}<input id="pr-school" class="prin" maxlength="80" value="${esc(PRED.school||"")}" placeholder="${esc(t("prSchoolPh"))}"></label>
     <div class="row" style="gap:8px"><button type="button" class="pago" data-prsave>${esc(t("prSave"))}</button><button type="button" class="btn" data-prcancel>${esc(t("prCancel"))}</button></div></section>`; }
  const acc=A&&A.enabled()?(A.signedIn()?`<div class="pracc"><span>✅ ${esc(t("prSigned").replace("{e}",A.email()))}</span><button type="button" class="btn sm" data-prout>${esc(t("prOut"))}</button></div>`
     :`<div class="pracc off"><p>${esc(t("prAcc0"))}</p><button type="button" class="pago" data-pracc>${esc(t("prAccGo"))}</button></div>`):"";
  const B=prBadges();
  return `<section class="view prv">${prHead(false)}${PRMSG?`<p class="prmsg">${esc(PRMSG)}</p>`:""}<button type="button" class="btn" data-predit>✏️ ${esc(t("prEdit"))}</button>${acc}
   <h2 class="prh2">${esc(t("prStats"))}</h2><div class="prstats"><div><span>🔥</span><b>${S.st}</b><small>${esc(t("prStreak"))}</small></div><div><span>⚡</span><b>${S.xp}</b><small>${esc(t("prXp"))}</small></div><div><span>👑</span><b>${S.cr}</b><small>${esc(t("prCrowns"))}</small></div><div><span>🎯</span><b>${S.acc==null?"–":S.acc+"%"}</b><small>${esc(t("prAcc"))}</small></div></div>
   <h2 class="prh2">${esc(t("prBadges"))} <span class="muted small">${B.filter(b=>b[2]).length}/${B.length}</span></h2><div class="prbadges">${B.map(([k,ic,ok])=>`<div class="prb${ok?" on":""}" title="${esc(ok?t("bd_"+k):t("prLocked"))}"><span>${ic}</span><small>${esc(t("bd_"+k))}</small></div>`).join("")}</div></section>`; }
try{ TABG.profile="me"; SUBV.profile="me"; SUBT.profile="prTitle"; }catch(e){}
document.addEventListener("click",e=>{ const b=e.target.closest&&e.target.closest("[data-predit],[data-prsave],[data-prcancel],[data-prav],[data-pracc],[data-prout]"); if(!b) return; e.preventDefault(); e.stopPropagation();
  if(b.hasAttribute("data-predit")){ PRED=JSON.parse(JSON.stringify(PR)); PRMSG=""; render(); return; }
  if(b.hasAttribute("data-prcancel")){ PRED=null; render(); return; }
  if(b.dataset.prav){ PRED.av=b.dataset.prav; document.querySelectorAll(".prao").forEach(x=>x.classList.toggle("on",x===b)); return; }
  if(b.hasAttribute("data-prsave")){ const v=id=>(document.getElementById(id)||{}).value||"";
    PR=Object.assign(PR,PRED,{nick:v("pr-nick").trim(),nat:v("pr-nat"),ctry:v("pr-ctry"),exam:v("pr-exam"),school:v("pr-school").trim()});
    if(PR.exam){ try{ const c=plCfg(); PL=Object.assign({goal:c.goal,min:c.min,course:c.course||[],rest:c.rest||[]},PL||{},{exam:PR.exam}); lsSet(PLK,JSON.stringify(PL)); }catch(x){} }
    PRED=null; PRMSG=t("prSaved"); prSave(); render(); setTimeout(()=>{ PRMSG=""; },2500); return; }
  if(b.hasAttribute("data-pracc")){ const A=window.twgAccount; if(A) A.open(); return; }
  if(b.hasAttribute("data-prout")){ const A=window.twgAccount; if(A) A.signOut(); return; } },true);
/* «Io» starts with the profile card */
{ const _rme33=renderMe; renderMe=function(){ const h=_rme33.apply(this,arguments); try{ return h.replace(/(<section[^>]*>)/,"$1"+prHead(true)); }catch(e){ return h; } }; }
/* remember a sent challenge (badge) and keep the community profile fresh after activity */
{ const _cs33=chShare; chShare=function(){ PR.chal=1; prSave(); return _cs33.apply(this,arguments); }; }
{ const _sv33=save; save=function(){ const r=_sv33.apply(this,arguments); prSync(); return r; }; }
try{ const st33=document.createElement("style"); st33.textContent=`
.prv{max-width:640px;margin:0 auto}
.prhead{position:relative;isolation:isolate;overflow:hidden;display:flex;gap:16px;align-items:center;border-radius:24px;padding:18px;margin:0 0 14px;color:#fff;background:radial-gradient(130% 140% at 0% 0%,#a3264f,#7a1838 55%,#3e0f22);box-shadow:0 18px 40px -22px rgba(60,15,30,.6),inset 0 0 0 1px rgba(255,236,200,.22)}
.prhead:before{content:"";position:absolute;inset:7px;border-radius:18px;border:1px solid rgba(255,226,170,.35);pointer-events:none}
.prav{flex:none;width:128px;height:128px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle,rgba(255,232,180,.45),rgba(255,232,180,.08) 70%);overflow:hidden}
.prhead.sm .prav{width:92px;height:92px}
.prtx{flex:1;min-width:0}.prtx h2{margin:0;color:#fff!important;font-size:1.5rem}.prsince{margin:2px 0 8px;color:rgba(255,248,240,.8);font-size:.85rem}
.prchips{display:flex;flex-wrap:wrap;gap:6px}.prchips span{background:rgba(255,255,255,.14);border-radius:999px;padding:4px 10px;font-weight:700;font-size:.82rem}
.prsee{font:inherit;margin-top:10px;border:0;background:#fff;color:#8c1d40;font-weight:900;border-radius:12px;padding:8px 14px;cursor:pointer}
.prh2{margin:22px 0 10px;font-size:1.2rem}
.prstats{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.prstats div{display:grid;grid-template-columns:auto 1fr;grid-template-rows:auto auto;column-gap:10px;align-items:center;padding:12px 14px;border-radius:16px;border:2px solid var(--line,#eadfd4);background:var(--surface,#fff)}
.prstats span{grid-row:1/3;font-size:1.6rem}.prstats b{font-size:1.3rem}.prstats small{color:var(--muted,#7b6a5c);font-weight:700}
.prbadges{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px}
.prb{display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center;padding:12px 6px;border-radius:16px;border:2px solid var(--line,#eadfd4);background:var(--surface,#fff);filter:grayscale(1);opacity:.45}
.prb.on{filter:none;opacity:1;border-color:#d4a23a;background:linear-gradient(180deg,#fffaf0,#fff3d6)}.prb span{font-size:1.8rem}.prb small{font-weight:800;font-size:.72rem;line-height:1.2}
.pracc{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin:12px 0;padding:12px 14px;border-radius:16px;background:var(--sunk,#f6efe6);font-weight:700}
.pracc.off{flex-direction:column;align-items:stretch;text-align:center}.pracc.off p{margin:0;font-weight:500}
.prmsg{font-weight:800;color:#2e7d32}
.prl{display:flex;flex-direction:column;gap:6px;font-weight:800;margin:0 0 14px}
.prin{font:inherit;font-size:16px;font-weight:500;padding:12px 14px;border-radius:14px;border:2px solid var(--line,#eadfd4);background:var(--surface,#fff);color:inherit}
.pravs{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}.prao{border:2px solid var(--line,#eadfd4);border-radius:16px;background:var(--surface,#fff);padding:4px;cursor:pointer;aspect-ratio:1}
.prao img{width:100%;height:100%;object-fit:contain}.prao.on{border-color:#8c1d40;box-shadow:0 0 0 3px rgba(140,29,64,.15)}
@media (max-width:420px){.prav{width:96px;height:96px}.prhead.sm .prav{width:76px;height:76px}}
`; document.head.appendChild(st33); }catch(e){}
