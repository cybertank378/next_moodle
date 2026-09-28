import "server-only";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import type { ApiResponse } from "@/core/http/ApiResponse";
import { mapErrorToHttpResponse } from "@/core/http/mapErrorToHttpResponse";
import { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import type { PermissionType } from "@/core/rbac/Permission";
import type { GetCourseGradesUseCase } from "../../application/usecases/GetCourseGradesUseCase";
import type { GetUserGradesUseCase } from "../../application/usecases/GetUserGradesUseCase";
import { parseGetGradesQuery } from "../validators/grade.validator";

function actorToAuthorization(actor: CurrentActor): AuthorizationActor {
  return {
    id: actor.userId,
    role: actor.role as AppRole,
    tenantId: actor.tenantId ?? null,
    moodleUserId: actor.moodleUserId ?? undefined,
    permissions: (actor.permissions as PermissionType[]) ?? [],
  };
}

function respond(response: ApiResponse): NextResponse {
  return NextResponse.json(response.body, { status: response.status });
}

export class GradeController {
  constructor(
    private readonly getUserGradesUseCase: GetUserGradesUseCase,
    private readonly getCourseGradesUseCase: GetCourseGradesUseCase,
  ) {}

  async getGrades(
    actor: CurrentActor,
    studentMoodleToken: string | undefined,
    req: NextRequest,
  ): Promise<NextResponse> {
    try {
      const searchParams =
        req.nextUrl?.searchParams ?? new URL(req.url).searchParams;
      const query = parseGetGradesQuery(searchParams);
      const authActor = actorToAuthorization(actor);

      // If actor is STUDENT, or a specific userId is specified, fetch user grade report
      if (authActor.role === AppRole.STUDENT || query.userId !== undefined) {
        const resolvedTargetUserId =
          query.userId ??
          (authActor.role === AppRole.STUDENT
            ? (authActor.moodleUserId ?? undefined)
            : undefined);

        const data = await this.getUserGradesUseCase.execute({
          actor: authActor,
          courseId: query.courseId,
          userId: resolvedTargetUserId,
          studentMoodleToken,
        });

        return respond({
          status: 200,
          body: {
            success: true,
            data,
          },
        });
      }

      // Otherwise, TENANT or ADMIN fetching class/course results
      const data = await this.getCourseGradesUseCase.execute({
        actor: authActor,
        courseId: query.courseId,
        activityId: query.activityId,
      });

      return respond({
        status: 200,
        body: {
          success: true,
          data,
        },
      });
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }
}
