import "server-only";

import { DefaultMoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import { EncryptedMoodleCredentialProvider } from "@/core/moodle/MoodleCredentialProvider";
import { AesHkdfEncryptionProvider } from "@/core/security/AesHkdfEncryptionProvider";
import { prisma } from "@/libs/prisma";
import { NotificationDispatchService } from "@/modules/notification/application/services/NotificationDispatchService";
import { FirebaseCloudMessagingAdapter } from "@/modules/notification/infrastructure/providers/FirebaseCloudMessagingAdapter";
import { NotificationRecipientProvider } from "@/modules/notification/infrastructure/providers/NotificationRecipientProvider";
import { PrismaNotificationCampaignRepository } from "@/modules/notification/infrastructure/repo/PrismaNotificationCampaignRepository";
import { PrismaNotificationDeliveryRepository } from "@/modules/notification/infrastructure/repo/PrismaNotificationDeliveryRepository";
import { PrismaNotificationDeviceRepository } from "@/modules/notification/infrastructure/repo/PrismaNotificationDeviceRepository";
import { PrismaNotificationOutboxRepository } from "@/modules/notification/infrastructure/repo/PrismaNotificationOutboxRepository";
import { PrismaNotificationRepository } from "@/modules/notification/infrastructure/repo/PrismaNotificationRepository";
import { NotificationOutboxWorker } from "@/modules/notification/infrastructure/workers/NotificationOutboxWorker";
import { PrismaMoodleCredentialStore } from "@/modules/tenant/infrastructure/repo/PrismaMoodleCredentialStore";

export function createNotificationOutboxWorker(): NotificationOutboxWorker {
  const campaignRepo = new PrismaNotificationCampaignRepository();
  const deliveryRepo = new PrismaNotificationDeliveryRepository();
  const deviceRepo = new PrismaNotificationDeviceRepository();
  const inboxRepo = new PrismaNotificationRepository();
  const outboxRepo = new PrismaNotificationOutboxRepository();
  const pushAdapter = new FirebaseCloudMessagingAdapter();
  const credentials = new EncryptedMoodleCredentialProvider(
    new PrismaMoodleCredentialStore(prisma),
    new AesHkdfEncryptionProvider(),
  );
  const recipientProvider = new NotificationRecipientProvider(
    new DefaultMoodleClientFactory(credentials),
  );
  const dispatchService = new NotificationDispatchService(
    campaignRepo, deliveryRepo, recipientProvider, inboxRepo, deviceRepo, pushAdapter,
  );
  return new NotificationOutboxWorker({
    outboxRepo,
    campaignRepo,
    notificationRepo: inboxRepo,
    dispatchService,
    pushAdapter,
  });
}
