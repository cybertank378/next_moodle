# [Bug/Task]: Identifikasi, Perbaikan, dan Pengujian Terpusat untuk Halaman yang Belum Selesai (Merespons 404)

## 📝 Deskripsi
Terdapat indikasi adanya rute atau tautan internal di dalam aplikasi yang masih menghasilkan respons 404 (Not Found). **Catatan Penting:** Jika rute mengembalikan 404, itu berarti halaman tersebut **belum selesai dikerjakan atau hilang**. 

Tujuan utama dari *issue* ini adalah **membangun komponen/halaman yang hilang tersebut agar berfungsi penuh (merespons HTTP 200 OK)**, BUKAN untuk membuat atau memodifikasi file `not-found.tsx` atau halaman *error* 404.

Penyelesaian *issue* ini wajib menerapkan pendekatan **TDD (Test-Driven Development)** dengan siklus **Red-Green-Refactor** untuk memastikan rute yang dibangun aman dan sesuai standar.

---

## ✅ Kriteria Penerimaan (Acceptance Criteria)
- [ ] Seluruh halaman atau tautan yang merespons 404 telah dipetakan.
- [ ] Halaman yang hilang/belum selesai telah **dibuat dan diimplementasikan** (merender komponen yang benar dengan status 200 OK).
- [ ] Implementasi perbaikan wajib menggunakan siklus **Red-Green-Refactor**.
- [ ] Setiap rute memiliki *unit test* tersendiri yang memvalidasi bahwa halaman berhasil diakses (bukan 404).
- [ ] Pengujian harus mencakup skenario otorisasi rute (mencegah *leak private data* apabila rute tersebut adalah rute terproteksi/RBAC).
- [ ] Tidak ada satu pun error 404 akibat rute belum selesai pada saat aplikasi dijalankan di *environment staging* atau E2E test.

---

## 🛠️ Langkah-Langkah Pengerjaan (Task Breakdown)

### 1. Fase Penelusuran (Discovery)
- [ ] Pindai aplikasi untuk menemukan tautan internal yang merespons 404 (halaman belum dibuat).
- [ ] Buat daftar temuan (*list of missing routes*) di kolom komentar issue ini sebagai acuan pengerjaan.

### 2. Fase Pengujian (Red Phase)
*Untuk setiap rute yang belum selesai, lakukan:*
- [ ] Buat *unit test* yang mencoba mengakses rute tersebut.
- [ ] Buat *unit test* validasi proteksi halaman (memastikan *unauthorized user* ditolak).
- [ ] Jalankan *test* dan pastikan **GAGAL (RED)** karena aplikasi masih merespons 404 (halaman belum ada).

### 3. Fase Implementasi (Green Phase)
*Implementasikan kode untuk membuat halaman yang sebenarnya:*
- [ ] **Buat file rute/halaman yang hilang** di direktori `src/app/` (misal: `src/app/(student)/student/courses/page.tsx`). **Ingat: Jangan membuat `not-found.tsx`.**
- [ ] Terapkan layout dan komponen UI minimal agar halaman dapat di-render dengan sukses (Status 200).
- [ ] Terapkan *authorization* dasar (misal: pengecekan token/role) pada halaman tersebut.
- [ ] Jalankan *test* dan pastikan **BERHASIL (GREEN)**.

### 4. Fase Refaktor (Refactor Phase)
- [ ] Rapikan struktur UI komponen halaman yang baru dibuat.
- [ ] Ekstrak logika *fetching* data ke fungsi yang tepat.
- [ ] Jalankan ulang seluruh *test suite* dan pastikan semua tetap hijau.

---

## 🔗 Referensi & Dokumen Terkait
- [Dokumentasi Routing Framework](./docs/routing-framework.md)
- [Panduan TDD dan Red-Green-Refactor Tim](./docs/tdd-guidelines.md)
- [Daftar Endpoint URL Valid (Sitemap)](./docs/sitemap-endpoints.md)
