// Files: src/modules/notification/application/usecases/DeleteNotificationDraftUseCase.ts

import { BaseUseCase } from "@/core/base/BaseUseCase";
import { NotFoundError } from "@/core/errors/NotFoundError";
import { ValidationError } from "@/core/errors/ValidationError";
import {
  type CampaignActor,
  NotificationAuthorizationService,
} from "@/modules/notification/application/services/NotificationAuthorizationService";
import type { NotificationCampaignRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationCampaignRepositoryInterface";

export interface DeleteNotificationDraftInput {
  campaignId: string;
  actor: CampaignActor;
}

export class DeleteNotificationDraftUseCase extends BaseUseCase<
  DeleteNotificationDraftInput,
  void
> {
  constructor(
    private readonly campaignRepo: NotificationCampaignRepositoryInterface,
  ) {
    super();
  }

  async handle(input: DeleteNotificationDraftInput): Promise<void> {
    const campaign = await this.campaignRepo.findById(input.campaignId);
    if (!campaign) {
      throw new NotFoundError("Pengumuman/notifikasi tidak ditemukan.");
    }

    NotificationAuthorizationService.assertCanAccessCampaign(
      campaign,
      input.actor,
    );

    if (!campaign.canDelete) {
      throw new ValidationError("Hanya draft yang dapat dihapus.");
    }

    await this.campaignRepo.deleteDraft(input.campaignId);
  }

  override execute(campaignId: string, actor: CampaignActor): Promise<void>;
  override execute(input: DeleteNotificationDraftInput): Promise<void>;
  override async execute(
    campaignIdOrInput: string | DeleteNotificationDraftInput,
    actor?: CampaignActor,
  ): Promise<void> {
    if (typeof campaignIdOrInput === "string") {
      return this.handle({ campaignId: campaignIdOrInput, actor: actor! });
    }
    return this.handle(campaignIdOrInput);
  }
}

