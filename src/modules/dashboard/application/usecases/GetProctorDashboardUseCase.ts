import { Result } from "@/core/base/Result";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import type { ProctorDashboardResponseDto } from "@/modules/dashboard/domain/dto/DashboardResponseDto";

export interface GetProctorDashboardRequest {
  actor: AuthorizationActor;
}

export class GetProctorDashboardUseCase {
  async execute(
    request: GetProctorDashboardRequest,
  ): Promise<Result<ProctorDashboardResponseDto>> {
    return Result.ok<ProctorDashboardResponseDto>({
      liveExams: 3,
      activeCandidates: 124,
      incidentFlags: 7,
      sessions: [
        {
          id: "session-1",
          examName: "Midterm: Organic Chemistry",
          startTime: "09:00 AM",
          duration: 45, // remaining roughly
          activeCandidates: 42,
          totalCandidates: 45,
          flags: 3,
        },
        {
          id: "session-2",
          examName: "Final: Software Architecture",
          startTime: "10:00 AM",
          duration: 75,
          activeCandidates: 82,
          totalCandidates: 85,
          flags: 0,
        },
      ],
    });
  }
}
