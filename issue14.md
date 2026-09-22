# Issue 14 — Tenant Users, Enrolments & Groups

## Nama Issue

**TENANT Participant Administration — Users, Enrolments, Groups & Cohorts**

## Tujuan

Membangun administrasi peserta pada TENANT portal melalui module `users`, `enrolments`, dan `groups`, seluruhnya tenant-scoped dan menggunakan Moodle APIs melalui infrastructure adapters.

## Dependency

- [ ] Issue 13 selesai.

## Scope Pengerjaan

Pages:

```text
/tenant/users
/tenant/enrolments
/tenant/groups
```

Modules:

```text
users
enrolments
groups
```

Capabilities:

- list/search/filter/pagination user;
- create/update/deactivate user sesuai Moodle capability;
- bulk import validation bila digunakan;
- enrol/unenrol;
- group/cohort list dan membership management.

## Out of Scope

- Question bank.
- Exam administration.
- Cross-tenant/global user management oleh ADMIN.

## Task Checklist

### Users Module

- [ ] Definisikan user request/response DTO.
- [ ] Definisikan user repository interface.
- [ ] Implement list/search user use case.
- [ ] Implement create user use case.
- [ ] Implement update user use case.
- [ ] Implement deactivate/status use case sesuai Moodle capability.
- [ ] Implement import validation use case bila import disediakan.
- [ ] Implement Moodle user repository/mapper.
- [ ] Implement controller/factory/routes/hook.

### Enrolments Module

- [ ] Definisikan enrolment DTO/interfaces.
- [ ] Implement participant list.
- [ ] Implement manual enrol.
- [ ] Implement unenrol.
- [ ] Implement status mapping.
- [ ] Implement repository/controller/factory/routes/hook.

### Groups Module

- [ ] Definisikan group/cohort DTO/interfaces.
- [ ] Implement group/cohort list.
- [ ] Implement membership read.
- [ ] Implement add/remove member sesuai capability.
- [ ] Implement repository/controller/factory/routes/hook.

### API & Moodle Boundary

- [ ] Gunakan `core_user_*` hanya di infrastructure.
- [ ] Gunakan enrolment functions hanya di infrastructure.
- [ ] Gunakan group/cohort functions hanya di infrastructure.
- [ ] Jangan bocorkan Moodle function name ke sections.
- [ ] Route handler tetap tipis.

### UI

- [ ] User management table mengikuti standard project.
- [ ] Enrolment table mengikuti standard project.
- [ ] Group table mengikuti standard project.
- [ ] Gunakan Pagination.
- [ ] Gunakan Skeleton saat loading.
- [ ] EmptyState hanya mengganti table body/content.
- [ ] Filter/search tetap terlihat pada loading/empty.
- [ ] Mutation menggunakan confirmation bila destructive.

### Security/RBAC

- [ ] USER_READ/CREATE/UPDATE/DEACTIVATE/IMPORT permissions diterapkan.
- [ ] ENROLMENT_READ/MANAGE permissions diterapkan.
- [ ] GROUP_READ/MANAGE permissions diterapkan.
- [ ] Tenant isolation pada setiap mutation.
- [ ] Target user/group/course diverifikasi milik tenant context.

### Tests

- [ ] User list pagination/filter.
- [ ] User mutation permission.
- [ ] Cross-tenant user mutation rejected.
- [ ] Import validation rejects invalid rows.
- [ ] Enrol success.
- [ ] Unenrol success.
- [ ] Enrol cross-tenant rejected.
- [ ] Group membership add/remove.
- [ ] Cross-tenant group membership rejected.
- [ ] Skeleton/EmptyState/Pagination behavior.

## TDD Workflow

### RED

- [ ] Tulis use case/RBAC/tenant-isolation tests per module terlebih dahulu.

### GREEN

- [ ] Implement masing-masing vertical slice secara lengkap.

### REFACTOR

- [ ] Reuse table primitives, bukan business logic lintas module.
- [ ] Hindari giant participant service yang mencampur users/enrolments/groups.
- [ ] Pastikan module boundaries tetap jelas.

## Acceptance Criteria

- [ ] TENANT dapat mengelola participant dalam tenant sendiri.
- [ ] TENANT tidak dapat mengelola user/resource tenant lain.
- [ ] Semua management table mengikuti Pagination/Skeleton/EmptyState standard.
- [ ] Moodle tetap source of truth user/enrolment/group akademik.

## Definition of Done (DoD)

- [ ] Tiga module memiliki domain/application/infrastructure/presentation sesuai kebutuhan.
- [ ] Controller/factory/routes tersedia.
- [ ] Tenant pages tersedia.
- [ ] Permission matrix tests GREEN.
- [ ] Cross-tenant negative tests GREEN.
- [ ] Table UI standard terpenuhi.
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
