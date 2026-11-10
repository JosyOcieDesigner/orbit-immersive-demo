# Write N flow-interpolated in-between frames from image A to image B (PNG out).
import cv2, numpy as np, sys, os
a_path, b_path, n, out_pattern = sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4]
A, B = cv2.imread(a_path), cv2.imread(b_path)
dis = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
g = lambda x: cv2.cvtColor(x, cv2.COLOR_BGR2GRAY)
f01, f10 = dis.calc(g(A), g(B), None), dis.calc(g(B), g(A), None)
h, w = A.shape[:2]; gx, gy = np.meshgrid(np.arange(w, dtype=np.float32), np.arange(h, dtype=np.float32))
warp = lambda im, f: cv2.remap(im, gx + f[..., 0].astype(np.float32), gy + f[..., 1].astype(np.float32), cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
for j in range(1, n + 1):
    t = j / (n + 1)
    ft0 = -(1 - t) * t * f01 + t * t * f10; ft1 = (1 - t) ** 2 * f01 - t * (1 - t) * f10
    I = np.clip((1 - t) * warp(A, ft0).astype(np.float32) + t * warp(B, ft1).astype(np.float32) + .5, 0, 255).astype(np.uint8)
    cv2.imwrite(out_pattern % j, I)
