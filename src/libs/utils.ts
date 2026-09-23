import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { UserRole } from "@/libs/enums";
import { ROUTES } from "@/libs/routes";

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function resolveUserRole(role?: string | null): UserRole | null {
  switch (role) {
    case "ADMIN":
    case "SUPERADMIN":
      return "ADMIN";
    case "TENANT":
    case "TENANT_ADMIN":
    case "TEACHER":
      return "TENANT";
    case "STUDENT":
      return "STUDENT";
    default:
      return null;
  }
}

export function redirectByRole(role?: string | null): string {
  return resolveUserRole(role) ? ROUTES.DASHBOARD.ROOT : ROUTES.AUTH.LOGIN;
}
