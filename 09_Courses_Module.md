# Issue 09: Courses Module

## 1. Objective
Menarik data course (modul pelajaran) dengan Moodle API `core_course_*`.

## 2. Requirements & Scope
- [ ] Implementasi mematuhi Hexagonal / DDD module boundary.
- [ ] Dilarang keras menggunakan barrel export (`index.ts` / `index.tsx`).
- [ ] Integrasi `core_enrol_get_users_courses` dan `core_course_get_contents`.
- [ ] Module course mengikuti Standard Module Pattern.
- [ ] Menjamin isolasi `tenantId`.

## 3. TDD Approach (RED -> GREEN -> REFACTOR)
*Tugas wajib diselesaikan melalui pendekatan Test-Driven Development.*

### 🔴 RED (Tulis Test yang Gagal)
- [ ] Test Mock Moodle Course Response diubah secara benar ke Entity Course DTO kita (RED -> GREEN).
- [ ] Jalankan `npm run test` dan verifikasi test gagal dengan benar.

### 🟢 GREEN (Buat Test Berhasil)
- [ ] Tulis implementasi lengkap untuk memenuhi kebutuhan Contract Interface.
- [ ] Validasi test menjadi hijau (Pass).

### 🔵 REFACTOR (Optimasi Code)
- [ ] Refactor kode: Hilangkan duplikasi dan perjelas struktur data.
- [ ] Pastikan tidak ada dependensi UI/Infrastruktur (seperti React/Next API) yang bocor ke Domain Layer.

## 4. Task Checklist (To-Do)
*Langkah-langkah sistematis untuk meminimalisir bug fatal:*
1. [ ] Buat Domain Interfaces Course.
1. [ ] Implementasikan MoodleCourseRepository.
1. [ ] Buat UseCase untuk mengambil course user.
1. [ ] UI Atomic: Course Cards.
- [ ] Verifikasi `npm run typecheck` tidak menghasilkan error.
- [ ] Verifikasi `npm run lint` bebas error Biome.

## 5. Definition of Done
- [ ] Kontrak Domain Interface untuk requirement di atas telah ditulis.
- [ ] Tidak ditemukan file `index.ts` / `index.tsx` (No Barrel Export) dalam PR ini.
- [ ] Seluruh Unit Test (dan Integration Test bila ada) berstatus PASSED.
- [ ] Semua endpoint/route terkait dilindungi oleh RBAC/Tenant Isolation (`requirePermission`).
- [ ] Tidak ada token Moodle atau credential rahasia yang terseret/ter-expose ke Client Browser.
