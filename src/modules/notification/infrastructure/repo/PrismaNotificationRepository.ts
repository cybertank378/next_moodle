import "server-only";

import { prisma } from "@/libs/prisma";
import { NotificationEntity } from "../../domain/entity/NotificationEntity";
import type {
  NotificationRepositoryInterface,
  FindByRecipientOptions,
  FindByRecipientResult,
  CreateNotificationOptions,
} from "../../domain/interfaces/NotificationRepositoryInterface";
import { NotificationType } from "../../domain/types/NotificationTypes";
import type { NotificationScope } from "../../domain/value-object/NotificationScope";

function mapPrismaToEntity(
  row: {
    id: string;
    tenantId: string;
    recipientId: string;
    recipientRole: string;
    type: string;
    title: string;
    body: string;
    linkPath: string | null;
    isRead: boolean;
    readAt: Date | null;
    createdAt: Date;
  },
): NotificationEntity {
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

export class PrismaNotificationRepository
  implements NotificationRepositoryInterface
{
  constructor(private readonly db: any = prisma) {}

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

  async markAsRead(id: string): Promise<NotificationEntity> {
    const now = new Date();
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

  async create(options: CreateNotificationOptions): Promise<NotificationEntity> {
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
