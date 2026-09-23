import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import DashboardRoutePlaceholder from "@/shared-ui/component/DashboardRoutePlaceholder";

export default async function ExamsPage() {
  await requireDashboardRoles(["TENANT", "STUDENT"]);

  return (
    <DashboardRoutePlaceholder
      title="Ujian"
      description="Route daftar ujian."
    />
  );
}
