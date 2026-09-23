# Issue 03 — RBAC & Public/Protected Route Boundary

## Nama Issue

`rbac-protected-public-boundary`

## Bounded Engineering Objective

Menerapkan model role/permission dan authentication boundary global `(protected)` tanpa membuat root route berdasarkan role.

## Dependency

Issue 02 selesai.

## Scope Pengerjaan

- [x] Implement `AppRole`, `Permission`, `RolePermissionMap`, authorization helpers.
- [x] Implement `src/app/(protected)/layout.tsx` sebagai authentication boundary.
- [x] TENANT/STUDENT wajib memiliki `tenantId` pada actor.
- [x] Tambahkan reusable server permission guard untuk resource pages.
- [x] Pastikan unauthorized API tetap 401/403 dan UI redirect tidak menggantikan API auth.
- [x] Test tenant spoofing dan ownership guard primitives.

## Out of Scope

- Feature CRUD.
- Role-specific root URL `/admin`, `/tenant`, `/student`.
- Dashboard content feature.

## Target Structure / Deliverables

- `src/core/rbac/*`
- `src/app/(protected)/layout.tsx`
- RBAC tests.

## TDD Workflow

### RED

- [x] Test role/permission matrix, tenant isolation, unauthenticated protected access harus gagal.

### GREEN

- [x] Implement guards minimum sampai test hijau.

### REFACTOR

- [x] Sederhanakan authorization helpers tanpa menyatukan authentication, authorization, tenant isolation, dan ownership menjadi satu fungsi besar.

## Acceptance Criteria

- [x] `(protected)` hanya authentication shell.
- [x] Page/API tetap melakukan permission guard spesifik.
- [x] TENANT/STUDENT tidak dapat override tenant dari payload.

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
