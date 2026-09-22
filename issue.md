# Issue 01 — Bootstrap & Architecture Guardrails

## Nama Issue

`bootstrap-architecture-guardrails`

## Bounded Engineering Objective

Menyiapkan baseline repository Next.js yang enforceable untuk seluruh issue berikutnya: App Router, TypeScript strict, Biome, Vitest, Prisma 7, path alias, folder root canonical, no-barrel policy, dan architecture guard tests yang dapat menolak pola terlarang secara otomatis.

## Dependency

- Tidak ada.

## Mandatory Paths

Issue ini **wajib** membentuk struktur folder dan config berikut:

```text
src/
├── app/
│   ├── (public)/          # placeholder; halaman publik dibuat issue berikutnya
│   ├── (protected)/       # placeholder; route RBAC dibagi di Issue 03
│   ├── api/               # placeholder; feature API routes ditambahkan per-issue
│   ├── layout.tsx         # root layout
│   └── page.tsx           # redirect-only entry
├── core/                  # primitive lintas-feature (diisi Issue 02)
├── modules/               # feature domain modules (diisi per feature issue)
├── sections/              # atomic UI sections (diisi per feature issue)
└── shared-ui/             # reusable UI primitives (skeleton, pagination, empty state)
```

`(admin)/(tenant)/(student)` route groups **tidak** dibuat di issue ini; dibuat di Issue 03 (RBAC).

## Scope Pengerjaan

- [ ] Validasi versi Next.js terpasang dan baca dokumentasi lokal `node_modules/next/dist/docs/` sebelum menulis code.
- [ ] Konfigurasi TypeScript strict (`strict: true`, tidak ada `any`, `@ts-ignore`, `@ts-nocheck`).
- [ ] Konfigurasi Biome (`biome.json`) dan tambahkan scripts quality gate (`typecheck`, `lint`, `lint:fix`, `test`, `build`) ke `package.json`.
- [ ] Konfigurasi Vitest + coverage baseline; pastikan minimal satu test architecture guard.
- [ ] Konfigurasi Prisma 7 untuk database SaaS metadata-only; generate client; validasi `prisma.config.ts`.
- [ ] Buat root structure: `src/app`, `src/core`, `src/modules`, `src/sections`, `src/shared-ui`.
- [ ] Buat route group placeholder `(public)` dan `(protected)` — tanpa `(admin)/(tenant)/(student)`.
- [ ] Tambahkan architecture guard tests yang menolak:
  - barrel project (`index.ts`/`index.tsx` re-export);
  - direct Moodle call dari UI/presentation/domain;
  - import infrastructure dari domain.
- [ ] Tambahkan path alias `@/` → `src/` (dan alias lain bila diperlukan) di `tsconfig.json`.
- [ ] Root `src/app/page.tsx` hanya melakukan redirect berdasarkan auth state; tidak ada feature bisnis.
- [ ] Root `src/app/layout.tsx` mendefinisikan layout global (font, metadata, provider minimal).

## Out of Scope

- Feature bisnis apa pun.
- Implementasi authentication lengkap.
- Moodle REST client production.
- Tenant CRUD.
- `(admin)/(tenant)/(student)` route groups (dikerjakan di Issue 03).

## Target Structure / Deliverables

- `package.json` — scripts `typecheck`, `lint`, `lint:fix`, `test`, `build` siap.
- `tsconfig.json` — `strict: true`, path alias `@/*` terdefinisi.
- `biome.json` — linting dan formatting terkonfigurasi.
- `vitest.config.ts` — test runner dan coverage threshold baseline.
- `prisma/schema.prisma` — model awal SaaS metadata-only; client ter-generate.
- `prisma.config.ts` — konfigurasi Prisma valid.
- `src/app/layout.tsx` — root layout global.
- `src/app/page.tsx` — redirect-only, tidak ada logika bisnis.
- `src/app/(public)/` — placeholder route group publik.
- `src/app/(protected)/` — placeholder route group protected.
- `src/__tests__/architecture/` — test suite architecture guard (no-barrel, forbidden imports).

## TDD Workflow

### RED

- [ ] Architecture test gagal ketika fixture membuat barrel `index.ts` yang meng-re-export project files.
- [ ] Architecture test gagal ketika fixture domain mengimport dari `infrastructure/`.
- [ ] Architecture test gagal ketika fixture UI mengimport Moodle adapter langsung.
- [ ] Route-group expectation test gagal sebelum folder `(public)` dan `(protected)` tersedia.

### GREEN

- [ ] Buat struktur folder dan config minimum sampai semua architecture tests hijau.
- [ ] Pastikan `npm run typecheck`, `npm run lint`, `npm run test`, dan `npm run build` lulus.

### REFACTOR

- [ ] Rapikan config dan alias tanpa melemahkan architecture rules; seluruh test tetap hijau.
- [ ] Hapus folder/file kosong yang tidak memiliki tanggung jawab nyata.

## Acceptance Criteria

- [ ] `npm run typecheck` lulus tanpa error.
- [ ] `npm run lint` lulus tanpa error.
- [ ] `npm run test` lulus; architecture guard tests ada dan hijau.
- [ ] `npm run build` berhasil.
- [ ] Tidak ada feature business prematur.
- [ ] `(public)` dan `(protected)` menjadi satu-satunya page route-group utama pada issue ini.
- [ ] Architecture guard dapat menangkap minimal: barrel export, forbidden domain→infrastructure import, dan UI→Moodle direct call.
- [ ] Prisma client ter-generate dan `prisma.config.ts` valid.
- [ ] Tidak ada `index.ts`/`index.tsx` project-authored barrel di `src/`.

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
