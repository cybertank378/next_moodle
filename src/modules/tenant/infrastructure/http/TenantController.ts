import "server-only";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { ValidationError } from "@/core/errors/ValidationError";
import { ApiResponse } from "@/core/http/ApiResponse";
import { HttpStatus } from "@/core/http/HttpStatus";
import { mapErrorToHttpResponse } from "@/core/http/mapErrorToHttpResponse";
import type { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import type { CreateTenantUseCase } from "@/modules/tenant/application/usecases/CreateTenantUseCase";
import type { GetTenantsUseCase } from "@/modules/tenant/application/usecases/GetTenantsUseCase";
import type { GetTenantUseCase } from "@/modules/tenant/application/usecases/GetTenantUseCase";
import type { UpdateTenantStatusUseCase } from "@/modules/tenant/application/usecases/UpdateTenantStatusUseCase";
import type { UpdateTenantUseCase } from "@/modules/tenant/application/usecases/UpdateTenantUseCase";
import type { TenantDomainStatus } from "@/modules/tenant/domain/TenantTypes";
import {
  type ListTenantsQuery,
  parseListTenantsQuery,
  validateCreateTenantBody,
  validateUpdateTenantBody,
  validateUpdateTenantStatusBody,
} from "@/modules/tenant/infrastructure/validators/tenantValidator";

/**
 * Adapts CurrentActor (session) to AuthorizationActor (RBAC).
 * ADMIN role maps to null tenantId in AuthorizationActor (platform-level actor).
 */
function toAuthorizationActor(actor: CurrentActor): AuthorizationActor {
  return {
    id: actor.userId,
    role: actor.role as AppRole,
    tenantId: actor.tenantId || null,
  };
}

function toNextResponse(apiResponse: ApiResponse): NextResponse {
  return NextResponse.json(apiResponse.body, { status: apiResponse.status });
}

export class TenantController {
  constructor(
    private readonly getTenantsUseCase: GetTenantsUseCase,
    private readonly getTenantUseCase: GetTenantUseCase,
    private readonly createTenantUseCase: CreateTenantUseCase,
    private readonly updateTenantUseCase: UpdateTenantUseCase,
    private readonly updateTenantStatusUseCase: UpdateTenantStatusUseCase,
  ) {}

  async list(actor: CurrentActor, req: NextRequest): Promise<NextResponse> {
    try {
      const { searchParams } = req.nextUrl;
      const queryParams: ListTenantsQuery = {
        status: searchParams.get("status") ?? undefined,
        search: searchParams.get("search") ?? undefined,
        page: searchParams.get("page") ?? undefined,
        pageSize: searchParams.get("pageSize") ?? undefined,
      };
      const filter = parseListTenantsQuery(queryParams);

      const result = await this.getTenantsUseCase.execute({
        actor: toAuthorizationActor(actor),
        filter,
      });

      if (result.isFailure) {
        return toNextResponse(mapErrorToHttpResponse(result.getError()));
      }

      const data = result.getValue();
      return toNextResponse(
        ApiResponse.success(data, {
          total: data.total,
          page: data.page,
          pageSize: data.pageSize,
        }),
      );
    } catch (err) {
      return toNextResponse(mapErrorToHttpResponse(err));
    }
  }

  async create(actor: CurrentActor, req: NextRequest): Promise<NextResponse> {
    try {
      let body: unknown;
      try {
        body = await req.json();
      } catch {
        throw new ValidationError(
          "Body permintaan harus berupa JSON yang valid.",
        );
      }

      const data = validateCreateTenantBody(body);
      const result = await this.createTenantUseCase.execute({
        actor: toAuthorizationActor(actor),
        data,
      });

      if (result.isFailure) {
        return toNextResponse(mapErrorToHttpResponse(result.getError()));
      }

      return toNextResponse(
        ApiResponse.success(result.getValue(), undefined, HttpStatus.CREATED),
      );
    } catch (err) {
      return toNextResponse(mapErrorToHttpResponse(err));
    }
  }

  async getOne(actor: CurrentActor, tenantId: string): Promise<NextResponse> {
    try {
      const result = await this.getTenantUseCase.execute({
        actor: toAuthorizationActor(actor),
        tenantId,
      });

      if (result.isFailure) {
        return toNextResponse(mapErrorToHttpResponse(result.getError()));
      }

      return toNextResponse(ApiResponse.success(result.getValue()));
    } catch (err) {
      return toNextResponse(mapErrorToHttpResponse(err));
    }
  }

  async update(
    actor: CurrentActor,
    tenantId: string,
    req: NextRequest,
  ): Promise<NextResponse> {
    try {
      let body: unknown;
      try {
        body = await req.json();
      } catch {
        throw new ValidationError(
          "Body permintaan harus berupa JSON yang valid.",
        );
      }

      const data = validateUpdateTenantBody(body);
      const result = await this.updateTenantUseCase.execute({
        actor: toAuthorizationActor(actor),
        tenantId,
        data,
      });

      if (result.isFailure) {
        return toNextResponse(mapErrorToHttpResponse(result.getError()));
      }

      return toNextResponse(ApiResponse.success(result.getValue()));
    } catch (err) {
      return toNextResponse(mapErrorToHttpResponse(err));
    }
  }

  async updateStatus(
    actor: CurrentActor,
    tenantId: string,
    req: NextRequest,
  ): Promise<NextResponse> {
    try {
      let body: unknown;
      try {
        body = await req.json();
      } catch {
        throw new ValidationError(
          "Body permintaan harus berupa JSON yang valid.",
        );
      }

      const { status } = validateUpdateTenantStatusBody(body);
      const result = await this.updateTenantStatusUseCase.execute({
        actor: toAuthorizationActor(actor),
        tenantId,
        status: status as TenantDomainStatus,
      });

      if (result.isFailure) {
        return toNextResponse(mapErrorToHttpResponse(result.getError()));
      }

      return toNextResponse(ApiResponse.success(result.getValue()));
    } catch (err) {
      return toNextResponse(mapErrorToHttpResponse(err));
    }
  }
}
