// Files: src/modules/notification/application/usecases/DeleteNotificationDraftUseCase.ts

import { NotFoundError } from "@/core/errors/NotFoundError";
import { ValidationError } from "@/core/errors/ValidationError";
import type { NotificationCampaignRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationCampaignRepositoryInterface";
import {
  type CampaignActor,
  NotificationAuthorizationService,
} from "@/modules/notification/application/services/NotificationAuthorizationService";

export class DeleteNotificationDraftUseCase {
  constructor(private readonly campaignRepo: NotificationCampaignRepositoryInterface) {}

  async execute(campaignId: string, actor: CampaignActor): Promise<void> {
    const campaign = await this.campaignRepo.findById(campaignId);
    if (!campaign) {
      throw new NotFoundError("Pengumuman/notifikasi tidak ditemukan.");
    }

    NotificationAuthorizationService.assertCanAccessCampaign(campaign, actor);

    if (!campaign.canDelete) {
      throw new ValidationError("Hanya draft yang dapat dihapus.");
    }

    await this.campaignRepo.deleteDraft(campaignId);
  }
}
