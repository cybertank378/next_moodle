# Issue 11 — Quiz Attempts Core

## Nama Issue

**Quiz Attempt Lifecycle Core — Start, Load, Autosave, Summary, Submit & Review**

## Tujuan

Membangun domain paling kritis untuk lifecycle attempt STUDENT dengan Moodle tetap menjadi source of truth, serta menerapkan permission + ownership pada setiap own-resource operation.

## Dependency

- [ ] Issue 10 selesai.

## Scope Pengerjaan

Use cases:

```text
GetUserQuizAttemptsUseCase
StartQuizAttemptUseCase
GetQuizAttemptUseCase
SaveQuizAnswerUseCase
GetQuizAttemptSummaryUseCase
SubmitQuizAttemptUseCase
GetQuizAttemptReviewUseCase
```

API:

```text
POST  /api/quizzes/[quizId]/attempts
GET   /api/attempts/[attemptId]
PATCH /api/attempts/[attemptId]/answers
GET   /api/attempts/[attemptId]/summary
POST  /api/attempts/[attemptId]/submit
GET   /api/attempts/[attemptId]/review
```

## Out of Scope

- Rich exam UI (Issue 12).
- Monitoring/proctor mutation (Issue 17).
- SaaS DB copy of answers/grade.

## Target Struktur / Deliverables

```text
src/modules/quiz-attempts/
├── application/
│   ├── services/QuizAttemptService.ts
│   └── usecases/*.ts
├── domain/
│   ├── dto/*.ts
│   ├── entity/QuizAttemptEntity.ts
│   ├── interfaces/QuizAttemptRepositoryInterface.ts
│   ├── mapper/QuizAttemptMapper.ts
│   ├── types/*.ts
│   └── value-object/*          # hanya bila ada kebutuhan nyata
├── infrastructure/
│   ├── http/QuizAttemptController.ts
│   ├── repo/QuizAttemptRepository.ts
│   └── validators/quizAttemptValidator.ts
└── presentation/hooks/useQuizAttemptApi.ts

src/app/api/attempts/
├── _factory.ts
└── [attemptId]/...
```

## Task Checklist

### Domain

- [ ] Definisikan attempt state/types.
- [ ] Definisikan answer DTO/value representation.
- [ ] Definisikan start/save/summary/review DTO.
- [ ] Definisikan ownership rule/helper.
- [ ] Definisikan repository interface tanpa nama Moodle function.
- [ ] Definisikan validator untuk IDs/answer payload.

### Application

- [ ] Implement `GetUserQuizAttemptsUseCase`.
- [ ] Implement `StartQuizAttemptUseCase`.
- [ ] Implement `GetQuizAttemptUseCase`.
- [ ] Implement `SaveQuizAnswerUseCase`.
- [ ] Implement `GetQuizAttemptSummaryUseCase`.
- [ ] Implement `SubmitQuizAttemptUseCase`.
- [ ] Implement `GetQuizAttemptReviewUseCase`.
- [ ] Enforce `ATTEMPT_*_OWN` permission.
- [ ] Enforce actor tenantId.
- [ ] Enforce attempt ownership.
- [ ] Prevent operation pada state yang tidak valid.

### Infrastructure

- [ ] Integrasikan `mod_quiz_get_user_quiz_attempts`.
- [ ] Integrasikan attempt access information.
- [ ] Integrasikan `mod_quiz_start_attempt`.
- [ ] Integrasikan `mod_quiz_get_attempt_data`.
- [ ] Integrasikan `mod_quiz_save_attempt`.
- [ ] Integrasikan `mod_quiz_get_attempt_summary`.
- [ ] Integrasikan `mod_quiz_process_attempt`.
- [ ] Integrasikan `mod_quiz_get_attempt_review`.
- [ ] Moodle-specific answer parameter names tetap di infrastructure.
- [ ] Map Moodle question/attempt state ke internal DTO.

### API

- [ ] Implement QuizAttemptController.
- [ ] Implement `_factory.ts`.
- [ ] Implement start route pada quiz.
- [ ] Implement load attempt route.
- [ ] Implement save answers route.
- [ ] Implement summary route.
- [ ] Implement submit route.
- [ ] Implement review route.

### Presentation Hook

- [ ] Implement `useQuizAttemptApi`.
- [ ] Expose typed start/load/save/summary/submit/review methods.
- [ ] Jangan expose Moodle token.

### Tests — Start

- [ ] Valid start.
- [ ] Access denied.
- [ ] Invalid quiz ID.
- [ ] Wrong tenant.
- [ ] Actor/attempt ownership mismatch.

### Tests — Load

- [ ] Mapping question data.
- [ ] Preserve attempt state.
- [ ] Finished attempt behavior.
- [ ] Invalid actor.

### Tests — Autosave

- [ ] Valid answer.
- [ ] Invalid payload.
- [ ] Transient error mapping.
- [ ] Duplicate/stale behavior sesuai Moodle contract.
- [ ] Moodle parameter names tidak bocor ke domain.

### Tests — Submit/Review

- [ ] Valid final submit.
- [ ] Duplicate submit behavior.
- [ ] Expired attempt.
- [ ] Ownership mismatch.
- [ ] Review denied by Moodle policy.

## TDD Workflow

### RED

- [ ] Setiap use case dimulai dengan failing test.
- [ ] Ownership dan cross-tenant regression tests dibuat sebelum repository call.

### GREEN

- [ ] Implement minimum domain/application/repository/controller/API sampai seluruh lifecycle tests lulus.

### REFACTOR

- [ ] Centralize ownership checks.
- [ ] Hilangkan coupling ke Moodle field names dari application/domain.
- [ ] Jaga attempt dan quiz sebagai module terpisah.

## Acceptance Criteria

- [ ] STUDENT dapat start/resume/load/save/summary/submit/review sesuai Moodle policy.
- [ ] Semua own-resource operation memakai permission + ownership rule.
- [ ] Cross-tenant attempt ditolak.
- [ ] Answers tetap authoritative di Moodle.
- [ ] Tidak ada answer authoritative copy di SaaS DB.

## Definition of Done (DoD)

- [ ] Seluruh use case lifecycle tersedia.
- [ ] Repository/mapper/controller/API/hook lengkap.
- [ ] Start/load/autosave/submit/review tests GREEN.
- [ ] Ownership tests GREEN.
- [ ] Tenant isolation tests GREEN.
- [ ] No raw Moodle token/payload leak.
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
