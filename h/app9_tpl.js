/* ---------- v57: map films — one per regional chapter, synced to the podcast narration ---------- */
const PFS=__PFS__;
const CLK={mar:["clima marittimo","climat maritime","maritime climate"],con:["clima continentale","climat continental","continental climate"],med:["clima mediterraneo","climat méditerranéen","Mediterranean climate"],cool:["fresco","frais","cool"],hot:["caldo","chaud","warm / hot"],rain:["pioggia","pluie","rain"],frost:["gelate","gel","frost"],fog:["nebbia","brouillard","fog"],alt:["altitudine","altitude","altitude"],wind:["vento","vent","wind"]};
const CLC={mar:"#3b7fa8",con:"#7a5aa8",med:"#d9a441",cool:"#4f9cc8",hot:"#d2622a",rain:"#4f7fb0",frost:"#8fc8e8",fog:"#8a939b",alt:"#6b8a5a",wind:"#7c98a8"};
const xIcon=(k,x,y)=>{ const c="#fff"; const I={
  mar:`<path d="M-6 1q3 -3 6 0t6 0M-6 5q3 -3 6 0t6 0" stroke="${c}" stroke-width="1.4" fill="none"/>`,
  con:`<path d="M0 -6V6M-5 -3L5 3M-5 3L5 -3" stroke="${c}" stroke-width="1.4"/>`,
  med:`<circle r="3.4" fill="${c}"/>${[0,60,120,180,240,300].map(a=>`<path d="M0 -5.6V-7" stroke="${c}" stroke-width="1.2" transform="rotate(${a})"/>`).join("")}`,
  cool:`<path d="M-1.5 -6V3a3 3 0 1 0 3 0V-6z" fill="none" stroke="${c}" stroke-width="1.2"/><circle cy="4" r="1.6" fill="${c}"/>`,
  hot:`<path d="M-1.5 -6V3a3 3 0 1 0 3 0V-6z" fill="${c}"/>`,
  rain:`<path d="M-5 -1a4 4 0 0 1 8 -2a3 3 0 0 1 2 5H-4a2.5 2.5 0 0 1 -1 -3z" fill="${c}"/><path d="M-3 5l-1 2M1 5l-1 2M4 5l-1 2" stroke="${c}" stroke-width="1.1"/>`,
  frost:`<path d="M0 -6V6M-5 -3L5 3M-5 3L5 -3" stroke="${c}" stroke-width="1.4"/><circle r="1.4" fill="${c}"/>`,
  fog:`<path d="M-6 -3H6M-5 0H5M-6 3H6" stroke="${c}" stroke-width="1.4"/>`,
  alt:`<path d="M-7 5L-2 -4L1 1L3 -2L7 5Z" fill="${c}"/>`,
  wind:`<path d="M-6 -2H3a2 2 0 1 0 -2 -2M-6 2H5a2 2 0 1 1 -2 2" stroke="${c}" stroke-width="1.3" fill="none"/>`}; return `<g transform="translate(${x} ${y})">${I[k]||""}</g>`; };
const pfChip=(x,y,txt,dot,bg)=>{ const w=Math.min(150,txt.length*5.2+(dot?20:14)); return `<g><rect x="${x-w}" y="${y-9}" width="${w}" height="16" rx="8" fill="${bg||"rgba(20,10,14,.84)"}" stroke="rgba(212,162,58,.55)" stroke-width=".8"/>${dot||""}<text x="${x-7}" y="${y+2.6}" font-size="7.6" fill="#fff4dc" text-anchor="end" font-family="DM Sans,system-ui,sans-serif" font-weight="700">${esc(txt)}</text></g>`; };
const HLPAL=["#d99a1e","#c2185b","#13857f","#7b4bb5","#e0662a","#2f74b5","#5f9a2e","#a8324a","#8a6a3a"];
function xMapView(mid,hl,B){ const m=MBY[mid], G=MGEO[mid]; if(!m||!G) return ""; B=B||{x:0,y:0,w:320,h:200}; hl=hl||[];
  let x0,y0,w,h; const R=B.w/B.h;
  if(hl.length){ const xs=hl.map(i=>m.it[i][2]), ys=hl.map(i=>m.it[i][3]); x0=Math.min(...xs); const x1=Math.max(...xs); y0=Math.min(...ys); const y1=Math.max(...ys);
    w=Math.max((x1-x0)*1.5,G.w*.5); h=Math.max((y1-y0)*1.5,G.h*.42); const cx=(x0+x1)/2, cy=(y0+y1)/2; if(w/h<R) w=h*R; else h=w/R; x0=cx-w/2; y0=cy-h/2;
    if(w>G.w*1.02&&h>G.h*1.02){ w=G.w*1.02; h=w/R; if(h<G.h*1.02){ h=G.h*1.02; w=h*R; } x0=(G.w-w)/2; y0=(G.h-h)/2; }
    else { x0=Math.max(Math.min(0,(G.w-w)/2),Math.min(Math.max(G.w-w,(G.w-w)/2),x0)); y0=Math.max(Math.min(0,(G.h-h)/2),Math.min(Math.max(G.h-h,(G.h-h)/2),y0)); } }
  else { w=G.w*1.03; h=G.h*1.03; if(w/h<R) w=h*R; else h=w/R; x0=(G.w-w)/2; y0=(G.h-h)/2; }
  const k=w/B.w, H=new Map(); hl.forEach((j,q)=>H.set(j,q));
  const S=(X,Y)=>[(X-x0)/k,(Y-y0)/k];
  const zones=m.it.map((x,i)=>[x,i]).filter(([x])=>x[5]==="z").sort((a,b)=>(H.has(a[1])-H.has(b[1]))||(b[0][6]-a[0][6])).map(([x,i])=>{ const q=H.get(i), on=q!==undefined, col=on?HLPAL[q%HLPAL.length]:null;
    if(x[0]==="x") return `<path d="${x[7]}" fill="rgba(255,255,255,.06)" stroke="rgba(80,60,40,.35)" stroke-width="${.6*k}"/>`;
    return `<path d="${x[7]}" fill="${on?col:hl.length?"rgba(120,150,90,.22)":(x[6]?"rgba(120,150,90,.28)":"rgba(104,146,74,.55)")}" stroke="${on?"#fff":"rgba(255,255,255,.7)"}" stroke-width="${(on?1.4:.5)*k}" ${on?`fill-opacity=".9"`:""}>${on?`<animate attributeName="fill-opacity" values=".9;.55;.9" dur="2.6s" repeatCount="indefinite"/>`:""}</path>`; }).join("");
  const lines=m.it.filter(x=>x[5]==="l").map(x=>`<path d="${x[7]}" fill="none" stroke="#3f88cf" stroke-width="${1.7*k}" stroke-linecap="round"/>`).join("");
  const showCity=(x,i)=>x[0]==="c"&&(H.has(i)||x[4]===1);
  const pts=m.it.map((x,i)=>[x,i]).filter(([x,i])=>x[5]==="p"&&(H.has(i)||showCity(x,i)||(x[0]==="w"&&!hl.length&&x[4]===1))).map(([x,i])=>{ const q=H.get(i), on=q!==undefined;
    return x[0]==="c"&&!on?`<rect x="${x[2]-2.2*k}" y="${x[3]-2.2*k}" width="${4.4*k}" height="${4.4*k}" fill="#2a1b20" stroke="#fff" stroke-width="${.9*k}"/>`:`<circle cx="${x[2]}" cy="${x[3]}" r="${(on?3.8:2.6)*k}" fill="${on?HLPAL[q%HLPAL.length]:"#5f8a3e"}" stroke="#fff" stroke-width="${1*k}"/>`; }).join("");
  /* label placement with collision avoidance (screen units) */
  const placed=[], out=[]; const fits=(r)=>r[0]>=2&&r[1]>=2&&r[0]+r[2]<=B.w-2&&r[1]+r[3]<=B.h-2&&!placed.some(p=>!(r[0]+r[2]<p[0]||p[0]+p[2]<r[0]||r[1]+r[3]<p[1]||p[1]+p[3]<r[1]));
  const nm_=x=>(x[0]==="c"?(typeof mLab==="function"?mLab(x[1]):x[1]):mName(x[1])).replace(/\s*\(grand cru\)$/i,"");
  const cand=[];
  m.it.forEach((x,i)=>{ const q=H.get(i); if(q!==undefined) cand.push({i,x,pr:0,q});
    else if(x[0]==="c"&&x[4]===1) cand.push({i,x,pr:hl.length?2:3});
    else if(!hl.length&&x[0]==="w"&&x[4]===1) cand.push({i,x,pr:1});
    else if(x[0]==="x"&&x[5]==="p") cand.push({i,x,pr:4}); });
  cand.sort((a,b)=>a.pr-b.pr||(a.q||0)-(b.q||0));
  cand.forEach(c=>{ const x=c.x, nm=nm_(x); const [sx,sy]=S(x[2],x[3]); if(sx<-4||sy<-4||sx>B.w+4||sy>B.h+4) return;
    if(c.pr===0){ const fs=7.4, tw=nm.length*fs*.56+18, th=13; const col=HLPAL[c.q%HLPAL.length];
      const opts=[[sx+5,sy-th/2],[sx-5-tw,sy-th/2],[sx-tw/2,sy-th-5],[sx-tw/2,sy+5],[sx+5,sy-th-3],[sx+5,sy+3],[sx-5-tw,sy-th-3],[sx-5-tw,sy+3]]; [16,-16,30,-30,44,-44,58,-58].forEach(dy=>{ opts.push([sx+8,sy-th/2+dy]); opts.push([sx-8-tw,sy-th/2+dy]); });
      let r=opts.map(o=>[o[0],o[1],tw,th]).find(fits); if(!r){ const ov=q=>placed.reduce((a,p)=>a+Math.max(0,Math.min(q[0]+q[2],p[0]+p[2])-Math.max(q[0],p[0]))*Math.max(0,Math.min(q[1]+q[3],p[1]+p[3])-Math.max(q[1],p[1])),0); r=opts.map(o=>[Math.max(2,Math.min(B.w-tw-2,o[0])),Math.max(2,Math.min(B.h-th-2,o[1])),tw,th]).sort((a,b)=>ov(a)-ov(b))[0]; }
      placed.push(r); const lx=r[0]+r[2]/2, ly=r[1]+r[3]/2;
      out.push(`<g><line x1="${sx}" y1="${sy}" x2="${Math.max(r[0],Math.min(r[0]+r[2],sx))}" y2="${Math.max(r[1],Math.min(r[1]+r[3],sy))}" stroke="#fff" stroke-width="1"/><rect x="${r[0]}" y="${r[1]}" width="${tw}" height="${th}" rx="6.5" fill="${col}" stroke="#fff" stroke-width=".8"/><circle cx="${r[0]+7}" cy="${ly}" r="4.6" fill="#fff"/><text x="${r[0]+7}" y="${ly+2.3}" font-size="6.2" text-anchor="middle" fill="${col}" font-family="DM Sans,system-ui,sans-serif" font-weight="900">${c.q+1}</text><text x="${r[0]+14}" y="${ly+2.6}" font-size="${fs}" fill="#fff" font-family="DM Sans,system-ui,sans-serif" font-weight="800">${esc(nm)}</text></g>`); return; }
    const sea=x[0]==="x", city=x[0]==="c", fs=sea?6.4:city?6.2:6.6, tw=nm.length*fs*.55+2, th=fs+2;
    const opts=city?[[sx+4,sy-th/2],[sx-4-tw,sy-th/2],[sx-tw/2,sy-th-3],[sx-tw/2,sy+3]]:[[sx-tw/2,sy-th/2],[sx-tw/2,sy-th-4],[sx-tw/2,sy+4]];
    const r=opts.map(o=>[o[0],o[1],tw,th]).find(fits); if(!r) return; placed.push(r);
    out.push(`<text x="${r[0]}" y="${r[1]+th-2}" font-size="${fs}" font-family="DM Sans,system-ui,sans-serif" font-weight="${sea?500:700}" ${sea?`font-style="italic"`:""} fill="${sea?"#d6ecfa":city?"#2a1b20":"#1f3a14"}" stroke="${sea?"rgba(20,40,60,.55)":"rgba(255,255,255,.85)"}" stroke-width="2" paint-order="stroke" stroke-linejoin="round">${esc(nm)}</text>`); });
  /* locator inset when zoomed */
  let inset=""; if(!B.noInset&&hl.length&&w*h<G.w*G.h*.45){ const iw=Math.min(58,B.w*.28), ih=Math.min(46,iw*G.h/G.w), iw2=ih*G.w/G.h, ix=B.w-iw2-5, iy=B.h-ih-5;
    inset=`<g><rect x="${ix-2}" y="${iy-2}" width="${iw2+4}" height="${ih+4}" rx="4" fill="rgba(20,10,14,.75)" stroke="#d4a23a" stroke-width=".7"/><svg x="${ix}" y="${iy}" width="${iw2}" height="${ih}" viewBox="0 0 ${G.w} ${G.h}"><rect width="${G.w}" height="${G.h}" fill="#2f6f98"/><path d="${G.land}" fill="#efe6cf"/><path d="${G.b0}" fill="none" stroke="rgba(70,40,30,.6)" stroke-width="${G.w/120}"/><rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="rgba(194,24,91,.25)" stroke="#c2185b" stroke-width="${G.w/60}"/></svg></g>`; }
  return `<svg x="${B.x}" y="${B.y}" width="${B.w}" height="${B.h}" viewBox="0 0 ${B.w} ${B.h}"><svg x="0" y="0" width="${B.w}" height="${B.h}" viewBox="${x0} ${y0} ${w} ${h}" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="pfsea" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2a5f86"/><stop offset="1" stop-color="#3a7fab"/></linearGradient><linearGradient id="pfland" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#f6efdc"/><stop offset="1" stop-color="#e6d8b4"/></linearGradient></defs><rect x="${x0-w}" y="${y0-h}" width="${w*3}" height="${h*3}" fill="#1a2630"/><rect x="0" y="0" width="${G.w}" height="${G.h}" fill="url(#pfsea)"/><path d="${G.grat}" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="${.5*k}"/><path d="${G.land}" fill="url(#pfland)" stroke="rgba(60,40,20,.4)" stroke-width="${.8*k}"/><path d="${G.lake}" fill="#3f86b8"/><path d="${G.riv}" fill="none" stroke="#5a9bd0" stroke-width="${.9*k}"/><path d="${G.b1}" fill="none" stroke="rgba(90,60,40,.3)" stroke-width="${.6*k}" stroke-dasharray="${3*k} ${2*k}"/><path d="${G.b0}" fill="none" stroke="rgba(70,40,30,.65)" stroke-width="${1.1*k}"/>${zones}${lines}${pts}</svg>${out.join("")}${inset}</svg>`; }
function hlBy(mid,names){ const m=MBY[mid]; if(!m) return []; return names.map(n=>m.it.findIndex(x=>x[1]===n||x[1]===n+" town")).filter(i=>i>=0); }
function mapAspect(mid){ const G=MGEO[mid]; return G?G.w/G.h:1.4; }
const PGBY={}; try{ GRAPES.forEach(g=>PGBY[g.k]=g); }catch(e){}
const PFL={pl:["Luoghi","Lieux","Places"],gr:["Vitigni","Cépages","Grapes"],cl:["Clima","Climat","Climate"],nb:["Cifre","Chiffres","Figures"],kw:["Da ricordare","À retenir","Key points"],kick:["I paesi del vino","Les pays du vin","Wine countries"],kickS:["Stili del mondo","Styles du monde","World styles"],tags:["Clima · Vitigni · Denominazioni","Climat · Cépages · Appellations","Climate · Grapes · Appellations"]};
const pfFont=`font-family="Fraunces,Georgia,serif"`, pfSans=`font-family="DM Sans,system-ui,sans-serif"`;
function pfBg(){ return `<defs><radialGradient id="pfbg" cx="0" cy="0" r="1.3"><stop offset="0" stop-color="#5a1430"/><stop offset=".55" stop-color="#2a0a16"/><stop offset="1" stop-color="#12060a"/></radialGradient><pattern id="pfdots" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".6" fill="rgba(255,214,130,.08)"/></pattern></defs><rect width="320" height="200" fill="url(#pfbg)"/><rect width="320" height="200" fill="url(#pfdots)"/>`; }
function pfAgg(pf){ if(pf._agg) return pf._agg; const g={},k={}; pf.s.forEach(sc=>{ sc.g.forEach(x=>g[x]=(g[x]||0)+1); sc.k.forEach(x=>k[x]=(k[x]||0)+1); });
  const top=o=>Object.entries(o).sort((a,b)=>b[1]-a[1]).map(x=>x[0]); return pf._agg={g:top(g).slice(0,6),k:top(k).slice(0,3)}; }
function pfGrapeChip(x,y,k,d,mw){ const g=PGBY[k], w=Math.min(mw||118,k.length*4.6+18); return fD(d,`<g><rect x="${x}" y="${y-8}" width="${w}" height="14" rx="7" fill="rgba(255,255,255,.08)" stroke="rgba(255,214,130,.35)" stroke-width=".6"/><circle cx="${x+8}" cy="${y-1}" r="3.2" fill="${g&&g.c==="w"?"#e8d36a":"#a3264f"}" stroke="#fff" stroke-width=".6"/><text x="${x+15}" y="${y+1.8}" font-size="7" fill="#fff4dc" ${pfSans} font-weight="700">${esc(k)}</text></g>`); }
function pfClimChip(x,y,k,d,mw){ const l=L(), tt=CLK[k][l], w=Math.min(mw||118,tt.length*4.4+22); return fD(d,`<g><rect x="${x}" y="${y-8}" width="${w}" height="14" rx="7" fill="${CLC[k]}"/>${xIcon(k,x+9,y-1)}<text x="${x+17}" y="${y+1.8}" font-size="6.8" fill="#fff" ${pfSans} font-weight="800">${esc(tt)}</text></g>`); }
function pfCover(pf){ const l=L(), f=FILMS.find(x=>x.pod===pf.pod), A=pfAgg(pf), sc=pf.s[0];
  const ti=tx(f.t), ls=wrapT(ti,15).slice(0,3), mx=Math.max(...ls.map(x=>x.length)), fs=Math.min(ls.length>2?17:22,140/(mx*.56));
  let o=`<svg class="fsvg" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${fDefs}${FXD}${pfBg()}`;
  o+=`<rect x="166" y="16" width="146" height="168" rx="10" fill="#0d1d2b"/>${xMapView(sc.m,[],{x:166,y:16,w:146,h:168})}<rect x="166" y="16" width="146" height="168" rx="10" fill="none" stroke="#d4a23a" stroke-width="1.4"/><rect x="170" y="20" width="138" height="160" rx="7" fill="none" stroke="rgba(255,227,161,.35)" stroke-width=".6"/>`;
  o+=fD(.1,`<text x="16" y="50" font-size="6.6" letter-spacing="2.2" fill="#e3b04b" ${pfSans} font-weight="800">${esc((pf.sec==="s"?PFL.kickS:PFL.kick)[l].toUpperCase())}</text>`);
  o+=fD(.25,ls.map((t_,j)=>`<text x="16" y="${58+fs+j*fs*1.1}" font-size="${fs}" fill="#fff4dc" ${pfFont} font-weight="700">${esc(t_)}</text>`).join(""));
  const yb=58+fs+(ls.length-1)*fs*1.1+8;
  o+=fD(.4,`<path d="M16 ${yb}H70M96 ${yb}H150" stroke="#d4a23a" stroke-width=".8"/><path d="M76 ${yb}c3-4 7-4 7 0c0-4 4-4 7 0c-3 4-7 4-7 0c0 4-4 4-7 0z" fill="none" stroke="#d4a23a" stroke-width=".8"/>`);
  o+=fD(.5,`<text x="16" y="${yb+14}" font-size="7" fill="rgba(255,244,220,.75)" ${pfSans} font-weight="700">${esc(PFL.tags[l])}</text>`);
  let y=yb+32; A.g.slice(0,4).forEach((k,j)=>{ if(y<186){ o+=pfGrapeChip(16+(j%2)*72,y,k.length>13?k.slice(0,12)+"…":k,.7+j*.12); if(j%2) y+=17; } });
  if(A.g.length%2&&A.g.length<4) y+=17; A.k.slice(0,1).forEach((k,j)=>{ if(y<190) o+=pfClimChip(16,y,k,1.2); });
  return o+`<rect width="320" height="200" fill="url(#fxvig)" opacity=".5"/></svg>`; }
const PFSTOP=new Set(["vitigno","cepage","grape","grape variety","varieta","variete","variety","resa","rendement","yield","vino","vin","wine","clima","climat","climate","acidita","acidite","acidity","tannino","tanin","tannin","corpo","corps","body","alcol","alcool","alcohol","uva","raisin","terroir","village","vigneto","vignoble","vineyard","cantina","chai","winery","annata","millesime","vintage","stile","style","qualita","qualite","quality","aroma","arome","fermentazione","fermentation","botte","fut","barrel","suolo","sol","soil","maturazione","maturite","ripeness","vendemmia","vendange","harvest"]);
function pfKeyTerms(pf,i){ const X=PX[flLang()]&&PX[flLang()][pf.pod]; if(!X||typeof kwLex!=="function") return []; const txt=X.p[i-1]||""; const {re,byk}=kwLex(); const out=new Map(); let m; re.lastIndex=0;
  while((m=re.exec(txt))){ const e=byk.get(m[0].toLowerCase()); if(e&&e.c==="tech"&&!PFSTOP.has(flNorm(e.t))&&!out.has(m[0].toLowerCase())) out.set(m[0].toLowerCase(),e.t); } return [...out.values()].slice(0,6); }
function pfSvg(pf,i){ if(i===0) return pfCover(pf);
  const sc=pf.s[i], l=L(), m=MBY[sc.m], bw=sc.hl.length?Math.round(Math.max(130,Math.min(200,158*Math.max(.82,mapAspect(sc.m))))):Math.round(Math.max(130,Math.min(214,158*mapAspect(sc.m)))), B={x:10,y:34,w:bw,h:158,num:1};
  let o=`<svg class="fsvg" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${fDefs}${FXD}${pfBg()}`;
  o+=`<rect x="${B.x}" y="${B.y}" width="${B.w}" height="${B.h}" rx="8" fill="#0d1d2b"/>${xMapView(sc.m,sc.hl,B)}<rect x="${B.x}" y="${B.y}" width="${B.w}" height="${B.h}" rx="8" fill="none" stroke="#d4a23a" stroke-width="1.2"/>`;
  const P=[]; let y=44; const X0=B.x+B.w+8, W=312-X0;
  const head=(lab,d)=>{ P.push(fD(d,`<text x="${X0+6}" y="${y}" font-size="5.8" letter-spacing="1.4" fill="#e3b04b" ${pfSans} font-weight="800">${esc(lab.toUpperCase())}</text><path d="M${X0+6} ${y+3}H${X0+W-6}" stroke="rgba(212,162,58,.4)" stroke-width=".5"/>`)); y+=12; };
  let d=.3;
  if(sc.hl.length){ head(PFL.pl[l],d); sc.hl.slice(0,5).forEach((j,q)=>{ if(y>186) return; const x=m.it[j], nm=x[0]==="c"&&typeof mLab==="function"?mLab(x[1]):mName(x[1]); const mx=Math.floor((W-24)/4), s_=nm.length>mx?nm.slice(0,mx-1)+"…":nm;
    P.push(fD(d+=.15,`<g><circle cx="${X0+11}" cy="${y-2.4}" r="4.6" fill="${HLPAL[q%HLPAL.length]}" stroke="#fff" stroke-width=".6"/><text x="${X0+11}" y="${y-.2}" font-size="5.6" text-anchor="middle" fill="#fff" ${pfSans} font-weight="800">${q+1}</text><text x="${X0+19}" y="${y}" font-size="7.2" fill="#fff4dc" ${pfSans} font-weight="700">${esc(s_)}</text></g>`)); y+=12; }); y+=4; }
  if(sc.g.length&&y<176){ head(PFL.gr[l],d+=.1); sc.g.slice(0,4).forEach(k=>{ if(y>188) return; P.push(pfGrapeChip(X0+6,y,k.length>16?k.slice(0,15)+"…":k,d+=.12,W-12)); y+=15; }); y+=3; }
  if(sc.k.length&&y<176){ head(PFL.cl[l],d+=.1); sc.k.slice(0,3).forEach(k=>{ if(y>188) return; P.push(pfClimChip(X0+6,y,k,d+=.12,W-12)); y+=15; }); y+=3; }
  const nb=(sc.nb[l]||[]); if(nb.length&&y<170){ head(PFL.nb[l],d+=.1); nb.slice(0,2).forEach(n=>{ if(y>186) return; P.push(fD(d+=.15,`<text x="${X0+6}" y="${y+4}" font-size="${n.length>12?9:12}" fill="#ffe3a1" ${pfFont} font-weight="700">${esc(n)}</text>`)); y+=17; }); }
  if(y<120){ const kt=pfKeyTerms(pf,i); if(kt.length){ head(PFL.kw[l],d+=.1); kt.forEach(k=>{ if(y>188) return; P.push(fD(d+=.12,`<text x="${X0+6}" y="${y}" font-size="7" fill="#fff4dc" ${pfSans} font-weight="700">• ${esc(k.length>20?k.slice(0,19)+"…":k)}</text>`)); y+=11; }); } }
  if(!P.length){ const hh=wrapT(pfHead(pf,i),13).slice(0,5); P.push(fD(.3,`<text x="${X0+8}" y="52" font-size="5.8" letter-spacing="1.4" fill="#e3b04b" ${pfSans} font-weight="800">${esc(tx(FILMS.find(x=>x.pod===pf.pod).t).toUpperCase().slice(0,19))}</text>`+hh.map((h_,j)=>`<text x="${X0+8}" y="${72+j*15}" font-size="12" fill="#fff4dc" ${pfFont} font-weight="700">${esc(h_)}</text>`).join(""))); }
  o+=`<rect x="${X0}" y="${B.y}" width="${W}" height="${B.h}" rx="8" fill="rgba(255,255,255,.05)" stroke="rgba(212,162,58,.35)" stroke-width=".6"/>`+P.join("");
  return o+`<rect width="320" height="200" fill="url(#fxvig)" opacity=".45"/></svg>`; }
function pfHead(pf,i){ const l=L(), f=FILMS.find(x=>x.pod===pf.pod); if(i===0) return tx(f.t);
  const sc=pf.s[i]; if(sc.h&&sc.h[l]) return sc.h[l];
  const m=MBY[sc.m], nm=sc.hl.slice(0,2).map(j=>{ const x=m.it[j]; return x[0]==="c"&&typeof mLab==="function"?mLab(x[1]):mName(x[1]); });
  if(nm.length) return nm.join(" · ");
  if(sc.g.length) return ["Vitigni","Cépages","Grapes"][l]+": "+sc.g.slice(0,2).join(", ");
  if(sc.k.length){ const c=CLK[sc.k[0]][l]; return c.charAt(0).toUpperCase()+c.slice(1); }
  const X=PX[flLang()]&&PX[flLang()][pf.pod], p=X&&X.p[i-1]; if(p){ const c=p.split(/[.:;!?]/)[0].split(/,/)[0].trim().split(/\s+/).slice(0,7).join(" "); if(c.length>6) return c+(p.split(/[.:;!?]/)[0].trim().split(/\s+/).length>7?"…":""); }
  return tx(f.t); }
let pfLoading={};
function pfText(pf,i){ const lg=flLang(); if(i===0) return tx(FILMS.find(x=>x.pod===pf.pod).t);
  const X=PX[lg]&&PX[lg][pf.pod]; if(X) return X.p[i-1]||"";
  if(!pfLoading[lg]){ pfLoading[lg]=1; pdText(lg).then(()=>{ if(view==="film") render(); }); } return "…"; }
const PFIDS=new Set();
PFS.forEach(pf=>{ const P=PODS.find(p=>p.id===pf.pod); if(!P) return; const id="m"+pf.n; PFIDS.add(id);
  const s=pf.s.map((sc,i)=>({get h(){ return pfHead(pf,i); }, get c(){ return pfText(pf,i); }, v:()=>pfSvg(pf,i)}));
  FILMS.push({id, sec:pf.sec, ch:pf.ch, ic:"maps", pod:pf.pod, nw:1, map:1, t:I3(P.t[0],P.t[1],P.t[2]), s,
    th:()=>pfCover(pf)});
  const T={}; ["it","fr","en"].forEach(l=>{ if(P.T&&P.T[l]&&P.d&&P.d[l]&&P.T[l].length===pf.s.length-1) T[l]=[0].concat(P.T[l],[P.d[l]]); }); FLT[id]=T; });
function flSrc(){ const f=FILMS[FL.f]; return f.pod?`pods/${flLang()}/${f.pod}.mp3`:`audio/${flLang()}/${f.id}.mp3`; }
FSEC.m=I3("Paesi e regioni: i film con le mappe","Pays et régions : les films avec cartes","Countries and regions: map films");
function renderFilms(){ const seen=flSeen(); let n=0;
  return `<section class="view films"><p class="flintro">${t("flIntro")}</p>${["v","c","r","m","s","t"].map(sec=>{ const L_=FILMS.map((f,i)=>[f,i]).filter(([f])=>(f.map&&f.sec==="r"?"m":f.sec)===sec); if(!L_.length) return "";
    return `<h2 class="hsec">${esc(tx(FSEC[sec]))}</h2><div class="flgrid">${L_.map(([f,i])=>`<button type="button" class="flcard" data-film="${i}"><span class="flthumb">${f.th?f.th():f.s[0].v()}<span class="flplay">▶</span><span class="flnum">${++n}</span>${f.nw&&!seen[f.id]?`<span class="flnew">${esc(t("ytNew"))}</span>`:""}</span><span class="fltx"><b>${esc(tx(f.t))}</b><span>${f.s.length} ${t("flScenes")}${seen[f.id]?` · ✓ ${t("flSeen")}`:""}</span></span></button>`).join("")}</div>`; }).join("")}</section>`; }
