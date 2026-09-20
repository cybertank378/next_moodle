import type { TestTenantConnectionResponseDTO } from "../dto/TestTenantConnectionResponseDTO";
import type { Tenant } from "../entities/Tenant";

export interface TenantConnectionTester {
  testConnection(tenant: Tenant): Promise<TestTenantConnectionResponseDTO>;
}
