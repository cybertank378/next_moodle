import "server-only";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { ValidationError } from "@/core/errors/ValidationError";
import { ApiResponse } from "@/core/http/ApiResponse";
import { HttpStatus } from "@/core/http/HttpStatus";
import { mapErrorToHttpResponse } from "@/core/http/mapErrorToHttpResponse";
import { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import type { ConfigureTenantCredentialUseCase } from "@/modules/tenant/application/usecases/ConfigureTenantCredentialUseCase";
import type { CreateTenantUseCase } from "@/modules/tenant/application/usecases/CreateTenantUseCase";
import type { DeleteTenantUseCase } from "@/modules/tenant/application/usecases/DeleteTenantUseCase";
import type { GetAllTenantsUseCase } from "@/modules/tenant/application/usecases/GetAllTenantsUseCase";
import type { GetTenantByIdUseCase } from "@/modules/tenant/application/usecases/GetTenantByIdUseCase";
import type { UpdateTenantStatusUseCase } from "@/modules/tenant/application/usecases/UpdateTenantStatusUseCase";
import type { UpdateTenantUseCase } from "@/modules/tenant/application/usecases/UpdateTenantUseCase";
import {
  parseCreateTenantBody,
  parseCredentialBody,
  parseListTenantQuery,
  parseStatusBody,
  parseUpdateTenantBody,
} from "@/modules/tenant/infrastructure/validators/tenant.validator";

function actorToAuthorization(actor: CurrentActor): AuthorizationActor {
  if (!Object.values(AppRole).includes(actor.role as AppRole)) {
    throw new ValidationError(
      "Role sesi tidak didukung oleh authorization layer.",
    );
  }
  return {
    id: actor.userId,
    role: actor.role as AppRole,
    tenantId: actor.tenantId || null,
  };
}

function respond(response: ApiResponse): NextResponse {
  return NextResponse.json(response.body, { status: response.status });
}

async function parseJson(req: NextRequest): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    throw new ValidationError("Body permintaan harus berupa JSON valid.");
  }
}

export class TenantController {
  constructor(
    private readonly listTenants: GetAllTenantsUseCase,
    private readonly getTenant: GetTenantByIdUseCase,
    private readonly createTenant: CreateTenantUseCase,
    private readonly updateTenant: UpdateTenantUseCase,
    private readonly updateTenantStatus: UpdateTenantStatusUseCase,
    private readonly deleteTenant: DeleteTenantUseCase,
    private readonly configureCredential: ConfigureTenantCredentialUseCase,
  ) {}

  async list(actor: CurrentActor, req: NextRequest): Promise<NextResponse> {
    try {
      const result = await this.listTenants.execute({
        actor: actorToAuthorization(actor),
        filter: parseListTenantQuery(req.nextUrl.searchParams),
      });
      if (result.isFailure)
        return respond(mapErrorToHttpResponse(result.getError()));
      const data = result.getValue();
      return respond(
        ApiResponse.success(data, {
          total: data.total,
          page: data.page,
          pageSize: data.pageSize,
        }),
      );
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }

  async getOne(actor: CurrentActor, tenantId: string): Promise<NextResponse> {
    const result = await this.getTenant.execute({
      actor: actorToAuthorization(actor),
      tenantId,
    });
    return result.isFailure
      ? respond(mapErrorToHttpResponse(result.getError()))
      : respond(ApiResponse.success(result.getValue()));
  }

  async create(actor: CurrentActor, req: NextRequest): Promise<NextResponse> {
    try {
      const result = await this.createTenant.execute({
        actor: actorToAuthorization(actor),
        data: parseCreateTenantBody(await parseJson(req)),
      });
      return result.isFailure
        ? respond(mapErrorToHttpResponse(result.getError()))
        : respond(
            ApiResponse.success(
              result.getValue(),
              undefined,
              HttpStatus.CREATED,
            ),
          );
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }

  async update(
    actor: CurrentActor,
    tenantId: string,
    req: NextRequest,
  ): Promise<NextResponse> {
    try {
      const result = await this.updateTenant.execute({
        actor: actorToAuthorization(actor),
        tenantId,
        data: parseUpdateTenantBody(await parseJson(req)),
      });
      return result.isFailure
        ? respond(mapErrorToHttpResponse(result.getError()))
        : respond(ApiResponse.success(result.getValue()));
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }

  async updateStatus(
    actor: CurrentActor,
    tenantId: string,
    req: NextRequest,
  ): Promise<NextResponse> {
    try {
      const result = await this.updateTenantStatus.execute({
        actor: actorToAuthorization(actor),
        tenantId,
        status: parseStatusBody(await parseJson(req)),
      });
      return result.isFailure
        ? respond(mapErrorToHttpResponse(result.getError()))
        : respond(ApiResponse.success(result.getValue()));
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }

  async remove(actor: CurrentActor, tenantId: string): Promise<NextResponse> {
    const result = await this.deleteTenant.execute({
      actor: actorToAuthorization(actor),
      tenantId,
    });
    return result.isFailure
      ? respond(mapErrorToHttpResponse(result.getError()))
      : respond(ApiResponse.success(result.getValue()));
  }

  async configureCredentials(
    actor: CurrentActor,
    tenantId: string,
    req: NextRequest,
  ): Promise<NextResponse> {
    try {
      const result = await this.configureCredential.execute({
        actor: actorToAuthorization(actor),
        tenantId,
        data: parseCredentialBody(await parseJson(req)),
      });
      return result.isFailure
        ? respond(mapErrorToHttpResponse(result.getError()))
        : respond(ApiResponse.success(result.getValue()));
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }
}
