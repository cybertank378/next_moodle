import { describe, expect, it, vi } from "vitest";
import type { MoodleClient } from "@/core/moodle/types";
import { MoodleCalendarRepository } from "@/modules/calendar/infrastructure/repo/MoodleCalendarRepository";
import { CourseEntity } from "@/modules/course/domain/entity/CourseEntity";
import type { CourseRepositoryInterface } from "@/modules/course/domain/interfaces/CourseRepositoryInterface";
import { QuizEntity } from "@/modules/quiz/domain/entity/QuizEntity";
import type { QuizRepositoryInterface } from "@/modules/quiz/domain/interfaces/QuizRepositoryInterface";

function createCourse(id: number, shortName: string): CourseEntity {
  return new CourseEntity(id, "tenant-1", {
    id,
    shortName,
    fullName: `Full ${shortName}`,
    displayName: `Display ${shortName}`,
    format: "topics",
    summary: "",
    summaryFormat: 1,
    showGrades: true,
    progress: 50,
    isCompleted: false,
    categoryId: 1,
    startDate: 1700000000,
    imageUrl: null,
  } as any);
}

function createQuiz(
  id: number,
  courseId: number,
  name: string,
  timeOpen = 0,
  timeClose = 0,
): QuizEntity {
  return new QuizEntity(id, "tenant-1", {
    id,
    courseId,
    courseModuleId: id + 100,
    name,
    intro: "Intro quiz",
    timeOpen,
    timeClose,
    timeLimitSeconds: 3600,
    maxAttempts: 1,
    grade: 100,
    isVisible: true,
  });
}

describe("MoodleCalendarRepository", () => {
  it("aggregates quizzes from enrolled courses into calendar events within date window", async () => {
    const mockCourseRepo: CourseRepositoryInterface = {
      getUserCourses: vi.fn().mockResolvedValue([createCourse(101, "MATH101")]),
      getTenantCourses: vi.fn(),
      getCourseContents: vi.fn(),
      getCourseById: vi.fn(),
    };

    // October 15, 2026 UTC = 1792051200 seconds
    const timeOpenSec = Math.floor(
      new Date("2026-10-15T08:00:00Z").getTime() / 1000,
    );
    const timeCloseSec = Math.floor(
      new Date("2026-10-15T10:00:00Z").getTime() / 1000,
    );

    const mockQuizRepo: QuizRepositoryInterface = {
      getQuizzesByCourses: vi.fn().mockResolvedValue([
        createQuiz(1, 101, "Kuis Aljabar", timeOpenSec, timeCloseSec),
        // Outside range quiz: December 2026
        createQuiz(
          2,
          101,
          "Kuis Geometri",
          Math.floor(new Date("2026-12-01T08:00:00Z").getTime() / 1000),
        ),
      ]),
      getQuizById: vi.fn(),
      getQuizAccessInfo: vi.fn(),
    };

    const repo = new MoodleCalendarRepository(mockCourseRepo, mockQuizRepo);
    const mockClient = { call: vi.fn() } as unknown as MoodleClient;

    const events = await repo.getStudentCalendarEvents({
      tenantId: "tenant-1",
      moodleUserId: 42,
      from: new Date("2026-10-01T00:00:00Z"),
      to: new Date("2026-10-31T23:59:59Z"),
      client: mockClient,
    });

    expect(events).toHaveLength(1);
    expect(events[0].id).toBe("quiz-1");
    expect(events[0].sourceType).toBe("QUIZ_EXAM");
    expect(events[0].title).toBe("Kuis Aljabar");
    expect(events[0].courseId).toBe(101);
    expect(events[0].courseName).toBe("Full MATH101");
    expect(events[0].detailRoute).toBe("/dashboard/exams/1");
  });

  it("returns empty array when student has no enrolled courses", async () => {
    const mockCourseRepo: CourseRepositoryInterface = {
      getUserCourses: vi.fn().mockResolvedValue([]),
      getTenantCourses: vi.fn(),
      getCourseContents: vi.fn(),
      getCourseById: vi.fn(),
    };
    const mockQuizRepo: QuizRepositoryInterface = {
      getQuizzesByCourses: vi.fn(),
      getQuizById: vi.fn(),
      getQuizAccessInfo: vi.fn(),
    };

    const repo = new MoodleCalendarRepository(mockCourseRepo, mockQuizRepo);
    const mockClient = { call: vi.fn() } as unknown as MoodleClient;

    const events = await repo.getStudentCalendarEvents({
      tenantId: "tenant-1",
      moodleUserId: 42,
      from: new Date("2026-10-01T00:00:00Z"),
      to: new Date("2026-10-31T23:59:59Z"),
      client: mockClient,
    });

    expect(events).toHaveLength(0);
    expect(mockQuizRepo.getQuizzesByCourses).not.toHaveBeenCalled();
  });
});
