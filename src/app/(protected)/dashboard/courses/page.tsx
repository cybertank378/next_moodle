import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import CoursesView from "@/sections/courses/organisms/CoursesView";

export default async function CoursesPage() {
  await requireDashboardRoles(["TENANT", "STUDENT"]);

  return <CoursesView />;
}
