import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import DashboardRoutePlaceholder from "@/shared-ui/component/DashboardRoutePlaceholder";

export default async function CoursesPage() {
  await requireDashboardRoles(["TENANT", "STUDENT"]);

  return (
    <DashboardRoutePlaceholder
      title="Courses"
      description="Route mata pelajaran/kursus."
    />
  );
}
