// Files: src/sections/notification/__tests__/NotificationPanel.test.tsx

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NotificationType } from "@/modules/notification/domain/types/NotificationTypes";
import type { NotificationContextValue } from "@/modules/notification/presentation/context/NotificationContext";
import * as notificationHook from "@/modules/notification/presentation/hooks/useNotificationApi";
import NotificationPanel from "@/sections/notification/organisms/NotificationPanel";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("@/modules/notification/presentation/hooks/useNotificationApi", () => ({
  useNotificationApi: vi.fn(),
}));

describe("NotificationPanel", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultMockHook: NotificationContextValue = {
    unreadCount: 3,
    countLoading: false,
    listState: {
      data: {
        items: [
          {
            id: "n-1",
            type: NotificationType.ANNOUNCEMENT,
            title: "Ujian Segera Dimulai",
            body: "Siapkan diri Anda.",
            linkPath: "/student/exams",
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

  it("should not render markup when isOpen is false", () => {
    vi.mocked(notificationHook.useNotificationApi).mockReturnValue(
      defaultMockHook,
    );
    const html = renderToStaticMarkup(
      <NotificationPanel isOpen={false} onClose={mockOnClose} />,
    );
    expect(html).toBe("");
  });

  it("should render panel, items, and push prompt when isOpen is true", () => {
    vi.mocked(notificationHook.useNotificationApi).mockReturnValue(
      defaultMockHook,
    );
    const html = renderToStaticMarkup(
      <NotificationPanel isOpen={true} onClose={mockOnClose} />,
    );
    expect(html).toContain('data-testid="notification-panel"');
    expect(html).toContain("Ujian Segera Dimulai");
    expect(html).toContain("Aktifkan notifikasi");
    expect(html).toContain('data-testid="mark-all-read-btn"');
  });

  it("should not render push prompt when pushPermission is granted", () => {
    vi.mocked(notificationHook.useNotificationApi).mockReturnValue({
      ...defaultMockHook,
      pushPermission: "granted",
    });
    const html = renderToStaticMarkup(
      <NotificationPanel isOpen={true} onClose={mockOnClose} />,
    );
    expect(html).not.toContain("Aktifkan notifikasi");
  });

  it("should not render mark all button when unreadCount is 0", () => {
    vi.mocked(notificationHook.useNotificationApi).mockReturnValue({
      ...defaultMockHook,
      unreadCount: 0,
    });
    const html = renderToStaticMarkup(
      <NotificationPanel isOpen={true} onClose={mockOnClose} />,
    );
    expect(html).not.toContain('data-testid="mark-all-read-btn"');
  });
});
