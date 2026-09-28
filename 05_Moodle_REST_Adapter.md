# Issue 05: Moodle REST Adapter & Credential Security

## 1. Objective
Membuat `MoodleRestClient` yang aman untuk memanggil Web Services Moodle dan enkripsi credential.

## 2. Requirements & Scope
- [x] Implementasi mematuhi Hexagonal / DDD module boundary.
- [x] Dilarang keras menggunakan barrel export (`index.ts` / `index.tsx`).
- [x] Buat adapter Moodle REST yang membungkus pemanggilan POST.
- [x] Implementasi enkripsi AES-256-GCM untuk menyimpan Moodle Token.
- [x] Mapping exception Moodle menjadi `MoodleError`.

## 3. TDD Approach (RED -> GREEN -> REFACTOR)
*Tugas wajib diselesaikan melalui pendekatan Test-Driven Development.*

### 🔴 RED (Tulis Test yang Gagal)
- [x] Test enkripsi dan dekripsi token menghasilkan string yang konsisten (RED -> GREEN).
- [x] Mock HTTP request gagal, pastikan `MoodleRestClient` melempar `MoodleError` (RED -> GREEN).
- [x] Jalankan `npm run test` dan verifikasi test gagal dengan benar.

### 🟢 GREEN (Buat Test Berhasil)
- [x] Tulis implementasi lengkap untuk memenuhi kebutuhan Contract Interface.
- [x] Validasi test menjadi hijau (Pass).

### 🔵 REFACTOR (Optimasi Code)
- [x] Refactor kode: Hilangkan duplikasi dan perjelas struktur data.
- [x] Pastikan tidak ada dependensi UI/Infrastruktur (seperti React/Next API) yang bocor ke Domain Layer.

## 4. Task Checklist (To-Do)
*Langkah-langkah sistematis untuk meminimalisir bug fatal:*
1. [x] Buat `EncryptionProvider.ts`.
1. [x] Buat `MoodleRestClient.ts`.
1. [x] Pastikan class Client ini `server-only`.
- [x] Verifikasi `npm run typecheck` tidak menghasilkan error.
- [x] Verifikasi `npm run lint` bebas error Biome.

## 5. Definition of Done
- [x] Kontrak Domain Interface untuk requirement di atas telah ditulis.
- [x] Tidak ditemukan file `index.ts` / `index.tsx` (No Barrel Export) dalam PR ini.
- [x] Seluruh Unit Test (dan Integration Test bila ada) berstatus PASSED.
- [x] Semua endpoint/route terkait dilindungi oleh RBAC/Tenant Isolation (`requirePermission`).
- [x] Tidak ada token Moodle atau credential rahasia yang terseret/ter-expose ke Client Browser.
