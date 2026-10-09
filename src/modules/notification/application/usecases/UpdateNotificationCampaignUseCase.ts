// Files: src/modules/notification/application/usecases/UpdateNotificationCampaignUseCase.ts

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

export class UpdateNotificationCampaignUseCase {
  constructor(
    private readonly campaignRepo: NotificationCampaignRepositoryInterface,
    private readonly contentRenderer: NotificationContentRendererInterface,
  ) {}

  async execute(
    campaignId: string,
    dto: UpdateNotificationCampaignRequestDto,
    actor: CampaignActor,
  ): Promise<NotificationCampaignEntity> {
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
}
