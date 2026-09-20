# ISSUE: Phase 1 — Core Foundation

## Objective

Implementasikan **Phase 1 — Core Foundation** untuk project SaaS ujian berbasis **Next.js + TypeScript + Hexagonal Architecture**.

Fokus fase ini adalah membangun fondasi reusable yang akan digunakan seluruh module berikutnya.

Jangan mengimplementasikan Moodle integration, tenant persistence/database, authentication provider, atau feature business lain pada fase ini.

---

# 1. Architectural Context

Project menggunakan Hexagonal Architecture dengan dependency direction:

```text
Presentation
    ↓
API Route
    ↓
Application
    ↓
Domain
    ↑
Infrastructure
```

Core Foundation berada di:

```text
src/core/
```

dan boleh digunakan lintas module.

Core tidak boleh mengetahui detail bisnis spesifik seperti:

```text
Quiz
Course
Question
Exam
Grade
Moodle
```

Core harus generic dan reusable.

---

# 2. Target Structure

Buat atau lengkapi struktur berikut:

```text
src/core/
├── base/
│   ├── BaseEntity.ts
│   ├── BaseService.ts
│   └── Result.ts
│
├── errors/
│   ├── AppError.ts
│   ├── DomainError.ts
│   ├── ValidationError.ts
│   ├── UnauthorizedError.ts
│   ├── ForbiddenError.ts
│   ├── NotFoundError.ts
│   ├── ConflictError.ts
│   └── InfrastructureError.ts
│
├── http/
│   ├── ApiResponse.ts
│   ├── ApiErrorResponse.ts
│   ├── HttpStatus.ts
│   ├── mapErrorToHttpResponse.ts
│   └── withApiHandler.ts
│
├── logger/
│   ├── Logger.ts
│   ├── LogContext.ts
│   └── createLogger.ts
│
├── security/
│   ├── RequestId.ts
│   └── SensitiveData.ts
│
├── tenant/
│   ├── TenantContext.ts
│   ├── TenantResolver.ts
│   └── resolveCurrentTenant.ts
│
└── auth/
    ├── CurrentActor.ts
    ├── Session.ts
    ├── SessionResolver.ts
    └── resolveCurrentActor.ts
```

Boleh menambah file helper jika memang diperlukan, tetapi jangan membuat abstraction kosong atau over-engineering.

---

# 3. Mandatory Workflow

Gunakan:

```text
RED
↓
GREEN
↓
REFACTOR
```

Jangan langsung membuat implementation.

Urutan kerja wajib:

1. audit struktur project existing;
2. identifikasi shared conventions yang sudah digunakan;
3. buat test untuk behavior yang dibutuhkan;
4. pastikan test gagal dengan alasan yang benar;
5. implementasikan kode minimal;
6. jalankan test;
7. refactor;
8. jalankan seluruh verification;
9. perbaiki seluruh error TypeScript, lint, dan test terkait.

Jangan menghapus test hanya agar implementation lulus.

---

# 4. Result

Buat generic `Result` untuk merepresentasikan operasi sukses atau gagal tanpa menggunakan exception untuk seluruh flow bisnis.

Target usage:

```ts
const result = Result.ok(data);

const result = Result.fail(
  new ValidationError("Invalid input"),
);
```

Result harus mendukung minimal:

```ts
Result.ok()
Result.fail()

result.isSuccess
result.isFailure

result.value
result.error

result.getValue()
result.getError()
```

Rules:

- immutable;
- strongly typed;
- tidak menggunakan `any`;
- failure tidak boleh memiliki success value;
- success tidak boleh memiliki error.

Contoh type:

```ts
Result<T, E extends Error = Error>
```

Tentukan API terbaik yang konsisten dengan codebase existing.

---

# 5. BaseEntity

Buat abstraction entity yang minimal.

Tujuannya hanya menyediakan fondasi identity jika memang dibutuhkan oleh module berikutnya.

Contoh konsep:

```ts
abstract class BaseEntity<TId> {
  protected constructor(
    public readonly id: TId,
  ) {}
}
```

Jangan memasukkan:

```text
createdAt
updatedAt
tenantId
serialization
database mapping
```

secara paksa ke semua entity.

---

# 6. BaseService

Jika codebase existing memang sudah menggunakan `BaseService`, pertahankan convention tersebut.

`BaseService` harus tetap tipis.

Jangan menjadikan `BaseService` sebagai:

- service locator;
- dependency container;
- HTTP abstraction;
- global mutable state.

Jika keberadaannya tidak memberikan behavior reusable yang jelas, pertahankan API seminimal mungkin.

---

# 7. Application Error Hierarchy

Buat error hierarchy berikut:

```text
Error
└── AppError
    ├── DomainError
    ├── ValidationError
    ├── UnauthorizedError
    ├── ForbiddenError
    ├── NotFoundError
    ├── ConflictError
    └── InfrastructureError
```

`AppError` minimal memiliki:

```ts
message
code
statusCode
details?
cause?
```

Contoh:

```ts
new NotFoundError(
  "COURSE_NOT_FOUND",
  "Course tidak ditemukan.",
);
```

atau API lain yang lebih konsisten dengan project existing.

Requirements:

- setiap error memiliki stable error code;
- `statusCode` tidak ditentukan ulang tersebar di route;
- support `cause`;
- support optional structured metadata/details;
- tidak menggunakan raw stack trace sebagai API output;
- tidak expose internal error detail ke client.

---

# 8. Error Codes

Error code menggunakan:

```text
UPPER_SNAKE_CASE
```

Contoh:

```text
VALIDATION_ERROR
UNAUTHORIZED
FORBIDDEN
NOT_FOUND
CONFLICT
INFRASTRUCTURE_ERROR
INTERNAL_SERVER_ERROR
```

Error spesifik feature nanti boleh menggunakan:

```text
QUIZ_NOT_FOUND
ATTEMPT_NOT_ALLOWED
TENANT_INACTIVE
```

Core jangan mendefinisikan error business spesifik feature.

---

# 9. HttpStatus

Buat central HTTP status constants atau type-safe helper.

Minimal support:

```text
200 OK
201 CREATED
204 NO_CONTENT
400 BAD_REQUEST
401 UNAUTHORIZED
403 FORBIDDEN
404 NOT_FOUND
409 CONFLICT
422 UNPROCESSABLE_ENTITY
429 TOO_MANY_REQUESTS
500 INTERNAL_SERVER_ERROR
502 BAD_GATEWAY
503 SERVICE_UNAVAILABLE
```

Jangan menggunakan magic number tersebar seperti:

```ts
return Response.json(data, { status: 403 });
```

jika central abstraction tersedia.

---

# 10. Standard API Response

Semua API internal nantinya menggunakan format konsisten.

Success:

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Data tidak ditemukan."
  },
  "requestId": "..."
}
```

Buat type generic seperti:

```ts
ApiSuccessResponse<T, M>
ApiFailureResponse
ApiResponse<T, M>
```

`meta` optional.

Tidak boleh mengembalikan:

```text
stack
debugInfo
raw exception
secret
token
password
```

---

# 11. Error → HTTP Mapping

Implementasikan:

```text
mapErrorToHttpResponse
```

Mapping minimal:

```text
ValidationError
→ 422

UnauthorizedError
→ 401

ForbiddenError
→ 403

NotFoundError
→ 404

ConflictError
→ 409

InfrastructureError
→ 502 atau status yang ditentukan error

Unknown Error
→ 500
```

Unknown error tidak boleh mengekspos:

```ts
error.message
```

secara langsung ke client jika message tersebut bersifat internal.

Gunakan generic message:

```text
Terjadi kesalahan pada server.
```

---

# 12. API Route Wrapper

Implementasikan helper seperti:

```ts
withApiHandler(...)
```

atau API setara yang sesuai codebase.

Target penggunaan:

```ts
export const GET = withApiHandler(
  async (request, context) => {
    return ApiResponse.success(data);
  },
);
```

Wrapper bertanggung jawab atas:

- request ID;
- centralized try/catch;
- error mapping;
- structured logging;
- standardized API response;
- unexpected error handling.

Wrapper tidak boleh menangani:

- domain logic;
- tenant business rule;
- authorization business rule;
- feature-specific validation.

---

# 13. Request ID

Buat utility:

```text
RequestId
```

Behavior:

1. jika incoming request memiliki valid request ID header, gunakan bila aman;
2. jika tidak ada, generate UUID;
3. request ID harus tersedia untuk logger;
4. request ID dikembalikan pada response header;
5. error response menyertakan request ID.

Header convention:

```text
x-request-id
```

Gunakan `crypto.randomUUID()` jika tersedia.

Jangan menggunakan random implementation yang lemah jika platform sudah menyediakan UUID.

---

# 14. Structured Logger

Buat logger abstraction yang menghasilkan structured data.

Interface minimal:

```ts
interface Logger {
  debug(...)
  info(...)
  warn(...)
  error(...)
}
```

Log context:

```ts
interface LogContext {
  readonly requestId?: string;
  readonly tenantId?: string;
  readonly actorId?: string;
  readonly event?: string;
  readonly [key: string]: unknown;
}
```

Expected output:

```json
{
  "level": "info",
  "message": "Request completed",
  "requestId": "...",
  "tenantId": "...",
  "actorId": "...",
  "event": "api_request_completed"
}
```

Jangan membuat logger bergantung pada business feature.

---

# 15. Sensitive Logging

Logger tidak boleh mencatat field sensitif.

Minimal redaction terhadap key:

```text
password
token
accessToken
refreshToken
wstoken
authorization
cookie
secret
clientSecret
apiKey
```

Implementasikan helper redaction sederhana jika diperlukan.

Contoh:

```json
{
  "password": "[REDACTED]"
}
```

Nested object harus dipertimbangkan.

Jangan over-engineer recursive sanitizer jika tidak diperlukan, tetapi data sensitif umum harus terlindungi.

---

# 16. Tenant Context Abstraction

Pada fase ini jangan implementasikan database tenant.

Buat abstraction reusable.

Contoh model:

```ts
interface TenantContext {
  readonly tenantId: string;
  readonly slug: string;
  readonly status: "ACTIVE" | "INACTIVE";
}
```

atau bentuk minimal lain yang sesuai architecture.

Jangan masukkan Moodle credentials ke public tenant context.

---

# 17. TenantResolver

Buat interface:

```ts
interface TenantResolver {
  resolve(input: TenantResolutionInput):
    Promise<TenantContext | null>;
}
```

`TenantResolver` adalah port.

Jangan implementasikan database lookup nyata pada fase ini.

Boleh membuat:

```text
resolveCurrentTenant
```

sebagai orchestration helper yang menggunakan resolver abstraction.

---

# 18. Tenant Resolution Strategy

Untuk saat ini siapkan abstraction agar nantinya dapat resolve berdasarkan:

```text
hostname
subdomain
header internal
```

Jangan hard-code:

```text
smpn29
hangtuah2
localhost tenant
```

di Core.

Jangan gunakan Moodle URL sebagai identifier tenant.

---

# 19. Actor Abstraction

Buat:

```text
CurrentActor
```

Minimal:

```ts
interface CurrentActor {
  readonly userId: string;
  readonly tenantId: string;
  readonly roles: readonly string[];
}
```

Jika architecture existing menggunakan numeric Moodle user ID, jangan paksa domain actor memakai numeric ID untuk semua provider.

Gunakan ID internal aplikasi jika tersedia.

---

# 20. Session Abstraction

Buat session model generic:

```ts
interface Session {
  readonly id: string;
  readonly userId: string;
  readonly tenantId: string;
  readonly expiresAt: Date;
}
```

Tambahkan data minimal jika diperlukan.

Jangan simpan:

```text
raw password
Moodle privileged token
plaintext credential
```

dalam session object publik.

---

# 21. SessionResolver

Buat port:

```ts
interface SessionResolver {
  resolve(request: Request):
    Promise<Session | null>;
}
```

Kemudian buat helper:

```text
resolveCurrentActor
```

yang mengubah valid session menjadi actor.

Pada Phase 1 tidak perlu implementasi cookie persistence final.

Gunakan test fake/mock resolver.

---

# 22. Tenant Resolution Tests

Buat test untuk minimal:

### success

```text
tenant ditemukan
→ return TenantContext
```

### missing tenant

```text
tenant tidak ditemukan
→ NotFoundError / suitable error
```

### inactive tenant

Jika inactive behavior sudah menjadi tanggung jawab resolver/core abstraction:

```text
INACTIVE
→ Forbidden / appropriate error
```

Jika inactive rule akan menjadi application concern, jangan paksa rule ke Core.

Pilih satu boundary dan dokumentasikan.

---

# 23. Session Resolution Tests

Minimal:

```text
valid session
→ CurrentActor

missing session
→ UnauthorizedError

expired session
→ UnauthorizedError

tenant mismatch
→ ForbiddenError
```

Jangan membuat network request nyata dalam unit test.

---

# 24. Required Test Structure

Buat test di lokasi yang konsisten dengan project.

Disarankan:

```text
src/core/__tests__/
├── base/
│   └── Result.test.ts
├── errors/
│   └── AppError.test.ts
├── http/
│   ├── ApiResponse.test.ts
│   ├── mapErrorToHttpResponse.test.ts
│   └── withApiHandler.test.ts
├── logger/
│   └── createLogger.test.ts
├── security/
│   └── RequestId.test.ts
├── tenant/
│   └── resolveCurrentTenant.test.ts
└── auth/
    └── resolveCurrentActor.test.ts
```

Jika repository existing memiliki pattern test lain, ikuti pattern existing.

---

# 25. Mandatory Test Cases

## `Result`

- success contains value;
- failure contains error;
- `isSuccess`;
- `isFailure`;
- invalid access behavior jika API menggunakan getter yang melempar.

## Errors

- correct status;
- correct error code;
- correct message;
- supports cause;
- optional details.

## API response

- success format;
- success with metadata;
- error format;
- request ID present when relevant.

## Error mapping

- Validation → 422;
- Unauthorized → 401;
- Forbidden → 403;
- NotFound → 404;
- Conflict → 409;
- Infrastructure → configured 5xx;
- unknown → 500.

## API wrapper

- catches expected error;
- catches unknown error;
- returns standardized response;
- preserves request ID;
- logs error.

## Logger

- structured payload;
- context merge;
- sensitive data redaction.

## Tenant

- successful resolution;
- missing tenant;
- resolver failure behavior.

## Session

- valid session;
- missing session;
- expired session;
- tenant mismatch.

---

# 26. TypeScript Rules

Use strict TypeScript.

Forbidden unless absolutely justified:

```ts
any
```

Prefer:

```ts
unknown
```

for external/untrusted data.

Use:

```ts
import type
```

for type-only imports.

Prefer immutable fields:

```ts
readonly
```

DTO/interfaces should be readonly where possible.

---

# 27. Error Handling Rules

Do not write:

```ts
catch (error) {
  console.error(error);
}
```

without propagation/mapping.

Do not swallow errors.

Do not throw strings:

```ts
throw "error";
```

Always throw proper `Error` subclasses.

---

# 28. Logging Rules

Do not leave:

```ts
console.log
console.debug
```

inside production core implementation.

All logging goes through logger abstraction.

If logger ultimately uses `console` internally for Phase 1, that is acceptable, as long as caller code only depends on `Logger`.

---

# 29. API Wrapper Example Target

Desired usage should become simple:

```ts
export const GET = withApiHandler(
  async ({ requestId, logger }) => {
    logger.info(
      "Health check",
      {
        requestId,
        event: "health_check",
      },
    );

    return {
      status: HttpStatus.OK,
      data: {
        status: "ok",
      },
    };
  },
);
```

Actual API may differ if project conventions make another implementation cleaner.

Keep route code concise.

---

# 30. Dependency Rules

Allowed:

```text
core/http
→ core/errors
→ core/logger
→ core/security
```

Avoid cyclic dependency.

Especially avoid:

```text
core/errors → core/http → core/errors
```

Design status mapping carefully.

Recommended:

- errors may contain semantic status code if desired;
- HTTP layer maps errors;
- errors should not import Next.js.

---

# 31. Next.js Dependency Boundary

Core `http` may know Web `Request`/`Response` primitives.

Prefer not to couple every core class to:

```text
next/server
next/headers
next/cookies
```

unless specifically required.

`domain-style` core abstractions such as:

```text
Result
Logger
TenantContext
CurrentActor
Session
```

must remain framework-neutral.

---

# 32. Security Boundary

Phase 1 must establish foundations for:

```text
Browser
→ Next.js
→ external systems
```

Do not add client-visible secrets.

Files that may process secrets should be server-only where appropriate.

---

# 33. File Organization Rules

Do not create barrel exports automatically such as:

```text
index.ts
```

in every directory unless repository existing already standardizes them.

Avoid import cycles caused by global barrels.

Prefer explicit imports.

---

# 34. Scope Guard

Do NOT implement during Phase 1:

```text
MoodleRestClient
Moodle login
database schema
Prisma
Redis
quiz
course
question
grade
exam
real tenant database repository
real cookie authentication
UI dashboard
```

Those belong to later phases.

Phase 1 only establishes reusable Core Foundation.

---

# 35. Verification Commands

At the end run all relevant commands.

At minimum:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

If package manager is not npm, use package manager already configured in the project.

Do not change package manager.

---

# 36. Required Final Report

After implementation, report:

```text
1. Files created
2. Files modified
3. RED tests added
4. GREEN implementation completed
5. Important architectural decisions
6. Verification results
7. Remaining Phase 1 risks / TODO
```

Do not only say:

```text
Done.
```

---

# 37. Acceptance Criteria

Phase 1 dianggap selesai hanya jika semua kondisi berikut terpenuhi.

## Base

- [ ] `Result` implemented.
- [ ] Result is generic and immutable.
- [ ] `BaseEntity` minimal.
- [ ] `BaseService` does not become service locator.

## Errors

- [ ] application error hierarchy implemented.
- [ ] stable error codes.
- [ ] HTTP semantics mapped consistently.
- [ ] unknown errors sanitized.

## HTTP

- [ ] standardized success response.
- [ ] standardized failure response.
- [ ] API route wrapper.
- [ ] centralized error mapping.
- [ ] request ID on response.

## Logging

- [ ] structured logger.
- [ ] contextual logging.
- [ ] secret redaction.
- [ ] no scattered console logging.

## Tenant

- [ ] `TenantContext`.
- [ ] `TenantResolver`.
- [ ] `resolveCurrentTenant`.
- [ ] tests for tenant resolution.

## Auth

- [ ] `CurrentActor`.
- [ ] `Session`.
- [ ] `SessionResolver`.
- [ ] `resolveCurrentActor`.
- [ ] tests for session/actor resolution.

## Quality

- [ ] no `any` without explicit justification.
- [ ] no circular dependency.
- [ ] no Moodle implementation.
- [ ] no business-feature implementation.
- [ ] TypeScript passes.
- [ ] Biome passes.
- [ ] tests pass.
- [ ] production build passes.

---

# 38. Definition of Success

Setelah Phase 1 selesai, module berikutnya harus dapat menggunakan Core dengan pola seperti:

```ts
const tenant =
  await resolveCurrentTenant(
    request,
    tenantResolver,
  );

const actor =
  await resolveCurrentActor(
    request,
    sessionResolver,
    tenant,
  );

const result =
  await useCase.execute(input);

return ApiResponse.success(result);
```

dan semua error dari application dapat masuk ke:

```text
withApiHandler
→ mapErrorToHttpResponse
→ structured API error
→ requestId
→ structured logger
```

tanpa route membuat error mapping sendiri.

Tujuan utama Phase 1 adalah memastikan seluruh feature berikutnya dibangun di atas fondasi yang **type-safe, testable, framework-aware hanya pada boundary yang benar, tenant-ready, session-ready, observable, dan konsisten**.
