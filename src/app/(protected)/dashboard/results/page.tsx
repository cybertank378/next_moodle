import { redirect } from "next/navigation";
import { ROUTES } from "@/libs/routes";
import { resolveUserRole } from "@/libs/utils";
import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import ResultsPageView from "@/sections/results/pages/ResultsPageView";

export default async function ResultsPage() {
  const actor = await requireDashboardRoles([
    "ADMIN",
    "TENANT",
    "TEACHER",
    "STUDENT",
  ]);
  const role = resolveUserRole(actor?.role);

  if (!role) {
    redirect(ROUTES.AUTH.LOGIN);
  }

  return <ResultsPageView userRole={role} />;
}
