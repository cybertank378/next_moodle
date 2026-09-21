# ISSUE 05 — Prisma multi-tenant: schema operasional SaaS dan migration

## Dependensi

Issue 04

## Tujuan

Membuat database Next.js SaaS yang ramping untuk tenant, credential terenkripsi, branding, dan audit operasional tanpa menduplikasi entity akademik Moodle.

## Kontrak arsitektur wajib

Ketentuan berikut berlaku untuk seluruh pekerjaan pada issue ini dan **tidak boleh dinegosiasikan**:

- Browser hanya berkomunikasi dengan API internal Next.js di `/api/v1/*`; browser **tidak boleh** memanggil Moodle secara langsung.
- Moodle tetap menjadi **source of truth** untuk user akademik, course, enrolment, quiz, question, attempt, dan grade.
- Database Next.js/Prisma hanya menyimpan metadata operasional SaaS multi-tenant, kredensial terenkripsi, branding, dan audit internal yang memang dibutuhkan.
- Next.js **dilarang** mengakses database SQL Moodle secara langsung.
- `domain` tidak boleh mengimpor React, Next.js, Prisma, Moodle client, `fetch`, atau implementation infrastructure.
- `application` hanya bergantung pada domain/core abstraction; `infrastructure` mengimplementasikan port domain.
- `presentation/hooks` hanya memanggil `/api/v1/*`; `sections/atoms` dan `sections/molecules` tidak memanggil API.
- `MoodleRestClient` dan semua token Moodle bersifat **server-only**. Token, password, stack trace Moodle, dan secret tidak boleh masuk ke response browser maupun log.
- TDD wajib mengikuti **RED → GREEN → REFACTOR**. Perbaikan bug harus dimulai dari regression test yang gagal.
- Jangan membuat abstraction kosong atau generic abstraction sebelum ada kebutuhan nyata.
- Jangan mengubah Moodle core.
- Jangan menggabungkan module `quizzes` dan `quiz-attempts`.

## Aturan pengerjaan AI

1. Kerjakan **hanya scope issue ini** dan dependency yang secara eksplisit disebutkan.
2. Jangan mengimplementasikan issue berikutnya lebih awal hanya karena terlihat mudah.
3. Sebelum mengubah kode, audit struktur yang sudah ada dan gunakan komponen/core abstraction yang telah tersedia.
4. Pertahankan backward compatibility pada contract internal yang sudah dipakai issue sebelumnya.
5. Jika ditemukan bug di luar scope, dokumentasikan sebagai temuan; jangan memperluas scope secara diam-diam.
6. Tidak boleh menggunakan `any` tanpa alasan terdokumentasi.
7. API route harus tipis: validasi/resolve context → panggil use case → map response.
8. Setelah GREEN, lakukan REFACTOR tanpa mengubah perilaku dan pastikan seluruh test tetap hijau.


## Cakupan pekerjaan

- Gunakan Prisma dengan PostgreSQL.
- Model minimum: `Tenant`, `TenantCredential`, `TenantBranding`, `SaasAuditLog`.
- Enum `TenantStatus`: `ACTIVE`, `MAINTENANCE`, `SUSPENDED`.
- `Tenant.slug` unik.
- `TenantCredential` menyimpan `moodleUrl`, `encryptedAdminToken`, `encryptedProctorToken`, `timeoutBudgetMs`, `sslVerify`.
- Jangan membuat tabel course, quiz, question, attempt, grade, atau password user Moodle.
- Buat migration dan repository contract/persistence yang diperlukan untuk lookup tenant.

## Strategi TDD

### RED
- Test repository untuk create/read tenant dan unique slug.
- Test cascade/relasi yang relevan.
- Test tidak ada academic model yang menjadi duplicate source of truth.

### GREEN
Implementasikan schema, migration, dan repository persistence minimum.

### REFACTOR
Rapikan mapping Prisma ↔ domain agar Prisma type tidak bocor ke domain.

## Kriteria penerimaan

- Migration dapat dijalankan pada database kosong.
- Model akademik Moodle tidak diduplikasi.
- Repository tenant dapat lookup berdasarkan slug/id.
- Prisma tidak diimport ke domain.

## Di luar cakupan

- Feature pada issue berikutnya yang belum menjadi dependency.
- Perubahan Moodle core.
- Direct database access ke Moodle.
- Refactor lintas module yang tidak diperlukan untuk memenuhi kriteria issue ini.
- Perubahan contract publik/internal yang sudah dipakai issue sebelumnya tanpa regression test dan alasan teknis yang jelas.

## Verifikasi akhir

Jalankan dan pastikan lulus:

```bash
npm run typecheck
npm run lint
npm run test
npm run dev
npm run build
```

Jika repository menyediakan `npm run verify`, jalankan juga sebagai pemeriksaan gabungan.


## Definition of Done issue

- [x] Scope issue selesai tanpa pekerjaan tersembunyi dari issue berikutnya.
- [x] RED test dibuat terlebih dahulu untuk perilaku baru/bug yang relevan.
- [x] GREEN dicapai dengan implementasi minimum yang benar.
- [x] REFACTOR dilakukan tanpa mematahkan boundary arsitektur.
- [x] Domain/application tests lulus.
- [x] Adapter/infrastructure tests lulus bila relevan.
- [x] Loading/Empty/Error state tersedia bila issue memiliki UI.
- [x] Pagination tersedia bila issue memiliki list yang dapat membesar.
- [x] Tenant isolation dipertahankan.
- [x] Tidak ada secret Moodle yang mencapai browser/log.
- [x] Tidak ada dead code dan tidak ada `any` tanpa penjelasan.
- [x] TypeScript, Biome, test, dan build lulus.
