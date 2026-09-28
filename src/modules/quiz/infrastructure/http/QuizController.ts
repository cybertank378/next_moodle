import "server-only";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { ApiResponse } from "@/core/http/ApiResponse";
import { mapErrorToHttpResponse } from "@/core/http/mapErrorToHttpResponse";
import type { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import type { CheckQuizAccessUseCase } from "../../application/usecases/CheckQuizAccessUseCase";
import type { GetQuizDetailUseCase } from "../../application/usecases/GetQuizDetailUseCase";
import type { GetQuizzesByCourseUseCase } from "../../application/usecases/GetQuizzesByCourseUseCase";
import {
  parseListQuizzesQuery,
  parseQuizId,
} from "../validators/quiz.validator";

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

  async list(actor: CurrentActor, req: NextRequest): Promise<NextResponse> {
    try {
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
    actor: CurrentActor,
    quizIdInput: string | number,
  ): Promise<NextResponse> {
    try {
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
    actor: CurrentActor,
    quizIdInput: string | number,
  ): Promise<NextResponse> {
    try {
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
