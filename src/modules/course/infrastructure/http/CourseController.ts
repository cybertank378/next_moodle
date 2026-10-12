import "server-only";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { ApiResponse } from "@/core/http/ApiResponse";
import { mapErrorToHttpResponse } from "@/core/http/mapErrorToHttpResponse";
import { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import type { GetCourseContentsUseCase } from "@/modules/course/application/usecases/GetCourseContentsUseCase";
import type { GetCourseDetailUseCase } from "@/modules/course/application/usecases/GetCourseDetailUseCase";
import type { GetUserCoursesUseCase } from "@/modules/course/application/usecases/GetUserCoursesUseCase";
import {
  parseCourseId,
  parseListCourseQuery,
} from "@/modules/course/infrastructure/validators/course.validator";

import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import type { MoodleClient } from "@/core/moodle/types";

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

export class CourseController {
  constructor(
    private readonly getUserCourses: GetUserCoursesUseCase,
    private readonly getCourseContents: GetCourseContentsUseCase,
    private readonly getCourseDetail?: GetCourseDetailUseCase,
    private readonly clientFactory?: MoodleClientFactory,
  ) {}

  private async resolveClient(
    actor: CurrentActor,
    moodleToken?: string,
  ): Promise<MoodleClient | undefined> {
    if (
      actor.role === AppRole.STUDENT &&
      actor.tenantId &&
      moodleToken &&
      this.clientFactory
    ) {
      return this.clientFactory.createClientForUser(
        {
          tenantId: actor.tenantId,
          tenantSlug: actor.tenantId,
          status: "ACTIVE",
        },
        moodleToken,
      );
    }
    return undefined;
  }

  async list(
    actor: CurrentActor,
    req: NextRequest,
    moodleToken?: string,
  ): Promise<NextResponse> {
    try {
      const query = parseListCourseQuery(req.nextUrl.searchParams);
      const client = await this.resolveClient(actor, moodleToken);

      const result = await this.getUserCourses.execute({
        actor: actorToAuthorization(actor),
        moodleUserId: actor.moodleUserId ?? undefined,
        search: query.search,
        client,
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
    moodleToken?: string,
  ): Promise<NextResponse> {
    try {
      const courseId =
        typeof courseIdInput === "number"
          ? courseIdInput
          : parseCourseId(courseIdInput);

      const client = await this.resolveClient(actor, moodleToken);

      const result = await this.getCourseContents.execute({
        actor: actorToAuthorization(actor),
        courseId,
        client,
      });

      if (result.isFailure) {
        return respond(mapErrorToHttpResponse(result.getError()));
      }

      return respond(ApiResponse.success(result.getValue()));
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }

  async getDetail(
    actor: CurrentActor,
    courseIdInput: string | number,
    moodleToken?: string,
  ): Promise<NextResponse> {
    try {
      const courseId =
        typeof courseIdInput === "number"
          ? courseIdInput
          : parseCourseId(courseIdInput);

      if (!this.getCourseDetail) {
        return respond(
          ApiResponse.error(
            "INTERNAL_SERVER_ERROR",
            "GetCourseDetailUseCase belum terkonfigurasi.",
          ),
        );
      }

      const client = await this.resolveClient(actor, moodleToken);

      const result = await this.getCourseDetail.execute({
        actor: actorToAuthorization(actor),
        courseId,
        client,
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
