import { BaseUseCase } from "@/core/base/BaseUseCase";
import { Result } from "@/core/base/Result";
import { NotFoundError } from "@/core/errors/NotFoundError";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { Permission } from "@/core/rbac/Permission";
import { authorizeTenantOperation } from "@/modules/tenant/application/services/TenantAuthorizationService";
import type { TenantResponseDTO } from "@/modules/tenant/domain/dto/TenantResponseDto";
import type { TenantsRepository } from "@/modules/tenant/domain/interfaces/TenantInterfaces";
import { TenantMapper } from "@/modules/tenant/domain/mapper/TenantMapper";
import type { TenantStatus } from "@/modules/tenant/domain/types/TenantMetadata";
import { TenantValidator } from "@/modules/tenant/domain/validators/TenantValidator";

export interface UpdateTenantStatusInput {
  actor: AuthorizationActor | null | undefined;
  tenantId: string;
  status: TenantStatus;
}

export class UpdateTenantStatusUseCase extends BaseUseCase<
  UpdateTenantStatusInput,
  Result<TenantResponseDTO, Error>
> {
  constructor(private readonly repository: TenantsRepository) {
    super();
  }

  async handle(
    input: UpdateTenantStatusInput,
  ): Promise<Result<TenantResponseDTO, Error>> {
    const authError = authorizeTenantOperation(
      input.actor,
      Permission.TENANT_STATUS_UPDATE,
    );
    if (authError) return Result.fail(authError);

    TenantValidator.status(input.status);
    const tenant = await this.repository.findById(input.tenantId);
    if (!tenant)
      return Result.fail(new NotFoundError("Tenant tidak ditemukan."));

    const saved = await this.repository.update(tenant.withStatus(input.status));
    return Result.ok(TenantMapper.toDetailResponse(saved));
  }
}
