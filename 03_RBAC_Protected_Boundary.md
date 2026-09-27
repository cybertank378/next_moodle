# Issue 03: RBAC & Public/Protected Route Boundary

## 1. Objective
Menerapkan struktur folder `(protected)` dan `(public)` di Next.js App Router serta logika RBAC.

## 2. Requirements & Scope
- [ ] Implementasi mematuhi Hexagonal / DDD module boundary.
- [ ] Dilarang keras menggunakan barrel export (`index.ts` / `index.tsx`).
- [ ] Implementasi Enum `AppRole` (termasuk ADMIN, TENANT, TEACHER, PROCTOR, STUDENT).
- [ ] Implementasi objek `Permission`.
- [ ] Buat `RolePermissionMap` sesuai dokumen planning.
- [ ] Buat fungsi `hasPermission` dan `requirePermission`.

## 3. TDD Approach (RED -> GREEN -> REFACTOR)
*Tugas wajib diselesaikan melalui pendekatan Test-Driven Development.*

### 🔴 RED (Tulis Test yang Gagal)
- [ ] Tulis test `hasPermission(STUDENT, EXAM_MONITOR_READ)` ekspektasi `false` (RED -> GREEN).
- [ ] Tulis test fungsi pembatas Role mengembalikan Unauthorized Error (RED -> GREEN).
- [ ] Jalankan `npm run test` dan verifikasi test gagal dengan benar.

### 🟢 GREEN (Buat Test Berhasil)
- [ ] Tulis implementasi lengkap untuk memenuhi kebutuhan Contract Interface.
- [ ] Validasi test menjadi hijau (Pass).

### 🔵 REFACTOR (Optimasi Code)
- [ ] Refactor kode: Hilangkan duplikasi dan perjelas struktur data.
- [ ] Pastikan tidak ada dependensi UI/Infrastruktur (seperti React/Next API) yang bocor ke Domain Layer.

## 4. Task Checklist (To-Do)
*Langkah-langkah sistematis untuk meminimalisir bug fatal:*
1. [ ] Setup folder `src/core/rbac/`.
1. [ ] Implementasikan pemetaan Role-Permission.
1. [ ] Buat mock middleware/guard untuk layout `(protected)`.
- [ ] Verifikasi `npm run typecheck` tidak menghasilkan error.
- [ ] Verifikasi `npm run lint` bebas error Biome.

## 5. Definition of Done
- [ ] Kontrak Domain Interface untuk requirement di atas telah ditulis.
- [ ] Tidak ditemukan file `index.ts` / `index.tsx` (No Barrel Export) dalam PR ini.
- [ ] Seluruh Unit Test (dan Integration Test bila ada) berstatus PASSED.
- [ ] Semua endpoint/route terkait dilindungi oleh RBAC/Tenant Isolation (`requirePermission`).
- [ ] Tidak ada token Moodle atau credential rahasia yang terseret/ter-expose ke Client Browser.
