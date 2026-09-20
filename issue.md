# PLANNING — Phase 3 Tenant & Custom Domain Resolution

## 1. Objective

Membangun mekanisme multi-tenant untuk SaaS ujian berbasis Next.js + Moodle dengan karakteristik:

- setiap tenant/sekolah dapat memiliki domain frontend sendiri;
- domain tidak harus berada di bawah satu parent domain;
- domain sudah diarahkan melalui Nginx ke aplikasi Next.js;
- tenant ditentukan dari **exact hostname mapping**, bukan dari subdomain extraction;
- setiap tenant memiliki konfigurasi Moodle sendiri;
- setiap tenant dapat menunjuk ke Moodle instance/domain yang berbeda;
- Moodle credential tersimpan terenkripsi;
- tidak ada cross-tenant credential leakage;
- tenant resolution selalu terjadi sebelum authentication dan akses Moodle.

Contoh:

```text
Tenant SMPN 29

Frontend:
https://ujian.smpn29jkt.sch.id

Moodle:
https://lms.smpn29jkt.sch.id
```

Tenant lain dapat menggunakan pola yang berbeda:

```text
Frontend:
https://cbt.sekolahb.id

Moodle:
https://elearning.sekolahb.sch.id
```

Tidak ada requirement parent domain yang sama.

---

# 2. Final Architecture

```text
Browser
   ↓
https://ujian.smpn29jkt.sch.id
   ↓
Nginx
   ↓
Next.js
   ↓
Request Hostname
   ↓
normalize hostname
   ↓
TenantDomainRepository.findByHostname()
   ↓
TenantDomain
   ↓
TenantRepository.findById()
   ↓
Tenant
   ↓
TenantContext
   ↓
TenantMoodleConfiguration
   ↓
MoodleCredentialProvider
   ↓
MoodleClientFactory
   ↓
MoodleRestClient
   ↓
https://lms.smpn29jkt.sch.id
```

Tenant tidak ditentukan oleh Moodle.

Tenant authority berada di Next.js.

---

# 3. Core Principle

Jangan gunakan `subdomain extraction` sebagai tenant authority.

Gunakan **exact hostname lookup**:

```text
ujian.smpn29jkt.sch.id
→ Tenant SMPN29

cbt.sekolahb.id
→ Tenant School B

asesmen.school-c.sch.id
→ Tenant School C
```

---

# 4. Main Domain Models

Gunakan pemisahan:

```text
Tenant
TenantDomain
TenantMoodleConfiguration
TenantMoodleCredential
```

Jangan menyimpan seluruh informasi dalam satu entity besar.

---

# 5. Tenant

Suggested fields:

```text
id
slug
name
status
createdAt
updatedAt
```

Example:

```json
{
  "id": "tenant-smpn29",
  "slug": "smpn29",
  "name": "SMP Negeri 29 Jakarta",
  "status": "ACTIVE"
}
```

`slug` hanya identifier internal. Slug tidak menentukan domain.

---

# 6. Tenant Status

```text
ACTIVE
INACTIVE
SUSPENDED
```

Behavior:

```text
ACTIVE
→ normal access allowed

INACTIVE
→ tenant exists but access disabled

SUSPENDED
→ tenant blocked administratively
```

---

# 7. TenantDomain

Suggested fields:

```text
id
tenantId
hostname
type
isPrimary
status
createdAt
updatedAt
```

Example:

```json
{
  "tenantId": "tenant-smpn29",
  "hostname": "ujian.smpn29jkt.sch.id",
  "type": "FRONTEND",
  "isPrimary": true,
  "status": "ACTIVE"
}
```

---

# 8. TenantDomain Type

```text
FRONTEND
ADMIN
ALIAS
```

Example:

```text
ujian.smpn29jkt.sch.id
→ FRONTEND

admin.smpn29jkt.sch.id
→ ADMIN

asesmen.smpn29jkt.sch.id
→ ALIAS
```

---

# 9. TenantDomain Status

```text
PENDING
ACTIVE
DISABLED
```

Onboarding:

```text
Create domain
   ↓
PENDING
   ↓
DNS/Nginx/TLS configured
   ↓
verification
   ↓
ACTIVE
```

Normal tenant resolution hanya menerima `ACTIVE`.

---

# 10. TenantMoodleConfiguration

Suggested fields:

```text
tenantId
baseUrl
serviceShortnameStudent
serviceShortnameAdmin
apiVersion
connectionStatus
lastConnectionTestAt
createdAt
updatedAt
```

Example:

```json
{
  "tenantId": "tenant-smpn29",
  "baseUrl": "https://lms.smpn29jkt.sch.id",
  "serviceShortnameStudent": "nextjs_student",
  "serviceShortnameAdmin": "nextjs_admin",
  "apiVersion": 1,
  "connectionStatus": "CONNECTED"
}
```

---

# 11. TenantMoodleCredential

Suggested fields:

```text
id
tenantId
type
encryptedToken
iv
authTag
keyVersion
createdAt
updatedAt
```

Credential type awal:

```text
ADMIN_SERVICE
```

Student Moodle token tidak disimpan sebagai tenant credential; token siswa bersifat per-user/per-session.

---

# 12. Domain Mapping Example

```text
Tenant
------------------------------------------------
tenant-smpn29
tenant-school-b

TenantDomain
------------------------------------------------
ujian.smpn29jkt.sch.id      → tenant-smpn29
asesmen.smpn29jkt.sch.id    → tenant-smpn29
cbt.sekolahb.id              → tenant-school-b

TenantMoodleConfiguration
------------------------------------------------
tenant-smpn29
→ https://lms.smpn29jkt.sch.id

tenant-school-b
→ https://elearning.sekolahb.sch.id
```

---

# 13. Exact Hostname Resolution

```text
Host: ujian.smpn29jkt.sch.id
   ↓
normalize
   ↓
TenantDomainRepository.findByHostname(
  "ujian.smpn29jkt.sch.id"
)
   ↓
TenantDomain
   ↓
tenantId
   ↓
TenantRepository.findById()
   ↓
TenantContext
```

Tidak ada string manipulation untuk menemukan tenant.

---

# 14. Forbidden Tenant Resolution

Jangan gunakan:

```ts
hostname.split(".")[0]
```

Jangan gunakan:

```ts
hostname.replace("ujian.", "")
```

Jangan gunakan shared root domain sebagai requirement global.

Jangan mengubah frontend hostname menjadi Moodle URL menggunakan string replacement.

Moodle URL selalu berasal dari database configuration.

---

# 15. Hostname Normalization

Utility:

```text
normalizeRequestHostname()
```

Behavior:

```text
lowercase
trim whitespace
remove port
remove trailing dot if supported
validate hostname syntax
```

Examples:

```text
UJIAN.SMPN29JKT.SCH.ID
→ ujian.smpn29jkt.sch.id

ujian.smpn29jkt.sch.id:443
→ ujian.smpn29jkt.sch.id
```

---

# 16. Nginx Integration

Nginx menjadi trusted reverse proxy.

```nginx
server {
    listen 443 ssl http2;

    server_name ujian.smpn29jkt.sch.id;

    location / {
        proxy_pass http://127.0.0.1:3000;

        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Tenant lain dapat memiliki `server_name` berbeda tetapi mengarah ke Next.js instance yang sama.

---

# 17. Trusted Host Resolution

Implement helper:

```text
resolveRequestHostname(request)
```

Recommended strategy:

```text
trusted X-Forwarded-Host
   ↓
Host fallback
   ↓
normalize
   ↓
validate
```

Jangan mempercayai arbitrary forwarded headers tanpa konfigurasi trusted proxy.

---

# 18. Tenant Resolver

```ts
export interface TenantResolver {
  resolveByHostname(
    hostname: string,
  ): Promise<TenantContext | null>;
}
```

Jangan gunakan `resolveBySubdomain()`.

---

# 19. TenantDomainRepository

```ts
export interface TenantDomainRepository {
  findByHostname(
    hostname: string,
  ): Promise<TenantDomain | null>;

  findByTenantId(
    tenantId: string,
  ): Promise<readonly TenantDomain[]>;

  create(
    domain: TenantDomain,
  ): Promise<TenantDomain>;

  update(
    domain: TenantDomain,
  ): Promise<TenantDomain>;

  existsByHostname(
    hostname: string,
  ): Promise<boolean>;
}
```

---

# 20. TenantRepository

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
}
```

---

# 21. TenantMoodleConfigurationRepository

```ts
export interface TenantMoodleConfigurationRepository {
  getByTenantId(
    tenantId: string,
  ): Promise<TenantMoodleConfiguration | null>;

  save(
    config: TenantMoodleConfiguration,
  ): Promise<void>;

  update(
    config: TenantMoodleConfiguration,
  ): Promise<void>;
}
```

---

# 22. TenantCredentialRepository

```ts
export interface TenantCredentialRepository {
  getAdminServiceCredential(
    tenantId: string,
  ): Promise<TenantMoodleCredential | null>;

  saveAdminServiceCredential(
    credential: TenantMoodleCredential,
  ): Promise<void>;
}
```

---

# 23. Target Module Structure

```text
src/modules/tenant/
├── domain/
│   ├── dto/
│   │   ├── CreateTenantRequestDTO.ts
│   │   ├── UpdateTenantRequestDTO.ts
│   │   ├── TenantResponseDTO.ts
│   │   ├── TenantDomainDTO.ts
│   │   ├── TenantMoodleConfigurationDTO.ts
│   │   └── TestTenantConnectionResponseDTO.ts
│   ├── entities/
│   │   ├── Tenant.ts
│   │   └── TenantDomain.ts
│   ├── interfaces/
│   │   ├── TenantRepository.ts
│   │   ├── TenantDomainRepository.ts
│   │   ├── TenantMoodleConfigurationRepository.ts
│   │   ├── TenantCredentialRepository.ts
│   │   └── TenantConnectionTester.ts
│   ├── rules/
│   │   ├── TenantRules.ts
│   │   └── TenantDomainRules.ts
│   ├── types/
│   │   ├── TenantStatus.ts
│   │   ├── TenantDomainStatus.ts
│   │   ├── TenantDomainType.ts
│   │   ├── TenantConnectionStatus.ts
│   │   └── TenantMoodleConfiguration.ts
│   ├── validators/
│   │   ├── TenantValidator.ts
│   │   └── TenantDomainValidator.ts
│   └── value-objects/
│       ├── TenantSlug.ts
│       └── TenantHostname.ts
│
├── application/
│   └── usecases/
│       ├── CreateTenantUseCase.ts
│       ├── UpdateTenantUseCase.ts
│       ├── GetTenantUseCase.ts
│       ├── AddTenantDomainUseCase.ts
│       ├── UpdateTenantDomainUseCase.ts
│       ├── VerifyTenantDomainUseCase.ts
│       ├── ChangeTenantStatusUseCase.ts
│       ├── ConfigureTenantMoodleUseCase.ts
│       └── TestTenantMoodleConnectionUseCase.ts
│
├── infrastructure/
│   ├── mappers/
│   │   ├── TenantPersistenceMapper.ts
│   │   ├── TenantDomainPersistenceMapper.ts
│   │   └── TenantMoodleConfigurationMapper.ts
│   ├── providers/
│   │   ├── EncryptedTenantCredentialProvider.ts
│   │   ├── HostnameTenantResolver.ts
│   │   └── MoodleTenantConnectionTester.ts
│   ├── repositories/
│   │   ├── DatabaseTenantRepository.ts
│   │   ├── DatabaseTenantDomainRepository.ts
│   │   ├── DatabaseTenantMoodleConfigurationRepository.ts
│   │   └── DatabaseTenantCredentialRepository.ts
│   └── factories/
│       └── createTenantDependencies.ts
│
└── __tests__/
    ├── domain/
    ├── application/
    ├── infrastructure/
    └── helpers/
```

---

# 24. Core Tenant Structure

```text
src/core/tenant/
├── TenantContext.ts
├── TenantResolver.ts
├── TenantResolutionInput.ts
├── normalizeRequestHostname.ts
├── resolveRequestHostname.ts
└── resolveCurrentTenant.ts
```

---

# 25. TenantContext

```ts
export interface TenantContext {
  readonly tenantId: string;
  readonly slug: string;
  readonly name: string;
  readonly status: TenantStatus;
  readonly hostname: string;
}
```

Do not include Moodle credential or token.

---

# 26. Tenant Resolution Flow

```text
Request
  ↓
resolveRequestHostname()
  ↓
normalizeRequestHostname()
  ↓
TenantDomainRepository.findByHostname()
  ↓
TenantDomain
  ↓
check DomainStatus
  ↓
TenantRepository.findById()
  ↓
check TenantStatus
  ↓
TenantContext
```

---

# 27. Domain Resolution Errors

```text
TENANT_DOMAIN_INVALID
TENANT_DOMAIN_NOT_FOUND
TENANT_DOMAIN_INACTIVE
TENANT_NOT_FOUND
TENANT_INACTIVE
TENANT_SUSPENDED
```

---

# 28. Exact Hostname Uniqueness

Database constraint:

```text
TenantDomain.hostname UNIQUE
```

Satu hostname tidak boleh memetakan ke dua tenant.

---

# 29. Tenant Alias

Satu tenant boleh memiliki beberapa domain:

```text
ujian.smpn29jkt.sch.id
→ SMPN29

asesmen.smpn29jkt.sch.id
→ SMPN29
```

Keduanya menghasilkan TenantContext yang sama.

---

# 30. Moodle Configuration Resolution

```text
TenantContext
   ↓
TenantMoodleConfigurationRepository
   ↓
Moodle Configuration
   ↓
MoodleCredentialProvider
   ↓
MoodleClientFactory
```

Jangan derive Moodle URL dari request hostname.

---

# 31. Moodle Service Separation

Prepare two service contexts:

```text
nextjs_student
nextjs_admin
```

`nextjs_student`:

```text
student Moodle user token
→ quiz attempt lifecycle
```

`nextjs_admin`:

```text
tenant service account token
→ local_examapi / admin operations
```

---

# 32. Student Credential Flow

Authentication phase nanti:

```text
Request hostname
   ↓
TenantContext
   ↓
Tenant Moodle base URL
   ↓
/login/token.php
service=nextjs_student
   ↓
Moodle user token
   ↓
encrypted session-side storage
```

Student token bukan tenant credential.

---

# 33. Admin Credential Flow

```text
TenantContext
   ↓
TenantMoodleConfiguration
   ↓
TenantMoodleCredential
   ↓
decrypt server-side
   ↓
MoodleClientFactory
   ↓
nextjs_admin
```

---

# 34. Moodle Connection Test

```text
Tenant
 ↓
TenantMoodleConfiguration
 ↓
Admin Service Credential
 ↓
MoodleClientFactory
 ↓
core_webservice_get_site_info
 ↓
local_examapi_get_health
 ↓
validate functions/API version
```

---

# 35. Connection Status

Separate from tenant status:

```text
CONNECTED
DEGRADED
DISCONNECTED
INVALID_CREDENTIAL
INCOMPATIBLE
```

---

# 36. Nginx Onboarding Flow

```text
1. Create Tenant
2. Register TenantDomain as PENDING
3. Configure DNS
4. Configure Nginx server_name
5. Configure TLS certificate
6. Verify hostname
7. Mark TenantDomain ACTIVE
8. Configure Moodle base URL
9. Store encrypted Moodle admin credential
10. Test Moodle connection
11. Mark Moodle connection CONNECTED
12. Tenant ready
```

---

# 37. Domain Verification

Recommended:

```text
request domain through HTTPS
↓
confirm request reaches correct Next.js deployment
↓
hostname resolves to expected TenantDomain
↓
mark ACTIVE
```

Do not activate domain that is not configured in DNS/Nginx/TLS.

---

# 38. RED Tests — Hostname

- [ ] lowercase hostname.
- [ ] uppercase normalized.
- [ ] port removed.
- [ ] invalid hostname rejected.
- [ ] unknown hostname rejected.
- [ ] disabled domain rejected.
- [ ] alias domain resolves.
- [ ] exact-match only.
- [ ] substring domain does not match.
- [ ] one hostname cannot map to two tenants.

---

# 39. RED Tests — Tenant Isolation

```text
ujian.smpn29jkt.sch.id
→ Tenant A
→ Moodle A

cbt.sekolahb.id
→ Tenant B
→ Moodle B
```

Assert no cross-tenant configuration or credential leakage.

---

# 40. RED Tests — Moodle Mapping

Verify:

```text
ujian.smpn29jkt.sch.id
→ Tenant SMPN29
→ lms.smpn29jkt.sch.id
```

and:

```text
cbt.sekolahb.id
→ Tenant School B
→ elearning.sekolahb.sch.id
```

Moodle URL must come from persisted configuration, not hostname transformation.

---

# 41. RED Tests — Domain Status

```text
PENDING
→ rejected

ACTIVE
→ allowed

DISABLED
→ rejected
```

---

# 42. RED Tests — Tenant Status

```text
ACTIVE
→ allowed

INACTIVE
→ rejected

SUSPENDED
→ rejected
```

---

# 43. GREEN Implementation Order

```text
1. TenantStatus
2. TenantDomainStatus
3. TenantDomainType
4. TenantSlug
5. TenantHostname
6. Tenant entity
7. TenantDomain entity
8. repositories/ports
9. persistence mappers
10. database repositories
11. hostname normalization
12. request hostname resolver
13. HostnameTenantResolver
14. resolveCurrentTenant
15. TenantMoodleConfiguration repository
16. encrypted credential repository/provider
17. MoodleClientFactory integration
18. connection test
19. domain verification flow
```

---

# 44. API Planning

Potential admin APIs:

```text
POST   /api/v1/tenants
GET    /api/v1/tenants/:tenantId
PATCH  /api/v1/tenants/:tenantId

POST   /api/v1/tenants/:tenantId/domains
PATCH  /api/v1/tenants/:tenantId/domains/:domainId
POST   /api/v1/tenants/:tenantId/domains/:domainId/verify

PUT    /api/v1/tenants/:tenantId/moodle
POST   /api/v1/tenants/:tenantId/moodle/test-connection

PATCH  /api/v1/tenants/:tenantId/status
```

Do not expose management routes publicly before admin authorization exists.

---

# 45. Security Rules

Tenant identity must never come from query parameter, request body, localStorage, or arbitrary client-supplied tenantId.

Normal tenant authority:

```text
trusted request hostname
→ exact TenantDomain mapping
```

---

# 46. Proxy Security

- [ ] preserve Host.
- [ ] set X-Forwarded-Host.
- [ ] set X-Forwarded-Proto.
- [ ] document trusted reverse proxy.
- [ ] do not trust forwarded host from arbitrary untrusted deployment.

---

# 47. Credential Security

- [ ] encrypt Moodle service token at rest.
- [ ] encryption key server-only.
- [ ] no secret in API response.
- [ ] no token in logger.
- [ ] no token in TenantContext.
- [ ] no mutable global credential.
- [ ] credential lookup always scoped by tenantId.

---

# 48. Forbidden Patterns

Do not implement:

```ts
const tenantSlug = hostname.split(".")[0];
```

Do not implement:

```ts
const moodleUrl = hostname.replace("ujian.", "lms.");
```

Do not implement client-controlled tenantId as security authority.

Do not implement global mutable `currentTenant`.

---

# 49. Logging

Safe context:

```text
requestId
hostname
tenantId
tenantSlug
event
```

Suggested events:

```text
tenant_domain_resolved
tenant_domain_not_found
tenant_domain_disabled
tenant_resolved
tenant_blocked
tenant_moodle_configuration_loaded
tenant_moodle_connection_tested
```

Never log Moodle token, encrypted token, encryption key, session token, or password.

---

# 50. Acceptance Criteria

## Domain Mapping

- [ ] custom domains supported.
- [ ] no shared parent domain required.
- [ ] exact hostname lookup implemented.
- [ ] hostname unique constraint.
- [ ] aliases supported.
- [ ] domain status supported.

## Tenant Resolution

- [ ] hostname normalized.
- [ ] Nginx forwarded hostname supported safely.
- [ ] TenantDomain resolved.
- [ ] Tenant resolved.
- [ ] TenantContext generated.
- [ ] blocked tenants rejected.

## Moodle Mapping

- [ ] Moodle URL loaded from persisted config.
- [ ] Moodle URL not inferred from frontend hostname.
- [ ] admin service config supported.
- [ ] student service config supported.
- [ ] Moodle connection status separate from TenantStatus.

## Security

- [ ] no cross-tenant Moodle config.
- [ ] no cross-tenant credential leakage.
- [ ] no token in TenantContext.
- [ ] no token in browser.
- [ ] no token in logs.
- [ ] credential encrypted at rest.

## Infrastructure

- [ ] Nginx custom domains documented.
- [ ] DNS/TLS onboarding documented.
- [ ] domain verification flow exists.

## Quality

- [ ] RED tests written.
- [ ] GREEN implementation complete.
- [ ] REFACTOR complete.
- [ ] TypeScript passes.
- [ ] Biome passes.
- [ ] tests pass.
- [ ] production build passes.

---

# 51. Definition of Done

Phase 3 tenant/custom-domain foundation selesai ketika:

```text
https://ujian.smpn29jkt.sch.id
```

resolves to:

```text
Tenant SMPN29
```

and then to:

```text
https://lms.smpn29jkt.sch.id
```

while:

```text
https://cbt.sekolahb.id
```

resolves independently to:

```text
Tenant School B
→ https://elearning.sekolahb.sch.id
```

without shared root domain, subdomain extraction, hostname string replacement, or global tenant state.

---

# 52. Final Flow

```text
Incoming HTTPS Request
        ↓
Nginx server_name
        ↓
Next.js
        ↓
resolveRequestHostname()
        ↓
normalizeRequestHostname()
        ↓
TenantDomainRepository.findByHostname()
        ↓
TenantDomain
        ↓
TenantRepository.findById()
        ↓
Tenant status check
        ↓
TenantContext
        ↓
TenantMoodleConfigurationRepository
        ↓
Moodle base URL
        ↓
MoodleCredentialProvider
        ↓
MoodleClientFactory
        ↓
MoodleRestClient
        ↓
Moodle instance owned by that tenant
```

---

# 53. Next Phase Readiness

Setelah foundation ini selesai, Authentication dapat menggunakan:

```text
request hostname
 ↓
TenantContext
 ↓
tenant Moodle URL
 ↓
nextjs_student service
 ↓
Moodle user token
 ↓
Next.js session
 ↓
CurrentActor
```

Authentication otomatis tenant-aware.

---

# 54. Final Architectural Rule

Tenant ditentukan oleh:

```text
exact custom hostname
```

Moodle instance ditentukan oleh:

```text
persisted TenantMoodleConfiguration
```

Credential ditentukan oleh:

```text
tenantId
```

Tidak ada derivasi domain otomatis.

Tidak ada assumption parent domain bersama.

Tidak ada tenant selection dari client-controlled parameter.
