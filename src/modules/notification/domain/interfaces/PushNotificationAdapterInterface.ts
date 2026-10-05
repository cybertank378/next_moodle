import type { NotificationEntity } from "@/modules/notification/domain/entity/NotificationEntity";

export interface PushNotificationAdapterInterface {
  /**
   * Mengirim event notifikasi real-time ke channel recipient.
   */
  dispatchNotification(notification: NotificationEntity): Promise<void>;

  /**
   * Mengirim notifikasi push ke perangkat tertentu atau topic FCM.
   */
  sendPushNotification?(options: {
    token?: string;
    topic?: string;
    title: string;
    body: string;
    data?: Record<string, string>;
  }): Promise<{ success: boolean; messageId?: string; error?: string }>;
}
