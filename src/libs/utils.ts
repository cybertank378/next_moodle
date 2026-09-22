import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ROUTES } from "@/libs/routes";

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function redirectByRole(role?: string | null): string {
  switch (role) {
    case "ADMIN":
    case "SUPERADMIN":
      return ROUTES.ADMIN.DASHBOARD;
    case "TENANT":
    case "TENANT_ADMIN":
    case "TEACHER":
      return ROUTES.TENANT.DASHBOARD;
    case "STUDENT":
      return ROUTES.STUDENT.DASHBOARD;
    default:
      return ROUTES.AUTH.LOGIN;
  }
}
