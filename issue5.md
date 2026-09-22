# Issue 05 — Moodle REST Adapter & Credential Security

## Nama Issue

**Server-Only Moodle REST Adapter, Tenant Credential Encryption & Connection Handshake**

## Tujuan

Membuat satu-satunya jalur komunikasi Next.js → Moodle serta mekanisme aman untuk mengambil/dekripsi credential service per tenant.

## Dependency

- [ ] Issue 04 selesai.

## Scope Pengerjaan

- `MoodleRestClient` server-only.
- Moodle nested parameter encoder.
- Timeout dan response parsing.
- Moodle exception mapping.
- Secret-safe logging.
- `MoodleClientFactory` tenant-aware.
- `MoodleCredentialProvider`.
- AES-256-GCM encryption/decryption.
- Tenant-specific key derivation.
- SSRF validation Moodle URL.
- `TestMoodleConnectionUseCase`.
- Admin/proctor token health handshake.

## Out of Scope

- Feature repository courses/quizzes/attempts.
- Admin UI connection diagnostics.
- Browser access ke Moodle token.

## Target Struktur / Deliverables

```text
src/core/moodle/
├── MoodleRestClient.ts
├── MoodleClientFactory.ts
├── MoodleCredentialProvider.ts
├── MoodleErrorMapper.ts
└── types/
    ├── MoodleExceptionResponse.ts
    └── MoodleRequestParameters.ts

src/core/security/
└── EncryptionProvider.ts
```

Tenant module tambahan:

```text
src/modules/tenant/application/usecases/TestMoodleConnectionUseCase.ts
src/modules/tenant/infrastructure/providers/EncryptedTenantCredentialProvider.ts
src/app/api/tenants/[tenantId]/connection-test/route.ts
```

## Task Checklist

### Moodle REST Client

- [ ] Tambahkan `import "server-only"` pada adapter yang relevan.
- [ ] Implement POST request ke Moodle REST endpoint.
- [ ] Implement scalar parameter encoding.
- [ ] Implement array parameter encoding.
- [ ] Implement nested object/list parameter encoding sesuai Moodle REST.
- [ ] Implement bounded timeout.
- [ ] Handle non-2xx HTTP response.
- [ ] Handle malformed JSON.
- [ ] Detect Moodle exception payload.
- [ ] Map Moodle exception ke application-safe error.
- [ ] Attach request/correlation ID.
- [ ] Redact token/authorization/password dari log.

### Credential Security

- [ ] Implement AES-256-GCM.
- [ ] Gunakan 12-byte random IV per encryption.
- [ ] Gunakan authentication tag.
- [ ] Gunakan tenant-specific key derivation/HKDF dari master key.
- [ ] Master key hanya berasal dari server environment.
- [ ] Pastikan decrypt Tenant A tidak dapat digunakan sebagai credential Tenant B.
- [ ] Pastikan plaintext credential tidak persist/log.

### SSRF Protection

- [ ] Validasi scheme hanya HTTPS untuk production policy.
- [ ] Reject malformed URL.
- [ ] Reject loopback/private/link-local target sesuai deployment policy.
- [ ] Prevent credential URL injection/redirection ke host tidak terpercaya.
- [ ] Test redirect/host validation bila HTTP client mengikuti redirect.

### Client Factory

- [ ] Factory menerima tenant context tervalidasi.
- [ ] Factory mengambil credential tenant yang benar.
- [ ] Factory tidak menerima arbitrary token dari browser.
- [ ] Factory tidak mencampur credential antar tenant.

### Moodle Connection Test

- [ ] Implement `TestMoodleConnectionUseCase`.
- [ ] Validate admin/service token via site info.
- [ ] Validate proctor token via site info bila dikonfigurasi.
- [ ] Validate custom plugin health endpoint.
- [ ] Return diagnostic DTO tanpa secret.
- [ ] Include latency/release/site metadata yang aman.

### API

- [ ] Tambahkan connection-test controller action.
- [ ] Tambahkan route `/api/tenants/[tenantId]/connection-test`.
- [ ] Enforce `TENANT_CONNECTION_TEST`/ADMIN permission sesuai permission map.

### Tests

- [ ] Scalar encoding.
- [ ] Array encoding.
- [ ] Nested encoding.
- [ ] Moodle exception mapping.
- [ ] HTTP timeout.
- [ ] Non-200 response.
- [ ] Malformed JSON.
- [ ] Secret redaction.
- [ ] Cross-tenant credential rejection.
- [ ] Invalid SSRF target rejection.
- [ ] Invalid token handshake.
- [ ] Plugin health mismatch.
- [ ] Successful connection diagnostic.

## TDD Workflow

### RED

- [ ] Tulis adapter/encryption/SSRF/handshake tests sebelum implementation.

### GREEN

- [ ] Implement minimum secure adapter sampai tests lulus.

### REFACTOR

- [ ] Centralize parameter encoding/error mapping.
- [ ] Pastikan feature layer tidak perlu mengetahui token atau Moodle endpoint format.
- [ ] Pastikan semua server-only boundary eksplisit.

## Acceptance Criteria

- [ ] Seluruh komunikasi Next.js → Moodle melewati adapter ini.
- [ ] `MoodleRestClient` tidak dapat masuk browser bundle.
- [ ] Token tidak tampil pada browser/log/error response.
- [ ] Credential tenant dienkripsi at rest.
- [ ] Tenant A credential tidak dapat dipakai untuk Tenant B.
- [ ] Connection test dapat memvalidasi token dan plugin health.

## Definition of Done (DoD)

- [ ] Adapter test mencakup happy/error/timeout/exception paths.
- [ ] Encryption round-trip dan cross-tenant negative test GREEN.
- [ ] SSRF validation test GREEN.
- [ ] Connection handshake test GREEN.
- [ ] Tidak ada feature yang melakukan raw Moodle fetch di luar adapter.
- [ ] Tidak ada raw token pada client-side state/network response.
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
