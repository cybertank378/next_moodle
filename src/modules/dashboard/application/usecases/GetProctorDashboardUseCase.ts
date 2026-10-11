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
    const tenantId = request.actor.tenantId;

    if (!tenantId) {
      return Result.failure(new Error("Tenant ID is required"));
    }

    // According to AGENTS.md Section 4.1:
    // local_examapi_get_exam_monitor requires an explicit quizid, and upstream proctor_service
    // currently uses in-memory mock/default data.
    // Return honest zero/empty sessions rather than fabricated hardcoded sessions.
    return Result.ok<ProctorDashboardResponseDto>({
      liveExams: 0,
      activeCandidates: 0,
      incidentFlags: 0,
      sessions: [],
    });
  }
}
