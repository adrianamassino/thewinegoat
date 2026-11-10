import re,sys
M={'#1cb0f6':'#1f6f6b','#1899d6':'#15524f','#58cc02':'#5e8c31','#58a700':'#44691f','#ff4b4b':'#b5334a','#ea2b2b':'#8c1d40','#ffc800':'#d4a23a','#e5a800':'#a87b1e','#cd7900':'#8a5a1c','#ce82ff':'#8e5ba8','#a560e8':'#6b2d5c','#ff9600':'#d9774b','#afafaf':'#b9a9a0','#4b4b4b':'#3a2a2f'}
p=sys.argv[1]; h=open(p).read(); n=0
for a,b in M.items():
    c=h.count(a)+h.count(a.upper()); n+=c; h=h.replace(a,b).replace(a.upper(),b)
open(p,'w').write(h); print('recolored',n)
