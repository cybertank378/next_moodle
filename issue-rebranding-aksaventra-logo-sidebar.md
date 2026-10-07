# [Branding] Ganti EduNusa menjadi Aksaventra dan integrasikan logo light/dark yang mengikuti background sidebar

## Repository

https://github.com/cybertank378/next_moodle

## Masalah

Identitas aplikasi perlu diseragamkan dari EduNusa menjadi Aksaventra. Logo harus terbaca pada sidebar yang sudah ada, termasuk sidebar terang, gelap, collapsed, dan drawer mobile. Background sidebar tidak boleh diubah untuk mengakomodasi logo.

Referensi visual: logo Aksaventra berupa monogram A/buku terbuka dengan centang, serta wordmark Aksaventra. Logo dark yang dihasilkan sebelumnya masih memiliki artefak pada tulisan; referensi tersebut belum boleh dipakai sebagai aset final tanpa perapian.

## Tujuan

- Semua branding platform yang aktif menggunakan ejaan konsisten `Aksaventra`.
- Menyediakan dua logo horizontal: untuk permukaan terang dan untuk permukaan gelap.
- Menyediakan ikon tanpa wordmark untuk favicon dan sidebar collapsed.
- Pemilihan logo mengikuti background aktual sidebar, bukan semata-mata mode light/dark aplikasi.

## 1. Finalisasi aset logo

Gunakan penamaan berdasarkan permukaan tempat logo ditampilkan agar tidak ambigu:

| Aset yang harus disediakan | Penggunaan | Warna utama |
| --- | --- | --- |
| `logo-light.png` | Background terang | Wordmark navy, ikon teal/navy, centang emas |
| `logo-dark.svg` | Background gelap | Wordmark putih, ikon teal/biru muda, centang emas |
| `logo.png` | Sidebar collapsed pada background terang | Monogram tanpa teks, kontras terhadap permukaan terang |
| `logo-light.png` | Sidebar collapsed pada background gelap | Monogram tanpa teks, kontras terhadap permukaan gelap |
| `favicon.ico` | Browser | Ikon tanpa teks, ukuran 16/32/48 px |
| `icon.png`, `apple-icon.png` | App icon dan perangkat mobile | Ekspor sesuai kebutuhan metadata Next.js |

Nama aset di atas adalah deliverable yang harus dibuat, bukan pernyataan bahwa file sudah tersedia di repository. Ikuti direktori aset yang digunakan project setelah audit.

Persyaratan kualitas:

- Bentuk monogram, proporsi, tipografi, dan jarak ikon terhadap wordmark konsisten antarvarian.
- Background logo transparan; tidak ada kotak putih/hitam yang ikut terbawa.
- Tepi bersih; tidak ada bintik, lubang tidak semestinya, fringe warna, atau huruf terpotong.
- Jika menyediakan SVG, hasil harus berupa vektor yang rapi, bukan PNG yang sekadar dibungkus dalam SVG; wordmark dapat diubah menjadi path agar tidak bergantung pada font perangkat.
- Sediakan PNG transparan sebagai fallback jika diperlukan.
- Ikon tetap dikenali pada 16 dan 32 px; sederhanakan detail kecil bila perlu.
- Jangan menggunakan CSS `invert()` atau filter otomatis untuk menggantikan aset tema yang benar.

## 2. Audit dan migrasi seluruh branding

Cari semua variasi nama lama secara case-insensitive, termasuk `EduNusa`, `Edunusa`, `EDUNUSA`, `edunusa`, dan `Edu Nusa`. Periksa teks serta aset bergambar karena pencarian teks tidak mendeteksi nama yang tertanam dalam gambar.

Area audit:

- Login, register, forgot/reset/change password, dan halaman publik.
- Sidebar, drawer mobile, header/topbar, footer, dashboard, loading, empty state, serta halaman error/not found.
- Judul browser, metadata title/template/description, Open Graph, Twitter metadata, manifest, dan nama aplikasi untuk instalasi.
- Alt text, accessible name, tooltip, copyright, serta copy notifikasi yang menyebut nama platform.
- Logo lama, favicon, gambar/ilustrasi yang memuat nama lama, dan seluruh referensi path aset aktif.
- Konstanta branding, default konfigurasi, fixture/test, dokumentasi setup aktif, dan template email bila tersedia.

Gunakan satu sumber konfigurasi nama platform, misalnya `APP_NAME = "Aksaventra"`, mengikuti struktur project. Hindari string branding yang tersebar tanpa kebutuhan.

Scope migrasi adalah branding platform. Pertahankan nama/logo milik tenant atau sekolah, termasuk tenant yang kebetulan bernama serupa. Jangan mengubah domain, credential, URL layanan Moodle, identifier database, atau resource deployment dengan replace global; audit manual jika ada identifier bermerek yang memang perlu dimigrasikan. Referensi riwayat dapat menyebut nama lama hanya jika jelas menjelaskan migrasi.

## 3. Aturan sidebar: logo mengikuti background

**Background sidebar tetap mengikuti desain/token sidebar yang berlaku. Logo menyesuaikan background tersebut.**

| Mode aplikasi | Background sidebar aktual | Logo yang digunakan |
| --- | --- | --- |
| Light | Terang | `logo-light` |
| Light | Gelap | `logo-dark` |
| Dark | Terang | `logo-light` |
| Dark | Gelap | `logo-ondark` |

Aturan implementasi:

- Audit warna/token background yang ada sebelum menentukan varian.
- Tetapkan kontrak permukaan sidebar, misalnya `surfaceTone: "light" | "dark"`, dari token/desain sidebar. Jika sidebar selalu gelap, gunakan `dark` pada kedua mode aplikasi.
- Untuk branding warna tenant yang dinamis, tentukan varian berdasarkan warna permukaan akhir di belakang logo; pertimbangkan alpha terhadap latar induk. Untuk gradient gunakan area tempat logo berada dan validasi visual.
- Gunakan komponen bersama, misalnya `BrandLogo`, dengan varian horizontal/mark dan surface tone; sesuaikan nama/lokasi dengan konvensi project.
- Expanded menampilkan logo horizontal; collapsed menampilkan mark tanpa wordmark; drawer mobile mengikuti background drawer sendiri.
- Jangan menambahkan panel putih, badge gelap, border, atau mengubah warna sidebar hanya agar logo terlihat.
- Pertahankan aspect ratio dan gunakan ukuran/padding yang sesuai ruang sidebar. Logo tidak bertabrakan dengan toggle, menu, atau batas container.
- Pemilihan aset saat render awal harus konsisten agar tidak ada flash logo yang salah atau hydration mismatch.
- Berikan accessible name `Aksaventra` sekali pada link/komponen branding; hindari pembacaan nama dua kali oleh screen reader.

## 4. Favicon dan metadata

- Ganti semua icon browser/app yang aktif dan hapus referensi icon EduNusa yang obsolete.
- Ikuti mekanisme metadata dan file convention Next.js yang digunakan repository; audit potensi konflik antara file icon dan deklarasi metadata.
- Pastikan favicon terlihat pada chrome browser terang dan gelap. Jika memakai SVG dengan dukungan tema, sediakan fallback ICO yang kontras pada keduanya.
- Validasi title halaman, preview share, dan manifest memakai Aksaventra.

## Acceptance criteria

- [ ] Semua branding platform yang tampil kepada pengguna memakai Aksaventra.
- [ ] Audit nama lama dan aset bergambar selesai; pengecualian tenant/identifier/riwayat didokumentasikan.
- [ ] Logo horizontal on-light dan on-dark tersedia sebagai aset final yang bersih, transparan, dan konsisten.
- [ ] Artefak pada referensi logo dark sudah diperbaiki sebelum integrasi.
- [ ] Sidebar terang menggunakan on-light; sidebar gelap menggunakan on-dark, terlepas dari mode aplikasi.
- [ ] Token/warna background sidebar tidak berubah untuk menyesuaikan logo.
- [ ] Sidebar expanded, collapsed, dan drawer mobile menampilkan varian yang tepat tanpa clipping atau overlap.
- [ ] Favicon, app icon, metadata, dan manifest sudah diperbarui.
- [ ] Branding tenant yang dikonfigurasi tetap dihormati.
- [ ] Seluruh referensi aset valid, tanpa 404 atau image load error.
- [ ] Typecheck, lint, dan build sesuai script project lulus.

## Validasi dan bukti untuk review

1. Cari variasi nama lama secara case-insensitive; review setiap hasil tersisa dan catat alasan pengecualiannya.
2. Periksa login dan dashboard pada light/dark; periksa sidebar dengan permukaan terang/gelap yang didukung desain project.
3. Ambil screenshot sidebar expanded, collapsed, dan mobile untuk kedua permukaan. Screenshot harus memperlihatkan background asli, bukan background yang diubah demi logo.
4. Periksa logo pada ukuran tampilan nyata dan favicon 16/32 px; pastikan tidak ada artefak, huruf rusak, atau detail yang hilang.
5. Periksa render awal/refresh/pergantian tema, metadata browser, manifest, serta network asset error.
6. Jika selector surface tone mengandung logika dinamis, verifikasi kasus light app + dark sidebar dan dark app + light sidebar. Tambahkan tes selector hanya bila memang ada logika yang perlu dijaga.

## Hasil yang harus disertakan dalam PR

- Daftar aset final dan komponen/konfigurasi branding yang diubah.
- Ringkasan audit nama lama beserta pengecualian yang sah.
- Screenshot validasi dan hasil typecheck/lint/build.
- Penjelasan singkat bagaimana varian logo dipilih dari background sidebar.

## Judul issue

`[Branding] Migrasi EduNusa ke Aksaventra dan integrasi logo adaptif terhadap background sidebar`

## Saran commit message

`feat(branding): rebrand EduNusa to Aksaventra and adapt logos to sidebar surfaces`
