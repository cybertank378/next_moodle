# Rencana Proyek (Project Planning)

Rencana pengembangan dipecah menjadi tiga fase (Sprint/Milestone) agar tim dapat fokus pada pengamanan stabilitas sistem terlebih dahulu sebelum merilis fitur baru.

## 🛡️ Fase 1: Stabilitas Core, Performa & Keamanan (Durasi: 2 Minggu)
*Fokus: Memastikan fondasi Next.js kuat untuk menangani traffic skala besar dan aman dari eksploitasi.*

- **Minggu 1:**
  - Audit dan perbaikan arsitektur koneksi database (Implementasi Prisma Connection Pooling).
  - Integrasi `RateLimiter.ts` dan `SsrfValidator.ts` ke semua lapisan *proxy* API secara global.
  - Perbaikan `MoodleErrorMapper` untuk penanganan *session timeout/refresh token*.
- **Minggu 2:**
  - Perancangan infrastruktur *Caching* (Redis/In-memory) di dalam layer `infrastructure/repo` (khususnya pada pemanggilan API Moodle yang statis).
  - *Load testing* untuk memastikan aplikasi stabil.

## 📚 Fase 2: Fitur Esensial LMS (Durasi: 3 Minggu)
*Fokus: Mengisi celah fitur fungsional agar aplikasi setara dengan fungsionalitas dasar LMS.*

- **Minggu 3:**
  - Setup pustaka lokalisasi (i18n) dan memisahkan string bahasa (*translations*) untuk halaman-halaman utama.
  - Pengembangan modul Manajemen File Terpusat (backend *uploading* dan repositori file).
- **Minggu 4:**
  - Pengembangan Modul Penugasan (Assignments) - Layer *Domain* & *Application* (*Use Cases*).
- **Minggu 5:**
  - Integrasi UI Assignments dengan komponen React dan *endpoint* Moodle.
  - QA dan pengujian menyeluruh (E2E) pada alur pengerjaan tugas.

## 🚀 Fase 3: Real-Time & Peningkatan Pengalaman (Durasi: 3 Minggu)
*Fokus: Fitur lanjutan yang membutuhkan infrastruktur stateful dan meningkatkan interaktivitas.*

- **Minggu 6:**
  - Setup infrastruktur WebSocket (Socket.io/Pusher) terintegrasi dengan arsitektur saat ini.
  - Implementasi *push notifications* (*real-time* notifikasi).
- **Minggu 7:**
  - Pengembangan modul Komunikasi (Forum/Messaging) memanfaatkan kapabilitas *real-time*.
  - Integrasi fitur *Exam Monitoring* (memantau status pengerjaan kuis siswa secara *live* dari *dashboard* instruktur).
- **Minggu 8:**
  - Pembuatan sistem pelaporan dan *Analytics Dashboard* (Melacak waktu login, durasi ujian, partisipasi tugas).
  - *Final Review*, UAT (User Acceptance Testing), dan Persiapan *Production Release*.