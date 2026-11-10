/* ---------- v119: «Sfida un amico» — after any quiz, share a link with the same questions and your score;
   the friend plays them and sees who won, then can challenge back. Works without a server. ---------- */
Object.assign(T.it,{chBtn:"Sfida un amico",chMsg:"Ho fatto {s}/{n} su «{c}» con The Wine Goat 🍷🐐 Riesci a battermi?",chCopied:"Link copiato: mandalo a chi vuoi!",chIntro:"Hai ricevuto una sfida! 🥊",chIntroP:"Un amico ha fatto {s}/{n} su «{c}». Stesse domande per te: riesci a fare meglio?",chGo:"Accetta la sfida",
 chWin:"Hai vinto la sfida! 🏆",chLose:"Questa volta ha vinto il tuo amico 💪",chTie:"Pareggio! 🤝",chYou:"Tu",chFriend:"Il tuo amico",chBack:"Rilancia la sfida",chMix:"domande miste"});
Object.assign(T.fr,{chBtn:"Défier un ami",chMsg:"J'ai fait {s}/{n} sur « {c} » avec The Wine Goat 🍷🐐 Tu fais mieux ?",chCopied:"Lien copié : envoyez-le à qui vous voulez !",chIntro:"On vous lance un défi ! 🥊",chIntroP:"Un ami a fait {s}/{n} sur « {c} ». Mêmes questions pour vous : ferez-vous mieux ?",chGo:"Relever le défi",
 chWin:"Défi gagné ! 🏆",chLose:"Cette fois, votre ami a gagné 💪",chTie:"Égalité ! 🤝",chYou:"Vous",chFriend:"Votre ami",chBack:"Relancer le défi",chMix:"questions variées"});
Object.assign(T.en,{chBtn:"Challenge a friend",chMsg:"I scored {s}/{n} on “{c}” with The Wine Goat 🍷🐐 Can you beat me?",chCopied:"Link copied: send it to anyone!",chIntro:"You've been challenged! 🥊",chIntroP:"A friend scored {s}/{n} on “{c}”. Same questions for you: can you do better?",chGo:"Accept the challenge",
 chWin:"You won the challenge! 🏆",chLose:"Your friend won this time 💪",chTie:"It's a tie! 🤝",chYou:"You",chFriend:"Your friend",chBack:"Challenge back",chMix:"mixed questions"});
let CHAL=null, CHIN=null;
const chEnc=o=>btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
const chDec=s=>{ try{ s=s.replace(/-/g,"+").replace(/_/g,"/"); return JSON.parse(decodeURIComponent(escape(atob(s)))); }catch(e){ return null; } };
function chTopic(ids){ const cs=[...new Set(ids.map(id=>BY[id]&&BY[id].c).filter(Boolean))]; return cs.length===1?chName(cs[0]):t("chMix"); }
async function chShare(ids,s){ const n=ids.length, url=location.origin+location.pathname+"#sfida="+chEnc({i:ids,s,v:1});
  const msg=t("chMsg").replace("{s}",s).replace("{n}",n).replace("{c}",chTopic(ids));
  try{ if(navigator.share){ await navigator.share({title:"The Wine Goat",text:msg,url}); return; } }catch(e){ if(e&&e.name==="AbortError") return; }
  try{ await navigator.clipboard.writeText(msg+" "+url); }catch(e){}
  const tst=document.createElement("div"); tst.className="chtoast"; tst.textContent=t("chCopied"); document.body.appendChild(tst); setTimeout(()=>tst.remove(),2600); }
/* incoming challenge */
function chCheck(){ const m=/[#&]sfida=([A-Za-z0-9_-]+)/.exec(location.hash||""); if(!m) return; const o=chDec(m[1]);
  history.replaceState(null,"",location.pathname+location.search);
  if(!o||!Array.isArray(o.i)) return; const ids=o.i.filter(id=>BY[id]).slice(0,20); if(!ids.length) return;
  CHIN={ids,s:+o.s||0}; try{ lsSet("wset3-onb","1"); }catch(e){} view="chal"; render(); }
function renderChal(){ if(!CHIN) return `<section class="view"></section>`;
  return `<section class="view chv"><div class="chcard">${gfree("g07",130)}<h1>${esc(t("chIntro"))}</h1><p>${esc(t("chIntroP").replace("{s}",CHIN.s).replace("{n}",CHIN.ids.length).replace("{c}",chTopic(CHIN.ids)))}</p>
   <button type="button" class="pago" data-chgo>${esc(t("chGo"))} 🥊</button></div></section>`; }
try{ TABG.chal="home"; SUBV.chal="home"; SUBT.chal="chBtn"; }catch(e){}
document.addEventListener("click",e=>{ const b=e.target.closest&&e.target.closest("[data-chgo],[data-chshare]"); if(!b) return; e.preventDefault(); e.stopPropagation();
  if(b.hasAttribute("data-chgo")&&CHIN){ CHAL={s:CHIN.s,n:CHIN.ids.length}; const ids=CHIN.ids; CHIN=null; startQuiz(ids,"practice",[...new Set(ids.map(id=>BY[id].c))]); return; }
  if(b.hasAttribute("data-chshare")&&quiz){ const ans=quiz.items.filter(x=>x.pick!==null), c=ans.filter(x=>x.pick===0).length; chShare(quiz.items.map(x=>x.id),c); } },true);
{ const _rr31=renderResult; renderResult=function(){ let h=_rr31.apply(this,arguments); if(!quiz||quiz.mode==="exam") return h;
    const ans=quiz.items.filter(x=>x.pick!==null), c=ans.filter(x=>x.pick===0).length;
    let top="";
    if(CHAL){ const res=c>CHAL.s?"chWin":c<CHAL.s?"chLose":"chTie";
      top=`<section class="view chres"><h1>${esc(t(res))}</h1><div class="chvs"><div><small>${esc(t("chYou"))}</small><b>${c}/${quiz.items.length}</b></div><span>VS</span><div><small>${esc(t("chFriend"))}</small><b>${CHAL.s}/${CHAL.n}</b></div></div></section>`;
      if(res==="chWin") setTimeout(()=>{ try{ cheers(40); }catch(e){} },150); CHAL=null; }
    const btn=`<div class="chrow"><button type="button" class="chbtn" data-chshare>🥊 ${esc(t(top?"chBack":"chBtn"))}</button></div>`;
    h=h.replace(/(<button type="button" class="pago" data-paback>[\s\S]*?<\/button>)/,"$1"+btn);
    return top+(h.includes("data-chshare")?h:btn+h); }; }
setTimeout(chCheck,150); window.addEventListener("hashchange",chCheck);
try{ const st31=document.createElement("style"); st31.textContent=`
.chv{display:flex;justify-content:center}.chcard{max-width:520px;text-align:center;padding:26px 20px;border-radius:24px;background:var(--surface,#fff);border:2px solid var(--line,#eadfd4);display:flex;flex-direction:column;align-items:center;gap:10px}
.chcard h1{margin:6px 0 0}.chcard p{margin:0 0 8px;color:var(--muted,#7b6a5c)}
.chres{text-align:center;max-width:560px;margin:0 auto 10px}.chvs{display:flex;align-items:center;justify-content:center;gap:16px;margin:12px 0}
.chvs div{min-width:120px;border-radius:18px;padding:10px 14px;background:var(--surface,#fff);border:2px solid var(--line,#eadfd4)}.chvs small{display:block;font-weight:800;color:var(--muted,#7b6a5c);text-transform:uppercase;font-size:.7rem;letter-spacing:.08em}
.chvs b{font-size:1.8rem;color:var(--wine,#8c1d40)}.chvs span{font-weight:900;color:var(--gold,#b8862c)}
.chrow{display:flex;justify-content:center;margin:10px 0 14px}
.chbtn{font:inherit;font-weight:900;min-height:48px;padding:0 22px;border-radius:16px;border:2px solid #d4a23a;background:#fff6e0;color:#6b4a10;box-shadow:0 4px 0 #d4a23a;cursor:pointer}
.chbtn:active{transform:translateY(3px);box-shadow:0 1px 0 #d4a23a}
.chtoast{position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#2b1a20;color:#fff;padding:12px 18px;border-radius:14px;font-weight:700;z-index:300;box-shadow:0 12px 30px rgba(0,0,0,.3)}
`; document.head.appendChild(st31); }catch(e){}
