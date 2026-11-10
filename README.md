# Cek Artis — Concert Dive (scroll)

Website berupa satu film penuh layar tanpa teks yang dijalankan dengan scroll: kamera menembus awan dan sorotan laser, turun ke area festival, menukik masuk lewat atap tenda kaca, masuk ke adegan konser, lalu (video ending) menyusuri penonton ke meja mixer di belakang tenda, lalu (video 3) berakhir di operator kamera.

- Scroll menggerakkan film frame demi frame (845 frame, 24 fps: concert dive 1–358 + ending 359–606 + operator kamera 607–845). Gerakannya dihaluskan sehingga di antara scroll terlihat seperti video berjalan.
- Panjang scroll: kecepatan sama per frame, total sekitar 31 kali scroll mouse di desktop (~3070px), sekitar 28 kali swipe di HP. Ubah di fungsi `distance()` di `index.html`.
- Di akhir scroll film berhenti di adegan terakhir (`concert-last.jpg`, frame terakhir video ending).
- Ikon mouse/swipe di bawah sebagai petunjuk scroll, hilang saat mulai scroll.
- Frame dimuat bertahap (kerangka kasar dulu, lalu diisi) supaya scroll langsung bisa dipakai.
- Performa: frame di-decode di latar belakang (`createImageBitmap`) hanya sekitar posisi scroll (±36 frame desktop, ±24 HP) lalu dilepas dari memori; canvas berukuran resolusi asli frame (digambar 1:1, diperbesar oleh GPU); loop gambar hanya jalan saat scroll. File gambar tidak diubah.

Website: https://josyociedesigner.github.io/orbit-immersive-demo/

## File

- `index.html` — seluruh halaman (HTML, CSS, JS)
- `media/frames-720/` — 845 frame WebP 1280×720 untuk desktop (29 MB), sumber untuk `media/packs-720/`
- `media/frames-540/` — 845 frame WebP 960×540 untuk HP / koneksi lambat (20 MB), sumber untuk `media/packs-540/`
- `media/packs-720/`, `media/packs-540/` — frame yang sama digabung ke 27 file paket + `index.json` (byte gambar tidak diubah) supaya deploy GitHub Pages hanya ~45 file dan halaman cukup ~23 request. Buat ulang: `python3 pack.py media/frames-720 media/packs-720 845 32` (dan `frames-540` → `packs-540`)
- `_config.yml` — file portfolio lama dan frame satuan dikecualikan dari deploy (tetap ada di repo)
- `media/concert-first.jpg`, `media/concert-last.jpg` — poster dan frame terakhir

Versi sebelumnya (video autoplay, scene 3D basement office, portfolio lama) ada di riwayat git.

Preview lokal: `python3 -m http.server 4173`.

## Video 3 (operator kamera, frame 607–845)

Warna dan tone di-grading per frame agar cocok dengan footage ending (transfer warna Lab dengan statistik yang dihaluskan antar frame, sehingga tidak berkedip), plus dissolve 12 frame dari meja mixer. Kompresi sama: WebP q62 1280×720 / q58 960×540.
