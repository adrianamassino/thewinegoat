/* ---------- v54: "YouTube-style" film player — 16:9 cinema stage, intro card, lower thirds, subtitles, chapters, speed, fullscreen ---------- */
Object.assign(T.it,{ytCh:"Capitoli",ytCC:"Sottotitoli",ytSpeed:"Velocità",ytFull:"Schermo intero",ytChannel:"The Wine Goat · la scuola del vino",ytScene:"Scena",ytAbout:"In questa scena",ytNew:"Nuovo"});
Object.assign(T.fr,{ytCh:"Chapitres",ytCC:"Sous-titres",ytSpeed:"Vitesse",ytFull:"Plein écran",ytChannel:"The Wine Goat · l'école du vin",ytScene:"Scène",ytAbout:"Dans cette scène",ytNew:"Nouveau"});
Object.assign(T.en,{ytCh:"Chapters",ytCC:"Subtitles",ytSpeed:"Speed",ytFull:"Full screen",ytChannel:"The Wine Goat · wine school",ytScene:"Scene",ytAbout:"In this scene",ytNew:"New"});
let ytCC=lsGet("wset3-ytcc")!=="0", ytSpd=+(lsGet("wset3-ytspd")||1)||1, ytFS=false;
function ytLogo(){ if(ytLogo.c) return ytLogo.c; const m=document.querySelector('#brand-home img.logo'), w=document.querySelector('#brand-home img.wmi.dk')||document.querySelector('#brand-home img.wmi'); if(m&&w) ytLogo.c={m:m.src,w:w.src}; return ytLogo.c||{m:'',w:''}; }
const ytFmt=s=>{ s=Math.max(0,Math.round(s||0)); return Math.floor(s/60)+":"+String(s%60).padStart(2,"0"); };
function ytTimes(fi){ const f=FILMS[fi]; const x=FLT[f.id]&&FLT[f.id][flLang()]; if(flVoice&&x&&x.length===f.s.length+1) return x; const o=[0]; f.s.forEach(sc=>o.push(o[o.length-1]+flDur(sc))); return o; }
function ytNow(){ if(!FL) return 0; const T_=ytTimes(FL.f); const real=flVoice&&FLT[FILMS[FL.f].id]&&FA&&!FL.synth&&FA.src&&FA.src.endsWith(flSrc());
  if(real&&FA.readyState>0) return FA.currentTime; return (T_[FL.s]||0)+Math.min(FL.el,(T_[FL.s+1]||0)-(T_[FL.s]||0)); }
function ytChunk(t,mx){ if(t.length<=mx) return [t]; const out=[]; let cur="";
  t.split(/\s+/).forEach(w=>{ if(cur&&(cur+" "+w).length>mx){ out.push(cur); cur=w; } else cur=cur?cur+" "+w:w; if(cur.length>mx*.62&&/[,;:]$/.test(w)){ out.push(cur); cur=""; } });
  if(cur) out.push(cur); if(out.length>1&&out[out.length-1].length<14){ const l=out.pop(); out[out.length-1]+=" "+l; } return out; }
function ytSents(s){ const mx=(window.innerWidth||800)<560?52:78; return (String(s).match(/[^.!?…]+[.!?…]*(\s|$)/g)||[s]).map(x=>x.trim()).filter(Boolean).flatMap(x=>ytChunk(x,mx)); }
function renderFilm(){ if(!FL) FL={f:0,s:0,play:true,el:0}; const f=FILMS[FL.f], sc=f.s[FL.s], T_=ytTimes(FL.f), tot=T_[T_.length-1];
  if(FL.end) return renderFilmKw();
  const intro=FL.s===0&&!FL.introDone;
  const chap=f.s.map((s_,i)=>`<i class="${i<FL.s?"done":i===FL.s?"cur":""}" data-fljump="${i}" style="flex:${Math.max(1,(T_[i+1]-T_[i]))}" title="${esc(tx(s_.h))}"><b style="width:${i<FL.s?100:0}%"></b></i>`).join("");
  return `<section class="view film yt${ytFS?" ytfs":""}">
  <div class="ytplayer" id="ytp">
    <div class="ytstage flstage" data-fl="toggle"><div class="ytscene" style="--kbx:${FL.s%2?"30%":"70%"};--kby:${FL.s%3?"40%":"60%"}">${sc.v()}</div>
      ${intro?`<div class="ytintro"><div class="ytlogo"><img class="ytmk" src="${ytLogo().m}" alt=""><img class="ytwmk" src="${ytLogo().w}" alt="The Wine Goat"></div><b class="yttitle">${esc(tx(f.t))}</b><span class="ytsub">${esc(chName(f.ch))}</span></div>`:""}
      <div class="ytl3"><span class="ytl3n">${FL.s+1}</span><span class="ytl3t">${esc(tx(sc.h))}</span></div>
      ${ytCC?`<div class="ytcc" id="ytcc"></div>`:""}
      ${FL.play?"":`<span class="ytbig">▶</span>`}
      <div class="ytgrad"></div>
      <div class="ytbug" aria-hidden="true"><img src="${ytLogo().m}" alt=""><img src="${ytLogo().w}" alt=""></div>
    </div>
    <div class="ytctl"><div class="flbar ytbar">${chap}</div>
      <div class="ytrow"><button type="button" class="ytb" data-fl="prev" aria-label="prev" ${FL.s?"":"disabled"}>⏮</button><button type="button" class="ytb big" data-fl="toggle" aria-label="play">${FL.play?"❚❚":"▶"}</button><button type="button" class="ytb" data-fl="next" aria-label="next">⏭</button>
      <span class="yttime"><span id="ytnow">${ytFmt(T_[FL.s])}</span> / ${ytFmt(tot)}</span><span class="ytchn">· ${esc(tx(sc.h))}</span><span class="ytsp"></span>
      <button type="button" class="ytb ${flVoice?"on":""}" data-fl="voice" aria-pressed="${flVoice}" title="${esc(t("flVoice"))}">${flVoice?"🔊":"🔇"}</button>
      <button type="button" class="ytb txt ${ytCC?"on":""}" data-yt="cc" aria-pressed="${ytCC}" title="${esc(t("ytCC"))}">CC</button>
      <button type="button" class="ytb txt" data-yt="spd" title="${esc(t("ytSpeed"))}">${ytSpd}×</button>
      <button type="button" class="ytb" data-yt="fs" title="${esc(t("ytFull"))}">⛶</button></div></div>
  </div>
  <div class="ytmeta"><h2 class="yth1">${esc(tx(f.t))}</h2><div class="ytchan"><span class="ytav"><img src="${ytLogo().m}" alt=""></span><span><b>The Wine Goat</b><small>${esc(t("ytChannel"))}</small></span><span class="ytpill">${f.s.length} ${t("flScenes")} · ${ytFmt(tot)}</span>${flSeenN(f)?`<span class="ytpill ytseen">✓ ${esc(flSeenTxt(flSeenN(f)))}</span>`:""}</div>
   <div class="ytdesc"><span class="label">${esc(t("ytAbout"))} · ${FL.s+1}/${f.s.length}</span><h3>${esc(tx(sc.h))}</h3><p>${esc(tx(sc.c))}</p></div>
   <h3 class="ytchh">${esc(t("ytCh"))}</h3><ol class="ytchap">${f.s.map((s_,i)=>`<li class="${i===FL.s?"on":i<FL.s?"done":""}"><button type="button" data-fljump="${i}"><span class="ytts">${ytFmt(T_[i])}</span><span>${esc(tx(s_.h))}</span></button></li>`).join("")}<li class="kwli"><button type="button" data-kwopen="1"><span class="ytts">★</span><span>${esc(t("kwOpen"))}</span></button></li></ol></div></section>`; }
function ytLoop(){ if(view!=="film"||!FL||FL.end){ ytLoop.on=false; return; } ytLoop.on=true;
  const T_=ytTimes(FL.f), now=ytNow(), a=T_[FL.s], b=T_[FL.s+1]; const n=document.getElementById("ytnow"); if(n) n.textContent=ytFmt(now);
  if(FL.s===0&&!FL.introDone&&now-a>2.6){ FL.introDone=true; const i=document.querySelector(".ytintro"); if(i) i.classList.add("out"); }
  const cc=document.getElementById("ytcc"); if(cc){ const sc=FILMS[FL.f].s[FL.s], h=tx(sc.h), ss=ytSents(tx(sc.c)); const lens=[FILMS[FL.f].pod?0:h.length*1.6+12,...ss.map(x=>x.length+6)], tl=lens.reduce((x,y)=>x+y,0);
    let p=Math.max(0,Math.min(.999,(now-a)/Math.max(.1,b-a)))*tl, k=0; while(k<lens.length-1&&p>lens[k]){ p-=lens[k]; k++; }
    const line=k===0?"":ss[k-1]; if(cc.dataset.k!==String(k)){ cc.dataset.k=k; cc.innerHTML=line?`<span>${esc(line)}</span>`:""; } }
  requestAnimationFrame(ytLoop); }
new MutationObserver(()=>{ if(view==="film"&&document.getElementById("ytp")&&!ytLoop.on) requestAnimationFrame(ytLoop); }).observe(document.getElementById("main")||document.body,{childList:true,subtree:false});
function ytApplySpd(){ try{ if(FA) FA.playbackRate=ytSpd; }catch(e){} }
const _ytSpk=setInterval(()=>{ if(FA&&FA.playbackRate!==ytSpd) ytApplySpd(); },400);
document.addEventListener("click",e=>{ const b=e.target.closest&&e.target.closest("[data-yt]"); if(!b) return; e.stopPropagation(); const a=b.dataset.yt;
  if(a==="cc"){ ytCC=!ytCC; lsSet("wset3-ytcc",ytCC?"1":"0"); render(); }
  else if(a==="spd"){ const L_=[1,1.25,1.5,.75]; ytSpd=L_[(L_.indexOf(ytSpd)+1)%L_.length]; lsSet("wset3-ytspd",String(ytSpd)); ytApplySpd(); render(); }
  else if(a==="fs"){ const el=document.getElementById("ytp"); const fsEl=document.fullscreenElement||document.webkitFullscreenElement;
    if(fsEl){ (document.exitFullscreen||document.webkitExitFullscreen).call(document); return; }
    const req=el&&(el.requestFullscreen||el.webkitRequestFullscreen); let ok=false;
    if(req){ try{ const pr=req.call(el); ok=true; if(pr&&pr.catch) pr.catch(()=>{ ytFS=!ytFS; render(); }); }catch(err){ ok=false; } }
    if(!ok){ ytFS=!ytFS; render(); } } },true);
function flSynth(){ try{ const sc=FILMS[FL.f].s[FL.s]; const u=new SpeechSynthesisUtterance(tx(sc.h)+". "+tx(sc.c)); u.lang=["it-IT","fr-FR","en-GB"][L()]; u.rate=ytSpd;
  const vs=speechSynthesis.getVoices().filter(v=>v.lang&&v.lang.slice(0,2)===u.lang.slice(0,2)); if(vs.length) u.voice=vs.find(v=>/natural|premium|enhanced|google/i.test(v.name))||vs[0];
  u.onend=()=>{ if(FL&&FL.u===u) FL.voiceDone=true; }; FL.u=u; speechSynthesis.speak(u); }catch(e){ FL.voiceDone=true; } }
/* keep FL.el in step with playback speed for silent / synthetic modes */
function flDur(sc){ return Math.max(7,Math.min(30,4+tx(sc.c).length*.065))/ytSpd; }
try{ const st=document.createElement("style"); st.textContent=`
.film.yt{gap:14px;max-width:980px;margin:0 auto}
.ytplayer{background:#000;border-radius:14px;overflow:hidden;box-shadow:0 14px 40px rgba(20,8,12,.35);position:relative}
.ytstage.flstage{position:relative;aspect-ratio:16/9;background:#0b0608;border-radius:0;cursor:pointer;overflow:hidden;display:block;margin:0;padding:0;border:0}
.ytscene{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;animation:ytIn .7s ease both}
.ytscene .fsvg{width:100%;height:100%;display:block;transform-origin:var(--kbx) var(--kby);animation:ytKB 26s ease-out both}
.ytscene .fxgr{animation:ytGrain .5s steps(4) infinite}
@keyframes ytIn{from{opacity:0;filter:blur(6px) brightness(.6)}to{opacity:1;filter:none}}
@keyframes ytKB{from{transform:scale(1.0)}to{transform:scale(1.085)}}
@keyframes ytGrain{0%{transform:translate(0,0)}25%{transform:translate(-3px,2px)}50%{transform:translate(2px,-2px)}75%{transform:translate(-1px,3px)}100%{transform:translate(0,0)}}
.ytgrad{position:absolute;left:0;right:0;bottom:0;height:34%;background:linear-gradient(transparent,rgba(0,0,0,.55));pointer-events:none}
.ytl3{position:absolute;left:3%;top:5%;display:flex;align-items:stretch;max-width:80%;animation:ytL3 .8s .35s cubic-bezier(.2,.8,.2,1) both,ytL3o .8s 5.2s ease forwards;pointer-events:none;z-index:2}
.ytl3n{background:#d4a23a;color:#2a1b20;font-weight:800;padding:.25em .6em;font-family:var(--f-mono);font-size:clamp(.7rem,1.6vw,1rem);display:flex;align-items:center;border-radius:6px 0 0 6px}
.ytl3t{background:rgba(20,10,14,.82);color:#fff4dc;font-weight:700;padding:.3em .8em;font-size:clamp(.78rem,2vw,1.15rem);border-radius:0 6px 6px 0;backdrop-filter:blur(4px)}
@keyframes ytL3o{to{opacity:0;transform:translateY(-8px)}}@keyframes ytL3{from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:none}}
.ytcc{position:absolute;left:8%;right:8%;bottom:5%;text-align:center;z-index:3;pointer-events:none}
.ytcc span{display:inline;background:rgba(8,4,6,.78);color:#fff;font-size:clamp(.78rem,2.1vw,1.2rem);line-height:1.5;padding:.15em .45em;box-decoration-break:clone;-webkit-box-decoration-break:clone;border-radius:4px;font-weight:500}
.ytbig{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:72px;height:52px;border-radius:14px;background:rgba(212,30,50,.92);color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.5rem;z-index:4;box-shadow:0 6px 18px rgba(0,0,0,.4)}
.ytintro{position:absolute;inset:0;z-index:5;background:radial-gradient(circle at 50% 40%,#5b2147,#1d0d17 70%);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.4em;color:#fff4dc;text-align:center;padding:0 8%;animation:ytInt .6s ease both}
.ytintro.out{animation:ytOut .8s ease both}
.ytintro .ytlogo{animation:ytPop .9s .1s cubic-bezier(.2,1.4,.4,1) both;display:flex;align-items:center;gap:.6em}.ytintro .ytmk{width:clamp(48px,10vw,92px);height:auto}.ytintro .ytwmk{width:clamp(130px,26vw,250px);height:auto}
.ytbug{position:absolute;right:2.2%;top:3.5%;z-index:2;display:flex;align-items:center;gap:4px;opacity:.85;pointer-events:none;filter:drop-shadow(0 1px 3px rgba(0,0,0,.6))}.ytbug img:first-child{height:clamp(18px,3.6vw,34px);width:auto}.ytbug img:last-child{height:clamp(10px,2vw,18px);width:auto}
.ytav img{width:38px;height:38px;border-radius:50%;background:var(--surface);display:block;object-fit:contain}
.ytbrand{letter-spacing:.32em;text-transform:uppercase;font-size:clamp(.6rem,1.4vw,.85rem);color:#d4a23a;animation:ytUp .7s .35s both}
.yttitle{font-family:Georgia,"Times New Roman",serif;font-size:clamp(1.05rem,3.6vw,2.2rem);line-height:1.15;animation:ytUp .8s .55s both}
.ytsub{font-size:clamp(.65rem,1.5vw,.9rem);opacity:.8;animation:ytUp .8s .8s both}
@keyframes ytInt{from{opacity:0}to{opacity:1}}@keyframes ytOut{to{opacity:0;transform:scale(1.06);visibility:hidden}}
@keyframes ytPop{from{opacity:0;transform:scale(.4) rotate(-10deg)}to{opacity:1;transform:none}}@keyframes ytUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.ytctl{background:#0f0a0c;padding:6px 10px 8px;display:flex;flex-direction:column;gap:6px}
.ytbar.flbar{display:flex;gap:3px;margin:0;height:5px}
.ytbar.flbar i{height:5px;border-radius:2px;background:rgba(255,255,255,.22);flex:1;position:relative;overflow:hidden;cursor:pointer}
.ytbar.flbar i b{position:absolute;left:0;top:0;bottom:0;background:#e0263f;display:block}
.ytbar.flbar i.done b{width:100%!important}
.ytbar.flbar i:hover{background:rgba(255,255,255,.4)}
.ytrow{display:flex;align-items:center;gap:4px;color:#fff;min-width:0}
.ytb{all:unset;cursor:pointer;color:#fff;min-width:34px;height:34px;display:inline-flex;align-items:center;justify-content:center;border-radius:8px;font-size:1rem}
.ytb:hover{background:rgba(255,255,255,.1)}.ytb[disabled]{opacity:.35;cursor:default}.ytb.big{font-size:1.15rem}
.ytb.txt{font-size:.78rem;font-weight:800;font-family:var(--f-mono);padding:0 6px}.ytb.txt.on{box-shadow:inset 0 -2px 0 #e0263f}
.yttime{font-family:var(--f-mono);font-size:.78rem;opacity:.9;white-space:nowrap;margin-left:4px}
.ytchn{font-size:.78rem;opacity:.65;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.ytsp{flex:1}
.ytmeta{display:flex;flex-direction:column;gap:10px}
.yth1{margin:4px 0 0;font-size:1.25rem;line-height:1.25}
.ytchan{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.ytchan>span:nth-child(2){display:flex;flex-direction:column;line-height:1.2}.ytchan small{opacity:.7;font-size:.78rem}
.ytav svg,.ytav img{width:38px;height:38px;border-radius:50%;background:var(--surface);display:block}
.ytpill{margin-left:auto;font-size:.78rem;background:var(--surface);border:1px solid var(--line);padding:4px 10px;border-radius:999px}
.ytdesc{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:12px 14px}.ytdesc h3{margin:4px 0 6px;font-size:1rem}.ytdesc p{margin:0;line-height:1.5}
.ytchh{margin:4px 0 0;font-size:1rem}
.ytchap{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:2px}
.ytchap button{all:unset;cursor:pointer;display:flex;gap:12px;align-items:baseline;padding:8px 10px;border-radius:8px;width:100%;box-sizing:border-box}
.ytchap button:hover{background:var(--surface)}.ytchap li.on button{background:color-mix(in srgb,#e0263f 12%,var(--surface));font-weight:700}.ytchap li.done{opacity:.7}
.ytts{font-family:var(--f-mono);font-size:.8rem;color:#c0263f;min-width:38px}
.film.yt.ytfs{position:fixed;inset:0;z-index:1000;background:#000;max-width:none;margin:0;padding:0;overflow:auto}
.film.yt.ytfs .ytplayer{border-radius:0}.film.yt.ytfs .ytstage{aspect-ratio:auto;height:calc(100vh - 92px)}
.ytplayer:fullscreen{display:flex;flex-direction:column;justify-content:center;border-radius:0}.ytplayer:fullscreen .ytstage{aspect-ratio:auto;flex:1}
.flcard .flthumb .fsvg .fxgr{display:none}
@media (max-width:560px){.ytchn{display:none}.ytb{min-width:30px;height:30px;font-size:.9rem}.ytb.txt{font-size:.7rem;padding:0 4px}.yttime{font-size:.7rem}.ytcc{bottom:3%;left:4%;right:4%}.ytcc span{font-size:.62rem;line-height:1.4}.ytl3t{font-size:.7rem}.ytl3n{font-size:.68rem}.ytctl{padding:4px 6px 6px}}
`; document.head.appendChild(st); }catch(e){}
