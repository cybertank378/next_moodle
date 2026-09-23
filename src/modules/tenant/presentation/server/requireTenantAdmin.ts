import "server-only";

import { redirect } from "next/navigation";
import { AppRole } from "@/core/rbac/AppRole";
import { Permission } from "@/core/rbac/Permission";
import { requirePermission } from "@/core/rbac/requirePermission";
import { ROUTES } from "@/libs/routes";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";

export async function requireTenantAdmin(): Promise<void> {
  const actor = await getCurrentUser();

  if (!actor) {
    redirect(ROUTES.AUTH.LOGIN);
  }

  if (actor.role !== AppRole.ADMIN) {
    redirect(ROUTES.DASHBOARD.ROOT);
  }

  requirePermission(
    {
      id: actor.userId,
      role: AppRole.ADMIN,
      tenantId: null,
    },
    Permission.TENANT_READ,
  );
}
