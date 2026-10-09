import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import DashboardRoutePlaceholder from "@/shared-ui/component/DashboardRoutePlaceholder";

export default async function QuestionsPage() {
  await requireDashboardRoles(["TENANT", "TEACHER"]);
  return (
    <DashboardRoutePlaceholder
      title="Bank Soal"
      description="Kelola kategori dan bank soal Moodle."
    />
  );
}
