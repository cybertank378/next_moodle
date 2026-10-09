import { redirect } from "next/navigation";
import AdminDashboard from "@/app/(protected)/dashboard/component/AdminDashboard";
import StudentDashboard from "@/app/(protected)/dashboard/component/StudentDashboard";
import TeacherDashboard from "@/app/(protected)/dashboard/component/TeacherDashboard";
import TenantDashboard from "@/app/(protected)/dashboard/component/TenantDashboard";
import { Role } from "@/libs/enums";
import { ROUTES } from "@/libs/routes";
import { resolveUserRole } from "@/libs/utils";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";

export default async function DashboardPage() {
  const actor = await getCurrentUser();

  if (!actor) {
    redirect(ROUTES.AUTH.LOGIN);
  }

  switch (resolveUserRole(actor.role)) {
    case Role.ADMIN:
      return <AdminDashboard />;
    case Role.TENANT:
      return <TenantDashboard />;
    case Role.STUDENT:
      return <StudentDashboard />;
    case Role.TEACHER:
      return <TeacherDashboard />;
    default:
      redirect(ROUTES.AUTH.LOGIN);
  }
}
