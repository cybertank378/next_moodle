// Files: src/modules/notification/application/usecases/GetNotificationCampaignByIdUseCase.ts

import { NotFoundError } from "@/core/errors/NotFoundError";
import {
  type CampaignActor,
  NotificationAuthorizationService,
} from "@/modules/notification/application/services/NotificationAuthorizationService";
import type { NotificationCampaignEntity } from "@/modules/notification/domain/entity/NotificationCampaignEntity";
import type { NotificationCampaignRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationCampaignRepositoryInterface";
import type { NotificationDeliveryRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationDeliveryRepositoryInterface";
import type { NotificationDeliverySummary } from "@/modules/notification/domain/types/NotificationTypes";

export class GetNotificationCampaignByIdUseCase {
  constructor(
    private readonly campaignRepo: NotificationCampaignRepositoryInterface,
    private readonly deliveryRepo: NotificationDeliveryRepositoryInterface,
  ) {}

  async execute(
    campaignId: string,
    actor: CampaignActor,
  ): Promise<{
    campaign: NotificationCampaignEntity;
    summary: NotificationDeliverySummary;
  }> {
    const campaign = await this.campaignRepo.findById(campaignId);
    if (!campaign) {
      throw new NotFoundError("Pengumuman/notifikasi tidak ditemukan.");
    }

    NotificationAuthorizationService.assertCanAccessCampaign(campaign, actor);

    const summary = await this.deliveryRepo.getDeliverySummary(campaignId);

    return { campaign, summary };
  }
}
