// Files: src/modules/notification/domain/dto/NotificationCampaignRequestDto.ts

import type {
  NotificationAudienceSpec,
  NotificationChannel,
} from "@/modules/notification/domain/types/NotificationTypes";

export interface CreateNotificationCampaignRequestDto {
  title: string;
  contentJson: Record<string, unknown>;
  pushSummary?: string | null;
  audienceSpec: NotificationAudienceSpec;
  channels: NotificationChannel[];
}

export interface UpdateNotificationCampaignRequestDto {
  title?: string;
  contentJson?: Record<string, unknown>;
  pushSummary?: string | null;
  audienceSpec?: NotificationAudienceSpec;
  channels?: NotificationChannel[];
}

export interface ScheduleNotificationCampaignRequestDto {
  scheduledAt: string;
  timezone?: string;
}

export interface AudiencePreviewRequestDto {
  audienceSpec: NotificationAudienceSpec;
}

export interface DeviceRegistrationRequestDto {
  token: string;
  platform?: string;
}
