/* ---------- v122: polish — dark mode for the new parts, compact account button in the header, loading screen ---------- */
try{ const st34=document.createElement("style"); st34.textContent=`
/* dark theme: the new cards use the theme colours instead of fixed light ones */
:root[data-theme="dark"] .schome,:root[data-theme="dark"] .scmine,:root[data-theme="dark"] .sccard,:root[data-theme="dark"] .pabub,:root[data-theme="dark"] .obopt,:root[data-theme="dark"] .obbub,
:root[data-theme="dark"] .chcard,:root[data-theme="dark"] .chvs div,:root[data-theme="dark"] .prao,:root[data-theme="dark"] .prin,:root[data-theme="dark"] .prstats div,:root[data-theme="dark"] .prb,:root[data-theme="dark"] .obdate input{background:var(--surface)!important;color:var(--fg)!important}
:root[data-theme="dark"] .obopt.on{background:color-mix(in srgb,#c2185b 22%,var(--surface))!important}
:root[data-theme="dark"] .prb.on{background:color-mix(in srgb,#d4a23a 18%,var(--surface))!important}
:root[data-theme="dark"] .chbtn{background:color-mix(in srgb,#d4a23a 18%,var(--surface))!important;color:#f3d58c!important}
:root[data-theme="dark"] .obkept{background:color-mix(in srgb,#2e7d32 25%,var(--surface))!important;color:#b9e6bb!important}
:root[data-theme="dark"] .paall{background:var(--surface)!important}
:root[data-theme="dark"] .scic{background:color-mix(in srgb,#c2185b 20%,var(--surface))!important}
:root[data-theme="dark"] .panb.lock{background:#3a3034!important;box-shadow:0 7px 0 #2a2226!important}
:root[data-theme="dark"] .obgo[disabled]{background:#4a3c40!important;border-bottom-color:#3a2e32!important}
@media (prefers-color-scheme:dark){
:root:not([data-theme="light"]) .schome,:root:not([data-theme="light"]) .scmine,:root:not([data-theme="light"]) .sccard,:root:not([data-theme="light"]) .pabub,:root:not([data-theme="light"]) .obopt,:root:not([data-theme="light"]) .obbub,
:root:not([data-theme="light"]) .chcard,:root:not([data-theme="light"]) .chvs div,:root:not([data-theme="light"]) .prao,:root:not([data-theme="light"]) .prin,:root:not([data-theme="light"]) .prstats div,:root:not([data-theme="light"]) .prb,:root:not([data-theme="light"]) .obdate input{background:var(--surface)!important;color:var(--fg)!important}
:root:not([data-theme="light"]) .obopt.on{background:color-mix(in srgb,#c2185b 22%,var(--surface))!important}
:root:not([data-theme="light"]) .prb.on{background:color-mix(in srgb,#d4a23a 18%,var(--surface))!important}
:root:not([data-theme="light"]) .chbtn{background:color-mix(in srgb,#d4a23a 18%,var(--surface))!important;color:#f3d58c!important}
:root:not([data-theme="light"]) .obkept{background:color-mix(in srgb,#2e7d32 25%,var(--surface))!important;color:#b9e6bb!important}
:root:not([data-theme="light"]) .scic{background:color-mix(in srgb,#c2185b 20%,var(--surface))!important}
:root:not([data-theme="light"]) .panb.lock{background:#3a3034!important;box-shadow:0 7px 0 #2a2226!important}
:root:not([data-theme="light"]) .obgo[disabled]{background:#4a3c40!important;border-bottom-color:#3a2e32!important}}
/* header on phones: the account button becomes a round avatar, everything on one line */
@media (max-width:700px){
 .acct-btn{padding:0!important;width:40px;height:40px;justify-content:center;border-radius:50%!important;flex:none}
 .acct-btn span:not(.av){display:none}.acct-btn .av{width:30px!important;height:30px!important;font-size:.85rem!important}
 .acct-btn:not(:has(.av)):before{content:"👤";font-size:1.1rem}
}
#twg-splash{transition:opacity .35s}#twg-splash.gone{opacity:0;pointer-events:none}
`; document.head.appendChild(st34); }catch(e){}
/* loading screen: hide it as soon as the app has drawn its first page */
setTimeout(()=>{ const s=document.getElementById("twg-splash"); if(s){ s.classList.add("gone"); setTimeout(()=>s.remove(),400); } },60);
