# -*- coding: utf-8 -*-
"""An articulated vector goat (side view, facing right) drawn after The Wine Goat mascot:
cream fur, curled brown horns, pink ear, burgundy scarf with gold trim, gold earring.
Every part is its own group so CSS can animate legs, head, ear, tail, scarf and mouth."""

def leg(cls, x, y, shade=False):
    fur = '#f3e3cf' if shade else '#fff8ee'
    line = '#c9a98a'
    return (f'<g class="leg {cls}" style="transform-origin:{x}px {y}px">'
            f'<path d="M{x-9},{y-6} Q{x-11},{y+22} {x-7},{y+40} L{x-8},{y+50} Q{x},{y+54} {x+8},{y+50} L{x+7},{y+40} Q{x+11},{y+20} {x+9},{y-6} Z" fill="{fur}" stroke="{line}" stroke-width="1.6"/>'
            f'<path d="M{x-6},{y+12} q6,4 12,0" fill="none" stroke="#e8d3bb" stroke-width="1.4" stroke-linecap="round"/>'
            f'<path d="M{x-9},{y+48} Q{x},{y+44} {x+9},{y+48} L{x+10},{y+57} Q{x},{y+61} {x-10},{y+57} Z" fill="#5c3a2e"/>'
            f'<path d="M{x},{y+49} L{x},{y+59}" stroke="#3e261d" stroke-width="1.4"/></g>')

def goat_svg(cls='tgoat'):
    return f'''<svg class="{cls}" viewBox="0 0 250 210" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<ellipse class="shadow" cx="120" cy="196" rx="70" ry="7" fill="rgba(62,15,34,.18)"/>
<g class="bodyall">
 {leg('bl far', 78, 128, True)}{leg('fl far', 150, 130, True)}
 <g class="tail" style="transform-origin:58px 96px"><path d="M60,98 C46,86 40,76 46,70 C52,66 58,74 60,82 C62,74 70,72 70,80 C70,88 66,94 60,98 Z" fill="#fff8ee" stroke="#c9a98a" stroke-width="1.6"/></g>
 <path class="body" d="M60,104 C56,82 78,70 108,70 C138,70 160,76 168,92 C176,108 168,132 146,138 C122,144 92,144 76,138 C62,132 61,118 60,104 Z" fill="#fff8ee" stroke="#c9a98a" stroke-width="1.8"/>
 <path d="M78,90 q8,-6 16,0 M98,84 q8,-6 16,0 M118,86 q8,-6 16,0 M86,108 q8,-6 16,0 M110,104 q8,-6 16,0" fill="none" stroke="#ecd9c2" stroke-width="1.6" stroke-linecap="round"/>
 {leg('bl near', 90, 130)}{leg('fl near', 158, 128)}
 <g class="neckhead">
  <path d="M146,96 C150,74 160,62 172,58 L190,74 C182,86 172,100 160,110 Z" fill="#fff8ee" stroke="#c9a98a" stroke-width="1.6"/>
  <g class="scarf"><path d="M146,92 C158,100 176,94 186,80 L192,88 C182,104 160,112 144,104 Z" fill="#8c1d40" stroke="#5a1029" stroke-width="1.2"/>
   <path d="M146,92 C158,100 176,94 186,80" fill="none" stroke="#d4a23a" stroke-width="1.4"/>
   <g class="scarftail" style="transform-origin:150px 100px"><path d="M150,98 C138,104 124,104 112,98 C118,108 130,116 146,112 Z" fill="#a3264f" stroke="#5a1029" stroke-width="1.2"/><path d="M114,99 C126,104 138,104 149,99" fill="none" stroke="#d4a23a" stroke-width="1.1"/></g>
   <circle cx="170" cy="100" r="4" fill="#d4a23a"/></g>
  <g class="head" style="transform-origin:176px 74px">
   <g class="horns" fill="none" stroke-linecap="round">
    <path d="M170,40 C160,18 136,14 126,28 C120,38 126,48 134,46" stroke="#6b4128" stroke-width="10"/>
    <path d="M170,40 C160,18 136,14 126,28 C120,38 126,48 134,46" stroke="#8a5a3c" stroke-width="7.5"/>
    <path d="M170,40 C160,18 136,14 126,28 C120,38 126,48 134,46" stroke="#5c3a2e" stroke-width="7.5" stroke-dasharray="1.6 4.2"/>
    <path d="M182,36 C176,14 152,8 140,20 C134,28 138,38 146,37" stroke="#7a4e33" stroke-width="10"/>
    <path d="M182,36 C176,14 152,8 140,20 C134,28 138,38 146,37" stroke="#a06a45" stroke-width="7.5"/>
    <path d="M182,36 C176,14 152,8 140,20 C134,28 138,38 146,37" stroke="#6b4128" stroke-width="7.5" stroke-dasharray="1.6 4.2"/></g>
   <g class="ear" style="transform-origin:168px 52px"><path d="M168,48 C150,44 132,52 126,64 C142,70 160,64 170,56 Z" fill="#fff8ee" stroke="#c9a98a" stroke-width="1.5"/><path d="M164,52 C152,50 140,56 136,62 C148,66 158,62 166,57 Z" fill="#f4b6b9"/>
    <circle cx="131" cy="67" r="3.4" fill="none" stroke="#d4a23a" stroke-width="2"/></g>
   <path d="M164,52 C164,38 178,30 192,34 C206,38 214,50 214,62 C214,70 208,76 200,78 L178,80 C168,76 164,64 164,52 Z" fill="#fff8ee" stroke="#c9a98a" stroke-width="1.8"/>
   <path d="M196,56 C206,54 220,58 222,66 C224,74 214,80 202,78 Z" fill="#fff3e6" stroke="#c9a98a" stroke-width="1.5"/>
   <ellipse cx="218" cy="63" rx="4" ry="3" fill="#e79aa3"/>
   <path class="mouth shut" d="M206,74 q6,4 12,-1" fill="none" stroke="#7a4a3a" stroke-width="1.8" stroke-linecap="round"/>
   <path class="mouth open" d="M205,72 q7,10 14,0 q-7,3 -14,0 Z" fill="#8c1d40" stroke="#7a4a3a" stroke-width="1.4"/>
   <path class="eye" d="M186,50 q6,6 12,0" fill="none" stroke="#3e261d" stroke-width="2.4" stroke-linecap="round"/>
   <path d="M186,50 l-3,-2 M189,53 l-2,-3" stroke="#3e261d" stroke-width="1.4" stroke-linecap="round"/>
   <ellipse cx="194" cy="62" rx="6" ry="3.5" fill="#f6b3b8" opacity=".6"/>
   <path d="M196,80 C196,90 202,96 206,92 C204,88 206,84 204,80 Z" fill="#fff8ee" stroke="#c9a98a" stroke-width="1.3"/>
  </g>
 </g>
</g>
</svg>'''

GOAT_CSS = '''
/* ===== the animated goat (vector, articulated) ===== */
.stage{position:absolute;left:-10%;right:-10%;bottom:-6px;height:190px;z-index:4;pointer-events:none}
.gw{position:absolute;bottom:0;left:0;width:200px;transform:translateX(-260px);will-change:transform}
.gw .say{position:absolute;left:55%;bottom:100%;margin:0 0 -6px;width:max-content;max-width:240px;white-space:normal;padding:10px 14px;border-radius:18px 18px 18px 4px;background:#fff;color:var(--plum,#3e0f22);font-weight:700;font-size:14px;line-height:1.3;
  box-shadow:0 12px 26px -12px rgba(62,15,34,.45),inset 0 0 0 1.5px #f0d9df;transform-origin:0 100%;opacity:0;transform:scale(.4) translateY(10px);transition:opacity .25s,transform .35s cubic-bezier(.2,.9,.3,1.3)}
.gw.talking .say{opacity:1;transform:none}
.tgoat{display:block;width:100%;height:auto;overflow:visible}
.tgoat .leg,.tgoat .head,.tgoat .ear,.tgoat .tail,.tgoat .scarftail,.tgoat .bodyall{transform-box:view-box}
.tgoat .mouth.open{opacity:0}
/* idle: breathing, head and ear and tail alive */
.tgoat .bodyall{animation:gbreath 3s ease-in-out infinite;transform-origin:120px 190px}
.tgoat .head{animation:ghead 3.4s ease-in-out infinite}
.tgoat .ear{animation:gear 4.2s ease-in-out infinite}
.tgoat .tail{animation:gtail .9s ease-in-out infinite}
.tgoat .scarftail{animation:gscarf 1.6s ease-in-out infinite}
@keyframes gbreath{50%{transform:scale(1.012,.988)}}
@keyframes ghead{0%,100%{transform:rotate(0)}30%{transform:rotate(-6deg)}60%{transform:rotate(4deg)}}
@keyframes gear{0%,70%,100%{transform:rotate(0)}76%{transform:rotate(-16deg)}82%{transform:rotate(6deg)}88%{transform:rotate(-10deg)}}
@keyframes gtail{50%{transform:rotate(22deg)}}
@keyframes gscarf{50%{transform:rotate(-10deg) skewX(6deg)}}
/* running: alternating legs, bouncing body, flying scarf */
.gw.run .tgoat .bodyall{animation:grunbob .36s ease-in-out infinite}
.gw.run .tgoat .leg.near.fl,.gw.run .tgoat .leg.far.bl{animation:gstepA .36s ease-in-out infinite}
.gw.run .tgoat .leg.far.fl,.gw.run .tgoat .leg.near.bl{animation:gstepB .36s ease-in-out infinite}
.gw.run .tgoat .head{animation:grunhead .36s ease-in-out infinite}
.gw.run .tgoat .scarftail{animation:gscarf .3s ease-in-out infinite}
.gw.run .tgoat .tail{animation:gtail .25s ease-in-out infinite}
.gw.run .tgoat .shadow{animation:gshadow .36s ease-in-out infinite;transform-origin:120px 196px;transform-box:view-box}
@keyframes grunbob{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-9px) rotate(1deg)}}
@keyframes gstepA{0%,100%{transform:rotate(32deg)}50%{transform:rotate(-30deg)}}
@keyframes gstepB{0%,100%{transform:rotate(-30deg)}50%{transform:rotate(32deg)}}
@keyframes grunhead{50%{transform:rotate(-5deg)}}
@keyframes gshadow{50%{transform:scaleX(.85)}}
/* talking: mouth opens and closes, head nods */
.gw.talking .tgoat .mouth.open{animation:gtalk .32s steps(1) infinite}
.gw.talking .tgoat .mouth.shut{animation:gtalk2 .32s steps(1) infinite}
.gw.talking .tgoat .head{animation:gnod .64s ease-in-out infinite}
@keyframes gtalk{0%{opacity:1}50%{opacity:0}}
@keyframes gtalk2{0%{opacity:0}50%{opacity:1}}
@keyframes gnod{50%{transform:rotate(-7deg)}}
/* jumping: crouch, take off with legs tucked, land */
.gw.jump .tgoat .bodyall{animation:gjump .9s cubic-bezier(.3,.7,.4,1) 1}
.gw.jump .tgoat .leg.fl{animation:gtuckF .9s ease-in-out 1}
.gw.jump .tgoat .leg.bl{animation:gtuckB .9s ease-in-out 1}
.gw.jump .tgoat .shadow{animation:gjs .9s ease-in-out 1;transform-origin:120px 196px;transform-box:view-box}
@keyframes gjump{0%{transform:translateY(0)}15%{transform:translateY(6px) scale(1.04,.94)}50%{transform:translateY(-70px) rotate(-8deg)}80%{transform:translateY(0) rotate(2deg)}88%{transform:translateY(3px) scale(1.03,.96)}100%{transform:none}}
@keyframes gtuckF{20%,70%{transform:rotate(-60deg)}}
@keyframes gtuckB{20%,70%{transform:rotate(55deg)}}
@keyframes gjs{50%{transform:scaleX(.5);opacity:.4}}
@media (prefers-reduced-motion:reduce){.tgoat *,.gw{animation:none!important;transition:none!important}}
@media (max-width:640px){.gw{width:150px}.gw .say{max-width:190px;font-size:13px;left:40%}}
'''

GOAT_JS = '''
/* the goat runs in, talks, jumps, runs off — and comes back */
(function(){ var gw=document.getElementById('gw'), st=gw&&gw.parentNode; if(!gw) return;
 var says=[]; try{ says=JSON.parse(document.getElementById('home-data').textContent).says||[]; }catch(e){}
 var say=gw.querySelector('.say'), i=0, RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 function at(x,ms){ gw.style.transition='transform '+ms+'ms linear'; gw.style.transform='translateX('+x+'px)'; }
 function wait(ms){ return new Promise(function(r){ setTimeout(r,ms); }); }
 function spot(){ var w=st.clientWidth; return Math.max(10, w*.18); }
 if(RM){ gw.style.transform='translateX('+spot()+'px)'; if(say&&says[0]){ say.textContent=says[0]; gw.classList.add('talking'); } return; }
 async function loop(){ for(;;){
   var w=st.clientWidth;
   gw.style.transition='none'; gw.style.transform='translateX(-220px)'; await wait(60);
   gw.classList.add('run'); at(spot(), 2000); await wait(2000); gw.classList.remove('run');
   for(var k=0;k<2;k++){
     if(say&&says.length){ say.textContent=says[i++%says.length]; gw.classList.add('talking'); await wait(2600); gw.classList.remove('talking'); await wait(350); }
     gw.classList.add('jump'); await wait(900); gw.classList.remove('jump'); await wait(500);
   }
   gw.classList.add('run'); at(w+40, 2400); await wait(2400); gw.classList.remove('run'); await wait(1800);
 } }
 gw.style.pointerEvents='auto'; gw.addEventListener('click',function(){ gw.classList.remove('jump'); void gw.offsetWidth; gw.classList.add('jump'); setTimeout(function(){ gw.classList.remove('jump'); },900); });
 setTimeout(loop,800);
})();
'''
