import json, re, sys
sys.path.insert(0, '../maps')
from names import N
D = json.load(open('../maps/maps3.json'))
h = open('live.html').read()
def rep(a, b, c=1):
    global h
    assert h.count(a) == c, (a[:90], h.count(a)); h = h.replace(a, b)
order = [m for m in D]  # keep build order
maps = [dict(id=m['id'], ch=m['ch'], sc=m['sc'], t=m['t'], p=m['p'], it=m['it']) for m in D.values()]
geo = {k: {kk: v[kk] for kk in ('w', 'h', 'land', 'lake', 'riv', 'b0', 'b1', 'grat')} for k, v in D.items()}
keys = set(x[1] for m in D.values() for x in m['it'])
names = {k: list(v) for k, v in N.items() if k in keys}
dj = lambda o: json.dumps(o, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
js = open('maps3.js').read().replace('__MAPS__', dj(maps)).replace('__MGEO__', dj(geo)).replace('__MNAMES__', dj(names))
a = h.index('/* ---------- maps game (Seterra-style) ---------- */'); b = h.index('/* ---------- mock exam ---------- */')
h = h[:a] + js + '\n' + h[b:]
# cloud doc renamed (progress is now keyed by place, not index)
rep('if(d.id==="maps"&&x&&x.m) mergeMaps(x.m)', 'if(d.id==="maps2"&&x&&x.m) mergeMaps(x.m)')
# mock exam: only textbook (tier 1) appellations, not umbrella areas
rep('const mm=shuffle(MAPS.filter(m=>m.it.filter(x=>x[0]==="w").length>=10))[0];\n  const targets=shuffle(mm.it.map((x,i)=>i).filter(i=>mm.it[i][0]==="w")).slice(0,10);',
    'const mmOK=x=>x[0]==="w"&&x[4]===1&&!x[6];\n  const mm=shuffle(MAPS.filter(m=>m.it.filter(mmOK).length>=10))[0];\n  const targets=shuffle(mm.it.map((x,i)=>i).filter(i=>mmOK(mm.it[i]))).slice(0,10);')
rep('mg=s.g||mgNew(s.id,"find",{targets:s.targets,exam:true});', 'mg=s.g||mgNew(s.id,"find",{targets:s.targets,exam:true,lvl:1,cats:["w"]});')
# CSS: replace the maps-game block
c0 = h.index('.mz{fill:var(--accent)'); c1 = h.index('.mp2s text.ml{')
c1 = h.index('\n', h.index('.mp2s text.hlab', c1)) + 1
css = '''.mp2s .msea{fill:var(--mwater)}
.mz{fill:var(--accent);fill-opacity:.11;stroke:var(--accent);stroke-opacity:.55;stroke-width:calc(var(--u,1)*1.1px);stroke-linejoin:round;transition:fill-opacity .25s,fill .25s,stroke .25s}
.mz.umb{fill:var(--fg);fill-opacity:.025;stroke:var(--fg);stroke-opacity:.45;stroke-width:calc(var(--u,1)*1.6px);stroke-dasharray:calc(var(--u,1)*7px) calc(var(--u,1)*4px)}
.mz.mst1{fill:var(--good);fill-opacity:.16}.mz.mst2{fill:var(--good);fill-opacity:.28}.mz.mst3{fill:var(--good);fill-opacity:.40}.mz.mst4{fill:var(--good);fill-opacity:.55}
.mz.umb.mst1,.mz.umb.mst2,.mz.umb.mst3,.mz.umb.mst4{fill-opacity:.06}
.mz.ok{fill:var(--good);fill-opacity:.5;stroke:var(--good);stroke-opacity:1;stroke-dasharray:none}
.mz.umb.ok{fill-opacity:.16}
.mz.miss{fill:var(--bad);fill-opacity:.3;stroke:var(--bad);stroke-opacity:.9;stroke-dasharray:none}
.mz.umb.miss{fill-opacity:.12}
.mz.bad{fill:var(--warn);fill-opacity:.55;stroke:var(--warn);stroke-opacity:1;stroke-dasharray:none}
.mz.reveal{fill:var(--bad);fill-opacity:.7;stroke:var(--bad);stroke-opacity:1;stroke-width:calc(var(--u,1)*3px);stroke-dasharray:none;animation:mblink .7s 4}
.mz.target{fill:var(--warn);fill-opacity:.65;stroke:var(--fg);stroke-opacity:1;stroke-width:calc(var(--u,1)*2.5px);stroke-dasharray:none;animation:mblink 1.4s infinite}
.mz.sel{fill:var(--accent);fill-opacity:.5;stroke-opacity:1;stroke-width:calc(var(--u,1)*2.5px)}
.mz.now{animation:mflash .5s 1}
@keyframes mblink{50%{fill-opacity:.15}}
@keyframes mflash{0%{fill-opacity:.95}100%{fill-opacity:.5}}
.mrl{fill:none;stroke:var(--mriverd);stroke-width:calc(var(--u,1)*3.2px);stroke-linecap:round;stroke-linejoin:round;transition:stroke .25s}
.mrl.ok{stroke:var(--good)}.mrl.miss{stroke:var(--bad)}.mrl.bad{stroke:var(--warn);stroke-width:calc(var(--u,1)*5px)}
.mrl.reveal{stroke:var(--bad);stroke-width:calc(var(--u,1)*6px);animation:mblinks .7s 4}.mrl.target{stroke:var(--warn);stroke-width:calc(var(--u,1)*6px);animation:mblinks 1.4s infinite}.mrl.sel{stroke-width:calc(var(--u,1)*6px)}
@keyframes mblinks{50%{stroke-opacity:.25}}
.mp2{stroke:var(--surface);stroke-width:calc(var(--u,1)*1.6px);transition:fill .25s}
.mp2.t-c{fill:var(--fg)}.mp2.t-r{fill:var(--mriverd)}.mp2.t-g{fill:var(--warn)}.mp2.t-w{fill:var(--accent)}
.mp2.ctx{fill:var(--muted);stroke-width:calc(var(--u,1)*1px)}
.mp2.ok{fill:var(--good)}.mp2.miss{fill:var(--bad)}.mp2.bad{fill:var(--warn);stroke:var(--fg);stroke-width:calc(var(--u,1)*2.5px)}
.mp2.reveal{fill:var(--bad);stroke:var(--fg);stroke-width:calc(var(--u,1)*3px);animation:mblinkf .7s 4}.mp2.target{fill:var(--warn);stroke:var(--fg);stroke-width:calc(var(--u,1)*3px);animation:mblinkf 1.4s infinite}.mp2.sel{stroke:var(--fg);stroke-width:calc(var(--u,1)*3px)}
@keyframes mblinkf{50%{fill-opacity:.25}}
.mp2s.hard .mz:not(.ok):not(.miss):not(.bad):not(.reveal):not(.target){fill:transparent;stroke:transparent}
.mp2s.hard .mrl:not(.ok):not(.miss):not(.bad):not(.reveal):not(.target){stroke:transparent}
.mp2s.hard .mp2:not(.ctx):not(.ok):not(.miss):not(.bad):not(.reveal):not(.target){fill:transparent;stroke:transparent}
.mp2s text.ml{font-size:calc(var(--u,1)*13px);font-weight:650;fill:var(--fg);paint-order:stroke;stroke:var(--mland);stroke-width:calc(var(--u,1)*3.4px);stroke-linejoin:round;pointer-events:none;transform-box:fill-box;transform-origin:center}
.mp2s text.ml.t-w{fill:var(--accent);font-weight:750}
.mp2s text.ml.t-r{fill:var(--mriverd);font-style:italic}
.mp2s text.ml.t-g{fill:var(--warn);font-style:italic}
.mp2s text.ml.umb{font-size:calc(var(--u,1)*12px);letter-spacing:.03em;font-style:italic}
.mp2s text.ml.ctx{fill:var(--muted);font-weight:500;font-size:calc(var(--u,1)*11.5px)}
.mp2s text.ml.t-x{fill:var(--muted);font-weight:500;font-style:italic;font-size:calc(var(--u,1)*11.5px);letter-spacing:.06em;stroke-opacity:.6}
.mp2s text.ml.lok{fill:var(--good)}
.mp2s text.ml.lmiss{fill:var(--bad)}
.mp2s text.ml.lbad{fill:var(--warn)}
.mp2s text.ml.hlab{font-size:calc(var(--u,1)*16px)}
.mp2s text.ml.off,.mp2s text.ml.hid{display:none}
.mp2s text.ml.pop{animation:mpop .45s ease-out}
@keyframes mpop{0%{transform:scale(.4);opacity:0}60%{transform:scale(1.15);opacity:1}100%{transform:scale(1)}}
.mripple{position:absolute;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;border:2px solid var(--muted);pointer-events:none;animation:mrip .45s ease-out forwards}
@keyframes mrip{from{transform:scale(.3);opacity:.9}to{transform:scale(1.4);opacity:0}}
.mlvls{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:4px}
.mlvl{display:flex;flex-direction:column;gap:2px;text-align:left;border:1px solid var(--line);background:var(--bg);color:var(--fg);border-radius:10px;padding:9px}.mlvl b{font-size:.84rem}.mlvl span{font-size:.72rem;color:var(--muted)}.mlvl[aria-pressed="true"]{border-color:var(--accent);background:var(--accent-soft)}
@media (max-width:430px){.mlvls{grid-template-columns:1fr}}
.mbottom #m-next{position:sticky;bottom:0;box-shadow:0 -8px 14px var(--surface)}
.tag.tsm{font-size:.68rem;padding:1px 7px}
.mtapped{margin:6px 0 0;font-size:.85rem;color:var(--warn)}
.mstreak{font-size:.9rem;color:var(--warn)}
body.mlock{overflow:hidden}
'''
h = h[:c0] + css + h[c1:]
S = {
 "it": {"m2Intro": "Come Seterra: tocchi il luogo sulla mappa e vedi subito se è giusto. I confini delle denominazioni sono quelli reali dei comuni che ne fanno parte. Ogni nome che trovi resta scritto sulla mappa. Tre livelli: Base (luoghi del manuale), Avanzato (+ denominazioni e cru in più), Esperto (senza confini: tocchi a memoria). Le zone sbagliate tornano più spesso.",
        "m2Drawn": "Confini dei comuni (Francia: IGN/France GeoJSON; Italia: ISTAT/openpolis) e fiumi da dati geografici reali (Natural Earth). Le denominazioni di Francia e Italia sono disegnate unendo i comuni della zona; per gli altri paesi sono zone schematiche.",
        "m2Locked": "Livello bloccato: padroneggia prima «{P}» (30% dei luoghi o un record del 70%).",
        "m2FindH": "Tocca il luogo giusto. Due dita o doppio tocco per ingrandire.",
        "m3Level": "Difficoltà", "m3L1": "Base", "m3L1D": "Luoghi del manuale, confini visibili", "m3L2": "Avanzato", "m3L2D": "+ denominazioni e cru extra, risposte vicine", "m3L3": "Esperto", "m3L3D": "Nessun confine: tocchi a memoria",
        "m3FindHard": "Nessun confine visibile: tocca dove si trova. Due dita o doppio tocco per ingrandire.",
        "m3YouTapped": "Hai toccato:", "m3Expert": "Livello avanzato", "m3Umb": "Zona generale", "m3Harder": "Prova più difficile",
        "mc_w": "Vini e denominazioni", "mc_c": "Città", "mc_r": "Fiumi e laghi", "mc_g": "Montagne e rilievi"},
 "fr": {"m2Intro": "Comme Seterra : touchez le lieu sur la carte et voyez tout de suite si c'est juste. Les limites des appellations sont celles, réelles, des communes qui les composent. Chaque nom trouvé reste écrit sur la carte. Trois niveaux : Base (lieux du manuel), Avancé (+ appellations et crus supplémentaires), Expert (sans limites : de mémoire). Les zones ratées reviennent plus souvent.",
        "m2Drawn": "Limites communales (France : IGN/France GeoJSON ; Italie : ISTAT/openpolis) et fleuves issus de données géographiques réelles (Natural Earth). Les appellations de France et d'Italie sont dessinées en réunissant les communes de la zone ; pour les autres pays, ce sont des zones schématiques.",
        "m2Locked": "Niveau bloqué : maîtrisez d'abord « {P} » (30 % des lieux ou un record de 70 %).",
        "m2FindH": "Touchez le bon lieu. Deux doigts ou double tap pour zoomer.",
        "m3Level": "Difficulté", "m3L1": "Base", "m3L1D": "Lieux du manuel, limites visibles", "m3L2": "Avancé", "m3L2D": "+ appellations et crus en plus, réponses voisines", "m3L3": "Expert", "m3L3D": "Aucune limite : de mémoire",
        "m3FindHard": "Aucune limite visible : touchez l'endroit. Deux doigts ou double tap pour zoomer.",
        "m3YouTapped": "Vous avez touché :", "m3Expert": "Niveau avancé", "m3Umb": "Zone générale", "m3Harder": "Essayer plus difficile",
        "mc_w": "Vins et appellations", "mc_c": "Villes", "mc_r": "Fleuves et lacs", "mc_g": "Montagnes et reliefs"},
 "en": {"m2Intro": "Like Seterra: tap the place on the map and see instantly if you are right. Appellation borders are the real borders of the communes they include. Every name you find stays written on the map. Three levels: Basic (textbook places), Advanced (+ extra appellations and crus), Expert (no borders: from memory). Places you miss come back more often.",
        "m2Drawn": "Commune borders (France: IGN/France GeoJSON; Italy: ISTAT/openpolis) and rivers from real geographic data (Natural Earth). French and Italian appellations are drawn by joining the communes of the area; for other countries they are schematic areas.",
        "m2Locked": "Locked: first master “{P}” (30% of places or a 70% best score).",
        "m2FindH": "Tap the right place. Pinch or double-tap to zoom.",
        "m3Level": "Difficulty", "m3L1": "Basic", "m3L1D": "Textbook places, borders shown", "m3L2": "Advanced", "m3L2D": "+ extra appellations and crus, close answers", "m3L3": "Expert", "m3L3D": "No borders: from memory",
        "m3FindHard": "No borders shown: tap where it is. Pinch or double-tap to zoom.",
        "m3YouTapped": "You tapped:", "m3Expert": "Advanced level", "m3Umb": "General area", "m3Harder": "Try harder",
        "mc_w": "Wines and appellations", "mc_c": "Cities", "mc_r": "Rivers and lakes", "mc_g": "Mountains and hills"}}
rep('/* ---------- state ---------- */', '\n'.join('Object.assign(T.%s,%s);' % (l, json.dumps(S[l], ensure_ascii=False)) for l in S) + '\n/* ---------- state ---------- */')
open('live.html', 'w').write(h); print('ok', len(h))
