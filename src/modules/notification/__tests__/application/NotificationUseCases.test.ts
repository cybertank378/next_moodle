import { beforeEach, describe, expect, it, vi } from "vitest";
import { ForbiddenError } from "@/core/errors/ForbiddenError";
import { NotFoundError } from "@/core/errors/NotFoundError";
import { ValidationError } from "@/core/errors/ValidationError";
import { AppRole } from "@/core/rbac/AppRole";
import { CreateNotificationUseCase } from "@/modules/notification/application/usecases/CreateNotificationUseCase";
import { GetNotificationsUseCase } from "@/modules/notification/application/usecases/GetNotificationsUseCase";
import { GetUnreadCountUseCase } from "@/modules/notification/application/usecases/GetUnreadCountUseCase";
import { MarkAllReadUseCase } from "@/modules/notification/application/usecases/MarkAllReadUseCase";
import { MarkNotificationReadUseCase } from "@/modules/notification/application/usecases/MarkNotificationReadUseCase";
import { NotificationEntity } from "@/modules/notification/domain/entity/NotificationEntity";
import type { NotificationRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationRepositoryInterface";
import { NotificationType } from "@/modules/notification/domain/types/NotificationTypes";
import { NotificationScope } from "@/modules/notification/domain/value-object/NotificationScope";

function makeNotification(
  overrides: Partial<ConstructorParameters<typeof NotificationEntity>[0]> = {},
) {
  return new NotificationEntity({
    id: "n-1",
    tenantId: "t-1",
    recipientId: "u-1",
    recipientRole: "STUDENT",
    type: NotificationType.EXAM_RESULT_AVAILABLE,
    title: "Hasil ujian",
    body: "Nilai sudah tersedia",
    linkPath: "/student/grades",
    isRead: false,
    readAt: null,
    createdAt: new Date("2026-10-01T00:00:00Z"),
    ...overrides,
  });
}

function makeRepo(): NotificationRepositoryInterface {
  return {
    findByRecipient: vi.fn(),
    countUnread: vi.fn(),
    findById: vi.fn(),
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
    create: vi.fn(),
  };
}

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

describe("GetNotificationsUseCase", () => {
  let repo: NotificationRepositoryInterface;
  let useCase: GetNotificationsUseCase;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new GetNotificationsUseCase(repo);
  });

  it("should return paginated notifications for the recipient scope", async () => {
    const items = [makeNotification(), makeNotification({ id: "n-2" })];
    vi.mocked(repo.findByRecipient).mockResolvedValue({ items, total: 2 });

    const result = await useCase.execute({
      scope: studentScope,
      tab: "unread",
      page: 1,
      limit: 10,
    });

    expect(repo.findByRecipient).toHaveBeenCalledWith({
      scope: studentScope,
      isRead: false,
      page: 1,
      limit: 10,
    });
    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.totalPages).toBe(1);
  });

  it("should query isRead=true for tab=read", async () => {
    vi.mocked(repo.findByRecipient).mockResolvedValue({ items: [], total: 0 });

    await useCase.execute({
      scope: studentScope,
      tab: "read",
      page: 1,
      limit: 10,
    });

    expect(repo.findByRecipient).toHaveBeenCalledWith(
      expect.objectContaining({ isRead: true }),
    );
  });

  it("should calculate totalPages correctly", async () => {
    vi.mocked(repo.findByRecipient).mockResolvedValue({
      items: Array(10).fill(makeNotification()),
      total: 25,
    });

    const result = await useCase.execute({
      scope: studentScope,
      tab: "unread",
      page: 1,
      limit: 10,
    });

    expect(result.totalPages).toBe(3);
  });

  it("should report totalPages=1 when there are no notifications", async () => {
    vi.mocked(repo.findByRecipient).mockResolvedValue({ items: [], total: 0 });

    const result = await useCase.execute({
      scope: studentScope,
      tab: "unread",
      page: 1,
      limit: 10,
    });

    expect(result.totalPages).toBe(1);
  });

  it("should pass the ADMIN platform scope through unchanged", async () => {
    vi.mocked(repo.findByRecipient).mockResolvedValue({ items: [], total: 0 });

    await useCase.execute({
      scope: adminScope,
      tab: "unread",
      page: 2,
      limit: 10,
    });

    expect(repo.findByRecipient).toHaveBeenCalledWith(
      expect.objectContaining({ scope: adminScope, page: 2 }),
    );
  });
});

describe("GetUnreadCountUseCase", () => {
  it("should return unread count for the recipient scope", async () => {
    const repo = makeRepo();
    vi.mocked(repo.countUnread).mockResolvedValue(7);
    const useCase = new GetUnreadCountUseCase(repo);

    const result = await useCase.execute({ scope: studentScope });

    expect(result).toBe(7);
    expect(repo.countUnread).toHaveBeenCalledWith(studentScope);
  });
});

describe("MarkNotificationReadUseCase", () => {
  let repo: NotificationRepositoryInterface;
  let useCase: MarkNotificationReadUseCase;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new MarkNotificationReadUseCase(repo);
  });

  it("should mark notification as read when actor owns it", async () => {
    const notif = makeNotification();
    vi.mocked(repo.findById).mockResolvedValue(notif);
    vi.mocked(repo.markAsRead).mockResolvedValue(notif.markAsRead());

    await useCase.execute({ notificationId: "n-1", scope: studentScope });

    expect(repo.markAsRead).toHaveBeenCalledWith("n-1", studentScope);
  });

  it("should be idempotent when the notification is already read", async () => {
    vi.mocked(repo.findById).mockResolvedValue(
      makeNotification({ isRead: true, readAt: new Date() }),
    );

    await useCase.execute({ notificationId: "n-1", scope: studentScope });

    expect(repo.markAsRead).not.toHaveBeenCalled();
  });

  it("should throw NotFoundError when notification does not exist", async () => {
    vi.mocked(repo.findById).mockResolvedValue(null);

    await expect(
      useCase.execute({ notificationId: "missing", scope: studentScope }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("should throw ForbiddenError if actor does not own notification", async () => {
    vi.mocked(repo.findById).mockResolvedValue(
      makeNotification({ recipientId: "u-99" }),
    );

    await expect(
      useCase.execute({ notificationId: "n-1", scope: studentScope }),
    ).rejects.toBeInstanceOf(ForbiddenError);

    expect(repo.markAsRead).not.toHaveBeenCalled();
  });

  it("should throw ForbiddenError on tenant mismatch", async () => {
    vi.mocked(repo.findById).mockResolvedValue(
      makeNotification({ tenantId: "t-99" }),
    );

    await expect(
      useCase.execute({ notificationId: "n-1", scope: studentScope }),
    ).rejects.toBeInstanceOf(ForbiddenError);

    expect(repo.markAsRead).not.toHaveBeenCalled();
  });

  it("should throw ForbiddenError on role mismatch", async () => {
    vi.mocked(repo.findById).mockResolvedValue(
      makeNotification({ recipientRole: "TEACHER" }),
    );

    await expect(
      useCase.execute({ notificationId: "n-1", scope: studentScope }),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe("MarkAllReadUseCase", () => {
  it("should call markAllAsRead with the recipient scope", async () => {
    const repo = makeRepo();
    vi.mocked(repo.markAllAsRead).mockResolvedValue(5);
    const useCase = new MarkAllReadUseCase(repo);

    const count = await useCase.execute({ scope: studentScope });

    expect(count).toBe(5);
    expect(repo.markAllAsRead).toHaveBeenCalledWith(studentScope);
  });
});

describe("CreateNotificationUseCase", () => {
  let repo: NotificationRepositoryInterface;
  let useCase: CreateNotificationUseCase;
  let wsAdapter: { dispatchNotification: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    repo = makeRepo();
    wsAdapter = {
      dispatchNotification: vi.fn().mockResolvedValue(undefined),
    };
    useCase = new CreateNotificationUseCase(repo, wsAdapter);
  });

  it("should create a tenant-scoped notification", async () => {
    const created = makeNotification();
    vi.mocked(repo.create).mockResolvedValue(created);

    const result = await useCase.execute({
      scope: studentScope,
      type: NotificationType.EXAM_RESULT_AVAILABLE,
      title: "  Hasil ujian  ",
      body: "Nilai sudah tersedia",
      linkPath: "/student/grades",
    });

    expect(repo.create).toHaveBeenCalledWith({
      scope: studentScope,
      type: NotificationType.EXAM_RESULT_AVAILABLE,
      title: "Hasil ujian",
      body: "Nilai sudah tersedia",
      linkPath: "/student/grades",
    });
    expect(result.id).toBe("n-1");
    expect(wsAdapter.dispatchNotification).toHaveBeenCalledWith(created);
  });

  it("should create an ADMIN platform notification without a tenant", async () => {
    vi.mocked(repo.create).mockResolvedValue(
      makeNotification({
        tenantId: null,
        recipientId: "admin-1",
        recipientRole: "ADMIN",
        type: NotificationType.TENANT_REGISTERED,
      }),
    );

    await useCase.execute({
      scope: adminScope,
      type: NotificationType.TENANT_REGISTERED,
      title: "Tenant baru",
      body: "SMA 1 terdaftar",
    });

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({ scope: adminScope, linkPath: null }),
    );
  });

  it("should reject an empty title", async () => {
    await expect(
      useCase.execute({
        scope: studentScope,
        type: NotificationType.ANNOUNCEMENT,
        title: "   ",
        body: "x",
      }),
    ).rejects.toBeInstanceOf(ValidationError);
    expect(repo.create).not.toHaveBeenCalled();
  });

  it.each([
    "https://evil.example/phish",
    "//evil.example",
    "javascript:alert(1)",
    "student/grades",
  ])("should reject a non-internal linkPath (%s)", async (linkPath) => {
    await expect(
      useCase.execute({
        scope: studentScope,
        type: NotificationType.ANNOUNCEMENT,
        title: "Info",
        body: "x",
        linkPath,
      }),
    ).rejects.toBeInstanceOf(ValidationError);
    expect(repo.create).not.toHaveBeenCalled();
  });
});
