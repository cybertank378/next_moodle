import { describe, expect, it, vi } from "vitest";
import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import type { MoodleClient } from "@/core/moodle/types";
import { MoodleEnrolmentRepository } from "@/modules/enrolment/infrastructure/repo/MoodleEnrolmentRepository";

describe("MoodleEnrolmentRepository", () => {
  it("fetches enrolled users in a course via core_enrol_get_enrolled_users", async () => {
    const mockMoodleClient: MoodleClient = {
      call: vi.fn().mockResolvedValue([
        {
          id: 15,
          username: "student01",
          firstname: "Budi",
          lastname: "Santoso",
          fullname: "Budi Santoso",
          email: "budi@example.com",
          idnumber: "12345",
          department: "IPA",
          roles: [
            {
              roleid: 5,
              name: "Student",
              shortname: "student",
            },
          ],
          enrolledcourses: [{ id: 10 }],
        },
      ]),
    };

    const mockFactory: MoodleClientFactory = {
      createClientForTenant: vi.fn(), createClientForUser: vi.fn().mockResolvedValue(mockMoodleClient),
      createClient: vi.fn().mockReturnValue(mockMoodleClient),
    };

    const repo = new MoodleEnrolmentRepository(mockFactory, mockMoodleClient);
    const result = await repo.getCourseEnrolments({
      tenantId: "tenant-1",
      query: { courseId: 10, search: "Budi" },
    });

    expect(mockMoodleClient.call).toHaveBeenCalledWith(
      "core_enrol_get_enrolled_users",
      { courseid: 10 },
    );
    expect(result.enrolments).toHaveLength(1);
    expect(result.enrolments[0].fullname).toBe("Budi Santoso");
    expect(result.enrolments[0].roles[0].name).toBe("Student");
  });

  it("enrols users into a course via enrol_manual_enrol_users", async () => {
    const mockMoodleClient: MoodleClient = {
      call: vi.fn().mockResolvedValue(null),
    };

    const mockFactory: MoodleClientFactory = {
      createClientForTenant: vi.fn(), createClientForUser: vi.fn().mockResolvedValue(mockMoodleClient),
      createClient: vi.fn().mockReturnValue(mockMoodleClient),
    };

    const repo = new MoodleEnrolmentRepository(mockFactory, mockMoodleClient);
    const success = await repo.enrolUsers({
      tenantId: "tenant-1",
      enrolments: [{ courseId: 10, userId: 15, roleId: 5 }],
    });

    expect(mockMoodleClient.call).toHaveBeenCalledWith(
      "enrol_manual_enrol_users",
      {
        enrolments: [
          {
            courseid: 10,
            userid: 15,
            roleid: 5,
            timestart: 0,
            timeend: 0,
            suspend: 0,
          },
        ],
      },
    );
    expect(success).toBe(true);
  });

  it("unenrols users from a course via enrol_manual_unenrol_users", async () => {
    const mockMoodleClient: MoodleClient = {
      call: vi.fn().mockResolvedValue(null),
    };

    const mockFactory: MoodleClientFactory = {
      createClientForTenant: vi.fn(), createClientForUser: vi.fn().mockResolvedValue(mockMoodleClient),
      createClient: vi.fn().mockReturnValue(mockMoodleClient),
    };

    const repo = new MoodleEnrolmentRepository(mockFactory, mockMoodleClient);
    const success = await repo.unenrolUsers({
      tenantId: "tenant-1",
      enrolments: [{ courseId: 10, userId: 15 }],
    });

    expect(mockMoodleClient.call).toHaveBeenCalledWith(
      "enrol_manual_unenrol_users",
      {
        enrolments: [
          {
            courseid: 10,
            userid: 15,
          },
        ],
      },
    );
    expect(success).toBe(true);
  });
});
