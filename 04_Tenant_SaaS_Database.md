# Issue 04: Tenant SaaS Database & Tenant Module

## 1. Objective
Setup Prisma ORM (PostgreSQL) dan module `tenant` dengan Standard Module Pattern.

## 2. Requirements & Scope
- [x] Implementasi mematuhi Hexagonal / DDD module boundary.
- [x] Dilarang keras menggunakan barrel export (`index.ts` / `index.tsx`).
- [x] Setup schema Prisma untuk `Tenant`, `TenantCredential`, `TenantBranding`.
- [x] Buat Domain layer untuk Tenant (Entities, Interfaces).
- [x] Buat Repository Prisma untuk Tenant.
- [x] Buat UseCase CRUD Tenant.

## 3. TDD Approach (RED -> GREEN -> REFACTOR)
*Tugas wajib diselesaikan melalui pendekatan Test-Driven Development.*

### 🔴 RED (Tulis Test yang Gagal)
- [x] Test UseCase Create Tenant menggunakan In-Memory Mock Repository (RED -> GREEN).
- [x] Test isolasi domain: UseCase tidak boleh memanggil fungsi Prisma secara langsung.
- [x] Jalankan `npm run test` dan verifikasi test gagal dengan benar.

### 🟢 GREEN (Buat Test Berhasil)
- [x] Tulis implementasi lengkap untuk memenuhi kebutuhan Contract Interface.
- [x] Validasi test menjadi hijau (Pass).

### 🔵 REFACTOR (Optimasi Code)
- [x] Refactor kode: Hilangkan duplikasi dan perjelas struktur data.
- [x] Pastikan tidak ada dependensi UI/Infrastruktur (seperti React/Next API) yang bocor ke Domain Layer.

## 4. Task Checklist (To-Do)
*Langkah-langkah sistematis untuk meminimalisir bug fatal:*
1. [x] Inisialisasi Prisma dan Migrate schema awal.
1. [x] Buat `domain/interfaces/TenantInterfaces.ts`.
1. [x] Buat `application/usecases/*`.
1. [x] Buat `infrastructure/repo/TenantRepository.ts`.
- [x] Verifikasi `npm run typecheck` tidak menghasilkan error.
- [x] Verifikasi `npm run lint` bebas error Biome.

## 5. Definition of Done
- [x] Kontrak Domain Interface untuk requirement di atas telah ditulis.
- [x] Tidak ditemukan file `index.ts` / `index.tsx` (No Barrel Export) dalam PR ini.
- [x] Seluruh Unit Test (dan Integration Test bila ada) berstatus PASSED.
- [x] Semua endpoint/route terkait dilindungi oleh RBAC/Tenant Isolation (`requirePermission`).
- [x] Tidak ada token Moodle atau credential rahasia yang terseret/ter-expose ke Client Browser.
