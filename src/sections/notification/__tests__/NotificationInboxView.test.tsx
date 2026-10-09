// Files: src/sections/notification/__tests__/NotificationInboxView.test.tsx

import { describe, expect, it, vi, beforeEach } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import NotificationInboxView from "@/sections/notification/organisms/NotificationInboxView";
import * as notificationHook from "@/modules/notification/presentation/hooks/useNotificationApi";
import type { NotificationContextValue } from "@/modules/notification/presentation/context/NotificationContext";
import { NotificationType } from "@/modules/notification/domain/types/NotificationTypes";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("@/modules/notification/presentation/hooks/useNotificationApi", () => ({
  useNotificationApi: vi.fn(),
}));

describe("NotificationInboxView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultMockHook: NotificationContextValue = {
    unreadCount: 2,
    countLoading: false,
    listState: {
      data: {
        items: [
          {
            id: "n-1",
            type: NotificationType.ANNOUNCEMENT,
            title: "Pengumuman Jadwal Ujian",
            body: "Jadwal ujian semester genap telah dirilis.",
            linkPath: null,
            isRead: false,
            createdAt: new Date().toISOString(),
            readAt: null,
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
      loading: false,
      error: null,
    },
    activeTab: "unread",
    page: 1,
    pushPermission: "default",
    pushLoading: false,
    pushError: null,
    fetchUnreadCount: vi.fn(),
    fetchNotifications: vi.fn(),
    switchTab: vi.fn(),
    goToPage: vi.fn(),
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
    openPanel: vi.fn(),
    requestPushPermission: vi.fn(),
    unregisterPush: vi.fn(),
  };

  it("renders page header, unread count badge, and push prompt when permission is default", () => {
    vi.mocked(notificationHook.useNotificationApi).mockReturnValue(defaultMockHook);
    const html = renderToStaticMarkup(<NotificationInboxView />);

    expect(html).toContain("Notifikasi");
    expect(html).toContain("2 baru");
    expect(html).toContain("Aktifkan Notifikasi Browser");
    expect(html).toContain("Tandai semua dibaca");
    expect(html).toContain("Pengumuman Jadwal Ujian");
  });

  it("does not render push prompt when permission is granted", () => {
    vi.mocked(notificationHook.useNotificationApi).mockReturnValue({
      ...defaultMockHook,
      pushPermission: "granted",
    });
    const html = renderToStaticMarkup(<NotificationInboxView />);

    expect(html).not.toContain("Aktifkan Notifikasi Browser");
  });

  it("does not render mark all read button when unread count is zero", () => {
    vi.mocked(notificationHook.useNotificationApi).mockReturnValue({
      ...defaultMockHook,
      unreadCount: 0,
    });
    const html = renderToStaticMarkup(<NotificationInboxView />);

    expect(html).not.toContain("Tandai semua dibaca");
  });
});
