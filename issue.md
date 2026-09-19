# ISSUE: Initial Architecture, Planning & Scaffolding — Moodle Exam SaaS

## 1. Objective

Membangun fondasi aplikasi SaaS ujian berbasis:

- **Next.js** sebagai frontend + BFF/API server.
- **Moodle 5.x** sebagai LMS backend, Quiz Engine, Question Engine, Gradebook, enrolment, dan source of truth untuk attempt.
- **Hexagonal Architecture** untuk setiap module.
- **Multi-tenant** sebagai requirement inti.
- **TypeScript strict**.
- **Vitest + TDD (RED → GREEN → REFACTOR)**.
- **shadcn/ui** sebagai primitive UI.
- **Atomic UI** pada `sections/*`.
- Moodle hanya boleh dipanggil melalui **Infrastructure Adapter**.
- Browser tidak pernah berkomunikasi langsung dengan Moodle.

---

# 2. Architectural Direction

## 2.1 Request Flow

```text
Browser
  ↓
sections/*
  ↓
modules/*/presentation/hooks
  ↓
app/api/v1/*
  ↓
Application Use Case
  ↓
Domain Port
  ↓
Infrastructure Adapter
  ↓
Moodle REST / Database / Cache
```

## 2.2 Dependency Direction

```text
Domain
  ↑
Application
  ↑
Infrastructure
  ↑
API Route

Presentation Hook
  ↓
Next.js API
```

Rules:

- `domain` tidak import React, Next.js, Moodle, Prisma, `fetch`, atau infrastructure.
- `application` hanya bergantung pada domain/core abstraction.
- `infrastructure` mengimplementasikan port dari domain.
- `presentation/hooks` hanya memanggil `/api/v1/*`.
- `sections/atoms` dan `sections/molecules` tidak memanggil API.
- API hanya dipanggil dari hook yang digunakan organism.
- `route.ts` harus tipis dan tidak memuat business rules.

---

# 3. Repository Scaffolding

```text
/
├── public/
│   ├── favicon.svg
│   └── images/
│       ├── brand/
│       ├── empty-state/
│       └── exam/
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   │
│   │   ├── (auth)/
│   │   │   ├── layout.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── forgot-password/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── courses/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [courseId]/
│   │   │   │       └── page.tsx
│   │   │   ├── exams/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [quizId]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── attempt/
│   │   │   │           └── [attemptId]/
│   │   │   │               └── page.tsx
│   │   │   ├── results/
│   │   │   │   └── page.tsx
│   │   │   └── administration/
│   │   │       ├── users/
│   │   │       ├── courses/
│   │   │       ├── exams/
│   │   │       ├── questions/
│   │   │       ├── monitoring/
│   │   │       └── tenants/
│   │   │
│   │   └── api/
│   │       └── v1/
│   │           ├── auth/
│   │           │   ├── login/route.ts
│   │           │   ├── logout/route.ts
│   │           │   └── me/route.ts
│   │           ├── users/
│   │           │   ├── route.ts
│   │           │   └── [userId]/route.ts
│   │           ├── courses/
│   │           │   ├── route.ts
│   │           │   └── [courseId]/
│   │           │       ├── route.ts
│   │           │       ├── contents/route.ts
│   │           │       └── quizzes/route.ts
│   │           ├── quizzes/
│   │           │   └── [quizId]/
│   │           │       ├── route.ts
│   │           │       ├── access/route.ts
│   │           │       ├── grade/route.ts
│   │           │       └── attempts/route.ts
│   │           ├── attempts/
│   │           │   └── [attemptId]/
│   │           │       ├── route.ts
│   │           │       ├── answers/route.ts
│   │           │       ├── summary/route.ts
│   │           │       ├── submit/route.ts
│   │           │       └── review/route.ts
│   │           ├── questions/
│   │           ├── grades/
│   │           ├── enrolments/
│   │           ├── groups/
│   │           ├── notifications/
│   │           ├── exam-monitor/
│   │           └── tenants/
│   │
│   ├── components/
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── checkbox.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── select.tsx
│   │       ├── skeleton.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── textarea.tsx
│   │       └── tooltip.tsx
│   │
│   ├── core/
│   │   ├── auth/
│   │   │   ├── CurrentActor.ts
│   │   │   ├── Session.ts
│   │   │   ├── SessionRepository.ts
│   │   │   └── resolveCurrentActor.ts
│   │   ├── base/
│   │   │   ├── BaseEntity.ts
│   │   │   ├── BaseService.ts
│   │   │   └── Result.ts
│   │   ├── config/
│   │   │   ├── env.ts
│   │   │   └── serverEnv.ts
│   │   ├── errors/
│   │   │   ├── AppError.ts
│   │   │   ├── DomainError.ts
│   │   │   ├── ForbiddenError.ts
│   │   │   ├── InfrastructureError.ts
│   │   │   ├── MoodleError.ts
│   │   │   ├── NotFoundError.ts
│   │   │   ├── UnauthorizedError.ts
│   │   │   └── ValidationError.ts
│   │   ├── http/
│   │   │   ├── ApiErrorResponse.ts
│   │   │   ├── ApiResponse.ts
│   │   │   ├── HttpStatus.ts
│   │   │   └── withApiHandler.ts
│   │   ├── logger/
│   │   │   ├── Logger.ts
│   │   │   └── createLogger.ts
│   │   ├── moodle/
│   │   │   ├── MoodleClientFactory.ts
│   │   │   ├── MoodleCredentialProvider.ts
│   │   │   ├── MoodleErrorMapper.ts
│   │   │   ├── MoodleRestClient.ts
│   │   │   └── types/
│   │   │       ├── MoodleExceptionResponse.ts
│   │   │       └── MoodleRequestParameters.ts
│   │   ├── security/
│   │   │   ├── EncryptionProvider.ts
│   │   │   ├── RateLimiter.ts
│   │   │   └── RequestId.ts
│   │   ├── tenant/
│   │   │   ├── TenantContext.ts
│   │   │   ├── TenantResolver.ts
│   │   │   └── resolveCurrentTenant.ts
│   │   └── utils/
│   │       ├── assertNever.ts
│   │       ├── date.ts
│   │       └── pagination.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── tenant/
│   │   ├── users/
│   │   ├── courses/
│   │   ├── enrolments/
│   │   ├── groups/
│   │   ├── quizzes/
│   │   ├── quiz-attempts/
│   │   ├── questions/
│   │   ├── grades/
│   │   ├── files/
│   │   ├── notifications/
│   │   ├── exam-monitor/
│   │   └── exam-administration/
│   │
│   ├── sections/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── courses/
│   │   ├── quizzes/
│   │   ├── quiz-attempts/
│   │   ├── questions/
│   │   ├── grades/
│   │   ├── exam-monitor/
│   │   └── administration/
│   │
│   ├── shared-ui/
│   │   ├── component/
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorState.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── SearchField.tsx
│   │   │   ├── SelectField.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── TableSkeleton.tsx
│   │   ├── feedback/
│   │   │   └── toast.ts
│   │   ├── layout/
│   │   └── navigation/
│   │
│   ├── styles/
│   │   └── globals.css
│   │
│   └── e2e/
│       └── tests/
│           ├── auth.cy.ts
│           ├── student-exam.cy.ts
│           └── admin-exam.cy.ts
│
├── .env.example
├── biome.json
├── components.json
├── issue.md
├── next.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vitest.config.ts
```

---

# 4. Standard Module Scaffolding

Semua module menggunakan struktur berikut.

```text
src/modules/{feature}/
├── domain/
│   ├── dto/
│   ├── entities/
│   ├── interfaces/
│   ├── rules/
│   ├── types/
│   └── validators/
│
├── application/
│   ├── services/
│   └── usecases/
│
├── infrastructure/
│   ├── clients/
│   ├── factories/
│   ├── mappers/
│   ├── providers/
│   └── repositories/
│
├── presentation/
│   └── hooks/
│
└── __tests__/
    ├── domain/
    ├── application/
    ├── infrastructure/
    └── helpers/
```

Tidak semua folder harus berisi file. Jangan membuat abstraction kosong hanya untuk memenuhi struktur.

---

# 5. Standard Section Scaffolding

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
  → page composition
  → minimal orchestration
```

---

# 6. Initial Module Map

## 6.1 `auth`

### Domain

```text
modules/auth/domain/
├── dto/
│   ├── LoginRequestDTO.ts
│   ├── LoginResponseDTO.ts
│   └── CurrentUserResponseDTO.ts
├── entities/
│   └── AuthenticatedUser.ts
├── interfaces/
│   ├── AuthRepository.ts
│   └── SessionRepository.ts
└── validators/
    └── AuthValidator.ts
```

### Application

```text
application/usecases/
├── LoginUseCase.ts
├── LogoutUseCase.ts
└── GetCurrentUserUseCase.ts
```

### Infrastructure

```text
infrastructure/
├── mappers/
│   └── MoodleUserMapper.ts
├── repositories/
│   ├── MoodleAuthRepository.ts
│   └── CookieSessionRepository.ts
└── factories/
    └── createAuthDependencies.ts
```

### Presentation

```text
presentation/hooks/
└── useAuthApi.ts
```

### Moodle Integration

```text
/login/token.php
core_webservice_get_site_info
```

---

# 7. `tenant`

```text
modules/tenant/
├── domain/
│   ├── dto/
│   │   ├── TenantResponseDTO.ts
│   │   └── TenantConfigurationDTO.ts
│   ├── entities/
│   │   └── Tenant.ts
│   ├── interfaces/
│   │   ├── TenantRepository.ts
│   │   └── TenantCredentialRepository.ts
│   └── types/
│   │   └── TenantStatus.ts
│   ├── validators/
│   │   └── TenantValidator.ts
│   ├── rules/
│   │   └── TenantRules.ts
│   └── value-objects/
│       └── TenantSlug.ts
├── application/
│   └── usecases/
│       ├── GetTenantUseCase.ts
│       ├── CreateTenantUseCase.ts
│       ├── UpdateTenantUseCase.ts
│       └── TestMoodleConnectionUseCase.ts
├── infrastructure/
│   ├── repositories/
│   │   └── DatabaseTenantRepository.ts
│   ├── providers/
│   │   └── EncryptedTenantCredentialProvider.ts
│   └── factories/
│       └── createTenantDependencies.ts
└── presentation/
    └── hooks/
        └── useTenantApi.ts
```

Tenant wajib resolved sebelum request tenant-specific diproses.

---

# 8. `courses`

```text
modules/courses/
├── domain/
│   ├── dto/
│   │   ├── CourseResponseDTO.ts
│   │   ├── CourseDetailResponseDTO.ts
│   │   └── CourseContentResponseDTO.ts
│   ├── entities/
│   │   └── Course.ts
│   ├── interfaces/
│   │   └── CourseRepository.ts
│   └── types/
│       └── CourseVisibility.ts
├── application/
│   └── usecases/
│       ├── GetMyCoursesUseCase.ts
│       ├── GetCourseDetailUseCase.ts
│       └── GetCourseContentsUseCase.ts
├── infrastructure/
│   ├── mappers/
│   │   └── MoodleCourseMapper.ts
│   ├── repositories/
│   │   └── MoodleCourseRepository.ts
│   └── factories/
│       └── createCourseDependencies.ts
└── presentation/
    └── hooks/
        └── useCourseApi.ts
```

Moodle functions:

```text
core_enrol_get_users_courses
core_course_get_courses_by_field
core_course_get_contents
```

---

# 9. `quizzes`

`quizzes` hanya menangani definisi ujian, metadata, access, dan listing.

```text
modules/quizzes/
├── domain/
│   ├── dto/
│   │   ├── QuizResponseDTO.ts
│   │   ├── QuizDetailResponseDTO.ts
│   │   └── QuizAccessResponseDTO.ts
│   ├── entities/
│   │   └── Quiz.ts
│   ├── interfaces/
│   │   └── QuizRepository.ts
│   ├── rules/
│   │   └── QuizRules.ts
│   └── types/
│       └── QuizAvailability.ts
├── application/
│   └── usecases/
│       ├── GetCourseQuizzesUseCase.ts
│       ├── GetQuizDetailUseCase.ts
│       └── GetQuizAccessUseCase.ts
├── infrastructure/
│   ├── mappers/
│   │   └── MoodleQuizMapper.ts
│   ├── repositories/
│   │   └── MoodleQuizRepository.ts
│   └── factories/
│       └── createQuizDependencies.ts
└── presentation/
    └── hooks/
        └── useQuizApi.ts
```

Moodle functions:

```text
mod_quiz_get_quizzes_by_courses
mod_quiz_get_quiz_access_information
mod_quiz_get_quiz_required_qtypes
```

---

# 10. `quiz-attempts`

Attempt harus menjadi module terpisah dari `quizzes`.

```text
modules/quiz-attempts/
├── domain/
│   ├── dto/
│   │   ├── StartQuizAttemptRequestDTO.ts
│   │   ├── QuizAttemptResponseDTO.ts
│   │   ├── QuizAttemptPageResponseDTO.ts
│   │   ├── SaveQuizAnswerRequestDTO.ts
│   │   ├── AttemptSummaryResponseDTO.ts
│   │   └── AttemptReviewResponseDTO.ts
│   ├── entities/
│   │   └── QuizAttempt.ts
│   ├── interfaces/
│   │   └── QuizAttemptRepository.ts
│   ├── rules/
│   │   └── QuizAttemptRules.ts
│   ├── types/
│   │   ├── QuizAttemptState.ts
│   │   ├── QuizAnswer.ts
│   │   └── AutosaveState.ts
│   └── validators/
│       └── QuizAttemptValidator.ts
├── application/
│   ├── services/
│   │   └── QuizAttemptService.ts
│   └── usecases/
│       ├── GetUserQuizAttemptsUseCase.ts
│       ├── StartQuizAttemptUseCase.ts
│       ├── GetQuizAttemptUseCase.ts
│       ├── SaveQuizAnswerUseCase.ts
│       ├── GetQuizAttemptSummaryUseCase.ts
│       ├── SubmitQuizAttemptUseCase.ts
│       └── GetQuizAttemptReviewUseCase.ts
├── infrastructure/
│   ├── mappers/
│   │   └── MoodleQuizAttemptMapper.ts
│   ├── repositories/
│   │   └── MoodleQuizAttemptRepository.ts
│   └── factories/
│       └── createQuizAttemptDependencies.ts
└── presentation/
    └── hooks/
        └── useQuizAttemptApi.ts
```

Moodle functions:

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

---

# 11. `grades`

```text
modules/grades/
├── domain/
│   ├── dto/
│   │   ├── GradeResponseDTO.ts
│   │   └── QuizGradeResponseDTO.ts
│   ├── entities/
│   │   └── Grade.ts
│   └── interfaces/
│       └── GradeRepository.ts
├── application/
│   └── usecases/
│       ├── GetQuizGradeUseCase.ts
│       └── GetCourseGradesUseCase.ts
├── infrastructure/
│   ├── mappers/
│   │   └── MoodleGradeMapper.ts
│   ├── repositories/
│   │   └── MoodleGradeRepository.ts
│   └── factories/
│       └── createGradeDependencies.ts
└── presentation/
    └── hooks/
        └── useGradeApi.ts
```

---

# 12. Admin Modules

## 12.1 `users`

Responsible for:

- user list;
- create;
- update;
- deactivate;
- bulk import;
- user detail.

Moodle:

```text
core_user_create_users
core_user_update_users
core_user_get_users
core_user_get_users_by_field
```

## 12.2 `enrolments`

Responsible for:

- participant list;
- manual enrol;
- unenrol;
- enrolment status.

Moodle:

```text
core_enrol_get_enrolled_users
enrol_manual_enrol_users
enrol_manual_unenrol_users
```

## 12.3 `groups`

Responsible for:

- classes;
- exam groups;
- group members.

Moodle:

```text
core_group_*
core_cohort_*
```

---

# 13. `questions`

Question bank administration must not be tightly coupled to Moodle form internals.

```text
modules/questions/
├── domain/
│   ├── dto/
│   │   ├── QuestionRequestDTO.ts
│   │   ├── QuestionResponseDTO.ts
│   │   ├── QuestionQueryRequestDTO.ts
│   │   └── QuestionListResponseDTO.ts
│   ├── entities/
│   │   └── Question.ts
│   ├── interfaces/
│   │   └── QuestionRepository.ts
│   ├── types/
│   │   ├── QuestionType.ts
│   │   ├── QuestionStatus.ts
│   │   └── QuestionDifficulty.ts
│   └── validators/
│       └── QuestionValidator.ts
├── application/
│   └── usecases/
│       ├── GetQuestionsUseCase.ts
│       ├── GetQuestionDetailUseCase.ts
│       ├── CreateQuestionUseCase.ts
│       ├── UpdateQuestionUseCase.ts
│       └── DeleteQuestionUseCase.ts
├── infrastructure/
│   ├── mappers/
│   │   └── MoodleQuestionMapper.ts
│   ├── repositories/
│   │   └── MoodleQuestionRepository.ts
│   └── factories/
│       └── createQuestionDependencies.ts
└── presentation/
    └── hooks/
        └── useQuestionApi.ts
```

Expected custom Moodle API:

```text
local_exam_get_question_bank
local_exam_create_question
local_exam_update_question
local_exam_delete_question
local_exam_import_questions
```

---

# 14. `exam-administration`

Responsible for exam creation/configuration.

```text
modules/exam-administration/
├── domain/
│   ├── dto/
│   ├── entities/
│   ├── interfaces/
│   │   └── ExamAdministrationRepository.ts
│   ├── rules/
│   └── validators/
├── application/
│   └── usecases/
│       ├── CreateExamUseCase.ts
│       ├── UpdateExamUseCase.ts
│       ├── DeleteExamUseCase.ts
│       ├── DuplicateExamUseCase.ts
│       ├── AddQuestionToExamUseCase.ts
│       ├── RemoveQuestionFromExamUseCase.ts
│       ├── ReorderExamQuestionsUseCase.ts
│       └── AddRandomQuestionUseCase.ts
├── infrastructure/
│   ├── repositories/
│   │   └── MoodleExamAdministrationRepository.ts
│   └── factories/
│       └── createExamAdministrationDependencies.ts
└── presentation/
    └── hooks/
        └── useExamAdministrationApi.ts
```

Custom Moodle API:

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

---

# 15. `exam-monitor`

Responsible for monitoring exam runtime.

```text
modules/exam-monitor/
├── domain/
│   ├── dto/
│   │   ├── ExamMonitorResponseDTO.ts
│   │   ├── ActiveAttemptResponseDTO.ts
│   │   └── ExamParticipantStatusDTO.ts
│   ├── entities/
│   │   └── ExamParticipantSession.ts
│   ├── interfaces/
│   │   └── ExamMonitorRepository.ts
│   └── types/
│       └── ExamParticipantStatus.ts
├── application/
│   └── usecases/
│       ├── GetExamMonitorUseCase.ts
│       ├── GetActiveAttemptsUseCase.ts
│       ├── ForceFinishAttemptUseCase.ts
│       ├── ResetAttemptUseCase.ts
│       ├── ExtendAttemptTimeUseCase.ts
│       └── ForceLogoutUserUseCase.ts
├── infrastructure/
│   ├── repositories/
│   │   └── MoodleExamMonitorRepository.ts
│   └── factories/
│       └── createExamMonitorDependencies.ts
└── presentation/
    └── hooks/
        └── useExamMonitorApi.ts
```

Custom Moodle API:

```text
local_exam_get_exam_monitor
local_exam_get_active_attempts
local_exam_force_finish_attempt
local_exam_reset_attempt
local_exam_extend_attempt_time
local_exam_force_logout_user
```

---

# 16. Core Moodle Adapter

Create first:

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

`MoodleRestClient` responsibilities:

- REST POST request;
- encode Moodle nested parameters;
- timeout;
- response parsing;
- Moodle exception detection;
- normalize errors;
- attach request ID;
- never log secrets.

It must be server-only.

```ts
import "server-only";
```

---

# 17. Internal API Contract

## Authentication

```text
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

## Course

```text
GET /api/v1/courses
GET /api/v1/courses/:courseId
GET /api/v1/courses/:courseId/contents
GET /api/v1/courses/:courseId/quizzes
```

## Quiz

```text
GET /api/v1/quizzes/:quizId
GET /api/v1/quizzes/:quizId/access
GET /api/v1/quizzes/:quizId/grade
POST /api/v1/quizzes/:quizId/attempts
```

## Attempt

```text
GET   /api/v1/attempts/:attemptId
PATCH /api/v1/attempts/:attemptId/answers
GET   /api/v1/attempts/:attemptId/summary
POST  /api/v1/attempts/:attemptId/submit
GET   /api/v1/attempts/:attemptId/review
```

## Administration

```text
GET    /api/v1/questions
POST   /api/v1/questions
GET    /api/v1/questions/:questionId
PATCH  /api/v1/questions/:questionId
DELETE /api/v1/questions/:questionId

GET    /api/v1/admin/exams
POST   /api/v1/admin/exams
GET    /api/v1/admin/exams/:examId
PATCH  /api/v1/admin/exams/:examId
DELETE /api/v1/admin/exams/:examId
```

## Monitor

```text
GET  /api/v1/exam-monitor/:quizId
GET  /api/v1/exam-monitor/:quizId/attempts

POST /api/v1/exam-monitor/attempts/:attemptId/force-finish
POST /api/v1/exam-monitor/attempts/:attemptId/reset
POST /api/v1/exam-monitor/attempts/:attemptId/extend-time
POST /api/v1/exam-monitor/users/:userId/force-logout
```

---

# 18. Standard API Response

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
    "code": "QUIZ_ATTEMPT_NOT_ALLOWED",
    "message": "Ujian belum dapat dimulai."
  }
}
```

Never expose Moodle stack trace, debugging information, token, or raw exception.

---

# 19. UI Design Scaffolding

## Shared primitives

Use `components/ui/*` for shadcn primitives.

Use `shared-ui/*` for project-level abstractions.

```text
shared-ui/component/
├── EmptyState.tsx
├── ErrorState.tsx
├── Pagination.tsx
├── SearchField.tsx
├── SelectField.tsx
├── StatusBadge.tsx
└── TableSkeleton.tsx
```

---

# 20. Student Exam Section

```text
sections/quiz-attempts/
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

Primary layout:

```text
Desktop:

┌────────────────────────────────────────────┐
│ Exam / Timer / Connection / Save Status    │
├──────────────────────────────┬─────────────┤
│ Question                     │ Navigator   │
│                              │             │
│ Answer                       │             │
├──────────────────────────────┴─────────────┤
│ Previous         Next               Submit │
└────────────────────────────────────────────┘
```

---

# 21. Admin Data Table Pattern

Every management table:

```text
Page Header
↓
Statistics (if useful)
↓
Filter / Search
↓
Table
↓
Pagination
```

Loading:

```text
Header remains
Filter remains
TableSkeleton inside content
```

Empty:

```text
Header remains
Filter remains
Table header remains where appropriate
EmptyState only replaces table body
```

Molecule table receives data and callbacks only.

Example props:

```ts
interface QuestionTableProps {
  readonly questions: readonly QuestionResponseDTO[];
  readonly loading: boolean;
  readonly page: number;
  readonly limit: number;
  readonly total: number;
  readonly onPageChange: (page: number) => void;
  readonly onView: (id: string) => void;
  readonly onEdit: (id: string) => void;
  readonly onDelete: (id: string) => void;
}
```

---

# 22. Development Phases

## Phase 0 — Bootstrap

### Tasks

- [ ] Create Next.js project.
- [ ] Configure TypeScript strict.
- [ ] Configure Tailwind CSS.
- [ ] Configure shadcn/ui.
- [ ] Configure Biome.
- [ ] Configure Vitest.
- [ ] Configure path aliases.
- [ ] Create `.env.example`.
- [ ] Create initial folder scaffolding.
- [ ] Add CI commands.
- [ ] Add `issue.md`.

### Required scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc --noEmit",
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "test": "vitest run",
    "test:watch": "vitest",
    "verify": "npm run typecheck && npm run lint && npm run test"
  }
}
```

### Definition of Done

- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm run test`
- [ ] `npm run build`

all pass.

---

# 23. Phase 1 — Core Foundation

Create:

```text
core/base
core/errors
core/http
core/logger
core/security
core/tenant
core/auth
```

Tasks:

- [ ] `Result`.
- [ ] application error hierarchy.
- [ ] standard API response.
- [ ] API route wrapper.
- [ ] request ID.
- [ ] structured logger.
- [ ] tenant context abstraction.
- [ ] actor/session abstraction.

Tests:

- [ ] API error mapping.
- [ ] standard response.
- [ ] tenant resolution.
- [ ] session resolution.

---

# 24. Phase 2 — Moodle REST Adapter

## RED

Write tests for:

- [ ] scalar parameter encoding;
- [ ] array parameter encoding;
- [ ] nested parameter encoding;
- [ ] Moodle exception handling;
- [ ] timeout;
- [ ] non-200 response;
- [ ] secret-safe logging.

## GREEN

Implement:

```text
MoodleRestClient
MoodleErrorMapper
MoodleClientFactory
MoodleCredentialProvider
```

## Done

- [ ] client cannot be imported by browser bundle;
- [ ] all Moodle communication uses this client;
- [ ] no Moodle token is returned to frontend.

---

# 25. Phase 3 — Tenant

Implement tenant first before auth because all Moodle access must be tenant-aware.

Tasks:

- [ ] Tenant entity.
- [ ] Tenant repository.
- [ ] Tenant lookup by subdomain.
- [ ] encrypted Moodle configuration.
- [ ] tenant status.
- [ ] Moodle connection test.
- [ ] `resolveCurrentTenant`.

Expected flow:

```text
request hostname
  ↓
tenant slug
  ↓
TenantRepository
  ↓
TenantContext
  ↓
MoodleClientFactory
```

---

# 26. Phase 4 — Authentication

## RED

Tests:

- [ ] valid login;
- [ ] invalid Moodle credentials;
- [ ] inactive tenant;
- [ ] site info cannot be loaded;
- [ ] logout invalidates application session.

## GREEN

Implement:

```text
LoginUseCase
LogoutUseCase
GetCurrentUserUseCase
MoodleAuthRepository
CookieSessionRepository
useAuthApi
```

UI:

```text
sections/auth/
├── molecules/
│   └── LoginForm.tsx
├── organisms/
│   └── LoginView.tsx
└── pages/
    └── LoginPageSection.tsx
```

---

# 27. Phase 5 — Course Dashboard

Implement:

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

UI:

```text
sections/courses/
├── atoms/
│   └── CourseStatusBadge.tsx
├── molecules/
│   ├── CourseCard.tsx
│   └── CourseSkeletonCard.tsx
├── organisms/
│   └── CourseListView.tsx
└── pages/
    └── CoursePageSection.tsx
```

---

# 28. Phase 6 — Quiz Listing & Access

Implement:

```text
GetCourseQuizzesUseCase
GetQuizDetailUseCase
GetQuizAccessUseCase
```

Before displaying "Mulai Ujian", access information must be loaded from backend.

States:

```text
AVAILABLE
NOT_OPEN
CLOSED
ATTEMPT_LIMIT_REACHED
PASSWORD_REQUIRED
RESTRICTED
```

Do not infer Moodle access rules only from frontend timestamps.

---

# 29. Phase 7 — Quiz Attempt Core

This is the highest-priority domain.

## RED Tests

### Start attempt

- [ ] starts valid attempt;
- [ ] rejects attempt not owned by active actor;
- [ ] maps Moodle access error;
- [ ] prevents invalid quiz id.

### Load attempt

- [ ] maps Moodle question data;
- [ ] preserves attempt state;
- [ ] handles finished attempt.

### Autosave

- [ ] accepts valid answer;
- [ ] preserves Moodle response parameter names only inside infrastructure;
- [ ] handles transient error;
- [ ] prevents stale write where applicable.

### Submit

- [ ] final submission;
- [ ] duplicate submit behavior;
- [ ] expired attempt;
- [ ] invalid attempt ownership.

## GREEN

Implement all use cases and adapters.

---

# 30. Phase 8 — Student Exam UI

Required state:

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

Required functionality:

- [ ] timer;
- [ ] question navigation;
- [ ] answered indicator;
- [ ] flagged question if supported;
- [ ] autosave;
- [ ] network status;
- [ ] previous/next;
- [ ] summary;
- [ ] final confirmation;
- [ ] submit;
- [ ] review.

No generic spinner-only loading for the main exam.

---

# 31. Phase 9 — Grade / Result

Implement:

```text
GetQuizGradeUseCase
GetCourseGradesUseCase
```

UI:

```text
sections/grades/
├── atoms/
│   └── GradeBadge.tsx
├── molecules/
│   └── GradeCard.tsx
├── organisms/
│   └── StudentGradeView.tsx
└── pages/
    └── ResultPageSection.tsx
```

Respect Moodle review options. Do not expose answer correctness if Moodle access rules do not allow it.

---

# 32. Phase 10 — Administration Foundation

Order:

```text
users
↓
enrolments
↓
groups
↓
questions
↓
exam-administration
```

All management modules use:

- filter;
- pagination;
- Skeleton;
- EmptyState;
- action menu;
- create/edit modal or page;
- delete confirmation.

---

# 33. Phase 11 — Question Bank

Requires `local_examapi`.

Next.js module remains independent from custom plugin contract.

Domain operation:

```text
QuestionRepository.create()
```

Infrastructure translates it to:

```text
local_exam_create_question
```

Never expose `local_exam_*` names outside infrastructure.

---

# 34. Phase 12 — Exam Administration

Features:

- [ ] create exam;
- [ ] update settings;
- [ ] delete/archive;
- [ ] duplicate;
- [ ] question selection;
- [ ] random questions;
- [ ] reorder questions;
- [ ] preview;
- [ ] participant configuration.

---

# 35. Phase 13 — Exam Monitoring

Initial polling implementation:

```text
GET /api/v1/exam-monitor/:quizId
```

Use a sane polling interval.

Do not poll Moodle separately for every participant.

Backend/custom plugin should return aggregated monitor data.

Features:

- [ ] active participant;
- [ ] started;
- [ ] not started;
- [ ] finished;
- [ ] disconnected/last activity if available;
- [ ] force finish;
- [ ] extend time;
- [ ] reset;
- [ ] force logout;
- [ ] audit administrative actions.

---

# 36. Phase 14 — Audit

Audit actions:

```text
TENANT_CREATED
TENANT_UPDATED
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

Minimum payload:

```ts
interface AuditEvent {
  readonly tenantId: string;
  readonly actorId: string;
  readonly action: string;
  readonly entityType: string;
  readonly entityId: string | null;
  readonly requestId: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
  readonly createdAt: Date;
}
```

Never log secrets or raw student answer payload unnecessarily.

---

# 37. Phase 15 — Security Hardening

Checklist:

- [ ] HttpOnly application session.
- [ ] Secure cookies in production.
- [ ] SameSite policy.
- [ ] CSRF strategy.
- [ ] tenant isolation tests.
- [ ] authorization tests.
- [ ] rate limiting login.
- [ ] rate limiting sensitive admin mutation.
- [ ] Moodle token encryption at rest.
- [ ] no token in browser.
- [ ] no credentials in logs.
- [ ] security headers.
- [ ] upload validation.
- [ ] request body size limits.
- [ ] server-side validation.

---

# 38. Phase 16 — Performance

Checklist:

- [ ] no N+1 Moodle calls;
- [ ] batch operations;
- [ ] parallel independent reads;
- [ ] bounded Moodle request timeout;
- [ ] metadata caching;
- [ ] no caching active attempt source of truth;
- [ ] monitor endpoint returns aggregated data;
- [ ] pagination on large tables.

---

# 39. Phase 17 — E2E

Critical student flow:

```text
login
→ dashboard
→ course
→ exam
→ access check
→ start
→ answer
→ autosave
→ navigate
→ summary
→ submit
→ result
```

Critical admin flow:

```text
login
→ create/import users
→ enrol
→ manage question bank
→ create exam
→ add questions
→ monitor
→ force administrative action
→ result/export
```

---

# 40. TDD Standard for Every Module

## RED

- create domain/application test first;
- use mock repository port;
- verify failure represents required behavior.

## GREEN

- implement minimal domain/use case;
- implement infrastructure adapter;
- integrate route.

## REFACTOR

- remove duplication;
- improve naming;
- preserve boundaries;
- keep all tests green.

For bug fixes:

```text
reproduce
→ regression test RED
→ fix
→ GREEN
→ refactor
```

---

# 41. Testing Layout Example

```text
modules/quiz-attempts/__tests__/
├── domain/
│   ├── QuizAttempt.test.ts
│   └── QuizAttemptRules.test.ts
├── application/
│   ├── StartQuizAttemptUseCase.test.ts
│   ├── SaveQuizAnswerUseCase.test.ts
│   └── SubmitQuizAttemptUseCase.test.ts
├── infrastructure/
│   ├── MoodleQuizAttemptMapper.test.ts
│   └── MoodleQuizAttemptRepository.test.ts
└── helpers/
    ├── MockQuizAttemptRepository.ts
    └── QuizAttemptTestFactory.ts
```

---

# 42. Implementation Order

Do not implement modules randomly.

Use this dependency order:

```text
1. Project bootstrap
2. Core base/errors/http
3. MoodleRestClient
4. Tenant
5. Auth
6. Courses
7. Quizzes
8. Quiz Attempts
9. Grades
10. Student Exam UI
11. Users
12. Enrolments
13. Groups/Cohorts
14. Questions
15. Exam Administration
16. Exam Monitoring
17. Audit
18. Security Hardening
19. Performance
20. E2E
```

---

# 43. MVP Scope

MVP is complete when a student can:

- [ ] login;
- [ ] resolve correct tenant;
- [ ] view courses;
- [ ] view available exams;
- [ ] see access state;
- [ ] start/resume attempt;
- [ ] answer questions;
- [ ] autosave;
- [ ] navigate questions;
- [ ] submit;
- [ ] view result allowed by Moodle.

Admin MVP:

- [ ] list users;
- [ ] enrol students;
- [ ] list exams;
- [ ] monitor active attempts.

Question-bank authoring can be delivered immediately after custom `local_examapi` is ready.

---

# 44. Definition of Done per Feature

A feature is not complete until:

- [ ] Domain contract exists.
- [ ] Use case exists.
- [ ] Repository port exists.
- [ ] Infrastructure adapter exists.
- [ ] Mapper exists where external response is involved.
- [ ] Dependency factory exists.
- [ ] API route is thin.
- [ ] Presentation hook exists where client interaction is required.
- [ ] UI follows atom/molecule/organism/page boundary.
- [ ] Loading state exists.
- [ ] Empty state exists where relevant.
- [ ] Error state exists.
- [ ] Pagination exists for scalable lists.
- [ ] Domain/application tests pass.
- [ ] Adapter tests pass where relevant.
- [ ] TypeScript passes.
- [ ] Biome passes.
- [ ] Build passes.
- [ ] No Moodle secret reaches browser.
- [ ] Tenant isolation is preserved.
- [ ] No dead code.
- [ ] No unexplained `any`.

---

# 45. Explicit Non-Goals

For initial architecture:

- Do not edit Moodle core.
- Do not expose Moodle REST directly to browser.
- Do not duplicate Moodle Quiz Engine in Next.js.
- Do not calculate authoritative grade in browser.
- Do not store student answer as a second authoritative copy unless a specific offline architecture is approved.
- Do not implement WebSocket prematurely for monitoring.
- Do not build generic abstractions before two or more real use cases prove the need.
- Do not combine `quizzes` and `quiz-attempts` into one module.

---

# 46. Future Custom Moodle Plugin

Maintain separately deployable Moodle plugin:

```text
local_examapi/
├── classes/
│   ├── external/
│   ├── local/
│   └── service/
├── db/
│   ├── access.php
│   ├── services.php
│   └── upgrade.php
├── lang/
│   └── en/
├── tests/
├── version.php
└── README.md
```

Initial functions:

```text
local_exam_get_question_bank
local_exam_create_question
local_exam_update_question
local_exam_delete_question

local_exam_create_quiz
local_exam_update_quiz
local_exam_delete_quiz
local_exam_duplicate_quiz

local_exam_add_question_to_quiz
local_exam_remove_question_from_quiz
local_exam_reorder_quiz_questions
local_exam_add_random_questions

local_exam_get_exam_monitor
local_exam_get_active_attempts
local_exam_force_finish_attempt
local_exam_reset_attempt
local_exam_extend_attempt_time
local_exam_force_logout_user
```

Next.js domain must remain unaware that the implementation is named `local_examapi`.

---

# 47. Final Architecture Target

```text
┌───────────────────────────────────────────────┐
│                  Browser                      │
└──────────────────────┬────────────────────────┘
                       ↓
┌───────────────────────────────────────────────┐
│ Sections / UI                                 │
│ Atom → Molecule → Organism → Page             │
└──────────────────────┬────────────────────────┘
                       ↓
┌───────────────────────────────────────────────┐
│ Presentation Hooks                            │
└──────────────────────┬────────────────────────┘
                       ↓
┌───────────────────────────────────────────────┐
│ Next.js /api/v1                               │
│ Inbound Adapter                               │
└──────────────────────┬────────────────────────┘
                       ↓
┌───────────────────────────────────────────────┐
│ Application                                   │
│ Use Cases / Services                          │
└──────────────────────┬────────────────────────┘
                       ↓
┌───────────────────────────────────────────────┐
│ Domain                                        │
│ Entities / DTO / Rules / Ports                │
└──────────────────────┬────────────────────────┘
                       ↑
┌───────────────────────────────────────────────┐
│ Infrastructure                                │
│ Moodle Repositories / Mappers / Providers     │
└──────────────────────┬────────────────────────┘
                       ↓
┌───────────────────────────────────────────────┐
│ Moodle                                        │
│ core_* / mod_quiz_* / local_examapi_*         │
└───────────────────────────────────────────────┘
```

---

# 48. Initial Issue Completion Criteria

This architecture issue may be closed only when:

- [ ] project base folders are created;
- [ ] lint/typecheck/test/build commands work;
- [ ] `core` scaffolding exists;
- [ ] Moodle REST client has tests and implementation;
- [ ] tenant boundary exists;
- [ ] auth module scaffold exists;
- [ ] course module scaffold exists;
- [ ] quiz module scaffold exists;
- [ ] quiz-attempt module scaffold exists;
- [ ] shared UI base exists;
- [ ] internal `/api/v1` namespace exists;
- [ ] at least one full vertical slice is implemented:

```text
UI
→ hook
→ Next.js API
→ use case
→ repository port
→ Moodle repository
→ MoodleRestClient
```

Recommended first vertical slice:

```text
GET /api/v1/courses
→ GetMyCoursesUseCase
→ CourseRepository
→ MoodleCourseRepository
→ core_enrol_get_users_courses
```

After this issue is complete, development continues per feature issue using the same architecture.
