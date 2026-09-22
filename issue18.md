# Issue 18 — Audit & Security Hardening

## Nama Issue

**SaaS Audit Trail & Security Hardening for Sensitive Operations**

## Tujuan

Menyelesaikan audit trail dan security controls lintas aplikasi setelah critical feature flow tersedia, tanpa mengubah source-of-truth semantics Moodle.

## Dependency

- [ ] Issue 17 selesai.

## Scope Pengerjaan

Audit events minimum:

```text
TENANT_CREATED
TENANT_UPDATED
TENANT_STATUS_UPDATED
USER_CREATED
USER_UPDATED
EXAM_CREATED
EXAM_UPDATED
EXAM_DELETED
ATTEMPT_STARTED
ATTEMPT_SUBMITTED
ATTEMPT_FORCE_FINISHED
ATTEMPT_RESET
ATTEMPT_TIME_EXTENDED
USER_FORCE_LOGOUT
QUESTION_CREATED
QUESTION_UPDATED
QUESTION_DELETED
```

Security hardening:

- cookie security;
- CSRF strategy;
- rate limiting;
- tenant isolation regression suite;
- RBAC regression suite;
- secret encryption/redaction;
- security headers;
- request body/upload limits;
- server-side validation;
- audit integrity/context.

## Out of Scope

- SIEM integration vendor-specific.
- Full SOC2/ISO certification process.
- Storing exam answers in audit log.

## Task Checklist

### Audit Domain/Application

- [ ] Definisikan audit event types.
- [ ] Definisikan audit DTO/entity/interface.
- [ ] Implement append-only audit repository behavior.
- [ ] Implement platform audit query untuk ADMIN.
- [ ] Implement tenant audit query scoped ke TENANT.
- [ ] Pastikan sensitive values tidak masuk `details`.
- [ ] Include actorId, tenantId nullable where appropriate, action, requestId, timestamp.

### Audit Integration

- [ ] Tenant create/update/status emits event.
- [ ] User create/update emits event.
- [ ] Question create/update/delete emits event.
- [ ] Exam create/update/delete emits event.
- [ ] Attempt start/submit emits event sesuai privacy policy.
- [ ] Monitor administrative actions emit event.
- [ ] Failure events dicatat hanya bila policy membutuhkannya dan tidak membocorkan secret.

### API & UI

- [ ] Implement audit controller/factory/routes.
- [ ] ADMIN platform audit page membaca platform scope.
- [ ] TENANT audit page membaca tenant scope saja.
- [ ] Add pagination/filter/date/action/actor filters sesuai contract.
- [ ] Audit entry tidak editable dari UI.

### Cookie & Session Security

- [ ] HttpOnly.
- [ ] Secure di production.
- [ ] SameSite policy terdokumentasi.
- [ ] Cookie path/domain tidak terlalu luas tanpa kebutuhan.
- [ ] Session tampering/expiration tests.

### CSRF & Request Security

- [ ] Tentukan dan implement CSRF strategy untuk state-changing request.
- [ ] Validate Origin/Referer atau token strategy sesuai arsitektur.
- [ ] Reject invalid cross-site mutation.
- [ ] Terapkan body size limits.
- [ ] Validate content type.
- [ ] Validate upload file type/size bila upload feature ada.

### Rate Limiting

- [ ] Login rate limit.
- [ ] Password reset rate limit.
- [ ] Admin sensitive mutation rate limit bila relevan.
- [ ] Monitor destructive action throttling bila relevan.
- [ ] Response tidak mengungkap account enumeration secara berlebihan.

### Headers & Secret Redaction

- [ ] Security headers dikonfigurasi.
- [ ] Authorization/cookie/password/token redaction diuji.
- [ ] Moodle exception tidak mengungkap internal URL/token.
- [ ] Credential ciphertext tidak ditampilkan di UI/API.

### Regression Tests

- [ ] RBAC matrix regression.
- [ ] Cross-tenant ID probing.
- [ ] STUDENT ownership probing.
- [ ] Session tampering.
- [ ] CSRF negative test.
- [ ] Rate-limit behavior.
- [ ] Audit event produced for sensitive mutation.
- [ ] Audit details secret-free.

## TDD Workflow

### RED

- [ ] Tambahkan security/audit regression tests sebelum hardening implementation.

### GREEN

- [ ] Implement audit + security controls sampai suite lulus.

### REFACTOR

- [ ] Centralize audit append helper tanpa menyembunyikan transaction boundary.
- [ ] Centralize security middleware/helper yang memang lintas feature.
- [ ] Hindari logging duplicate sensitive payload.

## Acceptance Criteria

- [ ] Tidak ada sensitive mutation tanpa permission check.
- [ ] Sensitive mutation menghasilkan audit context/event sesuai policy.
- [ ] ADMIN hanya melihat platform audit yang diizinkan.
- [ ] TENANT hanya melihat audit tenant sendiri.
- [ ] CSRF/rate-limit/session/secret regression tests lulus.
- [ ] Audit log tidak mengandung credential/password/token/answer payload sensitif.

## Definition of Done (DoD)

- [ ] Audit module/query/API/UI tersedia.
- [ ] Required event integrations selesai.
- [ ] Security checklist terimplementasi atau eksplisit marked N/A dengan alasan di issue discussion.
- [ ] RBAC regression GREEN.
- [ ] Tenant isolation regression GREEN.
- [ ] CSRF/session/rate-limit tests GREEN.
- [ ] Secret redaction tests GREEN.
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
