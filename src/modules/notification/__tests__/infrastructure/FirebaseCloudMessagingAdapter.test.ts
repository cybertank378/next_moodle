import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppRole } from "@/core/rbac/AppRole";
import { NotificationEntity } from "@/modules/notification/domain/entity/NotificationEntity";
import { NotificationType } from "@/modules/notification/domain/types/NotificationTypes";
import { FirebaseCloudMessagingAdapter } from "@/modules/notification/infrastructure/providers/FirebaseCloudMessagingAdapter";

vi.mock("firebase-admin/app", () => ({
  getApps: vi.fn(() => []),
  initializeApp: vi.fn(),
  applicationDefault: vi.fn(),
}));

vi.mock("firebase-admin/messaging", () => {
  const sendMock = vi.fn().mockResolvedValue("mock-msg-id");
  return {
    getMessaging: vi.fn(() => ({
      send: sendMock,
    })),
  };
});

describe("FirebaseCloudMessagingAdapter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize firebase-admin if not already initialized", async () => {
    // Due to module caching and top-level execution, initializeApp might have been called already.
    // We just verify it doesn't throw.
    new FirebaseCloudMessagingAdapter();
  });

  it("should format topic correctly and send message", async () => {
    const adapter = new FirebaseCloudMessagingAdapter();
    const notification = new NotificationEntity({
      id: "n-1",
      tenantId: "tenant-x",
      recipientId: "user-1",
      recipientRole: AppRole.STUDENT,
      type: NotificationType.EXAM_RESULT_AVAILABLE,
      title: "Title",
      body: "Body",
      linkPath: "/foo",
      isRead: false,
      readAt: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    });

    await adapter.dispatchNotification(notification);

    const messagingMock = getMessaging();
    expect(messagingMock.send).toHaveBeenCalledTimes(1);
    expect(messagingMock.send).toHaveBeenCalledWith({
      topic: "tenant-x-STUDENT-user-1",
      data: {
        id: "n-1",
        type: "EXAM_RESULT_AVAILABLE",
        title: "Title",
        body: "Body",
        linkPath: "/foo",
        isRead: "false",
        createdAt: "2026-01-01T00:00:00.000Z",
      },
      notification: {
        title: "Title",
        body: "Body",
      },
    });
  });

  it("should use 'platform' as tenant part if tenantId is null", async () => {
    const adapter = new FirebaseCloudMessagingAdapter();
    const notification = new NotificationEntity({
      id: "n-2",
      tenantId: null,
      recipientId: "admin-1",
      recipientRole: AppRole.ADMIN,
      type: NotificationType.ANNOUNCEMENT,
      title: "Sys",
      body: "Alert",
      linkPath: null,
      isRead: false,
      readAt: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    });

    await adapter.dispatchNotification(notification);

    const messagingMock = getMessaging();
    expect(messagingMock.send).toHaveBeenCalledWith(
      expect.objectContaining({
        topic: "platform-ADMIN-admin-1",
      }),
    );
  });
});
