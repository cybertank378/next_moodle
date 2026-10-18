import { BaseUseCase } from "@/core/base/BaseUseCase";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { AuditService } from "@/modules/audit/application/services/AuditService";
import type { AuditQuery } from "@/modules/audit/domain/builder/AuditQueryBuilder";
import type { AuditRepositoryInterface } from "@/modules/audit/domain/interfaces/AuditRepositoryInterface";

export interface GetAuditListInput {
  actor: CurrentActor;
  query: AuditQuery;
}

export class GetAuditListUseCase extends BaseUseCase<
  GetAuditListInput,
  Awaited<ReturnType<AuditRepositoryInterface["list"]>>
> {
  constructor(private readonly repo: AuditRepositoryInterface) {
    super();
  }

  override async execute(
    input: GetAuditListInput,
  ): Promise<Awaited<ReturnType<AuditRepositoryInterface["list"]>>>;
  override async execute(
    actor: CurrentActor,
    q: AuditQuery,
  ): Promise<Awaited<ReturnType<AuditRepositoryInterface["list"]>>>;
  override async execute(
    inputOrActor: GetAuditListInput | CurrentActor,
    maybeQuery?: AuditQuery,
  ): Promise<Awaited<ReturnType<AuditRepositoryInterface["list"]>>> {
    const input: GetAuditListInput =
      "query" in inputOrActor && "actor" in inputOrActor
        ? inputOrActor
        : { actor: inputOrActor as CurrentActor, query: maybeQuery! };
    return this.handle(input);
  }

  async handle(
    input: GetAuditListInput,
  ): Promise<Awaited<ReturnType<AuditRepositoryInterface["list"]>>> {
    const scope = AuditService.resolveScope(input.actor);
    AuditService.assertTenantFilter(scope, input.query.tenantId);
    return this.repo.list(input.query, scope);
  }
}
