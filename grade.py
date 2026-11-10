# Match the new clip's colour/tone to the site's ending footage (per-frame Reinhard transfer in Lab,
# with source statistics smoothed over time so the grade never flickers).
import cv2, numpy as np, glob, sys, os
from scipy.ndimage import gaussian_filter1d
ref_dir, src_dir, out_dir = sys.argv[1], sys.argv[2], sys.argv[3]
STRENGTH=float(sys.argv[4]) if len(sys.argv)>4 else 0.92
os.makedirs(out_dir, exist_ok=True)
def lab(img): return cv2.cvtColor(img.astype(np.float32)/255., cv2.COLOR_BGR2Lab)
def stats(L): m=L.reshape(-1,3); return m.mean(0), m.std(0)+1e-6
refs=[lab(cv2.imread(f)) for f in sorted(glob.glob(ref_dir+'/*.webp'))[470:606:4]]
rs=np.array([stats(r) for r in refs]); rmu, rsd = rs[:,0].mean(0), rs[:,1].mean(0)
srcs=sorted(glob.glob(src_dir+'/*.png'))
S=np.array([stats(lab(cv2.imread(f))) for f in srcs])
mu=gaussian_filter1d(S[:,0],6,axis=0,mode='nearest'); sd=gaussian_filter1d(S[:,1],6,axis=0,mode='nearest')
print('ref L/a/b mean',rmu.round(2),'sd',rsd.round(2))
for k,f in enumerate(srcs):
    L=lab(cv2.imread(f))
    t=(L-mu[k])/sd[k]*rsd+rmu
    o=L*(1-STRENGTH)+t*STRENGTH
    o[...,0]=np.clip(o[...,0],0,100)
    rgb=np.clip(cv2.cvtColor(o.astype(np.float32),cv2.COLOR_Lab2BGR),0,1)
    cv2.imwrite(os.path.join(out_dir,os.path.basename(f)),(rgb*255+.5).astype(np.uint8))
print('graded',len(srcs))
