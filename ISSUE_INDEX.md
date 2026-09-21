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
