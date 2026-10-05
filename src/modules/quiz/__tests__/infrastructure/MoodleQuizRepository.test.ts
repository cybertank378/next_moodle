import { describe, expect, it, vi } from "vitest";
import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import type { MoodleClient } from "@/core/moodle/types";
import { MoodleQuizRepository } from "@/modules/quiz/infrastructure/repo/MoodleQuizRepository";

describe("MoodleQuizRepository", () => {
  it("fetches quizzes by courses via mod_quiz_get_quizzes_by_courses", async () => {
    const mockClient: MoodleClient = {
      call: vi.fn().mockResolvedValue({
        quizzes: [
          {
            id: 201,
            course: 10,
            coursemodule: 45,
            name: "Kuis Matematika Diskrit",
            intro: "<p>Kuis Bab 1</p>",
            timeopen: 1700000000,
            timeclose: 1700003600,
            timelimit: 1800,
            attempts: 1,
            grade: 100,
            visible: 1,
          },
        ],
      }),
    };

    const mockFactory: MoodleClientFactory = {
      createClient: vi.fn(),
      createClientForTenant: vi.fn(), createClientForUser: vi.fn().mockResolvedValue(mockClient as any),
    };

    const repo = new MoodleQuizRepository(mockFactory);
    const quizzes = await repo.getQuizzesByCourses({
      tenantId: "tenant-1",
      courseIds: [10],
    });

    expect(quizzes).toHaveLength(1);
    expect(quizzes[0].id).toBe(201);
    expect(quizzes[0].name).toBe("Kuis Matematika Diskrit");
    expect(mockClient.call).toHaveBeenCalledWith(
      "mod_quiz_get_quizzes_by_courses",
      { courseids: [10] },
    );
  });

  it("finds quiz by id via getQuizById", async () => {
    const mockClient: MoodleClient = {
      call: vi.fn().mockResolvedValue([
        {
          id: 301,
          course: 5,
          coursemodule: 12,
          name: "Ujian Biologi Sel",
          timeopen: 0,
          timeclose: 0,
          timelimit: 0,
          attempts: 0,
          visible: 1,
        },
      ]),
    };

    const mockFactory: MoodleClientFactory = {
      createClient: vi.fn(),
      createClientForTenant: vi.fn(), createClientForUser: vi.fn().mockResolvedValue(mockClient as any),
    };

    const repo = new MoodleQuizRepository(mockFactory);
    const quiz = await repo.getQuizById({
      tenantId: "tenant-1",
      quizId: 301,
    });

    expect(quiz).not.toBeNull();
    expect(quiz?.id).toBe(301);
    expect(quiz?.name).toBe("Ujian Biologi Sel");
  });

  it("calls mod_quiz_get_quiz_access_information and returns access info", async () => {
    const mockClient: MoodleClient = {
      call: vi.fn().mockResolvedValue({
        canattempt: true,
        preventaccessreasons: [],
      }),
    };

    const mockFactory: MoodleClientFactory = {
      createClient: vi.fn(),
      createClientForTenant: vi.fn(), createClientForUser: vi.fn().mockResolvedValue(mockClient as any),
    };

    const repo = new MoodleQuizRepository(mockFactory);
    const info = await repo.getQuizAccessInfo({
      tenantId: "tenant-1",
      quizId: 301,
    });

    expect(info?.canattempt).toBe(true);
    expect(mockClient.call).toHaveBeenCalledWith(
      "mod_quiz_get_quiz_access_information",
      { quizid: 301 },
    );
  });
});
