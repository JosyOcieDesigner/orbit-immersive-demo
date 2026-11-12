# Cek Artis — Concert Dive (scroll)

## Halaman awal

Saat pertama dibuka tampil halaman pembuka rata tengah di atas adegan awan: kata besar **CEKARTIS** (perak transparan, menembus kedua tepi layar) di belakang judul **Creative Art Innovations**, garis-garis memancar yang berputar pelan, dan dua tombol:

- **Mobile Version** — frame 960×540 (`media/packs-540/`, ±33 MB), lebih ringan untuk HP / koneksi lambat.
- **Browser Version** — frame HD 1280×720 (`media/packs-720/`, ±48 MB).

Setelah **Mobile Version** diklik muncul petunjuk **"Rotate your smartphone"** (animasi HP berputar): hilang otomatis begitu HP dimiringkan (landscape), bisa di-tap untuk lanjut, dan kalau layar sudah landscape tampil ±2 detik lalu lanjut sendiri.

Setelah memilih versi, halaman awal keluar bertahap (±2 detik): tombol turun & memudar, judul meluncur ke atas di balik garis, huruf-huruf CEKARTIS pecah dari tengah ke luar (terbang menyebar, membesar, blur), garis memancar melebar seperti warp, lalu latar memudar. Setelah itu muncul petunjuk **"Scroll to explore"** (desktop, ikon mouse) atau **"Swipe up to explore"** (HP, ikon swipe) yang hilang saat mulai scroll.

Tombol yang cocok dengan perangkat tampil terisi (disarankan) dan versinya sudah mulai dimuat di belakang. Scroll terkunci sampai salah satu tombol diklik; kalau memilih versi lain, unduhan versi sebelumnya dibatalkan. Panjang scroll tetap mengikuti perangkat (mouse / sentuh). Font: Inter (Google Fonts).

## WE CREATE. / WE CONNECT. / WE MAKE IT HAPPEN.

Setelah masuk (versi apa pun), tiga kalimat besar di tengah layar (Inter 800 kapital, putih keperakan dengan glow) muncul kata per kata dari kabut lalu ditembus kamera saat di-scroll (membesar, blur, memudar). Tiap kalimat punya momennya sendiri, dengan jeda tanpa teks di antaranya:

| Kalimat | Adegan | Frame |
|---|---|---|
| WE CREATE. | di dalam awan (muncul otomatis setelah halaman awal) | 0–55 |
| WE CONNECT. | saat awan terbuka ke festival | 65–95 |
| WE MAKE IT HAPPEN. | sebelum masuk atap tenda | 112–148 |

Scroll **berakhir tepat setelah kalimat ketiga ditembus** (frame 148). Dari situ video **diputar otomatis** 24 fps (±9 detik) menembus atap ke panggung sampai ending video 1 di depan LED (frame 358), lalu muncul **pita informasi kosong** (`#info`) selebar layar di tengah (tinggi 50% layar, area atas & bawah kosong, blur ringan) untuk Browser maupun Mobile Version. Scroll ke atas memutar mundur film dan menyembunyikan panel.

Karena website berakhir di video 1, paket `media/packs-*` sekarang hanya berisi frame 1–358 (desktop 12 MB, HP 7,7 MB). Frame video 2–5 (359–1914) tetap ada di `media/frames-*` dan bisa dipakai lagi dengan membuat ulang paket (`pack.py ... 1914 32`) dan mengubah `COUNT` serta `knots()`. Peta scroll → frame ada di `knots()` di `index.html`; ±4 scroll per kalimat, jeda ±2 scroll.

## Film

Setelah memilih versi, website berupa satu film penuh layar yang dijalankan dengan scroll: kamera menembus awan dan sorotan laser, turun ke area festival, menukik masuk lewat atap tenda kaca, masuk ke adegan konser, lalu (video ending) menyusuri penonton ke meja mixer di belakang tenda, lalu (video 3, FOH trackback) mundur dari meja FOH melewati penonton ke operator kamera, lalu (video 4, crew) pan ke crew lain di sebelahnya ke crew wanita yang memakai headset, lalu (video 5, crew FD) mundur dari crew wanita, berbelok ke sisi tenda dan berhenti di meja kontrol dengan dua operator.

- Scroll menggerakkan film frame demi frame (1914 frame: concert dive 1–358, transisi 359–362, ending 363–610, FOH trackback 611–944, crew 945–1281, crew FD 1282–1914). Gerakannya dihaluskan sehingga di antara scroll terlihat seperti video berjalan.
- Panjang scroll: kecepatan sama per frame, total sekitar 80 kali scroll mouse di desktop (~7950px) termasuk bagian kalimat, sekitar 65 kali swipe di HP. Ubah di fungsi `distance()` di `index.html`.
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
