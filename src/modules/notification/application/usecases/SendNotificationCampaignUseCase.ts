// Files: src/modules/notification/application/usecases/SendNotificationCampaignUseCase.ts

import { NotFoundError } from "@/core/errors/NotFoundError";
import {
  type CampaignActor,
  NotificationAuthorizationService,
} from "@/modules/notification/application/services/NotificationAuthorizationService";
import type { NotificationDispatchService } from "@/modules/notification/application/services/NotificationDispatchService";
import type { NotificationCampaignEntity } from "@/modules/notification/domain/entity/NotificationCampaignEntity";
import type { NotificationCampaignRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationCampaignRepositoryInterface";
import type { NotificationOutboxRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationOutboxRepositoryInterface";

export class SendNotificationCampaignUseCase {
  constructor(
    private readonly campaignRepo: NotificationCampaignRepositoryInterface,
    private readonly outboxRepo: NotificationOutboxRepositoryInterface,
    private readonly dispatchService?: NotificationDispatchService,
  ) {}

  async execute(
    campaignId: string,
    actor: CampaignActor,
  ): Promise<NotificationCampaignEntity> {
    const campaign = await this.campaignRepo.findById(campaignId);
    if (!campaign) {
      throw new NotFoundError("Pengumuman/notifikasi tidak ditemukan.");
    }

    NotificationAuthorizationService.assertCanAccessCampaign(campaign, actor);

    campaign.queue();
    const updated = await this.campaignRepo.update(campaign);

    // Avoid duplicate dispatch through both inline execution and outbox.
    if (this.dispatchService) {
      await this.dispatchService.dispatchCampaign(updated);
    } else {
      await this.outboxRepo.enqueue(campaign.id, "DISPATCH_CAMPAIGN");
    }

    return updated;
  }
}
