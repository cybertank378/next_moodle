# Issue 15 — Question Bank

## Nama Issue

**TENANT Question Bank via `local_examapi` Custom Moodle Adapter**

## Tujuan

Membangun question bank TENANT tanpa coupling ke Moodle form internals. Domain operation tetap generik, sedangkan custom Moodle function hanya diketahui infrastructure.

## Dependency

- [ ] Issue 14 selesai.
- [ ] Contract custom Moodle API question bank tersedia/terverifikasi.

## Scope Pengerjaan

Operations:

```text
GetQuestionsUseCase
GetQuestionDetailUseCase
CreateQuestionUseCase
UpdateQuestionUseCase
DeleteQuestionUseCase
ImportQuestionsUseCase   # jika custom API mendukung
```

Page:

```text
/tenant/questions
```

Infrastructure dapat menerjemahkan ke custom Moodle functions seperti:

```text
local_examapi_get_question_bank
local_examapi_create_question
local_examapi_update_question
local_examapi_delete_question
local_examapi_import_questions
```

Nama konkret mengikuti plugin contract aktual dan tidak boleh keluar dari infrastructure.

## Out of Scope

- Moodle core form rendering.
- Direct DB insert ke Moodle question tables.
- Exam composition (Issue 16).

## Task Checklist

### Domain

- [ ] Definisikan Question entity.
- [ ] Definisikan request/response/query/list DTO.
- [ ] Definisikan question type.
- [ ] Definisikan status/difficulty jika didukung contract.
- [ ] Definisikan repository interface generik.
- [ ] Definisikan validation rules per supported question type.

### Application

- [ ] Implement get list.
- [ ] Implement get detail.
- [ ] Implement create.
- [ ] Implement update.
- [ ] Implement delete.
- [ ] Implement import jika didukung.
- [ ] Apply QUESTION_* permissions.
- [ ] Apply tenant isolation.

### Infrastructure

- [ ] Implement custom Moodle question repository.
- [ ] Implement request mapper domain→custom API.
- [ ] Implement response mapper custom API→domain.
- [ ] Handle unsupported question type.
- [ ] Handle plugin error tanpa membocorkan raw exception.
- [ ] Pastikan custom function name hanya berada di infrastructure.

### API

- [ ] Implement QuestionController.
- [ ] Implement `/api/questions/_factory.ts`.
- [ ] Implement list/create route.
- [ ] Implement detail/update/delete route.
- [ ] Implement import route bila feature tersedia.

### Presentation/UI

- [ ] Implement `useQuestionApi`.
- [ ] Page header/stat/filter/search.
- [ ] Question table.
- [ ] Pagination.
- [ ] Skeleton.
- [ ] EmptyState.
- [ ] Create/edit form/modal/page.
- [ ] Delete confirmation.
- [ ] Question type form fields mengikuti supported schema.

### Tests

- [ ] Create authorization.
- [ ] Update authorization.
- [ ] Delete authorization.
- [ ] Cross-tenant question access rejected.
- [ ] Validation per question type.
- [ ] Unsupported question type rejected.
- [ ] Custom API mapper request.
- [ ] Custom API mapper response.
- [ ] Pagination/filter/query mapping.
- [ ] Plugin error mapping.

## TDD Workflow

### RED

- [ ] Tulis validation/use case/mapper/RBAC tests terlebih dahulu.

### GREEN

- [ ] Implement generic domain operations dan infrastructure translation.

### REFACTOR

- [ ] Pastikan tidak ada `local_examapi_*` string di domain/application/presentation.
- [ ] Extract question-type validation tanpa membuat hierarchy berlebihan.

## Acceptance Criteria

- [ ] TENANT dapat CRUD question sesuai permission.
- [ ] Cross-tenant question access ditolak.
- [ ] Question type validation konsisten.
- [ ] Custom Moodle function tidak bocor dari infrastructure.
- [ ] UI tidak tergantung Moodle form internals.

## Definition of Done (DoD)

- [ ] Question module vertical slice lengkap.
- [ ] Question page/table/form lengkap sesuai supported types.
- [ ] RBAC dan tenant isolation tests GREEN.
- [ ] Mapper tests GREEN.
- [ ] Unsupported type test GREEN.
- [ ] Tidak ada direct Moodle SQL/form coupling.
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
