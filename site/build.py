import re, os
# ===== Autonomous build: no external service (no AI, no accounts, no CDN, no Google Fonts) =====
h=open('../h/wset3.html').read()
# Google Fonts -> local font files served from /fonts/
for tag in re.findall(r'<link[^>]*fonts\.(?:googleapis|gstatic)\.com[^>]*>', h): h=h.replace(tag,'')
h=re.sub(r'try\{ const lk=document\.createElement\("link"\); lk\.rel="stylesheet"; lk\.href="https://fonts\.googleapis\.com[^"]*"; document\.head\.appendChild\(lk\); \}catch\(e\)\{\}','',h)
FF=[('Fraunces',600,'normal','fraunces-600'),('Fraunces',800,'normal','fraunces-800'),('Fraunces',600,'italic','fraunces-600i'),
    ('DM Sans',400,'normal','dmsans-400'),('DM Sans',500,'normal','dmsans-500'),('DM Sans',700,'normal','dmsans-700'),('DM Sans',800,'normal','dmsans-800'),
    ('Cormorant Garamond',500,'normal','cormorant-500'),('Cormorant Garamond',600,'normal','cormorant-600'),('Cormorant Garamond',700,'normal','cormorant-700'),
    ('Cormorant Garamond',500,'italic','cormorant-500i'),('Cormorant Garamond',600,'italic','cormorant-600i')]
ff='<style>'+''.join(f'@font-face{{font-family:"{f}";font-weight:{w};font-style:{st};font-display:swap;src:url(../fonts/{n}.woff2) format("woff2")}}' for f,w,st,n in FF)+'</style>'
h=h.replace('</head>',ff+'</head>',1) if '</head>' in h else h.replace('<script>',ff+'<script>',1)
assert 'fonts.googleapis' not in h and 'fonts.gstatic' not in h
h=h.replace('<meta name=viewport','<meta name="description" content="The Wine Goat — revisione WSET Level 3: quiz, domande aperte, degustazione SAT e mappe."><meta name="robots" content="noindex"><meta name=viewport',1)
# ---- accounts (Supabase) only when config.json has the project keys; otherwise everything stays on the device ----
import json as _json
_cfg = {}
if os.path.exists('config.json'):
    try: _cfg = _json.load(open('config.json'))
    except Exception: _cfg = {}
if _cfg.get('supabaseUrl') and _cfg.get('supabaseAnonKey'):
    _inj = ('<script>window.TWG_CONFIG=' + _json.dumps({'supabaseUrl': _cfg['supabaseUrl'], 'supabaseAnonKey': _cfg['supabaseAnonKey'], 'aiEndpoint': False}) + '</script>'
            '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js"></script>'
            '<script>' + open('shim.js').read() + '</script>')
    h = h.replace('<script>', _inj + '<script>', 1)
    print('accounts: ON')
else:
    _inj = '<script>window.twgAccount={enabled:()=>false,signedIn:()=>false,email:()=>"",open:()=>{},ready:Promise.resolve()}</script>'
    h = h.replace('<script>', _inj + '<script>', 1)
    print('accounts: off (no config.json) - progress stays on the device')
# ---- new logo in the app header (served from /img/, same files as the site) ----
h = re.sub(r'(<a class="brand"[^>]*><img class="logo" src=")data:image/[a-z]+;base64,[^"]+("[^>]*?)width="80" height="85"', r'\1../img/logo-emblem.webp\2width="80" height="91"', h, count=1)
h = re.sub(r'(<img class="wmi lt" src=")data:image/[a-z]+;base64,[^"]+("[^>]*?)width="206" height="62"', r'\1../img/wordmark.webp\2width="206" height="80"', h, count=1)
h = re.sub(r'(<img class="wmi dk" src=")data:image/[a-z]+;base64,[^"]+("[^>]*?)width="206" height="62"', r'\1../img/wordmark-light.webp\2width="206" height="80"', h, count=1)
h = h.replace('</head>', '<style>header.top .brand .logo{height:72px!important;width:auto!important;max-height:none!important}header.top .brand .wmi{height:52px;width:auto}@media(max-width:600px){header.top .brand .logo{height:60px!important}header.top .brand .wmi{height:42px}}</style></head>', 1)
os.makedirs('pkg/app',exist_ok=True)
open('pkg/app/index.html','w').write(h); print(len(h))
import shutil, os
src='../tts/audio3' if os.path.isdir('../tts/audio3/en') else '../tts/audio2'
if os.path.isdir(src):
    shutil.rmtree('pkg/app/audio', ignore_errors=True)
    shutil.copytree(src, 'pkg/app/audio', ignore=shutil.ignore_patterns('*.wav'))
    print('audio files', sum(len(f) for _,_,f in os.walk('pkg/app/audio')))
# podcasts (16 kbps, same files as the artifact) and their transcripts
for d in ('pods', 'podtext'):
    s = '../p16/' + d
    if os.path.isdir(s):
        shutil.rmtree('pkg/app/' + d, ignore_errors=True)
        shutil.copytree(s, 'pkg/app/' + d)
        print(d, sum(len(f) for _, _, f in os.walk('pkg/app/' + d)))
# relief rasters for the territory maps
if os.path.isdir('../h/relief'):
    shutil.rmtree('pkg/app/relief', ignore_errors=True)
    shutil.copytree('../h/relief', 'pkg/app/relief')
    print('relief', len(os.listdir('pkg/app/relief')))

# old layout cleanup: app assets used to sit at the root
for d in ('audio','pods','podtext','relief'):
    shutil.rmtree('pkg/'+d, ignore_errors=True)
# multilingual landing pages (/it/, /fr/, /en/ …), router, sitemap, robots, language redirects
import subprocess
subprocess.run(['python3','../landing/build_landing.py',os.path.abspath('pkg')],check=True)

# no server code, no account database: remove leftovers of the old connected build
shutil.rmtree('pkg/netlify', ignore_errors=True)
nt='pkg/netlify.toml'; t_=open(nt).read() if os.path.exists(nt) else ''
t_=re.sub(r'\[build\][^\[]*','[build]\n  publish = "."\n\n',t_,count=1) if '[build]' in t_ else '[build]\n  publish = "."\n\n'+t_
open(nt,'w').write(t_)

# --- GitHub Pages: custom domain, English page at the root, other languages under /it/ /fr/ /es/ ---
import os as _os, re as _re, glob as _glob
_P = _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), 'pkg')
_D = 'https://thewinegoat.com'
open(_os.path.join(_P, 'CNAME'), 'w').write('thewinegoat.com\n')
open(_os.path.join(_P, '.nojekyll'), 'w').write('')
# 1) every page and the sitemap: the English URL is the root
for _f in _glob.glob(_os.path.join(_P, '*', 'index.html')) + [_os.path.join(_P, 'sitemap.xml')]:
    if '/app/' in _f: continue
    _t = open(_f, encoding='utf-8').read().replace(_D + '/en/', _D + '/').replace('href="../en/"', 'href="../"')
    open(_f, 'w', encoding='utf-8').write(_t)
# 2) root = English page (relative paths one level up)
_en = open(_os.path.join(_P, 'en', 'index.html'), encoding='utf-8').read()
_root = _en.replace('"../', '"').replace("'../", "'").replace('(../', '(').replace('href="./"', 'href="/"').replace('<a href="" hreflang', '<a href="/" hreflang')
_banner = """<div id="lsug" hidden style="position:fixed;left:12px;right:12px;bottom:12px;z-index:60;max-width:520px;margin:0 auto;background:#fff;border:1.5px solid #ead9dd;border-radius:16px;padding:12px 14px;box-shadow:0 12px 30px rgba(110,21,50,.18);display:none;gap:10px;align-items:center;font:500 15px/1.35 system-ui,sans-serif;color:#2a1b20"><span id="lsug-t" style="flex:1"></span><a id="lsug-a" style="background:#8c1d40;color:#fff;border-radius:999px;padding:8px 14px;text-decoration:none;font-weight:700;white-space:nowrap"></a><button id="lsug-x" aria-label="Close" style="border:0;background:none;font-size:20px;cursor:pointer;color:#7a6a6e">×</button></div>
<script>(function(){try{if(localStorage.getItem('twg-lsug'))return;}catch(e){}
var M={it:['Questo sito è disponibile in italiano','Italiano'],fr:['Ce site est disponible en français','Français'],es:['Este sitio está disponible en español','Español']};
var ls=navigator.languages||[navigator.language||''],c=null;for(var i=0;i<ls.length;i++){var k=(ls[i]||'').slice(0,2).toLowerCase();if(k==='en')return;if(M[k]){c=k;break;}}
if(!c)return;var b=document.getElementById('lsug');document.getElementById('lsug-t').textContent=M[c][0];var a=document.getElementById('lsug-a');a.textContent=M[c][1]+' →';a.href='/'+c+'/';a.setAttribute('data-lang',c);
document.getElementById('lsug-x').onclick=function(){b.hidden=true;b.style.display="none";try{localStorage.setItem('twg-lsug','1');}catch(e){}};b.hidden=false;b.style.display='flex';})();</script>
"""
_root = _root.replace('</body>', _banner + '</body>', 1)
open(_os.path.join(_P, 'index.html'), 'w', encoding='utf-8').write(_root)
# 3) /en/ only forwards to the root (no duplicate page)
_redir = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>The Wine Goat</title><link rel="canonical" href="' + _D + '/"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0; url=/"><script>location.replace("/"+location.hash)</script></head><body><a href="/">The Wine Goat</a></body></html>'
open(_os.path.join(_P, 'en', 'index.html'), 'w', encoding='utf-8').write(_redir)
# 4) 404 -> home
open(_os.path.join(_P, '404.html'), 'w', encoding='utf-8').write(_redir.replace('noindex', 'noindex').replace('<title>The Wine Goat</title>', '<title>404 – The Wine Goat</title>'))
print('github pages files ok (English at root)')
