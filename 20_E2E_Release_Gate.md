# Issue 20: E2E, CI & Release Gate

## 1. Objective
Pengujian aliran End-to-End, perbaikan tipe data, dan verifikasi CI/CD sebelum perilisan.

## 2. Requirements & Scope
- [ ] Implementasi mematuhi Hexagonal / DDD module boundary.
- [ ] Dilarang keras menggunakan barrel export (`index.ts` / `index.tsx`).
- [ ] Skrip E2E Playwright mensimulasikan login siswa hingga submit ujian.
- [ ] Pastikan `npm run build` berhasil tanpa warning type.

## 3. TDD Approach (RED -> GREEN -> REFACTOR)
*Tugas wajib diselesaikan melalui pendekatan Test-Driven Development.*

### 🔴 RED (Tulis Test yang Gagal)
- [ ] Full flow E2E test passes.
- [ ] Jalankan `npm run test` dan verifikasi test gagal dengan benar.

### 🟢 GREEN (Buat Test Berhasil)
- [ ] Tulis implementasi lengkap untuk memenuhi kebutuhan Contract Interface.
- [ ] Validasi test menjadi hijau (Pass).

### 🔵 REFACTOR (Optimasi Code)
- [ ] Refactor kode: Hilangkan duplikasi dan perjelas struktur data.
- [ ] Pastikan tidak ada dependensi UI/Infrastruktur (seperti React/Next API) yang bocor ke Domain Layer.

## 4. Task Checklist (To-Do)
*Langkah-langkah sistematis untuk meminimalisir bug fatal:*
1. [ ] Setup vijest config.
1. [ ] Tulis Skenario E2E utama.
1. [ ] Verifikasi Biome dan Typecheck (Zero Error).
- [ ] Verifikasi `npm run typecheck` tidak menghasilkan error.
- [ ] Verifikasi `npm run lint` bebas error Biome.

## 5. Definition of Done
- [ ] Kontrak Domain Interface untuk requirement di atas telah ditulis.
- [ ] Tidak ditemukan file `index.ts` / `index.tsx` (No Barrel Export) dalam PR ini.
- [ ] Seluruh Unit Test (dan Integration Test bila ada) berstatus PASSED.
- [ ] Semua endpoint/route terkait dilindungi oleh RBAC/Tenant Isolation (`requirePermission`).
- [ ] Tidak ada token Moodle atau credential rahasia yang terseret/ter-expose ke Client Browser.
