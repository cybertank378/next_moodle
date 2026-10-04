import { Result } from "@/core/base/Result";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import type { TeacherDashboardResponseDto } from "@/modules/dashboard/domain/dto/DashboardResponseDto";

export interface GetTeacherDashboardRequest {
  actor: AuthorizationActor;
}

export class GetTeacherDashboardUseCase {
  async execute(
    request: GetTeacherDashboardRequest,
  ): Promise<Result<TeacherDashboardResponseDto>> {
    return Result.ok<TeacherDashboardResponseDto>({
      activeClasses: 5,
      totalQuestions: 324,
      upcomingExamsCount: 2,
      recentExams: [],
    });
  }
}
