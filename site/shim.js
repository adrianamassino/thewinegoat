/* The Wine Goat — standalone runtime: accounts (Supabase), cloud save, AI marking (serverless function) */
(function(){
  const C=window.TWG_CONFIG||{};
  const ON=!!(C.supabaseUrl&&C.supabaseAnonKey&&window.supabase);
  const sb=ON?window.supabase.createClient(C.supabaseUrl,C.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:"pkce"}}):null;
  let session=null;
  const ready=(async()=>{ if(!sb) return; try{ const {data}=await sb.auth.getSession(); session=data.session; }catch(e){} })();
  if(sb) sb.auth.onAuthStateChange((ev,s)=>{ const had=!!session; session=s;
    if(ev==="PASSWORD_RECOVERY"){ setTimeout(async()=>{ const np=prompt(tx("newpw")); if(np&&np.length>=8){ const {error}=await sb.auth.updateUser({password:np}); alert(error?tx("err")+" "+error.message:tx("pwok")); } },300); return; }
    if(ev==="SIGNED_IN"&&!had){ location.replace(location.pathname); }
    if(ev==="SIGNED_OUT"&&had){ location.replace(location.pathname); }
    paintBtn(); });
  const TABLE="user_docs";
  const docId=p=>p.split("/").slice(3).join("/");
  function mkDoc(path){ return {
    id:path.split("/").pop(), path,
    async get(){ const {data,error}=await sb.from(TABLE).select("data").eq("user_id",session.user.id).eq("doc_id",docId(path)).maybeSingle(); if(error) throw error; return {exists:!!data,id:path.split("/").pop(),data:()=>data&&data.data}; },
    async set(d){ const {error}=await sb.from(TABLE).upsert({user_id:session.user.id,doc_id:docId(path),data:d,updated_at:new Date().toISOString()},{onConflict:"user_id,doc_id"}); if(error) throw error; },
    async delete(){ const {error}=await sb.from(TABLE).delete().eq("user_id",session.user.id).eq("doc_id",docId(path)); if(error) throw error; } }; }
  const db={ doc:mkDoc, collection:(cp)=>({ doc:id=>mkDoc(cp+"/"+id), limit:()=>({ async get(){ const {data,error}=await sb.from(TABLE).select("doc_id,data").eq("user_id",session.user.id); if(error) throw error;
      const pre=docId(cp+"/x").slice(0,-1); const docs=(data||[]).filter(r=>r.doc_id.startsWith(pre)&&!r.doc_id.slice(pre.length).includes("/")).map(r=>({id:r.doc_id.slice(pre.length),data:()=>r.data})); return {docs,size:docs.length,empty:!docs.length}; } }) }) };
  const user={ id:async()=>session&&session.user.id, me:async()=>({id:session&&session.user.id,name:session&&session.user.email||""}), isOwner:()=>true, canEdit:()=>true };
  async function ai(input,opts,json){
    opts=opts||{}; if(!session) throw {code:"not_granted"};
    const r=await fetch(C.aiEndpoint||"/.netlify/functions/ai",{method:"POST",signal:opts.signal,headers:{"content-type":"application/json",authorization:"Bearer "+session.access_token},body:JSON.stringify({input,json:!!json})}).catch(e=>{ if(e&&e.name==="AbortError") throw {code:"cancelled"}; throw {code:"network"}; });
    if(r.status===429) throw {code:"rate_limited"}; if(r.status===401) throw {code:"not_granted"}; if(!r.ok) throw {code:"error"};
    const j=await r.json(); if(opts.onText) opts.onText({text:j.text,delta:j.text});
    if(json){ const m=String(j.text).match(/\{[\s\S]*\}/); if(!m) throw {code:"invalid_json"}; return JSON.parse(m[0]); }
    return {text:j.text,truncated:!!j.truncated};
  }
  const sample=(input,opts)=>ai(input,opts,false); sample.json=(input,opts)=>ai(input,opts,true); sample.limits=async()=>({images:false});
  if(!window.claude) window.claude={ use: async(n)=>{ await ready; if(!sb||!session) return null; return n==="db"?db:n==="user"?user:n==="sample"?(C.aiEndpoint===false?null:sample):null; } };

  /* ---- account UI ---- */
  const TX={
    it:{acc:"Accedi",newpw:"Nuova password (almeno 8 caratteri):",pwok:"Password aggiornata.",my:"Il mio account",title:"Il tuo account The Wine Goat",sub:"Crea il tuo profilo gratuito: progressi, piano di studio e percorso salvati e ritrovati su telefono e computer.",google:"Continua con Google",apple:"Continua con Apple",or:"oppure con l'email",email:"Email",pw:"Password (almeno 8 caratteri)",login:"Accedi",signup:"Crea account",magic:"Mandami un link di accesso",forgot:"Password dimenticata?",sent:"Controlla la tua email: ti abbiamo mandato un link.",confirm:"Account creato. Controlla la tua email per confermarlo.",reset:"Ti abbiamo mandato un'email per reimpostare la password.",signed:"Sei connessa come",out:"Esci",close:"Chiudi",off:"Gli account non sono ancora configurati su questo sito.",err:"Qualcosa non ha funzionato:",local:"I progressi fatti senza account verranno uniti al tuo account al primo accesso.",terms:"Accedendo accetti che i tuoi progressi vengano salvati nel tuo account."},
    fr:{acc:"Connexion",newpw:"Nouveau mot de passe (8 caractères min.) :",pwok:"Mot de passe mis à jour.",my:"Mon compte",title:"Votre compte The Wine Goat",sub:"Créez votre profil gratuit : progrès, plan de révision et parcours enregistrés et retrouvés sur téléphone et ordinateur.",google:"Continuer avec Google",apple:"Continuer avec Apple",or:"ou avec votre e-mail",email:"E-mail",pw:"Mot de passe (8 caractères min.)",login:"Se connecter",signup:"Créer un compte",magic:"Recevoir un lien de connexion",forgot:"Mot de passe oublié ?",sent:"Vérifiez vos e-mails : nous vous avons envoyé un lien.",confirm:"Compte créé. Vérifiez vos e-mails pour le confirmer.",reset:"Nous vous avons envoyé un e-mail pour réinitialiser le mot de passe.",signed:"Connectée en tant que",out:"Se déconnecter",close:"Fermer",off:"Les comptes ne sont pas encore configurés sur ce site.",err:"Un problème est survenu :",local:"Les progrès faits sans compte seront fusionnés avec votre compte à la première connexion.",terms:"En vous connectant, vous acceptez que vos progrès soient enregistrés dans votre compte."},
    en:{acc:"Sign in",newpw:"New password (at least 8 characters):",pwok:"Password updated.",my:"My account",title:"Your The Wine Goat account",sub:"Create your free profile: progress, study plan and path saved and waiting for you on phone and computer.",google:"Continue with Google",apple:"Continue with Apple",or:"or with email",email:"Email",pw:"Password (at least 8 characters)",login:"Sign in",signup:"Create account",magic:"Email me a sign-in link",forgot:"Forgot password?",sent:"Check your email: we sent you a link.",confirm:"Account created. Check your email to confirm it.",reset:"We sent you an email to reset your password.",signed:"Signed in as",out:"Sign out",close:"Close",off:"Accounts are not configured on this site yet.",err:"Something went wrong:",local:"Progress made without an account will be merged into your account the first time you sign in.",terms:"By signing in you agree that your progress is stored in your account."}};
  const tx=k=>{ let l="fr"; try{ l=localStorage.getItem("wset3-lang")||"fr"; }catch(e){} return (TX[l]||TX.fr)[k]; };
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const css=`.acct-btn{border:1px solid var(--line);background:var(--surface);color:var(--fg);border-radius:999px;padding:6px 12px;font-weight:600;font-size:.82rem;display:flex;gap:6px;align-items:center;max-width:46vw;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .acct-btn .av{width:22px;height:22px;border-radius:50%;background:var(--accent);color:var(--on-accent);display:inline-flex;align-items:center;justify-content:center;font-size:.72rem;flex:none}
  .acct-bg{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:200;display:flex;align-items:center;justify-content:center;padding:16px}
  .acct{background:var(--surface);color:var(--fg);width:100%;max-width:420px;border-radius:18px;padding:22px;display:flex;flex-direction:column;gap:12px;max-height:92vh;overflow:auto;box-shadow:0 12px 40px rgba(0,0,0,.25)}
  .acct h2{margin:0;font-family:"Cormorant Garamond",var(--f-display);font-size:1.6rem;color:var(--accent)}
  .acct p{margin:0;font-size:.88rem;color:var(--muted)}
  .acct .prov{display:flex;gap:10px;align-items:center;justify-content:center;width:100%;padding:11px;border-radius:10px;border:1px solid var(--line);background:var(--bg);color:var(--fg);font-weight:600;font-size:.95rem}
  .acct .prov.apple{background:#000;color:#fff;border-color:#000}
  .acct .or{display:flex;align-items:center;gap:10px;color:var(--muted);font-size:.78rem}.acct .or:before,.acct .or:after{content:"";flex:1;height:1px;background:var(--line)}
  .acct input{font:inherit;font-size:16px;padding:11px 12px;border-radius:10px;border:1px solid var(--line);background:var(--bg);color:var(--fg)}
  .acct .seg2{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--line);border-radius:10px;overflow:hidden}.acct .seg2 button{border:0;background:var(--bg);color:var(--fg);padding:9px;font-weight:600}.acct .seg2 button[aria-pressed="true"]{background:var(--fg);color:var(--bg)}
  .acct .go{padding:12px;border-radius:10px;border:0;background:var(--accent);color:var(--on-accent);font-weight:700;font-size:.95rem}
  .acct .lnk{border:0;background:none;color:var(--accent);font-weight:600;padding:0;font-size:.85rem;text-align:left}
  .acct .msg{font-size:.85rem;color:var(--good)}.acct .msg.e{color:var(--bad)}.acct .x{align-self:flex-end;border:0;background:none;font-size:1.2rem;color:var(--muted)}`;
  const G=`<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>`;
  const A=`<svg width="16" height="18" viewBox="0 0 814 1000" aria-hidden="true"><path fill="currentColor" d="M788 341c-6 4-108 62-108 190 0 148 130 200 134 202-1 3-21 72-69 142-43 62-88 124-156 124s-86-40-165-40c-77 0-104 41-166 41s-106-57-156-127C45 791 0 666 0 548 0 358 124 257 246 257c65 0 119 43 160 43 39 0 100-45 174-45 28 0 129 3 197 86zM558 159c31-37 53-88 53-139 0-7-1-14-2-20-50 2-110 34-146 76-28 32-55 83-55 135 0 8 1 15 2 18 3 1 9 1 14 1 45 0 101-30 134-71z"/></svg>`;
  let mode="signup";
  function paintBtn(){ const b=document.getElementById("acct-btn"); if(!b) return;
    if(session){ const e=session.user.email||""; b.innerHTML=`<span class="av">${esc((e[0]||"?").toUpperCase())}</span><span>${esc(tx("my"))}</span>`; }
    else b.innerHTML=`<span>${esc(tx("acc"))}</span>`; }
  function open(msg,err){
    close(); const bg=document.createElement("div"); bg.className="acct-bg"; bg.id="acct-bg";
    let h=`<div class="acct" role="dialog" aria-modal="true" aria-label="${esc(tx("title"))}"><button class="x" data-a="close" aria-label="${esc(tx("close"))}">✕</button><h2>The Wine Goat</h2>`;
    if(!sb) h+=`<p>${esc(tx("off"))}</p>`;
    else if(session) h+=`<p>${esc(tx("signed"))}</p><b>${esc(session.user.email||"")}</b><button class="go" data-a="out">${esc(tx("out"))}</button>`;
    else h+=`<p>${esc(tx("sub"))}</p>
      ${(C.providers||[]).includes("google")?`<button class="prov" data-a="google">${G}${esc(tx("google"))}</button>`:""}${(C.providers||[]).includes("apple")?`<button class="prov apple" data-a="apple">${A}${esc(tx("apple"))}</button>`:""}${(C.providers||[]).length?`<div class="or">${esc(tx("or"))}</div>`:""}
      <div class="seg2"><button data-a="m-login" aria-pressed="${mode==="login"}">${esc(tx("login"))}</button><button data-a="m-signup" aria-pressed="${mode==="signup"}">${esc(tx("signup"))}</button></div>
      <form id="acct-f" style="display:flex;flex-direction:column;gap:10px"><input type="email" id="acct-e" placeholder="${esc(tx("email"))}" autocomplete="email" required><input type="password" id="acct-p" placeholder="${esc(tx("pw"))}" minlength="8" autocomplete="${mode==="login"?"current-password":"new-password"}" required><button class="go">${esc(mode==="login"?tx("login"):tx("signup"))}</button></form>
      <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><button class="lnk" data-a="magic">${esc(tx("magic"))}</button>${mode==="login"?`<button class="lnk" data-a="forgot">${esc(tx("forgot"))}</button>`:""}</div>
      <p style="font-size:.76rem">${esc(tx("local"))} ${esc(tx("terms"))}</p>`;
    if(msg) h+=`<div class="msg ${err?"e":""}">${esc(msg)}</div>`;
    h+=`</div>`; bg.innerHTML=h; document.body.appendChild(bg);
    bg.addEventListener("click",async e=>{ if(e.target===bg) return close(); const a=e.target.closest("[data-a]"); if(!a) return; const k=a.dataset.a;
      const em=()=>(document.getElementById("acct-e")||{}).value||"";
      try{
        if(k==="close") close();
        else if(k==="out"){ await sb.auth.signOut(); }
        else if(k==="google"||k==="apple"){ const {error}=await sb.auth.signInWithOAuth({provider:k,options:{redirectTo:location.origin+location.pathname}}); if(error) throw error; }
        else if(k==="m-login"||k==="m-signup"){ mode=k.slice(2); open(); }
        else if(k==="magic"){ if(!em()) return document.getElementById("acct-e").focus(); const {error}=await sb.auth.signInWithOtp({email:em(),options:{emailRedirectTo:location.origin+location.pathname}}); if(error) throw error; open(tx("sent")); }
        else if(k==="forgot"){ if(!em()) return document.getElementById("acct-e").focus(); const {error}=await sb.auth.resetPasswordForEmail(em(),{redirectTo:location.origin+location.pathname}); if(error) throw error; open(tx("reset")); }
      }catch(err){ open(tx("err")+" "+(err.message||err),true); } });
    const f=document.getElementById("acct-f"); if(f) f.onsubmit=async e=>{ e.preventDefault(); const em=document.getElementById("acct-e").value, pw=document.getElementById("acct-p").value;
      try{ if(mode==="login"){ const {error}=await sb.auth.signInWithPassword({email:em,password:pw}); if(error) throw error; }
        else { const {data,error}=await sb.auth.signUp({email:em,password:pw,options:{emailRedirectTo:location.origin+location.pathname}}); if(error) throw error; if(!data.session) open(tx("confirm")); } }
      catch(err){ open(tx("err")+" "+(err.message||err),true); } };
  }
  function close(){ const b=document.getElementById("acct-bg"); if(b) b.remove(); }
  window.twgAccount={ enabled:()=>!!sb, signedIn:()=>!!session, email:()=>session&&session.user&&session.user.email||"", open:()=>open(), ready };
  if(sb) sb.auth.onAuthStateChange(()=>{ try{ window.dispatchEvent(new Event("twg-account")); }catch(e){} });
  function mount(){ const st=document.createElement("style"); st.textContent=css; document.head.appendChild(st);
    const langs=document.querySelector(".langs"); if(!langs) return; const b=document.createElement("button"); b.id="acct-btn"; b.className="acct-btn"; b.type="button"; b.onclick=()=>open(); langs.parentNode.insertBefore(b,langs);
    paintBtn(); document.querySelectorAll(".langs button").forEach(x=>x.addEventListener("click",()=>setTimeout(paintBtn,0))); ready.then(paintBtn);
    if(/[?&#](error_description)=/.test(location.href)) open(decodeURIComponent((location.href.match(/error_description=([^&]+)/)||[])[1]||"").replace(/\+/g," "),true); }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",mount); else mount();
})();
