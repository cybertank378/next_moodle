import { describe, expect, it, vi } from "vitest";
import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import { AppRole } from "@/core/rbac/AppRole";
import type { CourseRepositoryInterface } from "@/modules/course/domain/interfaces/CourseRepositoryInterface";
import { GetStudentDashboardUseCase } from "@/modules/dashboard/application/usecases/GetStudentDashboardUseCase";
import type { GradeRepositoryInterface } from "@/modules/grades/domain/interfaces/GradeRepositoryInterface";
import type { QuizRepositoryInterface } from "@/modules/quiz/domain/interfaces/QuizRepositoryInterface";
import { Tenant } from "@/modules/tenant/domain/entity/TenantEntity";

const tenantId = "6e1ed49f-3112-4c89-92ec-7ba2f1fb3295";

function makeDependencies() {
  const courseRepo: CourseRepositoryInterface = {
    getUserCourses: vi.fn().mockResolvedValue([]),
    getTenantCourses: vi.fn(),
    getCourseContents: vi.fn(),
  };
  const quizRepo: QuizRepositoryInterface = {
    getQuizzesByCourses: vi.fn(),
    getQuizById: vi.fn(),
    getQuizAccessInfo: vi.fn(),
  };
  const gradeRepo: GradeRepositoryInterface = {
    getUserGradeReport: vi.fn(),
    getCourseGrades: vi.fn(),
  };
  const clientFactory = {
    createClientForUser: vi.fn().mockResolvedValue({}),
  } as unknown as MoodleClientFactory;
  const tenantRepo = {
    findById: vi.fn().mockResolvedValue(
      new Tenant({
        id: tenantId,
        slug: "sma-negeri-1-jakarta",
        name: "SMA Negeri 1 Jakarta",
        status: "ACTIVE",
        customDomain: null,
        credential: null,
        branding: null,
        createdAt: new Date("2026-01-01T00:00:00Z"),
        updatedAt: new Date("2026-01-01T00:00:00Z"),
      }),
    ),
  };

  return { courseRepo, quizRepo, gradeRepo, clientFactory, tenantRepo };
}

describe("GetStudentDashboardUseCase", () => {
  it("menggunakan nama tenant sebagai schoolName, bukan tenant ID", async () => {
    const dependencies = makeDependencies();
    const useCase = new GetStudentDashboardUseCase(
      dependencies.courseRepo,
      dependencies.quizRepo,
      dependencies.gradeRepo,
      dependencies.clientFactory,
      dependencies.tenantRepo,
    );

    const result = await useCase.execute({
      actor: {
        id: "student-1",
        role: AppRole.STUDENT,
        tenantId,
        moodleUserId: 42,
        displayName: "Siswa Satu",
      },
      moodleToken: "student-token",
    });

    expect(result.isSuccess).toBe(true);
    expect(result.getValue().profile?.schoolName).toBe("SMA Negeri 1 Jakarta");
    expect(dependencies.tenantRepo.findById).toHaveBeenCalledWith(tenantId);
  });
});
