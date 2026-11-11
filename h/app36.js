/* ---------- v124: Stripe checkout (Payment Link) — full access, one payment, 12 months.
   The link and the prices come from TWG_CONFIG.stripe; the purchase is written by the server-side webhook
   into public.purchases, and the app only reads it (row-level security: each person sees their own). ---------- */
Object.assign(T.it,{buyT:"Accesso completo",buyD:"Tutte le 2.078 domande, le 101 domande aperte con correzione, le simulazioni d'esame, film, podcast e mappe. Un solo pagamento, accesso per 12 mesi, nessun abbonamento.",
 buyBtn:"Sblocca tutto · {p}",buyAcc:"Prima crea il profilo (1 minuto): così l'accesso resta legato al tuo account, su ogni dispositivo.",buySoon:"Il pagamento online sarà attivo a breve.",
 buySafe:"Pagamento sicuro con Stripe · carta, Apple Pay, Google Pay",proOn:"Accesso completo attivo fino al {d}",proOnS:"Accesso completo",paidAcc:"Grazie, pagamento ricevuto! Ora crea il tuo profilo con la stessa email del pagamento: l'accesso completo si attiva da solo.",paidWait:"Grazie! Pagamento ricevuto, sto attivando l'accesso…",paidOk:"Accesso completo attivato 🎉 Buono studio!",paidLate:"Pagamento ricevuto. L'attivazione può richiedere qualche minuto: riapri il profilo tra poco. Se non compare, scrivici."});
Object.assign(T.fr,{buyT:"Accès complet",buyD:"Les 2 078 questions, les 101 questions ouvertes corrigées, les examens blancs, films, podcasts et cartes. Un seul paiement, accès pendant 12 mois, sans abonnement.",
 buyBtn:"Tout débloquer · {p}",buyAcc:"Créez d'abord votre profil (1 minute) : l'accès reste lié à votre compte, sur tous vos appareils.",buySoon:"Le paiement en ligne sera bientôt disponible.",
 buySafe:"Paiement sécurisé par Stripe · carte, Apple Pay, Google Pay",proOn:"Accès complet actif jusqu'au {d}",proOnS:"Accès complet",paidAcc:"Merci, paiement reçu ! Créez maintenant votre profil avec l'e-mail utilisé pour le paiement : l'accès complet s'active tout seul.",paidWait:"Merci ! Paiement reçu, activation de l'accès…",paidOk:"Accès complet activé 🎉 Bonnes révisions !",paidLate:"Paiement reçu. L'activation peut prendre quelques minutes : rouvrez le profil dans un instant. Sinon, écrivez-nous."});
Object.assign(T.en,{buyT:"Full access",buyD:"All 2,078 questions, the 101 marked written questions, mock exams, films, podcasts and maps. One payment, 12 months of access, no subscription.",
 buyBtn:"Unlock everything · {p}",buyAcc:"First create your profile (1 minute) so your access stays with your account, on every device.",buySoon:"Online payment is coming very soon.",
 buySafe:"Secure payment with Stripe · card, Apple Pay, Google Pay",proOn:"Full access active until {d}",proOnS:"Full access",paidAcc:"Thank you, payment received! Now create your profile with the same email you paid with: full access unlocks automatically.",paidWait:"Thank you! Payment received, unlocking your access…",paidOk:"Full access unlocked 🎉 Happy studying!",paidLate:"Payment received. Activation can take a few minutes: reopen your profile shortly. If it doesn't appear, write to us."});
if(T.es) Object.assign(T.es,{buyT:"Acceso completo",buyD:"Las 2.078 preguntas, las 101 preguntas abiertas corregidas, los simulacros de examen, películas, pódcasts y mapas. Un solo pago, acceso durante 12 meses, sin suscripción.",
 buyBtn:"Desbloquear todo · {p}",buyAcc:"Primero crea tu perfil (1 minuto): así el acceso queda ligado a tu cuenta, en todos tus dispositivos.",buySoon:"El pago en línea estará disponible muy pronto.",
 buySafe:"Pago seguro con Stripe · tarjeta, Apple Pay, Google Pay",proOn:"Acceso completo activo hasta el {d}",proOnS:"Acceso completo",paidAcc:"¡Gracias, pago recibido! Ahora crea tu perfil con el mismo correo del pago: el acceso completo se activa solo.",paidWait:"¡Gracias! Pago recibido, activando el acceso…",paidOk:"Acceso completo activado 🎉 ¡Buen estudio!",paidLate:"Pago recibido. La activación puede tardar unos minutos: vuelve a abrir el perfil en un momento. Si no aparece, escríbenos."});

const PROK="wset3-pro", BUYK="wset3-buy-after";
const STR=(window.TWG_CONFIG&&window.TWG_CONFIG.stripe)||{};
let PRO=(()=>{ try{ return JSON.parse(lsGet(PROK)||"null")||{}; }catch(e){ return {}; } })();
const proActive=()=>!!(PRO.until&&new Date(PRO.until)>new Date());
window.twgPro=proActive;
const buyPrice=()=>{ const p=STR.price||{}; return p[lang]||p.default||(lang==="en"?"$69":"69 €"); };
async function proRefresh(){ const A=window.twgAccount; if(!A||!A.enabled()||!A.signedIn()) return false;
  try{ const sb=A.client(); const {data,error}=await sb.from("purchases").select("expires_at").eq("refunded",false).order("expires_at",{ascending:false}).limit(1);
    if(error) return false; const u=data&&data[0]?data[0].expires_at:null; const was=proActive();
    PRO=u?{until:u,chk:Date.now()}:{chk:Date.now()}; lsSet(PROK,JSON.stringify(PRO)); if(was!==proActive()&&typeof render==="function") render(); return proActive(); }catch(e){ return false; } }
function buyGo(){ const A=window.twgAccount;
  if(!STR.link){ buyBanner(t("buySoon")); return; }
  let u; try{ u=new URL(STR.link); }catch(e){ return; }
  if(A&&A.enabled&&A.enabled()&&A.signedIn()){ u.searchParams.set("client_reference_id",A.uid()); if(A.email()) u.searchParams.set("prefilled_email",A.email()); }
  const L={it:"it",fr:"fr",en:"en",es:"es"}[lang]; if(L) u.searchParams.set("locale",L);
  location.href=u.toString(); }
window.twgBuy=buyGo;
function buyBanner(msg,ok,ms){ let b=document.getElementById("buyban"); if(!b){ b=document.createElement("div"); b.id="buyban"; b.setAttribute("role","status"); document.body.appendChild(b); }
  b.className=ok?"ok":""; b.textContent=msg; b.classList.add("on"); clearTimeout(b._t); b._t=setTimeout(()=>b.classList.remove("on"),ms||(ok?5000:7000)); }
function buyCard(){ const fmt=d=>{ try{ return new Date(d).toLocaleDateString(lang,{day:"numeric",month:"long",year:"numeric"}); }catch(e){ return d; } };
  if(proActive()) return `<div class="buyc on"><span class="buyic">🏆</span><div><b>${esc(t("proOnS"))}</b><p>${esc(t("proOn").replace("{d}",fmt(PRO.until)))}</p></div></div>`;
  return `<div class="buyc"><div class="buyh"><span class="buyic">🍷</span><b>${esc(t("buyT"))}</b></div><p>${esc(t("buyD"))}</p>
    <button type="button" class="buygo" data-buy>${esc(t("buyBtn").replace("{p}",buyPrice()))}</button><small>🔒 ${esc(t("buySafe"))}</small></div>`; }
{ const _rp36=renderProfile; renderProfile=function(){ const h=_rp36.apply(this,arguments);
    try{ const i=h.indexOf('<button type="button" class="btn" data-predit>'); return i>0?h.slice(0,i)+buyCard()+h.slice(i):h+buyCard(); }catch(e){ return h; } }; }
document.addEventListener("click",e=>{ const b=e.target.closest&&e.target.closest("[data-buy]"); if(!b) return; e.preventDefault(); e.stopPropagation(); buyGo(); },true);
/* #go=buy from the site, #paid back from Stripe */
const BUYH0=location.hash||"";
async function buyHash(e){ const h=e&&e.newURL?(new URL(e.newURL).hash||""):(location.hash||BUYH0);
  if(/[#&]go=buy/.test(h)){ history.replaceState(null,"",location.pathname+location.search); if(typeof go==="function") go("profile"); setTimeout(buyGo,250); }
  else if(/[#&]paid/.test(h)){ history.replaceState(null,"",location.pathname+location.search); if(typeof go==="function") go("profile");
    const A=window.twgAccount;
    if(A&&A.enabled&&A.enabled()&&!A.signedIn()){ lsSet(BUYK,"paid"); buyBanner(t("paidAcc"),true,15000); setTimeout(()=>A.open(),600); return; }
    buyBanner(t("paidWait"),true); for(let i=0;i<20;i++){ if(A&&A.signedIn()&&await proRefresh()){ buyBanner(t("paidOk"),true); if(typeof go==="function") go("profile"); return; } await new Promise(r=>setTimeout(r,3000)); }
    buyBanner(t("paidLate")); } }
setTimeout(buyHash,120); window.addEventListener("hashchange",buyHash,true);
window.addEventListener("twg-account",()=>{ const A=window.twgAccount; if(!A||!A.signedIn()) return; proRefresh();
  if(lsGet(BUYK)==="paid"){ try{ localStorage.removeItem(BUYK); }catch(e){} buyBanner(t("paidWait"),true);
    (async()=>{ for(let i=0;i<20;i++){ if(await proRefresh()){ buyBanner(t("paidOk"),true); if(typeof go==="function") go("profile"); return; } await new Promise(r=>setTimeout(r,3000)); } buyBanner(t("paidLate")); })(); } });
setTimeout(()=>{ if(!PRO.chk||Date.now()-PRO.chk>6*3600*1000) proRefresh(); },2500);
try{ const st36=document.createElement("style"); st36.textContent=`
.buyc{margin:14px 0;padding:18px 18px 16px;border-radius:22px;color:#fff;background:radial-gradient(120% 140% at 0% 0%,#a3264f 0%,#7a1838 55%,#3e0f22 100%);box-shadow:0 18px 40px -24px rgba(62,15,34,.8)}
.buyh{display:flex;align-items:center;gap:10px}.buyh b{font:800 21px/1.2 Fraunces,Georgia,serif}.buyic{font-size:26px}
.buyc p{margin:8px 0 14px;color:#f6dfe5;line-height:1.45}.buyc small{display:block;margin-top:10px;color:#f0cfd9;font-size:12.5px}
.buygo{width:100%;border:0;border-radius:16px;padding:14px 16px;font:800 16px/1.2 inherit;font-family:inherit;color:#3e0f22;background:linear-gradient(180deg,#f3d48a,#d4a23a);box-shadow:0 5px 0 #a87b22;cursor:pointer}
.buygo:active{transform:translateY(3px);box-shadow:0 2px 0 #a87b22}
.buyc.on{display:flex;gap:12px;align-items:center;background:linear-gradient(135deg,#21483a,#2f6b50)}.buyc.on b{font-size:17px}.buyc.on p{margin:2px 0 0}
#buyban{position:fixed;left:50%;top:14px;width:max-content;transform:translate(-50%,-20px);opacity:0;z-index:9999;max-width:min(92vw,460px);padding:12px 16px;border-radius:16px;background:#3e0f22;color:#fff;font-weight:700;box-shadow:0 14px 30px -12px rgba(0,0,0,.5);transition:.3s;pointer-events:none}
#buyban.on{opacity:1;transform:translate(-50%,0)}#buyban.ok{background:#21483a}
`; document.head.appendChild(st36); }catch(e){}
