# Issue 04 — Tenants — SaaS Metadata Management Vertical Slice

## Nama Issue

`tenants-metadata-management`

## Bounded Engineering Objective

Membangun tenant CRUD + encrypted credential record management sebagai satu vertical slice lengkap untuk operator platform, tanpa melakukan connection test Moodle pada issue ini.

## Dependency

Issue 03 selesai.

## Mandatory Vertical Slice Paths

Issue ini **wajib** menyentuh seluruh boundary feature yang relevan:

```text
src/modules/tenants/
src/sections/tenants/
src/app/api/tenants/
src/app/(protected)/dashboard/tenants/
src/app/(protected)/dashboard/tenants/create/
src/app/(protected)/dashboard/tenants/[id]/
src/app/(protected)/dashboard/tenants/[id]/edit/
```

Jika salah satu boundary di atas belum diperlukan untuk suatu operasi spesifik, dokumentasikan alasannya di issue; jangan diam-diam menghilangkan layer.

## Scope Pengerjaan

- [ ] Prisma models `Tenant`, `TenantCredential`, `TenantBranding` minimum yang dibutuhkan.
- [ ] Domain entity/DTO/builder/mapper/normalizer/types/validators tenant.
- [ ] Satu contract file `TenantsInterfaces.ts` untuk repository/credential ports yang digunakan use case.
- [ ] Use cases list/detail/create/update/status + credential configuration mutation tanpa exposing plaintext.
- [ ] Infrastructure Prisma repository + credential encryption provider placeholder contract-compatible.
- [ ] Controller + `_factory.ts` + API routes.
- [ ] Atomic UI table/form/detail pages dengan Pagination/Skeleton/EmptyState.
- [ ] Protected pages `/dashboard/tenants`, `/create`, `/[id]`, `/[id]/edit`.
- [ ] ADMIN permission enforcement.

## Out of Scope

- Test Moodle connection.
- General Moodle REST client.
- Course/user sync.

## Target Structure / Deliverables

- Complete tenants module vertical slice.
- Prisma migration untuk metadata tenant.
- Encrypted credential persisted server-side only.
- Management UI dan protected routes.

## TDD Workflow

### RED

- [ ] RED tests untuk CRUD, duplicate slug, encryption boundary, ADMIN-only authorization, tenant secret non-serialization.

### GREEN

- [ ] Implement vertical slice minimum sampai seluruh tests hijau.

### REFACTOR

- [ ] Refactor mapper/normalizer/query builder dan UI composition tanpa mengubah behavior.

## Acceptance Criteria

- [ ] Tenant CRUD dapat digunakan end-to-end melalui internal API.
- [ ] Secret tidak pernah muncul di response DTO/browser.
- [ ] Semua empat boundary feature tersedia.

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
