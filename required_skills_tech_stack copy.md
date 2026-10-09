# Rekomendasi Keahlian & Tech Stack

Untuk menyelesaikan pengembangan dan perbaikan arsitektur sistem Moodle-Next.js ini, tim pengembang memerlukan penguasaan teknologi dan keahlian berikut:

## 💻 Teknologi & Tools Utama
- **Framework Frontend/Backend:** Next.js (App Router/Pages Router), React.
- **Bahasa Pemrograman:** TypeScript (Wajib, mengingat struktur berorientasi *Clean Architecture*).
- **ORM & Database:** Prisma ORM, PostgreSQL/MySQL.
- **LMS Backend:** Moodle REST API (Web Services).

## 🛠️ Keterampilan yang Dibutuhkan (Required Skills)

### 1. Frontend & UI/UX
- **Lokalisasi (i18n):** Pengalaman mengintegrasikan `next-i18next` atau `next-intl` untuk dukungan aplikasi multi-bahasa.
- **State Management:** Mampu menangani *state* kompleks untuk modul komunikasi atau notifikasi secara *real-time*.

### 2. Backend & Integrasi API
- **API Proxy Pattern:** Keahlian membangun *middleware* yang menjembatani Next.js dan Moodle Web Services.
- **Caching Strategy:** Pengalaman dengan arsitektur *caching* seperti **Redis** atau mekanisme *caching* bawaan Next.js (`unstable_cache`, *revalidation*) untuk mengurangi beban HTTP request ke Moodle.
- **Database Optimization:** Pemahaman tentang *connection pooling* (misalnya menggunakan PgBouncer atau Prisma Accelerate) untuk menangani lonjakan beban tinggi (*high concurrency*) saat ujian.
- **WebSockets/Real-time:** Pengalaman dengan **Socket.io**, **Pusher**, atau WebRTC untuk fitur *exam monitoring* dan notifikasi *real-time*.

### 3. Keamanan (Security)
- **Mitigasi SSRF & Rate Limiting:** Pemahaman mendalam tentang celah keamanan *Server-Side Request Forgery* dan cara membatasinya di level API.
- **Authentication Flow:** Keahlian menangani *token lifecycle* (JWT/Moodle Token), termasuk mekanisme *refresh token* jika sesi *expired*.

### 4. Arsitektur
- Pemahaman mendalam mengenai **Clean Architecture** dan **Domain-Driven Design (DDD)** (agar sejalan dengan struktur `application`, `domain`, `infrastructure`, `presentation` yang sudah ada).