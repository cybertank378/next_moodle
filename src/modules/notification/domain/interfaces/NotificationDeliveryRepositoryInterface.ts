// Files: src/modules/notification/domain/interfaces/NotificationDeliveryRepositoryInterface.ts

import type { NotificationDeliveryEntity } from "@/modules/notification/domain/entity/NotificationDeliveryEntity";
import type {
  NotificationDeliveryStatus,
  NotificationDeliverySummary,
} from "@/modules/notification/domain/types/NotificationTypes";

export interface NotificationDeliveryRepositoryInterface {
  createMany(deliveries: NotificationDeliveryEntity[]): Promise<void>;
  findByCampaignId(
    campaignId: string,
    pagination?: { page: number; limit: number },
  ): Promise<{ deliveries: NotificationDeliveryEntity[]; total: number }>;
  updateStatus(
    id: string,
    status: NotificationDeliveryStatus,
    details?: {
      providerMessageId?: string;
      errorCode?: string;
      nextAttemptAt?: Date | null;
      acceptedAt?: Date | null;
    },
  ): Promise<void>;
  getDeliverySummary(campaignId: string): Promise<NotificationDeliverySummary>;
  findEligibleForRetry(
    campaignId: string,
  ): Promise<NotificationDeliveryEntity[]>;
}
