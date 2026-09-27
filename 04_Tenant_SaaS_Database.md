# Issue 04: Tenant SaaS Database & Tenant Module

## 1. Objective
Setup Prisma ORM (PostgreSQL) dan module `tenant` dengan Standard Module Pattern.

## 2. Requirements & Scope
- [ ] Implementasi mematuhi Hexagonal / DDD module boundary.
- [ ] Dilarang keras menggunakan barrel export (`index.ts` / `index.tsx`).
- [ ] Setup schema Prisma untuk `Tenant`, `TenantCredential`, `TenantBranding`.
- [ ] Buat Domain layer untuk Tenant (Entities, Interfaces).
- [ ] Buat Repository Prisma untuk Tenant.
- [ ] Buat UseCase CRUD Tenant.

## 3. TDD Approach (RED -> GREEN -> REFACTOR)
*Tugas wajib diselesaikan melalui pendekatan Test-Driven Development.*

### 🔴 RED (Tulis Test yang Gagal)
- [ ] Test UseCase Create Tenant menggunakan In-Memory Mock Repository (RED -> GREEN).
- [ ] Test isolasi domain: UseCase tidak boleh memanggil fungsi Prisma secara langsung.
- [ ] Jalankan `npm run test` dan verifikasi test gagal dengan benar.

### 🟢 GREEN (Buat Test Berhasil)
- [ ] Tulis implementasi lengkap untuk memenuhi kebutuhan Contract Interface.
- [ ] Validasi test menjadi hijau (Pass).

### 🔵 REFACTOR (Optimasi Code)
- [ ] Refactor kode: Hilangkan duplikasi dan perjelas struktur data.
- [ ] Pastikan tidak ada dependensi UI/Infrastruktur (seperti React/Next API) yang bocor ke Domain Layer.

## 4. Task Checklist (To-Do)
*Langkah-langkah sistematis untuk meminimalisir bug fatal:*
1. [ ] Inisialisasi Prisma dan Migrate schema awal.
1. [ ] Buat `domain/interfaces/TenantInterfaces.ts`.
1. [ ] Buat `application/usecases/*`.
1. [ ] Buat `infrastructure/repo/TenantRepository.ts`.
- [ ] Verifikasi `npm run typecheck` tidak menghasilkan error.
- [ ] Verifikasi `npm run lint` bebas error Biome.

## 5. Definition of Done
- [ ] Kontrak Domain Interface untuk requirement di atas telah ditulis.
- [ ] Tidak ditemukan file `index.ts` / `index.tsx` (No Barrel Export) dalam PR ini.
- [ ] Seluruh Unit Test (dan Integration Test bila ada) berstatus PASSED.
- [ ] Semua endpoint/route terkait dilindungi oleh RBAC/Tenant Isolation (`requirePermission`).
- [ ] Tidak ada token Moodle atau credential rahasia yang terseret/ter-expose ke Client Browser.
