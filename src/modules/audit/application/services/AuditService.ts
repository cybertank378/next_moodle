import { BaseService } from "@/core/base/BaseService";
import type { Result } from "@/core/base/Result";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { AppRole } from "@/core/rbac/AppRole";
import { AuthorizationError } from "@/core/rbac/AuthorizationError";
import { authorize } from "@/core/rbac/authorize";
import { Permission } from "@/core/rbac/Permission";
import {
  GetAuditDetailUseCase,
  type GetAuditDetailInput,
} from "@/modules/audit/application/usecases/GetAuditDetailUseCase";
import {
  GetAuditListUseCase,
  type GetAuditListInput,
} from "@/modules/audit/application/usecases/GetAuditListUseCase";
import type { AuditDetailDTO } from "@/modules/audit/domain/dto/AuditResponseDTO";
import type {
  AuditRepositoryInterface,
  AuditScope,
} from "@/modules/audit/domain/interfaces/AuditRepositoryInterface";

/* ============================================================
 * AUDIT SERVICE
 * ============================================================
 *
 * Responsibility:
 * - Application Facade
 * - UseCase Orchestrator
 * - Transaction Boundary
 * - Audit Workflow Coordinator
 * - Thin Application Entry Point
 *
 * NOT:
 * - Business Logic Layer
 * - Repository Wrapper
 * - Database Layer
 * ============================================================
 */

export class AuditService extends BaseService {
  private readonly getAuditListUseCase: GetAuditListUseCase;
  private readonly getAuditDetailUseCase: GetAuditDetailUseCase;

  constructor(repo?: AuditRepositoryInterface) {
    super();

    if (repo) {
      this.getAuditListUseCase = new GetAuditListUseCase(repo);
      this.getAuditDetailUseCase = new GetAuditDetailUseCase(repo);
    } else {
      this.getAuditListUseCase = null as unknown as GetAuditListUseCase;
      this.getAuditDetailUseCase = null as unknown as GetAuditDetailUseCase;
    }
  }

  getAuditList(
    input: GetAuditListInput,
  ): Promise<Result<Awaited<ReturnType<AuditRepositoryInterface["list"]>>, Error>> {
    return this.execute(() => this.getAuditListUseCase.execute(input));
  }

  getAuditDetail(
    input: GetAuditDetailInput,
  ): Promise<Result<AuditDetailDTO | null, Error>> {
    return this.execute(() => this.getAuditDetailUseCase.execute(input));
  }

  static resolveScope(actor: CurrentActor): AuditScope {
    if (actor.role === AppRole.ADMIN) {
      authorize(
        { id: actor.userId, role: AppRole.ADMIN, tenantId: actor.tenantId },
        Permission.PLATFORM_AUDIT_READ,
      );
      return { role: "ADMIN", tenantId: null };
    }
    if (actor.role === AppRole.TENANT) {
      if (!actor.tenantId?.trim())
        throw new AuthorizationError("Konteks tenant tidak valid.");
      authorize(
        { id: actor.userId, role: AppRole.TENANT, tenantId: actor.tenantId },
        Permission.TENANT_AUDIT_READ,
      );
      return { role: "TENANT", tenantId: actor.tenantId };
    }
    throw new AuthorizationError("Role tidak memiliki akses audit.");
  }

  static assertTenantFilter(scope: AuditScope, requested?: string) {
    if (scope.role === "TENANT" && requested && requested !== scope.tenantId)
      throw new AuthorizationError("Akses lintas tenant ditolak.");
  }
}

