// Files: src/modules/notification/infrastructure/repo/PrismaNotificationDeliveryRepository.ts

import { prisma } from "@/libs/prisma";
import type { NotificationDeliveryEntity } from "@/modules/notification/domain/entity/NotificationDeliveryEntity";
import type { NotificationDeliveryRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationDeliveryRepositoryInterface";
import { NotificationCampaignMapper } from "@/modules/notification/domain/mapper/NotificationCampaignMapper";
import {
  NotificationChannel,
  NotificationDeliveryStatus,
  type NotificationDeliverySummary,
} from "@/modules/notification/domain/types/NotificationTypes";

export class PrismaNotificationDeliveryRepository
  implements NotificationDeliveryRepositoryInterface
{
  async createMany(deliveries: NotificationDeliveryEntity[]): Promise<void> {
    if (deliveries.length === 0) return;

    await prisma.notificationDelivery.createMany({
      data: deliveries.map((d) => ({
        id: d.id,
        campaignId: d.campaignId,
        recipientId: d.recipientId,
        recipientRole: d.recipientRole,
        tenantId: d.tenantId,
        channel: d.channel,
        deviceToken: d.deviceToken,
        status: d.status,
        attempts: d.attempts,
        nextAttemptAt: d.nextAttemptAt,
        providerMessageId: d.providerMessageId,
        errorCode: d.errorCode,
        acceptedAt: d.acceptedAt,
      })),
    });
  }

  async findByCampaignId(
    campaignId: string,
    pagination?: { page: number; limit: number },
  ): Promise<{ deliveries: NotificationDeliveryEntity[]; total: number }> {
    const page = Math.max(1, pagination?.page ?? 1);
    const limit = Math.min(100, Math.max(1, pagination?.limit ?? 20));
    const skip = (page - 1) * limit;

    const [rows, total] = await Promise.all([
      prisma.notificationDelivery.findMany({
        where: { campaignId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.notificationDelivery.count({ where: { campaignId } }),
    ]);

    return {
      deliveries: rows.map(NotificationCampaignMapper.toDeliveryEntity),
      total,
    };
  }

  async updateStatus(
    id: string,
    status: NotificationDeliveryStatus,
    details?: {
      providerMessageId?: string;
      errorCode?: string;
      nextAttemptAt?: Date | null;
      acceptedAt?: Date | null;
    },
  ): Promise<void> {
    await prisma.notificationDelivery.update({
      where: { id },
      data: {
        status,
        providerMessageId: details?.providerMessageId,
        errorCode: details?.errorCode,
        nextAttemptAt: details?.nextAttemptAt,
        attempts: { increment: 1 },
        acceptedAt:
          details?.acceptedAt !== undefined
            ? (details.acceptedAt ?? undefined)
            : status === NotificationDeliveryStatus.ACCEPTED
              ? new Date()
              : undefined,
      },
    });
  }

  async getDeliverySummary(campaignId: string): Promise<NotificationDeliverySummary> {
    const rows = await prisma.notificationDelivery.groupBy({
      by: ["channel", "status"],
      where: { campaignId },
      _count: { id: true },
    });

    let total = 0;
    let inboxCreated = 0;
    let pushAccepted = 0;
    let pushFailed = 0;
    let pushSkipped = 0;
    let pending = 0;

    for (const row of rows) {
      const count = row._count.id;
      total += count;

      if (row.channel === NotificationChannel.IN_APP) {
        if (row.status === NotificationDeliveryStatus.ACCEPTED) {
          inboxCreated += count;
        }
      } else if (row.channel === NotificationChannel.PUSH) {
        if (row.status === NotificationDeliveryStatus.ACCEPTED) {
          pushAccepted += count;
        } else if (row.status === NotificationDeliveryStatus.FAILED) {
          pushFailed += count;
        } else if (row.status === NotificationDeliveryStatus.SKIPPED) {
          pushSkipped += count;
        } else if (row.status === NotificationDeliveryStatus.PENDING) {
          pending += count;
        }
      }
    }

    return {
      total,
      inboxCreated,
      pushAccepted,
      pushFailed,
      pushSkipped,
      pending,
    };
  }

  async findEligibleForRetry(campaignId: string): Promise<NotificationDeliveryEntity[]> {
    const rows = await prisma.notificationDelivery.findMany({
      where: {
        campaignId,
        status: NotificationDeliveryStatus.FAILED,
        attempts: { lt: 3 },
      },
    });

    return rows.map(NotificationCampaignMapper.toDeliveryEntity);
  }
}
