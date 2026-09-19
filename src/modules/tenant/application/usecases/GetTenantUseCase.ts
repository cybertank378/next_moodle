import { NotFoundError } from "@/core/errors/NotFoundError";
import type { TenantResponseDTO } from "../../domain/dto/TenantResponseDTO";
import type { TenantRepository } from "../../domain/interfaces/TenantRepository";

export class GetTenantUseCase {
  constructor(private readonly tenantRepository: TenantRepository) {}

  public async execute(slug: string): Promise<TenantResponseDTO> {
    const tenant = await this.tenantRepository.findBySlug(slug);
    if (!tenant) {
      throw new NotFoundError(`Tenant with slug '${slug}' not found`);
    }

    return {
      id: tenant.id,
      slug: tenant.slug,
      name: tenant.name,
      status: tenant.status,
      createdAt: tenant.createdAt.toISOString(),
    };
  }
}
