import { randomUUID } from "node:crypto";
import { Result } from "@/core/base/Result";
import { ConflictError } from "@/core/errors/ConflictError";
import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import { ValidationError } from "@/core/errors/ValidationError";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { AuthorizationError } from "@/core/rbac/AuthorizationError";
import { authorize } from "@/core/rbac/authorize";
import { Permission } from "@/core/rbac/Permission";
import { Tenant } from "@/modules/tenant/domain/Tenant";
import type {
  CreateTenantRequestDTO,
  TenantResponseDTO,
} from "@/modules/tenant/domain/TenantDTOs";
import { TenantMapper } from "@/modules/tenant/domain/TenantMapper";
import type { TenantRepository } from "@/modules/tenant/domain/TenantRepository";
import { TenantSlug } from "@/modules/tenant/domain/TenantSlug";

export interface CreateTenantInput {
  actor: AuthorizationActor | null | undefined;
  data: CreateTenantRequestDTO;
}

export class CreateTenantUseCase {
  constructor(private readonly repo: TenantRepository) {}

  async execute(input: CreateTenantInput): Promise<Result<TenantResponseDTO>> {
    try {
      authorize(input.actor, Permission.TENANT_CREATE);
    } catch (err) {
      if (
        err instanceof AuthorizationError ||
        err instanceof UnauthorizedError
      ) {
        return Result.fail(err);
      }
      throw err;
    }

    // Validate slug
    const slugResult = TenantSlug.create(input.data.slug);
    if (!slugResult.ok) {
      return Result.fail(new ValidationError(slugResult.error));
    }

    const normalizedSlug = slugResult.slug.toString();

    // Uniqueness check — slug
    const existingBySlug = await this.repo.findBySlug(normalizedSlug);
    if (existingBySlug) {
      return Result.fail(
        new ConflictError(
          `Slug '${normalizedSlug}' sudah digunakan oleh tenant lain.`,
        ),
      );
    }

    // Uniqueness check — customDomain (if provided)
    if (input.data.customDomain) {
      const existingByDomain = await this.repo.findByCustomDomain(
        input.data.customDomain,
      );
      if (existingByDomain) {
        return Result.fail(
          new ConflictError(
            `Custom domain '${input.data.customDomain}' sudah digunakan oleh tenant lain.`,
          ),
        );
      }
    }

    const now = new Date();
    const tenant = new Tenant({
      id: randomUUID(),
      slug: normalizedSlug,
      name: input.data.name.trim(),
      status: "ACTIVE",
      customDomain: input.data.customDomain ?? null,
      createdAt: now,
      updatedAt: now,
    });

    const saved = await this.repo.save(tenant);
    return Result.ok<TenantResponseDTO>(TenantMapper.toResponseDTO(saved));
  }
}
