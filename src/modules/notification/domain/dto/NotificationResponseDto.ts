import type { NotificationType } from "@/modules/notification/domain/types/NotificationTypes";

/**
 * Browser-facing notification shape. Internal scope fields
 * (tenantId / recipientId / recipientRole) are intentionally omitted.
 */
export interface NotificationResponseDto {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  linkPath: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface PaginatedNotificationsResponseDto {
  items: NotificationResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UnreadCountResponseDto {
  unreadCount: number;
}

export interface MarkAllReadResponseDto {
  markedCount: number;
}
