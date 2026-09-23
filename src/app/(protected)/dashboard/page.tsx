import { redirect } from "next/navigation";
import AdminDashboard from "@/app/(protected)/dashboard/component/AdminDashboard";
import StudentDashboard from "@/app/(protected)/dashboard/component/StudentDashboard";
import TenantDashboard from "@/app/(protected)/dashboard/component/TenantDashboard";
import { ROUTES } from "@/libs/routes";
import { resolveUserRole } from "@/libs/utils";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";

export default async function DashboardPage() {
  const actor = await getCurrentUser();

  if (!actor) {
    redirect(ROUTES.AUTH.LOGIN);
    return null;
  }

  const role = resolveUserRole(actor.role);

  switch (role) {
    case "ADMIN":
      return <AdminDashboard />;
    case "TENANT":
      return <TenantDashboard />;
    case "STUDENT":
      return <StudentDashboard />;
    default:
      redirect(ROUTES.AUTH.LOGIN);
      return null;
  }
}
