import "server-only";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import { ApiResponse } from "@/core/http/ApiResponse";
import { mapErrorToHttpResponse } from "@/core/http/mapErrorToHttpResponse";
import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import type { MoodleClient } from "@/core/moodle/types";
import { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { getCurrentSession } from "@/modules/auth/server/getCurrentSession";
import type { GetCourseContentsUseCase } from "@/modules/course/application/usecases/GetCourseContentsUseCase";
import type { GetCourseDetailUseCase } from "@/modules/course/application/usecases/GetCourseDetailUseCase";
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

  async list(req: NextRequest): Promise<NextResponse> {
    try {
      const session = await getCurrentSession();
      if (!session) {
        throw new UnauthorizedError("Sesi tidak valid.");
      }
      const query = parseListCourseQuery(req.nextUrl.searchParams);
      const client = await this.resolveClient(
        session.actor,
        session.moodleToken,
      );

      const result = await this.getUserCourses.execute({
        actor: actorToAuthorization(session.actor),
        moodleUserId: session.actor.moodleUserId ?? undefined,
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
    _req: NextRequest,
    courseIdInput: string | number,
  ): Promise<NextResponse> {
    try {
      const session = await getCurrentSession();
      if (!session) {
        throw new UnauthorizedError("Sesi tidak valid.");
      }
      const courseId =
        typeof courseIdInput === "number"
          ? courseIdInput
          : parseCourseId(courseIdInput);

      const client = await this.resolveClient(
        session.actor,
        session.moodleToken,
      );

      const result = await this.getCourseContents.execute({
        actor: actorToAuthorization(session.actor),
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
    _req: NextRequest,
    courseIdInput: string | number,
  ): Promise<NextResponse> {
    try {
      const session = await getCurrentSession();
      if (!session) {
        throw new UnauthorizedError("Sesi tidak valid.");
      }
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

      const client = await this.resolveClient(
        session.actor,
        session.moodleToken,
      );

      const result = await this.getCourseDetail.execute({
        actor: actorToAuthorization(session.actor),
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
