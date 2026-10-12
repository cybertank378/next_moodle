import "server-only";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { ApiResponse } from "@/core/http/ApiResponse";
import { mapErrorToHttpResponse } from "@/core/http/mapErrorToHttpResponse";
import type { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import type { GetStudentCalendarEventsUseCase } from "@/modules/calendar/application/usecases/GetStudentCalendarEventsUseCase";
import { parseCalendarEventsQuery } from "@/modules/calendar/infrastructure/validators/calendarValidator";

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

export class CalendarController {
  constructor(
    private readonly getStudentCalendarEvents: GetStudentCalendarEventsUseCase,
  ) {}

  async getEvents(
    actor: CurrentActor,
    req: NextRequest,
    moodleToken?: string,
  ): Promise<NextResponse> {
    try {
      const query = parseCalendarEventsQuery(req.nextUrl.searchParams);

      const result = await this.getStudentCalendarEvents.execute({
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
}
