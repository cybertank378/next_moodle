# Exam SaaS Dashboard Design Specification

Dokumen ini menjelaskan struktur antarmuka, tata letak (layout), dan komposisi widget/fitur untuk masing-masing peran pengguna (Admin, Tenant, dan Student) dalam aplikasi SaaS Next.js ini.

Semua desain antarmuka harus mematuhi **Atomic UI Rules** (Atoms, Molecules, Organisms, Pages) dan menghindari manipulasi status Moodle secara langsung pada layer antarmuka (UI layer).

---

## 1. Konvensi Visual dan Estetika Umum (Semua Role)

Aplikasi dibangun dengan fokus pada visual yang rapi, modern, dan fungsional.
- **Warna Utama**: Menggunakan skema warna profesional dengan warna utama biru (SaaS default), aksen *warning* (kuning/oranye) untuk aksi destruktif terbatas, dan abu-abu cerah untuk latar belakang.
- **Tipografi**: Menggunakan font modern (seperti Inter atau Roboto) dengan hierarki *headings* yang jelas (`h1` untuk judul halaman, `h2` untuk nama bagian).
- **Komponen Inti**: Wajib memakai pustaka UI bersama di `src/shared-ui/component/` (seperti `LinkButton`, `TextField`, `SelectField`, `Pagination`, dll.).
- **Data Kosong (Empty State)**: Jika tidak ada data yang dapat ditampilkan (misal: belum ada ujian/kuis), komponen `EmptyState` harus selalu dirender tanpa menyembunyikan *Header* halaman maupun *Filter*.
- **Loading State**: Gunakan `Skeleton` (seperti `TableSkeleton`) daripada memblokir layar menggunakan *spinner* secara keseluruhan.

---

## 2. Dashboard Platform Admin (`/admin`)

Peran **ADMIN** bertindak sebagai *Super Administrator* atau *Platform Operator*. Fokus utamanya adalah memonitor kesehatan keseluruhan platform dan mengelola entitas *Tenant*.

### 2.1 Struktur Tata Letak (Layout)
![Admin Dashboard Mockup](file:///C:/Users/DELL/.gemini/antigravity-ide/brain/c70f7782-d23d-4f57-ac6c-a98653b2d077/admin_dashboard_mockup_1791103727212.jpg)

- **Sidebar Kiri**:
  - **Overview/Dashboard**: Ringkasan kesehatan sistem.
  - **Tenants**: Manajemen institusi (CRUD Tenant, Status, Suspend).
  - **Audit Logs**: Log aktivitas tingkat platform (jika ada).
  - **Settings**: Pengaturan platform global.
- **Top Header**: Profile Admin, Tombol Keluar (Logout), Pilihan Bahasa, Notifikasi Platform.

### 2.2 Komposisi Halaman Dashboard Utama
- **Page Header**: "Platform Overview".
- **Statistik (Organism)**:
  - Total Active Tenants.
  - Total Suspended Tenants.
  - System Health (Moodle Connection Status).
- **Tabel Utama (Organism)**:
  - "Recent Tenants Registered" (menampilkan 5 tenant terbaru yang didaftarkan, beserta *Status Badge* `ACTIVE` / `INACTIVE`).
- **Tindakan Cepat (Quick Actions)**:
  - Tombol [ + Register New Tenant ].

---

## 3. Dashboard Tenant Administrator (`/tenant`)

Peran **TENANT** adalah operator di institusi (misalnya staf akademik, guru, admin sekolah). Fokus utama adalah mengelola akademik, bank soal, kuis, penjadwalan ujian, peserta, dan memonitor ujian.

### 3.1 Struktur Tata Letak (Layout)
![Tenant Dashboard Mockup](file:///C:/Users/DELL/.gemini/antigravity-ide/brain/c70f7782-d23d-4f57-ac6c-a98653b2d077/tenant_dashboard_mockup_1791103740476.jpg)

- **Sidebar Kiri**:
  - **Dashboard**: Ringkasan aktivitas institusi.
  - **Users / Cohorts**: Mengatur *Student*, *Group*, dan *Enrolment*.
  - **Question Bank**: Kategori soal, daftar soal (Import/Export/CRUD).
  - **Exam Administration**: Penjadwalan kuis, komposisi kuis, pengaturan ujian.
  - **Proctoring & Monitor**: Pemantauan langsung (Live Exam Monitoring).
  - **Reports & Grades**: Laporan nilai, statistik butir soal.
- **Top Header**: Informasi Tenant Aktif (Context), Profile Admin Tenant, Tombol Sinkronisasi Moodle (opsional).

### 3.2 Komposisi Halaman Dashboard Utama
- **Page Header**: "Tenant Dashboard - {Nama Tenant}".
- **Statistik (Organism)**:
  - Total Active Exams (Sedang berlangsung hari ini).
  - Total Questions in Bank.
  - Total Enrolled Students.
- **Widget Peringatan / Action Required (Organism)**:
  - Peringatan jika ada Ujian yang dijadwalkan namun belum memiliki soal.
  - Laporan singkat mengenai "Suspicious Incidents" dari sesi Proctoring terakhir.
- **Tabel Utama (Organism)**:
  - "Upcoming Exams" (Menampilkan nama kuis, waktu mulai/selesai, tombol navigasi cepat ke *Exam Administration*).

### 3.3 Tampilan Berdasarkan Permissions (Teacher & Proctor)
Sesuai dengan pedoman arsitektur (`AGENTS.md`), **tidak ada** *root dashboard* terpisah untuk `/teacher` atau `/proctor`. Keduanya menggunakan *Dashboard Tenant* (`/tenant`), namun fitur yang muncul akan disesuaikan secara dinamis oleh *RBAC Permissions*:
- **Proctor View**: Jika pengguna masuk dengan peran institusi namun hanya memiliki izin pengawasan (*proctor permission*), sidebar secara otomatis akan menyembunyikan menu "Users" dan "Question Bank", dan hanya menampilkan halaman **Proctoring & Monitor** saja.
- **Teacher View**: Guru dapat mengakses *Question Bank* dan *Reports*, namun mungkin akses *Tenant Settings* atau *User Management* disembunyikan.

---

## 4. Dashboard Student (`/student`)

Peran **STUDENT** adalah peserta didik yang akan mengerjakan ujian. Tampilan harus sangat bersih, minim gangguan, fokus pada penyajian soal, *timer*, dan hasil ujian (jika diizinkan).

### 4.1 Struktur Tata Letak (Layout)
![Student Dashboard Mockup](file:///C:/Users/DELL/.gemini/antigravity-ide/brain/c70f7782-d23d-4f57-ac6c-a98653b2d077/student_dashboard_mockup_1791103754618.jpg)

- **Navigasi Atas (Top Navigation)** (Alih-alih sidebar penuh agar ruang pengerjaan lebih luas):
  - **My Exams**: Daftar ujian.
  - **Results / Gradebook**: Daftar nilai.
- **Top Header**: Profile Student, *Tenant Context*, Tombol *Logout*.

### 4.2 Komposisi Halaman Dashboard Utama (My Exams)
- **Page Header**: "My Exams".
- **Filter Bar (Molecule)**: Tabulasi ujian ("Active", "Upcoming", "Past").
- **Grid / List Ujian (Organism)**:
  - Menampilkan kartu (card) kuis yang bisa diikuti.
  - Informasi pada Kartu: Nama Ujian, Waktu Mulai/Selesai, Durasi, Batas Percobaan (Attempts allowed).
  - **Call to Action (CTA)**: Tombol `[ Start Attempt ]` (jika sudah masuk waktu) atau `[ View Results ]` (jika sudah selesai).

### 4.3 Layar Pengerjaan Ujian (Live Attempt) - Mode Terfokus
- **Tanpa Navigasi / Header Minimalis**: 
  - Mencegah peserta pindah halaman secara tidak sengaja.
- **Panel Sisi Kanan (Quiz Navigation)**: 
  - *Timer* berjalan mundur dengan peringatan warna saat waktu menipis (kuning < 10 menit, merah < 3 menit).
  - *Grid* navigasi nomor soal (Warna hijau: sudah dijawab, putih: belum dijawab, bendera: *flagged*).
  - Tombol `[ Finish Attempt ]`.
- **Area Konten Soal (Tengah)**: 
  - Teks soal (mendukung multimedia jika ada dari Moodle).
  - Pilihan ganda (Radio buttons) atau tipe *input* lain yang didukung Moodle.
  - Tombol navigasi `[ Next ]` dan `[ Previous ]`.

---

## 5. Standar Responsivitas dan Perangkat (Responsiveness)
- **Desktop First untuk Manajemen**: Layar Admin dan Tenant diutamakan nyaman di Desktop (1024px ke atas) karena melibatkan tabel manajemen data dan form yang kompleks (seperti Editor Bank Soal).
- **Mobile Friendly untuk Student**: Dashboard Student dan layar pengerjaan ujian harus berfungsi optimal pada perangkat layar sentuh dan ponsel (*Mobile View*), memastikan *Radio button* berukuran memadai untuk ditekan dan struktur teks soal tidak terpotong. 

---
*Dokumen ini bersifat acuan (guideline). Struktur akhir setiap menu diimplementasikan pada masing-masing layer `src/app/(role)/layout.tsx` dan `src/sections/(feature)/pages/`.*
