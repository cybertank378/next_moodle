import { BaseUseCase } from "@/core/base/BaseUseCase";
import { Result } from "@/core/base/Result";
import { NotFoundError } from "@/core/errors/NotFoundError";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { Permission } from "@/core/rbac/Permission";
import { authorizeTenantOperation } from "@/modules/tenant/application/services/TenantAuthorizationService";
import type { TenantResponseDTO } from "@/modules/tenant/domain/dto/TenantResponseDto";
import type { TenantsRepository } from "@/modules/tenant/domain/interfaces/TenantInterfaces";
import { TenantMapper } from "@/modules/tenant/domain/mapper/TenantMapper";

export interface GetTenantByIdInput {
  actor: AuthorizationActor | null | undefined;
  tenantId: string;
}

export class GetTenantByIdUseCase extends BaseUseCase<
  GetTenantByIdInput,
  Result<TenantResponseDTO, Error>
> {
  constructor(private readonly repository: TenantsRepository) {
    super();
  }

  async handle(
    input: GetTenantByIdInput,
  ): Promise<Result<TenantResponseDTO, Error>> {
    const authError = authorizeTenantOperation(
      input.actor,
      Permission.TENANT_READ,
    );
    if (authError) return Result.fail(authError);

    const tenant = await this.repository.findById(input.tenantId);
    if (!tenant)
      return Result.fail(new NotFoundError("Tenant tidak ditemukan."));
    return Result.ok(TenantMapper.toDetailResponse(tenant));
  }
}
