# Issue 02 — Core Foundation

## Nama Issue

**Core Foundation: Result, Error, HTTP, Logger, Request Context, Actor & Tenant Context**

## Tujuan

Membangun primitive lintas module yang menjadi kontrak bersama untuk error handling, API response, logging, request ID, current actor, session, dan tenant context.

## Dependency

- [ ] Issue 01 selesai.

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

- [ ] Implement `Result.success`.
- [ ] Implement `Result.failure`.
- [ ] Pastikan Result tidak bergantung pada Next.js/React.
- [ ] Implement base entity hanya jika ada behavior yang digunakan nyata.
- [ ] Implement base service tanpa membuat dependency ke feature tertentu.

### Error Model

- [ ] Buat `AppError` sebagai error aplikasi terstruktur.
- [ ] Buat error unauthorized.
- [ ] Buat error forbidden.
- [ ] Buat error not found.
- [ ] Buat error validation.
- [ ] Buat error infrastructure.
- [ ] Buat error Moodle generic tanpa membocorkan payload rahasia.
- [ ] Tentukan stable error code untuk response client.

### HTTP Contract

- [ ] Definisikan standard success response.
- [ ] Definisikan standard error response.
- [ ] Implement `withApiHandler`.
- [ ] Map known application error ke HTTP status yang benar.
- [ ] Map unknown error menjadi response aman.
- [ ] Jangan kirim stack trace ke client.

### Request & Logging

- [ ] Implement request ID generator.
- [ ] Support propagation request ID yang valid.
- [ ] Masukkan request ID pada structured log.
- [ ] Siapkan redaction untuk key sensitif (`token`, `password`, `authorization`, `cookie`, `secret`).

### Actor & Tenant Context

- [ ] Definisikan `CurrentActor` contract dasar.
- [ ] Definisikan `Session` contract dasar.
- [ ] Definisikan `TenantContext` contract.
- [ ] Validasi context agar nilai invalid tidak diteruskan ke feature layer.

### Tests

- [ ] Test Result success.
- [ ] Test Result failure.
- [ ] Test known error mapping.
- [ ] Test unknown error redaction.
- [ ] Test request ID generation.
- [ ] Test request ID propagation.
- [ ] Test logger redaction.
- [ ] Test actor contract validation.
- [ ] Test tenant context validation.

## TDD Workflow

### RED

- [ ] Buat test untuk setiap behavior core sebelum implementasi.
- [ ] Pastikan test error mapping dan secret redaction gagal terlebih dahulu.

### GREEN

- [ ] Implement minimum code sampai seluruh core tests lulus.

### REFACTOR

- [ ] Hapus duplikasi error mapping.
- [ ] Pastikan `core` tidak mengimpor `modules/*` atau `sections/*`.
- [ ] Pastikan naming konsisten dan tidak membuat barrel.

## Acceptance Criteria

- [ ] Semua API feature berikutnya dapat memakai satu response contract.
- [ ] Stack trace/unknown exception tidak bocor ke browser.
- [ ] Request ID tersedia untuk log/audit.
- [ ] Logger dapat meredaksi secret.
- [ ] Actor dan tenant context memiliki contract yang jelas.
- [ ] `core` tidak bergantung pada feature module.

## Definition of Done (DoD)

- [ ] Semua core contract yang masuk scope tersedia.
- [ ] Unit tests mencakup success dan failure path.
- [ ] Unknown error menghasilkan response aman.
- [ ] Secret redaction terbukti melalui test.
- [ ] Tidak ada import dependency terbalik dari core ke feature.
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
