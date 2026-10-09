import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import CoursesView from "@/sections/courses/organisms/CoursesView";
import StudentCoursesView from "@/sections/courses/organisms/StudentCoursesView";

export default async function CoursesPage() {
  const actor = await requireDashboardRoles(["TENANT", "TEACHER", "STUDENT"]);
  return actor?.role === "STUDENT" ? <StudentCoursesView /> : <CoursesView />;
}
