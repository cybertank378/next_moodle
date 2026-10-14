import "server-only";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import { ApiResponse } from "@/core/http/ApiResponse";
import { mapErrorToHttpResponse } from "@/core/http/mapErrorToHttpResponse";
import type { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { getCurrentSession } from "@/modules/auth/server/getCurrentSession";
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

  async getEvents(req: NextRequest): Promise<NextResponse> {
    try {
      const session = await getCurrentSession();
      if (!session) {
        throw new UnauthorizedError("Sesi tidak valid.");
      }
      const query = parseCalendarEventsQuery(req.nextUrl.searchParams);

      const result = await this.getStudentCalendarEvents.execute({
        actor: actorToAuthorization(session.actor),
        query,
        moodleToken: session.moodleToken,
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
