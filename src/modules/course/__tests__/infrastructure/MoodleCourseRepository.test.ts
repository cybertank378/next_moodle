import { describe, expect, it, vi } from "vitest";
import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import type { MoodleClient } from "@/core/moodle/types";
import { MoodleCourseRepository } from "@/modules/course/infrastructure/repo/MoodleCourseRepository";

describe("MoodleCourseRepository", () => {
  it("fetches user courses via core_enrol_get_users_courses", async () => {
    const mockClient: MoodleClient = {
      call: vi.fn().mockResolvedValue([
        {
          id: 10,
          shortname: "BIO101",
          fullname: "Biology 101",
          displayname: "Biology 101 (2026)",
          idnumber: "BIO-101",
          summary: "Intro to Bio",
          summaryformat: 1,
          format: "topics",
          showgrades: true,
          lang: "en",
          enablecompletion: true,
          completionhascriteria: false,
          completionusertracked: true,
          category: 2,
          progress: 80,
          completed: false,
          startdate: 1700000000,
          enddate: 0,
          marker: 0,
          lastaccess: 1700100000,
          isfavourite: false,
          hidden: false,
          overviewfiles: [],
        },
      ]),
    };

    const mockFactory: MoodleClientFactory = {
      createClient: vi.fn(),
      createClientForTenant: vi.fn(),
      createClientForUser: vi.fn().mockResolvedValue(mockClient as any),
    };

    const repo = new MoodleCourseRepository(mockFactory);
    const courses = await repo.getUserCourses({
      tenantId: "tenant-1",
      moodleUserId: 123,
    });

    expect(courses).toHaveLength(1);
    expect(courses[0].id).toBe(10);
    expect(courses[0].shortName).toBe("BIO101");
    expect(courses[0].progress).toBe(80);
    expect(mockClient.call).toHaveBeenCalledWith(
      "core_enrol_get_users_courses",
      { userid: 123 },
    );
  });

  it("fetches tenant courses and filters out site course (id: 1)", async () => {
    const mockClient: MoodleClient = {
      call: vi.fn().mockResolvedValue([
        {
          id: 1,
          shortname: "FrontPage",
          fullname: "My School Site",
          displayname: "My School Site",
        },
        {
          id: 20,
          shortname: "CHEM101",
          fullname: "Chemistry 101",
          displayname: "General Chemistry",
        },
        {
          id: 21,
          shortname: "HIST101",
          fullname: "History 101",
          displayname: "World History",
        },
      ]),
    };

    const mockFactory: MoodleClientFactory = {
      createClient: vi.fn(),
      createClientForTenant: vi.fn(),
      createClientForUser: vi.fn().mockResolvedValue(mockClient as any),
    };

    const repo = new MoodleCourseRepository(mockFactory);
    const courses = await repo.getTenantCourses({
      tenantId: "tenant-1",
      search: "chem",
    });

    expect(courses).toHaveLength(1);
    expect(courses[0].id).toBe(20);
    expect(courses[0].shortName).toBe("CHEM101");
    expect(mockClient.call).toHaveBeenCalledWith("core_course_get_courses", {});
  });

  it("fetches course contents via core_course_get_contents", async () => {
    const mockClient: MoodleClient = {
      call: vi.fn().mockResolvedValue([
        {
          id: 1,
          name: "General",
          section: 0,
          summary: "General Section",
          summaryformat: 1,
          visible: 1,
          modules: [
            {
              id: 100,
              name: "Quiz 1",
              instance: 5,
              modname: "quiz",
              modplural: "Quizzes",
              visible: 1,
              uservisible: true,
              visibleoncoursepage: 1,
              completion: 1,
            },
          ],
        },
      ]),
    };

    const mockFactory: MoodleClientFactory = {
      createClient: vi.fn(),
      createClientForTenant: vi.fn(),
      createClientForUser: vi.fn().mockResolvedValue(mockClient as any),
    };

    const repo = new MoodleCourseRepository(mockFactory);
    const sections = await repo.getCourseContents({
      tenantId: "tenant-1",
      courseId: 20,
    });

    expect(sections).toHaveLength(1);
    expect(sections[0].name).toBe("General");
    expect(sections[0].modules[0].modName).toBe("quiz");
    expect(mockClient.call).toHaveBeenCalledWith("core_course_get_contents", {
      courseid: 20,
    });
  });
});
