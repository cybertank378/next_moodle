import { describe, expect, it } from "vitest";
import { AppRole } from "@/core/rbac/AppRole";
import { mapMoodleStudentToActor } from "@/modules/auth/domain/mapper/AuthMapper";

describe("mapMoodleStudentToActor", () => {
  it("maps a tenant-scoped Moodle student to an application actor", () => {
    const actor = mapMoodleStudentToActor(
      {
        tenantId: "tenant-1",
        slug: "acme",
        moodleUrl: "https://moodle.example.test",
        status: "ACTIVE",
      },
      { userId: 42, username: "student01", email: "student@example.test" },
    );
    expect(actor).toMatchObject({
      id: "moodle:tenant-1:42",
      role: AppRole.STUDENT,
      tenantId: "tenant-1",
      moodleUserId: 42,
    });
  });
});
