import "server-only";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { ApiResponse } from "@/core/http/ApiResponse";
import { mapErrorToHttpResponse } from "@/core/http/mapErrorToHttpResponse";
import type { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import type { GetCourseContentsUseCase } from "@/modules/course/application/usecases/GetCourseContentsUseCase";
import type { GetUserCoursesUseCase } from "@/modules/course/application/usecases/GetUserCoursesUseCase";
import {
  parseCourseId,
  parseListCourseQuery,
} from "@/modules/course/infrastructure/validators/course.validator";

function actorToAuthorization(actor: CurrentActor): AuthorizationActor {
  return {
    id: actor.userId,
    role: actor.role as AppRole,
    tenantId: actor.tenantId || null,
  };
}

function respond(response: ApiResponse): NextResponse {
  return NextResponse.json(response.body, { status: response.status });
}

export class CourseController {
  constructor(
    private readonly getUserCourses: GetUserCoursesUseCase,
    private readonly getCourseContents: GetCourseContentsUseCase,
  ) {}

  async list(actor: CurrentActor, req: NextRequest): Promise<NextResponse> {
    try {
      const query = parseListCourseQuery(req.nextUrl.searchParams);
      const result = await this.getUserCourses.execute({
        actor: actorToAuthorization(actor),
        moodleUserId: actor.moodleUserId ?? undefined,
        search: query.search,
      });

      if (result.isFailure) {
        return respond(mapErrorToHttpResponse(result.getError()));
      }

      const data = result.getValue();
      return respond(
        ApiResponse.success(data, {
          total: data.total,
        }),
      );
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }

  async getContents(
    actor: CurrentActor,
    courseIdInput: string | number,
  ): Promise<NextResponse> {
    try {
      const courseId =
        typeof courseIdInput === "number"
          ? courseIdInput
          : parseCourseId(courseIdInput);

      const result = await this.getCourseContents.execute({
        actor: actorToAuthorization(actor),
        courseId,
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
