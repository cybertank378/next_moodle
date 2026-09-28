# Issue 02: Core Foundation

## 1. Objective
Membangun abstraction layer (Base layer) di `src/core/` seperti Result pattern, BaseError, dan Logger.

## 2. Requirements & Scope
- [x] Implementasi mematuhi Hexagonal / DDD module boundary.
- [x] Dilarang keras menggunakan barrel export (`index.ts` / `index.tsx`).
- [x] Implementasi class `Result` untuk penanganan sukses/gagal (tanpa throw error).
- [x] Implementasi `AppError`, `DomainError`, `InfrastructureError`.
- [x] Setup Logger yang otomatis meredaksi credential (token/password).

## 3. TDD Approach (RED -> GREEN -> REFACTOR)
*Tugas wajib diselesaikan melalui pendekatan Test-Driven Development.*

### 🔴 RED (Tulis Test yang Gagal)
- [x] Buat test fungsi `Result.success` dan `Result.fail` (RED -> GREEN).
- [x] Buat test Logger memastikan string token disamarkan (RED -> GREEN).
- [x] Jalankan `npm run test` dan verifikasi test gagal dengan benar.

### 🟢 GREEN (Buat Test Berhasil)
- [x] Tulis implementasi lengkap untuk memenuhi kebutuhan Contract Interface.
- [x] Validasi test menjadi hijau (Pass).

### 🔵 REFACTOR (Optimasi Code)
- [x] Refactor kode: Hilangkan duplikasi dan perjelas struktur data.
- [x] Pastikan tidak ada dependensi UI/Infrastruktur (seperti React/Next API) yang bocor ke Domain Layer.

## 4. Task Checklist (To-Do)
*Langkah-langkah sistematis untuk meminimalisir bug fatal:*
1. [x] Buat file `src/core/base/Result.ts`.
1. [x] Buat hirarki error di `src/core/errors/`.
1. [x] Buat `Logger.ts`.
1. [x] Tulis unit test untuk foundation.
- [x] Verifikasi `npm run typecheck` tidak menghasilkan error.
- [x] Verifikasi `npm run lint` bebas error Biome.

## 5. Definition of Done
- [x] Kontrak Domain Interface untuk requirement di atas telah ditulis.
- [x] Tidak ditemukan file `index.ts` / `index.tsx` (No Barrel Export) dalam PR ini.
- [x] Seluruh Unit Test (dan Integration Test bila ada) berstatus PASSED.
- [x] Semua endpoint/route terkait dilindungi oleh RBAC/Tenant Isolation (`requirePermission`).
- [x] Tidak ada token Moodle atau credential rahasia yang terseret/ter-expose ke Client Browser.
