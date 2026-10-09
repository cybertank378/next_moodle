// Files: src/modules/notification/application/usecases/RetryNotificationDeliveryUseCase.ts

import { NotFoundError } from "@/core/errors/NotFoundError";
import {
  type CampaignActor,
  NotificationAuthorizationService,
} from "@/modules/notification/application/services/NotificationAuthorizationService";
import type { NotificationCampaignRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationCampaignRepositoryInterface";
import type { NotificationDeliveryRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationDeliveryRepositoryInterface";
import type { PushNotificationAdapterInterface } from "@/modules/notification/domain/interfaces/PushNotificationAdapterInterface";
import { NotificationChannel } from "@/modules/notification/domain/types/NotificationTypes";

export class RetryNotificationDeliveryUseCase {
  constructor(
    private readonly campaignRepo: NotificationCampaignRepositoryInterface,
    private readonly deliveryRepo: NotificationDeliveryRepositoryInterface,
    private readonly pushAdapter: PushNotificationAdapterInterface,
  ) {}

  async execute(
    campaignId: string,
    actor: CampaignActor,
  ): Promise<{ retriedCount: number }> {
    const campaign = await this.campaignRepo.findById(campaignId);
    if (!campaign) {
      throw new NotFoundError("Pengumuman/notifikasi tidak ditemukan.");
    }

    NotificationAuthorizationService.assertCanAccessCampaign(campaign, actor);

    const eligible = await this.deliveryRepo.findEligibleForRetry(campaignId);
    let retriedCount = 0;

    for (const delivery of eligible) {
      if (
        delivery.channel === NotificationChannel.PUSH &&
        delivery.deviceToken
      ) {
        try {
          if (this.pushAdapter.sendPushNotification) {
            await this.pushAdapter.sendPushNotification({
              token: delivery.deviceToken,
              title: campaign.title,
              body: campaign.pushSummary || campaign.plainText.slice(0, 200),
              data: { campaignId: campaign.id, retry: "true" },
            });
          }
          delivery.markAccepted();
          await this.deliveryRepo.updateStatus(delivery.id, delivery.status, {
            acceptedAt: delivery.acceptedAt,
          });
          retriedCount += 1;
        } catch (err: unknown) {
          const errorMsg =
            err instanceof Error ? err.message : "RETRY_PUSH_FAILED";
          delivery.markFailed(errorMsg);
          await this.deliveryRepo.updateStatus(delivery.id, delivery.status, {
            errorCode: errorMsg,
          });
        }
      }
    }

    return { retriedCount };
  }
}
