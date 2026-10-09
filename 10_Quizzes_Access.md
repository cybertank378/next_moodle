# Issue 10: Quizzes & Access

## 1. Objective
Menarik daftar ujian (`mod_quiz_get_quizzes_by_courses`) dan memvalidasi akses (`mod_quiz_get_quiz_access_information`).

## 2. Requirements & Scope
- [x] Implementasi mematuhi Hexagonal / DDD module boundary.
- [x] Dilarang keras menggunakan barrel export (`index.ts` / `index.tsx`).
- [x] Pemisahan logis: baca katalog kuis terpisah dari sesi ujian aktif.
- [x] Jangan menyimpan duplikat data kuis di DB SaaS, baca dari Moodle.

## 3. TDD Approach (RED -> GREEN -> REFACTOR)
*Tugas wajib diselesaikan melalui pendekatan Test-Driven Development.*

### 🔴 RED (Tulis Test yang Gagal)
- [x] Test UseCase Cek Akses Kuis jika parameter waktu habis, pastikan mengembalikan status tertutup (RED -> GREEN).
- [x] Jalankan `npm run test` dan verifikasi test gagal dengan benar.

### 🟢 GREEN (Buat Test Berhasil)
- [x] Tulis implementasi lengkap untuk memenuhi kebutuhan Contract Interface.
- [x] Validasi test menjadi hijau (Pass).

### 🔵 REFACTOR (Optimasi Code)
- [x] Refactor kode: Hilangkan duplikasi dan perjelas struktur data.
- [x] Pastikan tidak ada dependensi UI/Infrastruktur (seperti React/Next API) yang bocor ke Domain Layer.

## 4. Task Checklist (To-Do)
*Langkah-langkah sistematis untuk meminimalisir bug fatal:*
1. [x] Buat Module `quizzes`.
1. [x] Implementasikan API endpoint akses kuis.
1. [x] Buat UI Portal Ujian siswa (daftar kuis).
- [x] Verifikasi `npm run typecheck` tidak menghasilkan error.
- [x] Verifikasi `npm run lint` bebas error Biome.

## 5. Definition of Done
- [x] Kontrak Domain Interface untuk requirement di atas telah ditulis.
- [x] Tidak ditemukan file `index.ts` / `index.tsx` (No Barrel Export) dalam PR ini.
- [x] Seluruh Unit Test (dan Integration Test bila ada) berstatus PASSED.
- [x] Semua endpoint/route terkait dilindungi oleh RBAC/Tenant Isolation (`requirePermission`).
- [x] Tidak ada token Moodle atau credential rahasia yang terseret/ter-expose ke Client Browser.
