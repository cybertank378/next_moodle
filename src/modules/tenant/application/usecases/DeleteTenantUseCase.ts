import { BaseUseCase } from "@/core/base/BaseUseCase";
import { Result } from "@/core/base/Result";
import { NotFoundError } from "@/core/errors/NotFoundError";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { Permission } from "@/core/rbac/Permission";
import { authorizeTenantOperation } from "@/modules/tenant/application/services/TenantAuthorizationService";
import type { TenantsRepository } from "@/modules/tenant/domain/interfaces/TenantInterfaces";

export interface DeleteTenantInput {
  actor: AuthorizationActor | null | undefined;
  tenantId: string;
}

export class DeleteTenantUseCase extends BaseUseCase<
  DeleteTenantInput,
  Result<{ id: string }, Error>
> {
  constructor(private readonly repository: TenantsRepository) {
    super();
  }

  async handle(
    input: DeleteTenantInput,
  ): Promise<Result<{ id: string }, Error>> {
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
