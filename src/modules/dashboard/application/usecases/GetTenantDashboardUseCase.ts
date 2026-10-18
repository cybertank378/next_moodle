import { BaseUseCase } from "@/core/base/BaseUseCase";
import { Result } from "@/core/base/Result";
import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import type { CourseRepositoryInterface } from "@/modules/course/domain/interfaces/CourseRepositoryInterface";
import type { TenantDashboardResponseDto } from "@/modules/dashboard/domain/dto/DashboardResponseDto";
import type { QuizRepositoryInterface } from "@/modules/quiz/domain/interfaces/QuizRepositoryInterface";
import type { UserRepositoryInterface } from "@/modules/user/domain/interfaces/UserRepositoryInterface";

export interface GetTenantDashboardRequest {
  actor: AuthorizationActor;
}

export class GetTenantDashboardUseCase extends BaseUseCase<
  GetTenantDashboardRequest,
  Result<TenantDashboardResponseDto>
> {
  constructor(
    private readonly courseRepo: CourseRepositoryInterface,
    private readonly quizRepo: QuizRepositoryInterface,
    private readonly userRepo: UserRepositoryInterface,
    private readonly clientFactory: MoodleClientFactory,
  ) {
    super();
  }

  async handle(
    request: GetTenantDashboardRequest,
  ): Promise<Result<TenantDashboardResponseDto>> {
    const tenantId = request.actor.tenantId;

    if (!tenantId) {
      return Result.failure(new Error("Tenant ID is required"));
    }

    try {
      const adminClient = await this.clientFactory.createClientForTenant(
        { tenantId, tenantSlug: tenantId, status: "ACTIVE" },
        "admin",
      );

      // Fetch users count
      const usersResult = await this.userRepo.getUsers({
        tenantId,
        query: { page: 1, pageSize: 1 },
        client: adminClient,
      });
      const registeredUsers = usersResult.total;

      // Fetch courses and quizzes
      const courses = await this.courseRepo.getTenantCourses({
        tenantId,
        client: adminClient,
      });
      const courseIds = courses.map((c) => c.id);

      let quizzes: Array<{
        id: number;
        name: string;
        courseId: number;
        timeOpen: number;
        timeClose: number;
        timeLimit: number;
      }> = [];

      if (courseIds.length > 0) {
        quizzes = (await this.quizRepo.getQuizzesByCourses({
          tenantId,
          courseIds,
          client: adminClient,
        })) as any[];
      }

      const now = Math.floor(Date.now() / 1000);
      const activeExams = quizzes.filter((q) => {
        const hasStarted = !q.timeOpen || q.timeOpen <= now;
        const hasNotEnded = !q.timeClose || q.timeClose >= now;
        return hasStarted && hasNotEnded;
      }).length;

      const upcomingExams = quizzes.map((q) => {
        const course = courses.find((c) => c.id === q.courseId);
        let status: "open" | "upcoming" | "published" | "pending" = "pending";
        if (q.timeOpen && q.timeOpen > now) {
          status = "upcoming";
        } else if (!q.timeClose || q.timeClose >= now) {
          status = "open";
        } else {
          status = "published";
        }

        return {
          id: q.id.toString(),
          name: q.name,
          course: course ? course.fullName : "Umum",
          scheduledDate: q.timeOpen
            ? new Date(q.timeOpen * 1000).toLocaleString("id-ID", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : "Tanpa jadwal",
          duration: q.timeLimit ? Math.floor(q.timeLimit / 60) : 0,
          status,
          enrolledCount: 0,
        };
      });

      return Result.ok<TenantDashboardResponseDto>({
        activeExams,
        registeredUsers,
        upcomingExams,
        // questionsInBank & averageScore are left undefined because backend contract has no tenant-wide aggregate endpoint
      });
    } catch (e) {
      return Result.failure(e instanceof Error ? e : new Error(String(e)));
    }
  }
}
