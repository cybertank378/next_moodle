# Issue 06 — Authentication, Session & Actor Resolution

## Nama Issue

**Authentication Module, Secure Session & Current Actor Resolution**

## Tujuan

Membangun module auth mengikuti pattern project, mengautentikasi actor melalui strategy yang tepat, menyimpan session secara aman, dan menghasilkan `CurrentActor` yang siap dipakai RBAC/tenant isolation.

## Dependency

- [ ] Issue 05 selesai.

## Scope Pengerjaan

Use cases:

```text
ChangePasswordUseCase
ForgotPasswordUseCase
GetCurrentSessionUseCase
LoginUseCase
LogoutAllUseCase
LogoutUseCase
RefreshTokenUseCase
RegisterUseCase
ResetPasswordUseCase
```

API:

```text
/api/auth/login
/api/auth/logout
/api/auth/logout-all
/api/auth/current-session
/api/auth/refresh
/api/auth/forgot
/api/auth/reset
/api/auth/change
/api/auth/register   # hanya jika policy deployment mengaktifkannya
```

Tenant/Student login menggunakan Moodle REST authentication. Platform ADMIN dapat menggunakan auth strategy platform yang terpisah tetapi tetap melalui auth port/module yang sama.

## Out of Scope

- Role-specific dashboard UI selain redirect target.
- Feature authorization selain session actor production integration.
- Penyimpanan password Moodle di SaaS database.

## Target Struktur / Deliverables

```text
src/modules/auth/
├── application/
│   ├── services/AuthService.ts
│   └── usecases/*.ts
├── domain/
│   ├── builder/AuthQueryBuilder.ts
│   ├── dto/AuthRequestDTO.ts
│   ├── dto/AuthResponseDTO.ts
│   ├── entity/*.ts
│   ├── interfaces/*.ts
│   ├── mapper/AuthMapper.ts
│   ├── types/AuthJwtPayload.ts
│   └── value-object/RefreshToken.ts
├── infrastructure/
│   ├── http/AuthController.ts
│   ├── providers/*.ts
│   ├── repo/*.ts
│   ├── templates/*.ts
│   └── validators/authValidator.ts
└── presentation/
    ├── helpers/getCurrentSessions.ts
    └── hooks/useAuthApi.ts
```

```text
src/app/api/auth/
├── _factory.ts
├── login/route.ts
├── logout/route.ts
├── logout-all/route.ts
├── current-session/route.ts
├── refresh/route.ts
├── forgot/route.ts
├── reset/route.ts
├── change/route.ts
└── register/route.ts       # bila enabled
```

## Task Checklist

### Domain

- [ ] Definisikan auth request/response DTO.
- [ ] Definisikan session entity.
- [ ] Definisikan auth payload entity.
- [ ] Definisikan refresh token value object bila session strategy membutuhkannya.
- [ ] Definisikan interfaces untuk auth repository, token, cookie, mail/reset notifier yang benar-benar digunakan.
- [ ] Jangan membuat interface/provider yang tidak dipakai deployment.

### Application

- [ ] Implement `LoginUseCase`.
- [ ] Implement `LogoutUseCase`.
- [ ] Implement `LogoutAllUseCase`.
- [ ] Implement `GetCurrentSessionUseCase`.
- [ ] Implement `RefreshTokenUseCase` jika session strategy menggunakan refresh token.
- [ ] Implement password/reset use case sesuai provider/platform capability.
- [ ] Implement `RegisterUseCase` hanya bila registration diaktifkan; jika tidak, route harus eksplisit disabled/not available.
- [ ] Resolve role ADMIN/TENANT/STUDENT secara authoritative.
- [ ] Resolve `tenantId` untuk TENANT/STUDENT.

### Infrastructure

- [ ] Implement Moodle auth repository untuk tenant/student via `/login/token.php`.
- [ ] Validate Moodle user via `core_webservice_get_site_info`.
- [ ] Implement platform admin auth repository/provider bila diperlukan.
- [ ] Implement HttpOnly cookie manager.
- [ ] Set `Secure` pada production.
- [ ] Set SameSite policy.
- [ ] Pastikan raw Moodle token hanya berada server-side session envelope/storage.
- [ ] Implement session integrity/signing/encryption sesuai strategy.
- [ ] Implement validator request auth.

### Controller & API

- [ ] Implement `AuthController`.
- [ ] Implement `src/app/api/auth/_factory.ts`.
- [ ] Implement login route.
- [ ] Implement logout route.
- [ ] Implement logout-all route.
- [ ] Implement current-session route.
- [ ] Implement refresh route bila dipakai.
- [ ] Implement forgot/reset/change route sesuai capability.
- [ ] Implement/disable register route secara eksplisit.

### Presentation & Auth Pages

- [ ] Implement `useAuthApi`.
- [ ] Implement login section mengikuti atoms/molecules/organisms/pages.
- [ ] Implement forgot/reset UI bila feature aktif.
- [ ] Redirect sukses login ke role home yang benar.
- [ ] Jangan menyimpan token di localStorage/sessionStorage.

### Tests

- [ ] Valid tenant/student Moodle login.
- [ ] Invalid Moodle credential.
- [ ] Inactive/suspended tenant.
- [ ] ADMIN role resolution.
- [ ] TENANT role resolution.
- [ ] STUDENT role resolution.
- [ ] TENANT/STUDENT tanpa tenant ditolak.
- [ ] Logout invalidates session.
- [ ] Logout-all invalidates seluruh session terkait bila didukung.
- [ ] Cookie tidak mengandung raw Moodle token dalam bentuk terbaca.
- [ ] Session tampering ditolak.
- [ ] Expired session ditolak.
- [ ] Current session tidak expose secret.
- [ ] Login redirect role-specific.

## TDD Workflow

### RED

- [ ] Tulis use case/session/controller tests terlebih dahulu.
- [ ] Pastikan tampered-cookie dan raw-token-exposure test gagal sebelum fix.

### GREEN

- [ ] Implement auth flow minimum sampai seluruh test lulus.

### REFACTOR

- [ ] Pisahkan actor resolution dari transport/controller.
- [ ] Pastikan session provider dapat diuji tanpa Next.js page component.
- [ ] Hapus duplicate auth validation.

## Acceptance Criteria

- [ ] Raw Moodle token server-only.
- [ ] Session cookie HttpOnly.
- [ ] Current actor memiliki `id`, `role`, `tenantId`, `moodleUserId`, dan permissions yang sesuai.
- [ ] TENANT/STUDENT tidak dapat memiliki tenant context arbitrer.
- [ ] Login mengarah ke home role yang benar.
- [ ] Logout benar-benar menonaktifkan session aplikasi.

## Definition of Done (DoD)

- [ ] Semua auth use case yang enabled tersedia dan teruji.
- [ ] Controller/factory/API route tersedia.
- [ ] Auth UI yang masuk scope tersedia.
- [ ] Session security test GREEN.
- [ ] Role/tenant resolution test GREEN.
- [ ] Tidak ada raw token pada browser storage/response/log.
- [ ] RBAC Issue 03 terintegrasi dengan current actor production.
- [ ] `npm run typecheck` lulus.
- [ ] `npm run lint` lulus.
- [ ] `npm run test` lulus.
- [ ] `npm run build` lulus.
- [ ] Tidak ada barrel export.

## Global Constraints

Checklist berikut berlaku selama pengerjaan issue ini:

- [ ] Mengikuti **TDD RED → GREEN → REFACTOR** untuk behavior yang dapat diuji.
- [ ] TypeScript `strict` tetap aktif dan tidak dimatikan untuk melewati error.
- [ ] Semua error/warning Biome yang terkait perubahan diselesaikan.
- [ ] Tidak ada direct call **browser → Moodle**.
- [ ] Tidak ada direct SQL dari Next.js ke database Moodle.
- [ ] Moodle token, password, credential, secret, atau stack trace tidak masuk response browser maupun log.
- [ ] Route handler tetap tipis: parse request → resolve context → panggil controller/factory → return response.
- [ ] Business rule berada di domain/application, bukan di `route.ts` atau komponen UI.
- [ ] Authorization tidak mengandalkan UI hiding.
- [ ] Tenant isolation diperiksa untuk seluruh operasi tenant-scoped.
- [ ] Ownership diperiksa untuk seluruh resource milik STUDENT.
- [ ] External Moodle response dimapping sebelum masuk ke application/domain.
- [ ] Nama fungsi Moodle (`core_*`, `mod_quiz_*`, `local_examapi_*`) tidak bocor ke presentation/UI.
- [ ] Tidak membuat abstraction/folder kosong hanya untuk memenuhi template.
- [ ] **Dilarang membuat barrel `index.ts` / `index.tsx`; semua import menggunakan concrete file path.**

## Verification

Jalankan seluruh command berikut dan pastikan semuanya lulus:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Jika issue menambahkan integration/E2E test, jalankan command test tambahan yang relevan sebelum issue ditutup.
