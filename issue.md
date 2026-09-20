# ISSUE: Phase 3 — Tenant

## Objective

Implementasikan **Phase 3 — Tenant** sebagai fondasi multi-tenant sebelum authentication dan seluruh feature Moodle lainnya.

Tujuan utama phase ini adalah memastikan setiap request:

1. menentukan tenant berdasarkan hostname/subdomain;
2. mengambil konfigurasi tenant dari repository;
3. tidak mengekspos credential Moodle ke layer luar;
4. hanya menggunakan Moodle credential milik tenant yang benar;
5. menolak tenant yang tidak aktif;
6. membangun `TenantContext`;
7. menghubungkan `TenantContext` ke `MoodleClientFactory`.

Semua Moodle access setelah phase ini harus tenant-aware.

---

# 1. Architectural Context

```text
Incoming Request
      ↓
hostname
      ↓
TenantResolver
      ↓
tenant slug
      ↓
TenantRepository
      ↓
Tenant Entity
      ↓
TenantContext
      ↓
MoodleCredentialProvider
      ↓
MoodleClientFactory
      ↓
MoodleRestClient
```

Tenant resolution terjadi sebelum authentication, course, quiz, attempt, question bank, grade, dan exam monitoring.

Tidak boleh ada Moodle request tanpa `TenantContext` yang valid.

---

# 2. Dependency on Previous Phases

Phase ini mengasumsikan sudah tersedia dari Phase 1:

```text
core/base
core/errors
core/http
core/logger
core/security
core/tenant
core/auth
```

dan dari Phase 2:

```text
core/moodle/
├── MoodleRestClient.ts
├── MoodleClientFactory.ts
├── MoodleCredentialProvider.ts
├── MoodleCredential.ts
├── MoodleErrorMapper.ts
└── MoodleRequestEncoder.ts
```

Gunakan abstraction existing. Jangan menduplikasi abstraction yang sudah tersedia.

---

# 3. Scope

Implement:

- [ ] Tenant entity.
- [ ] Tenant repository port.
- [ ] Tenant persistence adapter.
- [ ] Tenant lookup by subdomain.
- [ ] Tenant status.
- [ ] Moodle configuration.
- [ ] encrypted Moodle credential/configuration.
- [ ] TenantContext mapping.
- [ ] Tenant resolver.
- [ ] Moodle connection test.
- [ ] integration ke `MoodleClientFactory`.
- [ ] tests.

Do not implement yet:

```text
student login
teacher login
Moodle user token flow
course
quiz
quiz attempt
question bank
grade
exam monitor
```

---

# 4. Target Module Structure

```text
src/modules/tenant/
├── domain/
│   ├── dto/
│   │   ├── CreateTenantRequestDTO.ts
│   │   ├── UpdateTenantRequestDTO.ts
│   │   ├── TenantResponseDTO.ts
│   │   ├── TenantDetailResponseDTO.ts
│   │   ├── TenantMoodleConfigDTO.ts
│   │   └── TestTenantConnectionResponseDTO.ts
│   ├── entities/
│   │   └── Tenant.ts
│   ├── interfaces/
│   │   ├── TenantRepository.ts
│   │   ├── TenantCredentialRepository.ts
│   │   └── TenantConnectionTester.ts
│   ├── rules/
│   │   └── TenantRules.ts
│   ├── types/
│   │   ├── TenantStatus.ts
│   │   └── TenantMoodleConfiguration.ts
│   ├── validators/
│   │   └── TenantValidator.ts
│   └── value-objects/
│       └── TenantSlug.ts
│
├── application/
│   └── usecases/
│       ├── CreateTenantUseCase.ts
│       ├── UpdateTenantUseCase.ts
│       ├── GetTenantUseCase.ts
│       ├── GetTenantBySlugUseCase.ts
│       ├── ChangeTenantStatusUseCase.ts
│       └── TestTenantMoodleConnectionUseCase.ts
│
├── infrastructure/
│   ├── mappers/
│   │   └── TenantPersistenceMapper.ts
│   ├── providers/
│   │   ├── EncryptedTenantCredentialProvider.ts
│   │   └── MoodleTenantConnectionTester.ts
│   ├── repositories/
│   │   ├── DatabaseTenantRepository.ts
│   │   └── DatabaseTenantCredentialRepository.ts
│   └── factories/
│       └── createTenantDependencies.ts
│
├── presentation/
│   └── hooks/
│       └── useTenantApi.ts
│
└── __tests__/
    ├── domain/
    ├── application/
    ├── infrastructure/
    └── helpers/
```

---

# 5. Core Tenant Integration

Lengkapi bila Phase 1 baru menyediakan contract:

```text
src/core/tenant/
├── TenantContext.ts
├── TenantResolver.ts
├── TenantResolutionInput.ts
└── resolveCurrentTenant.ts
```

`core/tenant` hanya berisi abstraction/runtime resolution generic.

Business entity `Tenant` tetap berada di:

```text
modules/tenant/domain/
```

---

# 6. Tenant Entity

Tenant entity minimal:

```ts
interface TenantProps {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly status: TenantStatus;
  readonly moodleBaseUrl: string;
  readonly moodleServiceShortname: string | null;
}
```

Credential/token Moodle tidak boleh menjadi public property entity.

Preferred split:

```text
Tenant
→ non-sensitive tenant metadata

TenantCredential
→ encrypted infrastructure concern
```

---

# 7. Tenant Status

Recommended:

```ts
export type TenantStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED";
```

Behavior:

```text
ACTIVE
→ request allowed

INACTIVE
→ tenant exists but application access blocked

SUSPENDED
→ blocked due to administrative restriction
```

---

# 8. TenantSlug Value Object

Recommended format:

```regex
^[a-z0-9]+(?:-[a-z0-9]+)*$
```

Valid:

```text
smpn29
hangtuah2
school-a
school-2026
```

Invalid:

```text
SMPN29
school_a
school a
.school
school.
```

Gunakan satu canonical policy untuk create, lookup, dan hostname resolution.

---

# 9. Tenant Repository Port

```ts
export interface TenantRepository {
  findById(
    tenantId: string,
  ): Promise<Tenant | null>;

  findBySlug(
    slug: string,
  ): Promise<Tenant | null>;

  create(
    tenant: Tenant,
  ): Promise<Tenant>;

  update(
    tenant: Tenant,
  ): Promise<Tenant>;

  existsBySlug(
    slug: string,
  ): Promise<boolean>;
}
```

Jangan membuat generic CRUD base repository hanya karena terlihat serupa.

---

# 10. Tenant Credential Repository

```ts
export interface TenantCredentialRepository {
  getByTenantId(
    tenantId: string,
  ): Promise<TenantMoodleCredential | null>;

  save(
    credential: TenantMoodleCredential,
  ): Promise<void>;

  deleteByTenantId(
    tenantId: string,
  ): Promise<void>;
}
```

Sensitive credential persistence dipisahkan dari tenant metadata.

---

# 11. Moodle Configuration

Tenant Moodle configuration minimal:

```text
baseUrl
serviceShortname
encryptedToken
```

Optional operational metadata:

```text
connectionStatus
lastConnectionTestAt
Moodle version
```

Do not store username/password unless later architecture explicitly requires it.

---

# 12. Encrypted Moodle Configuration

Sensitive fields wajib encrypted at rest.

Minimum:

```text
Moodle token
service credential
future client secret
```

Conceptual storage:

```text
tenantId
encryptedValue
iv / nonce
authTag
keyVersion
createdAt
updatedAt
```

Never store plaintext Moodle token.

---

# 13. Encryption Boundary

Encryption/decryption adalah Infrastructure concern.

```text
Application
   ↓
TenantCredentialRepository
   ↓
EncryptedTenantCredentialProvider
   ↓
EncryptionProvider
   ↓
Database
```

Domain tidak boleh import crypto implementation.

---

# 14. Encryption Requirements

Jika project menggunakan local encryption, gunakan authenticated encryption seperti:

```text
AES-256-GCM
```

Do not use:

```text
Base64 as encryption
MD5
SHA as encryption
AES-ECB
static IV
hard-coded key
```

Encryption key harus server-only.

Contoh:

```text
TENANT_CREDENTIAL_ENCRYPTION_KEY
```

Never use `NEXT_PUBLIC_*` untuk secret.

---

# 15. Hostname Resolution

Example:

```text
smpn29.exam.example.com
```

must resolve to:

```text
smpn29
```

Flow:

```text
Request
 ↓
Host
 ↓
normalized hostname
 ↓
subdomain extraction
 ↓
TenantSlug
 ↓
TenantRepository.findBySlug()
```

---

# 16. Root Domain

Configure:

```text
APP_ROOT_DOMAIN=exam.example.com
```

Then:

```text
smpn29.exam.example.com
→ smpn29
```

Do not hard-code root domain inside resolver.

---

# 17. Hostname Normalization

Handle:

```text
smpn29.exam.example.com
smpn29.exam.example.com:3000
SMPN29.EXAM.EXAMPLE.COM
```

Normalize:

```text
lowercase
remove port
trim whitespace
```

Reject malformed hostname.

---

# 18. Forwarded Host Security

Possible inputs:

```text
host
x-forwarded-host
```

If deployment is behind a trusted reverse proxy, forwarded host may be used according to deployment configuration.

Do not blindly trust arbitrary forwarded headers.

---

# 19. Local Development

Recommended:

```text
smpn29.localhost:3000
school-a.localhost:3000
```

Do not silently map all localhost traffic to one tenant.

---

# 20. TenantResolver Contract

```ts
export interface TenantResolver {
  resolve(
    input: TenantResolutionInput,
  ): Promise<TenantContext | null>;
}
```

Suggested:

```ts
interface TenantResolutionInput {
  readonly hostname: string;
}
```

Keep this abstraction framework-neutral where possible.

---

# 21. resolveCurrentTenant

Expected:

```text
request
 ↓
hostname extraction
 ↓
TenantResolver
 ↓
TenantContext
```

Suggested codes:

```text
TENANT_NOT_FOUND
TENANT_INACTIVE
TENANT_SUSPENDED
TENANT_HOST_INVALID
```

---

# 22. TenantContext

```ts
export interface TenantContext {
  readonly tenantId: string;
  readonly slug: string;
  readonly name: string;
  readonly status: TenantStatus;
}
```

Must not contain:

```text
Moodle token
encrypted credential
encryption key
auth tag
```

---

# 23. Tenant → MoodleClientFactory

Target:

```ts
const tenant =
  await resolveCurrentTenant(
    request,
    tenantResolver,
  );

const moodleClient =
  await moodleClientFactory.create({
    tenant,
    requestId,
  });
```

Factory flow:

```text
TenantContext
 ↓
MoodleCredentialProvider
 ↓
server-side decrypted credential
 ↓
MoodleRestClient
```

---

# 24. EncryptedTenantCredentialProvider

Responsibilities:

```text
tenantId
 ↓
TenantCredentialRepository
 ↓
encrypted credential
 ↓
EncryptionProvider.decrypt()
 ↓
MoodleCredential
```

Plain token tidak boleh keluar dari provider/factory infrastructure path selain untuk instantiate `MoodleRestClient`.

---

# 25. Moodle Connection Test

Implement:

```text
TestTenantMoodleConnectionUseCase
```

Use:

```text
core_webservice_get_site_info
```

through:

```text
MoodleClientFactory
→ MoodleRestClient
```

No direct fetch.

---

# 26. Connection Test Flow

```text
tenantId
 ↓
TenantRepository
 ↓
Tenant exists
 ↓
MoodleClientFactory
 ↓
MoodleRestClient
 ↓
core_webservice_get_site_info
 ↓
safe connection result DTO
```

Example:

```ts
interface TestTenantConnectionResponseDTO {
  readonly success: boolean;
  readonly moodleVersion?: string;
  readonly siteName?: string;
  readonly message: string;
}
```

Never return token or raw Moodle response.

---

# 27. Connection Error Mapping

Suggested:

```text
invalid token
→ TENANT_MOODLE_INVALID_CREDENTIAL

timeout
→ TENANT_MOODLE_TIMEOUT

network
→ TENANT_MOODLE_UNREACHABLE

invalid response
→ TENANT_MOODLE_INVALID_RESPONSE
```

---

# 28. Administrative Status vs Moodle Health

Do not equate temporary Moodle outage with tenant deactivation.

Keep separate:

```text
Tenant.status
```

and:

```text
Moodle connectivity status
```

A failed connection test must not automatically change `ACTIVE → INACTIVE`.

---

# 29. Tenant Creation

`CreateTenantUseCase` validates:

- [ ] slug.
- [ ] name.
- [ ] Moodle base URL.
- [ ] service shortname.
- [ ] slug uniqueness.
- [ ] credential presence when required.

Flow:

```text
request
 ↓
validation
 ↓
TenantRules
 ↓
slug uniqueness
 ↓
create Tenant
 ↓
encrypt/store Moodle credential
```

---

# 30. Tenant Creation Atomicity

Tenant metadata + credential must not silently leave a half-configured tenant.

Prefer transaction where supported.

Otherwise document compensation strategy.

---

# 31. Tenant Update

Separate:

```text
metadata
Moodle configuration
status
```

If token omitted during metadata update:

```text
preserve current credential
```

unless explicit replacement/removal requested.

---

# 32. Secret API Response Rule

Never return:

```text
moodleToken
encryptedMoodleToken
iv
authTag
encryption key
```

Safe response:

```json
{
  "id": "tenant-1",
  "slug": "smpn29",
  "name": "SMPN 29 Jakarta",
  "status": "ACTIVE",
  "moodle": {
    "baseUrl": "https://moodle.example.com",
    "serviceShortname": "exam_frontend",
    "configured": true
  }
}
```

---

# 33. Persistence Mapper

Use:

```text
TenantPersistenceMapper
```

Flow:

```text
ORM/database row
 ↓
TenantPersistenceMapper
 ↓
Tenant entity
```

Persistence model must not leak into domain.

---

# 34. Database Rules

Use database/ORM already selected by project.

If Prisma exists, infrastructure may use Prisma.

Do not introduce a second ORM.

---

# 35. Suggested Persistence Model

```text
Tenant
------
id
slug
name
status
moodleBaseUrl
moodleServiceShortname
createdAt
updatedAt

TenantCredential
----------------
id
tenantId
encryptedToken
iv
authTag
keyVersion
createdAt
updatedAt
```

Require unique constraint:

```text
Tenant.slug
```

---

# 36. ChangeTenantStatusUseCase

Implement:

```text
ChangeTenantStatusUseCase
```

Input:

```ts
{
  tenantId,
  status,
}
```

Rules:

- [ ] valid status.
- [ ] tenant exists.
- [ ] update status.
- [ ] safe response.
- [ ] no credential leakage.

---

# 37. Mandatory Workflow

```text
RED
↓
GREEN
↓
REFACTOR
```

Do not implement production code before RED tests establish expected behavior.

---

# 38. RED — Domain Tests

## TenantSlug

- [ ] valid lowercase slug.
- [ ] hyphen allowed.
- [ ] whitespace rejected.
- [ ] underscore rejected.
- [ ] empty rejected.
- [ ] normalization policy tested.
- [ ] max length tested if defined.

## Tenant

- [ ] valid entity creation.
- [ ] valid status.
- [ ] invalid state rejected.
- [ ] credentials not exposed.

## TenantRules

- [ ] ACTIVE usable.
- [ ] INACTIVE rejected.
- [ ] SUSPENDED rejected.

---

# 39. RED — Application Tests

## CreateTenantUseCase

- [ ] creates tenant.
- [ ] duplicate slug rejected.
- [ ] credential saved through credential port.
- [ ] credential failure does not silently succeed.
- [ ] response contains no token.

## UpdateTenantUseCase

- [ ] metadata update.
- [ ] Moodle config update.
- [ ] missing new token preserves existing token.
- [ ] tenant not found.

## GetTenantUseCase

- [ ] tenant exists.
- [ ] not found.
- [ ] safe DTO.

## GetTenantBySlugUseCase

- [ ] slug lookup.
- [ ] unknown slug.
- [ ] canonical slug handling.

## ChangeTenantStatusUseCase

- [ ] ACTIVE.
- [ ] INACTIVE.
- [ ] SUSPENDED.
- [ ] tenant not found.

## TestTenantMoodleConnectionUseCase

- [ ] success.
- [ ] invalid credential.
- [ ] timeout.
- [ ] unreachable.
- [ ] no credential configured.
- [ ] no secret returned.

---

# 40. RED — Tenant Resolution Tests

```text
smpn29.exam.example.com
→ smpn29
```

```text
smpn29.exam.example.com:443
→ smpn29
```

```text
SMPN29.EXAM.EXAMPLE.COM
→ smpn29
```

Root domain:

```text
exam.example.com
→ no tenant
```

Unrelated domain:

```text
attacker.example.net
→ rejected
```

Unknown tenant:

```text
unknown.exam.example.com
→ TENANT_NOT_FOUND
```

Status:

```text
INACTIVE
→ TENANT_INACTIVE

SUSPENDED
→ TENANT_SUSPENDED
```

---

# 41. RED — Encryption Tests

- [ ] encrypted value differs from plaintext.
- [ ] decrypt restores credential.
- [ ] random IV/nonce produces different ciphertext.
- [ ] corrupted ciphertext fails.
- [ ] invalid auth tag fails.
- [ ] wrong key fails.
- [ ] safe error does not contain token.
- [ ] key is not logged.

---

# 42. RED — Credential Isolation Tests

Scenario:

```text
Tenant A → TOKEN_A
Tenant B → TOKEN_B
```

Expected:

```text
Tenant A → TOKEN_A
Tenant B → TOKEN_B
```

Never cross-bind credentials.

Also test:

- [ ] missing credential.
- [ ] repository failure.
- [ ] decryption failure.
- [ ] token absent from logger.

---

# 43. RED — Connection Tester Tests

Use mocked `MoodleRestClient`.

Do not connect to live Moodle in unit tests.

Test:

- [ ] `core_webservice_get_site_info` success.
- [ ] invalid credential mapping.
- [ ] timeout mapping.
- [ ] network mapping.
- [ ] malformed Moodle response.
- [ ] safe response.

---

# 44. GREEN Implementation Order

```text
1. TenantStatus
2. TenantSlug
3. Tenant entity
4. TenantRules
5. Tenant DTOs
6. TenantRepository
7. TenantCredentialRepository
8. TenantPersistenceMapper
9. DatabaseTenantRepository
10. DatabaseTenantCredentialRepository
11. encryption provider integration
12. EncryptedTenantCredentialProvider
13. Tenant resolver
14. resolveCurrentTenant
15. tenant use cases
16. MoodleTenantConnectionTester
17. TestTenantMoodleConnectionUseCase
18. MoodleClientFactory integration
```

---

# 45. No Mutable Global Tenant State

Forbidden:

```ts
let currentTenant;
let activeTenant;
let activeMoodleToken;
```

Tenant context must be request-scoped.

---

# 46. API Routes

If tenant administration API is included:

```text
GET    /api/v1/tenants
POST   /api/v1/tenants

GET    /api/v1/tenants/:tenantId
PATCH  /api/v1/tenants/:tenantId

PATCH  /api/v1/tenants/:tenantId/status

POST   /api/v1/tenants/:tenantId/test-connection
```

If admin authorization is not ready, do not expose unsafe management routes publicly merely to satisfy this issue.

---

# 47. Presentation Hook

If required:

```text
modules/tenant/presentation/hooks/useTenantApi.ts
```

It may only call internal `/api/v1/tenants/*`.

---

# 48. Logging

Safe:

```text
tenantId
tenantSlug
requestId
event
```

Forbidden:

```text
Moodle token
encrypted token
IV
authTag
encryption key
```

Suggested events:

```text
tenant_resolved
tenant_resolution_failed
tenant_created
tenant_updated
tenant_status_changed
tenant_moodle_connection_tested
tenant_moodle_connection_failed
```

---

# 49. Error Codes

Suggested:

```text
TENANT_NOT_FOUND
TENANT_SLUG_INVALID
TENANT_SLUG_EXISTS
TENANT_INACTIVE
TENANT_SUSPENDED
TENANT_HOST_INVALID
TENANT_CONFIGURATION_INVALID
TENANT_CREDENTIAL_NOT_CONFIGURED
TENANT_CREDENTIAL_DECRYPTION_FAILED
TENANT_MOODLE_INVALID_CREDENTIAL
TENANT_MOODLE_TIMEOUT
TENANT_MOODLE_UNREACHABLE
TENANT_MOODLE_INVALID_RESPONSE
```

---

# 50. Layer Boundaries

## Domain may know

```text
Tenant
TenantStatus
TenantSlug
TenantRepository
TenantRules
```

## Domain must not know

```text
Prisma
PostgreSQL
crypto implementation
MoodleRestClient
NextRequest
headers
cookies
```

## Application may orchestrate

```text
TenantRepository
TenantCredentialRepository
TenantConnectionTester
```

## Application must not directly use

```text
Prisma
fetch
crypto
Moodle REST
```

## Infrastructure may implement/use

```text
DatabaseTenantRepository
DatabaseTenantCredentialRepository
EncryptedTenantCredentialProvider
MoodleTenantConnectionTester
database client
EncryptionProvider
MoodleRestClient
```

---

# 51. Security Requirements

- [ ] Moodle token encrypted at rest.
- [ ] encryption key server-only.
- [ ] no token in API response.
- [ ] no token in logs.
- [ ] no cross-tenant credential access.
- [ ] root domain configurable.
- [ ] hostname validation implemented.
- [ ] forwarded host trust documented.
- [ ] tenant status enforced before Moodle usage.
- [ ] inactive/suspended tenant cannot obtain normal Moodle client.

---

# 52. Verification Commands

Run:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Use the package manager/scripts already configured.

---

# 53. Security Scan Before Completion

Search for:

```text
moodleToken
encryptedToken
TENANT_CREDENTIAL_ENCRYPTION_KEY
```

Verify:

- [ ] token never returned.
- [ ] token never logged.
- [ ] encryption key is server-only.
- [ ] no secret uses `NEXT_PUBLIC_*`.

Search for mutable global tenant state:

```text
activeTenant
currentTenant
activeMoodleToken
```

Must not exist.

---

# 54. Acceptance Criteria

## Tenant Domain

- [ ] Tenant entity implemented.
- [ ] explicit TenantStatus.
- [ ] canonical TenantSlug.
- [ ] no credentials exposed by entity.
- [ ] rules tested.

## Repository

- [ ] TenantRepository implemented.
- [ ] infrastructure repository implemented.
- [ ] lookup by slug.
- [ ] lookup by ID.
- [ ] unique slug enforced.
- [ ] persistence errors normalized.

## Resolution

- [ ] hostname normalized.
- [ ] tenant slug extracted from subdomain.
- [ ] root domain configurable.
- [ ] invalid host rejected.
- [ ] unknown tenant handled.
- [ ] inactive tenant rejected.
- [ ] suspended tenant rejected.
- [ ] `resolveCurrentTenant` returns safe context.

## Credential Security

- [ ] Moodle token encrypted at rest.
- [ ] authenticated encryption.
- [ ] key server-only.
- [ ] token absent from API.
- [ ] token absent from logs.
- [ ] A/B credential isolation tested.
- [ ] decryption only on server infrastructure path.

## Moodle Integration

- [ ] `MoodleCredentialProvider` integrated with tenant storage.
- [ ] `MoodleClientFactory` builds client from TenantContext.
- [ ] Moodle connection test implemented.
- [ ] uses `core_webservice_get_site_info`.
- [ ] failures normalized.
- [ ] no direct Moodle fetch.

## Quality

- [ ] RED tests created.
- [ ] GREEN implementation passes.
- [ ] REFACTOR completed.
- [ ] TypeScript passes.
- [ ] Biome passes.
- [ ] tests pass.
- [ ] build passes.
- [ ] no unexplained `any`.
- [ ] no dead code.
- [ ] no circular dependencies.

---

# 55. Definition of Done

Phase 3 selesai ketika request dapat melakukan:

```ts
const tenant =
  await resolveCurrentTenant(
    request,
    tenantResolver,
  );

const moodleClient =
  await moodleClientFactory.create({
    tenant,
    requestId,
  });

const siteInfo =
  await moodleClient.call<SiteInfoResponse>(
    "core_webservice_get_site_info",
  );
```

dengan jaminan:

```text
hostname menentukan tenant
tenant menentukan credential
credential encrypted at rest
credential tenant tidak bocor lintas tenant
inactive/suspended tenant ditolak
Moodle token tidak keluar ke browser
```

---

# 56. Expected Final Flow

```text
https://smpn29.exam.example.com
        ↓
smpn29.exam.example.com
        ↓
smpn29
        ↓
TenantRepository.findBySlug("smpn29")
        ↓
Tenant
        ↓
status check
        ↓
TenantContext
        ↓
MoodleCredentialProvider
        ↓
decrypt credential server-side
        ↓
MoodleClientFactory
        ↓
MoodleRestClient
        ↓
Moodle milik tenant SMPN29
```

Another tenant:

```text
school-b.exam.example.com
→ Tenant B
→ Credential B
→ Moodle B
```

must resolve independently.

---

# 57. Explicit Non-Goals

Do not implement during Phase 3:

- [ ] user login.
- [ ] student authentication.
- [ ] teacher authentication.
- [ ] Moodle `/login/token.php` user flow.
- [ ] courses.
- [ ] quizzes.
- [ ] quiz attempts.
- [ ] questions.
- [ ] grades.
- [ ] files.
- [ ] notifications.
- [ ] exam monitoring.
- [ ] billing/subscription.
- [ ] complex tenant cache.
- [ ] unrelated UI.

---

# 58. Required Final Report

After implementation report:

```text
1. Files created
2. Files modified
3. RED tests added
4. GREEN implementation completed
5. Tenant slug policy
6. Hostname resolution strategy
7. Credential encryption strategy
8. MoodleClientFactory integration
9. Connection test behavior
10. Multi-tenant isolation verification
11. TypeScript/Biome/test/build results
12. Remaining Phase 3 TODO / risks
```

Also include:

```text
Tenant isolation audit: PASS / FAIL
Credential exposure audit: PASS / FAIL
Hostname resolution audit: PASS / FAIL
Moodle client tenant-binding audit: PASS / FAIL
```

---

# 59. Next Phase Readiness

After Phase 3:

```text
Request
 ↓
resolveCurrentTenant
 ↓
TenantContext
 ↓
Moodle tenant configuration
 ↓
Authentication
 ↓
CurrentActor
```

Authentication must not occur before tenant resolution for normal tenant-scoped requests.

Recommended next issue:

```text
Phase 4 — Authentication
```

Phase 3 berhasil hanya ketika **tenant identity dan Moodle credential selection deterministic, isolated, encrypted, server-only, dan tersedia sebelum authentication dimulai**.
