# Issue 05 — Moodle REST Adapter & Credential Security

## Nama Issue

`moodle-rest-adapter-security`

## Bounded Engineering Objective

Menyediakan satu server-only Moodle REST transport yang aman, tenant-aware, mampu nested form encoding, timeout, error normalization, safe-read retry, health/version/capability preflight, dan credential resolution dari tenant.

## Dependency

Issue 04 selesai.

## Scope Pengerjaan

- [ ] Implement `src/core/moodle/MoodleRestClient.ts` server-only.
- [ ] Implement nested Moodle parameter encoder.
- [ ] Implement timeout budget dan retry hanya untuk safe/idempotent reads.
- [ ] Implement Moodle error mapper tanpa raw exception leak.
- [ ] Implement `MoodleCredentialProvider` tenant-aware dari encrypted SaaS store.
- [ ] Implement `MoodleClientFactory` yang menerima validated tenant context.
- [ ] Implement health/API version/capabilities preflight terhadap `local_examapi`.
- [ ] SSRF/base URL validation dan TLS policy.
- [ ] Contract tests untuk `local_examapi` apiVersion/component.

## Out of Scope

- Feature page/UI.
- Authentication flow.
- Tenant CRUD tambahan.

## Target Structure / Deliverables

- `src/core/moodle/*` dan tests.
- Credential decryption path server-only.
- Compatibility/preflight result type.

## TDD Workflow

### RED

- [ ] RED tests untuk nested encoding, invalid token mapping, timeout, retry mutation prohibition, tenant token isolation, SSRF rejection, redaction.

### GREEN

- [ ] Implement minimum client/factory/provider sampai hijau.

### REFACTOR

- [ ] Refactor transport, mapping, and secret handling; no feature-specific logic in core client.

## Acceptance Criteria

- [ ] Tidak ada direct Moodle `fetch` di module lain.
- [ ] Token Tenant A tidak dapat dipakai untuk Tenant B.
- [ ] Missing required Moodle function menghasilkan incompatible state, bukan silent fallback.

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
