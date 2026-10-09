import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import DashboardRoutePlaceholder from "@/shared-ui/component/DashboardRoutePlaceholder";

export default async function SchedulePage() {
  await requireDashboardRoles(["STUDENT", "TEACHER", "TENANT"]);
  return (
    <DashboardRoutePlaceholder
      title="Jadwal Pelajaran"
      description="Jadwal kelas, sesi ujian, dan konsultasi pengajar."
    />
  );
}
