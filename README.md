# Cek Artis — Concert Dive (scroll)

Website berupa satu film penuh layar tanpa teks yang dijalankan dengan scroll: kamera menembus awan dan sorotan laser, turun ke area festival, menukik masuk lewat atap tenda kaca, masuk ke adegan konser, lalu (video ending) menyusuri penonton dan berhenti di meja mixer di belakang tenda.

- Scroll menggerakkan film frame demi frame (606 frame, 24 fps: concert dive 1–358 + ending 359–606). Gerakannya dihaluskan sehingga di antara scroll terlihat seperti video berjalan.
- Panjang scroll: kecepatan sama per frame, total sekitar 22 kali scroll mouse di desktop (2200px), sekitar 20 kali swipe di HP. Ubah di fungsi `distance()` di `index.html`.
- Di akhir scroll film berhenti di adegan terakhir (`concert-last.jpg`, frame terakhir video ending).
- Ikon mouse/swipe di bawah sebagai petunjuk scroll, hilang saat mulai scroll.
- Frame dimuat bertahap (kerangka kasar dulu, lalu diisi) supaya scroll langsung bisa dipakai.
- Performa: frame di-decode di latar belakang (`createImageBitmap`) hanya sekitar posisi scroll (±36 frame desktop, ±24 HP) lalu dilepas dari memori; canvas berukuran resolusi asli frame (digambar 1:1, diperbesar oleh GPU); loop gambar hanya jalan saat scroll. File gambar tidak diubah.

Website: https://josyociedesigner.github.io/orbit-immersive-demo/

## File

- `index.html` — seluruh halaman (HTML, CSS, JS)
- `media/frames-720/` — 606 frame WebP 1280×720 untuk desktop (20 MB), sumber untuk `media/packs-720/`
- `media/frames-540/` — 606 frame WebP 960×540 untuk HP / koneksi lambat (14 MB), sumber untuk `media/packs-540/`
- `media/packs-720/`, `media/packs-540/` — frame yang sama digabung ke 19 file paket + `index.json` (byte gambar tidak diubah) supaya deploy GitHub Pages hanya ~45 file dan halaman cukup ~23 request. Buat ulang: `python3 pack.py media/frames-720 media/packs-720 606 32`
- `_config.yml` — file portfolio lama dan frame satuan dikecualikan dari deploy (tetap ada di repo)
- `media/concert-first.jpg`, `media/concert-last.jpg` — poster dan frame terakhir

Versi sebelumnya (video autoplay, scene 3D basement office, portfolio lama) ada di riwayat git.

Preview lokal: `python3 -m http.server 4173`.
