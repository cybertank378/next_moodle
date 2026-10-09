import { describe, expect, it, vi } from "vitest";
import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import type { MoodleClient } from "@/core/moodle/types";
import { MoodleUserRepository } from "@/modules/user/infrastructure/repo/MoodleUserRepository";

describe("MoodleUserRepository", () => {
  it("fetches user list via core_user_get_users and formats response", async () => {
    const mockMoodleClient: MoodleClient = {
      call: vi.fn().mockResolvedValue({
        users: [
          {
            id: 10,
            username: "student01",
            firstname: "Budi",
            lastname: "Santoso",
            fullname: "Budi Santoso",
            email: "budi@example.com",
            idnumber: "12345",
            department: "IPA",
            institution: "SMA 1",
            suspended: false,
            firstaccess: 1700000000,
            lastaccess: 1700003600,
            profileimageurl: "https://moodle.test/avatar.png",
          },
        ],
        warnings: [],
      }),
    };

    const mockFactory: MoodleClientFactory = {
      createClientForTenant: vi.fn(), createClientForUser: vi.fn().mockResolvedValue(mockMoodleClient),
      createClient: vi.fn().mockReturnValue(mockMoodleClient),
    };

    const repo = new MoodleUserRepository(mockFactory, mockMoodleClient);
    const result = await repo.getUsers({
      tenantId: "tenant-1",
      query: { search: "budi", page: 1, pageSize: 10 },
    });

    expect(mockMoodleClient.call).toHaveBeenCalledWith(
      "core_user_get_users",
      expect.objectContaining({
        criteria: expect.arrayContaining([
          expect.objectContaining({ key: "search", value: "%budi%" }),
        ]),
      }),
    );
    expect(result.users).toHaveLength(1);
    expect(result.users[0].fullname).toBe("Budi Santoso");
    expect(result.total).toBe(1);
  });

  it("creates users via core_user_create_users", async () => {
    const mockMoodleClient: MoodleClient = {
      call: vi.fn().mockResolvedValue([{ id: 101, username: "new_student" }]),
    };

    const mockFactory: MoodleClientFactory = {
      createClientForTenant: vi.fn(), createClientForUser: vi.fn().mockResolvedValue(mockMoodleClient),
      createClient: vi.fn().mockReturnValue(mockMoodleClient),
    };

    const repo = new MoodleUserRepository(mockFactory, mockMoodleClient);
    const created = await repo.createUsers({
      tenantId: "tenant-1",
      users: [
        {
          username: "new_student",
          firstname: "New",
          lastname: "Student",
          email: "new@example.com",
          password: "Pass123!",
        },
      ],
    });

    expect(mockMoodleClient.call).toHaveBeenCalledWith(
      "core_user_create_users",
      expect.objectContaining({
        users: expect.arrayContaining([
          expect.objectContaining({
            username: "new_student",
            firstname: "New",
            lastname: "Student",
            email: "new@example.com",
          }),
        ]),
      }),
    );
    expect(created).toEqual([{ id: 101, username: "new_student" }]);
  });

  it("imports users from CSV content and handles errors gracefully", async () => {
    const mockMoodleClient: MoodleClient = {
      call: vi.fn().mockResolvedValue([{ id: 201, username: "valid_user" }]),
    };

    const mockFactory: MoodleClientFactory = {
      createClientForTenant: vi.fn(), createClientForUser: vi.fn().mockResolvedValue(mockMoodleClient),
      createClient: vi.fn().mockReturnValue(mockMoodleClient),
    };

    const csvContent = `username,firstname,lastname,email
valid_user,Valid,User,valid@example.com
,Invalid,User,invalid-email`;

    const repo = new MoodleUserRepository(mockFactory, mockMoodleClient);
    const result = await repo.importUsers({
      tenantId: "tenant-1",
      csvContent,
      defaultPassword: "DefaultPassword123!",
    });

    expect(result.importedCount).toBe(1);
    expect(result.failedCount).toBe(1);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.createdUsers).toEqual([{ id: 201, username: "valid_user" }]);
  });

  it("calls local_exam_import_students API when custom endpoint is available", async () => {
    const mockMoodleClient: MoodleClient = {
      call: vi
        .fn()
        .mockResolvedValue([{ id: 301, username: "student_custom" }]),
    };

    const mockFactory: MoodleClientFactory = {
      createClientForTenant: vi.fn(), createClientForUser: vi.fn().mockResolvedValue(mockMoodleClient),
      createClient: vi.fn().mockReturnValue(mockMoodleClient),
    };

    const repo = new MoodleUserRepository(mockFactory, mockMoodleClient);
    const result = await repo.importStudentsCustom({
      tenantId: "tenant-1",
      users: [
        {
          username: "student_custom",
          firstname: "Custom",
          lastname: "Student",
          email: "custom@example.com",
        },
      ],
      courseId: 10,
      groupName: "Kelas-10",
    });

    expect(mockMoodleClient.call).toHaveBeenCalledWith(
      "local_exam_import_students",
      expect.objectContaining({
        students: expect.arrayContaining([
          expect.objectContaining({
            username: "student_custom",
            courseid: 10,
            groupname: "Kelas-10",
          }),
        ]),
      }),
    );
    expect(result.usedCustomApi).toBe(true);
    expect(result.createdUsers).toEqual([
      { id: 301, username: "student_custom" },
    ]);
  });

  it("falls back to core_user_create_users when local_exam_import_students fails", async () => {
    const mockMoodleClient: MoodleClient = {
      call: vi
        .fn()
        .mockRejectedValueOnce(
          new Error("Function local_exam_import_students not found"),
        )
        .mockResolvedValueOnce([{ id: 302, username: "student_fallback" }]),
    };

    const mockFactory: MoodleClientFactory = {
      createClientForTenant: vi.fn(), createClientForUser: vi.fn().mockResolvedValue(mockMoodleClient),
      createClient: vi.fn().mockReturnValue(mockMoodleClient),
    };

    const repo = new MoodleUserRepository(mockFactory, mockMoodleClient);
    const result = await repo.importStudentsCustom({
      tenantId: "tenant-1",
      users: [
        {
          username: "student_fallback",
          firstname: "Fallback",
          lastname: "Student",
          email: "fallback@example.com",
        },
      ],
    });

    expect(mockMoodleClient.call).toHaveBeenCalledWith(
      "local_exam_import_students",
      expect.any(Object),
    );
    expect(mockMoodleClient.call).toHaveBeenCalledWith(
      "core_user_create_users",
      expect.any(Object),
    );
    expect(result.usedCustomApi).toBe(false);
    expect(result.createdUsers).toEqual([
      { id: 302, username: "student_fallback" },
    ]);
  });
});
