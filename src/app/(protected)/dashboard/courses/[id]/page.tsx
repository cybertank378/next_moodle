import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import DashboardRoutePlaceholder from "@/shared-ui/component/DashboardRoutePlaceholder";

export default async function CourseDetailPage() {
  await requireDashboardRoles(["TENANT", "STUDENT"]);

  return (
    <DashboardRoutePlaceholder
      title="Detail Course"
      description="Route detail mata pelajaran/kursus."
    />
  );
}
