import { describe, expect, it, vi } from "vitest";
import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import type { MoodleClient } from "@/core/moodle/types";
import { MoodleGradeRepository } from "../../infrastructure/repo/MoodleGradeRepository";

describe("MoodleGradeRepository", () => {
  it("should fetch user grades from gradereport_user_get_grade_items", async () => {
    const mockMoodleClient: MoodleClient = {
      call: vi.fn().mockImplementation((func: string) => {
        if (func === "gradereport_user_get_grade_items") {
          return Promise.resolve({
            usergrades: [
              {
                courseid: 10,
                userid: 100,
                userfullname: "Alice",
                gradeitems: [
                  {
                    id: 1,
                    itemname: "Kuis 1",
                    itemtype: "mod",
                    itemmodule: "quiz",
                    graderaw: 90,
                    gradeformatted: "90.00",
                    grademin: 0,
                    grademax: 100,
                    gradepass: 70,
                  },
                ],
              },
            ],
          });
        }
        return Promise.resolve({});
      }),
    } as unknown as MoodleClient;

    const mockFactory: MoodleClientFactory = {
      createClientForTenant: vi.fn().mockResolvedValue(mockMoodleClient),
      createClient: vi.fn().mockReturnValue(mockMoodleClient),
    };

    const repo = new MoodleGradeRepository(mockFactory, mockMoodleClient);
    const report = await repo.getUserGradeReport(
      "tenant-1",
      10,
      100,
      "token-1",
    );

    expect(report.userId).toBe(100);
    expect(report.items).toHaveLength(1);
    expect(report.items[0].gradeRaw).toBe(90);
  });

  it("should fetch course grades from core_grades_get_grades", async () => {
    const mockMoodleClient: MoodleClient = {
      call: vi.fn().mockImplementation((func: string) => {
        if (func === "core_grades_get_grades") {
          return Promise.resolve({
            items: [
              {
                activityid: 5,
                name: "Quiz Bab 1",
                grades: [
                  {
                    id: 1,
                    userid: 101,
                    grade: 85,
                    str_grade: "85.00",
                  },
                ],
              },
            ],
          });
        }
        return Promise.resolve({});
      }),
    } as unknown as MoodleClient;

    const mockFactory: MoodleClientFactory = {
      createClientForTenant: vi.fn().mockResolvedValue(mockMoodleClient),
      createClient: vi.fn().mockReturnValue(mockMoodleClient),
    };

    const repo = new MoodleGradeRepository(mockFactory, mockMoodleClient);
    const reports = await repo.getCourseGrades("tenant-1", 10, 5);

    expect(reports).toHaveLength(1);
    expect(reports[0].userId).toBe(101);
    expect(reports[0].items[0].itemName).toBe("Quiz Bab 1");
  });
});
