// Files: src/modules/notification/infrastructure/repo/PrismaNotificationDeviceRepository.ts

import { prisma } from "@/libs/prisma";
import type {
  NotificationDeviceInput,
  NotificationDeviceRecord,
  NotificationDeviceRepositoryInterface,
} from "@/modules/notification/domain/interfaces/NotificationDeviceRepositoryInterface";

export class PrismaNotificationDeviceRepository implements NotificationDeviceRepositoryInterface {
  async register(input: NotificationDeviceInput): Promise<void> {
    await prisma.notificationDevice.upsert({
      where: { token: input.token },
      update: {
        userId: input.userId,
        role: input.role,
        tenantId: input.tenantId,
        platform: input.platform || "web",
        active: true,
        lastSeenAt: new Date(),
      },
      create: {
        userId: input.userId,
        role: input.role,
        tenantId: input.tenantId,
        token: input.token,
        platform: input.platform || "web",
        active: true,
        lastSeenAt: new Date(),
      },
    });
  }

  async unregister(token: string): Promise<void> {
    await prisma.notificationDevice.updateMany({
      where: { token },
      data: { active: false },
    });
  }

  async findActiveByRecipients(
    recipients: Array<{ recipientId: string; role: string; tenantId: string | null }>,
  ): Promise<Array<{ userId: string; role: string; token: string; tenantId: string | null }>> {
    if (recipients.length === 0) return [];

    const userIds = [...new Set(recipients.map((r) => r.recipientId))];

    const devices = await prisma.notificationDevice.findMany({
      where: {
        userId: { in: userIds },
        active: true,
      },
      select: {
        userId: true,
        role: true,
        token: true,
        tenantId: true,
      },
    });

    return devices;
  }

  async findActiveByUserId(userId: string): Promise<NotificationDeviceRecord[]> {
    return prisma.notificationDevice.findMany({
      where: { userId, active: true },
    });
  }
}
