import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import DashboardRoutePlaceholder from "@/shared-ui/component/DashboardRoutePlaceholder";

export default async function CreateEnrolmentPage() {
  await requireDashboardRoles(["TENANT"]);

  return (
    <DashboardRoutePlaceholder
      title="Tambah Enrolment"
      description="Route pembuatan enrolment."
    />
  );
}
