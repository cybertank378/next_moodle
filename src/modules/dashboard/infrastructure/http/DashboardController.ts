import "server-only";

import type { CurrentActor } from "@/core/auth/CurrentActor";
import { resolveCurrentActor } from "@/core/auth/resolveCurrentActor";
import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import { ApiResponse } from "@/core/http/ApiResponse";
import { mapErrorToHttpResponse } from "@/core/http/mapErrorToHttpResponse";
import { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import type { GetAdminDashboardUseCase } from "../../application/usecases/GetAdminDashboardUseCase";
import { parseAdminDashboardQuery } from "../validators/dashboardValidator";

function respond(response: ApiResponse): Response {
  return Response.json(response.body, { status: response.status });
}

function toAuthorizationActor(actor: CurrentActor): AuthorizationActor | null {
  if (!Object.values(AppRole).includes(actor.role as AppRole)) return null;
  return {
    id: actor.userId,
    role: actor.role as AppRole,
    tenantId: actor.tenantId || null,
  };
}

export class DashboardController {
  constructor(private readonly getAdminDashboard: GetAdminDashboardUseCase) {}

  async getAdminOverview(req: Request): Promise<Response> {
    const actor = await resolveCurrentActor(req).catch(() => null);
    if (!actor) {
      return respond(
        mapErrorToHttpResponse(new UnauthorizedError("Sesi tidak valid.")),
      );
    }

    try {
      const query = parseAdminDashboardQuery(new URL(req.url).searchParams);
      const result = await this.getAdminDashboard.execute({
        actor: toAuthorizationActor(actor),
        months: query.months,
      });

      return result.isFailure
        ? respond(mapErrorToHttpResponse(result.getError()))
        : respond(ApiResponse.success(result.getValue()));
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }
}
