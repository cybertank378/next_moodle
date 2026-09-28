import { describe, expect, it, vi } from "vitest";
import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { AuthorizationError } from "@/core/rbac/AuthorizationError";
import { Permission } from "@/core/rbac/Permission";
import { GetCourseGradesUseCase } from "../../application/usecases/GetCourseGradesUseCase";
import { GetUserGradesUseCase } from "../../application/usecases/GetUserGradesUseCase";
import {
  GradeItemEntity,
  UserGradeReportEntity,
} from "../../domain/entity/GradeItemEntity";
import type { GradeRepositoryInterface } from "../../domain/interfaces/GradeRepositoryInterface";

describe("GradeUseCases", () => {
  const mockGradeItem = new GradeItemEntity({
    id: 1,
    itemName: "UTS Matematika",
    itemType: "mod",
    itemModule: "quiz",
    itemInstance: 12,
    gradeRaw: 88,
    gradeFormatted: "88.00",
    gradeMin: 0,
    gradeMax: 100,
    gradePass: 75,
    percentageFormatted: "88%",
    feedback: null,
  });

  const mockReport = new UserGradeReportEntity({
    courseId: 10,
    userId: 100,
    userFullName: "Budi Santoso",
    items: [mockGradeItem],
    courseTotal: null,
  });

  const mockRepo: GradeRepositoryInterface = {
    getUserGradeReport: vi.fn().mockResolvedValue(mockReport),
    getCourseGrades: vi.fn().mockResolvedValue([mockReport]),
  };

  describe("GetUserGradesUseCase", () => {
    it("should allow student to fetch own grades", async () => {
      const useCase = new GetUserGradesUseCase(mockRepo);
      const res = await useCase.execute({
        actor: {
          id: "student-1",
          role: AppRole.STUDENT,
          tenantId: "tenant-1",
          moodleUserId: 100,
          permissions: [Permission.GRADE_READ_OWN],
        },
        courseId: 10,
        userId: 100,
      });

      expect(res.userId).toBe(100);
      expect(res.items).toHaveLength(1);
      expect(res.items[0].itemName).toBe("UTS Matematika");
    });

    it("should reject student attempting to access another student's report", async () => {
      const useCase = new GetUserGradesUseCase(mockRepo);
      await expect(
        useCase.execute({
          actor: {
            id: "student-1",
            role: AppRole.STUDENT,
            tenantId: "tenant-1",
            moodleUserId: 100,
            permissions: [Permission.GRADE_READ_OWN],
          },
          courseId: 10,
          userId: 999,
        }),
      ).rejects.toThrow(AuthorizationError);
    });

    it("should throw UnauthorizedError when actor is missing", async () => {
      const useCase = new GetUserGradesUseCase(mockRepo);
      await expect(
        useCase.execute({
          actor: null as unknown as AuthorizationActor,
          courseId: 10,
        }),
      ).rejects.toThrow(UnauthorizedError);
    });
  });

  describe("GetCourseGradesUseCase", () => {
    it("should allow teacher/tenant to fetch course grades", async () => {
      const useCase = new GetCourseGradesUseCase(mockRepo);
      const res = await useCase.execute({
        actor: {
          id: "tenant-admin-1",
          role: AppRole.TENANT,
          tenantId: "tenant-1",
          permissions: [Permission.GRADE_READ],
        },
        courseId: 10,
      });

      expect(res.courseId).toBe(10);
      expect(res.reports).toHaveLength(1);
    });

    it("should reject student attempting to fetch entire course class grades", async () => {
      const useCase = new GetCourseGradesUseCase(mockRepo);
      await expect(
        useCase.execute({
          actor: {
            id: "student-1",
            role: AppRole.STUDENT,
            tenantId: "tenant-1",
            moodleUserId: 100,
            permissions: [Permission.GRADE_READ_OWN],
          },
          courseId: 10,
        }),
      ).rejects.toThrow(AuthorizationError);
    });
  });
});
