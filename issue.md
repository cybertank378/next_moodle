# ISSUE: Phase 2 — Moodle REST Adapter

## Objective

Implementasikan **Phase 2 — Moodle REST Adapter** sebagai satu-satunya gateway komunikasi antara aplikasi Next.js dan Moodle REST Web Service.

Phase ini bertujuan membangun outbound adapter yang:

- type-safe;
- server-only;
- reusable lintas module;
- mendukung parameter Moodle yang nested;
- memiliki timeout;
- memiliki error normalization;
- tidak membocorkan secret;
- dapat digunakan oleh seluruh repository infrastructure berikutnya.

Phase ini **tidak** mengimplementasikan feature bisnis seperti login, course, quiz, attempt, question, grade, atau tenant persistence.

---

# 1. Architectural Context

Project menggunakan Hexagonal Architecture:

```text
Presentation
    ↓
Next.js API Route
    ↓
Application Use Case
    ↓
Domain Port
    ↑
Infrastructure Repository
    ↓
MoodleRestClient
    ↓
Moodle REST API
```

`MoodleRestClient` adalah infrastructure concern.

Business module tidak boleh mengetahui detail:

```text
wstoken
wsfunction
moodlewsrestformat
/webservice/rest/server.php
Moodle exception payload
URLSearchParams Moodle
```

Semua detail tersebut harus berhenti di Core Moodle Adapter.

---

# 2. Dependency on Phase 1

Phase 2 mengasumsikan Phase 1 sudah tersedia:

```text
core/base
core/errors
core/http
core/logger
core/security
core/tenant
core/auth
```

Gunakan foundation yang sudah dibuat, terutama:

```text
AppError
InfrastructureError
Logger
RequestId
TenantContext
```

Jangan membuat duplikat abstraction yang sudah tersedia dari Phase 1.

Jika ditemukan kekurangan kecil pada Core Foundation yang menghalangi Phase 2:

1. tambahkan test;
2. lakukan perubahan minimal;
3. dokumentasikan perubahan;
4. jangan melakukan refactor besar yang tidak terkait.

---

# 3. Target Structure

Buat atau lengkapi:

```text
src/core/moodle/
├── MoodleRestClient.ts
├── MoodleErrorMapper.ts
├── MoodleClientFactory.ts
├── MoodleCredentialProvider.ts
├── MoodleCredential.ts
├── MoodleClientConfig.ts
├── MoodleRequestEncoder.ts
└── types/
    ├── MoodleExceptionResponse.ts
    ├── MoodleWarning.ts
    ├── MoodleRequestParameters.ts
    └── MoodleResponse.ts
```

Test:

```text
src/core/__tests__/moodle/
├── MoodleRequestEncoder.test.ts
├── MoodleErrorMapper.test.ts
├── MoodleRestClient.test.ts
├── MoodleClientFactory.test.ts
└── MoodleCredentialProvider.test.ts
```

Boleh menyesuaikan struktur jika repository existing memiliki convention lain, tetapi boundary dan tanggung jawab harus tetap sama.

---

# 4. Mandatory Workflow

Gunakan:

```text
RED
↓
GREEN
↓
REFACTOR
```

Urutan kerja:

1. audit Core Foundation existing;
2. audit test convention existing;
3. tulis test encoding terlebih dahulu;
4. pastikan test gagal karena implementation belum tersedia;
5. implement encoder minimum;
6. tulis test error handling;
7. implement error mapper;
8. tulis test MoodleRestClient;
9. implement client;
10. implement factory dan credential provider;
11. refactor;
12. jalankan seluruh verification.

Jangan langsung menulis implementation penuh sebelum RED test tersedia.

---

# 5. Moodle REST Contract

Endpoint utama:

```text
POST {MOODLE_BASE_URL}/webservice/rest/server.php
```

Request minimal:

```text
wstoken=<TOKEN>
wsfunction=<FUNCTION_NAME>
moodlewsrestformat=json
```

Semua request Moodle REST harus menggunakan `POST`.

Jangan melakukan GET dengan token pada query URL.

---

# 6. MoodleRestClient Responsibility

`MoodleRestClient` bertanggung jawab atas:

- membangun endpoint REST Moodle;
- menambahkan `wstoken`;
- menambahkan `wsfunction`;
- menambahkan `moodlewsrestformat=json`;
- encode parameter scalar;
- encode parameter array;
- encode nested array/object;
- melakukan HTTP request;
- timeout;
- membaca JSON response;
- mendeteksi Moodle exception response;
- mendeteksi non-200 HTTP response;
- normalize error melalui `MoodleErrorMapper`;
- structured logging yang aman;
- correlation dengan `requestId`.

`MoodleRestClient` tidak bertanggung jawab atas:

- login flow;
- tenant lookup;
- authorization domain;
- quiz rule;
- course rule;
- question mapping;
- DTO feature;
- persistence credential.

---

# 7. Public Client API

Target penggunaan:

```ts
const response = await moodleClient.call<MoodleResponseType>(
  "core_webservice_get_site_info",
);
```

Dengan parameter:

```ts
const response = await moodleClient.call<MoodleQuizResponse>(
  "mod_quiz_get_quizzes_by_courses",
  {
    courseids: [10, 20, 30],
  },
);
```

Nested:

```ts
await moodleClient.call(
  "some_function",
  {
    users: [
      { id: 1, role: "student" },
      { id: 2, role: "teacher" },
    ],
  },
);
```

API public tidak boleh meminta caller membangun `URLSearchParams`, `wstoken`, atau `moodlewsrestformat` secara manual.

---

# 8. MoodleRequestParameters Type

Gunakan type yang cukup kuat untuk Moodle payload.

```ts
type MoodlePrimitive =
  | string
  | number
  | boolean
  | null
  | undefined;

type MoodleParameterValue =
  | MoodlePrimitive
  | readonly MoodleParameterValue[]
  | Readonly<Record<string, MoodleParameterValue>>;

export type MoodleRequestParameters =
  Readonly<Record<string, MoodleParameterValue>>;
```

Jangan menggunakan `Record<string, any>`.

---

# 9. Parameter Encoding — Scalar

## RED

Buat test untuk string, number, boolean, `0`, `false`, dan empty string.

Contoh input:

```ts
{
  quizid: 10,
  password: "abc",
  finishattempt: true,
}
```

Expected encoding harus eksplisit dan konsisten dengan form encoding Moodle/PHP.

`0`, `false`, dan `""` tidak boleh salah dianggap sebagai missing value.

---

# 10. Parameter Encoding — Arrays

## RED

Input:

```ts
{
  courseids: [10, 20, 30],
}
```

Expected:

```text
courseids[0]=10
courseids[1]=20
courseids[2]=30
```

Test juga:

- empty array;
- array of strings;
- array of numbers;
- readonly array.

Tidak boleh menghasilkan `courseids=10,20,30`.

---

# 11. Parameter Encoding — Nested Objects

## RED

Input:

```ts
{
  users: [
    { id: 10, role: "student" },
    { id: 20, role: "teacher" },
  ],
}
```

Expected:

```text
users[0][id]=10
users[0][role]=student
users[1][id]=20
users[1][role]=teacher
```

Nested object juga harus didukung.

---

# 12. Null and Undefined Rules

Tentukan melalui test.

Recommended:

```text
undefined → omitted
null      → omitted unless explicit null semantics are required
```

Jangan encode string literal `undefined` atau `null` tanpa kebutuhan endpoint yang jelas.

---

# 13. Moodle Exception Response

Moodle dapat mengembalikan HTTP `200` tetapi body berupa exception.

Contoh:

```json
{
  "exception": "moodle_exception",
  "errorcode": "invalidparameter",
  "message": "Invalid parameter value detected",
  "debuginfo": "..."
}
```

Client wajib mendeteksi ini sebagai error.

HTTP `200` tidak otomatis berarti success.

---

# 14. MoodleExceptionResponse

Buat type guard untuk external JSON yang awalnya diperlakukan sebagai `unknown`.

```ts
interface MoodleExceptionResponse {
  readonly exception: string;
  readonly errorcode: string;
  readonly message: string;
  readonly debuginfo?: string;
}
```

---

# 15. MoodleErrorMapper

Implementasikan:

```text
Moodle response / transport error
        ↓
MoodleErrorMapper
        ↓
InfrastructureError / MoodleError
```

Jika Phase 1 sudah memiliki `MoodleError`, gunakan itu.

Minimal internal metadata:

```text
code
message
statusCode
moodleErrorCode?
moodleException?
requestId?
cause?
```

Jangan expose `debuginfo`, stack, atau token ke client.

---

# 16. Moodle Error Mapping

Minimal categories:

```text
invalidtoken / invalid_token
→ authentication/infrastructure failure

invalidparameter / invalid_parameter_exception
→ upstream request failure

accesscontrol / nopermissions
→ upstream permission failure

dmlreadexception / dmlwriteexception
→ Moodle infrastructure failure

unknown exception
→ generic Moodle upstream error
```

Feature-specific mapping dilakukan nanti di repository/application.

---

# 17. HTTP Non-200 Handling

## RED

Test minimal:

```text
400
401
403
404
429
500
502
503
```

Client harus menghasilkan normalized infrastructure error.

Suggested stable codes:

```text
MOODLE_REQUEST_FAILED
MOODLE_RATE_LIMITED
MOODLE_BAD_GATEWAY
MOODLE_UNAVAILABLE
```

---

# 18. Timeout

Semua Moodle request wajib memiliki timeout configurable.

Contoh:

```ts
const DEFAULT_MOODLE_TIMEOUT_MS = 10_000;
```

Gunakan `AbortController` atau runtime-compatible equivalent.

Jangan hard-code timeout tersebar.

---

# 19. Timeout Test

## RED

```text
request exceeds timeout
→ request aborted
→ normalized MOODLE_TIMEOUT error
```

Native `AbortError` tidak boleh keluar dari adapter.

---

# 20. Network Error Handling

Test `fetch` rejection, connection failure, atau error transport setara.

Semua menjadi normalized infrastructure error, misalnya:

```text
MOODLE_NETWORK_ERROR
```

Original error boleh disimpan sebagai `cause` secara internal.

---

# 21. Invalid JSON Response

Test:

```text
HTTP 200
body invalid JSON
→ MOODLE_INVALID_RESPONSE
```

Raw `SyntaxError` tidak boleh keluar dari adapter.

---

# 22. Secret-Safe Logging

## RED

Pastikan logger tidak menerima raw:

```text
wstoken
password
authorization
cookie
secret
clientSecret
apiKey
```

Logger boleh menerima:

```text
requestId
tenantId
wsfunction
durationMs
httpStatus
errorCode
```

Jangan log parameter request lengkap secara default karena dapat berisi jawaban siswa atau PII.

---

# 23. Logging Events

Suggested events:

```text
moodle_request_started
moodle_request_completed
moodle_request_failed
moodle_request_timeout
```

Catat duration request, tetapi jangan menambah observability framework besar pada Phase 2.

---

# 24. Server-Only Boundary

Tambahkan `import "server-only";` pada implementation yang relevan:

```text
MoodleRestClient
MoodleClientFactory
MoodleCredentialProvider concrete server implementation
```

Pure type tidak perlu dipaksa server-only jika aman untuk type import.

---

# 25. MoodleCredential

Representation internal:

```ts
interface MoodleCredential {
  readonly baseUrl: string;
  readonly token: string;
}
```

Rules:

- immutable;
- tidak menjadi API DTO;
- tidak di-log;
- tidak tersedia ke Client Component.

---

# 26. MoodleCredentialProvider

Buat abstraction:

```ts
interface MoodleCredentialProvider {
  getCredential(
    tenant: TenantContext,
  ): Promise<MoodleCredential>;
}
```

Pada Phase 2 jangan implementasikan Prisma, secret manager, atau persistence nyata.

Gunakan abstraction dan fake provider pada test.

---

# 27. MoodleClientFactory

Target:

```ts
const client = await moodleClientFactory.create({
  tenant,
  requestId,
});
```

Flow:

```text
TenantContext
    ↓
CredentialProvider
    ↓
MoodleCredential
    ↓
MoodleRestClient
```

Factory tidak boleh melakukan login Moodle, resolve hostname, atau menyimpan client global mutable lintas tenant.

---

# 28. Multi-Tenant Safety

Test minimal:

```text
tenant A → credential A
tenant B → credential B
```

Dilarang menggunakan mutable global seperti:

```ts
let currentToken = "...";
```

---

# 29. Base URL Normalization

Kedua input:

```text
https://moodle.example.com
https://moodle.example.com/
```

harus menghasilkan:

```text
https://moodle.example.com/webservice/rest/server.php
```

Bukan double slash.

---

# 30. URL Security

Base URL hanya menerima scheme yang relevan (`http`/`https`), dengan `https` diwajibkan atau diprioritaskan untuk production.

Jangan menerima arbitrary scheme seperti:

```text
file:
ftp:
javascript:
data:
```

---

# 31. No Direct Moodle Fetch

Setelah Phase 2 selesai, seluruh komunikasi Moodle harus melalui:

```text
MoodleRestClient
```

Feature repository tidak boleh membuat direct `fetch` ke Moodle.

---

# 32. No Moodle Response Leakage

Future flow:

```text
MoodleRestClient
    ↓
MoodleFeatureRepository
    ↓
MoodleFeatureMapper
    ↓
Internal DTO
```

Phase 2 belum membuat feature mapper.

---

# 33. Fetch Dependency for Testing

Design agar client dapat diuji tanpa network nyata.

Gunakan dependency injection terhadap fetcher atau mocking convention existing.

Unit test tidak boleh memanggil server Moodle nyata.

---

# 34. MoodleRestClient Constructor

Prefer config object:

```ts
new MoodleRestClient({
  baseUrl,
  token,
  timeoutMs,
  logger,
  requestId,
  tenantId,
});
```

Hindari banyak positional arguments.

---

# 35. Generic Response Type

Target:

```ts
async call<TResponse>(
  wsfunction: string,
  parameters?: MoodleRequestParameters,
): Promise<TResponse>
```

Dilarang `Promise<any>`.

---

# 36. Response Warnings

Presence `warnings` pada response Moodle bukan otomatis exception.

Business interpretation warning dilakukan oleh feature repository kemudian.

---

# 37. Retry Scope

Jangan implementasikan broad automatic retry pada Phase 2.

Mutation seperti:

```text
mod_quiz_start_attempt
mod_quiz_process_attempt
core_user_create_users
```

bisa memiliki side effect dan tidak boleh blind retry.

---

# 38. Cache Scope

Jangan implementasikan caching di `MoodleRestClient`.

Caching adalah concern repository/application/cache adapter.

---

# 39. Authentication Scope Guard

Jangan implementasikan `/login/token.php` di generic `MoodleRestClient.call()`.

Token endpoint memiliki contract berbeda dari standard `wsfunction` REST endpoint.

Authentication implementation dilakukan di phase berikutnya.

---

# 40. File API Scope Guard

Jangan implementasikan:

```text
/webservice/upload.php
/webservice/pluginfile.php
```

pada Phase 2 kecuali fondasi minimal memang dibutuhkan.

File transfer akan ditangani module/infrastructure terpisah.

---

# 41. Import Boundary

Allowed:

```text
modules/*/infrastructure
→ core/moodle
```

Not allowed:

```text
modules/*/domain
→ core/moodle

modules/*/application
→ core/moodle

sections/*
→ core/moodle

presentation/hooks
→ core/moodle
```

---

# 42. Required RED Tests

## MoodleRequestEncoder

- [ ] scalar string encoding;
- [ ] scalar integer encoding;
- [ ] scalar boolean encoding;
- [ ] zero preserved;
- [ ] false preserved appropriately;
- [ ] empty string preserved;
- [ ] undefined omitted;
- [ ] null handling documented/tested;
- [ ] numeric array;
- [ ] string array;
- [ ] nested object;
- [ ] array of objects;
- [ ] deeply nested supported structure.

## MoodleErrorMapper

- [ ] Moodle exception maps correctly;
- [ ] `invalidtoken`;
- [ ] `invalidparameter`;
- [ ] unknown Moodle exception;
- [ ] network error;
- [ ] timeout error;
- [ ] HTTP 5xx;
- [ ] `debuginfo` not exposed.

## MoodleRestClient

- [ ] correct REST endpoint;
- [ ] POST method;
- [ ] correct content type;
- [ ] token included internally in body;
- [ ] `wsfunction` included;
- [ ] `moodlewsrestformat=json`;
- [ ] parameters encoded correctly;
- [ ] HTTP 200 success;
- [ ] Moodle exception with HTTP 200 becomes failure;
- [ ] non-200 normalized;
- [ ] timeout aborts;
- [ ] invalid JSON normalized;
- [ ] logger never receives raw token.

## MoodleClientFactory

- [ ] resolves credentials for tenant;
- [ ] creates client with correct tenant config;
- [ ] tenant A/B isolation;
- [ ] provider failure becomes safe infrastructure error.

---

# 43. Suggested Test Fixtures

Gunakan fake data:

```text
https://moodle-a.example.test
https://moodle-b.example.test
TOKEN_A
TOKEN_B
```

Jangan gunakan credential production.

---

# 44. GREEN Implementation Order

Implementasikan dalam urutan:

```text
1. MoodleRequestParameters
2. MoodleRequestEncoder
3. MoodleExceptionResponse type guard
4. MoodleErrorMapper
5. MoodleRestClient
6. MoodleCredential
7. MoodleCredentialProvider
8. MoodleClientFactory
```

---

# 45. Suggested Infrastructure Error Codes

```text
MOODLE_REQUEST_FAILED
MOODLE_TIMEOUT
MOODLE_NETWORK_ERROR
MOODLE_INVALID_RESPONSE
MOODLE_EXCEPTION
MOODLE_INVALID_TOKEN
MOODLE_INVALID_PARAMETER
MOODLE_FORBIDDEN
MOODLE_RATE_LIMITED
MOODLE_BAD_GATEWAY
MOODLE_UNAVAILABLE
```

Jangan menambahkan business codes seperti `ATTEMPT_EXPIRED` atau `COURSE_NOT_FOUND` ke Core Moodle Adapter.

---

# 46. Biome / TypeScript Quality

Requirements:

- [ ] TypeScript strict;
- [ ] no unexplained `any`;
- [ ] `import type` untuk type-only imports;
- [ ] readonly config/type bila sesuai;
- [ ] no unused code;
- [ ] no disabled lint rule tanpa alasan;
- [ ] no cyclic dependency.

---

# 47. Verification Commands

Jalankan minimal:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Gunakan package manager yang sudah dipakai repository. Jangan mengganti package manager.

Selama development jalankan focused tests sesuai script yang tersedia.

---

# 48. Security Verification

Sebelum selesai, audit repository untuk:

```text
/webservice/rest/server.php
wstoken
moodlewsrestformat
```

Expected: hanya muncul pada Core Moodle Adapter, test, atau dokumentasi yang memang relevan.

Audit juga:

```text
console.log(token)
logger.info({ token })
logger.debug({ wstoken })
```

Semua harus tidak ada.

---

# 49. Required Final Report

Setelah implementasi, report:

```text
1. Files created
2. Files modified
3. RED tests implemented
4. GREEN implementation completed
5. Moodle parameter encoding decisions
6. Error mapping decisions
7. Timeout configuration
8. Secret logging protections
9. Verification results
10. Remaining Phase 2 risks / TODO
```

Tambahkan:

```text
Moodle direct communication audit: PASS / FAIL
Browser secret exposure audit: PASS / FAIL
```

---

# 50. Acceptance Criteria

## Request Encoding

- [ ] scalar parameter encoding passes;
- [ ] numeric array encoding passes;
- [ ] string array encoding passes;
- [ ] nested object encoding passes;
- [ ] array-of-object encoding passes;
- [ ] zero preserved;
- [ ] false behavior tested;
- [ ] undefined behavior tested;
- [ ] null behavior documented/tested.

## Moodle Error Handling

- [ ] HTTP 200 Moodle exception detected;
- [ ] non-200 normalized;
- [ ] timeout normalized;
- [ ] network error normalized;
- [ ] invalid JSON normalized;
- [ ] Moodle debug info not client-visible.

## MoodleRestClient

- [ ] uses POST;
- [ ] uses standard REST endpoint;
- [ ] injects token internally;
- [ ] injects `wsfunction`;
- [ ] injects `moodlewsrestformat=json`;
- [ ] configurable timeout;
- [ ] structured logging;
- [ ] request duration logging;
- [ ] no automatic mutation retry;
- [ ] no caching responsibility.

## Factory

- [ ] `MoodleClientFactory` implemented;
- [ ] credential provider injected;
- [ ] tenant A/B isolation tested;
- [ ] no global mutable credential state.

## Credential

- [ ] `MoodleCredentialProvider` abstraction implemented;
- [ ] credential immutable;
- [ ] credential not exposed to client;
- [ ] no database persistence in this phase.

## Security

- [ ] client implementation server-only;
- [ ] token never appears in returned API data;
- [ ] token never appears in logs;
- [ ] sensitive parameters not logged by default;
- [ ] no real credential in tests.

## Architecture

- [ ] domain does not import Core Moodle adapter;
- [ ] application does not import Core Moodle adapter;
- [ ] presentation does not import Core Moodle adapter;
- [ ] future infrastructure repositories can use `MoodleRestClient`;
- [ ] no feature-specific business rule added.

## Quality

- [ ] TypeScript passes;
- [ ] Biome passes;
- [ ] tests pass;
- [ ] build passes;
- [ ] no unexplained `any`;
- [ ] no dead code;
- [ ] no cyclic dependencies.

---

# 51. Definition of Done

Phase 2 selesai ketika infrastructure adapter dapat melakukan:

```ts
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

tanpa caller mengetahui:

```text
Moodle token
REST endpoint
URLSearchParams
parameter nesting syntax
timeout implementation
Moodle exception shape
network error mapping
secret sanitization
```

Seluruh external failure harus berubah menjadi application-safe infrastructure error.

---

# 52. Explicit Non-Goals

Phase 2 tidak mencakup:

- [ ] Moodle login implementation;
- [ ] auth session implementation;
- [ ] course repository;
- [ ] quiz repository;
- [ ] quiz attempt repository;
- [ ] question repository;
- [ ] grade repository;
- [ ] file upload/download;
- [ ] custom Moodle plugin;
- [ ] Prisma tenant storage;
- [ ] Redis;
- [ ] caching;
- [ ] generic retry framework;
- [ ] UI;
- [ ] feature API routes.

Jangan memperluas scope tanpa requirement baru.

---

# 53. Next Phase Readiness

Setelah issue ini selesai, dependency chain menjadi:

```text
Core Foundation
    ↓
Moodle REST Adapter
    ↓
Tenant Persistence / Configuration
    ↓
Authentication
    ↓
Courses
    ↓
Quizzes
    ↓
Quiz Attempts
```

Phase 2 dinyatakan berhasil hanya jika Moodle telah menjadi **implementation detail di sisi server**, bukan dependency yang tersebar di seluruh codebase.
