import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import DashboardRoutePlaceholder from "@/shared-ui/component/DashboardRoutePlaceholder";

export default async function EditExamPage() {
  await requireDashboardRoles(["TENANT", "TEACHER"]);
  return (
    <DashboardRoutePlaceholder
      title="Edit Ujian"
      description="Ubah konfigurasi ujian tenant."
    />
  );
}
