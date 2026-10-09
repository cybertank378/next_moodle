import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import DashboardRoutePlaceholder from "@/shared-ui/component/DashboardRoutePlaceholder";

export default async function ActivitiesPage() {
  await requireDashboardRoles(["STUDENT", "TEACHER", "TENANT"]);
  return (
    <DashboardRoutePlaceholder
      title="Aktivitas Siswa"
      description="Catatan riwayat aktivitas belajar dan partisipasi ujian."
    />
  );
}
