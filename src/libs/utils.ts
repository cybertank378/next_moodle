import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { UserRole } from "@/libs/enums";
import { ROUTES } from "@/libs/routes";

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

import { Role } from "@/libs/enums";

export function resolveUserRole(role?: string | null): UserRole | null {
  switch (role) {
    case Role.ADMIN:
    case "SUPERADMIN":
      return Role.ADMIN;
    case Role.TENANT:
    case "TENANT_ADMIN":
      return Role.TENANT;
    case Role.TEACHER:
      return Role.TEACHER;
    case Role.STUDENT:
      return Role.STUDENT;
    default:
      return null;
  }
}

export function redirectByRole(role?: string | null): string {
  return resolveUserRole(role) ? ROUTES.DASHBOARD.ROOT : ROUTES.AUTH.LOGIN;
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>?/gm, "").trim();
}

/**
 * Basic HTML sanitizer to strip dangerous script tags, handlers, and javascript: hrefs.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/on\w+\s*=\s*[^>\s]+/gi, "")
    .replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"')
    .trim();
}
