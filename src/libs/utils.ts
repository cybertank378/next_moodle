import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function redirectByRole(role?: string | null): string {
  switch (role) {
    case "ADMIN":
    case "SUPERADMIN":
      return "/admin/dashboard";
    case "TENANT":
    case "TENANT_ADMIN":
    case "TEACHER":
      return "/tenant/dashboard";
    case "STUDENT":
      return "/student/dashboard";
    default:
      return "/login";
  }
}
