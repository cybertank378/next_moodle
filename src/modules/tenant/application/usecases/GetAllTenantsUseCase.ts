import { Result } from "@/core/base/Result";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { Permission } from "@/core/rbac/Permission";
import { authorizeTenantOperation } from "@/modules/tenant/application/services/TenantAuthorizationService";
import type { ListTenantsResponseDTO } from "@/modules/tenant/domain/dto/TenantResponseDto";
import type { TenantsRepository } from "@/modules/tenant/domain/interfaces/TenantInterfaces";
import { TenantMapper } from "@/modules/tenant/domain/mapper/TenantMapper";
import type { TenantListFilter } from "@/modules/tenant/domain/types/TenantMetadata";

export class GetAllTenantsUseCase {
  constructor(private readonly repository: TenantsRepository) {}

  async execute(input: {
    actor: AuthorizationActor | null | undefined;
    filter: Partial<TenantListFilter>;
  }): Promise<Result<ListTenantsResponseDTO, Error>> {
    const authError = authorizeTenantOperation(
      input.actor,
      Permission.TENANT_READ,
    );
    if (authError) return Result.fail(authError);

    const page = Math.max(1, input.filter.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, input.filter.pageSize ?? 10));
    const filter: TenantListFilter = {
      status: input.filter.status,
      search: input.filter.search?.trim() || undefined,
      page,
      pageSize,
    };

    const [tenants, total] = await Promise.all([
      this.repository.list(filter),
      this.repository.count({ status: filter.status, search: filter.search }),
    ]);

    return Result.ok({
      tenants: tenants.map(TenantMapper.toSummaryResponse),
      total,
      page,
      pageSize,
    });
  }
}
