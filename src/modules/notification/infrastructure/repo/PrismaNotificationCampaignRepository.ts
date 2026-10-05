// Files: src/modules/notification/infrastructure/repo/PrismaNotificationCampaignRepository.ts

import { prisma } from "@/libs/prisma";
import type { NotificationCampaignEntity } from "@/modules/notification/domain/entity/NotificationCampaignEntity";
import type {
  CampaignFilterParams,
  NotificationCampaignRepositoryInterface,
} from "@/modules/notification/domain/interfaces/NotificationCampaignRepositoryInterface";
import { NotificationCampaignMapper } from "@/modules/notification/domain/mapper/NotificationCampaignMapper";
import type { Prisma } from "@prisma/client";

export class PrismaNotificationCampaignRepository
  implements NotificationCampaignRepositoryInterface
{
  async create(campaign: NotificationCampaignEntity): Promise<NotificationCampaignEntity> {
    const created = await prisma.notificationCampaign.create({
      data: {
        id: campaign.id,
        ownerScope: campaign.ownerScope,
        ownerTenantId: campaign.ownerTenantId,
        createdById: campaign.createdById,
        createdByRole: campaign.createdByRole,
        title: campaign.title,
        contentJson: campaign.contentJson as unknown as Prisma.InputJsonValue,
        contentSchemaVersion: campaign.contentSchemaVersion,
        sanitizedHtml: campaign.sanitizedHtml,
        plainText: campaign.plainText,
        pushSummary: campaign.pushSummary,
        audienceSpec: campaign.audienceSpec as unknown as Prisma.InputJsonValue,
        channels: campaign.channels,
        dispatchStatus: campaign.dispatchStatus,
        scheduledAt: campaign.scheduledAt,
        timezone: campaign.timezone,
        archivedAt: campaign.archivedAt,
        version: campaign.version,
      },
    });

    return NotificationCampaignMapper.toEntity(created);
  }

  async findById(id: string): Promise<NotificationCampaignEntity | null> {
    const found = await prisma.notificationCampaign.findUnique({
      where: { id },
    });

    if (!found) return null;
    return NotificationCampaignMapper.toEntity(found);
  }

  async update(campaign: NotificationCampaignEntity): Promise<NotificationCampaignEntity> {
    const updated = await prisma.notificationCampaign.update({
      where: { id: campaign.id },
      data: {
        title: campaign.title,
        contentJson: campaign.contentJson as unknown as Prisma.InputJsonValue,
        contentSchemaVersion: campaign.contentSchemaVersion,
        sanitizedHtml: campaign.sanitizedHtml,
        plainText: campaign.plainText,
        pushSummary: campaign.pushSummary,
        audienceSpec: campaign.audienceSpec as unknown as Prisma.InputJsonValue,
        channels: campaign.channels,
        dispatchStatus: campaign.dispatchStatus,
        scheduledAt: campaign.scheduledAt,
        timezone: campaign.timezone,
        archivedAt: campaign.archivedAt,
        version: campaign.version,
      },
    });

    return NotificationCampaignMapper.toEntity(updated);
  }

  async deleteDraft(id: string): Promise<void> {
    await prisma.notificationCampaign.delete({
      where: { id },
    });
  }

  async findMany(filter: CampaignFilterParams): Promise<{
    campaigns: NotificationCampaignEntity[];
    total: number;
  }> {
    type NotificationCampaignWhereInput = NonNullable<Prisma.NotificationCampaignFindManyArgs["where"]>;
    const where: NotificationCampaignWhereInput = {};

    if (filter.ownerScope) {
      where.ownerScope = filter.ownerScope;
    }
    if (filter.ownerTenantId !== undefined) {
      where.ownerTenantId = filter.ownerTenantId;
    }
    if (filter.dispatchStatus) {
      where.dispatchStatus = filter.dispatchStatus;
    }
    if (filter.isArchived !== undefined) {
      where.archivedAt = filter.isArchived ? { not: null } : null;
    }
    if (filter.search) {
      where.title = { contains: filter.search, mode: "insensitive" };
    }

    const page = Math.max(1, filter.page ?? 1);
    const limit = Math.min(50, Math.max(1, filter.limit ?? 10));
    const skip = (page - 1) * limit;

    const [rows, total] = await Promise.all([
      prisma.notificationCampaign.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [filter.sortBy || "createdAt"]: filter.sortOrder || "desc",
        },
      }),
      prisma.notificationCampaign.count({ where }),
    ]);

    return {
      campaigns: rows.map(NotificationCampaignMapper.toEntity),
      total,
    };
  }
}
