import type { TenantStatusType } from "@/libs/enums";

export const ADMIN_DASHBOARD_DEFAULT_MONTHS = 6;
export const ADMIN_DASHBOARD_MIN_MONTHS = 1;
export const ADMIN_DASHBOARD_MAX_MONTHS = 24;
export const ADMIN_DASHBOARD_RECENT_TENANT_LIMIT = 5;

export interface TenantStatusCount {
  status: TenantStatusType;
  count: number;
}

export interface RecentTenantRecord {
  id: string;
  name: string;
  slug: string;
  status: TenantStatusType;
  createdAt: Date;
}

export interface TenantGrowthPoint {
  /** Calendar month in `YYYY-MM` (UTC). */
  period: string;
  newTenants: number;
  cumulativeTenants: number;
}

export interface TenantStatusSummary {
  total: number;
  active: number;
  maintenance: number;
  suspended: number;
}
