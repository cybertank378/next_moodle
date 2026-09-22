# Issue 08 — Tenant Portal Foundation & Dashboard

## Nama Issue

**TENANT Portal Foundation — Tenant Shell, Dashboard, Branding & Tenant Context Enforcement**

## Tujuan

Membangun shell UI khusus `TENANT` dan dashboard instansi yang seluruh datanya selalu berasal dari tenant context session yang telah tervalidasi.

## Dependency

- [ ] Issue 07 selesai.

## Scope Pengerjaan

Pages:

```text
/tenant/dashboard
/tenant/branding
/tenant/audit
```

- Tenant navigation shell.
- Tenant identity/branding context.
- Dashboard summary contract.
- Branding read/update.
- Tenant audit page shell/read integration yang tersedia.
- Tenant-scoped authorization tests.

## Out of Scope

- Users/enrolments/groups management (Issue 14).
- Questions (Issue 15).
- Exam administration/monitoring (Issue 16–17).
- Full audit/security hardening (Issue 18).

## Task Checklist

### Tenant Shell

- [ ] Buat tenant layout/navigation.
- [ ] Gunakan resolved tenant name/logo pada shell.
- [ ] Menu derived dari permission TENANT.
- [ ] Jangan menerima tenant selector bebas untuk scoped operation.

### Tenant Dashboard

- [ ] Definisikan dashboard response DTO bila belum ada contract yang tepat.
- [ ] Buat organism dashboard sebagai state coordinator.
- [ ] Tampilkan statistics yang tersedia dari safe backend aggregation.
- [ ] Tambahkan loading skeleton.
- [ ] Tambahkan error state.
- [ ] Tambahkan empty state bila statistik/resource belum tersedia.

### Branding

- [ ] Implement read tenant branding.
- [ ] Implement update tenant branding.
- [ ] Validasi logo URL/file strategy sesuai capability yang sudah ada.
- [ ] Validasi primary color/config input.
- [ ] Pastikan tenant actor hanya dapat mengubah branding tenant sendiri.

### Tenant Audit Shell

- [ ] Buat page header/filter/table skeleton untuk tenant audit.
- [ ] Gunakan API audit yang tersedia; jangan membuat fake audit data.
- [ ] Scope selalu actor tenant.

### Security/RBAC

- [ ] ADMIN/STUDENT tidak menggunakan tenant shell kecuali policy eksplisit.
- [ ] Spoofed tenant query/body tidak mengubah scope.
- [ ] Branding update tenant lain ditolak.
- [ ] TenantId berasal dari session/context.

### Tests

- [ ] Tenant dashboard menggunakan actor tenantId.
- [ ] Spoofed tenantId rejected/ignored sesuai contract.
- [ ] Branding read own tenant.
- [ ] Branding update own tenant.
- [ ] Branding update cross-tenant forbidden.
- [ ] Tenant shell role guard.
- [ ] Loading/empty/error UI state.

## TDD Workflow

### RED

- [ ] Tulis tenant-scope tests dan UI state tests terlebih dahulu.

### GREEN

- [ ] Implement shell/dashboard/branding sampai tests lulus.

### REFACTOR

- [ ] Hilangkan tenantId prop yang tidak perlu dari browser-level component.
- [ ] Keep tenant context resolution server/application-side.
- [ ] Pastikan atoms/molecules tetap API-free.

## Acceptance Criteria

- [ ] Tenant identity berasal dari resolved tenant.
- [ ] TenantId tidak dipilih bebas dari browser.
- [ ] Dashboard dan branding tenant scoped.
- [ ] Shell siap menampung feature management issue berikutnya.
- [ ] Loading/empty/error state tersedia.

## Definition of Done (DoD)

- [ ] Tenant shell/navigation tersedia.
- [ ] Dashboard page tersedia dan tenant-scoped.
- [ ] Branding read/update berjalan.
- [ ] Tenant audit shell tersedia tanpa fake data.
- [ ] Cross-tenant negative tests GREEN.
- [ ] Role guard tests GREEN.
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
