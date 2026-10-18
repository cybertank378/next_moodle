// Files: src/modules/notification/application/usecases/GetNotificationCampaignListUseCase.ts

import { BaseUseCase } from "@/core/base/BaseUseCase";
import { AppRole } from "@/core/rbac/AppRole";
import {
  type CampaignActor,
  NotificationAuthorizationService,
} from "@/modules/notification/application/services/NotificationAuthorizationService";
import type { NotificationCampaignEntity } from "@/modules/notification/domain/entity/NotificationCampaignEntity";
import type {
  CampaignFilterParams,
  CampaignSummaryStats,
  NotificationCampaignRepositoryInterface,
} from "@/modules/notification/domain/interfaces/NotificationCampaignRepositoryInterface";
import { NotificationOwnerScope } from "@/modules/notification/domain/types/NotificationTypes";

export interface GetNotificationCampaignListInput {
  filter: CampaignFilterParams;
  actor: CampaignActor;
}

export interface GetNotificationCampaignListOutput {
  campaigns: NotificationCampaignEntity[];
  total: number;
  summary?: CampaignSummaryStats;
}

export class GetNotificationCampaignListUseCase extends BaseUseCase<
  GetNotificationCampaignListInput,
  GetNotificationCampaignListOutput
> {
  constructor(
    private readonly campaignRepo: NotificationCampaignRepositoryInterface,
  ) {
    super();
  }

  async handle(
    input: GetNotificationCampaignListInput,
  ): Promise<GetNotificationCampaignListOutput> {
    const { filter, actor } = input;
    NotificationAuthorizationService.assertCanManageCampaign(actor);

    const scopedFilter: CampaignFilterParams = { ...filter };

    if (actor.role === AppRole.TENANT) {
      scopedFilter.ownerScope = NotificationOwnerScope.TENANT;
      scopedFilter.ownerTenantId = actor.tenantId;
    }

    return this.campaignRepo.findMany(scopedFilter);
  }

  override execute(
    filter: CampaignFilterParams,
    actor: CampaignActor,
  ): Promise<GetNotificationCampaignListOutput>;
  override execute(
    input: GetNotificationCampaignListInput,
  ): Promise<GetNotificationCampaignListOutput>;
  override async execute(
    filterOrInput: CampaignFilterParams | GetNotificationCampaignListInput,
    actor?: CampaignActor,
  ): Promise<GetNotificationCampaignListOutput> {
    if ("filter" in filterOrInput && "actor" in filterOrInput) {
      return this.handle(filterOrInput as GetNotificationCampaignListInput);
    }
    return this.handle({
      filter: filterOrInput as CampaignFilterParams,
      actor: actor!,
    });
  }
}

