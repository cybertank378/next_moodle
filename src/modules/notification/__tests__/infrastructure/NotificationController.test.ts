import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { AppRole } from "@/core/rbac/AppRole";
import { Permission } from "@/core/rbac/Permission";
import type { GetNotificationsUseCase } from "@/modules/notification/application/usecases/GetNotificationsUseCase";
import type { GetUnreadCountUseCase } from "@/modules/notification/application/usecases/GetUnreadCountUseCase";
import type { MarkNotificationReadUseCase } from "@/modules/notification/application/usecases/MarkNotificationReadUseCase";
import type { MarkAllReadUseCase } from "@/modules/notification/application/usecases/MarkAllReadUseCase";
import { NotificationController } from "@/modules/notification/infrastructure/http/NotificationController";
import { NotificationType } from "@/modules/notification/domain/types/NotificationTypes";
import { NotificationScope } from "@/modules/notification/domain/value-object/NotificationScope";
import { ForbiddenError } from "@/core/errors/ForbiddenError";
import { resolveCurrentActor } from "@/core/auth/resolveCurrentActor";

vi.mock("@/core/auth/resolveCurrentActor", () => ({
  resolveCurrentActor: vi.fn(),
}));

function makeRequest(url: string, method = "GET", body?: unknown): Request {
  return new Request(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: { "content-type": "application/json" },
  });
}

const studentActor: CurrentActor = {
  userId: "user-1",
  username: "student01",
  role: AppRole.STUDENT,
  tenantId: "tenant-1",
  moodleUserId: 42,
  permissions: [Permission.STUDENT_DASHBOARD_READ],
};

const adminActor: CurrentActor = {
  userId: "admin-1",
  username: "admin",
  role: AppRole.ADMIN,
  tenantId: null,
};

const tenantlessTeacher: CurrentActor = {
  userId: "teacher-1",
  username: "teacher",
  role: AppRole.TEACHER,
  tenantId: null,
};

const mockNotificationItem = {
  id: "n-1",
  tenantId: "tenant-1",
  recipientId: "user-1",
  recipientRole: "STUDENT",
  type: NotificationType.EXAM_RESULT_AVAILABLE,
  title: "Hasil ujian tersedia",
  body: "Cek nilai kamu sekarang.",
  linkPath: "/student/grades",
  isRead: false,
  readAt: null,
  createdAt: new Date("2026-10-01T00:00:00Z"),
};

describe("NotificationController", () => {
  let getNotificationsUseCase: GetNotificationsUseCase;
  let getUnreadCountUseCase: GetUnreadCountUseCase;
  let markReadUseCase: MarkNotificationReadUseCase;
  let markAllReadUseCase: MarkAllReadUseCase;
  let controller: NotificationController;

  beforeEach(() => {
    getNotificationsUseCase = {
      execute: vi.fn().mockResolvedValue({
        items: [mockNotificationItem],
        total: 1,
        page: 1,
        totalPages: 1,
      }),
    } as unknown as GetNotificationsUseCase;

    getUnreadCountUseCase = {
      execute: vi.fn().mockResolvedValue(3),
    } as unknown as GetUnreadCountUseCase;

    markReadUseCase = {
      execute: vi.fn().mockResolvedValue(undefined),
    } as unknown as MarkNotificationReadUseCase;

    markAllReadUseCase = {
      execute: vi.fn().mockResolvedValue(5),
    } as unknown as MarkAllReadUseCase;

    controller = new NotificationController(
      getNotificationsUseCase,
      getUnreadCountUseCase,
      markReadUseCase,
      markAllReadUseCase,
    );
  });

  afterEach(() => {
    vi.mocked(resolveCurrentActor).mockReset();
  });

  describe("getNotifications", () => {
    it("should return 200 with paginated notifications", async () => {
      vi.mocked(resolveCurrentActor).mockResolvedValue(studentActor);
      const req = makeRequest(
        "http://localhost/api/notifications?tab=unread&page=1&limit=10",
      );
      const res = await controller.getNotifications(req);

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.items).toHaveLength(1);
      expect(body.data.totalPages).toBe(1);
    });

    it("should default tab=unread, page=1, limit=10 if not provided", async () => {
      vi.mocked(resolveCurrentActor).mockResolvedValue(studentActor);
      const req = makeRequest("http://localhost/api/notifications");
      await controller.getNotifications(req);

      expect(getNotificationsUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({ tab: "unread", page: 1, limit: 10 }),
      );
    });

    it("should return 401 when actor is missing", async () => {
      vi.mocked(resolveCurrentActor).mockResolvedValue(null as unknown as CurrentActor);
      const req = makeRequest("http://localhost/api/notifications");
      const res = await controller.getNotifications(req);
      expect(res.status).toBe(401);
    });

    it("should pass a tenant scope built from the session actor", async () => {
      vi.mocked(resolveCurrentActor).mockResolvedValue(studentActor);
      const req = makeRequest("http://localhost/api/notifications?tab=read&page=2");
      await controller.getNotifications(req);

      const call = vi.mocked(getNotificationsUseCase.execute).mock.calls[0][0];
      expect(call.scope).toBeInstanceOf(NotificationScope);
      expect(call.scope.tenantId).toBe("tenant-1");
      expect(call.scope.recipientId).toBe("user-1");
      expect(call.scope.recipientRole).toBe(AppRole.STUDENT);
      expect(call.tab).toBe("read");
      expect(call.page).toBe(2);
    });

    it("should ignore tenantId supplied in the query string", async () => {
      vi.mocked(resolveCurrentActor).mockResolvedValue(studentActor);
      const req = makeRequest("http://localhost/api/notifications?tenantId=tenant-evil");
      await controller.getNotifications(req);

      const call = vi.mocked(getNotificationsUseCase.execute).mock.calls[0][0];
      expect(call.scope.tenantId).toBe("tenant-1");
    });

    it("should return 200 for ADMIN using the platform scope", async () => {
      vi.mocked(resolveCurrentActor).mockResolvedValue(adminActor);
      const req = makeRequest("http://localhost/api/notifications");
      const res = await controller.getNotifications(req);

      expect(res.status).toBe(200);
      const call = vi.mocked(getNotificationsUseCase.execute).mock.calls[0][0];
      expect(call.scope.tenantId).toBeNull();
      expect(call.scope.recipientRole).toBe(AppRole.ADMIN);
    });

    it("should return 403 for a TEACHER without tenant context", async () => {
      vi.mocked(resolveCurrentActor).mockResolvedValue(tenantlessTeacher);
      const req = makeRequest("http://localhost/api/notifications");
      const res = await controller.getNotifications(req);

      expect(res.status).toBe(403);
      expect(getNotificationsUseCase.execute).not.toHaveBeenCalled();
    });

    it("should return 400 for an invalid tab", async () => {
      vi.mocked(resolveCurrentActor).mockResolvedValue(studentActor);
      const req = makeRequest("http://localhost/api/notifications?tab=all");
      const res = await controller.getNotifications(req);
      expect(res.status).toBe(400);
    });
  });

  describe("getUnreadCount", () => {
    it("should return 200 with unread count", async () => {
      vi.mocked(resolveCurrentActor).mockResolvedValue(studentActor);
      const req = makeRequest("http://localhost/api/notifications/count");
      const res = await controller.getUnreadCount(req);

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.data.unreadCount).toBe(3);
    });

    it("should return 401 when actor is missing", async () => {
      vi.mocked(resolveCurrentActor).mockResolvedValue(null as unknown as CurrentActor);
      const req = makeRequest("http://localhost/api/notifications/count");
      const res = await controller.getUnreadCount(req);
      expect(res.status).toBe(401);
    });

    it("should return 403 for a TEACHER without tenant context", async () => {
      vi.mocked(resolveCurrentActor).mockResolvedValue(tenantlessTeacher);
      const req = makeRequest("http://localhost/api/notifications/count");
      const res = await controller.getUnreadCount(req);
      expect(res.status).toBe(403);
    });
  });

  describe("markAsRead", () => {
    it("should return 200 when notification is marked as read", async () => {
      vi.mocked(resolveCurrentActor).mockResolvedValue(studentActor);
      const req = makeRequest("http://localhost/api/notifications/n-1/read", "PATCH");
      const res = await controller.markAsRead("n-1", req);
      expect(res.status).toBe(200);

      const call = vi.mocked(markReadUseCase.execute).mock.calls[0][0];
      expect(call.notificationId).toBe("n-1");
      expect(call.scope.recipientId).toBe("user-1");
    });

    it("should return 400 when notification id is blank", async () => {
      vi.mocked(resolveCurrentActor).mockResolvedValue(studentActor);
      const req = makeRequest("http://localhost/api/notifications/%20/read", "PATCH");
      const res = await controller.markAsRead(" ", req);
      expect(res.status).toBe(400);
      expect(markReadUseCase.execute).not.toHaveBeenCalled();
    });

    it("should return 403 when actor does not own notification", async () => {
      vi.mocked(resolveCurrentActor).mockResolvedValue(studentActor);
      vi.mocked(markReadUseCase.execute).mockRejectedValue(
        new ForbiddenError("Tidak berhak"),
      );
      const req = makeRequest("http://localhost/api/notifications/n-99/read", "PATCH");
      const res = await controller.markAsRead("n-99", req);
      expect(res.status).toBe(403);
    });
  });

  describe("markAllAsRead", () => {
    it("should return 200 with count of marked notifications", async () => {
      vi.mocked(resolveCurrentActor).mockResolvedValue(studentActor);
      const req = makeRequest("http://localhost/api/notifications/read-all", "PATCH");
      const res = await controller.markAllAsRead(req);

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.data.markedCount).toBe(5);
    });
  });
});
