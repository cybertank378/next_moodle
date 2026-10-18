// Files: src/modules/notification/application/usecases/ScheduleNotificationCampaignUseCase.ts

import { BaseUseCase } from "@/core/base/BaseUseCase";
import { NotFoundError } from "@/core/errors/NotFoundError";
import {
  type CampaignActor,
  NotificationAuthorizationService,
} from "@/modules/notification/application/services/NotificationAuthorizationService";
import type { ScheduleNotificationCampaignRequestDto } from "@/modules/notification/domain/dto/NotificationCampaignRequestDto";
import type { NotificationCampaignEntity } from "@/modules/notification/domain/entity/NotificationCampaignEntity";
import type { NotificationCampaignRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationCampaignRepositoryInterface";
import type { NotificationOutboxRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationOutboxRepositoryInterface";
import { NotificationSchedule } from "@/modules/notification/domain/value-object/NotificationSchedule";

export interface ScheduleNotificationCampaignInput {
  campaignId: string;
  dto: ScheduleNotificationCampaignRequestDto;
  actor: CampaignActor;
}

export class ScheduleNotificationCampaignUseCase extends BaseUseCase<
  ScheduleNotificationCampaignInput,
  NotificationCampaignEntity
> {
  constructor(
    private readonly campaignRepo: NotificationCampaignRepositoryInterface,
    private readonly outboxRepo: NotificationOutboxRepositoryInterface,
  ) {
    super();
  }

  async handle(
    input: ScheduleNotificationCampaignInput,
  ): Promise<NotificationCampaignEntity> {
    const { campaignId, dto, actor } = input;
    const campaign = await this.campaignRepo.findById(campaignId);
    if (!campaign) {
      throw new NotFoundError("Pengumuman/notifikasi tidak ditemukan.");
    }

    NotificationAuthorizationService.assertCanAccessCampaign(campaign, actor);

    const schedule = NotificationSchedule.create(dto.scheduledAt, dto.timezone);
    if (!schedule.scheduledAt) {
      throw new Error("Tanggal jadwal wajib diisi.");
    }

    campaign.schedule(schedule.scheduledAt, schedule.timezone);

    const updated = await this.campaignRepo.update(campaign);

    // Enqueue outbox job for the scheduled time
    await this.outboxRepo.enqueue(
      campaign.id,
      "DISPATCH_CAMPAIGN",
      { scheduled: true },
      schedule.scheduledAt,
    );

    return updated;
  }

  override execute(
    campaignId: string,
    dto: ScheduleNotificationCampaignRequestDto,
    actor: CampaignActor,
  ): Promise<NotificationCampaignEntity>;
  override execute(
    input: ScheduleNotificationCampaignInput,
  ): Promise<NotificationCampaignEntity>;
  override async execute(
    campaignIdOrInput: string | ScheduleNotificationCampaignInput,
    dto?: ScheduleNotificationCampaignRequestDto,
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

