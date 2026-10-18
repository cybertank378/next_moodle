import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { ApiResponse } from "@/core/http/ApiResponse";
import { HttpStatus } from "@/core/http/HttpStatus";
import { mapErrorToHttpResponse } from "@/core/http/mapErrorToHttpResponse";
import { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import type { GetScheduleSessionDetailUseCase } from "@/modules/schedule/application/usecases/GetScheduleSessionDetailUseCase";
import type { GetStudentScheduleUseCase } from "@/modules/schedule/application/usecases/GetStudentScheduleUseCase";
import type { GetTeacherSchedulesUseCase } from "@/modules/schedule/application/usecases/GetTeacherSchedulesUseCase";
import type { GetTenantSchedulesUseCase } from "@/modules/schedule/application/usecases/GetTenantSchedulesUseCase";
import type {
  CancelScheduleUseCase,
  CreateScheduleUseCase,
  PublishScheduleUseCase,
  UpdateScheduleUseCase,
} from "@/modules/schedule/application/usecases/MutateScheduleUseCases";
import { parseScheduleQuery } from "@/modules/schedule/infrastructure/validators/scheduleValidator";

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

export class ScheduleController {
  constructor(
    private readonly getStudentSchedule: GetStudentScheduleUseCase,
    private readonly getTenantSchedules: GetTenantSchedulesUseCase,
    private readonly getTeacherSchedules: GetTeacherSchedulesUseCase,
    private readonly getScheduleSessionDetail: GetScheduleSessionDetailUseCase,
    private readonly createScheduleUseCase: CreateScheduleUseCase,
    private readonly updateScheduleUseCase: UpdateScheduleUseCase,
    private readonly publishScheduleUseCase: PublishScheduleUseCase,
    private readonly cancelScheduleUseCase: CancelScheduleUseCase,
  ) {}

  async getSchedule(
    actor: CurrentActor,
    req: NextRequest,
    moodleToken?: string,
  ): Promise<NextResponse> {
    try {
      const query = parseScheduleQuery(req.nextUrl.searchParams);
      const authActor = actorToAuthorization(actor);

      let result: Awaited<
        | ReturnType<GetTenantSchedulesUseCase["execute"]>
        | ReturnType<GetTeacherSchedulesUseCase["execute"]>
        | ReturnType<GetStudentScheduleUseCase["execute"]>
      >;
      if (
        authActor.role === AppRole.TENANT ||
        authActor.role === AppRole.ADMIN
      ) {
        result = await this.getTenantSchedules.execute({
          actor: authActor,
          query,
          moodleToken,
        });
      } else if (authActor.role === AppRole.TEACHER) {
        result = await this.getTeacherSchedules.execute({
          actor: authActor,
          query,
          moodleToken,
        });
      } else {
        result = await this.getStudentSchedule.execute({
          actor: authActor,
          query,
          moodleToken,
        });
      }

      if (result.isFailure) {
        return respond(mapErrorToHttpResponse(result.getError()));
      }

      return respond(ApiResponse.success(result.getValue()));
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }

  async getSessionDetail(
    actor: CurrentActor,
    sessionId: string,
    moodleToken?: string,
  ): Promise<NextResponse> {
    try {
      const result = await this.getScheduleSessionDetail.execute({
        actor: actorToAuthorization(actor),
        sessionId,
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

  async createSchedule(
    actor: CurrentActor,
    req: NextRequest,
    moodleToken?: string,
  ): Promise<NextResponse> {
    try {
      const body = await req.json();
      const result = await this.createScheduleUseCase.execute({
        actor: actorToAuthorization(actor),
        data: body,
        moodleToken,
      });

      if (result.isFailure) {
        return respond(mapErrorToHttpResponse(result.getError()));
      }

      return respond(
        ApiResponse.success(result.getValue(), undefined, HttpStatus.CREATED),
      );
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }

  async updateSchedule(
    actor: CurrentActor,
    sessionId: string,
    req: NextRequest,
    moodleToken?: string,
  ): Promise<NextResponse> {
    try {
      const body = await req.json();
      const result = await this.updateScheduleUseCase.execute({
        actor: actorToAuthorization(actor),
        sessionId,
        data: body,
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

  async publishSchedule(
    actor: CurrentActor,
    sessionId: string,
    moodleToken?: string,
  ): Promise<NextResponse> {
    try {
      const result = await this.publishScheduleUseCase.execute({
        actor: actorToAuthorization(actor),
        sessionId,
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

  async cancelSchedule(
    actor: CurrentActor,
    sessionId: string,
    req: NextRequest,
    moodleToken?: string,
  ): Promise<NextResponse> {
    try {
      let reason: string | undefined;
      try {
        const body = await req.json();
        reason = body?.reason;
      } catch {
        // empty body allowed
      }

      const result = await this.cancelScheduleUseCase.execute({
        actor: actorToAuthorization(actor),
        sessionId,
        reason,
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
