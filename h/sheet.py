import sys,glob
from PIL import Image,ImageDraw
fs=sorted(glob.glob('flshots/*.png'))
a,b=int(sys.argv[1]),int(sys.argv[2]); fs=fs[a:b]
W,H=300,188; cols=4; rows=(len(fs)+cols-1)//cols
s=Image.new('RGB',(cols*W,rows*(H+4)),'white'); d=ImageDraw.Draw(s)
for i,f in enumerate(fs):
    im=Image.open(f).convert('RGB').resize((W,H)); s.paste(im,((i%cols)*W,(i//cols)*(H+4))); d.text(((i%cols)*W+4,(i//cols)*(H+4)+H-12),f.split('/')[-1],fill='yellow')
s.save(sys.argv[3])
