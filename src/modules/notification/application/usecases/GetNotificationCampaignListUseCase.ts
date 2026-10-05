// Files: src/modules/notification/application/usecases/GetNotificationCampaignListUseCase.ts

import type { NotificationCampaignEntity } from "@/modules/notification/domain/entity/NotificationCampaignEntity";
import type {
  CampaignFilterParams,
  NotificationCampaignRepositoryInterface,
} from "@/modules/notification/domain/interfaces/NotificationCampaignRepositoryInterface";
import {
  type CampaignActor,
  NotificationAuthorizationService,
} from "@/modules/notification/application/services/NotificationAuthorizationService";
import { NotificationOwnerScope } from "@/modules/notification/domain/types/NotificationTypes";
import { AppRole } from "@/core/rbac/AppRole";

export class GetNotificationCampaignListUseCase {
  constructor(private readonly campaignRepo: NotificationCampaignRepositoryInterface) {}

  async execute(
    filter: CampaignFilterParams,
    actor: CampaignActor,
  ): Promise<{ campaigns: NotificationCampaignEntity[]; total: number }> {
    NotificationAuthorizationService.assertCanManageCampaign(actor);

    const scopedFilter: CampaignFilterParams = { ...filter };

    if (actor.role === AppRole.TENANT) {
      scopedFilter.ownerScope = NotificationOwnerScope.TENANT;
      scopedFilter.ownerTenantId = actor.tenantId;
    }

    return this.campaignRepo.findMany(scopedFilter);
  }
}
