import { describe, expect, it } from "vitest";
import { ROUTES } from "@/libs/routes";
import { redirectByRole } from "@/libs/utils";

describe("consolidated dashboard route mapping", () => {
  it.each([
    "ADMIN",
    "SUPERADMIN",
    "TENANT",
    "TENANT_ADMIN",
    "TEACHER",
    "STUDENT",
  ])("redirects authenticated role %s to /dashboard", (role) => {
    expect(redirectByRole(role)).toBe("/dashboard");
  });

  it("keeps unauthenticated/unknown roles on login", () => {
    expect(redirectByRole(undefined)).toBe(ROUTES.AUTH.LOGIN);
    expect(redirectByRole("UNKNOWN")).toBe(ROUTES.AUTH.LOGIN);
  });

  it("maps protected features under /dashboard", () => {
    expect(ROUTES.DASHBOARD.ROOT).toBe("/dashboard");
    expect(ROUTES.DASHBOARD.TENANTS).toBe("/dashboard/tenants");
    expect(ROUTES.DASHBOARD.USERS).toBe("/dashboard/users");
    expect(ROUTES.DASHBOARD.ENROLMENTS).toBe("/dashboard/enrolments");
    expect(ROUTES.DASHBOARD.GROUPS).toBe("/dashboard/groups");
    expect(ROUTES.DASHBOARD.COURSES).toBe("/dashboard/courses");
    expect(ROUTES.DASHBOARD.QUESTIONS).toBe("/dashboard/questions");
    expect(ROUTES.DASHBOARD.EXAMS).toBe("/dashboard/exams");
    expect(ROUTES.DASHBOARD.RESULTS).toBe("/dashboard/results");
    expect(ROUTES.DASHBOARD.BRANDING).toBe("/dashboard/branding");
    expect(ROUTES.DASHBOARD.AUDIT).toBe("/dashboard/audit");
    expect(ROUTES.DASHBOARD.SETTINGS).toBe("/dashboard/settings");
  });
});
