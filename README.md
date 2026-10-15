# ORBIT — Prototipe website 3D

Demo orisinal terinspirasi pola visual video referensi: latar gelap/oranye, objek produk 3D, dan eksplorasi saat scroll. Bukan salinan model atau aset produk di video. Semua teks dan spesifikasi adalah konten demo, bukan klaim produk nyata.

## Mencoba
Jalankan server statis di folder ini, misalnya `python3 -m http.server 4173`, lalu buka http://localhost:4173. Membuka index.html langsung lewat file:// tidak mendukung impor modul dengan baik.

## GitHub Pages gratis
1. Buat repository publik pada akun GitHub.
2. Unggah seluruh isi folder ini, termasuk folder vendor, ke root repository.
3. Settings → Pages → Deploy from a branch → main → / (root) → Save.
4. Buka alamat Pages yang ditampilkan GitHub setelah deployment selesai.

Tidak memakai API berbayar, font eksternal, atau aset pihak ketiga saat berjalan. Three.js disimpan lokal, lisensi MIT ada di vendor/THREE-LICENSE.txt. Repository: https://github.com/JosyOcieDesigner/orbit-immersive-demo

Alamat GitHub Pages: https://JosyOcieDesigner.github.io/orbit-immersive-demo/ (tersedia setelah deployment selesai).

## Interaksi
Scroll mengganti sudut dan posisi objek; drag objek untuk memutar; pilih warna; lihat struktur; reset rotasi; jeda animasi. Preferensi reduced motion dihormati. Perangkat tanpa WebGL mendapat tampilan simbol statis.

Domain sendiri bisa disambungkan sesudah demo disetujui. Pembelian domain terpisah. Toko, pembayaran, dan akun pengguna tidak termasuk prototipe ini.
