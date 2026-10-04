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
import type { EnrolUsersUseCase } from "@/modules/enrolment/application/usecases/EnrolUsersUseCase";
import type { ListEnrolmentsUseCase } from "@/modules/enrolment/application/usecases/ListEnrolmentsUseCase";
import type { UnenrolUsersUseCase } from "@/modules/enrolment/application/usecases/UnenrolUsersUseCase";
import type {
  EnrolUserRequestDto,
  UnenrolUserRequestDto,
} from "@/modules/enrolment/domain/dto/EnrolmentRequestDto";

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

export class EnrolmentController {
  constructor(
    private readonly listEnrolmentsUseCase: ListEnrolmentsUseCase,
    private readonly enrolUsersUseCase: EnrolUsersUseCase,
    private readonly unenrolUsersUseCase: UnenrolUsersUseCase,
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
      requirePermission(
        actorToAuthorization(actor),
        Permission.ENROLMENT_READ,
        {
          requestedTenantId: tenantId,
        },
      );

      const courseIdStr = req.nextUrl.searchParams.get("courseId");
      if (!courseIdStr) {
        throw new ValidationError("Parameter courseId wajib diisi.");
      }
      const courseId = Number.parseInt(courseIdStr, 10);
      if (Number.isNaN(courseId) || courseId <= 0) {
        throw new ValidationError("Parameter courseId tidak valid.");
      }

      const search = req.nextUrl.searchParams.get("search") || undefined;
      const pageStr = req.nextUrl.searchParams.get("page");
      const pageSizeStr = req.nextUrl.searchParams.get("pageSize");
      const page = pageStr ? Number.parseInt(pageStr, 10) : 1;
      const pageSize = pageSizeStr ? Number.parseInt(pageSizeStr, 10) : 20;

      const result = await this.listEnrolmentsUseCase.execute({
        tenantId,
        query: { courseId, search, page, pageSize },
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

  async enrol(actor: CurrentActor, req: NextRequest): Promise<NextResponse> {
    try {
      const tenantId = this.resolveTenantId(actor, req);
      requirePermission(
        actorToAuthorization(actor),
        Permission.ENROLMENT_MANAGE,
        {
          requestedTenantId: tenantId,
        },
      );

      const body = await parseJson<
        EnrolUserRequestDto | { enrolments: EnrolUserRequestDto[] }
      >(req);

      let enrolments: EnrolUserRequestDto[] = [];
      if ("enrolments" in body && Array.isArray(body.enrolments)) {
        enrolments = body.enrolments;
      } else if (
        "courseId" in body &&
        "userId" in body &&
        typeof body.courseId === "number" &&
        typeof body.userId === "number"
      ) {
        enrolments = [body as EnrolUserRequestDto];
      } else {
        throw new ValidationError("Format data enrolment tidak valid.");
      }

      if (enrolments.length === 0) {
        throw new ValidationError("Daftar enrolment tidak boleh kosong.");
      }

      await this.enrolUsersUseCase.execute({
        tenantId,
        enrolments,
      });

      return respond(
        ApiResponse.success({ success: true }, undefined, HttpStatus.CREATED),
      );
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }

  async unenrol(actor: CurrentActor, req: NextRequest): Promise<NextResponse> {
    try {
      const tenantId = this.resolveTenantId(actor, req);
      requirePermission(
        actorToAuthorization(actor),
        Permission.ENROLMENT_MANAGE,
        {
          requestedTenantId: tenantId,
        },
      );

      const body = await parseJson<
        UnenrolUserRequestDto | { enrolments: UnenrolUserRequestDto[] }
      >(req);

      let unenrolments: UnenrolUserRequestDto[] = [];
      if ("enrolments" in body && Array.isArray(body.enrolments)) {
        unenrolments = body.enrolments;
      } else if (
        "courseId" in body &&
        "userId" in body &&
        typeof body.courseId === "number" &&
        typeof body.userId === "number"
      ) {
        unenrolments = [body as UnenrolUserRequestDto];
      } else {
        throw new ValidationError(
          "Format data pembatalan enrolment tidak valid.",
        );
      }

      await this.unenrolUsersUseCase.execute({
        tenantId,
        enrolments: unenrolments,
      });

      return respond(ApiResponse.success({ success: true }));
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }
}
