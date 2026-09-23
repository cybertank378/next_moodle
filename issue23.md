# Issue 23 — Auth Module Structural Refactor

## Nama Issue

`auth-module-structure`

## Bounded Engineering Objective

Menata ulang `src/modules/auth` agar mengikuti struktur feature yang disepakati tanpa mengubah kontrak autentikasi, perilaku session, tenant isolation, atau bentuk respons API yang telah berjalan.

## Dependency

- Issue 06 — Authentication, Session & Actor Resolution Vertical Slice.
- PR UI auth harus sudah merge atau perubahan yang sama tersedia pada branch kerja agar integration test login tetap dapat dijalankan.

## Scope Pengerjaan

- [ ] Inventaris seluruh import dan public contract di `src/modules/auth` sebelum pemindahan.
- [ ] Pindahkan application code ke `application/services` dan `application/usecases` sesuai tanggung jawabnya.
- [ ] Pertahankan semua dependency port auth hanya di `domain/interfaces/AuthInterfaces.ts`.
- [ ] Konsolidasikan DTO, entity, mapper, dan validator domain pada struktur target.
- [ ] Tambahkan `builder`, `normalizers`, atau `types` hanya bila ada tanggung jawab auth nyata; tidak boleh membuat folder/file kosong.
- [ ] Ganti detail infrastructure auth yang saat ini tersebar pada provider menjadi implementasi di `infrastructure/repo/AuthRepository.ts`, atau pecahan repository yang jelas tanggung jawabnya.
- [ ] Pertahankan `infrastructure/http/AuthController.ts` dan `infrastructure/validators/auth.validator.ts` sebagai transport boundary.
- [ ] Pertahankan `presentation/hooks/useAuthApi.ts` sebagai satu-satunya akses browser ke BFF auth.
- [ ] Pindahkan dan perbarui test auth ke `__tests__/application`, `__tests__/domain`, `__tests__/infrastructure`, dan `__tests__/helpers`.
- [ ] Perbarui semua import aplikasi, API factory, route, dan server helper setelah pemindahan.
- [ ] Hapus file/folder lama hanya setelah semua referensi sudah bermigrasi dan test lulus.

## Target Structure

```text
src/modules/auth/
├── application/
│   ├── services/
│   │   └── AuthService.ts
│   └── usecases/
│       ├── GetCurrentSessionUseCase.ts
│       ├── LoginUseCase.ts
│       ├── LogoutAllUseCase.ts
│       ├── LogoutUseCase.ts
│       └── RefreshSessionUseCase.ts
├── domain/
│   ├── builder/                 # hanya bila ada query/rule builder auth nyata
│   ├── dto/
│   │   ├── AuthRequestDto.ts
│   │   └── AuthResponseDto.ts
│   ├── entity/
│   │   └── AuthSessionEntity.ts
│   ├── interfaces/
│   │   └── AuthInterfaces.ts
│   ├── mapper/
│   │   └── AuthMapper.ts
│   ├── normalizers/             # hanya bila ada normalisasi auth nyata
│   ├── types/                   # hanya bila ada metadata auth nyata
│   └── validators/
│       └── AuthValidator.ts
├── infrastructure/
│   ├── http/
│   │   └── AuthController.ts
│   ├── repo/
│   │   └── AuthRepository.ts
│   └── validators/
│       └── auth.validator.ts
├── presentation/
│   └── hooks/
│       └── useAuthApi.ts
└── __tests__/
    ├── application/
    ├── domain/
    ├── infrastructure/
    └── helpers/
```

`server/getCurrentUser.ts` dan `server/requireDashboardRoles.ts` dapat tetap berada di `src/modules/auth/server/` karena keduanya adalah adapter server/App Router, bukan domain, application, atau browser presentation hook.

## Explicit Migration Mapping

| Current responsibility | Target responsibility |
|---|---|
| `MoodleStudentAuthProvider` | private Moodle adapter inside `AuthRepository`; nama Moodle tidak boleh keluar ke domain/application |
| `PrismaTenantAuthResolver` | private tenant resolver inside `AuthRepository`; tenant scope tetap berasal dari trusted context |
| `EncryptedCookieSessionManager` | private session persistence inside `AuthRepository`; raw token tetap tidak bocor ke browser |
| `AuthController` | tetap `infrastructure/http/AuthController.ts` |
| `useAuthApi` | tetap `presentation/hooks/useAuthApi.ts` |

## Out of Scope

- Menambah login/register/password-reset/verify-email endpoint baru.
- Mengubah kontrak Moodle REST, token, credential encryption, atau cookie session.
- Mengubah permission, role, tenant isolation, dan ownership rule.
- Mengubah desain UI auth.
- Memindahkan auth ke `src/core` atau membuat barrel export.
- Menyimpan token Moodle, password, atau session secret di browser.

## TDD Workflow

### RED

- [ ] Tambahkan test import/contract yang gagal untuk setiap use case dan repository target.
- [ ] Tambahkan regression test login tenant success/failure, session refresh, logout, dan actor resolution sebelum pemindahan.
- [ ] Tambahkan test bahwa repository tidak mengekspos raw Moodle token atau credential.

### GREEN

- [ ] Pindahkan satu responsibility per langkah sambil memperbarui import dan test terkait.
- [ ] Pastikan `AuthService` dan use case hanya bergantung pada `AuthInterfaces.ts`.
- [ ] Pastikan route/controller tetap tipis dan tidak menyerap aturan bisnis.

### REFACTOR

- [ ] Hapus compatibility import/file lama setelah seluruh consumer pindah.
- [ ] Rapikan nama dan duplikasi tanpa mengubah behavior.
- [ ] Pastikan tidak ada project-authored barrel `index.ts`/`index.tsx`.

## Acceptance Criteria

- [ ] Struktur `src/modules/auth` sesuai target dan tidak memiliki folder kosong.
- [ ] Tidak ada `application/interfaces`, `infrastructure/interfaces`, atau interface dependency lokal pada use case.
- [ ] Semua port berada di `domain/interfaces/AuthInterfaces.ts`.
- [ ] Domain tidak mengimpor React, Next.js, Prisma, `fetch`, cookie, atau Moodle REST client.
- [ ] Browser hanya mengakses internal `/api/auth/*` melalui `useAuthApi`.
- [ ] Login, refresh, logout, logout-all, dan current-session tetap berperilaku sama.
- [ ] Tenant scope dan actor resolution tetap diuji.
- [ ] Raw Moodle token, credential, password, cookie secret, exception, dan stack trace tidak bocor ke browser.
- [ ] Semua import lama yang dipindah sudah dihapus; tidak ada path stale.

## Definition of Done

- [ ] RED → GREEN → REFACTOR terdokumentasi pada PR.
- [ ] `npm run typecheck` lulus.
- [ ] `npm run lint` lulus.
- [ ] `npm run test` lulus.
- [ ] `npm run build` lulus.
- [ ] Tidak ada pekerjaan Issue 24 atau feature auth baru yang dikerjakan lebih awal.
