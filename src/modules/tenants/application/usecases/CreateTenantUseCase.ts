import { Result } from "@/core/base/Result";
import { ConflictError } from "@/core/errors/ConflictError";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { Permission } from "@/core/rbac/Permission";
import { authorizeTenantOperation } from "@/modules/tenants/application/TenantAuthorization";
import { TenantBuilder } from "@/modules/tenants/domain/builders/TenantBuilder";
import type {
  CreateTenantRequestDTO,
  TenantResponseDTO,
} from "@/modules/tenants/domain/dto/TenantDTOs";
import type { TenantsRepository } from "@/modules/tenants/domain/interfaces/TenantsInterfaces";
import { TenantMapper } from "@/modules/tenants/domain/mappers/TenantMapper";
import { TenantNormalizer } from "@/modules/tenants/domain/normalizers/TenantNormalizer";

export class CreateTenantUseCase {
  constructor(private readonly repository: TenantsRepository) {}

  async execute(input: {
    actor: AuthorizationActor | null | undefined;
    data: CreateTenantRequestDTO;
  }): Promise<Result<TenantResponseDTO, Error>> {
    const authError = authorizeTenantOperation(
      input.actor,
      Permission.TENANT_CREATE,
    );
    if (authError) return Result.fail(authError);

    const slug = TenantNormalizer.slug(input.data.slug);
    if (await this.repository.findBySlug(slug)) {
      return Result.fail(new ConflictError(`Slug '${slug}' sudah digunakan.`));
    }

    const customDomain = TenantNormalizer.customDomain(input.data.customDomain);
    if (
      customDomain &&
      (await this.repository.findByCustomDomain(customDomain))
    ) {
      return Result.fail(
        new ConflictError(`Domain '${customDomain}' sudah digunakan.`),
      );
    }

    const saved = await this.repository.create(
      TenantBuilder.create({ ...input.data, slug, customDomain }),
    );
    return Result.ok(TenantMapper.toDetailResponse(saved));
  }
}
