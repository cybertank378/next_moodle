// Files: src/modules/notification/application/usecases/CancelNotificationCampaignUseCase.ts

import { NotFoundError } from "@/core/errors/NotFoundError";
import type { NotificationCampaignEntity } from "@/modules/notification/domain/entity/NotificationCampaignEntity";
import type { NotificationCampaignRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationCampaignRepositoryInterface";
import {
  type CampaignActor,
  NotificationAuthorizationService,
} from "@/modules/notification/application/services/NotificationAuthorizationService";

export class CancelNotificationCampaignUseCase {
  constructor(private readonly campaignRepo: NotificationCampaignRepositoryInterface) {}

  async execute(campaignId: string, actor: CampaignActor): Promise<NotificationCampaignEntity> {
    const campaign = await this.campaignRepo.findById(campaignId);
    if (!campaign) {
      throw new NotFoundError("Pengumuman/notifikasi tidak ditemukan.");
    }

    NotificationAuthorizationService.assertCanAccessCampaign(campaign, actor);

    campaign.cancel();

    return this.campaignRepo.update(campaign);
  }
}
