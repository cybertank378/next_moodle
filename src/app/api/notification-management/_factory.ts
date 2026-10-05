// Files: src/app/api/notification-management/_factory.ts

import { PrismaNotificationCampaignRepository } from "@/modules/notification/infrastructure/repo/PrismaNotificationCampaignRepository";
import { PrismaNotificationDeliveryRepository } from "@/modules/notification/infrastructure/repo/PrismaNotificationDeliveryRepository";
import { PrismaNotificationDeviceRepository } from "@/modules/notification/infrastructure/repo/PrismaNotificationDeviceRepository";
import { PrismaNotificationOutboxRepository } from "@/modules/notification/infrastructure/repo/PrismaNotificationOutboxRepository";
import { PrismaNotificationRepository } from "@/modules/notification/infrastructure/repo/PrismaNotificationRepository";
import { NotificationRecipientProvider } from "@/modules/notification/infrastructure/providers/NotificationRecipientProvider";
import { NotificationContentRenderer } from "@/modules/notification/infrastructure/providers/NotificationContentRenderer";
import { FirebaseCloudMessagingAdapter } from "@/modules/notification/infrastructure/providers/FirebaseCloudMessagingAdapter";
import { NotificationDispatchService } from "@/modules/notification/application/services/NotificationDispatchService";
import { GetNotificationCampaignListUseCase } from "@/modules/notification/application/usecases/GetNotificationCampaignListUseCase";
import { GetNotificationCampaignByIdUseCase } from "@/modules/notification/application/usecases/GetNotificationCampaignByIdUseCase";
import { CreateNotificationCampaignUseCase } from "@/modules/notification/application/usecases/CreateNotificationCampaignUseCase";
import { UpdateNotificationCampaignUseCase } from "@/modules/notification/application/usecases/UpdateNotificationCampaignUseCase";
import { DeleteNotificationDraftUseCase } from "@/modules/notification/application/usecases/DeleteNotificationDraftUseCase";
import { PreviewNotificationAudienceUseCase } from "@/modules/notification/application/usecases/PreviewNotificationAudienceUseCase";
import { GetNotificationRecipientOptionsUseCase } from "@/modules/notification/application/usecases/GetNotificationRecipientOptionsUseCase";
import { SendNotificationCampaignUseCase } from "@/modules/notification/application/usecases/SendNotificationCampaignUseCase";
import { ScheduleNotificationCampaignUseCase } from "@/modules/notification/application/usecases/ScheduleNotificationCampaignUseCase";
import { CancelNotificationCampaignUseCase } from "@/modules/notification/application/usecases/CancelNotificationCampaignUseCase";
import { ArchiveNotificationCampaignUseCase } from "@/modules/notification/application/usecases/ArchiveNotificationCampaignUseCase";
import { RetryNotificationDeliveryUseCase } from "@/modules/notification/application/usecases/RetryNotificationDeliveryUseCase";
import { GetNotificationDeliveryReportUseCase } from "@/modules/notification/application/usecases/GetNotificationDeliveryReportUseCase";
import { RegisterNotificationDeviceUseCase } from "@/modules/notification/application/usecases/RegisterNotificationDeviceUseCase";
import { UnregisterNotificationDeviceUseCase } from "@/modules/notification/application/usecases/UnregisterNotificationDeviceUseCase";
import { NotificationManagementController } from "@/modules/notification/infrastructure/http/NotificationManagementController";

export function createNotificationManagementController(): NotificationManagementController {
  const campaignRepo = new PrismaNotificationCampaignRepository();
  const deliveryRepo = new PrismaNotificationDeliveryRepository();
  const deviceRepo = new PrismaNotificationDeviceRepository();
  const outboxRepo = new PrismaNotificationOutboxRepository();
  const inboxRepo = new PrismaNotificationRepository();
  const recipientProvider = new NotificationRecipientProvider();
  const contentRenderer = new NotificationContentRenderer();
  const pushAdapter = new FirebaseCloudMessagingAdapter();

  const dispatchService = new NotificationDispatchService(
    campaignRepo,
    deliveryRepo,
    recipientProvider,
    inboxRepo,
    deviceRepo,
    pushAdapter,
  );

  return new NotificationManagementController(
    new GetNotificationCampaignListUseCase(campaignRepo),
    new GetNotificationCampaignByIdUseCase(campaignRepo, deliveryRepo),
    new CreateNotificationCampaignUseCase(campaignRepo, contentRenderer),
    new UpdateNotificationCampaignUseCase(campaignRepo, contentRenderer),
    new DeleteNotificationDraftUseCase(campaignRepo),
    new PreviewNotificationAudienceUseCase(recipientProvider),
    new GetNotificationRecipientOptionsUseCase(recipientProvider),
    new SendNotificationCampaignUseCase(campaignRepo, outboxRepo, dispatchService),
    new ScheduleNotificationCampaignUseCase(campaignRepo, outboxRepo),
    new CancelNotificationCampaignUseCase(campaignRepo),
    new ArchiveNotificationCampaignUseCase(campaignRepo),
    new RetryNotificationDeliveryUseCase(campaignRepo, deliveryRepo, pushAdapter),
    new GetNotificationDeliveryReportUseCase(campaignRepo, deliveryRepo),
    new RegisterNotificationDeviceUseCase(deviceRepo),
    new UnregisterNotificationDeviceUseCase(deviceRepo),
  );
}
