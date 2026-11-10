import json,re,sys
sys.path.insert(0,'../maps')
from mapdata import MAPS as RAW
GEO=json.load(open('../maps/geo_out.json')); Z=json.load(open('../maps/zones.json'))
h=open('live.html').read()
def rep(a,b,c=1):
    global h; assert h.count(a)==c,(a[:80],h.count(a)); h=h.replace(a,b)
maps=[]
for m in RAW:
    g=GEO[m['id']]; W,N,k,s=g['W'],g['N'],g['k'],g['s']
    maps.append(dict(id=m['id'],ch=m['ch'],sc=m['sc'],t=m['title'],p=m['page'],it=[[t,n,round((lon-W)*k*s,1),round((N-lat)*s,1)] for t,n,lon,lat in m['items']]))
geo={k:{kk:v[kk] for kk in ('w','h','land','lake','riv','b0','b1','band','grat')} for k,v in GEO.items()}
js=open('maps2.js').read().replace('__MAPS__',json.dumps(maps,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')).replace('__MGEO__',json.dumps(geo,separators=(',',':'))).replace('__MZ__',json.dumps(Z,separators=(',',':')))
a=h.index('/* ---------- maps game ---------- */'); b=h.index('/* ---------- mock exam ---------- */')
h=h[:a]+js+'\n'+h[b:]
rep('  if(view==="maps"&&mg){ m.innerHTML=renderMapPlay(); bindMapPlay(); window.scrollTo(0,0); return }','  if(!mg) document.body.classList.remove("mlock");\n  if(view==="maps"&&mg){ m.innerHTML=renderMapPlay(); bindMapPlay(); window.scrollTo(0,0); return }')
css='''.mz{fill:var(--accent);fill-opacity:.12;stroke:var(--accent);stroke-opacity:.6;stroke-width:calc(var(--u,1)*1.2px);cursor:pointer;transition:fill-opacity .2s}
.mz.t-x{fill:var(--muted);fill-opacity:.07;stroke:var(--muted);stroke-opacity:.45}
.mz.mst1{fill:var(--good);fill-opacity:.14}.mz.mst2{fill:var(--good);fill-opacity:.26}.mz.mst3{fill:var(--good);fill-opacity:.38}.mz.mst4{fill:var(--good);fill-opacity:.52}
.mz.ok{fill:var(--good);fill-opacity:.55;stroke:var(--good);stroke-opacity:1}
.mz.miss{fill:var(--bad);fill-opacity:.32;stroke:var(--bad)}
.mz.bad{fill:var(--bad);fill-opacity:.6;stroke:var(--bad);animation:mblink .45s 3}
.mz.reveal{fill:var(--bad);fill-opacity:.7;stroke:var(--bad);stroke-opacity:1;stroke-width:calc(var(--u,1)*3px);animation:mblink .6s 5}
.mz.target{fill:var(--warn);fill-opacity:.6;stroke:var(--fg);stroke-opacity:1;stroke-width:calc(var(--u,1)*2.5px);animation:mblink 1.3s infinite}
.mz.sel{fill:var(--accent);fill-opacity:.45;stroke-width:calc(var(--u,1)*2.5px)}
.mz.flash{animation:mblink .3s 2}
@keyframes mblink{50%{fill-opacity:.12}}
.mp2{cursor:pointer}.mp2 .hit{fill:transparent}.mp2 .dot{stroke:var(--surface);stroke-width:calc(var(--u,1)*1.6px)}
.mp2.t-c .dot{fill:var(--fg)}.mp2.t-r .dot{fill:var(--mriverd)}.mp2.t-g .dot{fill:var(--warn)}.mp2.t-x .dot{fill:var(--muted)}.mp2.t-w .dot{fill:var(--accent)}
.mp2.ok .dot{fill:var(--good)}.mp2.miss .dot{fill:var(--bad)}.mp2.bad .dot,.mp2.reveal .dot{fill:var(--bad);stroke:var(--fg);stroke-width:calc(var(--u,1)*3px)}.mp2.target .dot{fill:var(--warn);stroke:var(--fg);stroke-width:calc(var(--u,1)*3px)}.mp2.sel .dot{stroke:var(--fg);stroke-width:calc(var(--u,1)*3px)}
.mp2s text.ml{font-size:calc(var(--u,1)*13px);font-weight:600}.mp2s text.ml.t-w{font-weight:700}.mp2s text.hlab{font-size:calc(var(--u,1)*16px)}
body.mlock{overflow:hidden}
.mplay{position:fixed;inset:0;z-index:80;background:var(--bg);display:flex;flex-direction:column}
.mplay.inline{position:relative;inset:auto;height:78vh;border:1px solid var(--line);border-radius:var(--r);overflow:hidden;z-index:1}
.mhead{display:flex;gap:8px;align-items:center;padding:8px 12px 8px;padding-top:calc(8px + env(safe-area-inset-top,0px));border-bottom:1px solid var(--line);background:var(--surface)}
.mhead .mx{padding:6px 12px;font-size:1.1rem}
.mhead-t{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
.mask{display:flex;align-items:center;gap:6px;flex-wrap:wrap;min-height:1.6em}
.mname{font-family:var(--f-display);font-size:1.35rem;color:var(--accent);line-height:1.1}
.mprog{display:flex;flex-direction:column;gap:3px;font-size:.76rem;color:var(--muted)}
.mstage{flex:1;position:relative;min-height:0;touch-action:none;background:var(--mwater);overflow:hidden}
.mstage svg{width:100%;height:100%;display:block;user-select:none;-webkit-user-select:none}
.mzoom2{position:absolute;right:10px;bottom:10px;display:flex;flex-direction:column;gap:6px}
.mzoom2 button{width:44px;height:44px;border-radius:50%;border:1px solid var(--line);background:var(--surface);color:var(--fg);font-size:1.25rem;font-weight:700;box-shadow:0 2px 8px rgba(0,0,0,.18)}
.mbottom{padding:10px 14px;padding-bottom:calc(12px + env(safe-area-inset-bottom,0px));border-top:1px solid var(--line);background:var(--surface);max-height:46vh;overflow:auto;display:flex;flex-direction:column;gap:8px}
.mopts{display:grid;grid-template-columns:1fr 1fr;gap:8px}.mopts .choice{padding:11px 12px;font-weight:600}
.mtype{display:flex;gap:8px;flex-wrap:wrap}.mtype input{flex:1 1 170px;font-size:16px}
.minfo-n{font-family:var(--f-display);font-size:1.3rem;font-weight:600;margin:2px 0 4px}
.minfo.badc .label{color:var(--bad)}.minfo.good .label{color:var(--good)}
.mfact{margin:8px 0 0;font-size:.86rem;display:flex;flex-direction:column;gap:2px;border-left:3px solid var(--accent);padding-left:10px}
.mok{color:var(--good);font-weight:700;margin:0;font-size:1.1rem}
.mspk{border:0;background:none;font-size:1.05rem;cursor:pointer;padding:2px 4px}
.mgo{width:100%;padding:12px}
.mstats{display:flex;gap:22px;align-items:center;flex-wrap:wrap;margin-top:6px}.mstats>div{display:flex;flex-direction:column;gap:2px}.mstats b{font-size:1.35rem}.mstats b small{font-size:.8rem;color:var(--muted)}.mstats span{font-size:.75rem;color:var(--muted)}
.mheat{display:grid!important;grid-template-columns:repeat(14,11px);gap:3px}.mheat i{width:11px;height:11px;border-radius:3px;background:var(--sunk)}.mheat i.on{background:var(--good)}
.mgroups{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:12px;align-items:start}
.mgroup{display:flex;flex-direction:column;gap:6px;background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:10px}
.mtile{display:flex;flex-direction:column;gap:5px;text-align:left;border:1px solid var(--line);background:var(--bg);color:var(--fg);border-radius:10px;padding:10px 12px;min-height:48px}
.mtile:hover{border-color:var(--accent)}.mtile.lv0{background:var(--accent-soft);border-color:transparent}.mtile.lv0 .mt-n{font-weight:700;font-size:1rem}.mtile.lv1{margin-left:14px}.mtile.lv2{margin-left:28px}.mtile.lock{opacity:.6}
.mt-n{font-weight:600;font-size:.9rem}.mt-s{display:flex;gap:8px;align-items:center;font-size:.72rem}
.mbar{flex:1;height:6px;border-radius:3px;background:var(--sunk);overflow:hidden}.mbar i{display:block;height:100%;background:var(--good)}
.msheet-bg{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:70;display:flex;align-items:flex-end;justify-content:center}
.msheet{background:var(--surface);width:100%;max-width:560px;border-radius:18px 18px 0 0;padding:16px;padding-bottom:calc(16px + env(safe-area-inset-bottom,0px));display:flex;flex-direction:column;gap:12px;max-height:90vh;overflow:auto}
@media (min-width:700px){.msheet-bg{align-items:center}.msheet{border-radius:18px}}
.mmodes{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.mmode{display:flex;flex-direction:column;gap:2px;text-align:left;border:1px solid var(--line);background:var(--bg);color:var(--fg);border-radius:10px;padding:10px}.mmode span{font-size:.74rem;color:var(--muted)}.mmode[aria-pressed="true"]{border-color:var(--accent);background:var(--accent-soft)}
.mlock{color:var(--warn);margin:0;font-size:.88rem}
.mhits{display:flex;flex-wrap:wrap;gap:6px}.msearch{display:flex;flex-direction:column;gap:6px}.msearch input{font-size:16px}
.mres{display:flex;flex-direction:column;gap:10px}
'''
rep('@media (prefers-reduced-motion:reduce)',css+'@media (prefers-reduced-motion:reduce)')
S={"it":{"m2Intro":"Come Seterra: tocchi la zona sulla mappa e vedi subito se è giusta. Parti dal paese, poi le regioni, poi le denominazioni: ogni livello si sblocca quando padroneggi quello sopra. Le zone che sbagli tornano più spesso.","m2Streak":"giorni di fila","m2Mastered":"luoghi padroneggiati","m2Days":"ultimi 28 giorni","m2UnlockAll":"Sblocca tutti i livelli","m2Drawn":"Confini e fiumi da dati geografici reali (Natural Earth). Regioni di Francia, Italia e stati/province reali; le denominazioni sono zone schematiche intorno alla loro posizione, per renderle facili da toccare.","m2Locked":"Livello bloccato: padroneggia prima «{P}» (40% delle zone o un record del 70%).","m2Find":"Trova","m2FindD":"Tocca la zona sulla mappa","m2Name":"Come si chiama?","m2NameD":"Scegli il nome tra 4","m2Type":"Scrivi il nome","m2TypeD":"La più difficile","m2Explore":"Atlante","m2ExploreD":"Studia e cerca per nome","m2Quick":"Sessione rapida (10)","m2Whole":"Tutta la mappa","m2Due":"{N} zone da ripassare oggi","m2Play":"Gioca","m2PlayAnyway":"Gioca comunque","m2FindQ":"Trova:","m2Say":"Ascolta la pronuncia","m2NameQ":"Come si chiama la zona evidenziata?","m2TypeQ":"Scrivi il nome della zona evidenziata","m2ItWas":"Era qui","m2Search":"Cerca un nome…","m2ExploreH":"Tocca una zona per vedere nome e cosa dice il manuale. Le zone più verdi sono quelle che padroneggi.","m2TypePh":"Nome (gli accenti non contano)","m2Check":"Verifica","m2Idk":"Non lo so","m2FindH":"Tocca la zona giusta. Puoi ingrandire con due dita.","m2RetryMiss":"Ripeti gli errori","m2NextLvl":"Livello successivo"},
"fr":{"m2Intro":"Comme Seterra : touchez la zone sur la carte et voyez tout de suite si c'est juste. On part du pays, puis les régions, puis les appellations : chaque niveau se débloque quand vous maîtrisez celui du dessus. Les zones ratées reviennent plus souvent.","m2Streak":"jours d'affilée","m2Mastered":"lieux maîtrisés","m2Days":"28 derniers jours","m2UnlockAll":"Débloquer tous les niveaux","m2Drawn":"Frontières et fleuves issus de données géographiques réelles (Natural Earth). Régions de France, d'Italie et États/provinces réels ; les appellations sont des zones schématiques autour de leur position, faciles à toucher.","m2Locked":"Niveau bloqué : maîtrisez d'abord « {P} » (40 % des zones ou un record de 70 %).","m2Find":"Trouver","m2FindD":"Touchez la zone sur la carte","m2Name":"Comment s'appelle-t-elle ?","m2NameD":"Choisissez le nom parmi 4","m2Type":"Écrire le nom","m2TypeD":"Le plus difficile","m2Explore":"Atlas","m2ExploreD":"Étudier et chercher par nom","m2Quick":"Session rapide (10)","m2Whole":"Toute la carte","m2Due":"{N} zones à revoir aujourd'hui","m2Play":"Jouer","m2PlayAnyway":"Jouer quand même","m2FindQ":"Trouvez :","m2Say":"Écouter la prononciation","m2NameQ":"Comment s'appelle la zone en surbrillance ?","m2TypeQ":"Écrivez le nom de la zone en surbrillance","m2ItWas":"C'était ici","m2Search":"Chercher un nom…","m2ExploreH":"Touchez une zone pour voir son nom et ce qu'en dit le manuel. Plus une zone est verte, mieux vous la maîtrisez.","m2TypePh":"Nom (accents ignorés)","m2Check":"Vérifier","m2Idk":"Je ne sais pas","m2FindH":"Touchez la bonne zone. Vous pouvez zoomer à deux doigts.","m2RetryMiss":"Refaire les erreurs","m2NextLvl":"Niveau suivant"},
"en":{"m2Intro":"Like Seterra: tap the area on the map and see instantly if you are right. Start with the country, then regions, then appellations: each level unlocks when you master the one above. Areas you miss come back more often.","m2Streak":"day streak","m2Mastered":"places mastered","m2Days":"last 28 days","m2UnlockAll":"Unlock all levels","m2Drawn":"Borders and rivers from real geographic data (Natural Earth). French and Italian regions and states/provinces are real; appellations are schematic areas around their position, sized to be easy to tap.","m2Locked":"Locked: first master “{P}” (40% of areas or a 70% best score).","m2Find":"Find it","m2FindD":"Tap the area on the map","m2Name":"What is it called?","m2NameD":"Pick the name from 4","m2Type":"Type the name","m2TypeD":"The hardest","m2Explore":"Atlas","m2ExploreD":"Study and search by name","m2Quick":"Quick session (10)","m2Whole":"Whole map","m2Due":"{N} areas due for review today","m2Play":"Play","m2PlayAnyway":"Play anyway","m2FindQ":"Find:","m2Say":"Hear the pronunciation","m2NameQ":"What is the highlighted area called?","m2TypeQ":"Type the name of the highlighted area","m2ItWas":"It was here","m2Search":"Search a name…","m2ExploreH":"Tap an area to see its name and what the textbook says. Greener areas are the ones you have mastered.","m2TypePh":"Name (accents don't matter)","m2Check":"Check","m2Idk":"I don't know","m2FindH":"Tap the right area. Pinch with two fingers to zoom.","m2RetryMiss":"Retry mistakes","m2NextLvl":"Next level"}}
rep('/* ---------- state ---------- */','\n'.join('Object.assign(T.%s,%s);'%(l,json.dumps(S[l],ensure_ascii=False)) for l in S)+'\n/* ---------- state ---------- */')
open('live.html','w').write(h); print('ok',len(h))
