# Cek Artis — Concert Dive (scroll)

Website berupa satu film penuh layar tanpa teks yang dijalankan dengan scroll: kamera menembus awan dan sorotan laser, turun ke area festival, menukik masuk lewat atap tenda kaca, masuk ke adegan konser, lalu (video ending) menyusuri penonton ke meja mixer di belakang tenda, lalu (video 3, FOH trackback) mundur dari meja FOH melewati penonton ke operator kamera, lalu (video 4, crew) pan ke crew lain di sebelahnya ke crew wanita yang memakai headset, lalu (video 5, crew FD) mundur dari crew wanita, berbelok ke sisi tenda dan berhenti di meja kontrol dengan dua operator.

- Scroll menggerakkan film frame demi frame (1914 frame: concert dive 1–358, transisi 359–362, ending 363–610, FOH trackback 611–944, crew 945–1281, crew FD 1282–1914). Gerakannya dihaluskan sehingga di antara scroll terlihat seperti video berjalan.
- Panjang scroll: kecepatan sama per frame, total sekitar 70 kali scroll mouse di desktop (~6950px), sekitar 63 kali swipe di HP. Ubah di fungsi `distance()` di `index.html`.
- Di akhir scroll film berhenti di adegan terakhir (`concert-last.jpg`, frame terakhir video ending).
- Ikon mouse/swipe di bawah sebagai petunjuk scroll, hilang saat mulai scroll.
- Frame dimuat bertahap (kerangka kasar dulu, lalu diisi) supaya scroll langsung bisa dipakai.
- Performa: frame di-decode di latar belakang (`createImageBitmap`) hanya sekitar posisi scroll (±36 frame desktop, ±24 HP) lalu dilepas dari memori; canvas berukuran resolusi asli frame (digambar 1:1, diperbesar oleh GPU); loop gambar hanya jalan saat scroll. File gambar tidak diubah.

Website: https://josyociedesigner.github.io/orbit-immersive-demo/

## File

- `index.html` — seluruh halaman (HTML, CSS, JS)
- `media/frames-720/` — 1914 frame WebP 1280×720 untuk desktop (sumber paket), sumber untuk `media/packs-720/`
- `media/frames-540/` — 1914 frame WebP 960×540 untuk HP / koneksi lambat (sumber paket), sumber untuk `media/packs-540/`
- `media/packs-720/`, `media/packs-540/` — frame yang sama digabung ke 60 file paket (desktop 48 MB, HP 33 MB) + `index.json` (byte gambar tidak diubah) supaya deploy GitHub Pages hanya ~45 file dan halaman cukup ~23 request. Buat ulang: `python3 pack.py media/frames-720 media/packs-720 1914 32` (dan `frames-540` → `packs-540`)
- `_config.yml` — file portfolio lama dan frame satuan dikecualikan dari deploy (tetap ada di repo)
- `media/concert-first.jpg`, `media/concert-last.jpg` — poster dan frame terakhir

Versi sebelumnya (video autoplay, scene 3D basement office, portfolio lama) ada di riwayat git.

Preview lokal: `python3 -m http.server 4173`.

## Sambungan tanpa patahan

- **Video 1 → 2 (frame 359–362):** 4 frame transisi hasil interpolasi optical flow antara frame terakhir video 1 dan frame pertama video 2, sehingga pergeseran kecil antar klip tersebar ke 5 langkah.
- **Video 2 → 3:** FOH trackback dimulai dari frame ke-20 file aslinya, posisi yang persis melanjutkan frame terakhir video 2 (skala 0,996). 19 frame awal mengulang gerakan video 2 dan berisi 4 frame ganda, jadi dibuang. Tanpa dissolve.
- **Video 3 (frame 611–944):** kecepatan kamera dibatasi sekitar 2 px per frame (pada lebar 640). Di bagian kamera bergerak cepat (mundur melewati pagar), klip diperlambat secara halus dan frame tambahan disintesis dengan optical flow (241 frame sumber → 334 frame). Bagian lambat tetap kecepatan asli.
- **Video 3 → 4 (crew, frame 945–1281):** file crew dimulai dari frame ke-34, posisi yang persis melanjutkan operator kamera (gerak 0 px, tanpa sentakan), tanpa dissolve. Pan cepat melewati penonton diperlambat halus (239 → 337 frame). Warna sudah senada, tanpa grading. Berakhir di crew wanita dengan headset.
- **Video 4 → 5 (crew FD, frame 1282–1914):** file crew FD dimulai dari frame ke-40 (pose & posisi kamera sama dengan crew wanita), dengan 2 frame transisi optical flow. Belokan sangat cepat ke sisi tenda (9–14 px/frame) diperlambat halus (241 → 631 frame). Warna asli tidak diubah. Berakhir di meja kontrol dengan dua operator.
- Kompresi semua frame sama: WebP q62 1280×720 / q58 960×540. Frame video 1 dan 2 tidak di-encode ulang.
