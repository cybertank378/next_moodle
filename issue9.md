# Issue 09 — Courses

## Nama Issue

**Course Read Model for TENANT & STUDENT**

## Tujuan

Membangun vertical slice `courses` yang membaca course dari Moodle sebagai source of truth dan menyajikannya berbeda sesuai actor TENANT/STUDENT tanpa membocorkan detail Moodle ke UI.

## Dependency

- [ ] Issue 08 selesai.

## Scope Pengerjaan

Use cases:

```text
GetMyCoursesUseCase
GetCourseDetailUseCase
GetCourseContentsUseCase
```

Moodle adapter functions di infrastructure:

```text
core_enrol_get_users_courses
core_course_get_courses_by_field
core_course_get_contents
```

Pages:

```text
/tenant/courses
/tenant/courses/[courseId]
/student/courses
/student/courses/[courseId]
```

## Out of Scope

- Quiz attempt lifecycle.
- Course mutation/create/update.
- Direct Moodle form rendering.

## Target Struktur / Deliverables

```text
src/modules/courses/
├── application/services/CourseService.ts         # bila diperlukan
├── application/usecases/*.ts
├── domain/builder/CourseQueryBuilder.ts
├── domain/dto/*.ts
├── domain/entity/CourseEntity.ts
├── domain/interfaces/CourseRepositoryInterface.ts
├── domain/mapper/CourseMapper.ts
├── domain/types/CourseTypes.ts
├── infrastructure/http/CourseController.ts
├── infrastructure/repo/CourseRepository.ts
├── infrastructure/validators/courseValidator.ts
└── presentation/hooks/useCourseApi.ts

src/app/api/courses/
├── _factory.ts
├── route.ts
└── [courseId]/
    ├── route.ts
    ├── contents/route.ts
    └── quizzes/route.ts
```

## Task Checklist

### Domain & Application

- [ ] Definisikan course DTO/entity/types.
- [ ] Definisikan repository interface generik tanpa nama Moodle function.
- [ ] Implement `GetMyCoursesUseCase`.
- [ ] Implement `GetCourseDetailUseCase`.
- [ ] Implement `GetCourseContentsUseCase`.
- [ ] Enforce role/permission sesuai actor.
- [ ] STUDENT hanya dapat membaca enrolled/allowed course.
- [ ] TENANT hanya dapat membaca course tenant sendiri.

### Infrastructure

- [ ] Implement Moodle course repository melalui `MoodleRestClient`.
- [ ] Implement mapper Moodle→domain DTO.
- [ ] Handle empty course list.
- [ ] Handle invalid course/not found secara aman.
- [ ] Jangan expose raw Moodle payload ke UI.

### API

- [ ] Implement CourseController.
- [ ] Implement `/api/courses/_factory.ts`.
- [ ] Implement list route.
- [ ] Implement detail route.
- [ ] Implement contents route.
- [ ] Implement quizzes route delegation/contract yang diperlukan Issue 10.

### Presentation & Sections

- [ ] Implement `useCourseApi`.
- [ ] Buat tenant course section.
- [ ] Buat student course section.
- [ ] Atoms/molecules tidak memanggil API.
- [ ] Organism mengoordinasikan hook/state.
- [ ] Loading menggunakan Skeleton.
- [ ] EmptyState tidak menutup header/filter.
- [ ] Pagination digunakan jika list dapat besar atau backend contract mendukungnya.

### Tests

- [ ] Student enrolled course success.
- [ ] Student non-enrolled course denied/not found sesuai security contract.
- [ ] Tenant own course success.
- [ ] Cross-tenant course rejected.
- [ ] Moodle mapper test.
- [ ] Invalid Moodle response mapping.
- [ ] Loading/empty/error sections.
- [ ] No Moodle function name pada presentation output/source dependency test bila tersedia.

## TDD Workflow

### RED

- [ ] Tulis use case, mapper, authorization, dan UI state tests terlebih dahulu.

### GREEN

- [ ] Implement full vertical slice module → controller → factory → route → hook → sections.

### REFACTOR

- [ ] Consolidate mapping dan query logic.
- [ ] Pastikan external field names tidak keluar dari infrastructure.
- [ ] Reuse shared UI tanpa barrel.

## Acceptance Criteria

- [ ] STUDENT hanya melihat course yang diizinkan Moodle/enrolment.
- [ ] TENANT tidak dapat melihat tenant lain.
- [ ] Course data berasal dari Moodle.
- [ ] UI tidak mengenal nama fungsi Moodle.
- [ ] Loading/empty/error state tersedia.

## Definition of Done (DoD)

- [ ] Domain contract tersedia.
- [ ] Seluruh use case tersedia dan teruji.
- [ ] Repository + mapper Moodle tersedia.
- [ ] Controller + factory + route tersedia.
- [ ] Hook tersedia.
- [ ] Tenant dan student sections/pages tersedia.
- [ ] RBAC + tenant isolation tests GREEN.
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
