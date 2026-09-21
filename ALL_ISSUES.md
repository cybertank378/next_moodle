# INDEX ISSUE — Moodle Exam SaaS Next.js

Dokumen ini memecah `planning-nextjs-fe.md` menjadi **26 issue implementasi berurutan** agar AI mengerjakan satu scope yang jelas pada satu waktu.

## Cara penggunaan

1. Kerjakan issue berdasarkan nomor urut.
2. Jangan membuka scope issue berikutnya sebelum Definition of Done issue aktif terpenuhi, kecuali hanya untuk membaca contract dependency.
3. Saat sebuah issue menemukan kebutuhan baru yang bukan blocker langsung, catat sebagai issue baru; jangan memperluas scope diam-diam.
4. Setiap bug harus direproduksi dengan regression test RED sebelum diperbaiki.
5. Pertahankan contract arsitektur global pada setiap issue.

## Dependency chain utama

```text
01 Bootstrap
  ↓
02 Core HTTP/Error
  ↓
03 Core Logger/Tenant/Session Abstraction
  ↓
04 Moodle REST Adapter
  ↓
05 Prisma Multi-Tenant
  ↓
06 Tenant Resolver + Encryption + Handshake
  ↓
07 Auth Domain/Application
  ↓
08 Auth Session/API/UI
  ↓
09 Courses Vertical Slice
  ↓
10 Quizzes Access
  ↓
11 Attempt Start/Load
  ↓
12 Attempt Autosave
  ↓
13 Attempt Submit/Review
  ↓
14 Grades
  ↓
15 Student Exam UI Shell
  ↓
16 Student Exam UI Lifecycle
  ↓
17 Users
  ↓
18 Enrolments
  ↓
19 Groups/Cohorts
  ↓
20 Question Bank
  ↓
21 Exam Administration
  ↓
22 Exam Monitoring
  ↓
23 Audit
  ↓
24 Security Hardening
  ↓
25 Performance
  ↓
26 E2E + Release Readiness
```

## Daftar issue

| No. | Issue | Dependensi |
|---:|---|---|
| 01 | [Bootstrap proyek dan fondasi repository](issue-01-bootstrap-proyek-dan-fondasi-repository.md) | Tidak ada |
| 02 | [Core base, error, HTTP, request ID, dan response contract](issue-02-core-base-error-http-request-id-dan-response-contract.md) | Issue 01 |
| 03 | [Core logger, security abstraction, tenant context, dan session actor](issue-03-core-logger-security-abstraction-tenant-context-dan-session-actor.md) | Issue 02 |
| 04 | [Moodle REST Client: encoding, timeout, error mapping, dan server-only boundary](issue-04-moodle-rest-client-encoding-timeout-error-mapping-dan-server-only-boundary.md) | Issue 03 |
| 05 | [Prisma multi-tenant: schema operasional SaaS dan migration](issue-05-prisma-multi-tenant-schema-operasional-saas-dan-migration.md) | Issue 04 |
| 06 | [Tenant resolver, enkripsi kredensial, dan Moodle handshake](issue-06-tenant-resolver-enkripsi-kredensial-dan-moodle-handshake.md) | Issue 05 |
| 07 | [Authentication domain, use case, dan MoodleAuthRepository](issue-07-authentication-domain-use-case-dan-moodleauthrepository.md) | Issue 06 |
| 08 | [Session cookie, API auth, hook, dan UI login](issue-08-session-cookie-api-auth-hook-dan-ui-login.md) | Issue 07 |
| 09 | [Courses: vertical slice pertama yang lengkap](issue-09-courses-vertical-slice-pertama-yang-lengkap.md) | Issue 08 |
| 10 | [Quiz listing, detail, dan access state](issue-10-quiz-listing-detail-dan-access-state.md) | Issue 09 |
| 11 | [Quiz Attempt Core A: start, ownership, dan load attempt](issue-11-quiz-attempt-core-a-start-ownership-dan-load-attempt.md) | Issue 10 |
| 12 | [Quiz Attempt Core B: autosave jawaban dan concurrency safety](issue-12-quiz-attempt-core-b-autosave-jawaban-dan-concurrency-safety.md) | Issue 11 |
| 13 | [Quiz Attempt Core C: summary, submit, review, dan idempotency](issue-13-quiz-attempt-core-c-summary-submit-review-dan-idempotency.md) | Issue 12 |
| 14 | [Grades dan hasil ujian](issue-14-grades-dan-hasil-ujian.md) | Issue 13 |
| 15 | [Student Exam UI A: shell, timer, navigator, dan state machine](issue-15-student-exam-ui-a-shell-timer-navigator-dan-state-machine.md) | Issue 14 |
| 16 | [Student Exam UI B: autosave, offline/retry, summary, submit, dan review](issue-16-student-exam-ui-b-autosave-offline-retry-summary-submit-dan-review.md) | Issue 15 |
| 17 | [Administrasi pengguna](issue-17-administrasi-pengguna.md) | Issue 16 |
| 18 | [Administrasi enrolment peserta](issue-18-administrasi-enrolment-peserta.md) | Issue 17 |
| 19 | [Groups dan cohorts untuk kelas/kelompok ujian](issue-19-groups-dan-cohorts-untuk-kelas-kelompok-ujian.md) | Issue 18 |
| 20 | [Question Bank melalui local_examapi](issue-20-question-bank-melalui-local_examapi.md) | Issue 19 + plugin `local_examapi` tersedia |
| 21 | [Exam Administration: create, settings, questions, randomisasi, dan preview](issue-21-exam-administration-create-settings-questions-randomisasi-dan-preview.md) | Issue 20 + custom plugin function tersedia |
| 22 | [Exam Monitoring dan tindakan pengawas](issue-22-exam-monitoring-dan-tindakan-pengawas.md) | Issue 21 + custom plugin monitor tersedia |
| 23 | [Audit log operasional SaaS](issue-23-audit-log-operasional-saas.md) | Issue 22 |
| 24 | [Security hardening dan isolation regression suite](issue-24-security-hardening-dan-isolation-regression-suite.md) | Issue 23 |
| 25 | [Performance, batching, caching, dan scalability guardrails](issue-25-performance-batching-caching-dan-scalability-guardrails.md) | Issue 24 |
| 26 | [E2E kritis, MVP release readiness, dan final architecture verification](issue-26-e2e-kritis-mvp-release-readiness-dan-final-architecture-verification.md) | Issue 25 |

## Guardrail global ringkas

- Moodle = source of truth akademik dan ujian.
- Database Next.js = metadata SaaS multi-tenant saja.
- Browser → Next.js `/api/v1/*` → Application → Domain Port → Infrastructure → Moodle.
- Tidak ada browser → Moodle langsung.
- Tidak ada Next.js → SQL Moodle langsung.
- Semua token/credential Moodle server-only.
- TDD RED → GREEN → REFACTOR wajib.
- Atomic UI: atom/molecule tanpa API; organism boleh menggunakan presentation hook; page hanya komposisi/minimal orchestration.
- Jangan membuat generic abstraction sebelum ada minimal dua use case nyata yang membutuhkannya.
- `quizzes` dan `quiz-attempts` tetap module terpisah.

## Kriteria selesai keseluruhan

Seluruh bundle selesai bila issue 01–26 ditutup secara berurutan, critical E2E flow lulus, dan tidak ada pelanggaran boundary arsitektur atau kebocoran secret.


---

# ISSUE 01 — Bootstrap proyek dan fondasi repository

## Dependensi

Tidak ada

## Tujuan

Menyediakan proyek Next.js yang siap dikembangkan dengan TypeScript strict, Tailwind CSS, shadcn/ui, Biome, Vitest, alias path, environment template, struktur folder awal, dan script verifikasi standar.

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

- Inisialisasi/rapikan proyek Next.js sesuai repository existing.
- Aktifkan TypeScript strict.
- Konfigurasi Tailwind CSS dan shadcn/ui.
- Konfigurasi Biome dan Vitest.
- Konfigurasi alias path.
- Buat `.env.example` tanpa secret nyata.
- Buat scaffolding folder `src/app`, `src/core`, `src/modules`, `src/sections`, `src/shared-ui`, `src/styles`, `src/e2e` seperlunya.
- Pastikan script `dev`, `build`, `start`, `typecheck`, `lint`, `lint:fix`, `test`, `test:watch`, dan `verify` tersedia.
- Jangan membuat file abstraction kosong hanya demi menyerupai struktur planning.

## Strategi TDD

### RED
- Tambahkan smoke test konfigurasi paling minimum yang membuktikan Vitest berjalan.
- Pastikan typecheck/lint pada baseline dapat mendeteksi error yang disengaja bila diuji lokal.

### GREEN
- Lengkapi konfigurasi sampai seluruh script standar dapat dijalankan.

### REFACTOR
- Hapus konfigurasi duplikat dan dependency yang tidak digunakan.

## Kriteria penerimaan

- Struktur repository sesuai arah planning tanpa dead scaffold.
- `TypeScript strict` aktif.
- Vitest, Biome, Tailwind, dan shadcn/ui terkonfigurasi.
- `.env.example` tersedia dan tidak memuat secret nyata.
- Seluruh command verifikasi lulus pada baseline proyek.

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


---

# ISSUE 02 — Core base, error, HTTP, request ID, dan response contract

## Dependensi

Issue 01

## Tujuan

Membangun fondasi core yang akan dipakai semua module: `Result`, hierarchy error aplikasi, standard API response, HTTP status, request ID, dan wrapper route handler.

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

- Implementasikan `core/base/Result.ts` dan base abstraction yang benar-benar diperlukan.
- Implementasikan error: `AppError`, `DomainError`, `ValidationError`, `UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `InfrastructureError`, `MoodleError` sesuai kebutuhan.
- Implementasikan `ApiResponse`, `ApiErrorResponse`, `HttpStatus`, dan `withApiHandler`.
- Implementasikan request ID yang dapat diteruskan ke logger dan error mapping.
- Response sukses mengikuti `{ success: true, data, meta }`.
- Response gagal mengikuti `{ success: false, error: { code, message } }`.
- Jangan pernah mengirim raw exception/stack trace.

## Strategi TDD

### RED
Tulis test terlebih dahulu untuk:
- mapping error domain/application ke status HTTP;
- bentuk response sukses dan gagal;
- request ID dibuat/diteruskan secara konsisten;
- unknown error dipetakan ke error aman.

### GREEN
Implementasikan komponen core minimum sampai test lulus.

### REFACTOR
Satukan mapping yang duplikat tanpa membuat god-object.

## Kriteria penerimaan

- Semua route selanjutnya dapat memakai `withApiHandler` tanpa menduplikasi format response.
- Error internal tidak bocor ke client.
- Request ID tersedia pada alur request dan error.
- Test mapping response/error lulus.

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


---

# ISSUE 03 — Core logger, security abstraction, tenant context, dan session actor

## Dependensi

Issue 02

## Tujuan

Menyediakan abstraction core untuk structured logging, security helper, tenant context, current actor, session, dan resolver dasar tanpa memasukkan detail Moodle atau feature-specific.

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

- Implementasikan `Logger` dan `createLogger` dengan structured fields.
- Pastikan logger memiliki mekanisme redaksi secret.
- Implementasikan abstraction `EncryptionProvider`, `RateLimiter`, dan utilitas `RequestId` bila belum dibuat di issue 02.
- Implementasikan `TenantContext`, `TenantResolver`, `resolveCurrentTenant` sebagai abstraction/core contract saja; persistence detail menyusul di issue tenant.
- Implementasikan `CurrentActor`, `Session`, `SessionRepository`, `resolveCurrentActor` sebagai contract dasar.
- Jangan mengimplementasikan login Moodle pada issue ini.

## Strategi TDD

### RED
- Test redaksi data sensitif pada logger.
- Test tenant context tidak dapat dipakai tanpa tenant resolved.
- Test session/actor resolution untuk session valid, kosong, dan invalid.

### GREEN
Implementasikan abstraction minimum.

### REFACTOR
Pastikan core tetap framework-light dan tidak bergantung pada feature module.

## Kriteria penerimaan

- Core logger terstruktur dan secret-safe.
- Tenant context dan actor/session contract tersedia.
- Tidak ada ketergantungan dari core ke module feature.
- Test tenant/session resolution lulus.

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


---

# ISSUE 04 — Moodle REST Client: encoding, timeout, error mapping, dan server-only boundary

## Dependensi

Issue 03

## Tujuan

Membangun satu-satunya jalur HTTP resmi dari Next.js ke Moodle: `MoodleRestClient`, error mapper, factory, dan contract credential provider.

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

- Buat `src/core/moodle/MoodleRestClient.ts` dengan `import "server-only"`.
- Dukung encoding parameter scalar, array, dan nested sesuai Moodle REST.
- Implementasikan timeout terukur dan penanganan non-2xx.
- Deteksi Moodle exception response dan map ke error aplikasi.
- Sertakan request ID pada logging/diagnostic context.
- Jangan log token, password, Authorization header, atau payload sensitif.
- Buat `MoodleClientFactory`, `MoodleCredentialProvider`, `MoodleErrorMapper`, dan tipe response yang diperlukan.
- Semua komunikasi Moodle pada issue berikutnya wajib melewati client ini.

## Strategi TDD

### RED
Test wajib:
- scalar parameter encoding;
- array parameter encoding;
- nested parameter encoding;
- Moodle exception handling;
- timeout;
- non-200 response;
- secret-safe logging;
- module tidak aman diimport ke browser bundle.

### GREEN
Implementasikan client/factory/mapper/provider contract minimum.

### REFACTOR
Pisahkan serializer/mapper bila kompleksitas nyata sudah muncul.

## Kriteria penerimaan

- Tidak ada `fetch` Moodle di luar adapter yang disetujui.
- Token tidak muncul pada output test/log snapshot.
- Timeout dan error Moodle dinormalisasi.
- Client server-only dan seluruh test adapter lulus.

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


---

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

- [ ] Scope issue selesai tanpa pekerjaan tersembunyi dari issue berikutnya.
- [ ] RED test dibuat terlebih dahulu untuk perilaku baru/bug yang relevan.
- [ ] GREEN dicapai dengan implementasi minimum yang benar.
- [ ] REFACTOR dilakukan tanpa mematahkan boundary arsitektur.
- [ ] Domain/application tests lulus.
- [ ] Adapter/infrastructure tests lulus bila relevan.
- [ ] Loading/Empty/Error state tersedia bila issue memiliki UI.
- [ ] Pagination tersedia bila issue memiliki list yang dapat membesar.
- [ ] Tenant isolation dipertahankan.
- [ ] Tidak ada secret Moodle yang mencapai browser/log.
- [ ] Tidak ada dead code dan tidak ada `any` tanpa penjelasan.
- [ ] TypeScript, Biome, test, dan build lulus.


---

# ISSUE 06 — Tenant resolver, enkripsi kredensial, dan Moodle handshake

## Dependensi

Issue 05

## Tujuan

Menyelesaikan boundary tenant sebelum autentikasi: resolusi tenant dari hostname, isolasi credential per tenant, AES-256-GCM, dan test koneksi Moodle.

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

- Implementasikan entity/DTO/rules/validator `tenant`.
- Resolve hostname → tenant slug → repository → `TenantContext`.
- Tolak tenant `SUSPENDED`/status yang tidak mengizinkan request sesuai rule.
- Implementasikan `EncryptionProvider` dengan `aes-256-gcm`, master key 256-bit dari env, HKDF-SHA256 berbasis `tenantId`, IV 12 byte acak, auth tag 16 byte, format penyimpanan `base64(iv + auth_tag + ciphertext)`.
- Implementasikan `EncryptedTenantCredentialProvider`.
- Implementasikan `TestMoodleConnectionUseCase`.
- Handshake memvalidasi admin token, health plugin, proctor token, release/site ID/latency sesuai planning.
- Terapkan validasi SSRF terhadap `moodleUrl`; jangan izinkan target privat/loopback bila kebijakan deployment planning mensyaratkannya.
- Tenant A tidak boleh pernah memakai credential Tenant B.

## Strategi TDD

### RED
- Lookup tenant dari hostname valid/tidak valid.
- Tenant nonaktif ditolak.
- Encrypt/decrypt round-trip per tenant.
- Ciphertext tenant A gagal/ditolak bila didekripsi dengan tenant B.
- Token invalid dan plugin health invalid menghasilkan diagnostic terkontrol.
- Test tenant isolation.

### GREEN
Implementasikan use case, provider, resolver, dan factory integration.

### REFACTOR
Pastikan crypto detail tetap berada di provider, bukan domain.

## Kriteria penerimaan

- Semua Moodle access berikutnya menerima tenant context yang sudah resolved.
- Credential tersimpan terenkripsi dan tidak pernah dikirim ke browser.
- Test connection menghasilkan status diagnostic tanpa membocorkan token.
- Tenant isolation test lulus.

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

- [ ] Scope issue selesai tanpa pekerjaan tersembunyi dari issue berikutnya.
- [ ] RED test dibuat terlebih dahulu untuk perilaku baru/bug yang relevan.
- [ ] GREEN dicapai dengan implementasi minimum yang benar.
- [ ] REFACTOR dilakukan tanpa mematahkan boundary arsitektur.
- [ ] Domain/application tests lulus.
- [ ] Adapter/infrastructure tests lulus bila relevan.
- [ ] Loading/Empty/Error state tersedia bila issue memiliki UI.
- [ ] Pagination tersedia bila issue memiliki list yang dapat membesar.
- [ ] Tenant isolation dipertahankan.
- [ ] Tidak ada secret Moodle yang mencapai browser/log.
- [ ] Tidak ada dead code dan tidak ada `any` tanpa penjelasan.
- [ ] TypeScript, Biome, test, dan build lulus.


---

# ISSUE 07 — Authentication domain, use case, dan MoodleAuthRepository

## Dependensi

Issue 06

## Tujuan

Mengimplementasikan autentikasi melalui Moodle REST API tanpa direct DB access, termasuk login, logout, dan current user pada layer domain/application/infrastructure.

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

- DTO: `LoginRequestDTO`, `LoginResponseDTO`, `CurrentUserResponseDTO`.
- Entity `AuthenticatedUser` dan `AuthValidator`.
- Port `AuthRepository` dan session contract yang diperlukan.
- `LoginUseCase`, `LogoutUseCase`, `GetCurrentUserUseCase`.
- `MoodleAuthRepository` memanggil `/login/token.php` dengan service yang disepakati dan dilanjutkan `core_webservice_get_site_info`.
- Password hanya hidup selama request; jangan disimpan/log.
- Jangan membaca `mdl_user` atau memverifikasi password hash sendiri.

## Strategi TDD

### RED
- Login valid.
- Kredensial Moodle invalid.
- Tenant inactive.
- `core_webservice_get_site_info` gagal.
- Logout menginvalidasi session aplikasi.

### GREEN
Implementasikan domain/use case/repository minimal.

### REFACTOR
Pastikan Moodle response shape hanya dikenal infrastructure mapper/repository.

## Kriteria penerimaan

- Login selalu melalui Moodle REST.
- Domain tidak mengetahui endpoint Moodle.
- Password dan token tidak bocor.
- Semua test autentikasi aplikasi lulus.

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

- [ ] Scope issue selesai tanpa pekerjaan tersembunyi dari issue berikutnya.
- [ ] RED test dibuat terlebih dahulu untuk perilaku baru/bug yang relevan.
- [ ] GREEN dicapai dengan implementasi minimum yang benar.
- [ ] REFACTOR dilakukan tanpa mematahkan boundary arsitektur.
- [ ] Domain/application tests lulus.
- [ ] Adapter/infrastructure tests lulus bila relevan.
- [ ] Loading/Empty/Error state tersedia bila issue memiliki UI.
- [ ] Pagination tersedia bila issue memiliki list yang dapat membesar.
- [ ] Tenant isolation dipertahankan.
- [ ] Tidak ada secret Moodle yang mencapai browser/log.
- [ ] Tidak ada dead code dan tidak ada `any` tanpa penjelasan.
- [ ] TypeScript, Biome, test, dan build lulus.


---

# ISSUE 08 — Session cookie, API auth, hook, dan UI login

## Dependensi

Issue 07

## Tujuan

Menyelesaikan vertical slice autentikasi dari API route sampai UI, menggunakan cookie aplikasi terenkripsi/ditandatangani dan HttpOnly.

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

- Implementasikan `CookieSessionRepository`.
- Cookie `auth_session` minimal: `HttpOnly`, `Secure` pada production, `SameSite=Lax`, `Path=/`.
- Token user Moodle dibungkus dalam session server-side dan tidak pernah dikembalikan ke JavaScript browser.
- Implementasikan `POST /api/v1/auth/login`, `POST /api/v1/auth/logout`, `GET /api/v1/auth/me`.
- Implementasikan `useAuthApi`.
- UI: `LoginForm` (molecule), `LoginView` (organism), `LoginPageSection` (page).
- Atoms/molecules tidak boleh memanggil API langsung.

## Strategi TDD

### RED
- API login sukses/gagal menggunakan standard response.
- Cookie memiliki flag keamanan yang benar.
- `/me` menolak session invalid.
- logout menghapus/menginvalidasi cookie.
- UI organism memanggil hook, bukan Moodle.

### GREEN
Implementasikan route, session repo, hook, dan UI.

### REFACTOR
Pisahkan state UI dan mapping error tanpa duplikasi.

## Kriteria penerimaan

- Login end-to-end internal: UI → hook → `/api/v1` → use case → Moodle repository.
- Tidak ada token mentah di response client.
- Session invalid/expired ditangani konsisten.
- Loading/error state login tersedia.

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

- [ ] Scope issue selesai tanpa pekerjaan tersembunyi dari issue berikutnya.
- [ ] RED test dibuat terlebih dahulu untuk perilaku baru/bug yang relevan.
- [ ] GREEN dicapai dengan implementasi minimum yang benar.
- [ ] REFACTOR dilakukan tanpa mematahkan boundary arsitektur.
- [ ] Domain/application tests lulus.
- [ ] Adapter/infrastructure tests lulus bila relevan.
- [ ] Loading/Empty/Error state tersedia bila issue memiliki UI.
- [ ] Pagination tersedia bila issue memiliki list yang dapat membesar.
- [ ] Tenant isolation dipertahankan.
- [ ] Tidak ada secret Moodle yang mencapai browser/log.
- [ ] Tidak ada dead code dan tidak ada `any` tanpa penjelasan.
- [ ] TypeScript, Biome, test, dan build lulus.


---

# ISSUE 09 — Courses: vertical slice pertama yang lengkap

## Dependensi

Issue 08

## Tujuan

Mengimplementasikan vertical slice course sebagai pola referensi arsitektur penuh dari UI sampai Moodle.

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

- DTO/entity/port untuk course.
- Use case: `GetMyCoursesUseCase`, `GetCourseDetailUseCase`, `GetCourseContentsUseCase`.
- `MoodleCourseMapper`, `MoodleCourseRepository`, `createCourseDependencies`.
- Moodle functions: `core_enrol_get_users_courses`, `core_course_get_courses_by_field`, `core_course_get_contents`.
- API: `GET /api/v1/courses`, `GET /api/v1/courses/:courseId`, `GET /api/v1/courses/:courseId/contents`.
- `useCourseApi`.
- UI course card/list dengan skeleton dan empty state.

## Strategi TDD

### RED
- Mapping course response.
- User hanya menerima course miliknya sesuai Moodle.
- Detail/content error dipetakan aman.
- Pagination/filter bila list membutuhkan skala.

### GREEN
Implementasikan seluruh vertical slice.

### REFACTOR
Gunakan issue ini sebagai referensi pola dependency factory dan thin route.

## Kriteria penerimaan

- Flow lengkap: UI → hook → API → use case → port → Moodle repository → MoodleRestClient.
- Skeleton/loading dan EmptyState tidak menghilangkan header penting.
- Tidak ada Moodle function name di domain/presentation.

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

- [ ] Scope issue selesai tanpa pekerjaan tersembunyi dari issue berikutnya.
- [ ] RED test dibuat terlebih dahulu untuk perilaku baru/bug yang relevan.
- [ ] GREEN dicapai dengan implementasi minimum yang benar.
- [ ] REFACTOR dilakukan tanpa mematahkan boundary arsitektur.
- [ ] Domain/application tests lulus.
- [ ] Adapter/infrastructure tests lulus bila relevan.
- [ ] Loading/Empty/Error state tersedia bila issue memiliki UI.
- [ ] Pagination tersedia bila issue memiliki list yang dapat membesar.
- [ ] Tenant isolation dipertahankan.
- [ ] Tidak ada secret Moodle yang mencapai browser/log.
- [ ] Tidak ada dead code dan tidak ada `any` tanpa penjelasan.
- [ ] TypeScript, Biome, test, dan build lulus.


---

# ISSUE 10 — Quiz listing, detail, dan access state

## Dependensi

Issue 09

## Tujuan

Mengimplementasikan definisi ujian/quiz, listing, detail, dan keputusan access sebelum tombol “Mulai Ujian” ditampilkan.

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

- DTO/entity/port/rules/types module `quizzes`.
- Use case: `GetCourseQuizzesUseCase`, `GetQuizDetailUseCase`, `GetQuizAccessUseCase`.
- Moodle functions: `mod_quiz_get_quizzes_by_courses`, `mod_quiz_get_quiz_access_information`, `mod_quiz_get_quiz_required_qtypes`.
- API: course quizzes, quiz detail, quiz access.
- State access minimum: `AVAILABLE`, `NOT_OPEN`, `CLOSED`, `ATTEMPT_LIMIT_REACHED`, `PASSWORD_REQUIRED`, `RESTRICTED`.
- Jangan menebak access hanya dari timestamp frontend.

## Strategi TDD

### RED
- Mapping setiap access state.
- Moodle restriction/error menjadi state/error domain yang benar.
- UI tidak menampilkan aksi mulai sebelum access backend tersedia.

### GREEN
Implementasikan module, route, hook, dan UI listing/detail seperlunya.

### REFACTOR
Pastikan rules tidak bergantung pada raw Moodle shape.

## Kriteria penerimaan

- Tombol mulai hanya aktif pada state yang diizinkan backend.
- Access state stabil dan typed.
- Loading/error/empty state tersedia.
- Tidak ada aturan access authoritative di browser.

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

- [ ] Scope issue selesai tanpa pekerjaan tersembunyi dari issue berikutnya.
- [ ] RED test dibuat terlebih dahulu untuk perilaku baru/bug yang relevan.
- [ ] GREEN dicapai dengan implementasi minimum yang benar.
- [ ] REFACTOR dilakukan tanpa mematahkan boundary arsitektur.
- [ ] Domain/application tests lulus.
- [ ] Adapter/infrastructure tests lulus bila relevan.
- [ ] Loading/Empty/Error state tersedia bila issue memiliki UI.
- [ ] Pagination tersedia bila issue memiliki list yang dapat membesar.
- [ ] Tenant isolation dipertahankan.
- [ ] Tidak ada secret Moodle yang mencapai browser/log.
- [ ] Tidak ada dead code dan tidak ada `any` tanpa penjelasan.
- [ ] TypeScript, Biome, test, dan build lulus.


---

# ISSUE 11 — Quiz Attempt Core A: start, ownership, dan load attempt

## Dependensi

Issue 10

## Tujuan

Membangun bagian pertama domain prioritas tertinggi: memulai dan memuat attempt dengan ownership check yang benar.

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

- Bentuk domain `quiz-attempts`, DTO awal, entity, rules, validator, port repository.
- Implementasikan `GetUserQuizAttemptsUseCase`, `StartQuizAttemptUseCase`, `GetQuizAttemptUseCase`.
- Moodle functions: `mod_quiz_get_user_quiz_attempts`, `mod_quiz_get_attempt_access_information`, `mod_quiz_start_attempt`, `mod_quiz_get_attempt_data`.
- Pastikan actor hanya dapat mengakses attempt miliknya kecuali use case admin khusus pada issue monitoring.
- Mapper Moodle question/attempt response tetap di infrastructure.

## Strategi TDD

### RED
Start attempt:
- valid attempt berhasil;
- invalid quiz id ditolak;
- access error Moodle dipetakan;
- ownership/actor mismatch ditolak.

Load attempt:
- data question dipetakan;
- state attempt dipertahankan;
- finished attempt ditangani.

### GREEN
Implementasikan use case, mapper, repository, factory.

### REFACTOR
Pisahkan ownership rule dari transport mapping.

## Kriteria penerimaan

- Start/load attempt memiliki contract typed.
- Ownership divalidasi server-side.
- Raw Moodle response tidak bocor keluar infrastructure.
- Test start/load lulus.

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

- [ ] Scope issue selesai tanpa pekerjaan tersembunyi dari issue berikutnya.
- [ ] RED test dibuat terlebih dahulu untuk perilaku baru/bug yang relevan.
- [ ] GREEN dicapai dengan implementasi minimum yang benar.
- [ ] REFACTOR dilakukan tanpa mematahkan boundary arsitektur.
- [ ] Domain/application tests lulus.
- [ ] Adapter/infrastructure tests lulus bila relevan.
- [ ] Loading/Empty/Error state tersedia bila issue memiliki UI.
- [ ] Pagination tersedia bila issue memiliki list yang dapat membesar.
- [ ] Tenant isolation dipertahankan.
- [ ] Tidak ada secret Moodle yang mencapai browser/log.
- [ ] Tidak ada dead code dan tidak ada `any` tanpa penjelasan.
- [ ] TypeScript, Biome, test, dan build lulus.


---

# ISSUE 12 — Quiz Attempt Core B: autosave jawaban dan concurrency safety

## Dependensi

Issue 11

## Tujuan

Mengimplementasikan penyimpanan jawaban/autosave yang andal tanpa membuat Next.js menjadi source of truth kedua.

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

- Implementasikan `SaveQuizAnswerRequestDTO`, `QuizAnswer`, `AutosaveState`, `SaveQuizAnswerUseCase`.
- Moodle function: `mod_quiz_save_attempt`.
- Endpoint `PATCH /api/v1/attempts/:attemptId/answers`.
- Nama parameter Moodle hanya boleh hidup di infrastructure.
- Tangani transient error dan retry-safe behavior.
- Cegah stale write bila data/version yang tersedia memungkinkan.
- Jangan menyimpan salinan authoritative jawaban siswa di DB SaaS.

## Strategi TDD

### RED
- Jawaban valid tersimpan.
- Attempt bukan milik actor ditolak.
- Transient error menghasilkan state retryable.
- Stale write ditolak/ditangani jika applicable.
- Moodle parameter names tidak bocor ke domain.

### GREEN
Implementasikan use case/repository/API.

### REFACTOR
Pisahkan policy retry dari UI transport bila diperlukan.

## Kriteria penerimaan

- Autosave tidak membuat duplicate academic source of truth.
- Error network dapat dibedakan dari validation/access error.
- Test autosave/concurrency lulus.
- API tetap thin.

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

- [ ] Scope issue selesai tanpa pekerjaan tersembunyi dari issue berikutnya.
- [ ] RED test dibuat terlebih dahulu untuk perilaku baru/bug yang relevan.
- [ ] GREEN dicapai dengan implementasi minimum yang benar.
- [ ] REFACTOR dilakukan tanpa mematahkan boundary arsitektur.
- [ ] Domain/application tests lulus.
- [ ] Adapter/infrastructure tests lulus bila relevan.
- [ ] Loading/Empty/Error state tersedia bila issue memiliki UI.
- [ ] Pagination tersedia bila issue memiliki list yang dapat membesar.
- [ ] Tenant isolation dipertahankan.
- [ ] Tidak ada secret Moodle yang mencapai browser/log.
- [ ] Tidak ada dead code dan tidak ada `any` tanpa penjelasan.
- [ ] TypeScript, Biome, test, dan build lulus.


---

# ISSUE 13 — Quiz Attempt Core C: summary, submit, review, dan idempotency

## Dependensi

Issue 12

## Tujuan

Menyelesaikan lifecycle attempt: summary, final submit, duplicate submit behavior, expired attempt, dan review sesuai kebijakan Moodle.

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

- Implementasikan `GetQuizAttemptSummaryUseCase`, `SubmitQuizAttemptUseCase`, `GetQuizAttemptReviewUseCase`.
- Moodle functions: `mod_quiz_get_attempt_summary`, `mod_quiz_process_attempt`, `mod_quiz_get_attempt_review`.
- API: summary, submit, review.
- Tangani duplicate submit secara deterministik/idempotent sesuai kemampuan Moodle.
- Tolak ownership mismatch dan attempt expired dengan error terkontrol.
- Review harus menghormati Moodle review options.

## Strategi TDD

### RED
- Final submit sukses.
- Duplicate submit behavior terdefinisi.
- Expired attempt ditangani.
- Ownership mismatch ditolak.
- Review tidak menampilkan informasi yang Moodle larang.

### GREEN
Implementasikan use case, adapter, route.

### REFACTOR
Pastikan state transition attempt terpusat pada rules/service yang relevan.

## Kriteria penerimaan

- Summary/submit/review lengkap dan typed.
- Submit tidak menghasilkan state ambigu pada retry.
- Review policy Moodle dihormati.
- Semua lifecycle tests lulus.

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

- [ ] Scope issue selesai tanpa pekerjaan tersembunyi dari issue berikutnya.
- [ ] RED test dibuat terlebih dahulu untuk perilaku baru/bug yang relevan.
- [ ] GREEN dicapai dengan implementasi minimum yang benar.
- [ ] REFACTOR dilakukan tanpa mematahkan boundary arsitektur.
- [ ] Domain/application tests lulus.
- [ ] Adapter/infrastructure tests lulus bila relevan.
- [ ] Loading/Empty/Error state tersedia bila issue memiliki UI.
- [ ] Pagination tersedia bila issue memiliki list yang dapat membesar.
- [ ] Tenant isolation dipertahankan.
- [ ] Tidak ada secret Moodle yang mencapai browser/log.
- [ ] Tidak ada dead code dan tidak ada `any` tanpa penjelasan.
- [ ] TypeScript, Biome, test, dan build lulus.


---

# ISSUE 14 — Grades dan hasil ujian

## Dependensi

Issue 13

## Tujuan

Menyediakan nilai quiz/course dan halaman hasil tanpa menghitung grade authoritative di browser.

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

- Module `grades`: DTO, entity, repository port.
- `GetQuizGradeUseCase`, `GetCourseGradesUseCase`.
- `MoodleGradeMapper`, `MoodleGradeRepository`, dependency factory.
- API grade sesuai kontrak internal.
- `useGradeApi`.
- UI `GradeBadge`, `GradeCard`, `StudentGradeView`, `ResultPageSection`.
- Hormati Moodle review options; jangan tampilkan correctness/detail terlarang.

## Strategi TDD

### RED
- Mapping grade berhasil.
- Missing grade/unfinished attempt ditangani.
- Review restriction tidak dilanggar.

### GREEN
Implementasikan module/API/UI.

### REFACTOR
Hindari logika perhitungan grade duplikat di Next.js.

## Kriteria penerimaan

- Grade berasal dari Moodle.
- Result UI memiliki loading/error/empty yang tepat.
- Tidak ada perhitungan grade authoritative di client.
- Test mapper/use case lulus.

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

- [ ] Scope issue selesai tanpa pekerjaan tersembunyi dari issue berikutnya.
- [ ] RED test dibuat terlebih dahulu untuk perilaku baru/bug yang relevan.
- [ ] GREEN dicapai dengan implementasi minimum yang benar.
- [ ] REFACTOR dilakukan tanpa mematahkan boundary arsitektur.
- [ ] Domain/application tests lulus.
- [ ] Adapter/infrastructure tests lulus bila relevan.
- [ ] Loading/Empty/Error state tersedia bila issue memiliki UI.
- [ ] Pagination tersedia bila issue memiliki list yang dapat membesar.
- [ ] Tenant isolation dipertahankan.
- [ ] Tidak ada secret Moodle yang mencapai browser/log.
- [ ] Tidak ada dead code dan tidak ada `any` tanpa penjelasan.
- [ ] TypeScript, Biome, test, dan build lulus.


---

# ISSUE 15 — Student Exam UI A: shell, timer, navigator, dan state machine

## Dependensi

Issue 14

## Tujuan

Membangun UI pengerjaan ujian utama dengan Atomic UI dan state eksplisit tanpa terlebih dahulu menangani detail retry/autosave orchestration penuh.

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

- Atoms: `AnswerStatusBadge`, `AttemptTimer`, `ConnectionIndicator`, `QuestionNumberBadge`.
- Molecules: `AnswerOption`, `AttemptHeader`, `QuestionCard`, `QuestionNavigatorItem`, `SubmitConfirmation`.
- Organisms: `QuizAttemptView`, `QuizNavigator`, `QuizQuestionPanel`, `QuizSubmissionPanel`.
- Page: `QuizAttemptPageSection`.
- State UI minimum: `loading`, `ready`, `saving`, `saved`, `retrying`, `offline`, `submitting`, `submitted`, `error`.
- Implementasikan timer, navigator, answered indicator, previous/next, flagged question jika backend mendukung.
- Loading utama tidak boleh spinner-only; gunakan skeleton/layout-preserving loading.

## Strategi TDD

### RED
- Component tests/state tests untuk perpindahan question.
- Timer tidak menjadi sumber otoritatif access rule.
- Navigator mencerminkan answered/flagged state.
- Atom/molecule tidak memanggil API.

### GREEN
Bangun komponen dan orchestration menggunakan `useQuizAttemptApi`.

### REFACTOR
Minimalkan prop drilling jika sudah terbukti mengganggu, tanpa membuat global state prematurely.

## Kriteria penerimaan

- Layout desktop utama sesuai planning dan responsif.
- Header/navigator tetap stabil pada loading.
- Semua API call berada di organism/hook.
- State machine UI eksplisit dan typed.

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

- [ ] Scope issue selesai tanpa pekerjaan tersembunyi dari issue berikutnya.
- [ ] RED test dibuat terlebih dahulu untuk perilaku baru/bug yang relevan.
- [ ] GREEN dicapai dengan implementasi minimum yang benar.
- [ ] REFACTOR dilakukan tanpa mematahkan boundary arsitektur.
- [ ] Domain/application tests lulus.
- [ ] Adapter/infrastructure tests lulus bila relevan.
- [ ] Loading/Empty/Error state tersedia bila issue memiliki UI.
- [ ] Pagination tersedia bila issue memiliki list yang dapat membesar.
- [ ] Tenant isolation dipertahankan.
- [ ] Tidak ada secret Moodle yang mencapai browser/log.
- [ ] Tidak ada dead code dan tidak ada `any` tanpa penjelasan.
- [ ] TypeScript, Biome, test, dan build lulus.


---

# ISSUE 16 — Student Exam UI B: autosave, offline/retry, summary, submit, dan review

## Dependensi

Issue 15

## Tujuan

Mengintegrasikan lifecycle attempt ke UI siswa secara tahan gangguan jaringan dan aman saat submit.

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

- Hubungkan autosave ke endpoint issue 12.
- Tampilkan state `saving/saved/retrying/offline` yang nyata.
- Hindari kehilangan jawaban saat navigasi cepat.
- Implementasikan summary sebelum submit.
- Implementasikan final confirmation.
- Saat `submitting`, cegah double-action pada UI.
- Setelah submit, tampilkan state final dan arahkan ke review/result yang diizinkan.
- Jangan menyimpan jawaban sebagai source of truth kedua di local/DB tanpa arsitektur offline yang disetujui.

## Strategi TDD

### RED
- Simulasi autosave sukses/gagal/transient.
- Navigasi saat save pending tidak kehilangan state tampilan.
- Double-click submit tidak menghasilkan duplicate UI action.
- Offline → retry → saved berjalan.
- Review yang tidak diizinkan tidak dirender.

### GREEN
Integrasikan hooks dan organisms.

### REFACTOR
Pisahkan side-effect autosave/submit dari presentational components.

## Kriteria penerimaan

- Siswa dapat start/resume → answer → autosave → navigate → summary → submit → result/review.
- State jaringan terlihat dan tidak menyesatkan.
- Tidak ada direct Moodle call di browser.
- Critical student interaction tests lulus.

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

- [ ] Scope issue selesai tanpa pekerjaan tersembunyi dari issue berikutnya.
- [ ] RED test dibuat terlebih dahulu untuk perilaku baru/bug yang relevan.
- [ ] GREEN dicapai dengan implementasi minimum yang benar.
- [ ] REFACTOR dilakukan tanpa mematahkan boundary arsitektur.
- [ ] Domain/application tests lulus.
- [ ] Adapter/infrastructure tests lulus bila relevan.
- [ ] Loading/Empty/Error state tersedia bila issue memiliki UI.
- [ ] Pagination tersedia bila issue memiliki list yang dapat membesar.
- [ ] Tenant isolation dipertahankan.
- [ ] Tidak ada secret Moodle yang mencapai browser/log.
- [ ] Tidak ada dead code dan tidak ada `any` tanpa penjelasan.
- [ ] TypeScript, Biome, test, dan build lulus.


---

# ISSUE 17 — Administrasi pengguna

## Dependensi

Issue 16

## Tujuan

Membangun fondasi admin untuk daftar, detail, create, update, deactivate, dan bulk import user melalui Moodle service.

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

- Module `users` mengikuti DDD/hexagonal standard.
- Moodle functions: `core_user_create_users`, `core_user_update_users`, `core_user_get_users`, `core_user_get_users_by_field`.
- UI management pattern: Page Header → statistik bila berguna → filter/search → table → pagination.
- Loading: header/filter tetap terlihat, `TableSkeleton` hanya di area content.
- Empty: table/header/filter tidak tertutup; `EmptyState` mengganti body yang relevan.
- Molecule table menerima data + callbacks saja.
- Sediakan action menu, form create/edit, dan confirmation untuk mutation yang relevan.

## Strategi TDD

### RED
- List/pagination/filter.
- Create/update validation.
- Deactivate behavior.
- Bulk import validation/error aggregation.

### GREEN
Implementasikan module/API/hook/UI.

### REFACTOR
Gunakan shared `Pagination`, `TableSkeleton`, `EmptyState`; jangan duplikasi.

## Kriteria penerimaan

- Management table scalable dan konsisten.
- Tidak ada API call di table molecule.
- Error per-user pada bulk import dapat ditindaklanjuti.
- Test domain/application/adapter lulus.

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

- [ ] Scope issue selesai tanpa pekerjaan tersembunyi dari issue berikutnya.
- [ ] RED test dibuat terlebih dahulu untuk perilaku baru/bug yang relevan.
- [ ] GREEN dicapai dengan implementasi minimum yang benar.
- [ ] REFACTOR dilakukan tanpa mematahkan boundary arsitektur.
- [ ] Domain/application tests lulus.
- [ ] Adapter/infrastructure tests lulus bila relevan.
- [ ] Loading/Empty/Error state tersedia bila issue memiliki UI.
- [ ] Pagination tersedia bila issue memiliki list yang dapat membesar.
- [ ] Tenant isolation dipertahankan.
- [ ] Tidak ada secret Moodle yang mencapai browser/log.
- [ ] Tidak ada dead code dan tidak ada `any` tanpa penjelasan.
- [ ] TypeScript, Biome, test, dan build lulus.


---

# ISSUE 18 — Administrasi enrolment peserta

## Dependensi

Issue 17

## Tujuan

Mengelola participant list, manual enrol, unenrol, dan status enrolment untuk course/ujian.

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

- Module `enrolments` dengan contract domain sendiri.
- Moodle: `core_enrol_get_enrolled_users`, `enrol_manual_enrol_users`, `enrol_manual_unenrol_users`.
- API internal untuk list/enrol/unenrol.
- UI table memakai pattern admin standard.
- Server-side authorization untuk mutation admin/guru sesuai actor policy yang tersedia.
- Audit hook disiapkan tetapi persistence audit final dikerjakan di issue audit.

## Strategi TDD

### RED
- List enrolled users.
- Enrol valid/invalid.
- Unenrol valid/not-found.
- Unauthorized mutation ditolak.

### GREEN
Implementasikan use case, adapter, API, hook, UI.

### REFACTOR
Pastikan operasi batch memanfaatkan endpoint yang efisien bila tersedia.

## Kriteria penerimaan

- Participant management bekerja tanpa direct Moodle browser call.
- Pagination/filter tersedia jika list besar.
- Mutation terotorisasi dan typed.
- Test use case/adapter lulus.

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

- [ ] Scope issue selesai tanpa pekerjaan tersembunyi dari issue berikutnya.
- [ ] RED test dibuat terlebih dahulu untuk perilaku baru/bug yang relevan.
- [ ] GREEN dicapai dengan implementasi minimum yang benar.
- [ ] REFACTOR dilakukan tanpa mematahkan boundary arsitektur.
- [ ] Domain/application tests lulus.
- [ ] Adapter/infrastructure tests lulus bila relevan.
- [ ] Loading/Empty/Error state tersedia bila issue memiliki UI.
- [ ] Pagination tersedia bila issue memiliki list yang dapat membesar.
- [ ] Tenant isolation dipertahankan.
- [ ] Tidak ada secret Moodle yang mencapai browser/log.
- [ ] Tidak ada dead code dan tidak ada `any` tanpa penjelasan.
- [ ] TypeScript, Biome, test, dan build lulus.


---

# ISSUE 19 — Groups dan cohorts untuk kelas/kelompok ujian

## Dependensi

Issue 18

## Tujuan

Mengelola kelas, exam groups, cohort, dan keanggotaan yang diperlukan administrasi ujian.

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

- Module `groups`/cohorts mengikuti boundary domain.
- Gunakan `core_group_*` dan `core_cohort_*` yang benar-benar diperlukan.
- CRUD/list membership melalui repository infrastructure.
- UI admin standard dengan pagination/skeleton/empty state.
- Hindari generic abstraction group/cohort yang terlalu luas; implementasikan use case nyata.

## Strategi TDD

### RED
- List/create/update/delete group yang digunakan.
- Add/remove member.
- Actor/tenant isolation.
- Mapping Moodle errors.

### GREEN
Implementasikan use case minimum yang dibutuhkan flow admin.

### REFACTOR
Pisahkan rule membership dari raw API contract Moodle.

## Kriteria penerimaan

- Group/cohort operations yang dibutuhkan exam admin tersedia.
- Tidak ada `core_group_*` name di domain/presentation.
- Tenant/authorization tests lulus.

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

- [ ] Scope issue selesai tanpa pekerjaan tersembunyi dari issue berikutnya.
- [ ] RED test dibuat terlebih dahulu untuk perilaku baru/bug yang relevan.
- [ ] GREEN dicapai dengan implementasi minimum yang benar.
- [ ] REFACTOR dilakukan tanpa mematahkan boundary arsitektur.
- [ ] Domain/application tests lulus.
- [ ] Adapter/infrastructure tests lulus bila relevan.
- [ ] Loading/Empty/Error state tersedia bila issue memiliki UI.
- [ ] Pagination tersedia bila issue memiliki list yang dapat membesar.
- [ ] Tenant isolation dipertahankan.
- [ ] Tidak ada secret Moodle yang mencapai browser/log.
- [ ] Tidak ada dead code dan tidak ada `any` tanpa penjelasan.
- [ ] TypeScript, Biome, test, dan build lulus.


---

# ISSUE 20 — Question Bank melalui local_examapi

## Dependensi

Issue 19 + plugin `local_examapi` tersedia

## Tujuan

Membangun question bank administration yang independen dari internals form Moodle dan mengakses custom Moodle API hanya melalui infrastructure adapter.

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

- DTO: request/response/query/list.
- Entity/rules/types/validator question.
- Use cases: list, detail, create, update, delete; import bila API plugin tersedia.
- Infrastruktur menerjemahkan ke `local_exam_get_question_bank`, `local_exam_create_question`, `local_exam_update_question`, `local_exam_delete_question`, `local_exam_import_questions`.
- Nama `local_exam_*` tidak boleh muncul di domain/application/presentation.
- UI: filter, pagination, Skeleton, EmptyState, action menu, create/edit form, delete confirmation.

## Strategi TDD

### RED
- Query/filter/pagination.
- Validation tiap question type yang didukung.
- Create/update/delete mapping.
- Plugin unavailable/version mismatch ditangani terkontrol.

### GREEN
Implementasikan domain → adapter → API → UI.

### REFACTOR
Isolasi plugin contract pada mapper/repository.

## Kriteria penerimaan

- Question bank bekerja tanpa coupling ke Moodle form internals.
- Plugin contract terisolasi di infrastructure.
- Admin table mengikuti shared pattern.
- Test domain/application/adapter lulus.

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

- [ ] Scope issue selesai tanpa pekerjaan tersembunyi dari issue berikutnya.
- [ ] RED test dibuat terlebih dahulu untuk perilaku baru/bug yang relevan.
- [ ] GREEN dicapai dengan implementasi minimum yang benar.
- [ ] REFACTOR dilakukan tanpa mematahkan boundary arsitektur.
- [ ] Domain/application tests lulus.
- [ ] Adapter/infrastructure tests lulus bila relevan.
- [ ] Loading/Empty/Error state tersedia bila issue memiliki UI.
- [ ] Pagination tersedia bila issue memiliki list yang dapat membesar.
- [ ] Tenant isolation dipertahankan.
- [ ] Tidak ada secret Moodle yang mencapai browser/log.
- [ ] Tidak ada dead code dan tidak ada `any` tanpa penjelasan.
- [ ] TypeScript, Biome, test, dan build lulus.


---

# ISSUE 21 — Exam Administration: create, settings, questions, randomisasi, dan preview

## Dependensi

Issue 20 + custom plugin function tersedia

## Tujuan

Membangun administrasi ujian lengkap: create/update/delete/duplicate quiz, question selection, random questions, reorder, preview, dan participant configuration.

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

- Module `exam-administration` dengan repository port.
- Use cases: `CreateExamUseCase`, `UpdateExamUseCase`, `DeleteExamUseCase`, `DuplicateExamUseCase`, `AddQuestionToExamUseCase`, `RemoveQuestionFromExamUseCase`, `ReorderExamQuestionsUseCase`, `AddRandomQuestionUseCase`.
- Infrastructure mapping ke custom functions plugin yang sesuai.
- Jangan expose `local_exam_*` di luar infrastructure.
- Preview tidak boleh memodifikasi attempt nyata.
- UI admin mengikuti table/form pattern dan typed state.

## Strategi TDD

### RED
- Create/update/delete/duplicate.
- Add/remove/reorder question.
- Random question parameters.
- Preview read-only.
- Invalid exam/question id.

### GREEN
Implementasikan use cases, adapter, API, hooks, UI.

### REFACTOR
Pisahkan mutation sequence dari UI dan cegah partial-state yang tidak jelas.

## Kriteria penerimaan

- Semua operation exam admin memiliki error contract yang jelas.
- Reorder/random question deterministik pada contract request.
- Preview aman dan read-only.
- Test use case/adapter lulus.

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

- [ ] Scope issue selesai tanpa pekerjaan tersembunyi dari issue berikutnya.
- [ ] RED test dibuat terlebih dahulu untuk perilaku baru/bug yang relevan.
- [ ] GREEN dicapai dengan implementasi minimum yang benar.
- [ ] REFACTOR dilakukan tanpa mematahkan boundary arsitektur.
- [ ] Domain/application tests lulus.
- [ ] Adapter/infrastructure tests lulus bila relevan.
- [ ] Loading/Empty/Error state tersedia bila issue memiliki UI.
- [ ] Pagination tersedia bila issue memiliki list yang dapat membesar.
- [ ] Tenant isolation dipertahankan.
- [ ] Tidak ada secret Moodle yang mencapai browser/log.
- [ ] Tidak ada dead code dan tidak ada `any` tanpa penjelasan.
- [ ] TypeScript, Biome, test, dan build lulus.


---

# ISSUE 22 — Exam Monitoring dan tindakan pengawas

## Dependensi

Issue 21 + custom plugin monitor tersedia

## Tujuan

Membangun monitoring runtime ujian berbasis endpoint agregat dengan polling wajar serta tindakan force finish, reset, extend time, dan force logout.

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

- DTO/entity/status participant module `exam-monitor`.
- Use cases: monitor, active attempts, force finish, reset, extend time, force logout.
- Endpoint utama `GET /api/v1/exam-monitor/:quizId` dan attempts endpoint sesuai planning.
- Jangan polling Moodle per participant; plugin/backend harus mengembalikan agregat.
- Status minimal: active/started/not started/finished/disconnected atau last activity jika tersedia.
- Tindakan administratif wajib server-authorized dan menghasilkan event audit.
- Gunakan polling interval yang wajar; WebSocket bukan scope awal.

## Strategi TDD

### RED
- Aggregated monitor mapping.
- Participant status mapping.
- Force finish/reset/extend/logout valid dan unauthorized.
- Polling tidak memicu N+1 call per participant.
- Audit intent dihasilkan untuk mutation.

### GREEN
Implementasikan repository/API/hook/UI monitor.

### REFACTOR
Pisahkan polling coordinator dari presentational table/cards.

## Kriteria penerimaan

- Monitor tidak melakukan N+1 ke Moodle.
- Tindakan pengawas memiliki confirmation dan feedback state.
- Status update dapat direfresh secara konsisten.
- Semua mutation siap diaudit.

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

- [ ] Scope issue selesai tanpa pekerjaan tersembunyi dari issue berikutnya.
- [ ] RED test dibuat terlebih dahulu untuk perilaku baru/bug yang relevan.
- [ ] GREEN dicapai dengan implementasi minimum yang benar.
- [ ] REFACTOR dilakukan tanpa mematahkan boundary arsitektur.
- [ ] Domain/application tests lulus.
- [ ] Adapter/infrastructure tests lulus bila relevan.
- [ ] Loading/Empty/Error state tersedia bila issue memiliki UI.
- [ ] Pagination tersedia bila issue memiliki list yang dapat membesar.
- [ ] Tenant isolation dipertahankan.
- [ ] Tidak ada secret Moodle yang mencapai browser/log.
- [ ] Tidak ada dead code dan tidak ada `any` tanpa penjelasan.
- [ ] TypeScript, Biome, test, dan build lulus.


---

# ISSUE 23 — Audit log operasional SaaS

## Dependensi

Issue 22

## Tujuan

Menerapkan audit event lintas tenant untuk aksi administrasi dan lifecycle penting tanpa menyimpan secret atau payload jawaban siswa secara berlebihan.

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

- Gunakan model `SaasAuditLog` yang sudah dibuat.
- Contract event minimal: `tenantId`, `actorId`, `action`, `entityType`, `entityId`, `requestId`, optional metadata, `createdAt`.
- Action minimum: tenant create/update; user create/update; exam create/update/delete; attempt started/submitted/force-finished/reset/time-extended; user force logout; question create/update/delete.
- Integrasikan audit di boundary aplikasi yang tepat sehingga event tidak hilang akibat UI-only logic.
- Metadata harus disanitasi; jangan log token/password/raw answer siswa.

## Strategi TDD

### RED
- Event dibuat untuk mutation penting.
- Tenant/request/actor context terbawa.
- Sanitizer membuang secret/payload sensitif.
- Failure audit tidak menimbulkan kebocoran data; behavior failure harus didefinisikan.

### GREEN
Implementasikan repository/use case/service audit dan integrasi.

### REFACTOR
Centralize action names/metadata sanitizer tanpa menciptakan event bus kompleks bila belum perlu.

## Kriteria penerimaan

- Audit dapat ditelusuri berdasarkan tenant/request/action.
- Tidak ada secret/raw student answer yang tidak perlu.
- Mutation utama menghasilkan event yang tepat.
- Test audit sanitizer/integration lulus.

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

- [ ] Scope issue selesai tanpa pekerjaan tersembunyi dari issue berikutnya.
- [ ] RED test dibuat terlebih dahulu untuk perilaku baru/bug yang relevan.
- [ ] GREEN dicapai dengan implementasi minimum yang benar.
- [ ] REFACTOR dilakukan tanpa mematahkan boundary arsitektur.
- [ ] Domain/application tests lulus.
- [ ] Adapter/infrastructure tests lulus bila relevan.
- [ ] Loading/Empty/Error state tersedia bila issue memiliki UI.
- [ ] Pagination tersedia bila issue memiliki list yang dapat membesar.
- [ ] Tenant isolation dipertahankan.
- [ ] Tidak ada secret Moodle yang mencapai browser/log.
- [ ] Tidak ada dead code dan tidak ada `any` tanpa penjelasan.
- [ ] TypeScript, Biome, test, dan build lulus.


---

# ISSUE 24 — Security hardening dan isolation regression suite

## Dependensi

Issue 23

## Tujuan

Mengeraskan sistem setelah feature MVP tersedia, terutama cookie/session, CSRF, rate limiting, tenant isolation, authorization, SSRF, upload, body limit, headers, dan secret handling.

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

- HttpOnly session dan Secure cookie production.
- SameSite policy yang konsisten.
- CSRF strategy untuk state-changing request.
- Tenant isolation regression tests lintas endpoint.
- Authorization tests admin/guru/siswa sesuai contract actor.
- Rate limiting login dan mutation admin sensitif.
- Moodle token encryption at rest.
- No token/browser exposure dan no credentials in logs.
- Security headers.
- Upload validation dan request body size limit.
- Server-side validation pada seluruh mutation.
- Review SSRF policy untuk tenant Moodle URL.

## Strategi TDD

### RED
Buat regression/security tests yang membuktikan celah sebelum memperbaikinya, termasuk:
- cross-tenant request;
- privilege violation;
- CSRF/mutation tanpa token/strategy yang valid;
- brute-force/rate limit;
- secret leakage;
- invalid upload/body size.

### GREEN
Implementasikan hardening minimum untuk menutup test.

### REFACTOR
Konsolidasikan middleware/helper tanpa membuat satu middleware raksasa.

## Kriteria penerimaan

- Cross-tenant access gagal secara konsisten.
- Sensitive mutation memiliki authorization + CSRF/rate policy yang sesuai.
- Secret scanning/log tests bersih.
- Security test suite lulus.

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

- [ ] Scope issue selesai tanpa pekerjaan tersembunyi dari issue berikutnya.
- [ ] RED test dibuat terlebih dahulu untuk perilaku baru/bug yang relevan.
- [ ] GREEN dicapai dengan implementasi minimum yang benar.
- [ ] REFACTOR dilakukan tanpa mematahkan boundary arsitektur.
- [ ] Domain/application tests lulus.
- [ ] Adapter/infrastructure tests lulus bila relevan.
- [ ] Loading/Empty/Error state tersedia bila issue memiliki UI.
- [ ] Pagination tersedia bila issue memiliki list yang dapat membesar.
- [ ] Tenant isolation dipertahankan.
- [ ] Tidak ada secret Moodle yang mencapai browser/log.
- [ ] Tidak ada dead code dan tidak ada `any` tanpa penjelasan.
- [ ] TypeScript, Biome, test, dan build lulus.


---

# ISSUE 25 — Performance, batching, caching, dan scalability guardrails

## Dependensi

Issue 24

## Tujuan

Mengoptimalkan akses Moodle dan UI management tanpa mengorbankan source-of-truth attempt aktif.

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

- Audit N+1 Moodle calls.
- Gunakan batch operations bila API mendukung.
- Jalankan independent reads secara parallel dengan batas wajar.
- Semua Moodle request memiliki bounded timeout.
- Cache hanya metadata yang aman/stabil.
- Jangan cache active attempt sebagai source of truth authoritative.
- Monitor endpoint tetap aggregated.
- Pagination pada tabel besar.
- Tambahkan pengukuran/telemetry sederhana untuk latency request penting jika core logger mendukung.

## Strategi TDD

### RED
- Test/benchmark sederhana yang membuktikan call count pada skenario list/monitor.
- Test cache tidak dipakai untuk active attempt source of truth.
- Test timeout/batch behavior.

### GREEN
Optimalkan hotspot nyata.

### REFACTOR
Hapus premature caching dan pastikan invalidation policy terdokumentasi.

## Kriteria penerimaan

- Tidak ada N+1 yang diketahui pada flow utama.
- Call count monitor tidak tumbuh linear per participant ke Moodle.
- Cache policy eksplisit.
- Pagination tersedia pada list besar.
- Verify/build/test tetap lulus.

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

- [ ] Scope issue selesai tanpa pekerjaan tersembunyi dari issue berikutnya.
- [ ] RED test dibuat terlebih dahulu untuk perilaku baru/bug yang relevan.
- [ ] GREEN dicapai dengan implementasi minimum yang benar.
- [ ] REFACTOR dilakukan tanpa mematahkan boundary arsitektur.
- [ ] Domain/application tests lulus.
- [ ] Adapter/infrastructure tests lulus bila relevan.
- [ ] Loading/Empty/Error state tersedia bila issue memiliki UI.
- [ ] Pagination tersedia bila issue memiliki list yang dapat membesar.
- [ ] Tenant isolation dipertahankan.
- [ ] Tidak ada secret Moodle yang mencapai browser/log.
- [ ] Tidak ada dead code dan tidak ada `any` tanpa penjelasan.
- [ ] TypeScript, Biome, test, dan build lulus.


---

# ISSUE 26 — E2E kritis, MVP release readiness, dan final architecture verification

## Dependensi

Issue 25

## Tujuan

Memvalidasi seluruh arsitektur dan flow kritis dari browser sampai Moodle sebelum MVP dinyatakan siap.

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

- E2E student flow: login → dashboard → course → exam → access → start/resume → answer → autosave → navigate → summary → submit → result/review.
- E2E admin flow: login → users/import → enrol → groups bila diperlukan → question bank → create exam → add questions → monitor → administrative action → result/export bila tersedia.
- Verifikasi final dependency direction dan tidak ada direct Moodle browser call.
- Verifikasi tidak ada direct SQL Moodle.
- Verifikasi DB SaaS tidak menduplikasi entity akademik.
- Verifikasi secret tidak masuk client bundle/log.
- Verifikasi MVP checklist dan feature Definition of Done.
- Dokumentasikan known limitation/non-goals yang tersisa.

## Strategi TDD

### RED
- Tulis E2E untuk critical path yang gagal pada gap yang masih ada.

### GREEN
- Perbaiki hanya gap yang menghalangi acceptance MVP dan berasal dari implementation issue sebelumnya.

### REFACTOR
- Stabilkan fixture/helper E2E dan hilangkan test flakiness tanpa melemahkan assertion.

## Kriteria penerimaan

- Critical student flow lulus E2E.
- Critical admin flow lulus E2E sesuai feature yang tersedia.
- Semua command quality gate lulus.
- Tidak ada pelanggaran architectural guardrail.
- MVP dapat dinyatakan siap berdasarkan checklist planning, bukan hanya karena UI terlihat selesai.

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

- [ ] Scope issue selesai tanpa pekerjaan tersembunyi dari issue berikutnya.
- [ ] RED test dibuat terlebih dahulu untuk perilaku baru/bug yang relevan.
- [ ] GREEN dicapai dengan implementasi minimum yang benar.
- [ ] REFACTOR dilakukan tanpa mematahkan boundary arsitektur.
- [ ] Domain/application tests lulus.
- [ ] Adapter/infrastructure tests lulus bila relevan.
- [ ] Loading/Empty/Error state tersedia bila issue memiliki UI.
- [ ] Pagination tersedia bila issue memiliki list yang dapat membesar.
- [ ] Tenant isolation dipertahankan.
- [ ] Tidak ada secret Moodle yang mencapai browser/log.
- [ ] Tidak ada dead code dan tidak ada `any` tanpa penjelasan.
- [ ] TypeScript, Biome, test, dan build lulus.


---

