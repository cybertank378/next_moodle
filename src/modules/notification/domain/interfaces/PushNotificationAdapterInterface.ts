import type { NotificationEntity } from "@/modules/notification/domain/entity/NotificationEntity";

export interface PushNotificationAdapterInterface {
  /**
   * Mengirim event notifikasi real-time ke channel recipient.
   */
  dispatchNotification(notification: NotificationEntity): Promise<void>;
}
