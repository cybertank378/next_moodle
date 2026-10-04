# Issue 16: Exam Administration

## 1. Objective
Manajemen perakitan kuis, pengaturan waktu, dan randomisasi soal (`local_exam_create_quiz`, `local_exam_reorder_quiz_questions`).

## 2. Requirements & Scope
- [x] Implementasi mematuhi Hexagonal / DDD module boundary.
- [x] Dilarang keras menggunakan barrel export (`index.ts` / `index.tsx`).
- [x] Konfigurasi exam metadata.
- [x] UI Drag & Drop komposisi soal.

## 3. TDD Approach (RED -> GREEN -> REFACTOR)
*Tugas wajib diselesaikan melalui pendekatan Test-Driven Development.*

### 🔴 RED (Tulis Test yang Gagal)
- [x] Test domain logic ReorderQuestion (RED -> GREEN).
- [x] Jalankan `npm run test` dan verifikasi test gagal dengan benar.

### 🟢 GREEN (Buat Test Berhasil)
- [x] Tulis implementasi lengkap untuk memenuhi kebutuhan Contract Interface.
- [x] Validasi test menjadi hijau (Pass).

### 🔵 REFACTOR (Optimasi Code)
- [x] Refactor kode: Hilangkan duplikasi dan perjelas struktur data.
- [x] Pastikan tidak ada dependensi UI/Infrastruktur (seperti React/Next API) yang bocor ke Domain Layer.

## 4. Task Checklist (To-Do)
*Langkah-langkah sistematis untuk meminimalisir bug fatal:*
1. [x] Module `exam-administration`.
1. [x] API endpoint komposisi soal kuis.
1. [x] UI Exam Configuration.
- [ ] Verifikasi `npm run typecheck` tidak menghasilkan error.
- [ ] Verifikasi `npm run lint` bebas error Biome.

## 5. Definition of Done
- [ ] Kontrak Domain Interface untuk requirement di atas telah ditulis.
- [ ] Tidak ditemukan file `index.ts` / `index.tsx` (No Barrel Export) dalam PR ini.
- [ ] Seluruh Unit Test (dan Integration Test bila ada) berstatus PASSED.
- [ ] Semua endpoint/route terkait dilindungi oleh RBAC/Tenant Isolation (`requirePermission`).
- [ ] Tidak ada token Moodle atau credential rahasia yang terseret/ter-expose ke Client Browser.
