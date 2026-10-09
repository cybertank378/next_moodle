import { Result } from "@/core/base/Result";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import type { TenantDashboardResponseDto } from "@/modules/dashboard/domain/dto/DashboardResponseDto";

export interface GetTenantDashboardRequest {
  actor: AuthorizationActor;
}

export class GetTenantDashboardUseCase {
  async execute(
    request: GetTenantDashboardRequest,
  ): Promise<Result<TenantDashboardResponseDto>> {
    return Result.ok<TenantDashboardResponseDto>({
      activeExams: 48,
      questionsInBank: 14250,
      registeredUsers: 28500,
      averageScore: 78.5,
      upcomingExams: [
        {
          id: "exam-t1",
          name: "Algebra Final Exam",
          course: "Mathematics",
          scheduledDate: "Oct 28, 2026, 10:00 AM",
          duration: 120,
          status: "upcoming",
          enrolledCount: 11,
        },
        {
          id: "exam-t2",
          name: "Introduction to Biology",
          course: "Science",
          scheduledDate: "Oct 29, 2026, 02:00 PM",
          duration: 90,
          status: "published",
          enrolledCount: 6,
        },
        {
          id: "exam-t3",
          name: "World History: Module 4",
          course: "History",
          scheduledDate: "Nov 02, 2026, 09:30 AM",
          duration: 150,
          status: "pending",
          enrolledCount: 3,
        },
      ],
    });
  }
}
