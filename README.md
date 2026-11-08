# Cek Artis — 3D Basement Office

Website sekarang berupa satu scene 3D penuh layar tanpa teks: ruang kerja basement dengan laptop ASUS TUF Dash F15 di atas meja.

Scroll menggerakkan kamera melalui 3 posisi: ruangan → zoom ke laptop → meja. Titik oranye di kanan bisa diklik untuk loncat. Gerakan mouse memberi efek parallax.

Website: https://josyociedesigner.github.io/orbit-immersive-demo/

- `index.html` — kanvas + jalur scroll
- `office.js` — scene Three.js (r170), titik kamera di `POINTS`, posisi laptop di `LAPTOP`
- `models/basement-office.glb` — dioptimasi dari 32.7 MB ke 5 MB (metal-rough, WebP 2048px, meshopt)
- `models/asus-tuf-dash-f15.glb` — WebP 2048px

Versi sebelumnya (halaman portfolio lengkap dengan teks) ada di riwayat git; file `style.css`, `script.js`, `app.js`, `depth.js` masih disimpan tetapi tidak dipakai lagi.

Preview lokal: `python3 -m http.server 4173`.

## Kredit

- "Basement Home Office #BADeskChallenge" oleh Fatih174 — CC BY 4.0 — https://sketchfab.com/3d-models/basement-home-office-badeskchallenge-324ceb119c754bed973ab7a603750742
- "ASUS TUF DASH F15 LAPTOP" oleh uday — Sketchfab Standard — https://sketchfab.com/3d-models/asus-tuf-dash-f15-laptop-804fb1368c5947e7b0145d9f86303d35
- Three.js — MIT (vendor/THREE-LICENSE.txt)
