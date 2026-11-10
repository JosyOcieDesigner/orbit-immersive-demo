# Cek Artis — Concert Dive (scroll)

Website berupa satu film penuh layar tanpa teks yang dijalankan dengan scroll: kamera menembus awan dan sorotan laser, turun ke area festival, menukik masuk lewat atap tenda kaca, masuk ke adegan konser, lalu (video ending) menyusuri penonton ke meja mixer di belakang tenda, lalu (video 3, FOH trackback) mundur dari meja FOH melewati penonton dan berakhir di operator kamera.

- Scroll menggerakkan film frame demi frame (944 frame: concert dive 1–358, transisi 359–362, ending 363–610, FOH trackback 611–944). Gerakannya dihaluskan sehingga di antara scroll terlihat seperti video berjalan.
- Panjang scroll: kecepatan sama per frame, total sekitar 34 kali scroll mouse di desktop (~3430px), sekitar 31 kali swipe di HP. Ubah di fungsi `distance()` di `index.html`.
- Di akhir scroll film berhenti di adegan terakhir (`concert-last.jpg`, frame terakhir video ending).
- Ikon mouse/swipe di bawah sebagai petunjuk scroll, hilang saat mulai scroll.
- Frame dimuat bertahap (kerangka kasar dulu, lalu diisi) supaya scroll langsung bisa dipakai.
- Performa: frame di-decode di latar belakang (`createImageBitmap`) hanya sekitar posisi scroll (±36 frame desktop, ±24 HP) lalu dilepas dari memori; canvas berukuran resolusi asli frame (digambar 1:1, diperbesar oleh GPU); loop gambar hanya jalan saat scroll. File gambar tidak diubah.

Website: https://josyociedesigner.github.io/orbit-immersive-demo/

## File

- `index.html` — seluruh halaman (HTML, CSS, JS)
- `media/frames-720/` — 944 frame WebP 1280×720 untuk desktop (30 MB), sumber untuk `media/packs-720/`
- `media/frames-540/` — 944 frame WebP 960×540 untuk HP / koneksi lambat (21 MB), sumber untuk `media/packs-540/`
- `media/packs-720/`, `media/packs-540/` — frame yang sama digabung ke 30 file paket + `index.json` (byte gambar tidak diubah) supaya deploy GitHub Pages hanya ~45 file dan halaman cukup ~23 request. Buat ulang: `python3 pack.py media/frames-720 media/packs-720 944 32` (dan `frames-540` → `packs-540`)
- `_config.yml` — file portfolio lama dan frame satuan dikecualikan dari deploy (tetap ada di repo)
- `media/concert-first.jpg`, `media/concert-last.jpg` — poster dan frame terakhir

Versi sebelumnya (video autoplay, scene 3D basement office, portfolio lama) ada di riwayat git.

Preview lokal: `python3 -m http.server 4173`.

## Sambungan tanpa patahan

- **Video 1 → 2 (frame 359–362):** 4 frame transisi hasil interpolasi optical flow antara frame terakhir video 1 dan frame pertama video 2, sehingga pergeseran kecil antar klip tersebar ke 5 langkah.
- **Video 2 → 3:** FOH trackback dimulai dari frame ke-20 file aslinya, posisi yang persis melanjutkan frame terakhir video 2 (skala 0,996). 19 frame awal mengulang gerakan video 2 dan berisi 4 frame ganda, jadi dibuang. Tanpa dissolve.
- **Video 3 (frame 611–944):** kecepatan kamera dibatasi sekitar 2 px per frame (pada lebar 640). Di bagian kamera bergerak cepat (mundur melewati pagar), klip diperlambat secara halus dan frame tambahan disintesis dengan optical flow (241 frame sumber → 334 frame). Bagian lambat tetap kecepatan asli.
- Kompresi semua frame sama: WebP q62 1280×720 / q58 960×540. Frame video 1 dan 2 tidak di-encode ulang.
