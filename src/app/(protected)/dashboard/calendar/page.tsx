import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import CalendarPageSection from "@/sections/calendar/pages/CalendarPageSection";

export default async function CalendarPage() {
  await requireDashboardRoles(["STUDENT", "TEACHER", "TENANT"]);
  return <CalendarPageSection />;
}
