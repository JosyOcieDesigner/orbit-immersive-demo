# Cek Artis — Concert Dive

Website berupa satu film penuh layar tanpa teks: kamera menembus awan dan sorotan laser, turun ke area festival, menukik masuk lewat atap tenda kaca, lalu berhenti di adegan konser di dalam tenda.

- Diputar otomatis sekali dari awal (tanpa suara, aturan autoplay browser) lalu diam di frame terakhir.
- Ikon speaker untuk menyalakan suara, ikon putar ulang muncul setelah film selesai.
- Adegan terakhir sedikit bergeser mengikuti mouse / kemiringan HP untuk efek kedalaman.
- `prefers-reduced-motion`: langsung menampilkan adegan terakhir.

Website: https://josyociedesigner.github.io/orbit-immersive-demo/

## File

- `index.html` — seluruh halaman (HTML, CSS, JS)
- `media/concert-1080.mp4` — desktop (H.264, faststart, 10 MB)
- `media/concert-720.mp4` — HP / koneksi lambat (4.7 MB)
- `media/concert-first.jpg`, `media/concert-last.jpg` — poster dan cadangan frame terakhir

Versi sebelumnya (scene 3D basement office, laptop ASUS TUF, portfolio lama) ada di riwayat git.

Preview lokal: `python3 -m http.server 4173` (catatan: server ini tidak mendukung seek video; GitHub Pages mendukung).
