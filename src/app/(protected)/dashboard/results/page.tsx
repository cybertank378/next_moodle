import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import ResultsPageView from "@/sections/results/pages/ResultsPageView";

export default async function ResultsPage() {
  const actor = await requireDashboardRoles(["ADMIN", "TENANT", "STUDENT"]);

  const userRole =
    actor?.role === "STUDENT"
      ? "STUDENT"
      : actor?.role === "ADMIN"
        ? "ADMIN"
        : "TENANT";

  return <ResultsPageView userRole={userRole} />;
}
