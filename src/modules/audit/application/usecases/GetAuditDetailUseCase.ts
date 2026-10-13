import type { CurrentActor } from "@/core/auth/CurrentActor";
import { AuditService } from "@/modules/audit/application/services/AuditService";
import type { AuditRepositoryInterface } from "@/modules/audit/domain/interfaces/AuditRepositoryInterface";
export class GetAuditDetailUseCase {
  constructor(private readonly repo: AuditRepositoryInterface) {}
  execute(actor: CurrentActor, id: string) {
    return this.repo.findById(id, AuditService.resolveScope(actor));
  }
}
