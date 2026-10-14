import "server-only";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import { ApiResponse } from "@/core/http/ApiResponse";
import { mapErrorToHttpResponse } from "@/core/http/mapErrorToHttpResponse";
import type { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";
import type { CheckQuizAccessUseCase } from "@/modules/quiz/application/usecases/CheckQuizAccessUseCase";
import type { GetQuizDetailUseCase } from "@/modules/quiz/application/usecases/GetQuizDetailUseCase";
import type { GetQuizzesByCourseUseCase } from "@/modules/quiz/application/usecases/GetQuizzesByCourseUseCase";
import {
  parseListQuizzesQuery,
  parseQuizId,
} from "@/modules/quiz/infrastructure/validators/quiz.validator";

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

export class QuizController {
  constructor(
    private readonly getQuizzesByCourse: GetQuizzesByCourseUseCase,
    private readonly getQuizDetail: GetQuizDetailUseCase,
    private readonly checkQuizAccess: CheckQuizAccessUseCase,
  ) {}

  async list(
    reqOrActor: CurrentActor | NextRequest,
    maybeReq?: NextRequest,
  ): Promise<NextResponse> {
    try {
      let actor: CurrentActor;
      let req: NextRequest;

      if ("nextUrl" in reqOrActor) {
        req = reqOrActor;
        const current = await getCurrentUser();
        if (!current) throw new UnauthorizedError("Sesi tidak valid.");
        actor = current;
      } else {
        actor = reqOrActor;
        req = maybeReq!;
      }

      const query = parseListQuizzesQuery(req.nextUrl.searchParams);
      const result = await this.getQuizzesByCourse.execute({
        actor: actorToAuthorization(actor),
        courseId: query.courseId,
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

  async getDetail(
    actorOrQuizId: CurrentActor | string | number,
    maybeQuizId?: string | number,
  ): Promise<NextResponse> {
    try {
      let actor: CurrentActor;
      let quizIdInput: string | number;

      if (
        typeof actorOrQuizId === "object" &&
        actorOrQuizId !== null &&
        "userId" in actorOrQuizId
      ) {
        actor = actorOrQuizId;
        quizIdInput = maybeQuizId!;
      } else {
        const current = await getCurrentUser();
        if (!current) throw new UnauthorizedError("Sesi tidak valid.");
        actor = current;
        quizIdInput = actorOrQuizId;
      }

      const quizId =
        typeof quizIdInput === "number"
          ? quizIdInput
          : parseQuizId(quizIdInput);

      const result = await this.getQuizDetail.execute({
        actor: actorToAuthorization(actor),
        quizId,
      });

      if (result.isFailure) {
        return respond(mapErrorToHttpResponse(result.getError()));
      }

      return respond(ApiResponse.success(result.getValue()));
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }

  async checkAccess(
    actorOrQuizId: CurrentActor | string | number,
    maybeQuizId?: string | number,
  ): Promise<NextResponse> {
    try {
      let actor: CurrentActor;
      let quizIdInput: string | number;

      if (
        typeof actorOrQuizId === "object" &&
        actorOrQuizId !== null &&
        "userId" in actorOrQuizId
      ) {
        actor = actorOrQuizId;
        quizIdInput = maybeQuizId!;
      } else {
        const current = await getCurrentUser();
        if (!current) throw new UnauthorizedError("Sesi tidak valid.");
        actor = current;
        quizIdInput = actorOrQuizId;
      }

      const quizId =
        typeof quizIdInput === "number"
          ? quizIdInput
          : parseQuizId(quizIdInput);

      const result = await this.checkQuizAccess.execute({
        actor: actorToAuthorization(actor),
        quizId,
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
