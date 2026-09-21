export type TenantStatus = "ACTIVE" | "SUSPENDED" | "INACTIVE";

export interface TenantContext {
  tenantId: string;
  tenantSlug: string;
  status: TenantStatus;
  customDomain?: string;
}
