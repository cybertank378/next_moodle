// Files: src/modules/notification/application/usecases/GetNotificationDeliveryReportUseCase.ts

import { NotFoundError } from "@/core/errors/NotFoundError";
import {
  type CampaignActor,
  NotificationAuthorizationService,
} from "@/modules/notification/application/services/NotificationAuthorizationService";
import type { NotificationDeliveryEntity } from "@/modules/notification/domain/entity/NotificationDeliveryEntity";
import type { NotificationCampaignRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationCampaignRepositoryInterface";
import type { NotificationDeliveryRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationDeliveryRepositoryInterface";
import type { NotificationDeliverySummary } from "@/modules/notification/domain/types/NotificationTypes";

export class GetNotificationDeliveryReportUseCase {
  constructor(
    private readonly campaignRepo: NotificationCampaignRepositoryInterface,
    private readonly deliveryRepo: NotificationDeliveryRepositoryInterface,
  ) {}

  async execute(
    campaignId: string,
    actor: CampaignActor,
    pagination?: { page: number; limit: number },
  ): Promise<{
    deliveries: NotificationDeliveryEntity[];
    total: number;
    summary: NotificationDeliverySummary;
  }> {
    const campaign = await this.campaignRepo.findById(campaignId);
    if (!campaign) {
      throw new NotFoundError("Pengumuman/notifikasi tidak ditemukan.");
    }

    NotificationAuthorizationService.assertCanAccessCampaign(campaign, actor);

    const { deliveries, total } = await this.deliveryRepo.findByCampaignId(
      campaignId,
      pagination,
    );
    const summary = await this.deliveryRepo.getDeliverySummary(campaignId);

    return { deliveries, total, summary };
  }
}
