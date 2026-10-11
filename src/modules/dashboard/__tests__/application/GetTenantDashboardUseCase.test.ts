import { describe, expect, it, vi } from "vitest";
import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import { AppRole } from "@/core/rbac/AppRole";
import type { CourseRepositoryInterface } from "@/modules/course/domain/interfaces/CourseRepositoryInterface";
import { GetTenantDashboardUseCase } from "@/modules/dashboard/application/usecases/GetTenantDashboardUseCase";
import type { QuizRepositoryInterface } from "@/modules/quiz/domain/interfaces/QuizRepositoryInterface";
import type { UserRepositoryInterface } from "@/modules/user/domain/interfaces/UserRepositoryInterface";

const tenantId = "6e1ed49f-3112-4c89-92ec-7ba2f1fb3295";

describe("GetTenantDashboardUseCase", () => {
  it("mengambil metrik tenant nyata dari repositori dan mengembalikan nilai jujur", async () => {
    const courseRepo: CourseRepositoryInterface = {
      getUserCourses: vi.fn(),
      getTenantCourses: vi.fn().mockResolvedValue([
        { id: 101, fullName: "Matematika X", shortName: "MTK10" },
      ]),
      getCourseContents: vi.fn(),
    };

    const now = Math.floor(Date.now() / 1000);
    const quizRepo: QuizRepositoryInterface = {
      getQuizzesByCourses: vi.fn().mockResolvedValue([
        {
          id: 1,
          name: "Kuis Aljabar",
          courseId: 101,
          timeOpen: now - 3600,
          timeClose: now + 3600,
          timeLimit: 3600,
        },
      ]),
      getQuizById: vi.fn(),
      getQuizAccessInfo: vi.fn(),
    };

    const userRepo: UserRepositoryInterface = {
      getUsers: vi.fn().mockResolvedValue({
        users: [],
        total: 125,
        page: 1,
        pageSize: 1,
      }),
      getUserById: vi.fn(),
      createUsers: vi.fn(),
      updateUser: vi.fn(),
      importUsers: vi.fn(),
    };

    const clientFactory = {
      createClientForTenant: vi.fn().mockResolvedValue({}),
    } as unknown as MoodleClientFactory;

    const useCase = new GetTenantDashboardUseCase(
      courseRepo,
      quizRepo,
      userRepo,
      clientFactory,
    );

    const result = await useCase.execute({
      actor: {
        id: "tenant-admin-1",
        role: AppRole.TENANT,
        tenantId,
        moodleUserId: 2,
        displayName: "Admin Sekolah",
      },
    });

    expect(result.isSuccess).toBe(true);
    const data = result.getValue();
    expect(data.registeredUsers).toBe(125);
    expect(data.activeExams).toBe(1);
    expect(data.questionsInBank).toBeUndefined();
    expect(data.averageScore).toBeUndefined();
    expect(data.upcomingExams).toHaveLength(1);
    expect(data.upcomingExams[0].name).toBe("Kuis Aljabar");
  });

  it("gagal jika tenantId tidak tersedia pada actor", async () => {
    const courseRepo = {} as CourseRepositoryInterface;
    const quizRepo = {} as QuizRepositoryInterface;
    const userRepo = {} as UserRepositoryInterface;
    const clientFactory = {} as MoodleClientFactory;

    const useCase = new GetTenantDashboardUseCase(
      courseRepo,
      quizRepo,
      userRepo,
      clientFactory,
    );

    const result = await useCase.execute({
      actor: {
        id: "admin-1",
        role: AppRole.ADMIN,
        tenantId: null,
        moodleUserId: null,
        displayName: "Super Admin",
      },
    });

    expect(result.isFailure).toBe(true);
  });
});
