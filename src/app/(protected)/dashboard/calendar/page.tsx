import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import DashboardRoutePlaceholder from "@/shared-ui/component/DashboardRoutePlaceholder";

export default async function CalendarPage() {
  await requireDashboardRoles(["STUDENT", "TEACHER", "TENANT"]);
  return (
    <DashboardRoutePlaceholder
      title="Kalender Akademik"
      description="Jadwal kegiatan akademik dan agenda belajar."
    />
  );
}
