# Issue 07 — Admin Portal: Tenant Management

## Nama Issue

**ADMIN Portal — Dashboard, Tenant Management, Connection Diagnostics & Platform Settings**

## Tujuan

Membangun UI dan orchestration khusus `ADMIN` untuk mengelola tenant SaaS menggunakan tenant module/API yang telah dibuat.

## Dependency

- [ ] Issue 06 selesai.

## Scope Pengerjaan

Pages:

```text
/admin/dashboard
/admin/tenants
/admin/tenants/[tenantId]
/admin/audit
/admin/settings
```

Sections:

```text
sections/admin-dashboard
sections/tenant-management
sections/platform-audit
sections/platform-settings
```

Fokus issue ini adalah ADMIN experience dan integration dengan tenant API, bukan implementasi audit security final yang akan diperdalam di Issue 18.

## Out of Scope

- Tenant operational pages.
- Student pages.
- Academic Moodle administration.
- Audit/security hardening final.

## Task Checklist

### Admin Shell & Navigation

- [ ] Buat admin sidebar/navigation.
- [ ] Tampilkan menu berdasarkan permission ADMIN.
- [ ] Pastikan direct page access tetap dijaga server layout.
- [ ] Implement admin dashboard page shell.

### Tenant List

- [ ] Buat page header.
- [ ] Buat statistics summary yang relevan.
- [ ] Buat search/filter.
- [ ] Buat tenant table.
- [ ] Gunakan shared Pagination.
- [ ] Gunakan Skeleton pada content/table body.
- [ ] EmptyState tidak menutup header/filter/table header.
- [ ] Buat action menu.

### Tenant Create/Edit

- [ ] Buat form create tenant.
- [ ] Buat form update tenant.
- [ ] Validasi slug/name/status input.
- [ ] Jangan render existing encrypted token/ciphertext ke browser.
- [ ] Credential baru hanya dikirim melalui protected mutation dan tidak dikembalikan lagi.

### Tenant Detail & Connection Diagnostics

- [ ] Buat detail tenant.
- [ ] Tampilkan status tenant.
- [ ] Tampilkan Moodle endpoint yang aman.
- [ ] Integrasikan connection test.
- [ ] Tampilkan diagnostic status/latency/version tanpa token.
- [ ] Buat activate/suspend action dengan confirmation.

### Platform Audit/Settings Shell

- [ ] Buat platform audit page shell untuk data audit yang tersedia.
- [ ] Buat platform settings shell untuk setting yang memang sudah memiliki contract.
- [ ] Jangan menambahkan dummy settings tanpa backend contract.

### Security/RBAC

- [ ] Semua admin mutation memerlukan permission yang benar.
- [ ] TENANT mendapat 403 untuk admin API mutation.
- [ ] STUDENT mendapat 403 untuk admin API mutation.
- [ ] Sensitive credential tidak dirender.
- [ ] Setiap mutation menyediakan audit-ready actor/request context.

### Tests

- [ ] Admin tenant list loading/empty/error/success.
- [ ] Pagination/filter interaction.
- [ ] Create tenant success/error.
- [ ] Update tenant success/error.
- [ ] Status mutation confirmation.
- [ ] Connection test success/error.
- [ ] TENANT/STUDENT forbidden.
- [ ] EmptyState tidak mengganti page header/filter.
- [ ] Sensitive token tidak muncul di rendered output.

## TDD Workflow

### RED

- [ ] Tulis interaction/component tests dan RBAC integration tests sebelum UI behavior final.

### GREEN

- [ ] Implement sections/pages sampai flow tenant management berjalan.

### REFACTOR

- [ ] Jaga API call hanya di organism/presentation hook.
- [ ] Molecule menerima props/callback saja.
- [ ] Reuse shared table/filter/pagination tanpa membuat barrel.

## Acceptance Criteria

- [ ] Hanya ADMIN dapat memakai admin portal.
- [ ] Tenant list dapat filter dan paginate.
- [ ] Tenant dapat create/update/status update.
- [ ] Moodle connection dapat dites tanpa expose secret.
- [ ] Loading/empty/error state sesuai standard UI project.
- [ ] Mutation siap menghasilkan audit event.

## Definition of Done (DoD)

- [ ] Semua page dalam scope tersedia.
- [ ] Semua admin tenant actions terhubung ke API.
- [ ] Permission tests GREEN.
- [ ] Sensitive data exposure tests GREEN.
- [ ] Table pattern mengikuti Header → Stats → Filter → Table → Pagination.
- [ ] Skeleton/EmptyState sesuai standard.
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
