import { NotFoundError } from "@/core/errors/NotFoundError";
import type { TenantResponseDTO } from "@/modules/tenant/domain/dto/TenantResponseDTO";
import type { TenantRepository } from "@/modules/tenant/domain/interfaces/TenantRepository";
import { TenantSlug } from "@/modules/tenant/domain/value-objects/TenantSlug";

export class GetTenantBySlugUseCase {
  constructor(private readonly tenantRepository: TenantRepository) {}

  public async execute(slug: string): Promise<TenantResponseDTO> {
    const canonicalSlug = TenantSlug.normalize(slug);
    const tenant = await this.tenantRepository.findBySlug(canonicalSlug);

    if (!tenant) {
      throw new NotFoundError(`Tenant dengan slug '${slug}' tidak ditemukan.`, {
        code: "TENANT_NOT_FOUND",
      });
    }

    return {
      id: tenant.id,
      slug: tenant.slug,
      name: tenant.name,
      status: tenant.status,
      moodle: {
        baseUrl: tenant.moodleBaseUrl,
        serviceShortname: tenant.moodleServiceShortname,
        configured: true,
      },
      createdAt: tenant.createdAt.toISOString(),
      updatedAt: tenant.updatedAt.toISOString(),
    };
  }
}
