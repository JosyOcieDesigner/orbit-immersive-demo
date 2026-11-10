# Speed-limited time remap: play the clip at native speed, but where the camera moves faster than
# MAXSTEP px/frame (640px units) slow it down smoothly, synthesising in-betweens with optical flow.
# usage: smooth.py SRC_DIR START END OUT_DIR MAXSTEP
import cv2, numpy as np, sys, os
from scipy.ndimage import gaussian_filter1d
src, start, end, out, MAXSTEP = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4], float(sys.argv[5])
os.makedirs(out, exist_ok=True)
dis = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
img = {}
def I(k):
    if k not in img: img[k] = cv2.imread(f'{src}/{k:03d}.png')
    return img[k]
g = lambda a: cv2.cvtColor(a, cv2.COLOR_BGR2GRAY)
def warp(im, f):
    h, w = f.shape[:2]; gx, gy = np.meshgrid(np.arange(w, dtype=np.float32), np.arange(h, dtype=np.float32))
    f = f.astype(np.float32)
    return cv2.remap(im, gx + f[..., 0], gy + f[..., 1], cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
# 1) camera speed per source step
F = {}
mags = []
for k in range(start, end):
    f = dis.calc(g(I(k)), g(I(k + 1)), None); F[(k, 1)] = f
    mags.append(float(np.median(np.linalg.norm(f, axis=2))) / 2)
sm = gaussian_filter1d(np.array(mags), 3, mode='nearest')
# 2) source-time increment per output frame: native (1) unless too fast, then smoothly slower
inc = np.minimum(1.0, MAXSTEP / sm)
inc = gaussian_filter1d(inc, 2, mode='nearest')
def interp(k, t):
    if t < 1e-3: return I(k)
    if t > 1 - 1e-3: return I(k + 1)
    f01 = F[(k, 1)]
    if (k, 0) not in F: F[(k, 0)] = dis.calc(g(I(k + 1)), g(I(k)), None)
    f10 = F[(k, 0)]
    ft0 = -(1 - t) * t * f01 + t * t * f10
    ft1 = (1 - t) * (1 - t) * f01 - t * (1 - t) * f10
    a, b = warp(I(k), ft0).astype(np.float32), warp(I(k + 1), ft1).astype(np.float32)
    return np.clip((1 - t) * a + t * b + .5, 0, 255).astype(np.uint8)
# 3) walk source time
t, n, steps = float(start), 0, []
while t <= end + 1e-6:
    k = min(int(np.floor(t)), end - 1); frac = t - k
    if k == end - 1 and frac > 1 - 1e-6: frame = I(end)
    else: frame = interp(k, frac)
    cv2.imwrite(f'{out}/{n:04d}.png', frame); n += 1; steps.append(t)
    if t >= end: break
    t = min(end, t + inc[min(k, len(inc) - 1)])
print('source', end - start + 1, 'frames -> output', n)
print('slowest playback', round(float(inc.min()), 2), 'x native; output step px max', round(float((sm * inc).max()), 2), 'median', round(float(np.median(sm * inc)), 2))
