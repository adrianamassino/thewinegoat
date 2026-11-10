import json
h=open('live.html').read()
def rep(a,b):
    global h
    assert h.count(a)==1,a[:80]; h=h.replace(a,b)
rep('const TRAIN=["practice","open","sat","maps","grapes","match"];','const TRAIN=["practice","open","sat","maps","grapes","schemi","match"];')
rep('grapes:"n11",match:"n26"}[v]','grapes:"n11",schemi:"n27",match:"n26"}[v]')
rep('grapes:renderGrapes,match:renderMatch,','grapes:renderGrapes,schemi:renderSchemi,match:renderMatch,')
rep('if(view==="grapes"&&gvQ) gvFilter();','if(view==="grapes"&&gvQ) gvFilter(); if(view==="schemi"&&scQ) scFilter();')
rep('.tnav{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}','.tnav{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}')
CSS='''
/* schemi */
.sclist{display:flex;flex-direction:column;gap:10px;margin-top:14px}
.scc{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);overflow:hidden}
.scc>summary{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;padding:16px 18px;cursor:pointer;list-style:none;border-left:6px solid var(--accent)}
.scc.g>summary{border-left-width:0;align-items:center;padding:12px 16px}
.scc>summary::-webkit-details-marker,.screg>summary::-webkit-details-marker{display:none}
.scname{font-family:var(--s,serif);font-size:1.45rem;font-weight:700;color:var(--accent)}.scc.g .scname{font-size:1.1rem;color:var(--fg)}
.scmeta{font-size:.82rem}
.scbody{padding:0 18px 16px;display:flex;flex-direction:column;gap:10px}
.sclaw{margin:0;font-size:.88rem;line-height:1.5;background:var(--sunk);padding:10px 12px;border-radius:8px}
.sctop{display:flex;flex-direction:column;gap:4px}
.screg{border:1px solid var(--line);border-radius:10px;background:var(--bg)}
.screg>summary{display:flex;justify-content:space-between;gap:10px;padding:10px 14px;cursor:pointer;list-style:none;font-size:1.02rem}
.screg[open]>summary{border-bottom:1px solid var(--line)}
.schead{border-bottom:2px solid var(--accent)}
.scr{padding:10px 14px;border-bottom:1px solid var(--line);display:flex;flex-direction:column;gap:5px}.scr:last-child{border-bottom:0}
.scr.umb{background:color-mix(in srgb,var(--accent) 5%,transparent)}
.scrh{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.scn{border:0;background:none;padding:0;font:inherit;font-weight:700;color:var(--fg);text-align:left;cursor:pointer;text-decoration:underline dotted var(--muted);text-underline-offset:3px}
.scn.sm{font-weight:500;font-size:.88rem;margin-right:10px}.scn.p{font-weight:700}.scn i{color:var(--muted)}
.scn.hit,.scg.hit{background:color-mix(in srgb,var(--warn) 30%,transparent);border-radius:4px}
.sct{font-size:.7rem}
.scgs{display:flex;flex-wrap:wrap;gap:5px}
.scg{font-size:.78rem;padding:2px 9px;border-radius:999px;border:1px solid var(--line);background:var(--surface);color:var(--fg);cursor:pointer}
.scg.w{border-color:#cdb85a}.scg.b{border-color:#7a1f3d}.scg.p{font-weight:700}.scg.b.p{background:#7a1f3d;color:#fff}.scg.w.p{background:#e9d98a;color:#3a3000}
.scx{margin:0;font-size:.85rem;line-height:1.5;color:var(--muted);max-width:80ch}
.scgc h4{margin:6px 0;font-size:1rem;color:var(--accent)}
.scgr{display:grid;grid-template-columns:180px 1fr;gap:10px;padding:6px 0;border-top:1px solid var(--line);font-size:.88rem}
.scgrn{color:var(--muted);font-weight:600}
@media (max-width:600px){.scgr{grid-template-columns:1fr;gap:2px}.scname{font-size:1.25rem}.scbody{padding:0 10px 12px}}
'''
i=h.index('</style>',h.index('/* grapes + match */')); h=h[:i]+CSS+h[i:]
S={'it':{"tr_schemi":"Schemi","trd_schemi":"Paesi → regioni → denominazioni, e vitigni → paesi","scByC":"Per paese","scByG":"Per vitigno",
 "scIntroC":"Ogni paese con le sue regioni e denominazioni: tipo (AOC, DOCG, AVA…), uve (in grassetto la principale) e caratteristiche dal manuale. Tocca un nome per vederlo sulla mappa, un'uva per lo schema di quel vitigno.",
 "scIntroG":"Ogni vitigno con i paesi, le regioni e le denominazioni dove compare nel manuale. In grassetto le zone dove è l'uva principale.",
 "scSearch":"Cerca paese, regione, denominazione o uva…","scOpenAll":"Apri/chiudi tutto","scTop":"Vitigni principali","scMain":"Regioni principali","scApp":"denominazioni/zone","scSheet":"Scheda"},
 'fr':{"tr_schemi":"Schémas","trd_schemi":"Pays → régions → appellations, et cépages → pays","scByC":"Par pays","scByG":"Par cépage",
 "scIntroC":"Chaque pays avec ses régions et appellations : type (AOC, DOCG, AVA…), cépages (en gras le principal) et caractéristiques du manuel. Touchez un nom pour le voir sur la carte, un cépage pour son schéma.",
 "scIntroG":"Chaque cépage avec les pays, régions et appellations où il apparaît dans le manuel. En gras les zones où il est le cépage principal.",
 "scSearch":"Chercher un pays, une région, une appellation ou un cépage…","scOpenAll":"Tout ouvrir/fermer","scTop":"Cépages principaux","scMain":"Régions principales","scApp":"appellations/zones","scSheet":"Fiche"},
 'en':{"tr_schemi":"Outlines","trd_schemi":"Countries → regions → appellations, and grapes → countries","scByC":"By country","scByG":"By grape",
 "scIntroC":"Each country with its regions and appellations: type (AOC, DOCG, AVA…), grapes (main one in bold) and key features from the textbook. Tap a name to see it on the map, a grape for its outline.",
 "scIntroG":"Each grape with the countries, regions and appellations where it appears in the textbook. In bold, the areas where it is the main grape.",
 "scSearch":"Search a country, region, appellation or grape…","scOpenAll":"Open/close all","scTop":"Main grapes","scMain":"Main regions","scApp":"appellations/areas","scSheet":"Profile"}}
i=h.index('Object.assign(T.en,{"train"'); j=h.index('\n',i)+1
h=h[:j]+''.join('Object.assign(T.%s,%s);\n'%(k,json.dumps(v,ensure_ascii=False)) for k,v in S.items())+h[j:]
open('live.html','w').write(h); print('ok')
