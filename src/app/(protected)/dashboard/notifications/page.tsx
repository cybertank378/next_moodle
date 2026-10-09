import { redirect } from "next/navigation";
import { ROUTES } from "@/libs/routes";
import { resolveUserRole } from "@/libs/utils";
import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import NotificationPageView from "@/sections/notification/pages/NotificationPageView";
import NotificationManagementPageView from "@/sections/notification-management/pages/NotificationManagementPageView";

export default async function NotificationsPage() {
  const actor = await requireDashboardRoles([
    "ADMIN",
    "TENANT",
    "STUDENT",
    "TEACHER",
  ]);

  const role = resolveUserRole(actor?.role);

  if (role === "ADMIN") {
    return <NotificationManagementPageView actorRole="ADMIN" />;
  }

  if (role === "TENANT") {
    return <NotificationManagementPageView actorRole="TENANT" />;
  }

  if (role === "STUDENT" || role === "TEACHER") {
    return <NotificationPageView userRole={role} />;
  }

  redirect(ROUTES.HOME);
}
