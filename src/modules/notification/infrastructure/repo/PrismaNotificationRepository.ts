// Files: src/modules/notification/infrastructure/repo/PrismaNotificationRepository.ts
import "server-only";

import { prisma } from "@/libs/prisma";
import { NotificationEntity } from "@/modules/notification/domain/entity/NotificationEntity";
import type {
  CreateNotificationOptions,
  FindByRecipientOptions,
  FindByRecipientResult,
  NotificationRepositoryInterface,
} from "@/modules/notification/domain/interfaces/NotificationRepositoryInterface";
import type { NotificationType } from "@/modules/notification/domain/types/NotificationTypes";
import type { NotificationScope } from "@/modules/notification/domain/value-object/NotificationScope";

function mapPrismaToEntity(row: {
  id: string;
  tenantId: string | null;
  recipientId: string;
  recipientRole: string;
  type: string;
  title: string;
  body: string;
  linkPath: string | null;
  isRead: boolean;
  readAt: Date | null;
  createdAt: Date;
}): NotificationEntity {
  return new NotificationEntity({
    id: row.id,
    tenantId: row.tenantId,
    recipientId: row.recipientId,
    recipientRole: row.recipientRole,
    type: row.type as NotificationType,
    title: row.title,
    body: row.body,
    linkPath: row.linkPath,
    isRead: row.isRead,
    readAt: row.readAt,
    createdAt: row.createdAt,
  });
}

export type NotificationPrismaClient = Pick<
  typeof prisma,
  "notification" | "$transaction"
>;

export class PrismaNotificationRepository
  implements NotificationRepositoryInterface
{
  constructor(private readonly db: NotificationPrismaClient = prisma) {}

  async findByRecipient(
    options: FindByRecipientOptions,
  ): Promise<FindByRecipientResult> {
    const { scope, isRead, page, limit } = options;
    const { tenantId, recipientId, recipientRole } = scope;
    const skip = (page - 1) * limit;

    const [rows, total] = await this.db.$transaction([
      this.db.notification.findMany({
        where: { tenantId, recipientId, recipientRole, isRead },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      this.db.notification.count({
        where: { tenantId, recipientId, recipientRole, isRead },
      }),
    ]);

    return {
      items: rows.map(mapPrismaToEntity),
      total,
    };
  }

  async countUnread(scope: NotificationScope): Promise<number> {
    return this.db.notification.count({
      where: {
        tenantId: scope.tenantId,
        recipientId: scope.recipientId,
        recipientRole: scope.recipientRole,
        isRead: false,
      },
    });
  }

  async findById(id: string): Promise<NotificationEntity | null> {
    const row = await this.db.notification.findUnique({ where: { id } });
    if (!row) return null;
    return mapPrismaToEntity(row);
  }

  async markAsRead(
    id: string,
    scope?: NotificationScope,
  ): Promise<NotificationEntity> {
    const now = new Date();
    if (scope) {
      await this.db.notification.updateMany({
        where: {
          id,
          tenantId: scope.tenantId,
          recipientId: scope.recipientId,
          recipientRole: scope.recipientRole,
        },
        data: { isRead: true, readAt: now },
      });
      const updated = await this.findById(id);
      if (!updated) {
        throw new Error("Notifikasi tidak ditemukan.");
      }
      return updated;
    }

    const row = await this.db.notification.update({
      where: { id },
      data: { isRead: true, readAt: now },
    });
    return mapPrismaToEntity(row);
  }

  async markAllAsRead(scope: NotificationScope): Promise<number> {
    const { count } = await this.db.notification.updateMany({
      where: {
        tenantId: scope.tenantId,
        recipientId: scope.recipientId,
        recipientRole: scope.recipientRole,
        isRead: false,
      },
      data: { isRead: true, readAt: new Date() },
    });
    return count;
  }

  async create(
    options: CreateNotificationOptions,
  ): Promise<NotificationEntity> {
    const row = await this.db.notification.create({
      data: {
        tenantId: options.scope.tenantId,
        recipientId: options.scope.recipientId,
        recipientRole: options.scope.recipientRole,
        type: options.type,
        title: options.title,
        body: options.body,
        linkPath: options.linkPath ?? null,
      },
    });
    return mapPrismaToEntity(row);
  }
}
