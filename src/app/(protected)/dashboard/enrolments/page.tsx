import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import EnrolmentsPageView from "@/sections/enrolments/pages/EnrolmentsPageView";

export default async function EnrolmentsPage() {
  await requireDashboardRoles(["ADMIN", "TENANT"]);
  return <EnrolmentsPageView />;
}
