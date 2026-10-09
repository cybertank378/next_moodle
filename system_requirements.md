# Spesifikasi Kebutuhan Sistem (System Requirements)

Dokumen ini merangkum kebutuhan fungsional dan non-fungsional berdasarkan hasil audit fitur LMS.

## 1. Functional Requirements (Kebutuhan Fungsional)

### 1.1 Modul Penugasan (Assignments)
- **FR-1:** Pengguna (Guru) harus dapat membuat, mengedit, dan menghapus tugas tipe *file upload* maupun teks terbuka.
- **FR-2:** Pengguna (Siswa) harus dapat mengunggah dokumen jawaban atau mengetik jawaban langsung pada sistem.
- **FR-3:** Sistem harus menyinkronkan data tugas dan nilai tugas ke dalam *database* Moodle.

### 1.2 Multi-bahasa (i18n)
- **FR-4:** Pengguna harus dapat mengubah preferensi bahasa aplikasi (misal: ID dan EN) melalui antarmuka *dashboard*.
- **FR-5:** Semua elemen UI, pesan *error*, dan notifikasi harus menyesuaikan dengan bahasa yang dipilih pengguna.

### 1.3 Komunikasi & Notifikasi
- **FR-6:** Sistem harus menyediakan fitur forum diskusi berbasis *course*.
- **FR-7:** Pengguna harus menerima notifikasi sistem secara *real-time* (menggunakan *WebSocket*) ketika ada pengumuman ujian, nilai keluar, atau pesan baru.

## 2. Non-Functional Requirements (Kebutuhan Non-Fungsional)

### 2.1 Performa & Skalabilitas (Performance)
- **NFR-1:** Panggilan berulang ke *endpoint* Moodle yang sifatnya statis (contoh: daftar kelas, struktur kursus) **harus di-cache**. Response API untuk data cache harus di bawah **200ms**.
- **NFR-2:** Sistem (melalui Prisma) harus mampu menangani minimal **1.000 koneksi database serentak** tanpa mengalami kebocoran koneksi (membutuhkan *Connection Pooling*).

### 2.2 Keamanan (Security)
- **NFR-3:** Setiap permintaan dari Next.js ke Moodle harus melewati modul `SsrfValidator` untuk mencegah *routing* ke IP internal atau server tidak berizin.
- **NFR-4:** Setiap *endpoint* API (terutama terkait percobaan kuis/ujian) harus dilindungi oleh mekanisme *Rate Limiting* (contoh: maksimal 100 *request* per menit per pengguna) untuk mencegah DDoS atau kecurangan (*brute force*).

### 2.3 Resiliensi (Resilience)
- **NFR-5:** Jika Moodle API merespons dengan *Token Expired* atau *Invalid Session*, sistem harus dapat melakukan *auto-refresh token* di belakang layar, atau menampilkan halaman *login* dengan pesan yang ramah pengguna, bukan halaman *error/crash*.