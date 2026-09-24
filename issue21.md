# Issue 21 — Performance & Resilience

## Nama Issue

`performance-resilience`

## Bounded Engineering Objective

Meningkatkan performa dan ketahanan tanpa mengubah source-of-truth: bounded parallelism, pagination, N+1 prevention, safe cache, timeout/retry policy, dan observability.

## Dependency

Issue 20 selesai.

## Scope Pengerjaan

- [ ] Audit Moodle N+1 dan query fan-out.
- [ ] Enforce server-side pagination pada list besar.
- [ ] Bounded parallel reads bila benar-benar diperlukan.
- [ ] Cache hanya metadata/read-safe data, tidak authoritative attempt/answer/grade state.
- [ ] Timeout budgets per operation class.
- [ ] Retry hanya safe/idempotent operation.
- [ ] Request/correlation tracing dan metrics dasar.
- [ ] Regression tests untuk timeout, retry, stale cache, pagination bounds.

## Out of Scope

- Mengubah semantics feature.
- Membuat mirror database Moodle.

## Target Structure / Deliverables

- Performance/resilience policy dan tests.

## TDD Workflow

### RED

- [ ] Benchmark/regression test menunjukkan masalah atau expected budget terlebih dahulu.

### GREEN

- [ ] Implement optimisasi minimum.

### REFACTOR

- [ ] Refactor tanpa mengorbankan readability dan correctness.

## Acceptance Criteria

- [ ] Tidak ada unsafe mutation retry.
- [ ] Tidak ada attempt/grade authoritative cache.
- [ ] Monitoring tidak melakukan N+1 per peserta.

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
