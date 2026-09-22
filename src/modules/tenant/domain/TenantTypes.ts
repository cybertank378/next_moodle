export type TenantDomainStatus = "ACTIVE" | "MAINTENANCE" | "SUSPENDED";

export interface TenantListFilter {
  status?: TenantDomainStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface TenantListResult {
  tenants: TenantSummary[];
  total: number;
  page: number;
  pageSize: number;
}

export interface TenantSummary {
  id: string;
  slug: string;
  name: string;
  status: TenantDomainStatus;
  customDomain: string | null | undefined;
  hasMoodleCredential: boolean;
  hasBranding: boolean;
  createdAt: Date;
  updatedAt: Date;
}
