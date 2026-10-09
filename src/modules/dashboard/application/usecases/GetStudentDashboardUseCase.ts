import { Result } from "@/core/base/Result";
import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import type { CourseRepositoryInterface } from "@/modules/course/domain/interfaces/CourseRepositoryInterface";
import type {
  GradeSummaryDto,
  StudentDashboardResponseDto,
} from "@/modules/dashboard/domain/dto/DashboardResponseDto";
import type { GradeRepositoryInterface } from "@/modules/grades/domain/interfaces/GradeRepositoryInterface";
import type { QuizEntity } from "@/modules/quiz/domain/entity/QuizEntity";
import type { QuizRepositoryInterface } from "@/modules/quiz/domain/interfaces/QuizRepositoryInterface";
import type { TenantsRepository } from "@/modules/tenant/domain/interfaces/TenantInterfaces";

export interface GetStudentDashboardRequest {
  actor: AuthorizationActor;
  moodleToken: string;
}

export class GetStudentDashboardUseCase {
  constructor(
    private readonly courseRepo: CourseRepositoryInterface,
    private readonly quizRepo: QuizRepositoryInterface,
    private readonly gradeRepo: GradeRepositoryInterface,
    private readonly clientFactory: MoodleClientFactory,
    private readonly tenantRepo: Pick<TenantsRepository, "findById">,
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
      const tenant = await this.tenantRepo.findById(tenantId);
      if (!tenant) {
        return Result.failure(new Error("Tenant not found"));
      }

      const userClient = await this.clientFactory.createClientForUser(
        { tenantId, tenantSlug: tenantId, status: "ACTIVE" },
        request.moodleToken,
      );

      const rawCourses = await this.courseRepo.getUserCourses({
        tenantId,
        moodleUserId,
        client: userClient,
      });
      const courseIds = rawCourses.map((c) => c.id);

      let quizzes: QuizEntity[] = [];
      if (courseIds.length > 0) {
        quizzes = await this.quizRepo.getQuizzesByCourses({
          tenantId,
          courseIds,
          client: userClient,
        });
      }

      const upcomingExams = quizzes.map((q) => {
        const course = rawCourses.find((c) => c.id === q.courseId);
        return {
          id: q.id.toString(),
          name: q.name,
          course: course ? course.fullName : "Uncategorized",
          scheduledDate: q.timeOpen
            ? new Date(q.timeOpen * 1000).toLocaleString()
            : "No schedule",
          duration: q.timeLimitSeconds
            ? Math.floor(q.timeLimitSeconds / 60)
            : 0,
          status: "open" as const,
        };
      });

      const courses = rawCourses.map((c) => ({
        id: c.id.toString(),
        name: c.fullName,
        shortName: c.shortName,
        instructor: "Guru Pengampu",
        progress: c.progress || 0,
      }));

      const profile = {
        name: request.actor.displayName || "Siswa",
        educationLevel: "SMA" as const,
        schoolName: tenant.name,
        className: "Kelas 10A",
        academicYear: "2026/2027",
      };

      // Fetch recent grades for up to 3 active courses
      const recentGrades: GradeSummaryDto[] = [];
      if (courseIds.length > 0) {
        try {
          // Fetch grade report for the most recent courses
          const recentCourseIds = courseIds.slice(0, 3);
          for (const cid of recentCourseIds) {
            const courseEntity = rawCourses.find((c) => c.id === cid);
            if (!courseEntity) continue;

            const report = await this.gradeRepo.getUserGradeReport(
              tenantId,
              cid,
              moodleUserId,
              request.moodleToken,
            );
            if (report) {
              const courseTotal = report.courseTotal;
              if (courseTotal && courseTotal.gradeRaw !== null) {
                recentGrades.push({
                  courseName: courseEntity.shortName,
                  score: Math.round(courseTotal.gradeRaw),
                  grade: getGradeLetter(courseTotal.gradeRaw),
                });
              }
            }
          }
        } catch (e) {
          // Ignore grade fetch errors to not break dashboard
          console.warn(`Failed to fetch grades for user ${moodleUserId}:`, e);
        }
      }

      return Result.ok<StudentDashboardResponseDto>({
        profile,
        upcomingExams,
        courses,
        recentGrades,
      });
    } catch (e) {
      return Result.failure(e instanceof Error ? e : new Error(String(e)));
    }
  }
}

function getGradeLetter(score: number): string {
  if (score >= 90) return "A";
  if (score >= 85) return "A-";
  if (score >= 80) return "B+";
  if (score >= 75) return "B";
  if (score >= 70) return "B-";
  if (score >= 60) return "C";
  return "D";
}
