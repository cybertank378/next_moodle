# Issue 10 — Quizzes & Access

## Nama Issue

**Quiz Listing, Quiz Detail & Authoritative Moodle Access Check**

## Tujuan

Membangun module `quizzes` untuk listing/detail ujian dan menentukan apakah STUDENT dapat memulai ujian berdasarkan hasil authoritative backend/Moodle, bukan perhitungan UI.

## Dependency

- [ ] Issue 09 selesai.

## Scope Pengerjaan

Use cases:

```text
GetCourseQuizzesUseCase
GetQuizDetailUseCase
GetQuizAccessUseCase
```

Access states:

```text
AVAILABLE
NOT_OPEN
CLOSED
ATTEMPT_LIMIT_REACHED
PASSWORD_REQUIRED
RESTRICTED
```

Pages:

```text
/student/exams
/student/exams/[quizId]
/tenant/exams
/tenant/exams/[quizId]
```

## Out of Scope

- Starting/saving/submitting attempt (Issue 11).
- Exam creation/mutation (Issue 16).
- Proctor monitoring (Issue 17).

## Task Checklist

### Domain & Application

- [ ] Definisikan Quiz entity/DTO/types.
- [ ] Definisikan access result DTO/state.
- [ ] Implement repository interface.
- [ ] Implement `GetCourseQuizzesUseCase`.
- [ ] Implement `GetQuizDetailUseCase`.
- [ ] Implement `GetQuizAccessUseCase`.
- [ ] Jangan menghitung access hanya dari client timestamp.
- [ ] Validate quiz-course-tenant relationship.

### Infrastructure

- [ ] Integrasikan `mod_quiz_get_quizzes_by_courses`.
- [ ] Integrasikan access information endpoint yang diperlukan.
- [ ] Integrasikan required qtypes check bila diperlukan.
- [ ] Map Moodle access reason ke internal access state.
- [ ] Map invalid quiz ke safe error.

### API

- [ ] Implement QuizController.
- [ ] Implement `/api/quizzes/_factory.ts`.
- [ ] Implement `/api/quizzes/[quizId]`.
- [ ] Implement `/api/quizzes/[quizId]/access`.
- [ ] Siapkan `/api/quizzes/[quizId]/attempts` boundary untuk Issue 11 tanpa business logic duplikat.

### Presentation & UI

- [ ] Implement `useQuizApi`.
- [ ] Student exam list.
- [ ] Student quiz detail.
- [ ] Tenant exam read/list/detail.
- [ ] Tampilkan access reason yang user-friendly tanpa raw Moodle exception.
- [ ] Enable “Mulai Ujian” hanya jika backend access state `AVAILABLE` atau state yang memang memungkinkan flow password.
- [ ] Loading/empty/error state.

### Security/RBAC

- [ ] Student quiz harus tenant-scoped.
- [ ] Student harus memiliki course/quiz access yang sah.
- [ ] Tenant tidak dapat membaca quiz tenant lain.
- [ ] API permission checks aktif.

### Tests

- [ ] AVAILABLE state.
- [ ] NOT_OPEN state.
- [ ] CLOSED state.
- [ ] ATTEMPT_LIMIT_REACHED state.
- [ ] PASSWORD_REQUIRED state.
- [ ] RESTRICTED state.
- [ ] Wrong tenant/course relation rejected.
- [ ] Invalid quiz safely mapped.
- [ ] Start button disabled untuk denied states.
- [ ] UI tidak merekonstruksi access rule dari timestamp saja.

## TDD Workflow

### RED

- [ ] Tulis access-state mapping/use-case/UI tests lebih dahulu.

### GREEN

- [ ] Implement quiz vertical slice dan access endpoint integration.

### REFACTOR

- [ ] Centralize access reason mapping.
- [ ] Jangan duplicate quiz DTO antara tenant/student jika contract sama.
- [ ] Jaga role-specific composition di sections/pages.

## Acceptance Criteria

- [ ] Quiz listing/detail tersedia untuk actor yang berhak.
- [ ] Access result berasal dari backend/Moodle authoritative rule.
- [ ] “Mulai Ujian” tidak aktif pada denied state.
- [ ] Cross-tenant/cross-course access ditolak.
- [ ] Raw Moodle error tidak tampil di UI.

## Definition of Done (DoD)

- [ ] Quiz domain/application/repository/controller/API/hook lengkap.
- [ ] Tenant/student quiz pages tersedia.
- [ ] Semua access state memiliki test.
- [ ] Permission/tenant isolation tests GREEN.
- [ ] Loading/empty/error UI tersedia.
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
