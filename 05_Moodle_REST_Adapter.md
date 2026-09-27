# Issue 05: Moodle REST Adapter & Credential Security

## 1. Objective
Membuat `MoodleRestClient` yang aman untuk memanggil Web Services Moodle dan enkripsi credential.

## 2. Requirements & Scope
- [ ] Implementasi mematuhi Hexagonal / DDD module boundary.
- [ ] Dilarang keras menggunakan barrel export (`index.ts` / `index.tsx`).
- [ ] Buat adapter Moodle REST yang membungkus pemanggilan POST.
- [ ] Implementasi enkripsi AES-256-GCM untuk menyimpan Moodle Token.
- [ ] Mapping exception Moodle menjadi `MoodleError`.

## 3. TDD Approach (RED -> GREEN -> REFACTOR)
*Tugas wajib diselesaikan melalui pendekatan Test-Driven Development.*

### 🔴 RED (Tulis Test yang Gagal)
- [ ] Test enkripsi dan dekripsi token menghasilkan string yang konsisten (RED -> GREEN).
- [ ] Mock HTTP request gagal, pastikan `MoodleRestClient` melempar `MoodleError` (RED -> GREEN).
- [ ] Jalankan `npm run test` dan verifikasi test gagal dengan benar.

### 🟢 GREEN (Buat Test Berhasil)
- [ ] Tulis implementasi lengkap untuk memenuhi kebutuhan Contract Interface.
- [ ] Validasi test menjadi hijau (Pass).

### 🔵 REFACTOR (Optimasi Code)
- [ ] Refactor kode: Hilangkan duplikasi dan perjelas struktur data.
- [ ] Pastikan tidak ada dependensi UI/Infrastruktur (seperti React/Next API) yang bocor ke Domain Layer.

## 4. Task Checklist (To-Do)
*Langkah-langkah sistematis untuk meminimalisir bug fatal:*
1. [ ] Buat `EncryptionProvider.ts`.
1. [ ] Buat `MoodleRestClient.ts`.
1. [ ] Pastikan class Client ini `server-only`.
- [ ] Verifikasi `npm run typecheck` tidak menghasilkan error.
- [ ] Verifikasi `npm run lint` bebas error Biome.

## 5. Definition of Done
- [ ] Kontrak Domain Interface untuk requirement di atas telah ditulis.
- [ ] Tidak ditemukan file `index.ts` / `index.tsx` (No Barrel Export) dalam PR ini.
- [ ] Seluruh Unit Test (dan Integration Test bila ada) berstatus PASSED.
- [ ] Semua endpoint/route terkait dilindungi oleh RBAC/Tenant Isolation (`requirePermission`).
- [ ] Tidak ada token Moodle atau credential rahasia yang terseret/ter-expose ke Client Browser.
