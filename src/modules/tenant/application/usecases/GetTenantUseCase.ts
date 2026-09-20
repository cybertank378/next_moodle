import { NotFoundError } from "@/core/errors/NotFoundError";
import type { TenantResponseDTO } from "@/modules/tenant/domain/dto/TenantResponseDTO";
import type { TenantRepository } from "@/modules/tenant/domain/interfaces/TenantRepository";

export class GetTenantUseCase {
  constructor(private readonly tenantRepository: TenantRepository) {}

  public async execute(idOrSlug: string): Promise<TenantResponseDTO> {
    let tenant = await this.tenantRepository.findById(idOrSlug);
    if (!tenant) {
      tenant = await this.tenantRepository.findBySlug(idOrSlug);
    }

    if (!tenant) {
      throw new NotFoundError(`Tenant '${idOrSlug}' tidak ditemukan.`, {
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
