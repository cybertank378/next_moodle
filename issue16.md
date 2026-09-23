# Issue 16 — Exam Administration Vertical Slice

## Nama Issue

`exam-administration`

## Bounded Engineering Objective

Mengelola komposisi exam/quiz yang didukung backend tanpa mengarang full quiz lifecycle endpoint.

## Dependency

Issue 15 selesai.

## Mandatory Vertical Slice Paths

Issue ini **wajib** menyentuh seluruh boundary feature yang relevan:

```text
src/modules/exam-administration/
src/sections/exam-administration/
src/app/api/exam-administration/
src/app/(protected)/dashboard/exams/
src/app/(protected)/dashboard/exams/create/
src/app/(protected)/dashboard/exams/[id]/
src/app/(protected)/dashboard/exams/[id]/edit/
```

Jika salah satu boundary di atas belum diperlukan untuk suatu operasi spesifik, dokumentasikan alasannya di issue; jangan diam-diam menghilangkan layer.

## Scope Pengerjaan

- [ ] Buat canonical module structure lengkap.
- [ ] Semua port di satu `domain/interfaces/ExamAdministrationInterfaces.ts`.
- [ ] Implement `GetExamQuestionsUseCase` beserta tests.
- [ ] Implement `AddQuestionToExamUseCase` beserta tests.
- [ ] Implement `RemoveQuestionFromExamUseCase` beserta tests.
- [ ] Implement `ReorderExamQuestionsUseCase` beserta tests.
- [ ] Implement `AddRandomQuestionsUseCase` beserta tests.
- [ ] Implement infrastructure repository/provider/mapper/normalizer yang diperlukan.
- [ ] Implement controller dan API factory/routes.
- [ ] Implement presentation hook.
- [ ] Implement Atomic UI `atoms/molecules/organisms/pages` sesuai kebutuhan nyata.
- [ ] Implement protected page guard + composition.
- [ ] Tambahkan loading/error/empty state dan pagination jika list scalable.
- [ ] Tambahkan authorization + tenant/ownership tests.
- [ ] Verifikasi backend contract sebelum menggunakan Moodle function.

## Out of Scope

- Create/update/delete/duplicate quiz lifecycle bila belum terdaftar production-ready.

## Target Structure / Deliverables

- `src/modules/exam-administration/`
- `src/sections/exam-administration/`
- `src/app/api/exam-administration/`
- protected resource page(s)
- Unit/application/infrastructure/UI tests
- Contract mapping: local_examapi quiz composition functions only; feature unavailable marked BACKEND_BLOCKED

## TDD Workflow

### RED

- [ ] Tulis failing domain/use-case tests untuk happy path + validation + authorization.
- [ ] Tulis failing repository contract tests untuk Moodle/Prisma mapping.
- [ ] Tulis failing section/page behavior tests untuk loading/error/empty/permission state.

### GREEN

- [ ] Implement minimum vertical slice dari domain hingga protected page.
- [ ] Tidak boleh menunda section/API/page ke issue lain untuk feature ini.

### REFACTOR

- [ ] Rapikan mapper/normalizer/query builder/components tanpa mengubah behavior.
- [ ] Pastikan domain tetap bebas transport/framework detail.

## Acceptance Criteria

- [ ] Feature dapat digunakan end-to-end dari protected page → internal API → controller → use case → repository.
- [ ] Semua empat boundary feature tersedia.
- [ ] Authorization/tenant/ownership sesuai actor.
- [ ] Moodle detail tidak bocor ke UI.
- [ ] Tidak ada pekerjaan out-of-scope yang disisipkan.

## Global Constraints

- **1 issue = 1 bounded engineering objective.** Jangan mengerjakan objective issue berikutnya untuk menyelesaikan issue aktif.
- TDD wajib **RED → GREEN → REFACTOR**. Production code tidak ditulis sebelum failing test yang relevan tersedia untuk behavior baru/bug fix.
- TypeScript `strict`; hindari `any`, `@ts-ignore`, `@ts-nocheck`, dan suppression luas.
- Biome wajib konsisten.
- Tidak menggunakan barrel export `index.ts` / `index.tsx` untuk re-export project.
- Domain tidak boleh import React, Next.js, Prisma, `fetch`, Moodle client, atau infrastructure.
- Semua dependency contract milik feature berada pada satu file `src/modules/{feature}/domain/interfaces/{Feature}Interfaces.ts`.
- Dilarang membuat `application/interfaces`, `infrastructure/interfaces`, `presentation/interfaces`, atau interface dependency lokal di file use case.
- Application/use case hanya bergantung pada domain contract; infrastructure mengimplementasikan domain contract.
- Browser tidak pernah memanggil Moodle langsung.
- Next.js tidak pernah direct SQL ke database Moodle.
- Moodle tetap source of truth untuk user akademik, enrolment, course, quiz, question, attempt, answer, review, dan grade.
- Token Moodle, credential, password, session secret, raw exception, dan stack trace tidak boleh bocor ke browser/log.
- `route.ts` harus tipis: parse input → resolve actor/context → controller → standardized response.
- Nama fungsi Moodle (`core_*`, `mod_quiz_*`, `local_examapi_*`) hanya boleh muncul di infrastructure adapter/repository/provider.
- Page `src/app/(protected)/dashboard/**/page.tsx` harus tipis dan hanya melakukan guard + composition.
- TENANT/STUDENT tenant scope berasal dari trusted session/current actor, bukan request body/query.
- STUDENT own-resource selalu memerlukan ownership enforcement.
- Feature list/table memakai Pagination, Skeleton, dan EmptyState sesuai shared component yang ada; EmptyState tidak boleh menutup header/filter/table header.
- Jangan membuat folder/abstraction kosong hanya untuk memenuhi template.

## Verification

Jalankan minimal:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Jika issue menyentuh subset test tertentu, jalankan subset tersebut selama RED/GREEN lalu tetap jalankan quality gate penuh sebelum issue dinyatakan selesai.

## Completion Report

Saat selesai, laporkan:

1. failing test yang membuktikan fase **RED**;
2. implementasi minimum pada fase **GREEN**;
3. refactor yang dilakukan tanpa mengubah behavior;
4. file/path yang berubah;
5. hasil `typecheck`, `lint`, `test`, dan `build`;
6. blocker/backend contract yang belum tersedia, bila ada;
7. konfirmasi bahwa tidak ada pekerjaan issue berikutnya yang dikerjakan lebih awal.
