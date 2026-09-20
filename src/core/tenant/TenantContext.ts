export type TenantStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface TenantContext {
  readonly tenantId: string;
  readonly slug: string;
  readonly name: string;
  readonly status: TenantStatus;
}
