/* ---------- v74: maps after every territory question — country, places & appellations, relief & soils ---------- */
Object.assign(T.it,{gqTitle:"Sul territorio",gqT0:"Il paese",gqT1:"La regione",gqT2:"La geografia",gqCountry:"Dove si trova nel paese",gqLegal:"Confini, denominazioni e città",gqRelief:"Montagne, laghi, fiumi e pianure",gqVid:"Video: la risposta spiegata sulle mappe",gqPlay:"Guarda il video",gqVoice:"Voce",gqAns:"Risposta corretta",gqHl:"In evidenza",gqMts:"Montagne",gqRiv:"Fiumi e laghi",gqPl:"Pianure e valli",gqSo:"Suoli",gqElev:"Altitudine",gqSoils:"Suoli",gqRelNote:"Verde = pianura, marrone = rilievi, bianco = alta montagna.",gqNoSoil:"Suoli non indicati per queste zone.",gqCities:"Città",gqZone:"Zona vinicola (nome in maiuscolo)",gqVill:"Villaggio / comune vinicolo"});
Object.assign(T.fr,{gqTitle:"Sur le terrain",gqT0:"Le pays",gqT1:"La région",gqT2:"La géographie",gqCountry:"Où se trouve-t-on dans le pays",gqLegal:"Limites, appellations et villes",gqRelief:"Montagnes, lacs, fleuves et plaines",gqVid:"Vidéo : la réponse expliquée sur les cartes",gqPlay:"Regarder la vidéo",gqVoice:"Voix",gqAns:"Bonne réponse",gqHl:"En évidence",gqMts:"Montagnes",gqRiv:"Fleuves et lacs",gqPl:"Plaines et vallées",gqSo:"Sols",gqElev:"Altitude",gqSoils:"Sols",gqRelNote:"Vert = plaine, brun = reliefs, blanc = haute montagne.",gqNoSoil:"Sols non indiqués pour ces zones.",gqCities:"Villes",gqZone:"Zone viticole (nom en majuscules)",gqVill:"Village / commune viticole"});
Object.assign(T.en,{gqTitle:"On the map",gqT0:"The country",gqT1:"The region",gqT2:"The geography",gqCountry:"Where it is in the country",gqLegal:"Boundaries, appellations and towns",gqRelief:"Mountains, lakes, rivers and plains",gqVid:"Video: the answer explained on the maps",gqPlay:"Watch the video",gqVoice:"Voice",gqAns:"Correct answer",gqHl:"Highlighted",gqMts:"Mountains",gqRiv:"Rivers and lakes",gqPl:"Plains and valleys",gqSo:"Soils",gqElev:"Elevation",gqSoils:"Soils",gqRelNote:"Green = lowland, brown = hills and mountains, white = high peaks.",gqNoSoil:"Soils not shown for these areas.",gqCities:"Towns",gqZone:"Wine area (name in capitals)",gqVill:"Wine village"});

/* soils: key -> [colour, it, fr, en] */
const SOILS={
 grv:["#b9a888","Ghiaia","Graves (gravier)","Gravel"],
 cly:["#a8643f","Argilla","Argile","Clay"],
 clc:["#c99a62","Argilla e calcare","Argilo-calcaire","Clay and limestone"],
 lim:["#e6d9b4","Calcare","Calcaire","Limestone"],
 chk:["#f6f2e6","Gesso (craie)","Craie","Chalk"],
 mrl:["#cdb98a","Marne calcaree","Marnes calcaires","Calcareous marl"],
 kim:["#b4a47a","Marne kimmeridgiane","Marnes kimméridgiennes","Kimmeridgian marl"],
 snd:["#ebd79c","Sabbia","Sable","Sand"],
 sch:["#6f707b","Scisto e ardesia","Schiste et ardoise","Schist and slate"],
 gra:["#d39d94","Granito e gneiss","Granite et gneiss","Granite and gneiss"],
 vol:["#4f4447","Suoli vulcanici","Sols volcaniques","Volcanic soils"],
 gal:["#a8906c","Ciottoli (galets roulés)","Galets roulés","Large pebbles (galets)"],
 all:["#b9a986","Alluvioni","Alluvions","Alluvial soils"],
 loe:["#dcc48c","Loess","Lœss","Loess"],
 tuf:["#f0e5c3","Tufo (tuffeau)","Tuffeau","Tuffeau (soft limestone)"],
 flt:["#8e8b82","Selce (silex)","Silex","Flint"],
 trr:["#b4472f","Terra rossa","Terra rossa","Terra rossa"],
 mor:["#a9a28d","Depositi morenici","Moraines glaciaires","Glacial moraine"],
 alb:["#faf7ee","Albariza","Albariza","Albariza"],
 gst:["#9b8f7c","Galestro","Galestro","Galestro (friable shale)"],
 fly:["#bba98a","Marna e arenaria (flysch)","Marnes et grès (flysch)","Marl and sandstone (flysch)"],
 sst:["#c98c6b","Arenaria","Grès","Sandstone"]};
const SOILOF={
 "Champagne":"chk","Cognac":"chk",
 "Saint-Estèphe":"grv,cly","Pauillac":"grv","Saint-Julien":"grv","Margaux":"grv","Listrac-Médoc":"clc,grv","Moulis":"grv,clc","Médoc":"grv,cly","Haut-Médoc":"grv","Pessac-Léognan":"grv","Graves":"grv,snd","Barsac":"clc,grv","Sauternes":"grv,clc","Loupiac":"clc","Sainte-Croix-du-Mont":"clc","Cadillac Côtes de Bordeaux":"clc","Pomerol":"cly,grv","Lalande-de-Pomerol":"grv,snd","Saint-Émilion":"lim,clc","Montagne-Saint-Émilion":"clc","Lussac-Saint-Émilion":"clc","Puisseguin-Saint-Émilion":"clc","Fronsac":"clc","Castillon Côtes de Bordeaux":"clc","Francs Côtes de Bordeaux":"clc","Côtes de Bourg":"clc","Blaye Côtes de Bordeaux":"clc","Entre-Deux-Mers":"clc",
 "Bergerac":"clc","Monbazillac":"clc","Cahors":"all,lim","Madiran":"clc",
 "Chablis":"kim","Irancy & Saint-Bris":"kim","Côte de Nuits":"lim,mrl","Côte de Beaune":"lim,mrl","Hautes Côtes de Nuits":"lim","Hautes Côtes de Beaune":"lim","Côte d'Or":"lim,mrl","Côte Chalonnaise":"lim,mrl","Mâconnais":"lim","Beaujolais":"gra",
 "Gevrey-Chambertin":"lim,mrl","Vougeot":"lim,mrl","Vosne-Romanée":"lim,mrl","Nuits-Saint-Georges":"lim,mrl","Aloxe-Corton":"lim,mrl","Beaune":"lim,mrl","Pommard":"mrl,lim","Volnay":"lim,mrl","Meursault":"lim,mrl","Puligny-Montrachet":"lim,mrl","Chassagne-Montrachet":"lim,mrl","Marsannay":"lim,mrl","Fixin":"lim,mrl","Morey-Saint-Denis":"lim,mrl","Chambolle-Musigny":"lim","Ladoix":"lim,mrl","Pernand-Vergelesses":"lim,mrl","Savigny-lès-Beaune":"lim,mrl","Chorey-lès-Beaune":"all,mrl","Monthelie":"lim,mrl","Auxey-Duresses":"lim,mrl","Saint-Romain":"lim,mrl","Saint-Aubin":"lim,mrl","Santenay":"lim,mrl","Maranges":"mrl,lim","Chambertin (Grand Cru)":"lim,mrl","Clos de Vougeot (Grand Cru)":"lim,mrl","Romanée-Conti (Grand Cru)":"lim,mrl","Corton (Grand Cru)":"mrl,lim","Le Montrachet (Grand Cru)":"lim",
 "Rully":"lim,mrl","Mercurey":"lim,mrl","Givry":"lim,mrl","Montagny":"lim,mrl","Bouzeron":"lim,mrl","Pouilly-Fuissé":"lim,cly","Saint-Véran":"lim,cly","Viré-Clessé":"lim,cly","Pouilly-Vinzelles":"lim,cly",
 "Fleurie":"gra","Morgon":"gra,sch","Brouilly":"gra","Moulin-à-Vent":"gra","Saint-Amour":"gra","Juliénas":"gra,sch","Chénas":"gra","Chiroubles":"gra","Régnié":"gra","Côte de Brouilly":"vol,gra","Beaujolais Villages":"gra",
 "Nantais":"gra,sch","Muscadet":"gra,sch","Muscadet Sèvre et Maine":"gra,sch","Muscadet Côtes de Grandlieu":"gra,sch","Muscadet Coteaux de la Loire":"gra,sch","Savennières":"sch","Coteaux du Layon":"sch","Quarts de Chaume":"sch","Bonnezeaux":"sch","Anjou":"sch,tuf","Anjou-Saumur":"sch,tuf","Saumur":"tuf","Saumur-Champigny":"tuf","Bourgueil":"grv,tuf","Saint-Nicolas-de-Bourgueil":"grv,tuf","Chinon":"grv,tuf","Vouvray":"tuf,flt","Montlouis-sur-Loire":"tuf,flt","Touraine":"tuf,flt","Jasnières":"tuf,flt","Sancerre":"kim,flt","Pouilly-Fumé":"kim,flt","Menetou-Salon":"kim","Quincy":"snd,grv","Reuilly":"snd,mrl","Central Vineyards":"kim,flt",
 "Côte Rôtie":"sch","Condrieu":"gra","Château-Grillet":"gra","Saint-Joseph":"gra","Crozes-Hermitage":"all,gal","Hermitage":"gra,loe","Cornas":"gra","Saint-Péray":"gra,lim",
 "Châteauneuf-du-Pape":"gal,snd","Gigondas":"lim,snd","Vacqueyras":"gal","Muscat de Beaumes-de-Venise":"lim,snd","Lirac":"gal,snd","Tavel":"snd,gal","Rasteau":"cly,gal","Cairanne":"gal,clc","Vinsobres":"clc","Ventoux":"lim,snd","Luberon":"lim","Costières de Nîmes":"gal",
 "Faugères":"sch","Saint-Chinian":"sch,lim","Banyuls & Collioure":"sch","Maury":"sch","Pic Saint-Loup":"lim","La Clape":"lim","Bandol":"lim,clc","Picpoul de Pinet":"clc",
 "Montagne de Reims":"chk","Vallée de la Marne":"cly,snd","Côte des Blancs":"chk","Côte de Sézanne":"chk","Côte des Bar":"kim","Aÿ":"chk","Hautvillers":"chk","Bouzy village":"chk","Verzenay village":"chk","Cramant village":"chk","Le Mesnil-sur-Oger village":"chk","Les Riceys":"kim",
 "Mosel":"sch","Ahr":"sch","Mittelrhein":"sch","Rheingau":"sch,loe","Nahe":"vol,sch","Rheinhessen":"loe,lim","Pfalz":"sst,loe","Franken":"lim,mrl","Baden":"vol,loe",
 "Piesport":"sch","Wehlen":"sch","Bernkastel":"sch","Graach":"sch","Zeltingen":"sch","Ürzig":"sch","Erden":"sch","Brauneberg":"sch","Trittenheim":"sch","Wiltingen":"sch","Ockfen":"sch","Rüdesheim":"sch","Nierstein":"sst","Nackenheim":"sst","Forst":"vol,sst","Deidesheim":"sst","Wachenheim":"sst","Schlossböckelheim":"vol","Niederhausen":"vol",
 "Wachau":"gra,loe","Kremstal":"loe,gra","Kamptal":"loe,gra","Wagram":"loe","Weinviertel":"loe","Leithaberg":"lim,sch","Vulkanland Steiermark":"vol",
 "Tokaj":"vol","Santorini":"vol",
 "Soave Classico":"vol","Valpolicella Classico":"lim","Bardolino":"mor","Lugana":"cly","Franciacorta":"mor","Prosecco Conegliano-Valdobbiadene":"fly","Collio":"fly","Colli Orientali del Friuli":"fly","Friuli Grave":"grv",
 "Barolo":"mrl","Barbaresco":"mrl","Roero":"snd","Gattinara":"vol","Ghemme":"mor",
 "Chianti Classico":"gst,lim","Brunello di Montalcino":"gst,cly","Vino Nobile di Montepulciano":"cly,snd","Vernaccia di San Gimignano":"snd","Orvieto":"vol","Frascati":"vol","Est! Est!! Est!!! di Montefiascone":"vol",
 "Taurasi":"vol,cly","Greco di Tufo":"vol","Fiano di Avellino":"vol","Aglianico del Vulture":"vol","Etna":"vol","Vesuvio":"vol","Pantelleria":"vol","Salice Salentino":"trr","Primitivo di Manduria":"trr",
 "Rías Baixas":"gra","Bierzo":"sch","Ribeira Sacra":"sch,gra","Valdeorras":"sch","Ribera del Duero":"lim,cly","Toro":"snd","Rueda":"grv","Rioja":"clc,all","Priorat":"sch","Jerez":"alb","Montilla-Moriles":"alb","Penedès":"clc","Alella":"gra","Jumilla":"lim","Yecla":"lim",
 "Rioja Alavesa":"clc","Rioja Alta":"clc,all","Rioja Oriental":"all,cly",
 "Douro":"sch","Vinho Verde":"gra","Dão":"gra","Bairrada":"clc","Baixo Corgo":"sch","Cima Corgo":"sch","Douro Superior":"sch",
 "Napa Valley":"all,vol","Howell Mountain":"vol","Atlas Peak":"vol","Rutherford":"all","Oakville":"all","Stags Leap District":"vol,all","Calistoga":"vol","Los Carneros":"cly","St Helena":"all","Willamette Valley":"vol,snd","Columbia Valley":"loe,snd","Yakima Valley":"loe","Walla Walla Valley":"loe","Finger Lakes":"sch","Paso Robles":"lim","Russian River Valley":"snd",
 "Maipo Valley":"all","Limarí Valley":"lim","Mendoza":"all","Uco Valley":"all","Luján de Cuyo":"all","Cafayate":"snd","Salta":"snd",
 "Swartland":"sch,gra","Stellenbosch":"gra,sst","Paarl":"gra","Constantia":"gra,sst","Walker Bay":"sch,cly","Hemel-en-Aarde":"sch,cly","Robertson":"lim",
 "Coonawarra":"trr","Limestone Coast":"trr,lim","Eden Valley":"gra,sch","Clare Valley":"trr,sch","Hunter Valley":"snd,cly","Heathcote":"trr","Margaret River":"grv,gra",
 "Marlborough":"all,grv","Wairau Valley":"all,grv","Awatere Valley":"grv","Gimblett Gravels":"grv","Martinborough":"grv,loe","Central Otago":"sch,loe"};
const GQEXCL=new Set(["Cassis","Orange","Southern","Barr","Bordeaux"]);
const GQREG={bdx:["Bordeaux"],sw:["South West France"],bgn:["Burgundy"],bea:["Beaujolais"],als:["Alsace"],loi:["Loire Valley"],nrh:["Rhône Valley"],srh:["Rhône Valley"],sfr:["Languedoc","Roussillon","Provence"],cha:["Champagne"],gev:["Mosel","Rheingau","Nahe","Rheinhessen","Pfalz"],nei:["Veneto","Friuli-Venezia Giulia","Trentino-Alto Adige"],pie:["Piemonte"],cit:["Tuscany"],sit:["Campania","Sicily","Puglia"],rio:["Rioja"],cat:["Catalunya","Penedès","Priorat"],dou:["Douro"],cal:["California"],pnw:["Washington","Oregon"],nyk:["New York State"],can:["British Columbia","Ontario"],rsa:["Western Cape"],ause:["South Australia","Victoria","New South Wales"],ausw:["Western Australia"]};
const GQPAR={}; Object.entries(MTREE).forEach(([p,cs])=>cs.forEach(c=>GQPAR[c]=p));
const gqRoot=mid=>{ let m=mid; while(GQPAR[m]) m=GQPAR[m]; return m; };
const gqDepth=mid=>{ let d=0,m=mid; while(GQPAR[m]){ m=GQPAR[m]; d++; } return d; };
let GQIDX=null; const GQGEN=new Set(["Alps","Andes","Pyrenees","Massif Central","Rocky Mountains","Apennines","Coast Ranges","Atlantic Ocean","Indian Ocean"]);
function gqIndex(){ if(GQIDX) return GQIDX; const A=new Map();
  const BADA=new Set(["marche","marches","corse","bordolese","bordelais"]);
  const add=(alias,key)=>{ const a=flNorm(alias).replace(/[^a-z0-9]+/g," ").trim(); if(a.length<3||BADA.has(a)) return; if(!A.has(a)) A.set(a,new Set()); A.get(a).add(key); };
  MAPS.forEach(m=>m.it.forEach(x=>{ if(x[0]!=="w"&&!(x[0]==="g"&&!GQGEN.has(x[1]))) return; const k=x[1]; const names=[k].concat(MNAMES[k]||[]);
    names.forEach(n=>{ if(GQEXCL.has(n)) return; add(n,k); const s=n.replace(/\s*\((grand cru|Grand Cru)\)$/,"").replace(/ village$/,"").replace(/ IGP$/,"").replace(/ \(Cava\)$/,"").replace(/ \(Wiener Gemischter Satz\)$/,""); if(s!==n&&!GQEXCL.has(s)) add(s,k); }); }));
  MAPS.forEach(m=>m.t.forEach(n=>{ const s=n.replace(/\s*\(.*\)$/,""); add(s,"@"+m.id); }));
  add("Bordeaux","@bdx"); add("Borgogna","@bgn");
  ["Central Valley","Valle Centrale","Vallée Centrale"].forEach(a=>{ add(a,"Sacramento Valley"); add(a,"San Joaquin Valley"); });
  GQIDX=[...A.entries()].sort((a,b)=>b[0].length-a[0].length); return GQIDX; }
const GQROOTS={bdx:["fra"],bgn:["fra"],als:["fra"],rho:["fra"],sfr:["fra"],ger:["ger"],aut:["aut","hun"],gre:["gre"],ita:["ita"],esp:["esp"],por:["por"],usa:["nam"],chi:["chi","arg"],rsa:["rsaz"],aus:["ausz","nzl"],she:["esp"],prt:["por","fra","ausz"]};
const GQC={}; let GQHOME=null;
function gqHome(){ if(GQHOME) return GQHOME; GQHOME={}; MAPS.forEach(m=>m.it.forEach(x=>{ if(x[0]==="w"||x[0]==="g") (GQHOME[x[1]]=GQHOME[x[1]]||[]).push(m.id); })); return GQHOME; }
function gqScan(txt){ txt=" "+flNorm(txt).replace(/[^a-z0-9]+/g," ")+" "; const out=[];
  for(const [a,ks] of gqIndex()){ const pat=" "+a+" "; if(txt.includes(pat)){ out.push(...ks); txt=txt.split(pat).join(" | "); } } return out; }
function geoFor(b){ if(GQC[b.id]!==undefined) return GQC[b.id];
  const GEOCH=new Set(["bdx","bgn","als","rho","sfr","ger","aut","gre","ita","esp","por","usa","chi","rsa","aus"]);
  const core=[b.q,b.o[0]].map(a=>(a||[]).join(" ")).join(" "), expl=[b.e||[],b.d||[]].map(a=>a.join(" ")).join(" ");
  const W=new Map(); const bump=(k,w)=>W.set(k,(W.get(k)||0)+w);
  gqScan(core).forEach(k=>bump(k,6)); if(GEOCH.has(b.c)) gqScan(expl).forEach(k=>bump(k,1));
  if(!W.size) return GQC[b.id]=null;
  const roots=GQROOTS[b.c]?new Set(GQROOTS[b.c]):null, okMap=mid=>!roots||roots.has(gqRoot(mid));
  const H=gqHome(), vote=new Map(), keys=new Map();
  W.forEach((w,k)=>{ if(k[0]==="@"){ const mid=k.slice(1); if(MBY[mid]&&okMap(mid)) vote.set(mid,(vote.get(mid)||0)+w*(w>=6?1.1:.6)); return; }
    const ms=(H[k]||[]).filter(okMap); if(!ms.length) return; keys.set(k,w);
    const home=ms.slice().sort((a,c)=>gqDepth(c)-gqDepth(a)||MBY[a].it.length-MBY[c].it.length)[0];
    vote.set(home,(vote.get(home)||0)+w); ms.forEach(mid=>{ if(mid!==home) vote.set(mid,(vote.get(mid)||0)+w*.25); }); });
  if(!vote.size) return GQC[b.id]=null;
  let R=[...vote.entries()].sort((a,c)=>c[1]-a[1]||gqDepth(c[0])-gqDepth(a[0]))[0][0];
  const C=gqRoot(R);
  const rank=[...keys.entries()].sort((a,c)=>c[1]-a[1]).map(e=>e[0]);
  const Rm=MBY[R]; let Rhl=[]; rank.forEach(k=>{ const i=Rm.it.findIndex(x=>x[1]===k); if(i>=0) Rhl.push(i); });
  if(R===C){ const vC=vote.get(C)||0; const ch=(MTREE[C]||[]).filter(c=>(vote.get(c)||0)>=vC*.9&&vote.has(c)).sort((a,c)=>vote.get(c)-vote.get(a))[0]; if(ch){ R=ch; Rhl=[]; rank.forEach(k=>{ const i=MBY[R].it.findIndex(x=>x[1]===k); if(i>=0) Rhl.push(i); }); } }
  const chain=[]; let mm=R; while(mm&&mm!==C){ chain.push(mm); mm=GQPAR[mm]; }
  const Cm=MBY[C], Chl=[];
  Cm.it.forEach((x,i)=>{ if(x[0]!=="w") return; const isTitle=chain.some(c=>MBY[c].t.some(t=>t.replace(/\s*\(.*\)$/,"")===mName(x[1]))||x[1]===MBY[c].t[2]); const rk=chain.some(c=>(GQREG[c]||[]).includes(x[1])); if(keys.has(x[1])||isTitle||rk) Chl.push(i); });
  return GQC[b.id]={C,R,Chl:Chl.slice(0,6),Rhl:Rhl.slice(0,8),keys:rank}; }
const LEGPAL=["#7a1d3a","#c2185b","#d99a1e","#2f74b5","#13857f","#7b4bb5","#5f9a2e","#e0662a","#8a6a3a"];
let GQUID=0; const ZPAL=["#e9d3a6","#c9dfb0","#e8c3bb","#c4d6e8","#e6da9e","#d6c6e4","#bfe0d2","#f0caa0","#d9e3a8"]; const G2INFO={};
function gqSvg(mid,hl,mode){ const m=MBY[mid], G=MGEO[mid]; if(!m||!G) return {svg:"",leg:""}; const l=L(), u="gq"+(++GQUID);
  const W=G.w, H=G.h, fs=W*.027, Hs=new Map(); hl.forEach((j,q)=>Hs.set(j,q));
  const sea=mode===2?"#a9cfe3":"#cfe4ee", land=mode===2?"#b9d39a":"#f7f1e3";
  const law=gLaw(mid), cats=law.opts.map(o=>o[0]);
  const catCol=c=>LEGPAL[Math.max(0,cats.indexOf(c))%LEGPAL.length];
  const soilOf=k=>(SOILOF[k]||"").split(",").filter(Boolean);
  const usedSoil=new Map(), usedCat=new Map(); let hasZ=false, hasV=false;
  let defs=`<clipPath id="${u}c"><path d="${G.land}"/></clipPath>`;
  const pat=ss=>{ if(ss.length===1) return SOILS[ss[0]][0]; const id=u+"p"+ss.join(""); if(!defs.includes(`id="${id}"`)) defs+=`<pattern id="${id}" width="${W/70}" height="${W/70}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="${W/70}" height="${W/70}" fill="${SOILS[ss[0]][0]}"/><rect width="${W/140}" height="${W/70}" fill="${SOILS[ss[1]][0]}"/></pattern>`; return `url(#${id})`; };
  let o=`<rect x="${-W}" y="${-H}" width="${W*3}" height="${H*3}" fill="${sea}"/><path d="${G.land}" fill="${land}"/>`;
  if(mode===2) o+=`<image href="relief/${mid}.jpg" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="none" clip-path="url(#${u}c)"/>`;
  o+=`<path d="${G.lake||""}" fill="${mode===2?"#6fb0d8":sea}" stroke="${mode===2?"#3f7fae":"none"}" stroke-width="${W/900}"/><path d="${G.b1||""}" fill="none" stroke="rgba(110,90,70,.35)" stroke-width="${W/900}" stroke-dasharray="${W/180} ${W/260}"/><path d="${G.b0||""}" fill="none" stroke="rgba(90,60,40,.7)" stroke-width="${W/420}" stroke-dasharray="${W/90} ${W/200}"/>`;
  o+=`<path d="${G.riv||""}" fill="none" stroke="${mode===2?"#4f8fb8":"#7fb3d6"}" stroke-width="${W/(mode===2?380:520)}" stroke-linecap="round"/>`;
  /* zones */
  const zones=m.it.map((x,i)=>[x,i]).filter(([x])=>x[5]==="z"&&x[0]==="w").sort((a,b)=>(Hs.has(a[1])-Hs.has(b[1]))||(b[0][6]-a[0][6]));
  zones.forEach(([x,i])=>{ const on=Hs.has(i), q=Hs.get(i); let fill="rgba(160,120,80,.16)", st="rgba(255,255,255,.9)", sw=W/700, op=1;
    if(mode===0){ if(on){ fill=HLPAL[q%HLPAL.length]; st="#fff"; sw=W/300; } else { fill=ZPAL[i%ZPAL.length]; op=x[6]?.35:.85; st="rgba(110,80,50,.75)"; sw=W/650; } }
    if(mode===1){ const c=gCat(mid,i); if(c){ fill=catCol(c); usedCat.set(c,(usedCat.get(c)||0)+1); op=x[6]?.3:[.5,.66,.8][i%3]; st="#fff"; sw=W/420; } else { fill=ZPAL[i%ZPAL.length]; op=x[6]?.4:.9; st="rgba(110,80,50,.8)"; sw=W/560; } hasZ=true; if(on){ op=.95; st="#2a1b20"; sw=W/260; } }
    if(mode===2){ fill=on?"rgba(194,24,91,.22)":"none"; if(on) soilOf(x[1]).forEach(s=>usedSoil.set(s,(usedSoil.get(s)||0)+1)); st=on?"#c2185b":"rgba(60,38,22,.35)"; sw=on?W/230:W/1100; }
    o+=`<path d="${x[7]}" fill="${fill}" fill-opacity="${op}" stroke="${st}" stroke-width="${sw}" ${mode===2&&!on?`stroke-dasharray="${W/160} ${W/300}"`:""}>${on&&mode!==2?`<animate attributeName="fill-opacity" values="${op};${op*.55};${op}" dur="2.6s" repeatCount="indefinite"/>`:""}</path>`; });
  m.it.forEach(x=>{ if(x[5]==="l") o+=`<path d="${x[7]}" fill="none" stroke="${mode===2?"#3f7fae":"#5b9bd0"}" stroke-width="${W/300}" stroke-linecap="round"/>`; });
  /* points */
  const R=W/170;
  m.it.forEach((x,i)=>{ if(x[5]!=="p") return; const on=Hs.has(i), q=Hs.get(i);
    if(x[0]==="c"&&(x[4]===1||on||(mode===1&&x[4]===2))) o+=`<rect x="${x[2]-R*.8}" y="${x[3]-R*.8}" width="${R*1.6}" height="${R*1.6}" fill="#2a1b20" stroke="#fff" stroke-width="${W/900}"/>`;
    if(x[0]==="w"){ let f="#5f8a3e"; if(mode===0&&on) f=HLPAL[q%HLPAL.length]; if(mode===1){ hasV=true; const c=gCat(mid,i); if(c){ f=catCol(c); usedCat.set(c,(usedCat.get(c)||0)+1); } else f="#fff"; } if(mode===2){ f=on?"#c2185b":"rgba(60,38,22,.5)"; if(on) soilOf(x[1]).forEach(s=>usedSoil.set(s,(usedSoil.get(s)||0)+1)); }
      o+=`<circle cx="${x[2]}" cy="${x[3]}" r="${on?R*1.5:R*1.15}" fill="${f}" stroke="#2a1b20" stroke-width="${W/(on?400:520)}"/>`; }
    if(x[0]==="g"&&mode===2) o+=`<path d="M${x[2]} ${x[3]-R*2}L${x[2]+R*1.6} ${x[3]+R*.8}H${x[2]-R*1.6}Z" fill="#6b4a32" stroke="#fff" stroke-width="${W/900}"/>`; });
  const GX2=(typeof GEOX!=="undefined"&&GEOX[mid])||{r:[],p:[]}, li3=lang==="fr"?1:lang==="en"?2:0;
  const GXBAD=new Set(["Iberian Peninsula","North European Plain","Atlas Mountains","Tell Atlas","Calabria"]); const rng=(GX2.r||[]).filter(r=>!GXBAD.has(r[1][2])&&!(r[1][2]==="Great Hungarian Plain"&&mid!=="hun"));
  if(mode===2) (GX2.p||[]).slice(0,4).forEach(pk=>{ o+=`<path d="M${pk[2]} ${pk[3]-R*2.2}L${pk[2]+R*1.8} ${pk[3]+R}H${pk[2]-R*1.8}Z" fill="#5a3a22" stroke="#fff" stroke-width="${W/900}"/>`; });
  /* labels */
  const placed=[], lab=[]; const fits=r=>r[0]>=4&&r[1]>=4&&r[0]+r[2]<=W-4&&r[1]+r[3]<=H-4&&!placed.some(p=>r[0]<p[0]+p[2]&&r[0]+r[2]>p[0]&&r[1]<p[1]+p[3]&&r[1]+r[3]>p[1]);
  const nm=x=>(x[0]==="c"?(typeof mLab==="function"?mLab(x[1]):x[1]):mName(x[1])).replace(/\s*\(grand cru\)$/i,"");
  const cand=[]; m.it.forEach((x,i)=>{ const on=Hs.has(i);
    if(on) cand.push([0,i]); else if(x[0]==="g") cand.push([mode===2?1:4,i]); else if(x[0]==="c"&&(x[4]===1||(mode===1&&x[4]===2))) cand.push([mode===1?(x[4]===1?1.8:3.5):2,i]); else if(mode===2&&x[0]==="r") cand.push([2.5,i]); else if(x[0]==="w"&&(mode===1||(x[4]===1&&mode===0&&x[5]==="z"&&!x[6]))) cand.push([mode===0?2.6:(x[4]===1?2:3),i]); else if(x[0]==="x"&&x[5]==="p") cand.push([5,i]); });
  if(mode===2){ rng.forEach((r,j)=>cand.push([1.5,"r"+j])); (GX2.p||[]).slice(0,4).forEach((p,j)=>cand.push([1.2,"p"+j])); }
  cand.sort((a,b)=>a[0]-b[0]);
  cand.forEach(([pr,i])=>{ if(typeof i==="string"){ const isR=i[0]==="r", d=isR?rng[+i.slice(1)]:GX2.p[+i.slice(1)]; const txt=isR?d[1][li3]:"▲ "+d[0][li3]+" "+d[1].toLocaleString()+" m", f=fs*(isR?(d[0]==="m"?1.05:.9):.8), tw=txt.length*f*.55, th=f*1.15, sx=d[2], sy=isR?d[3]:d[3]+f*1.1;
      const r=[[sx-tw/2,sy-th/2],[sx-tw/2,sy-th*1.6],[sx-tw/2,sy+th*.6]].map(p=>[p[0],p[1],tw,th]).find(fits); if(!r) return; placed.push(r);
      lab.push(`<text x="${r[0]}" y="${r[1]+th*.82}" font-size="${f}" font-family="DM Sans,system-ui,sans-serif" font-weight="800" font-style="italic" letter-spacing="${isR?f*.08:0}" fill="${isR?(d[0]==="m"?"#5a3a22":"#2f5a1e"):"#3a2414"}" stroke="rgba(255,255,255,.8)" stroke-width="${f*.26}" paint-order="stroke" stroke-linejoin="round">${esc(isR&&d[0]==="m"?txt.toUpperCase():txt)}</text>`); return; }
    const x=m.it[i], t=nm(x), sx=x[2], sy=x[3];
    if(pr===0){ const q=Hs.get(i), f=fs*1.12, tw=t.length*f*.56+f*2.2, th=f*1.7, col=mode===0?HLPAL[q%HLPAL.length]:"#7a1d3a";
      const opts=[[sx+f*.6,sy-th/2],[sx-f*.6-tw,sy-th/2],[sx-tw/2,sy-th-f*.6],[sx-tw/2,sy+f*.6]]; [1.8,-1.8,3.4,-3.4,5,-5].forEach(d=>{ opts.push([sx+f,sy-th/2+d*f]); opts.push([sx-f-tw,sy-th/2+d*f]); });
      let r=opts.map(p=>[p[0],p[1],tw,th]).find(fits)||[Math.max(4,Math.min(W-tw-4,sx-tw/2)),Math.max(4,Math.min(H-th-4,sy-th-f)),tw,th]; placed.push(r);
      lab.push(`<g><line x1="${sx}" y1="${sy}" x2="${Math.max(r[0],Math.min(r[0]+tw,sx))}" y2="${Math.max(r[1],Math.min(r[1]+th,sy))}" stroke="#2a1b20" stroke-width="${W/600}"/><rect x="${r[0]}" y="${r[1]}" width="${tw}" height="${th}" rx="${th/2}" fill="${col}" stroke="#fff" stroke-width="${W/700}"/><circle cx="${r[0]+th/2}" cy="${r[1]+th/2}" r="${th*.34}" fill="#fff"/><text x="${r[0]+th/2}" y="${r[1]+th/2+f*.33}" font-size="${f*.8}" text-anchor="middle" fill="${col}" font-weight="900" font-family="DM Sans,system-ui,sans-serif">${q+1}</text><text x="${r[0]+th*.95}" y="${r[1]+th/2+f*.36}" font-size="${f}" fill="#fff" font-weight="800" font-family="DM Sans,system-ui,sans-serif">${esc(t)}</text></g>`); return; }
    const isG=x[0]==="g", isC=x[0]==="c", isX=x[0]==="x"||x[0]==="r", isZ=x[0]==="w"&&x[5]==="z", f=fs*(isX?.95:isC?.85:isG?.95:isZ?.8:pr===3?.78:.9), txt=isG&&mode===2?"▲ "+t:isZ?t.toUpperCase():t, tw=txt.length*f*.55, th=f*1.15;
    const opts=isC?[[sx+f*.5,sy-th/2],[sx-f*.5-tw,sy-th/2],[sx-tw/2,sy-th-f*.3],[sx-tw/2,sy+f*.3]]:[[sx-tw/2,sy-th/2],[sx-tw/2,sy-th-f*.5],[sx-tw/2,sy+f*.5]];
    const r=opts.map(p=>[p[0],p[1],tw,th]).find(fits); if(!r) return; placed.push(r);
    const col=isX?"#4a7a96":isG?"#5a3a22":isC?"#2a1b20":mode===1?"#3a1222":"#2f4a1c";
    lab.push(`<text x="${r[0]}" y="${r[1]+th*.82}" font-size="${f}" font-family="DM Sans,system-ui,sans-serif" font-weight="${isX?500:isC?700:800}" ${isX||isG?`font-style="italic"`:""} fill="${col}" stroke="rgba(255,255,255,.88)" stroke-width="${f*.28}" paint-order="stroke" stroke-linejoin="round">${esc(txt)}</text>`); });
  const svg=`<svg class="gqsvg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img"><defs>${defs}</defs>${o}${lab.join("")}</svg>`;
  /* legend */
  let leg="";
  if(mode===0) leg=hl.map((i,q)=>`<span class="gqk"><i style="background:${HLPAL[q%HLPAL.length]}">${q+1}</i>${esc(nm(m.it[i]))}</span>`).join("");
  if(mode===1){ leg=law.opts.filter(op=>usedCat.has(op[0])).map(op=>`<span class="gqk" title="${esc(op[2]?op[2][l]:"")}"><i style="background:${catCol(op[0])}"></i>${esc(op[1][l])}</span>`).join("")+(hasZ?`<span class="gqk"><i class="zn"></i>${esc(t("gqZone"))}</span>`:"")+(hasV?`<span class="gqk"><i class="vl"></i>${esc(t("gqVill"))}</span>`:"")+`<span class="gqk"><i class="sq"></i>${esc(t("gqCities"))}</span>`;
    const hc=[...new Set(hl.map(i=>gCat(mid,i)).filter(Boolean))].map(c=>law.opts.find(op=>op[0]===c)).filter(Boolean);
    if(hc.length) leg+=`<div class="gqdef">${hc.map(op=>`<p><b style="color:${catCol(op[0])}">${esc(op[1][l])}</b> — ${esc(op[2]?op[2][l]:"")}</p>`).join("")}</div>`; }
  if(mode===2){ const li=lang==="fr"?2:lang==="en"?3:1; const ss=[...usedSoil.keys()];
    const mts=rng.filter(r=>r[0]==="m").map(r=>r[1][li3]).concat(m.it.filter(x=>x[0]==="g").map(nm)).filter((v,k,a)=>a.indexOf(v)===k).slice(0,5);
    const pls=rng.filter(r=>r[0]!=="m").map(r=>r[1][li3]).filter(v=>!mts.includes(v)).slice(0,3), riv=m.it.filter(x=>x[0]==="r").map(nm).slice(0,4);
    leg=(mts.length?`<span class="gqk2"><i style="background:#8a5a32"></i><b>${esc(t("gqMts"))}${lang==="fr"?" :":":"}</b> ${esc(mts.join(", "))}</span>`:"")+(riv.length?`<span class="gqk2"><i style="background:#3f7fae"></i><b>${esc(t("gqRiv"))}${lang==="fr"?" :":":"}</b> ${esc(riv.join(", "))}</span>`:"")+(pls.length?`<span class="gqk2"><i style="background:#8fbf6a"></i><b>${esc(t("gqPl"))}${lang==="fr"?" :":":"}</b> ${esc(pls.join(", "))}</span>`:"")
      +(ss.length?`<span class="gqk2"><i style="background:${SOILS[ss[0]][0]}"></i><b>${esc(t("gqSo"))}${lang==="fr"?" :":":"}</b> ${esc(ss.map(k=>SOILS[k][li].toLowerCase()).join(", "))}</span>`:"")+`<span class="gqk gqnote">⛰ ${esc(t("gqRelNote"))}</span>`;
    G2INFO[mid]={mts,pls,riv,ss:ss.map(k=>SOILS[k][li].toLowerCase())}; }
  return {svg,leg}; }
function gqSents(s){ return String(s||"").split(/(?<=[.!?])\s+(?=[A-ZÀ-ÖØ-Þ«"0-9])/).filter(Boolean); }
function geoScript(b,g){ const l=L(), C=MBY[g.C], Rm=MBY[g.R], li3=lang==="fr"?1:lang==="en"?2:0;
  const nmI=(mid,i)=>{ const x=MBY[mid].it[i]; return mName(x[1]).replace(/\s*\(grand cru\)$/i,""); };
  const hlC=g.Chl.map(i=>nmI(g.C,i)), hlR=g.Rhl.map(i=>nmI(g.R,i));
  const W3=(a,b2,c)=>lang==="fr"?b2:lang==="en"?c:a; const CO=lang==="fr"?" : ":": ";
  const s1=`${t("gqAns")}${CO}${b.o[0][l].replace(/[.;:]\s*$/,"")}. `+W3(`Il paese: ${C.t[0]}.`,`Le pays : ${C.t[1]}.`,`The country: ${C.t[2]}.`)+(hlC.length?" "+W3("In evidenza: ","En évidence : ","Highlighted: ")+hlC.join(", ")+".":"");
  const ex_=gqSents(ex(b)); const half=Math.max(1,Math.ceil(ex_.length/2));
  const s2=W3(`La regione: ${Rm.t[0]}.`,`La région : ${Rm.t[1]}.`,`The region: ${Rm.t[2]}.`)+(hlR.length&&g.R!==g.C?" "+hlR.join(", ")+".":"")+" "+g.Rhl.slice(0,2).map(i=>{ const k=Rm.it[i][1], d=GX.items[k]; const e2=d&&GX.ex[d[2]]; return e2?nmI(g.R,i)+(lang==="fr"?" : ":": ")+e2[l]:""; }).filter(Boolean).join(" ")+" "+ex_.slice(0,half).join(" ");
  const gi=G2INFO[g.R]||{mts:[],pls:[],riv:[],ss:[]};
  let s3=W3("La geografia. ","La géographie. ","The geography. ");
  if(gi.mts.length) s3+=t("gqMts")+CO+gi.mts.slice(0,3).join(", ")+". ";
  if(gi.riv.length) s3+=t("gqRiv")+CO+gi.riv.slice(0,3).join(", ")+". ";
  if(gi.pls.length) s3+=t("gqPl")+CO+gi.pls.slice(0,2).join(", ")+". ";
  if(gi.ss.length) s3+=t("gqSo")+CO+gi.ss.join(", ")+". ";
  s3+=ex_.slice(half).join(" ");
  return [s1,s2.trim(),s3.trim()]; }
function geoBlock(b){ const g=geoFor(b); if(!g) return "";
  const P=[gqSvg(g.C,g.Chl,0),gqSvg(g.R,g.Rhl,1),gqSvg(g.R,g.Rhl,2)];
  const V=[gqSvg(g.C,g.Chl,0),gqSvg(g.R,g.Rhl,1),gqSvg(g.R,g.Rhl,2)];
  const sub=[t("gqCountry"),t("gqLegal"),t("gqRelief")], ic=["🌍","📍","⛰️"], T3=[t("gqT0"),t("gqT1"),t("gqT2")];
  const ttl=[MBY[g.C].t,MBY[g.R].t,MBY[g.R].t].map(x=>x[L()]);
  /* zoom target on the country map */
  const Cm=MBY[g.C], G0=MGEO[g.C]; let zx=50, zy=50, zs=1;
  if(g.Chl.length){ const xs=g.Chl.map(i=>Cm.it[i][2]), ys=g.Chl.map(i=>Cm.it[i][3]); zx=(xs.reduce((a,b)=>a+b,0)/xs.length)/G0.w*100; zy=(ys.reduce((a,b)=>a+b,0)/ys.length)/G0.h*100; zs=g.C===g.R?1.25:1.7; }
  GQSCR[b.id]=geoScript(b,g);
  return `<div class="geoq" data-gq="${b.id}"><div class="geoqh"><span class="geoqi">🗺️</span><b>${esc(t("gqTitle"))}</b><small>${esc(MBY[g.R].t[L()])}</small></div>
   <div class="gqvid" data-gqv="${b.id}" style="--zx:${zx}%;--zy:${zy}%;--zs:${zs}">
     <div class="gqvh">🎬 ${esc(t("gqVid"))}</div>
     <div class="gqstage">${V.map((p,i)=>`<div class="gqlay" data-l="${i}">${p.svg}<span class="gqtag">${ic[i]} ${esc(T3[i])} · ${esc(ttl[i])}</span></div>`).join("")}
       <button type="button" class="gqplay" data-gqplay="1"><span>▶</span>${esc(t("gqPlay"))}</button>
       <div class="gqcap"></div></div>
     <div class="gqctl"><div class="gqbar">${[0,1,2].map(i=>`<i data-s="${i}"><b></b></i>`).join("")}</div><button type="button" class="gqvoice on" data-gqvoice="1">🔊 ${esc(t("gqVoice"))}</button></div>
   </div>
   ${P.map((p,i)=>`<div class="geopane"><p class="geosub"><span>${ic[i]}</span><b>${esc(T3[i])}${lang==="fr"?" : ":": "}${esc(ttl[i])}</b> · ${esc(sub[i])}</p><div class="geomap${i===2?" relief":""}">${p.svg}</div><div class="geoleg">${p.leg}</div></div>`).join("")}</div>`; }
const GQSCR={}; let GQV=null, GQVOICE=true;
function gqVoiceFor(){ try{ const vs=speechSynthesis.getVoices(), lc={it:"it",fr:"fr",en:"en"}[lang]; const c=vs.filter(v=>v.lang&&v.lang.toLowerCase().startsWith(lc)); if(!c.length) return null;
  const sc=v=>(/premium|enhanced|neural|natural|google|siri/i.test(v.name)?10:0)+(/alice|federica|luca|amélie|amelie|thomas|audrey|daniel|serena|samantha|karen|kate|martha/i.test(v.name)?4:0)+(v.localService?1:0)+(lang==="en"&&/GB|UK/i.test(v.lang)?1:0);
  return c.sort((a,b)=>sc(b)-sc(a))[0]; }catch(e){ return null; } }
function gqStop(){ if(GQV){ clearTimeout(GQV.tm); GQV.alive=false; GQV=null; } try{ speechSynthesis.cancel(); }catch(e){} }
function gqScene(box,k){ if(!GQV||!GQV.alive) return; const sc=GQSCR[box.dataset.gqv]||["","",""];
  if(k>=3){ box.classList.remove("run"); box.classList.add("done"); box.querySelector(".gqplay").innerHTML="<span>↻</span>"+esc(t("gqPlay")); GQV=null; return; }
  box.querySelectorAll(".gqlay").forEach((x,j)=>{ x.classList.toggle("on",j===k); x.classList.toggle("zoom",j===k); });
  box.querySelectorAll(".gqbar i").forEach((x,j)=>{ x.classList.toggle("on",j===k); x.classList.toggle("past",j<k); });
  const cap=box.querySelector(".gqcap"), txt=sc[k]; const parts=gqSents(txt); let pi=0;
  const showPart=()=>{ cap.textContent=parts[pi]||txt; cap.classList.remove("in"); void cap.offsetWidth; cap.classList.add("in"); };
  showPart();
  const next=()=>{ if(!GQV||!GQV.alive) return; gqScene(box,k+1); };
  const bar=box.querySelector(`.gqbar i[data-s="${k}"] b`);
  const est=Math.max(4500,txt.length*62); if(bar){ bar.style.transition="none"; bar.style.width="0"; void bar.offsetWidth; bar.style.transition=`width ${est}ms linear`; bar.style.width="100%"; }
  if(GQVOICE&&window.speechSynthesis&&gqVoiceFor()){ let done=false; const go=()=>{ if(done) return; done=true; next(); };
    parts.forEach((p,j)=>{ const u=new SpeechSynthesisUtterance(p); u.lang={it:"it-IT",fr:"fr-FR",en:"en-GB"}[lang]; const v=gqVoiceFor(); if(v) u.voice=v; u.rate=1.0;
      u.onstart=()=>{ pi=j; showPart(); }; if(j===parts.length-1){ u.onend=()=>{ GQV&&(GQV.tm=setTimeout(go,500)); }; u.onerror=()=>{ GQV&&(GQV.tm=setTimeout(go,est)); }; } speechSynthesis.speak(u); });
    GQV.tm=setTimeout(go,est*2.2+4000); }
  else { const per=est/parts.length; parts.forEach((p,j)=>{ if(j) setTimeout(()=>{ if(GQV&&GQV.alive){ pi=j; showPart(); } },per*j); }); GQV.tm=setTimeout(next,est+600); } }
function gqStart(box){ gqStop(); GQV={alive:true,tm:0}; box.classList.add("run"); box.classList.remove("done"); try{ speechSynthesis.getVoices(); }catch(e){} gqScene(box,0); }
document.addEventListener("click",e=>{ const pl=e.target.closest&&e.target.closest("[data-gqplay]"); if(pl){ e.preventDefault(); e.stopPropagation(); gqStart(pl.closest(".gqvid")); return; }
  const vo=e.target.closest&&e.target.closest("[data-gqvoice]"); if(vo){ e.preventDefault(); e.stopPropagation(); GQVOICE=!GQVOICE; vo.classList.toggle("on",GQVOICE); vo.textContent=(GQVOICE?"🔊 ":"🔇 ")+t("gqVoice"); if(!GQVOICE) try{ speechSynthesis.cancel(); }catch(_){} } },true);
try{ speechSynthesis&&speechSynthesis.getVoices(); }catch(e){}
const _renderQ=renderQ;
renderQ=function(){ gqStop(); let h=_renderQ(); try{ const it=quiz.items[quiz.i]; if(it&&it.pick!==null&&it.pick!==undefined){ const b=BY[it.id]; const blk=b?geoBlock(b):""; if(blk) h=h.replace(/(<div class="expl fb[^"]*">[\s\S]*?<\/div>)/,"$1"+blk); } }catch(e){ console.warn(e); } return h; };
try{ const st14=document.createElement("style"); st14.textContent=`
.geoq{border-radius:20px;overflow:hidden;background:var(--surface,#fff);border:1px solid var(--line,#eadfce);box-shadow:0 5px 0 color-mix(in srgb,#2f6f98 18%,transparent);animation:gqin .45s ease-out}
@keyframes gqin{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.geoqh{display:flex;align-items:center;gap:10px;padding:12px 14px;background:linear-gradient(120deg,#1f5a7a,#2f8a83 60%,#6fa04a);color:#fff}
.geoqh b{font-family:var(--f-display);font-size:1.12rem}.geoqh small{margin-left:auto;font-weight:800;background:rgba(255,255,255,.2);padding:3px 10px;border-radius:999px;font-size:.75rem}
.geoqi{font-size:1.3rem}
.geopane{padding:10px 10px 12px;border-top:1px solid var(--line,#eadfce)}
.geosub span{margin-right:4px}
.gqvid{margin:10px;border-radius:16px;overflow:hidden;background:#14202a;color:#fff;box-shadow:0 4px 0 #0a1218}
.gqvh{padding:8px 12px;font-weight:800;font-size:.82rem;background:linear-gradient(90deg,#7a1d3a,#a3264f)}
.gqstage{position:relative;aspect-ratio:4/3;overflow:hidden;background:#cfe4ee}
.gqlay{position:absolute;inset:0;opacity:0;transition:opacity .9s ease;display:flex;align-items:center;justify-content:center;background:#cfe4ee}
.gqlay .gqsvg{width:100%;height:100%;transform-origin:var(--zx) var(--zy);transition:transform 7s ease-in-out}
.gqlay[data-l="1"] .gqsvg,.gqlay[data-l="2"] .gqsvg{transform-origin:50% 50%}
.gqlay.on{opacity:1}.gqvid:not(.run):not(.done) .gqlay[data-l="0"]{opacity:1}
.gqlay[data-l="0"].zoom .gqsvg{transform:scale(var(--zs))}.gqlay[data-l="2"].zoom .gqsvg{transform:scale(1.12)}.gqlay[data-l="1"].zoom .gqsvg{transform:scale(1.05)}
.gqtag{position:absolute;top:8px;left:8px;background:rgba(20,10,14,.78);color:#fff;font-weight:800;font-size:.72rem;padding:4px 10px;border-radius:999px}
.gqplay{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);border:0;border-radius:999px;padding:12px 20px 12px 14px;background:rgba(122,29,58,.94);color:#fff;font:800 .95rem var(--f-body,system-ui);display:flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.35)}
.gqplay span{width:32px;height:32px;border-radius:50%;background:#fff;color:#7a1d3a;display:grid;place-items:center;font-size:.9rem}
.gqvid.run .gqplay{display:none}
.gqcap{position:absolute;left:8px;right:8px;bottom:8px;background:rgba(20,10,14,.86);color:#fff;border-radius:12px;padding:7px 11px;font-size:.8rem;line-height:1.35;font-weight:600;display:none;max-height:42%;overflow:hidden}
.gqvid.run .gqcap{display:block}.gqcap.in{animation:gqcap .4s ease-out}@keyframes gqcap{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.gqctl{display:flex;align-items:center;gap:10px;padding:8px 12px}
.gqbar{flex:1;display:flex;gap:4px}.gqbar i{flex:1;height:5px;border-radius:3px;background:rgba(255,255,255,.2);overflow:hidden}.gqbar i b{display:block;height:100%;width:0;background:#e3b04b}.gqbar i.past b{width:100%!important;transition:none!important}
.gqvoice{border:1px solid rgba(255,255,255,.3);background:transparent;color:#fff;border-radius:999px;padding:5px 10px;font:800 .75rem var(--f-body,system-ui);cursor:pointer}.gqvoice:not(.on){opacity:.6}

.geosub{margin:2px 2px 8px;font-size:.8rem;color:var(--muted,#7b6a5c)}.geosub b{color:var(--fg,#2a1b20)}
.geomap{border-radius:14px;overflow:hidden;border:1px solid var(--line,#eadfce);background:#cfe4ee}
.geomap .gqsvg{display:block;width:100%;height:auto;max-height:62vh}
.geomap.relief{background:#c9dde2}
.geoleg{display:flex;flex-wrap:wrap;gap:6px 12px;margin-top:8px;font-size:.78rem;font-weight:700;align-items:center}
.gqk{display:inline-flex;align-items:center;gap:6px}.gqk i{width:14px;height:14px;border-radius:4px;display:inline-grid;place-items:center;font-style:normal;color:#fff;font-size:.62rem;font-weight:900;border:1px solid rgba(0,0,0,.15)}
.gqk2{display:block;width:100%;font-weight:600;line-height:1.4}.gqk2 i{display:inline-block;width:11px;height:11px;border-radius:3px;margin-right:6px;vertical-align:-1px;border:1px solid rgba(0,0,0,.15)}.gqk2 b{font-weight:800}
.gqk i.zn{background:#e9d3a6;border:1.5px solid #8a6a4a;border-radius:3px}.gqk i.vl{background:#fff;border:2px solid #2a1b20;border-radius:50%;width:11px;height:11px}
.gqk i.sq{background:#2a1b20;width:9px;height:9px;border-radius:1px}
.gqlh{width:100%;font-size:.72rem;text-transform:uppercase;letter-spacing:.06em;color:var(--muted,#7b6a5c)}
.gqnote{width:100%;font-weight:600;color:var(--muted,#7b6a5c)}
.gqdef{width:100%;font-weight:500;font-size:.78rem;line-height:1.4;color:var(--fg,#2a1b20)}.gqdef p{margin:4px 0}
`; document.head.appendChild(st14); }catch(e){}
