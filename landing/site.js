(function(){
function $(s,r){return (r||document).querySelector(s);}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function shuffle(a){a=a.slice();for(var k=a.length-1;k>0;k--){var j=Math.floor(Math.random()*(k+1)),t=a[k];a[k]=a[j];a[j]=t;}return a;}
/* ---- shared progress with the app (same site, same storage): what you answer here is already in your profile ---- */
var TWGP=(function(){var K='wset3-progress-v1',PL=document.documentElement.lang||'en';
  var TX={it:['{n} risposte salvate nel tuo profilo','Continua'],fr:['{n} réponses enregistrées dans votre profil','Continuer'],en:['{n} answers saved to your profile','Continue'],es:['{n} respuestas guardadas en tu perfil','Continuar']};
  function get(){try{var x=JSON.parse(localStorage.getItem(K)||'null');if(x&&x.v===1)return x;}catch(e){}return {v:1,q:{},e:{},s:[]};}
  function put(P){try{localStorage.setItem(K,JSON.stringify(P));}catch(e){}}
  try{if(!localStorage.getItem('wset3-lang'))localStorage.setItem('wset3-lang',({it:'it',fr:'fr'})[PL]||'en');}catch(e){}
  function pill(){var P=get(),n=Object.keys(P.q).length;if(!n)return;var el=document.getElementById('twgpill');var tx=TX[PL]||TX.en;
    if(!el){el=document.createElement('a');el.id='twgpill';el.className='twgpill';el.href=(document.querySelector('a[href*="app/"]')||{getAttribute:function(){return '/app/'}}).getAttribute('href').replace(/#.*$/,'').replace(/app\/.*$/,'app/')+'#go=start';document.body.appendChild(el);}
    el.innerHTML='<span class="tp-f">🔥</span><span class="tp-t">'+tx[0].replace('{n}',n)+'</span><span class="tp-b">'+tx[1]+' →</span>';el.classList.add('on');}
  function rec(id,ok){if(!id)return;var P=get(),now=Date.now(),q=P.q[id]||[0,0,0];q[0]++;if(ok)q[1]++;q[2]=now;P.q[id]=q;var e=P.e[id];
    if(!ok){if(e){e.n++;e.l=now;e.r=0;delete e.rt;}else P.e[id]={n:1,f:now,l:now,r:0};}else if(e&&!e.r){e.r=1;e.rt=now;}
    put(P);pill();}
  function session(n,c){var P=get();P.s.push({t:Date.now(),m:'web',n:n,c:c,ch:['bdx']});put(P);pill();}
  setTimeout(pill,600);
  return {rec:rec,session:session};})();
/* remember the language the visitor picks: the root page and Netlify (nf_lang cookie) honour it */
$$('a[data-lang]').forEach(function(a){a.addEventListener('click',function(){
  var l=a.getAttribute('data-lang');try{localStorage.setItem('twg-lang',l);}catch(e){}
  document.cookie='nf_lang='+l+';path=/;max-age=31536000;SameSite=Lax';});});
/* mobile menu */
var bg=$('.burger'),mn=$('#menu');
if(bg&&mn){bg.addEventListener('click',function(){var o=mn.classList.toggle('open');bg.setAttribute('aria-expanded',o);});
  mn.addEventListener('click',function(ev){if(ev.target.tagName==='A'){mn.classList.remove('open');bg.setAttribute('aria-expanded',false);}});}
var src=$('#trial-data');if(!src)return;var D=JSON.parse(src.textContent);

/* ---- tabs ---- */
var tabs=$$('[role=tab]');
function sel(tb,focus){tabs.forEach(function(x){var on=x===tb;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;$('#'+x.getAttribute('aria-controls')).hidden=!on;});if(focus)tb.focus();
  if(tb.id==='tab-notes')demoStart();}
tabs.forEach(function(tb,i){tb.addEventListener('click',function(){sel(tb);});
  tb.addEventListener('keydown',function(ev){var k=ev.key,j=i;if(k==='ArrowRight')j=(i+1)%tabs.length;else if(k==='ArrowLeft')j=(i-1+tabs.length)%tabs.length;else if(k==='Home')j=0;else if(k==='End')j=tabs.length-1;else return;ev.preventDefault();sel(tabs[j],true);});});
$$('[data-tabgo]').forEach(function(a){a.addEventListener('click',function(){var tb=document.getElementById('tab-'+a.getAttribute('data-tabgo'));if(tb)sel(tb);});});
$$('a[href^="#"]:not([data-tabgo])').forEach(function(a){var id=a.getAttribute('href').slice(1);var s=document.getElementById(id);if(s&&s.classList.contains('explore'))a.addEventListener('click',function(){if(tabs[0])sel(tabs[0]);});});

/* ---- hero quick question ---- */
var QB=$('#qbody'),QP=D.pool||[],qi=0,QK=D.quick;
function quick(){if(!QB||!QP.length)return;var q=QP[qi%QP.length];var opts=shuffle([0].concat(shuffle(q.o.slice(1).map(function(_,k){return k+1;})).slice(0,2)));
  QB.innerHTML='<p class="qq2">'+esc(q.q)+'</p><div class="qopts">'+opts.map(function(o){return '<button type="button" class="qo" data-o="'+o+'">'+esc(q.o[o])+'</button>';}).join('')+'</div><p class="qfb" hidden></p>';
  $$('.qo',QB).forEach(function(b){b.addEventListener('click',function(){var ok=b.getAttribute('data-o')==='0';TWGP.rec(q.id,ok);
    $$('.qo',QB).forEach(function(x){x.disabled=true;if(x.getAttribute('data-o')==='0')x.classList.add('ok');});if(!ok)b.classList.add('ko');
    var f=$('.qfb',QB);f.hidden=false;f.innerHTML='<strong>'+esc(ok?QK.ok:QK.ko)+'</strong> '+esc(q.e)+' <button type="button" class="qnext">'+esc(QK.next)+' ↻</button>';
    $('.qnext',QB).addEventListener('click',function(){qi++;quick();});});});}
quick();

/* ---- free trial quiz (Bordeaux) ---- */
(function(){var box=$('#quiz');if(!box)return;var T=D.t,qs=D.trial,i=0,good=0,picked=-1,checked=false,order=[];
function draw(){
  if(i>=qs.length){box.innerHTML='<p class="score">'+esc(T.score.replace('{n}',good).replace('{t}',qs.length))+'</p><button class="btn btn-ghost" type="button" id="qre">'+esc(T.restart)+'</button>';
    $('#after').hidden=false;$('#qre').onclick=function(){i=0;good=0;draw();};return;}
  var q=qs[i];order=shuffle(q.o.map(function(_,k){return k;}));picked=-1;checked=false;
  var h='<div class="qhead"><span>'+esc(T.q)+' '+(i+1)+' / '+qs.length+'</span></div><div class="qbar"><i style="width:'+(i/qs.length*100)+'%"></i></div><fieldset class="opts"><legend class="qq">'+esc(q.q)+'</legend>';
  order.forEach(function(o,k){h+='<label class="opt" data-k="'+k+'"><input type="radio" name="tq" value="'+k+'"><span>'+esc(q.o[o])+'</span></label>';});
  h+='</fieldset><div id="qfb"></div><div class="qact"><button class="btn btn-primary" type="button" id="qgo" disabled>'+esc(T.check)+'</button></div>';
  box.innerHTML=h;
  $$('input[name=tq]',box).forEach(function(r){r.addEventListener('change',function(){if(checked)return;picked=+r.value;$('#qgo').disabled=false;});});
  $('#qgo').onclick=function(){
    if(!checked){checked=true;var ok=order[picked]===0;if(ok)good++;TWGP.rec(q.id,ok);if(i===qs.length-1)TWGP.session(qs.length,good);
      $$('.opt',box).forEach(function(l){var k=+l.getAttribute('data-k');$('input',l).disabled=true;if(order[k]===0)l.classList.add('ok');else if(k===picked)l.classList.add('ko');});
      $('#qfb').innerHTML='<p class="fb"><strong>'+esc(ok?T.ok:T.ko)+'</strong> '+esc(q.e)+'</p>';
      this.textContent=i===qs.length-1?T.finish:T.next;this.focus();}
    else{i++;draw();var lg=$('legend',box);if(lg){lg.setAttribute('tabindex','-1');lg.focus();}}};}
draw();})();

/* ---- matching game ---- */
(function(){var box=$('#match');if(!box)return;var M=D.match,sel=null,done=0,err=0,L,R;
function start(){sel=null;done=0;err=0;L=shuffle(M.pairs.map(function(p,i){return i;}));R=shuffle(M.pairs.map(function(p,i){return i;}));
  box.innerHTML='<div class="mcol">'+L.map(function(i){return '<button type="button" class="mb" data-l="'+i+'">'+esc(M.pairs[i][0])+'</button>';}).join('')+'</div><div class="mcol">'+R.map(function(i){return '<button type="button" class="mb r" data-r="'+i+'">'+esc(M.pairs[i][1])+'</button>';}).join('')+'</div><p class="mres" aria-live="polite"></p>';
  $$('.mb',box).forEach(function(b){b.addEventListener('click',function(){
    if(b.hasAttribute('data-l')){$$('[data-l]',box).forEach(function(x){x.classList.remove('sel');x.setAttribute('aria-pressed','false');});if(b.classList.contains('done'))return;sel=+b.getAttribute('data-l');b.classList.add('sel');b.setAttribute('aria-pressed','true');return;}
    if(sel===null||b.classList.contains('done')){b.classList.add('nudge');setTimeout(function(){b.classList.remove('nudge');},400);return;}
    var r=+b.getAttribute('data-r'),l=$('[data-l="'+sel+'"]',box);
    if(r===sel){b.classList.add('done');l.classList.add('done');l.classList.remove('sel');b.disabled=true;l.disabled=true;done++;sel=null;
      if(done===M.pairs.length){var p=$('.mres',box);p.innerHTML=esc(M.done.replace('{e}',err))+' <button type="button" class="btn btn-ghost btn-sm" id="mre">'+esc(M.again)+'</button>';$('#mre').onclick=start;}}
    else{err++;b.classList.add('bad');l.classList.add('bad');setTimeout(function(){b.classList.remove('bad');l.classList.remove('bad');},450);}});});}
start();})();

/* ---- true or false ---- */
(function(){var box=$('#tf');if(!box)return;var F=D.tf,i=0,good=0;
function draw(){if(i>=F.items.length){box.innerHTML='<p class="score">'+esc(F.score.replace('{n}',good).replace('{t}',F.items.length))+'</p><button type="button" class="btn btn-ghost" id="tfre">'+esc(F.again)+'</button>';$('#tfre').onclick=function(){i=0;good=0;draw();};return;}
  var it=F.items[i];box.innerHTML='<div class="qhead"><span>'+(i+1)+' / '+F.items.length+'</span></div><p class="tfs">'+esc(it[0])+'</p><div class="tfb"><button type="button" class="btn tfv" data-v="1">✓ '+esc(F.t)+'</button><button type="button" class="btn tff" data-v="0">✗ '+esc(F.f)+'</button></div><div class="tfx"></div>';
  $$('[data-v]',box).forEach(function(b){b.addEventListener('click',function(){var ok=(b.getAttribute('data-v')==='1')===it[1];if(ok)good++;
    $$('[data-v]',box).forEach(function(x){x.disabled=true;});b.classList.add(ok?'ok':'ko');
    $('.tfx',box).innerHTML='<p class="fb"><strong>'+esc(it[1]?F.t:F.f)+'.</strong> '+esc(it[2])+'</p><button type="button" class="btn btn-primary btn-sm" id="tfn">→</button>';
    $('#tfn').onclick=function(){i++;draw();};$('#tfn').focus();});});}
draw();})();

/* ---- flashcards ---- */
(function(){var box=$('#flash');if(!box)return;var C=D.flash,i=0;
function draw(){var c=C.cards[i%C.cards.length];
  box.innerHTML='<button type="button" class="card3d" aria-label="'+esc(C.flip)+'"><span class="face front"><small>'+((i%C.cards.length)+1)+' / '+C.cards.length+'</small><b>'+esc(c[0])+'</b><em>↻ '+esc(C.flip)+'</em></span><span class="face back"><span>'+esc(c[1])+'</span></span></button><button type="button" class="btn btn-ghost btn-sm" id="fnext">'+esc(C.next)+' →</button>';
  var k=$('.card3d',box);k.addEventListener('click',function(){k.classList.toggle('flip');});$('#fnext').onclick=function(){i++;draw();};}
draw();})();

/* ---- notes demo: live transcript typing ---- */
var demoOn=false;
function demoStart(){if(demoOn)return;var box=$('#demo');if(!box)return;demoOn=true;var lines=D.demo||[],li=0,ci=0;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce){box.textContent=lines.join(' ');return;}
  (function step(){if(li>=lines.length){setTimeout(function(){box.textContent='';li=0;ci=0;step();},2600);return;}
    ci++;box.textContent=lines.slice(0,li).join(' ')+(li?' ':'')+lines[li].slice(0,ci);
    if(ci>=lines[li].length){li++;ci=0;setTimeout(step,700);}else setTimeout(step,38);})();}
/* ---- v11: little goats that hop (app style), bubble burst on right answers ---- */
(function(){ var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var art=$('.hero-art'); if(art){ var row=document.createElement('div'); row.className='kids'; row.setAttribute('aria-hidden','true');
    ['quick','free','explore','method','final'].forEach(function(k,n){ var im=document.createElement('img'); im.src=(document.querySelector('.hg')||{getAttribute:function(){return '../img/goats/hero.webp'}}).getAttribute('src').replace(/goats\/[a-z]+\.webp$/,'goats/'+k+'.webp'); im.alt=''; im.className='kid k'+n; im.loading='lazy'; row.appendChild(im); });
    art.appendChild(row); }
  if(RM) return;
/* goats hop when they come into view, and when tapped */
  var gs=$$('.sg,.freegoat,.final-g img,.kid'); function hop(g){ g.classList.remove('hop'); void g.offsetWidth; g.classList.add('hop'); }
  if('IntersectionObserver' in window){ var io=new IntersectionObserver(function(es){ es.forEach(function(x){ if(x.isIntersecting){ hop(x.target); } }); },{threshold:.6}); gs.forEach(function(g){ io.observe(g); }); }
  gs.concat($$('.hero-art .hg')).forEach(function(g){ g.addEventListener('click',function(){ hop(g); burst(g.getBoundingClientRect()); }); });
  /* bubble burst on every right answer */
  var last=null; document.addEventListener('pointerdown',function(e){ last=e.target.closest('.opt,.qo,button'); },true);
  function burst(r){ var C=['#d4a23a','#c2185b','#8c1d40','#ffd98a','#7a1d3a','#fff2c7'];
    for(var k=0;k<16;k++){ var d=document.createElement('span'); d.className='burst'; d.style.left=(r.left+r.width/2)+'px'; d.style.top=(r.top+r.height/2)+'px';
      d.style.background=C[k%C.length]; var a=Math.random()*Math.PI*2, v=50+Math.random()*90; d.style.setProperty('--bx',Math.cos(a)*v+'px'); d.style.setProperty('--by',Math.sin(a)*v-30+'px');
      document.body.appendChild(d); setTimeout(function(x){ return function(){ x.remove(); }; }(d),900); } }
  var _rec=TWGP.rec; TWGP.rec=function(id,ok){ _rec(id,ok); if(ok&&last){ burst(last.getBoundingClientRect()); } };
})();
})();
/* ---- local currency: the visitor's country picks the currency (no external service) ---- */
(function(){ try{ var D=JSON.parse(document.getElementById('trial-data').textContent).cur; if(!D) return;
  var EZ='AT BE CY DE EE ES FI FR GR HR IE IT LT LU LV MC MT NL PT SI SK SM VA AD ME XK'.split(' ');
  var MAP={GB:'GBP',US:'USD',CH:'CHF',LI:'CHF',CA:'CAD',AU:'AUD',NZ:'NZD',JP:'JPY',KR:'KRW',CN:'CNY',TW:'TWD',HK:'HKD',MO:'HKD',PL:'PLN',BR:'BRL',AR:'USD',MX:'MXN',CL:'CLP',CO:'COP',SA:'SAR',AE:'AED',DK:'DKK',SE:'SEK',NO:'NOK'};
  var cur=null, loc=null, ls=navigator.languages||[navigator.language||''];
  for(var i=0;i<ls.length&&!cur;i++){ var m=/^[a-z]{2,3}(?:-[A-Za-z]{4})?-([A-Z]{2})$/.exec(ls[i]||''); if(m){ var r=m[1]; cur=EZ.indexOf(r)>=0?'EUR':MAP[r]||null; if(cur) loc=ls[i]; } }
  try{ var saved=localStorage.getItem('twg-cur'); if(saved&&D.list[saved]) cur=saved; }catch(e){}
  if(!cur||!D.list[cur]) cur=D.def;
  var t=D.list[cur], full=6*t[0]+2*t[1], V={a:t[0],b:t[1],bundle:t[2],full:full,save:full-t[2]};
  var L=(D.lang||'en').replace('zh-hans','zh-CN').replace('zh-hant','zh-TW').replace('pt-br','pt-BR').replace('es-ar','es-AR');
  var f; try{ f=new Intl.NumberFormat(loc||L,{style:'currency',currency:cur,maximumFractionDigits:0,minimumFractionDigits:0}); }catch(e){ f={format:function(x){return x+' '+cur;}}; }
  document.querySelectorAll('.pr[data-p]').forEach(function(el){ var k=el.getAttribute('data-p'); if(V[k]!=null) el.textContent=f.format(V[k]); });
  var sel=document.getElementById('cursel'); if(sel){ sel.value=cur; sel.addEventListener('change',function(){ try{localStorage.setItem('twg-cur',sel.value);}catch(e){} location.reload(); }); }
}catch(e){} })();

