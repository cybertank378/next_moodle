# Issue 02 — Core Foundation

## Nama Issue

**Core Foundation: Result, Error, HTTP, Logger, Request Context, Actor & Tenant Context**

## Tujuan

Membangun primitive lintas module yang menjadi kontrak bersama untuk error handling, API response, logging, request ID, current actor, session, dan tenant context.

## Dependency

- [x] Issue 01 selesai.

## Scope Pengerjaan

- `BaseEntity`, `BaseService`, `Result`.
- Error hierarchy aplikasi.
- Standard success/error response.
- `withApiHandler` atau wrapper API setara.
- Request ID generation/propagation.
- Structured logger dengan redaction hook.
- `CurrentActor` contract.
- `Session` contract.
- `TenantContext` contract.
- Unit test core foundation.

## Out of Scope

- Role-permission map RBAC.
- Auth login/logout sebenarnya.
- Tenant database repository.
- Moodle REST client.

## Target Struktur / Deliverables

```text
src/core/
├── base/
│   ├── BaseEntity.ts
│   ├── BaseService.ts
│   └── Result.ts
├── errors/
│   ├── AppError.ts
│   ├── DomainError.ts
│   ├── ForbiddenError.ts
│   ├── InfrastructureError.ts
│   ├── MoodleError.ts
│   ├── NotFoundError.ts
│   ├── UnauthorizedError.ts
│   └── ValidationError.ts
├── http/
│   ├── ApiErrorResponse.ts
│   ├── ApiResponse.ts
│   ├── HttpStatus.ts
│   └── withApiHandler.ts
├── logger/
│   ├── Logger.ts
│   └── createLogger.ts
├── security/
│   └── RequestId.ts
├── auth/
│   ├── CurrentActor.ts
│   └── Session.ts
└── tenant/
    └── TenantContext.ts
```

## Task Checklist

### Base Contracts

- [x] Implement `Result.success`.
- [x] Implement `Result.failure`.
- [x] Pastikan Result tidak bergantung pada Next.js/React.
- [x] Implement base entity hanya jika ada behavior yang digunakan nyata.
- [x] Implement base service tanpa membuat dependency ke feature tertentu.

### Error Model

- [x] Buat `AppError` sebagai error aplikasi terstruktur.
- [x] Buat error unauthorized.
- [x] Buat error forbidden.
- [x] Buat error not found.
- [x] Buat error validation.
- [x] Buat error infrastructure.
- [x] Buat error Moodle generic tanpa membocorkan payload rahasia.
- [x] Tentukan stable error code untuk response client.

### HTTP Contract

- [x] Definisikan standard success response.
- [x] Definisikan standard error response.
- [x] Implement `withApiHandler`.
- [x] Map known application error ke HTTP status yang benar.
- [x] Map unknown error menjadi response aman.
- [x] Jangan kirim stack trace ke client.

### Request & Logging

- [x] Implement request ID generator.
- [x] Support propagation request ID yang valid.
- [x] Masukkan request ID pada structured log.
- [x] Siapkan redaction untuk key sensitif (`token`, `password`, `authorization`, `cookie`, `secret`).

### Actor & Tenant Context

- [x] Definisikan `CurrentActor` contract dasar.
- [x] Definisikan `Session` contract dasar.
- [x] Definisikan `TenantContext` contract.
- [x] Validasi context agar nilai invalid tidak diteruskan ke feature layer.

### Tests

- [x] Test Result success.
- [x] Test Result failure.
- [x] Test known error mapping.
- [x] Test unknown error redaction.
- [x] Test request ID generation.
- [x] Test request ID propagation.
- [x] Test logger redaction.
- [x] Test actor contract validation.
- [x] Test tenant context validation.

## TDD Workflow

### RED

- [x] Buat test untuk setiap behavior core sebelum implementasi.
- [x] Pastikan test error mapping dan secret redaction gagal terlebih dahulu.

### GREEN

- [x] Implement minimum code sampai seluruh core tests lulus.

### REFACTOR

- [x] Hapus duplikasi error mapping.
- [x] Pastikan `core` tidak mengimpor `modules/*` atau `sections/*`.
- [x] Pastikan naming konsisten dan tidak membuat barrel.

## Acceptance Criteria

- [x] Semua API feature berikutnya dapat memakai satu response contract.
- [x] Stack trace/unknown exception tidak bocor ke browser.
- [x] Request ID tersedia untuk log/audit.
- [x] Logger dapat meredaksi secret.
- [x] Actor dan tenant context memiliki contract yang jelas.
- [x] `core` tidak bergantung pada feature module.

## Definition of Done (DoD)

- [x] Semua core contract yang masuk scope tersedia.
- [x] Unit tests mencakup success dan failure path.
- [x] Unknown error menghasilkan response aman.
- [x] Secret redaction terbukti melalui test.
- [x] Tidak ada import dependency terbalik dari core ke feature.
- [x] `npm run typecheck` lulus.
- [x] `npm run lint` lulus.
- [x] `npm run test` lulus.
- [x] `npm run build` lulus.
- [x] Tidak ada barrel export.

## Global Constraints

Checklist berikut berlaku selama pengerjaan issue ini:

- [x] Mengikuti **TDD RED → GREEN → REFACTOR** untuk behavior yang dapat diuji.
- [x] TypeScript `strict` tetap aktif dan tidak dimatikan untuk melewati error.
- [x] Semua error/warning Biome yang terkait perubahan diselesaikan.
- [x] Tidak ada direct call **browser → Moodle**.
- [x] Tidak ada direct SQL dari Next.js ke database Moodle.
- [x] Moodle token, password, credential, secret, atau stack trace tidak masuk response browser maupun log.
- [x] Route handler tetap tipis: parse request → resolve context → panggil controller/factory → return response.
- [x] Business rule berada di domain/application, bukan di `route.ts` atau komponen UI.
- [x] Authorization tidak mengandalkan UI hiding.
- [x] Tenant isolation diperiksa untuk seluruh operasi tenant-scoped.
- [x] Ownership diperiksa untuk seluruh resource milik STUDENT.
- [x] External Moodle response dimapping sebelum masuk ke application/domain.
- [x] Nama fungsi Moodle (`core_*`, `mod_quiz_*`, `local_examapi_*`) tidak bocor ke presentation/UI.
- [x] Tidak membuat abstraction/folder kosong hanya untuk memenuhi template.
- [x] **Dilarang membuat barrel `index.ts` / `index.tsx`; semua import menggunakan concrete file path.**

## Verification

Jalankan seluruh command berikut dan pastikan semuanya lulus:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Jika issue menambahkan integration/E2E test, jalankan command test tambahan yang relevan sebelum issue ditutup.
