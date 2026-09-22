import { Result } from "@/core/base/Result";
import { ConflictError } from "@/core/errors/ConflictError";
import { NotFoundError } from "@/core/errors/NotFoundError";
import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { AuthorizationError } from "@/core/rbac/AuthorizationError";
import { authorize } from "@/core/rbac/authorize";
import { Permission } from "@/core/rbac/Permission";
import { Tenant } from "@/modules/tenant/domain/Tenant";
import type {
  TenantResponseDTO,
  UpdateTenantRequestDTO,
} from "@/modules/tenant/domain/TenantDTOs";
import { TenantMapper } from "@/modules/tenant/domain/TenantMapper";
import type { TenantRepository } from "@/modules/tenant/domain/TenantRepository";

export interface UpdateTenantInput {
  actor: AuthorizationActor | null | undefined;
  tenantId: string;
  data: UpdateTenantRequestDTO;
}

export class UpdateTenantUseCase {
  constructor(private readonly repo: TenantRepository) {}

  async execute(input: UpdateTenantInput): Promise<Result<TenantResponseDTO>> {
    try {
      authorize(input.actor, Permission.TENANT_UPDATE);
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

    // Uniqueness check for customDomain if changing it
    if (
      input.data.customDomain !== undefined &&
      input.data.customDomain !== null &&
      input.data.customDomain !== existing.customDomain
    ) {
      const byDomain = await this.repo.findByCustomDomain(
        input.data.customDomain,
      );
      if (byDomain && byDomain.id !== existing.id) {
        return Result.fail(
          new ConflictError(
            `Custom domain '${input.data.customDomain}' sudah digunakan tenant lain.`,
          ),
        );
      }
    }

    const updated = new Tenant({
      id: existing.id,
      slug: existing.slug,
      name:
        input.data.name !== undefined ? input.data.name.trim() : existing.name,
      status: existing.status,
      customDomain:
        input.data.customDomain !== undefined
          ? input.data.customDomain
          : existing.customDomain,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
      credential: existing.credential,
      branding: existing.branding,
    });

    const saved = await this.repo.save(updated);
    return Result.ok<TenantResponseDTO>(TenantMapper.toResponseDTO(saved));
  }
}
