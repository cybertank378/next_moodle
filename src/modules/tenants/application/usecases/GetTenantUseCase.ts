import { Result } from "@/core/base/Result";
import { NotFoundError } from "@/core/errors/NotFoundError";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { Permission } from "@/core/rbac/Permission";
import { authorizeTenantOperation } from "@/modules/tenants/application/TenantAuthorization";
import type { TenantResponseDTO } from "@/modules/tenants/domain/dto/TenantDTOs";
import type { TenantsRepository } from "@/modules/tenants/domain/interfaces/TenantsInterfaces";
import { TenantMapper } from "@/modules/tenants/domain/mappers/TenantMapper";

export class GetTenantUseCase {
  constructor(private readonly repository: TenantsRepository) {}

  async execute(input: {
    actor: AuthorizationActor | null | undefined;
    tenantId: string;
  }): Promise<Result<TenantResponseDTO, Error>> {
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
