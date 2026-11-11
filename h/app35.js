/* ---------- v123: softer dark theme (warm wine dusk, same palette as the site) + one "next step" card on Today ---------- */
try{ const st35=document.createElement("style");
const DK35=`--bg:#33232a;--surface:#402e36;--sunk:#4a3740;--line:#614b55;--line2:#735c66;
  --fg:#f8eef1;--fg2:#fffafb;--muted:#d2bfc5;--faint:#a48e96;
  --wine:#d04a72;--wine-d:#8c1d40;--wine-s:#4f2834;--accent-soft:#4f2834;
  --green-s:#2f3f25;--good-soft:#2f3f25;--bad-soft:#4d2a28;--blue-s:#2a3d48;--red-s:#4d2a28;
  --mland:#3d2d34;--mwater:#24393d`;
st35.textContent=`
@media (prefers-color-scheme:dark){html:root:not([data-theme="light"]){${DK35}}}
html:root[data-theme="dark"]{${DK35}}
:root[data-theme="dark"] body,:root[data-theme="dark"] .app{background:radial-gradient(1200px 600px at 80% -10%,#4a2b37 0%,transparent 60%),var(--bg)!important}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) body,:root:not([data-theme="light"]) .app{background:radial-gradient(1200px 600px at 80% -10%,#4a2b37 0%,transparent 60%),var(--bg)!important}
 :root:not([data-theme="light"]) .panb.lock{background:#54424a!important;box-shadow:0 7px 0 #3f3037!important}
 :root:not([data-theme="light"]) .obgo[disabled]{background:#5c4850!important;border-bottom-color:#47363d!important}}
:root[data-theme="dark"] .panb.lock{background:#54424a!important;box-shadow:0 7px 0 #3f3037!important}
:root[data-theme="dark"] .obgo[disabled]{background:#5c4850!important;border-bottom-color:#47363d!important}
`; document.head.appendChild(st35); }catch(e){}
/* Today: the path card already says what to do next — drop the second «next step» card */
{ const _rh35=renderHome; renderHome=function(){ const h=_rh35.apply(this,arguments);
    try{ return h.indexOf('class="pahome')>=0 ? h.replace(/<button type="button" class="hero2"[\s\S]*?<\/button>/,"") : h; }catch(e){ return h; } }; }
