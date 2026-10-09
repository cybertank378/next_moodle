# Issue 12: Student Exam UI

## 1. Objective
Tampilan UI peserta ujian (Attempt Interface), state machine jaringan (offline/retrying), dan layouting.

## 2. Requirements & Scope
- [x] Implementasi mematuhi Hexagonal / DDD module boundary.
- [x] Dilarang keras menggunakan barrel export (`index.ts` / `index.tsx`).
- [x] Atomic UI: AttemptTimer, QuestionNavigator, SubmitConfirmation.
- [x] State minimum: ready, saving, saved, offline, submitting.
- [x] Autosave via React hooks.

## 3. TDD Approach (RED -> GREEN -> REFACTOR)
*Tugas wajib diselesaikan melalui pendekatan Test-Driven Development.*

### 🔴 RED (Tulis Test yang Gagal)
- [x] Test rendering AttemptTimer (RED -> GREEN).
- [x] Test logic antrean Autosave jika status jaringan Offline (RED -> GREEN).
- [x] Jalankan `npm run test` dan verifikasi test gagal dengan benar.

### 🟢 GREEN (Buat Test Berhasil)
- [x] Tulis implementasi lengkap untuk memenuhi kebutuhan Contract Interface.
- [x] Validasi test menjadi hijau (Pass).

### 🔵 REFACTOR (Optimasi Code)
- [x] Refactor kode: Hilangkan duplikasi dan perjelas struktur data.
- [x] Pastikan tidak ada dependensi UI/Infrastruktur (seperti React/Next API) yang bocor ke Domain Layer.

## 4. Task Checklist (To-Do)
*Langkah-langkah sistematis untuk meminimalisir bug fatal:*
1. [x] Buat Atoms, Molecules, Organisms untuk Exam Interface.
1. [x] Integrasikan Presentation Hooks ke UseCases autosave.
- [x] Verifikasi `npm run typecheck` tidak menghasilkan error.
- [x] Verifikasi `npm run lint` bebas error Biome.

## 5. Definition of Done
- [x] Kontrak Domain Interface untuk requirement di atas telah ditulis.
- [x] Tidak ditemukan file `index.ts` / `index.tsx` (No Barrel Export) dalam PR ini.
- [x] Seluruh Unit Test (dan Integration Test bila ada) berstatus PASSED.
- [x] Semua endpoint/route terkait dilindungi oleh RBAC/Tenant Isolation (`requirePermission`).
- [x] Tidak ada token Moodle atau credential rahasia yang terseret/ter-expose ke Client Browser.

