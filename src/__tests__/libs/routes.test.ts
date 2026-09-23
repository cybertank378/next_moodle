import { describe, expect, it } from "vitest";
import { ROUTES } from "@/libs/routes";

describe("libs/routes", () => {
  it("provides the consolidated public and dashboard route definitions", () => {
    expect(ROUTES.HOME).toBe("/");

    expect(ROUTES.AUTH.LOGIN).toBe("/login");
    expect(ROUTES.AUTH.REGISTER).toBe("/register");
    expect(ROUTES.AUTH.FORGOT_PASSWORD).toBe("/forgot-password");
    expect(ROUTES.AUTH.CHANGE_PASSWORD).toBe("/change-password");

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

  it("does not expose legacy role-prefixed route groups", () => {
    expect("ADMIN" in ROUTES).toBe(false);
    expect("TENANT" in ROUTES).toBe(false);
    expect("STUDENT" in ROUTES).toBe(false);
    expect("FORBIDDEN" in ROUTES).toBe(false);
  });
});
