import "server-only";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { ApiResponse } from "@/core/http/ApiResponse";
import { mapErrorToHttpResponse } from "@/core/http/mapErrorToHttpResponse";
import type { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import type { GetScheduleSessionDetailUseCase } from "@/modules/schedule/application/usecases/GetScheduleSessionDetailUseCase";
import type { GetStudentScheduleUseCase } from "@/modules/schedule/application/usecases/GetStudentScheduleUseCase";
import { parseScheduleQuery } from "@/modules/schedule/infrastructure/validators/scheduleValidator";

function actorToAuthorization(actor: CurrentActor): AuthorizationActor {
  return {
    id: actor.userId,
    role: actor.role as AppRole,
    tenantId: actor.tenantId || null,
    moodleUserId: actor.moodleUserId ?? undefined,
  };
}

function respond(response: ApiResponse): NextResponse {
  return NextResponse.json(response.body, { status: response.status });
}

export class ScheduleController {
  constructor(
    private readonly getStudentSchedule: GetStudentScheduleUseCase,
    private readonly getScheduleSessionDetail: GetScheduleSessionDetailUseCase,
  ) {}

  async getSchedule(
    actor: CurrentActor,
    req: NextRequest,
    moodleToken?: string,
  ): Promise<NextResponse> {
    try {
      const query = parseScheduleQuery(req.nextUrl.searchParams);

      const result = await this.getStudentSchedule.execute({
        actor: actorToAuthorization(actor),
        query,
        moodleToken,
      });

      if (result.isFailure) {
        return respond(mapErrorToHttpResponse(result.getError()));
      }

      return respond(ApiResponse.success(result.getValue()));
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }

  async getSessionDetail(
    actor: CurrentActor,
    sessionId: string,
    moodleToken?: string,
  ): Promise<NextResponse> {
    try {
      const result = await this.getScheduleSessionDetail.execute({
        actor: actorToAuthorization(actor),
        sessionId,
        moodleToken,
      });

      if (result.isFailure) {
        return respond(mapErrorToHttpResponse(result.getError()));
      }

      return respond(ApiResponse.success(result.getValue()));
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }
}
