# Issue 01: Bootstrap & Architecture Guardrails

## 1. Objective
Inisialisasi project Next.js dengan strict TypeScript, Biome, Vitest, dan konfigurasi no-barrel-export policy.

## 2. Requirements & Scope
- [ ] Implementasi mematuhi Hexagonal / DDD module boundary.
- [ ] Dilarang keras menggunakan barrel export (`index.ts` / `index.tsx`).
- [ ] Setup Next.js App Router.
- [ ] Konfigurasi TypeScript Strict.
- [ ] Setup Biome untuk linting dan formatting.
- [ ] Konfigurasi Vitest untuk TDD.
- [ ] Buat rule/skrip CI yang mendeteksi dan menolak file `index.ts` / `index.tsx` (No Barrel Export).

## 3. TDD Approach (RED -> GREEN -> REFACTOR)
*Tugas wajib diselesaikan melalui pendekatan Test-Driven Development.*

### 🔴 RED (Tulis Test yang Gagal)
- [ ] Buat file `index.ts` dummy, jalankan linter/script, pastikan gagal (RED).
- [ ] Hapus `index.ts`, jalankan ulang, pastikan sukses (GREEN).
- [ ] Jalankan `npm run test` dan verifikasi test gagal dengan benar.

### 🟢 GREEN (Buat Test Berhasil)
- [ ] Tulis implementasi lengkap untuk memenuhi kebutuhan Contract Interface.
- [ ] Validasi test menjadi hijau (Pass).

### 🔵 REFACTOR (Optimasi Code)
- [ ] Refactor kode: Hilangkan duplikasi dan perjelas struktur data.
- [ ] Pastikan tidak ada dependensi UI/Infrastruktur (seperti React/Next API) yang bocor ke Domain Layer.

## 4. Task Checklist (To-Do)
*Langkah-langkah sistematis untuk meminimalisir bug fatal:*
1. [ ] Jalankan `npx create-next-app`.
1. [ ] Install dan konfigurasi Biome.
1. [ ] Install dan konfigurasi Vitest.
1. [ ] Buat custom script checker larangan barrel export.
1. [ ] Verifikasi project layout standard.
- [ ] Verifikasi `npm run typecheck` tidak menghasilkan error.
- [ ] Verifikasi `npm run lint` bebas error Biome.

## 5. Definition of Done
- [ ] Kontrak Domain Interface untuk requirement di atas telah ditulis.
- [ ] Tidak ditemukan file `index.ts` / `index.tsx` (No Barrel Export) dalam PR ini.
- [ ] Seluruh Unit Test (dan Integration Test bila ada) berstatus PASSED.
- [ ] Semua endpoint/route terkait dilindungi oleh RBAC/Tenant Isolation (`requirePermission`).
- [ ] Tidak ada token Moodle atau credential rahasia yang terseret/ter-expose ke Client Browser.
