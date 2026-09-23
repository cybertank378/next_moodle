import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import DashboardRoutePlaceholder from "@/shared-ui/component/DashboardRoutePlaceholder";

export default async function GroupsPage() {
  await requireDashboardRoles(["TENANT"]);

  return (
    <DashboardRoutePlaceholder
      title="Groups"
      description="Route daftar grup/rombel."
    />
  );
}
