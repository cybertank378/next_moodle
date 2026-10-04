import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { Role } from "@/libs/enums";
import { ROUTES } from "@/libs/routes";
import { resolveUserRole } from "@/libs/utils";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";
import AppLayout from "@/shared-ui/layout/AppLayout";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const actor = await getCurrentUser();

  if (!actor) {
    redirect(ROUTES.AUTH.LOGIN);
  }

  const role = resolveUserRole(actor.role);

  if (role !== Role.ADMIN) {
    redirect(ROUTES.AUTH.LOGIN);
  }

  return (
    <AppLayout userRole={role} username={actor.username}>
      {children}
    </AppLayout>
  );
}
