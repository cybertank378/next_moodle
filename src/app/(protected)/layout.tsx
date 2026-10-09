import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { Role } from "@/libs/enums";
import { ROUTES } from "@/libs/routes";
import { resolveUserRole } from "@/libs/utils";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";
import { getTenantDisplayName } from "@/modules/tenant/server/getTenantDisplayName";
import AppLayout from "@/shared-ui/layout/AppLayout";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const actor = await getCurrentUser();

  if (!actor) {
    redirect(ROUTES.AUTH.LOGIN);
  }

  const role = resolveUserRole(actor.role);

  if (!role || (role !== Role.ADMIN && !actor.tenantId)) {
    redirect(ROUTES.AUTH.LOGIN);
  }

  const institutionName = actor.tenantId
    ? await getTenantDisplayName(actor.tenantId)
    : undefined;

  return (
    <AppLayout
      institutionName={institutionName}
      userRole={role}
      username={actor.username}
    >
      {children}
    </AppLayout>
  );
}
