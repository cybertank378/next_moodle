import { Result } from "@/core/base/Result";
import { NotFoundError } from "@/core/errors/NotFoundError";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { Permission } from "@/core/rbac/Permission";
import { authorizeTenantOperation } from "@/modules/tenant/application/services/TenantAuthorizationService";
import type { TenantsRepository } from "@/modules/tenant/domain/interfaces/TenantInterfaces";

export class DeleteTenantUseCase {
  constructor(private readonly repository: TenantsRepository) {}

  async execute(input: {
    actor: AuthorizationActor | null | undefined;
    tenantId: string;
  }): Promise<Result<{ id: string }, Error>> {
    const authError = authorizeTenantOperation(
      input.actor,
      Permission.TENANT_UPDATE,
    );
    if (authError) return Result.fail(authError);

    const tenant = await this.repository.findById(input.tenantId);
    if (!tenant)
      return Result.fail(new NotFoundError("Tenant tidak ditemukan."));

    await this.repository.delete(input.tenantId);
    return Result.ok({ id: input.tenantId });
  }
}
