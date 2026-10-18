import { getCurrentSession } from "@/modules/auth/server/getCurrentSession";
import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import SchedulePageSection from "@/sections/schedule/pages/SchedulePageSection";

export default async function SchedulePage() {
  await requireDashboardRoles(["STUDENT", "TEACHER", "TENANT", "ADMIN"]);
  const session = await getCurrentSession();

  return <SchedulePageSection role={session?.actor.role} />;
}
