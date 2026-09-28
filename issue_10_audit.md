# PR: Quizzes & Access Module Implementation (Issue #89)

Closes #89

## Summary of Changes

### 1. Domain Layer (`src/modules/quiz/domain`)
- **Types**: Defined raw Moodle quiz and access structures (`RawMoodleQuiz`, `RawMoodleQuizAccessInfo`) alongside clean domain types (`QuizMetadata`, `QuizAccessStatus`, `QuizAccessRuleEvaluation`).
- **DTOs**: Implemented `QuizSummaryResponseDTO`, `QuizAccessResponseDTO`, `QuizListResponseDTO`, and request query DTOs (`ListQuizzesQueryDTO`, `CheckQuizAccessRequestDTO`).
- **Entity**: Implemented `QuizEntity` extending `BaseEntity<number>` with domain access evaluation logic (`evaluateAccess`, `getStatus`), distinguishing `OPEN`, `UPCOMING`, and `CLOSED` states.
- **Repository Interface**: Defined `QuizRepositoryInterface` with `getQuizzesByCourses`, `getQuizById`, and `getQuizAccessInfo`.
- **Mapper**: Implemented `QuizMapper` for clean conversions from raw Moodle payloads to domain entities and response DTOs without leaking internal Moodle keys.

### 2. Application Layer (`src/modules/quiz/application`)
- **Authorization Service**: Implemented `QuizAuthorizationService` enforcing RBAC (`QUIZ_READ` for `TENANT`, `STUDENT_QUIZ_READ` for `STUDENT`, and full access for `ADMIN`) alongside tenant isolation.
- **Use Cases**:
  - `CheckQuizAccessUseCase`: Evaluates time-based and external Moodle access rules to determine whether a participant can attempt a quiz.
  - `GetQuizzesByCourseUseCase`: Retrieves quizzes filtered by course ID and optional search keywords.
  - `GetQuizDetailUseCase`: Retrieves detailed quiz metadata and timing instructions.

### 3. Infrastructure Layer (`src/modules/quiz/infrastructure` & `src/app/api/quizzes`)
- **Repository**: Implemented `MoodleQuizRepository` calling `mod_quiz_get_quizzes_by_courses` and `mod_quiz_get_quiz_access_information` with tenant isolation.
- **Validator**: Created `quiz.validator.ts` for safe transport parameter parsing.
- **HTTP Controller**: Implemented `QuizController` handling `list`, `getDetail`, and `checkAccess` actions with standardized `ApiResponse` formatting.
- **Factory & Routes**:
  - `src/app/api/quizzes/_factory.ts`
  - `GET /api/quizzes` (`src/app/api/quizzes/route.ts`)
  - `GET /api/quizzes/[quizId]` (`src/app/api/quizzes/[quizId]/route.ts`)
  - `GET /api/quizzes/[quizId]/access` (`src/app/api/quizzes/[quizId]/access/route.ts`)
  - Standardized transport handlers using `unauthorizedResponse()` and `RouteContext`.

### 4. Presentation & Atomic UI (`src/sections/exams` & Dashboard Integration)
- **Hooks**: Implemented `useQuizApi` using `request<T>` from `@/libs/apiClient`.
- **Route Constants**: Added `examDetail(id)` to `AppRouteConstants` in `src/libs/routes.ts`.
- **UI Components**:
  - Atoms: `QuizStatusBadge`, `QuizTimeLimitBadge`
  - Molecules: `QuizCard`, `QuizFilterBar`
  - Organisms: `QuizListView`, `QuizDetailView`
  - Fully compliant with UI rules: shared-ui `Button` component, `useRouter` with `AppRouteConstants` (no native `<button>`, no `<Link>`).
- **Pages**:
  - `src/app/(protected)/dashboard/exams/page.tsx`
  - `src/app/(protected)/dashboard/exams/[id]/page.tsx`

### 5. Architectural & TDD Validation
- **RED -> GREEN**: Initial failing test created for `CheckQuizAccessUseCase` verifying closed status on expired time, followed by complete implementation and green tests.
- **No Barrel Exports**: Verified with `scripts/check-barrel-exports.mjs` (0 barrel files).
- **TypeScript**: `npm run typecheck` passed with 0 errors.
- **Biome**: Clean formatting and linting.
- **Unit & Integration Tests**: 32 new tests created in `src/modules/quiz`, 330 total workspace tests passing.
