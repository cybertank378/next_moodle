
import CoursesView from "@/sections/courses/organisms/CoursesView";
import StudentCoursesView from "@/sections/courses/organisms/StudentCoursesView";
import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";

export default async function CoursePageView() {
    const actor = await requireDashboardRoles(["TENANT", "TEACHER", "STUDENT"]);
    return actor?.role === "STUDENT" ? <StudentCoursesView /> : <CoursesView />;
}