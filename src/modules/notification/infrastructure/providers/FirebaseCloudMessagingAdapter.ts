import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import type { NotificationEntity } from "../../domain/entity/NotificationEntity";
import type { PushNotificationAdapterInterface } from "../../domain/interfaces/PushNotificationAdapterInterface";
import { NotificationMapper } from "../../domain/mapper/NotificationMapper";

// Ensure Firebase is initialized
if (!getApps().length) {
  try {
    initializeApp({
      credential: applicationDefault(),
    });
  } catch (error) {
    console.warn("Failed to initialize Firebase Admin:", error);
  }
}

export class FirebaseCloudMessagingAdapter
  implements PushNotificationAdapterInterface
{
  async dispatchNotification(notification: NotificationEntity): Promise<void> {
    const tenantPart = notification.tenantId ?? "platform";
    // Construct the FCM topic name
    const topic = `${tenantPart}-${notification.recipientRole}-${notification.recipientId}`;

    const data = NotificationMapper.toDto(notification);

    // Convert boolean and null to strings because FCM data payload must be all strings
    const payloadData: Record<string, string> = {
      id: data.id,
      type: data.type,
      title: data.title,
      body: data.body,
      isRead: String(data.isRead),
      createdAt: data.createdAt,
    };
    if (data.linkPath) {
      payloadData.linkPath = data.linkPath;
    }
    if (data.readAt) {
      payloadData.readAt = data.readAt;
    }

    try {
      await getMessaging().send({
        topic: topic,
        data: payloadData,
        notification: {
          title: data.title,
          body: data.body,
        },
      });
    } catch (error) {
      console.error(
        "Failed to dispatch Firebase Cloud Messaging event:",
        error,
      );
    }
  }
}
