import type {
  NotificationTab,
  NotificationType,
} from "@/modules/notification/domain/types/NotificationTypes";
import type { NotificationScope } from "@/modules/notification/domain/value-object/NotificationScope";

export interface GetNotificationsRequestDto {
  scope: NotificationScope;
  tab: NotificationTab;
  page: number;
  limit: number;
}

export interface GetUnreadCountRequestDto {
  scope: NotificationScope;
}

export interface MarkNotificationReadRequestDto {
  notificationId: string;
  scope: NotificationScope;
}

export interface MarkAllReadRequestDto {
  scope: NotificationScope;
}

/** Used by server-side producers (domain events), never by the browser. */
export interface CreateNotificationRequestDto {
  scope: NotificationScope;
  type: NotificationType;
  title: string;
  body: string;
  /** Internal app path only, e.g. `/student/grades`. */
  linkPath?: string | null;
}
