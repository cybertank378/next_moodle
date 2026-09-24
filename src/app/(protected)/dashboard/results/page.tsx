import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import DashboardRoutePlaceholder from "@/shared-ui/component/DashboardRoutePlaceholder";

export default async function ResultsPage() {
  await requireDashboardRoles(["TENANT", "STUDENT"]);

  return (
    <DashboardRoutePlaceholder
      title="Hasil & Nilai"
      description="Route daftar hasil ujian."
    />
  );
}
