"""Photo cut-outs for the editorial "cut-out" layout (run once; outputs are committed in tools/social/assets/cutouts).
Source: img/photos/red-and-white-grape-bunches-hanging.webp (studio photo on white, Franz van Duns, CC BY-SA 4.0,
via Wikimedia Commons; the cut-outs are adaptations under the same licence and are credited in the captions).
Needs: pip install rembg (downloads the isnet-general-use model). Run: python3 -I tools/social/lib/cutouts.py
Background removal with rembg, then each bunch is isolated by colour (green-gold vs purple) and its largest
connected region; the hanging strings above the stems are removed."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from rembg import remove, new_session
from PIL import Image, ImageFilter
import numpy as np
from scipy import ndimage
s=new_session('isnet-general-use')
im=Image.open(os.path.join(ROOT, 'img/photos/red-and-white-grape-bunches-hanging.webp')).convert('RGB')
o=np.array(remove(im,session=s,alpha_matting=True)).astype(float)
rgb=o[...,:3]; a=o[...,3]
R,G,B=rgb[...,0],rgb[...,1],rgb[...,2]
white=(G>0.82*R)&(B<0.9*G)&(R+G>200)&((np.maximum(R,G)-B)>40)
purple=~white
X=np.arange(1200)[None,:].repeat(1200,0)
def iso(mask, ystr, box):
    m=(a>20)&mask
    m=ndimage.binary_opening(m,iterations=2)
    lab,n=ndimage.label(m)
    sizes=ndimage.sum(m,lab,range(1,n+1))
    keep=lab==(np.argmax(sizes)+1)
    keep=ndimage.binary_closing(keep,iterations=8)
    keep=ndimage.binary_fill_holes(keep)
    keep[:ystr,:]=False
    keep=keep&(a>20)
    alpha=np.where(keep,a,0).astype(np.uint8)
    alpha=np.array(Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(0.7)))
    img=Image.fromarray(np.dstack([rgb,alpha]).astype(np.uint8),'RGBA').crop(box)
    return img.crop(img.getbbox())
w=iso(white&(X>340)&(X<840),150,(330,0,850,1000))
b=iso(purple&(X>700),150,(700,0,1140,1140))
w.save(os.path.join(ROOT, 'tools/social/assets/cutouts/grapes-white.png')); b.save(os.path.join(ROOT, 'tools/social/assets/cutouts/grapes-black.png'))
print(w.size, b.size)
