import { NotFoundError } from "@/core/errors/NotFoundError";
import type { TenantResponseDTO } from "@/modules/tenant/domain/dto/TenantResponseDTO";
import { Tenant } from "@/modules/tenant/domain/entities/Tenant";
import type { TenantRepository } from "@/modules/tenant/domain/interfaces/TenantRepository";
import type { TenantStatus } from "@/modules/tenant/domain/types/TenantStatus";
import { TenantValidator } from "@/modules/tenant/domain/validators/TenantValidator";

export interface ChangeTenantStatusInput {
  readonly tenantId: string;
  readonly status: TenantStatus;
}

export class ChangeTenantStatusUseCase {
  constructor(private readonly tenantRepository: TenantRepository) {}

  public async execute(
    input: ChangeTenantStatusInput,
  ): Promise<TenantResponseDTO> {
    const validStatus = TenantValidator.validateStatus(input.status);

    const existing = await this.tenantRepository.findById(input.tenantId);
    if (!existing) {
      throw new NotFoundError(`Tenant '${input.tenantId}' tidak ditemukan.`, {
        code: "TENANT_NOT_FOUND",
      });
    }

    const updated = new Tenant({
      id: existing.id,
      slug: existing.slug,
      name: existing.name,
      status: validStatus,
      moodleBaseUrl: existing.moodleBaseUrl,
      moodleServiceShortname: existing.moodleServiceShortname,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    await this.tenantRepository.update(updated);

    return {
      id: updated.id,
      slug: updated.slug,
      name: updated.name,
      status: updated.status,
      moodle: {
        baseUrl: updated.moodleBaseUrl,
        serviceShortname: updated.moodleServiceShortname,
        configured: true,
      },
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }
}
