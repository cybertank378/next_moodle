import { beforeEach, describe, expect, it, vi } from "vitest";
import type { MoodleClient } from "@/core/moodle/types";
import type { CourseEntity } from "@/modules/course/domain/entity/CourseEntity";
import type { CourseRepositoryInterface } from "@/modules/course/domain/interfaces/CourseRepositoryInterface";
import type { QuizEntity } from "@/modules/quiz/domain/entity/QuizEntity";
import type { QuizRepositoryInterface } from "@/modules/quiz/domain/interfaces/QuizRepositoryInterface";
import { MoodleScheduleRepository } from "@/modules/schedule/infrastructure/repo/MoodleScheduleRepository";

describe("MoodleScheduleRepository", () => {
  let courseRepo: CourseRepositoryInterface;
  let quizRepo: QuizRepositoryInterface;
  let scheduleRepo: MoodleScheduleRepository;
  let mockClient: MoodleClient;

  beforeEach(() => {
    mockClient = { call: vi.fn() } as unknown as MoodleClient;

    courseRepo = {
      getUserCourses: vi.fn(),
      getTenantCourses: vi.fn(),
      getCourseContents: vi.fn(),
      getCourseById: vi.fn(),
    };

    quizRepo = {
      getQuizzesByCourses: vi.fn(),
      getQuizById: vi.fn(),
      getQuizAccessInfo: vi.fn(),
    };

    scheduleRepo = new MoodleScheduleRepository(courseRepo, quizRepo);
  });

  it("returns schedule sessions within range from enrolled quizzes", async () => {
    const mockCourses = [
      {
        id: 10,
        fullName: "Fisika Dasar",
        shortName: "FIS-101",
        category: 1,
      } as unknown as CourseEntity,
    ];

    const mockQuizzes = [
      {
        id: 99,
        courseId: 10,
        name: "Kuis Bab 1 Fisika",
        intro: "Kerjakan dengan jujur",
        timeOpen: 1792000000, // timestamp seconds
        timeClose: 1792003600,
        timeLimitSeconds: 3600,
      } as unknown as QuizEntity,
    ];

    vi.mocked(courseRepo.getUserCourses).mockResolvedValue(mockCourses);
    vi.mocked(quizRepo.getQuizzesByCourses).mockResolvedValue(mockQuizzes);

    const fromDate = new Date(1791900000 * 1000);
    const toDate = new Date(1792100000 * 1000);

    const sessions = await scheduleRepo.getStudentSchedule({
      tenantId: "tenant-1",
      moodleUserId: 5,
      from: fromDate,
      to: toDate,
      client: mockClient,
    });

    expect(sessions).toHaveLength(1);
    expect(sessions[0].id).toBe("quiz-99");
    expect(sessions[0].title).toBe("Kuis Bab 1 Fisika");
    expect(sessions[0].courseName).toBe("Fisika Dasar");
    expect(sessions[0].subjectCode).toBe("FIS-101");
  });

  it("filters out quizzes not in range or when student is not enrolled", async () => {
    vi.mocked(courseRepo.getUserCourses).mockResolvedValue([]);

    const sessions = await scheduleRepo.getStudentSchedule({
      tenantId: "tenant-1",
      moodleUserId: 5,
      from: new Date("2026-10-01"),
      to: new Date("2026-10-31"),
      client: mockClient,
    });

    expect(sessions).toHaveLength(0);
  });
});
