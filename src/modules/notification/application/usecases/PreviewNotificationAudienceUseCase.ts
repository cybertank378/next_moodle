// Files: src/modules/notification/application/usecases/PreviewNotificationAudienceUseCase.ts

import {
  type CampaignActor,
  NotificationAuthorizationService,
} from "@/modules/notification/application/services/NotificationAuthorizationService";
import type { AudiencePreviewRequestDto } from "@/modules/notification/domain/dto/NotificationCampaignRequestDto";
import type { NotificationAudiencePreviewResponseDto } from "@/modules/notification/domain/dto/NotificationCampaignResponseDto";
import type { NotificationRecipientProviderInterface } from "@/modules/notification/domain/interfaces/NotificationRecipientProviderInterface";
import { NotificationAudience } from "@/modules/notification/domain/value-object/NotificationAudience";

export class PreviewNotificationAudienceUseCase {
  constructor(
    private readonly recipientProvider: NotificationRecipientProviderInterface,
  ) {}

  async execute(
    dto: AudiencePreviewRequestDto,
    actor: CampaignActor,
  ): Promise<NotificationAudiencePreviewResponseDto> {
    const { ownerScope, ownerTenantId } =
      NotificationAuthorizationService.resolveOwnerScope(actor);

    const validatedAudience = NotificationAudience.create(
      dto.audienceSpec,
      ownerScope,
      ownerTenantId,
    );

    const count = await this.recipientProvider.getAudienceCount(
      validatedAudience.toSpec(),
      ownerScope,
      ownerTenantId,
    );

    const recipients = await this.recipientProvider.resolveRecipients(
      validatedAudience.toSpec(),
      ownerScope,
      ownerTenantId,
    );

    return {
      estimatedCount: count,
      audienceSpec: validatedAudience.toSpec(),
      sampleRecipients: recipients.slice(0, 5).map((r) => ({
        recipientId: r.recipientId,
        role: r.role,
        name: r.name,
      })),
    };
  }
}
