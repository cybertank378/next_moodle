import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { ROUTES } from "@/libs/routes";
import { resolveUserRole } from "@/libs/utils";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";
import AppLayout from "@/shared-ui/layout/AppLayout";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const actor = await getCurrentUser();

  if (!actor) {
    redirect(ROUTES.AUTH.LOGIN);
    return null;
  }

  const role = resolveUserRole(actor.role);

  if (!role || (role !== "ADMIN" && !actor.tenantId)) {
    redirect(ROUTES.AUTH.LOGIN);
    return null;
  }

  return (
    <AppLayout userRole={role} username={actor.username}>
      {children}
    </AppLayout>
  );
}
