/* ---------- v123: softer dark theme (warm wine dusk, same palette as the site) + one "next step" card on Today ---------- */
try{ const st35=document.createElement("style");
const DK35=`--bg:#29242f;--surface:#353040;--sunk:#3d3749;--line:#4f475c;--line2:#5f566e;
  --fg:#f3eef6;--fg2:#ffffff;--muted:#d3cadb;--faint:#a49cb0;
  --wine:#e8849f;--wine-d:#a8506c;--wine-s:#46364a;--accent-soft:#46364a;
  --green-s:#2b4038;--good-soft:#2b4038;--bad-soft:#4a3036;--blue-s:#2e3a52;--red-s:#4a3036;
  --mland:#383244;--mwater:#24344a`;
st35.textContent=`
@media (prefers-color-scheme:dark){html:root:not([data-theme="light"]){${DK35}}}
html:root[data-theme="dark"]{${DK35}}
:root[data-theme="dark"] body,:root[data-theme="dark"] .app{background:radial-gradient(1200px 600px at 80% -10%,#3a3046 0%,transparent 60%),var(--bg)!important}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) body,:root:not([data-theme="light"]) .app{background:radial-gradient(1200px 600px at 80% -10%,#3a3046 0%,transparent 60%),var(--bg)!important}
 :root:not([data-theme="light"]) .panb.lock{background:#4b4357!important;box-shadow:0 7px 0 #37303f!important}
 :root:not([data-theme="light"]) .obgo[disabled]{background:#544b60!important;border-bottom-color:#3f3749!important}}
:root[data-theme="dark"] .panb.lock{background:#4b4357!important;box-shadow:0 7px 0 #37303f!important}
:root[data-theme="dark"] .obgo[disabled]{background:#544b60!important;border-bottom-color:#3f3749!important}
`; document.head.appendChild(st35); }catch(e){}
/* Today: the path card already says what to do next — drop the second «next step» card */
{ const _rh35=renderHome; renderHome=function(){ const h=_rh35.apply(this,arguments);
    try{ return h.indexOf('class="pahome')>=0 ? h.replace(/<button type="button" class="hero2"[\s\S]*?<\/button>/,"") : h; }catch(e){ return h; } }; }
/* v125: restful dark — softer cards (no saturated bordeaux blocks) */
try{ const st35b=document.createElement("style"); const R35=`
 .pahome.g-t{background:radial-gradient(130% 140% at 0% 0%,#7a5872,#4f3f5c 55%,#2f2938)!important}
 .pahome.g-r{background:radial-gradient(130% 140% at 0% 0%,#7d5266,#583f55 55%,#312a39)!important}
 .pahome.g-f{background:radial-gradient(130% 140% at 0% 0%,#4f7a6b,#365a57 55%,#24303a)!important}
 .pahome.g-s{background:radial-gradient(130% 140% at 0% 0%,#8a7650,#5e5040 55%,#302a33)!important}
 .pahome .pago{color:#5a3a52!important}
 .schome{border-color:var(--line2)!important;background:var(--surface)!important}`;
 st35b.textContent=`@media (prefers-color-scheme:dark){${R35.replace(/(^|\})\s*([^{}]+)\{/g,(m,a,sel)=>a+sel.split(",").map(x=>':root:not([data-theme="light"]) '+x.trim()).join(",")+"{")}}`+R35.replace(/(^|\})\s*([^{}]+)\{/g,(m,a,sel)=>a+sel.split(",").map(x=>':root[data-theme="dark"] '+x.trim()).join(",")+"{");
 document.head.appendChild(st35b); }catch(e){}
