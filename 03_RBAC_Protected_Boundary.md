# Issue 03: RBAC & Public/Protected Route Boundary

## 1. Objective
Menerapkan struktur folder `(protected)` dan `(public)` di Next.js App Router serta logika RBAC.

## 2. Requirements & Scope
- [x] Implementasi mematuhi Hexagonal / DDD module boundary.
- [x] Dilarang keras menggunakan barrel export (`index.ts` / `index.tsx`).
- [x] Implementasi Enum `AppRole` (ADMIN, TENANT, STUDENT, serta boundary PROCTOR/TEACHER sesuai AGENTS.md & rbac-system.md).
- [x] Implementasi objek `Permission`.
- [x] Buat `RolePermissionMap` sesuai dokumen planning.
- [x] Buat fungsi `hasPermission` dan `requirePermission`.

## 3. TDD Approach (RED -> GREEN -> REFACTOR)
*Tugas wajib diselesaikan melalui pendekatan Test-Driven Development.*

### 🔴 RED (Tulis Test yang Gagal)
- [x] Tulis test `hasPermission(STUDENT, EXAM_MONITOR_READ)` ekspektasi `false` (RED -> GREEN).
- [x] Tulis test fungsi pembatas Role mengembalikan Unauthorized Error (RED -> GREEN).
- [x] Jalankan `npm run test` dan verifikasi test gagal dengan benar.

### 🟢 GREEN (Buat Test Berhasil)
- [x] Tulis implementasi lengkap untuk memenuhi kebutuhan Contract Interface.
- [x] Validasi test menjadi hijau (Pass).

### 🔵 REFACTOR (Optimasi Code)
- [x] Refactor kode: Hilangkan duplikasi dan perjelas struktur data.
- [x] Pastikan tidak ada dependensi UI/Infrastruktur (seperti React/Next API) yang bocor ke Domain Layer.

## 4. Task Checklist (To-Do)
*Langkah-langkah sistematis untuk meminimalisir bug fatal:*
1. [x] Setup folder `src/core/rbac/`.
1. [x] Implementasikan pemetaan Role-Permission.
1. [x] Buat mock middleware/guard untuk layout `(protected)`.
- [x] Verifikasi `npm run typecheck` tidak menghasilkan error.
- [x] Verifikasi `npm run lint` bebas error Biome.

## 5. Definition of Done
- [x] Kontrak Domain Interface untuk requirement di atas telah ditulis.
- [x] Tidak ditemukan file `index.ts` / `index.tsx` (No Barrel Export) dalam PR ini.
- [x] Seluruh Unit Test (dan Integration Test bila ada) berstatus PASSED.
- [x] Semua endpoint/route terkait dilindungi oleh RBAC/Tenant Isolation (`requirePermission`).
- [x] Tidak ada token Moodle atau credential rahasia yang terseret/ter-expose ke Client Browser.
