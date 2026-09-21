export type TenantStatus = "ACTIVE" | "MAINTENANCE" | "SUSPENDED";

export interface TenantContext {
  tenantId: string;
  tenantSlug: string;
  status: TenantStatus;
  customDomain?: string;
}
