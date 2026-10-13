import { getCurrentSession } from "@/modules/auth/server/getCurrentSession";
import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import SchedulePageSection from "@/sections/schedule/pages/SchedulePageSection";
import DashboardRoutePlaceholder from "@/shared-ui/component/DashboardRoutePlaceholder";

export default async function SchedulePage() {
  await requireDashboardRoles(["STUDENT", "TEACHER", "TENANT"]);
  const session = await getCurrentSession();

  if (session?.actor.role === "STUDENT") {
    return <SchedulePageSection />;
  }

  return (
    <DashboardRoutePlaceholder
      title="Jadwal Pelajaran"
      description="Jadwal kelas, sesi ujian, dan konsultasi pengajar."
    />
  );
}
