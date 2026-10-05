// Files: src/modules/notification/domain/dto/NotificationCampaignResponseDto.ts

import type {
  NotificationAudienceSpec,
  NotificationChannel,
  NotificationDeliveryStatus,
  NotificationDeliverySummary,
  NotificationDispatchStatus,
  NotificationOwnerScope,
} from "@/modules/notification/domain/types/NotificationTypes";

export interface NotificationCampaignResponseDto {
  id: string;
  ownerScope: NotificationOwnerScope;
  ownerTenantId: string | null;
  createdById: string;
  createdByRole: string;
  title: string;
  contentJson: Record<string, unknown>;
  sanitizedHtml: string;
  plainText: string;
  pushSummary: string | null;
  audienceSpec: NotificationAudienceSpec;
  channels: NotificationChannel[];
  dispatchStatus: NotificationDispatchStatus;
  scheduledAt: string | null;
  timezone: string | null;
  archivedAt: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
  summary?: NotificationDeliverySummary;
}

export interface NotificationDeliveryItemDto {
  id: string;
  recipientId: string;
  recipientRole: string;
  tenantId: string | null;
  channel: NotificationChannel;
  status: NotificationDeliveryStatus;
  attempts: number;
  errorCode: string | null;
  acceptedAt: string | null;
  createdAt: string;
}

export interface NotificationAudiencePreviewResponseDto {
  estimatedCount: number;
  audienceSpec: NotificationAudienceSpec;
  sampleRecipients?: Array<{
    recipientId: string;
    role: string;
    name?: string;
  }>;
}

export interface NotificationRecipientOptionsResponseDto {
  roles: Array<{ role: string; label: string; count?: number }>;
  tenants?: Array<{ id: string; name: string }>;
}
