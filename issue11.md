# Issue 11 — Grades & Results Vertical Slice

## Nama Issue

`grades`

## Bounded Engineering Objective

Menampilkan hasil/nilai dengan Moodle review policy: TENANT tenant-scoped, STUDENT own-only.

## Dependency

Issue 10 selesai.

## Mandatory Vertical Slice Paths

Issue ini **wajib** menyentuh seluruh boundary feature yang relevan:

```text
src/modules/grades/
src/sections/grades/
src/app/api/grades/
src/app/(protected)/dashboard/results/
src/app/(protected)/dashboard/results/[id]/
```

Jika salah satu boundary di atas belum diperlukan untuk suatu operasi spesifik, dokumentasikan alasannya di issue; jangan diam-diam menghilangkan layer.

## Scope Pengerjaan

- [ ] Buat canonical module structure lengkap.
- [ ] Semua port di satu `domain/interfaces/GradesInterfaces.ts`.
- [ ] Implement `GetQuizGradeUseCase` beserta tests.
- [ ] Implement `GetCourseGradesUseCase` beserta tests.
- [ ] Implement `GetStudentResultUseCase` beserta tests.
- [ ] Implement infrastructure repository/provider/mapper/normalizer yang diperlukan.
- [ ] Implement controller dan API factory/routes.
- [ ] Implement presentation hook.
- [ ] Implement Atomic UI `atoms/molecules/organisms/pages` sesuai kebutuhan nyata.
- [ ] Implement protected page guard + composition.
- [ ] Tambahkan loading/error/empty state dan pagination jika list scalable.
- [ ] Tambahkan authorization + tenant/ownership tests.
- [ ] Verifikasi backend contract sebelum menggunakan Moodle function.

## Out of Scope

- Menghitung ulang grade di Next.js atau menyimpan authoritative grade copy.

## Target Structure / Deliverables

- `src/modules/grades/`
- `src/sections/grades/`
- `src/app/api/grades/`
- protected resource page(s)
- Unit/application/infrastructure/UI tests
- Contract mapping: Moodle gradebook / local_examapi result endpoint jika production-ready

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
