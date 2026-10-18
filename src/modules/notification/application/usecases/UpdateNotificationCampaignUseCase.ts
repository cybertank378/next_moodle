// Files: src/modules/notification/application/usecases/UpdateNotificationCampaignUseCase.ts

import { BaseUseCase } from "@/core/base/BaseUseCase";
import { NotFoundError } from "@/core/errors/NotFoundError";
import {
  type CampaignActor,
  NotificationAuthorizationService,
} from "@/modules/notification/application/services/NotificationAuthorizationService";
import type { UpdateNotificationCampaignRequestDto } from "@/modules/notification/domain/dto/NotificationCampaignRequestDto";
import type { NotificationCampaignEntity } from "@/modules/notification/domain/entity/NotificationCampaignEntity";
import type { NotificationCampaignRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationCampaignRepositoryInterface";
import type { NotificationContentRendererInterface } from "@/modules/notification/domain/interfaces/NotificationContentRendererInterface";
import { NotificationAudience } from "@/modules/notification/domain/value-object/NotificationAudience";
import { NotificationContent } from "@/modules/notification/domain/value-object/NotificationContent";

export interface UpdateNotificationCampaignInput {
  campaignId: string;
  dto: UpdateNotificationCampaignRequestDto;
  actor: CampaignActor;
}

export class UpdateNotificationCampaignUseCase extends BaseUseCase<
  UpdateNotificationCampaignInput,
  NotificationCampaignEntity
> {
  constructor(
    private readonly campaignRepo: NotificationCampaignRepositoryInterface,
    private readonly contentRenderer: NotificationContentRendererInterface,
  ) {
    super();
  }

  async handle(
    input: UpdateNotificationCampaignInput,
  ): Promise<NotificationCampaignEntity> {
    const { campaignId, dto, actor } = input;
    const campaign = await this.campaignRepo.findById(campaignId);
    if (!campaign) {
      throw new NotFoundError("Pengumuman/notifikasi tidak ditemukan.");
    }

    NotificationAuthorizationService.assertCanAccessCampaign(campaign, actor);

    let sanitizedHtml = campaign.sanitizedHtml;
    let plainText = campaign.plainText;
    const contentJson = dto.contentJson || campaign.contentJson;

    if (dto.contentJson) {
      sanitizedHtml = this.contentRenderer.renderToSanitizedHtml(
        dto.contentJson,
      );
      plainText = this.contentRenderer.extractPlainText(dto.contentJson);
    }

    const validatedContent = NotificationContent.create({
      title: dto.title ?? campaign.title,
      contentJson,
      sanitizedHtml,
      plainText,
      pushSummary:
        dto.pushSummary !== undefined ? dto.pushSummary : campaign.pushSummary,
    });

    let audienceSpec = campaign.audienceSpec;
    if (dto.audienceSpec) {
      const validatedAudience = NotificationAudience.create(
        dto.audienceSpec,
        campaign.ownerScope,
        campaign.ownerTenantId,
      );
      audienceSpec = validatedAudience.toSpec();
    }

    campaign.updateContent({
      title: validatedContent.title,
      contentJson: validatedContent.contentJson,
      sanitizedHtml: validatedContent.sanitizedHtml,
      plainText: validatedContent.plainText,
      pushSummary: validatedContent.pushSummary,
      audienceSpec,
      channels: dto.channels,
    });

    return this.campaignRepo.update(campaign);
  }

  override execute(
    campaignId: string,
    dto: UpdateNotificationCampaignRequestDto,
    actor: CampaignActor,
  ): Promise<NotificationCampaignEntity>;
  override execute(
    input: UpdateNotificationCampaignInput,
  ): Promise<NotificationCampaignEntity>;
  override async execute(
    campaignIdOrInput: string | UpdateNotificationCampaignInput,
    dto?: UpdateNotificationCampaignRequestDto,
    actor?: CampaignActor,
  ): Promise<NotificationCampaignEntity> {
    if (typeof campaignIdOrInput === "string") {
      return this.handle({
        campaignId: campaignIdOrInput,
        dto: dto!,
        actor: actor!,
      });
    }
    return this.handle(campaignIdOrInput);
  }
}

