import "server-only";

import { redirect } from "next/navigation";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import type { UserRole } from "@/libs/enums";
import { ROUTES } from "@/libs/routes";
import { resolveUserRole } from "@/libs/utils";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";

export async function requireDashboardRoles(
  allowedRoles: readonly UserRole[],
): Promise<CurrentActor | null> {
  const actor = await getCurrentUser();

  if (!actor) {
    redirect(ROUTES.AUTH.LOGIN);
    return null;
  }

  const role = resolveUserRole(actor.role);

  if (!role || !allowedRoles.includes(role)) {
    redirect(ROUTES.DASHBOARD.ROOT);
    return null;
  }

  if (role !== "ADMIN" && !actor.tenantId) {
    redirect(ROUTES.AUTH.LOGIN);
    return null;
  }

  return actor;
}
