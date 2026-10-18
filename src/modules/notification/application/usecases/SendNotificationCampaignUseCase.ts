// Files: src/modules/notification/application/usecases/SendNotificationCampaignUseCase.ts

import { BaseUseCase } from "@/core/base/BaseUseCase";
import { NotFoundError } from "@/core/errors/NotFoundError";
import {
  type CampaignActor,
  NotificationAuthorizationService,
} from "@/modules/notification/application/services/NotificationAuthorizationService";
import type { NotificationCampaignEntity } from "@/modules/notification/domain/entity/NotificationCampaignEntity";
import type { NotificationCampaignRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationCampaignRepositoryInterface";
import type { NotificationOutboxRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationOutboxRepositoryInterface";

export interface SendNotificationCampaignInput {
  campaignId: string;
  actor: CampaignActor;
}

export class SendNotificationCampaignUseCase extends BaseUseCase<
  SendNotificationCampaignInput,
  NotificationCampaignEntity
> {
  constructor(
    private readonly campaignRepo: NotificationCampaignRepositoryInterface,
    private readonly outboxRepo: NotificationOutboxRepositoryInterface,
  ) {
    super();
  }

  async handle(
    input: SendNotificationCampaignInput,
  ): Promise<NotificationCampaignEntity> {
    const campaign = await this.campaignRepo.findById(input.campaignId);
    if (!campaign) {
      throw new NotFoundError("Pengumuman/notifikasi tidak ditemukan.");
    }

    NotificationAuthorizationService.assertCanAccessCampaign(
      campaign,
      input.actor,
    );

    campaign.queue();
    const updated = await this.campaignRepo.update(campaign);

    // Always queue: campaign delivery must not depend on the HTTP request lifetime.
    await this.outboxRepo.enqueue(campaign.id, "DISPATCH_CAMPAIGN");

    return updated;
  }

  override execute(
    campaignId: string,
    actor: CampaignActor,
  ): Promise<NotificationCampaignEntity>;
  override execute(
    input: SendNotificationCampaignInput,
  ): Promise<NotificationCampaignEntity>;
  override async execute(
    campaignIdOrInput: string | SendNotificationCampaignInput,
    actor?: CampaignActor,
  ): Promise<NotificationCampaignEntity> {
    if (typeof campaignIdOrInput === "string") {
      return this.handle({ campaignId: campaignIdOrInput, actor: actor! });
    }
    return this.handle(campaignIdOrInput);
  }
}

