# [Architecture & Routing] Audit Seluruh Route Page, Konsolidasi Single Source of Truth (ROUTES), dan Eliminasi Hardcoded Path

## 1. Metadata & Status

- **Repository**: https://github.com/cybertank378/next_moodle
- **Branch Target**: `development`
- **Tipe Issue**: Architectural Refactoring / Technical Debt
- **Aplikasi**: Aksaventra (Exam SaaS)
- **Status**: Audit Selesai — Menunggu Implementasi Refactoring

---

## 2. Latar Belakang & Masalah

Pada arsitektur aplikasi Aksaventra, seluruh antarmuka yang terproteksi telah dikonsolidasikan ke dalam route group terpadu di bawah path `/dashboard/*` (`src/app/(protected)/dashboard/*`).

Namun, hasil audit komprehensif terhadap seluruh basis kode menemukan sejumlah inkonsistensi arsitektur routing yang kritis:

1. **Inkonsistensi Single Source of Truth**:
   - Berkas `src/libs/routes.ts` hanya mendefinisikan rute root per role (`ROOT`, `COURSES`, `EXAMS`, `RESULTS`, dll).
   - Seluruh sub-rute fungsional (seperti `create`, `[id]`, `[id]/edit`, `[id]/monitor`) **belum terdaftar** di dalam `ROUTES`.
   - Terjadi dualisme antara `ROUTES` dan `AppRouteConstants` yang menyebabkan ketidakkonsistenan import antar modul.
2. **Pelanggaran Hardcoded Route String**:
   - Banyak komponen (`sections/tenant`, `sections/courses`, `sections/dashboard`, `sections/notification`, dan `shared-ui`) menggunakan string literal mentah seperti `"/dashboard/tenants/create"`, `"/dashboard/exams"`, atau template literal `` `/dashboard/tenants/${id}` `` secara langsung alih-alih merujuk pada konstanta `ROUTES`.
3. **Dead Links / Phantom Routes**:
   - Komponen navigasi siswa (`AppSidebar.tsx` dan widget `StudentUpcomingTasks`, `StudentRightRailWidgets`) memiliki tautan menuju path yang **belum ada halamannya** di Next.js App Router (misalnya `/dashboard/assignments`, `/dashboard/calendar`, `/dashboard/schedule`, `/dashboard/announcements`, `/dashboard/activities`, `/dashboard/profile`).
4. **Resiko Broken Navigation & Redirect Loop**:
   - Kasus teranyar adalah menu notifikasi siswa yang sempat terpental ke dashboard akibat `page.tsx` tidak mendukung role `STUDENT`. Potensi masalah serupa dapat terulang bila rute dan role guard tidak diatur dari satu sumber yang terpadu.

---

## 3. Inventaris Lengkap 41 Halaman Aktif App Router

Berikut adalah inventaris lengkap seluruh 41 berkas `page.tsx` yang ada di `src/app/`, guard role-nya, serta status keberadaannya di dalam `src/libs/routes.ts`:

| No | File Path App Router | URL Browser | Role Guard | Status Implementasi | Status di `ROUTES` |
|---|---|---|---|---|---|
| 1 | `src/app/page.tsx` | `/` | Authenticated -> redirect | Redirect Handler | `ROUTES.HOME` |
| 2 | `src/app/(public)/login/page.tsx` | `/login` | Public / Guest | Form Login | `ROUTES.AUTH.LOGIN` |
| 3 | `src/app/(public)/register/page.tsx` | `/register` | Public / Guest | Form Register | `ROUTES.AUTH.REGISTER` |
| 4 | `src/app/(public)/forgot-password/page.tsx` | `/forgot-password` | Public / Guest | Form Forgot Password | `ROUTES.AUTH.FORGOT_PASSWORD` |
| 5 | `src/app/(public)/change-password/page.tsx` | `/change-password` | Public / Guest | Form Change Password | `ROUTES.AUTH.CHANGE_PASSWORD` |
| 6 | `src/app/(protected)/dashboard/page.tsx` | `/dashboard` | `ADMIN`, `TENANT`, `STUDENT`, `TEACHER` | Multi-role Dashboard Overview | `ROUTES.*.ROOT` |
| 7 | `src/app/(protected)/dashboard/audit/page.tsx` | `/dashboard/audit` | `ADMIN`, `TENANT` | `DashboardRoutePlaceholder` | `ROUTES.ADMIN.AUDIT` / `ROUTES.TENANT.AUDIT` |
| 8 | `src/app/(protected)/dashboard/branding/page.tsx` | `/dashboard/branding` | `TENANT` | `DashboardRoutePlaceholder` | `ROUTES.TENANT.BRANDING` |
| 9 | `src/app/(protected)/dashboard/settings/page.tsx` | `/dashboard/settings` | `ADMIN` | `DashboardRoutePlaceholder` | `ROUTES.ADMIN.SETTINGS` |
| 10 | `src/app/(protected)/dashboard/notifications/page.tsx` | `/dashboard/notifications` | `ADMIN`, `TENANT`, `STUDENT`, `TEACHER` | Management View / Inbox View | `ROUTES.*.NOTIFICATIONS` |
| 11 | `src/app/(protected)/dashboard/proctor/page.tsx` | `/dashboard/proctor` | `TENANT` | Proctoring Management | `ROUTES.TENANT.PROCTOR` |
| 12 | `src/app/(protected)/dashboard/tenants/page.tsx` | `/dashboard/tenants` | `ADMIN` | Tenants Management List | `ROUTES.ADMIN.TENANTS` |
| 13 | `src/app/(protected)/dashboard/tenants/create/page.tsx` | `/dashboard/tenants/create` | `ADMIN` | Tenant Create View | ❌ **Belum Terdaftar** |
| 14 | `src/app/(protected)/dashboard/tenants/[id]/page.tsx` | `/dashboard/tenants/[id]` | `ADMIN` | Tenant Detail View | ❌ **Belum Terdaftar** |
| 15 | `src/app/(protected)/dashboard/tenants/[id]/edit/page.tsx` | `/dashboard/tenants/[id]/edit` | `ADMIN` | Tenant Edit View | ❌ **Belum Terdaftar** |
| 16 | `src/app/(protected)/dashboard/users/page.tsx` | `/dashboard/users` | `TENANT` | User Management List | `ROUTES.TENANT.USERS` |
| 17 | `src/app/(protected)/dashboard/users/create/page.tsx` | `/dashboard/users/create` | `TENANT` | `DashboardRoutePlaceholder` | ❌ **Belum Terdaftar** |
| 18 | `src/app/(protected)/dashboard/users/[id]/page.tsx` | `/dashboard/users/[id]` | `TENANT` | `DashboardRoutePlaceholder` | ❌ **Belum Terdaftar** |
| 19 | `src/app/(protected)/dashboard/users/[id]/edit/page.tsx` | `/dashboard/users/[id]/edit` | `TENANT` | `DashboardRoutePlaceholder` | ❌ **Belum Terdaftar** |
| 20 | `src/app/(protected)/dashboard/enrolments/page.tsx` | `/dashboard/enrolments` | `TENANT` | `DashboardRoutePlaceholder` | `ROUTES.TENANT.ENROLMENTS` |
| 21 | `src/app/(protected)/dashboard/enrolments/create/page.tsx` | `/dashboard/enrolments/create` | `TENANT` | `DashboardRoutePlaceholder` | ❌ **Belum Terdaftar** |
| 22 | `src/app/(protected)/dashboard/enrolments/[id]/page.tsx` | `/dashboard/enrolments/[id]` | `TENANT` | `DashboardRoutePlaceholder` | ❌ **Belum Terdaftar** |
| 23 | `src/app/(protected)/dashboard/enrolments/[id]/edit/page.tsx` | `/dashboard/enrolments/[id]/edit` | `TENANT` | `DashboardRoutePlaceholder` | ❌ **Belum Terdaftar** |
| 24 | `src/app/(protected)/dashboard/groups/page.tsx` | `/dashboard/groups` | `TENANT` | `DashboardRoutePlaceholder` | `ROUTES.TENANT.GROUPS` |
| 25 | `src/app/(protected)/dashboard/groups/create/page.tsx` | `/dashboard/groups/create` | `TENANT` | `DashboardRoutePlaceholder` | ❌ **Belum Terdaftar** |
| 26 | `src/app/(protected)/dashboard/groups/[id]/page.tsx` | `/dashboard/groups/[id]` | `TENANT` | `DashboardRoutePlaceholder` | ❌ **Belum Terdaftar** |
| 27 | `src/app/(protected)/dashboard/groups/[id]/edit/page.tsx` | `/dashboard/groups/[id]/edit` | `TENANT` | `DashboardRoutePlaceholder` | ❌ **Belum Terdaftar** |
| 28 | `src/app/(protected)/dashboard/courses/page.tsx` | `/dashboard/courses` | `TENANT`, `TEACHER`, `STUDENT` | Course List / Student Courses | `ROUTES.*.COURSES` |
| 29 | `src/app/(protected)/dashboard/courses/[id]/page.tsx` | `/dashboard/courses/[id]` | `TENANT`, `TEACHER`, `STUDENT` | Course Detail View | Parsial (`AppRouteConstants`) |
| 30 | `src/app/(protected)/dashboard/questions/page.tsx` | `/dashboard/questions` | `TENANT`, `TEACHER` | `DashboardRoutePlaceholder` | `ROUTES.*.QUESTIONS` |
| 31 | `src/app/(protected)/dashboard/questions/create/page.tsx` | `/dashboard/questions/create` | `TENANT`, `TEACHER` | `DashboardRoutePlaceholder` | ❌ **Belum Terdaftar** |
| 32 | `src/app/(protected)/dashboard/questions/[id]/page.tsx` | `/dashboard/questions/[id]` | `TENANT`, `TEACHER` | `DashboardRoutePlaceholder` | ❌ **Belum Terdaftar** |
| 33 | `src/app/(protected)/dashboard/questions/[id]/edit/page.tsx` | `/dashboard/questions/[id]/edit` | `TENANT`, `TEACHER` | `DashboardRoutePlaceholder` | ❌ **Belum Terdaftar** |
| 34 | `src/app/(protected)/dashboard/exams/page.tsx` | `/dashboard/exams` | `TENANT`, `TEACHER`, `STUDENT` | Quiz/Exam List View | `ROUTES.*.EXAMS` |
| 35 | `src/app/(protected)/dashboard/exams/create/page.tsx` | `/dashboard/exams/create` | `TENANT` | `DashboardRoutePlaceholder` | ❌ **Belum Terdaftar** |
| 36 | `src/app/(protected)/dashboard/exams/[id]/page.tsx` | `/dashboard/exams/[id]` | `TENANT`, `TEACHER`, `STUDENT` | Quiz Detail View | Parsial (`AppRouteConstants`) |
| 37 | `src/app/(protected)/dashboard/exams/[id]/edit/page.tsx` | `/dashboard/exams/[id]/edit` | `TENANT` | `DashboardRoutePlaceholder` | ❌ **Belum Terdaftar** |
| 38 | `src/app/(protected)/dashboard/exams/[id]/monitor/page.tsx` | `/dashboard/exams/[id]/monitor` | `TENANT`, `TEACHER` | Live Exam Monitor View | ❌ **Belum Terdaftar** |
| 39 | `src/app/(protected)/dashboard/exams/[id]/attempt/[attemptId]/page.tsx` | `/dashboard/exams/[id]/attempt/[attemptId]` | `STUDENT` | Exam Attempt Taking View | Parsial (`AppRouteConstants`) |
| 40 | `src/app/(protected)/dashboard/results/page.tsx` | `/dashboard/results` | `ADMIN`, `TENANT`, `TEACHER`, `STUDENT` | Exam Results Management / View | `ROUTES.*.RESULTS` |
| 41 | `src/app/(protected)/dashboard/results/[id]/page.tsx` | `/dashboard/results/[id]` | `ADMIN`, `TENANT`, `TEACHER`, `STUDENT` | Result Detail View | ❌ **Belum Terdaftar** |

---

## 4. Daftar Pelanggaran Hardcoded Route pada Kode Aktif

Audit riil menemukan lokasi-lokasi kode berikut yang masih menuliskan rute secara hardcode string:

### A. Modul Tenant (`src/sections/tenant/`)
1. **`TenantsManagementView.tsx` (baris 32)**:
   ```tsx
   <LinkButton href="/dashboard/tenants/create">Tambah tenant</LinkButton>
   ```
   *Rekomendasi:* Gunakan `ROUTES.ADMIN.TENANTS_CREATE`.
2. **`TenantDetailView.tsx` (baris 65 & 166)**:
   ```tsx
   href={`/dashboard/tenants/${tenant.id}/edit`}
   router.push("/dashboard/tenants");
   ```
   *Rekomendasi:* Gunakan `ROUTES.ADMIN.TENANT_EDIT(tenant.id)` dan `ROUTES.ADMIN.TENANTS`.
3. **`TenantCreateView.tsx` (baris 25)**:
   ```tsx
   router.push(`/dashboard/tenants/${result.data.id}`);
   ```
   *Rekomendasi:* Gunakan `ROUTES.ADMIN.TENANT_DETAIL(result.data.id)`.
4. **`TenantEditView.tsx` (baris 31)**:
   ```tsx
   router.push(`/dashboard/tenants/${params.id}`);
   ```
   *Rekomendasi:* Gunakan `ROUTES.ADMIN.TENANT_DETAIL(params.id)`.
5. **`TenantTable.tsx` (baris 74 & 80)**:
   ```tsx
   href={`/dashboard/tenants/${tenant.id}`}
   href={`/dashboard/tenants/${tenant.id}/edit`}
   ```
   *Rekomendasi:* Gunakan helper `ROUTES.ADMIN.TENANT_DETAIL` dan `ROUTES.ADMIN.TENANT_EDIT`.

### B. Modul Dashboard (`src/sections/dashboard/`)
1. **`TeacherDashboardOverview.tsx` (baris 87, 100, 118, 170)**:
   ```tsx
   href="/dashboard/questions"
   href="/dashboard/results"
   href="/dashboard/courses"
   href="/dashboard/exams"
   ```
   *Rekomendasi:* Gunakan `ROUTES.TEACHER.QUESTIONS`, `ROUTES.TEACHER.RESULTS`, `ROUTES.TEACHER.COURSES`, `ROUTES.TEACHER.EXAMS`.
2. **`UpcomingExamsTable.tsx` (baris 48)**:
   ```tsx
   <LinkButton href="/dashboard/exams" ...>
   ```
   *Rekomendasi:* Gunakan `ROUTES.STUDENT.EXAMS` (atau alias dashboard).
3. **`StudentRecentGrades.tsx` (baris 18 & 59)**:
   ```tsx
   href="/dashboard/results"
   ```
   *Rekomendasi:* Gunakan `ROUTES.STUDENT.RESULTS`.
4. **`StudentActiveCourses.tsx` (baris 18)**:
   ```tsx
   href="/dashboard/courses"
   ```
   *Rekomendasi:* Gunakan `ROUTES.STUDENT.COURSES`.

### C. Modul Courses & Results (`src/sections/courses/` & `src/sections/results/`)
1. **`StudentCoursesView.tsx` (baris 135)**:
   ```tsx
   href={`/dashboard/courses/${course.id}`}
   ```
   *Rekomendasi:* Gunakan `ROUTES.STUDENT.COURSE_DETAIL(course.id)`.
2. **`ResultDetailPageView.tsx` (baris 31)**:
   ```tsx
   onClick={() => router.push(`${AppRouteConstants.DASHBOARD}/results`)}
   ```
   *Rekomendasi:* Gunakan `ROUTES.RESULTS` atau `ROUTES.STUDENT.RESULTS`.

### D. Layout & Sidebar (`src/shared-ui/layout/`)
1. **`AppSidebar.tsx` (baris 217, 222, 227, 238, 249, 259, 264)**:
   Terdapat hardcoded path:
   ```tsx
   path: "/dashboard/assignments"
   path: "/dashboard/calendar"
   path: "/dashboard/schedule"
   path: "/dashboard/announcements"
   path: "/dashboard/activities"
   path: "/dashboard/profile"
   path: "/dashboard/settings"
   ```
   *Rekomendasi:* Lihat Bagian 5 (Resolusi Dead Links).

---

## 5. Daftar Dead Links / Phantom Routes (Halaman Belum Ada)

Pada navigasi siswa di `AppSidebar.tsx` serta widget dashboard siswa (`StudentUpcomingTasks.tsx`, `StudentRightRailWidgets.tsx`), terdapat rute-rute berikut yang **sama sekali tidak ada file `page.tsx`-nya** di Next.js:

| Rute Hardcoded | Ditemukan Pada | Dampak Jika Diklik | Tindakan yang Dibutuhkan |
|---|---|---|---|
| `/dashboard/assignments` | `AppSidebar.tsx`, `StudentUpcomingTasks.tsx` | 404 Not Found | Nonaktifkan / buat placeholder page |
| `/dashboard/calendar` | `AppSidebar.tsx` | 404 Not Found | Nonaktifkan / buat placeholder page |
| `/dashboard/schedule` | `AppSidebar.tsx`, `StudentRightRailWidgets.tsx` | 404 Not Found | Nonaktifkan / buat placeholder page |
| `/dashboard/announcements`| `AppSidebar.tsx`, `StudentRightRailWidgets.tsx` | 404 Not Found | Arahkan ke `/dashboard/notifications` atau buat placeholder |
| `/dashboard/activities` | `AppSidebar.tsx`, `StudentRightRailWidgets.tsx` | 404 Not Found | Nonaktifkan / buat placeholder page |
| `/dashboard/profile` | `AppSidebar.tsx` | 404 Not Found | Nonaktifkan / buat placeholder page |

> **Catatan UX:** Tautan menuju rute yang belum diimplementasikan menyebabkan pengalaman pengguna buruk (rusak/404). Tautan-tautan ini harus dinonaktifkan sementara atau dilengkapi dengan `DashboardRoutePlaceholder` agar aplikasi tetap solid.

---

## 6. Desain Arsitektur Single Source of Truth (`src/libs/routes.ts`)

Perbarui struktur `src/libs/routes.ts` agar menjadi satu-satunya sumber kebenaran (Single Source of Truth) yang mencakup seluruh rute statis dan fungsi pembangun rute dinamis yang type-safe:

```typescript
// src/libs/routes.ts

const DASHBOARD_ROOT = "/dashboard";

export const ROUTES = {
  HOME: "/",
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    CHANGE_PASSWORD: "/change-password",
  },
  DASHBOARD: {
    ROOT: DASHBOARD_ROOT,
    AUDIT: `${DASHBOARD_ROOT}/audit`,
    BRANDING: `${DASHBOARD_ROOT}/branding`,
    SETTINGS: `${DASHBOARD_ROOT}/settings`,
    NOTIFICATIONS: `${DASHBOARD_ROOT}/notifications`,
    PROCTOR: `${DASHBOARD_ROOT}/proctor`,
    
    // Tenants
    TENANTS: `${DASHBOARD_ROOT}/tenants`,
    TENANTS_CREATE: `${DASHBOARD_ROOT}/tenants/create`,
    TENANT_DETAIL: (id: string | number) => `${DASHBOARD_ROOT}/tenants/${id}`,
    TENANT_EDIT: (id: string | number) => `${DASHBOARD_ROOT}/tenants/${id}/edit`,

    // Users
    USERS: `${DASHBOARD_ROOT}/users`,
    USERS_CREATE: `${DASHBOARD_ROOT}/users/create`,
    USER_DETAIL: (id: string | number) => `${DASHBOARD_ROOT}/users/${id}`,
    USER_EDIT: (id: string | number) => `${DASHBOARD_ROOT}/users/${id}/edit`,

    // Enrolments
    ENROLMENTS: `${DASHBOARD_ROOT}/enrolments`,
    ENROLMENTS_CREATE: `${DASHBOARD_ROOT}/enrolments/create`,
    ENROLMENT_DETAIL: (id: string | number) => `${DASHBOARD_ROOT}/enrolments/${id}`,
    ENROLMENT_EDIT: (id: string | number) => `${DASHBOARD_ROOT}/enrolments/${id}/edit`,

    // Groups
    GROUPS: `${DASHBOARD_ROOT}/groups`,
    GROUPS_CREATE: `${DASHBOARD_ROOT}/groups/create`,
    GROUP_DETAIL: (id: string | number) => `${DASHBOARD_ROOT}/groups/${id}`,
    GROUP_EDIT: (id: string | number) => `${DASHBOARD_ROOT}/groups/${id}/edit`,

    // Courses
    COURSES: `${DASHBOARD_ROOT}/courses`,
    COURSE_DETAIL: (id: string | number) => `${DASHBOARD_ROOT}/courses/${id}`,

    // Questions
    QUESTIONS: `${DASHBOARD_ROOT}/questions`,
    QUESTIONS_CREATE: `${DASHBOARD_ROOT}/questions/create`,
    QUESTION_DETAIL: (id: string | number) => `${DASHBOARD_ROOT}/questions/${id}`,
    QUESTION_EDIT: (id: string | number) => `${DASHBOARD_ROOT}/questions/${id}/edit`,

    // Exams
    EXAMS: `${DASHBOARD_ROOT}/exams`,
    EXAMS_CREATE: `${DASHBOARD_ROOT}/exams/create`,
    EXAM_DETAIL: (id: string | number) => `${DASHBOARD_ROOT}/exams/${id}`,
    EXAM_EDIT: (id: string | number) => `${DASHBOARD_ROOT}/exams/${id}/edit`,
    EXAM_MONITOR: (id: string | number) => `${DASHBOARD_ROOT}/exams/${id}/monitor`,
    EXAM_ATTEMPT: (quizId: string | number, attemptId: string | number) =>
      `${DASHBOARD_ROOT}/exams/${quizId}/attempt/${attemptId}`,

    // Results
    RESULTS: `${DASHBOARD_ROOT}/results`,
    RESULT_DETAIL: (id: string | number) => `${DASHBOARD_ROOT}/results/${id}`,
  },

  // Aliases role-scoped untuk kemudahan navigasi RBAC
  ADMIN: {
    ROOT: DASHBOARD_ROOT,
    TENANTS: `${DASHBOARD_ROOT}/tenants`,
    NOTIFICATIONS: `${DASHBOARD_ROOT}/notifications`,
    AUDIT: `${DASHBOARD_ROOT}/audit`,
    SETTINGS: `${DASHBOARD_ROOT}/settings`,
    RESULTS: `${DASHBOARD_ROOT}/results`,
  },
  TENANT: {
    ROOT: DASHBOARD_ROOT,
    USERS: `${DASHBOARD_ROOT}/users`,
    ENROLMENTS: `${DASHBOARD_ROOT}/enrolments`,
    GROUPS: `${DASHBOARD_ROOT}/groups`,
    COURSES: `${DASHBOARD_ROOT}/courses`,
    QUESTIONS: `${DASHBOARD_ROOT}/questions`,
    EXAMS: `${DASHBOARD_ROOT}/exams`,
    RESULTS: `${DASHBOARD_ROOT}/results`,
    NOTIFICATIONS: `${DASHBOARD_ROOT}/notifications`,
    BRANDING: `${DASHBOARD_ROOT}/branding`,
    AUDIT: `${DASHBOARD_ROOT}/audit`,
    PROCTOR: `${DASHBOARD_ROOT}/proctor`,
  },
  STUDENT: {
    ROOT: DASHBOARD_ROOT,
    COURSES: `${DASHBOARD_ROOT}/courses`,
    EXAMS: `${DASHBOARD_ROOT}/exams`,
    RESULTS: `${DASHBOARD_ROOT}/results`,
    NOTIFICATIONS: `${DASHBOARD_ROOT}/notifications`,
    SETTINGS: `${DASHBOARD_ROOT}/settings`,
  },
  TEACHER: {
    ROOT: DASHBOARD_ROOT,
    COURSES: `${DASHBOARD_ROOT}/courses`,
    QUESTIONS: `${DASHBOARD_ROOT}/questions`,
    EXAMS: `${DASHBOARD_ROOT}/exams`,
    RESULTS: `${DASHBOARD_ROOT}/results`,
    NOTIFICATIONS: `${DASHBOARD_ROOT}/notifications`,
  },
} as const;

export type AppRoutes = typeof ROUTES;

// Deprecated AppRouteConstants diarahkan langsung ke ROUTES agar backward-compatible
export const AppRouteConstants = {
  HOME: ROUTES.HOME,
  LOGIN: ROUTES.AUTH.LOGIN,
  REGISTER: ROUTES.AUTH.REGISTER,
  DASHBOARD: ROUTES.DASHBOARD.ROOT,
  COURSES: ROUTES.DASHBOARD.COURSES,
  EXAMS: ROUTES.DASHBOARD.EXAMS,
  USERS: ROUTES.DASHBOARD.USERS,
  TENANTS: ROUTES.DASHBOARD.TENANTS,
  RESULTS: ROUTES.DASHBOARD.RESULTS,
  courseDetail: ROUTES.DASHBOARD.COURSE_DETAIL,
  examDetail: ROUTES.DASHBOARD.EXAM_DETAIL,
  examAttempt: ROUTES.DASHBOARD.EXAM_ATTEMPT,
} as const;
```

---

## 7. Rencana Kerja Refactoring (Step-by-Step Execution Plan)

### Langkah 1: Konsolidasi Definisi Rute pada `src/libs/routes.ts`
- Tambahkan seluruh rute CRUD dan builder functions dinamis (seperti `TENANT_DETAIL`, `EXAM_MONITOR`, dsb).
- Satukan `AppRouteConstants` sebagai wrapper tipis ke `ROUTES` untuk mencegah duplikasi.

### Langkah 2: Migrasi Hardcoded Route pada `src/sections/`
- Ganti semua string manual pada:
  - `src/sections/tenant/organisms/TenantsManagementView.tsx`
  - `src/sections/tenant/organisms/TenantDetailView.tsx`
  - `src/sections/tenant/organisms/TenantCreateView.tsx`
  - `src/sections/tenant/organisms/TenantEditView.tsx`
  - `src/sections/tenant/molecules/TenantTable.tsx`
  - `src/sections/courses/organisms/StudentCoursesView.tsx`
  - `src/sections/results/pages/ResultDetailPageView.tsx`
  - `src/sections/dashboard/organisms/TeacherDashboardOverview.tsx`
  - `src/sections/dashboard/molecules/UpcomingExamsTable.tsx`
  - `src/sections/dashboard/molecules/StudentRecentGrades.tsx`
  - `src/sections/dashboard/molecules/StudentActiveCourses.tsx`

### Langkah 3: Penanganan Dead Links pada Navigasi Siswa
- Untuk item navigasi yang belum memiliki implementasi backend (`/dashboard/assignments`, `/dashboard/calendar`, `/dashboard/schedule`, `/dashboard/announcements`, `/dashboard/activities`, `/dashboard/profile`):
  - **Opsi Terpilih:** Buat berkas `page.tsx` dengan `DashboardRoutePlaceholder` di `src/app/(protected)/dashboard/` (atau bersihkan link dari sidebar dan widget jika fitur tersebut out-of-scope), sehingga klik pengguna **tidak pernah menghasilkan 404**.
  - Arahkan menu "Pengumuman" siswa ke `ROUTES.STUDENT.NOTIFICATIONS`.

### Langkah 4: Architecture Automated Guardrail Test
- Tambahkan pengujian otomatis pada `src/__tests__/architecture/routeGroups.test.ts` atau test terpisah yang melakukan verifikasi:
  - Semua rute di `AppSidebar.tsx` dan `avatarMenu.ts` memiliki berkas `page.tsx` nyata.
  - Tidak ada berkas di bawah `src/sections/` yang memanggil `router.push("/dashboard/...")` atau `<Link href="/dashboard/...">` menggunakan string literal mentah.

---

## 8. Kriteria Penerimaan (Acceptance Criteria)

- [ ] Seluruh 41 rute halaman App Router terdaftar secara lengkap dan terstruktur di `src/libs/routes.ts`.
- [ ] Tidak ada lagi string literal mentah seperti `"/dashboard/..."` pada pemanggilan `router.push()`, `LinkButton`, maupun `<Link href="...">` di seluruh `src/sections/*` dan `src/shared-ui/*`.
- [ ] Rute dinamis (seperti detail kursus, detail ujian, edit tenant, monitor ujian) menggunakan fungsi builder yang type-safe dari `ROUTES`.
- [ ] Tidak ada dead links (link yang menghasilkan 404) pada sidebar maupun widget dashboard siswa.
- [ ] Navigasi topbar, sidebar, dan profile dropdown konsisten menggunakan konstanta dari `ROUTES`.
- [ ] Seluruh unit test vitest terkait arsitektur routing dan permissions lulus (100% Passed).
- [ ] `tsc --noEmit` dan `npm run lint:barrel` lulus tanpa error.
- [ ] Aplikasi berjalan tanpa regresi pada role `ADMIN`, `TENANT`, `TEACHER`, dan `STUDENT`.
