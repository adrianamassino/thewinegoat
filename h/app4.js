/* ---------- v44: podcast lessons (one per book chapter) + AI tutor with natural voice ---------- */
Object.assign(T.it,{tr_pods:"Podcast",trd_pods:"Le lezioni del libro da ascoltare, capitolo per capitolo, con la IA per le tue domande",
  pdIntro:"Ogni capitolo del libro raccontato come una lezione: ascoltala, segui il testo e poi fai le tue domande alla IA, che ti risponde per scritto o a voce.",
  pdSec1:"Sezione 1 · Il vino e il consumatore",pdSec2:"Sezione 2 · Stile, qualità e prezzo",pdSec3:"Sezione 3 · I vini fermi del mondo",pdSec4:"Sezione 4 · Gli spumanti",pdSec5:"Sezione 5 · I vini fortificati",
  pdSoon:"Audio in arrivo",pdDone:"Ascoltato",pdText:"Testo della lezione",pdMark:"Segna come ascoltata",pdMarked:"Ascoltata ✓",pdQuiz:"Mettiti alla prova",pdNext:"Lezione successiva",pdSpeed:"Velocità",
  pdAsk:"Domande alla IA su questa lezione",pdAuto:"Risposte a voce",pdMic:"Detta la domanda",pdListen:"Ascolta",pdStop:"Ferma",pdVoiceLoad:"Preparo la voce… {P}%",pdVoiceErr:"Voce naturale non disponibile su questo dispositivo: uso la voce del sistema.",
  pdMicErr:"Microfono non disponibile qui: scrivi la domanda.",pdVoice:"Voce",pdVoiceRec:"Voce registrata",pdVoiceHint:"Voce del tuo dispositivo: la qualità dipende dal browser. Le più naturali: in Edge le voci «Natural», in Chrome «Google», su iPhone/Mac le voci «Premium» o «Migliorata» (Impostazioni › Accessibilità › Contenuto letto ad alta voce › Voci).",pdLoading:"Carico il testo…",pdMin:"min",pdChapter:"Capitolo",pdNoText:"Testo non disponibile.",
  psug1:"Riassumimi la lezione in 5 punti chiave",psug2:"Fammi 3 domande d'esame su questo capitolo",psug3:"Qual è il concetto più difficile da ricordare qui?"});
Object.assign(T.fr,{tr_pods:"Podcasts",trd_pods:"Les leçons du livre à écouter, chapitre par chapitre, avec l'IA pour vos questions",
  pdIntro:"Chaque chapitre du livre raconté comme une leçon : écoutez-la, suivez le texte, puis posez vos questions à l'IA, qui vous répond par écrit ou à voix haute.",
  pdSec1:"Section 1 · Le vin et le consommateur",pdSec2:"Section 2 · Style, qualité et prix",pdSec3:"Section 3 · Les vins tranquilles du monde",pdSec4:"Section 4 · Les vins effervescents",pdSec5:"Section 5 · Les vins fortifiés",
  pdSoon:"Audio bientôt disponible",pdDone:"Écouté",pdText:"Texte de la leçon",pdMark:"Marquer comme écoutée",pdMarked:"Écoutée ✓",pdQuiz:"Testez-vous",pdNext:"Leçon suivante",pdSpeed:"Vitesse",
  pdAsk:"Questions à l'IA sur cette leçon",pdAuto:"Réponses à voix haute",pdMic:"Dicter la question",pdListen:"Écouter",pdStop:"Arrêter",pdVoiceLoad:"Préparation de la voix… {P} %",pdVoiceErr:"Voix naturelle indisponible sur cet appareil : j'utilise la voix du système.",
  pdMicErr:"Micro indisponible ici : écrivez votre question.",pdVoice:"Voix",pdVoiceRec:"Voix enregistrée",pdVoiceHint:"Voix de votre appareil : la qualité dépend du navigateur. Les plus naturelles : dans Edge les voix « Natural », dans Chrome « Google », sur iPhone/Mac les voix « Premium » ou « Améliorée » (Réglages › Accessibilité › Contenu énoncé › Voix).",pdLoading:"Chargement du texte…",pdMin:"min",pdChapter:"Chapitre",pdNoText:"Texte indisponible.",
  psug1:"Résume-moi la leçon en 5 points clés",psug2:"Pose-moi 3 questions d'examen sur ce chapitre",psug3:"Quel est le point le plus difficile à retenir ici ?"});
Object.assign(T.en,{tr_pods:"Podcasts",trd_pods:"The book's lessons to listen to, chapter by chapter, with the AI for your questions",
  pdIntro:"Every chapter of the book told as a lesson: listen, follow the text, then ask the AI your questions; it answers in writing or out loud.",
  pdSec1:"Section 1 · Wine and the consumer",pdSec2:"Section 2 · Style, quality and price",pdSec3:"Section 3 · Still wines of the world",pdSec4:"Section 4 · Sparkling wines",pdSec5:"Section 5 · Fortified wines",
  pdSoon:"Audio coming soon",pdDone:"Listened",pdText:"Lesson text",pdMark:"Mark as listened",pdMarked:"Listened ✓",pdQuiz:"Test yourself",pdNext:"Next lesson",pdSpeed:"Speed",
  pdAsk:"Ask the AI about this lesson",pdAuto:"Spoken answers",pdMic:"Dictate your question",pdListen:"Listen",pdStop:"Stop",pdVoiceLoad:"Preparing the voice… {P}%",pdVoiceErr:"Natural voice unavailable on this device: using the system voice.",
  pdMicErr:"Microphone unavailable here: please type your question.",pdVoice:"Voice",pdVoiceRec:"Recorded voice",pdVoiceHint:"Your device's own voice: quality depends on the browser. The most natural: Edge \"Natural\" voices, Chrome \"Google\" voices, Premium or Enhanced voices on iPhone/Mac (Settings › Accessibility › Spoken Content › Voices).",pdLoading:"Loading text…",pdMin:"min",pdChapter:"Chapter",pdNoText:"Text unavailable.",
  psug1:"Sum up the lesson in 5 key points",psug2:"Give me 3 exam questions on this chapter",psug3:"What's the hardest idea to remember here?"});
Object.assign(TABG,{pods:"study",pod:"study"}); Object.assign(SUBV,{pods:"study",pod:"pods"}); Object.assign(SUBT,{pods:"tr_pods",pod:"tr_pods"});
ICO.pod='<svg viewBox="0 0 48 48"><rect x="17" y="5" width="14" height="24" rx="7" fill="#6b2d5c"/><path d="M11 22a13 13 0 0 0 26 0" fill="none" stroke="#d4a23a" stroke-width="3.5" stroke-linecap="round"/><path d="M24 35v7M17 42h14" stroke="#d4a23a" stroke-width="3.5" stroke-linecap="round"/><path d="M21 11h6M21 16h6M21 21h6" stroke="#f3e3c3" stroke-width="2" stroke-linecap="round" opacity=".7"/></svg>';
const PODS=__PODS__;
const PCH={1:"deg",2:"cib",3:"srv",4:"vig",5:"env",6:"vgm",7:"vin",8:"wht",9:"red",10:"prx",11:"prx",12:"bdx",13:"bdx",14:"bdx",15:"bgn",16:"bgn",17:"als",18:"als",19:"rho",20:"rho",21:"sfr",22:"ger",23:"aut",24:"aut",25:"gre",26:"ita",27:"ita",28:"ita",29:"ita",30:"esp",31:"por",32:"usa",33:"usa",34:"usa",35:"usa",36:"chi",37:"chi",38:"rsa",39:"aus",40:"aus",41:"spu",42:"spu",43:"she",44:"prt",45:"prt"};
const pdSec=n=>n<=3?1:n<=11?2:n<=40?3:n<=42?4:5;
const pdLang=()=>["it","fr","en"][L()];
const PX={}; const PXP={};
let PA=null, PCUR=null, PSPD=+(lsGet("wset3-pdspd")||1)||1, PDSV=0, PSAY=null;
function pdState(){ return MT.pods||{}; }
function pdSave(id,patch){ MT.pods=Object.assign({},MT.pods,{[id]:Object.assign({},(MT.pods||{})[id],patch)}); saveMT(); }
function pdFmt(s){ s=Math.max(0,Math.round(s||0)); return Math.floor(s/60)+":"+String(s%60).padStart(2,"0"); }
function pdHas(p){ return pdMode(p)==="rec"?!!(p.d&&p.d[pdLang()]):true; }
function pdText(lg){ if(PX[lg]) return Promise.resolve(PX[lg]); if(PXP[lg]) return PXP[lg];
  return (PXP[lg]=fetch("podtext/"+lg+".json").then(r=>{ if(!r.ok) throw 0; return r.json(); }).then(j=>{ PX[lg]=j; return j; }).catch(()=>{ PXP[lg]=null; PX[lg]={}; return PX[lg]; })); }
function renderPods(){ const st=pdState(), lg=pdLang(); if(!PX[lg]) pdText(lg).then(()=>{ if(view==="pods") render(); });
  const secs=[1,2,3,4,5].map(s=>{ const L_=PODS.filter(p=>pdSec(p.n)===s); if(!L_.length) return "";
    return `<h2 class="hsec">${esc(t("pdSec"+s))}</h2><div class="pdlist">${L_.map(p=>{ const x=st[p.id]||{}, d=pdD(p,lg), pr=x.done?1:(d&&x.pos?Math.min(1,x.pos/d):0);
      return `<button type="button" class="pdrow${x.done?" done":""}" data-pod="${p.id}"><span class="pdn">${p.n}</span><span class="pdtx"><b>${esc(p.t[L()])}</b><span>${d?Math.max(1,Math.round(d/60))+" "+t("pdMin"):esc(t("pdSoon"))}${x.done?" · ✓ "+esc(t("pdDone")):""}</span><span class="pdbar"><i style="width:${Math.round(pr*100)}%"></i></span></span><span class="pdplay">${PCUR===p.id&&PA&&!PA.paused?"❚❚":"▶"}</span></button>`; }).join("")}</div>`; }).join("");
  return `<section class="view pods"><div class="pdhero"><p>${esc(t("pdIntro"))}</p></div>${secs}</section>`; }
function pdCur(){ return PODS.find(p=>p.id===PCUR); }
function renderPod(){ const p=pdCur(); if(!p) return renderPods(); const lg=pdLang(), d=pdD(p,lg), st=pdState()[p.id]||{}, tx_=PX[lg];
  if(!tx_) pdText(lg).then(()=>{ if(view==="pod") render(); });
  const X=tx_&&tx_[p.id]; const i=PODS.indexOf(p), nx=PODS[i+1];
  const paras=!tx_?`<p class="muted">${esc(t("pdLoading"))}</p>`:X?X.p.map((q,k)=>`<p class="pdp" data-pt="${k}">${esc(q)}</p>`).join(""):`<p class="muted">${esc(t("pdNoText"))}</p>`;
  return `<section class="view pod"><div class="pdhead"><span class="pdchap">${esc(t("pdChapter"))} ${p.n}</span><h2>${esc(p.t[L()])}</h2></div>
   <div class="pdplayer card${d?"":" off"}">
    ${d?`<div class="pdctl"><button type="button" class="flb" data-pd="back" aria-label="-15s">↺15</button><button type="button" class="flb big" data-pd="toggle" aria-label="play">${PA&&!PA.paused&&PCUR===p.id?"❚❚":"▶"}</button><button type="button" class="flb" data-pd="fwd" aria-label="+15s">15↻</button></div>
    <input type="range" class="pdseek" min="0" max="${Math.round(d)}" step="1" value="${Math.round(PCUR===p.id&&PA?PA.currentTime:(st.pos||0))}" aria-label="seek">
    <div class="pdtime"><span id="pd-t">${pdFmt(PCUR===p.id&&PA?PA.currentTime:(st.pos||0))}</span><button type="button" class="chip" data-pd="speed">${esc(t("pdSpeed"))} ${PSPD}×</button>${pdVoiceSel(p)}<span>${pdFmt(d)}</span></div>${pdMode(p)!=="rec"?`<p class="pdvhint muted">${esc(t("pdVoiceHint"))}</p>`:""}`:`<p class="muted">${esc(t("pdSoon"))}</p>${pdVoiceSel(p)}`}
   </div>
   <div class="pdacts"><button type="button" class="btn${st.done?"":" primary"}" data-pd="mark">${esc(t(st.done?"pdMarked":"pdMark"))}</button><button type="button" class="btn" data-qch="${PCH[p.n]}">${esc(t("pdQuiz"))}</button>${nx?`<button type="button" class="btn ghost" data-pod="${nx.id}">${esc(t("pdNext"))} →</button>`:""}</div>
   <div class="pdchat"><div class="pdchat-h"><h3>${esc(t("pdAsk"))}</h3><label class="pdauto"><input type="checkbox" data-pd="auto" ${lsGet("wset3-autovoice")==="1"?"checked":""}> ${esc(t("pdAuto"))}</label></div>${chatBox("p_"+p.id)}</div>
   <details class="pdtext" ${lsGet("wset3-pdtext")==="0"?"":"open"}><summary>${esc(t("pdText"))}</summary><div class="pdps">${paras}</div></details>
  </section>`; }

/* ---- v49: podcast voices — the recorded narration, or one of the device's own (often very natural) voices ---- */
const PDQ=/natural|neural|premium|enhanced|online|siri|wavenet|studio|google/i;
function pdVScore(v){ const n=v.name+" "+(v.voiceURI||""); let s=0; if(/natural|neural/i.test(n)) s+=6; if(/premium/i.test(n)) s+=5; if(/enhanced|siri|online|studio|wavenet/i.test(n)) s+=4; if(/google/i.test(n)) s+=3; if(v.localService===false) s+=1; if(/compact|espeak|eloquence|novelty/i.test(n)) s-=6; return s; }
function pdVoices(lg){ try{ return speechSynthesis.getVoices().filter(v=>v.lang&&v.lang.toLowerCase().replace("_","-").startsWith(lg)).sort((a,b)=>pdVScore(b)-pdVScore(a)); }catch(e){ return []; } }
function pdMode(p,lg){ lg=lg||pdLang(); const rec=p&&p.d&&p.d[lg], vs=pdVoices(lg), sv=lsGet("wset3-pdvoice-"+lg);
  if(sv==="rec"&&rec) return "rec"; if(sv&&sv!=="rec"&&vs.some(v=>v.name===sv)) return sv;
  if(rec) return "rec"; return vs.length?vs[0].name:"rec"; }
function pdEst(p,lg){ const X=PX[lg]&&PX[lg][p.id]; if(!X) return null; if(X._e) return X._e; let c=1.5; const T=[];
  X.p.forEach(q=>{ T.push(Math.round(c*10)/10); c+=q.length*0.068+1; }); return (X._e={T,d:c+0.5}); }
function pdD(p,lg){ if(pdMode(p,lg)==="rec") return p.d&&p.d[lg]; const e=pdEst(p,lg); return e?e.d:0; }
function pdTm(p,lg){ if(pdMode(p,lg)==="rec") return p.T&&p.T[lg]; const e=pdEst(p,lg); return e&&e.T; }
function pdSplit(q){ const s=String(q).match(/[^.!?…]+(?:[.!?…]+["»”’)]*\s*|$)/g)||[q]; const o=[]; let c="";
  for(const x0 of s){ const x=x0.trim(); if(!x) continue; if(c&&c.length+x.length>220){ o.push(c); c=x; } else c=c?c+" "+x:x; } if(c) o.push(c); return o; }
function pdVoiceSel(p){ const lg=pdLang(), vs=pdVoices(lg), m=pdMode(p), rec=p.d&&p.d[lg]; if(!vs.length) return "";
  return `<select class="chip pdvoice" data-pd="voice" aria-label="${esc(t("pdVoice"))}">${rec?`<option value="rec"${m==="rec"?" selected":""}>${esc(t("pdVoiceRec"))}</option>`:""}${vs.slice(0,24).map(v=>`<option value="${esc(v.name)}"${m===v.name?" selected":""}>${pdVScore(v)>=3?"★ ":""}${esc(v.name.replace(/^(Microsoft|Google|Apple)\s+/,"").replace(/\s*-\s*[A-Za-zÀ-ÿ ()]+$/,"").slice(0,34))}</option>`).join("")}</select>`; }
let RA=null, SA=null;
function pdBind(a){ a.addEventListener("timeupdate",pdTick);
  a.addEventListener("ended",()=>{ const q=pdCur(); if(q) pdSave(q.id,{pos:0,done:1}); MT.xp=(MT.xp||0)+5; saveMT(); pdUI(); });
  a.addEventListener("play",pdUI); a.addEventListener("pause",()=>{ const q=pdCur(); if(q&&!a._ended) pdSave(q.id,{pos:a.currentTime}); a._ended=false; pdUI(); }); return a; }
class SynthAudio extends EventTarget{
  constructor(){ super(); this.paused=true; this.duration=NaN; this._rate=1; this._src=""; this.U=[]; this.i=0; this._t=0; this._ws=0; this._gen=0; this._iv=null; this.voice=null; this.lg="it"; this.preload="auto"; }
  get playbackRate(){ return this._rate; }
  set playbackRate(r){ r=+r||1; if(r===this._rate) return; const t=this.currentTime; this._rate=r; if(!this.paused) this._restart(t); }
  get src(){ return this._src; }
  set src(s){ if(!this.paused) this.pause(); this._src=s; this.U=[]; this.duration=NaN; this._t=0; const m=/^synth:(\w+)\/(ch\d+)\/(.*)$/.exec(s); if(!m) return;
    const lg=m[1], id=m[2], vn=decodeURIComponent(m[3]); this.lg=lg;
    pdText(lg).then(()=>{ if(this._src!==s) return; const p=PODS.find(x=>x.id===id), X=PX[lg]&&PX[lg][id]; if(!p||!X) return;
      this.voice=pdVoices(lg).find(v=>v.name===vn)||null; const e=pdEst(p,lg); this.duration=e.d; const U=[];
      X.p.forEach((q,k)=>{ const a=e.T[k], b=k+1<e.T.length?e.T[k+1]-1:e.d-0.5, ss=pdSplit(q), tot=ss.reduce((n,x)=>n+x.length,0)||1; let c=a;
        ss.forEach((x,j)=>{ const dd=(b-a)*x.length/tot; U.push({x,t0:c,t1:c+dd,last:j===ss.length-1}); c+=dd; }); });
      this.U=U; this.dispatchEvent(new Event("loadedmetadata")); if(this._pp){ this._pp=false; this.play(); } }); }
  get currentTime(){ if(this.paused||!this.U.length) return this._t; const u=this.U[this.i]; if(!u) return this._t;
    return Math.min(u.t1, u.t0+(performance.now()-this._ws)/1000*this._rate); }
  set currentTime(t){ t=Math.max(0,+t||0); this._t=t; if(!this.paused) this._restart(t); else this.dispatchEvent(new Event("timeupdate")); }
  play(){ if(!this.paused) return Promise.resolve(); if(!this.U.length){ this._pp=true; return Promise.resolve(); }
    this.paused=false; this.dispatchEvent(new Event("play")); this._restart(this._t); clearInterval(this._iv); this._iv=setInterval(()=>this.dispatchEvent(new Event("timeupdate")),300); return Promise.resolve(); }
  pause(){ this._pp=false; if(this.paused) return; this._t=this.currentTime; this.paused=true; this._gen++; clearInterval(this._iv); try{ speechSynthesis.cancel(); }catch(e){} this.dispatchEvent(new Event("pause")); }
  _restart(t){ this._gen++; const g=this._gen; try{ speechSynthesis.cancel(); }catch(e){} let i=this.U.findIndex(u=>t<u.t1-0.05); if(i<0) i=this.U.length;
    this.i=Math.min(i,this.U.length-1); this._ws=performance.now()-Math.max(0,t-(this.U[this.i]?this.U[this.i].t0:0))*1000/this._rate; setTimeout(()=>{ if(g===this._gen&&!this.paused) this._say(i); },80); }
  _say(i){ const g=this._gen;
    if(i>=this.U.length){ this._t=0; this.paused=true; clearInterval(this._iv); this._ended=true; this.dispatchEvent(new Event("pause")); this.dispatchEvent(new Event("ended")); return; }
    this.i=i; const u=this.U[i], ut=new SpeechSynthesisUtterance(u.x);
    if(this.voice){ ut.voice=this.voice; ut.lang=this.voice.lang; } else ut.lang={it:"it-IT",fr:"fr-FR",en:"en-GB"}[this.lg];
    ut.rate=Math.max(0.5,Math.min(2,this._rate*0.97)); this._ws=performance.now();
    ut.onstart=()=>{ if(g===this._gen) this._ws=performance.now(); };
    let done=false; const next=()=>{ if(done||g!==this._gen) return; done=true; this._t=u.t1; const gap=u.last?700:/\?["»”]?$/.test(u.x)?320:/[:;]$/.test(u.x)?180:110;
      setTimeout(()=>{ if(g===this._gen&&!this.paused) this._say(i+1); },gap/this._rate); };
    ut.onend=next; ut.onerror=ev=>{ if(ev&&(ev.error==="interrupted"||ev.error==="canceled")) return; next(); };
    try{ speechSynthesis.speak(ut); }catch(e){ next(); } }
}
try{ const st=document.createElement("style"); st.textContent=".pdvoice{max-width:46%;appearance:auto;font:inherit;font-size:.82rem;cursor:pointer;background:var(--card,#fff);color:inherit}.pdvhint{font-size:.78rem;margin:.5rem 0 0;line-height:1.35}"; document.head.appendChild(st); }catch(e){}
try{ speechSynthesis.addEventListener("voiceschanged",()=>{ if(view==="pod"||view==="pods") render(); }); speechSynthesis.getVoices(); }catch(e){}
function pdOpen(id){ if(PCUR!==id){ pdPause(); PCUR=id; } go("pod"); }
function pdSrc(p){ const lg=pdLang(), m=pdMode(p); return m==="rec"?"pods/"+lg+"/"+p.id+".mp3":"synth:"+lg+"/"+p.id+"/"+encodeURIComponent(m); }
function pdPlay(){ const p=pdCur(); if(!p||!pdHas(p)) return; if(PSAY) PSAY.stop();
  const eng=pdMode(p)==="rec"?(RA||(RA=pdBind(new Audio()))):(SA||(SA=pdBind(new SynthAudio())));
  if(PA&&PA!==eng&&!PA.paused) PA.pause(); PA=eng; PA.preload="auto";
  const src=pdSrc(p);
  if(!PA.src.endsWith(src)){ PA.src=src; const st=pdState()[p.id]||{}; const at=st.pos&&!st.done?st.pos:0;
    PA.addEventListener("loadedmetadata",function h(){ PA.removeEventListener("loadedmetadata",h); try{ PA.currentTime=at; }catch(e){} },{once:true}); }
  PA.playbackRate=PSPD; const pr=PA.play(); if(pr&&pr.catch) pr.catch(()=>{});
  try{ if("mediaSession" in navigator){ navigator.mediaSession.metadata=new MediaMetadata({title:p.t[L()],artist:"The Wine Goat · WSET 3",album:t("tr_pods")});
    navigator.mediaSession.setActionHandler("seekbackward",()=>pdSeek(-15)); navigator.mediaSession.setActionHandler("seekforward",()=>pdSeek(15)); } }catch(e){} }
function pdPause(){ if(PA&&!PA.paused) PA.pause(); }
function pdSeek(dx){ if(!PA) return; PA.currentTime=Math.max(0,Math.min((PA.duration||1e9)-0.5,PA.currentTime+dx)); pdTick(); }
function pdTick(){ const p=pdCur(); if(!p||!PA) return; const now=Date.now();
  if(now-PDSV>15000){ PDSV=now; pdSave(p.id,{pos:PA.currentTime}); }
  if(view==="pod"){ const s=document.querySelector(".pdseek"); if(s&&!s.matches(":active")) s.value=Math.round(PA.currentTime); const tt=document.getElementById("pd-t"); if(tt) tt.textContent=pdFmt(PA.currentTime);
    const lg=pdLang(), X=PX[lg]&&PX[lg][p.id], Tm=pdTm(p,lg); if(X&&Tm){ let k=0; while(k+1<Tm.length&&PA.currentTime>=Tm[k+1]) k++;
      const el=document.querySelector(`.pdp[data-pt="${k}"]`); if(el&&!el.classList.contains("on")){ document.querySelectorAll(".pdp.on").forEach(e=>e.classList.remove("on")); el.classList.add("on");
        if(!PA.paused&&document.querySelector(".pdtext[open]")){ const r=el.getBoundingClientRect(); if(r.top<80||r.bottom>innerHeight-120) el.scrollIntoView({block:"center",behavior:"smooth"}); } } } }
  pdMini(); }
function pdUI(){ if(view==="pod"){ const b=document.querySelector('[data-pd="toggle"]'); if(b) b.textContent=PA&&!PA.paused?"❚❚":"▶"; } if(view==="pods") document.querySelectorAll(".pdrow").forEach(r=>{ const pl=r.querySelector(".pdplay"); if(pl) pl.textContent=PCUR===r.dataset.pod&&PA&&!PA.paused?"❚❚":"▶"; }); pdMini(); }
function pdMini(){ let m=document.getElementById("pdmini"); const p=pdCur(); const show=p&&PA&&(!PA.paused||PA.currentTime>0)&&view!=="pod";
  if(!show){ if(m) m.remove(); return; }
  if(!m){ m=document.createElement("div"); m.id="pdmini"; m.className="pdmini"; document.body.appendChild(m);
    m.addEventListener("click",e=>{ const b=e.target.closest("[data-pm]"); if(!b){ pdOpen(PCUR); return; } e.stopPropagation(); const a=b.dataset.pm;
      if(a==="tg"){ PA.paused?pdPlay():pdPause(); } else if(a==="x"){ pdPause(); PA.currentTime=0; PCUR=null; pdMini(); } }); }
  const pr=PA.duration?PA.currentTime/PA.duration:0;
  m.innerHTML=`<span class="pmic">${ICO.pod}</span><span class="pmtx"><b>${esc(p.n+". "+p.t[L()])}</b><i style="width:${Math.round(pr*100)}%"></i></span><button type="button" data-pm="tg" aria-label="play">${PA.paused?"▶":"❚❚"}</button><button type="button" data-pm="x" aria-label="close">✕</button>`; }
/* ---- chat integration: context prompt, suggestions, mic, speak buttons ---- */
const _ctxPrompt0=ctxPrompt;
ctxPrompt=function(id){ if(!String(id).startsWith("p_")) return _ctxPrompt0(id);
  const pid=String(id).slice(2), p=PODS.find(x=>x.id===pid), lg=pdLang(), X=PX[lg]&&PX[lg][pid];
  return `You are a warm, expert tutor for the WSET Level 3 Award in Wines. The student studies with the official WSET Level 3 textbook "Understanding Wines: Explaining Style and Quality" (latest French edition, "Comprendre le vin : expliquer le style et la qualité"). They have just listened to the audio lesson on chapter ${p?p.n:"?"} ("${p?p.t[2]:pid}"). The lesson text is below: it retells the chapter's content.

How to answer:
- Always reply in ${CLN[lang]}, in a natural spoken style: your answer may be read aloud by a voice, so write flowing sentences, avoid tables, headings and symbols, and use at most a short list when really useful.
- Base your answers on the lesson and on the WSET Level 3 syllabus, with its terminology. If you add something beyond the textbook, say so briefly. If you are not sure, say so rather than guessing.
- Explain causes and effects (the "why"), with concrete examples of regions, grapes, styles and winemaking choices: this is what the exam rewards.
- Be concise: usually 60–160 words. Go longer only if asked. If asked for exam questions, give them with the answers after a short pause line.
- If the student strays far from wine, gently bring them back to their revision.

Lesson text:
${X?X.p.join("\n\n"):"(not available)"}

The conversation with the student follows.`; };
const _chatBox0=chatBox;
chatBox=function(id){ let h=_chatBox0(id); if(!String(id).startsWith("p_")) return h;
  h=h.replace(/data-sug="sug(\d)">[^<]*</g,(m,n)=>`data-sug="psug${n}">${esc(t("psug"+n))}<`);
  if(window.SpeechRecognition||window.webkitSpeechRecognition) h=h.replace('<button class="btn primary" data-send','<button class="btn micbtn" data-mic aria-label="'+esc(t("pdMic"))+'" title="'+esc(t("pdMic"))+'">🎙️</button><button class="btn primary" data-send');
  return h; };
const _bubble0=bubble;
bubble=function(r,txt,pending){ let h=_bubble0(r,txt,pending); if(r!=="u"&&!pending&&txt) h=h.replace(/<\/div>$/,`<button type="button" class="saybtn" data-say aria-label="${esc(t("pdListen"))}">🔊 <span>${esc(t("pdListen"))}</span></button></div>`); return h; };
const _chatSend0=chatSend;
chatSend=async function(id,text){ await _chatSend0(id,text);
  if(String(id).startsWith("p_")&&lsGet("wset3-autovoice")==="1"){ const h=CHATS[id]; const last=h&&h[h.length-1]; if(last&&last.r==="a"){ const b=[...document.querySelectorAll(`.chat[data-q="${id}"] .msg.a [data-say]`)].pop(); pdSay(last.t,b); } } };
function sysSay(text,btn){ try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(String(text).replace(/\*\*/g,"")); u.lang=["it-IT","fr-FR","en-GB"][L()];
  const vs=speechSynthesis.getVoices().filter(v=>v.lang&&v.lang.slice(0,2)===u.lang.slice(0,2)); if(vs.length) u.voice=vs.find(v=>/natural|premium|enhanced|neural|google|online/i.test(v.name))||vs[0];
  u.onend=()=>pdSayBtn(btn,false); speechSynthesis.speak(u); pdSayBtn(btn,true); PSAY={stop(){ try{ speechSynthesis.cancel(); }catch(e){} pdSayBtn(btn,false); }}; }catch(e){ pdSayBtn(btn,false); } }
function pdSayBtn(btn,on,label){ if(!btn) return; btn.classList.toggle("on",!!on); const s=btn.querySelector("span"); if(s) s.textContent=label||t(on?"pdStop":"pdListen"); }
let WGL=null;
function wgLoad(){ if(window.WGTTS) return Promise.resolve(true); if(WGL) return WGL;
  return (WGL=new Promise(res=>{ const s=document.createElement("script"); s.src="tts/wgtts.js"; s.onload=()=>res(!!window.WGTTS); s.onerror=()=>res(false); document.head.appendChild(s); })); }
async function pdSay(text,btn){ if(PSAY){ const was=PSAY.btn===btn; PSAY.stop(); PSAY=null; if(was) return; }
  pdPause(); document.querySelectorAll(".saybtn.on").forEach(b=>pdSayBtn(b,false));
  pdSayBtn(btn,true,t("pdVoiceLoad").replace("{P}","0"));
  const ok=await wgLoad();
  if(!ok||!WGTTS.supported()||WGTTS.state==="error"){ sysSay(text,btn); return; }
  pdSayBtn(btn,true,WGTTS.state==="ready"?t("pdStop"):t("pdVoiceLoad").replace("{P}","0"));
  const job=WGTTS.speak(text,pdLang(),{onprogress:p=>pdSayBtn(btn,true,t("pdVoiceLoad").replace("{P}",Math.round(p*100))),onstart:()=>pdSayBtn(btn,true),
    onend:()=>{ if(PSAY&&PSAY.job===job) PSAY=null; pdSayBtn(btn,false); },
    onerror:()=>{ if(PSAY&&PSAY.job===job) PSAY=null; const er=btn&&btn.closest(".chat")?.querySelector(".chat-err"); if(er) er.textContent=t("pdVoiceErr"); sysSay(text,btn); }});
  PSAY={job,btn,stop(){ job.stop(); pdSayBtn(btn,false); }}; }
function pdMic(chat){ const SR=window.SpeechRecognition||window.webkitSpeechRecognition; const er=chat.querySelector(".chat-err");
  if(!SR){ if(er) er.textContent=t("pdMicErr"); return; }
  try{ pdPause(); if(PSAY){ PSAY.stop(); PSAY=null; } const rec=new SR(); rec.lang=["it-IT","fr-FR","en-GB"][L()]; rec.interimResults=true; rec.maxAlternatives=1;
    const ta=chat.querySelector("textarea"), mb=chat.querySelector("[data-mic]"); if(mb) mb.classList.add("on"); let fin="";
    rec.onresult=e=>{ let s=""; for(const r of e.results){ s+=r[0].transcript; if(r.isFinal) fin=s; } if(ta) ta.value=s; };
    rec.onerror=()=>{ if(er) er.textContent=t("pdMicErr"); if(mb) mb.classList.remove("on"); };
    rec.onend=()=>{ if(mb) mb.classList.remove("on"); const v=(fin||(ta&&ta.value)||"").trim(); if(v){ if(ta) ta.value=""; chatSend(chat.dataset.q,v); } };
    rec.start(); }catch(e){ if(er) er.textContent=t("pdMicErr"); } }
document.getElementById("main").addEventListener("click",e=>{
  const pod=e.target.closest("[data-pod]"); if(pod){ e.preventDefault(); const id=pod.dataset.pod; if(view==="pods"&&PCUR===id&&PA&&!PA.paused){ pdPause(); return; } pdOpen(id); if(pdHas(PODS.find(x=>x.id===id))) setTimeout(pdPlay,50); return; }
  const say=e.target.closest("[data-say]"); if(say){ const mt=say.closest(".msg")?.querySelector(".mt"); if(mt) pdSay(mt.innerText,say); return; }
  const mic=e.target.closest("[data-mic]"); if(mic){ const ch=mic.closest(".chat"); if(ch) pdMic(ch); return; }
  const pp=e.target.closest(".pdp[data-pt]"); if(pp&&PA){ const p=pdCur(), Tm=p&&pdTm(p,pdLang()); if(Tm){ if(!PA.src.endsWith(pdSrc(p))) pdPlay(); PA.currentTime=Tm[+pp.dataset.pt]; if(PA.paused) pdPlay(); } return; }
  const b=e.target.closest("[data-pd]"); if(!b) return; const a=b.dataset.pd, p=pdCur();
  if(a==="toggle"){ if(PA&&!PA.paused&&PA.src.endsWith(pdSrc(p))) pdPause(); else pdPlay(); }
  else if(a==="back") pdSeek(-15); else if(a==="fwd") pdSeek(15);
  else if(a==="speed"){ const S=[1,1.15,1.3,0.85]; PSPD=S[(S.indexOf(PSPD)+1)%S.length]; lsSet("wset3-pdspd",String(PSPD)); if(PA) PA.playbackRate=PSPD; b.textContent=t("pdSpeed")+" "+PSPD+"×"; }
  else if(a==="mark"){ const st=pdState()[p.id]||{}; pdSave(p.id,{done:st.done?0:1}); if(!st.done){ MT.xp=(MT.xp||0)+5; saveMT(); setTimeout(()=>cheers(14),50); } render(); }
});
document.getElementById("main").addEventListener("input",e=>{ if(e.target.matches(".pdseek")&&PA){ const p=pdCur(); if(!PA.src.endsWith(pdSrc(p))){ pdPlay(); } PA.currentTime=+e.target.value; pdTick(); } });
document.getElementById("main").addEventListener("change",e=>{ if(e.target.matches('[data-pd="auto"]')) lsSet("wset3-autovoice",e.target.checked?"1":"0");
  if(e.target.matches('[data-pd="voice"]')){ const was=PA&&!PA.paused; pdPause(); lsSet("wset3-pdvoice-"+pdLang(),e.target.value); render(); if(was) setTimeout(pdPlay,120); } });
document.getElementById("main").addEventListener("toggle",e=>{ if(e.target.matches&&e.target.matches(".pdtext")) lsSet("wset3-pdtext",e.target.open?"1":"0"); },true);
