# Issue 24 — Moodle Account Authentication Integration

## Nama Issue

`moodle-account-auth-integration`

## Bounded Engineering Objective

Mengintegrasikan autentikasi akun Moodle ke dalam alur login yang sudah ada (`LoginUseCase`, `AuthRepository`, dan `_factory.ts`) tanpa membuat duplikasi kode, memanfaatkan `MoodleClientFactory` / `MoodleRestClient` bawaan serta mendaftarkan konfigurasi `APP_SECRET` pada *environment validation*.

## Dependency

Issue 02 (Core Foundation) dan Issue tenant/auth sebelumnya selesai.

## Scope Pengerjaan

- [ ] Menambahkan variabel lingkungan `APP_SECRET` pada `.env.example` dan mendaftarkannya ke skrip validasi `scripts/validate-env.mjs`.
- [ ] Menambahkan method autentikasi akun pengguna Moodle pada `MoodleRestClient` (mengakses endpoint token dan informasi user Moodle).
- [ ] Menyesuaikan domain contract `IAuthRepository` dan `IMoodleClient` pada `src/modules/auth/domain/interfaces/AuthInterfaces.ts` tanpa membuat interface lokal di usecase/infrastructure.
- [ ] Memperbarui `LoginUseCase` agar memvalidasi kredensial pengguna langsung ke Moodle via instance client per-tenant, kemudian memetakan ke sesi lokal via `AuthRepository`.
- [ ] Menyesuaikan pembuatan instance pada `src/app/api/auth/_factory.ts` untuk menginjeksi `MoodleClientFactory` ke dalam `LoginUseCase` menggunakan enkripsi kredensial yang sudah ada.
- [ ] Menambahkan *unit test* terisolasi untuk skenario login berhasil dan login gagal (kredensial Moodle salah / user tidak ditemukan).

## Out of Scope

- Pembuatan UI login baru atau perombakan styling atom/molekul auth yang sudah ada.
- Modifikasi skema tabel Prisma selain field yang sudah terdefinisi.
- Fitur RBAC di luar penentuan role dasar hasil pemetaan atribut Moodle.

## Target Structure / Deliverables

- `.env.example`
- `scripts/validate-env.mjs`
- `src/core/moodle/MoodleRestClient.ts`
- `src/modules/auth/domain/interfaces/AuthInterfaces.ts`
- `src/modules/auth/application/usecases/LoginUseCase.ts`
- `src/modules/auth/infrastructure/repo/AuthRepository.ts`
- `src/app/api/auth/_factory.ts`
- `src/modules/auth/__tests__/application/LoginUseCase.test.ts`

## TDD Workflow

### RED

- [ ] Tulis failing test di `LoginUseCase.test.ts` untuk memverifikasi pemanggilan autentikasi Moodle melalui client factory dan penanganan kredensial Moodle yang tidak valid.
- [ ] Tulis failing test di `environmentConfiguration.test.ts` untuk memastikan ketiadaan `APP_SECRET` memicu kegagalan validasi environment.

### GREEN

- [ ] Daftarkan `APP_SECRET` pada `scripts/validate-env.mjs`.
- [ ] Perbarui `AuthInterfaces.ts`, sesuaikan implementasi `LoginUseCase.ts`, `AuthRepository.ts`, dan `_factory.ts` hingga semua test lolos (hijau).

### REFACTOR

- [ ] Pastikan tidak ada duplikasi fungsi HTTP fetch manual di luar `MoodleRestClient`.
- [ ] Pastikan tidak ada token Moodle, password mentah, atau raw exception yang terpapar di log maupun HTTP response payload.

## Acceptance Criteria

- [ ] Pengguna dapat terautentikasi menggunakan kredensial akun Moodle aktif.
- [ ] `APP_SECRET` tervalidasi saat boot aplikasi dan digunakan oleh *encryption provider* kredensial.
- [ ] Tidak ada duplikasi fungsi autentikasi atau bypass pemanggilan langsung dari browser ke Moodle.
- [ ] Semua dependensi domain auth tetap terpusat di `src/modules/auth/domain/interfaces/AuthInterfaces.ts`.
- [ ] Password dan Moodle token tidak bocor ke log atau serialisasi respons API.

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