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
for f in ('pkg/supabase.sql',):
    try: os.remove(f)
    except FileNotFoundError: pass
nt='pkg/netlify.toml'; t_=open(nt).read() if os.path.exists(nt) else ''
t_=re.sub(r'\[build\][^\[]*','[build]\n  publish = "."\n\n',t_,count=1) if '[build]' in t_ else '[build]\n  publish = "."\n\n'+t_
open(nt,'w').write(t_)

# --- GitHub Pages: custom domain, no Jekyll processing, 404 = language router ---
import shutil as _sh, os as _os
_P = _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), 'pkg')
open(_os.path.join(_P, 'CNAME'), 'w').write('thewinegoat.com\n')
open(_os.path.join(_P, '.nojekyll'), 'w').write('')
_t = open(_os.path.join(_P, 'index.html')).read().replace('location.replace((p||D)+"/"', 'location.replace("/"+(p||D)+"/"')
import re as _re
_t = _re.sub(r'href="(it|fr|es|en|img)/', r'href="/\1/', _t)
open(_os.path.join(_P, '404.html'), 'w').write(_t)
print('github pages files ok')
