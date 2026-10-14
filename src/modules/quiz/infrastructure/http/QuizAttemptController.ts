import "server-only";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import { ApiResponse } from "@/core/http/ApiResponse";
import { mapErrorToHttpResponse } from "@/core/http/mapErrorToHttpResponse";
import type { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import type { PermissionType } from "@/core/rbac/Permission";
import { getCurrentSession } from "@/modules/auth/server/getCurrentSession";
import type { GetAttemptDataUseCase } from "@/modules/quiz/application/usecases/GetAttemptDataUseCase";
import type { GetAttemptSummaryUseCase } from "@/modules/quiz/application/usecases/GetAttemptSummaryUseCase";
import type { GetUserAttemptsUseCase } from "@/modules/quiz/application/usecases/GetUserAttemptsUseCase";
import type { SaveQuizAnswerUseCase } from "@/modules/quiz/application/usecases/SaveQuizAnswerUseCase";
import type { StartQuizAttemptUseCase } from "@/modules/quiz/application/usecases/StartQuizAttemptUseCase";
import type { SubmitQuizAttemptUseCase } from "@/modules/quiz/application/usecases/SubmitQuizAttemptUseCase";
import {
  parseAttemptId,
  parseGetAttemptDataQuery,
  parseGetUserAttemptsQuery,
  parseSaveAnswerBody,
  parseStartAttemptBody,
  parseSubmitAttemptBody,
} from "@/modules/quiz/infrastructure/validators/quizAttempt.validator";

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

export class QuizAttemptController {
  constructor(
    private readonly startAttemptUseCase: StartQuizAttemptUseCase,
    private readonly saveAnswerUseCase: SaveQuizAnswerUseCase,
    private readonly submitAttemptUseCase: SubmitQuizAttemptUseCase,
    private readonly getUserAttemptsUseCase: GetUserAttemptsUseCase,
    private readonly getAttemptDataUseCase: GetAttemptDataUseCase,
    private readonly getAttemptSummaryUseCase: GetAttemptSummaryUseCase,
  ) {}

  private async resolveSession(
    actor?: CurrentActor,
    token?: string,
  ): Promise<{ actor: CurrentActor; moodleToken: string }> {
    if (actor && token) {
      return { actor, moodleToken: token };
    }
    const session = await getCurrentSession();
    if (!session?.actor || !session?.moodleToken) {
      throw new UnauthorizedError("Sesi tidak valid.");
    }
    return { actor: session.actor, moodleToken: session.moodleToken };
  }

  async start(
    actorOrReq: CurrentActor | NextRequest,
    maybeToken?: string,
    maybeReq?: NextRequest,
  ): Promise<NextResponse> {
    try {
      let actor: CurrentActor;
      let studentMoodleToken: string;
      let req: NextRequest;

      if ("nextUrl" in actorOrReq) {
        req = actorOrReq;
        const resolved = await this.resolveSession();
        actor = resolved.actor;
        studentMoodleToken = resolved.moodleToken;
      } else {
        actor = actorOrReq;
        studentMoodleToken = maybeToken!;
        req = maybeReq!;
      }

      const body = await req.json();
      const parsed = parseStartAttemptBody(body);

      const data = await this.startAttemptUseCase.execute({
        actor: actorToAuthorization(actor),
        studentMoodleToken,
        quizId: parsed.quizId,
        forceNew: parsed.forceNew,
      });

      return respond(ApiResponse.success(data));
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }

  async save(
    actorOrAttemptId: CurrentActor | string | number,
    tokenOrReq: string | NextRequest,
    attemptIdOrUndefined?: string | number,
    maybeReq?: NextRequest,
  ): Promise<NextResponse> {
    try {
      let actor: CurrentActor;
      let studentMoodleToken: string;
      let attemptIdInput: string | number;
      let req: NextRequest;

      if (
        typeof actorOrAttemptId === "object" &&
        "userId" in actorOrAttemptId
      ) {
        actor = actorOrAttemptId;
        studentMoodleToken = tokenOrReq as string;
        attemptIdInput = attemptIdOrUndefined!;
        req = maybeReq!;
      } else {
        const resolved = await this.resolveSession();
        actor = resolved.actor;
        studentMoodleToken = resolved.moodleToken;
        attemptIdInput = actorOrAttemptId;
        req = tokenOrReq as NextRequest;
      }

      const attemptId = parseAttemptId(attemptIdInput);
      const body = await req.json();
      const parsed = parseSaveAnswerBody(body);

      const data = await this.saveAnswerUseCase.execute({
        actor: actorToAuthorization(actor),
        studentMoodleToken,
        attemptId,
        quizId: parsed.quizId,
        answers: parsed.answers,
      });

      return respond(ApiResponse.success(data));
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }

  async submit(
    actorOrAttemptId: CurrentActor | string | number,
    tokenOrReq: string | NextRequest,
    attemptIdOrUndefined?: string | number,
    maybeReq?: NextRequest,
  ): Promise<NextResponse> {
    try {
      let actor: CurrentActor;
      let studentMoodleToken: string;
      let attemptIdInput: string | number;
      let req: NextRequest;

      if (
        typeof actorOrAttemptId === "object" &&
        "userId" in actorOrAttemptId
      ) {
        actor = actorOrAttemptId;
        studentMoodleToken = tokenOrReq as string;
        attemptIdInput = attemptIdOrUndefined!;
        req = maybeReq!;
      } else {
        const resolved = await this.resolveSession();
        actor = resolved.actor;
        studentMoodleToken = resolved.moodleToken;
        attemptIdInput = actorOrAttemptId;
        req = tokenOrReq as NextRequest;
      }

      const attemptId = parseAttemptId(attemptIdInput);
      let body: unknown = {};
      try {
        body = await req.json();
      } catch {
        body = {};
      }
      const parsed = parseSubmitAttemptBody(body);

      const data = await this.submitAttemptUseCase.execute({
        actor: actorToAuthorization(actor),
        studentMoodleToken,
        attemptId,
        quizId: parsed.quizId,
        answers: parsed.answers,
        timeUp: parsed.timeUp,
      });

      return respond(ApiResponse.success(data));
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }

  async list(
    actorOrReq: CurrentActor | NextRequest,
    maybeToken?: string,
    maybeReq?: NextRequest,
  ): Promise<NextResponse> {
    try {
      let actor: CurrentActor;
      let studentMoodleToken: string;
      let req: NextRequest;

      if ("nextUrl" in actorOrReq) {
        req = actorOrReq;
        const resolved = await this.resolveSession();
        actor = resolved.actor;
        studentMoodleToken = resolved.moodleToken;
      } else {
        actor = actorOrReq;
        studentMoodleToken = maybeToken!;
        req = maybeReq!;
      }

      const parsed = parseGetUserAttemptsQuery(req.nextUrl.searchParams);

      const attempts = await this.getUserAttemptsUseCase.execute({
        actor: actorToAuthorization(actor),
        studentMoodleToken,
        quizId: parsed.quizId,
        status: parsed.status,
      });

      return respond(ApiResponse.success(attempts));
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }

  async getData(
    actorOrAttemptId: CurrentActor | string | number,
    tokenOrReq: string | NextRequest,
    attemptIdOrUndefined?: string | number,
    maybeReq?: NextRequest,
  ): Promise<NextResponse> {
    try {
      let actor: CurrentActor;
      let studentMoodleToken: string;
      let attemptIdInput: string | number;
      let req: NextRequest;

      if (
        typeof actorOrAttemptId === "object" &&
        "userId" in actorOrAttemptId
      ) {
        actor = actorOrAttemptId;
        studentMoodleToken = tokenOrReq as string;
        attemptIdInput = attemptIdOrUndefined!;
        req = maybeReq!;
      } else {
        const resolved = await this.resolveSession();
        actor = resolved.actor;
        studentMoodleToken = resolved.moodleToken;
        attemptIdInput = actorOrAttemptId;
        req = tokenOrReq as NextRequest;
      }

      const attemptId = parseAttemptId(attemptIdInput);
      const parsed = parseGetAttemptDataQuery(req.nextUrl.searchParams);

      const data = await this.getAttemptDataUseCase.execute({
        actor: actorToAuthorization(actor),
        studentMoodleToken,
        attemptId,
        page: parsed.page,
      });

      return respond(ApiResponse.success(data));
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }

  async getSummary(
    actorOrAttemptId: CurrentActor | string | number,
    maybeToken?: string,
    maybeAttemptId?: string | number,
  ): Promise<NextResponse> {
    try {
      let actor: CurrentActor;
      let studentMoodleToken: string;
      let attemptIdInput: string | number;

      if (
        typeof actorOrAttemptId === "object" &&
        "userId" in actorOrAttemptId
      ) {
        actor = actorOrAttemptId;
        studentMoodleToken = maybeToken!;
        attemptIdInput = maybeAttemptId!;
      } else {
        const resolved = await this.resolveSession();
        actor = resolved.actor;
        studentMoodleToken = resolved.moodleToken;
        attemptIdInput = actorOrAttemptId;
      }

      const attemptId = parseAttemptId(attemptIdInput);

      const data = await this.getAttemptSummaryUseCase.execute({
        actor: actorToAuthorization(actor),
        studentMoodleToken,
        attemptId,
      });

      return respond(ApiResponse.success(data));
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }
}
