// Files: src/modules/notification/application/usecases/GetNotificationRecipientOptionsUseCase.ts

import type { NotificationRecipientProviderInterface } from "@/modules/notification/domain/interfaces/NotificationRecipientProviderInterface";
import type { NotificationRecipientOptionsResponseDto } from "@/modules/notification/domain/dto/NotificationCampaignResponseDto";
import {
  type CampaignActor,
  NotificationAuthorizationService,
} from "@/modules/notification/application/services/NotificationAuthorizationService";

export class GetNotificationRecipientOptionsUseCase {
  constructor(private readonly recipientProvider: NotificationRecipientProviderInterface) {}

  async execute(actor: CampaignActor): Promise<NotificationRecipientOptionsResponseDto> {
    const { ownerScope, ownerTenantId } = NotificationAuthorizationService.resolveOwnerScope(actor);
    return this.recipientProvider.getRecipientOptions(ownerScope, ownerTenantId);
  }
}
