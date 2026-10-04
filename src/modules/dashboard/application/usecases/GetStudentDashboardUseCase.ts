import { Result } from "@/core/base/Result";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import type { StudentDashboardResponseDto } from "@/modules/dashboard/domain/dto/DashboardResponseDto";

export interface GetStudentDashboardRequest {
  actor: AuthorizationActor;
}

export class GetStudentDashboardUseCase {
  async execute(
    request: GetStudentDashboardRequest,
  ): Promise<Result<StudentDashboardResponseDto>> {
    // TODO: Fetch from actual Moodle / Student API once the boundary is fully tested.
    // For now, return the mock data to satisfy the UI integration.
    
    return Result.ok<StudentDashboardResponseDto>({
      upcomingExams: [
        {
          id: "exam-1",
          name: "Introduction to Computer Science",
          course: "(Code: CS101) - Faculty of Science",
          scheduledDate: "Oct 26, 2026, 10:00 AM",
          duration: 90,
          status: "open",
        },
        {
          id: "exam-2",
          name: "Advanced Web Development",
          course: "(Code: WD302) - Faculty of Technology",
          scheduledDate: "Oct 28, 2026, 11:30 AM",
          duration: 120,
          status: "upcoming",
        },
        {
          id: "exam-3",
          name: "Data Structures & Algorithms",
          course: "(Code: CS210) - Faculty of Science",
          scheduledDate: "Oct 29, 2026, 09:00 AM",
          duration: 105,
          status: "upcoming",
        },
      ],
    });
  }
}
