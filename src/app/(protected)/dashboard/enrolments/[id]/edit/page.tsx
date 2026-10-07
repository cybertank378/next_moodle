import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import DashboardRoutePlaceholder from "@/shared-ui/component/DashboardRoutePlaceholder";

export default async function EditEnrolmentPage() {
  await requireDashboardRoles(["TENANT"]);
  return (
    <DashboardRoutePlaceholder
      title="Edit Enrolment"
      description="Ubah enrolment pengguna."
    />
  );
}
