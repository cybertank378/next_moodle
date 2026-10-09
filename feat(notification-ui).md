# feat(notification-ui): Redesign Daftar Notifikasi dan Form Pengumuman Aksaventra

## Konteks

Repository: https://github.com/cybertank378/next_moodle/tree/development

Halaman pengelolaan notifikasi dan form pengumuman perlu mengikuti dua mockup baru: hierarki teks lebih jelas, warna biru konsisten, ruang kerja proporsional, serta informasi audiens, kanal, status, dan jadwal mudah dipindai. Issue ini merupakan spesifikasi implementasi UI untuk kedua halaman; bukan audit ulang branch development.

## Referensi desain

1. **Mockup Buat Pengumuman**: sidebar navy, konten dua kolom, editor di kiri, audiens dan pengiriman di kanan; aksi Pratinjau, Simpan Draft, dan Kirim Sekarang pada header.
2. **Mockup Pengelolaan Notifikasi**: sidebar yang sama, empat kartu ringkasan, tab status, filter, tabel pengumuman, dan pagination.

Lampirkan kedua gambar pada GitHub issue ketika issue dipublikasikan. Gambar merupakan referensi visual, bukan gambar yang dirender sebagai halaman. Panel “Tampilan saat belum ada pengumuman” pada mockup daftar adalah demonstrasi keadaan kosong; panel tersebut hanya muncul ketika keadaan datanya sesuai.

Gunakan **Aksaventra** sebagai nama aplikasi pada implementasi kedua halaman. Tulisan EduNusa pada gambar mockup lama harus diganti menjadi Aksaventra. Gunakan aset logo Aksaventra yang disetujui, termasuk varian light/dark jika tersedia. Simpan nama dan logo dalam konfigurasi branding bersama agar konsisten di sidebar, metadata halaman, dan komponen pratinjau.

## Tujuan

- Menyatukan desain daftar dan form pengumuman dalam satu sistem visual.
- Mempertahankan pengelolaan melalui Next.js menggunakan API aplikasi, tanpa perlu membuka Firebase Console.
- Memakai shared UI, hook API yang tersedia, Atomic Design, dan batas arsitektur hexagonal.
- Memastikan UI tetap berguna ketika API mengembalikan data kosong, sedang memuat, atau gagal.

## Ruang lingkup

- Halaman daftar pengumuman/notifikasi admin dan tenant.
- Form pembuatan pengumuman, termasuk pratinjau dan penjadwalan.
- Shell sidebar/topbar yang dipakai kedua halaman.
- Komponen RichTextEditor berbasis Tiptap yang reusable.
- Integrasi filter, pagination, ringkasan, penyimpanan draft, penghitungan penerima, dan pengiriman menggunakan kontrak API yang tersedia.

Pembuatan ulang infrastruktur FCM, worker, outbox, dan sistem autentikasi tidak menjadi lingkup redesign ini. Jika API yang dibutuhkan belum tersedia, buat perubahan backend minimal dengan kontrak eksplisit atau pisahkan ke issue dependensi; jangan mengganti integrasi dengan data contoh.

## Sistem visual bersama

| Elemen | Spesifikasi |
| --- | --- |
| Sidebar desktop | Lebar sekitar 240–248 px, navy `#0F172A` |
| Warna primary | Biru `#2563EB` untuk aksi utama dan menu aktif |
| Latar konten | Slate terang `#F5F7FB` |
| Permukaan | Putih, border tipis slate, shadow halus |
| Kartu | Radius sekitar 16 px, padding 20–24 px |
| Jarak konten | Padding desktop 32 px, mobile 16–20 px, gap 20–24 px |
| Judul halaman | 28–32 px desktop, 24 px mobile, semibold/bold |
| Teks utama | 14–16 px; label form 14 px |
| Helper text | 12–14 px; jangan memakai teks kecil untuk isi utama |
| Input dan tombol utama | Tinggi 44–48 px |
| Status | Label dan ikon; warna bukan satu-satunya pembeda |

Gunakan token/theme bersama; hindari warna dan ukuran yang tersebar sebagai nilai lokal berbeda. Hindari primary ungu pada salah satu halaman. Ikuti pola dark mode proyek jika tersedia dan pastikan kontras tetap terbaca.

### Sidebar dan topbar

- Logo dan nama aplikasi di atas, kemudian konteks peran Admin Platform atau Admin Tenant.
- Menu admin: Dashboard, Manajemen Tenant, Pengelolaan Notifikasi; bagian Sistem & Audit: Log Audit dan Pengaturan sesuai izin.
- Tenant hanya melihat menu yang diizinkan, tanpa akses Manajemen Tenant lintas organisasi.
- Menu aktif Pengelolaan Notifikasi ditandai biru, dengan ikon dan label jelas.
- Profil pengguna ditempatkan di bawah sidebar.
- Topbar menampilkan breadcrumb dan kontrol global yang telah tersedia. Hapus pencarian mata pelajaran/tugas dari konteks pengelolaan admin ini.
- Mobile menggunakan drawer yang dapat ditutup, dengan focus management yang benar.

## Halaman 1 — Pengelolaan Notifikasi

### Header dan ringkasan

- Judul **Pengelolaan Notifikasi**.
- Deskripsi: “Kelola pengumuman, penerima, dan jadwal pengiriman.”
- Tombol primary **Buat Pengumuman** dan tombol refresh dengan accessible label.
- Empat kartu: Total Pengumuman, Terkirim, Terjadwal, Draft.
- Nilai berasal dari API sesuai cakupan akses pengguna; angka mockup hanya contoh.
- Tetapkan semantik total: pengumuman nonarsip dalam cakupan pengguna, sebelum filter tabel. Label/tooltip menjelaskan bila kontrak backend berbeda.
- Gunakan endpoint agregasi untuk total lintas halaman; jangan menghitung ringkasan dari satu halaman hasil pagination.

### Tab dan filter

- Tab Semua, Terkirim, Terjadwal, Draft, Arsip dengan jumlah jika tersedia dari API.
- Pencarian judul, filter kanal, filter tenant untuk admin platform, dan rentang tanggal.
- Konteks tenant diambil dari akses server; tenant tidak dapat memilih tenant lain.
- Perubahan filter mengembalikan halaman ke 1. Pencarian memakai debounce dan membatalkan/mengabaikan respons lama.
- Refresh mempertahankan filter. Sediakan reset ketika filter tidak menghasilkan data.
- Filter tanggal harus memiliki arti yang jelas, misalnya tanggal dibuat; jangan mencampur tanggal dibuat dan jadwal pengiriman.

### Tabel

| Kolom | Isi |
| --- | --- |
| Pengumuman | Judul dan pembuat; judul panjang tetap dapat dibaca melalui detail |
| Audiens | Semua tenant, nama tenant, atau ringkasan jumlah tenant sesuai kontrak |
| Kanal | Chip Inbox dan/atau Push |
| Status | Badge status berdasarkan enum backend |
| Waktu | Jadwal/waktu kirim dengan label yang sesuai; draft “Belum dijadwalkan” |
| Aksi | Menu detail/edit/arsip atau aksi lain yang didukung status dan izin |

- Tinggi baris sekitar 64–72 px, separator halus, header kontras ringan.
- Footer menunjukkan rentang hasil dan total dengan shared Pagination.
- Status gagal/menunggu/proses tetap ditampilkan apabila backend mendukungnya; jangan memetakan semua status tersebut menjadi Terkirim.
- Terkirim pada campaign tidak otomatis berarti diterima/dibaca semua perangkat. Detail pengiriman harus membedakan penerimaan FCM, kegagalan, dan status baca sesuai data backend.
- Aksi berisiko menggunakan modal konfirmasi sesuai pola shared UI.

### Keadaan UI

- Loading: skeleton ringkasan dan tabel; pertahankan shell/filter.
- Belum ada data: ilustrasi kecil, “Belum ada pengumuman”, penjelasan, tombol Buat Pengumuman.
- Filter tanpa hasil: “Tidak ada hasil yang sesuai” dan Reset Filter.
- Error: pesan ringkas dan Coba Lagi; jangan menampilkan error sebagai data kosong atau angka 0.
- Mobile: filter dapat membungkus; gunakan card list atau scroll tabel terkontrol tanpa membuat seluruh halaman overflow.

## Halaman 2 — Buat Pengumuman

### Header dan layout

- Breadcrumb, tombol kembali, judul **Buat Pengumuman**, deskripsi singkat, dan badge Draft sesuai keadaan sebenarnya.
- Aksi: **Pratinjau**, **Simpan Draft**, serta **Kirim Sekarang** atau **Jadwalkan** sesuai pilihan pengiriman.
- Desktop: dua kolom sekitar 65% / 35%, gap 24 px. Kolom kiri fleksibel dengan `min-width: 0`; panel kanan sekitar 340–400 px.
- Di bawah lebar sekitar 1024 px gunakan satu kolom: konten, audiens, kanal, jadwal, kemudian aksi.
- Header/tombol tidak boleh menutupi field ketika scroll atau mobile.

### Kolom kiri — Konten

- Field judul dengan label, validasi, dan batas karakter dari kontrak DTO/validator.
- RichTextEditor Tiptap dengan toolbar yang jelas dan area tulis sekitar 320–400 px desktop.
- Toolbar sesuai fitur yang didukung: heading, bold, italic, underline jika extension tersedia, bullet/numbered list, link, undo/redo.
- Field ringkasan push dengan batas kontrak API, penghitung karakter, dan helper text.
- Preview push ringkas menampilkan judul dan ringkasan aktual; tampilkan informasi jika ringkasan diturunkan otomatis dari plain text.
- Tidak menambahkan upload gambar/tabel jika persistence, sanitization, dan API belum mendukungnya.

### Kolom kanan — Audiens dan pengiriman

- Panel Audiens: scope yang diizinkan, pemilih tenant untuk admin platform, serta pilihan peran/penerima sesuai API.
- Tenant memiliki konteks tenant terkunci; pembatasan juga wajib diterapkan server.
- Tombol **Hitung Penerima** menampilkan hasil API; sebelum dihitung tampilkan “Belum dihitung”. Jika audiens berubah, tandai hasil lama tidak berlaku.
- Panel Kanal: pilihan Inbox dan Push dengan deskripsi singkat; wajib minimal satu kanal sesuai aturan backend.
- Panel Jadwal: Kirim sekarang atau Jadwalkan; tanggal, waktu, dan zona waktu ditampilkan eksplisit sesuai konfigurasi aplikasi.
- Panel ringkasan sebelum kirim: audiens, kanal, dan jadwal; validasi yang belum terpenuhi dijelaskan dekat field terkait.
- Penghitungan penerima adalah estimasi pada waktu dihitung, bukan jaminan jumlah perangkat yang akan menerima push.

### Pratinjau dan submit

- Pratinjau membuka modal/drawer atau view sesuai pola proyek, memakai data form terbaru.
- Preview inbox menampilkan rich text yang disanitasi; preview push menampilkan plain text.
- Simpan Draft mengikuti validasi draft backend; Kirim/Jadwalkan mengikuti validasi lengkap.
- Selama submit tampilkan loading dan cegah submit berulang. Gunakan mekanisme idempotensi backend yang tersedia untuk aksi kirim.
- Setelah sukses tampilkan toast dan navigasi/refresh sesuai hasil API. Jangan menampilkan sukses sebelum server menerima operasi.
- Error API mempertahankan input pengguna dan ditampilkan melalui toast serta inline error bila sesuai.
- Beri konfirmasi saat meninggalkan form dengan perubahan yang belum disimpan.

## RichTextEditor reusable

- Gunakan/rapikan komponen yang tersedia di `src/shared-ui/component/RichTextEditor`; hindari membuat editor khusus yang hanya dapat dipakai notifikasi.
- API komponen mendukung nilai JSON, callback perubahan, label, placeholder, error, disabled/readOnly, batas/minHeight, dan konfigurasi toolbar.
- JSON Tiptap menjadi sumber konten kanonis sesuai kontrak modul. HTML dan plain text diturunkan konsisten melalui mapper/service yang sesuai.
- Sanitasi HTML pada batas server dan render aman di preview/detail; jangan langsung merender input HTML tanpa sanitasi.
- Komponen editor tidak melakukan fetch, mengakses repository, atau menyimpan data notifikasi sendiri.
- Editor mendukung inisialisasi nilai, reset/switch record, focus, dan tidak membuat render loop saat sinkronisasi nilai eksternal.
- Link tervalidasi; protokol berbahaya ditolak. Seluruh tombol toolbar memiliki label aksesibel dan state aktif.

## Struktur implementasi Atomic Design

Selaraskan nama dengan berkas aktual di branch development saat implementasi. Berikut struktur target/pemetaan; refactor komponen yang ada terlebih dahulu.

```text
src/sections/notification-management/
├── atoms/
│   ├── NotificationCampaignStatusBadge.tsx
│   └── NotificationChannelBadge.tsx
├── molecules/
│   ├── NotificationManagementHeader.tsx
│   ├── NotificationSummaryCards.tsx
│   ├── NotificationCampaignFilters.tsx
│   ├── NotificationCampaignTable.tsx
│   ├── NotificationContentForm.tsx
│   ├── NotificationAudiencePanel.tsx
│   ├── NotificationChannelPanel.tsx
│   ├── NotificationSchedulePanel.tsx
│   ├── NotificationPreviewPanel.tsx
│   └── NotificationActionModal.tsx
└── organisms/
    ├── NotificationManagementView.tsx
    └── NotificationCampaignFormView.tsx

src/shared-ui/component/RichTextEditor/
```

- Organisms menyusun molecules; molecules menyusun atoms dan shared UI. Atoms tetap komponen presentasi kecil.
- Reuse Button, field, Chip/Badge, Modal, Pagination, Toast, skeleton, dan ikon yang telah tersedia; hindari duplikasi komponen dan native button jika shared Button memenuhi kebutuhan.
- Gunakan key stabil dari ID domain; jangan memakai random key atau index untuk record yang berubah.
- Loading/error/request orchestration berada pada organism atau presentation hook sesuai pola proyek. Molecules menerima props bertipe dan callback.
- Shell sidebar/topbar dikelola di layout bersama, bukan diduplikasi di setiap organism.

## Integrasi dan batas hexagonal

```text
UI → presentation/hooks → HTTP API/controller
   → application/usecases/services → domain ports
   → infrastructure repository/provider
```

- Reuse `useNotificationManagementApi` dan DTO modul yang tersedia; jangan fetch Firebase langsung dari komponen.
- Domain/application tidak mengimpor React, Next.js, Prisma, atau Firebase SDK.
- Query filter/pagination mengikuti DTO dan query builder backend; opsi UI tidak boleh mengirim enum yang tidak didukung.
- Statistik dan recipient count dibatasi oleh access context server, bukan parameter tenant dari browser saja.
- Gunakan pola authenticated request dan error handling proyek; jangan memperkenalkan kontrak respons terpisah tanpa kebutuhan.
- Jangan menyertakan secret/service-account Firebase dalam client bundle.

## Urutan pengerjaan

- [ ] Periksa berkas, shared UI, token, hook, DTO, status, dan izin aktual di development.
- [ ] Terapkan token visual dan shell bersama untuk kedua halaman.
- [ ] Refactor daftar: ringkasan, tab/filter, tabel, pagination, dan semua keadaan data.
- [ ] Refactor form menjadi dua kolom dan integrasikan editor reusable.
- [ ] Integrasikan audiens, recipient count, kanal, jadwal, preview, draft, dan submit.
- [ ] Lengkapi kontrak API minimal jika ada gap; dokumentasikan dependensi yang terpisah.
- [ ] Verifikasi desktop, tablet, mobile, keyboard, serta admin/tenant.

## Kriteria penerimaan

- [ ] Nama aplikasi dan logo menggunakan Aksaventra secara konsisten; tidak ada branding EduNusa yang tersisa pada kedua halaman.
- [ ] Kedua halaman konsisten dengan mockup: sidebar navy, primary biru, kartu putih, ukuran teks dan jarak mengikuti spesifikasi.
- [ ] Daftar menunjukkan data API aktual, filter server, pagination, status, dan aksi sesuai izin.
- [ ] Angka contoh mockup, nama contoh, dan label “Data contoh” tidak masuk ke UI produksi.
- [ ] Empty state hanya tampil pada keadaan yang sesuai; ringkasan 0 hanya berasal dari hasil API valid.
- [ ] Form memakai dua kolom desktop dan satu kolom mobile, tanpa overflow halaman pada 375/768/1440 px.
- [ ] Pratinjau mencerminkan konten terbaru dan aman dari HTML berbahaya.
- [ ] Draft, kirim, dan jadwal memakai API serta validasi yang sesuai; input tetap utuh setelah error.
- [ ] Tenant tidak dapat melihat, menghitung penerima, atau mengirim ke tenant lain, termasuk melalui manipulasi request langsung.
- [ ] RichTextEditor reusable dan memiliki props bertipe, toolbar aksesibel, serta sinkronisasi nilai yang stabil.
- [ ] Organisms/molecules/atoms memakai komponen shared dan key stabil; tidak ada dummy data fallback.
- [ ] Focus keyboard, label input, error, tombol ikon, dan modal dapat digunakan secara aksesibel.
- [ ] Tidak ada error TypeScript, lint, atau build baru; jalankan skrip pemeriksaan yang tersedia di repository.

## Validasi penting

- Uji perubahan filter/pencarian cepat untuk memastikan respons lama tidak menimpa hasil terbaru.
- Uji hasil kosong, filter tanpa hasil, API gagal, dan refresh setelah operasi.
- Uji perubahan audiens setelah recipient count, submit berulang, jadwal lampau, dan zona waktu.
- Uji rich text berbahaya, reset nilai editor, serta preview inbox/push.
- Uji akses admin platform dan tenant pada API, bukan hanya visibilitas menu.
- Lampirkan screenshot implementasi kedua halaman untuk dibandingkan dengan mockup sebelum review selesai.

## Di luar issue

- Perubahan desain halaman login.
- Penggantian keseluruhan modul notifikasi/arsitektur backend.
- Penambahan kanal email/SMS tanpa kontrak dan provider yang tersedia.
- Commit, push, atau publikasi GitHub issue tanpa instruksi pengguna.
