# Cek Artis — Concert Dive (scroll)

Website berupa satu film penuh layar tanpa teks yang dijalankan dengan scroll: kamera menembus awan dan sorotan laser, turun ke area festival, menukik masuk lewat atap tenda kaca, lalu berhenti di adegan konser.

- Scroll menggerakkan film frame demi frame (358 frame, 24 fps). Gerakannya dihaluskan sehingga di antara scroll terlihat seperti video berjalan.
- Panjang scroll: sekitar 13 kali scroll mouse di desktop (1300px), sekitar 12 kali swipe di HP (5,5× tinggi layar). Ubah di fungsi `distance()` di `index.html`.
- Di akhir scroll film berhenti di adegan terakhir (frame 1080p yang tajam).
- Ikon mouse/swipe di bawah sebagai petunjuk scroll, hilang saat mulai scroll.
- Frame dimuat bertahap (kerangka kasar dulu, lalu diisi) supaya scroll langsung bisa dipakai.

Website: https://josyociedesigner.github.io/orbit-immersive-demo/

## File

- `index.html` — seluruh halaman (HTML, CSS, JS)
- `media/frames-720/` — 358 frame WebP 1280×720 untuk desktop (13 MB)
- `media/frames-540/` — 358 frame WebP 960×540 untuk HP / koneksi lambat (8.5 MB)
- `media/concert-first.jpg`, `media/concert-last.jpg` — poster dan frame terakhir 1080p

Versi sebelumnya (video autoplay, scene 3D basement office, portfolio lama) ada di riwayat git.

Preview lokal: `python3 -m http.server 4173`.
