# Issue 06 — Authentication, Session & Actor Resolution Vertical Slice

## Nama Issue

`auth-session-actor`

## Bounded Engineering Objective

Membangun login/logout/current-session dan protected-shell integration dengan Moodle student/tenant authentication, app session aman, serta actor resolution yang siap RBAC.

## Dependency

Issue 05 selesai.

## Mandatory Vertical Slice Paths

Issue ini **wajib** menyentuh seluruh boundary feature yang relevan:

```text
src/modules/auth/
src/sections/auth/
src/app/api/auth/
src/app/(protected)/layout.tsx
src/app/(protected)/dashboard/page.tsx  # auth integration only; dashboard content issue berikutnya
src/app/(public)/login/
src/app/(public)/register/
src/app/(public)/forgot-password/
src/app/(public)/change-password/
```

Jika salah satu boundary di atas belum diperlukan untuk suatu operasi spesifik, dokumentasikan alasannya di issue; jangan diam-diam menghilangkan layer.

## Scope Pengerjaan

- [x] Domain auth contracts berada hanya di `AuthInterfaces.ts`.
- [x] Login use case resolve tenant, panggil Moodle `/login/token.php`, lalu `core_webservice_get_site_info`.
- [x] Raw Moodle user token dibungkus dalam signed/encrypted app session dan tidak dikirim ke JS browser.
- [x] Implement current-session/logout/logout-all/refresh sesuai session strategy yang dipilih.
- [x] Controller, API routes, hooks, login/register/forgot/change-password UI sesuai planning support.
- [x] Integrasikan `(protected)/layout.tsx` dengan `resolveCurrentActor()`.
- [x] Root page redirect ke `/login` atau `/dashboard` sesuai auth state.

## Out of Scope

- Tenant management CRUD.
- Course/quiz feature.
- Password reset behavior yang Moodle/backend belum mendukung; tandai blocked bila kontrak tidak ada.

## Target Structure / Deliverables

- Auth module lengkap, auth sections, auth API, public auth pages, protected layout integration.

## TDD Workflow

### RED

- [x] RED tests login success/failure, token non-exposure, tenant mismatch, session expiry, unauthorized protected access.

### GREEN

- [x] Implement flow minimum sampai test hijau.

### REFACTOR

- [x] Refactor session/actor mapping dan UI state tanpa membocorkan Moodle transport detail.

## Acceptance Criteria

- [x] Login menghasilkan app session aman.
- [x] Browser tidak menerima raw Moodle token.
- [x] Protected route dapat resolve actor.
- [x] Semua boundary auth yang relevan tercakup.

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
