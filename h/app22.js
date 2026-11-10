/* ---------- v105: in-app camera — shoot several pages in a row without leaving ---------- */
Object.assign(T.it,{phCam:"Fotocamera: più scatti di fila",phShot:"Scatta",phDoneN:"Fatto",phCamOff:"La fotocamera diretta non è disponibile qui: usa «Scatta o carica le foto».",phCamHint:"Inquadra una pagina e scatta, poi passa alla successiva. Quando hai finito premi «Fatto».",phCancel:"Annulla"});
Object.assign(T.fr,{phCam:"Appareil photo : plusieurs prises d'affilée",phShot:"Prendre",phDoneN:"Terminé",phCamOff:"L'appareil photo direct n'est pas disponible ici : utilisez « Prendre ou charger les photos ».",phCamHint:"Cadrez une page et prenez la photo, puis passez à la suivante. Quand vous avez fini, appuyez sur « Terminé ».",phCancel:"Annuler"});
Object.assign(T.en,{phCam:"Camera: several shots in a row",phShot:"Shoot",phDoneN:"Done",phCamOff:"The direct camera isn't available here: use “Take or upload photos”.",phCamHint:"Frame a page and shoot, then move on to the next one. Press “Done” when you've finished.",phCancel:"Cancel"});
let CAMOK=null, CAM=null;
function camAvail(){ return CAMOK!==false&&!!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia); }
function camMax(){ return PHCAP&&PHCAP.maxCount?PHCAP.maxCount:4; }
function camClose(){ if(!CAM) return; try{ CAM.stream.getTracks().forEach(t=>t.stop()); }catch(e){} try{ CAM.el.remove(); }catch(e){} document.body.style.overflow=""; CAM=null; render(); }
function camThumbs(){ if(!CAM) return; const n=PH.files.length, max=camMax();
  CAM.el.querySelector(".cmth").innerHTML=PH.urls.map(u=>`<img src="${u}" alt="">`).join("");
  CAM.el.querySelector(".cmn").textContent=n+" / "+max;
  CAM.el.querySelector(".cmshot").disabled=n>=max;
  CAM.el.querySelector(".cmdone").textContent=t("phDoneN")+(n?` (${n})`:""); }
async function camOpen(){
  let stream;
  try{ stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"},width:{ideal:2048},height:{ideal:1536}},audio:false}); }
  catch(e){ CAMOK=false; PH.msg=t("phCamOff"); PH.err=true; render(); return; }
  CAMOK=true;
  const el=document.createElement("div"); el.id="camov";
  el.innerHTML=`<div class="cmtop"><button type="button" class="cmx">${esc(t("phCancel"))}</button><span class="cmn"></span><button type="button" class="cmdone"></button></div>
   <video playsinline muted autoplay></video><p class="cmhint">${esc(t("phCamHint"))}</p>
   <div class="cmbot"><div class="cmth"></div><button type="button" class="cmshot" aria-label="${esc(t("phShot"))}"><span></span></button></div>`;
  document.body.appendChild(el); document.body.style.overflow="hidden";
  const v=el.querySelector("video"); v.srcObject=stream; try{ await v.play(); }catch(e){}
  CAM={el,stream,v,n0:PH.files.length}; camThumbs();
  el.querySelector(".cmx").onclick=()=>{ const n0=CAM.n0; PH.urls.slice(n0).forEach(u=>{try{URL.revokeObjectURL(u)}catch(e){}}); PH.files.length=n0; PH.urls.length=n0; camClose(); };
  el.querySelector(".cmdone").onclick=()=>camClose();
  el.querySelector(".cmshot").onclick=()=>{ if(!CAM||PH.files.length>=camMax()) return;
    const w=v.videoWidth||1280, h=v.videoHeight||960, c=document.createElement("canvas"); c.width=w; c.height=h; c.getContext("2d").drawImage(v,0,0,w,h);
    el.classList.add("flash"); setTimeout(()=>el.classList.remove("flash"),180);
    c.toBlob(b=>{ if(!b||!CAM) return; const f=new File([b],"pagina-"+(PH.files.length+1)+".jpg",{type:"image/jpeg"}); PH.files.push(f); PH.urls.push(URL.createObjectURL(f)); PH.msg=""; PH.err=false; camThumbs(); },"image/jpeg",0.88); };
}
document.addEventListener("click",e=>{ const b=e.target.closest&&e.target.closest("#ph-cam"); if(!b) return; e.preventDefault(); camOpen(); });
try{ const st22=document.createElement("style"); st22.textContent=`
#camov{position:fixed;inset:0;z-index:300;background:#000;display:flex;flex-direction:column;color:#fff}
#camov video{flex:1;min-height:0;width:100%;object-fit:contain;background:#000}
#camov.flash video{filter:brightness(2)}
.cmtop{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:calc(10px + env(safe-area-inset-top,0px)) 14px 10px}
.cmtop button{font:inherit;font-weight:800;border:0;border-radius:999px;padding:10px 16px;cursor:pointer}
.cmx{background:rgba(255,255,255,.15);color:#fff}.cmdone{background:#c2185b;color:#fff}
.cmn{font-weight:800;font-variant-numeric:tabular-nums}
.cmhint{margin:0;padding:6px 16px;text-align:center;font-size:.85rem;opacity:.8}
.cmbot{display:flex;align-items:center;gap:14px;padding:12px 16px calc(16px + env(safe-area-inset-bottom,0px))}
.cmth{flex:1;display:flex;gap:6px;overflow-x:auto;min-height:64px}
.cmth img{height:64px;width:48px;object-fit:cover;border-radius:6px;border:1px solid rgba(255,255,255,.4)}
.cmshot{width:74px;height:74px;border-radius:50%;border:4px solid #fff;background:transparent;padding:5px;cursor:pointer;flex:none}
.cmshot span{display:block;width:100%;height:100%;border-radius:50%;background:#fff}
.cmshot:disabled{opacity:.35}
`; document.head.appendChild(st22); }catch(e){}
