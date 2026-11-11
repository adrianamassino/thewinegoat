/* ---------- v123: softer dark theme (warm wine dusk, same palette as the site) + one "next step" card on Today ---------- */
try{ const st35=document.createElement("style");
const DK35=`--bg:#3b1330;--surface:#4b1b3f;--sunk:#57224a;--line:#77335f;--line2:#8d4574;
  --fg:#fff4f8;--fg2:#ffffff;--muted:#f0cfdd;--faint:#c79db3;
  --wine:#ff6f98;--wine-d:#b0285a;--wine-s:#62204b;--accent-soft:#62204b;
  --green-s:#21483a;--good-soft:#21483a;--bad-soft:#5e2032;--blue-s:#263f63;--red-s:#5e2032;
  --mland:#4a1c3e;--mwater:#1f3f52`;
st35.textContent=`
@media (prefers-color-scheme:dark){html:root:not([data-theme="light"]){${DK35}}}
html:root[data-theme="dark"]{${DK35}}
:root[data-theme="dark"] body,:root[data-theme="dark"] .app{background:radial-gradient(1200px 600px at 80% -10%,#7a2357 0%,transparent 60%),var(--bg)!important}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) body,:root:not([data-theme="light"]) .app{background:radial-gradient(1200px 600px at 80% -10%,#7a2357 0%,transparent 60%),var(--bg)!important}
 :root:not([data-theme="light"]) .panb.lock{background:#68325a!important;box-shadow:0 7px 0 #4c2042!important}
 :root:not([data-theme="light"]) .obgo[disabled]{background:#6e3a60!important;border-bottom-color:#52274a!important}}
:root[data-theme="dark"] .panb.lock{background:#68325a!important;box-shadow:0 7px 0 #4c2042!important}
:root[data-theme="dark"] .obgo[disabled]{background:#6e3a60!important;border-bottom-color:#52274a!important}
`; document.head.appendChild(st35); }catch(e){}
/* Today: the path card already says what to do next — drop the second «next step» card */
{ const _rh35=renderHome; renderHome=function(){ const h=_rh35.apply(this,arguments);
    try{ return h.indexOf('class="pahome')>=0 ? h.replace(/<button type="button" class="hero2"[\s\S]*?<\/button>/,"") : h; }catch(e){ return h; } }; }
