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
import { Permission } from "@/core/rbac/Permission";
import { requirePermission } from "@/core/rbac/requirePermission";
import type { CreateUsersUseCase } from "../../application/usecases/CreateUsersUseCase";
import type { ImportUsersUseCase } from "../../application/usecases/ImportUsersUseCase";
import type { ListUsersUseCase } from "../../application/usecases/ListUsersUseCase";
import type {
  BulkImportUsersRequestDto,
  CreateUserRequestDto,
} from "../../domain/dto/UserRequestDto";

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

async function parseJson<T = unknown>(req: NextRequest): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    throw new ValidationError("Body permintaan harus berupa JSON valid.");
  }
}

export class UserController {
  constructor(
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly createUsersUseCase: CreateUsersUseCase,
    private readonly importUsersUseCase: ImportUsersUseCase,
  ) {}

  private resolveTenantId(actor: CurrentActor, req: NextRequest): string {
    const queryTenant = req.nextUrl.searchParams.get("tenantId");
    if (actor.role === AppRole.ADMIN && queryTenant) {
      return queryTenant.trim();
    }
    if (!actor.tenantId) {
      throw new ValidationError("Tenant context diperlukan untuk operasi ini.");
    }
    return actor.tenantId;
  }

  async list(actor: CurrentActor, req: NextRequest): Promise<NextResponse> {
    try {
      const tenantId = this.resolveTenantId(actor, req);
      requirePermission(actorToAuthorization(actor), Permission.USER_READ, {
        requestedTenantId: tenantId,
      });

      const search = req.nextUrl.searchParams.get("search") || undefined;
      const pageStr = req.nextUrl.searchParams.get("page");
      const pageSizeStr = req.nextUrl.searchParams.get("pageSize");
      const page = pageStr ? Number.parseInt(pageStr, 10) : 1;
      const pageSize = pageSizeStr ? Number.parseInt(pageSizeStr, 10) : 20;

      const result = await this.listUsersUseCase.execute({
        tenantId,
        query: { search, page, pageSize },
      });

      return respond(
        ApiResponse.success(result, {
          total: result.total,
          page: result.page,
          pageSize: result.pageSize,
        }),
      );
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }

  async create(actor: CurrentActor, req: NextRequest): Promise<NextResponse> {
    try {
      const tenantId = this.resolveTenantId(actor, req);
      requirePermission(actorToAuthorization(actor), Permission.USER_CREATE, {
        requestedTenantId: tenantId,
      });

      const body = await parseJson<
        CreateUserRequestDto | { users: CreateUserRequestDto[] }
      >(req);

      let usersToCreate: CreateUserRequestDto[] = [];
      if ("users" in body && Array.isArray(body.users)) {
        usersToCreate = body.users;
      } else if ("username" in body && typeof body.username === "string") {
        usersToCreate = [body as CreateUserRequestDto];
      } else {
        throw new ValidationError("Format data pengguna tidak valid.");
      }

      if (usersToCreate.length === 0) {
        throw new ValidationError("Daftar pengguna tidak boleh kosong.");
      }

      const created = await this.createUsersUseCase.execute({
        tenantId,
        users: usersToCreate,
      });

      return respond(
        ApiResponse.success(created, undefined, HttpStatus.CREATED),
      );
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }

  async import(actor: CurrentActor, req: NextRequest): Promise<NextResponse> {
    try {
      const tenantId = this.resolveTenantId(actor, req);
      requirePermission(actorToAuthorization(actor), Permission.USER_IMPORT, {
        requestedTenantId: tenantId,
      });

      const body = await parseJson<BulkImportUsersRequestDto>(req);
      if (!body.csvContent && (!body.users || body.users.length === 0)) {
        throw new ValidationError(
          "Payload import harus menyertakan csvContent atau daftar users.",
        );
      }

      const result = await this.importUsersUseCase.execute({
        tenantId,
        request: body,
      });

      return respond(ApiResponse.success(result));
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }
}
