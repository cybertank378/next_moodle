# Issue 23 — Auth Module Structural Refactor

## Nama Issue

`auth-module-structure`

## Bounded Engineering Objective

Menata ulang `src/modules/auth` agar mengikuti struktur feature yang disepakati tanpa mengubah kontrak autentikasi, perilaku session, tenant isolation, atau bentuk respons API yang telah berjalan.

## Dependency

- Issue 06 — Authentication, Session & Actor Resolution Vertical Slice.
- PR UI auth harus sudah merge atau perubahan yang sama tersedia pada branch kerja agar integration test login tetap dapat dijalankan.

## Scope Pengerjaan

- [x] Inventaris seluruh import dan public contract di `src/modules/auth` sebelum pemindahan.
- [x] Verifikasi application code sudah berada di `application/services` dan `application/usecases` sesuai tanggung jawabnya.
- [x] Pertahankan semua dependency port auth hanya di `domain/interfaces/AuthInterfaces.ts`.
- [x] Pertahankan DTO, entity, mapper, dan validator domain pada struktur target serta tambahkan coverage domain.
- [x] Tidak membuat `builder`, `normalizers`, atau `types` kosong karena tidak ada tanggung jawab auth nyata.
- [x] Konsolidasikan detail provider ke `infrastructure/repo/AuthRepository.ts`.
- [x] Pertahankan `infrastructure/http/AuthController.ts` dan `infrastructure/validators/auth.validator.ts` sebagai transport boundary.
- [x] Pertahankan `presentation/hooks/useAuthApi.ts` sebagai satu-satunya akses browser ke BFF auth.
- [x] Lengkapi test auth pada `__tests__/application`, `__tests__/domain`, `__tests__/infrastructure`, dan `__tests__/helpers`.
- [x] Perbarui API factory dan server actor resolver setelah pemindahan.
- [x] Hapus file provider lama dan folder `infrastructure/providers` setelah seluruh referensi bermigrasi.

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

- [x] Tambahkan test import/contract yang gagal untuk `AuthRepository` dan test struktur tanpa provider lama.
- [x] Tambahkan regression test login, session refresh, logout, logout-all, dan actor resolution.
- [x] Tambahkan test bahwa repository tidak mengekspos raw Moodle token atau credential.

### GREEN

- [x] Pindahkan tanggung jawab provider ke repository sambil memperbarui import dan test terkait.
- [x] Pastikan `AuthService` dan use case hanya bergantung pada `AuthInterfaces.ts`.
- [x] Pastikan route/controller tetap tipis dan tidak menyerap aturan bisnis.

### REFACTOR

- [x] Hapus compatibility import/file lama setelah seluruh consumer pindah.
- [x] Rapikan nama test dan tambahkan test struktur tanpa mengubah behavior.
- [x] Pastikan tidak ada project-authored barrel `index.ts`/`index.tsx`.

## Acceptance Criteria

- [x] Struktur `src/modules/auth` sesuai target dan tidak memiliki folder kosong.
- [x] Tidak ada `application/interfaces`, `infrastructure/interfaces`, atau interface dependency lokal pada use case.
- [x] Semua port berada di `domain/interfaces/AuthInterfaces.ts`.
- [x] Domain tidak mengimpor React, Next.js, Prisma, `fetch`, cookie, atau Moodle REST client.
- [x] Browser tetap mengakses internal `/api/auth/*` melalui `useAuthApi`.
- [x] Login, refresh, logout, logout-all, dan current-session tetap berperilaku sama.
- [x] Tenant scope dan actor resolution tetap diuji.
- [x] Raw Moodle token, credential, password, cookie secret, exception, dan stack trace tidak bocor ke browser.
- [x] Semua import lama yang dipindah sudah dihapus; tidak ada path stale.

## Definition of Done

- [x] RED → GREEN → REFACTOR terdokumentasi pada PR #59.
- [x] `npm run typecheck` lulus.
- [ ] `npm run lint` lulus.
- [x] `npm run test` lulus (213 test).
- [x] `npm run build` lulus.
- [x] Tidak ada pekerjaan Issue 24 atau feature auth baru yang dikerjakan lebih awal.

## Implementation Status

The infrastructure consolidation merged in PR #59. The remaining test/structure coverage is available for review in PR #60 and has not been merged. The full lint gate remains unchecked because the unrelated nested configuration at `.worktrees/issue-55/biome.json` causes `npm run lint` to fail before it analyzes the project.
