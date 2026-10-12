import { describe, expect, it, vi } from "vitest";
import { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { GetCourseContentsUseCase } from "@/modules/course/application/usecases/GetCourseContentsUseCase";
import { GetCourseDetailUseCase } from "@/modules/course/application/usecases/GetCourseDetailUseCase";
import { GetUserCoursesUseCase } from "@/modules/course/application/usecases/GetUserCoursesUseCase";
import type { CourseSectionResponseDTO } from "@/modules/course/domain/dto/CourseResponseDto";
import { CourseEntity } from "@/modules/course/domain/entity/CourseEntity";
import type { CourseRepositoryInterface } from "@/modules/course/domain/interfaces/CourseRepositoryInterface";

const studentActor: AuthorizationActor = {
  id: "student-1",
  role: AppRole.STUDENT,
  tenantId: "tenant-1",
  moodleUserId: 42,
};

const tenantActor: AuthorizationActor = {
  id: "tenant-admin-1",
  role: AppRole.TENANT,
  tenantId: "tenant-1",
};

const foreignStudentActor: AuthorizationActor = {
  id: "student-no-tenant",
  role: AppRole.STUDENT,
  tenantId: null,
};

function createMockCourse(id: number, shortName: string): CourseEntity {
  return new CourseEntity(id, "tenant-1", {
    id,
    shortName,
    fullName: `Full ${shortName}`,
    displayName: `Display ${shortName}`,
    idNumber: undefined,
    summary: "<p>Course summary</p>",
    format: "topics",
    startDate: 1700000000,
    endDate: undefined,
    categoryId: 2,
    progress: 50,
    isCompleted: false,
    imageUrl: null,
  });
}

class MockCourseRepository implements CourseRepositoryInterface {
  getUserCourses = vi.fn<CourseRepositoryInterface["getUserCourses"]>();
  getTenantCourses = vi.fn<CourseRepositoryInterface["getTenantCourses"]>();
  getCourseContents = vi.fn<CourseRepositoryInterface["getCourseContents"]>();
  getCourseById = vi.fn<CourseRepositoryInterface["getCourseById"]>();
}

describe("Course Use Cases", () => {
  describe("GetUserCoursesUseCase", () => {
    it("fetches enrolled courses for STUDENT actor with moodleUserId", async () => {
      const repo = new MockCourseRepository();
      repo.getUserCourses.mockResolvedValue([
        createMockCourse(101, "MATH101"),
        createMockCourse(102, "PHYS101"),
      ]);

      const useCase = new GetUserCoursesUseCase(repo);
      const result = await useCase.execute({
        actor: studentActor,
        moodleUserId: 42,
      });

      expect(result.isSuccess).toBe(true);
      const data = result.getValue();
      expect(data.total).toBe(2);
      expect(data.courses[0].shortName).toBe("MATH101");
      expect(repo.getUserCourses).toHaveBeenCalledWith({
        tenantId: "tenant-1",
        moodleUserId: 42,
      });
    });

    it("fetches tenant courses for TENANT actor with optional search", async () => {
      const repo = new MockCourseRepository();
      repo.getTenantCourses.mockResolvedValue([
        createMockCourse(101, "MATH101"),
      ]);

      const useCase = new GetUserCoursesUseCase(repo);
      const result = await useCase.execute({
        actor: tenantActor,
        search: "math",
      });

      expect(result.isSuccess).toBe(true);
      const data = result.getValue();
      expect(data.total).toBe(1);
      expect(repo.getTenantCourses).toHaveBeenCalledWith({
        tenantId: "tenant-1",
        search: "math",
      });
    });

    it("fails when STUDENT actor has no tenantId", async () => {
      const repo = new MockCourseRepository();
      const useCase = new GetUserCoursesUseCase(repo);

      const result = await useCase.execute({
        actor: foreignStudentActor,
        moodleUserId: 10,
      });

      expect(result.isFailure).toBe(true);
      expect(result.getError().message).toMatch(/tenant/i);
    });

    it("fails when an invalid role attempts to access courses", async () => {
      const repo = new MockCourseRepository();
      const useCase = new GetUserCoursesUseCase(repo);

      const result = await useCase.execute({
        actor: {
          id: "unknown",
          role: "GUEST" as AppRole,
          tenantId: "tenant-1",
        },
      });

      expect(result.isFailure).toBe(true);
    });
  });

  describe("GetCourseContentsUseCase", () => {
    it("fetches course sections and modules successfully", async () => {
      const repo = new MockCourseRepository();
      const mockSections: CourseSectionResponseDTO[] = [
        {
          id: 1,
          name: "Topic 1",
          sectionNumber: 0,
          summary: "Intro",
          isVisible: true,
          modules: [
            {
              id: 10,
              name: "Quiz 1",
              instanceId: 5,
              modName: "quiz",
              url: null,
              isVisible: true,
              completionStatus: 0,
            },
          ],
        },
      ];
      repo.getCourseContents.mockResolvedValue(mockSections);

      const useCase = new GetCourseContentsUseCase(repo);
      const result = await useCase.execute({
        actor: studentActor,
        courseId: 101,
      });

      expect(result.isSuccess).toBe(true);
      const data = result.getValue();
      expect(data).toHaveLength(1);
      expect(data[0].modules[0].modName).toBe("quiz");
      expect(repo.getCourseContents).toHaveBeenCalledWith({
        tenantId: "tenant-1",
        courseId: 101,
      });
    });

    it("fails if non-admin actor is missing tenantId", async () => {
      const repo = new MockCourseRepository();
      const useCase = new GetCourseContentsUseCase(repo);

      const result = await useCase.execute({
        actor: foreignStudentActor,
        courseId: 101,
      });

      expect(result.isFailure).toBe(true);
    });
  });

  describe("GetCourseDetailUseCase", () => {
    it("fetches course detail and sections for enrolled STUDENT actor", async () => {
      const repo = new MockCourseRepository();
      const mockCourse = createMockCourse(101, "MATH101");
      repo.getUserCourses.mockResolvedValue([mockCourse]);
      repo.getCourseContents.mockResolvedValue([
        {
          id: 1,
          name: "Chapter 1",
          sectionNumber: 0,
          summary: "Numbers",
          isVisible: true,
          modules: [],
        },
      ]);

      const useCase = new GetCourseDetailUseCase(repo);
      const result = await useCase.execute({
        actor: studentActor,
        courseId: 101,
      });

      expect(result.isSuccess).toBe(true);
      const data = result.getValue();
      expect(data.course.id).toBe(101);
      expect(data.course.shortName).toBe("MATH101");
      expect(data.sections).toHaveLength(1);
      expect(repo.getUserCourses).toHaveBeenCalledWith({
        tenantId: "tenant-1",
        moodleUserId: 42,
      });
    });

    it("returns NotFoundError if STUDENT actor is not enrolled in the course", async () => {
      const repo = new MockCourseRepository();
      repo.getUserCourses.mockResolvedValue([createMockCourse(999, "OTHER")]);

      const useCase = new GetCourseDetailUseCase(repo);
      const result = await useCase.execute({
        actor: studentActor,
        courseId: 101,
      });

      expect(result.isFailure).toBe(true);
      expect(result.getError().name).toBe("NotFoundError");
      expect(result.getError().message).toMatch(/tidak terdaftar/i);
    });

    it("fetches course detail for TENANT actor via getCourseById", async () => {
      const repo = new MockCourseRepository();
      const mockCourse = createMockCourse(101, "MATH101");
      repo.getCourseById.mockResolvedValue(mockCourse);
      repo.getCourseContents.mockResolvedValue([]);

      const useCase = new GetCourseDetailUseCase(repo);
      const result = await useCase.execute({
        actor: tenantActor,
        courseId: 101,
      });

      expect(result.isSuccess).toBe(true);
      const data = result.getValue();
      expect(data.course.id).toBe(101);
      expect(repo.getCourseById).toHaveBeenCalledWith({
        tenantId: "tenant-1",
        courseId: 101,
      });
    });

    it("returns NotFoundError for TENANT actor if course does not exist", async () => {
      const repo = new MockCourseRepository();
      repo.getCourseById.mockResolvedValue(null);

      const useCase = new GetCourseDetailUseCase(repo);
      const result = await useCase.execute({
        actor: tenantActor,
        courseId: 999,
      });

      expect(result.isFailure).toBe(true);
      expect(result.getError().name).toBe("NotFoundError");
    });

    it("fails with ValidationError on invalid courseId", async () => {
      const repo = new MockCourseRepository();
      const useCase = new GetCourseDetailUseCase(repo);

      const result = await useCase.execute({
        actor: studentActor,
        courseId: 0,
      });

      expect(result.isFailure).toBe(true);
      expect(result.getError().name).toBe("ValidationError");
    });
  });
});
