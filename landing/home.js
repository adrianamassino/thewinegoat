(function(){
var D=JSON.parse(document.getElementById('home-data').textContent),T=D.tx,LANG=document.documentElement.lang||'en';
function $(s,r){return (r||document).querySelector(s);}function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function shuffle(a){a=a.slice();for(var k=a.length-1;k>0;k--){var j=Math.floor(Math.random()*(k+1)),t=a[k];a[k]=a[j];a[j]=t;}return a;}
/* language memory + app language */
$$('a[data-lang]').forEach(function(a){a.addEventListener('click',function(){try{localStorage.setItem('twg-lang',a.getAttribute('data-lang'));}catch(e){}});});
try{if(!localStorage.getItem('wset3-lang'))localStorage.setItem('wset3-lang',({it:'it',fr:'fr'})[LANG]||'en');}catch(e){}
/* progress shared with the app */
var K='wset3-progress-v1',PT={it:['{n} risposte salvate nel tuo profilo','Continua'],fr:['{n} réponses enregistrées dans votre profil','Continuer'],en:['{n} answers saved to your profile','Continue'],es:['{n} respuestas guardadas en tu perfil','Continuar']};
function getP(){try{var x=JSON.parse(localStorage.getItem(K)||'null');if(x&&x.v===1)return x;}catch(e){}return {v:1,q:{},e:{},s:[]};}
function putP(P){try{localStorage.setItem(K,JSON.stringify(P));}catch(e){}}
function pill(){var n=Object.keys(getP().q).length;if(!n)return;var el=$('#twgpill'),tx=D.pill||PT[LANG]||PT.en;if(!el){el=document.createElement('a');el.id='twgpill';el.className='twgpill';el.href=D.app+'#go=start';document.body.appendChild(el);}
 el.innerHTML='<span>🔥</span><span class="tp-t">'+esc(tx[0].replace('{n}',n))+'</span><span class="tp-b">'+esc(tx[1])+' →</span>';el.classList.add('on');}
function rec(id,ok){var P=getP(),now=Date.now(),q=P.q[id]||[0,0,0];q[0]++;if(ok)q[1]++;q[2]=now;P.q[id]=q;var e=P.e[id];
 if(!ok){if(e){e.n++;e.l=now;e.r=0;}else P.e[id]={n:1,f:now,l:now,r:0};}else if(e&&!e.r){e.r=1;e.rt=now;}putP(P);pill();}
setTimeout(pill,500);
/* tabs */
$$('[data-t3]').forEach(function(b){b.addEventListener('click',function(){$$('[data-t3]').forEach(function(x){x.setAttribute('aria-selected',x===b);});
 $('#p-open').hidden=b.dataset.t3!=='open';$('#p-mcq').hidden=b.dataset.t3!=='mcq';});});
/* open question: marked on the spot against the key points (same idea as the app, no AI) */
var STOP=('il lo la i gli le un una uno di da in con su per tra fra e o ma che non si del della dei delle al alla ai agli nel nella sul sulla come piu molto anche sono essere viene vengono deve devono questo questa quello the a an of to and or in on at for with by from is are be it its as that this which not no so than then into also le la les un une des du de et ou en au aux dans sur pour par avec sans est sont ce cette qui que ne pas plus tres el la los las un una unos de del y o en con por para sin es son que no mas muy se vino vini vin vins wine wines uva uve raisin grape grapes').split(' ');
var SW={};STOP.forEach(function(w){SW[w]=1;});
function norm(s){return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,' ');}
function stems(s){var o={};norm(s).split(' ').forEach(function(w){if(w.length<3||SW[w])return;o[w.length>5?w.slice(0,5):w]=1;});return Object.keys(o);}
function points(k){return String(k).split(/;|\.\s/).map(function(x){return x.trim();}).filter(function(x){return x.length>3;});}
function grade(ans,k,m){var A={};stems(ans).forEach(function(s){A[s]=1;});var P=points(k),hit=[],miss=[];
 P.forEach(function(p){var st=stems(p),n=st.length,got=st.filter(function(s){return A[s];}).length,need=n<=1?1:n===2?2:Math.max(2,Math.ceil(n*.4));(got>=need?hit:miss).push(p);});
 var s=P.length<=m?hit.length*(m/P.length):Math.min(m,hit.length);s=Math.round(s*2)/2;return {s:s,hit:hit,miss:miss};}
var go=$('#ogo');if(go)go.addEventListener('click',function(){var a=$('#oans').value.trim(),box=$('#ores');
 if(a.split(/\s+/).length<3){box.innerHTML='<p class="onote">'+esc(T.o_short)+'</p>';return;}
 var r=grade(a,D.open.k,D.open.m),pc=Math.round(r.s/D.open.m*100);
 box.innerHTML='<div class="ores"><div class="ring" style="--p:'+pc+'"><b>'+r.s+'/'+D.open.m+'</b></div><div><h4>'+esc(T.o_res.replace('{s}',r.s).replace('{m}',D.open.m))+'</h4>'+
  (r.hit.length?'<p><b>'+esc(T.o_hit)+'</b></p><ul class="hit">'+r.hit.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul>':'')+
  (r.miss.length?'<p><b>'+esc(T.o_miss)+'</b></p><ul class="miss">'+r.miss.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul>':'')+
  '<a class="b3 b3p sm" href="'+D.app+'#go=start">'+esc(T.m_after.split(':')[0])+' →</a></div></div>';
 try{var P=getP();P.s.push({t:Date.now(),m:'open',n:D.open.m,c:r.s,ch:['srv']});putP(P);pill();}catch(e){} box.scrollIntoView({behavior:'smooth',block:'nearest'});});
/* multiple choice (Bordeaux) */
var box=$('#mcq3');if(box){var qs=D.mcq,i=0,good=0;
 function draw(){if(i>=qs.length){box.innerHTML='<div class="mq"><h3>'+esc(T.m_score.replace('{n}',good).replace('{t}',qs.length))+'</h3><p>'+esc(T.m_after)+'</p><a class="b3 b3p" href="'+D.app+'#go=start">→</a></div>';return;}
  var q=qs[i],ord=shuffle(q.o.map(function(_,k){return k;}));
  box.innerHTML='<div class="mq"><div class="mhead"><span>'+(i+1)+' / '+qs.length+'</span><span>Bordeaux</span></div><div class="mbar"><i style="width:'+(i/qs.length*100)+'%"></i></div><h3>'+esc(q.q)+'</h3>'+
   ord.map(function(o){return '<button type="button" class="mo" data-o="'+o+'">'+esc(q.o[o])+'</button>';}).join('')+'<div id="mfb"></div></div>';
  $$('.mo',box).forEach(function(b){b.addEventListener('click',function(){var ok=b.dataset.o==='0';if(ok)good++;rec(q.id,ok);
   $$('.mo',box).forEach(function(x){x.disabled=true;if(x.dataset.o==='0')x.classList.add('ok');});if(!ok)b.classList.add('ko');
   $('#mfb',box).innerHTML='<div class="mfb"><b>'+esc(ok?T.m_ok:T.m_ko)+'</b> '+esc(q.e)+'</div><button type="button" class="b3 b3p sm" id="mnx" style="margin-top:12px">'+esc(T.m_next)+' →</button>';
   $('#mnx').onclick=function(){i++;draw();};});});}
 draw();}
/* local currency (fixed price list, never below the euro price) */
(function(){try{var C=D.cur;var EZ='AT BE CY DE EE ES FI FR GR HR IE IT LT LU LV MC MT NL PT SI SK SM VA AD ME XK'.split(' ');
 var MAP={GB:'GBP',US:'USD',CH:'CHF',LI:'CHF',CA:'CAD',AU:'AUD',NZ:'NZD',JP:'JPY',KR:'KRW',CN:'CNY',TW:'TWD',HK:'HKD',MO:'HKD',PL:'PLN',BR:'BRL',AR:'USD',MX:'MXN',CL:'CLP',CO:'COP',SA:'SAR',AE:'AED',DK:'DKK',SE:'SEK',NO:'NOK'};
 var cur=null,loc=null,ls=navigator.languages||[navigator.language||''];for(var j=0;j<ls.length&&!cur;j++){var m=/^[a-z]{2,3}(?:-[A-Za-z]{4})?-([A-Z]{2})$/.exec(ls[j]||'');if(m){cur=EZ.indexOf(m[1])>=0?'EUR':MAP[m[1]]||null;if(cur)loc=ls[j];}}
 if(!cur||!C.list[cur])cur=C.def;var t=C.list[cur],full=6*t[0]+2*t[1],V={a:t[0],b:t[1],bundle:t[2],full:full,save:full-t[2]};
 var f;try{f=new Intl.NumberFormat(loc||C.lang,{style:'currency',currency:cur,maximumFractionDigits:0});}catch(e){f={format:function(x){return x+' '+cur;}};}
 $$('.pr[data-p]').forEach(function(el){var k=el.getAttribute('data-p');if(V[k]!=null)el.textContent=f.format(V[k]);});
 $$('.pp').forEach(function(el){if(/^0\s?€$/.test(el.firstChild&&el.firstChild.textContent||''))el.firstChild.textContent=f.format(0)+' ';});}catch(e){}})();
/* goats hop when tapped */
$$('.g3').forEach(function(g){g.style.pointerEvents='auto';g.addEventListener('click',function(){g.style.animation='none';void g.offsetWidth;g.style.animation='hop3 .9s ease-out';});});
})();

/* the goat next to the phone talks (the drawing only sways gently) */
(function(){ var D=JSON.parse(document.getElementById('home-data').textContent), say=document.getElementById('say'); if(!say||!D.says||!D.says.length) return; var i=0; say.textContent=D.says[0];
  setInterval(function(){ say.classList.add('out'); setTimeout(function(){ i=(i+1)%D.says.length; say.textContent=D.says[i]; say.classList.remove('out'); },300); },4200); })();
