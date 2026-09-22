# Issue 20 — E2E, CI & Release Gate

## Nama Issue

**Critical E2E Flows, CI Quality Gates & MVP Release Readiness**

## Tujuan

Memastikan critical flow ADMIN, TENANT, STUDENT dan negative authorization/tenant-isolation flow bekerja end-to-end sebelum MVP dapat dirilis.

## Dependency

- [ ] Issue 19 selesai.

## Scope Pengerjaan

Critical E2E:

```text
STUDENT
login → dashboard → course → exam → access check → start/resume
→ answer → autosave → navigate → summary → submit → result

TENANT
login → dashboard → users/enrolment → question bank → create exam
→ add questions → monitor → administrative action → result

ADMIN
login → dashboard → create tenant → configure Moodle
→ test connection → activate/suspend → audit
```

Negative E2E:

- role route mismatch;
- cross-tenant probing;
- ownership probing;
- stale/tampered session;
- unauthorized API mutation;
- sensitive data exposure check.

CI release gate:

```text
typecheck
biome
unit tests
integration tests
architecture/no-barrel tests
build
critical E2E
```

## Out of Scope

- Production deployment automation vendor-specific jika belum dipilih.
- Full load testing platform-scale; smoke/performance gate dapat ditambahkan terpisah.

## Task Checklist

### E2E Test Environment

- [ ] Siapkan deterministic test tenants/users/roles.
- [ ] Siapkan Moodle test fixture atau controlled test backend.
- [ ] Pisahkan credential test dari repository.
- [ ] Buat data cleanup/reset strategy.
- [ ] Pastikan test tidak bergantung urutan secara tidak sengaja.

### STUDENT E2E

- [ ] Login STUDENT.
- [ ] Redirect ke `/student/*`.
- [ ] Lihat enrolled course.
- [ ] Lihat exam.
- [ ] Access check.
- [ ] Start/resume attempt.
- [ ] Answer question.
- [ ] Autosave confirmed.
- [ ] Navigate questions.
- [ ] Open summary.
- [ ] Submit final.
- [ ] Lihat result/review sesuai Moodle policy.

### TENANT E2E

- [ ] Login TENANT.
- [ ] Redirect ke `/tenant/*`.
- [ ] Manage/read participant flow.
- [ ] Enrol participant.
- [ ] Create/read question.
- [ ] Create exam.
- [ ] Add/reorder question.
- [ ] Open monitor.
- [ ] Execute one safe administrative action in fixture.
- [ ] Verify audit/result impact sesuai contract.

### ADMIN E2E

- [ ] Login ADMIN.
- [ ] Redirect ke `/admin/*`.
- [ ] Create tenant fixture.
- [ ] Configure Moodle endpoint/credential securely.
- [ ] Test Moodle connection.
- [ ] Activate/suspend tenant.
- [ ] Verify platform audit event.
- [ ] Cleanup tenant fixture.

### Negative E2E

- [ ] STUDENT membuka `/tenant/*` ditolak/redirect aman.
- [ ] STUDENT membuka `/admin/*` ditolak/redirect aman.
- [ ] TENANT membuka `/admin/*` ditolak/redirect aman.
- [ ] Cross-tenant resource ID probing ditolak.
- [ ] STUDENT attempt ownership probing ditolak.
- [ ] Tampered session ditolak.
- [ ] Expired session ditolak.
- [ ] Unauthorized API mutation menghasilkan 401/403 yang benar.
- [ ] Moodle token/credential tidak muncul pada browser storage/network payload.

### CI Pipeline

- [ ] Jalankan `typecheck`.
- [ ] Jalankan Biome.
- [ ] Jalankan unit tests.
- [ ] Jalankan integration tests.
- [ ] Jalankan architecture/no-barrel tests.
- [ ] Jalankan build.
- [ ] Jalankan critical E2E pada environment yang sesuai.
- [ ] Fail pipeline bila salah satu gate gagal.
- [ ] Simpan test artifacts/log yang tidak mengandung secret.

### Release Checklist

- [ ] Environment variables terdokumentasi.
- [ ] Migration status clean.
- [ ] No pending critical TODO/FIXME pada critical path.
- [ ] No known secret exposure.
- [ ] RBAC/tenant isolation negative suite GREEN.
- [ ] Rollback/deployment notes tersedia sesuai platform deployment.

## TDD / Verification Workflow

### RED

- [ ] Tambahkan E2E scenario satu per satu dan pastikan dapat mendeteksi behavior yang belum benar.

### GREEN

- [ ] Perbaiki critical flow sampai E2E lulus tanpa bypass security assertion.

### REFACTOR

- [ ] Reuse test fixtures/helpers tanpa menciptakan test dependency antar scenario.
- [ ] Hilangkan flaky waits; gunakan deterministic condition.
- [ ] Redact secret pada CI output.

## Acceptance Criteria

- [ ] Critical STUDENT E2E GREEN.
- [ ] Critical TENANT E2E GREEN.
- [ ] Critical ADMIN E2E GREEN.
- [ ] Negative RBAC/tenant isolation E2E GREEN.
- [ ] CI memblokir merge/release ketika mandatory gate gagal.
- [ ] Browser inspection test tidak menemukan Moodle credential/token.

## Definition of Done (DoD)

- [ ] Seluruh E2E checklist critical flow selesai.
- [ ] Seluruh negative security E2E selesai.
- [ ] CI menjalankan seluruh mandatory gates.
- [ ] Release tidak dapat lewat jika typecheck/lint/test/build/E2E gagal.
- [ ] No-barrel architecture check menjadi bagian CI.
- [ ] RBAC + tenant isolation menjadi release blocker.
- [ ] Migration/config documentation siap.
- [ ] `npm run typecheck` lulus.
- [ ] `npm run lint` lulus.
- [ ] `npm run test` lulus.
- [ ] `npm run build` lulus.
- [ ] Critical E2E lulus.
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
