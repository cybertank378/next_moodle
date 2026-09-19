import type { CurrentActor } from "@/core/auth/CurrentActor";
import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import { describe, expect, it, vi } from "vitest";
import { GetMyCoursesUseCase } from "../../application/usecases/GetMyCoursesUseCase";
import { Course } from "../../domain/entities/Course";
import type { CourseRepository } from "../../domain/interfaces/CourseRepository";

describe("GetMyCoursesUseCase", () => {
  const mockActor: CurrentActor = {
    id: "usr_1",
    username: "student1",
    email: "student1@example.com",
    firstname: "Budi",
    lastname: "Santoso",
    moodleUserId: 25,
    tenantId: "tenant_demo",
    roles: ["student"],
  };

  const sampleCourse = new Course({
    id: "crs_tenant_demo_10",
    moodleCourseId: 10,
    fullName: "Fisika Dasar",
    shortName: "PHY101",
    summary: "Konsep dasar mekanika dan termodinamika",
    visibility: "visible",
    enrolledUserCount: 30,
    startDate: new Date("2026-01-01"),
    endDate: new Date("2026-06-01"),
  });

  it("should return mapped course DTOs for authenticated actor", async () => {
    const mockRepo: CourseRepository = {
      getUserCourses: vi.fn().mockResolvedValue([sampleCourse]),
      getCourseById: vi.fn().mockResolvedValue(sampleCourse),
    };

    const useCase = new GetMyCoursesUseCase(mockRepo);
    const result = await useCase.execute(mockActor);

    expect(mockRepo.getUserCourses).toHaveBeenCalledWith(25, "tenant_demo");
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("crs_tenant_demo_10");
    expect(result[0]?.fullName).toBe("Fisika Dasar");
    expect(result[0]?.shortName).toBe("PHY101");
    expect(result[0]?.enrolledUserCount).toBe(30);
  });

  it("should throw UnauthorizedError when actor is null", async () => {
    const mockRepo: CourseRepository = {
      getUserCourses: vi.fn(),
      getCourseById: vi.fn(),
    };

    const useCase = new GetMyCoursesUseCase(mockRepo);
    await expect(useCase.execute(null)).rejects.toThrow(UnauthorizedError);
  });
});
