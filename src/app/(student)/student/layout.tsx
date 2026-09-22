import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AppRole } from "@/core/rbac/AppRole";
import { ROUTES } from "@/libs/routes";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";
import AppLayout from "@/shared-ui/layout/AppLayout";

export default async function StudentLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.AUTH.LOGIN);
    return null;
  }

  if (user.role !== AppRole.STUDENT || !user.tenantId) {
    redirect(ROUTES.FORBIDDEN);
    return null;
  }

  return (
    <AppLayout userRole="STUDENT" username={user.username || "Peserta Ujian"}>
      {children}
    </AppLayout>
  );
}
