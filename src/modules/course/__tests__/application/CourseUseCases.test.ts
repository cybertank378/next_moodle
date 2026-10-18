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

const teacherActor: AuthorizationActor = {
  id: "teacher-1",
  role: AppRole.TEACHER,
  tenantId: "tenant-1",
  moodleUserId: 88,
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

const mockSections: CourseSectionResponseDTO[] = [
  {
    id: 1,
    name: "Chapter 1",
    sectionNumber: 0,
    summary: "Numbers",
    isVisible: true,
    modules: [],
  },
];

class MockCourseRepository implements CourseRepositoryInterface {
  getUserCourses = vi.fn<CourseRepositoryInterface["getUserCourses"]>();
  getTenantCourses = vi.fn<CourseRepositoryInterface["getTenantCourses"]>();
  getCourseContents = vi.fn<CourseRepositoryInterface["getCourseContents"]>();
  getCourseById = vi.fn<CourseRepositoryInterface["getCourseById"]>();
}

describe("Course Use Cases", () => {
  describe("GetUserCoursesUseCase", () => {
    it("fetches enrolled courses for STUDENT actor with moodleUserId and client", async () => {
      const repo = new MockCourseRepository();
      repo.getUserCourses.mockResolvedValue([
        createMockCourse(101, "MATH101"),
        createMockCourse(102, "PHYS101"),
      ]);
      const mockClient = { call: vi.fn() } as any;

      const useCase = new GetUserCoursesUseCase(repo);
      const result = await useCase.execute({
        actor: studentActor,
        moodleUserId: 42,
        client: mockClient,
      });

      expect(result.isSuccess).toBe(true);
      const data = result.getValue();
      expect(data.total).toBe(2);
      expect(data.courses[0].shortName).toBe("MATH101");
      expect(repo.getUserCourses).toHaveBeenCalledWith({
        tenantId: "tenant-1",
        moodleUserId: 42,
        client: mockClient,
      });
    });

    it("fails closed when STUDENT actor does not have client or student token provided", async () => {
      const repo = new MockCourseRepository();
      const useCase = new GetUserCoursesUseCase(repo);

      const result = await useCase.execute({
        actor: studentActor,
        moodleUserId: 42,
        // no client or token
      });

      expect(result.isFailure).toBe(true);
      expect(result.getError().message).toMatch(/kredensial|token|client/i);
      expect(repo.getUserCourses).not.toHaveBeenCalled();
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

    it("fetches courses for TEACHER actor using getUserCourses when moodleUserId is provided", async () => {
      const teacherActor: AuthorizationActor = {
        id: "teacher-1",
        role: AppRole.TEACHER,
        tenantId: "tenant-1",
        moodleUserId: 55,
      };

      const repo = new MockCourseRepository();
      repo.getUserCourses.mockResolvedValue([createMockCourse(101, "MATH101")]);
      const mockClient = { call: vi.fn() } as any;

      const useCase = new GetUserCoursesUseCase(repo);
      const result = await useCase.execute({
        actor: teacherActor,
        search: "math",
        client: mockClient,
      });

      expect(result.isSuccess).toBe(true);
      expect(repo.getUserCourses).toHaveBeenCalledWith({
        tenantId: "tenant-1",
        moodleUserId: 55,
        client: mockClient,
      });
    });

    it("falls back to getTenantCourses for TEACHER when getUserCourses fails", async () => {
      const teacherActor: AuthorizationActor = {
        id: "teacher-1",
        role: AppRole.TEACHER,
        tenantId: "tenant-1",
        moodleUserId: 55,
      };

      const repo = new MockCourseRepository();
      repo.getUserCourses.mockRejectedValue(new Error("Moodle error"));
      repo.getTenantCourses.mockResolvedValue([
        createMockCourse(101, "MATH101"),
      ]);
      const mockClient = { call: vi.fn() } as any;

      const useCase = new GetUserCoursesUseCase(repo);
      const result = await useCase.execute({
        actor: teacherActor,
        search: "math",
        client: mockClient,
      });

      expect(result.isSuccess).toBe(true);
      expect(repo.getTenantCourses).toHaveBeenCalledWith({
        tenantId: "tenant-1",
        search: "math",
        client: mockClient,
      });
    });

    it("returns zero courses empty list gracefully when no courses found for TENANT actor", async () => {
      const repo = new MockCourseRepository();
      repo.getTenantCourses.mockResolvedValue([]);

      const useCase = new GetUserCoursesUseCase(repo);
      const result = await useCase.execute({
        actor: tenantActor,
      });

      expect(result.isSuccess).toBe(true);
      const data = result.getValue();
      expect(data.total).toBe(0);
      expect(data.courses).toEqual([]);
    });

    it("enforces tenant isolation by scoping getTenantCourses with session tenantId", async () => {
      const repo = new MockCourseRepository();
      repo.getTenantCourses.mockResolvedValue([]);

      const useCase = new GetUserCoursesUseCase(repo);
      // Even if input has another tenantId, actor tenantId takes precedence
      await useCase.execute({
        actor: tenantActor,
        tenantId: "cross-tenant-override",
      });

      expect(repo.getTenantCourses).toHaveBeenCalledWith(
        expect.objectContaining({
          tenantId: "tenant-1",
        }),
      );
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
      const mockClient = { call: vi.fn() } as any;

      const useCase = new GetCourseDetailUseCase(repo);
      const result = await useCase.execute({
        actor: studentActor,
        courseId: 101,
        client: mockClient,
      });

      expect(result.isSuccess).toBe(true);
      const data = result.getValue();
      expect(data.course.id).toBe(101);
      expect(data.course.shortName).toBe("MATH101");
      expect(data.sections).toHaveLength(1);
      expect(repo.getUserCourses).toHaveBeenCalledWith({
        tenantId: "tenant-1",
        moodleUserId: 42,
        client: mockClient,
      });
      expect(repo.getCourseContents).toHaveBeenCalledWith({
        tenantId: "tenant-1",
        courseId: 101,
        client: mockClient,
      });
    });

    it("fails closed when STUDENT actor accesses course detail without client", async () => {
      const repo = new MockCourseRepository();
      const useCase = new GetCourseDetailUseCase(repo);

      const result = await useCase.execute({
        actor: studentActor,
        courseId: 101,
      });

      expect(result.isFailure).toBe(true);
      expect(result.getError().message).toMatch(/kredensial|token|client/i);
      expect(repo.getUserCourses).not.toHaveBeenCalled();
    });

    it("returns NotFoundError if STUDENT actor is not enrolled in the course", async () => {
      const repo = new MockCourseRepository();
      repo.getUserCourses.mockResolvedValue([createMockCourse(999, "OTHER")]);
      const mockClient = { call: vi.fn() } as any;

      const useCase = new GetCourseDetailUseCase(repo);
      const result = await useCase.execute({
        actor: studentActor,
        courseId: 101,
        client: mockClient,
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

    it("fetches course detail for TEACHER actor via getUserCourses when enrolled", async () => {
      const repo = new MockCourseRepository();
      repo.getUserCourses.mockResolvedValue([createMockCourse(101, "MATH101")]);
      repo.getCourseContents.mockResolvedValue(mockSections);
      const mockClient = { call: vi.fn() } as any;

      const useCase = new GetCourseDetailUseCase(repo);
      const result = await useCase.execute({
        actor: teacherActor,
        courseId: 101,
        client: mockClient,
      });

      expect(result.isSuccess).toBe(true);
      const data = result.getValue();
      expect(data.course.id).toBe(101);
      expect(repo.getUserCourses).toHaveBeenCalledWith({
        tenantId: "tenant-1",
        moodleUserId: 88,
        client: mockClient,
      });
      expect(repo.getCourseById).not.toHaveBeenCalled();
    });

    it("falls back to getCourseById for TEACHER actor if not in enrolled courses", async () => {
      const repo = new MockCourseRepository();
      repo.getUserCourses.mockResolvedValue([]);
      repo.getCourseById.mockResolvedValue(createMockCourse(202, "PHYS202"));
      repo.getCourseContents.mockResolvedValue(mockSections);
      const mockClient = { call: vi.fn() } as any;

      const useCase = new GetCourseDetailUseCase(repo);
      const result = await useCase.execute({
        actor: teacherActor,
        courseId: 202,
        client: mockClient,
      });

      expect(result.isSuccess).toBe(true);
      const data = result.getValue();
      expect(data.course.id).toBe(202);
      expect(repo.getCourseById).toHaveBeenCalledWith({
        tenantId: "tenant-1",
        courseId: 202,
        client: mockClient,
      });
    });
  });
});
