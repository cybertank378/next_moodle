import "server-only";

import { resolveCurrentActor } from "@/core/auth/resolveCurrentActor";
import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import { ValidationError } from "@/core/errors/ValidationError";
import { ApiResponse } from "@/core/http/ApiResponse";
import { mapErrorToHttpResponse } from "@/core/http/mapErrorToHttpResponse";
import type { GetExamMonitorUseCase } from "@/modules/exam-monitor/application/usecases/GetExamMonitorUseCase";
import type { LockAttemptUseCase } from "@/modules/exam-monitor/application/usecases/LockAttemptUseCase";
import type { UnlockAttemptUseCase } from "@/modules/exam-monitor/application/usecases/UnlockAttemptUseCase";
import type { ForceFinishAttemptUseCase } from "@/modules/exam-monitor/application/usecases/ForceFinishAttemptUseCase";
import type { ExtendTimeUseCase } from "@/modules/exam-monitor/application/usecases/ExtendTimeUseCase";
import {
  parseGetExamMonitorQuery,
  parseExamMonitorActionBody,
  parseExtendTimeBody,
} from "@/modules/exam-monitor/infrastructure/validators/examMonitorValidator";

function respond(response: ApiResponse): Response {
  return Response.json(response.body, { status: response.status });
}

export class ExamMonitorController {
  constructor(
    private readonly getMonitorUc: GetExamMonitorUseCase,
    private readonly lockAttemptUc: LockAttemptUseCase,
    private readonly unlockAttemptUc: UnlockAttemptUseCase,
    private readonly forceFinishUc: ForceFinishAttemptUseCase,
    private readonly extendTimeUc: ExtendTimeUseCase,
  ) {}

  async getMonitor(req: Request): Promise<Response> {
    try {
      const actor = await resolveCurrentActor(req).catch(() => null);
      if (!actor) {
        return respond(mapErrorToHttpResponse(new UnauthorizedError("Sesi tidak valid.")));
      }
      if (!actor.tenantId) {
        return respond(mapErrorToHttpResponse(new ValidationError("Tenant ID tidak ditemukan pada sesi Anda.")));
      }

      const url = new URL(req.url);
      const parsed = parseGetExamMonitorQuery(url.searchParams);

      const result = await this.getMonitorUc.execute(actor, {
        tenantId: actor.tenantId,
        quizId: parsed.quizId,
      });

      return result.isFailure
        ? respond(mapErrorToHttpResponse(result.getError()))
        : respond(ApiResponse.success(result.getValue()));
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }

  async lockAttempt(req: Request): Promise<Response> {
    try {
      const actor = await resolveCurrentActor(req).catch(() => null);
      if (!actor) return respond(mapErrorToHttpResponse(new UnauthorizedError("Sesi tidak valid.")));
      if (!actor.tenantId) return respond(mapErrorToHttpResponse(new ValidationError("Tenant ID tidak ditemukan.")));

      const body = await req.json();
      const parsed = parseExamMonitorActionBody(body);

      const result = await this.lockAttemptUc.execute(actor, {
        tenantId: actor.tenantId,
        attemptId: parsed.attemptId,
      });

      return result.isFailure ? respond(mapErrorToHttpResponse(result.getError())) : respond(ApiResponse.success(result.getValue()));
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }

  async unlockAttempt(req: Request): Promise<Response> {
    try {
      const actor = await resolveCurrentActor(req).catch(() => null);
      if (!actor) return respond(mapErrorToHttpResponse(new UnauthorizedError("Sesi tidak valid.")));
      if (!actor.tenantId) return respond(mapErrorToHttpResponse(new ValidationError("Tenant ID tidak ditemukan.")));

      const body = await req.json();
      const parsed = parseExamMonitorActionBody(body);

      const result = await this.unlockAttemptUc.execute(actor, {
        tenantId: actor.tenantId,
        attemptId: parsed.attemptId,
      });

      return result.isFailure ? respond(mapErrorToHttpResponse(result.getError())) : respond(ApiResponse.success(result.getValue()));
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }

  async forceFinishAttempt(req: Request): Promise<Response> {
    try {
      const actor = await resolveCurrentActor(req).catch(() => null);
      if (!actor) return respond(mapErrorToHttpResponse(new UnauthorizedError("Sesi tidak valid.")));
      if (!actor.tenantId) return respond(mapErrorToHttpResponse(new ValidationError("Tenant ID tidak ditemukan.")));

      const body = await req.json();
      const parsed = parseExamMonitorActionBody(body);

      const result = await this.forceFinishUc.execute(actor, {
        tenantId: actor.tenantId,
        attemptId: parsed.attemptId,
      });

      return result.isFailure ? respond(mapErrorToHttpResponse(result.getError())) : respond(ApiResponse.success(result.getValue()));
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }

  async extendTime(req: Request): Promise<Response> {
    try {
      const actor = await resolveCurrentActor(req).catch(() => null);
      if (!actor) return respond(mapErrorToHttpResponse(new UnauthorizedError("Sesi tidak valid.")));
      if (!actor.tenantId) return respond(mapErrorToHttpResponse(new ValidationError("Tenant ID tidak ditemukan.")));

      const body = await req.json();
      const parsed = parseExtendTimeBody(body);

      const result = await this.extendTimeUc.execute(actor, {
        tenantId: actor.tenantId,
        attemptId: parsed.attemptId,
        extraTimeMinutes: parsed.extraTimeMinutes,
      });

      return result.isFailure ? respond(mapErrorToHttpResponse(result.getError())) : respond(ApiResponse.success(result.getValue()));
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }
}
