// Files: src/modules/notification/domain/interfaces/PushNotificationAdapterInterface.ts
import type { NotificationEntity } from "@/modules/notification/domain/entity/NotificationEntity";

export type PushDispatchOutcome = "ACCEPTED" | "FAILED" | "SKIPPED";

export interface PushDispatchResult {
  outcome: PushDispatchOutcome;
  messageId?: string;
  errorCode?: string;
  isRetryable?: boolean;
}

export interface PushNotificationAdapterInterface {
  /**
   * Mengirim event notifikasi real-time ke channel recipient.
   */
  dispatchNotification(
    notification: NotificationEntity,
  ): Promise<PushDispatchResult | void>;

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
