// Files: src/modules/notification/application/usecases/ArchiveNotificationCampaignUseCase.ts

import { BaseUseCase } from "@/core/base/BaseUseCase";
import { NotFoundError } from "@/core/errors/NotFoundError";
import {
  type CampaignActor,
  NotificationAuthorizationService,
} from "@/modules/notification/application/services/NotificationAuthorizationService";
import type { NotificationCampaignEntity } from "@/modules/notification/domain/entity/NotificationCampaignEntity";
import type { NotificationCampaignRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationCampaignRepositoryInterface";

export interface ArchiveNotificationCampaignInput {
  campaignId: string;
  actor: CampaignActor;
}

export class ArchiveNotificationCampaignUseCase extends BaseUseCase<
  ArchiveNotificationCampaignInput,
  NotificationCampaignEntity
> {
  constructor(
    private readonly campaignRepo: NotificationCampaignRepositoryInterface,
  ) {
    super();
  }

  async handle(
    input: ArchiveNotificationCampaignInput,
  ): Promise<NotificationCampaignEntity> {
    const campaign = await this.campaignRepo.findById(input.campaignId);
    if (!campaign) {
      throw new NotFoundError("Pengumuman/notifikasi tidak ditemukan.");
    }

    NotificationAuthorizationService.assertCanAccessCampaign(
      campaign,
      input.actor,
    );

    campaign.toggleArchive();

    return this.campaignRepo.update(campaign);
  }

  override execute(
    campaignId: string,
    actor: CampaignActor,
  ): Promise<NotificationCampaignEntity>;
  override execute(
    input: ArchiveNotificationCampaignInput,
  ): Promise<NotificationCampaignEntity>;
  override async execute(
    campaignIdOrInput: string | ArchiveNotificationCampaignInput,
    actor?: CampaignActor,
  ): Promise<NotificationCampaignEntity> {
    if (typeof campaignIdOrInput === "string") {
      return this.handle({ campaignId: campaignIdOrInput, actor: actor! });
    }
    return this.handle(campaignIdOrInput);
  }
}

