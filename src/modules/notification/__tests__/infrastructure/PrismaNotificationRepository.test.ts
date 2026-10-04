import type { PrismaClient } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppRole } from "@/core/rbac/AppRole";
import { NotificationEntity } from "@/modules/notification/domain/entity/NotificationEntity";
import { NotificationType } from "@/modules/notification/domain/types/NotificationTypes";
import { NotificationScope } from "@/modules/notification/domain/value-object/NotificationScope";
import { PrismaNotificationRepository } from "@/modules/notification/infrastructure/repo/PrismaNotificationRepository";

const row = {
  id: "n-1",
  tenantId: "t-1",
  recipientId: "u-1",
  recipientRole: "STUDENT",
  type: "EXAM_RESULT_AVAILABLE",
  title: "Hasil ujian",
  body: "Nilai sudah tersedia",
  linkPath: "/student/grades",
  isRead: false,
  readAt: null,
  createdAt: new Date("2026-10-01T00:00:00Z"),
};

const studentScope = NotificationScope.forRecipient({
  recipientId: "u-1",
  role: AppRole.STUDENT,
  tenantId: "t-1",
});

const adminScope = NotificationScope.forRecipient({
  recipientId: "admin-1",
  role: AppRole.ADMIN,
  tenantId: null,
});

function makePrisma() {
  const notification = {
    findMany: vi.fn(),
    count: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
    create: vi.fn(),
  };
  const client = {
    notification,
    $transaction: vi.fn((ops: Promise<unknown>[]) => Promise.all(ops)),
  };
  return { client: client as unknown as PrismaClient, notification };
}

describe("PrismaNotificationRepository", () => {
  let prisma: ReturnType<typeof makePrisma>;
  let repo: PrismaNotificationRepository;

  beforeEach(() => {
    prisma = makePrisma();
    repo = new PrismaNotificationRepository(prisma.client);
  });

  describe("findByRecipient", () => {
    it("scopes by tenant, recipient, role and read state with pagination", async () => {
      prisma.notification.findMany.mockResolvedValue([row]);
      prisma.notification.count.mockResolvedValue(11);

      const result = await repo.findByRecipient({
        scope: studentScope,
        isRead: false,
        page: 2,
        limit: 10,
      });

      const where = {
        tenantId: "t-1",
        recipientId: "u-1",
        recipientRole: "STUDENT",
        isRead: false,
      };
      expect(prisma.notification.findMany).toHaveBeenCalledWith({
        where,
        orderBy: { createdAt: "desc" },
        skip: 10,
        take: 10,
      });
      expect(prisma.notification.count).toHaveBeenCalledWith({ where });
      expect(result.total).toBe(11);
      expect(result.items[0]).toBeInstanceOf(NotificationEntity);
      expect(result.items[0].type).toBe(NotificationType.EXAM_RESULT_AVAILABLE);
    });

    it("uses tenantId=null for the ADMIN platform scope", async () => {
      prisma.notification.findMany.mockResolvedValue([]);
      prisma.notification.count.mockResolvedValue(0);

      await repo.findByRecipient({ scope: adminScope, isRead: true, page: 1, limit: 10 });

      expect(prisma.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            tenantId: null,
            recipientId: "admin-1",
            recipientRole: "ADMIN",
            isRead: true,
          },
          skip: 0,
        }),
      );
    });
  });

  it("countUnread counts only unread notifications in scope", async () => {
    prisma.notification.count.mockResolvedValue(4);

    await expect(repo.countUnread(studentScope)).resolves.toBe(4);
    expect(prisma.notification.count).toHaveBeenCalledWith({
      where: {
        tenantId: "t-1",
        recipientId: "u-1",
        recipientRole: "STUDENT",
        isRead: false,
      },
    });
  });

  describe("findById", () => {
    it("maps a row to an entity", async () => {
      prisma.notification.findUnique.mockResolvedValue(row);

      const entity = await repo.findById("n-1");

      expect(prisma.notification.findUnique).toHaveBeenCalledWith({ where: { id: "n-1" } });
      expect(entity?.id).toBe("n-1");
    });

    it("returns null when not found", async () => {
      prisma.notification.findUnique.mockResolvedValue(null);
      await expect(repo.findById("missing")).resolves.toBeNull();
    });
  });

  it("markAsRead sets isRead and readAt", async () => {
    prisma.notification.update.mockResolvedValue({
      ...row,
      isRead: true,
      readAt: new Date(),
    });

    const entity = await repo.markAsRead("n-1");

    expect(prisma.notification.update).toHaveBeenCalledWith({
      where: { id: "n-1" },
      data: { isRead: true, readAt: expect.any(Date) },
    });
    expect(entity.isRead).toBe(true);
  });

  it("markAllAsRead updates only unread notifications in scope", async () => {
    prisma.notification.updateMany.mockResolvedValue({ count: 3 });

    await expect(repo.markAllAsRead(studentScope)).resolves.toBe(3);
    expect(prisma.notification.updateMany).toHaveBeenCalledWith({
      where: {
        tenantId: "t-1",
        recipientId: "u-1",
        recipientRole: "STUDENT",
        isRead: false,
      },
      data: { isRead: true, readAt: expect.any(Date) },
    });
  });

  it("create persists the scope fields", async () => {
    prisma.notification.create.mockResolvedValue({
      ...row,
      tenantId: null,
      recipientId: "admin-1",
      recipientRole: "ADMIN",
      type: "TENANT_REGISTERED",
      linkPath: null,
    });

    const entity = await repo.create({
      scope: adminScope,
      type: NotificationType.TENANT_REGISTERED,
      title: "Tenant baru",
      body: "SMA 1 terdaftar",
      linkPath: null,
    });

    expect(prisma.notification.create).toHaveBeenCalledWith({
      data: {
        tenantId: null,
        recipientId: "admin-1",
        recipientRole: "ADMIN",
        type: "TENANT_REGISTERED",
        title: "Tenant baru",
        body: "SMA 1 terdaftar",
        linkPath: null,
      },
    });
    expect(entity.tenantId).toBeNull();
  });
});
