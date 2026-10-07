import { redirect } from "next/navigation";
import { ROUTES } from "@/libs/routes";
import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import NotificationManagementPageView from "@/sections/notification-management/pages/NotificationManagementPageView";

export default async function NotificationsPage() {
  const actor = await requireDashboardRoles(["ADMIN", "TENANT"]);

  if (actor?.role === "ADMIN") {
    return <NotificationManagementPageView actorRole="ADMIN" />;
  }

  if (actor?.role === "TENANT") {
    return <NotificationManagementPageView actorRole="TENANT" />;
  }

  redirect(ROUTES.HOME);
}
