# Issue 03 — RBAC & Role Route Separation

## Nama Issue

**RBAC Permission System & Separate Admin/Tenant/Student Route Trees**

## Tujuan

Membangun authorization layer berbasis permission untuk tiga actor aplikasi (`ADMIN`, `TENANT`, `STUDENT`) dan memisahkan page tree agar setiap role memiliki shell, navigation boundary, dan server guard sendiri.

## Dependency

- [ ] Issue 02 selesai.

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

- [ ] Definisikan role `ADMIN`.
- [ ] Definisikan role `TENANT`.
- [ ] Definisikan role `STUDENT`.
- [ ] Definisikan permission ADMIN sesuai planning.
- [ ] Definisikan permission TENANT sesuai planning.
- [ ] Definisikan permission STUDENT/own-resource sesuai planning.
- [ ] Implement role-permission map tunggal.

### Authorization Core

- [ ] Implement `hasPermission` sebagai pure function.
- [ ] Implement `authorize` dengan error terstruktur.
- [ ] Implement `requireRole`.
- [ ] Implement `requirePermission`.
- [ ] Pastikan TENANT tanpa `tenantId` invalid.
- [ ] Pastikan STUDENT tanpa `tenantId` invalid.
- [ ] Pastikan ADMIN boleh memiliki `tenantId = null`.

### Route Separation

- [ ] Buat layout `/admin` dengan guard ADMIN.
- [ ] Buat layout `/tenant` dengan guard TENANT + tenant context.
- [ ] Buat layout `/student` dengan guard STUDENT + tenant context.
- [ ] Tentukan safe redirect untuk page mismatch.
- [ ] Pastikan API helper tidak menggunakan redirect untuk authorization failure.

### Tenant Isolation Guard

- [ ] Session/context menjadi source of truth tenant untuk TENANT/STUDENT.
- [ ] Abaikan/reject `tenantId` spoof dari body/query jika bertentangan dengan session.
- [ ] Buat helper assertion tenant scope yang dapat dipakai use case berikutnya.

### Tests

- [ ] ADMIN dapat mengakses admin route.
- [ ] TENANT ditolak dari admin route.
- [ ] STUDENT ditolak dari admin route.
- [ ] STUDENT ditolak dari tenant route.
- [ ] TENANT ditolak dari student route jika policy tidak mengizinkan.
- [ ] Missing permission menghasilkan 403.
- [ ] Unauthenticated actor menghasilkan 401.
- [ ] TENANT tanpa tenantId ditolak.
- [ ] STUDENT tanpa tenantId ditolak.
- [ ] Spoofed tenantId tidak mengganti tenant context.
- [ ] Permission own-resource tidak otomatis memberikan akses ke resource orang lain.

## TDD Workflow

### RED

- [ ] Tulis seluruh role-permission matrix test sebelum guard implementation.
- [ ] Tulis regression test tenant spoofing.

### GREEN

- [ ] Implement permission map dan guard minimum sampai test lulus.
- [ ] Integrasikan guard ke server layouts.

### REFACTOR

- [ ] Hindari duplicate role checks tersebar di feature.
- [ ] UI navigation boleh derived dari permission, tetapi API/application guard tetap authoritative.
- [ ] Pastikan helper tetap framework-light bila memungkinkan.

## Acceptance Criteria

- [ ] Admin, Tenant, Student memiliki page shell terpisah.
- [ ] Direct URL dengan role salah diarahkan ke halaman aman.
- [ ] API authorization helper menghasilkan 401/403 yang konsisten.
- [ ] TENANT/STUDENT tidak dapat mengganti tenant scope melalui request.
- [ ] Permission helper dapat digunakan seluruh module berikutnya.
- [ ] Tenant isolation test lulus.

## Definition of Done (DoD)

- [ ] Role dan permission constants final untuk MVP.
- [ ] Role-permission map teruji.
- [ ] Server layout guard aktif pada tiga route tree.
- [ ] API authorization helper siap dipakai.
- [ ] Tenant spoofing test GREEN.
- [ ] Tidak ada authorization yang hanya bergantung pada menu hiding.
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
