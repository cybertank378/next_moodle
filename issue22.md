# Issue 22 — E2E, CI & Release Gate

## Nama Issue

`e2e-ci-release-gate`

## Bounded Engineering Objective

Menyertifikasi keseluruhan sistem melalui E2E kritis, negative security scenarios, CI quality gates, build production, dan release checklist.

## Dependency

Issue 21 selesai.

## Scope Pengerjaan

- [ ] E2E ADMIN tenant management flow.
- [ ] E2E TENANT users/enrolments/groups/questions/exams/monitor/results flow sesuai backend readiness.
- [ ] E2E STUDENT login/course/quiz/attempt/submit/result flow.
- [ ] Negative cross-tenant, ownership, role, direct API tampering tests.
- [ ] CI menjalankan typecheck/lint/test/build.
- [ ] Contract/preflight checks terhadap Moodle test environment.
- [ ] Production env validation dan secret checklist.
- [ ] Release blocker policy untuk security/regression failure.

## Out of Scope

- Feature baru.
- Menutup backend gap dengan mock lalu menganggap production-ready.

## Target Structure / Deliverables

- E2E suite, CI pipeline, release checklist/gate.

## TDD Workflow

### RED

- [ ] Tambahkan E2E/negative scenario yang gagal pada baseline yang belum tersertifikasi.

### GREEN

- [ ] Perbaiki hanya defect yang berada dalam scope release certification; defect besar harus menjadi issue baru.

### REFACTOR

- [ ] Stabilkan fixtures/test utilities tanpa melemahkan assertions.

## Acceptance Criteria

- [ ] Seluruh critical E2E lulus.
- [ ] CI gate tidak dapat di-bypass diam-diam.
- [ ] Backend-blocked capability tetap ditandai blocked, bukan dimock sebagai production success.

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
