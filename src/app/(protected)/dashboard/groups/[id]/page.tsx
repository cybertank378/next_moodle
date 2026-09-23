import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import DashboardRoutePlaceholder from "@/shared-ui/component/DashboardRoutePlaceholder";

export default async function GroupDetailPage() {
  await requireDashboardRoles(["TENANT"]);

  return (
    <DashboardRoutePlaceholder
      title="Detail Group"
      description="Route detail grup/rombel."
    />
  );
}
