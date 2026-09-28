# PR: Courses Module Implementation (Issue #87)

Closes #87

## Summary of Changes

### 1. Domain Layer (`src/modules/course/domain`)
- **Types**: Defined raw Moodle schemas (`RawMoodleCourse`, `RawMoodleSection`, `RawMoodleModule`) and internal metadata (`CourseMetadata`, `CourseSectionMetadata`, `CourseModuleMetadata`).
- **DTOs**: Implemented `CourseSummaryResponseDTO`, `CourseDetailResponseDTO`, `CourseSectionResponseDTO`, `CourseModuleResponseDTO`, `CourseListResponseDTO`, and request query DTOs.
- **Entity**: Implemented `CourseEntity` extending `BaseEntity<number>`.
- **Repository Interface**: Defined `CourseRepositoryInterface` with `getUserCourses`, `getTenantCourses`, and `getCourseContents`.
- **Mapper**: Implemented `CourseMapper` ensuring external Moodle payloads are mapped into clean domain entities/DTOs without leaking Moodle naming or data structures.

### 2. Application Layer (`src/modules/course/application`)
- **Authorization Service**: Built `CourseAuthorizationService` enforcing RBAC (`COURSE_READ` for `TENANT`, `STUDENT_COURSE_READ` for `STUDENT`, and full access for `ADMIN`) alongside tenant isolation.
- **Use Cases**:
  - `GetUserCoursesUseCase`: Retrieves student-enrolled courses via Moodle User ID or tenant-wide courses for tenant operators.
  - `GetCourseContentsUseCase`: Retrieves sections and module topics/activities for a specific course with tenant scoping.

### 3. Infrastructure & API Transport (`src/modules/course/infrastructure` & `src/app/api/courses`)
- **Repository**: Implemented `MoodleCourseRepository` integrating `core_enrol_get_users_courses`, `core_course_get_courses`, and `core_course_get_contents`.
- **Validator**: Created `course.validator.ts` for safe transport query and route param parsing.
- **HTTP Controller**: Implemented `CourseController` mapping use case results to standardized `ApiResponse` and HTTP error codes.
- **Factory & Routes**:
  - `src/app/api/courses/_factory.ts`
  - `GET /api/courses` (`src/app/api/courses/route.ts`)
  - `GET /api/courses/[courseId]/contents` (`src/app/api/courses/[courseId]/contents/route.ts`)
  - Reusable helpers `unauthorizedResponse()` and `RouteContext` from `@/core/http/routeUtils`.

### 4. Presentation & Atomic UI (`src/sections/courses` & Dashboard Integration)
- **Hooks**: Implemented `useCourseApi` using `request<T>` from `@/libs/apiClient`.
- **Route Constants**: Added `AppRouteConstants` class in `src/libs/routes.ts` providing static constants and helper methods.
- **UI Components**:
  - Atoms: `CourseProgressBadge`, `CourseCategoryBadge`
  - Molecules: `CourseCard`, `CourseFilterBar`
  - Organisms: `CoursesView`, `CourseDetailView`
  - Integrated shared-ui `Button` component and `useRouter` from `next/navigation` (avoiding native `<button>` and `<Link>`).
- **Pages**:
  - `src/app/(protected)/dashboard/courses/page.tsx`
  - `src/app/(protected)/dashboard/courses/[id]/page.tsx`

### 5. Architectural & TDD Validation
- **No Barrel Exports**: Verified with `scripts/check-barrel-exports.mjs` (0 barrel files).
- **TypeScript**: `npm run typecheck` passed with 0 errors.
- **Biome**: Clean without errors.
- **Unit & Integration Tests**: 25 tests created for domain, application, infrastructure, and presentation, with 100% pass rate (298 total workspace tests passing).
