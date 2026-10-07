import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import UsersPageView from "@/sections/users/pages/UsersPageView";

export default async function UsersPage() {
  await requireDashboardRoles(["ADMIN", "TENANT"]);
  return <UsersPageView />;
}
