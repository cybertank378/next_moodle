import type { CurrentActor } from "@/core/auth/CurrentActor";
import { AuditService } from "@/modules/audit/application/services/AuditService";
import type { AuditQuery } from "@/modules/audit/domain/builder/AuditQueryBuilder";
import type { AuditRepositoryInterface } from "@/modules/audit/domain/interfaces/AuditRepositoryInterface";
export class GetAuditListUseCase {
  constructor(private readonly repo: AuditRepositoryInterface) {}
  execute(actor: CurrentActor, q: AuditQuery) {
    const scope = AuditService.resolveScope(actor);
    AuditService.assertTenantFilter(scope, q.tenantId);
    return this.repo.list(q, scope);
  }
}
