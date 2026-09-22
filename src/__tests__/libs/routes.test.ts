import { describe, expect, it } from "vitest";
import { ROUTES } from "@/libs/routes";

describe("libs/routes", () => {
  it("should provide consistent and structured route definitions", () => {
    expect(ROUTES.HOME).toBe("/");
    expect(ROUTES.FORBIDDEN).toBe("/403");

    // Auth
    expect(ROUTES.AUTH.LOGIN).toBe("/login");
    expect(ROUTES.AUTH.FORGOT_PASSWORD).toBe("/forgot-password");
    expect(ROUTES.AUTH.CHANGE_PASSWORD).toBe("/change-password");

    // Admin
    expect(ROUTES.ADMIN.ROOT).toBe("/admin");
    expect(ROUTES.ADMIN.DASHBOARD).toBe("/admin/dashboard");
    expect(ROUTES.ADMIN.TENANTS).toBe("/admin/tenants");

    // Tenant
    expect(ROUTES.TENANT.ROOT).toBe("/tenant");
    expect(ROUTES.TENANT.DASHBOARD).toBe("/tenant/dashboard");
    expect(ROUTES.TENANT.COURSES).toBe("/tenant/courses");
    expect(ROUTES.TENANT.EXAMS).toBe("/tenant/exams");

    // Student
    expect(ROUTES.STUDENT.ROOT).toBe("/student");
    expect(ROUTES.STUDENT.DASHBOARD).toBe("/student/dashboard");
    expect(ROUTES.STUDENT.COURSES).toBe("/student/courses");
    expect(ROUTES.STUDENT.EXAMS).toBe("/student/exams");
  });
});
