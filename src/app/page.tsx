import { redirect } from "next/navigation";
import { Role } from "@/libs/enums";
import { ROUTES } from "@/libs/routes";
import { resolveUserRole } from "@/libs/utils";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";

export default async function RootPage() {
  const actor = await getCurrentUser();

  if (!actor) {
    redirect(ROUTES.AUTH.LOGIN);
  }

  const role = resolveUserRole(actor.role);

  switch (role) {
    case Role.ADMIN:
      redirect(ROUTES.ADMIN.ROOT);
    case Role.TENANT:
      redirect(ROUTES.TENANT.ROOT);
    case Role.STUDENT:
      redirect(ROUTES.STUDENT.ROOT);
    case Role.TEACHER:
      redirect(ROUTES.TEACHER.ROOT);
    default:
      redirect(ROUTES.AUTH.LOGIN);
  }
}
