# Issue 16 — Exam Administration

## Nama Issue

**TENANT Exam Administration — Create, Configure, Questions, Randomization & Preview**

## Tujuan

Membangun module `exam-administration` untuk membuat dan mengelola konfigurasi ujian TENANT tanpa coupling UI ke Moodle quiz forms.

## Dependency

- [ ] Issue 15 selesai.
- [ ] Custom Moodle exam administration API tersedia/terverifikasi.

## Scope Pengerjaan

Features:

- create exam;
- update settings;
- delete/archive;
- duplicate;
- add/remove question;
- random question;
- reorder questions;
- preview;
- participant configuration sesuai backend capability.

Pages:

```text
/tenant/exams
/tenant/exams/[quizId]
```

## Out of Scope

- Student attempt runtime.
- Proctor monitoring.
- Reimplementasi Moodle quiz engine.

## Task Checklist

### Domain & Application

- [ ] Definisikan ExamAdministration DTO/entity/types.
- [ ] Definisikan repository interface.
- [ ] Implement `CreateExamUseCase`.
- [ ] Implement `UpdateExamUseCase`.
- [ ] Implement `DeleteExamUseCase`/archive sesuai contract.
- [ ] Implement `DuplicateExamUseCase`.
- [ ] Implement `AddQuestionToExamUseCase`.
- [ ] Implement `RemoveQuestionFromExamUseCase`.
- [ ] Implement `ReorderExamQuestionsUseCase`.
- [ ] Implement `AddRandomQuestionUseCase`.
- [ ] Implement preview/configuration read use case bila diperlukan.
- [ ] Apply exam permissions dan tenant isolation.

### Infrastructure

- [ ] Implement custom Moodle exam repository.
- [ ] Map internal DTO ke custom API payload.
- [ ] Map custom API response ke internal DTO.
- [ ] Validate question belongs to allowed context/category/tenant contract.
- [ ] Handle random/reorder errors safely.
- [ ] Custom function names hanya di infrastructure.

### API

- [ ] Implement ExamAdministrationController.
- [ ] Implement `/api/exams/_factory.ts`.
- [ ] Implement list/create route bila administration list membutuhkan endpoint terpisah.
- [ ] Implement detail/update/delete route.
- [ ] Implement question add/remove endpoints.
- [ ] Implement reorder endpoint.
- [ ] Implement random-question endpoint.
- [ ] Implement duplicate endpoint.
- [ ] Route tetap tipis.

### Presentation/UI

- [ ] Implement exam administration hook.
- [ ] Exam management table dengan Pagination/Skeleton/EmptyState.
- [ ] Create/edit exam form.
- [ ] Exam detail configuration view.
- [ ] Question selection UI.
- [ ] Reorder UI dengan accessible fallback selain drag-only bila drag digunakan.
- [ ] Random question configuration UI.
- [ ] Preview UI berbasis DTO internal.
- [ ] Destructive actions memakai confirmation.

### Security/RBAC

- [ ] `EXAM_CREATE` check.
- [ ] `EXAM_UPDATE` check.
- [ ] `EXAM_DELETE` check.
- [ ] Tenant ownership pada exam/question target.
- [ ] Request tenantId tidak override actor tenant.

### Tests

- [ ] Create permission + tenant isolation.
- [ ] Update permission + tenant isolation.
- [ ] Delete permission + tenant isolation.
- [ ] Duplicate exam.
- [ ] Add question.
- [ ] Remove question.
- [ ] Reorder validation.
- [ ] Random question validation.
- [ ] Cross-tenant question/exam rejected.
- [ ] Mapper custom API.
- [ ] UI list/loading/empty/form behaviors.

## TDD Workflow

### RED

- [ ] Tulis mutation permission/tenant-isolation/mapper tests terlebih dahulu.

### GREEN

- [ ] Implement exam administration vertical slice sampai flow utama lulus.

### REFACTOR

- [ ] Hindari god-service untuk seluruh quiz admin behavior.
- [ ] Jaga custom API specifics di infrastructure.
- [ ] Reuse question DTO hanya bila dependency direction tetap benar.

## Acceptance Criteria

- [ ] TENANT dapat mengelola exam tenant sendiri.
- [ ] Exam dapat disusun dari question bank melalui domain operation generik.
- [ ] Cross-tenant mutation ditolak.
- [ ] UI tidak menggunakan Moodle form internals.
- [ ] Moodle tetap menjalankan quiz engine sebenarnya.

## Definition of Done (DoD)

- [ ] Seluruh feature create/update/delete/duplicate/question/random/reorder yang masuk scope tersedia.
- [ ] Module/controller/factory/routes/hooks/pages lengkap.
- [ ] Mutation RBAC tests GREEN.
- [ ] Tenant isolation tests GREEN.
- [ ] Mapper tests GREEN.
- [ ] Management table UI standard terpenuhi.
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
