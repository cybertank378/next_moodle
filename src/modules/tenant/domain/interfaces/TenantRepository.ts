import type { Tenant } from "@/modules/tenant/domain/entities/Tenant";

export interface TenantRepository {
  findById(tenantId: string): Promise<Tenant | null>;
  findBySlug(slug: string): Promise<Tenant | null>;
  create(tenant: Tenant): Promise<Tenant>;
  update(tenant: Tenant): Promise<Tenant>;
  existsBySlug(slug: string): Promise<boolean>;
}
