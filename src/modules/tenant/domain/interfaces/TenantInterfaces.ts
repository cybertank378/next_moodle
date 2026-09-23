import type { Tenant } from "@/modules/tenant/domain/entity/TenantEntity";
import type { TenantListFilter } from "@/modules/tenant/domain/types/TenantMetadata";

export interface TenantCredentialPersistenceInput {
  tenantId: string;
  moodleUrl: string;
  encryptedAdminToken: string;
  encryptedProctorToken: string | null;
  timeoutBudgetMs: number;
  sslVerify: boolean;
}

export interface TenantsRepository {
  findById(id: string): Promise<Tenant | null>;
  findBySlug(slug: string): Promise<Tenant | null>;
  findByCustomDomain(customDomain: string): Promise<Tenant | null>;
  list(filter: TenantListFilter): Promise<Tenant[]>;
  count(filter: Pick<TenantListFilter, "status" | "search">): Promise<number>;
  create(tenant: Tenant): Promise<Tenant>;
  update(tenant: Tenant): Promise<Tenant>;
  delete(id: string): Promise<void>;
  upsertCredential(input: TenantCredentialPersistenceInput): Promise<Tenant>;
}

export interface TenantCredentialCipher {
  encrypt(plainText: string, tenantId: string): Promise<string>;
}
