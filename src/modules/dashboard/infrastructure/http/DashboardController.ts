import "server-only";

import { getAuthRepository } from "@/app/api/auth/_factory";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import {
  extractTokenFromRequest,
  resolveCurrentActor,
} from "@/core/auth/resolveCurrentActor";
import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import { ApiResponse } from "@/core/http/ApiResponse";
import { mapErrorToHttpResponse } from "@/core/http/mapErrorToHttpResponse";
import { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import type { GetAdminDashboardUseCase } from "@/modules/dashboard/application/usecases/GetAdminDashboardUseCase";
import type { GetProctorDashboardUseCase } from "@/modules/dashboard/application/usecases/GetProctorDashboardUseCase";
import type { GetStudentDashboardUseCase } from "@/modules/dashboard/application/usecases/GetStudentDashboardUseCase";
import type { GetTeacherDashboardUseCase } from "@/modules/dashboard/application/usecases/GetTeacherDashboardUseCase";
import type { GetTenantDashboardUseCase } from "@/modules/dashboard/application/usecases/GetTenantDashboardUseCase";
import { parseAdminDashboardQuery } from "@/modules/dashboard/infrastructure/validators/dashboardValidator";

function respond(response: ApiResponse): Response {
  return Response.json(response.body, { status: response.status });
}

function toAuthorizationActor(actor: CurrentActor): AuthorizationActor | null {
  if (!Object.values(AppRole).includes(actor.role as AppRole)) return null;
  return {
    id: actor.userId,
    role: actor.role as AppRole,
    tenantId: actor.tenantId || null,
    moodleUserId: actor.moodleUserId || null,
    displayName: actor.displayName,
  };
}

export class DashboardController {
  constructor(
    private readonly getAdminDashboard: GetAdminDashboardUseCase,
    private readonly getStudentDashboard: GetStudentDashboardUseCase,
    private readonly getTeacherDashboard: GetTeacherDashboardUseCase,
    private readonly getTenantDashboard: GetTenantDashboardUseCase,
    private readonly getProctorDashboard: GetProctorDashboardUseCase,
  ) {}

  async getAdminOverview(req: Request): Promise<Response> {
    const actor = await resolveCurrentActor(req).catch(() => null);
    if (!actor) {
      return respond(
        mapErrorToHttpResponse(new UnauthorizedError("Sesi tidak valid.")),
      );
    }

    try {
      const query = parseAdminDashboardQuery(new URL(req.url).searchParams);
      const authActor = toAuthorizationActor(actor);
      if (!authActor)
        return respond(
          mapErrorToHttpResponse(new UnauthorizedError("Peran tidak valid.")),
        );

      const result = await this.getAdminDashboard.execute({
        actor: authActor,
        months: query.months,
      });

      return result.isFailure
        ? respond(mapErrorToHttpResponse(result.getError()))
        : respond(ApiResponse.success(result.getValue()));
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }

  async getStudentOverview(req: Request): Promise<Response> {
    try {
      const sessionToken = await extractTokenFromRequest(req);
      if (!sessionToken) throw new UnauthorizedError("Token hilang.");
      const session = await getAuthRepository().resolveSession(sessionToken);
      const actor = session.actor;

      const authActor = toAuthorizationActor(actor);
      if (!authActor)
        return respond(
          mapErrorToHttpResponse(new UnauthorizedError("Peran tidak valid.")),
        );

      const result = await this.getStudentDashboard.execute({
        actor: authActor,
        moodleToken: session.moodleToken,
      });
      return result.isFailure
        ? respond(mapErrorToHttpResponse(result.getError()))
        : respond(ApiResponse.success(result.getValue()));
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }

  async getTeacherOverview(req: Request): Promise<Response> {
    try {
      const sessionToken = await extractTokenFromRequest(req);
      if (!sessionToken) throw new UnauthorizedError("Token hilang.");
      const session = await getAuthRepository().resolveSession(sessionToken);
      const actor = session.actor;

      const authActor = toAuthorizationActor(actor);
      if (!authActor)
        return respond(
          mapErrorToHttpResponse(new UnauthorizedError("Peran tidak valid.")),
        );

      const result = await this.getTeacherDashboard.execute({
        actor: authActor,
        moodleToken: session.moodleToken,
      });
      return result.isFailure
        ? respond(mapErrorToHttpResponse(result.getError()))
        : respond(ApiResponse.success(result.getValue()));
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }

  async getTenantOverview(req: Request): Promise<Response> {
    const actor = await resolveCurrentActor(req).catch(() => null);
    if (!actor)
      return respond(
        mapErrorToHttpResponse(new UnauthorizedError("Sesi tidak valid.")),
      );

    try {
      const authActor = toAuthorizationActor(actor);
      if (!authActor)
        return respond(
          mapErrorToHttpResponse(new UnauthorizedError("Peran tidak valid.")),
        );

      const result = await this.getTenantDashboard.execute({
        actor: authActor,
      });
      return result.isFailure
        ? respond(mapErrorToHttpResponse(result.getError()))
        : respond(ApiResponse.success(result.getValue()));
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }

  async getProctorOverview(req: Request): Promise<Response> {
    const actor = await resolveCurrentActor(req).catch(() => null);
    if (!actor)
      return respond(
        mapErrorToHttpResponse(new UnauthorizedError("Sesi tidak valid.")),
      );

    try {
      const authActor = toAuthorizationActor(actor);
      if (!authActor)
        return respond(
          mapErrorToHttpResponse(new UnauthorizedError("Peran tidak valid.")),
        );

      const result = await this.getProctorDashboard.execute({
        actor: authActor,
      });
      return result.isFailure
        ? respond(mapErrorToHttpResponse(result.getError()))
        : respond(ApiResponse.success(result.getValue()));
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }
}
