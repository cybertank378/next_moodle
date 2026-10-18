# Use Case Migration Inventory

Standardisasi seluruh Use Case dengan `BaseUseCase` kanonis dan orkestrasi via `BaseService` (Issue #205).

## Arsitektur & Pattern

### 1. `BaseUseCase<TInput, TOutput>`
- Terletak di [`src/core/base/BaseUseCase.ts`](file:///d:/Project/Website/next-moodle/src/core/base/BaseUseCase.ts).
- Kontrak tunggal dan esensial:
  - `abstract handle(input: TInput): Promise<TOutput>`: Implementasi inti logika bisnis pada use case.
  - `execute(input: TInput): Promise<TOutput>`: Delegasi default yang memanggil `this.handle(input)`.
- Tidak membebani use case dengan boilerplate pipeline berat yang kaku. Backward compatibility dipertahankan dengan overload `execute` bila pemanggil lawas menyuplai multi-argumen.

### 2. `BaseService`
- Terletak di [`src/core/base/BaseService.ts`](file:///d:/Project/Website/next-moodle/src/core/base/BaseService.ts).
- Bertindak sebagai Application Facade / Boundary Orkestrasi UseCase:
  - `execute<T, E>(operation: () => Promise<Result<T, E>> | Promise<T>): Promise<Result<T, E>>`
  - Normalisasi hasil operasi (baik yang mengembalikan `Result` maupun promise mentah) ke dalam `Result<T, E>`.
- Diimplementasikan oleh seluruh modul di `src/modules/{feature}/application/services/{Feature}Service.ts`.

---

## Tabel Inventaris Migrasi (17 Modul, 87 Use Cases)

| Modul | Use Case | Input Type | Output Type | Facade Service | Status |
|---|---|---|---|---|---|
| **assignment** | `GetStudentAssignmentsUseCase` | `GetStudentAssignmentsInput` | `Result<StudentAssignmentListItemDto[], Error>` | `AssignmentService` | Migrated |
| **assignment** | `GetAssignmentDetailUseCase` | `GetAssignmentDetailInput` | `Result<StudentAssignmentDetailDto, Error>` | `AssignmentService` | Migrated |
| **assignment** | `SubmitAssignmentUseCase` | `SubmitAssignmentInput` | `Result<SubmitAssignmentResponseDto, Error>` | `AssignmentService` | Migrated |
| **audit** | `GetAuditListUseCase` | `GetAuditListInput` | `Result<AuditListResponseDTO, Error>` | `AuditService` | Migrated |
| **audit** | `GetAuditDetailUseCase` | `GetAuditDetailInput` | `Result<AuditEntryResponseDTO, Error>` | `AuditService` | Migrated |
| **auth** | `GetCurrentSessionUseCase` | `GetCurrentSessionInput` | `Result<CurrentSessionResponseDTO, Error>` | `AuthService` | Migrated |
| **auth** | `LoginUseCase` | `LoginInput` | `Result<LoginResponseDTO, Error>` | `AuthService` | Migrated |
| **auth** | `LogoutAllUseCase` | `LogoutAllInput` | `Result<void, Error>` | `AuthService` | Migrated |
| **auth** | `LogoutUseCase` | `LogoutInput` | `Result<void, Error>` | `AuthService` | Migrated |
| **auth** | `RefreshSessionUseCase` | `RefreshSessionInput` | `Result<RefreshSessionResponseDTO, Error>` | `AuthService` | Migrated |
| **calendar** | `GetStudentCalendarEventsUseCase` | `GetStudentCalendarEventsInput` | `Result<StudentCalendarEventDto[], Error>` | `CalendarService` | Migrated |
| **course** | `GetCourseContentsUseCase` | `GetCourseContentsInput` | `Result<CourseSectionResponseDTO[], Error>` | `CourseService` | Migrated |
| **course** | `GetCourseDetailUseCase` | `GetCourseDetailInput` | `Result<CourseDetailResponseDTO, Error>` | `CourseService` | Migrated |
| **course** | `GetUserCoursesUseCase` | `GetUserCoursesInput` | `Result<CourseResponseDTO[], Error>` | `CourseService` | Migrated |
| **dashboard** | `GetAdminDashboardUseCase` | `GetAdminDashboardInput` | `Result<AdminDashboardDTO, Error>` | `DashboardService` | Migrated |
| **dashboard** | `GetProctorDashboardUseCase` | `GetProctorDashboardInput` | `Result<ProctorDashboardDTO, Error>` | `DashboardService` | Migrated |
| **dashboard** | `GetStudentDashboardUseCase` | `GetStudentDashboardInput` | `Result<StudentDashboardDTO, Error>` | `DashboardService` | Migrated |
| **dashboard** | `GetTeacherDashboardUseCase` | `GetTeacherDashboardInput` | `Result<TeacherDashboardDTO, Error>` | `DashboardService` | Migrated |
| **dashboard** | `GetTenantDashboardUseCase` | `GetTenantDashboardInput` | `Result<TenantDashboardDTO, Error>` | `DashboardService` | Migrated |
| **enrolment** | `EnrolUsersUseCase` | `EnrolUsersInput` | `Result<EnrolmentResultDto[], Error>` | `EnrolmentService` | Migrated |
| **enrolment** | `ListEnrolmentsUseCase` | `ListEnrolmentsInput` | `Result<CourseEnrolmentsDto, Error>` | `EnrolmentService` | Migrated |
| **enrolment** | `UnenrolUsersUseCase` | `UnenrolUsersInput` | `Result<EnrolmentResultDto[], Error>` | `EnrolmentService` | Migrated |
| **exam** | `AddQuestionToQuizUseCase` | `AddQuestionToQuizInput` | `Result<AddQuestionToQuizResponseDTO, Error>` | `ExamService` | Migrated |
| **exam** | `AddRandomQuestionsToQuizUseCase` | `AddRandomQuestionsToQuizInput` | `Result<AddRandomQuestionsResponseDTO, Error>` | `ExamService` | Migrated |
| **exam** | `GetQuizQuestionsUseCase` | `GetQuizQuestionsInput` | `Result<QuizQuestionsResponseDTO, Error>` | `ExamService` | Migrated |
| **exam** | `ReorderQuizQuestionsUseCase` | `ReorderQuizQuestionsInput` | `Result<ReorderQuizQuestionsResponseDTO, Error>` | `ExamService` | Migrated |
| **exam-monitor** | `ExtendTimeUseCase` | `ExtendTimeInput` | `Result<ExtendTimeResponseDTO, Error>` | `ExamMonitorService` | Migrated |
| **exam-monitor** | `ForceFinishAttemptUseCase` | `ForceFinishAttemptInput` | `Result<ForceFinishAttemptResponseDTO, Error>` | `ExamMonitorService` | Migrated |
| **exam-monitor** | `GetExamMonitorUseCase` | `GetExamMonitorInput` | `Result<ExamMonitorResponseDTO, Error>` | `ExamMonitorService` | Migrated |
| **exam-monitor** | `LockAttemptUseCase` | `LockAttemptInput` | `Result<LockAttemptResponseDTO, Error>` | `ExamMonitorService` | Migrated |
| **exam-monitor** | `UnlockAttemptUseCase` | `UnlockAttemptInput` | `Result<UnlockAttemptResponseDTO, Error>` | `ExamMonitorService` | Migrated |
| **grades** | `GetCourseGradesUseCase` | `GetCourseGradesInput` | `Result<CourseGradeReportDto, Error>` | `GradeService` | Migrated |
| **grades** | `GetUserGradesUseCase` | `GetUserGradesInput` | `Result<StudentGradeItemDto[], Error>` | `GradeService` | Migrated |
| **notification** | `ArchiveNotificationCampaignUseCase` | `ArchiveNotificationCampaignInput` | `NotificationCampaignEntity` | `NotificationService` | Migrated |
| **notification** | `CancelNotificationCampaignUseCase` | `CancelNotificationCampaignInput` | `NotificationCampaignEntity` | `NotificationService` | Migrated |
| **notification** | `CreateNotificationCampaignUseCase` | `CreateNotificationCampaignInput` | `NotificationCampaignEntity` | `NotificationService` | Migrated |
| **notification** | `CreateNotificationUseCase` | `CreateNotificationRequestDto` | `NotificationEntity` | `NotificationService` | Migrated |
| **notification** | `DeleteNotificationDraftUseCase` | `DeleteNotificationDraftInput` | `void` | `NotificationService` | Migrated |
| **notification** | `GetNotificationCampaignByIdUseCase` | `GetNotificationCampaignByIdInput` | `GetNotificationCampaignByIdOutput` | `NotificationService` | Migrated |
| **notification** | `GetNotificationCampaignListUseCase` | `GetNotificationCampaignListInput` | `GetNotificationCampaignListOutput` | `NotificationService` | Migrated |
| **notification** | `GetNotificationDeliveryReportUseCase` | `GetNotificationDeliveryReportInput` | `GetNotificationDeliveryReportOutput` | `NotificationService` | Migrated |
| **notification** | `GetNotificationRecipientOptionsUseCase` | `GetNotificationRecipientOptionsInput` | `NotificationRecipientOptionsResponseDto` | `NotificationService` | Migrated |
| **notification** | `GetNotificationsUseCase` | `GetNotificationsRequestDto` | `PaginatedNotificationsResponseDto` | `NotificationService` | Migrated |
| **notification** | `GetUnreadCountUseCase` | `GetUnreadCountRequestDto` | `number` | `NotificationService` | Migrated |
| **notification** | `MarkAllReadUseCase` | `MarkAllReadRequestDto` | `number` | `NotificationService` | Migrated |
| **notification** | `MarkNotificationReadUseCase` | `MarkNotificationReadRequestDto` | `void` | `NotificationService` | Migrated |
| **notification** | `PreviewNotificationAudienceUseCase` | `PreviewNotificationAudienceInput` | `NotificationAudiencePreviewResponseDto` | `NotificationService` | Migrated |
| **notification** | `RegisterNotificationDeviceUseCase` | `RegisterNotificationDeviceInput` | `void` | `NotificationService` | Migrated |
| **notification** | `RetryNotificationDeliveryUseCase` | `RetryNotificationDeliveryInput` | `{ retriedCount: number }` | `NotificationService` | Migrated |
| **notification** | `ScheduleNotificationCampaignUseCase` | `ScheduleNotificationCampaignInput` | `NotificationCampaignEntity` | `NotificationService` | Migrated |
| **notification** | `SendNotificationCampaignUseCase` | `SendNotificationCampaignInput` | `NotificationCampaignEntity` | `NotificationService` | Migrated |
| **notification** | `UnregisterNotificationDeviceUseCase` | `UnregisterNotificationDeviceInput` | `void` | `NotificationService` | Migrated |
| **notification** | `UpdateNotificationCampaignUseCase` | `UpdateNotificationCampaignInput` | `NotificationCampaignEntity` | `NotificationService` | Migrated |
| **questions** | `CreateQuestionCategoryUseCase` | `CreateQuestionCategoryInput` | `Result<QuestionCategoryResponseDTO, Error>` | `QuestionService` | Migrated |
| **questions** | `CreateQuestionUseCase` | `CreateQuestionInput` | `Result<QuestionResponseDTO, Error>` | `QuestionService` | Migrated |
| **questions** | `GetQuestionCategoriesUseCase` | `GetQuestionCategoriesInput` | `Result<QuestionCategoryResponseDTO[], Error>` | `QuestionService` | Migrated |
| **questions** | `GetQuestionsUseCase` | `GetQuestionsInput` | `Result<QuestionListResponseDTO, Error>` | `QuestionService` | Migrated |
| **questions** | `UpdateQuestionUseCase` | `UpdateQuestionInput` | `Result<QuestionResponseDTO, Error>` | `QuestionService` | Migrated |
| **quiz** | `CheckQuizAccessUseCase` | `CheckQuizAccessInput` | `Result<QuizAccessInfoResponseDTO, Error>` | `QuizService` | Migrated |
| **quiz** | `GetAttemptDataUseCase` | `GetAttemptDataInput` | `Result<QuizAttemptDataResponseDTO, Error>` | `QuizService` | Migrated |
| **quiz** | `GetAttemptSummaryUseCase` | `GetAttemptSummaryInput` | `Result<QuizAttemptSummaryResponseDTO, Error>` | `QuizService` | Migrated |
| **quiz** | `GetQuizDetailUseCase` | `GetQuizDetailInput` | `Result<QuizDetailResponseDTO, Error>` | `QuizService` | Migrated |
| **quiz** | `GetQuizzesByCourseUseCase` | `GetQuizzesByCourseInput` | `Result<QuizResponseDTO[], Error>` | `QuizService` | Migrated |
| **quiz** | `GetUserAttemptsUseCase` | `GetUserAttemptsInput` | `Result<UserAttemptsResponseDTO, Error>` | `QuizService` | Migrated |
| **quiz** | `SaveQuizAnswerUseCase` | `SaveQuizAnswerInput` | `Result<SaveQuizAnswerResponseDTO, Error>` | `QuizService` | Migrated |
| **quiz** | `StartQuizAttemptUseCase` | `StartQuizAttemptInput` | `Result<StartQuizAttemptResponseDTO, Error>` | `QuizService` | Migrated |
| **quiz** | `SubmitQuizAttemptUseCase` | `SubmitQuizAttemptInput` | `Result<SubmitQuizAttemptResponseDTO, Error>` | `QuizService` | Migrated |
| **schedule** | `GetScheduleSessionDetailUseCase` | `GetScheduleSessionDetailInput` | `Result<ExamSessionDetailResponseDto, Error>` | `ScheduleService` | Migrated |
| **schedule** | `GetStudentScheduleUseCase` | `GetStudentScheduleInput` | `Result<StudentScheduleItemDto[], Error>` | `ScheduleService` | Migrated |
| **schedule** | `GetTeacherSchedulesUseCase` | `GetTeacherSchedulesInput` | `Result<ScheduleListItemDto[], Error>` | `ScheduleService` | Migrated |
| **schedule** | `GetTenantSchedulesUseCase` | `GetTenantSchedulesInput` | `Result<ScheduleListItemDto[], Error>` | `ScheduleService` | Migrated |
| **schedule** | `CreateScheduleUseCase` | `CreateScheduleInput` | `Result<ExamScheduleResponseDto, Error>` | `ScheduleService` | Migrated |
| **schedule** | `UpdateScheduleUseCase` | `UpdateScheduleInput` | `Result<ExamScheduleResponseDto, Error>` | `ScheduleService` | Migrated |
| **schedule** | `PublishScheduleUseCase` | `PublishScheduleInput` | `Result<ExamScheduleResponseDto, Error>` | `ScheduleService` | Migrated |
| **schedule** | `CancelScheduleUseCase` | `CancelScheduleInput` | `Result<ExamScheduleResponseDto, Error>` | `ScheduleService` | Migrated |
| **settings** | `GetPlatformSettingsUseCase` | `GetPlatformSettingsInput` | `Result<PlatformSettingsResponseDTO, Error>` | `SettingsService` | Migrated |
| **settings** | `UpdatePlatformSettingsUseCase` | `UpdatePlatformSettingsInput` | `Result<PlatformSettingsResponseDTO, Error>` | `SettingsService` | Migrated |
| **tenant** | `ConfigureTenantCredentialUseCase` | `ConfigureTenantCredentialInput` | `Result<TenantResponseDTO, Error>` | `TenantService` | Migrated |
| **tenant** | `CreateTenantUseCase` | `CreateTenantInput` | `Result<TenantResponseDTO, Error>` | `TenantService` | Migrated |
| **tenant** | `DeleteTenantUseCase` | `DeleteTenantInput` | `Result<{ id: string }, Error>` | `TenantService` | Migrated |
| **tenant** | `GetAllTenantsUseCase` | `GetAllTenantsInput` | `Result<ListTenantsResponseDTO, Error>` | `TenantService` | Migrated |
| **tenant** | `GetTenantByIdUseCase` | `GetTenantByIdInput` | `Result<TenantResponseDTO, Error>` | `TenantService` | Migrated |
| **tenant** | `UpdateTenantStatusUseCase` | `UpdateTenantStatusInput` | `Result<TenantResponseDTO, Error>` | `TenantService` | Migrated |
| **tenant** | `UpdateTenantUseCase` | `UpdateTenantInput` | `Result<TenantResponseDTO, Error>` | `TenantService` | Migrated |
| **user** | `CreateUsersUseCase` | `CreateUsersInput` | `Array<{ id: number; username: string }>` | `UserService` | Migrated |
| **user** | `ImportUsersUseCase` | `ImportUsersInput` | `BulkImportUsersResponseDto` | `UserService` | Migrated |
| **user** | `ListUsersUseCase` | `ListUsersInput` | `UserListResponseDto` | `UserService` | Migrated |
