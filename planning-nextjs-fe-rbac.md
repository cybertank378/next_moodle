# PLANNING — Next.js Exam SaaS Frontend/BFF

## 1. Objective

Membangun aplikasi SaaS ujian dengan arsitektur berikut:

- **Next.js** sebagai frontend, BFF/API server, session layer, tenant resolver, authorization layer, dan application host.
- **Moodle 5.x** sebagai LMS backend, Quiz Engine, Question Engine, Gradebook, enrolment engine, serta source of truth untuk attempt dan hasil ujian.
- **Prisma 7 + PostgreSQL** hanya untuk metadata SaaS multi-tenant, credential terenkripsi, branding, session metadata bila diperlukan, dan audit internal SaaS.
- **Hexagonal / DDD module boundary** untuk setiap feature.
- **Atomic UI** untuk `src/sections/*`.
- **Vitest + TDD** dengan alur **RED → GREEN → REFACTOR**.
- **TypeScript strict** dan **Biome**.
- **RBAC** dengan tiga role aplikasi: `ADMIN`, `TENANT`, `STUDENT`.
- **Tidak menggunakan barrel export** (`index.ts` / `index.tsx`) untuk re-export module, section, core, shared UI, atau API dependency.

Moodle tetap menjadi authoritative source untuk user akademik, course, enrolment, quiz, question, attempt, answer, dan grade. Next.js tidak boleh mengimplementasikan ulang Quiz Engine Moodle.

---

# 2. Actor & Role Model

## 2.1 Role aplikasi

```ts
export enum AppRole {
  ADMIN = "ADMIN",
  TENANT = "TENANT",
  STUDENT = "STUDENT",
}
```

### `ADMIN`

SaaS/system administrator. Tidak terikat ke satu tenant untuk operasi administrasi platform.

Tanggung jawab utama:

- membuat, mengubah, suspend, dan mengaktifkan tenant;
- mengatur Moodle endpoint dan service credential tenant;
- menguji koneksi tenant ke Moodle;
- melihat audit platform;
- mengelola konfigurasi global SaaS.

### `TENANT`

Administrator/operator instansi. Semua operasi harus terikat ke `tenantId` yang terdapat pada session/context.

Tanggung jawab utama:

- dashboard instansi;
- user peserta;
- enrolment dan group/cohort;
- course dan quiz listing;
- question bank;
- exam administration;
- exam monitoring;
- hasil/nilai sesuai capability Moodle;
- branding tenant.

### `STUDENT`

Peserta ujian dari tenant tertentu.

Tanggung jawab utama:

- melihat course miliknya;
- melihat ujian yang tersedia;
- memulai/resume attempt miliknya;
- menjawab/autosave;
- submit;
- melihat review/result hanya jika diizinkan Moodle.

---

# 3. RBAC System

## 3.1 Permission constants

```ts
export const Permission = {
  ADMIN_DASHBOARD_READ: "admin.dashboard.read",
  TENANT_CREATE: "tenant.create",
  TENANT_READ: "tenant.read",
  TENANT_UPDATE: "tenant.update",
  TENANT_STATUS_UPDATE: "tenant.status.update",
  TENANT_CONNECTION_TEST: "tenant.connection.test",
  PLATFORM_AUDIT_READ: "platform.audit.read",

  TENANT_DASHBOARD_READ: "tenant.dashboard.read",
  TENANT_BRANDING_READ: "tenant.branding.read",
  TENANT_BRANDING_UPDATE: "tenant.branding.update",
  USER_READ: "user.read",
  USER_CREATE: "user.create",
  USER_UPDATE: "user.update",
  USER_DEACTIVATE: "user.deactivate",
  USER_IMPORT: "user.import",
  ENROLMENT_READ: "enrolment.read",
  ENROLMENT_MANAGE: "enrolment.manage",
  GROUP_READ: "group.read",
  GROUP_MANAGE: "group.manage",
  COURSE_READ: "course.read",
  QUIZ_READ: "quiz.read",
  QUESTION_READ: "question.read",
  QUESTION_CREATE: "question.create",
  QUESTION_UPDATE: "question.update",
  QUESTION_DELETE: "question.delete",
  EXAM_CREATE: "exam.create",
  EXAM_UPDATE: "exam.update",
  EXAM_DELETE: "exam.delete",
  EXAM_MONITOR_READ: "exam.monitor.read",
  EXAM_MONITOR_ACTION: "exam.monitor.action",
  GRADE_READ: "grade.read",
  TENANT_AUDIT_READ: "tenant.audit.read",

  STUDENT_DASHBOARD_READ: "student.dashboard.read",
  STUDENT_COURSE_READ: "student.course.read",
  STUDENT_QUIZ_READ: "student.quiz.read",
  ATTEMPT_START: "attempt.start",
  ATTEMPT_READ_OWN: "attempt.read.own",
  ATTEMPT_SAVE_OWN: "attempt.save.own",
  ATTEMPT_SUBMIT_OWN: "attempt.submit.own",
  ATTEMPT_REVIEW_OWN: "attempt.review.own",
  GRADE_READ_OWN: "grade.read.own",
} as const;
```

## 3.2 Role-permission map

```text
ADMIN
├── admin.dashboard.read
├── tenant.create/read/update/status.update/connection.test
└── platform.audit.read

TENANT
├── tenant.dashboard.read
├── tenant.branding.read/update
├── user.read/create/update/deactivate/import
├── enrolment.read/manage
├── group.read/manage
├── course.read
├── quiz.read
├── question.read/create/update/delete
├── exam.create/update/delete
├── exam.monitor.read/action
├── grade.read
└── tenant.audit.read

STUDENT
├── student.dashboard.read
├── student.course.read
├── student.quiz.read
├── attempt.start
├── attempt.read.own
├── attempt.save.own
├── attempt.submit.own
├── attempt.review.own
└── grade.read.own
```

## 3.3 Authorization rules

Authorization **tidak boleh** hanya dilakukan di UI.

Wajib dilakukan pada tiga lapis:

1. **Server layout/page guard** untuk route role.
2. **API/controller guard** sebelum request mencapai application use case.
3. **Application/domain ownership rule** untuk memastikan actor hanya mengakses resource yang diperbolehkan.

Contoh:

```text
Student membuka /student/exams/31/attempt/900
  ↓
(student)/layout.tsx → requireRole(STUDENT)
  ↓
GET /api/attempts/900
  ↓
AttemptController → authorize(ATTEMPT_READ_OWN)
  ↓
GetQuizAttemptUseCase
  ↓
assertAttemptOwnership(actor, attempt)
  ↓
MoodleQuizAttemptRepository
```

## 3.4 Tenant isolation

- `TENANT` selalu memiliki `tenantId` di actor/session.
- `STUDENT` selalu memiliki `tenantId` di actor/session.
- tenant target tidak boleh diambil dari body/query sebagai source of truth jika sudah tersedia dari session.
- `ADMIN` boleh memilih tenant target secara eksplisit untuk operasi administrasi platform.
- setiap factory Moodle harus menerima tenant context yang sudah tervalidasi.
- token Tenant A tidak pernah boleh digunakan ke Moodle Tenant B.

## 3.5 RBAC file layout

```text
src/core/rbac/
├── AppRole.ts
├── Permission.ts
├── RolePermissionMap.ts
├── AuthorizationContext.ts
├── AuthorizationError.ts
├── authorize.ts
├── hasPermission.ts
├── requireRole.ts
└── requirePermission.ts
```

Tests:

```text
src/core/rbac/__tests__/
├── authorize.test.ts
├── hasPermission.test.ts
├── requireRole.test.ts
└── tenantIsolation.test.ts
```

---

# 4. Request Flow

```text
Browser
  ↓
sections/*
  ↓
modules/*/presentation/hooks
  ↓
app/api/*/route.ts
  ↓
_factory.ts
  ↓
Infrastructure HTTP Controller
  ↓
RBAC authorization
  ↓
Application Service / Use Case
  ↓
Domain Port / Rule
  ↓
Infrastructure Repository / Provider
  ↓
Moodle REST / Prisma SaaS DB / Cache
```

Rules:

- `domain` tidak import React, Next.js, Prisma, Moodle REST client, `fetch`, atau infrastructure.
- `application` hanya bergantung pada domain/core abstraction.
- `infrastructure` mengimplementasikan port domain dan integrasi eksternal.
- `presentation/hooks` hanya memanggil internal Next.js API.
- `sections/atoms` dan `sections/molecules` tidak memanggil API.
- `sections/organisms` boleh memakai presentation hook.
- `src/app/**/page.tsx` hanya compose `sections/**/pages/*`.
- API route harus tipis.
- Browser tidak pernah memanggil Moodle secara langsung.

---

# 5. Mandatory No-Barrel Policy

Project **tidak menggunakan barrel export**.

Dilarang:

```text
src/modules/auth/index.ts
src/modules/auth/domain/index.ts
src/sections/auth/index.ts
src/core/index.ts
src/shared-ui/index.ts
```

Dilarang:

```ts
export * from "./AuthService";
export * from "./LoginUseCase";
```

Gunakan direct import:

```ts
import { LoginUseCase } from "@/modules/auth/application/usecases/LoginUseCase";
import { AuthController } from "@/modules/auth/infrastructure/http/AuthController";
import LoginPageSection from "@/sections/auth/pages/LoginPageSection";
```

`index.ts` hanya diperbolehkan jika file tersebut memang entry-point runtime milik library eksternal/generated code dan bukan barrel buatan project.

Biome/CI harus memiliki pemeriksaan yang mencegah barrel baru masuk ke repository.

---

# 6. Standard Module Pattern

Semua module mengikuti pola yang Anda gunakan.

```text
src/modules/{feature}/
├── application/
│   ├── services/
│   │   └── {Feature}Service.ts
│   └── usecases/
│       ├── Get{Feature}UseCase.ts
│       ├── Create{Feature}UseCase.ts
│       └── ...
│
├── domain/
│   ├── builder/
│   │   └── {Feature}QueryBuilder.ts
│   ├── dto/
│   │   ├── {Feature}RequestDTO.ts
│   │   └── {Feature}ResponseDTO.ts
│   ├── entity/
│   │   └── {Feature}Entity.ts
│   ├── interfaces/
│   │   ├── {Feature}Interfaces.ts
│   │   └── {Feature}RepositoryInterface.ts
│   ├── mapper/
│   │   └── {Feature}Mapper.ts
│   ├── types/
│   │   └── {Feature}Types.ts
│   └── value-object/
│       └── {Feature}ValueObject.ts
│
├── infrastructure/
│   ├── http/
│   │   └── {Feature}Controller.ts
│   ├── providers/
│   │   └── {Feature}Provider.ts
│   ├── repo/
│   │   └── {Feature}Repository.ts
│   ├── templates/
│   │   └── ...
│   └── validators/
│       └── {feature}Validator.ts
│
├── presentation/
│   ├── helpers/
│   │   └── ...
│   └── hooks/
│       └── use{Feature}Api.ts
│
└── __tests__/
    ├── application/
    ├── domain/
    ├── infrastructure/
    └── helpers/
```

Folder opsional tidak perlu dibuat jika belum memiliki kebutuhan nyata.

### Naming rules

- `entity`, bukan `entities`.
- `repo`, bukan `repositories`.
- dependency factory API ditempatkan pada `src/app/api/{feature}/_factory.ts`.
- controller berada di `infrastructure/http`.
- external Moodle response dimapping sebelum masuk ke application/domain.
- nama `core_*`, `mod_quiz_*`, `local_examapi_*` tidak boleh bocor ke presentation/UI.

---

# 7. Standard Sections Pattern

```text
src/sections/{feature}/
├── atoms/
├── molecules/
├── organisms/
└── pages/
```

Rules:

```text
atoms
  → props only
  → no API

molecules
  → props + callback
  → no API

organisms
  → state coordinator
  → boleh memakai presentation hook

pages
  → compose organisms/molecules
  → minimal orchestration
```

Management table pattern:

```text
Page Header
↓
Statistics
↓
Filter / Search
↓
Table
↓
Pagination
```

Loading:

- header tetap tampil;
- filter tetap tampil;
- skeleton hanya mengganti content/table body.

Empty state:

- tidak menutup page header;
- tidak menutup filter;
- table header dipertahankan jika relevan;
- `EmptyState` hanya mengganti body/content utama.

---

# 8. App Router — Separate Pages per Role

```text
src/app/
├── layout.tsx
├── page.tsx
│
├── (auth)/
│   ├── layout.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── forgot-password/
│   │   └── page.tsx
│   └── reset-password/
│       └── page.tsx
│
├── (admin)/
│   └── admin/
│       ├── layout.tsx
│       ├── dashboard/
│       │   └── page.tsx
│       ├── tenants/
│       │   ├── page.tsx
│       │   └── [tenantId]/
│       │       └── page.tsx
│       ├── audit/
│       │   └── page.tsx
│       └── settings/
│           └── page.tsx
│
├── (tenant)/
│   └── tenant/
│       ├── layout.tsx
│       ├── dashboard/
│       │   └── page.tsx
│       ├── users/
│       │   └── page.tsx
│       ├── enrolments/
│       │   └── page.tsx
│       ├── groups/
│       │   └── page.tsx
│       ├── courses/
│       │   ├── page.tsx
│       │   └── [courseId]/
│       │       └── page.tsx
│       ├── questions/
│       │   └── page.tsx
│       ├── exams/
│       │   ├── page.tsx
│       │   └── [quizId]/
│       │       ├── page.tsx
│       │       └── monitor/
│       │           └── page.tsx
│       ├── results/
│       │   └── page.tsx
│       ├── branding/
│       │   └── page.tsx
│       └── audit/
│           └── page.tsx
│
├── (student)/
│   └── student/
│       ├── layout.tsx
│       ├── dashboard/
│       │   └── page.tsx
│       ├── courses/
│       │   ├── page.tsx
│       │   └── [courseId]/
│       │       └── page.tsx
│       ├── exams/
│       │   ├── page.tsx
│       │   └── [quizId]/
│       │       ├── page.tsx
│       │       └── attempt/
│       │           └── [attemptId]/
│       │               └── page.tsx
│       └── results/
│           ├── page.tsx
│           └── [quizId]/
│               └── page.tsx
│
└── api/
    └── ...
```

### Layout guard

```text
(admin)/admin/layout.tsx
  → requireRole(ADMIN)

(tenant)/tenant/layout.tsx
  → requireRole(TENANT)
  → require tenantId

(student)/student/layout.tsx
  → requireRole(STUDENT)
  → require tenantId
```

Role mismatch harus diarahkan ke halaman aman (`/login` atau role home yang sesuai), namun API tetap wajib mengembalikan `403` untuk request yang tidak authorized.

---

# 9. API Route Pattern

API mengikuti pola feature route dan `_factory.ts`.

```text
src/app/api/
├── auth/
│   ├── change/
│   │   └── route.ts
│   ├── current-session/
│   │   └── route.ts
│   ├── forgot/
│   │   └── route.ts
│   ├── login/
│   │   └── route.ts
│   ├── logout/
│   │   └── route.ts
│   ├── logout-all/
│   │   └── route.ts
│   ├── refresh/
│   │   └── route.ts
│   ├── register/
│   │   └── route.ts
│   ├── reset/
│   │   └── route.ts
│   └── _factory.ts
│
├── tenants/
│   ├── route.ts
│   ├── [tenantId]/
│   │   ├── route.ts
│   │   ├── connection-test/
│   │   │   └── route.ts
│   │   └── status/
│   │       └── route.ts
│   └── _factory.ts
│
├── courses/
│   ├── route.ts
│   ├── [courseId]/
│   │   ├── route.ts
│   │   ├── contents/
│   │   │   └── route.ts
│   │   └── quizzes/
│   │       └── route.ts
│   └── _factory.ts
│
├── quizzes/
│   ├── [quizId]/
│   │   ├── route.ts
│   │   ├── access/
│   │   │   └── route.ts
│   │   ├── grade/
│   │   │   └── route.ts
│   │   └── attempts/
│   │       └── route.ts
│   └── _factory.ts
│
├── attempts/
│   ├── [attemptId]/
│   │   ├── route.ts
│   │   ├── answers/
│   │   │   └── route.ts
│   │   ├── summary/
│   │   │   └── route.ts
│   │   ├── submit/
│   │   │   └── route.ts
│   │   └── review/
│   │       └── route.ts
│   └── _factory.ts
│
├── users/
│   ├── route.ts
│   ├── [userId]/route.ts
│   └── _factory.ts
├── enrolments/
│   ├── route.ts
│   └── _factory.ts
├── groups/
│   ├── route.ts
│   └── _factory.ts
├── questions/
│   ├── route.ts
│   ├── [questionId]/route.ts
│   └── _factory.ts
├── exams/
│   ├── route.ts
│   ├── [examId]/route.ts
│   └── _factory.ts
├── exam-monitor/
│   ├── [quizId]/route.ts
│   ├── attempts/[attemptId]/force-finish/route.ts
│   ├── attempts/[attemptId]/reset/route.ts
│   ├── attempts/[attemptId]/extend-time/route.ts
│   ├── users/[userId]/force-logout/route.ts
│   └── _factory.ts
├── grades/
│   ├── route.ts
│   └── _factory.ts
└── audit/
    ├── route.ts
    └── _factory.ts
```

Route handler hanya:

1. parse request;
2. resolve actor/tenant;
3. panggil controller dari `_factory.ts`;
4. return standard response.

Business logic tidak boleh berada di `route.ts`.

---

# 10. Core Structure

```text
src/core/
├── auth/
│   ├── CurrentActor.ts
│   ├── Session.ts
│   ├── SessionRepository.ts
│   └── resolveCurrentActor.ts
├── base/
│   ├── BaseEntity.ts
│   ├── BaseService.ts
│   └── Result.ts
├── config/
│   ├── env.ts
│   └── serverEnv.ts
├── errors/
│   ├── AppError.ts
│   ├── DomainError.ts
│   ├── ForbiddenError.ts
│   ├── InfrastructureError.ts
│   ├── MoodleError.ts
│   ├── NotFoundError.ts
│   ├── UnauthorizedError.ts
│   └── ValidationError.ts
├── http/
│   ├── ApiErrorResponse.ts
│   ├── ApiResponse.ts
│   ├── HttpStatus.ts
│   └── withApiHandler.ts
├── logger/
│   ├── Logger.ts
│   └── createLogger.ts
├── moodle/
│   ├── MoodleClientFactory.ts
│   ├── MoodleCredentialProvider.ts
│   ├── MoodleErrorMapper.ts
│   ├── MoodleRestClient.ts
│   └── types/
│       ├── MoodleExceptionResponse.ts
│       └── MoodleRequestParameters.ts
├── rbac/
│   ├── AppRole.ts
│   ├── Permission.ts
│   ├── RolePermissionMap.ts
│   ├── AuthorizationContext.ts
│   ├── AuthorizationError.ts
│   ├── authorize.ts
│   ├── hasPermission.ts
│   ├── requireRole.ts
│   └── requirePermission.ts
├── security/
│   ├── EncryptionProvider.ts
│   ├── RateLimiter.ts
│   └── RequestId.ts
├── tenant/
│   ├── TenantContext.ts
│   ├── TenantResolver.ts
│   └── resolveCurrentTenant.ts
└── utils/
    ├── assertNever.ts
    ├── date.ts
    └── pagination.ts
```

Tidak ada `index.ts` pada folder di atas.

---

# 11. Module Map

## 11.1 `auth`

```text
src/modules/auth/
├── application/
│   ├── services/
│   │   └── AuthService.ts
│   └── usecases/
│       ├── ChangePasswordUseCase.ts
│       ├── ForgotPasswordUseCase.ts
│       ├── GetCurrentSessionUseCase.ts
│       ├── LoginUseCase.ts
│       ├── LogoutAllUseCase.ts
│       ├── LogoutUseCase.ts
│       ├── RefreshTokenUseCase.ts
│       ├── RegisterUseCase.ts
│       └── ResetPasswordUseCase.ts
├── domain/
│   ├── builder/
│   │   └── AuthQueryBuilder.ts
│   ├── dto/
│   │   ├── AuthRequestDTO.ts
│   │   └── AuthResponseDTO.ts
│   ├── entity/
│   │   ├── AuthEntity.ts
│   │   ├── AuthPayloadEntity.ts
│   │   ├── AuthSessionEntity.ts
│   │   └── RefreshTokenEntity.ts
│   ├── interfaces/
│   │   ├── AuthInterfaces.ts
│   │   ├── AuthUnitOfWorkInterface.ts
│   │   ├── CookieManagerInterface.ts
│   │   ├── MailProviderInterface.ts
│   │   ├── PasswordHasherInterface.ts
│   │   ├── PasswordResetNotifierInterface.ts
│   │   └── TokenProviderInterface.ts
│   ├── mapper/
│   │   └── AuthMapper.ts
│   ├── types/
│   │   └── AuthJwtPayload.ts
│   └── value-object/
│       └── RefreshToken.ts
├── infrastructure/
│   ├── http/
│   │   └── AuthController.ts
│   ├── providers/
│   │   ├── Argon2PasswordHasher.ts
│   │   ├── CookieManager.ts
│   │   ├── JoseTokenProvider.ts
│   │   └── MailProviders.ts
│   ├── repo/
│   │   ├── AuthRepository.ts
│   │   └── AuthUnitOfWork.ts
│   ├── templates/
│   │   ├── emailTemplateUtils.ts
│   │   ├── resetPasswordTemplate.ts
│   │   └── verificationTemplate.ts
│   └── validators/
│       └── authValidator.ts
└── presentation/
    ├── helpers/
    │   └── getCurrentSessions.ts
    └── hooks/
        └── useAuthApi.ts
```

Untuk Exam SaaS, repository login tenant/student mengadaptasi Moodle `/login/token.php` + `core_webservice_get_site_info`. Bila platform `ADMIN` menggunakan auth terpisah dari Moodle, implementasinya tetap berada di port/repo auth yang sama dan dibedakan melalui actor strategy; credential Moodle tidak boleh dibocorkan ke browser.

## 11.2 `tenant`

```text
src/modules/tenant/
├── application/
│   ├── services/TenantService.ts
│   └── usecases/
│       ├── GetTenantsUseCase.ts
│       ├── GetTenantUseCase.ts
│       ├── CreateTenantUseCase.ts
│       ├── UpdateTenantUseCase.ts
│       ├── UpdateTenantStatusUseCase.ts
│       └── TestMoodleConnectionUseCase.ts
├── domain/
│   ├── builder/TenantQueryBuilder.ts
│   ├── dto/TenantRequestDTO.ts
│   ├── dto/TenantResponseDTO.ts
│   ├── entity/TenantEntity.ts
│   ├── interfaces/TenantRepositoryInterface.ts
│   ├── mapper/TenantMapper.ts
│   ├── types/TenantTypes.ts
│   └── value-object/TenantSlug.ts
├── infrastructure/
│   ├── http/TenantController.ts
│   ├── providers/EncryptedTenantCredentialProvider.ts
│   ├── repo/TenantRepository.ts
│   └── validators/tenantValidator.ts
└── presentation/
    └── hooks/useTenantApi.ts
```

## 11.3 `courses`

Use cases:

```text
GetMyCoursesUseCase
GetCourseDetailUseCase
GetCourseContentsUseCase
```

Moodle:

```text
core_enrol_get_users_courses
core_course_get_courses_by_field
core_course_get_contents
```

## 11.4 `quizzes`

Use cases:

```text
GetCourseQuizzesUseCase
GetQuizDetailUseCase
GetQuizAccessUseCase
```

Moodle:

```text
mod_quiz_get_quizzes_by_courses
mod_quiz_get_quiz_access_information
mod_quiz_get_quiz_required_qtypes
```

## 11.5 `quiz-attempts`

Use cases:

```text
GetUserQuizAttemptsUseCase
StartQuizAttemptUseCase
GetQuizAttemptUseCase
SaveQuizAnswerUseCase
GetQuizAttemptSummaryUseCase
SubmitQuizAttemptUseCase
GetQuizAttemptReviewUseCase
```

Moodle:

```text
mod_quiz_get_user_quiz_attempts
mod_quiz_get_attempt_access_information
mod_quiz_start_attempt
mod_quiz_get_attempt_data
mod_quiz_save_attempt
mod_quiz_get_attempt_summary
mod_quiz_process_attempt
mod_quiz_get_attempt_review
```

## 11.6 `grades`

```text
GetQuizGradeUseCase
GetCourseGradesUseCase
```

## 11.7 Tenant administration modules

```text
users
enrolments
groups
questions
exam-administration
exam-monitor
```

Semua module tetap memakai standard module pattern pada Bagian 6.

---

# 12. Hybrid Storage Strategy

## Moodle database — authoritative academic data

Moodle menjadi source of truth untuk:

- user akademik;
- course;
- enrolment;
- group/cohort;
- quiz;
- question;
- quiz attempt;
- answer;
- gradebook.

Next.js **tidak** melakukan direct SQL query ke Moodle.

## Next.js SaaS database — operational metadata

Prisma/PostgreSQL digunakan untuk:

```text
tenants
tenant_credentials
tenant_brandings
saas_audit_logs
platform_admin_accounts (jika ADMIN tidak memakai identity provider eksternal)
application_sessions (jika session server-side dipilih)
```

Contoh minimum:

```prisma
enum TenantStatus {
  ACTIVE
  MAINTENANCE
  SUSPENDED
}

model Tenant {
  id         String       @id @default(uuid())
  slug       String       @unique
  name       String
  status     TenantStatus @default(ACTIVE)
  createdAt  DateTime     @default(now())
  updatedAt  DateTime     @updatedAt

  credential TenantCredential?
  branding   TenantBranding?
  auditLogs  SaasAuditLog[]
}

model TenantCredential {
  id                    String   @id @default(uuid())
  tenantId              String   @unique
  moodleUrl             String
  encryptedAdminToken   String
  encryptedProctorToken String
  timeoutBudgetMs       Int      @default(5000)
  sslVerify             Boolean  @default(true)
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  tenant Tenant @relation(fields: [tenantId], references: [id], onDelete: Cascade)
}

model TenantBranding {
  id               String   @id @default(uuid())
  tenantId         String   @unique
  logoUrl          String?
  primaryColor     String   @default("#0f172a")
  examInstructions String?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  tenant Tenant @relation(fields: [tenantId], references: [id], onDelete: Cascade)
}

model SaasAuditLog {
  id         String   @id @default(uuid())
  tenantId   String?
  actorId    String
  actorRole  String
  action     String
  entityType String
  entityId   String?
  requestId  String
  details    Json?
  createdAt  DateTime @default(now())

  tenant Tenant? @relation(fields: [tenantId], references: [id], onDelete: Cascade)
}
```

---

# 13. Moodle Credential Security

- Algorithm: `aes-256-gcm`.
- Master key berasal dari environment server.
- Key derivation tenant-specific menggunakan HKDF-SHA256.
- IV 12 byte random per encryption.
- Auth tag 16 byte.
- `MoodleRestClient` wajib `server-only`.
- credential/token tidak pernah diserialisasi ke browser.
- logger meredaksi token, Authorization header, password, session secret.
- Moodle SQL port tidak boleh dapat diakses dari Next.js server.

---

# 14. Authentication & Session Strategy

## Tenant/Student login

```text
Browser
  ↓ POST /api/auth/login
AuthController
  ↓ resolve tenant
AuthService / LoginUseCase
  ↓
Moodle Auth Repository
  ↓ POST {tenantMoodleUrl}/login/token.php
  ↓
core_webservice_get_site_info
  ↓
resolve actor role + tenant membership
  ↓
create encrypted/signed application session
  ↓
HttpOnly Secure cookie
```

Raw Moodle token tidak pernah dikirim ke JavaScript browser.

## Session actor

```ts
export interface CurrentActor {
  readonly id: string;
  readonly role: AppRole;
  readonly tenantId: string | null;
  readonly moodleUserId: number | null;
  readonly permissions: readonly string[];
}
```

`ADMIN` boleh memiliki `tenantId = null`.
`TENANT` dan `STUDENT` wajib memiliki `tenantId`.

---

# 15. Standard API Response

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
    "code": "FORBIDDEN",
    "message": "Anda tidak memiliki akses ke resource ini."
  }
}
```

Never expose Moodle stack trace, raw Moodle exception, token, secret, or internal database details.

---

# 16. UI Role Separation

## Admin sections

```text
src/sections/admin-dashboard/
src/sections/tenant-management/
src/sections/platform-audit/
src/sections/platform-settings/
```

## Tenant sections

```text
src/sections/tenant-dashboard/
src/sections/users/
src/sections/enrolments/
src/sections/groups/
src/sections/courses/
src/sections/questions/
src/sections/exam-administration/
src/sections/exam-monitor/
src/sections/grades/
src/sections/tenant-branding/
src/sections/tenant-audit/
```

## Student sections

```text
src/sections/student-dashboard/
src/sections/student-courses/
src/sections/student-exams/
src/sections/quiz-attempts/
src/sections/student-results/
```

Komponen yang benar-benar generik tetap berada di `shared-ui`, bukan dipindahkan antar role section.

---

# 17. Student Exam UI

```text
src/sections/quiz-attempts/
├── atoms/
│   ├── AnswerStatusBadge.tsx
│   ├── AttemptTimer.tsx
│   ├── ConnectionIndicator.tsx
│   └── QuestionNumberBadge.tsx
├── molecules/
│   ├── AnswerOption.tsx
│   ├── AttemptHeader.tsx
│   ├── QuestionCard.tsx
│   ├── QuestionNavigatorItem.tsx
│   └── SubmitConfirmation.tsx
├── organisms/
│   ├── QuizAttemptView.tsx
│   ├── QuizNavigator.tsx
│   ├── QuizQuestionPanel.tsx
│   └── QuizSubmissionPanel.tsx
└── pages/
    └── QuizAttemptPageSection.tsx
```

State minimum:

```text
loading
ready
saving
saved
retrying
offline
submitting
submitted
error
```

Autosave tidak boleh membuat authoritative copy kedua di SaaS DB.

---

# 18. Tenant Management Table Standard

Setiap management page tenant/admin memakai:

- filter;
- search;
- pagination;
- table skeleton;
- empty state yang tidak menutup header;
- action menu;
- create/edit form/modal;
- destructive confirmation;
- permission-aware action visibility;
- server-side authorization tetap wajib meskipun action tidak ditampilkan di UI.

---

# 19. Moodle Adapter

```text
src/core/moodle/
├── MoodleRestClient.ts
├── MoodleClientFactory.ts
├── MoodleCredentialProvider.ts
├── MoodleErrorMapper.ts
└── types/
    ├── MoodleExceptionResponse.ts
    └── MoodleRequestParameters.ts
```

`MoodleRestClient` menangani:

- POST REST;
- Moodle nested parameter encoding;
- timeout;
- parsing;
- Moodle exception mapping;
- non-200 response;
- request ID;
- secret-safe logging.

Tidak ada module lain yang melakukan `fetch()` langsung ke Moodle.

---

# 20. Custom Moodle API Boundary

Custom plugin tetap terpisah:

```text
local_examapi/
```

Question bank:

```text
local_exam_get_question_bank
local_exam_create_question
local_exam_update_question
local_exam_delete_question
local_exam_import_questions
```

Exam administration:

```text
local_exam_create_quiz
local_exam_update_quiz
local_exam_delete_quiz
local_exam_duplicate_quiz
local_exam_add_question_to_quiz
local_exam_remove_question_from_quiz
local_exam_reorder_quiz_questions
local_exam_add_random_questions
```

Exam monitor:

```text
local_exam_get_exam_monitor
local_exam_get_active_attempts
local_exam_force_finish_attempt
local_exam_reset_attempt
local_exam_extend_attempt_time
local_exam_force_logout_user
```

Nama fungsi Moodle hanya muncul di infrastructure adapter.

---

# 21. TDD Standard

## RED

- tulis domain/application test sebelum production code;
- gunakan mock repository/port;
- test authorization dan tenant isolation untuk operasi protected;
- bug fix dimulai dengan regression test yang gagal.

## GREEN

- implement minimal code untuk memenuhi behavior;
- buat adapter infrastructure;
- integrasikan controller + API route.

## REFACTOR

- hapus duplikasi;
- perjelas naming;
- pertahankan dependency direction;
- pastikan test tetap hijau;
- jangan membuat barrel export saat refactor.

Verification:

```text
npm run typecheck
npm run lint
npm run test
npm run build
```

---

# 22. Test Layout

```text
src/modules/quiz-attempts/__tests__/
├── application/
│   ├── StartQuizAttemptUseCase.test.ts
│   ├── SaveQuizAnswerUseCase.test.ts
│   └── SubmitQuizAttemptUseCase.test.ts
├── domain/
│   ├── QuizAttemptEntity.test.ts
│   └── QuizAttemptRules.test.ts
├── infrastructure/
│   ├── MoodleQuizAttemptMapper.test.ts
│   └── QuizAttemptRepository.test.ts
└── helpers/
    ├── MockQuizAttemptRepository.ts
    └── QuizAttemptTestFactory.ts
```

RBAC test wajib ada untuk semua mutation protected.

---

# 23. Sequential Implementation Issues

Implementasi tidak dilakukan secara acak.

```text
01 Bootstrap & Architecture Guardrails
02 Core Foundation
03 RBAC & Role Route Separation
04 Tenant SaaS Database & Tenant Module
05 Moodle REST Adapter & Credential Security
06 Authentication, Session & Actor Resolution
07 Admin Portal — Tenant Management
08 Tenant Portal Foundation & Dashboard
09 Courses
10 Quizzes & Access
11 Quiz Attempts Core
12 Student Exam UI
13 Grades & Results
14 Tenant Users, Enrolments & Groups
15 Question Bank
16 Exam Administration
17 Exam Monitoring
18 Audit & Security Hardening
19 Performance & Resilience
20 E2E, CI & Release Gate
```

Setiap issue disimpan **berurutan pada level root yang sama**, tanpa folder issue terpisah: `issue.md`, `issue2.md`, `issue3.md`, ... sampai `issue20.md`.

---

# 24. Definition of Done per Feature

Feature hanya selesai jika:

- domain contract tersedia;
- use case tersedia;
- repository/interface tersedia;
- controller tersedia;
- infrastructure adapter tersedia;
- mapper tersedia bila ada external response;
- `_factory.ts` API tersedia;
- route handler tipis;
- presentation hook tersedia bila client interaction diperlukan;
- section mengikuti atom/molecule/organism/page;
- loading/empty/error state tersedia;
- pagination tersedia untuk scalable list;
- permission check tersedia;
- tenant isolation diuji;
- ownership diuji untuk resource student;
- tests lulus;
- TypeScript lulus;
- Biome lulus;
- build lulus;
- tidak ada Moodle secret di browser;
- tidak ada direct Moodle SQL;
- tidak ada `any` tanpa alasan;
- tidak ada barrel `index.ts`/`index.tsx`.

---

# 25. Explicit Non-Goals

- tidak mengubah Moodle core;
- tidak mengakses Moodle SQL dari Next.js;
- tidak mengirim Moodle REST token ke browser;
- tidak menduplikasi Quiz Engine Moodle;
- tidak membuat authoritative copy answer/grade di SaaS DB;
- tidak menggabungkan `quizzes` dan `quiz-attempts`;
- tidak mengandalkan UI hiding sebagai authorization;
- tidak mengizinkan TENANT memilih `tenantId` arbitrary dari request body;
- tidak membuat WebSocket sebelum kebutuhan monitoring membuktikannya;
- tidak membuat abstraction kosong;
- tidak menggunakan barrel exports.

---

# 26. Final Target Architecture

```text
┌──────────────────────────────────────────────┐
│ Browser                                      │
│ /admin/*  /tenant/*  /student/*             │
└──────────────────────┬───────────────────────┘
                       ↓
┌──────────────────────────────────────────────┐
│ Role Layout Guard + Sections                 │
│ Atom → Molecule → Organism → Page            │
└──────────────────────┬───────────────────────┘
                       ↓
┌──────────────────────────────────────────────┐
│ Presentation Hooks                           │
└──────────────────────┬───────────────────────┘
                       ↓
┌──────────────────────────────────────────────┐
│ app/api/* route.ts + _factory.ts             │
└──────────────────────┬───────────────────────┘
                       ↓
┌──────────────────────────────────────────────┐
│ Infrastructure HTTP Controller + RBAC        │
└──────────────────────┬───────────────────────┘
                       ↓
┌──────────────────────────────────────────────┐
│ Application Services / Use Cases             │
└──────────────────────┬───────────────────────┘
                       ↓
┌──────────────────────────────────────────────┐
│ Domain Entity / DTO / Interface / Rule       │
└──────────────────────┬───────────────────────┘
                       ↑
┌──────────────────────────────────────────────┐
│ Infrastructure Repo / Provider / Mapper      │
└──────────────┬─────────────────────┬─────────┘
               ↓                     ↓
       ┌───────────────┐     ┌────────────────┐
       │ Moodle REST    │     │ Prisma SaaS DB │
       │ source of truth│     │ metadata only  │
       └───────────────┘     └────────────────┘
```
