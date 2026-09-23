import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import DashboardRoutePlaceholder from "@/shared-ui/component/DashboardRoutePlaceholder";

export default async function SettingsPage() {
  await requireDashboardRoles(["ADMIN"]);

  return (
    <DashboardRoutePlaceholder
      title="Pengaturan"
      description="Route pengaturan platform."
    />
  );
}
