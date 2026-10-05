export const Permission = {
  // ADMIN
  ADMIN_DASHBOARD_READ: "admin.dashboard.read",
  TENANT_CREATE: "tenant.create",
  TENANT_READ: "tenant.read",
  TENANT_UPDATE: "tenant.update",
  TENANT_STATUS_UPDATE: "tenant.status.update",
  TENANT_CONNECTION_TEST: "tenant.connection.test",
  PLATFORM_AUDIT_READ: "platform.audit.read",

  // NOTIFICATION MANAGEMENT
  NOTIFICATION_MANAGE: "notification.manage",
  NOTIFICATION_CAMPAIGN_CREATE: "notification.campaign.create",
  NOTIFICATION_CAMPAIGN_READ: "notification.campaign.read",
  NOTIFICATION_CAMPAIGN_UPDATE: "notification.campaign.update",
  NOTIFICATION_CAMPAIGN_SEND: "notification.campaign.send",
  NOTIFICATION_CAMPAIGN_CANCEL: "notification.campaign.cancel",
  NOTIFICATION_CAMPAIGN_ARCHIVE: "notification.campaign.archive",
  NOTIFICATION_REPORT_READ: "notification.report.read",

  // TENANT
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

  // STUDENT
  STUDENT_DASHBOARD_READ: "student.dashboard.read",
  STUDENT_COURSE_READ: "student.course.read",
  STUDENT_QUIZ_READ: "student.quiz.read",
  ATTEMPT_START: "attempt.start",
  ATTEMPT_READ_OWN: "attempt.read.own",
  ATTEMPT_SAVE_OWN: "attempt.save.own",
  ATTEMPT_SUBMIT_OWN: "attempt.submit.own",
  ATTEMPT_REVIEW_OWN: "attempt.review.own",
  GRADE_READ_OWN: "grade.read.own",

  // TEACHER
  TEACHER_DASHBOARD_READ: "teacher.dashboard.read",
  TEACHER_COURSE_READ: "teacher.course.read",
  TEACHER_QUIZ_READ: "teacher.quiz.read",
  TEACHER_GRADE_READ: "teacher.grade.read",
} as const;

export type PermissionType = (typeof Permission)[keyof typeof Permission];
