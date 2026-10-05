// Files: src/modules/notification/application/usecases/CreateNotificationCampaignUseCase.ts

import { NotificationCampaignEntity } from "@/modules/notification/domain/entity/NotificationCampaignEntity";
import type { NotificationCampaignRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationCampaignRepositoryInterface";
import type { NotificationContentRendererInterface } from "@/modules/notification/domain/interfaces/NotificationContentRendererInterface";
import type { CreateNotificationCampaignRequestDto } from "@/modules/notification/domain/dto/NotificationCampaignRequestDto";
import {
  type CampaignActor,
  NotificationAuthorizationService,
} from "@/modules/notification/application/services/NotificationAuthorizationService";
import { NotificationAudience } from "@/modules/notification/domain/value-object/NotificationAudience";
import { NotificationContent } from "@/modules/notification/domain/value-object/NotificationContent";
import { NotificationDispatchStatus } from "@/modules/notification/domain/types/NotificationTypes";

export class CreateNotificationCampaignUseCase {
  constructor(
    private readonly campaignRepo: NotificationCampaignRepositoryInterface,
    private readonly contentRenderer: NotificationContentRendererInterface,
  ) {}

  async execute(
    dto: CreateNotificationCampaignRequestDto,
    actor: CampaignActor,
  ): Promise<NotificationCampaignEntity> {
    const { ownerScope, ownerTenantId } = NotificationAuthorizationService.resolveOwnerScope(actor);

    const sanitizedHtml = this.contentRenderer.renderToSanitizedHtml(dto.contentJson);
    const plainText = this.contentRenderer.extractPlainText(dto.contentJson);

    const validatedContent = NotificationContent.create({
      title: dto.title,
      contentJson: dto.contentJson,
      sanitizedHtml,
      plainText,
      pushSummary: dto.pushSummary,
    });

    const validatedAudience = NotificationAudience.create(
      dto.audienceSpec,
      ownerScope,
      ownerTenantId,
    );

    const campaign = new NotificationCampaignEntity({
      id: crypto.randomUUID(),
      ownerScope,
      ownerTenantId,
      createdById: actor.id,
      createdByRole: actor.role as string,
      title: validatedContent.title,
      contentJson: validatedContent.contentJson,
      contentSchemaVersion: validatedContent.contentSchemaVersion,
      sanitizedHtml: validatedContent.sanitizedHtml,
      plainText: validatedContent.plainText,
      pushSummary: validatedContent.pushSummary,
      audienceSpec: validatedAudience.toSpec(),
      channels: dto.channels,
      dispatchStatus: NotificationDispatchStatus.DRAFT,
      scheduledAt: null,
      timezone: "Asia/Jakarta",
      archivedAt: null,
      version: 1,
    });

    return this.campaignRepo.create(campaign);
  }
}
