# Issue 14: Tenant Users, Enrolments & Groups

## 1. Objective
Pengelolaan user (peserta/guru) di dalam sebuah tenant dan pendaftaran ke course.

## 2. Requirements & Scope
- [x] Implementasi mematuhi Hexagonal / DDD module boundary.
- [x] Dilarang keras menggunakan barrel export (`index.ts` / `index.tsx`).
- [x] Integrasi CRUD Moodle `core_user_*` dan `core_enrol_*`.
- [x] Dukungan custom import API `local_exam_import_students`.

## 3. TDD Approach (RED -> GREEN -> REFACTOR)
*Tugas wajib diselesaikan melalui pendekatan Test-Driven Development.*

### 🔴 RED (Tulis Test yang Gagal)
- [x] Test parsing payload bulk import csv/excel DTO menjadi struktur Moodle array (RED -> GREEN).
- [x] Jalankan `npm run test` dan verifikasi test gagal dengan benar.

### 🟢 GREEN (Buat Test Berhasil)
- [x] Tulis implementasi lengkap untuk memenuhi kebutuhan Contract Interface.
- [x] Validasi test menjadi hijau (Pass).

### 🔵 REFACTOR (Optimasi Code)
- [x] Refactor kode: Hilangkan duplikasi dan perjelas struktur data.
- [x] Pastikan tidak ada dependensi UI/Infrastruktur (seperti React/Next API) yang bocor ke Domain Layer.

## 4. Task Checklist (To-Do)
*Langkah-langkah sistematis untuk meminimalisir bug fatal:*
1. [x] Buat Module users dan enrolments.
1. [x] Buat UI Management Table untuk Enrolments.
1. [x] API upload import file.
- [x] Verifikasi `npm run typecheck` tidak menghasilkan error.
- [x] Verifikasi `npm run lint` bebas error Biome.

## 5. Definition of Done
- [x] Kontrak Domain Interface untuk requirement di atas telah ditulis.
- [x] Tidak ditemukan file `index.ts` / `index.tsx` (No Barrel Export) dalam PR ini.
- [x] Seluruh Unit Test (dan Integration Test bila ada) berstatus PASSED.
- [x] Semua endpoint/route terkait dilindungi oleh RBAC/Tenant Isolation (`requirePermission`).
- [x] Tidak ada token Moodle atau credential rahasia yang terseret/ter-expose ke Client Browser.
