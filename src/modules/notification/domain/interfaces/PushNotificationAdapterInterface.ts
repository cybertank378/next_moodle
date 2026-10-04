import type { NotificationEntity } from "../entity/NotificationEntity";

export interface PushNotificationAdapterInterface {
  /**
   * Mengirim event notifikasi real-time ke channel recipient.
   */
  dispatchNotification(notification: NotificationEntity): Promise<void>;
}
