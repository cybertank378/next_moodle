# Issue 13 — Grades & Results

## Nama Issue

**Grades, Results & Moodle Review-Policy Enforcement for STUDENT/TENANT**

## Tujuan

Membangun module grades/results untuk STUDENT dan TENANT dengan Moodle tetap authoritative terhadap nilai dan visibility review/correctness.

## Dependency

- [ ] Issue 12 selesai.

## Scope Pengerjaan

Pages:

```text
/student/results
/student/results/[quizId]
/tenant/results
```

Use cases minimum:

```text
GetQuizGradeUseCase
GetCourseGradesUseCase
```

Tambahkan use case/query lain hanya bila benar-benar diperlukan oleh page result.

## Out of Scope

- Menghitung ulang nilai di Next.js.
- Menyimpan authoritative grade di SaaS DB.
- Membuka correctness ketika Moodle review option melarang.

## Task Checklist

### Domain & Application

- [ ] Definisikan grade/result DTO/entity/types.
- [ ] Definisikan grade repository interface.
- [ ] Implement `GetQuizGradeUseCase`.
- [ ] Implement `GetCourseGradesUseCase`.
- [ ] STUDENT hanya dapat membaca nilai sendiri.
- [ ] TENANT hanya dapat membaca result tenant sendiri.
- [ ] Enforce Moodle review visibility policy.
- [ ] Model state not-graded/pending/finished dengan eksplisit.

### Infrastructure

- [ ] Implement Moodle grade/review repository melalui adapter.
- [ ] Map grade values ke internal DTO.
- [ ] Map review visibility/correctness flags.
- [ ] Handle missing grade/not-yet-graded secara aman.

### API

- [ ] Implement GradeController.
- [ ] Implement `/api/grades/_factory.ts`.
- [ ] Implement grade routes yang dibutuhkan.
- [ ] Integrasikan `/api/quizzes/[quizId]/grade` bila contract planning menggunakannya.
- [ ] Apply actor/tenant/ownership checks.

### Presentation & Sections

- [ ] Implement `useGradeApi`.
- [ ] Student result list.
- [ ] Student result detail.
- [ ] Tenant result list/table.
- [ ] Skeleton loading.
- [ ] EmptyState.
- [ ] ErrorState.
- [ ] Pagination/filter pada tenant result list bila scalable.
- [ ] Jangan render answer correctness jika policy melarang.

### Tests

- [ ] STUDENT own grade success.
- [ ] STUDENT other-user grade forbidden.
- [ ] TENANT own tenant result success.
- [ ] Cross-tenant result forbidden.
- [ ] Review correctness hidden jika Moodle melarang.
- [ ] Review correctness visible jika Moodle mengizinkan.
- [ ] Not-yet-graded state.
- [ ] Finished state.
- [ ] Empty result state.

## TDD Workflow

### RED

- [ ] Tulis authorization/review-policy tests sebelum implementation.

### GREEN

- [ ] Implement grade vertical slice dan role-specific UI.

### REFACTOR

- [ ] Centralize review policy mapping.
- [ ] Jangan duplicate grade calculation di UI.

## Acceptance Criteria

- [ ] Moodle tetap authoritative untuk nilai.
- [ ] Student hanya membaca result sendiri.
- [ ] Tenant hanya membaca result tenant sendiri.
- [ ] Correctness/review mengikuti Moodle settings.
- [ ] Pending/not-graded ditampilkan sebagai state, bukan error generik.

## Definition of Done (DoD)

- [ ] Grade use cases/repository/controller/API/hook lengkap.
- [ ] Student dan tenant result pages tersedia.
- [ ] Ownership dan tenant isolation tests GREEN.
- [ ] Review policy tests GREEN.
- [ ] Tidak ada authoritative grade copy di SaaS DB.
- [ ] `npm run typecheck` lulus.
- [ ] `npm run lint` lulus.
- [ ] `npm run test` lulus.
- [ ] `npm run build` lulus.
- [ ] Tidak ada barrel export.

## Global Constraints

Checklist berikut berlaku selama pengerjaan issue ini:

- [ ] Mengikuti **TDD RED → GREEN → REFACTOR** untuk behavior yang dapat diuji.
- [ ] TypeScript `strict` tetap aktif dan tidak dimatikan untuk melewati error.
- [ ] Semua error/warning Biome yang terkait perubahan diselesaikan.
- [ ] Tidak ada direct call **browser → Moodle**.
- [ ] Tidak ada direct SQL dari Next.js ke database Moodle.
- [ ] Moodle token, password, credential, secret, atau stack trace tidak masuk response browser maupun log.
- [ ] Route handler tetap tipis: parse request → resolve context → panggil controller/factory → return response.
- [ ] Business rule berada di domain/application, bukan di `route.ts` atau komponen UI.
- [ ] Authorization tidak mengandalkan UI hiding.
- [ ] Tenant isolation diperiksa untuk seluruh operasi tenant-scoped.
- [ ] Ownership diperiksa untuk seluruh resource milik STUDENT.
- [ ] External Moodle response dimapping sebelum masuk ke application/domain.
- [ ] Nama fungsi Moodle (`core_*`, `mod_quiz_*`, `local_examapi_*`) tidak bocor ke presentation/UI.
- [ ] Tidak membuat abstraction/folder kosong hanya untuk memenuhi template.
- [ ] **Dilarang membuat barrel `index.ts` / `index.tsx`; semua import menggunakan concrete file path.**

## Verification

Jalankan seluruh command berikut dan pastikan semuanya lulus:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Jika issue menambahkan integration/E2E test, jalankan command test tambahan yang relevan sebelum issue ditutup.
