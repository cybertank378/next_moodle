import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import DashboardRoutePlaceholder from "@/shared-ui/component/DashboardRoutePlaceholder";

export default async function EnrolmentDetailPage() {
  await requireDashboardRoles(["TENANT"]);

  return (
    <DashboardRoutePlaceholder
      title="Detail Enrolment"
      description="Route detail enrolment."
    />
  );
}
