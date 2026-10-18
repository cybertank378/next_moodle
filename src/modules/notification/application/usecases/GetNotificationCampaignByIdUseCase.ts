// Files: src/modules/notification/application/usecases/GetNotificationCampaignByIdUseCase.ts

import { BaseUseCase } from "@/core/base/BaseUseCase";
import { NotFoundError } from "@/core/errors/NotFoundError";
import {
  type CampaignActor,
  NotificationAuthorizationService,
} from "@/modules/notification/application/services/NotificationAuthorizationService";
import type { NotificationCampaignEntity } from "@/modules/notification/domain/entity/NotificationCampaignEntity";
import type { NotificationCampaignRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationCampaignRepositoryInterface";
import type { NotificationDeliveryRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationDeliveryRepositoryInterface";
import type { NotificationDeliverySummary } from "@/modules/notification/domain/types/NotificationTypes";

export interface GetNotificationCampaignByIdInput {
  campaignId: string;
  actor: CampaignActor;
}

export interface GetNotificationCampaignByIdOutput {
  campaign: NotificationCampaignEntity;
  summary: NotificationDeliverySummary;
}

export class GetNotificationCampaignByIdUseCase extends BaseUseCase<
  GetNotificationCampaignByIdInput,
  GetNotificationCampaignByIdOutput
> {
  constructor(
    private readonly campaignRepo: NotificationCampaignRepositoryInterface,
    private readonly deliveryRepo: NotificationDeliveryRepositoryInterface,
  ) {
    super();
  }

  async handle(
    input: GetNotificationCampaignByIdInput,
  ): Promise<GetNotificationCampaignByIdOutput> {
    const campaign = await this.campaignRepo.findById(input.campaignId);
    if (!campaign) {
      throw new NotFoundError("Pengumuman/notifikasi tidak ditemukan.");
    }

    NotificationAuthorizationService.assertCanAccessCampaign(
      campaign,
      input.actor,
    );

    const summary = await this.deliveryRepo.getDeliverySummary(
      input.campaignId,
    );

    return { campaign, summary };
  }

  override execute(
    campaignId: string,
    actor: CampaignActor,
  ): Promise<GetNotificationCampaignByIdOutput>;
  override execute(
    input: GetNotificationCampaignByIdInput,
  ): Promise<GetNotificationCampaignByIdOutput>;
  override async execute(
    campaignIdOrInput: string | GetNotificationCampaignByIdInput,
    actor?: CampaignActor,
  ): Promise<GetNotificationCampaignByIdOutput> {
    if (typeof campaignIdOrInput === "string") {
      return this.handle({ campaignId: campaignIdOrInput, actor: actor! });
    }
    return this.handle(campaignIdOrInput);
  }
}

