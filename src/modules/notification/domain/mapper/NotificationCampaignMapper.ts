// Files: src/modules/notification/domain/mapper/NotificationCampaignMapper.ts

import type {
  NotificationCampaignResponseDto,
  NotificationDeliveryItemDto,
} from "@/modules/notification/domain/dto/NotificationCampaignResponseDto";
import { NotificationCampaignEntity } from "@/modules/notification/domain/entity/NotificationCampaignEntity";
import { NotificationDeliveryEntity } from "@/modules/notification/domain/entity/NotificationDeliveryEntity";
import {
  NotificationAudienceScope,
  type NotificationAudienceSpec,
  type NotificationChannel,
  type NotificationDeliveryStatus,
  type NotificationDeliverySummary,
  type NotificationDispatchStatus,
  type NotificationOwnerScope,
} from "@/modules/notification/domain/types/NotificationTypes";

export class NotificationCampaignMapper {
  static toEntity(raw: {
    id: string;
    ownerScope: string;
    ownerTenantId: string | null;
    createdById: string;
    createdByRole: string;
    title: string;
    contentJson: unknown;
    contentSchemaVersion: number;
    sanitizedHtml: string;
    plainText: string;
    pushSummary: string | null;
    audienceSpec: unknown;
    channels: string[];
    dispatchStatus: string;
    scheduledAt: Date | null;
    timezone: string | null;
    archivedAt: Date | null;
    version: number;
    createdAt: Date;
    updatedAt: Date;
  }): NotificationCampaignEntity {
    return new NotificationCampaignEntity({
      id: raw.id,
      ownerScope: raw.ownerScope as NotificationOwnerScope,
      ownerTenantId: raw.ownerTenantId,
      createdById: raw.createdById,
      createdByRole: raw.createdByRole,
      title: raw.title,
      contentJson: (raw.contentJson as Record<string, unknown>) || {},
      contentSchemaVersion: raw.contentSchemaVersion,
      sanitizedHtml: raw.sanitizedHtml,
      plainText: raw.plainText,
      pushSummary: raw.pushSummary,
      audienceSpec: (raw.audienceSpec as NotificationAudienceSpec) || {
        scope: NotificationAudienceScope.ALL,
      },
      channels: raw.channels.map((c) => c as NotificationChannel),
      dispatchStatus: raw.dispatchStatus as NotificationDispatchStatus,
      scheduledAt: raw.scheduledAt,
      timezone: raw.timezone,
      archivedAt: raw.archivedAt,
      version: raw.version,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toResponseDto(
    entity: NotificationCampaignEntity,
    summary?: NotificationDeliverySummary,
  ): NotificationCampaignResponseDto {
    return {
      id: entity.id,
      ownerScope: entity.ownerScope,
      ownerTenantId: entity.ownerTenantId,
      createdById: entity.createdById,
      createdByRole: entity.createdByRole,
      title: entity.title,
      contentJson: entity.contentJson,
      sanitizedHtml: entity.sanitizedHtml,
      plainText: entity.plainText,
      pushSummary: entity.pushSummary,
      audienceSpec: entity.audienceSpec,
      channels: entity.channels,
      dispatchStatus: entity.dispatchStatus,
      scheduledAt: entity.scheduledAt ? entity.scheduledAt.toISOString() : null,
      timezone: entity.timezone,
      archivedAt: entity.archivedAt ? entity.archivedAt.toISOString() : null,
      version: entity.version,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
      summary,
    };
  }

  static toDeliveryEntity(raw: {
    id: string;
    campaignId: string;
    recipientId: string;
    recipientRole: string;
    tenantId: string | null;
    channel: string;
    deviceToken: string | null;
    status: string;
    attempts: number;
    nextAttemptAt: Date | null;
    providerMessageId: string | null;
    errorCode: string | null;
    acceptedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): NotificationDeliveryEntity {
    return new NotificationDeliveryEntity({
      id: raw.id,
      campaignId: raw.campaignId,
      recipientId: raw.recipientId,
      recipientRole: raw.recipientRole,
      tenantId: raw.tenantId,
      channel: raw.channel as NotificationChannel,
      deviceToken: raw.deviceToken,
      status: raw.status as NotificationDeliveryStatus,
      attempts: raw.attempts,
      nextAttemptAt: raw.nextAttemptAt,
      providerMessageId: raw.providerMessageId,
      errorCode: raw.errorCode,
      acceptedAt: raw.acceptedAt,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toDeliveryDto(
    entity: NotificationDeliveryEntity,
  ): NotificationDeliveryItemDto {
    return {
      id: entity.id,
      recipientId: entity.recipientId,
      recipientRole: entity.recipientRole,
      tenantId: entity.tenantId,
      channel: entity.channel,
      status: entity.status,
      attempts: entity.attempts,
      errorCode: entity.errorCode,
      acceptedAt: entity.acceptedAt ? entity.acceptedAt.toISOString() : null,
      createdAt: entity.createdAt.toISOString(),
    };
  }
}
