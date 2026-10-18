import { BaseUseCase } from "@/core/base/BaseUseCase";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { AuditService } from "@/modules/audit/application/services/AuditService";
import type { AuditDetailDTO } from "@/modules/audit/domain/dto/AuditResponseDTO";
import type { AuditRepositoryInterface } from "@/modules/audit/domain/interfaces/AuditRepositoryInterface";

export interface GetAuditDetailInput {
  actor: CurrentActor;
  id: string;
}

export class GetAuditDetailUseCase extends BaseUseCase<
  GetAuditDetailInput,
  AuditDetailDTO | null
> {
  constructor(private readonly repo: AuditRepositoryInterface) {
    super();
  }

  override async execute(
    input: GetAuditDetailInput,
  ): Promise<AuditDetailDTO | null>;
  override async execute(
    actor: CurrentActor,
    id: string,
  ): Promise<AuditDetailDTO | null>;
  override async execute(
    inputOrActor: GetAuditDetailInput | CurrentActor,
    maybeId?: string,
  ): Promise<AuditDetailDTO | null> {
    const input: GetAuditDetailInput =
      "id" in inputOrActor && "actor" in inputOrActor
        ? inputOrActor
        : { actor: inputOrActor as CurrentActor, id: maybeId! };
    return this.handle(input);
  }

  async handle(
    input: GetAuditDetailInput,
  ): Promise<AuditDetailDTO | null> {
    return this.repo.findById(input.id, AuditService.resolveScope(input.actor));
  }
}

