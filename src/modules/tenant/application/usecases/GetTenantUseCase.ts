import { Result } from "@/core/base/Result";
import { NotFoundError } from "@/core/errors/NotFoundError";
import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { AuthorizationError } from "@/core/rbac/AuthorizationError";
import { authorize } from "@/core/rbac/authorize";
import { Permission } from "@/core/rbac/Permission";
import type { TenantResponseDTO } from "@/modules/tenant/domain/TenantDTOs";
import { TenantMapper } from "@/modules/tenant/domain/TenantMapper";
import type { TenantRepository } from "@/modules/tenant/domain/TenantRepository";

export interface GetTenantInput {
  actor: AuthorizationActor | null | undefined;
  tenantId: string;
}

export class GetTenantUseCase {
  constructor(private readonly repo: TenantRepository) {}

  async execute(input: GetTenantInput): Promise<Result<TenantResponseDTO>> {
    try {
      authorize(input.actor, Permission.TENANT_READ);
    } catch (err) {
      if (
        err instanceof AuthorizationError ||
        err instanceof UnauthorizedError
      ) {
        return Result.fail(err);
      }
      throw err;
    }

    const tenant = await this.repo.findById(input.tenantId);
    if (!tenant) {
      return Result.fail(
        new NotFoundError(`Tenant '${input.tenantId}' tidak ditemukan.`),
      );
    }

    return Result.ok<TenantResponseDTO>(TenantMapper.toResponseDTO(tenant));
  }
}
