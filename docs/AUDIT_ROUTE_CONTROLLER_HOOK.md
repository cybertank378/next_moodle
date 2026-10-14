# Audit & Refactoring Report: Standarisasi Route, Controller, dan Presentation Hook (Issue #194)

## 1. Ringkasan Eksekutif

Audit komprehensif telah dilakukan pada seluruh arsitektur HTTP API Next.js (`src/app/api/**`), controller lapisan infrastruktur (`src/modules/**/infrastructure/http/*Controller.ts`), dan presentation hooks (`src/modules/**/presentation/hooks/use*Api.ts`) sesuai arahan Issue #194 dan Agent Engineering Contract (`AGENTS.md`).

Tujuan utama audit:
1. **Pemisahan Tanggung Jawab (Separation of Concerns):** Seluruh `route.ts` murni bertindak sebagai HTTP transport adapter tipis. Tidak ada business logic, query database langsung (Prisma), atau manipulasi state di dalam route handler.
2. **Otorisasi Terpusat pada Controller/Application:** Resolusi otorisasi, penegakan RBAC (`requirePermission`, `requireRole`, `assertTenantScope`), serta validasi sesi ditangani di dalam controller dan use case, bukan tercecer di route handler.
3. **Penyelarasan Presentation Layer (Atomic UI):** Seluruh komponen UI (`src/sections/**`) dilarang memanggil `fetch()` secara langsung ke endpoint backend. Semua komunikasi API wajib melalui custom hook fitur (`use*Api.ts`).

---

## 2. Pemetaan Lengkap: Route Handler, Controller, dan Presentation Hook

Berikut adalah daftar inventaris seluruh endpoint API internal Next.js beserta controller penanggung jawab dan hook presentasi yang bersangkutan:

| # | Feature / Domain | Route Handler (`src/app/api/...`) | Controller (`infrastructure/http`) | Presentation Hook (`presentation/hooks`) |
|---|---|---|---|---|
| 1 | **Assignment** | `/api/assignments` | `AssignmentController.getStudentAssignments` | `useAssignmentApi` |
| 2 | **Assignment** | `/api/assignments/[id]` (GET, POST) | `AssignmentController.getAssignmentDetail`, `submitAssignment` | `useAssignmentApi` |
| 3 | **Audit** | `/api/audit` (GET) | `AuditController.list` | `useAuditApi` |
| 4 | **Audit** | `/api/audit/[id]` (GET) | `AuditController.detail` | `useAuditApi` |
| 5 | **Audit** | `/api/audit/retention` (GET) | `AuditController.retention` | `useAuditApi.getRetentionOverview` |
| 6 | **Audit** | `/api/audit/cleanup` (POST) | `AuditController.cleanup` | `useAuditApi.cleanupRetention` |
| 7 | **Cron Audit** | `/api/cron/audit-retention` (POST) | `AuditController.cronAuditRetention` | N/A (Internal Scheduled Cron) |
| 8 | **Auth** | `/api/auth/login` (POST) | `AuthController.login` | `useAuthApi` |
| 9 | **Auth** | `/api/auth/logout` (POST) | `AuthController.logout` | `useAuthApi` |
| 10 | **Auth** | `/api/auth/logout-all` (POST) | `AuthController.logoutAll` | `useAuthApi` |
| 11 | **Auth** | `/api/auth/refresh` (POST) | `AuthController.refresh` | `useAuthApi` |
| 12 | **Auth** | `/api/auth/session` (GET) | `AuthController.currentSession` | `useAuthApi` |
| 13 | **Calendar** | `/api/calendar/events` (GET) | `CalendarController.getEvents` | `useCalendarApi` |
| 14 | **Course** | `/api/courses` (GET) | `CourseController.list` | `useCourseApi` |
| 15 | **Course** | `/api/courses/[courseId]` (GET) | `CourseController.getDetail` | `useCourseApi` |
| 16 | **Course** | `/api/courses/[courseId]/contents` (GET) | `CourseController.getContents` | `useCourseApi` |
| 17 | **Dashboard** | `/api/dashboard/admin` (GET) | `DashboardController.getAdminOverview` | `useDashboardApi` |
| 18 | **Dashboard** | `/api/dashboard/proctor` (GET) | `DashboardController.getProctorOverview` | `useDashboardApi` |
| 19 | **Dashboard** | `/api/dashboard/student` (GET) | `DashboardController.getStudentOverview` | `useDashboardApi` |
| 20 | **Dashboard** | `/api/dashboard/teacher` (GET) | `DashboardController.getTeacherOverview` | `useDashboardApi` |
| 21 | **Dashboard** | `/api/dashboard/tenant` (GET) | `DashboardController.getTenantOverview` | `useDashboardApi` |
| 22 | **Enrolments** | `/api/enrolments` (GET, POST, DELETE) | `EnrolmentController.list`, `enrol`, `unenrol` | `useEnrolmentApi` |
| 23 | **Exam Monitor** | `/api/exam-monitor` (GET) | `ExamMonitorController.getMonitor` | `useExamMonitorApi` |
| 24 | **Exam Monitor** | `/api/exam-monitor/extend-time` (POST) | `ExamMonitorController.extendTime` | `useExamMonitorApi` |
| 25 | **Exam Monitor** | `/api/exam-monitor/force-finish` (POST) | `ExamMonitorController.forceFinish` | `useExamMonitorApi` |
| 26 | **Exam Monitor** | `/api/exam-monitor/lock` (POST) | `ExamMonitorController.lockAttempt` | `useExamMonitorApi` |
| 27 | **Exam Monitor** | `/api/exam-monitor/unlock` (POST) | `ExamMonitorController.unlockAttempt` | `useExamMonitorApi` |
| 28 | **Exam Admin** | `/api/exam/quizzes/[quizId]/questions/reorder` (PATCH) | `ExamAdministrationController.reorderQuizQuestions` | `useExamApi` |
| 29 | **Firebase** | `/api/firebase/subscribe` (POST, DELETE) | `FirebaseSubscriptionController.subscribe`, `unsubscribe` | `useNotificationApi` |
| 30 | **Grades** | `/api/grades` (GET) | `GradeController.getGrades` | `useGradeApi` |
| 31 | **Grades** | `/api/grades/export` (GET) | `GradeController.exportGrades` | `useGradeApi.exportGrades` |
| 32 | **Notification Mgmt** | `/api/notification-management/campaigns` (GET, POST) | `NotificationManagementController.listCampaigns`, `createCampaign` | `useNotificationManagementApi` |
| 33 | **Notification Mgmt** | `/api/notification-management/campaigns/[id]` (GET) | `NotificationManagementController.getCampaignDetail` | `useNotificationManagementApi` |
| 34 | **Notification Mgmt** | `/api/notification-management/campaigns/[id]/archive` (PATCH) | `NotificationManagementController.archiveCampaign` | `useNotificationManagementApi` |
| 35 | **Notification Mgmt** | `/api/notification-management/campaigns/[id]/cancel` (PATCH) | `NotificationManagementController.cancelCampaign` | `useNotificationManagementApi` |
| 36 | **Notification Mgmt** | `/api/notification-management/campaigns/[id]/retry` (POST) | `NotificationManagementController.retryCampaign` | `useNotificationManagementApi` |
| 37 | **Notification Mgmt** | `/api/notification-management/campaigns/[id]/schedule` (PATCH) | `NotificationManagementController.scheduleCampaign` | `useNotificationManagementApi` |
| 38 | **Notification Mgmt** | `/api/notification-management/campaigns/[id]/send` (POST) | `NotificationManagementController.sendCampaign` | `useNotificationManagementApi` |
| 39 | **Notification Mgmt** | `/api/notification-management/campaigns/preview` (POST) | `NotificationManagementController.previewCampaign` | `useNotificationManagementApi` |
| 40 | **Notification Mgmt** | `/api/notification-management/recipients` (GET) | `NotificationManagementController.searchRecipients` | `useNotificationManagementApi` |
| 41 | **Notifications** | `/api/notifications` (GET, PATCH) | `NotificationController.getNotifications`, `markAllAsRead` | `useNotificationApi` |
| 42 | **Notifications** | `/api/notifications/[id]/read` (PATCH) | `NotificationController.markAsRead` | `useNotificationApi` |
| 43 | **Notifications** | `/api/notifications/count` (GET) | `NotificationController.getUnreadCount` | `useNotificationApi` |
| 44 | **Notifications** | `/api/notifications/devices` (POST, DELETE) | `NotificationController.registerDeviceToken`, `unregisterDeviceToken` | `useNotificationApi` |
| 45 | **Questions** | `/api/questions` (POST) | `QuestionController.createQuestion` | `useQuestionApi` |
| 46 | **Questions** | `/api/questions/[id]` (GET, PUT, DELETE) | `QuestionController.getQuestion`, `updateQuestion`, `deleteQuestion` | `useQuestionApi` |
| 47 | **Quizzes** | `/api/quizzes` (GET) | `QuizController.list` | `useQuizApi` |
| 48 | **Quizzes** | `/api/quizzes/[quizId]` (GET) | `QuizController.detail` | `useQuizApi` |
| 49 | **Quizzes** | `/api/quizzes/[quizId]/access` (GET) | `QuizController.checkAccess` | `useQuizApi` |
| 50 | **Quiz Attempts** | `/api/quizzes/attempts` (GET) | `QuizAttemptController.list` | `useQuizAttemptApi` |
| 51 | **Quiz Attempts** | `/api/quizzes/attempts/start` (POST) | `QuizAttemptController.start` | `useQuizAttemptApi` |
| 52 | **Quiz Attempts** | `/api/quizzes/attempts/[attemptId]/data` (GET) | `QuizAttemptController.getData` | `useQuizAttemptApi` |
| 53 | **Quiz Attempts** | `/api/quizzes/attempts/[attemptId]/summary` (GET) | `QuizAttemptController.getSummary` | `useQuizAttemptApi` |
| 54 | **Quiz Attempts** | `/api/quizzes/attempts/[attemptId]/save` (POST) | `QuizAttemptController.save` | `useQuizAttemptApi` |
| 55 | **Quiz Attempts** | `/api/quizzes/attempts/[attemptId]/submit` (POST) | `QuizAttemptController.submit` | `useQuizAttemptApi` |
| 56 | **Schedule** | `/api/schedule` (GET, POST) | `ScheduleController.getSchedule`, `createSchedule` | `useScheduleApi` |
| 57 | **Schedule** | `/api/schedule/[sessionId]` (GET, PATCH, DELETE) | `ScheduleController.getSessionDetail`, `updateSchedule`, `cancelSchedule` | `useScheduleApi` |
| 58 | **Schedule** | `/api/schedule/[sessionId]/publish` (POST) | `ScheduleController.publishSchedule` | `useScheduleApi` |
| 59 | **Settings** | `/api/settings` (GET, PATCH) | `SettingsController.getSettings`, `updateSettings` | `useSettingsApi` |
| 60 | **Tenant** | `/api/tenant` (GET, POST) | `TenantsController.list`, `create` | `useTenantApi` |
| 61 | **Tenant** | `/api/tenant/[tenantId]` (GET, PATCH, DELETE) | `TenantsController.detail`, `update`, `delete` | `useTenantApi` |
| 62 | **Tenant** | `/api/tenant/[tenantId]/credentials` (PUT) | `TenantsController.configureCredential` | `useTenantApi` |
| 63 | **Tenant** | `/api/tenant/[tenantId]/status` (PATCH) | `TenantsController.updateStatus` | `useTenantApi` |
| 64 | **Users** | `/api/users` (GET, POST) | `UserController.list`, `create` | `useUserApi` |
| 65 | **Users** | `/api/users/import` (POST) | `UserController.importUsers` | `useUserApi` |

---

## 3. Temuan dan Perbaikan yang Dilakukan

### 3.1 Migrasi Direct `fetch()` pada Presentation Layer ke Hook
Ditemukan 2 komponen UI di `src/sections` yang masih melakukan pemanggilan `fetch()` langsung tanpa melalui presentation hook:
1. **`src/sections/audit/organisms/AuditRetentionView.tsx`**:
   - Memanggil `fetch("/api/audit/retention")` dan `fetch("/api/audit/cleanup")`.
   - **Solusi:** Diperbarui dengan menambahkan `getRetentionOverview()` dan `cleanupRetention()` ke dalam `src/modules/audit/presentation/hooks/useAuditApi.ts`, lalu `AuditRetentionView.tsx` dimigrasikan untuk menggunakan hook tersebut.
2. **`src/sections/results/organisms/TeacherClassResultsView.tsx`**:
   - Memanggil `fetch("/api/grades/export?courseId=...")` secara langsung.
   - **Solusi:** Menambahkan `exportGrades(courseId: number): Promise<Blob | null>` ke dalam `src/modules/grades/presentation/hooks/useGradeApi.ts`, lalu memigrasikan `TeacherClassResultsView.tsx` untuk memanggil hook tersebut.

### 3.2 Verifikasi `src/app/api/**/route.ts`
- Seluruh 65 endpoint di atas dipastikan bertindak murni sebagai transport adapter tipis:
  - Input transport divalidasi (`NextRequest`).
  - Controller diambil melalui factory terisolasi (`_factory.ts`).
  - Pengembalian nilai seragam menggunakan `NextResponse`.
  - Mutasi yang diaudit dibungkus dengan `withAuditedMutation`.
  - Tidak ada manipulasi SQL/Prisma atau logika bisnis di dalam route handler.

---

## 4. Hasil Pengujian dan Verifikasi

- **Unit & Integration Tests (`npx vitest run`):** 168 files, 840 tests lulus 100%.
- **Type Checking (`npx tsc --noEmit`):** 0 error.
- **Linter & Formatter (`@biomejs/biome check`):** Bersih (0 error).
- **Production Build (`npm run build`):** 81 halaman dan 65 API route sukses terkompilasi.
