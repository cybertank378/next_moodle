// Files: src/modules/notification/domain/types/NotificationTypes.ts

export enum NotificationType {
  EXAM_RESULT_AVAILABLE = "EXAM_RESULT_AVAILABLE",
  ASSIGNMENT_SUBMITTED = "ASSIGNMENT_SUBMITTED",
  ASSIGNMENT_GRADED = "ASSIGNMENT_GRADED",
  STUDENT_ENROLLED = "STUDENT_ENROLLED",
  STUDENT_IMPORT_COMPLETE = "STUDENT_IMPORT_COMPLETE",
  STUDENT_IMPORT_FAILED = "STUDENT_IMPORT_FAILED",
  TENANT_REGISTERED = "TENANT_REGISTERED",
  CREDENTIAL_FAILED = "CREDENTIAL_FAILED",
  SYSTEM_ERROR = "SYSTEM_ERROR",
  ANNOUNCEMENT = "ANNOUNCEMENT",
}

export type NotificationTab = "unread" | "read";

export enum NotificationOwnerScope {
  PLATFORM = "PLATFORM",
  TENANT = "TENANT",
}

export enum NotificationDispatchStatus {
  DRAFT = "DRAFT",
  SCHEDULED = "SCHEDULED",
  QUEUED = "QUEUED",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  PARTIAL_FAILED = "PARTIAL_FAILED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export enum NotificationChannel {
  IN_APP = "IN_APP",
  PUSH = "PUSH",
}

export enum NotificationDeliveryStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  FAILED = "FAILED",
  SKIPPED = "SKIPPED",
}

export enum NotificationAudienceScope {
  ALL = "ALL",
  TENANT = "TENANT",
  ROLES = "ROLES",
  USERS = "USERS",
}

export interface NotificationAudienceSpec {
  scope: NotificationAudienceScope;
  tenantIds?: string[];
  roles?: string[];
  userIds?: string[];
}

export interface NotificationDeliverySummary {
  total: number;
  inboxCreated: number;
  pushAccepted: number;
  pushFailed: number;
  pushSkipped: number;
  pending: number;
}
