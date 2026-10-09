# [Epic] LMS Architecture & Feature Enhancements

## 📝 Deskripsi
Berdasarkan hasil audit struktur proyek Next.js (Moodle Wrapper/Frontend), ditemukan beberapa area yang memerlukan penambahan fitur inti LMS, peningkatan performa infrastruktur, dan penguatan keamanan. Epic ini mencakup implementasi fungsionalitas yang hilang serta perbaikan *technical debt* untuk mendukung sistem manajemen pembelajaran yang skalabel dan modern.

## 🎯 Tujuan
- Melengkapi fitur standar LMS (Assignments, Komunikasi, i18n).
- Meningkatkan performa aplikasi dengan strategi *caching* dan manajemen *database connection pooling*.
- Mengamankan integrasi API Moodle dari risiko arsitektural (SSRF) dan menangani *error state* dengan lebih mulus.

## 📋 Task Checklist

### 1. Fitur Baru (New Features)
- [ ] **Task 1:** Implementasi Modul Penugasan (Assignments) - UI dan integrasi API Moodle.
- [ ] **Task 2:** Setup dan Integrasi Lokalisasi (i18n) untuk multi-bahasa.
- [ ] **Task 3:** Implementasi Modul Komunikasi (Forum/Messaging).
- [ ] **Task 4:** Setup infrastruktur Real-time (WebSockets) untuk notifikasi dan pemantauan ujian.
- [ ] **Task 5:** Pembuatan Modul Manajemen File Terpusat (Media/Document Repository).

### 2. Peningkatan Performa & Infrastruktur (Improvements)
- [ ] **Task 6:** Implementasi *Caching Layer* (Redis/Next.js Cache) di `MoodleRestClient`.
- [ ] **Task 7:** Peningkatan Modul *Exam Monitoring* dengan kapabilitas pelacakan *real-time*.
- [ ] **Task 8:** Pembuatan Modul *Analytics & Reporting* untuk *engagement* siswa.

### 3. Keamanan & Stabilitas (Security & Fixes)
- [ ] **Task 9:** Terapkan *SSRF Validation Middleware* dan *Rate Limiter* ke seluruh *proxy route* Moodle.
- [ ] **Task 10:** Konfigurasi *Connection Pooling* untuk Prisma ORM guna mencegah *connection leak*.
- [ ] **Task 11:** Tingkatkan `MoodleErrorMapper` untuk *auto-refresh token* atau penanganan sesi kadaluarsa.

## 🏷️ Labels
`epic`, `enhancement`, `performance`, `security`, `backend`, `frontend`