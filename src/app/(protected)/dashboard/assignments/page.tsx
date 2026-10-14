import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import { getCurrentSession } from "@/modules/auth/server/getCurrentSession";
import AssignmentsPageSection from "@/sections/assignments/pages/AssignmentsPageSection";

export default async function AssignmentsPage() {
  await requireDashboardRoles(["STUDENT", "TEACHER", "TENANT"]);
  const session = await getCurrentSession();

  return <AssignmentsPageSection role={session?.actor.role} />;
}

