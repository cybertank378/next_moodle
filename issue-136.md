# feat(admin): Modernisasi Dashboard dan Sidebar Admin Platform

## Referensi

- Repository: https://github.com/cybertank378/next_moodle
- Branch acuan: `development`.
- Desain acuan: mockup dashboard terakhir pada percakapan, dengan sidebar navy, label Admin Platform, empat menu, dan profil administrator di bagian bawah.
- Dokumen ini merupakan rencana implementasi; checklist belum menunjukkan pekerjaan yang selesai.

## Masalah dan tujuan

Dashboard sudah memiliki ringkasan status tenant, grafik pertumbuhan, distribusi status, dan tenant terbaru. Penyempurnaan diperlukan agar hierarki informasi lebih jelas, tindakan administratif berfungsi, dan sidebar menegaskan lingkup Admin Platform.

Implementasikan dashboard modern, responsif, dan dinamis menggunakan data API aktual serta komponen bersama proyek. Pertahankan batas akses role dan arsitektur modul yang sudah ada.

## Ruang lingkup

- Dashboard Admin Platform: header, aksi pendaftaran tenant, refresh, pemberitahuan tenant yang memerlukan perhatian, empat kartu statistik, grafik, serta tabel tenant terbaru.
- Sidebar: pengelompokan menu, label role, ikon konsisten, kondisi aktif, mode diperluas/diperkecil, dan drawer mobile.
- Loading, data kosong, error, retry, aksesibilitas, serta dukungan tema sesuai mekanisme proyek.
- Tidak mencakup pembangunan ulang backend, fitur billing, metrik server, atau modul akademik baru.

## Susunan sidebar

| Grup | Menu | Tujuan navigasi |
| --- | --- | --- |
| Menu Utama | Dashboard | `ROUTES.ADMIN.ROOT` |
| Menu Utama | Manajemen Tenant | `ROUTES.ADMIN.TENANTS` |
| Sistem & Audit | Log Audit | `ROUTES.ADMIN.AUDIT` |
| Sistem & Audit | Pengaturan Platform | `ROUTES.ADMIN.SETTINGS` |

- [ ] Gunakan konstanta route dan permission yang sudah tersedia.
- [ ] Tampilkan label `Admin Platform` di bawah identitas aplikasi.
- [ ] Tampilkan profil administrator dari sesi aktual di bagian bawah; jangan hardcode identitas.
- [ ] Gunakan ikon Lucide yang konsisten: dashboard, gedung, shield-check, dan gear.
- [ ] Menu aktif mengikuti pathname; hanya item paling spesifik yang aktif ketika masuk halaman detail.
- [ ] Tambahkan kontrol collapse dengan label aksesibel. Saat diperkecil, tampilkan ikon dan tooltip yang bisa diakses keyboard.
- [ ] Drawer mobile memiliki overlay, tombol tutup, focus trap, Escape, dan pengembalian fokus; tutup setelah navigasi.
- [ ] Perubahan sidebar bersama tidak merusak menu role Tenant, Teacher, atau Student.
- [ ] Daftar/tambah tenant dan status tenant menjadi aksi atau filter dalam Manajemen Tenant, bukan menu tambahan.
- [ ] Pengguna, mata pelajaran, bank soal, ujian, dan hasil tetap berada pada lingkup role Tenant sesuai konfigurasi yang ada.

## Spesifikasi dashboard

### Header dan tindakan

- [ ] Judul `Ikhtisar Platform`, subtitle ringkas, dan identitas halaman Admin.
- [ ] Tombol `Daftarkan Tenant` membuka alur pendaftaran tenant yang sudah tersedia dan mematuhi permission.
- [ ] Tombol refresh memuat ulang data dengan periode yang sedang dipilih; cegah permintaan berulang saat masih memuat.
- [ ] Tampilkan status pemuatan dan feedback error yang bisa ditindaklanjuti.

### Perhatian tenant

- [ ] Hitung jumlah yang memerlukan perhatian dari `summary.maintenance + summary.suspended`.
- [ ] Jika jumlah lebih dari nol, tampilkan pemberitahuan dengan tautan `Tinjau tenant`.
- [ ] Tautan membuka Manajemen Tenant dengan filter status yang didukung. Jika belum mendukung kombinasi status, sediakan pilihan status yang jelas melalui halaman tujuan; jangan membuat query parameter tanpa dukungan.
- [ ] Sembunyikan pemberitahuan ketika jumlah nol. Jangan menampilkan seolah tidak ada masalah ketika data gagal dimuat.

### Kartu statistik

| Label | Sumber | Aksen |
| --- | --- | --- |
| Total Tenant | `summary.total` | Biru/indigo |
| Tenant Aktif | `summary.active` | Emerald |
| Pemeliharaan | `summary.maintenance` | Amber |
| Ditangguhkan | `summary.suspended` | Rose |

- [ ] Gunakan formatter proyek untuk jumlah.
- [ ] Angka nol tetap terlihat pada respons kosong yang berhasil.
- [ ] Gunakan skeleton untuk pemuatan pertama dan tanda tidak tersedia untuk kegagalan tanpa data.
- [ ] Jangan menambahkan persentase kenaikan atau metrik yang tidak disediakan API.

### Grafik pertumbuhan dan distribusi

- [ ] Gunakan `growth` untuk grafik pertumbuhan dan `summary` untuk distribusi status.
- [ ] Periksa arti `TenantGrowthPoint` dan repository sebelum menentukan label grafik: tenant baru per bulan atau jumlah kumulatif harus mengikuti kontrak sebenarnya.
- [ ] Kontrol periode 6/12 bulan memanggil hook menggunakan nilai yang tervalidasi sesuai kontrak server.
- [ ] Pergantian periode menampilkan hasil permintaan terbaru; hasil lama tidak boleh menimpa pilihan baru.
- [ ] Grafik distribusi menampilkan label dan legenda selain warna.
- [ ] Saat semua status nol, tampilkan placeholder grafik dan total nol tanpa segmen palsu.
- [ ] Saat data pertumbuhan kosong, panel tetap ada dengan pesan singkat tanpa membuat titik data fiktif.
- [ ] Gunakan library grafik yang sudah dipakai proyek dan sesuaikan tema melalui mekanisme yang tersedia.

### Tenant terbaru

- [ ] Kolom: Tenant, Slug, Status, Tanggal Daftar, Aksi.
- [ ] Gunakan `recentTenants`, key `tenant.id`, format tanggal konsisten, dan badge status bersama.
- [ ] Pencarian nama/slug dan filter status bekerja pada data yang tersedia. Jika hanya menyaring daftar terbaru di sisi klien, jelaskan cakupannya sebagai daftar terbaru, bukan seluruh tenant.
- [ ] Tautan `Lihat semua` menuju Manajemen Tenant; `Detail` memakai route detail aktual proyek.
- [ ] Filter kosong memiliki pesan dan aksi reset; respons tanpa tenant menyediakan aksi pendaftaran sesuai permission.
- [ ] Jangan mengarang total hasil, pagination, nama sekolah, avatar, atau tanggal.

## Integrasi API dan batas data

Gunakan `useDashboardApi`, state `adminState`, dan `fetchAdminOverview` yang sudah tersedia. Endpoint dashboard admin adalah `GET /api/dashboard/admin`.

Kontrak utama `AdminDashboardResponseDto`:

```ts
interface AdminDashboardResponseDto {
  summary: TenantStatusSummary;
  growth: TenantGrowthPoint[];
  recentTenants: RecentTenantResponseDto[];
}
```

`RecentTenantResponseDto` memuat `id`, `name`, `slug`, `status`, dan `createdAt`.

- [ ] Verifikasi parameter periode pada hook, validator, dan use case sebelum implementasi.
- [ ] Pertahankan batas authorization server untuk dashboard admin; penyembunyian menu bukan pengganti authorization.
- [ ] Tangani 401/403 mengikuti utilitas autentikasi dan pola proyek.
- [ ] Saat refresh gagal setelah data berhasil dimuat, pertahankan data sebelumnya dengan keterangan bahwa pembaruan gagal.
- [ ] Tidak ada polling otomatis atau klaim real-time tanpa kebutuhan dan dukungan yang jelas.
- [ ] Pertahankan API dan DTO yang ada kecuali ditemukan kebutuhan nyata; setiap perubahan kontrak harus didokumentasikan.

## Struktur implementasi

Utamakan perubahan pada file yang sudah ada. File baru hanya dibuat bila membantu pembagian tanggung jawab.

| Lapisan | File/tanggung jawab |
| --- | --- |
| Atoms yang ada | `src/sections/dashboard/atoms/StatAccent.tsx`, `StatValue.tsx` |
| Molecules yang ada | `DashboardHeader.tsx`, `StatCard.tsx`, `TenantGrowthChart.tsx`, `TenantStatusChart.tsx`, `RecentTenantsTable.tsx` pada `src/sections/dashboard/molecules/` |
| Molecules usulan | `AdminTenantAttentionBanner.tsx`, `AdminDashboardToolbar.tsx`, `RecentTenantFilters.tsx` pada folder molecules yang sama, bila diperlukan |
| Organism | `src/sections/dashboard/organisms/AdminDashboardOverview.tsx` |
| Page section | `src/sections/dashboard/pages/AdminDashboardPage.tsx` |
| Sidebar bersama | `src/shared-ui/layout/AppSidebar.tsx`, `sidebar/RecursiveSidebarItem.tsx` |
| Layout/topbar | `src/shared-ui/layout/AppLayout.tsx`, `AppTopbar.tsx`, hanya bila penyesuaian diperlukan |
| Hook dan helper | `src/modules/dashboard/presentation/hooks/useDashboardApi.ts`, `presentation/helpers/dashboardFormatters.ts` |

- [ ] Periksa entry page App Router dan struktur pengujian aktual sebelum mengubahnya; jangan membuat route duplikat.
- [ ] Organisms menyusun molecules dan menangani state/API; molecules menyusun atoms atau shared UI dan menerima props/callbacks.
- [ ] Gunakan shared `Button`, `SearchField`, `SelectField`, badge, skeleton, dan komponen tabel yang sesuai kontrak aktual.
- [ ] Jangan membuat wrapper tanpa manfaat atau menduplikasi komponen bersama.
- [ ] Setiap file TypeScript/TSX yang dibuat atau diubah memiliki komentar `// Files: path/file.tsx` sebelum directive `"use client"` jika ada.
- [ ] Hindari native button dan daftar ul/li/ol pada section; gunakan komponen bersama dan struktur semantik yang sesuai.
- [ ] Bersihkan import yang tidak terpakai dan gunakan key stabil dari identitas data.

## Visual, responsivitas, dan aksesibilitas

- [ ] Sidebar navy, permukaan kartu putih pada light mode, aksen primary biru, border lembut, radius dan spacing konsisten dengan mockup.
- [ ] Gunakan semantic tokens; tema mengikuti mekanisme proyek. Bila dark mode belum tersedia, kerjakan fondasinya secara eksplisit sebelum mengklaim dukungan.
- [ ] Desktop: empat kartu statistik, grafik dengan rasio sekitar 2:1, tabel penuh.
- [ ] Tablet: dua kolom statistik, sidebar sesuai breakpoint proyek; grafik menyesuaikan ruang.
- [ ] Mobile: satu kolom, drawer sidebar, toolbar bertumpuk, dan tabel bergulir dalam panel tanpa overflow halaman.
- [ ] Uji ukuran 375, 414, 768, 1280, dan 1440 px.
- [ ] Target sentuh minimal 44 px; focus-visible jelas; ikon aksi memiliki accessible name.
- [ ] Hormati `prefers-reduced-motion`; animasi hanya membantu transisi dan feedback.
- [ ] Angka pada mockup hanya ilustrasi dan tidak boleh masuk sebagai data produksi.

## Tahapan pengerjaan dan validasi

### Red

- [ ] Baca pedoman TDD dan konfigurasi test proyek; pertahankan struktur test yang sudah digunakan.
- [ ] Buat pengujian perilaku dengan pola Arrange–Act–Assert untuk pemilihan periode, retry, filter tenant, dan jumlah perhatian tenant.
- [ ] Verifikasi batas akses Admin dan regresi menu role lain menggunakan test yang tersedia; perluas hanya bila ada perubahan perilaku.
- [ ] Pastikan pengujian baru gagal karena perilaku belum tersedia, bukan kesalahan setup.

### Green

- [ ] Implementasikan sidebar dan susunan dashboard dengan komponen yang ada.
- [ ] Hubungkan tindakan, periode, filter, dan navigasi ke hook/route aktual.
- [ ] Selesaikan loading, error, data kosong, dan penanganan respons usang.
- [ ] Jalankan test terkait hingga lulus.

### Refactor dan pemeriksaan akhir

- [ ] Rapikan batas komponen dan penamaan mengikuti modul tetangga.
- [ ] Jalankan typecheck, lint, dan build menggunakan scripts yang tercantum pada `package.json`.
- [ ] Periksa visual tiap breakpoint dan tema yang didukung.
- [ ] Uji keyboard, drawer mobile, collapse sidebar, navigasi detail, refresh gagal, dan filter tanpa hasil.
- [ ] Tampilkan perubahan dan hasil validasi untuk ditinjau; jangan langsung commit, push, atau merge.

## Acceptance criteria

1. Sidebar Admin memiliki empat menu sesuai tabel, label role yang jelas, dan kondisi aktif yang benar.
2. Menu dan akses role lain tetap berfungsi.
3. Seluruh angka, grafik, dan tenant berasal dari API aktual; tidak ada data dummy produksi.
4. Pendaftaran tenant, refresh, periode, pencarian, filter, detail, dan tautan lihat semua dapat digunakan.
5. Pergantian periode cepat tidak menampilkan hasil permintaan usang.
6. Loading, error, retry, respons kosong, dan filter kosong memiliki tampilan yang jelas.
7. Tata letak tidak menyebabkan overflow halaman pada breakpoint yang ditentukan.
8. Navigasi keyboard dan drawer mobile berfungsi; status tidak hanya dibedakan dengan warna.
9. Test terkait, typecheck, lint, dan build lulus, atau keterbatasan lingkungan dicatat secara spesifik.
10. Hasil akhir dilengkapi daftar file berubah, bukti visual, dan ringkasan validasi sebelum commit.

## Deliverables

- Implementasi dashboard dan sidebar sesuai mockup.
- Pengujian perilaku yang relevan dengan struktur proyek.
- Screenshot desktop dan mobile serta tema yang didukung.
- Catatan perubahan, hasil validasi, dan batasan yang masih ada.
