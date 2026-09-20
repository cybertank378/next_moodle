import type { TestTenantConnectionResponseDTO } from "@/modules/tenant/domain/dto/TestTenantConnectionResponseDTO";
import type { Tenant } from "@/modules/tenant/domain/entities/Tenant";

export interface TenantConnectionTester {
  testConnection(tenant: Tenant): Promise<TestTenantConnectionResponseDTO>;
}
