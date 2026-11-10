import re
h = open('live.html').read()
def rep(a, b, c=1):
    global h
    assert h.count(a) == c, (a[:90], h.count(a)); h = h.replace(a, b)
# fonts
m = re.search(r'<link rel="stylesheet" href="https://fonts.googleapis.com/css2\?[^"]*">', h)
h = h[:m.start()] + '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,800;1,9..144,600&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,800&display=swap">' + h[m.end():]
# css: append at end of main stylesheet
css = open('duo.css').read()
s0 = h.index('<style>\n/* Layout:'); s1 = h.index('</style>', s0)
if '/* ================= DUO SKIN' in h[s0:s1]:
    a = h.index('/* ================= DUO SKIN', s0); h = h[:a] + css.lstrip('\n') + h[s1:]
else:
    h = h[:s1] + css + h[s1:]
IC_T = '<svg viewBox="0 0 32 32"><path d="M3 7.5c4.5-1.8 9-1.2 13 1.5v18.5c-4-2.7-8.5-3.3-13-1.5z" fill="#5e8c31"/><path d="M29 7.5c-4.5-1.8-9-1.2-13 1.5v18.5c4-2.7 8.5-3.3 13-1.5z" fill="#44691f"/></svg>'
IC = {
 'home': '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 14.5 16 5.5l11 9V26a1.5 1.5 0 0 1-1.5 1.5H19.5v-7h-7v7H6.5A1.5 1.5 0 0 1 5 26z"/></svg>',
 'train': '<svg viewBox="0 0 32 32"><rect x="2.5" y="11" width="5" height="10" rx="2" fill="#1f6f6b"/><rect x="24.5" y="11" width="5" height="10" rx="2" fill="#1f6f6b"/><rect x="6.5" y="7" width="5" height="18" rx="2.2" fill="#15524f"/><rect x="20.5" y="7" width="5" height="18" rx="2.2" fill="#15524f"/><rect x="11" y="14" width="10" height="4" rx="1" fill="#b9a9a0"/></svg>',
 'exam': '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M10 4h12c0 8.5-2.7 12.5-6 12.5S10 12.5 10 4z"/><path d="M16 16.5V26M11 27.5h10"/><path d="M10.6 9h10.8"/></svg>',
 'errors': '<svg viewBox="0 0 32 32"><path d="M16 28.5S3 21 3 11.8A6.6 6.6 0 0 1 16 8.4a6.6 6.6 0 0 1 13 3.4C29 21 16 28.5 16 28.5z" fill="#b5334a"/><path d="M11 16.5a5 5 0 0 1 8.6-3.4M21 16.5a5 5 0 0 1-8.6 3.4" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M19.8 10.4v3h-3M12.2 22.6v-3h3" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 'study': '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="12.5" r="8"/><path d="M12.5 12.5l2.5 2.5 4.5-5"/><path d="M11 19.5 9 29l7-3.5 7 3.5-2-9.5"/></svg>',
 'wine': '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.4"/><circle cx="19.5" cy="12" r="3.4"/><circle cx="15.8" cy="18.3" r="3.4"/><circle cx="9" cy="18.6" r="3"/><circle cx="22.6" cy="18.6" r="3"/><circle cx="15.8" cy="24.8" r="3"/><path d="M15.8 8.6V5.5c0-1.4 1.6-2.6 4.6-2.6"/></svg>',
 'play': '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="9.5" width="26" height="15" rx="7.5"/><path d="M10 14v6M7 17h6"/><circle cx="21" cy="15.5" r="1.2" fill="currentColor"/><circle cx="24" cy="19" r="1.2" fill="currentColor"/></svg>',
 'me': '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="11" r="5.5"/><path d="M5.5 27.5c1.4-5.6 5.6-8.5 10.5-8.5s9.1 2.9 10.5 8.5"/></svg>',
 'history': '<svg viewBox="0 0 32 32"><rect x="3.5" y="16" width="7" height="13" rx="2.2" fill="#8e5ba8"/><rect x="12.5" y="9" width="7" height="20" rx="2.2" fill="#6b2d5c"/><rect x="21.5" y="3" width="7" height="26" rx="2.2" fill="#8e5ba8"/></svg>',
}
old_nav = h[h.index('    <nav class="tabs" role="tablist">'):h.index('    </nav>\n  </header>') + len('    </nav>\n  </header>')]
new_nav = '    <nav class="tabs" role="tablist">\n' + ''.join(
    '      <button role="tab" id="tab-%s" data-v="%s"><i class="ti" aria-hidden="true">%s</i><span class="tl"></span>%s</button>\n' % (k, k, IC[k], '<span class="badge" id="err-badge"></span>' if k == 'me' else '')
    for k in ('home', 'study', 'wine', 'play', 'me')) + '    </nav>\n  </header>'
h = h.replace(old_nav, new_nav)
if 'class="wmt"' not in h:
    rep('<small id="t-sub" hidden></small></span></a>', '<small id="t-sub" hidden></small></span><span class="wmt"><small>the</small>winegoat</span></a>')
    rep('<div class="sync"><span class="dot" id="sync-dot"></span>', '<div class="pills" id="pills"></div>\n      <div class="sync"><span class="dot" id="sync-dot"></span>')
    rep('  <footer class="gfoot" id="gfoot"></footer>\n</div>', '  <footer class="gfoot" id="gfoot"></footer>\n</div>\n<aside class="rail" id="rail" aria-label="Stats"></aside>')
    rep('  ["home","train","exam","history"].forEach(v=>$("#tab-"+v).textContent=t(v));\n  $("#tab-errors span").textContent=t("revTab");',
        '  ["home","train","exam","history"].forEach(v=>$("#tab-"+v+" .tl").textContent=t(v));\n  $("#tab-errors .tl").textContent=t("revTab");')
    rep('  updateBadge(); setSync(syncState);\n}', '  updateBadge(); setSync(syncState); try{ paintRail(); }catch(e){}\n}')
    RAIL = r'''
/* ---------- duo shell: stat pills + right rail ---------- */
const SV={st:'<svg viewBox="0 0 24 24"><path d="M12 1.5c1.2 4.2 6.5 6.2 6.5 12.5a6.5 6.5 0 0 1-13 0c0-3.2 2-5.4 3.2-6.4 0 2.2 1 3.3 2.2 3.3 0-3.2-1.2-6.2 1.1-9.4z" fill="#d9774b"/><path d="M12 13c1.1 2 3.2 3.1 3.2 5.2a3.2 3.2 0 0 1-6.4 0c0-1.2 1-2.2 1.6-2.7.2 1 .9 1.6 1.6 1.6 0-1.6-.6-2.6 0-4.1z" fill="#d4a23a"/></svg>',
 xp:'<svg viewBox="0 0 24 24"><path d="M13.5 1.5 4 14h7l-1.5 8.5L19 10h-7z" fill="#d4a23a" stroke="#a87b1e" stroke-width="1.2" stroke-linejoin="round"/></svg>',
 he:'<svg viewBox="0 0 24 24"><path d="M12 21S2.5 15.4 2.5 8.6A4.9 4.9 0 0 1 12 6.2a4.9 4.9 0 0 1 9.5 2.4C21.5 15.4 12 21 12 21z" fill="#b5334a"/><path d="M7 8.5a2.4 2.4 0 0 1 2.6-2" stroke="#fff" stroke-opacity=".6" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>',
 goal:'<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="17" fill="#d4a23a"/><circle cx="20" cy="20" r="11" fill="#fff"/><circle cx="20" cy="20" r="5" fill="#b5334a"/></svg>',
 maps:'<svg viewBox="0 0 40 40"><path d="M4 9l10-4 12 4 10-4v26l-10 4-12-4-10 4z" fill="#1f6f6b"/><path d="M14 5v26M26 9v26" stroke="#15524f" stroke-width="2"/><circle cx="21" cy="17" r="4" fill="#b5334a"/></svg>',
 grape:'<svg viewBox="0 0 40 40"><g fill="#6b2d5c"><circle cx="14" cy="16" r="5"/><circle cx="24" cy="16" r="5"/><circle cx="19" cy="24" r="5"/><circle cx="9" cy="23" r="4.5"/><circle cx="29" cy="23" r="4.5"/><circle cx="14" cy="31" r="4.5"/><circle cx="24" cy="31" r="4.5"/></g><path d="M19 11c0-4 3-6 6-7" stroke="#44691f" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M22 6c4-2 8 0 9 3-4 1-7 0-9-3z" fill="#5e8c31"/></svg>'};
function duoDays(){ const s=new Set([...(MT.days||[]),...((MAPP&&MAPP._days)||[])]); (P.s||[]).forEach(x=>{ if(x&&x.t) s.add(dayKey(x.t)); }); return s; }
function duoStreak(){ const s=duoDays(); let n=0, d=Date.now(); if(!s.has(dayKey(d))) d-=DAY; while(s.has(dayKey(d))){ n++; d-=DAY; } return n; }
function duoXP(){ let c=0; Object.keys(P.q||{}).forEach(id=>{ const v=P.q[id]; if(v) c+=(v[1]||0); }); return (MT.xp||0)+c*2+(P.s||[]).length*5; }
function duoToday(){ const k=dayKey(Date.now()); return (P.s||[]).filter(x=>x&&x.t&&dayKey(x.t)===k).length+((MT.dl&&MT.dl.d===k)?MT.dl.n:0); }
const DGOAL=3;
function paintRail(){ const st=duoStreak(), xp=duoXP(), er=activeErrs().length;
  const pills=`<span class="pill st ${st?"":"off"}" title="${esc(t("duoStreak"))}">${SV.st}<b>${st}</b></span><span class="pill xp" title="XP">${SV.xp}<b>${xp}</b></span><span class="pill he ${er?"":"off"}" title="${esc(t("revTab"))}">${SV.he}<b>${er}</b></span>`;
  const p=$("#pills"); if(p) p.innerHTML=pills;
  const r=$("#rail"); if(!r) return; const td=duoToday(), pc=Math.min(1,td/DGOAL);
  const mp=Object.keys(MAPP||{}).filter(k=>!k.startsWith("_")&&MBY[k]).length;
  const gm=GRAPES.filter(g=>gMast(g.k)>=1).length;
  r.innerHTML=`<div class="pills">${pills}</div>
   <div class="rcard"><div class="rrow"><h3>${t("duoGoal")}</h3><button type="button" class="rlink" data-rgo="practice">${t("duoGo")}</button></div>
     <div class="rq">${SV.goal}<div><b>${t("duoGoalD").replace("{N}",DGOAL)}</b><div class="rbar"><i style="width:${Math.round(pc*100)}%"></i></div><span class="muted" style="font-size:.85rem">${Math.min(td,DGOAL)} / ${DGOAL}</span></div></div></div>
   <div class="rcard"><div class="rrow"><h3>${t("duoQuests")}</h3></div>
     <div class="rq">${SV.grape}<div><b>${t("tr_match")}</b><div class="rbar"><i style="width:${Math.round(gm/GRAPES.length*100)}%;background:var(--purple)"></i></div><button type="button" class="rlink" data-rgo="match">${gm} / ${GRAPES.length} ${t("duoGrapes")}</button></div></div>
     <div class="rq">${SV.maps}<div><b>${t("tr_maps")}</b><div class="rbar"><i style="width:${Math.round(mp/MAPS.length*100)}%;background:var(--blue)"></i></div><button type="button" class="rlink" data-rgo="maps">${mp} / ${MAPS.length} ${t("duoMaps")}</button></div></div>
     <div class="rq">${SV.he}<div><b>${t("revTab")}</b><div class="rbar"><i style="width:${er?100:0}%;background:var(--red)"></i></div><button type="button" class="rlink" data-rgo="errors">${er} ${t("duoErr")}</button></div></div></div>
   <div class="rcard rgoal">${gfree("n12",64)}<p>${t("duoTip")}</p></div>`; }
document.addEventListener("click",e=>{ const b=e.target.closest("[data-rgo]"); if(!b) return; const v=b.dataset.rgo; quiz=null; mg=null; ML=null; oq=null;
  if(TRAIN.includes(v)){ view=trainV=v; lsSet("wset3-trainv",trainV); } else view=v; render(); });
'''
    rep('/* ---------- grape profiles + matching game ---------- */', RAIL + '/* ---------- grape profiles + matching game ---------- */')
    import json
    S = {'it': {"duoStreak": "Giorni di fila", "duoGoal": "Obiettivo del giorno", "duoGo": "Inizia", "duoGoalD": "Completa {N} sessioni oggi", "duoQuests": "I tuoi progressi", "duoGrapes": "vitigni", "duoMaps": "mappe iniziate", "duoErr": "errori da ripassare", "duoTip": "Un po' ogni giorno: anche 10 minuti tengono viva la serie!"},
         'fr': {"duoStreak": "Jours d'affilée", "duoGoal": "Objectif du jour", "duoGo": "Commencer", "duoGoalD": "Terminez {N} sessions aujourd'hui", "duoQuests": "Vos progrès", "duoGrapes": "cépages", "duoMaps": "cartes commencées", "duoErr": "erreurs à revoir", "duoTip": "Un peu chaque jour : même 10 minutes entretiennent la série !"},
         'en': {"duoStreak": "Day streak", "duoGoal": "Daily goal", "duoGo": "Start", "duoGoalD": "Complete {N} sessions today", "duoQuests": "Your progress", "duoGrapes": "grapes", "duoMaps": "maps started", "duoErr": "mistakes to review", "duoTip": "A little every day: even 10 minutes keeps your streak alive!"}}
    i = h.index('Object.assign(T.en,{"train"'); j = h.index('\n', i) + 1
    h = h[:j] + ''.join('Object.assign(T.%s,%s);\n' % (k, json.dumps(v, ensure_ascii=False)) for k, v in S.items()) + h[j:]
open('live.html', 'w').write(h); print('ok')
