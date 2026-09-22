import { Result } from "@/core/base/Result";
import { NotFoundError } from "@/core/errors/NotFoundError";
import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { AuthorizationError } from "@/core/rbac/AuthorizationError";
import { authorize } from "@/core/rbac/authorize";
import { Permission } from "@/core/rbac/Permission";
import { Tenant } from "@/modules/tenant/domain/Tenant";
import type { TenantResponseDTO } from "@/modules/tenant/domain/TenantDTOs";
import { TenantMapper } from "@/modules/tenant/domain/TenantMapper";
import type { TenantRepository } from "@/modules/tenant/domain/TenantRepository";
import type { TenantDomainStatus } from "@/modules/tenant/domain/TenantTypes";

export interface UpdateTenantStatusInput {
  actor: AuthorizationActor | null | undefined;
  tenantId: string;
  status: TenantDomainStatus;
}

export class UpdateTenantStatusUseCase {
  constructor(private readonly repo: TenantRepository) {}

  async execute(
    input: UpdateTenantStatusInput,
  ): Promise<Result<TenantResponseDTO>> {
    try {
      authorize(input.actor, Permission.TENANT_STATUS_UPDATE);
    } catch (err) {
      if (
        err instanceof AuthorizationError ||
        err instanceof UnauthorizedError
      ) {
        return Result.fail(err);
      }
      throw err;
    }

    const existing = await this.repo.findById(input.tenantId);
    if (!existing) {
      return Result.fail(
        new NotFoundError(`Tenant '${input.tenantId}' tidak ditemukan.`),
      );
    }

    const updated = new Tenant({
      id: existing.id,
      slug: existing.slug,
      name: existing.name,
      status: input.status,
      customDomain: existing.customDomain,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
      credential: existing.credential,
      branding: existing.branding,
    });

    const saved = await this.repo.save(updated);
    return Result.ok<TenantResponseDTO>(TenantMapper.toResponseDTO(saved));
  }
}
