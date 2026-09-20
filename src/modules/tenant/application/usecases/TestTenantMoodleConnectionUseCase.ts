import { NotFoundError } from "@/core/errors/NotFoundError";
import type { TestTenantConnectionResponseDTO } from "../../domain/dto/TestTenantConnectionResponseDTO";
import type { TenantConnectionTester } from "../../domain/interfaces/TenantConnectionTester";
import type { TenantRepository } from "../../domain/interfaces/TenantRepository";

export class TestTenantMoodleConnectionUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly connectionTester: TenantConnectionTester,
  ) {}

  public async execute(
    tenantId: string,
  ): Promise<TestTenantConnectionResponseDTO> {
    const tenant = await this.tenantRepository.findById(tenantId);
    if (!tenant) {
      throw new NotFoundError(`Tenant '${tenantId}' tidak ditemukan.`, {
        code: "TENANT_NOT_FOUND",
      });
    }

    return this.connectionTester.testConnection(tenant);
  }
}
