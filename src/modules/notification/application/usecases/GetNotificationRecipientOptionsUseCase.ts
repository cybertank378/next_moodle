// Files: src/modules/notification/application/usecases/GetNotificationRecipientOptionsUseCase.ts

import { BaseUseCase } from "@/core/base/BaseUseCase";
import {
  type CampaignActor,
  NotificationAuthorizationService,
} from "@/modules/notification/application/services/NotificationAuthorizationService";
import type { NotificationRecipientOptionsResponseDto } from "@/modules/notification/domain/dto/NotificationCampaignResponseDto";
import type { NotificationRecipientProviderInterface } from "@/modules/notification/domain/interfaces/NotificationRecipientProviderInterface";

export interface GetNotificationRecipientOptionsInput {
  actor: CampaignActor;
}

export class GetNotificationRecipientOptionsUseCase extends BaseUseCase<
  GetNotificationRecipientOptionsInput,
  NotificationRecipientOptionsResponseDto
> {
  constructor(
    private readonly recipientProvider: NotificationRecipientProviderInterface,
  ) {
    super();
  }

  async handle(
    input: GetNotificationRecipientOptionsInput,
  ): Promise<NotificationRecipientOptionsResponseDto> {
    const { ownerScope, ownerTenantId } =
      NotificationAuthorizationService.resolveOwnerScope(input.actor);
    return this.recipientProvider.getRecipientOptions(
      ownerScope,
      ownerTenantId,
    );
  }

  override execute(
    actor: CampaignActor,
  ): Promise<NotificationRecipientOptionsResponseDto>;
  override execute(
    input: GetNotificationRecipientOptionsInput,
  ): Promise<NotificationRecipientOptionsResponseDto>;
  override async execute(
    actorOrInput: CampaignActor | GetNotificationRecipientOptionsInput,
  ): Promise<NotificationRecipientOptionsResponseDto> {
    if ("actor" in actorOrInput) {
      return this.handle(actorOrInput as GetNotificationRecipientOptionsInput);
    }
    return this.handle({ actor: actorOrInput as CampaignActor });
  }
}

