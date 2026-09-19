export type TenantStatus = "ACTIVE" | "INACTIVE";

export interface TenantContext {
  readonly tenantId: string;
  readonly slug: string;
  readonly status: TenantStatus;
}
