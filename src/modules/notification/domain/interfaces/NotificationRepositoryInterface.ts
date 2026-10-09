// Files: src/modules/notification/domain/interfaces/NotificationRepositoryInterface.ts
import type { NotificationEntity } from "@/modules/notification/domain/entity/NotificationEntity";
import type { NotificationType } from "@/modules/notification/domain/types/NotificationTypes";
import type { NotificationScope } from "@/modules/notification/domain/value-object/NotificationScope";

export interface FindByRecipientOptions {
  scope: NotificationScope;
  isRead: boolean;
  page: number;
  limit: number;
}

export interface FindByRecipientResult {
  items: NotificationEntity[];
  total: number;
}

export interface CreateNotificationOptions {
  scope: NotificationScope;
  type: NotificationType;
  title: string;
  body: string;
  linkPath: string | null;
}

/**
 * Every list/count/bulk operation receives a NotificationScope so the
 * implementation always filters by tenant + recipient + role together.
 */
export interface NotificationRepositoryInterface {
  findByRecipient(
    options: FindByRecipientOptions,
  ): Promise<FindByRecipientResult>;
  countUnread(scope: NotificationScope): Promise<number>;
  findById(id: string): Promise<NotificationEntity | null>;
  markAsRead(
    id: string,
    scope?: NotificationScope,
  ): Promise<NotificationEntity>;
  markAllAsRead(scope: NotificationScope): Promise<number>;
  create(options: CreateNotificationOptions): Promise<NotificationEntity>;
}
