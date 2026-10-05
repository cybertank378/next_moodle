// Files: src/modules/notification/application/usecases/SendNotificationCampaignUseCase.ts

import { NotFoundError } from "@/core/errors/NotFoundError";
import type { NotificationCampaignEntity } from "@/modules/notification/domain/entity/NotificationCampaignEntity";
import type { NotificationCampaignRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationCampaignRepositoryInterface";
import type { NotificationOutboxRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationOutboxRepositoryInterface";
import type { NotificationDispatchService } from "@/modules/notification/application/services/NotificationDispatchService";
import {
  type CampaignActor,
  NotificationAuthorizationService,
} from "@/modules/notification/application/services/NotificationAuthorizationService";

export class SendNotificationCampaignUseCase {
  constructor(
    private readonly campaignRepo: NotificationCampaignRepositoryInterface,
    private readonly outboxRepo: NotificationOutboxRepositoryInterface,
    private readonly dispatchService?: NotificationDispatchService,
  ) {}

  async execute(campaignId: string, actor: CampaignActor): Promise<NotificationCampaignEntity> {
    const campaign = await this.campaignRepo.findById(campaignId);
    if (!campaign) {
      throw new NotFoundError("Pengumuman/notifikasi tidak ditemukan.");
    }

    NotificationAuthorizationService.assertCanAccessCampaign(campaign, actor);

    campaign.queue();
    const updated = await this.campaignRepo.update(campaign);

    // Enqueue outbox job for async persistence
    await this.outboxRepo.enqueue(campaign.id, "DISPATCH_CAMPAIGN");

    // If dispatchService is provided (e.g. immediate execution in serverless/monolith), execute now
    if (this.dispatchService) {
      // Background or synchronous execution
      await this.dispatchService.dispatchCampaign(updated);
    }

    return updated;
  }
}
