// Files: src/modules/notification/domain/interfaces/NotificationCampaignRepositoryInterface.ts

import type { NotificationCampaignEntity } from "@/modules/notification/domain/entity/NotificationCampaignEntity";
import type {
  NotificationChannel,
  NotificationDispatchStatus,
  NotificationOwnerScope,
} from "@/modules/notification/domain/types/NotificationTypes";

export interface CampaignFilterParams {
  ownerScope?: NotificationOwnerScope;
  ownerTenantId?: string | null;
  dispatchStatus?: NotificationDispatchStatus;
  channel?: NotificationChannel;
  search?: string;
  isArchived?: boolean;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "title" | "scheduledAt" | "dispatchStatus";
  sortOrder?: "asc" | "desc";
}

export interface NotificationCampaignRepositoryInterface {
  create(campaign: NotificationCampaignEntity): Promise<NotificationCampaignEntity>;
  findById(id: string): Promise<NotificationCampaignEntity | null>;
  update(campaign: NotificationCampaignEntity): Promise<NotificationCampaignEntity>;
  deleteDraft(id: string): Promise<void>;
  findMany(filter: CampaignFilterParams): Promise<{
    campaigns: NotificationCampaignEntity[];
    total: number;
  }>;
}
