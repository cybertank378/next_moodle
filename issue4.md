# Issue 04 — Tenant SaaS Database & Tenant Module

## Nama Issue

**Prisma 7 SaaS Tenant Storage & Tenant Domain Module**

## Tujuan

Membangun persistence metadata multi-tenant dan vertical slice module `tenant` sesuai pattern project, tanpa menduplikasi data akademik Moodle.

## Dependency

- [ ] Issue 03 selesai.

## Scope Pengerjaan

SaaS database hanya menyimpan:

```text
tenants
tenant_credentials
tenant_brandings
saas_audit_logs
```

Module mengikuti:

```text
application/services
application/usecases
domain/builder
domain/dto
domain/entity
domain/interfaces
domain/mapper
domain/types
domain/value-object
infrastructure/http
infrastructure/providers
infrastructure/repo
infrastructure/validators
presentation/hooks
```

Use case minimum:

```text
GetTenantsUseCase
GetTenantUseCase
CreateTenantUseCase
UpdateTenantUseCase
UpdateTenantStatusUseCase
```

## Out of Scope

- Enkripsi credential implementation final (Issue 05).
- Moodle connection handshake final (Issue 05).
- Admin UI tenant management (Issue 07).
- Data user/course/quiz/question/attempt/grade Moodle.

## Target Struktur / Deliverables

```text
prisma/schema.prisma
prisma/migrations/*

src/modules/tenant/
├── application/
├── domain/
├── infrastructure/
├── presentation/
└── __tests__/

src/app/api/tenants/
├── route.ts
├── [tenantId]/
│   ├── route.ts
│   └── status/route.ts
└── _factory.ts
```

## Task Checklist

### Prisma Schema

- [ ] Buat enum status tenant.
- [ ] Buat model `Tenant`.
- [ ] Buat model `TenantCredential` dengan field ciphertext saja.
- [ ] Buat model `TenantBranding`.
- [ ] Buat model `SaasAuditLog`.
- [ ] Tambahkan unique constraint pada tenant slug.
- [ ] Tambahkan relation/cascade yang aman.
- [ ] Buat migration.
- [ ] Pastikan tidak ada model akademik Moodle.

### Domain

- [ ] Implement `TenantEntity`.
- [ ] Implement `TenantSlug` value object.
- [ ] Implement request/response DTO.
- [ ] Implement query builder untuk list/filter/pagination jika diperlukan.
- [ ] Definisikan repository interface.
- [ ] Definisikan tenant status types.
- [ ] Implement domain mapper yang tidak mengenal Prisma type di consumer.

### Application

- [ ] Implement `TenantService` bila orchestration lintas use case memang diperlukan.
- [ ] Implement `GetTenantsUseCase`.
- [ ] Implement `GetTenantUseCase`.
- [ ] Implement `CreateTenantUseCase`.
- [ ] Implement `UpdateTenantUseCase`.
- [ ] Implement `UpdateTenantStatusUseCase`.
- [ ] Enforce ADMIN permission pada operation platform tenant.

### Infrastructure

- [ ] Implement Prisma `TenantRepository`.
- [ ] Implement `TenantController`.
- [ ] Implement request validator.
- [ ] Jangan expose encrypted credential pada response DTO.

### API

- [ ] Implement `src/app/api/tenants/_factory.ts`.
- [ ] Implement list/create route.
- [ ] Implement detail/update route.
- [ ] Implement status route.
- [ ] Pastikan route tidak mengandung business logic.

### Presentation

- [ ] Implement `useTenantApi` untuk kebutuhan client issue berikutnya.
- [ ] Hook hanya memanggil Next.js API, bukan Moodle.

### Tests

- [ ] Unique tenant slug.
- [ ] Invalid slug rejected.
- [ ] Tenant create requires permission.
- [ ] Tenant update requires permission.
- [ ] Tenant status update requires permission.
- [ ] Suspended tenant rejected untuk tenant-scoped context.
- [ ] Tenant lookup by slug/hostname sesuai resolver contract.
- [ ] TENANT tidak dapat resolve tenant lain.
- [ ] Credential ciphertext tidak tampil pada response.

## TDD Workflow

### RED

- [ ] Tulis tests domain slug/status/repository contract/use cases sebelum production implementation.

### GREEN

- [ ] Implement schema, repository, use cases, controller, API factory/routes, dan hook minimum.

### REFACTOR

- [ ] Pisahkan Prisma mapping dari domain entity.
- [ ] Hilangkan duplicated validation.
- [ ] Pastikan concrete import dan dependency direction benar.

## Acceptance Criteria

- [ ] ADMIN dapat CRUD/configure metadata tenant sesuai permission.
- [ ] Tenant resolver dapat memperoleh tenant yang valid.
- [ ] Suspended tenant dapat dibedakan secara eksplisit.
- [ ] Database tetap operational metadata only.
- [ ] Credential ciphertext tidak pernah diserialisasi ke browser.

## Definition of Done (DoD)

- [ ] Migration berhasil dijalankan pada database test/dev.
- [ ] Prisma client dapat generate.
- [ ] Seluruh tenant use case tersedia.
- [ ] Controller + `_factory.ts` + route tersedia.
- [ ] `useTenantApi` tersedia.
- [ ] Permission dan tenant isolation tests GREEN.
- [ ] Tidak ada model akademik Moodle di Prisma.
- [ ] Tidak ada credential plaintext di database/response/log.
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
