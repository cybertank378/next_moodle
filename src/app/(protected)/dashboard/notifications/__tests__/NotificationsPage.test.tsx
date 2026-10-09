// Files: src/app/(protected)/dashboard/notifications/__tests__/NotificationsPage.test.tsx

import { describe, expect, it, vi, beforeEach } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import NotificationsPage from "@/app/(protected)/dashboard/notifications/page";
import * as authServer from "@/modules/auth/server/requireDashboardRoles";
import { redirect } from "next/navigation";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("@/modules/auth/server/requireDashboardRoles", () => ({
  requireDashboardRoles: vi.fn(),
}));

vi.mock("@/sections/notification-management/pages/NotificationManagementPageView", () => ({
  default: ({ actorRole }: { actorRole: string }) => (
    <div data-testid="notification-management-page">{actorRole}</div>
  ),
}));

vi.mock("@/sections/notification/pages/NotificationPageView", () => ({
  default: ({ userRole }: { userRole?: string }) => (
    <div data-testid="notification-student-page">{userRole}</div>
  ),
}));

describe("NotificationsPage Route Guard & Role Dispatching", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders NotificationManagementPageView for ADMIN role", async () => {
    vi.mocked(authServer.requireDashboardRoles).mockResolvedValue({
      userId: "u-admin",
      role: "ADMIN",
      username: "admin",
      tenantId: null,
    } as Awaited<ReturnType<typeof authServer.requireDashboardRoles>>);

    const Page = await NotificationsPage();
    const html = renderToStaticMarkup(Page as React.ReactElement);

    expect(html).toContain('data-testid="notification-management-page"');
    expect(html).toContain("ADMIN");
  });

  it("renders NotificationManagementPageView for TENANT role", async () => {
    vi.mocked(authServer.requireDashboardRoles).mockResolvedValue({
      userId: "u-tenant",
      role: "TENANT",
      username: "tenant",
      tenantId: "t-1",
    } as Awaited<ReturnType<typeof authServer.requireDashboardRoles>>);

    const Page = await NotificationsPage();
    const html = renderToStaticMarkup(Page as React.ReactElement);

    expect(html).toContain('data-testid="notification-management-page"');
    expect(html).toContain("TENANT");
  });

  it("renders NotificationPageView for STUDENT role instead of redirecting", async () => {
    vi.mocked(authServer.requireDashboardRoles).mockResolvedValue({
      userId: "u-student",
      role: "STUDENT",
      username: "student",
      tenantId: "t-1",
    } as Awaited<ReturnType<typeof authServer.requireDashboardRoles>>);

    const Page = await NotificationsPage();
    const html = renderToStaticMarkup(Page as React.ReactElement);

    expect(html).toContain('data-testid="notification-student-page"');
    expect(html).toContain("STUDENT");
    expect(redirect).not.toHaveBeenCalled();
  });

  it("renders NotificationPageView for TEACHER role", async () => {
    vi.mocked(authServer.requireDashboardRoles).mockResolvedValue({
      userId: "u-teacher",
      role: "TEACHER",
      username: "teacher",
      tenantId: "t-1",
    } as Awaited<ReturnType<typeof authServer.requireDashboardRoles>>);

    const Page = await NotificationsPage();
    const html = renderToStaticMarkup(Page as React.ReactElement);

    expect(html).toContain('data-testid="notification-student-page"');
    expect(html).toContain("TEACHER");
    expect(redirect).not.toHaveBeenCalled();
  });
});
