import { describe, expect, it } from "vitest";
import { AppRole } from "@/core/rbac/AppRole";
import { mapMoodleUserToActor } from "@/modules/auth/domain/mapper/AuthMapper";

describe("mapMoodleUserToActor", () => {
  const mockTenant = {
    tenantId: "tenant-1",
    slug: "acme",
    moodleUrl: "https://moodle.example.test",
    status: "ACTIVE" as const,
  };
  const mockSiteInfo = { userId: 42, username: "user01", email: "user@example.test" };

  it("maps nextjs_student to STUDENT role", () => {
    const actor = mapMoodleUserToActor(mockTenant, mockSiteInfo, "nextjs_student");
    expect(actor).toMatchObject({
      role: AppRole.STUDENT,
    });
  });

  it("maps nextjs_proctor to TENANT role", () => {
    const actor = mapMoodleUserToActor(mockTenant, mockSiteInfo, "nextjs_proctor");
    expect(actor).toMatchObject({
      role: AppRole.TENANT,
    });
  });

  it("maps nextjs_tenant to TENANT role", () => {
    const actor = mapMoodleUserToActor(mockTenant, mockSiteInfo, "nextjs_tenant");
    expect(actor).toMatchObject({
      role: AppRole.TENANT,
    });
  });

  it("maps nextjs_admin to ADMIN role", () => {
    const actor = mapMoodleUserToActor(mockTenant, mockSiteInfo, "nextjs_admin");
    expect(actor).toMatchObject({
      role: AppRole.ADMIN,
    });
  });
});
