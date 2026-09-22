# Issue 03 — RBAC & Role Route Separation

## Nama Issue

**RBAC Permission System & Separate Admin/Tenant/Student Route Trees**

## Tujuan

Membangun authorization layer berbasis permission untuk tiga actor aplikasi (`ADMIN`, `TENANT`, `STUDENT`) dan memisahkan page tree agar setiap role memiliki shell, navigation boundary, dan server guard sendiri.

## Dependency

- [x] Issue 02 selesai.

## Scope Pengerjaan

- `AppRole`.
- Permission constants.
- Role-permission map.
- Authorization context/error.
- `hasPermission`, `authorize`, `requireRole`, `requirePermission`.
- Mandatory `tenantId` untuk TENANT/STUDENT.
- Server layout guard untuk `/admin/*`, `/tenant/*`, `/student/*`.
- Safe redirect untuk page role mismatch.
- API tetap mengembalikan 401/403, bukan hanya redirect.
- Test matrix role, permission, tenant spoofing.

## Out of Scope

- Login/session persistence sebenarnya.
- Tenant CRUD.
- Feature-specific ownership selain helper contract dasar.
- UI bisnis dashboard.

## Target Struktur / Deliverables

```text
src/core/rbac/
├── AppRole.ts
├── Permission.ts
├── RolePermissionMap.ts
├── AuthorizationContext.ts
├── AuthorizationError.ts
├── authorize.ts
├── hasPermission.ts
├── requireRole.ts
└── requirePermission.ts

src/app/(admin)/admin/layout.tsx
src/app/(tenant)/tenant/layout.tsx
src/app/(student)/student/layout.tsx
```

Required page roots:

```text
/admin/*
/tenant/*
/student/*
```

## Task Checklist

### Role & Permission Model

- [x] Definisikan role `ADMIN`.
- [x] Definisikan role `TENANT`.
- [x] Definisikan role `STUDENT`.
- [x] Definisikan permission ADMIN sesuai planning.
- [x] Definisikan permission TENANT sesuai planning.
- [x] Definisikan permission STUDENT/own-resource sesuai planning.
- [x] Implement role-permission map tunggal.

### Authorization Core

- [x] Implement `hasPermission` sebagai pure function.
- [x] Implement `authorize` dengan error terstruktur.
- [x] Implement `requireRole`.
- [x] Implement `requirePermission`.
- [x] Pastikan TENANT tanpa `tenantId` invalid.
- [x] Pastikan STUDENT tanpa `tenantId` invalid.
- [x] Pastikan ADMIN boleh memiliki `tenantId = null`.

### Route Separation

- [x] Buat layout `/admin` dengan guard ADMIN.
- [x] Buat layout `/tenant` dengan guard TENANT + tenant context.
- [x] Buat layout `/student` dengan guard STUDENT + tenant context.
- [x] Tentukan safe redirect untuk page mismatch.
- [x] Pastikan API helper tidak menggunakan redirect untuk authorization failure.

### Tenant Isolation Guard

- [x] Session/context menjadi source of truth tenant untuk TENANT/STUDENT.
- [x] Abaikan/reject `tenantId` spoof dari body/query jika bertentangan dengan session.
- [x] Buat helper assertion tenant scope yang dapat dipakai use case berikutnya.

### Tests

- [x] ADMIN dapat mengakses admin route.
- [x] TENANT ditolak dari admin route.
- [x] STUDENT ditolak dari admin route.
- [x] STUDENT ditolak dari tenant route.
- [x] TENANT ditolak dari student route jika policy tidak mengizinkan.
- [x] Missing permission menghasilkan 403.
- [x] Unauthenticated actor menghasilkan 401.
- [x] TENANT tanpa tenantId ditolak.
- [x] STUDENT tanpa tenantId ditolak.
- [x] Spoofed tenantId tidak mengganti tenant context.
- [x] Permission own-resource tidak otomatis memberikan akses ke resource orang lain.

## TDD Workflow

### RED

- [x] Tulis seluruh role-permission matrix test sebelum guard implementation.
- [x] Tulis regression test tenant spoofing.

### GREEN

- [x] Implement permission map dan guard minimum sampai test lulus.
- [x] Integrasikan guard ke server layouts.

### REFACTOR

- [x] Hindari duplicate role checks tersebar di feature.
- [x] UI navigation boleh derived dari permission, tetapi API/application guard tetap authoritative.
- [x] Pastikan helper tetap framework-light bila memungkinkan.

## Acceptance Criteria

- [x] Admin, Tenant, Student memiliki page shell terpisah.
- [x] Direct URL dengan role salah diarahkan ke halaman aman.
- [x] API authorization helper menghasilkan 401/403 yang konsisten.
- [x] TENANT/STUDENT tidak dapat mengganti tenant scope melalui request.
- [x] Permission helper dapat digunakan seluruh module berikutnya.
- [x] Tenant isolation test lulus.

## Definition of Done (DoD)

- [x] Role dan permission constants final untuk MVP.
- [x] Role-permission map teruji.
- [x] Server layout guard aktif pada tiga route tree.
- [x] API authorization helper siap dipakai.
- [x] Tenant spoofing test GREEN.
- [x] Tidak ada authorization yang hanya bergantung pada menu hiding.
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
