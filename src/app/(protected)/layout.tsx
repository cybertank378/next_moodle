import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { ROUTES } from "@/libs/routes";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";

/**
 * Authentication boundary for all protected routes.
 *
 * Responsibility: session existence check ONLY.
 * This layout does NOT enforce role or permission — that is the
 * responsibility of the role-specific sub-layouts:
 *   - (admin)/admin/layout.tsx  → requireRole(ADMIN)
 *   - (tenant)/tenant/layout.tsx → requireRole(TENANT) + tenantId
 *   - (student)/student/layout.tsx → requireRole(STUDENT) + tenantId
 *
 * Issue 03 — RBAC & Public/Protected Route Boundary.
 */
export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.AUTH.LOGIN);
    return null;
  }

  return <>{children}</>;
}
