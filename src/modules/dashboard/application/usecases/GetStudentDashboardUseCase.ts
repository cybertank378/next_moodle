import { Result } from "@/core/base/Result";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import type { StudentDashboardResponseDto } from "@/modules/dashboard/domain/dto/DashboardResponseDto";
import type { CourseRepositoryInterface } from "@/modules/course/domain/interfaces/CourseRepositoryInterface";
import type { QuizRepositoryInterface } from "@/modules/quiz/domain/interfaces/QuizRepositoryInterface";
import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";

export interface GetStudentDashboardRequest {
  actor: AuthorizationActor;
  moodleToken: string;
}

export class GetStudentDashboardUseCase {
  constructor(
    private readonly courseRepo: CourseRepositoryInterface,
    private readonly quizRepo: QuizRepositoryInterface,
    private readonly clientFactory: MoodleClientFactory,
  ) {}

  async execute(
    request: GetStudentDashboardRequest,
  ): Promise<Result<StudentDashboardResponseDto>> {
    const tenantId = request.actor.tenantId;
    const moodleUserId = request.actor.moodleUserId;

    if (!tenantId || !moodleUserId) {
        return Result.failure(new Error("Tenant ID or Moodle User ID missing"));
    }

    try {
        const userClient = await this.clientFactory.createClientForUser(
          { tenantId, tenantSlug: tenantId, status: "ACTIVE" },
          request.moodleToken
        );

        const rawCourses = await this.courseRepo.getUserCourses({ tenantId, moodleUserId, client: userClient });
        const courseIds = rawCourses.map(c => c.id);
        
        let quizzes: any[] = [];
        if (courseIds.length > 0) {
            quizzes = await this.quizRepo.getQuizzesByCourses({ tenantId, courseIds, client: userClient });
        }

        const upcomingExams = quizzes.map(q => {
            const course = rawCourses.find(c => c.id === q.courseId);
            return {
                id: q.id.toString(),
                name: q.name,
                course: course ? course.fullName : "Uncategorized",
                scheduledDate: q.timeOpen ? new Date(q.timeOpen * 1000).toLocaleString() : "No schedule",
                duration: q.timeLimit ? Math.floor(q.timeLimit / 60) : 0,
                status: "open" as const
            };
        });

        const courses = rawCourses.map(c => ({
            id: c.id.toString(),
            name: c.fullName,
            shortName: c.shortName,
            instructor: "Guru Pengampu", 
            progress: c.progress || 0
        }));

        return Result.ok<StudentDashboardResponseDto>({
          upcomingExams,
          courses
        });
    } catch (e) {
        return Result.failure(e instanceof Error ? e : new Error(String(e)));
    }
  }
}
