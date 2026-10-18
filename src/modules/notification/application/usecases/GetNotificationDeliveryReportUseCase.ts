// Files: src/modules/notification/application/usecases/GetNotificationDeliveryReportUseCase.ts

import { BaseUseCase } from "@/core/base/BaseUseCase";
import { NotFoundError } from "@/core/errors/NotFoundError";
import {
  type CampaignActor,
  NotificationAuthorizationService,
} from "@/modules/notification/application/services/NotificationAuthorizationService";
import type { NotificationDeliveryEntity } from "@/modules/notification/domain/entity/NotificationDeliveryEntity";
import type { NotificationCampaignRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationCampaignRepositoryInterface";
import type { NotificationDeliveryRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationDeliveryRepositoryInterface";
import type { NotificationDeliverySummary } from "@/modules/notification/domain/types/NotificationTypes";

export interface GetNotificationDeliveryReportInput {
  campaignId: string;
  actor: CampaignActor;
  pagination?: { page: number; limit: number };
}

export interface GetNotificationDeliveryReportOutput {
  deliveries: NotificationDeliveryEntity[];
  total: number;
  summary: NotificationDeliverySummary;
}

export class GetNotificationDeliveryReportUseCase extends BaseUseCase<
  GetNotificationDeliveryReportInput,
  GetNotificationDeliveryReportOutput
> {
  constructor(
    private readonly campaignRepo: NotificationCampaignRepositoryInterface,
    private readonly deliveryRepo: NotificationDeliveryRepositoryInterface,
  ) {
    super();
  }

  async handle(
    input: GetNotificationDeliveryReportInput,
  ): Promise<GetNotificationDeliveryReportOutput> {
    const campaign = await this.campaignRepo.findById(input.campaignId);
    if (!campaign) {
      throw new NotFoundError("Pengumuman/notifikasi tidak ditemukan.");
    }

    NotificationAuthorizationService.assertCanAccessCampaign(
      campaign,
      input.actor,
    );

    const { deliveries, total } = await this.deliveryRepo.findByCampaignId(
      input.campaignId,
      input.pagination,
    );
    const summary = await this.deliveryRepo.getDeliverySummary(
      input.campaignId,
    );

    return { deliveries, total, summary };
  }

  override execute(
    campaignId: string,
    actor: CampaignActor,
    pagination?: { page: number; limit: number },
  ): Promise<GetNotificationDeliveryReportOutput>;
  override execute(
    input: GetNotificationDeliveryReportInput,
  ): Promise<GetNotificationDeliveryReportOutput>;
  override async execute(
    campaignIdOrInput: string | GetNotificationDeliveryReportInput,
    actor?: CampaignActor,
    pagination?: { page: number; limit: number },
  ): Promise<GetNotificationDeliveryReportOutput> {
    if (typeof campaignIdOrInput === "string") {
      return this.handle({
        campaignId: campaignIdOrInput,
        actor: actor!,
        pagination,
      });
    }
    return this.handle(campaignIdOrInput);
  }
}

