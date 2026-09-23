import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import DashboardRoutePlaceholder from "@/shared-ui/component/DashboardRoutePlaceholder";

export default async function ResultDetailPage() {
  await requireDashboardRoles(["TENANT", "STUDENT"]);

  return (
    <DashboardRoutePlaceholder
      title="Detail Hasil"
      description="Route detail hasil ujian."
    />
  );
}
