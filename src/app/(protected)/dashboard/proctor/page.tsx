import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import ProctorDashboardPage from "@/sections/dashboard/pages/ProctorDashboardPage";

export default async function ProctorPage() {
  await requireDashboardRoles(["TENANT"]);
  return <ProctorDashboardPage />;
}
