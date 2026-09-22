import type { Tenant } from "./Tenant";
import type { TenantDomainStatus, TenantListFilter } from "./TenantTypes";

export interface TenantFindAllOptions {
  filter?: TenantListFilter;
}

export interface TenantRepository {
  findById(id: string): Promise<Tenant | null>;
  findBySlug(slug: string): Promise<Tenant | null>;
  findByCustomDomain(customDomain: string): Promise<Tenant | null>;
  findAll(options?: TenantFindAllOptions): Promise<Tenant[]>;
  count(options?: {
    filter?: { status?: TenantDomainStatus; search?: string };
  }): Promise<number>;
  save(tenant: Tenant): Promise<Tenant>;
  delete(id: string): Promise<void>;
}
