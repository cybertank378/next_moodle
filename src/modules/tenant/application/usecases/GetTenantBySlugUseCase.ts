import { NotFoundError } from "@/core/errors/NotFoundError";
import type { TenantResponseDTO } from "../../domain/dto/TenantResponseDTO";
import type { TenantRepository } from "../../domain/interfaces/TenantRepository";
import { TenantSlug } from "../../domain/value-objects/TenantSlug";

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
